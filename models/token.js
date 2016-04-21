/**
 * Created by fran on 20/4/16.
 */

var mongoose = require('mongoose');

var pushTokenSchema = new mongoose.Schema({
    plataforma: {
        type: String,
        enum: ['ios', 'android']
    },
    token: String,
    usuario: String
});

module.exports.Token = mongoose.model('Token',pushTokenSchema);