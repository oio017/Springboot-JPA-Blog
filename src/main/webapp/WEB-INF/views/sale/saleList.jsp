<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>


<div class="container">

	<button class="btn btn-secondary" onclick="history.back()">돌아가기</button>
	<br /> <br />
	<div>
		Merchant Code : <span id="id"><i>${sales.Merchantcode} </i></span><br/>
		Date : <span><I>${sales.Daterange} </I></span>
	</div>
	<hr />
	<div class="card bg-light">
		<div class="card-body">
			<h6 class="card-text">결재시도 금액 : ${sales.TotalAmount} </h6>
			<h6 class="card-text">환불 결재금액 : ${sales.TotalRufudAmount} </h6>
			<h6 class="card-text">실 결재금액 : ${sales.TotalRealAmount} <br/> </h6>
			<hr />
			<h6 class="card-text">
				슬롯별 판매 수량 <br/>
			</h6>
			
			<div class="container"> 
				<canvas id="myChart"></canvas> 
			</div>

			<!-- 부트스트랩 -->
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

			<!-- 차트 -->
			<script>
				var ctx = document.getElementById('myChart');
				var myChart = new Chart(ctx, {
					type : 'bar',
					data : {
						labels : ${sales.slotInfoArray}, /* labels : [ 'Red', 'Blue', 'Yellow', 'Green', 'Purple','Orange' ], */
						datasets : [ {
							label : ' 슬롯당 팬매 수량',
							data : ${sales.saleCntInfo}, /* [ 12, 19, 3, 5, 2, 3 ], */
							backgroundColor : [ 'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)' ],
							borderColor : [ 'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)' ],
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
			<h6 class="card-text">
				<c:forEach var="i" begin="0" end="${sales.slotInfoArray.size() -1}">
					<c:out value="${sales.slotInfoArray[i]}" />Slot(<c:out
						value="${sales.saleCntInfo[i]})" />
				</c:forEach>
			</h6>

		</div>
	</div>
	<p style="margin-top:14px">검색하고자하는 키워드를  입력하면 자동 검색됩니다.</p>
	<input class="form-control" id="myInput" type="text" placeholder="Search..">
	<br/>
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
				<th>SuccessSlots</th>
			</tr>
		</thead>
		<tbody id="myTable">
			<c:forEach var="pay" items="${sales.payInfoArray}">
				<tr>
					<td>${pay.OrderId}</td>
					<td>${pay.TransactionId}</td>
					<td>${pay.Date}</td>
					<td>${pay.Method}</td>
					<td>${pay.TotalAmount}</td>
					<td>${pay.SuccessAmount}</td>
					<td>${pay.RefundAmount}</td>
					<td>${pay.RefundStatus}</td>
					<td>${pay.RefundDesc}</td>
					<td>${pay.SuccessSlots}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	
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
</div>

<script src="/js/board.js"></script>
<%@ include file="../layout/footer.jsp"%>

