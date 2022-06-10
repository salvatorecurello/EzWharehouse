const SKUDAO = require('../classes/SKU/SKUDAO');
const sDAO = new SKUDAO();

const UserDAO = require('../classes/User/UserDAO');
const uDAO = new UserDAO();

const SKUItemDAO = require('../classes/SKUItem/SKUItemDAO');
const siDAO = new SKUItemDAO();

const TestDescriptorDAO = require('../classes/TestDescriptor/TestDescriptorDAO');
const tdDAO = new TestDescriptorDAO();

const TestResultDAO = require('../classes/TestResult/TestResultDAO');
const trDAO = new TestResultDAO();

const RestockOrderDAO = require('../classes/RestockOrder/RestockOrderDAO');
const roDAO = new RestockOrderDAO();

const ItemDAO = require('../classes/Item/ItemDAO');
const iDAO = new ItemDAO();

const ReturnOrderDAO = require('../classes/ReturnOrder/ReturnOrderDAO');
const RoDAO = new ReturnOrderDAO();
const mainDB = require("../db.js");
const db = new mainDB();
describe('test ReturnOrder', () => {
	beforeAll(async () => {
		await Promise.all(db.deleteAll());
		await Promise.all(db.createDefaultUsers());
		let skuId = await sDAO.storeSKU({ description: "testSKUreturnOrder", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity: 10 });
		let suppId = await uDAO.storeUser({ username: "provareturnorder", name: "luca", surname: "ardito2", type: "supplier", password: "password" });
		let tdId = await tdDAO.storeTestDescriptor({ name: "testresulttestreturnorder", procedureDescription: "description for test", idSKU: skuId });
		await iDAO.storeItem({id:4, description:"a test item for unit return", price: 10.5, skuid:skuId, supplierID:suppId});
		let itemId=4;
		let ro = { issueDate: '2021/11/29 09:33', products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:itemId }], supplierId: suppId };
		let roId = await roDAO.store(ro);
		let order = {
			returnDate: "2021/12/30 09:33",
			products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:itemId }],
			restockOrderId: roId
		};

		await roDAO.setState(roId, 'DELIVERED').then(() => roDAO.setSkuItems(roId, [{ rfid: "22345678901234567890123456789017", SKUId: skuId, itemId:itemId }]));

		await RoDAO.store(order);
		await RoDAO.store(order);
		await RoDAO.store(order);

		await siDAO.storeSKUItem({ RFID: "22345678901234567890123456789017", SKUId: skuId, DateOfStock: "2021/12/29 12:30" });
		await trDAO.storeTestResult({ rfid: "22345678901234567890123456789017", idTestDescriptor: tdId, Date: '2021/12/29', Result: 0 });
	});

	testStore();
	testGetAll();
	testGet();
	testDelete();
});

function testStore() {
	test('store(order)', async () => {
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let roId = await roDAO.getAll().then((res) => {
			return res[0].id;
		});
		let orderId = await RoDAO.getAll().then((res) => {
			return res[res.length - 1].id;
		});

		let order1 = {
			returnDate: "2021/12/30 09:33",
			products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }],
			restockOrderId: roId
		};

		let order2 = {
			returnDate: "2021/12/30 09:33",
			products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }],
			restockOrderId: -1
		};

		let order3 = {
			returnDate: "g",
			products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }],
			restockOrderId: roId
		};

		let order4 = {
			returnDate: "2021/12/30 09:33",
			products: [{ SKUId: -1, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }],
			restockOrderId: roId
		};

		let order5 = {
			returnDate: "2021/12/30 09:33",
			products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789018", itemId:4 }],
			restockOrderId: roId
		};

		let res1 = await RoDAO.store(order1).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.store(order1).then((id) =>
			RoDAO.get(id)
		).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.store(order2).catch((err) => {
			return err;
		});

		let res4 = await RoDAO.store(order3).catch((err) => {
			return err;
		});

		let res5 = await RoDAO.store(order4).catch((err) => {
			return err;
		});

		let res6 = await RoDAO.store(order5).catch((err) => {
			return err;
		});

		expect(res1).toBe(orderId + 1);
		expect(res2.returnDate).toEqual('2021/12/30 09:33');
		expect(res2.products).toEqual([{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }]);
		expect(res2.restockOrderId).toEqual(roId);
		expect(res3).toEqual("No match");
		expect(res4).toEqual("Wrong data");
	});
}

function testGetAll() {
	test('getAll()', async () => {
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let roId = await roDAO.getAll().then((res) => {
			return res[0].id;
		});

		let res1 = await RoDAO.getAll().catch((err) => {
			return err;
		});

		let res2 = res1[2];

		expect(res1.length).toBeGreaterThanOrEqual(3);
		expect(res2.id).toBeDefined();
		expect(res2.returnDate).toEqual('2021/12/30 09:33');
		expect(res2.products).toEqual([{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }]);
		expect(res2.restockOrderId).toEqual(roId);
	});
}

function testGet() {
	test('get(id)', async () => {
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let roId = await roDAO.getAll().then((res) => {
			return res[0].id;
		});
		let orderId = await RoDAO.getAll().then((res) => {
			return res[2].id;
		});

		let res1 = await RoDAO.get(orderId).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.get(-1).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.get('g').catch((err) => {
			return err;
		});

		expect(res1.id).not.toBeDefined();
		expect(res1.returnDate).toEqual('2021/12/30 09:33');
		expect(res1.products).toEqual([{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:4 }]);
		expect(res1.restockOrderId).toEqual(roId);
		expect(res2).toEqual("No match");
		expect(res3).toEqual("Wrong data");
	});
}

function testDelete() {
	test('delete(id)', async () => {
		let orderId = await RoDAO.getAll().then((res) => {
			return res[1].id;
		});

		let res1 = await RoDAO.delete(orderId).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.get(res1).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.delete(-1).catch((err) => {
			return err;
		});

		let res4 = await RoDAO.delete('g').catch((err) => {
			return err;
		});

		expect(res1).toEqual(orderId);
		expect(res2).toEqual("No match");
		expect(res3).toEqual("No match");
		expect(res4).toEqual("Wrong data");
	});
}