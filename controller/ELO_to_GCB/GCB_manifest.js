function gcb_manifest_content(filepath){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB " + new_file_name.replace(/ /g, "_");


	fs.appendFile(gcb_path + "/manifest.json", 
	"\n\t{\n\t  \"is_draft\": false,\n\t  \"path\": " + filepath + "\n\t},", function(err){
										
		if(err) throw err;
  		console.log(' gcb_manifest_content was complete!');
	})
};


function gcb_manifest(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB " + new_file_name.replace(/ /g, "_");
	var count = 0;

	fs.open(gcb_path + "/manifest.json", "w", function(err,fd){
		if(err) throw err;

		else{
			var buf = new Buffer("{\n  \"entities\": [");

			fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer){
				if(err) throw err;
    			console.log(err, written, buffer);
			})

			fs.readdir(gcb_path + "/files/assets/css/", function(err, files){
				for(var i = 0 in files){

					var n = files[i].lastIndexOf(".");
   					if(files[i].substr(n+1, files[i].length) == "css"){
						gcb_manifest_content("\"files/assets/css/" + files[i] + "\"");
					}
				}
			})

			fs.readdir(gcb_path + "/files/assets/html/", function(err, files){
				for(var i = 0 in files){
					gcb_manifest_content("\"files/assets/html/" + files[i] + "\"");
				}
			})

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

			fs.readdir(gcb_path + "/files/data/", function(err, files){
				for(var i = 0 in files){
					gcb_manifest_content("\"files/data/" + files[i] + "\"");
				}
			})

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

			setTimeout(function(){
				fs.appendFile(gcb_path + "/manifest.json",
				"\n  ],\n  \"raw\": \"course:/new_course::ns_new_course\",\n  \"version\": \"1.3\"\n}", function(err){
				
				if(err) throw err;
				console.log("raw was added");
				})
			}, 10)

			fs.close(fd, function(err){										/* close course.yaml file */
				if(err) throw err;
				console.log("manifest.json closed successfully !");
			})

		}
	})

};