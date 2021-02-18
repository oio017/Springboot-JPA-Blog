package com.cos.blog.test;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//응답 : Data  (비교 : @Controller  경우 응답 : HTML)
@RestController
public class HttpControllerTest {

	@GetMapping("/http/get")
	public String getTest(Member m) {
		return "@GetMapping";
	}
	
	@PostMapping("/http/post")
	public String postTest(@RequestBody Member m) {
		return "@PostMapping";
	}
	
	@PutMapping("/http/put")
	public String putTest() {
		return "@PutMapping";
	}
	
	@DeleteMapping("/http/delete")
	public String deleteTest() {
		return "@DeleteMapping";
	}
	
}
