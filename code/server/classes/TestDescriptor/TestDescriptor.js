class TestDescriptor {
    constructor(data) {
        this.id = data.ID;
        this.name = data.NAME;
        this.procedureDescription = data.PROCEDURE;
        this.idSKU = data.SKUID;
    }
}

module.exports = TestDescriptor