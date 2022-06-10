const Position = require('./Position.js');

class PositionDAO {
    sqlite = require('sqlite3');
    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        });
        this.db.get("PRAGMA busy_timeout = 10000");
    }


    storePosition(position) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Position(ID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume], function(err)  {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
                
            });
        });
    }

    getPositions() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Position';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const positions = rows.map((p) => (new Position(p)));
                    resolve(positions);
                }
                
            });
        });
    }

    getPositionByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Position WHERE ID=?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows.length == 0){
                    resolve(null); 
                }else{
                    resolve(new Position(rows[0]));
                }
            });
        });
    }

    updatePosition(old_positionId, position) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Position SET ID = ?, AISLEID = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ? WHERE ID == ?';
            this.db.run(sql, [position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume, old_positionId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
                

            });
        });
    }

    updatePositionID(old_positionID, new_positionID) {

        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Position SET ID = ?, AISLEID = ?, ROW = ?, COL = ? WHERE ID == ?';
            const aisleID = new_positionID.substring(0, 4);
            const row = new_positionID.substring(4, 8);
            const col = new_positionID.substring(8, 12);

            this.db.run(sql, [new_positionID, aisleID, row, col, old_positionID], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
                

            });
        });

    }

    deletePosition(positionID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM POSITION WHERE ID == ?';
            this.db.run(sql, [positionID], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
                

            });
        });

    }
}

module.exports = PositionDAO;
