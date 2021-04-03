package com.cos.blog.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cos.blog.dto.CustomSaleStatusDto;
import com.cos.blog.dto.SearchParams;
import com.cos.blog.model.Board;
import com.cos.blog.model.DailySale;
import com.cos.blog.model.OrderItem;
import com.cos.blog.model.Payment;
import com.cos.blog.model.Product;
import com.cos.blog.model.Slot;
import com.cos.blog.model.VendingMachine;
import com.cos.blog.service.CsvService;
import com.cos.blog.service.ProductService;
import com.cos.blog.service.SlotService;
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
	private ProductService productService;
	
	@Autowired
	private SlotService slotService;
	
	@Autowired
	private DataConvert dataConvert;
	

	
//	@GetMapping({"/sale/search"})
//	public String search() {
//		
//	}
	
    
@GetMapping({"/sale/saleList"})
//@RequestMapping({"/sale/saleList"})
	//public String index(@RequestBody CustomSaleStatusDto test, Model model)  {
public String index(@ModelAttribute CustomSaleStatusDto test, Model model)  {
		SearchParams params = new SearchParams();
		VendingMachine vendingMachine =  vendingMachineService.findByMerchantName("CVVN100020");		
		System.out.println("vendingMachine: " + vendingMachine.getMerchantName());
		//DailySale dailySale = vendingStatusService.findByVendingMachineIdAndDate(vendingMachine.getId(), "2021-03-11T11:50:55");
		DailySale dailySale = null;
		if (test.getStartDate() == null) {
			dailySale = vendingStatusService.findByTheRecentDailySale();
		}
		else {
			dailySale = vendingStatusService.findByVendingMachineIdAndDate(vendingMachine.getId(), "2021-03-26");
			
			System.out.println("test : " + test.toString());
			
			System.out.println("getVendingMachine : " + test.getVendingMachine());
			params.setVendingMachine(test.getVendingMachine());
			System.out.println("getEndDate : " + test.getEndDate());
			params.setEndDateLong(test.getEndDate().getTime());
			System.out.println("getTime : " + test.getEndDate().getTime());
			params.setStartDateLong(test.getStartDate().getTime());
			System.out.println("getEndDate : " + test.getEndDate());
			params.setEndDate(test.getEndDate());
			params.setStartDate(test.getStartDate());
		}
		model.addAttribute("result", params);
		
		
		System.out.println("getStartDate : " + test.getStartDate());
		System.out.println("getEndData : " + test.getEndDate());
		System.out.println("getVendingMachine : " + test.getVendingMachine());
		
	
		List<Payment> payments= dailySale.getPayments();
		System.out.println("payments : " + payments.get(0).getId());
		
//		payments.forEach(payment -> {
//			List<OrderItem> orderItems =  payment.getOrderItems();
//			
//			orderItems.forEach(orderItem -> {
//				System.out.println("orderItem : " + orderItem.getId());
//			});
//		});
		
		List<Slot> slots = slotService.findByVendingMachineId(vendingMachine.getId());
//		slots.forEach(slot -> {
//			System.out.println("getSlotId : " + slot.getSlotId());
//			System.out.println("ProductName : " + slot.getProduct().getProductName());
//		});
		
		model.addAttribute("slots",  slots);
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
