const mainDB = require("../db.js");
module.exports = async () => {
    console.log("Cleaning db")
    const db = new mainDB();
    await db.deleteAll();
    await db.createTables();
};