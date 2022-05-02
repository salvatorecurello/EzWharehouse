module.exports = function(app){

    app.get('/api/skus', function(req, res){
        return res.status(200);
    });

    app.get('/api/skus/:id', function(req, res){
        return res.status(200);
    });

    app.post('/api/sku', function(req, res){
        return res.status(200);
    });

    app.put('/api/sku/:id', function(req, res){
        return res.status(200);
    });

    app.put('/api/sku/:id/position', function(req, res){
        return res.status(200);
    });

    app.delete('/api/skus/:id', function(req, res){
        return res.status(200);
    });

}