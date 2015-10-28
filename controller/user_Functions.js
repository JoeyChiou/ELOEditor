function calSymmetric(tc1, ta1, tc2, ta2) {
    var tc = [
        [1.0, 0.8, 0.1, 0.1, 0.8, 0.6],
        [0.8, 1.0, 0.8, 0.6, 0.8, 0.6],
        [0.1, 0.8, 1.0, 0.8, 0.5, 0.8],
        [0.1, 0.1, 0.8, 1.0, 0.1, 0.1],
        [0.8, 0.8, 0.5, 0.1, 1.0, 0.8],
        [0.6, 0.6, 0.8, 0.1, 0.8, 1.0]
    ];

    var ta = [
        [1.0, 0.5, 0.5, 0.6, 0.5, 0.4, 0.4, 0.5],
        [0.5, 1.0, 0.9, 0.1, 0.5, 0.1, 0.4, 0.1],
        [0.5, 0.9, 1.0, 0.1, 0.4, 0.1, 0.5, 0.3],
        [0.6, 0.1, 0.1, 1.0, 0.5, 0.1, 0.1, 0.6],
        [0.5, 0.5, 0.4, 0.5, 1.0, 0.7, 0.7, 0.8],
        [0.4, 0.1, 0.1, 0.1, 0.7, 1.0, 0.1, 0.8],
        [0.4, 0.4, 0.5, 0.1, 0.7, 0.1, 1.0, 0.1],
        [0.5, 0.1, 0.3, 0.6, 0.8, 0.8, 0.1, 1.0]
    ];

    return tc[tc1][tc2]*0.8 + ta[ta1][ta2]*0.2;
}


var gui = require("nw.gui");

// Count all documents in the datastore
function getCount() {
    db.count({}, function(err, count) {
        $("span:contains(Local ELOs) ~ span").text(count);
        $("span:contains(Remote ELOs) ~ span").text(count + 20);
        $("span:contains(Likes) ~ span").text(count + 34);
        $("span:contains(Members) ~ span").text(count + 73);
    });
}

function MT_Search(str) {
    var query = str.split(",");
    // alert(str);
    metadata.find({
        group: new RegExp(query[0].toUpperCase()),
        node: new RegExp(query[1]),
        value: new RegExp(query[2])
    }, function(err, docs) {
        var temp;
        var ELOname;

        if (docs.length > 0) {
            hideDiv();

            $("#searchresults").append("<div id='MTdiv' class='box box-info'>");
            $("#MTdiv").append("<div id='MTresults' class='box-header with-border'>");
            $("#MTresults").append("<h3 class='box-title'>Results</h3>");
            $("#MTresults").append("<p>");

            for (var i = 0; i < docs.length; i++) {
                //alert(docs[i].elopath);
                temp = docs[i].elopath.split("/");
                ELOname = temp[temp.length - 1]
                $("#MTresults").append("<a href='eloviewer.html?elopath=" + docs[i].elopath + "'>" + ELOname + "</a><br>");
            }

            $("#MTresults").append("</p>");
            $("#MTdiv").append("</div>");
            $("searchresults").append("</div>");
        } else {
            alert("no results!");
        }
    });
}

// Search ELO
function ELO_ListBySearch(title) {
    db.find({
        title: new RegExp(title)
    }, function(err, docs) {
        if (docs.length > 0) {
            $("#search-result").append("<ol id='ELOList' class='treeview-menu'>");
            for (var i = 0; i < docs.length; i++) {
                $("#ELOList").append("<li><a href=javascript:viewELO('" + docs[i].elopath + "');><i class='fa fa-circle-o'>" + docs[i].title + "</i></a></li>");
            }
            $("#search-result").append("</ol>");
        }
    });
}

