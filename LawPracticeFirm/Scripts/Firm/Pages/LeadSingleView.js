$(document).ready(function () {
    var d1, d2, d3;
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    openload();
    loadfield();
    $("#linklead").click(function () {
        var urls = "/" + fcode + "/Firm/LeadSingleEdit";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": id }
        });
    });
    $(document).on("click", "#alink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=Lead&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModaldocs').modal({ show: true });
        });
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Notice status*/
    function notisttaus() {
        var formData = new FormData();
        formData.append("typeids", id);
        $.ajax({
            async: true,
            url: '/api/CallApi/updatenotistatus',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
            }
        });
    }
    /*Load cf*/
    function loadcf() {
        d2 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/LeadApi/SpColMaps1',
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
                    try {
                        $.each(obj, function (i, d) {
                            cc = cc + 1;
                            $("#demotext" + cc).attr("tempvalue" + cc, "col" + cc);
                        });
                    }
                    catch (err) {
                        // alert(err.message)
                    }
                }
                else {
                    alert("not found1");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(d2).then(function (data, textStatus, jqXHR) {
            loadfm();
        });
    }

    /*Load fm*/
    function loadfm() {
        var ctr = 0;
        var formData = new FormData();
        formData.append("mid", id);
        d3 = $.ajax({
            async: true,
            url: '/api/LeadApi/SingleLeadDetails',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj1 = JSON.parse(response.Data);
                    var lp = 1;
                    var ftype = "";
                    $.each(obj1, function (i, b) {
                        ctr = ctr + 1;
                        for (lp = 1; lp <= 15; lp = lp + 1) {
                            $('#demotext' + lp).is(function () {
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col1));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col2));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col3));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col4));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col5));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col6));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col7));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col8));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col9));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col10));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col11));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col12));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col13));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col14));
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                    $("#demotext" + lp).html(checkdatetimecustom(b.col15));
                                }
                                else {
                                }
                                $("#demotext" + lp).html($("#demotext" + lp).html().replace(/((http:|https:)[^\s]+[\w])/g, '<a href="$1" style="word-break: break-all;" target="_blank">$1</a>'));
                            });
                        }
                        $("#lname").html(b.ldname);
                        $("#cperson").html(b.ldcperson);
                        $("#org").html(b.ldorg);
                        $("#lpost").html(b.lddesign);
                        $("#laddress").html(b.ldadd);
                        $("#lpin").html(b.ldpin);
                        $("#lcountry").html(b.ldcountry);
                        $("#lstate").html(b.ldstate);
                        $("#lcity").html(b.ldcity);
                        $("#lfax").html(b.ldfax);
                        $("#lemail").html(b.ldemail);
                        $("#lphn").html(b.ldphn);
                        $("#lmob").html(b.ldmob);
                        $("#lbtype").html(b.ldctype);
                        $("#lsource").html(b.ldsource);
                        $("#lcategory").html(b.ldcategory);
                        $("#ltype").html(b.ldltype);
                        $("#lplan").html(b.ldplan);
                        $("#lec").html(b.ldec);
                        $("#linfo").html(b.ldinfo);
                        if (b.lddocs == "") {
                            $("#alink").css("display", "none");
                        }
                        else if (b.lddocs == null) {
                            $("#alink").css("display", "none");
                        }
                        else {
                            $("#alink").attr("id-val", id);
                            $("#alink").attr("data-val", b.lddocs);
                        }
                    });
                }
                else {
                    alert("not found2");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        notisttaus();
        closeload();
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
                    $("#publish").prop("disabled", "disabled");
                    $("#savematter").removeProp("disabled");
                    $(".glyphicon").removeProp("display");
                }
                else {
                    $("#savematter").prop("disabled", "disabled");
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
    }
    //publish page
    var removeicon = 0;
    var sum = 0;
    function loadfield() {
        sum = 0;
        d1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/demo/FirmEmployees1",
            headers: {
                'configurationtype': type
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8 input-groups"><span class=""  placeholder="' + field["FieldName"] + '" type="label"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><span class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  maxlength="' + field["MaxLength"] + '" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" maxlength="' + field["MaxLength"] + '" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class="" placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        loadcase();
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //var option = '<option value="' + field["Id"] + '" formatter="' + field["Formatter"] + '" defaultvalues="' + (field["DefaultValues"] === null ? "" : field["DefaultValues"]) + '" aurl="' + (field["Url"] === null ? "" : field["Url"]) + '">' + field["Id"] + '</option>';
                    // $("#dummy").append(option);
                }); //End of foreach Loop closeload();
                //console.log(response);//End of foreach Loop
            }, //End of AJAX Success function
            failure: function (data) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (data) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $.when(d1).then(function (data, textStatus, jqXHR) {
        loadcf();
    });
});