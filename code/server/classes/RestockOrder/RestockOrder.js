class RestockOrder{
    constructor (data){
        this.ID = data.id;
        this.IssueDate = data.issueDate;
        this.SupplierID = data.supplierId;
        this.State = data.state;
        this.ProductsList = [];
        this.skuItems = [];
        this.TransportNote = {};
    }

    pushProducts(products){
        this.ProductsList.push(products);
    }

    pushSkuItems(skuItems){
        this.skuItems.push(skuItems);
    }

    setTransportNote(key, note){
        this.TransportNote.set(key, note);
    }

    setState(state){
        this.State = state;
    }

    toMap(){
        var data = {
            "id": this.ID,
            "issueDate": this.IssueDate,
            "supplierId": this.supplierId,
            "state": this.state,
            "products": this.ProductsList
        };

        if (!["ISSUED", "DELIVERY"].includes(data.state)) {
            data.transportNote = this.TransportNote;
            data.skuItems = this.SKUItemsList;
        }

        return data;
    }
}

module.exports=RestockOrder