function viewELO(elopath) {
    var path = elopath + "/";
    var jsdom = require("jsdom");

    jsdom.env({
        file: path + "elo_aggregation.xml",
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function(errors, window) {
            var tnID;

            for (var i = 0; i < window.$("container").length; i++) {
                tnID = window.$("container")[i].getAttribute("id");
                var treeL1 = "<ul class='treeview-menu'>";
                treeL1 += "<li>";
                treeL1 += "<a href='#'>";
                treeL1 += "<i class='fa fa-plus'></i>";
                treeL1 += window.$("container")[i].getAttribute("display_name");
                //treeL1 += "<i class='fa fa-angle-left pull-right'></i>";
                //treeL1 += "</a>";

                var treeL2 = "";
                //treeL2 = "<ul class='treeview-menu'>";
                for (var j = 0; j < window.$("content").length; j++) {
                    if (window.$("content")[j].getAttribute("tid") == tnID) {
                        // treeL2 += "<li>";
                        // treeL2 += "<a href=" + path + window.$("content")[j].getAttribute("id") + "/" + window.$("content")[j].getAttribute("url_name") + ".html target='iframe01'>";
                        treeL2 += "<a href=" + path + window.$("content")[j].getAttribute("tid") + "/" + window.$("content")[j].getAttribute("url_name") + ".html target='iframe01'>";
                        // treeL2 += "<i class='fa fa-circle-o'></i>";
                        treeL2 += "<font color='yellow'>"
                        treeL2 += window.$("content")[j].getAttribute("url_name").toString();
                        treeL2 += "</font>"
                        treeL2 += "</a>";
                        // treeL2 += "</li>";
                    }
                }
                //treeL2 += "</ul>";
                treeL1 += treeL2;

                treeL1 += "</a>";
                treeL1 += "</li>";
                treeL1 += "</ul>";
                document.getElementById("search-result-treeview").innerHTML += treeL1;
                //document.getElementById("search-result-treeview").innerHTML += treeDebug;
            }
        }
    });
}

// List all ELOs
function ELO_List(divID) {
    db.count({}, function(err, count) {
        db.find({}, function(err, docs) {
            // db.find({}).sort({
            //     _id: 1
            // }).exec(function(err, docs) {
            var div = document.getElementById(divID);
            var ul = document.createElement("ul");
            ul.setAttribute("class", "users-list clearfix");
            var li;
            var img;
            var a;
            var span;
            var title;
            var name;
            var elopath;

            for (var i = 0; i < count; i++) {
                title = docs[i].title;
                name = docs[i].name;
                elopath = docs[i].elopath;
                li = document.createElement("li");
                li.setAttribute("onclick", "intentView('" + elopath + "')");
                localContextMenu(li, title, name);

                img = document.createElement("img");
                img.setAttribute("src", "assets/img/book-64.png");
                img.setAttribute("alt", "User Image");
                a = document.createElement("a");
                a.setAttribute("class", "users-list-date");
                a.innerHTML = title;
                span = document.createElement("span");
                span.setAttribute("class", "users-list-date");
                span.innerHTML = name;

                li.appendChild(img);
                li.appendChild(a);
                li.appendChild(span);
                ul.appendChild(li);
            }
            div.appendChild(ul);
        });
    });
}

