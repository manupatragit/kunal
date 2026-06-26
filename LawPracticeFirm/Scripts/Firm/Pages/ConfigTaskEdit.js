$(document).ready(function () {
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

    /*Load matter by contact change*/
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

    /*Load matter by client id*/
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
    var tempdata = localStorage.getItem("temptaskid");
    if (tempdata != "") {
        id = localStorage.getItem("temptaskid");
    }
    setTimeout(function () {
        var formData = new FormData();
        formData.append("Id", id);
        $.ajax({
            async: true,
            url: '/api/CallApi/SingleTask',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var aassign = "";
                    $.each(obj, function (i, val) {
                        $("#subject1").val(val.tsubject);
                        var dat = val.duedate;
                        var dates1 = dat.substring(0, 10);
                        $("#dt1").val(dates1);
                        var option1 = '<option value="' + val.tmatter + '" selected > ' + val.mattername + '</option>';
                        $("#matter1").append(option1);
                        $('#status1 option[value="' + val.tstatus + '"]').attr("selected", true);
                        var option3 = '<option value="' + val.trepeat + '" selected > ' + val.trepeat + '</option>';
                        $("#repeat1").append(option3);
                        var option4 = '<option value="' + val.tpriority + '" selected > ' + val.tpriority + ' </option>';
                        $("#priority1").append(option4);
                        var option5 = '<option value="' + val.tacontact + '" selected > ' + val.afname + ' ' + val.amname + ' ' + val.alname + ' </option>';
                        $("#acontact1").append(option5);
                        $('#user1 option[value="' + val.tauser + '"]').attr("selected", true);
                        CKEDITOR.instances['details1'].setData(val.tdetails);
                        $("#tags1").val(val.ttags);
                        if (val.teassign == "1") {
                            $("#assign1").prop("checked", true);
                        }
                        else {
                            $("#assign1").prop("checked", false);
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
    }, 1500);

    //save data
    $('form[id="savetaskform"]').validate({
        submitHandler: function (form) {
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
            var auser = $('#user1').val();
            if (auser == null) {
                alert("Please select assigned user");
                return false;
            }
            var acontact = $('#acontact1').val();
            var status = $('#status1').val();
            var dt = $('#dt1').val();
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
            formData.append("contact", contact);
            formData.append("matter", matter);
            formData.append("subject", subject);
            formData.append("status", status);
            formData.append("dt", dt);
            formData.append("user", auser);
            formData.append("details", details);
            formData.append("acontact", acontact);
            formData.append("priority", priority);
            formData.append("tags", tags);
            formData.append("assign", cp);
            formData.append("repeat", repeat);
            formData.append("ID", id);
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/PostUpdateTask", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    //},
                    success: function (data) {
                        closeload();
                        new PNotify({
                            title: 'Success!',
                            text: ' Task Updated Successfully',
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
});