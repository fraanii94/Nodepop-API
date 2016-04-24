/**
 * Created by fran on 23/4/16.
 */
"use strict";

var express = require('express');
var router = express.Router();

router.get('/',function (req,res,next) {
  res.send('Raíz de usuarios');
});

router.post('/new',function (req,res,next) {
  console.log('Se ha creado un usuario');
  res.redirect('66');
});

router.put('/update',function (req,res,next) {
  console.log('Se ha actualizado un usuario');
  res.redirect('66');
});

router.delete('/delete',function (req,res,next) {
  console.log('Se ha eliminado un usuario');
  res.redirect('66');
});

router.get('/:id',function (req,res,next) {
  var err = new Error('USUARIO_NO_ENCONTRADO');
  err.status = 404;
  console.log(req.query);
  next(err);
  // res.send('Usuario ' + req.params.id);
});



module.exports = router;