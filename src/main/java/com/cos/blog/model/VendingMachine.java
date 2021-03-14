package com.cos.blog.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
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
public class VendingMachine {
	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(nullable=false, length=50)
	private String merchantName ;
	
	@ManyToOne
	@JoinColumn(name="deviceId")
	private DeviceType deviceType;
	
	@Column(nullable=false, length=50)
	private String merchantCode ;
	
	@Column(nullable=false, length=50)
	private String ip ;
	
	// @ColumnDefault("12345")
	private int port;
	
	@Column(nullable=false, length=300)
	private String accessCode  ;
	
	@Column(nullable=false, length=300)
	private String hashKey ;
	
	@Column(nullable=false, length=50)
	private String consoleAccount ;
	
	@Column(nullable=false, length=50)
	private String consolePassword ;
		
	@Enumerated(EnumType.STRING) // ENABLE, DISABLE
	private StatusType internet;
	
	@Enumerated(EnumType.STRING) // STOP, RUNNING, BROKEN
	private StatusType status; 
	
	@Column(nullable=false, length=300)
	private String location ;
		
	// 슬롯별 현상태 : 0(정상), 1(jam), 2(moter 고장) -> [0,0,1, 2 ....]
	@Column( length=500)
	private String statusPerSlot ;
	
	// 슬롯별 현재 재고수량 [1, 23, 22, ....]
	@Column(length=500)
	private String stockPerSlot ;
	
	@JsonIgnoreProperties({"vendingMachine"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@OneToMany(mappedBy = "vendingMachine", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
	@OrderBy("id desc")
	private List<SaleProduct> SaleProduct;
	
	
	@CreationTimestamp
	private Timestamp createDate;

}
