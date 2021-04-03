var $scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')

var table = $('#task-table');
var oTable;
var vTable;
var InitFunction = function() {
	return {
		table : function() {
			var mainTable = function() {
				// table에 datatable적용
				$
						.ajax({
							type : 'GET',
							url : '/api/ip',
							success : function(returnValue) {
								// api address와 api port 화면에 할당
								oTable = table
										.DataTable({
											dom : 'Blfrtp',
											buttons : [  ],
											"autoWidth" : false,
											"lengthMenu" : [
													[ 10, 15, 20, 50, 100, -1 ],
													[ 10, 15, 20, 50, 100,
															"All" ] // change
											// per page
											// values
											// here
											],
											"pageLength" : 20,
											data : returnValue,
											columns : [null, 
											           null,
											           null, 
											           {data : "description"},
											           null,
											           null
											           ],
											"columnDefs" : [
													{
														'data' : "regDate",
														'render' : function(data, type, row, meta) {
															return timeFormat(data);
														},
														'targets' : [ 0 ]
													},
													{
														'data' : function(row, type, val, meta ){
															var result="";
															if(row.type==0){
																result=getMessage('allowedIp.single','단일');
															}else{
																result=getMessage('allowedIp.range','구간');
															}
															return result;
														},
														'targets' : [ 1 ]
													},{
														'data' : function(row, type, val, meta ){
															var result="";
															if(row.type==0){
																result = row.startIp;
															}else{
																result = row.startIp + " ~ " + row.endIp;
															}
															return result;
														},
														'targets' : [ 2 ]
													},{
														'data' : function(row, type, val, meta ){
															var result="";
															if(row.active==0){
																result = getMessage('common.inactive','비활성');
															}else{
																result = getMessage('common.active','활성');
															}
															return result;
														},
														'targets' : [ 4 ]
													},{
														'data' : function(row, type, val, meta ){
															var result="";
															result += "<div class='button-wrap'>";
															buttons = []
															if ($('#hasIpWriteAccess').val() == 'true') {
																buttons.push("<button class='btn btn-sm green btn-outline ip-mod-button'>"+getMessage('common.edit','수정')+"</button>");
																buttons.push("<button class='btn btn-sm red btn-outline ip-delete-button'>"+getMessage('common.delete','삭제')+"</button>");
															}
															result += buttons.join("&nbsp;&nbsp;");
															return result;
														},
														'targets' : [ 5 ]
													}
													],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 0, "desc" ] ],

										});
							},
							error : function(e) {
								alert(e.responseJSON.message);
							}

						});
				// hide search box with special css class
				var nEditing = null;
				var nNew = false;
				// add-app
				$('#add-app').click(function(e) {
					e.preventDefault();
					$('#app-reg-modal').modal();
				});

				// 정보 수정 submit
			}
			return {
				// main function to initiate the module
				init : function() {
					mainTable();
				}
			};
		},
		modalInit : function(){
			//ip 등록 클릭

			//업무등록 submit버튼 클릭 시
			$('#new-ip-submit').click(function(e){
				e.preventDefault();
				$('#new-organ-id').val($('#AccountInfo').data('organid'));
				var ipEntity =$('#new-ip-form').serializeJSON({checkboxUncheckedValue: "0"});
				$.ajax({
					type:'POST',
					url:'/api/ip',
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(ipEntity),
					async : false,
					success : function(returnValue) {
						alert(getMessage('common.submitMessage','등록 완료'));
						location.reload();
					},
					error : function(e) {
						console.log(e);
						alert(e.responseJSON.message)
						console.log(e);
					}
			});
				
				
				
			});
			
			//상세(수정)버튼 클릭 시
			table.on('click', '.ip-mod-button', function(e) {
				e.preventDefault();
				$('.make-switch').bootstrapSwitch();
				$('#mod-ip-form input').val("");
				$('#task-option-form #description').val("");
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				$('#mod-ip-form #startIp').val(data.startIp)
				$('#mod-ip-form #endIp').val(data.endIp)
				$('#mod-ip-form #description').text(data.name);
				$('#mod-ip-form #id').val(data.id);
				keys = Object.keys(data);
				//선택된 app object property를 순회하면서 값 설정
				var nStart = new Date().getTime();
				for(var i in keys){
					if(keys[i]=="type"||keys[i]=="active"){
						if(data[keys[i]]==0){
							$('#mod-ip-form #'+[keys[i]]).bootstrapSwitch('state', false);
							$('#mod-ip-form #'+[keys[i]]).val('0');
						}else{
							$('#mod-ip-form #'+[keys[i]]).bootstrapSwitch('state', true);
							$('#mod-ip-form #'+[keys[i]]).val('1');
						}
					}else{
						$('#mod-ip-form #mod-'+[keys[i]]).val(data[keys[i]]);
					}
				}
				$('#mod-ip-form .make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
					if(state){
						$(this).val('1');
					} else{
						$(this).val=('0');
					}
				});
				//$('#app-option-id').val(data["id"]);
				
				/* Get the row as a parent of the link that was clicked on */
				// 패키지 정보 할당
				// TODO internationalization				
				$('#ip-detail-modal').modal('show');
				
				
				//task submit 클릭 이벤트
				$('#ip-update-submit').click(function(e) {
					e.preventDefault();
					
					$.ajax({
							type:'POST',
							url:'/api/ip/put',
							contentType : "application/json; charset=utf-8",
							data : JSON.stringify($('#mod-ip-form').serializeJSON({checkboxUncheckedValue: "0"})),
							async : false,
							success : function(returnValue) {
								alert(getMessage('common.updatedMessage','수정 완료'));
								location.reload();
							},
							error : function(e) {
									alert(e.responseJSON.message);
							}
					});
					/* Get the row as a parent of the link that was clicked on */
					// 패키지 정보 할당
					// TODO internationalization
					
				});
				//모달 해제시 서밋 이벤트 바인딩도 해제
				$('#task-detail-modal').on('hidden.bs.modal', function(e){
					$('#task-update-submit').off();
				});
			});
			

			
			table.on('click', '.ip-delete-button', function(e) {
				e.preventDefault();
				var policyList=[];
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				var relatedPolices="";
				if(confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))){
					$.ajax({
						type:'POST',
						url:'/api/ip/delete',
						contentType : "application/json; charset=utf-8",
						data : JSON.stringify({"id":data.id}),
						async : false,
						success : function(returnValue) {
							alert(getMessage('common.removeComplete','삭제 완료'));
							location.reload();
						},
						error : function(e) {
							alert(e.responseJSON.message);
						}
						
					});
					
					
				}else{
					return false;
				}
			});
			
		},
		init : function() {
			this.initDaterange;
			// this.initCreateTable()
			this.table().init();
			this.modalInit();
			
		}
	}

}();

