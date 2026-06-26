$(document).ready(function () {
    //bindCommonDropdown("cosource", "SOURCE_REFERENCE", "Select Source");
    //bindCommonDropdown("coptype", "PROSPECT_TYPE", 'Select Prospect Type');
    //bindCommonDropdown("cocasetype", "Case_Type", 'Select Case Type');
    bindCommonDropdown("fcompanystructure", "COMPANY_STRUCTURE", 'Select Option');

    /*Reset contact*/
    function resetcontact() {
        $("#coctype").find('option:selected').removeAttr("selected");
        $("#cocomanyname").find('option:selected').removeAttr("selected");
        $("#coctype").prop("selectedIndex", 0);
        $("#cocomanyname").prop("selectedIndex", 0);
        $("#savecontact")[0].reset();
        $("#othercttype").css("display", "none");
        $("#logindiv").css("display", "none");
        $("#coothercomanyname").css("display", "none");
    }
    /*Reset*/
    $("#contactreset").click(function () {
        resetcontact();
        $("#cocomanyname").css("display", "block");
    });
    $("#cocomanyname").change(function () {
        var thisvaluec = $("#cocomanyname").val();
        $("#coothercomanyname").val("");
        if (thisvaluec == "Others") {
            $("#coothercomanynamediv").css("display", "table-row");
            $("#cocomanyname").css("display", "none");
        }
        else {
            $("#coothercomanynamediv").css("display", "none");
        }
    });
    //$("#coctype").change(function () {
    //    var thisvalue = $("#coctype option:selected").text();
    //    $("#gstinno").val("");
    //    $("#panno").val("");
    //    $("#othercttype").val("");
    //    if (thisvalue == "Others") {//others
    //        $("#content").show();
    //        $("#logindiv").css("display", "none");
    //        $("#prospectdiv").css("display", "none");
    //        $("#cttypeotherdiv").css("display", "block");
    //        $("#coinfodiv").show();
    //        $("#cowebsitediv").show();
    //        $("#pangstdiv").css("display", "none");
    //    }
    //    else if (thisvalue == "Client") { //client
    //        $("#content").hide();
    //        $("#logindiv").css("display", "block");
    //        $("#prospectdiv").css("display", "none");
    //        $("#cttypeotherdiv").css("display", "none");
    //        $("#coinfodiv").hide();
    //        $("#cowebsitediv").hide();
    //        $("#pangstdiv").css("display", "block");
    //    }
    //    else if (thisvalue == "Prospect") { //prospect
    //        $("#content").show();
    //        $("#logindiv").css("display", "none");
    //        $("#prospectdiv").css("display", "block");
    //        $("#cttypeotherdiv").css("display", "none");
    //        $("#coinfodiv").show();
    //        $("#cowebsitediv").show();
    //        $("#pangstdiv").css("display", "none");
    //    }
    //    else {//vendor
    //        $("#content").show();
    //        $("#logindiv").css("display", "none");
    //        $("#prospectdiv").css("display", "none");
    //        $("#cttypeotherdiv").css("display", "none");
    //        $("#coinfodiv").show();
    //        $("#cowebsitediv").show();
    //        $("#pangstdiv").css("display", "none");
    //    }
    //});
    $("#coptype").change(function () {
        var thisvaluec = $("#coptype").val();
        if (thisvaluec == "9") {
            $("#coptypediv").css("display", "none");
        }
        else {
            $("#coptypediv").css("display", "none");
        }
    });
    $("#cosource").change(function () {
        var thisvaluec = $("#cosource").val();
        if (thisvaluec == "5") {
            $("#cosourcediv").css("display", "none");
        }
        else {
            $("#cosourcediv").css("display", "none");
        }
    });
    //setInterval(function () {
    //    var temp = localStorage.getItem("contacttype");
    //    if (temp != "") {
    //        bindcontacttype();
    //        localStorage.setItem("contacttype", "");
    //    }
    //}, 2000);
    var fcode = localStorage.getItem("FirmCode");
    $("#addcontacttype").click(function () {
        openload();
        var url = "/" + fcode + "/firm/contacttype/";
        $('.mymodelstype1').load(url, function (result) {
            closeload();
            $("#myModaltypes").modal({ show: true });
        });
    });

    /*Bind contact type*/
    function bindcontacttype() {
        $("#contacttype").find('option')
            .remove()
            .end()
            .append('<option value="">Select</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadContactType",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["CTypeName"] + '</option>';
                    $("#contacttype").append(option);
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
    var cfstatus = "";
    /*Open status*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close status*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    openload();
    //loadfieldcount();
    $(".validpanel").css("display", "none");
    var newURL = window.location.protocol + "/" + window.location.host
    var pagetype = type
    if (pagetype == "7") {
        $("#showcontent").css("display", "block");
    }
    else {
        $("#showcontent").css("display", "block");
    }
    $('.shw').css("display", "none");
    $("#txtcustomFieldvalue").val('').hide();
    $("#lengthid").hide();
    $("#listid").hide();
    $("#common").css("display", "none");
    var loadfieldflag = false;
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

    //load Assign User
    //function assignuser() {
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/MatterApi/Assignuser",
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                var obj = JSON.parse(response.Data);
    //            }
    //            else {
    //                alert("not found");
    //            }
    //            $.each(obj, function (i, a) {
    //                if (String(usertoken) != a["Id"]) {
    //                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
    //                    $("#assign").append(option);
    //                }
    //            }); //End of foreach Loop
    //        }, //End of AJAX Success function
    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        } //End of AJAX error function
    //    });
    //}

    ////load field count
    //function loadfieldcount() {
    //    var ajaxTime = new Date().getTime();
    //    var ct1 = $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/demo/CustomFieldCount",
    //        headers: {
    //            'configurationtype': type
    //        },
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (data) {
    //            var totalTime = new Date().getTime() - ajaxTime;
    //            console.log("loadfieldcount:" + totalTime);
    //            var datas = JSON.stringify(data);
    //            localStorage.setItem("fcount", data.Data.length);
    //            if (data.Data.length == 2) {
    //                $("#publish").prop("disabled", "disabled");
    //                cfstatus = data.Data.length;
    //                document.getElementById("hidecf").style.display = "none";
    //            }
    //            else {
    //                document.getElementById("hidecf").style.display = "none";//"block";
    //                cfstatus = data.Data.length;
    //                $("#publish").removeProp("disabled");
    //            }
    //        },
    //        failure: function (data) {
    //            alert(data.responseText);
    //        },
    //        error: function (data) {
    //            alert(data.responseText);
    //        }
    //    });
    //    $.when(ct1).then(function (data, textStatus, jqXHR) {
    //        loadfield();
    //    });
    //}
    ////remove custom field
    //$("#removecfield").click(function () {
    //    $(".glyphicon-trash").css("display", "block");
    //});

    //// Publish page;
    //$("#publish").click(function () {
    //    openload();
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/demo/PublishPage",
    //        headers: {
    //            'configurationtype': type
    //        },
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (data) {
    //            $("#content").html("");
    //            var datas = JSON.stringify(data);
    //            loadfieldcount();
    //            $('.save').prop("disabled", false);
    //            $("#checkfalse").attr("id", "addcontact");
    //            new PNotify({
    //                title: 'Success!',
    //                text: ' Page Published Successfully',
    //                type: 'success',
    //                delay: 3000
    //            });
    //            closeload();
    //        },
    //        failure: function (data) {
    //            alert(data.responseText);
    //            closeload();
    //        },
    //        error: function (data) {
    //            alert(data.responseText);
    //            closeload();
    //        }
    //    });
    //});

    ////load custom field
    //function loadmenu() {
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/FirmApi/CustomFields",
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //            }
    //            else {
    //                alert("not found");
    //            }
    //            $.each(response.Data, function (i, a) {
    //                var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + (a["DefaultValues"] === null ? "" : a["DefaultValues"]) + '" aurl="' + (a["Url"] === null ? "" : a["Url"]) + '">' + a["Text"] + '</option>';
    //                $("#ctype").append(option);
    //            }); //End of foreach Loop
    //        }, //End of AJAX Success function
    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        } //End of AJAX error function
    //    });
    //}
    var sum = 0;
    /*Load field*/
    //function loadfield() {
    //    sum = 0;
    //    var ajaxTime1 = new Date().getTime();
    //    var rt1 = $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/demo/FirmEmployeescreate1",
    //        headers: {
    //            'configurationtype': type
    //        },
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (data) {
    //            var totalTime1 = new Date().getTime() - ajaxTime1;
    //            console.log("loadfield:" + totalTime1);
    //            var datas = JSON.stringify(data);
    //            var obj = JSON.parse(data.Data);
    //            if (obj.length > 0 && cfstatus == 2) {
    //                document.getElementById("hidecf").style.display = "none";
    //            }
    //            else {
    //                document.getElementById("hidecf").style.display = "none";//"block";
    //            }
    //            var requireds;
    //            var sumyn = 0;
    //            $.each(obj, function (i, field) {
    //                var html = '';
    //                var req = field["IsRequired"];
    //                if (req == false) {
    //                    requireds = "";
    //                }
    //                else {
    //                    requireds = "required";
    //                }
    //                //email
    //                if (field["FieldType"] == "14") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"  aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                // name
    //                if (field["FieldType"] == "15") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"  aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                // textbox
    //                if (field["FieldType"] == "6") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"   aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //date
    //                if (field["FieldType"] == " 22") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  ></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //datetime
    //                if (field["FieldType"] == " 3") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" ></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                    $('#demotext' + sum).datetimepicker({
    //                        format: 'Y-m-d h:s'
    //                    });
    //                }
    //                //no
    //                if (field["FieldType"] == " 5") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono" ></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //mobile
    //                if (field["FieldType"] == " 8") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10"  minlength="10" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //landline phone
    //                if (field["FieldType"] == " 9") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //zipcode
    //                if (field["FieldType"] == " 10") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span> <input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //address
    //                if (field["FieldType"] == " 7") {
    //                    sum = sum + 1;
    //                    var textBox = '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <sup class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true"><b>*</b></sup> </label> <span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><input class="form-control form-control-sm"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></div></div></div></div>';
    //                    $("#content").append(textBox);
    //                }
    //                //dropdown
    //                if (field["FieldType"] == " 4") {
    //                    sum = sum + 1;
    //                    var selectvalues = field['FieldValues'];
    //                    var ftd = field['Id'];
    //                    if (selectvalues != null) {
    //                        html += '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control form-control-sm "  ' + requireds + ' name="demodropdown">';
    //                        html += '<option value="">Select</option>';
    //                        $.each(selectvalues.split(','), function (key, value) {
    //                            html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
    //                        });
    //                        html += '</select>';
    //                    }
    //                    else {
    //                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><div class="col-md-4"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control "  ' + requireds + ' name="demodropdown">';
    //                        html += '<option value="none">You have not Added any Option</option>';
    //                        html += '</select>';
    //                    }
    //                    $("#content").append(html + '</div></div></div></div>');
    //                }
    //                //gender
    //                if (field["FieldType"] == " 11") {
    //                    sum = sum + 1;
    //                    html += '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"   aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><div  id="gender' + field['Id'] + '"> ';
    //                    var selectvalues1 = field['FieldValues'];
    //                    $.each(selectvalues1.split(','), function (key, value1) {
    //                        if (key == "0") {
    //                            html += '<label class="radio-inline"><input type = "radio" class="gender" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  >&nbsp;&nbsp; ' + value1 + '</label>';
    //                        }
    //                        else {
    //                            html += '<label class="radio-inline"><input type = "radio" class="gender"   placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > &nbsp;&nbsp;' + value1 + '</label>';
    //                        }
    //                    });
    //                    $("#content").append(html + '</div></div></div></div>');
    //                }
    //                //yes/no
    //                if (field["FieldType"] == " 16") {
    //                    sum = sum + 1;
    //                    sumyn = sumyn + 1;
    //                    html += '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;"  aria-required="true">*</span></label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><div class="" id="gender' + field['Id'] + '"> ';
    //                    var selectvalues1 = field['FieldValues'];
    //                    $.each(selectvalues1.split(','), function (key, value1) {
    //                        html += '<label class="radio-inline"><input class="yesno" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  >&nbsp;&nbsp; ' + value1 + '</label>';
    //                    });
    //                    $("#content").append(html + '</div></div></div></div>');
    //                }
    //                //checkboxlist
    //                if (field["FieldType"] == " 1") {
    //                    sum = sum + 1;
    //                    html += '<div class="col-md-4"><div class="row"><div class="form-group col-md-12"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"  style="color:red;font-size:10px;"  aria-required="true">*</span> </label ><span id="idss" value="' + field['Id'] + '" style="float:right;" class="glyphicon glyphicon-trash"></span><div class="" id="checkbox">';
    //                    var selectvalues1 = field['FieldValues'];
    //                    if (selectvalues1 != null) {
    //                        $.each(selectvalues1.split(','), function (key, value) {
    //                            html += '<p class="checkbox-inline zyx"><span style="margin-left:5px;">' + value + '</span> <input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  ></p >';
    //                        });
    //                    }
    //                    else {
    //                        html += '<p class="checkbox-inline"><input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="none" ' + requireds + '  >none</p >';
    //                    }
    //                    $("#content").append(html + '</div></div></div></div>');
    //                }

    //                var reqrd = field.IsRequired;
    //                var reqrdid = field.Id;
    //                if (String(reqrd) == "true") {
    //                    $(".rqd" + reqrdid).css("display", "unset");
    //                }
    //                else {
    //                    $(".rqd" + reqrdid).css("display", "none");
    //                }
    //            }); //End of foreach Loop
    //        }, //End of AJAX Success function
    //        failure: function (data) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (data) {
    //            alert(data.responseText);
    //        } //End of AJAX error function
    //    });
    //    $.when(rt1).then(function (data, textStatus, jqXHR) {
    //        removeicon = localStorage.getItem("fcount");
    //        if (removeicon == "2") {
    //            $(".glyphicon-trash").css("display", "none");
    //        }
    //        else {
    //            //$(".glyphicon-trash").css("display", "block");
    //            //alert("");
    //        }
    //        if (loadfieldflag == false) {
    //            bindcontacttype();
    //            loadmenu();
    //            loadfieldflag = true;
    //        }
    //    });
    //}

    ////delete id
    //$(document).on("click", "#idss", function () {
    //    $(".validpanel").css("display", "none");
    //    var t = $(this).attr("value");
    //    var result = confirm("Are you sure to delete this field?");
    //    if (result) {
    //        //Logic to delete the item
    //        openload();
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/demo/RemoveField",
    //            headers: {
    //                'configurationtype': type,
    //                'fid': t
    //            },
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (data1) {
    //                var datas1 = JSON.stringify(data1);
    //                $("#content").html("");
    //                sum = 0;
    //                loadfieldcount();
    //                closeload();
    //            },
    //            failure: function (data) {
    //                alert(data.responseText);
    //                closeload();
    //            },
    //            error: function (data) {
    //                alert(data.responseText);
    //                closeload();
    //            }
    //        });
    //    }
    //});
    ////save data
    //$("#addfield").click(function () {
    //    $(".validpanel").css("display", "none");
    //    var txtfn = $("#txtcustomFieldName").val();
    //    var ct = $("#ctype").val();
    //    var txtfv = $("#txtcustomFieldvalue").val();
    //    var txtr = $.trim($("#chkRequired").is(":checked"));
    //    if (txtfn == "") {
    //        $(".validpanel").css("display", "block").html(" Custom Field Name is Required !");
    //    }
    //    else if (ct == "0") {
    //        $(".validpanel").css("display", "block").html(" Select Custom Field Type is Required !");
    //    }
    //    else if (ct == "1" && txtfv == "") {
    //        $(".validpanel").css("display", "block").html(" Please Fill  Data in List Option!");
    //    }
    //    else if (ct == "4" && txtfv == "") {
    //        $(".validpanel").css("display", "block").html(" Please Fill  Data in List Option!");
    //    }
    //    else {
    //        if (sum < 15) {
    //            $.ajax(
    //                {
    //                    type: "POST",
    //                    url: "/api/demo/PostSaveFirmCustomFields", // Controller/View
    //                    data: {
    //                        FieldName: txtfn,
    //                        FieldType: ct,
    //                        FieldValues: txtfv,
    //                        IsRequired: txtr,
    //                        ConfigurationType: type,
    //                        Sequence: "1",
    //                        IsPositionChangable: "true",
    //                        IsDefault: "true",
    //                        IsActive: "false"
    //                    },
    //                    success: function (data) {
    //                        document.getElementById("closemodal").click();
    //                        $("#form2")[0].reset();
    //                        $("#content").html("");
    //                        sum = 0;
    //                        loadfieldcount();
    //                        $(".validpanel").css("display", "none");
    //                    }, //End of AJAX Success function
    //                    failure: function (data) {
    //                        alert(data.responseText);
    //                    }, //End of AJAX failure function
    //                    error: function (data) {
    //                        alert(data.responseText);
    //                    } //End of AJAX error function
    //                });
    //        }
    //        else {
    //            $(".validpanel").css("display", "block").html(" You have Completed max limit to Add custom Field !");
    //        }
    //    }
    //});
    //save data
    $('form[id="savecontact"]').validate({
        submitHandler: function (form) {
            try {
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
                //take value
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
                //start yes no
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
                comname = $("#comname").val();
                cofname = $("#cofname").val();
                colname = $("#colname").val();
                codesignation = $("#codesignation").val();
                cocomanyname = $("#comanyidinput").val();
                coothercomanyname = $("#coothercomanyname").val();
                comobile = $("#comobile").val(),
                    coemail = $("#coemail").val();
                colandline = $("#colandline").val();
                coaddress = $("#coaddress").val();
                copin = $("#copin").val();
                cocountry = $("#cocountry").val();
                costate = $("#costate").val();
                cocity = $("#cocity").val();
                cowebsite = $("#cowebsite").val();
                coinfo = $("#coinfo").val();
                coctype = $("#coctype").val();
                othercttype = $("#othercttype").val();
                var contacttypetext = $("#coctype option:selected").text();
                cosource = $("#cosource").val();
                if (cosource == "Others") {
                    cosource = $("#coothersource").val();
                }
                coptype = $("#coptype").val();
                if (coptype == "Others") {
                    coptype = $("#cootherptype").val();
                }
                cocasetype = $("#cocasetype").val();
                couserid = $("#couserid").val();
                copassword = $("#copassword").val();
                cocpassword = $("#cocpassword").val();
                coinfo = $("#coinfo").val();
                var contcatflag1 = 0;
                if (comobile != "") {
                    if (comobile.length < 10) {
                        $("#lblmobile-error").text = "Mobile Phone should be 10 digit.";
                        document.getElementById("comobile").focus();
                        return false;
                    }
                }
                if (colandline != "") {
                    if (colandline.length < 10) {
                        $("#lbllandline-error").text = "Landline should be minimum 10 digit.";
                        document.getElementById("colandline").focus();
                        return false;
                    }
                }
                if (cocomanyname == "Others") {
                    if (coothercomanyname == "") {
                        $("#lblcoothercomanyname-error").text = "Enter Company Name";
                        document.getElementById("coothercomanyname").focus();
                        return false;
                    }
                    else {
                        if (coothercomanyname.toUpperCase() == "OTHERS") {
                            $("#lblcoothercomanyname-error").text = "Company Name Already Exist";
                            document.getElementById("coothercomanyname").focus();
                            return false;
                        }
                    }
                    cocomanyname = coothercomanyname;
                }
                coctype = $("#coctype").val();
                if (contacttypetext == "Others") {
                    if (othercttype == "") {
                        $("#lblothercttype-error").text = "Enter Contact Type";
                        document.getElementById("othercttype").focus();
                        return false;
                    }
                    else {
                        if (othercttype.toUpperCase() == "OTHERS" || othercttype.toUpperCase() == "PROSPECT" || othercttype.toUpperCase() == "VENDOR" || othercttype.toUpperCase() == "CLIENT") {
                            $("#lblothercttype-error").text = "Contact Type Already Exist";
                            document.getElementById("othercttype").focus();
                            return false;
                        }
                    }
                    coctype = othercttype;
                    contcatflag1 = 1;
                }
                var gstinno = "";
                var panno = "";
                contacttypetext = "Client";
                if (contacttypetext == "Client") {
                    gstinno = $("#gstin").val();
                    panno = $("#panno").val();
                    if (gstinno != "") {
                        if (gstinno == "") {
                            $("#lblgstin-error").html("Please enter GSTIN no");
                            document.getElementById("gstin").focus();
                            return false;
                        }
                        else {
                            if (gstinno.length != 15) {
                                $("#lblgstin-error").html("GSTIN no should be 15 character");
                                document.getElementById("panno").focus();
                                return false;
                            }
                            else {
                                $("#lblgstin-error").html("");
                            }
                        }
                    }
                    if (panno != "") {
                        if (panno == "") {
                            $("#lblpanno-error").html("Please enter PAN no");
                            document.getElementById("panno").focus();
                            return false;
                        }
                        else {
                            $("#lblpanno-error").html("");
                        }
                        var panregex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                        if (panregex.test(panno) == false) {
                            $("#lblpanno-error").html("Please Enter valid PAN no");
                            return false;
                        }
                        else {
                            $("#lblpanno-error").html("");
                        }
                    }
                }
                var formData = new FormData();
                var tempsize = 0;
                var tottempsize = 0;
                var totalFiles = document.getElementById("coattechment").files.length;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("coattechment").files[i];
                    var filename = file.name;
                    if (filename.length > 100) {
                        $("#lblcoattechment-error").text = "File name should not be more than 70 character. Please check file name: " + filename;
                        return false;
                    }
                    var Extresponse = checkfileext(filename);
                    if (String(Extresponse) == "false") {
                        return false;
                    }
                    formData.append("FileUpload", file);
                    try {
                        if (typeof (file) != "undefined") {
                            size = parseFloat(file.size / 1024).toFixed(2);
                            tottempsize = parseFloat(tottempsize) + parseFloat(size);
                            tempsize = parseFloat(size);
                        }
                    }
                    catch (err) {
                        //alert(err.message);
                    }
                    tempsize = tempsize.toFixed(2);
                    if (tempsize > filesize) {
                        new PNotify({
                            title: 'Warning!',
                            text: Filesizelabel,
                            type: 'error',
                            delay: 3000
                        });
                        return false
                    }
                }
                var Comapyidss = $("#comanyidinput").val();
                var coaadharno = $("#coaadharno").val();
                var companynameinput = $("#comanynameinput").val();
                if (Comapyidss != "00000000-0000-0000-0000-000000000000") {
                    if (companynameinput == "") {
                        alert("Please enter companyname!");
                        return false;
                    }
                }

                var fcompanystructure = "";
                if ($("#fcompanystructure").val() == null || $("#fcompanystructure").val() == undefined) {
                    fcompanystructure = "";
                }
                else {
                    fcompanystructure = $("#fcompanystructure").val();
                }

                coctype = "Client";
                formData.append("gstinno", EncodeText(gstinno));
                formData.append("panno", EncodeText(panno));
                formData.append("coinfo", EncodeText(coinfo));
                formData.append("cofname", EncodeText(cofname));
                formData.append("comname", EncodeText(comname));
                formData.append("colname", EncodeText(colname));
                formData.append("codesignation", EncodeText(codesignation));
                formData.append("cocomanyname", EncodeText(cocomanyname));
                formData.append("coothercomanyname", EncodeText(coothercomanyname));
                formData.append("comobile", EncodeText(comobile));
                formData.append("coemail", EncodeText(coemail));
                formData.append("colandline", EncodeText(colandline));
                formData.append("coaddress", EncodeText(coaddress));
                formData.append("copin", EncodeText(copin));
                formData.append("cocountry", EncodeText(cocountry));
                formData.append("costate", EncodeText(costate));
                formData.append("cocity", EncodeText(cocity));
                formData.append("coctype", EncodeText(coctype));
                formData.append("cowebsite", EncodeText(cowebsite));
                formData.append("cosource", EncodeText(cosource));
                formData.append("coptype", EncodeText(coptype));
                formData.append("cocasetype", EncodeText(cocasetype));
                formData.append("othercttype", EncodeText(othercttype));
                formData.append("couserid", EncodeText(couserid));
                formData.append("cocpassword", EncodeText(cocpassword));
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
                formData.append("contcatflag", EncodeText(contcatflag1));
                formData.append("coaadharno", EncodeText(coaadharno));
                formData.append("loginid", EncodeText(loginid));
                var leadid = $('#hdnleadid').val();
                formData.append("leadid", EncodeText(leadid));
                formData.append("fcompanystructure", EncodeText(fcompanystructure));
                formData.append("companynameinput", EncodeText(companynameinput));
                openload();
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/CallApi/UpdateContactsForClient", // Controller/View
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
                            "ftype": type
                        },
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            if (parseInt(data.Data.Result) > 0) {
                                var InfectFilesResult = "";
                                if (data.Data.InfectFiles != "") {
                                    InfectFilesResult = VirusScanResultMsgBefore + " " + data.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                                }
                                new PNotify({
                                    title: 'Success!',
                                    text: 'client updated successfully.</br>' + InfectFilesResult,
                                    type: 'success',
                                    delay: 3000
                                });
                                closeload();
                                var fcode = localStorage.getItem("FirmCode");
                                window.location.href = "/" + fcode + "/firm/contactslist";
                            }
                            else if (String(data.Data.Result) == "EXCEEDLIMIT") {
                                alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                                closeload();
                                return false;
                            }
                            else if (String(data.Data.Result) == "NOLIMIT") {
                                alert("Please Upgrade Your Storage Limit");
                                closeload();
                                return false;
                            }
                            else {
                                alert(data.Data);
                                closeload();
                            }
                        },
                        failure: function (data) {
                            alert(data.responseText);
                            closeload();
                        },
                        error: function (data) {
                            alert(data.responseText);
                            closeload();
                        }
                    });
            }
            catch (err) {
                alert(err.message);
            }
        }
    });

    /*Load client details*/
    function LoadClientData() {
      
        var formData = new FormData();
        formData.append("clientid", EncodeText(loginid));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadClientData",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    if (a.IsCompany == "1") {
                        $('input:radio[name=fullselectusertype]').val(['company']);
                        $("#companynamediv,#companystructurediv").show();
                    }
                    else {
                        $('input:radio[name=fullselectusertype]').val(['user']);
                        $("#companynamediv,#companystructurediv").hide();
                    }
                    $("#cocomanyname option[value='Others']").remove();
                    if (a.fname != "") a.cfname = a.fname;
                    if (a.mname != "") a.cmname = a.mname;
                    if (a.lname != "") a.clname = a.lname;
                    $("#cofname").val(a.cfname);
                    $("#comname").val(a.cmname);
                    $("#colname").val(a.clname);
                    $("#codesignation").val(a.Designation);
                    $("#comanyidinput").val(a.CompanyId);
                    $("#comanynameinput").val(a.CompanyName);
                    $('#fcompanystructure option[value=' + a.CompanyStructure + ']').attr("selected", true);
                    $("#comobile").val(a.cmobile);
                    $("#coemail").val(a.EmailId);
                    $("#colandline").val(a.clandline);
                    $("#coaadharno").val(a.AadharCardNo);
                    $("#coaddress").val(a.caddress);
                    $("#copin").val(a.Pin);
                    $('#cocountry option[value="' + a.country + '"]').attr("selected", true);
                    if (a.country == "India") {
                        $('#costate option[value="' + a.cstate + '"]').attr("selected", true);
                        $("#costate").change();
                    }
                    setTimeout(function () {
                        $('#cocity option[value="' + a.ccity + '"]').attr("selected", true);
                        closeload();
                    }, 3000);
                    $("#cowebsite").val(a.cwebsite);
                    $("#gstin").val(a.GSTINNo);
                    $("#panno").val(a.PANNo);
                    $("#coinfo").val(a.OtherDetails);
                    $('#cocasetype option[value="' + a.casetype + '"]').attr("selected", true);
                    $('#hdnleadid').val(a.leadid);
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

    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", EncodeText(dropdownname));
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                }); //End of foreach Loop
                if (dropdownname == "COMPANY_STRUCTURE") {
                    setTimeout(function () { LoadClientData(); }, 1000);
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
});