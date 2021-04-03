$scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')

var oTable;
var isSuper = ($('#isSuper').val()=='true');
var isMaster = ($('#isMaster').val()=='true');
var hasRole = ($('#hasRole').val() == 'true');
var verificationStatusDom = $("#verification-status");

var eventInit = function(){
	$('#checkStatusButton').click(function(){
		//매개변수는 팝업창을 보여줄 것인지 여부
		checkStatus(true);
	});
	$('#enableVerificationButton').click(function(){
		enableVerification();
	});
	$('#disableVerificationButton').click(function(){
		disableVerification();
	});
}

var checkStatus = function(isRetry) {
	$.ajax({
		type : "GET",
		url : "/api/super/verifyFlagByEms",
		async : false,
		contentType : "application/json; charset=utf-8",
		success : function(returnValue) {
			if(returnValue=="true"){
				verificationStatusDom.html("<div class='blue-color'>"+returnValue+"</div>")
			}else if(returnValue=="false"){
				verificationStatusDom.html("<div class='red-color'>"+returnValue+"</div>")
			}else{
				verificationStatusDom.html("<div class='red-color'>"+"N/A"+"</div>")
			}
			console.log(returnValue);
		},
		error : function(e) {
			alert(e.responseJSON.message);
			console.log(e);
		}
	});
	if(isRetry){
		alert(getMessage('file.status.finished','처리 완료'));
	}
	$(".wrap-loading").addClass('displayNone');
}
var enableVerification = function() {
	$.ajax({
		type : "POST",
		url : "/api/super/verifyFlagByEms/true",
		async : false,
		contentType : "application/json; charset=utf-8",
		success : function(returnValue) {
			checkStatus();
			alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
		},
		error : function(e) {
			alert("error : " + e.responseJSON.message);
			console.log(e);
			checkStatus();
		}
	});

	
}
var disableVerification = function() {
	$.ajax({
		type : "POST",
		url : "/api/super/verifyFlagByEms/false",
		async : false,
		contentType : "application/json; charset=utf-8",
		success : function(returnValue) {
			checkStatus();
			alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
		},
		error : function(e) {
			alert("error : " + e.responseJSON.message);
			console.log(e);
			checkStatus();
		}
	});

}

jQuery(document).ready(function() {
	// verificationStatus();
	checkStatus();
	eventInit();
});