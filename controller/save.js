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

// database example

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