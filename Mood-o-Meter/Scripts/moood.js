window.onload = function () {

    var goodButton = document.getElementById("good-button");
    goodButton.onclick = good;

    var badbutton = document.getElementById("bad-button");
    badbutton.onclick = bad;

    reloadMoods();
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
        },
        complete: reloadMoods
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


function showMoods(moods) {
    //http://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
    var moodTableBody = document.createElement('tbody');
    moodTableBody.id = "mood-table-body";
    var index;
    for(index=0; index < moods.length; index++) {
        var row = moodTableBody.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerText = moods[index].Moood;
    }

    var oldMoodTableBody = document.getElementById("mood-table-body");
    oldMoodTableBody.parentNode.replaceChild(moodTableBody, oldMoodTableBody);
}