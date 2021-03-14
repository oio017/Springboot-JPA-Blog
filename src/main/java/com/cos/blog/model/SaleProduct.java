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
public class SaleProduct {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
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