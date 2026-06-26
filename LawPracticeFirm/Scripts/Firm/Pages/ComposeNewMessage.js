$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");

    /*Create new group*/
    $("#creategroup").click(function () {
        window.location = encodeURI("/" + fcode + "/Firm/creategroup");
    });

    /*Load matter by contact change*/
    $("#contact").change(function () {
        $('#mattercom').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
        }
        else {
            $('#mattercom').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        }
    });
    var loaduseflag = true;
    loadcontact1();

    // load contact
    function loadcontact1() {
        if (loaduseflag == true) {
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
                    $("#contact option").remove();
                    $("#contact").append("<option value='' selected>Select</option>");
                    $.each(obj, function (i, a) {
                        if (a.Username == null || a.Username == "" || a.Username == "null") {
                            var option = '<option value="' + a.LoginId + '" >' + a.fname + ' ' + (a.mname == null ? "" : a.mname) + ' ' + (a.lname == null ? "" : a.lname) + '</option>';
                            $("#contact").append(option);
                        }
                        else {
                            var option = '<option value="' + a.LoginId + '" >' + a.fname + ' ' + (a.mname == null ? "" : a.mname) + ' ' + (a.lname == null ? "" : a.lname) + ' (' + a.Username + ') </option>';
                            $("#contact").append(option);
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
            loaduseflag = false;
        }
    }

    /*Load client matter detail by client id*/
    function loadmatter(clientid) {
        $('#mattercom').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
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
                    //alert("not found");
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
                        $("#mattercom").append(option);
                    }
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


    //save data
    $('form[id="savemessageform"]').validate({
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
                var Extresponse = checkfileextmsg(filename);
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
            var subject = $('#subject').val();
            var details = CKEDITOR.instances.details.getData();
            var matter = $('#mattercom').val();
            var user = $('#select-user').val();
            if (user == null) {
                new PNotify({
                    title: 'Warning!',
                    text: 'Please Select users',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
            formData.append("subject", subject);
            formData.append("details", details);
            formData.append("matter", matter);
            formData.append("user", user);
            formData.append("token", tokenid);
            formData.append("client", $("#contact").val());
            openloader();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/PostSaveMessage", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        $("#savemessageform")[0].reset();
                        CKEDITOR.instances.details.setData("");
                        new PNotify({
                            title: 'Success!',
                            text: 'Message Sent Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#loadmessagepage").load("/firm/ComposeNewMessage");
                        closeloader();
                    }, //End of AJAX Success function
                    failure: function (data) {
                        alert(data.responseText);
                        closeloader();
                    }, //End of AJAX failure function
                    error: function (data) {
                        alert(data.responseText);
                        closeloader();
                    } //End of AJAX error function
                });
        }
    });

    //save data in draft
    $("#savedraft").click(function () {
        validnavigation = true;
        window.onbeforeunload = null;
        try {
            var formData = new FormData();
        }
        catch (err) {
            alert(er.message);
        }
        var subject = $('#subject').val();
        var details = CKEDITOR.instances.details.getData();
        var matter = $('#mattercom').val();
        var user = $('#select-user').val();
        formData.append("subject", subject);
        formData.append("details", details);
        formData.append("matter", matter);
        formData.append("user", user);
        formData.append("token", tokenid);
        openloader();
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostDraftMessage", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#savemessageform")[0].reset();
                    CKEDITOR.instances.details.setData("");
                    var control = $select[0].selectize;
                    control.clear();
                    $('#mattercom option[value=""]').attr("selected", true);
                    new PNotify({
                        title: 'Success!',
                        text: 'Message saved in draft successfully',
                        type: 'success',
                        delay: 3000
                    });
                    window.location = encodeURI("/" + fcode + "/firm/ComposeMessage");
                    closeloader();
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                    closeloader();
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                    closeloader();
                } //End of AJAX error function
            });
    });
});
