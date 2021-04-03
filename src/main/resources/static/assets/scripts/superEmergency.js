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
var hasRole = ($('#hasRole').val()=='true')
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
														content += '<span id="api-id-'+row.id+'">'+data+'</span>';
														return content;
														
													},
											targets : [ 1 ]
										},{
//										                	 'data' : function(row, type, val, meta) {},
//													
														'render' : function( data, type, row, meta) {
														content = "";
														content += "<button class='ip-mod-button btn btn-sm blue btn-outline'>"+getMessage('common.edit','수정')+"</button>"
														content += "<button class='ip-delete-button btn btn-sm red btn-outline'>" + getMessage('common.remove', '삭제') + "</button>"
														return content;
														
													},
											targets : [ 2 ],
											visible:((isSuper&&isMaster)||hasRole)
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
			}).done(isEmergency());
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
			if($("#new-ip-form #baseUrl").val().length<1){
				alert(getMessage("emergency.baseUrlIsRequired", "Base URL은 필수 항목 입니다."))
				return false;
			}
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
			if($("#ip-mod-form #baseUrl").val().length<1){
				alert(getMessage("emergency.baseUrlIsRequired", "Base URL은 필수 항목 입니다."))
				return false;
			}
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
var eventInit = function(){
	$('#isEmergencyButton').click(function(){
		//매개변수는 팝업창을 보여줄 것인지 여부
		isEmergency(true);
	});
	$('#emergencyEnableButton').click(function(){
		enableEmergency();
	});
	$('#emergencyDisableButton').click(function(){
		disableEmergency();
	});
}

var isEmergency = function(isRetry) {
	$(".wrap-loading").removeClass('displayNone');
	for(var i=0; i<oTable.rows()[0].length; i++){
		$.ajax({
			type : "POST",
			url : "/api/super/emergency/isEmergency",
			data : JSON.stringify({"baseUrl":oTable.row(i).data().baseUrl}),
			async : false,
			contentType : "application/json; charset=utf-8",
			success : function(returnValue) {
				console.log(JSON.stringify({"baseUrl":oTable.row(i).data().baseUrl}), returnValue)
				if (returnValue==1) {
					oTable.cell(i, 1).data(getMessage('securityMode.hybridMode', '하이브리드 모드'));
				} else if(returnValue==0){
					oTable.cell(i, 1).data(getMessage('securityMode.dynamicMode','다이나믹 모드'));
				} else{
					oTable.cell(i, 1).data("error");
				}
			},
			beforSend : function(){
			},
			error : function(e) {
				oTable.cell(i, 1).data("error : "+ e.responseJSON.message);
				console.log(e);
			}
		});
	}
	if(isRetry){
		alert(getMessage('file.status.finished','처리 완료'));
	}
	$(".wrap-loading").addClass('displayNone');
	
	
}
var enableEmergency = function() {
	var hasError = 0;
	var connButNotOk =0;
	for(var i=0; i<oTable.rows()[0].length; i++){
		$.ajax({
			type : "POST",
			url : "/api/super/emergency/enableEmergency",
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
	isEmergency();
	var alertMessage = getMessage('api.emergencyActivate',"등록된 모든 API 서버에 비상모드 활성 요청을 했습니다.");
	
	if(hasError==1){
		alertMessage += getMessage('api.errorMoreThanOneRequest',"\n[1개 이상의 요청에서 에러가 발생했습니다.]");
	}
	if(connButNotOk==1){
		alertMessage += getMessage('api.not200MoreThanOneRequest',"\n[1개 이상의 요청에서 200OK가 아닌 응답을 받았습니다. (API서버에서 IP허용이 안되어있을수 있습니다.)]");
	}
	alert(alertMessage)
	
}
var disableEmergency = function() {
	var hasError = 0;
	var connButNotOk =0;
	for(var i=0; i<oTable.rows()[0].length; i++){
		$.ajax({
			type : "POST",
			url : "/api/super/emergency/disableEmergency",
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
	isEmergency();
	var alertMessage = getMessage('api.emergencyInactivate',"등록된 모든 API 서버에 비상모드 비활성 요청을 했습니다.");
	
	if(hasError==1){
		alertMessage += getMessage('api.errorMoreThanOneRequest',"\n[1개 이상의 요청에서 에러가 발생했습니다.]");
	}
	if(connButNotOk==1){
		alertMessage += getMessage('api.not200MoreThanOneRequest',"\n[1개 이상의 요청에서 200OK가 아닌 응답을 받았습니다. (API서버에서 IP허용이 안되어있을수 있습니다.)]");
	}
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
	apiServerList();
	isEmergency();
	eventInit();
	modalInit();
});