var nconf = require('nconf'),
    nodemailer = require('nodemailer'),
    orm = require("orm"),
    cronJob = require('cron').CronJob;
module.exports = function(app){
  var transport = nodemailer.createTransport("SMTP", {
    host: nconf.get('SMTP_HOST'),
    port: nconf.get('SMTP_PORT'),
    secureConnection : false,
    auth: {
      user: nconf.get('SMTP_USER'),
      pass: nconf.get('SMTP_PASSWORD')
    }
  });
  new cronJob('00 11 59 * * 7', function() {
    orm.connect("mysql://"+ nconf.get('DB_USER') +":"+ nconf.get('DB_PASS') +"@"+ nconf.get("DB_HOST") +"/"+ nconf.get("DB_NAME") +"", function (err, db) {
      require('../models/shopping')(db, db.models);
      require('../models/products')(db, db.models);
      db.models.compras.aggregate().count('id').sum('precio').min('precio').max('precio').get(function(err, count, sum, min, max){
        db.models.productos.aggregate().min('precio').max('precio').get(function(err, min2, max2){
          var html = "<table border='0' width='600px'>"
          +"<tr>"
          +"<td>Total Ganacias</td>"
          +"<td>"+ (sum) +"</td>"
          +"</tr>"
          +"<tr>"
          +"<td>Total Ventas</td>"
          +"<td>"+ count +"</td>"
          +"</tr>"
          +"<tr>"
          +"<td>Promedio minimo</td>"
          +"<td>"+ ((min2 + min) / 2) +"</td>"
          +"</tr>"
          +"<tr>"
          +"<td>Promedio maximo</td>"
          +"<td>"+ ((max2 + max) / 2) +"</td>"
          +"</tr>"
          +"</table>";
          var mailOptions = {
            from: '"System report" <test@sales.com>',
            to: nconf.get('SMTP_EMAIL'),
            subject: 'Week Report',
            // text: 'asdasd',
            html : html
          };
          transport.sendMail(mailOptions, function(error, info){
            console.log('Message sent');
          });
        });
      });
    });

  }, null, true, 'America/Caracas');
};
