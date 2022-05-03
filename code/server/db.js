const crypto = require('crypto')
class DAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if(err) throw err;
        });
    }

    createTables(){
        return new Promise(async (resolve, reject)  => {
            this.db.run('CREATE TABLE IF NOT EXISTS User (ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME VARCHAR, SURNAME VARCHAR, TYPE VARCHAR, PASSWORD VARCHAR, EMAIL VARCHAR UNIQUE)');
            this.db.run('CREATE TABLE IF NOT EXISTS SKU (ID INTEGER PRIMARY KEY AUTOINCREMENT,DESCRIPTION VARCHAR, WEIGHT INTEGER, VOLUME INTEGER, POSITION VARCHAR, AVAILABLEQUANTITY INTEGER, PRICE FLOAT, NOTE VARCHAR)');
            this.db.run('CREATE TABLE IF NOT EXISTS Note (ID INTEGER PRIMARY KEY AUTOINCREMENT, SKUID INTEGER, KEY VARCHAR, NOTE VARCHAR)');
            this.db.run('CREATE TABLE IF NOT EXISTS InternalOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE INTEGER, STATE INTEGER, CUSTOMERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Product (ID INTEGER PRIMARY KEY AUTOINCREMENT, ORDERID INTEGER, SKUID INTEGER, DESCRIPTION VARCHAR, PRICE FLOAT, QTY INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Item (ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR, PRICE FLOAT, SKUID INTEGER, SUPPLIERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS SKUItem (RFID VARCHAR PRIMARY KEY, SKUID INTEGER, AVAILABLE INTEGER, DATEOFSTOCK INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS ReturnOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, RETURNDATE INTEGER, RESTOCKORDERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Position (ID VARCHAR PRIMARY KEY, AISLEID VARCHAR, ROW VARCHAR, COL VARCHAR, MAXWEIGHT INTEGER, MAXVOLUME INTEGER, OCCUPIEDWEIGHT INTEGER, OCCUPIEDVOLUME INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS TestResult (ID VARCHAR PRIMARY KEY, SKUITEMID VARCHAR, IDTESTDESCRIPTOR INTEGER, DATE INTEGER, RESULT INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS TestDescriptor (ID VARCHAR PRIMARY KEY, NAME VARCHAR, PROCEDURE VARCHAR, SKUID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS RestockOrder (ID VARCHAR PRIMARY KEY, ISSUEDATE INTEGER, STATE INTEGER, SUPPLIERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS SKUItemsRestockOrder (ID VARCHAR PRIMARY KEY, RESTOCKORDERID INTEGER, SKUITEMID INTEGER)');
            const password=crypto.createHash('md5').update('testpassword').digest("hex");
            const sql = 'INSERT or IGNORE INTO User(NAME, SURNAME, TYPE, PASSWORD, EMAIL) VALUES(?, ?, ?, ?, ?)';
            let data={name:'nome', surname:'cognome', type:'customer', password:password, email:'user1@ezwh.com'};
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email]);
            data={name:'nome', surname:'cognome', type:'qualityEmployee', password:password, email:'qualityEmployee1@ezwh.com'};
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email]);
            data={name:'nome', surname:'cognome', type:'clerk', password:password, email:'clerk1@ezwh.com'};
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email]);
            data={name:'nome', surname:'cognome', type:'deliveryEmployee', password:password, email:'deliveryEmployee1@ezwh.com'};
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email]);
            data={name:'nome', surname:'cognome', type:'supplier', password:password, email:'supplier1@ezwh.com'};
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email]);
            data={name:'nome', surname:'cognome', type:'manager', password:password, email:'manager1@ezwh.com'};
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email]);
        });
    }
    
    storeUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO User(NAME, SURNAME, TYPE, PASSWORD, EMAIL) VALUES(?, ?, ?, ?, ?)';
            data.password=crypto.createHash('md5').update(data.password).digest("hex");
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.username], (err) => {
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
                const names = rows.map((r) => (
                    {  
                        id:r.ID,
                        name : r.NAME,
                        surname : r.SURNAME,
                        type: r.TYPE,
                        email: r.EMAIL
                    }
                ));
                resolve(names);
            });
        });
    }

    getSuppliers(){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE TYPE=="Supplier"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {  
                        id:r.ID,
                        name : r.NAME,
                        surname : r.SURNAME,
                        email: r.EMAIL
                    }
                ));
                resolve(names);
            });
        });
    }

    login(username, password, type){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE TYPE==? AND EMAIL==? AND PASSWORD==?';
            this.db.all(sql, [type, username, crypto.createHash('md5').update(password).digest("hex")], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==1){
                    resolve(rows[0]);
                }else{
                    resolve(null);
                }
            });
        });
    }

    getUserFromId(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE ID==?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==1){
                    resolve(rows[0]);
                }else{
                    resolve(null);
                }
            });
        });
    }

    getUserFromEmail(email){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User WHERE EMAIL==?';
            this.db.all(sql, [email], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length==1){
                    resolve(rows[0]);
                }else{
                    resolve(null);
                }
            });
        });
    }

    updateUser(id, newType){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET TYPE = ? WHERE ID==?';
            this.db.all(sql, [newType, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    deleteUser(id){
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

module.exports = DAO;
