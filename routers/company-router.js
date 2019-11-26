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

/*Company REQUESTS */

/* /company/ */
/*For the "company" path DELETE*/
router.route('/')
    /*#1 - Deletes all Department, Employee and Timecard records in the database for the given company */
    .delete(function(req, res) {
        var bl = new BusinessLayer();
        var company = String(req.query.company);
        
        //validate the company name
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }
        
        //if valid company continue
        try {
            var dl = new DataLayer(company);
            dl.deleteCompany(company);
            return bl.basicOk(res, company+"'s info deleted!");
        }
        catch(ex) {
            return bl.serverErr(res);
        }
    });
/*End /company/ actions */

module.exports = router;
