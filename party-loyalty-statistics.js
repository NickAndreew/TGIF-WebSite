var statistics = {
    glance: [{
        "party": "Democrats",
        "number_of_people": "1",
        "votes_with_party_pct": "5"
    }, {
        "party": "Republicans",
        "number_of_people": "2",
        "votes_with_party_pct": "6"
    }, {
        "party": "Independent",
        "number_of_people": "3",
        "votes_with_party_pct": "7"
    }, {
        "party": "Total",
        "number_of_people": "4",
        "votes_with_party_pct": "8"
    }],
    least: [

    ],
    most: [

    ]
};


$(function () {

    var url = "";
    if (document.body.id == "house") {
        url = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
    } else if (document.body.id == "senate") {
        url = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
    }
    $.getJSON(url, function (data) {
        var allMembers = data.results[0].members;
        getTenPerct(allMembers);
        assignDataToStats(allMembers);
        //        createTable1(parties);

        var template = $("#user-template").html();
        var info = Mustache.render(template, statistics);
        $('#senate-data').html(info);

        var template1 = $("#user-template1").html();
        var info1 = Mustache.render(template1, statistics);
        $('#senate-data1').html(info1);
        //        createTable2(names);
        var template2 = $("#user-template2").html();
        var info2 = Mustache.render(template2, statistics);
        $('#senate-data2').html(info2);
        //        createTable3(names1);
        $('#tableId').DataTable({
            "bPaginate": false,
            "scrollY": 400,
            "searching": false,
            "order": []
        });
        $('#tableId1').DataTable({
            "bPaginate": false,
            "scrollY": 400,
            "searching": false,
            "order": []
        });
        $(".cssload-loader").hide();
    });
});


function assignDataToStats(members) {

    var prctArray = [];
    var repParty = 0;
    var demParty = 0;
    var indParty = 0;

    for (var i = 0; i < members.length; i++) {
        if (members[i].party == "R") {
            repParty++;
        } else if (members[i].party == "D") {
            demParty++;
        } else if (members[i].party == "I") {
            indParty++;
        }
    }

    statistics.glance[0].number_of_people = repParty;
    statistics.glance[1].number_of_people = demParty;
    statistics.glance[2].number_of_people = indParty;
    statistics.glance[3].number_of_people = (repParty + demParty + indParty);

    var votedPrct = [];
    var repPrct = [];
    var demPrct = [];
    var indPrct = [];


    for (var i = 0; i < members.length; i++) {
        if (members[i].party == "R") {
            repPrct.push(members[i].votes_with_party_pct);
        } else if (members[i].party == "D") {
            demPrct.push(members[i].votes_with_party_pct);
        } else if (members[i].party == "I") {
            indPrct.push(members[i].votes_with_party_pct);
        }
    }


    var avrgPrct = 0;
    var avrgPrct1 = 0;
    var avrgPrct2 = 0;


    for (var i = 0; i < repPrct.length; i++) {
        avrgPrct = avrgPrct + parseFloat(repPrct[i]);
    }

    avrgPrct = (avrgPrct / repPrct.length).toFixed(2);
    avrgPrct = Number(avrgPrct);


    for (var i = 0; i < demPrct.length; i++) {
        avrgPrct1 = avrgPrct1 + parseFloat(demPrct[i]);
    }

    avrgPrct1 = (avrgPrct1 / demPrct.length).toFixed(2);
    avrgPrct1 = Number(avrgPrct1);


    for (var i = 0; i < indPrct.length; i++) {
        avrgPrct2 = avrgPrct2 + parseFloat(indPrct[i]);
    }

    avrgPrct2 = (avrgPrct2 / indPrct.length).toFixed(2);
    avrgPrct2 = Number(avrgPrct2);

    var avrgTotal = ((avrgPrct * (repParty) + avrgPrct1 * (demParty) + avrgPrct2 * (indParty)) / (repParty + demParty + indParty)).toFixed(2);


    statistics.glance[0].votes_with_party_pct = avrgPrct;
    statistics.glance[1].votes_with_party_pct = avrgPrct1;
    statistics.glance[2].votes_with_party_pct = avrgPrct2;
    statistics.glance[3].votes_with_party_pct = avrgTotal;

};

function createTable1(parties) {
    var glance = [];
    for (var property in statistics.glance) {

        if (!statistics.glance.hasOwnProperty(property)) {
            continue;
        }

        glance.push(statistics.glance[property]);
    }
    var table = document.getElementById("glanceTable");
    table.className = "table table-bordered";
    for (var i = 0; i < parties.length; i++) {
        if (i == 0) {
            var theadEl = document.createElement("thead");
            var tbodyEl = document.createElement("tbody");
            var trEl = document.createElement("tr");
            var thEl = document.createElement("th");

            table.append(theadEl);
            table.append(tbodyEl);
            theadEl.append(trEl);
            trEl.append(thEl);
            thEl.textContent = "Party  ";
            var thEl1 = document.createElement("th");
            trEl.append(thEl1);
            thEl1.textContent = "Number Of Reps  ";
            var thEl2 = document.createElement("th");
            trEl.append(thEl2);
            thEl2.textContent = "% Voted with Party  ";
        }

        var trEl1 = document.createElement("tr");
        tbodyEl.append(trEl1);

        var tdEl = document.createElement("td");
        trEl1.append(tdEl)
        tdEl.textContent = parties[i];

        var tdEl1 = document.createElement("td");
        trEl1.append(tdEl1);
        tdEl1.textContent = glance[i];

        var tdEl2 = document.createElement("td");
        trEl1.append(tdEl2);
        tdEl2.textContent = glance[i + 4];
    }
};

