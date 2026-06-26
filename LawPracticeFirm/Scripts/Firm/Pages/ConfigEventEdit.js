$(document).ready(function () {
    var tempdata = localStorage.getItem("tempeventid");
    if (tempdata != "") {
        id = localStorage.getItem("tempeventid");
    }
    var formData = new FormData();
    formData.append("Id", id);
    $.ajax({
        async: true,
        url: '/api/CallApi/SingleEvent',
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                var ad = "";
                $.each(obj, function (i, val) {
                    $("#location1").val(val.elocation);
                    CKEDITOR.instances['details1'].setData(val.tdetails);
                    $("#tags1").val(val.ttags);
                    $("#color1").val(val.ecolor);
                    var option1 = '<option value="' + val.tmatter + '" selected > ' + val.mattername + '</option>';
                    $("#matter1").append(option1);
                    var option3 = '<option value="' + val.trepeat + '" selected > ' + val.trepeat + '</option>';
                    $("#repeat1").append(option3);
                    var option4 = '<option value="' + val.tpriority + '" selected > ' + val.tpriority + ' </option>';
                    $("#priority1").append(option4);
                    var option5 = '<option value="' + val.tacontact + '" selected > ' + val.afname + ' ' + val.amname + ' ' + val.alname + ' </option>';
                    $("#acontact").append(option5);
                    $('#auser option[value="' + val.tauser + '"]').attr("selected", true);
                    $('#status1 option[value="' + val.tstatus + '"]').attr("selected", true);
                    if (val.eallday == "1") {
                        $("#allday1").prop("checked", true);
                        $("#st1").hide();
                        $("#et1").hide();
                    }
                    else {
                        $("#allday1").prop("checked", false);
                        $("#st1").show();
                        $("#et1").show();
                    }
                    if (val.teassign == "1") {
                        $("#assign1").prop("checked", true);
                    }
                    else {
                        $("#assign1").prop("checked", false);
                    }
                    $("#subject1").val(val.tsubject);
                    $("#attachment1").val(val.tfile);
                    var dat1 = val.sdate;
                    var time1 = val.stime;
                    var dates1 = dat1.substring(0, 10);
                    var dat2 = val.edate;
                    var time2 = val.etime;
                    var dates2 = dat2.substring(0, 10);
                    if (time1 != null) {
                        newd1 = dates1 + " " + time1;
                    }
                    else {
                        newd1 = dates1;
                    }
                    if (time2 != null) {
                        newd2 = dates2 + " " + time2;
                    }
                    else {
                        newd2 = dates2;
                    }
                    $("#sd1").val(dates1);
                    if (val.stime != null) {
                        $("#st1").val(val.stime.substring(0, 5));
                    }
                    if (val.etime != null) {
                        $("#et1").val(val.etime.substring(0, 5));
                    }
                    $("#ed1").val(dates2);
                });
            }
            else {
                // alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
    // load contact
    loadcontact1();

    // load contact
    function loadcontact1() {
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
                    //  alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option11 = '<option value="' + a.LoginId + '" >' + a.Username + ' (' + a.cfname + ') </option> ';
                    $("#contact1").append(option11);
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }

    /*Load matter on contact change*/
    $("#contact1").change(function () {
        $('#matter1').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
            return false;
        }
        else {
            $('#matter1').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
            return false;
        }
    });

    /*Get matter by client id*/
    function loadmatter(clientid) {
        $('#matter1').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/LoadMatterforclient",
            headers: {
                "clientid": clientid
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
                $.each(JSON.parse(response.Data), function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#matter1").append(option);
                    }
                });
                return false;
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
        return false;
    }
    $('#allday1').click(function () {
        if ($("#allday1:checked").prop('checked')) {
            $("#st1").hide();
            $("#et1").hide();
            $('#st1').val("");
            $('#et1').val(null);
        }
        else {
            $("#st1").show();
            $("#et1").show();
        }
    });

    //save data
    $('form[id="saveeventform"]').validate({
        submitHandler: function (form) {
            colort = $("#color1").val();
            var status = $('#status1').val();
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById("postedFile").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("postedFile").files[i];
                var filename = file.name;
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
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
            var contact = $('#contact1').val();
            var matter = $('#matter1').val();
            var subject = $('#subject1').val();
            var color = $('#color1').val();
            var acontact = $('#acontact').val();
            var auser = $('#auser').val();
            if (auser == null) {
                alert("Please select assigned user");
                return false;
            }
            var location = $('#location1').val();
            var status = $('#status1').val();
            var sd = $('#sd1').val();
            var ed = $('#ed1').val();
            var st = $('#st1').val();
            var et = $('#et1').val();
            var date1 = new Date(sd);
            var date2 = new Date(ed);
            if (date1 > date2) {
                alert("End date should not be less than Start date");
                return false;
            }
            var details = CKEDITOR.instances.details1.getData();
            var tags = $('#tags1').val();
            var priority = $('#priority1').val();
            var repeat = $('#repeat1').val();
            var cp = '';
            if ($("#assign1:checked").prop('checked')) {
                cp = $("#assign1:checked").val();
            }
            else {
                cp = "0";
            }
            var ad = '';
            if (st == "") {
                ad = 1;
            }
            else {
                ad = 0;
            }
            formData.append("contact", contact);
            formData.append("matter", matter);
            formData.append("subject", subject);
            formData.append("status", status);
            formData.append("color", color);
            formData.append("location", location);
            formData.append("sd", sd);
            formData.append("ed", ed);
            formData.append("st", st);
            formData.append("et", et);
            formData.append("details", details);
            formData.append("priority", priority);
            formData.append("tags", tags);
            formData.append("allday", ad);
            formData.append("assign", cp);
            formData.append("repeat", repeat);
            formData.append("acontact", acontact);
            formData.append("auser", auser);
            formData.append("ID", id);
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/PostUpdateEvent", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    //},
                    success: function (data) {
                        closeload();
                        new PNotify({
                            title: 'Success!',
                            text: ' Event Updated Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        localStorage.setItem("setname", "calender");
                        $('.popover').css("display", "none");
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
    });

    //add reminder
    var iCnt = 0;
    $('#addremind').click(function () {
        var html = '';
        if (iCnt <= 4) {
            iCnt = iCnt + 1;
            html += '<div class="form-group form-horizontal" id="div' + iCnt + '"><div class="col-xs-4"><select name="" class="form-control input-sm" width="40px;" id="type' + iCnt + '"> ';
            html += '<option value="PopUp">Popup</option> ';
            html += '<option value="Email">Email</option> ';
            html += '<option value="Message">Message</option></select></div>';
            html += '<div class="col-xs-3"> <input class="form-control" type="number" id="num' + iCnt + '" /></div>';
            html += '<div class="col-xs-4"><select name="" class="form-control input-sm" width="40px;" id="time' + iCnt + '">';
            html += '<option value="Days">Days</option> ';
            html += '<option value="Hours">Hours</option> ';
            html += '<option value="Minutes">Minutes</option></select> </div> ';
            html += '<span id="idss" value="' + iCnt + '" style="float:left;padding:8px 0 0 2px;" class="idss glyphicon glyphicon-trash"></span></div >';
            html += '</select>';
            $("#dataremind").append(html + '');
        }
        else {
            alert("limit completed");
        }
    });
    // REMOVE ONE ELEMENT PER CLICK.
    $(document).on("click", "#idss", function () {
        var t = $(this).attr("value");
        // alert(t);
        var result = confirm("Are you sure to   delete this field?");
        if (result) {
            //Logic to delete the item
            //alert();
            $('#div' + iCnt).remove();
            iCnt = iCnt - 1;
        }
        else {
        }
    });
});