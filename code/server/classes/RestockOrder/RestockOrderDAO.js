const RestockOrder = require('./RestockOrder');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class RestockOrderDAO {
	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
		this.db.get("PRAGMA busy_timeout = 10000");
	}

	//Ausiliary methods
	insertProductsR(orderId, products, i) {
		if (i >= products.length)
			return new Promise((resolve, reject) => {
				resolve(orderId);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT id FROM SKU WHERE id = ?';
			let p = products[i];

			if (!parseInt(p.SKUId))
				return reject("Wrong data");

			this.db.get(sql, [p.SKUId], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("Wrong data");
				else
					resolve(p);
			});
		}).then((p) => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO Product(ORDERID, SKUID, ITEMID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?, ?, ?);';

				if (!(typeof p.description == 'string') || !parseFloat(p.price) || !parseInt(p.qty))
					return reject("Wrong data");

				this.db.run(sql, [orderId, p.SKUId, p.itemId, p.description, p.price, p.qty], function (err) {
					if (err)
						reject(err);
					else
						resolve();
				});
			});
		}).then(() =>
			this.insertProductsR(orderId, products, i + 1)
		).catch((res) => {
			return new Promise((resolve, reject) => {
				if (res == "Wrong data")
					this.delete(orderId).catch((err) => console.log(err));

				reject(res);
			});
		});
	}
	getOrder(orderId) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder WHERE id = ?;';
			let id = parseInt(orderId);

			if (!id){
				return reject("Wrong data");
			}
			this.db.get(sql, [id], (err, row) => {
				let res = [];

				if (err)
					reject(err);
				else if (row == null)
					reject("No match");
				else {
					res.push(new RestockOrder(row));

					resolve(res);
				}
			});
		});
	}
	getProductsR(orders, i) {
		if (i >= orders.length)
			return new Promise((resolve, reject) => {
				resolve(orders);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT skuId, itemId, description, price, qty FROM Product WHERE orderId = ?;';

			this.db.all(sql, [orders[i].Id], (err, rows) => {
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
		}).then(() => this.getProductsR(orders, i + 1));
	}
	getDeliveryInfoR(orders, i) {
		if (i >= orders.length)
			return new Promise((resolve, reject) => {
				resolve(orders);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT key, note FROM TransportNote WHERE orderId = ?;';

			this.db.all(sql, [orders[i].Id], (err, rows) => {
				if (err)
					reject(err);
				else {
					if (rows != null)
						rows.forEach((row) =>
							orders[i].setTransportNote(row.KEY, row.NOTE)
						);

					resolve();
				}
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT skuId, itemId, skuItemId FROM SKUItemsRestockOrder WHERE restockOrderId = ?;';

				this.db.all(sql, [orders[i].Id], (err, rows) => {
					if (err)
						reject(err);
					else {
						if (rows != null)
							rows.forEach((row) =>
								orders[i].pushSkuItems(row)
							);

						resolve();
					}
				});
			});
		}).then(() => this.getDeliveryInfoR(orders, i + 1));
	}
	formatOrders(orders) {
		return new Promise((resolve, reject) => {
			let res = [];

			orders.forEach((order) => res.push(order.toDict()));

			resolve(res);
		});
	}
	checkSKUItemsR(orderId, skuItems, i) {
		if (i >= skuItems.length)
			return new Promise((resolve, reject) => {
				resolve(orderId);
			});

		return new Promise((resolve, reject) => {
			const sql = 'SELECT COUNT(*) as num FROM Item WHERE id = ? AND skuId = ?;';
			let itemId = parseInt(skuItems[i].itemId);
			let skuId = parseInt(skuItems[i].SKUId);

			if (!skuId || !itemId){
				reject("Wrong data");				
			}

			this.db.get(sql, [itemId, skuId], (err, row) => {
				if (err)
					reject(err);
				else if (row.num == 0)
					reject("Wrong data");
				else
					resolve();
			});
		})/*.then(() => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT COUNT(*) as num FROM SKUItem WHERE rfid = ?';

				if (!(typeof skuItems[i].rfid == 'string')){
					return reject("Wrong data");
				}

				this.db.get(sql, [skuItems[i].rfid], (err, row) => {
					if (err){
						reject(err);
/*					}else if (row.num != 0){
						console.log("sono qui e");
						reject("Wrong data");
					}else
						resolve();
				});
			});
		})*/.then(() => this.checkSKUItemsR(orderId, skuItems, i + 1));
	}
	checkSKUItems(order, skuItems) {
		if (order.State != 2 || skuItems == undefined)
			return new Promise((resolve, reject) => {
				reject("Wrong data");
			});

		return this.checkSKUItemsR(order.Id, skuItems, 0);
	}
	insertSKUItemsR(orderId, skuItems, i) {
		if (i >= skuItems.length)
			return new Promise((resolve, reject) => {
				resolve(orderId);
			});

		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO SKUItemsRestockOrder(RESTOCKORDERID, SKUITEMID, SKUID, ITEMID) VALUES(?, ?, ?, ?);';
			let s = skuItems[i];

			this.db.run(sql, [orderId, s.rfid, s.SKUId, s.itemId], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		}).then(() => this.insertSKUItemsR(orderId, skuItems, i + 1));
	}
	insertTransportNoteR(orderId, transportNote, i) {
		if (i >= Object.keys(transportNote).length)
			return new Promise((resolve, reject) => {
				resolve(orderId);
			});

		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO TransportNote(ORDERID, KEY, NOTE) VALUES(?, ?, ?);';
			let key = Object.keys(transportNote)[i];

			this.db.run(sql, [orderId, key, transportNote[key]], (err) => {
				if (err)
					reject(err);
				else
					resolve()
			});
		}).then(() => this.insertTransportNoteR(orderId, transportNote, i + 1));
	}
	insertTransportNote(order, transportNote) {
		if (order.State != 1 || transportNote == undefined)
			return new Promise((resolve, reject) => {
				reject("Wrong data");
			});
		let issueDate = dayjs(order.IssueDate);
		let deliveryDate = dayjs(transportNote.deliveryDate);

		if (!deliveryDate.isValid() || deliveryDate.isBefore(issueDate) || transportNote == undefined)
			return new Promise((resolve, reject) => {
				reject("Wrong data");
			});

		return this.insertTransportNoteR(order.Id, transportNote, 0);
	}

	//CREATE
	async store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id FROM User WHERE type = "supplier" and id = ?';

			if (!data || !parseInt(data.supplierId))
				return reject("Wrong data");

			this.db.get(sql, [data.supplierId], (err, row) => {
				if (err)
					reject(err);
				else if (row == null)
					reject("Wrong data");
				else
					resolve();
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				const sql = 'INSERT INTO RestockOrder(ISSUEDATE, STATE, SUPPLIERID) VALUES(?, 1, ?);';
				let issueDate = dayjs(data.issueDate);

				if (!issueDate.isValid() || !data.products)
					return reject("Wrong data");

				this.db.run(sql, [issueDate.unix(), data.supplierId], function (err) {
					if (err)
						reject(err);
					else
						resolve(this.lastID);
				});
			})
		}).then((res) => this.insertProductsR(res, data.products, 0));
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
							res.push(new RestockOrder(row));
						});

					resolve(res)
				}
			});
		}).then((res) =>
			this.getProductsR(res, 0)
		).then((res) =>
			this.getDeliveryInfoR(res, 0)
		).then((res) =>
			this.formatOrders(res)
		);
	}
	async getIssued() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder WHERE state = 1;';

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
			this.getProductsR(res, 0)
		).then((res) =>
			this.formatOrders(res)
		);
	}
	async get(id) {
		return this.getOrder(id).then((res) =>
			this.getProductsR(res, 0)
		).then((res) =>
			this.getDeliveryInfoR(res, 0)
		).then((res) => {
			return new Promise((resolve, reject) => {
				let data = res[0].toDict();
				delete data.id;

				resolve(data);
			});
		}
		);
	}
	async getReturnItems(id) {
		return this.getOrder(id).then((orders) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT DISTINCT s.skuItemId, s.itemId, skuId FROM TestResult t, SKUItemsRestockOrder s WHERE s.skuItemId = t.skuItemId AND restockOrderId = ? AND result = 0;';
				let order = orders[0];

				if (order.State != 4)
					return reject("Wrong data");

				this.db.all(sql, [order.Id], (err, rows) => {
					let res = [];

					if (err)
						reject(err);
					else {
						if (rows != null)
							rows.forEach((row) => {
								res.push({
									SKUId: row.SKUID,
									itemId: row.ITEMID,
									rfid: row.SKUITEMID
								});
							});

						resolve(res);
					}
				});
			});
		});
	}

	//UPDATE
	setState(orderId, state) {
		return new Promise((resolve, reject) => {
			const sql = 'UPDATE RestockOrder SET state = ? WHERE ID = ?;';
			let i, id = parseInt(orderId);

			if (!id || !state)
				return reject("Wrong data");

			for (i = 0; i < RestockOrder.states.length && state != RestockOrder.states[i]; i++);

			if (i >= RestockOrder.states.length)
				return reject("Wrong data");

			this.db.run(sql, [i + 1, id], function (err) {
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
		return this.getOrder(id).then((res) =>
			this.checkSKUItems(res[0], skuItems)
		).then((res) =>
			this.insertSKUItemsR(res, skuItems, 0)
		);
	}
	async setTransportNote(id, transportNote) {
		return this.getOrder(id).then((res) =>
			this.insertTransportNote(res[0], transportNote)
		);
	}

	//DELETE
	async delete(data) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM RestockOrder WHERE id = ?;';
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
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'DELETE FROM SKUItemsRestockOrder WHERE restockOrderId = ?;';

				this.db.run(sql, [res], (err) => {
					if (err)
						reject(err);
					else
						resolve(res);
				});
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'DELETE FROM Product WHERE orderId = ?;';

				this.db.run(sql, [res], (err) => {
					if (err)
						reject(err);
					else
						resolve(res);
				});
			});
		}).then((res) => {
			return new Promise((resolve, reject) => {
				const sql = 'DELETE FROM TransportNote WHERE orderId = ?';

				this.db.run(sql, [res], (err) => {
					if (err)
						reject(err);
					else
						resolve(res);
				});
			});
		});
	}
}

module.exports = RestockOrderDAO;