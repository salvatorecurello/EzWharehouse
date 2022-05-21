class SKUItem{
    constructor (data){
        this.RFID = data.RFID;
        this.SKUId = data.SKUID;
        this.available = data.AVAILABLE;
        this.DateOfStock = data.DATEOFSTOCK;
    }
}

module.exports=SKUItem