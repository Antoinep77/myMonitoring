var  {addWebsite, deleteWebsite, getWebsitesDic} = require("./handleWebsiteList");
var {displayAlertLogs} = require('./displayStats')
var {startTestServer,stopTestServer} = require('./testServer')

module.exports.executeCommand = (mainFunctions,commandLine) => {
    var commands = commandLine.toLowerCase().split(" ")

    try{
        //command "add websiteName websiteURL checkInterval"
        if(commands[0] == "add"){
                addWebsite(...commands.slice(1))
        }

        //command "delete websiteName"
        else if(commands[0] == "delete"){
                deleteWebsite(...commands.slice(1))
        }

        //command "exit"
        else if(commands[0] == "exit"){
            mainFunctions.closeApp()
        }

        //command "alerts website" display the log of all alerts for this website 
        //(if no website given display for all websites)
        else if(commands[0] == "alerts"){
            displayAlertLogs(getWebsitesDic(), ...commands.slice(1))
        }

        // stop displaying the stats but measures are still computed
        else if(commands[0] == "nodisplay"){
            mainFunctions.stopDisplaying()
        }

        // resume displaying the stats 
        else if(commands[0] == "display"){
            mainFunctions.resumeDisplaying()
        }

        //command "test responseRate checkInterval serverPort " to start running the server 
        // and add the server to the websites
        // if the server is already on you may use this command to set the server's response rate
        else if(commands[0] == "test"){
            startTestServer(...commands.slice(1))
        }

        //command "stoptest" to stop the server 
        else if(commands[0] == "stoptest"){
            stopTestServer()
        }

        //show the list of the monitored websites
        else if(commands[0] == "websites"){
            var websiteDic = getWebsitesDic();
            for(var website in websiteDic){
                process.stdout.write("\n"+website+" : "+websiteDic[website].url +" checked every "+ websiteDic[website].intervalDuration+"ms")
            }
        }
        else{
            process.stdout.write("\n Command not found. The list of commands is : \n"+
            "- add\n- alerts\n- delete\n- display\n- exit\n- nodisplay\n- stoptest\n- test\n- websites\n")
        }




    }catch(e){ // some commands throws errors if the website does'nt exist for example, just show their message
        process.stdout.write(e.message)
    }


}