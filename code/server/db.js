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
            this.db.run('CREATE TABLE IF NOT EXISTS TestResult (ID INTEGER PRIMARY KEY, SKUITEMID VARCHAR, IDTESTDESCRIPTOR INTEGER, DATE INTEGER, RESULT INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS TestDescriptor (ID INTEGER PRIMARY KEY, NAME VARCHAR, PROCEDURE VARCHAR, SKUID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS RestockOrder (ID INTEGER PRIMARY KEY, ISSUEDATE INTEGER, STATE INTEGER, SUPPLIERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS SKUItemsRestockOrder (ID INTEGER PRIMARY KEY, RESTOCKORDERID INTEGER, SKUITEMID VARCHAR)');
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
    
}

module.exports = DAO;
