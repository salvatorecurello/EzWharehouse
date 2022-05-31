const SKUItemDAO = require("./SKUItemDAO.js");
const SKUItem = require("./SKUItem.js");
const SKUDAO = require("../SKU/SKUDAO.js");
const skuitemdao=new SKUItemDAO();
const SKUdao = new SKUDAO();

var d1 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;

var d2 = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

module.exports = function (app) {

    app.get('/api/skuitems', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            const skuitem = await skuitemdao.getSKUItems();
            return res.status(200).json(skuitem);
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            console.error(error)
            return res.status(500).end();
        }
    });

    app.get('/api/skuitems/sku/:id', async function(req, res){
        try{
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="customer")){
            if(req.params.id!=undefined && !isNaN(parseInt(req.params.id))){
                if(await SKUdao.getSKUByID(req.params.id)){
                    const skuitem = await skuitemdao.getArraySKUItemByID(req.params.id);
                    return res.status(200).json(skuitem);
                } else {
                    return res.status(404).end();
                }
            }
            return res.status(422).end();
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/skuitems/:rfid', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.params.rfid != undefined && req.params.rfid!=null && req.params.rfid!="null" ) {
                const skuitem = await skuitemdao.getSKUItemByRFID(req.params.rfid); 
                if (skuitem != null) {
                    return res.status(200).json(skuitem);
                }
                return res.status(404).end();
            }
            return res.status(422).end();
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });


    app.post('/api/skuitem', async function (req, res) {
        try {
            //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="clerk")){
            const rfid = req.body.RFID
            if(rfid!=undefined && rfid.length==32 && /^\d+$/.test(rfid) && req.body.SKUId!=undefined && (d1.test(req.body.DateOfStock) || d2.test(req.body.DateOfStock) || req.body.DateOfStock == null)){
                if(!(await SKUdao.getSKUByID(req.body.SKUId))){
                    return res.status(404).end();
                }
                else {
                    if(!(await skuitemdao.getSKUItemByRFID(rfid))){
                        await skuitemdao.storeSKUItem(req.body);
                        return res.status(201).end();
                    }
                    return res.status(422).end();
                }
            }
            return res.status(422).end();
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.put('/api/skuitems/:rfid', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            const rfid = req.params.rfid
            const newrfid = req.body.newRFID
            if(rfid!=undefined && newrfid && newrfid.length==32 && /^\d+$/.test(newrfid) && req.body.newAvailable!=undefined && (d1.test(req.body.newDateOfStock) || d2.test(req.body.newDateOfStock) || req.body.newDateOfStock == undefined)){  
                if (rfid != newrfid){
                    if(await skuitemdao.getSKUItemByRFID(newrfid)){
                        return res.status(422).end();
                    }
                }
                const skuitem = await skuitemdao.getSKUItemByRFID(req.params.rfid);
                if (skuitem != null) {
                    await skuitemdao.updateSKUItem(req.body, req.params.rfid);
                    return res.status(200).end();
                }
                return res.status(404).end();
            } else {
                return res.status(422).end();
            }

            //}else{
            //return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.delete('/api/skuitems/:rfid', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.params.rfid != undefined) {
                const skuitem = await skuitemdao.getSKUItemByRFID(req.params.rfid);
                if (skuitem != null) {
                    await skuitemdao.deleteSKUItem(req.params.rfid);
                    return res.status(204).end();
                }
                return res.status(422).end();
            }
            return res.status(422).end();
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

}