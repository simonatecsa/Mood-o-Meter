window.onload = function () {

    var goodButton = document.getElementById("good-button");
    goodButton.onclick = good;

    var badbutton = document.getElementById("bad-button");
    badbutton.onclick = bad;


    var moodHub = $.connection.moodHub;
    moodHub.client.hello = function () {
        showMoodCloud();
    }

    $.connection.hub.start().done(function () {
        moodHub.server.hello();
    });

    showMoodCloud();
};

function good() {
    sendMood("goood");
}

function bad() {
    sendMood("badie");
}

function sendMood(moood) {
    $.ajax({
        url: "/Mood/Create",
        type: "POST",
        data: {
            moood: moood
        }
    });
}

function reloadMoods() {
    $.ajax({
        url: "/Mood/GetMoods",
        type: "GET",
        success: function (result) {
            showMoods(result);
        }
    });
}

function showMoodCloud() {
    $.ajax({
        url: "/Mood/GetMoodCloud",
        type: "GET",
        success: function (result) {
            showMoods(result);
        }
    });
}


function showMoods(moods) {
    //http://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
    var moodTableBody = document.createElement('tbody');
    moodTableBody.id = "mood-table-body";
    var index;
    for(index=0; index < moods.length; index++) {
        var row = moodTableBody.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerText = moods[index].value;
        cell.style.fontSize = Math.log(moods[index].weight * 80) + "em";
        var anothercell = row.insertCell(0);
        anothercell.innerText = moods[index].weight;
    }

    var oldMoodTableBody = document.getElementById("mood-table-body");
    oldMoodTableBody.parentNode.replaceChild(moodTableBody, oldMoodTableBody);
}