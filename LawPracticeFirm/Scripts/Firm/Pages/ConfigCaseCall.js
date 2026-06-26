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
        document.getElementById('countdown2').innerHTML = timestamp.getHours() + 'h:' + timestamp.getMinutes() + 'm:' + timestamp.getSeconds() + 's';
        document.getElementById("duration").value = document.getElementById('countdown2').innerHTML;
    }, Math.abs(interval) * 1000);
}
///end timer
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
        clearInterval(t);
    });
    // Load Matter
    clearInterval(t);
});

//save data
$(document).on("click", "#transferpagecall", function () {
    var serial = $(this).attr("sno");
    var transferid = serial;
    if (roleid == "1") {
        var urls = "/" + fcode + "/Firm/CallSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    }
    if (roleid == "2") {
        var urls = "/" + fcode + "/Employee/CallSingleView";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    }
});

/*Save call form data*/
$('form[id="savecallform"]').validate({
    submitHandler: function (form) {
        //openload();
        var contact = $('#contact').val();
        var matter = $("#textcaseidcall").text();
        var subject = $('#subject').val();
        var calltype = $('#calltype').val();
        var dt = $('#dt').val();
        var duration = $('#duration').val();
        var details = CKEDITOR.instances.details.getData();
        var puser = $('#puser').val();
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
            openloader();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/callApi/PostSaveCall", // Controller/View
                    data: formData,
                    contentType: false,
                    processData: false,
                    //},
                    success: function (data) {
                        closeloader();
                        $("#savecallform")[0].reset();
                        alert("Call Added Successfully");
                        document.getElementById("closemodel").click();
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