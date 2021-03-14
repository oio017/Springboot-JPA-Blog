package com.cos.blog.controller;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.model.VendingMachine;
import com.cos.blog.repository.DeviceRepository;
import com.cos.blog.service.DeviceService;
import com.cos.blog.service.VendingMachineService;
 
@Controller
public class DeviceController {

	@Autowired
	private DeviceService devcieService;
		
	@Autowired
	private VendingMachineService vendingMachineService;

	
		// deviceType
		@GetMapping("/deviceType/register")
		public String register() {
			System.out.println("dfdfwefefewfwef");
			
			return "device/typeRegister";
		}
		
		@GetMapping("/deviceType/list")
		public String deviceTypeList(Model model, @PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
			model.addAttribute("deviceTypes", devcieService.deviceTypeList(pageable)); // Collection Data
			
			return "device/deviceTypeList";
		}
		
		@GetMapping("/deviceType/{id}")
		public String deviceTypeFindById(@PathVariable int id, Model model){
			model.addAttribute("deviceType",  devcieService.detail(id));
		
			return "device/deviceTypeDetail";
		}
		
		//vending Machine
		@GetMapping("/vendingMachine/register")
		public String vendingMachineRegister(Model model) {
			model.addAttribute("deviceTypes",  devcieService.findAllDeviceType());
			return "device/machineRegisterForm";
		}
		
		@GetMapping("/vendingMachine/list")
		public String vendingMachineList(Model model, @PageableDefault(size=2, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
			model.addAttribute("vendingMachines", vendingMachineService.vendingMachineList(pageable)); // Collection Data
			
			return "device/machineList";
		}
		
		@GetMapping("/vendingMachine/{id}")
		public String vendingMachineFindById(@PathVariable int id, Model model){
			VendingMachine vendingMachine = vendingMachineService.detail(id);
			String slotName = vendingMachine.getDeviceType().getSlotName();
			
			System.out.println("slotName : " + slotName);
			JSONParser parser = new JSONParser();
			JSONArray jsonArray = null;
			try {
				jsonArray = (JSONArray)parser.parse(slotName);
			} catch (ParseException e) {
				e.printStackTrace();
			}			
			System.out.println("jsonArray : " + jsonArray);
			model.addAttribute("vendingMachine",  vendingMachine);
			
			ArrayList<ArrayList<Integer>> arrayList = new ArrayList<ArrayList<Integer>>();
			int cnt = 0;
			int totalCnt = 0;
			for(int row = 0; row < 6; row++) {
				arrayList.add(new ArrayList<Integer>());
				if (row < 2)
					cnt = 5;
				else
					cnt = 10;
				for(int col = 0; col < cnt; col++) {
					int value = Integer.parseInt(String.valueOf(jsonArray.get(totalCnt++)));
					arrayList.get(row).add((Integer)value);
				}
			}
			
			System.out.println("arrayList : " + arrayList.toString());
				
			model.addAttribute("slotArrayList",  arrayList);
		
			return "device/machineDetail";
		}
		
}
