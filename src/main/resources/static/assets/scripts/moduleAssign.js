$scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')

var oTable;
var isSuper = ($('#isSuper').val() == 'true');
var isMaster = ($('#isMaster').val() == 'true');
var appMap = new Object();
var appVersionListMap = new Object();
var appOrganNameMap = new Object();
var androidApps = new Object();
var iosApps = new Object();
var androidVersionMap = new Object();
var iosVersionMap = new Object();;

var appVersionMap = new Object();
var moduleVersionMap = new Object();
var $newDeviceType= $('#new-assign-form #deviceType');
var $newIsInnerModule= $('#new-assign-form #isInnerModule');
var $newAppIdDom = $('#new-assign-form #appId');
var $newAppVersionDom = $('#new-assign-form #appVersionId');
var $newAssignTargetDom = $('#new-assign-form #assignTarget');
var $newModuleVersionDom = $('#new-assign-form #moduleVersion');
var $modDeviceType= $('#mod-assign-form #deviceType');
var $modIsInnerModule= $('#mod-assign-form #isInnerModule');
var $modAppIdDom = $('#mod-assign-form #appId');
var $modAppVersionDom = $('#mod-assign-form #appVersionId');
var $modAssignTargetDom = $('#mod-assign-form #assignTarget');
var $modModuleVersionDom = $('#mod-assign-form #moduleVersion');




