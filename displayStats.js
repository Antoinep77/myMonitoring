const Table = require('cli-table');
const chalk = require('chalk');

const {computeMetricsByTimeframes, computeCurrentAvailability} = require('./metrics')

//counter to count if the stats should be displayed for the last 10 minutes or last 60 minutes
var counter =0; 
//timeframes params used in displayTable 
var timeframesParams = {
    shortTermStats: {  //initially every 10s display ...
        frameNb: 5, // 5 frames ...
        timeframesLength: 120000 // of 2 minutes each
    },
    longTermStats: {  //initially every minute display ...
        frameNb: 6, // 6 frames ...
        timeframesLength: 600000 // of 10 minutes each
    }
}

const displayTableAndHeader = (websitesDic) => {
    counter = (counter +1)%6
    // 1 out of 6 times (every minutes because the displayStats function is called every 10 sec) print stats over 60 min
    var frameParams = (counter%6 == 0)? timeframesParams.longTermStats : timeframesParams.shortTermStats;

     //display header
     var date = new Date()
     var totalStatsTimeInMin = frameParams.frameNb*frameParams.timeframesLength/60000
     var timeAsString = (date.getHours() < 10 ? '0' : '') + date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
     process.stdout.write("\n\t\t-------------------------------------\n\t\tStats for the last "+totalStatsTimeInMin+" minutes ("+timeAsString+")\n\t\t-------------------------------------\n")   

    //display table for each website
    for (var website in websitesDic){
        var [websiteMetrics,responseCodeCounts] = computeMetricsByTimeframes(websitesDic[website].measures,frameParams.timeframesLength,frameParams.frameNb)
        var metricsTable = new Table({
            head: [website,...websiteMetrics[0]],
            chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '', 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
            , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '', 'right': '' , 'right-mid': '' , 'middle': ' ' }
          });
        metricsTable.push(...websiteMetrics.slice(1));
        process.stdout.write("\n"+metricsTable+"\n")
        var responseCodesToString = Object.keys(responseCodeCounts).reduce((previous,key)=>{
            return previous+key+": "+responseCodeCounts[key]+", "
        },"").slice(0,-2)
        process.stdout.write("Response code counts over all timeframes "+responseCodesToString+"\n")
    }
}

const alertThreshold = 0.8;
const isOnAlert = (websiteInfo) => {
    var n = websiteInfo.alerts.length
    return n>0 && !websiteInfo.alerts[n-1].endingDate
}

const displayAlerts = (websitesDic) => {
    for (var website in  websitesDic){
        // current availability over last 2 minutes
        var currentAvailability = computeCurrentAvailability(websitesDic[website].measures)

        //update the alert list of the site
        // if not on alert and availability below threshold add an alert
        if( !isOnAlert(websitesDic[website]) && currentAvailability< alertThreshold){ 
            websitesDic[website].alerts.push({
                startingDate: new Date(),   
                endingDate: null   
            })
        }
        // if on alert and availability above threshold set endingDate of the alert (website not on alert anymore)
        if( isOnAlert(websitesDic[website]) && currentAvailability > alertThreshold){ 
            var n =   websitesDic[website].alerts.length;
            websitesDic[website].alerts[n-1].endingDate = new Date()
        }

        //display resolved alerts for the next minute
        var n =   websitesDic[website].alerts.length;
        if(!isOnAlert(websitesDic[website]) && websitesDic[website].alerts.length>0 && (new Date() - websitesDic[website].alerts[n-1].endingDate)<60000 ){
            var lastAlert = websitesDic[website].alerts[n-1]
            var time = Math.round( (lastAlert.endingDate - lastAlert.startingDate)/1000)
            var message = "Website "+website+" was down for "+time+"s less than one minute ago.\n";
            process.stdout.write(message)
        }
        //display alert if the website is on alert
        if(isOnAlert(websitesDic[website])){
            var n =   websitesDic[website].alerts.length;
            var startingDate = websitesDic[website].alerts[n-1].startingDate
            var time = Math.round( (new Date() - startingDate)/1000)
            var message = "Website "+website+" is down. availability="+currentAvailability+", time="+time+"s\n";
            process.stdout.write(chalk.bgRed(message))
        }
    }
}

//the function called every 10s to display the website stats
module.exports.displayStats= (websitesDic) => {
    displayTableAndHeader(websitesDic);
    process.stdout.write("\n")
    displayAlerts(websitesDic);
}

//display all the alerts for a website (if no website given display all alerts)
module.exports.displayAlertLogs = (websitesDic,website = null) =>{
    if (website && !(website in websitesDic)){
        throw new Error("No website with this name.")
    }

    if (!website){
        var alertList = []
        for(var w in websitesDic){
            websitesDic[w].alerts.map(alert => alertList.push(alert))
        }
    }else{
        var alertList =  websitesDic[website].alerts
    }
    //sort by date
    alertList.sort((a,b) => a.startingDate < b.startingDate)

    //display alerts
    process.stdout.write("\n")
    for(var alert of alertList){
        var timeAsString = (alert.startingDate.getHours() < 10 ? '0' : '') + alert.startingDate.getHours()+":"+(alert.startingDate.getMinutes() < 10 ? '0' : '') + alert.startingDate.getMinutes();
        var duration = Math.round((alert.endingDate - alert.startingDate)/1000)
        process.stdout.write("Alert occurerd at "+timeAsString+" for "+duration+"s.")

    }
}
