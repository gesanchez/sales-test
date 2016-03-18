var api = require('../controllers/api'),
    jwt = require('../middleware/jwt');

module.exports = function(app){
  app.post('/api/login', api.login);
  app.post('/api/checkout', jwt.ensureAuthenticated, api.checkout);
  app.get('/api/my-shops', jwt.ensureAuthenticated, api.myShops);
  app.get('/api/billing/:id', api.billing);
  app.put('/api/product/:id', jwt.ensureAuthenticated, api.updateProduct);
};
