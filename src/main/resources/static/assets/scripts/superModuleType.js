$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')

var oTable;
var isSuper = ($('#isSuper').val()=='true');
var isMaster = ($('#isMaster').val()=='true');
var hasAuth = ($('#hasAuth').val());
var apiServerList = function() {
	oTable = $('#api-server-table').DataTable();
	$
			.ajax({
				type : "GET",
				url : "/api/super/emergency/ip",
				data : {
					mType : "apiList"
				},
				async:false,
				success : function(returnValue) {
					oTable.destroy();

					var selected = [];
					oTable=$('#api-server-table')
							.DataTable(
									{
										dom : 'Blfrtp',
										buttons : [  ],
										data : returnValue,
										columns : [ 
										            {data : "baseUrl"}, 
										            null,
										            null 
										            ],
										"columnDefs" : [ 
										                 {
//										                	 'data' : function(row, type, val, meta) {},
//													
														'render' : function( data, type, row, meta) {
														content = "";
														content += '<span id="api-id-'+row.id+'"></span>';
														return content;
														
													},
											targets : [ 1 ]
										},{
//										                	 'data' : function(row, type, val, meta) {},
//													
														'render' : function( data, type, row, meta) {
														content = "";
														content += '<button class="ip-mod-button btn btn-sm blue btn-outline">'+getMessage('common.edit','수정')+'</button>';
														content += '<button class="ip-delete-button btn btn-sm red btn-outline">'+getMessage('common.remove', '삭제')+'</button>';
														return content;
														
													},
											targets : [ 2 ],
											visible:((isSuper&&isMaster)||hasAuth)
										} ],
										"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
							            
							            "order": [
									                [0, "desc"]
									              ],
									});
				},
				error:function(e){
					console.log(e);
				}
			}).done(getLzmaStatus());
}
var modalInit = function(){
		//노드 등록 클릭
		$('#new-api-ip-button').click(function(e){
			e.preventDefault();
			$('#new-api-ip-modal').modal('show');
		});
		//노드등록 submit버튼 클릭 시
		$('#new-ip-submit').click(function(e){
			e.preventDefault();
			var ipEntity =$('#new-ip-form').serializeJSON({checkboxUncheckedValue: "0"});
			$.ajax({
				type : "POST",
				url : "/api/super/emergency/ip",
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(ipEntity),
				async : false,
				success : function(returnValue) {

					alert(getMessage('common.submitMessage','등록 완료'));
					location.reload();
				},
				error : function(e) {
					console.log(e);
					alert("error : " + e.responseJSON.message);
				}
			});
		});
		//ip수정 submit버튼 클릭 시
		$('#ip-mod-submit').click(function(e){
			e.preventDefault();
			var ipEntity =$('#ip-mod-form').serializeJSON({checkboxUncheckedValue: "0"});
			$.ajax({
				type : "POST",
				url : "/api/super/emergency/ip/put",
				data : JSON.stringify(ipEntity),
				async : false,
				contentType : "application/json; charset=utf-8",
				success : function(returnValue) {
					alert(getMessage('common.updatedMessage','수정 완료'));
					location.reload();
				},
				error : function(e) {
					console.log(e);
					alert("error : " + e.responseJSON.message);
				}
			});
		});
		
	
		oTable.on('click', '.ip-delete-button', function(e) {
			e.preventDefault();
			var nRow = $(this).parents('tr')[0];
			var data = oTable.row(nRow).data();
			
			
			if(confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))){
				$.ajax({
					type : "POST",
					url : "/api/super/emergency/ip/delete",
					data : JSON.stringify({"id":data.id}),
					async : false,
					contentType : "application/json; charset=utf-8",
					success : function(returnValue) {
						alert(getMessage('common.removeComplete','삭제 완료'));
						location.reload();
					},
					error : function(e) {
						console.log(e);
						alert("error : " + e.responseJSON.message);
					}
				});
				
			}else{
				return false;
			}
		});
		oTable.on('click', '.ip-mod-button', function(e) {
			e.preventDefault();
			var nRow = $(this).parents('tr')[0];
			var data = oTable.row(nRow).data();
			$('#ip-mod-form #baseUrl').val(data.baseUrl);
			$('#ip-mod-form #id').val(data.id);
			$('#mod-api-ip-modal').modal('show');
		});
		
}
var initPersistentStatus = function(){
	$.ajax({
		type : "GET",
		url : "/api/super/moduleType/getPersistentStatus",
		async : true,
		contentType : "application/json; charset=utf-8",
		success : function(returnValue) {
			var $persistentStatus = $("#persistentStatus");
			if(returnValue==".enc"){
				$persistentStatus.text(getMessage("super.module.fileMode" , "파일 모드"))
			}else if(returnValue==".data"){
				$persistentStatus.text(getMessage("super.module.dataMode" , "데이터 모드"))

			}
		},
		beforSend : function(){

		},
		error : function(e) {
			alert(e);
		}
	});
}
var eventInit = function(){
	$('#getLzmaStatusButton').click(function(){
		//매개변수는 팝업창을 보여줄 것인지 여부
		getLzmaStatus(true);
	});
	$('#lzmaEnableButton').click(function(){
		enableLzma();
	});
	$('#lzmaDisableButton').click(function(){
		disableLzma();
	});
}

