package com.cos.blog.controller.api;

import javax.servlet.http.HttpSession;

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
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.config.auth.PrincipalDetail;
import com.cos.blog.dto.ReplySaveRequestDto;
import com.cos.blog.dto.ResponseDto;
import com.cos.blog.model.Board;
import com.cos.blog.model.DeviceInfo;
import com.cos.blog.model.Reply;
import com.cos.blog.model.RoleType;
import com.cos.blog.model.User;
import com.cos.blog.service.BoardService;
import com.cos.blog.service.DeviceService;
import com.cos.blog.service.UserService;

@RestController
public class DeviceApiController {
	
	@Autowired
	private DeviceService deviceService;
		
	@PostMapping("/api/deviceRegister")
	public ResponseDto<Integer> save(@RequestBody DeviceInfo deviceInfo, @AuthenticationPrincipal PrincipalDetail principalDetail) {
		
		System.out.println("principalDetail : " + principalDetail);
		
		deviceService.save(deviceInfo);
		return new ResponseDto<Integer>(HttpStatus.OK.value(),1);
	}
	
}
