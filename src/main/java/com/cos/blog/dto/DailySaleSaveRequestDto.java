package com.cos.blog.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailySaleSaveRequestDto {

	private String merchantName;
	private String date;
	private List<PaymentInfoDto> payments;

}

