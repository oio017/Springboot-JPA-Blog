package com.cos.blog.dto;

import com.cos.blog.model.Product;
import com.cos.blog.model.Slot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductToSlotDto {
		private Product product;
		private Slot slot;
}

