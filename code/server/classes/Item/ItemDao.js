const Item = require('./Item.js');

class ItemDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
    }


    storeItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Item(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [item.id, item.description, item.price, item.skuid, item.supplierID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(item);
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
                console.log(items);
                resolve(items);
            });
        });
    }

    getItemByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Item WHERE ID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const item = new Item(rows[0]);
                
                resolve(item);
            });
        });

    }

    deleteItem(itemID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Item WHERE ID == ?';
            this.db.run(sql, [itemID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(itemID);

            });
        });

    }
}

module.exports = ItemDAO;
