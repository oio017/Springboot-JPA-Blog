package com.cos.blog.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.model.User;
import com.cos.blog.repository.UserRepository;


/* 서비스에 대한 설명
 *		1. 트랜잭션 관리
 * 		2. 서비스 의미 : 관련 DB(CRUD) 모든 행위 일체 하나의 트랜젹션으로 처리하는 것
 * */

@Service // springboot가 컴포넌트 스캔하여 Bean에 등록을 해줌 -> IoC (메모리에 로딩을 대신 해줌)
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired  // DI가 되어 자동 주입됨.
	private BCryptPasswordEncoder encoder;


	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void save(User user) {
		String rawPassword = user.getPassword();
		String encPassword = encoder.encode(rawPassword);
		
		user.setPassword(encPassword);
		userRepository.save(user);
	}
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리.
	public void 회원수정(User user) {
		// 수정시에는 영속성 컨텍스트 user 오브젝트를 영속화시키고, 영속화된 User 오브젝트를 수정함.
		// 1. Select 해서 DB로부터 데이타를 가져와 영속화시킴.
		// 2. 영속화된 오브젝트를 변경한 후 commit 시 자동으로 DB에 update문을 날려줌.
		User persistance = userRepository.findById(user.getId()).orElseThrow(()->{
			return new IllegalArgumentException("회원찾기 실패");
		});
		
		String rawPassword = user.getPassword();
		String encPassword = encoder.encode(rawPassword);
		persistance.setPassword(encPassword);
		persistance.setEmail(user.getEmail());
		
		System.out.println("email : " + user.getEmail());
		// 회원수정 함수 종료 (서비스 종료 = 트랜잭션 종료 = Commit  수행) 시 DB에 update문을 날려 실제 적용함.
	}
	
// 기본학습을 위한 자체 로그인 처리 함수	
//	@Transactional(readOnly = true)  //Select 할때 트랜잭션 시작, 서비스 종료 시에 트랜잭션 종료 시까지 정합성을 유지시켜줌.
//	public User login(User user) {
//		return userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
//	}
	
}
