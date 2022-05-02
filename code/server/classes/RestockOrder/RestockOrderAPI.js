module.exports = function(app){

    app.get('/api/restockOrders', function(req, res){
        return res.status(200);
    });

    app.get('/api/restockOrdersIssued', function(req, res){
        return res.status(200);
    });

    app.get('/api/restockOrders/:id', function(req, res){
        return res.status(200);
    });

    app.get('/api/restockOrders/:id/returnItems', function(req, res){
        return res.status(200);
    });

    app.post('/api/restockOrder', function(req, res){
        return res.status(200);
    });

    app.put('/api/restockOrder/:id', function(req, res){
        return res.status(200);
    });

    app.put('/api/restockOrder/:id/skuItems', function(req, res){
        return res.status(200);
    });

    app.put('/api/restockOrder/:id/transportNote', function(req, res){
        return res.status(200);
    });

    app.delete('/api/restockOrder/:id', function(req, res){
        return res.status(200);
    });

}