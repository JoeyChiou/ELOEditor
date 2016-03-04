/**
    Copyright 2016 edX PDR Lab, National Central University, Taiwan.
    
        http://edxpdrlab.ncu.cc/
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    
    Created By: joeyc0916@gmail.com
    Maintained By: joeyc0916@gmail.com
*/

/* This javascript file has write functions for control ELO. */

// Search Metadata for ELO
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

// Local ELO list
function ELO_locallist() {
    db.count({}, function(err, count) {
        db.find({}, function(err, docs) {
            // db.find({}).sort({
            //     _id: 1
            // }).exec(function(err, docs) {
            // var div = document.getElementById("localELO");
            $("#localELO").append("<ul class='users-list clearfix'></ul>");

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
                $("#localELO ul").append(li);
            }
        });
    });
}

// ContextMenu for LocalELO
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

// Remote ELO list
function ELO_remotelist() {
    console.log("ELO_remotelist Function");
    $("#remoteELO").append("<ul id='remoteELO_ul' class='users-list clearfix'></ul>");

    for (var count = 0; count < ELOS.length; count++) {
        if (ELOS[count].author == USERID) {
            $("#remoteELO_ul").append("<li id='remoteELO_li_" + ELOS[count].id + "' onclick=intentViewRemoteELO('" + ELOS[count].id + "') oncontextmenu=remoteContextMenu('" + ELOS[count].id + "','" + ELOS[count].url + "','" + encodeURI(ELOS[count].name) + "','" + ELOS[count].init_file + "','" + ELOS[count].is_public + "')></li>");

            if (ELOS[count].is_public == 1)
                $("#remoteELO_li_" + ELOS[count].id).append("<img src='assets/img/bookr-64.png' alt='User Image'></img>");
            else
                $("#remoteELO_li_" + ELOS[count].id).append("<img src='assets/img/book-64.png' alt='User Image'></img>");

            $("#remoteELO_li_" + ELOS[count].id).append("<a class='users-list-date'>" + ELOS[count].name + "</a>");
            $("#remoteELO_li_" + ELOS[count].id).append("<span class='users-list-date'>" + AUTHORS[ELOS[count].author] + "</span>");
        }
    }
}

