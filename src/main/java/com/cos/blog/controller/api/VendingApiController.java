package com.cos.blog.controller.api;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.dto.DailySaleSaveRequestDto;
import com.cos.blog.dto.ReplySaveRequestDto;
import com.cos.blog.dto.ResponseDto;
import com.cos.blog.model.Board;
import com.cos.blog.model.DeviceType;
import com.cos.blog.model.Reply;
import com.cos.blog.model.RoleType;
import com.cos.blog.model.User;
import com.cos.blog.service.BoardService;
import com.cos.blog.service.DeviceService;
import com.cos.blog.service.UserService;
import com.cos.blog.service.VendingStatusService;

@RestController
public class VendingApiController {
	
	@Autowired
	private VendingStatusService vendingStatusService;
		

	@PostMapping("/api/dailySale/save")
	public ResponseDto<Integer> dailySaleSave(@RequestBody DailySaleSaveRequestDto dailySaleSaveRequestDto, @AuthenticationPrincipal PrincipalDetail principalDetail) {
		
		System.out.println("getMerchantName : " + dailySaleSaveRequestDto.getMerchantName());
		System.out.println("getDate : " + dailySaleSaveRequestDto.getDate());
		
		dailySaleSaveRequestDto.getPayments().forEach(payment ->{
			System.out.println("paymentInfo : " + payment.toString());
			
			payment.getOrderItems().forEach(orderItem -> {
				System.out.println("orderItem : " + orderItem.toString());
			});
		});
		
		vendingStatusService.dailySaleSave(dailySaleSaveRequestDto);
		
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
}
