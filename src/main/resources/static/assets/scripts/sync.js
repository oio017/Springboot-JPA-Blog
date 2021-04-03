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
							url : '/api/sync',
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
											           null,
											           null,
											           null,
											           {data : "id"}
											           ],
											"columnDefs" : [
													{
														'render' : function(data, type, row, meta) {
															var result = "";
															if ($('#hasSyncWriteAccess').val() == 'true') {
																result += "<div class='button-wrap'>";
																result +="<button class='btn btn-sm green btn-outline node-deploy-button'>배포</button>&nbsp;&nbsp;";
																result +="<button class='btn btn-sm blue btn-outline node-apply-button'>적용</button>";
															}
															return result;
														},
														'serchable' : false,
														'targets' : [ 3 ]

													},
													
													{								
														'data' : function(row, type, val, meta ){
															if(row.deployTime!=null){
																return timeFormat(row.deployTime)
															}else{
																return "이력 없음"
															}
														},

														'targets' : [ 1 ]
													},
													{								
														'data' : function(row, type, val, meta ){
															if(row.applyTime!=null){
																return timeFormat(row.applyTime)
															}else{
																return "이력 없음"
															}
														},
														
														'targets' : [ 2 ]
													},

													{
														'visible': false,
														'searchable' : false,
														'targets' : [ 4 ]
													},
													],
											"dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
											// scrollable
											// datatable

											"order" : [ [ 4, "desc" ] ],

										});
								
								$(".node-deploy-button").click(function(e){
									e.preventDefault();
									var nRow = $(this).parents('tr')[0];
									var data = oTable.row(nRow).data();
									
									if(confirm("배포 하시겠습니까?")){
										$.ajax({
											type : 'POST',
											url : '/api/sync/deploy',
											contentType : "application/json; charset=utf-8",
											data : JSON.stringify(data),
											success : function(returnValue) {
												alert(returnValue);
											},
											error : function(e) {
												console.log(e)
												alert('error :' + e.responseJSON.message);
											}
										});
										
									}else{
										return false;
									};
								});
								$(".node-apply-button").click(function(e){
									e.preventDefault();
									var nRow = $(this).parents('tr')[0];
									var data = oTable.row(nRow).data();

									if(confirm("적용 하시겠습니까?")){
										$.ajax({
											type : 'POST',
											url : '/api/sync/apply',
											contentType : "application/json; charset=utf-8",
											data : JSON.stringify(data),
											success : function(returnValue) {
												alert(returnValue);
											},
											error : function(e) {
												console.log(e);
												alert('error :' + e.responseJSON.message);
											}
										});
									}else{
										return false;
									};
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
				// 정보 수정 submit

			}
			return {
				// main function to initiate the module
				init : function() {
					mainTable();
				}
			};
		},

		init : function() {
			// this.initCreateTable()
			this.table().init();
		}
	}

}();

$(document).ready(function() {
	//Metronic.init();
	InitFunction.init();
	
	$('[data-toggle="popover"]').popover();
});