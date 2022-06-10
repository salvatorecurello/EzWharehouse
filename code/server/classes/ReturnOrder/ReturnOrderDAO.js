const ReturnOrder = require('./ReturnOrder');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class ReturnOrderDAO {
	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
		this.db.get("PRAGMA busy_timeout = 10000");
	}

	//Ausiliary functions
	checkProductsR(orderId, issueDate, products, i) {
		if (i >= products.length)
			return new Promise((resolve, reject) => {
				resolve(issueDate);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT COUNT(*) as num FROM SKUItemsRestockOrder WHERE restockOrderId = ? AND skuId = ? AND skuItemId = ? AND itemId = ?;';

			this.db.get(sql, [orderId, products[i].SKUId, products[i].RFID, products[i].itemId], (err, row) => {
				if (err){
					reject(err);
				}else if (row.num == 0){
					reject("Wrong data");
				}else
					resolve();
			});
		}).then(() => this.checkProductsR(orderId, issueDate, products, i + 1));
	}
	getReturnItemsR(orders, i) {
		if (i >= orders.length)
			return new Promise((resolve, reject) => {
				let res = [];

				orders.forEach((order) => {
					res.push(order.toDict())
				});

				resolve(res);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT DISTINCT s.skuId, s.itemId, description, price, s.skuItemId FROM Product p, SKUItemsRestockOrder s, TestResult t WHERE p.orderId = s.restockOrderId AND s.skuItemId = t.skuItemId AND result = 0 AND restockOrderId = ?;';

			this.db.all(sql, [orders[i].RestockOrderId], (err, rows) => {
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

			if (!data || !parseInt(data.restockOrderId) || !data.products)
				return reject("Wrong data");

			this.db.get(sql, [data.restockOrderId], (err, row) => {
				if (err)
					reject(err);
				else if (row == null){
					reject("No match");
				}
				else
					resolve(row.ISSUEDATE);
			});
		})/*.then((res) =>
			this.checkProductsR(data.restockOrderId, res, data.products, 0)
		)*/.then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO ReturnOrder(RETURNDATE, RESTOCKORDERID) VALUES(?, ?);';
				const returnDate = dayjs(data.returnDate);
				const issueDate = dayjs.unix(res);

				if (!returnDate.isValid() /*|| returnDate.isBefore(issueDate)*/)
					return reject("Wrong data");

				this.db.run(sql, [returnDate.unix(), data.restockOrderId], function (err) {
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
							res.push(new ReturnOrder(row));
						});

					resolve(res);
				}
			});
		}).then((res) =>
			this.getReturnItemsR(res, 0)
		);
	}
	async get(orderId) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, returnDate, restockOrderId FROM ReturnOrder WHERE id = ?;';
			let id = parseInt(orderId);

			if (!id)
				return reject("Wrong data");

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else
					resolve(new ReturnOrder(row));
			});
		}).then((order) =>
			this.getReturnItemsR([order], 0)
		).then((res) => {
			let data = res[0];
			delete data.id;

			return data;
		});
	}

	//DELETE
	delete(data) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM ReturnOrder WHERE id = ?;';
			let id = parseInt(data);

			if (!id)
				return reject("Wrong data");

			this.db.run(sql, [id], function (err) {
				if (err)
					reject(err);
				else if (this.changes == 0)
					reject("No match");
				else
					resolve(id);
			});
		});
	}
}

module.exports = ReturnOrderDAO;