const Item = require('./Item.js');

class ItemDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }

    updateItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Item SET ID = ?, DESCRIPTION = ?, PRICE = ?, SKUID = ?, SUPPLIERID = ? WHERE ID == ?';
            this.db.all(sql, [item.id, item.description, item.price, item.skuid, item.supplierID, item.id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
                
            });
        });
    }


    storeItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Item(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [item.id, item.description, item.price, item.skuid, item.supplierID], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
                
            });
        });
    }

    getItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Item';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const items = rows.map((p) => (new Item(p)));
                    resolve(items);
                }
                
               
            });
        });
    }

    getItemsBySupplier(supplierID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Item WHERE SUPPLIERID = ?';
            this.db.all(sql, [supplierID], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const items = rows.map((p) => (new Item(p)));
                    resolve(items);
                }
                
               
            });
        });
    }

    // getItemByID(id) {
    //     return new Promise((resolve, reject) => {
    //         const sql = 'SELECT * FROM Item WHERE ID == ?';
    //         this.db.all(sql, [id], function(err, rows) {
    //             if (err) {
    //                 reject(err);
    //             }
    //             if(rows.length==0){
    //                 resolve(null);
    //             }else{
    //                 resolve(new Item(rows[0]));
    //             }
                
    //         });
    //     });

    // }

    getItemByIDAndSupplierID(itemId, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Item WHERE ID == ? and SUPPLIERID == ?';
            this.db.all(sql, [itemId, supplierId], function(err, rows) {
                if (err) {
                    reject(err);
                }
                if(rows.length==0){
                    resolve(null);
                }else{
                    resolve(new Item(rows[0]));
                }
                
            });
        });

    }


    deleteItem(itemID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Item WHERE ID == ?';
            this.db.run(sql, [itemID], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
                

            });
        });

    }


}

module.exports = ItemDAO;
