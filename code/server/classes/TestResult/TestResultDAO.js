const crypto = require('crypto')
const TestResult = require('./TestResult.js');
class TestResultDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }

    storeTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TestResult(SKUITEMID, IDTESTDESCRIPTOR, DATE, RESULT) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [data.rfid, data.idTestDescriptor, dayjs(data.Date).unix(), data.Result == true ? 1 : 0], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestResultBySKUITEMID(SKUITEMID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult where SKUITEMID = ?';
            this.db.all(sql, [SKUITEMID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (new TestResult
                    (
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    getTestResultBySKUITEMIDAndID(SKUITEMID, ID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult where SKUITEMID = ? and ID = ?';
            this.db.all(sql, [SKUITEMID, ID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length == 1) {
                    resolve(new TestResult(rows[0]));
                } else {
                    resolve(null);
                }
            });
        });
    }

    updateTestResult(data, id, rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TestResult SET  IDTESTDESCRIPTOR=?, DATE=?, RESULT=? where ID = ? and SKUITEMID=?';
            this.db.all(sql, [data.newIdTestDescriptor, dayjs(data.newDate).unix(), data.newResult == true ? 1 : 0, id, rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    deleteTestResult(id, rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TestResult where ID=? AND SKUITEMID=?';
            this.db.all(sql, [id, rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = TestResultDAO;
