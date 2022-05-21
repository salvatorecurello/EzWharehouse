const mainDB = require("../db.js");
exports.mochaGlobalSetup = async function() {
    console.log('Cleaning DB');
    const db = new mainDB();
    await db.deleteAll();
};