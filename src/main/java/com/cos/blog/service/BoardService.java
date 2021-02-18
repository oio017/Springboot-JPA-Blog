package com.cos.blog.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cos.blog.dto.ReplySaveRequestDto;
import com.cos.blog.model.Board;
import com.cos.blog.model.Reply;
import com.cos.blog.model.User;
import com.cos.blog.repository.BoardRepository;
import com.cos.blog.repository.ReplyRepository;


/* 서비스에 대한 설명
 *		1. 트랜잭션 관리
 * 		2. 서비스 의미 : 관련 DB(CRUD) 모든 행위 일체 하나의 트랜젹션으로 처리하는 것
 * */

@Service // springboot가 컴포넌트 스캔하여 Bean에 등록을 해줌 -> IoC (메모리에 로딩을 대신 해줌)
public class BoardService {

	/*
	 *  @Autowired 어노테이션을 통해 DI 처리되는 과정 설명
	 * 		- 파라미터가 있는 생성자를 통해 new하여 object를 생성하는 방식과 동일함.
	 * 		private BoardRepository boardRepository;
	 *		private ReplyRepository replyRepository;
	 *		public BoardService(BoardRepository bRepo, ReplyRepository rRepo) {
 	 *			this.boardRepository = bRepo;
	 *			this.replyRepository = rRepo;
	 *		} 
	 *
	 *  @Autowired 어노테이션 대신 다른 방법으로 DI 처리하는 방법
	 *  @RequiredArgsConstructor 를 이용하여 초기화가 꼭 필요한 object를 자동 초기화 시키도록 한다.
	 *  @RequiredArgsConstructor
	 *  private final BoardRepository boardRepository;
	 *  private final ReplyRepository replyRepository;
	 *  
	 * */
	@Autowired // DI : Dependency Injection
	private BoardRepository boardRepository;
	
	@Autowired
	private ReplyRepository replyRepository;
		

	@Transactional // DB(CRUD) 모든 행위가  정상적으로 처리되어야 성공처리. 
	public void write(Board board, User user) {
		
		board.setCount(0);
		board.setUser(user);
		
		boardRepository.save(board);
	}
	
	@Transactional(readOnly = true)
	public Page<Board> 글목록(Pageable pageable){
		return boardRepository.findAll(pageable);
	}
	
	@Transactional(readOnly = true)
	public Board 글상세보기(int id) {
		return boardRepository.findById(id)
				.orElseThrow(()->{
					return new IllegalArgumentException("글 상세보기 실패: 아이디를 찾을 수 없습니다.");
				});
	}

	@Transactional
	public void 글삭제하기(int id) {
		boardRepository.deleteById(id);
	}

	@Transactional
	public void 글수정하기(int id, Board reqeustBoard) {
		Board board = boardRepository.findById(id)
				.orElseThrow(()->{
					return new IllegalArgumentException("글 수정 실패 : 아이디를 찾을 수 없습니다.");
				}); // 영속화 완료
		
		board.setTitle(reqeustBoard.getTitle());
		board.setContent(reqeustBoard.getContent());
		// 해당 함수로 종료 시(Service가 종료될 때) 트랜잭션이 종료된다. 이때 더티체킹이 -> 자동 업데이트가 되어 DB에 Flush 진행됨.
	}
	
	@Transactional
	// 필드를 개별로 받아서 댓글을 저장하는 방
	public void 댓글쓰기_Old(User user, int boardId, Reply requestReply) {
		Board board  = boardRepository.findById(boardId)
				.orElseThrow(()->{
					return new IllegalArgumentException("댓글쓰기 실패 : 게시글 ID를 찾을 수 없습니다.");
				});
				
		requestReply.setUser(user);
		requestReply.setBoard(board);
		
		replyRepository.save(requestReply);
		
		System.out.println(requestReply); // 오브젝트를 출력하면 자동으로 toString()이 호출됨.
	}
	
	@Transactional
	// DTO를 사용하여 필요한 데이타를 한번에 받아 처리함.
	public void 댓글쓰기(ReplySaveRequestDto replySaveRequestDto) {

		/* -------- Reply Data 영속화 후 reply DB 저장방법 1 -------- */ 
		//User user  = userRepository.findById(replySaveRequestDto.getUserId())
		//		.orElseThrow(()->{
		//			return new IllegalArgumentException("댓글쓰기 실패 : 사용자 ID를 찾을 수 없습니다.");
		//		}); // 영속화 완료
		//Board board  = boardRepository.findById(replySaveRequestDto.getBoardId())
		//		.orElseThrow(()->{
		//			return new IllegalArgumentException("댓글쓰기 실패 : 게시글 ID를 찾을 수 없습니다.");
		//		}); // 영속화 완료
		
		// reply DB 저장방법1
		//Reply reply = Reply.builder()
		//		.user(user)
		//		.board(board)
		//		.content(replySaveRequestDto.getContent())
		//		.build();
		//replyRepository.save(reply);
		
		// reply DB 저장방법2
		//		Reply reply = new Reply();
		//		reply.update(user, board, replySaveRequestDto.getContent());
		//		replyRepository.save(reply);
		
		/* -------- Reply Data 영속화 후 reply DB 저장방법 2 -------- */
		replyRepository.mySave(replySaveRequestDto.getUserId(), replySaveRequestDto.getBoardId(), replySaveRequestDto.getContent());
	}
	
	@Transactional
	// DTO를 사용하여 필요한 데이타를 한번에 받아 처리함.
	public void 댓글삭제(int replyId) {
		replyRepository.deleteById(replyId);
	}
	
}
