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
import com.cos.blog.model.DeviceType;
import com.cos.blog.repository.DeviceRepository;



/* 서비스에 대한 설명
 *		1. 트랜잭션 관리
 * 		2. 서비스 의미 : 관련 DB(CRUD) 모든 행위 일체 하나의 트랜젹션으로 처리하는 것
 * */

@Service // springboot가 컴포넌트 스캔하여 Bean에 등록을 해줌 -> IoC (메모리에 로딩을 대신 해줌)
public class DeviceService {

	@Autowired // DI : Dependency Injection
	private DeviceRepository deviceRepository;
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void save(DeviceType deviceType) {
	
		System.out.println("deviceInfo : " + deviceType);
		String slotName = deviceType.getSlotName();
		
		System.out.println("slotName : " + slotName);
		
		try {
			JSONParser parser = new JSONParser();
			JSONArray ja;
			ja = (JSONArray) parser.parse(slotName);
			System.out.print("size: "+  ja.size());
			deviceType.setTotalslotCnt(ja.size());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			System.out.println("getLocalizedMessage : " + e.getLocalizedMessage());
		}
		
		deviceRepository.save(deviceType);
	}
	
	@Transactional(readOnly = true)
	public Page<DeviceType> deviceTypeList(Pageable pageable){
		return deviceRepository.findAll(pageable);
	}
	
	@Transactional(readOnly = true)
	public DeviceType detail(int id) {
		return deviceRepository.findById(id)
				.orElseThrow(()->{
					return new IllegalArgumentException("해당 디바이스 모델을 찾을 수가 없습니다.");
				});
	}
	
}
