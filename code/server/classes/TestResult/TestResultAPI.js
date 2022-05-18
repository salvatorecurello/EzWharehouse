const TestResultDAO = require("./TestResultDAO.js");
const TestResult = require("./TestResult.js");
const dayjs = require("dayjs");
const TestResultdao = new TestResultDAO();
module.exports = function (app) {

    app.get('/api/skuitems/:rfid/testResults', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const rfid = req.params.rfid;
        if (rfid!=undefined && rfid.length == 32 && /^\d+$/.test(rfid)) {
            const testresults = await TestResultdao.getTestResultBySKUITEMID(rfid);
            if (testresults.length > 0) {
                const data = testresults.map((r) => (r.toJson()));
                return res.status(200).json(data);
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.get('/api/skuitems/:rfid/testResults/:id', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const rfid = req.params.rfid;
        const id = parseInt(req.params.id);
        if (rfid!=undefined && rfid.length == 32 && /^\d+$/.test(rfid) && id!=undefined) {
            const testresult = await TestResultdao.getTestResultBySKUITEMIDAndID(rfid, id);
            if (testresult != null) {
                return res.status(200).json(testresult.toJson());
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.post('/api/skuitems/testResult', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        if (req.body.rfid!=undefined && req.body.rfid.length == 32 && /^\d+$/.test(req.body.rfid) && req.body.idTestDescriptor!=undefined && req.body.Date!=undefined && dayjs(req.body.Date).isValid() && req.body.Result!=undefined) {
            if (await TestResultdao.isRFIDValid(req.body.rfid) && await TestResultdao.isTestIdValid(req.body.idTestDescriptor)) {
                await TestResultdao.storeTestResult(req.body);
                return res.status(201).end();
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.put('/api/skuitems/:rfid/testResult/:id', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const rfid = req.params.rfid;
        const id = parseInt(req.params.id);
        if (rfid!=undefined && rfid.length == 32 && /^\d+$/.test(rfid) && id!=undefined && req.body.newIdTestDescriptor!=undefined && req.body.newDate!=undefined && dayjs(req.body.Date).isValid() && req.body.newResult!=undefined) {
            const testresult = await TestResultdao.getTestResultBySKUITEMIDAndID(rfid, id);
            if (testresult != null) {
                if (await TestResultdao.isTestIdValid(req.body.newIdTestDescriptor)) {
                    await TestResultdao.updateTestResult(req.body, id, rfid);
                    return res.status(200).end();
                }
                return res.status(404).end();
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

    app.delete('/api/skuitems/:rfid/testResult/:id', async function (req, res) {
        //if(req.session.loggedin && (req.session.user.type=="manager" || req.session.user.type=="qualityEmployee")){
        const rfid = req.params.rfid;
        const id = parseInt(req.params.id);
        if (rfid!=undefined && rfid.length == 32 && /^\d+$/.test(rfid) && id!=undefined) {
            const testresult = await TestResultdao.getTestResultBySKUITEMIDAndID(rfid, id);
            if (testresult != null) {
                await TestResultdao.deleteTestResult(id, rfid);
                return res.status(204).end();
            }
            return res.status(404).end();
        }
        return res.status(422).end();
        //}else{
        //    return res.status(401).end();
        //}
    });

}