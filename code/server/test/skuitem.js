const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();


const app = require("../server.js");
var agent = chai.request.agent(app);

describe("POST /api/skuitem", function(){
    it('should add new skuitem', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            skuid=res.body[0].id;
            agent.post("/api/skuitem")
            .send({RFID:"12345678901234567890123456781111", SKUId:skuid, DataOfStock: "2021/11/29 12:40"})
            .then(function(res){
                res.should.have.status(201);
                done();
            })
        })
        
    })
})

// mi sembra sbagliata
describe("GET /api/skuitems", function(){
    it('should get all skuitems', function(done){
        agent.get("/api/skuitems")
        .then(function(res){
            res.should.have.status(200);
            rfids=[]
            res.body.map((x)=>{rfids.push(x.RFID)})
            rfids.should.contain("12345678901234567890123456781111");
            done();
        })
        
    })
})

describe("GET /api/skuitems/:rfid", function(){
    it('should get the skuitem with rfid', function(done){
        agent.get("/api/skuitems")
        .then(function(res){
            res.should.have.status(200);
            rfids=[]
            res.body.map((x)=>{rfids.push(x.RFID)})
            rfids.should.contain("12345678901234567890123456781111");
            id=0;
            for(test of res.body){
                if(test.RFID=="12345678901234567890123456781111"){
                    skuid=test.SKUId;
                }
            }
            agent.get("/api/skus/12345678901234567890123456781111")
            .then(function(res){
            res.should.have.status(200);
            res.body.RFID.should.equal("12345678901234567890123456781111");
            res.body.SKUId.should.equal(skuid);
            res.body.DateOfStock.should.equal("2021/11/29 12:40");
            done();
            })
            
        })
    })
})

// da fare get skuitem/sku/:id

describe("PUT /api/skuitems/:rfid", function(){
    it('should edit the skuitem with rfid', function(done){
        agent.put("/api/skuitems/12345678901234567890123456781111")
        .send({newRFID:"12345678901234567890123456782222", newAvailable: 1, newDateOfStock: "2021/11/29 13:40"})
        .then(function(res){
        res.should.have.status(200);
        agent.get("/api/skuitems/2345678901234567890123456782222")
        .then(function(res){
        res.should.have.status(200);
        res.body.RFID.should.equal("12345678901234567890123456782222");
        res.body.available.should.equal(1);
        res.body.DataOfStock.should.equal("2021/11/29 13:40");
        done();
            })        
        })
            
    })
})

describe("DELETE /api/skuitems/:rfid", function(){
    it('should delete the skuitem with rfid', function(done){
        agent.delete("/api/skuitems/12345678901234567890123456782222")
        .then(function(res){
        res.should.have.status(204);
        agent.get("/api/skuitems/12345678901234567890123456782222")
        .then(function(res){
        res.should.have.status(404);
        done();
            })
        })     
    })
})