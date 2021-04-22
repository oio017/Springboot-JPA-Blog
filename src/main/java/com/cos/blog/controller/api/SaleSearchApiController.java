package com.cos.blog.controller.api;

import java.io.IOException;
import java.lang.reflect.Array;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.json.simple.JSONArray;
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
    
@GetMapping({"/sale/machineSaleStatus"})
public String machineSaleStatus(@ModelAttribute CustomSaleStatusDto test, Model model)  {
		SearchParams params = new SearchParams();
		VendingMachine vendingMachine =  null;	
		DailySale dailySale = null;
		List<Payment> payments= null;;
		List<VendingMachine> vendingMachines = vendingMachineService.findAll();

		System.out.println("jerry : machineSaleStatus");
		
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
				
		return "sale/machineSaleStatus";
	}

	@SuppressWarnings("unchecked")
	@GetMapping({"/sale/eachMachinSaleStatus"})
	public String eachMachinSaleStatus(@ModelAttribute CustomSaleStatusDto test, Model model)  {
		JSONArray vendingMachineNames = new JSONArray();
		JSONArray cntPayPerMachine = new JSONArray();
		JSONArray cntRefundPerMachine = new JSONArray();
		JSONArray accountRealPerMachine = new JSONArray();
		JSONArray accountPerMachine = new JSONArray();
		JSONArray accountRefundPerMachine = new JSONArray();
		SearchParams params = new SearchParams();
		DailySale dailySale = null;
		String startDate = null;
		String endDate = null;
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		if (test.getStartDate() == null) {			
			dailySale = vendingStatusService.findByTheRecentDailySale();
	        startDate = dailySale.getDate();
	        endDate = dailySale.getDate();
		}
		else {
			startDate = dateFormat.format(test.getStartDate());
	        endDate = dateFormat.format(test.getEndDate());		
	        
	        // TODO
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
		
        params.setStartDateString(startDate);
        params.setEndDateString(endDate);
		model.addAttribute("result", params);
		
		System.out.println("jerry : eachMachinSaleStatus");
		// 모든 자판기에 대한 dailySale 조회 (하루단위)
		List<VendingMachine> vendingMachines = vendingMachineService.findAll();
		System.out.println("eachMachinSaleStatus : ");

		int totalCntPay = 0;
		int totalCntRefund = 0;
		int totalAmountPay = 0;
		int totalAmountRealPay = 0;
		int totalAmountRefund = 0;
		
		int cntVendingMachine = vendingMachines.size();
		for (int i = 0; i < cntVendingMachine; i++) {
			VendingMachine vendingMachine = vendingMachines.get(i); 
			vendingMachineNames.add(vendingMachine.getMerchantName());
			 
			List<DailySale>  dailySales = vendingStatusService.findByTheSelectedDailySales(vendingMachine.getId(), startDate, endDate);
			int cntDailySale = dailySales.size();
			int cntPay = 0;
			int cntRefund = 0;
			int amountPay = 0;
			int amountRealPay = 0;
			int amountRefund = 0;
			for(int x = 0; x < cntDailySale; x++) {
				DailySale ds = dailySales.get(x);
				cntPay += ds.getTotalCnt();
				cntRefund += ds.getTotalRefudCnt();
				amountPay += ds.getTotalAccount();
				amountRealPay += ds.getTotalRealAccount();
				amountRefund += ds.getTotalRefudAccount();
			}
			cntPayPerMachine.add(cntPay);
			cntRefundPerMachine.add(cntRefund);
			accountPerMachine.add(amountPay);
			accountRealPerMachine.add(amountRealPay);
			accountRefundPerMachine.add(amountRefund);
			 
			totalCntPay += cntPay;
			totalCntRefund += cntRefund;
			totalAmountPay += amountPay;
			totalAmountRealPay += amountRealPay;
			totalAmountRefund += amountRefund;
		}
		
		System.out.println("vendingMachineNames : " + vendingMachineNames.toString());
		System.out.println("cntPayPerMachine : " + cntPayPerMachine.toString());
		System.out.println("accountRealPerMachine : " + accountRealPerMachine.toString());
		System.out.println("accountPerMachine : " + accountPerMachine.toString());
		// label 자판기 이름 : [ 1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050 ]
		model.addAttribute("vendingMachineNames",  vendingMachineNames.toString());
		model.addAttribute("cntPayPerMachine",  cntPayPerMachine.toString());
		model.addAttribute("cntRefundPerMachine",  cntRefundPerMachine.toString());
		model.addAttribute("accountRealPerMachine",  accountRealPerMachine.toString());
		model.addAttribute("accountRefundPerMachine",  accountRefundPerMachine.toString());

		DailySale ds = new DailySale();
		ds.setTotalCnt(totalCntPay);
		ds.setTotalRefudCnt(totalCntRefund);
		ds.setTotalAccount(totalAmountPay);
		ds.setTotalRealAccount(totalAmountRealPay);
		ds.setTotalRefudAccount(totalAmountRefund);
		model.addAttribute("dailySale",  ds);
		
		return "sale/eachMachinSaleStatus";
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping({"/sale/periodSaleStatus"})
	public String periodSaleStatus(@ModelAttribute CustomSaleStatusDto test, Model model)  {
		String startDate = null;
		String endDate = null;		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		SearchParams params = new SearchParams();	
		DailySale dailySale = null;
		List<VendingMachine> vendingMachines = new ArrayList<VendingMachine>();

		JSONArray vendingMachineNames = new JSONArray();
		JSONArray period = new JSONArray();
		JSONArray dateName = new JSONArray();
		JSONArray saleAccount = new JSONArray();
		JSONArray saleCnt = new JSONArray();
		JSONArray jammedCnt = new JSONArray();
		JSONArray bgColor = new JSONArray();
		JSONArray bdColor = new JSONArray();
		String[] bg = {"rgba(255, 99, 132, 0.2)","rgba(54, 162, 235, 0.2)","rgba(255, 206, 86, 0.2)","rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"};
		String[] bd = {"rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"};

		System.out.println("jerry : periodSaleStatus");
//		chart
//			backgroundColor
//			borderColor
//			amount
//			saleCnt
//			jamCnt


		List<Date> dates = null;
		if (test.getStartDate() == null) {
			// dates 구하기
			Date startDay = new Date ();
			Date endDay = new Date ();
			endDay.setTime ( endDay.getTime ( ) - ( (long) 1000 * 60 * 60 * 24 ) );
			startDay.setTime ( endDay.getTime ( ) - ( (long) 10000 * 60 * 60 * 24 ) );
			startDate = dateFormat.format(startDay);
	        endDate = dateFormat.format(endDay);
	        
			dates = getDaysBetweenDates(startDay, endDay);
			dates.forEach(d ->{
				System.out.println("date : " + d.getDate());
				System.out.println("date: " + dateFormat.format(d));
				period.add(d.getDate());
				dateName.add(dateFormat.format(d));
			});
			System.out.println("period : " + 	period.toString());
			vendingMachines = vendingMachineService.findAll();
			model.addAttribute("vendingMachineName",  "ALL");
		}
		else {
			System.out.println("test : " + test.toString());
	        startDate = dateFormat.format(test.getStartDate());
	        endDate = dateFormat.format(test.getEndDate());
	        
	        // dates 구하기
			dates = getDaysBetweenDates(test.getStartDate(), test.getEndDate());
			dates.forEach(d ->{
				System.out.println("getDate : " + d.getDate());
				System.out.println("date: " + dateFormat.format(d));
				period.add(d.getDate());
				dateName.add(dateFormat.format(d));
			});
			System.out.println("period : " + 	period.toString());
			
			if (test.getVendingMachine().equals("ALL")) {
				model.addAttribute("vendingMachineName",  "ALL");
				vendingMachines = vendingMachineService.findAll();
			}
			else {
				VendingMachine vm =  vendingMachineService.findByMerchantName(test.getVendingMachine());
		        System.out.println("The selected vendingMachine: " + vm.getMerchantName());
		        vendingMachines.add(vm);
		        
		        model.addAttribute("vendingMachineName",  vm.getMerchantName());
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

		int cntVendingMachine = vendingMachines.size();
		int cntDate = dates.size();
		int totalCntPay = 0;
		int totalCntRefund = 0;
		int totalAmountPay = 0;
		int totalAmountRealPay = 0;
		int totalAmountRefund = 0;
		
		for(int i =0 ; i <  cntDate; i++) {
			int cntPay = 0;
			int cntRefund = 0;
			int amountPay = 0;
			int amountRealPay = 0;
			int amountRefund = 0;
			for (int x = 0; x < cntVendingMachine; x++) {
				VendingMachine vendingMachine = vendingMachines.get(x);

				DailySale  ds = vendingStatusService.findByTheSelectedDailySale(vendingMachine.getId(), (String)dateName.get(i));
				if (ds != null) {
					cntPay += ds.getTotalCnt();
					cntRefund += ds.getTotalRefudCnt();
					amountPay += ds.getTotalAccount();
					amountRealPay += ds.getTotalRealAccount();
					amountRefund += ds.getTotalRefudAccount();
				}
			}			
			
			saleAccount.add(amountRealPay);
			saleCnt.add(cntPay);
			jammedCnt.add(cntRefund);

			totalCntPay += cntPay;
			totalCntRefund += cntRefund;
			totalAmountPay += amountPay;
			totalAmountRealPay += amountRealPay;
			totalAmountRefund += amountRefund;
			
			bgColor.add(bg[i%6]);
			bdColor.add(bd[i%6]);
		}
        //////////////
		DailySale ds = new DailySale();
		ds.setTotalCnt(totalCntPay);
		ds.setTotalRefudCnt(totalCntRefund);
		ds.setTotalAccount(totalAmountPay);
		ds.setTotalRealAccount(totalAmountRealPay);
		ds.setTotalRefudAccount(totalAmountRefund);
		ds.setDate(startDate + "~" + endDate);
		model.addAttribute("dailySale",  ds);
		model.addAttribute("result", params);
		
		model.addAttribute("saleAccount",  saleAccount.toString());
		System.out.println("saleAccount: " + saleAccount.toString());
		model.addAttribute("saleCnt",  saleCnt.toString());
		System.out.println("saleCnt: " + saleCnt.toString());
		model.addAttribute("jammedCnt",  jammedCnt.toString());
		System.out.println("jammedCnt: " + jammedCnt.toString());
		model.addAttribute("bgColor",  bgColor.toString());
		System.out.println("bgColor: " + bgColor.toString());
		model.addAttribute("bdColor",  bdColor.toString());
		System.out.println("bdColor: " + bdColor.toString());
		model.addAttribute("period",  period.toString());
		System.out.println("period: " + period.toString());
		
		vendingMachineNames.add("ALL");
		cntVendingMachine = vendingMachines.size();
		if (cntVendingMachine == 1)
			vendingMachines = vendingMachineService.findAll();
		cntVendingMachine = vendingMachines.size();
		for (int x = 0; x < cntVendingMachine; x++) {
			VendingMachine vendingMachine = vendingMachines.get(x);
			vendingMachineNames.add(vendingMachine.getMerchantName());
		}
		model.addAttribute("vendingMachineNames",  vendingMachineNames);
		
		return "sale/periodSaleStatus";
	}
	
	@GetMapping({"/sale/eachProductSaleStatus"})
	public String eachProductSaleStatus(@ModelAttribute CustomSaleStatusDto test, Model model)  {
		
		return "sale/eachProductSaleStatus";
	}
}
