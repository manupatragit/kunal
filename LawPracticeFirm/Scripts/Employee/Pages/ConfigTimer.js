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
        document.getElementById('countdown2').innerHTML = timestamp.getHours() + 'h:' + timestamp.getMinutes() + 'm:' + timestamp.getSeconds() + 's';
        document.getElementById("duration").value = document.getElementById('countdown2').innerHTML;
        document.getElementById("countdown2").text = document.getElementById('countdown2').innerHTML;
    }, Math.abs(interval) * 1000);
}
///end timer
$('#closemodel').click(function () {
    try {
        clearInterval(t);
    }
    catch (ex) {
    }
});
/*Clear interver model*/
$('#closemodels').click(function () {
    try {
        clearInterval(t);
    }
    catch (ex) {
    }
});
$(document).ready(function () {
    $("#details").val(localStorage.getItem("timerdata"));
    $("#duration").val(localStorage.getItem("timervalue"));
    $("#countdown2").text(localStorage.getItem("timervalue"));
    $("#stoptimer").css("display", "none");
    /*Onclick start timer*/
    $("#starttimer").click(function () {
        $("#starttimer").css("display", "none");
        $("#stoptimer").css("display", "block");
        timesr();
    });
    /*Onclick stop timer*/
    $("#stoptimer").click(function () {
        $("#starttimer").css("display", "block");
        $("#stoptimer").css("display", "none");
        clearInterval(t);
    });
    loadcontact();
  /*  Load contact*/
    function loadcontact() {
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
    /*Load Assign User*/
    assignuser();
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
                
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#billby").append(option);
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
/*Load matter change client contact*/
    $(document).on("change", "#contact", function () {
        $('#matter').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
        }
        else {
            $('#matter').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        }
    });
    /* Load Matter*/
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
    clearInterval(t);
});
/*Save call form data*/
$('form[id="savecallform"]').validate({
    submitHandler: function (form) {
        var contact = $('#contact').val();
        var matter = $('#matter').val();
        var item = $('#item').val();
        var dt = $('#dt').val();
        var duration = $('#duration').val();
        duration = String(duration).replace(/([a-zA-Z ])/g, "");
        var patt3 = /[0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}$/m;
        var result1 = String(duration).match(patt3);
        if (result1 == null) {
            new PNotify({
                title: 'Warning!',
                text: 'Please Enter Correct Call Duration Formate: 00h:00m:00s',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        var array = duration.split(":");
        var ahour = String(array[0]).replace(/\D/g, '');
        var amin = String(array[1]).replace(/\D/g, '');
        var asec = String(array[2]).replace(/\D/g, '');
        if (ahour > 23) {
            new PNotify({
                title: 'Warning!',
                text: 'Hour should be less than 24 hour ',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        if (amin > 59) {
            new PNotify({
                title: 'Warning!',
                text: 'Minute should be less than 60 minutes ',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        if (asec > 59) {
            new PNotify({
                title: 'Warning!',
                text: 'Second should be less than 60 seconds',
                type: 'Warning',
                delay: 3000
            });
            return false;
        }
        var details = CKEDITOR.instances.details.getData();
        var billby = $('#billby').val();
        var hrate = $('#hrate').val();
        var total = $('#total').val();
        var privnotes = $('#privnotes').val();
        var formData = new FormData();
        var ad = '';
        if ($("#billable:checked").prop('checked')) {
            ad = $("#billable:checked").val();
        }
        else {
            ad = false;
        }
        formData.append("contact", contact);
        formData.append("matter", matter);
        formData.append("item", item);
        formData.append("dt", dt);
        formData.append("duration", duration);
        formData.append("details", details);
        formData.append("billable", ad);
        formData.append("billby", billby);
        formData.append("hrate", hrate);
        formData.append("total", total);
        formData.append("privnotes", privnotes);
        $.ajax(
            {
                type: "POST",
                url: "/api/EmployeeApi/PostSaveTimer", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#savecallform")[0].reset();
                    document.getElementById("closemodel").click();
                    new PNotify({
                        title: 'Success!',
                        text: 'Time Entry Added Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    localStorage.setItem("setname1", "calender");
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                } //End of AJAX error function
            });
    }
});