function Units_open_aggregation_file(myunitfile, k){
	//console.log(myunitfile);

	var x = document.getElementById("fileImportDialog");
	var message = "";
	var fs = require("fs");
	var buf = new Buffer(1000000);								/* buffer like an array (1MB)*/

	if ("files" in x) {
		if(x.files.length == 0){
			message = "Select a GCB file.";
		}
		else{
				var file = x.files[0];								/* x.files[0] for the first file */
				var units_elo_path = file.path.replace(file.name, "") + "Units_ELO_" + file.name.replace(/ /g, "_");
				if("name" in file){
					message += "You selected a file : " + file.name + "<br>";
				}
				console.log("Going to read GCB directory");
				coursejsonpath = file.path + "/files/data/course.json";		/* To find where is course.json file */
				
				fs.open(coursejsonpath, "r", function(err, fd){
					if(err){
						return console.error(err);
					}
					console.log("course.json opened successfully!");
					console.log("Going to read the course.json file");
					fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){		/* read course.json file */
						if(err){
							console.log(err);
						}
						else if(bytes > 0){
							var content = buf.slice(0, bytes).toString();    		/* read all file and becoming string */
							var obj = JSON.parse(content);							/* convert to javascript (object)*/

							fs.open(units_elo_path + "/" + myunitfile + "/elo_aggregation.xml", "w", function(err,fd){
								if(err) throw err;

								var count = 0;
								var count1 = 0;
								var count2 = 0;
								var count3 = 0;
								var urlnamearr = [];

								var buf1 = new Buffer("<manifest>\n" + "\t<containers>\n");

								fs.write(fd, buf1, 0, buf1.length, 0, function(err, written, buffer){
									if(err) throw err;
    								console.log(err, written, buffer);
								})

								//console.log(myunitfile);
								//console.log(k);

								if(obj.units[k].type == "U"){							/* for units */
									count += 1;
									var myunit = [];
									myunit[count] = obj.units[k].title;
									console.log(myunit);

									for(var i = 0; i < obj.lessons.length; i++){
										if((obj.lessons[i].auto_index == true)&&
											(obj.units[k].unit_id == obj.lessons[i].unit_id)){
											count3 += 1;
										}
									}

									urlnamearr[1] = 1;

									/* create cn file */
									fs.mkdir(units_elo_path + "/" + myunitfile + "/cn" + pad(count,4), function(err){
										if(err) throw err;
									})


									fs.appendFile(units_elo_path + "/" + myunitfile + "/elo_aggregation.xml", 
									"\t\t<container id=\"cn" + pad(count,4) + "\" type=\"cn\" display_name=\"" + myunit[count] +
									"\" url_name=\"tn" + pad(urlnamearr[count],4) + "\"/>\n", function(err){
										
										if(err) throw err;
  										console.log('Units was appended to file!');
									})

									urlnamearr[count+1] = count3 + 1;
								}

								fs.appendFile(units_elo_path + "/" + myunitfile + "/elo_aggregation.xml",
								"\t</containers>\n\n\t<contents>\n", function(err){
									if(err) throw err;
								})


								if(obj.units[k].type == "U"){
									count1 += 1;
									for(var i = 0; i < obj.lessons.length; i++){			/* for lessons & fewer than its length */ 
										if((obj.lessons[i].auto_index == true)&&
											(obj.units[k].unit_id == obj.lessons[i].unit_id)){
										
											count2 += 1;
											var mynotes = obj.lessons[i].notes.split("/");
											mynotes[2] = mynotes[2].replace(/ /g, "_");		/* change path to correct */
											mynotes[2] = mynotes[2].replace(/.html/, "");
											console.log(mynotes[2]);

											fs.appendFile(units_elo_path + "/" + myunitfile + "/elo_aggregation.xml",
											"\t\t<content id=\"tn" + pad(count2,4) + "\" tid=\"cn" + pad(count1,4) + 
											"\" type=\"tn\" url_name=\"" + mynotes[2] + "\"/>\n", function(err){

												if(err) throw err;
											})
										}
									}
								}

								fs.appendFile(units_elo_path + "/" + myunitfile + "/elo_aggregation.xml",
								"\t</contents>\n</manifest>",function(err){
									if(err) throw err;
								})

								fs.close(fd, function(){							/* close aggregation.xml file */
      								console.log('Done');
    							})
							})

						}
					})

					fs.close(fd, function(err){										/* close course.json file */
						if(err){
							console.log(err);
						}
						console.log("GCB File closed successfully !");
					})
				})
		}
	}
	else{
		if(x.value = ""){
			message += "Select a GCB file";
		}
		else{
			message += "The files property is not supported by your browerser!";
		}
	}

	document.getElementById("demo").innerHTML = message;
};


