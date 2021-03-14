package com.cos.blog.dto;

import java.util.List;

import com.cos.blog.model.Payment;
import com.cos.blog.model.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfoDto {
		private List<OrderItem> orderItems;
		private Payment payment;
		
//		private List<OrderItemDto> orderItems;
//		private PaymentDetailDto payment;
}

