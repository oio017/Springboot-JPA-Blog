package com.cos.blog.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.ColumnDefault;

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
public class Product {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JsonIgnoreProperties({"vendingMachine", "deviceType"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	@JoinColumn(name="vendingMachineId")
	private VendingMachine vendingMachine;
	
	@ColumnDefault("1")
	private int categoryId;

	@ColumnDefault("0")
	private int discontinued;

	@Column(length = 20)
	private String imageRes;

	@Column(length = 100)
	private String imageUrl;
	
	@ColumnDefault("1")
	private int productId;

	@Column(nullable = false, length = 100)
	private String productName;

	@Column(nullable = false, length = 10)
	private String quantityPerUnit;

	@ColumnDefault("0")
	private int reorderLevel;

	@ColumnDefault("1000")
	private int unitPrice;

	@ColumnDefault("999")
	private int unitsInStock;

	@ColumnDefault("1")
	private int unitsOnOrder;

	@Lob
	private String content;
}
