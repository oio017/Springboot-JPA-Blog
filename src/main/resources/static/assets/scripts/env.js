$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
jQuery(document).ready(function() {
    init();
    initModuleAccountStatus();
    initModuleAccountButtonEvents();
    initApiKey();
    keyButtonEventInit();
});
var envStatus;
var appleSignList;
var oTable;
var table = $('#apple-sign-list-table');
function initApiKey(){
    $.ajax({
        url:'/api/super/module/key',
        type:'GET',
        success:function(result){
            var key='';
            //최초 키생성이 되지 않았을 경우
            if(result.key=="default"){
                result = reGenerateKey();
            }
            $('#privateKey').text(result.privateKey);

            $('#privateKeyUpdateDate').text(timeFormat(result.modDate));
        },
        error:function(e){
            alert(e.responseJSON.message);
            console.log(e);
        }
    });
}
function keyButtonEventInit(){
    $("#renewKey").click(function(){
        if(confirm(getMessage("env.doYouWantToUpdateApiKey","API 키를 갱신하시겠습니까?"))){
            var result = reGenerateKey();
            $('#privateKey').text(result.privateKey);
            $('#privateKeyUpdateDate').text(timeFormat(result.modDate));
        }
    });
}
function init(){
    $.ajax({
        url:'/api/envManage/health',
        type:'GET',
        success:function(result){
            console.log(result)
            var components = result.components;
            $("#diskSpace-status").text(components["diskSpace"]["status"])
            $("#diskSpace-status").addClass(components["diskSpace"]["status"]=="UP"?" badge-success":" badge-danger")
            $("#diskSpace-total").text(convertSize(components["diskSpace"]["details"]["total"]))
            $("#diskSpace-free").text(convertSize(components["diskSpace"]["details"]["free"]))
            $("#diskSpace-threshold").text(convertSize(components["diskSpace"]["details"]["threshold"]))

            $("#db-serviceDataSource-status").text(components["db"]["components"]["serviceDataSource"]["status"])
            $("#db-serviceDataSource-status").addClass(components["db"]["components"]["serviceDataSource"]["status"]=="UP"?" badge-success":" badge-danger")
            $("#db-serviceDataSource-url").text(components["db"]["components"]["serviceDataSource"]["details"]["url"])
            $("#db-serviceDataSource-database").text(components["db"]["components"]["serviceDataSource"]["details"]["database"])
            $("#db-serviceDataSource-hello").text(components["db"]["components"]["serviceDataSource"]["details"]["result"])

            $("#db-logDataSource-status").text(components["db"]["components"]["logDataSource"]["status"])
            $("#db-logDataSource-status").addClass(components["db"]["components"]["logDataSource"]["status"]=="UP"?" badge-success":" badge-danger")
            $("#db-logDataSource-url").text(components["db"]["components"]["logDataSource"]["details"]["url"])
            $("#db-logDataSource-database").text(components["db"]["components"]["logDataSource"]["details"]["database"])
            $("#db-logDataSource-hello").text(components["db"]["components"]["logDataSource"]["details"]["result"])

            $.ajax({
                url:'/api/envManage/information',
                type:'GET',
                success:function(result){
                    console.log(result);
                    if(result.serviceDatabaseUrl!=null){
                        $('#db-serviceDataSource-url').text(result.serviceDatabaseUrl)
                    }else{
                        $('#db-serviceDataSource-url').text("N/A")
                    }
                    if(result.logDatabaseUrl!=null){
                        $('#db-logDataSource-url').text(result.logDatabaseUrl)
                    }else{
                        $('#db-logDataSource-url').text("N/A")
                    }
                    $('#db-serviceDataSource-storedSize').text(convertSize(result.serviceStoredSpace))
                    var logUrl = result.logDatabaseUrl;
                    var serviceUrl = result.serviceDatabaseUrl;

                    //CUSTOMER-1004, EVADMIN-582 오라클의 url패턴이 맞지 않아서 같은 시스템에 있는지 검사하는 부분의 오동작을 보정하기 위해 뒤에서 끊어서 접속 스키마를 제외한 부분이 일치하는지 여부를 검사해서 일치하면 같은 시스템이라고 판단
                    //만디리 url value jdbc:oracle:thin:@everspindb.corp.bankmandiri.co.id:1522/EVERSPINDB
                    var logUrlSplitBySlashArray = logUrl.split("/");
                    var serviceUrlSplitBySlashArray = serviceUrl.split("/");
                    var logJdbcWithoutSchema = logUrlSplitBySlashArray.splice(0,logUrlSplitBySlashArray.length-1).reduce((a1,a2) => a1+"/"+a2);
                    var serviceJdbcWithoutSchema = serviceUrlSplitBySlashArray.splice(0,serviceUrlSplitBySlashArray.length-1).reduce((a1,a2) => a1+"/"+a2);
                    console.log(logJdbcWithoutSchema, serviceJdbcWithoutSchema, logJdbcWithoutSchema === serviceJdbcWithoutSchema);
                    console.log(result.serviceStoredSpace, result.logSchemaStoredSpace, logJdbcWithoutSchema === serviceJdbcWithoutSchema);
                    if(logJdbcWithoutSchema===serviceJdbcWithoutSchema){
                        $('#db-logDataSource-storedSize').text(convertSize(result.logSchemaStoredSpace));
                        $('#db-serviceDataSource-storedSize').text(convertSize(result.serviceStoredSpace - result.logSchemaStoredSpace));
                    }else{
                        $('#db-logDataSource-storedSize').text(convertSize(result.logStoredSpace));
                        $('#db-serviceDataSource-storedSize').text(convertSize(result.serviceStoredSpace));
                    }


                    $('#storeDays').val(result.storeDays);
                    if(result)
                        if(result.deleteEventDate==null){
                            $("#deleteEventDate").text("N/A");
                        }else{
                            $("#deleteEventDate").text(timeFormat(result.deleteEventDate));
                        }
                    if(result.deleteResult==1){
                        $("#deleteEventResult").text("success");
                    }else if(result.deleteResult == -1 || result.deleteResult == null){
                        $("#deleteEventResult").text("N/A");
                    }else{
                        $("#deleteEventResult").text("failed");
                    }
                    // $("#deleteEventDate").text("sds")
                },
                error:function(e){
                    alert(e.responseJSON.message);
                    console.log(e);
                }
            });

        },
        error:function(e){
            alert(e.responseJSON.message);
            console.log(e);
        }
    });
    $.ajax({
        url:'/api/envManage/appleSignList',
        type:'GET',
        success:function(result){
            appleSignList = result;
            var listString = "&nbsp;";
            var listMoreThen5 = false;
            for(var i in appleSignList){
                listString += appleSignList[i].appleSignCommonName;
                listString +=", "
                if(i>4){
                    listMoreThen5 = true;
                    break;
                }
            }
            if(appleSignList.length<=0){

            }else{
                listString = listString.substr(0, listString.length -2);
            }
            if (listMoreThen5) {
                listString+="...&nbsp;"
            }else{
                listString+="&nbsp;"
            }
            console.log(listString);

            $("#signArray").html(listString);
            oTable = table.DataTable({
                dom : 'Blfrtp',
                buttons : [ ],
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
                data : appleSignList,
                columns : [ {
                    data : "appleSignCommonName"
                },null],
                "columnDefs" : [ {
                    'data' : "id",
                    'render' : function(data, type,row, meta) {
                        var result = "<div class='button-wrap'>";
                        buttons = [];
                        buttons.push("<a href='#'  class='btn btn-sm blue btn-outline sign-modify-button' style='padding : 5px; text-align: center; margin-top: -5px; margin-bottom: -5px;' data-appId='"
                            + data
                            + "'> "
                            +getMessage("common.modify","수정")
                            +"</a>");
                        buttons.push("<a href='#'  class='btn btn-sm red btn-outline sign-delete-button' style='padding : 5px; text-align: center; margin-top: -5px; margin-bottom: -5px; 'data-appId='"
                            + data
                            + "'> "
                            + getMessage("common.delete","삭제")
                            + "</a>");
                        result += buttons.join("&nbsp;&nbsp;")
                        result += "</div>"
                        return result;
                    },
                    class : 'app-button-td',
                    "searchable": false,
                    'targets' : [ 1 ]
                }],
                "dom" : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
                // scrollable
                // datatable

                "order" : [ [ 1, "desc" ] ],

            });

            oTable.on('click', '.sign-modify-button', function (e) {
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                var data = oTable.row(nRow).data();
                initSignModifyModal(data);
            });
            oTable.on('click', '.sign-delete-button', function (e) {
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                var data = oTable.row(nRow).data();
                $.ajax({
                    type: "POST",
                    url: "/api/envManage/appleSign/delete",
                    data: JSON.stringify({
                        "id": data.id
                    }),
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (returnValue) {
                        alert(getMessage('common.deleteSuccessMessage','삭제요청이 이루어 졌습니다.'));
                        location.reload();
                    },
                    error: function (e) {
                        console.log(e);
                        if(e.responseJSON.code=="ApiServerErrorException"){
                            alert(e.responseJSON.message);
                            location.reload();
                        }else{
                            alert("error : " + e.responseJSON.message);
                            location.reload();
                        }
                    }
                });
            });

        },
        error:function(e){
            alert(e.responseJSON.message);
            console.log(e);
        }
    });
    $.ajax({
            url: '/api/envManage/serviceStatus',
            type: 'GET',
            success: function (result) {
                console.log(result);
                $("#app-status").text(result.appCount);
                $("#policy-status").text(result.policyCount);
                $("#task-status").text(result.taskCount);
            },
            error: function (e) {
                alert(e.responseJSON.message);
                console.log(e);
            }
        }
    );


}

