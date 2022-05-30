const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();


const app = require("../server.js");
var agent = chai.request.agent(app);
const userDaoImport = require('../classes/User/UserDAO.js');
const userDao = new userDaoImport();


users=[]
before('setting up for testing users', async function(){
    users.push(await userDao.storeUser({username: "luca2ardito2@ezwh.it", name: "luca2", surname: "ardito2", type: "customer", password: "password"}))
    users.push(await userDao.storeUser({username: "luca3ardito3@ezwh.it", name: "luca2", surname: "ardito2", type: "supplier", password: "password"}))
})

describe("POST /api/newUser", function(){
    it('should add new user', function(done){
        agent.post("/api/newUser")
        .send({username:"lucaardito@ezwh.it", name:"luca", surname:"ardito", password:"passwordsegreta", type:"customer"})
        .then(function(res){
            res.should.have.status(201);
            users.push(res.body);
            done();
        })
    })
})

describe("GET /api/users", function(){
    it('should return added user without managers', function(done){
        agent.get("/api/users")
        .then(function(res){
            res.should.have.status(200);
            emails=[]
            res.body.map((x)=>{emails.push(x.email)})
            types=[]
            res.body.map((x)=>{emails.push(x.type)})
            types.should.not.contain("manager")
            emails.should.contain("lucaardito@ezwh.it")
            done();
        })
    })
})

describe("GET /api/suppliers", function(){
    it('should return only suppliers', function(done){
        agent.get("/api/suppliers")
        .then(function(res){
            res.should.have.status(200);
            types=[]
            res.body.map((x)=>{emails.push(x.type)})
            for(type of types){
                type.should.equal("supplier");
            }
            done();
        })
    })
})

describe("GET /api/userinfo", function(){
    it('should return data of logged in user', function(done){
        agent.get("/api/userinfo")
        .then(function(res){
            res.should.have.status(200);
            done();
        })
    })
})

describe("POST /api/logins", function(){
    it('should login manager', function(done){
        agent.post("/api/managerSessions")
        .send({username:"manager1@ezwh.com", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            
            res.body.username.should.equal("manager1@ezwh.com");
            done();
        })
    })

    it('should login customer', function(done){
        agent.post("/api/customerSessions")
        .send({username:"user1@ezwh.com", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("user1@ezwh.com");
            done();
        })
    })

    it('should login supplier', function(done){
        agent.post("/api/supplierSessions")
        .send({username:"supplier1@ezwh.com", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("supplier1@ezwh.com");
            done();
        })
    })

    it('should login clerk', function(done){
        agent.post("/api/clerkSessions")
        .send({username:"clerk1@ezwh.com", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("clerk1@ezwh.com");
            done();
        })
    })

    it('should login quality employee', function(done){
        agent.post("/api/qualityEmployeeSessions")
        .send({username:"qualityEmployee1@ezwh.com", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("qualityEmployee1@ezwh.com");
            done();
        })
    })

    it('should login delivery employee', function(done){
        agent.post("/api/deliveryEmployeeSessions")
        .send({username:"deliveryEmployee1@ezwh.com", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("deliveryEmployee1@ezwh.com");
            done();
        })
    })
})

describe("GET /api/logout", function(){
    it('should logout user', function(done){
        agent.post("/api/logout")
        .then(function(res){
            res.should.have.status(200);
            done();
        })
    })
})

describe("PUT /api/users/:username", function(){
    it('should edit user type', function(done){
        agent.put("/api/users/luca2ardito2@ezwh.it")
        .send({oldType:"customer", newType:"supplier"})
        .then(function(res){
            res.should.have.status(200);
            agent.get("/api/users")
            .then(function(res){
                
                res.should.have.status(200);
                emails=[]
                res.body.map((x)=>{emails.push(x.email)})
                emails.should.contain("luca2ardito2@ezwh.it")
                for(let user of res.body){
                    if(user.email==="luca2ardito2@ezwh.it"){
                        user.type.should.equal("supplier");
                    }
                }
                done();
            })
        })
    })
})

describe("DELETE /api/users/:username/:type", function(){
    it('should delete user', function(done){
        agent.delete("/api/users/luca3ardito3@ezwh.it/supplier")
        .then(function(res){
            res.should.have.status(204);
            agent.get("/api/users")
            .then(function(res){
                res.should.have.status(200);
                for(let user of res.body){
                    if(user.email=="lucaardito@ezwh.it"){
                        user.type.should.not.equal("supplier");
                    }
                }
                done();
            })
        })
    })
})

after("cleaning user db", async function(){
    for (user of users){
        await userDao.deleteUser(user);
    }
})