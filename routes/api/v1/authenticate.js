/**
 * Created by fran on 24/4/16.
 */
'use strict';
// Import needed modules
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var sha256 = require('sha256');
var config = require('../../../config');

// Process authentication of user
router.post('/',function (req,res,next) {

    // Get credentials inserted by the user
    var credentials = {
        email: req.body.email,
        clave: sha256(req.body.clave)
    };
    // Find user with this credentials
    Usuario.findOne(credentials,function (err,user) {
        if(err){
            console.log(err);
            return next(err);
        }
        if(!user){
            err = new Error('USUARIO_NO_ENCONTRADO');
            err.status = 404;
            return next(err);
        }
        // console.log(user);
        var token = jwt.sign(user, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });
        res.status(200).json({success:true,jwt:token});
    });
});

module.exports = router;