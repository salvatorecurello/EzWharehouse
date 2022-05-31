const UserDAO = require("./UserDAO.js");
const User = require("./User.js");
Userdao = new UserDAO();

module.exports = function (app) {

    app.get('/api/userinfo', async function (req, res) {
        try {
            return res.status(200).end();
            /* if(req.session.loggedin){
                 const user = await Userdao.getUserFromId(req.session.user.id);
                 const data = {
                     id: user.id,
                     username: user.email,
                     name: user.name,
                     surname: user.surname,
                     type: user.type
                 }
                 return res.status(200).json(data);
             }
             return res.status(200).end();*/
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/suppliers', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            const data = await Userdao.getSuppliers();
            return res.status(200).json(data);
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.get('/api/users', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            const data = await Userdao.getUsers();
            return res.status(200).json(data);
            //}else{
            //    return res.status(401).end();
            //}
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/newUser', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            if (req.body.username != undefined && req.body.name != undefined && req.body.surname != undefined && req.body.password != undefined && req.body.type != undefined) {
                if (["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"].includes(req.body.type) && req.body.password.length >= 8) {
                    const exists = await Userdao.getUserFromEmail(req.body.username, req.body.type);
                    if (exists == null) {
                        const data = await Userdao.storeUser(req.body);
                        return res.status(201).json(data);
                    }
                    return res.status(409).end();
                }
            }
            return res.status(422).end();
            //}
            //return res.status(401).end();
        } catch (error) {
            console.error(error)
            return res.status(500).end();
        }
    });

    app.post('/api/managerSessions', async function (req, res) {
        try {
            //if(req.body.username && req.body.password){
            const user = await Userdao.login(req.body.username, req.body.password, "manager");
            if (user == null) {
                return res.status(401).end();
            } else {
                //req.session.loggedin=true;
                //req.session.user={
                //    id: user.id,
                //    type: "manager"
                //}
                const data = {
                    id: user.id,
                    username: user.email,
                    name: user.name
                }
                return res.status(200).json(data);
            }
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/customerSessions', async function (req, res) {
        try {
            //if(req.body.username && req.body.password){
            const user = await Userdao.login(req.body.username, req.body.password, "customer");
            if (user == null) {
                return res.status(401).end();
            } else {
                //req.session.loggedin=true;
                //req.session.user={
                //    id: user.id,
                //    type: "customer"
                //}
                const data = {
                    id: user.id,
                    username: user.email,
                    name: user.name
                }
                return res.status(200).json(data);
            }
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/supplierSessions', async function (req, res) {
        try {
            //if(req.body.username && req.body.password){
            const user = await Userdao.login(req.body.username, req.body.password, "supplier");
            if (user == null) {
                return res.status(401).end();
            } else {
                //req.session.loggedin=true;
                //req.session.user={
                //    id: user.id,
                //    type: "supplier"
                //}
                const data = {
                    id: user.id,
                    username: user.email,
                    name: user.name
                }
                return res.status(200).json(data);
            }
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/clerkSessions', async function (req, res) {
        try {
            //if(req.body.username && req.body.password){
            const user = await Userdao.login(req.body.username, req.body.password, "clerk");
            if (user == null) {
                return res.status(401).end();
            } else {
                //req.session.loggedin=true;
                //req.session.user={
                //    id: user.id,
                //    type: "clerk"
                //}
                const data = {
                    id: user.id,
                    username: user.email,
                    name: user.name
                }
                return res.status(200).json(data);
            }
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/qualityEmployeeSessions', async function (req, res) {
        try {
            //if(req.body.username && req.body.password){
            const user = await Userdao.login(req.body.username, req.body.password, "qualityEmployee");
            if (user == null) {
                return res.status(401).end();
            } else {
                //req.session.loggedin=true;
                //req.session.user={
                //    id: user.id,
                //    type: "qualityEmployee"
                //}
                const data = {
                    id: user.id,
                    username: user.email,
                    name: user.name
                }
                return res.status(200).json(data);
            }
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/deliveryEmployeeSessions', async function (req, res) {
        try {
            //if(req.body.username && req.body.password){
            const user = await Userdao.login(req.body.username, req.body.password, "deliveryEmployee");
            if (user == null) {
                return res.status(401).end();
            } else {
                //req.session.loggedin=true;
                //req.session.user={
                //    id: user.id,
                //     type: "deliveryEmployee"
                //}
                const data = {
                    id: user.id,
                    username: user.email,
                    name: user.name
                }
                return res.status(200).json(data);
            }
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.post('/api/logout', function (req, res) {
        try {
            //req.session.loggedin=false;
            //req.session.user={};
            return res.status(200).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.put('/api/users/:username', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            const username = req.params.username;
            if (username != undefined && req.body.oldType != undefined && req.body.newType != undefined && req.body.newType != "manager") {
                const user = await Userdao.getUserFromEmail(username, req.body.oldType);
                if (user != null) {
                    if (user.type == req.body.oldType) {
                        if (["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"].includes(req.body.newType)) {
                            await Userdao.updateUser(user.id, req.body.newType);
                            return res.status(200).end();
                        } else {
                            return res.status(422).end();
                        }
                    } else {
                        return res.status(404).end();
                    }
                } else {
                    return res.status(404).end();
                }
            }
            return res.status(422).end();
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

    app.delete('/api/users/:username/:type', async function (req, res) {
        try {
            //if(req.session.loggedin && req.session.user.type=="manager"){
            const username = req.params.username;
            const type = req.params.type;
            if (username != undefined && type != undefined && /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(username)&& ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"].includes(type)) {
                const user = await Userdao.getUserFromEmail(username, type);
                console.log(user)
                if (user != null) {
                    if (user.type == type && type != "manager") {
                        await Userdao.deleteUser(user.id);
                        return res.status(204).end();
                    }
                }
                return res.status(204).end();
                
            }
            return res.status(422).end();
            //}
            //return res.status(401).end();
        } catch (error) {
            return res.status(500).end();
        }
    });

}