var initassignList = function () {
    oTable = $('#api-server-table').DataTable();
    $
        .ajax(
            {
                type: "GET",
                url: "/api/super/module/assign",
                async: false,
                success: function (returnValue) {
                    oTable.destroy();

                    var selected = [];
                    oTable = $('#module-assign-table')
                        .DataTable(
                            {
                                dom: 'Blfrtp',
                                buttons: [],
                                data: returnValue,
                                columns: [{
                                    data: "priority"
                                }, {
                                    data: "appId"
                                }, {
                                    data: "appVersionId"
                                }, {
                                    data: "deviceType"
                                },null, {
                                    data: "deviceModel"
                                }, {
                                    data: "osVersion"
                                }, {
                                    data: "eversafeLibraryVersion"
                                },
                                    null
                                ,{
                                    data: "regDate"
                                }, null],
                                "columnDefs": [
                                    {
                                        'render': function (data, type,row, meta) {
                                            return timeFormat(data);
                                        },
                                        targets: [
                                            "tbl-regDate"]
                                    },
                                    {
                                        'render': function (data, type, row, meta) {
                                            var content = "";

                                            if (row.id == 1||row.id == 2||row.id == 3||row.id == 4|| row.deviceModel=='EverspinWatchdog') {

                                            } else {
                                                content += '<button class="assign-mod-button btn btn-sm blue btn-outline">'+getMessage("common.modify","수정")+'</button>';
                                                content += '<button class="assign-delete-button btn btn-sm red btn-outline">'+getMessage("common.delete","삭제")+'</button>';
                                            }
                                            return content;
                                        },
                                        targets: ["tbl-etc"],
                                    },
                                    {
                                        'render': function (data, type, row, meta) {
                                            if (row.isAppIdAsterisk) {
                                                return "*";
                                            } else {
                                                if (appMap[data] != undefined) {
                                                    return appMap[data] + "(" + data + ")";
                                                } else {
                                                    return "<span class='red-color'> deleted" + "(" + data + ")" + "</span>";
                                                }
                                            }
                                        },
                                        targets: ["tbl-app"],

                                    },
                                    {
                                        'render': function (data, type, row, meta) {
                                            if (row.isAppVersionAsterisk) {
                                                return "*";
                                            } else {
                                                if (appVersionMap[data] != undefined) {
                                                    return appVersionMap[data];
                                                } else {
                                                    return "<span class='red-color'> deleted" + "(" + data + ")" + "</span>";
                                                }
                                            }
                                        },
                                        targets: ["tbl-appVersion"],

                                    },
                                    {
                                        'render': function (data, type, row, meta) {
                                            if (row.isDeviceModelAsterisk) {
                                                return "*";
                                            } else {
                                                return data;
                                            }
                                        },
                                        targets: ["tbl-deviceModel"],

                                    },
                                    {
                                        'render': function (data, type, row, meta) {
                                            if (row.isOsVersionAsterisk) {
                                                return "*";
                                            } else {
                                                return data;
                                            }
                                        },
                                        targets: ["tbl-osVersion"],

                                    }, {
                                        'render': function (data, type, row, meta) {
                                            if (row.isEversafeLibraryVersionAsterisk) {
                                                return "*";
                                            } else {
                                                return data;
                                            }
                                        },
                                        targets: ["tbl-eversafeLibraryVersion"],

                                    }, {
                                        'data':function(row, type, val, meta) {
                                            if(row.isInnerModule==1){
                                                return getMessage('module.inner','내장')
                                            }else{
                                                return getMessage('module.nonInner','비내장')
                                            }
                                        },
                                        targets: ["tbl-booleanInner"],

                                    }, {
                                        'data' :function(row, type, val, meta) {
                                                if (row.assignTarget == 3) {
                                                    return getMessage('module.downloadModule','다운로드 모듈')+'('+row.moduleVersion+')';
                                                }else if(row.assignTarget==0) {
                                                    return getMessage('moduleAssign.basicModule', '기본 모듈');
                                                }else if(row.assignTarget==1){
                                                    return getMessage('moduleAssign.innerModule', '내장 모듈');
                                                }else if(row.assignTarget==2){
                                                    return getMessage('moduleAssign.latestDownloadModule', '최신 다운로드 모듈');
                                                }
                                            return 1;
                                        },
                                        // 'render': function (data, type, row, meta) {
                                        //     console.log(data)
                                        //     console.log("wwewe")
                                        //     if (data == 3) {
                                        //         return getMessage('module.downloadModule','다운로드 모듈')+'('+row.moduleVersion+')';
                                        //     }else if(data==0) {
                                        //         return getMessage('moduleAssign.basicModule', '기본 모듈');
                                        //     }else if(data==1){
                                        //         return getMessage('moduleAssign.innerModule', '내장 모듈');
                                        //     }else if(data==2){
                                        //         return getMessage('moduleAssign.latestDownloadModule', '최신 다운로드 모듈');
                                        //     }
                                        // },
                                        'targets': [8],

                                    }
                                ],
                                "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal

                                "order": [[0, "desc"]],
                            });
                },
                error: function (e) {
                    console.log(e);
                }
            }).done();
}
var eventInit = function(){
    $("#submitTermSec").click(function () {
        if (confirm(getMessage('module.doYouWantToUpdateGlobalModuleTerm',
            "전역 모듈 간격을 업데이트 하시겠습니까?"))) {
            var result = updateGlobalModuleTerm();
        }
    });
    $.ajax({
        url: '/api/super/module/globalModuleTerm',
        type: 'GET',
        success: function (result) {
            $("#termSec").val(result);
        },
        error: function (e) {
            alert(e.responseJSON.message);
            console.log(e);
        }
    });

    //신규 배정 조건 등록시 디바이스 타입 변경시 콜백
    $newDeviceType.change(function(e){
        e.preventDefault();
        $newAppIdDom.html('');
        // $appIdDom.unbind('change');
        $newAppIdDom.append("<option value=-1 selected>*</option>");
        $newAppVersionDom.html('')
        $newAppVersionDom.append("<option value=-1 selected>*</option>");
        $newAssignTargetDom.html('');
        $newModuleVersionDom.html('');
        //안드로이드 사용여부 true이면서 선택된 디바이스 타입이 안드로이드 일경우
        if($('#useAndroid').val()=='true' && $(this).val().toLowerCase()=='android'){
            for (var i in androidApps) {
                $newAppIdDom.append("<option value="
                    + i
                    + " >"
                    + appOrganNameMap[i]
                    + ' : '
                    + androidApps[i]
                    + "</option>");
            }
            // $newAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
            // $newAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>")
            // $newAssignTargetDom.append("<option value='2'>"+getMessage('moduleAssign.latestDownloadModule','최신 다운로드 모듈')+"</option>")
            // $newAssignTargetDom.append("<option value='3'>"+getMessage('module.downloadModule','다운로드 모듈')+"</option>")
            $newIsInnerModule.change();

            $newModuleVersionDom.html('')

            $newAssignTargetDom.off('change')
            $newAssignTargetDom.change(function(){
               if($(this).val()!=3){
                   $newModuleVersionDom.val("-1");
                   $newModuleVersionDom.attr('disabled',true);
               }else{
                   $newModuleVersionDom.attr('disabled',false);
                   $newModuleVersionDom.html("");
                   for(var i in androidVersionMap){
                       $newModuleVersionDom.append("<option value='"+ androidVersionMap[i]+"'>"+androidVersionMap[i]+"</option>")
                   }
                   // $newModuleVersionDom.children("option").attr('disabled','')
               }
            });
        //iOS 사용 여부가 true일 경우
        }else if($('#useIos').val()=='true'){
            for (var i in iosApps) {
                $newAppIdDom.append("<option value="
                    + i
                    + " >"
                    + appOrganNameMap[i]
                    + ' : '
                    + iosApps[i]
                    + "</option>");
            }
            // $newAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>");
            // $newAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>");
            $newIsInnerModule.change();
            //모듈 버전 선택 비활성화
            $newModuleVersionDom.val("-1");
            $newModuleVersionDom.attr('disabled',true);
            // for(var i in iosVersionMap){
            //     $newModuleVersionDom.append("<option value='"+ iosVersionMap[i]+"'>"+iosVersionMap[i]+"</option>")
            // }
        }

    });
    //신규등록 모듈 내장 여부
    $newIsInnerModule.change(function (e) {
        //모듈 내장을 선택한 경우
        $newAssignTargetDom.html('');
        if($(this).val()==1) {
            if($newDeviceType.val().toLowerCase()=='android'){//안드로이드면서 모듈이 내장된 경우로 모든 선택이 가능하다.
                $newAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
                $newAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>")
                $newAssignTargetDom.append("<option value='2'>"+getMessage('moduleAssign.latestDownloadModule','최신 다운로드 모듈')+"</option>")
                $newAssignTargetDom.append("<option value='3'>"+getMessage('module.downloadModule','다운로드 모듈')+"</option>")
            }else{//ios면서 모듈이 내장된 경우로 기본 모듈과 내장모듈 선택이 가능하다.
                $newAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>");
                $newAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>");
            }
        } else{// 모듈 비내장
            if($newDeviceType.val().toLowerCase()=='android'){//안드로이드면서 모듈이 내장되지 않은 경우로 내장모듈을 선택할 수 없다.
                $newAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
                $newAssignTargetDom.append("<option value='2'>"+getMessage('moduleAssign.latestDownloadModule','최신 다운로드 모듈')+"</option>")
                $newAssignTargetDom.append("<option value='3'>"+getMessage('module.downloadModule','다운로드 모듈')+"</option>")
            }else{//ios면서 모듈이 내장되지 않은 경우로 선택이 기본 모듈밖에는 없다.
                alert(getMessage('moduleAssign.iosBasicWarningMessage','iOS의 경우 모듈이 내장되지 않는 경우 배정대상이 기본모듈 하나뿐 이므로 조건 설정에 의미가 없습니다.'));
                $newAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>");
            }
        }
    });
    //앱 선택 바뀐 경우
    $newAppIdDom
        .change(function () {
            $newAppVersionDom.html('');
            $newAppVersionDom.append("<option value=-1>*</option>");
            $newAppVersionDom.unbind('change');
            if($newAppIdDom.val()!=-1){
                if(appVersionListMap[$newAppIdDom.val()].length ==0){
                    $newAppVersionDom
                        .append("<option value='' disabled>"
                            + getMessage('app.noAppVersion','앱 버전 없음')
                            + "</option>");
                }else{
                    for(i in appVersionListMap[$newAppIdDom.val()]){
                        $newAppVersionDom
                            .append("<option value="
                                + appVersionListMap[$newAppIdDom.val()][i].id
                                + " >"
                                + appVersionListMap[$newAppIdDom.val()][i].appVersion
                                + "</option>");
                    }
                }
            }else{

            }

        });
    //모듈 배정 조건 수정시 디바이스 타입 변경된 경우 콜백
    $modDeviceType.change(function(e){
        console.log("$newDeviceType changed")
        e.preventDefault();
        $modAppIdDom.html('');
        // $appIdDom.unbind('change');
        $modAppIdDom.append("<option value=-1 selected>*</option>");
        $modAppVersionDom.html('')
        $modAppVersionDom.append("<option value=-1 selected>*</option>");
        $modAssignTargetDom.html('');
        $modModuleVersionDom.html('');
        if($('#useAndroid').val()=='true' && $(this).val().toLowerCase()=='android'){
            for (var i in androidApps) {
                $modAppIdDom.append("<option value="
                    + i
                    + " >"
                    + appOrganNameMap[i]
                    + ' : '
                    + androidApps[i]
                    + "</option>");
            }
            $modAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
            $modAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>")
            $modAssignTargetDom.append("<option value='2'>"+getMessage('moduleAssign.latestDownloadModule','최신 다운로드 모듈')+"</option>")
            $modAssignTargetDom.append("<option value='3'>"+getMessage('module.downloadModule','다운로드 모듈')+"</option>")

            $modModuleVersionDom.html('')
            $modAssignTargetDom.off('change')
            $modAssignTargetDom.change(function(){
                if($(this).val()!=3){
                    $modModuleVersionDom.val("-1");
                    $modModuleVersionDom.attr('disabled',true);
                }else{
                    $modModuleVersionDom.attr('disabled',false);
                    $modModuleVersionDom.html('');
                    for(var i in androidVersionMap){
                        $modModuleVersionDom.append("<option value='"+ androidVersionMap[i]+"'>"+androidVersionMap[i]+"</option>")
                    }
                    // $newModuleVersionDom.children("option").attr('disabled','')
                }
            });

        }else if($('#useIos').val()=='true'){
            for (var i in iosApps) {
                $modAppIdDom.append("<option value="
                    + i
                    + " >"
                    + appOrganNameMap[i]
                    + ' : '
                    + iosApps[i]
                    + "</option>");
            }
            $modAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
            $modAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>")
            $modModuleVersionDom.val("-1");
            $modModuleVersionDom.attr('disabled',true);
        }

    });

    //신규등록 모듈 내장 여부
    $modIsInnerModule.change(function (e) {
        //모듈 내장을 선택한 경우
        $modAssignTargetDom.html('');
        if($(this).val()==1) {
            if($modDeviceType.val().toLowerCase()=='android'){//안드로이드면서 모듈이 내장된 경우로 모든 선택이 가능하다.
                $modAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
                $modAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>")
                $modAssignTargetDom.append("<option value='2'>"+getMessage('moduleAssign.latestDownloadModule','최신 다운로드 모듈')+"</option>")
                $modAssignTargetDom.append("<option value='3'>"+getMessage('module.downloadModule','다운로드 모듈')+"</option>")
            }else{//ios면서 모듈이 내장된 경우로 기본 모듈과 내장모듈 선택이 가능하다.
                $modAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>");
                $modAssignTargetDom.append("<option value='1'>"+getMessage('moduleAssign.innerModule','내장 모듈')+"</option>");
            }
        } else{// 모듈 비내장
            if($modDeviceType.val().toLowerCase()=='android'){//안드로이드면서 모듈이 내장되지 않은 경우로 내장모듈을 선택할 수 없다.
                $modAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>")
                $modAssignTargetDom.append("<option value='2'>"+getMessage('moduleAssign.latestDownloadModule','최신 다운로드 모듈')+"</option>")
                $modAssignTargetDom.append("<option value='3'>"+getMessage('module.downloadModule','다운로드 모듈')+"</option>")
            }else{//ios면서 모듈이 내장되지 않은 경우로 선택이 기본 모듈밖에는 없다.
                alert(getMessage('moduleAssign.iosBasicWarningMessage','iOS의 경우 모듈이 내장되지 않는 경우 배정대상이 기본모듈 하나뿐 이므로 조건 설정에 의미가 없습니다.'));
                $modAssignTargetDom.append("<option value='0'>"+getMessage('moduleAssign.basicModule','기본 모듈')+"</option>");
            }
        }
    });




}


