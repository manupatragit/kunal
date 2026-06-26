function task() {
    var objtask;
    $.ajax({
        async: true,
        url: '/api/CallApi/LoadTask',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                objtask = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            var option1 = "<option value=\"0\" >- Select Any -</option>";
            $("#drptask").append(option1);
            $.each(objtask, function (i, a) {
                var option = '<option value="' + a["Id"] + '" > ' + a["tsubject"] + '</option>';
                $("#drptask").append(option);
            });
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        }
    });
}
/*Save task stage*/
$('form[id="savetaskstage1"]').validate({
    submitHandler: function (form) {
        var drptask = $("#drptask").val();
        var duedt = $("#duedt").val();
        var User = $("#User").val();
        var formData = new FormData();
        formData.append("drptask", drptask);
        formData.append("duedt", duedt);
        formData.append("User", User);
        $.ajax(
            {
                type: "POST",
                url: "/api/WorkFlowNewApi/SaveWorkFlowNewTask", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#savetaskstage1")[0].reset();
                    new PNotify({
                        title: 'Success!',
                        text: ' Task Added Successfully',
                        type: 'success',
                        delay: 3000
                    });
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
    }
});