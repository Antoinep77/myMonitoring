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

var stopDisplaying = ()=>{
    clearInterval(displayInterval);
    displayInterval = null;
}

var resumeDisplaying = ()=>{
    if (!displayInterval){
        displayInterval = setInterval(()=> {displayStats(getWebsitesDic());rl.prompt(true)},10000)
    }
}

var mainFunctions = {closeApp,stopDisplaying,resumeDisplaying};

rl.prompt()
rl.on('line', commandLine => {
    executeCommand(mainFunctions,commandLine);
    rl.prompt()
});

var displayInterval = setInterval(()=> {displayStats(getWebsitesDic());rl.prompt(true)},10000)


