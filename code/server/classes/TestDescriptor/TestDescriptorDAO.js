const crypto = require('crypto')
const TestDescriptor = require('./TestDescriptor.js');
class TestDescriptorDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }

    storeTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TestDescriptor(NAME, PROCEDURE, SKUID) VALUES(?, ?, ?)';
            this.db.run(sql, [data.name, data.procedureDescription, data.idSKU], function(err){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestDescriptor';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (new TestDescriptor
                    (
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    getTestDescriptorsByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestDescriptor WHERE ID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length == 1) {
                    resolve(new TestDescriptor(rows[0]));
                } else {
                    resolve(null);
                }
            });
        });
    }


    updateTestDescriptor(data, id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TestDescriptor SET  NAME=?, PROCEDURE=?, SKUID=? where ID = ?';
            this.db.all(sql, [data.newName, data.newProcedureDescription, data.newIdSKU, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TestDescriptor where ID=?';
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

module.exports = TestDescriptorDAO;
