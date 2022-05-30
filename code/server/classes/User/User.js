class User {
    constructor(data) {
        this.id = data.ID;
        this.name = data.NAME;
        this.surname = data.SURNAME;
        this.type = data.TYPE;
        this.password = data.PASSWORD;
        this.email = data.EMAIL;
    }
}

module.exports = User