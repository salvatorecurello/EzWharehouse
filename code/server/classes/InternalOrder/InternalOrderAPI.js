const InternalOrderDAO = require("./InternalOrderDAO.js");
const InternalOrder = require("./InternalOrder.js");
InternalOrderDao = new InternalOrderDAO();

module.exports = function (app) {

    app.get('/api/internalOrders', async function (req, res) {

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        console.log(products);

        let productsToOrder = [];

        internalOrders.forEach(e => {
            if (e.state != 'COMPLETED') {
                products.forEach(p => {
                    if (e.id == p.orderID) {
                        productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, qty: p.qty });
                    }       
                });
            } else {
                products.forEach(p => {
                    if (e.id == p.orderID)
                        productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, rfid: p.rfid });
                });
            }
            e.products = productsToOrder;
            productsToOrder = [];
        });

        return res.status(200).json(internalOrders);
    });

    app.get('/api/internalOrdersIssued', async function (req, res) {

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        internalOrdersIssued = [];

        internalOrders.forEach(e => {
            if (e.state == 'ISSUED') {
                products.forEach(p => {
                    if (e.id == p.orderID)
                        productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, qty: p.qty });

                });
                e.products = productsToOrder;
                internalOrdersIssued.push(e);
                productsToOrder = [];
            }
        });
        return res.status(200).json(internalOrdersIssued);


    });

    app.get('/api/internalOrdersAccepted', async function (req, res) {

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        internalOrdersAccepted = [];

        internalOrders.forEach(e => {
            if (e.state == 'ACCEPTED') {
                products.forEach(p => {
                    if (e.id == p.orderID)
                        productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, qty: p.qty });

                });
                e.products = productsToOrder;
                internalOrdersAccepted.push(e);
                productsToOrder = [];
            }
        });
        return res.status(200).json(internalOrdersAccepted);

    });

    app.get('/api/internalOrders/:id', async function (req, res) {

        if (req.params.id == undefined) {
            return res.status(422).end();
        }

        let internalOrder = await InternalOrderDao.getInternalOrderByID(req.params.id);
        if (internalOrder == undefined) {
            return res.status(404).end();
        }
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];

        if (internalOrder.state != 'COMPLETED') {
            products.forEach(p => {
                if (internalOrder.id == p.orderID)
                    productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, qty: p.qty });
            });
        } else {
            products.forEach(p => {
                if (internalOrder.id == p.orderID)
                    productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, rfid: p.rfid });
            });
        }
        internalOrder.products = productsToOrder;

        return res.status(200).json(internalOrder);
    });

    app.post('/api/internalOrders', async function (req, res) {

        
        const date = req.body.issueDate;
        const products = req.body.products;
        const customerID = req.body.customerId;
        if (date == undefined || products == undefined || customerID == undefined)
            return res.status(422).end();
        var d1 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;
        var d2 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if(!d1.test(date) && !d2.test(date)){
            return res.status(422).end();
        }
        
        let user = await InternalOrderDao.getUserByID(customerID);
        if(user == undefined) {
            return res.status(422).end();
        }

        var valid=true;
        products.forEach(async function(e){
            let a = await InternalOrderDao.searchProductForSkuID(e.SKUId);
            if(a == undefined || e.description == undefined || e.price == undefined || e.qty == undefined) {
                valid=false;
            }
        } )
        if(!valid){
            return res.status(422).end();
        }

        const id = await InternalOrderDao.storeInternalOrder({ date: date, state: 0, customerID: customerID });
    
        products.forEach(async function (e) {
            e.orderID = id;
            await InternalOrderDao.storeProducts(e);
        });


        return res.status(201).end();
    });


     app.put('/api/internalOrders/:id', async function (req, res) {

         const newState = req.body.newState;
         const id = req.params.id;
         if (id == undefined || newState == undefined){
            return res.status(422).end();
         }

        let flag = false;
         const states = { 'ISSUED': 0, 'ACCEPTED': 1, 'REFUSED': 2, 'CANCELED': 3, 'COMPLETED': 4 };
         for(let x in states) {
            if(newState == x)
                flag = true;
         }
        if(!flag) {
            return res.status(422).end();
        }
            

        let order = await InternalOrderDao.getInternalOrderByID(id);
        if(order==undefined){
            return res.status(404).end();
        }
         await InternalOrderDao.changeState(id, newState);
         if (newState == 'COMPLETED') {
             let products = req.body.products;
             products.forEach(async function (e) {
                 await InternalOrderDao.storeSKUItem(e.SkuID, e.RFID)
             });
         }

         return res.status(200).end();
     });

    app.delete('/api/internalOrders/:id', async function (req, res) {

        const id = req.params.id;
        if (id == undefined)
            return res.status(422).end();
        

        let internalOrder = await InternalOrderDao.getInternalOrderByID(id);
        if (internalOrder == undefined)
            return res.status(422).end();

        const result = await InternalOrderDao.deleteInternalOrder(id);
        if(!result)
            return res.status(503).end();

        return res.status(204).end();
    });


}