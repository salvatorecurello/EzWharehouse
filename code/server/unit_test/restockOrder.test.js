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

const ItemDAO = require('../classes/Item/ItemDAO');
const iDAO = new ItemDAO();

const RestockOrderDAO = require('../classes/RestockOrder/RestockOrderDAO');
const RoDAO = new RestockOrderDAO();
const mainDB = require("../db.js");
const db = new mainDB();
describe('test RestockOrder', () => {
	beforeAll(async () => {
		await Promise.all(db.deleteAll());
		await Promise.all(db.createDefaultUsers());
		let skuId = await sDAO.storeSKU({ description: "testSKUrestockorder", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity: 10 });
		let suppId = await uDAO.storeUser({ username: "provarestockorder", name: "luca", surname: "ardito2", type: "supplier", password: "password" });
		let tdId = await tdDAO.storeTestDescriptor({ name: "testresulttestrestockorder", procedureDescription: "description for test", idSKU: skuId });
		await iDAO.storeItem({id:3, description:"a test item for unit restock", price: 10.5, skuid:skuId, supplierID:suppId});
		let itemId = 3;
		let order = { issueDate: '2021/11/29 09:33', products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:itemId }], supplierId: suppId };

		await RoDAO.store(order);
		await RoDAO.store(order);
		await RoDAO.store(order).then((id) =>
			RoDAO.setState(id, 'DELIVERY')
		);
		await RoDAO.store(order).then((id) =>
			RoDAO.setState(id, 'DELIVERED')
		);
		await RoDAO.store(order).then((id) =>
			RoDAO.setState(id, 'TESTED')
		);
		await RoDAO.store(order).then((id) =>
			RoDAO.setState(id, 'DELIVERED').then(() => RoDAO.setSkuItems(id, [{ rfid: "21345678901234567890123456789017", SKUId: skuId, itemId:itemId }]))
		).then((id) =>
			RoDAO.setState(id, 'COMPLETEDRETURN')
		);
		await RoDAO.store(order).then((id) =>
			RoDAO.setState(id, 'COMPLETED')
		);
		await RoDAO.store(order);

		await siDAO.storeSKUItem({ RFID: "21345678901234567890123456789016", SKUId: skuId, DateOfStock: "2021/12/29 12:30" });
		await siDAO.storeSKUItem({ RFID: "21345678901234567890123456789017", SKUId: skuId, DateOfStock: "2021/12/29 12:30" });
		await trDAO.storeTestResult({ rfid: "21345678901234567890123456789017", idTestDescriptor: tdId, Date: '2021/12/29', Result: 0 });
	});

	testStore();
	testSetState();
	testSetSkuItems();
	testSetTransportNote();
	testGetAll();
	testGetIssued();
	testGet();
	testGetReturnItems();
	testDelete();
});

function testStore() {
	test('store(order)', async () => {
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let suppId = await uDAO.getUserFromEmail('provarestockorder', "supplier").then((res) => {
			return res.id;
		});
		let orderId = await RoDAO.getAll().then((res) => {
			return res[res.length - 1].id;
		});

		let order1 = {
			issueDate: '2021/11/29 09:33',
			products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:3 }],
			supplierId: suppId
		};

		let order2 = {
			issueDate: 'g',
			products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:3 }],
			supplierId: suppId
		};

		let order3 = {
			issueDate: '2021/11/29 09:33',
			products: [{ SKUId: -1, description: 'a product', price: 10.99, qty: 30, itemId:3 }],
			supplierId: suppId
		};

		let order4 = {
			issueDate: '2021/11/29 09:33',
			products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 30, itemId:3 }],
			supplierId: -1
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

		expect(res1).toEqual(orderId + 1);
		expect(res2.transportNote).not.toBeDefined();
		expect(res2.issueDate).toEqual('2021/11/29 09:33');
		expect(res2.state).toEqual('ISSUED');
		expect(res2.products).toEqual([{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:3 }]);
		expect(res2.supplierId).toEqual(suppId);
		expect(res2.skuItems).toEqual([]);
		expect(res3).toEqual("Wrong data");
		expect(res4).toEqual("Wrong data");
		expect(res5).toEqual("Wrong data");
	});
}

