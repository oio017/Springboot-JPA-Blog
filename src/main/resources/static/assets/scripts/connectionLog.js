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

var table = $('#connection-table');
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

var appListInit = function(){
    var data = new Object;
    data.organId = organId;
    appId="";
	$.ajax({
		type : 'GET',
		url : '/api/app/list',
        data : data,
		async:false,
		success : function(appList){
			appId=$("#app-list-label" ).data("appid");
			var result = "<option value=''>"+ getMessage('app.allApps','전체 앱')+"</option>" ;
			for(var i=0; i<appList.length; i++){
                appNameMap[appList[i].id] = appList[i].appName;
				if(appList[i].id==appId){
					result+='<option value="'+appList[i].id+'" selected="selected" >'+appList[i].appName+'</option>'
				}else{
					result+='<option value="'+appList[i].id+'">'+appList[i].appName+'</option>'
				}
			}
			$('#app-list').html("");
			$('#app-list').html(result);
			
			$('#app-list').change(function(){
				appId=$(this).val();
				//chartInit();
				
			});
			//$('.selectpicker').selectpicker('render');
		},
		error : function(e){
			alert(e.responseJSON.message);
		}
			
	});
}
var appVersionMapInit = function(){
    var data = new Object;
    data.organId = organId;
    $.ajax({
        type : 'GET',
        url : '/api/app-version',
        data : data,
        async:false,
        success : function(appVersionList){
            for(var key in appVersionList){
                appVersionMap[appVersionList[key].id]=appVersionList[key].appVersion;
            }
        },
        error : function(e){
            alert(e.responseJSON.message);
        }

    });
}

var	initOrganNameList = function(){
    $.ajax({
        type:'GET',
        url:'/api/chart/organ',
        success : function(returnValue){
            organNames = returnValue;
            $(returnValue).each(function(i){
                if(returnValue[i].id<=0){

                }else{
                    $('#organ-select').append('<option value="'+returnValue[i].id+'">'+returnValue[i].organName+'</option>')
                }
            });
        },
        error:function(e){
            alert(e.responseJSON.message);
        }

    });
}
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
	searchReq.appId = data.appId;
	searchReq.startDate			=	getStartDate(data.startDate);
	searchReq.endDate			=	getEndDate(data.endDate);
	searchReq.searchColumn	=	$('#search_column').val();
	searchReq.searchKeyword		=	$('#connection-search-input').val();
	
	var start 	=	getStartDate(data.startDate);
	var end 	=	getEndDate(data.endDate);
	
	return searchReq;
}

var inquireToServer = function(){
	var startDate = getStartDate($('#startDate').val());
	var endDate = getEndDate($('#endDate').val());
	var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');
	
	if(!isPeriodOk){
		alert(getMessage('log.search.periodMessage','검색 기간의 최대 범위는 1개월 입니다.'));
	}
	else {
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
	}
};


