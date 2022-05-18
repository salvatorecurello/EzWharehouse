const ReturnOrderDAO = require("./ReturnOrderDAO.js");
const RoDAO = new ReturnOrderDAO();

module.exports = function (app) {

    app.get('/api/returnOrders', async function (req, res) {
        //if (!req.session.loggedin || !["manager"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.getAll().then((data) => {
            return res.status(200).json(data);
        }).catch((data) => {
            return res.status(500).end();
        });
    });

    app.get('/api/returnOrders/:id', async function (req, res) {
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

    app.post('/api/returnOrder', async function (req, res) {
        //if (!req.session.loggedin || !["manager"].includes(req.session.user.type))
        //    return res.status(401).end();

        RoDAO.store(req.body).then((data) => {
            return res.status(201).end();
        }).catch((data) => {
            if (data == "No match")
                return res.status(404).end();
            else if (data == "Wrong data")
                return res.status(422).end();
            else
                return res.status(503).end();
        });
    });

    app.delete('/api/returnOrder/:id', async function (req, res) {
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