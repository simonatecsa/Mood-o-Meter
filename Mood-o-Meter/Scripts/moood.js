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

    var moodList = document.getElementById('mood-list');
    moodList.innerHTML = "";

    var current_size = 2;
    var index;
    for(index=0; index < moods.length; index++) {
        current_size -= 0.05;
        if (current_size < 0.05)
            break;

        var row = moodTableBody.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerText = moods[index].value;
        cell.style.fontSize = current_size + "em";
        //var anothercell = row.insertCell(0);
        //anothercell.innerText = moods[index].weight;

        moodList.innerHTML += '<span style="font-size:' + current_size + 'em">[' +
            moods[index].value + ']</span>';
    }

    var oldMoodTableBody = document.getElementById("mood-table-body");
    oldMoodTableBody.parentNode.replaceChild(moodTableBody, oldMoodTableBody);

    MoodsCloud.update(moods);
}

var MoodsCloud = (function() {
    function update(moods) {
        clear();
        var words = moodsToWords(moods);
        doLayout(words);
    }

    function clear() {
        getElement().empty();
    }

    function getElement() {
        return $("#mood-cloud");
    }

    function moodsToWords(moods) {
        return moods.map(moodToWord);
    }

    function moodToWord(mood) {
        return { text: mood.value, size: mood.weight };
    }

    function doLayout(words) {
        d3.layout.cloud()
            .size([getWidth(), getHeight()])
            .words(words)
            .padding(8)
            .rotate(getRotation)
            .font("Impact")
            .fontSize(getFontSize)
            .on("end", onLayoutDone)
            .start();

        function getRotation() {
            return ~~(Math.random() * 2) * 90;
        }

        function getFontSize(word) {
            return 20 + word.size * 250;
        }
    }

    function getWidth() {
        return getElement().width();
    }

    function getHeight() {
        return getElement().height();
    }

    function onLayoutDone(data) {
        var fillScale = d3.scale.category20();

        d3.select("#mood-cloud")
            .append("g")
            .attr("transform", getGroupTransform)
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("transform", getTransform)
            .attr("text-anchor", "middle")
            .style("font-size", getFontSize)
            .style("fill", getFill)
            .text(getText);

        /*
         * The whole svg group has to be translated with 50%, 
         * as word (item) coordinates are relative to the center of the cloud etc.
         */
        function getGroupTransform() {
            return "translate(" + [getWidth() / 2, getHeight() / 2] + ")";
        }

        function getTransform(item) {
            return "translate(" + [item.x, item.y] + ")rotate(" + item.rotate + ")";
        }

        function getFontSize(item) {
            return item.size + "px";
        }

        function getFill(item, index) {
            return fillScale(index);
        }

        function getText(item) {
            return item.text;
        }
    }

    return {
        update: update
    }
})();