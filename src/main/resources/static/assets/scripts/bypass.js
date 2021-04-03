$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')
$(document).ready(function() {

    initConditionSubmit();
    initCondition();
    initAndroidTable();
    initAndroidEvent();

    initIosTable();
    initIosEvent();
    checkboxEventInit();
    $(document).ready(function(){
        $('[data-toggle="popover"]').popover();
    });
});
var androidTable;
var iosTable;

var initCondition = function(){
    $.ajax({
        type:'GET',
        url:'/api/super/bypass/config',
        async : true,
        success : function(returnValue){
            console.log(returnValue)
            if(returnValue.isBypassTokenAllowed==1){
                console.log(returnValue.isBypassTokenAllowed==1)
                $('#isBypassTokenAllowed').bootstrapSwitch('state',true);
                $('#isBypassTokenAllowed').val("1");
            }else{
                console.log(returnValue.isBypassTokenAllowed==1)
                $('#isBypassTokenAllowed').bootstrapSwitch('state',false);
                $('#isBypassTokenAllowed').val("0");
            }
            if(returnValue.bypassTokenVerificationFailed==1){
                console.log(returnValue.bypassTokenVerificationFailed==1)
                $('#bypassTokenVerificationFailed').bootstrapSwitch('state',true);
                $('#bypassTokenVerificationFailed').val("1");
            }else{
                console.log(returnValue.bypassTokenVerificationFailed==1)
                $('#bypassTokenVerificationFailed').bootstrapSwitch('state',false);
                $('#bypassTokenVerificationFailed').val("0")
            }
            if(returnValue.bypassTokenOtpOn==1){
                console.log(returnValue.bypassTokenOtpOn==1)
                $('#bypassTokenOtpOn').bootstrapSwitch('state',true);
                $('#bypassTokenOtpOn').val("1");
            }else{
                console.log(returnValue.bypassTokenOtpOn==1)
                $('#bypassTokenOtpOn').bootstrapSwitch('state',false);
                $('#bypassTokenOtpOn').val("0");
            }
            $('.make-switch').on('switchChange.bootstrapSwitch', function(event, state) {
                if(state){
                    $(this).val('1');
                } else{
                    $(this).val=('0');
                }
            });
            $("#contentType").val(returnValue.contentType)
            $("#blockHttpResponseCode").val(returnValue.blockHttpResponseCode)


            $("#mod-whetherToPassWhenBlocked" + returnValue.whetherToPassWhenBlocked).prop("checked", true);




            $("#bypassBlockMessage").text(returnValue.bypassBlockMessage)
        },
        error:function(e){
            alert(e.responseJSON.message);
        }
    });

}
var initAndroidEvent = function(){
    $('#android-submit').on('click', function(e){
        e.preventDefault();
        if(!confirm(getMessage("bypass.policySubmitWarningMessage", "Bypass 토큰 허용여부가 차단일 경우 바이패스 정책을 등록해도 동작하지 않습니다. \n확인 하셨습니까?"))){
            return false;
        }
        androidPolicySubmit();
    })
    $('#android-edit-submit').on('click', function(e){
        e.preventDefault();
        if(!confirm(getMessage("bypass.policySubmitWarningMessage", "Bypass 토큰 허용여부가 차단일 경우 바이패스 정책을 등록해도 동작하지 않습니다. \n확인 하셨습니까?"))){
            return false;
        }
        androidPolicyEditSubmit();//TODO
    })


}


var initIosEvent = function(){
    $('#ios-submit').on('click', function(e){
        e.preventDefault();
        if(!confirm(getMessage("bypass.policySubmitWarningMessage", "Bypass 토큰 허용여부가 차단일 경우 바이패스 정책을 등록해도 동작하지 않습니다. \n확인 하셨습니까?"))){
            return false;
        }
        iosPolicySubmit();
    })
    $('#ios-edit-submit').on('click', function(e){
        e.preventDefault();
        if(!confirm(getMessage("bypass.policySubmitWarningMessage", "Bypass 토큰 허용여부가 차단일 경우 바이패스 정책을 등록해도 동작하지 않습니다. \n확인 하셨습니까?"))){
            return false;
        }
        iosPolicyEditSubmit();//TODO
    })
}

