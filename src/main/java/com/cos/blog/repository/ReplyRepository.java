package com.cos.blog.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.cos.blog.dto.ReplySaveRequestDto;
import com.cos.blog.model.Reply;

public interface ReplyRepository extends JpaRepository<Reply, Integer>{

	@Modifying
	@Query(value="INSERT INTO Reply(userId, boardId, content, createDate) VALUES(?1, ?2, ?3, now())", nativeQuery = true)
	// replySaveRequestDto 내의 필드가 순서대로 ?1, ?2, ?3 에 대입된다.
	int mySave(int userId, int boardId, String content); // Return type int : 업데이트된 레코드의 갯수
}
