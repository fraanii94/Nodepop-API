/**
 * Created by fran on 20/4/16.
 */

var mongoose = require('mongoose');

var anuncioSchema = new mongoose.Schema({
    nombre: String,
    venta: Boolean, 
    precio: Number,
    foto: String,
    tags: [String]
});

module.exports.Anuncio = mongoose.model('Anuncio',anuncioSchema);