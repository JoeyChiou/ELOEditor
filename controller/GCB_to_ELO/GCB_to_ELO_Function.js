// Author: jeremy55662004@gmail.com
// 1.function open_aggregation_file() will create elo_aggreagation file.
// 2.function mkdirectory() uses createfile() to create elo_aggregation.xml, elo_manifest.xml
//   and elo_metadata.xml under directory.
// 3.function open_manifest_file will create elo_manifest.xml.
// 4.function pad will generate a four-digit number ex: 0001.



/* function open_aggregation_file() will create elo_aggreagation file. */
function open_aggregation_file(){

	var x = document.getElementById("fileImportDialog");
	var message = "";
	var fs = require("fs");
	var buf = new Buffer(1000000);								// buffer like an array (1MB)

	if ("files" in x) {
		if(x.files.length == 0){
			message = "Select a GCB file.";
		}
		else{
				var file = x.files[0];								// x.files[0] for the first file 
				var elo_course_path = file.path.replace(file.name, "") + "ELO_" + file.name.replace(/ /g, "_");
				if("name" in file){
					message += "You selected a file : " + file.name + "<br>";
				}
				console.log("Going to read GCB directory");
				coursejsonpath = file.path + "/files/data/course.json";		// To find where is course.json file
				
				fs.open(coursejsonpath, "r", function(err, fd){
					if(err){
						return console.error(err);
					}
					console.log("course.json opened successfully!");
					console.log("Going to read the course.json file");
					fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){		//read course.json file
						if(err){
							console.log(err);
						}
						else if(bytes > 0){
							var content = buf.slice(0, bytes).toString();    		//read all file and becoming string
							var obj = JSON.parse(content);							//convert to javascript (object)

							fs.open(elo_course_path + "/elo_aggregation.xml", "w", function(err,fd){
								if(err){
									return console.error(err);
								}

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

								for(var j = 0; j < obj.units.length; j++){				//for units
									if(obj.units[j].type == "U"){
										count += 1;
										var myunit = [];
										myunit[count] = obj.units[j].title;
										console.log(myunit);

										for(var i = 0; i < obj.lessons.length; i++){
											if((obj.lessons[i].auto_index == true)&&
												(obj.units[j].unit_id == obj.lessons[i].unit_id)){
												count3 += 1;
											}
										}

										urlnamearr[1] = 1;

										/* create cn file */
										fs.mkdir(elo_course_path + "/cn" + pad(count,4), function(err){
											if(err) throw err;
										})

										fs.appendFile(elo_course_path + "/elo_aggregation.xml", 
										"\t\t<container id=\"cn" + pad(count,4) + "\" type=\"cn\" display_name=\"" + myunit[count] +
										"\" url_name=\"tn" + pad(urlnamearr[count],4) + "\"/>\n", function(err){
										
											if(err) throw err;
  											console.log('Units was appended to file!');
										})

										urlnamearr[count+1] = count3 + 1;
									}
								}

								fs.appendFile(elo_course_path + "/elo_aggregation.xml",
								"\t</containers>\n\n\t<contents>\n", function(err){
									if(err) throw err;
								})

								for(var j = 0; j < obj.units.length; j++){
									if(obj.units[j].type == "U"){
										count1 += 1;
										for(var i = 0; i < obj.lessons.length; i++){			//for lessons & fewer than its length 
											if((obj.lessons[i].auto_index == true)&&
												(obj.units[j].unit_id == obj.lessons[i].unit_id)){
											
												count2 += 1;
												var mynotes = obj.lessons[i].notes.split("/");
												mynotes[2] = mynotes[2].replace(/ /g, "_");		//change path to correct
												mynotes[2] = mynotes[2].replace(/.html/, "");
												console.log(mynotes[2]);

												fs.appendFile(elo_course_path + "/elo_aggregation.xml",
												"\t\t<content id=\"tn" + pad(count2,4) + "\" tid=\"cn" + pad(count1,4) + 
												"\" type=\"tn\" url_name=\"" + mynotes[2] + "\"/>\n", function(err){

													if(err) throw err;
												})
											}
										}
									}
								}

								fs.appendFile(elo_course_path + "/elo_aggregation.xml",
								"\t</contents>\n</manifest>",function(err){
									if(err) throw err;
								})

								fs.close(fd, function(){							//close aggregation.xml file
      								console.log('Done');
    							})
							})

						}
					})

					fs.close(fd, function(err){										//close course.json file
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
			message += "Please select a GCB file";
		}
		else{
			message += "The files property is not supported by your browerser!";
		}
	}

	document.getElementById("demo").innerHTML = message;
};


/* function createfile will create xml files */
function createfile(myfile){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file1 = y.files[0];
	var elo_course_path = file1.path.replace(file1.name, "") + "ELO_" + file1.name.replace(/ /g, "_");
	var s1 =  elo_course_path + "/xml_file";										//Should be string object
	var s2 =  "xml_file opened successfully !";
	var s3 =  "xml_file closed successfully !";

	fs.open(s1.replace(/xml_file/, myfile), "w", function(err, fd){
		if(err){
			return console.error(err);
		}
		console.log(s2.replace(/xml_file/, myfile));
		fs.close(fd, function(err){
			if(err){
				console.log(err);
			}
			console.log(s3.replace(/xml_file/, myfile));
		})
	})
};


/* function mkdirectory() uses createfile() to create elo_aggregation.xml, elo_manifest.xml 	*/
/* and elo_metadata.xml under directory. 														*/
function mkdirectory(){													//make directory
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file2 = y.files[0];
	var elo_course_path = file2.path.replace(file2.name, "") + "ELO_" + file2.name.replace(/ /g, "_");
	
	console.log("Going to create ELO file");
	fs.mkdir(elo_course_path, function(err){
		if(err){
			return console.error(err);
		}
		else{
			console.log("ELO created successfully !");
			createfile("elo_aggregation.xml");
			createfile("elo_manifest.xml");
			createfile("elo_metadata.xml");
		}
	})
};


/* function pad will generate a four-digit number ex: 0001. */
function pad(n, width, z){
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;    //if statement & to be string
};


/* function open_manifest_file will create elo_manifest.xml. */
function open_manifest_file(){
	var fs = require("fs");
	var buf1 = new Buffer(1000000);

	var y = document.getElementById("fileImportDialog");

	var file3 = y.files[0];
	var courseyamlpath = file3.path + "/files/course.yaml";
	var elo_manifest_path = file3.path.replace(file3.name, "") + "ELO_" + file3.name.replace(/ /g, "_") + "/elo_manifest.xml";

	fs.open(courseyamlpath, "r", function(err,fd){
		if(err) throw err;
		console.log("course.yaml file opened successfully !");

		fs.read(fd, buf1, 0, buf1.length, 0, function(err, bytes){
			if(err) throw err;

			if(bytes > 0){
				var course_yaml_content = buf1.slice(0, bytes).toString();
				var arr = [];
				var arr1 = [];
				arr = course_yaml_content.split("\n");

				for(var i = 0; i < arr.length; i++){
					var text = arr[i];
					arr1.push(text.split(":"));

					for(var j = 0; j < arr1[i].length; j++){
						if(arr1[i][j] == "  title"){
							coursetitle = arr1[i][j+1];
							titlemodify = coursetitle.replace(" ", "");
							console.log(titlemodify);
						}
					}
				}

				fs.open(elo_manifest_path, "w", function(err,fd){
		
					fs.appendFile(elo_manifest_path, 
					"<elo name=\"" + titlemodify + "\"" + " org=\"MINE Lab\" id=\"elo00002001\" type=\"Course Builder\"/>",
					function(err){
						if(err) throw err;
					})

					fs.close(fd, function(){
						console.log("elo_manifest colsed successfully !");					//close elo_manifest file
					})
				})
			}

			fs.close(fd, function(){
				console.log("course.yaml colsed successfully !");					//close course.yaml file
			})
		})
	})
};