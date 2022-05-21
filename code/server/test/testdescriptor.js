const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.should();


const app = require("../server.js");
var agent = chai.request.agent(app);


describe("POST /api/testDescriptor", function(){
    it('should add new test descriptor', function(done){
        agent.get("/api/skus")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            skuid=res.body[0].id;
            agent.post("/api/testDescriptor")
            .send({name:"testmochatestdescriptor", procedureDescription:"descriptionfortest", idSKU:skuid})
            .then(function(res){
                res.should.have.status(201);
                done();
            })
        })
        
    })
})


describe("GET /api/testDescriptors", function(){
    it('should get all test descriptors', function(done){
        agent.get("/api/testDescriptors")
        .then(function(res){
            res.should.have.status(200);
            names=[]
            res.body.map((x)=>{names.push(x.name)})
            names.should.contain("testmochatestdescriptor");
            done();
        })
        
    })
})

describe("GET /api/testDescriptors/:id", function(){
    it('should get the test descriptor with id', function(done){
        agent.get("/api/testDescriptors")
        .then(function(res){
            res.should.have.status(200);
            names=[]
            res.body.map((x)=>{names.push(x.name)})
            names.should.contain("testmochatestdescriptor");
            id=0;
            for(test of res.body){
                if(test.name=="testmochatestdescriptor"){
                    id=test.id;
                }
            }
            agent.get("/api/testDescriptors/"+id)
            .then(function(res){
                res.should.have.status(200);
                res.body.name.should.equal("testmochatestdescriptor");
                res.body.procedureDescription.should.equal("descriptionfortest");
                done();
            })
            
        })
        
    })
})

describe("PUT /api/testDescriptors/:id", function(){
    it('should edit the test descriptor with id', function(done){
        agent.get("/api/testDescriptors")
        .then(function(res){
            res.should.have.status(200);
            names=[]
            res.body.map((x)=>{names.push(x.name)})
            names.should.contain("testmochatestdescriptor");
            t=undefined;
            for(test of res.body){
                if(test.name=="testmochatestdescriptor"){
                    t=test;
                }
            }
            agent.put("/api/testDescriptor/"+t.id)
            .send({newName:"testmochatestdescriptoredit", newProcedureDescription:"descriptionfortestedit", newIdSKU:t.idSKU})
            .then(function(res){
                res.should.have.status(200);
                agent.get("/api/testDescriptors/"+t.id)
                .then(function(res){
                    res.should.have.status(200);
                    res.body.name.should.equal("testmochatestdescriptoredit");
                    res.body.procedureDescription.should.equal("descriptionfortestedit");
                    done();
                })
                
            })
            
        })
        
    })
})

describe("DELETE /api/testDescriptors/:id", function(){
    it('should delete the test descriptor with id', function(done){
        agent.get("/api/testDescriptors")
        .then(function(res){
            res.should.have.status(200);
            names=[]
            res.body.map((x)=>{names.push(x.name)})
            names.should.contain("testmochatestdescriptoredit");
            t=undefined;
            for(test of res.body){
                if(test.name=="testmochatestdescriptoredit"){
                    t=test;
                }
            }
            agent.delete("/api/testDescriptor/"+t.id)
            .then(function(res){
                res.should.have.status(204);
                agent.get("/api/testDescriptors/"+t.id)
                .then(function(res){
                    res.should.have.status(404);
                    done();
                })
                
            })
            
        })
        
    })
})