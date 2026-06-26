$(document).ready(function () {
    /*Open loader*/
    function openloadq() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeloadq() {
        $('#myOverlay').css("display", "none");
    }
    function clearForm() {
        $('#savecasealert')[0].reset();
    }
    /*Save alert details*/
    $("#savealerts").click(function () {
        var alertid = $("#edittoken").val();
        var activity = token;
        var events = $("#caseevents").val();
        var events = $("#caseevents").val();
        var customevents = $("#customevent").val();
        if (customevents != "") {
            events = events + "," + customevents;
        }
        var alertDays = $("#ddldays").val();
        var hearingAlert = $("#ddlHearing").val();
        var caldate = $("#callfromdate").val();
        var duedate = $("#duedate").val();
        var user = $('#select-user').val();
        if (events == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please select event',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (user == null) {
            new PNotify({
                title: 'Warning!',
                text: 'Please select users',
                type: 'error',
                delay: 3000
            });
            return false;
        }
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
        if (duedate == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please select due date',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        if (caldate != "") {
            var currentDt = new Date(caldate);
            var mm = currentDt.getMonth() + 1;
            mm = (mm < 10) ? '0' + mm : mm;
            var dd = currentDt.getDate();
            dd = (dd < 10) ? '0' + dd : dd;
            var yyyy = currentDt.getFullYear();
            caldate = mm + '/' + dd + '/' + yyyy;
        }
        if (caldate != "" && (hearingAlert != "0" || alertDays != "")) {
            alert("Please select one Date");
            return false;
        }
        if (alertid == "") {
            if (caldate == "") {
                if (hearingAlert != 3) {
                    if (alertDays == 0) {
                        alert("Please Set Alert Date");
                        return false;
                    }
                }
                if (hearingAlert == 0) {
                    alert("Please Set Alert Date");
                    return false;
                }
                if (hearingAlert == 3 && alertDays == "") {
                    alertDays = "0";
                    //alert("Please select day.");
                    //return false;
                }
            }
            if (caldate != "") {
                alertDays = 0;
                hearingAlert == 0;
            }
        }
        var date1 = new Date(duedate);
        var date2 = new Date(caldate);
        if (date1 < date2) {
            alert("Due date should not be less than alert date");
            return false;
        }
        formData.append("caseid", token);
        formData.append("hearingAlert", hearingAlert);
        formData.append("alertDays", alertDays);
        formData.append("caldate", caldate);
        formData.append("events", events);
        formData.append("users", user);
        formData.append("duedate", duedate);
        formData.append("alertid", alertid);
        openloadq();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/savecaseeventalerts",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "success") {
                    alert("Alert saved successfully");
                    clearForm();
                    localStorage.setItem("caseremind", "1");
                    var $select = $('#caseevents').selectize();
                    var control = $select[0].selectize;
                    control.clear();
                    var $select1 = $('#select-user').selectize();
                    var control1 = $select1[0].selectize;
                    control1.clear();
                    $("#customeventblock").css("display", "none");
                    $("#customevent").val("");
                    $("#eventtext").html("Create");
                    $("#filelist").html("");
                    $("#seconddiv").css("display", "none");
                    $("#firstdiv").css("display", "unset");
                    $("#tempeventname").html("");
                    $("#edittoken").val("");
                    $("#edittoken").val("");
                    $('#ddlHearing').prop('selectedIndex', 0);
                    $('#ddldays').prop('selectedIndex', 0);
                    var $select1 = $('#select-user').selectize();
                    var control1 = $select1[0].selectize;
                    control1.clear();
                    $('#savecasealert')[0].reset();
                    closeloadq();
                }
                else {
                    alert(data.Data);
                    closeloadq();
                }
            }
        });
    });
});