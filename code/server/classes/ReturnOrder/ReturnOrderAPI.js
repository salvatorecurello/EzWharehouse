module.exports = function(app){

    app.get('/api/returnOrders', function(req, res){
        return res.status(200);
    });

    app.get('/api/returnOrders/:id', function(req, res){
        return res.status(200);
    });

    app.post('/api/returnOrder', function(req, res){
        return res.status(200);
    });

    app.delete('/api/returnOrder/:id', function(req, res){
        return res.status(200);
    });

}