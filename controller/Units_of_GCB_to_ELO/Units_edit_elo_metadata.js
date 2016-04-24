function edit_metadata(units_elo_metadata_path, unit){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file = y.files[0];
	var units_elo_path = file.path.replace(file.name, "") + "Units_ELO_" + file.name.replace(/ /g, "_");
	var courseyamlpath = file.path + "/files/course.yaml";
	var buf1 = new Buffer(1000000);

	//fill metadata about general/title
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
			}
			fs.close(fd, function(){
				console.log("course.yaml colsed successfully !");					//close course.yaml file
			})
		})
	})

	setTimeout(function(){
		fs.appendFile(units_elo_metadata_path,
		//general
		"<ELOMetadata>\n  <general>\n    <identifier>\n      <catalog>ELearning</catalog>\n      <entry></entry>\n" + 
		"    </identifier>\n    <title>\n      <string language=\"en\">" + titlemodify + "Unit_"+ unit + "</string>\n    </title>\n" + 
		"    <language>en</language>\n    <description>\n      <string language=\"en\"></string>\n    </description>\n" + 
		"    <keyword>\n      <string language=\"en\"></string>\n    </keyword>\n    <coverage>\n" + 
		"      <string language=\"en\"></string>\n    </coverage>\n    <structure>\n      <source>LOMv1.0</source>\n" + 
		"      <value></value>\n    </structure>\n    <aggregationLevel>\n      <source>LOMv1.0</source>\n      " + 
		"<value></value>\n    </aggregationLevel>\n  </general>\n" +
		//lifeCycle 
		"  <lifeCycle>\n    <version>\n      <string language=\"en\">1.3</string>\n    </version>\n    <status>\n" + 
		"      <source>LOMv1.0</source>\n      <value></value>\n    </status>\n    <contribute>\n      <role>\n" + 
		"        <source>LOMv1.0</source>\n        <value>author</value>\n      </role>\n      <entity></entity>\n      " + 
		"<date>\n        <datetime></datetime>\n        <description>\n          <string language=\"en\"></string>\n" + 
		"        </description>\n      </date>\n    </contribute>\n  </lifeCycle>\n" + 
		//metaMetadata
		"  <metaMetadata>\n    <identifier>\n      <catalog></catalog>\n      <entry></entry>\n    </identifier>\n" + 
		"    <contribute>\n      <role>\n        <source>LOMv1.0</source>\n        <value>creator</value>\n" + 
		"      </role>\n      <entity></entity>\n      <date>\n        <datetime></datetime>\n        <description>\n" + 
		"          <string language=\"en\"></string>\n        </description>\n" + 
		"      </date>\n    </contribute>\n    <metadataSchema>LOMv1.0</metadataSchema>\n    <language>en</language>\n" + 
		"  </metaMetadata>\n" + 
		//technical
		"  <technical>\n    <format></format>\n    <size></size>\n    <location></location>\n    <requirement>\n      " + 
		"<string language=\"en\"></string>\n      <orComposite>\n        <type>\n          <source></source>\n" + 
		"          <value></value>\n        </type>\n        <name>\n          <source></source>\n          " + 
		"<value></value>\n        </name>\n        <minimumVersion></minimumVersion>\n        " + 
		"<maximumVersion></maximumVersion>\n      </orComposite>\n    </requirement>\n    <installationRemarks>\n      " + 
		"<string language=\"en\"></string>\n    </installationRemarks>\n    <otherPlatformRequirements>\n      " + 
		"<string language=\"en\"></string>\n    </otherPlatformRequirements>\n    <duration>\n      " + 
		"<duration></duration>\n      <description>\n        <string language=\"en\"></string>\n      " + 
		"</description>\n    </duration>\n  </technical>\n" + 
		//educational
		"  <educational>\n    <interactivityType>\n     <source>LOMv1.0</source>\n      <value></value>\n" + 
		"    </interactivityType>\n    <learningResourceType>\n      <source>LOMv1.0</source>\n      <value></value>\n" + 
		"    </learningResourceType>\n    <interactivityLevel>\n      <source>LOMv1.0</source>\n      <value></value>\n" + 
		"    </interactivityLevel>\n    <semanticDensity>\n      <source>LOMv1.0</source>\n      <value></value>\n" + 
		"    </semanticDensity>\n    <intendedEndUserRole>\n      <source>LOMv1.0</source>\n      <value>learner</value>\n" + 
		"    </intendedEndUserRole>\n    <context>\n      <source>LOMv1.0</source>\n      <value></value>\n    </context>\n" + 
		"    <typicalAgeRange>\n      <string language=\"en\"></string>\n    </typicalAgeRange>\n    <difficulty>\n" + 
		"      <source>LOMv1.0</source>\n      <value></value>\n    </difficulty>\n    <typicalLearningTime>\n      " + 
		"<duration></duration>\n      <description>\n        <string language=\"en\"></string>\n      " + 
		"</description>\n    </typicalLearningTime>\n    <description>\n      <string language=\"en\"></string>\n" + 
		"    </description>\n    <language>en</language>\n  </educational>\n" + 
		//rights
		"  <rights>\n    <cost>\n      <source>LOMv1.0</source>\n      <value>no</value>\n    </cost>\n    " + 
		"<copyrightAndOtherRestrictions>\n      <source>LOMv1.0</source>\n      <value>yes</value>\n    " + 
		"</copyrightAndOtherRestrictions>\n    <description>\n      <string language=\"en\"></string>\n" + 
		"    </description>\n  </rights>\n" + 
		//relation
		"  <relation>\n    <kind>\n      <source>LOMv1.0</source>\n      <value>haspart</value>\n    </kind>\n    " + 
		"<resource>\n      <identifier>\n        <catalog></catalog>\n        <entry></entry>\n      </identifier>\n" + 
		"      <description></description>\n    </resource>\n  </relation>\n" + 
		//annotation
		"  <annotation>\n    <entity></entity>\n    <date>\n      <datetime></datetime>\n      <description>\n" + 
		"        <string language=\"en\"></string>\n      </description>\n    </date>\n    <description>\n" + 
		"      <string language=\"en\"></string>\n    </description>\n  </annotation>\n" + 
		//classification
		"  <classification>\n    <purpose>\n      <source>LOMv1.0</source>\n      <value>discipline</value>\n    </purpose>\n" + 
		"    <taxonPath>\n      <source>\n        <string language=\"en\"></string>\n      </source>\n      " + 
		"<taxon>\n        <id></id>\n        <entry>\n          <string language=\"en\"></string>\n        " + 
		"</entry>\n      </taxon>\n    </taxonPath>\n    <description>\n      <string language=\"en\"></string>\n" + 
		"    </description>\n    <keyword>\n      <string language=\"en\"></string>\n    </keyword>\n  " + 
		"</classification>\n</ELOMetadata>", function(err){

			if(err) throw err;
		})
	}, 200)
};



function exe_edit_metadata(){
	var fs = require("fs");
	var y = document.getElementById("fileImportDialog");
	var file5 = y.files[0];
	var GCB_path = file5.path;
	var units_elo_path = file5.path.replace(file5.name, "") + "Units_ELO_" + file5.name.replace(/ /g, "_");
	var coursejsonpath = file5.path + "/files/data/course.json";
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

				for(var j = 0; j < obj.units.length; j++){				// for units 
					if(obj.units[j].type == "U"){
						count += 1;
						var myunit = [];
						myunit[count] = obj.units[j].title;
						console.log(myunit);

						if(-1 !== myunit[count].search("/")){
							myunit[count] = myunit[count].replace(/\//g, "_");
						}

						var unit = count + 1; 
						var units_elo_metadata_path = units_elo_path + "/ELO_" + unit + "_" + myunit[count].replace(/ /g, "_") + "/elo_metadata.xml";

						console.log(unit);
						console.log(units_elo_metadata_path);

						edit_metadata(units_elo_metadata_path, unit);
					}
				}
			}
		})
	})
};