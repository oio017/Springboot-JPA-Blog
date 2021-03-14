package com.cos.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cos.blog.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer>{

}
