const positionDaoImport = require('../classes/Position/PositionDAO.js');
const positionDao = new positionDaoImport();
const mainDB = require("../db.js");
const db = new mainDB();

describe('test Positions', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        await positionDao.storePosition({ id: 'aisle1row1col1', aisleId: 'aisle1', row: 'row1', col: 'col1', maxwei: 5, maxvol: 10, occupiedWei: 10, occupiedVol: 10 });
    });
    
    testNewPosition('aisle2row2col2', 'aisle2', 'row1wqew', 'col1qwewqe', 5, 10, 10, 10 );
    getPositions();
    getPositionFromId("aisle2row2col2");
    updateAllPosition("aisle2row2col2", { positionID: 'aisle3row3col3', aisleID: 'aisle3', row: 'row3', col: 'col3', maxWeight: 5, maxVolume: 10, occupiedWeight: 10, occupiedVolume: 10 } );
    updatePositionID("aisle3row3col3", "aisle2row2col2");
    deletePosition('aisle2row2col2'); 
});

function testNewPosition(id, aisleId, row, col, maxwei, maxvol, occupiedWei, occupiedVol) {
    test('create new Position', async () => {
        
        await positionDao.storePosition({positionID: id, aisleID: aisleId, row: row, col: col, maxWeight: maxwei,maxVolume: maxvol,occupiedWeight: occupiedWei, occupiedVolume: occupiedVol});
        res = await positionDao.getPositionByID(id);
        expect(res.positionID).toStrictEqual(id);
        expect(res.aisleID).toStrictEqual(aisleId);
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxwei);
        expect(res.maxVolume).toStrictEqual(maxvol);
        expect(res.occupiedWeight).toStrictEqual(occupiedWei);
        expect(res.occupiedVolume).toStrictEqual(occupiedVol);
    });
}

function getPositions() {
    test('get positions', async () => {
        
        var res = await positionDao.getPositions();
        expect(res).not.toStrictEqual(null);
    });
}

function getPositionFromId(id) {
    test('get position from id', async () => {
        var res = await positionDao.getPositionByID(id);
        expect(res).not.toBeNull();
        expect(res.positionID).toStrictEqual(id);
    });
}

function updateAllPosition(old_positionID, new_position) {
    test('update all fields of position', async () => {
        var res = await positionDao.getPositionByID(old_positionID);
        var id = res.positionID;
        await positionDao.updatePosition(id, new_position);
        res = await positionDao.getPositionByID(new_position.positionID);
        expect(res).not.toBeNull();
        expect(res.positionID).toStrictEqual(new_position.positionID);
        expect(res.aisleID).toStrictEqual(new_position.aisleID);
        expect(res.row).toStrictEqual(new_position.row);
        expect(res.col).toStrictEqual(new_position.col);
        expect(res.maxWeight).toStrictEqual(new_position.maxWeight);
        expect(res.maxVolume).toStrictEqual(new_position.maxVolume);
        expect(res.occupiedWeight).toStrictEqual(new_position.occupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(new_position.occupiedVolume);

    });
}

function updatePositionID(old_positionID, new_positionID) {
    test('update id position only', async () => {
        var res_old = await positionDao.getPositionByID(old_positionID);
        await positionDao.updatePositionID(old_positionID, new_positionID);
        var res_new = await positionDao.getPositionByID(new_positionID);
        expect(res_new).not.toBeNull();
        const aisleID = new_positionID.substring(0, 4);
        const row = new_positionID.substring(4, 8);
        const col = new_positionID.substring(8, 12);
        expect(res_new.positionID).toStrictEqual(new_positionID);
        expect(res_new.aisleID).toStrictEqual(aisleID);
        expect(res_new.row).toStrictEqual(row);
        expect(res_new.col).toStrictEqual(col);
        expect(res_old.maxWeight).toStrictEqual(res_new.maxWeight);
        expect(res_old.maxVolume).toStrictEqual(res_new.maxVolume);
        expect(res_old.occupiedWeight).toStrictEqual(res_new.occupiedWeight);
        expect(res_old.occupiedVolume).toStrictEqual(res_new.occupiedVolume);
    });
}

function deletePosition(id) {
    test('delete position', async () => {
        var res = await positionDao.getPositionByID(id);
        var new_id = res.positionID;
        await positionDao.deletePosition(new_id);
        var res = await positionDao.getPositionByID(id);
        expect(res).toBeNull();
    });
}