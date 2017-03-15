// ==UserScript==
// @name         Punishment status - Forums
// @version      0.9.2
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @icon         http://i.imgur.com/9gMGDnD.png
// @match        https://hypixel.net/threads/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      api.mojang.com
// ==/UserScript==
var key;
var nameContainer = "";
var multi_names = [];
var requesting = false;
var possible_multi = false;
var multi_i = 1;
var checked_multi = false;
var notFound = false;
var response = false;
var foundName1;
var foundName2;
var nameCurrent = 0;

if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Report Rule Breakers")||document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
{
    var content = $('.messageText').html();
    var arr = content.split('\n');
    var number = 1;
    var nameContainerAdd = "";

    var fastcheck_i = 0;
    var stopFastcheck = false;
    while (fastcheck_i + 1 <= arr.length && stopFastcheck === false)
    {
        var currentFastCheck = arr[fastcheck_i].toLowerCase();
        var fastcheckInner_i = 0;
        while(currentFastCheck.includes(" "))
        {
            currentFastCheck = currentFastCheck.replace(" ","");
        }
        fastCheckSearches = ["newign","newname","mcname:","user:","username:","in-gamenameofplayer","in-gamenamesof","in-gamenamesof","ignofhacker","ignofthehacker","hackerign:","igns:","ign(","ingamename","hacker-","player:","players:","offender:","offenders:","playername","names:","name:","names-","name-","rulebreakers","rulebreaker","theruleviolator","ign:","ign-","in-game"];
        while(fastcheckInner_i+1 <= fastCheckSearches.length && stopFastcheck === false)
        {
            if(currentFastCheck.includes(fastCheckSearches[fastcheckInner_i])&&currentFastCheck.includes("oldign")===false&&currentFastCheck.includes("oldname")===false)
            {
                number = fastcheck_i;
                stopFastcheck = true;
            }
            fastcheckInner_i += 1;
        }
        fastcheck_i += 1;
    }

    while (number <= arr.length && nameContainerAdd.length === 0)
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
            getRemoved = ["<b>","</b>","<br>","</br>","<ul>","</ul>","<li>","</li>","<i>","</i>","hello,","in-gamenameofplayer","username:","oldign","newign","oldname","newname","in-gamenamesof","in-gamenamesof","hackerign:","ignofhacker","ignofthehacker","igns:","ign(","ingamename","ingame","hacker-","player:","players:","offender:","offenders:","mcname:","user:","playername","names:","name:","names-","name-","rulebreakers","rulebreaker","theruleviolator","ign:","ign-","in-game","[vip]","[vip+]","[mvp]","[mvp+]","name(s)","(s)name","(s)",":","-","*","(",")","."];
            var current_i = 0;
            while(current_i+1 <= getRemoved.length)
            {
                while(currentCheck.includes(getRemoved[current_i]))
                {
                    currentCheck = currentCheck.replace(getRemoved[current_i],"");
                }
                current_i += 1;
            }
            if(currentCheck !== "name")
            {
                nameContainerAdd += currentCheck;
            }
        }
        else
        {
            number += 100;
        }
        number += 1;
    }
    if(nameContainerAdd.includes("["))
    {
        nameContainerAdd = nameContainerAdd.substring(0,nameContainerAdd.indexOf("["));
    }
    if(nameContainerAdd.includes("("))
    {
        nameContainerAdd = nameContainerAdd.substring(0,nameContainerAdd.indexOf("("));
    }
    if(nameContainerAdd.length === 0)
    {
        response = true;
        $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: yellow;'>Could not find the proper name or the name is incorrect.</div>").insertAfter(".pageNavLinkGroup:first");
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
        $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: black; color:white;'>You dont seem to get an answer from Goliath. Forgot to open a userinfo page?</div>").insertAfter(".pageNavLinkGroup:first");
    }
}, 15000);
}


