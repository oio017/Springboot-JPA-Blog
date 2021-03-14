package com.cos.blog.service;

import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.dto.DailySaleSaveRequestDto;
import com.cos.blog.model.Board;
import com.cos.blog.model.DeviceType;
import com.cos.blog.repository.DeviceRepository;
import com.cos.blog.repository.VendingMachineRepository;



@Service
public class VendingStatusService {

	@Autowired // DI : Dependency Injection
	private VendingMachineRepository vendingMachineRepository;
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void dailySaleSave(DailySaleSaveRequestDto dailySaleSaveRequestDto) {
		
		
//		List<Payment> payments = dailySaleSaveRequestDto.getPayments();
//		payments.forEach(payment -> {
//			System.out.println(payment);
//		});
		
//		public static void makeSingleValue(List<String> csv, String[] column, JSONObject jsonObject) {
//			csv.subList(0, csv.size()) // substring without first row(columns)
//					.stream().map(e -> e.split(",")).filter(e -> e[0].length() > 0 && csv.indexOf(e[0]) > 0)
//					.forEach(row -> {
//						
//						if (column[0].equals("Device name")) {
//							jsonObject.put("Device name", row[0]);
//						}
//						else if (column[0].equals("Merchant code")) {
//							jsonObject.put("Merchant code", row[0]);
//						}
//						else if (column[0].equals("Date range")) {
//							jsonObject.put("Date range", row[0]);
//						}
//						else {
//							System.out.println("Naver be here: " + row[0]);
//						}
//					});
//		}
		
		
		// VendingMachineRepository
		// DailySaleRepository
		
		// PaymentRepository
		// OrderItemRepository
	}
}
