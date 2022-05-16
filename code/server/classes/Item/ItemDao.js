const Item = require('./Item.js');

class ItemDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
    }

    updateItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Item SET ID = ?, DESCRIPTION = ?, PRICE = ?, SKUID = ?, SUPPLIERID = ? WHERE ID == ?';
            this.db.all(sql, [item.id, item.description, item.price, item.skuid, item.supplierID, item.id], function(err) {
                if (err) {
                    reject(err);
                }
                resolve(this);
            });
        });
    }

    retrieveSku(skuID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUItem WHERE SKUID == ?';
            this.db.all(sql, [skuID], function(err,rows) {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }


    storeItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Item(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [item.id, item.description, item.price, item.skuid, item.supplierID], function(err) {
                if (err) {
                    reject(err);
                }
                resolve(this);
            });
        });
    }

    getItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Item';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const items = rows.map((p) => (new Item(p)));
                resolve(items);
            });
        });
    }

    getItemByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Item WHERE ID = ?';
            this.db.all(sql, [id], function(err, rows) {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            });
        });

    }

    deleteItem(itemID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Item WHERE ID == ?';
            this.db.run(sql, [itemID], function(err) {
                if (err) {
                    reject(err);
                }
                resolve(this);

            });
        });

    }
}

module.exports = ItemDAO;
