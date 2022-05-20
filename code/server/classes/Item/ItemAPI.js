const ItemDAO = require("./ItemDao.js");
const SkuDAO = require("../SKU/SKUDAO");
const UserDAO = require("../User/UserDAO");
const ItemDao = new ItemDAO();
const SkuDao = new SkuDAO();
const UserDao = new UserDAO();

module.exports = function(app){

    app.get('/api/items', async function(req, res){

        const result = await ItemDao.getItems();
        
        return res.status(200).json(result);
    });

    app.get('/api/items/:id', async function(req, res){
        
        const id = parseInt(req.params.id);
        if(id < 0 || id==undefined ) {
            return res.status(422).end();
        }
        const result = await ItemDao.getItemByID(id);
        if(result == undefined)
            return res.status(404).end();

        return res.status(200).json(result);
    });

    app.post('/api/item', async function(req, res){
        const description = req.body.description;
        const price = req.body.price;
        const skuid = req.body.SKUId;
        const supplierID = req.body.supplierId;
        const id = req.body.id;
        

        //Change with UserDao
        let supp = await UserDao.getUserFromId(supplierID);
        if(supp == undefined)
            return res.status(422).end();

        let i = await ItemDao.getItemByID(id);
        if(i != undefined) 
            return res.status(422).end();

        var valid = true;

        let items = await ItemDao.getItemsBySupplier(supplierID);

        items.forEach(e => {
            if(e.SKUID == skuid)
                valid = false;
        });

        if(!valid)
            return res.status(422).end();
        
        const item = {id: id, description: description, price: price, skuid: skuid, supplierID: supplierID};
        for(x in item)
            if( x == undefined)
                return res.status(422).end();
        
        //Retrieve with SkuDAO
        const res1 = await SkuDao.getSKUByID(skuid);

        if(res1 == undefined) {
            return res.status(404).end();
        }
        const r = await ItemDao.storeItem(item);

        
        return res.status(201).end();
    });

    app.put('/api/item/:id', async function(req, res){

        const id = parseInt(req.params.id);
        const itemSelected = await ItemDao.getItemByID(id);

        if(itemSelected == undefined)
            return res.status(404).end();
        
        const new_price = req.body.newPrice;
        const newDescription = req.body.newDescription;
        
        if(new_price != undefined) {
            itemSelected.PRICE = new_price;
        }
        if(newDescription != undefined) {
            itemSelected.DESCRIPTION = newDescription;
        }
        
        const new_item = {id: itemSelected.ID, description: itemSelected.DESCRIPTION, price: itemSelected.PRICE, skuid: itemSelected.SKUID, supplierID: itemSelected.SUPPLIERID};
        await ItemDao.updateItem(new_item);

        return res.status(200).end();
    });

    app.delete('/api/items/:id', async function(req, res){
        
        const itemId = parseInt(req.params.id);
        if(itemId == undefined );
            res.status(422).end();
        const itemSelected = await ItemDao.getItemByID(itemId);
        if(itemSelected==undefined){
            return res.status(422).end();
        }
        await ItemDao.deleteItem(itemId);


        return res.status(204).end();
    });

    
}