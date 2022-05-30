const internalOrderDAO = require('../classes/InternalOrder/InternalOrderDAO');
const IODao = new internalOrderDAO();
const skuDAO = require('../classes/SKUItem/SKUItemDAO');
const skudao = new skuDAO();
const states = { 'ISSUED': 0, 'ACCEPTED': 1, 'REFUSED': 2, 'CANCELED': 3, 'COMPLETED': 4 };
const mainDB = require("../db.js");
const db = new mainDB();
describe('test InternalOrders', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        await IODao.storeInternalOrder({date: '2022/04/05 18:40', state: states['ACCEPTED'], customerID: 1 });
        await IODao.storeProducts({ orderID: 1, SKUId: 1, description: 'description1', price: 50.00, qty: 40 });
        await skudao.storeSKUItem({ RFID: 'rfid1', SKUId: 1, DateOfStock: '20/05/22'});
        await skudao.storeSKUItem({ RFID: 'rfid5', SKUId: 3, DateOfStock: '20/05/22'});
        
    });
    testNewInternalOrder('2023/05/22 18:00', 1);
    getInternalOrders();
    changeStateOfInternalOrder('COMPLETED');
    getItemFromInternalOrderFromID();
    storeProduct({ orderID: 1, SKUId: 3, description: 'description3', price: 40.00, qty: 30 });
    getProducts();
    deleteAnInternalOrder(); 
    
});

function testNewInternalOrder(date, customerid) {
    test('create new Internal Order', async () => {
        
        let id = await IODao.storeInternalOrder({date: date, state: states['ISSUED'], customerID: customerid});
        let res = await IODao.getInternalOrders();
        expect(res.length).toBeGreaterThanOrEqual(2);
        res = await IODao.getInternalOrderByID(id);
        expect(res).not.toStrictEqual(null);
        expect(res.id).not.toStrictEqual(null);
        expect(res.issueDate).toStrictEqual(date);
        expect(res.state).toStrictEqual('ISSUED');
        expect(res.customerID).toStrictEqual(customerid);
        expect(res.products).toStrictEqual([]);
    });
}

function getInternalOrders() {
    test('get Internal Orders', async () => {
        var res = await IODao.getInternalOrders();
        expect(res.length).toBeGreaterThanOrEqual(2);
        expect(res).not.toStrictEqual(null);
    });
}

function getItemFromInternalOrderFromID() {
    test('get InternalOrder from  ID', async () => {
        
        let idx = Math.floor(Math.random() * 2);
        let internalOrders = await IODao.getInternalOrders();
        expect(internalOrders).not.toBeNull();
        let internalOrder = internalOrders[idx];
        expect(internalOrder).not.toBeNull();

        let res_new = await IODao.getInternalOrderByID(internalOrder.id);
        expect(res_new).not.toStrictEqual(undefined);
        expect(res_new.id).toStrictEqual(internalOrder.id);
        expect(res_new.customerID).toStrictEqual(internalOrder.customerID);
        expect(res_new.issueDate).toStrictEqual(internalOrder.issueDate);
        expect(res_new.state).toStrictEqual(internalOrder.state);
        
    });
}

function storeProduct(new_product) {
    test('create new Product', async () => {
        
        let id = await IODao.storeProducts(new_product);
        let res = await IODao.getProducts();
        expect(res.length).toBeGreaterThanOrEqual(2);
        let prod = res.filter((e) => e.id == id)[0];
        expect(prod).not.toStrictEqual(null);
        expect(prod.skuid).toStrictEqual(new_product.SKUId);
        expect(prod.description).toStrictEqual(new_product.description);
        expect(prod.price).toStrictEqual(new_product.price);
        expect(prod.qty).toStrictEqual(new_product.qty);
        expect(prod.orderID).toStrictEqual(new_product.orderID);
        expect(prod.id).toStrictEqual(id);
    });
}

function getProducts() {
    test('get products', async () => {
        var res = await IODao.getProducts();
        expect(res.length).toBeGreaterThanOrEqual(1);
        expect(res).not.toStrictEqual(null);
    });
}

function changeStateOfInternalOrder(state) {
    test('change state of internal order', async () => {
        let idx = Math.floor(Math.random() * 2);
        let internalOrders = await IODao.getInternalOrders();
        expect(internalOrders).not.toBeNull();
        let internalOrder = internalOrders[idx];
        expect(internalOrder).not.toBeNull();
        let flag = await IODao.changeState(internalOrder.id, state);
        expect(flag).toStrictEqual(true);
        let res_new = await IODao.getInternalOrderByID(internalOrder.id);
        expect(res_new.state).toStrictEqual(state);
        
    });

}

function deleteAnInternalOrder() {
    test('delete internal order', async () => {
        
        let idx = Math.floor(Math.random() * 2);
        let internalOrders = await IODao.getInternalOrders();
        expect(internalOrders).not.toBeNull();
        let internalOrder = internalOrders[idx];
        expect(internalOrder).not.toBeNull();
        await IODao.deleteInternalOrder(internalOrder.id);
        let res_new = await IODao.getInternalOrderByID(internalOrder.id);
        expect(res_new).toStrictEqual(undefined);
        
    });
}



