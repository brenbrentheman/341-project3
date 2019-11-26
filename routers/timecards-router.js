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

/*Timecards REQUEST */

/* /timecards/ */
router.route('/')
    .get(function(req, res) {

    });
/*End /timecards/ actions */

module.exports = router;
