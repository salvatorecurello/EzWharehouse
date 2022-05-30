const userDaoImport = require('../classes/User/UserDAO.js');
const userDao = new userDaoImport();

const mainDB = require("../db.js");
const db =new  mainDB();



describe('testUser', () => {
    var id;
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        await Promise.all(db.createDefaultUsers());
        await userDao.storeUser({username: "prova", name: "luca", surname: "ardito2", type: "qualityEmployee", password: "password"});
    });
    
    testNewUser('luca', 'Luca', 'Ardito', 'customer', 'testpassword');
    getUsers();
    getSuppliers();
    login('luca', 'testpassword', 'customer');
    getUserFromId("prova", "qualityEmployee");
    getUserFromEmail("prova", "qualityEmployee");
    updateUser("deliveryEmployee");
    deleteUser(); 
});

function testNewUser(username, name, surname, role, password) {
    test('create new user', async () => {
        
        await userDao.storeUser({username: username, name: name, surname: surname, type: role, password: password});
        
        var res = await userDao.getUsers();
        expect(res.length).toBeGreaterThanOrEqual(1);
        
        res = await userDao.getUserFromEmail(username, role);

        expect(res.email).toStrictEqual(username);
        expect(res.name).toStrictEqual(name);
        expect(res.surname).toStrictEqual(surname);
        expect(res.type).toStrictEqual(role);
    });
}

function getUsers() {
    test('get users', async () => {
        
        var res = await userDao.getUsers();
        for(let user of res){
            expect(user.type).not.toStrictEqual("Manager")
        }
    });
}

function getSuppliers() {
    test('get suppliers', async () => {
        
        var res = await userDao.getSuppliers();
        for(let user of res){
            expect(user.type).toStrictEqual("supplier")
        }
    });
}

function login(username, password, type) {
    test('login', async () => {
        var res = await userDao.login(username, password, type);
        expect(res).not.toBeNull();
        expect(res.email).toStrictEqual(username);
        expect(res.type).toStrictEqual(type);

    });

    test('login failed', async () => {
        var res = await userDao.login("", password, type);
        expect(res).toBeNull();

    });
}

function getUserFromId(username, type) {
    test('get user from id', async () => {
        var res = await userDao.getUserFromEmail(username, type);
        res = await userDao.getUserFromId(res.id);
        expect(res).not.toBeNull();
        expect(res.id).toStrictEqual(res.id);
        expect(res.email).toStrictEqual(username);
    });
}


function getUserFromEmail(email, type) {
    test('get user from email', async () => {
        
        var res = await userDao.getUserFromEmail(email, type);
        expect(res).not.toBeNull();
        expect(res.email).toStrictEqual(email);
    });

    test('get user from email failed', async () => {
        
        var res = await userDao.getUserFromEmail("", "");
        expect(res).toBeNull();

    });
}

function updateUser(newType) {
    test('update user', async () => {
        var res = await userDao.getUserFromEmail("prova", "qualityEmployee");
        var id = res.id;
        await userDao.updateUser(id, newType);
        var res = await userDao.getUserFromId(id);
        expect(res).not.toBeNull();
        expect(res.id).toStrictEqual(id);
        expect(res.type).toStrictEqual(newType);
    });
}

function deleteUser() {
    test('delete user', async () => {
        var res = await userDao.getUserFromEmail("prova", "deliveryEmployee");
        var id = res.id;
        await userDao.deleteUser(id);
        var res = await userDao.getUserFromId(id);
        expect(res).toBeNull();
    });
}