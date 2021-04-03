//$('#scriptDiv').append('<script type="text/javascript" src="/assets/admin/pages/scripts/table-editable.js"></script>')
$scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/jsbn.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/prng4.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/rng.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/scripts/rsa/rsa.js"></script>')


var organData;
var oTable;
var tryingbool = false;
var InitFunction = function() {
	return {
		initDaterange : initDatePicker("dateRange"),
		initOrganList : function(){
			$.ajax({
				type:'GET',
				url:'/api/organ',
				success : function(returnValue){
					$(returnValue).each(function(i){
						
						$('#organ-select').append('<option value="'+returnValue[i].id+'">'+returnValue[i].organName+'('+returnValue[i].id+')</option>')
					});
				},
				error:function(e){
					console.log(e)
				}
					
			});
		},
		TableEditable : function(){
			  var handleTable = function () {

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
			            jqTds[9].innerHTML = '<a class="save" href="">Save</a>';
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
			        var table = $('#accountTable');
			        
					$.ajax({
						type:'GET',
						url : '/api/account',
						success:function(returnValue){
							//editedValue = editvalue(returnValue);
							oTable=table.DataTable({
					            dom: 'Blfrtp',
					            buttons: [
					                //'copy', 'print', 'pdf', 'excel'
					            ],
					            
					            "lengthMenu": [
					                           [10, 15, 20, 50, 100, -1],
					                           [10, 15, 20, 50, 100,"All"] // change per page values here
					                       ],
					            "pageLength": 20,            
								data: returnValue,
						        columns:[
						                   {data:"id"},
						                   {data:"organ.id"},
						                   {data:"organ.organName"},
						                   {data:"userName"},
						                   {data:"userId"},
						                   null,
						                   {data:"userPhone"},
						                   null,
						                   null,
						                   null,
						                   null,
						                   null
						                 ],
			                   "columnDefs": [{ 'data' : "authList",
			                	   				'render' : function(data,type,row, meta){
			                	   					if (row.organ.adminId == row.userId) {
			                	   						return "<i class=\"fa fa-unlock\" aria-hidden=\"true\"></i> "+getMessage('account.masterAdmin','마스터 관리자');
			                	   					}
			                	   					var result="first"
			                	   					if(data.length>0){
			                	   						array = [];
		                	   							for(var i=0; i<data.length; i++){
		                	   								   array.push(getMessage("authCategory."+data[i].authCategoryListEntity.categoryName,data[i].authCategoryListEntity.categoryName)+"_"+getMessage("authLevel."+data[i].authLevelEntity.levelName,data[i].authLevelEntity.levelNameKr))
		                	   								// array.push(data[i].authCategoryListEntity.categoryNameKr+"_"+data[i].authLevelEntity.levelNameKr);
		                	   							}
		                	   							result = array.join(", ")
			                	   					}else{
			                	   						//TODO internationalization
			                	   						result="<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> "+getMessage('common.noAuthority','권한 없음')
			                	   					}
			                	   					return result;
			                	   				},
			                	   				'targets':[5]	
			                   				},{ // set default column settings
								                'orderable': true,
								                'targets': [0],
								                'className' : 'id-column'	
								            },{ // set default column settings
								            	'visible':false,
								                'targets': [2],
								                'className' : 'ongan-name-column'	
								            }, {
								                "searchable": true,
								                "targets": [0]
								            },{
								            	'visible':false,
								            	"data" : "regDate",
								            	"render" : function(data, type, row, meta){
								            		result = dateFormat(data);
													return result;
								            	},
								            	
								            	"searchable": true,
								                "targets": [7]
								            },{
								            	'visible':false,
								            	"data" : "modDate",
								            	"render" : function(data, type, row, meta){
								            		result = dateFormat(data);
													return result;
								            	},
								            	
								            	"searchable": true,
								                "targets": [8]
								            },{
								            	"data" : "status",
								            	"render" : function(data, type, row, meta){
								            		if(data==1){
								            			return getMessage('account.notAllowed','미승인');
								            		}
													return getMessage('account.allowed','승인');
								            	},
								            	
								            	"searchable": true,
								                "targets": [9]
								            },{
								            	"data" : "id",
								            	"render" : function(data, type, row, meta){
													var result = "<div class='button-wrap'>";
													buttons = []
													if ($('#hasAccountWriteAccess').val() == 'true') {
				                	   					if (row.organ.adminId != row.userId) {
				                	   						buttons.push("<button class='authEdit btn btn-sm purple btn-outline' >"+getMessage('account.changeAuth','권한변경')+"</button>")
				                	   						buttons.push("<a href='#'  class='btn btn-sm blue btn-outline edit editButton' style='padding : 5px; width:65px; text-align: center; margin-top: -5px; margin-bottom: -5px;' data-id='"
				                	   								+ data
				                	   								+ "'> "+getMessage('common.edit','수정')+"</a>")
				                	   					}
				                	   					if(row.userId == $('#username').val()&&row.organ.adminId == row.userId){
				                	   						buttons.push("<a href='#'  class='btn btn-sm blue btn-outline edit editButton' style='padding : 5px; width:65px; text-align: center; margin-top: -5px; margin-bottom: -5px;' data-id='"
				                	   								+ data
				                	   								+ "'> "+getMessage('common.edit','수정')+"</a>")
				                	   					}
														if (row.userId != $('#username').val() && row.organ.adminId != row.userId) {
															buttons.push("<a href='#'  class='btn btn-sm red btn-outline button delete' style='padding : 5px; width:65px; text-align: center; margin-top: -5px; margin-bottom: -5px; 'data-id='"
																	+ data
																	+ "'> "+getMessage('common.remove','삭제')+"</a>");
														}
													}
													result += buttons.join("&nbsp;&nbsp;")
													result += "</div>"
													return result;
								            	},
								            	'targets':[10]
								            },{	
								            	'visible':false,
								            	'targets':[0, 1]
								            },{	
								            	'data' : function(row, type, val, meta) {
								            		content = "";
								            		if($('#username').val()==row.organ.adminId){
								            			if(row.userId!=$('#username').val()){
								            				content ='<button class="changeMaster btn btn-sm purple btn-outline">'+getMessage("account.assingMasterAccount","마스터 관리자 양도")+'</button>'
								            			}
								            		}else{
								            			content=getMessage('common.noAuthority','권한 없음')
								            		}
													return content;
												},
								   				'visible':!isEverspin,
												targets : [ 11 ]
								            }],
								"dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            
					            "order": [
							                [0, "desc"]
							              ],
							              
							}
							);
						},
						error:function(e){
							console.log(e)
						}
						
					});
					
					
					


			        var nEditing = null;
			        var nNew = false;

			        table.on('click', '.delete', function (e) {
			            e.preventDefault();
			            //TODO internationalization 
			            if (confirm(getMessage('account.deleteConfirmMessage','계정이 삭제됩니다 그래도 진행하시겠습니까?')) == false) {
			                return;
			            }
			            var nRow = $(this).parents('tr')[0];
			            
			            $.ajax({
							type:'POST',
							url : '/api/account/delete',
							contentType: "application/json; charset=utf-8",
							data : JSON.stringify(oTable.row(nRow).data()),
							async : false,
							success:function(returnValue){
								//oTable.row(nRow).remove().draw();
								alert(getMessage('account.deletedMessage','계정이 삭제되었습니다.'));
								window.location.reload();
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
			        	var nRow = $(this).parents('tr')[0];
			            /* Get the row as a parent of the link that was clicked on */
			        	setValues(oTable.row(nRow).data());
			        	$('.detailModal').modal()
			        });
			        
			        //authEdit클릭
			        table.on('click', '.authEdit', function (e) {
			        	e.preventDefault();
			        	var nRow = $(this).parents('tr')[0];
			            /* Get the row as a parent of the link that was clicked on */
			        	var data = oTable.row(nRow).data();
			        	if (data.userId == data.organ.adminId) {
			        		alert(getMessage('account.masterAdminMessage','마스터 관리자입니다.'));
			        		return;
			        	}
			        	$('div.authControlModal').modal();
			        	writeAuthControl(data);
			        });
			        
			        
			        //마스터관리자 양도 클릭 시
			        table.on('click', '.changeMaster', function (e) {
			        	e.preventDefault();
			        	var nRow = $(this).parents('tr')[0];
			            /* Get the row as a parent of the link that was clicked on */
			        	var data = oTable.row(nRow).data();
			        	content = getMessage('account.admin','관리자')+" "+data.userName+"["+data.userId+"]"+getMessage('account.assingMasterMessage','\n마스터 관리자 권한을 양도하시겠습니까? \n양도 후에는 본인의 계정권한이 없어집니다. \n양도 성공시 본인 계정은 자동 로그아웃 됩니다.\n \n이 경우 새로 선임된 마스터 관리자가 권한을 새로 부여해야 합니다. \n정말로 양도를 원할 시에는 확인 버튼을 눌러 주십시오');
			        	content2 = getMessage('account.admin','관리자')+data.userName+"["+data.userId+"]  "+getMessage('account.assingMasterMessage2','\n관리자 권한을 양도 합니다. 확인 하셨습니까? 양도를 원하시면 확인 버튼을 눌러 주십시오.')
			        	if(confirm(content)){
			        		if(confirm(content2)){
			        			$.ajax({
			        				type:'POST',
				        			url : '/api/organ/changemaster',
				        			contentType: "application/json; charset=utf-8",
				        			data : JSON.stringify({userId:data.userId}),
				        			async : false,
				        			success:function(returnValue){
				        				
				        				alert(getMessage('account.masterAdmin','마스터 관리자 ') + ' : '+returnValue.userId+' '+'성공적으로 양도되었습니다. 계정 로그아웃 됩니다. 권한 설정은 새로운 마스터 관리자 계정에서 부여하십시오.');
				        				window.location.replace("/logout");
				        			},
				        			error:function(e){
				        				alert(getMessage('account.changeAuthFailedMessage','권한 변경에 실패하였습니다.')+ 'error : ' + e.responseJSON.message);
				        				
				        				console.log(e);
				        			}
			        			});
			        		}
			        	}
			        });
			        
			        $('#newAccount').click(function(e){
			        	e.preventDefault();
			        	$('#formPut input').val("");
			        	$('#createAccount #register-organId').val($('#AccountInfo').data('organid'));
			        	$('#createAccount').modal();
			        });
			        $('#find-organ-button').click(function(e){
			        	e.preventDefault();
			        	$('#find-organ').modal();
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
		//	this.initOrganList();
		//	this.initCreateTable()
			this.TableEditable().init();
		}

	};
}();
;


function setValues(data){
	$('#input-id').attr('value',data.id);
	$('#input-organId').attr('value',data.organ.id);
	$('#createNewPasswordButton').attr('data-id',data.id);
	$('#input-organName').attr('value',data.organ.organName);
	$('#input-userName').attr('value',data.userName);
	$('#input-userPhone').attr('value',data.userPhone);
	$('#input-status').attr('value',data.status);
	status="";
	if(data.status==0){
		status+='<select name="status"><option value="0" selected="selected">'+getMessage('common.approval','승인')+'</option><option value="1" >'+getMessage('common.disapproval','미승인')+'</option></select>';
	}else{
		status+='<select name="status"><option value="0">'+getMessage('common.approval','승인')+'</option><option value="1" selected="selected">'+getMessage('common.disapproval','미승인')+'</option></select>';
	}
	
	$('#div-status').html(status);
	/*
	var result="";
	if(data.authList.length==0){
		result="권한 없음";
	}else{	
		for(var i=0; i<data.authList.length; i++){
			result+="["
				+data.authList[i].authCategoryListEntity.categoryNameKr
				+"_"
				+data.authList[i].authLevelEntity.levelNameKr
				+"] \t \t \t"
		}
	}
	$('#div-auth').html(result);
	$('#input-birth').attr('value', data.userBirth)
	*/
	
}

//해당 관리자가 가진 권한을 포함한 리스트 출력
function writeAuthControl(data){
	var authCategoryList;
	var authLevelList;
	 $.ajax({
			type:'GET',
			url : '/api/authCategory',
			contentType: "application/json; charset=utf-8",
			async : false,
			success:function(returnValue){
				authCategoryList = returnValue;
			},
			error:function(e){
				alert(e.responseJSON.message);
			}
			
		});
	 $.ajax({
		 type:'GET',
		 url : '/api/authLevel',
		 contentType: "application/json; charset=utf-8",
		 async : false,
		 success:function(returnValue){
			 authLevelList = returnValue;
		 },
		 error:function(e){
			 alert(e.responseJSON.message);
		 }
		 
	 });
	 
	var authList = data.authList;
	var result='';
	var authListDisplay=[];
	var length = authCategoryList.length;
	for(var i=0; i<length; i++){

		result+="<div class='authField icheck-inline col-md-12'>";
		result+="<form class='authInnerForm'><input type='hidden' name='id' value='"+data.id+"'><div class='authInputWrapper col-xs-6'><input type='checkbox' name='categoryCode' value='";
		result+=authCategoryList[i].categoryCode+"' ";
		for (var j=0; j<authList.length; j++){
			if(authList[j].authCategoryListEntity.categoryCode==authCategoryList[i].categoryCode){
				result+=" checked='true'"
			}
		}
		result+=" class='icheck' data-checkbox='icheckbox_square-grey'>"+authCategoryList[i].categoryNameKr+"</div>";
		result+="<div class='col-xs-6'>"
		for (var k=0; k<authLevelList.length; k++){
				result+="<label class='authRadio'><input type='radio' name='levelCode"+"' value='"+authLevelList[k].levelCode+"' class='levelCode' data-radio='iradio_square-grey'";
				for (var j=0; j<authList.length; j++){
					if(authList[j].authCategoryListEntity.categoryCode==authCategoryList[i].categoryCode){
						if(authList[j].authLevelEntity.levelCode==authLevelList[k].levelCode){
							 result+="checked='true'";
						}
					}
				}
				result+=">" + authLevelList[k].levelNameKr+"</label>";	
		}
		result+="</div></form></div><br>"
	}
	
	
	
	$('.authControlModal .modal-body').html(result);
	 $('input').iCheck({
		    checkboxClass: 'icheckbox_square-grey check',
		    radioClass: 'iradio_square-grey',
		    increaseArea: '20%' // optional
		  });
	 $("#authSubmit").val(data.id);
	//권한 체크박스 컨트롤
	 //체크 활성화시 라디오버튼 중 조회 자동 선택
	 $('input[type=checkbox]').on('ifChecked', function(event){
		 $radioIdx = 1;
		 $radioCnt = 2;
		 $isChecked = false;
		 $checkedBtn = -1;
		 
		 for($radioIdx = 1; $radioIdx <= $radioCnt; ++ $radioIdx){
			 $isChecked = 
				 $(this).closest('form').find('input[type=radio][value=' + $radioIdx + ']').is(':checked');
			 if($isChecked == true){
				 $checkedBtn = $radioIdx;
				 break;
			 }
		 }

		 if($checkedBtn < 0)
			 $(this).closest('form').find('input[type=radio][value=2]').iCheck('check');
	 });
	 //체크박스 해제시 라디오버튼 해제
	 $('input[type=checkbox]').on('ifUnchecked', function(event){
		 $(this).iCheck('uncheck');
		 $(this).closest('form').find('input[type=radio]').iCheck('uncheck');
	 });
	 
	 $('input[type=radio]').on('ifChecked', function(event){
		 $(this).checked = true;
		 $(this).closest('form').find('input[type=checkbox]').iCheck('check');
	 });
}



//authSubmit 클릭시
$('#authSubmit').click(function(){
	var submitArray = [];
	$('.authInnerForm').each(function(i, obj){
		if(this.categoryCode.checked){
		submitArray.push($(this).serializeObject());
	}
	});
	//아무것도 선택하지 않았을 때
	if(submitArray.length<=0){
		submitArray[0]={id:$(this).val()}
	}
	$.ajax({
		type:'POST',
		url : '/api/auth/put',
		contentType: "application/json; charset=utf-8",
		data : JSON.stringify(submitArray),
		async : false,
		success:function(returnValue){
			alert(getMessage('account.authCompleteMessage','권한변경이 완료되었습니다.'));
			window.location.reload();
		},
		error:function(e){
			alert('권한 변경에 실패하였습니다.');
			console.log(e);
		}
		
	});
	
	
});
$('#creat-account-submit').click(function(e){
	e.preventDefault();
	if(tryingbool){
		return false;
	}else {
		tryingbool = true;
	}
	var userPw = $("#userPw").val();
	var userPwConfirm = $("#userPw-confirm").val();

	$.ajax({
		type: "GET",
		async: false,
		url: "/api/security/rsaKey",
		dataType: "json",
		success: function (rsaObject) {
			var publicKeyModulus = rsaObject.publicKeyModulus;
			var publicKeyExponent = rsaObject.publicKeyExponent;
			var rsa = new RSAKey();
			rsa.setPublic(publicKeyModulus,publicKeyExponent);
			$("#userPw").val(rsa.encrypt($("#userPw").val()));
			$("#userPw-confirm").val(rsa.encrypt($("#userPw-confirm").val()));
		},
		error: function (e) {
			alert('error : ' + e.responseJSON.message)
			tryingbool = false;
			return false;
		}
	});
	var newAccount = JSON.stringify($(this).closest('form').serializeObject());
	$.ajax({
		type:'POST',
		url : '/api/account',
		contentType: "application/json; charset=utf-8",
		data : newAccount,
		async : false,
		success:function(returnValue){
			alert(getMessage('common.success','성공'));
			window.location.reload();
		},
		error:function(e){
			alert(e.responseJSON.message);
			console.log(e);
			$("#userPw").val(userPw);
			$("#userPw-confirm").val(userPwConfirm);
			tryingbool = false;

		}
		
	});
});

//비밀번호 재설정 및 메일전송 버튼 클릭 시
$('#createNewPasswordButton').click(function(){
	
	var isConfirmed = confirm('비밀번호가 난수생성되어 초기화 되고 해당 비밀번호는 계정의 메일주소로 전송됩니다. 진행하시겠습니까?');
	var id = $(this).data('id');
	if(isConfirmed){
		$.ajax({
			type: 'POST',
			url : '/api/account/password/put/'+id,
			contentType: "application/json; charset=utf-8",
			async : false,
			success:function(returnValue){
				alert('비밀번호 생성 및 메일전송요청이 이루어 졌습니다.');
			},
			error:function(e){
				alert('error : ' + e.responseJSON.message);
				console.log(e);
			}
		})
	}
		return false;

});
$.fn.customSerialize = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};








$('form').on('click', '.submit', function (e) {
	e.preventDefault();
	var params = $('#formModPut').serialize();
	$.ajax({
		type: 'POST',
		url : '/api/account/put',
		data:JSON.stringify($('#formModPut').serializeObject()),
		contentType: "application/json; charset=utf-8",
		async : false,
		success:function(returnValue){
			alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
			location.reload();
		},
		error:function(e){
			alert('error : '+e.responseJSON.message)
			console.log(e);
		}
	})
});




$(document).ready(function() {
	InitFunction.init();
	$('.date-picker').datepicker({
        rtl: Metronic.isRTL(),
        orientation: "left",
        autoclose: true
    });
	
	
	
//	TableEditable.init();
});