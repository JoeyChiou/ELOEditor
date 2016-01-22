/* author: Jeremy																				*/
/* 1.function modify_html() will correct the path of images in html file.						*/
/* 2.function openhtmlfile() will add javascript under html file.								*/



function modify_html(){
	//setTimeout(function(){
		var fs = require("fs");
		var y = document.getElementById("fileImportDialog");
		var file7 = y.files[0];
		var elo_course_path = file7.path.replace(file7.name, "") + "ELO_" + file7.name.replace(/ /g, "_");
		var cnfile = [];									// using array to solve Synchronous problem
		var resoure_path = [];								// using array to solve Synchronous problem


		var elofile = fs.readdirSync(elo_course_path);

			for(var k = 0; k < elofile.length; k++){
				if(elofile[k].substr(0,2) == "cn"){
					cnfile.push(elofile[k]);
				}
			}

			for(var i = 0; i < cnfile.length; i++){
				var resoursefile = fs.readdirSync(elo_course_path + "/" + cnfile[i] + "/");
				console.log(resoursefile);

				for(var j = 0; j < resoursefile.length; j++){

					var extIndex = resoursefile[j].lastIndexOf(".");
						if(extIndex != -1){
   							var name = resoursefile[j].substr(0, extIndex);
 							var ext = resoursefile[j].substr(extIndex+1, resoursefile[j].length); 
						}
						console.log(ext);

						if(ext == "html"){
							resoure_path[j] = elo_course_path + "/" + cnfile[i] + "/" + resoursefile[j];
							console.log(resoure_path[j]);

							openhtmlfile(resoure_path[j]);
						}
				}
			}

			console.log(cnfile);
	console.log(elofile.toString());
	//}, 350)
};



function openhtmlfile(htmlpath){
	var fs = require("fs");
	var z = document.getElementById("fileImportDialog");
	var file8 = z.files[0];
	var elo_course_path = file8.path.replace(file8.name, "") + "ELO_" + file8.name.replace(/ /g, "_");

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
			+ i + "].src=" + "\"" + elo_course_path + "/static/image/" + imgname + "\"" + ";\n");

			fs.appendFileSync(htmlpath, "</script>\n");
		}
	}
};