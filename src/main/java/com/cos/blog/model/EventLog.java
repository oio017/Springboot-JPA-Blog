package com.cos.blog.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
public class EventLog {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name="vendingMachineId")
	private VendingMachine vendingMachine;

	private LocalDateTime dateTime;
	
	@Enumerated(EnumType.STRING) // STOP, RUNNING, BROKEN
	private EventType eventType; 

	@ManyToOne // 관련 payment, orderItem 정보를 참조하도록 한다.
	@JoinColumn(name="paymentId")
	private Payment payment;
	
	@Column(length = 512)
	private String content;
	
	@CreationTimestamp
	private Timestamp createDate;
	
	public void setLocalDateTime(String date) {
		//LocalDateTime dateTime = LocalDateTime.parse("2018-05-05T11:50:55");
		this.dateTime = LocalDateTime.parse(date);
	}
}
