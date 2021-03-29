let index = {

	// 리스너 함수 리스트
	init: function() {
		this.clickEventInit();
	},

	clickEventInit: function(){	
		$('#sale-search-button').click(function(e){
			alert('조회버턴이 클릭 되었습니다.');
			let data = {
			    startDate:"2021-03-26",
    			endData:"2021-03-26",
    			vendingMachine:"CVVN100020"
			};
			
			
			$.ajax({
				type: "POST",
				url: "/sale/saleList",
				data: JSON.stringify(data),
				contentType: "application/json", 
				dataType: "json" // 응답에 대한 DataType 지정
			}).done(function(resp) {
				location.href = "/sale/saleList";
			}).fail(function(error) {
				alert(JSON.stringify(error));
			});
		
		});
		
		//////
		$("#add-form").submit( function(event){
         	event.preventDefault();
	        var data = {};

    	    $.each( $(this).serializeArray(), function(index, o){
                  data[o.name] = o.value
         	})

         	$.ajax({
				url: "/sale/saleList",
                  type: "POST",
                  dataType: "json",          // ajax 통신으로 받는 타입
                  contentType: "application/json",  // ajax 통신으로 보내는 타입
                  data: JSON.stringify(data),
                  success: function(result){
                           // ajax 통신 성공 시 로직 수행
                  }
         	})
		});		
		///////
	},
}

index.init();