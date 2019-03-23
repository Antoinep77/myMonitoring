const readline = require('readline');
var request = require("request")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt()
    //i = setInterval(()=>{process.stdout.write("\n"+"-".repeat(70)+"\n\nte\n");    rl.prompt(true)},5000)
    rl.on('line', (answer) => {
        if (answer == "exit"){clearInterval(i);rl.close()}
        // TODO: Log the answer in a database
        else{
        util.promisify(request.get)({ url: answer, time: true })
        .then(  response => { console.log(response.elapsedTime,response.statusCode)})
        .catch(console.log)
        }
    });

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
}