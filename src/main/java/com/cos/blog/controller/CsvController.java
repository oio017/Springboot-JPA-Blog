package com.cos.blog.controller;

import java.io.IOException;

import org.json.simple.JSONObject;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.cos.blog.service.CsvService;

@Controller
public class CsvController {

	@Autowired
	private CsvService csvService;
	
	@GetMapping({"/sale/saleList"})
	//public String index(@AuthenticationPrincipal PrincipalDetail principal) {
	// 컨트롤로에서 보안 세션을 어떻게 찾나? 방법1
	// System.out.println("로그인 아이디 : " + principal.getUsername());
	// index로 이동 시 데이타를 가지고 이동 -> Model (ViewResolver 작동) 정보는 request 정보처럼 index 까지 전달됨.
	public String index(Model model) throws IOException { 
		JSONObject jsonObject = csvService.csvFileToJsonObject();
		model.addAttribute("sales",  jsonObject);
		
		return "sale/saleTest";
	}
	
}
