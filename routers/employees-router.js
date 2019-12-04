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

 /*PATH: /employees/ */
 /*#8. Returns the requested list of Employees.*/
router.route('/')
    .get(function(req, res) {
        //make the business layer
        var bl = new BusinessLayer();

        //GET query params
        var company = req.query.company;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        try {
            //make data layer
            var dl = new DataLayer(company);
            //get the employees
            var emps = dl.getAllEmployee(company);

            if(!(emps.length > 0)) {
                return bl.nfReq(res, "No employees found for company")
            }

            return bl.jsonObjOk(res, emps);
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    });
/*End /depatment/ actions */

module.exports = router;
