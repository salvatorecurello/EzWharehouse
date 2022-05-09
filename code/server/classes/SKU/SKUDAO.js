const crypto = require('crypto')
const SKU = require('./SKU.js');
class SKUDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if(err) throw err;
        });
    }

    storeSKU(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTE, PRICE, AVAILABLEQUANTITY) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.price, data.availableQuantity], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    isSKUidValid(skuid){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU where ID = ?';
            this.db.all(sql, [skuid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows.length);
            });
        });
    }
    
    getSkus() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => ( new SKU
                    ( 
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    getSKUByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE ID = ?';
            this.db.all(sql, [parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==1){
                    resolve(new SKU(rows[0]));
                }else{
                    resolve(null);
                }
            });
        });
    }

    updateSKU(data, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET  DESCRIPTION=?, WEIGHT=?, VOLUME=?, NOTE=?, PRICE=?, AVAILABLEQUANTITY=? WHERE ID = ?';
            this.db.all(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    updateSKUWeightVolume(position, weight, volume){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET OCCUPAIEDWEIGHT=?, OCCUPIEDVOLUME=? WHERE ID = ?';
            this.db.all(sql, [weight, volume, position], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    modifySKUPosition(position, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET ID=? WHERE ID =?';
            this.db.all(sql, [position, parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    addPosition(position, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET POSITION=? WHERE ID=?';
            this.db.run(sql, [position, parseInt(id)], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });

    }
    deleteSKU(id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU WHERE ID=?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = SKUDAO;
