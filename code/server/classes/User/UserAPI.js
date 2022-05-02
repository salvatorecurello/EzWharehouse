const DAO = require("../../db.js");
db=new DAO();

module.exports = function(app){

    app.get('/api/userinfo', function(req, res){
        return res.status(200);
    });

    app.get('/api/suppliers', function(req, res){
        return res.status(200);
    });

    app.get('/api/users', async function(req, res){
        const data = await db.getUsers();
        return res.status(200).json(data);
    });

    app.post('/api/newUser', function(req, res){
        return res.status(200);
    });
    
    app.post('/api/managerSessions', function(req, res){
        return res.status(200);
    });

    app.post('/api/customerSessions', function(req, res){
        return res.status(200);
    });

    app.post('/api/supplierSessions', function(req, res){
        return res.status(200);
    });

    app.post('/api/clerkSessions', function(req, res){
        return res.status(200);
    });

    app.post('/api/qualityEmployeeSessions', function(req, res){
        return res.status(200);
    });

    app.post('/api/deliveryEmployeeSessions', function(req, res){
        return res.status(200);
    });

    app.post('/api/logout', function(req, res){
        return res.status(200);
    });

    app.put('/api/users/:username', function(req, res){
        return res.status(200);
    });

    app.delete('/api/users/:username/:type', function(req, res){
        return res.status(200);
    });

}