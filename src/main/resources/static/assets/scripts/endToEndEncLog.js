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

var table = $('#endToEndEnc-table');
var oTable;
var vTable;
var startDate;
var endDate;
var searchColumn = "";
var searchKeyword = "";
var test;
var appId;
var organId;
var organNames;
var username = $('.dropdown-user .username').text();
var appVersionMap = new Object();
var appNameMap = new Object();
var appListInit = function () {
    var data = new Object;
    data.organId = organId;
    $.ajax({
        type: 'GET',
        url: '/api/app/list',
        data: data,
        async: false,
        success: function (appList) {
            appId = $("#app-list-label").data("appid");
            var result = "<option value=''> " + getMessage("common.allApps", "전체 앱") + "</option>";
            for (var i = 0; i < appList.length; i++) {
                appNameMap[appList[i].id] = appList[i].appName;
                if (appList[i].id == appId) {
                    result += '<option value="' + appList[i].id + '" selected="selected" >' + appList[i].appName + '</option>'
                } else {
                    result += '<option value="' + appList[i].id + '">' + appList[i].appName + '</option>'
                }
            }
            $('#app-list').html("");
            $('#app-list').html(result);

            $('#app-list').change(function () {
                appId = $(this).val();
                //chartInit();

            });
            //$('.selectpicker').selectpicker('render');
        },
        error: function (e) {
            alert(e.responseJSON.message);
        }

    });
}
var appVersionMapInit = function () {
    var data = new Object;
    data.organId = organId;
    $.ajax({
        type: 'GET',
        url: '/api/app-version',
        data: data,
        async: false,
        success: function (appVersionList) {
            for (var key in appVersionList) {
                appVersionMap[appVersionList[key].id] = appVersionList[key].appVersion;
            }
        },
        error: function (e) {
            alert(e.responseJSON.message);
        }

    });
}
var initOrganNameList = function () {
    $.ajax({
        type: 'GET',
        url: '/api/chart/organ',
        success: function (returnValue) {
            organNames = returnValue;
            $(returnValue).each(function (i) {
                if (returnValue[i].id <= 0) {

                } else {
                    $('#organ-select').append('<option value="' + returnValue[i].id + '">' + returnValue[i].organName + '</option>')
                }
            });
        },
        error: function (e) {
            alert(e.responseJSON.message);
        }

    });
}
var blockingLabelMap = {
    "": getMessage("common.normal", "정상"),
    "blacklist": getMessage("common.block", "차단"),
    "loss_device": getMessage("common.lost", "분실")
}

var getBlockingLabelFromRow = function (content, labelOnNormal) {
    var blockingType = "";

    if (content == null) {
        content = "";
    }

    blockingType = blockingLabelMap[content];

    if (blockingType == undefined) {
        blockingType = "";
    }

    return blockingType;
}


var testUnitStringMap = {
    'D': 'Year',
    'M': 'Month',
    'Y': 'Day'
}


var getQueryData = function (result) {
    var data = $('#search-params').serializeJSON();

    searchReq = new Object;
    searchReq.appId = data.appId;
    searchReq.organId = data.organId;
    searchReq.startDate = getStartDate(data.startDate);
    searchReq.endDate = getEndDate(data.endDate);
    searchReq.searchColumn = $('#search_column').val();
    searchReq.searchKeyword = $('#endToEndEnc-search-input').val();

    var start = getStartDate(data.startDate);
    var end = getEndDate(data.endDate);
    return searchReq;
}

var inquireToServer = function () {
    var startDate = getStartDate($('#startDate').val());
    var endDate = getEndDate($('#endDate').val());
    var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');

    if (!isPeriodOk) {
        alert(getMessage('log.search.periodMessage', '검색 기간의 최대 범위는 1개월 입니다.'));
    }
    else {
        var query = getQueryData();
        makeTable();
        // $.ajax({
        //     url: '/api/log/endToEndEnc',
        //     data: query,
        //     type: 'GET',
        //     success: function (result) {
        //         makeTable(result);
        //     }
        // });
    }
};

