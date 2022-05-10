const RestockOrder = require('./RestockOrder');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class RestockOrderDAO {
	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
	}

	//CREATE
	async store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO RestockOrder(ISSUEDATE, STATE, SUPPLIERID) VALUES(?, "ISSUED", ?);';

			if (!dayjs(data.issueDate).isValid() || !parseInt(data.supplierId))
				return reject("Wrong data");

			this.db.run(sql, [data.issueDate, data.supplierId], function (err) {
				if (err)
					reject(err);
				else
					resolve(this.lastID);
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO Product(ORDERID, SKUID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?, ?);';

				try {
					data.products.forEach((p) => {
						if (!parseInt(p.SKUId) || !(typeof p.description == 'string') || !parseFloat(p.price) || !parseInt(p.qty))
							throw "Wrong data";

						this.db.run(sql, [res, p.SKUId, p.description, p.price, p.qty], function (err) {
							if (err)
								throw err;
						});
					});
				}
				catch (err) {
					this.delete(res).catch((r) => console.log(r));

					return reject(err);
				}

				return resolve(res);
			});
		});
	}

	//Ausiliary functions
	getOrder(id) {
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
		});
	}
	getProducts(orders) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT skuId, description, price, qty FROM Product WHERE orderId = ?;';

			try {
				orders.forEach((order) => {
					this.db.all(sql, [order.Id], (err, rows) => {
						if (err)
							throw err;
						else if (rows != null)
							rows.forEach((row) => {
								order.pushProducts({
									SKUId: row.skuid,
									description: row.description,
									price: row.price,
									qty: row.qty
								});
							});
					});
				});
			}
			catch (err) {
				return reject(err);
			}

			return resolve(orders);
		});
	}
	getDeliveryInfo(orders) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT skuId, rfid, key, note FROM SKUItem s, SKUItemsRestockOrder so, TransportNote tn WHERE so.restockOrderId = tn.orderId AND s.rfid = so.skuItemId AND so.restockOrderId = ?;';

			try {
				orders.forEach((order) => {
					this.db.all(sql, [order.Id], (err, rows) => {
						if (err)
							throw err;
						else if (rows != null)
							rows.forEach((row) => {
								order.pushSkuItems({
									SKUId: row.skuid,
									rfid: row.rfid
								});

								order.setTransportNote(row.key, row.note);
							});
					});
				});
			}
			catch (err) {
				return reject(err);
			}

			return resolve(orders);
		});
	}
	formatOrders(orders) {
		return new Promise((resolve, reject) => {
			let res = [];

			orders.forEach((order) => res.push(order.toDict()));

			resolve(res);
		});
	}

	//READ
	async getAll() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder;';

			this.db.all(sql, [], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else {
					if (rows != null)
						rows.forEach((row) => {
							console.log(row);
							res.push(new RestockOrder(row));});

					resolve(res)
				}
			});
		}).then((res) =>
			this.getProducts(res)
		).then((res) =>
			this.getDeliveryInfo(res)
		).then((res) =>
			this.formatOrders(res)
		);
	}
	async getIssued() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder WHERE state = "ISSUED";';

			this.db.all(sql, [], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else {
					if (rows != null)
						rows.forEach((row) => res.push(new RestockOrder(row)));

					resolve(res)
				}
			});
		}).then((res) =>
			this.getProducts(res)
		).then((res) =>
			this.formatOrders(res)
		);
	}
	async get(id) {
		return this.getOrder(id).then((res) =>
			this.getProducts(res)
		).then((res) =>
			this.getDeliveryInfo(res)
		).then((res) => {
			return new Promise((resolve, reject) => {
				let data = res.toDict();
				delete data.id;

				resolve(data);
			});
		}
		);
	}
	async getReturnItems(id) {
		return this.getOrder(id).then((order) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT rfid, skuId FROM SKUItem s, TestResult t, SKUItemsRestockOrder so WHERE s.rfid = t.skuItemId AND s.rfid = so.skuItemId AND orderId = ? AND result = 0;';

				if (["ISSUED", "DELIVERY", "DELIVERED"].includes(order.state))
					return reject("Wrong data");

				this.db.all(sql, [order.id], (err, rows) => {
					let res = [];

					if (err)
						reject(err);
					else if (rows == null)
						reject("No match");
					else {
						rows.forEach((row) => {
							res.push({
								"SKUId": row.skuid,
								"rfid": row.rfid
							});
						});

						resolve(res);
					}
				});
			});
		});
	}

	//UPDATE
	setState(id, state) {
		return new Promise((resolve, reject) => {
			const sql = 'UPDATE RestockOrder SET state = ? WHERE ID = ?;';
			id = parseInt(id);

			if (!id || !["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"].includes(state))
				return reject("Wrong data");

			this.db.run(sql, [state, id], function (err) {
				if (err)
					reject(err);
				else if (this.changes == 0)
					reject("No match");
				else
					resolve(this.changes);
			});
		});
	}
	async setSkuItems(id, skuItems) {
		return this.getOrder(id).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT COUNT(*) as num FROM SKUItem WHERE rfid = ? AND skuId = ?;';

				if (["ISSUED", "DELIVERY"].includes(res.state))
					return reject("Wrong data");

				try {
					skuItems.forEach((s) => {
						let skuId = parseInt(s.SKUId);

						if (!(s.rfid instanceof string) || !skuId)
							throw "Wrong data";

						this.db.get(sql, [s.rfid, skuId], (err, row) => {
							if (err)
								throw err;
							else if (row.num == 0)
								throw "Wrong data";
						});
					});
				}
				catch (err) {
					return reject(err);
				}

				return resolve();
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO SKUItemsRestockOrder(RESTOCKORDERID, SKUITEMID) VALUES(?, ?);';

				try {
					skuItems.forEach((s) => {
						this.db.run(sql, [id, s.rfid], (err) => {
							if (err)
								throw err;
						});
					});
				}
				catch (err) {
					return reject(err);
				}

				return resolve(skuItems.length);
			});
		});
	}
	async setTransportNote(id, transportNote) {
		return this.getOrder(id).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO TransportNote(ORDERID, KEY, NOTE) VALUES(?, ?, ?);';
				let keys = Object.keys(transportNote);
				let issueDate = dayjs(res.issueDate);
				let deliveryDate = dayjs(transportNote.deliveryDate);

				if (["ISSUED"].includes(res.state) || !deliveryDate || deliveryDate.isBefore(issueDate))
					return reject("Wrong data");

				try {
					keys.forEach((key) => {
						this.db.run(sql, [id, key, transportNote[key]], (err) => {
							if (err)
								throw err;
						});
					});
				}
				catch (err) {
					return reject(err);
				}

				return resolve(keys.length);
			});
		});
	}

	//DELETE
	delete(data) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM RestockOrder WHERE id = ?; DELETE FROM SKUItemsRestockOrder WHERE restockOrderId = ?; DELETE FROM Product WHERE orderId = ?; DELETE FROM TransportNote WHERE orderId = ?';
			let id = parseInt(data);

			if (!id)
				return reject("Wrong data");

			this.db.run(sql, [id, id, id, id], function (err) {
				if (err)
					reject(err);
				else if (this.changes == 0)
					reject("No match");
				else
					resolve(this.changes);
			});
		});
	}
}

module.exports = RestockOrderDAO;