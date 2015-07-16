var Datastore = require('nedb'), path = require('path'), db = new Datastore({
	filename: path.join(require('nw.gui').App.dataPath, 'something.db')
});

//alert("p"+path.join(require('nw.gui').App.dataPath, 'something.db'));
	
db.loadDatabase(function (err) {    // Callback is optional
	// Now commands will be executed
	//alert("err");
});

//db.insert([{ name: "TestMan" }, { value: 42 }, { type: "obj" }]
  // err is a 'uniqueViolated' error
  // The database was not modified
  //alert(""+err);
//);