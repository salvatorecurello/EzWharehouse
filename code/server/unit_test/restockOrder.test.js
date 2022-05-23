const dataBase = require('../db.js');
const RestockOrderDAO = require('../RestockOrder/RestockOrderDAO.js');
const RoDAO = new RestockOrderDAO();

describe('test RestockOrders', () => {
	beforeAll(async () => {
		const db = new dataBase();
		await db.createTables();
	});
});