$("#submitStoreDays").click(function(){
    if(confirm(getMessage("env.manage.confirmMaessage","DB로그 및 Elastic Search 로그 보유기간을 변경하시겠습니까?" ))){
        var dto = new Object();
        // var storeDays =
        dto.storeDays=$("#storeDays").val();
        $.ajax({
            url:'/api/envManage',
            type:"POST",
            async:false,
            data:JSON.stringify(dto),
            contentType : "application/json; charset=utf-8",
            success:function(returnValue){
                alert(getMessage('common.updatedMessage','수정 완료'));
                location.reload();
            },
            error:function(e){
                if(e.responseJSON.code=="ApiServerErrorException"){
                    console.log(e)
                    alert(e.responseJSON.message);
                    location.reload();
                }else{
                    console.log(e)
                    alert("error : " + e.responseJSON.message);
                }
            }
        });
    }
});
$("#appleSignModify").click(function(){
    $("#apple-sign-list-modal").modal();
});

$("#apple-sign-modify-submit-button").click(function(){
    var updateDto = {};
    updateDto["id"] = $('#signModifyId').val();
    updateDto["appleSignCommonName"] = $('#signModifyField').val();

    $.ajax({
        url:'/api/envManage/appleSign/update',
        type:"POST",
        async:false,
        data:JSON.stringify(updateDto),
        contentType : "application/json; charset=utf-8",
        success:function(returnValue){
            alert(getMessage('common.updatedMessage','수정 완료'));
            location.reload();
        },
        error:function(e){
            if(e.responseJSON.code=="ApiServerErrorException"){
                console.log(e)
                alert(e.responseJSON.message);
                location.reload();
            }else{
                console.log(e)
                alert("error : " + e.responseJSON.message);
            }
        }
    })
});

