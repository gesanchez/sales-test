module.exports = function (db, models) {
  models.clientes = db.define('clientes', {
    id: {type: 'serial', key: true, mapsTo: 'id'},
    documents: {type: 'integer', size: 11, mapsTo: 'documento'},
    name: {type: 'text', size: 80, mapsTo: 'nombres'},
    details: {type: 'text', mapsTo: 'detalles'}
  },{
    methods: {
      serialize: function () {
        return {
          id : this.id,
          documents : this.documents,
          name: this.name,
          details: this.details
        }
      }
    }
  });
  // clients.hasOne('message', db.models.message, { required: true, reverse: 'comments', autoFetch: true });
};
