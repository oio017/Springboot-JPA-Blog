package com.cos.blog.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.dto.DailySaleSaveRequestDto;
import com.cos.blog.dto.SlotUpdateRequestDto;
import com.cos.blog.model.DailySale;
import com.cos.blog.model.EventLog;
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

import type.EventType;



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
	
	@Transactional(readOnly = true)
	public DailySale findByTheRecentDailySale() {
		return dailySaleRepository.findByTheRecentDailySale()
				.orElseThrow(()->{
					return new IllegalArgumentException("등록된 판매정보가 없습니다.");
				});
	}
	
	@Transactional(readOnly = true)
	public List<DailySale> findByTheSelectedDailySales(int vendingMachine, String startDate, String endDate) {
		return dailySaleRepository.findByTheSelectedDailySales(vendingMachine, startDate, endDate);
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
		//DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		dailySale.setDate(dailySaleSaveRequestDto.getDate().substring(0, 10));
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
			Payment paymentDetail = payment.getPayment();
			System.out.println("paymentDetails.id : " + paymentDetail.getId());

			// 실제 viettelPay 일 경우만 금액 합산
			if (paymentDetail.getPaymentMethodId() == 1) {
				// totalAccount 결재시도 금액
				dailySale.addTotalAccount(paymentDetail.getAmount());
				
				// totalRefudAccount
				dailySale.addTotalRefudAccount(paymentDetail.getRefund());
				
				// totalRefudCnt/totalFailCnt 환불 성공 건수
				if (paymentDetail.getRefund() > 0) {
					if (paymentDetail.isRefundResult())
						dailySale.increaseTotalRefudCnt();
					if (!paymentDetail.isRefundResult())
						dailySale.increaseTotalFailCnt();
				}
			}
	
			payment.getOrderItems().forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.toString());
				// saleCntPerSlot[x,x,x,x,x,x ....] 슬롯당 판매수량				
				dataConvert.addCntPerSlot(EntityType.SALE, slotNames, orderItem.getSlotId(), orderItem.getQuantity());
				
				// motorErrorCntPerSlot 슬롯당 모터 오류 발생 횟수
				dataConvert.addCntPerSlot(EntityType.MOTOR, slotNames, orderItem.getSlotId(), orderItem.getDispensingFailItems());

				// jamCntPerSlot 슬롯당 걸림발생 횟수
				dataConvert.addCntPerSlot(EntityType.JAM, slotNames, orderItem.getSlotId(), orderItem.getDispensingFailItems());
				
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
		System.out.println("0");
		eventLog.setLocalDateTime(slotUpdateRequestDto.getDate());
		System.out.println("1");
		eventRepository.save(eventLog);
		System.out.println("2");
		
		slotUpdateRequestDto.getProductToSlots().forEach(productToSlot ->{
			System.out.println("3");
			System.out.println("productToSlot : " + productToSlot.toString());
			//2. Product 
			System.out.println("productToSlot.slotID : " + productToSlot.getSlots().getSlotId());
			
			System.out.println("productToSlot.productName : " + productToSlot.getProduct().getProductName());
			System.out.println("5"); 
			
			Product product = productToSlot.getProduct();
			Product storedProduct = productRepository.findByVendingMachineIdAndProductId(vendingMachine.getId(), product.getProductId());
			if (storedProduct == null) {
				product.setVendingMachine(vendingMachine);
				storedProduct = productRepository.save(product);
				System.out.println("save product");
			}
			else {
				// set dirty : 해당 함수로 종료 시(Service가 종료될 때) 트랜잭션이 종료된다. 이때 더티체킹이 -> 자동 업데이트가 되어 DB에 Flush 진행됨.
				storedProduct.setUnitPrice(product.getUnitPrice());
				storedProduct.setUnitsInStock(product.getUnitsInStock());
				System.out.println("update product");
			}
			
			int slotId = productToSlot.getSlots().getSlotId();
			Slot slot = productToSlot.getSlots();
			Slot storedSlot = slotRepository.findByVendingMachineIdAndSlotId(vendingMachine.getId(), slotId);
			if (storedSlot == null) {
				slot.setProduct(storedProduct);
				slot.setVendingMachine(vendingMachine);
				slotRepository.save(slot);
				System.out.println("save slot");
			}
			else {
				// set dirty : 해당 함수로 종료 시(Service가 종료될 때) 트랜잭션이 종료된다. 이때 더티체킹이 -> 자동 업데이트가 되어 DB에 Flush 진행됨.
				storedSlot.setSlotId(slotId);
				storedSlot.setProduct(storedProduct);
				System.out.println("update slot");
			}
		});
	
	}
	
}
