<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>
<!-- <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" rel="stylesheet" />
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" /> -->

<!-- 차크 부트스트랩 -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
	integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
	crossorigin="anonymous"></script>
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
	src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
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
					class="caption-subject font-dark bold">기간/머신별 현황조회</span>
			</div>
			<hr />

		</div>
		<form id="search-params">

			<div class="portlet-body">
				<div class="row"></div>
				<div class="row">
					<div class="col-md-3">
						<label for="select2-single-input-sm" class="control-label"
							id="date-label">일자선택</label>

						<div class="input-group date" id="datetimepicker1"
							data-target-input="nearest">
							<input type="text" class="form-control datetimepicker-input"
								data-target="#datetimepicker1" value="01/11/2020">
							<div class="input-group-append" data-target="#datetimepicker1"
								data-toggle="datetimepicker">
								<div class="input-group-text">
									<i class="fa fa-calendar"></i>
								</div>
							</div>
						</div>

						<div class="input-group date" id="datetimepicker2"
							data-target-input="nearest">
							<input type="text" class="form-control datetimepicker-input"
								data-target="#datetimepicker2" value="01/15/2020">
							<div class="input-group-append" data-target="#datetimepicker2"
								data-toggle="datetimepicker">
								<div class="input-group-text">
									<i class="fa fa-calendar"></i>
								</div>
							</div>
						</div>

					</div>

					<div class="col-md-4">
						<label for="select2-single-input-sm " class="control-label"
							id="organ-list-label">머신선택</label><br>
						<div class="row">
							<select class="form-control col-md-7" id="sel1" name="sellist1">
								<option>CVVN100010</option>
								<option>CVVN100011</option>
								<option>CVVN100012</option>
								<option>CVVN100013</option>
								<option>CVVN100014</option>
								<option>CVVN100015</option>
								<option>CVVN100016</option>
								<option>CVVN100017</option>
								<option>CVVN100018</option>
							</select>

							<button type="button" class="btn btn-primary"
								style="margin-left: auto">
								검색 <i class="fa fa-search"></i>
							</button>
						</div>
					</div>

				</div>
			</div>
		</form>


	</div>
	<hr />

	<br />
	<div>
		Merchant Code : <span id="id"><i>${dailySale.vendingMachine.merchantName}
		</i></span><br /> Date : <span><I>${dailySale.date} </I></span>
	</div>
	<hr />

	<div class="card bg-light">
		<div class="card-body">


			<div class="portlet-body">
				<div class="row">
					<div class="col-md-3">
						<h6 class="card-text">결재시도 금액 : ${dailySale.totalAccount}</h6>
						<h6 class="card-text">환불 결재금액 :
							${dailySale.totalRefudAccount}</h6>
						<h6 class="card-text">
							실 결재금액 : ${dailySale.totalRealAccount} <br />
						</h6>
					</div>
					<div class="col-md-4">
						<!-- The Modal Start -->
						<div class="container mt-3">
							<!-- Button to Open the Modal -->
							<button type="button" class="btn btn-primary" data-toggle="modal"
								data-target="#myModal">해당 자판기 슬롯 정보보기</button>


							<div class="modal fade" id="myModal">
								<div class="modal-dialog modal-lg">
									<div class="modal-content">

										<!-- Modal Header -->
										<div class="modal-header">
											<h4 class="modal-title">슬롯설정 현황</h4>
											<button type="button" class="close" data-dismiss="modal">×</button>
										</div>

										<!-- Modal body -->
										<div class="modal-body">


											<h6 class="card-text">
											<table class="table table-striped">
											<thead>
												<tr>
													<th>Slot</th>
													<th>SlotStatus</th>
													<th>Stock</th>
													<th>ProductName</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody id="myTable">
												<c:forEach var="slot" items="${slots}">
													<tr>
														<td>${slot.slotNum}</td>
														<td>${slot.slotStatus}</td>
														<td>${slot.unitsOnSlot} / ${slot.sizeOnSlot}</td>
														<td>${slot.product.productName}</td>
														<td>${slot.product.unitPrice}</td>
													</tr>
												</c:forEach>
											</tbody>
										</table>
										</h6>

										</div>

										<!-- Modal footer -->
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary"
												data-dismiss="modal">Close</button>
										</div>

									</div>
								</div>
							</div>

						</div>
						<!-- The Modal End -->
					</div>
				</div>
			</div>




			<hr />
			<h6 class="card-text">
				슬롯별 판매 수량 <br />
			</h6>
			<div class="container">
				<canvas id="cntChart"></canvas>
			</div>

			<hr />
			<h6 class="card-text">
				슬롯별 판매 금액 <br />
			</h6>
			<div class="container">
				<canvas id="amountChart"></canvas>
			</div>

		</div>
	</div>
	<p style="margin-top: 14px">검색하고자하는 키워드를 입력하면 자동 검색됩니다.</p>
	<input class="form-control" id="myInput" type="text"
		placeholder="Search.."> <br />
	<table class="table table-striped">
		<thead>
			<tr>
				<th>OrderId</th>
				<th>TransactionId</th>
				<th>Date</th>
				<th>Method</th>
				<th>TotalAmount</th>
				<th>SuccessAmount</th>
				<th>RefundAmount</th>
				<th>RefundStatus</th>
				<th>RefundDesc</th>
				<th>SaleItems</th>
				<th>RefundItems</th>
				<th>PaymentError</th>
			</tr>
		</thead>
		<tbody id="myTable">
			<c:forEach var="pay" items="${dailySale.payments}">
				<tr>
					<td>${pay.orderId}</td>
					<td>${pay.transactionId}</td>
					<td>${pay.paymentDate}</td>
					<td>${pay.paymentMethodId}</td>
					<td>${pay.amount}</td>
					<td>${pay.amount}</td>
					<td>${pay.refund}</td>
					<td>${pay.refundResult}</td>
					<td>${pay.refundDesc}</td>
					<td>${pay.salesItems}</td>
					<td>${pay.refundItems}</td>
					<td>${pay.paymentError}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>

