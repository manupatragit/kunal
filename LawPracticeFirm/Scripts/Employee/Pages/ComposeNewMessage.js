$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    $("#contact").change(function () {
        $('#matter').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
        }
        else {
            $('#matter').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        }
    });
    //loadmatter();
    loadcontact1();
    /*Load contact*/
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
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a.LoginId + '" >' + a.Username + ' (' + a.cfname + ') </option> ';
                    $("#contact").append(option);
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
    /*Load matter*/
    function loadmatter(clientid) {
        $('#matter').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
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
                $.each(JSON.parse(response.Data), function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#matter").append(option);
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
    /*Save compose message form data*/
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
            var matter = $('#matter').val();
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
                        $("#loadmessagepage").load("/Employee/ComposeNewMessage");
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
    /*Save compose draft details*/
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
        var matter = $('#matter').val();
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
                    $('#matter option[value=""]').attr("selected", true);
                    new PNotify({
                        title: 'Success!',
                        text: 'Message saved in draft successfully',
                        type: 'success',
                        delay: 3000
                    });
                    window.location = encodeURI("/" + fcode + "/employee/ComposeMessage");
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
