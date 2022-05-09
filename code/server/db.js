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
<<<<<<< HEAD
            this.db.run('CREATE TABLE IF NOT EXISTS TransportNote (ID INTEGER PRIMARY KEY AUTOINCREMENT, ORDERID INTEGER, KEY VARCHAR, NOTE VARCHAR)');
            this.db.run('CREATE TABLE IF NOT EXISTS InternalOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE INTEGER, STATE INTEGER, CUSTOMERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Product (ID INTEGER PRIMARY KEY AUTOINCREMENT, ORDERID INTEGER, SKUID INTEGER, DESCRIPTION VARCHAR, PRICE FLOAT, QTY INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Item (ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR, PRICE FLOAT, SKUID INTEGER, SUPPLIERID INTEGER)');
=======
            this.db.run('CREATE TABLE IF NOT EXISTS Note (ID INTEGER PRIMARY KEY AUTOINCREMENT, SKUID INTEGER, KEY VARCHAR, NOTE VARCHAR)');
            this.db.run('CREATE TABLE IF NOT EXISTS InternalOrder (ID INTEGER PRIMARY KEY, ISSUEDATE INTEGER, STATE INTEGER, CUSTOMERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Product (ID INTEGER PRIMARY KEY, RFID VARCHAR, ORDERID INTEGER, SKUID INTEGER, DESCRIPTION VARCHAR, PRICE FLOAT, QTY INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Item (ID INTEGER PRIMARY KEY, DESCRIPTION VARCHAR, PRICE FLOAT, SKUID INTEGER, SUPPLIERID INTEGER)');
>>>>>>> 9893bd9... Add Item, Position and InternalOrder class
            this.db.run('CREATE TABLE IF NOT EXISTS SKUItem (RFID VARCHAR PRIMARY KEY, SKUID INTEGER, AVAILABLE INTEGER, DATEOFSTOCK INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS ReturnOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, RETURNDATE INTEGER, RESTOCKORDERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS Position (ID VARCHAR PRIMARY KEY, AISLEID VARCHAR, ROW VARCHAR, COL VARCHAR, MAXWEIGHT INTEGER, MAXVOLUME INTEGER, OCCUPIEDWEIGHT INTEGER, OCCUPIEDVOLUME INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS TestResult (ID INTEGER PRIMARY KEY, SKUITEMID VARCHAR, IDTESTDESCRIPTOR INTEGER, DATE INTEGER, RESULT INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS TestDescriptor (ID INTEGER PRIMARY KEY, NAME VARCHAR, PROCEDURE VARCHAR, SKUID INTEGER)');
<<<<<<< HEAD
            this.db.run('CREATE TABLE IF NOT EXISTS RestockOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE INTEGER, STATE INTEGER, SUPPLIERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS SKUItemsRestockOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, RESTOCKORDERID INTEGER, SKUITEMID VARCHAR)');
=======
            this.db.run('CREATE TABLE IF NOT EXISTS RestockOrder (ID INTEGER PRIMARY KEY, ISSUEDATE INTEGER, STATE INTEGER, SUPPLIERID INTEGER)');
            this.db.run('CREATE TABLE IF NOT EXISTS SKUItemsRestockOrder (ID INTEGER PRIMARY KEY, RESTOCKORDERID INTEGER, SKUITEMID VARCHAR)');
            
