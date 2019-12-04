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

/* PATH: /timecards/ */
router.route('/')
/*#13. Returns the requested list of Timecards*/
    .get(function(req, res) {
        //make the business layer
        var bl = new BusinessLayer();

        //GET query params
        var company = req.query.company;
        var empId = parseInt(req.query.emp_id);

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        try {
            //make data layer
            var dl = new DataLayer(company);
            
            if(dl.getEmployee(empId) != null) {
            
                var cards = dl.getAllTimecard(empId);
                
                if(cards.length > 0) {
                   
                   return bl.jsonObjOk(res, cards);
                   
                } else {
                   return bl.nfReq(res, "No timecards found for requested employee");
                }
             } else {
                return bl.nfReq(res, "Employee ID Not Found");
             }

        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    });
/*End /timecards/ actions */

module.exports = router;
