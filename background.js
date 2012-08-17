var timeout;
var alarmDate;
var setDate;
var pauseDate;

function setAlarm(inMillis)
{	
	pauseDate = null;
    alarmDate = new Date();
	alarmDate.setTime(alarmDate.getTime() + inMillis);
	
	var now = new Date();
    setDate = now;
	var until = (alarmDate.getTime() - now.getTime());
	timeout = setTimeout(ring, until);
	
	chrome.browserAction.setBadgeBackgroundColor({color:[76, 187, 23, 255]});
	chrome.browserAction.setBadgeText({text: "on"});
}

function pause()
{
    pauseDate = new Date();
    clearTimeout(timeout);
    chrome.browserAction.setBadgeText({text: ""});
}

function resume()
{
    var remainingAfterPause = (alarmDate.getTime() - pauseDate.getTime());
    setAlarm(remainingAfterPause);
    
    var resumeDate = new Date();
    var timeElapsedSincePause = (resumeDate.getTime() - pauseDate.getTime());
    setDate.setTime(setDate.getTime + timeElapsedSincePause);
    pauseDate = null;
}

function restart()
{
    clearTimeout(timeout);
    var originalInterval = (alarmDate.getTime() - setDate.getTime());
    setAlarm(originalInterval);
}

function getTimeLeft()
{
    if (pauseDate)
        return (alarmDate.getTime() - pauseDate.getTime());
    
    var now = new Date();
    return (alarmDate.getTime() - now.getTime());
}

function getTimeLeftPercent()
{
    var until = getTimeLeft();
    var originalInterval = (alarmDate.getTime() - setDate.getTime());
    return parseInt(until / originalInterval * 100);
}

function getTimeLeftString()
{
    var until = getTimeLeft();
	var tSecs = parseInt(until/1000);
	var tMins = parseInt(tSecs/60);
	var secs = tSecs % 60;
	var tHrs = parseInt(tMins/60);
	var mins = tMins % 60;
	if(secs < 10)
		secs = "0" + secs;
	if(mins < 10)
		mins = "0" + mins;
	return (mins + ":" + secs);
}

function ring()
{
	var notification = webkitNotifications.createHTMLNotification('done.html');
	notification.show();
	
	alarmDate = null;
    pauseDate = null;
    setDate = null;
	chrome.browserAction.setBadgeText({text: ""});
}

function turnOff()
{
	clearTimeout(timeout);
	alarmDate = null;
    pauseDate = null;
    setDate = null;
	chrome.browserAction.setBadgeText({text: ""});
}

function error()
{
	alert("Please enter a number between 1 and 240.");
}