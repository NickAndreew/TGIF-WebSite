var statistics = {
    members: [
        
    ]
}

createStatistics();

$(document).ready(function () {
    $("#states-filter").on("change", updateUI);
    $("input[name='filterName']").on("change", updateUI);

    $(".dropdown").hover(() => {
        $(".dropdown").toggleClass('open')
    });

    $(".dropdown1").hover(() => {
        $(".dropdown1").toggleClass('open')
    });

    $(".dropdown2").hover(() => {        
        $(".dropdown2").toggleClass('open')
    });
    
    var template = $("#user-template").html();
    
    var info = Mustache.render(template, statistics);
    $('#senate-data').html(info);

    $(".iframe").colorbox({iframe:true, innerWidth: 425, innerHeight: 344}); 
    $('#tableId').DataTable({
        "bPaginate": false,
        "scrollY": 400,
        "searching": false,
        "dom":"ft"
    });
    $(".cssload-loader").hide();
});

function createTable() {

    var members = data.results[0].members;
    var firstName = "";
    var lastName = "";
    var party = "";
    var state = "";
    var seniority = "";
    var percentage = "";

    var table = document.getElementById("senate-data");


    for (var i = 0; i < members.length; i++) {
        if (i == 0) {
            var trEl = document.createElement("tr");
            var thead = document.createElement("thead");

            table.append(thead);
            thead.append(trEl);

            var thEl = document.createElement("th");

            trEl.append(thEl);

            thEl.textContent = "First and Last name";

            var thEl1 = document.createElement("th");
            trEl.append(thEl1);
            thEl1.textContent = "Party Affiliation";

            var thEl2 = document.createElement("th");
            trEl.append(thEl2);
            thEl2.textContent = "State";

            var thEl3 = document.createElement("th");
            trEl.append(thEl3);
            thEl3.textContent = "Percentage";

        }
        var tbody = document.createElement("tbody");
        var trEl = document.createElement("tr");

        table.append(tbody);
        tbody.append(trEl);

        var tdEl = document.createElement("td");

        trEl.append(tdEl);
        var aEl = document.createElement("a");

        tdEl.append(aEl);

        aEl.textContent = members[i].first_name + " " + members[i].last_name;

        aEl.setAttribute("href", members[i].url);

        var tdEl1 = document.createElement("td");
        trEl.append(tdEl1);
        tdEl1.textContent = members[i].party;
        tdEl1.className = "partyCl";

        var tdEl2 = document.createElement("td");
        trEl.append(tdEl2);
        tdEl2.textContent = members[i].state;
        tdEl2.className = "stateCl";

        var tdEl3 = document.createElement("td");
        trEl.append(tdEl3);
        tdEl3.textContent = members[i].votes_with_party_pct;
    }
}

function updateUI() {
    var state = $("#states-filter").val();
    var states = state ? [state] : [];
    $('#senate-data tr').hide();

    var parties = $("input[name='filterName']:checked")
        .map(function () {
            return $(this).val();
        }).get();
    $("#senate-data tr").each(function () {

        var state1 = $(this).find(".stateCl").text();
        var stateSelected = isIncluded(state1, states);

        var party = $(this).find(".partyCl").text();
        var partySelected = isIncluded(party, parties);

        if (stateSelected && partySelected) {
            $(this).show();
        }
    });
}

function isIncluded(x, lst) {
    return lst.length === 0 || lst.indexOf(x) != -1;
}

function createStatistics(){
    var list = data.results[0].members;
    for(var i = 0; i < list.length; i++){
        var member = {};
        member.full_name = list[i].first_name +" "+list[i].last_name;
        member.party = list[i].party;
        member.state = list[i].state;
        member.url = list[i].url;
        member.votes_with_party_pct = list[i].votes_with_party_pct;
        statistics.members.push(member);
    }
}
