# My Monitoring Console Program 

## **Installation**
The program require Node and NPM

You can install all the dependencies using the `npm install` command in the folder.
Then you can run the app with the `npm start` command.

## **Implemented features**
The user can add or delete websites to be monitored. For each website the program will send request at the frequency defined by the user. Every 10s, the app displays the computed metrics over 5 timeframes of 2 minutes, and every minute over 6 timeframes of 10 minutes.

The computed metrics are the following : the average and maximum response time over the timeframe, the availability and the counts of response codes. To improve the reactivity of the program, especially for the alerting , a request is considered unanswered if the response take more than 10s.

The alert system will print a message if a website availability is below 0.8 and a message will stay one minute after the recover of the website availability.

Finally, the program enables a test server with a configurable response rate, to test the alerting system.
To test the alerting system please run the following commands (see Test in Commands): 

    test 0.7 200
With a response rate of 0.7 the alerting system should be triggered in less than 2 minutes.
Switch to a 0.9 response rate :

    test 0.9
After 2 minutes the website should not trigger the alert system anymore.
Switch between the `test 0.7` and the `test 0.9` to continue testing the alert system.


## **Commands**

### **Exit**
Stop the program

    exit

### **Add**
Add a website to the monitoring list.

**params :**
* name
* full url
* check interval in ms (default: 100ms)

**Example** : Add a website with name google and url: http://google.fr checked every 200ms.

    add google http://google.fr 200


### **Delete**
Delete a website from the monitoring list.
**params :**
* name

**Example** : Delete the website named google.

    delete google

### **Websites**
Show the list of all monitored websites.

    websites

### **nodisplay**
Stop displaying the stats but measures are still computed.

    nodisplay

### **display**
Resume displaying the stats after having called `nodisplay`.

    display

### **Alerts**
Show alerts history for a website. If no website is given, show all alerts.

**params :**
* name

**Example** : Show all alerts for the website named test_server.

    alerts test_server

### **Test**
Use a local server to test the alerting system and add the test server to the monitored websites under the name *test_server* (if available).

If the server is already running, calling the test command again will not start a second server but will set the response rate with the new value, without changing the check interval.

**params :**
* response rate
* check interval in ms (default: 100ms)
* server port (default: 3000)

**Example 1** : Start the test_server on port 3000 with a 0.7 response rate checked every 150ms.

    test 0.7 150

**Example 2** : Assuming the server is already running, the following command will set the server's response rate to 0.9

    test 0.9

### **stoptest**
Stop the test_server but not the measures on it.

    stoptest

## **Going further**
If I continue working on this app, I would probably add a database to store all the measures or the alert computed with the app, because the app is a great tool to watch the performance of a website in real time, but it would be great to analyse the performance over a longer time too.

