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
            $("#" + divID).append("<ul class='users-list clearfix'></ul>");
            // var ul = document.createElement("ul");
            // ul.setAttribute("class", "users-list clearfix");
            // div.appendChild(ul);

            for (var i = 0; i < count; i++) {
                var title = docs[i].title;
                var name = docs[i].name;
                var elopath = docs[i].elopath;
                var li = document.createElement("li");
                li.setAttribute("onclick", "intentView('" + elopath + "')");
                li.setAttribute("oncontextmenu", "localContextMenu('" + title + "','" + name + "','" + elopath + "')");
                // localContextMenu(li, title, name, elopath);

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
                //ul.appendChild(li);
                $("#" + divID + " ul").append(li);
            }
        });
    });
}

function ELO_remotelist() {
    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);

        $.get("http://www.commonrepo.com/api/v2/users/" + content.userID + "/", function(data) {
            var div = document.getElementById("remoteELO");
            var ul = document.createElement("ul");
            ul.setAttribute("class", "users-list clearfix");
            for (var i = 0; i < data.elos.length; i++) {
                $.get("http://www.commonrepo.com/api/v2/elos/" + data.elos[i] + "/", function(data) {
                    var title = data.name;
                    var name = content.userName;
                    var li = document.createElement("li");
                    li.setAttribute("onclick", "intentViewRemoteELO('" + data.id + "')");
                    li.setAttribute("oncontextmenu", "remoteContextMenu('" + data.url + "','" + title + "','" + data.init_file + "')");
                    // remoteContextMenu(li, data.url, title, data.init_file);

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

        $.get("http://www.commonrepo.com/api/v2/elos/", function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].is_public == 1 && data[i].author != content.userID) {
                    $.get("http://www.commonrepo.com/api/v2/elos/" + data[i].id + "/", function(data2) {
                        $.get("http://www.commonrepo.com/api/v2/users/" + data2.author + "/", function(data3) {
                            var div = document.getElementById("remoteELO");
                            var ul = document.createElement("ul");
                            ul.setAttribute("class", "users-list clearfix");

                            var title = data2.name;
                            var name = data3.username;

                            var li = document.createElement("li");
                            li.setAttribute("onclick", "intentViewRemoteELO('" + data2.id + "')");
                            li.setAttribute("oncontextmenu", "remoteContextMenu('" + data2.url + "','" + title + "','" + data2.init_file + "')");
                            // remoteContextMenu(li, data2.url, title, data2.init_file);

                            var img = document.createElement("img");
                            img.setAttribute("src", "assets/img/bookr-64.png");
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
                            div.appendChild(ul);
                        });
                    });
                }
            }
        });
    });

}

function intentView(elopath) {
    location.href = "eloviewer.html?elopath=" + elopath;
}

function intentViewRemoteELO(eloID) {
    location.href = "eloviewerRemote.html?eloID=" + eloID;
}

// context for local
function localContextMenu(elotitle, eloname, elopath) {
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
            var AdmZip = require('adm-zip');
            var zip = new AdmZip();
            zip.addLocalFolder(elopath);
            zip.writeZip(elopath + elotitle + ".zip");

            var fs = require('fs');
            fs.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);
                var querystring = require('querystring');
                var request = require('request');

                var form = {
                    name: elotitle,
                    author: content.userID,
                    original_type: '1',
                    file: fs.createReadStream(elopath + elotitle + ".zip")
                };

                //var formData = querystring.stringify(form);

                request({
                    url: 'http://commonrepo.herokuapp.com/api/v2/elos/',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Token ' + content.AUTHKEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    formData: form
                }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {}
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
                $(this).remove();
                location.href = "dashboard.html";
            });
        }
    }));

    this.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        localmenu.popup(ev.x, ev.y);
        return false;
    });
}

// context for remote
function remoteContextMenu(eloURL, title, filepath) {
    remotemenu = new gui.Menu();
    remotemenu.append(new gui.MenuItem({
        label: 'Download',
        click: function() {
            var https = require('https');
            var fs = require('fs');

            var zipfile = "/Users/JoeyChiou/Downloads/ELOs/" + title + ".zip";
            var file = fs.createWriteStream(zipfile);
            var request = https.get(filepath, function(response) {
                response.pipe(file);
            });

            file.on('close', function() {
                var AdmZip = require('adm-zip');
                var zip = new AdmZip("/Users/JoeyChiou/Downloads/ELOs/" + title + ".zip");
                zip.extractAllTo("/Users/JoeyChiou/Downloads/ELOs/" + title, true);

                $.getScript("controller/dbfunc.js", function(data, textStatus, jqxhr) {
                    importELO("/Users/JoeyChiou/Downloads/ELOs/" + title, title, "TestMan");
                });

                //$("#dashboardModal1").modal();
                //location.href = "dashboard.html";
            });
            $("#dashboardModal1").modal();
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
                    url: 'http://commonrepo.herokuapp.com/api/v2/elos/' + eloID + '/',
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Token ' + content.AUTHKEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }, function(error, response, body) {
                    //if(!error && response.statusCode == 200)
                });
            });
            location.href = "dashboard.html";
        }
    }));
    remotemenu.append(new gui.MenuItem({
        label: 'Publish',
        click: function() {
            var _elourl = eloURL.split("/");
            var eloID = _elourl[_elourl.length - 2];

            var fs = require('fs');
            fs.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);
                var querystring = require('querystring');
                var request = require('request');

                request({
                    url: 'http://commonrepo.herokuapp.com/api/v2/elos/' + eloID + '/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + content.AUTHKEY
                    },
                    json: true,
                    body: {
                        "is_public": "1"
                    }
                }, function(error, response, body) {
                    //if(!error && response.statusCode == 200)
                    console.log("status:" + response.statusCode);
                    console.log("body:" + body);
                });
            });
            location.href = "dashboard.html";
        }
    }));

    this.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        remotemenu.popup(ev.x, ev.y);
        return false;
    });
}

function groupJoin() {
    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);

        // url: 'http://www.commonrepo.com/api/v2/groups/join/' + groupID + '/',
        var request = require('request');
        request({
            url: 'http://www.commonrepo.com/api/v2/groups/join/3/',
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + content.AUTHKEY,
                'Content-Type': 'application/json'
            }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {

            } else {
                console.log("response:" + response.statusCode);
                console.log("body:" + body);
            }
        });
    });
}