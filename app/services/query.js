/* for track all query and save in log */
var Promise = require("bluebird");
module.exports = {
  all: function(model, cb){
    return model.all(cb);
  },
  one: function(query, model, cb){
    return model.one(query, cb);
  },
  get: function(id, model, cb){
    return model.get(id, cb);
  },
  create: function(object, model, cb){
    return model.create(object, cb);
  },
  find: function(params, model, cb){
    return model.find(params, cb);
  },
  allAsync: function(model){
    return new Promise(function(resolve, reject) {
      model.all(function(err, data){
        if (err){ reject(err); }
        resolve(data);
      });
    });
  },
  getAsync: function(id, model){
    return new Promise(function(resolve, reject) {
      model.get(id, function(err, data){
        if (err){ reject(err); }
        resolve(data);
      });
    });
  },
  findAsync: function(params, model){
    return new Promise(function(resolve, reject) {
      model.find(params, function(err, data){
        if (err){ reject(e); }
        resolve(data);
      });
    });
  },
  oneAsync: function(query, model, cb){
    return new Promise(function(resolve, reject) {
      model.one(query, function(err, data){
        if (err){ reject(err); }
        resolve(data);
      });
    });
  },
  updateAsync: function(instance){
    return new Promise(function(resolve, reject) {
      instance.save(function(err, data){
        if (err){ reject(err); }
        resolve(data);
      });
    });
  }
};
