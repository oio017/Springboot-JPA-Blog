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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

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
public class DailySale {
	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name="vendingMachineId")
	private VendingMachine vendingMachine;
	
	// date : 20210301
	@Column(nullable=false, length=20)
	private String date;

	@JsonIgnoreProperties({"dailySale"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@OneToMany(mappedBy = "dailySale", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
	@OrderBy("id desc")
	private List<Payment> payments;
	
	// saleCntPerSlot = [100, 54, …..] 	# 슬롯당 판매수량
	@Column(length=500)
	private String saleCntPerSlot ;
	
	// jamCntPerSlot = [1, 0, 0, 0 ….]	# 슬롯당 걸림발생 횟수
	@Column(length=500)
	private String jamCntPerSlot ;
	
	// MotorErrorCntPerSlot = [1, 0, 0, 0 ….]	# 슬롯당 모터 오류 발생 횟수
	@Column(length=500)
	private String motorErrorCntPerSlot ;
	
	// totalAccount : 100000
	private int totalAccount;
	
	// totalRealAccount : 90000
	private int totalRealAccount;
	
	// totalRefudAccount : 233
	private int totalRefudAccount;
	
	// totalCnt : 100				# 결재시도 건수
	private int totalCnt;
	
	// totalSuccessCnt : 95			# 결재 성공 건수
	private int totalSuccessCnt;
	
	// totalRefudCnt : 5			# 환불 성공 건수
	private int totalRefudCnt;
	
	// totalFailCnt : 0			# 환불 실패 건수
	private int totalFailCnt;

	@CreationTimestamp
	private Timestamp createDate;

}
