var $scriptDiv = $('#scriptDiv');
$scriptDiv.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>');
$scriptDiv
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>');
$scriptDiv
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Select-1.2.0/js/dataTables.select.js"></script>');
$scriptDiv
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>');
$scriptDiv
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>');
$scriptDiv
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>');
$scriptDiv
		.append(
				'<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>');
$scriptDiv.append('<script type="text/javascript" src="/assets/scripts/jquery.spring-friendly.js"></script>');
var table = $('#detection-table');
var oTable;
var startDate;
var endDate;
var searchColumn = "";
var searchKeyword = "";
var test;
var appId;
var organId;
var organNames;
var detectionLogReasonMap;
var detectionLogStatusMap;
var appVersionMap = new Object();;
var appNameMap = new Object();
var searchReq = new Object;

var maskingMap = {
	"00000001" : "MANUFACTURER",
	"00000010" : "BOARD",
	"00000100" : "BOOTLOADER",
	"00001000" : "MODEL",
	"00010000" : "HARDWARE",
	"00100000" : "PRODUCT",
	"01000000" : "SERIAL"
}
//var defaultStatus = {1: "탐지",2: "차단"};
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
			var result = "<option value=''> "+getMessage('common.allApps','전체 앱')+"</option>" ;
			for(var i=0; i<appList.length; i++){
                appNameMap[appList[i].id] = appList[i].appName;
				if(appList[i].id==appId){
					result+='<option value="'+appList[i].id+'" selected="selected" >'+appList[i].appName+'</option>'
				}else{
					result+='<option value="'+appList[i].id+'">'+appList[i].appName+'</option>'
				}
			}
            $('#app-list').unbind();
			$('#app-list').html("");
			$('#app-list').html(result);
			$('#app-list').change(function(e){
				appId=$(this).val();
				//chartInit();
			});
			//$('.selectpicker').selectpicker('render');
		},
		error : function(e){
			alert(e.responseJSON.message);
		}
	});
    // console.log(appNameMap);
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
var usingResonInit = function(){
	$.ajax({
		type:'GET',
		url:'/api/properties/threatMap',
		async:false,
		success : function(returnValue){
			detectionLogReasonMap= returnValue;
		},
		error:function(e){
			alert(e.responseJSON.message);
		}
	});
}
var statusMapInit = function(){
	$.ajax({
		type:'GET',
		url:'/api/properties/statusMap',
		success : function(returnValue){
			detectionLogStatusMap = returnValue;
		},
		error:function(e){
			alert(e.responseJSON.message);
		}
	});
}


var statusArray = {
	"0":"",
	"1":"탐지",
	"2":"차단"
};


var getReasons = function(row,	status) {
	var list = new Array();
	var keys = Object.keys(row);
	var detectionType = "";
	var reason = "";
	
	for ( var item in keys) {
		detectionType = keys[item];
		reason = detectionLogReasonMap[detectionType];
		if($.trim(reason).length > 0 && reason != null && reason != undefined){
			if(row[detectionType] == status)
				list.push(reason);
		}
	}
	return list.join(", ");
}

var getBlockingReasons = function(row) {
	return getReasons(row, 2)
}

var getDetectionReasons = function(row) {
	return getReasons(row, 1);
}


var getQueryData = function() {
	var data = $('#search-params').serializeJSON();

	searchReq.appId = data.appId;
	searchReq.organId = data.organId;
	searchReq.startDate=getStartDate(data.startDate);
	searchReq.endDate=getEndDate(data.endDate);
	searchReq.searchColumn=$('#search_column').val();
	searchReq.searchKeyword=$('#detection-search-input').val();
	if($('input[id="deviceUniqueCheckBox"]:checked').length){
		searchReq.deviceUniqueByDeviceId=true;
	}else{
		searchReq.deviceUniqueByDeviceId=false;
	}
	if($('input[id="deviceUniqueAndResultCheckBox"]:checked').length){
		searchReq.deviceUniqueByDeviceIdAndOption=true;
	}else{
		searchReq.deviceUniqueByDeviceIdAndOption=false;
	}
	var blocks = new Object;
	var detects = new Object;
	var allDp=0;
	$('.blocks').each(function(){
		if($(this).is(":checked")){
			allDp++;
			blocks[$(this).val()]=1;
		}else{
			
			blocks[$(this).val()]=0;
		}
		//blocks.push(item);
	});
	$('.detects').each(function(){
		if($(this).is(":checked")){
			allDp++;
			detects[$(this).val()]=1
		}else{
			detects[$(this).val()]=0
		}
	});

	
	searchReq.allDp=allDp;
	searchReq.blocks=blocks;
	searchReq.detects=detects;
	
//	console.log(searchReq)
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
	}
}