var modalInit = function () {
    $('#new-module-assign-button')
        .click(
            function (e) {
                e.preventDefault();
                $('#new-assign-form #deviceType').change();
                $newAssignTargetDom.change();
                // var $appIdDom = $('#new-assign-form #appId');
                $('#new-module-assign-modal').modal('show');
            });
    // 조건등록 submit버튼 클릭 시
    $('#new-module-assign-submit').click(function (e) {
        e.preventDefault();
        if ($("#new-assign-form #deviceModel").val().length == 0) {
            alert(getMessage("moduleAssign.deviceModelRequiredMessage","deviceModel은 필수 입력 사항입니다. 전체 적용시 * 입력"));
            return false;
        }
        if ($("#new-assign-form #osVersion").val().length == 0) {
            alert(getMessage("moduleAssign.odVersionRequiredMessage","os version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
            return false;
        }
        if ($("#new-assign-form #eversafeLibraryVersion").val().length == 0) {
            alert(getMessage("moduleAssign.libVersionRequiredMessage","library version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
            return false;
        }
        if ($("#new-assign-form #priority").val().length == 0) {
            alert(getMessage("moduleCondition.priorityIsRequiredMessage","우선순위는 필수 입력 사항입니다."));
            return false;
        }
        if($newAssignTargetDom.val()==3){
            if($newModuleVersionDom.val()==null||$newModuleVersionDom.val().length==0){
                alert(getMessage("moduleAssign.moduleVersionRequiredMessage","해당 디바이스 타입에대해 등록된 모듈이 없습니다."));
                return false;
            }
        }
        var assignEntity = $('#new-assign-form').serializeJSON({
            checkboxUncheckedValue: "0"
        });
        // console.log(assignEntity)
        $.ajax({
            type: "POST",
            url: "/api/super/module/assign",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(assignEntity),
            async: false,
            success: function (returnValue) {
                alert('모듈 배정 정책이 등록되었습니다.');
                location.reload();
            },
            error: function (e) {
                console.log(e);
                alert("error : " + e.responseJSON.message);
            }
        });
    });
    // 조건수정 submit버튼 클릭 시
    $('#mod-module-assign-submit').click(function (e) {
        e.preventDefault();

        if ($("#mod-assign-form #deviceModel").val().length == 0) {
            alert(getMessage("moduleCondition.deviceModelIsRequiredMessage","deviceModel은 필수 입력 사항입니다. 전체 적용시 * 입력"));
            return false;
        }
        if ($("#mod-assign-form #osVersion").val().length == 0) {
            alert(getMessage('moduleCondition.osVersionIsRequiredMessage',"os version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
            return false;
        }
        if ($("#mod-assign-form #eversafeLibraryVersion").val().length == 0) {
            alert(getMessage('moduleCondition.libVersionIsRequiredMessage',"library version은 필수 입력 사항입니다. 전체 적용시 * 입력"));
            return false;
        }
        if ($("#mod-assign-form #priority").val().length == 0) {
            alert(getMessage("moduleCondition.priorityIsRequiredMessage","우선순위는 필수 입력 사항입니다."));
            return false;
        }
        if($("#mod-assign-form #assignTarget").val()=="3"){
            if($("#mod-assign-form #moduleVersion").val()==null){
                alert(getMessage("moduleCondition.moduleVersionIsRequiredMessage","모듈 버전은 필수 입력 사항입니다."));
                return false;
            }
        }
        var assignEntity = $('#mod-assign-form').serializeJSON({
            checkboxUncheckedValue: "0"
        });

        // return false;
        $.ajax({
            type: "POST",
            url: "/api/super/module/assign/put",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(assignEntity),
            async: false,
            success: function (returnValue) {
                alert('모듈 버전 조건이 수정되었습니다.');
                location.reload();
            },
            error: function (e) {
                console.log(e);

                if(e.responseJSON.code=="ApiServerErrorException"){
                    alert(e.responseJSON.message);
                    location.reload();
                }
            }
        });
    });

    oTable.on('click', '.assign-delete-button', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();

        if (confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))) {
            $.ajax({
                type: "POST",
                url: "/api/super/module/assign/delete",
                data: JSON.stringify({
                    "id": data.id
                }),
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (returnValue) {
                    alert(getMessage('common.deleteSuccessMessage','삭제요청이 이루어 졌습니다.'));
                    location.reload();
                },
                error: function (e) {
                    console.log(e);
                    if(e.responseJSON.code=="ApiServerErrorException"){
                        alert(e.responseJSON.message);
                        location.reload();
                    }
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
            '.assign-mod-button',
            function (e) {
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                var data = oTable.row(nRow).data();
                $modDeviceType.val(data.deviceType)
                $modDeviceType.change();

                $modAssignTargetDom.change();
                $('#mod-assign-form #id').val(data.id);
                $modIsInnerModule.val(data.isInnerModule);
                $modIsInnerModule.change();


                $modAppIdDom.val(data.appId)
                if ($modAppIdDom.val() == null) {
                    alert("삭제된 app이 조건으로 배정되어있습니다. 조건과 현재 상태를 확인하세요 \n 조건의 appId : "
                        + data.appId);
                }
                $modAppIdDom.off('change');
                $modAppIdDom.change(function () {
                    console.log("$modAppIdDom changed")
                        $modAppVersionDom.html('');
                        $modAppVersionDom.append("<option value=-1>*</option>");
                        $modAppVersionDom.unbind('change');
                        if($modAppIdDom.val()!=-1){
                            if(appVersionListMap[$modAppIdDom.val()]==null||appVersionListMap[$modAppIdDom.val()].length ==0){
                                $newAppVersionDom
                                    .append("<option value='' disabled>"
                                        + getMessage('app.noAppVersion','앱 버전 없음')
                                        + "</option>");
                            }else{
                                for(i in appVersionListMap[$modAppIdDom.val()]){
                                    $modAppVersionDom
                                        .append("<option value="
                                            + appVersionListMap[$modAppIdDom.val()][i].id
                                            + " >"
                                            + appVersionListMap[$modAppIdDom.val()][i].appVersion
                                            + "</option>");
                                }
                            }
                        }else{

                        }

                    });
                $modAppIdDom.change();
                $modAppVersionDom.val(data.appVersionId)
                if ($modAppVersionDom.val() == null) {
                    alert("삭제된 appVersion이 조건으로 배정되어있습니다. 조건과 현재 상태를 확인하세요 \n 조건의 appVersionId : "
                        + data.appVersionId);
                }
                $('#mod-assign-form #deviceModel').val(data.deviceModel);
                $('#mod-assign-form #osVersion').val(data.osVersion);
                $('#mod-assign-form #eversafeLibraryVersion').val(data.eversafeLibraryVersion);
                $('#mod-assign-form #priority').val(data.priority);
                $modAssignTargetDom.val(data.assignTarget);
                $modAssignTargetDom.change();
                $modModuleVersionDom.val(data.moduleVersion);

                var id = $('#mod-assign-form #id').val();
                if (id == 1|| id == 2||id == 3 ||id == 4) {
                    $('.mod-assign-input').attr('readonly', true);
                    $('.mod-assign-input option').not(":selected").attr('disabled','disabled')
                } else {
                    $('.mod-assign-input').attr('readonly', false);
                }
                $('#mod-module-assign-modal').modal('show');
            });

}
var initAppMap = function () {
    $.ajax({
        type: "GET",
        url: "/api/app/app-appVersion/list",
        async: false,
        success: function (returnValue) {
            console.log(returnValue)

            for (var key in returnValue) {
                appMap[returnValue[key].id] = returnValue[key].appName;
                appVersionListMap[returnValue[key].id]=returnValue[key].appVersionList;
                appOrganNameMap[returnValue[key].id]=returnValue[key].organ.organName;
                if(returnValue[key].deviceType.toLowerCase()=="android"){
                    androidApps[returnValue[key].id] = returnValue[key].appName;
                }else if(returnValue[key].deviceType.toLowerCase()=="ios"){
                    iosApps[returnValue[key].id] = returnValue[key].appName;
                }



            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
var initAppVersionMap = function () {
    $
        .ajax({
            type: "GET",
            url: "/api/app-version",
            async: false,
            success: function (appVersionList) {
                for (var key in appVersionList) {
                    appVersionMap[appVersionList[key].id] = appVersionList[key].appVersion;
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
}
var initModuleVersionMap = function () {
    $
        .ajax({
            type: "GET",
            url: "/api/super/module/normal/version",
            async: false,
            success: function (moduleVersionList) {
                console.log(moduleVersionList)
                for (var key in moduleVersionList) {
                    if(moduleVersionList[key]["deviceType"].toLowerCase()=='android'){
                        if(moduleVersionList[key].enabled==true&&moduleVersionList[key].isFileDeleted==false){
                            androidVersionMap[moduleVersionList[key].id] = moduleVersionList[key].version;
                        }
                    }else{
                        iosVersionMap[moduleVersionList[key].id] = moduleVersionList[key].version;
                    }
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
}

jQuery(document).ready(function () {
    initModuleVersionMap();
    initAppMap();
    initAppVersionMap();
    initassignList();
    modalInit();
    eventInit();
});
var updateGlobalModuleTerm = function () {
    var result;
    var termSec = $("#termSec").val();
    $.ajax({
        url: '/api/super/module/globalModuleTerm/put',
        type: "POST",
        async: false,
        data: JSON.stringify(termSec),
        contentType: "application/json; charset=utf-8",
        success: function (returnValue) {
            alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
            location.reload();
        },
        error: function (e) {
            alert(e.responseJSON.message);
            console.log(e);
        }
    });
    return result;
}