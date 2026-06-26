$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    openload();
    loaddata();
    /*Load reminder details by Id*/
    function loaddata() {
        var formData = new FormData();
        formData.append("token", token);
        $.ajax({
            async: true,
            url: '/api/CallApi/ReminderDetailsById',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "") {
                        closeload();
                        return false;
                    }
                    var obj = JSON.parse(response.Data);
                    var aassign = "";
                    $.each(obj, function (i, val) {
                        $("#etitle").val(val.ETitle);
                        $("#eventstime").val(val.EStartTime);
                        $("#eventetime").val(val.EEndTime);
                        var dat = val.EDate;
                        var dates1 = dat.substring(0, 10);
                        $("#eventdate").val(dates1);
                        $("#location").val(val.Location);
                        $("#details").val(val.EDescription);
                        if (val.AllDay == "1") {
                            $("#allday").prop("checked", true);
                        }
                        else {
                            $("#allday").prop("checked", false);
                        }
                    });
                    closeload();
                }
                else {
                    //alert("not found");
                }
            },
            error: function () {
                closeload();
            }
        });
    }

    /*Save reminder details*/
    $("#savereminder").click(function () {
        var etitle = $('#etitle').val();
        var source = "";
        var eventstime = $('#eventstime').val();
        var eventetime = $('#eventetime').val();
        var location = $('#location').val();
        var eventdate = $('#eventdate').val();
        if (etitle == "") {
            alert("Enter Event Title");
            document.getElementById("etitle").focus();
            return false;
        }
        if (eventdate == "") {
            alert("select date");
            document.getElementById("eventdate").focus();
            return false;
        }
        var details = $('#details').val();
        var formData = new FormData();
        var ad = '';
        if ($("#allday:checked").prop('checked')) {
            ad = $("#allday:checked").val();
        }
        else {
            ad = 0;
        }
        var rc = 0;
        formData.append("etitle", etitle);
        formData.append("source", source);
        formData.append("eventstime", eventstime);
        formData.append("eventetime", eventetime);
        formData.append("location", location);
        formData.append("eventdate", eventdate);
        formData.append("details", details);
        formData.append("allday", ad);
        formData.append("recurrence", rc);
        formData.append("token", token);
        try {
            openload();
        }
        catch (er) {
        }
        $.ajax(
            {
                type: "POST",
                url: "/api/callApi/SaveEditReminder", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                //},
                success: function (data) {
                    if (token == "") {
                        $("#saveremindform")[0].reset();
                        alert("Event Added Successfully");
                        closeload();
                        window.location = encodeURI("/" + fcodes + "/Firm/CalendarEventList");
                    }
                    else {
                        alert("Event updated Successfully");
                        closeload();
                        window.location = encodeURI("/" + fcodes + "/Firm/CalendarEventList");
                    }
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
    });
});
