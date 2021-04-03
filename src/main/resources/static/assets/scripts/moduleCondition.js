$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
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
var isSuper = ($('#isSuper').val() == 'true');
var isMaster = ($('#isMaster').val() == 'true');
var appMap = new Object();
var appVersionMap = new Object();
var moduleVersionMap = new Object();
var initConditionList = function() {
	oTable = $('#api-server-table').DataTable();
	$
			.ajax(
					{
						type : "GET",
						url : "/api/super/module/condition",
						async : false,
						success : function(returnValue) {
							oTable.destroy();

							var selected = [];
							oTable = $('#module-condition-table')
									.DataTable(
											{
												dom : 'Blfrtp',
												buttons : [],
												data : returnValue,
												columns : [ {
													data : "priority"
												}, {
													data : "id"
												}, {
													data : "appId"
												}, {
													data : "appVersionId"
												}, {
													data : "deviceModel"
												}, {
													data : "osVersion"
												},{
													data : "eversafeLibraryVersion"
												}, {
													data : "moduleVersion"
												}, {
													data : "regDate"
												}, {
													data : "modDate"
												}, {
													data : null
												}, ],
												"columnDefs" : [
														{
															'render' : function(
																	data, type,
																	row, meta) {
																return timeFormat(data);
															},
															targets : [
																	"tbl-regDate",
																	"tbl-modDate" ]
														},
														{
															'render' : function(
																	data, type,
																	row, meta) {
																content = "";
																
																content += '<button class="condition-mod-button btn btn-sm blue btn-outline">'+getMessage('common.edit','수정')+'</button>';
																if(row.id==1){
																	
																}else{
																	content += '<button class="condition-delete-button btn btn-sm red btn-outline">'+getMessage('common.remove','삭제')+'</button>';
																}
																return content;
															},
															targets : [ "tbl-etc" ],
														},
														{
															'render' : function(
																	data, type,
																	row, meta) {
																if (row.isAppIdAsterisk) {
																	return "*";
																} else {
																	if(appMap[data]!=undefined){
																		return appMap[data] +"("+ data+")";
																	}else{
																		return "<span class='red-color'> deleted"+"("+data+")"+"</span>";
																	}
																}
															},
															targets : [ "tbl-app" ],

														},
														{
															'render' : function(
																	data, type,
																	row, meta) {
																if (row.isAppVersionAsterisk) {
																	return "*";
																} else {
																	if(appVersionMap[data]!=undefined){
																		return appVersionMap[data];
																	}else{
																		return "<span class='red-color'> deleted"+"("+data+")"+"</span>";
																	}
																}
															},
															targets : [ "tbl-appVersion" ],

														},
														{
															'render' : function(
																	data, type,
																	row, meta) {
																if (row.isDeviceModelAsterisk) {
																	return "*";
																} else {
																	return data;
																}
															},
															targets : [ "tbl-deviceModel" ],

														},
														{
															'render' : function(
																	data, type,
																	row, meta) {
																if (row.isOsVersionAsterisk) {
																	return "*";
																} else {
																	return data;
																}
															},
															targets : [ "tbl-osVersion" ],

														},{
															'render' : function(
																	data, type,
																	row, meta) {
																if (row.isEversafeLibraryVersionAsterisk) {
																	return "*";
																} else {
																	return data;
																}
															},
															targets : [ "tbl-eversafeLibraryVersion" ],

														},{
															'render' : function(
																	data, type,
																	row, meta) {
																if (moduleVersionMap[data]) {
																	return data;
																} else {
																	return "<span class='red-color'>deleted("+data+")</span>";
																}
															},
															targets : [ "tbl-moduleVersion" ],

														}

												],
												"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal

												"order" : [ [ 0, "desc" ] ],
											});
						},
						error : function(e) {
							console.log(e);
						}
					}).done();
}
var modalInit = function() {
	$('#new-module-condition-button')
			.click(
					function(e) {
						e.preventDefault();

						$
								.ajax({
									type : "GET",
									url : "/api/app/list",
									async : false,
									success : function(returnValue) {
										var $appIdDom = $('#new-condition-form #appId');
										$appIdDom.html('');
										$appIdDom.unbind('change');
										$appIdDom
												.append("<option value=-1 selected>*</option>");
										$('#new-condition-form #appVersionId')
												.append(
														"<option value=-1 selected>*</option>");
										for ( var key in returnValue) {
											$appIdDom
													.append("<option value="
															+ returnValue[key].id
															+ " >"
															+ returnValue[key].organName
															+ ' : '
															+ returnValue[key].appName
															+ "</option>");
										}
										$appIdDom
												.change(function() {
													$
															.ajax({
																type : "GET",
																url : "/api/app/"
																		+ $appIdDom
																				.val()
																		+ "/versionList",
																async : false,
																success : function(
																		appVersionList) {
																	console
																			.log(appVersionList)
																	var $appVersionDom = $('#new-condition-form #appVersionId');
																	$appVersionDom
																			.html('');
																	$appVersionDom
																			.append("<option value=-1>*</option>");
																	$appVersionDom
																			.unbind('change');
																	console
																			.log(appVersionList)
																	if (appVersionList.length == 0) {
																		$appVersionDom
																				.append(getMessage('common.noAppVersions','앱 버전 없음'));
																	} else {
																		for ( var key in appVersionList) {
																			$appVersionDom
																					.append("<option value="
																							+ appVersionList[key].id
																							+ " >"
																							+ appVersionList[key].appVersion
																							+ "</option>");
																		}
																	}
																},
																error : function(
																		e) {
																	console
																			.log(e);
																}
															});
												});
									},
									error : function(e) {
										console.log(e);
									}
								});
						$
								.ajax({
									type : "GET",
									url : "/api/super/module/version",
									async : false,
									success : function(returnValue) {
										var $moduleVersionIdDom = $('#new-condition-form #moduleVersion');
										$moduleVersionIdDom.html('');
										$moduleVersionIdDom.unbind('change');
										for ( var key in returnValue) {
											$moduleVersionIdDom
													.append("<option value="
															+ returnValue[key].version
															+ " >"
															+ returnValue[key].version
															+ "</option>");
										}
									},
									error : function(e) {
										console.log(e);
									}
								});

						$('#new-module-condition-modal').modal('show');

					});
	// 조건등록 submit버튼 클릭 시
	$('#new-module-condition-submit').click(function(e) {
		e.preventDefault();
		if($("#new-condition-form #deviceModel").val().length==0){
			alert(getMessage("moduleCondition.deviceModelIsRequiredMessage","deviceModel은 필수 입력 사항입니다. 전체 적용시 * 입력"));
			return false;
		}
		if($("#new-condition-form #osVersion").val().length==0){
			alert(getMessage('moduleCondition.osVersionIsRequiredMessage',"os version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
			return false;
		}
		if($("#new-condition-form #eversafeLibraryVersion").val().length==0){
			alert(getMessage('moduleCondition.libVersionIsRequiredMessage',"library version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
			return false;
		}
		if($("#new-condition-form #priority").val().length==0){
			alert(getMessage('moduleCondition.priorityIsRequiredMessage',"우선순위는 필수 입력 사항입니다."));
			return false;
		}
		var conditionEntity = $('#new-condition-form').serializeJSON({
			checkboxUncheckedValue : "0"
		});
		// return false;
		$.ajax({
			type : "POST",
			url : "/api/super/module/condition",
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(conditionEntity),
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
	// 조건수정 submit버튼 클릭 시
	$('#mod-module-condition-submit').click(function(e) {
		e.preventDefault();

		if($("#mod-condition-form #deviceModel").val().length==0){
			alert(getMessage("moduleCondition.deviceModelIsRequiredMessage","deviceModel은 필수 입력 사항입니다. 전체 적용시 * 입력"));
			return false;
		}
		if($("#mod-condition-form #osVersion").val().length==0){
			alert(getMessage('moduleCondition.osVersionIsRequiredMessage',"os version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
			return false;
		}
		if($("#mod-condition-form #eversafeLibraryVersion").val().length==0){
			alert(getMessage('moduleCondition.libVersionIsRequiredMessage',"library version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
			return false;
		}
		if($("#mod-condition-form #priority").val().length==0){
			alert(getMessage('moduleCondition.priorityIsRequiredMessage',"우선순위는 필수 입력 사항입니다."));
			return false;
		}
		if($("#mod-condition-form #moduleVersion").val()==null){
			alert(getMessage("moduleCondition.moduleVersionIsRequiredMessage","모듈 버전은 필수 입력 사항입니다."));
			return false;
		}
		var conditionEntity = $('#mod-condition-form').serializeJSON({
			checkboxUncheckedValue : "0"
		});
		// return false;
		$.ajax({
			type : "POST",
			url : "/api/super/module/condition/put",
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(conditionEntity),
			async : false,
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
	// $('#ip-mod-submit').click(function(e){
	// e.preventDefault();
	// var ipEntity =$('#ip-mod-form').serializeJSON({checkboxUncheckedValue:
	// "0"});
	// $.ajax({
	// type : "POST",
	// url : "/api/super/emergency/ip/put",
	// data : JSON.stringify(ipEntity),
	// async : false,
	// contentType : "application/json; charset=utf-8",
	// success : function(returnValue) {
	// alert('api ip 정보가 수정되었습니다.');
	// location.reload();
	// },
	// error : function(e) {
	// console.log(e);
	// alert("error : " + e.responseJSON.message);
	// }
	// });
	// });
	//		
	//	
	oTable.on('click', '.condition-delete-button', function(e) {
		e.preventDefault();
		var nRow = $(this).parents('tr')[0];
		var data = oTable.row(nRow).data();

		if (confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))) {
			$.ajax({
				type : "POST",
				url : "/api/super/module/condition/delete",
				data : JSON.stringify({
					"id" : data.id
				}),
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

		} else {
			return false;
		}
	});

	oTable
			.on(
					'click',
					'.condition-mod-button',
					function(e) {
						e.preventDefault();
						
						var nRow = $(this).parents('tr')[0];
						var data = oTable.row(nRow).data();

						$
								.ajax({
									type : "GET",
									url : "/api/app/list",
									async : false,
									success : function(returnValue) {
										var $appIdDom = $('#mod-condition-form #appId');
										$appIdDom.html('');
										$appIdDom.unbind('change');
										$appIdDom
												.append("<option value=-1 selected>*</option>");
										$('#mod-condition-form #appVersionId')
												.append(
														"<option value=-1>*</option>");
										for ( var key in returnValue) {
											$appIdDom
													.append("<option value="
															+ returnValue[key].id
															+ " >"
															+ returnValue[key].organName
															+ ' : '
															+ returnValue[key].appName
															+ "</option>");
										}
										$appIdDom
												.change(function() {
													$
															.ajax({
																type : "GET",
																url : "/api/app/"
																		+ $appIdDom
																				.val()
																		+ "/versionList",
																async : false,
																success : function(
																		appVersionList) {
																	console
																			.log(appVersionList)
																	var $appVersionDom = $('#mod-condition-form #appVersionId');
																	$appVersionDom
																			.html('');
																	$appVersionDom
																			.append("<option value=-1>*</option>");
																	$appVersionDom
																			.unbind('change');
																	console
																			.log(appVersionList)
																	if (appVersionList.length == 0) {
																		$appVersionDom
																				.append(getMessage('common.noAppVersions','앱 버전 없음'));
																	} else {
																		for ( var key in appVersionList) {
																			$appVersionDom
																					.append("<option value="
																							+ appVersionList[key].id
																							+ " >"
																							+ appVersionList[key].appVersion
																							+ "</option>");
																		}
																	}
																},
																error : function(
																		e) {
																	console
																			.log(e);
																}
															});
												});
									},
									error : function(e) {
										console.log(e);
									}
								});
						$
								.ajax({
									type : "GET",
									url : "/api/super/module/version",
									async : false,
									success : function(returnValue) {
										var $moduleVersionIdDom = $('#mod-condition-form #moduleVersion');
										$moduleVersionIdDom.html('');
										$moduleVersionIdDom.unbind('change');
										for ( var key in returnValue) {
											$moduleVersionIdDom
													.append("<option value="
															+ returnValue[key].version
															+ " >"
															+ returnValue[key].version
															+ "</option>");
										}
									},
									error : function(e) {
										console.log(e);
									}
								});

						$('#mod-condition-form #id').val(data.id);

						if ($('#mod-condition-form #appId').val(data.appId) == null) {
							alert(getMessage("moduleCondition.deletedAppMessage","삭제된 app이 조건으로 배정되어있습니다. 조건과 현재 상태를 확인하세요 \n 조건의 appId : ")
									+ data.appId);
						}
						;
						$
								.ajax({
									type : "GET",
									url : "/api/app/" + data.appId
											+ "/versionList",
									async : false,
									success : function(appVersionList) {
										var $appVersionDom = $('#mod-condition-form #appVersionId');
										$appVersionDom.html('');
										$appVersionDom
												.append("<option value=-1>*</option>");
										$appVersionDom.unbind('change');
										if (appVersionList.length == 0) {
											$appVersionDom.append(getMessage('common.noAppVersions','앱 버전 없음'));
										} else {
											for ( var key in appVersionList) {
												$appVersionDom
														.append("<option value="
																+ appVersionList[key].id
																+ " >"
																+ appVersionList[key].appVersion
																+ "</option>");
											}
										}
									},
									error : function(e) {
										console.log(e);
									}
								});
						if ($('#mod-condition-form #appVersionId').val(
								data.appVersionId) == null) {
							alert(getMessage("moduleCondition.deletedAppMessage","삭제된 app이 조건으로 배정되어있습니다. 조건과 현재 상태를 확인하세요 \n 조건의 appId : ")
									+ data.appVersionId);
						}
						;
						$('#mod-condition-form #deviceModel').val(
								data.deviceModel);
						$('#mod-condition-form #osVersion').val(
								data.osVersion);
						$('#mod-condition-form #eversafeLibraryVersion').val(
								data.eversafeLibraryVersion);
						$('#mod-condition-form #priority').val(
								data.priority);
						$('#mod-condition-form #moduleVersion').val(
								data.moduleVersion);
						if($('#mod-condition-form #id').val()==1){
							$("#mod-condition-form #appId").attr('readonly', true);
							$("#mod-condition-form #appVersionId").attr('readonly', true);
							$("#mod-condition-form #deviceModel").attr('readonly', true);
							$("#mod-condition-form #osVersion").attr('readonly', true);
							$("#mod-condition-form #eversafeLibraryVersion").attr('readonly', true);
							$("#mod-condition-form #deviceModel").attr('readonly', true);
							$("#mod-condition-form #priority").attr('readonly', true);
						}else{
							$("#mod-condition-form #appId").attr('readonly', false);
							$("#mod-condition-form #appVersionId").attr('readonly', false);
							$("#mod-condition-form #deviceModel").attr('readonly', false);
							$("#mod-condition-form #osVersion").attr('readonly',false);
							$("#mod-condition-form #eversafeLibraryVersion").attr('readonly', false);
							$("#mod-condition-form #deviceModel").attr('readonly', false);
							$("#mod-condition-form #priority").attr('readonly', false);
						}
						$('#mod-module-condition-modal').modal('show');
					});

}
var initAppMap = function() {
	$.ajax({
		type : "GET",
		url : "/api/app/list",
		async : false,
		success : function(returnValue) {
			for ( var key in returnValue) {
				appMap[returnValue[key].id] = returnValue[key].appName;
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}
var initAppVersionMap = function() {
	$
			.ajax({
				type : "GET",
				url : "/api/app-version",
				async : false,
				success : function(appVersionList) {
					for ( var key in appVersionList) {
						appVersionMap[appVersionList[key].id] = appVersionList[key].appVersion;
					}
				},
				error : function(e) {
					console.log(e);
				}
			});
}
var initModuleVersionMap = function() {
	$
			.ajax({
				type : "GET",
				url : "/api/super/module/version",
				async : false,
				success : function(moduleVersionList) {
					for ( var key in moduleVersionList) {
						moduleVersionMap[moduleVersionList[key].version] = moduleVersionList[key].enabled;
					}
				},
				error : function(e) {
					console.log(e);
				}
			});
}

jQuery(document).ready(function() {
	initModuleVersionMap();
	initAppMap();
	initAppVersionMap();
	initConditionList();
	modalInit();
});