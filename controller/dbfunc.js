var Datastore = require('nedb'),
    path = require('path'),
    db = new Datastore({
        filename: path.join(require('nw.gui').App.dataPath, 'ELO.db')
    });

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

function importELO(elopath, title, name) {
    db.insert({
        elopath: elopath,
        title: title,
        name: name
    });
}

function importMetadata(elopath, group, node, value) {
    metadata.insert({
        elopath: elopath,
        group: group,
        node: node,
        value,
        value
    });
}