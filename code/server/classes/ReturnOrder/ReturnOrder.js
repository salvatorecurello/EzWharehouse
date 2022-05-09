class ReturnOrder{
<<<<<<< HEAD
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
=======
    constructor (){}
>>>>>>> 0fefbabff9391c2f03ae7fe136e1f8adcddec1f3
}

module.exports=ReturnOrder