var checkboxEventInit = function(){
    $(".all-checkbox").on("change", function(e){
        var $this = $(this);
        var $input = $this.closest("div").children("input:text");
        if($(this).is(":checked")){
            $input.val("*")
            $input.attr("readonly", true);
        }else{
            $input.val("")
            $input.attr("readonly", false);
        }
    })
}




var initConditionSubmit = function(){
    $("#policy-option-submit").on("click", function (e) {
        if(!confirm(getMessage("bypass.policyConditionWarningMessage", "바이패스 정책이 존재하는 경우 바이패스 허용여부가 허용이면 안됩니다. \n확인하셨습니까? "))){
            return false;
        }
        var config = $('#bypass-policy-form').serializeJSON({checkboxUncheckedValue: "0"});
        Metronic.startPageLoading();
        $.ajax({
            type:'POST',
            url:'/api/super/bypass/config/put',
            contentType : "application/json; charset=utf-8",
            async : true,
            data : JSON.stringify(config),
            success : function(returnValue){
                Metronic.stopPageLoading();
                alert(getMessage('common.updatedMessage','수정 완료'));
                location.reload();
            },
            error:function(e){
                Metronic.stopPageLoading();
                var alertMessage = "";
                if(undefined!=e.responseJSON.fieldError){
                    var errors = e.responseJSON.fieldError;
                    for(var i in errors){
                        alertMessage += errors[i].defaultMessage;
                        alertMessage += "\n";
                    }
                }else{
                    alertMessage = e.responseJSON.message
                }
                console.log(e)
                alert(alertMessage);
            }
        })

    });
}
var androidPolicySubmit = function(){

    var policy = $('#android-div').serializeJSON();
    console.log(policy)
    Metronic.startPageLoading();
    $.ajax({
        type:'POST',
        url:'/api/super/bypass/policy/android',
        contentType : "application/json; charset=utf-8",
        async : true,
        data : JSON.stringify(policy),
        success : function(returnValue){
            Metronic.stopPageLoading();
            alert(getMessage('common.submitMessage','등록 완료'));
            location.reload();
        },
        error:function(e){
            Metronic.stopPageLoading();
            var alertMessage = "";
            if(undefined!=e.responseJSON.fieldError){
                var errors = e.responseJSON.fieldError;
                for(var i in errors){
                    alertMessage += errors[i].defaultMessage;
                    alertMessage += "\n";
                }
            }else{
                alertMessage = e.responseJSON.message
            }
            console.log(e)
            alert(alertMessage);
        }
    })
}

var iosPolicySubmit = function(){

    var policy = $('#ios-div').serializeJSON();
    console.log(policy)
    Metronic.startPageLoading();
    $.ajax({
        type:'POST',
        url:'/api/super/bypass/policy/ios',
        contentType : "application/json; charset=utf-8",
        async : true,
        data : JSON.stringify(policy),
        success : function(returnValue){
            Metronic.stopPageLoading();
            alert(getMessage('common.submitMessage','등록 완료'));
            location.reload();
        },
        error:function(e){
            Metronic.stopPageLoading();
            var alertMessage = "";
            if(undefined!=e.responseJSON.fieldError){
                var errors = e.responseJSON.fieldError;
                for(var i in errors){
                    alertMessage += errors[i].defaultMessage;
                    alertMessage += "\n";
                }
            }else{
                alertMessage = e.responseJSON.message
            }
            console.log(e)
            alert(alertMessage);
        }
    })
}

