$(document).ready(function () {
//save data
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    databind();
    function databind() {
        var formdata = new FormData();
        $.ajax({
            async: true,
            url: '/api/CallApi/AzureString',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    $("#storagename").val(a.StoageName);
                    $("#connection").val(a.StorageKey);
                    if (a.IsDefault == "1") {
                        $("#default").prop("checked", true);
                    }
                    else {
                        $("#default").prop("checked", false);
                    }
                });
            },
            error: function () {
                alert('Error!');
            }
        });
    }
/*Save */
$("#savesettings").click(function () {
    var connection = $('#connection').val();
    var storagename = $('#storagename').val();
    if (storagename == "") {
        alert("Enter azure storage name");
        return false;
    }
    if (connection == "") {
        alert("Enter azure storage key");
        return false;
    }
    var formData = new FormData();
    var ad = '';
    if ($("#default:checked").prop('checked')) {
        ad = $("#default:checked").val();
    }
    else {
        ad = false;
    }
    // alert(ad);
    formData.append("storagename", storagename);
    formData.append("connection", connection);
    formData.append("default",ad);
    try {
        openload();
    }
    catch (er) {
    }
    //  alert(file.files);
    $.ajax(
        {
            type: "POST",
            url: "/api/callApi/SaveAzureString", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            //},
            success: function (data) {
                $("#savecallform")[0].reset();
                alert("Saved Successfully");
                closeload();
                location.reload();
            }, //End of AJAX Success function
            failure: function (data) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (data) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });
});
      