const readline = require('readline');
const {displayStats} = require('./displayStats')
const {executeCommand} = require('./clui')
const {getWebsitesDic,deleteWebsite} = require("./handleWebsiteList");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var closeApp = () =>{
    rl.close(); 
    clearInterval(displayInterval);
    for(var website in getWebsitesDic()){
        deleteWebsite(website);
    }
}

rl.prompt()
rl.on('line', executeCommand.bind(undefined,closeApp));

var displayInterval = setInterval(()=> {displayStats(getWebsitesDic());rl.prompt(true)},10000)


