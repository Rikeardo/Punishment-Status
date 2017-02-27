// ==UserScript==
// @name         Punishment status - Forums
// @version      0.4
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @match        https://hypixel.net/threads/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// ==/UserScript==
var key;
if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Report Rule Breakers")||document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
{
    var content = $('.messageText').html();
    var arr = content.split('\n');
    var number = 1;
    var nameContainer = "";
    while (number <= 3)
    {
        var currentCheck = arr[number];
        currentCheck = currentCheck.toLowerCase();
        while(currentCheck.includes(" "))
        {
            currentCheck = currentCheck.replace(" ","");
        }
        if(currentCheck.includes("reason:") === false && currentCheck.includes("reason-") === false && currentCheck.includes("offence:") === false && currentCheck.includes("rank:") === false  && currentCheck.includes("screenshotofbanscreen") === false  && currentCheck.includes("whatisthereason") === false && currentCheck.includes("whywereyoubanned?") === false)
        {
            getRemoved = ["<b>","</b>","<br>","</br>","<ul>","</ul>","<li>","</li>","ingame","name","rulebreakers","rulebreaker","theruleviolator","ign:","ign-","typeofhacks","in-game","(s)",":","-","*","(",")","."];
            var current_i = 0;
            while(current_i+1 <= getRemoved.length)
            {
                while(currentCheck.includes(getRemoved[current_i]))
                {
                    currentCheck = currentCheck.replace(getRemoved[current_i],"");
                }
                current_i += 1;
            }
            nameContainer += currentCheck;
        }
        else
        {
            number += 100;
        }
        number += 1;
    }
    console.log(nameContainer);
    if(nameContainer.length > 0)
    {
        key = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        console.log(key);
        var now = new Date();
        var time = now.getTime();
        time += 10 * 1000;
        now.setTime(time);
        document.cookie = "banChecking"+key+"='"+nameContainer+"END0FN4ME"+key+"; expires=" + now.toUTCString() + "; domain=.hypixel.net;path=/";

    }

}


setInterval(function()
{
    var cookieAnswer = document.cookie;
    if(cookieAnswer.includes("answerBanChecking"+key+"="))
    {
        console.log(cookieAnswer);
        document.cookie = "answerBanChecking"+key+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";

        var startAns = cookieAnswer.indexOf("answerBanChecking"+key+"=");
        var endAns = cookieAnswer.lastIndexOf("END0FANSW3R");
        var info = cookieAnswer.substring(startAns+19+key.toString().length, endAns);

        if(info.includes("Does not exist"))
        {
            $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: yellow;'>Could not find a proper name or the name is wrong.</div>").insertAfter(".pageNavLinkGroup:first");
        }
        else
        {
            console.log(info);

            var endName = info.indexOf("'");
            var usernameInfo = info.substring(0, endName);
            if(info.includes("Banned:")||info.includes("Muted:"))
            {
                if(info.includes("Banned:")&& info.includes("Muted:") === false)
                {
                    var startBan = info.indexOf("Banned:");
                    var endBan = info.lastIndexOf(",");
                    var banReasonInfo = info.substring(startBan+7, endBan);
                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: lightcoral;'>"+usernameInfo+" is currently banned for \""+banReasonInfo+"\".</div>").insertAfter(".pageNavLinkGroup:first");
                }
                if(info.includes("Banned:") === false && info.includes("Muted:"))
                {
                    var startMute = info.indexOf("Muted:");
                    var endMute = info.lastIndexOf("&");
                    var muteReasonInfo = info.substring(startMute+6, endMute);
                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: lightcoral;'>"+usernameInfo+" is currently muted for \""+muteReasonInfo+"\".</div>").insertAfter(".pageNavLinkGroup:first");
                }
                if(info.includes("Banned:") && info.includes("Muted:"))
                {
                    var startMute2 = info.indexOf("Muted:");
                    var endMute2 = info.lastIndexOf("&");
                    var muteReasonInfo2 = info.substring(startMute2+6, endMute2);
                    var startBan2 = info.indexOf("Banned:");
                    var endBan2 = info.lastIndexOf(",");
                    var banReasonInfo2 = info.substring(startBan2+7, endBan2);
                    console.log(banReasonInfo2);
                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: lightcoral;'>"+usernameInfo+" is currently banned for \""+banReasonInfo2+"\" and muted for \""+muteReasonInfo2+"\".</div>").insertAfter(".pageNavLinkGroup:first");
                }
            }
            else
            {
                $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: lightgreen;'>"+usernameInfo+" is not punished.</div>").insertAfter(".pageNavLinkGroup:first");
            }
        }

    }
}, 200);

var version = 0.4;
var forumUpdateRequest = new XMLHttpRequest();
forumUpdateRequest.onreadystatechange = function() {
    if (forumUpdateRequest.readyState == XMLHttpRequest.DONE) {
        var updatedScriptVersion = forumUpdateRequest.responseText;
        if(version < updatedScriptVersion)
        {
            console.log("Update script");
            window.location.href = "https://github.com/Rikeardo/Punishment-Status/raw/master/PunishmentStatusForums.user.js";
        }
    }
};
forumUpdateRequest.open('GET', 'https://raw.githubusercontent.com/Rikeardo/Punishment-Status/master/ForumVersion.json', true);
forumUpdateRequest.send(null);
