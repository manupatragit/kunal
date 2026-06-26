var StatuteItems = [];
StatuteItems.length = 0;
var casewatchcaseid = "";
$(document).ready(function () {
    /*Remove case for live update*/
    $(document).on("click", "#RemoveCaseForLiveupdate", function () {
        var result = confirm("Are you sure to remove matter live update?");
        if (result) {
            openload();
            var formdata = new FormData();
            formdata.append("caseid", EncodeText(token));
            openload();
            $.ajax({
                async: true,
                url: '/api/matterApi/UnLinkCaseToCaseWatch',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: ' Matter live update removed successfully',
                            type: 'success',
                            delay: 3000
                        });
                        location.reload();
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning!',
                            text: ' You are not Authotized to delete this Matter !',
                            type: 'error',
                            delay: 2000
                        });
                        closeload();
                    }
                },
                error: function () {
                    alert('Error!');
                    closeload();
                }
            });
        }
    });
    var countbind = 0;
    openload();
    bindCommonDropdown("fmattertype", "Matter_Type", "Select");
    bindCommonDropdown("fcasecasetype", "Case_Type", "Select");
    bindCommonDropdown("fcasestatus", "Case_Status", "Select");
    bindCommonDropdown("fdisposedoption", "Disposed_Option", "Select");
    bindCommonDropdown("fdisputemattertype", "Dispute_Resolution", "Select");
    //$(document).on("click", "#fmmatterDetails", function () {
    //    bind_MatterTypeDetails();
    //});
    $(document).on("click", "#opencasewatchmodel", function () {
        FillCourtType();
    });

   
    $(document).on("click", "#case_btnsave1", function () {
        var sd1 = $("#fName").val();
        var rd1 = $("#fEmail").val();
        var sd2 = $("#fPhone").val();
        var rd2 = $("#fType").val();
        if (sd1 == "") {
            alert("Please enter the name.");
            $("#fName").focus();
            return false;
        }
        var regex = /^[a-zA-Z. ]*$/;
        if (!regex.test(sd1) == true) {
            alert("Invalid Name");
            $("#fName").focus();
            return false;
        }
        //if (rd1 == "") {
        //    alert("Enter Email");
        //    $("#fEmail").focus();
        //    return false;
        //}
        //var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
        //if (reg.test(rd1) == false) {
        //    alert('Invalid Email Address');
        //    return false;
        //}
        //if (sd2 == "") {
        //    alert("Enter Phone");
        //    $("#fPhone").focus();
        //    return false;
        //}
        //var phoneno = /^\d{10}$/;
        //if (!sd2.match(phoneno)) {
        //    alert("Invalid Phone Number");
        //    return false;
        //}
        //if (rd2 == "") {
        //    alert("Enter Type");
        //    $("#fType").focus();
        //    return false;
        //}
        //if (!regex.test(rd2) == true) {
        //    alert("Invalid Type");
        //    $("#fType").focus();
        //    return false;
        //}
        var formData = new FormData();
        formData.append("fName", EncodeText($("#fName").val()));
        formData.append("fEmail", EncodeText($("#fEmail").val()));
        formData.append("fPhone", EncodeText($("#fPhone").val()));
        formData.append("fType", EncodeText($("#fType").val()));
        formData.append("caseid", EncodeText(token));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExtraParty/PostSaveLitigation",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    alert("Successfully saved");
                    bind_MatterTypeDetails();
                }
                else {
                    alert("Oops! Something went wrong..");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });

    /*Remove case*/
    $(document).on('click', '.remove_case', function () {
        var Id = $(this).data("id");
        var otherflagvalue = $(this).attr("id")
        var formData = new FormData();
        formData.append("Id", Id);
        formData.append("flag", otherflagvalue);
        var r = confirm("Are you sure you want to Delete entry?");
        if (r == true) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/ExtraParty/DeleteCaseFillingDateTemp",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.Status == true) {
                        alert("Successfully Removed");
                        openload();
                        bind_MatterTypeDetails();
                        closeload();
                    }
                    else {
                        alert("Oops! Something went wrong..");
                    }
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
    try {
        var today = new Date().toISOString().split('T')[0];
        $("#fcaseodate").val(today);
    }
    catch (er) {
    }
    var cfstatus = "";
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#modalopenpartyname", function () {
        openload();
        var url = "/" + fcode + "/CW/SearchByPartyNameForCase";
        $('.partynamebody').load(url, function (result) {
            closeload();
            localStorage.setItem("partsearchid", "");
            localStorage.setItem("partycourttype", "");
            $("#myModalpartename").modal({ show: true });
        });
    });

    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                countbind = countbind + 1;
                if (countbind > 4) {
                    loadfieldcount();
                }
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
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
    //Get matter type
    $('#fmattertype').change(function () {
        var mattertypeid = $('#fmattertype').val();
        if (mattertypeid == '42') {
            $("#divfcasetype").show();
            $("#divsubjecttype").show();
            $("#divcasedescription").show();
            $("#divVSCF").show();
            $("#divcourt").show();
            if (dashcw == "display:unset" && IsCWActive == "1") {
                $("#divaddliveupdate").hide();
                $('#modalopenpartyname').hide();
            }
            else {
                $("#divaddliveupdate").hide().attr("id", "notauthorizedliveupdate");
                $('#modalopenpartyname').hide().attr("id", "notauthorized");
            }
           // $('#divMatterdetais').hide();
            $('#divMatterdetais').show();
            $('#divfcourt').show();
        }
        else {
            $("#divfcasetype").hide();
            $("#divsubjecttype").show();
            $("#divcasedescription").show();
            $("#divVSCF").hide();
            $("#divcourt").hide();
            $("#divcnrno").hide();
            $("#divaddliveupdate").hide();
            $('#divMatterdetais').show();
            $('#divcasetypeoption').hide();
            $("#CertifiedCopyAppliedon,#CertifiedCopyReceivedon").val("");
            $('input[name="rdcasetype"]').attr('checked', false);
            $('#divfcourt').hide();
            $('#modalopenpartyname').hide();
        }
        if (mattertypeid == '46') {
            $("#fmattertypeother").show();
            $("#fmattertypeotherdiv").show();
        }
        else {
            $("#fmattertypeother").hide();
            $("#fmattertypeotherdiv").hide();
        }
        if (mattertypeid == '44') {
            $("#fdisputemattertype").show();
            $("#fdisputemattertypediv").show();
        }
        else {
            $("#fdisputemattertype").hide();
            $("#fdisputemattertypediv").hide();
        }
    });
    $('#fcaseodate').change(function () {
        $("#limitdate").attr("min", $("#fcaseodate").val());
    });
    //CheckUserCasesMapCaseStatusMaster();
    var caseopendt = $("#fcaseodate").val();
    $('#fcasestatus').change(function () {
        var fstatusid = $('#fcasestatus').val();
        if (fstatusid == '38') {
            $("#fdisposedoption").show();
        }
        else {
            $("#fdisposedoption").val("");
            $("#fdisposedoption").hide();
        }
    });
    $('#fcourt').on('change', function () {
        var selectid = this.value;
        if (selectid == "") {
            $("#fothercourtdiv").hide();
            return false;
        }
        if (selectid == "Supreme Court") {
            $("#fothercourtdiv").hide();
            $("#fothercourt").val("");
        }
        else {
            $("#fothercourtdiv").show();
        }
    });
    var loadfieldflag = false;
    setInterval(function () {
        var tempcases = localStorage.getItem("casesubject");
        if (tempcases != "") {
            bindcasesubject();
            localStorage.setItem("casesubject", "");
        }
    }, 2000);

    /*Attchment*/
    $("#attachment").change(function () {
        var tempsize1 = 0;
        var tottempsize1 = 0;
        var totalFiles1 = document.getElementById("attachment").files.length;
        for (var i = 0; i < totalFiles1; i++) {
            var file1 = document.getElementById("attachment").files[i];
            var filename1 = file1.name;
            if (filename1.length > 35) {
                alert("File name should not be more than 35 character. Please check file name: " + filename1);
                $("#attachment").val("");
                return false;
            }
            var Extresponse = checkfileext(filename1);
            if (String(Extresponse) == "false") {
                return false;
            }
            try {
                if (typeof (file1) != "undefined") {
                    size1 = parseFloat(file1.size / 1024).toFixed(2);
                    tottempsize1 = parseFloat(tottempsize1) + parseFloat(size1);
                    tempsize1 = parseFloat(size1);
                }
            }
            catch (err) {
                //alert(err.message);
            }
            tempsize1 = tempsize1.toFixed(2);
        }
    });

    /*Bind case subject*/
    function bindcasesubject() {
        $("#casesubject").empty();
        $("#casesubject").find('option')
            .remove()
            .end()
            .append('<option value="">Select</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/Loadcasesubject",
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
                    var option = '<option value="' + a["Id"] + '" >  ' + a["SubjectName"] + '</option>';
                    $("#casesubject").append(option);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
        return false;
    }
    try {
        $(document).on("click", "#addcasesubject", function () {
            openload();
            var url = "/" + fcode + "/firm/casesubject/";
            $('.mymodelstype').load(url, function (result) {
                closeload();
                $("#myModaltypes").modal({ show: true });
            });
        });
    }
    catch (er) {
    }
    /*Link to create contact*/
    $("#linkcontact").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/Configcontact/contact");
    });
    $("#hide").click(function () {
        $(".glyphicon-trash").css("display", "none");
    });

    $("#removecfield").click(function () {
        $(".glyphicon-trash").css("display", "block");
    });
    $(".validpanel").css("display", "none");
    var newURL = window.location.protocol + "/" + window.location.host
    var pagetype = type
    if (pagetype == "8") {
        $("#showcontent").css("display", "block");
    }
    else {
        $("#showcontent").css("display", "block");
    }
    var loadfieldflag = true;
    /*Load field count*/
    function loadfieldcount() {
        var ajaxTime = new Date().getTime();
        var ct1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/CustomFieldCount",
            headers: {
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("fieldcount:" + totalTime);
                var datas = JSON.stringify(data);
                localStorage.setItem("fcount", data.Data.length);
                if (data.Data.length == 2) {
                    cfstatus = data.Data.length;
                    document.getElementById("hidecf").style.display = "none";
                    $("#publish").prop("disabled", "disabled");
                    $(".glyphicon").removeProp("display");
                }
                else {
                    document.getElementById("hidecf").style.display = "block";
                    cfstatus = data.Data.length;
                    $("#publish").removeProp("disabled");
                    $(".glyphicon").prop("display", "block");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.when(ct1).then(function (data, textStatus, jqXHR) {
            if (loadfieldflag == true) {
                loadfield();
                loadfieldflag = false;
            }
        });
    }
    var removeicon = 0;
    var sum = 0;
    /*Load fields*/
    function loadfield() {
        sum = 0;
        var ajaxTime1 = new Date().getTime();
        var rt1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/FirmEmployees1",
            headers: {
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var totalTime1 = new Date().getTime() - ajaxTime1;
                console.log("loadfield:" + totalTime1);
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
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> </label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" ></div></div></div></div>';
                        $("#content").append(textBox);
                        $('#demotext' + sum).datetimepicker({
                            format: 'Y-m-d h:s'
                        });
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10"  minlength="10" onkeypress="return restrictAlphabets(event)" ><span id="idss" class="cusfeild" value="' + field['Id'] + '"></span></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <sup class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true"><b>*</b></sup> </label> <input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        var selectvalues = field['FieldValues'];
                        var ftd = field['Id'];
                        if (selectvalues != null) {
                            html += '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control form-control-sm "  ' + requireds + ' name="demodropdown">';
                            html += '<option value="">Select</option>';
                            $.each(selectvalues.split(','), function (key, value) {
                                html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                            });
                            html += '</select>';
                        }
                        else {
                            html += '<div class="form-group"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><div class="col-md-6"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control "  ' + requireds + ' name="demodropdown">';
                            html += '<option value="none">You have not Added any Option</option>';
                            html += '</select>';
                        }
                        $("#content").append(html + '</div></div></div></div>');
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        html += '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><div  id="gender' + field['Id'] + '"> ';
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
                        html += '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"  aria-required="true">*</span></label ><div class="" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline formLabel colorDark"><input class="yesno" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  >&nbsp;&nbsp; ' + value1 + '</label>';
                        });
                        $("#content").append(html + '</div></div></div></div>');
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        html += '<div class="col-md-6"><div><div class="form-group"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"  aria-required="true">*</span> </label ><div class="" id="checkbox">';
                        var selectvalues1 = field['FieldValues'];
                        if (selectvalues1 != null) {
                            $.each(selectvalues1.split(','), function (key, value) {
                               if (value != "") {
                                    var valueid = value.replace(/\s/g, '');
                                }
                                html += '<p class="checkbox-inline zyx"><span style="margin-left:5px;">' + value + '</span> <input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + valueid + '" ' + requireds + '  ></p >';
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
            loadcf();
        });
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("CertifiedCopyAppliedon").setAttribute("max", today);
    document.getElementById("CertifiedCopyReceivedon").setAttribute("max", today);
    function loadcf() {
        d2 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/MatterApi/SpColMaps1',
            headers: {
                'fid': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
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
                    alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(d2).then(function (data, textStatus, jqXHR) {
            CaseBasicDetails();
        });
    }
    $('.shw').css("display", "none");
    $("#txtcustomFieldvalue").val('').hide();
    $("#lengthid").hide();
    $("#listid").hide();
    $("#common").css("display", "none");
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

    /*Load client list*/
    function loadclientlist() {
        $('#clientname').find('option').not(':first').remove();
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpClientData',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    // alert("not found");
                }
                var option = '<option value="">Select</option>';
                $.each(obj, function (i, a) {
                    option = '<option value="' + a["LoginId"] + '" >  ' + a["Username"] + '</option>';
                    $("#clientname").append(option);
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

    /*Load menu*/
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/FirmApi/CustomFields",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var t = a.Id;
                    var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + (a["DefaultValues"] === null ? "" : a["DefaultValues"]) + '" aurl="' + (a["Url"] === null ? "" : a["Url"]) + '">  ' + a["Text"] + '</option>';
                    $("#ctype").append(option);
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

    ///delete id
    $(document).on("click", "#idss", function () {
        $(".validpanel").css("display", "none");
        var t = $(this).attr("value");
        //alert(t);
        var result = confirm("Are you sure to delete this field?");
        if (result) {
            //Logic to delete the item
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/MatterApi/RemoveField",
                headers: {
                    'configurationtype': type,
                    'fid': t
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data1) {
                    var datas1 = JSON.stringify(data1);
                    $("#content").html("");
                    sum = 0;
                    loadfieldcount();
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
    //save data
    $("#addfield").click(function () {
        $(".validpanel").css("display", "none");
        var txtfn = $("#txtcustomFieldName").val();
        var ct = $("#ctype").val();
        var txtfv = $("#txtcustomFieldvalue").val();
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
                        url: "/api/demo/PostSaveFirmCustomFields", // Controller/View
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
                            document.getElementById("closemodal").click();
                            $("#form2")[0].reset();
                            new PNotify({
                                title: 'Success!',
                                text: ' Custom Field   Added Successfully',
                                type: 'info',
                                delay: 3000
                            });
                            $("#content").html("");
                            sum = 0;
                            loadfieldcount();
                            $(".validpanel").css("display", "none");
                        }, //End of AJAX Success function
                        failure: function (data) {
                            alert(data.responseText);
                        }, //End of AJAX failure function
                        error: function (data) {
                            alert(data.responseText);
                        } //End of AJAX error function
                    });
            }
            else {
                $(".validpanel").css("display", "block").html(" You have Completed max limit to Add custom Field !");
            }
        }
    });

    /*Fill court type*/
    function FillCourtType() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/Firm/FillCourt",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var option = '<option value="">--Select Court--</option>';
                $.each(response, function (i, a) {
                    option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
                });
                option += '<option value="6" >Revenue Court</option>';
                option += '<option value="7" >RERA Court</option>';
                $("#divSCHCDistrict").append(option);//End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }

    /*Load user by case id*/
    function loaduserbycaseid() {
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(1));
        formdata.append("pagesize", EncodeText(2000));
        formdata.append("caseid", token);
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadUsersByCaseIdForAlerts',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var obj = JSON.parse(response.Data);
                var option = '<option value="">Select Users</option>';
                $.each(obj, function (i, a) {
                    option += '<option value="' + a["auser"] + '" >  ' + a["cfname"] + '(' + a["Username"] + ')</option>';
                });
                $("#UsersCasewatchAlert").empty().append(option);//End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX er
        });
    }
    $("#opencasewatchusermodal").click(function () {
        loaduserbycaseid();
        LoadCasewatchAlertUsers();
    });
    /*Save case watch user details*/
    $("#savecasewatchuser").click(function () {
        var formData = new FormData();
        var casealerruser = $("#UsersCasewatchAlert").val();
        if (casealerruser == "") {
            alert("Please select user");
            $("#UsersCasewatchAlert").focus();
            return false;
        }
        formData.append("auser", EncodeText(casealerruser));
        formData.append("caseid", EncodeText(casewatchcaseid));
        formData.append("token", EncodeText(token));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/SaveCasewatchAlertUsers",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("User Added successfully");
                $("#UsersCasewatchAlert").val("");
                LoadCasewatchAlertUsers();
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    /*Delete case watch user details*/
    $(document).on("click", "#deleteCasewatchuseralert", function () {
        var formData = new FormData();
        var auserslist = $(this).attr("data-user");
        var cwid = $(this).attr("data-id");
        formData.append("auser", EncodeText(auserslist));
        formData.append("caseid", EncodeText(cwid));
        formData.append("token", EncodeText(token));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/RemoveCasewatchAlertUsers",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("User removed successfully");
                LoadCasewatchAlertUsers();
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    /*Load casewatch alert user*/
    function LoadCasewatchAlertUsers() {
        var formData = new FormData();
        formData.append("caseid", EncodeText(casewatchcaseid));
        var htmls = '';
        var q1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CasewatchAlertUsersList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    q1 = q1 + 1;
                    htmls += ' <tr><td>' + q1 + '</td><td>' + a["vDispName"] + '</td><td>' + a["email_id"] + '</td><td>' + a["mobile_No"] + '</td><td><span class="glyphicon glyphicon-trash" id="deleteCasewatchuseralert" data-id="' + a.Usercseid + '" data-user="' + a.User_Id + '" style="color:red;cursor:pointer;" title="Remove user from case alert"></span></td></tr>';
                }); //End of foreach Loop
                $("#bindcasewatchalertuser").empty().html(htmls);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }

    /*Check user case map case status master*/
    //function CheckUserCasesMapCaseStatusMaster() {
    //    var formData = new FormData();
    //    formData.append("caseid", EncodeText(token));
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/MatterApi/CheckUserCasesMapCaseStatusMaster",
    //        dataType: 'json',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {
    //            if (response.Data == "") {
    //                document.getElementById("divAdduserforLiveUpdate").style.display = "none";
    //                document.getElementById("divAddCaseforLiveUpdate").style.display = "none";
    //                document.getElementById("modalopenpartynamediv").style.display = "none";
    //                document.getElementById("divRemoveCaseForLiveupdate").style.display = "none";
    //            }
    //            else {
    //                document.getElementById("divAddCaseforLiveUpdate").style.display = "none";
    //                document.getElementById("modalopenpartynamediv").style.display = "none";
    //                document.getElementById("divAdduserforLiveUpdate").style.display = "none";
    //                document.getElementById("divRemoveCaseForLiveupdate").style.display = "none";
    //            }
    //        }, //End of AJAX Success function
    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        } //End of AJAX error function
    //    });
    //}
    //save data
    $('form[id="updatematterform"]').validate({
        submitHandler: function (form) {
            if (document.getElementById('divSCHCDistrict').value == "7") {
                if (document.getElementById('divReraCourt').value == "0") {
                    alert("Please Select the Court Name");
                    document.getElementById('divReraCourt').focus();
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                else if (document.getElementById('reracasetype').value == "0" && document.getElementById('reracasetype').value !== "UPRA") {
                    alert("Please Select the Case/Appeal Authority");
                    document.getElementById('reracasetype').focus();
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                else if (!document.getElementById('reracasno').value) {
                    alert("Please Enter the Case/Appeal No.");
                    document.getElementById('reracasno').focus();
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                else if (document.getElementById('reracaseyear').value == "0") {
                    alert("Please Select Case Year");
                    document.getElementById('reracaseyear').focus();
                    $('#casewatchmodel').modal('show');
                    return false;
                } else;
            }
            var caseid = $("#hdncaseId").val();
            usertypes = $("input[name='fselectusertype']:checked").val();
            var clientname = $("#fshortcasemap").val();
            var casename = $("#fsideCasename").val();
            var fcasecasetype = $("#fcasecasetype").val();
            var fcaseclientcontact = $("#fcaseclientcontact").val();
            var fcasedetails = $("#fcasedetails").val();
            var fcasenotes = $("#fcasenotes").val();
            var fcourt = $("#fcourt").val();
            var fothercourt = $("#fothercourt").val();
            var fcasestatus = $("#fcasestatus").val();
            var fdisposedoption = $("#fdisposedoption").val();
            var fcaseodate = $("#fcaseodate").val();
            var fcasecdate = $("#fcasecdate").val();
            var fcasenumber = $("#fcasenumber").val();
            var fcaseteamlead = $("#fcaseteamlead").val();
            var fcasecnr = $("#fcasecnr").val();
            var fcasesideuserid = $("#fcasesideuserid").val();
            var fcasesidepassword = $("#fcasesidepassword").val();
            var fcasesidecpassword = $("#fcasesidecpassword").val();
            var clientto = $("#clientto").val();
            var assignto = $("#assignto").val();
            var fcheckclient = $("#fcheckclient").val();
            if (casename == "") {
                alert("Please enter the matter name.");
                document.getElementById("fsideCasename").focus();
                return false;
            }
            var reg = /[:*?"<>|$%#!~+*^]/;
            if (reg.test(casename) == true) {
                alert('[:*?"<>|$%#!~+*^] are not allowed in Matter name.');
                document.getElementById("fsideCasename").focus();
                return false;
            }
            casename = String(casename).replace(/[:*?"<>|$%#!~+*^]/g, '');
            casename = $.trim(casename);
            var e = $("#fmattertype").val();
            var fmattertype = e;
            if (fmattertype == "43") {
            }
            if (fmattertype == "44") {
                var val = document.getElementById("fdisputemattertype");
                var fdisputemattertype = val.options[val.selectedIndex].value;
                if (fdisputemattertype === "") {
                    alert("Select Resolution Type");
                    return false;
                }
            }
            if (fmattertype == "45") {
            }
            if (fmattertype == "46") {
                var fmattertypeother = $("#fmattertypeother").val();
                if (fmattertypeother == "") {
                    alert("Enter Other Name");
                    return false;
                }
            }
            $("#fshortcasemap").val(clientname);
            if (caseid == "") {
                alert("Matter not found");
                document.getElementById("fsidebindcaseclient").focus();
                return false;
            }

            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (fcasecnr.trim() != "") {
                $("#fcasenumber").val("");
                if (fcasecnr.trim().length != "16") {
                    alert("please enter Valid 16 characters CNR No.");
                    $("#fcasecnr").focus();
                    return false;
                }
                if (format.test(fcasecnr.trim())) {
                    alert("Not allowed special characters in CNR No.");
                    $("#fcasecnr").focus();
                    return false;
                }

                if (/\d/.test(fcasecnr) && /[a-zA-Z]/.test(fcasecnr)) {
                    //if (fcasecnr.match(/^[0-9a-z]+$/) == null) {
                }
                else {
                    alert("Please enter valid CNR No.");
                    $("#fcasecnr").focus();
                    return false;
                }
            }
            var comclient1 = $("#fshortcasemap").val();
            if (comclient1 == "") {
                comclient1 = "00000000-0000-0000-0000-000000000000";
            }
            if (comclient1 != "00000000-0000-0000-0000-000000000000") {
                if (usertypes == "company") {
                    if (fcaseclientcontact == "0") {
                        alert("select client contact lead");
                        document.getElementById("fcaseclientcontact").focus();
                        return false;
                    }
                    else if (fcaseclientcontact == "") {
                        alert("select client contact lead");
                        document.getElementById("fcaseclientcontact").focus();
                        return false;
                    }
                }
            }
            if (assignto == "" || assignto == null) {
                alert("Please Select internal team members");
                document.getElementById("assignto").focus();
                return false;
            }
            if (fcaseodate != "" && fcasecdate != "") {
                var date1 = new Date(fcaseodate);
                var date2 = new Date(fcasecdate);
                if (date2 < date1) {
                    alert("Close date should not be less than Open date");
                    return false;
                }
            }
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
                       // alert(selected5);
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
                        //alert(selected6);
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
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            //var totalFiles = document.getElementById("attachmentcase").files.length;
            //for (var i = 0; i < totalFiles; i++) {
            //    var file = document.getElementById("attachmentcase").files[i];
            //    var filename = file.name;
            //    if (filename.length > 100) {
            //        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
            //        return false;
            //    }
            //    var Extresponse = checkfileext(filename);
            //    if (String(Extresponse) == "false") {
            //        return false;
            //    }
            //    formData.append("FileUpload", file);
            //    try {
            //        if (typeof (file) != "undefined") {
            //            size = parseFloat(file.size / 1024).toFixed(2);
            //            tottempsize = parseFloat(tottempsize) + parseFloat(size);
            //            tempsize = parseFloat(size);
            //        }
            //    }
            //    catch (err) {
            //        //alert(err.message);
            //    }
            //    tempsize = tempsize.toFixed(2);
            //}
            formData.append("usertypes", EncodeText(usertypes));
            formData.append("clientname", EncodeText(clientname));
            formData.append("casename", EncodeText(casename));
            formData.append("fcaseclientcontact", EncodeText(fcaseclientcontact));
            formData.append("fcasedetails", EncodeText(fcasedetails));
            formData.append("fcasenotes", EncodeText(fcasenotes));
            formData.append("fcourt", EncodeText(fcourt));
            formData.append("fothercourt", EncodeText(fothercourt));
            formData.append("fcasestatus", EncodeText(fcasestatus));
            formData.append("fdisposedoption", EncodeText(fdisposedoption));
            formData.append("fcaseodate", EncodeText(fcaseodate));
            formData.append("fcasecdate", EncodeText(fcasecdate));
            formData.append("fcasenumber", EncodeText(fcasenumber));
            formData.append("fcaseteamlead", EncodeText(fcaseteamlead));
            formData.append("fcasecnr", EncodeText(fcasecnr));
            formData.append("fcasesideuserid", EncodeText(fcasesideuserid));
            formData.append("fcasesidepassword", EncodeText(fcasesidepassword));
            formData.append("clientto", EncodeText(clientto));
            formData.append("assignto", EncodeText(assignto));
            formData.append("fcheckclient", EncodeText(fcheckclient));
            formData.append("itemlistdata", JSON.stringify(StatuteItems));
            formData.append("clientno", EncodeText($("#clientno").val()));
            formData.append("casedetails", EncodeText($("#casedetails").val()));
            var rdmattertype = $("input[name='rdmattertype']:checked").val();
            var matterpolicstation = $("#matterpolicstation").val();
            var firno = $("#matterfirno").val();
            var val = $("#fmattertype").val();
            if (val == null) {
                alert("Please Enter Matter Type");
                return false;
            }
            if (val == "46") {
                formData.append("txtMatterOther", EncodeText($("#fmattertypeother").val()));
            }
            else {
                formData.append("txtMatterOther", null);
            }
            if (val == "44") {
                var val1 = $("#fdisputemattertype").val();
                var fdisputemattertype = val1;
                formData.append("DisputeMatterType", EncodeText(fdisputemattertype));
            }
            else {
                formData.append("DisputeMatterType", null);
            }
            var casetype = $("input[name='rdcasetype']:checked").val();
            if (String(casetype) == "undefined") {
                casetype = "";
            }
            if (IndusindCustomization == "Indusindcustomtype") {
                if (col2 == "" || col2 == undefined || col2 == null) {
                    alert("state is mandatory.");
                    return false;
                }
            }

            if (IndusindCustomization == "Indusindcustomtype") {
                if (col4 == "" || col4 == undefined || col4 == null) {
                    alert("Cont.no is mandatory.");
                    return false;
                }
            }
            //For Other Party Deatils
            var otherpartyFname = $("#fName").val();
            var otherpartyEMail = $("#fEmail").val();
            var otherpartyPhone = $("#fPhone").val();
            var otherpartyType = $("#fType").val();
            var otherpartyId = $("#ExtrapartyId").val();
            var IsCourtFeePaid = $("input[name='rdcfeepaid']:checked").val();
            formData.append("fmatterType", EncodeText($("#fmattertype").val()));
            formData.append("MatterType", EncodeText(rdmattertype));
            formData.append("PoliceStation", EncodeText(matterpolicstation));
            formData.append("Firno", EncodeText(firno));
            formData.append("CertifiedCopyAppliedon", EncodeText($("#CertifiedCopyAppliedon").val()));
            formData.append("CertifiedCopyReceivedon", EncodeText($("#CertifiedCopyReceivedon").val()));
            formData.append("ValuationofSuit", EncodeText($("#fValuationofSuit").val()));
            formData.append("Courtfee", EncodeText($("#fCourtfee").val()));
            formData.append("OppositePartyCounselname", EncodeText($("#OppositePartyCounselname").val()));
            formData.append("OppositePartyCounselemail", EncodeText($("#OppositePartyCounselemail").val()));
            formData.append("OppositePartyCounselphone", EncodeText($("#OppositePartyCounselphone").val()));
            formData.append("CasenumberInternal", EncodeText($("#fcasenumberinternal").val()));
            formData.append("IsCourtFeePaid", EncodeText(IsCourtFeePaid));
            formData.append("fcasecasetype", EncodeText(fcasecasetype));
            formData.append("SubjectType", EncodeText(casetype));
            formData.append("casefilingcdate", EncodeText($("#fcasefilingcdate").val()));
            formData.append("submitDate", "");
            formData.append("returnDate", "");
            formData.append("ePartyName", "");
            formData.append("ePartyFatherName", "");
            formData.append("ePartyAddress", "");
            formData.append("ePartyAdharCardNo", "");
            formData.append("ePartyGender", "");
            formData.append("ePartyDateOfBirth", "");
            formData.append("ePartyEmail", "");
            formData.append("ePartyNationality", "");
            formData.append("ePartyMobileNo", "");
            formData.append('dtnhearingdate', EncodeText(document.getElementById('dtnhearingdate').value));
            formData.append('txtcustomadvocate', EncodeText(document.getElementById('txtcustomadvocate').value));
            formData.append('txtcustomstatus', EncodeText(document.getElementById('txtcustomstatus').value));
            formData.append('txtcasename', EncodeText(document.getElementById('txtcasename').value));
            formData.append('txtsuffix', EncodeText(document.getElementById('txtsuffix').value));
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
            formData.append("caseid", EncodeText($("#hdncaseId").val()));
            //For Other Party Deatils
            formData.append("otherpartyFname", EncodeText(otherpartyFname));
            formData.append("otherpartyEMail", EncodeText(otherpartyEMail));
            formData.append("otherpartyPhone", EncodeText(otherpartyPhone));
            formData.append("otherpartyType", EncodeText(otherpartyType));
            formData.append("otherpartyId", EncodeText(otherpartyId));
            //Pmrda customisation
            formData.append("compdep", EncodeText($("#compDepart").val()));
            formData.append("compadVocateName", EncodeText($("#compAdvocate").val()));
            formData.append("compdepIOCL", EncodeText(col6));
            formData.append("compadVocateNameIOCL", EncodeText($("#compAdvocate").val()));
            formData.append("amountIOCL", EncodeText(col4));
            formData.append("caseByAndAgainst", EncodeText(col12));
            formData.append("NextHearingIOCL", "");
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/MatterApi/UpdateFullScreenSaveCase", // Controller/View
                    dataType: 'json',
                    headers: {
                        "sum": sum,
                        "ftype": type,
                        "ctxt1": ctx1,
                        "ctxt2": ctx2,
                        "ctxt3": ctx3,
                        "ctxt4": ctx4,
                        "ctxt5": ctx5,
                        "ctxt6": ctx6,
                        "ctxt7": ctx7,
                        "ctxt9": ctx9,
                        "ctxt10": ctx10,
                        "ctxt11": ctx11,
                        "ctxt12": ctx12,
                        "ctxt13": ctx13,
                        "ctxt14": ctx14,
                        "ctxt15": ctx15,
                        "ctxt8": ctx8
                    },
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.Data == "Sorry! Unable to Add now.") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Sorry! Unable to Add Case.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "Cannot find table 0.") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Already Exists Email in casewatch, please update your mail to add case',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "Already Exists User Please Try Another User Name!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'User ID is already exists. Please Try Another User ID !',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "livecaselimitexceed") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Youi have exceeded limit to add Case live update from e-Courts.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "livecaselimitnotfound") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Please subscribe for Case live update from e-Courts.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "livecasenotactive") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Please subscribe for Case live update from e-Courts.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "livecaseaccessdenied") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'You are not authorized to access add case for live update from e-Courts',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "onlyonecaseadded") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'You can only update CNR or Case details for live update',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else {
                            if (data.Data == "emailexist") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'Your registered Email id is already exists with Casewatch.',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (data.Data == "false") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'This case is already exists.',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (data.Data == "Case Detail Already Exists!!") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'Case detail already exists!',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (parseInt(data.Data) > 0) {
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Matter updated Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#assignto")[0].selectize.clear();
                                $("#clientto")[0].selectize.clear();
                                closeload();
                                $('.hspass').hide();
                                closeload();
                                try {
                                    headercount();
                                    notification();
                                }
                                catch (er) {
                                }
                                window.location.href = "/" + fcode + "/firm/StandardCaseList";
                            }
                            else if (data.Data == "Already exist matter name. please try another matter name") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'Already exist matter name. please try another matter name.',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'Sorry! Something went wrong, Please try again.',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
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
    });
    $("#rdCriminal").click(function () {
        $("#divmatteroption").show();
    });
    $("#rdCivil").click(function () {
        $("#divmatteroption").hide();
        $("#matterpolicstation").val("");
        $("#matterfirno").val("");
    });
    $("#rdTaxation").click(function () {
        $("#divmatteroption").hide();
        $("#matterpolicstation").val("");
        $("#matterfirno").val("");
    });
    $("#rdAppeal").click(function () {
        $("#divcasetypeoption").show();
    });
    $("#rdApplication").click(function () {
        $("#divcasetypeoption").show();
    });
    $("#rdOriginal").click(function () {
        $("#divcasetypeoption").hide();
        $("#CertifiedCopyAppliedon").val("");
        $("#CertifiedCopyReceivedon").val("");
    });
});
function FillCourtnamebyCourttype() {
}

/*Fill case type dairy details*/
function FillCasetypeDiary() {
    $('#divSCDECD').find('option').remove();
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCasetypeDiary",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            var option = '';
            $.each(response, function (i, a) {
                option = '<option value="' + a["id"] + '" >  ' + a["name"] + '</option>';
                $("#divSCDECD").append(option);
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

/*Fill case type*/
function FillCasetype() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCaseType",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            var option = '';
            $.each(response, function (i, a) {
                option = '<option value="' + a["casetype"] + '" >  ' + a["casename"] + '</option>';
                $("#drptype").append(option);
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

/*Fill bench type*/
function FillBenchType(strdivid) {
    var courtid = document.getElementById('drpcourtname').value;
    $.ajax({
        type: "POST",
        url: "/Firm/FillBenchType?crtid=" + courtid,
        dataType: "json",
        success: function (data) {
            $("#divUPBench").empty();
            $("#divUPBench").append("<option value=''>Select Bench / Type</option>");
            for (var i = 0; i < data.length; i++) {
                $("#divUPBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}

/*Fill stamp registration*/
function FillStampRegister() {
    $.ajax({
        type: "POST",
        url: "/AddCase/FillStampRegister",
        dataType: "json",
        success: function (data) {
            $("#drpstampregister").empty();
            for (var i = 0; i < data.length; i++) {
                $("#drpstampregister").append("<option value='" + data[i].value + "'>" + data[i].Name + "</option>");
            }
        },
        error: function (data) {
        }
    });
}

/*Court CNR on keypress*/
$(document).on('keypress', '#drpdcourtcnr', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});

/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
var userType;
//$(document).on("change", ".fselectusertype", function () {
//    var ele = document.getElementsByName('fselectusertype');
//    for (i = 0; i < ele.length; i++) {
//        if (ele[i].checked) {
//            userType = ele[i].value;
//        }
//    }
//    if (userType == 'company') {
//        $('#divClientTeammamber').show();
//        $('#lblmiddlename').hide();
//        $('#msidebindcaseclient').hide();
//        $('#lblLastname').hide();
//        $('#lsidebindcaseclient').hide();
//        $('#divClientcontact').show();
//        $('#Firstnameuser').html("Company Name");
//    }
//    if (userType == 'user') {
//        $('#divClientTeammamber').hide();
//        $('#lblmiddlename').show();
//        $('#msidebindcaseclient').show();
//        $('#lblLastname').show();
//        $('#lsidebindcaseclient').show();
//        $('#divClientcontact').hide();
//        $('#Firstnameuser').html("First Name");
//    }
//});

//$(document).on("change", "#fselectusertype", function () {
$(document).on("change", ".fselectusertype", function () {
    var ele = document.getElementsByName('fselectusertype');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            userType = ele[i].value;
        }
    }
    if (userType == 'company') {
        //$('#fsidebindcaseclient').val("");
        $('#divClientTeammamber').show();
        $('#divClientcontact').show();
        $('#lblmiddlename').hide();
        $('#msidebindcaseclient').hide();
        $('#lblLastname').hide();
        $('#lsidebindcaseclient').hide();
        $('#divcaseclientcontact').show();
        $('#Firstnameuser').html("Company Name");
    }
    if (userType == 'user') {
        //$('#fsidebindcaseclient').val("");
        $('#divClientTeammamber').hide();
        $('#divClientcontact').hide();
        $('#lblmiddlename').show();
        $('#msidebindcaseclient').show();
        $('#lblLastname').show();
        $('#lsidebindcaseclient').show();
        $('#divcaseclientcontact').hide();
        $('#Firstnameuser').html("First Name");
    }
});

/*Get basic case details*/
function CaseBasicDetails() {
    var formData = new FormData();
    formData.append("caseid", token);
    $("#hdncaseId").val(token);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/EditCaseBasicDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data);
            $.each(obj, function (i, b) {
                if (String(b.IsRevenueCourt) == "1") {
                    //document.getElementById("divAdduserforLiveUpdate").style.display = "none";
                    //document.getElementById("divRemoveCaseForLiveupdate").style.display = "none";
                }
                if (b.CompanyName != "") {
                    $('#lblmiddlename').hide();
                    $('#msidebindcaseclient').hide();
                    $('#lblLastname').hide();
                    $('#lsidebindcaseclient').hide();
                    $('#Firstnameuser').text("Company Name");
                    if (b.CompanyName != "") {
                        $("#fsidebindcaseclient").val(b.CompanyName);
                        //$("#fsidebindcaseclient").prop("disabled", "disabled");
                        //$("#fselectusertype").prop("disabled", "disabled");
                        $("#divClientTeammamber").show();
                        $('#mandtorylead').show();
                        $('#nonmandtorylead').hide();
                    }
                } else if (b.CompanyId == '00000000-0000-0000-0000-000000000000') {
                    if (b.ClientFName != "") {
                        $("#fsidebindcaseclient").val(b.ClientFName);
                        //$("#fsidebindcaseclient").prop("disabled", "disabled");
                        $("#msidebindcaseclient").val(b.ClientMName);
                        $("#msidebindcaseclient").prop("disabled", "disabled");
                        $("#lsidebindcaseclient").val(b.ClientLName);
                        $("#lsidebindcaseclient").prop("disabled", "disabled");
                        //$("#fselectusertype1").prop("disabled", "disabled");
                    } else {
                        $('#lblmiddlename').hide();
                        $('#msidebindcaseclient').hide();
                        $('#lblLastname').hide();
                        $('#lsidebindcaseclient').hide();
                        $('#Firstnameuser').text("Company Name");
                        $('#divClientcontact').show();
                        if (b.CompanyName != "") {
                            $("#fsidebindcaseclient").val(b.CompanyName);
                            //$("#fsidebindcaseclient").prop("disabled", "disabled");
                            $('#mandtorylead').show();
                            $('#nonmandtorylead').hide();
                        }
                    }
                }
                else if (b.orgaty == "company") {
                    $('#lblmiddlename').hide();
                    $('#msidebindcaseclient').hide();
                    $('#lblLastname').hide();
                    $('#lsidebindcaseclient').hide();
                    $('#Firstnameuser').text("Company Name");
                    if (b.CompanyName != "") {
                        $('#mandtorylead').show();
                        $('#nonmandtorylead').hide();
                        $("#fsidebindcaseclient").val(b.CompanyName);
                        //$("#fsidebindcaseclient").prop("disabled", "disabled");
                    }
                }
                else if (b.orgaty == "user") {
                    if (b.ClientFName != "") {
                        $('#mandtorylead').hide();
                        $('#nonmandtorylead').show();
                        $("#fsidebindcaseclient").val(b.ClientFName);
                        //$("#fsidebindcaseclient").prop("disabled", "disabled");
                        $("#msidebindcaseclient").val(b.ClientMName);
                        //$("#msidebindcaseclient").prop("disabled", "disabled");
                        $("#lsidebindcaseclient").val(b.ClientLName);
                        //$("#lsidebindcaseclient").prop("disabled", "disabled");
                        //$("#fselectusertype1").prop("disabled", "disabled");
                    }
                }
                else {
                    if (b.ClientFName != "") {
                        $("#fsidebindcaseclient").val(b.ClientFName);
                        //$("#fsidebindcaseclient").prop("disabled", "disabled");
                        $("#msidebindcaseclient").val(b.ClientMName);
                        //$("#msidebindcaseclient").prop("disabled", "disabled");
                        $("#lsidebindcaseclient").val(b.ClientLName);
                        //$("#lsidebindcaseclient").prop("disabled", "disabled");
                        //$("#fselectusertype1").prop("disabled", "disabled");
                    }
                }
                $("#fsideCasename").val(b.mname);
                $("#fcasedetails").val(b.CaseDetails);
                if (b.TeamleadName != null && b.TeamleadName != "") {
                    $("#ncdteamlead").text(b.TeamleadName);
                }
                if (b.CompanyId != "") {
                    $("#fshortcasemap").val(b.CompanyId);
                }
                else {
                    $("#fshortcasemap").val(b.matterclientid);
                }
                $("#fmattertype").val(b.MatterType);
                if (b.MatterType == '42') {
                    $('#modalopenpartyname').hide();
                }
                else {
                    $('#modalopenpartyname').hide();
                }
                $("#fmattertypeother").val(b.OtherMatterType);
                casewatchcaseid = b.UserCaseid;
                if (b.MatterType == '42') {
                    $("#divfcasetype").show();
                    $("#divsubjecttype").show();
                    $("#divcasedescription").show();
                    $("#divVSCF").show();
                    $("#divcourt").show();
                    $("#divcaseinternalreference").show();
                    $("#divcnrno").show();
                   // $('#divMatterdetais').hide();
                    $('#divMatterdetais').show();
                    $("#divfcourt").show();
                    if (b.UserCaseid == "") {
                        $("#divAddCaseforLiveUpdate").hide();
                    }
                    else {
                        $("#divAddCaseforLiveUpdate").hide();
                    }
                    if (dashcw == "display:unset" && IsCWActive == "1") {
                    }
                    else {
                        document.getElementById("divAddCaseforLiveUpdate").style.display = "none";
                        document.getElementById("modalopenpartynamediv").style.display = "none";
                        document.getElementById("divAdduserforLiveUpdate").style.display = "none";
                        document.getElementById("divRemoveCaseForLiveupdate").style.display = "none";
                    }
                }
                else {
                    $("#divfcasetype").hide();
                    $("#divsubjecttype").show();
                    $("#divcasedescription").show();
                    $("#divVSCF").hide();
                    $("#divcourt").hide();
                    $("#divcaseinternalreference").show();
                    $("#divcnrno").hide();
                    $('#divMatterdetais').show();
                    $('#divcasetypeoption').hide();
                    $("#CertifiedCopyAppliedon,#CertifiedCopyReceivedon").val("");
                    $('input[name="rdcasetype"]').attr('checked', false);
                    $("#divfcourt").hide();
                    $("#divAddCaseforLiveUpdate").hide();
                }
                if (b.MatterType == '46') {
                    $("#fmattertypeother").show();
                    $("#fmattertypeotherdiv").show();
                }
                else {
                    $("#fmattertypeother").hide();
                    $("#fmattertypeotherdiv").hide();
                }
                if (b.MatterType == '44') {
                    $("#fdisputemattertype").show();
                    $("#fdisputemattertypediv").show();
                }
                else {
                    $("#fdisputemattertype").hide();
                    $("#fdisputemattertypediv").hide();
                }
                $('#fcasecasetype option[value="' + b.CaseType + '"]').prop("selected", true);
                $('#fdisputemattertype option[value="' + b.MatterTypeOption + '"]').prop("selected", true);
                $("#fcasenotes").val(b.mnotes);
                $('#fcourt option[value="' + b.CourtName + '"]').prop("selected", true);
                if (b.CourtName == "High Court" || b.CourtName == "District Court" || b.CourtName == "Tribunals" || b.CourtName == "Append Court" || b.CourtName == "Add a Court" || b.CourtName == "Rera Court" || b.CourtName == "Revenue Court") {
                    $("#fothercourtdiv").show();
                    $("#fothercourt").val(b.OtherCourtName);
                }
                $("#fcasestatus").val(b.cstatus);
                if (b.cstatus == '38') {
                    $("#fdisposedoption").show();
                }
                else {
                    $("#fdisposedoption").hide();
                }
                $("#fdisposedoption").val(b.DisposeOption);
                var odt = b.odate;
                if (odt == "" || odt == null || odt == "null") {
                    $("#fcaseodate").removeAttr("disabled");
                    $("#fcaseodate").removeAttr("min");
                    var ctoday = new Date().toISOString().split('T')[0];
                    $("#fcasecdate").attr("min", ctoday);
                }
                else {
                    try {
                        var today = odt.split('T')[0];
                        $("#fcaseodate").val(today);
                        $("#fcasecdate").attr("min", today);
                    }
                    catch (er) {
                    }
                }
                var cdt = b.cdate;
                try {
                    var iopday = cdt.split('T')[0];
                    if (iopday != "1900-01-01") {
                        $("#fcasecdate").val(iopday);
                    }
                }
                catch (er) {
                }
                var cdtCaseFilingDate = b.CaseFilingDate;
                try {
                    var iCaseFilingDate = cdtCaseFilingDate.split('T')[0];
                    if (iCaseFilingDate != "1900-01-01") {
                        $("#fcasefilingcdate").val(iCaseFilingDate);
                    }
                }
                catch (er) {
                }
                let fCaseNumber = b.mtrno || "";
                let cnrno = b.cnrno || "";

                if (fCaseNumber) {

                    // Check if mtrno contains only CNR
                    let onlyCnrPattern = /^\s*\(CNR-No\..*?\)?\s*$/i;

                    if (!onlyCnrPattern.test(fCaseNumber)) {
                        fCaseNumber = fCaseNumber
                            .replace(/\s*\(CNR-No\..*$/i, "")
                            .trim();
                    }
                }

                $("#fcasenumber").val(fCaseNumber);
                $("#fcasecnr").val(cnrno);
                if (roleids == 1) {
                    if (b.Teamlead != "" && b.Teamlead != null) {
                        $('#fcaseteamlead option[value="' + b.Teamlead.toLowerCase() + '"]').prop("selected", true);
                        $('#fcaseteamlead option[value="' + b.Teamlead.toUpperCase() + '"]').prop("selected", true);
                    }
                }
                else {
                    if (b.Teamlead == "" || b.Teamlead == null || b.Teamlead == "null") {
                    }
                    else {
                        if (String(b.firmuser.toLowerCase()) == String(userid.toLowerCase())) {
                            $('#fcaseteamlead option[value="' + b.Teamlead.toLowerCase() + '"]').prop("selected", true);
                            $('#fcaseteamlead option[value="' + b.Teamlead.toUpperCase() + '"]').prop("selected", true);
                        }
                        else {
                            //append
                            $('#fcaseteamlead option[value="' + b.Teamlead.toLowerCase() + '"]').prop("selected", true);
                            $('#fcaseteamlead option[value="' + b.Teamlead.toUpperCase() + '"]').prop("selected", true);
                        }
                    }
                }
                if (b.Clientcontactid == "" || b.Clientcontactid == null || b.Clientcontactid == "null") {
                    if (b.orgaty == "company") {
                        $("#divClientcontact").css("display", "block");
                    }
                    else {
                        $("#divClientcontact").css("display", "none");
                    }
                }
                else {
                    $("#divClientcontact").css("display", "block");
                }
                $("#clientno").val(b.ClientNo);
                var companyid = b.CompanyId;
                if (companyid != "" && companyid != null) {
                    if (b.ClientFName != "" && companyid == "00000000-0000-0000-0000-000000000000") {
                        document.getElementById("fselectusertype1").checked = false;
                        document.getElementById("fselectusertype").checked = true;
                    }
                    else {
                        document.getElementById("fselectusertype1").checked = true;
                        document.getElementById("fselectusertype").checked = false;
                    }
                }
                else if (b.orgaty == "company") {
                    document.getElementById("fselectusertype1").checked = true;
                    document.getElementById("fselectusertype").checked = false;
                }
                else if (b.orgaty == "user") {
                    $("#divClientcontact").hide();
                    document.getElementById("fselectusertype1").checked = false;
                    document.getElementById("fselectusertype").checked = true;
                }
                else {
                    document.getElementById("fselectusertype1").checked = false;
                    document.getElementById("fselectusertype").checked = true;
                }
                try {
                    var cloday = odt.toISOString().split('T')[0];
                    $("#fcaseodate").val(cloday);
                }
                catch (er) {
                }
                var companyid = b.CompanyId;
                //extra---
                if (b.MatterType == "Criminal") {
                    document.getElementById("rdCriminal").checked = true;
                    $("#matterpolicstation").val(b.PoliceStation);
                    $("#matterfirno").val(b.FIRNo);
                    $("#divmatteroption").show();
                }
                else {
                    $("#divmatteroption").hide();
                }
                if (b.MatterType == "Civil") {
                    document.getElementById("rdCivil").checked = true;
                }
                if (b.MatterType == "Taxation") {
                    document.getElementById("rdTaxation").checked = true;
                }
                var ccappliedon = b.CertifiedCopyAppliedon;
                var ccreceivedon = b.CertifiedCopyReceivedon;
                if (b.CaseType == "Original") {
                    document.getElementById("rdOriginal").checked = true;
                    $("#divcasetypeoption").hide();
                }
                if (b.CaseType == "Appeal") {
                    document.getElementById("rdAppeal").checked = true;
                    try {
                        var appliedon = ccappliedon.split('T')[0];
                        if (appliedon != "1900-01-01") {
                            $("#CertifiedCopyAppliedon").val(appliedon);
                        }
                        var receivedon = ccreceivedon.split('T')[0];
                        if (receivedon != "1900-01-01") {
                            $("#CertifiedCopyReceivedon").val(receivedon);
                        }
                    }
                    catch (er) {
                    }
                    $("#divcasetypeoption").show();
                }
                if (b.CaseType == "Application") {
                    $("#rdApplication").attr('checked', 'checked');
                    try {
                        var appliedon = ccappliedon.split('T')[0];
                        if (appliedon != "1900-01-01") {
                            $("#CertifiedCopyAppliedon").val(appliedon);
                        }
                        var receivedon = ccreceivedon.split('T')[0];
                        if (receivedon != "1900-01-01") {
                            $("#CertifiedCopyReceivedon").val(receivedon);
                        }
                    }
                    catch (er) {
                    }
                    $("#divcasetypeoption").show();
                }
                //--
                $("#fcasecasetype").val(b.SubjectType);
                $("#fcasedetails").val(b.CaseDetails);
                $("#fValuationofSuit").val(b.ValuationofSuit);
                $("#fCourtfee").val(b.Courtfee);
                if (b.OppositePartyCounselname != "" && b.OppositePartyCounselname != null && b.OppositePartyCounselname != "null") {
                    var oppsitename = b.OppositePartyCounselname.replace("&amp;", "&");
                    $("#OppositePartyCounselname").val(oppsitename);
                }
                else {
                    $("#OppositePartyCounselname").val(b.OppositePartyCounselname);
                }
                $("#OppositePartyCounselemail").val(b.OppositePartyCounselemail);
                $("#OppositePartyCounselphone").val(b.OppositePartyCounselphone);
                $("#fcasenumberinternal").val(b.CasenumberInternal);
                //if (b.IsCourtFeePaid == 'Yes') {
                //    document.getElementById("rdcourtfeepaidyes").checked = true;
                //}
                //else {
                //    document.getElementById("rdcourtfeepaidno").checked = true;
                //}
                $("#OppositePartyCounselphone").val(b.OppositePartyCounselphone);
                //custom field bind
                for (lp = 1; lp <= 15; lp = lp + 1) {
                    $('#demotext' + lp).is(function () {
                        ftype = this.tagName != 'INPUT' ? this.tagName.toLocaleLowerCase() : this.type.toLowerCase();
                        if (ftype == "text") {
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                $("#demotext" + lp).val(b.col1);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                $("#demotext" + lp).val(b.col2);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                $("#demotext" + lp).val(b.col3)
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                $("#demotext" + lp).val(b.col4);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                $("#demotext" + lp).val(b.col5);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                $("#demotext" + lp).val(b.col6);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                $("#demotext" + lp).val(b.col7);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                $("#demotext" + lp).val(b.col8);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                $("#demotext" + lp).val(b.col9);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                $("#demotext" + lp).val(b.col10);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                $("#demotext" + lp).val(b.col11);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                $("#demotext" + lp).val(b.col12);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                $("#demotext" + lp).val(b.col13);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                $("#demotext" + lp).val(b.col14);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                $("#demotext" + lp).val(b.col15);
                            }
                        }
                        if (ftype == "email") {
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                $("#demotext" + lp).val(b.col1);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                $("#demotext" + lp).val(b.col2);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                $("#demotext" + lp).val(b.col3)
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                $("#demotext" + lp).val(b.col4);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                $("#demotext" + lp).val(b.col5);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                $("#demotext" + lp).val(b.col6);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                $("#demotext" + lp).val(b.col7);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                $("#demotext" + lp).val(b.col8);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                $("#demotext" + lp).val(b.col9);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                $("#demotext" + lp).val(b.col10);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                $("#demotext" + lp).val(b.col11);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                $("#demotext" + lp).val(b.col12);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                $("#demotext" + lp).val(b.col13);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                $("#demotext" + lp).val(b.col14);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                $("#demotext" + lp).val(b.col15);
                            }
                        }
                        if (ftype == "number") {
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                $("#demotext" + lp).val(b.col1);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                $("#demotext" + lp).val(b.col2);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                $("#demotext" + lp).val(b.col3)
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                $("#demotext" + lp).val(b.col4);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                $("#demotext" + lp).val(b.col5);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                $("#demotext" + lp).val(b.col6);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                $("#demotext" + lp).val(b.col7);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                $("#demotext" + lp).val(b.col8);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                $("#demotext" + lp).val(b.col9);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                $("#demotext" + lp).val(b.col10);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                $("#demotext" + lp).val(b.col11);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                $("#demotext" + lp).val(b.col12);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                $("#demotext" + lp).val(b.col13);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                $("#demotext" + lp).val(b.col14);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                $("#demotext" + lp).val(b.col15);
                            }
                        }
                        if (ftype == "datetime-local") {
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                $("#demotext" + lp).val(b.col1);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                $("#demotext" + lp).val(b.col2);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                $("#demotext" + lp).val(b.col3)
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                $("#demotext" + lp).val(b.col4);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                $("#demotext" + lp).val(b.col5);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                $("#demotext" + lp).val(b.col6);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                $("#demotext" + lp).val(b.col7);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                $("#demotext" + lp).val(b.col8);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                $("#demotext" + lp).val(b.col9);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                $("#demotext" + lp).val(b.col10);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                $("#demotext" + lp).val(b.col11);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                $("#demotext" + lp).val(b.col12);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                $("#demotext" + lp).val(b.col13);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                $("#demotext" + lp).val(b.col14);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                $("#demotext" + lp).val(b.col15);
                            }
                        }
                        if (ftype == "date") {
                            var date12 = "";
                            var dateval12 = "";
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                date12 = b.col1;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                date12 = b.col2;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                date12 = b.col3;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                date12 = b.col4;
                                $("#demotext" + lp).val(date12);
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                date12 = b.col5;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                date12 = b.col6;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                date12 = b.col7;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                date12 = b.col8;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                date12 = b.col9;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                date12 = b.col10;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                date12 = b.col11;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                date12 = b.col12;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                date12 = b.col13;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                date12 = b.col14;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                date12 = b.col15;
                                try {
                                    dateval12 = date12.substring(0, 10);
                                    $("#demotext" + lp).val(date12);
                                } catch
                                {
                                }
                            }
                        }
                        if (ftype == "checkbox") {
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                if (b.col8 != null) {
                                    var strarray = b.col8.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                if (b.col1 != null) {
                                    var strarray = b.col1.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                if (b.col2 != null) {
                                    var strarray = b.col2.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                if (b.col3 != null) {
                                    var strarray = b.col3.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                if (b.col4 != null) {
                                    var strarray = b.col4.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                if (b.col5 != null) {
                                    var strarray = b.col5.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                if (b.col6 != null) {
                                    var strarray = b.col6.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                if (b.col7 != null) {
                                    var strarray = b.col7.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                if (b.col9 != null) {
                                    var strarray = b.col9.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                if (b.col10 != null) {
                                    var strarray = b.col10.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                if (b.col11 != null) {
                                    var strarray = b.col11.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                if (b.col12 != null) {
                                    var strarray = b.col12.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                if (b.col13 != null) {
                                    var strarray = b.col13.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                if (b.col14 != null) {
                                    var strarray = b.col14.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                if (b.col15 != null) {
                                    var strarray = b.col15.split(',');
                                    $(".demotext" + lp + "").each(function () {
                                        var chkbx = $(this).val();
                                        var tempname = $(this).attr("name");
                                        for (var i = 0; i < strarray.length; i++) {
                                            if (strarray[i] == chkbx) {
                                                var valuedis = strarray[i];
                                                if (valuedis != "") {
                                                    var value_Idss = valuedis.replace(/\s/g, '');
                                                }
                                                $("INPUT[name=" + tempname + "][value=" + value_Idss + "]").prop('checked', true);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        if (ftype == "radio") {
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                if (b.col1 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col1 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col1 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col1 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col1 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                if (b.col2 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col2 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col2 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col2 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col2 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                if (b.col3 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col3 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col3 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col3 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col3 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                if (b.col4 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col4 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col4 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col4 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col4 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                if (b.col5 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col5 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col5 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col5 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col5 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                if (b.col6 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col6 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col6 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col6 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col6 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                if (b.col7 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col7 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col7 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col7 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col7 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                if (b.col8 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col8 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col8 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col8 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col8 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                if (b.col9 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col9 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col9 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col9 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col9 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                if (b.col10 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col10 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col10 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col10 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col10 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                if (b.col11 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col11 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col11 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col11 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col11 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                if (b.col12 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col12 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col12 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col12 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col12 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                if (b.col13 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col13 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col13 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col13 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col13 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                if (b.col14 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col14 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col14 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col14 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col14 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                if (b.col15 == "Male") {
                                    $("INPUT[name=gender]").val(['Male']);
                                }
                                else if (b.col15 == "Female") {
                                    $("INPUT[name=gender]").val(['Female']);
                                }
                                else if (b.col15 == "Transgender") {
                                    $("INPUT[name=gender]").val(['Transgender']);
                                }
                                else if (b.col15 == "Yes") {
                                    $("INPUT[name=demotext" + lp + "]").val(['Yes']);
                                }
                                else if (b.col15 == "No") {
                                    $("INPUT[name=demotext" + lp + "]").val(['No']);
                                }
                            }
                        }
                        if (ftype == "select") {
                            var option5 = "";;
                            if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                if (String(b.col1) == "") {
                                }
                                else if (String(b.col1) != null) {
                                    $("#demotext" + lp).val('');
                                    //option5 = '<option value="' + b.col1 + '" selected > ' + b.col1 + ' </option>';
                                    //$("#demotext" + lp).append(option5);
                                    $("#demotext" + lp).val(b.col1);
                                    //$("#demotext" + lp).val('');
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                if (String(b.col2) == "") {
                                }
                                else if (String(b.col2) != null) {
                                    $("#demotext" + lp).val('');
                                    //option5 = '<option value="' + b.col2 + '" selected > ' + b.col2 + ' </option>';
                                    //$("#demotext" + lp).append(option5);
                                    $("#demotext" + lp).val(b.col2);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                if (String(b.col3) == "") {
                                }
                                else if (String(b.col3) != null) {
                                    option5 = '<option value="' + b.col3 + '" selected > ' + b.col3 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                if (String(b.col4) == "") {
                                }
                                else if (String(b.col4) != null) {
                                    option5 = '<option value="' + b.col4 + '" selected > ' + b.col4 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                if (String(b.col5) == "") {
                                }
                                else if (String(b.col5) != null) {
                                    option5 = '<option value="' + b.col5 + '" selected > ' + b.col5 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                if (String(b.col6) == "") {
                                }
                                else if (String(b.col6) != null) {
                                    option5 = '<option value="' + b.col6 + '" selected > ' + b.col6 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                if (String(b.col7) == "") {
                                }
                                else if (String(b.col7) != null) {
                                    option5 = '<option value="' + b.col7 + '" selected > ' + b.col7 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                if (String(b.col8) == "") {
                                }
                                else if (String(b.col8) != null) {
                                    option5 = '<option value="' + b.col8 + '" selected > ' + b.col8 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                if (String(b.col9) == "") {
                                }
                                else if (String(b.col9) != null) {
                                    option5 = '<option value="' + b.col9 + '" selected > ' + b.col9 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                if (String(b.col10) == "") {
                                }
                                else if (String(b.col10) != null) {
                                    option5 = '<option value="' + b.col10 + '" selected > ' + b.col10 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                if (String(b.col11) == "") {
                                }
                                else if (String(b.col11) != null) {
                                    option5 = '<option value="' + b.col11 + '" selected > ' + b.col11 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                if (String(b.col12) == "") {
                                }
                                else if (String(b.col12) != null) {
                                    option5 = '<option value="' + b.col12 + '" selected > ' + b.col12 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                if (String(b.col13) == "") {
                                }
                                else if (String(b.col13) != null) {
                                    option5 = '<option value="' + b.col13 + '" selected > ' + b.col13 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                if (String(b.col14) == "") {
                                }
                                else if (String(b.col14) != null) {
                                    option5 = '<option value="' + b.col14 + '" selected > ' + b.col14 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                            else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                if (String(b.col15) == "") {
                                }
                                else if (String(b.col15) != null) {
                                    option5 = '<option value="' + b.col15 + '" selected > ' + b.col15 + ' </option>';
                                    $("#demotext" + lp).append(option5);
                                }
                            }
                        }
                    });
                }
                if (b.CompanyName != "") {
                    var $select = $("#clientto").selectize();
                    var formData = new FormData();
                    formData.append("prefix", b.CompanyId)
                    $.ajax({
                        url: '/api/CallApi/loadcompanycontacts',
                        data: formData,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (response) {
                            var $select = $("#clientto").selectize();
                            var selectize = $select[0].selectize;
                            selectize.clear();
                            selectize.clearOptions();
                            var obj = JSON.parse(response.Data);
                            $('#fcaseclientcontact').empty();
                            $("#fcaseclientcontact").append($("<option></option>").val("0").text('Please Select'));
                            $.each(obj, function (i, a) {
                                if (b.Clientcontactid.toLowerCase() == a.val.toLowerCase()) {
                                    $('#fcaseclientcontact').append($('<option selected> ').val(a.val).text(a.label))
                                    //$("#fcaseclientcontact").prop("disabled", "disabled");
                                }
                                else {
                                    $('#fcaseclientcontact').append($('<option>').val(a.val).text(a.label))
                                }
                                selectize.addOption({ value: a.val, text: a["label"] });
                            }); //End of foreach Loop                            
                        },
                        error: function (response) {
                            alert(response.responseText);
                        },
                        failure: function (response) {
                            alert(response.responseText);
                        }
                    });
                    var formData1 = new FormData();
                    formData1.append("token", token);
                    $.ajax(
                        {
                            type: "POST",
                            url: "/api/callApi/loadcompanycontactsbycaseid", // Controller/View
                            data: formData1,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                var dataarray = [];
                                $.each(response.Data, function (i, b) {
                                    try {
                                        var selectize1 = $select1[0].selectize;
                                        var selecteduser = b.auser;
                                        dataarray.push(selecteduser)
                                    }
                                    catch (er) {
                                        alert(er.message);
                                    }
                                    selectize1.setValue(dataarray)
                                });
                                console.log(response);
                            },
                            failure: function (response) {
                                alert(data.responseText);
                            },
                            error: function (response) {
                                alert(data.responseText);
                            }
                        });
                }
                //end custom field bind
            });
            closeload();
        }, //End of AJAX Success function
        failure: function (response) {
            alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        } //End of AJAX error function
    });
    //Bind Other Party  Deatils
    bind_MatterTypeDetails();
    if (iprdaType == "IPRDACustomtype") {
        IprdaAdvAndDepDetails();
    }
    if (ioclType == "IOCLCustomtype") {
        IOCLAdvAndDepDetails();
    }
}
/*Bind matter type*/
function bind_MatterTypeDetails() {
    var formData = new FormData();
    formData.append("caseid", EncodeText(token));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/caseMatterDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var mydata = response.Data;
            var html = "";
            $.each(mydata, function (i, item) {
              
                var name = item.Name;
                var email = item.Email;
                var phone = item.Phone;
                var type = item.Type;
              
                //For Other Party Deatils
                $("#fName").val(name);
                $("#fEmail").val(email);
                $("#fPhone").val(phone);
                $("#fType").val(type);
                $("#ExtrapartyId").val(item.Id)
              
            });
            //$("#tbody_letigationDetails").empty();
            //html += "<tr>";
            //html += "<td><input type='text' class='form-control inputFormat' placeholder='Name' id='fName' name='fName' maxlength='50' /></td>";
            //html += "<td><input type='text' class='form-control inputFormat' placeholder='Email' id='fEmail' name='fEmail' maxlength='50'  /></td>";
            //html += " <td><input type='text' class='form-control inputFormat' placeholder='Phone' id='fPhone' name='fPhone' maxlength='10' /></td>";
            //html += "<td><input type='text' class='form-control inputFormat' placeholder='Type' id='fType' name='fType' maxlength='50' /></td>";
            //html += "<td><button type='button' id='case_btnsave1' class='sbtbtn' ><i class='fa fa-floppy-o' ></i></button>";
            //html += "</td>";
            //html += "</tr>";
            //$.each(mydata, function (i, item) {
            //    var name = item.Name;
            //    var email = item.Email;
            //    var phone = item.Phone;
            //    var type = item.Type;
            //    html += "<tr>";
            //    html += "<td>" + name + "</td>";
            //    html += "<td>" + email + "</td>";
            //    html += "<td>" + phone + "</td>";
            //    html += "<td>" + type + "</td>";
            //    html += "<td> <button type='button' class='btn btn-danger btn-sm remove_case' id='3' data-id='" + item.Id + "' ><i class='fa fa-trash-o'></i></button></td>";
            //    html += "<tr>";
            //});
            //$("#tbody_letigationDetails").append(html);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

//Pmrda advocate name and department binding
function IOCLAdvAndDepDetails() {
    var formData = new FormData();
    formData.append("caseid", EncodeText(token));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/IOCLAdvAndDepDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            debugger
            var mydata = response.Data;
            $.each(mydata, function (i, item) {
                $("#compAdvocate").val(item.AdvocateName);
                $("#compDepart").val(item.Department);
            });

        },
        failure: function (data) {
            console.log(data.responseText);
        },
        error: function (data) {
            console.log(data.responseText);
        }
    });
}

function IprdaAdvAndDepDetails() {
    var formData = new FormData();
    formData.append("caseid", EncodeText(token));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/IprdaAdvAndDepDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            debugger
            var mydata = response.Data;
            $.each(mydata, function (i, item) {
                $("#compAdvocate").val(item.AdvocateName);
                $("#compDepart").val(item.Department);
            });

        },
        failure: function (data) {
            console.log(data.responseText);
        },
        error: function (data) {
            console.log(data.responseText);
        }
    });
}
//statute of limitation
function LoadStatuteCase() {
    fflag = false;
    var html3 = '';
    var formData = new FormData();
    formData.append("caseid", token);
    formData.append("id", "");
    $.ajax({
        async: true,
        type: "POST",
        url: '/api/MatterApi/LoadStatuteCase',
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (d) {
            $.each(d.Data, function (i, a) {
                html3 += '<tr>';
                html3 += '<td>' + a.StatuteName + '</td>';
                html3 += '<td>' + formatDatetoIST(a.LimitDate) + '</td>';
                html3 += '<td>' + a.RemindDays + '</td>';
                if (a.DateSatisfied == 1) {
                    html3 += '<td>Yes</td>';
                }
                else {
                    html3 += '<td>No</td>';
                }
                html3 += '<td><a title="Edit" href="javascript:void()" id="editStatute" onclick=fn_EditStatute("' + a.Id + '") data-val="' + a.Id + '"><span class="glyphicon glyphicon-edit" style="color:#00c0ef"></span></a></td>';
                html3 += '<td><a title="Remove" href="javascript:void()" onclick=fn_DeleteStatute("' + a.Id + '") data-val="' + a.Id + '"><span class="glyphicon glyphicon-trash" style="color:red"></span></a></td>';
                html3 += '</tr>'
            });
            if (html3 != '') {
                $("#binddata").html("");
                $("#binddata").append(html3);
                $("#editStatuteItems").show();
            }
        },
        error: function (d) {
            alert(d.responseText);
        }
    });
}
function fn_UpdateStatute() {
    var isValidItem = true;
    if ($('#statutename').val().trim() == '') {
        isValidItem = false;
        $('#statutename').siblings('span.error').css('visibility', 'visible');
    }
    else {
        $('#statutename').siblings('span.error').css('visibility', 'hidden');
    }
    if ($('#limitdate').val().trim() == '') {
        isValidItem = false;
        $('#limitdate').siblings('span.error').css('visibility', 'visible');
    }
    else {
        $('#limitdate').siblings('span.error').css('visibility', 'hidden');
    }
    if ($('#statuteuser').val().trim() == '') {
        isValidItem = false;
        $('#statuteuser').siblings('span.error').css('visibility', 'visible');
    }
    else {
        $('#statuteuser').siblings('span.error').css('visibility', 'hidden');
    }
    if ($('#statutedays').val().trim() == '') {
        isValidItem = false;
        $('#statutedays').siblings('span.error').css('visibility', 'visible');
    }
    else {
        $('#statutedays').siblings('span.error').css('visibility', 'hidden');
    }
    if (isValidItem) {
        var ischkstatus = 0;
        var statutename = $("#statutename").val();
        var limitdate = $("#limitdate").val();
        var statuteuser = $("#statuteuser").val();
        var statutedays = $("#statutedays").val();
        if (document.getElementById("datesatisfied").checked == true) {
            var ischkstatus = 1;
        }
        var caseid = token;
        var id = $("#hdnStatuteId").val();
        var fcaseodate = $("#fcaseodate").val();
        var start = moment(fcaseodate);
        var end = moment(limitdate);
        var diffdate = end.diff(start, "days");
        if (statutedays > diffdate) {
            alert("Enter valid REMINDER");
            return false;
        }
        var formData = new FormData();
        formData.append("statutename", EncodeText(statutename));
        formData.append("limitdate", EncodeText(limitdate));
        formData.append("statuteuser", EncodeText(statuteuser));
        formData.append("statutedays", EncodeText(statutedays));
        formData.append("datesatisfied", EncodeText(ischkstatus));
        formData.append("caseid", EncodeText(caseid));
        formData.append("id", EncodeText(id));
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/MatterApi/UpdateStatuteCase',
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "Success") {
                    if (id == "") {
                        alert("Successfully added");
                    }
                    else {
                        alert("Successfully updated");
                    }
                    $('#statutename').val('').focus();
                    $('#limitdate,#statuteuser,#statutedays').val('');
                    $('#datesatisfied').removeProp("checked");
                    LoadStatuteCase();
                    $("#hdnStatuteId").val("");
                    $("#UpdateSTATUTE").text("Add");
                }
                else if (response1.Data == "error") {
                    alert("Oops! Something went wrong..");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
}

/*Remove case status*/
function fn_DeleteStatute(val) {
    var id = $("#hdnStatuteId").val();
    var formData = new FormData();
    formData.append("id", EncodeText(val));
    $.ajax({
        async: true,
        type: "POST",
        url: '/api/MatterApi/RemoveStatuteCase',
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "Success") {
                alert("Successfully deleted");
                LoadStatuteCase();
            }
            else if (response1.Data == "error") {
                alert("Oops! Something went wrong..");
            }
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Load case status*/
function fn_EditStatute(val) {
    var formData = new FormData();
    formData.append("caseid", EncodeText(UpdateStatuteCasetoken));
    formData.append("id", EncodeText(UpdateStatuteCaseval));
    $("#hdnStatuteId").val(val);
    $.ajax({
        async: true,
        type: "POST",
        url: '/api/MatterApi/LoadStatuteCase',
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (d) {
            $.each(d.Data, function (i, a) {
                $("#statutename").val(a.StatuteName);
                var limdt = a.LimitDate;
                try {
                    var limitdate = limdt.split('T')[0];
                    $("#limitdate").val(limitdate);
                }
                catch (er) {
                }
                $("#statuteuser").val(a.auser);
                $("#statutedays").val(a.RemindDays);
                if (a.DateSatisfied == "1") {
                    $("#datesatisfied").prop("checked", true);
                }
                else {
                    $("#datesatisfied").prop("checked", false);
                }
                $("#UpdateSTATUTE").text("Update");
            });
        },
        error: function (d) {
            alert(d.responseText);
        }
    });
}
