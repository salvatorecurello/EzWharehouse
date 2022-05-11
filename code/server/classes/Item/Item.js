class Item{
    constructor (item){
        this.id = item.ID;
        this.description = item.DESCRIPTION;
        this.price = item.PRICE;
        this.SKUId = item.SKUID;
        this.supplierId = item.SUPPLIERID;
    }
}

module.exports=Item