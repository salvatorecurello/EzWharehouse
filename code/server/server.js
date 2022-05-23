'use strict';
const express = require('express');
const DAO = require('./db.js');
const session = require('express-session');

// init express
const app = new express();
const port = 3001;

const db = new DAO();
db.createTables().catch((err) => { throw err; });
db.createTestItems()
app.use(express.json());

app.use(session({
  secret: 'justkeepthissecret',
  resave: true,
  saveUninitialized: true
}));

require('./classes/InternalOrder/InternalOrderAPI.js')(app);
require('./classes/Item/ItemAPI.js')(app);
require('./classes/Position/PositionAPI.js')(app);
require('./classes/RestockOrder/RestockOrderAPI.js')(app);
require('./classes/ReturnOrder/ReturnOrderAPI.js')(app);
require('./classes/SKU/SKUAPI.js')(app);
require('./classes/SKUItem/SKUItemAPI.js')(app);
require('./classes/TestDescriptor/TestDescriptorAPI.js')(app);
require('./classes/TestResult/TestResultAPI.js')(app);
require('./classes/User/UserAPI.js')(app);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;