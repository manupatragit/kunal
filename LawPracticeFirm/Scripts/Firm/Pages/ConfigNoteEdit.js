$(document).ready(function () {

    /*Get note details*/
    function GetNoteData() {
        var formData = new FormData();
        formData.append("Id", id);
        $.ajax({
            async: true,
            url: '/api/CallApi/SingleNote',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var aassign = "";
                    $.each(obj, function (i, vals) {
                        $("#subject1").val(vals.nsubject);
                        $("#matter").val(vals.mattername);
                        $("#dt").val(vals.ndatetime);
                        var option1 = '<option value="' + vals.nmatter + '" selected > ' + vals.mattername + '</option>';
                        $("#matter").append(option1);
                        CKEDITOR.instances['details'].setData(vals.nnote);
                        $('#tags1').val(vals.ntags);
                        $('#status1 option[value="' + vals.tstatus + '"]').attr("selected", true);
                    });
                }
                else {
                    //   alert("not found");
                }
            },
            error: function () {
                //alert('Error!');
            }
        });
    }

    /*Load matter by contact*/
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

    /*Get matter by client id*/
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
    loadcontact1();
    GetNoteData();

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
});

//Add Note
$('form[id="savenoteform"]').validate({
    submitHandler: function (form) {
        var contact = $('#contact').val();
        var matter = $('#matter').val();
        var subject = $('#subject1').val();
        var dt = $('#dt').val();
        var status = $('#status1').val();
        var details = CKEDITOR.instances.details.getData();
        var tags = $('#tags1').val();
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
        formData.append("contact", contact);
        formData.append("matter", matter);
        formData.append("subject", subject);
        formData.append("dt", dt);
        formData.append("details", details);
        formData.append("tags", tags);
        formData.append("ID", id);
        formData.append("status", status);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostUpdateNote", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    closeload();
                    var datas = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: ' Note Update Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    localStorage.setItem("setname3", "calender");
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