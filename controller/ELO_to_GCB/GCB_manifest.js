// Author: jeremy55662004@gmail.com
// 1.function gcb_manifest_content will write any other files under	package of course builder.
// 2.function gcb_manifest will call gcb_manifest_content() to write the manifest.json.



/* function gcb_manifest_content will write any other files under package of course builder. */
function gcb_manifest_content(filepath){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");


	fs.appendFile(gcb_path + "/manifest.json", 
	"\n\t{\n\t  \"is_draft\": false,\n\t  \"path\": " + filepath + "\n\t},", function(err){
										
		if(err) throw err;
  		console.log(' gcb_manifest_content was complete!');
	})
};


/* function gcb_manifest will call gcb_manifest_content() to write the manifest.json. */
/* Flow Control = CPS + Maintain function execution state */
function gcb_manifest(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");
	var count = 0;

	function serial(fn, r, cb) {
        var count = 0;
        next(r);
        function next(r){
            if(count < fn.length){
                fn[count](r, next);
                count++;
            }
            else{
                cb(r);
            }
        }
    };

	serial([
        function (r, next){
            setTimeout(function(){

            	fs.appendFile(gcb_path + "/manifest.json", "{\n  \"entities\": [", function(err){
													
					if(err) throw err;
			  		console.log(' First line of manifest.json was add!');
				})
                
                next(2*r);
            }, 50);
        },
        function (r, next){
            setTimeout(function(){ 
                fs.readdir(gcb_path + "/files/assets/css/", function(err, files){
					for(var i = 0 in files){

						var n = files[i].lastIndexOf(".");
	   					if(files[i].substr(n+1, files[i].length) == "css"){
							gcb_manifest_content("\"files/assets/css/" + files[i] + "\"");
						}
					}
				})

                next(2*r);
            }, 100);
        },
        function (r, next){
            setTimeout(function(){ 
                fs.readdir(gcb_path + "/files/assets/html/", function(err, files){
					for(var i = 0 in files){
						gcb_manifest_content("\"files/assets/html/" + files[i] + "\"");
					}
				})

                next(2*r);
            }, 150);
        },
        function (r, next){
            setTimeout(function(){ 
                fs.readdir(gcb_path + "/files/assets/img/", function(err, files){
					for(var i = 0 in files){
						gcb_manifest_content("\"files/assets/img/" + files[i] + "\"");
					}

					fs.appendFile(gcb_path + "/manifest.json", 
					"\n\t{\n\t  \"is_draft\": false,\n\t  \"path\": \"files/course.yaml\"\n\t},", function(err){
											
					if(err) throw err;
	  				console.log("record course.yaml was complete!");
					})

					console.log("image");
				})

                next(2*r);
            }, 200);
        },
        function (r, next){
            setTimeout(function(){ 
                fs.readdir(gcb_path + "/files/data/", function(err, files){
					for(var i = 0 in files){
						gcb_manifest_content("\"files/data/" + files[i] + "\"");
					}
				})

                next(2*r);
            }, 250);
        },
        function (r, next){
            setTimeout(function(){ 
                fs.readdir(gcb_path + "/models/", function(err, files){
					for(var i = 0 in files){
						count += 1;
						console.log(count);
						if( files.length == count){
							fs.appendFile(gcb_path + "/manifest.json",
							"\n\t{\n\t  \"is_draft\": false,\n\t  \"path\": \"models/" + files[i] + "\"\n\t}", function(err){
											
							if(err) throw err;
							})
						}
						else{
							gcb_manifest_content("\"models/" + files[i] + "\"");
						}
					}
				})

                next(2*r);
            }, 300);
        },
        function (r, next){
            setTimeout(function(){ 
                fs.appendFile(gcb_path + "/manifest.json",
				"\n  ],\n  \"raw\": \"course:/new_course::ns_new_course\",\n  \"version\": \"1.3\"\n}", function(err){
				
				if(err) throw err;
				console.log("raw was added");
				})

                next(2*r);
            }, 350);
        }], 1, function(r){console.log(r)});
};