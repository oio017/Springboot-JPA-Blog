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

var table = $('#server-module-table');
var oTable;
var vTable;
var startDate;
var endDate;
var searchColumn = "";
var searchKeyword = "";

var inquireToServer = function () {
    $.ajax({
        url: '/api/super/module/server',
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
    console.log(returnValue)
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
                        return row.patchVersion;
                    },
                    'targets': ['tbl-patchVersion']
                },
                {
                    'data': function (row, type, val, meta) {
                        return row.deviceType;
                    },
                    'targets': ['tbl-deviceType']
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
                        buttons.push("<button class='btn btn-sm red btn-outline server-module-delete-button'>" + getMessage('common.remove', '삭제') + "</button>");
                        result += buttons.join("&nbsp;&nbsp;");
                        return result;
                    },
                    'targets': ['tbl-etc']
                }
            ],
            dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            "order": [[3, "desc"]]
        });
    table.on("click",".server-module-delete-button", function(e){
        var keepGoingBoolean = true;
        e.preventDefault();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        console.log('/api/super/module/server/latestVersion/'+data.deviceType)
        $.ajax({
            type:'GET',
            url:'/api/super/module/server/latestVersion/'+data.deviceType,
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (returnValue) {
                console.log
                if(data.version==returnValue.version){
                    if(data.patchVersion==returnValue.patchVersion){
                        if(confirm(getMessage('common.latestVersion','현재 사용중인 가장 최신버전 모듈입니다. 그래도 삭제하시겠습니까?'))==false){
                            keepGoingBoolean = false;
                        }
                    }
                }
            },
            error: function (e) {
                alert(e.responseJSON.message);
            }

        })
        if(!keepGoingBoolean){
            return false;
        }
        $.ajax({
            type : 'POST',
            url : '/api/super/module/server/'+data.id+'/delete',
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

    })
}

