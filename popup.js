var refreshDisplayTimeout;
var bgpage = chrome.extension.getBackgroundPage();
var previousValues = [3, 5, 10, 30];
var editing = false;

document.addEventListener('DOMContentLoaded', function () {
    load();
    document.querySelector('#start').addEventListener('click', setTimer);
    document.querySelector('#cancel').addEventListener('click', reset);
    document.querySelector('#wrench').addEventListener('click', swap);
    document.querySelector('#pause').addEventListener('click', pauseTimer);
    document.querySelector('#resume').addEventListener('click', resumeTimer);
    document.querySelector('#restart').addEventListener('click', restartTimer);
});

function show(section)
{
    document.getElementById(section).style.display = "block";
}

function showInline(section)
{
    document.getElementById(section).style.display = "inline";
}

function hide(section)
{
    document.getElementById(section).style.display = "none";
}

function load()
{
    hide("settings");
    hide("modify");
    hide("resume");
    editing = false;
    
    if(bgpage.pauseDate)
    {
        showInline("resume");
        hide("pause");
    }
    
    // if timer off, show settings
	if(!bgpage.alarmDate)
	{
		// LOADS custom times IF they exist
		for(var i = 0; i < document.choices.radio.length; i++)
			if(localStorage[i] != null)
				document.getElementById("s"+i).textContent = localStorage[i];
		
		show("settings");
        hide("display");
	}
	
	// else, show countdown
	else
	{
		show("display");
        refreshDisplay();
		show("modify");
	}
}

// function autoSave(fieldNum)
// {
// 	var val = document.choices.custom[fieldNum].value;
//
// 	if(isValid(val))
// 		localStorage[fieldNum] = val;
// }

function getChoice()
{
	// find selected RADIO, RETURN selected value
	var num;
	for(var i = 0; i < document.choices.radio.length; i++)
	{
		if(document.choices.radio[i].checked == true)
			num = parseInt(document.getElementById("s"+i).textContent);
	}
	return num;
}

function swap()
{
	editing = true;
	
	// swap text with fields
	for(var i = 0; i < document.choices.radio.length; i++)
	{
		var span = document.getElementById("s"+i);
		var num = parseInt(span.textContent);
		
		previousValues[i] = num;
		
		var html = "<div class='input-append'><input class='input-mini' type='text' name='custom' id='c"+i;
		html += "' value='"+num;
		html += "'><span class='add-on'>min</span></div>";
		// used to select on click and auto save on change
        
		span.innerHTML = html;
	}
    
	// swap edit button with done button
	var butt = document.getElementById("swapper");
	butt.innerHTML = "<a href='#' id='done' class='btn'><i class='icon-ok'></i></a>";
    document.querySelector('#done').addEventListener('click', swapBack);
}

function swapBack()
{
	// swap fields with text
	for(var i = 0; i < document.choices.radio.length; i++)
	{
		var span = document.getElementById("s"+i);
		var num = parseInt(document.getElementById("c"+i).value);
		
		if(isValid(num))
        {
            localStorage[i] = num;
            span.textContent = num;
        }
		else
			span.textContent = previousValues[i];
	}
	
	// swap done button with edit button
	var butt = document.getElementById("swapper");
	butt.innerHTML = "<a href='#' id='wrench' class='btn'><i class='icon-wrench'></i></a>";
    document.querySelector('#wrench').addEventListener('click', swap);
	
	editing = false;
}

function setTimer()
{
	// make sure we're dealing with text not fields
	if(editing)
		swapBack();
	
	// SET background timer for selected number
	// HIDE settings, DISPLAY countdown
    
	var num = getChoice();
	
	// set timer, hide settings, display reset button
	if(isValid(num))
	{
		bgpage.setAlarm(num * 60000);
		hide("settings");
		show("modify");
        show("display");
		refreshDisplay();
	}
	else
		bgpage.error();
}

function isValid(amt)
{
	// 0 <= amt <= 240
	
	if(isNaN(amt) || (amt == null))
		return false;
	else if((amt < 0) || (amt > 240))
		return false;
	else
		return true;
}

function refreshDisplay()
{
    percent = bgpage.getTimeLeftPercent();
    
    if(percent < 15)
        document.getElementById("bar").style.color = "grey";
	document.getElementById("bar").textContent = bgpage.getTimeLeftString();
    document.getElementById("bar").style.width = percent + "%";
    
	refreshDisplayTimeout = setTimeout(refreshDisplay, 100);
}

function pauseTimer()
{
    hide("pause");
    showInline("resume");
    bgpage.pause();
    clearTimeout(refreshDisplayTimeout);
}

function resumeTimer()
{
    hide("resume");
    showInline("pause");
    refreshDisplay();
    bgpage.resume();
}

function restartTimer()
{
    hide("resume");
    showInline("pause");
    refreshDisplay();
    bgpage.restart();
}

function reset()
{
	clearTimeout(refreshDisplayTimeout);
	bgpage.turnOff();
	hide("display");
	show("settings");
	hide("modify");
}