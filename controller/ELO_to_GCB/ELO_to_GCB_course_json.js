/* author: Jeremy																				 */
/* 1.function gcb_course_json will write course.json under /files/data.							 */
/* 2.function write_lesson_course_json will write a part of lesson in course.json files.         */
/* 3.function write_unit_course_json will write a part of units in course.json files.			 */



/* function write_lesson_course_json will write a part of lesson in course.json files. */
function write_lesson_course_json(myunit_name, mylesson_id, myunit_id, my_html){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file1 = y.files[0];
	var new_file_name = file1.name.replace(/ELO/, "");
	var gcb_path = file1.path.replace(file1.name, "") + "GCB" + new_file_name.replace(/ /g, "_");


	fs.appendFile(gcb_path + "/files/data/course.json", 
	"\n\t{\n\t  \"activity_listed\": true,\n\t  \"activity_title\": \"\",\n\t  \"auto_index\": true," + 
	"\n\t  \"duration\": \"\",\n\t  \"has_activity\": false,\n\t  \"lesson_id\": " + mylesson_id + 
	",\n\t  \"manual_progress\": false,\n\t  \"notes\": \"assets/html/" + my_html + ".html\"," + 
	"\n\t  \"now_available\": false,\n\t  \"objectives\": \"\",\n\t  \"properties\": {\n\t    \"" + 
	"modules.skill_map.skill_list\": []\n\t  },\n\t  \"scored\": false,\n\t  \"title\": \"" + myunit_name + 
	"\",\n\t  \"unit_id\": " + myunit_id + ",\n\t  \"video\": \"\"\n\t},", function(err){
										
		if(err) throw err;
	})
};


/* function write_unit_course_json will write a part of units in course.json files. */
function write_unit_course_json(myunit_name, myunit_id){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file1 = y.files[0];
	var new_file_name = file1.name.replace(/ELO/, "");
	var gcb_path = file1.path.replace(file1.name, "") + "GCB" + new_file_name.replace(/ /g, "_");

	fs.appendFile(gcb_path + "/files/data/course.json",
	"\n\t{\n\t  \"custom_unit_type\": null,\n\t  \"description\": \"\",\n\t  \"href\": null," + 
	"\n\t  \"html_check_answers\": false,\n\t  \"html_content\": null,\n\t  \"html_review_form\": null," + 
	"\n\t  \"labels\": \"\",\n\t  \"manual_progress\": false,\n\t  \"now_available\": false," + 
	"\n\t  \"post_assessment\": null,\n\t  \"pre_assessment\": null,\n\t  \"properties\": {}," + 
	"\n\t  \"release_date\": \"\",\n\t  \"show_contents_on_one_page\": false,\n\t  \"shown_when_unavailable\":" + 
	" false,\n\t  \"title\": \"" + myunit_name + "\",\n\t  \"type\": \"U\",\n\t  \"unit_footer\": \"\"," + 
	"\n\t  \"unit_header\": \"\",\n\t  \"unit_id\": " + myunit_id + ",\n\t  \"weight\": 1,\n\t  \"workflow_yaml\": " + 
	"\"grader: auto\\n\"\n\t},", function(err){
		if(err) throw err;
	})
};


