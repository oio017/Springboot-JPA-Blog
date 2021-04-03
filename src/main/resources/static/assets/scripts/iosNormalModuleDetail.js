var $scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>');
;
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/scripts/jquery.spring-friendly.js"></script>');

var table = $('#module-table');
var table2 = $('#detail-table');
var oTable;
var vTable;
var startDate;
var endDate;
var organId;
var appId;
var organNames;
var searchColumn = "";
var searchKeyword = "";
var appVersionMap = new Object();
var appNameMap = new Object();


var blockingLabelMap = {
    ""				: getMessage("common.normal", "정상"),
    "blacklist" 	: getMessage("common.block", "차단"),
    "loss_device" 	: getMessage("common.lost", "분실")
}

var getBlockingLabelFromRow = function(content, labelOnNormal){
    var blockingType = "";

    if(content == null) {
        content = "";
    }

    blockingType = blockingLabelMap[content];

    if(blockingType == undefined){
        blockingType = "";
    }

    return blockingType;
}



var testUnitStringMap = {
    'D': 'Year',
    'M': 'Month',
    'Y': 'Day'
}

var test = function(obj){
    start = obj[0], end = obj[1], period = obj[2], unit = obj[3];
    var res = checkDateGapIfShorterThanOrEqualsToPeriod(start, end, period, unit);
    var unitString = testUnitStringMap[unit] + (period == 1 ? '' : 's');
}

var getQueryData = function() {
    var data = $('#search-params').serializeJSON();

    searchReq = new Object;
    searchReq.searchColumn	=	$('#search_column').val();
    searchReq.searchKeyword		=	$('#connection-search-input').val();
    return searchReq;
}

var inquireToServer = function(){
    var query = getQueryData();
    makeTable();

    // $.ajax({
    // 	url:'/api/log/connection',
    // 	data:query,
    // 	type:'GET',
    // 	success:function(result){
    // 		makeTable(result);
    // 	}
    // });
};


