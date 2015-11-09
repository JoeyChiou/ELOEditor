// Count all documents in the datastore
function getCount() {
    db.count({}, function(err, count) {
        $("span:contains(Local ELOs) ~ span").text(count);
        $("span:contains(Remote ELOs) ~ span").text(count + 20);
        $("span:contains(Likes) ~ span").text(count + 10000);
        $("span:contains(Members) ~ span").text(count + 10908);
    });
}

function MT_Search(str) {
    var query = str.split(",");

    metadata.find({
        group: new RegExp(query[0]),
        node: new RegExp(query[1]),
        value: new RegExp(query[2])
    }, function(err, docs) {
        if (docs.length > 0) {
            for (var i = 0; i < docs.length; i++) {
                alert(docs[i].elopath);
            }
        }else{
            alert("none");
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

function intentView(elopath) {
    location.href = "eloviewer.html?elopath=" + elopath;
}