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

### **websites*
Show the list of all monitored websites.

    websites

### **nodisplay**
Stop displaying the stats but measures are still computed.

    nodisplay

### **display**
Resume displaying the stats after having called `nodisplay`.

    display


