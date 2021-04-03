$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/amcharts.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/serial.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/themes/black.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/themes/light.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/themes/chalk.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/themes/dark.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/themes/patterns.js"></script>');
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>');
var is_action_loop = true;
var dailyProvider;
var standardDate = new Date();
var appId;
var is_action_loop;
var width ="60%";
var organId = null;

var todayBlockedCount;
var thisWeekBlockedCount;
var thisMonthBlockedCount;

var appListInit = function(){
	$.ajax({
		type : 'GET',
		url : '/api/app/list',
		success : function(appList){
			var result = "<option value=''> "+getMessage("app.allApps", "전체 앱")+"</option>" ;
			for(var i=0; i<appList.length; i++){
				result+='<option value="'+appList[i].id+'">'+appList[i].appName+'</option>'
			}
			$('#app-list').html("");
			$('#app-list').html(result);
			
			$('#app-list').change(function(){
				appId=$(this).val();
				chartInit();
			});
		},
		error : function(e){
			alert(e.responseJSON.message);
		}
			
	});
}


var dailyChart = AmCharts
		.makeChart(
				"dashboard_daily_block",
				{
					"type": "serial",
					"categoryField": "option",
					"rotate": true,
					"marginTop": "12",
					"marginRight": "50",
					"startDuration": 1,
					"addClassNames": true,
					"color": "#676767",
					"fontFamily": "Nanum Gothic",
					"fontSize": 17,
					"theme": "light",
					"export": {
						"enabled": true
					},
					"categoryAxis": {
						"gridPosition": "start"
					},
					"trendLines": [],
					"graphs": [
						{
							"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
							"bulletBorderThickness": 0,
							"bulletSize": 6,
							"columnWidth": 0.73,
							"fillAlphas": 0.8,
							"fillColorsField": "color",
							"id": "AmGraph-2",
							"labelPosition": "left",
							"labelText": "",
							"lineThickness": 0,
							"title": "distinctCount",
							"type": "column",
							"valueField": "distinctCount"
						}
						,
						{
							"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
							"bulletOffset": -5,
							"columnWidth": 0.73,
							"fillAlphas": 0.8,
							"fillColors": "rgba(0,0,0, 0.1)",
							"id": "AmGraph-1",
							"labelAnchor": "start",
							"labelPosition": "right",
							"labelText": "[[distinctCount]] / [[count]]",
							"lineThickness": 0,
							"title": "count",
							"topRadius": 0,
							"type": "column",
							"valueField": "count"
						}
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"integersOnly": true,
							"position": "bottom",
							"axisAlpha": 0,
							"gridThickness": 0,
							"minorGridAlpha": 0.08,
							"minorGridEnabled": true,
							"stackType": "3d"
						}
					],
					"allLabels": [],
					"balloon": {},
					"titles": [
						{
							"id": "dailyTitle",
							"text": getMessage("common.blockedUsersTotalBlocked","차단사용자수 / 전체 차단 수")
						}
					],
					"dataProvider": [
						{
							"color": "#736458",
							"count": 22,
							"distinctCount": 11,
							"threat": "app-threat",
							"option": getMessage("common.threats.appForgery", "앱 위변조"),
							"className": "appForgery"
						},
						{
							"color": "#F389B0",
							"count": 32,
							"distinctCount": 4,
							"threat": "os-threat",
							"option": getMessage("common.threats.osForgery", "OS 위변조"),
							"className": "osForgery"
						},
						{
							"color": "#3C3E51",
							"count": 42,
							"distinctCount": 5,
							"threat": "debugger-threat",
							"option": getMessage("common.threats.debugger", "디버거"),
							"className": "debuggerForgery"
						},
						{
							"color": "#25AAE1",
							"count": 20,
							"distinctCount": 15,
							"threat": "adb-threat",
							"option": getMessage("common.threats.adb", "ADB"),
							"className": "adbForgery"
						},
						{
							"color": "#2FB8A3",
							"count": 3,
							"distinctCount": 2,
							"threat": "session-threat ",
							"option": getMessage("common.threats.sessionForgery", "세션 위변조"),
							"className": "sessionForgery"
						},
						{
							"color": "#2dff00",
							"count": 3,
							"distinctCount": 2,
							"threat": "proxy-threat ",
							"option": getMessage("common.threats.proxy", "proxy"),
							"className": "proxy"
						}
					]
				});
