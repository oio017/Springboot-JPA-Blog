<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

<div class="container">
	<form action="/action_page.php">
		<input type="hidden"  id="slotName" value=""/>
		<div class="form-group">
			<label for="deviceType">모델 이름</label> <input type="text"
				class="form-control" placeholder="Enter Modle Name (ex. Combo60)"
				id="modelName">
		</div>
		
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="deviceStatus">모델 상태</label>
			</div>
			<select class="custom-select" id="deviceStatus">
				<option selected>Choose...</option>
				<option value="3">ENABLE</option>
				<option value="4">DISABLE</option>
			</select>
		</div>
		
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="namePerEachSlot">각 슬롯 번호</label>
			</div>
			<select class="custom-select" id="namePerEachSlot">
				<option selected>Choose...</option>
				<option value="1">[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]</option>
				<option value="2">[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]</option>
			</select>
		</div>
		
		<div class="form-group">
			<label for="cntPerSlot">각 슬롯 칸수(해당 슬롯의 칸수를 직접 입력하세요.)</label> <input type="text"
				class="form-control" placeholder="Enter size of each slot"
				id="cntPerSlot">
		</div>
		
		<div class="form-group">
			<label for="content">설명내용</label>
			<textarea class="form-control summernote" rows="5" id="content"></textarea>
		</div>

	</form>

	<button id="btn-save" class="btn btn-primary">등록완료</button>

</div>
<script>
	$('.summernote').summernote({
		tabsize : 2,
		height : 300
	});

	$("#namePerEachSlot").change(function(){
	    if($(this).val() == 1 ) {
	    	document.getElementById("cntPerSlot").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
	    	document.getElementById("slotName").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
		}
	    else if($(this).val() == 2){
	    	document.getElementById("cntPerSlot").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
	    	document.getElementById("slotName").value = '[1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]';
		}
	    else{
	    	document.getElementById("cntPerSlot").value = '';
	    	document.getElementById("slotName").value = '';
		}
	   
	   
	});
	
</script>
<script src="/js/deviceInfo.js"></script>
<%@ include file="../layout/footer.jsp"%>
