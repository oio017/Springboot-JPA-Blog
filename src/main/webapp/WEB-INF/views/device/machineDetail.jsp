<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

<div class="container">
	<form action="/action_page.php">
		<div class="form-group">
			<label for="username">Merchant Name</label> <input type="text"
				value="${vendingMachine.merchantName}" class="form-control"
				placeholder="Enter Merchant Name" id="modelName" readonly>
		</div>
		<div class="form-group">
			<label for="username">Merchant Code</label> <input type="text"
				value="${vendingMachine.merchantCode}" class="form-control"
				placeholder="Enter Merchant Code" id="modelName" readonly>
		</div>
		<div class="form-group">
			<label for="password">기기 타입</label> <input type="text"
				value="${vendingMachine.deviceType.modelName}" class="form-control"
				placeholder="Enter deviceType" id="deviceType"  readonly>
		</div>
	
		<div class="form-group">
			<label for="deviceType">IP</label> <input type="text"
				value="${vendingMachine.ip}" class="form-control"
				placeholder="Enter IP address (ex. 192.168.1.100)" id="ip">
		</div>

		<div class="form-group">
			<label for="deviceType">PORT</label> <input type="text"
				value="${vendingMachine.port}" class="form-control" placeholder="Enter Port (ex. 12345)" id="port">
		</div>

		<div class="form-group">
			<label for="deviceType">Accees Code</label> <input type="text"
				value="${vendingMachine.accessCode}" class="form-control" placeholder="Enter access code" id="accessCode">
		</div>
		<div class="form-group">
			<label for="hashKey">Hash Key</label> <input type="text"
				value="${vendingMachine.hashKey}" class="form-control" placeholder="Enter hash key" id="hashKey">
		</div>
		
		<div class="form-group">
			<label for="consoleAccount">Console Account</label> <input type="text"
				value="${vendingMachine.consoleAccount}" class="form-control" placeholder="Enter Console Account"
				id="consoleAccount">
		</div>

		<div class="form-group">
			<label for="consolePassword">Console Password</label> <input type="text"
				value="${vendingMachine.consolePassword}" class="form-control" placeholder="Enter Console Password"
				id="consolePassword">
		</div>

		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="internetStatus">인터넷
					가능여부</label>
			</div>
			<select class="custom-select" id="internet">
				<option value="3">ENABLE</option>
				<option value="4">DISABLE</option>
			</select>
		</div>
		
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="Operstatus">운영상 상태</label>
			</div>
			<select class="custom-select" id="status">
				<option value="0">STOP</option>
				<option value="1">RUNNING</option>
				<option value="2">BROKEN</option>
			</select>
		</div>
		
		<div class="form-group">
			<label for="location">설치 위치정보</label> <input type="text"
				value="${vendingMachine.location}" class="form-control" placeholder="설치한 위치 정보를 입력하세요." id="location">
		</div>
		
 <div class="card bg-light">
			<div class="card-body">
				<h6 class="card-text">슬롯별 상태정보</h6>
				<hr />

				<!--열 자판기 첫번쨰 열 -->
				<c:forEach var="row" items="${slotArrayList}">
					<div class="form-group row">

						<!-- 각열에 비치된 컬럼 -->
						<c:forEach var="col" items="${row}">
						
							<div class="col-xs-1">
								<label for="ex3">Slot${col}</label>
								
								<input type="text" value="양호" class="form-control" placeholder="Enter access code" id="Slot${col}">
				
								<%-- <select class="custom-select"
									id="deviceType">
									<option selected>Choose...</option>
									<c:forEach var="deviceType" items="${deviceTypes}">
										<option value="{deviceType.modelName}">${deviceType.modelName}</option>
									</c:forEach>
								</select> --%>
								
							</div>
						</c:forEach>

					</div>
				</c:forEach>


			</div>
		</div>
		
	</form>

	<button id="btn-vendingMachine-update" class="btn btn-primary">자판기 정보 수정</button>

</div>
<script>
	window.onload = function() { 
		var internetSel = document.getElementById('internet')
		var statusSel = document.getElementById('status')
		
		if ("${vendingMachine.internet}" == 'ENABLE'){
			/* $("internet").val("4").prop("selected", true);  */
			internetSel.children[0].setAttribute('selected', '')
		}
		else{
			/* $("internet").val("4").prop("selected", true); */
			internetSel.children[1].setAttribute('selected', '')
		}

		if ("${vendingMachine.status}" == 'STOP'){
			statusSel.children[0].setAttribute('selected', '')
		}
		else if ("${vendingMachine.status}" == 'RUNNING'){
			statusSel.children[1].setAttribute('selected', '')
		}
		else{
			statusSel.children[2].setAttribute('selected', '')
		}
	}

	$("#internet").change(function(){
	    if($(this).val() == 1 ) {
	    }
	    else if($(this).val() == 2){
		}
	    else{
		}

	});
	
</script>
<script src="/js/deviceInfo.js"></script>
<%@ include file="../layout/footer.jsp"%>