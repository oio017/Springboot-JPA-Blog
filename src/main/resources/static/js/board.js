let index = {

	// 리스너 함수 리스트
	init: function() {
		$("#btn-save").on("click", () => {
			this.save();
		});
		$("#btn-delete").on("click", () => {
			this.deleteByid();
		});
		$("#btn-update").on("click", () => {
			this.update();
		});
		$("#btn-reply-save").on("click", () => {
			this.replySave();
		});
	},

	save: function() {
		let data = {
			title: $("#title").val(),
			content: $("#content").val()
		};

		//ajax를 통신을 이용해서 3개의 데이터를 json으로 변경해서 inert 요청
		$.ajax({
			type: "POST",
			url: "/api/board",
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8", // 요청 시 DataType 지정 : Json일 경우 JavaScript 오브젝트로 변경
			dataType: "json" // 응답에 대한 DataType 지정
		}).done(function(resp) {
			alert("글쓰기가 완료 되었습니다.");
			location.href = "/";

		}).fail(function(error) {
			alert(JSON.stringify(error));
		});
	},

	deleteByid: function() {
		let id = $("#id").text();

		$.ajax({
			type: "DELETE",
			url: "/api/board/" + id,
			data: "json"
		}).done(function(resp) {
			alert("삭제가 완료 되었습니다.");
			location.href = "/";
		}).fail(function(error) {
			alert(JSON.stringify(error));
		}); //ajax를 통신을 이용해서 3개의 데이터를 json으로 변경해서 inert 요청
	},

	update: function() {
		let id = $("#id").val();

		let data = {
			title: $("#title").val(),
			content: $("#content").val()
		};

		//ajax를 통신을 이용해서 3개의 데이터를 json으로 변경해서 inert 요청
		$.ajax({
			type: "PUT",
			url: "/api/board/" + id,
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8", // 요청 시 DataType 지정 : Json일 경우 JavaScript 오브젝트로 변경
			dataType: "json" // 응답에 대한 DataType 지정
		}).done(function(resp) {
			alert("글쓰기 수정이 완료되었습니다.");
			location.href = "/";
		}).fail(function(error) {
			alert(JSON.stringify(error));
		});
	},
	
	replySave: function() {
		let data = {
			userId: $("#userId").val(),
			boardId: $("#boardId").val(),
			content: $("#reply-content").val()
		};
		// let boardId = $("#boardId").val();
		
		$.ajax({
			type: "POST",
			//url: `/api/board/${data.boardId}/reply`,
			url: `/api/board/${data.boardId}/reply`,
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
		}).done(function(resp) {
			alert("댓글 작성이 완료 되었습니다.");
			location.href = `/board/${data.boardId}`;

		}).fail(function(error) {
			alert(JSON.stringify(error));
		});
	},
	
		// Onclick Event 함수이며 리스너를 통해 호출되는 것이 아님.
		replyDelete: function(boardId, replyId) {
		
		$.ajax({
			type: "DELETE",
			url: `/api/board/${boardId}/reply/${replyId}`,
			dataType: "json"
		}).done(function(resp) {
			alert("댓글이 삭제되었습니다.");
			location.href = `/board/${boardId}`;
		}).fail(function(error) {
			alert(JSON.stringify(error));
		});
	},
}

index.init();
