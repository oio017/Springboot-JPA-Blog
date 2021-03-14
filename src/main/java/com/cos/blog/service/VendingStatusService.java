package com.cos.blog.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.dto.DailySaleSaveRequestDto;
import com.cos.blog.model.DailySale;
import com.cos.blog.model.Payment;
import com.cos.blog.model.VendingMachine;
import com.cos.blog.repository.DailySaleRepository;
import com.cos.blog.repository.OrderItemRepository;
import com.cos.blog.repository.PaymentRepository;
import com.cos.blog.repository.VendingMachineRepository;



@Service
public class VendingStatusService {

	@Autowired // DI : Dependency Injection
	private VendingMachineRepository vendingMachineRepository;
	
	@Autowired // DI : Dependency Injection
	private DailySaleRepository dailySaleRepository;
	
	@Autowired // DI : Dependency Injection
	private PaymentRepository paymentRepository;
	
	@Autowired // DI : Dependency Injection
	private OrderItemRepository orderItemRepository;
	
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void dailySaleSave(DailySaleSaveRequestDto dailySaleSaveRequestDto) {
		
		System.out.println("getMerchantName : " + dailySaleSaveRequestDto.getMerchantName());
		System.out.println("getDate : " + dailySaleSaveRequestDto.getDate());

		
	
		
		////////////////////////////////////
		//  1. VendingMachineRepository
		String merchantName = dailySaleSaveRequestDto.getMerchantName();
		VendingMachine vendingMachine = vendingMachineRepository.findByMerchantName(merchantName)
				.orElseThrow(()->{
				return new IllegalArgumentException("해당 자판기 정보가 없습니다.");
			});
		
		//  2. DailySaleRepository
		DailySale dailySale = new DailySale();
		dailySale.setVendingMachine(vendingMachine);
		dailySale.setDate(dailySaleSaveRequestDto.getDate());
		
		dailySaleSaveRequestDto.getPayments().forEach(payment ->{
			//3. PaymentRepository
			System.out.println("paymentInfo : " + payment.toString());
			payment.getPayment().setVendingMachine(vendingMachine);
			paymentRepository.save(payment.getPayment());
			
			
			payment.getOrderItems().forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.toString());
				// 4. OrderItemRepository
				orderItem.setPayment(payment.getPayment());
				orderItemRepository.save(orderItem);
			});
		});
	
	}
}
