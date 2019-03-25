
module.exports.computeMetricsByTimeframes = (measures,timeframesDuration,framesNb) => {
    currentDate = new Date()
    measures.sort((m1, m2) => -(m1.date - m2.date)) //sort values descending
    var measuresGroupByTimeframes = [];
    var timeframeMeasures = [];
    var frameIndex = 1;
    for (var measure of measures){
        // if the measure does'nt correspond to the current time frame
        if ((currentDate - measure.date) >frameIndex*timeframesDuration){
            measuresGroupByTimeframes.push([frameIndex, timeframeMeasures])
            timeframeMeasures = []
            frameIndex = Math.floor((currentDate - measure.date)/timeframesDuration)+1;
            if (frameIndex > framesNb){
                break
            }
        }
        timeframeMeasures.push(measure);
    }
    if (frameIndex <= framesNb){
        measuresGroupByTimeframes.push([frameIndex, timeframeMeasures])
    }
    //compute the list of metrics by timeframes
    // format to display the table with the package cli-table (see displayStats.js)

    var metricsTable = [[],["request counts"],["max response time (ms)"],["avg response time (ms)"],["availability"]]

    for (var [indexFrame,timeframe] of measuresGroupByTimeframes){
        // list of time responses to compute max and avg
        var timeResponses = timeframe.map(m => m.responseTime).filter(time=>time);

        var timeframeDurationInSec = Math.floor(timeframesDuration/1000*indexFrame)        
        // frame name to be displayed
        metricsTable[0].push("last "+timeframeDurationInSec+"s")

        //compute request counts
        metricsTable[1].push(timeframe.length)

        //compute max response time
        metricsTable[2].push(Math.max(...timeResponses))

        //compute avg response time
        metricsTable[3].push(timeResponses.length >0 ? timeResponses.reduce((a,b)=>a+b)/timeResponses.length:NaN)

        //compute avaibality
        metricsTable[4].push(timeframe.filter(measure => !measure.noResponse).length/timeframe.length)
    }
    return metricsTable;
}





