/**
 * Preview image
 * @param {any} event
 */
function preview_image(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output_image');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}
$(document).ready(function () {
    var d1, d2, d3;
    var fcode = localStorage.getItem("FirmCode");
    $("#menucontact").click(function () {
        var urls = "/" + fcode + "/Firm/ContactSingleEdit";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": id }
        });
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }

    /*Update notice status*/
    function notisttaus() {
        var formData = new FormData();
        formData.append("typeids", dtoe(id));
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
    openload();

    /*Load custom field*/
    function loadcf() {
        var ajaxTime1 = new Date().getTime();
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
                var totalTime1 = new Date().getTime() - ajaxTime1;
                console.log("custom column:" + totalTime1);
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
                        //alert(err.message)
                    }
                }
                else {
                    //  alert("not found1");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(d2).then(function (data, textStatus, jqXHR) {
            loadfc();
        });
    }

    /*Load fc*/
    function loadfc() {
        var formData = new FormData();
        formData.append("mid", id);
        var ajaxTime = new Date().getTime();
        d3 = $.ajax({
            async: true,
            url: '/api/CallApi/SingleContactDetails',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj1 = JSON.parse(response.Data);
                    var lp = 1;
                    var ftype = "";
                    var mdname = "";
                    var ltname = "";
                    $.each(obj1, function (i, b) {
                        try {
                            if (b.cphoto != null) {
                                $('#output_image').attr('src', b.cphoto);
                            }
                            else {
                                $('#output_image').attr('src', "/PanelDesign/images/Default_User_pic_new.png");
                            }
                            if (b.mname != null) {
                                mdname = b.mname;
                            }
                            if (b.lname != null) {
                                ltname = b.lname;
                            }
                            $("#fname").html(b.fname + " " + mdname + " " + ltname);
                            $("#home").html(b.homeno);
                            $("#mob").html(b.mobno);
                            $("#cnotes").html(b.cnotes);
                            $("#office").html(b.offno);
                            $("#fax").html(b.fax);
                            $("#email").html(b.cemail);
                            $("#address").html(b.cadd1);
                            $("#assign").html(b.assignuser);
                            $("#tags").html(b.ctags);
                            $("#number").html(b.cnumber);
                            $("#website").html(b.cwebsite);
                            $("#contacttypes").html(b.ContactType);
                            var cp = b.cport;
                            if (cp == "1") {
                                $("#cport").html("Yes");
                            }
                            else {
                                $("#cport").html("No");
                            }
                            var baseurl = window.location.origin;
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
                        }
                        catch (err) {
                        }
                    });
                }
                else {
                    //    alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        closeload();
        notisttaus();
    }
    loadfieldcount();

    //load field count
    function loadfieldcount() {
        var d0 = $.ajax({
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
                if (data.Data.length == 2) {
                    $("#publish").prop("disabled", "disabled");
                    $("#addcontact").removeProp("disabled");
                }
                else {
                    $("#addcontact").prop("disabled", "disabled");
                    $("#publish").removeProp("disabled");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.when(d0).then(function (data, textStatus, jqXHR) {
            loadfield();
        });
    }

    //publish page
    var sum = 0;
    function loadfield() {
        var ajaxTime2 = new Date().getTime();
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
                var totalTime2 = new Date().getTime() - ajaxTime2;
                console.log("customfielddetails map:" + totalTime2);
                var datas = JSON.stringify(data);
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8 input-groups"><span style="font-weight:normal"   class=""  placeholder="' + field["FieldName"] + '" type="label"  value=""   id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></span></div></div>';
                        $("#content").append(textBox);
                        //  alert(sum);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><span class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span  style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  maxlength="' + field["MaxLength"] + '" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" maxlength="' + field["MaxLength"] + '" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class="" placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        loadcase();
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        // alert("g");
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        // alert("g");
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal"  class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                });
            }, //End of AJAX Success function
            failure: function (data) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (data) {
                alert(data.responseText);
            } //End of AJAX error function
        });
        $.when(d1).then(function (data, textStatus, jqXHR) {
            loadcf();
        });
    }

    //save data
    $('form[id="savecontact"]').validate({
        submitHandler: function (form) {
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
                        // alert(selected6);
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
                        // alert(selected7);
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
                        // alert(selected8);
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
                        // alert(selected9);
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
                        // alert(selected10);
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
                        // alert(selected11);
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
                        // alert(selected12);
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
                        // alert(selected13);
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
                        // alert(selected14);
                    } else {
                        tx14 = tx14;
                    }
                }
                if (c15 == "demotext15") {
                    var chkArray15 = [];
                    chkArray15.push($(this).val());
                    var selected15;
                    selected15 = chkArray15.join(',');
                    if (selected15.length > 0) {
                        tx15 = selected15;
                        // alert(selected15);
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
            var cp = '';
            if ($("#cport:checked").prop('checked')) {
                cp = $("#cport:checked").val();
            }
            else {
                cp = "0";
            }
            lname = $("#lname").val();
            fname = $("#fname").val();
            homeno = $("#home").val();
            mobno = $("#mob").val();
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
            offno = $("#office").val();
            fax = $("#fax").val(),
                cemail = $("#email").val();
            cport = cp,
                cadd1 = $("#address").val();
            cassign = $("#assign").val();
            ctags = $("#tags").val();
            cnumber = $("#number").val();
            cwebsite = $("#website").val();
            mname = $("#mname").val();
            var formData = new FormData();
            var totalFiles = document.getElementById("attachment").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                formData.append("FileUpload", file);
            }
            formData.append("lname", lname);
            formData.append("fname", fname);
            formData.append("homeno", homeno);
            formData.append("mobno", mobno);
            formData.append("offno", offno);
            formData.append("fax", fax);
            formData.append("cemail", cemail);
            formData.append("cport", cport);
            formData.append("cadd1", cadd1);
            formData.append("cassign", cassign);
            formData.append("ctags", ctags);
            formData.append("cnumber", cnumber);
            formData.append("cwebsite", cwebsite);
            formData.append("mname", mname);
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
            $.ajax(
                {
                    type: "POST",
                    url: "/api/demo/PostSaveContact", // Controller/View
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
                        $("#savecontact")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: ' Contact Added Successfully',
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
});