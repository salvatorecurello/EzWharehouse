class RestockOrder{
    constructor (data){
        this.Id = data.ID;
        this.IssueDate = data.ISSUEDATE;
        this.SupplierID = data.SUPPLIERID;
        this.State = data.STATE;
        this.Products = [];
        this.SKUItems = [];
        this.TransportNote = {};
    }

    pushProducts(products){
        this.Products.push(products);
    }

    pushSkuItems(skuItems){
        this.SKUItems.push(skuItems);
    }

    setTransportNote(key, note){
        this.TransportNote[key] = note;
    }

    setState(state){
        this.State = state;
    }

    toDict(){
        var data = {
            id: this.Id,
            issueDate: this.IssueDate,
            supplierId: this.SupplierId,
            state: this.State,
            products: this.Products
        };

        if (!["ISSUED"].includes(data.state)) {
            data.transportNote = this.TransportNote;

            if (!["DELIVERY"].includes(data.state))
                data.skuItems = this.SKUItemsList;
        }

        return data;
    }
}

module.exports=RestockOrder