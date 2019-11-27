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

/*DEPARTMENTS REQUESTS */

/* /departments/ */
/*#3. Returns the requested list of Departments*/
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
            //make data layers
            var dl = new DataLayer(company);
            //get the department
            var depts = dl.getAllDepartment(company);

            if(!(depts.length > 0)) {
                return bl.nfReq(res, "No departments found for company")
            }

            return bl.basicOk(res, depts);
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    });
/*END DEPRTMENTS REQUESTS*/

module.exports = router;
