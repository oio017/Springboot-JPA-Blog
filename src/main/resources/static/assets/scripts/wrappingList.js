$scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>');
;

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
							url : '/api/getWrappingUploadList/',
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
											columns : [ null,null,null,null,null,null,null, null,null,null,null],
											"columnDefs" : [
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return row.fileName;
                                                    },
                                                    'targets': ['tbl-fileName'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return row.count;
                                                    },
                                                    'targets': ['tbl-moduleCount'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return row.version;
                                                    },
                                                    'render' : function(data, type, row, meta){
                                                        return (data==null||data==undefined)?'-':data;
                                                    },
                                                    'targets': ['tbl-version'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return row.basicVersion;
                                                    },
                                                    'targets': ['tbl-basicVersion'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return row.deviceType;
                                                    },
                                                    'targets': ['tbl-deviceType'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        var result = '';
                                                        var status = row.status;
                                                        result = getFileResultMessageByCode(status);
                                                        return result;
                                                    },
                                                    'render': function (data, type, row, meta) {
                                                        if(row.status!=0&&row.status!=1){
                                                            result ='<span class="red-color">' + data + '</span>'
                                                        }else{
                                                            result = data;
                                                        }
                                                        return result;
                                                    },
                                                    'targets': ['tbl-result'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                    	var data = new Object();
                                                    	data.id = row.id
														if(row.filePath==null||row.filePath==undefined){
                                                            data = null;
														}else{
                                                    		data.fileName = row.filePath.replace(/^.*[\\\/]/, '');
														}
                                                        return data;
                                                    },
                                                    'render': function (data, type, row, meta) {
                                                    	if(data==null){
                                                            return "N/A";
														}else{
                                                    		return '<a href="/api/download/wrapping/origin/'+data.id+'" download="'+data.fileName+'">Downloads</a>';
														}
                                                    },
                                                    'targets': ['tbl-originAppDownload'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        var data = new Object();
                                                        data.id = row.id
                                                        if(row.resultFilePath==null||row.resultFilePath==undefined){
                                                        	data = null;
                                                        }else{
                                                        	data.fileName = row.resultFilePath.replace(/^.*[\\\/]/, '');
														}
                                                        return data;
                                                    },
                                                    'render': function (data, type, row, meta) {
                                                        if(data==null){
                                                            return "N/A";
                                                        }else {
                                                            return '<a href="/api/download/wrapping/wrapped/' + data.id + '" download="' + data.fileName + '">Downloads</a>';
                                                        }
                                                    },
                                                    'targets': ['tbl-wrappedAppDownload'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return timeFormat(row.regDate);
                                                    },
                                                    'targets': ['tbl-requestDate'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return timeFormat(row.doneDate);
                                                    },
                                                    'targets': ['tbl-doneDate'],
                                                },
                                                {
                                                    'data': function (row, type, val, meta) {
                                                        return null;
                                                    },
													'render': function (data, type, row, meta) {
                                                        var result = '';
                                                        var buttons = [];
                                                        buttons.push("<button class='btn btn-sm blue btn-outline wrapping-detail-button'>" + getMessage('common.details', '상세') + "</button>");
                                                        buttons.push("<button class='btn btn-sm red btn-outline wrapping-delete-button'>" + getMessage('common.remove', '삭제') + "</button>");
                                                        result += buttons.join("&nbsp;&nbsp;");
                                                        return result;
                                                    },
                                                    'targets': ['tbl-etc'],
                                                }],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 8, "desc" ] ],

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

                table.on('click','.wrapping-detail-button', function(e){
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
					// for(var i in data){
					// 	$("#detail-"+i).text(data[i]);
					// }
                    var result = '';
                    var status = data.status;
                    result = getFileResultMessageByCode(status);
                    $('#detail-fileName').text(data.fileName);
                    $('#detail-deviceType').text(data.deviceType);
                    $('#detail-version').text(data.version);
                    $('#detail-organName').text(organIdAndNames[data.organId]);
                    if(data.resultFilePath==null||data.resultFilePath==undefined){
                    	$('#detail-wrappedFile').text('N/A');
                    }else{
                    	$('#detail-wrappedFile').html('<a href="/api/download/wrapping/wrapped/' + data.id + '" download="' + data.fileName + '">Downloads</a>');
                    }
                    if(data.filePath==null||data.filePath==undefined){
                        $('#detail-originFile').text('N/A');
                    }else{
                    	$('#detail-originFile').html('<a href="/api/download/wrapping/origin/'+data.id+'" download="'+data.fileName+'">Downloads</a>');
                    }

                    if(data.deviceType=='iOS'&&data.isInternalModule==1){
                        $("#detail-isInternal").text(getMessage('module.internalModule','내장 모듈'));
					}else if(data.deviceType=='iOS'&&data.isInternalModule==0){
                        $("#detail-isInternal").text(getMessage('module.basicModule','기본 모듈'));
                    }else if(data.deviceType=='Android'&&data.isInternalModule==1){
                        $("#detail-isInternal").text(getMessage('module.internalModule','내장 모듈'));
                    }else if(data.deviceType=='Android'&&data.isInternalModule==0){
                        $("#detail-isInternal").text(getMessage('module.downloadModule','다운로드 모듈'));
                    }
                    $("#detail-regDate").text(timeFormat(data.regDate));
                    $("#detail-doneDate").text(timeFormat(data.doneDate));
                    $("#detail-result").text(result);

                    $('#wrapping-detail').modal('show')
				});
                table.on('click','.wrapping-delete-button', function(e){
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    e.preventDefault();
                    if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
                        return false;
                    }
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $.ajax({
                        type : 'POST',
                        url : '/api/wrapping/delete/' + data.id,
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
	$('.engineDeleteButton').click(function(e) {

		e.preventDefault();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
		var nRow = $(this).parents('tr')[0];
		var data = oTable.row(nRow).data();
		$.ajax({
			type : 'POST',
			url : '/api/wrapping/delete/' + data.id,
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
    initOrganIdAndNames()
	initClickEvent();
});
