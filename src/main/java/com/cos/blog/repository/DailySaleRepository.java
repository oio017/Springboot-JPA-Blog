package com.cos.blog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.DailySale;
import com.cos.blog.model.User;
import com.cos.blog.model.VendingMachine;

@Repository
public interface DailySaleRepository extends JpaRepository<DailySale, Integer>{

//	@Query(value="SELECT * FROM DailySale WHERE id = ?1 AND date = ?2", nativeQuery = true)
//	Optional<DailySale> findByMerchantNameDate(int id, String date);
	Optional<DailySale> findByVendingMachineIdAndDate(int id, String date);
	
	
	@Query(value="SELECT * FROM DailySale ORDER BY date DESC LIMIT 1", nativeQuery = true)
	Optional<DailySale> findByTheRecentDailySale();

}
