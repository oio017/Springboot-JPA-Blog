let index = {
	init: function() {
		$("#btn-save").on("click", () => {
			this.save();
		});
		$("#btn-update").on("click", () => {
			this.update();
		});

		// js를 사용하는 로그인 사용하지 않고 form login으로 대체함.
		//$("#btn-login").on("click", () => {
		//	this.login();
		//});
	},

	save: function() {
		//alert("test");
		let data = {
			username: $("#username").val(),
			password: $("#password").val(),
			email: $("#email").val()
		};

		//console.log(data);
		$.ajax({
			type: "POST",
			url: "/auth/joinProc",
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8", // 요청 시 DataType 지정 : Json일 경우 JavaScript 오브젝트로 변경
			dataType: "json" // 응답에 대한 DataType 지정
		}).done(function(resp) {
		 	if (resp.status == 500){
		 		alert("회원가입에 실패하였습니다.");
		 	}
		 	else{
			 	alert("회원가입이 완료 되었습니다.");
			 	location.href = "/";
		 	}			
		}).fail(function(error) {
			alert(JSON.stringify(error));
		}); //ajax를 통신을 이용해서 3개의 데이터를 json으로 변경해서 inert 요청
	},

	// js를 사용하는 로그인 사용하지 않고 form login으로 대체함.
	//	login: function() {
	//		//alert("test");
	//		let data = {
	//			username: $("#username").val(),
	//			password: $("#password").val(),
	//		};
	//
	//		$.ajax({
	//			type: "POST",
	//			url: "/api/user/login",
	//			data: JSON.stringify(data),
	//			contentType: "application/json; charset=utf-8", // 요청 시 DataType 지정 : Json일 경우 JavaScript 오브젝트로 변경
	//			dataType: "json" // 응답에 대한 DataType 지정
	//		}).done(function(resp) {
	//			alert("로그인이 완료 되었습니다.");
	//			location.href = "/";
	//		}).fail(function(error) {
	//			alert(JSON.stringify(error));
	//		}); //ajax를 통신을 이용해서 3개의 데이터를 json으로 변경해서 inert 요청
	//	}

	update: function() {
		
		let data = {
			id: $("#id").val(),
			username: $("#username").val(),
			password: $("#password").val(),
			email: $("#email").val()
		};

		alert(data.email);
		$.ajax({
			type: "PUT",
			url: "/user",
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8", // 요청 시 DataType 지정 : Json일 경우 JavaScript 오브젝트로 변경
			dataType: "json" // 응답에 대한 DataType 지정
		}).done(function(resp) {
			alert("회원수정이 완료 되었습니다.");
			// alert(resp);
			location.href = "/";
		}).fail(function(error) {
			alert(JSON.stringify(error));
		});
	}
}

index.init();