var dailyAllChart = AmCharts
.makeChart(
		"daily_all_block",
		{
			"type": "serial",
			"categoryField": "time",
			"marginLeft": 50,
			"marginTop":80,
			"startDuration": 1,
			"addClassNames": true,
			"color": "#676767",
			"fontFamily": "Nanum Gothic",
			"fontSize": 13,
			"theme": "light",
			"categoryAxis": {
				"gridPosition": "start"
			},
			"chartCursor": {
				"enabled": true
			},
			"trendLines": [],
			"graphs": [
				{
					"bullet": "round",
					"bulletSize": 5,
					"columnWidth": 0,
					"fillColors": "#CDCCCC",
					"id": "yesterday",
					"lineColor": "#CDCCCC",
					"lineThickness": 2,
					"markerType": "circle",
					"title": getMessage("common.yesterday","어제"),
					"topRadius": 0,
					"valueField": "yesterday"
				},
				{
					"bullet": "round",
					"bulletSize": 5,
					"id": "today",
					"lineAlpha": 1,
					"lineColor": "#0872BA",
					"lineThickness": 2,
					"markerType": "circle",
					"title": getMessage("common.today","오늘"),
					"valueField": "today"
				}
			],
			"guides": [],
			"valueAxes": [
				{
					"id": "ValueAxis",
					"position": "absolute",
					"title": getMessage("common.count","건수"),
					"showLastLabel": false,
					"titleLeft" : -10
				}
			],
			"allLabels": [
				{
					"id": "total-count",
					"size": 40,
					"text": "Today 0",
					"x": "12%",
					"y": "0%"

				}
			],
			"balloon": {},
			"legend": {
				"enabled": true,
				"fontSize": 18,
				"left": 0,
				"top":5,
				"marginBottom": -31,
				"marginLeft": 55,
				"marginTop": 10,
				"markerSize": 20,
				"position": "absolute",
				"spacing": 5,
				"valueWidth" : 30,
				"tabIndex": 1,
				"useGraphSettings": true,
				"verticalGap": 40
			},
			"titles": [
				{
					"id": "daily-all-title",
					"size": 30,
					"tabIndex": 0,
					"text": " "
				}
			]
		});
var weeklyAllChart = AmCharts
.makeChart(
		"weekly_all_block",
		{
			"fontFamily" : "Nanum Gothic",
			"type": "serial",
			"color" : "#676767",
			"fontSize": 13,
			"categoryField": "dayOfWeek",
			"startDuration": 1,
			"theme" : "light",
			"marginTop": 80,
			"marginLeft": 50,
			"marginRight": 9,
			"classNamePrefix": "weekAll",
			"addClassNames": true,
			"categoryAxis": {
                "gridPosition": "start"
            },
            "chartCursor": {
                "enabled": true
            },
			"trendLines": [],
			"graphs": [ 
				{
                    "bullet": "",
                    "bulletBorderThickness": 0,
                    "bulletSize": 0,
                    "customMarker": "",
					"fillColors": "#CCCCCC",
					"fontSize": 0,
					"gapPeriod" : 4,
					//"balloonText": "[[title]] of [[category]]:[[value]]",
					"columnWidth": 0.69,
					"fillAlphas": 1,
					"id": "lastWeek",
					"lineColor": "#CCCCCC",
					"markerType": "circle",
					"title": getMessage("common.lastWeek", "Last Week"),
					"type": "column",
					"valueField": "lastWeek",
					"tabIndex" : 2
				},
				{
					"balloonText": "[[title]] of [[category]]:[[value]]",
					"columnWidth": 0.71,
					"fillAlphas": 1,
					"fillColors": "#F15A24",
					"id": "thisWeek",
					"lineColor": "#F15A24",
					"markerType": "circle",
					"title": getMessage("common.thisWeek", "This Week"),
					"type": "column",
					"valueField": "thisWeek"
				}
			],
			"guides": [],
			"valueAxes": [
							{
								"id": "ValueAxis",
								"title": getMessage("common.count","건수"),
								"position": "absolute",
								"showLastLabel" : false
							}
						],
			"allLabels": [
				{
					"id": "week-count",
					"size": 40,
					"tabIndex": 0,
					"text": "Week 0",
					"x": "12%",
					"y": "0%"
				}
			],
			"balloon": {},
			"legend": {
				"enabled": true,
				"fontSize": 18,
				"left" : 0,
				"top" : 5,
				"marginBottom" : -31,
				"marginLeft": 55,
				"marginTop" : 10,
				"markerSize" : 20,
				"position": "absolute",
				"spacing": 5,
				"valueWidth": 30,
				"tabIndex": 1,
				"useGraphSettings": true,
				"verticalGap" : 40,

			},
			"titles": [
				{
					"id": "weekly-all-title",
					"size": 30,
					"tabIndex": 0,
					"text": " "
				}
			],

		});

