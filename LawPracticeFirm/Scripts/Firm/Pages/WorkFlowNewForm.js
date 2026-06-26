loadform();

/*LOad form*/
function loadform() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CallApi/LoadCform",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                alert("not found");
            }
            var option1 = "<option value=\"0\" >- Select Any -</option>";
            $("#drpform").append(option1);
            $.each(obj, function (i, a) {
                var option = '<option value="' + a["Id"] + '" > ' + a["FormName"] + '</option>';
                $("#drpform").append(option);
            });
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}

/*Save form stage details*/
$('form[id="savestage1form"]').validate({
    submitHandler: function (form) {
        var drpform = $("#drpform").val();
        var duedt = $("#duedt").val();
        var drpAction = $("#drpAction").val();
        var User = $("#User").val();
        var formData = new FormData();
        formData.append("drpform", drpform);
        formData.append("duedt", duedt);
        formData.append("drpAction", drpAction);
        formData.append("User", User);
        $.ajax(
            {
                type: "POST",
                url: "/api/WorkFlowNewApi/SaveWorkFlowNewForms", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#savestage1form")[0].reset();
                    new PNotify({
                        title: 'Success!',
                        text: ' Stage 1 Added Successfully',
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
