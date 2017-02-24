// ==UserScript==
// @name         Punishment status - Goliath
// @version      0.1
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @include     https://goliath.hypixel.net/userinfo?*
// @include     https://goliath.hypixel.net/userinfo#*
// @include     https://goliath.hypixel.net/userinfo
//@updateURL    https://github.com/Rikeardo/Punishment-Status/raw/master/PunishmentStatusGoliath.user.js
// ==/UserScript==

setInterval(function()
{
    var cookie = document.cookie;
    var url = window.location.href;
    if(cookie.includes("banChecking="))
    {
        document.cookie = "banChecking=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";
        var startName = cookie.indexOf("banChecking=");
        var endName = cookie.lastIndexOf("END0FN4ME");
        var username = cookie.substring(startName+13, endName);
        window.location.href = "https://goliath.hypixel.net/userinfo?username=" + username;
        document.cookie = "banCheckingLoaded='"+username+ "END0FL0AD3D; domain=.hypixel.net;path=/";
    }
    if(cookie.includes("banCheckingLoaded="))
    {
        document.cookie = "banCheckingLoaded=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.hypixel.net; path=/;";
        
        if(document.body.innerHTML.includes("Network Level"))
        {
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
            document.cookie = "banCheckingAnswer='"+/([A-Za-z0-9_]{1,16})$/.exec($("#columnx > font:first-of-type").text())[1]+ "'"+banReason+muteReason+"END0FANSW3R; domain=.hypixel.net;path=/";
        }
        else
        {
            window.location.href = "https://goliath.hypixel.net/userinfo";
        }
    }
}, 500);
