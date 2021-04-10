package com.cos.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.cos.blog.service.BoardService;

@Controller
public class BoardController {

	// 컨트롤로에서 보안 세션을 어떻게 찾나? 방법2
	//	@Autowired
	//	private PrincipalDetail principal;
	
	@Autowired
	private BoardService boardService;
	
	@GetMapping({"", "/"})
	//public String index(@AuthenticationPrincipal PrincipalDetail principal) {
	// 컨트롤로에서 보안 세션을 어떻게 찾나? 방법1
	// System.out.println("로그인 아이디 : " + principal.getUsername());
	// index로 이동 시 데이타를 가지고 이동 -> Model (ViewResolver 작동) 정보는 request 정보처럼 index 까지 전달됨.
	public String index(Model model, @PageableDefault(size=10, sort="id", direction=Sort.Direction.DESC) Pageable pageable) { 
		model.addAttribute("boards", boardService.글목록(pageable)); // Collection Data
		System.out.println("jerry : index");
		// /WEB-INF/views/index.jsp
		return "index";
	}
	
	//USER 권한 필요
	@GetMapping("/board/saveForm")
	public String saveForm() {
		return "board/saveForm";
	}

	@GetMapping("/board/{id}")
	public String findById(@PathVariable int id, Model model){
		model.addAttribute("board",  boardService.글상세보기(id));
		
		return "board/detail";
	}
	
	@GetMapping("/board/{id}/updateForm")
	// Model : 해당 데이타를 가지고 View까지 이동.
	public String updateForm(@PathVariable int id, Model model){
		model.addAttribute("board",  boardService.글상세보기(id));
		return "board/updateForm";
	}
	
}