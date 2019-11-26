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

/*DEPARTMENT REQUESTS */

/* /deprtment/ */
/*For the "department" path GET/POST/PUT/DELETE*/
router.route('/')
    .all(function(req, res, next) {
        bl = new BusinessLayer();
        next();
    })
    /*#2 - Returns the requested Department as a JSON String*/
    .get(function(req, res) {
        //GET query params
        var company = String(req.query.company);
        var id = req.query.dept_id;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        //continue if valid, check if id is greater than 0 (is valid)
        if(!(id > 0)) {
            return bl.badReq(res, "Invalid department id provided");
        }
        try {
            //dept_id is valid, continue
            var dl = new DataLayer(company);
            var dept = dl.getDepartment(company, id);
            if(dept !== null) {
                return bl.jsonObjOk(res, dept);
            } else {
                return bl.nfReq(res, "Could not find provided department Id")
            }
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    })
    /*#5.  Returns the new Department as a JSON String.*/
    .post(urlencodedParser, function(req, res) {
       var company = String(req.body.company);

       //check if company name is valid
       if(!bl.validateCompany(company)) {
           return bl.invalidCompanyReq(res);
        }

        try {
            var dl = new DataLayer(company);
            //get the params
            var deptName = String(req.body.dept_name);
            var deptNo = String(req.body.dept_no);
            var location = String(req.body.location);

            //Make the deptNo unique
            if(!deptNo.includes("-"+company)) {
                deptNo = deptNo += "-" + company;
            }

            //make sure parameters are set
            if(deptName !== "" && deptNo !== "-"+company && location !== "") {
                var dept = new dl.Department(company, deptName, deptNo, location);
                dept = dl.insertDepartment(dept);

                if(dept !== null) {
                    return bl.jsonObjOk(res, dept);
                } else {
                    return bl.badReq(res, "Deartment Number already exists")
                }

            } else {
                return bl.badReq(res, "Invald parameters provided");
            }
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }

    })
    /*#4. Returns the updated Department as a JSON String */
    .put(jsonParser, function(req, res) {
        var company = String(req.body.company);

       //check if company name is valid
       if(!bl.validateCompany(company)) {
           return bl.invalidCompanyReq(res);
        }

        try {
            var dl = new DataLayer(company);//build the dl

            //get the dept id if comapny is valid - return bad request if not present
            var deptId = req.body.dept_id;
            if(typeof deptId === 'undefined') {
                return bl.badReq(res, "Deptartment Id Not provided")
            }

            //if dept Id is good to go, get department
            var oldDept = dl.getDepartment(company, deptId);

            //check to make sure dept is not null
            if(oldDept === null) {
                return bl.nfReq(res, "Department requested could not be found")
            }

            //get the rest of the params
            var deptName = typeof req.body.dept_name !== 'undefined' ? String(req.body.dept_name) : oldDept.getDeptName();
            var deptNo = typeof req.body.dept_no !== 'undefined' ? String(req.body.dept_no) : oldDept.getDeptNo();
            var location = typeof req.body.location !== 'undefined' ? String(req.body.location) : oldDept.getLocation();

            oldDept.setDeptName(deptName);
            oldDept.setDeptNo(deptNo);
            oldDept.setLocation(location);

            /*dept_no validation: to ensure deptNo is unique, we check to see if it contains '-' and the company name and if not we append the company name*/
            if(!oldDept.getDeptNo().includes("-" + oldDept.getCompany())) {
                oldDept.setDeptNo(oldDept.getDeptNo() + "-" + oldDept.getCompany());
             }

            //update the department
            var updatedDept = dl.updateDepartment(oldDept);
            
            //if updated department is null, return bad request
            if(updatedDept === null) {
                return bl.badReq(res, "Requested department does not exist or duplicate department number provided")
            }

            //if not null then successful
            return bl.jsonObjOk(res, updatedDept);

        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    })
    /*#6. Returns the number of rows deleted.*/
    .delete(function(req, res) {
        //GET query params
        var company = req.query.company;
        var id = req.query.dept_id;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        //validate the department id
        if(typeof id === 'undefined' || id <= 0) {
            return bl.badReq(res, "No or improper Depratment ID provided")
        }

        try {
            var dl = new DataLayer(company);
            var rows = dl.deleteDepartment(company, id);

            //if no department deleted, return 404
            if(rows === 0) {
                return bl.nfReq(res, "Provided department does not exist for the provided company")
            }

            //if department was deleted return ok
            return bl.basicOk(res, "Department successfully deleted")
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    });
/*End /depatment/ actions */

module.exports = router;
