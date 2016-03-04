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

/* This javascript file has write functions for Author Manage initial. */

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
            $.get("http://www.commonrepo.com/api/v2/users/", function(data) {
                FRIENDS = data.length;
            }).done(function() {
                getGroupsCreated();
                getGroupsJoined();
                getFriends();
            });
        });
    });
});