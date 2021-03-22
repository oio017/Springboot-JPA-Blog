package com.cos.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.EventLog;

// DAO ( Data Access Object) 역활 
// 자동으로 bean 등록이 된다.
@Repository // 생략가능하다.
public interface EventRepository extends JpaRepository<EventLog, Integer> {
	
}
