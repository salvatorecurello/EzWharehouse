const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();
const SKUDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SKUDaoImport();
const PositionDaoImport = require('../classes/Position/PositionDAO.js');
const PositionDao = new PositionDaoImport();

const app = require("../server.js");
var agent = chai.request.agent(app);

let positions = []
let skus = []
before('setting up for testing skus', async function () {
    skus.push(await SKUDao.storeSKU({ description: "testSKUchaiForGet", weight: 7, volume: 5, notes: "notes sku1", price: 10, availableQuantity: 5 }));
    skus.push(await SKUDao.storeSKU({ description: "testSKUchaiForUpdate", weight: 4, volume: 2, notes: "notes sku2", price: 5, availableQuantity: 2 }));
    skus.push(await SKUDao.storeSKU({ description: "testSKUchaiForAddPosition", weight: 2, volume: 2, notes: "notes sku3", price: 4, availableQuantity: 1 }));
    positions.push(await PositionDao.storePosition({ positionID: '80000row1col1', aisleID: '80000', row: 'row1', col: 'col1', maxWeight: 1000, maxVolume: 1000, occupiedWeight: 0, occupiedVolume: 0 }));
    skus.push(await SKUDao.storeSKU({ description: "testSKUchaiForDelete", weight: 2, volume: 2, notes: "notes sku4", price: 4, availableQuantity: 1 }));
})


describe("POST /api/sku", function () {
    it('should add new sku', function (done) {
        agent.post("/api/sku")
            .send({ description: "testmochasku", weight: 1, volume: 2, notes: "note test", price: 10, availableQuantity: 2 })
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
    })
})

describe("GET /api/skus", function () {
    it('should get all skus', function (done) {
        agent.get("/api/skus")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done();
            })

    })
})

describe("GET /api/skus/:id", function () {
    it('should get the sku with id', function (done) {
        id = skus[0];
        agent.get("/api/skus/" + id)
            .then(function (res) {
                res.should.have.status(200);
                res.body.description.should.equal("testSKUchaiForGet");
                res.body.weight.should.equal(7);
                res.body.volume.should.equal(5);
                res.body.notes.should.equal("notes sku1");
                res.body.price.should.equal(10);
                res.body.availableQuantity.should.equal(5);
                done();
            })

    })

})


describe("PUT /api/sku/:id", function () {
    it('should edit the sku with id', function (done) {
        id = skus[1];
        agent.put("/api/sku/" + id)
            .send({ newDescription: "testSKUchaiForUpdateEdit", newWeight: 50, newVolume: 7, newNotes: "notetestedit", newPrice: 10, newAvailableQuantity: 10 })
            .then(function (res) {
                res.should.have.status(200);
                agent.get("/api/skus/" + id)
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.description.should.equal("testSKUchaiForUpdateEdit");
                        res.body.weight.should.equal(50);
                        res.body.volume.should.equal(7);
                        res.body.notes.should.equal("notetestedit");
                        res.body.price.should.equal(10);
                        res.body.availableQuantity.should.equal(10);
                        done();
                    })

            })

    })

})


describe("PUT /api/sku/:id/position", function () {
    it('should edit position of sku with id', function (done) {
        id = skus[2];
        agent.put("/api/sku/" + id + "/position")
            .send({ position: '80000row1col1' })
            .then(function (res) {
                res.should.have.status(200);
                agent.get("/api/skus/" + id)
                    .then(function (res) {
                        res.body.position.should.equal('80000row1col1');
                        done()
                    })
            })
    })
})


describe("DELETE /api/skus/:id", function () {
    it('should delete the sku with id', function (done) {
        id = skus[3];
        agent.delete("/api/skus/" + id)
            .then(function (res) {
                res.should.have.status(204);
                agent.get("/api/skus/" + id)
                    .then(function (res) {
                        res.should.have.status(404);
                        done();
                    })

            })

    })

})

after("cleaning skus db", async function () {
    for (sku of skus) {
        await SKUDao.deleteSKU(sku);
    }

    for (p of positions) {
        await PositionDao.deletePosition(p);
    }
})
