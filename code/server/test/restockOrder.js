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
const RoDAO = new RestockOrderDAO();

const ItemDAO = require('../classes/Item/ItemDAO');
const iDAO = new ItemDAO();

var skuId, suppId, itemId, orders = [];
before('RestockOrder Test setup', async () => {
	skuId = await sDAO.storeSKU({ description: "testSKUrestockorder", weight: 100, volume: 100, notes: "notes sku", price: 10, availableQuantity: 10 });
	suppId = await uDAO.storeUser({ username: "provarestockorder", name: "luca", surname: "ardito2", type: "supplier", password: "password" });
	let tdId = await tdDAO.storeTestDescriptor({ name: "testresulttestrestockorder", procedureDescription: "description for test", idSKU: skuId });
	itemId = (await iDAO.storeItem({id:1, description:"a test item", price: 10.5, skuid:skuId, supplierID:suppId})).lastID;
	let order = { issueDate: '2021/11/29 09:33', products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:itemId}], supplierId: suppId };

	orders.push(await RoDAO.store(order));
	orders.push(await RoDAO.store(order));
	orders.push(await RoDAO.store(order));
	orders.push(await RoDAO.store(order));
	orders.push(await RoDAO.store(order).then((id) =>
		RoDAO.setState(id, 'DELIVERED').then(() => RoDAO.setSkuItems(id, [{ rfid: "23345678901234567890123456789017", SKUId: skuId, itemId:itemId}]))
	));
	orders.push(await RoDAO.store(order));

	await RoDAO.setState(orders[1], 'DELIVERY');
	await RoDAO.setState(orders[2], 'DELIVERED');
	await RoDAO.setState(orders[3], 'TESTED');
	await RoDAO.setState(orders[4], 'COMPLETEDRETURN');
	await RoDAO.setState(orders[5], 'COMPLETED');

	await siDAO.storeSKUItem({ RFID: "23345678901234567890123456789016", SKUId: skuId, DateOfStock: "2021/12/29 12:30" });
	await siDAO.storeSKUItem({ RFID: "23345678901234567890123456789017", SKUId: skuId, DateOfStock: "2021/12/29 12:30" });
	await trDAO.storeTestResult({ rfid: "23345678901234567890123456789017", idTestDescriptor: tdId, Date: '2021/12/29', Result: 0 });
});

