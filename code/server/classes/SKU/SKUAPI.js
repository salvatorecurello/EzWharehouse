const SKUDAO = require("./SKUDAO.js");
const SKU = require("./SKU.js");
const skudao=new SKUDAO();

module.exports = function(app){

    app.get('/api/skus', async function(req, res){
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="customer" || req.session.user.type=="clerk")){
            const skus = await skudao.getSkus();
            for(let sku of skus){
                // const t = await skudao.getTestDescriptorsBySKUID(sku.id)
                // (Object.keys(t).map(function(_) { return t[_]; })
                // ??????
                sku.setTestDescriptorIDList(await skudao.getTestDescriptorsBySKUID(sku.id));
            }
            
            return res.status(200).json(skus);
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.get('/api/skus/:id', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id!=undefined){ 
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    sku.setTestDescriptorIDList(await skudao.getTestDescriptorsBySKUID(sku.id));
                    return res.status(200).json(sku);
                }
                return res.status(404).end();
            }
            return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.post('/api/sku', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.body.description!=undefined && req.body.weight!=undefined && req.body.volume!=undefined && req.body.notes!=undefined && req.body.price!=undefined && req.body.availableQuantity!=undefined){
                await skudao.storeSKU(req.body);
                return res.status(201).end();
            }
            return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.put('/api/sku/:id', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id!=undefined && req.body.newDescription!=undefined && req.body.newWeight!=undefined && req.body.newVolume!=undefined && req.body.newNotes!=undefined && req.body.newPrice!=undefined && req.body.newAvailableQuantity!=undefined){
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
                                return res.status(422).end();
                            }
                        }
                    }
                    await skudao.updateSKU(req.body, req.params.id);
                    return res.status(200).end();
                }
                    return res.status(404).end();
            }
            return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.put('/api/sku/:id/position', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id!=undefined && req.body.position!=undefined){
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
                            return res.status(200).end();
                            }
                        return res.status(422).end();
                    } else {
                        return res.status(422).end();    
                    }  
                }
                return res.status(404).end();
            }
            return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.delete('/api/skus/:id', async function(req, res){
        //if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.params.id!=undefined){
                const sku = await skudao.getSKUByID(req.params.id);
                if(sku!=null){
                    if(await skudao.existingSKUItem(req.params.id)){
                        return res.status(422).end();
                    } else {
                    await skudao.deleteSKU(req.params.id);
                    return res.status(204).end();
                    }
                }
                return res.status(422).end();
            }
            return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

}