var type = "";
var cfstatus = "";
var loadfieldflag = false;
$(document).ready(function () {
    $(".validpanel").css("display", "none");
    type = $("#requestcamefrompageid").val();
    if (type != "" && type != "undefined" && type != undefined) {
        loadmenu();
        loadfieldcount();
    }
})
var removeicon = 0;
var sum = 0;
var rt1;
/*Load custom field*/
function loadfield() {
    sum = 0;
    var ajaxTime1 = new Date().getTime();
    rt1 = $.ajax({
        type: "POST",
        url: "/api/CustomizeFormApi/FirmGetCustomField",
        headers: {
            'configurationtype': type,
            'noticeid': sessionStorage.getItem("NoticeId")
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var totalTime1 = new Date().getTime() - ajaxTime1;
            var obj = JSON.parse(data.Data);
            if (obj.length > 0 && cfstatus == 2) {
                document.getElementById("hidecf").style.display = "none";
            }
            else {
                document.getElementById("hidecf").style.display = "block";
            }
            var requireds;
            var sumyn = 0;
            $.each(obj, function (i, field) {
                var html = '';
                var req = field["IsRequired"];
                if (req == false) {
                    requireds = "";
                }
                else {
                    requireds = "required";
                }
                //email
                if (field["FieldType"] == "14") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"  aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></div></div></div></div>';
                    $("#content").append(textBox);
                }
                // name
                if (field["FieldType"] == "15") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"  aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></div></div></div></div>';
                    $("#content").append(textBox);
                }
                // textbox
                if (field["FieldType"] == "6") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"   aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //date
                if (field["FieldType"] == " 22") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  ></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //datetime
                if (field["FieldType"] == "3") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" ></div></div></div></div>';
                    $("#content").append(textBox);
                    $('#demotext' + sum).datetimepicker({
                        format: 'Y-m-d h:s'
                    });
                }
                //no
                if (field["FieldType"] == "5") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono" ></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //mobile
                if (field["FieldType"] == " 8") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10"  minlength="10" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //landline phone
                if (field["FieldType"] == " 9") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //zipcode
                if (field["FieldType"] == " 10") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span> <input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //address
                if (field["FieldType"] == " 7") {
                    sum = sum + 1;
                    var textBox = '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <sup class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true"><b>*</b></sup> </label> <span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></div></div></div></div>';
                    $("#content").append(textBox);
                }
                //dropdown
                if (field["FieldType"] == " 4") {
                    sum = sum + 1;
                    var selectvalues = field['FieldValues'];
                    var ftd = field['Id'];
                    if (selectvalues != null) {
                        html += '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control form-control-sm "  ' + requireds + ' name="demodropdown">';
                        html += '<option value="">Select</option>';
                        $.each(selectvalues.split(','), function (key, value) {
                            html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                        });
                        html += '</select>';
                    }
                    else {
                        html += '<div class="form-group"><label class="formLabel colorDark col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><div class="col-md-4"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control "  ' + requireds + ' name="demodropdown">';
                        html += '<option value="none">You have not Added any Option</option>';
                        html += '</select>';
                    }
                    $("#content").append(html + '</div></div></div></div>');
                }
                if (field["FieldType"] == " 11") {
                    sum = sum + 1;
                    html += '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"   aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><div  id="gender' + field['Id'] + '"> ';
                    var selectvalues1 = field['FieldValues'];
                    $.each(selectvalues1.split(','), function (key, value1) {
                        if (key == "0") {
                            html += '<label  class="radio-inline formLabel colorDark"><input type = "radio" class="gender" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  >&nbsp;&nbsp; ' + value1 + '</label>';
                        }
                        else {
                            html += '<label class="radio-inline formLabel colorDark"><input type = "radio" class="gender"   placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > &nbsp;&nbsp;' + value1 + '</label>';
                        }
                    });
                    $("#content").append(html + '</div></div></div></div>');
                }
                //yes/no
                if (field["FieldType"] == " 16") {
                    sum = sum + 1;
                    sumyn = sumyn + 1;
                    html += '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"  aria-required="true">*</span></label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><div class="" id="gender' + field['Id'] + '"> ';
                    var selectvalues1 = field['FieldValues'];
                    $.each(selectvalues1.split(','), function (key, value1) {
                        html += '<label class="radio-inline formLabel colorDark"><input class="yesno" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  >&nbsp;&nbsp; ' + value1 + '</label>';
                    });
                    $("#content").append(html + '</div></div></div></div>');
                }
                //checkboxlist
                if (field["FieldType"] == " 1") {
                    sum = sum + 1;
                    html += '<div class="col-md-6"><div class="row"><div class="form-group col-md-12"><label class="formLabel colorDark">' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"  style="color:red;font-size:10px;"  aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><div class="inputFormat" id="checkbox" style="background:#fff;">';
                    var selectvalues1 = field['FieldValues'];
                    if (selectvalues1 != null) {
                        $.each(selectvalues1.split(','), function (key, value) {
                            html += '<p class="checkbox-inline zyx"><input style="margin:5px 0px 0 -14px !important;" class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  ><span style="margin-left:5px;">' + value + '</span> </p >';
                        });
                    }
                    else {
                        html += '<p class="checkbox-inline"><input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="none" ' + requireds + '  >none</p >';
                    }
                    $("#content").append(html + '</div></div></div></div>');
                }
                var reqrd = field.IsRequired;
                var reqrdid = field.Id;
                if (String(reqrd) == "true") {
                    $(".rqd" + reqrdid).css("display", "unset");
                }
                else {
                    $(".rqd" + reqrdid).css("display", "none");
                }
            }); //End of foreach Loop
            if (editDetails != "" && editDetails != null && editDetails != "undefined" && editDetails != undefined) {
                loadcf();
                BindCustomizeField(editDetails)
            }
            closeload();
        }, //End of AJAX Success function
        failure: function (data) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (data) {
            alert(data.responseText);
        } //End of AJAX error function
    });
    $.when(rt1).then(function (data, textStatus, jqXHR) {
        removeicon = localStorage.getItem("fcount");
        if (removeicon == "2") {
            $(".glyphicon-trash").css("display", "none");
        }
        else {
            $(".glyphicon-trash").css("display", "block");
        }
        if (loadfieldflag == false) {
            loadmenu();
            loadfieldflag = true;
        }
    });
}
// Bind attribute on column 
function loadcf() {
    d2 = $.ajax({
        async: false,
        type: 'POST',
        url: '/api/CustomizeFormApi/SpColMaps1',
        headers: {
            'fid': type
        },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (response) {
            if (response.Data != "") {
                var obj = JSON.parse(response.Data);
                var cc = 0;
                var ty = "";
                $.each(obj, function (i, d) {
                    cc = cc + 1;
                    ty = $("#demotext" + cc).attr("id");
                    $("#demotext" + cc).attr("tempvalue" + cc, "col" + cc);
                });
            }
            else {
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
$('#ctype').on('change', function () {
    var selectid = this.value;
    if (selectid == 1) {
        $("#listid").show();
        $("#txtcustomFieldvalue").val('').show();
        $("#lengthid").hide();
        $("#common").css("display", "block");
    }
    else if (selectid == 4) {
        $("#listid").show();
        $("#txtcustomFieldvalue").val('').show();
        $("#lengthid").hide();
        $("#common").css("display", "block");
    }
    else if (selectid == 5) {
        $("#listid").hide();
        $("#txtcustomFieldvalue").val('').hide();
        $("#lengthid").show();
        $("#common").css("display", "hide");
    }
    else {
        $("#txtcustomFieldvalue").val('').hide();
        $("#lengthid").hide();
        $("#listid").hide();
        $("#common").css("display", "none");
    }
});

/*Add custom field*/
$("#addfield").click(function () {
    $(".validpanel").css("display", "none");
    var txtfn = $("#txtcustomFieldName").val();
    var ct = $("#ctype").val();
    var strcustomfield = "";
    if (ct == "1" || ct == "4") {
        if ($("#txtcustomFieldvalue").val().indexOf(',') > -1) {
            var strarrcustom = $("#txtcustomFieldvalue").val().split(',');
            for (var i = 0; i < strarrcustom.length; i++) {
                if (strarrcustom[i].trim() != "")
                    strcustomfield += strarrcustom[i] + ",";
            }
            strcustomfield = strcustomfield.substring(0, strcustomfield.lastIndexOf(','));
        }
        else {
            strcustomfield = $("#txtcustomFieldvalue").val();
        }
    }
    else {
        strcustomfield = $("#txtcustomFieldvalue").val();
    }
    var txtfv = strcustomfield;
    var txtr = $.trim($("#chkRequired").is(":checked"));
    if (txtfn == "") {
        $(".validpanel").css("display", "block").html(" Custom Field Name is Required !");
    }
    else if (ct == "0") {
        $(".validpanel").css("display", "block").html(" Select Custom Field Type is Required !");
    }
    else if (ct == "1" && txtfv == "") {
        $(".validpanel").css("display", "block").html(" Please Fill  Data in List Option!");
    }
    else if (ct == "4" && txtfv == "") {
        $(".validpanel").css("display", "block").html(" Please Fill  Data in List Option!");
    }
    else {
        if (sum < 15) {
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CustomizeFormApi/PostSaveFirmCustomFields",
                    data: {
                        FieldName: txtfn,
                        FieldType: ct,
                        FieldValues: txtfv,
                        IsRequired: txtr,
                        ConfigurationType: type,
                        Sequence: "1",
                        IsPositionChangable: "true",
                        IsDefault: "true",
                        IsActive: "false"
                    },
                    success: function (data) {
                        closeload();
                        document.getElementById("closemodal").click();
                        alert("Custom Field Added Successfully");
                        $('#myModal').modal('hide');
                        $("#content").html("");
                        sum = 0;
                        loadfieldcount();
                        $(".validpanel").css("display", "none");
                    }, //End of AJAX Success function
                    failure: function (data) {
                        closeload();
                        alert(data.responseText);
                    }, //End of AJAX failure function
                    error: function (data) {
                        closeload();
                        alert(data.responseText);
                    } //End of AJAX error function
                });
        }
        else {
            closeload();
            $(".validpanel").css("display", "block").html(" You have Completed max limit to Add custom Field !");
        }
    }
});

//load field count
function loadfieldcount() {
    var ct1 = $.ajax({
        type: "POST",
        url: "/api/CustomizeFormApi/CustomFieldCount",
        headers: {
            'configurationtype': type
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            localStorage.setItem("fcount", data.Data.length);
            if (data.Data.length == 2) {
                cfstatus = data.Data.length;
                document.getElementById("hidecf").style.display = "none";
                $("#publish").prop("disabled", "disabled");
                $("#savenoticebtn").attr("type", "submit");
                $(".glyphicon").removeProp("display");
            }
            else {
                document.getElementById("hidecf").style.display = "block";
                cfstatus = data.Data.length;
                $("#savenoticebtn").attr("type", "button");
                $("#publish").removeProp("disabled");
                $(".glyphicon").prop("display", "block");
            }
            //fnreloadpartialvie();
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $.when(ct1).then(function (data, textStatus, jqXHR) {
        loadfield();
    });
}
//$("#resetcf1").click(function () {
$(document).on("click", "#resetcf", function () {
    
    var result = confirm("Please download data before reset. You may loose your data. Are you sure to reset custom field data?");
    if (result) {
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CustomizeFormApi/ResetCF",
            headers: {
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $("#content").html("");
                var datas = JSON.stringify(data);
                loadfieldcount();
                alert("Page Reset Successfully.");
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
});
// Publish page
$("#publish").click(function () {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CustomizeFormApi/PublishPage",
        headers: {
            'configurationtype': type
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#content").html("");
            var datas = JSON.stringify(data);
            loadfieldcount();
            $('.save').prop("disabled", false);
            new PNotify({
                title: 'Success!',
                text: ' Page Published Successfully',
                type: 'success',
                delay: 3000
            });
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
});
/*Load menu*/
function loadmenu() {
    $("#ctype").html('');
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CustomizeFormApi/CustomFields",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#ctype").html('<option value="0">-Select Any-</option>');
            if (response.Data.length > 0) {
                $.each(response.Data, function (i, a) {
                    var t = a.Id;
                    var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + (a["DefaultValues"] === null ? "" : a["DefaultValues"]) + '" aurl="' + (a["Url"] === null ? "" : a["Url"]) + '">  ' + a["Text"] + '</option>';
                    $("#ctype").append(option);
                });
            }
            else {
                // alert("not found");
            }
            //End of foreach Loop
            //console.log(response);
        }, //End of AJAX Success function
        failure: function (data) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (data) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
$(document).on("click", "#idss", function () {
    $(".validpanel").css("display", "none");
    var t = $(this).attr("value");
    var result = confirm("Are you sure to delete this field?");
    if (result) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CustomizeFormApi/RemoveField",
            headers: {
                'configurationtype': type,
                'fid': t
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data1) {
                alert(data1.Data);
                $("#content").html("");
                sum = 0;
                loadfieldcount();
                // console.log(datas);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
});
var countcustomfoeld = 0;
// bind table with customize record -column header
function ploadtabledata(frompage) {
    if (type == undefined || type == "undefined" || type == "") {
        if (frompage == "NewNotice") {
            type = "1";
        }
        else if (frompage == "ReceivedNotice") {
            type = "2";
        }
        else if (frompage == "ReplyToNotice") {
            type = "3";
        }
        else if (frompage == "Rejoinder") {
            type = "4";
        }
    }
    var q1 = 2;
    var columnvalue = 0;
    var sort = 18;
    openload();
    var rt1 = $.ajax({
        type: 'Get',
        async: false,
        url: '/api/CustomizeFormApi/CustomizeColGetHeader',
        headers: {
            'configurationtype': type
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Data.length > 0) {
                var obj = JSON.parse(response.Data);
                countcustomfoeld = obj.length;
                var $header = "";
                var option = "";
                $.each(obj, function (i, val) {
                    q1 = q1 + 1;
                    columnvalue = columnvalue + 1;
                    sort = sort + 1;
                    $header += '<th  class="Class' + q1 + '">   <div class="thbg">' + val.FieldName + '</div></th>';
                    option += '<li><input class="shcheckbox1 chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                });
                if (($("#newnoticeheadrow").find('.Class' + q1 + '').html()) == "undefined"
                    || ($("#newnoticeheadrow").find('.Class' + q1 + '').html()) == ""
                    || ($("#newnoticeheadrow").find('.Class' + q1 + '').html()) == undefined) {
                    $('#newnoticeheadrow').find('th:last-child').before($header);
                }
                if (($("ul#od li [name='Class" + q1 + "']").val()) == "undefined"
                    || ($("ul#od li [name='Class" + q1 + "']").val()) == ""
                    || ($("ul#od li [name='Class" + q1 + "']").val()) == undefined) {
                    $("#od").append(option);
                }
            }
            else {
            }
        },
        error: function () {
            alert('Error!');
        }
    });
    sortCustmoizeField()
    closeload();
}
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
/*Sort customize field*/
function sortCustmoizeField() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od").
            appendChild(e));
}
$(document).on('click', '#ppaginate', function () {
    ppageindex = $(this).attr("index");
    callapi(ppageindex);
});
$(document).on('click', '#ppaginate', function () {
    ppageindex = $(this).attr("index");
    callapi(ppageindex);
});
// bind table td and tr for customize field
var bindCustomizehtml = "";
function bindCustomizeRowandTd() {
    bindCustomizehtml = "";
    var val = callapiresponse;
    var countcf = countcustomfoeld;
    for (var str = 1; str <= countcf; str++) {
        if (str == 1) {
            if (val.col1 == "" || val.col1 == null) {
                bindCustomizehtml += "<td class='class3'><span>jyoti</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='class3'> " + checkdatetimecustom(val.col1) + "</td>";
            }
        }
        if (str == 2) {
            if (val.col2 == "" || val.col2 == null) {
                bindCustomizehtml += "<td class='Class4'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class4'> " + checkdatetimecustom(val.col2) + "</td>";
            }
        }
        if (str == 3) {
            if (val.col3 == "" || val.col3 == null) {
                bindCustomizehtml += "<td class='Class5'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class5'> " + checkdatetimecustom(val.col3) + "</td>";
            }
        }
        if (str == 4) {
            if (val.col4 == "" || val.col4 == null) {
                bindCustomizehtml += "<td class='Class6'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class6'> " + checkdatetimecustom(val.col4) + "</td>";
            }
        }
        if (str == 5) {
            if (val.col5 == "" || val.col5 == null) {
                bindCustomizehtml += "<td class='Class7'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class7'> " + checkdatetimecustom(val.col5) + "</td>";
            }
        }
        if (str == 6) {
            if (val.col6 == "" || val.col6 == null) {
                bindCustomizehtml += "<td class='Class8'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class8'> " + checkdatetimecustom(val.col6) + "</td>";
            }
        }
        if (str == 7) {
            if (val.col7 == "" || val.col7 == null) {
                bindCustomizehtml += "<td class='Class9'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class9'> " + checkdatetimecustom(val.col7) + "</td>";
            }
        }
        if (str == 8) {
            if (val.col8 == "" || val.col8 == null) {
                bindCustomizehtml += "<td class='Class10'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class10'> " + checkdatetimecustom(val.col8) + "</td>";
            }
        }
        if (str == 9) {
            if (val.col9 == "" || val.col9 == null) {
                bindCustomizehtml += "<td class='Class11'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class11'> " + checkdatetimecustom(val.col9) + "</td>";
            }
        }
        if (str == 10) {
            if (val.col10 == "" || val.col10 == null) {
                bindCustomizehtml += "<td class='Class12'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class12'> " + checkdatetimecustom(val.col10) + "</td>";
            }
        }
        if (str == 11) {
            if (val.col11 == "" || val.col11 == null) {
                bindCustomizehtml += "<td class='Class13'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class13'> " + checkdatetimecustom(val.col11) + "</td>";
            }
        }
        if (str == 12) {
            if (val.col12 == "" || val.col12 == null) {
                bindCustomizehtml += "<td class='Class14'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class14'> " + checkdatetimecustom(val.col12) + "</td>";
            }
        }
        if (str == 13) {
            if (val.col13 == "" || val.col13 == null) {
                bindCustomizehtml += "<td class='Class15'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class15'> " + checkdatetimecustom(val.col13) + "</td>";
            }
        }
        if (str == 14) {
            if (val.col14 == "" || val.col14 == null) {
                bindCustomizehtml += "<td class='Class16'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class16'> " + checkdatetimecustom(val.col14) + "</td>";
            }
        }
        if (str == 15) {
            if (val.col15 == "" || val.col15 == null) {
                bindCustomizehtml += "<td class='Class17'><span>&nbsp;</span></td>";
            }
            else {
                bindCustomizehtml += "<td class='Class17'> " + checkdatetimecustom(val.col15) + "</td>";
            }
        }
        console.log(bindCustomizehtml, "jyoti")
    }
}
//save customize fielddata
function commonFormsavevariablevalue(formData, headerval) {
    var tx1 = '';
    var tx2 = '';
    var tx3 = '';
    var tx4 = '';
    var tx5 = '';
    var tx6 = '';
    var tx7 = '';
    var tx8 = '';
    var tx9 = '';
    var tx10 = '';
    var tx11 = '';
    var tx12 = '';
    var tx13 = '';
    var tx14 = '';
    var tx15 = '';
    var ctx1 = '';
    var ctx2 = '';
    var ctx3 = '';
    var ctx4 = '';
    var ctx5 = '';
    var ctx6 = '';
    var ctx7 = '';
    var ctx8 = '';
    var ctx9 = '';
    var ctx10 = '';
    var ctx11 = '';
    var ctx12 = '';
    var ctx13 = '';
    var ctx14 = '';
    var ctx15 = '';
    var gtype = '';
    var yntype = '';
    var ltype = '';
    if ($("#demotext1").attr('type') == "checkbox") {
        tx1 = '';
    }
    else {
        tx1 = $("#demotext1").val();
    }
    if ($("#demotext2").attr('type') == "checkbox") {
        tx2 = '';
    }
    else {
        tx2 = $("#demotext2").val();
    }
    if ($("#demotext3").attr('type') == "checkbox") {
        tx3 = '';
    }
    else {
        tx3 = $("#demotext3").val();
    }
    if ($("#demotext4").attr('type') == "checkbox") {
        tx4 = '';
    }
    else {
        tx4 = $("#demotext4").val();
    }
    if ($("#demotext5").attr('type') == "checkbox") {
        tx5 = '';
    }
    else {
        tx5 = $("#demotext5").val();
    }
    if ($("#demotext6").attr('type') == "checkbox") {
        tx6 = '';
    }
    else {
        tx6 = $("#demotext6").val();
    }
    if ($("#demotext7").attr('type') == "checkbox") {
        tx7 = '';
    }
    else {
        tx7 = $("#demotext7").val();
    }
    if ($("#demotext8").attr('type') == "checkbox") {
        tx8 = '';
    }
    else {
        tx8 = $("#demotext8").val();
    }
    if ($("#demotext9").attr('type') == "checkbox") {
        tx9 = '';
    }
    else {
        tx9 = $("#demotext9").val();
    }
    if ($("#demotext10").attr('type') == "checkbox") {
        tx10 = '';
    }
    else {
        tx10 = $("#demotext10").val();
    }
    if ($("#demotext11").attr('type') == "checkbox") {
        tx11 = '';
    }
    else {
        tx11 = $("#demotext11").val();
    }
    if ($("#demotext12").attr('type') == "checkbox") {
        tx12 = '';
    }
    else {
        tx12 = $("#demotext12").val();
    }
    if ($("#demotext13").attr('type') == "checkbox") {
        tx13 = '';
    }
    else {
        tx13 = $("#demotext13").val();
    }
    if ($("#demotext14").attr('type') == "checkbox") {
        tx14 = '';
    }
    else {
        tx14 = $("#demotext14").val();
    }
    if ($("#demotext15").attr('type') == "checkbox") {
        tx15 = '';
    }
    else {
        tx15 = $("#demotext15").val();
    }
    gtype = $(".gender").attr('class');
    yntype = $(".yesno").attr('class');
    ltype = $(".clist").attr('myclass');
    if (yntype == "yesno") {
        var x1 = $("#demotext1").attr('id');
        var x2 = $("#demotext2").attr('id');
        var x3 = $("#demotext3").attr('id');
        var x4 = $("#demotext4").attr('id');
        var x5 = $("#demotext5").attr('id');
        var x6 = $("#demotext6").attr('id');
        var x7 = $("#demotext7").attr('id');
        var x8 = $("#demotext8").attr('id');
        var x9 = $("#demotext9").attr('id');
        var x10 = $("#demotext10").attr('id');
        var x11 = $("#demotext11").attr('id');
        var x12 = $("#demotext12").attr('id');
        var x13 = $("#demotext13").attr('id');
        var x14 = $("#demotext14").attr('id');
        var x15 = $("#demotext15").attr('id');
        //alert(x4);
        var inputType = $('#demotext1').attr('type');
        // alert(inputType);
        if (x1 == "demotext1") {
            if ($('#demotext1').attr('type') == "radio") {
                tx1 = $("input[name='demotext1']:checked").val();
            }
        }
        if (x2 == "demotext2") {
            if ($('#demotext2').attr('type') == "radio") {
                tx2 = $("input[name='demotext2']:checked").val();
            }
        }
        if (x3 == "demotext3") {
            if ($('#demotext3').attr('type') == "radio") {
                tx3 = $("input[name='demotext3']:checked").val();
            }
        }
        if (x4 == "demotext4") {
            if ($('#demotext4').attr('type') == "radio") {
                tx4 = $("input[name='demotext4']:checked").val();
            }
        }
        if (x5 == "demotext5") {
            if ($('#demotext5').attr('type') == "radio") {
                tx5 = $("input[name='demotext5']:checked").val();
            }
        }
        if (x6 == "demotext6") {
            if ($('#demotext6').attr('type') == "radio") {
                tx6 = $("input[name='demotext6']:checked").val();
            }
        }
        if (x7 == "demotext7") {
            if ($('#demotext7').attr('type') == "radio") {
                tx7 = $("input[name='demotext7']:checked").val();
            }
        }
        if (x8 == "demotext8") {
            if ($('#demotext8').attr('type') == "radio") {
                tx8 = $("input[name='demotext8']:checked").val();
            }
        }
        if (x9 == "demotext9") {
            if ($('#demotext9').attr('type') == "radio") {
                tx9 = $("input[name='demotext9']:checked").val();
            }
        }
        if (x10 == "demotext10") {
            if ($('#demotext10').attr('type') == "radio") {
                tx10 = $("input[name='demotext10']:checked").val();
            }
        }
        if (x11 == "demotext11") {
            if ($('#demotext11').attr('type') == "radio") {
                tx11 = $("input[name='demotext11']:checked").val();
            }
        }
        if (x12 == "demotext12") {
            if ($('#demotext12').attr('type') == "radio") {
                tx12 = $("input[name='demotext12']:checked").val();
            }
        }
        if (x13 == "demotext13") {
            if ($('#demotext13').attr('type') == "radio") {
                tx13 = $("input[name='demotext13']:checked").val();
            }
        }
        if (x14 == "demotext14") {
            if ($('#demotext14').attr('type') == "radio") {
                tx14 = $("input[name='demotext14']:checked").val();
            }
        }
        if (x15 == "demotext15") {
            if ($('#demotext15').attr('type') == "radio") {
                tx15 = $("input[name='demotext15']:checked").val();
            }
        }
    }
    if (ltype == "clist") {
        var c1 = $("#demotext1").attr('id');
        var c2 = $("#demotext2").attr('id');
        var c3 = $("#demotext3").attr('id');
        var c4 = $("#demotext4").attr('id');
        var c5 = $("#demotext5").attr('id');
        var c6 = $("#demotext6").attr('id');
        var c7 = $("#demotext7").attr('id');
        var c8 = $("#demotext8").attr('id');
        var c9 = $("#demotext9").attr('id');
        var c10 = $("#demotext10").attr('id');
        var c11 = $("#demotext11").attr('id');
        var c12 = $("#demotext12").attr('id');
        var c13 = $("#demotext13").attr('id');
        var c14 = $("#demotext14").attr('id');
        // alert(c14);
        var c15 = $("#demotext15").attr('id');
        if (c1 == "demotext1") {
            var chkArray1 = [];
            $(".demotext1:checked").each(function () {
                chkArray1.push($(this).val());
            });
            var selected1;
            selected1 = chkArray1.join(',');
            if (selected1.length > 0) {
                tx1 = selected1;
                // alert(selected1);
            } else {
                tx1 = tx1;
            }
        }
        if (c2 == "demotext2") {
            var chkArray2 = [];
            $(".demotext2:checked").each(function () {
                chkArray2.push($(this).val());
            });
            var selected2;
            selected2 = chkArray2.join(',');
            if (selected2.length > 0) {
                tx2 = selected2;
                // alert(selected2);
            } else {
                tx2 = tx2;
            }
        }
        if (c3 == "demotext3") {
            var chkArray3 = [];
            $(".demotext3:checked").each(function () {
                chkArray3.push($(this).val());
            });
            var selected3;
            selected3 = chkArray3.join(',');
            if (selected3.length > 0) {
                tx3 = selected3;
                // alert(selected3);
            } else {
                tx3 = tx3;
            }
        }
        if (c4 == "demotext4") {
            var chkArray4 = [];
            $(".demotext4:checked").each(function () {
                chkArray4.push($(this).val());
            });
            var selected4;
            selected4 = chkArray4.join(',');
            if (selected4.length > 0) {
                tx4 = selected4;
            } else {
                tx4 = tx4;
            }
        }
        if (c5 == "demotext5") {
            var chkArray5 = [];
            $(".demotext5:checked").each(function () {
                chkArray5.push($(this).val());
            });
            var selected5;
            selected5 = chkArray5.join(',');
            if (selected5.length > 0) {
                tx5 = selected5;
            } else {
                tx5 = tx5;
            }
        }
        if (c6 == "demotext6") {
            var chkArray6 = [];
            $(".demotext6:checked").each(function () {
                chkArray6.push($(this).val());
            });
            var selected6;
            selected6 = chkArray6.join(',');
            if (selected6.length > 0) {
                tx6 = selected6;
            } else {
                tx6 = tx6;
            }
        }
        if (c7 == "demotext7") {
            var chkArray7 = [];
            $(".demotext7:checked").each(function () {
                chkArray7.push($(this).val());
            });
            var selected7;
            selected7 = chkArray7.join(',');
            if (selected7.length > 0) {
                tx7 = selected7;
            } else {
                tx7 = tx7;
            }
        }
        if (c8 == "demotext8") {
            var chkArray8 = [];
            $(".demotext8:checked").each(function () {
                chkArray8.push($(this).val());
            });
            var selected8;
            selected8 = chkArray8.join(',');
            if (selected8.length > 0) {
                tx8 = selected8;
            } else {
                tx8 = tx8;
            }
        }
        if (c9 == "demotext9") {
            var chkArray9 = [];
            $(".demotext9:checked").each(function () {
                chkArray9.push($(this).val());
            });
            var selected9;
            selected9 = chkArray9.join(',');
            if (selected9.length > 0) {
                tx9 = selected9;
            } else {
                tx9 = tx9;
            }
        }
        if (c10 == "demotext10") {
            var chkArray10 = [];
            $(".demotext10:checked").each(function () {
                chkArray10.push($(this).val());
            });
            var selected10;
            selected10 = chkArray10.join(',');
            if (selected10.length > 0) {
                tx10 = selected10;
            } else {
                tx10 = tx10;
            }
        }
        if (c11 == "demotext11") {
            var chkArray11 = [];
            $(".demotext11:checked").each(function () {
                chkArray11.push($(this).val());
            });
            var selected11;
            selected11 = chkArray11.join(',');
            if (selected11.length > 0) {
                tx11 = selected11;
            } else {
                tx11 = tx11;
            }
        }
        if (c12 == "demotext12") {
            var chkArray12 = [];
            $(".demotext12:checked").each(function () {
                chkArray12.push($(this).val());
            });
            var selected12;
            selected12 = chkArray12.join(',');
            if (selected12.length > 0) {
                tx12 = selected12;
            } else {
                tx12 = tx12;
            }
        }
        if (c13 == "demotext13") {
            var chkArray13 = [];
            $(".demotext13:checked").each(function () {
                chkArray13.push($(this).val());
            });
            var selected13;
            selected13 = chkArray13.join(',');
            if (selected13.length > 0) {
                tx13 = selected13;
            } else {
                tx13 = tx13;
            }
        }
        if (c14 == "demotext14") {
            var chkArray14 = [];
            $(".demotext14:checked").each(function () {
                chkArray14.push($(this).val());
            });
            var selected14;
            selected14 = chkArray14.join(',');
            if (selected14.length > 0) {
                tx14 = selected14;
            } else {
                tx14 = tx14;
            }
        }
        if (c15 == "demotext15") {
            var chkArray15 = [];
            $(".demotext15:checked").each(function () {
                chkArray15.push($(this).val());
            });
            var selected15;
            selected15 = chkArray15.join(',');
            if (selected15.length > 0) {
                tx15 = selected15;
            } else {
                tx15 = tx15;
            }
        }
    }
    //take atribue
    atx1 = $("#demotext1").attr('id');
    atx2 = $("#demotext2").attr('id');
    atx3 = $("#demotext3").attr('id');
    atx4 = $("#demotext4").attr('id');
    atx5 = $("#demotext5").attr('id');
    atx6 = $("#demotext6").attr('id');
    atx7 = $("#demotext7").attr('id');
    atx8 = $("#demotext8").attr('id');
    atx9 = $("#demotext9").attr('id');
    atx10 = $("#demotext10").attr('id');
    atx11 = $("#demotext11").attr('id');
    atx12 = $("#demotext12").attr('id');
    atx13 = $("#demotext13").attr('id');
    atx14 = $("#demotext14").attr('id');
    atx15 = $("#demotext15").attr('id');
    //start for gender
    if (gtype == "gender" || gtype == "gender valid") {
        var rd = $("input[name='gender']:checked").val();//gender vlue
        var rdid = $("input[name='gender']:checked").attr('id');//gender id text
        if (rdid == atx1) {
            tx1 = rd;
        }
        if (rdid == atx2) {
            tx2 = rd;
        }
        if (rdid == atx3) {
            tx3 = rd;
        }
        if (rdid == atx4) {
            tx4 = rd;
        }
        if (rdid == atx5) {
            tx5 = rd;
        }
        if (rdid == atx6) {
            tx6 = rd;
        }
        if (rdid == atx7) {
            tx7 = rd;
        }
        if (rdid == atx8) {
            tx8 = rd;
        }
        if (rdid == atx9) {
            tx9 = rd;
        }
        if (rdid == atx10) {
            tx10 = rd;
        }
        if (rdid == atx11) {
            tx11 = rd;
        }
        if (rdid == atx12) {
            tx12 = rd;
        }
        if (rdid == atx13) {
            tx13 = rd;
        }
        if (rdid == atx14) {
            tx14 = rd;
        }
        if (rdid == atx15) {
            tx15 = rd;
        }
    }
    if (tx1 != null) {
        ctx1 = $("#demotext1").attr("placeholder");
    }
    if (tx2 != null) {
        ctx2 = $("#demotext2").attr("placeholder");
    }
    if (tx3 != null) {
        ctx3 = $("#demotext3").attr("placeholder");
    }
    if (tx4 != null) {
        ctx4 = $("#demotext4").attr("placeholder");
    }
    if (tx5 != null) {
        ctx5 = $("#demotext5").attr("placeholder");
    }
    if (tx6 != null) {
        ctx6 = $("#demotext6").attr("placeholder");
    }
    if (tx7 != null) {
        ctx7 = $("#demotext7").attr("placeholder");
    }
    if (tx8 != null) {
        ctx8 = $("#demotext8").attr("placeholder");
    }
    if (tx9 != null) {
        ctx9 = $("#demotext9").attr("placeholder");
    }
    if (tx10 != null) {
        ctx10 = $("#demotext10").attr("placeholder");
    }
    if (tx11 != null) {
        ctx11 = $("#demotext11").attr("placeholder");
    }
    if (tx12 != null) {
        ctx12 = $("#demotext12").attr("placeholder");
    }
    if (tx13 != null) {
        ctx13 = $("#demotext13").attr("placeholder");
    }
    if (tx14 != null) {
        ctx14 = $("#demotext14").attr("placeholder");
    }
    if (tx15 != null) {
        ctx15 = $("#demotext15").attr("placeholder");
    }
    col1 = tx1;
    col2 = tx2;
    col3 = tx3;
    col4 = tx4;
    col5 = tx5;
    col6 = tx6;
    col7 = tx7;
    col8 = tx8;
    col9 = tx9;
    col10 = tx10;
    col11 = tx11;
    col12 = tx12;
    col13 = tx13;
    col14 = tx14;
    col15 = tx15;
    formData.append("col1", EncodeText(col1));
    formData.append("col2", EncodeText(col2));
    formData.append("col3", EncodeText(col3));
    formData.append("col4", EncodeText(col4));
    formData.append("col5", EncodeText(col5));
    formData.append("col6", EncodeText(col6));
    formData.append("col7", EncodeText(col7));
    formData.append("col8", EncodeText(col8));
    formData.append("col9", EncodeText(col9));
    formData.append("col10", EncodeText(col10));
    formData.append("col11", EncodeText(col11));
    formData.append("col12", EncodeText(col12));
    formData.append("col13", EncodeText(col13));
    formData.append("col14", EncodeText(col14));
    formData.append("col15", EncodeText(col15));
    formData.append("formtype", EncodeText(type));
    var headerval1 = {
        "ctxt1": ctx1,
        "ctxt2": ctx2,
        "ctxt3": ctx3,
        "ctxt4": ctx4,
        "ctxt5": ctx5,
        "ctxt6": ctx6,
        "ctxt7": ctx7,
        "ctxt8": ctx8,
        "ctxt9": ctx9,
        "ctxt10": ctx10,
        "ctxt11": ctx11,
        "ctxt12": ctx12,
        "ctxt13": ctx13,
        "ctxt14": ctx14,
        "ctxt15": ctx15,
        "sum": sum,
        "ftype": type
    }
    formData.append("headerval", JSON.stringify(headerval1));
}
//bind customize field data on edit
function BindCustomizeField(b) {
    for (lp = 1; lp <= 15; lp = lp + 1) {
        $('#demotext' + lp).is(function () {
            ftype = this.tagName != 'INPUT' ? this.tagName.toLocaleLowerCase() : this.type.toLowerCase();
            if (ftype == "text") {
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    $("#demotext" + lp).val(b[0].col1);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    $("#demotext" + lp).val(b[0].col2);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    $("#demotext" + lp).val(b[0].col3)
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    $("#demotext" + lp).val(b[0].col4);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    $("#demotext" + lp).val(b[0].col5);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    $("#demotext" + lp).val(b[0].col6);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    $("#demotext" + lp).val(b[0].col7);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    $("#demotext" + lp).val(b[0].col8);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    $("#demotext" + lp).val(b[0].col9);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    $("#demotext" + lp).val(b[0].col10);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    $("#demotext" + lp).val(b[0].col11);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    $("#demotext" + lp).val(b[0].col12);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    $("#demotext" + lp).val(b[0].col13);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    $("#demotext" + lp).val(b[0].col14);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    $("#demotext" + lp).val(b[0].col15);
                }
            }
            if (ftype == "email") {
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    $("#demotext" + lp).val(b[0].col1);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    $("#demotext" + lp).val(b[0].col2);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    $("#demotext" + lp).val(b[0].col3)
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    $("#demotext" + lp).val(b[0].col4);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    $("#demotext" + lp).val(b[0].col5);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    $("#demotext" + lp).val(b[0].col6);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    $("#demotext" + lp).val(b[0].col7);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    $("#demotext" + lp).val(b[0].col8);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    $("#demotext" + lp).val(b[0].col9);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    $("#demotext" + lp).val(b[0].col10);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    $("#demotext" + lp).val(b[0].col11);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    $("#demotext" + lp).val(b[0].col12);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    $("#demotext" + lp).val(b[0].col13);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    $("#demotext" + lp).val(b[0].col14);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    $("#demotext" + lp).val(b[0].col15);
                }
            }
            if (ftype == "number") {
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    $("#demotext" + lp).val(b[0].col1);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    $("#demotext" + lp).val(b[0].col2);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    $("#demotext" + lp).val(b[0].col3)
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    $("#demotext" + lp).val(b[0].col4);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    $("#demotext" + lp).val(b[0].col5);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    $("#demotext" + lp).val(b[0].col6);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    $("#demotext" + lp).val(b[0].col7);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    $("#demotext" + lp).val(b[0].col8);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    $("#demotext" + lp).val(b[0].col9);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    $("#demotext" + lp).val(b[0].col10);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    $("#demotext" + lp).val(b[0].col11);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    $("#demotext" + lp).val(b[0].col12);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    $("#demotext" + lp).val(b[0].col13);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    $("#demotext" + lp).val(b[0].col14);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    $("#demotext" + lp).val(b[0].col15);
                }
            }
            if (ftype == "datetime-local") {
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    $("#demotext" + lp).val(b[0].col1);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    $("#demotext" + lp).val(b[0].col2);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    $("#demotext" + lp).val(b[0].col3)
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    $("#demotext" + lp).val(b[0].col4);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    $("#demotext" + lp).val(b[0].col5);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    $("#demotext" + lp).val(b[0].col6);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    $("#demotext" + lp).val(b[0].col7);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    $("#demotext" + lp).val(b[0].col8);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    $("#demotext" + lp).val(b[0].col9);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    $("#demotext" + lp).val(b[0].col10);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    $("#demotext" + lp).val(b[0].col11);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    $("#demotext" + lp).val(b[0].col12);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    $("#demotext" + lp).val(b[0].col13);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    $("#demotext" + lp).val(b[0].col14);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    $("#demotext" + lp).val(b[0].col15);
                }
            }
            if (ftype == "date") {
                var date12 = "";
                var dateval12 = "";
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    date12 = b[0].col1;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    date12 = b[0].col2;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    date12 = b[0].col3;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    date12 = b[0].col4;
                    $("#demotext" + lp).val(date12);
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    date12 = b[0].col5;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    date12 = b[0].col6;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    date12 = b[0].col7;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    date12 = b[0].col8;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    date12 = b[0].col9;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    date12 = b[0].col10;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    date12 = b[0].col11;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    date12 = b[0].col12;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    date12 = b[0].col13;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    date12 = b[0].col14;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    date12 = b[0].col15;
                    try {
                        dateval12 = date12.substring(0, 10);
                        $("#demotext" + lp).val(date12);
                    }
                    catch (er) {
                    }
                }
            }
            if (ftype == "checkbox") {
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    if (b[0].col8 != null) {
                        var strarray = b[0].col8.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    if (b[0].col1 != null) {
                        var strarray = b[0].col1.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    if (b[0].col2 != null) {
                        var strarray = b[0].col2.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    if (b[0].col3 != null) {
                        var strarray = b[0].col3.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    // alert(strarray[i]);
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    if (b[0].col4 != null) {
                        var strarray = b[0].col4.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    //  alert(strarray[i]);
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    if (b[0].col5 != null) {
                        var strarray = b[0].col5.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    if (b[0].col6 != null) {
                        var strarray = b[0].col6.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    if (b[0].col7 != null) {
                        var strarray = b[0].col7.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    // alert(strarray[i]);
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    if (b[0].col9 != null) {
                        var strarray = b[0].col9.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    //  alert(strarray[i]);
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    if (b[0].col10 != null) {
                        var strarray = b[0].col10.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    if (b[0].col11 != null) {
                        var strarray = b[0].col11.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    if (b[0].col12 != null) {
                        var strarray = b[0].col12.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    //   alert(strarray[i]);
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    if (b[0].col13 != null) {
                        var strarray = b[0].col13.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    if (b[0].col14 != null) {
                        var strarray = b[0].col14.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    if (b[0].col15 != null) {
                        var strarray = b[0].col15.split(',');
                        $(".demotext" + lp + "").each(function () {
                            var chkbx = $(this).val();
                            var tempname = $(this).attr("name");
                            for (var i = 0; i < strarray.length; i++) {
                                if (strarray[i] == chkbx) {
                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                }
                            }
                        });
                    }
                }
            }
            if (ftype == "radio") {
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    if (b[0].col1 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col1 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col1 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col1 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col1 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    if (b[0].col2 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col2 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col2 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col2 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col2 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    if (b[0].col3 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col3 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col3 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col3 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col3 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    if (b[0].col4 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col4 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col4 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col4 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col4 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    if (b[0].col5 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col5 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col5 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col5 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col5 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    if (b[0].col6 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col6 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col6 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col6 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col6 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    if (b[0].col7 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col7 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col7 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col7 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col7 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    if (b[0].col8 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col8 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col8 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col8 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col8 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    if (b[0].col9 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col9 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col9 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col9 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col9 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    if (b[0].col10 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col10 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col10 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col10 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col10 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    if (b[0].col11 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col11 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col11 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col11 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col11 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    if (b[0].col12 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col12 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col12 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col12 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col12 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    if (b[0].col13 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col13 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col13 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col13 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col13 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    if (b[0].col14 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col14 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col14 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col14 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b.col14 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    if (b[0].col15 == "Male") {
                        $("INPUT[name=gender]").val(['Male']);
                    }
                    else if (b[0].col15 == "Female") {
                        $("INPUT[name=gender]").val(['Female']);
                    }
                    else if (b[0].col15 == "Transgender") {
                        $("INPUT[name=gender]").val(['Transgender']);
                    }
                    else if (b[0].col15 == "Yes") {
                        $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                    }
                    else if (b[0].col15 == "No") {
                        $("INPUT[name=demotext" + lp + "]").val(['No']);
                    }
                }
            }
            if (ftype == "select") {
                var option5 = "";;
                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                    if (String(b[0].col1) == "") {
                    }
                    else if (String(b[0].col1) != null) {
                        option5 = '<option value="' + b[0].col1 + '" selected > ' + b[0].col1 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                    if (String(b[0].col2) == "") {
                    }
                    else if (String(b.col2) != null) {
                        option5 = '<option value="' + b[0].col2 + '" selected > ' + b[0].col2 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                    if (String(b[0].col3) == "") {
                    }
                    else if (String(b[0].col3) != null) {
                        option5 = '<option value="' + b[0].col3 + '" selected > ' + b[0].col3 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                    if (String(b[0].col4) == "") {
                    }
                    else if (String(b[0].col4) != null) {
                        option5 = '<option value="' + b[0].col4 + '" selected > ' + b[0].col4 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                    if (String(b[0].col5) == "") {
                    }
                    else if (String(b[0].col5) != null) {
                        option5 = '<option value="' + b[0].col5 + '" selected > ' + b[0].col5 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                    if (String(b[0].col6) == "") {
                    }
                    else if (String(b[0].col6) != null) {
                        option5 = '<option value="' + b[0].col6 + '" selected > ' + b.col6 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                    if (String(b[0].col7) == "") {
                    }
                    else if (String(b[0].col7) != null) {
                        option5 = '<option value="' + b[0].col7 + '" selected > ' + b[0].col7 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                    if (String(b[0].col8) == "") {
                    }
                    else if (String(b[0].col8) != null) {
                        option5 = '<option value="' + b[0].col8 + '" selected > ' + b[0].col8 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                    if (String(b[0].col9) == "") {
                    }
                    else if (String(b[0].col9) != null) {
                        option5 = '<option value="' + b[0].col9 + '" selected > ' + b[0].col9 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                    if (String(b[0].col10) == "") {
                    }
                    else if (String(b[0].col10) != null) {
                        option5 = '<option value="' + b[0].col10 + '" selected > ' + b[0].col10 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                    if (String(b[0].col11) == "") {
                    }
                    else if (String(b[0].col11) != null) {
                        option5 = '<option value="' + b[0].col11 + '" selected > ' + b[0].col11 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                    if (String(b[0].col12) == "") {
                    }
                    else if (String(b[0].col12) != null) {
                        option5 = '<option value="' + b[0].col12 + '" selected > ' + b[0].col12 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                    if (String(b[0].col13) == "") {
                    }
                    else if (String(b[0].col13) != null) {
                        option5 = '<option value="' + b[0].col13 + '" selected > ' + b[0].col13 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                    if (String(b[0].col14) == "") {
                    }
                    else if (String(b[0].col14) != null) {
                        option5 = '<option value="' + b[0].col14 + '" selected > ' + b[0].col14 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
                else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                    if (String(b[0].col15) == "") {
                    }
                    else if (String(b.col15) != null) {
                        option5 = '<option value="' + b[0].col15 + '" selected > ' + b[0].col15 + ' </option>';
                        $("#demotext" + lp).append(option5);
                    }
                }
            }
        });
    }
}
//date time format
function checkdatetimecustom(str2) {
    var patt2 = /[0-9]*-[0-9]*-[0-9]*T[0-9]*\:[0-9]*/m;
    var patt3 = /[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/m;
    var patt4 = /[0-9]*-[0-9]*-[0-9]* [0-9]*\:[0-9]*/m;
    if (str2 != null) {
        var result = str2.match(patt2);
        var result1 = str2.match(patt3);
        var result4 = str2.match(patt4);
        if (result != null && String(result).length == "16") {
            var result3 = checkdatetimecustomdt(result);
            return result3;
        }
        else if (result4 != null && String(result4).length == "16") {
            var result4 = checkdatetimecustomdt(result4);
            return result4;
        }
        else if (result1 != null && String(result1).length == "10") {
            var result31 = formatDatetoIST(result1);
            return result31;
        }
        else {
            return str2;
        }
    }
}
function formatDatetoIST(date) {
    if (date == "1900-01-01T00:00:00" || date == "1900-01-01" || date == "") {
        return "";
    }
    else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
        return formatted_date;
    }
}
//Customize field history start
var cfloadflag = true;
var cfpageindex = 1, cfpagesize = 10, cfrecordcount = 0, cftotrecord = 0;
function bindCFHistoryversion() {
    $("#cfversion").empty();
    var html1 = '<option value="">Select</option>';
    var formData = new FormData();
    var moduletype = $("#cfHistory").attr('data-val');
    if (moduletype == "NewNotice") {
        moduletype = "1";
    }
    else if (moduletype == "ReceivedNotice") {
        moduletype = "2";
    }
    else if (moduletype == "ReplyToNotice") {
        moduletype = "3";
    }
    else if (moduletype == "Rejoinder") {
        moduletype = "4";
    }
    formData.append("ModuleType", EncodeText(moduletype));
    var it = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CustomizeFormApi/LoadCustomFieledVersion",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            console.log("LoadCustomFieledVersion", response)
            var obj = JSON.parse(response.Data);
            if (obj != "") {
                var array = String(obj).split(",");
                $.each(array, function (i) {
                    it = it + 1;
                    html1 += '<option value="' + array[i] + '" >Version-' + it + '(' + formatDatetoIST(array[i]) + ')</option>';
                });
            }
            $("#cfversion").html(html1);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
$("#cfHistory").click(function () {
    $('#myModalcfHistory').modal({ show: true });
    bindCFHistoryversion();
});

/*Get custom field history data*/
$("#CFHistoryData").click(function () {
    $("#CFHistoryData").attr("disabled", true);
    var vdate = $("#cfversion").val();
    if (vdate == "") {
        alert("Please select Version of Custom Fields");
        $("#cfversion").focus();
        return false;
    }
    cfhistorydata();
});
function fncfhistorydata() {
    $("#CFHistoryData").attr("disabled", true);
    var vdate = $("#cfversion").val();
    if (vdate == "") {
        alert("Please select Version of Custom Fields");
        $("#cfversion").focus();
        return false;
    }
    cfhistorydata();
}
$(document).on('click', '#cfpgetdatabypagenum', function () {
    ppageindex = $("#cfppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#cfpsotopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                loadflag = true;
                loadCfieldList(ppageindex);
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
            }
        }
        else {
            alert("Please enter a valid page number.");
        }
    }
});
var chksflag = true;
$(document).on('click', '#cfppaginate', function () {
    /* your code here */
    ppageindex = $(this).attr("index");
    loadflag = true;
    loadCfieldList(ppageindex);
});
var countcustomfieldCF = 0;
var defaultcolumncount = 5;
function cfhistorydata() {
    $('#cfheadrow').empty();
    $("#cfod").empty();
    var q1 = 2;
    var columnvalue = 0;
    var sort = 0;
    var vdate = $("#cfversion").val();
    var moduletype = $("#cfHistory").attr('data-val');
    if (moduletype == "NewNotice") {
        moduletype = "1";
    }
    else if (moduletype == "ReceivedNotice") {
        moduletype = "2";
    }
    else if (moduletype == "ReplyToNotice") {
        moduletype = "3";
    }
    else if (moduletype == "Rejoinder") {
        moduletype = "4";
    }
    var formData = new FormData();
    formData.append("VersionDate", EncodeText(vdate));
    formData.append("ModuleType", EncodeText(moduletype));
    var rt1 = $.ajax({
        async: true,
        type: "POST",
        url: "/api/CustomizeFormApi/LoadCustomFieledHeader",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.length > 0) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response);
                countcustomfieldCF = obj.length;
                var $header = "";
                var option = "";
                var checkvalue = "checked";
                var headerhsvalue = "display:table-cell";
                $header += '<th class="cfmattername"><div class="thbg">Notice Title</div> </th>';
                option += '<li><input  checked class="chkdhide"  type="checkbox" value="NoticeTitle"  name="cfmattername" ><a href="#" class="small" data-value="option " tabIndex="-1">Notice Title</a></li>';
                $.each(obj, function (i, val) {
                    q1 = q1 + 1;
                    columnvalue = columnvalue + 1;
                    sort = sort + 1;
                    if (columnvalue > defaultcolumncount) {
                        checkvalue = "";
                        headerhsvalue = "display:none";
                    }
                    $header += '<th  style="' + headerhsvalue + '" class="cfClass' + q1 + '"><div class="thbg">' + val.column_name + '</div></th>';
                    option += '<li><input  ' + checkvalue + ' class="chkdhide"  type="checkbox" value="' + val.column_name + '"  name="cfClass' + q1 + '" ><a href="#" class="small" data-value="option' + val.column_name + '" tabIndex="-1">' + val.column_name + '</a></li>';
                });
                $('#cfheadrow').append($header);
                $("#cfod").append(option);
            }
            else {
                alert("No record found.")
                return false;
            }
        },
        error: function () {
            alert('Error!');
        }
    });
    $.when(rt1).then(function (data, textStatus, jqXHR) {
        loadCfieldList(cfpageindex);
    });
}
/*Load custom field list*/
function loadCfieldList(cfpageindex) {
    $("#cfbindcasedata").empty();
    var fcode = localStorage.getItem("FirmCode");
    var moduletype = $("#cfHistory").attr('data-val');
    if (moduletype == "NewNotice") {
        moduletype = "1";
    }
    else if (moduletype == "ReceivedNotice") {
        moduletype = "2";
    }
    else if (moduletype == "ReplyToNotice") {
        moduletype = "3";
    }
    else if (moduletype == "Rejoinder") {
        moduletype = "4";
    }
    var formdata = new FormData();
    var vdate = $("#cfversion").val();
    formdata.append("pagenum", EncodeText(cfpageindex));
    formdata.append("pagesize", EncodeText(cfpagesize));
    formdata.append("VersionDate", EncodeText(vdate));
    formdata.append("ModuleType", EncodeText(moduletype));
    var ajaxTime = new Date().getTime();
    openload();
    var ld122 = $.ajax({
        async: true,
        url: '/api/CustomizeFormApi/LoadCustomFieledHistroy',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var totalTime = new Date().getTime() - ajaxTime;
            $("#cfcasetfooter").html("");
            if (response.length > 0) {
                if (response == "[]") {
                    alert("No Result found");
                    $("#footerhead,#ExporttoExcelCFHistory").hide();
                    return false;
                }
                else {
                    $("#footerhead,#ExporttoExcelCFHistory").show();
                }
                var obj = JSON.parse(response);
                var length = obj.length;
            }
            else {
                alert("No Result found");
                $("#footerhead,#ExporttoExcelCFHistory").hide();
                return false;
            }
            if (response.length > 2) {
                //$("#cfpdatastatus").html("");
            }
            else {
                closeload();
            }
            var qty = 0;
            var it = 2;
            var firstvalue = 0;
            var headerhsvaluechild = "display:table-cell";
            $.each(obj, function (i, val) {
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var pnext = pageindex;
                    var pprev = pageindex;
                    var pageno = pageindex;
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (val.totRow > 0) {
                        pnext = parseInt(pnext) + 1;
                        if (pnext == 0) pnext = 1;
                        pprev = parseInt(pageno) - 1;
                        if (pprev == 0) pprev = 1;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#cfpagnumvalue").attr("max", totpage);
                    }
                    var tfot = '';
                    tfot += '<ul>'
                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="cfpsotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="cfppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="cfpgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                    if (val.totRow <= length) {
                    }
                    else if (pageno == 1) {
                    }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="cfppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="cfppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a  id="cfppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                    }
                    tfot += '</ul>'
                    $("#cfcasetfooter").append(tfot);
                }
                qty = qty + 1;
                it = it + 1;
                var $row = $('<tr>');
                $row.append($('<td class="cfmattername" />').html("<span>" + val.NoticeTitle));
                var countcf = countcustomfieldCF;
                for (var str = 1; str <= countcf; str++) {
                    if (str > defaultcolumncount) {
                        headerhsvaluechild = "display:none";
                    }
                    else {
                        headerhsvaluechild = "display:table-cell";
                    }
                    if (str == 1) {
                        if (val.col1 == "") {
                            $row.append($('<td class="cfclass3" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col1 == null) {
                            $row.append($('<td class="cfclass3"  style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass3"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col1)));
                        }
                    }
                    if (str == 2) {
                        if (val.col2 == "") {
                            $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col2 == null) {
                            $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"   />').html("<span>" + checkdatetimecustom(val.col2)));
                        }
                    }
                    if (str == 3) {
                        if (val.col3 == "") {
                            $row.append($('<td class="cfclass5" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col3 == null) {
                            $row.append($('<td class="cfclass5" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass5"  style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col3)));
                        }
                    }
                    if (str == 4) {
                        if (val.col4 == "") {
                            $row.append($('<td class="cfclass6" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col4 == null) {
                            $row.append($('<td class="cfclass6" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass6"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col4)));
                        }
                    }
                    if (str == 5) {
                        if (val.col5 == "") {
                            $row.append($('<td class="cfclass7" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col5 == null) {
                            $row.append($('<td class="cfclass7" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass7"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col5)));
                        }
                    }
                    if (str == 6) {
                        if (val.col6 == "") {
                            $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col6 == null) {
                            $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col6)));
                        }
                    }
                    if (str == 7) {
                        if (val.col7 == "") {
                            $row.append($('<td class="cfclass9" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col7 == null) {
                            $row.append($('<td class="cfclass9" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass9"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col7)));
                        }
                    }
                    if (str == 8) {
                        if (val.col8 == "") {
                            $row.append($('<td class="cfclass10" style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col8 == null) {
                            $row.append($('<td class="cfclass10" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass10"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col8)));
                        }
                    }
                    if (str == 9) {
                        if (val.col9 == "") {
                            $row.append($('<td class="cfclass11" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col9 == null) {
                            $row.append($('<td class="cfclass11" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass11"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col9)));
                        }
                    }
                    if (str == 10) {
                        if (val.col10 == "") {
                            $row.append($('<td class="cfclass12" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col10 == null) {
                            $row.append($('<td class="cfclass12"  style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass12" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col10)));
                        }
                    }
                    if (str == 11) {
                        if (val.col11 == "") {
                            $row.append($('<td class="cfclass13" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col11 == null) {
                            $row.append($('<td class="cfclass13" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass13"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col11)));
                        }
                    }
                    if (str == 12) {
                        if (val.col12 == "") {
                            $row.append($('<td class="cfclass14" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col12 == null) {
                            $row.append($('<td class="cfclass14" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass14"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col12)));
                        }
                    }
                    if (str == 13) {
                        if (val.col13 == "") {
                            $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col13 == null) {
                            $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col13)));
                        }
                    }
                    if (str == 14) {
                        if (val.col14 == "") {
                            $row.append($('<td class="cfclass16"  style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col14 == null) {
                            $row.append($('<td class="cfclass16" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass16" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col14)));
                        }
                    }
                    if (str == 15) {
                        if (val.col15 == "") {
                            $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else if (val.col15 == null) {
                            $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                        }
                        else {
                            $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col15)));
                        }
                    }
                }
                $("#cfbindcasedata").append($row);
            });
            $("#cfhistorydata").removeAttr("disabled");
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld122).then(function (data, textStatus, jqXHR) {
        $("#CFHistoryData").removeAttr("disabled");
        closeload();
        return false;
    });
}
$("#ExporttoExcelCFHistory").click(function () {
    var chkArray3 = [];
    var selected = $("#cfod input[type='checkbox']:checked");
    selected.each(function () {
        chkArray3.push($(this).val());
    });
    var selected3;
    selected3 = chkArray3.join(',');
    if (selected3.length > 0) {
    }
    var vdate = $('#cfversion').val();
    if (vdate == "") {
        alert("Please select custom field version.");
        return false;
    }
    var moduletype = $("#cfHistory").attr('data-val');
    if (moduletype == "NewNotice") {
        moduletype = "1";
    }
    else if (moduletype == "ReceivedNotice") {
        moduletype = "2";
    }
    else if (moduletype == "ReplyToNotice") {
        moduletype = "3";
    }
    else if (moduletype == "Rejoinder") {
        moduletype = "4";
    }
    window.location = encodeURI("/CustomizeForm/ExportoExcelCustomFieldMatter?status=true&vdate=" + escape(vdate) + "&type=" + escape(moduletype) + "&exportcolumn=" + escape(selected3));
})
/*Export custom field history in excel*/
function fnExporttoExcelCFHistory() {
    var chkArray3 = [];
    var selected = $("#cfod input[type='checkbox']:checked");
    selected.each(function () {
        chkArray3.push($(this).val());
    });
    var selected3;
    selected3 = chkArray3.join(',');
    if (selected3.length > 0) {
    }
    var vdate = $('#cfversion').val();
    if (vdate == "") {
        alert("Please select custom field version.");
        return false;
    }
    var moduletype = $("#cfHistory").attr('data-val');
    if (moduletype == "NewNotice") {
        moduletype = "1";
    }
    else if (moduletype == "ReceivedNotice") {
        moduletype = "2";
    }
    else if (moduletype == "ReplyToNotice") {
        moduletype = "3";
    }
    else if (moduletype == "Rejoinder") {
        moduletype = "4";
    }
    window.location = encodeURI("/CustomizeForm/ExportoExcelCustomFieldMatter?status=true&vdate=" + vdate + "&type=" + moduletype + "&exportcolumn=" + selected3);
}
