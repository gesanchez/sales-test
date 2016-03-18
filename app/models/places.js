module.exports = function (db, models) {
  models.sedes = db.define('sedes', {
    id: {type: 'serial', key: true, mapsTo: 'id'},
    name: {type: 'text', size: 40, mapsTo: 'sede'},
    direction: {type: 'text', size: 40, mapsTo: 'direccion'}
  },{
    methods: {
      serialize: function () {
        return {
          id : this.id,
          name : this.name,
          direction: this.direction
        }
      }
    }
  });
};
