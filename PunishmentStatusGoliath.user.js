// ==UserScript==
// @name         Punishment status - Goliath ARCHEIEVED
// @version      0.7.1
// @description  Check if a player is currently punished from the server, from forums
// @author       _Rikardo_
// @icon         http://i.imgur.com/9gMGDnD.png
// @include      https://goliath.hypixel.net/NICELINKTHATSHOULDNTWORK
// ==/UserScript==

var version = 0.71;
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
