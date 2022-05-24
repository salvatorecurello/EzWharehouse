const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();
const TestDescriptorDaoImport = require('../classes/TestDescriptor/TestDescriptorDAO.js');
const TestDescriptorDao = new TestDescriptorDaoImport();
const SKUDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SKUDaoImport();

const app = require("../server.js");
var agent = chai.request.agent(app);

let testdescriptors = []
let skus = []
before('setting up for testing testdescriptors', async function () {
    skus.push(await SKUDao.storeSKU({ description: "testSKUchai", weight: 100, volume: 100, notes: "notes sku1", price: 10.0, availableQuantity: 0 }))
    testdescriptors.push(await TestDescriptorDao.storeTestDescriptor({ name: "testmochatestdescriptor2", procedureDescription: "descriptionfortest", idSKU: skus[0] }))
    testdescriptors.push(await TestDescriptorDao.storeTestDescriptor({ name: "testmochatestdescriptor3", procedureDescription: "descriptionfortest", idSKU: skus[0] }))
})


describe("POST /api/testDescriptor", function () {
    it('should add new test descriptor', function (done) {
        agent.get("/api/skus")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                skuid = res.body[0].id;
                agent.post("/api/testDescriptor")
                    .send({ name: "testmochatestdescriptor", procedureDescription: "descriptionfortest", idSKU: skuid })
                    .then(function (res) {
                        res.should.have.status(201);
                        done();
                    })
            })

    })
})


describe("GET /api/testDescriptors", function () {
    it('should get all test descriptors', function (done) {
        agent.get("/api/testDescriptors")
            .then(function (res) {
                res.should.have.status(200);
                names = []
                res.body.map((x) => { names.push(x.name) })
                names.should.contain("testmochatestdescriptor");
                done();
            })

    })
})

describe("GET /api/testDescriptors/:id", function () {
    it('should get the test descriptor with id', function (done) {
        id = testdescriptors[0]
        agent.get("/api/testDescriptors/" + id)
            .then(function (res) {
                res.should.have.status(200);
                res.body.name.should.equal("testmochatestdescriptor2");
                res.body.procedureDescription.should.equal("descriptionfortest");
                done();
            })

    })
})

describe("PUT /api/testDescriptors/:id", function () {
    it('should edit the test descriptor with id', function (done) {
        id = testdescriptors[0]
        agent.get("/api/testDescriptors/" + id)
            .then(function (res) {
                res.should.have.status(200);
                t = res.body
                agent.put("/api/testDescriptor/" + t.id)
                    .send({ newName: "testmochatestdescriptoredit", newProcedureDescription: "descriptionfortestedit", newIdSKU: t.idSKU })
                    .then(function (res) {
                        res.should.have.status(200);
                        
                        agent.get("/api/testDescriptors/" + t.id)
                            .then(function (res) {
                                res.should.have.status(200);
                                res.body.name.should.equal("testmochatestdescriptoredit");
                                res.body.procedureDescription.should.equal("descriptionfortestedit");
                                done();
                            })

                    })

            })

    })
})

describe("DELETE /api/testDescriptors/:id", function () {
    it('should delete the test descriptor with id', function (done) {
        id = testdescriptors[1]
        agent.get("/api/testDescriptors/" + t.id)
            .then(function (res) {
                res.should.have.status(200);
                t = res.body
                agent.delete("/api/testDescriptor/" + t.id)
                    .then(function (res) {
                        res.should.have.status(204);
                        agent.get("/api/testDescriptors/" + t.id)
                            .then(function (res) {
                                res.should.have.status(404);
                                done();
                            })

                    })

            })

    })
})

after("cleaning testdescriptor db", async function () {
    for (testdescriptor of testdescriptors) {
        await TestDescriptorDao.deleteTestDescriptor(testdescriptor);
    }
    for (sku of skus) {
        await SKUDao.deleteSKU(sku);
    }
})