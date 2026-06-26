$(document).ready(function () {

    $("#stage").on('change', function () {
        var strstageval = $("#stage").val();
        var data = { 'Form1': 'Form 1', 'Form2': 'Form 2' };
        var s = $('<select id="drpstage1" onchange=\"FillAction(this)"\/>');
        /* for (var val in data) {
             $('<option />', { value: val, text: data[val] }).appendTo(s);
         }*/
        s.appendTo($("#divstage"));
        var s = $('<select id="drpUser"/>');
        s.appendTo($("#divUser"));
        loadUser();
    });
    $(document).on('change', "#combo", function () {
        alert(this.value);
    });
    //fill dropdown
});
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
                //alert(datas);
                var obj = JSON.parse(response.Data);
            }
            else {
                alert("not found");
            }
            var option1 = "<option value=\"0\" >- Select Any -</option>";
            $("#drpstage1").append(option1);
            $.each(obj, function (i, a) {
                //alert(a.Id);
                var option = '<option value="' + a["Id"] + '" > ' + a["FormName"] + '</option>';
                $("#drpstage1").append(option);
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

/*Load user*/
function loadUser() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/WorkFlowNewApi/FirmUser",
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
            $("#drpUser").append(option1);
            $.each(obj, function (i, a) {
                //alert(a.Id);
                var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                $("#drpUser").append(option);
            });
            //End of foreach Loop
            //console.log(response);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
/*Load task*/
function loadTask() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/WorkFlowNewApi/FirmUser",
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
            $("#drpUser").append(option1);
            $.each(obj, function (i, a) {
                var option = '<option value="' + a["Id"] + '" > ' + a["UserName"] + '</option>';
                $("#drpUser").append(option);
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
