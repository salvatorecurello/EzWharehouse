const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require("../server.js");
var agent = chai.request.agent(app);

const RestockOrderDAO = require('../classes/RestockOrder/RestockOrderDAO');
const roDAO = new RestockOrderDAO();

const ReturnOrderDAO = require('../classes/ReturnOrder/ReturnOrderDAO');
const RoDAO = new ReturnOrderDAO();