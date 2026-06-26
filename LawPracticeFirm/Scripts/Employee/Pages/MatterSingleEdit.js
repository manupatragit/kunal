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
    var fcode = localStorage.getItem("FirmCode");
    $("#attachment").change(function () {
        var tempsize1 = 0;
        var totalFiles1 = document.getElementById("attachment").files.length;
        for (var i = 0; i < totalFiles1; i++) {
            var file1 = document.getElementById("attachment").files[i];
            var filename1 = file1.name;
            if (filename1.length > 35) {
                alert("File name should not be more than 35 character. Please check file name: " + filename1);
                $("#attachment").val("");
                return false;
            }
            checkfileext(filename1);
            try {
                if (typeof (file1) != "undefined") {
                    size1 = parseFloat(file1.size / 1024).toFixed(2);
                    tempsize1 = parseFloat(size1);
                }
            }
            catch (err) {
                //alert(err.message);
            }
            tempsize1 = tempsize1.toFixed(2);
            if (tempsize1 > filesize) {
                $("#attachment").val("");
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
    });
    var d1, d2, d3;
    openload();
    bindcasesubject();
    FillCourtType();
    /*Bind subject details*/
    function bindcasesubject() {
        $("#casesubject").find('option')
            .remove()
            .end()
            .append('<option value="">Select</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        var d0 = $.ajax({
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
        $.when(d0).then(function (data, textStatus, jqXHR) {
            loadfield();
        });
    }
    $(document).on("click", "#alink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "edit";
        var url = "/firm/multiplefilelist/?ftype=case&data=" + fileid + "&mode=" + mode;
        $('.mymodels1').load(url, function (result) {
            closeload();
            $('#myModal1').modal({ show: true });
        });
    });
    $('#clientname').on('click', function () {
        $("#clientid").val("");
        $("#lduser").val("");
        $("#npassword").val("");
        $("#cpassword").val("");
        $('.hspass').hide();
    });
    /*    //loadclientlist*/
    loadclientlist();
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
    /*Load CF*/
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
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(d2).then(function (data, textStatus, jqXHR) {
            loadfm();
        });
    }
    var checkassignuser = "";
    /*Load fm*/
    function loadfm() {
        var ctr = 0;
        var formData = new FormData();
        formData.append("mid", id);
        d3 = $.ajax({
            async: true,
            url: '/api/CallApi/SingleMatterDetails',
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
                        checkassignuser = b.assignuser;
                        try {
                            if (b.CWId == "0") {
                                $("#cwbtn").css("display", "unset");
                            }
                            else {
                                $("#cwbtn").css("display", "none");
                            }
                            if (b.matterclientid == null || b.matterclientid == "") {
                                $("#clientnamediv").css("display", "block");
                                $("#assigngroup").css("display", "block");
                            }
                            else {
                                $("#clientnamediv").css("display", "none");
                                $("#assigngroup").css("display", "none");
                                var option234 = '<option value="' + b.matterclientid + '" selected > ' + b.ClientName + ' </option>';
                                $("#clientname").append(option234);
                            }
                            if (b.assignto == null) {
                                option1 = '<option value="" selected >Select</option>';
                            }
                            var option = '<option value="' + b.cid + '" selected > ' + b.fname + ' ' + b.mdname + ' ' + b.lname + ' </option>';
                            $("#mcontact").append(option);
                            if (b.assignto == null) {
                                option1 = '<option value="" selected >Select</option>';
                            }
                            else {
                                option1 = '<option value="' + b.assignid + '" selected > ' + b.assignuser + ' </option>';
                            }
                            $("#assignto").append(option1);
                            var option2 = '<option value="' + b.orgaty + '" selected > ' + b.orgaty + ' </option>';
                            $("#orgaty").append(option2);
                            if (b.cstatus != null) {
                                $('#cstatus option[value="' + b.cstatus + '"]').attr("selected", true);
                            }
                            if (b.CaseSubjectId != null) {
                                $('#casesubject option[value="' + b.CaseSubjectId + '"]').attr("selected", true);
                            }
                            $("#mname1").val(b.mname);
                            $("#tags").val(b.tags);
                            $("#mtrno").val(b.mtrno);
                            $("#cnrnumber1").val(b.cnrno);
                            if (b.cfile == null) {
                                $("#alink").css("display", "none");
                            }
                            else {
                                $("#alink").attr("id-val", id);
                                $("#alink").attr("href", "#");
                                $("#alink").attr("data-val", b.cfile);
                            }
                            CKEDITOR.instances['mnotes4'].setData(b.mnotes);
                            var dat4 = b.msol;
                            if (dat4 != null) {
                                var msol = dat4.substring(0, 10);
                                $("#sol").val(msol);
                            }
                            var dat2 = b.odate;
                            var odate = dat2.substring(0, 10);
                            $("#odate").val(odate);
                            var dat3 = b.cdate;
                            var cdate = dat3.substring(0, 10);
                            $("#cdate").val(cdate);
                        }
                        catch (err) {
                            // alert(err.message);
                        }
                        for (lp = 1; lp <= 15; lp = lp + 1) {
                            $('#demotext' + lp).is(function () {
                                ftype = this.tagName != 'INPUT' ? this.tagName.toLocaleLowerCase() : this.type.toLowerCase();
                                //    alert(lp);
                                if (ftype == "text") {
                                    if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                        $("#demotext" + lp).val(b.col1);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                        $("#demotext" + lp).val(b.col2);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                        // alert(b.col3);
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
                                        // alert(b.col3);
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
                                        // alert(b.col3);
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
                                //alert(ftype);
                                if (ftype == "datetime-local") {
                                    //alert("hi");
                                    if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                        $("#demotext" + lp).val(b.col1);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                        $("#demotext" + lp).val(b.col2);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                        //alert(b.col3);
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
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                        date12 = b.col2;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                        date12 = b.col3;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                        date12 = b.col4;
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                        date12 = b.col5;
                                        // alert(date12)
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                        date12 = b.col6;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                        date12 = b.col7;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                        date12 = b.col8;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                        date12 = b.col9;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                        date12 = b.col10;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                        date12 = b.col11;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                        date12 = b.col12;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                        date12 = b.col13;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                        date12 = b.col14;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                        date12 = b.col15;
                                        dateval12 = date12.substring(0, 10);
                                        $("#demotext" + lp).val(date12);
                                    }
                                }
                                if (ftype == "checkbox") {
                                    if ($("#demotext" + lp).attr("tempvalue" + lp) == "col8") {
                                        var strarray = b.col8.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col1") {
                                        var strarray = b.col1.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                        var strarray = b.col2.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col3") {
                                        var strarray = b.col3.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col4") {
                                        var strarray = b.col4.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col5") {
                                        var strarray = b.col5.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col6") {
                                        var strarray = b.col6.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col7") {
                                        var strarray = b.col7.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col9") {
                                        var strarray = b.col9.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col10") {
                                        var strarray = b.col10.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col11") {
                                        var strarray = b.col11.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col12") {
                                        var strarray = b.col12.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col13") {
                                        var strarray = b.col13.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col14") {
                                        var strarray = b.col14.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col15") {
                                        var strarray = b.col15.split(',');
                                        $(".demotext" + lp + "").each(function () {
                                            var chkbx = $(this).val();
                                            var tempname = $(this).attr("name");
                                            for (var i = 0; i < strarray.length; i++) {
                                                if (strarray[i] == chkbx) {
                                                    $("INPUT[name=" + tempname + "][value=" + strarray[i] + "]").prop('checked', true);
                                                }
                                            }
                                        });
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
                                            option5 = '<option value="' + b.col1 + '" selected > ' + b.col1 + ' </option>';
                                            $("#demotext" + lp).append(option5);
                                        }
                                    }
                                    else if ($("#demotext" + lp).attr("tempvalue" + lp) == "col2") {
                                        if (String(b.col2) == "") {
                                        }
                                        else if (String(b.col2) != null) {
                                            option5 = '<option value="' + b.col2 + '" selected > ' + b.col2 + ' </option>';
                                            $("#demotext" + lp).append(option5);
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
                    });
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        closeload();
    }
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    //  alert(newURL);
    var pagetype = type
    if (pagetype == "8") {
        $("#showcontent").css("display", "block");
    }
    else {
        $("#showcontent").css("display", "block");
    }
    /* //load field count*/
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
    //publish page
    var removeicon = 0;
    var sum = 0;
    function loadfield() {
        removeicon = localStorage.getItem("fcount");
        if (removeicon == 0) {
            $(".glyphicon-trash").css("display", "none");
        }
        else {
            $(".glyphicon-trash").show();
        }
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
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8 input-groups"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="email"  value="" id="demotext' + sum + '" ' + requireds + ' name="demoemaail"></div></div>';
                        $("#content").append(textBox);
                        //  alert(sum);
                    }
                    // name
                    if (field["FieldType"] == "15") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '" ' + requireds + ' name="demoname"></div></div>';
                        $("#content").append(textBox);
                        //alert(sum);
                    }
                    // textbox
                    if (field["FieldType"] == "6") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" id="demotext' + sum + '"  value="" ' + requireds + ' name="demotext" ></div></div>';
                        $("#content").append(textBox);
                        // alert(sum);
                    }
                    //date
                    if (field["FieldType"] == " 22") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="date" value="" id="demotext' + sum + '" ' + requireds + ' name="demodate"  "></div></div>';
                        $("#content").append(textBox);
                    }
                    //datetime
                    if (field["FieldType"] == " 3") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"   ' + requireds + ' name="demodt" "></div></div>';
                        $("#content").append(textBox);
                        $('#demotext' + sum).datetimepicker({
                            // dateFormat: 'dd-mm-yy',
                            format: 'Y-m-d h:s'
                        });
                    }
                    //no
                    if (field["FieldType"] == " 5") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><input class="form-control" placeholder="' + field["FieldName"] + '" type="number" value="" id="demotext' + sum + '" pattern="[0-9]+"  ' + requireds + ' name="demono" ></div></div>';
                        $("#content").append(textBox);
                    }
                    //mobile
                    if (field["FieldType"] == " 8") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"   ' + requireds + ' name="demomobile"  maxlength="10" minlength="10" onkeypress="return restrictAlphabets(event)" ></div></div>';
                        $("#content").append(textBox);
                    }
                    //landline phone
                    if (field["FieldType"] == " 9") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demolandline"  maxlength="15" minlength="' + field["MinLength"] + '"></div></div>';
                        $("#content").append(textBox);
                    }
                    //zipcode
                    if (field["FieldType"] == " 10") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" value="" id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demozip"  maxlength="6" onkeypress="return restrictAlphabets(event)" ></div></div>';
                        $("#content").append(textBox);
                    }
                    //address
                    if (field["FieldType"] == " 7") {
                        sum = sum + 1;
                        var textBox = '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><input class="form-control"  placeholder="' + field["FieldName"] + '" type="text" value=""  id="demotext' + sum + '"  format="' + field["Format"] + '"  ' + requireds + ' name="demoaddress"  minlength="' + field["MinLength"] + '"></div></div>';
                        $("#content").append(textBox);
                    }
                    //dropdown
                    if (field["FieldType"] == " 4") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select id="demotext' + sum + '" placeholder="' + field["FieldName"] + '" class="form-control "  ' + requireds + ' name="demodropdown">';
                        var selectvalues = field['FieldValues'];
                        // $("#content").append(textBox);
                        var ftd = field['Id'];
                        html += '<option value="">Select</option>';
                        $.each(selectvalues.split(','), function (key, value) {
                            html += '<option value="' + value + '">' + (value == '-1' ? 'select' : value) + '</option>';
                            //alert(html1);
                        });
                        //alert(ftd);
                        html += '</select>';
                        $("#content").append(html + '');
                    }
                    //gender
                    if (field["FieldType"] == " 11") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            html += '<label class="radio-inline"><input type = "radio" class="gender" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > ' + value1 + '</label>';
                        });
                        $("#content").append(html + '');
                    }
                    //yes/no
                    if (field["FieldType"] == " 16") {
                        sum = sum + 1;
                        sumyn = sumyn + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8" id="gender' + field['Id'] + '"> ';
                        var selectvalues1 = field['FieldValues'];
                        $.each(selectvalues1.split(','), function (key, value1) {
                            if (key == "0") {
                                html += '<label class="radio-inline"><input type = "radio" class="gender" checked  placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > ' + value1 + '</label>';
                            }
                            else {
                                html += '<label class="radio-inline"><input type = "radio" class="gender"   placeholder="' + field["FieldName"] + '" value="' + value1 + '" name = "gender"  ' + requireds + ' id="demotext' + sum + '"  > ' + value1 + '</label>';
                            }
                        });
                        $("#content").append(html + '');
                    }
                    //checkboxlist
                    if (field["FieldType"] == " 1") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8" id="checkbox">';
                        var selectvalues1 = field['FieldValues'];
                        // alert(selectvalues1);
                        $.each(selectvalues1.split(','), function (key, value) {
                            html += '<p class="checkbox-inline zyx"><span>' + value + '</span> <input class="demotext' + sum + ' clist"  myclass="clist" type = "checkbox" placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" name="checkbox' + field['Id'] + '" value="' + value + '" ' + requireds + '  ></p >';
                        });
                        $("#content").append(html + '');
                    }
                    //client
                    if (field["FieldType"] == "13") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control " ' + requireds + ' name="democlient"><option value="" >Select</option>';
                        html += '</select>';
                        $("#content").append(html + '');
                    }
                    //case
                    if (field["FieldType"] == "17") {
                        sum = sum + 1;
                        //alert("g");
                        loadcase();
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control case' + field['Id'] + ' " ' + requireds + ' name="democase"> <option value="" >Select</option>';
                        html += '</select>';
                        $("#content").append(html + '');
                    }
                    //User
                    if (field["FieldType"] == "12") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + ' <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span> </label ><div class="col-md-8"><select  placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control " ' + requireds + ' name="demouser"><option value="" >Select</option>';
                        html += '</select>';
                        $("#content").append(html + '');
                    }
                    //team
                    if (field["FieldType"] == "18") {
                        sum = sum + 1;
                        html += '<div class="form-group"><label class="control-label col-md-4" >' + field['FieldName'] + '  <span class="required  rqd' + field['Id'] + '"   aria-required="true">*</span></label ><div class="col-md-8"><select placeholder="' + field["FieldName"] + '" id="demotext' + sum + '" class="form-control " ' + requireds + ' name="demoteam"><option value="" >Select</option>';
                        html += '</select>';
                        $("#content").append(html + '');
                    }
                    var reqrd = field.IsRequired;
                    var reqrdid = field.Id;
                    if (String(reqrd) == "true") {
                        $(".rqd" + reqrdid).css("display", "unset");
                        //  alert(removeicon);
                    }
                    else {
                        $(".rqd" + reqrdid).css("display", "none");
                        //alert("");
                    }
                }); //End of foreach Loop
                //console.log(response);//End of foreach Loop
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
    $('form[id="savematterform"]').validate({
        submitHandler: function (form) {
            var password = $("#npassword").val();
            var confirmPassword = $("#cpassword").val();
            cpassword = $("#cpassword").val();
            leadid = $("#leadid").val();
            clientname = $("#clientname").val();
            if ((leadid == "" && clientname == "") || (leadid == "" && clientname == null)) {
                new PNotify({
                    title: 'Warning!',
                    text: 'Please select Prospect or ' + clientlable + '! ',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
            if (leadid != "" && clientname == "") {
                if (password != confirmPassword) {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Password did not match!',
                        type: 'error',
                        delay: 3000
                    });
                    return false;
                }
            }
            if (password != confirmPassword) {
                new PNotify({
                    title: 'Warning!',
                    text: 'Password did not match!',
                    type: 'error',
                    delay: 3000
                });
            }
            else {
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
                    //alert(x4);
                    var inputType = $('#demotext1').attr('type');
                    // alert(inputType);
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
                    // alert(c14);
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
                            // alert(selected1);
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
                            // alert(selected2);
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
                            // alert(selected3);
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
                            // alert(selected4);
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
                        $(".demotext15:checked").each(function () {
                            chkArray15.push($(this).val());
                        });
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
                var cp = '';
                if ($("#cport:checked").prop('checked')) {
                    cp = $("#cport:checked").val();
                }
                else {
                    cp = "0";
                }
                mname = $("#mname1").val();
                cid = $("#mcontact").val();
                mnotes = CKEDITOR.instances.mnotes4.getData();
                msol = $("#sol").val();
                cnrno = $("#cnrnumber1").val();
                odate = $("#odate").val();
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
                cdate = $("#cdate").val();
                assignto = $("#assignto").val();
                orgaty = $("#orgaty").val();
                tags = $("#tags").val();
                cstatus = $("#cstatus").val();
                mtrno = $("#mtrno").val();
                var auser = $('#assignto').val();
                if (odate != "" && cdate != "") {
                    var date1 = new Date(odate);
                    var date2 = new Date(cdate);
                    if (date1 > date2) {
                        alert("Close date should not be less than Open date");
                        return false;
                    }
                }
                if (checkassignuser == "") {
                    if (auser == "" || auser == null) {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please Select Assign to users',
                            type: 'error',
                            delay: 3000
                        });
                        return false;
                    }
                }
                if (document.getElementById('divSCHCDistrict').value == '1') {
                    document.getElementById('drpcourtname').value = "SC";
                }
                if (document.getElementById('divSCHCDistrict').value == '1' || document.getElementById('divSCHCDistrict').value == '2' || document.getElementById('divSCHCDistrict').value == '4') {
                    document.getElementById('drpbench').style.border = "unset";
                    document.getElementById('drpside').style.border = "unset";
                    document.getElementById('divTNBench').style.border = "unset";
                    document.getElementById('divJKBench').style.border = "unset";
                    document.getElementById('divRHBench').style.border = "unset";
                    document.getElementById('divBHBench').style.border = "unset";
                    document.getElementById('divMPBench').style.border = "unset";
                    document.getElementById('divUPBench').style.border = "unset";
                    document.getElementById('divGHBench').style.border = "unset";
                    document.getElementById('drpNCBench').style.border = "unset";
                    document.getElementById('drptype').style.border = "unset";
                    document.getElementById('txtno').style.border = "unset";
                    document.getElementById('txtDiaryNo').style.border = "unset";
                    document.getElementById('txtno').style.border = "unset";
                    document.getElementById('drpYear').style.border = "unset";
                    document.getElementById('drpcourtnameDC').style.border = "unset";
                    document.getElementById('drpcourtcomplexestb').style.border = "unset";
                    document.getElementById('drpcompestbcourt').style.border = "unset";
                    document.getElementById('drptype').style.border = "unset";
                    document.getElementById('txtno').style.border = "unset";
                    document.getElementById('drpYear').style.border = "unset";
                    if (document.getElementById('drpcourtname').value != "0") {
                        if (document.getElementById('drpcourtname').value == "MH") {
                            if (document.getElementById('drpGoa').value != "Goa") {
                                if (document.getElementById('drpbench').value == "Select Bench" || document.getElementById('drpbench').value == "" || document.getElementById('drpbench').value == "0") {
                                    alert("please select bench");
                                    document.getElementById('drpbench').focus();
                                    document.getElementById('drpbench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                                if (document.getElementById('drpside').value == "" || document.getElementById('drpside').value == "Select Side" || document.getElementById('drpside').value == "0") {
                                    alert("please select side");
                                    document.getElementById('drpside').focus();
                                    document.getElementById('drpside').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "TN") {
                            if (document.getElementById('divTNBench').value == "") {
                                if (document.getElementById('divTNBench').value == "Select Bench" || document.getElementById('divTNBench').value == "" || document.getElementById('divTNBench').value == "0") {
                                    alert("please select bench");
                                    document.getElementById('divTNBench').focus();
                                    document.getElementById('divTNBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "JK") {
                            if (document.getElementById('divJKBench').value == "Select Bench" || document.getElementById('divJKBench').value == "") {
                                alert("please select bench");
                                document.getElementById('divJKBench').focus();
                                document.getElementById('divJKBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "RH") {
                            if (document.getElementById('divRHBench').value == "") {
                                if (document.getElementById('divRHBench').value == "Select Bench" || document.getElementById('divRHBench').value == "") {
                                    alert("please select bench");
                                    document.getElementById('divRHBench').focus();
                                    document.getElementById('divRHBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "BH") {
                            if (document.getElementById('divBHBench').value == "") {
                                if (document.getElementById('divBHBench').value == "Select Bench" || document.getElementById('divBHBench').value == "" || document.getElementById('divBHBench').value == "0") {
                                    alert("please select type");
                                    document.getElementById('divBHBench').focus();
                                    document.getElementById('divBHBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "MP") {
                            if (document.getElementById('divMPBench').value == "") {
                                if (document.getElementById('divMPBench').value == "Select Bench" || document.getElementById('divMPBench').value == "" || document.getElementById('divMPBench').value == "0") {
                                    alert("please select type");
                                    document.getElementById('divMPBench').focus();
                                    document.getElementById('divMPBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "UP") {
                            if (document.getElementById('divUPBench').value == "") {
                                if (document.getElementById('divUPBench').value == "Select Bench" || document.getElementById('divUPBench').value == "") {
                                    alert("please select bench");
                                    document.getElementById('divUPBench').focus();
                                    document.getElementById('divUPBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "GH") {
                            if (document.getElementById('divGHBench').value == "") {
                                if (document.getElementById('divGHBench').value == "Select Bench" || document.getElementById('divGHBench').value == "") {
                                    alert("please select bench");
                                    document.getElementById('divGHBench').focus();
                                    document.getElementById('divGHBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value != "") {
                            if (document.getElementById('drpcourtname').value == "NC" || document.getElementById('drpcourtname').value == "NL" || document.getElementById('drpcourtname').value == "DT" || document.getElementById('drpcourtname').value == "CF") {
                                if (document.getElementById('drpNCBench').value == "Select Bench" || document.getElementById('drpNCBench').value == "0") {
                                    alert("please select bench");
                                    document.getElementById('drpNCBench').focus();
                                    document.getElementById('drpNCBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                                if (document.getElementById('drpNCBench').value == "C" || document.getElementById('drpNCBench').value == "E") {
                                    if (document.getElementById('drpncdrcstate').value == "0") {
                                        alert("please Select the state.");
                                        document.getElementById('drpncdrcstate').focus();
                                        document.getElementById('drpncdrcstate').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                    if (document.getElementById('drpNCBench').value == "E") {
                                        if (document.getElementById('drpncdrcDistrict').value == "0") {
                                            alert("please select district forum");
                                            document.getElementById('drpncdrcDistrict').focus();
                                            document.getElementById('drpncdrcDistrict').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                    }
                                }
                            }
                            if (document.getElementById('drpcourtname').value == "IT" || document.getElementById('drpcourtname').value == "CE") {
                                if (document.getElementById('drpNCBench').value == "Select Bench" || document.getElementById('drpNCBench').value == "0") {
                                    alert("please select bench");
                                    document.getElementById('drpNCBench').focus();
                                    document.getElementById('drpNCBench').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                            if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL" || document.getElementById('drpcourtname').value == "DT") {
                                if (document.getElementById('drpcourtname').value != "SC") {
                                    if (document.getElementById('drptype').value == "Select Case Type" || document.getElementById('drptype').value == "0") {
                                        alert("please select case type");
                                        document.getElementById('drptype').focus();
                                        document.getElementById('drptype').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                }
                                else {
                                    if (document.getElementById('divSCDECD').value == "0") {
                                        if (document.getElementById('drptype').value == "Select Case Type" || document.getElementById('drptype').value == "0") {
                                            alert("please select case type");
                                            document.getElementById('drptype').focus();
                                            document.getElementById('drptype').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                        if (document.getElementById('txtno').value == "") {
                                            alert("please enter case no.");
                                            document.getElementById('txtno').focus();
                                            document.getElementById('txtno').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                        if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                                            if (document.getElementById('txtno').value != "") {
                                                if (/\//.test(document.getElementById('txtno').value)) {
                                                    alert("/ not allowed in caseno");
                                                    document.getElementById('txtno').focus();
                                                    document.getElementById('txtno').style.border = "1px solid red";
                                                    $('#casewatchmodel').modal('show');
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if (document.getElementById('txtDiaryNo').value == "") {
                                            alert("please enter diary no.");
                                            document.getElementById('txtDiaryNo').focus();
                                            document.getElementById('txtDiaryNo').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                    }
                                }
                            }
                            if (document.getElementById('drpcourtname').value != "SC") {
                                if (document.getElementById('txtno').value == "") {
                                    alert("please enter case no.");
                                    document.getElementById('txtno').focus();
                                    document.getElementById('txtno').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                                if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                                    if (document.getElementById('txtno').value != "") {
                                        if (/\//.test(document.getElementById('txtno').value)) {
                                            alert("/ not allowed in caseno");
                                            document.getElementById('txtno').focus();
                                            document.getElementById('txtno').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                    }
                                }
                            }
                            if (document.getElementById('drpYear').value == "" || document.getElementById('drpYear').value == "0") {
                                alert("please select case year");
                                document.getElementById('drpYear').focus();
                                document.getElementById('drpYear').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                }
                else if (document.getElementById('divSCHCDistrict').value == '3') {
                    document.getElementById('drpbench').style.border = "unset";
                    document.getElementById('drpside').style.border = "unset";
                    document.getElementById('divTNBench').style.border = "unset";
                    document.getElementById('divJKBench').style.border = "unset";
                    document.getElementById('divRHBench').style.border = "unset";
                    document.getElementById('divBHBench').style.border = "unset";
                    document.getElementById('divMPBench').style.border = "unset";
                    document.getElementById('divUPBench').style.border = "unset";
                    document.getElementById('divGHBench').style.border = "unset";
                    document.getElementById('drpNCBench').style.border = "unset";
                    document.getElementById('drptype').style.border = "unset";
                    document.getElementById('txtDiaryNo').style.border = "unset";
                    document.getElementById('txtno').style.border = "unset";
                    document.getElementById('drpYear').style.border = "unset";
                    document.getElementById('drpcourtnameDC').style.border = "unset";
                    document.getElementById('drpcourtcomplexestb').style.border = "unset";
                    document.getElementById('drpcompestbcourt').style.border = "unset";
                    document.getElementById('drptype').style.border = "unset";
                    document.getElementById('txtno').style.border = "unset";
                    document.getElementById('drpYear').style.border = "unset";
                    if (document.getElementById('drpcourtnameDC').value == "") {
                        alert("please Select the state.");
                        document.getElementById('drpcourtnameDC').focus();
                        document.getElementById('drpcourtnameDC').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('drpdistrictcourtname').value == "0") {
                        alert("please select district");
                        document.getElementById('drpdistrictcourtname').focus();
                        document.getElementById('drpdistrictcourtname').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('drpcourtcomplexestb').value == "") {
                        alert("please select court complex / court establishment");
                        document.getElementById('drpcourtcomplexestb').focus();
                        document.getElementById('drpcourtcomplexestb').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('drpcompestbcourt').value == "") {
                        alert("please select district court");
                        document.getElementById('drpcompestbcourt').focus();
                        document.getElementById('drpcompestbcourt').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('drptype').value == "") {
                        alert("please select case type");
                        document.getElementById('drptype').focus();
                        document.getElementById('drptype').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('txtno').value == "") {
                        alert("please enter case no.");
                        document.getElementById('txtno').focus();
                        document.getElementById('txtno').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                        if (document.getElementById('txtno').value != "") {
                            if (/\//.test(document.getElementById('txtno').value)) {
                                alert("/ not allowed in caseno");
                                document.getElementById('txtno').focus();
                                document.getElementById('txtno').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpYear').value == "0") {
                        alert("please select case year");
                        document.getElementById('drpYear').focus();
                        document.getElementById('drpYear').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                }
                else {
                }
                var formData = new FormData();
                var tempsize = 0;
                var totalFiles = document.getElementById("attachment").files.length;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("attachment").files[i];
                    var filename = file.name;
                    if (filename.length > 100) {
                        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                        return false;
                    }
                    checkfileext(filename);
                    formData.append("FileUpload", file);
                    try {
                        if (typeof (file) != "undefined") {
                            size = parseFloat(file.size / 1024).toFixed(2);
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
                //formData.append("cno", 4);
                casesubject = $("#casesubject").val();
                if (casesubject == "") {
                    alert("Please select case subject");
                    return false;
                }
                formData.append("mname", mname);
                formData.append("cid", cid);
                formData.append("mnotes", mnotes);
                formData.append("msol", msol);
                formData.append("odate", odate);
                formData.append("cnrno", cnrno);
                formData.append("cdate", cdate);
                formData.append("assignto", assignto);
                formData.append("orgaty", orgaty);
                formData.append("tags", tags);
                formData.append("Id", id);
                formData.append("cstatus", cstatus);
                formData.append("mtrno", mtrno);
                username = $("#username").val();
                npassword = $("#npassword").val();
                cpassword = $("#cpassword").val();
                formData.append("drpcourtname", $("#drpcourtname").val());
                formData.append("txtno", $("#txtno").val());
                formData.append("drptype", $("#drptype").val());
                formData.append("drpYear", $("#drpYear").val());
                formData.append("txtFileNo", '');
                formData.append("drpKAbench", $("#drpKAbench").val());
                formData.append("drpGoa", $("#drpGoa").val());
                formData.append("drpbench", $("#drpbench").val());
                formData.append("drpside", $("#drpside").val());
                formData.append("drpstampregister", $("#drpstampregister").val());
                formData.append("drpNCBench", $("#drpNCBench").val());
                formData.append("divTNBench", $("#divTNBench").val());
                formData.append("divRHBench", $("#divRHBench").val());
                formData.append("divJKBench", $("#divJKBench").val());
                formData.append("divBHBench", $("#divBHBench").val());
                formData.append("divMPBench", $("#divMPBench").val());
                formData.append("divUPBench", $("#divUPBench").val());
                formData.append("divGHBench", $("#divJKBench").val());
                formData.append("casedetails", $("#casedetails").val());
                formData.append("txtDiaryNo", $("#txtDiaryNo").val());
                formData.append("divSCHCDistrict", $("#divSCHCDistrict").val());
                formData.append("drpcourtnameDC", $("#drpcourtnameDC").val());
                formData.append("drpdistrictcourtname", $("#drpdistrictcourtname").val());
                formData.append("drpcourtcomplexestb", $("#drpcourtcomplexestb").val());
                formData.append("drpcompestbcourt", $("#drpcompestbcourt").val());
                formData.append("drpncdrcstate", $("#drpncdrcstate").val());
                formData.append("drpncdrcDistrict", $("#drpncdrcDistrict").val());
                var ditrictidname = "";
                try {
                    ditrictidname = $("#drpdistrictcourtname option:selected").text();
                    formData.append("drpdistrictcourtfullname", ditrictidname);
                }
                catch (er) {
                    formData.append("drpdistrictcourtfullname", ditrictidname);
                }
                var drpdcourtcnr = $("#drpdcourtcnr").val();
                if (drpdcourtcnr != "") {
                    var isValid = false;
                    var regex = /^[a-zA-Z0-9]*$/;
                    isValid = regex.test(drpdcourtcnr);
                    if (isValid == false) {
                        alert("District CNR No. should be Alphanumeric Only.");
                        document.getElementById('drpdcourtcnr').focus();
                        document.getElementById('drpdcourtcnr').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (drpdcourtcnr.length < 16 || drpdcourtcnr.length < 16) {
                        alert("District CNR No. should be equal to 16 digits.");
                        document.getElementById('drpdcourtcnr').focus();
                        document.getElementById('drpdcourtcnr').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                }
                formData.append("drpdcourtcnr", drpdcourtcnr);
                formData.append("username", username);
                formData.append("npassword", npassword);
                formData.append("cpassword", cpassword);
                formData.append("leadid", leadid);
                formData.append("clientname1", clientname);
                formData.append("casesubject", casesubject);
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
                openload();
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/MatterApi/PostUpdateMatter", // Controller/View
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
                                else if (data.Data == "true") {
                                    closeload();
                                    new PNotify({
                                        title: 'Success!',
                                        text: ' Case Updated Successfully',
                                        type: 'success',
                                        delay: 3000
                                    });
                                    window.location = encodeURI("/" + fcode + "/Employee/vmatter/matter");
                                    resetcasewatch();
                                }
                                else {
                                    alert(data.Data);
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
        }
    });
    // document.getElementById("hide").click();
    function FillCourtType() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/Firm/FillCourtType",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var option = '<option value="">--Select Court--</option>';
                $.each(response, function (i, a) {
                    option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
                });
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
});
function FillCourtnamebyCourttype() {
}
function FillCasetypeDiary() {
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
/*Fill case tpe*/
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