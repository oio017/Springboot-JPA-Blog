var tryingbool = false;
var FormInputMask = function () {
    
    var handleInputMasks = function () {
        

        $("#mask_date").inputmask("d/m/y", {
            autoUnmask: true
        }); //direct mask        
        $("#mask_date1").inputmask("d/m/y", {
            "placeholder": "*"
        }); //change the placeholder
        $("#mask_date2").inputmask("d/m/y", {
            "placeholder": "dd/mm/yyyy"
        }); //multi-char placeholder
        $("#mask_phone").inputmask("mask", {
            "mask": "(999) 999-9999"
        }); //specifying fn & options
        $("#user_birth").inputmask({
            "mask": "9999-99-99",
            placeholder: "" // remove underscores from the input mask
        }); //specifying options only
        $("#user_phone").inputmask({
        	"mask": "999-9999-9999",
        	placeholder: "" // remove underscores from the input mask
        }); //specifying options only
        $("#organ_num").inputmask({
        	"mask": "999-99-99999",
        	placeholder: "" // remove underscores from the input mask
        }); //specifying options only
//        $("#organ_phone").inputmask({
//        	"mask": "9999-99999999",
//        	placeholder: "" // remove underscores from the input mask
//        }); //specifying options only
        $("#mask_number").inputmask({
            "mask": "9",
            "repeat": 10,
            "greedy": false
        }); // ~ mask "9" or mask "99" or ... mask "9999999999"
        $("#mask_decimal").inputmask('decimal', {
            rightAlignNumerics: false
        }); //disables the right alignment of the decimal input
        $("#mask_currency").inputmask('€ 999.999.999,99', {
            numericInput: true
        }); //123456  =>  € ___.__1.234,56

        $("#mask_currency2").inputmask('€ 999,999,999.99', {
            numericInput: true,
            rightAlignNumerics: false,
            greedy: false
        }); //123456  =>  € ___.__1.234,56
        $("#mask_ssn").inputmask("999-99-9999", {
            placeholder: " ",
            clearMaskOnLostFocus: true
        }); //default
    }

    var handleIPAddressInput = function () {
        $('#input_ipv4').ipAddress();
        $('#input_ipv6').ipAddress({
            v: 6
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            handleInputMasks();
            handleIPAddressInput();
        }
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        FormInputMask.init(); // init metronic core componets
    });
}



