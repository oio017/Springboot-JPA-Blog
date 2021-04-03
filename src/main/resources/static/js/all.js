var isSuperAdmin;
var isEverspin;
var organIdAndNames;
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
	  if ( options.dataType == 'script' || originalOptions.dataType == 'script' ) {
	      options.cache = true;
	  }
	});
var lang = getCookie("language");
function initDatePicker(id) {
			if (!jQuery().daterangepicker) {
				return;
			}

			$('#'+id)
					.daterangepicker(
							{
								"ranges" : {
									'오늘' : [ moment(), moment() ],
									'어제' : [ moment().subtract('days', 1),
											moment().subtract('days', 1) ],
									'최근 7일' : [ moment().subtract('days', 7),
											moment() ],
									'최근 14일' : [ moment().subtract('days', 14),
											moment() ],
									'이번 달' : [ moment().startOf('month'),
											moment().endOf('month') ],
									'저번 달' : [
											moment().subtract('month', 1)
													.startOf('month'),
											moment().subtract('month', 1)
													.endOf('month') ]
								},
								"locale" : {
									"format" : "YYYY-MM-DD",
									"separator" : " - ",
									"applyLabel" : "적용",
									"cancelLabel" : "취소",
									"fromLabel" : "From",
									"toLabel" : "To",
									"customRangeLabel" : "날자선택",
									"daysOfWeek" : [ "일", "월", "화", "수", "목",
											"금", "토" ],
									"monthNames" : [ "1월", "2월", "3월", "4월",
											"5월", "6월", "7월", "8월", "9월",
											"10월", "11월", "12월" ],
									"firstDay" : 1
								},
								// "startDate": "11/08/2015",
								// "endDate": "11/14/2015",
							},
							function(start, end, label) {
								alert("2");
								start_date = start
										.format('YYYY-MM-DD HH:mm:ss');
								end_date = end.format('YYYY-MM-DD HH:mm:ss');

								$('#'+id+' span').html(
										start.format('YYYY-MM-DD') + ' - '
												+ end.format('YYYY-MM-DD'));

								// fn_application_list();
							});

			start_date = moment().subtract('days', 1).format(
					'YYYY-MM-DD HH:mm:ss');
			end_date = moment().format('YYYY-MM-DD HH:mm:ss');

			$('#'+id+' span').html(
					moment().subtract('days', 1).format('YYYY-MM-DD') + ' - '
							+ moment().format('YYYY-MM-DD'));
			$('#'+id+' span').show();
			
			
		}

function hideElements(){
	$('.hideElement').hide();
}

//form내용을 JSON오브젝트로 변환
$.fn.serializeObject = function()
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

/////////////////////////

