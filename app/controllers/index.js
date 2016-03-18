var query = require('../services/query'),
    promise = require("bluebird");
module.exports = function(req, res, next){
  var products = [], places = [];
  query.allAsync(req.models.productos)
  .then(function(data){
    products = data;
  })
  .then(function(){
    return query.allAsync(req.models.sedes)
    .then(function(data){
      places = data;
    });
  }).then(function(){
    res.render('index', {data: JSON.stringify({products: products, places: places})});
  }).catch(function(){
    res.render('index', {data: JSON.stringify({products: products, places: places})});
  })
};
