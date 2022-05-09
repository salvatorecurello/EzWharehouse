class ReturnOrder{
    constructor (id, returnDate, products, restockOrderId){
        this.ID = id;
        this.ReturnDate = returnDate;
        this.ProductsList = products;
        this.RestockOrderID = restockOrderId;
    }

    toMap(){
        return {
            "id": this.ID,
            "returnDate": this.ReturnDate,
            "restockOrderId": this.restockOrderId,
            "products": this.products
        }
    }
}

module.exports=ReturnOrder