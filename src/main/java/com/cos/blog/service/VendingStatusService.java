package com.cos.blog.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.dto.DailySaleSaveRequestDto;
import com.cos.blog.dto.PaymentInfoDto;
import com.cos.blog.dto.SlotUpdateRequestDto;
import com.cos.blog.model.Board;
import com.cos.blog.model.DailySale;
import com.cos.blog.model.EventLog;
import com.cos.blog.model.EventType;
import com.cos.blog.model.Payment;
import com.cos.blog.model.Product;
import com.cos.blog.model.Slot;
import com.cos.blog.model.VendingMachine;
import com.cos.blog.repository.DailySaleRepository;
import com.cos.blog.repository.EventRepository;
import com.cos.blog.repository.OrderItemRepository;
import com.cos.blog.repository.PaymentRepository;
import com.cos.blog.repository.ProductRepository;
import com.cos.blog.repository.SlotRepository;
import com.cos.blog.repository.VendingMachineRepository;
import com.cos.blog.util.DataConvert;
import com.cos.blog.util.DataConvert.EntityType;
import com.cos.blog.util.DataConvert.PaymentType;

import antlr.collections.List;



@Service
public class VendingStatusService {

	@Autowired // DI : Dependency Injection
	private VendingMachineRepository vendingMachineRepository;
	
	@Autowired // DI : Dependency Injection
	private DailySaleRepository dailySaleRepository;
	
	@Autowired // DI : Dependency Injection
	private EventRepository eventRepository;
	
	@Autowired // DI : Dependency Injection
	private PaymentRepository paymentRepository;
	
	@Autowired // DI : Dependency Injection
	private OrderItemRepository orderItemRepository;
	
	@Autowired // DI : Dependency Injection
	private ProductRepository productRepository;
	
	@Autowired // DI : Dependency Injection
	private SlotRepository slotRepository;
	
	
	@Autowired // DI : Dependency Injection
	private DataConvert dataConvert;
	
	
	@Transactional(readOnly = true)
	public DailySale findByVendingMachineIdAndDate(int vendingMachineId, String date) {
		return dailySaleRepository.findByVendingMachineIdAndDate(vendingMachineId, date)
				.orElseThrow(()->{
					return new IllegalArgumentException("해당 일일 판매정보를 찾을 수가 없습니다.");
				});
	}
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void dailySaleSave(DailySaleSaveRequestDto dailySaleSaveRequestDto) {
		
		System.out.println("getMerchantName : " + dailySaleSaveRequestDto.getMerchantName());
		System.out.println("getDate : " + dailySaleSaveRequestDto.getDate());
	
		////////////////////////////////////
		//  0. VendingMachineRepository
		String merchantName = dailySaleSaveRequestDto.getMerchantName();
		VendingMachine vendingMachine = vendingMachineRepository.findByMerchantName(merchantName)
				.orElseThrow(()->{
				return new IllegalArgumentException("해당 자판기 정보가 없습니다.");
			});
		
		// 1. EventLog
		EventLog eventLog = new EventLog();
		eventLog.setEventType(EventType.DAILYREPORT);
		eventLog.setVendingMachine(vendingMachine);
		eventLog.setLocalDateTime(dailySaleSaveRequestDto.getDate());
		eventRepository.save(eventLog);
		
		//  2. DailySaleRepository
		DailySale dailySale = new DailySale();
		dailySale.setVendingMachine(vendingMachine);
		dailySale.setDate(dailySaleSaveRequestDto.getDate());
		dailySale.setEventLog(eventLog);
		
		System.out.println("before makeSubParamsOfDailySale");
		makeSubParamsOfDailySale(dailySale, dailySaleSaveRequestDto);
		System.out.println("after makeSubParamsOfDailySale");
		dailySaleRepository.save(dailySale);
		
		// System.out.println("dailySale : " + dailySale.toString());
		
		dailySaleSaveRequestDto.getPayments().forEach(payment ->{
			//3. PaymentRepository
			//System.out.println("paymentInfo : " + payment.toString());
			payment.getPayment().setVendingMachine(vendingMachine);
			payment.getPayment().setDailySale(dailySale);
			paymentRepository.save(payment.getPayment());
			
			
			payment.getOrderItems().forEach(orderItem -> {
				//System.out.println("orderItem : " + orderItem.toString());
				// 4. OrderItemRepository
				orderItem.setPayment(payment.getPayment());
				orderItemRepository.save(orderItem);
			});
		});
	
	}
	
