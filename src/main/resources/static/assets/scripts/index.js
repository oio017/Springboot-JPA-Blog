var $scriptDiv = $('#scriptDiv');
$scriptDiv
		.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>');
$scriptDiv
		.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$scriptDiv
		.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>');
$scriptDiv
		.append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/amcharts.js"></script>');
$scriptDiv
		.append('<script type="text/javascript" src="/assets/global/plugins/amcharts/amcharts/pie.js"></script>');
$scriptDiv
		.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>');

var standardDate = new Date();
var appId;
var startDate;
var endDate;
var table = $('#block-each-app-table');
var distinctTable = $('#block-each-app-table-distinct');
var extensionTable = $('#extension-block-each-app-table');
var oTable;
var vTable;
var eTable;
var organId;
var organList;
var appList;
var isSuper = ($('#isSuper').val()=='true');
var noticeExists = false;
var appNoticeExists = false;

var threatBooleanMap;
var invisibleFieldArray = [];
//change button className
$.fn.dataTable.Buttons.defaults.dom.button.className="btn btn-default";
$.fn.dataTable.Buttons.defaults.dom.button.tag="a";


var checkUsingNoticeAndSetEvents = function(){
	var globalNoticeBool = getNoticeGlobalBooleanCookieWithId();
	if(globalNoticeBool===undefined){
		setNoticeGlobalBooleanCookieWithId(true)
		globalNoticeBool = true;
	}
	if(globalNoticeBool){
		$('input:checkbox[id="notice-toggle-bool"]').prop("checked", true);
	}else{
		$('input:checkbox[id="notice-toggle-bool"]').prop("checked", false);
	}

	$("#notice-toggle-bool").change(function(){
		if($("#notice-toggle-bool").is(":checked")){
			setNoticeGlobalBooleanCookieWithId(true);
			makeModalTable();
			if(noticeExists){
				$("#notice-modal").modal();
			}
			clearNoticePreventLimitCookieWithId()
		}else{
			setNoticeGlobalBooleanCookieWithId(false);

		}
	});

}
var setNoticeGlobalBooleanCookieWithId = function(bool){
	var userPk = $("#user-pk").val();
	var globalNoticeBooleanMapString = getCookie("globalNoticeBooleanMap");
	if(globalNoticeBooleanMapString===""){
		globalNoticeBooleanMapString = "{}";
	}
	var globalNoticeBooleanMap = JSON.parse(globalNoticeBooleanMapString);
	globalNoticeBooleanMap[userPk] = bool;
	setCookie("globalNoticeBooleanMap", JSON.stringify(globalNoticeBooleanMap));
}
var getNoticeGlobalBooleanCookieWithId = function(){
	var userPk = $("#user-pk").val();
	var globalNoticeBooleanMapString = getCookie("globalNoticeBooleanMap");
	if(globalNoticeBooleanMapString===""){
		globalNoticeBooleanMapString = "{}";
	}

	var globalNoticeBooleanMap = JSON.parse(globalNoticeBooleanMapString);
	return globalNoticeBooleanMap[userPk];
}


var checkCookieForNoticeModal = function(){
	if($("#notice-toggle-bool").is(":checked")){

	}else{
		return;
	}
	if($("#use-notice-app-module").val()==="true"){

	}else{
		return;
	}

	var noticeBoolean = getNoticeBooleanCookieWithId();
	if(noticeBoolean===null || noticeBoolean=== undefined || noticeBoolean===""){
		//noticeBoolean 이 세팅 되지 않았을 경우
		setNoticeBooleanCookieWithId( "true")
		//무조건 true 반환
		return true;
	}else{
		//noticeBoolean이 세팅되어 있는경우
		if(noticeBoolean==true){
			return false;
		}else{
			var ignoreLimitDate = getNoticePreventLimitCookieWithId();
			if(ignoreLimitDate===null||ignoreLimitDate===undefined||ignoreLimitDate===""){
				return true;
			}else{
				//현재시각의 00시 > 세팅된 무시 날짜의 00시 즉 무시 해야 하는 날보다 오늘이 더 지났을 경우
				if(new Date()>new Date(parseInt(ignoreLimitDate))){
					clearNoticePreventLimitCookieWithId();
					return true;
				}
			}
		}

	}

}
var setNoticeBooleanCookieWithId = function(bool){
	var userPk = $("#user-pk").val();
	var noticeBooleanMapString = getCookie("noticeBooleanMap");
	if(noticeBooleanMapString===""){
		noticeBooleanMapString = "{}";
	}
	var noticeBooleanMap = JSON.parse(noticeBooleanMapString);
	noticeBooleanMap[userPk] = bool;
	setCookie("noticeBooleanMap", JSON.stringify(noticeBooleanMap))

}

