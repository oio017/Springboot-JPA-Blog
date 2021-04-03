$scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>');
;
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/scripts/jjsonviewer.js"></script>');

var table = $('#module-table');
var table2 = $('#detail-table');
var oTable;
var vTable;
var appVersionMap = new Object();
var moduleCountMap = new Object();
var activeModuleCountMap = new Object();
var organNameMap = new Object();
var startDate;
var endDate;
var searchColumn = "";
var searchKeyword = "";


var inquireToServer = function () {
    $.ajax({
        url: '/api/super/module/normal/version/ios',
        type: 'GET',
        async:false,
        success: function (result) {
            console.log(result)
            makeTable(result);
        },
        error: function (e) {
            alert('error : ' + e.responseJSON.message);
            console.log(e);
        }
    });
};
var initAppVersionMap = function () {
    $.ajax({
        url: '/api/super/module/normal/appVersionMap/ios',
        type: 'GET',
        async:false,
        success: function (result) {
            console.log(result)
            appVersionMap=result;
        },
        error: function (e) {
            alert('error : ' + e.responseJSON.message);
            console.log(e);
        }
    });
};
var initModuleCountMap = function () {
    $.ajax({
        url: '/api/super/module/normal/count',
        type: 'GET',
        async:false,
        success: function (result) {
            console.log(result)
            moduleCountMap=result;
        },
        error: function (e) {
            alert('error : ' + e.responseJSON.message);
            console.log(e);
        }
    });
};
var initActiveModuleCountMap = function () {
    $.ajax({
        url: '/api/super/module/normal/activeCount',
        type: 'GET',
        async:false,
        success: function (result) {
            console.log(result)
            activeModuleCountMap=result;
        },
        error: function (e) {
            alert('error : ' + e.responseJSON.message);
            console.log(e);
        }
    });
};
var initOrganMap = function () {
    $.ajax({
        url: '/api/globalOrganIdAndNames',
        type: 'GET',
        async:false,
        success: function (result) {
            organNameMap=result;
        },
        error: function (e) {
            alert('error : ' + e.responseJSON.message);
            console.log(e);
        }
    });
};

var InitFunction = function () {
    return {
        table: function () {
            var mainTable = function () {
                inquireToServer();
                var nEditing = null;
                var nNew = false;
                // add-app
                $('#module-info').click(function (e) {
                    e.preventDefault();
                    $('#module-info-modal').modal();
                });

                // 정보 수정 submit
            }
            return {
                // main function to initiate the module
                init: function () {
                    mainTable();
                }
            };
        },
        clickEventInit: function () {
            $('#module-search-button').click(function (e) {
                e.preventDefault();
                inquireToServer();
            });


        },
        keyButtonEventInit: function () {
            $("#submitTermSec").click(function () {
                if (confirm("전역 모듈 간격을 업데이트 하시겠습니까?")) {
                    var result = updateGlobalModuleTerm();
                }
            });
        },
        moduleTermInit: function () {
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
        },


        init: function () {
            this.keyButtonEventInit();
            this.table().init();
            // this.initCreateTable()
            this.clickEventInit();
            this.moduleTermInit();
        }
    }
}();

