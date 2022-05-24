const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require("../server.js");
var agent = chai.request.agent(app);

describe("POST /api/internalOrders", function () {
    it('Creates a new internal order in state = ISSUED', function (done) {
        agent.post("/api/internalOrders")
            .send({
                issueDate: "2021/11/29 09:33", products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
                { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }], customerId: 2
            })
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
    })
    it('Creates a new internal order in state = ISSUED with error 422 for supplier does not found', function (done) {
        agent.post("/api/internalOrders")
            .send({
                issueDate: "2021/11/29 09:33", products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
                { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }], customerId: 20382
            })
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })
});

describe("GET /api/internalOrders", function () {
    it('Return an array containing all internal orders', function (done) {
        agent.get("/api/internalOrders")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done();
            })
    })
});

describe("GET /api/internalOrdersIssued", function () {
    it('Return an array containing all internal orders in state = ISSUED', function (done) {
        agent.get("/api/internalOrdersIssued")
            .then(function (res) {
                res.body.forEach(e => {
                    e.state.should.equal('ISSUED');
                });
                res.should.have.status(200);
                done();
            })
    })
});

describe("GET /api/internalOrdersAccepted", function () {
    it('Return an array containing all internal orders in state = ACCEPTED', function (done) {
        agent.get("/api/internalOrdersAccepted")
            .then(function (res) {
                res.body.forEach(e => {
                    e.state.should.equal('ACCEPTED');
                });
                res.should.have.status(200);
                done();
            })
    })
});

describe("GET /api/internalOrders", function () {
    it('Return an internal order, given its id', function (done) {
        agent.get("/api/internalOrders").then(function (res) {
            let a = res.body.length;
            let idx = Math.floor(Math.random() * a);
            agent.get("/api/internalOrders/" + idx)
                .then(function (res) {
                    res.should.have.status(200);
                });
            done();
        })
    });
});

describe("PUT /api/internalOrders", function () {
    it('Modify the state of an internal order, given its id. If newState is = COMPLETED an array of RFIDs is sent', function (done) {
        agent.get("/api/internalOrders").then(function (res) {
            let a = res.body.length;
            let idx = Math.floor(Math.random() * a);
            agent.put("/api/internalOrders/" + idx)
                .send({ newState: "ACCEPTED" })
                .then(function (res) {
                    res.should.have.status(204);
                });
            done();
        })
    })
})

describe("DELETE /api/internalOrders", function () {
    it('Delete an item receiving its id', function (done) {
        agent.get("/api/internalOrders").then(function (res) {
            let a = res.body[0].id;
            let b = res.body[res.body.length - 1].id;
            let idx = Math.floor(Math.random() * b) + a;
            agent.delete("/api/internalOrders/" + idx)
                .then(function (res) {
                    res.should.have.status(204);
                });
            done();
        })
    })
    it('Delete an item receiving an id unvalidated', function (done) {
        agent.delete("/api/internalOrders/njnjnk")
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })
})