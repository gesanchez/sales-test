var jwt = require('jwt-simple'),
    moment = require('moment'),
    nconf = require('nconf');

module.exports = {
  createToken: function(user){
    var payload = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(7, "days").unix(),
    };
    return jwt.encode(payload, nconf.get('SECRET_KEY'));
  },
  decodeToken: function(token){
    var payload = jwt.decode(token, nconf.get('SECRET_KEY'));
    return payload;
  }
};
