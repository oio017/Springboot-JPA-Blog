$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')


var table = $('#appTable');
var table2 = $('#app-version-table');
var file_type = "";
var oTable;
var vTable;
var versionData;
var registrationData;
var base64RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");
var InitFunction = function () {
    return {
        initDaterange: initDatePicker("dateRange"),
        table: function () {
            var mainTable = function () {
                // table에 datatable적용
                $
                    .ajax({
                        type: 'GET',
                        url: '/api/app',
                        // data : {
                        // page : pageVal,
                        // size : sizeVal,
                        // sort : sizeVal,
                        // direction:directionVal
                        // },
                        success: function (returnValue) {
                            // api address와 api port 화면에 할당
                            oTable = table
                                .DataTable({
                                    dom: 'Blfrtp',
                                    buttons: [],
                                    "autoWidth": false,
                                    "lengthMenu": [
                                        [10, 15, 20, 50, 100, -1],
                                        [10, 15, 20, 50, 100,
                                            "All"] // change
                                        // per page
                                        // values
                                        // here
                                    ],
                                    "pageLength": 20,
                                    data: returnValue,
                                    columns: [{
                                        data: "deviceType"
                                    }, {
                                        data: "appName"
                                    }, {
                                        data: "packageName"
                                    }, null, null],
                                    "columnDefs": [{
                                        'data': "id",
                                        'render': function (data, type,
                                                            row, meta) {
                                            var result = "<div class='button-wrap'>";
                                            buttons = []
                                            buttons.push
                                            if ($('#AccountInfo').data("unusingencryptedappid") == false) {
                                                buttons.push("<a href=\"javascript:appIdModal('" + row.enCryptedAppId + "')\" class='btn btn-sm purple btn-outline' style='padding : 5px; text-align: center; margin-top: -5px; margin-bottom: -5px; 'data-appId='"
                                                    + data
                                                    + "'> "
                                                    + getMessage("app.verifyAppId", "APP ID확인")
                                                    +
                                                    "</a>");
                                            }
                                            buttons.push("<a href='#' class='btn btn-sm green btn-outline app-version-info' style='padding : 5px;  text-align: center; margin-top: -5px; margin-bottom: -5px; 'data-appId='"
                                                + data
                                                + "'> "
                                                + getMessage("app.versionManagement", "버전관리")
                                                + "</a>");

                                            if ($('#hasAppWriteAccess').val() == 'true') {
                                                buttons.push("<a href='#'  class='btn btn-sm blue btn-outline app-modify' style='padding : 5px; text-align: center; margin-top: -5px; margin-bottom: -5px;' data-appId='"
                                                    + data
                                                    + "'> "
                                                    + getMessage("common.modify", "수정")
                                                    + "</a>");
                                                buttons.push("<a href='#'  class='btn btn-sm red btn-outline app-delete' style='padding : 5px; text-align: center; margin-top: -5px; margin-bottom: -5px; 'data-appId='"
                                                    + data
                                                    + "'> "
                                                    + getMessage("common.delete", "삭제")
                                                    + "</a>");
                                            }
                                            result += buttons.join("&nbsp;&nbsp;")
                                            result += "</div>"
                                            return result;
                                        },
                                        "width": "253px",
                                        class: 'app-button-td',
                                        "searchable": false,
                                        'targets': [4]
                                    }, {
                                        'data': "modDate",
                                        'render': function (data, type,
                                                            row, meta) {
                                            result = timeFormat(data)
                                            return result;
                                        },
                                        'targets': [3]
                                    }],
                                    "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
                                    // scrollable
                                    // datatable

                                    "order": [[3, "desc"]],

                                });
                        },
                        error: function (e) {
                            alert(e.responseJSON.message);
                            console.log(e.responseJSON.message)
                        }

                    });
                var nEditing = null;
                var nNew = false;
                //add-app
                $('#add-app').click(function (e) {
                    e.preventDefault();
                    $('#reg-app-os').val('android');
                    $('#reg-app-name').val('');
                    $('#reg-app-packageName').val('');
                    $('#app-reg-modal').modal();
                });
                //정보 수정 클릭 시
                table.on('click', '.app-modify', function (e) {
                    e.preventDefault();
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $('#info-modify-modal').modal();
                    $('#app-os').val(data["deviceType"]);
                    $('#app-info-change-id').val(data["id"]);
                    $('#app-name').val(data["appName"]);
                    $('#app-packageName').val(data["packageName"]);

                    /* Get the row as a parent of the link that was clicked on */
                    // 패키지 정보 할당
                    // TODO internationalization

                });
                //정보 수정 submit

                $('#app-info-submit').click(function (e) {
                    e.preventDefault();
                    $.ajax({
                        type: 'POST',
                        url: '/api/app/put',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify($('#app-info-form').serializeJSON()),
                        async: false,
                        success: function (returnValue) {
                            alert(getMessage('common.infoChangedMessage', '정보가 변경되었습니다.'));
                            location.href = "/app";
                        },
                        error: function (e) {
                            alert('error : ' + e.responseJSON.message);
                        }
                    });
                    /* Get the row as a parent of the link that was clicked on */
                    // 패키지 정보 할당
                    // TODO internationalization

                });
                $('#add-app-submit').click(function (e) {
                    e.preventDefault();
                    $('#organ-id').val($('#AccountInfo').data('organid'));
                    $.ajax({
                        type: 'POST',
                        url: '/api/app',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify($('#app-reg-form').serializeJSON()),
                        async: false,
                        success: function (returnValue) {
                            alert(getMessage('common.submitMessage', '등록 완료'));
                            location.reload();
                        },
                        error: function (e) {
                            alert(e.responseJSON.message)
                        }
                    });

                });


                // 버전정보 클릭시
                table.on('click', '.app-version-info', function (e) {
                    e.preventDefault();
                    var nRow = $(this).parents('tr')[0];
                    /* Get the row as a parent of the link that was clicked on */
                    // 패키지 정보 할당
                    var data = oTable.row(nRow).data();

                    //버전정보 모달에서 부모 TR정보를 담을 변수
                    versionData = data;

                    setPackageInfo(data);
                    setAppVersionTable(data);
                    $('#app-info-id').val(data.id);

                    $('#version-info-modal').modal();
                    //모달 해제시 담고있던 정보 해제
                    $('#version-info-modal').on('hidden.bs.modal', function (e) {
                        versionData = undefined;
                        location.reload();
                    });
                    if (data.deviceType == 'android') {
                        $('.file-type').html('apk/zip');

                        $('.type-icon').addClass('fa-android');
                        $('.type-icon').removeClass('fa-apple');
                        $('#fileupload').attr("accept", ".zip,.apk")

                    } else {
                        $('.file-type').html('ipa');

                        $('.type-icon').addClass('fa-apple');
                        $('.type-icon').removeClass('fa-android');
                        $('#fileupload').attr("accept", ".ipa")
                    }

                });


                //보안옵션 버튼 클릭시
                table.on('click', '.app-option', function (e) {
                    e.preventDefault();
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $('#app-option-modal').modal();
                    keys = Object.keys(data)
                    //선택된 app object property를 순회하면서 값 설정
                    var nStart = new Date().getTime();
                    for (var i in keys) {
//						id 로 dom존재여부 확인후 없으면 패스(성능측정결과 없는게 더 빨라서 없앰)
//						if($('#'+keys[i]).length==0){
//							continue;
//						}
                        if (data[keys[i]] == 0) {
                            $('#' + [keys[i]]).bootstrapSwitch('state', false);
                            $('#' + [keys[i]]).val('0');
                        } else if (data[keys[i]] == 1) {
                            $('#' + [keys[i]]).bootstrapSwitch('state', true);
                            $('#' + [keys[i]]).val('1');
                        }
                    }
                    $('.make-switch').on('switchChange.bootstrapSwitch', function (event, state) {
                        if (state) {
                            $(this).val('1');
                        } else {
                            $(this).val = ('0');
                        }
                    });
                    $('#app-option-id').val(data["id"]);

                    /* Get the row as a parent of the link that was clicked on */
                    // 패키지 정보 할당
                    // TODO internationalization

                });
                //보안옵션 submit
                $('#app-option-submit').click(function (e) {
                    e.preventDefault();

                    $.ajax({
                        type: 'POST',
                        url: '/api/app/' + $('#app-option-id').val() + '/put',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify($('#app-option-form').serializeJSON({checkboxUncheckedValue: "0"})),
                        async: false,
                        success: function (returnValue) {
                            alert(getMessage('common.updatedMessage', '수정 완료'));
                        },
                        error: function (e) {
                            alert(e.responseJSON.message);
                        }
                    });
                    /* Get the row as a parent of the link that was clicked on */
                    // 패키지 정보 할당
                    // TODO internationalization

                });
                // 삭제 클릭
                table.on('click', '.app-delete', function (e) {
                    e.preventDefault();
                    /* Get the row as a parent of the link that was clicked on */
                    // 패키지 정보 할당
                    // TODO internationalization
                    if (confirm(getMessage('common.deleteConfirmMessage', '삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
                        return false;
                    }
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $.ajax({
                        type: 'POST',
                        url: '/api/app/' + data.id + '/delete',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(data),
                        async: false,
                        success: function (returnValue) {
                            oTable.row(nRow).remove().draw();
                            location.reload();
                        },
                        error: function (e) {
                            if (e.responseJSON.code == "ApiServerErrorException") {
                                alert(e.responseJSON.message);
                                location.reload();
                            }
                            alert(e.responseJSON.message);
                        }
                    });

                });

                //테스트 버전 등록
                $('#test-version-submit').click(function () {
                    var data = versionData;
                    if ($('#AccountInfo').data('usingversioncode') == true) {
                        data.appVersion = $('#new_app_version_number').val() + '(' + $('#new_app_version_code').val() + ')';
                    } else {
                        data.appVersion = $('#new_app_version_number').val();
                    }
                    versionData["libGen"] = $(':radio[name="libGen"]:checked').val();
                    //data.appVersion=$('#new_app_version').val();
                    if (!confirm(getMessage('common.submitConfirmMessage', '등록하시겠습니까?'))) {
                        return false;
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/api/app-version',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(data),
                        async: false,
                        success: function (returnValue) {
                            alert(getMessage('common.submitMessage', '등록 완료'));
                            location.reload();
                        },
                        error: function (e) {
                            alert('error : ' + e.responseJSON.message)
                        }
                    });
                });

            }

            return {
                // main function to initiate the module
                init: function () {
                    mainTable();
                }
            };
        },
        modalInit: function () {
            $('#version-register-modal-launcher').click(function (e) {
                e.preventDefault();
                $('#new_app_version_number').val('');
                $('#new_app_version_code').val('');
                $('#version-registration-modal').modal('show');
            });
            //파일버전 등록 클릭 시

        },
        init: function () {
            this.initDaterange;
            // this.initCreateTable()
            this.table().init();
            this.modalInit();
        }
    };
}();

//appVersion 테이블 생성
var setAppVersionTable = function (AppData) {
    console.log(AppData)
    var policyList;
    var data = AppData.appVersionList;
	var dynamicVersionMap = new Object();
	$.ajax({
		url:'/api/app-version/'+AppData.id+'/module-version/',
		type:'GET',
		async: false,
		success:function(result){
			for (var i in result) {
				dynamicVersionMap[result[i].id] = result[i].version;
			}
			console.log(result)
		},
		error: function(e){
			console.log(e);
			if(e.responseJSON.code=="ApiServerErrorException"){
				alert(e.responseJSON.message);
				location.reload();
			}
			alert(e.responseJSON.message);
		}
	});
    $.ajax({
        type: 'GET',
        url: '/api/policy/' + AppData.id,
        async: false,
        success: function (returnValue) {
            policyList = returnValue;
        },
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
    if (AppData.deviceType == "android") {
        file_type = "apk";
    } else if (AppData.deviceType == "ios") {
        file_type = "ipa";
    }
    vTable = table2
        .DataTable(
            {
                destroy: true,
                dom: 'lfrtp',
                "pageLength": 10,
                data: data,
                columns: [
                    {data: "appVersion"}
                    , null
                    , null
                    , null
                    , null
                    , null
                    , null
                    , null
                ],
                "columnDefs": [
                    {
                        'data': function (row, type, val, meta) {
                            var result = '<div><select name="policy">';
                            var selectedId = "";
                            if (row.policyEntity != null) {
                                selectedId = row.policyEntity.id;
                                selectedName = row.policyEntity.policyName;
                            } else {//정책이 null인 경우
                                row.policyEntity = {id: -100, policyName: getMessage("common.unselected", "미선택")}
                                selectedId = row.policyEntity.id;
                                selectedName = row.policyEntity.policyName;
                            }
                            //정책이 null인 경우 (db에서 policy_id 가null 인 경우)
                            result += '<option value="-100" selected>' + getMessage("common.unselected", "미선택") + '</option>'
                            $.each(policyList, function (index, item) {
                                if (item.id == selectedId) {
                                    result += '<option value="' + item.id + '" selected>' + item.policyName + '</option>'
                                } else {
                                    result += '<option value="' + item.id + '">' + item.policyName + '</option>';
                                }
                            });
                            if ($('#hasAppWriteAccess').val() == 'true') {
                                result += '</select><button class="save-policy" data-originpolicyid="' + selectedId + '" data-originpolicyname="' + selectedName + '">' + getMessage('policy.common.applyPolicy', '정책 적용') + '</button></div>';
                            }
                            return result;
                        },
                        'targets': [2],
                        'orderable': false
                    }, {
                        'data': function (row, type, val, meta) {
                            var gen = 3;
                            if (base64RegExp.exec(row.registrationCode) == null) {
                                gen = 2
                            }
                            return gen;
                        },
                        'targets': [1],
                        'orderable': false
                    }, {
                        'data': "appFilePath",
                        'render': function (data, type, row, meta) {
                            if (row.isItByBackground == 1) {//신버전
                                if (row.appFilePath != null && row.isHashed != null && row.isHashed != 0) {
                                    var slashIndex = row.appFilePath.lastIndexOf("/");
                                    var backSlashIndex = row.appFilePath.lastIndexOf("\\");
                                    var fileName = "";
                                    if (backSlashIndex != -1) {
                                        fileName = row.appFilePath.substr(backSlashIndex + 1)
                                    } else {
                                        fileName = row.appFilePath.substr(slashIndex + 1)
                                    }
                                    return getFileResultMessageByCode(row.isHashed) + "<br><p class='black-color'>" + fileName+"</p>";
                                } else {
                                    return getFileResultMessageByCode(row.isHashed)
                                }

                            } else {//구버전
                                var result = "";
                                if (row.isHashed == null) {
                                    result = "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> " + getMessage("app.fileStatus.unregistered", "미등록");
                                } else if (row.isHashed == 0) {
                                    result = "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>" + getMessage("app.fileStatus.waitForRegistration", "등록대기중");
                                } else if (row.isHashed == 0x1) {
                                    result = getMessage("app.fileStatus.registerd", "등록완료");
                                } else if (row.isHashed == 0x2) {
                                    result = "<i class=\"fa fa-spinner\" aria-hidden=\"true\"></i>" + getMessage("app.fileStatus.processing", "처리중");
                                } else if (row.isHashed == -0x0001) {
                                    result = getMessage("app.fileStatus.developerVerificationReqired", "개발담당자의 확인이 필요합니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0007) {
                                    result = getMessage("app.fileStatus.noPakageName", "파일에서 패키지 이름을 인식할 수 없습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0008) {
                                    result = getMessage("app.fileStatus.PackageNameNotEquals", "등록된 패키지 이름과 일치하지 않습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0103) {
                                    result = getMessage("app.fileStatus.noVersion", "등록된 버전이 없습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0111) {
                                    result = getMessage("app.fileStatus.versionCodeNotEquals", "등록된 버전 코드와 일치하지 않습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0113) {
                                    result = getMessage("app.fileStatus.noVersionCodeWithinFile", "파일에서 버전 코드를 인식 할 수 없습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0121) {
                                    result = getMessage("app.fileStatus.notMatchVersionName", "등록된 버전명과 일치하지 않습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x0123) {
                                    result = getMessage("app.fileStatus.NoVersionNameWithinFile", "파일에서 버전명을 인식할 수 없습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x1001) {
                                    result = getMessage("app.fileStatus.uploadFailed", "업로드 실패") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x1002) {
                                    result = getMessage("app.fileStatus.cannotReconizedInfo", "파일에서 정보를 인식할 수 없습니다.") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -0x2001) {
                                    result = getMessage("app.fileStatus.dbError", "데이터베이스 에러") + "(" + row.isHashed.toString(16) + ")";
                                } else if (row.isHashed == -1000) {
                                    result = getMessage("file.status.requestTimeoutToBackgroundProcessor", '백그라운드 프로세서타임아웃')
                                } else if (row.isHashed == -1001) {
                                    result = getMessage("file.status.requestFailedToBackgroundProcessor", '백그라운드 프로세서에 요청 실패')
                                } else {
                                    result = "error";
                                }

                                if (row.appFilePath != null && row.isHashed != null && row.isHashed != 0) {
                                    var slashIndex = row.appFilePath.lastIndexOf("/");
                                    var backSlashIndex = row.appFilePath.lastIndexOf("\\");
                                    var fileName = "";
                                    if (backSlashIndex != -1) {
                                        fileName = row.appFilePath.substr(backSlashIndex + 1)
                                    } else {
                                        fileName = row.appFilePath.substr(slashIndex + 1)
                                    }
                                    return result + "<br><p class='blue-color'>" + fileName + "</p>";
                                }else{

                                    return result;
                                }

                            }

                        },
                        'targets': [3],
                        'orderable': false
                    }, {
                        'data': "modDate",
                        'render': function (date, type, row, meta) {
                            return timeFormat(date);
                        },
                        'targets': [5],
                    }, {
                        'data': function (row, type, val, meta) {
                            if (row.isWrappedApp == null) {
                                return "N/A"
                            } else if (row.isWrappedApp == 2) {
                                    if(row.isHashed!=1){
                                        return "N/A"
                                    }else{
                                        return getMessage('module.inner','내장') + "<br>" + +dynamicVersionMap[row.id]+" [" +row.moduleCount+"]"
                                    }

                            } else {
                                return getMessage('module.nonInner', '비내장')
                            }
                        },
                        'targets': [4],
                        'orderable': false
                    }
                    , {
                        'data' : null,
                        'targets': [6],
                        'visible': false
                    }, {
                        'data': "id",
                        'render': function (data, type, row, meta) {
                            var result = "<div class='button-wrap'>";
                            buttons = [];
                            if ($('#hasAppWriteAccess').val() == 'true') {
                                if (row.isHashed == null) {
                                    buttons.push("<a href='#'  class='btn btn-sm blue btn-outline file-version-register-modal-launcher' style='text-align: center; ' data-registration-code='" + row.registrationCode + "'>" + getMessage("app.fileRegistration", "파일 등록") + "</a>");
                                    buttons.push("<a href='#'  class='btn btn-sm red btn-outline app-version-delete' style='text-align: center;' data-id='" + data + "'>" + getMessage('common.delete', "삭제") + "</a>");
                                } else {
                                    // buttons.push("<a href='#'  class='btn btn-sm blue btn-outline file-version-register-modal-launcher' style='text-align: center; ' data-registration-code='"+ row.registrationCode + "'>"+getMessage("app.fileReRegistration","파일 재등록")+"</a>");
                                    buttons.push("<a href='#'  class='btn btn-sm blue btn-outline app-version-file-delete' style='text-align: center; ' data-registration-code='" + row.registrationCode + "'>" + getMessage("app.fileDelete", "파일 삭제") + "</a>");
                                    buttons.push("<a href='#'  class='btn btn-sm red btn-outline app-version-delete' style='text-align: center; margin-top:2px; ' data-id='" + data + "'>" + getMessage('common.delete', "삭제") + "</a>");
                                }

                            }
                            result += buttons.join("&nbsp;&nbsp;")
                            result += "</div>"
                            return result;
                        },
                        'targets': [7],
                        'orderable': false
                    }
                ]
                , "order": [[5, "desc"]]

            });
    table2.off('click', '.file-version-register-modal-launcher');
    table2.on('click', '.file-version-register-modal-launcher', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        /* Get the row as a parent of the link that was clicked on */
        // 패키지 정보 할당
        var data = vTable.row(nRow).data();
        //버전정보 모달에서 부모 TR정보를 담을 변수
        registrationData = data;
        $('#registration-code').val(data.registrationCode);
        uploadAppVersion(data.registrationCode);
        $('#version-upload-reg-modal').modal('show');
        $('#version-info-modal').on('hidden.bs.modal', function (e) {
            registrationData = undefined;
            $('#registration-code').val("");
        });
    });
//	$('#test-version-register-modal-launcher').click(function(){
//		alert('!!');
//		$('#test-version-modal').modal('show');
//	});

    //정책 적용 버튼 클릭 시
    table2.on('click', '.save-policy', function () {
        var clickedButton = $(this);
        var selectedOption = $(this).closest('div').children('select').children('option:selected');
        if (($(this).data('originpolicyid') == $(this).closest('div').children('select').children('option:selected').val())) {
            alert(getMessage('app.choseSamePolicy', '원래의 정책과 같은 정책을 선택했습니다.'));
            return false;
        }
        if (!confirm($(this).data('originpolicyname') + ' -> ' + $(this).closest('div').children('select').children('option:selected').text() + "\n" + getMessage("app.policyChangeConfirmMessage", "진행하시겠습니까?"))) {
            return false;
        }

        var nRow = $(this).closest('tr');
        var data = vTable.row(nRow).data();
        //TODO api스펙에 명기 해야함 바꿀 정책id
        data.changedPolicyId = $(this).closest('div').children('select').children('option:selected').val();
        //미선택일 경우 정책을 null처리
        if (data.changedPolicyId == -100) {
            data.policyEntity = null;
        }
        $.ajax({
            type: 'POST',
            url: '/api/app-version/put',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            async: false,
            success: function (returnValue) {
                if (returnValue.toString().startsWith("\n\n<!--LoggedOut-->")) {
                    alert(getMessage('common.sessionExpiredMessage', '로그인 세션 만료, 다시 로그인해 주시기 바랍니다.'));
                    location.replace("/login");
                    return false;
                }
                //성공시 버튼의 origin값 변경
                clickedButton.data("originpolicyid", clickedButton.closest('div').children('select').children('option:selected').val());
                clickedButton.data("originpolicyname", clickedButton.closest('div').children('select').children('option:selected').text());
                //정책변경 성공 후 datatables의 값을 변경하여 모달 재생성시에도 변경된 값이 나오도록 구현
                var updatedPolicyEntity = new Object;
                updatedPolicyEntity.id = clickedButton.closest('div').children('select').children('option:selected').val();
                updatedPolicyEntity.policyName = clickedButton.closest('div').children('select').children('option:selected').text();
                for (var index in versionData.appVersionList) {
                    if (versionData.appVersionList[index].id == data.id) {
                        versionData.appVersionList[index].policyEntity = updatedPolicyEntity;
                    }
                }
                alert(getMessage('common.updatedMessage', '수정 완료'));
                //location.reload();
            },
            error: function (e) {
                //실패시 원래의 선택값으로 복원
                clickedButton.closest('div').children('select').val(clickedButton.data("originpolicyid"));
                alert(getMessage('common.updateFailMessage' + '수정 실패 ') + e.responseJSON.message);
            }
        });

    });


    table2.off('click', '.app-version-delete');
    table2.off('click', '.app-version-file-delete');
    table2.on('click', '.app-version-delete', function (e) {
        e.preventDefault();
        /* Get the row as a parent of the link that was clicked on */
        // 패키지 정보 할당
        // TODO internationalization
        if (confirm(getMessage('common.deleteConfirmMessage', '삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        var nRow = $(this).parents('tr')[0];
        var data = vTable.row(nRow).data();
        $.ajax({
            type: 'POST',
            url: '/api/app-version/' + data.id + '/delete',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            async: false,
            success: function (returnValue) {
                vTable.row(nRow).remove().draw();
            },
            error: function (e) {
                if (e.responseJSON.code == "ApiServerErrorException") {
                    alert(e.responseJSON.message);
                    vTable.row(nRow).remove().draw();
                }
                alert(e.responseJSON.message);
            }
        });

    });
    table2.on('click', '.app-version-file-delete', function (e) {
        e.preventDefault();
        /* Get the row as a parent of the link that was clicked on */
        // 패키지 정보 할당
        // TODO internationalization
        if (confirm(getMessage('common.deleteConfirmMessage', '삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        var nRow = $(this).parents('tr')[0];
        var data = vTable.row(nRow).data();
        $.ajax({
            type: 'POST',
            url: '/api/app-version/' + data.id + '/file/delete',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            async: false,
            success: function (returnValue) {
                alert(getMessage('common.removeComplete', '삭제 완료'));
                location.reload();
                // vTable.row(nRow).remove().draw();
            },
            error: function (e) {
                console.log(e)
                if (e.responseJSON.code == "ApiServerErrorException") {
                    alert(e.responseJSON.message);
                    location.reload();
                }
                if (e.responseJSON.exception == "java.io.FileNotFoundException") {
                    alert(getMessage('log.osForgeryDetails.fileNotFound', '파일 없음'));
                } else {
                    alert(e.responseJSON.message);
                }
            }
        });

    });


}


function setPackageInfo(data) {
    $('#span-app-name').text(data.appName);
    $('#span-organ-id').text(data.organ.enCryptedOrganId);
    $('#span-organ-name').text((data.organ.organName == "" ? "noname" : data.organ.organName));
    $('#span-app-enCryptedAppId').text(data.enCryptedAppId);
    $('#span-app-id').text(data.id);
}

function setApiInfo(apiIp, apiPort) {
    $('#api-ip').text(apiIp);
    $('#api-port').text(apiPort);
}


var uploadAppVersion = function (urlVal) {
    'use strict';
    var progress;
    $('#fileupload').fileupload({
        type: "POST",
        url: "/api/upload/appversion/" + urlVal,
        dataType: 'json',
        autoUpload: false,
        add: function (e, data) {
            var uploadErrors = [];
            //var acceptFileTypes = /(\.|\/)(ipa|apk|jpe?g|png)$/i;
            var filename = data.files[0].name;
            var type = filename.lastIndexOf(".");
            console.log(filename.substring(type + 1).toLowerCase())
            if (filename.substring(type + 1).toLowerCase() != file_type) {
                if(file_type=="apk"){
                    if(filename.substring(type + 1).toLowerCase() !="zip"){
                        uploadErrors.push(getMessage('common.checkExtension', '확장자를 확인 해 주세요'));
                    }
                }
            }
            if (data.originalFiles[0]['size'] > 500000000) {
                uploadErrors.push(getMessage('common.FileSizeLimit50', '파일크기는 50MB를 넘을수 없습니다.'));
            }
            if (uploadErrors.length > 0) {
                alert(uploadErrors.join("\n"));
            } else {
                data.submit();
            }
        },
        success: function (returnValue) {
            console.log(returnValue)
        },
        error: function (e, data) {
            if (e.responseJSON != undefined) {
                alert(e.responseJSON.message)
            } else {
                if (e.status == 200) {
                    this.done(e);
                } else {
                    alert(e.getStatusText);
                }
            }
            $('#progress .progress-bar').css(
                'width',
                0 + '%'
            );
        },
        done: function (e, data) {
            setAppVersionTable(data.result.result);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            var alertMessage = getMessage('common.upload.complete', '업로드 성공') + " - " + getMessage('app.pleaseCheckStatus', '파일 등록 상태를 확인해주세요.');
            alertMessage += "\n";

            if (data.result.error != undefined) {
                alertMessage += data.result.error + "\n";
            }
            if (data.result.ApiServerErrorException != undefined) {
                alertMessage += data.result.ApiServerErrorException + "\n";
                ;
                alert(data.result.ApiServerErrorException)
            }
            if (data.result.BackgroundDaemonTimeOutException != undefined) {
                alertMessage += data.result.BackgroundDaemonTimeOutException + "\n";
                ;
            }
            if ($('#isUsingZooKeeper').val() != 'true') {
                alertMessage += '(' + getMessage('common.withApply', '동기화-배포, 적용 필요') + ')';
            }
            alert(alertMessage)
            location.reload();
            $('#version-upload-reg-modal').modal('hide');
            $('#progress .progress-bar').text('');
            $('#progress .progress-bar').text(data.files[0].name + ' ' + getMessage('common.upload.complete', '업로드 완료')).appendTo('#files');

        },
        progressall: function (e, data) {
            progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $('#progress .progress-bar').text('');
            $('#progress .progress-bar').text(progress + '% Complete').appendTo('#files');

        }, uploadProgress: function (event, position, total, percentComplete) {
            // console.log("uploadProgress")
            // console.log(event)
            // console.log(position)
            // console.log(total)
            // console.log(percentComplete)
            var percentValue = percentComplete + '%';
            $("#progress .progress-bar").css("width", percentValue);
        }
    })

}
var appIdModal = function (appId) {
    $('#app-id-field').text("");
    $('#app-id-field').text(appId);
    $('#app-id-modal').modal();

}
$(document).ready(function () {
    //Metronic.init();
    InitFunction.init();
    $('.date-picker').datepicker({
        rtl: Metronic.isRTL(),
        orientation: "left",
        autoclose: true
    });
    if ($('#lib3GenWith2Gen').val() == 'true') {
        $('#lib-version-group').show();
    }
});

