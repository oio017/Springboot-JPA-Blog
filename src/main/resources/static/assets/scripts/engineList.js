$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv')
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

var table = $('#engineTable');
var oTable;

var InitFunction = function() {
	return {
		table : function() {
			var mainTable = function() {
				// table에 datatable적용
				$
						.ajax({
							type : 'GET',
							url : '/api/wrapping/engine',
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
												data : "version"
											}, {
												data : "status"
											}, null, {
												data : "etc"
											} ],
											"columnDefs" : [
													{
														render : function(data,
																type, row, meta) {
															return timeFormat(data);
														},
														targets : [ 'tbl-regDate' ]

													},
													{
														render : function(data, type, row, meta) {
															var returnValue = "";
															if (data == 0) {
																returnValue = "X";
															} else if (data == 1) {
																returnValue = "V";
															}
															return returnValue;
														},
														targets : [ 'tbl-status' ]

													},
													{
														render : function(data,	type, row, meta) {
															var result = "";
															if(row.status==-1){
																result = getMessage('obfuscation.engine.noJarFileMessage','root에 jar파일이 없습니다.');
															}else if(row.status==-2){
																result = getMessage('obfuscation.engine.twoOrMoreJarMessage','jar파일이 2개 이상입니다.');
															}else if(row.status==-10){
																result = getMessage('obfuscation.engine.noManualFileMessage','manual 파일이 없습니다.');
															}else if(row.status==-20){
																result = getMessage('obfuscation.engine.twoOrMoreManualFileMessage','manual 파일이 2개 이상 입니다.');
															}else if(row.status==-100){
																result = getMessage('obfuscation.engine.noSettingFileMessage','setting 파일이 없습니다.');
															}else if(row.status == -1000){
																result = getMessage('obfuscation.engine.noMappingFileMessage','mapping 파일이 업습니다.');
															}else if(row.status<0){
																result = getMessage('obfuscation.engine.fileError','업로드된 파일에 문제가 있습니다. code : ') + row.status;
															}else{
																result = '<button class="btn btn-sm blue btn-outline engineApplyButton">'+getMessage('common.apply','적용')+'</button> &nbsp&nbsp&nbsp';
																result += '<button class="btn btn-sm red btn-outline engineDeleteButton">'+getMessage('common.delete','삭제')+'</button>'
															}
																return result;
														},
														targets : [ 'tbl-action' ]

													},
													{
														render : function(data, type, row, meta) {
															return data
														},
														targets : [ 'tbl-etc' ]

													} ],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
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
									var url = "/api/download/engine/" + data.id
											+ "/" + $(this).data('kind');
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
														alert(getMessage('common.noFile','파일이 없습니다.'));
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
	$('.engineApplyButton').click(function(e) {
		e.preventDefault();
		var nRow = $(this).parents('tr')[0];
		var data = oTable.row(nRow).data();
		$.ajax({
			type : 'POST',
			url : '/api/wrapping/engine/apply/' + data.id,
			contentType : "application/json; charset=utf-8",
			async : false,
			success : function(returnValue) {
				alert(getMessage('common.applyComplete','적용이 완료되었습니다.'));
				location.reload();
			},
			error : function(e) {
				alert(e.responseJSON.message);
			}

		});
	});
	$('.engineDeleteButton').click(function(e) {
		e.preventDefault();
		var nRow = $(this).parents('tr')[0];
		var data = oTable.row(nRow).data();
		$.ajax({
			type : 'POST',
			url : '/api/wrapping/engine/delete/' + data.id,
			contentType : "application/json; charset=utf-8",
			async : false,
			success : function(returnValue) {
				alert(getMessage('common.removeComplete','삭제 '));
				location.reload();
			},
			error : function(e) {
				console.log(e);
				alert(e.responseJSON.message);
			}
			
		});
	});
}

$(document).ready(function() {
	InitFunction.init();
	initClickEvent();
});
