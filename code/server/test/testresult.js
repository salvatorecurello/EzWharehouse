const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();


const app = require("../server.js");
var agent = chai.request.agent(app);
const TestResultDaoImport = require('../classes/TestResult/TestResultDAO.js');
const TestResultDao = new TestResultDaoImport();
const TestDescriptorDaoImport = require('../classes/TestDescriptor/TestDescriptorDAO.js');
const TestDescriptorDao = new TestDescriptorDaoImport();
const SKUDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SKUDaoImport();
const SKUItemDaoImport = require('../classes/SKUItem/SKUItemDAO.js');
const SKUItemDao = new SKUItemDaoImport();

let testresults = []
let testdescriptors = []
let skus = []
let skuitems = []
before('setting up for testing testresult', async function () {
    skus.push(await SKUDao.storeSKU({ description: "testSKUtestresult", weight: 100, volume: 100, notes: "notes sku1", price: 10.0, availableQuantity: 0 }))
    testdescriptors.push(await TestDescriptorDao.storeTestDescriptor({ name: "testmochatestdescriptorfortestresult", procedureDescription: "descriptionfortestresult", idSKU: skus[0] }))
    skuitems.push(await SKUItemDao.storeSKUItem({ RFID: "12345678901234567890123456789099", SKUId: skus[0], DateOfStock: "2021/11/29 12:30" }))
    skuitems.push(await SKUItemDao.storeSKUItem({ RFID: "12345678901234567890123456789098", SKUId: skus[0], DateOfStock: "2021/11/29 12:30" }))
    skuitems.push(await SKUItemDao.storeSKUItem({ RFID: "12345678901234567890123456789097", SKUId: skus[0], DateOfStock: "2021/11/29 12:30" }))
    testresults.push(await TestResultDao.storeTestResult({ rfid: "12345678901234567890123456789099", idTestDescriptor: testdescriptors[0], Date: "2021/11/29 12:30", Result: true }))
})

describe("POST /api/skuitems/testResult", function () {
    it('should add new positive test result', function (done) {
        skuid = skus[0]
        testdescriptorid = testdescriptors[0]
        agent.post("/api/skuitems/testResult")
            .send({ rfid: "12345678901234567890123456789098", idTestDescriptor: testdescriptorid, Date: "2022/11/28", Result: true })
            .then(function (res) {
                res.should.have.status(201);
                done();
            })

    })
    it('should add new negative test result', function (done) {
        skuid = skus[0]
        testdescriptorid = testdescriptors[0]
        agent.post("/api/skuitems/testResult")
            .send({ rfid: "12345678901234567890123456789097", idTestDescriptor: testdescriptorid, Date: "2022/11/28", Result: false })
            .then(function (res) {
                res.should.have.status(201);
                done();
            })

    })
})

describe("GET /api/skuitems/:rfid/testResults", function () {
    it('should get all test results for rfid', function (done) {
        agent.get("/api/skuitems/12345678901234567890123456789099/testResults")
            .then(function (res) {
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                done()
            })
    })
})


describe("GET /api/skuitems/:rfid/testResults/:id", function () {
    it('should get test results id for rfid', function (done) {
        testresult = testresults[0];
        agent.get("/api/skuitems/12345678901234567890123456789099/testResults/" + testresult)
            .then(function (res) {
                res.should.have.status(200);
                res.body.idTestDescriptor.should.equal(testdescriptors[0]);
                res.body.Date.should.equal("2021/11/29");
                res.body.Result.should.equal(true);
                done()
            })
    })
})


describe("PUT /api/skuitems/:rfid/testResults/:id", function () {
    it('should edit test results id for rfid', function (done) {
        testresult = testresults[0];
        agent.put("/api/skuitems/12345678901234567890123456789099/testResult/" + testresult)
            .send({ newIdTestDescriptor: testdescriptorid = testdescriptors[0], newDate: "2018/11/13", newResult: false })
            .then(function (res) {
                res.should.have.status(200);
                
                agent.get("/api/skuitems/12345678901234567890123456789099/testResults/" + testresult)
                    .then(function (res) {
                        res.should.have.status(200);
                        
                        res.body.idTestDescriptor.should.equal(testdescriptorid = testdescriptors[0]);
                        res.body.Date.should.equal("2018/11/13");
                        res.body.Result.should.equal(false);
                        done()
                    })
            })
    })
})


describe("DELETE /api/skuitems/:rfid/testResults/:id", function () {
    it('should delete test results id for rfid', function (done) {
        testresult = testresults[0];
        agent.delete("/api/skuitems/12345678901234567890123456789099/testResult/" + testresult)
            .then(function (res) {
                res.should.have.status(204);
                agent.get("/api/skuitems/12345678901234567890123456789099/testResults/" + testresult)
                    .then(function (res) {
                        res.should.have.status(404);
                        done()
                    })
            })
    })
})



after('cleaning testresult db', async function () {
    for (testresult of testresults) {
        await TestResultDao.deleteTestResult(testresult);
    }
    for (testdescriptor of testdescriptors) {
        await TestDescriptorDao.deleteTestDescriptor(testdescriptor);
    }
    for (sku of skus) {
        await SKUDao.deleteSKU(sku);
    }

        await SKUItemDao.deleteSKUItem("12345678901234567890123456789099");

})