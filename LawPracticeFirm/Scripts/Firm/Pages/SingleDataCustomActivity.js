$(document).ready(function () {
    var type = 10;
    var removeicon = 0;
    var sum = 0;
    loadfield();
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/CustomActivitySingleEdit";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var filedata = $(this).attr("data-val");
        localStorage.setItem("filedata-val", filedata);
        var url = "/firm/workflowfilelist/?ftype=customactivity&data=" + fileid;
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
    $(".validpanel").css("display", "none");

    /*Load custom field*/
    function loadcf() {
        d2 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/CallApi/CaSpColMaps1',
            headers: {
                'fid': id
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    try {
                        var obj = JSON.parse(response.Data);
                        var cc = 0;
                        var ty = "";
                        $.each(obj, function (i, d) {
                            cc = cc + 1;
                            ty = $("#demotext" + cc).attr("id");
                            $("#demotext" + cc).attr("tempvalue" + cc, "col" + cc);
                        });
                    }
                    catch (er) {
                        $(".transferpage").css("display", "none");
                        alert("Data not available");
                        return false;
                    }
                    closeload();
                }
                else {
                    closeload();
                }
            },
            error: function () {
                closeload();
            }
        });
        $.when(d2).then(function (data, textStatus, jqXHR) {
            loadfm();
            closeload();
        });
    }
    function loadfm() {
        var ctr = 0;
        var formData = new FormData();
        formData.append("mid", token);
        d3 = $.ajax({
            async: true,
            url: '/api/CallApi/SingleCustomAcivityDetails',
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
                        $("#subject").text(b.subject);
                        $("#case").text(b.mattername);
                        $("#assignto").text(b.assignuserto1);
                        ctr = ctr + 1;
                        for (lp = 1; lp <= 15; lp = lp + 1) {
                            $('#demotext' + lp).is(function () {
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                    if (b.Filenames == "demotext1" && b.col1 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer;' id='filelink'  data-val='" + b.col1 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col1 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col1));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                    if (b.Filenames == "demotext2" && b.col2 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col2 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col2 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col2));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                    if (b.Filenames == "demotext3" && b.col3 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col3 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col3 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col3));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                    if (b.Filenames == "demotext4" && b.col4 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col4 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col4 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col4));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                    if (b.Filenames == "demotext5" && b.col5 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col5 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col5 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col5));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                    if (b.Filenames == "demotext6" && b.col6 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col6 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col6 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col6));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                    if (b.Filenames == "demotext7" && b.col7 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col7 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col7 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col7));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                    if (b.Filenames == "demotext8" && b.col8 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col8 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col8 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col8));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                    if (b.Filenames == "demotext9" && b.col9 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col9 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col9 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col9));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                    if (b.Filenames == "demotext10" && b.col10 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col10 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col10 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col10));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                    if (b.Filenames == "demotext11" && b.col11 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col11 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col11 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col11));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                    if (b.Filenames == "demotext12" && b.col12 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col12 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col12 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col12));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                    if (b.Filenames == "demotext13" && b.col13 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col13 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col13 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col13));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                    if (b.Filenames == "demotext14" && b.col14 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col14 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col14 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col14));
                                    }
                                }
                                if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                    if (b.Filenames == "demotext15" && b.col15 != "") {
                                        $("#demotext" + lp).html("<span>" + "<a style='cursor:pointer' id='filelink'  data-val='" + b.col15 + "'  id-val=" + b.cid + ">Download File</a>");
                                    }
                                    else if (b.col15 == "") {
                                        $("#demotext" + lp).html("");
                                    }
                                    else {
                                        $("#demotext" + lp).html(checkdatetimecustom(b.col15));
                                    }
                                }
                                else {
                                }
                                $("#demotext" + lp).html($("#demotext" + lp).html().replace(/((http:|https:)[^\s]+[\w])/g, '<a href="$1" style="word-break: break-all;" target="_blank">$1</a>'));
                            });
                        }
                    });
                }
                else {
                    //alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        closeload();
    }

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
        openload();
        d1 = $.ajax({
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
                    if (field["FieldType"] == "19") {
                        // alert("g");
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                }); //End of foreach Loop closeload();
                closeload();
            }, //End of AJAX Success function
            failure: function (data) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (data) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    //save custom form data
    $.when(d1).then(function (data, textStatus, jqXHR) {
        loadcf();
        closeload();
    });
});