/* function gcb_course_json will write course.json under /files/data. */
function gcb_course_json(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file1 = y.files[0];
	var elo_course_path = file1.path;
	var new_file_name = file1.name.replace(/ELO/, "");
	var gcb_path = file1.path.replace(file1.name, "") + "GCB" + new_file_name.replace(/ /g, "_");
	var buf2 = new Buffer(1000000);
	var buf3 = new Buffer(1000000);
	var unit_id = 1;

	fs.open(gcb_path + "/files/data/course.json", "w", function(err,fd){
		if(err) throw err;

		else{
			var buf = new Buffer("{\n  \"lessons\": [");

			fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer){
				if(err) throw err;
    			console.log(err, written, buffer);
			})

			fs.open(elo_course_path + "/elo_aggregation.xml", "r", function(err, fd){
				if(err) throw err;
				console.log("elo_aggregation.xml opened successfully !");

				fs.read(fd, buf2, 0, buf2.length, 0, function(err, bytes){
					if(err) throw err;

					else if(bytes > 0){

						var content = buf2.slice(0, bytes).toString();
						parser = new DOMParser();
						xmlDoc = parser.parseFromString(content,"text/xml");
						console.log(xmlDoc);

						x = xmlDoc.getElementsByTagName("container");
						y = xmlDoc.getElementsByTagName("content");

						for(var i = 1; i < y.length; i++){

							var unit_name = x[unit_id-1].getAttribute("display_name");
							var lesson_id = i + y.length;
							var html_file_name = y[i-1].getAttribute("url_name");

							if(y[i-1].getAttribute("tid") == y[i].getAttribute("tid")){
								write_lesson_course_json(unit_name, lesson_id, unit_id, html_file_name);
							}
							else{
								write_lesson_course_json(unit_name, lesson_id, unit_id, html_file_name);
								unit_id += 1;
								console.log(unit_id);
							}
						}

						var unit_name = x[x.length-1].getAttribute("display_name");
						var html_file_name = y[y.length-1].getAttribute("url_name");
						var lesson_id = 2 * y.length;
						console.log(html_file_name);


						fs.appendFile(gcb_path + "/files/data/course.json", 
						"\n\t{\n\t  \"activity_listed\": true,\n\t  \"activity_title\": \"\",\n\t  \"auto_index\": true," + 
						"\n\t  \"duration\": \"\",\n\t  \"has_activity\": false,\n\t  \"lesson_id\": " + lesson_id + 
						",\n\t  \"manual_progress\": false,\n\t  \"notes\": \"assets/html/" + html_file_name + ".html\"," + 
						"\n\t  \"now_available\": false,\n\t  \"objectives\": \"\",\n\t  \"properties\": {\n\t    \"" + 
						"modules.skill_map.skill_list\": []\n\t  },\n\t  \"scored\": false,\n\t  \"title\": \"" + unit_name + 
						"\",\n\t  \"unit_id\": " + unit_id + ",\n\t  \"video\": \"\"\n\t}\n  ],\n  \"next_id\": " + 
						(lesson_id + 1) + ",\n  \"units\": [", function(err){
															
							if(err) throw err;
					  		console.log(' course.json about lesson was complete!');
						})

						setTimeout(function(){
							for(var j = 0; j < x.length; j++){
								
								var unit_id2 = j + 1;
								var unit_name2 = x[j].getAttribute("display_name");
								console.log(unit_id2);
								console.log(unit_name2);

								if(j == x.length - 1){
									fs.appendFile(gcb_path + "/files/data/course.json",
									"\n\t{\n\t  \"custom_unit_type\": null,\n\t  \"description\": \"\",\n\t  \"href\": null," + 
									"\n\t  \"html_check_answers\": false,\n\t  \"html_content\": null,\n\t  \"html_review_form\": null," + 
									"\n\t  \"labels\": \"\",\n\t  \"manual_progress\": false,\n\t  \"now_available\": false," + 
									"\n\t  \"post_assessment\": null,\n\t  \"pre_assessment\": null,\n\t  \"properties\": {}," + 
									"\n\t  \"release_date\": \"\",\n\t  \"show_contents_on_one_page\": false,\n\t  \"shown_when_unavailable\":" + 
									" false,\n\t  \"title\": \"" + unit_name2 + "\",\n\t  \"type\": \"U\",\n\t  \"unit_footer\": \"\"," + 
									"\n\t  \"unit_header\": \"\",\n\t  \"unit_id\": " + unit_id2 + ",\n\t  \"weight\": 1,\n\t  \"workflow_yaml\": " + 
									"\"grader: auto\\n\"\n\t}\n  ],\n  \"version\": \"1.3\"\n}", function(err){
										if(err) throw err;
									})
								}
								else{
									write_unit_course_json(unit_name2, unit_id2);
								}
							}
						}, 30)
					}
				})
			})
		}
	})
};