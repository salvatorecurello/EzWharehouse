const mainDB = require("../db");
const db = new mainDB()

describe('test Database', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
    });
    testCreateTables();
    testCreateDefaultUsers();
    testDeleteAll();
    testCreateItems();
    testCreateTableR();
});

function testCreateTables() {
    test('create new Promises on DB promise', async () => {
        let a = await db.createTables();
        expect(a).not.toStrictEqual(null);

    });
}

function testCreateDefaultUsers() {
    test('create defafault Users promise', async () => {
        let a = await db.createDefaultUsers();
        expect(a).not.toStrictEqual(null);
    });
}

function testCreateTableR() {
    test('Test create table promise', async () => {
        const sql = ["CREATE TABLE example"];
        let a = db.createTablesR(sql, 1);
        expect(a).not.toStrictEqual(null);
    });
}

function testCreateItems() {
    test('Test create Items promise', async () => {
        let a = db.createTestItems();
        expect(a).not.toStrictEqual(null);
        
    });

}

function testDeleteAll() {
    test('Delete all tables promise', async () => {
        
        let a = await db.deleteAll();
        expect(a).not.toStrictEqual(null);
        
    });
}



