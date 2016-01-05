var str = decodeURI(location.search);
var tempID = str.split("=");
var eloID = tempID[tempID.length - 1];
var eloNodesID = [];
var eloNodesName = [];
var tempArray = [];
var eloNodesCount = 0;

function retrieve(url) {
    $.get(url, function(data) {
        var title = data.name;
        var parentELO = data.parent_elo;

        if (parentELO == "1") {
            var rootELO = data.id;
            $("#reftree").append("<ul><li id='li_root'><a href='#' onclick=update('" + rootELO + "','" + title + "')>" + rootELO + "</a></li></ul>");

            eloNodesID[eloNodesCount] = eloID;
            eloNodesName[eloNodesCount] = title;
            eloNodesCount++;

            var _parentELO = [];
            var _elementID = [];

            $.get("http://www.commonrepo.com/api/v2/elos/", function(data) {
                var eloArray = $.map(data, function(el) {
                    return el
                });
                _parentELO[0] = rootELO;
                _elementID[0] = "root";
                getsubtree(_parentELO, _elementID, eloArray);

                console.log("flagRetrieve OK.");

                clickELO();
            });
        } else {
            retrieve("http://www.commonrepo.com/api/v2/elos/" + parentELO + "/");
        }
    });
}

function clickELO() {
    for (var index = 0; index < eloNodesID.length; index++) {
        $("#a_" + eloNodesID[index]).attr("onclick", "update('" + eloNodesID[index] + "','" + eloNodesName[index] + "')");
    }
}

function update(ID, NAME) {
    $("#eloinfo").empty();
    $("#eloinfo").append("<p>ELO Name: " + NAME + "</p>");
    $("#eloinfo").append("<hr>");

    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);
        var request = require('request');

        for (var index = 0; index < eloNodesID.length; index++) {
            request({
                url: 'http://www.commonrepo.com/api/v2/elos/diversity/' + ID + '/' + eloNodesID[index] + '/',
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + content.AUTHKEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function(error, response, body) {
                if (!error && response.statusCode == 202) {
                    var json = JSON.parse(body);
                    $("#eloinfo").append("<p>Diversity " + json.result.elo_source + " To " + json.result.elo_target + " is " + json.result.diversity + "</p>");
                }
            });
        }



        for (var index = 0; index < eloNodesID.length; index++) {
            request({
                url: 'http://www.commonrepo.com/api/v2/elos/similarity/' + ID + '/' + eloNodesID[index] + '/',
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + content.AUTHKEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function(error, response, body) {
                if (!error && response.statusCode == 202) {
                    var json = JSON.parse(body);
                    $("#eloinfo").append("<p>Similarity " + json.result.elo_source + " To " + json.result.elo_target + " is " + json.result.similarity + "</p>");
                }
            });
        }
    });

    $("#myModal").modal();
}

function getsubtree(parentELO, elementID, eloArray) {
    var flag = false;
    for (var pindex = 0; pindex < parentELO.length; pindex++) {
        for (var index = 0; index < eloArray.length; index++) {
            if (eloArray[index].parent_elo == parentELO[pindex]) {
                $("#li_" + elementID[pindex]).append("<ul></ul>");
                flag = true;
                break;
            }
        }
    }

    if (flag == true) {
        var _parentELO = [];
        var _elementID = [];
        var count = 0;

        for (var pindex = 0; pindex < parentELO.length; pindex++) {
            for (var index = 0; index < eloArray.length; index++) {
                if (eloArray[index].parent_elo == parentELO[pindex]) {
                    $("#li_" + elementID[pindex] + " > ul").append("<li id='li_" + eloArray[index].id + "'></li>");
                    $("#li_" + eloArray[index].id).append("<a id='a_" + eloArray[index].id + "' href='#'>" + eloArray[index].id + "</a>");

                    _parentELO[count] = eloArray[index].id;
                    _elementID[count] = eloArray[index].id;

                    eloNodesID[eloNodesCount] = eloArray[index].id;
                    eloNodesName[eloNodesCount] = eloArray[index].name;
                    eloNodesCount++;
                    console.log("eloNodesCount:" + eloNodesCount + " eloName:" + eloNodesName[eloNodesCount - 1]);
                    count++;
                }
            }
        }
        getsubtree(_parentELO, _elementID, eloArray);
        console.log("sub:" + eloNodesCount)
    }
}

