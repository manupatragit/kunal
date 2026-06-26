/*Open Loader */
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).on("click", "#alink", function () {
    try {
        $('#dt1').datetimepicker("destroy");
    }
    catch (er) {
    }
    openload();
    var fileid = $(this).attr("id-val");
    var mode = "edit";
    var url = "/firm/multiplefilelist/?ftype=call&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
    });
});
$(document).ready(function () {
    notisttaus();
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
    loadcall();
    /*Load single call*/
    function loadcall() {
        openload();
        Id = "hi";
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
                        if (val.ctype == "Inbound") {
                            $("#ctdiv").addClass("bg-yellow");
                        }
                        else if (val.ctype == "OutBound") {
                            $("#ctdiv").addClass("bg-green");
                        }
                        else {
                        }
                        $("#subject").html(val.csubject);
                        $("#matter").html(val.mattername);
                        $("#datetime").html(checkdatetimecustomdt(val.cdatetime));
                        $("#contact").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#status").html(val.tstatus);
                        $("#details").html(val.cdetails);
                        $("#ctype").html(val.ctype);
                        $("#ctype1").html(val.ctype);
                        $("#calld").html(val.cdura);
                        $("#acontact").html(val.cpcontact);
                        $("#tags").html(val.ctags);
                        $("#attachment1").html(val.cfiles);
                        if (val.cfiles == "") {
                            $("#alink").css("display", "none");
                        }
                        else if (val.cfiles == null) {
                            $("#alink").css("display", "none");
                        }
                        else {
                            $("#alink").css("display", "block");
                            $("#alink").attr("href", "#");
                            $("#alink").attr("id-val", val.Id);
                            $("#alink").attr("data-val", val.cfiles);
                        }
                        $("#cid").html(val.ccontact);
                        $("#cname").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#taskname").html(val.csubject);
                        $("#acontact").html(val.afname + " " + val.amname + " " + val.alname);
                        $("#auser").html(val.AssignUserName);
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
            loadcall();
            localStorage.setItem("setname", "");
        }
    }, 2000);
});