$("#apple-sign-create-submit-button").click(function () {
    var appleCodeSignDto = {};
    appleCodeSignDto["appleSignCommonName"] = $("#appleSignInput").val();
    if(appleCodeSignDto["appleSignCommonName"].length<=0){
        alert(getMessage("common.notBeImportedItemExist", "미입력된 항목이 있습니다."));
        return;
    }
    $.ajax({
        url:'/api/envManage/appleSign',
        type:"POST",
        async:false,
        data:JSON.stringify(appleCodeSignDto),
        contentType : "application/json; charset=utf-8",
        success:function(returnValue){
            alert(getMessage('common.submitMessage','등록 완료'));
            location.reload();
        },
        error:function(e){
            if(e.responseJSON.code=="ApiServerErrorException"){
                console.log(e)
                alert(e.responseJSON.message);
                location.reload();
            }else{
                console.log(e)
                alert("error : " + e.responseJSON.message);
            }
        }
    })

});
function getFileName (contentDisposition) {
    var fileName = contentDisposition
        .split(';')
        .filter(function(ele) {
            return ele.indexOf('filename') > -1
        })
        .map(function(ele) {
            return ele
                .replace(/"/g, '')
                .split('=')[1]
        });
    return fileName[0] ? fileName[0] : null
}
var $statusDownButton =$("#status-report-download-button")
$statusDownButton.click(function(){
    var url ='/api/envManage/service-settings-report'
    $.ajax({
        url:url,
        method:"GET",
        xhrFields:{
            responseType:'arraybuffer'
        },
        beforeSend:function() {
            $statusDownButton.text("Downloading...");
            $statusDownButton.attr("disabled", "disabled");
        }
    }).done(function(data, textStatus, jqXhr){
        if(!data){
            return;
        }
        try{
            var blob = new Blob([data], { type: jqXhr.getResponseHeader('content-type') });
            var fileName = getFileName(jqXhr.getResponseHeader('content-disposition'));
            fileName = decodeURI(fileName);

            if (window.navigator.msSaveOrOpenBlob) { // IE 10+
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else { // not IE
                var link = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                link.href = url;
                link.target = '_self';
                if (fileName) link.download = fileName;
                document.body.append(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                $statusDownButton.text("Download xlsx");
                $statusDownButton.attr("disabled", null);
            }
        } catch (e){
            $statusDownButton.text("Download xlsx");
            $statusDownButton.attr("disabled", null);
            alert("error : " + e.responseJSON.message)
            console.error(e)
        }
    });
})

// $statusDownButton.click(function(){
//     var url ='/api/envManage/service-settings-report'
//     $.ajax({
//         url:url,
//         type:"GET",
//         xhrFields: { //response 데이터를 바이너리로 처리한다.
//             responseType: 'arraybuffer'
//         },
//         // contentType : "application/json; charset=utf-8",
//         beforeSend: function(){
//             console.log("rrr")
//             $statusDownButton.text("Downloading...");
//             $statusDownButton.attr("disabled", "disabled");
//         },
//         success:function(data){
//             alert(getMessage('common.submitMessage','등록 완료'));
//             var blob = new Blob([data]);
// //파일저장
//             if (navigator.msSaveBlob) {
//                 return navigator.msSaveBlob(blob, url);
//             }
//             else {
//                 var link = document.createElement('a');
//                 link.href = window.URL.createObjectURL(blob);
//                 link.download = url;
//                 link.click();
//             }
//             // location.reload();
//         },
//         error:function(e){
//             if(e.responseJSON.code=="ApiServerErrorException"){
//                 console.log(e)
//                 alert(e.responseJSON.message);
//                 location.reload();
//             }else{
//                 console.log(e)
//                 alert("error : " + e.responseJSON.message);
//             }
//         }
//     })
// })
var initSignModifyModal = function(data){

    $('#signModifyId').val(data.id);
    $('#signModifyField').val(data.appleSignCommonName);
    $('#apple-sign-modify-modal').modal();
}

var initModuleAccountStatus = function(){
    console.log("initModuleAccountStatus")
    $.ajax({
        url:'/api/envManage/module-account',
        type:"GET",
        async:false,
        contentType : "application/json; charset=utf-8",
        success:function(returnValue){
            $("#moduleStatus").text(returnValue);
        },
        error:function(e){
            console.log(e)
            alert("error : " + e.responseJSON.message);
        }
    })
}
var initModuleAccountButtonEvents = function(){
    console.log("initModuleAccountButtonEvents")
    $("#moduleAccountActivate").click(function(e){
        e.preventDefault();
        setModuleAccountStatus("Activate");
    });
    $("#moduleAccountInactivate").click(function(e){
        e.preventDefault();
        setModuleAccountStatus("Inactivate")
    });
}

var setModuleAccountStatus = function(status){
    console.log("setModuleAccountStatus")
    $.ajax({
        url:'/api/envManage/module-account/'+status,
        type:"POST",
        async:false,
        contentType : "application/json; charset=utf-8",
        success:function(returnValue){
            alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
            location.reload();
        },
        error:function(e){
            console.log(e)
            alert("error : " + e.responseJSON.message);
        }
    })
}

var reGenerateKey = function(){
    var result;
    $.ajax({
        url:'/api/super/module/key/put',
        type:"POST",
        async:false,
        contentType : "application/json; charset=utf-8",
        success:function(returnValue){
            result=returnValue;
        },
        error:function(e){
            alert(e.responseJSON.message);
            console.log(e);
        }
    });
    return result;
}









