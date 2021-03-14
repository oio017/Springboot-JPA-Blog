package com.cos.blog.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfo {
		private List<OrderItem> orderItems;
		private PaymentDetail payment;
}

