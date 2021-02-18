package com.cos.blog;

import org.junit.Test;

import com.cos.blog.model.Reply;

public class ReplyObjectTest {

	@Test // Junit 이 가지고 있는 어노테이션 : 실행방법은 마우스 우클릭 -> RUN -> JUnit Test 클릭
	public void 투스트링_테스트() {
		Reply reply = Reply.builder()
				.id(1)
				.user(null)
				.board(null)
				.content("안녕")
				.build();
		
		System.out.println(reply); // 오브젝트를 출력하면 자동으로 toString()이 호출됨.
	}
}
