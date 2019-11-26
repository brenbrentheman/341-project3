var express = require('express');
var app = express();

//Import the routers for each path
var departmentRouter = require('./routers/department-router.js');
var departmentsRouter = require('./routers/departments-router.js');

var employeeRouter = require('./routers/employee-router.js');
var employeesrouter = require('./routers/employees-router.js');

var timecardRouter = require('./routers/timecard-router.js');
var timecardsRouter = require('./routers/timecards-router.js');

var companyRouter = require('./routers/company-router.js');

var basepath = "/CompanyServices";
/*
    Brennan Jackson
    Project 3
    ISTE 341
    Fall 2019
    Service Layer
*/

/*This file starts the node server and establishes where requests should be routed*/

/*Connect app and routers*/
//company
app.use(basepath+'/company', companyRouter);
//depts
app.use(basepath+'/department', departmentRouter);
app.use(basepath+'/departments', departmentsRouter);
//emps
app.use(basepath+'/employee', employeeRouter);
app.use(basepath+'/employees', employeesrouter);
//tcs
app.use(basepath+'/timecard', timecardRouter);
app.use(basepath+'/timecards', timecardsRouter);

/*Start the server and print where it is listening*/
var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Project 3 Sever listening at http://%s:%s", host,port);
});