var androidPolicyEditSubmit = function(){

    var policy = $('#android-edit-div').serializeJSON();
    console.log(policy)
    Metronic.startPageLoading();
    $.ajax({
        type:'POST',
        url:'/api/super/bypass/policy/android/put',
        contentType : "application/json; charset=utf-8",
        async : true,
        data : JSON.stringify(policy),
        success : function(returnValue){
            Metronic.stopPageLoading();
            alert(getMessage('common.updatedMessage','수정 완료'));
            location.reload();
        },
        error:function(e){
            Metronic.stopPageLoading();
            var alertMessage = "";
            if(undefined!=e.responseJSON.fieldError){
                var errors = e.responseJSON.fieldError;
                for(var i in errors){
                    alertMessage += errors[i].defaultMessage;
                    alertMessage += "\n";
                }
            }else{
                alertMessage = e.responseJSON.message
            }
            console.log(e)
            alert(alertMessage);
        }
    })
}

var iosPolicyEditSubmit = function(){

    var policy = $('#ios-edit-div').serializeJSON();
    console.log(policy)
    Metronic.startPageLoading();
    $.ajax({
        type:'POST',
        url:'/api/super/bypass/policy/ios/put',
        contentType : "application/json; charset=utf-8",
        async : true,
        data : JSON.stringify(policy),
        success : function(returnValue){
            Metronic.stopPageLoading();
            alert(getMessage('common.updatedMessage','수정 완료'));
            location.reload();
        },
        error:function(e){
            Metronic.stopPageLoading();
            var alertMessage = "";
            if(undefined!=e.responseJSON.fieldError){
                var errors = e.responseJSON.fieldError;
                for(var i in errors){
                    alertMessage += errors[i].defaultMessage;
                    alertMessage += "\n";
                }
            }else{
                alertMessage = e.responseJSON.message
            }
            console.log(e)
            alert(alertMessage);
        }
    })
}

var initAndroidTable = function(){
    $.ajax({
        type:'GET',
        url:'/api/super/bypass/policy/android',
        async : true,
        success : function(returnValue){
            console.log(returnValue)
            androidTable=$("#android-table").DataTable({
                dom : 'Blfrtp',
                buttons : [  ],
                "autoWidth" : false,
                "pageLength" : -1,
                data : returnValue,
                columns : [
                    {data : "index"},
                    null,
                    null,
                    {data : "architecture"},
                    {data : "percent"},
                    null,

                ],
                "columnDefs" : [{
                    'data' : function(row, type, val, meta ){
                        return row.minOsVersion+" ~ "+row.maxOsVersion;
                    }
                    ,'targets' : [ "tbl-os-version" ],
                },{
                    'data' : function(row, type, val, meta ){
                        return row.minLibVersion+" ~ "+row.maxLibVersion;
                    },'targets' : [ "tbl-lib-version" ],
                },

                    {
                        'render' : function(data, type, row, meta) {
                            var result = "<dev class='button-wrap'>";
                            var buttons = []

                            buttons.push("<button class='btn btn-sm blue edit-button'>"+getMessage('common.edit','수정')+"</button>");
                            buttons.push("<button class='btn btn-sm red delete-button'>"+getMessage('common.delete','삭제')+"</button>");

                            result += buttons.join("&nbsp;&nbsp;")
                            return result;
                        },
                        'targets' : [ "tbl-action" ]
                    },{
                        'render' : function(data, type, row, meta) {
                            if("null"==data){
                                return "N/A";
                            }else{
                                return data;
                            }
                        },
                        'targets' : [ "tbl-arch" ]
                    },{

                        'orderable' : false,
                        'targets' : [ 1,2,3,4,5  ],
                    }
                ],
                dom:"tir",
                // "dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
                // scrollable
                // datatable

                "order" : [ [ 0, "asc" ] ],
                "drawCallback": function( settings ) {
                    console.log("drawCallback")

                },
                initComplete: function () {
                    console.log($(this));
                    console.log("initComplete")
                },

            })

        },
        error:function(e){
            alert(e.responseJSON.message);
        },
        complete : function(){
            //수정 버튼 클릭
            androidTable.on('click','.edit-button', function(e){
                e.preventDefault();
                var nRow = $(this).parents("tr")[0];
                setAndroidModalValues(androidTable.row(nRow).data());
            })
            //삭제 버튼 클릭
            androidTable.on('click','.delete-button', function(e){
                e.preventDefault();
                if(androidTable.data().length==1){
                    if(!confirm(getMessage("bypass.policyDeleteWarningMessage", "정책이 하나도 없는 경우 Bypass 토큰 허용 여부는 차단이어야 합니다. \n확인하셨습니까? "))){
                        return false;
                    }
                }else{
                    if(confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))){

                    }else{
                        return false;
                    }
                }
                var nRow = $(this).parents("tr")[0];
                deletePolicy(androidTable.row(nRow).data().id);
            })
        }
    });
}