function sortAndReturnMissed(members) {

    var missedVotesPrct = members;
    missedVotesPrct.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    })
    return missedVotesPrct;
};

function getTenPerct(members, isReversed) {
    var names = [];
    var names1 = [];
    var missedVotesPrct = members.slice();
    sortAndReturnMissed(missedVotesPrct);
    var tenPerct = (missedVotesPrct.length / 100) * 10;
    var round = Math.round(tenPerct);

    function calculate(elem) {
        var calc = parseFloat(elem.total_votes / 100 * elem.votes_with_party_pct).toFixed(2);
        return Math.floor(calc);
    }

    for (var i = 0; i < missedVotesPrct.length; i++) {

        var firstEl = missedVotesPrct[i].votes_with_party_pct;
        var secondEl = missedVotesPrct[round - 1].votes_with_party_pct;

        if (names.length < round || firstEl === secondEl) {
            missedVotesPrct[i].number_of_party_votes = calculate(missedVotesPrct[i]);
            var objLeast = {};
            objLeast.full_name = missedVotesPrct[i].first_name + " " + missedVotesPrct[i].last_name;
            objLeast.number_of_party_votes = missedVotesPrct[i].number_of_party_votes;
            objLeast.votes_with_party_pct = missedVotesPrct[i].votes_with_party_pct;
            statistics.least.push(objLeast);
            names.push(missedVotesPrct[i]);
        }
    }

    missedVotesPrct.reverse();

    for (var i = 0; i < missedVotesPrct.length; i++) {

        var firstEl = missedVotesPrct[i].votes_with_party_pct;
        var secondEl = missedVotesPrct[round - 1].votes_with_party_pct;

        if (names1.length < round || firstEl === secondEl) {
            missedVotesPrct[i].number_of_party_votes = calculate(missedVotesPrct[i]);
            var objMost = {};
            objMost.full_name = missedVotesPrct[i].first_name + " " + missedVotesPrct[i].last_name;
            objMost.number_of_party_votes = missedVotesPrct[i].number_of_party_votes;
            objMost.votes_with_party_pct = missedVotesPrct[i].votes_with_party_pct;
            statistics.most.push(objMost);
            names1.push(missedVotesPrct[i]);
        }
    }
    return names;
};

function createTable2(membersArray) {
    var table = document.getElementById("glanceTable1");
    table.className = "table table-bordered";
    for (var i = 0; i < membersArray.length; i++) {
        if (i == 0) {
            var theadEl = document.createElement("thead");
            var tbodyEl = document.createElement("tbody");
            var trEl = document.createElement("tr");
            var thEl = document.createElement("th");

            table.append(theadEl);
            table.append(tbodyEl);
            theadEl.append(trEl);
            trEl.append(thEl);
            thEl.textContent = "Name  ";
            var thEl1 = document.createElement("th");
            trEl.append(thEl1);
            thEl1.textContent = "No. Party Votes  ";
            var thEl2 = document.createElement("th");
            trEl.append(thEl2);
            thEl2.textContent = "% Party Votes  ";
        }
        var trEl1 = document.createElement("tr");
        tbodyEl.append(trEl1);

        var tdEl = document.createElement("td");
        trEl1.append(tdEl)
        tdEl.textContent = membersArray[i].first_name + " " + membersArray[i].last_name;

        var tdEl1 = document.createElement("td");
        trEl1.append(tdEl1);
        var calc = parseFloat(membersArray[i].total_votes / 100 * membersArray[i].votes_with_party_pct).toFixed(0);
        tdEl1.textContent = calc;

        var tdEl2 = document.createElement("td");
        trEl1.append(tdEl2);
        tdEl2.textContent = membersArray[i].votes_with_party_pct;
    }
};

function createTable3(membersArray) {
    var table = document.getElementById("glanceTable2");
    table.className = "table table-bordered";

    for (var i = 0; i < membersArray.length; i++) {
        if (i == 0) {
            var theadEl = document.createElement("thead");
            var tbodyEl = document.createElement("tbody");
            var trEl = document.createElement("tr");
            var thEl = document.createElement("th");

            table.append(theadEl);
            table.append(tbodyEl);
            theadEl.append(trEl);
            trEl.append(thEl);
            thEl.textContent = "Name  ";
            var thEl1 = document.createElement("th");
            trEl.append(thEl1);
            thEl1.textContent = "No. Party Votes  ";
            var thEl2 = document.createElement("th");
            trEl.append(thEl2);
            thEl2.textContent = "% Party Votes  ";
        }
        var trEl1 = document.createElement("tr");
        tbodyEl.append(trEl1);

        var tdEl = document.createElement("td");
        trEl1.append(tdEl)
        tdEl.textContent = membersArray[i].first_name + " " + membersArray[i].last_name;

        var tdEl1 = document.createElement("td");
        trEl1.append(tdEl1);
        var calc = (parseFloat(membersArray[i].total_votes).toFixed(2) / 100) * parseFloat(membersArray[i].votes_with_party_pct).toFixed(2);
        tdEl1.textContent = calc.toFixed(2);

        var tdEl2 = document.createElement("td");
        trEl1.append(tdEl2);
        tdEl2.textContent = membersArray[i].votes_with_party_pct;
    }
};
