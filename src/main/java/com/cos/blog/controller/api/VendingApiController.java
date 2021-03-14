package com.cos.blog.controller.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.dto.DailySaleSaveRequestDto;
import com.cos.blog.dto.ResponseDto;
import com.cos.blog.service.VendingStatusService;

@RestController
public class VendingApiController {
	
	@Autowired
	private VendingStatusService vendingStatusService;
		

	@PostMapping("/api/dailySale/save")
	public ResponseDto<Integer> dailySaleSave(@RequestBody DailySaleSaveRequestDto dailySaleSaveRequestDto, @AuthenticationPrincipal PrincipalDetail principalDetail) {
		
		System.out.println("getMerchantName : " + dailySaleSaveRequestDto.getMerchantName());
		System.out.println("getDate : " + dailySaleSaveRequestDto.getDate());
		dailySaleSaveRequestDto.getPayments().forEach(payment ->{
			System.out.println("paymentInfo : " + payment.toString());
			
			payment.getOrderItems().forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.toString());
			});
		});
		
		vendingStatusService.dailySaleSave(dailySaleSaveRequestDto);
		
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
}
