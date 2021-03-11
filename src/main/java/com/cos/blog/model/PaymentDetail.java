package com.cos.blog.model;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PaymentDetail {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name="deviceListId")  // dailySaleInfo가 무조건 있는 조건이면 해당 컬럼 삭제할것.
	private VendingMachine deviceList;
	
	@ManyToOne
	@JoinColumn(name="dailySaleInfoId")  // dailySaleInf을 통하여 당일 판매현황 및 DeviceListId를 참조할 수 있
	private DailySaleInfo dailySaleInfo;
		
	// date : "2021/02/17 7:48"
	@Column(nullable=false, length=20)
	private String date;
	
	@Column(nullable=false, length=20)
	private String transactionId;

	@Column(nullable=false, length=20)
	private String orderId;

	@Column(nullable=false, length=20)
	private String payMethod;

	// @ColumnDefault("1")
	private int totalAmount;
	
	// @ColumnDefault("1")
	private int successAmount;
	
	// @ColumnDefault("1")
	private int refundAmount;

	// 1(refund Success), 0(fail)
	@ColumnDefault("1")
	private int refundStatus;

	@Column(nullable=false, length=200)
	private String refundDesc;

	// 해당 결재에서 선택된 slot정보 [2, 2, 4, 5]
	@Column(nullable=false, length=500)
	private String saleSlots;

	// 해당 결재에서 jam 발생된 slot 정보 [2, 2, 4, 5]
	@Column(nullable=false, length=500)
	private String jamSlots;

	// s해당 결재에서 motor관련 에러가 발생된 slot 정보 [2, 2, 4, 5]
	@Column(nullable=false, length=500)
	private String errorSlots;
	
	@CreationTimestamp
	private Timestamp createDate;

}
