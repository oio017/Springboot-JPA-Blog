package com.cos.blog.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.cos.blog.config.auth.PrincipalDetail;
 
/*
 * 인증이 안된 사용자들이 출입할 수 있는 경로 지정
 * auth/** 에 한해 허용
 * / (/index) 허용
 * /js/**, /css/**, /image/** 허용  
 */

@Controller
public class UserController {

		@GetMapping("/auth/joinForm")
		public String joinForm() {
			return "user/joinForm";
		}
		
		@GetMapping("/auth/loginForm")
		public String loginForm() {
			return "user/loginForm";
		}
		
		@GetMapping("/user/updateForm")
		public String updateForm(@AuthenticationPrincipal PrincipalDetail principal) {
			return "user/updateForm";
		}
}
