window.onload = function () {
    var goodButton = document.getElementById("good-button");
    goodButton.onclick = good;

    var badbutton = document.getElementById("bad-button");
    badbutton.onclick = bad;

    foo();
};


function good() {
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("POST", "/Mood/Create", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlhttp.onreadystatechange = foo;

    xmlhttp.send("moood=goood");

}

function bad() {
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("POST", "/Mood/Create", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlhttp.onreadystatechange = foo;

    xmlhttp.send("moood=baaah");
}

function foo() {
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("GET", "/Mood/GetMoods", true);
    xmlhttp.onreadystatechange =function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var moods = JSON.parse(xmlhttp.responseText);
            showMoods(moods);
        }
    };
    xmlhttp.send();
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