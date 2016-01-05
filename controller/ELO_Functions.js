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

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    document.getElementById("ulroot").insertBefore(document.getElementById(data), ev.target.parentNode.parentNode);
}

function viewELO(elopath) {
    var path = elopath + "/";
    var jsdom = require("jsdom");

    jsdom.env({
        file: path + "elo_aggregation.xml",
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function(errors, window) {
            var tnID;
            $("#search-result-treeview").append("<ul id='ulroot' class='list-group'></ul>");

            for (var i = 0; i < window.$("container").length; i++) {
                tnID = window.$("container")[i].getAttribute("id");
                $("#ulroot").append("<li id='li_" + tnID + "' class='list-group-item' draggable='true' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)'></li>");
                $("#li_" + tnID).append("<ul id='ul_" + tnID + "' class='list-group'>" + window.$("container")[i].getAttribute("display_name") + "</ul>");

                for (var j = 0; j < window.$("content").length; j++) {
                    if (window.$("content")[j].getAttribute("tid") == tnID) {
                        var URL = path + window.$("content")[j].getAttribute("tid") + "/" + window.$("content")[j].getAttribute("url_name") + ".html";
                        $("#ul_" + tnID).append("<li class='list-group-item list-group-item-danger' onclick=iframe01.location.href='" + URL + "'>" + window.$("content")[j].getAttribute("url_name").toString() + "</li>");
                    }
                }
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
                $("#" + divID + " ul").append(li);
            }
        });
    });
}

function ELO_remotelist() {
    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);

        $.get("http://www.commonrepo.com/api/v2/users/" + content.userID + "/").done(function(data) {
            var div = document.getElementById("remoteELO");
            var ul = document.createElement("ul");
            ul.setAttribute("class", "users-list clearfix");

            for (var i = 0; i < data.elos.length; i++) {
                $.get("http://www.commonrepo.com/api/v2/elos/" + data.elos[i] + "/").done(function(data) {
                    var title = data.name;
                    var name = content.userName;
                    var li = document.createElement("li");
                    var publicvalue;
                    li.setAttribute("onclick", "intentViewRemoteELO('" + data.id + "')");
                    if (data.is_public == 1) {
                        publicvalue = 0;
                    } else {
                        publicvalue = 1;
                    }

                    li.setAttribute("oncontextmenu", "remoteContextMenu('" + data.id + "','" + data.url + "','" + title + "','" + data.init_file + "','" + publicvalue + "')");
                    // remoteContextMenu(li, data.url, title, data.init_file);

                    if (data.is_public == 1) {
                        var img = document.createElement("img");
                        img.setAttribute("src", "assets/img/bookr-64.png");
                        img.setAttribute("alt", "User Image");
                    } else {
                        var img = document.createElement("img");
                        img.setAttribute("src", "assets/img/book-64.png");
                        img.setAttribute("alt", "User Image");
                    }

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
    });

}

function getAuthors(authors, callback) {
    console.log("getAuthors");
    $.get("http://www.commonrepo.com/api/v2/users/").done(function(data) {
        for (var count = 0; count < data.length; count++) {
            authors[data[count].id] = data[count].username;
        }
        console.log("getAuthors end");
    });
    callback();
}

function ELOobj(id, name, author, init_file) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.init_file = init_file;
}

function CB2(elos, callback) {
    console.log("CB2 func");
    var elo;
    $.get("http://www.commonrepo.com/api/v2/elos/").done(function(data) {
        for (var count = 0; count < data.length; count++) {
            elo = new ELOobj();
            elo.id = data[count].id;
            elo.name = data[count].name;
            elo.author = data[count].author;
            elo.init_file = data[count].init_file;
            elos[count] = elo;
        }
        console.log("CB2 func end");
    });
    callback();
}

function CB3(elos, callback) {
    console.log("elo:" + elos.length);
    callback();
}

function ELO_publiclist() {
    var authors = {};
    var elos = {};

    getAuthors(authors, function() {
        CB2(elos, function() {
            CB3(elos, function() {
                console.log("Main");
            });
        });
    });
    // var authors = {};
    // getAuthors(authors);
    // var authors = getAuthors();
    // console.log("auth:"+authors.length);

    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);
        var elos;

        // var div = document.getElementById("publicELO");
        //var ul = document.createElement("ul");
        //ul.setAttribute("class", "users-list clearfix");
        // div.appendChild(ul);
        $("#publicELO").append("<ul id='publicELO_ul' class='users-list clearfix'></ul>");

        $.get("http://www.commonrepo.com/api/v2/elos/").done(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].is_public == 1 && data[i].author != content.userID) {
                    //$.get("http://www.commonrepo.com/api/v2/users/" + data[i].author + "/", function(data2) {
                    var url = "http://www.commonrepo.com/api/v2/elos/" + data[i].id + "/";
                    var ID = data[i].id;
                    var NAME = data[i].name;
                    var FILE = data[i].init_file;

                    var li = document.createElement("li");
                    li.setAttribute("id", "publicELO_li_" + ID);
                    li.setAttribute("onclick", "intentViewRemoteELO('" + ID + "')");
                    li.setAttribute("oncontextmenu", "publicContextMenu('" + ID + "','" + url + "','" + NAME + "','" + FILE + "')");

                    var img = document.createElement("img");
                    img.setAttribute("src", "assets/img/booko-64.png");
                    img.setAttribute("alt", "User Image");

                    var a = document.createElement("a");
                    a.setAttribute("class", "users-list-date");
                    a.innerHTML = NAME;

                    var span = document.createElement("span");
                    span.setAttribute("class", "users-list-date");
                    span.innerHTML = authors[data[i].author];

                    li.appendChild(img);
                    li.appendChild(a);
                    li.appendChild(span);
                    $("#publicELO_ul").append(li);
                    //ul.appendChild(li);
                    //});
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
            });
            location.href = "dashboard.html";
        }
    }));

    this.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        localmenu.popup(ev.x, ev.y);
        return false;
    });
}

// context for remote
function remoteContextMenu(eloID, eloURL, title, filepath, publicvalue) {
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

                location.href = "dashboard.html";
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
        label: 'Publish or UnPublish',
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
                        "is_public": publicvalue
                    }
                }, function(error, response, body) {
                    //if(!error && response.statusCode == 200)
                    console.log("status:" + response.statusCode);
                    console.log("body:" + body);
                });
            });

            var shareURL = "https://plus.google.com/share?url={" + filepath + "}";
            $("#gplus").attr("href", shareURL);
            $("#gplus").click();

            location.href = "dashboard.html";
        }
    }));

    this.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        remotemenu.popup(ev.x, ev.y);
        return false;
    });
}

// context for public
function publicContextMenu(eloID, eloURL, title, filepath) {
    remotemenu = new gui.Menu();
    remotemenu.append(new gui.MenuItem({
        label: 'Fork',
        click: function() {
            var fs = require('fs');
            fs.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);
                var request = require('request');
                request({
                    url: 'http://www.commonrepo.com/api/v2/elos/fork/' + eloID + '/',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Token ' + content.AUTHKEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }, function(error, response, body) {
                    console.log("response:" + response.statusCode);
                    console.log("body:" + body);
                    if (!error && response.statusCode == 200) {

                    }
                });
            });
            $("#dashboardModal1").modal();
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