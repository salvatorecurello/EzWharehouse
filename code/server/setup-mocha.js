const mainDB = require("./db.js");
before('cleaning db', async () => {
    console.log('Cleaning DB');
    const db = new mainDB();
    await Promise.all(db.createTables());
    await Promise.all(db.deleteAll());
    await Promise.all(db.createDefaultUsers());
});