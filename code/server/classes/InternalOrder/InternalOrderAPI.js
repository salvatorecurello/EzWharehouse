module.exports = function(app){

    app.get('/api/internalOrders', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/internalOrdersIssued', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/internalOrdersAccepted', function(req, res){
        return res.sendStatus(200);
    });

    app.get('/api/internalOrders/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.post('/api/internalOrders', function(req, res){
        return res.sendStatus(200);
    });

    app.put('/api/internalOrders/:id', function(req, res){
        return res.sendStatus(200);
    });

    app.delete('/api/internalOrders/:id', function(req, res){
        return res.sendStatus(200);
    });

    
}