/**
 * Created by fran on 20/4/16.
 */

var mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    clave: String 
});

module.exports.Usuario = mongoose.model('Usuario',usuarioSchema);