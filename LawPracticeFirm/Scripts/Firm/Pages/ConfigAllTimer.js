var input2 = {
    h1: 00,
    m1: 00,
    s1: 00
};
var interval2 = 1;
var t = '';
h1 = sessionStorage.getItem("h2");
m1 = sessionStorage.getItem("m2");
s1 = sessionStorage.getItem("s2");
if (h1 != "NaN" || m1 != "NaN" || s1 != "NaN") {
    h1: h1;
    m1: m1;
    s1: s1;
}
var timestamp2 = new Date("July 20, 2016 " + h1 + ':' + m1 + ':' + s1);
function timesr2() {
    t2 = window.setInterval(function () {
        timestamp2 = new Date(timestamp2.getTime() + interval2 * 1000);
        // alert(isPaused);
        document.getElementById('countdown22').innerHTML = timestamp2.getHours() + 'h:' + timestamp2.getMinutes() + 'm:' + timestamp2.getSeconds() + 's';
        document.getElementById("duration2").value = document.getElementById('countdown22').innerHTML;
        document.getElementById("countdown22").text = document.getElementById('countdown22').innerHTML;
    }, Math.abs(interval2) * 1000);
}
///end timer
$('#closemodel').click(function () {
    try {
        clearInterval(t2);
    }
    catch (ex) {
    }
});
$('#closemodels').click(function () {
    try {
        clearInterval(t2);
    }
    catch (ex) {
    }
});
$(document).ready(function () {
    $("#duration2").val(localStorage.getItem("tasktimervalue"));
    $("#countdown22").text(localStorage.getItem("tasktimervalue"));
    $("#taskstoptimer").css("display", "none");
    $("#taskstarttimer").click(function () {
        $("#taskstarttimer").css("display", "none");
        $("#taskstoptimer").css("display", "block");
        timesr2();
    });
    $("#taskstoptimer").click(function () {
        $("#taskstarttimer").css("display", "block");
        $("#taskstoptimer").css("display", "none");
        clearInterval(t2);
    });
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

    //load Assign User
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
                else {
                    //alert("not found");
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

    /*Load matter by contact change*/
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

    // Load Matter
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
    clearInterval(t);
});

//save data
$('form[id="savecallform"]').validate({
    submitHandler: function (form) {
        //openload();
        var contact = $('#contact').val();
        var matter = $('#matter').val();
        var item = $('#item').val();
        var dt = $('#dt').val();
        var duration = $('#duration2').val();
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
        try {
            openload();
        }
        catch (er) {
        }
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/PostSaveTimer", // Controller/View
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
                    closeload();
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