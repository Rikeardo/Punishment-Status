// ==UserScript==
// @name         Punishment status - Forums
// @version      1.0.4
// @description  Check if a player is currently punished on the server from forums
// @author       _Rikardo_
// @icon         http://i.imgur.com/9gMGDnD.png
// @include      https://hypixel.net/threads/*
// @include      https://goliath.hypixel.net/userinfo?*
// @include      https://goliath.hypixel.net/userinfo#*
// @include      https://goliath.hypixel.net/userinfo
// @include      https://hypixel.net/search*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      api.mojang.com
// ==/UserScript==
var url = window.location.href;
var usernamePrint = "";

var version = 1.04;
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

if(url.includes("https://goliath.hypixel.net/userinfo"))
{
    setInterval(function()
                {
        var cookie = document.cookie;

        if(cookie.includes("loadedBanChecking"))
        {
            var startForumKeyLoaded = cookie.indexOf("loadedBanChecking");
            var forumKeyLoaded = cookie.substring(startForumKeyLoaded+17, startForumKeyLoaded+22);
            console.log(forumKeyLoaded);

            var usernameLoaded = cookie.substring(cookie.lastIndexOf("loadedBanChecking"+forumKeyLoaded+"=")+19+forumKeyLoaded.toString().length, cookie.lastIndexOf("END0FL0AD3D"+forumKeyLoaded));
            console.log(usernameLoaded);
            if(document.body.innerHTML.includes("Network Level"))
            {
                if(document.getElementsByClassName("uk-width-1-4")[0].innerHTML.includes(usernameLoaded))
                {
                    document.cookie = "loadedBanChecking"+forumKeyLoaded+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";
                    var muteReason = "";
                    var banReason = "";
                    var banType = "";
                    var byBans = "";
                    var byMutes = "";
                    var dateBan = "";
                    var dateMute = "";
                    var lengthB = "";
                    var lengthM = "";
                    var networkLevel = "";
                    var bans = document.getElementsByClassName("uk-width-1-4")[1].innerHTML;
                    var mutes = document.getElementsByClassName("uk-width-1-4")[3].innerHTML;

                    if(bans.includes("Current Ban"))
                    {
                        var startBanCut = bans.indexOf("<br>");
                        var endBanCut = bans.indexOf("By:");
                        var cutBan = bans.substring(startBanCut+5, endBanCut);

                        var endBanReason = cutBan.indexOf("<br>");

                        var startTypeBan = cutBan.indexOf("Type:");
                        var endTypeBan = cutBan.lastIndexOf("<br>");
                        var banTypeG = cutBan.substring(startTypeBan+6,endTypeBan).toLowerCase();

                        var dateBans = bans.substring(bans.indexOf("Date:"),bans.length);
                        var endDateBan = dateBans.indexOf("<br><br>");
                        dateBan = "B"+dateBans.substring(0,endDateBan)+"@B ";
                        console.log(dateBan);

                        if(banTypeG === "permanent")
                        {
                            banType = "Type:permanently$";
                            var startByBans = bans.indexOf("By:");
                            var endByBans = bans.indexOf("<br>\n<br>");
                            byBans = "B"+bans.substring(startByBans,endByBans)+"£B ";
                        }
                        else if(banTypeG === "temporary")
                        {
                            banType = "Type:temporarily$";
                            var startByBans2 = bans.indexOf("By:");
                            var endByBans2 = bans.indexOf("<br>\nExpires:");
                            byBans = "B"+bans.substring(startByBans2,endByBans2)+"£B ";

                            var uncutLengthB = bans.substring(bans.indexOf("TempBan"),bans.indexOf("Date:"));
                            lengthB = "Duration:"+uncutLengthB.substring(uncutLengthB.indexOf(" for ")+5,uncutLengthB.indexOf("<br>"))+"€B";
                            console.log(lengthB);
                        }
                        console.log(byBans);
                        console.log(banType);
                        banReason = "Banned:" + cutBan.substring(8, endBanReason)+",";

                        console.log(banReason);
                    }
                    if(mutes.includes("Current Mute"))
                    {
                        var startMuteCut = mutes.indexOf("<br>");
                        var endMuteCut = mutes.indexOf("By:");
                        var cutMute = mutes.substring(startMuteCut+5, endMuteCut);

                        var endMuteReason = cutMute.indexOf("<br>");
                        muteReason = "Muted:" + cutMute.substring(8, endMuteReason) + "&";
                        console.log(muteReason);

                        var dateMutes = mutes.substring(mutes.indexOf("Date:"),mutes.length);
                        var endDateMute = dateMutes.indexOf("<br>");
                        dateMute = "M"+dateMutes.substring(0,endDateMute)+"@M ";
                        console.log(dateMute);

                        var startByMutes = mutes.indexOf("By:");
                        var endByMutes = mutes.indexOf("<br>\nExpires:");
                        byMutes = "M"+mutes.substring(startByMutes,endByMutes)+"£M ";
                        console.log(byMutes);
                        var uncutLengthM = mutes.substring(mutes.indexOf("Mute by"),mutes.indexOf("Reason:")[1]);
                        lengthM = "Duration:"+uncutLengthM.substring(uncutLengthM.indexOf(" for ")+5,uncutLengthM.indexOf("<br>"))+"€M";
                        console.log(lengthM);

                    }
                    if(mutes.includes("Current Mute")||bans.includes("Current Ban"))
                    {
                        var userInfo = document.getElementsByClassName("uk-width-1-4")[0].innerHTML;
                        networkLevel = "NetworkLevel:"+userInfo.substring(userInfo.indexOf("Network Level")+15,userInfo.indexOf("First Login")-9)+"¤";
                        console.log(networkLevel);
                    }
                    var nowG = new Date();
                    var timeG = nowG.getTime();
                    timeG += 10 * 1000;
                    nowG.setTime(timeG);
                    document.cookie = "answerBanChecking"+forumKeyLoaded+"='"+/([A-Za-z0-9_]{1,16})$/.exec($("#columnx > font:first-of-type").text())[1]+ "'"+banReason+dateBan+byBans+banType+lengthB+muteReason+dateMute+byMutes+lengthM+networkLevel+"END0FANSW3R; expires=" + nowG.toUTCString() +"; domain=.hypixel.net;path=/";
                }
                else
                {
                    window.location.href = "https://goliath.hypixel.net/userinfo?uuid="+usernameLoaded;
                }
            }
            else
            {
                console.log("Invalid page");
                var nowGA = new Date();
                var timeGA = nowGA.getTime();
                timeGA += 10 * 1000;
                nowGA.setTime(timeGA);
                document.cookie = "loadedBanChecking"+forumKeyLoaded+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";
                document.cookie = "answerBanChecking"+forumKeyLoaded+"='Does not existEND0FANSW3R; expires=" + nowGA.toUTCString() +"; domain=.hypixel.net;path=/";
                window.location.href = "https://goliath.hypixel.net/userinfo";
            }
        }
        else if(cookie.includes("banChecking"))
        {

            var startKeyCode = cookie.indexOf("banChecking");
            var keyCode = cookie.substring(startKeyCode+11, startKeyCode+16);
            console.log(keyCode);

            document.cookie = "banChecking"+ keyCode +"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";
            var username = cookie.substring(cookie.lastIndexOf("banChecking"+keyCode+"=")+13+keyCode.toString().length, cookie.lastIndexOf("END0FN4ME"+keyCode));
            console.log(username);

            var nowGol = new Date();
            var timeGol = nowGol.getTime();
            timeGol += 10 * 1000;
            nowGol.setTime(timeGol);
            document.cookie = "loadedBanChecking"+keyCode+"='"+username+ "END0FL0AD3D"+keyCode+"; expires=" + nowGol.toUTCString() +"; domain=.hypixel.net;path=/";
            window.location.href = "https://goliath.hypixel.net/userinfo?uuid=" + username;
        }
    }, 600);
}
else if(url.includes("https://hypixel.net/threads/"))
{
    var key;
    var nameContainer = "";
    var multi_names = [];
    var requesting = false;
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
                currentCheck = currentCheck.replace(" and ",",");
            }
            while(currentCheck.includes(" "))
            {
                currentCheck = currentCheck.replace(" ","");
            }
            if(currentCheck.includes("reason:") === false && currentCheck.includes("reason-") === false && currentCheck.includes("hacks:") === false && currentCheck.includes("time:") === false && currentCheck.includes("typeofhacks:") === false && currentCheck.includes("offence:") === false && currentCheck.includes("rank:") === false  && currentCheck.includes("screenshotof") === false  && currentCheck.includes("whatisthereason") === false && currentCheck.includes("whywereyoubanned?") === false)
            {
                getRemoved = ["<b>","</b>","<br>","</br>","<ul>","</ul>","<li>","</li>","<i>","</i>","'","hello,","violators","violator:","hackersin-game","in-gamenameofplayer","username:","oldign","newign","oldname","newname","in-gamenamesof","in-gamenamesof","nameof","hackerign:","ignofhacker","ignofthehacker","igns:","ign(","ingamename","ingame","hacker-","player:","players:","offender:","offenders:","mcname:","user:","playername","names:","name:","names-","name-","rulebreakers","rulebreaker","theruleviolator","ign:","ign-","ign*","in-game","[vip]","[vip+]","[mvp]","[mvp+]","name(s)","(s)name","(s)",":","-","*","(",")","."];
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
            console.log(nameContainer);
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
                usernamePrint = usernameInfo;
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
                            if(info.toLowerCase().includes("[g]"))
                            {
                                $("<div style='height: 40px; margin: 0 10px 0 10px; display: flex; flex-direction: column; justify-content: center; text-align: center;'><div class='punishmentStatusButton' style='height: 30px; width:140px; padding 1px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #000;color:#fff; border-radius:3px;cursor:pointer;' onclick='window.open(\"https://goliath.hypixel.net/reportslookup?username="+usernamePrint+"\")'>Check chatreports</div></div>").insertAfter(".messageList:first");
                            }
                            else if(info.toLowerCase().includes("[f]"))
                            {
                                $("<div style='height: 40px; margin: 0 10px 0 10px; display: flex; flex-direction: column; justify-content: center; text-align: center;'><div class='punishmentStatusButton' style='height: 30px; width:140px; padding 1px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #000;color:#fff; border-radius:3px;cursor:pointer;')'>Check forum reports</div></div>").insertAfter(".messageList:first");
                                document.getElementsByClassName('punishmentStatusButton')[0].addEventListener('click', openSearch, false);
                            }
                            $("<style>.punishmentStatusButton:hover{padding:0;border: 1px solid #000;background-color:#fff!important;color:#000!important;}</style>").insertAfter("body:first");
                        }
                        else
                        {
                            innerB= usernamePrint+" is "+banType+"banned for \""+banReasonInfo+"\".";
                        }

                        $("<div style='height: 40px; margin: 0; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #ffb3b3;'>"+innerB+"</div>").insertAfter(".pageNavLinkGroup:first");
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
                            if(info.toLowerCase().includes("[g]"))
                            {
                                $("<div style='height: 40px; margin: 0 10px 0 10px; display: flex; flex-direction: column; justify-content: center; text-align: center;'><div class='punishmentStatusButton' style='height: 30px; width:140px; padding 1px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #000;color:#fff; border-radius:3px;cursor:pointer;' onclick='window.open(\"https://goliath.hypixel.net/reportslookup?username="+usernamePrint+"\")'>Check chatreports</div></div>").insertAfter(".messageList:first");
                            }
                            else if(info.toLowerCase().includes("[f]"))
                            {
                                $("<div style='height: 40px; margin: 0 10px 0 10px; display: flex; flex-direction: column; justify-content: center; text-align: center;'><div class='punishmentStatusButton' style='height: 30px; width:140px; padding 1px; margin: 0px; display: flex; flex-direction: column; justify-content: center; text-align: center; background-color: #000;color:#fff; border-radius:3px;cursor:pointer;')'>Check forum reports</div></div>").insertAfter(".messageList:first");
                                document.getElementsByClassName('punishmentStatusButton')[0].addEventListener('click', openSearch, false);
                            }
                            $("<style>.punishmentStatusButton:hover{padding:0;border: 1px solid #000;background-color:#fff!important;color:#000!important;}</style>").insertAfter("body:first");
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

}
if(url == "https://hypixel.net/search")
{
    var cookieSearch = document.cookie;
    if(cookieSearch.includes("forumSearch="))
       {
           var nameSearch = cookieSearch.substring(cookieSearch.indexOf("forumSearch=")+12,cookieSearch.indexOf("€^$"));
           document.cookie = "forumSearch=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
           document.getElementById("ctrl_keywords").value = nameSearch;
           var element = document.getElementById('ctrl_nodes');
           element.value = "37";
           form = document.getElementsByClassName("xenForm");
           form[0].submit();
       }
}

// FUNCTIONS

function openSearch()
{
    var nowSearch = new Date();
    var timeSearch = nowSearch.getTime();
    timeSearch += 10 * 1000;
    nowSearch.setTime(timeSearch);
    document.cookie = "forumSearch="+usernamePrint+"€^$;expires="+nowSearch+";path=/";
    window.open("https://hypixel.net/search");
}

