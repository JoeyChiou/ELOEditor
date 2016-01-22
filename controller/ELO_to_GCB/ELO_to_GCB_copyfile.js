/* author: Jeremy																				*/
/* 1.function gcbmkdirectory will create directory like /files, /models and so on.				*/
/* 2.function mygcbcopyfile2 will create files under /models and copy image files.				*/
/* 3.function GCB_css will create css files. 													*/
/* 4.function course_yaml will write some information in course.yaml. 							*/
/* 5.function copy_html_file will copy html files from cn node of elo to /files/assets/html/    */
/*	 of course builder. 																		*/



function gcbcreatedir(mydir){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file1 = y.files[0];
	var new_file_name = file1.name.replace(/ELO/, "");
	var gcb_path = file1.path.replace(file1.name, "") + "GCB" + new_file_name.replace(/ /g, "_"); 

	fs.mkdirSync(gcb_path + mydir, function(err){
		if(err) throw err;
	})
};


function gcbmkdirectory(callback){						// make directory
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");

	console.log("Going to create GCB file");

	fs.mkdirSync(gcb_path , function(err){
		if(err) throw err;
	})
	gcbcreatedir("/files");
	gcbcreatedir("/models");
	gcbcreatedir("/files/assets");
	gcbcreatedir("/files/data");
	gcbcreatedir("/files/views");
	gcbcreatedir("/files/assets/css");
	gcbcreatedir("/files/assets/html");
	gcbcreatedir("/files/assets/img");
	(callback && typeof(callback) === "function") && callback();
};


function mygcbcopyfile(elo_file_path, gcb_file_path){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file6 = y.files[0];
	var elo_course_path = file6.path;
	var new_file_name = file6.name.replace(/ELO/, "");
	var GCB_path = file6.path.replace(file6.name, "") + "GCB" + new_file_name.replace(/ /g, "_");

	fs.readdir(elo_course_path + elo_file_path, function(err, files){
		if(err) throw err;

		files.forEach(function(file){
			fs.createReadStream(elo_course_path + elo_file_path + file)
			.pipe(fs.createWriteStream(GCB_path + gcb_file_path + file));
		})
	})
};


function write_jsonfile(directory, myfile){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var elo_course_path = file.path;
	var new_file_name = file.name.replace(/ELO/, "");
	var GCB_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");
	
	fs.writeFile(GCB_path + directory + myfile, "{\"rows\": []}", function(err){
   		if (err) {
       		return console.error(err);
   		}
   		console.log( myfile + " written successfully!");
   	})
};


function mygcbcopyfile2(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var elo_course_path = file.path;
	var new_file_name = file.name.replace(/ELO/, "");
	var GCB_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");

	fs.readdir(elo_course_path + "/static/", function(err, files){
		for(var i = 0 in files){                                                    // i for index
            if(files[i] == "image"){
				mygcbcopyfile("/static/image/", "/files/assets/img/");
			}
		}		
   	})

   	fs.readdir(elo_course_path + "/static/", function(err, files){						 // for picture outside image directory
   		for(var j = 0 in files){
			
			var n = files[j].lastIndexOf(".");
   			var filename = files[j];

   			if(n != -1){														// avoid directory

   				if((filename.substr(n+1, filename.length) == "png") || (filename.substr(n+1, filename.length) == "PNG")){
   					fs.createReadStream(elo_course_path + "/static/" + files[j])
					.pipe(fs.createWriteStream(GCB_path + "/files/assets/img/" + files[j]));
   				}
   				else{
   					continue;
   				}
   			}
   		}
   	})

   	write_jsonfile("/models/", "_SkillEntity.json");
   	write_jsonfile("/models/", "I18nProgressEntity.json");
   	write_jsonfile("/models/", "LabelEntity.json");
   	write_jsonfile("/models/", "QuestionEntity.json");
   	write_jsonfile("/models/", "QuestionGroupEntity.json");
   	write_jsonfile("/models/", "ResourceBundleEntity.json");
   	write_jsonfile("/models/", "RoleEntity.json");

};


function GCB_css(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");

	var dirpath = process.execPath;
	var n = dirpath.indexOf("node_modules");
	var common_dirpath = dirpath.slice(0, n);					//get path of commonrepo-client 
	var GCB_common_css_path = common_dirpath + "assets/GCB_css/";		//get path of GCB css files in commonrepo

	console.log(GCB_common_css_path);
	
	fs.readdir(GCB_common_css_path, function(err, files){
		if(err) throw err;

		files.forEach(function(file){
			fs.createReadStream(GCB_common_css_path + file)
			.pipe(fs.createWriteStream(gcb_path + "/files/assets/css/" + file));
		})
	})	
};


function course_yaml(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var new_file_name = file.name.replace(/ELO/, "");
	var new_file_name1 = file.name.replace(/ELO_/, "");
	var gcb_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");

	fs.open(gcb_path + "/files/course.yaml", "w", function(err,fd){
		if(err) throw err;

		else{

			var buf = new Buffer("# my new course.yaml\ncourse:\n  title: " + "\'" + new_file_name1.replace(/_/g, " ") 
			+ "\'\n" + "  admin_user_emails:\n  now_available: False");

			fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer){
				if(err) throw err;
    			console.log(err, written, buffer);
			})

			fs.close(fd, function(err){										// close course.yaml file 
				if(err) throw err;
				console.log("course.yaml closed successfully !");
			})

		}

	})
};

function copy_html_file(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var elo_course_path = file.path;
	var new_file_name = file.name.replace(/ELO/, "");
	var GCB_path = file.path.replace(file.name, "") + "GCB" + new_file_name.replace(/ /g, "_");
	var cnfile = [];											// using array to solve Synchronous problem 
	var resoure_path = [];										// using array to solve Synchronous problem

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

					fs.createReadStream(resoure_path[j])
					.pipe(fs.createWriteStream(GCB_path + "/files/assets/html/" + resoursefile[j]));
				}
		}
	}
   	
}; 