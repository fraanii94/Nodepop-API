/**
 * Created by fran on 23/4/16.
 */

"use strict";

// Import modules
var express = require('express');
var router = express.Router();
var models = require('../models');
var verify = require('../lib/jwt-verify');

//GET all Anuncios filtered by the attributes
router.get('/',verify,function (req,res,next) {

    // Construct query
    var query = models.Anuncio.find({});
    query.sort(req.query.sort || 'nombre');

    // Execute query
    query.exec(function (err,rows) {
        if(err){
            err.status = 500;
            return next('ERROR_BASE_DE_DATOS');
        }
        if(rows.length === 0){
            err = new Error('ANUNCIO_NO_ENCONTRADO');
            err.status = 404;
            return next(err);
        }
        res.json({anuncios:rows});
    });
});

router.post('/new',function (req,res,next) {

    // Create Anuncio
    var anuncio = new models.Anuncio({
        nombre: req.body.nombre,
        venta: req.body.venta,
        precio: req.body.precio,
        foto: req.body.foto,
        tags: req.body.tags
    });
    // Save Anuncio
    anuncio.save(function (err,created_anuncio) {

        if(err){
            err.status = 500;
            return next('ERROR_BASE_DE_DATOS');
        }
        // Return: JSON with created_anuncio and a message
        res.status(200).json({
            success: {
                anuncios:[created_anuncio],
                message: 'Anuncio creado correctamente'
            }
        });
    });

});

router.put('/update',function (req,res,next) {
    // Search the target anuncio
    var query = models.Anuncio.findOne({_id:req.body._id});
    console.log(req.body);
    query.exec(function (err,anuncio) {
        if(err){
            return next(err);
        }
        console.log("pre\n",anuncio)
        // Update the data of target user
        anuncio.nombre = req.body.nombre;
        anuncio.venta = req.body.venta;
        anuncio.precio = req.body.precio;
        anuncio.foto = req.body.foto;
        anuncio.tags = req.body.tags;

        console.log("post\n",anuncio);
        // Save the anuncio with updated data
        anuncio.save(function (err,updated_anuncio) {
            console.log(updated_anuncio);
            if(err){
                err.status = 500;
                return next('ERROR_BASE_DE_DATOS');
            }
            if(updated_anuncio.length === 0){
                err = new Error('ANUNCIO_NO_ENCONTRADO');
                err.status(404);
                return next(err);
            }
            // Return: JSON with the updated anuncio and a message
            res.status(200).json({
                success:{
                    usuarios:[updated_anuncio],
                    message: 'Anuncio actualizado con éxito'
                }
            });
        });
    });
});

router.delete('/delete',function (req,res,next) {
    // Remove anuncio with specified id
    models.Anuncio.remove({_id:req.params._id}, function(err) {
        if(err){
            err.status = 500;
            return next('ERROR_BASE_DE_DATOS');
        }

        // Return: JSON with a status message
        res.status(200).json({
            success:{
                message: 'EL anuncio se ha eliminado correctamente',
                status: 200
            }
        });
    });
});

router.get('/tags',verify,function (req,res,next) {
    var query = models.Anuncio.find({});
    query.select("tags");
    query.exec(function (err,rows) {
        if(err){
            err.status = 500;
            return next('ERROR_BASE_DE_DATOS');
        }
        if(rows.length === 0){
            err = new Error('ANUNCIO_NO_ENCONTRADO');
            err.status(404);
            return next(err);
        }
        res.json({anuncios:[rows]});
    });
});

router.get('/:id',verify,function (req,res,next) {
    var query = models.Anuncio.findOne({_id:req.params._id});
    query.exec(function (err,ads) {
        if(err){
            err.status = 500;
            return next('ERROR_BASE_DE_DATOS');
        }
        if(ads.length === 0){
            err = new Error('ANUNCIO_NO_ENCONTRADO');
            err.status(404);
            return next(err);
        }
        res.json({anuncios:[ads]});
    });
});

module.exports = router;