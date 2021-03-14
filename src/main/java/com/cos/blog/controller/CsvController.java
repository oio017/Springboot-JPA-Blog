package com.cos.blog.controller;

import java.io.IOException;
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

@Controller
public class CsvController {

	@Autowired
	private CsvService csvService;
	
	@Autowired
	private VendingMachineService vendingMachineService;
	
	@Autowired
	private VendingStatusService vendingStatusService;
	
	

	
	@GetMapping({"/sale/saleList"})
	public String index(Model model) throws IOException {
		
		VendingMachine vendingMachine =  vendingMachineService.findByMerchantName("CVVN100015");		
		System.out.println("vendingMachine: " + vendingMachine.toString());

		DailySale dailySale = vendingStatusService.findByVendingMachineIdAndDate(vendingMachine.getId(), "20210311");
		
		System.out.println("dailySale : " + dailySale.toString());
		
		
		List<Payment> payments= dailySale.getPayments();
		System.out.println("payments : " + payments.toString());
		
		payments.forEach(payment -> {
			System.out.println("payment : " + payment.toString());
			
			List<OrderItem> orderItems =  payment.getOrderItems();
			
			orderItems.forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.toString());
			});
		});
		
		//model.addAttribute("sales",  jsonObject);
		
		// return "sale/saleTest";
		return "hi";
	}
	
//	@GetMapping({"/sale/saleList"})
//	public String index(Model model) throws IOException { 
//		JSONObject jsonObject = csvService.csvFileToJsonObject();
//		model.addAttribute("sales",  jsonObject);
//		
//		return "sale/saleTest";
//	}
	
	
}