var initIosTable = function(){
    $.ajax({
        type:'GET',
        url:'/api/super/bypass/policy/ios',
        async : true,
        success : function(returnValue){
            console.log(returnValue)
            iosTable=$("#ios-table").DataTable({
                dom : 'Blfrtp',
                buttons : [  ],
                "autoWidth" : false,
                "pageLength" : -1,
                data : returnValue,
                columns : [
                    {data : "index"},
                    null,
                    null,
                    {data : "percent"},
                    null

                ],
                "columnDefs" : [{
                    'data' : function(row, type, val, meta ){
                        return row.minOsVersion+" ~ "+row.maxOsVersion;
                    }
                    ,'targets' : [ "tbl-os-version" ],
                },{
                    'data' : function(row, type, val, meta ){
                        return row.minLibVersion+" ~ "+row.maxLibVersion;
                    },'targets' : [ "tbl-lib-version" ],
                },

                    {
                        'render' : function(data, type, row, meta) {
                            var result = "<dev class='button-wrap'>";
                            var buttons = []

                            buttons.push("<button class='btn btn-sm blue edit-button'>"+getMessage('common.edit','수정')+"</button>");
                            buttons.push("<button class='btn btn-sm red delete-button'>"+getMessage('common.delete','삭제')+"</button>");

                            result += buttons.join("&nbsp;&nbsp;")
                            return result;
                        },
                        'targets' : [ "tbl-action" ]
                    },{

                        'orderable' : false,
                        'targets' : [ 1,2,3,4  ],
                    }
                ],
                dom:"tir",
                // "dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
                // scrollable
                // datatable

                "order" : [ [ 0, "asc" ] ],
                "drawCallback": function( settings ) {
                    console.log("drawCallback")

                },
                initComplete: function () {
                    console.log($(this));
                    console.log("initComplete")
                },

            })

        },
        error:function(e){
            alert(e.responseJSON.message);
        },
        complete : function(){
            //수정 버튼 클릭
            iosTable.on('click','.edit-button', function(e){
                e.preventDefault();
                var nRow = $(this).parents("tr")[0];
                setIosModalValues(iosTable.row(nRow).data());
            })
            //삭제 버튼 클릭
            iosTable.on('click','.delete-button', function(e){
                e.preventDefault();
                if(iosTable.data().length==1){
                    if(!confirm(getMessage("bypass.policyDeleteWarningMessage", "정책이 하나도 없는 경우 Bypass 토큰 허용 여부는 차단이어야 합니다. \n확인하셨습니까? "))){
                        return false;
                    }
                }else{
                    if(confirm(getMessage('common.removeConfirmMessage','삭제하시겠습니까'))){

                    }else{
                        return false;
                    }
                }
                var nRow = $(this).parents("tr")[0];
                deletePolicy(iosTable.row(nRow).data().id);
            })
        }
    });
}

var deletePolicy = function(id){
    console.log(id)
    console.log("/api/super/bypass/policy/delete/'+id")
    Metronic.startPageLoading();
    $.ajax({
        type:'POST',
        url:'/api/super/bypass/policy/delete/'+id,
        contentType : "application/json; charset=utf-8",
        async : true,
        success : function(returnValue){
            Metronic.stopPageLoading();
            alert(getMessage('common.removeComplete','삭제 완료'));
            location.reload();
        },
        error:function(e){
            Metronic.stopPageLoading();
            var alertMessage = "";
            if(undefined!=e.responseJSON.fieldError){
                var errors = e.responseJSON.fieldError;
                for(var i in errors){
                    alertMessage += errors[i].defaultMessage;
                    alertMessage += "\n";
                }
            }else{
                alertMessage = e.responseJSON.message
            }
            console.log(e)
            alert(alertMessage);
        }
    })
}

