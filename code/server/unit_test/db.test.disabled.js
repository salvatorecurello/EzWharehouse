const mainDB = require("../db");
const db = new mainDB()

describe('test Database', () => {
    
    testCreateTables();
    testCreateDefaultUsers();
    testDeleteAll();
    testCreateItems();
    testCreateTableR();
    
});

function testCreateTables() {
    test('create new Promises on DB promise', async () => {
        let a = await db.createTables();
        expect(a).not.equal(null);

    });
}

function testCreateDefaultUsers() {
    test('create defafault Users promise', async () => {
        let a = await db.createDefaultUsers();
        expect(a).not.equal(null);
    });
}

function testCreateTableR() {
    test('Test create table promise', async () => {
        const sql = "CREATE TABLE example";
        let a = db.createTablesR(sql, 100000);
        expect(a).not.equal(null);
    });
}

function testCreateItems() {
    test('Test create Items promise', async () => {
        let a = db.createTestItems();
        expect(a).not.equal(null);
        
    });

}

function testDeleteAll() {
    test('Delete all tables promise', async () => {
        
        let a = await db.deleteAll();
        expect(a).not.equal(null);
        
    });
}



