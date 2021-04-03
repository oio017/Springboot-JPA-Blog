var $scriptDiv = $('#scriptDiv');

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')

$scriptDiv.append('<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')

var oTable;
var table = $('#server-stored-list-table');
var packageList;



$(document).ready(function () {
    makeTable();
    init();
});
function init(){
    //추가 버튼 클릭시 모달 출력
    $("#new-android-path-button").click(function(e){
        e.preventDefault()
        $('#new-remote-package-modal').modal('show');
    })
    //제출 버튼 클릭시 제출
    $("#new-package-list-submit").click(function(e){
        e.preventDefault()
        var inputPackageArray = $('#keywordListInput').val().split("\n")

        $.ajax({
            type : "POST",
            url : "/api/super/remotePreventPackage/getDuplicatedList",
            data: JSON.stringify(inputPackageArray),
            async : false,
            contentType : "application/json; charset=utf-8",
            success : function(returnValue) {
                //중복된 값이 있으면 Confirm창 띄움
                if(returnValue.length>0){
                    var message = getMessage("remote.duplicatedConfirmMessage", "아래 항목이 중복됩니다.\n계속 진행하시면 중복되는값은 제외하고 추가됩니다.\n");
                    for(var i in returnValue){
                        message += returnValue[i] + "\n";
                    }
                    if(confirm(message)){
                    }else{
                        //
                        return false;
                    };
                }
                $.ajax({
                    type : "POST",
                    url : "/api/super/remotePreventPackage/list",
                    data: JSON.stringify(inputPackageArray),
                    async : false,
                    contentType : "application/json; charset=utf-8",
                    success : function(returnValue) {
                        alert(getMessage('common.success','성공'));
                        window.location.reload();
                    },
                    error : function(e) {
                        alert("error : " + e.responseJSON.message);
                    }
                });
                console.log("1 success 3")
            },
            error : function(e) {
                console.log(e);
                alert("error : " + e.responseJSON.message);
            },
            beforeSend:function(xhr ){
                document.getElementById("submit-loading").style=null
                // $("#submit-loading").show()
            },complete : function(){
                $("#submit-loading").hide();
            },
        });
    })

    //삭제 버튼 클릭시 삭제
    oTable.on('click', '.delete-button', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var data = oTable.row(nRow).data();
        if (confirm(getMessage('common.deleteConfirmMessage','삭제시 복구할 수 없습니다. 그래도 진행하시겠습니까?')) == false) {
            return false;
        }
        $.ajax({
            type : "POST",
            url : "/api/super/remotePreventPackage/delete/"+data.id,
            async : false,
            contentType : "application/json; charset=utf-8",
            success : function(returnValue) {
                var hasError = false;
                var message =getMessage('exceptFile.submitIsDoneButServerError', '처리가 완료되었으나 다음의 Eversafe_server에서 에러 발생, 서버상태 확인 필요 - 보안모드 메뉴 참조') + '\n';
                for(var i in returnValue){
                    if(returnValue[i]==false){
                        hasError = true;
                        message += i + '\n';
                    }else{
                    }
                }
                if(hasError){
                    alert(message);
                }else{
                    alert(getMessage('common.removeComplete','삭제 완료'));
                }
                location.reload();
            },
            error : function(e) {
                console.log(e);
                alert("error : " + e.responseJSON.message);
            }
        });
    });

}
function makeTable() {
    $.ajax({
        url:'/api/super/remotePreventPackage',
        type:"GET",
        async:false,
        contentType : "application/json; charset=utf-8",
        success:function(returnValue){
            packageList = returnValue;
            oTable = table
                .DataTable({
                    destroy: true,
                    buttons: [],
                    "autoWidth": false,
                    "lengthMenu": [
                        [10, 15, 20, 50, 100, -1],
                        [10, 15, 20, 50, 100,
                            "All"] // change
                        // per page
                        // values
                        // here
                    ],
                    "pageLength": -1,
                    data: returnValue,
                    aaSorting: [],
                    columns: [],
                    "columnDefs": [
                        {
                            'data' :function(row, type, val, meta) {
                                return row.packageName;
                            },
                            'targets' : [ 0 ]
                        },
                        {
                            render : function( data, type, row, meta) {
                                return '<button class="delete-button btn red btn-outline">'+getMessage('common.remove','삭제')+'</button>';
                            },
                            targets: [1]
                        }
                    ],
                    dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>"
                        + "<'row'<'col-sm-12'tr>>"
                        + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                });
        },
        error:function(e){
            alert(e.responseJSON.message);
            console.log(e);
        }
    });

}
