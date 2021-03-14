package com.cos.blog.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetail {
	private int amount;
	private long orderId;
	private String paymentDate;
	private int paymentErrorCode;
	private int paymentMethodId;
	private int refund;
	private int refundDesc;
	private int refundItems;
	private boolean refundResult;
	private int salesItems;
	private String transactionId;
}

