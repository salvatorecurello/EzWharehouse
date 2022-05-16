/*
    Date:		11/05/2022
    Version:	1.0v
    Author:		Riela Giovanni
*/

class ReturnOrder{
    constructor (data){
        this.Id = data.ID;
        this.ReturnDate = data.RETURNDATE;
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