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
    .all(function(req, res, next) {
        //make a business layer to use in all functions\
        bl = new BusinessLayer();
        next();
    })
    /*#7. Returns the requested Employee as a JSON String*/
    .get(function(req, res) {
        //GET query params
        var company = req.query.company;
        var id = req.query.emp_id;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        //continue if valid, check if id is greater than 0 (is valid)
        if(!(id > 0)) {
            return bl.badReq(res, "Invalid employee id provided");
        }
        try {
            //dept_id is valid, continue
            var dl = new DataLayer(company);
            var emp = dl.getEmployee(id);
            if(emp !== null) {
                return bl.jsonObjOk(res, emp);
            } else {
                return bl.nfReq(res, "Could not find provided Employee Id")
            }
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    })
    /*#9. Returns the new Employee as a JSON String.*/
    .post(urlencodedParser, function(req, res) {
        //get the company name from body params
        var company = req.body.company;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        try {
            //make the datalayer
            var dl = new DataLayer(company);

            //get the rest of the parameters
            var empName = req.body.emp_name;
            var empNo = req.body.emp_no;
            var hireDate = req.body.hire_date;
            var job = req.body.job;
            var salary = parseFloat(req.body.salary);
            var deptId = parseInt(req.body.dept_id);
            var mngId = parseInt(req.body.mng_id);

            //deptId validation
            if(dl.getDepartment(company, deptId) === null) {
                return bl.badReq(res, "Department ID provided not found");
            }
            
            //manager validation
            if(!(mngId === 0 || dl.getEmployee(mngId) !== null)) {
                return bl.nfReq(res, "Manager ID provided not found");
            }

            //hire date validation
            var validDate = bl.buildAndValidateDate(hireDate);
            if(validDate === null) {
                return bl.badReq(res, "Hire Date provided is not valid");
            }

            //empNo validation
            if(!empNo.includes("-"+company)) {
                empNo = empNo += "-" + company;
            }

            //validations are completed - build the new employee
            var newEmp = dl.insertEmployee(new dl.Employee(empName, empNo, validDate, job, salary, deptId, mngId));

            if(newEmp === null) {
                return bl.badReq(res, "Employee Number or ID already exists or not all parameters provided");
            }

            //if new employee was created successfully return 200 - and emp object
            return bl.jsonObjOk(res, newEmp);
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    })
    /*#10. Returns the updated Employee as a JSON String*/
    .put(jsonParser, function(req, res) {
        //get the company name from body params
        var company = req.body.company;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        try{
            var dl = new DataLayer(company);//build the dl

            //get the dept id if comapny is valid - return bad request if not present
            var empId = req.body.emp_id;
            if(typeof empId === 'undefined') {
                return bl.badReq(res, "Employee Id Not provided")
            }

            //if dept Id is good to go, get department
            var oldEmp = dl.getEmployee(empId);

            //check to make sure dept is not null
            if(oldEmp === null) {
                return bl.nfReq(res, "Employee requested could not be found")
            }

            //we have the old employee and company is valid, get the rest of the params
            var empName = typeof req.body.emp_name !== 'undefined' ? String(req.body.emp_name) : oldEmp.getEmpName();
            var empNo = typeof req.body.emp_no !== 'undefined' ? String(req.body.emp_no) : oldEmp.getEmpNo();
            var hireDate = typeof req.body.hire_date !== 'undefined' ? bl.buildAndValidateDate(String(req.body.hire_date)) : oldEmp.getHireDate();
            var job = typeof req.body.job !== 'undefined' ? String(req.body.job) : oldEmp.getJob();
            var salary = typeof req.body.salary !== 'undefined' ? parseFloat(req.body.salary) : oldEmp.getSalary();
            var deptId = typeof req.body.dept_id !== 'undefined' ? parseInt(req.body.dept_id) : oldEmp.getDeptId();
            var mngId = typeof req.body.mng_id !== 'undefined' ? parseInt(req.body.mng_id) : oldEmp.getMngId();

            //deptId validation
            if(dl.getDepartment(company, deptId) === null) {
                return bl.badReq(res, "Department ID provided not found");
            }
            
            //manager validation
            if(!(mngId === 0 || dl.getEmployee(mngId) !== null)) {
                return bl.nfReq(res, "Manager ID provided not found");
            }

            //hire date validation 
            if(hireDate === null) {
                return bl.badReq(res, "Hire Date is nt valid");
            }

            //empNo validation
            if(!empNo.includes("-"+company)) {
                empNo = empNo += "-" + company;
            }

            //set the params in case they have been changed
            oldEmp.setEmpName(empName);
            oldEmp.setEmpNo(empNo);
            oldEmp.setHireDate(hireDate);
            oldEmp.setJob(job);
            oldEmp.setSalary(salary);
            oldEmp.setDeptId(deptId);
            oldEmp.setMngId(mngId);

            var updatedEmp = dl.updateEmployee(oldEmp);
            //if updated department is null, return bad request
            if(updatedEmp === null) {
                return bl.badReq(res, "Requested employee does not exist or duplicate employee number provided")
            }

            //if not null then successful
            return bl.jsonObjOk(res, updatedEmp);

        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    })
    .delete(function(req, res) {
        //GET query params
        var company = req.query.company;
        var empId = req.query.emp_id;

        //check if company name is valid
        if(!bl.validateCompany(company)) {
            return bl.invalidCompanyReq(res);
        }

        //continue if valid, check if id is greater than 0 (is valid)
        if(!(empId > 0)) {
            return bl.badReq(res, "Invalid employee id provided");
        }
        try {
            //dept_id is valid, continue
            var dl = new DataLayer(company);
            var deleted = dl.deleteEmployee(empId); 

            if(!(deleted > 0)) {
                return bl.nfReq(res, "Employee ID not found")
            }

            return bl.basicOk(res, "Employee " + empId + " deleted");
        }
        catch(ex) {
            console.log(ex);
            return bl.serverErr(res);
        }
    });
/*End /employee/ actions */

module.exports = router;