$(document).ready(
    function () {
        initAppVersionMap();
        initModuleCountMap();
        initActiveModuleCountMap();
        // initAppVersionCountMap();
        initOrganMap();
        InitFunction.init();
        $('#startDate, endDate').change(function () {
            oTable.draw();
        });
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


function makeTable(returnValue) {
    oTable = table
        .DataTable({
            buttons: [],
            data: returnValue,
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
            columns: [null, null, null, null,null,null],
            "columnDefs": [
                {
                    'data': function (row, type, val, meta) {
                        return row.version;
                    },
                    'targets': ['tbl-version'],
                },
                {
                    'data': function (row, type, val, meta) {
                        var result = "";
                        var count =moduleCountMap[row.id];
                        var activeCount =activeModuleCountMap[row.id]==undefined?0:activeModuleCountMap[row.id];
                        if(result==null){
                            result = "N/A";
                        }else{
                            result = activeCount+"/"+count
                        }
                        return result;

                    },
                    'targets': ['tbl-numberOfModules']
                },
                {
                    'data': function (row, type, val, meta) {

                        var appCount =appVersionMap[row.id];
                        var result = ""
                        if (appCount != undefined) {
                            result = '<a href="javascript:;" class="appVersionModalButton">' + appCount.length + '</a>';
                        }else{
                            result = "0";
                        }
                        // if(appCount==null){
                        // }

                        return result;
                    },
                    'targets': ['tbl-relatedAppCount']
                },
                {
                    'data': function (row, type, val, meta) {
                        var result = ""
                        if(row.isFileDeleted==1){
                            result=getMessage('modaule.cleaned', '정리됨');
                        }else{
                            result='-';
                        }

                        return result;
                    },
                    'targets': ['tbl-whetherToArrange']
                },
                {
                    'data': function (row, type, val, meta) {
                        return timeFormat(row.regDate);
                    },
                    'targets': ['tbl-regDate']
                },
                {
                    'render': function (data, type, row, meta) {
                        var result = '';
                        var buttons = [];
                        buttons.push("<button class='btn btn-sm blue btn-outline normal-detail-button'>" + getMessage('module.list', '모듈 목록') + "</button>");
                        if(row.isFileDeleted==0){
                            buttons.push("<button class='btn btn-sm blue btn-outline normal-fileDelete-button'>" + getMessage('common.FileClean', '파일 정리') + "</button>");
                            buttons.push("<button class='btn btn-sm green btn-outline normal-randomGetModule-button'>" + getMessage('common.download', '다운로드') + "</button>");
                        }
                        buttons.push("<button class='btn btn-sm red btn-outline normal-delete-button'>" + getMessage('common.remove', '삭제') + "</button>");
                        result += buttons.join("&nbsp;&nbsp;");
                        return result;
                    },
                    'targets': ['tbl-etc']
                }
            ],
            dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            "order": [[2, "desc"]]
        });
    table.on("click",".normal-detail-button", function(e){
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        location.href="/super/module/ios/normal/"+data.version;
    })
    table.on("click",".appVersionModalButton", function(e){
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        console.log(data)
        makeTable2(data);
        $('#module-info-modal').modal('show');
        e.preventDefault();
    })
    table.on("click",".normal-randomGetModule-button", function(e){
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        console.log(data)
        var isGoodCount = false;
        var count = -1
        while(!isGoodCount){
            var tempInputValue = prompt(getMessage("module.inputCountOfModules","무작위로 다운로드할 모듈의 개수를 입력하세요."),"0");
            if(tempInputValue==null){
                break;
            }
            tempInputValue = parseInt(tempInputValue)
            if(isNaN(tempInputValue)) {
                alert(getMessage("module.pleaseOnlyInputNumber", "숫자만 입력하세요"));
            }else if(tempInputValue<1){
                alert(getMessage("module.pleaseInputGreaterThan0","입력값은 0보다 커야 합니다."))
            }else if(tempInputValue>activeModuleCountMap[data.id]){
                alert(getMessage("module.inputCountIsGreaterThanExists", "입력한 숫자가 존재하는 모듈 개수보다 큽니다."));
            }else{
                count = tempInputValue;
                isGoodCount=true
                window.location='/api/download/module/normal/ios/'+data.version+'/random/'+count
            }
        }
    });

    table.on("click",".normal-fileDelete-button", function(e){
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        var version = data["version"];
        var allDataList = oTable.data();// table 데이터
        var maxVersion = version;
        // 가장 높은 버전을 찾기
        var allDataLength = allDataList.length;

        for (var i = 0; i < allDataLength; i++) {
            var targetData = allDataList[i];// Object 반환 array 아님
            var compareVersion = targetData["version"]

            if (compareVersion > maxVersion) {
                maxVersion = compareVersion
            }
        }

        if (version == maxVersion) {
            var firstConfirm = confirm("최신 버전의 모듈의 파일을 정리할 경우 래핑을 할 수 없습니다.\n그래도 진행하시겠습니까?");
            if (firstConfirm == true) {
                if (confirm("삭제 시 복구할 수 없습니다. 그래도 진행하시겠습니까?") == false) {
                    return false;
                }

            } else {
                return false;
            }
        } else if (version < maxVersion) {
            var secondConfirm = confirm("삭제 시 복구할 수 없습니다. 그래도 진행하시겠습니까?");
            if (secondConfirm == false) {
                return false;
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/super/module/normal/' + data.id + '/file/delete',
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

    })
    table.on("click",".normal-delete-button", function(e) {
        e.preventDefault();
        if (confirm(getMessage('common.deleteConfirmMessage', '삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == true) {
            if (confirm(getMessage('common.moduleDeleteConfirmMessage', '파일이 삭제될 경우 해당 버전의 모듈은 새로 등록될 수 없습니다. 그래도 삭제하시겠습니까?')) == false) {
                return false;
            }
        }
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        if (appVersionMap[data.id] != undefined) {
            alert(getMessage('module.relatedAppVersionExist', '연결된 앱 버전이 있어 삭제할 수 없습니다.'));
        }else{
            $.ajax({
                type: 'POST',
                url: '/api/super/module/normal/' + data.id + '/delete',
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
                    if(e.responseJSON.code=="ApiServerErrorException"){
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
         }


    })
}
var makeTable2 = function(rowData){
    appVersionData = appVersionMap[rowData.id];
    vTable =table2.DataTable({
        destroy:true,
        buttons: [],
        data: appVersionData,
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
        columns: [null, null, null, null,null],
        "columnDefs": [
            {
                'data': function (row, type, val, meta) {
                    return organNameMap[row.organId];
                },
                'targets': ['tbl-organName'],
            },
            {
                'data': function (row, type, val, meta) {
                    return row.packageName;
                },
                'targets': ['tbl-package']
            },
            {
                'data': function (row, type, val, meta) {
                    return row.appName;
                },
                'targets': ['tbl-appName']
            },
            {
                'data': function (row, type, val, meta) {
                    return row.deviceType;
                },
                'targets': ['tbl-deviceType']
            },
            {
                'data': function (row, type, val, meta) {
                    return row.basicModuleUuid;
                },
                'targets': ['tbl-uuid']
            },
            {
                'data': function (row, type, val, meta) {
                    return row.appVersion;
                },
                'targets': ['tbl-version']
            }
        ],
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>"
            + "<'row'<'col-sm-12'tr>>"
            + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "order": [[3, "desc"]]
    });
}

