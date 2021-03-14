package com.cos.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.repository.DeviceRepository;
import com.cos.blog.service.DeviceService;
import com.cos.blog.service.VendingMachineService;
 
@Controller
public class DeviceController {

	@Autowired
	private DeviceService devcieService;
	
	@Autowired
	private DeviceRepository deviceRepository;
	
	@Autowired
	private VendingMachineService vendingMachineService;

	
		// deviceType
		@GetMapping("/deviceType/register")
		public String register() {
			return "device/registerForm";
		}
		
		@GetMapping("/deviceType/list")
		public String machineList(Model model, @PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
			model.addAttribute("deviceTypes", devcieService.deviceTypeList(pageable)); // Collection Data
			
			return "device/deviceTypeList";
		}
		
		@GetMapping("/deviceType/{id}")
		public String findById(@PathVariable int id, Model model){
			model.addAttribute("deviceType",  devcieService.detail(id));
		
			return "device/deviceTypeDetail";
		}
		
		//vending Machine
		@GetMapping("/deviceType/machineRegister")
		public String vendingMachineRegister(Model model) {
			model.addAttribute("deviceTypes",  deviceRepository.findAll());
			return "device/machineRegisterForm";
		}
		
		@GetMapping("/deviceType/machineList")
		public String vendingMachineList(Model model, @PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
			model.addAttribute("vendingMachines", vendingMachineService.vendingMachineList(pageable)); // Collection Data
			
			return "device/machineList";
		}
		
		@GetMapping("/deviceType/machine/{id}")
		public String findMachineById(@PathVariable int id, Model model){
			model.addAttribute("vendingMachine",  vendingMachineService.detail(id));
			
			return "device/machineDetail";
		}
		
		
}
