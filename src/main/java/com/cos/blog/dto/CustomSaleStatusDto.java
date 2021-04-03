package com.cos.blog.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

//@Getter
//@Setter
//@ToString
//@Builder
//@AllArgsConstructor
@Data
public class CustomSaleStatusDto {
    private String vendingMachine;
	private Date startDate;
	private Date endDate;
//    private String stringStartDate;
//    private String stringEndDate;
}