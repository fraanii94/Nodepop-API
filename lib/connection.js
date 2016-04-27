/**
 * Created by fran on 24/4/16.
 */
'use strict';

var mongoose = require('mongoose');
var conn = mongoose.connection;
var config = require('../config');

conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function() {
    console.info('Connected to mongodb.');
});
mongoose.connect(config.database);

