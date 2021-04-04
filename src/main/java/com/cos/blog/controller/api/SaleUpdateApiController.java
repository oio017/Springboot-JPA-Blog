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
import com.cos.blog.dto.SlotUpdateRequestDto;
import com.cos.blog.model.Product;
import com.cos.blog.model.Slot;
import com.cos.blog.service.VendingStatusService;

@RestController
public class SaleUpdateApiController {

	@Autowired
	private VendingStatusService vendingStatusService;

	@PostMapping("/api/dailySale/save")
	public ResponseDto<Integer> dailySaleSave(@RequestBody DailySaleSaveRequestDto dailySaleSaveRequestDto,
			@AuthenticationPrincipal PrincipalDetail principalDetail) {

		System.out.println("getMerchantName : " + dailySaleSaveRequestDto.getMerchantName());
		System.out.println("getDate : " + dailySaleSaveRequestDto.getDate());
		vendingStatusService.dailySaleSave(dailySaleSaveRequestDto);

		return new ResponseDto<Integer>(HttpStatus.OK.value(), 1);
	}
	
	@PostMapping("/api/slot/update")
	public ResponseDto<Integer> slotUpdate(@RequestBody SlotUpdateRequestDto slotUpdateRequestDto,
			@AuthenticationPrincipal PrincipalDetail principalDetail) {

		System.out.println("getMerchantName : " + slotUpdateRequestDto.getMerchantName());
		System.out.println("getDate : " + slotUpdateRequestDto.getDate());
		vendingStatusService.slotUpdate(slotUpdateRequestDto);

		return new ResponseDto<Integer>(HttpStatus.OK.value(), 1);
	}
	

}