var InitFunction = function() {
	return {
		initSearchDate : function() {
			//넘어온 파라미터가 있을 때
//			console.log($("#date-label" ).data("startdate"));
//			console.log($("#date-label" ).data("enddate"));
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
//			console.log(startDate)
			setCurrentDateRange(startDate, endDate);																
//
//			console.log('시작 날짜 : ' + startDate + ' 종료 날짜' + endDate);
//			console.log(startDate);
//			console.log(endDate);
		},
		initSearchParam : function(){
            $allDetect = $('#allDetect');
            $allBlock = $('#allBlock');
            $deviceUniqueCheckBox = $('#deviceUniqueCheckBox');
			switch($('#cell-index').val()){
			case "4":
				$allDetect.click();
				$allBlock.click();
				$('#appBlock').click();
		        break;
			
			case "5":
				$allDetect.click();
				$allBlock.click();
				$('#osBlock').click();
                // $deviceUniqueCheckBox.click();
				break;
			case "6":
				$allDetect.click();
				$allBlock.click();
				$('#customromBlock').click();
                // $deviceUniqueCheckBox.click();
				break;
			case "7":
				$allDetect.click();
				$allBlock.click();
				$('#emulatorBlock').click();
				// $deviceUniqueCheckBox.click();
				break;
			case "8":
				$allDetect.click();
				$allBlock.click();
				$('#debbugerBlock').click();
                // $deviceUniqueCheckBox.click();
				break;
			case "9":
				$allDetect.click();
				$allBlock.click();
				$('#adbBlock').click();
                // $deviceUniqueCheckBox.click();
				break;
			case "10":
				$allDetect.click();
				$allBlock.click();
				$('#usbBlock').click();
				// $deviceUniqueCheckBox.click();
				break;
			case "11":
				$allDetect.click();
				$allBlock.click();
				$('#wifiBlock').click();
				// $deviceUniqueCheckBox.click();
				break;
			case "12":
				$allDetect.click();
				$allBlock.click();
				$('#sessionBlock').click();
				// $deviceUniqueCheckBox.click();
				break;
			case "13":
				$allDetect.click();
				$allBlock.click();
				$('#proxyBlock').click();
				// $deviceUniqueCheckBox.click();
				break;
			case "14":
				$allDetect.click();
				$allBlock.click();
				$('#remoteAppRunBlock').click();
				break;
			case "15":
				$allDetect.click();
				$allBlock.click();
				$('#remoteAppInstBlock').click();
				// $deviceUniqueCheckBox.click();
				break;
			case "0":
				$allDetect.click();
				// $deviceUniqueCheckBox.click();
				break;
			case "1":
				$allDetect.click();
				// $deviceUniqueCheckBox.click();
				break;
			case "2":
				$allDetect.click();
                // $deviceUniqueCheckBox.click();
				break;
			case "3":
				$allDetect.click();
				$deviceUniqueCheckBox.click();
				break;
		    default:
		    	$('#index-search-button').click();
		    	
			}
		},
		initDashboardDaterange : function() {
			if (!jQuery().daterangepicker) {
				return;
			}

			datepicker = $('#dashboard-report-range')
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
//								console.log(start)
//								console.log(end)
//								console.log(label)
								if (moment() < moment(endDate).subtract('days', 1)) {
									alert(getMessage("common.datePicker.overDatePickedErrorMessage", "오늘 이후날자로는 검색할수 없습니다."));
									return;
								}
								
								var startDate = getStartDate(start);
								var endDate = getEndDate(end);
								setCurrentDateRange(startDate, endDate);																

//								console.log(startDate);
//								console.log(endDate);
							});
			$('#dashboard-report-range').show();
// 			$('#dashboard-report-range').on('showCalendar.daterangepicker', function (ev,picker){
// //					console.log("show");
// 			})
// 			$('#dashboard-report-range').on('hideCalendar.daterangepicker', function (ev,picker){
// //					console.log("hide");
// 			})
			$('#dashboard-report-range').bind('click.leftButton',function(){
				$(".calendar-table .fa-angle-left").click();
				$('#dashboard-report-range').unbind('.leftButton');
			});
		},

		table : function() {
			var mainTable = function() {
				inquireToServer();
//				searchReq = getQueryData();
//				console.log(searchReq);
//				
//				// table에 datatable적용
//				$.ajax({
//							type : 'GET',
//							url : '/api/log/detection',
//							data : searchReq,
//							success : function(returnValue) {
//
//								console.log(returnValue);
//								makeTable(returnValue);
//							},
//							error : function(e) {
//								console.log(e)
//							}
//
//						});
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
			$('#log-info-modal').on('hidden.bs.modal',function(e){
				$('#osForgeryDetail').html('');
				$('#customromForgeryDetail').html('');
				$('#emulatorDetail').html('');
				$('#appForgeryDetail').html('');
				$('#remoteAppInstDetail').html('');
				$('#remoteAppRunDetail').html('');
				$('#osForgeryDetailWrapper').hide();
				$('#customromDetailWrapper').hide();
				$('#emulatorDetailWrapper').hide();
				$('#appForgeryDetailWrapper').hide();
				$('#remoteAppRunDetailWrapper').hide();
				$('#remoteAppInstDetailWrapper').hide();
				$('#additionalInfoWrapper').hide();
				$('#sessionForgeryWrapper').hide();
			});
			// 조회 클릭 시
			table
					.on(
							'click',
							'.log-info',
							function(e) {
								e.preventDefault();
								modalEachInit();
								$('#log-info-modal').modal('show');
								var nRow = $(this).parents('tr')[0];
								var data = oTable.row(nRow).data();
//								console.log(data);
								for(var i in organNames){
									if(data.orgId==organNames[i].id){
										data.organName=organNames[i].organName
									}
								}
								var keys = Object.keys(data);
								var elemId = "";
								var content = "";
								var detectionInfo = function(type, statusCode){
									if(statusCode == 0 || statusCode == null || statusCode == undefined){
										return "";
									}
									var status = detectionLogStatusMap[type][statusCode];
									var reason = detectionLogReasonMap[type];
									
									return reason + " (" + status + ")";									
								}
								for ( var item in keys) {
									elemId = keys[item];
									content = data[elemId];
                                    // console.log(elemId)
									// console.log($('#' + elemId).length + " val : " + $('#' + elemId).val() + " content : " + content)

									if($('#' + elemId).length > 0 &&elemId!="appId"&&elemId!="appVersionId"&&elemId!="appName"&&elemId!="appVersion") {
										$('#' + elemId).text(content);
									}else if(elemId=="appId"){
                                        $('#appName').text(appNameMap[content]);
                                    }else if(elemId=="appVersionId"){
                                        $('#appVersion').text(appVersionMap[content]);
                                    }
									else if(detectionLogReasonMap[elemId] != null){
										var code = content;
										content = detectionInfo(elemId, content);
										if(content.length > 0){
											switch(code) {
											case 1:
												$('#detect-info').append('<span class="col-md-2">&nbsp;-&nbsp;' + content + '</span>');
												break;
												
											case 2:
												$('#block-info').append('<span class="col-md-2">&nbsp;-&nbsp;' + content + '</span>');
												break;
											}
										}
									}
								}
								if(data.threatOsForgeryResult==1||data.threatOsForgeryResult==2){
									$('#osForgeryDetailWrapper').show();
									var detail = JSON.parse(data.threatOsForgeryDetail);
									var $osForgeryDetail = $('#osForgeryDetail');
									$.each(detail, function (index, value) {
										if (value.detection_item == "file_detected") {
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.fileDetected","파일 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.list+'</div></div>');
										}
										else if (value.detection_item == "port_detected") {
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.portDetected","포트 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.list+'</div></div>');
										}
										else if (value.detection_item == "process_detected"){
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.processDetected","프로세스 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.list+'</div></div>');
										}
										else if (value.detection_item == "jailbreak_detected") {
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.jailbreakDetected","비정상 권한")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "not_release_key") {
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.notReleaseKey","커스텀롬 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "ota_certs_not_found") {
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.otaCertsNotFound","커스텀롬 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "root_zygote_child") {
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.rootZygoteChild","프로세스 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "root_adbd_child"){
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.rootAdbdChild","프로세스 탐지")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "file_not_found"){
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.fileNotFound","파일 없음")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.list+'</div></div>');
										}
										else if (value.detection_item == "type_mismatched_files"){
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.typeMismatchedFiles","파일 형식 오류")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.list+'</div></div>');
										}
										else if (value.detection_item == "unexpected_permissions"){
											$osForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.unexpectedPermissions","비정상 권한")+'</div><div class="col-md-10" style="word-break:break-all">&nbsp;'+value.list+'</div></div>');
										}
										
									});
								}
								if(data.threatCustomromResult==1||data.threatCustomromResult==2){
									$('#customromDetailWrapper').show();
									var detail = JSON.parse(data.threatCustomromDetail);
									var $customromForgeryDetail = $('#customromForgeryDetail');
									$.each(detail, function (index, value) {
										if (value.detection_item == "not_release_key") {
											$customromForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.notReleaseKey","커스텀롬 탐지")+'</div><div class="col-md-10" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "ota_certs_not_found") {
											$customromForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.osForgeryDetails.otaCertsNotFound","커스텀롬 탐지")+'</div><div class="col-md-10" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}
										
									});
								}
								if(data.threatEmulatorResult==1||data.threatEmulatorResult==2){
									$('#emulatorDetailWrapper').show();
									var detail = JSON.parse(data.threatEmulatorDetail);
									var $emulatorDetail = $('#emulatorDetail');
									$.each(detail, function (index, value) {
										if (value.detection_item == "file_detected") {
											$emulatorDetail.append('<div><div class="col-md-2">'+getMessage("log.emulatorDetails.file","파일 탐지")+'</div><div class="col-md-10" style="word-break:break-all">'+value.list+'</div></div>');
										}
										else if (value.detection_item == "packages_detected") {
											$emulatorDetail.append('<div><div class="col-md-2">'+getMessage("log.emulatorDetails.package","패키지 탐지")+'</div><div class="col-md-10" style="word-break:break-all">'+value.list+'</div></div>');
										}else if (value.detection_item == "system_env_detected") {
											var emulatorHtml = '<div><div class="col-md-2">'+getMessage("log.emulatorDetails.env","환경 변수 탐지")+'</div><div class="col-md-10" style="word-break:break-all">';

											for(var j in value.list){
												if(j>0){
													emulatorHtml+= " / ";
												}
												for(var i in maskingMap){
													if((parseInt(i,2) & value.list[j])>0){
														emulatorHtml+=maskingMap[i]+ ", ";

													}
												}
												emulatorHtml = emulatorHtml.replace(/,\s*$/, "");
											}

											emulatorHtml +='</div></div>';
											$emulatorDetail.append(emulatorHtml);
										}

									});
								}
								if(data.threatAppForgeryResult==1||data.threatAppForgeryResult==2){
									$('#appForgeryDetailWrapper').show();
									var detail = JSON.parse(data.threatAppForgeryDetail);
									var $appForgeryDetail = $('#appForgeryDetail');
									$.each(detail, function (index, value) {
										if (value.detection_item == "inner_so_file_forgery") {
											$appForgeryDetail.append('<div><div class="col-md-3">'+getMessage("log.appForgeryDetails.innerSoFileForgery","내부 so 파일 위변조")+'</div><div class="col-md-9 hidden" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "dynamic_so_file_forgery") {
											$appForgeryDetail.append('<div><div class="col-md-3">'+getMessage("log.appForgeryDetails.dynamicSoFileForgery","다이나믹 so 파일 위변조")+'</div><div class="col-md-9 hidden" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "signature_digest_mismatch") {
											$appForgeryDetail.append('<div><div class="col-md-3">'+getMessage("log.appForgeryDetails.signatureDigestMismatch","signature digest 불일치")+'</div><div class="col-md-9 hidden" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "package_digest_mismatch") {
											$appForgeryDetail.append('<div><div class="col-md-3">'+getMessage("log.appForgeryDetails.packageDigestMismatch","package digest 불일치")+'</div><div class="col-md-9 hidden" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}
										else if (value.detection_item == "thinning_app" || value.detection_item == "universal_app" || value.detection_item == "appstore_app" || value.detection_item == "app_from_itunes" ) {
											$appForgeryDetail.append('<div><div class="col-md-3">'+getMessage('log.appForgeryDetails.codeSignMismatch','코드사인 불일치')+'</div><div class="col-md-9 hidden" style="word-break:break-all">'+value.detection_item+'</div></div>');
										}else if (value.detection_item == "iOSEncHash") {
											$appForgeryDetail.append('<div><div class="col-md-2">'+getMessage("log.appForgeryDetails.encInfoMismatch","Enc Info 불일치")+'</div><div class="col-md-10" style="word-break:break-all">'+JSON.stringify(value.list)+'</div></div>');
										}

									});
								}
								if(data.threatRemoteAppRunResult==1||data.threatRemoteAppRunResult==2){
									$('#remoteAppRunDetailWrapper').show();
									var detail = JSON.parse(data.threatRemoteAppRunDetail);
									var $remoteAppRunDetail = $('#remoteAppRunDetail');
									$.each(detail, function (index, value) {
										if (value.detection_item == "remote_app_run_detected") {
											$remoteAppRunDetail.append('<div><div class="col-md-2">keyword : </div><div class="col-md-10" style="word-break:break-all">'+value.list+'</div></div>');
										}
									});
								}
								if(data.threatRemoteAppInstResult==1||data.threatRemoteAppInstResult==2){
									$('#remoteAppInstDetailWrapper').show();
									var detail = JSON.parse(data.threatRemoteAppInstDetail);
									var $remoteAppInstDetail = $('#remoteAppInstDetail');
									$.each(detail, function (index, value) {
										if (value.detection_item == "remote_app_inst_detected") {
											$remoteAppInstDetail.append('<div><div class="col-md-2">keyword : </div><div class="col-md-10" style="word-break:break-all">'+value.list+'</div></div>');
										}
									});
								}
								if(data.additionalInfo!=null){
									$("#additionalInfoWrapper").show();
									var additionalInfoJson = JSON.parse(data.additionalInfo);
									var detail = JSON.stringify(additionalInfoJson, undefined, 2);
									$("#additionalInfo").html(detail)
								}
								if(data.threatSessionForgeryDetail!=null&&data.threatSessionForgeryDetail!=""){
									$("#sessionForgeryWrapper").show();
									var sessionForgeryDetailJson = JSON.parse(data.threatSessionForgeryDetail);
									var detail = JSON.stringify(sessionForgeryDetailJson, undefined, 2);
									$("#sessionForgeryDetail").html(detail)
								}
								var time = $('#createdAt').text();
								$('#createdAt').text(timeFormat(Number(time)));

						});
		},
		
		clickEventInit: function(){			
			$('#organ-select').change(function(){
				organId=$(this).val();
				appListInit();
			});
			$('#detection-search-button').click(function(e){
				e.preventDefault();
				if($('#search_column').val()=='seq'){
					if(!isInteger($('#detection-search-input').val())){
						alert(getMessage('log.search.onlyNumberWhenLookupCode','조회 코드 검색시 정수만 입력 가능합니다.'));
						return false;
					}
                    if($('#detection-search-input').val()>9223372036854775295){
                        alert(getMessage('log.search.overLongLimit','-9223372036854775295에서 9223372036854775295사이의 값만 입력할 수 있습니다.'))
                        return false;
                    }
                    if($('#detection-search-input').val()<-9223372036854775295){
                        alert(getMessage('log.search.overLongLimit','-9223372036854775295에서 9223372036854775295사이의 값만 입력할 수 있습니다.'))
                        return false;
                    }
				}

                var startDate = getStartDate($('#startDate').val());
                var endDate = getEndDate($('#endDate').val());
                var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');

                if(!isPeriodOk){
                    alert(getMessage('log.search.periodMessage','검색 기간의 최대 범위는 1개월 입니다.'));
                }else{
                    var query = getQueryData();
                    oTable.draw();
				}
				// inquireToServer();
			});
			
			$('#detection-search-input').keypress(function(e) {
				if(e.keyCode == 13){
					e.preventDefault();
					if($('#search_column').val()=='seq'){
						if(!isInteger($('#detection-search-input').val())){
							alert(getMessage('log.search.onlyNumberWhenPk','조회코드 검색시 정수만 입력 가능합니다.'));
							return false;
						}
                        if($('#detection-search-input').val()>9223372036854775295){
                            alert(getMessage('log.search.overLongLimit','-9223372036854775295에서 9223372036854775295사이의 값만 입력할 수 있습니다.'))
                            return false;
                        }
                        if($('#detection-search-input').val()<-9223372036854775295){
                            alert(getMessage('log.search.overLongLimit','-9223372036854775295에서 9223372036854775295사이의 값만 입력할 수 있습니다.'))
                            return false;
                        }
					}

                    var startDate = getStartDate($('#startDate').val());
                    var endDate = getEndDate($('#endDate').val());
                    var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');

                    if(!isPeriodOk){
                        alert(getMessage('log.search.periodMessage','검색 기간의 최대 범위는 1개월 입니다.'));
                    }else{
                        var query = getQueryData();
                        oTable.draw();
                    }
					// inquireToServer();
					e.returnValue = false;
				}
			});
		},
		init : function() {
			this.initSearchDate();
			this.initDashboardDaterange();
			// this.initCreateTable()
			this.modalInit();
			this.clickEventInit();
			this.initSearchParam();
			this.table().init();
		}
	}

}();


//var getLineGroupSelector = function(num){
//	return "input:checkbox[value='" + num + "']";
//}

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
			usingResonInit();
			statusMapInit();
			initCsvDownloadEvent();
			$("input:checkbox[name='blocks'][value='1']").change(function(){
				var checked = $(this).is(":checked");
				$("input:checkbox[name='blocks']").each(function(){
					$(this).prop("checked", checked);
				});
			});
			
			$("input:checkbox[name='detects'][value='1']").change(function(){
				var checked = $(this).is(":checked");
				$("input:checkbox[name='detects']").each(function(){
					$(this).prop("checked", checked);
				});			
			});
			
			$("input:checkbox[name='blocks']").not($("input:checkbox[name='blocks'][value='1']")).change(function(){
				var checked = true;
				$("input:checkbox[name='blocks']").not($("input:checkbox[name='blocks'][value='1']")).each(function(){
					if(!($(this).is(":checked"))){
						checked = false;
					}
				});
				$("input:checkbox[name='blocks'][value='1']").prop("checked", checked);
			});
			
			$("input:checkbox[name='detects']").not($("input:checkbox[name='detects'][value='1']")).change(function(){
				var checked = true;
				$("input:checkbox[name='detects']").not($("input:checkbox[name='detects'][value='1']")).each(function(){
					if(!($(this).is(":checked"))){
						checked = false;
					}
				});
				$("input:checkbox[name='detects'][value='1']").prop("checked", checked);
			});
			
			$("input:checkbox[name='blocks']").prop("checked", true);
			$("input:checkbox[name='detects']").prop("checked", true);
			
			

			$('#search_select').change(function() {
				// $(search_input).prop("name",$('#search_select').val());
			});
			
			$('#startDate').val(
					new Date(parseInt(new Date() / 10000000) * 10000000
							- (1000 * 60 * 60 * 24)).getTime());
			$('#endDate').val(
					new Date(parseInt(new Date() / 10000000) * 10000000)
							.getTime());
			InitFunction.init();
			$('#startDate, endDate').change(function() {
				oTable.draw();
			});
			
			$('#deviceUniqueCheckBox').change(function(){
				if($('input[id="deviceUniqueCheckBox"]:checked').length){
					$('#deviceUniqueAndResultCheckBox').attr('checked',false);
				}
				else{
					
				}
			})
			$('#deviceUniqueAndResultCheckBox').change(function(){
				if($('input[id="deviceUniqueAndResultCheckBox"]:checked').length){
					$('#deviceUniqueCheckBox').attr('checked',false);
				}
				else{
					
				}
			})

		});


