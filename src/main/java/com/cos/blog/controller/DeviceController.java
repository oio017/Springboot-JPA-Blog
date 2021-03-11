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

	
		// deviceInfo
		@GetMapping("/deviceInfo/register")
		public String register() {
			return "deviceInfo/registerForm";
		}
		
		@GetMapping("/deviceInfo/list")
		public String machineList(Model model, @PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
			model.addAttribute("deviceInfos", devcieService.deviceInfoList(pageable)); // Collection Data
			
			return "deviceInfo/deviceInfoList";
		}
		
		@GetMapping("/deviceInfo/{id}")
		public String findById(@PathVariable int id, Model model){
			model.addAttribute("deviceInfo",  devcieService.detail(id));
			
			return "deviceInfo/deviceInfoDetail";
		}
		
		//vending Machine
		@GetMapping("/deviceInfo/machineRegister")
		public String vendingMachineRegister(Model model) {
			model.addAttribute("deviceInfos",  deviceRepository.findAll());
			return "deviceInfo/machineRegisterForm";
		}
		
		@GetMapping("/deviceInfo/machineList")
		public String vendingMachineList(Model model, @PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
			model.addAttribute("vendingMachines", vendingMachineService.vendingMachineList(pageable)); // Collection Data
			
			return "deviceInfo/machineList";
		}
		
		@GetMapping("/deviceInfo/machine/{id}")
		public String findMachineById(@PathVariable int id, Model model){
			model.addAttribute("vendingMachine",  vendingMachineService.detail(id));
			
			return "deviceInfo/machineDetail";
		}
		
		
}
