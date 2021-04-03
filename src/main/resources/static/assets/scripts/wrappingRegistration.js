$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>')

var initEvents = function(){
	$("#apkFile").change(function(e) {
		
	    var name = e.target.files[0].name
	    switch(name.substring(name.lastIndexOf('.') + 1).toLowerCase()){
	        case 'apk':
	            break;
	        default:
	            $(this).val('');
	            // error message here
	            alert(getMessage("obfuscation.chooseMessage.apk", "apk 파일을 선택해 주세요."));
	            break;
	    }
//	   if(name.lastIndexOf(".")!=name.indexOf(".")){
//		   $(this).val('');
//		   alert("파일명에 .(dot)은 포함될 수 없습니다.");
//	   };
//	   if(name.includes(" ")){
//		   $(this).val('');
//		   alert("파일명에 공백은 포함될 수 없습니다.");
//	   };
	});
	$("#settingFile").change(function(e) {
		var name = e.target.files[0].name
		switch(name.substring(name.lastIndexOf('.') + 1).toLowerCase()){
		case 'txt':
			break;
		default:
			$(this).val('');
		// error message here
		alert("txt 파일을 선택해 주세요");
		break;
		}
		if(name.lastIndexOf(".")!=name.indexOf(".")){
			   $(this).val('');
			   alert(getMessage("obfuscation.fileNameCondition","파일명에 .(dot)은 포함될 수 없습니다."));
		   };
	});
	$("#mappingFile").change(function(e) {
		var name = e.target.files[0].name
		switch(name.substring(name.lastIndexOf('.') + 1).toLowerCase()){
		case 'txt':
			break;
		default:
			$(this).val('');
		// error message here
		alert(getMessage("obfuscation.chooseMessage.txt", "txt 파일을 선택해 주세요"));
		break;
		}
		if(name.lastIndexOf(".")!=name.indexOf(".")){
			   $(this).val('');
			   alert(getMessage("obfuscation.fileNameCondition","파일명에 .(dot)은 포함될 수 없습니다."));
		   };
	});
	$("#filesSubmit").click(function(){
		$.ajax
		console.log(files);
	});
	
	
//
//		if (type != type1){
//			uploadErrors.push('파일명에 .(dot)은 포함될수 없습니다.');
//		}
//		
//		if(filename.substring(type + 1) != "txt") {
//			uploadErrors.push('확장자 apk 파일로 올려주세요.');
//		}
//		
//		if(is_file){
//			uploadErrors.push("하나의 파일만 업로드 해주세요 ");
//		}
//		is_file = true;
//		
//		if(uploadErrors.length > 0) {
//			apkDropZone.removeFile(file);
//			is_file = false;
//			alert(uploadErrors.join("\n"));
//			return;            				
//		}
		
}
var initClickEvent = function(){
	$('#submit').click(function(e){
		e.preventDefault();
		// Get form
        var form = $('#filesForm')[0];

		// Create an FormData object
        var data = new FormData(form);
        //TO-DO validation
        if(data.get("apkFile").name==""){
        	alert(getMessage("obfuscation.fileRequired.apk","apk 파일은 필수 항목 입니다."));
        	return;
        }else if(data.get("settingFile").name=="") {
        	alert(getMessage("obfuscation.fileRequired.setting","Setting 파일은 필수 항목 입니다."))
        	return;
        }
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/api/upload/wrappingFile",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            async : false,
            timeout: 600000,
            success: function (data) {
                alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
                location.href="/wrapping/list"
            },
            error: function (e) {
            	alert(e.responseJSON.message);

            }
        });

	});
	
	$('#setting-modal-button').click(function(e) {
		e.preventDefault();
		$('#setting-modal').modal('show');
	});
}
	
var initSettingFileDownloadLink = function(){
	$.ajax({
		type:'GET',
		url:'/api/wrapping/defaultFileList',
		success : function(returnValue){
			$(returnValue.setting).each(function(i){
				$('#url-list').append('<div><a href="/api/download/wrapping/defaultFile/'+returnValue.id[0]+'/'+returnValue.setting[i]+'">'+returnValue.setting[i]+'</a><div><br>')
			});
			$('#url-list').append('<hr>');
			$('#url-list').append('<div><a href="/api/download/wrapping/manual/'+returnValue.id[0]+'/'+returnValue.manual[0]+'">'+returnValue.manual[0]+'</a><div><br>')
			return
			
		},
		error:function(e){
			console.log(e)
		}
			
	});
}
jQuery(document).ready(function() {    
	initEvents();
	initClickEvent();
	initSettingFileDownloadLink();
//   FormDropzone();
});
