package com.cos.blog.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.Board;
import com.cos.blog.model.DeviceType;
import com.cos.blog.model.VendingMachine;

// DAO ( Data Access Object) 역활 
// 자동으로 bean 등록이 된다.
@Repository // 생략가능하다.
public interface DeviceRepository extends JpaRepository<DeviceType, Integer> {
	
}
