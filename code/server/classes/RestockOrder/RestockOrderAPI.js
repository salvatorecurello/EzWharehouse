const RestockOrderDAO = require("./RestockOrderDAO.js");
const RoDAO = new RestockOrderDAO();

module.exports = function (app) {
    app.get('/api/restockOrders', async function (req, res) {
        //if (!req.session.loggedin || !["manager", "clerk", "qualityEmployee"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.getAll().then((data) => {
            return res.status(200).json(data);
        }).catch((data) => {
            return res.status(500).end();
        });
    });

    app.get('/api/restockOrdersIssued', async function (req, res) {
        //if (!req.session.loggedin || !["manager", "supplier", "clerk"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.getIssued().then((data) => {
            return res.status(200).json(data);
        }).catch((data) => {
            return res.status(500).end();
        });
    });

    app.get('/api/restockOrders/:id', async function (req, res) {
        const id = parseInt(req.params.id);

        //if (!req.session.loggedin || !["manager"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.get(id).then((data) => {
            return res.status(200).json(data);
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
                return res.status(500).end();
        });
    });

    app.get('/api/restockOrders/:id/returnItems', async function (req, res) {
        const id = parseInt(req.params.id);

        //if (!req.session.loggedin || !["manager"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.getReturnItems(id).then((data) => {
            return res.status(200).json(data);
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
                return res.status(503).end();
        });
    });

    app.post('/api/restockOrder', async function (req, res) {
        //if (!req.session.loggedin || !["manager", "supplier"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.store(req.body).then((data) => {
            return res.status(201).end();
        }).catch((data) => {
            if (data == "Wrong data")
                return res.status(422).end();
            else
                return res.status(503).end();
        });
    });

    app.put('/api/restockOrder/:id', async function (req, res) {
        const id = parseInt(req.params.id);

        //if (!req.session.loggedin || !["manager", "clerk", "supplier"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.setState(id, req.body.newState).then((data) => {
            return res.status(200).end();
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
                
                return res.status(503).end();
        });
    });

    app.put('/api/restockOrder/:id/skuItems', async function (req, res) {
        const id = parseInt(req.params.id);
        //if (!req.session.loggedin || !["manager", "clerk", "supplier"].includes(req.session.user.type))
        //    return res.status(401).end();

        if(Object.keys(req.body)==0){
            return res.status(422).end();
        }
        
        RoDAO.setSkuItems(id, req.body.skuItems).then((data) => {
            return res.status(200).end();
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
                return res.status(503).end();
        });
    });

    app.put('/api/restockOrder/:id/transportNote', async function (req, res) {
        const id = parseInt(req.params.id);

        //if (!req.session.loggedin || !["manager", "clerk", "supplier"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.setTransportNote(id, req.body.transportNote).then((data) => {
            return res.status(200).end();
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
            console.log(data)
                return res.status(503).end();
        });
    });

    app.delete('/api/restockOrder/:id', async function (req, res) {
        const id = parseInt(req.params.id);

        //if (!req.session.loggedin || !["manager"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.delete(id).then((data) => {
            return res.status(204).end();
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
                return res.status(503).end();
        });
    });

}