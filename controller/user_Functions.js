var gui = require("nw.gui");

function getGroupsCreated() {
    $("#span_groups_created").html(GROUPSCREATED.length);
}

function getGroupsJoined() {
    $("#span_groups_joined").html(GROUPSJOINED.length);
}

function getFriends() {
    $("#span_friends").html(FRIENDS);
}

// Global Varible and Global Functions
var GROUPSCREATED = [];
var GROUPSJOINED = [];
var FRIENDS = 0;

$(function() {
    var fs = require('fs');
    fs.readFile('collections/users.json', function(err, filedata) {
        var content = JSON.parse(filedata);
        var USERID = content.userID;

        $.get("http://www.commonrepo.com/api/v2/users/" + USERID + "/", function(data) {
            for (var count = 0; count < data.commonrepo_groups.length; count++) {
                GROUPSCREATED[count] = data.commonrepo_groups[count];
            }

            for (var count = 0; count < data.commonrepo_groups_members.length; count++) {
                GROUPSJOINED[count] = data.commonrepo_groups_members[count];
            }
        }).done(function() {
            for (var count1 = 0; count1 < GROUPSCREATED.length; count1++) {
                $.get("http://www.commonrepo.com/api/v2/groups/" + GROUPSCREATED[count1] + "/", function(data) {
                    FRIENDS += data.members.length;
                }).done(function() {
                    for (var count2 = 0; count2 < GROUPSJOINED.length; count2++) {
                        $.get("http://www.commonrepo.com/api/v2/groups/" + GROUPSJOINED[count2] + "/", function(data2) {
                            FRIENDS += data2.members.length - 1;
                        }).done(function() {
                            getGroupsCreated();
                            getGroupsJoined();
                            getFriends();
                        });
                    }
                });
            }
        });
    });
});