const sqlite = require('sqlite3');

class ReturnOrderDAO {

	constructor() {
		this.db = new sqlite.Database("EzWh.db", (err) => {
			if (err) throw err;
		});
	}

	store(data) {
		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO ReturnOrder(RETURNDATE, RESTOCKORDERID) VALUES(?, ?);';

			this.db.run(sql, [data.returnDate, data.restockOrderId], (err) => {
				if (err)
					reject({ "error": true, "res": err });
				else
					resolve({ "error": false, "res": this.lastID });
			});
		});
	}

	getReturnItems(id) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM RestockOrder WHERE id = ? AND state = "TESTED";';
			let res = [];

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject({ "error": true, "res": err });

				const skuItemSql = 'SELECT rfid, skuId FROM SKUItem s, TestResult t, SKUItemsRestockOrder so WHERE s.rfid = t.skuItemId AND s.rfid = so.skuItemId AND orderId = ? AND result = 0;';

				this.db.each(skuItemSql, [row.id], (err, row) => {
					if (err)
						reject({ "error": true, "res": err });

					res.push({
						"SKUId": row.skuid,
						"rfid": row.rfid
					});
				});
			});

			resolve({ "error": false, "res": res });
		});
	}

	getAll() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM ReturnOrder;';
			let res = [];

			this.db.each(sql, [], (err, row) => {
				if (err)
					reject({ "error": true, "res": err });
				
				let data = new ReturnOrder(row.id, row.returndate, row.restockOrderId, getReturnItems(row.restockOrderId));

				res.push(data.toMap());
			});

			resolve({ "error": false, "res": res });
		});
	}

	get(id) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM ReturnOrder WHERE id = ?;';
			let res = [];

			this.db.get(sql, [id], (err, row) => {
				if (err)
					reject({ "error": true, "res": err });

				let data = new ReturnOrder(row.id, row.returndate, row.restockOrderId, getReturnItems(row.restockOrderId));

				res.push(data.toMap());
			});

			resolve({ "error": false, "res": res });
		});
	}


	delete(id) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM ReturnOrder WHERE id = ?;';

			this.db.run(sql, [id], (err) => {
				if (err)
					reject({ "error": true, "res": err });
				else
					resolve({ "error": false, "res": this.changes });
			});
		});
	}
}

module.exports = ReturnOrderDAO;