var getLzmaStatus = function(isRetry) {
	$(".wrap-loading").removeClass('displayNone')
	for(var i=0; i<oTable.rows()[0].length; i++){
		$.ajax({
			type : "POST",
			url : "/api/super/moduleType/getStatus",
			data : JSON.stringify({"baseUrl":oTable.row(i).data().baseUrl}),
			async : false,
			contentType : "application/json; charset=utf-8",
			success : function(returnValue) {
				if (returnValue==1) {
					$('#api-id-'+oTable.row(i).data().id).text(getMessage("super.module.dataMode" , "데이터 모드"));
					$('#api-id-'+oTable.row(i).data().id).addClass("emergencyBold");
				} else if(returnValue==0){
					$('#api-id-'+oTable.row(i).data().id).text(getMessage("super.module.fileMode" , "파일 모드"));
					$('#api-id-'+oTable.row(i).data().id).removeClass("emergencyBold");
				} else{
					$('#api-id-'+oTable.row(i).data().id).text("error");
					$('#api-id-'+oTable.row(i).data().id).removeClass("emergencyBold");
				}
			},
			beforSend : function(){
				$('#api-id-'+oTable.row(i).data().id).text("로드중...");
			},
			error : function(e) {
				//alert(e);
				$('#api-id-'+oTable.row(i).data().id).text("error : "+ e.responseJSON.message);
				$('#api-id-'+oTable.row(i).data().id).removeClass("emergencyBold");
				console.log(e);
			}
		});
	}
	if(isRetry){
        alert(getMessage('file.status.finished','처리 완료'));
	}
	$(".wrap-loading").addClass('displayNone')
	
	
}
var enableLzma = function() {
	var hasError = 0;
	var connButNotOk =0;
	for(var i=0; i<oTable.rows()[0].length; i++){
		$.ajax({
			type : "POST",
			url : "/api/super/moduleType/enableLzma",
			data : JSON.stringify({"baseUrl":oTable.row(i).data().baseUrl}),
			async : false,
			contentType : "application/json; charset=utf-8",
			success : function(returnValue) {
				if(returnValue==-1){
					hasError=1;
				}else if(returnValue==0){
					//커넥션 연결 성공 후 리턴 status값에 200이 아닌 값이 들어왔을 때
					connButNotOk=1;
				}
			},
			error : function(e) {
				alert("error : " + e.responseJSON.message);
				console.log(e);
			}
		});
	}
	getLzmaStatus();
    var alertMessage = getMessage('common.successMessage',"요청이 성공적으로 이루어 졌습니다.") + "["+getMessage("super.module.dataMode" , "데이터 모드") +"]";

    if(hasError==1){
        alertMessage += getMessage('api.errorMoreThanOneRequest',"\n[1개 이상의 요청에서 에러가 발생했습니다.]");
    }
    if(connButNotOk==1){
        alertMessage += getMessage('api.not200MoreThanOneRequest',"\n[1개 이상의 요청에서 200OK가 아닌 응답을 받았습니다. (API서버에서 IP허용이 안되어있을수 있습니다.)]");
    }
	initPersistentStatus()
    alert(alertMessage)

}
var disableLzma = function() {
	var hasError = 0;
	var connButNotOk =0;
	for(var i=0; i<oTable.rows()[0].length; i++){
		$.ajax({
			type : "POST",
			url : "/api/super/moduleType/disableLzma",
			data : JSON.stringify({"baseUrl":oTable.row(i).data().baseUrl}),
			async : false,
			contentType : "application/json; charset=utf-8",
			success : function(returnValue) {
				if(returnValue==-1){
					hasError=1;
				}else if(returnValue==0){
					//커넥션 연결 성공 후 리턴 status값에 200이 아닌 값이 들어왔을 때
					connButNotOk=1;
				}
			},
			error : function(e) {
				alert("error : " + e.responseJSON.message);
				console.log(e);
			}
		});
	}
	getLzmaStatus();
    var alertMessage = getMessage('common.successMessage',"요청이 성공적으로 이루어 졌습니다.") + "["+getMessage("super.module.fileMode" , "파일 모드") +"]";

    if(hasError==1){
        alertMessage += getMessage('api.errorMoreThanOneRequest',"\n[1개 이상의 요청에서 에러가 발생했습니다.]");
    }
    if(connButNotOk==1){
        alertMessage += getMessage('api.not200MoreThanOneRequest',"\n[1개 이상의 요청에서 200OK가 아닌 응답을 받았습니다. (API서버에서 IP허용이 안되어있을수 있습니다.)]");
    }
	initPersistentStatus();
    alert(alertMessage)

}

var ipValidator = function(ip){
	var ipReg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
	if(ipReg.test(ip)){
		return true
	}else{
        alert(getMessage("api.invalidIpFormat","ip형식이 잘못되었습니다. 다시 입력해 주세요"));
		return false;
	}
		
}
var portValidator = function(port){
	var portReg = /^[0-9]{1,5}$/;
	if(portReg.test(port)){
		return true
	}else{
        alert(getMessage('api.port5digitsOrLess',"포트는 5자리 이하의 숫자만 입력가능 합니다."));
		return false;
	}
		
}

jQuery(document).ready(function() {
	initPersistentStatus();
	apiServerList();
	getLzmaStatus();
	eventInit();
	modalInit();
});