var getNoticeBooleanCookieWithId = function(){
	var userPk = $("#user-pk").val();
	var noticeBooleanMapString = getCookie("noticeBooleanMap");
	if(noticeBooleanMapString===""){
		noticeBooleanMapString = "{}";
	}

	var noticeBooleanMap = JSON.parse(noticeBooleanMapString);
	return noticeBooleanMap[userPk];
}

var setNoticePreventLimitCookieWithId = function(limitDateTime){
	var userPk = $("#user-pk").val();
	var noticeExpTimeMapString = getCookie("noticeExpTimeMap");
	if(noticeExpTimeMapString===""){
		noticeExpTimeMapString = "{}";
	}
	var noticeExpTimeMap = JSON.parse(noticeExpTimeMapString);
	noticeExpTimeMap[userPk] = limitDateTime;
	setCookie("noticeExpTimeMap", JSON.stringify(noticeExpTimeMap))

}
var clearNoticePreventLimitCookieWithId = function(){
	var userPk = $("#user-pk").val();
	var noticeExpTimeMapString = getCookie("noticeExpTimeMap");
	if(noticeExpTimeMapString===""){
		noticeExpTimeMapString = "{}";
	}
	var noticeExpTimeMap = JSON.parse(noticeExpTimeMapString);
	noticeExpTimeMap[userPk] = null;
	setCookie("noticeExpTimeMap", JSON.stringify(noticeExpTimeMap))

}

var getNoticePreventLimitCookieWithId = function(){
	var userPk = $("#user-pk").val();
	var noticeExpTimeMapString = getCookie("noticeExpTimeMap");
	if(noticeExpTimeMapString===""){
		noticeExpTimeMapString = "{}";
	}

	var noticeExpTimeMap = JSON.parse(noticeExpTimeMapString);
	return noticeExpTimeMap[userPk];
}

var makeModalTable = function(){
	var usingAppModuleCheck = $("#use-notice-app-module").val() === "true";
	var defaultHtmlString = '<tr class="table-header">'+$("#notice-app-version-table > tbody > .table-header").html()+'</tr>';
	var $tAppBody = $("#notice-app-version-table > tbody")
	$tAppBody.html(defaultHtmlString);

	$.ajax({
		type: 'GET',
		url: '/api/notice',
		async: false,
		success: function (returnValue) {
			console.log(returnValue)
			if(returnValue.length===0){
				noticeExists = false
				return
			}else{
				noticeExists = true;
			}

			console.log(appNoticeExists);
			for(var i in returnValue){
				if(usingAppModuleCheck&&returnValue[i]["type"]==="APP_EXPIRED"){
					console.log("dd", appNoticeExists)
					appNoticeExists = true;
					$tAppBody.append("<tr class='table-contents'>" +
						"<td>" + returnValue[i].organName +
						"</td><td>" + (returnValue[i].deviceType=='android'?"Android":"iOS") +
						"</td><td>" + returnValue[i].appName +
						"</td><td>" + returnValue[i].packageName +
						"</td><td>" + returnValue[i].appVersion +
						"</td><td>" + timeFormat(returnValue[i].modDate)+
						"</td></tr>")
				}
			}
			if(appNoticeExists){

			}else{
				$("#appModuleExpireModalDiv").html("")
			}
		},
		error: function (e) {
			alert(e.responseJSON.message);
		}

	});

}

var initNoticeModalEvent = function(){
	//TODO 오늘, 일주일 값 체크되는 이벤트에 대해서 각각 상호에 대해 체크를 해제하는 이벤트 세팅


	$('#notice-modal').on('hidden.bs.modal', function (e) {
		var isCloseToday = $("#not-open-for-today").is(":checked");
		var isCloseWeek = $("#not-open-for-week").is(":checked");
		setCloseInfoToCookie(isCloseToday, isCloseWeek);
		$("#not-open-for-week").prop("checked", false);
		$("#not-open-for-today").prop("checked", false);

	});
	$("#not-open-for-today").change(function(){
		if($("#not-open-for-today").is(":checked")){
			$("#not-open-for-week").prop("checked", false);
		}
		console.log(this)
	})
	$("#not-open-for-week").change(function(){
		if($("#not-open-for-week").is(":checked")){
			$("#not-open-for-today").prop("checked", false);
		}
		console.log(this)
	})

}

