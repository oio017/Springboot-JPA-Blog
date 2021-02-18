package com.cos.blog.test;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
//import lombok.RequiredArgsConstructor;
//import lombok.Getter;
//import lombok.Setter;

//@Getter
//@Setter
@Data
//@AllArgsConstructor //모든 변수에 대해 args 적용 후 생성
@NoArgsConstructor //  빈 args 적용 후 생성
//@RequiredArgsConstructor // Final 에 대해서만 args 적용 후 생성
public class Member {
	private  int id;
	private  String username;
	private  String password;
	private  String email;
	
	@Builder
	public Member(int id, String username, String password, String email) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
	}
	
}
