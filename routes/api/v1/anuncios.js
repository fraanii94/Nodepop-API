/**
 * Created by fran on 23/4/16.
 */
'use strict';

// Import modules
var express = require('express');
var router = express.Router();
var Anuncio = require('mongoose').model('Anuncio');

//GET all Anuncios filtered by the attributes
router.get('/',function (req,res,next) {
    
    Anuncio.findCriteria(req,function (err,anuncios) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        res.json({success:true,anuncios:anuncios});
    });
});

router.post('/new',function (req,res,next) {
    var params = req.body;
    params.tags = params.tags && params.tags.split(",");

    // Create Anuncio
    var anuncio = new Anuncio(params);

    var errors = anuncio.validateSync();
    if (errors) {
        console.log(errors);
        var err = new Error('VALIDATION_ERROR');
        err.status = 400;
        return next(err);

    }
    // Save Anuncio
    anuncio.save(function (err,created_anuncio) {

        if(err){
            console.log(err);
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;

            return next(err);
        }
        // Return: JSON with created_anuncio keeping same JSON format
        res.status(200).json({success: true,anuncios:[created_anuncio]});
    });

});

router.delete('/delete',function (req,res,next) {

    // Remove anuncio with specified id
    Anuncio.remove({_id:req.body._id}, function(err) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        res.status(200).json({success:true});
    });
});

router.get('/tags',function (req,res,next) {
    var query = Anuncio.find({});
    query.select('tags');
    query.exec(function (err,rows) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        res.json({success:true,tags:rows});
    });
});

router.get('/:_id',function (req,res,next) {
    var query = Anuncio.findOne({_id:req.params._id});
    query.exec(function (err,ads) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        // Return an array to keep the same structure of json
        res.json({success:true,anuncios:[ads]});
    });
});

module.exports = router;
