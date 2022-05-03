const { use } = require("chai");
const DAO = require("../../db.js");
const User = require("./User.js");
db=new DAO();

module.exports = function(app){

    app.get('/api/userinfo', async function(req, res){
        if(req.session.loggedin){
            const user = await db.getUserFromId(req.session.user.id);
            const data = {
                id: user.ID,
                username: user.EMAIL,
                name: user.NAME,
                surname: user.SURNAME,
                type: user.TYPE
            }
            return res.status(200).json(data);
        }
        return res.sendStatus(200);
    });

    app.get('/api/suppliers', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            const data = await db.getSuppliers();
            return res.status(200).json(data);
        }else{
            return res.sendStatus(401);
        }
    });

    app.get('/api/users', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            const data = await db.getUsers();
            return res.status(200).json(data);
        }else{
            return res.sendStatus(401);
        }
    });

    app.post('/api/newUser', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            if(req.body.username && req.body.name && req.body.surname && req.body.password && req.body.type){
                if(["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"].includes(req.body.type) && req.body.password.length>=8){
                    const exists = await db.getUserFromEmail(req.body.username);
                    if(exists == null){
                        const data = await db.storeUser(req.body);
                        return res.status(200).json(data);
                    }
                    return res.sendStatus(409);
                }
            }
            return res.sendStatus(422);
        }
        return res.sendStatus(401);
    });
    
    app.post('/api/managerSessions', async function(req, res){
        if(req.body.username && req.body.password){
            const user = await db.login(req.body.username, req.body.password, "manager");
            if(user==null){
                return res.sendStatus(401);
            }else{
                req.session.loggedin=true;
                req.session.user={
                    id: user.ID,
                    type: "manager"
                }
                const data = {
                    id: user.ID,
                    username: user.EMAIL,
                    name: user.NAME
                }
                return res.status(200).json(data);
            }
        }
        return res.sendStatus(401);
    });

    app.post('/api/customerSessions', async function(req, res){
        if(req.body.username && req.body.password){
            const user = await db.login(req.body.username, req.body.password, "customer");
            if(user==null){
                return res.sendStatus(401);
            }else{
                req.session.loggedin=true;
                req.session.user={
                    id: user.ID,
                    type: "customer"
                }
                const data = {
                    id: user.ID,
                    username: user.EMAIL,
                    name: user.NAME
                }
                return res.status(200).json(data);
            }
        }
        return res.sendStatus(401);
    });

    app.post('/api/supplierSessions', async function(req, res){
        if(req.body.username && req.body.password){
            const user = await db.login(req.body.username, req.body.password, "supplier");
            if(user==null){
                return res.sendStatus(401);
            }else{
                req.session.loggedin=true;
                req.session.user={
                    id: user.ID,
                    type: "supplier"
                }
                const data = {
                    id: user.ID,
                    username: user.EMAIL,
                    name: user.NAME
                }
                return res.status(200).json(data);
            }
        }
        return res.sendStatus(401);
    });

    app.post('/api/clerkSessions', async function(req, res){
        if(req.body.username && req.body.password){
            const user = await db.login(req.body.username, req.body.password, "clerk");
            if(user==null){
                return res.sendStatus(401);
            }else{
                req.session.loggedin=true;
                req.session.user={
                    id: user.ID,
                    type: "clerk"
                }
                const data = {
                    id: user.ID,
                    username: user.EMAIL,
                    name: user.NAME
                }
                return res.status(200).json(data);
            }
        }
        return res.sendStatus(401);
    });

    app.post('/api/qualityEmployeeSessions', async function(req, res){
        if(req.body.username && req.body.password){
            const user = await db.login(req.body.username, req.body.password, "qualityEmployee");
            if(user==null){
                return res.sendStatus(401);
            }else{
                req.session.loggedin=true;
                req.session.user={
                    id: user.ID,
                    type: "qualityEmployee"
                }
                const data = {
                    id: user.ID,
                    username: user.EMAIL,
                    name: user.NAME
                }
                return res.status(200).json(data);
            }
        }
        return res.sendStatus(401);
    });

    app.post('/api/deliveryEmployeeSessions', async function(req, res){
        if(req.body.username && req.body.password){
            const user = await db.login(req.body.username, req.body.password, "deliveryEmployee");
            if(user==null){
                return res.sendStatus(401);
            }else{
                req.session.loggedin=true;
                req.session.user={
                    id: user.ID,
                    type: "deliveryEmployee"
                }
                const data = {
                    id: user.ID,
                    username: user.EMAIL,
                    name: user.NAME
                }
                return res.status(200).json(data);
            }
        }
        return res.sendStatus(401);
    });

    app.post('/api/logout', function(req, res){
        req.session.loggedin=false;
        req.session.user={};
        return res.sendStatus(200);
    });

    app.put('/api/users/:username',async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            const username = req.params.username;
            if(username && req.body.oldType && req.body.newType && req.body.newType!="manager"){
                const user = await db.getUserFromEmail(username);
                if(user!=null){
                    if(user.TYPE==req.body.oldType){
                        if (["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"].includes(req.body.newType)){
                            await db.updateUser(user.ID, req.body.newType);
                            return res.sendStatus(200);
                        }else{
                            return res.sendStatus(422);
                        }
                    }else{
                        return res.sendStatus(422);
                    }
                }else{
                    return res.sendStatus(404);
                }
            }
            return res.sendStatus(422);
        }
        return res.sendStatus(401);
    });

    app.delete('/api/users/:username/:type', async function(req, res){
        if(req.session.loggedin && req.session.user.type=="manager"){
            const username = req.params.username;
            const type = req.params.type;
            if (username && type){
                const user = await db.getUserFromEmail(username);
                if(user!=null){
                    if (user.TYPE==type && type!="manager"){
                        await db.deleteUser(user.ID);
                        return res.sendStatus(204);
                    }
                }
            }
            return res.sendStatus(422);
        }
        return res.sendStatus(401);
    });

}