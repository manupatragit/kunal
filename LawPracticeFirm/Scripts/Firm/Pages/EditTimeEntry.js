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
        document.getElementById("duration3").value = document.getElementById('countdown2').innerHTML;
    }, Math.abs(interval) * 1000);
}
///end timer
$('#closemodel').click(function () {
    clearInterval(t);
});
$('#closemodels').click(function () {
    clearInterval(t);
});
function openload() {
    $('#myOverlay21').css("display", "block");
}
function closeload() {
    $('#myOverlay21').css("display", "none");
}
openload();

/*Get single time entry*/
function loaddata() {
    var formData = new FormData();
    formData.append("Id", timeid);
    $.ajax({
        async: true,
        url: '/api/CallApi/NewSingleTimeEnrty',
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
                    $("#duration3").val(val.callDura);
                    if (val.tmatter != null) {
                        var option1 = '<option value="' + val.tmatter + '" selected > ' + val.mattername + '</option>';
                        $("#matter2").append(option1);
                    }
                    var dat = val.tdate;
                    var dates1 = dat.substring(0, 10);
                    $("#dt2").val(dates1);
                    CKEDITOR.instances['details1'].setData(val.tdetails);
                    $("#subject").val(val.subject);
                });
                closeload();
            }
            else {
                //alert("not found");
            }
        },
        error: function () {
            closeload();
            // alert('Error!');
        }
    });
    closeload();
}
$(document).ready(function () {
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
    setTimeout(function () {
        loaddata();
    }, 1300);
    loadcontact();

    // load contact
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
                else {
                    //   alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a.LoginId + '" >' + a.Username + ' (' + a.cfname + ') </option> ';
                    $("#contact2").append(option);
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
    $("#contact2").change(function () {
        $('#matter2').empty();
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds);
        }
        else {
            $('#matter2').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
        }
    });

    // Load Matter
    function loadmatter(clientid) {
        $('#matter2').empty().append('<option value="">Select Case</option>').find('option:first').attr("selected", "selected");
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
                    // alert("not found");
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
                        $("#matter2").append(option);
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

//save data
$('form[id="savecallform2"]').validate({
    submitHandler: function (form) {
        var matter = $('#matter2').val();
        var subject = $('#subject').val();
        var dt = $('#dt2').val();
        var duration = $('#duration3').val();
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
        var details = CKEDITOR.instances.details1.getData();
        var formData = new FormData();
        formData.append("matter", EncodeText(matter));
        formData.append("subject", EncodeText(subject));
        formData.append("dt", EncodeText(dt));
        formData.append("duration", EncodeText(duration));
        formData.append("details", EncodeText(details));
        formData.append("id", timeid);
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostUpdateTimeEntry", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#savecallform2")[0].reset();
                    document.getElementById("closemodel").click();
                    new PNotify({
                        title: 'Success!',
                        text: ' Time Entry Updated Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    localStorage.setItem("timesetname1", "calender");
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