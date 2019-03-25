const readline = require('readline');
const {displayStats} = require('./displayStats')

 var {addWebsite, getWebsitesDic} = require("./handleWebsiteList");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.prompt()
var i = setInterval(()=> {displayStats(getWebsitesDic());rl.prompt(true)},10000)
rl.on('line', (answer) => {
    if (answer == "exit") {rl.close(); clearInterval(i) }

    else {
       var listCmd = answer.split(" ");
        addWebsite(...listCmd)
    }

});

