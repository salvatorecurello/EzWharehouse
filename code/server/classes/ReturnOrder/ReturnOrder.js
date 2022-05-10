class ReturnOrder{
    constructor (id, returnDate, restockOrderId){
        this.Id = id;
        this.ReturnDate = returnDate;
        this.ProductsList = [];
        this.RestockOrderId = restockOrderId;
    }

    pushProducts(products){
        this.ProductsList.push(products);
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