var input = {
    hours: 0,
    minutes: 00,
    seconds: 00
};
var interval = 1;
var timestamp = new Date(input.hours, input.minutes, input.seconds);
var t = '';
/*Timer*/
function timesr() {
    t = window.setInterval(function () {
        timestamp = new Date(timestamp.getTime() + interval * 1000);
        // alert(isPaused);
        document.getElementById('countdown2').innerHTML = timestamp.getHours() + 'h:' + timestamp.getMinutes() + 'm:' + timestamp.getSeconds() + 's';
        document.getElementById("duration1").value = document.getElementById('countdown2').innerHTML;
    }, Math.abs(interval) * 1000);
}
///end timer
/*Close model*/
$('#closemodel').click(function () {
    clearInterval(t);
});
/*Close clear interval model*/
$('#closemodels').click(function () {
    clearInterval(t);
});
/*Assign user on load*/
$(document).ready(function () {
    assignuser();
    var formData = new FormData();
    formData.append("Id", id);
    $.ajax({
        async: true,
        url: '/api/CallApi/SingleCall',
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
                    var option1 = '<option value="' + val.cmatter + '" selected > ' + val.mattername + '</option>';
                    $("#matter1").append(option1);
                    $('#calltype1 option[value="' + val.ctype + '"]').attr("selected", true);
                    $('#puser1 option[value="' + val.cpuser + '"]').attr("selected", true);
                    var option5 = '<option value="' + val.cpcontact + '" selected > ' + val.afname + ' ' + val.amname + ' ' + val.alname + ' </option>';
                    $("#pcontact1").append(option5);
                    $('#status1 option[value="' + val.tstatus + '"]').attr("selected", true);
                    $("#subject1").val(val.csubject);
                    $("#dt1").val(val.cdatetime);
                    $("#details1").val(val.cdetails);
                    $("#duration1").val(val.cdura);
                    $("#acontact1").val(val.cpcontact);
                    $("#tags1").val(val.ctags);
                });
            }
            else {
            }
        },
        error: function () {
            alert('Error!');
        }
    });
    /*Start timer on click*/
    $("#stoptimer").css("display", "none");
    $("#starttimer").click(function () {
        $("#starttimer").css("display", "none");
        $("#stoptimer").css("display", "block");
        timesr();
    });
    /*Stop timer on click*/
    $("#stoptimer").click(function () {
        $("#starttimer").css("display", "block");
        $("#stoptimer").css("display", "none");
        clearInterval(t);
    });
    /*Load contact details*/
    loadcontact1();
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
    /*Load matter on client change*/
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
    /* Load Assign User*/
    function assignuser() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#puser1").append(option);
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
    clearInterval(t);
});
/*save data*/
$('form[id="savecallform"]').validate({
    submitHandler: function (form) {
        var contact = $('#contact1').val();
        var matter = $('#matter1').val();
        var subject = $('#subject1').val();
        var calltype = $('#calltype1').val();
        var dt = $('#dt1').val();
        var pcontact1 = $('#pcontact1').val();
        var puser1 = $('#puser1').val();
        if (puser1 == null) {
            alert("Please select assigned user");
            return false;
        }
        var status = $('#status1').val();
        var duration = $('#duration1').val();
        var details = CKEDITOR.instances.details1.getData();
        var tags = $('#tags1').val();
        if (matter == "") {
            alert("Matter Field is Required");
        }
        else {
            var formData = new FormData();
            var tempsize = 0;
            var totalFiles = document.getElementById("postedFile").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("postedFile").files[i];
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
            formData.append("calltype", calltype);
            formData.append("pcontact", pcontact1);
            formData.append("puser", puser1);
            formData.append("dt", dt);
            formData.append("duration", duration);
            formData.append("details", details);
            formData.append("status", status);
            formData.append("tags", tags);
            formData.append("ID", id);
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/PostUpdateCall", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        closeload();
                        new PNotify({
                            title: 'Success!',
                            text: ' Call Updated Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        localStorage.setItem("setname", "calender");
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
    }
});