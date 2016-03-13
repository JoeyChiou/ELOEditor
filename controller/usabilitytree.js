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

/* This javascript file has write functions for Usability Tree for ELO. */

// Click ELO Node Event
function update(ID) {
    $("#eloinfo").empty();

    for (var index = 0; index < eloTreeArray.length; index++) {
        if (eloTreeArray[index].elo_id == ID) {
            $("#eloinfo").append("<p>Diversity " + eloID + " To " + ID + " is " + eloTreeArray[index].elo_similarity + "</p>");
            $("#eloinfo").append("<p>Similarity " + eloID + " To " + ID + " is " + eloTreeArray[index].elo_diversity + "</p>");
        }
    }

    $("#myModal").modal();
}

// Build Root Node in ELO Tree
function buildTree(elotree) {
    $("#reftree").append("<ul><li id='li_" + elotree.elo_id + "'><a href='#' onclick=update('" + elotree.elo_id + "')>" + elotree.elo_id + "</a></li></ul>");

    eloTreeArray[eloTreeCount] = elotree;
    eloTreeCount++;

    buildTreeNodes(elotree);
}

// Build Nodes in ELO Tree
function buildTreeNodes(elotree) {
    if (elotree.child_elo.length > 0) {
        $("#li_" + elotree.elo_id).append("<ul></ul>");

        for (var index = 0; index < elotree.child_elo.length; index++) {
            var node = new eloTree();
            node.child_elo = elotree.child_elo[index].child_elo;
            node.elo_similarity = elotree.child_elo[index].elo_similarity;
            node.elo_diversity = elotree.child_elo[index].elo_diversity;
            node.elo_id = elotree.child_elo[index].elo_id;

            eloTreeArray[eloTreeCount] = node;
            eloTreeCount++;

            if (node.elo_id == eloID)
                $("#li_" + elotree.elo_id + " > ul").append("<li id='li_" + node.elo_id + "'><a href='#' style='background-color: yellow;' onclick=update('" + node.elo_id + "')>" + node.elo_id + "</a></li>");
            else
                $("#li_" + elotree.elo_id + " > ul").append("<li id='li_" + node.elo_id + "'><a href='#' onclick=update('" + node.elo_id + "')>" + node.elo_id + "</a></li>");

            buildTreeNodes(node);
        }
    }
}

// eloTree Initial
function eloTree(child_elo, elo_similarity, elo_diversity, elo_id) {
    this.child_elo = child_elo;
    this.elo_similarity = elo_similarity;
    this.elo_diversity = elo_diversity;
    this.elo_id = elo_id;
}

// Global Varible and Global Functions
var str = decodeURI(location.search);
var tempID = str.split("=");
var eloID = tempID[tempID.length - 1];
var eloTreeArray = [];
var eloTreeCount = 0;

$(function() {
    $.get("http://www.commonrepo.com/api/v2/elos/" + eloID + "/", function(data) {
        var node = data.reusability_tree.tree[0];

        var elotree = new eloTree();
        elotree.child_elo = node.child_elo;
        elotree.elo_similarity = node.elo_similarity;
        elotree.elo_diversity = node.elo_diversity;
        elotree.elo_id = node.elo_id;

        buildTree(elotree);
    });
});