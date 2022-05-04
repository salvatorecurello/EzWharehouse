class User{
    constructor (data){
        this.ID = data.ID;
        this.NAME = data.NAME;
        this.SURNAME = data.SURNAME;
        this.TYPE = data.TYPE;
        this.PASSWORD = data.PASSWORD;
        this.EMAIL = data.EMAIL;
    }
}

module.exports=User