var FormWizard = function () {


    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

//            $("#country_list").select2({
//                placeholder: "Select",
//                allowClear: true,
//                formatResult: format,
//                width: 'auto', 
//                formatSelection: format,
//                escapeMarkup: function (m) {
//                    return m;
//                }
//            });

            var form = $('#form_signup');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //account
                    username: {
                        minlength: 5,
                        required: true
                    },
                    user_pw: {
                        minlength: 8,
                        required: true,
                        pwRegExp:true,
                        hasIdInPassword :true
                    },
                    re_user_pw: {
                        minlength: 5,
                        required: true,
                        equalTo: "#user_pw"
                    },
                    //profile
                    fullname: {
                        required: true
                    },
                    'user_id': {
                        required: true,
                        email: true
                    },
                    user_valid_key: {
                        required: true,
                        equalTo: "#system_valid_key"
                    },
                    gender: {
                        required: true
                    },
                    address: {
                        required: true
                    },
                    city: {
                        required: true
                    },
                    country: {
                        required: true
                    },
                    //payment
                    card_name: {
                        required: true
                    },
                    card_number: {
                        minlength: 16,
                        maxlength: 16,
                        required: true
                    },
                    card_cvc: {
                        digits: true,
                        required: true,
                        minlength: 3,
                        maxlength: 4
                    },
                    card_expiry_date: {
                        required: true
                    },
                    'checkbox1': {
                        required: true,
                        minlength: 1
                    },
                    'checkbox2': {
                        required: true,
                        minlength: 1
                    },
                    'valid_key_chk': {
                    	required: true,
                    },
                    'user_name': {
                        minlength: 2,
                        maxlength: 20,                    	
                    	required: true,
                    },
                    'user_birth': {
                    	minlength: 10,
                    	required: true,
                    },
                    'user_phone': {
                    	minlength: 1,
                    	required: true,
                    },
                    'organ_num': {
                    	minlength: 20,
                    	required: false,
                    },
                    'organ_zipcode': {
                    	minlength: 5,
                    	required: true,
                    },
                    'organ_phone': {
                    	minlength: 1,
                    	maxlength: 20,
                    	required: false,
                    },
                    'user_position': {
                    	minlength: 2,
                    	maxlength: 20,                    	
                    	required: true,
                    },
                    'organ_name': {
                    	minlength: 2,
                    	maxlength: 20,                    	
                    	required: true,
                    },
                    'organ_address0': {
                    	minlength: 5,
                    	required: true,
                    },
                    'input_id_chk': {
                    	required: true,
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    'checkbox1': {
                        required: "이용약관에 동의해주세요.",
                        minlength: jQuery.validator.format("이용약관에 동의해주세요.")
                    },
                	'checkbox2': {
                		required: "개인정보 수집 및 이용안내에 동의해주세요.",
                		minlength: jQuery.validator.format("개인정보 수집 및 이용안내에 동의해주세요.")
                	},
                    'user_id': {
                    	required: getMessage("organReg.pleaseEnterCorrectEmailMessage","정확한 이메일 주소를 입력해주세요."),
                    	minlength: jQuery.validator.format("정확한 이메일 주소를 입력해주세요."),
                    	email: getMessage("organReg.pleaseEnterCorrectEmailMessage","정확한 이메일 주소를 입력해주세요."),
                    },
                	'user_valid_key': {
                		required: "인증번호를 입력해주세요.",
                        equalTo: "인증번호가 틀립니다. 다시 확인해주세요."
                	},
                	'valid_key_chk': {
                		required: "인증번호가 맞지 않습니다. 인증번호 확인을 해주세요",
                	},
                	'user_name': {
                		required: getMessage("organReg.inputOrganName","이름을 입력해 주세요"),
                		minlength: getMessage("organReg.atLeastTwoChar","최소 두글자 이상으로 입력해주세요."),
                		maxlength: getMessage("organReg.within20Char","20 자 이내로 입력하십시오.")
                	},
                	'user_position': {
                		required: getMessage("organReg.inputPositionMessage","직책을 입력해주세요."),
                		minlength: getMessage("organReg.atLeastTwoChar","최소 두글자 이상으로 입력해주세요."),
                		maxlength: getMessage("organReg.within20Char","20 자 이내로 입력하십시오.")
                	},
                	'organ_name': {
                		required: getMessage("organReg.inputOrganNameMessage","회사명을 입력해주세요."),
                		minlength: getMessage("organReg.atLeastTwoChar","최소 두글자 이상으로 입력해주세요."),
                		maxlength: getMessage("organReg.within20Char","20 자 이내로 입력하십시오.")
                	},
                	'organ_phone': {
                		required: "회사 전화번호를 입력해주세요.",
                		minlength: "회사 전화번호를 입력해주세요.",
                		maxlength: "15자 이내로 입력해주세요",
                	},
                	'user_phone': {
                		required: getMessage("organReg.inputPhoneNumberMessage","휴대 전화번호를 입력해주세요."),
                		minlength: "입력폼에 맞게 입력해주세요.",
                	},
                	'organ_num': {
                		required: "사업자 등록번호를 입력해주세요.",
                		minlength: "입력폼에 맞게 입력해주세요.",
                	},
                	'organ_zipcode': {
                		required: "우편번호를 입력해주세요.",
                		minlength: "5자 이상 입력해주세요.",
                	},
                	'user_birth': {
                		required: "생년월일을 입력해주세요. ex)1970-01-01",
                		minlength: "입력폼에 맞게 입력해주세요. ex)1970-01-01",
                	},
                	'user_pw': {
                		required: getMessage("organReg.pleaseEnterPasswordMessage","비밀번호를 입력해주세요."),
                		pwRegExp:$('#passwordInvalidMessage').val(),
                        hasIdInPassword:getMessage("organReg.passwordCannotContainId","비밀번호는 ID를 포함할 수 없습니다.")
                	},
                	're_user_pw': {
                		required: getMessage("organReg.PleaseReEnterToConfirmPassword","비밀번호 확인을 위해 재입력해주세요."),
                		equalTo : getMessage("organReg.confirmPasswordWrongMessage","재입력한 비밀번호가 틀립니다. 확인후 다시 입력해주세요.")
                	},
                	'organ_address0': {
                		required: "회사주소를 입력해주세요.",
//                		minlength: "5자 이상으로 입력해주세요.",
                	},
                	'input_id_chk': {
                		required: getMessage("organReg.pleaseCheckIdDup","아이디 중복체크를 해주세요."),
                	}
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "checkbox1") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_payment_error1");
                    } else if (element.attr("name") == "checkbox2") { // for uniform checkboxes, insert the after the given container
                    	error.insertAfter("#form_payment_error2");
                    } else if (element.attr("name") == "input_id_chk") { // for uniform checkboxes, insert the after the given container
                    	error.insertAfter("#form_pvalid_key_chk_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "checkbox1") { // for checkboxes and radio buttons, no need to show OK icon
                        label
                            .closest('.form-group').removeClass('has-error').addClass('has-success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid') // mark the current input as valid and display OK icon
                        .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            var displayConfirm = function() {
                $('#tab4 .form-control-static', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":radio")) {
                        input = $('[name="'+$(this).attr("data-display")+'"]:checked', form);
                    }
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
//                    } else if ($(this).attr("data-display") == 'checkbox1') {
//                        var payment = [];
//                        $('[name="checkbox1"]:checked', form).each(function(){ 
//                            payment.push($(this).attr('data-title'));
//                        });
//                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            var handleTitle = function(tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                } else {
                    $('#form_wizard_1').find('.button-previous').show();
                }
                
               // alert("current : " + current + " | total : " + total);
                
                if (current >= total) {
                	//회원가입
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-previous').hide();                    
                    $('#form_wizard_1').find('.button-submit').show();
                    
                    displayConfirm();
                    
                	fn_signup();
                    
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
               // App.scrollTo($('.page-title'));
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                    
                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }
                    
                    handleTitle(tab, navigation, clickedIndex);
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, index);
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    handleTitle(tab, navigation, index);
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {
                //alert('Finished! Hope you like it :)');
            }).hide();

            //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
            $('#country_list', form).change(function () {
                form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });
        }

    };

}();

