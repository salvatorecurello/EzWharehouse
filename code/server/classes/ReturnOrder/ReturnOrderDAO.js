/*
    Date:		11/05/2022
    Version:	1.0v
    Author:		Riela Giovanni
*/

const ReturnOrder = require('./ReturnOrder');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class ReturnOrderDAO {
	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
	}

	//Ausiliary functions
	checkProductsR(orderId, issueDate, products, i) {
		if (i >= products.length)
			return new Promise((resolve, reject) => {
				resolve(issueDate);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT COUNT(*) as num FROM SKUItem s, SKUItemsRestockOrder so WHERE s.rfid = so.skuItemId AND orderId = ? AND skuId = ? AND rfid = ?;';

			this.db.get(sql, [orderId, products[i].SKUId, products[i].rfid], (err, row) => {
				if (err)
					reject(err);
				else if (row.NUM == 0)
					reject("Wrong data");
				else
					resolve();
			});
		}).then(() => this.checkProductsR(orderId, issueDate, products, i + 1));
	}
	getReturnItemsR(orders, i) {
		if(i >= orders.length)
			return new Promise((resolve, reject) => {
				let res = [];

				orders.forEach((order) => {
					res.push(order.toDict())
				});

				resolve(res);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT DISTINCT skuId, description, price, rfid FROM Product p, SKUItem s, SKUItemsRestockOrder so, TestResult t WHERE p.orderId = so.restockOrderId AND s.rfid = so.skuItemId AND s.rfid = t.skuItemId AND result = 0 AND p.orderId = ?;';

			this.db.all(sql, [orders[i].restockOrderId], (err, rows) => {
				let res = [];

				if (err)
					reject(err);
				else {
					if (rows != null)
						rows.forEach((row) => {
							orders[i].pushProducts(row);
						});
					
					resolve();
				}
			});
		}).then(() => this.getReturnItemsR(orders, i + 1));
	}

	//CREATE
	async store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT issueDate FROM RestockOrder WHERE id = ?;';

			if (!parseInt(data.restockOrderId) || !data.products)
				return reject("Wrong data");

			this.db.get(sql, [data.restockOrderId], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else
					resolve(row.ISSUEDATE);
			});
		}).then((res) =>
			this.checkProductsR(data.restockOrderId, res, data.products, 0)
		).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO ReturnOrder(RETURNDATE, RESTOCKORDERID) VALUES(?, ?);';
				const returnDate = dayjs(data.returnDate);
				const issueDate = dayjs(res);

				if (!returnDate || returnDate.isBefore(issueDate))
					return reject("Wrong data");

				this.db.run(sql, [returnDate.unix(), data.restockOrderId], (err) => {
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
		}).then((res) =>
			this.getReturnItemsR(res, 0)
		);
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
								order.pushProducts(row);
							});

						resolve(order.toDict());
					}
				});
			});
		});
	}

	//DELETE
	delete(id) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM ReturnOrder WHERE id = ?;';
			id = parseInt(id);

			if (!id)
				return reject("Wrong data");

			this.db.run(sql, [id], function (err) {
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

module.exports = ReturnOrderDAO;