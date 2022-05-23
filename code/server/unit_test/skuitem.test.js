const SkuItemDaoImport = require('../classes/SKUItem/SKUItemDAO.js');
const SKUItemDao = new SkuItemDaoImport();
const SkuDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SkuDaoImport();
const mainDB = require("../db.js");

describe('test SkuItems', () => {
    beforeAll(async () => {
        skuid1 = await SKUDao.storeSKU({ description: 'testSKUitem', weight: 100, volume: 50, notes: "a sku", availableQuantity: 50, price: 10.99 });
        await SKUItemDao.storeSKUItem({RFID:"12345678901234567890123456789015", SKUId:skuid1, DateOfStock:"2021/11/29 12:30"});
    });
    
    testNewSKUItem('12345678901234567890123456789016', '2021/11/29');
    testgetSKUItems();
    //testgetSKUItemByRFID('12345678901234567890123456789015');
    //testupdateSKUItem('12345678901234567890123456789015', {newRFID:"12345678901234567890123456789018", newAvailable:1, newDateOfStock:"2021/11/29 12:30"} )
    //testgetArraySKUItemByID(1)
    //testdeleteSKUItem('12345678901234567890123456789015') 
});

function testNewSKUItem(rfid, DateOfStock) {
    test('create new SKUItem', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKUitem"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();
        await SKUItemDao.storeSKUItem({RFID: rfid, SKUId: sku.id, DateOfStock: DateOfStock});
        
        var res = await SKUItemDao.getSKUItems();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _skuitem of res){
            if(_skuitem.RDIF===rfid && _skuitem.SKUId===sku.id && _skuitem.DateOfStock===DateOfStock){
                found=_skuitem;
            }
        }
        expect(found).not.toBeUndefined();
    });
}


function testgetSKUItems() {
    test('get skuitems', async () => {
        
        var res = await SKUItemDao.getSKUItems();
        expect(res.length).toBeGreaterThanOrEqual(1);
    });
}


function testgetSKUItemByRFID(rfid) {
    test('get skuitem by rfid', async () => {
        
        var res = await SKUItemDao.getSKUItems();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _skuitem of res){
            if(_skuitem.RFID===rfid){
                found=_skuitem;
            }
        }
        expect(found).not.toBeUndefined();

        var res2 = await SKUItemDao.getSKUItemByRFID(found.RFID);
        expect(found.SKUId).toStrictEqual(res2.SKUId);
        expect(found.Available).toStrictEqual(res2.Available);
        expect(found.DateOfStock).toStrictEqual(res2.DateOfStock);
    });
}


function testdeleteSKUItem(rfid) {
    test('delete skuitem', async () => {
        var res = await SKUItemDao.getSKUItems();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _skuitem of res){
            if(_skuitem.RFID===rfid){
                found=_skuitem;
            }
        }
        await SKUItemDao.deleteSKUItem(found.RFID);
        var res = await SKUItemDao.getSKUItemByRFID(found.rfid);
        expect(res).toBeNull();
    });
}

function testupdateSKUItem(rfid, skuitem) {
    test('update skuitem', async () => {
        let res_old = await SKUItemDao.getSKUItemByRFID(rfid);
        await SKUItemDao.updateSKUItem(skuitem, skuitem.newRFID);
        res_new = await SKUItemDao.getSKUItemByRFID(skuitem.newRFID);
        expect(res_new).not.toBeNull();
        expect(res_old.SKUID).toStrictEqual(res_new.SKUID);
        expect(res_old.AVAILABLE).not.toStrictEqual(res_new.AVAILABLE);
        expect(res_old.DATEOFSTOCK).not.toStrictEqual(res_new.DATEOFSTOCK);
    });
}


function testgetArraySKUItemByID(skuid) {
    test('test get array of skuitems by skuid', async () => {
        
        var res = await SKUItemDao.getArraySKUItemByID(skuid);
        expect(res).not.toBeNull();
    });
}
