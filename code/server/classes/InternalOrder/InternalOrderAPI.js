const InternalOrderDAO = require("./InternalOrderDAO.js");
const InternalOrder = require("./InternalOrder.js");
InternalOrderDao = new InternalOrderDAO();

module.exports = function (app) {

    app.get('/api/internalOrders', async function (req, res) {

        if (!req.session.loggedin || !req.session.user.type == 'manager')
            return res.status(401).end();

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();

        let productsToOrder = [];


        internalOrders.forEach(e => {
            if (e.state != 4) {
                products.forEach(p => {
                    if (e.id == p.orderID)
                        productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, qty: p.qty });
                });
            } else {
                products.forEach(p => {
                    if (e.id == p.orderID)
                        productsToOrder.push({ skuid: p.skuid, description: p.description, price: p.price, rfid: p.rfid });
                });
                e.products = productsToOrder;
                productsToOrder = [];
            }
        });

        return res.status(200).json(internalOrders);
    });

    app.get('/api/internalOrdersIssued', async function (req, res) {

        if (!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'customer')
            return res.status(401).end();

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        internalOrdersIssued = [];

        internalOrders.forEach(e => {
            if (e.state == 0) {
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
        if (!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'customer' || !req.session.user.type == 'Customer')
            return res.status(401).end();

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        internalOrdersAccepted = [];

        internalOrders.forEach(e => {
            if (e.state == 1) {
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

        if (!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'deliveryEmployee')
            return res.status(401).end();
        if (req.params.id == undefined) {
            return res.status(422).end();
        }

        let internalOrder = await InternalOrderDao.getInternalOrderByID(req.params.id);
        if (internalOrder == undefined) {
            return res.status(404).end();
        }
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];

        if (internalOrder.state != 4) {
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

        // if (!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'customer')
        //     return res.status(401).end();

        const date = req.body.issueDate;
        const products = req.body.products;
        const customerID = req.body.customerId;
        // if (date == undefined || products == undefined || customerID == undefined)
        //     return res.status(422).end();
        
        const id = await InternalOrderDao.storeInternalOrder({ date: date, products: products, customerID: customerID });
        
        products.forEach(async function (e) {
            e.rfid = await InternalOrderDao.searchRFID(e.SKUId);
            await InternalOrderDao.storeProducts(e);
        });


        return res.status(201).json(id);
    });

    app.put('/api/internalOrders/:id', async function (req, res) {

        if (!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'deliveryEmployee' || !req.session.user.type == 'Internal Customer')
            return res.status(401).end();


        const newState = req.body.newState;
        const id = req.params.id;
        if (id == undefined || newState == undefined)
            return res.status(422).end();

        let result = await InternalOrderDao.changeState(id, newState);
        if (result == 0)
            return res.status(404).end();

        if (newState == 'COMPLETED') {
            let products = req.body.products;
            products.forEach(async function (e) {
                e.rfid = await InternalOrderDao.searchRFID(e.SKUId);
                await InternalOrderDao.storeProducts(e);
            });
        }

        return res.sendStatus(200);
    });

    app.delete('/api/internalOrders/:id', async function (req, res) {

        if (!req.session.loggedin || !req.session.user.type == 'manager')
            return res.status(401).end();

        const id = req.params.id;
        if (id == undefined)
            return res.status(422).end();

        await InternalOrderDao.deleteInternalOrder(id);

        return res.sendStatus(204);
    });


}