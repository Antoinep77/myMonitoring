const Table = require('cli-table');
const {computeMetricsByTimeframes} = require('./metrics')



module.exports.displayStats= (websitesDic) => {
    var date = new Date()
    process.stdout.write("\n\t\t-------------------------------------\n\t\tStats for the last 10 minutes ("+date.getHours()+":"+date.getMinutes()+")\n\t\t-------------------------------------\n")
    for (var website in websitesDic){
        var websiteMetrics = computeMetricsByTimeframes(websitesDic[website].measures,120000,5)
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
}