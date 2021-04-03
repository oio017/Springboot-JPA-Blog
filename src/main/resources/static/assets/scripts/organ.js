//$('#scriptDiv').append('<script type="text/javascript" src="/assets/admin/pages/scripts/table-editable.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')


var organData;

var InitFunction = function() {
	return {
		initDaterange : initDatePicker("dateRange"),
		TableEditable : function(){
			  var handleTable = function () {
//			        function restoreRow(oTable, nRow) {
//			            var aData = oTable.row(nRow);
//			            var jqTds = $('>td', nRow);
//			            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
//			                oTable.fnUpdate(aData[i], nRow, i, false);
//			            }
//
//			            oTable.fnDraw();
//			        }
			        function createRow(oTable, nRow) {
			            var jqTds = $('>td', nRow);
			            jqTds[0].innerHTML = '<input type="text" class="form-control input-mini" value="' + oTable.cell(nRow,0).data() + '" data-before="' + oTable.cell(nRow,0).data() + '"disabled>';
			            jqTds[1].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,1).data() + '" data-before="' + oTable.cell(nRow,1).data() + '">';
			            jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,2).data() + '" data-before="' + oTable.cell(nRow,2).data() + '" disabled style="display:none">You Can modify at Account';
			            jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,3).data() + '" data-before="' + oTable.cell(nRow,3).data() + '">';
			            jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,4).data() + '" data-before="' + oTable.cell(nRow,4).data() + '">';
			            jqTds[5].innerHTML = '<input type="text" class="form-control input-medium" value="' + oTable.cell(nRow,5).data() + '" data-before="' + oTable.cell(nRow,5).data() + '">';
			            jqTds[6].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,6).data() + '" data-before="' + oTable.cell(nRow,6).data() + '">';
			            jqTds[7].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,7).data() + '" data-before="' + oTable.cell(nRow,7).data() + '" disabled style="display:none">auto';
			            jqTds[8].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,8).data() + '" data-before="' + oTable.cell(nRow,8).data() + '" disabled style="display:none">auto';
			            jqTds[9].innerHTML = '<a class="edit" href="">Save</a>';
			            jqTds[10].innerHTML = '<a class="cancel" href="">Cancel</a>';
			            
