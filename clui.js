var  {addWebsite, deleteWebsite, getWebsitesDic} = require("./handleWebsiteList");
var {displayAlertLogs} = require('./displayStats')

module.exports.executeCommand = (mainFunctions,commandLine) => {
    var commands = commandLine.toLowerCase().split(" ")

    try{
        //command "add websiteName websiteURL checkInterval"
        if(commands[0] == "add"){
                addWebsite(...commands.slice(1))
        }

        //command "delete websiteName"
        if(commands[0] == "delete"){
                deleteWebsite(...commands.slice(1))
        }

        //command "exit"
        if(commands[0] == "exit"){
            mainFunctions.closeApp()
        }

        //command "alerts website" display the log of all alerts for this website 
        //(if no website given display for all websites)
        if(commands[0] == "alerts"){
            displayAlertLogs(getWebsitesDic(), ...commands.slice(1))
        }

        // stop displaying the stats but measures are still computed
        if(commands[0] == "nodisplay"){
            mainFunctions.stopDisplaying()
        }

        // resume displaying the stats but measures are still computed
        if(commands[0] == "display"){
            mainFunctions.resumeDisplaying()
        }

    }catch(e){ // some commands throws errors if the website does'nt exist for example, just show their message
        process.stdout.write(e.message)
    }


}