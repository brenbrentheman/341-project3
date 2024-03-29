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

/*Timecard REQUESTS */

/* /timecard/ */
/*For the "timecard" path GET/POST/PUT/DELETE*/
router.route('/')
    .all(function(req, res, next) {
        //make a business layer to use in all functions\
        bl = new BusinessLayer();
        next();
    })
    /*#12. Returns the requested Timecard as a JSON String.*/
    .get(function(req, res) {
        //GET query params
        var company = req.query.company;
        var id = req.query.timecard_id;

        try {
            //check if company name is valid
            if(!bl.validateCompany(company)) {
                return bl.invalidCompanyReq(res);
            }

            //company is valid - make the data layer
            var dl = new DataLayer(company);

            //continue if valid, check if id is greater than 0 (is valid)
            if(!(id > 0)) {
                return bl.badReq(res, "Invalid timecard id provided");
            }

            var card = dl.getTimecard(id);
                
            //ensure the timecard id was valid (not null)
            if(card !== null) {
                return bl.jsonObjOk(res, card);
            } else {
                return bl.nfReq(res, "Timecard ID not found.");
            }
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }

    })
    /*#14. Returns the new Timecard as a JSON String*/
    .post(urlencodedParser, function(req, res) {
        //get the form params
        var company = req.body.company;
        var empId = parseInt(req.body.emp_id);
        var start = req.body.start_time;
        var end = req.body.end_time;

        try {

            //check if company name is valid
            if(!bl.validateCompany(company)) {
                return bl.invalidCompanyReq(res);
            }

            //make the data layer
            var dl = new DataLayer(company);

            //validate empId
            if(dl.getEmployee(empId) === null) {
                return bl.nfReq(res, "Employee could not be found.");
             }

            //get all timecards for the requested employee - to be used for validation
            var empCards = dl.getAllTimecard(empId);

            //validate start and end dates
            var timestamps = bl.buildAndValidateTimestamps(start, end, empCards);
            if(timestamps === null) {
                return bl.badReq(res, "Invalid start and/or end dates.");
            }
            
            //timestamps were valid go ahead and insert
            var newCard = dl.insertTimecard(new dl.Timecard(timestamps[0], timestamps[1], empId));
            
            //ensure the card was created successfully - if so return success
            if(newCard !== null) {
                return bl.jsonObjOk(res, newCard);
            } else {
                return bl.badReq(res, "Invalid Timecard parameters received.");
            }
        }
        catch(ex) {
            return bl.serverErr(res);
        }
    })
    /*#15. Returns the updated timecard.*/
    .put(jsonParser, function(req, res) {
        //get the company name
        var company = req.body.company;

        try {

            //check if company name is valid
            if(!bl.validateCompany(company)) {
                return bl.invalidCompanyReq(res);
            }

            //make the data layer
            var dl = new DataLayer(company);

            //first ensure we got a timecard id
            if(typeof req.body.timecard_id === "undefined") {
                return bl.badReq(res, "No timecard Id provided");
            }
            
            var id = parseInt(req.body.timecard_id);

            //get the already existing timecard
            var oldCard = dl.getTimecard(id);

            //ensure we got the old card
            if(oldCard === null) {
                return bl.nfReq(res, "Could not find timecard id provided");
            }

            //get the rest of the form parameters, if undefined then get the currently existing ones
            var empId = (typeof req.body.emp_id !== "undefined") ? parseInt(req.body.emp_id) : oldCard.getEmpId();
            var start = (typeof req.body.start_time !== "undefined") ? req.body.start_time : oldCard.getStartTime();
            var end = (typeof req.body.end_time !== "undefined") ? req.body.end_time : oldCard.getEndTime();

            oldCard.setEmpId(empId);
            oldCard.setStartTime(start);
            oldCard.setEndTime(end);

            //validate start and end dates
            var timestamps = bl.buildAndValidateTimestamps(start, end, null);
            if(timestamps === null) {
                return bl.badReq(res, "Invalid start and/or end dates.");
            }

            //update card
            var updatedCard = dl.updateTimecard(oldCard);

            //ensure card was updated successfully - if not return 400 error
            if(updatedCard === null) {
                return bl.badReq(res, "Timecard parameters are invalid and card could not be updated");
            }

            //if successful return ok
            return bl.jsonObjOk(res, updatedCard);
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    })
    /*#16. Returns the number of rows deleted.*/
    .delete(function(req, res) {
        //DELETE query params
        var company = req.query.company;
        var id = req.query.timecard_id;

        try {

            //check if company name is valid
            if(!bl.validateCompany(company)) {
                return bl.invalidCompanyReq(res);
            }

            //make business layer
            var dl = new DataLayer(company);

            //delete the timecard
            var deleted = dl.deleteTimecard(id);

            if(deleted > 0) {
                return bl.basicOk(res, "Timecard " + id + " deleted.")
            } else {
                return bl.nfReq(res, "Timecard ID not found.");
            }
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }

    });
/*End /timecard/ actions */

module.exports = router;
