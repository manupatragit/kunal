$(document).ready(function () {
    /*Save form data*/
    var type = 6;
    loadfield();
    var fcode = localStorage.getItem("FirmCode");
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(".validpanel").css("display", "none");
    loadform();
    /*Load form details*/
    function loadform() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCformSingle",
            headers: {
                'SubConfigurationType': id
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                $.each(obj, function (i, a) {
                    $("#formnamebruid").html(a["FormName"]);
                    $("#formname").html(a["FormName"]);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    var removeicon = 0;
    var sum = 0;
    /*Load custom field*/
    function loadfield() {
        $("#content").html("");
        removeicon = localStorage.getItem("fcount");
        if (removeicon == 0) {
            $(".glyphicon-trash").css("display", "none");
        }
        else {
            $(".glyphicon-trash").show();
        }
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/ViewCFormFields",
            headers: {
                'configurationtype': type,
                'SubConfigurationType': id
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var obj = JSON.parse(data.Data);
                var requireds;
                var sumyn = 0;
                if (data.Data == "[]") {
                    new PNotify({
                        title: 'Message!',
                        text: ' No Field Found !',
                        type: 'error',
                        delay: 3000
                    });
                }
                else {
                    $("#submitform").css("display", "block");
                }
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8 input-groups"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                        //  alert(sum);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                        //alert(sum);
                    }
                    // file
                    if (field["FieldType"] == "19") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="file" multiple="multiple"  value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="Date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                        $('#demotext' + sum).datetimepicker({
                            format: 'Y-m-d h:s'
                        });
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="10" onkeypress="return restrictAlphabets(event)" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span>  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" onkeypress="return restrictAlphabets(event)" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select id="demotext' + sum + '"  data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" class="form-control dymenu "  ' + requireds + ' name="demodropdown">';
                        var selectvalues = field['FieldValues'];
                        var ftd = field['Id'];
                        html += '<option value="">Select</option>';
                        $.each(selectvalues.split(','), function (key, value) {
                            html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                        });
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span>');
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline"><input type = "radio" data-taskid="' + field["Id"] + '"  class="gender  dymenu" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > ' + value1 + '</label>';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:right;padding:8px 0 0 2px;" class="teempclass"></span>');
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline"><input class="yesno dymenu " data-taskid="' + field["Id"] + '" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  > ' + value1 + '</label>';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:rights;padding:8px 0 0 2px;" class="teempclass"></span>');
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8" id="checkbox">';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value) {
                            html += '<label class="checkbox-inline"><input class="demotext' + sum + ' clist  dymenu"  data-taskid="' + field["Id"] + '" myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  >' + value + '</label >';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span>');
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select  data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="democlient">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span>');
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        loadcase();
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu case' + field['Id'] + ' " ' + requireds + ' name="democase">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span>');
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="demouser">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span>');
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="demoteam">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;cursor:context-menu" class="teempclass"></span>');
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
                closeload();
            }, //End of AJAX Success function
            failure: function (data) {
                alert(data.responseText);
                alert("fail");
            }, //End of AJAX failure function
            error: function (data) {
                alert(data.responseText);
                alert("error");
            } //End of AJAX error function
        });
    }
    /*save custom form data*/
    $('form[id="savecustomform"]').validate({
        submitHandler: function (form) {
            openload();
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
            col1 = null;
            col2 = null;
            col3 = null;
            col4 = '';
            col5 = "NULL";
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
            gtype = "gender";
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
                var inputType = $('#demotext1').attr('type');
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
            //end yesno
            //start chckboxlist
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
            //end   checkboxlist
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
            if (gtype == "gender") {
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
            var fc1 = $("#demotext1").attr('type');
            var fc2 = $("#demotext2").attr('type');
            var fc3 = $("#demotext3").attr('type');
            var fc4 = $("#demotext4").attr('type');
            var fc5 = $("#demotext5").attr('type');
            var fc6 = $("#demotext6").attr('type');
            var fc7 = $("#demotext7").attr('type');
            var fc8 = $("#demotext8").attr('type');
            var fc9 = $("#demotext9").attr('type');
            var fc10 = $("#demotext10").attr('type');
            var fc11 = $("#demotext11").attr('type');
            var fc12 = $("#demotext12").attr('type');
            var fc13 = $("#demotext13").attr('type');
            var fc14 = $("#demotext14").attr('type');
            var fc15 = $("#demotext15").attr('type');
            var totalFiles = "";
            var file = "";
            var filename = "";
            var formData = new FormData();
            var fileupload = "";
            try {
                if (fc1 == "file") {
                    fileUpload = document.getElementById("demotext1");
                    totalFiles = document.getElementById("demotext1").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext1").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext1").attr('id');
                    }
                }
                if (fc2 == "file") {
                    fileUpload = document.getElementById("demotext2");
                    totalFiles = document.getElementById("demotext2").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext2").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext2").attr('id');
                    }
                }
                if (fc3 == "file") {
                    fileUpload = document.getElementById("demotext3");
                    totalFiles = document.getElementById("demotext3").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext3").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext3").attr('id');
                    }
                }
                if (fc4 == "file") {
                    fileUpload = document.getElementById("demotext4");
                    totalFiles = document.getElementById("demotext4").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext4").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext4").attr('id');
                    }
                }
                if (fc5 == "file") {
                    fileUpload = document.getElementById("demotext5");
                    totalFiles = document.getElementById("demotext5").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext5").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext5").attr('id');
                    }
                }
                if (fc6 == "file") {
                    fileUpload = document.getElementById("demotext6");
                    totalFiles = document.getElementById("demotext6").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext6").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext6").attr('id');
                    }
                }
                if (fc7 == "file") {
                    fileUpload = document.getElementById("demotext7");
                    totalFiles = document.getElementById("demotext7").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext7").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext7").attr('id');
                    }
                }
                if (fc8 == "file") {
                    fileUpload = document.getElementById("demotext8");
                    totalFiles = document.getElementById("demotext8").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext8").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext8").attr('id');
                    }
                }
                if (fc9 == "file") {
                    fileUpload = document.getElementById("demotext9");
                    totalFiles = document.getElementById("demotext9").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext9").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext9").attr('id');
                    }
                }
                if (fc10 == "file") {
                    fileUpload = document.getElementById("demotext10");
                    totalFiles = document.getElementById("demotext10").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext10").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext10").attr('id');
                    }
                }
                if (fc11 == "file") {
                    fileUpload = document.getElementById("demotext11");
                    totalFiles = document.getElementById("demotext11").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext11").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext11").attr('id');
                    }
                }
                if (fc12 == "file") {
                    fileUpload = document.getElementById("demotext12");
                    totalFiles = document.getElementById("demotext12").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext12").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext12").attr('id');
                    }
                }
                if (fc13 == "file") {
                    fileUpload = document.getElementById("demotext13");
                    totalFiles = document.getElementById("demotext13").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext13").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext13").attr('id');
                    }
                }
                if (fc14 == "file") {
                    fileUpload = document.getElementById("demotext14");
                    totalFiles = document.getElementById("demotext14").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext14").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext14").attr('id');
                    }
                }
                if (fc15 == "file") {
                    fileUpload = document.getElementById("demotext15");
                    totalFiles = document.getElementById("demotext15").files.length;
                    for (var i = 0; i < totalFiles; i++) {
                        var file = document.getElementById("demotext15").files[i];
                        formData.append("FileUpload", file);
                        filename = $("#demotext15").attr('id');
                    }
                }
            }
            catch (err) {
                alert(err.message);
            }
            try {
                if (typeof (fileUpload.files) != "undefined") {
                    var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
                    if (size > filesize) {
                        new PNotify({
                            title: 'Warning!',
                            text: Filesizelabel,
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                        return false
                    }
                }
            }
            catch (err) {
            }
            formData.append("filename", filename);
            //end for gender
            //start others
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
            var workflowid = localStorage.getItem("stgid");
            var workflowtid = localStorage.getItem("taskid");
            formData.append("col1", col1);
            formData.append("col2", col2);
            formData.append("col3", col3);
            formData.append("col4", col4);
            formData.append("col5", col5);
            formData.append("col6", col6);
            formData.append("col7", col7);
            formData.append("col8", col8);
            formData.append("col9", col9);
            formData.append("col10", col10);
            formData.append("col11", col11);
            formData.append("col12", col12);
            formData.append("col13", col13);
            formData.append("col14", col14);
            formData.append("col15", col15);
            formData.append("wid", workflowid);
            formData.append("wtid", workflowtid);
            formData.append("wftoken", wftoken);
            $.ajax(
                {
                    type: "POST",
                    url: "/api/Callapi/SaveCustomformdata", // Controller/View
                    dataType: 'json',
                    headers: {
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
                        "ftype": id
                    },
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        $("#savecustomform")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: ' Data Submit Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#updatePanel").css("display", "none");
                        closeload();
                        window.location = encodeURI("/" + fcode + "/Client/WorkFlowNUserActivity/");
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
});
