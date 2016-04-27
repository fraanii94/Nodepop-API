/**
 * Created by fran on 20/4/16.
 */
'use strict';

var mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        index: true,
        required: true
    },
    email: {
        type: String,
        index: true,
        required: true
    },
    clave: {
        type: String,
        required: true
    }
});
// Static method to filter Anuncios
usuarioSchema.statics.findCriteria = function (req,callback) {

    var nombre = req.query.nombre;
    var email = req.query.email;
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;
    var sort = req.query.sort ||'nombre';
    var criteria = {};

    if(typeof nombre !== 'undefined'){
        criteria.nombre = new RegExp('^' + nombre, 'i');
    }
    if(typeof email !== 'undefined'){
        criteria.email = email;
    }

    var query = this.find(criteria);
    query.sort(sort);
    query.limit(limit);
    query.skip(start);
    query.exec(function (err,anuncios) {
        console.log(err);
        if(err){
            return callback(err);
        }
        callback(null,anuncios);

    });

};
mongoose.model('Usuario',usuarioSchema);