/*!
SerializeJSON jQuery plugin.
https://github.com/marioizquierdo/jquery.serializeJSON
version 2.7.2 (Dec, 2015)

Copyright (c) 2012, 2015 Mario Izquierdo
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*/
(function (factory) {
if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
  define(['jquery'], factory);
} else if (typeof exports === 'object') { // Node/CommonJS
  var jQuery = require('jquery');
  module.exports = factory(jQuery);
} else { // Browser globals (zepto supported)
  factory(window.jQuery || window.Zepto || window.$); // Zepto supported on browsers as well
}

}(function ($) {
"use strict";

// jQuery('form').serializeJSON()
$.fn.serializeJSON = function (options) {
  var f, $form, opts, formAsArray, serializedObject, name, value, _obj, nameWithNoType, type, keys;
  f = $.serializeJSON;
  $form = this; // NOTE: the set of matched elements is most likely a form, but it could also be a group of inputs
  opts = f.setupOpts(options); // calculate values for options {parseNumbers, parseBoolens, parseNulls, ...} with defaults

  // Use native `serializeArray` function to get an array of {name, value} objects.
  formAsArray = $form.serializeArray();
  f.readCheckboxUncheckedValues(formAsArray, opts, $form); // add objects to the array from unchecked checkboxes if needed

  // Convert the formAsArray into a serializedObject with nested keys
  serializedObject = {};
  $.each(formAsArray, function (i, obj) {
    name  = obj.name; // original input name
    value = obj.value; // input value
    _obj = f.extractTypeAndNameWithNoType(name);
    nameWithNoType = _obj.nameWithNoType; // input name with no type (i.e. "foo:string" => "foo")
    type = _obj.type; // type defined from the input name in :type colon notation
    if (!type) type = f.tryToFindTypeFromDataAttr(name, $form); // type defined in the data-value-type attr
    f.validateType(name, type, opts); // make sure that the type is one of the valid types if defined

    if (type !== 'skip') { // ignore elements with type 'skip'
      keys = f.splitInputNameIntoKeysArray(nameWithNoType);
      value = f.parseValue(value, name, type, opts); // convert to string, number, boolean, null or customType
      f.deepSet(serializedObject, keys, value, opts);
    }
  });
  return serializedObject;
};

// Use $.serializeJSON as namespace for the auxiliar functions
// and to define defaults
$.serializeJSON = {

  defaultOptions: {
    checkboxUncheckedValue: undefined, // to include that value for unchecked checkboxes (instead of ignoring them)

    parseNumbers: false, // convert values like "1", "-2.33" to 1, -2.33
    parseBooleans: false, // convert "true", "false" to true, false
    parseNulls: false, // convert "null" to null
    parseAll: false, // all of the above
    parseWithFunction: null, // to use custom parser, a function like: function(val){ return parsed_val; }

    customTypes: {}, // override defaultTypes
    defaultTypes: {
      "string":  function(str) { return String(str); },
      "number":  function(str) { return Number(str); },
      "boolean": function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1; },
      "null":    function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1 ? str : null; },
      "array":   function(str) { return JSON.parse(str); },
      "object":  function(str) { return JSON.parse(str); },
      "auto":    function(str) { return $.serializeJSON.parseValue(str, null, null, {parseNumbers: true, parseBooleans: true, parseNulls: true}); }, // try again with something like "parseAll"
      "skip":    null // skip is a special type that makes it easy to ignore elements
    },

    useIntKeysAsArrayIndex: false // name="foo[2]" value="v" => {foo: [null, null, "v"]}, instead of {foo: ["2": "v"]}
  },

  // Merge option defaults into the options
  setupOpts: function(options) {
    var opt, validOpts, defaultOptions, optWithDefault, parseAll, f;
    f = $.serializeJSON;

    if (options == null) { options = {}; }   // options ||= {}
    defaultOptions = f.defaultOptions || {}; // defaultOptions

    // Make sure that the user didn't misspell an option
    validOpts = ['checkboxUncheckedValue', 'parseNumbers', 'parseBooleans', 'parseNulls', 'parseAll', 'parseWithFunction', 'customTypes', 'defaultTypes', 'useIntKeysAsArrayIndex']; // re-define because the user may override the defaultOptions
    for (opt in options) {
      if (validOpts.indexOf(opt) === -1) {
        throw new  Error("serializeJSON ERROR: invalid option '" + opt + "'. Please use one of " + validOpts.join(', '));
      }
    }

    // Helper to get the default value for this option if none is specified by the user
    optWithDefault = function(key) { return (options[key] !== false) && (options[key] !== '') && (options[key] || defaultOptions[key]); };

    // Return computed options (opts to be used in the rest of the script)
    parseAll = optWithDefault('parseAll');
    return {
      checkboxUncheckedValue:    optWithDefault('checkboxUncheckedValue'),

      parseNumbers:  parseAll || optWithDefault('parseNumbers'),
      parseBooleans: parseAll || optWithDefault('parseBooleans'),
      parseNulls:    parseAll || optWithDefault('parseNulls'),
      parseWithFunction:         optWithDefault('parseWithFunction'),

      typeFunctions: $.extend({}, optWithDefault('defaultTypes'), optWithDefault('customTypes')),

      useIntKeysAsArrayIndex: optWithDefault('useIntKeysAsArrayIndex')
    };
  },

  // Given a string, apply the type or the relevant "parse" options, to return the parsed value
  parseValue: function(valStr, inputName, type, opts) {
    var f, parsedVal;
    f = $.serializeJSON;
    parsedVal = valStr; // if no parsing is needed, the returned value will be the same

    if (opts.typeFunctions && type && opts.typeFunctions[type]) { // use a type if available
      parsedVal = opts.typeFunctions[type](valStr);
    } else if (opts.parseNumbers  && f.isNumeric(valStr)) { // auto: number
      parsedVal = Number(valStr);
    } else if (opts.parseBooleans && (valStr === "true" || valStr === "false")) { // auto: boolean
      parsedVal = (valStr === "true");
    } else if (opts.parseNulls    && valStr == "null") { // auto: null
      parsedVal = null;
    }
    if (opts.parseWithFunction && !type) { // custom parse function (apply after previous parsing options, but not if there's a specific type)
      parsedVal = opts.parseWithFunction(parsedVal, inputName);
    }

    return parsedVal;
  },

  isObject:          function(obj) { return obj === Object(obj); }, // is it an Object?
  isUndefined:       function(obj) { return obj === void 0; }, // safe check for undefined values
  isValidArrayIndex: function(val) { return /^[0-9]+$/.test(String(val)); }, // 1,2,3,4 ... are valid array indexes
  isNumeric:         function(obj) { return obj - parseFloat(obj) >= 0; }, // taken from jQuery.isNumeric implementation. Not using jQuery.isNumeric to support old jQuery and Zepto versions

  optionKeys: function(obj) { if (Object.keys) { return Object.keys(obj); } else { var key, keys = []; for(key in obj){ keys.push(key); } return keys;} }, // polyfill Object.keys to get option keys in IE<9


  // Fill the formAsArray object with values for the unchecked checkbox inputs,
  // using the same format as the jquery.serializeArray function.
  // The value of the unchecked values is determined from the opts.checkboxUncheckedValue
  // and/or the data-unchecked-value attribute of the inputs.
  readCheckboxUncheckedValues: function (formAsArray, opts, $form) {
    var selector, $uncheckedCheckboxes, $el, dataUncheckedValue, f;
    if (opts == null) { opts = {}; }
    f = $.serializeJSON;

    selector = 'input[type=checkbox][name]:not(:checked):not([disabled])';
    $uncheckedCheckboxes = $form.find(selector).add($form.filter(selector));
    $uncheckedCheckboxes.each(function (i, el) {
      $el = $(el);
      dataUncheckedValue = $el.attr('data-unchecked-value');
      if(dataUncheckedValue) { // data-unchecked-value has precedence over option opts.checkboxUncheckedValue
        formAsArray.push({name: el.name, value: dataUncheckedValue});
      } else {
        if (!f.isUndefined(opts.checkboxUncheckedValue)) {
          formAsArray.push({name: el.name, value: opts.checkboxUncheckedValue});
        }
      }
    });
  },

  // Returns and object with properties {name_without_type, type} from a given name.
  // The type is null if none specified. Example:
  //   "foo"           =>  {nameWithNoType: "foo",      type:  null}
  //   "foo:boolean"   =>  {nameWithNoType: "foo",      type: "boolean"}
  //   "foo[bar]:null" =>  {nameWithNoType: "foo[bar]", type: "null"}
  extractTypeAndNameWithNoType: function(name) {
    var match;
    if (match = name.match(/(.*):([^:]+)$/)) {
      return {nameWithNoType: match[1], type: match[2]};
    } else {
      return {nameWithNoType: name, type: null};
    }
  },

  // Find an input in the $form with the same name,
  // and get the data-value-type attribute.
  // Returns nil if none found. Returns the first data-value-type found if many inputs have the same name.
  tryToFindTypeFromDataAttr: function(name, $form) {
    var escapedName, selector, $input, typeFromDataAttr;
    escapedName = name.replace(/(:|\.|\[|\]|\s)/g,'\\$1'); // every non-standard character need to be escaped by \\
    selector = '[name="' + escapedName + '"]';
    $input = $form.find(selector).add($form.filter(selector));
    typeFromDataAttr = $input.attr('data-value-type'); // NOTE: this returns only the first $input element if multiple are matched with the same name (i.e. an "array[]"). So, arrays with different element types specified through the data-value-type attr is not supported.
    return typeFromDataAttr || null;
  },

  // Raise an error if the type is not recognized.
  validateType: function(name, type, opts) {
    var validTypes, f;
    f = $.serializeJSON;
    validTypes = f.optionKeys(opts ? opts.typeFunctions : f.defaultOptions.defaultTypes);
    if (!type || validTypes.indexOf(type) !== -1) {
      return true;
    } else {
      throw new Error("serializeJSON ERROR: Invalid type " + type + " found in input name '" + name + "', please use one of " + validTypes.join(', '));
    }
  },


  // Split the input name in programatically readable keys.
  // Examples:
  // "foo"              => ['foo']
  // "[foo]"            => ['foo']
  // "foo[inn][bar]"    => ['foo', 'inn', 'bar']
  // "foo[inn[bar]]"    => ['foo', 'inn', 'bar']
  // "foo[inn][arr][0]" => ['foo', 'inn', 'arr', '0']
  // "arr[][val]"       => ['arr', '', 'val']
  splitInputNameIntoKeysArray: function(nameWithNoType) {
    var keys, f;
    f = $.serializeJSON;
    keys = nameWithNoType.split('['); // split string into array
    keys = $.map(keys, function (key) { return key.replace(/\]/g, ''); }); // remove closing brackets
    if (keys[0] === '') { keys.shift(); } // ensure no opening bracket ("[foo][inn]" should be same as "foo[inn]")
    return keys;
  },

  // Set a value in an object or array, using multiple keys to set in a nested object or array:
  //
  // deepSet(obj, ['foo'], v)               // obj['foo'] = v
  // deepSet(obj, ['foo', 'inn'], v)        // obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
  // deepSet(obj, ['foo', 'inn', '123'], v) // obj['foo']['arr']['123'] = v //
  //
  // deepSet(obj, ['0'], v)                                   // obj['0'] = v
  // deepSet(arr, ['0'], v, {useIntKeysAsArrayIndex: true})   // arr[0] = v
  // deepSet(arr, [''], v)                                    // arr.push(v)
  // deepSet(obj, ['arr', ''], v)                             // obj['arr'].push(v)
  //
  // arr = [];
  // deepSet(arr, ['', v]          // arr => [v]
  // deepSet(arr, ['', 'foo'], v)  // arr => [v, {foo: v}]
  // deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}]
  // deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}, {bar: v}]
  //
  deepSet: function (o, keys, value, opts) {
    var key, nextKey, tail, lastIdx, lastVal, f;
    if (opts == null) { opts = {}; }
    f = $.serializeJSON;
    if (f.isUndefined(o)) { throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined"); }
    if (!keys || keys.length === 0) { throw new Error("ArgumentError: param 'keys' expected to be an array with least one element"); }

    key = keys[0];

    // Only one key, then it's not a deepSet, just assign the value.
    if (keys.length === 1) {
      if (key === '') {
        o.push(value); // '' is used to push values into the array (assume o is an array)
      } else {
        o[key] = value; // other keys can be used as object keys or array indexes
      }

    // With more keys is a deepSet. Apply recursively.
    } else {
      nextKey = keys[1];

      // '' is used to push values into the array,
      // with nextKey, set the value into the same object, in object[nextKey].
      // Covers the case of ['', 'foo'] and ['', 'var'] to push the object {foo, var}, and the case of nested arrays.
      if (key === '') {
        lastIdx = o.length - 1; // asume o is array
        lastVal = o[lastIdx];
        if (f.isObject(lastVal) && (f.isUndefined(lastVal[nextKey]) || keys.length > 2)) { // if nextKey is not present in the last object element, or there are more keys to deep set
          key = lastIdx; // then set the new value in the same object element
        } else {
          key = lastIdx + 1; // otherwise, point to set the next index in the array
        }
      }

      // '' is used to push values into the array "array[]"
      if (nextKey === '') {
        if (f.isUndefined(o[key]) || !$.isArray(o[key])) {
          o[key] = []; // define (or override) as array to push values
        }
      } else {
        if (opts.useIntKeysAsArrayIndex && f.isValidArrayIndex(nextKey)) { // if 1, 2, 3 ... then use an array, where nextKey is the index
          if (f.isUndefined(o[key]) || !$.isArray(o[key])) {
            o[key] = []; // define (or override) as array, to insert values using int keys as array indexes
          }
        } else { // for anything else, use an object, where nextKey is going to be the attribute name
          if (f.isUndefined(o[key]) || !f.isObject(o[key])) {
            o[key] = {}; // define (or override) as object, to set nested properties
          }
        }
      }

      // Recursively set the inner object
      tail = keys.slice(1);
      f.deepSet(o[key], tail, value, opts);
    }
  }

};

}));

