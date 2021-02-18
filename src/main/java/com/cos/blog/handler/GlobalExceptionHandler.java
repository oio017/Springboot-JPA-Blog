package com.cos.blog.handler;

import javax.persistence.PersistenceException;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import com.cos.blog.dto.ResponseDto;

@ControllerAdvice // 전역에서 예외 발생 시 수신
@RestController	
public class GlobalExceptionHandler {

//	@ExceptionHandler(value=IllegalArgumentException.class) // 해당 예외 타입만 수신
//	public String handleArgumentException(IllegalArgumentException e) {
//		
//		return "<h1>" + e.getMessage() + "</h1>";
//	}
//	
//	@ExceptionHandler(value=EmptyResultDataAccessException.class) //해당 예외 타입만 수신
//	public String handleArgumentException(EmptyResultDataAccessException e) {
//		
//		return "<h1>" + e.getMessage() + "</h1>";
//	}
	
	
	@ExceptionHandler(value=ConstraintViolationException.class) //해당 예외 타입만 수신
	public String handleArgumentException(ConstraintViolationException e) {
		
		System.out.println("PersistenceException : " + e.getMessage());
		
		return "<h1>" + e.getMessage() + "</h1>";
	}
	

	@ExceptionHandler(value=Exception.class) // 최상위 부모 Exception으로 설정 시 모든 예외 수신
	public ResponseDto<String> handleArgumentException(Exception e) {
		
		System.out.println("handleArgumentException : " + e.getMessage());
		
		return new ResponseDto<String>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()); // Error Code : 500
	}
	
}
