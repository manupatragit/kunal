$(document).ready(function () {
    var formData = new FormData();
    formData.append("Id", id);
    $.ajax({  async: true, 
        url: '/api/CallApi/SingleMessage',
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                //alert(datas);
                var obj = JSON.parse(response.Data);
                var aassign = "";
                $.each(obj, function (i, val) {
                    // alert(val.tsubject);
                    $("#subject").html(val.msubject);
                    $("#matter").html(val.mattername);
                    $("#contact").html(val.fname + " " + val.mname + " " + val.lname);
                    $("#details").html(val.mbody);
                    $("#assigncontact").html(val.afname + " " + val.amname + " " + val.alname);
                    $("#assignuser").html(val.UserName);
                    $("#attachment1").html(val.mfile);
                    if (val.mfile == null) {
                        $("#alink").css("display", "none");
                    }
                    else {
                        $("#alink").attr("href", val.mfile);
                    }
                    $("#alink").attr("href", val.mfile);
                    // alert(val.column_name);
                });
            }
            else {
                alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
});