var setCloseInfoToCookie = function(isCloseToday, isCloseWeek){
	if(isCloseWeek){
		console.log("isCloseToday", isCloseToday)
		var endDate = new Date();
		endDate.setHours(23,59,59,999);
		endDate.setDate(new Date().getDate()+6)
		setNoticeBooleanCookieWithId(false)
		setNoticePreventLimitCookieWithId(endDate.getTime())
	}
	if(isCloseToday){
		console.log("isCloseWeek", isCloseWeek)
		var endDate = new Date();
		endDate.setHours(23,59,59,999);
		setNoticeBooleanCookieWithId(false)
		setNoticePreventLimitCookieWithId(endDate.getTime())
	}

}
var initOrganNameList = function() {
	$.ajax({
		type : 'GET',
		url : '/api/chart/organ',
		async : false,
		success : function(returnValue) {
		organList = returnValue;
			$(returnValue).each(
					function(i) {
						if (returnValue[i].id <= 0) {

						} else {
							$('#organ-select').append(
									'<option value="' + returnValue[i].id
											+ '">' + returnValue[i].organName
											+ '</option>')
						}
					});
		},
		error : function(e) {
			console.log(e)
		}
	});
}
var appListInit = function() {
	var data = new Object;
	data.organId = organId;
	$.ajax({
		type : 'GET',
		url : '/api/app/list',
		data : data,
		async : false,
		success : function(returnValue) {
			appList = returnValue;
			var result = "<option value=''> "+getMessage("common.allApps","전체 앱")+"</option>";
			for (var i = 0; i < returnValue.length; i++) {
				result += '<option value="' + returnValue[i].id + '">'
						+ returnValue[i].appName + '</option>'
			}
			$('#app-list').html("");
			$('#app-list').html(result);

			$('#app-list').change(function() {
				appId = $(this).val();
				// chartInit();

			});
		},
		error : function(e) {
			alert(e.responseJSON.message)
		}
	});
}
var initThreatBooleanMap = function(){
	$.ajax({
		type:'GET',
		url:'/api/properties/threatBooleanMap',
		async : false,
		success : function(returnValue){
			threatBooleanMap = returnValue;
		},
		error:function(e){
			alert(e.responseJSON.message);
		}
	});

	threatBooleanMap;
}
var initTableStructure = function(){
	var topBoxDivCount=0;
	var underBoxDivCount=0;
	Object.keys(threatBooleanMap).forEach(function(key,index){
		if(key=='threatOsForgeryResult'&&threatBooleanMap[key]){
			topBoxDivCount++;
			$('#threatOsForgeryResult-div').removeClass('hidden');
			// $('#threatOsForgeryResult-div').css("","");
		}
		if(key=='threatAppForgeryResult'&&threatBooleanMap[key]){
			topBoxDivCount++;
			$('#threatAppForgeryResult-div').removeClass('hidden');
		}
		if(key=='threatCustomromResult'&&threatBooleanMap[key]){
			topBoxDivCount++;
			$('#threatCustomromResult-div').removeClass('hidden');
		}
		if(key=='threatEmulatorResult'&&threatBooleanMap[key]){
			topBoxDivCount++;
			$('#threatEmulatorResult-div').removeClass('hidden');
		}
		if(key=='threatDebuggerResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatDebuggerResult-div').removeClass('hidden');
		}
		if(key=='threatAdbResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatAdbResult-div').removeClass('hidden');
		}
		if(key=='threatSessionForgeryResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatSessionForgeryResult-div').removeClass('hidden');
		}
		if(key=='threatProxyResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatProxyResult-div').removeClass('hidden');
		}
		if(key=='threatRemoteAppInstResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatRemoteAppInstResult-div').removeClass('hidden');
		}
		if(key=='threatRemoteAppRunResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatRemoteAppRunResult-div').removeClass('hidden');
		}

		if(key=='threatUsbResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatUsbResult-div').removeClass('hidden');
		}
		if(key=='threatWifiResult'&&threatBooleanMap[key]){
			underBoxDivCount++;
			$('#threatWifiResult-div').removeClass('hidden');
		}