$(document).ready(function() {
	//Metronic.init();
	//새로 생성 초기화
	$('#new-ip-button').click(function(e){
		e.preventDefault();
		$('#new-ip-form input').val('');
		$('#new-ip-form textarea').val('');
		$('#new-ip-form #organ-id').val($('#AccountInfo').data("organid"));
		$('.make-switch').bootstrapSwitch();
		$('#new-ip-form .make-switch').val("1");
		$('#new-ip-form .make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
			if(state){
				$(this).val('1');
			} else{
				$(this).val=('0');
			}
		});
		$('#new-type-switch').on('switchChange.bootstrapSwitch', function(event, state) {
			if(state){
				$('#new-endIp').attr('disabled', false);
			} else{
				$('#new-endIp').val('');
				$('#new-endIp').attr('disabled', true);
			}
		});
		$('#new-ip-modal').modal('show');
	
	});
	$('#new-ip-modal').on('hidden.bs.modal', function(e){
		
	});
	$('#mod-ip-form #type').on('switchChange.bootstrapSwitch', function(event, state) {
		if(state){
			$('#mod-endIp').attr('disabled', false);
		} else{
			$('#mod-endIp').val('');
			$('#mod-endIp').attr('disabled', true);
		}
	});
	InitFunction.init();
	$('[data-toggle="popover"]').popover();
});