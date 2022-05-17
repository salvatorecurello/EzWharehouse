const TestDescriptorDAO = require("./TestDescriptorDAO.js");
const TestDescriptor = require("./TestDescriptor.js");
const TestDescriptordao = new TestDescriptorDAO();
module.exports = function (app) {

    app.get('/api/testDescriptors', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const testdescriptors = await TestDescriptordao.getTestDescriptors();
        return res.status(200).json(testdescriptors);
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.get('/api/testDescriptors/:id', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const id = parseInt(req.params.id);
        if (id!=undefined) {
            const testdescriptor = await TestDescriptordao.getTestDescriptorsByID(id);
            if (testdescriptor != null) {
                return res.status(200).json(testdescriptor);
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.post('/api/testDescriptor', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        if (req.body.name!=undefined && req.body.procedureDescription!=undefined && req.body.idSKU!=undefined) {
            if (await TestDescriptordao.isSKUidValid(req.body.idSKU)) {
                await TestDescriptordao.storeTestDescriptor(req.body);
                return res.status(201).end();
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.put('/api/testDescriptor/:id', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const id = parseInt(req.params.id);
        if (id!=undefined && req.body.newName!=undefined && req.body.newProcedureDescription!=undefined && req.body.newIdSKU!=undefined) {
            if (await TestDescriptordao.getTestDescriptorsByID(id) != null) {
                if (await TestDescriptordao.isSKUidValid(req.body.newIdSKU)) {
                    await TestDescriptordao.updateTestDescriptor(req.body, id);
                    return res.status(200).end();
                }
                return res.status(404).end();
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.delete('/api/testDescriptor/:id', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const id = parseInt(req.params.id);
        if (id!=undefined) {
            const testdescriptor = await TestDescriptordao.getTestDescriptorsByID();
            if (testdescriptor != null) {
                await TestDescriptordao.deleteTestDescriptor(id);
                return res.status(204).end();
            }
            return res.status(422).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

}