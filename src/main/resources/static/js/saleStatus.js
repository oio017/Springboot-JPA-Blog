var searchReq = new Object;
var oTable;
var startDate;
var endDate;

let index = {

	// 리스너 함수 리스트
	init: function() {
		this.clickEventInit();
	},

	clickEventInit: function() {
		////////////////////////////////////////////////////////////
		$('#sale-search-button').click(function(e) {
			alert('조회버턴이 클릭 되었습니다.');
			var data = new Object;
			var startDate = new Date();
			var endDate = new Date();

			data.vendingMachine =  'CVVN100020';
			data.startDate = startDate;
			data.endDate = endDate;
			data.stringStartDate = '2021-03-27';
			data.stringEndDate = '2021-03-28';

			var xxx = JSON.stringify(data);
			alert(xxx);
			$.ajax({
				type: "POST",
				dataType: "json",          // ajax 통신으로 받는 타입
				contentType: "application/json",  // ajax 통신으로 보내는 타입
				data: xxx,
			}).done(function(resp) {
				location.href = "/sale/saleList";
			}).fail(function(error) {
				alert(JSON.stringify(error));
			});
		});
		////////////////////////////////////////////////////////////
		$('#input-submit').click(function(event){
			event.preventDefault();

			// var data = {};

			// $.each($(this).serializeArray(), function(index, o) {
			// 	data[o.name] = o.value
			// });

					var data = new Object;
					getQueryData();
					data.vendingMachine = searchReq.vendingMachine;
					data.startDate=searchReq.startDate;
					data.endDate=searchReq.endDate;


			$.ajax({
				url: "/sale/saleList",
				type: "GET",
				dataType: "json",          // ajax 통신으로 받는 타입
				//contentType: "application/json",  // ajax 통신으로 보내는 타입
				//data: JSON.stringify(data),
				data: data,
				success: function(result){
					console.log(result);
      			}
			});
		////////////////////////////////////////////////////////////
		});
	}
	//clickEventInit
}
// index

index.init();

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
	}
}

var getQueryData = function() {
	var data = $('#search-params').serializeJSON();

	searchReq.startDate=getStartDate(data.startDate);
	searchReq.endDate=getEndDate(data.endDate);
	searchReq.vendingMachine = $('#input-vendingMachine').val();
	
	console.log(searchReq)
	return searchReq;
}

function makeTable(){
	var data = new Object;

    getQueryData();
	data.vendingMachine = searchReq.vendingMachine;
    data.startDate=searchReq.startDate;
    data.endDate=searchReq.endDate;

	$.ajax({
		url: "/sale/saleList",
		type: "GET",
		data: data, 
		success: function(result){
		
		}
	});

	oTable = table
	.DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
        	"url" : "/sale/saleList",
			"data" : function (data){
                getQueryData();
				//data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
				data.vendingMachine = searchReq.vendingMachine;
                data.startDate=searchReq.startDate;
                data.endDate=searchReq.endDate;
                console.log(data)
			},
			"type" : "GET",
			// "success" : function(data){
        		// //console.log(data)
			// 	return data;
			// }
        },	
	});
	setDatatableAjaxErrorHandle();
}

var InitFunction = function() {
	return {
		initSearchDate : function() {
			//넘어온 파라미터가 있을 때
			console.log($("#date-label" ).data("startdate"));
			console.log($("#date-label" ).data("enddate"));
			// 처음 로딩시 가져올 날짜 세팅
			// 오늘을 기준으로 계산
			// 오늘을 기준으로 이틀 전
			if($("#date-label" ).data("startdate")!=undefined){
				startDate = getStartDate($("#date-label" ).data("startdate"));
				endDate = getEndDate($("#date-label" ).data("enddate"));
			}else{
				startDate = getStartDate();
				endDate = getEndDate();		
			}
			console.log(startDate);
			setCurrentDateRange(startDate, endDate);																

			console.log('시작 날짜 : ' + startDate + ' 종료 날짜' + endDate);
			console.log(startDate);
			console.log(endDate);
		},
		// initSearchDate : function()
		initDashboardDaterange : function() {
			if (!jQuery().daterangepicker) {
				console.log('daterangepicker is null');
				return;
			}

			datepicker = $('#dashboard-report-range').daterangepicker(		
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
				console.log(start)
				console.log(end)
				console.log(label)
				if (moment() < moment(endDate).subtract('days', 1)) {
					alert(getMessage("common.datePicker.overDatePickedErrorMessage", "오늘 이후날자로는 검색할수 없습니다."));
					return;
				}
							
				var startDate = getStartDate(start);
				var endDate = getEndDate(end);
				setCurrentDateRange(startDate, endDate);																

				console.log(startDate);
				console.log(endDate);
			});
			$('#dashboard-report-range').show();
// 			$('#dashboard-report-range').on('showCalendar.daterangepicker', function (ev,picker){
//					console.log("show");
// 			})
// 			$('#dashboard-report-range').on('hideCalendar.daterangepicker', function (ev,picker){
//					console.log("hide");
// 			})
			$('#dashboard-report-range').bind('click.leftButton',function(){
				$(".calendar-table .fa-angle-left").click();
				$('#dashboard-report-range').unbind('.leftButton');
			});
		},
		// initDashboardDaterange : function()
		clickEventInit: function(){
			$('#detection-search-button').click(function(e){
				e.preventDefault();
                var startDate = getStartDate($('#startDate').val());
                var endDate = getEndDate($('#endDate').val());
                var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');

                if(!isPeriodOk){
                    alert(getMessage('log.search.periodMessage','검색 기간의 최대 범위는 1개월 입니다.'));
                }else{
					////////////////////////////////////////////////////
					var data = new Object;
					getQueryData();
					data.vendingMachine = searchReq.vendingMachine;
					data.startDate=searchReq.startDate;
					data.endDate=searchReq.endDate;

					$.ajax({
						url: "/sale/saleList",
						type: "GET",
						dataType: "json",          // ajax 통신으로 받는 타입
						// contentType: "application/json",  // ajax 통신으로 보내는 타입
						data: data,
						success: function(result){	
							console.log(result);
		      			}
					});
					////////////////////////////////////////////////////
				}
				// inquireToServer();
				e.returnValue = false;
			});
			//detection-search-button
		},
		// clickEventInit: function()
		table : function() {
			var mainTable = function() {
			inquireToServer();
			}
		},
		init : function() {
			this.initSearchDate();
			this.initDashboardDaterange();
			// this.modalInit();
			this.clickEventInit();
			// this.initSearchParam();
			// this.table().init();
		}
		//init : function()
	}
	// return
}();
// var InitFunction = function()

$(document).ready(
	function() {
		//alert("dcoument ready");
		$('#startDate').val(
			new Date(parseInt(new Date() / 10000000) * 10000000
				- (1000 * 60 * 60 * 24)).getTime());
		$('#endDate').val(
			new Date(parseInt(new Date() / 10000000) * 10000000).getTime());
		InitFunction.init();
		$('#startDate, endDate').change(function() {
			oTable.draw();
		});
	}
);
// $(document).ready(

