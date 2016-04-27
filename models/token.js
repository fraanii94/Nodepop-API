/**
 * Created by fran on 20/4/16.
 */
'use strict';

var mongoose = require('mongoose');

var pushTokenSchema = new mongoose.Schema({
    plataforma: {
        type: String,
        enum: ['ios', 'android'],
        required: true
    },
    token: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    }
});

mongoose.model('Token',pushTokenSchema);