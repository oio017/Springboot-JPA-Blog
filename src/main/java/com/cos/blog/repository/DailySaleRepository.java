package com.cos.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.DailySale;

@Repository
public interface DailySaleRepository extends JpaRepository<DailySale, Integer>{

}
