const mainDB = require("../db.js");
module.exports = async () => {
    console.log("Cleaning db")
    const db = new mainDB();
    await db.dropAll(); //da errore se il db è stato cancellato
    await db.createTables();
};