//			            jqTds[0].innerHTML = '<input type="text" class="form-control input-mini" value="' + oTable.cell(nRow,0).data() + '" disabled>';
//			            jqTds[1].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,1).data() + '">';
//			            jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,2).data() + '" disabled>';
//			            jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,3).data() + '">';
//			            jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,4).data() + '">';
//			            jqTds[5].innerHTML = '<input type="text" class="form-control input-medium" value="' + oTable.cell(nRow,5).data() + '">';
//			            jqTds[6].innerHTML = '<input type="text" class="form-control input-xsmall" value="auto" disabled>';
//			            jqTds[7].innerHTML = '<input type="text" class="form-control input-xsmall" value="auto" disabled>';
//			            jqTds[8].innerHTML = '<a class="edit" href="">Save</a>';
//			            jqTds[9].innerHTML = '<a class="cancel" href="">Cancel</a>';
			        }

			        function editRow(oTable, nRow) {
			            var jqTds = $('>td', nRow);
			            jqTds[0].innerHTML = '<input type="text" class="form-control input-mini" value="' + oTable.cell(nRow,0).data() + '" data-before="' + oTable.cell(nRow,0).data() + '"disabled style="display:none">'+oTable.cell(nRow,0).data();
			            jqTds[1].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,1).data() + '" data-before="' + oTable.cell(nRow,1).data() + '">';
			            jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,2).data() + '" data-before="' + oTable.cell(nRow,2).data() + '" disabled style="display:none">You Can modify at Account';
			            jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,3).data() + '" data-before="' + oTable.cell(nRow,3).data() + '">';
			            jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + oTable.cell(nRow,4).data() + '" data-before="' + oTable.cell(nRow,4).data() + '">';
			            jqTds[5].innerHTML = '<input type="text" class="form-control input-medium" value="' + oTable.cell(nRow,5).data() + '" data-before="' + oTable.cell(nRow,5).data() + '">';
			            jqTds[6].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,6).data() + '" data-before="' + oTable.cell(nRow,6).data() + '">';
			            jqTds[7].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,7).data() + '" data-before="' + oTable.cell(nRow,7).data() + '" disabled style="display:none">auto';
			            jqTds[8].innerHTML = '<input type="text" class="form-control input-xsmall" value="' + oTable.cell(nRow,8).data() + '" data-before="' + oTable.cell(nRow,8).data() + '" disabled style="display:none">auto';
			            jqTds[9].innerHTML = '<a class="edit" href="">Save</a>';
			            jqTds[10].innerHTML = '<a class="cancel" href="">Cancel</a>';
			        }

			        function saveRow(oTable, nRow) {
			            var jqInputs = $('input', nRow);
			            oTable.cell(nRow,0).data(jqInputs[0].value);
			            oTable.cell(nRow,1).data(jqInputs[1].value);
			            oTable.cell(nRow,2).data(jqInputs[2].value);
			            oTable.cell(nRow,3).data(jqInputs[3].value);
			            oTable.cell(nRow,4).data(jqInputs[4].value);
			            oTable.cell(nRow,5).data(jqInputs[5].value);
			            oTable.cell(nRow,6).data(jqInputs[6].value);
			            oTable.cell(nRow,7).data(jqInputs[7].value);
			            oTable.cell(nRow,8).data(jqInputs[8].value);
			            oTable.cell(nRow,9).data('<a class="edit" href="">Edit</a>');
			            oTable.cell(nRow,10).data('<a class="delete" href="">Delete</a>');
			            oTable.row(nRow).draw();
			        }
			        //입력창 내용을 제이슨object로 생성
			        function jsonObjectFromForm(oTable, nRow){
			        	var result ={};
		            	$(nRow).children().each(function(index){
		            		result[oTable.settings().init().columns[index].data] = $(this).children().val();
		            	});
			        	return JSON.stringify(result);
			        }
			        function cancelEditRow(oTable, nRow) {
			            var jqInputs = $('input', nRow);
			            oTable.cell(nRow,0).data($(jqInputs[0]).data("before"));
			            oTable.cell(nRow,1).data($(jqInputs[1]).data("before"));
			            oTable.cell(nRow,2).data($(jqInputs[2]).data("before"));
			            oTable.cell(nRow,3).data($(jqInputs[3]).data("before"));
			            oTable.cell(nRow,4).data($(jqInputs[4]).data("before"));
			            oTable.cell(nRow,5).data($(jqInputs[5]).data("before"));
			            oTable.cell(nRow,6).data($(jqInputs[6]).data("before"));
			            oTable.cell(nRow,7).data($(jqInputs[7]).data("before"));
			            oTable.cell(nRow,8).data($(jqInputs[8]).data("before"));
			            oTable.cell(nRow,9).data('<a class="edit" href="">Edit</a>', nRow, 7, false);
			            oTable.cell(nRow,10).data('<a class="delete" href="">Delete</a>', nRow, 7, false);
			            oTable.row(nRow).draw();
			        }
			        function editvalue(organInfo){				
			        	
			        	//리스트가 아니라 회사정보 하나만 넘어올 때
			        	if(organInfo.length==undefined){
			        		organInfo.adminList="<div class='adminListWrapper'><select name='admin' id='adminList'>"
				        		for(var j=0; j<organInfo.account.length;j++){
				        									+organInfo.account[j].id
				        									+"'";
										        			//마스터 관리자 여부 확인 
										        			if(organInfo.account[j].userId==organInfo[i].adminId){
										        				organInfo.adminList+=" class='masterAdmin'";
										        			}
										        			
								    organInfo.adminList+=">"
				        									+organInfo.account[j].userName
				        									+"("
				        									+organInfo.account[j].userPosition
				        									+") </option> "
				        		}organInfo.adminList+="</select><button class='fa fa-search-plus searchAccount' ></div>"
				        			
				        			organInfo.editField="<a class='edit' href=''>Edit</a>";
			        				organInfo.deleteField="<a class='delete' href=''>Delete</a>"
			        				organInfo.regDate=dateFormat(organInfo.regDate);	
			        				organInfo.modDate=dateFormat(organInfo.modDate);	
			        	}else{
			        		for(var i=0; i<organInfo.length;i++){
				        		organInfo[i].adminList="<div class='adminListWrapper'><select name='admin' id='adminList'>"
				        		for(var j=0; j<organInfo[i].account.length;j++){
				        			//alert('organInfo.account['+j+'].userId : ' +organInfo.account[j].userId +'\n'+'organInfo.adminId : ' +organInfo.adminId)
				        			organInfo.adminList+="<option value='"
				        			organInfo[i].adminList+="<option value='"
				        									+organInfo[i].account[j].id
				        									+"'";
										        			//마스터 관리자 여부 확인
										        			if(organInfo[i].account[j].userId==organInfo[i].adminId){
										        				organInfo[i].adminList+=" class='masterAdmin'";
										        			}
										        			
								    organInfo[i].adminList+=">"
				        									+organInfo[i].account[j].userName
				        									+"("
				        									+organInfo[i].account[j].userPosition
				        									+") </option> "
				        		}organInfo[i].adminList+="</select><button class='fa fa-search-plus searchAccount' ></div>"
				        			
				        			organInfo[i].editField="<a class='edit' href=''>Edit</a>";
			        				organInfo[i].deleteField="<a class='delete' href=''>Delete</a>"
			        				organInfo[i].regDate=dateFormat(organInfo[i].regDate);	
			        				organInfo[i].modDate=dateFormat(organInfo[i].modDate);	
				        	}
			        	}
			        	
			        	
			        	return organInfo
			        }
			        
			        //table에 datatable적용
			        var table = $('#organTable');
			        var oTable;
					$.ajax({
						type:'GET',
						url : '/api/organ',
//						data : {
//							page : pageVal,
//							size : sizeVal,
//							sort : sizeVal,
//							direction:directionVal
//						},
						success:function(returnValue){
							editedValue = editvalue(returnValue);
							oTable=table.DataTable({
					            dom: 'Blfrtp',
//					            "scrollX": true,
					            buttons: [
					                'copy', 'print', 'pdf', 'excel'
					            ],
					            
					            "lengthMenu": [
					                           [10, 15, 20, 50, 100, -1],
					                           [10, 15, 20, 50, 100,"All"] // change per page values here
					                       ],
					            "pageLength": 5,            
								data: editedValue,
						        columns:[
						                   {data:"id"},
						                   {data:"organName"},
						                   {data:"adminList"},
						                   {data:"organNum"},
						                   {data:"organPhone"},
						                   {data:"organAddress"},
						                   {data:"organZipcode"},
						                   {data:"regDate"},
						                   {data:"modDate"},
						                   {data:"editField"},
						                   {data:"deleteField"},
						                 ],
			                   "columnDefs": [{ // set default column settings
								                'orderable': true,
								                'targets': [0]
								            }, {
								                "searchable": true,
								                "targets": [0]
								            }],
								"dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            
					            "order": [
							                [0, "desc"]
							              ]
							}
							);
						},
						error:function(e){
							console.log(e)
						}
						
					});
					
					
					


			        var nEditing = null;
			        var nNew = false;

			        $('#newButton').click(function (e) {
			            e.preventDefault();

			            if (nNew && nEditing) {
			                alert('save first')
			                return;
			            }
			            oTable.order([0,'asc']).draw()
			            var aiNew = oTable.row.add({
			            	   "id":"",
			                   "organName":"",
			                   "adminList":"set admin account Later",
			                   "organNum":"",
			                   "organPhone":"",
			                   "organAddress":"",
			                   "organZipcode":"",
			                   "regDate":"auto",
			                   "modDate":"auto",
			                   "editField":"",
			                   "deleteField":"",
			            }).draw(0);
			            var nRow = oTable.row(aiNew[0]).node();
			            createRow(oTable, nRow);
			            nEditing = nRow;
			            nNew = true;
			        });

			        table.on('click', '.delete', function (e) {
			            e.preventDefault();

			            //TODO internationalization 
			            if (confirm('해당 회사에 소속된 계정도 모두 삭제됩니다. 그래도 진행하시겠습니까?') == false) {
			                return;
			            }
			            var nRow = $(this).parents('tr')[0];
			            
			            $.ajax({
							type:'POST',
							url : '/api/organ/delete',
							contentType: "application/json; charset=utf-8",
							data : JSON.stringify(oTable.row(nRow).data()),
							async : false,
							success:function(returnValue){
								
								oTable.row(nRow).remove().draw();
							},
							error:function(e){
								alert(e.responseJSON.message);
							}
							
						});
			            
			            
			        });
			        
			        //cancel 클릭
			        table.on('click', '.cancel', function (e) {
			            e.preventDefault();
			            if (nNew) {
			                oTable.fnDeleteRow(nEditing);
			                nEditing = null;
			                nNew = false;
			            } else {
			            	cancelEditRow(oTable, nEditing);
			                nEditing = null;
			            }
			        });
			        
			        //edit 클릭
			        table.on('click', '.edit', function (e) {
			        	e.preventDefault();
			            /* Get the row as a parent of the link that was clicked on */
			            var nRow = $(this).parents('tr')[0];
			            var urlString = '/api/organ';
			            
			            //현재 작업중인 row가 있고 그 로우가 클릭한 로우와 다름
			            if (nEditing !== null && nEditing != nRow) {
			                /* Currently editing - but not this row - restore the old before continuing to edit mode */
			            	cancelEditRow(oTable, nEditing);
			            	editRow(oTable, nRow);
			                nEditing = nRow;
			                //SAVE눌렀을 때
			            } else if (nEditing == nRow && this.innerHTML == "Save") {
			            	//TODO need validation on input field 
			            	var method = 'POST'
			            	urlString+='/put'	
			            	var jqInputs = $('input', nRow);
				            //분기
			            	if(jqInputs[0].value==""){
				            	method = 'POST'
				            }
			            	$.ajax({
								type:method,//new 버튼인 경우에 POST전송(등록)
								url : urlString,
								contentType: "application/json; charset=utf-8",
								data : jsonObjectFromForm(oTable, nRow),
								async : false,
								success:function(returnValue){
									alert('내용이 반영되었습니다.');
									location.reload();
//									editedValue = editvalue(returnValue);
//									oTable.row(nRow).data(editedValue);
									//saveRow(oTable, nEditing);
								},
								error:function(e){
									alert('내용반영 실패' + e);
									//cancelEditRow(oTable, nEditing);
								}
								
							});
			            	
			            	
			                /* Editing this row and want to save it */
			                nEditing = null;
			                //alert("Updated! Do not forget to do some ajax to sync with backend :)");
			            } else {
			                /* No edit in progress - let's start one */
			                editRow(oTable, nRow);
			                nEditing = nRow;
			            }
			        });
			    }

			    return {

			        //main function to initiate the module
			        init: function () {
			            handleTable();
			        }

			    };
		},
		init : function() {
			this.initDaterange;
		//	this.initCreateTable()
			this.TableEditable().init();
		}

	};
}();
;


$(document).ready(function() {
	InitFunction.init();
	
//	TableEditable.init();
});