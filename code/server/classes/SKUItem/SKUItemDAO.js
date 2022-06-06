const SKUItem = require('./SKUItem.js');
class SKUItemDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if(err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }
    
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

    storeSKUItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUItem (RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [data.RFID, data.SKUId, 0, data.DateOfStock], function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

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
