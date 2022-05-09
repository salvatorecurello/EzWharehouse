const SKUDAO = require("./SKUDAO.js");
const SKU = require("./SKU.js");
const skudao=new SKUDAO();

module.exports = function(app){

    // FUNZIONA
    app.get('/api/skus', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="customer" || req.session.user.type=="clerk")){
            const skus = await skudao.getSkus();
            return res.status(200).json(skus);
        }else{
            return res.sendStatus(401);
        }
    });

    // FUNZIONA
    app.get('/api/skus/:id', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    return res.status(200).json(sku);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    // FUNZIONA
    app.post('/api/sku', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.body.description && req.body.weight && req.body.volume && req.body.notes && req.body.price && req.body.availableQuantity){
                await skudao.storeSKU(req.body);
                return res.sendStatus(201);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    // FUNZIONA MA SI DEVE VERIFICARE CON POSITION, POSITION SAREBBE L'ID???
    // Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
    // (if the SKU is associated to a position) are modified according to the new available quantity.
    app.put('/api/sku/:id', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id && req.body.newDescription && req.body.newWeight && req.body.newVolume && req.body.newNotes && req.body.newPrice && req.body.newAvailableQuantity){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    if(sku.availableQuantity!=req.body.newAvailableQuantity){
                        if(sku.position != null){
                            const weight = req.body.newAvailableQuantity * req.body.newWeight;
                            const volume = req.body.newAvailableQuantity * req.body.newVolume;
                            await skudao.updateSKUWeightVolume(sku.position, weight, volume);
                        }
                    }
                    await skudao.updateSKU(req.body, req.params.id);
                    return res.sendStatus(200);
                }
                    return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    // RIVEDERE MEGLIO
    // Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and 
    // occupiedVolume fields of the position are modified according to the available quantity.
    app.put('/api/sku/:id/position', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id && req.body.position){
                const sku = await skudao.getSKUByID(req.params.id)
                if(sku!=null){
                    const weight = sku.availableQuantity * sku.weight;
                    const volume = sku.availableQuantity * sku.volume;
                    // controllare posizione await skudao.existing rfid
                    if(sku.position != null){
                        await skudao.modifySKUPosition(req.body.position, req.params.id); 
                        await skudao.updatePositionWeightVolume(req.body.position, weight, volume);
                        await skudao.updatePositionWeightVolume(sku.position, 0, 0);
                        } else {
                        await skudao.addPosition(req.body.position, req.params.id); 
                        await skudao.updatePositionWeightVolume(req.body.position, weight, volume);
                    } 
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
    app.delete('/api/skus/:id', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    await skudao.deleteSKU(req.params.id);
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