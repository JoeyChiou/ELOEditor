function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //console.log("x:" + ev.pageX + " y:" + ev.pageY);
    //console.log("top:" + $("#" + data).position().top);
    document.getElementById("ulroot").insertBefore(document.getElementById(data), ev.target.parentNode.parentNode);
}

function viewELO(elopath) {
    globalPath = elopath;
    var path = elopath + "/";
    var jsdom = require("jsdom");

    jsdom.env({
        file: path + "elo_aggregation.xml",
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function(errors, window) {
            $("#search-result-treeview").append("<ul id='ulroot' class='list-group'></ul>");

            for (var i = 0; i < window.$("container").length; i++) {
                var containernode = new ContainerNode();
                containernode.ID = window.$("container")[i].getAttribute("id");
                containernode.TYPE = window.$("container")[i].getAttribute("type");
                containernode.DISPLAY_NAME = window.$("container")[i].getAttribute("display_name");
                containernode.URL_NAME = window.$("container")[i].getAttribute("url_name");

                cnArray[i] = containernode;

                $("#ulroot").append("<li id='" + containernode.ID + "' class='list-group-item' draggable='true' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)' oncontextmenu=ListContextMenu('" + containernode.ID + "')></li>");
                $("#" + containernode.ID).append("<ul id='ul_" + containernode.ID + "' class='list-group'>" + window.$("container")[i].getAttribute("display_name") + "</ul>");

                for (var j = 0; j < window.$("content").length; j++) {
                    if (window.$("content")[j].getAttribute("tid") == containernode.ID) {
                        var contentnode = new ContentNode();
                        contentnode.ID = window.$("content")[j].getAttribute("id");
                        contentnode.TID = window.$("content")[j].getAttribute("tid");
                        contentnode.TYPE = window.$("content")[j].getAttribute("type");
                        contentnode.URL_NAME = window.$("content")[j].getAttribute("url_name");

                        tnArray[i] = contentnode;

                        $("#ul_" + containernode.ID).append("<li class='list-group-item list-group-item-danger' onclick=iframe01.location.href='" + path + window.$("content")[j].getAttribute("tid") + "/" + contentnode.URL_NAME + ".html'>" + window.$("content")[j].getAttribute("url_name").toString() + "</li>");
                    }
                }
            }
        }
    });
}

// saveFile Dialog
function chooseFile(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
        var elopath = $(this).val();
        var ncp = require('ncp').ncp;

        ncp.limit = 16;
        ncp(globalPath, elopath, function(err) {
            if (err) {
                return console.error(err);
            }

            for (var i = 0; i < $("#ulroot").children().length; i++) {
                for (var j = 0; j < cnArray.length; j++) {
                    if ($("#ulroot").children().eq(i).attr("id") == cnArray[j].ID) {
                        newArray[i] = cnArray[j];
                        break;
                    }
                }
            }

            var writeString = "<manifest>";
            writeString += "<containers>";
            for (var i = 0; i < $("#ulroot").children().length; i++) {
                writeString += "<container id=\"" + newArray[i].ID + "\" type=\"cn\" display_name=\"" + newArray[i].DISPLAY_NAME + "\" url_name=\"" + newArray[i].URL_NAME + "\"/>";
            }
            writeString += "</containers>";

            writeString += "<contents>";
            for (var i = 0; i < tnArray.length; i++) {
                writeString += "<content id=\"" + tnArray[i].ID + "\" tid=\"" + tnArray[i].TID + "\" type=\"tn\" url_name=\"" + tnArray[i].URL_NAME + "\"/>"
            }
            writeString += "</contents>";
            writeString += "</manifest>";

            var fs = require('fs');
            fs.writeFile(elopath + '/elo_aggregation.xml', writeString, function(err) {
                console.log("Success Write File");

                /*$.getScript("controller/dbfunc.js", function(data, textStatus, jqxhr) {
                    importELO("/Users/JoeyChiou/Downloads/ELOs/" + name, "newELO", "Experkee");
                });*/
            });
        });
    });

    chooser.trigger('click');
}

// Save a New ELO
function saveELO(name) {
    chooseFile('#saveELODialog');
}

// Add 0 in ID
function padLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padLeft("0" + str, lenght);
}

// Insert a new node
function insertNodeBefore() {
    var newNodeCNID = "cn" + padLeft(cnArray.length + 1, 4);
    var newNodeCNName = $("#nodename").val().trim();
    var newNodeCNURL = $("#nodeurl").val().trim();

    var newNodeTNID = "tn" + padLeft(tnArray.length + 1, 4);

    $("#" + currentNodeID).before("<li id='" + newNodeCNID + "' class='list-group-item' draggable='true' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)'></li>");
    $("#" + newNodeCNID).append("<ul id='ul_" + newNodeCNID + "' class='list-group'>" + newNodeCNName + "</ul>");
    $("#ul_" + newNodeCNID).append("<li class='list-group-item list-group-item-danger' onclick=iframe01.location.href='" + newNodeCNURL + "'>" + newNodeCNName + "</li>");

    var containernode = new ContainerNode();
    containernode.ID = newNodeCNID;
    containernode.TYPE = "cn";
    containernode.DISPLAY_NAME = newNodeCNName;
    containernode.URL_NAME = newNodeTNID;

    var contentnode = new ContentNode();
    contentnode.ID = newNodeTNID;
    contentnode.TID = newNodeCNID;
    contentnode.TYPE = "tn";
    contentnode.URL_NAME = newNodeCNURL;

    cnArray[cnArray.length] = containernode;
    tnArray[tnArray.length] = contentnode;
}

// ContextMenu for PublicELO
function ListContextMenu(NodeID) {
    listmenu = new gui.Menu();
    listmenu.append(new gui.MenuItem({
        label: 'Insert before',
        click: function() {
            currentNodeID = NodeID;
            $("#ListModal").modal();
        }
    }));

    /*listmenu.append(new gui.MenuItem({
        label: 'Delete this node',
        click: function() {
            currentNodeID = NodeID;
            $("#currentNodeID").remove();
        }
    }));*/

    this.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        listmenu.popup(ev.x, ev.y);
        return false;
    });
}

// Container Node Constructor
function ContainerNode(ID, TYPE, DISPLAY_NAME, URL_NAME) {
    this.ID = ID;
    this.TYPE = TYPE;
    this.DISPLAY_NAME = DISPLAY_NAME;
    this.URL_NAME = URL_NAME;
}

// Content Node Constructor
function ContentNode(ID, TID, TYPE, URL_NAME) {
    this.ID = ID;
    this.TID = TID;
    this.TYPE = TYPE;
    this.URL_NAME = URL_NAME;
}

// Global Varible and Global Functions
var gui = require("nw.gui");
var cnArray = [];
var tnArray = [];
var newArray = [];
var currentNodeID;
var globalPath;