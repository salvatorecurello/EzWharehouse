const crypto = require('crypto')
class DAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if(err) throw err;
        });
    }

    createTables(){
        return new Promise((resolve, reject)  => {
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
            let data={name:'nome', surname:'cognome', type:'Customer', password:'testpassword', email:'user1@ezwh.com'};
            this.storeUser(data);
            data={name:'nome', surname:'cognome', type:'Quality', password:'testpassword', email:'qualityEmployee1@ezwh.com'};
            this.storeUser(data);
            data={name:'nome', surname:'cognome', type:'Clerk', password:'testpassword', email:'clerk1@ezwh.com'};
            this.storeUser(data);
            data={name:'nome', surname:'cognome', type:'Delivery', password:'testpassword', email:'deliveryEmployee1@ezwh.com'};
            this.storeUser(data);
            data={name:'nome', surname:'cognome', type:'Supplier', password:'testpassword', email:'supplier1@ezwh.com'};
            this.storeUser(data);
            data={name:'nome', surname:'cognome', type:'Manager', password:'testpassword', email:'manager1@ezwh.com'};
            this.storeUser(data);
        });
    }
    
    storeUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO User(NAME, SURNAME, TYPE, PASSWORD, EMAIL) VALUES(?, ?, ?, ?, ?)';
            data.password=crypto.createHash('md5').update(data.password).digest("hex");
            this.db.run(sql, [data.name, data.surname, data.type, data.password, data.email], (err) => {
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
}

module.exports = DAO;
