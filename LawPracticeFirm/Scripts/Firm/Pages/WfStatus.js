jQuery(document).ready(function () {
    loadstatus();
}); 
function loadstatus() {
    $.ajax({  async: true, 
        type: "POST",
        url: "/api/WorkFlowNewApi/WorkFlowFillStatus",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
               // alert(datas);
               // var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            var option1 = "<option value=\"0\" >- Select Any -</option>";
            $("#drpstatus").append(option1);
            $.each(response.Data, function (i, a) {
             // alert(a.StatusId);
                var option = '<option value="' + a.StatusId + '" > ' + a.StatusText + '</option>';
                $("#drpstatus").append(option);
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
function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}  
