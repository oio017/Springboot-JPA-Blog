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
public class Payment {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name = "dailySaleId") // dailySale을 통하여 당일 판매현황 참조가능
	private DailySale dailySale;

	@ManyToOne
	@JsonIgnoreProperties({"dailySale", "payment", "vendingMachine", "deviceType"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@JoinColumn(name = "vendingMachineId")
	private VendingMachine vendingMachine;

	// @ColumnDefault("1") // 성공 실패에 상관없이 결재 시도된 금액 (실제금액 = amout - refundAmount &&
	// refundResult == true)
	private int amount;

	@ColumnDefault("0")
	private long orderId;

	// date : "2021/02/17 7:48" "Mar 11, 2021 09:17:45"
	@Column(nullable = false, length = 50)
	private String paymentDate;

	@ColumnDefault("0") // 결재 실패에 대한 원인과 슬롯 정보
	// "Refund - Because a jam occurred, the refund was processed. [code: 09, cause:
	// Jammed, slots: [23]]"
	private String paymentError;

	@ColumnDefault("0")
	private int paymentErrorCode;

	@ColumnDefault("1") // 1 : ViettelPay
	private int paymentMethodId;

	@ColumnDefault("0")
	private int refund;

	@Column(nullable = false, length = 200) // 환불 실패 시 관련 내용
	private String refundDesc;

	// 1(refund Success), 0(fail)
	@Column(name = "refundResult", columnDefinition = "boolean default true")
	private boolean refundResult;

	@ColumnDefault("0") // 환불된 제품 수량
	private int refundItems;

	@ColumnDefault("0") // 판매된 제품 수량
	private int salesItems;

	@Column(nullable = false, length = 20)
	private String transactionId;
	
	@JsonIgnoreProperties({ "payment" }) // 무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@OneToMany(mappedBy = "payment", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.REMOVE })
	@OrderBy("id desc")
	private List<OrderItem> orderItems;

	@CreationTimestamp
	private Timestamp createDate;

}
