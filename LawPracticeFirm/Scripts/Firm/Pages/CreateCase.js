$(document).ready(function () {
    if (hscfield == "display:unset") {
        $("#hidecf,#resetcf").show();
    }
    else {
        $("#hidecf,#resetcf").hide();
    }
    clearrefilling();
    bind_caserefilling();
    try {
        var today = new Date().toISOString().split('T')[0];
        $("#fcaseodate").val(today);
    }
    catch (er) {
    }
    bindCommonDropdown("fmattertype", "Matter_Type", "Select");
    bindCommonDropdown("fcasecasetype", "Case_Type", "Select");
    bindCommonDropdown("fcasestatus", "Case_Status", "Select");
    bindCommonDropdown("fdisposedoption", "Disposed_Option", "Select");
    bindCommonDropdown("fdisputemattertype", "Dispute_Resolution", "Select");
    bindCommonDropdown("fcompanystructure", "COMPANY_STRUCTURE", "Select");
    $("#CertifiedCopyReceivedon").attr("max", new Date().toISOString());
    $("#CertifiedCopyAppliedon").attr("max", new Date().toISOString());

    /*Bind common dropdown list*/
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
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                }); //End of foreach Loop
                if (controlname == "fcasestatus") {
                    if (userrolesids == "1") {
                        var optiont1 = '<option value="Others" tag="Case Status" type="' + dropdownname + '" style="font-weight:bold;color:#069;">ADD NEW STATUS</option>';
                        $("#" + controlname).append(optiont1);
                    }
                }
                else if (controlname == "fcasecasetype") {
                    if (userrolesids == "1") {
                        var optiont1 = '<option value="Others" tag="Subject Type" type="' + dropdownname + '" style="font-weight:bold;color:#069;">ADD NEW SUBJECT TYPE</option>';
                        $("#" + controlname).append(optiont1);
                    }
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
    FillCourtType();
    /*Matter Type*/
    $('#fmattertype').change(function () {
        var mattertypeid = $('#fmattertype').val();
        if (mattertypeid == '42') {
            $("#divfcasetype").show();
            $("#divsubjecttype").show();
            $("#divcasedescription").show();
            $("#divVSCF").show();
            $("#divcourt").show();
            $("#divcnrno").show();
            if (dashcw == "display:unset" && IsCWActive == "1") {
                $("#divaddliveupdate").hide();
                $('#modalopenpartyname').hide();
            }
            else {
                $("#divaddliveupdate").hide().attr("id", "notauthorizedliveupdate");
                $('#modalopenpartyname').hide().attr("id", "notauthorized");
            }
            //$('#divMatterdetais').hide();
            $('#divMatterdetais').show();
            document.getElementById("rdOriginal").checked = true;
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
            $("#divaddliveupdate").hide();
            $("#CertifiedCopyAppliedon,#CertifiedCopyReceivedon").val("");
            $('input[name="rdcasetype"]').attr('checked', false);
            $('#modalopenpartyname').hide();
        }
        if (mattertypeid == '46') {
            $("#fmattertypeotherdiv").show();
        }
        else {
            $("#fmattertypeotherdiv").hide();
        }
        if (mattertypeid == '44') {
            $("#fdisputemattertypediv").show();
        }
        else {
            $("#fdisputemattertypediv").hide();
        }
    });
    var userType;
    /*Get data by selected user type*/
    $(document).on("change", "#fselectusertype", function () {
        var ele = document.getElementsByName('fselectusertype');
        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                userType = ele[i].value;
            }
        }
        if (userType == 'company') {
            $('#fsidebindcaseclient').val("");
            $('#divClientTeammamber').show();
            $('#lblmiddlename').hide();
            $('#msidebindcaseclient').hide();
            $('#lblLastname').hide();
            $('#lsidebindcaseclient').hide();
            $('#divcaseclientcontact').show();
            $('#Firstnameuser').html("Company Name");
        }
        if (userType == 'user') {
            $('#fsidebindcaseclient').val("");
            $('#divClientTeammamber').hide();
            $('#lblmiddlename').show();
            $('#msidebindcaseclient').show();
            $('#lblLastname').show();
            $('#lsidebindcaseclient').show();
            $('#divcaseclientcontact').hide();
            $('#Firstnameuser').html("First Name");
        }
    });

    /*Case status*/
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
    orderItems = [];
    orderItems.length = 0;

    //Add button click function
    $('#fcaseodate').change(function () {
        $("#limitdate").attr("min", $("#fcaseodate").val())
    });
    $('#add1').click(function () {
        //Check validation of order item
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
        var datesatisfied = $('#datesatisfied').is(":checked");
        datesatisfiedvalue = 0;
        if (datesatisfied == true) {
            datesatisfiedvalue = 1;
        }
        else {
            datesatisfiedvalue = 0;
        }
        var limitdate = $("#limitdate").val();
        var fcaseodate = $("#fcaseodate").val();
        var statutedays = $("#statutedays").val();
        var start = moment(fcaseodate);
        var end = moment(limitdate);
        var diffdate = end.diff(start, "days");
        if (statutedays > diffdate) {
            alert("Enter valid REMINDER");
            return false;
        }

        //Add item to list if valid
        if (isValidItem) {
            orderItems.push({
                StatuteName: $('#statutename').val().trim(),
                LimitDate: $('#limitdate').val().trim(),
                UserID: $('#statuteuser').val().trim(),
                SDay: parseFloat($('#statutedays').val().trim()),
                UserName: $('#statuteuser').find('option:selected').attr('tempusername'),
                DateSatisfy: datesatisfiedvalue
            });
            //Clear fields
            $('#statutename').val('').focus();
            $('#limitdate,#statuteuser,#statutedays').val('');
            $('#datesatisfied').removeProp("checked");
        }
        //populate order items
        GeneratedItemsTable1();
    });
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

    //function to show added item
    function GeneratedItemsTable1() {
        if (orderItems.length > 0) {
            var $table = $('<table id="table1" class="dataTable table table-bordered table-striped"/>');
            $table.append('<thead><tr><th>Statute Name</th><th>Limitation Date</th><th>Users</th><th>Reminder</th><th>DATE SATISFIED</th><th></th></tr></thead>');
            var $tbody = $('<tbody/>');
            $.each(orderItems, function (i, val) {
                var $row = $('<tr/>');
                $row.append($('<td/>').html(val.StatuteName));
                $row.append($('<td/>').html(val.LimitDate));
                $row.append($('<td/>').html(val.UserName));
                $row.append($('<td/>').html(val.SDay + " Days"));
                $row.append($('<td/>').html(val.DateSatisfy == 1 ? 'Yes' : 'No'));
                var $remove = $('<a href="#" ><span class="glyphicon glyphicon-trash" style="color:red"></span></a>');
                $remove.click(function (e) {
                    e.preventDefault();
                    orderItems.splice(i, 1);
                    GeneratedItemsTable1();
                });
                $row.append($('<td/>').html($remove));
                $tbody.append($row);
            });
            console.log("current", orderItems);
            $table.append($tbody);
            $('#orderItems1').html($table);
        }
        else {
            $('#orderItems1').html('');
        }
    }

    var caseopendt = $("#fcaseodate").val();
    $('#limitdate').attr('min', caseopendt);
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
    setInterval(function () {
        var tempcasessub = localStorage.getItem("commondropdownstatus");
        var tempcasestype = localStorage.getItem("commondropdowntype");
        if (tempcasessub != "") {
            bindCommonDropdown("fcasestatus", "Case_Status", "Select");
            localStorage.setItem("commondropdownstatus", "");
        }
        if (tempcasestype != "") {
            bindCommonDropdown("fcasecasetype", "Case_Type", "Select");
            localStorage.setItem("commondropdowntype", "");
        }
    }, 2000);
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
    $("#linkcontact").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/Configcontact/contact");
    });
    $("#hide").click(function () {
        $(".showhide").css("display", "none");
    });
    $("#removecfield").click(function () {
        $(".showhide").css("display", "block");
    });
    closeload();
    loadfieldcount();
    $(".validpanel").css("display", "none");
    var newURL = window.location.protocol + "/" + window.location.host
    var pagetype = type
    if (pagetype == "8") {
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
    $('#clientname').on('click', function () {
        $("#clientid").val("");
        $("#lduser").val("");
        $("#npassword").val("");
        $("#cpassword").val("");
        $('.hspass').hide();
    });

    //load Assign User
    function assignuser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                var option = '<option value="">Select</option>';
                $.each(obj, function (i, a) {
                    option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#assignto").append(option);
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

    //loadclientlist
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

    /*Load contact details*/
    function loadcontact() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/matterApi/ContactMatter",
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
                    var fname = a.fname;
                    var mname = a.mname;
                    var lname = a.lname;
                    if (fname == null) {
                        fname = "";
                    }
                    if (mname == null) {
                        mname = "";
                    }
                    if (lname == null) {
                        lname = "";
                    }
                    var option = '<option value="' + a["cid"] + '" > ' + fname + ' ' + mname + ' ' + lname + '</option>';
                    $("#mcontact").append(option);
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
    $("#savematter").click(function () {
        var chktype = $("#savematter").attr("type");
        if (chktype == "button")
            alert("Please first save/publish new added custom field.");
    });
    //$(document).click("#btnCancelPage", function () {
    //    var fcodeDetail = localStorage.getItem("FirmCode");
    //    window.location.href = '/' + fcodeDetail + '/firm/StandardCaseList';
    //});

    //load field count
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
                    $("#savematter").attr("type", "submit");
                    $(".glyphicon").removeProp("display");
                    //$(".showhide").css("display", "none");
                   
                   // $(".showhide").css("display", "none");
                  //  $(".showhide").hide();
                  //  document.getElementById("cusfeild1").style.display = "block";
                    //document.getElementById('idss').style.display = "block";
                    //document.getElementById("idss").style.display = "none";
                    //$(".showhide").removeProp("display");
                }
                else {
                    document.getElementById("hidecf").style.display = "block";
                    cfstatus = data.Data.length;
                    $("#savematter").attr("type", "button");
                    $("#publish").removeProp("disabled");
                    //$(".showhide").css("display", "block");
                    $(".glyphicon").prop("display", "block");
                    //$(".showhide").show();
                    //document.getElementById("showhide").style.display = "block";
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
            loadfield();
        });
    }

    // reset custom field
    $("#resetcf").click(function () {
        var result = confirm("Please download data before reset. You may loose your data. Are you sure to reset custom field data?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/matterApi/ResetCF",
                headers: {
                    'configurationtype': type
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $("#content").html("");
                    var datas = JSON.stringify(data);
                    loadfieldcount();
                    new PNotify({
                        title: 'Success!',
                        text: ' Page Reset Successfully',
                        type: 'success',
                        delay: 3000
                    });
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

    /*Publish custom field*/
    $("#publish").click(function () {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/PublishPage",
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

    //load field
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
    var removeicon = 0;
    var sum = 0;
    /*Load field*/
    function loadfield() {
        sum = 0;
        // alert(removeicon); 
        var ajaxTime1 = new Date().getTime();
        var rt1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/FirmEmployeescreate1",
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
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span><span class="cusfeild showhide glyphicon" id="idss" value="' + field['Id'] + '" ><img src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span class="cusfeild showhide glyphicon" id="idss" value="' + field['Id'] + '"><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span class="cusfeild showhide glyphicon" id="idss" value="' + field['Id'] + '"><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat" name="demotext' + sum + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> <span class="cusfeild showhide glyphicon" id="idss" value="' + field['Id'] + '" ><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true">*</span> <span id="idss" class="cusfeild showhide glyphicon" value="' + field['Id'] + '" ><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" ></div></div></div></div>';
                        $("#content").append(textBox);
                        $('#demotext' + sum).datetimepicker({
                            format: 'Y-m-d h:s'
                        });
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span class="cusfeild showhide glyphicon" id="idss" value="' + field['Id'] + '"><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span id="idss" class="cusfeild" value="' + field['Id'] + '"><img class="showhide" src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10"  minlength="10" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span id="idss" class="cusfeild showhide glyphicon" value="' + field['Id'] + '" ><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span id="idss" class="cusfeild showhide glyphicon" value="' + field['Id'] + '"><img  src="/newassets/img/deletematter.png" /></span></label ><input class="form-control inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" onkeypress="return restrictAlphabets(event)" ></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <sup class="required  rqd' + field['Id'] + '" style="color:red;font-size:10px;" aria-required="true"><b>*</b></sup> <span id="idss" value="' + field['Id'] + '" class="cusfeild showhide glyphicon"><img src="/newassets/img/deletematter.png" /></span></label><input class="form-control form-control-sm inputFormat"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></div></div></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        var selectvalues = field['FieldValues'];
                        var ftd = field['Id'];
                        if (selectvalues != null) {
                            html += '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span class="cusfeild showhide glyphicon" id="idss" value="' + field['Id'] + '" ><img  src="/newassets/img/deletematter.png" /></span></label ><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control selctInputFormat"  ' + requireds + ' name="demodropdown">';
                            html += '<option value="">Select</option>';
                            $.each(selectvalues.split(','), function (key, value) {
                                html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                            });
                            html += '</select>';
                        }
                        else {
                            html += '<div class="form-group spacer-h"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> </label ><div class="col-md-6"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control "  ' + requireds + ' name="demodropdown">';
                            html += '<option value="none">You have not Added any Option</option>';
                            html += '</select>';
                        }
                        $("#content").append(html + '</div></div></div></div>');
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        html += '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '" aria-required="true">*</span> <span id="idss" class="cusfeild showhide glyphicon" value="' + field['Id'] + '"><img  src="/newassets/img/deletematter.png" /></span></label ><div class="bor"  id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            if (key == "0") {
                                html += '&nbsp;&nbsp;<span><input type = "radio" class="gender" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  >&nbsp;' + value1 + '</span>';
                            }
                            else {
                                html += '&nbsp;&nbsp;<span><input type = "radio" class="gender"   placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  >&nbsp;' + value1 + '</span>';
                            }
                        });
                        $("#content").append(html + '</div></div></div></div>');
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        html += '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"  aria-required="true">*</span> <span id="idss" class="cusfeild showhide glyphicon" value="' + field['Id'] + '"><img  src="/newassets/img/deletematter.png" /></span></label ><div  class="bor" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<span class="">&nbsp;&nbsp;<input class="yesno" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  >' + value1 + '</span>';
                        });
                        $("#content").append(html + '</div></div></div></div>');
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        html += '<div class="col-md-6"><div><div class="form-group spacer-h"><label>' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"  aria-required="true">*</span> <span id="idss" class="cusfeild showhide glyphicon" value="' + field['Id'] + '" ><img  src="/newassets/img/deletematter.png" /></label><div class="" id="checkbox">';
                        var selectvalues1 = field['FieldValues'];
                        if (selectvalues1 != null) {
                            $.each(selectvalues1.split(','), function (key, value) {
                                html += '<span class=""><span style="margin-left:5px;">' + value + '</span> <input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  ></span>';
                            });
                        }
                        else {
                            html += '<span class=""><input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="none" ' + requireds + '  >none</span>';
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
            removeicon = localStorage.getItem("fcount");
            if (removeicon == "2") {
                $(".showhide").css("display", "none");
            }
            else {
                $(".showhide").css("display", "block");
            }
            if (loadfieldflag == false) {
                bindcasesubject();
                loadclientlist();
                loadmenu();
                loadfieldflag = true;
            }
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

    //load menu//
    //save data
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
        var txtfv = strcustomfield;//$("#txtcustomFieldvalue").val();
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
                                text: 'Custom Field   Added Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#content").html("");
                            sum = 0;
                            loadfieldcount();
                            $("#txtcustomFieldvalue").val('').hide();
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

    $("#btnHideControl").click(function () {
        $("#form2")[0].reset();
        $("#txtcustomFieldvalue").val('').hide();
    });
    //////////add contact
    function validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

    //save data
    $('form[id="savematterform"]').validate({
        submitHandler: function (form) {
            if (!validateEmail($("#OppositePartyCounselemail").val())) {
                alert("Please enter valid email id");
                return false;
            }
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
            var e = document.getElementById("fmattertype");
            var fmattertype = e.options[e.selectedIndex].value;
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
            if (String(clientto) == "null") {
                clientto = "";
            }
            if (fcasecasetype == "Others") {
                fcasecasetype = "";
            }
            if (fcasestatus == "Others") {
                fcasestatus = "";
            }
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (fcasecnr.trim() != "") {
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
            var comclient1 = $("#fsidebindcaseclient").val();
            if (comclient1 != "") {
                if (usertypes == "company") {
                    if (fcaseclientcontact == "") {
                        alert("select client contact lead");
                        document.getElementById("fcaseclientcontact").focus();
                        return false;
                    }
                }
            }
            //check creditials for client
            fcasesideuserid = "";
            fcasesidepassword = "";
            fcasesidecpassword = "";
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
            //For Other Party Deatils
            var otherpartyFname = $("#fName").val();
            var otherpartyEMail = $("#fEmail").val();
            var otherpartyPhone = $("#fPhone").val();
            var otherpartyType = $("#fType").val();
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
            formData.append("itemlistdata", JSON.stringify(orderItems));
            formData.append("clientno", EncodeText($("#clientno").val()));
            formData.append("casedetails", EncodeText($("#casedetails").val()));

            var ditrictidname = "";
            var rdmattertype = $("input[name='rdmattertype']:checked").val();
            var matterpolicstation = $("#matterpolicstation").val();
            var firno = $("#matterfirno").val();
            var casetype = $("input[name='rdcasetype']:checked").val();
            var IsCourtFeePaid = "";
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
            formData.append("ePartyName", EncodeText($("#ePartyName").val()));
            formData.append("ePartyFatherName", EncodeText($("#ePartyFatherName").val()));
            formData.append("ePartyAddress", EncodeText($("#ePartyAddress").val()));
            var ePartyGender = $("input[id='ePartyGender']:checked").val();
            formData.append("ePartyAdharCardNo", EncodeText($("#ePartyAdharCardNo").val()));
            formData.append("ePartyGender", EncodeText(ePartyGender));
            formData.append("ePartyDateOfBirth", EncodeText($("#ePartyDateOfBirth").val()));
            formData.append("ePartyEmail", EncodeText($("#ePartyEmail").val()));
            formData.append("ePartyNationality", EncodeText($("#ePartyNationality").val()));
            formData.append("ePartyMobileNo", EncodeText($("#ePartyMobileNo").val()));
            formData.append("NoticeId", EncodeText(NoticeId));
            var val = $("#fmattertype").val();
            formData.append("fmatterType", EncodeText(val));
            if (val == "46") {
                formData.append("txtMatterOther", EncodeText($("#fmattertypeother").val()));
            }
            else {
                formData.append("txtMatterOther", "");
            }
            if (val == "44") {
                formData.append("MatterType", EncodeText($("#fdisputemattertype").val()));
            }
            else {
                formData.append("MatterType", "");
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
            formData.append("fcompanystructure", "");
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
            //For Other Party Deatils
            formData.append("otherpartyFname", EncodeText(otherpartyFname));
            formData.append("otherpartyEMail", EncodeText(otherpartyEMail));
            formData.append("otherpartyPhone", EncodeText(otherpartyPhone));
            formData.append("otherpartyType", EncodeText(otherpartyType));
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
                    url: "/api/MatterApi/FullScreenSaveCase", // Controller/View
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
                        if (data.Data == "Sorry! Unable to Add now.") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Sorry! Unable to Add Matter.',
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
                        else if (data.Data == "Already exist matter name. please try another matter name") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Matter name already exists. Try another matter name.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "livecaselimitexceed") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'You have exceeded limit to add Case live update from e-Courts.',
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
                                    text: 'This matter is already exists.',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (data.Data == "Case Detail Already Exists!!") {
                                new PNotify({
                                    title: 'Warning!',
                                    text: 'Matter detail already exists!',
                                    type: 'error',
                                    delay: 3000
                                });
                                closeload();
                            }
                            else if (data.Data == "1") {
                                $("#savematterform")[0].reset();
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Matter created successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#assignto")[0].selectize.clear();
                                $("#clientto")[0].selectize.clear();
                                closeload();
                                $('.hspass').hide();
                                closeload();
                                var fcode5 = localStorage.getItem("FirmCode");
                                window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                                try {
                                    headercount();
                                    notification();
                                }
                                catch (er) {
                                }
                            }
                            else {
                                alert(data.Data);
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

    /*Fill court type details*/
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

/*Fill case type dairy*/
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
        // data: formData,
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

/*Fill register stamp*/
function FillStampRegister() {
    //added by umesh on 28 jan 20                  
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
$(document).on('keypress', '#drpdcourtcnr', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
function bind_caserefilling() {
    var formData = new FormData();
    var cdt = $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/TempcaseFillingDates",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var mydata = response.Data;
            var html = "";
            $("#tbody_casefillingdates").empty();
            html += "<tr>";
            html += "<td><input type='date' class='form-control inputFormat' onkeypress='return false;' placeholder='Submit Date' id='frsubmitDate' name='frsubmitDate' /></td>";
            html += "<td><input type='date' class='form-control inputFormat' onkeypress='return false;' placeholder='Return Date' id='freturnDate' name='freturnDate' /></td>";
            html += "<td><button title='save' type ='button' id ='case_btnsave1' class='btn btn-primary' onclick = 'fn_case_btnsave();' >Save</button>";
            html += "</td>";
            html += "</tr>";
            $.each(mydata, function (i, item) {
                let date_ob = new Date(item.SubmitDate);
                let date = ("0" + date_ob.getDate()).slice(-2);
                // current month
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                // current year
                let year = date_ob.getFullYear();
                let date_ob2 = new Date(item.ReturnDate);
                // adjust 0 before single digit date
                let date2 = ("0" + date_ob2.getDate()).slice(-2);
                // current month
                let month2 = ("0" + (date_ob2.getMonth() + 1)).slice(-2);
                // current year
                let year2 = date_ob2.getFullYear();
                var SubmitDate = year + "-" + month + "-" + date;
                var ReturnDate = year2 + "-" + month2 + "-" + date2;
                html += "<tr>";
                html += "<td>" + formatDatetoIST(item.SubmitDate) + "</td>";
                html += "<td>" + formatDatetoIST(item.ReturnDate) + "</td>";
                html += "<td> <button type='button' class='remove_case' id='0' style='border:none;background:transparent;padding:0;' data-id='" + item.Id + "' ><img src='/newassets/img/deletecasesingle-icon.png' /></button></td>";
                html += "<tr>";
            });
            $("#tbody_casefillingdates").append(html);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
    $.when(cdt).then(function (data, textStatus, jqXHR) {
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
            $('input[type = "date"]').attr("onkeydown", "");
            $('input[type = "date"]').attr("onkeypress", "");
        }
        $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
        $('input[type = "date"]').blur(function () {
            var dateString = $(this).val();
            if (dateString != "") {
                var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
                var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                if (regex.test(dateString)) {
                    var parts = dateString.split("-");
                    var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                    if (parseInt(parts[0]) < 1900) {
                        $(this).focus();
                        $(this).val("");
                        alert("Invalid Date");
                        return false;
                    }
                    if (parseInt(parts[0]) > 3000) {
                        $(this).focus();
                        $(this).val("");
                        alert("Invalid Date");
                        return false;
                    }
                    if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                        $(this).focus();
                        $(this).val("");
                        alert("Invalid Date");
                        return false;
                    }
                    if (parseInt(parts[2]) == 00) {
                        $(this).focus();
                        $(this).val("");
                        alert("Invalid Date");
                        return false;
                    }
                    var dtCurrent = new Date();
                    return true;
                } else {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
            }
        });
    });
}
//function bind_MatterTypeDetails() {
//    var html = "";
//    //$("#updateotherpartydeatils").empty();
//    html += '<div class="row">';
//    html += '<div class="form-grouph col-md-6"><label >Name</label><input type="text" class="form-control" placeholder="Enter party name" id="fName" name="fName" maxlength="50" /></div>';
//    html += '<div class="form-grouph col-md-6"><label >Email</label><input type="text" class="form-control" placeholder="Enter party email" id="fEmail" name="fEmail" maxlength="50" /></div>';
//    html += '<div class="form-grouph col-md-6"><label> Phone</label><input type="text" class="form-control" placeholder="Enter party phone" id="fPhone" name="fPhone" maxlength="10" /></div>';
//    html += '<div class="form-grouph col-md-6"><label > Type</label><input type="text" class="form-control" placeholder="Enter party type" id="fType" name="fType" maxlength="50" /></div>';
//    $("#updateotherpartydeatils").append(html);
//}
//bind_MatterTypeDetails();
////Matter type details
//function bind_MatterTypeDetails() {
//    var formData = new FormData();
//    $.ajax({
//        async: true,
//        type: "POST",
//        url: "/api/ExtraParty/TempcaseMatterDetails",
//        dataType: 'json',
//        data: formData,
//        contentType: false,
//        processData: false,
//        success: function (response) {
//            var mydata = response.Data;
//            var html = "";
//            $("#tbody_letigationDetails").empty();
//            html += "<tr>";
//            html += "<td><input type='text' class='form-control inputFormat' placeholder='Name' id='fName' name='fName' maxlength='50' /></td>";
//            html += "<td><input type='text' class='form-control inputFormat' placeholder='Email' id='fEmail' name='fEmail'  maxlength='50' /></td>";
//            html += " <td><input type='text' class='form-control inputFormat' placeholder='Phone' id='fPhone' name='fPhone' maxlength='10' /></td>";
//            html += "<td><input type='text' class='form-control inputFormat' placeholder='Type' id='fType' name='fType'  maxlength='50'/></td>";
//            html += "<td><button title='Save' type='button' id='case_btnsave1' class='sbtbtn' onclick='fn_litigation_btnsave();'><i class='fa fa-floppy-o'></i></button>";
//            html += "</td>";
//            html += "</tr>";
//            $.each(mydata, function (i, item) {
//                var name = item.Name;
//                var email = item.Email;
//                var phone = item.Phone;
//                var type = item.Type;
//                html += "<tr>";
//                html += "<td>" + name + "</td>";
//                html += "<td>" + email + "</td>";
//                html += "<td>" + phone + "</td>";
//                html += "<td>" + type + "</td>";
//                html += "<td><button type='button' class='btn btn-danger btn-sm remove_case' id='2' data-id='" + item.Id + "' ><i class='fa fa-trash-o'></i></button></td>";
//                html += "<tr>";
//            });
//            $("#tbody_letigationDetails").append(html);
//        },
//        failure: function (data) {
//            alert(data.responseText);
//        },
//        error: function (data) {
//            alert(data.responseText);
//        }
//    });
//}
$(document).on('click', '.edit_c', function () {
    var id = $(this).attr("data-id");
    $("#hdnid").val(id);
    $("#frsubmitDate").val($(this).attr("data-submitdt"));
    $("#freturnDate").val($(this).attr("data-returndt"));
    $("#c_btnsave").hide();
    $("#c_btnupdate").show();
    $("#c_btncancel").show();
});
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
                    bind_caserefilling();
                    //bind_MatterTypeDetails();
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

/*Filling*/
function clearrefilling() {
    // your function here
    var formData = new FormData();
    formData.append("Id", "");
    formData.append("flag", "1");
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
                bind_caserefilling();
            }
            else {
                //alert("Oops! Something went wrong..");
            }
        },
        failure: function (data) {
            //alert(data.responseText);
        },
        error: function (data) {
            //alert(data.responseText);
        }
    });
}
function fn_case_btnsave() {
    var sd1 = $("#frsubmitDate").val();
    var rd1 = $("#freturnDate").val();
    if (sd1 == "") {
        alert("select submit date");
        $("#frsubmitDate").focus();
        return false;
    }
    if (rd1 == "") {
        alert("select return date");
        $("#freturnDate").focus();
        return false;
    }
    var formData = new FormData();
    formData.append("frsubmitDate", EncodeText($("#frsubmitDate").val()));
    formData.append("freturnDate", EncodeText($("#freturnDate").val()));
    formData.append("token", $("#hdnid").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/PostCaseFillingDatesTemp",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status == true) {
                alert("Details successfully saved");
                bind_caserefilling();
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
/*Save litigation details*/
//function fn_litigation_btnsave() {
//    var sd1 = $("#fName").val();
//    var rd1 = $("#fEmail").val();
//    var sd2 = $("#fPhone").val();
//    var rd2 = $("#fType").val();
//    if (sd1 == "") {
//        alert("Please enter the name.");
//        $("#fName").focus();
//        return false;
//    }
//    var regex = /^[a-zA-Z. ]*$/;
//    if (!regex.test(sd1) == true) {
//        alert("Invalid Name");
//        $("#fName").focus();
//        return false;
//    }
//    //if (rd1 == "") {
//    //    alert("Enter Email");
//    //    $("#fEmail").focus();
//    //    return false;
//    //}
//    //var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
//    //if (reg.test(rd1) == false) {
//    //    alert('Invalid Email Address');
//    //    return false;
//    //}
//    //if (sd2 == "") {
//    //    alert("Enter Phone");
//    //    $("#fPhone").focus();
//    //    return false;
//    //}
//    //var phoneno = /^\d{10}$/;
//    //if (!sd2.match(phoneno)) {
//    //    alert("Invalid Phone Number");
//    //    return false;
//    //}
//    //if (rd2 == "") {
//    //    alert("Enter Type");
//    //    $("#fType").focus();
//    //    return false;
//    //}
//    //if (!regex.test(rd2) == true) {
//    //    alert("Invalid Type");
//    //    $("#fType").focus();
//    //    return false;
//    //}
//    var formData = new FormData();
//    formData.append("fName", EncodeText($("#fName").val()));
//    formData.append("fEmail", EncodeText($("#fEmail").val()));
//    formData.append("fPhone", EncodeText($("#fPhone").val()));
//    formData.append("fType", EncodeText($("#fType").val()));
//    $.ajax({
//        async: true,
//        type: "POST",
//        url: "/api/ExtraParty/PostSaveLitigationTemp",
//        dataType: 'json',
//        data: formData,
//        contentType: false,
//        processData: false,
//        success: function (response) {
//            if (response.Status == true) {
//                alert("Details successfully saved");
//                openload();
//                //bind_MatterTypeDetails();
//                bind_MatterTypeDetails();
//                closeload();
//            }
//            else {
//                alert("Oops! Something went wrong..");
//            }
//        },
//        failure: function (data) {
//            alert(data.responseText);
//        },
//        error: function (data) {
//            alert(data.responseText);
//        }
//    });
//}
/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
