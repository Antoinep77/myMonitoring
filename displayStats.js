const Table = require('cli-table');
const chalk = require('chalk');

const {computeMetricsByTimeframes, computeCurrentAvailability} = require('./metrics')

var counter =0; //counter to count if the stats should be displayed for the last 10 minutes or last 60 minutes
var timeframesParams = {
    shortTermStats: {  //initially every 10s display ...
        frameNb: 5, // 5 frames ...
        timeframesLength: 120000 // of 2 minutes each
    },
    longTermStats: {  //initially every 60s display ...
        frameNb: 6, // 6 frames ...
        timeframesLength: 600000 // of 10 minutes each
    }
}

var alertThreshold = 0.8;

var isOnAlert = (websiteParams) =>{
    var alertList = websiteParams.alerts;
    return alertList.length >0 && !alertList[alertList.length-1].endingDate;
}

module.exports.displayStats= (websitesDic) => {
    
    counter = (counter +1)%6
    
    // 1 out of 6 times (every minutes because the displayStats function is called every 10 sec) print stats over 60 min
    var frameParams = (counter%6 == 0)? timeframesParams.longTermStats : timeframesParams.shortTermStats;

    //display header
    var date = new Date()
    var totalStatsTimeInMin = frameParams.frameNb*frameParams.timeframesLength/60000
    var timeAsString = (date.getHours() < 10 ? '0' : '') + date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    process.stdout.write("\n\t\t-------------------------------------\n\t\tStats for the last "+totalStatsTimeInMin+" minutes ("+timeAsString+")\n\t\t-------------------------------------\n")
    
    //display table
    for (var website in websitesDic){
        var websiteMetrics = computeMetricsByTimeframes(websitesDic[website].measures,frameParams.timeframesLength,frameParams.frameNb)
        var metricsTable = new Table({
            head: [website,...websiteMetrics[0]],
            chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
            , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
            , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
            , 'right': '' , 'right-mid': '' , 'middle': ' ' }
          });
        metricsTable.push(...websiteMetrics.slice(1));
        process.stdout.write("\n"+metricsTable+"\n")
    }

    //display alerts
    for (var website in  websitesDic){
        // current availability over last 2 minutes
        var currentAvailability = computeCurrentAvailability(websitesDic[website].measures)

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

        //display current alert
        if(isOnAlert(websitesDic[website])){
            var n =   websitesDic[website].alerts.length;
            var startingDate = websitesDic[website].alerts[n-1].startingDate
            var time = Math.round( (new Date() - startingDate)/1000)
            var message = "Website "+website+" is down. availability="+currentAvailability+", time="+time+"s\n";
            process.stdout.write(chalk.bgRed(message))
        }
    }
}