function dateFormat(data) {
	var date = new Date(data);
	var month = date.getMonth() + 1;
	var resultDate = (date.getFullYear() + "-" + (month > 9 ? month : "0" + month)
			+ "-" + (date.getDate() > 9 ? date.getDate() : "0"
			+ date.getDate()));
	var last = "<div style='display:none'>"+date.getTime()+ "</div>"
	return resultDate+last;
//	return new Date(data).toLocaleDateString();
}

function timeFormat(data) {
    if(isNaN(data)){
        return "N/A";
    }

	var date = new Date(data);
	var month = date.getMonth() + 1;
	var resultDate = (date.getFullYear() + "-" + (month > 9 ? month : "0" + month)
			+ "-" + (date.getDate() > 9 ? date.getDate() : "0"
				+ date.getDate()));
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds =  date.getSeconds();
	var last = " "+(hours>9?hours:"0"+hours)+ ":" +(minutes>9?minutes:"0"+minutes)+ ":" +(seconds>9?seconds:"0"+seconds); 
	return resultDate+last;
//	return new Date(data).toLocaleDateString();
}

function timeToLocaleString(data){
	return new Date(data).toLocaleString();
}
function myOrgId(){
	$('#organ-id-field').text($('#AccountInfo').data('organencid'));
	$('#organ-id-modal').modal();
}
jQuery(document).ready(function(){
    if($("#isUsingDashboardChartView").val()=='true'){
        $('.dashboard-popup')
        .click(
                function(e) {
                    e.preventDefault();
                    window
                    .open(
                            "/dashboard",
                            "Eversafe Dashboard",
                    "scrollbars=1, location=no, resizable=yes, menubar=no, titlebar=no, toolbar=no, width=1280, height=1024");
                });
    };
    initIsEverspin();
});
function isNumber(s) {
	  s += ''; // 문자열로 변환
	  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
	  if (s == '' || isNaN(s)) return false;
	  return true;
	}
