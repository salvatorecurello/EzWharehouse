const TestDescriptorDAO = require("./TestDescriptorDAO.js");
const TestDescriptor = require("./TestDescriptor.js");
db=new TestDescriptorDAO();

module.exports = function(app){

    app.get('/api/testDescriptors', function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            const testdescriptors = await db.getTestDescriptors();
            return res.status(200).json(testdescriptors);
        }else{
            return res.sendStatus(401);
        }
    });

    app.get('/api/testDescriptors/:id', function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            if(req.params.id){
                const testdescriptor = await db.getTestDescriptorsByID();
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

    app.post('/api/testDescriptor', function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            if(req.body.name && req.body.procedureDescription && req.body.idSKU){
                if(await db.isSKUidValid(req.body.idSKU)){
                    await db.storeTestDescriptor(req.body);
                    return res.sendStatus(201);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(422);
        }else{
            return res.sendStatus(401);
        }
    });

    app.put('/api/testDescriptor/:id', function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            if(req.params.id && req.body.newName && req.body.newProcedureDescription && req.body.newIdSKU){
                if(await db.getTestDescriptorsByID(req.params.id)!=null){
                    if(await db.isSKUidValid(req.body.newIdSKU)){
                        await db.updateTestDescriptor(req.body, req.params.id);
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

    app.delete('/api/testDescriptor/:id', function(req, res){
        if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
            if(req.params.id){
                const testdescriptor = await db.getTestDescriptorsByID();
                if(testdescriptor!=null){
                    await db.deleteTestDescriptor(req.params.id);
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