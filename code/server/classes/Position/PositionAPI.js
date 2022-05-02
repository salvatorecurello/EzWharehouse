module.exports = function(app){

    app.get('/api/positions', function(req, res){
        return res.status(200);
    });

    app.post('/api/position', function(req, res){
        return res.status(200);
    });

    app.put('/api/position/:positionID', function(req, res){
        return res.status(200);
    });

    app.put('/api/position/:positionID/changeID', function(req, res){
        return res.status(200);
    });

    app.delete('/api/position/:positionID', function(req, res){
        return res.status(200);
    });

    
}



