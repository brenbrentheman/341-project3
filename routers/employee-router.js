var express = require('express');
var router = express.Router();
var BusinessLayer = require("../business.js");
var DataLayer = require("../companydata/index.js");
var jsonParser = express.json();
var urlencodedParser = express.urlencoded({extended:false});

/*
    Brennan Jackson
    Project 3
    ISTE 341
    Fall 2019
*/

/*Employee REQUESTS */

/* /employee/ */
/*For the "employee" path GET/POST/PUT/DELETE*/
router.route('/')
    .all(function(err, req, res, next) {
        //make a business layer to use in all functions\
        bl = new BusinessLayer();
        next();
    })
    .get(function(req, res) {

    })
    .post(urlencodedParser, function(req, res) {
        
    })
    .put(jsonParser, function(req, res) {
        
    })
    .delete(function(req, res) {
        
    });
/*End /employee/ actions */

module.exports = router;
