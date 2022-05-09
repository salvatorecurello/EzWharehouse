const RestockOrderDAO = require("./RestockOrderDAO.js");
const RoDAO = new RestockOrderDAO();

module.exports = function (app) {

    app.get('/api/restockOrders', async function (req, res) {
        if (req.session.loggedin && ["manager", "clerk", "qualityEmployee"].includes(req.session.user.type)) {
            const data = await RoDAO.getAll();

            if (data.error || data.res == undefined)
                return res.sendStatus(500);
            else
                return res.status(200).json(data.res);
        }
        else
            return res.sendStatus(401);
    });

    app.get('/api/restockOrdersIssued', async function (req, res) {
        if (req.session.loggedin && ["manager", "supplier"].includes(req.session.user.type)) {
            const data = await RoDAO.getIssued();

            if (data.error)
                return res.sendStatus(500);
            else
                return res.status(200).json(data.res);
        }
        else
            return res.sendStatus(401);
    });

    app.get('/api/restockOrders/:id', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const id = parseInt(req.params.id);

            RoDAO.get(id).then((data) => {
                return res.status(200).json(data.toMap());
            }).catch((data) => {
                if (data == "No match")
                    return res.sendStatus(404);
                else if (data == "Wrong data")
                    return res.sendStatus(422);
                else
                    return res.sendStatus(500);
            });
        }
        else
            return res.sendStatus(401);
    });

    app.get('/api/restockOrders/:id/returnItems', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const id = parseInt(req.params.id);

            if (Number.isInteger(id)) {
                const data = await RoDAO.getReturnItems(id);

                if (data.error)
                    return res.sendStatus(500);
                else if (data.res.length == 0)
                    return res.sendStatus(404);
                else
                    return res.status(200).json(data.res);
            }
            else
                return res.sendStatus(422);
        }
        else
            return res.sendStatus(401);
    });

    app.post('/api/restockOrder', async function (req, res) {
        if (req.session.loggedin && ["manager", "supplier"].includes(req.session.user.type)) {
            RoDAO.store(req.body).then(() => {
                return res.sendStatus(201);
            }).catch((data) => {
                if (data == "Wrong data")
                    return res.sendStatus(422);
                else
                    return res.sendStatus(500);
            });
        }
        else
            return res.sendStatus(401);
    });

    app.put('/api/restockOrder/:id', async function (req, res) {
        if (req.session.loggedin && ["manager", "clerk"].includes(req.session.user.type)) {
            const id = req.params.id;
            const body = req.body;

            if (Number.isInteger(id)) {
                const ro = await RoDAO.get(id);

                if (ro.error)
                    return res.sendStatus(503);
                else if (ro.res.length == 0)
                    return res.sendStatus(404);
                else {
                    const data = await RoDAO.setState(id, body.newState);

                    if (data.error)
                        return res.sendStatus(503);
                    else if (data.res == 0)
                        return res.sendStatus(422);
                    else
                        return res.sendStatus(200);
                }
            }
            else
                return res.sendStatus(422);
        }
        else
            return res.sendStatus(401);
    });

    app.put('/api/restockOrder/:id/skuItems', async function (req, res) {
        if (req.session.loggedin && ["manager", "clerk"].includes(req.session.user.type)) {
            const id = req.params.id;
            const body = req.body;

            if (Number.isInteger(id)) {
                const ro = await RoDAO.get(id);

                if (ro.error)
                    return res.sendStatus(503);
                else if (ro.res.length == 0)
                    return res.sendStatus(404);
                else {
                    const data = await RoDAO.setSkuItems(id, body.skuItems);

                    if (data.error)
                        return res.sendStatus(503);
                    else if (data.res == 0)
                        return res.sendStatus(422);
                    else
                        return res.sendStatus(200);
                }
            }
            else
                return res.sendStatus(422);
        }
        else
            return res.sendStatus(401);
    });

    app.put('/api/restockOrder/:id/transportNote', async function (req, res) {
        if (req.session.loggedin && ["manager", "supplier"].includes(req.session.user.type)) {
            const id = req.params.id;
            const body = req.body;

            if (Number.isInteger(id)) {
                const ro = await RoDAO.get(id);

                if (ro.error)
                    return res.sendStatus(503);
                else if (ro.res.length == 0)
                    return res.sendStatus(404);
                else {
                    const data = await RoDAO.setTransportNote(id, body.transportNote);

                    if (data.error)
                        return res.sendStatus(503);
                    else if (data.res == 0)
                        return res.sendStatus(422);
                    else
                        return res.sendStatus(200);
                }
            }
            else
                return res.sendStatus(422);
        }
        else
            return res.sendStatus(401);
    });

    app.delete('/api/restockOrder/:id', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const id = parseInt(req.params.id);

            RoDAO.delete(res.ID).then(() => {
                return res.sendStatus(204);
            }).catch((data) => {
                if (data == "No match")
                    return res.sendStatus(404);
                else if (data == "Wrong data")
                    return res.sendStatus(422);
                else
                    return res.sendStatus(503);
            });
        }
        else
            return res.sendStatus(401);
    });

}