function isInteger(s) {
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || (isNaN(s)&& !s%1===0)||s.indexOf(".")>0) return false;
    return true;
}

function initOrganIdAndNames(){
	$.ajax({
		type:'GET',
		url:'/api/organIdAndNames',
		async:false,
		success : function(returnValue){
			organIdAndNames = returnValue;
		},
		error:function(e){
			alert(e.responseJSON.message);
		}
			
	});
}
function initIsSuperAdmin(){
	if($('#AccountInfo').data('organid')==0){
		isSuperAdmin=true;
	}else{
		isSuperAdmin=false;
	}
}

function initIsEverspin(){
	if($('.dropdown-user .username').text()=="everspin@everspin.co.kr"){
		isEverspin=true;
	}else{
		isEverspin=false;
	}
	
}

//로케일에 따른 메시지 출력 함수, code로 조회시 값이 없으면 text를 반환한다.
function getMessage(code, text){
    if(lang.indexOf("_")<0){
        setCookie("language",'${defaultLanguage}'+"_"+'${defaultLocale}');
        console.log(getCookie("language"));
        location.reload();
    }
	try {
		var result = messageMap[getCookie("language")][code];
	} catch (e) {
        console.log(e)
	}
	if(result==undefined){
		console.log("fail locale code : " + code)
		return text;
	} else{
		return result;
	}
}
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}
function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + "; path=/;";
	console.log(c_value)
	document.cookie=c_name + "=" + c_value;
}

