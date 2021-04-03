$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/datatables/datatables.min.js"></script>')
$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/datatables/Buttons-1.6.5/js/dataTables.buttons.js"></script>')
$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/datatables/Select-1.2.0/js/dataTables.select.js"></script>')
$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/datatables/Responsive-2.2.6/js/dataTables.responsive.min.js"></script>')
$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>')
$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/autocomplete/jquery.autocomplete.js"></script>')
$('#scriptDiv')
    .append(
        '<script type="text/javascript" src="/assets/global/plugins/autocomplete/jquery.autocomplete.js"></script>')

var table = $('#condition-table');
var oTable;
var vTable;
var menuBooleanMap;
var hasAccountWriteAccess = $("#hasAccountWriteAccess").val() == true;
var isSuper = ($('#isSuper').val() == 'true');

var InitFunction = function () {
    return {
        table: function () {
            var mainTable = function () {
                // table에 datatable적용
                $
                    .ajax({
                        type: 'GET',
                        url: '/api/super/elasticFilterCondition',
                        success: function (returnValue) {
                            oTable = table
                                .DataTable({
                                    dom: 'Blfrtp',

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
                                    "pageLength": 20,
                                    data: returnValue,
                                    columns: [{data: "useFilter"}, {data: "keyName"}, {data: "conditionKey"}, {data: "conditionValue"}, {data: "conditionMemo"}, null],
                                    "columnDefs": [
                                        {
                                            'render': function (data, type, row, meta) {
                                                var result = "";
                                                if (data == 0) {
//																result ='<input type="checkbox" class="make-switch useFilter" name="useFilter" data-on-text="on" data-off-text="off" data-on-color="primary" data-off-color="primary" id="useFilter" value="'+  data+'" readonly="readonly"/>' 
                                                    result = 'off'
                                                } else {
//																result ='<input type="checkbox" class="make-switch useFilter" name="useFilter" data-on-text="on" data-off-text="off" data-on-color="primary" data-off-color="primary" id="useFilter" value="'+  data+'" checked readonly="readonly"/>'
                                                    result = 'on'
                                                }
                                                return result;
                                            },
                                            'targets': [0],
                                            searchable: true
                                        }, {
                                            'render': function (data, type, row, meta) {

                                                var result = "";
// result ='<input type="text"
// class="'+meta.settings.aoColumns[meta.col].data+'"
// name="'+meta.settings.aoColumns[meta.col].data+'" data-on-text="on"
// data-off-text="off" data-on-color="primary" data-off-color="primary"
// id="'+meta.settings.aoColumns[meta.col].data+'" value="'+ data+'"/>'
                                                result = '<textarea class="' + meta.settings.aoColumns[meta.col].data + '" name="' + meta.settings.aoColumns[meta.col].data + '" data-on-text="on" data-off-text="off" data-on-color="primary" data-off-color="primary" id="' + meta.settings.aoColumns[meta.col].data + '" value="">' + data + '</textarea>';
// return result;
                                                return data;
                                            },
                                            'targets': [1, 2, 3],
                                            searchable: true
                                        },
                                        {
                                            'render': function (data, type,
                                                                row, meta) {
                                                result = "<dev class='button-wrap'>";
                                                buttons = []
                                                buttons.push("<button class='btn btn-sm green btn-outline condition-mod-button'>"
                                                    + getMessage('common.modify', '수정')
                                                    + "</button>");
                                                buttons.push("<button class='btn btn-sm red btn-outline condition-delete-button'>"
                                                    + getMessage('common.remove', '삭제')
                                                    + "</button>");
                                                result += buttons.join("&nbsp;&nbsp;")
                                                return result;
                                            },
                                            'visible' : hasAccountWriteAccess,
                                            'targets': [5]
                                        }
                                    ],
                                    "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal
                                    // scrollable
                                    // datatable

                                    "order": [[0, "desc"]],
                                    initComplete: function () {
                                        $('#condition-table .useFilter').bootstrapSwitch();
                                        $('#condition-table .useFilter').on('switchChange.bootstrapSwitch',
                                            function (event, state) {
                                                if (state) {
                                                    $(this).val('1');
                                                } else {
                                                    $(this).val('0');
                                                }
                                            });
                                    }

                                });
                        },
                        error: function (e) {
                            alert(e.responseJSON.message)
                        }

                    });
                // hide search box with special css class
            }
            return {
                // main function to initiate the module
                init: function () {
                    mainTable();
                }
            };
        },
        modalInit: function () {
            // 상세(수정)버튼 클릭 시
            table
                .on('click', '.condition-mod-button', function (e) {
                    e.preventDefault();
                    var nRow = $(this).parents('tr')[0];
                    var data = oTable.row(nRow).data();
                    $('#condition-detail-modal').modal('show');
                    $('#condition-detail-modal').on('hidden.bs.modal',
                        function (e) {
                            $('#condition-option-submit').off();
                            $('#condition-mod-table .useFilter').off('switchChange.bootstrapSwitch');
                        });
                    keys = Object.keys(data);
                    for (var i in keys) {
                        if (keys[i] == 'useFilter') {
                            $('#condition-mod-table #' + keys[i]).val(data[keys[i]]);
                            $('#condition-mod-table #' + keys[i]).bootstrapSwitch('state', data[keys[i]] == 0 ? false : true);
                        } else {
                            $('#condition-mod-table #' + keys[i]).val(data[keys[i]]);
                        }
                    }
                    $('#condition-mod-table .useFilter').on('switchChange.bootstrapSwitch',
                        function (event, state) {
                            if (state) {
                                $(this).val('1');
                            } else {
                                $(this).val('0');
                            }
                        });
                    $('#condition-mod-submit')
                        .click(
                            function (e) {
                                $('#condition-mod-submit').off
                                e.preventDefault();
                                var conditionEntity = $(
                                    '#condition-mod-form')
                                    .serializeJSON(
                                        {
                                            checkboxUncheckedValue: "0"
                                        });

                                $
                                    .ajax({
                                        type: 'POST',
                                        url: '/api/super/elasticFilterCondition/put',
                                        contentType: "application/json; charset=utf-8",
                                        data: JSON
                                            .stringify(conditionEntity),
                                        async: false,
                                        success: function (returnValue) {
                                            alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
                                            location
                                                .reload();
                                        },
                                        error: function (e) {
                                            alert(e.responseJSON.message);
                                            console
                                                .log(e.responseJSON.message);
                                        }
                                    });
                                /*
                                 * Get the row as a parent
                                 * of the link that was
                                 * clicked on
                                 */
                                // 패키지 정보 할당
                                // TODO internationalization
                            });
                });

            table
                .on(
                    'click',
                    '.condition-delete-button',
                    function (e) {
                        e.preventDefault();
                        if (!confirm("조건을 삭제 하시겠습니까")) {
                            return false;
                        }
                        var AppVersionList = [];
                        var nRow = $(this).parents('tr')[0];
                        var data = oTable.row(nRow).data();
                        $
                            .ajax({
                                type: 'POST',
                                url: '/api/super/elasticFilterCondition/delete',
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({
                                    id: data.id
                                }),
                                async: false,
                                success: function (returnValue) {
                                    alert('조건이 삭제되었습니다.');
                                    location.reload();
                                },
                                error: function (e) {
                                    alert(e.responseJSON.message);
                                }

                            });

                    });
            $('#condition-detail-modal').on('hidden.bs.modal', function (e) {
                $('#condition-mod-submit').off();
            });

        },
        init: function () {
            this.initDaterange;

            // this.initCreateTable()
            this.table().init();
            this.modalInit();
        }
    }

}();
var initConfig = function () {
    $.ajax({
        type: 'GET',
        url: '/api/super/elasticFilterConfig',
        async: true,
        success: function (returnValue) {

            if (returnValue == null || returnValue == undefined) {
                $('#elastic-config-form .make-switch').bootstrapSwitch();

            } else {
                keys = Object.keys(returnValue);
                for (var i in keys) {
                    if (keys[i] == 'id') {
                        $('#elastic-config-form #id').val(returnValue.id);
                    } else {
                        $('#elastic-config-form #' + keys[i]).bootstrapSwitch(
                            'state', returnValue[keys[i]] == 1 ? true : false);
                        $('#elastic-config-form #' + keys[i]).val(
                            returnValue[keys[i]] == 1 ? '1' : '0');
                    }
                }
            }
            $('#elastic-config-form .make-switch').on('switchChange.bootstrapSwitch',
                function (event, state) {
                    if (state) {
                        $(this).val('1');
                        if ($(this).attr('id') == 'useFilter') {
                            $('#isLogAuth').bootstrapSwitch('readonly', false);
                            $('#isLogTrying').bootstrapSwitch('readonly', false);
                            $('#isLogSubmit').bootstrapSwitch('readonly', false);
                            $('#isLogVerify').bootstrapSwitch('readonly', false);
                        }
                    } else {
                        $(this).val('0');
                        if ($(this).attr('id') == 'useFilter') {
                            $('#isLogAuth').bootstrapSwitch('readonly', true);
                            $('#isLogTrying').bootstrapSwitch('readonly', true);
                            $('#isLogSubmit').bootstrapSwitch('readonly', true);
                            $('#isLogVerify').bootstrapSwitch('readonly', true);
                        }
                    }
                });

        },
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
}
var modalInit = function () {

    $('#es-config-submit').click(function (e) {
        var configEntity = $(
            '#elastic-config-form')
            .serializeJSON(
                {
                    checkboxUncheckedValue: "0"
                });

        $
            .ajax({
                type: 'POST',
                url: '/api/super/elasticFilterConfig/put',
                contentType: "application/json; charset=utf-8",
                data: JSON
                    .stringify(configEntity),
                async: false,
                success: function (returnValue) {
                    alert(getMessage('common.infoChangedMessage','정보가 변경되었습니다.'));
                    locations
                        .reload();
                },
                error: function (e) {
                    alert(e.responseJSON.message);
                }
            });
    });
    $('#condition-create-submit').click(function (e) {
        if ($('#keyName').val() == "" || $('#conditionKey').val() == "" || $('#conditionValue').val() == "") {
            alert(getMessage("common.notBeImportedItemExist", "미입력된 항목이 있습니다."));
            return false;
        }
        var conditionEntity = $('#condition-create-form').serializeJSON(
            {
                checkboxUncheckedValue: "0"
            });
        $.ajax({
            type: 'POST',
            url: '/api/super/elasticFilterCondition',
            contentType: "application/json; charset=utf-8",
            data: JSON
                .stringify(conditionEntity),
            async: false,
            success: function (returnValue) {
                alert(getMessage('common.submitMessage','등록 완료'));
                location.reload();
            },
            error: function (e) {
                alert(e.responseJSON.message);
            }
        });
    });
}
var initCreateCondition = function () {
    $('#condition-create-form .useFilter').bootstrapSwitch();
    $('#condition-create-form .useFilter').on('switchChange.bootstrapSwitch',
        function (event, state) {
            if (state) {
                $(this).val('1');
            } else {
                $(this).val('0');
            }
        });
}
var initAutoComplete = function () {

    $.ajax({
        type: 'GET',
        url: '/api/super/elasticFilterConfig/autocomplete/keyName',
        async: false,
        success: function (returnValue) {
            autoCompleteList = returnValue;
        },
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
    $('#condition-create-table #keyName').devbridgeAutocomplete({
//		serviceUrl: '/api/super/elasticFilterConfig/autocomplete/keyName',
        minChars: 0,
        lookup: $.map(autoCompleteList, function (item) {
            return {value: item.keyName, data: item}
        }),
        paramName: "keyName", // ?tagName='user input'
        delimiter: ",",
        transformResult: function (response) {
            return response;

        },

        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            //var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');

            var re = new RegExp($.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            if (queryLowerCase == "") {
                return suggestion.value;
            }
            if (re.test(suggestion.value)) {
                return suggestion.value;
            }
            //return re.test(suggestion.value);
        },
        beforeRender: function (container) {
            return container;
        },
        onSelect: function (suggestion) {
            $('#condition-create-table #keyName').val(suggestion.data.keyName);
            $('#condition-create-table #conditionKey').val(suggestion.data.conditionKey);
        },
        noSuggestionNotice: true,
        focus: function (event, ui) {
            return false;
        }
    });

    $('#condition-create-table #keyName').keydown(function (key) {
        if (key.keyCode == 13) {
            return false;
        }
    })

    $('#condition-create-table #conditionKey').devbridgeAutocomplete({
        // serviceUrl: '/api/super/elasticFilterConfig/autocomplete/keyName',
        minChars : 0,
        lookup: $.map(autoCompleteList, function (item) {
            return {value: item.conditionKey, data: item}
        }),
//		paramName: "keyName", // ?tagName='user input'
        onSearchComplete: function (query, suggestions) {
        },
        transformResult: function (response) {
            return {
                suggestions: $.map($.parseJSON(response), function (item) {
                    return {value: item.conditionKey, data: item};
                })

            };

        },
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        onSelect: function (suggestion) {
            $('#condition-create-table #keyName').val(suggestion.data.keyName);
            $('#condition-create-table #conditionKey').val(suggestion.data.conditionKey);
        },

    });
    $('#condition-mod-table #keyName').devbridgeAutocomplete({
//		serviceUrl: '/api/super/elasticFilterConfig/autocomplete/keyName',
        minChars: 0,
        lookup: $.map(autoCompleteList, function (item) {
            return {value: item.keyName, data: item}
        }),
        paramName: "keyName", // ?tagName='user input'
        delimiter: ",",
        transformResult: function (response) {
            return response;

        },

        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp($.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            if (queryLowerCase == "") {
                return suggestion.value;
            }
            if (re.test(suggestion.value)) {
                return suggestion.value;
            }
            //return re.test(suggestion.value);
        },
        beforeRender: function (container) {
            return container;
        },
        onSelect: function (suggestion) {
            $('#condition-mod-table #keyName').val(suggestion.data.keyName);
            $('#condition-mod-table #conditionKey').val(suggestion.data.conditionKey);
        },
        noSuggestionNotice: true,
        zIndex: 20000
    });

    $('#condition-mod-table #keyName').keydown(function (key) {
        if (key.keyCode == 13) {
            return false;
        }
    })

    $('#condition-mod-table #conditionKey').devbridgeAutocomplete({
        // serviceUrl: '/api/super/elasticFilterConfig/autocomplete/keyName',
        minChars : 0,
        lookup: $.map(autoCompleteList, function (item) {
            return {value: item.conditionKey, data: item}
        }),
//		paramName: "keyName", // ?tagName='user input'
        onSearchComplete: function (query, suggestions) {
        },
        transformResult: function (response) {
            return {
                suggestions: $.map($.parseJSON(response), function (item) {
                    return {value: item.conditionKey, data: item};
                })

            };

        },
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        onSelect: function (suggestion) {
            $('#condition-mod-table #keyName').val(suggestion.data.keyName);
            $('#condition-mod-table #conditionKey').val(suggestion.data.conditionKey);
        },
        zIndex: 20000

    });
}
var getStrongCount = function (text) {
    var results = text.match(/\/strong/g);
    if (results != null) {
        return results.length;
    } else {
        return 0;
    }
}
$(document).ready(function () {
    // Metronic.init();
    initConfig();
    initCreateCondition();
    initAutoComplete();
    InitFunction.init();
    modalInit();

});