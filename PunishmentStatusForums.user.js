// ==UserScript==
// @name         Punishment status - Forums
// @version      0.8.1
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @icon         http://i.imgur.com/9gMGDnD.png
// @match        https://hypixel.net/threads/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// ==/UserScript==
var key;
var nameContainer = "";
var multi_names = [];
var requesting = false;
var possible_multi = false;
var multi_i = 0;
var checked_multi = false;
var notFound = false;
var response = false;

if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Report Rule Breakers")||document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
{
    var content = $('.messageText').html();
    var arr = content.split('\n');
    var number = 1;
    var nameContainerAdd = "";

    while (number <= 5 && nameContainerAdd.length === 0)
    {
        var currentCheck = arr[number];
        currentCheck = currentCheck.toLowerCase();
        if(currentCheck.includes(" and "))
        {
            possible_multi = true;
            console.log("and multi");
        }
        while(currentCheck.includes(" "))
        {
            currentCheck = currentCheck.replace(" ","");
        }
        if(currentCheck.includes("reason:") === false && currentCheck.includes("reason-") === false && currentCheck.includes("hacks:") === false && currentCheck.includes("time:") === false && currentCheck.includes("typeofhacks:") === false && currentCheck.includes("offence:") === false && currentCheck.includes("rank:") === false  && currentCheck.includes("screenshotof") === false  && currentCheck.includes("whatisthereason") === false && currentCheck.includes("whywereyoubanned?") === false)
        {
            getRemoved = ["<b>","</b>","<br>","</br>","<ul>","</ul>","<li>","</li>","hello,","player:","offender:","mcname:","user:","username:","oldign","ignofhacker","ignofthehacker","igns:","ign(","ingame","hacker-","playername","names","name","rulebreakers","rulebreaker","theruleviolator","ign:","ign-","in-game","(s)",":","-","*","(",")","."];
            var current_i = 0;
            while(current_i+1 <= getRemoved.length)
            {
                while(currentCheck.includes(getRemoved[current_i]))
                {
                    currentCheck = currentCheck.replace(getRemoved[current_i],"");
                }
                current_i += 1;
            }
            nameContainerAdd += currentCheck;
        }
        else
        {
            number += 100;
        }
        number += 1;
    }
    nameContainer = nameContainerAdd;
    console.log(nameContainer);
    if(nameContainer.includes(",")||nameContainer.includes("&")||nameContainer.includes("+"))
    {
        console.log("Multiple names");
        console.log(nameContainer);
        var namesContainer = nameContainer;
        nameContainer = "";
        if(namesContainer.includes(","))
        {
            multi_names = namesContainer.split(",");
        }
        if(namesContainer.includes("&"))
        {
            multi_names = namesContainer.split("&amp;");
        }
        if(namesContainer.includes("+"))
        {
            multi_names = namesContainer.split("+");
        }
        console.log(multi_names);
    }
    if(possible_multi && nameContainer.includes("and"))
    {
        console.log("Multiple names");
        console.log(nameContainer);
        var namesContainer = nameContainer;
        nameContainer = "";
        multi_names = namesContainer.split("and");
    }
setTimeout(function()
{
    if(response === false)
    {
        $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: black; color:white;'>You dont seem to get an answer from Goliath. Forgot to open the userinfo page?</div>").insertAfter(".pageNavLinkGroup:first");
    }
}, 15000);
}


