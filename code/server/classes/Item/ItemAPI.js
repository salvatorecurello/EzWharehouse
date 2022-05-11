const ItemDAO = require("./ItemDao.js");
const Item = require("./Item.js");
const ItemDao = new ItemDAO();

module.exports = function(app){

    app.get('/api/items', async function(req, res){

        if(!req.session.loggedin || !req.session.user.type == 'manager' || !req.session.user.type == 'supplier')
            return res.status(401).end();
        
        const result = await ItemDao.getItems();

        return res.status(200).json(result);
    });

    app.get('/api/items/:id', async function(req, res){

        if(!req.session.loggedin || !req.session.user.type == 'manager' )
            return res.status(401).end();
        
        const id = req.params.id;
        if(id == undefined) {
            return res.status(422).end();
        }
        const result = await ItemDao.getItemByID(id);
        if(result == undefined)
            return res.status(404).end();

        return res.status(200).json(result);
    });

    app.post('/api/item', async function(req, res){

        if(!req.session.loggedin || !req.session.user.type == 'supplier')
            return req.status(401).end();
    
        const description = req.body.description;
        const price = req.body.price;
        const skuid = req.body.SKUId;
        const supplierID = req.body.supplierId;
        const item = {description: description, price: price, skuid: skuid, supplierID: supplierID};
        for(x in item)
            if( x == undefined)
                return res.status(422).end();
        
        const result = await ItemDao.storeItem(item);
        if(result == 0) 
            return res.status(422).end();
        return res.sendStatus(201);
    });

    app.put('/api/item/:id', async function(req, res){

        if(!req.session.loggedin || !req.session.user.type == 'supplier')
            return req.status(401).end();
    

        const id = req.params.id;
        const itemSelected = await ItemDao.getItemByID(id);

        if(itemSelected == undefined)
            return res.status(404).end();
        
        const new_price = req.body.newPrice;
        const newDescription = req.body.newDescription;
        const new_ID = req.body.newID;
        let c = 0;

        if(new_price !== undefined) {
            itemSelected.PRICE = new_price;
            c++;
        }
        if(newDescription !== undefined) {
            itemSelected.DESCRIPTION = newDescription;
            c++;
        }
        if(new_ID !== undefined) {
            itemSelected.ID = new_ID;
            c++;
        }
        if(c == 3)
            return res.status(422).end()
        
        const new_item = {id: itemSelected.ID, description: itemSelected.DESCRIPTION, price: itemSelected.PRICE, skuid: itemSelected.SKUID, supplierID: itemSelected.SUPPLIERID};
        await ItemDao.deleteItem(id);
        await ItemDao.storeItem(new_item);
        

        return res.sendStatus(200);
    });

    app.delete('/api/items/:id', async function(req, res){

        if(!req.session.loggedin || !req.session.user.type == 'supplier')
            return req.status(401).end();

        const itemId = req.params.id;
        if(itemId == undefined)
            res.status(422).end();
        
        const result = await ItemDao.deleteItem(itemId);

        return res.sendStatus(204);
    });

    
}