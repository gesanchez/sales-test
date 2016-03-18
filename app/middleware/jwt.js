var jwt = require('jwt-simple'),
    moment = require('moment'),
    nconf = require('nconf');

exports.ensureAuthenticated = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(!token) {
    return res.status(403).send({message: "You need generate a token."});
  }

  var payload = jwt.decode(token, nconf.get('SECRET_KEY'));

  if(payload.exp <= moment().unix()) {
     return res.status(401).send({message: "Token has expired."});
  }

  req.user = payload.sub;
  next();
};
