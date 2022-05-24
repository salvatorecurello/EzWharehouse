const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require("../server.js");
var agent = chai.request.agent(app);

describe("POST /api/item", function(){
    it('Creates a new Item', function(done){
        agent.post("/api/item")
        .send({id: 1234, description: 'newDescription', price: 3, SKUId: 1, supplierId: 5})
        .then(function(res){
            res.should.have.status(201);
            done();
        })
        
    })
});

describe("GET /api/items", function(){
    it('Return an array containing all Items', function(done){
        agent.get("/api/items")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            done();
        })
    })
});

describe("GET /api/items", function(){
    it('Return an item, given its id', function(done){
        agent.get("/api/items/1234")
        .then(function(res){
            res.should.have.status(200);
            done();
        })
    })
});

describe("PUT /api/item", function(){
    it('Modify an existing item', function(done){
        agent.put("/api/item/1234")
        .send({newDescription: 'a new sku', newPrice: 10.99})
        .then(function(res){
            res.should.have.status(200);
            // agent.get("/api/users")
            // .then(function(res){
            //     res.should.have.status(200);
            //     emails=[]
            //     res.body.map((x)=>{emails.push(x.email)})
            //     emails.should.contain("lucaardito@ezwh.it")
            //     for(let user of res.body){
            //         if(user.email==="lucaardito@ezwh.it"){
            //             user.type.should.equal("supplier");
            //         }
            //     }
                done();
            })
        })
    })
// })

describe("DELETE /api/items", function(){
    it('Delete an item receiving its id: 1234', function(done){
        agent.delete("/api/items/1234")
        .then(function(res){
            res.should.have.status(204);
            // agent.get("/api/users")
            // .then(function(res){
            //     res.should.have.status(200);
            //     for(let user of res.body){
            //         if(user.email=="lucaardito@ezwh.it"){
            //             user.type.should.not.equal("supplier");
            //         }
                // }
                done();
            })
        })
    })
// })