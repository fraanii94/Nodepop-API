/**
 * Created by fran on 20/4/16.
 */

var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({
    plataforma: {
        type: String,
        enum: ['ios', 'android']
    },
    token: String,
    usuario: String
});

mongoose.model('Token',pushTokenSchema);