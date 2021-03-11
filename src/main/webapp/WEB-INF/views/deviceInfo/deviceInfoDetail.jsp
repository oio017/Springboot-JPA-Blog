<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

<div class="container">
	<form action="/action_page.php">
		<div class="form-group">
			<label for="username">모델 이름</label> <input type="text"
				value="${deviceInfo.modelName}" class="form-control"
				placeholder="Enter modelName" id="modelName" readonly>
		</div>
		<div class="form-group">
			<label for="password">모델 상태</label> <input type="text"
				value="${deviceInfo.status}" class="form-control"
				placeholder="Enter Status" id="cntPerSlot" >
		</div>
	
		<div class="form-group">
			<label for="password">각 슬롯 번호</label> <input type="text"
				value="${deviceInfo.slotName}" class="form-control"
				placeholder="Enter SlotName" id="slotName" readonly>
		</div>
		<div class="form-group">
			<label for="password">각 슬롯 칸수</label> <input type="text"
				value="${deviceInfo.cntPerSlot}" class="form-control"
				placeholder="Enter cnt per each Slot" id="cntPerSlot" readonly>
		</div>
		<div>
			<label for="content">설명내용</label>
		</div>
		<hr />
		<div>${deviceInfo.content}</div>
		<hr />
	</form>

	<button id="btn-update" class="btn btn-primary">기기타입 수정</button>

</div>

<script src="/js/user.js"></script>
<%@ include file="../layout/footer.jsp"%>