package com.cos.blog.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.model.Product;
import com.cos.blog.repository.ProductRepository;

/* 서비스에 대한 설명
 *		1. 트랜잭션 관리
 * 		2. 서비스 의미 : 관련 DB(CRUD) 모든 행위 일체 하나의 트랜젹션으로 처리하는 것
 * */

@Service // springboot가 컴포넌트 스캔하여 Bean에 등록을 해줌 -> IoC (메모리에 로딩을 대신 해줌)
public class ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	@Transactional(readOnly = true)
	public List<Product> findByVendingMachineId(int vendingMachineId) {
		return productRepository.findByVendingMachineIdOrderByProductIdAsc(vendingMachineId);
	}
	
	
}
