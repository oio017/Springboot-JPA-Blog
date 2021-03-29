package com.cos.blog.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
public class CustomSaleStatusDto {
//    private Date startDate;
//    private Date endData;
    private String startDate;
    private String endData;
    private String vendingMachine;
}
