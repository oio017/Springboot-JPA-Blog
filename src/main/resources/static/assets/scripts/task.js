$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')

var table = $('#task-table');
var oTable;
var vTable;
var isSuper = ($('#isSuper').val()=='true');
var InitFunction = function() {
	return {
		table : function() {
			var mainTable = function() {
				// table에 datatable적용
				$
						.ajax({
							type : 'GET',
							url : '/api/task',
							success : function(returnValue) {
								// api address와 api port 화면에 할당
								oTable = table
										.DataTable({
											 initComplete: function () {
												 this.api().column(0).every( function () {
										                var column = this;
										                var select = $('#organ-select').on( 'change', function () {
										                        var val = $.fn.dataTable.util.escapeRegex(
										                            $(this).val()
										                        );
										 
										                        column
										                            .search( val ? '^'+val+'$' : '', true, false )
										                            .draw();
										                    } );
										                select.append('<option value="">'+getMessage('common.allOrgan','전체 기관')+'</option>' );
										                $.ajax({
										                	type : 'GET',
										                	url : '/api/task/organNames',
										                	success: function(returnValue){
										                		for(var item in returnValue){
										                			select.append( '<option value="'+returnValue[item]+'">'+returnValue[item]+'</option>' )
										                		}
										                	},
										                	error: function(e){
										                		alert(e.responseJSON.message)
										                		select.append( '<option value="">'+getMessage('common.organNameLodeFail','기관명 로드 실패')+'</option>' )
										                	}
										                })
//										                column.data().unique().sort().each( function ( d, j ) {
//										                    select.append( '<option value="'+d+'">'+d+'</option>' )
//										                } );
										            } );
											 },
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
											           {data : "name"}, 
											           {data : "url"},
											           {data : "httpMethod"},
											           {data : "parameter"},
											           null, 
											           null,
											           null,
											           null
											           ],
											"columnDefs" : [{
												'data' : function(row, type, val, meta ){
														return row.organ.organName;
														},'targets' : [ 0 ],
														visible:isSuper,
														searchable :true
													},
													{
														'data' : "regDate",
														'render' : function(data, type, row, meta) {
															return timeFormat(data);
														},
														'targets' : [ 7 ]
													},
													{
														'data' : "blockHttpResponseCode",
														'targets' : [ 5 ]
													},
													{
														'data' : "whetherToPassWhenBlocked",
														'render' : function(data, type, row, meta) {
															if(data==1){
																return "pass";
															}else{
																return "block"
															}
														},
														'targets' : [ 6 ]
													},
													{
														'render' : function(data, type, row, meta) {
															var result = "";
															result += "<div class='button-wrap'>";
															buttons = []
															if(isSuper||($('#hasTaskReadAccess').val() == 'true' && !($('#hasTaskWriteAccess').val() == 'true'))){
																buttons.push("<button class='btn btn-sm green btn-outline task-mod-button'>"+getMessage('common.details','상세')+"</button>");
															}else if ($('#hasTaskWriteAccess').val() == 'true') {
																buttons.push("<button class='btn btn-sm green btn-outline task-mod-button'>"+getMessage('common.edit','수정')+"</button>");
																buttons.push("<button class='btn btn-sm red btn-outline task-delete-button'>"+getMessage('common.remove','삭제')+"</button>");
															}
															result += buttons.join("&nbsp;&nbsp;");
															return result;
														},
														'targets' : [ 8 ]
													},
													],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 7, "desc" ] ],

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
			//업무 등록 클릭
			$('#new-task-button').click(function(e){
				e.preventDefault();

				$('#new-task-form #note').val('');
				$('#new-task-form #name').val('');
				$('#new-task-form #url').val('');
				$('#new-task-form #defaultMessage').val('');
				$('#new-task-form #parameter').val('');
				$('#new-task-form #isPass').prop('checked',false)

				$('#new-task-form #organ-id').val($('#AccountInfo').data("organid"));
				$('#new-task-form #isPass').bootstrapSwitch();
                $('#new-task-form #isPass').bootstrapSwitch('state',false);
                $('#new-task-form #isPass').val(0);
				$('#new-task-form #isPass').on('switchChange.bootstrapSwitch', function(event, state) {
					if(state){
						$(this).val('1');
					} else{
						$(this).val=('0');
					}
				});
                $('#new-whetherToPassWhenBlocked0').val(0);
                $('#new-whetherToPassWhenBlocked1').val(1);
                $('#new-whetherToPassWhenBlocked0').prop('checked',true);
                if($('input[name=whetherToPassWhenBlocked]:checked', '#new-task-form').val()==1){
                    $('#new-task-form  #blockHttpResponseCode').prop('readonly',true);
                }else{
                    $('#new-task-form  #blockHttpResponseCode').prop('readonly', false);
                }
                $('input[name=whetherToPassWhenBlocked]', '#new-task-form').change(function() {
                    var radioValue = $(this).val();
                    if (radioValue == "1") {
                        $('#new-task-form  #blockHttpResponseCode').prop('readonly', true);
                    } else {
                        $('#new-task-form   #blockHttpResponseCode').prop('readonly', false);
                    }

                });

                $('#new-task-modal').modal('show');

				
			});
            $('#new-task-modal').on('hidden.bs.modal', function(e){
                $('input[name=whetherToPassWhenBlocked]', '#new-task-form').off()
                //$('#new-task-form #isPass').off();
            });

			//업무등록 submit버튼 클릭 시
			$('#new-task-submit').click(function(e){
				e.preventDefault();
				$('#new-organ-id').val($('#AccountInfo').data('organid'));
				var taskEntity =$('#new-task-form').serializeJSON({checkboxUncheckedValue: "0"});
				$.ajax({
					type:'POST',
					url:'/api/task',
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(taskEntity),
					async : false,
					success : function(returnValue) {
						alert(getMessage('common.regSuccess','등록 성공'));
						location.reload();
					},
					error : function(e) {
						alert(e.responseJSON.message)
						console.log(e);
					}
			});
				
				
				
			});
			
			//상세(수정)버튼 클릭 시
			table.on('click', '.task-mod-button', function(e) {
				if($('#hasTaskReadAccess').val() == 'true' && !($('#hasTaskWriteAccess').val() == 'true')){
					$('#task-update-submit').attr("disabled", "disabled");
			    }
				e.preventDefault();
				// $('#task-option-form input').val("");
				$('#task-option-form #note').val("");
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				$('#task-name').text(data.name)
				$('#name').val(data.name);
				$('#task-option-form #organ-id').val(data.organ.id);
				$('#task-option-form #task-id').val(data.id);
				$('#related-policies').text(function(){
					if(data["policyTaskEntityList"].length!=0){
						result ="[";
							for(var i=0; i<data["policyTaskEntityList"].length;i++){
								result+=data["policyTaskEntityList"][i]['policyEntity'].policyName+', '
							}
							//마지막 공백 제거
							result=result.slice(0, -1);
							//마지막 콤마 제거
							result=result.slice(0, -1);
						result +="]";	
					}else{
						result=getMessag('common.none','없음');
					}
					
					return result
				})
				keys = Object.keys(data);
				//선택된 app object property를 순회하면서 값 설정
				var nStart = new Date().getTime();
				for(var i in keys){
//					id 로 dom존재여부 확인후 없으면 패스(성능측정결과 없는게 더 빨라서 없앰)
//					if($('#'+keys[i]).length==0){
//						continue;
//					}
					//console.log(keys[i] + " : "+data[keys[i]]);
					//DB필드값과 

					//
					if(keys[i]=="regUser"&&null!=(data[keys[i]])){
						$('#task-option-form #'+[keys[i]]+'-userName').val(data[keys[i]].userName+'('+data[keys[i]].userId+')');
					}else if(keys[i]=="modUser"&&null!=(data[keys[i]])){
						$('#task-option-form #'+[keys[i]]+'-userName').val(data[keys[i]].userName+'('+data[keys[i]].userId+')');
					}
					else if(keys[i]==("regDate")||keys[i]==("modDate")){
						$('#task-option-form #'+[keys[i]]).val(timeToLocaleString(data[keys[i]]));
					}else if(keys[i]=="isPass"){
						if(data[keys[i]]==0){
							$('#task-option-form #'+[keys[i]]).bootstrapSwitch('state', false);
							$('#task-option-form #'+[keys[i]]).val('0');
							if(isSuper){
								$('#task-option-form #'+[keys[i]]).bootstrapSwitch('disabled',true);;
							}
						}else{
							$('#task-option-form #'+[keys[i]]).bootstrapSwitch('state', true);
							$('#task-option-form #'+[keys[i]]).val('1');
							if(isSuper){
								$('#task-option-form #'+[keys[i]]).bootstrapSwitch('disabled',true);;
							}
						}
					}else if(keys[i]=='whetherToPassWhenBlocked'){
                        $('#task-option-form input[type="radio"][value="'+data[keys[i]]+'"]').prop("checked",true);
					}else{
						$('#task-option-form #'+[keys[i]]).val(data[keys[i]]);
					}
					$('.make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
						if(state){
							$(this).val('1');
						} else{
							$(this).val=('0');
						}
					});

				}
				//$('#app-option-id').val(data["id"]);
				
				/* Get the row as a parent of the link that was clicked on */
				// 패키지 정보 할당
				// TODO internationalization
                reverseParseOperator($('#task-option-form #defaultMessage'));
                if($('input[name=whetherToPassWhenBlocked]:checked', '#task-option-form ').val()==1){
                    $('#task-option-form  #blockHttpResponseCode').prop('readonly', true);
                }else{
                    $('#task-option-form  #blockHttpResponseCode').prop('readonly', false);
                }
                $('input[name=whetherToPassWhenBlocked]', '#task-option-form').change(function() {
                    var radioValue = $(this).val();
                    if (radioValue == "1") {
                        $('#task-option-form  #blockHttpResponseCode').prop('readonly', true);
                    } else {
                        $('#task-option-form   #blockHttpResponseCode').prop('readonly', false);
                    }

                });

				$('#task-detail-modal').modal('show');
				
				
				//task submit 클릭 이벤트
				$('#task-update-submit').click(function(e) {
					e.preventDefault();
					
					$.ajax({
							type:'POST',
							url:'/api/task/put',
							contentType : "application/json; charset=utf-8",
							data : JSON.stringify($('#task-option-form').serializeJSON({checkboxUncheckedValue: "0"})),
							async : false,
							success : function(returnValue) {
								alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
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
                    $('input[name=whetherToPassWhenBlocked]', '#task-option-form').off();
					$('#task-update-submit').off();
				});
				if(isSuper){
					$('#task-option-form input').attr('disabled','disabled');
					$('#task-option-form textarea').attr('disabled','disabled');
					$('#task-option-form select').attr('disabled','disabled');
				}
			});
			

			
			table.on('click', '.task-delete-button', function(e) {
				e.preventDefault();
				var policyList=[];
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				var relatedPolices="";
				if(data.policyTaskEntityList.length==0){
					relatedPolices=getMessage('task.policy.noRelatedPolicy', '연결된 정책이 없습니다.');
				}else{
					$(data.policyTaskEntityList).each(function(index, policyTask){
						var policyInfo = getMessage('common.policy.policyName','정책명')+' : '+ policyTask.policyEntity.policyName;
						if(policyTask.policyEntity.appVersionList.length>0){
							policyInfo += ' \n \t' +getMessage('task.app.relatedApp','관련 앱')+' : \n'
							$(policyTask.policyEntity.appVersionList).each(function(index2, appVersion){
								policyInfo += ' \t \t \t '+appVersion.appName+'('+appVersion.appVersion+')\n';
							});
						}else{
							policyInfo+='\n \t'+ getMessage('task.app.noRelatedAppWithPolicy','정책에 연결된 앱 없음')+'\n';
						}
						policyList.push(policyInfo);
					});
					relatedPolices=policyList.join('\n');
				}
				var confrimTextTail="";
				if($('#isUsingZooKeeper').val()=='true'){
					confrimTextTail="";
				}else{
					confrimTextTail="삭제 후 내용 반영을 위해서 동기화-배포, 적용이 필요합니다.";
				}
				if(confirm(getMessage('task.delete.deleteWarningMessage','본 업무가 사용된 정책을 변경하고 삭제하는 것을 추천합니다.\n삭제시 정책에 등록된 본 업무도 자동 삭제 됩니다. \n\n연결된 정책 목록')+' : \n-----------------------\n' +relatedPolices+'\n------------------------\n'+ confrimTextTail)){
					$.ajax({
						type:'POST',
						url:'/api/task/delete',
						contentType : "application/json; charset=utf-8",
						data : JSON.stringify({"id":data.id,"name":data.name}),
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
	InitFunction.init();
	$('[data-toggle="popover"]').popover();
});