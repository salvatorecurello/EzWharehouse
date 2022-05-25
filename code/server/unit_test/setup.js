const mainDB = require("../db.js");
module.exports = async () => {
    console.log("Cleaning db")
    const db = new mainDB();
    await Promise.all(db.createTables());
    await Promise.all(db.deleteAll());
    await Promise.all(db.createDefaultUsers());
};