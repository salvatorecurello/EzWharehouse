class InternalOrder{
    constructor (order){
        this.id = order.id;
        this.issueDate = order.issueDate;
        this.state = order.state;
        this.customerID = order.customerID;
        this.products = order.products;
    }
}

module.exports=InternalOrder