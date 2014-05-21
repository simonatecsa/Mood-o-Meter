window.onload = function () {
    var goodButton = document.getElementById("good-button");
    goodButton.onclick = good;

    var badbutton = document.getElementById("bad-button");
    badbutton.onclick = bad;
};

function good() {
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("POST", "/Mood/Create", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("moood=goood");
}

function bad() {
    alert("Suck it up scumbag!");
}
