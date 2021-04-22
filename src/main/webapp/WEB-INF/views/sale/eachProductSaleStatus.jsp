<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

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


<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>

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
					class="caption-subject font-dark bold">제품별 판매현황 조회</span>
			</div>
		</div>
	</div>
</div>


<!-- <script type="text/javascript" src="/assets/scripts/loadingoverlay.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/scripts/metronic.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/plugins/moment.min.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/admin/layout/scripts/layout.js"></script>
<script src="/js/all.js"></script> -->
<script type="text/javascript" src="/assets/scripts/loadingoverlay.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/scripts/metronic.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/plugins/moment.min.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/admin/layout/scripts/layout.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/scripts/all.js?v=2.14.2-RELEASE"></script>
<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>
<!--     <script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.2.2/js/dataTables.buttons.js"></script> -->
<!--     <script type="text/javascript" src="/assets/global/plugins/datatables/Select-1.2.0/js/dataTables.select.js"></script> -->
    <script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>
    <script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>
    <script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
    <script type="text/javascript" src="/assets/global/plugins/bootstrap-select/bootstrap-select.js"></script>
    <script type="text/javascript" src="/assets/scripts/jquery.spring-friendly.js"></script>

<script src="/js/periodSaleStatus.js"></script>
<%@ include file="../layout/footer.jsp"%>