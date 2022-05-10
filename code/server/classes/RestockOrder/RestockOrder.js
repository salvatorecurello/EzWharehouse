class RestockOrder{
    constructor (data){
        this.Id = data.id;
        this.IssueDate = data.issueDate;
        this.SupplierID = data.supplierId;
        this.State = data.state;
        this.ProductsList = [];
        this.skuItems = [];
        this.TransportNote = [];
    }

    pushProducts(products){
        this.ProductsList.push(products);
    }

    pushSkuItems(skuItems){
        this.skuItems.push(skuItems);
    }

    setTransportNote(key, note){
        let data = {};
        data[key] = note;

        this.TransportNote.push(data);
    }

    setState(state){
        this.State = state;
    }

    toDict(){
        var data = {
            id: this.Id,
            issueDate: this.IssueDate,
            supplierId: this.supplierId,
            state: this.state,
            products: this.ProductsList
        };

        if (!["ISSUED", "DELIVERY"].includes(data.state)) {
            data.transportNote = {transportNote: this.TransportNote};
            data.skuItems = this.SKUItemsList;
        }

        return data;
    }
}

module.exports=RestockOrder