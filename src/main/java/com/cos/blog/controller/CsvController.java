package com.cos.blog.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.cos.blog.model.DailySale;
import com.cos.blog.model.OrderItem;
import com.cos.blog.model.Payment;
import com.cos.blog.model.VendingMachine;
import com.cos.blog.service.CsvService;
import com.cos.blog.service.VendingMachineService;
import com.cos.blog.service.VendingStatusService;
import com.cos.blog.util.DataConvert;

@Controller
public class CsvController {

	@Autowired
	private CsvService csvService;
	
	@Autowired
	private VendingMachineService vendingMachineService;
	
	@Autowired
	private VendingStatusService vendingStatusService;
	
	@Autowired
	private DataConvert dataConvert;

	
	@GetMapping({"/sale/saleList"})
	public String index(Model model) throws IOException {
		
		VendingMachine vendingMachine =  vendingMachineService.findByMerchantName("CVVN100020");		
		System.out.println("vendingMachine: " + vendingMachine.getMerchantName());
		//DailySale dailySale = vendingStatusService.findByVendingMachineIdAndDate(vendingMachine.getId(), "2021-03-11T11:50:55");
		DailySale dailySale = vendingStatusService.findByVendingMachineIdAndDate(vendingMachine.getId(), "2021-03-24T11:50:55");

	
		List<Payment> payments= dailySale.getPayments();
		System.out.println("payments : " + payments.get(0).getId());
		
		payments.forEach(payment -> {
			List<OrderItem> orderItems =  payment.getOrderItems();
			
			orderItems.forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.getId());
			});
		});
		
		model.addAttribute("dailySale",  dailySale);
		model.addAttribute("slotNames", vendingMachine.getDeviceType().getSlotName());
		
		ArrayList<Integer> slotNamesArray = dataConvert.makeRowColumnSlotName1(vendingMachine.getDeviceType().getSlotName());
		model.addAttribute("slotNamesArray",  slotNamesArray);
		
		model.addAttribute("slotCnt",  vendingMachine.getDeviceType().getTotalslotCnt());
		
		System.out.println("Date : " + dailySale.getDate());
		System.out.println("getMerchantName : " + dailySale.getVendingMachine().getMerchantName());
		System.out.println("getOrderId : " + dailySale.getPayments().get(0).getOrderId());
		System.out.println("getUnitPrice : " + dailySale.getPayments().get(0).getOrderItems().get(0).getUnitPrice());
		
		return "sale/saleTest";

	}
	
//	@GetMapping({"/sale/saleList"})
//	public String index(Model model) throws IOException { 
//		JSONObject jsonObject = csvService.csvFileToJsonObject();
//		model.addAttribute("sales",  jsonObject);
//		
//		return "sale/saleTest";
//	}
	
	
}
