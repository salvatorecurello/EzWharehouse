const TestDescriptorDaoImport = require('../classes/TestDescriptor/TestDescriptorDAO.js');
const TestDescriptorDao = new TestDescriptorDaoImport();
const SKUDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SKUDaoImport();
const mainDB = require("../db.js");
const db = new mainDB();
describe('test testdescriptor', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        id = await SKUDao.storeSKU({description: "testSKUtestdescriptor", weight: 100, volume: 100, notes: "notes sku1", price: 10.0, availableQuantity:0});
        await TestDescriptorDao.storeTestDescriptor({name: "testDeleteTestDescriptor", procedureDescription: "aaaaaa", idSKU: id});
        await TestDescriptorDao.storeTestDescriptor({name: "testUpdateTestDescriptor", procedureDescription: "aaaaaa", idSKU: id});
    });

    teststoreTestDescriptor("testDescriptor1", "procedureDescription1");
    testgetTestDescriptors();
    testgetTestDescriptorsByID("testDescriptor1");
    testupdateTestDescriptor("testUpdateTestDescriptorUpdated", "testUpdateDescription", "testUpdateTestDescriptor");
    testdeleteTestDescriptor("testDeleteTestDescriptor");
});

function teststoreTestDescriptor(name, procedureDescription) {
    test('test store test descriptor', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKUtestdescriptor"){
                sku= _sku;
            }
        }
        expect(sku).not.toBeUndefined();
        await TestDescriptorDao.storeTestDescriptor({name: name, procedureDescription: procedureDescription, idSKU: sku.id});
        
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===name && _testdescriptor.procedureDescription===procedureDescription && _testdescriptor.idSKU===sku.id){
                found=_testdescriptor;
            }
        }
        expect(found).not.toBeUndefined();
    });
}

function testgetTestDescriptors() {
    test('get test descriptors', async () => {
        
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
    });
}

function testgetTestDescriptorsByID(name) {
    test('get test descriptors by id', async () => {
        
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===name){
                found=_testdescriptor;
            }
        }
        expect(found).not.toBeUndefined();
        var res2 = await TestDescriptorDao.getTestDescriptorsByID(found.id);
        expect(found.name).toStrictEqual(res2.name);
        expect(found.procedureDescription).toStrictEqual(res2.procedureDescription);
        expect(found.idSKU).toStrictEqual(res2.idSKU);
    });
}

function testupdateTestDescriptor(newName, newProcedureDescription, oldName) {
    test('update test descriptor', async () => {
        const tmp = await SKUDao.getSkus();
        expect(tmp.length).toBeGreaterThanOrEqual(1);
        let sku=undefined;
        for(const _sku of tmp){
            if(_sku.description==="testSKUtestdescriptor"){
                sku= _sku;
            }
        }
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===oldName){
                found=_testdescriptor;
            }
        }
        expect(found).not.toBeUndefined();
        await TestDescriptorDao.updateTestDescriptor({newName:newName, newProcedureDescription:newProcedureDescription, newIdSKU:sku.id}, found.id)
        var res2 = await TestDescriptorDao.getTestDescriptorsByID(found.id);
        expect(res2.name).toStrictEqual(newName);
        expect(res2.procedureDescription).toStrictEqual(newProcedureDescription);
        expect(res2.idSKU).toStrictEqual(sku.id);
    });
}

function testdeleteTestDescriptor(name) {
    test('delete test descriptor', async () => {
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===name){
                found=_testdescriptor;
            }
        }
        await TestDescriptorDao.deleteTestDescriptor(found.id);
        var res = await TestDescriptorDao.getTestDescriptorsByID(found.id);
        expect(res).toBeNull();
    });
}

