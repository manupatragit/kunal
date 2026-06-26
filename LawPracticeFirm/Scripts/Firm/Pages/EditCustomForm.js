$(document).ready(function () {
    var type = 6;
    loadfield();
    var fcode = localStorage.getItem("FirmCode");
    $("#createformlink").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/CreateCustomForm");
    });

    /*Sort custom field sequence*/
    $("#content").sortable({
        update: function (event, ui) {
            var itemIds = "";
            $("#content").find(".dymenu").each(function () {
                var itemid = $(this).attr("data-taskid");
                itemIds = itemIds + itemid + ",";
            });
            var formData = new FormData();
            formData.append("itemIds", itemIds);
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
    });
    $("#hide").click(function () {
        $(".glyphicon-trash").css("display", "none");
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(".validpanel").css("display", "none");
    var pagetype = type;
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
    var stype = "";
    loadform();
    /*Load form details*/
    function loadform() {
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
    //publish page
    $("#publish").click(function () {
        if (id == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please Select Form to Add Custom Field !',
                type: 'error',
                delay: 3000
            });
        }
        else {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/PublishCformPage",
                headers: {
                    'configurationtype': type,
                    'SubConfigurationType': id
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: 'Published Successfully',
                        type: 'success',
                        delay: 3000
                    });
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8 input-groups"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="Date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="datetime-local" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><input class="form-control dymenu" data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"><span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><select id="demotext' + sum + '"  data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" class="form-control dymenu "  ' + requireds + ' name="demodropdown">';
                        var selectvalues = field['FieldValues'];
                        var ftd = field['Id'];
                        $.each(selectvalues.split(','), function (key, value) {
                            html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                        });
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
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
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline"><input class="yesno dymenu " data-taskid="' + field["Id"] + '" checked placeholder="' + field["FieldName"] + '" type = "radio" value="' + value1 + '" name = "demotext' + sum + '" id="demotext' + sum + '"  ' + requireds + '  > ' + value1 + '</label>';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:rights;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8" id="checkbox">';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value) {
                            html += '<label class="checkbox-inline"><input class="demotext' + sum + ' clist  dymenu"  data-taskid="' + field["Id"] + '" myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  >' + value + '</label >';
                        });
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><select  data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="democlient">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        loadcase();
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu case' + field['Id'] + ' " ' + requireds + ' name="democase">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '"  placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="demouser">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><select data-taskid="' + field["Id"] + '" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control dymenu " ' + requireds + ' name="demoteam">';
                        html += '</select>';
                        $("#content").append(html + '<span id="idss" value="' + field['Id'] + '" style="float:left;padding:8px 0 0 2px;" class="glyphicon glyphicon-trash"></span>');
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

    ///delete id
    $(document).on("click", "#idss", function () {
        var t = $(this).attr("value");
        var result = confirm("Are you sure to   delete this field?");
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
        var formtype = id;
        var txtfn = $("#txtcustomFieldName").val();
        var ct = $("#ctype").val();
        var txtfv = $("#txtcustomFieldvalue").val();
        var txtr = $.trim($("#chkRequired").is(":checked"));
        if (formtype == "") {
            $(".validpanel").css("display", "block").html(" Please Select Form to Add Custom Field !");
            new PNotify({
                title: 'Success!',
                text: 'Please Select Form to Add Custom Field !',
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
        else {
            if (sum < 15) {
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/demo/PostSaveFirmCustomFields", // Controller/View
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
                            $('#myModal').modal('hide');
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
                            loadfield();
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
});
