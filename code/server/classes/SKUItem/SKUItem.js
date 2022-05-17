const dayjs = require('dayjs');

class SKUItem{
    constructor (data){
        this.RFID = data.RFID;
        this.SKUId = data.SKUID;
        this.available = data.AVAILABLE;
        this.DateOfStock = dayjs.unix(data.DATEOFSTOCK).format('YYYY/MM/DD HH:mm');
    }
}

module.exports=SKUItem