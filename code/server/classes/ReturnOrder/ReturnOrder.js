const dayjs = require('dayjs');

class ReturnOrder{
    constructor (data){
        this.Id = data.ID;
        this.ReturnDate = dayjs.unix(data.RETURNDATE).format('YYYY/MM/DD HH:mm');
        this.Products = [];
        this.RestockOrderId = data.RESTOCKORDERID;
    }

    pushProducts(products){
        this.Products.push({
            SKUId: products.SKUID,
            itemId: products.ITEMID,
            description: products.DESCRIPTION,
            price: products.PRICE,
            RFID: products.SKUITEMID
        });
    }

    toDict(){
        return {
            id: this.Id,
            returnDate: this.ReturnDate,
            restockOrderId: this.RestockOrderId,
            products: this.Products
        }
    }
}

module.exports=ReturnOrder