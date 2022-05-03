module.exports = function(app){

    app.get('/api/skuitems', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/skuitems/sku/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/skuitems/:rfid', function(req, res){
        return res.sendStatus(200);
    });

    app.post('/api/skuitem', function(req, res){
        return res.sendStatus(200);
    });

    app.put('/api/skuitems/:rfid', function(req, res){
        return res.sendStatus(200);
    });

    app.delete('/api/skuitems/:rfid', function(req, res){
        return res.sendStatus(200);
    });

}