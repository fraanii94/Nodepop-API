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

module.exports = router;