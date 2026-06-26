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
    openload();
    loadfield();
    $("#menucontact").click(function () {
        var urls = "/" + fcode + "/Employee/ContactSingleEdit/";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": id }
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
    /*Load custom field*/
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
                        $("#demotext" + cc).attr("tempvalue" + cc, "col" + cc);
                    });
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
    /*Load FC*/
    function loadfc() {
        var formData = new FormData();
        formData.append("mid", id);
        d3 = $.ajax({
            async: true,
            url: '/api/EmployeeApi/SingleContactDetails',
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
                        $("#fname").html(b.fname + " " + b.mname + " " + b.lname);
                        $("#home").html(b.homeno);
                        $("#mob").html(b.mobno);
                        $("#cnotes").html(b.cnotes);
                        $("#office").html(b.offno);
                        $("#fax").html(b.fax);
                        $("#email").html(b.cemail);
                        $("#address").html(b.cadd1);
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
                        if (b.cphoto != null) {
                            $('#output_image').attr('src', b.cphoto);
                        }
                        else {
                            $('#output_image').attr('src', "/PanelDesign/images/Default_User_pic_new.png");
                        }
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
                    });
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        closeload();
        notisttaus();
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
    }
    //publish page
    var sum = 0;
    function loadfield() {
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8 input-groups"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></span></div></div>';
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  maxlength="' + field["MaxLength"] + '" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" maxlength="' + field["MaxLength"] + '" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class="" placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono"  maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span  style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        //alert("g");
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        loadcase();
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span  style="font-weight:normal"class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
                        $("#content").append(textBox);
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  </label ><div class="col-md-8"><span style="font-weight:normal" class=""  placeholder="' + field["FieldName"] + '" type="label" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></span></div></div>';
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
});