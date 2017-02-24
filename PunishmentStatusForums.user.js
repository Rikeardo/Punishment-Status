// ==UserScript==
// @name         Punishment status - Forums
// @version      1.0
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @match        https://hypixel.net/threads/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
//@updateURL     https://github.com/Rikeardo/Punishment-Status/raw/master/PunishmentStatusForums.user.js
// ==/UserScript==

if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Report Rule Breakers"));
{
    var content = $('.messageText').html();
    var arr = content.split('\n');
    var number = 1;
    var nameContainer = "";
    while (number <= 3)
    {

        var currentCheck = arr[number];

        if(currentCheck.includes("Reason:") === false && currentCheck.includes("reason:") === false && currentCheck.includes("Reason :") === false && currentCheck.includes("reason :") === false)
        {
            getRemoved = [" ","<b>","</b>","<br>","</br>","<ul>","</ul>","<li>","</li>",":","In-Game","Name","name","IGN","rulebreaker"];
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
        number += 1;
    }
    console.log(nameContainer);
    if(nameContainer.length > 0)
    {
        document.cookie = "banChecking='"+nameContainer+"END0FN4ME; domain=.hypixel.net;path=/";
    }

}


setInterval(function()
{
    var cookieAnswer = document.cookie;
    if(cookieAnswer.includes("banCheckingAnswer="))
    {
        document.cookie = "banCheckingAnswer=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";
        
        var start = cookieAnswer.indexOf("banCheckingAnswer=");
        var end = cookieAnswer.lastIndexOf("END0FANSW3R");
        var info = cookieAnswer.substring(start+19, end);
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
}, 200);

