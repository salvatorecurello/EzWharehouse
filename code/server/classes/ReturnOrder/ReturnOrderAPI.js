const ReturnOrderDAO = require("./ReturnOrderDAO.js");
const RoDAO = new ReturnOrderDAO();

module.exports = function(app){

    app.get('/api/returnOrders', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const data = await RoDAO.getAll();

            if (data.error)
                return res.sendStatus(500);
            else
                return res.status(200).json(data.res);
        }
        else
            return res.sendStatus(401);
    });

    app.get('/api/returnOrders/:id', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const id = req.params.id;

            if (Number.isInteger(id)) {
                const data = await RoDAO.get(id);

                if (data.error)
                    return res.sendStatus(500);
                else if (data.res.length == 0)
                    return res.sendStatus(404);
                else
                    return res.status(200).json(data.res[0]);
            }
            else
                return res.sendStatus(422);
        }
        else
            return res.sendStatus(401);
    });

    app.post('/api/returnOrder', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const body = req.body;
            const data = await RoDAO.store(body);

            if (data.error)
                return res.sendStatus(422);
            else
                return res.sendStatus(201);
        }
        else
            return res.sendStatus(401);
    });

    app.delete('/api/returnOrder/:id', async function (req, res) {
        if (req.session.loggedin && ["manager"].includes(req.session.user.type)) {
            const id = req.params.id;

            if (Number.isInteger(id)) {
                const ro = await RoDAO.get(id);

                if (ro.error)
                    return res.sendStatus(503);
                else if (ro.res.length == 0)
                    return res.sendStatus(404);
                else {
                    const data = await RoDAO.delete(id);

                    if (data.error)
                        return res.sendStatus(503);
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

}