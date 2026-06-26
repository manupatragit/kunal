jQuery(document).ready(function () {
    loadWorkflow();
});
function loadWorkflow() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/WorkFlowNewApi/FillWorkflow",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            else {
                //alert("not found");
            }
            var option1 = "<option value=\"0\" >- SELECT ANY -</option>";
            $("#drpworkflow").append(option1);
            $.each(response.Data, function (i, a) {
                var option = '<option value="' + a.id + '" > ' + a.WorkFlowName + '</option>';
                $("#drpworkflow").append(option);
            });
            //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}