const crypto = require('crypto')
const SKU = require('./SKU.js');
class SKUDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if(err) throw err;
        });
    }

    // fatta
    storeSKU(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTE, PRICE, AVAILABLEQUANTITY) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.price, data.availableQuantity], function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    // fatta
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

    //fatta
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

    getTestDescriptorsBySKUID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT ID FROM TestDescriptor WHERE SKUID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==0){
                    resolve([]);
                }else{
                    resolve(rows);
                }

            });
        });
    }

    // fatta
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

    // fatta
    updatePositionWeightVolume(position, weight, volume){ 
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET OCCUPIEDWEIGHT=?, OCCUPIEDVOLUME=? WHERE ID = ?';
            this.db.all(sql, [weight, volume, position], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    // fatta
    PositionOccupied(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE POSITION = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==0){
                    resolve(undefined)
                }else{
                    resolve(rows[0]);
                }
            });
        });
    }
    
    // fatta
    //existingPosition(position){
    //    return new Promise((resolve, reject) => {
    //        const sql = 'SELECT * FROM POSITION WHERE ID = ?';
    //        this.db.all(sql, [position], (err, rows) => {
    //            if (err) {
    //                reject(err);
    //                return;
    //            }
    //            if (rows.lenght==0){
    //                resolve(undefined)
    //            }else{ 
    //            resolve(rows[0]);
    //            }
    //        });
    //    });
    //}

    // fatta
    modifySKUPosition(position, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET POSITION=? WHERE ID =?';
            this.db.all(sql, [position, parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //addPosition(position, id){
    //    return new Promise((resolve, reject) => {
    //        const sql = 'UPDATE SKU SET POSITION=? WHERE ID=?';
    //        this.db.run(sql, [position, parseInt(id)], (err) => {
    //            if (err) {
    //              reject(err);
    //              return;
    //            }
    //            resolve(this.lastID);
    //        });
    //    });
    //}

    // fatta
    existingSKUItem(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUItem WHERE SKUID = ?';
            this.db.all(sql, [parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows.length);
            });
        });
    }

    // fatta
    existingTestDescriptor(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestDescriptor WHERE SKUID = ?';
            this.db.all(sql, [parseInt(id)], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows.length);
            });
        });
    }

    // fatta
    deleteSKU(id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU WHERE ID=?';
            this.db.all(sql, [parseInt(id)], (err, rows) => {
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
