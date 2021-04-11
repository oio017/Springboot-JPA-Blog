package com.cos.blog.dto;

import lombok.Data;
import java.util.Date;
@Data
public class SearchParams {
		private String vendingMachine;
		private String startDateString;
		private String endDateString;
		private Date	startDate;
		private Long	startDateLong;
		private Date	endDate;
		private Long	endDateLong;
}
