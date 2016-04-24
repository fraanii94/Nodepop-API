/**
 * Created by fran on 23/4/16.
 */
"use strict";

// Import needed library
var fs = require('fs');

// Path to JSON file
var file ='public/i18n/translate.json';

// Closure to read JSON file once

var error_handler = function(){

    var data = fs.readFileSync(file); // Read content of file: string
    var translate = JSON.parse(data); // Convert it to an Object

    // Return a function that translate error key searching it in translate object
    return function(language,key){
        // console.log("Lang",language);
        // console.log("Key",key);
        return translate[language][key];
    }
};

// We export the execution of error_handler
// To save in exports the returned function
module.exports = error_handler();