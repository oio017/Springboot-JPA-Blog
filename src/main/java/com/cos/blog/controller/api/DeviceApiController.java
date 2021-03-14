package com.cos.blog.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.dto.ResponseDto;
import com.cos.blog.model.DeviceType;
import com.cos.blog.model.VendingMachine;
import com.cos.blog.service.DeviceService;
import com.cos.blog.service.VendingMachineService;

@RestController
public class DeviceApiController {
	
	@Autowired
	private DeviceService deviceService;
	
	@Autowired
	private VendingMachineService vendingMachineService;
		
	@PostMapping("/api/deviceRegister")
	public ResponseDto<Integer> save(@RequestBody DeviceType deviceType, @AuthenticationPrincipal PrincipalDetail principalDetail) {
		System.out.println("principalDetail : " + principalDetail);
		deviceService.save(deviceType);
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
	@PostMapping("/api/vendingMachineRegister/{deviceTypeId}")
	public ResponseDto<Integer> vendingSave(@PathVariable int deviceTypeId, @RequestBody VendingMachine vendingMachine, @AuthenticationPrincipal PrincipalDetail principalDetail) {
		System.out.println("deviceTypeId : " + deviceTypeId);
		System.out.println("vendingMachine : " + vendingMachine.toString());
		
		DeviceType deviceType = deviceService.detail(deviceTypeId);
		vendingMachine.setDeviceType(deviceType);
		vendingMachine.setStatusPerSlot("NULL");
		vendingMachine.setStockPerSlot("NULL");
		vendingMachineService.save(vendingMachine);
		
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
	
}
