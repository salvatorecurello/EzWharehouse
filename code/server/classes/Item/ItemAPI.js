const ItemDAO = require("./ItemDao.js");
const SkuDAO = require("../SKU/SKUDAO");
const UserDAO = require("../User/UserDAO");
const ItemDao = new ItemDAO();
const SkuDao = new SkuDAO();
const UserDao = new UserDAO();

module.exports = function (app) {

    app.get('/api/items', async function (req, res) {
        try {
            const result = await ItemDao.getItems();

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/items/:id/:supplierid', async function (req, res) {
        try {
            const id = req.params.id;
            const supplierId = req.params.supplierid;
            
            if (id < 0 || id == 'null') {
                return res.status(422).end();
            }

            if (supplierId < 0 || supplierId == 'null') {
                return res.status(422).end();
            }

            const result = await ItemDao.getItemByIDAndSupplierID(id, supplierId);
            if (result == undefined)
                return res.status(404).end();

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/item', async function (req, res) {
        try {
            
            const description = req.body.description;
            const price = req.body.price;
            const skuid = req.body.SKUId;
            const supplierID = req.body.supplierId;
            const id = req.body.id;
            
            const res1 = await SkuDao.getSKUByID(skuid);

            if (res1 == undefined) {
                return res.status(404).end();
            }

            let supp = await UserDao.getUserFromId(supplierID);
            if (supp == undefined) {
                return res.status(404).end();
            }

            let i = await ItemDao.getItemByIDAndSupplierID(id, supplierID);
            if (i != undefined) {
                return res.status(422).end();
            }
                

            var valid = true;

            let items = await ItemDao.getItemsBySupplier(supplierID);

            items.forEach(e => {
                if (e.SKUID == skuid)
                    valid = false;
            });

            if (!valid) {
                
                return res.status(422).end();
            }
                

            const item = { id: id, description: description, price: price, skuid: skuid, supplierID: supplierID };
            for (x in item)
                if (x == undefined) {
                    
                    return res.status(422).end();
                }
                    
            
            const r = await ItemDao.storeItem(item);


            return res.status(201).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.put('/api/item/:id/:supplierid', async function (req, res) {
        try {
            const id = parseInt(req.params.id);
            const supplierId = req.params.supplierid;

            const itemSelected = await ItemDao.getItemByIDAndSupplierID(id, supplierId);

            if (itemSelected == undefined)
                return res.status(404).end();

            const new_price = req.body.newPrice;
            const newDescription = req.body.newDescription;

            if (new_price != undefined) {
                itemSelected.PRICE = new_price;
            }
            if (newDescription != undefined) {
                itemSelected.DESCRIPTION = newDescription;
            }

            const new_item = { id: itemSelected.ID, description: itemSelected.DESCRIPTION, price: itemSelected.PRICE, skuid: itemSelected.SKUID, supplierID: itemSelected.SUPPLIERID };
            await ItemDao.updateItem(new_item);

            return res.status(200).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.delete('/api/items/:id/:supplierid', async function (req, res) {
        try {
            const itemId = parseInt(req.params.id);
            const supplierId = req.params.supplierid;
            
            if (itemId == undefined || supplierId == undefined) {
                return res.status(422).end();
            }
            const itemSelected = await ItemDao.getItemByIDAndSupplierID(itemId, supplierId);
            if (itemSelected == undefined) {
                return res.status(422).end();
            }
            await ItemDao.deleteItem(itemId);

            return res.status(204).end();
        } catch (error) {
            return res.status(500).end();
        }
    });


}