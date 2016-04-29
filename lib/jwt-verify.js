/**
 * Created by fran on 24/4/16.
 */
'use strict';
var config = require('../config');
var jwt = require('jsonwebtoken');

var verify = function(req,res,next){

    var token = req.headers['x-access-token'] || req.body.accessToken || req.query.accessToken;

    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if(err){
            console.log(err);
            err = new Error('JWT_ERROR');
            err.status = 401;
            return next(err);
        }
        req.decoded = decoded;
        next();
    });
};

module.exports = verify;