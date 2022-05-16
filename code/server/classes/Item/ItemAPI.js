const ItemDAO = require("./ItemDao.js");
const Item = require("./Item.js");
const ItemDao = new ItemDAO();

module.exports = function(app){

    app.get('/api/items', async function(req, res){

        const result = await ItemDao.getItems();
        if(result == undefined) 
            return res.status(500).end();
        return res.status(200).json(result);
    });

    app.get('/api/items/:id', async function(req, res){
        
        const id = req.params.id;
        if(id < 0 ) {
            return res.status(422).end();
        }
        const result = await ItemDao.getItemByID(id);
        if(result == undefined)
            return res.status(404).json("error");

        return res.status(200).json(result);
    });

    //Supplier sells an item with the same ID?
    app.post('/api/item', async function(req, res){

        const description = req.body.description;
        const price = req.body.price;
        const skuid = req.body.SKUId;
        const supplierID = req.body.supplierId;
        const id = req.body.id;
        
        const item = {id: id, description: description, price: price, skuid: skuid, supplierID: supplierID};
        for(x in item)
            if( x == undefined)
                return res.status(422).end();
        const res1 = await ItemDao.retrieveSku(skuid);
        if(res1 == undefined) {
            return res.status(404).end();
        }
        const r = await ItemDao.storeItem(item);
        if(r.lastID != id || r.changes == 0)
            return res.status(503).end();
        
        return res.sendStatus(201);
    });

    app.put('/api/item/:id', async function(req, res){

        const id = req.params.id;
        const itemSelected = await ItemDao.getItemByID(id);

        if(itemSelected == undefined)
            return res.status(404).end();
        
        const new_price = req.body.newPrice;
        const newDescription = req.body.newDescription;
        const new_ID = req.body.newID;
        
        if(new_price != undefined) {
            itemSelected.PRICE = new_price;
        }
        if(newDescription != undefined) {
            itemSelected.DESCRIPTION = newDescription;
        }
        if(new_ID != undefined) {
            itemSelected.ID = new_ID;
        }
        
        const new_item = {id: itemSelected.ID, description: itemSelected.DESCRIPTION, price: itemSelected.PRICE, skuid: itemSelected.SKUID, supplierID: itemSelected.SUPPLIERID};
        await ItemDao.updateItem(new_item);

        return res.sendStatus(200);
    });

    //Changes == 0
    app.delete('/api/items/:id', async function(req, res){
        
        const itemId = req.params.id;
        if(itemId == undefined );
            res.status(422).end();
        
        const result = await ItemDao.deleteItem(itemId);
        if(result.changes == 0)
            res.status(503).end();

        return res.sendStatus(204);
    });

    
}