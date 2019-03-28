var promisify = require("util").promisify
var request = require("request")

/* Model of websitesDic
websitesDic = {site1:{
    url : "www.google.com",
    interval: undefined,
    intervalDuration : 20,
    measures: [{   
            date:new Date(),    // date at the start of the request
            responseTime :523,
            responseCode : 200,
            noResponse : false
        }]
    alerts : [{
            startingDate: new Date(),     //if alerts.length > 0 and alerts[alerts.length-1].endingDate == null
            endingDate: null              // then the website is on alert
        }]
    }
}*/

var websitesDic = {}

var sendRequests = (websiteParams,maxAwaitTime = 5000) =>{
    var date = new Date();
    var requestPromise = promisify(request.get)({ url: websiteParams.url, time: true });
    var timeoutPromise = new Promise((resolve,reject) => setTimeout(()=>reject("Response took too long"),maxAwaitTime))
    
    Promise.race([requestPromise,timeoutPromise])
        .then( response => {
            var newMeasure = {
                date, // date at request start
                responseTime : response.elapsedTime,
                responseCode: response.statusCode,
                noResponse : false
            };
            websiteParams.measures.push(newMeasure)
        }).catch( err =>{
            var newMeasure = {
                date,
                noResponse : true
            };
            websiteParams.measures.push(newMeasure)
        })
}

module.exports.addWebsite = (key,url,intervalDuration) => {
    if (key in websitesDic){
        throw new Error("This website's name is already given. Please delete first the website or pick an other name.")
    }
    websitesDic[key] = {
        url,
        intervalDuration,
        measures : [],
        interval : setInterval(()=>sendRequests(websitesDic[key]),intervalDuration),
        alerts:[]
    }
}

module.exports.deleteWebsite = (key) => {
    if (! (key in websitesDic)){
        throw new Error("No website with this name.")
    }
    clearInterval(websitesDic[key].interval)
    delete websitesDic[key]
}

module.exports.getWebsitesDic = ()=> {
    return websitesDic
}

    

    