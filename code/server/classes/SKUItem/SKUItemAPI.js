const SKUItemDAO = require("./SKUItemDAO.js");
const SKUItem = require("./SKUItem.js");
const skuitemdao=new SKUItemDAO();

var d1 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;

var d2 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

module.exports = function(app){

    // FUNZIONA
    app.get('/api/skuitems', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            const skuitem = await skuitemdao.getSKUItems();
            return res.status(200).json(skuitem);
        }else{
            return res.sendStatus(401);
        }
    });

    // FUNZIONA
    app.get('/api/skuitems/sku/:id', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="customer")){
            if(req.params.id){
                const skuitem = await skuitemdao.getArraySKUItemByID(req.params.id);
                if(skuitem!=null){
                    return res.status(200).json(skuitem);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    // FUNZIONA
    app.get('/api/skuitems/:rfid', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.rfid){
                const skuitem = await skuitemdao.getSKUItemByRFID(req.params.rfid);
                if(skuitem!=null){
                    return res.status(200).json(skuitem);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    
    app.post('/api/skuitem', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="clerk")){
            if(req.body.RFID && req.body.SKUId && (d1.test(req.body.DateOfStock) || d2.test(req.body.DateOfStock) || req.body.DateOfStock == undefined)){
                if(await skuitemdao.isidSKUValid(req.body.SKUId)){
                    await skuitemdao.storeSKUItem(req.body);
                    return res.sendStatus(201);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    // FUNZIONA CONTROLLO RFID GIA ESISTENTE????
    app.put('/api/skuitems/:rfid', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.rfid && req.body.newRFID && req.body.newAvailable && (d1.test(req.body.DateOfStock) || d2.test(req.body.DateOfStock) || req.body.DateOfStock == null)){ 
                const skuitem = await skuitemdao.getSKUItemByRFID(req.params.rfid);
                if(skuitem!=null){
                    await skuitemdao.updateSKUItem(req.body, req.params.rfid);
                    return res.sendStatus(200);
                }
                return res.sendStatus(404);
            }
        return res.sendStatus(422);
        }else{
        return res.sendStatus(401);
        }
    });

    // FUNZIONA
    app.delete('/api/skuitems/:rfid', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.rfid){
                const skuitem = await skuitemdao.getSKUItemByRFID(req.params.rfid);
                if(skuitem!=null){
                    await skuitemdao.deleteSKUItem(req.params.rfid);
                    return res.sendStatus(204);
                }
                return res.sendStatus(422);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

}