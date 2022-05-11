const RestockOrder = require('./RestockOrder');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class RestockOrderDAO {
	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
	}

	//Ausiliary functions
	insertProductsR(orderId, products, i) {
		if (i >= products.length)
			return new Promise((resolve, reject) => {
				resolve(orderId);
			});

		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO Product(ORDERID, SKUID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?, ?);';
			let p = products[i];

			if (!parseInt(p.SKUId) || !(typeof p.description == 'string') || !parseFloat(p.price) || !parseInt(p.qty))
				return reject("Wrong data");

			this.db.run(sql, [orderId, p.SKUId, p.description, p.price, p.qty], function (err) {
				if (err)
					reject(err);
				else
					resolve();
			});
		}).then(() => this.insertProductsR(orderId, products, i + 1));
	}
	getOrder(id) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT id, issueDate, supplierId, state FROM RestockOrder WHERE id = ?;';
			id = parseInt(id);

			if (!id)
				return reject("Wrong data");

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
			const sql = 'SELECT skuId, description, price, qty FROM Product WHERE orderId = ?;';

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
			const sql = 'SELECT skuId, rfid, key, note FROM SKUItem s, SKUItemsRestockOrder so, TransportNote tn WHERE so.restockOrderId = tn.orderId AND s.rfid = so.skuItemId AND so.restockOrderId = ?;';

			this.db.all(sql, [orders[i].Id], (err, rows) => {
				if (err)
					reject(err);
				else {
					if (rows != null)
						rows.forEach((row) => {
							orders[i].pushSkuItems(row);

							orders[i].setTransportNote(row.KEY, row.NOTE);
						});

					resolve();
				}
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
			const sql = 'SELECT COUNT(*) as num FROM SKUItem WHERE rfid = ? AND skuId = ?;';
			let s = skuItems[i];
			let skuId = parseInt(s.SKUId);

			if (!(typeof s.rfid == 'string') || !skuId)
				reject("Wrong data");

			this.db.get(sql, [s.rfid, skuId], (err, row) => {
				if (err)
					reject(err);
				else if (row.NUM == 0)
					reject("Wrong data");
				else
					resolve();
			});
		}).then(() => this.checkSKUItemsR(orderId, skuItems, i + 1));
	}
	checkSKUItems(order, skuItems) {
		if (order.State < 2)
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
			const sql = 'INSERT INTO SKUItemsRestockOrder(RESTOCKORDERID, SKUITEMID) VALUES(?, ?);';
			let s = skuItems[i];

			this.db.run(sql, [orderId, s.rfid], (err) => {
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
		let issueDate = dayjs(order.issueDate);
		let deliveryDate = dayjs(transportNote.deliveryDate);

		if (order.State < 1 || !deliveryDate || deliveryDate.isBefore(issueDate))
			return new Promise((resolve, reject) => {
				reject("Wrong data");
			});

		return this.insertTransportNoteR(order.Id, transportNote, 0);
	}

	//CREATE
	async store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO RestockOrder(ISSUEDATE, STATE, SUPPLIERID) VALUES(?, 1, ?);';

			if (!dayjs(data.issueDate).isValid() || !parseInt(data.supplierId) || !data.products)
				return reject("Wrong data");

			this.db.run(sql, [data.issueDate, data.supplierId], function (err) {
				if (err)
					reject(err);
				else
					resolve(this.lastID);
			});
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
		return this.getOrder(id).then((order) => {
			return new Promise((resolve, reject) => {
				const sql = 'SELECT rfid, skuId FROM SKUItem s, TestResult t, SKUItemsRestockOrder so WHERE s.rfid = t.skuItemId AND s.rfid = so.skuItemId AND orderId = ? AND result = 0;';

				if (order.state != 4)
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
								SKUId: row.skuid,
								rfid: row.rfid
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
			let s = -1;

			for (let i = 0; i < RestockOrder.states.length && state != RestockOrder.states[i]; i++)
				s = i + 1;

			id = parseInt(id);

			if (!id || s == -1)
				return reject("Wrong data");

			this.db.run(sql, [s, id], function (err) {
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