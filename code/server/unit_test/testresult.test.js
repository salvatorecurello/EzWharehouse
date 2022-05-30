const TestResultDaoImport = require('../classes/TestResult/TestResultDAO.js');
const TestResultDao = new TestResultDaoImport();
const TestDescriptorDaoImport = require('../classes/TestDescriptor/TestDescriptorDAO.js');
const TestDescriptorDao = new TestDescriptorDaoImport();
const SKUDaoImport = require('../classes/SKU/SKUDAO.js');
const SKUDao = new SKUDaoImport();
const SKUItemDaoImport = require('../classes/SKUItem/SKUItemDAO.js');
const SKUItemDao = new SKUItemDaoImport();
const mainDB = require("../db.js");
const db =new  mainDB();
describe('test test result', () => {
    beforeAll(async () => {
        await Promise.all(db.deleteAll());
        skuid=await SKUDao.storeSKU({description: "testSKUTestDescriptor", weight: 100, volume: 100, notes: "notes sku2", price: 10.0, availableQuantity:0});
        skuitemid=await SKUItemDao.storeSKUItem({RFID:"12345678901234567890123456789014", SKUId:skuid, DateOfStock:"2021/11/29 12:30"});
        await TestDescriptorDao.storeTestDescriptor({name: "testresulttest", procedureDescription: "description for test", idSKU: skuid});
    });
    testNewTestResult("12345678901234567890123456789014", "testresulttest", "2021/11/29", true);
    testgetTestResultBySKUITEMID("12345678901234567890123456789014");
    testgetTestResultBySKUITEMIDAndID("12345678901234567890123456789014", 'testresulttest', "2021/11/29", true);
    testupdateTestResult("2021/11/29", true, "2021/12/01", false, "12345678901234567890123456789014", 'testresulttest');
    testdeleteTestResult("12345678901234567890123456789014", 'testresulttest', "2021/12/01", false);
});

function testNewTestResult(rfid, testDescriptorName, Date, Result) {
    test('test new test result', async () => {
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var found=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===testDescriptorName){
                found=_testdescriptor;
            }
        }
        expect(found).not.toBeUndefined();
        const testresultid=await TestResultDao.storeTestResult({rfid: rfid, idTestDescriptor: found.id, Date: Date, Result: Result});

        var res = await TestResultDao.getTestResultBySKUITEMIDAndID(rfid, testresultid);
        expect(res).not.toBeNull();
        res=res.toJson();

        expect(res.idTestDescriptor).toStrictEqual(found.id);
        expect(res.Date).toStrictEqual(Date);
        expect(res.Result).toStrictEqual(Result);
    });
}

function testgetTestResultBySKUITEMID(rfid) {
    test('test get test result by skuitemid', async () => {
        
        var res = await TestResultDao.getTestResultBySKUITEMID(rfid);
        expect(res).not.toBeNull();
    });
}

function testgetTestResultBySKUITEMIDAndID(rfid, idTestDescriptor, Date, result) {
    test('test get test result by skuitemid and id', async () => {
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var testdescriptorfound=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===idTestDescriptor){
                testdescriptorfound=_testdescriptor;
            }
        }
        expect(testdescriptorfound).not.toBeUndefined();
        var res = await TestResultDao.getTestResultBySKUITEMID(rfid);
        found=undefined;
        for(_testresult of res){
            const parsed=_testresult.toJson();
            if(parsed.idTestDescriptor===testdescriptorfound.id && parsed.Date===Date && parsed.Result===result){
                found=parsed
            }
        }
        expect(found).not.toBeUndefined();
        
        var res = await TestResultDao.getTestResultBySKUITEMIDAndID(rfid, found.id);
        expect(res).not.toBeNull();
        res=res.toJson();
        expect(res.idTestDescriptor).toStrictEqual(testdescriptorfound.id);
        expect(res.Date).toStrictEqual(Date);
        expect(res.Result).toStrictEqual(result);
    });
}

function testupdateTestResult(oldDate, oldResult, newDate, newResult, rfid, idTestDescriptor) {
    test('test update test result', async () => {
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var testdescriptorfound=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===idTestDescriptor){
                testdescriptorfound=_testdescriptor;
            }
        }
        expect(testdescriptorfound).not.toBeUndefined();
        var res = await TestResultDao.getTestResultBySKUITEMID(rfid);
        found=undefined;
        for(_testresult of res){
            const parsed=_testresult.toJson();
            if(parsed.idTestDescriptor===testdescriptorfound.id && parsed.Date===oldDate && parsed.Result===oldResult){
                found=parsed
            }
        }
        expect(found).not.toBeUndefined();

        await TestResultDao.updateTestResult({newIdTestDescriptor:testdescriptorfound.id, newDate:newDate, newResult:newResult}, found.id, rfid)
        var res = await TestResultDao.getTestResultBySKUITEMIDAndID(rfid, found.id);
        expect(res).not.toBeNull();
        res=res.toJson();
        expect(res.idTestDescriptor).toStrictEqual(testdescriptorfound.id);
        expect(res.Date).toStrictEqual(newDate);
        expect(res.Result).toStrictEqual(newResult);
    });
}

function testdeleteTestResult(rfid, idTestDescriptor, Date, result) {
    test('test delete test result', async () => {
        var res = await TestDescriptorDao.getTestDescriptors();
        expect(res.length).toBeGreaterThanOrEqual(1);
        var testdescriptorfound=undefined;
        for(const _testdescriptor of res){
            if(_testdescriptor.name===idTestDescriptor){
                testdescriptorfound=_testdescriptor;
            }
        }
        expect(testdescriptorfound).not.toBeUndefined();
        var res = await TestResultDao.getTestResultBySKUITEMID(rfid);
        found=undefined;
        for(_testresult of res){
            const parsed=_testresult.toJson();
            if(parsed.idTestDescriptor===testdescriptorfound.id && parsed.Date===Date && parsed.Result===result){
                found=parsed
            }
        }
        expect(found).not.toBeUndefined();
        await TestResultDao.deleteTestResult(found.id, rfid);
        var res = await TestResultDao.getTestResultBySKUITEMIDAndID(rfid, found.id);
        expect(res).toBeNull();
    });
}
