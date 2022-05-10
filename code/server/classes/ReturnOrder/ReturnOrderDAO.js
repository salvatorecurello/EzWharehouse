const ReturnOrder = require('./ReturnOrder');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class ReturnOrderDAO {
	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
	}

	///CREATE
	async store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT issueDate FROM RestockOrder WHERE id = ?;';
			let id = parseInt(data.restockOrderId);

			if (!id)
				return reject("Wrong data");

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else
					resolve(row.issuedate);
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT restockOrderId, skuItemId, skuId FROM Product p, SKUItemsRestockOrder so WHERE p.orderId = so.restockOrderId AND skuId = ? AND so.restockOrderId = ?;';
				
				try{
					data.products.forEach((p) => {
						this.db.all(sql, [data.restockOrderId, p.SKUId], (err, rows) => {
							if (err)
								throw err;
							else if (rows == null)
								throw "Wrong data";
						});
					});
				}
				catch(err){
					return reject(err);
				}

				return resolve(res);
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO ReturnOrder(RETURNDATE, RESTOCKORDERID) VALUES(?, ?);';
				const returnDate = dayjs(data.returnDate);
				const issueDate = dayjs(res);

				if (!returnDate || returnDate.isBefore(issueDate))
					return reject("Wrong data");

				this.db.run(sql, [data.returnDate, data.restockOrderId], (err) => {
					if (err)
						reject(err);
					else
						resolve(this.lastID);
				});
			});
		});
	}

	//READ
	async getAll() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, returnDate, restockOrderId FROM ReturnOrder;';

			this.db.all(sql, [], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else {
					if (rows != null)
						rows.forEach((row) => {
							res.push(new ReturnOrder(row.id, row.returndate, row.restockorderid));
						});

					resolve(res);
				}
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, description, price, rfid FROM Product p, SKUItem s, SKUItemsRestockOrder so, TestResult t WHERE p.orderId = so.restockOrderId AND s.rfid = so.skuItemId AND s.rfid = t.skuItemId AND result = 0 AND p.orderId = ?;';
				let data = [];

				try {
					res.forEach((order) => {
						this.db.all(sql, [order.restockOrderId], (err, rows) => {
							if (err)
								throw err;
							else
								if (rows != null)
									rows.forEach((row) => {
										order.pushProducts(row);

										data.push(order.toDict());
									});
						});
					});
				}
				catch (err) {
					return reject(err);
				}

				return resolve(data);
			});
		});
	}
	async get(id) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, returnDate, restockOrderId FROM ReturnOrder WHERE id = ?;';
			id = parseInt(id);

			if (!id)
				return reject("Wrong data");

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else
					resolve(new ReturnOrder(row.id, row.returndate, row.restockOrderId));
			});
		}).then((order) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, description, price, rfid FROM Product p, SKUItem s, SKUItemsRestockOrder so, TestResult t WHERE p.orderId = so.restockOrderId AND s.rfid = so.skuItemId AND s.rfid = t.skuItemId AND result = 0 AND p.orderId = ?;';

				this.db.all(sql, [order.restockOrderId], (err, rows) => {
					if (err)
						reject(err);
					else {
						if (rows != null)
							rows.forEach((row) => {
								order.pushProducts({
									SKUId: row.skuid,
									description: row.description,
									price: row.price,
									RFID: row.rfid
								});
							});
						
						resolve(order.toDict());
					}
				});
			});
		});
	}


	delete(id) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM ReturnOrder WHERE id = ?;';

			this.db.run(sql, [id], (err) => {
				if (err)
					reject(err);
				else
					resolve(this.changes);
			});
		});
	}
}

module.exports = ReturnOrderDAO;