<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>
<!--  bar char site : https://bbbootstrap.com/snippets/chartjs-horizontal-bar-chart-38919641 -->
<!-- ADMIN -->
<link rel="stylesheet" type="text/css" 	href="/assets/global/css/components.css?v=2.14.2-RELEASE">
<link rel="stylesheet" type="text/css" 	href="/assets/global/plugins/bootstrap-datepicker/css/datepicker.css">
<link rel="stylesheet" type="text/css" 	href="/assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.css">
<link rel="stylesheet" type="text/css" 	href="/assets/global/plugins/simple-line-icons/simple-line-icons.min.css">
<link rel="stylesheet" type="text/css" 	href="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.css">
<link rel="stylesheet" type="text/css" 	href="/assets/css/jjsonviewer.css">

<link rel="shortcut icon" href="/assets/images/favicon.ico">
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/datatables/datatables.min.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>
<script type="text/javascript"
	src="/assets/scripts/jquery.spring-friendly.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.js"></script>
<script type="text/javascript"
	src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>
<!-- ADMIN -->

<!-- <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script> -->
<!-- 차트 부트스트랩 -->
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
	integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
	crossorigin="anonymous"></script>
<script
	src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
	integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
	crossorigin="anonymous"></script>

<!--  날짜검색 부트스트랩 -->
<script type="text/javascript"
	src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript"
	src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script type="text/javascript"
	src="https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.0.1/js/tempusdominus-bootstrap-4.min.js"></script>
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.0.1/css/tempusdominus-bootstrap-4.min.css" />
<link rel="stylesheet"
	href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" />

<!--  콤보 입력박스 부트스트랩 -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script
	src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
		
<div class="container">
	<button class="btn btn-secondary" onclick="history.back()">돌아가기</button>
	<br /> <br />
	
	<div class="portlet light bordered">
		<div class="portlet-title">
			<div class="caption">
				<i class="fa fa-search"></i> <span
					class="caption-subject font-dark bold">자판기별 판매현황 조회</span>
			</div>
		</div>

		<form id="search-params">
			<div class="portlet-body">
				<div class="row"></div>
				<div class="row">
					<div class="col-md-4">
						<c:choose>
							<c:when test="${result.startDate ne null}">
								<label for="select2-single-input-sm" class="control-label"
									id="date-label" data-startdate="${result.startDateLong}"
									data-enddate="${result.endDateLong}"></label>
							</c:when>
							<c:otherwise>
								<label for="select2-single-input-sm" class="control-label"
									id="date-label"></label>
							</c:otherwise>
						</c:choose>
						<label for="select2-single-input-sm" class="control-label">기간설정</label>
						<div class="input-group">
							<div class="page-toolbar ">
								<%-- style="background-color: #716558;" --%>
								<div id="dashboard-report-range"
									class="pull-left tooltips btn btn-fit-height"
									style="border: 1px solid #ccc;" data-placement="bottom"
									data-original-title="클릭하시면 일자를 수정할수 있습니다.">
									<i class="icon-calendar"></i>&nbsp; <span
										class="thin uppercase hidden-xs"> </span>&nbsp; <i
										class="fa fa-angle-down"></i>
								</div>
							</div>
							<div>
								<input type="hidden" name="startDate" id="startDate"> <input
									type="hidden" name="endDate" id="endDate"> <span
									class="input-group-btn btn-right">
									<button class="btn green-haze yellow" type="button"
										id="detection-search-button" name="appName"
										style="margin-left: 10px">
										검색 <i class="fa fa-search"></i>
									</button>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
	
	<br />
	<div>
		Date : <span><I>${result.startDateString} ~  ${result.endDateString}</I></span>
	</div>

	<div class="card bg-light">
		<div class="card-body">
			<div class="portlet-body">
				<div class="row">
					<div class="col-md-3">
						<h6 class="card-text">결재시도 금액 : ${dailySale.totalAccount}</h6>
						<h6 class="card-text">환불 결재금액 : ${dailySale.totalRefudAccount}</h6>
						<h6 class="card-text">실 결재금액 : ${dailySale.totalRealAccount} <br />
						</h6>
					</div>
					
					<div class="col-md-5">
						<h6 class="card-text">총 결재 시도 건수 : ${dailySale.totalCnt}</h6>
						<h6 class="card-text">환불처리 성공/실패 건수 : ${dailySale.totalRefudCnt}/${dailySale.totalFailCnt}</h6>
					</div>
				</div>
			</div>
			<hr />
					<h6 class="card-text">
						자판기별 결재/환불 금액 <br />
					</h6>
					<div class="container">
						<canvas id="amount-chart-line"  class="chartjs-render-monitor">
						</canvas>
					</div>
					
					<hr />
					<h6 class="card-text">
						자판기별 결재/환불 건수<br />
					</h6>
					<div class="container">
						<canvas id="cnt-chart-line" >
						</canvas>
					</div>
		</div>
	</div>
</div>

<script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js'></script>
<script>

				var cntCtx = $("#cnt-chart-line");
				var cntChartline = new Chart(cntCtx, {
					type : 'horizontalBar',
					data : {
						labels : ${vendingMachineNames},
						datasets : [
								{
									data :  ${cntPayPerMachine}, // [ 86, 114, 106, 106, 107, 111, 133,221, 783, 2478 ],
									label : "결재건수",
									borderColor :  'rgba(255, 99, 132, 1)',
									backgroundColor : 'rgba(255, 99, 132, 0.2)',
									borderWidth : 1
								},
								{
									data :  ${cntRefundPerMachine}, //[ 168, 170, 178, 190, 203, 276, 408, 547, 675, 734 ],
									label : "환불건수",
									borderColor :  'rgba(54, 162, 235, 1)',
									backgroundColor : 'rgba(54, 162, 235, 0.2)',
									borderWidth : 1
								} ]
					},
					options : {
						title : {
							display : true,
							text : '전체 자판기별 결재/환불 건수'
						}
					}
				});

				var amountCtx = $("#amount-chart-line");
				var amountChartLine = new Chart(amountCtx, {
					type : 'horizontalBar',
					data : {
						labels : ${vendingMachineNames},
						datasets : [
								{
									data :  ${accountRealPerMachine}, // [ 86, 114, 106, 106, 107, 111, 133,221, 783, 2478 ],
									label : "결재금액",
									borderColor :  'rgba(255, 206, 86, 1)',
									backgroundColor : 'rgba(255, 206, 86, 0.2)',
									borderWidth : 1
								},
								{
									data :  ${accountRefundPerMachine}, //[ 168, 170, 178, 190, 203, 276, 408, 547, 675, 734 ],
									label : "환불금액",
									borderColor :  'rgba(75, 192, 192, 1)',
									backgroundColor : 'rgba(75, 192, 192, 0.2)',
									borderWidth : 1
								} ]
					},
					options : {
						title : {
							display : true,
							text : '전체 자판기별 결재/환불 건수'
						}
					}
				});
				
</script>

<script type="text/javascript" src="/assets/scripts/loadingoverlay.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/scripts/metronic.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/plugins/moment.min.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/admin/layout/scripts/layout.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/scripts/all.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>
<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>
<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>
<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
<script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>
<script type="text/javascript" src="/assets/scripts/jquery.spring-friendly.js"></script>

<script src="/js/eachMachineSaleStatus.js"></script>

<%@ include file="../layout/footer.jsp"%>