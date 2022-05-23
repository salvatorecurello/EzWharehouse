const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();


const app = require("../server.js");
var agent = chai.request.agent(app);

describe("POST /api/sku", function(){
    it('should add new sku', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            agent.post("/api/sku")
            .send({description: "testmochasku", weight: 20, volume: 10, notes: "note test", price: 10, availableQuantity: 50})
            .then(function(res){
                res.should.have.status(201);
                done();
            })
        })
    })
})

describe("GET /api/skus", function(){
    it('should get all skus', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            descriptions=[]
            res.body.map((x)=>{descriptions.push(x.description)})
            description.should.contain("testmochasku");
            done();
        })
        
    })
})

describe("GET /api/skus/:id", function(){
    it('should get the sku with id', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            descriptions=[]
            res.body.map((x)=>{descriptions.push(x.description)})
            descriptions.should.contain("testmochasku");
            id=0;
            for(test of res.body){
                if(test.description=="testmochasku"){
                    id=test.id;
                }
            }
            agent.get("/api/skus/"+id)
            .then(function(res){
                res.should.have.status(200);
                res.body.description.should.equal("testmochasku");
                res.body.weight.should.equal(20);
                res.body.volume.should.equal(10);
                res.body.notes.should.equal("note test");
                res.body.price.should.equal(10);
                res.body.availableQuantity.should.equal(50);
                done();
            })
            
        })
        
    })
})

describe("PUT /api/sku/:id", function(){
    it('should edit the sku with id', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            descriptions=[]
            res.body.map((x)=>{descriptions.push(x.description)})
            descriptions.should.contain("testmochasku");
            t=undefined;
            for(test of res.body){
                if(test.description=="testmochasku"){
                    t=test;
                }
            }
            agent.put("/api/sku/"+t.id)
            .send({newDescription:"testmochaskuedit", newWeight:100, newVolume: 50, newNotes: "note test edit", newPrice: 20, newAvailableQuantity: 40})
            .then(function(res){
                res.should.have.status(200);
                agent.get("/api/sku/"+t.id)
                .then(function(res){
                    res.should.have.status(200);
                    res.body.description.should.equal("testmochaskuedit");
                    res.body.weight.should.equal(100);
                    res.body.volume.should.equal(50);
                    res.body.notes.should.equal("note test edit");
                    res.body.price.should.equal(20);
                    res.body.availableQuantity.should.equal(40);
                    done();
                })
                
            })
            
        })
        
    })
})

// fare api put position

describe("DELETE /api/skus/:id", function(){
    it('should delete the sku with id', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            descriptions=[]
            res.body.map((x)=>{descriptions.push(x.description)})
            descriptions.should.contain("testmochaskuedit");
            t=undefined;
            for(test of res.body){
                if(test.description=="testmochaskuedit"){
                    t=test;
                }
            }
            agent.delete("/api/skus/"+t.id)
            .then(function(res){
                res.should.have.status(204);
                agent.get("/api/sku/"+t.id)
                .then(function(res){
                    res.should.have.status(404);
                    done();
                })
                
            })
            
        })
        
    })
})
