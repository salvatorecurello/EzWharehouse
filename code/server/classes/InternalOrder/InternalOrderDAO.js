const InternalOrder = require('./InternalOrder.js');

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
                    return;
                }
                resolve(true);
            });
        });
    }

    storeInternalOrder(internalOrder) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO InternalOrder(ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?)';
            
            this.db.run(sql, [internalOrder.date, 0,internalOrder.customerID], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
            
        });
    }

    searchRFID(skuId) {
        return new Promise((resolve, reject) => {
        const sql_rfid = 'SELECT RFID FROM SKUITEM WHERE SKUID == ?';
            this.db.run(sql_rfid, [skuId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    storeProducts(prod) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Product(SKUID, DESCRIPTION, PRICE, QTY) VALUES(?, ?, ?, ?)';
                this.db.run(sql, [prod.rfid, prod.SKUId, prod.description,prod.price,prod.qty], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(prod);
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
                    return;
                }
                rows.forEach((e) => {products.push({skuid: e.SKUID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QTY, orderID: e.ORDERID, rfid: e.RFID})});
                resolve(products);
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
                    return;
                }
                rows.forEach((e) => {internalOrders.push({id: e.ID, issueDate: e.ISSUEDATE, state: states[e.STATE], customerID: e.CUSTOMERID})});
                resolve(internalOrders);
            });
        });
    }

    getInternalOrderByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM InternalOrder WHERE ID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrd = new InternalOrder({id: rows[0].ID, issueDate: rows[0].ISSUEDATE, state: rows[0].STATE, customerID: rows[0].CUSTOMERID, products: []});
                resolve(internalOrd);
            });
        });

    }


    deleteInternalOrder(InternalOrderId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM InternalOrder WHERE ID == ?';
            this.db.run(sql, [InternalOrderId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(InternalOrderId);

            });
        });

    }
}

module.exports = InternalOrderDAO;
