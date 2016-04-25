/**
 * Created by fran on 23/4/16.
 */

"use strict";

// Import modules

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sha256 = require('sha256');
var verify = require('../../../lib/jwt-verify');
var Usuario = mongoose.model('Usuario');

// GET users filtered by Usuario attributes
router.get('/',verify,function (req,res,next) {

  var query = Usuario.find({});

  query.exec(function (err,users) {
    if(err){
      err.status = 500;
      return next('ERROR_BASE_DE_DATOS');
    }
    if(users.length === 0){
      err = new Error('USUARIO_NO_ENCONTRADO');
      err.status(404);
      return next(err);
    }
    // Return: JSON with users found
    res.status(200).json({
      usuarios:users
    });
  });
});

/// POST new user to database
router.post('/new',verify,function (req,res,next) {

  // Falta validación de campos requeridos

  // Create the user
  var user = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    clave: sha256(req.body.clave)
  });

  // Save the user
  user.save(function (err,created_user) {
    if(err){
      return next(err);
    }
    // console.log(created_user,'inserted');
    // Return: JSON with created_user and a message
    res.status(200).json({
      success:{
        usuarios:[created_user],
        message: 'El usuario se ha creado correctamente'
      }
    });
  });
});

// PUT updated data to an existing Usuario
router.put('/update',verify,function (req,res,next) {
  // Search the target user
  var query = Usuario.findOne({_id:req.body._id});

  query.exec(function (err,user) {
    if(err){
      return next(err);
    }
    // Update the data of target user
    user.nombre = req.body.nombre;
    user.email = req.body.email;
    user.clave = sha256(req.body.clave);

    // Save the user with updated data
    user.save(function (err,updated_user) {
      if(err){
        err.status = 500;
        return next('ERROR_BASE_DE_DATOS');
      }
      if(updated_user.length === 0){
        err = new Error('USUARIO_NO_ENCONTRADO');
        err.status(404);
        return next(err);
      }
      // Return: JSON with the updated user and a message
      res.status(200).json({
        success:{
          usuarios:[updated_user],
          message: 'Usuario actualizado con éxito'
        }
      });
    });
  });
});

// DELETE an specific user
router.delete('/delete/:id',verify,function (req,res,next) {
  // Remove user with specified id
  Usuario.remove({_id:req.params._id}, function(err) {
    if(err){
      err.status = 500;
      return next('ERROR_BASE_DE_DATOS');
    }

    // Return: JSON with a status message
    res.status(200).json({
      success:{
        message: 'EL usuario se ha eliminado correctamente',
        status: 200
      }
    });
  });

});

// GET user specified by id
router.get('/:id',verify,function (req,res,next) {
  // Find user by id
  var query = Usuario.findOne({_id: req.params._id});
  query.exec(function (err,user) {
    if(err){
      err.status = 500;
      return next('ERROR_BASE_DE_DATOS');
    }
    if(user.length === 0){
      err = new Error('USUARIO_NO_ENCONTRADO');
      err.status(404);
      return next(err);
    }
    // Return: JSON with user found
    res.status(200).json({usuarios: [user]});
  });
});

module.exports = router;