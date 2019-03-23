const readline = require('readline');

 var {addWebsite, getWebsiteDic} = require("./handleWebsiteList");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.prompt()

rl.on('line', (answer) => {
    if (answer == "exit") {rl.close() }

    else {
       var listCmd = answer.split(" ");
        addWebsite(...listCmd)
    }
    setInterval(()=> console.log(getWebsiteDic()["google"].measures),10000)
});

