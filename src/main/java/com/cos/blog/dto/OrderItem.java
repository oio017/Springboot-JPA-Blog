package com.cos.blog.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
	private int discount;
	private int dispensingFailItems;
	private int dispensingOkItems;
	private int dispensingStatus;
	private long orderId;
	private int productId;
	private int quantity;
	private int slotId;
	private int unitPrice;
}