var monthlyAllChart = AmCharts
.makeChart(
		"monthly_all_block",
		{
			"fontFamily" : "Nanum Gothic",
			"type": "serial",
			"color" : "#676767",
			"fontSize": 13,
			"categoryField": "date",
			"startDuration": 1,
			"theme": "light",
			"marginTop": 80,
			"marginLeft": 50,
			"categoryAxis": {
				"minPeriod": "ss",
			},
			"classNamePrefix": "monthAll",
			"addClassNames": true,
			"chartCursor": {
				"enabled": true,
			},
			"trendLines": [],
			"graphs": [
				{
					"bullet": "",
					"bulletBorderThickness": 0,
					"bulletSize": 0,
					"columnWidth": 0,
					"customMarker": "",
					"dateFormat": "YYYY-MM-DD",
					"fillColors": "#CDCCCC",
					"fixedColumnWidth": 0,
					"fontSize": 0,
					"gapPeriod": 4,
					"id": "lastMonth",
					"lineAlpha": 1,
					"lineColor": "#CDCCCC",
					"lineThickness": 3,
					"markerType": "circle",
					"negativeFillAlphas": 0,
					"tabIndex": 2,
					"title": getMessage("common.lastMonth", "Last Week"),
					"topRadius": 0,
					"valueField": "lastMonth"
				},
				{
					"bullet": "",
					"bulletSize": 0,
					"id": "thisMonth",
					"lineAlpha": 1,
					"lineColor": "#0D9347",
					"lineThickness": 3,
					"markerType": "circle",
					"tabIndex": 1,
					"title": getMessage("common.thisMonth","This Week"),
					"valueField": "thisMonth"
				}
			],
			"guides": [],
			"valueAxes": [
							{
								"id": "ValueAxis",
								"title": getMessage("common.count","건수"),
								"position": "absolute",
								"titleRotation": 1,
								"showLastLabel": false,
								"offset" : -5
							}
						],
			"allLabels": [{
				"id": "total-count",
				"size": 40,
				"text": "Month 0",
				"x": "12%",
				"y" : "0%"
					
			}],
			"balloon": {},
			"legend": {
				"enabled": true,
				"fontSize": 18,
				"left" : 0,
				"marginBottom": -31,
				"marginLeft" : 5,
				"marginTop": 10,
				"spacing": 0,
				"valueWidth": 30,
				"markerSize": 20,
				"position": "absolute",
				"tabIndex": 1,
				"useGraphSettings": true,
				"verticalGap" : 40
			},
			"titles": [
			],
			"dataProvider": [
				{
					"thisMonth": 0,
					"lastMonth": 0,
					"date": 1
				},
				
			]
		});


var Dashboard = function() {

	return {

		initDatePicker : function() {

			$('#dashboard-date-picker').datepicker({
				format: "yyyy-mm-dd"
			});
			$('#dashboard-date-picker').on("changeDate", function() {
			    standardDate = $('#dashboard-date-picker').datepicker('getDate');
			    chartInit();
			});
		},

		init : function() {
			this.initDatePicker();
		}
	};

}();

jQuery(document).ready(function() {
	// Dashboard.init(); // init metronic core componets
	var date = new Date();
	var dateString = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	
	$("#dashboard-date-picker").val(dateString);
	$("#standard-date").val(dateString);
	Dashboard.init();
	appListInit();
	initOrganNameList();
	action_loop();
	chartInit();
	repair();
	EventInit();

});

function action_loop_start_stop() {

	if (is_action_loop) {
		is_action_loop = false;
		$("a#a_action_loop").text("OFF");
	} else {
		is_action_loop = true;
		action_loop();
		$("a#a_action_loop").text("ON");
	}

}

function action_loop() {
	var delay = 300000; // 5분
	setTimeout(function() {
		// alert(is_action_loop);
		if (!is_action_loop) {
			return;
		}
		//fn_application_list();
		
		chartInit();
		action_loop();
	}, delay);
}


