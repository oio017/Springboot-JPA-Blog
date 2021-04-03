$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')

var table = $('#node-table');
var oTable;
var vTable;
var InitFunction = function() {
	return {
		table : function() {
			var mainTable = function() {
				// table에 datatable적용
				$
						.ajax({
							type : 'GET',
							url : '/api/node',
							success : function(returnValue) {
								// api address와 api port 화면에 할당
								oTable = table
										.DataTable({
											dom : 'Blfrtp',
											buttons : [  ],
											"autoWidth" : false,
											"lengthMenu" : [
													[ 10, 15, 20, 50, 100, -1 ],
													[ 10, 15, 20, 50, 100,
															"All" ] // change
											// per page
											// values
											// here
											],
											"pageLength" : 20,
											data : returnValue,
											columns : [{data : "nodeNickName"}, 
											           {data : "url"},
											           null, 
											           {data : "id"}
											           ],
											"columnDefs" : [
													{
														'render' : function(data, type, row, meta) {
															var result = "";
															if ($('#hasNodeWriteAccess').val() == 'true') {
																result += "<div class='button-wrap'>";
																result +="<button class='btn btn-sm blue btn-outline node-mod-button'>수정</button>&nbsp;&nbsp;&nbsp;";
																result +="<button class='btn btn-sm red btn-outline node-delete-button'>삭제</button>";
															}
															return result;
														},
														'searchable' : false,
														'targets' : [ 2 ]
													},
													{
														'searchable' : false,
														'visible': false,
														'targets' : [ 3 ]
													},
													],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 3, "desc" ] ],

										});
							},
							error : function(e) {
								console.log(e)
							}

						});
				// hide search box with special css class
				var nEditing = null;
				var nNew = false;
				// add-app
				$('#add-app').click(function(e) {
					e.preventDefault();
					$('#app-reg-modal').modal();
				});

				// 정보 수정 submit
			}
			return {
				// main function to initiate the module
				init : function() {
					mainTable();
				}
			};
		},
		modalInit : function(){
			//노드 등록 클릭
			$('#new-node-button').click(function(e){
				e.preventDefault();
				$('#reg-node-nickname').val('');
				$('#reg-url').val('');
				$('#new-node-modal').modal('show');
			});
			//노드등록 submit버튼 클릭 시
			$('#new-node-submit').click(function(e){
				e.preventDefault();
				var nodeEntity =$('#new-node-form').serializeJSON({checkboxUncheckedValue: "0"});
				$.ajax({
					type:'POST',
					url:'/api/node',
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(nodeEntity),
					async : false,
					success : function(returnValue) {
						alert('노드가 등록되었습니다.');
						location.reload();
					},
					error : function(e) {
						console.log(e);
						alert(e.responseJSON.message)
					}
				});
				
				
				
			});
			//노드수정 submit버튼 클릭 시
			$('#node-mod-submit').click(function(e){
				e.preventDefault();
				var nodeEntity =$('#node-mod-form').serializeJSON({checkboxUncheckedValue: "0"});
				$.ajax({
					type:'POST',
					url:'/api/node/put',
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(nodeEntity),
					async : false,
					success : function(returnValue) {
						alert('노드정보가 수정되었습니다.');
						location.reload();
					},
					error : function(e) {
						console.log(e);
						alert(e.responseJSON.message)
					}
				});
				
				
				
			});
			
		
			table.on('click', '.node-delete-button', function(e) {
				e.preventDefault();
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				
				
				if(confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))){
					$.ajax({
						type:'POST',
						url:'/api/node/delete',
						contentType : "application/json; charset=utf-8",
						data : JSON.stringify({"id":data.id}),
						async : false,
						success : function(returnValue) {
							alert('노드가 삭제되었습니다.');
							location.reload();
						},
						error : function(e) {
							alert('fail jam');
						}
						
					});
					
				}else{
					return false;
				}
			});
			table.on('click', '.node-mod-button', function(e) {
				e.preventDefault();
				var nRow = $(this).parents('tr')[0];
				var data = oTable.row(nRow).data();
				$('#node-mod-form #nodeNickName').val(data.nodeNickName);
				$('#node-mod-form #url').val(data.url);
				$('#node-mod-form #id').val(data.id);
				$('#node-detail-modal').modal('show');
			});
			
		},
		init : function() {
			this.initDaterange;
			// this.initCreateTable()
			this.table().init();
			this.modalInit();
		}
	}

}();

$(document).ready(function() {
	//Metronic.init();
	InitFunction.init();
	$('[data-toggle="popover"]').popover();
});