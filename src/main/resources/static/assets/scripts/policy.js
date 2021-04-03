$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')

var table = $('#policy-table');
var table2 = $('#app-version-table');
var oTable;
var vTable;
var menuBooleanMap;
var isSuper = ($('#isSuper').val()=='true');


var initUsingMenu = function(){
	$.ajax({
		type:'GET',
		url:'/api/properties/menuBooleanMap',
		async : false,
		success : function(returnValue){
			menuBooleanMap = returnValue;
		},
		error:function(e){
			alert(e.responseJSON.message);
		}
	});
}

var InitFunction = function() {
	return {
		table : function() {
			var mainTable = function() {
				// table에 datatable적용
				$
						.ajax({
							type : 'GET',
							url : '/api/policy',
							success : function(returnValue) {
								
								
								var kindBool = true;
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
										                select.append('<option value="">'+getMessage('common.allOrgan','전체기관')+'</option>' );
										                $.ajax({
										                	type : 'GET',
										                	url : '/api/policy/organNames',
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
										                
//										                
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
											columns : [ null,
											            {data : "policyName"},
											           null, 
											           null,
											           null
											           ],
											"columnDefs" : [{
																'data' : function(row, type, val, meta ){
																return row.organEntity.organName;
																},'targets' : [ 0 ],
																visible:isSuper,
																searchable :true
															},
													{
														'data' : "regDate",
														'render' : function(data, type, row, meta) {
															return timeFormat(data);
														},
														'targets' : [ 3 ]
													},
													{
														'data' : "policyTaskList",
														'render' : function(data, type, row, meta) {
															var result;
															if(null!=data && null!=data.length&&data.length!=0){
																result ="";
																	for(var i=0; i<data.length;i++){
																		result+=data[i]['taskEntity'].name+', '
																	}
																	//마지막 공백 제거
																	result=result.slice(0, -1);
																	//마지막 콤마 제거
																	result=result.slice(0, -1);
																	
															} else {
																result="<i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i>";
															}
															result+=" ";
															return result;
														},
														'targets' : [ 2 ],
														'visible':menuBooleanMap.task
													},
													{
														'render' : function(data, type, row, meta) {
															result = "<dev class='button-wrap'>";
															buttons = []
															
															if(menuBooleanMap.task){
																if(isSuper){
																	buttons.push("<button class='btn btn-sm purple btn-outline task-modify-button'>"+getMessage('common.viewTasks','대상업무보기')+"</button>");
																}else{
																	if ($('#hasTaskReadAccess').val() == 'true' && $('#hasPolicyWriteAccess').val() == 'true') {
																		buttons.push("<button class='btn btn-sm purple btn-outline task-modify-button'>"+getMessage('common.viewTasks','대상업무설정')+"</button>");
																	}
																}
															}
															
															if(isSuper){
																buttons.push("<button class='btn btn-sm blue btn-outline app-list-button'>"+getMessage('common.applyedApp','적용 앱 보기')+"</button>");
																buttons.push("<button class='btn btn-sm green btn-outline policy-mod-button'>"+getMessage('common.details','상세')+"</button>");
															}else{
																if ($('#hasAppReadAccess').val() == 'true') {
																	buttons.push("<button class='btn btn-sm blue btn-outline app-list-button'>"+getMessage('common.applyedApp','적용 앱 보기')+"</button>");
																}
																if ($('#hasPolicyWriteAccess').val() == 'true') {
																	buttons.push("<button class='btn btn-sm green btn-outline policy-mod-button'>"+getMessage('common.edit','수정')+"</button>");
																	buttons.push("<button class='btn btn-sm red btn-outline policy-delete-button'>"+getMessage('common.remove','삭제')+"</button>");
																}
																if ($('#hasPolicyWriteAccess').val() != 'true'&&$('#hasPolicyReadAccess').val() == 'true') {
																	buttons.push("<button class='btn btn-sm green btn-outline policy-mod-button'>"+getMessage('common.details','상세')+"</button>");
																}
															}
															result += buttons.join("&nbsp;&nbsp;")
															return result;
														},
														'targets' : [ 4 ]
													}
													],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 3, "desc" ] ],
                                            "drawCallback": function( settings ) {
                                                $(document).ready(function(){
                                                    $('[data-toggle="popover"]').popover();
                                                });
                                            }

										});
							},
							error : function(e) {
								alert(e.responseJSON.message)
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
				// 앱 리스트 클릭 시
				table.on('click', '.app-list-button', function(e) {
					e.preventDefault();
					var nRow = $(this).parents('tr')[0];
					var data = oTable.row(nRow).data();
					$('#app-list-policy-name').text(data.policyName);
					setAppVersionTable(data);
					$('#policy-option-modal').modal();

					/* Get the row as a parent of the link that was clicked on */
					// 패키지 정보 할당
					// TODO internationalization
				});

				table.on('click', '.task-modify-button', function(e) {
					e.preventDefault();
					var nRow = $(this).parents('tr')[0];
					var data = oTable.row(nRow).data();
					var allTaskList;
					if(isSuper){
						$.ajax({
							type : 'GET',
							url : '/api/task/'+data.organEntity.id,
							async:false,
							success : function(returnValue) {
								allTaskList=returnValue;
							},
							error : function(e){
								alert(e.responseJSON.message);
							}
						});
					}else{
						$.ajax({
							type : 'GET',
							url : '/api/task',
							async:false,
							success : function(returnValue) {
								allTaskList=returnValue;
							},
							error : function(e){
								alert(e.responseJSON.message);
							}
						});
					}
					
					$('#task-body').html("");
					$.each(allTaskList, function(index, value){
						var row="";
						var isChecked  = false;											
						row+="<tr class='task-row'>";
							row+="<td>";
							row+="<input type='hidden' value="+value.id+" name='taskId' class='taskId'>";
							$.each(data.policyTaskList, function(index, data){
								if(data.taskEntity.id==value.id){
									isChecked=true;
								}
							});
							if(isChecked){
								row+="<input type='checkbox' name='bool' checked='checked' class='check-bool'>";
							}else{
								row+="<input type='checkbox' name='bool' class='check-bool'>";
							}
							row+="</td>";
							row+="<td>";
							row+=value.name;
							row+="</td>";
							row+="<td>";
							row+=value.url;
							row+="</td>";
							row+="<td>";
							row+=value.parameter;
							row+="</td>";
						row+="</tr>";
						
						
						$('#task-body').append(row);
					})
					
					
					
					
					$('#task-policy-name').text(data.policyName);
					$('#task-modal').modal();
					$('#task-list-update-button').click(function(e){
						e.preventDefault();
						var taskList = new Array;
						$('.task-row').each(function(index, value){
							if($(value).find('.check-bool').first().is(':checked')){
								taskList.push({"taskId":$(value).find('.taskId').val(), "policyId":data.id, "organId" : data.organEntity.id})
							}
						})
						
				
					$.ajax({
						type:'POST',
						url:'/api/policy/task/'+data.id+'/put',
						contentType : "application/json; charset=utf-8",
						data : JSON.stringify(taskList),
						async : false,
						success : function(returnValue) {
							alert(getMessage('policy.task.taskDeployed','업무내용이 성공적으로 반영되었습니다.'));		
							location.reload();
						},
						error : function(e) {
							alert(getMessage('common.regFail','등록 실패 : ')  + e.responseJSON.message);
						} 
					});
					});
					//모달 해제시 서밋 이벤트 바인딩도 해제
					$('#task-modal').on('hidden.bs.modal', function(e){
                        $('input[name=whetherToPassWhenBlocked]', '#new-policy-form').off();
						$('#task-list-update-button').off();
					});

					// 패키지 정보 할당
					// TODO internationalization
					if(isSuper){
						$('#task-body input').attr('disabled','disabled');
					}
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
            $('#abnormal-message-submit').click(function(e){
                e.preventDefault();
                var abnormalInfo = new Object();
                abnormalInfo.abnormalTokenMessage = $('#abnormalTokenMessage').val();
                abnormalInfo.abnormalTokenContentType = $('#abnormalTokenContentType').val();
                console.log(abnormalInfo);
                $.ajax({
                    type:'POST',
                    url:'/api/policy/abnormal',
                    contentType : "application/json; charset=utf-8",
                    data : JSON.stringify(abnormalInfo),
                    async : false,
                    success : function(returnValue) {
                        alert(getMessage("common.successMessage",'요청이 성공적으로 이루어 졌습니다.'));
                        location.reload();
                    },
                    error : function(e) {
                        alert(e.responseJSON.message)
                        console.log(e);
                    }
                });
            });
			//정책 등록 클릭
			$('#new-policy-button').click(function(e){
				e.preventDefault();
				// var allTaskList;
				// $.ajax({
				// 	type : 'GET',
				// 	url : '/api/task',
				// 	async:false,
				// 	success : function(returnValue) {
				// 		allTaskList=returnValue;
				// 	},
				// 	error : function(e){
				// 		alert(e.responseJSON.message)
				// 	}
				// });
				// $('#new-policy-task-body').html("");
				// $.each(allTaskList, function(index, value){
				// 	var row="";
				// 	row+="<tr class='new-task-row'>";
				// 		row+="<td>";
				// 		row+="<input type='hidden' value="+value.id+" name='taskId' class='taskId'>";
				// 		row+="<input type='checkbox' name='bool' class='check-bool'>";
				// 		row+="</td>";
				// 		row+="<td>";
				// 		row+=value.name;
				// 		row+="</td>";
				// 		row+="<td>";
				// 		row+=value.url;
				// 		row+="</td>";
				// 		row+="<td>";
				// 		row+=value.parameter;
				// 		row+="</td>";
				// 	row+="</tr>";
				//
				// 	$('#new-policy-task-body').append(row);
				// })
				
				$('#new-policy-form .make-switch').bootstrapSwitch();
				$('.make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
					if(state){
						$(this).val('1');
					} else{
						$(this).val=('0');
					}
				});
				
				
			    $('[data-toggle="popover"]').popover();

                if($('input[name=whetherToPassWhenBlocked]:checked', '#new-policy-form').val()==1){
                    $('#policy-option-form  #blockHttpResponseCode').prop('readonly', true);
                }else{
                    $('#policy-option-form  #blockHttpResponseCode').prop('readonly', false);
                }
                $('input[name=whetherToPassWhenBlocked]', '#new-policy-form').change(function() {
                    var radioValue = $(this).val();

                    if (radioValue == "1") {
                        $('#new-policy-form  #blockHttpResponseCode').prop('readonly', true);
                    } else {
                        $('#new-policy-form  #blockHttpResponseCode').prop('readonly', false);
                    }

                });
                //시간초과 토큰 수신시 값이 변경될 경우
				$('#new-policy-form #timeoverTokenWhenHealthy').on('switchChange.bootstrapSwitch', function(event, state) {
					if(state){
						$('#new-policy-form #timeoverTokenSecurityLevelHigh').bootstrapSwitch('readonly', true);
					}else{
						$('#new-policy-form #timeoverTokenSecurityLevelHigh').bootstrapSwitch('readonly', false);
					}
				});
				$('#new-policy-modal').modal('show');
				

			});
            $('#abnormal-message-button').click(function(e){
                e.preventDefault();
                $('#policy-abnormal-message-modal').modal('show');
            });
			//정책등록 submit버튼 클릭 시
			$('#new-policy-submit').click(function(e){
				e.preventDefault();
                if($('#extension-bool').val()=='true'){

                }else{
                    $('.new-filter-div .filter-message').each(function(i){
                        try {
                            message = $(this).attr("placeholder").split("> ")[1];
                            $(this).val(message);
                        }catch (e) {
                            // $(this)
                            $(this).text("default message");
                        }
                    });
                }
                
                //보안 정책
                var emptyField = "";
                
                $('#new-policy-form .policy-message').each(function(index){
                      if($(this).val() == "") {
						emptyField += ($(this).closest('.category-group').children('.policy-sub-title').text().trim() + "\n"); 
                    }
                })
				$('#new-policy-form .filter-message').each(function(index){
					if($(this).val()==""){
					    emptyField += ($(this).closest('.category-group').children('.policy-sub-title').text().trim() + "\n");    
                    }
				});
                
				if(emptyField != ""){
					var checkEmpty = confirm(getMessage("common.fieldsRequired","아래 메시지 항목은 입력되지 않았습니다. 기본값으로 진행하시겠습니까? \n") + emptyField);
                    if(checkEmpty){
                       $('#new-policy-form .policy-message').each(function(index){
                           var $this = $(this);
                           if($this.val() == ""){                            
                            $this.val($this.attr("placeholder"));
                           }
                        });
                        
                        $('#new-policy-form .filter-message').each(function(index){
                            var $this = $(this);
                            if($this.val()==""){
                            $this.val($this.attr("placeholder"));
                            }
                        });
                        
                    }else{
                       return false;
                    }
					
                }

                var taskList = new Array;
                var policyEntity;
                $('#new-organ-id').val($('#AccountInfo').data('organid'));
                policyEntity = $('#new-policy-form').serializeJSON({
                    checkboxUncheckedValue: "0"
                });
                $('.new-task-row').each(function (index, value) {
                    if ($(value).find('.check-bool').first().attr("checked") == "checked") {
						taskList.push({"taskId":$(value).find('.taskId').val(), "policyId":"", "organId" : $('#AccountInfo').data('organid')})
					}
				})
				policyEntity.taskList=taskList;
				$.ajax({
					type:'POST',
					url:'/api/policy',
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(policyEntity),
					async : false,
					success : function(returnValue) {
						alert(getMessage("common.successMessage",'요청이 성공적으로 이루어 졌습니다.'));
						location.reload();
					},
					error : function(e) {
							alert(e.responseJSON.message)
						console.log(e);
					}
			});
				
				
				
			});
			table.on('click', '.app-list-button', function(e) {
				e.preventDefault();
				$('#policy-app-list-modal').modal('show');
			});
			
			//상세(수정)버튼 클릭 시
			table.on('click', '.policy-mod-button', function(e) {
				e.preventDefault();
				if($('#hasPolicyWriteAccess').val() != 'true'&&$('#hasPolicyReadAccess').val() == 'true'){
					$('#policy-option-submit').attr('disabled','disabled');
				}
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				console.log(data)
				$('#policyName').val(data.policyName);
				$('#policy-name').val(data.policyName);
				$('#detail-organ-id').val(data.organEntity.id);
				$('#policy-id').val(data.id);
				$('#display-policy-id').text(data.id);
				$('#related-tasks').text(function(){
					if(data["policyTaskList"].length!=0){
						result ="[";
							for(var i=0; i<data["policyTaskList"].length;i++){
								result+=data["policyTaskList"][i]['taskEntity'].name+', '
							}
							//마지막 공백 제거
							result=result.slice(0, -1);
							//마지막 콤마 제거
							result=result.slice(0, -1);
						result +="]";	
					}else{
						result=getMessage('common.none','없음');
					}
					return result
				})
				keys = Object.keys(data);
				//선택된 app object property를 순회하면서 값 설정
				var nStart = new Date().getTime();
				for(var i in keys){
					// if(isSuper){
					// 	if(keys[i]==("normalTokenWhenUnhealthy")
					// 	||keys[i]==("normalTokenVerificationFailed")
					// 	||keys[i]==("emergencyTokenWhenHealthy")
					// 	||keys[i]==("timeoverTokenWhenHealthy")
					// 	||keys[i]==("normalTokenWhenUnhealthy")
					// 	||keys[i]==("terminatedToken")
					// 	){
					// 		$('#policy-option-form #'+[keys[i]]).bootstrapSwitch('readonly',false);;
					// 	}
					// }
					//DB필드값과
                    if(keys[i]=='whetherToPassWhenBlocked') {
                        $('#policy-option-form  #whetherToPassWhenBlockedGroup input[type="radio"][value="' + data[keys[i]] + '"]').prop("checked", true);
                    }else if(data[keys[i]]==0&&keys[i].search("Message")==-1&&keys[i].search("contentType")==-1&&keys[i]!='policyName'){
						$('#policy-option-form #'+[keys[i]]).bootstrapSwitch('state', false);
						$('#policy-option-form #'+[keys[i]]).val('0');
					}
					else if(data[keys[i]]==1&&keys[i].search("Message")==-1&&keys[i].search("contentType")==-1&&keys[i]!='policyName')
					{
						$('#policy-option-form #'+[keys[i]]).bootstrapSwitch('state', true);
						$('#policy-option-form #'+[keys[i]]).val('1');
						if(isSuper){
							//$('#policy-option-form #'+[keys[i]]).bootstrapSwitch('disabled',true);;
						}
					}else{
						if(keys[i]=='policyName'){
						}
						$('#policy-option-form #'+[keys[i]]).val(data[keys[i]]);
					}


//					if(keys[i]=="whenFailed"){
//						$('#policy-option-form #when-failed-'+data[keys[i]]).attr('checked', true);
//					}
					
					// if(isSuper){
					// 	if(keys[i]==("normalTokenWhenUnhealthy")
					// 	||keys[i]==("normalTokenVerificationFailed")
					// 	||keys[i]==("emergencyTokenWhenHealthy")
					// 	||keys[i]==("timeoverTokenWhenHealthy")
					// 	||keys[i]==("normalTokenWhenUnhealthy")
					// 	||keys[i]==("terminatedToken")
					//
					// 	){
					// 		$('#policy-option-form #'+[keys[i]]).bootstrapSwitch('readonly',true);;
					// 	}
					// }

				}
				
				
				$('.make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
						if(state){
							$(this).val('1');
						} else{
							$(this).val=('0');
						}
					});
				//$('#app-option-id').val(data["id"]);
				var modTimeoverDom = $('#policy-option-form #timeoverTokenWhenHealthy');
				var modTimeoverSecurityLevelDom = $('#policy-option-form #timeoverTokenSecurityLevelHigh')
				modTimeoverDom.on('switchChange.bootstrapSwitch', function(event, state) {
					if(state){
						modTimeoverSecurityLevelDom.bootstrapSwitch('readonly', true);
					}else{
						modTimeoverSecurityLevelDom.bootstrapSwitch('readonly', false);
					}
				});
				//값에 대한 이벤트 강제 트리거
				modTimeoverDom.trigger('switchChange.bootstrapSwitch',
					modTimeoverDom.bootstrapSwitch('state'));

			    $('[data-toggle="popover"]').popover();
				/* Get the row as a parent of the link that was clicked on */
				// 패키지 정보 할당
				// TODO internationalization
                reverseParseOperator($('.policy-message'));
                reverseParseOperator($('.filter-message'));
				$('#policy-detail-modal').modal('show');
                $('#policy-detail-modal').on('hidden.bs.modal', function(e){
                    $('#policy-option-submit').off();
                    $('input[name=whetherToPassWhenBlocked]:checked', '#policy-option-form ').off();

                });
                if($('#policy-option-form whetherToPassWhenBlocked1'))
				//policy submit 클릭 이벤트
				$('#policy-option-submit').click(function(e) {
					$('#policy-option-submit').off
					var emptyModFields="";
					$('#policy-option-form .policy-message').each(function(index){
						if($(this).val()==""){
							emptyModFields += ($(this).closest('.category-group').children('.policy-sub-title').text().trim() + "\n")
						}
					})
					$('#policy-option-form .filter-message').each(function(index){
						if($(this).val()==""){
							emptyModFields += ($(this).closest('.category-group').children('.policy-sub-title').text().trim() + "\n")
						}
					})
					if(!emptyModFields == ""){
						var checkEmpty = confirm(getMessage("common.fieldsRequired","아래 메시지 항목은 입력되지 않았습니다. 기본값으로 진행하시겠습니까? \n") + emptyModFields);
						if(checkEmpty){
							$('#policy-option-form .policy-message').each(function(index){
								var $this = $(this);
								if($this.val() == ""){
									$this.val($this.attr("placeholder"));
								}
							});

							$('#policy-option-form .filter-message').each(function(index){
								var $this = $(this);
								if($this.val()==""){
									$this.val($this.attr("placeholder"));
								}
							});

						}else{
							return false;
						}
						// alert(getMessage('common.fieldsRequired', '아래 메시지 항목은 필수 항목 입니다. \n')+ emptyModFields);
						// return false;

					}
					e.preventDefault();
					var policyEntity = $('#policy-option-form').serializeJSON({checkboxUncheckedValue: "0"});
					$.ajax({
							type:'POST',
							url:'/api/policy/put',
							contentType : "application/json; charset=utf-8",
							data : JSON.stringify(policyEntity),
							async : false,
							success : function(returnValue) {
								alert(getMessage('common.successMessage','요청이 성공적으로 이루어 졌습니다.'));
								location.reload();
							},
							error : function(e) {
									alert(e.responseJSON.message);
								console.log(e.responseJSON.message);
							}
					});
					/* Get the row as a parent of the link that was clicked on */
					// 패키지 정보 할당
					// TODO internationalization
					
				});
// 				if(isSuper){
// //					$('#policy-option-form input').attr('disabled','disabled');
// 					$('.filter-div textarea').attr('readonly',true);
// 					$('.filter-div select option').not(":selected").attr("disabled", "disabled");
// 				}

                if($('input[name=whetherToPassWhenBlocked]:checked', '#policy-option-form ').val()==1){
                	$('#policy-option-form  #blockHttpResponseCode').prop('readonly', true);
				}else{
                    $('#policy-option-form  #blockHttpResponseCode').prop('readonly', false);
				}
                $('input[name=whetherToPassWhenBlocked]', '#policy-option-form ').change(function() {
                	console.log($(this).val())

                    var radioValue = $(this).val();

                    if (radioValue == "1") {
                        $('#policy-option-form  #blockHttpResponseCode').prop('readonly', true);
                    } else {
                        $('#policy-option-form  #blockHttpResponseCode').prop('readonly', false);
                    }

                });
			});
			

			
			table.on('click', '.policy-delete-button', function(e) {
				e.preventDefault();
				var AppVersionList=[];
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				var relatedApps="";
				if(data.appVersionList.length==0){
					relatedApps=getMessage('policy.noRelatedApps','연결된 앱이 없습니다.');
				}else{
					$(data.appVersionList).each(function(index, value){
						AppVersionList.push(value.appName+'('+value.appVersion+')');
					});
					relatedApps=AppVersionList.join('\n');
				}
				var confirmTextTail = "";
				if($('#isUsingZooKeeper').val()=='true'){
					confirmTextTail="";
				}else{
					confirmTextTail=getMessage('common.syncRequiredAfterDelete');
				}
				if(confirm(getMessage('policy.deleteCautionMessage','해당 정책을 사용하는 모든 AppVersion의 정책이 사라집니다. \n그래도 진행하시겠습니까? \n본 정책이 사용된 AppVersion의 정책을 변경하고 삭제하는 것을 추천합니다.\n\n연결된 AppVersionList : ') + getMessage('common.lineSplitter','\n-----------------------\n') +relatedApps+ getMessage('common.lineSplitter','\n-----------------------\n')  + confirmTextTail )){
					$.ajax({
						type:'POST',
						url:'/api/policy/delete',
						contentType : "application/json; charset=utf-8",
						data : JSON.stringify({id:data.id}),
						async : false,
						success : function(returnValue) {
							alert(getMessage('common.deleteSuccessMessage','삭제요청이 이루어 졌습니다.'));
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

var abnormalMessageInit = function(){
	$.ajax({
		type:'GET',
		url:'/api/policy/abnormal',
		contentType : "application/json; charset=utf-8",
		async : false,
		success : function(returnValue) {
			console.log(returnValue);
			$('#abnormalTokenMessage').val(returnValue.abnormalTokenMessage);
			$('#abnormalTokenContentType').val(returnValue.abnormalTokenContentType);
		},
		error : function(e) {
			alert(e.responseJSON.message)
			console.log(e);
		}
	});
}

var setAppVersionTable = function(policyData) {
	var data = policyData.appVersionList;
	vTable = table2
			.DataTable(
					{	
						destroy : true,	
						"dom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
						"pageLength" : 10,
						data : data,
						columns : [ 
							{data : "id", "visible" : false},
							null,
							{data : "appVersion"},
							{data : "deviceType"}
						 ],
						"columnDefs" : [
							{
								'data' : 'appName',
								'targets' : [1]
							}
						]

					});

	


}
$(document).ready(function() {
	//Metronic.init();
    abnormalMessageInit();
	initUsingMenu();
	InitFunction.init();
});