var isLeapYear = function (year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

var checkDateGapIfShorterThanOrEqualsToPeriod = function (start, end, period, unit) {
    start = getStartDate(start);
    end = getEndDate(end);

    var yearDiff = end.getFullYear() - start.getFullYear();
    var monthDiff = (yearDiff > 0) ? (end.getMonth() - start.getMonth() + 12) : (end.getMonth() - start.getMonth());
    var dayDiff = getDaysDifference(start, end);

    var res = false;

    switch (unit) {
        case 'D': {
            res = (dayDiff <= period);
            break;
        }

        case 'M': {
            res = (monthDiff < period || dayDiff <= (period * 30));
            break;
        }

        case 'Y': {
            var leapYears = 0;
            for (sy = start.getFullYear(), ey = end.getFullYear(); sy <= ey; ++sy) {
                if (isLeapYear)
                    ++leapYears;
            }

            res = (yearDiff < period || dayDiff <= ((period * 365) + leapYears));
            break;
        }

    }
    return res;
}

var InitFunction = function () {

    return {
        initSearhDate: function () {
            // 처음 로딩시 가져올 날짜 세팅
            // 오늘을 기준으로 계산
            // 오늘을 기준으로 이틀 전
            startDate = getStartDate();
            endDate = getEndDate();
            setCurrentDateRange(startDate, endDate);
        },

        initDashboardDaterange: function () {
            if (!jQuery().daterangepicker) {
                return;
            }

            $('#dashboard-report-range')
                .daterangepicker(
                    {
                        "locale": {
                            "format": "YYYY. MM. DD.",
                            "separator": " - ",
                            "applyLabel": getMessage("common.apply", "적용"),
                            "cancelLabel": getMessage("common.cancel", "취소"),
                            "fromLabel": "From",
                            "toLabel": "To",
                            "customRangeLabel": "Custom",
                            "weekLabel": "W",
                            "daysOfWeek": [getMessage("common.dayOfWeek.sun", "일"), getMessage("common.dayOfWeek.mon", "월"), getMessage("common.dayOfWeek.tue", "화"), getMessage("common.dayOfWeek.wed", "수"), getMessage("common.dayOfWeek.thu", "목"),
                                getMessage("common.dayOfWeek.fri", "금"), getMessage("common.dayOfWeek.sat", "토")],
                            "monthNames": [getMessage("common.monthOfYear.jan", "1월"), getMessage("common.monthOfYear.feb", "2월"), getMessage("common.monthOfYear.mar", "3월"), getMessage("common.monthOfYear.apr", "4월"),
                                getMessage("common.monthOfYear.may", "5월"), getMessage("common.monthOfYear.jun", "6월"), getMessage("common.monthOfYear.jul", "7월"), getMessage("common.monthOfYear.aug", "8월"), getMessage("common.monthOfYear.sep", "9월"),
                                getMessage("common.monthOfYear.oct", "10월"), getMessage("common.monthOfYear.nov", "11월"), getMessage("common.monthOfYear.dec", "12월")],
                            "firstDay": 1
                        },
                        "startDate": startDate,
                        "endDate": endDate,
                    },
                    function (start, end, label) {
                        if (moment() < moment(endDate).subtract('days', 1)) {
                            alert(getMessage("common.datePicker.overDatePickedErrorMessage", "오늘 이후날자로는 검색할수 없습니다."));
                            return;
                        }

                        var startDate = getStartDate(start);
                        var endDate = getEndDate(end);
                        setCurrentDateRange(startDate, endDate);

                    });
            $('#dashboard-report-range').show();
            $('#dashboard-report-range').bind('click.leftButton', function () {
                $(".calendar-table .fa-angle-left").click();
                $('#dashboard-report-range').unbind('.leftButton');
            });
        },
        table: function () {
            var mainTable = function () {
                inquireToServer();
                var nEditing = null;
                var nNew = false;
                // add-app
                $('#log-info').click(function (e) {
                    e.preventDefault();
                    $('#log-info-modal').modal();
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
        modalInit: function () {
            // 조회 클릭 시
            table
                .on(
                    'click',
                    '.log-info',
                    function (e) {
                        e.preventDefault();
                        $('#log-info-modal').modal('show');
                        var nRow = $(this).parents('tr')[0];
                        var data = oTable.row(nRow).data();
                        for (var i in organNames) {
                            if (data.organId == organNames[i].id) {
                                data.organName = organNames[i].organName
                            }
                        }
//								data.organName=organNames
                        //따옴표 표기 형식 치환
                        if(data.message!=null){
                            data.message = data.message.replace(/&#39;/g, "'");
                        }
                        var keys = Object.keys(data);

                        var elemId = "";
                        var content = "";


                        for (var item in keys) {
                            elemId = keys[item];
                            content = data[elemId];
                            if (elemId == "blockingType") {
                                content = getBlockingLabelFromRow(content, getMessage("log.blockingType.normalDevice", "정상 기기"));
                            }

                            if ($('#' + elemId).length > 0) {
                                $('#' + elemId).text(content);
                            }
                        }

                        var time = $('#createdAt').text();
                        $('#createdAt').text(timeFormat(Number(time)));


                        /*
                        if(username=="everspin@everspin.co.kr"){
                            $('#token-specific').removeClass("hidden");
                            $('#specific').html('')
                            var tableHtml;
                            var td ="";
                            var th ="";
                            var detail = JSON.parse(data.descDetail)
                            $.each(detail, function(key, val) {
                                th +='<th>'+key+'</th>';
                                td +='<td>'+val+'</td>';
                            });
                            $('#specific').html('<table class="table"><tr>'+th+'</tr><tr>'+td+'</tr></table>')
//
//									$('#specific').html('<table class="table">'
//											+ '<tr><th>토큰 레벨</th><th>에러</th><th>모드</th>'
//											+ '<th>API 프로토콜 1</th><th>API 응답 1</th><th>API tick 1</th>'
//											+ '<th>API 프로토콜 2</th><th>API 응답 2</th><th>API tick 2</th>'
//											+ '<tr><td>' + data.tokenLevel
//											+ '</td><td>' + data.tokenError
//											+ '</td><td>' + data.apiMode
//											+ '</td><td>' + data.apiProtocol_1
//											+ '</td><td>' + data.apiResponse_1
//											+ '</td><td>' + data.apiTick_1
//											+ '</td><td>' + data.apiProtocol_2
//											+ '</td><td>' + data.apiResponse_2
//											+ '</td><td>' + data.apiTick_2
//
//											+'</table>'
//									)
                        }else{

                        }
                        */

                    });

        },
        clickEventInit: function () {
            $('#organ-select').change(function () {
                organId = $(this).val();
                appListInit();
            });
            $('#endToEndEnc-search-button').click(function (e) {
                var col = $('#search_column').val();
                if (col == 'status'||col == 'encKeyIdx'||col=='seq'||col=='blocked'||col=='encKeyListVer') {
                    if (!isInteger($('#endToEndEnc-search-input').val())) {
                        alert(getMessage('log.search.onlyIntegerWhenThisCondition', '선택하신 검색 조건은 정수만 입력 가능 합니다.'));
                        return false;
                    }
                    if($('#endToEndEnc-search-input').val()>2147483647||$('#endToEndEnc-search-input').val()<-2147483648){
                        alert(getMessage('log.search.onlyIntegerRange', '선택하신 검색 조건은 -2147483648에서 2147483647 사이의 값이어야만 합니다.'));
                        return false;
                    }

                }
                if($('#search_column').val()=='')
                e.preventDefault();
                inquireToServer();
            });

            $('#endToEndEnc-search-input').keypress(function (e) {
                var col = $('#search_column').val();
                if (e.keyCode == 13) {
                    e.preventDefault();
                    if (col == 'status'||col == 'encKeyIdx'||col=='seq'||col=='blocked'||col=='encKeyListVer') {
                        if (!isInteger($('#endToEndEnc-search-input').val())) {
                            alert(getMessage('log.search.onlyIntegerWhenThisCondition', '선택하신 검색 조건은 정수만 입력 가능 합니다.'));
                            return false;
                        }
                        if($('#endToEndEnc-search-input').val()>2147483647||$('#endToEndEnc-search-input').val()<-2147483647){
                            alert(getMessage('log.search.onlyIntegerRange', '선택하신 검색 조건은 -2147483648에서 2147483647 사이의 값이어야만 합니다.'));
                            return false;
                        }
                    }
                    inquireToServer();
                    e.returnValue = false;
                }
            });
        },
        init: function () {
            this.initSearhDate();
            this.initDashboardDaterange();
            this.table().init();
            // this.initCreateTable()
            this.modalInit();
            this.clickEventInit();
        }
    }
}();
function initCsvDownloadEvent(){
    $("#csv-download").click(function(e){
        getCsv();
    })
}

$(document).ready(
    function () {
        initOrganNameList();
        appListInit();
        appVersionMapInit();
        InitFunction.init();
        initCsvDownloadEvent();
        $('#startDate, endDate').change(function () {
            oTable.draw();
        });
        $('#search_column').change(function () {
            if ($(this).val() == 'status') {
                alert(getMessage('log.search.descriptorStatusRequiresCode', '토큰 상태는 코드를 입력해야 합니다.\n 정상 : 0 \n 비정상 : 1 \n 접속장애 : 2\n 시간초과 : 3\n'));
            }
            if ($(this).val() == 'blocked') {
                alert(getMessage('log.search.WhetherToBlockedRequiresCode', '차단 여부는 코드를 입력해야 합니다.\n 허용 : 0 \n 차단 : 1'));
            }
        });
    });

function getCsv(){
    getQueryData()
    var data = new Object();
    //data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
    data.appId = searchReq.appId;
    data.organId = searchReq.organId;
    data.searchColumn = searchReq.searchColumn;
    data.keyword = searchReq.searchKeyword;
    data.startDate = searchReq.startDate;
    data.tomorrowEndDate = getTommorowStart(searchReq.endDate);
    window.open("/api/log/endToEndEnc/csv?"+$.param(data), '_blank')
}

function makeTable(returnValue) {
    oTable = table
        .DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": "/api/log/endToEndEnc",
                "data": function (data) {
                    getQueryData();
                    // data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
                    data.appId = searchReq.appId;
                    data.organId = searchReq.organId;
                    data.searchColumn = searchReq.searchColumn;
                    data.keyword = searchReq.searchKeyword;
                    data.startDate = searchReq.startDate;
                    data.tomorrowEndDate = getTommorowStart(searchReq.endDate);
                    console.log(data)
                    console.log(searchReq);
                },
                "type": "GET",
                // "success" : function(data){
                // //console.log(data)
                // 	return data;
                // }
            },
            initComplete: function () {
                $(this).show();
            },
            destroy: true,
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
                data: "createdAt"
            }, {
                data: "appId"
            }, {
                data: "appVersionId"
            }, {
                data: "phoneNumber"
            }, {
                data: "deviceModel"
            }, {
                data: "osVersion"
            }, {
                data: "sdkVersion"
            }, {
                data: "filterVersion"
            }, {
                data: "networkType"
            }, {
                data: "deviceId"
            }, {
                data: "status"
            }, {
                data: "blocked"
            }, {data: "remoteAddr"}, null],
            "columnDefs": [
                { // set default column
                    // settings
                    'orderable': true,
                    render: function (data, type, row, meta) {
                        return timeFormat(row.createdAt);
                    },
                    "searchable": true,
                    'targets': [0]
                }, {
                    render: function (data, type, row, meta) {
                        return appNameMap[data] != undefined ? appNameMap[data] : 'N/A';
                    },
                    "searchable": false,
                    "targets": [1]
                },
                {
                    render: function (data, type, row, meta) {
                        return appVersionMap[data] != undefined ? appVersionMap[data] : 'N/A';
                        ;
                    },
                    "searchable": false,
                    "targets": [2]
                }, {
                    'visible': false,
                    'targets': [8, 9]
                },
                {
                    'render': function (data, type, row, meta) {
                        var result;
                        if (data == 0) {
                            result = getMessage('descriptor.normalToken0', '정상 (0)');
                        } else if (data == 1) {
                            result = getMessage('descriptor.abnormalToken1', '비정상 (1)');
                        } else if (data == 2) {
                            result = getMessage('descriptor.connectionFailure2', '접속 장애 (2)');
                        } else if (data == 3) {
                            result = getMessage('descriptor.connectionFailureToken3', '시간초과 (3)');
                        }else if(data == 4){
                            result = getMessage('descriptor.canceledToken4', '취소 토큰(4)');
                        }else if(data == 5){
                            result = getMessage('descriptor.basicToken5', '기본 토큰(5)');
                        }else if(data == 16){
                            result = getMessage('descriptor.bypassToken16', '바이패스 토큰(16)');
                        } else {
                            result = "N/A"
                        }

                        return result;
                    },
                    targets: [10]
                },
                {
                    'render': function (data, type, row, meta) {
                        result = "<button class='log-info'>" + getMessage('common.details', '상세') + "</button>"
                        return result;
                    },
                    targets: [13]
                },
                {
                    'render': function (data, type, row, meta) {
                        if (data == 1) {
                            return getMessage("common.block", "차단");
                        } else {
                            return getMessage("common.allow", "허용");
                        }
                    },
                    'visible': username == "everspin@everspin.co.kr",
                    targets: [11]
                },
                {
                    'visible': false,
                    targets: [12]
                },{
                    "searchable" : false,
                    targets : [1,2,3,4,5,6,7,8,9,10,11,12,13]
                },{
                    "orderable" : false,
                    targets : [1,2,10,11,13]
                }
            ],
            "order": [[0, "desc"]],
            dom: "<'row'<'col-sm-6'l><'col-sm-6'>>"
            + "<'row'<'col-sm-12'tr>>"
            + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        });

    setDatatableAjaxErrorHandle();
}
