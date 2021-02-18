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
public class Board {

	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(nullable = false, length = 100)
	private String title;

	@Lob
	private String content;

	// @ColumnDefault("0")
	private int count;

	@ManyToOne(fetch = FetchType.EAGER) // Many=Board, One=User
	@JoinColumn(name = "userId")
	private User user;

	// mappedBy 연관관계의 주인이 아니다. (난 FK가 아니에요)
	// EAGER 전략이므로 Select해서 함께 DB로부터 가져옴.
	@JsonIgnoreProperties({"board"}) //무한참조 방지 (참조 : https://getinthere.tistory.com/34)
	// cascade 옵션을 지정하여 해당 개시글이 삭제된 경우 해당 댓글을 모두 자동삭제하도록 한다.
	@OneToMany(mappedBy = "board", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	@OrderBy("id desc")
	private List<Reply> replys;

	@CreationTimestamp
	private Timestamp createDate;

}
