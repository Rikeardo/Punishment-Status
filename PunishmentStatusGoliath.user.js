// ==UserScript==
// @name         Punishment status - Goliath
// @version      0.5
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
            var bans = document.getElementsByClassName("uk-width-1-4")[1].innerHTML;
            var mutes = document.getElementsByClassName("uk-width-1-4")[3].innerHTML;
            if(bans.includes("Current Ban"))
            {
                var startBanCut = bans.indexOf("<br>");
                var endBanCut = bans.indexOf("By:");
                var cutBan = bans.substring(startBanCut+5, endBanCut);

                var endBanReason = cutBan.indexOf("<br>");
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
            }
            var nowG = new Date();
            var timeG = nowG.getTime();
            timeG += 10 * 1000;
            nowG.setTime(timeG);
            document.cookie = "answerBanChecking"+forumKeyLoaded+"='"+/([A-Za-z0-9_]{1,16})$/.exec($("#columnx > font:first-of-type").text())[1]+ "'"+banReason+muteReason+"END0FANSW3R; expires=" + nowG.toUTCString() +"; domain=.hypixel.net;path=/";
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
        window.location.href = "https://goliath.hypixel.net/userinfo?username=" + username;
    }
}, 600);

var version = 0.41;
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
