class SKU{
    constructor (data){
        this.id = data.ID;
        this.description = data.DESCRIPTION;
        this.weight = data.WEIGHT;
        this.volume = data.VOLUME;
        this.notes = data.NOTE;
        this.position = data.POSITION;
        this.availableQuantity = data.AVAILABLEQUANTITY;
        this.price = data.PRICE;
        this.testDescriptors = data.TESTDESCRIPTORIDLIST; 

    }

    setTestDescriptorIDList(list){
        this.testDescriptor=list;
    }

}

module.exports=SKU


