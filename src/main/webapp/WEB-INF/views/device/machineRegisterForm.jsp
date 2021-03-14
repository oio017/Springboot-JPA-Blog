<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

<div class="container">
	<form action="/action_page.php">
		<input type="hidden" id="slotName" value="" />
		<div class="form-group">
			<label for="merchantName">Merchant Name</label> <input type="text"
				class="form-control"
				placeholder="Enter Merchant Name (ex. CVVN1000011)"
				id="merchantName">
		</div>
		<div class="form-group">
			<label for="merchantCode">Merchant Code</label> <input type="text"
				class="form-control"
				placeholder="Enter Merchant Code (ex. CVVN1000011)"
				id="merchantCode">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="deviceStatus">기기타입</label>
			</div>
			<select class="custom-select" id="deviceType">
				<option selected>Choose...</option>
				<c:forEach var="deviceType" items="${deviceTypes}">
					<option value="${deviceType.id}">${deviceType.modelName}</option>
				</c:forEach>
			</select>
		</div>

		<div class="form-group">
			<label for="deviceType">IP</label> <input type="text"
				class="form-control"
				placeholder="Enter IP address (ex. 192.168.1.100)" id="ip">
		</div>

		<div class="form-group">
			<label for="deviceType">PORT</label> <input type="text"
				class="form-control" placeholder="Enter Port (ex. 12345)" id="port">
		</div>

		<div class="form-group">
			<label for="deviceType">Accees Code</label> <input type="text"
				class="form-control" placeholder="Enter access code" id="accessCode">
		</div>
		<div class="form-group">
			<label for="hashKey">Hash Key</label> <input type="text"
				class="form-control" placeholder="Enter hash key" id="hashKey">
		</div>

		<div class="form-group">
			<label for="consoleAccount">Console Account</label> <input type="text"
				class="form-control" placeholder="Enter Console Account"
				id="consoleAccount">
		</div>

		<div class="form-group">
			<label for="consolePassword">Console Password</label> <input type="text"
				class="form-control" placeholder="Enter Console Password"
				id="consolePassword">
		</div>

		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="internetStatus">인터넷
					가능여부</label>
			</div>
			<select class="custom-select" id="internet">
				<option selected>Choose...</option>
				<option value="3">ENABLE</option>
				<option value="4">DISABLE</option>
			</select>
		</div>
		
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="Operstatus">운영상 상태</label>
			</div>
			<select class="custom-select" id="status">
				<option selected>Choose...</option>
				<option value="0">STOP</option>
				<option value="1">RUNNING</option>
				<option value="2">BROKEN</option>
			</select>
		</div>
		
		<div class="form-group">
			<label for="location">설치 위치정보</label> <input type="text"
				class="form-control" placeholder="설치한 위치 정보를 입력하세요." id="location">
		</div>
		
<%-- 		<div class="card bg-light">
			<div class="card-body">
				<h6 class="card-text">슬롯별 지정된 상품정보</h6>
				<hr />

				<!--열 자판기 첫번쨰 열 -->
				<c:forEach var="row" items="${deviceTypes}">
					<div class="form-group row">

						<!-- 각열에 비치된 컬럼 -->
						<c:forEach var="col" items="${deviceTypes}">
							<div class="col-xs-2">
								<label for="ex3">Slot3</label> <select class="custom-select"
									id="deviceType">
									<option selected>Choose...</option>
									<c:forEach var="deviceType" items="${deviceTypes}">
										<option value="{deviceType.modelName}">${deviceType.modelName}</option>
									</c:forEach>
								</select>
							</div>
						</c:forEach>

					</div>
				</c:forEach>


			</div>
		</div> --%>

	</form>

	<hr/>
	<button id="btn-vendingMachine-save" class="btn btn-primary">등록</button>

</div>
<!-- <script>
	$("#deviceType")
			.change(
					function() {
						if ($(this).val() == 1) {
							document.getElementById("cntPerSlot").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
							document.getElementById("slotName").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
						} else if ($(this).val() == 2) {
							document.getElementById("cntPerSlot").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
							document.getElementById("slotName").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
						} else {
							document.getElementById("cntPerSlot").value = '';
							document.getElementById("slotName").value = '';
						}

					});
</script> -->
<script src="/js/deviceInfo.js"></script>
<%@ include file="../layout/footer.jsp"%>

