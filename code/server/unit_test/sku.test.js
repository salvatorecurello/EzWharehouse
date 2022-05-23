const SkuDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SkuDaoImport();
const SKUItemDaoImport = require('../classes/SKUItem/SKUItemDAO.js');
const SKUItemDao = new SKUItemDaoImport();
const TestDescriptorDaoImport = require('../classes/TestDescriptor/TestDescriptorDAO.js');
const TestDescriptorDao = new TestDescriptorDaoImport();
const PositionDaoImport = require('../classes/Position/PositionDAO.js');
const PositionDao = new PositionDaoImport();

const mainDB = require("../db.js");

describe('test skus', () => {
    beforeAll(async () => {
        skuid0 = await SKUDao.storeSKU({description: "testSKU", weight: 100, volume: 100, notes: "notes sku", price: 10, position: "aisle1row1col1", availableQuantity:10});
        await TestDescriptorDao.storeTestDescriptor({name: "testsku", procedureDescription: "description for test", idSKU: skuid0});
        await PositionDao.storePosition({ id: 'aisle4row4col4', aisleId: 'aisle4', row: 'row4', col: 'col4', maxwei: 1000, maxvol: 1000, occupiedWei: 0, occupiedVol: 0 });
        await SKUItemDao.storeSKUItem({RFID:"09876543211234567890123456789014", SKUId:skuid0, DateOfStock:"2021/11/29 12:30"});
    });
    
    testNewSKU('description 1', 10, 20, 'notes new sku', 5, 20);
    testgetSkus();
    //testgetSKUByID();
    // testgetTestDescriptorBySKUID(); non funziona
    // testPositionOccupied('aisle1row1col1'); non funziona
    //testexistingSKUItem();
    //testexistingTestDescriptor(skuid0);
    //getTestDescriptorBySKUID(skuid0);
    
    //testupdateSKU({newDescription: "testupdateSKU", newWeight: 20, newVolume: 20, newNotes: "notes sku", newPrice: 10, newAvailableQuantity:20});
    //testupdatePositionWeightVolume(20, 20, 'aisle4row4col4');
    //testupdateSKUPosition(1, 'aisle2row2col2');
    //testdeleteSKU(1); 
    
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
            if(_sku.description==="testSKU"){
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

// bohh
function testgetTestDescriptorBySKUID() {
    test('get testdescriptor from skuid', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();
        console.log(sku.id);
        var res = await SKUDao.getTestDescriptorsBySKUID(sku.id);
        expect(res).not.toBeNull();
        expect(res.idSKU).toStrictEqual(sku.id);
    });
}

function testPositionOccupied(id) {
    test('get position from id', async () => {
        var res = await SKUDao.PositionOccupied(id);
        expect(res).not.toBeNull();
        expect(res.position).toStrictEqual(id);
    });
}


function testexistingSKUItem(skuid) {
    test('get skuitem from skuid', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();
        console.log(sku.id)
        var res = await SKUDao.existingSKUItem(sku.id);
        expect(res).not.toBeNull();
        expect(res.length).toBeGreaterThanOrEqual(1);
    });
}



// vedere su SKUDAO se le funzioni existingTestDescriptor() e getTestDescriptorsBySKUID() sono la stessa cosa
function testexistingTestDescriptor(skuid) {
    test('get testdescriptor from skuid', async () => {
        var res = await SKUDao.existingTestDescriptor(skuid);
        expect(res).not.toBeNull();
        expect(res.length).toBeGreaterThanOrEqual(1);
    });
}

// da rivedere
function getTestDescriptorBySKUID(skuid) {
    test('get testdescriptor by skuid', async () => {
        
        var res = await SKUDao.getTestDescriptorBySKUID(skuid);
        expect(res).not.toBeNull();
        expect(res.SKUID).toStrictEqual(skuid);
    });
}


function testupdateSKU(newsku) {
    test('update all fields of sku', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKU"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();

        let res_old = await SKUDao.getSKUByID(sku.id);
        await SKUDao.updateSKU(newsku, sku.id);
        res_new = await SKUDao.getSKUByID(sku.id);
        
        expect(res_new).not.toBeNull();
        expect(res_old.ID).toStrictEqual(res_new.ID);
        expect(res_old.DESCRIPTION).not.toStrictEqual(res_new.DESCRIPTION);
        expect(res_old.WEIGHT).not.toStrictEqual(res_new.WEIGHT)
        expect(res_old.VOLUME).not.toStrictEqual(res_new.VOLUME);
        expect(res_old.NOTE).not.toStrictEqual(res_new.NOTE);
        expect(res_old.PRICE).not.toStrictEqual(res_new.PRICE);
        expect(res_old.AVAILABLEQUANTITY).not.toStrictEqual(res_new.AVAILABLEQUANTITY);
    });
}


function testupdatePositionWeightVolume(weight, volume, position) {
    test('update all fields of sku', async () => {
        let res_old = await PositionDao.getPositionByID(position);
        await SKUDao.updatePositionWeightVolume(position, weight, volume);
        res_new = await SKUDao.getPositionByID(position);
        expect(res_new).not.toBeNull();
        expect(res_old.ID).toStrictEqual(res_new.ID); // non so se questo serve
        expect(res_old.OCCUPIEDWEIGHT).not.toStrictEqual(res_new.OCCUPIEDWEIGHT)
        expect(res_old.OCCUPIEDVOLUME).not.toStrictEqual(res_new.OCCUPIEDVOLUME);
    });
}


function testupdateSKUPosition(id, position) {
    test('update position of sku', async () => {
        let res_old = await SKUDao.getSKUByID(id);
        await SKUDao.modifySKUPosition(position, id);
        res_new = await SKUDao.getSKUByID(id);
        expect(res_new).not.toBeNull();
        expect(res_old.ID).toStrictEqual(res_new.ID); // non so se questo serve
        expect(res_old.POSITION).not.toStrictEqual(res_new.POSITION);
    });
}

function testdeleteSKU(id) {
    test('delete sku', async () => {
        let res_old = await SKUDao.getSKUByID(id);
        expect(res_old).not.toBeNull();
        await SKUDao.deleteSKU(new_id);
        let res_new = await SKUDao.getSKUByID(id);
        expect(res_new).toBeNull();
    });
}
