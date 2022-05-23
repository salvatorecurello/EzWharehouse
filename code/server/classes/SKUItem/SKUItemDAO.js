const SKUItem = require('./SKUItem.js');
class SKUItemDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if(err) throw err;
        });
    }
    
    // fatta
    getSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUItem';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => ( new SKUItem
                    ( 
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    // fatta
    getArraySKUItemByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUItem WHERE SKUID = ? AND AVAILABLE = 1'; 
            this.db.all(sql, [parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => ( new SKUItem
                    ( 
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    // fatta
    getSKUItemByRFID(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUItem WHERE RFID = ?';
            this.db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==1){
                    resolve(new SKUItem(rows[0]));
                }else{
                    resolve(null);
                }
            });
        });
    }

    
    //isidSKUValid(skuid){
    //    return new Promise((resolve, reject) => {
    //        const sql = 'SELECT * FROM SKU where ID = ?';
    //        this.db.all(sql, [parseInt(skuid)], (err, rows) => {
    //            if (err) {
    //                reject(err);
    //                return;
    //            }
    //            resolve(rows.length);
    //        });
    //    });
    //}

    // fatta
    storeSKUItem(data, qty = 0) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUItem (RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [data.RFID, data.SKUId, qty, data.DateOfStock], function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    // fatta
    updateSKUItem(data, rfid){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUItem SET RFID=?, AVAILABLE=?, DATEOFSTOCK=? WHERE RFID = ?';
            this.db.all(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //existingRFID(rfid){
    //    return new Promise((resolve, reject) => {
    //        const sql = 'SELECT * FROM SKUItem WHERE RFID=?';
    //        this.db.all(sql, [rfid], (err, rows) => {
    //            if (err) {
    //                reject(err);
    //                return;
    //            }
    //            resolve(rows.length);
    //        });
    //    });
    //}

    //existingSKU(id){
    //    return new Promise((resolve, reject) => {
    //        const sql = 'SELECT * FROM SKU WHERE ID=?';
    //        this.db.all(sql, [parseInt(id)], (err, rows) => {
    //            if (err) {
    //                reject(err);
    //                return;
    //            }
    //            resolve(rows.length);
    //        });
    //    });
    //}

    // fatta
    deleteSKUItem(rfid){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKUItem where RFID=?';
            this.db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = SKUItemDAO;
