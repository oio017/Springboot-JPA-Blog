package com.cos.blog.model;


import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import type.SlotStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Slot {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JsonIgnoreProperties({"vendingMachine", "deviceType"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@JoinColumn(name="vendingMachineId")
	private VendingMachine vendingMachine;
	
	@ManyToOne
	@JsonIgnoreProperties({"Product"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@JoinColumn(name="productId")
	private Product  product;
	
	@ColumnDefault("1")
	private int slotId;
	
	@ColumnDefault("1")
	private int slotNum;
	
	@ColumnDefault("1")
	private int sizeOnSlot;

	@Enumerated(EnumType.STRING) // STOP, RUNNING, BROKEN
	private SlotStatus slotStatus;
	
	@ColumnDefault("1") // unitsOnSlot -> stockOnSlot
	private int unitsOnSlot;
}
