var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    nconf = require('nconf'),
    models = require('./app/models'),
    morgan = require('morgan'),
    orm = require("orm");
require('dotenv').load();

nconf.use('memory');
nconf.argv();
nconf.env();

app.set('view engine', 'jade');
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/static', express.static(__dirname + '/public'));

app.use(orm.express("mysql://"+ nconf.get('DB_USER') +":"+ nconf.get('DB_PASS') +"@"+ nconf.get("DB_HOST") +"/"+ nconf.get("DB_NAME") +"", {
  define: function (db, models, next) {
    require('./app/models')(db, models);
    next();
  }
}));

require('./app/routes')(app);
require('./app/services/cron')(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