var InitFunction = function() {

    return {
        table : function() {
            var mainTable = function() {
                inquireToServer();

                var nEditing = null;
                var nNew = false;
                // add-app
                $('#log-info').click(function(e) {
                    e.preventDefault();
                    $('#log-info-modal').modal();
                });

                // 정보 수정 submit
            }
            return {
                // main function to initiate the module
                init : function() {
                    mainTable();
                }
            };
        },
        modalInit : function() {
            // 조회 클릭 시

            table.on('click', '.normal-inactivate-button', function(e){
                e.preventDefault();
                if(confirm(getMessage('module.doYouWantToMakeThisModuleInactive','해당 모듈을 비활성화 하시겠습니까?'))){
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $.ajax({
                        url:'/api/super/module/normal/inactivate/'+data.id.versionId+'/'+data.id.id,
                        type:'POST',
                        success:function(result){
                            alert(getMessage('common.applyComplete','적용이 완료되었습니다.'));
                            location.reload();
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
                }
            });
            table.on('click', '.normal-activate-button', function(e){
                console.log('$(\'.normal-activate-button\').click(function(e){')
                e.preventDefault();
                if(confirm(getMessage('module.doYouWantToMakeThisModuleActive','해당 모듈을 활성화 하시겠습니까?'))){
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $.ajax({
                        url:'/api/super/module/normal/activate/'+data.id.versionId+'/'+data.id.id,
                        type:'POST',
                        success:function(result){
                            alert(getMessage('common.applyComplete','적용이 완료되었습니다.'));
                            location.reload();
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
                }
            });
            table
                .on(
                    'click',
                    '.related-app-button',
                    function(e) {
                        e.preventDefault();
                        var nRow = $(this).parents('tr')[0];
                        var data = oTable.row(nRow).data();
                        var keys = Object.keys(data);
                        $.ajax({
                            url:'/api/super/module/normal/relatedAppVersion/'+data.id.versionId+'/'+data.id.id,
                            type:'GET',
                            success:function(result){
                                makeTable2(result);
                            },
                            error: function(e){
                                console.log(e)
                            }
                        });
                        $('#module-info-modal').modal('show');

                    });

            // table.on("click",".related-app-button", function(e){
            //     e.preventDefault();
            //     var nRow = $(this).parents('tr')[0];
            //     var data = oTable.row(nRow).data();
            //     // $('#detail-uuid').text(data.moduleUuid);
            //     // $('#detail-download').html('<a href="/api/download/module/basic/'+ data.moduleUuid+'">'+getMessage('common.download','다운로드')+"</a>");
            //     // $('#detail-version').text(data.version);
            //     // $('#detail-regDate').text(timeFormat(data.regDate));
            //     makeTable2(data);
            //     $('#module-info-modal').modal('show');
            //
            // })

        },
        clickEventInit: function(){
            $('#connection-search-button').click(function(e){
                e.preventDefault();
                inquireToServer();
            });


            $('#connection-search-input').keypress(function (e) {
                if(e.keyCode == 13){
                    e.preventDefault();
                    inquireToServer();
                    e.returnValue = false;
                }
            });



        },
        init : function() {
            this.table().init();
            // this.initCreateTable()
            this.modalInit();
            this.clickEventInit();
        }
    }
}();

$(document).ready(
    function() {
        // initOrganNameList();
        // appListInit();
        // appVersionMapInit();
        InitFunction.init();
        $('#startDate, endDate').change(function() {
            oTable.draw();
        });
    });

function makeTable(returnValue){
    oTable = table
        .DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url" : "/api/super/module/normal/ios/" + $("#version").val(),
                "data" : function (data){
                    getQueryData()
                    // data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
                    data.appId = searchReq.appId;
                    data.organId = searchReq.organId;
                    data.searchColumn = searchReq.searchColumn;
                    data.keyword = searchReq.searchKeyword;
                    data.blocks = searchReq.blocks;
                    data.detects = searchReq.detects;
                    data.deviceUniqueByDeviceId= searchReq.deviceUniqueByDeviceId;
                    data.startDate=searchReq.startDate;
                    data.tomorrowEndDate=getTommorowStart(searchReq.endDate);
                    console.log(data)
                    console.log(searchReq);
                },
                "type" : "GET",
                // "success" : function(data){
                // //console.log(data)
                // 	return data;
                // }
            },
            destroy : true,
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
            // data : returnValue,
            columns : [ {
                "data": 'normalModuleVersionEntity.version',
            }, {
                "data": 'moduleUuid',
            }, null, null,null,null],
            "columnDefs" : [

                {
                    'data': function (row, type, val, meta) {
                        return row.normalModuleVersionEntity.version;
                    },
                    orderable : false,
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

                        return row.id;
                    },
                    'render': function (data, type, row, meta) {
                        if(row.normalModuleVersionEntity.isFileDeleted==0){
                            return '<a href="/api/download/module/normal/'+data.versionId+'/' + data.id+ '">Download</a>';
                        }else{
                            return 'deleted';
                        }
                    },
                    "searchable" : false,
                    orderable : false,
                    'targets': ['tbl-download']
                },
                {
                    'data': function (row, type, val, meta) {
                        if(row.isActive==1){
                            return getMessage('common.active','활성');

                        }else{
                            return getMessage('common.inactive', '비활성');

                        }
                    },
                    "searchable" : false,
                    orderable : false,
                    'targets': ['tbl-status']
                },
                {
                    'render': function (data, type, row, meta) {
                        var result = "";
                        if(row.isActive==1){
                            result = "<button class='btn btn-sm blue btn-outline normal-inactivate-button'>" + getMessage('common.inactivate', '비활성화') + "</button>";
                        }else{
                            result = "<button class='btn btn-sm blue btn-outline normal-activate-button'>" + getMessage('common.activate', '활성화') + "</button>";
                        }
                        return result;
                    },
                    "searchable" : false,
                    "orderable" : false,
                    'targets': ['tbl-etc']
                },
                {
                    'render': function (data, type, row, meta) {
                        var result = "";
                        result = "<button class='btn btn-sm blue btn-outline related-app-button'>" + getMessage('common.relatedAppVersion', '연결된 앱 버전') + "</button>";
                        return result;
                    },
                    "searchable" : false,
                    "orderable" : false,
                    'targets': ['tbl-relatedApp']
                },{
                    "searchable" : false,
                    targets : [0]
                }
                ],
            "order" : [ [ 1, "desc" ] ],
            dom : "<'row'<'col-sm-6'l><'col-sm-6'>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});

    setDatatableAjaxErrorHandleForModule();

}

var makeTable2 = function(detailData){

    vTable =table2.DataTable({
        destroy : true,
        buttons: [],
        data: detailData,
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