function repair(){
	setTimeout(function(){
		$($('#daily_all_block .amcharts-axis-title').children("tspan")[0]).attr('x','-20');
		$($('#weekly_all_block .weekAll-axis-title').children("tspan")[0]).attr('x','-20');
		$($('#monthly_all_block .monthAll-axis-title').children("tspan")[0]).attr('x','-20');
		$(".amcharts-label-total-count").text(getMessage("common.daily","일") +" "+distinctTodayBlockedCount  +"/"+todayBlockedCount);
		$(".weekAll-label-week-count").text(getMessage("common.weekly","주") +" "+ distinctThisWeekBlockedCount  +"/"+thisWeekBlockedCount);
		$(".monthAll-label-total-count").text(getMessage("common.monthly","월") +" "+ distinctThisMonthBlockedCount  +"/"+thisMonthBlockedCount);
	},500);
}
function repairNow(){
		$($('#daily_all_block .amcharts-axis-title').children("tspan")[0]).attr('x','-20');
		$($('#weekly_all_block .weekAll-axis-title').children("tspan")[0]).attr('x','-20');
		$($('#monthly_all_block .monthAll-axis-title').children("tspan")[0]).attr('x','-20');
		$(".amcharts-label-total-count").text(getMessage("common.daily","일") +" "+distinctTodayBlockedCount  +"/"+todayBlockedCount);
		$(".weekAll-label-week-count").text(getMessage("common.weekly","주") +" "+ distinctThisWeekBlockedCount  +"/"+thisWeekBlockedCount);
		$(".monthAll-label-total-count").text(getMessage("common.monthly","월") +" "+ distinctThisMonthBlockedCount  +"/"+thisMonthBlockedCount);
}
function printTime() {
    // clock 객체 생성
    var clock = document.getElementById("clock");
    var now = new Date();
    clock.innerHTML = getMessage("common.currentTime", "현재 시각")+" : " + timeFormat(new Date())
    // 1초 후에 함수 호출
    setTimeout("printTime()", 1000);
  };

  // 창이뜨면, html이 로딩되면 함수 호출
  window.onload = function() {
    printTime();
  };



/*
 * $("#admin_organ_select").change(function(){ organ_id = $("#admin_organ_select
 * option:selected").val(); var organ_name = $("#admin_organ_select
 * option:selected").text();
 * 
 * //document.getElementById("admin_organ_select").innerHTML =
 * organ_name.cut(16);
 * 
 * Dashboard.init();
 * 
 * });
 */
var	initOrganNameList = function(){
		$.ajax({
			type:'GET',
			url:'/api/chart/organ',
			success : function(returnValue){
				$(returnValue).each(function(i){
					if(returnValue[i].id<=0){
						
					}else{
						$('#organ-select').append('<option value="'+returnValue[i].id+'">'+returnValue[i].organName+'</option>')
					}
				});
			},
			error:function(e){
				console.log(e)
			}
				
		});
	}
var EventInit = function(){
	$('#organ-select').change(function(){
		organId=$(this).val();
	});
	$('#dashboard-search-button').click(function(e){
		chartInit();
	});
	dailyAllChart.addListener("drawn", repairForGraph);
	weeklyAllChart.addListener("drawn", repairForGraph);
	monthlyAllChart.addListener("drawn", repairForGraph);
}

