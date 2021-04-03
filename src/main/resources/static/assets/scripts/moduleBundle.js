$scriptDiv = $('#scriptDiv');
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/jquery.form.min.js"></script>')
var table = $('#bundle-table');
var oTable;
$(document).ready(function () {
    initTable();
   initEvents();
    initUpload();
});
var operating = false;
var initEvents = function(){
    $("#bundleFile").change(function(e) {

        var name = e.target.files[0].name
        switch(name.substring(name.lastIndexOf('.') + 1).toLowerCase()){
            case 'zip':
                break;
            default:
                $(this).val('');
                // error message here
                alert(getMessage("common.uploadRequired.zip", "zip 파일을 선택해 주세요."));
                return
                break;
        }
//	   if(name.lastIndexOf(".")!=name.indexOf(".")){
//		   $(this).val('');
//		   alert("파일명에 .(dot)은 포함될 수 없습니다.");
//	   };
//	   if(name.includes(" ")){
//		   $(this).val('');
//		   alert("파일명에 공백은 포함될 수 없습니다.");
//	   };
    });

    $('#submit').click(function(e){
        e.preventDefault();
        $('#filesForm').submit();
    //     // Get form
    //     var form = $('#filesForm')[0];
    //     console.log($('#filesForm'))
    //     console.log(form)
    //     // Create an FormData object
    //     var data = new FormData(form);
    //     console.log(data)
    //     //TO-DO validation
    //     if(data.get("bundleFile").name==""){
    //         alert(getMessage("common.requiredFile","파일은 필수 항목 입니다."));
    //         return;
    //     }
    //     $.ajax({
    //         type: "POST",
    //         enctype: 'multipart/form-data',
    //         url: "/api/upload/bundleFile",
    //         data: data,
    //         processData: false,
    //         contentType: false,
    //         cache: false,
    //         async : false,
    //         timeout: 600000,
    //         success: function (data) {
    //             alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
    //             location.href="/super/module/bundle"
    //         },
    //         error: function (e) {
    //             alert(e.responseJSON.message);
    //
    //         }
    //     });
    //
    });
}
var initTable = function(){
    $.ajax({
        type : "GET",
        url : "/api/super/bundle",
        async : false,
        success : function(returnValue) {
            makeTable(returnValue);

        }
    })
}
var initUpload = function (){
    $('#filesForm').ajaxForm({

        target: '#output',
        url: '/api/upload/bundleFile',
        beforeSubmit: function () {
            $('.toBeHidden').addClass('hidden');
            operating = true;
            if($('#bundleFile').val()==""){
                alert(getMessage('wrapping.zipIsRequired','zip file은 필수 선택 요소입니다.'));
                return false;
            }
            $("#outputImage").hide();
            if($("#uploadImage").val() == "") {
                $("#outputImage").show();
                $("#outputImage").html("<div class='error'>Choose a file to upload.</div>");
                return false;
            }
            $("#progressDivId").css("display", "block");
            var percentValue = '0%';

            $('#progressBar').width(percentValue);
            $('#percent').html(percentValue);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            // console.log("uploadProgress")
            // console.log(event)
            // console.log(position)
            // console.log(total)
            // console.log(percentComplete)
            var percentValue = percentComplete + '%';
            $("#percent").text(percentValue);
            $("#progressBar").css("width",percentValue);
            if(percentComplete==100){
                $('#upload-done').removeClass("hidden")
                $('#processing-file').removeClass("hidden")
                $('#loader-wrapper').removeClass("hidden")
            }
        },
        error: function (response, status, e) {
            $('#loader-wrapper').addClass("hidden");
            $('#processing-file').addClass("hidden");
            $('#error-label').removeClass("hidden");

            operating = false;
            // alert(response.responseJSON.message);
            // initTable();
        },
        success: function (response, status, e) {
            $('#done-label').removeClass('hidden');

        },
        complete: function (xhr) {
            $('#loader-wrapper').addClass("hidden");
            $('#processing-file').addClass("hidden");

            // console.log("complete")
            // console.log(xhr)
            // console.log(xhr.statusText)
            // console.log(xhr.statusText)
            operating = false;
            if (xhr.status>=200&&xhr.status<300)
            {

                alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
                location.href="/super/module/bundle";
            }
            else{
                alert(xhr.responseJSON.message);
                // console.log(xhr)
                $("#outputImage").show();
                $("#outputImage").html("<div class='error'>Problem in uploading file.</div>");
                $("#progressBar").stop();
            }
            initTable();
        }
    });
}
var makeTable = function (returnValue){
    // console.log(returnValue)
    oTable = table
        .DataTable({
            destroy : true,
            buttons : [],
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
            columns : [
                {data : "id"},
                {data : "deviceType"},
                {data : "moduleType"},
                {data : "version"},
                null,
                {data : "count"},
                null,
                null,
                null,
                null
            ],
            "columnDefs" : [
                {
                    'data' :function(row, type, val, meta) {
                        var result = '';
                        if(row.fileName==null){
                            result = "N/A"
                        }else{
                            if(row.isFileDeleted==0){
                                result = '<a href="/api/super/bundle/file/'+row.id+'">'+ row.fileName+'</a>'
                            }else{
                                result=row.fileName;
                            }
                        }

                        return result;
                    },
                    'targets' : [ 4 ]
                },
                {
                    'data' :function(row, type, val, meta) {
                        var result = '';
                        var status = row.status;
                        result = getFileResultMessageByCode(status);
                        return result;
                    },
                    'render' : function(data, type, row, meta) {
                        var content = "";
                        if(row.status <0){
                            content="<p class='red'>"
                        }else{
                            content="<p class='blue'>"
                        }
                        content+=data+"</p>"
                        return content;
                    },
                    'targets' : [ 6 ]
                },
                {
                    'data' :function(row, type, val, meta) {
                        return timeFormat(row.regDate);
                    },

                    'targets' : [ 7 ]
                },{
                    'data' :function(row, type, val, meta) {
                        if(row.delDate==null){
                            return "N/A"
                        }else{
                            return timeFormat(row.delDate);
                        }
                    },

                    'targets' : [ 8 ]
                },{
                    'data' :function(row, type, val, meta) {
                        return row.active;
                    },
                    'targets' : [ 2 ]
                },{
                    'render' : function(data, type, row, meta) {
                        content = "";
                            if(row.isFileDeleted==0){
                                content += '<button class="bundle-file-delete-button btn btn-sm blue btn-outline">'+getMessage("app.fileDelete","파일 삭제")+'</button>';
                            }else{
                            }
                                content += '<button class="bundle-delete-button btn btn-sm red btn-outline">'+getMessage("common.delete","삭제")+'</button>';
                        return content;
                    },
                    targets : [ 9 ],
                },

            ],
            "order" : [ [ 0, "desc" ] ],
            dom : "<'row'<'col-sm-6'l><'col-sm-6'f>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",	});

    table.on("click",".bundle-file-delete-button", function(e){
        e.preventDefault();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        console.log(data)
        $.ajax({
            type : 'POST',
            url : '/api/super/bundle/'+data.id+'/file/delete',
            contentType : "application/json; charset=utf-8",
            data : JSON.stringify(data),
            async : false,
            success : function(returnValue) {
                alert(getMessage('common.removeComplete','삭제 완료'));
                location.reload();
                // vTable.row(nRow).remove().draw();
            },
            error : function(e) {
                console.log(e)
                if(e.responseJSON.exception=="java.io.FileNotFoundException"){
                    alert(getMessage('log.osForgeryDetails.fileNotFound','파일 없음'));
                }else{
                    alert(e.responseJSON.message);
                }
            }
        });
    });
    table.on("click",".bundle-delete-button", function(e){
        e.preventDefault();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        $.ajax({
            type : 'POST',
            url : '/api/super/bundle/'+data.id+'/delete',
            contentType : "application/json; charset=utf-8",
            data : JSON.stringify(data),
            async : false,
            success : function(returnValue) {
                alert(getMessage('common.removeComplete','삭제 완료'));
                location.reload();
                // vTable.row(nRow).remove().draw();
            },
            error : function(e) {
                console.log(e)
                if(e.responseJSON.exception=="java.io.FileNotFoundException"){
                    alert(getMessage('log.osForgeryDetails.fileNotFound','파일 없음'));
                }else{
                    alert(e.responseJSON.message);
                }
            }
        });

    })
}

//onBeforeUnload 이벤트 지정
$(window).bind('beforeunload', function(){
    if(operating)
        return getMessage('','모듈 업로드중입니다. 페이지를 벗어나면 에러가 발생할 수 있습니다.');
    //확인 창을 띄우지 않으려면 아무 내용도 Return 하지 마세요!! (Null조차도)
});


