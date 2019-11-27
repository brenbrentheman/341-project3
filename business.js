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
            if(newDate > new Date() || newDate.getDay() === 0 || newDate.getDay() === 6) {
               return null;
            }
            var formattedValidDate = newDate.getFullYear()+'-' + (newDate.getMonth()+1) + '-'+(newDate.getDate()+1);
            return formattedValidDate;
         } catch(ex) {
            return null;
         }
   
    }

    //if the company passed in the request is not valid, return this resposne
    invalidCompanyReq(res) {
        return res.status(404).json({error: "Company provided not located"}).end();
    }

    badReq(res, msg) {
        return res.status(400).json({error: msg}).end();
    }
    
    nfReq(res, msg){
        return res.status(404).json({error: msg}).end();
    }

    serverErr(res) {
        return res.status(500).json({error: "Something went wrong!"}).end();
    }

    basicOk(res, msg) {
        return res.status(200).json({success: msg}).end();
    }

    jsonObjOk(res, json) {
        return res.status(200).json({success: json}).end();
    }

    /*Object to json conversion*/
}