var repairForGraph  = function(event){
	repairNow()
}
  var chartInit = function() {
		var data = new Object;
		var startDate = new Date();
		var endDate = new Date();
		
		data.appId=appId;
		data.startDate = startDate;
		data.endDate = endDate;
		data.standardDate = standardDate;
		data.organId=organId;
		$.ajax({
			type : 'GET',
			url : '/api/chart/dashboard',
			data : data,
			async : false,
			success : function(chartValue) {
				$("#daily-block-count").text("");
				$("#weekly-block-count").text("");
				$("#monthly-block-count").text("");
				$("#app-forgery-count").text("");
				$("#os-forgery-count").text("");
				$("#recent-app-name").text(" ");
				$("#recent-blocked-causes").text(" ");
				$("#recent-created-at").text(" ");
				$(".amcharts-label-total-count").text("");
				
				dailyChart.dataProvider = chartValue.dailyProvider;
				dailyAllChart.dataProvider = chartValue.dailyAllProvider;
				weeklyAllChart.dataProvider = chartValue.weeklyAllProvider;
				monthlyAllChart.dataProvider = chartValue.monthlyAllProvider;
				dailyChart.validateData();
				dailyAllChart.validateData();
				weeklyAllChart.validateData();
				monthlyAllChart.validateData();
				//건수 글자 상단 배치
				todayBlockedCount= chartValue.todayBlockedCount
				thisWeekBlockedCount = chartValue.thisWeekBlockedCount
				thisMonthBlockedCount = chartValue.thisMonthBlockedCount
				distinctTodayBlockedCount= chartValue.distinctTodayBlockedCount
				distinctThisWeekBlockedCount = chartValue.distinctThisWeekBlockedCount
				distinctThisMonthBlockedCount = chartValue.distinctThisMonthBlockedCount
				
				$(".amcharts-label-total-count").text(getMessage("common.daily","일") +" "+distinctTodayBlockedCount +"/"+ todayBlockedCount );
				$(".weekAll-label-week-count").text(getMessage("common.weekly","주") +" "+distinctThisWeekBlockedCount +"/"+ thisWeekBlockedCount );
				$(".monthAll-label-total-count").text(getMessage("common.monthly","월") +" "+distinctThisMonthBlockedCount +"/" +thisMonthBlockedCount );
				
				
				$('#app-threat').html(
						'<div class="bigCount">'
						+ chartValue.dailyProvider[0].distinctCount
						+ '</div>'
						+ '<div class="smallCount">'
						+ chartValue.dailyProvider[0].count
						+ "</div>"
				);
				$('#os-threat').html(
						'<div class="bigCount">'
						+ chartValue.dailyProvider[1].distinctCount
						+ '</div>'
						+ '<div class="smallCount">'
						+ chartValue.dailyProvider[1].count
						+ "</div>"
				);
				if(chartValue.dailyProvider[0].count>0){
					$('#app-threat').addClass('warn');
					if(chartValue.dailyProvider[0].count>99){
						if(chartValue.dailyProvider[0].count>999){
							$('#app-threat .bigCount').addClass("bigCount-4");
							$('#app-threat .smallCount').addClass("smallCount-4");
						}else{
							$('#app-threat .bigCount').addClass("bigCount-3");
							$('#app-threat .smallCount').addClass("smallCount-3");
						}
					}else{
						$('#app-threat .bigCount').removeClass("bigCount-4");
						$('#app-threat .smallCount').removeClass("smallCount-4");
					}
					
					
				}else{
					$("#app-threat").removeClass("warn");
				}
				
				if(chartValue.dailyProvider[1].count>0){
					$('#os-threat').addClass('warn');
					if(chartValue.dailyProvider[1].count>99){
						if(chartValue.dailyProvider[1].count>999){
							$('#os-threat .bigCount').addClass("bigCount-4");
							$('#os-threat .smallCount').addClass("smallCount-4");
						}else{
							$('#os-threat .bigCount').addClass("bigCount-3");
							$('#os-threat .smallCount').addClass("smallCount-3");
						}
					}else{
						$('#os-threat .bigCount').removeClass("bigCount-4");
						$('#os-threat .smallCount').removeClass("smallCount-4");
					}
					
					
				}else{
					$("#os-threat").removeClass("warn");
				}
				
				
				
				
				$("#app-forgery-count").html(chartValue.dailyProvider[0].distinctCount);
				$("#os-forgery-count").html(chartValue.dailyProvider[1].distinctCount);
				$("#app-forgery-count").html('<div class="bigCount">'
						+ chartValue.dailyProvider[0].distinctCount
						+ '</div>'
						+ '<div class="smallCount">'
						+ chartValue.dailyProvider[0].count
						+ "</div>");
				$("#os-forgery-count").html('<div class="bigCount">'
						+ chartValue.dailyProvider[1].distinctCount
						+ '</div>'
						+ '<div class="smallCount">'
						+ chartValue.dailyProvider[1].count
						+ "</div>");
				if(chartValue.recent.appName==""){
					$("#recent-app-name").text(getMessage("common.none","없음"));
				}else{
					$("#recent-app-name").text(chartValue.recent.appName);
				}
				if(chartValue.recent.blockedCauses==""){
					$("#recent-blocked-causes").text(getMessage("common.none","없음"));
				}else{
					$("#recent-blocked-causes").text(chartValue.recent.blockedCauses);
					
				}
				if(chartValue.recent.createdAt!=null){
					$("#recent-created-at").text(timeFormat(chartValue.recent.createdAt));
				}else{
					$("#recent-created-at").text(getMessage("common.none","없음"));
				}
				var clock = document.getElementById("updated-at");
			    var now = new Date();
			    clock.innerHTML = getMessage("common.lastUpdateTime","마지막 업데이트 시각") +" : "+ timeFormat(new Date())
			    
			    $($('#daily_all_block .amcharts-axis-title').children("tspan")[0]).attr('x','-20');
				$($('#weekly_all_block .weekAll-axis-title').children("tspan")[0]).attr('x','-20');
				$($('#monthly_all_block .monthAll-axis-title').children("tspan")[0]).attr('x','-20');
				

			},
			error : function(e) {
				alert(e.responseJSON.message);
				
			}
			

		});
	}
function fn_counterup_refresh() {

	if (!$().counterUp) {
		return;
	}

	$("[data-counter='counterup']").counterUp({
		delay : 10,
		time : 1000
	});

}