setInterval(function()
{
    if(nameContainer.length > 0 && requesting === false)
    {
        console.log("Single name");
        key = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        console.log(key);
        var now = new Date();
        var time = now.getTime();
        time += 10 * 1000;
        now.setTime(time);
        requesting = true;
        document.cookie = "banChecking"+key+"='"+nameContainer+"END0FN4ME"+key+"; expires=" + now.toUTCString() + "; domain=.hypixel.net;path=/";
        nameContainer = "";
    }
    if(multi_i + 1 <= multi_names.length && requesting === false && multi_i +1 < 3)
    {
        key = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        console.log(key);
        var nowMulti = new Date();
        var timeMulti = nowMulti.getTime();
        timeMulti += 10 * 1000;
        nowMulti.setTime(timeMulti);
        requesting = true;
        document.cookie = "banChecking"+key+"='"+multi_names[multi_i]+"END0FN4ME"+key+"; expires=" + nowMulti.toUTCString() + "; domain=.hypixel.net;path=/";
        multi_i += 1;
    }

    var cookieAnswer = document.cookie;
    if(cookieAnswer.includes("answerBanChecking"+key+"="))
    {
        response = true;
        console.log(cookieAnswer);
        document.cookie = "answerBanChecking"+key+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";

        var startAns = cookieAnswer.indexOf("answerBanChecking"+key+"=");
        var endAns = cookieAnswer.lastIndexOf("END0FANSW3R");
        var info = cookieAnswer.substring(startAns+19+key.toString().length, endAns);

        requesting = false;

        if(info.includes("Does not exist"))
        {
            if(notFound === false)
            {
                $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: yellow;'>Could not find the proper name or the name is wrong.</div>").insertAfter(".pageNavLinkGroup:first");
                notFound = true;
            }
        }
        else
        {
            console.log(info);

            var endName = info.indexOf("'");
            var usernameInfo = info.substring(0, endName);
            if(info.includes("Banned:")||info.includes("Muted:"))
            {
                var banType = "";
                if(info.includes("Banned:")&& info.includes("Muted:") === false)
                {
                    var startBan = info.indexOf("Banned:");
                    var endBan = info.lastIndexOf(",");
                    var banReasonInfo = info.substring(startBan+7, endBan);

                    if(info.includes("Type:"))
                    {
                        var startType = info.indexOf("Type:");
                        var endType = info.lastIndexOf("$");
                        banType = info.substring(startType+5,endType) + " ";
                    }
                    var BDateB = "";
                    var BByB = "";
                    if(info.includes("BDate:")&&info.includes("BBy:"))
                    {
                        var startBDateB = info.indexOf("BDate:");
                        var endBDateB = info.indexOf("@B");
                        BDateB = info.substring(startBDateB+1,endBDateB);

                        var startBByB = info.indexOf("BBy:");
                        var endBByB = info.indexOf("£B");
                        BByB = info.substring(startBByB+1,endBByB);
                    }
                    console.log(BDateB);
                    console.log(BByB);
                    var extraB = "";
                    if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
                    {
                        extraB = "<div style='display: block; margin:0;padding:0;'>"+BDateB+" "+BByB+"</div>";
                    }

                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+usernameInfo+" is currently "+banType+"banned for \""+banReasonInfo+"\"."+extraB+"</div>").insertAfter(".pageNavLinkGroup:first");
                }
                if(info.includes("Banned:") === false && info.includes("Muted:"))
                {
                    var startMute = info.indexOf("Muted:");
                    var endMute = info.lastIndexOf("&");
                    var muteReasonInfo = info.substring(startMute+6, endMute);

                    var MDateM = "";
                    var MByM = "";
                    if(info.includes("MDate:")&&info.includes("MBy:"))
                    {
                        var startMDateM = info.indexOf("MDate:");
                        var endMDateM = info.indexOf("@M");
                        MDateM = info.substring(startMDateM+1,endMDateM);

                        var startMByM = info.indexOf("MBy:");
                        var endMByM = info.indexOf("£M");
                        MByM = info.substring(startMByM+1,endMByM);
                    }
                    console.log(MDateM);
                    console.log(MByM);
                    var extraM = "";
                    if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
                    {
                        extraM = "<div style='display: block; margin:0;padding:0;'>"+MDateM+" "+MByM+"</div>";
                    }

                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+usernameInfo+" is currently muted for \""+muteReasonInfo+"\"."+extraM+"</div>").insertAfter(".pageNavLinkGroup:first");
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

                    if(info.includes("Type:"))
                    {
                        var startBothType = info.indexOf("Type:");
                        var endBothType = info.lastIndexOf("$");
                        banType = info.substring(startBothType+5,endBothType) + " ";
                    }

                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+usernameInfo+" is currently "+banType+"banned for \""+banReasonInfo2+"\" and muted for \""+muteReasonInfo2+"\".</div>").insertAfter(".pageNavLinkGroup:first");
                }
            }
            else
            {
                $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: lightgreen;'>"+usernameInfo+" is not punished.</div>").insertAfter(".pageNavLinkGroup:first");
            }
        }

    }

}, 200);

var version = 0.81;
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