//		if(key=='threatBlacklistResult'&&threatBooleanMap[key]){
//			underBoxDivCount++;
//			$('#threatBlacklistResult-div').removeClass('hidden');
//		}

	});
/*	$('#top-box-div').children().css('width', 1/topBoxDivCount*100+'%');
	$('#under-box-div').children().css('width', 1/underBoxDivCount*100+'%');*/


}
var initInvisibleColumnNumberArray = function(){
	Object.keys(threatBooleanMap).forEach(function(key,index){
		if(key=='threatOsForgeryResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(5);
		}
		if(key=='threatAppForgeryResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(4);
		}
		if(key=='threatCustomromResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(6);
		}
		if(key=='threatEmulatorResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(7);
		}
		if(key=='threatDebuggerResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(8);
		}
		if(key=='threatAdbResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(9);
		}
		if(key=='threatSessionForgeryResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(12);
		}
		if(key=='threatProxyResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(13);
		}
		if(key=='threatRemoteAppInstResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(14);
		}
		if(key=='threatRemoteAppRunResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(14);
		}
		if(key=='threatUsbResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(10);
		}
		if(key=='threatWifiResult'&&!threatBooleanMap[key]){
			invisibleFieldArray.push(11);
		}
	});
}
var initFunction = function() {
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
								"locale" : {
									"format" : "YYYY. MM. DD.",
									"separator" : " - ",
									"applyLabel" : getMessage("common.apply","적용"),
									"cancelLabel" : getMessage("common.cancel","취소"),
									"fromLabel" : "From",
									"toLabel" : "To",
									"customRangeLabel" : "Custom",
									"weekLabel" : "W",
									"daysOfWeek" : [ getMessage("common.dayOfWeek.sun","일"), getMessage("common.dayOfWeek.mon","월"), getMessage("common.dayOfWeek.tue","화"), getMessage("common.dayOfWeek.wed","수"), getMessage("common.dayOfWeek.thu","목"),
										getMessage("common.dayOfWeek.fri","금"), getMessage("common.dayOfWeek.sat","토") ],
									"monthNames" : [ getMessage("common.monthOfYear.jan","1월"), getMessage("common.monthOfYear.feb","2월"), getMessage("common.monthOfYear.mar","3월"), getMessage("common.monthOfYear.apr","4월"),
											getMessage("common.monthOfYear.may","5월"), getMessage("common.monthOfYear.jun","6월"), getMessage("common.monthOfYear.jul","7월"), getMessage("common.monthOfYear.aug","8월"), getMessage("common.monthOfYear.sep","9월"),
													getMessage("common.monthOfYear.oct","10월"), getMessage("common.monthOfYear.nov","11월"), getMessage("common.monthOfYear.dec","12월") ],									"firstDay" : 1
								},
								"startDate" : startDate,
								"endDate" : endDate,
							},
							function(start, end, label) {
								if (moment() < moment(getEndDate(end))
										.subtract('days', 1)) {
									alert(getMessage("common.datePicker.overDatePickedErrorMessage", "오늘 이후날자로는 검색할수 없습니다."));
									return;
								}
								startDate = getStartDate(start);
								endDate = getEndDate(end);
								setCurrentDateRange(startDate, endDate);
								console.log(getDaysDifference(start, end))
                                if(getDaysDifference(start, end)>4){
                                    endDate = startDate
                                    setCurrentDateRange(startDate, startDate);
                                    alert(getMessage('log.search.periodMessage5days','검색 기간의 최대 범위는 5일 입니다.'));
                                }
							});
			$('#dashboard-report-range').show();
			$('#dashboard-report-range').bind('click.leftButton', function() {
				$(".calendar-table .fa-angle-left").click();
				$('#dashboard-report-range').unbind('.leftButton');
			});
		},
		clickEventInit : function() {
			$('#organ-select').change(function() {
				organId = $(this).val();
				appId = $('#app-list').val();
				appListInit();

			});
			$('#index-search-button')
					.click(
							function(e) {
								// $('#index-search-form').attr({action:'/api/index',
								// method:'GET'}).submit();
								var data = new Object;
								data.appId = appId;
								data.startDate = startDate;
								data.endDate = endDate;
								data.organId = organId;
								console.log(data)
								$
										.ajax({
											url : '/api/index',
											data : data,
											type : 'GET',
                                            beforeSend: function(){
												$('#loadingGif').show();
                                                $('#index-search-button').attr("disabled","disabled");
											},
											complete : function(){
                                                $('#loadingGif').hide();
                                                $('#index-search-button').removeAttr("disabled");
											},
											success : function(result) {
												console.log(result)
												for (var i = 0; i < result.chartProvider.length; i++) {
													$('#'+ result.chartProvider[i].threat)
															.html(
																	'<div class="bigCount">'
																			+ result.chartProvider[i].distinctCount
																			+ '</div>'
																			+ '<div class="smallCount">'
																			+ result.chartProvider[i].count
																			+ "</div>");

													if (result.chartProvider[i].distinctCount > 0) {
														$('#'+ result.chartProvider[i].threat)
																.addClass(
																		"warn");
														if (result.chartProvider[i].distinctCount > 99) {
															if (result.chartProvider[i].distinctCount > 999) {
																$('#'+ result.chartProvider[i].threat + " .bigCount")
																		.addClass("bigCount-4");
																$('#'+ result.chartProvider[i].threat + " .smallCount")
																		.addClass("smallCount-4");
															} else {$('#'+ result.chartProvider[i].threat + " .bigCount")
																		.addClass("bigCount-3");
																$('#'+ result.chartProvider[i].threat + " .smallCount")
																		.addClass("smallCount-3");
															}

														} else {
															$('#'+ result.chartProvider[i].threat
																			+ " .bigCount")
																	.removeClass(
																			"bigCount-4 bigCount-3");
															$('#'+ result.chartProvider[i].threat
																			+ " .smallCount")
																	.removeClass(
																			"smallCount-4 smallCount-3");
														}
													} else {
														$('#'+ result.chartProvider[i].threat)
																.removeClass(
																		"warn");
													}
												}
												makeTable(result);
												var isEmpty = true;
												for (var i = 0; i < result.chartProvider.length; i++) {
													if (result.chartProvider[i].count != 0) {
														isEmpty = false;
														break;
													}
												}
												if (isEmpty) {
													indexChart.dataProvider = [ {
														"color" : "#2B3643",
														"count" : 1,
														"threat" : "없음",
														"option" : "없음"
													} ];

												} else {
													indexChart.dataProvider = result.chartProvider;
												}

												indexChart.validateData();

												// 차트 라벨 커스텀
												$('.indexChart-pie-label')
														.each(
																function(key,
																		value) {
																	$(
																			$(
																					value)
																					.children()[1])
																			.addClass(
																					"chart-percent")
																});
												$('.indexChart-pie-label')
														.each(
																function(key,
																		value) {
																	$(
																			$(
																					value)
																					.children()[0])
																			.attr(
																					"y",
																					0)
																});
												table.children('td').unbind();
												table
														.on(
																'click',
																'td',
																function(e) {
																	e.preventDefault();
																	var nRow = $(this)
																			.parents('tr')[0];
																	$('#app-list').val(oTable.row(nRow).data()["appId"]);
																	$('#cellIndex').val($(this)[0]._DT_CellIndex["column"]);
																	$('#startDate').val(startDate);
																	$('#endDate').val(endDate);
																	$('#organId').val(organId);
																	$('#index-search-form').submit();
																	var form = document
																			.createElement('form');
																	form.page
																	$('#app-list').val("");
																});
												distinctTable.unbind();
												distinctTable
														.on(
																'click',
																'td',
																function(e) {
																	e
																			.preventDefault();
																	var nRow = $(
																			this)
																			.parents(
																					'tr')[0];
																	$(
																			'#app-list')
																			.val(
																					vTable
																							.row(
																									nRow)
																							.data()["appId"]);
																	$(
																			'#cellIndex')
																			.val(
																					$(this)[0]._DT_CellIndex["column"]);
																	$(
																			'#startDate')
																			.val(
																					startDate);
																	$(
																			'#endDate')
																			.val(
																					endDate);
																	$(
																			'#organId')
																			.val(
																					organId);
																	$(
																			'#index-search-form')
																			.submit();
																	var form = document
																			.createElement('form');
																	form.page
																});
												if(1==1){
													$('#index-extension-distinct-all-count').text(" "+(result.extensionInfo.all.distinct["all"]?result.extensionInfo.all.distinct["all"]:0));
													$('#index-extension-distinct-all-count-android').text(" "+(result.extensionInfo.all.distinct["android"]?result.extensionInfo.all.distinct["android"]:0));
													$('#index-extension-distinct-all-count-apple').text(" "+(result.extensionInfo.all.distinct["ios"]?result.extensionInfo.all.distinct["ios"]:0));
													$('#index-extension-distinct-all-count-na').text(" "+(result.extensionInfo.all.distinct["N/A"]?result.extensionInfo.all.distinct["N/A"]:0));
                                                    $('#index-extension-all-count').text(" "+(result.extensionInfo.all.normal["all"]?result.extensionInfo.all.normal["all"]:0));
                                                    $('#index-extension-all-count-android').text(" "+(result.extensionInfo.all.normal["android"]?result.extensionInfo.all.normal["android"]:0));
                                                    $('#index-extesion-all-count-apple').text(" "+(result.extensionInfo.all.normal["ios"]?result.extensionInfo.all.normal["ios"]:0));
													$('#index-extension-all-count-na').text(" "+(result.extensionInfo.all.normal["N/A"]?result.extensionInfo.all.normal["N/A"]:0));
													for(var i=0; i<4; i++){
														$("#extension-"+i).html(
                                                            '<div class="bigCount">'
                                                            + (result.extensionInfo.byStatus.distinct[i]?result.extensionInfo.byStatus.distinct[i]:0)
                                                            + '</div>'
                                                            + '<div class="smallCount">'
                                                            + (result.extensionInfo.byStatus.normal[i]?result.extensionInfo.byStatus.normal[i]:0)
                                                            + "</div>"
														)
													}
													// if(result.extensionInfo[]
													makeExtensionTable(result);




                                                }
											},
											error : function(e) {
												alert(e.responseJSON.message);
											}
										});

								e.preventDefault();

							});

		},
		init : function() {
			this.initSearhDate();
			this.initDashboardDaterange();
			// this.initCreateTable()
			this.clickEventInit();
			// this.table().init();

		}
	}
}

