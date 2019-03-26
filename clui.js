var  {addWebsite, deleteWebsite} = require("./handleWebsiteList");


module.exports.executeCommand = (closeApp,commandLine) => {
    var commands = commandLine.toLowerCase().split(" ")

    //command "add websiteName websiteURL checkInterval"
    if(commands[0] == "add"){
        try{
            addWebsite(...commands.slice(1))
        }catch(e){
            process.stdout.write(e.message)
        }
    }

    //command "delete websiteName"
    if(commands[0] == "delete"){
        try{
            deleteWebsite(...commands.slice(1))
        }catch(e){
            process.stdout.write(e.message)
        }
    }

    //command "exit"
    if(commands[0] == "exit"){
        closeApp()
    }




}