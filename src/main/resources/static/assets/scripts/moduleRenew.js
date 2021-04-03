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
		url:'/api/super/module/moduleListByMaxValidUntil',
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
				if(confirm(getMessage("module.doYouWantToUpdateModuleBufferCycle","모듈 버퍼 주기를 갱신하시겠습니까?"))){
					var result = updateBufferDay();
				}
			});
		},
		bufferRangeInit: function(){
			$.ajax({
				url:'/api/super/module/moduleRenewBufferSize',
				type:'GET',
				success:function(result){
					$("#bufferRangeInput").val(result);
				},
				error:function(e){
					alert(e.responseJSON.message);
					console.log(e);
				}
			});
		},
		
		
		init : function() {
			this.keyInit();
			this.keyButtonEventInit();
			this.table().init();
			// this.initCreateTable()
			this.clickEventInit();
			this.bufferRangeInit();
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

var updateBufferDay = function(){
	var result;
	var bufferRange = new Object;
	bufferRange.bufferRange = $("#bufferRangeInput").val();
	$.ajax({
		url:'/api/super/module/moduleRenewBufferSize',
		type:"POST",
		async:false,
		data:JSON.stringify(bufferRange),
		contentType : "application/json; charset=utf-8",
		success:function(returnValue){
			alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
			location.reload();
		},
		error:function(e){
			alert(e.responseJSON.message);
			console.log(e);
		}
	});
	return result;
}

function printTime() {
    // clock 객체 생성
    var clock = document.getElementById("clock");
    var now = new Date();
    clock.innerHTML = getMessage("common.currentTime", "현재 시각")+" : " +timeFormat(new Date())
    // 1초 후에 함수 호출
    setTimeout("printTime()", 1000);
  };
  
  window.onload = function() {
	    printTime();
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
						return row.id.version;
						},
					'targets' : [ 0 ]	
				},		
				{ 		
					'data' :function(row, type, val, meta) {
						return timeFormat(row.validUntil);		
					},
	   				'render' : function(data,type,row, meta){
	   					var result =data;
	   					//10일 이후
	   					var plusTenDay = new Date().getTime()  + (1000*60*60*24*10);
	   					//50일 이후
	   					var plusFiveDay = new Date().getTime() + (1000*60*60*24*5);
	   					if(row.validUntil<plusFiveDay){
	   						result = "<div class='red'>"+data+"</div>"
	   					}else if(row.validUntil<plusTenDay){
	   						result = "<div class='orange'>"+data+"</div>"
	   					}
	   					
	   					return result;
	   				},
					'targets' : [ 1 ]		
				},{
					'data' :function(row, type, val, meta) {
						return row.active;
						},
					'targets' : [ 2 ]	
				}
				],		
		dom : "<'row'<'col-sm-6'l><'col-sm-6'f>>"
			+ "<'row'<'col-sm-12'tr>>"
			+ "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});		
}

