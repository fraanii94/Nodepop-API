/**
 * Created by fran on 23/4/16.
 */

'use strict';

// Import modules
var express = require('express');
var router = express.Router();
var Token = require('mongoose').model('Token');

// POST Create new token for a client
router.post('/new',function (req,res,next) {
    var token = new Token(req.body);

    token.save(function (err,object) {
       if(err){
           err = new Error('ERROR_BASE_DE_DATOS');
           err.status = 500;
           return next(err);
       }
        res.status(200).json({success:true,token:object});
    });
});
// PUT Update token, when an user logs in a new device
router.put('/update',function (req,res,next) {
    var condition = {usuario: req.body.email};
    Token.update(condition,req.body,function (err,token) {
        if(err){
            err = new Error('ERROR_BASE_DE_DATOS');
            err.status = 500;
            return next(err);
        }
        res.status(200).json({success:true,token:token});
    });
});

module.exports = router;