describe('POST /api/restockOrder', () => {
	it('should create new order', function (done) {
		agent.post('/api/restockOrder').send(
			{ issueDate: '2021/11/29 09:33', products: [{ SKUId: skuId, description: 'a product', price: 10.99, qty: 3, itemId:itemId }], supplierId: suppId }
		).then((res) => {
			res.should.have.status(201);

			done();
		});
	});

	it('should not create new order', function (done) {
		agent.post('/api/restockOrder').send('g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('PUT /api/restockOrder/:id', () => {
	it('should set order.state to newState ', function (done) {
		agent.put('/api/restockOrder/' + orders[3]).send(
			{ newState: 'COMPLETED' }
		).then((res) => {
			res.should.have.status(200);

			done();
		});
	});

	it('should not set order.state to newState ', function (done) {
		agent.put('/api/restockOrder/-1').send(
			{ newState: 'COMPLETED' }
		).then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not set order.state to newState ', function (done) {
		agent.put('/api/restockOrder/' + orders[3]).send('g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('PUT /api/restockOrder/:id/skuItems', () => {
	it('should add skuItems to order', function (done) {
		agent.put('/api/restockOrder/' + orders[2] + '/skuItems').send(
			{
				"skuItems":
					[{ rfid: "23345678901234567890123456789015", SKUId: skuId, itemId:itemId }]
			}
		).then((res) => {

			res.should.have.status(200);

			done();
		});
	});

	it('should not add skuItems to order', function (done) {
		agent.put('/api/restockOrder/-1/skuItems').send(
			{
				"skuItems":
					[{ rfid: "23345678901234567890123456789015", SKUId: skuId, itemId:itemId }]
			}
		).then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not add skuItems to order', function (done) {
		agent.put('/api/restockOrder/' + orders[2] + '/skuItems').send('g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('PUT /api/restockOrder/:id/transportNote', () => {
	it('should add transportNote to order', function (done) {
		agent.put('/api/restockOrder/' + orders[1] + '/transportNote').send(
			{
				"transportNote":
					{ deliveryDate: '2021/12/29' }
			}
		).then((res) => {
			res.should.have.status(200);

			done();
		});
	});

	it('should not add transportNote to order', function (done) {
		agent.put('/api/restockOrder/-1/transportNote').send(
			{
				"transportNote":
					{ deliveryDate: '2021/12/29' }
			}
		).then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not add transportNote to order', function (done) {
		agent.put('/api/restockOrder/' + orders[1] + '/transportNote').send('g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('GET /api/restockOrders', () => {
	it('should get all orders', function (done) {
		agent.get('/api/restockOrders').then((res) => {
			res.should.have.status(200);

			res.body.length.should.be.greaterThanOrEqual(orders.length);

			done();
		});
	});
});

describe('GET /api/restockOrdersIssued', () => {
	it('should get issued orders', function (done) {
		agent.get('/api/restockOrdersIssued').then((res) => {
			
			res.should.have.status(200);
			res.body.forEach(x => {
				x.state.should.equal('ISSUED');
			});

			done();
		});
	});
});

describe('GET /api/restockOrders/:id', () => {
	it('should get order', function (done) {
		agent.get('/api/restockOrders/' + orders[4]).then((res) => {
			res.should.have.status(200);
			res.body.issueDate.should.be.equal('2021/11/29 09:33');
			res.body.products.length.should.be.equal(1);
			res.body.products[0].SKUId.should.equal(skuId)
			res.body.products[0].description.should.equal("a product")
			res.body.products[0].price.should.equal(10.99)
			res.body.products[0].qty.should.equal(3)
			res.body.products[0].itemId.should.equal(itemId);
			res.body.skuItems.length.should.be.equal(1);
			res.body.skuItems[0].rfid.should.equal("23345678901234567890123456789017")
			res.body.skuItems[0].SKUId.should.equal(skuId)
			res.body.skuItems[0].itemId.should.equal(itemId);
			res.body.state.should.equal('COMPLETEDRETURN');
			res.body.supplierId.should.be.equal(suppId);


			done();
		});
	});

	it('should not get order', function (done) {
		agent.get('/api/restockOrders/-1').then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not get order', function (done) {
		agent.get('/api/restockOrders/g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('GET /api/restockOrders/:id/returnItems', () => {
	it('should get returnItems', function (done) {
		agent.get('/api/restockOrders/' + orders[4] + '/returnItems').then((res) => {
			
			res.should.have.status(200);
			res.body.length.should.be.equal(1);
			res.body[0].SKUId.should.equal(skuId)
			res.body[0].rfid.should.equal("23345678901234567890123456789017")
			res.body[0].itemId.should.equal(itemId);
			done();
		});
	});

	it('should not get returnItems', function (done) {
		agent.get('/api/restockOrders/-1/returnItems').then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not get returnItems', function (done) {
		agent.get('/api/restockOrders/g/returnItems').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});

describe('DELETE /api/restockOrder/:id', () => {
	it('should delete an order', function (done) {
		agent.delete('/api/restockOrder/' + orders[orders.length - 1]).then((res) => {
			res.should.have.status(204);

			done();
		});
	});

	it('should not delete order', function (done) {
		agent.get('/api/restockOrders/-1').then((res) => {
			res.should.have.status(404);

			done();
		});
	});

	it('should not delete order', function (done) {
		agent.get('/api/restockOrders/g').then((res) => {
			res.should.have.status(422);

			done();
		});
	});
});