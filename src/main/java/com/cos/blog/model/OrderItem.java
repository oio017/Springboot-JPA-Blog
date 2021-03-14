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
public class OrderItem {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name="paymentId")
	private Payment payment;
	
	@ColumnDefault("0")
	private int discount;
	
	@ColumnDefault("0")
	private int dispensingFailItems;
	
	@ColumnDefault("0")
	private int dispensingOkItems;
	
	@ColumnDefault("0")
	private int dispensingStatus;
	
	@ColumnDefault("0")
	private  long orderId;
	
	@ColumnDefault("0")
	private int productId;
	
	@ColumnDefault("0")
	private int quantity;
	
	@ColumnDefault("0")
	private int slotId;
	
	@ColumnDefault("0")
	private int unitPrice;
	
}
