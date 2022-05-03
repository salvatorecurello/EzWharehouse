module.exports = function(app){

    app.get('/api/skuitems/:rfid/testResults', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/skuitems/:rfid/testResults/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.post('/api/skuitems/testResult', function(req, res){
        return res.sendStatus(200);
    });

    app.put('/api/skuitems/:rfid/testResult/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.delete('/api/skuitems/:rfid/testResult/:id', function(req, res){
        return res.sendStatus(200);
    });

}