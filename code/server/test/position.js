const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require("../server.js");
var agent = chai.request.agent(app);


describe("POST /api/position", function () {
    it('Creates a new Position', function (done) {
        agent.post("/api/position")
            .send({ positionID: '123412341234', col: '1234', row: '1234', maxWeight: 20, maxVolume: 20, aisleID: '1234' })
            .then(function (res) {
                res.should.have.status(201);
                done();
            })

    })
    it('Creates a new Position with different PositionID', function (done) {
        agent.post("/api/position")
            .send({ positionID: '1234213212', col: '1234', row: '1234', maxWeight: 20, maxVolume: 20, aisleID: '1234' })
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })

    it('Creates a new Position with error 422', function (done) {
        agent.post("/api/position")
            .send({ positionID: '234523452345', col: '2345', row: '2345', maxWeight: -20, maxVolume: -20, aisleID: '2345' })
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })
});

describe("GET /api/positions", function () {
    it('Return an array containing all positions', function (done) {
        agent.get("/api/positions")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done();
            })
    })
});

describe("PUT /api/position", function () {
    it('Modify a position identified by positionID: 123412341234', function (done) {
        agent.put("/api/position/123412341234")
            .send({ newAisleID: '8002', newRow: '3454', newCol: '3412', newMaxWeight: 1200, newMaxVolume: 600, newOccupiedWeight: 200, newOccupiedVolume: 100 })
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
    })
    it('Modify a position with error 404 not found position', function (done) {
        agent.put("/api/position/123412341234")
            .send({ newAisleID: '8002', newCol: '3412', newRow: '3454', newMaxWeight: 1200, newMaxVolume: 600, newOccupiedWeight: 200, newOccupiedVolume: 100 })
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
    })
    it('Modify a position with error 422 not valid Weigh and Volume', function (done) {
        agent.put("/api/position/800234543412")
            .send({ newAisleID: '8002', newCol: '3412', newRow: '3454', newMaxWeight: -2, newMaxVolume: -600, newOccupiedWeight: -200, newOccupiedVolume: -100 })
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })

})

describe("PUT /api/position/changeID", function () {
    it('Modify the positionID of a position, given its old positionID: 123412341234', function (done) {
        agent.put("/api/position/800234543412/changeID")
            .send({ newPositionID: '123412341234' })
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
    })
    it('Modify the positionID of a position, given its old positionID: 123412341234', function (done) {
        agent.put("/api/position/ededwdwwss/changeID")
            .send({ newPositionID: '123412341234' })
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
    })
});

describe("DELETE /api/position", function () {
    it('Delete a position receiving its positionID: 123412341234', function (done) {
        agent.delete("/api/position/123412341234")
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
    })
    it('Delete a position receiving a position not found', function (done) {
        agent.delete("/api/position/sadaddasad")
            .then(function (res) {
                res.should.have.status(422);
                done();
            })
    })


})

