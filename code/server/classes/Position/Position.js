class Position{
    constructor (position){
        this.positionID = position.ID;
        this.aisleID = position.AISLEID;
        this.row = position.ROW;
        this.col = position.COL;
        this.maxWeight = position.MAXWEIGHT;
        this.maxVolume = position.MAXVOLUME;
        this.occupiedWeight = position.OCCUPIEDWEIGHT;
        this.occupiedVolume = position.OCCUPIEDVOLUME;

    }
}
            
module.exports=Position