function getFileredSearchQuery(
		startDate, endDate, searchKeywordType, searchKeyword,
		f_appForgery, f_osForgery, f_debugger, f_adb, f_usb, f_wifi, f_sessionForgery, f_proxy
		){
	startDateArg = new Date(parseInt(startDate));
	endDateArg = new Date(parseInt(endDate));
	var ret = {
		"startDate"			: startDateArg.getTime()  		, 
		"endDate"			: endDateArg.getTime()   		, 
		"searchKeywordType"	: searchKeywordType	, 
		"searchKeyword"		: searchKeyword		,	
		"f_appForgery"		: f_appForgery 		== undefined ? 0 : f_appForgery		, 
		"f_osForgery"		: f_osForgery 		== undefined ? 0 : f_osForgery		, 
		"f_debugger"		: f_debugger 		== undefined ? 0 : f_debugger		, 
		"f_adb"				: f_adb 			== undefined ? 0 : f_adb			, 
		"f_usb"				: f_usb				== undefined ? 0 : f_usb			, 
		"f_wifi"			: f_wifi 			== undefined ? 0 : f_wifi			, 
		"f_sessionForgery"	: f_sessionForgery	== undefined ? 0 : f_sessionForgery ,
		"f_proxy"			: f_proxy			== undefined ? 0 : f_proxy
	};
	return ret;
}
function getCsv(){
	getQueryData()
	var data = new Object();
	//data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
	data.appId = searchReq.appId;
	data.organId = searchReq.organId;
	data.searchColumn = searchReq.searchColumn;
	data.keyword = searchReq.searchKeyword;
	data.blocks = searchReq.blocks;
	data.detects = searchReq.detects;
	data.deviceUniqueByDeviceId= searchReq.deviceUniqueByDeviceId;
	data.startDate=searchReq.startDate;
	data.tomorrowEndDate=getTommorowStart(searchReq.endDate);
	window.open("/api/log/detection/csv?"+$.param(data), '_blank')
}

