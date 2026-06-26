function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
$(document).on("click", "#alink", function () {
    try {
        $('#dt').datetimepicker("destroy");
    }
    catch (er) {
    }
    openload();
    var fileid = $(this).attr("id-val");
    var mode = "edit";
    var url = "/firm/multiplefilelist/?ftype=note&data=" + fileid + "&mode=" + mode;
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
    loadnote();
/*Load notes*/
    function loadnote() {
        openload();
    var formData = new FormData();
        formData.append("Id", id);
    $.ajax({  async: true, 
        url: '/api/CallApi/SingleNote',
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
                        $("#subject").html(val.nsubject);
                        $("#nmatter").html(val.mattername);
                        $("#datetime").html(checkdatetimecustomdt(val.ndatetime));
                        $("#ncontact").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#note").html(val.nnote);
                        $("#tags").html(val.ntags);
                        $("#attachment1").html(val.nfiles);
                        if (val.nfiles == "") {
                            $("#alink").css("display", "none");
                        }
                        else if (val.nfiles == null) {
                            $("#alink").css("display", "none");
                        }
                        else {
                            $("#alink").css("display", "block");
                            $("#alink").attr("href", "#");
                            $("#alink").attr("id-val", val.Id);
                            $("#alink").attr("data-val", val.nfiles);
                        }
                        $("#status").html(val.tstatus);
                        $("#cid").html(val.ncontact);
                        $("#cname").html(val.fname + " " + val.mname + " " + val.lname);
                        $("#taskname").html(val.nsubject);
                        // alert(val.column_name);
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
                alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
    setInterval(function () {
        var temp = localStorage.getItem("setname3");
        if (temp != "") {
            loadnote();
            localStorage.setItem("setname3", "");
        }
    }, 2000);
});