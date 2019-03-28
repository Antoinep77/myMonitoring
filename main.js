const readline = require('readline');
const {displayStats} = require('./displayStats')
const {executeCommand} = require('./clui')
const {getWebsitesDic,clearAllInterval} = require("./handleWebsiteList");
const {stopTestServer} = require('./testServer')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var closeApp = () =>{
    rl.close(); 
    clearInterval(displayInterval);
    stopTestServer()
    clearAllInterval()
    process.stdout.write("App is closing\n")
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
    if (!rl.closed){
        process.stdout.write("\n")
        rl.prompt()
    }
});

var displayInterval = setInterval(()=> {displayStats(getWebsitesDic());rl.prompt(true)},10000)


