package com.cos.blog.config.auth;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.cos.blog.model.User;

import lombok.Getter;


//kakao rest api : 888337fb436e0b308721bd34259a93d5
//
//http://localhost:8000/auth/kakao/callback
//
//카카오로부터 받을 정보 : profile 정보(필수), email(선택)


// 스피링 시큐리트가 로그인 요청을 가로채서 로그인을 진행하고 완료가 되면
// UserDetails 타입의 오브젝트를 스트링 시큐리티의 고유한 세션 저장소에 저장을 해준다
@Getter
public class PrincipalDetail implements UserDetails {
	private User user;		// 콤포지션

	public PrincipalDetail(User user) {
		this.user = user;
	}
	
	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}

	// 계정이 만료되지 않았는지 리턴 (true: 유효, false: 만료)
	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	// 계정 잠김여부
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	// 비번 완료 여부
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	// 계정 활성 여부
	@Override
	public boolean isEnabled() {
		return true;
	}
	
	// 계정의 권한을 리턴
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		
		Collection<GrantedAuthority> collectors = new ArrayList<>();
//		collectors.add(new GrantedAuthority() {
//
//			@Override
//			public String getAuthority() {
//				// 스피링의 pre_fix 규칙 : "ROLE_XXX"
//				return "ROLE_"+user.getRole();
//			}
//		});
		collectors.add(()->{
			return "ROLE_"+user.getRole();
		});
		
		return collectors;
	}
	
}
