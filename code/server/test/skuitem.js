const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();

const SKUDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SKUDaoImport();
const SkuItemDaoImport = require('../classes/SKUItem/SKUItemDAO.js');
const SKUItemDao = new SkuItemDaoImport();

const app = require("../server.js");
var agent = chai.request.agent(app);

let skus = []
let skuitems = []
before('setting up for testing skuitems', async function () {
    skuid3 = await SKUDao.storeSKU({ description: "testSKUchaiForSKUItem", weight: 7, volume: 5, notes: "notes sku1", price: 10, availableQuantity: 5 })

    skuitems.push(await SKUItemDao.storeSKUItem({ RFID: "12345678901234567890123456781212", SKUId: skuid3, DateOfStock: "2021/11/11 12:30" }));

    // for put skuitem
    skuitems.push(await SKUItemDao.storeSKUItem({ RFID: "12345678901234567890123456781414", SKUId: skuid3, DateOfStock: "2021/07/11 12:30" }));

    // for delete skuitem
    skuitems.push(await SKUItemDao.storeSKUItem({ RFID: "12345678901234567890123456781616", SKUId: skuid3, DateOfStock: "2021/07/09 12:30" }));
    await SKUItemDao.updateSKUItem({newRFID:"12345678901234567890123456781212", newAvailable:1, newDateOfStock: "2021/11/11 12:30"}, "12345678901234567890123456781212")
    await SKUItemDao.updateSKUItem({newRFID:"12345678901234567890123456781414", newAvailable:1, newDateOfStock: "2021/11/11 12:30"}, "12345678901234567890123456781414")
    await SKUItemDao.updateSKUItem({newRFID:"12345678901234567890123456781616", newAvailable:1, newDateOfStock: "2021/11/11 12:30"}, "12345678901234567890123456781616")
    
    skus.push(skuid3);
})

describe("POST /api/skuitem", function () {
    it('should add new skuitem', function (done) {
        agent.get("/api/skus")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                skuid = res.body[0].id;
                agent.post("/api/skuitem")
                    .send({ RFID: "12345678901234567890123456781313", SKUId: skuid, DataOfStock: "2021/11/29 12:40" })
                    .then(function (res) {
                        res.should.have.status(201);
                        done();
                    })
            })

    })
})

describe("GET /api/skuitems", function () {
    it('should get all skuitems', function (done) {
        agent.get("/api/skuitems")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done();
            })

    })
})

describe("GET /api/skuitems/:rfid", function () {
    it('should get the skuitem with rfid', function (done) {
        id = skus[0]
        agent.get("/api/skuitems/12345678901234567890123456781212")
            .then(function (res) {
                res.should.have.status(200);
                res.body.RFID.should.equal("12345678901234567890123456781212");
                res.body.SKUId.should.equal(id);
                res.body.DateOfStock.should.equal("2021/11/11 12:30");
                done();
            })
    })
})


describe("GET /api/skuitems/sku/:id", function () {
    it('should get the skuitems of sku with id', function (done) {
        id = skus[0]
        agent.get("/api/skuitems/sku/" + id)
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done();
            })

    })
})

describe("PUT /api/skuitems/:rfid", function () {
    it('should edit the skuitem with rfid', function (done) {
        agent.put("/api/skuitems/12345678901234567890123456781414")
            .send({ newRFID: "12345678901234567890123456781515", newAvailable: 1, newDateOfStock: "2021/12/29 13:40" })
            .then(function (res) {
                res.should.have.status(200);
                agent.get("/api/skuitems/12345678901234567890123456781515")
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.RFID.should.equal("12345678901234567890123456781515");
                        res.body.available.should.equal(1);
                        res.body.DateOfStock.should.equal("2021/12/29 13:40");
                        done();
                    })
            })

    })
})

describe("DELETE /api/skuitems/:rfid", function () {
    it('should delete the skuitem with rfid', function (done) {
        agent.delete("/api/skuitems/12345678901234567890123456781616")
            .then(function (res) {
                res.should.have.status(204);
                agent.get("/api/skuitems/12345678901234567890123456781616")
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

    for (i of skuitems) {
        await SKUItemDao.deleteSKUItem(i);
    }
})