function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

var tryToGetDate = function(stuff){
    if(!stuff){
        return new Date();
    }

    if(stuff instanceof Date){
        return stuff;
    }

    if(Math.floor(stuff) == stuff && $.isNumeric(stuff))  {
        return new Date(stuff);
    }

    stuff = Date.parse(stuff);

    if(Math.floor(stuff) == stuff && $.isNumeric(stuff))  {
        return new Date(stuff);
    }

    return null;
}


var getStartDate = function(time){
    time = tryToGetDate(time);
    if(!time){
        return null;
    }
    time.setDate(time.getDate());
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);

    return time;
}


var getEndDate = function(time){
    time = tryToGetDate(time);
    if(!time){
        return null;
    }
    time.setDate(time.getDate() + 1);
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    time.setMilliseconds(time.getMilliseconds() - 1);
    return time;
}
var getTommorowStart = function(time){
    time = tryToGetDate(time);
    if(!time){
        return null;
    }
    time.setDate(time.getDate() + 1);
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    time.setMilliseconds(time.getMilliseconds());
    return time;
}

var getFormatDateString = function(date, separator){
    if(!separator){
        separator = '. ';
    }

    var year 	= date.getFullYear();
    var month 	= date.getMonth() + 1;
    var day  	= date.getDate();

    return year + separator + month + separator + day;
}


