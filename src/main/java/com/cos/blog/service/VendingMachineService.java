package com.cos.blog.service;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.model.Board;
import com.cos.blog.model.DeviceInfo;
import com.cos.blog.repository.DeviceRepository;
import com.cos.blog.repository.VendingMachineRepository;



/* 서비스에 대한 설명
 *		1. 트랜잭션 관리
 * 		2. 서비스 의미 : 관련 DB(CRUD) 모든 행위 일체 하나의 트랜젹션으로 처리하는 것
 * */

@Service // springboot가 컴포넌트 스캔하여 Bean에 등록을 해줌 -> IoC (메모리에 로딩을 대신 해줌)
public class VendingMachineService {

	@Autowired // DI : Dependency Injection
	private VendingMachineRepository vendingMachineRepository;
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void save(DeviceInfo deviceInfo) {
	
		
		
		vendingMachineRepository.save(deviceInfo);
	}
	
	@Transactional(readOnly = true)
	public Page<DeviceInfo> vendingMachineList(Pageable pageable){
		return vendingMachineRepository.findAll(pageable);
	}
	
	@Transactional(readOnly = true)
	public DeviceInfo detail(int id) {
		return vendingMachineRepository.findById(id)
				.orElseThrow(()->{
					return new IllegalArgumentException("해당 자판기 정보를 찾을 수가 없습니다.");
				});
	}
	

	
}
