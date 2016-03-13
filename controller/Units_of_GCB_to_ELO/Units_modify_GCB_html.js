// Author: jeremy55662004@gmail.com
// 1.function modify_html() will correct the path of images in html file.
// 2.function openhtmlfile() will add javascript under html file.


/* function modify_html() will correct the path of images in html file. */
function modify_html(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file7 = y.files[0];
	var units_elo_path = file7.path.replace(file7.name, "") + "Units_ELO_" + file7.name.replace(/ /g, "_");
	var cnfile = [];									// using array to solve Synchronous problem 
	var resoure_path = [];								// using array to solve Synchronous problem 
	var coursejsonpath = file7.path + "/files/data/course.json";
	var buf = new Buffer(1000000);
	var count = -1;


	fs.open(coursejsonpath, "r", function(err, fd){
	if(err) throw err;

		fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){		// read course.json file
			if(err) throw err;
			else{
				var content = buf.slice(0, bytes).toString();    		// read all file and becoming string
				var obj = JSON.parse(content);							// convert to javascript (object)

				fs.close(fd, function(err){
					if(err) throw err;
					console.log("course.json was closed successfully !");
				})

				for(var t = 0; t < obj.units.length; t++){				// for units 
					if(obj.units[t].type == "U"){
						count += 1;
						var myunit = [];
						myunit[count] = obj.units[t].title;
						console.log(t);
						console.log(myunit);

						if(-1 !== myunit[count].search("/")){
							myunit[count] = myunit[count].replace(/\//g, "_");
						}

						var unit = count + 1;
						var seg_unit_path = "/ELO_" + unit + "_" + myunit[count].replace(/ /g, "_");

						console.log(unit);
						console.log(seg_unit_path);

						var elofile = fs.readdirSync(units_elo_path + seg_unit_path);

							for(var k = 0; k < elofile.length; k++){
								if(elofile[k].substr(0,2) == "cn"){
									cnfile.push(elofile[k]);
								}
							}

							for(var i = 0; i < cnfile.length; i++){
								var resoursefile = fs.readdirSync(units_elo_path + seg_unit_path + "/" + cnfile[i] + "/");
								console.log(resoursefile);

								for(var j = 0; j < resoursefile.length; j++){

									var extIndex = resoursefile[j].lastIndexOf(".");
										if(extIndex != -1){
				   							var name = resoursefile[j].substr(0, extIndex);
				 							var ext = resoursefile[j].substr(extIndex+1, resoursefile[j].length); 
										}
										console.log(ext);

										if(ext == "html"){
											resoure_path[j] = units_elo_path + seg_unit_path + "/" + cnfile[i] + "/" + resoursefile[j];
											console.log(resoure_path[j]);

											openhtmlfile(resoure_path[j], seg_unit_path);
										}
								}
							}

							console.log(cnfile);
					console.log(elofile.toString());
						
					}
				}
			}
		})
	})
};


/* function openhtmlfile() will add javascript under html file. */
function openhtmlfile(htmlpath, seg_unit){
	var fs = require("fs");
	var z = document.getElementById("fileImportDialog");
	var file8 = z.files[0];
	var units_elo_path = file8.path.replace(file8.name, "") + "Units_ELO_" + file8.name.replace(/ /g, "_");

	var htmlcontent = fs.readFileSync(htmlpath);
	var modifyhtml = htmlcontent.toString();

	parser = new DOMParser();
	htmlDoc = parser.parseFromString(modifyhtml,"text/html");
	console.log(htmlDoc);

	y = htmlDoc.getElementsByTagName("img");

	for(var i = 0; i < y.length; i++){

		var img_path = y[i].getAttribute("src");
		var decode_img_path = decodeURI(img_path);
		console.log(decode_img_path);

		var imgIndex = decode_img_path.lastIndexOf('/');

		if(imgIndex != -1){
			var imgname = decode_img_path.substr(imgIndex+1, decode_img_path.length);
			console.log(imgname);

			fs.appendFileSync(htmlpath, "<script>\ndocument.getElementsByTagName\(\"img\"\)["
			+ i + "].src=" + "\"" + units_elo_path + seg_unit + "/static/image/" + imgname + "\"" + ";\n");

			fs.appendFileSync(htmlpath, "</script>\n");
		}
	}
};