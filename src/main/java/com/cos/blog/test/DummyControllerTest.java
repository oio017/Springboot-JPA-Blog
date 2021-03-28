package com.cos.blog.test;

import java.util.List;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.model.Reply;
import com.cos.blog.model.User;
import com.cos.blog.repository.UserRepository;

import type.RoleType;

import org.springframework.data.domain.Sort;



@RestController
public class DummyControllerTest {
	
	@Autowired // DI --> 의존성 주입
	private UserRepository userRepository;
	
	@DeleteMapping("/dummy/user/{id}")
	public String delete(@PathVariable int id) {

		try {
			userRepository.deleteById(id);
		}
		catch (EmptyResultDataAccessException e) {
			return "삭제에 실패했습니다. 해당 id는 DB에 존재하지 않습니다.";
		}
		
		return "삭제되었습니다. id: " + id;
	}

	
	
	@Transactional // 함수종료 시 자동 commit 진행 -> Dirty check (영속성 컨텍스트 vs DB)-> save() 호출 없이 자동 Update가 된다.
	@PutMapping("/dummy/user/{id}")
	public User updateUser(@PathVariable int id, @RequestBody User requestUser) { //@RequestBody -> JSon Format  (비교 : key=value 데이타 타입은 어노테이션 불필요함)
		
		User user = userRepository.findById(id).orElseThrow( ()-> {
			return new IllegalArgumentException("수정에 실패하였습니다. id: " + id);			
		});
		
		user.setPassword(requestUser.getPassword());
		user.setEmail(requestUser.getEmail());
			
		userRepository.save(user);
		//save 역활
		// ID를 전달하지 않으면 insert
		// ID를 전달하면 새로운 ID이면 Update, 기존에 ID가 있으면 Insert
		// 
		return user;
	}
	
	@GetMapping("/dummy/users")
	public List<User> list() {
		return userRepository.findAll();
	}
	
	@GetMapping("/dummy/user")
	public List<User> pageList(@PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) {
//		Page<User> users = (Page<User>) userRepository.findAll(pageable);
//		return users;
		
		Page<User> pagingUser = userRepository.findAll(pageable);
//		if (pagingUser.isLast()) {			
//		}
		
		List<User> users = pagingUser.getContent();
		
		return users;
	}
	
	@GetMapping("/dummy/user/{id}")
	public User detail(@PathVariable int id) {
		
//		User user = userRepository.findById(id).orElseGet(new Supplier <User> () {
//
//			@Override // null 일 경우에만 비어있는 user 객체가 반환된다.
//			public User get() {
//				// TODO Auto-generated method stub
//				return  new User();
//			}
//			
//			});
		
//		User user = userRepository.findById(id).orElseThrow(new Supplier <IllegalArgumentException> () {
//
//			@Override
//			public IllegalArgumentException get() {
//				// TODO Auto-generated method stub
//				return new IllegalArgumentException("해당 유저는 존재하지 않습니다. id: " + id);
//			}
//			
//		});
		
		User user = userRepository.findById(id).orElseThrow( ()-> {
				return new IllegalArgumentException("해당 유저는 존재하지 않습니다. id: " + id);			
		});
		
		return user;
	}
	
	//@PostMapping(value = "/dummy/join", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	@PostMapping("/dummy/join")
	public String join(User user) {
		
		System.out.println("username: " );
		
		user.getUsername();
		user.setRole(RoleType.ADMIN);
		
	
		userRepository.save(user);
		return "회원가입 완료";
	}
	
	
	

}
