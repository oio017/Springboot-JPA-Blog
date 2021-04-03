$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')


var table = $('#wrappingTable');
var oTable;
var isSuper = $('#AccountInfo').data('organid')==0;

var InitFunction = function() {
	return {
		table : function() {
			var mainTable = function() {
				// table에 datatable적용
				$
						.ajax({
							type : 'GET',
							url : '/api/wrapping',
							async : false,
							success : function(returnValue) {
								oTable = table
										.DataTable({
											dom : 'Blfrtp',
											buttons : [],
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
											columns : [ {
												data : "regDate"
											}, {
												data : "user"
											}, {
												data : "status"
											}, {
												data : "apkFileName"
											}, {
												data : "settingFileName"
											}, {
												data : "mapsFileName"
											}, null, {
												data : "engineVersion"
											}, null, null, {
												data : "action"
											}, null, ],
											"columnDefs" : [
													{
														render : function(data,
																type, row, meta) {
															return timeFormat(data);
														},
														targets : [ 'tbl-regDate' ]

													},
													{
														render : function(data,
																type, row, meta) {
															return data;
														},
														targets : [ 'tbl-regUserId' ]

													},
													{
														render : function(data,
																type, row, meta) {
															var returnValue = "";
															if (data == 0) {
																returnValue = getMessage('obfuscation.status.waiting','대기중');
															} else if (data == -2) {
																returnValue = getMessage('obfuscation.status.userCancled','사용자 취소');
															} else if (data == -100) {
																returnValue = getMessage('obfuscation.status.inProgress','<div class="blue-color">처리중</div>');
															} else if (data == 1) {
																returnValue = getMessage('obfuscation.status.complete', '완료');
															} else if (data == -1000) {
																returnValue = getMessage('obfuscation.status.engineUnregisterd', '<div class="red-color">엔진 미등록</div>');;
															} else {
																returnValue = getMessage('obfuscation.status.error', '에러');
															}
															return returnValue;
														},
														targets : [ 'tbl-status' ]

													},
													{
														render : function(data,
																type, row, meta) {
																return "<a data-kind='originApp' class='app-origin-down down-link' href='#'>"
																		+ data
																		+ "</a>"
															},
														targets : [ 'tbl-app-origin' ]

													},
													{
														render : function(data,
																type, row, meta) {
															return "<a data-kind='setting' class='setting-down down-link' href='#'>"
																	+ data
																	+ "</a>"
														},
														targets : [ 'tbl-setting' ]

													},
													{
														render : function(data,
																type, row, meta) {
															if (data == null) {
																return getMessage('common.none','없음');
															} else {
																return "<a data-kind='mapping' class='mapping-down down-link' href='#'>"
																		+ data
																		+ "</a>"
															}
														},
														targets : [ 'tbl-mapping' ]

													},
													{
														render : function(data,
																type, row, meta) {
															var value = "";
															if (isExist(row.status)) {
																value = "";
															} else {
																value = "<a data-kind='log' class='log-down down-link' href='#'>"
																		+ "<button class='btn btn-sm green btn-outline'>"+getMessage('common.down','다운')+"</button>"
																		+ "</a>";
															}
															return value;
														},
														targets : [ 'tbl-log' ]

													},
													{
														render : function(data,
																type, row, meta) {
															var value = "";
															if (isExist(row.status)) {
																value = "";
															} else {
																value = "<a data-kind='specificLog' class='specific-log-down down-link' href='#'>"
																		+ "<button class='btn btn-sm green btn-outline'>"+getMessage('common.down','다운')+"</button>"
																		+ "</a>";
															}
															return value;
														},
														visible : isSuper,
														targets : [ 'tbl-specific-log' ]

													},
													{
														render : function(data,
																type, row, meta) {
															
															var value = "";
															if (row.status != 1) {
																value = getMessage('common.none','없음');
															} else {
																value = "<a data-kind='obfuscatedApp' class='obfuscated-down down-link' href='#'>obfuscated_"
																		+ row.apkFileName
																		+ "</a>";
															}
															return value;
														},
														targets : [ 'tbl-app-obfuscated' ]

													},
													{
														render : function(data,
																type, row, meta) {
															if (row.status == 0) {
																return '<button class="btn btn-sm red btn-outline cancelWrappingButton">'+getMessage('common.cancel','취소')+'</button>'
															} else {
																return "";
															}
														},
														targets : [ 'tbl-action' ]

													},
													{
														render : function(data,
																type, row, meta) {
																var fifteenDays = 1296000000;
																return dateFormat(row.regDate
																		+ fifteenDays)
																		+ ' '+getMessage('obfuscation.remarks.willBeRemoved','삭제 예정');
														},
														targets : [ 'tbl-etc' ]

													} ],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 0, "desc" ] ],

										});
							},
							error : function(e) {
								alert(e.responseJSON.message);
								console.log(e.responseJSON.message)
							}

						});

			}

			var initEvents = function() {
				$('.down-link')
						.click(
								function(e) {
									e.preventDefault();
									var nRow = $(this).parents('tr')[0];
									var data = oTable.row(nRow).data();
									var $this = $(this);
									var url = "/api/download/wrapping/"
											+ data.id + "/"
											+ $(this).data('kind');
									$
											.ajax({
												type : 'GET',
												url : url,
												success : function() {
													window.location = url;
												},
												error : function(e) {
													console
															.log(e.responseJSON.exception
																	.includes('FileNotFoundException'));
													if (e.responseJSON.exception
															.includes('FileNotFoundException')) {
														alert(getMessage('obfuscation.exception.fileNotFound','파일이 없습니다.'));
													} else {
														alert('download error')
													}

												}
											});
								});
			}
			return {
				// main function to initiate the module
				init : function() {
					mainTable();
					initEvents();
				}
			};
		},
		init : function() {
			// this.initCreateTable()
			this.table().init();
		}
	};
}();

var initClickEvent = function() {
	$('.cancelWrappingButton').click(function(e) {
		e.preventDefault();
		var nRow = $(this).parents('tr')[0];
		var data = oTable.row(nRow).data();
		$.ajax({
			type : 'POST',
			url : '/api/wrapping/cancel/' + data.id,
			contentType : "application/json; charset=utf-8",
			async : false,
			success : function(returnValue) {
				alert(getMessage('obfuscation.request.cancel', '취소요청이 이루어졌습니다.'));
				location.reload();
			},
			error : function(e) {
				alert(e.responseJSON.message);
			}

		});
	});
}

var initEngineVersion = function(){
	$.ajax({
		type : 'GET',
		url : '/api/wrapping/engine/version',
		contentType : "application/json; charset=utf-8",
		async : false,
		success : function(returnValue) {
			$('#wrappingEngineVersion').text(returnValue);                              
		},
		error : function(e) {
			alert(e.responseJSON.message);
		}

	});
}

var isExist = function(status){
	if(status == 0
			|| status == -100
			|| status == -1000
			|| status == -2){
		return true;
	}else{
		return false;
	}
} 

$(document).ready(function() {
	InitFunction.init();
	initClickEvent();
	initEngineVersion();
});
