package com.cos.blog.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotUpdateRequestDto {

	private String merchantName;
	private String date;
	private List<ProductToSlotDto> productToSlots;

}