jQuery(document).ready(
		function() {
			initNoticeModalEvent();
			// Dashboard.init(); // init metronic core componets
			var date = new Date();
			var dateString = date.getFullYear() + "/" + (date.getMonth() + 1)
					+ "/" + date.getDate();

			$("#dashboard-date-picker").val(dateString);
			$("#standard-date").val(dateString);
			initOrganNameList();
			initFunction().init();
            organId = $('#organ-select').val();
			appListInit();
			$('#index-search-button').click();
			initThreatBooleanMap();
			initInvisibleColumnNumberArray();
			initTableStructure();
			// appListEventInit();
			if($("#isUsingNotice").val()==="true"){
				checkUsingNoticeAndSetEvents()
				if(checkCookieForNoticeModal()){
					makeModalTable()
					console.log(noticeExists)
					if(noticeExists){
						$("#notice-modal").modal();
					}else{

					}
				}
			}

		});

var indexChart = AmCharts
		.makeChart(
				"index-chart",
				{
					"type" : "pie",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
					"innerRadius" : "40%",
					"labelRadius" : -50,
					"labelText" : "[[title]]<br> [[percents]]%",
					"radius" : "50%",
					"startRadius" : "20%",
					"colorField" : "color",
					"maxLabelWidth" : 157,
					"pullOutEffect" : "elastic",
					"sequencedAnimation" : false,
					"titleField" : "option",
					"urlTarget" : "",
					"valueField" : "count",
					"addClassNames" : true,
					"classNamePrefix" : "indexChart",
					"color" : "#FFFFFF",
					"fontSize" : 18,
					"path" : "",
					"percentPrecision" : 0,
					"precision" : 0,
					"autoResize" : true,
					"allLabels" : [ {
						"align" : "center",
						"bold" : true,
						"id" : "title1",
						"text" : "차단",
						"x" : 0,
						"y" : "44%"
					}, {
						"align" : "center",
						"bold" : true,
						"id" : "title2",
						"text" : "항목 비율",
						"y" : "52%"
					} ],
					"balloon" : {},
					"titles" : [],
					"dataProvider" : [ {
						"color" : "#736458",
						"count" : 0,
						"threat" : "app-threat",
						"option" : "앱 위변조"
					}, {
						"color" : "#F389B0",
						"count" : 0,
						"threat" : "os-threat",
						"option" : "OS 위변조"
					}, {
						"color" : "#F389FF",
						"count" : 0,
						"threat" : "customrom-threat",
						"option" : "커스텀 롬"
					}, {
						"color" : "#0002ff",
						"count" : 0,
						"threat" : "emulator-threat",
						"option" : "에뮬레이터"
					}, {
						"color" : "#3C3E51",
						"count" : 0,
						"threat" : "debugger-threat",
						"option" : "디버거"
					}, {
						"color" : "#25AAE1",
						"count" : 0,
						"threat" : "adb-threat",
						"option" : "ADB"
					}, {
						"color" : "#FCB03B",
						"count" : 0,
						"threat" : "usb-threat",
						"option" : "USB"
					}, {
						"color" : "#F15C57",
						"count" : 0,
						"threat" : "wifi-threat",
						"option" : "WiFi"
					}, {
						"color" : "#2FB8A3",
						"count" : 0,
						"threat" : "session-threat",
						"option" : "세션 위변조"
					}, {
						"color" : "#2dff00",
						"count" : 0,
						"threat" : "proxy-threat",
						"option" : "Proxy"
					}, {
						"color" : "#fffe00",
						"count" : 0,
						"threat" : "remoteAppInst-threat",
						"option" : "RemoteAppInst"
					}, {
						"color" : "#ffd2b6",
						"count" : 0,
						"threat" : "remoteAppRun-threat",
						"option" : "RemoteAppRun"
					} ]
				});

