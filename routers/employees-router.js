var express = require('express');
var router = express.Router();
var BusinessLayer = require("../business.js");
var DataLayer = require("../companydata/index.js");

/*
    Brennan Jackson
    Project 3
    ISTE 341
    Fall 2019
*/

/*Employees REQUEST */

/* /employees/ */
router.route('/')
    .get(function(req, res) {

    });
/*End /depatment/ actions */

module.exports = router;
