const TestDescriptorDAO = require("./TestDescriptorDAO.js");
const TestDescriptor = require("./TestDescriptor.js");
const TestDescriptordao=new TestDescriptorDAO();
module.exports = function(app){

    app.get('/api/testDescriptors', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            const testdescriptors = await TestDescriptordao.getTestDescriptors();
            return res.status(200).json(testdescriptors);
        }else{
            return res.sendStatus(401);
        }
    });

    app.get('/api/testDescriptors/:id', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            const id = parseInt(req.params.id);
            if(id){
                const testdescriptor = await TestDescriptordao.getTestDescriptorsByID(id);
                if(testdescriptor!=null){
                    return res.status(200).json(testdescriptor);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    app.post('/api/testDescriptor', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            if(req.body.name && req.body.procedureDescription && req.body.idSKU){
                if(await TestDescriptordao.isSKUidValid(req.body.idSKU)){
                    await TestDescriptordao.storeTestDescriptor(req.body);
                    return res.sendStatus(201);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    app.put('/api/testDescriptor/:id', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            const id = parseInt(req.params.id);
            if(id && req.body.newName && req.body.newProcedureDescription && req.body.newIdSKU){
                if(await TestDescriptordao.getTestDescriptorsByID(id)!=null){
                    if(await TestDescriptordao.isSKUidValid(req.body.newIdSKU)){
                        await TestDescriptordao.updateTestDescriptor(req.body, id);
                        return res.sendStatus(200);
                    }
                    return res.sendStatus(404);
                }
                return res.sendStatus(422);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    app.delete('/api/testDescriptor/:id', async function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            const id = parseInt(req.params.id);
            if(id){
                const testdescriptor = await TestDescriptordao.getTestDescriptorsByID();
                if(testdescriptor!=null){
                    await TestDescriptordao.deleteTestDescriptor(id);
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