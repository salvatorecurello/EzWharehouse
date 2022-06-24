const crypto = require('crypto');
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

class DAO {
    constructor() {
        this.db = new sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }

    deleteAll() {
        const sql = [];
        sql.push("DELETE FROM User");
        sql.push("DELETE FROM SKU");
        sql.push("DELETE FROM TransportNote");
        sql.push("DELETE FROM InternalOrder");
        sql.push("DELETE FROM Product");
        sql.push("DELETE FROM Item");
        sql.push("DELETE FROM SKUItem");
        sql.push("DELETE FROM ReturnOrder");
        sql.push("DELETE FROM Position");
        sql.push("DELETE FROM TestResult");
        sql.push("DELETE FROM TestDescriptor");
        sql.push("DELETE FROM RestockOrder");
        sql.push("DELETE FROM SKUItemsRestockOrder");
        
        let promises = [];
        
        sql.forEach((x) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(x, [], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }))
        })

        return promises
    }

    createTestItems() {

        let promises = [];
        const sql_Position = 'INSERT or IGNORE INTO Position(ID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        const sql_Items = 'INSERT or IGNORE INTO Item(DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?,?)';
        const sql_InternalOrders = 'INSERT or IGNORE INTO InternalOrder( ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?)';
        const sql_SKU = 'INSERT or IGNORE INTO Sku(ID, DESCRIPTION, WEIGHT, VOLUME, POSITION, AVAILABLEQUANTITY, PRICE, NOTE) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        const sql_Product = 'INSERT or IGNORE INTO Product(ID, ORDERID, SKUID, ITEMID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?, ?, ?, ?)';
        const sql_SkuItem = 'INSERT or IGNORE INTO SKUItem(RFID, SKUID , AVAILABLE, DATEOFSTOCK ) VALUES(?, ?, ?, ?)';

        let skuItems = [];
        skuItems.push({ rfid: '11111111111111111111111111111111', skuid: 1, available: 20, dateofstock: dayjs('2021/11/28').unix() });
        skuItems.push({ rfid: '22222222222222222222222222222222', skuid: 2, available: 40, dateofstock: dayjs('2021/11/28').unix() });
        skuItems.push({ rfid: '33333333333333333333333333333333', skuid: 2, available: 30, dateofstock: dayjs('2021/11/28').unix() });
        skuItems.push({ rfid: '44444444444444444444444444444444', skuid: 3, available: 25, dateofstock: dayjs('2021/11/28').unix() });
        skuItems.push({ rfid: '55555555555555555555555555555555', skuid: 1, available: 10, dateofstock: dayjs('2021/11/28').unix() });

        let positions = [];
        positions.push({ id: 'aisle1row1col1', aisleId: 'aisle1', row: 'row1', col: 'col1', maxwei: 5, maxvol: 10, occupiedWei: 10, occupiedVol: 10 });
        positions.push({ id: 'aisle2row2col2', aisleId: 'aisle2', row: 'row2', col: 'col2', maxwei: 5, maxvol: 11, occupiedWei: 10, occupiedVol: 20 });
        positions.push({ id: 'aisle3row3col3', aisleId: 'aisle3', row: 'row3', col: 'col3', maxwei: 3, maxvol: 21, occupiedWei: 15, occupiedVol: 15 });
        positions.push({ id: 'aisle4row4col4', aisleId: 'aisle4', row: 'row4', col: 'col4', maxwei: 3, maxvol: 34, occupiedWei: 14, occupiedVol: 10 });
        positions.push({ id: 'aisle5row5col5', aisleId: 'aisle5', row: 'row5', col: 'col5', maxwei: 4, maxvol: 20, occupiedWei: 15, occupiedVol: 20 });

        let items = [];
        items.push({ id: 1, description: 'description1', price: 2.00, skuid: 1, supplierid: 5 });
        items.push({ id: 2, description: 'description2', price: 5.00, skuid: 3, supplierid: 2 });
        items.push({ id: 3, description: 'description3', price: 6.00, skuid: 4, supplierid: 1 });
        items.push({ id: 4, description: 'description4', price: 1.00, skuid: 2, supplierid: 3 });
        items.push({ id: 5, description: 'description5', price: 8.00, skuid: 3, supplierid: 2 });

        let ords = [];
        const states = { 'ISSUED': 0, 'ACCEPTED': 1, 'REFUSED': 2, 'CANCELED': 3, 'COMPLETED': 4 };
        ords.push({ id: 1, issueDate: 'issueDateEx1', state: states['COMPLETED'], customerID: 1 });
        ords.push({ id: 2, issueDate: 'issueDateEx2', state: states['ACCEPTED'], customerID: 1 });
        ords.push({ id: 3, issueDate: 'issueDateEx3', state: states['COMPLETED'], customerID: 1 });
        ords.push({ id: 4, issueDate: 'issueDateEx4', state: states['ACCEPTED'], customerID: 1 });
        ords.push({ id: 5, issueDate: 'issueDateEx5', state: states['ISSUED'], customerID: 1 });


        let skus = [];
        skus.push({ id: 1, description: 'description1', weight: 10, volume: 10, position: 1, availableQuantity: 10, price: 2.00, note: 'note1' });
        skus.push({ id: 2, description: 'description2', weight: 20, volume: 5, position: 2, availableQuantity: 20, price: 21.00, note: 'note2' });
        skus.push({ id: 3, description: 'description3', weight: 5, volume: 5, position: 3, availableQuantity: 15, price: 10.00, note: 'note3' });
        skus.push({ id: 4, description: 'description4', weight: 10, volume: 6, position: 1, availableQuantity: 10, price: 7.00, note: 'note4' });
        skus.push({ id: 5, description: 'description5', weight: 20, volume: 7, position: 4, availableQuantity: 15, price: 8.00, note: 'note5' });

        let prods = [];
        prods.push({ id: 1, orderid: 1, skuid: 1, itemid:1, description: 'description1', price: 50.00, qty: 40 });
        prods.push({ id: 2, orderid: 2, skuid: 2, itemid:2, description: 'description2', price: 70.00, qty: 50 });
        prods.push({ id: 3, orderid: 1, skuid: 3, itemid:3, description: 'description3', price: 40.00, qty: 30 });
        prods.push({ id: 4, orderid: 2, skuid: 4, itemid:4, description: 'description4', price: 30.00, qty: 20 });
        prods.push({ id: 5, orderid: 1, skuid: 5, itemid:5, description: 'description5', price: 20.00, qty: 70 });

        skuItems.forEach((skuItem) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_SkuItem, [skuItem.rfid, skuItem.skuid, skuItem.available, skuItem.dateofstock], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }));
        });

        positions.forEach((pos) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_Position, [pos.id, pos.aisleId, pos.row, pos.col, pos.maxwei, pos.maxvol, pos.occupiedWei, pos.occupiedVol], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }));
        });

        items.forEach((item) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_Items, [item.description, item.price, item.skuid, item.supplierid], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }));
        });

        ords.forEach((ord) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_InternalOrders, [ord.issueDate, ord.state, ord.customerID], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }));
        });

        skus.forEach((sku) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_SKU, [sku.id, sku.description, sku.weight, sku.volume, sku.position, sku.availableQuantity, sku.price, sku.note], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }));
        });

        prods.forEach((prod) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_Product, [prod.orderid, prod.skuid, prod.description, prod.itemid, prod.price, prod.qty], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }));
        });
        return promises;

    }

    createTablesR(sql, i) {
        if (i >= sql.length)
            return new Promise((resolve, reject) => {
                return resolve("ok");
            });

        return new Promise((resolve, reject) => {
            this.db.run(sql[i], [], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        }).then(async () => await this.createTablesR(sql, i + 1));
    }

    createTables() {
        const sql = [];
        let promises = [];
        sql.push('CREATE TABLE IF NOT EXISTS User (ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME VARCHAR, SURNAME VARCHAR, TYPE VARCHAR, PASSWORD VARCHAR, EMAIL VARCHAR)');
        sql.push('CREATE TABLE IF NOT EXISTS SKU (ID INTEGER PRIMARY KEY,DESCRIPTION VARCHAR, WEIGHT INTEGER, VOLUME INTEGER, POSITION VARCHAR, AVAILABLEQUANTITY INTEGER, PRICE FLOAT, NOTE VARCHAR)');
        sql.push('CREATE TABLE IF NOT EXISTS TransportNote (ID INTEGER PRIMARY KEY AUTOINCREMENT, ORDERID INTEGER, KEY VARCHAR, NOTE VARCHAR)');
        sql.push('CREATE TABLE IF NOT EXISTS InternalOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE INTEGER, STATE INTEGER, CUSTOMERID INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS Product (ID INTEGER PRIMARY KEY AUTOINCREMENT, ORDERID INTEGER, SKUID INTEGER, ITEMID INTGER, DESCRIPTION VARCHAR, PRICE FLOAT, QTY INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS Item (ID INTEGER PRIMARY KEY, DESCRIPTION VARCHAR, PRICE FLOAT, SKUID INTEGER, SUPPLIERID INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS SKUItem (RFID VARCHAR PRIMARY KEY, SKUID INTEGER, AVAILABLE INTEGER, DATEOFSTOCK VARCHAR)');
        sql.push('CREATE TABLE IF NOT EXISTS ReturnOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, RETURNDATE INTEGER, RESTOCKORDERID INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS Position (ID VARCHAR PRIMARY KEY, AISLEID VARCHAR, ROW VARCHAR, COL VARCHAR, MAXWEIGHT INTEGER, MAXVOLUME INTEGER, OCCUPIEDWEIGHT INTEGER, OCCUPIEDVOLUME INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS TestResult (ID INTEGER PRIMARY KEY AUTOINCREMENT, SKUITEMID VARCHAR, IDTESTDESCRIPTOR INTEGER, DATE INTEGER, RESULT INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS TestDescriptor (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR, PROCEDURE VARCHAR, SKUID INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS RestockOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE INTEGER, STATE INTEGER, SUPPLIERID INTEGER)');
        sql.push('CREATE TABLE IF NOT EXISTS SKUItemsRestockOrder (ID INTEGER PRIMARY KEY AUTOINCREMENT, RESTOCKORDERID INTEGER, SKUITEMID VARCHAR, SKUID INTEGER, ITEMID INTEGER)');
        sql.forEach((x) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(x, [], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }))
        })

        return promises
    }

    createDefaultUsers() {

        const sql_User = 'INSERT or IGNORE INTO User(ID, NAME, SURNAME, TYPE, PASSWORD, EMAIL) VALUES(?, ?, ?, ?, ?, ?)';
        let users = [];
        const password = crypto.createHash('md5').update('testpassword').digest("hex");
        users.push({ id: 1, name: 'nome', surname: 'cognome', type: 'customer', password: password, email: 'user1@ezwh.com' });
        users.push({ id: 2, name: 'nome', surname: 'cognome', type: 'qualityEmployee', password: password, email: 'qualityEmployee1@ezwh.com' });
        users.push({ id: 3, name: 'nome', surname: 'cognome', type: 'clerk', password: password, email: 'clerk1@ezwh.com' });
        users.push({ id: 4, name: 'nome', surname: 'cognome', type: 'deliveryEmployee', password: password, email: 'deliveryEmployee1@ezwh.com' });
        users.push({ id: 5, name: 'nome', surname: 'cognome', type: 'supplier', password: password, email: 'supplier1@ezwh.com' });
        users.push({ id: 6, name: 'nome', surname: 'cognome', type: 'manager', password: password, email: 'manager1@ezwh.com' });

        let promises = [];
        users.forEach((user) => {
            promises.push(new Promise((resolve, reject) => {
                this.db.run(sql_User, [user.id, user.name, user.surname, user.type, user.password, user.email], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }))
        })
        return promises;
    }
}

module.exports = DAO;