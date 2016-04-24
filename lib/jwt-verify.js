/**
 * Created by fran on 24/4/16.
 */
var config = require('../config');
var jwt = require('jsonwebtoken');

var verify = function(req,res,next){
    var token = req.body.token || req.query.token ||
        req.headers['x-access-token'];
    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if(err){
            err = new Error('JWT_ERROR');
            err.status = 401;
            next(err);
        }
        req.decoded = decoded;
        next();
    });
};

module.exports = verify;