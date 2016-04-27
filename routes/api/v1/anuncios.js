/**
 * Created by fran on 23/4/16.
 */
'use strict';

// Import modules
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var verify = require('../../../lib/jwt-verify');
var Anuncio = mongoose.model('Anuncio');

//GET all Anuncios filtered by the attributes
router.get('/',verify,function (req,res,next) {
    
    Anuncio.findCriteria(req,function (err,anuncios) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);

        }
        if(anuncios.length === 0){
            err = new Error('ANUNCIO_NO_ENCONTRADO');
            err.status = 404;
            return next(err);
        }
        res.json({success:true,anuncios:anuncios});
    });

});

router.post('/new',verify,function (req,res,next) {

    // Create Anuncio
    var anuncio = new Anuncio(req.body);
    // Save Anuncio
    anuncio.save(function (err,created_anuncio) {

        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;

            return next(err);
        }
        // Return: JSON with created_anuncio and a message
        res.status(200).json({success: true,anuncios:[created_anuncio]});
    });

});

router.put('/update',verify,function (req,res,next) {
    // Search the target anuncio
    var condition = {_id:req.body._id};
    Anuncio.update(condition,req.body,function(err,updated_anuncio) {
            console.log(updated_anuncio);
            if(err){
                err = new Error('ERROR_BASE_DE_DATOS');
                err.status = 500;
                return next(err);
            }
            if(!updated_anuncio){
                err = new Error('ANUNCIO_NO_ENCONTRADO');
                err.status(404);
                return next(err);
            }
            // Return: JSON with the updated anuncio and a message
            res.status(200).json({success:true,anuncios:[updated_anuncio]});
        });
    });

router.delete('/delete',verify,function (req,res,next) {
    // Remove anuncio with specified id
    Anuncio.remove({_id:req.params._id}, function(err) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        // Return: JSON with a status message
        res.status(200).json({success:true});
    });
});

router.get('/tags',verify,function (req,res,next) {
    var query = Anuncio.find({});
    query.select('tags');
    query.exec(function (err,rows) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        if(rows.length === 0){
            err = new Error('ANUNCIO_NO_ENCONTRADO');
            err.status(404);
            return next(err);
        }
        res.json({success:true,tags:[rows]});
    });
});

router.get('/:id',verify,function (req,res,next) {
    var query = Anuncio.findOne({_id:req.params._id});
    query.exec(function (err,ads) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        if(ads.length === 0){
            err = new Error('ANUNCIO_NO_ENCONTRADO');
            err.status(404);
            return next(err);
        }
        res.json({success:true,anuncios:[ads]});
    });
});

module.exports = router;
