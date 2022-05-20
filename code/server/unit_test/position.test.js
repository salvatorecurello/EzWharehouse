const positionDaoImport = require('../classes/Position/PositionDAO.js');
const positionDao = new positionDaoImport();
const mainDB = require("../db.js");

describe('test Positions', () => {
    beforeAll(async () => {
        const db = new mainDB();
        await db.deleteAll();
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
        
        var res = await positionDao.getPositions();
        expect(res.length).toBeGreaterThanOrEqual(1);
        
        res = await positionDao.getPositionByID(id);

        expect(res.ID).toStrictEqual(id);
        expect(res.AISLEID).toStrictEqual(aisleId);
        expect(res.ROW).toStrictEqual(row);
        expect(res.COL).toStrictEqual(col);
        expect(res.MAXWEIGHT).toStrictEqual(maxwei);
        expect(res.MAXVOLUME).toStrictEqual(maxvol);
        expect(res.OCCUPIEDWEIGHT).toStrictEqual(occupiedWei);
        expect(res.OCCUPIEDVOLUME).toStrictEqual(occupiedVol);
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
        expect(res.ID).toStrictEqual(id);
    });
}

function updateAllPosition(old_positionID, new_position) {
    test('update all fields of position', async () => {
        var res = await positionDao.getPositionByID(old_positionID);
        var id = res.ID;
        await positionDao.updatePosition(id, new_position);
        res = await positionDao.getPositionByID(new_position.positionID);
        expect(res).not.toBeNull();
        expect(res.ID).toStrictEqual(new_position.positionID);
        expect(res.AISLEID).toStrictEqual(new_position.aisleID);
        expect(res.ROW).toStrictEqual(new_position.row);
        expect(res.COL).toStrictEqual(new_position.col);
        expect(res.MAXWEIGHT).toStrictEqual(new_position.maxWeight);
        expect(res.MAXVOLUME).toStrictEqual(new_position.maxVolume);
        expect(res.OCCUPIEDWEIGHT).toStrictEqual(new_position.occupiedWeight);
        expect(res.OCCUPIEDVOLUME).toStrictEqual(new_position.occupiedVolume);

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
        expect(res_new.ID).toStrictEqual(new_positionID);
        expect(res_new.AISLEID).toStrictEqual(aisleID);
        expect(res_new.ROW).toStrictEqual(row);
        expect(res_new.COL).toStrictEqual(col);
        expect(res_old.MAXWEIGHT).toStrictEqual(res_new.MAXWEIGHT);
        expect(res_old.MAXVOLUME).toStrictEqual(res_new.MAXVOLUME);
        expect(res_old.OCCUPIEDWEIGHT).toStrictEqual(res_new.OCCUPIEDWEIGHT);
        expect(res_old.OCCUPIEDVOLUME).toStrictEqual(res_new.OCCUPIEDVOLUME);
    });
}

function deletePosition(id) {
    test('delete position', async () => {
        var res = await positionDao.getPositionByID(id);
        var new_id = res.ID;
        await positionDao.deletePosition(new_id);
        var res = await positionDao.getPositionByID(id);
        expect(res).toBeNull();
    });
}