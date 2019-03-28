const express = require('express')
const app = express()

var {getWebsitesDic,addWebsite} = require("./handleWebsiteList")

var serverIsOn = false;
var responseRate =1;

app.get('/', function (req, res) {
    if (Math.random()<responseRate){
        res.json(true)
    }
})

module.exports.startTestServer = (newResponseRate =1, checkInterval=100, port =3000 ) =>{
    responseRate = newResponseRate
    if (!serverIsOn){
        serverIsOn = true
        app.listen(port, function () {
            process.stdout.write('Test Server listening on port '+port+'!')
        })
        if(!("test_server" in getWebsitesDic())){
            addWebsite("test_server","http://localhost:"+port,checkInterval)
        }
    }
}

module.exports.stopTestServer = () =>{
    if (serverIsOn){
        serverIsOn = false
        app.close()
    }
}