var setCurrentDateRange = function(start, end) {
//	$('#dashboard-report-range span').html(start.format('YYYY.MM.DD') + ' - '	+ end.format('YYYY.MM.DD'));
    $('#dashboard-report-range span').html(getFormatDateString(start) + ' - '	+ getFormatDateString(end));

    $('#startDate').val(start);
    $('#endDate').val(end);
}

var getDaysDifference = function(startDate, endDate){
    start = getStartDate(startDate);
    end = getStartDate(endDate);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

var isLeapYear = function(year)
{
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

var checkDateGapIfShorterThanOrEqualsToPeriod = function(start, end, period, unit){
    start = getStartDate(start);
    end = getEndDate(end);

    var yearDiff = end.getFullYear() - start.getFullYear();
    var monthDiff = (yearDiff>0)?(end.getMonth() - start.getMonth()+12):(end.getMonth() - start.getMonth());
    var dayDiff = getDaysDifference(start, end);

    var res = false;

    switch(unit){
        case 'D':{
            res = (dayDiff <= period);
            break;
        }

        case 'M':{
            res = (monthDiff < period || dayDiff <= (period * 30));
            break;
        }

        case 'Y':{
            var leapYears = 0;
            for(sy = start.getFullYear(), ey = end.getFullYear(); sy <= ey; ++ sy){
                if(isLeapYear)
                    ++ leapYears;
            }

            res = (yearDiff < period || dayDiff <= ((period * 365) + leapYears));
            break;
        }

    }
    return res;
}

var reverseParseOperator = function(list){
    if(list.length>0){
        for(index in list){
           list[index].value=rParser(list[index].value);
        }
    }else{
        list.value=rParser(list.value);
    }
}
var rParser = function(unsafe_str){
    if(unsafe_str!=undefined){
        return unsafe_str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '\"')
            .replace(/&#39;/g, '\'')
            .replace(/&#x2F;/g, '\/')
    }else{
        return unsafe_str;
    }
}


var convertSize = function(bytes){
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    if(isNaN(bytes) == true) {
        return bytes;
    } else {
        // return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

}

var setDatatableAjaxErrorHandle = function(){
    $.fn.dataTable.ext.errMode = function(e, settings, techNote, message){
        if(e.jqXHR!=null){
            if(e.jqXHR.status){
                console.log(e)
                alert(getMessage('common.hasNoAuthorityOrLoggedOut'));
            }else{
                alert('error')
            }
        }else{
            alert('error')
        }
    }
}
var setDatatableAjaxErrorHandleForModule = function(){
    $.fn.dataTable.ext.errMode = function(e, settings, techNote, message){
        console.log(e)
        if(e.jqXHR!=null){
            if(e.jqXHR.status!=200){
                if(e.jqXHR.status){
                    alert(getMessage('common.hasNoAuthorityOrLoggedOut'));
                }else{
                    alert('error')
                }
            }
        }else{
            alert('error')
        }
    }
}

//백그라운드 데몬코드에 대한 메시지 획득
var getFileResultMessageByCode = function(code){
    var result="";


    if(code==null){
        result="<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> "+getMessage("app.fileStatus.unregistered","미등록");
    }else if(code==0){
        result=getMessage("file.status.waiting","대기중");
    }else if(code==1){
        result=getMessage("file.status.finished","처리 완료");
    }else if(code==2){
        result=getMessage("file.status.operating","처리중");
    }else if(code==-1){
        result=getMessage("file.status.unknownError","알 수 없는 에러");
    }else if(code==-2){
        result=getMessage("file.status.metaInvalid","메타 정보 에러");
    }else if(code==-7){
        result=getMessage("file.status.pakageNotFound","패키지 없음");
    }else if(code==-8){
        result=getMessage("file.status.packageMismatch","패키지 불일치");
    }else if(code==-11){
        result=getMessage("file.status.inaccurateInfoList","앱 내 info.plist 정보가 부정확합니다.");
    }else if(code==-12){
        result=getMessage("file.status.failedGetDigestInfo","digest 정보를 추출하지 못함");
    }else if(code==-21){
        result=getMessage("file.status.sqlError","DB 에러");
    }else if(code==-22){
        result=getMessage("file.status.notFoundDbData","DB 데이터 없음");
    }else if(code==-23){
        result=getMessage("file.status.noFilePathInDb","업로드된 파일의 경로가 없습니다.");
    }else if(code==-24){
        result=getMessage("file.status.noPackageInDb","등록된 패키지네임이 없습니다.");//TODO
    }else if(code==-25){
        result=getMessage("file.status.noAppVersionInDb","등록된 버전이 없습니다.");//TODO
    }else if(code==-26){
        result=getMessage("file.status.noDynamicModuleInDb","앱 내 다이나믹 모듈이 목록에 존재하지 않거나 비활성화 된 상태입니다.");//TODO
    }else if(code==-41){
        result=getMessage("file.status.versionNotFound","버전 정보 없음");
    }else if(code==-42){
        result=getMessage("file.status.versionFormatInvalid","잘못된 버전 형식");
    }else if(code==-43){
        result=getMessage("file.status.versionNotFoundInDb","DB에서 버전을 가져올 수 없음");
    }else if(code==-44){
        result=getMessage("file.status.versionCodeMismatch","버전 코드 불일치");
    }else if(code==-45){
        result=getMessage("file.status.versionCodeInvalid","잘못된 버전 코드");
    }else if(code==-46){
        result=getMessage("file.status.versionCodeNotFound","버전 코드 없음");
    }else if(code==-47){
        result=getMessage("file.status.versionNameMismatch","버전명 불일치");
    }else if(code==-48){
        result=getMessage("file.status.versionNameInvalid","잘못된 버전명");
    }else if(code==-49){
        result=getMessage("file.status.versionNameNotFound","버전명 없음");
    }else if(code==-61){
        result=getMessage("file.status.fileNotFound","파일 없음");
    }else if(code==-62){
        result=getMessage("file.status.invalidFileFormat","잘못된 파일 포맷");
    }else if(code==-63){
        result=getMessage("file.status.fileCopyFailed","파일 복사 실패");
    }else if(code==-64){
        result=getMessage("file.status.fileCompressionFailed","파일 압축 실패");
    }else if(code==-65){
        result=getMessage("file.status.differentModuleCount","모듈 개수가 다릅니다.");//TODO
    }else if(code==-66){
        result=getMessage("file.status.moduleNotExist","번들 내 모듈이 존재하지 않습니다.");//TODO
    }else if(code==-67){
        result=getMessage("file.status.baseapkNotExist","base.apk 가 존재하지 않습니다.");//TODO
    }else if(code==-68){
        result=getMessage("file.status.arm64v8aNotExist","config.arm64_v8a.apk 가 존재하지 않습니다.");//TODO
    }else if(code==-69){
        result=getMessage("file.status.extractFileFailed","파일의 압축 해제가 실패하였습니다.");//TODO
    }else if(code==-70){
        result=getMessage("file.status.ruleNotFound","다이제스트생성용 rule 파일 로드 실패");//TODO
    }else if(code==-71){
        result=getMessage("file.status.alreadyExist","이미 존재함");
    }else if(code==-72){
        result=getMessage("file.status.notSupport","지원하지 않음");
    }else if(code==-73){
        result=getMessage("file.status.unknownDeviceType","지원하지 않는 디바이스 타입의 번들입니다.");//TODO
    }else if(code==-74){
        result=getMessage("file.status.unknownBundleType","지원하지 않는 타입의 번들입니다.");//TODO
    }else if(code==-75){
        result=getMessage("file.status.notSupportStoreIpa","앱스토어에 등록된 ipa 파일 등록은 지원하지 않습니다.");//TODO
    }else if(code==-1000){
        result=getMessage("file.status.requestTimeoutToBackgroundProcessor","백그라운드 프로세서타임아웃");
    }else if(code==-1001){
        result=getMessage("file.status.requestFailedToBackgroundProcessor","백그라운드 프로세서에 요청 실패");
    }
    if(code<0){
        return result +" ("+ code+")";
    }else{
        return result
    }

}


