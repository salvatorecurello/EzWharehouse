const InternalOrder = require('./InternalOrder.js');
const dayjs = require('dayjs');
class InternalOrderDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
    }

    changeState(id, state){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE InternalOrder SET STATE = ? WHERE ID = ?';
            this.db.run(sql, [state, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
                
            });
        });
    }

    storeInternalOrder(internalOrder) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO InternalOrder(ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?)';
            
            this.db.run(sql, [internalOrder.date, 0,internalOrder.customerID], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
                
            });
            
        });
    }

    storeProducts(prod) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Product(ORDERID,SKUID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?, ?)';
                this.db.run(sql, [prod.orderID, prod.SKUId, prod.description,prod.price,prod.qty], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
        });
    }


    getProducts() {
        return new Promise((resolve, reject) => {
            const sql_products = 'SELECT P.*, S.RFID FROM PRODUCT P, SKUITEM S WHERE S.SKUID == P.SKUID';
            const products = [];

            this.db.all(sql_products, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    rows.forEach((e) => {products.push({skuid: e.SKUID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QTY, orderID: e.ORDERID, rfid: e.RFID})});
                    resolve(products);
                }
                
            });
        });

    }
    getInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql_internalOrder = 'SELECT * FROM INTERNALORDER O';
            const internalOrders = [];
            const states = {0 : 'ISSUED', 1: 'ACCEPTED', 2: 'REFUSED', 3: 'CANCELED', 4: 'COMPLETED'};

            this.db.all(sql_internalOrder, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    rows.forEach((e) => {internalOrders.push({id: e.ID, issueDate: e.ISSUEDATE, state: states[e.STATE], customerID: e.CUSTOMERID})});
                    resolve(internalOrders);
                }
                
            });
        });
    }

    getInternalOrderByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM InternalOrder WHERE ID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if(rows.length==0){
                    resolve(undefined);
                }else{
                    const internalOrd = new InternalOrder({id: rows[0].ID, issueDate: rows[0].ISSUEDATE, state: rows[0].STATE, customerID: rows[0].CUSTOMERID, products: []});
                    resolve(internalOrd);
                }
            });
        });

    }


    deleteInternalOrder(InternalOrderId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM InternalOrder WHERE ID == ?';
            this.db.run(sql, [InternalOrderId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(InternalOrderId);
                }
                

            });
        });

    }

    searchProductForSkuID(skuId) {
        return new Promise((resolve, reject) => {
        const sql_rfid = 'SELECT RFID FROM SKUItem WHERE SKUID == ?';
            this.db.run(sql_rfid, [skuId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
                
            });
        });
    }

    storeSKUItem(SkuID, RFID) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUItem (RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [RFID, SkuID, 1, dayjs().unix()], (err) => {
                if (err) {
                  reject(err);
                } else {
                    resolve(this.lastID);
                }
                
            });

        });
    }

    getUserByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM user WHERE ID = ? and type = ?';
            this.db.all(sql, [id, 'customer'], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if(rows.length==0){
                    resolve(undefined);
                }else{
                    resolve(true);
                }
            });
        });
    }
}

module.exports = InternalOrderDAO;
