
module.exports.computeMetricsByTimeframes = (measures,timeframesDuration,framesNb) => {
    
    currentDate = new Date()
    var measuresGroupByTimeframes = new Array(framesNb).fill(null).map(()=>[]);
    
    for (var measure of measures){
        // find the right timeframe in which the measure should be added 
        var frameIndex = Math.floor((currentDate - measure.date)/timeframesDuration);
        
        if (frameIndex < framesNb){ // if the measure belongs to a frame
            measuresGroupByTimeframes[frameIndex].push(measure)
        }
    }

    //compute the list of metrics by timeframes
    // format to display the table with the package cli-table (see displayStats.js)
    var metricsTable = [[],["request counts"],["max response time (ms)"],["avg response time (ms)"],["availability"]]

    for (var indexFrame in measuresGroupByTimeframes){
        indexFrame = parseInt(indexFrame)
        var timeframe = measuresGroupByTimeframes[indexFrame];
        // list of time responses to compute max and avg
        var timeResponses = timeframe.map(m => m.responseTime).filter(time=>time);

        var timeframeIntervalInMin = [Math.floor(timeframesDuration/60000)*indexFrame, Math.floor(timeframesDuration/60000)*(1+indexFrame)]   
        // frame name to be displayed
        metricsTable[0].push(timeframeIntervalInMin[0]+"m-"+timeframeIntervalInMin[1]+"m ago")

        //compute request counts
        metricsTable[1].push(timeframe.length)

        //compute max response time
        metricsTable[2].push(timeResponses.length >0 ?Math.max(...timeResponses):NaN)

        //compute avg response time
        metricsTable[3].push(timeResponses.length >0 ? Math.round(timeResponses.reduce((a,b)=>a+b)/timeResponses.length):NaN)

        //compute avaibality
        var nbResponse = timeframe.filter(measure => !measure.noResponse).length
        metricsTable[4].push(+(nbResponse/timeframe.length).toFixed(4))
    }
    return metricsTable;
}

module.exports.computeCurrentAvailability = (measures) => {
    var currentDate = new Date();
    var relevantMeasures = measures.filter(measure => (currentDate - measure.date) < 120000) //keep only measures of the last 2 min
    return relevantMeasures.length>0?relevantMeasures.filter(measure => !measure.noResponse).length/relevantMeasures.length:1;
}