function ELO_remotelist() {
    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);

        $.get("http://www.commonrepo.com/api/v1/users/" + content.userID + "/", function(data) {
            var div = document.getElementById("remoteELO");
            var ul = document.createElement("ul");
            ul.setAttribute("class", "users-list clearfix");
            alert(content.userID);
            for (var i = 0; i < 7; i++) {
                alert(data.elos[i]);
                $.get(data.elos[i], function(data) {
                    alert(data.name);
                    var title = data.name;
                    var name = content.userName;
                    var li = document.createElement("li");
                    remoteContextMenu(li, data.url, title);

                    var img = document.createElement("img");
                    img.setAttribute("src", "assets/img/book-64.png");
                    img.setAttribute("alt", "User Image");

                    var a = document.createElement("a");
                    a.setAttribute("class", "users-list-date");
                    a.innerHTML = title;

                    var span = document.createElement("span");
                    span.setAttribute("class", "users-list-date");
                    span.innerHTML = name;

                    li.appendChild(img);
                    li.appendChild(a);
                    li.appendChild(span);
                    ul.appendChild(li);
                });
            }
            div.appendChild(ul);
        });

        /*var request = require('request');
        request({
            headers: {
                'Authorization': 'Token ' + content.AUTHKEY
            },
            url: "http://commonrepo.herokuapp.com/api/v1/elos/"
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var elos = JSON.parse(body);
                var div = document.getElementById("remoteELO");
                var ul = document.createElement("ul");
                ul.setAttribute("class", "users-list clearfix");
                for (var i = 0; i < elos.length; i++) {
                    // if (elos[i].url == "http://commonrepo.herokuapp.com/api/v1/elos/" + content.userID + "/") {
                    if (elos[i].author == "http://commonrepo.herokuapp.com/api/v1/users/" + content.userID + "/") {
                        // $("#remoteELO").append("<ul class='users-list clearfix'>");

                        var title = elos[i].name;
                        var name = content.userName;
                        // var elopath = docs[i].elopath;
                        var li = document.createElement("li");
                        // li.setAttribute("onclick", "intentView('" + elopath + "')");
                        remoteContextMenu(li, elos[i].url, title);

                        var img = document.createElement("img");
                        img.setAttribute("src", "assets/img/book-64.png");
                        img.setAttribute("alt", "User Image");

                        var a = document.createElement("a");
                        a.setAttribute("class", "users-list-date");
                        a.innerHTML = title;

                        var span = document.createElement("span");
                        span.setAttribute("class", "users-list-date");
                        span.innerHTML = name;

                        li.appendChild(img);
                        li.appendChild(a);
                        li.appendChild(span);
                        ul.appendChild(li);
                    }
                }
                div.appendChild(ul);
            }
        });*/
    });

}

function intentView(elopath) {
    location.href = "eloviewer.html?elopath=" + elopath;
}

// context for local
function localContextMenu(divobj, elotitle, eloname) {
    localmenu = new gui.Menu();
    localmenu.append(new gui.MenuItem({
        label: 'Import',
        click: function() {
            $('#fileImportDialog').click();
        }
    }));
    localmenu.append(new gui.MenuItem({
        label: 'Upload',
        click: function() {
            var fs = require('fs');
            fs.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);
                var querystring = require('querystring');
                var request = require('request');

                var form = {
                    name: elotitle,
                    author: 'http://commonrepo.herokuapp.com/api/v1/users/' + content.userID + '/',
                    original_type: '1'
                };

                var formData = querystring.stringify(form);

                request({
                    url: 'http://commonrepo.herokuapp.com/api/v1/elos/',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Token ' + content.AUTHKEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData
                }, function(error, response, body) {
                    if (!error) {
                        var info = JSON.parse(body);
                        for (var i = 0; i < info.length; i++) {
                            alert(info[i].url);
                        }
                    }
                });
            });
            location.href = "dashboard.html";
        }
    }));
    localmenu.append(new gui.MenuItem({
        label: 'Delete',
        click: function() {
            $.getScript("controller/dbfunc.js", function(data, textStatus, jqxhr) {
                deleteELO(elotitle);
            });
            divobj.remove();
        }
    }));

    divobj.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        localmenu.popup(ev.x, ev.y);
        return false;
    });
}

// context for remote
function remoteContextMenu(divobj, eloURL, title) {
    remotemenu = new gui.Menu();
    remotemenu.append(new gui.MenuItem({
        label: 'Download',
        click: function() {
            var fs = require('fs');
            fs.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);

                $.getScript("controller/dbfunc.js", function(data, textStatus, jqxhr) {
                    importELO("", title, content.userName);
                });
            });
        }
    }));
    remotemenu.append(new gui.MenuItem({
        label: 'Purge',
        click: function() {
            var _elourl = eloURL.split("/");
            var eloID = _elourl[_elourl.length - 2];

            var fs = require('fs');
            fs.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);
                var request = require('request');

                request({
                    url: 'http://commonrepo.herokuapp.com/api/v1/elos/' + eloID + '/',
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Token ' + content.AUTHKEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }, function(error, response, body) {
                    alert("Purge Successful....");
                    location.href = "dashboard.html";
                });
            });
        }
    }));
    remotemenu.append(new gui.MenuItem({
        label: 'Publish',
        click: function() {

        }
    }));

    divobj.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        remotemenu.popup(ev.x, ev.y);
        return false;
    });
}