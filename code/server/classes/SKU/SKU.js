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
        this.testDescriptors=[];
        for(let x of list){
            this.testDescriptors.push(x.ID)
        }
    }

}

module.exports=SKU


