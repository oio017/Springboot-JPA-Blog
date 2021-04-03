$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>')
$('#scriptDiv').append('<script type="text/javascript" src="/assets/global/plugins/jquery.form.min.js"></script>')

var size =0;
var basicSize =0;
var maxNum=0;
var initAdditionalInfo = function(){
    $.ajax({
        type : "GET",
        url : "/api/wrapping/additionalInfo/iOS",
        async : false,
        success : function(returnValue) {
            // $("#count").attr("min",0);
            $("#count").attr("max",returnValue.numberOfDynamicModules);
            $("#BasicModuleVersion").text(" "+returnValue.basicModuleVersion);
            $("#dynamicModuleVersion").text(" "+returnValue.dynamicModuleVersion);
            $("#dynamicModuleCount").text(" "+returnValue.numberOfDynamicModules);
            maxNum=returnValue.numberOfDynamicModules;
            size = returnValue.fileSize;
            basicSize = returnValue.basicModuleSize;
            $("#dynamicModuleSize").text(" "+getMessage("common.about","About")+" "+  size+" KB");
            $("#basicModuleSize").text(" "+getMessage("common.about","About")+" "+  basicSize+" KB");
            $("#additionalFileSize").text(getMessage("common.about","About")+" "+  size+" KB" )

        },
        error: function(e){
            console.log(e)
        }
    })
}

var initEvents = function(){
    $("#file").change(function(e) {
        var name = e.target.files[0].name
        switch(name.substring(name.lastIndexOf('.') + 1).toLowerCase()){
            case 'zip':
                break;
            default:
                $(this).val('');
                // error message here
                alert(getMessage("obfuscation.chooseMessage.zip", "zip 파일을 선택해 주세요."));
                break;
        }
    });
    $(".moduleTypeRadio").change(function(e) {
        console.log($(this).val())
        if($(this).val()==0){
            $("#count").val(0);
            $("#count").attr('readonly',true);
        }else if($(this).val()==1){
            $("#count").val(1);
            $("#count").attr('min',1);
            $("#count").attr('readonly',false);
        }
        changeSize($(this).val())
    });
    $("#count").change(function(){
        $(this).val(changeSize($(this).val()));
    })
    $("#count").keyup(function(){
        $(this).val(changeSize($(this).val()));
    })
    $("#count").click(function(){
        $(this).val(changeSize($(this).val()));
    })


}
var changeSize = function(count){
    if(count>maxNum){
        return maxNum;
    }
    var result = count*size;
    if(result>1024){
        result = result/1024;
        $(additionalFileSize).text(getMessage("common.about","About")+ " " + result.toFixed(2) + " MB");
    }else{
        $(additionalFileSize).text(getMessage("common.about","About")+ " " + result + " KB");
    }
    return count;
}

var initClickEvent = function(){
    $('#submitd').click(function(e){
        $('#filesForm').submit();
    });


    $('#setting-modal-button').click(function(e) {
        e.preventDefault();
        $('#setting-modal').modal('show');
    });
}

var initUpload = function (){
    $('#filesForm').ajaxForm({
        target: '#output',
        url: '/api/upload/wrapping',
        beforeSubmit: function () {
            $('.toBeHidden').addClass('hidden');
            operating = true;
            if($('#count').val()>maxNum){
                $('#count').val(maxNum);
                return;
            }
            if($('#file').val()==""){
                alert(getMessage('wrapping.zipIsRequired','zip file은 필수 선택 요소입니다.'));
                return false;
            }
            if($(':radio[name="isInternalModule"]:checked').val()==""||$(':radio[name="isInternalModule"]:checked').val()==undefined){
                alert(getMessage('wrapping.moduleTypeIsRequired','모듈 방식은 필수 선택 요소 입니다.'));
                return false;
            }
            if($('#count').val()==""||$('#count').val()==undefined){
                alert(getMessage('wrapping.numberOfModulesIsRequired','내장 모듈 개수는 필수 입력 요소 입니다.'));
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
            console.log(response);
            $('#loader-wrapper').addClass("hidden");
            $('#processing-file').addClass("hidden");
            $('#error-label').removeClass("hidden");
            operating = false;
            alert(response.responseJSON.message);


        },
        success: function (response, status, e) {
            $('#done-label').removeClass('hidden');

        },

        complete: function (xhr) {
            // console.log("complete")
            // console.log(xhr)
            // console.log(xhr.statusText)
            // console.log(xhr.statusText)
            $('#loader-wrapper').addClass("hidden");
            $('#processing-file').addClass("hidden");
            operating = false;
            if (xhr.status>=200&&xhr.status<300)
            {
                alert(getMessage("common.successMessage","요청이 성공적으로 이루어졌습니다.") );
                // $("#outputImage").html(xhr.statusText);
                location.href="/wrapping/wrappingList";
            }
            else{
                alert(e.responseJSON.message);
                console.log(xhr)
                $("#outputImage").show();
                $("#outputImage").html("<div class='error'>Problem in uploading file.</div>");
                $("#progressBar").stop();
            }
        }
    });
}
jQuery(document).ready(function() {
    initAdditionalInfo();
    initEvents();
    initClickEvent();
    initUpload();
//   FormDropzone();
});

