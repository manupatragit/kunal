function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).on("click", "#alink", function () {
    openload();
    var fileid = $(this).attr("id-val");
    var mode = "edit";
    var url = "/firm/multiplefilelist/?ftype=event&data=" + fileid + "&mode=" + mode;
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
    loadevent();
    /*Load event details*/
    function loadevent() {
        openload();
        var formData = new FormData();
        formData.append("Id", id);
        $.ajax({
            async: true,
            url: '/api/CallApi/SingleEvent',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var ad = "";
                    var eassign = "";
                    $.each(obj, function (i, val) {
                        if (val.eallday == "1") {
                            ad = "Yes";
                        }
                        else {
                            ad = "No";
                        }
                        if (val.teassign == "1") {
                            eassign = "Yes";
                        }
                        else {
                            eassign = "No";
                        }
                        var dat1 = val.sdate;
                        var time1 = val.stime;
                        var dates1 = formatDatetoIST(dat1);
                        var newd1 = "";
                        var newd2 = "";
                        var dat2 = val.edate;
                        var time2 = val.etime;
                        var dates2 = formatDatetoIST(dat2);
                        if (time1 != null) {
                            newd1 = dates1 + " " + time1;
                        }
                        else {
                            newd1 = dates1;
                        }
                        if (time2 != null) {
                            newd2 = dates2 + " " + time2;
                        }
                        else {
                            newd2 = dates2;
                        }
                        $("#subject").html(val.tsubject);
                        $("#matter").html(val.mattername);
                        $("#start").html(newd1);
                        $("#end").html(newd2);
                        $("#starth").html(newd1);
                        $("#endh").html(newd2);
                        $("#status").html(val.tstatus);
                        $("#allday").html(ad);
                        $("#color").html(val.ecolor);
                        $("#contact").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#assigncontact").html(val.afname + " " + val.amname + " " + val.alname);
                        $("#location").html(val.elocation);
                        $("#details").html(val.tdetails);
                        $("#priority").html(val.tpriority);
                        $("#repeat").html(val.trepeat);
                        $("#assignuser").html(val.AssignUserName);
                        $("#tags").html(val.ttags);
                        $("#aemail").html(eassign);
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
            loadevent();
            localStorage.setItem("setname", "");
        }
    }, 2000);
});