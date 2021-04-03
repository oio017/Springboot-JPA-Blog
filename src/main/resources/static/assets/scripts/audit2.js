$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>');
;
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/scripts/jjsonviewer.js"></script>');

var table = $('#connection-table');
var oTable;
var vTable;
var startDate;
var endDate;
var searchColumn = "";
var searchKeyword = "";

var appListInit = function(){
	$.ajax({
		type : 'GET',
		url : '/api/audit/adminlist',
		success : function(adminList){
			adminId=$("#admin-list-label" ).data("adminid");
			var result = "<option value='All'>전체 관리자</option>" ;
			for(var i=0; i<adminList.length; i++){
				if(adminList[i].id==adminId){
					result+='<option value="'+adminList[i].id+'" selected="selected" >'+adminList[i].appName+'</option>'
				}else{
					result+='<option value="'+adminList[i].id+'">'+adminList[i].userName+'('+adminList[i].userId+')'+'</option>'
				}
			}
			$('#admin-list').html("");
			$('#admin-list').html(result);
			
			$('#admin-list').change(function(){
				adminId=$(this).val();
				//chartInit();
				
			});
			//$('.selectpicker').selectpicker('render');
		},
		error : function(e){
			alert(e.responseJSON.message);
		}
			
	});
}
var blockingLabelMap = {
	""				: "정상",
	"blacklist" 	: "차단",
	"loss_device" 	: "분실"
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

var tryToGetDate = function(stuff){
	if(!stuff){
		return new Date();
	}
	
	if(stuff instanceof Date){
		return stuff;
	} 
	
	if(Math.floor(stuff) == stuff && $.isNumeric(stuff))  {
		return new Date(stuff);
	}
	
	stuff = Date.parse(stuff);
	
	if(Math.floor(stuff) == stuff && $.isNumeric(stuff))  {
		return new Date(stuff);
	}
	
	return null;
}

var getStartDate = function(time){
	time = tryToGetDate(time);
	if(!time){
		return null;
	}
	time.setDate(time.getDate());
	time.setHours(0);
	time.setMinutes(0);
	time.setSeconds(0);
	time.setMilliseconds(0);
	
	return time;
}

var getEndDate = function(time){
	time = tryToGetDate(time);
	if(!time){
		return null;
	}
	time.setDate(time.getDate() + 1);
	time.setHours(0);
	time.setMinutes(0);
	time.setSeconds(0);
	time.setMilliseconds(0);
	time.setMilliseconds(time.getMilliseconds() - 1);
	return time;
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

var getQueryData = function(result) {
	var data = $('#search-params').serializeJSON();
	searchReq = new Object;
	searchReq.adminId = data.adminId;
	searchReq.action = data.action;
	searchReq.startDate			=	getStartDate(data.startDate).getTime();
	searchReq.endDate			=	getEndDate(data.endDate).getTime();
	searchReq.searchKeywordType	=	$('#search_column').val();
	searchReq.searchKeyword		=	$('#connection-search-input').val();
	
	var start 	=	getStartDate(data.startDate);
	var end 	=	getEndDate(data.endDate);
	
//	// [TEST]
//	checkDateGapIfShorterThanOrEqualsToPeriod(start, end, 1, 'M');
//	
//	var testCases = [
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	 1, 'M'],
//		[new Date('2016/8/1')	, new Date('2016/10/31'), 	 3, 'M'],
//		[new Date('2016/8/1')	, new Date('2016/10/31'), 	 2, 'M'],
//		
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	30, 'D'],
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	29, 'D'],
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	31, 'D'],
//		
//		[new Date('2014/10/1')	, new Date('2016/10/31'), 	 1, 'Y'],
//		[new Date('2014/10/1')	, new Date('2016/10/31'), 	 2, 'Y'],
//		[new Date('2014/10/1')	, new Date('2016/10/31'), 	 3, 'Y'],
//		
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	30, 'D'],
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	29, 'D'],
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	31, 'D'],
//		
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	 1, 'M'],
//		[new Date('2016/8/1')	, new Date('2016/10/31'), 	 3, 'M'],
//		[new Date('2016/8/1')	, new Date('2016/10/31'), 	 2, 'M'],
//		
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	30, 'D'],
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	29, 'D'],
//		[new Date('2016/10/1')	, new Date('2016/10/31'), 	31, 'D'],
//		
//		[new Date('2014/10/1')	, new Date('2016/10/31'), 	 1, 'Y'],
//		[new Date('2014/10/1')	, new Date('2016/10/31'), 	 2, 'Y'],
//		[new Date('2014/10/1')	, new Date('2016/10/31'), 	 3, 'Y']		
//	]
//	
//	$(testCases).each(function(e){
//		test(testCases[e]);
//	});
//	
//	// [/TEST]
	
	return searchReq;
}

var getFormatDateString = function(date, separator){
	if(!separator){
		separator = '. ';
	}
	
	var year 	= date.getFullYear();
	var month 	= date.getMonth() + 1;
	var day  	= date.getDate();	
	
	return year + separator + month + separator + day;
}

var setCurrentDateRange = function(start, end) {
//	$('#dashboard-report-range span').html(start.format('YYYY.MM.DD') + ' - '	+ end.format('YYYY.MM.DD'));
	$('#dashboard-report-range span').html(getFormatDateString(start) + ' - '	+ getFormatDateString(end));
	
	$('#startDate').val(start);
	$('#endDate').val(end);
}

var inquireToServer = function(){
	var startDate = getStartDate($('#startDate').val());
	var endDate = getEndDate($('#endDate').val());
	var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');
	if(!isPeriodOk){
		alert('검색 기간의 최대 범위는 1개월 입니다.');
	} else {
		var query = getQueryData();
		$.ajax({
			url:'/api/audit',
			data:query,
			type:'GET',
			success:function(result){
				makeTable(result);
			}
		});
	}
};

