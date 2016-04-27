'use strict';

// Importing libraries and modules

var fs = require('fs');
var path = require('path');
require('../models/Usuario');
require('../models/Anuncio');
require('../models/Token');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var Anuncio = mongoose.model('Anuncio');
var Token = mongoose.model('Token');
var sha256 = require('sha256');
require('../lib/connection');
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
        var jsonObject = {};
        
        try{
            jsonObject = JSON.parse(data);
        }
        catch (e) {
            console.log(e);
        }

        callback(null,jsonObject);
        serie(pathList,keys,callback);
    });
}

// ********* Delete all existing rows *************

Anuncio.remove({},function () {
    console.log('Removed');
});

Usuario.remove({},function () {
    console.log('Removed');
});

Token.remove({},function () {
    console.log('Removed');
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

            var object = new Anuncio({'nombre':anuncio.nombre,
                                     'venta':anuncio.venta,
                                     'precio':anuncio.precio,
                                     'foto':anuncio.foto,
                                     'tags':anuncio.tags
                                    });
            console.log('Content of Anuncio:\n \n',object,'\n \n');
            object.save(function (err,object) {

                if (err) throw err;
                console.log(object,'inserted');
            });
        });
    // Otherwise if we read usuarios
    }else if (data.usuarios){

        data.usuarios.forEach(function(usuario){ // Take one and insert into database

            var object = new Usuario({
                'nombre':usuario.nombre,
                'email': usuario.email,
                'clave': sha256(usuario.clave)
            });
            object.save(function (err,object) {

                if (err) throw err;
                console.log(object,'inserted');
                
            });
        });
    }
});
