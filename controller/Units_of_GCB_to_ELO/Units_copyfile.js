function Units_create_static_file(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file4 = y.files[0];
	var units_elo_path = file4.path.replace(file4.name, "") + "Units_ELO_" + file4.name.replace(/ /g, "_");
	var unit_file = fs.readdirSync(units_elo_path);


	for(var k = 0; k < unit_file.length; k++){

		var unit_elo_file_path = units_elo_path + "/" + unit_file[k];

		fs.mkdir(unit_elo_file_path + "/static", function(err){
			if(err) throw err;
			console.log("static was created !");
		})
	}
	setTimeout(function(){

		for(var k = 0; k < unit_file.length; k++){

			var unit_elo_file_path = units_elo_path + "/" + unit_file[k];
			fs.mkdir(unit_elo_file_path + "/static/image", function(err){
				if(err) throw err;
				console.log("image was created !");
			})

			fs.mkdir(unit_elo_file_path + "/static/css", function(err){
				if(err) throw err;
				console.log("css was created !");
			})

			fs.mkdir(unit_elo_file_path + "/static/models", function(err){
				if(err) throw err;
				console.log("models was created !");
			})

			fs.mkdir(unit_elo_file_path + "/static/html", function(err){
				if(err) throw err;
				console.log("html was created !");
			})

			fs.mkdir(unit_elo_file_path + "/static/data", function(err){
				if(err) throw err;
				console.log("data was created !");
			})

			fs.mkdir(unit_elo_file_path + "/static/views", function(err){
				if(err) throw err;
				console.log("views was created !");
			})
		}
	},70);
};

function mycopyfile2(gcbpath, elopath){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file6 = y.files[0];
	var GCB_path = file6.path;
	var units_elo_path = file6.path.replace(file6.name, "") + "Units_ELO_" + file6.name.replace(/ /g, "_");

	fs.readdir(GCB_path + gcbpath, function(err, files){
		if(err) throw err;

		files.forEach(function(file){
			fs.createReadStream(GCB_path + gcbpath + file)
			.pipe(fs.createWriteStream(units_elo_path + elopath + file));
		})
	})
};


function mycopyfile_exe(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file5 = y.files[0];
	var GCB_path = file5.path;
	var units_elo_path = file5.path.replace(file5.name, "") + "Units_ELO_" + file5.name.replace(/ /g, "_");
	var coursejsonpath = file5.path + "/files/data/course.json";
	var buf = new Buffer(1000000);
	var count = -1;

	/*fs.createReadStream("/Users/howard/Desktop/course1/files/assets/html/Lesson 1.1  Instructions for taking this course (Text).html")
	.pipe(fs.createWriteStream(elo_course_path + "/cn0001/Lesson_1.1__Instructions_for_taking_this_course_(Text).html")); */

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
						var units_elo_aggregation_path = units_elo_path + "/ELO_" + unit + "_" + myunit[count].replace(/ /g, "_") + "/elo_aggregation.xml";
						var seg_unit_path = "/ELO_" + unit + "_" + myunit[count].replace(/ /g, "_");

						console.log(unit);
						console.log(units_elo_aggregation_path);
						console.log(seg_unit_path);

						mycopyfile(units_elo_aggregation_path, seg_unit_path);
					}
				}
			}
		})
	})
};


function mycopyfile(aggregation_path, seg_unit){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file5 = y.files[0];
	var GCB_path = file5.path;
	var units_elo_path = file5.path.replace(file5.name, "") + "Units_ELO_" + file5.name.replace(/ /g, "_");
	var coursejsonpath = file5.path + "/files/data/course.json";
	var buf2 = new Buffer(1000000);

		
	fs.open(aggregation_path, "r", function(err,fd){
		if(err) throw err;
		console.log("elo_aggregation.xml opened successfully !");

		fs.read(fd, buf2, 0, buf2.length, 0, function(err, bytes){
			if(err) throw err;

			else if(bytes > 0){

				var content = buf2.slice(0, bytes).toString();
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(content,"text/xml");
				console.log(xmlDoc);

				x = xmlDoc.getElementsByTagName("content");

				for(var i = 1; i <= x.length; i++){
					if(x[i-1].getAttribute("tid") == ("cn" + pad(1, 4))){
						var html_file_name = x[i-1].getAttribute("url_name");
						console.log(html_file_name);

						var html_modify = html_file_name.replace(/_/g, " ") + ".html";
						console.log(html_modify);

						fs.createReadStream(GCB_path + "/files/assets/html/" + html_modify)
						.pipe(fs.createWriteStream(units_elo_path + seg_unit
						 + "/cn" + pad(1, 4)  + "/" + html_file_name + ".html"));

						fs.createReadStream(GCB_path + "/files/assets/html/" + html_modify)
						.pipe(fs.createWriteStream(units_elo_path + seg_unit
						 + "/static/html/" + html_file_name + ".html"));

					}
					else{
						break;
					}
				}

			}
		})

		fs.close(fd, function(){
			console.log("elo_aggregation is closed !");
		})
	})
	//mycopyfile2("/files/assets/html/", seg_unit + "/static/html/");						/* copy html */
	mycopyfile2("/files/assets/img/", seg_unit + "/static/image/");					
};