jQuery(document).ready(function() {
    FormWizard.init();
    jQuery.validator.addMethod("pwRegExp", function(value, element) {
        return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{8,100}$/.test(value);
    });
    jQuery.validator.addMethod("hasIdInPassword", function(value, element) {
        var userId = $("#user_id").val();
        var userIdEssence=""
        if(userId.indexOf("@")>-1){
            userIdEssence = userId.split("@")[0];
        }
        return this.optional(element) || userId.length==0 || !(value.toLowerCase().indexOf(userIdEssence.toLowerCase())>-1);
    });
});




function fn_valid_submit(){
	
	var user_id = $("#user_id").val();

	if(user_id == ""){
		alert("이메일 주소를 입력해주세요.")
        $("#user_id").focus();
		return false;
	}
	
	
	//ID  체크
    $.ajax({
        type:"GET",
        url:"/api/account/duplicated",
        data:{ 
        		userId:user_id
             },
        success:function(returnValue){
        	alert(getMessage("organReg.availableId","사용가능한 ID입니다."));
        	$("#input_id_chk").val("okok");
    		$("#user_id_chk").val($("#user_id").val());
        },
        error:function(e){
        	alert(e.responseJSON.message);
            console.log(e.responseJSON.message);
        }
    });
}


function fn_valid_key_chk(){
	
	var user_valid_key = $("#user_valid_key").val();
	var system_valid_key = $("#system_valid_key").val();
	
	if(user_valid_key != system_valid_key){
		alert("인증키가 일치하지 않습니다.");
		$("#user_valid_key").focus();
        return;
	}else{
		alert("이메일 인증이 확인되었습니다.");
   		document.getElementById("user_valid_key").readOnly = true;
		$("#valid_key_chk").val("ok");
		$("#user_id_chk").val($("#user_id").val());
	}
	
}

var is_re = true;

function fn_valid_reset(){
	
	document.getElementById("user_id").readOnly = false;
	document.getElementById("user_valid_key").readOnly = false;
	$("#user_id").val("");
	$("#user_id_chk").val("");
	$("#user_valid_key").val("");
	$("#valid_key_chk").val("eversafe!");
	$("#user_id").focus();
	
	if(is_re){
		is_re = false;
		fn_valid_reset();
		return;
	}
	
	is_re = true;

}

//우편번호 검색    
function fn_zip_code(){
    //load함수를 이용하여 core스크립트의 로딩이 완료된 후, 우편번호 서비스를 접속합니다.
    daum.postcode.load(function(){
        new daum.Postcode({
            oncomplete: function(data) {
            	$("#organ_zipcode").val(data.zonecode);
            	$("#organ_address0").val(data.address);
            	$("#organ_address1").val(data.buildingName);
            }
        }).open();
    });
}



function fn_signup(){
    if(tryingbool){
        return false;
    }else {
        tryingbool = true;
    }
        var userIp = '';
        var userId = $("#user_id").val();
        var userPw = $("#user_pw").val();
        var newPasswordConfirm = $("#re_user_pw").val();
        var userName = $("#user_name").val();
        var userBirth = $("#user_birth").val();
        var userPhone = $("#user_phone").val();
        var isSmsNotice_receive = 0;
        var isSmsEvent_receive = 0;
        var isEmailEvent_receive = 0;
        var userPosition = $("#user_position").val();

        var organName = $("#organ_name").val();
        var organNum = $("#organ_num").val();
        var organZipcode = $("#organ_zipcode").val();
        var organAddress = $("#organ_address0").val() +"|"+ $("#organ_address1").val();
        var organPhone = $("#organ_phone").val();

        var status = 1;
        var organStatus = 1;


        //rsa 암호화
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
                userPw=rsa.encrypt(userPw)
                newPasswordConfirm=rsa.encrypt(newPasswordConfirm);
                $.ajax({
                    type:"POST",
                    url : "/api/account",
                    contentType : "application/json; charset=utf-8",
                    async: false,
                    data:JSON.stringify({
                        organName : organName,
                        organZipcode : organZipcode,
                        organNum : organNum,
                        organAddress : organAddress,
                        organPhone : organPhone,
                        userId : userId,
                        userPw : userPw,
                        userName : userName,
                        userPhone : userPhone,
                        userBirth : userBirth,
                        userPosition : userPosition,
                        newPasswordConfirm : newPasswordConfirm
                    }),
                    success:function(returnValue){

                    },
                    error:function(e){
                        alert('회원가입에 실패하였습니다. \n cause : ' + e.responseJSON.message);
                        tryingbool = false;
                        console.log(e.responseText);
                    }
                });
            },
            error: function (e) {
                alert('error : ' + e.responseJSON.message);
                tryingbool = false;
            }
        });
}


