const crypto = require('crypto')
const User = require('./User.js');
class UserDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }

    storeUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO User(NAME, SURNAME, TYPE, PASSWORD, EMAIL) VALUES(?, ?, ?, ?, ?)';
            data.password = crypto.createHash('md5').update(data.password).digest("hex");
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.username], function(err){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE TYPE<>"Manager"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (new User
                    (
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    getSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE TYPE=="supplier"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (new User
                    (
                        r
                    )
                ));
                resolve(names);
            });
        });
    }

    login(username, password, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE TYPE==? AND EMAIL==? AND PASSWORD==?';
            this.db.all(sql, [type, username, crypto.createHash('md5').update(password).digest("hex")], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length == 1) {
                    resolve(new User(rows[0]));
                } else {
                    resolve(null);
                }
            });
        });
    }

    getUserFromId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE ID==?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length == 1) {
                    resolve(new User(rows[0]));
                } else {
                    resolve(null);
                }
            });
        });
    }

    getUserFromEmail(email, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE EMAIL==? AND TYPE==?';
            this.db.all(sql, [email, type], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length == 1) {
                    resolve(new User(rows[0]));
                } else {
                    resolve(null);
                }
            });
        });
    }

    updateUser(id, newType) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET TYPE = ? WHERE ID=?';
            this.db.all(sql, [newType, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    deleteUser(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM User WHERE ID ==?';
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

module.exports = UserDAO;
