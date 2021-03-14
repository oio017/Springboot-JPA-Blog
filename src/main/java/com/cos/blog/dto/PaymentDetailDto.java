package com.cos.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetailDto {
	private int amount;
	private long orderId;
	private String paymentDate;
	private String paymentError;
	private int paymentErrorCode;
	private int paymentMethodId;
	private int refund;
	private int refundDesc;
	private int refundItems;
	private boolean refundResult;
	private int salesItems;
	private String transactionId;
}

