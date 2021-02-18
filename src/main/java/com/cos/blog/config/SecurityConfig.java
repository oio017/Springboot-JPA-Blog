package com.cos.blog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.cos.blog.config.auth.PrincipalDetailService;

 
@Configuration 			// 빈 등록 의미 : 스프링 컨테이너에서 객체를 관리할 수 있게하는 것 (IoC로 관리)
@EnableWebSecurity 	// 시큐리티 필터로 등록이 된다. 
@EnableGlobalMethodSecurity(prePostEnabled=true)	// 특정 주소로 접근을 하면 권한 및 인증을 미리 체크하겠다는 뜻.
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private PrincipalDetailService principalDetailService; 
	
	@Bean // IoC 적용 : 리턴되는 BCryptPasswordEncoder 객체를 스프링에서 관리함. 
	public BCryptPasswordEncoder encodePWD() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean  // DI로 설정
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		// TODO Auto-generated method stub
		return super.authenticationManagerBean();
	}

	/*
	 * 시큐리티가 대신 로그인을 처리해주는데 password를 가로채기를 하는데
	 * 해당 password가 뭘로 해쉬가 되어 회원가입이 되었는지 알아야
	 * 같은 해쉬로 암호화해서 DB에 있는 해쉬랑 비교할 수 있음.
	 */
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(principalDetailService).passwordEncoder(encodePWD());
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {

		// 필터관련 설정
		http
			.csrf().disable()		//csrf 토큰 비활성화.
			.authorizeRequests()
				.antMatchers("/", "/auth/**", "/js/**", "/css/**", "/image/**")
				.permitAll()
				.anyRequest()
				.authenticated()
			.and()
				.formLogin()
				.loginPage("/auth/loginForm")						// 인증이 되지 않은 페이지 요청은 로그인 페이지로 이동시킴
				.loginProcessingUrl("/auth/loginProc") 	// 스프링 시큐리티가 로그인 요청을 가로채서 대신 로그인 처리함. 
																						// -> loadUserByUsername() -> DB에서 user select  
																						// -> auth.userDetailService에 등록해 PrincipalDetail 리턴
																						// -> passwordEncoder()에 의해 사용자가 입력한 패스워드를 암호화하여 DB의 password와 비교 
																						// -> 스프링 시큐리터 영역에 PrincipalDetai 형태로 저장.
				.defaultSuccessUrl("/");								// 로그인 정상처리 이후 이동 페이지 지정
				// failureUrl("/fail"); // 로그인 처리 실패 시 이동 페이지 지
	}
	
}
