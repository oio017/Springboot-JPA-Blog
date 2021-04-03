$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>')

var initEvents = function(){
	$("#engineFile").change(function(e) {
	    var name = e.target.files[0].name
//	   if(name.lastIndexOf(".")!=name.indexOf(".")){
//		   $(this).val('');
//		   alert("파일명에 .(dot)은 포함될 수 없습니다.");
//	   };
	});
}
var initClickEvent = function(){
	$('#submit').click(function(e){
		// Get form
        var form = $('#filesForm')[0];

		// Create an FormData object
        var data = new FormData(form);
		
		e.preventDefault();
		$.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/api/upload/engineFile",
            contentType: "application/json; charset=utf-8",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                alert("engine 업로드가 완료되었습니다.");
                location.href="/wrapping/engine/list"
            },
            error: function (e) {
            	alert(e.responseJSON.message);

            }
        });

	});
}
	
jQuery(document).ready(function() {    
	initEvents();
	initClickEvent();
});
