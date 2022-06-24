const dayjs = require('dayjs');

class RestockOrder{
    static states = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"];

    constructor (data){
        this.Id = data.ID;
        this.IssueDate = dayjs.unix(data.ISSUEDATE).format('YYYY/MM/DD HH:mm');
        this.SupplierId = data.SUPPLIERID;
        this.State = data.STATE - 1;
        this.Products = [];
        this.SKUItems = [];
        this.TransportNote = {};
    }

    pushProducts(products){
        this.Products.push({
            SKUId: products.SKUID,
            itemId: products.ITEMID,
            description: products.DESCRIPTION,
            price: products.PRICE,
            qty: products.QTY
        });
    }

    pushSkuItems(skuItems){
        this.SKUItems.push({
            SKUId: skuItems.SKUID,
            itemId: skuItems.ITEMID,
            rfid: skuItems.SKUITEMID
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
            products: this.Products,
            skuItems: this.SKUItems
        };

        if (this.State > 0) {
            data.transportNote = this.TransportNote;
        }

        return data;
    }
}

module.exports=RestockOrder