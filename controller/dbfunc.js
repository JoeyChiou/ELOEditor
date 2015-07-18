var Datastore = require('nedb'), path = require('path'), db = new Datastore({
	filename: path.join(require('nw.gui').App.dataPath, 'ELO.db')
});
	
db.loadDatabase(function (err) {    // Callback is optional
	// Now commands will be executed
	/*db.count({}, function (err, count){
		db.insert({ title: "ELO Test "+count, name: "Timothy K. Shih" });
		db.insert({ title: "ELO Test "+(count+1), name: "Xaver Y.R. Chen" });
		db.insert({ title: "ELO Test "+(count+2), name: "Joey Chiou" });
		db.insert({ title: "ELO Test "+(count+3), name: "Hannibal J.H. Hsieh" });
	});*/
});

//db.insert([{ name: "TestMan" }, { value: 42 }, { type: "obj" }]
  // err is a 'uniqueViolated' error
  // The database was not modified
  //alert(""+err);
//);

// Count all documents in the datastore
function getCount(){
	db.count({}, function (err, count) {
		$("span:contains(Local ELOs) ~ span").text(count);
		$("span:contains(Remote ELOs) ~ span").text(count+20);
		$("span:contains(Likes) ~ span").text(count+10000);
		$("span:contains(Members) ~ span").text(count+10908);
	});
}

function importELO(elopath, title, name){
	db.insert({ elopath: elopath, title: title, name: name });
}