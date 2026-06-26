$(document).ready(function () {
    var ispublished = "";
    /*Sort feild sequence*/
    $("#content").sortable({
        update: function (event, ui) {
            var itemIds = "";
            $("#content").find(".dymenu").each(function () {
                var itemid = $(this).attr("data-taskid");
                itemIds = itemIds + itemid + ",";
            });
            var formData = new FormData();
            formData.append("itemIds", itemIds);
            if (ispublished == false) {
                $.ajax({
                    async: true,
                    url: '/api/CallApi/cfieldSequnce',
                    data: formData,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (data) {
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning!',
                    text: 'Form is already published. You cannot change position.',
                    type: 'error',
                    delay: 3000
                });
            }
        }
    });
    /*Create directory*/
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        if (dirname == "") {
            $(".validpanel").css("display", "block").html("Enter Form Name !");
        }
        formData.append("dname", dirname);
        if (dirname != "") {
            $.ajax({
                async: true,
                url: '/api/CallApi/CreateCustomForm',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#foldercreate")[0].reset();
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (response.Data == "Form already exists.") {
                            new PNotify({
                                title: 'Warning!',
                                text: ' Form already exists.',
                                type: 'error',
                                delay: 3000
                            });
                        }
                        else {
                            $(".validpanel").css("display", "none");
                            new PNotify({
                                title: 'Success!',
                                text: ' Form Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            loadform();
                        }
                    }
                    else {
                        alert("not found");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
    /*Hide*/
    $("#hide").click(function () {
        $(".glyphicon-trash").css("display", "none");
    });
    var stype = "";
    var check = false;
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(".validpanel").css("display", "none");
    var type = 6;
    var pagetype = type;
    try {
        var selectid = formids;
        if (selectid == "") {
            stype = selectid;
        }
        else {
            stype = selectid;
            localStorage.setItem("type", stype);
            openload();
            loadfield();
            CheckPublishForm();
        }
    }
    catch (err) {
    }
    loadmenu();
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
    $('#formtype').on('change', function () {
        openload();
        var selectid = this.value;
        stype = selectid;
        localStorage.setItem("type", stype);
        if (selectid == "") {
            new PNotify({
                title: 'Warning!',
                text: ' Select Form',
                type: 'error',
                delay: 3000
            });
            closeload();
        }
        else {
            loadfield();
            CheckPublishForm();
        }
    });

    /*Remove custom field*/
    $("#removecfield").click(function () {
        var result = confirm(" download data before reset. You may loose your data. Are you sure to reset custom field data?");
        if (result) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/CustomFormResetCF",
                headers: {
                    'configurationtype': type,
                    'formid': stype
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $("#content").html("");
                    loadfield();
                    new PNotify({
                        title: 'Success!',
                        text: ' Page Reset Successfully',
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
        }
    });
    $("#removecfield").css("display", "none");
    /*Check publish form*/
    function CheckPublishForm() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/CheckPublishForm",
            headers: {
                'formid': stype
            },
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
                    ispublished = a.IsPublished;
                    if (ispublished == true && (a.savecount != "0" || a.wfcount != "0")) {
                        check = true;
                        $(".glyphicon-trash").css("display", "none");
                        $("#removecfield").css("display", "none");
                        $("#ctype").empty().append('<option value="23" formatter="null" defaultvalues="" aurl="">  Accept / Reject</option>');
                    }
                    else {
                        check = false;
                        $(".glyphicon-trash").css("display", "block");
                        $("#removecfield").css("display", "block");
                    }
                });
                if (check == false) {
                    $("#ctype").empty();
                    loadmenu();
                }
                closeload();//End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    loadform();
    /*Load form*/
    function loadform() {
        $("#formtype").html("");
        var option1 = '<option value="" selected >Select Form</option>';
        $("#formtype").append(option1);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCform",
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
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" > ' + a["FormName"] + '</option>';
                    $("#formtype").append(option);
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
    //load field count
    function loadfieldcount() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/CustomFieldCount",
            headers: {
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var datas = JSON.stringify(data);
                localStorage.setItem("fcount", data.Data.length);
                if (data.Data.length == 2) {
                    $(".glyphicon").removeProp("display");
                }
                else {
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
    }
    
    //load field
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/FirmApi/CustomFormCustomFields",
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
    var j4 = "";
    var removeicon = 0;
    var sum = 0;
    function loadfield() {
        sum = 0;
        $("#content").html("");
        removeicon = localStorage.getItem("fcount");
        if (removeicon == 0) {
            $(".glyphicon-trash").css("display", "none");
        }
        else {
            $(".glyphicon-trash").show();
        }
        j4 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/ViewCFormFields",
            headers: {
                'configurationtype': type,
                'SubConfigurationType': stype
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var obj = JSON.parse(data.Data);
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8 input-groups"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // file
                    if (field["FieldType"] == "19") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="file" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //Accept Reject
                    if (field["FieldType"] == "23") {
                        sum = sum + 1;
                        var html = '';
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input type="radio" class="" id="fac" name="acstatus" value="1" checked/>Accept&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="acstatus"  class="" id="fac" value="2"/>Reject<input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="Comment" type="text" value=""  id="fcomment" ' + requireds + ' name="fcomment"> </label><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        html += '';
                        $("#content").append(html);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="Date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                        $('#demotext' + sum).datetimepicker();
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span>  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="10" onkeypress="return restrictAlphabets(event)"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        var selectvalues = field['FieldValues'];
                        var ftd = field['Id'];
                        if (selectvalues != null) {
                            html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" data-taskid="' + field["Id"] + '"  class="form-control dymenu"  ' + requireds + ' name="demodropdown">';
                            html += '<option value="">Select</option>';
                            $.each(selectvalues.split(','), function (key, value) {
                                html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                            });
                            //alert(ftd);
                            html += '</select>';
                        }
                        else {
                            html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control dymenu"  ' + requireds + ' name="demodropdown">';
                            html += '<option value="none">You have not Added any Option</option>';
                            html += '</select>';
                        }
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span>  </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline"><input type = "radio" data-taskid="' + field["Id"] + '"  class="gender  dymenu" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > ' + value1 + '</label>';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:right;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span>  </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline"><input class="yesno dymenu " data-taskid="' + field["Id"] + '" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  > ' + value1 + '</label>';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:right" class="glyphicon glyphicon-trash"></span>');
                    }
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8" id="checkbox">';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value) {
                            html += '<label class="checkbox-inline"><input class="demotext' + sum + ' clist  dymenu"  data-taskid="' + field["Id"] + '" myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  >' + value + '</label >';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:right;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select  data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="democlient">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        loadcase();
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu case' + field['Id'] + ' " ' + requireds + ' name="democase">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="demouser">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="demoteam">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
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

    ///delete id
    $(document).on("click", "#idss", function () {
        var t = $(this).attr("value");
        var type = localStorage.getItem("type");
        var result = confirm("Are you sure to delete this field?");
        if (result) {
            //Logic to delete the item
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/CustomFormRemoveField",
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
                    try {
                        if (formids != "") {
                            stype = formids;
                        }
                    }
                    catch (err) {
                    }
                    loadfieldcount();
                    loadfield();
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
        var intype = "";
        $("#content").each(function () {
            intype = $(this).find(':input[type="file"]').attr("type");
        });
        $("#content").each(function () {
            artype = $(this).find(':input[type="file"]').attr("type");
        });
        $("#content").each(function () {
            artype = $(this).find('#fac').attr("id");
        });
        formtype = $("#formtype").val();
        var cctypes = $("#ctype").val();
        try {
            if (formtype != "") {
                formtype = $("#formtype").val();
            }
            else {
                formtype = formids;
            }
        }
        catch (err) {
        }
        var txtfn = $("#txtcustomFieldName").val();
        var ct = $("#ctype").val();
        var txtfv = $("#txtcustomFieldvalue").val();
        var txtr = $.trim($("#chkRequired").is(":checked"));
        if (artype == undefined && cctypes != "23") {
            $(".validpanel").css("display", "block").html(" Select First Compulsory Field- Accept / Reject !");
            return false;
        }
        if (formtype == "") {
            $(".validpanel").css("display", "block").html("  Select Form to Add Custom Field !");
            new PNotify({
                title: 'Success!',
                text: ' Select Form to Add Custom Field !',
                type: 'error',
                delay: 3000
            });
        }
        else if (txtfn == "") {
            $(".validpanel").css("display", "block").html(" Custom Field Name is Required !");
        }
        else if (ct == "0") {
            $(".validpanel").css("display", "block").html(" Select Custom Field Type is Required !");
        }
        else if (ct == "1" && txtfv == "") {
            $(".validpanel").css("display", "block").html("  Fill  Data in List Option!");
        }
        else if (ct == "4" && txtfv == "") {
            $(".validpanel").css("display", "block").html("  Fill  Data in List Option!");
        }
        else if (intype == "file" && cctypes == "19") {
            $(".validpanel").css("display", "block").html(" Input Type File can not added Again !");
        }
        else if ($("#fac").attr("id") == "fac" && cctypes == "23") {
            $(".validpanel").css("display", "block").html(" Accept / Reject  can not added Again !");
        }
        else {
            if (sum < 15) {
                $("#addfield").attr("disabled", "disabled");
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/demo/PostSaveFirmCustomFieldsother", // Controller/View
                        data: {
                            FieldName: txtfn,
                            FieldType: ct,
                            FieldValues: txtfv,
                            IsRequired: txtr,
                            ConfigurationType: "6",
                            Sequence: "1",
                            SubConfigurationType: formtype,
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
                            stype = formtype;
                            loadfieldcount();
                            loadfield();
                            $(".validpanel").css("display", "none");
                            $("#addfield").removeAttr("disabled");
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
    loadcase();

    /////load cases
    function loadcase() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/CustomCases",
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
                    var option = '<option value="' + a["Id"] + '" >' + a["CaseType1"] + '</option>';
                    $(".case10209").append(option);
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
});
