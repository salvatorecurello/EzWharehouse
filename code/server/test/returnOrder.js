const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require("../server.js");
var agent = chai.request.agent(app);

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

const ReturnOrderDAO = require('../classes/ReturnOrder/ReturnOrderDAO');
const RoDAO = new ReturnOrderDAO();

const ItemDAO = require('../classes/Item/ItemDAO');
const iDAO = new ItemDAO();

var skuId, roId, itemId, orders = [];
before('ReturnOrder Test setup', async () => {
	skuId = await sDAO.storeSKU({ description: "testSKUreturnOrder", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity: 10 });
	let suppId = await uDAO.storeUser({ username: "provareturnorder", name: "luca", surname: "ardito2", type: "supplier", password: "password" });
	let tdId = await tdDAO.storeTestDescriptor({ name: "testresulttestreturnorder", procedureDescription: "description for test", idSKU: skuId });
	itemId = (await iDAO.storeItem({id:2, description:"a test item for returnOrder", price: 10.6, skuid:skuId, supplierID:suppId})).lastID;
	let ro = { issueDate: '2021/11/29 09:33', products: [{ SKUId: skuId, itemId:itemId, description: 'a product', price: 10.99, qty: 3 }], supplierId: suppId };
	roId = await roDAO.store(ro);
	let order = {
		returnDate: "2021/12/30 09:33",
		products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:itemId }],
		restockOrderId: roId
	};

	await roDAO.setState(roId, 'DELIVERED').then(() => roDAO.setSkuItems(roId, [{ rfid: "22345678901234567890123456789017", SKUId: skuId, itemId:itemId }]));

	orders.push(await RoDAO.store(order));
	orders.push(await RoDAO.store(order));
	orders.push(await RoDAO.store(order));

	await siDAO.storeSKUItem({ RFID: "22345678901234567890123456789017", SKUId: skuId, DateOfStock: "2021/12/29 12:30" });
	await trDAO.storeTestResult({ rfid: "22345678901234567890123456789017", idTestDescriptor: tdId, Date: '2021/12/29', Result: 0 });
});

describe('POST /api/returnOrder', () => {
	it('should create new order', function (done) {
		agent.post('/api/returnOrder').send(
			{
				returnDate: "2021/12/30 09:33",
				products: [{ SKUId: skuId, description: "a product", price: 10.99, RFID: "22345678901234567890123456789017", itemId:itemId, }],
				restockOrderId: roId
			}
		).then((res) => {
			res.should.have.status(201);

			done();
		});
	});

	it('should not create new order', function (done) {
		agent.post('/api/returnOrder').send('g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('GET /api/returnOrders', () => {
	it('should get all orders', function (done) {
		agent.get('/api/returnOrders').then((res) => {
			res.should.have.status(200);

			res.body.length.should.be.greaterThanOrEqual(orders.length);

			done();
		});
	});
});

describe('GET /api/returnOrders/:id', () => {
	it('should get order', function (done) {
		agent.get('/api/returnOrders/' + orders[1]).then((res) => {

			res.should.have.status(200);
			res.body.returnDate.should.be.equal('2021/12/30 09:33');

			res.body.products.length.should.equal(1);
			res.body.products[0].SKUId.should.equal(skuId)
			res.body.products[0].description.should.equal("a product")
			res.body.products[0].price.should.equal(10.99)
			res.body.products[0].itemId.should.equal(itemId)
			res.body.products[0].RFID.should.equal("22345678901234567890123456789017")



			res.body.restockOrderId.should.equal(roId);


			done();
		});
	});

	it('should not get order', function (done) {
		agent.get('/api/returnOrders/-1').then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not get order', function (done) {
		agent.get('/api/returnOrders/g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('DELETE /api/returnOrder/:id', () => {
	it('should delete an order', function (done) {
		agent.delete('/api/returnOrder/' + orders[orders.length - 1]).then((res) => {
			res.should.have.status(204);

			done();
		});
	});

	it('should not delete order', function (done) {
		agent.get('/api/returnOrders/-1').then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not delete order', function (done) {
		agent.get('/api/returnOrders/g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});