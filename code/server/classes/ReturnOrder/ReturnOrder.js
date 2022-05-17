const dayjs = require('dayjs');

class ReturnOrder{
    constructor (data){
        this.Id = data.ID;
        this.ReturnDate = dayjs.unix(data.RETURNDATE).format('YYYY/MM/DD HH:mm');
        this.ProductsList = [];
        this.RestockOrderId = data.RESTOCKORDERID;
    }

    pushProducts(products){
        this.ProductsList.push({
            SKUId: products.SKUID,
            description: products.DESCRIPTION,
            price: products.PRICE,
            RFID: products.RFID
        });
    }

    toDict(){
        return {
            id: this.Id,
            returnDate: this.ReturnDate,
            restockOrderId: this.restockOrderId,
            products: this.products
        }
    }
}

module.exports=ReturnOrder