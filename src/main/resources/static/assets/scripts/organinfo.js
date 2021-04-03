$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/scripts/daum_zipcode.js"></script>')

//회사정보
var InitFunction = {
		init : function (){
			$.ajax({
				type : 'GET',
				url : '/api/organInfo',
				success : function(result) {
					$("#id").val(result.id);
					$("#organ-name").val(result.organName);
					$("#organ-phone").val(result.organPhone);
					$("#organ-num").val(result.organNum);
					$("#organ-zipcode").val(result.organZipcode);
					$("#organ-address").val(result.organAddress);
					$("#admin-id").val(result.adminId);
				},
				error : function(e) {
					alert(e.responseJSON.message);
					console.log(e)
				}
			});
		}
}
	

$(document).ready(function() {
	
	//회사정보 가져오기
	InitFunction.init();
	
	//우편번호 검색    
	$("#address-search-button").click(function(){
		daum.postcode.load(function(){
	        new daum.Postcode({
	            oncomplete: function(data) {
	            	$("#organ-zipcode").val(data.zonecode);
	            	$("#organ-address").val(data.address + data.buildingName);
	            }
	        }).open();
	    });
	});
	
	//마스터 관리자 모달제어
	$("#change-master-button").click(function(){
		$('#change-master-modal').modal();
	})
	
	//회사정보 수정
	$('#organ-info-submit').click(function(e) {
		e.preventDefault();
		$.ajax({
				type:'POST',
				url:'/api/organInfo/put',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify($('#organ-info-form').serializeJSON({checkboxUncheckedValue: "0"})),
				async : false,
				success : function(returnValue) {
					alert('회사 정보가 수정되었습니다.');
					location.reload();
				},
				error : function(e) {
					alert('수정 실패 : '+e.responseJSON.message);
				}
		});
	});
});