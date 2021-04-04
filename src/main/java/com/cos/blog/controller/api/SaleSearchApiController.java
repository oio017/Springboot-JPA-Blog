package com.cos.blog.controller.api;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
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
import com.cos.blog.dto.DailySaleSaveRequestDto;
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
import com.cos.blog.util.DataConvert.EntityType;


@Controller
public class SaleSearchApiController {

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
	

	
	public static List<Date> getDaysBetweenDates(Date startdate, Date enddate)
	{
	    List<Date> dates = new ArrayList<Date>();
	    Calendar calendar = new GregorianCalendar();
	    calendar.setTime(startdate);
	 
	    while (calendar.getTime().before(enddate))
	    {
	        Date result = calendar.getTime();
	        dates.add(result);
	        calendar.add(Calendar.DATE, 1);
	    }
	    return dates;
	}
	
	private void makeSubParamsOfDailySale(DailySale dailySale, DailySale eachDailySale) {
		dailySale.addTotalAccount(eachDailySale.getTotalAccount());
		dailySale.addTotalRealAccount(eachDailySale.getTotalRealAccount());
		dailySale.addTotalRefudAccount(eachDailySale.getTotalRefudAccount());
		
		dailySale.addTotalCnt(eachDailySale.getTotalCnt());
		dailySale.addTotalSuccessCnt(eachDailySale.getTotalSuccessCnt());
		dailySale.addTotalRefudCnt(eachDailySale.getTotalRefudCnt());
		dailySale.addTotalFailCnt(eachDailySale.getTotalFailCnt());
	}
    
@GetMapping({"/sale/saleList"})
public String index(@ModelAttribute CustomSaleStatusDto test, Model model)  {
		SearchParams params = new SearchParams();
		VendingMachine vendingMachine =  null;	
		DailySale dailySale = null;
		List<Payment> payments= null;;
		List<VendingMachine> vendingMachines = vendingMachineService.findAll();
		
		if (test.getStartDate() == null) {
			dailySale = vendingStatusService.findByTheRecentDailySale();
			vendingMachine = dailySale.getVendingMachine();
			payments= dailySale.getPayments();
			System.out.println("The recent vendingMachine: " + vendingMachine.getMerchantName());
		}
		else {
			System.out.println("test : " + test.toString());
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	        String startDate = dateFormat.format(test.getStartDate());
	        String endDate = dateFormat.format(test.getEndDate());
	        System.out.println("startDate : " + startDate);
	        System.out.println("endDate : " + endDate);
	        
	        List<Date> dates = getDaysBetweenDates(test.getStartDate(), test.getEndDate());
	        dates.forEach(date ->{
	        	System.out.println("date: " + dateFormat.format(date));
	        });
	        vendingMachine =  vendingMachineService.findByMerchantName(test.getVendingMachine());
	        System.out.println("The selected vendingMachine: " + vendingMachine.getMerchantName());
	        System.out.println("Query condition : id " + vendingMachine.getId() + ", startDate : " + startDate + ", endDate : " + endDate);
	        List<DailySale>  dailySales = vendingStatusService.findByTheSelectedDailySales(vendingMachine.getId(), startDate, endDate);
	        int dailySale_size = dailySales.size();
	        dailySale = new DailySale();
	        dailySale.setDate(startDate+"~"+endDate);
	        dailySale.setVendingMachine(vendingMachine);
	        
	        System.out.println("dailySales.size() : " + dailySales.size());
	        
	        if (dailySale_size > 0) {
		        dataConvert.init();
		        for(int i = 0; i < dailySale_size; i++) {
		        	DailySale daily = dailySales.get(i);
		        	
		        	//구해진 dailySales을 하나의 dailySale로 계산한다.
		        	makeSubParamsOfDailySale(dailySale, daily);
		        	
					// saleCntPerSlot[x,x,x,x,x,x ....] 슬롯당 판매수량				
					dataConvert.addCntPerSlot(EntityType.SALE, daily);
					
					// motorErrorCntPerSlot 슬롯당 모터 오류 발생 횟수
					dataConvert.addCntPerSlot(EntityType.MOTOR, daily);

					// jamCntPerSlot 슬롯당 걸림발생 횟수
					dataConvert.addCntPerSlot(EntityType.JAM, daily);
					
					// Slot별 결재금액 합산
					dataConvert.addCntPerSlot(EntityType.AMOUNT, daily);
					
			        // 임시로 Stack Overflow 방지하기위하여 80개 까지만 결재정보 담음.
			        payments= dailySales.get(i).getPayments();
			        if (dailySale.getPayments() == null || dailySale.getPayments().size() < 80)
			        	dailySale.addPaymentList(payments);
		        }
		   
				String saleCntPerSlot = dataConvert.getCntPerSlot(EntityType.SALE);
				String motorErrorCntPerSlot = dataConvert.getCntPerSlot(EntityType.MOTOR);
				String jamCntPerSlot = dataConvert.getCntPerSlot(EntityType.JAM);
				String amountPerSlot = dataConvert.getWhatPerSlot(EntityType.AMOUNT);
				
				dailySale.setSaleCntPerSlot(saleCntPerSlot);
				dailySale.setJamCntPerSlot(jamCntPerSlot);
				dailySale.setMotorErrorCntPerSlot(motorErrorCntPerSlot);
				dailySale.setAmountPerSlot(amountPerSlot);
	        }
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
		
		List<Slot> slots = slotService.findByVendingMachineId(vendingMachine.getId());
		model.addAttribute("vendingMachines",  vendingMachines);
		model.addAttribute("slots",  slots);
		model.addAttribute("dailySale",  dailySale);
		model.addAttribute("slotNames", vendingMachine.getDeviceType().getSlotName());
		
		ArrayList<Integer> slotNamesArray = dataConvert.makeRowColumnSlotName1(vendingMachine.getDeviceType().getSlotName());
		model.addAttribute("slotNamesArray",  slotNamesArray);
		model.addAttribute("slotCnt",  vendingMachine.getDeviceType().getTotalslotCnt());
				
		return "sale/saleDateVending";
	}

}