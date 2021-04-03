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
var organNameMap = new Object();
var startDate;
var endDate;
var searchColumn = "";
var searchKeyword = "";


var inquireToServer = function () {
    $.ajax({
        url: '/api/super/module/basic/ios',
        type: 'GET',
        success: function (result) {
            makeTable(result);
        },
        error: function (e) {
            alert('error : ' + e.responseJSON.message);
            console.log(e);
        }
    });
};
var initAppversionMap = function () {
    $.ajax({
        url: '/api/super/module/basic/appVersionMap/ios',
        type: 'GET',
        async:false,
        success: function (result) {
            appVersionMap=result;
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
                if (confirm(getMessage('module.doYouWantToUpdateGlobalModuleTerm',
                    "전역 모듈 간격을 업데이트 하시겠습니까?"))) {
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
        initAppversionMap();
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
            columns: [null, null, null, null,null],
            "columnDefs": [
                {
                    'data': function (row, type, val, meta) {
                        return row.version;
                    },
                    'targets': ['tbl-version'],
                },
                {
                    'data': function (row, type, val, meta) {
                        return row.moduleUuid;
                    },
                    'targets': ['tbl-uuid']
                },
                {
                    'data': function (row, type, val, meta) {
                        // console.log(appVersionMap[row.moduleUuid])
                        if(appVersionMap[row.moduleUuid]==null){
                            return 0;
                        }else{
                            return appVersionMap[row.moduleUuid].length;
                        }
                    },
                    'targets': ['tbl-relatedAppCount']
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
                        buttons.push("<button class='btn btn-sm blue btn-outline basic-detail-button'>" + getMessage('common.details', '상세') + "</button>");
                        buttons.push("<button class='btn btn-sm red btn-outline basic-delete-button'>" + getMessage('common.remove', '삭제') + "</button>");
                        result += buttons.join("&nbsp;&nbsp;");
                        return result;
                    },
                    'targets': ['tbl-etc']
                }
            ],
            dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            "order": [[1, "desc"]]
        });
    table.on("click",".basic-detail-button", function(e){
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        $('#detail-uuid').text(data.moduleUuid);
        $('#detail-download').html('<a href="/api/download/module/basic/'+ data.moduleUuid+'">'+getMessage('common.download','다운로드')+"</a>");
        $('#detail-version').text(data.version);
        $('#detail-regDate').text(timeFormat(data.regDate));
        makeTable2(data);
        $('#module-info-modal').modal('show');

    })
    table.on("click",".basic-delete-button", function(e){
        e.preventDefault();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        if(appVersionMap[data.moduleUuid]!=undefined){
            alert(getMessage('module.relatedAppVersionExist','연결된 앱 버전이 있어 삭제할 수 없습니다.'));
        }else {
            $.ajax({
                type : 'POST',
                url : '/api/super/module/basic/'+data.moduleUuid+'/delete',
                contentType : "application/json; charset=utf-8",
                data : JSON.stringify(data),
                async : false,
                success : function(returnValue) {
                    alert(getMessage('common.removeComplete','삭제 완료'));
                    location.reload();
                    // vTable.row(nRow).remove().draw();
                },
                error : function(e) {
                    console.log(e)
                    if(e.responseJSON.code=="ApiServerErrorException"){
                        alert(e.responseJSON.message);
                        location.reload();
                    }
                    if(e.responseJSON.exception=="java.io.FileNotFoundException"){
                        alert(getMessage('log.osForgeryDetails.fileNotFound','파일 없음'));
                    }else{
                        alert(e.responseJSON.message);
                    }
                }
            });
        }


    })
}
var makeTable2 = function(rowData){
    appVersionData = appVersionMap[rowData.moduleUuid];
    console.log(appVersionData)
    if(appVersionData==undefined){
        appVersionData=[];
    }
    vTable =table2.DataTable({
        destroy : true,
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
                    return row.organName;
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