</div>

<!--  날짜검색 -->
<script type="text/javascript">
	$(function () { 
		$('#datetimepicker1').datetimepicker({ format: 'L'});
		$('#datetimepicker2').datetimepicker({ format: 'L', useCurrent: false });
		$("#datetimepicker1").on("change.datetimepicker", function (e) { $('#datetimepicker2').datetimepicker('minDate', e.date); });
		$("#datetimepicker2").on("change.datetimepicker", function (e) { $('#datetimepicker1').datetimepicker('maxDate', e.date); }); 
	}); 
</script>

<!-- 자동검색 -->
<script>
	$(document).ready(function(){
	  $("#myInput").on("keyup", function() {
	    var value = $(this).val().toLowerCase();
	    $("#myTable tr").filter(function() {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
	  });
	});
	</script>

<!-- 차트 -->
<script>
				var cntCtx = document.getElementById('cntChart');
				var cntChart = new Chart(cntCtx, {
					type : 'bar',
					data : {

						labels :  ${slotNames}, // [ 'Red', 'Blue', 'Yellow', 'Green', 'Purple','Orange' ], // 여기에 각 슬롯별 색상 리스트 정보
						datasets : [ {
							label : ' 슬롯당 팬매 수량',
							data :  ${dailySale.saleCntPerSlot}, // [ 12, 19, 3, 5, 2, 3 ],   //여기에 각 슬롯 번호 리스트
							backgroundColor : [ 'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)'],
							borderColor : [ 'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)' ],
							borderWidth : 1
						} ]
					},
					options : {
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								}
							} ]
						}
					}
				});

				var amountCtx = document.getElementById('amountChart');
				var amountChart = new Chart(amountCtx, {
					type : 'bar',
					data : {

						labels :  ${slotNames},
						datasets : [ {
							label : ' 슬롯당 팬매 금액',
							data :  ${dailySale.amountPerSlot},
							backgroundColor : [ 'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)'],
							borderColor : [ 'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)' ],
							borderWidth : 1
						} ]
					},
					options : {
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								}
							} ]
						}
					}
				});
			</script>

<script src="/js/board.js"></script>
<%@ include file="../layout/footer.jsp"%>