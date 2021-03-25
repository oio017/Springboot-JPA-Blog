package com.cos.blog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{

//	@Query(value="SELECT * FROM DailySale WHERE id = ?1 AND date = ?2", nativeQuery = true)
	Product findByProductName(String productName);
	
}