function makeTable(){
	oTable = table
	.DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
        	"url" : "/api/log/detection",
			"data" : function (data){
                getQueryData();
				//data.columns[0].search.value = searchReq.startDate.getTime() + ";" + searchReq.endDate.getTime();
				data.appId = searchReq.appId;
				data.organId = searchReq.organId;
				data.searchColumn = searchReq.searchColumn;
				data.keyword = searchReq.searchKeyword;
                data.blocks = searchReq.blocks;
                data.detects = searchReq.detects;
                data.deviceUniqueByDeviceId= searchReq.deviceUniqueByDeviceId;
                data.startDate=searchReq.startDate;
                data.tomorrowEndDate=getTommorowStart(searchReq.endDate);
                // console.log(data)
                // console.log(searchReq);
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
		},{		
			data : "deviceId"		
		}, null, null, null, ],		
		"columnDefs" : [		
			{ // set default column
				// settings
				'orderable' : true,
				render : function(data,	 type, row, meta) {
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
                "searchable" : false,
                "targets" : [ 3,4,5 ]
            },
			{
				data   : function(row, type, val, meta) {
					return getBlockingReasons(row);
				},
				"searchable" : false,
				targets : [ 6 ]
			},
			{
				data   : function(row, type, val, meta) {
					return getDetectionReasons(row);
				},
				"searchable" : false,
				targets : [ 7 ]
			},
			{
				orderable:false,
				targets: [1,2,6,7,8]
			},
			{
				'data' : function(row,
						type, val, meta) {
					result = "<button class='log-info'>"+getMessage('common.details','상세')+"</button>"
					return result;
				},
				"searchable" : false,
				targets : [ 8 ]
			} ],
		"order" : [ [ 0, "desc" ] ],		
		dom : "<'row'<'col-sm-6'l><'col-sm-6'>>"
				+ "<'row'<'col-sm-12'tr>>"		
				+ "<'row'<'col-sm-5'i><'col-sm-7'p>>",		
	});
	setDatatableAjaxErrorHandle();
}
var modalEachInit = function(){
	$('#detect-info').html("");
	$('#block-info').html("");
	$('#osForgeryDetail').html('');
	$('#customromcustomForgeryDetail').html('');
	$('#emulatorDetail').html('');
	$('#appForgeryDetail').html('');
	$('#remoteAppInstDetail').html('');
	$('#remoteAppRunDetail').html('');
	$('#osForgeryDetailWrapper').hide();
	$('#customromDetailWrapper').hide();
	$('#emulatorDetailWrapper').hide();
	$('#appForgeryDetailWrapper').hide();
	$('#remoteAppRunDetailWrapper').hide();
	$('#remoteAppInstDetailWrapper').hide();
	$('#additionalInfoWrapper').hide();
	$('#sessionForgeryWrapper').hide();

}