function pwSearch(){
	var user_id = $("#user_id").val();

	$.ajax({
	    type:"POST",
	    url : "/MemberModule",
	    data:{ mType : "select", mKind : "pwSearch", user_id : user_id },
	    success:function(returnValue){
	    	
			if(returnValue.trim() != ""){
				var data = JSON.parse(returnValue);
				
				$.ajax({
				    type:"POST",
				    url : "/MemberModule",
				    data:{ mType : "select", mKind : "pwEmail", user_id : user_id },
				    success:function(returnValue){
				    	//alert(returnValue);
				    	if(returnValue.trim() != ""){
					    	alert("메일발송이 완료되었습니다.");
				    	}else{
					    	alert("errCode(209)");
					    }
				    },
				    error:function(e){
				        console.log(e.responseText);
				    }
				});				
				
		    	
	    	}else{
		    	alert("입력한 내용과 일치하는 정보가 없습니다.\n가입시 입력하신 정보와 동일한 정보를 입력해주세요.");
		    }
	    },
	    error:function(e){
	        console.log(e.responseText);
	    }
	});
	
}




function login(){
	
	var url="/MemberModule";
	var user_id = $("#user_id").val();
	var user_pw = $("#user_pw").val();

	if(user_id == ""){
		alert("id를 입력해주세요");
		$("#user_id").focus();
		return;
	}
	if(user_pw == ""){
		alert("password를 입력해주세요");
		$("#user_pw").focus();
		return;
	}
	
	$.ajax({
		type:"POST",
		url:url,
		data:{ 	mType : "select", 
				mKind : "login",
			 	user_id : user_id, 
				user_pw : user_pw 
			 },
		success:function(returnValue){
			//alert(returnValue);
			if(returnValue == ""){
				alert("아이디와 패스워드를 다시 확인해주세요.");
				return;
			}
			var data = JSON.parse(returnValue);
			
			if (data[0].status == 1 ){
				alert("회원 가입 후 에버스핀 담당자가 승인해야 접속할수 있습니다. \n 관리자에게 문의 하시기 바랍니다.");
				return;
			}
			
			// 공지사항 Cookie 및 팝업
			$.ajax({
				type:"POST",
				url:"/CommonModule",
				data:{ 
					mType : "notice_select",
					mKind : "new",
					ldate : ldate
				},
				success:function(returnValue){
					//alert(returnValue);
					var notice_modal = 0;
					if (returnValue.trim() != ""){
						var table_data = JSON.parse(returnValue);

						notice_modal = 1;
					}
					
					go_login_ok(notice_modal);
				},
				error:function(e){
					console.log(e.responseText);
				}
			});
			
			//1:1문의 답변 Cookie
			$.ajax({
				type:"POST",
				url:"/QuestionModule",
				data:{ 
					mType : "list"
				},
				success:function(returnValue){
					if (returnValue.trim() != ""){
						var table_data = JSON.parse(returnValue);
					}
				},
				error:function(e){
					console.log(e.responseText);
				}
			});
		},
		error:function(e){
			console.log(e.responseText);
		}
	});

}


function fn_go_signup(){
	
	var form = document.createElement("form");
	form.setAttribute("action", "signup.jsp");
	form.setAttribute("method", "post");

	form.submit();
}

function fn_pw_search(){
	
	var form = document.createElement("form");
	form.setAttribute("action", "pw_search.jsp");
	form.setAttribute("method", "post");

	form.submit();
}


function go_login_ok(notice_modal){
	
	var form = document.createElement("form");
	form.setAttribute("action", "../main/dashboard.jsp");
	form.setAttribute("method", "post");

	var hiddenField1 = document.createElement("input");
	hiddenField1.setAttribute("type", "hidden");
	hiddenField1.setAttribute("name", "notice_modal");
	hiddenField1.setAttribute("value", notice_modal);
	form.appendChild(hiddenField1);
	
	document.body.appendChild(form);
	form.submit();
}

