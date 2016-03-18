var index = require('../controllers/index');
module.exports = function(app){
  require('./api')(app);
  app.get('/', index);
};