var setAndroidModalValues = function(data){
    $("#android-modal input:checkbox").prop("checked", false);
    $("#android-modal input:text").val("");
    // $("#android-modal input:text").val("");
    $("#android-modal .all-checkbox").change();
    // $("#android-modal input").val();


    //각 값을 input 필드에 할당
    $("#android-modal #minOsVersion").val(data.minOsVersion);

    if (data.minOsVersion == "*") {//*인지 확인 후 *이면 check 후 변화 이벤트 발생
        $("#android-modal #minOsCheck").prop("checked", true);
        $("#android-modal #minOsCheck").change();
    }
    $("#android-modal #maxOsVersion").val(data.maxOsVersion);
    if (data.maxOsVersion == "*") {
        $("#android-modal #maxOsCheck").prop("checked", true);
        $("#android-modal #maxOsCheck").change();
    }
    $("#android-modal #minLibVersion").val(data.minLibVersion);
    if (data.minLibVersion == "*") {
        $("#android-modal #minLibCheck").prop("checked", true);
        $("#android-modal #minLibCheck").change();
    }
    $("#android-modal #maxLibVersion").val(data.maxLibVersion);
    if (data.maxLibVersion == "*") {
        $("#android-modal #maxLibCheck").prop("checked", true);
        $("#android-modal #maxLibCheck").change();
    }
    $("#android-modal #percent").val(data.percent);
    $("#android-modal #index").val(data.index);
    $("#android-modal #id").val(data.id);
    $("#android-modal #platform").val("android");
    var architectureList = JSON.parse(data.architecture);
    console.log(architectureList)
    for (var i in architectureList) {
        if(architectureList[i]=="32"){
            $("#android-modal #arch32").prop("checked", true);
        }
        if(architectureList[i]=="64"){
            $("#android-modal #arch64").prop("checked", true);
        }
        if(architectureList[i]=="x86"){
            $("#android-modal #archX86").prop("checked", true);
        }
    }
    $("#android-modal").modal();
}

var setIosModalValues = function(data){
    console.log(data)
    $("#ios-modal input:checkbox").prop("checked", false);
    $("#ios-modal input:text").val("");
    // $("#ios-modal input:text").val("");
    $("#ios-modal .all-checkbox").change();
    // $("#ios-modal input").val();


    //각 값을 input 필드에 할당
    $("#ios-modal #minOsVersion").val(data.minOsVersion);

    if (data.minOsVersion == "*") {//*인지 확인 후 *이면 check 후 변화 이벤트 발생
        $("#ios-modal #minOsCheck").prop("checked", true);
        $("#ios-modal #minOsCheck").change();
    }
    $("#ios-modal #maxOsVersion").val(data.maxOsVersion);
    if (data.maxOsVersion == "*") {
        $("#ios-modal #maxOsCheck").prop("checked", true);
        $("#ios-modal #maxOsCheck").change();
    }
    $("#ios-modal #minLibVersion").val(data.minLibVersion);
    if (data.minLibVersion == "*") {
        $("#ios-modal #minLibCheck").prop("checked", true);
        $("#ios-modal #minLibCheck").change();
    }
    $("#ios-modal #maxLibVersion").val(data.maxLibVersion);
    if (data.maxLibVersion == "*") {
        $("#ios-modal #maxLibCheck").prop("checked", true);
        $("#ios-modal #maxLibCheck").change();
    }
    $("#ios-modal #percent").val(data.percent);
    $("#ios-modal #index").val(data.index);
    $("#ios-modal #id").val(data.id);
    $("#ios-modal #platform").val("ios");
    $("#ios-modal").modal();
}