// ContextMenu for Remote ELO
function remoteContextMenu(eloID, eloURL, title, filepath, publicvalue) {
    console.log("remoteContextMenu");
    remotemenu = new gui.Menu();
    remotemenu.append(new gui.MenuItem({
        label: 'Download',
        click: function() {
            var https = require('https');
            var fs = require('fs');
            var fsUserInfo = require('fs');
            var creatorName;

            fsUserInfo.readFile('collections/users.json', function(err, filedata) {
                var content = JSON.parse(filedata);
                creatorName = content.userName;
            });

            var zipfile = "/Users/JoeyChiou/Downloads/ELOs/" + decodeURI(title) + ".zip";
            console.log("zip:" + zipfile);
            console.log("path:" + filepath);
            var file = fs.createWriteStream(zipfile);
            var request = https.get(filepath, function(response) {
                response.pipe(file);
            });

            file.on('close', function() {
                var AdmZip = require('adm-zip');
                var zip = new AdmZip("/Users/JoeyChiou/Downloads/ELOs/" + decodeURI(title) + ".zip");
                zip.extractAllTo("/Users/JoeyChiou/Downloads/ELOs/" + decodeURI(title), true);

                $.getScript("controller/dbfunc.js", function(data, textStatus, jqxhr) {
                    importELO("/Users/JoeyChiou/Downloads/ELOs/" + decodeURI(title), decodeURI(title), creatorName);
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
                    if (!error && response.statusCode == 200)
                        console.log("Publish request finish.");
                });
            });

            var shareURL = "https://plus.google.com/share?url={http://www.commonrepo.com/elos/" + eloID + "/}";
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

// Public ELO list
function ELO_publiclist() {
    console.log("ELO_publiclist Function");
    $("#publicELO").append("<ul id='publicELO_ul' class='users-list clearfix'></ul>");

    for (var count = 0; count < ELOS.length; count++) {
        if (ELOS[count].is_public == 1 && ELOS[count].author != USERID) {
            $("#publicELO_ul").append("<li id='publicELO_li_" + ELOS[count].id + "' onclick=intentViewRemoteELO('" + ELOS[count].id + "') oncontextmenu=publicContextMenu('" + ELOS[count].id + "','" + ELOS[count].url + "','" + ELOS[count].name + "','" + ELOS[count].init_file + "')></li>");
            $("#publicELO_li_" + ELOS[count].id).append("<img src='assets/img/booko-64.png' alt='User Image'></img>");
            $("#publicELO_li_" + ELOS[count].id).append("<a class='users-list-date'>" + ELOS[count].name + "</a>");
            $("#publicELO_li_" + ELOS[count].id).append("<span class='users-list-date'>" + AUTHORS[ELOS[count].author] + "</span>");
            // var li = document.createElement("li");
            // li.setAttribute("id", "publicELO_li_" + ELOS[count].id);
            // li.setAttribute("onclick", "intentViewRemoteELO('" + ELOS[count].id + "')");
            // li.setAttribute("oncontextmenu", "publicContextMenu('" + ELOS[count].id + "','" + ELOS[count].url + "','" + ELOS[count].name + "','" + ELOS[count].init_file + "')");
        }
    }
}

// ContextMenu for PublicELO
function publicContextMenu(eloID, eloURL, title, filepath) {
    publicmenu = new gui.Menu();
    publicmenu.append(new gui.MenuItem({
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
        publicmenu.popup(ev.x, ev.y);
        return false;
    });
}

// Intent to view local ELO content
function intentView(elopath) {
    location.href = "eloviewer.html?elopath=" + elopath;
}

// Intent to view remote ELO information
function intentViewRemoteELO(eloID) {
    location.href = "eloviewerRemote.html?eloID=" + eloID;
}


// Invite a user to join group
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

// ELO Object Initial
function objELO(id, url, name, init_file, is_public, author) {
    this.id = id;
    this.url = url;
    this.name = name;
    this.init_file = init_file;
    this.is_public = is_public;
    this.author = author;
}


// Global Varible and Global Functions
var USERID;
var AUTHORS = [];
var ELOS = [];

$(function() {
    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);
        USERID = content.userID;

        $.get("http://www.commonrepo.com/api/v2/users/", function(data) {
            console.log("author");
            for (var count = 0; count < data.length; count++) {
                AUTHORS[data[count].id] = data[count].username;
            }
        }).done(function() {
            /*$.get("http://www.commonrepo.com/api/v2/elos/", function(data) {
                console.log("elos");
                for (var count = 0; count < data.length; count++) {
                    var elo = new objELO();
                    elo.id = data[count].id;
                    elo.url = "http://www.commonrepo.com/api/v2/elos/" + data[count].id + "/";
                    elo.name = data[count].name;
                    elo.init_file = data[count].init_file;
                    elo.is_public = data[count].is_public;
                    elo.author = data[count].author;
                    ELOS[count] = elo;
                }
            }).done(function() {
                ELO_remotelist();
                ELO_publiclist();
            });*/
            var request = require('request');
            request({
                url: 'http://www.commonrepo.com/api/v2/elos/',
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + content.AUTHKEY,
                    'Content-Type': 'application/json'
                }
            }, function(error, response, body) {
                if (!error) {
                    console.log("elos");
                    var data = JSON.parse(body);
                    for (var count = 0; count < data.length; count++) {
                        var elo = new objELO();
                        elo.id = data[count].id;
                        elo.url = "http://www.commonrepo.com/api/v2/elos/" + data[count].id + "/";
                        elo.name = data[count].name;
                        elo.init_file = data[count].init_file;
                        elo.is_public = data[count].is_public;
                        elo.author = data[count].author;
                        ELOS[count] = elo;
                    }

                    ELO_remotelist();
                    ELO_publiclist();
                }
            });
        });
    });
});