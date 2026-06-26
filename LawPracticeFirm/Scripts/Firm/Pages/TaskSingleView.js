/**Open Loader */
function openload() {
    $('#myOverlay').css("display", "block");
}

/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).on("click", "#alink", function () {
    openload();
    var fileid = $(this).attr("id-val");
    var mode = "edit";
    var url = "/firm/multiplefilelist/?ftype=task&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
    });
});
$(document).ready(function () {
    notisttaus();
    /*Notice status*/
    function notisttaus() {
        var formData = new FormData();
        formData.append("typeids", id);
        $.ajax({
            async: true,
            url: '/api/CallApi/updatenotistatus',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
            }
        });
    }
    loadtask();

    /*Load task*/
    function loadtask() {
        openload();
        Id = "hi";
        var formData = new FormData();
        formData.append("Id", id);
        $.ajax({
            async: true,
            url: '/api/CallApi/SingleTask',
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
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        today = yyyy + '-' + mm + '-' + dd;
                        var dat = val.duedate;
                        var dates1 = formatDatetoIST(dat);
                        if (val.tstatus == "Not Completed") {
                            $("#hsdiv").addClass("bg-red");
                        }
                        else if (val.tstatus == "Completed") {
                            $("#hsdiv").addClass("bg-green");
                        }
                        else if (val.tstatus == "In Progress") {
                            $("#hsdiv").addClass("bg-yellow");
                        }
                        else {
                        }
                        if (dates1 < today) {
                            $("#hddiv").addClass("bg-red");
                        }
                        else {
                            $("#hddiv").addClass("bg-green");
                        }
                        var tasgn = "";
                        if (tasgn == "1") {
                            tasgn = "Yes";
                        }
                        else {
                            tasgn = "No";
                        }
                        $("#subject").html(val.tsubject);
                        $("#matter").html(val.mattername);
                        $("#duedate").html(dates1);
                        $("#hduedate").html(dates1);
                        $("#contact").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#status").html(val.tstatus);
                        $("#hstatus").html(val.tstatus);
                        $("#details").html(val.tdetails);
                        $("#priority").html(val.tpriority);
                        $("#repeat").html(val.trepeat);
                        $("#assign").html(val.tacontact);
                        $("#tags").html(val.ttags);
                        $("#aemail").html(tasgn);
                        $("#assigncontact").html(val.afname + " " + val.amname + " " + val.alname);
                        $("#assignuser").html(val.AssignUserName);
                        $("#attachment1").html(val.tfile);
                        if (val.tfile == "") {
                            $("#alink").css("display", "none");
                        }
                        else if (val.tfile == null) {
                            $("#alink").css("display", "none");
                        }
                        else {
                            $("#alink").css("display", "block");
                            $("#alink").attr("href", "#");
                            $("#alink").attr("id-val", val.Id);
                            $("#alink").attr("data-val", val.tfile);
                        }
                        $("#cid").html(val.tcontact);
                        $("#cname").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#taskname").html(val.tsubject);
                    });
                    if (obj.length == 0) {
                        $("#alink").css("display", "none");
                        $(".dropdown-item").css("display", "none");
                        alert("Data not available");
                    }
                    closeload();
                }
                else {
                    closeload();
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    setInterval(function () {
        var temp = localStorage.getItem("setname");
        if (temp != "") {
            loadtask();
            localStorage.setItem("setname", "");
        }
    }, 2000);
});