var getStartDate = function(time) {
	time = tryToGetDate(time);
	if (!time) {
		return null;
	}
	time.setDate(time.getDate());
	time.setHours(0);
	time.setMinutes(0);
	time.setSeconds(0);
	time.setMilliseconds(0);

	return time;
}

var getEndDate = function(time) {
	time = tryToGetDate(time);
	if (!time) {

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

var tryToGetDate = function(stuff) {
	if (!stuff) {
		return new Date();
	}

	if (stuff instanceof Date) {
		return stuff;
	}

	if (Math.floor(stuff) == stuff && $.isNumeric(stuff)) {
		return new Date(stuff);
	}

	stuff = Date.parse(stuff);

	if (Math.floor(stuff) == stuff && $.isNumeric(stuff)) {
		return new Date(stuff);
	}

	return null;
}
var setCurrentDateRange = function(start, end) {
	// $('#dashboard-report-range span').html(start.format('YYYY.MM.DD') + ' - '
	// + end.format('YYYY.MM.DD'));
	$('#dashboard-report-range span').html(
			getFormatDateString(start) + ' ~ ' + getFormatDateString(end));

	$('#startDate').val(start);
	$('#endDate').val(end);
}
var getFormatDateString = function(date, separator) {
	if (!separator) {
		separator = '. ';
	}
	if (date instanceof Date) {
		return dateFormat(date);
	}
	return "";
}

function makeTable(returnValue) {
	$("#index-distinct-all-count").text(
			returnValue.chartProvider[0].distinctCount);
	$("#index-all-count").text(returnValue.chartProvider[0].count);
	$("#index-distinct-all-count-android").text(" " + returnValue.chartProvider[0].allAndroidCountDistinct);
	$("#index-distinct-all-count-apple").text(" " + returnValue.chartProvider[0].allIosCountDistinct);
	$("#index-all-count-android").text(" " + returnValue.chartProvider[0].allAndroidCount);
	$("#index-all-count-apple").text(" " + returnValue.chartProvider[0].allIosCount);
	oTable = table.DataTable({
		destroy : true,
		"autoWidth" : false,
		"pageLength" : -1,
		data : returnValue.tableValues,
		columns : [ null, null,null,null,null,null,null,null,null,null,null, null,null,null,null, null],
		"columnDefs" : [
			{
				'data' : function(row, type, val, meta) {
					var fieldList = [ "orgId", "appName", "threatSum", "blockedUser",
						"threatAppForgeryResult",
						"threatOsForgeryResult",
						"threatCustomromResult",
						"threatEmulatorResult",
						"threatDebuggerResult", "threatAdbResult",
						"threatUsbResult", "threatWifiResult",
						"threatSessionForgeryResult", "threatProxyResult","threatRemoteAppRunResult","threatRemoteAppInstResult" ]
					//숫자 그대로 내보낼 시 excel 0이 아예 안들어가는 datatables버그 때문에 toString()
					return row[fieldList[meta.col]].toString();
				},
				'targets' : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13, 14, 15 ]
			},
				{
					'render' : function(data, type, row, meta) {
						organName = "N/A"
						for ( var organ in organList) {
							if (organList[organ].id == data) {
								organName = organList[organ].organName;
							}
						}

						return '<div class="small-font">'+organName+'</div>';
					},
					'visible' : ((isSuper) ? true : false),
					'width' : "8%",
					'targets' : [ 0 ]
				},
				{
					'render' : function(data, type, row, meta) {
						if (row.deviceType.toLowerCase() == 'android') {
							return '<i class="fa fa-android"> &nbsp;  </i>'
									+ data
						} else {
							return '<i class="fa fa-apple"> &nbsp;  </i>'
									+ data
						}
						// return data;
					},
					'width' : "10%",
					'targets' : [ 1 ]
				},
				{
					'render' : function(data, type, row, meta) {
						if (data > 0) {
							return "<span class='warn'>" + data + "</span>";
						}
						return data;
					},
					'targets' : [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14,15 ]
				},
                {
					'render' : function(data, type, row, meta) {
						if (data > 0) {
							return "<span class='warn'>" + data + "</span>";
						}
						return data;
					},
					'visible' : false,
					'targets' : invisibleFieldArray
                },

				 ],
		"order" : [ [ 0, "asc" ] ],
		buttons : [  {
            extend: 'excelHtml5',
            exportOptions: {
                columns: [ ':visible' ]
            }
        } ],
		dom : "<'row' <'col-md-12'B>><'row'<'col-sm-12'tr>>"
	});


}

function makeExtensionTable(returnValue) {
    $("#index-distinct-all-count").text(
        returnValue.chartProvider[0].distinctCount);
    $("#index-all-count").text(returnValue.chartProvider[0].count);
    $("#index-distinct-all-count-android").text(" " + returnValue.chartProvider[0].allAndroidCountDistinct);
    $("#index-distinct-all-count-apple").text(" " + returnValue.chartProvider[0].allIosCountDistinct);
    $("#index-all-count-android").text(" " + returnValue.chartProvider[0].allAndroidCount);
    $("#index-all-count-apple").text(" " + returnValue.chartProvider[0].allIosCount);

    console.log(returnValue.extensionInfo.byApp)
    eTable = extensionTable.DataTable({
        destroy : true,
        "autoWidth" : false,
        "pageLength" : -1,
        data : returnValue.extensionInfo.byApp,
        columns : [ {data:"organId"},{data:"appName"}, {data:"blockSum"},{data:"blockedUser"},{data:"normalTokenBlock"},{data:"invalidTokenBlock"},{data:"emergencyTokenBlock"},{data:"timeoverTokenBlock"}],
        "columnDefs" : [
            {
                'render' : function(data, type, row, meta) {
                    organName = "N/A"
                    for ( var organ in organList) {
                        if (organList[organ].id == data && data!=0) {
                            organName = organList[organ].organName;
                        }
                    }
                    return '<div class="small-font">'+organName+'</div>';
                },
                'visible' : ((isSuper) ? true : false),
                // 'width' : "8%",
                'targets' : [ 0 ]
            },
            {
                'render' : function(data, type, row, meta) {
                    if (data!=0 && row.deviceType!=null &&row.deviceType.toLowerCase() == 'android') {
                        return '<i class="fa fa-android"> &nbsp;  </i>'
                            + data
                    } else if(data!=0 && row.deviceType!=null && row.deviceType.toLowerCase() == 'ios'){
                        return '<i class="fa fa-apple"> &nbsp;  </i>'
                            + data
                    }else{
                        return "N/A";
					}
                    // return data;
                },
                // 'width' : "10%",
                'targets' : [ 1 ]
            },
            {
                'render' : function(data, type, row, meta) {
                    if (data > 0) {
                        return "<span class='warn'>" + data + "</span>";
                    }
                    return data;
                },
                'targets' : [ 2, 3, 4, 5, 6, 7 ]
            },
            // {
            //     'render' : function(data, type, row, meta) {
            //         if (data > 0) {
            //             return "<span class='warn'>" + data + "</span>";
            //         }
            //         return data;
            //     },
            //     'visible' : false,
            //     'targets' : invisibleFieldArray
            // },
        ],
        "order" : [ [ 0, "asc" ] ],
        buttons : [  {
            extend: 'excelHtml5',
            exportOptions: {
                columns: [ ':visible' ]
            }
        } ],
        dom : "<'row' <'col-md-12'B>><'row'<'col-sm-12'tr>>"
    });


}