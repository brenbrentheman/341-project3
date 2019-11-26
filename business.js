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

    validateDate(date) {

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
