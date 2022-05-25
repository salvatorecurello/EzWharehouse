const SkuDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SkuDaoImport();
const SKUItemDaoImport = require('../classes/SKUItem/SKUItemDAO.js');
const SKUItemDao = new SKUItemDaoImport();
const TestDescriptorDaoImport = require('../classes/TestDescriptor/TestDescriptorDAO.js');
const TestDescriptorDao = new TestDescriptorDaoImport();
const PositionDaoImport = require('../classes/Position/PositionDAO.js');
const PositionDao = new PositionDaoImport();
const dayjs = require('dayjs')

const mainDB = require("../db.js");
const db = new mainDB();
describe('test skus', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        await PositionDao.storePosition({ positionID: 'aisle8row8col8', aisleID: 'aisle8', row: 'row8', col: 'col8', maxWeight: 1000, maxVolume: 1000, occupiedWeight: 0, occupiedVolume: 0 });
        await PositionDao.storePosition({ positionID: 'aisle9row9col9', aisleID: 'aisle9', row: 'row9', col: 'col9', maxWeight: 2000, maxVolume: 2000, occupiedWeight: 0, occupiedVolume: 0 });
        await PositionDao.storePosition({ positionID: 'aisle6row6col6', aisleID: 'aisle6', row: 'row6', col: 'col6', maxWeight: 2000, maxVolume: 2000, occupiedWeight: 0, occupiedVolume: 0 });
        skuid0 = await SKUDao.storeSKU({description: "testSKU2sku", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity:10});
        await SKUDao.storeSKU({description: "testSKUforUpdate", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity:10});
        await SKUDao.modifySKUPosition("aisle8row8col8", skuid0);
        skuid1 = await SKUDao.storeSKU({description: "testSKUforPosition", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity:10});
        await SKUDao.storeSKU({description: "testSKUforDelete", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity:10});
        await SKUDao.modifySKUPosition("aisle9row9col9", skuid1);
        await TestDescriptorDao.storeTestDescriptor({name: "testskusku", procedureDescription: "description for test", idSKU: skuid0});
        await SKUItemDao.storeSKUItem({RFID:"09876543211234567890123456789014", SKUId:skuid0, DateOfStock:"2021/11/29 12:30"});
    });
    
    testNewSKU('description 1', 10, 20, 'notes new sku', 5, 20);
    testgetSkus();
    testgetSKUByID();
    testgetTestDescriptorBySKUID(); 
    testPositionOccupied('aisle8row8col8'); 
    testexistingSKUItem();
    testexistingTestDescriptor();
    testupdateSKU({newDescription: "testupdateSKU", newWeight: 20, newVolume: 20, newNotes: "notes sku update", newPrice: 12, newAvailableQuantity:20});
    testupdatePositionWeightVolume(40, 40, 'aisle8row8col8');
    testupdateSKUPosition('aisle6row6col6');
    testdeleteSKU(); 
});

function testNewSKU(description, weight, volume, notes, availableQuantity, price) {
    test('create new SKU', async () => {
        
        skuid = await SKUDao.storeSKU({description: description, weight: weight, volume: volume, notes: notes, availableQuantity: availableQuantity, price: price});
        var res = await SKUDao.getSkus();
        expect(res.length).toBeGreaterThanOrEqual(1);
        
        res = await SKUDao.getSKUByID(skuid);

        expect(res.id).toStrictEqual(skuid);
        expect(res.description).toStrictEqual(description);
        expect(res.weight).toStrictEqual(weight);
        expect(res.volume).toStrictEqual(volume);
        expect(res.notes).toStrictEqual(notes);
        expect(res.availableQuantity).toStrictEqual(availableQuantity);
        expect(res.price).toStrictEqual(price);
    });
}

function testgetSkus() {
    test('get skus', async () => {
        
        var res = await SKUDao.getSkus();
        expect(res).not.toStrictEqual(null);
    });
}


function testgetSKUByID() {
    test('get sku from id', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU2sku"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        var res2 = await SKUDao.getSKUByID(sku.id);
        expect(sku.description).toStrictEqual(res2.description);
        expect(sku.weight).toStrictEqual(res2.weight);
        expect(sku.volume).toStrictEqual(res2.volume);
        expect(sku.notes).toStrictEqual(res2.notes);
        expect(sku.price).toStrictEqual(res2.price);
        expect(sku.availableQuantity).toStrictEqual(res2.availableQuantity);
    });
}

function testgetTestDescriptorBySKUID() {
    test('get testdescriptor from skuid', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU2sku"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        var res = await SKUDao.getTestDescriptorsBySKUID(sku.id);

        expect(res.lenght).not.toStrictEqual(0);
    });
}

function testPositionOccupied(id) {
    test('get position from id', async () => {
        var res = await SKUDao.PositionOccupied(id);
        expect(res).not.toBeUndefined();
        expect(res.POSITION).toStrictEqual(id);
    });
}


function testexistingSKUItem(skuid) {
    test('get skuitem from skuid', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU2sku"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();
        var res = await SKUDao.existingSKUItem(sku.id);
        expect(res).toBeGreaterThanOrEqual(1);

    });
}


function testexistingTestDescriptor() {
    test('exist testdescriptor from skuid', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU2sku"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        var res = await SKUDao.existingTestDescriptor(sku.id);
        expect(res).toBeGreaterThanOrEqual(1);
    });
}


function testupdateSKU(newsku) {
    test('update all fields of sku', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKUforUpdate"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        let res_old = await SKUDao.getSKUByID(sku.id);
        await SKUDao.updateSKU(newsku, sku.id);
        res_new = await SKUDao.getSKUByID(sku.id);
        
        expect(res_new).not.toBeNull();
        expect(res_old.id).toStrictEqual(res_new.id);
        expect(res_old.description).not.toStrictEqual(res_new.description);
        expect(res_old.weight).not.toStrictEqual(res_new.weight)
        expect(res_old.volume).not.toStrictEqual(res_new.volume);
        expect(res_old.notes).not.toStrictEqual(res_new.notes);
        expect(res_old.price).not.toStrictEqual(res_new.price);
        expect(res_old.availableQuantity).not.toStrictEqual(res_new.availableQuantity);
    });
}


function testupdatePositionWeightVolume(weight, volume, position) {
    test('update weight and volume of position', async () => {
        let res_old = await PositionDao.getPositionByID(position);
        expect(res_old).not.toBeNull();
        
        await SKUDao.updatePositionWeightVolume(position, weight, volume);
        res_new = await PositionDao.getPositionByID(position);
        
        expect(res_new).not.toBeNull();
        expect(res_old.id).toStrictEqual(res_new.id);
        expect(res_old.occupiedWeight).not.toStrictEqual(res_new.occupiedWeight);
        expect(res_old.occupiedVolume).not.toStrictEqual(res_new.occupiedVolume);
    });
}


function testupdateSKUPosition(position) {
    test('update position of sku', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testupdateSKU"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        let res_old = await SKUDao.getSKUByID(sku.id);
        await SKUDao.modifySKUPosition(position, sku.id);
        res_new = await SKUDao.getSKUByID(sku.id);
        expect(res_new).not.toBeNull();
        expect(res_old.id).toStrictEqual(res_new.id); 
        expect(res_old.position).not.toStrictEqual(res_new.position);
    });
}

function testdeleteSKU() {
    test('delete sku', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKUforDelete"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        let res_old = await SKUDao.getSKUByID(sku.id);
        expect(res_old).not.toBeNull();
        await SKUDao.deleteSKU(sku.id);
        let res_new = await SKUDao.getSKUByID(sku.id);
        expect(res_new).toBeNull();
    });
}
