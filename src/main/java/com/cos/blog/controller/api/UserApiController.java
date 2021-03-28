package com.cos.blog.controller.api;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.dto.ResponseDto;
import com.cos.blog.model.User;
import com.cos.blog.service.UserService;

import type.RoleType;

@RestController
public class UserApiController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private AuthenticationManager authenticationManager;

//	@Autowired
//	private HttpSession session;
		
	
	@PostMapping("/auth/joinProc")
	// json data를 수신하기 위하여 @RequestBody 명시.
	// 명시가 없으면 key=value 타입으로 데이타 수신함. x-www-form-urlencoded
	public ResponseDto<Integer> save(@RequestBody User user) {
		System.out.println("UserApiController : save");
		
		user.setRole(RoleType.USER);
		userService.save(user);
		
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
	@PutMapping("/user")
	// json data를 수신하기 위하여 @RequestBody 명시.
	// 명시가 없으면 key=value 타입으로 데이타 수신함. x-www-form-urlencoded
	public ResponseDto<Integer> update(@RequestBody User user /* HttpSession session */) {
		
		userService.회원수정(user);

		// 여기서는 트랜잭션이 종료되기 때문에 DB에 값은 변경이 되었음.
		// 하지만 세션값은 변경되지 않은 상태임 --> 직접 세션값을 변경해줘야 함.
		Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
		SecurityContext securityContext = SecurityContextHolder.getContext();
		securityContext.setAuthentication(authentication);
		
		// session 내 authentication 을 변경된 내용 적용완료 (해당 작업 안해됨)
		//	session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
		
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
// 기본학습을 위한 자체 로그인 처리 함수	
//	@PostMapping("/api/user/login")
//	//public ResponseDto<Integer> login(@RequestBody User user, HttpSession session) { // @Autowired private HttpSession session; 으로도 가능
//	public ResponseDto<Integer> login(@RequestBody User user) {
//		System.out.println("UserApiController : login");
//		
//		// principal : 접근주체 언급 시 사용되는 용어
//		User principal = userService.login(user); 
//		if (principal != null) {
//			session.setAttribute("principal", principal);
//		}
//	 	
//		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
//	}
	
}
