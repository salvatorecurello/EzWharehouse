const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require("../server.js");
var agent = chai.request.agent(app);