function testSetState() {
	test('setState(id, state)', async () => {
		let states = ['DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];
		let orderId = await RoDAO.getAll().then((res) => {
			return res[0].id;
		});

		let res1 = await RoDAO.setState(orderId, states[0]).then(() =>
			RoDAO.get(orderId)
		).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.setState(orderId, states[1]).then(() =>
			RoDAO.get(orderId)
		).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.setState(orderId, states[2]).then(() =>
			RoDAO.get(orderId)
		).catch((err) => {
			return err;
		});

		let res4 = await RoDAO.setState(orderId, states[3]).then(() =>
			RoDAO.get(orderId)
		).catch((err) => {
			return err;
		});

		let res5 = await RoDAO.setState(orderId, states[4]).then(() =>
			RoDAO.get(orderId)
		).catch((err) => {
			return err;
		});

		let res6 = await RoDAO.setState(-1, states[0]).catch((err) => {
			return err;
		});

		let res7 = await RoDAO.setState(orderId, 'g').catch((err) => {
			return err;
		});

		let res8 = await RoDAO.setState('g', states[0]).catch((err) => {
			return err;
		});

		expect(res1.state).toEqual(states[0]);
		expect(res2.state).toEqual(states[1]);
		expect(res3.state).toEqual(states[2]);
		expect(res4.state).toEqual(states[3]);
		expect(res5.state).toEqual(states[4]);
		expect(res6).toEqual("No match");
		expect(res7).toEqual("Wrong data");
		expect(res8).toEqual("Wrong data");
	});
}

function testSetSkuItems() {
	test('setSkuItems(id, skuItems)', async () => {
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let skuItems1 = [
			{ rfid: "21345678901234567890123456789015", SKUId: skuId, itemId:3 }
		];
		let skuItems2 = [
			{ rfid: "21345678901234567890123456789016", SKUId: skuId, itemId:3 }
		];
		let skuItems3 = [
			{ rfid: "21345678901234567890123456789015", SKUId: -1, itemId:3 }
		];
		let orderId = await RoDAO.getAll().then((res) => {
			for (order of res)
				if (order.state == 'DELIVERED' && order.id != res[0].id)
					return order.id;
		});

		let res1 = await RoDAO.setSkuItems(orderId, skuItems1).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.setSkuItems(-1, skuItems1).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.setSkuItems(orderId - 1, skuItems1).catch((err) => {
			return err;
		});

		let res4 = await RoDAO.setSkuItems(orderId, skuItems2).catch((err) => {
			return err;
		});

		let res5 = await RoDAO.setSkuItems(orderId, skuItems3).catch((err) => {
			return err;
		});

		let res6 = await RoDAO.setSkuItems('g', skuItems1).catch((err) => {
			return err;
		});

		expect(res1).toEqual(orderId);
		expect(res2).toEqual("No match");
		expect(res3).toEqual("Wrong data");

		expect(res5).toEqual("Wrong data");
		expect(res6).toEqual("Wrong data");
	});
}

function testSetTransportNote() {
	test('setTransportNote(id, transportNote)', async () => {
		let transportNote1 = { deliveryDate: '2021/12/29' };
		let transportNote2 = { deliveryDate: 'g' };
		let transportNote3 = { deliveryDate: '2021/10/29' };
		let orderId = await RoDAO.getAll().then((res) => {
			for (order of res)
				if (order.state == 'DELIVERY' && order.id != res[0].id)
					return order.id;
		});

		let res1 = await RoDAO.setTransportNote(orderId, transportNote1).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.setTransportNote(-1, transportNote1).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.setTransportNote(orderId + 1, transportNote1).catch((err) => {
			return err;
		});

		let res4 = await RoDAO.setTransportNote(orderId, transportNote2).catch((err) => {
			return err;
		});

		let res5 = await RoDAO.setTransportNote(orderId, transportNote3).catch((err) => {
			return err;
		});

		let res6 = await RoDAO.setTransportNote('g', transportNote1).catch((err) => {
			return err;
		});

		expect(res1).toEqual(orderId);
		expect(res2).toEqual("No match");
		expect(res3).toEqual("Wrong data");
		expect(res4).toEqual("Wrong data");
		expect(res5).toEqual("Wrong data");
		expect(res6).toEqual("Wrong data");
	});
}

function testGetAll() {
	test('getAll()', async () => {
		let states = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let suppId = await uDAO.getUserFromEmail('provarestockorder', "supplier").then((res) => {
			return res.id;
		});

		let res1 = await RoDAO.getAll().catch((err) => {
			return err;
		});

		let res2 = res1[4];

		expect(res1.length).toBeGreaterThanOrEqual(8);
		expect(res1.length).toBeLessThanOrEqual(10);
		expect(res2.id).toBeDefined();
		expect(res2.issueDate).toEqual('2021/11/29 09:33');
		expect(states).toContain(res2.state);
		expect(res2.products).toEqual([{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:3 }]);
		expect(res2.supplierId).toEqual(suppId);
		expect(res2.skuItems).toBeDefined();
	});
}

function testGetIssued() {
	test('getIssued()', async () => {
		let states = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let suppId = await uDAO.getUserFromEmail('provarestockorder', "supplier").then((res) => {
			return res.id;
		});

		let res1 = await RoDAO.getIssued().catch((err) => {
			return err;
		});

		let res2 = res1[0];

		expect(res1.length).toBeGreaterThanOrEqual(2);
		expect(res1.length).toBeLessThanOrEqual(4);
		expect(res2.id).toBeDefined();
		expect(res2.issueDate).toEqual('2021/11/29 09:33');
		expect(res2.state).toEqual('ISSUED');
		expect(res2.products).toEqual([{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:3 }]);
		expect(res2.supplierId).toEqual(suppId);
		expect(res2.skuItems).toBeDefined();
	});
}

function testGet() {
	test('get(id)', async () => {
		let states = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let suppId = await uDAO.getUserFromEmail('provarestockorder', "supplier").then((res) => {
			return res.id;
		});
		let orderId = await RoDAO.getAll().then((res) => {
			return res[4].id;
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
		expect(res1.issueDate).toEqual('2021/11/29 09:33');
		expect(states).toContain(res1.state);
		expect(res1.products).toEqual([{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:3 }]);
		expect(res1.supplierId).toEqual(suppId);
		expect(res1.skuItems).toBeDefined();
		expect(res2).toEqual("No match");
		expect(res3).toEqual("Wrong data");
	});
}

function testGetReturnItems() {
	test('getReturnItems(id)', async () => {
		let skuId = await sDAO.getSkus().then((res) => {
			return res[0].id;
		});
		let orderId = await RoDAO.getAll().then((res) => {
			for (order of res)
				if (order.state == 'COMPLETEDRETURN' && order.id != res[0].id)
					return order.id;
		});

		let res1 = await RoDAO.getReturnItems(orderId).catch((err) => {
			return err;
		});

		let res2 = await RoDAO.getReturnItems(-1).catch((err) => {
			return err;
		});

		let res3 = await RoDAO.getReturnItems(orderId - 1).catch((err) => {
			return err;
		});

		let res4 = await RoDAO.getReturnItems('g').catch((err) => {
			return err;
		});
		expect(res1).toEqual([{ rfid: "21345678901234567890123456789017", SKUId: skuId, itemId:3 }]);
		expect(res2).toEqual("No match");
		expect(res3).toEqual("Wrong data");
		expect(res4).toEqual("Wrong data");

	});
}

function testDelete() {
	test('delete(id)', async () => {
		let orderId = await RoDAO.getAll().then((res) => {
			return res[6].id;
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