function Units_createfile(myfile){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file1 = y.files[0];
	var units_elo_path = file1.path.replace(file1.name, "") + "Units_ELO_" + file1.name.replace(/ /g, "_");
	var unit_file = fs.readdirSync(units_elo_path);
	var s2 =  "xml_file opened successfully !";
	var s3 =  "xml_file closed successfully !";

	for(var k = 0; k < unit_file.length; k++){

		var s1 = units_elo_path + "/" + unit_file[k] + "/xml_file";

		fs.open(s1.replace(/xml_file/, myfile), "w", function(err, fd){
			if(err) throw err;

			console.log(s2.replace(/xml_file/, myfile));
			fs.close(fd, function(err){
				if(err){
					console.log(err);
				}
				console.log(s3.replace(/xml_file/, myfile));
			})
		})
	}
};


function Units_mkdirectory(){													/* make directory */
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file2 = y.files[0];
	var units_elo_path = file2.path.replace(file2.name, "") + "Units_ELO_" + file2.name.replace(/ /g, "_");
	var coursejsonpath = file2.path + "/files/data/course.json";		/* To find where is course.json file */
	var buf = new Buffer(1000000);										/* buffer like an array (1MB) */
	var count = -1;


	fs.mkdir(units_elo_path,function(err){
		fs.open(coursejsonpath, "r", function(err, fd){
			if(err) throw err;

			fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){		/* read course.json file */
				if(err) throw err;
				else{
					var content = buf.slice(0, bytes).toString();    		/* read all file and becoming string */
					var obj = JSON.parse(content);							/* convert to javascript (object)*/

					fs.close(fd, function(err){
						if(err) throw err;
						console.log("course.json was closed successfully !");
					})

					for(var j = 0; j < obj.units.length; j++){				/* for units */

						if(obj.units[j].type == "U"){
							count += 1;
							var myunit = [];
							myunit[count] = obj.units[j].title;
							console.log(myunit);

							if(-1 !== myunit[count].search("/")){
								myunit[count] = myunit[count].replace(/\//g, "_");
							}

							var unit = count + 1; 
							fs.mkdir(units_elo_path + "/ELO_" + unit + "_" + myunit[count].replace(/ /g, "_"), function(err){
								// In fs.mkdir(), variable count was counted over
								if(err) throw err;
								else{
									console.log("ELO created successfully !");
									Units_createfile("elo_aggregation.xml");
									Units_createfile("elo_manifest.xml");
									Units_createfile("elo_metadata.xml");
								}
							})

							// you should write this outside fs.mkdir to avoid variable count was counted over
							Units_open_aggregation_file("ELO_" + unit + "_" + myunit[count].replace(/ /g, "_"), j);
							Units_open_manifest_file("ELO_" + unit + "_" + myunit[count].replace(/ /g, "_"));
						}
					}
				}
			})
		})
	})
};


function pad(n, width, z){
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;    /* if statement & to be string*/
};


function Units_open_manifest_file(myunitfile){
	var fs = require("fs");
	var buf1 = new Buffer(1000000);

	var y = document.getElementById("fileImportDialog");

	var file3 = y.files[0];
	var units_elo_path = file3.path.replace(file3.name, "") + "Units_ELO_" + file3.name.replace(/ /g, "_");
	var elo_manifest_path = units_elo_path + "/" + myunitfile + "/elo_manifest.xml";

	fs.open(elo_manifest_path, "w", function(err,fd){
		
		fs.appendFile(elo_manifest_path, 
		"<elo name=\"" + myunitfile + "\"" + " org=\"MINE Lab\" id=\"elo00002001\" type=\"Course Builder\"/>",
		function(err){
			if(err) throw err;
		})

		fs.close(fd, function(){
			console.log("elo_manifest colsed successfully !");					/* close elo_manifest file */
		})
	})
};