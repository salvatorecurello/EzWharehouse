module.exports = function(app){

    app.get('/api/testDescriptors', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/testDescriptors/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.post('/api/testDescriptor', function(req, res){
        return res.sendStatus(200);
    });

    app.put('/api/testDescriptor/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.delete('/api/testDescriptor/:id', function(req, res){
        return res.sendStatus(200);
    });

}