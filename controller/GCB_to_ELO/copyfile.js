function create_static_file(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file4 = y.files[0];
	var elo_course_path = file4.path.replace(file4.name, "") + "ELO_" + file4.name.replace(/ /g, "_");

	fs.mkdirSync(elo_course_path + "/static", function(err){
		if(err) throw err;
		console.log("static was created !");
	})

	setTimeout(function(){
		fs.mkdirSync(elo_course_path + "/static/image", function(err){
			if(err) throw err;
			console.log("image was created !");
		})
		fs.mkdirSync(elo_course_path + "/static/css", function(err){
			if(err) throw err;
			console.log("css was created !");
		})
		fs.mkdirSync(elo_course_path + "/static/models", function(err){
			if(err) throw err;
			console.log("models was created !");
		})
		fs.mkdirSync(elo_course_path + "/static/html", function(err){
			if(err) throw err;
			console.log("html was created !");
		})
		fs.mkdirSync(elo_course_path + "/static/data", function(err){
			if(err) throw err;
			console.log("data was created !");
		})
		fs.mkdirSync(elo_course_path + "/static/views", function(err){
			if(err) throw err;
			console.log("views was created !");
		})
	}, 40 )
};


function mycopyfile(){
	//setTimeout( function(){
		var fs = require("fs");
		var y = document.getElementById("fileImportDialog");
		var file5 = y.files[0];
		var GCB_path = file5.path;
		var elo_course_path = file5.path.replace(file5.name, "") + "ELO_" + file5.name.replace(/ /g, "_");
		var elo_aggregation_path = file5.path.replace(file5.name, "") + "ELO_" + file5.name.replace(/ /g, "_") + "/elo_aggregation.xml";
		var buf2 = new Buffer(1000000);
		var count = 1;

		/*fs.createReadStream("/Users/howard/Desktop/course1/files/assets/html/Lesson 1.1  Instructions for taking this course (Text).html")
		.pipe(fs.createWriteStream(elo_course_path + "/cn0001/Lesson_1.1__Instructions_for_taking_this_course_(Text).html")); */

		fs.open(elo_aggregation_path, "r", function(err,fd){
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

					for(var i = 1; i < x.length; i++){
						if(x[i-1].getAttribute("tid") == x[i].getAttribute("tid")){ 
							var html_file_name = x[i-1].getAttribute("url_name");
							console.log(html_file_name);

							var html_modify = html_file_name.replace(/_/g, " ") + ".html";

							fs.createReadStream(GCB_path + "/files/assets/html/" + html_modify)
							.pipe(fs.createWriteStream(elo_course_path + "/cn" + pad(count, 4)
							+ "/" + html_file_name + ".html"));
						}
						else{

							var html_file_name = x[i-1].getAttribute("url_name");
							console.log(html_file_name);

							var html_modify = html_file_name.replace(/_/g, " ") + ".html";
							fs.createReadStream(GCB_path + "/files/assets/html/" + html_modify)
							.pipe(fs.createWriteStream(elo_course_path + "/cn" + pad(count, 4)
							+ "/" + html_file_name + ".html"));

							count += 1;
						}
					}

					/* check the last one */
					/*if(x[x.length-2].getAttribute("tid") == x[x.length-1].getAttribute("tid")){
						var html_file_name = x[x.length-1].getAttribute("url_name");
						console.log(html_file_name);

						var html_modify = html_file_name.replace(/_/g, " ") + ".html";

						fs.createReadStream(GCB_path + "/files/assets/html/" + html_modify)
						.pipe(fs.createWriteStream(elo_course_path + "/cn" + pad(count, 4)
						+ "/" + html_file_name + ".html"));
					}
					else{*/
						var html_file_name = x[x.length-1].getAttribute("url_name");
						console.log(html_file_name);

						var html_modify = html_file_name.replace(/_/g, " ") + ".html";

						fs.createReadStream(GCB_path + "/files/assets/html/" + html_modify)
						.pipe(fs.createWriteStream(elo_course_path + "/cn" + pad(count, 4)
						+ "/" + html_file_name + ".html"));
					/*}*/
				}

			})

			fs.close(fd, function(){
				console.log("elo_aggregation is closed !");
			})
		})
		
		fs.createReadStream(GCB_path + "/manifest.json")
		.pipe(fs.createWriteStream(elo_course_path + "/static/manifest.json"));  	/* copy manifest.json */

		fs.createReadStream(GCB_path + "/files/course.yaml")
		.pipe(fs.createWriteStream(elo_course_path + "/static/course.yaml"));  		/* copy course.yaml */

		mycopyfile2("/models/", "/static/models/");									/* copy models */
		mycopyfile2("/files/assets/css/", "/static/css/");							/* copy css */
		mycopyfile2("/files/assets/html/", "/static/html/");						/* copy html */
		mycopyfile2("/files/assets/img/", "/static/image/");						/* cpoy img */
		mycopyfile2("/files/data/", "/static/data/");								/* copy data */
		mycopyfile2("/files/views/", "/static/views/")								/* copy views */

	//}, 150 )																	/* set timeout 0.15 sec */

	//if (callback && typeof(callback) === "function") {
        //callback();
    //}
};



function mycopyfile2(gcbpath, elopath){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file6 = y.files[0];
	var GCB_path = file6.path;
	var elo_course_path = file6.path.replace(file6.name, "") + "ELO_" + file6.name.replace(/ /g, "_");

	fs.readdir(GCB_path + gcbpath, function(err, files){
		if(err) throw err;

		files.forEach(function(file){
			fs.createReadStream(GCB_path + gcbpath + file)
			.pipe(fs.createWriteStream(elo_course_path + elopath + file));
		})
	})
};