setInterval(function()
{
    if(nameContainer.length > 0 && requesting === false)
    {
        requesting = true;
        console.log("Single name");
        key = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        console.log(key);
        var now = new Date();
        var time = now.getTime();
        time += 10 * 1000;
        now.setTime(time);
        foundName1 = nameContainer;
        nameCurrent += 1;
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.mojang.com/users/profiles/minecraft/'+nameContainer,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var mojangResponse = responseDetails.responseText;
                console.log(mojangResponse);
                if(mojangResponse !== undefined && mojangResponse.includes("\"name\""))
                {
                    var mojangAnswer = mojangResponse.substring(mojangResponse.indexOf("\"id\"")+6);
                    var mojangUUID = mojangAnswer.substring(0,mojangAnswer.indexOf("\""));
                    console.log(mojangUUID);
                    document.cookie = "banChecking"+key+"='"+mojangUUID+"END0FN4ME"+key+"; expires=" + now.toUTCString() + "; domain=.hypixel.net;path=/";
                }
                else
                {
                    response = true;
                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: yellow;'>Could not find the proper name or the name is incorrect.</div>").insertAfter(".pageNavLinkGroup:first");
                }
            }
        });

        nameContainer = "";
    }
    if(multi_i <= multi_names.length && requesting === false && multi_i < 3)
    {
        key = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        console.log(key);
        var nowMulti = new Date();
        var timeMulti = nowMulti.getTime();
        timeMulti += 10 * 1000;
        nowMulti.setTime(timeMulti);
        requesting = true;
        if(multi_i === 1)
        {
            foundName1 = multi_names[multi_i-1];
        }
        else
        {
            foundName2 = multi_names[multi_i-1];
        }

        nameCurrent += 1;
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.mojang.com/users/profiles/minecraft/'+multi_names[multi_i-1],
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetailsD) {
                var mojangResponseD = responseDetailsD.responseText;
                console.log(mojangResponseD);
                if(mojangResponseD !== undefined && mojangResponseD.includes("\"name\""))
                {
                    var mojangAnswerD = mojangResponseD.substring(mojangResponseD.indexOf("\"id\"")+6);
                    var mojangUUIDD = mojangAnswerD.substring(0,mojangAnswerD.indexOf("\""));
                    console.log(mojangUUIDD);
                    document.cookie = "banChecking"+key+"='"+mojangUUIDD+"END0FN4ME"+key+"; expires=" + nowMulti.toUTCString() + "; domain=.hypixel.net;path=/";
                }
                else
                {
                    response = true;
                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: yellow;'>Could not find the proper name or the name is incorrect.</div>").insertAfter(".pageNavLinkGroup:first");
                }
            }
        });
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
                $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: yellow;'>Could not find the proper name or the name is incorrect.</div>").insertAfter(".pageNavLinkGroup:first");
                notFound = true;
            }
        }
        else
        {
            console.log(info);

            var endName = info.indexOf("'");
            var usernameInfo = info.substring(0, endName);
            var usernamePrint = usernameInfo;
            console.log(nameCurrent);
            console.log(usernameInfo);
            console.log(foundName1);
            if(nameCurrent === 1 && usernameInfo.toLowerCase() !== foundName1)
            {
                usernamePrint += " (changed from: "+foundName1+")";
            }
            if(nameCurrent === 2 && usernameInfo.toLowerCase() !== foundName2)
            {
                usernamePrint += " (changed from: "+foundName2+")";
            }

            if(info.includes("Banned:")||info.includes("Muted:"))
            {
                var banType = "";
                if(info.includes("Banned:")&& info.includes("Muted:") === false)
                {
                    var banReasonInfo = info.substring(info.indexOf("Banned:")+7, info.lastIndexOf(","));

                    if(info.includes("Type:"))
                    {
                        banType = info.substring(info.indexOf("Type:")+5,info.lastIndexOf("$")) + " ";
                    }
                    var BDateB = "";
                    var BByB = "";
                    if(info.includes("BDate:")&&info.includes("BBy:"))
                    {
                        BDateB = info.substring(info.indexOf("BDate:")+1,info.indexOf("@B"));
                        BByB = info.substring(info.indexOf("BBy:")+1,info.indexOf("£B"));
                    }
                    console.log(BDateB);
                    console.log(BByB);
                    var innerB = "";
                    if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
                    {
                        var banDuration = "";
                        var networkLevel = "";
                        if(info.includes("€B"))
                        {
                            banDuration = info.substring(info.indexOf("Duration:")+9,info.indexOf("€B"))+" - ";
                        }
                        if(info.includes("NetworkLevel:"))
                        {
                            networkLevel = " (Level: "+info.substring(info.indexOf("NetworkLevel:")+13,info.indexOf("¤"))+")";
                        }
                        innerB = usernamePrint+networkLevel+" is "+banType+"banned for "+banDuration+"\""+banReasonInfo+"\"."+"<div style='display: block; margin:0;padding:0;'>"+BDateB+" "+BByB+"</div>";
                    }
                    else
                    {
                        innerB= usernamePrint+" is "+banType+"banned for \""+banReasonInfo+"\".";
                    }

                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+innerB+"</div>").insertAfter(".pageNavLinkGroup:first");
                }
                if(info.includes("Banned:") === false && info.includes("Muted:"))
                {
                    var muteReasonInfo = info.substring(info.indexOf("Muted:")+6, info.lastIndexOf("&"));

                    var MDateM = "";
                    var MByM = "";
                    if(info.includes("MDate:")&&info.includes("MBy:"))
                    {
                        MDateM = info.substring(info.indexOf("MDate:")+1,info.indexOf("@M"));
                        MByM = info.substring(info.indexOf("MBy:")+1,info.indexOf("£M"));
                    }
                    console.log(MDateM);
                    console.log(MByM);
                    var innerM = "";
                    if(document.getElementsByClassName("titleBar")[0].innerHTML.includes("Ban Appeal"))
                    {
                        var muteDuration = "";
                        var networkLevelM = "";
                        if(info.includes("€M"))
                        {
                            muteDuration = info.substring(info.indexOf("Duration:")+9,info.indexOf("€M"))+" - ";
                        }
                        if(info.includes("NetworkLevel:"))
                        {
                            networkLevelM = " (Level: "+info.substring(info.indexOf("NetworkLevel:")+13,info.indexOf("¤"))+")";
                        }
                        innerM = usernamePrint+networkLevelM+" is "+banType+"muted for "+muteDuration+"\""+muteReasonInfo+"\"."+"<div style='display: block; margin:0;padding:0;'>"+MDateM+" "+MByM+"</div>";
                    }
                    else
                    {
                        innerM= usernamePrint+" is "+banType+"banned for \""+muteReasonInfo+"\".";
                    }

                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+innerM+"</div>").insertAfter(".pageNavLinkGroup:first");
                }
                if(info.includes("Banned:") && info.includes("Muted:"))
                {
                    var muteReasonInfo2 = info.substring(info.indexOf("Muted:")+6, info.lastIndexOf("&"));
                    var banReasonInfo2 = info.substring(info.indexOf("Banned:")+7, info.lastIndexOf(","));
                    console.log(banReasonInfo2);

                    if(info.includes("Type:"))
                    {
                        banType = info.substring(info.indexOf("Type:")+5,info.lastIndexOf("$")) + " ";
                    }

                    $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+usernamePrint+" is "+banType+"banned for \""+banReasonInfo2+"\" and muted for \""+muteReasonInfo2+"\".</div>").insertAfter(".pageNavLinkGroup:first");
                }
            }
            else
            {
                $("<div style='height: 40px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: lightgreen;'>"+usernamePrint+" is not punished.</div>").insertAfter(".pageNavLinkGroup:first");
            }
        }

    }

}, 200);




var version = 0.92;
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
