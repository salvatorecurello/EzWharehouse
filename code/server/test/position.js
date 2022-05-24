const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require("../server.js");
var agent = chai.request.agent(app);


describe("POST /api/position", function(){
    it('Creates a new Position', function(done){
        agent.post("/api/position")
        .send({positionID: '123412341234', col: '1234', row: '1234', maxWeight: 20, maxVolume: 20, aisleID: '1234'})
        .then(function(res){
            res.should.have.status(201);
            done();
        })
        
    })
});

describe("GET /api/positions", function(){
    it('Return an array containing all positions', function(done){
        agent.get("/api/positions")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.be.at.least(1);
            done();
        })
    })
});

describe("PUT /api/position", function(){
    it('Modify a position identified by positionID: 123412341234', function(done){
        agent.put("/api/position/123412341234")
        .send({newAisleID: '8002', newRow: '3454', newCol: '3412', newMaxWeight: 1200, newMaxVolume: 600,newOccupiedWeight: 200, newOccupiedVolume: 100})
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
                // }
                done();
            })
        })
    })
// })

describe("PUT /api/position/changeID", function(){
    it('Modify the positionID of a position, given its old positionID: 123412341234', function(done){
        agent.put("/api/position/800234543412/changeID")
        .send({newPositionID: '123412341234'})
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

describe("DELETE /api/position", function(){
    it('Delete a position receiving its positionID: 123412341234', function(done){
        agent.delete("/api/position/123412341234")
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

