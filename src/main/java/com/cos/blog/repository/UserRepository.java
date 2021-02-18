package com.cos.blog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.User;

// DAO ( Data Access Object) 역활 
// 자동으로 bean 등록이 된다.
@Repository // 생략가능하다.
public interface UserRepository extends JpaRepository<User, Integer> {
	
	// 기본학습을 위한 자체 로그인 처리 함수	
	// 로그인 방법1. JPA Naming 전략 -> 이름 규칙에 의해서 자동으로 'select * FROM user WHERE username = ? and password = ?;' 가 동작하게 됨.
	// User findByUsernameAndPassword(String username, String password);
	
	// 로그인 방법2.
	// @Query(value="SELECT * FROM user WHERE username = ?1 AND password = ?2", nativeQuery = true)
	// User login(String username, String password);
	
	//함수 이름규칙에 의해 --> SELECT * FROM user WHERE username = ?;
	Optional<User> findByUsername(String username);
}
