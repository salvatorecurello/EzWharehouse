const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require("../server.js");
var agent = chai.request.agent(app);

describe("POST /api/item", function () {
    it('Creates a new Item without Error', function (done) {
        agent.post("/api/item")
            .send({ id: 1234, description: 'newDescription', price: 3, SKUId: 1, supplierId: 5 })
            .then(function (res) {
                res.should.have.status(201);
                done();
            })

    })
    it('Creates a new Item with status 422', function (done) {
        agent.post("/api/item")
            .send({ id: 1234, description: 'newDescription', price: 3, SKUId: 1, supplierId: 5 })
            .then(function (res) {
                res.should.have.status(422);
                done();
            })

    })
    it('Creates a new Item with status 404', function (done) {
        agent.post("/api/item")
            .send({ id: 12345, description: 'newDescription', price: 3, SKUId: 1234, supplierId: 5 })
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
    })
});

describe("GET /api/items", function () {
    it('Return an array containing all Items', function (done) {
        agent.get("/api/items")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done();
            })
    })
});

describe("GET /api/items", function () {
    it('Return an item, given its id without error', function (done) {
        agent.get("/api/items/1234")
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
    })
    it('Return an item, given its id with error 404', function (done) {
        agent.get("/api/items/dsaddw")
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
    })
    it('Return an item, given its id with error 422 for id not valid', function (done) {
        agent.get("/api/items/-1")
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })

});

describe("PUT /api/item", function () {
    let newDescr = 'a new sku';
    let newPri = 10.99;
    it('Modify an existing item', function (done) {
        agent.put("/api/item/1234")
            .send({ newDescription: newDescr, newPrice: newPri })
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
    })
})

describe("DELETE /api/items", function () {
    it('Delete an item receiving its id: 1234 without error', function (done) {
        agent.delete("/api/items/1234")
            .then(function (res) {
                res.should.have.status(204);
                agent.get("/api/items/1234")
                    .then(function (res) {
                        res.should.have.status(404);
                        done();
                    })
            })
    })
    it('Delete an item receiving its id with error 422 parsing id', function (done) {
        agent.delete("/api/items/dsfsdfdsfs")
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })
    it('Delete an item receiving its id with error 422 for not found', function (done) {
        agent.delete("/api/items/324243422112")
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })
})
