package com.cos.blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{

	//@Query(value="SELECT * FROM Product WHERE vendingMachineId = ?1 order by productId asc", nativeQuery = true)
	List<Product> findByVendingMachineIdOrderByProductIdAsc(int vendingMachineId);
	
	Product findByVendingMachineIdAndProductId(int vendingMachineId, int productId);
	
}
