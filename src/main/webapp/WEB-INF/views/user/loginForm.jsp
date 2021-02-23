<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

<div class="container">
	<!-- <form action="/blog/api/user/login"> -->
	<form action="/auth/loginProc" method="post">
		<div class="form-group">
			<label for="username">User name:</label>
			<input type="text"name="username"class="form-control" placeholder="Enter Username" id="username">
		</div>
		<div class="form-group">
			<label for="password">Password:</label> <input type="password"
				name="password"class="form-control" placeholder="Enter password" id="password">
		</div>
		<!-- <div class="form-group form-check">
			<label class="form-check-label"> <input
				name="remeber"class="form-check-input" type="checkbox"> Remember me
			</label>
		</div> -->
		<button id="btn-login" class="btn btn-primary">로그인</button>
	</form>

</div>

<!-- 수동 로그인 시 처리부분, 더이상 사용하지 않고 form 로그인으로 변경 <script src="/js/user.js"></script> -->
<%@ include file="../layout/footer.jsp"%>
