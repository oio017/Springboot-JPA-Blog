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
var oTable2;
var dTable;
var dTable2;
var isSuper = ($('#isSuper').val()=='true');
var isMaster = ($('#isMaster').val()=='true');
var hasAuth = ($('#hasAuth').val());
var deviceData;
var deviceModDiv = $('.device-mod-div');
var deviceRegDiv = $('.device-reg-div');
var appendModFormGroupHtml = '<div class="form-group"><label class="control-label col-xs-3">'+getMessage('common.deviceId', '디바이스 아이디')+' <button type="button" class="device-remove" ><span aria-hidden="true" class="device-remove-button"><i class="fa fa-close"></i></span></button></label><div class="col-xs-9"><input type="text" class="form-control mod-terminalId" name="terminalId" data-id=""></div></div>'
var appendNewFormGroupHtml = '<div class="form-group"><label class="control-label col-xs-3">'+getMessage('common.deviceId', '디바이스 아이디')+' <button type="button" class="device-remove" ><span aria-hidden="true" class="device-remove-button"><i class="fa fa-close"></i></span></button></label><div class="col-xs-9"><input type="text" class="form-control new-terminalId" name="terminalId" data-id=""></div></div>'
var exceptList = function() {
	oTable = $('#android-except-table').DataTable();
	$
			.ajax({
				type : "GET",
				url : "/api/super/exceptFile/android",
				async:false,
				success : function(returnValue) {
					oTable.destroy();
					var selected = [];
					oTable=$('#android-except-table')
							.DataTable(
									{
										dom : 'Blfrtp',
										buttons : [  ],
										data : returnValue,
										columns : [ 
										            {data : "path"},
                                                    null,
                                                    {data : "modDate"},
										            null,null
										            ],
										"columnDefs" : [
										    {
//										                	 'data' : function(row, type, val, meta) {},
//													
														'render' : function( data, type, row, meta) {
														content = "";
														// content += '<button class="android-device-button btn btn-sm blue btn-outline">'+getMessage('common.device','디바이스')+'</button>';
														content += '<button class="mod-button btn btn-sm blue btn-outline">'+getMessage('common.edit','수정')+'</button>';
														content += '<button class="delete-button btn btn-sm red btn-outline">'+getMessage('common.remove','삭제')+'</button>';
														return content;
														
													},
											targets : [ 3 ],
											visible:((isSuper)||hasAuth)
										},{'render':function(data, type, row, meta){
										        return dateFormat(data)
                                            },
										    visible:true,
                                            targets : [ 2 ],
                                        },{
                                            'data' : function(row, type, val, meta ){
                                                var result = "";
                                                var isAsterisk = false;
                                                var test = row.exceptDeviceEntityList.forEach(function(i){
                                                    if(i.terminalId=="*"){
                                                        result = "*";
                                                        isAsterisk=true;
                                                    }
                                                })
                                                return isAsterisk?result:row.exceptDeviceEntityList.length;
                                            },
                                            targets : [ 1 ],
                                        }
                                        ,{
										    'data' : function(row, type, val, meta ){
                                                var searchableValue = "";
                                                for(var i in row.exceptDeviceEntityList){
                                                    searchableValue += row.exceptDeviceEntityList[i].terminalId;
                                                }
										        return searchableValue;
                                            },
                                                'searchable': true,
                                                visible: false,
                                                targets : [4]
                                        }
                                            ],
										"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
							            
							            "order": [
									                [2, "desc"]
									              ],
									});
				},
				error:function(e){
					console.log(e);
				}
			});

    oTable2 = $('#ios-except-table').DataTable();
    $
        .ajax({
            type : "GET",
            url : "/api/super/exceptFile/ios",
            async:false,
            success : function(returnValue) {
            	console.log(returnValue)
                oTable2.destroy();
                var selected = [];
                oTable2=$('#ios-except-table')
                    .DataTable(
                        {
                            dom : 'Blfrtp',
                            buttons : [  ],
                            data : returnValue,
                            columns : [
                                {data : "path"},
                                null,
                                {data : "modDate"},
                                null,
                            ],
                            "columnDefs" : [
                                {
//										                	 'data' : function(row, type, val, meta) {},
//
                                    'render' : function( data, type, row, meta) {
                                        content = "";
                                        // content += '<button class="android-device-button btn btn-sm blue btn-outline">'+getMessage('common.device','디바이스')+'</button>';
                                        content += '<button class="mod-button btn btn-sm blue btn-outline">'+getMessage('common.edit','수정')+'</button>';
                                        content += '<button class="delete-button btn btn-sm red btn-outline">'+getMessage('common.remove','삭제')+'</button>';
                                        return content;

                                    },
                                    targets : [ 3 ],
                                    visible:((isSuper)||hasAuth)
                                },{'render':function(data, type, row, meta){
                                        return dateFormat(data)
                                    },
                                    visible:true,
                                    targets : [ 2 ],
                                },{
                                    'data' : function(row, type, val, meta ){
                                        var result = "";
                                        var isAsterisk = false;
                                        var test = row.exceptDeviceEntityList.forEach(function(i){
                                            if(i.terminalId=="*"){
                                                result = "*";
                                                isAsterisk=true;
                                            }
                                        })
                                        return isAsterisk?result:row.exceptDeviceEntityList.length;
                                    },
                                    targets : [ 1 ],
                                },{
                                    'data' : function(row, type, val, meta ){
                                        var searchableValue = "";
                                        for(var i in row.exceptDeviceEntityList){
                                            searchableValue += row.exceptDeviceEntityList[i].terminalId;
                                        }
                                        return searchableValue;
                                    },
                                    'searchable': true,
                                    visible: false,
                                    targets : [4]
                                }

                                ],
                            "dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal

                            "order": [
                                [2, "desc"]
                            ],
                        });
            },
            error:function(e){
                console.log(e);
            }
        });

}
var modalInit = function(){
		//android 등록 클릭
        //경로 추가
		$('.new-path-button').click(function(e){
			e.preventDefault();
            deviceRegDiv.html('')
            $('.device-type').val($(this).data('devicetype'));
            $('.device-type-span').text($(this).data('devicetype'));
			$('#new-android-path-modal').modal('show');
		});
        $('.modal').on('hidden.bs.modal',function(e){
            $('.path-input').val('');
        });
		//submit버튼 클릭 시
        $('#new-path-submit').click(function(e){
            e.preventDefault();
            var deviceType = $('#reg-device-type').val();
            var deviceIdList = new Array();
            var pathId=null;
            var path = $('#new-path').val()
            $('.new-terminalId').each(function(i){
                var object = new Object();
                object.terminalId=$(this).val();
                deviceIdList.push(object)
            });

            $.ajax({
                type : "POST",
                url : "/api/super/exceptFile",
                contentType : "application/json; charset=utf-8",
                data : JSON.stringify(makeRequestObject(pathId,deviceType,deviceIdList, path)),
                async : false,
                success : function(returnValue) {
                    var hasError = false;
                    var message =getMessage('exceptFile.submitIsDoneButServerError', '처리가 완료되었으나 다음의 Eversafe_server에서 에러 발생, 서버상태 확인 필요 - 강제비상모드 메뉴 참조') + '\n';
                    for(var i in returnValue){
                        if(returnValue[i]==false){
                            hasError = true;
                            message += i + '\n';
                        }else{
                        }
                    }
                    if(hasError){
                        alert(message);
                    }else{
                        alert(getMessage('common.submitMessage','등록 완료'));
                    }
                    location.reload();
                },
                error : function(e) {
                    console.log(e);
                    alert("error : " + e.responseJSON.message);
                }
            });
        });
		//수정 submit버튼 클릭 시
		$('#mod-submit').click(function(e){
            e.preventDefault();
            var deviceType = $('#reg-device-type').val();
            var deviceIdList = new Array();
            var pathId=$('#mod-form #pathId').val();
            var path = $('#mod-form #path').val()
            $('.mod-terminalId').each(function(i){
                var object = new Object();
                object.terminalId=$(this).val();
                object.id=$(this).data('id');
                deviceIdList.push(object);
            });

            $.ajax({
				type : "POST",
				url : "/api/super/exceptFile/put",
				data : JSON.stringify(makeRequestObject(pathId,deviceType,deviceIdList, path)),
				async : false,
				contentType : "application/json; charset=utf-8",
				success : function(returnValue) {
                    var hasError = false;
                    var message =getMessage('exceptFile.submitIsDoneButServerError', '처리가 완료되었으나 다음의 Eversafe_server에서 에러 발생, 서버상태 확인 필요 - 강제비상모드 메뉴 참조') + '\n';
                    for(var i in returnValue){
                        if(returnValue[i]==false){
                            hasError = true;
                            message += i + '\n';
                        }else{
                        }
                    }
                    if(hasError){
                        alert(message);
                    }else{
                        alert(getMessage('common.submitMessage','등록 완료'));
                    }

					location.reload();
				},
				error : function(e) {
					console.log(e);
					alert("error : " + e.responseJSON.message);
				}
			});
		});
    $('.add-device').click(function(e){
        e.preventDefault();
        if($(this).data('type')=='reg'){
            deviceRegDiv.append($(appendNewFormGroupHtml));
        }else if($(this).data('type')=='mod'){
            deviceModDiv.append($(appendModFormGroupHtml));
        }
        $('.device-remove-button').off('click')
        $('.device-remove-button').click(function(e){
            e.preventDefault();
            this.closest('.form-group').remove()
        });
    });



    oTable.on('click', '.delete-button', function(e) {
			e.preventDefault();
			var nRow = $(this).parents('tr')[0];
			var data = oTable.row(nRow).data();
            if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
                return false;
            }
            $.ajax({
                type : "POST",
                url : "/api/super/exceptFile/"+(data.deviceType).toLowerCase()+"/delete",
                data : JSON.stringify({"id":data.id}),
                async : false,
                contentType : "application/json; charset=utf-8",
                success : function(returnValue) {
                    var hasError = false;
                    var message =getMessage('exceptFile.submitIsDoneButServerError', '처리가 완료되었으나 다음의 Eversafe_server에서 에러 발생, 서버상태 확인 필요 - 강제비상모드 메뉴 참조') + '\n';
                    for(var i in returnValue){
                        if(returnValue[i]==false){
                            hasError = true;
                            message += i + '\n';
                        }else{
                        }
                    }
                    if(hasError){
                        alert(message);
                    }else{
                        alert(getMessage('common.removeComplete','삭제 완료'));
                    }
                    location.reload();
                },
                error : function(e) {
                    console.log(e);
                    alert("error : " + e.responseJSON.message);
                }
            });
		});
    //수정 버튼
    oTable.on('click', '.mod-button', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        http://192.168.1.116:8090/log/extension
        $('#mod-form #path').val(data.path);
        $('#mod-form #pathId').val(data.id);
        $('.device-type').val(data.deviceType);
        $('#mod-device-type').text(data.deviceType);
        makeDeviceModIdList(data);
        $('#mod-android-path-modal').modal('show');
    });

    oTable2.on('click', '.delete-button', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable2.row(nRow).data();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        $.ajax({
            type : "POST",
            url : "/api/super/exceptFile/"+(data.deviceType).toLowerCase()+"/delete",
            data : JSON.stringify({"id":data.id}),
            async : false,
            contentType : "application/json; charset=utf-8",
            success : function(returnValue) {
                var hasError = false;
                var message =getMessage('exceptFile.submitIsDoneButServerError', '처리가 완료되었으나 다음의 Eversafe_server에서 에러 발생, 서버상태 확인 필요 - 강제비상모드 메뉴 참조') + '\n';
                for(var i in returnValue){
                    if(returnValue[i]==false){
                        hasError = true;
                        message += i + '\n';
                    }else{
                    }
                }
                if(hasError){
                    alert(message);
                }else{
                    alert(getMessage('common.removeComplete','삭제 완료'));
                }
                location.reload();
            },
            error : function(e) {
                console.log(e);
                alert("error : " + e.responseJSON.message);
            }
        });
    });
    //수정 버튼
    oTable2.on('click', '.mod-button', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable2.row(nRow).data();
        http://192.168.1.116:8090/log/extension
            $('#mod-form #path').val(data.path);
        $('#mod-form #pathId').val(data.id);
        $('.device-type').val(data.deviceType);
        $('#mod-device-type').text(data.deviceType);
        makeDeviceModIdList(data);
        $('#mod-android-path-modal').modal('show');
    });
		
}


