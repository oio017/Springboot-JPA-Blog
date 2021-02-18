package com.cos.blog.config.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.cos.blog.model.User;
import com.cos.blog.repository.UserRepository;

@Service // Bean 등록 (메모리 로딩)
public class PrincipalDetailService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;
	
	// 스피링이 로그인 요청을 가로챌때 username, password 변수 2개를 취득.
	// password 부분 처리는 자동으로 처리, 틀릴 경우 자동으로 처리
	// username 이 DB에 있는지만 확인 필요.
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User principal = userRepository.findByUsername(username)
				.orElseThrow(()->{
					return new UsernameNotFoundException("해당 사용자를 찾을 수 없습니다. : " + username);
				});
		
		return new PrincipalDetail(principal); // 시큐리티의 세션에 유저정보가 저장됨.
	}

}
