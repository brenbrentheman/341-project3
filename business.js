/*
    Brennan Jackson
    Project 3
    ISTE 341
    Fall 2019
    Business Layer
*/

module.exports = class BusinessLayer {

    COMPANY_NAME = "btj9560";

    /*Make sure the company name is correct*/
    validateCompany = function(companyName) {
        
        if(String(companyName) === this.COMPANY_NAME) {
            return true;
        }

        return false;
    }

    //validate the date string passed in and return a valid date or null
    buildAndValidateDate(date) {
        try{
            var newDate = new Date(date);
            
            //make sure date is today or prior and date cannot be saturday or sunday
            if(newDate > new Date() || newDate.getUTCDay() === 0 || newDate.getUTCDay() === 6) {
               return null;
            }
            var formattedValidDate = newDate.getFullYear()+'-' + (newDate.getMonth()+1) + '-'+(newDate.getDate()+1);
            return formattedValidDate;
         } catch(ex) {
             console.log(ex);
            return null;
         }
   
    }

    /*Build and validate timestamps from the strings provided*/
    buildAndValidateTimestamps(start, end, empCards) {
        try{

            //import moment.js for date formatting
            const moment = require('moment');

            //make our starting and end dates
            var start_time = moment(start);
            var end_time = moment(end);
            const NOW = moment();
            
            //validate start time is before or at on current time/date and is less than 1 week old
            if(!((NOW.dayOfYear() - start_time.dayOfYear()) <= 7 && NOW.diff(start_time) > 0)) {
                return null;
            }

            //see if start and end are on the same day
            var sameDay = (start_time.dayOfYear() === end_time.dayOfYear());

            //Make sure the end time is at least 1 hour after the start time and the start and end fall on the same date
            if(!(moment.duration(end_time.diff(start_time)).asMinutes() > 59 && sameDay)) {
                return null;
            }

            //make sure start and end times are monday-friday
            if(start_time.day() === 0 || start_time.day() === 6 || end_time.day() === 0 || end_time.day() === 6) {
                return null;
            }

            //start and end times need to be between 6am and 6pm
            if(!(start_time.hours() >= 6 && start_time.hours() <= 17 && end_time.hours() >= 6 && end_time.hours() <= 17)) {
                return null;
            }

            //Ensure employee has no other start times on this date
            //if employee has no other time cards skip this step as its valid
            if(empCards !== null && empCards.length > 0) {
                var valid = true;
                //check each timecard
                empCards.forEach((card) => {
                    //convert to moment
                    var compare_date = moment(card.getStartTime());

                    //compare dates to ensure they are not on the same day
                    if(compare_date.isSame(start_time, 'month') && compare_date.isSame(start_time, 'day') && compare_date.isSame(start_time, 'year')) {
                        valid = false;
                    }
                });

                if(!valid) {
                    return null;
                }
            }

            //finally, if valid start and end times return them in the proper format
            return  [start_time.format('YYYY-MM-DD HH:mm:ss'), end_time.format('YYYY-MM-DD HH:mm:ss')];
        }
        catch(ex) {
            //if either start or end times are not valid retrun null
            //or if either no start or end time is passed in
            console.log(ex);
            return null;
        }
    }


    /*REQUEST FUNCTIONS - USED FOR QUICK RETURN STATEMENTS FOR DIFFERENT RESPONSE SATUSES */

    //if the company passed in the request is not valid, return this resposne
    
    //returns 404 - message: Company Not found
    invalidCompanyReq(res) {
        return res.status(404).json({error: "Company provided not located"}).end();
    }

    //returns 400 - message: provided in parameters 
    badReq(res, msg) {
        return res.status(400).json({error: msg}).end();
    }
    
    //returns 404 - message: provided in parameters 
    nfReq(res, msg){
        return res.status(404).json({error: msg}).end();
    }

    //returns 500 - message: Something went wrong (internal server error)
    serverErr(res) {
        return res.status(500).json({error: "Something went wrong!"}).end();
    }

    //returns 200 - message: success: along with provided message 
    basicOk(res, msg) {
        return res.status(200).json({success: msg}).end();
    }

    //returns 200 - message: Success: along with josn object/array of objects to return\
    //Object to json conversion is not needed, all objects passed in have public attributes which are returned
    jsonObjOk(res, json) {
        return res.status(200).json({success: json}).end();
    }

}
