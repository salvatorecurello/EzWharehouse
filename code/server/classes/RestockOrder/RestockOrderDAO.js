const RestockOrder = require('./RestockOrder');
const sqlite = require('sqlite3');

class RestockOrderDAO {

	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
	}

	async store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO RestockOrder(ISSUEDATE, STATE, SUPPLIERID) VALUES(?, "ISSUED", ?);';

			if (!Date.parse(data.issueDate) || !parseInt(data.supplierID))
				return reject("Wrong data");

			this.db.run(sql, [data.issueDate, data.supplierID], function (err) {
				if (err)
					reject(err);
				else
					resolve(this.lastID);
			});
		}).then(async (res) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO Product(ORDERID, SKUID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?, ?);';

				for (let p of data.products) {
					if (!parseInt(p.SKUId) || !(p.description instanceof String) || !parseFloat(p.price) || !parseInt(p.qty))
						return reject({ "reason": "Wrong data", "id": res });

					this.db.run(sql, [res, p.SKUId, p.description, p.price, p.qty], (err) => {
						if (err)
							res = null;
					});

					if (!res)
						return reject({ "reason": err, "id": res });

				};

				return resolve();
			}).catch((res) => {
				return new Promise((resolve, reject) => {
					this.delete(res.id);
					reject(res.reason);
				});
			});
		});
	}


	async getAll() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder;';

			this.db.all(sql, [], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else if (rows == null)
					reject("No match");
				else {
					for (let row of rows)
						res.push(new RestockOrder(row));

					resolve(res)
				}
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, description, price, qty FROM Product WHERE orderId = ?;';

				for (const r of res)
					this.db.all(sql, [r.ID], (err, rows) => {
						if (err)
							reject(err);
						else {
							if (rows != null)
								for (let row of rows)
									r.pushProducts({
										"SKUId": row.skuid,
										"description": row.description,
										"price": row.price,
										"qty": row.qty
									});
						}
					});

				resolve(res);
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, rfid, key, note FROM SKUItem s, SKUItemsRestockOrder so, TransportNote tn WHERE so.restockOrderId = tn.orderId AND res.rfid = so.skuItemId AND so.restockOrderId = ?;';

				for (const r of res)
					this.db.all(sql, [res.ID], (err, rows) => {
						if (err)
							reject(err);
						else {
							if (rows != null) {
								for (let row of rows) {
									r.pushSkuItems({
										"SKUId": row.skuid,
										"rfid": row.rfid
									});

									res.setTransportNote(row.key, row.note);
								}
							}
						}
					});

				resolve(res);
			});
		});
	}

	async getIssued() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder WHERE state = "ISSUED";';

			this.db.all(sql, [], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else if (rows == null)
					reject("No match");
				else {
					for (let row of rows)
						res.push(new RestockOrder(row));

					resolve(res)
				}
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, description, price, qty FROM Product WHERE orderId = ?;';

				this.db.all(sql, [res.ID], (err, rows) => {
					if (err)
						reject(err);
					else {
						if (rows != null)
							for (let row of rows)
								res.pushProducts({
									"SKUId": row.skuid,
									"description": row.description,
									"price": row.price,
									"qty": row.qty
								});

						resolve(res);
					}
				});
			});
		});
	}

	async get(id) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder WHERE id = ?;';
			id = parseInt(id);

			if (!id)
				return reject("Wrong data");

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else
					resolve(new RestockOrder(row));
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, description, price, qty FROM Product WHERE orderId = ?;';

				this.db.each(sql, [res.ID], (err, row) => {
					if (err)
						reject(err);
					else {
						if (row != null)
							res.pushProducts({
								"SKUId": row.skuid,
								"description": row.description,
								"price": row.price,
								"qty": row.qty
							});

						resolve(res);
					}
				});
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, rfid FROM SKUItem s, SKUItemsRestockOrder so WHERE s.rfid = so.skuItemId AND restockOrderId = ?;';

				this.db.each(sql, [res.ID], (err, row) => {
					if (err)
						x = err;
					else if (row == null)
						x = "No match";
					else {
						res.pushSkuItems({
							"SKUId": row.skuid,
							"rfid": row.rfid
						});

						//TransportNote
					}
				});

				if (x)
					reject(x);
				else
					resolve(res);
			});
		});
	}

	async getReturnItems(id) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id FROM RestockOrder WHERE id = ? AND state = "TESTED";';
			id = parseInt(id);

			if (!id)
				return reject("Wrong data");

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else
					resolve(row.id);
			});
		}).then((id) => {
			const sql = 'SELECT rfid, skuId FROM SKUItem s, TestResult t, SKUItemsRestockOrder so WHERE s.rfid = t.skuItemId AND s.rfid = so.skuItemId AND orderId = ? AND result = 0;';

			this.db.all(sql, [id], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else if (rows == null)
					reject("No match");
				else {
					for (let row of rows)
						res.push({
							"SKUId": r.skuid,
							"rfid": r.rfid
						});

					resolve(res);
				}
			});
		});
	}


	setState(id, state) {
		return new Promise((resolve, reject) => {
			const sql = 'UPDATE RestockOrder SET state = ? WHERE ID = ?;';

			this.db.run(sql, [state, id], (err) => {
				if (err)
					reject({ "error": true, "res": err });
				else
					resolve({ "error": false, "res": this.changes });
			});
		});
	}

	setSkuItems(id, skuItems) {
		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO SKUItemsRestockOrder(RESTOCKORDERID, SKUITEMID) VALUES(?, ?);';

			for (s in skuItems)
				this.db.run(sql, [id, s.rfid], (err) => {
					if (err)
						reject({ "error": true, "res": err });
					else
						resolve({ "error": false, "res": this.changes });
				});
		});
	}

	setTransportNote(id, transportNote) {
		//missing table
	}


	delete(id) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM RestockOrder WHERE id = ?; DELETE FROM SKUItemsRestockOrder WHERE restockOrderId = ?; DELETE FROM Product WHERE orderId = ?';
			id = parseInt(id);

			if (!id)
				return reject("Wrong data");

			this.db.run(sql, [id, id, id], function (err) {
				if (err)
					reject(err);
				else if (this.changes == 0)
					reject("No match");
				else
					resolve();
			});
		});
	}
}

module.exports = RestockOrderDAO;