$(function() {
    retrieve("http://www.commonrepo.com/api/v2/elos/" + eloID + "/");
});
/*
var str = decodeURI(location.search);
var tempID = str.split("=");
var eloID = tempID[tempID.length - 1];
var eloNodesID = [];
var eloNodesName = [];
var tempArray = [];
var eloNodesCount = 0;

function retrieve(url) {
    $.get(url, function(data) {
        var title = data.name;
        var parentELO = data.parent_elo;

        if (parentELO == "1") {
            var rootELO = data.id;
            $("#reftree").append("<ul><li id='root'><a href='#' onclick='setInfo(" + title + ")'>ID:" + rootELO + "</a></li></ul>");

            eloNodesID[eloNodesCount] = eloID;
            eloNodesName[eloNodesCount] = title;
            eloNodesCount++;

            getELOARRAY(rootELO, "root");
        } else {
            retrieve("http://www.commonrepo.com/api/v2/elos/" + parentELO + "/");
        }
    });
}

function getELOARRAY(parentELO, elementID) {
    var _parentELO = [];
    var _elementID = [];

    $.get("http://www.commonrepo.com/api/v2/elos/", function(data) {
        var eloArray = $.map(data, function(el) {
            return el
        });
        //console.log("ettt:" + eloarray[0].url);
        _parentELO[0] = parentELO;
        _elementID[0] = elementID;
        getsubtree(_parentELO, _elementID, eloArray);
    });
}

function getsubtree(parentELO, elementID, eloArray) {
    var flag = false;
    for (var pindex = 0; pindex < parentELO.length; pindex++) {
        for (var index = 0; index < eloArray.length; index++) {
            if (eloArray[index].parent_elo == parentELO[pindex]) {
                $("#" + elementID[pindex]).append("<ul></ul>");
                flag = true;
                break;
            }
        }
    }

    if (flag == true) {
        var _parentELO = [];
        var _elementID = [];
        var count = 0;

        for (var pindex = 0; pindex < parentELO.length; pindex++) {
            for (var index = 0; index < eloArray.length; index++) {
                if (eloArray[index].parent_elo == parentELO[pindex]) {
                    //$("#" + elementID[pindex] + " > ul").append("<li id='" + eloArray[index].id + "'><a href='#' >ID:" + eloArray[index].id + "</a></li>");
                    $("#" + elementID[pindex] + " > ul").append("<li id='" + eloArray[index].id + "'><a href='#' onclick=setInfo('" + eloArray[index].id + "','" + eloArray[index].name + "')>ID:" + eloArray[index].id + "</a></li>");
                    _parentELO[count] = eloArray[index].id;
                    _elementID[count] = eloArray[index].id;

                    eloNodesID[eloNodesCount] = eloArray[index].id;
                    eloNodesName[eloNodesCount] = eloArray[index].name;
                    eloNodesCount++;
                    count++;
                }
            }
        }
        getsubtree(_parentELO, _elementID, eloArray);
    }
}

function ELOClick() {
    for (var index = 0; index < eloNodesID.length; index++) {
        // $("#" + eloNodesID[index] + " a").attr("onclick", "updateModal(eloNodesID[index], eloNodesName[index])");
        console.log("test" + $("#" + eloNodesID[index] + " a").attr("href"));
    }
}

function updateModal(ID, NAME) {
    //$("#eloinfo").empty();
    $("#eloinfo").append("<p>ELO Name: " + decodeURI(name) + "</p>");
    $("#eloinfo").append("<p>Diversity:</p>");

    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);
        var request = require('request');

        for (var index = 0; index < eloNodesID.length; index++) {
            request({
                url: 'http://www.commonrepo.com/api/v2/elos/diversity/' + ID + '/' + eloNodesID[index] + '/',
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + content.AUTHKEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function(error, response, body) {
                if (!error && response.statusCode == 202) {
                    var json = JSON.parse(body);
                    $("#eloinfo").append("<p>" + ID + " To " + eloNodesID[index] + ": " + json.result.diversity + "</p>");
                }
            });
        }
    });

    //$("#myModal").modal();
}
*/