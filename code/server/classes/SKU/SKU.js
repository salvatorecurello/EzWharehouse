class SKU{
    constructor (data){
        this.id = data.ID;
        this.description = data.DESCRIPTION;
        this.weight = data.WEIGHT;
        this.volume = data.VOLUME;
        this.notes = data.NOTES;
        this.position = data.POSITION;
        this.availableQuantity = data.AVAILABLEQUANTITY;
        this.price = data.PRICE;
        this.testDescriptorIDList = data.TESTDESCRIPTORIDLIST; 

    }
}

module.exports=SKU