	private void makeSubParamsOfDailySale(DailySale dailySale, DailySaleSaveRequestDto dto) {
		String slotNames = dailySale.getVendingMachine().getDeviceType().getSlotName();
		System.out.println("slotNames : " + slotNames);
		
		dataConvert.init();
		dto.getPayments().forEach(payment ->{
			Payment paymentDetails = payment.getPayment();
			System.out.println("paymentDetails.id : " + paymentDetails.getId());

			// 실제 viettelPay 일 경우만 금액 합산
			if (paymentDetails.getPaymentMethodId() == 1) {
				// totalAccount 결재시도 금액
				dailySale.addTotalAccount(paymentDetails.getAmount());
				
				// totalRefudAccount
				dailySale.addTotalRefudAccount(paymentDetails.getRefund());
				
				// totalRefudCnt/totalFailCnt 환불 성공 건수
				if (paymentDetails.getRefund() > 0) {
					if (paymentDetails.isRefundResult())
						dailySale.increaseTotalRefudCnt();
					if (!paymentDetails.isRefundResult())
						dailySale.increaseTotalFailCnt();
				}
			}
	
			payment.getOrderItems().forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.toString());
				// saleCntPerSlot[x,x,x,x,x,x ....] 슬롯당 판매수량
				
				dataConvert.addCntPerSlot(EntityType.SALE, slotNames, orderItem.getSlotId(), orderItem.getQuantity());
				
				// motorErrorCntPerSlot 슬롯당 모터 오류 발생 횟수
				dataConvert.addCntPerSlot(EntityType.MOTOR, slotNames, orderItem.getSlotId(), orderItem.getDispensingFailItems());

				// 현재 아래 정보는 알수 없음. --> TODO : 이후 버전에 다시 구현할 것.
				// jamCntPerSlot 슬롯당 걸림발생 횟수
				dataConvert.addCntPerSlot(EntityType.JAM, slotNames, orderItem.getSlotId(), payment.getPayment().getRefundItems());
				
				// Slot별 결재금액 합산
				dataConvert.addMoneyPerSlot(EntityType.AMOUNT, slotNames, payment.getPayment().getPaymentMethodId(), orderItem);
			});
		});
		String saleCntPerSlot = dataConvert.getCntPerSlot(EntityType.SALE);
		String motorErrorCntPerSlot = dataConvert.getCntPerSlot(EntityType.MOTOR);
		String jamCntPerSlot = dataConvert.getCntPerSlot(EntityType.JAM);
		String amountPerSlot = dataConvert.getWhatPerSlot(EntityType.AMOUNT);
		
		dailySale.setSaleCntPerSlot(saleCntPerSlot);
		dailySale.setMotorErrorCntPerSlot(motorErrorCntPerSlot);
		dailySale.setJamCntPerSlot(jamCntPerSlot);
		dailySale.setAmountPerSlot(amountPerSlot);
		
		// totalRealAccount
		dailySale.calcTotalRealAccount();

		// totalCnt 결재시도 건수
		dailySale.setTotalCnt(dto.getPayments().size());
	}
	
	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void slotUpdate(SlotUpdateRequestDto slotUpdateRequestDto) {
		
		System.out.println("getMerchantName : " + slotUpdateRequestDto.getMerchantName());
		System.out.println("getDate : " + slotUpdateRequestDto.getDate());
	
		////////////////////////////////////
		//  0. VendingMachineRepository
		String merchantName = slotUpdateRequestDto.getMerchantName();
		VendingMachine vendingMachine = vendingMachineRepository.findByMerchantName(merchantName)
				.orElseThrow(()->{
				return new IllegalArgumentException("해당 자판기 정보가 없습니다.");
			});
		
		// 1. EventLog
		EventLog eventLog = new EventLog();
		eventLog.setEventType(EventType.SLOTUPDATE);
		eventLog.setVendingMachine(vendingMachine);
		eventLog.setLocalDateTime(slotUpdateRequestDto.getDate());
		eventRepository.save(eventLog);
		

		slotUpdateRequestDto.getProductToSlots().forEach(productToSlot ->{
			//2. Product
			System.out.println("productToSlot : " + productToSlot.toString());
			
			Product product = productToSlot.getProduct();
			Product storedProduct = productRepository.findByProductName(product.getProductName());
			if (storedProduct == null) {
				storedProduct = productRepository.save(product);
			}
			else {
				// set dirty : 해당 함수로 종료 시(Service가 종료될 때) 트랜잭션이 종료된다. 이때 더티체킹이 -> 자동 업데이트가 되어 DB에 Flush 진행됨.
				storedProduct.setUnitPrice(product.getUnitPrice());
				storedProduct.setUnitsInStock(product.getUnitsInStock());
			}
			
			
			int slotId = productToSlot.getSlot().getSlotId();
			Slot slot = productToSlot.getSlot();
			Slot storedSlot = slotRepository.findByVendingMachineIdAndSlotId(merchantName, slotId);
			if (storedSlot == null) {
				slot.setSlotId(slotId);
				slot.setVendingMachine(vendingMachine);
				slotRepository.save(slot);
			}
			else {
				// set dirty : 해당 함수로 종료 시(Service가 종료될 때) 트랜잭션이 종료된다. 이때 더티체킹이 -> 자동 업데이트가 되어 DB에 Flush 진행됨.
				storedSlot.setProduct(storedProduct);
			}
		});
	
	}
	
}
