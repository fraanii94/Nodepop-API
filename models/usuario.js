/**
 * Created by fran on 20/4/16.
 */

var mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    clave: String 
});

mongoose.model('Usuario',usuarioSchema);