package com.cos.blog.model;

import java.sql.Timestamp;
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
import javax.persistence.Lob;
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
public class DeviceType {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	// Combo60, Combo60Slot455
	@Column(nullable=false, length=50)
	private String modelName;
	
	@Enumerated(EnumType.STRING) // DB에 string으로 알려줌.
	private StatusType status; 

	// slot 총 갯수
	// @ColumnDefault("50")
	private int totalslotCnt ;

	// slot 이름 ["1", "2", 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, …. "59", "60"]
	@Column(nullable=false, length=500)
	private String slotName;
	
	// 각 slot내 칸수 [10, 10, …. 18]
	@Column(nullable=false, length=500)
	private String cntPerSlot;
	
	@Lob
	private String content;

	// mappedBy 연관관계의 주인이 아니다. (난 FK가 아니에요)
	// EAGER 전략이므로 Select해서 함께 DB로부터 가져옴.
	@JsonIgnoreProperties({"deviceType"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	// cascade 옵션을 지정하여 해당 개시글이 삭제된 경우 해당 댓글을 모두 자동삭제하도록 한다.
	@OneToMany(mappedBy = "deviceType", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
	@OrderBy("id desc")
	private List<VendingMachine> vendingMachines;

	@CreationTimestamp
	private Timestamp createDate;

}
