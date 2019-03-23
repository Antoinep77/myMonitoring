var {createInterval} = require("./metrics")

/* Exemple of website_dic
website_dic = {site1:{
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

var websiteDic = {}

module.exports.addWebsite = function(key,url,intervalDuration, force = false){
    if (!force && key in websiteDic){
        throw new Error("This key is not available")
    }
    websiteDic[key] = {
        url,
        intervalDuration,
        measures : []
    }
    createInterval(websiteDic,key)
}

module.exports.deleteWebsite = function(key){
    if (! key in websiteDic){
        throw new Error("No website with this key")
    }
    clearInterval(websiteDic[key].interval)
    delete websiteDic[key]
}

module.exports.getWebsiteDic = function(){
    return websiteDic
}