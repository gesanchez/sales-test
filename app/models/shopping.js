var query = require('../services/query');
module.exports = function (db, models) {
  models.compras = db.define('compras', {
    id: {type: 'serial', key: true, mapsTo: 'id'},
    price: {type: 'number', mapsTo: 'precio'},
    details: {type: 'text', mapsTo: 'descripcion', required: false},
    date: {type: 'date', time: true, mapsTo: 'fecha'},
    client: {type: 'integer', mapsTo: 'id_cliente'},
    product: {type: 'integer', mapsTo: 'id_producto'},
    place: {type: 'integer', mapsTo: 'id_sede', required: false},
  },{
    methods: {
      serialize: function () {
        return {
          id : this.id,
          date : this.date,
          details: this.details,
          price: this.price,
          client: this.client,
          product: this.product,
          place: this.place
        }
      }
    }
  });
};
