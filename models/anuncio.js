/**
 * Created by fran on 20/4/16.
 */
'use strict';

var mongoose = require('mongoose');

var anuncioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        index: true,
        required: true
    },
    venta: {
        type: Boolean,
        index: true,
        required: true
    },
    precio: {
        type: Number,
        index: true,
        required: true
    },
    foto: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        index: true,
        required: true
    }
});

// Static method to filter Anuncios
anuncioSchema.statics.findCriteria = function (req,callback) {

    var nombre = req.query.nombre;
    var venta = req.query.venta;
    var precio = req.query.precio;
    var tag = req.query.tag;
    var sort = req.query.sort || 'nombre';
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;


    var criteria = {};
console.log(criteria);
    if (typeof nombre !== 'undefined') {
        criteria.nombre = new RegExp('^' + nombre, 'i');
    }
    if (typeof venta !== 'undefined') {
        criteria.venta = venta;
    }
    if (typeof precio !== 'undefined') {

        criteria.precio = parsePrecio(precio);

    }

    if(typeof tag !== 'undefined'){
        criteria.tags = tag;
    }

    var query = this.find(criteria);
    query.sort(sort);
    query.skip(start);
    query.limit(limit);

    query.exec(function (err,anuncios) {

        if(err){
            return callback(err);
        }
        callback(null,anuncios);

    });

};

// Auxiliary methods to maintain clean code,

// take precio of Anuncio, and return a condition

function parsePrecio(precio) {

    if (/^-[0-9]+$/.test(precio)) {
        precio = {'$lte': parseInt(precio.match(/[0-9]+/))};

    } else if (/^[0-9]+\-$/.test(precio)) {
        precio = {'$gte': parseInt(precio.match(/[0-9]+/)) };

    } else if (/^[0-9]+\-[0-9]+$/.test(precio)) {
        precio = {'$gte': parseInt(precio.split('-')[0]), '$lte': parseInt(precio.split('-')[1])};

    }else if (/^[0-9]+$/.test(precio)) {
        precio = parseInt(precio);

    } else {
        precio = {'$gte': 0};
    }

    return precio;

}

mongoose.model('Anuncio',anuncioSchema);