dayjs = require('dayjs');

class TestResult {
    constructor(data) {
        this.ID = data.ID;
        this.SKUITEMID = data.SKUITEMID;
        this.IDTESTDESCRIPTOR = data.IDTESTDESCRIPTOR;
        this.DATE = data.DATE;
        this.RESULT = data.RESULT;
    }

    toJson() {
        const data = {
            id: this.ID,
            idTestDescriptor: this.IDTESTDESCRIPTOR,
            Date: dayjs.unix(this.DATE).format('YYYY/MM/DD'),
            Result: this.RESULT == 0 ? false : true
        }
        return data;
    }
}

module.exports = TestResult