var promisify = require("util").promisify
var request = require("request")

/* Exemple of websitesDic
websitesDic = {site1:{
    url : "www.google.com",
    interval: undefined,
    intervalDuration : 20,
    measures: [
        {   
            date:new Date(),
            responseTime :523,
            responseCode : 200,
            noResponse : false
        }
    ]
    }
}*/

var websitesDic = {}

var computeMeasure = (websiteParams) =>{
    var date = new Date();
    promisify(request.get)({ url: websiteParams.url, time: true })
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

module.exports.addWebsite = (key,url,intervalDuration, force = false) => {
    if (!force && key in websitesDic){
        throw new Error("This key is not available")
    }
    websitesDic[key] = {
        url,
        intervalDuration,
        measures : [],
        interval : setInterval(()=>computeMeasure(websitesDic[key]),intervalDuration)
    }
}

module.exports.deleteWebsite = (key) => {
    if (! key in websitesDic){
        throw new Error("No website with this key")
    }
    clearInterval(websitesDic[key].interval)
    delete websitesDic[key]
}

module.exports.getWebsitesDic = ()=> {
    return websitesDic
}

    

    