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


var getQueryData = function(result) {
	var data = $('#search-params').serializeJSON();
	searchReq = new Object;
	searchReq.adminId = data.adminId;
	searchReq.organId = data.organId;
	searchReq.action = data.action;
	searchReq.startDate			=	getStartDate(data.startDate).getTime();
	searchReq.endDate			=	getEndDate(data.endDate).getTime();
	searchReq.searchKeywordType	=	$('#search_column').val();
	searchReq.searchKeyword		=	$('#connection-search-input').val();
	
	var start 	=	getStartDate(data.startDate);
	var end 	=	getEndDate(data.endDate);
	

	
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
	var query = getQueryData();
	$.ajax({
		url:'/api/super/module/invalidModule',
		data:query,
		type:'GET',
		success:function(result){
			makeTable(result);
		},
		error:function(e){
			alert('error : ' + e.responseJSON.message);
			console.log(e);
		}
	});
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
			var time = tryToGetDate(time);
			if(!time){
				return null;
			}
			time.setDate(time.getDate());
			time.setMonth(time.getMonth()-1)
			time.setHours(0);
			time.setMinutes(0);
			time.setSeconds(0);
			time.setMilliseconds(0);
			
			startDate = time;
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
		},
		table : function() {
			var mainTable = function() {
				inquireToServer();
				var nEditing = null;
				var nNew = false;
				// add-app
				$('#module-info').click(function(e) {
					e.preventDefault();
					$('#module-info-modal').modal();
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
							'.module-info',
							function(e) {
								e.preventDefault();
								$('#module-info-modal').modal('show');
								var nRow = $(this).parents('tr')[0];
								var data = oTable.row(nRow).data();
								var keys = Object.keys(data);
								
								var elemId = "";
								var content = "";

								
								for ( var item in keys) {
									
									elemId = keys[item];
									content = data[elemId];
									if(elemId == 'insertedAt'||elemId == 'validUntil'){
										content = timeFormat(data[elemId]);
									}else if(elemId == 'id'){
										$('#id-version').text(data[elemId].version);
										$('#id-id').text(data[elemId].id);
									}
									
									
									if($('#' + elemId).length > 0&&elemId != 'id') {
										$('#' + elemId).text(content);
									}
								}

						});
								
		},
		clickEventInit: function(){
			$('#module-search-button').click(function(e){
				e.preventDefault();				
				inquireToServer();
			});

			
		},
		keyInit: function(){
			$.ajax({
				url:'/api/super/module/key',
				type:'GET',
				success:function(result){
					var key='';
					//최초 키생성이 되지 않았을 경우
					if(result.key=="default"){
						result = reGenerateKey();
					}
					$('#privateKey').text(result.privateKey);
					
					$('#privateKeyUpdateDate').text(timeFormat(result.modDate));
				},
				error:function(e){
					alert(e.responseJSON.message);
					console.log(e);
				}
			});
		},
		keyButtonEventInit: function(){
			$("#renewKey").click(function(){
				if(confirm(getMessage("module.doYouWantToUpdateModuleCheckKey","모듈 점검 키를 갱신하시겠습니까?"))){
					var result = reGenerateKey();
					$('#privateKey').text(result.privateKey);
					$('#privateKeyUpdateDate').text(timeFormat(result.modDate));
				}
			});
		},
		
		init : function() {
			this.keyInit();
			this.keyButtonEventInit();
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
			InitFunction.init();
			$('#startDate, endDate').change(function() {
				oTable.draw();
			});
		});

var reGenerateKey = function(){
	var result;
	$.ajax({
		url:'/api/super/module/key/put',
		type:"POST",
		async:false,
		contentType : "application/json; charset=utf-8",
		success:function(returnValue){
			result=returnValue;
		},
		error:function(e){
			alert(e.responseJSON.message);
			console.log(e);
		}
	});
	return result;
}

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
		aaSorting: [] ,
		columns : [ ],		
		"columnDefs" : [		
				{ 		
					'data' :function(row, type, val, meta) {
						return timeFormat(row.insertedAt);		
					},		
					'targets' : [ 0 ]		
				},{
					'data' :function(row, type, val, meta) {
						return row.id.version;
						},
					'targets' : [ 1 ]	
				},{
					'data' :function(row, type, val, meta) {
						return row.id.id;
						},
					'targets' : [ 2 ]	
				},{		
					'data' : function(row, type, val, meta) {
						result = "<button class='module-info'>"+getMessage("common.details", "상세")+"</button>"
						return result;
					},
					visible : true,
					targets : [ 3 ]	
				}
				],		
		dom : "<'row'<'col-sm-6'l><'col-sm-6'f>>"
			+ "<'row'<'col-sm-12'tr>>"
			+ "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});		
}

