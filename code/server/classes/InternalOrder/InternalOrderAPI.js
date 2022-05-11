const InternalOrderDAO = require("./InternalOrderDAO.js");
const InternalOrder = require("./InternalOrder.js");
InternalOrderDao = new InternalOrderDAO();

module.exports = function (app) {

    app.get('/api/internalOrders', async function (req, res) {

        if(!req.session.loggedin || !req.session.user.type == 'manager')
            return res.status(401).end();

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        let productsAndOrder = [];

        internalOrders.forEach(e => {
            if (e.state !== 'COMPLETED')
                products.forEach(p => {
                    if (p.orderID == e.id)
                        productsToOrder.push({ id: p.id, description: p.description, price: p.price, rfid: p.rfid });
                });
            else
                products.forEach(p => {
                    if (p.orderID == e.id)
                        productsToOrder.push({ id: p.id, description: p.description, price: p.price, rfid: p.rfid, qty: p.qty });
                });
            e.products = productsToOrder;
            console.log(productsToOrder);
            productsAndOrder.push(e);
            productsToOrder = [];
        });

        return res.status(200).json(internalOrders);
    });

    app.get('/api/internalOrdersIssued', async function (req, res) {

        if(!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'customer')
            return res.status(401).end();

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        let productsAndOrder = [];

        internalOrders = internalOrders.filter(e => e.state === 'ISSUED');
        internalOrders.forEach(e => {
            products.forEach(p => {
                if (p.orderID == e.id)
                    productsToOrder.push({ id: p.id, description: p.description, price: p.price, rfid: p.rfid, qty: p.qty });
            });
            e.products = productsToOrder;
            productsAndOrder.push(e);
            productsToOrder = [];
        });

        return res.status(200).json(internalOrders);
    });

    app.get('/api/internalOrdersAccepted', async function (req, res) {
        if(!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'customer' || !req.session.user.type == 'Customer')
            return res.status(401).end();

        let internalOrders = await InternalOrderDao.getInternalOrders();
        let products = await InternalOrderDao.getProducts();
        let productsToOrder = [];
        let productsAndOrder = [];

        internalOrders = internalOrders.filter(e => e.state === 'ACCEPTED');
        internalOrders.forEach(e => {
            products.forEach(p => {
                if (p.orderID == e.id)
                    productsToOrder.push({ id: p.id, description: p.description, price: p.price, rfid: p.rfid, qty: p.qty });
            });
            e.products = productsToOrder;
            productsAndOrder.push(e);
            productsToOrder = [];
        });

        return res.status(200).json(internalOrders);
    });

    app.get('/api/internalOrders/:id', async function (req, res) {

        if(!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'deliveryEmployee' )
            return res.status(401).end();
        if(req.params.id == undefined) {
            return res.status(422).end();
        }
            
        let internalOrder = await InternalOrderDao.getInternalOrderByID(req.params.id);
        if(internalOrder == undefined) {
            return res.status(404).end();
        } 
        let products = await InternalOrderDao.getProductForInternalOrder(req.params.id);

        if (internalOrder.state !== 'COMPLETED')
            products.map(p => {
                let d = { id: p.id, description: p.description, price: p.price, rfid: p.rfid };
                return d;
            });
        else
            products.map(p => {
                let d = { id: p.id, description: p.description, price: p.price, rfid: p.rfid, qty: p.qty };
                return d;
            });

        return res.status(200).json(internalOrder);
    });

    app.post('/api/internalOrders', async function (req, res) {

        if(!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'customer' )
            return res.status(401).end();

        const date = req.body.issueDate;
        const products = req.body.products;
        const customerID = req.body.customerId;
        if(date == undefined || products == undefined || customerID == undefined)
            return res.status(422).end();

        await InternalOrderDao.storeInternalOrder({date: date, products: products, customerID: customerID});
        products.forEach(async function(e) {
            e.rfid = await searchRFID(e.SKUId);
            await storeProducts(e);
        });
        

        return res.status(201).end();
    });

    app.put('/api/internalOrders/:id', async function (req, res) {
        
        if(!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'deliveryEmployee'|| !req.session.user.type == 'Internal Customer' )
            return res.status(401).end();


        const newState = req.body.newState;
        const id = req.params.id;
        if(id == undefined || newState == undefined)
            return res.status(422).end();
        
        let result = await InternalOrderDao.changeState(id, newState);
        if(result == 0)
            return res.status(404).end();

        if(newState == 'COMPLETED') {
            let products = req.body.products;
            products.forEach(async function(e) {
                e.rfid = await searchRFID(e.SKUId);
                await storeProducts(e);
            });
        }
            
        return res.sendStatus(200);
    });

    app.delete('/api/internalOrders/:id', async function (req, res) {

        if(!req.session.loggedin || !req.session.user.type == 'manager' )
            return res.status(401).end();

        const id = req.params.id;
        if(id == undefined)
            return res.status(422).end();
        
        await InternalOrderDao.deleteInternalOrder(id);

        return res.sendStatus(204);
    });


}