jQuery(document).ready(function() {
    exceptList();
	modalInit();
    $('#new-except-device-submit').click(function (e){
        e.preventDefault();

        var regData = new Object();
        regData.pathId=$('#new-device-path-id').val();
        regData.terminalId=$('#terminalId').val();
        $.ajax({
            type : 'POST',
            url : '/api/super/exceptFile/device',
            contentType : "application/json; charset=utf-8",
            data : JSON.stringify(regData),
            async : false,
            success : function(returnValue) {
                checkError(returnValue, 'common.submitMessage')
            },
            error : function(e) {
                console.log("failed")
                alert(e.responseJSON.message);
            }
        });
    })
});


var checkError = function(returnValue, code){
    var hasError = false;
    var message =getMessage('exceptFile.submitIsDoneButServerError', '처리가 완료되었으나 다음의 Eversafe_server에서 에러 발생, 서버상태 확인 필요 - 강제비상모드 메뉴 참조') + '\n';
    for(var i in returnValue){
        if(returnValue[i]==false){
            hasError = true;
            message += i + '\n';
        }else{
        }
    }
    if(hasError){
        alert(message);
    }else{
        alert(getMessage(code,'완료'));
    }
    location.reload();
}

var makeDeviceModIdList = function(data){
    var deviceList = data.exceptDeviceEntityList
    deviceModDiv.html("");

    for(var i in deviceList){
        var $formGroupDiv = $('<div class="form-group" data-test="test"></div>')
        $formGroupDiv.append($('<label class="control-label col-xs-3">'+getMessage('common.deviceId', '디바이스 아이디')+' <button type="button" class="device-remove" ><span aria-hidden="true" class="device-remove-button"><i class="fa fa-close"></i></span></button></label>'));
        var $inputDiv = $('<div class="col-xs-9"></div>')
        $inputDiv.append($('<input type="text" class="form-control mod-terminalId terminalId" name="terminalId" data-id="'+deviceList[i].id+'" />').val(deviceList[i].terminalId));
        $formGroupDiv.append($inputDiv);
        deviceModDiv.append($formGroupDiv);
    }
    $('.device-remove-button').click(function(e){
        e.preventDefault();
        this.closest('.form-group').remove()
    });
}

var makeRequestObject =  function(pathId, deviceType, deviceIdList, path){
    var result = new Object();
    result.exceptDeviceEntityList = deviceIdList;
    result.id = pathId;
    result.deviceType=deviceType;
    result.path = path;
    return result;
}