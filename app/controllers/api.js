var jwt = require('../services/jwt'),
    moment= require('moment'),
    promise = require("bluebird"),
    query = require('../services/query');

module.exports = {
  login: function(req, res, next){
    var documents = req.body.document;
    if (!documents){ return res.status(200).json({message: "No document field provied"}); }

    req.models.clientes.one({documents: documents}, function(err, client){
      if (err || !client){
        return res.status(404).json({message: "Client not found", success: false});
      }

      var token = jwt.createToken(client);
      return res.status(200).json({success: true, token: token, user: client.serialize()});
    });
  },
  checkout: function(req, res, next){
    var items = req.body.items;
    if (!items){ return res.status(200).json({message: "No items field provied"}); }

    for (var i = 0, len = items.length; i < len; i++){
      if (!items[i].hasOwnProperty('id')){
        return res.status(401).json({message: "No id field provied in data sent"});
      }
    }

    query.get(req.user, req.models.clientes, function(err, user){
      items.forEach(function (item) {
        query.get(item.id, req.models.productos, function(err, data){
          if(err){ res.status(401).json({message: "Id: " + item.id + " is invalid"}); }
          var param = {price: item.price, details: data.details,product: data.id, 'client' : user.id, 'place' : item.place, 'date' : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")};
          query.create(param, req.models.compras, function(err, shopping){
            console.log(err);
          });
        });
      });
    });

    return res.status(200).json({"message": "You items was save successfully", "success" : true});
  },

  myShops: function(req, res, next){
    var iduser = req.params.id || req.user;
    query.findAsync({"id_cliente" : iduser}, req.models.compras)
    .then(function(data){
      return promise.map(data, function(item){
        return query.getAsync(item.client, req.models.clientes)
        .then(function(client){
          item.client = client;
          return item;
        })
        .then(function(list){
          if (item.product){
            return query.getAsync(item.product, req.models.productos)
            .then(function(product){
              item.product = product;
              return item;
            });
          }else{
            return item;
          }
        }).then(function(list){
          if (item.place){
            return query.getAsync(item.place, req.models.sedes)
            .then(function(place){
              item.place = place;
              return item;
            });
          }else{
            return item;
          }
        });
      })
    }).then(function(data){
      return res.status(200).json(data);
    }).catch(function(err){
      return res.status(500).json({message: "An error ocurred, try again later"});
    });
  },
  billing: function(req, res, next){
    var documents = req.params.id,
        client = {};
    query.oneAsync({'documents' : documents},req.models.clientes)
    .then(function(cl){
      if (cl){
        client = cl;
        return query.findAsync({"id_cliente" : client.id}, req.models.compras)
          .then(function(items){
            return promise.map(items, function(item){
              return query.oneAsync({"id" : item.product}, req.models.productos)
              .then(function(product){
                item.product = product;
                return item;
              }).then(function(items){
                return query.oneAsync({"id" : item.place}, req.models.sedes)
                .then(function(place){
                  item.place = place;
                  return item;
                });
              });
            });
          });
      }else{
        return [];
      }
    }).then(function(data){
      client.items = data;
      return res.status(200).json(client);
    }).catch(function(err){
      return res.status(500).json({message: "An error ocurred, try again later"});
    });
  },
  updateProduct: function(req, res, next){
    query.getAsync(req.params.id, req.models.compras)
    .then(function(item){
      if (req.body.price){
        item.price = req.body.price;
        return query.updateAsync(item)
      }
    }).then(function(item){
      return res.status(200).json(item);
    }).catch(function(err){
      return res.status(404).json({message: "Id shop not found"});
    })

  },
  deleteProduct: function(req, res, next){
    
  }
};
