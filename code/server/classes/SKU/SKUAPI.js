const SKUDAO = require("./SKUDAO.js");
const SKU = require("./SKU.js");
const skudao=new SKUDAO();

module.exports = function(app){

    app.get('/api/skus', async function(req, res){
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="customer" || req.session.user.type=="clerk")){
            const skus = await skudao.getSkus();
            for(let sku of skus){
                sku.setTestDescriptorIDList(await skudao.getTestDescriptorsBySKUID(sku.id));
            }
            
            return res.status(200).json(skus);
        //}else{
        //    return res.sendStatus(401);
        //}
    });

    app.get('/api/skus/:id', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    sku.setTestDescriptorIDList(await skudao.getTestDescriptorsBySKUID(sku.id));
                    return res.status(200).json(sku);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        //}else{
        //    return res.sendStatus(401);
        //}
    });

    app.post('/api/sku', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.body.description && req.body.weight && req.body.volume && req.body.notes && req.body.price && req.body.availableQuantity){
                await skudao.storeSKU(req.body);
                return res.sendStatus(201);
            }
            return res.sendStatus(422);
        //}else{
        //    return res.sendStatus(401);
        //}
    });

    app.put('/api/sku/:id', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id && req.body.newDescription && req.body.newWeight && req.body.newVolume && req.body.newNotes && req.body.newPrice && req.body.newAvailableQuantity){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    if(sku.availableQuantity!=req.body.newAvailableQuantity){
                        if(sku.position != null){
                            const weight = req.body.newAvailableQuantity * req.body.newWeight;
                            const volume = req.body.newAvailableQuantity * req.body.newVolume;
                            const pos = await skudao.existingPosition(sku.position)
                            if(pos.MAXWEIGHT>=weight && pos.MAXVOLUME>= volume){
                                await skudao.updatePositionWeightVolume(sku.position, weight, volume);
                            }
                            else{
                                return res.sendStatus(422);
                            }
                        }
                    }
                    await skudao.updateSKU(req.body, req.params.id);
                    return res.sendStatus(200);
                }
                    return res.sendStatus(404);
            }
            return res.sendStatus(422);
        //}else{
        //    return res.sendStatus(401);
        //}
    });

    app.put('/api/sku/:id/position', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id && req.body.position){
                const sku = await skudao.getSKUByID(req.params.id)
                if(sku!=null){
                    const weight = sku.availableQuantity * sku.weight;
                    const volume = sku.availableQuantity * sku.volume;
                    const pos = await skudao.existingPosition(req.body.position)
                    if (pos!=undefined){ 
                        if(pos.MAXWEIGHT>= weight && pos.MAXVOLUME>= volume && await skudao.PositionOccupied(pos.ID)==0){
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
                        return res.sendStatus(422);
                    } else {
                        return res.sendStatus(422);    
                    }  
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        //}else{
        //    return res.sendStatus(401);
        //}
    });

    app.delete('/api/skus/:id', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    if(await skudao.existingSKUItem(req.params.id)){
                        return res.sendStatus(422);
                    } else {
                    await skudao.deleteSKU(req.params.id);
                    return res.sendStatus(204);
                    }
                }
                return res.sendStatus(422);
            }
            return res.sendStatus(422);
        //}else{
        //    return res.sendStatus(401);
        //}
    });

}