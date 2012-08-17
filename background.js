var timeout;
var interval;

var alarmDate;
var setDate;
var pauseDate;

var greenColor = [76, 187, 23, 255];
var yellowColor = [230, 230, 0, 255];
var guiLagAdjustment = 500;

function setAlarm(millis)
{	
	interval = millis;
	ringIn(interval + guiLagAdjustment);
}

function ringIn(millis)
{
	clearTimeout(timeout);
	pauseDate = null;
	alarmDate = new Date();
	alarmDate.setTime(alarmDate.getTime() + millis);
	
	var now = new Date();
	setDate = now;
	var until = (alarmDate.getTime() - now.getTime());
	timeout = setTimeout(ring, until);
	
	chrome.browserAction.setBadgeBackgroundColor({color:greenColor});
	chrome.browserAction.setBadgeText({text: "on"});
}

function pause()
{
    pauseDate = new Date();
    clearTimeout(timeout);
    chrome.browserAction.setBadgeBackgroundColor({color:yellowColor});
    chrome.browserAction.setBadgeText({text: "\""});
}

function resume()
{
    var remainingAfterPause = (alarmDate.getTime() - pauseDate.getTime());
    ringIn(remainingAfterPause);
}

function restart()
{
    ringIn(interval + guiLagAdjustment);
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
    return parseInt(getTimeLeft() / interval * 100);
}

function getTimeLeftString()
{
    var until = getTimeLeft();
	var tSecs = parseInt(until / 1000);
	var tMins = parseInt(tSecs / 60);
	var secs = tSecs % 60;
	var tHrs = parseInt(tMins / 60);
	var mins = tMins % 60;
	if(secs < 10) secs = "0" + secs;
	if(mins < 10) mins = "0" + mins;
	return (mins + ":" + secs);
}

function ring()
{
	var notification = webkitNotifications.createHTMLNotification('done.html');
	notification.show();
	turnOff();
}

function turnOff()
{
	clearTimeout(timeout);
	interval = 0;
	alarmDate = null;
    pauseDate = null;
    setDate = null;
	chrome.browserAction.setBadgeText({text: ""});
}

function error()
{
	alert("Please enter a number between 1 and 240.");
}