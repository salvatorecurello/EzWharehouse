const SKUDAO = require("./SKUDAO.js");
const SKU = require("./SKU.js");
const skudao = new SKUDAO();

const PositionDAO = require("../Position/PositionDAO.js");
const Positiondao = new PositionDAO();

module.exports = function(app){

    app.get('/api/skus', async function (req, res) {
        try {
            //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="customer" || req.session.user.type=="clerk")){
            const skus = await skudao.getSkus();
            for (let sku of skus) {
                sku.setTestDescriptorIDList(await skudao.getTestDescriptorsBySKUID(sku.id));
            }

            return res.status(200).json(skus);
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/skus/:id', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.params.id != undefined && !isNaN(parseInt(req.params.id))) {
                const sku = await skudao.getSKUByID(req.params.id);
                if (sku != null) {
                    sku.setTestDescriptorIDList(await skudao.getTestDescriptorsBySKUID(sku.id));
                    return res.status(200).json(sku);
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

    app.post('/api/sku', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.body.id != undefined || req.body.description != undefined && req.body.weight != undefined && req.body.volume != undefined && req.body.notes != undefined && req.body.price != undefined && req.body.availableQuantity != undefined) {
                if(!Number.isInteger(req.body.id) && req.body.description==="" || req.body.notes==="" || typeof req.body.weight!="number" || !Number.isInteger(req.body.weight) || typeof req.body.volume!="number" || !Number.isInteger(req.body.volume) || typeof req.body.price!="number" || typeof req.body.availableQuantity!="number" || !Number.isInteger(req.body.availableQuantity) || req.body.weight<0 || req.body.volume<0 || req.body.price<0 || req.body.availableQuantity<0){
                    return res.status(422).end();
                }
                const sku = await skudao.getSKUByID(req.body.id);
                if(sku!=null){
                    return res.status(422).end();
                }
                await skudao.storeSKU(req.body);
                return res.status(201).end();
            }
            return res.status(422).end();
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.put('/api/sku/:id', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.params.id != undefined && !isNaN(parseInt(req.params.id)) && req.body.newDescription != undefined && req.body.newWeight != undefined && req.body.newVolume != undefined && req.body.newNotes != undefined && req.body.newPrice != undefined && req.body.newAvailableQuantity != undefined) {
                const sku = await skudao.getSKUByID(req.params.id);
                if (sku != null) {
                    if (sku.availableQuantity != req.body.newAvailableQuantity) {
                        if (sku.position != null) {
                            const weight = req.body.newAvailableQuantity * req.body.newWeight;
                            const volume = req.body.newAvailableQuantity * req.body.newVolume;
                            const pos = await skudao.existingPosition(sku.position)
                            if (pos.MAXWEIGHT >= weight && pos.MAXVOLUME >= volume) {
                                await skudao.updatePositionWeightVolume(sku.position, weight, volume);
                            }
                            else {
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
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.put('/api/sku/:id/position', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.params.id != undefined && !isNaN(parseInt(req.params.id)) && req.body.position != undefined) {
                const sku = await skudao.getSKUByID(req.params.id)
                if (sku != null) {
                    const weight = sku.availableQuantity * sku.weight;
                    const volume = sku.availableQuantity * sku.volume;
                    const pos = await Positiondao.getPositionByID(req.body.position)
                    if (pos!=undefined){ 
                        let x = await skudao.PositionOccupied(req.body.position);
                        if(pos.maxWeight>= weight && pos.maxVolume>= volume && x==undefined){ 
                            if(sku.position != null){
                                await skudao.modifySKUPosition(req.body.position, req.params.id); 
                                await skudao.updatePositionWeightVolume(req.body.position, weight, volume);
                                await skudao.updatePositionWeightVolume(sku.position, 0, 0);
                            } else {
                                await skudao.modifySKUPosition(req.body.position, req.params.id); 
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
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.delete('/api/skus/:id', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.params.id != undefined && !isNaN(parseInt(req.params.id))) {
                const sku = await skudao.getSKUByID(req.params.id);
                if (sku != null) {
                   /* if (await skudao.existingSKUItem(req.params.id)) {
                        return res.status(422).end();
                    }
                    if (await skudao.existingTestDescriptor(req.params.id)) {
                        return res.status(422).end();
                    }*/
                    if (sku.position != null) {
                        await skudao.updatePositionWeightVolume(sku.position, 0, 0);
                        await skudao.deleteSKU(req.params.id);
                        return res.status(204).end();
                    } else {
                        await skudao.deleteSKU(req.params.id);
                        return res.status(204).end();
                    }
                }
                return res.status(204).end();
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