module.exports = function(app){

    app.get('/api/items', function(req, res){
        return res.status(200);
    });

    app.get('/api/items/:id', function(req, res){
        return res.status(200);
    });

    app.post('/api/item', function(req, res){
        return res.status(200);
    });

    app.put('/api/item/:id', function(req, res){
        return res.status(200);
    });

    app.delete('/api/items/:id', function(req, res){
        return res.status(200);
    });

    
}