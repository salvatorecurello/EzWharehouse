const itemDaoImport = require('../classes/Item/ItemDao');
const itemDao = new itemDaoImport();
const mainDB = require("../db.js");
const db = new mainDB();
describe('test Items', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        await itemDao.storeItem({id: 1, description: 'description1', price: 2.00, skuid: 1, supplierID: 5});
    });
    testNewItem(2, 'description2', 3.00, 4, 1);
    getItems();
    getItemFromId(2, 1);
    updateAnItem({id: 1, description: 'new_description', price: 4.00, skuid: 2, supplierID: 5});
    getItemsOfSupplier(1);
    deleteItem(1, 5); 
});

function testNewItem(new_id, new_description, new_price, new_skuid, new_supplierid ) {
    test('create new Item', async () => {
        
        await itemDao.storeItem({id: new_id, description: new_description, price: new_price, skuid: new_skuid, supplierID: new_supplierid});
        
        var res = await itemDao.getItems();
        expect(res.length).toBeGreaterThanOrEqual(1);
        
        res = await itemDao.getItemByIDAndSupplierID(new_id, new_supplierid);

        expect(res.id).toStrictEqual(new_id);
        expect(res.description).toStrictEqual(new_description);
        expect(res.price).toStrictEqual(new_price);
        expect(res.SKUId).toStrictEqual(new_skuid);
        expect(res.supplierId).toStrictEqual(new_supplierid);
    });
}

function getItems() {
    test('get items', async () => {
        
        var res = await itemDao.getItems();
        expect(res).not.toStrictEqual(null);
    });
}


function getItemFromId(id, supplierid) {
    test('get Item from position ID', async () => {
        var res = await itemDao.getItemByIDAndSupplierID(id, supplierid);
        expect(res).not.toBeNull();
        expect(res.id).toStrictEqual(id);
    });
}


function updateAnItem(item) {
    test('update all fields of item', async () => {
        let res_old = await itemDao.getItemByIDAndSupplierID(item.id, item.supplierID);
        await itemDao.updateItem(item);
        res_new = await itemDao.getItemByIDAndSupplierID(item.id, item.supplierID);
        expect(res_new).not.toBeNull();
        expect(res_old).not.toBeNull();
        expect(res_old.ID).toStrictEqual(res_new.ID);
        expect(res_old.description).not.toStrictEqual(res_new.DESCRIPTION);
        expect(res_old.price).not.toStrictEqual(res_new.PRICE)
        expect(res_old.SKUId).not.toStrictEqual(res_new.SKUID);
        expect(res_old.supplierId).not.toStrictEqual(res_new.SUPPLIERID);

    });
}

function deleteItem(id, supplierid) {
    test('delete item', async () => {
        let res_old = await itemDao.getItemByIDAndSupplierID(id, supplierid);
        expect(res_old).not.toBeNull();
        await itemDao.deleteItem(id);
        let res_new = await itemDao.getItemByIDAndSupplierID(id, supplierid);
        expect(res_new).toBeNull();
    });
}

function getItemsOfSupplier(supplierID) {
    test('get items of a supplier', async () => {
        var res = await itemDao.getItemsBySupplier(supplierID);
        expect(res.length).toStrictEqual(1);
    });
}