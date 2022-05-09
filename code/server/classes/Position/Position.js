class Position{
    constructor (position){
        this.ID = position.ID;
        this.AISLEID = position.AISLEID;
        this.ROW = position.ROW;
        this.COL = position.COL;
        this.MAXWEIGHT = position.MAXWEIGHT;
        this.MAXVOLUME = position.MAXVOLUME;
        this.OCCUPIEDWEIGHT = position.OCCUPIEDWEIGHT;
        this.OCCUPIEDVOLUME = position.OCCUPIEDVOLUME;

    }
}
            
module.exports=Position