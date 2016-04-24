function saveFunction(){

	var fs = require("fs");
	var x = document.getElementById("fileImport");
    var file = x.files[0];  

    if('files' in x){
        if (x.files.length == 0) {
        	alert("Select one or more files.");
        }
        else{
        	//general
        	var general_catalog_value1 = $("input[id=general-identifier-catalog]").val();
        	var general_entry_value1 = $("input[id=general-identifier-entry]").val();
        	var general_title_value1 = $("input[id=general-title]").val();
        	var general_language_value1 = $("input[id=general-language]").val();
        	var general_description_value1 = $("input[id=general-description]").val();
        	var general_keyword_value1 = $("input[id=general-keyword]").val();
        	var general_coverage_value1 = $("input[id=general-coverage]").val();

        	var general_structure_value1 = $('#general-structure').find(":selected").text();
        	var general_aggregationLevel1 = $("input[id=general-aggregationLevel]").val();

        	//lifecycle
        	var lifecycle_version_value1 = $("input[id=lifecycle-version]").val();
        	var lifecycle_status_value1 = $("#lifecycle-status").find("selected").text();
        	var lifecycle_role_value1 = $("#lifecycle-contribute-role").find("selected").text();
        	var lifecycle_entity1 = $("#lifecycle-contribute-entity").val();
        	var lifecycle_date1 = $("#lifecycle-contribute-date").val();

        	//metametadata
        	var metametadata_catalog1 = $("#meta-metadata-identifier-catalog").val();
        	var metametadata_entry1 = $("#meta-metadata-identifier-entry").val();
        	var metametadata_role_value1 = $("#metametadata-contribute-role").find("selected").text();
        	var metametadata_entity1 = $("#metametadata-contribute-entity").val();
        	var metametadata_date1 = $("#metametadata-contribute-date").val();
        	var metametadata_schema1 = $("input[id=meta-metadata-metadataSchema]").val();
        	var metametadata_language1 = $("input[id=meta-metadata-language]").val();

        	//technical
        	var technical_format1 = $("input[id=technical-format]").val();
        	var technical_size1 = $("input[id=technical-size]").val();
        	var technical_location1 = $("input[id=technical-location]").val();
        	var technical_requirement1 = $("input[id=technical-requirement]").val();
        	var technical_type1 = $("#technical-orComposite-type").find("selected").text();
        	var technical_name1 = $("#technical-orComposite-name").find("selected").text();
        	var technical_minversion1 = $("input[id=technical-orComposite-minimumVersion]").val();
        	var technical_maxversion1 = $("input[id=technical-orComposite-maximumVersion]").val();
        	var technical_installationremark1 = $("input[id=technical-installationRemarks]").val();
        	var technical_otherplatformreq1 = $("input[id=technical-otherPlatformRequirements]").val();
        	var technical_duration1 = $("input[id=technical-duration]").val();

        	//educational
        	var interactivitytype_value1 = $("#educational-interactivityType").find("selected").text();
        	var learningresourcetype_value1 = $("#educational-learningResourceType").find(":selected").text();
        	var interactivityLevel_value1 = $("#educational-interactivityLevel").find(":selected").text();
        	var semanticDensity_value1 = $("#educational-semanticDensity").find(":selected").text();
        	var intendedEndUserRole_value1 = $("#educational-intendedEndUserRole").find(":selected").text();
        	var context_value1 = $("#educational-context").find(":selected").text();
        	var typicalAgeRange_value1 = $("#educational-typicalAgeRange").val();
        	var difficulty_value1 = $("#educational-difficulty").find(":selected").text();
        	var typicalLearningTime_value1 = $("#educational-typicalLearningTime").val();
        	var description_value1 = $("#educational-description").val();
        	var edu_language_value1 = $("#educational-language").val();

        	//rights
        	var rights_costs_value1 = $("#rights-cost").find(":selected").text();
        	var copyrightAndOtherRestrictions_value1 = $("#rights-copyrightAndOtherRestrictions").find(":selected").text();
        	var rights_description1 = $("#rights-description").val();

        	//relation
        	var relation_kind_value1 = $("#relation-kind").find(":selected").text();
        	var relation_catalog1 = $("#relation-resource-identifier-catalog").val();
        	var relation_entry1 = $("#relation-resource-identifier-entry").val();
        	var relation_description1 = $("#relation-resource-description").val();

        	//annotation
        	var annotation_entity1 = $("#annotation-entity").val();
        	var annotation_date1 = $("#annotation-date").val();
        	var annotation_description1 = $("#annotation-description").val();

        	//classification
        	var classification_purpose_value1 = $("#classification-purpose").find(":selected").text();
        	var classification_source1 = $("#classification-taxonPath-source").val();
        	var classification_id1 = $("#classification-taxonPath-taxon-id").val();
        	var classification_entry1 = $("#classification-taxonPath-taxon-entry").val();
        	var classification_description1 = $("#classification-description").val();
        	var classification_keyword1 = $("#classification-keyword").val();

        	if(general_structure_value1 == "- - select - -"){
        		general_structure_value1 = "";
    		}
    		if(lifecycle_status_value1 == "- - select - -"){
        		lifecycle_status_value1 = "";
    		}
    		if(lifecycle_role_value1 == "- - select - -"){
        		lifecycle_role_value1 = "";
    		}
    		if(metametadata_role_value1 == "- - select - -"){
        		metametadata_role_value1 = "";
    		}
    		if(technical_type1 == "- - select - -"){
        		technical_type1 = "";
    		}
    		if(technical_name1 == "- - select - -"){
        		technical_name1 = "";
    		}
    		if(interactivitytype_value1 == "- - select - -"){
        		interactivitytype_value1 = "";
    		}
        	if(learningresourcetype_value1 == "- - select - -"){
        		learningresourcetype_value1 = "";
    		}
    		if(interactivityLevel_value1 == "- - select - -"){
        		interactivityLevel_value1 = "";
    		}
    		if(semanticDensity_value1 == "- - select - -"){
        		semanticDensity_value1 = "";
    		}
    		if(intendedEndUserRole_value1 == "- - select - -"){
        		intendedEndUserRole_value1 = "";
    		}
    		if(context_value1 == "- - select - -"){
        		context_value1 = "";
    		}
    		if(difficulty_value1 == "- - select - -"){
        		difficulty_value1 = "";
    		}
    		if(rights_costs_value1 == "- - select - -"){
        		rights_costs_value1 = "";
    		}
    		if(copyrightAndOtherRestrictions_value1 == "- - select - -"){
        		copyrightAndOtherRestrictions_value1 = "";
    		}
    		if(relation_kind_value1 == "- - select - -"){
        		relation_kind_value1 = "";
    		}
    		if(classification_purpose_value1 == "- - select - -"){
        		classification_purpose_value1 = "";
    		}


        	fs.writeFile(file.path, 
    		//general
			"<ELOMetadata>\n  <general>\n    <identifier>\n      <catalog>" + general_catalog_value1 + "</catalog>\n" + 
			"      <entry>"+general_entry_value1+"</entry>\n    </identifier>\n    <title>\n      " + 
			"<string language=\"en\">" + general_title_value1 + "</string>\n    </title>\n    <language>" + 
			general_language_value1 +"</language>\n    <description>\n      <string language=\"en\">" + 
			general_description_value1 + "</string>\n    </description>\n" + 
			"    <keyword>\n      <string language=\"en\">" + general_keyword_value1 +"</string>\n    </keyword>\n    " + 
			"<coverage>\n      <string language=\"en\">" + general_coverage_value1 +"</string>\n    </coverage>\n    " + 
			"<structure>\n      <source>LOMv1.0</source>\n      <value>"+ general_structure_value1 + "</value>\n    " + 
			"</structure>\n    <aggregationLevel>\n      <source>LOMv1.0</source>\n      " + 
			"<value>" + general_aggregationLevel1 + "</value>\n    </aggregationLevel>\n  </general>\n" +
			//lifeCycle 
			"  <lifeCycle>\n    <version>\n      <string language=\"en\">" + lifecycle_version_value1 + "</string>\n    " + 
			"</version>\n    <status>\n      <source>LOMv1.0</source>\n      <value>" + lifecycle_status_value1 + 
			"</value>\n    </status>\n    <contribute>\n      <role>\n" + 
			"        <source>LOMv1.0</source>\n        <value>" + lifecycle_role_value1 + 
			"</value>\n      </role>\n      <entity>" + lifecycle_entity1 +"</entity>\n      " + 
			"<date>\n        <datetime>" + lifecycle_date1 + "</datetime>\n        <description>\n          " + 
			"<string language=\"en\"></string>\n        </description>\n      </date>\n    </contribute>\n  </lifeCycle>\n" + 
			//metaMetadata
			"  <metaMetadata>\n    <identifier>\n      <catalog>" + metametadata_catalog1 + "</catalog>\n      <entry>" + 
			metametadata_entry1 + "</entry>\n    </identifier>\n    <contribute>\n      <role>\n        " + 
			"<source>LOMv1.0</source>\n        <value>"+ metametadata_role_value1 +"</value>\n" + 
			"      </role>\n      <entity>"+ metametadata_entity1 +"</entity>\n      <date>\n        <datetime>" + 
			metametadata_date1 +"</datetime>\n        <description>\n          <string language=\"en\"></string>\n" + 
			"        </description>\n      </date>\n    </contribute>\n    <metadataSchema>" + 
			metametadata_schema1 +"</metadataSchema>\n    <language>"+ metametadata_language1 +"</language>\n" + 
			"  </metaMetadata>\n" + 
			//technical
			"  <technical>\n    <format>" + technical_format1 + "</format>\n    <size>" + technical_size1 + 
			"</size>\n    <location>" + technical_location1 + "</location>\n    <requirement>\n      " + 
			"<string language=\"en\">" + technical_requirement1 + "</string>\n      <orComposite>\n        " + 
			"<type>\n          <source></source>\n          <value>" + technical_type1 + "</value>\n        " + 
			"</type>\n        <name>\n          <source></source>\n          <value>" + technical_name1 + 
			"</value>\n        </name>\n        <minimumVersion>" + technical_minversion1 + "</minimumVersion>\n        " + 
			"<maximumVersion>" + technical_maxversion1 + "</maximumVersion>\n      </orComposite>\n    " + 
			"</requirement>\n    <installationRemarks>\n      <string language=\"en\">" + technical_installationremark1 + 
			"</string>\n    </installationRemarks>\n    <otherPlatformRequirements>\n      " + 
			"<string language=\"en\">" + technical_otherplatformreq1 + "</string>\n    </otherPlatformRequirements>\n" + 
			"    <duration>\n      <duration>" + technical_duration1 + "</duration>\n      <description>\n        " + 
			"<string language=\"en\"></string>\n      </description>\n    </duration>\n  </technical>\n" + 
			//educational
			"  <educational>\n    <interactivityType>\n     <source>LOMv1.0</source>\n      <value>" + 
			interactivitytype_value1 + "</value>\n    </interactivityType>\n    <learningResourceType>\n      " + 
			"<source>LOMv1.0</source>\n      <value>" + learningresourcetype_value1 + "</value>\n" + 
			"    </learningResourceType>\n    <interactivityLevel>\n      <source>LOMv1.0</source>\n      <value>" + 
			interactivityLevel_value1 + "</value>\n    </interactivityLevel>\n    <semanticDensity>\n      " + 
			"<source>LOMv1.0</source>\n      <value>" + semanticDensity_value1 + "</value>\n" + 
			"    </semanticDensity>\n    <intendedEndUserRole>\n      <source>LOMv1.0</source>\n      <value>" + 
			intendedEndUserRole_value1 + "</value>\n    </intendedEndUserRole>\n    <context>\n      " + 
			"<source>LOMv1.0</source>\n      <value>" + context_value1 + "</value>\n    </context>\n" + 
			"    <typicalAgeRange>\n      <string language=\"en\">" + typicalAgeRange_value1 + "</string>\n    " + 
			"</typicalAgeRange>\n    <difficulty>\n      <source>LOMv1.0</source>\n      <value>" + difficulty_value1 + 
			"</value>\n    </difficulty>\n    <typicalLearningTime>\n      " + 
			"<duration>" + typicalLearningTime_value1 + "</duration>\n      <description>\n        " + 
			"<string language=\"en\"></string>\n      </description>\n    </typicalLearningTime>\n    " + 
			"<description>\n      <string language=\"en\">" + description_value1 + "</string>\n" + 
			"    </description>\n    <language>" + edu_language_value1 + "</language>\n  </educational>\n" + 
			//rights
			"  <rights>\n    <cost>\n      <source>LOMv1.0</source>\n      <value>" + rights_costs_value1 + 
			"</value>\n    </cost>\n    <copyrightAndOtherRestrictions>\n      <source>LOMv1.0</source>\n      <value>" + 
			copyrightAndOtherRestrictions_value1 + "</value>\n    " + 
			"</copyrightAndOtherRestrictions>\n    <description>\n      <string language=\"en\">" + 
			rights_description1 + "</string>\n    </description>\n  </rights>\n" + 
			//relation
			"  <relation>\n    <kind>\n      <source>LOMv1.0</source>\n      <value>" + relation_kind_value1 + 
			"</value>\n    </kind>\n    <resource>\n      <identifier>\n        <catalog>" + relation_catalog1 + 
			"</catalog>\n        <entry>" + relation_entry1 + "</entry>\n      </identifier>\n" + 
			"      <description>" + relation_description1 + "</description>\n    </resource>\n  </relation>\n" + 
			//annotation
			"  <annotation>\n    <entity>" + annotation_entity1 + "</entity>\n    <date>\n      <datetime>" + 
			annotation_date1 + "</datetime>\n      <description>\n        <string language=\"en\"></string>\n      " + 
			"</description>\n    </date>\n    <description>\n      <string language=\"en\">" + 
			annotation_description1 + "</string>\n    </description>\n  </annotation>\n" + 
			//classification
			"  <classification>\n    <purpose>\n      <source>LOMv1.0</source>\n      <value>" + 
			classification_purpose_value1 + "</value>\n    </purpose>\n" + 
			"    <taxonPath>\n      <source>\n        <string language=\"en\">" + classification_source1 + 
			"</string>\n      </source>\n      <taxon>\n        <id>" + classification_id1 + "</id>\n        <entry>\n          <string language=\"en\">" + classification_entry1 + "</string>\n        " + 
			"</entry>\n      </taxon>\n    </taxonPath>\n    <description>\n      <string language=\"en\">" + 
			classification_description1 + "</string>\n    </description>\n    <keyword>\n      <string language=\"en\">" + 
			classification_keyword1 + "</string>\n    </keyword>\n  </classification>\n</ELOMetadata>",  function(err) {
			   if (err) {
			       return console.error(err);
			   }
			   alert("Complete saving!");
			})
		}
    }

    else{
        if(x.value == ""){
            console.log("Select one or more files.");
        }
        else{
            console.log("The files property is not supported by your browser!");
        }
    }
};