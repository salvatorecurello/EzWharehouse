const PositionDAO = require("./PositionDAO.js");
const Position = require("./Position.js");
PositionDao = new PositionDAO();

module.exports = function (app) {

    app.get('/api/positions', async function (req, res) {
        
        const positions = await PositionDao.getPositions();
        return res.status(200).json(positions);

    });

    app.post('/api/position', async function (req, res) {


        const col = req.body.col;
        const row = req.body.row;
        const maxWeight = req.body.maxWeight;
        const maxVolume = req.body.maxVolume;
        const aisleID = req.body.aisleID;
        const positionID = aisleID + row + col;

        if (row.lenght != 4 || aisleID.lenght != 4 || col.lenght != 4 || positionID!=req.body.positionID)
            return res.status(422).end();
        


        const data = { positionID: positionID, col: col, row: row, maxWeight: maxWeight, maxVolume: maxVolume, aisleID: aisleID, occupiedVolume: 0, occupiedWeight: 0 };
        const result = await PositionDao.storePosition(data);

        if (result == undefined)
            return res.status(503).json({ error: 'Invalid Position' });

        return res.status(201).json(result);


    });

    app.put('/api/position/:positionID', async function (req, res) {


        const old_positionId = req.params.positionID;
        const col = req.body.newCol;
        const row = req.body.newRow;
        const maxWeight = req.body.newMaxWeight;
        const maxVolume = req.body.newMaxVolume;
        const aisleID = req.body.newAisleID;
        const occupiedVolume = req.body.newOccupiedVolume;
        const occupiedWeight = req.body.newOccupiedWeight;

        const positionID = aisleID + row + col;
        const data = { positionID: positionID, col: col, row: row, maxWeight: maxWeight, maxVolume: maxVolume, aisleID: aisleID, occupiedVolume: occupiedVolume, occupiedWeight: occupiedWeight };
        for (x in data) {
            if (x == undefined)
                return res.status(422).end();
        }

        if(await PositionDao.getPositionByID(old_positionId)==undefined){
            return res.status(404).end();
        }
        
        await PositionDao.updatePosition(old_positionId, data);

        return res.status(200).json(result);

    });

    app.put('/api/position/:positionID/changeID', async function (req, res) {



        const old_positionId = req.params.positionID;
        const new_positionID = req.body.newPositionID;
        if (old_positionId == undefined || new_positionID == undefined)
            return res.status(422).end();
        
        if(await PositionDao.getPositionByID(old_positionId)==undefined){
            return res.status(404).end();
        }
        
        await PositionDao.updatePositionID(old_positionId, new_positionID);

        return res.status(200).end();
    });

    app.delete('/api/position/:positionID', async function (req, res) {

        const positionID = req.params.positionID;
        if (positionID == undefined)
            return res.status(422).end();
        
        if(await PositionDao.getPositionByID(positionID)==undefined){
            return res.status(422).end();
        }

        await PositionDao.deletePosition(positionID);

        return res.status(204).end();
    });


}



