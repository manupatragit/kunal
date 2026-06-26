
$(document).ready(function () {
    //alert('hi');
    var fcode = localStorage.getItem("FirmCode");
    var urlParams = new URLSearchParams(window.location.search);
    var vcode = urlParams.get('c');
   
    GetMykaseCauselistDetailsByCode(vcode);
});

function GetMykaseCauselistDetailsByCode(vcode) {
    //alert(vcode);
    $.ajax({
        type: 'POST',
        url: "/Home/GetMykaseCauselistDetailsByCode?code=" + vcode,
        data: "",
        dataType: "text",
        success: function (resultData) {
            //alert(resultData);
            //$("#divcauselistalertlist").remove();
            $("#divcauselistalertlist").html(resultData);
        }
    });
}