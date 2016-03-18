/* Files for load all models */

module.exports = function (db, models, cb) {
  require('./clients')(db, models);
  require('./places')(db, models);
  require('./products')(db, models);
  require('./shopping')(db, models);
  require('./log')(db, models);
  if (cb){
    cb();
  }
};
