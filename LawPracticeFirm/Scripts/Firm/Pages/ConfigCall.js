var input = {
    hours: 0,
    minutes: 00,
    seconds: 00
};
var interval = 1;
var timestamp = new Date(input.hours, input.minutes, input.seconds);
var t = '';
function timesr() {
    t = window.setInterval(function () {
        timestamp = new Date(timestamp.getTime() + interval * 1000);
        // alert(isPaused);
        document.getElementById('countdown2').innerHTML = timestamp.getHours() + 'h:' + timestamp.getMinutes() + 'm:' + timestamp.getSeconds() + 's';
        document.getElementById("duration").value = document.getElementById('countdown2').innerHTML;
    }, Math.abs(interval) * 1000);
}
///end timer

/*Close model*/
$('#closemodel').click(function () {
    clearInterval(t);
});
$('#closemodels').click(function () {
    clearInterval(t);
});
$(document).ready(function () {
    // clearInterval(t);
    $("#stoptimer").css("display", "none");
    $("#starttimer").click(function () {
        $("#starttimer").css("display", "none");
        $("#stoptimer").css("display", "block");
        timesr();
    });
    $("#stoptimer").click(function () {
        $("#starttimer").css("display", "block");
        $("#stoptimer").css("display", "none");
        //clearTimeout(t);
        clearInterval(t);
    });
    $("#contact").change(function () {
        $('#matter').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
            return false;
        }
        else {
            $('#matter').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
            return false;
        }
    });

/*Load matter by client id*/
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
    clearInterval(t);
});

//save data
$('form[id="savecallform"]').validate({
    submitHandler: function (form) {
        //openload();
        var contact = $('#contact').val();
        var matter = $('#matter').val();
        var subject = $('#subject').val();
        var calltype = $('#calltype').val();
        var dt = $('#dt').val();
        var status = $('#status').val();
        var duration = $('#duration').val();
        var details = CKEDITOR.instances.details.getData();
        var puser = $('#puser').val();
        if (puser == null) {
            alert("Please select assigned user");
            return false;
        }
        var pcontact = $('#pcontact').val();
        var tags = $('#tags').val();
        if (matter == "") {
            alert("Matter Field is Required");
        }
        else {
            var formData = new FormData();
            var tempsize = 0;
            var tottempsize = 0;
            var totalFiles = document.getElementById("postedFile").files.length;
            for (var i = 0; i < totalFiles; i++)
            {
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
                        tempsize =parseFloat(size);
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
            formData.append("contact", contact);
            formData.append("matter", matter);
            formData.append("subject", subject);
            formData.append("calltype", calltype);
            formData.append("dt", dt);
            formData.append("duration", duration);
            formData.append("details", details);
            formData.append("puser", puser);
            formData.append("pcontact", pcontact);
            formData.append("tags", tags);
            formData.append("status", status);
            openloader();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/PostSaveCall", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        closeloader();
                        $("#savecallform")[0].reset();
                        document.getElementById("closemodel").click();
                        new PNotify({
                            title: 'Success!',
                            text: ' Call Added Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        localStorage.setItem("setname", "calender");
                        var $select = $('#puser').selectize();
                        var control = $select[0].selectize;
                        control.clear();
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
    }
});