/**
 * Created by fran on 23/4/16.
 */

'use strict';

// Import modules

var express = require('express');
var router = express.Router();
var sha256 = require('sha256');
var verify = require('../../../lib/jwt-verify');
var Usuario = require('mongoose').model('Usuario');

// GET users filtered by Usuario attributes
router.get('/',verify,function (req,res,next) {

  Usuario.findCriteria(req,function (err,usuarios) {
    if(err){
      err = new Error('ERROR_BASE_DE_DATOS');
      err.status = 500;
      return next(err);
    }
    if(usuarios.length === 0){
      err = new Error('USUARIO_NO_ENCONTRADO');
      err.status = 404;
      return next(err);
    }
    res.json({success:true,usuarios:usuarios});
  });
});

/// POST new user to database
router.post('/new',verify,function (req,res,next) {

  // Create the user
  var user = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    clave: req.body.clave ? sha256(req.body.clave) : null
  });

  var errors = user.validateSync();
  if (errors) {
    var err = new Error('VALIDATION_ERROR');
    err.status = 400;
    return next(err);

  }
  // Save the user
  user.save(function (err,created_user) {
    if(err){
      err = new Error('ERROR_BASE_DE_DATOS');
      err.status = 500;
      return next(err);
    }
    // console.log(created_user,'inserted');
    // Return: JSON with created_user
    res.status(200).json({success:true, usuarios:[created_user]});
  });
});

// PUT updated data to an existing Usuario
router.put('/update',verify,function (req,res,next) {
  // Search the target user
  var condition = {_id:req.body._id};
  Usuario.update(condition,req.body,function (err,updated_user) {
      if(err){
        err = new Error('ERROR_BASE_DE_DATOS');
        err.status = 500;
        return next(err);
      }
      if(updated_user.length === 0){
        err = new Error('USUARIO_NO_ENCONTRADO');
        err.status = 404;
        return next(err);
      }
      // Return: JSON with the updated user
      res.status(200).json({success:true, usuarios:[updated_user]});
    });
  });


// DELETE an specific user
router.delete('/delete/:id',verify,function (req,res,next) {
  // Remove user with specified id
  Usuario.remove({_id:req.params._id}, function(err) {
    if(err){
      err = new Error('ERROR_BASE_DE_DATOS')
      err.status = 500;
      return next(err);
    }

    // Return: JSON with a status message
    res.status(200).json({success:true});
  });

});

// GET user specified by id
router.get('/:id',verify,function (req,res,next) {
  // Find user by id
  var query = Usuario.findOne({_id: req.params._id});
  query.exec(function (err,user) {
    if(err){
      err = new Error('ERROR_BASE_DE_DATOS');
      err.status = 500;
      return next(err);
    }
    if(!user){
      err = new Error('USUARIO_NO_ENCONTRADO');
      err.status = 404;
      return next(err);
    }
    // Return: JSON with user found
    res.status(200).json({success:true,usuarios: [user]});
  });
});

module.exports = router;