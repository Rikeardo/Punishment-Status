// ==UserScript==
// @name         Punishment status - Goliath
// @version      0.7
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @icon         http://i.imgur.com/9gMGDnD.png
// @include      https://goliath.hypixel.net/userinfo?*
// @include      https://goliath.hypixel.net/userinfo#*
// @include      https://goliath.hypixel.net/userinfo
// ==/UserScript==

setInterval(function()
{
    var cookie = document.cookie;

    if(cookie.includes("loadedBanChecking"))
    {
        var startForumKeyLoaded = cookie.indexOf("loadedBanChecking");
        var forumKeyLoaded = cookie.substring(startForumKeyLoaded+17, startForumKeyLoaded+22);
        console.log(forumKeyLoaded);
        //CHECK FOR NAME
        if(document.body.innerHTML.includes("Network Level"))
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
            console.log("invalid page");
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
        var startName = cookie.lastIndexOf("banChecking"+keyCode+"=");
        var endName = cookie.lastIndexOf("END0FN4ME"+keyCode);
        var username = cookie.substring(startName+13+keyCode.toString().length, endName);
        console.log(username);
        var nowGol = new Date();
        var timeGol = nowGol.getTime();
        timeGol += 10 * 1000;
        nowGol.setTime(timeGol);
        document.cookie = "loadedBanChecking"+keyCode+"='"+username+ "END0FL0AD3D"+keyCode+"; expires=" + nowGol.toUTCString() +"; domain=.hypixel.net;path=/";
        window.location.href = "https://goliath.hypixel.net/userinfo?uuid=" + username;
    }
}, 600);

var version = 0.7;
var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (request.readyState == XMLHttpRequest.DONE) {
        var updatedScriptVersion = request.responseText;
        if(version < updatedScriptVersion)
        {
            console.log("Update script");
            window.location.href = "https://github.com/Rikeardo/Punishment-Status/raw/master/PunishmentStatusGoliath.user.js";
        }
    }
};
request.open('GET', 'https://raw.githubusercontent.com/Rikeardo/Punishment-Status/master/GoliathVersion.json', true);
request.send(null);
