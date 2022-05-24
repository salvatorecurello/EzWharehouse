/*const dataBase = require('../db.js');
const db = new dataBase();

const SKUDAO = require('../classes/SKU/SKUDAO.js');
const sDAO = new SKUDAO();

const UserDAO = require('../classes/User/UserDAO.js');
const uDAO = new UserDAO();

const RestockOrderDAO = require('../classes/RestockOrder/RestockOrderDAO.js');
const RoDAO = new RestockOrderDAO();

beforeAll(async () => {
	await db.createTables().catch((err) => console.log(err));
});

test('test RestockOrder correct store(order)', () => {
	let sku1 = {
		id: 1,
		description: 'description1',
		weight: 10,
		volume: 10,
		position: 1,
		availableQuantity: 10,
		price: 2.00,
		note: 'note1'
	};
	let sku2 = {
		id: 2,
		description: 'description2',
		weight: 10,
		volume: 10,
		position: 1,
		availableQuantity: 10,
		price: 2.00,
		note: 'note1'
	};
	let user = {
		id: 1,
		name: 'nome',
		surname: 'cognome',
		type: 'supplier',
		password: 'password',
		email: 'supplier1@ezwh.com'
	};
	let order = {
		issueDate: '2021/11/29 09:33',
		products: [
			{
				SKUId: 1,
				description: 'a product',
				price: 60,
				qty: 30
			},
			{
				SKUId: 2,
				description: 'another product',
				price: 40,
				qty: 20
			}
		],
		supplierId: 1
	};


});
//test('test RestockOrder wrong store()', () => {});
*/

describe('test RestockOrder', () => {
	beforeEach(() => {

	});

	afterEach(() => {

	});

	test('test RestockOrder getAll()', () => {

	});

	test('test RestockOrder getIssued()', () => {

	});

	test('test RestockOrder correct get(id)', () => {

	});
	//test('test RestockOrder wrong get(id)', () => {});

	test('test RestockOrder correct getReturnItems(id)', () => {

	});
	//test('test RestockOrder wrong getReturnItems(id)', () => {});

	test('test RestockOrder correct setState(id, state)', () => {

	});
	//test('test RestockOrder wrong setState(id, state)', () => {});

	test('test RestockOrder correct setSkuItems(id, skuItems)', () => {

	});
	//test('test RestockOrder wrong setSkuItems(id, skuItems)', () => {});

	test('test RestockOrder correct setTransportNote(id, transportNote)', () => {

	});
	//test('test RestockOrder wrong setTransportNote(id, transportNote)', () => {});
});

test('test RestockOrder correct delete(id)', () => {

});
//test('test RestockOrder wrong delete(id)', () => {});