var InitFunction = function() {
	
	return {
		initSearhDate : function() {
			// 처음 로딩시 가져올 날짜 세팅
			// 오늘을 기준으로 계산
			// 오늘을 기준으로 이틀 전
			startDate = getStartDate();
			endDate = getEndDate();		
			setCurrentDateRange(startDate, endDate);																	
		},

		initDashboardDaterange : function() {
			if (!jQuery().daterangepicker) {
				return;
			}

			$('#dashboard-report-range')
					.daterangepicker(
							{
							    "locale": {
							        "format": "YYYY. MM. DD.",
							        "separator": " - ",
							        "applyLabel": getMessage("common.apply","적용"),
							        "cancelLabel": getMessage("common.cancel","취소"),
							        "fromLabel": "From",
							        "toLabel": "To",
							        "customRangeLabel": "Custom",
							        "weekLabel": "W",
							        "daysOfWeek": [ getMessage("common.dayOfWeek.sun","일"), getMessage("common.dayOfWeek.mon","월"), getMessage("common.dayOfWeek.tue","화"), getMessage("common.dayOfWeek.wed","수"), getMessage("common.dayOfWeek.thu","목"),
										getMessage("common.dayOfWeek.fri","금"), getMessage("common.dayOfWeek.sat","토") ],
							        "monthNames": [ getMessage("common.monthOfYear.jan","1월"), getMessage("common.monthOfYear.feb","2월"), getMessage("common.monthOfYear.mar","3월"), getMessage("common.monthOfYear.apr","4월"),
										getMessage("common.monthOfYear.may","5월"), getMessage("common.monthOfYear.jun","6월"), getMessage("common.monthOfYear.jul","7월"), getMessage("common.monthOfYear.aug","8월"), getMessage("common.monthOfYear.sep","9월"),
										getMessage("common.monthOfYear.oct","10월"), getMessage("common.monthOfYear.nov","11월"), getMessage("common.monthOfYear.dec","12월") ],
							        "firstDay": 1
							    },
							    "startDate": startDate,
							    "endDate": endDate,
							},
							function(start, end, label) {
								if (moment() < moment(endDate).subtract('days', 1)) {
									alert(getMessage("common.datePicker.overDatePickedErrorMessage","오늘 이후날자로는 검색할수 없습니다."));
									return;
								}
								
								var startDate = getStartDate(start);
								var endDate = getEndDate(end);
								setCurrentDateRange(startDate, endDate);
								
							});
			$('#dashboard-report-range').show();
			$('#dashboard-report-range').bind('click.leftButton',function(){
				$(".calendar-table .fa-angle-left").click();
				$('#dashboard-report-range').unbind('.leftButton');
			});
		},
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
			table
					.on(
							'click',
							'.log-info',
							function(e) {
								e.preventDefault();
								$('#log-info-modal').modal('show');
								var nRow = $(this).parents('tr')[0];
								var data = oTable.row(nRow).data();
								var keys = Object.keys(data);
								
								var elemId = "";
								var content = "";

								
								for ( var item in keys) {
									elemId = keys[item];
									content = data[elemId];
									if(elemId == "blockingType"){
										content = getBlockingLabelFromRow(content, getMessage("log.blockingType.normalDevice","정상 기기"));
									}
                                    if(elemId=="appId"){
                                        $('#appName').text(appNameMap[content])
                                    }else if(elemId=="appVersionId") {
                                        $('#appVersion').text(appVersionMap[content])
                                    }else if(elemId=="appName"||elemId=="appVersion"){

									}else{
										if($('#' + elemId).length > 0) {

											$('#' + elemId).text(content);
										}
									}





								}
								
								var time = $('#createdAt').text();
								$('#createdAt').text(timeFormat(Number(time)));

						});
								
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
			this.initSearhDate();
			this.initDashboardDaterange();
			this.table().init();
			// this.initCreateTable()
			this.modalInit();
			this.clickEventInit();
		}
	}
}();
function getCsv(){
	getQueryData()
	var data = new Object();
	getQueryData()
	// data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
	data.appId = searchReq.appId;
	data.organId = searchReq.organId;
	data.searchColumn = searchReq.searchColumn;
	data.keyword = searchReq.searchKeyword;
	data.startDate=searchReq.startDate;
	data.tomorrowEndDate=getTommorowStart(searchReq.endDate);
	window.open("/api/log/connection/csv?"+$.param(data), '_blank')
}
function initCsvDownloadEvent(){
	$("#csv-download").click(function(e){
		getCsv();
	})
}

$(document).ready(
		function() {
            initOrganNameList();
			appListInit();
            appVersionMapInit();
			initCsvDownloadEvent();
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
            "url" : "/api/log/connection",
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
			data : "createdAt"
		}, {		
			data : "appId"
		}, {		
			data : "appVersionId"
		}, {		
			data : "deviceType"		
		}, {		
			data : "deviceModel"		
		}, null, null, ],		
		"columnDefs" : [		
			{ // set default column		
				// settings		
				'orderable' : true,		
				render : function(data,	type, row, meta) {		
					return timeFormat(row.createdAt);
				},
				"searchable" : false,
				'targets' : [ 0 ]		
			},
            {
                render : function(data,	 type, row, meta) {
                    return 	appNameMap[data]!=undefined?appNameMap[data]:'N/A';
                },
                "searchable" : false,
                "targets" : [ 1 ]
            },
            {
                render : function(data,	 type, row, meta) {
                    return 	appVersionMap[data]!=undefined?appVersionMap[data]:'N/A';;
                },
                "searchable" : false,
                "targets" : [ 2 ]
            },
			{
				'data' : function(row, type, val, meta) {
					content = getBlockingLabelFromRow(row['blockingType'], row);
					return content;
				},
				targets : [ 5 ]	
			},		
			{		
				'data' : function(row,		
						type, val, meta) {		
					result = "<button class='log-info'>"+getMessage('common.lookUp','조회')+"</button>"		
					return result;		
				},		
				targets : [ 6 ]		
			},{
                "searchable" : false,
				targets : [1,2,3,4,5,6]
			},{
        		"orderable" : false,
				targets : [1,2,5,6]
			} ],
		"order" : [ [ 0, "desc" ] ],				
		dom : "<'row'<'col-sm-6'l><'col-sm-6'>>"
			+ "<'row'<'col-sm-12'tr>>"
			+ "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});

    setDatatableAjaxErrorHandle();
}
