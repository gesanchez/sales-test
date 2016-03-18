module.exports = function (db, models) {
  models.log = db.define('log', {
    id: {type: 'serial', key: true, mapsTo: 'id'},
    date: {type: 'date', time: true, mapsTo: 'fecha'},
    details: {type: 'text', mapsTo: 'descripcion'}
  },{
    methods: {
      serialize: function () {
        return {
          id : this.id,
          date : this.date,
          details: this.details
        }
      }
    }
  });
};
