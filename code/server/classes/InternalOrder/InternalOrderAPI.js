const InternalOrderDAO = require("./InternalOrderDAO.js");
const UserDAO = require("../User/UserDAO");
const SkuItemDAO = require("../SKUItem/SKUItemDAO");
const SkuDao = require("../SKU/SKUDAO");
const skuDao = new SkuDao();
const dayjs = require("dayjs");
const SkuItemDao = new SkuItemDAO();
const InternalOrderDao = new InternalOrderDAO();
const UserDao = new UserDAO();

module.exports = function (app) {

    app.get('/api/internalOrders', async function (req, res) {
        try {
            let internalOrders = await InternalOrderDao.getInternalOrders();
            let products = await InternalOrderDao.getProducts();

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
        } catch (error) {
            return res.status(500).end();
        }

    });

    app.get('/api/internalOrdersIssued', async function (req, res) {
        try {

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


        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/internalOrdersAccepted', async function (req, res) {
        try {

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

        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/internalOrders/:id', async function (req, res) {
        try {
            if (req.params.id == undefined) {
                return res.status(422).end();
            }
            let internalOrder = await InternalOrderDao.getInternalOrderByID(parseInt(req.params.id));
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
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/internalOrders', async function (req, res) {
        try {
            const date = req.body.issueDate;
            const products = req.body.products;
            const customerID = req.body.customerId;
            if (date == undefined || products == undefined || customerID == undefined)
                return res.status(422).end();
            var d1 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;
            var d2 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

            if (!d1.test(date) && !d2.test(date)) {
                return res.status(422).end();
            }
            let dayjsdate = dayjs(date);
            if (!dayjsdate.isValid()) {
                return res.status(422).end();
            }
            dayjsdate = dayjsdate.unix();

            let user = await UserDao.getUserFromId(customerID);

            if (user == undefined) {
                return res.status(422).end();
            }

            let skuItems = await SkuItemDao.getSKUItems();

            let valid = true;
            products.forEach(async function (e) {
                let a = await skuDao.getSKUByID(e.SKUId);
                if(a == null || a.availableQuantity<e.qty){
                    valid = false;
                }
            })
            if (!valid) {
                return res.status(422).end();
            }
            
            products.forEach(async function (e) {
                let a = await skuDao.getSKUByID(e.SKUId);
                await updateSKU({newDescription:a.description, newNotes:a.notes, newPrice:a.price, newWeight:a.weight, newVolume:a.volume, newAvailableQuantity: a.availableQuantity-e.qty}, a.id)
                const newWeight = a.weight*(a.availableQuantity-e.qty);
                const newVolume = a.volume*(a.availableQuantity-e.qty);
                await skuDao.updatePositionWeightVolume(a.position, newWeight, newVolume);
            })
            const id = await InternalOrderDao.storeInternalOrder({ date: dayjsdate, state: 0, customerID: customerID });

            products.forEach(async function (e) {
                e.orderID = id;
                await InternalOrderDao.storeProducts(e);
            });


            return res.status(201).end();
        } catch (error) {
            return res.status(500).end();
        }
    });


    app.put('/api/internalOrders/:id', async function (req, res) {
        try {

            const newState = req.body.newState;
            const id = req.params.id;

            if (id == undefined || newState == undefined) {
                return res.status(422).end();
            }

            let flag = false;
            const states = { 'ISSUED': 0, 'ACCEPTED': 1, 'REFUSED': 2, 'CANCELED': 3, 'COMPLETED': 4 };
            for (let x in states) {
                if (newState == x)
                    flag = true;
            }
            if (!flag) {
                return res.status(422).end();
            }


            let order = await InternalOrderDao.getInternalOrderByID(id);
            if (order == undefined) {
                return res.status(404).end();
            }
            
            // Se COMPLETED => per ogni skuitem dei products bisogna settare available=0
            
            // Se REFUSED o CANCELLED aumentare sku quantity di x per ogni sku passato, aumentare posizione peso e volume
            if (newState == 'COMPLETED') {
                let products = req.body.products;
                products.forEach(async function (e) {
                    let a = await SkuItemDao.getSKUItemByRFID(e.RFID);
                    // if (a == null) { 
                    //     return res.status(422).end();
                    // }
                });
                products.forEach(async function (e) {
                    let a = await SkuItemDao.getSKUItemByRFID(e.RFID);
                    await SkuItemDao.updateSKUItem({ newRFID: e.RFID, newAvailable: 0, newDateOfStock: a.DateOfStock});
                });
                await InternalOrderDao.changeState(id, newState);
            }else if (newState=="REFUSED" || newState=="CANCELLED"){
                products.forEach(async function (e) {
                    let a = await skuDao.getSKUByID(e.SKUId);
                    // if(a == null){
                    //     return res.status(422).end();
                    // }
                })
                products.forEach(async function (e) {
                    let a = await skuDao.getSKUByID(e.SKUId);
                    await updateSKU({newDescription:a.description, newNotes:a.notes, newPrice:a.price, newWeight:a.weight, newVolume:a.volume, newAvailableQuantity: a.availableQuantity+e.qty}, a.id)
                    const newWeight = a.weight*(a.availableQuantity+e.qty);
                    const newVolume = a.volume*(a.availableQuantity+e.qty);
                    await skuDao.updatePositionWeightVolume(a.position, newWeight, newVolume);
                })
                await InternalOrderDao.changeState(id, newState);
            }
            return res.status(200).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.delete('/api/internalOrders/:id', async function (req, res) { 
        try {

            const id = parseInt(req.params.id);
            if (id == undefined)
                return res.status(422).end();


            let internalOrder = await InternalOrderDao.getInternalOrderByID(id);
            if (internalOrder == undefined)
                return res.status(422).end();

            const result = await InternalOrderDao.deleteInternalOrder(id);
            if (!result)
                return res.status(503).end();

            return res.status(204).end();
        } catch (error) {
            return res.status(500).end();
        }
    });


}