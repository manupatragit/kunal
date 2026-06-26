/**
 * Preview image
 * @param {any} event
 */
function preview_image(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output_image');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}
$(document).ready(function () {
    loadmenu();
    $("#txtcustomFieldvalue").val('').hide();
    $("#txtcustomFieldNameminlength").val('0').hide();
    $("#txtcustomFieldNamemaxlength").val('0').hide();
    $("#lengthid").hide();
    $("#listid").hide();
    $("#common").css("display", "none");
    $('#ctype').on('change', function () {
        var selectid = this.value;
        // alert(selectid);
        if (selectid == 1) {
            $("#listid").show();
            $("#txtcustomFieldvalue").val('').show();
            $("#lengthid").hide();
            $("#txtcustomFieldNameminlength").val('0').hide();
            $("#txtcustomFieldNamemaxlength").val('0').hide();
            $("#common").css("display", "block");
        }
        else if (selectid == 4) {
            $("#listid").show();
            $("#txtcustomFieldvalue").val('').show();
            $("#lengthid").hide();
            $("#txtcustomFieldNameminlength").val('0').hide();
            $("#txtcustomFieldNamemaxlength").val('0').hide();
            $("#common").css("display", "block");
        }
        else if (selectid == 5) {
            $("#listid").hide();
            $("#txtcustomFieldvalue").val('').hide();
            $("#lengthid").show();
            $("#txtcustomFieldNameminlength").val('0').show();
            $("#txtcustomFieldNamemaxlength").val('0').show();
            $("#common").css("display", "block");
        }
        else {
            $("#txtcustomFieldvalue").val('').hide();
            $("#txtcustomFieldNameminlength").val('0').hide();
            $("#txtcustomFieldNamemaxlength").val('0').hide();
            $("#lengthid").hide();
            $("#listid").hide();
            $("#common").css("display", "none");
        }
    });

    /*Load menu*/
    function loadmenu() {
        $.ajax({
            async: true,
            type: "POST",
            url: "http://localhost:55513/api/FirmApi/CustomFields",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + (a["DefaultValues"] === null ? "" : a["DefaultValues"]) + '" aurl="' + (a["Url"] === null ? "" : a["Url"]) + '">' + a["Text"] + '</option>';
                    $("#ctype").append(option);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }


    //save data
    $("#addfield").click(function () {
        var txtfn = $("#txtcustomFieldName").val();
        alert(txtfn);
        var ct = $("#ctype").val();
        var txtfv = $("#txtcustomFieldvalue").val();
        var txtr = $.trim($("#chkRequired").is(":checked"));
        var minv = $("#txtcustomFieldNameminlength").val();
        var maxv = $("#txtcustomFieldNamemaxlength").val();
        if (minv == null) {
            minv = 0;
        }
        if (maxv == null) {
            maxv = 0;
        }
        $.ajax(
            {
                type: "POST",
                url: "http://localhost:55513/api/demo/PostSaveFirmCustomFields", // Controller/View
                data: {
                    FieldName: txtfn,
                    FieldType: ct,
                    FieldValues: txtfv,
                    IsRequired: txtr,
                    ConfigurationType: '@ViewBag.type',
                    Sequence: "1",
                    //SubConfigurationType: "1",
                    MinLength: minv,
                    MaxLength: maxv,
                    IsPositionChangable: "true",
                    IsDefault: "true",
                    IsActive: "true"
                },
                success: function (data) {
                    alert("data saved successfully");
                    $('#myModal').modal('hide');
                    $("#form2")[0].reset();
                }, //End of AJAX Success function
                failure: function (data) {
                    alert(data.responseText);
                }, //End of AJAX failure function
                error: function (data) {
                    alert(data.responseText);
                } //End of AJAX error function
            });
    });
});