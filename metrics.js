var promisify = require("util").promisify
var request = require("request")

export function createInterval(websiteDic, website_key){

    websiteParams = websiteDic[website_key]
    
    computeMetrics = () =>{
        promisify(request.get)({ url: websiteParams.url, time: true })
            .then( response => {
                var newMeasure = {
                    date: new Date(),
                    responseTime : response.elapsedTime,
                    responseCode: response.statusCode,
                    noResponse : false
                };
                websiteParams.measures.push(newMeasure)
            }).catch( err =>{
                var newMeasure = {
                    date: new Date(),
                    noResponse : true
                };
                websiteParams.measures.push(newMeasure)
            })
    }

    websiteParams.interval = setInterval(computeMetrics,  websiteParams.intervalDuration)

}