const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();


const app = require("../server.js");
var agent = chai.request.agent(app);


describe("POST /api/skuitems/testResult", function(){
    it('should add new test result', function(done){
        agent.get("/api/testDescriptors")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            testdescriptorid=res.body[0].id;
            agent.post("/api/skuitems/testResult")
            .send({rfid:"11111111111111111111111111111111", idTestDescriptor:testdescriptorid, Date:"2022/11/28", Result:true})
            .then(function(res){
                res.should.have.status(201);
                done();
            })
        })
    })
})

describe("GET /api/skuitems/:rfid/testResults", function(){
    it('should get all test results for rfid', function(done){
        agent.get("/api/skuitems/11111111111111111111111111111111/testResults")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            done()
        })
    })
})

describe("GET /api/skuitems/:rfid/testResults/id", function(){
    it('should get test results id for rfid', function(done){
        agent.get("/api/skuitems/11111111111111111111111111111111/testResults")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            test=res.body[0]
            agent.get("/api/skuitems/11111111111111111111111111111111/testResults/"+test.id)
            .then(function(res){
                res.should.have.status(200);
                res.body.idTestDescriptor.should.equal(test.idTestDescriptor);
                res.body.Date.should.equal(test.Date);
                res.body.Result.should.equal(test.Result);
                done()
            })
        })
    })
})

describe("PUT /api/skuitems/:rfid/testResults/id", function(){
    it('should edit test results id for rfid', function(done){
        agent.get("/api/skuitems/11111111111111111111111111111111/testResults")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            test=res.body[0]
            agent.get("/api/testDescriptors")
            .then(function(res){
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                testdescriptorid=res.body[0].id;
                agent.put("/api/skuitems/11111111111111111111111111111111/testResult/"+test.id)
                .send({newIdTestDescriptor:testdescriptorid, newDate: "2018/11/13", newResult:false})
                .then(function(res){
                    res.should.have.status(200);
                    agent.get("/api/skuitems/11111111111111111111111111111111/testResults/"+test.id)
                    .then(function(res){
                        res.body.idTestDescriptor.should.equal(testdescriptorid);
                        res.body.Date.should.equal("2018/11/13");
                        res.body.Result.should.equal(false);
                        done()
                    })
                })
            })
        })
    })
})

describe("DELETE /api/skuitems/:rfid/testResults/id", function(){
    it('should delete test results id for rfid', function(done){
        agent.get("/api/skuitems/11111111111111111111111111111111/testResults")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            test=res.body[0]
            agent.delete("/api/skuitems/11111111111111111111111111111111/testResult/"+test.id)
            .then(function(res){
                res.should.have.status(204);
                agent.get("/api/skuitems/11111111111111111111111111111111/testResults/"+test.id)
                .then(function(res){
                    res.should.have.status(404);
                    done()
                })
            })
        })
    })
})