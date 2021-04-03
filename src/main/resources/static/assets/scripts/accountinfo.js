 var $scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/jsbn.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/prng4.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/rng.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/rsa.js"></script>')

var tryingbool = false;
//회원정보
var InitFunction = {
		init : function (){
			$.ajax({
				type : 'GET',
				url : '/api/accountInfo',
				success : function(result) {
					$("#id").val(result.id);
					$("#pw-id").val(result.id);
					$("#user-id").val(result.userId);
					$("#user-name").val(result.userName);
					$("#user-phone").val(result.userPhone);
					$("#user-position").val(result.userPosition);
				},
				error : function(e) {
					alert("실패 : " + e.responseJSON.message);
					console.log(e)
				}
			});
		}
}
	

$(document).ready(function() {
	if($('#isExpiredPass').val()==1){
		alert($("#passwordExpireMessage").text());
		$("#passwordExpireMessage").show();
	}
	//회원정보 가져오기
	InitFunction.init();
	
	//비밀번호 변경 모달 제어
	$("#change-pwd-button").click(function(){
		$('#change-pwd-modal').modal();
	})
	
	//회원정보 수정
	$('#account-info-submit').click(function(e) {
		e.preventDefault();
		$.ajax({
				type:'POST',
				url:'/api/accountInfo/put',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify($('#account-info-form').serializeJSON({checkboxUncheckedValue: "0"})),
				async : false,
				success : function(returnValue) {
					alert('회원정보가 수정되었습니다.');
					location.reload();
				},
				error : function(e) {
					alert(e.responseJSON.message);
				}
		});
	});
	
	//비밀번호 변경 처리
	$("#password-change-submit").click(function(e) {
		e.preventDefault();
		if(tryingbool){
			return false;
		}else {
			tryingbool = true;
		}
			$.ajax({
				type: "GET",
				async: false,
				url: "/api/security/rsaKey",
				dataType: "json",
				success: function (rsaObject) {
					var publicKeyModulus = rsaObject.publicKeyModulus;
					var publicKeyExponent = rsaObject.publicKeyExponent;
					var rsa = new RSAKey();
					rsa.setPublic(publicKeyModulus,publicKeyExponent);
					var oldNewPwd =$("#new-pwd").val()
					var oldOldPwd =$("#old-pwd").val()
					var oldChkPwd =$("#chk-pwd").val()
					$("#new-pwd").val(rsa.encrypt($("#new-pwd").val()));
					$("#old-pwd").val(rsa.encrypt($("#old-pwd").val()));
					$("#chk-pwd").val(rsa.encrypt($("#chk-pwd").val()));

					$.ajax({
						type:'POST',
						url:'/api/account/password/put',
						contentType : "application/json; charset=utf-8",
						data : JSON.stringify($('#chang-pwd-form').serializeJSON()),
						async : false,
						success : function(returnValue) {
							alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
							location.reload();
						},
						error : function(e) {
							$("#new-pwd").val(oldNewPwd);
							$("#old-pwd").val(oldOldPwd);
							$("#chk-pwd").val(oldChkPwd);
							alert(e.responseJSON.message);
							tryingbool = false;
						}
					});
				},
				error: function (e) {
					alert('error : ' + e.responseJSON.message)
					tryingbool = false;
				}
			});
	});
});