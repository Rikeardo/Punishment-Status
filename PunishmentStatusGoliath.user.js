// ==UserScript==
// ==/UserScript==

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
