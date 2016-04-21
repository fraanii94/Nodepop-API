
var mongoose = require('mongoose');
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function() {
    console.info('Connected to mongodb.');
});
mongoose.connect('mongodb://localhost:27017/nodepop');
// Importing libraries and modules

var fs = require('fs');
var path = require('path');

var Anuncio = require('../models/anuncio');
var Usuario = require('../models/usuario');


// Function to read JSON files in serie

function serie(pathList,keys,callback){

    if (pathList.length === 0){
        return;
    }

    var pathFile = path.join(__dirname,pathList.shift());

    fs.readFile(pathFile,function (err,data) {
        if (err){
            callback(err);
            return;
        }
        try{
            var jsonObject = JSON.parse(data);
            callback(null,jsonObject);
            
        }
        catch (e) {
            console.log(e);
        }
        serie(pathList,keys,callback);

    });
}

// Call to serie function

serie(['/anuncios.json','/usuarios.json'],['anuncios','usuarios'],function (err,data) {
    if (err){
        console.log(err);
        return;
    }

    // If we read anuncios

    if (data.anuncios){

        data.anuncios.forEach(function(anuncio){ // Take one and insert into database

           var object = new Anuncio({"nombre":anuncio.nombre,
                                     "venta":anuncio.venta,
                                     "precio":anuncio.precio,
                                     "foto":anuncio.foto,
                                     "tags":anuncio.tags
                                    });
            object.save(function (err,object) {

                if (err) throw err;
                console.log('Anuncio',object.nombre,'insertado');
            });
        });
    // Otherwise if we read usuarios
    }else if (data.usuarios){

        data.usuarios.forEach(function(usuario){ // Take one and insert into database

            var object = new Usuario(usuario);
            object.save(function (err,object) {

                if (err) throw err;
                console.log('Usuario',object.nombre,'insertado');
            });
        });
        var query = Usuario.find({});
        query.sort('nombre');
        return query.exec(function(err, rows) {
            if (err) { return cb(err);}
            return cb(null, rows); });

    }


});




