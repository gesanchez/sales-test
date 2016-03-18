module.exports = function (db, models) {
  models.productos = db.define('productos', {
    id: {type: 'serial', key: true, mapsTo: 'id'},
    name: {type: 'text', size: 40, mapsTo: 'producto'},
    price: {type: 'number', mapsTo: 'precio'},
    details: {type: 'text', mapsTo: 'descripcion'}
  },{
    methods: {
      serialize: function () {
        return {
          id : this.id,
          name: this.name,
          price: this.price,
          details: this.details
        }
      }
    }
  });
};
