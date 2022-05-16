const dayjs = require('dayjs');

class RestockOrder{
    static states = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"];

    constructor (data){
        this.Id = data.ID;
        this.IssueDate = dayjs.unix(data.ISSUEDATE);
        this.SupplierId = data.SUPPLIERID;
        this.State = data.STATE - 1;
        this.Products = [];
        this.SKUItems = [];
        this.TransportNote = {};
    }

    pushProducts(products){
        this.Products.push({
            SKUId: products.SKUID,
            description: products.DESCRIPTION,
            price: products.PRICE,
            qty: products.QTY
        });
    }

    pushSkuItems(skuItems){
        this.SKUItems.push({
            SKUId: skuItems.SKUID,
            rfid: skuItems.RFID
        });
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
            state: RestockOrder.states[this.State],
            products: this.Products
        };

        if (this.State > 0) {
            data.transportNote = this.TransportNote;

            if (this.State > 1)
                data.skuItems = this.SKUItemsList;
        }

        return data;
    }
}

module.exports=RestockOrder