var getDaysDifference = function(startDate, endDate){
	start = getStartDate(startDate);
	end = getStartDate(endDate);
	return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

var isLeapYear = function(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

var checkDateGapIfShorterThanOrEqualsToPeriod = function(start, end, period, unit){
	start = getStartDate(start);
	end = getEndDate(end);
	
	var yearDiff = end.getFullYear() - start.getFullYear();
	var monthDiff = (yearDiff>0)?(end.getMonth() - start.getMonth()+12):(end.getMonth() - start.getMonth());
	var dayDiff = getDaysDifference(start, end);
	
	var res = false;	
	
	switch(unit){
	case 'D':{
		res = (dayDiff <= period);
		break;
	}		
	
	case 'M':{		
		res = (monthDiff < period || dayDiff <= (period * 30));				
		break;
	}
	
	case 'Y':{
		var leapYears = 0;
		for(sy = start.getFullYear(), ey = end.getFullYear(); sy <= ey; ++ sy){
			if(isLeapYear)
				++ leapYears;
		}
		
		res = (yearDiff < period || dayDiff <= ((period * 365) + leapYears));
		break;
	}
		
	}
	return res;
}

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
							        "applyLabel": "적용",
							        "cancelLabel": "취소",
							        "fromLabel": "From",
							        "toLabel": "To",
							        "customRangeLabel": "Custom",
							        "weekLabel": "W",
							        "daysOfWeek": [
							        	"일", "월", "화", "수", "목", "금", "토"
							        	],
							        "monthNames": [
							            "1월",  "2월",  "3월",  "4월",  "5월",  "6월",
							            "7월",  "8월",  "9월", "10월", "11월", "12월"
							        ],
							        "firstDay": 1
							    },
							    "startDate": startDate,
							    "endDate": endDate,
							},
							function(start, end, label) {
								if (moment() < moment(endDate).subtract('days', 1)) {
									alert(getMessage("common.datePicker.overDatePickedErrorMessage", "오늘 이후날자로는 검색할수 없습니다."));
									return;
								}
								
								var startDate = getStartDate(start);
								var endDate = getEndDate(end);
								setCurrentDateRange(startDate, endDate);
								
							});
			$('#dashboard-report-range').show();
		},
		table : function() {
			var mainTable = function() {
				inquireToServer();
				var nEditing = null;
				var nNew = false;
				// add-app
				$('#audit-info').click(function(e) {
					e.preventDefault();
					$('#audit-info-modal').modal();
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
							'.audit-info',
							function(e) {
								e.preventDefault();
								$('#audit-info-modal').modal('show');
								var nRow = $(this).parents('tr')[0];
								var data = oTable.row(nRow).data();
								var keys = Object.keys(data);
								
								var elemId = "";
								var content = "";

								
								for ( var item in keys) {
									
									elemId = keys[item];
									content = data[elemId];
									if(elemId == 'regDate'){
										content = timeFormat(data[elemId]);
									}else if(elemId == 'accountEntity'){
										content = data[elemId].userName+'('+data[elemId].userId+')';
									}else if(elemId == 'isSuccess'){
										if(data[elemId]==1){
											content = '성공';
										}else{
											content = '실패';
										}
									}
									if($('#' + elemId).length > 0) {
										$('#' + elemId).text(content);
									}
									if(elemId == 'beforeData'){
										$('#beforeData').jJsonViewer(data[elemId]);
									}else if(elemId == 'afterData'){
										$('#afterData').jJsonViewer(data[elemId]);
									}
									
								}

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

$(document).ready(
		function() {
			appListInit();
			InitFunction.init();
			$('#startDate, endDate').change(function() {
				oTable.draw();
			});
		});

function makeTable(returnValue){	
	oTable = table		
	.DataTable({		
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
		data : returnValue,		
		columns : [ {		
			data : "regDate"		
		}, {		
			data : "action"		
		}, null
			, {		
			data : "userIp"		
		}, null, null
		, null, null],		
		"columnDefs" : [		
				{ 		
					render : function(data,	type, row, meta) {	
						return timeFormat(data);		
					},		
					'targets' : [ 0 ]		
				},{
					'data' :function(row, type, val, meta) {
						result = "";
						if(row.accountEntity!=null){
							result +=row.accountEntity.userName + '(' +row.accountEntity.userId+')';
						}
						return result;
						
						},
					'targets' : [ 2 ]	
				},{
					'data' :function(row, type, val, meta) {
						var result = '';
						if(row.isSuccess==1){
							result = '성공';
						}else{
							result = '실패';
						}
						return result;
						
						},
					'targets' : [ 4 ]	
				},{
					'data' :function(row, type, val, meta) {
						var result = "없음";
						if(row.beforeData!=null){
							result = row.beforeData.substring(0,30)+'...';
						}
						return result;
						},
					'targets' : [ 5 ]	
				},{
					'data' :function(row, type, val, meta) {
						var result = "없음";
						if(row.afterData!=null){
							result = row.afterData.substring(0,30)+'...';
						}
						return result;
						},
					'targets' : [ 6 ]	
				},		
				{		
					'data' : function(row, type, val, meta) {
						result = "<button class='audit-info'>상세</button>"
						return result;
					},
					targets : [ 7 ]	
				}
					],		
		"order" : [ [ 0, "desc" ] ],				
		dom : "<'row'<'col-sm-6'l><'col-sm-6'f>>"
			+ "<'row'<'col-sm-12'tr>>"
			+ "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});		
}
