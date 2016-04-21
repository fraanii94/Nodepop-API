"use strict";

// Importing libraries and modules

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var models = require('../models');

// Function to read JSON files in serie

function serie(pathList,keys,callback){

    if (pathList.length === 0){
        return;
    }

    var pathFile = path.join(__dirname,pathList.shift());

    fs.readFile(pathFile,function (err,data) {
        if (err){
            return callback(err);
        }
        try{
            var jsonObject = JSON.parse(data);
        }
        catch (e) {
            console.log(e);
        }

        callback(null,jsonObject);
        serie(pathList,keys,callback);
    });
}

// ********* Create connection to database *************

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function() {
    console.info('Connected to mongodb.');
});
mongoose.connect('mongodb://localhost:27017/nodepop');

// ********* Delete all existing rows *************

models.Anuncio.remove({},function () {
    console.log("Removed");
});

models.Usuario.remove({},function () {
    console.log("Removed");
});

models.Token.remove({},function () {
    console.log("Removed");
});

// ********* Fill database with data *************

serie(['/anuncios.json','/usuarios.json'],['anuncios','usuarios'],function (err,data) {
    if (err){
        console.log(err);
        return;
    }

    // If we read anuncios

    if (data.anuncios){

        data.anuncios.forEach(function(anuncio){ // Take one and insert into database

            var object = new models.Anuncio({"nombre":anuncio.nombre,
                                     "venta":anuncio.venta,
                                     "precio":anuncio.precio,
                                     "foto":anuncio.foto,
                                     "tags":anuncio.tags
                                    });
            console.log('Content of Anuncio:\n \n',object,'\n \n');
            object.save(function (err,object) {

                if (err) throw err;
                console.log(object.nombre,'inserted');
            });
        });
    // Otherwise if we read usuarios
    }else if (data.usuarios){

        data.usuarios.forEach(function(usuario){ // Take one and insert into database

            var object = new models.Usuario(usuario);
            object.save(function (err,object) {

                if (err) throw err;
                console.log(object.nombre,'inserted');
            });
        });
    }
});