>>>>>>> 9893bd9... Add Item, Position and InternalOrder class
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
            
            const sql_Position = 'INSERT or IGNORE INTO Position(ID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
            let pos1={id: 'aisle1row1col1',aisleId:'aisle1', row:'row1', col:'col1', maxwei:5, maxvol:10, occupiedWei: 10, occupiedVol: 10};
            this.db.run(sql_Position, [pos1.id, pos1.aisleId,pos1.row,pos1.col, pos1.maxwei, pos1.maxvol, pos1.occupiedWei, pos1.occupiedVol]);
            let pos2={id: 'aisle2row2col2', aisleId:'aisle2', row:'row2', col:'col2', maxwei:5, maxvol:11, occupiedWei: 10, occupiedVol: 20};
            this.db.run(sql_Position, [pos2.id, pos2.aisleId,pos2.row,pos2.col, pos2.maxwei, pos2.maxvol, pos2.occupiedWei, pos2.occupiedVol]);
            let pos3={id: 'aisle3row3col3', aisleId:'aisle3', row:'row3', col:'col3', maxwei:3, maxvol:21, occupiedWei: 15, occupiedVol: 15};
            this.db.run(sql_Position, [pos3.id, pos3.aisleId,pos3.row,pos3.col, pos3.maxwei, pos3.maxvol, pos3.occupiedWei, pos3.occupiedVol]);
            let pos4={id: 'aisle4row4col4', aisleId:'aisle4', row:'row4', col:'col4', maxwei:3, maxvol:34, occupiedWei: 14, occupiedVol: 10};
            this.db.run(sql_Position, [pos4.id, pos4.aisleId,pos4.row,pos4.col, pos4.maxwei, pos4.maxvol, pos4.occupiedWei, pos4.occupiedVol]);
            let pos5={id: 'aisle5row5col5', aisleId:'aisle5', row:'row5', col:'col5', maxwei:4, maxvol:20, occupiedWei: 15, occupiedVol: 20};
            this.db.run(sql_Position, [ pos5.id,pos5.aisleId,pos5.row,pos5.col, pos5.maxwei, pos5.maxvol, pos5.occupiedWei, pos5.occupiedVol]);
            
            const sql_Items = 'INSERT or IGNORE INTO Item(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?,?)';
            let item1={id: 1, description:'description1', price: 2.00, skuid: 1, supplierid: 5};
            this.db.run(sql_Items, [item1.id, item1.description, item1.price, item1.skuid, item1.supplierid]);
            let item2={id: 2, description:'description2', price: 5.00, skuid: 3, supplierid: 2};
            this.db.run(sql_Items, [item2.id,item2.description, item2.price, item2.skuid, item2.supplierid]);
            let item3={id: 3, description:'description3', price: 6.00, skuid: 4, supplierid: 1};
            this.db.run(sql_Items, [item3.id,item3.description, item3.price, item3.skuid, item3.supplierid]);
            let item4={id: 4, description:'description4', price: 1.00, skuid: 2, supplierid: 3};
            this.db.run(sql_Items, [item4.id,item4.description, item4.price, item4.skuid, item4.supplierid]);
            let item5={id: 5, description:'description5', price: 8.00, skuid: 3, supplierid: 2};
            this.db.run(sql_Items, [item5.id,item5.description, item5.price, item5.skuid, item5.supplierid]);
            

            // const sql_InternalOrders = 'INSERT or IGNORE INTO InternalOrder(ID,ISSUEDATE, STATE, CUSTOMERID) VALUES(?,?, ?, ?)';
            // const states = {'ISSUED': 0, 'ACCEPTED': 1, 'REFUSED': 2, 'CANCELED': 3, 'COMPLETED': 4 };
            // let ord1={id: 1, issueDate:'issueDateEx1', state: states['COMPLETED'], customerID: 1};
            // this.db.run(sql_InternalOrders, [ord1.id, ord1.issueDate, ord1.state, ord1.customerID]);
            // let ord2={id: 2,issueDate:'issueDateEx2', state: states['ACCEPTED'], customerID: 1};
            // this.db.run(sql_InternalOrders, [ord2.id, ord2.issueDate, ord2.state, ord2.customerID]);
            // let ord3={id: 3,issueDate:'issueDateEx3', state: states['COMPLETED'], customerID: 1};
            // this.db.run(sql_InternalOrders, [ord3.id, ord3.issueDate, ord3.state, ord3.customerID]);
            // let ord4={id: 4,issueDate:'issueDateEx4', state: states['ACCEPTED'], customerID: 1};
            // this.db.run(sql_InternalOrders, [ord4.id, ord4.issueDate, ord4.state, ord4.customerID]);
            // let ord5={id: 5,issueDate:'issueDateEx5', state: states['ISSUED'], customerID: 1};
            // this.db.run(sql_InternalOrders, [ord5.id, ord5.issueDate, ord5.state, ord5.customerID]);

            // const sql_SKU = 'INSERT or IGNORE INTO Sku(DESCRIPTION, WEIGHT, VOLUME, POSITION, AVAILABLEQUANTITY, PRICE, NOTE) VALUES(?, ?, ?, ?, ?, ?, ?)';
            // let sku1 = {description: 'description1', weight: 10, volume: 10, position: 1, availableQuantity: 10, price: 2.00, note: 'note1'};
            // this.db.run(sql_SKU, [sku1.description,sku1.weight, sku1.volume, sku1.position, sku1.availableQuantity, sku1.price, sku1.note]);
            // let sku2 = {description: 'description2', weight: 20, volume: 5, position: 2, availableQuantity: 20, price: 21.00, note: 'note2'};
            // this.db.run(sql_SKU, [sku1.description,sku1.weight, sku1.volume, sku1.position, sku1.availableQuantity, sku1.price, sku1.note]);
            // let sku3 = {description: 'description3', weight: 5, volume: 5, position: 3, availableQuantity: 15, price: 10.00, note: 'note3'};
            // this.db.run(sql_SKU, [sku1.description,sku1.weight, sku1.volume, sku1.position, sku1.availableQuantity, sku1.price, sku1.note]);
            // let sku4 = {description: 'description4', weight: 10, volume: 6, position: 1, availableQuantity: 10, price: 7.00, note: 'note4'};
            // this.db.run(sql_SKU, [sku1.description,sku1.weight, sku1.volume, sku1.position, sku1.availableQuantity, sku1.price, sku1.note]);
            // let sku5 = {description: 'description5', weight: 20, volume: 7, position: 4, availableQuantity: 15, price: 8.00, note: 'note5'};
            // this.db.run(sql_SKU, [sku1.description,sku1.weight, sku1.volume, sku1.position, sku1.availableQuantity, sku1.price, sku1.note]);


            
            // const sql_Product = 'INSERT or IGNORE INTO Product(ID, RFID, ORDERID, SKUID, DESCRIPTION, PRICE, QTY) VALUES(?,?,?, ?, ?, ?, ?)';
            // let prod1 = {id: 1, rfid: 'rfid1', orderid: 1, skuid: 1, description: 'description1', price: 50.00, qty: 40}
            // this.db.run(sql_Product, [ prod1.id, prod1.rfid, prod1.orderid, prod1.skuid, prod1.description, prod1.price, prod1.qty])
            // let prod2 = {id: 2, rfid: 'rfid2', orderid: 2, skuid: 2, description: 'description2', price: 70.00, qty: 50}
            // this.db.run(sql_Product, [ prod2.id,prod2.rfid, prod2.orderid, prod2.skuid, prod2.description, prod2.price, prod2.qty])
            // let prod3 = {id: 3, rfid: 'rfid3', orderid: 1, skuid: 3, description: 'description3', price: 40.00, qty: 30}
            // this.db.run(sql_Product, [ prod3.id,prod3.rfid, prod3.orderid, prod3.skuid, prod3.description, prod3.price, prod3.qty])
            // let prod4 = {id: 4, rfid: 'rfid4', orderid: 2, skuid: 4, description: 'description4', price: 30.00, qty: 20}
            // this.db.run(sql_Product, [ prod4.id,prod4.rfid, prod4.orderid, prod4.skuid, prod4.description, prod4.price, prod4.qty])
            // let prod5 = {id: 5, rfid: 'rfid5', orderid: 1, skuid: 5, description: 'description5', price: 20.00, qty: 70}
            // this.db.run(sql_Product, [ prod5.id,prod5.rfid, prod5.orderid, prod5.skuid, prod5.description, prod5.price, prod5.qty])

        });
    }
    
}

module.exports = DAO;
