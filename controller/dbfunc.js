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

// Build the Database file for ELOs
var Datastore = require('nedb'),
    path = require('path'),
    db = new Datastore({
        filename: path.join(require('nw.gui').App.dataPath, 'ELO.db')
    });


// Build the Database file for ELO's Metadata
var Datastore2 = require('nedb'),
    path = require('path'),
    metadata = new Datastore({
        filename: path.join(require('nw.gui').App.dataPath, 'ELOMatadata.db')
    });

db.loadDatabase(function(err) { // Callback is optional
    // Now commands will be executed
    /*db.count({}, function (err, count){
        db.insert({ title: "ELO Test "+count, name: "Timothy K. Shih" });
        db.insert({ title: "ELO Test "+(count+1), name: "Xaver Y.R. Chen" });
        db.insert({ title: "ELO Test "+(count+2), name: "Joey Chiou" });
        db.insert({ title: "ELO Test "+(count+3), name: "Hannibal J.H. Hsieh" });
    });*/
});

metadata.loadDatabase(function(err) {

});

//db.insert([{ name: "TestMan" }, { value: 42 }, { type: "obj" }]
// err is a 'uniqueViolated' error
// The database was not modified
//alert(""+err);
//);

// Insert for import ELO
function importELO(elopath, title, name) {
    db.insert({
        elopath: elopath,
        title: title,
        name: name
    });
}

// Insert for import ELO's Metadata
function importMetadata(elopath, group, node, value) {
    group = group.toUpperCase();
    metadata.insert({
        elopath: elopath,
        group: group,
        node: node,
        value,
        value
    });
}

// Delete ELO
function deleteELO(title) {
    db.remove({
        title: title
    }, {}, function(err, numRemoved) {
    });
}