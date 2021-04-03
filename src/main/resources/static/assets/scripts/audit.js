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

var adminListInit = function(){
	$.ajax({
		type : 'GET',
		url : '/api/audit/adminlist',
		success : function(adminList){
			adminId=$("#admin-list-label").data("adminid");
			var result = "<option value='All'>getMessage('common.admin.allAdmin','전체 관리자')</option>" ;
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
	""				: getMessage('common.normal','정상'),
	"blacklist" 	: getMessage('common.block','차단'),
	"loss_device" 	: getMessage('common.lost','분실')
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
	var isPeriodOk = checkDateGapIfShorterThanOrEqualsToPeriod(startDate, endDate, 1, 'M');
	if(!isPeriodOk){
		alert(getMessage('log.search.periodMessage','검색 기간의 최대 범위는 1개월 입니다.'));
	} else {
		var query = getQueryData();
		$.ajax({
			url:'/api/audit',
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
											content = getMessage('common.success','성공');
										}else{
											content = getMessage('common.failed','실패');
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
			organListInit();
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
		aaSorting: [] ,
		columns : [ ],		
		"columnDefs" : [		
				{ 		
					'data' :function(row, type, val, meta) {
						return timeFormat(row.regDate);		
					},		
					'targets' : [ 0 ]		
				},{
					'data' :function(row, type, val, meta) {
						result = "";
						//result += timeFormat(row.regDate) +' [';
						result += '[';
						//result += getKorAction(row.action);
						//result += ' ';
						result += getContent(row.action, row.beforeData ,row.afterData);
						result += ' ';
						result += getIsSuccessToKor(row.isSuccess);
						result += "] "; 
						if(row.accountEntity!=null){
							result += row.accountEntity.userId+'('+row.accountEntity.userName+'-'+row.userIp+')';
						}else{
							result += getMessage('common.noId','ID없음')+'('+getMessage('common.noName','이름 없음')+'-'+row.userIp+')';
						}
						
						
							return  result;
						},
					'targets' : [ 1 ]	
				},
				{		
					'data' : function(row, type, val, meta) {
						result = "<button class='audit-info'>"+getMessage('common.details','상세')+"</button>"
						return result;
					},
					visible : false,
					targets : [ 2 ]	
				}
				],		
		dom : "<'row'<'col-sm-6'l><'col-sm-6'f>>"
			+ "<'row'<'col-sm-12'tr>>"
			+ "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});		
}

var getIsSuccessToKor = function(isSuccess){
	var result ="";
	if(isSuccess==1){
		result += getMessage('common.success','성공');;
	}else{
		result += getMessage('common.failed','실패');
	}
	return result;
}
var getContent = function(action, beforeData, afterData){
	try{
		var after = JSON.parse(afterData);
		if(after.message==null||after.message==undefined){
			after.message="";
		}
	}catch(error){
		var after ="{}";
		console.log("After Log Parsing Error");
		console.log(beforeData);
		console.log(afterData);
	}
	try{
		var before = JSON.parse(beforeData);
	}catch (error){
		var before ="{}";
		console.log("Before Log Parsing Error");
		console.log(action);
		console.log(beforeData);
		console.log(afterData);
	}	
		
	
	var result="";
	switch(action) {
	    case 'SessionExpire':
	        result +=getMessage('audit.sessionExpire','관리자 로그인 세션 만료');
	        break;
	    case 'Login':
	    	result +=getMessage('audit.login','관리자 로그인');
	    	break;
	    case 'SignUp':
	    	result +=getMessage('audit.signUp','최초 관리자 등록');
	    	break;
	    case 'AppCreate':
	    	result +=getMessage('audit.appCreate','어플리케이션 등록')+' (' + before.appName + ')';
	    	break;
	    case 'AppUpdate':
	    	result +=getMessage('audit.appUpdate','어플리케이션 수정')+' (' + before.appName + ')';
	    	break;
	    case 'AppDelete':
	    	result +=getMessage('audit.appDelete','어플리케이션 삭제')+' (' + before.appName + ')';
	    	break;
	    case 'AppVersionCreate':
	    	result +=getMessage('audit.appVersionCreate','앱 버전 등록')+' (' + before.appName + '('+before.appVersion+')'+')';
	    	break;
	    case 'AppVersionPolicyUpdate':
	    	result +=getMessage('audit.appVersionPolicyUpdate','앱 버전 정책 변경')+' (' + before.appName + '('+before.appVersion+')'+')';
	    	break;
	    case 'AppVersionDelete':
	    	result +=getMessage('audit.appVersionDelete','앱 버전 삭제')+' (' + before.appName + '('+before.appVersion+')'+')';
	    	break;
	    case 'AppVersionUpload':
	    	result +=getMessage('audit.appVersionUpload','앱 버전 업로드')+' ('+before+''+ after.appName + '('+after.appVersion+')'+')';
	    	break;
	    case 'PolicyCreate':
	    	result +=getMessage('audit.policyCreate','정책 등록')+' (' + before.policyName + ')';
	    	break;
	    case 'PolicyUpdate':
	    	result +=getMessage('audit.policyUpdate','정책 수정')+' (' + before.policyName + ')';
	    	break;
	    case 'PolicyDelete':
	    	result +=getMessage('audit.policyDelete','정책 삭제')+' (' + before.policyName + ')';
	    	break;
	    case 'SetPolicyTaskList':
	    	result +=getMessage('audit.setPolicyTaskList','대상 업무 설정');
	    	break;
	    case 'TaskCreate':
	    	result +=getMessage('audit.taskCreate','업무 등록')+' (' + before.name + ')';
	    	break;
	    case 'TaskUpdate':
	    	result +=getMessage('audit.taskUpdate','업무 수정')+' (' + before.name + ')';
	    	break;
	    case 'TaskDelete':
	    	result +=getMessage('audit.taskDelete','업무 삭제')+' (' + before.name + ')';
	    	break;
	    case 'AccountCreate':
	    	result +=getMessage('audit.accountCreate','관리자 생성')+' (' + after.userName +'('+after.userId+')'+ ')';
	    	break;
	    case 'AccountUpdate':
	    	result +=getMessage('audit.accountUpdate','관리자 수정')+' (' + after.userName +'('+after.userId+')'+ ')';
	    	break;
	    case 'AccountDelete':
	    	result +=getMessage('audit.accountDelete','관리자 삭제')+' (' + before.userName +'('+before.userId+')'+ ')';
	    	break;
	    case 'AuthUpdate':
	    	result =  getMessage('audit.authUpdate','관리자 권한 수정')+' (';
			result += after[0].accountEntity.userId+'('+after[0].accountEntity.userName+')';
			result += '|'+ after[0].authCategoryListEntity.categoryNameKr + '('+after[0].authLevelEntity.levelNameKr +')';
	    	break;
	    case 'ChangeMasterAdministrator':
	    	result +=getMessage('audit.changeMasterAdministrator','마스터 관리자 변경')+' (' +after.adminId+')'+ ')';
	    	break;
	    case 'AccountUpdate':
	    	result +=getMessage('audit.accountUpdate','관리자 계정 정보 수정')+' (' + after.userName +'('+after.userId+')'+ ')';
	    	break;
	    case 'ChangePassword':
	    	result +=getMessage('audit.changePassword','관리자 비밀번호 변경');
	    	break;
	    case 'NodeCreate':
	    	result +=getMessage('audit.nodeCreate','노드 생성')+' ('+before.nodeNickName+')';
	    	break;
	    case 'NodeUpdate':
	    	result +=getMessage('audit.nodeUpdate','노드 수정')+' ('+before.nodeNickName+')';
	    	break;
	    case 'NodeDelete':
	    	result +=getMessage('audit.nodeDelete','노드 삭제')+' ('+before.nodeNickName+')';
	    	break;
	    case 'DeployNode':
	    	result +=getMessage('audit.deployNode','배포')+' ('+before.nodeNickName+')';
	    	break;
	    case 'ApplyNode':
	    	result +=getMessage('audit.applyNode','적용')+' ('+before.nodeNickName+')';
	    	break;
	    case 'IpCreate':
	    	result +=getMessage('audit.ipCreate','IP 생성')+' ('+before.description+')';
	    	break;
	    case 'IpUpdate':
	    	result +=getMessage('audit.ipUpdate','IP 수정')+' ('+before.description+')';
	    	break;
	    case 'IpDelete':
	    	result +=getMessage('audit.ipDelete','IP 삭제')+' ('+before.description+')';
	    	break;
	    case 'isEmergency':
	    	result +=getMessage('audit.isEmergency','강제 비상모드 설정상태 업데이트')+' ('+before.baseUrl+', : '+after.message+')';
	    	break;
	    case 'enableEmergency':
	    	result +=getMessage('audit.enableEmergency','강제 비상모드 활성 요청')+' ('+before.baseUrl+', : '+after.message+')';
	    	break;
	    case 'disableEmergency':
	    	result +=getMessage('audit.disableEmergency','강제 비상모드 비활성 요청')+' ('+before.baseUrl+', : '+after.message+')';
	    	break;
	    case 'enableEmergencyFromOtherServer':
	    	result +=getMessage('audit.enableEmergencyFromOtherServer','다른서버로부터 강제비상모드 활성 요청')+' ('+JSON.stringify(after)+')';
	    	break;
	    case 'disableEmergencyFromOtherServer':
	    	result +=getMessage('audit.disableEmergencyFromOtherServer','다른서버로부터 강제비상모드 비활성 요청')+' ('+JSON.stringify(after)+')';
	    	break;
	    case 'EmergencyControlFromOtherServerWrongParameter':
	    	result +=getMessage('audit.emergencyControlFromOtherServerWrongParameter','잘못된 파라미터를 가진 강제비상모드 요청')+' ('+JSON.stringify(after)+')';
	    	break;
	    default:
	        result +=action;
	}
	return result;
	
}
var organListInit = function(){
	$.ajax({
		type : 'GET',
		url : '/api/audit/organlist',
		async:false,
		success : function(organList){
			organId=$("#organ-list-label" ).data("organid");
			var result = "<option value=''>"+getMessage('common.allOrgan','전체 기관')+"</option>" ;
			for(var i=0; i<organList.length; i++){
				if(organList[i].id==organId){
					result+='<option value="'+organList[i].id+'" selected="selected" >'+organList[i].organName+'</option>'
				}else{
					result+='<option value="'+organList[i].id+'">'+organList[i].organName+'</option>'
				}
			}
			$('#organ-list').html("");
			$('#organ-list').html(result);
			
			$('#organ-list').change(function(){
				organId=$(this).val();
			});
			//$('.selectpicker').selectpicker('render');
			
			
		},
		error : function(e){
			alert(e.responseJSON.message);
		}
			
	});
} 