var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var tfot = '';
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });

    /*Open liader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }

    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    $(document).on("click", "#select_all", function () {
        $(".checkboxassign").prop('checked', $(this).prop('checked'));
    });
    LoadColumnMaster();

    /*Load master column*/
    function LoadColumnMaster() {
        var formData = new FormData();
        formData.append("moduleName", "MatterList");
        $("#bindcolumnmaster").html("");
        openload();
        var dt = $.ajax({
            url: '/api/CallApi/LoadColumnMasterChoice',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                if (response.Data != "[]") {
                    $("#savecolumnselection").show();
                }
                else {
                    $("#savecolumnselection").hide();
                }
                var html3 = '';
                var html4 = '';
                $.each(obj, function (i, a) {
                    if (a.Sequence == 101) {
                        $("#customfielddiv").show();
                        html4 += '<div class="col-md-3 "  ><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="checkboxassign"> <span>' + a.ColumnName + '</span></div>';
                    }
                    else if (a.Sequence > 101) {
                        $("#customfielddiv").show();
                        html4 += ' <div class="col-md-3 "><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="checkboxassign"> <span>' + a.ColumnName + '</span></div>';
                    }
                    else {
                        html3 += '<div class="col-md-3 "><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="checkboxassign"> <span>' + a.ColumnName + '</span></div>';
                    }
                });
                $("#bindcolumnmaster").empty().html(html3);
                $("#bindcolumnmastercustomField").empty().html(html4);
                closeload();
                //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
        $.when(dt).then(function (data, textStatus, jqXHR) {
            var formData = new FormData();
            formData.append("moduleName", "MatterList");
            $.ajax({
                url: '/api/CallApi/LoadColumnMasterChoiceByFirmId',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    $.each(obj, function (i, a) {
                        $("#sel" + a.ModuleId).prop('checked', true);
                    });
                    closeload();
                    //End of foreach Loop
                }, //End of AJAX Success function
                failure: function (response) {
                    // alert(response.responseText);
                    closeload();
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                    closeload();
                } //End of AJAX error function
            });
        });
    }
    var Ids = new Array();
    $("#savecolumnselection").click(function () {
        Ids = [];
        $('input:checkbox.checkboxassign').each(function () {
            if ($(this).prop('checked')) {
                var fileval = $(this).attr("value");
                Ids.push(fileval);
            }
        });
        if (Ids.length > 8) {
            alert("You can select maxmium 8 columns for default view.");
            return false;
        }
        var formdata = new FormData();
        formdata.append("tokens", Ids);
        formdata.append("moduleName", "MatterList");
        openload();
        var ld12 = $.ajax({
            async: true,
            url: "/api/CallApi/SaveColumnMasterChoice",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (parseInt(data.Data) >= 0) {
                    alert("Successfully saved");
                    $('#select_all').prop('checked', false);
                    $('.checkboxassign').prop('checked', false);
                    location.reload();
                    closeload();
                }
                else {
                    alert("OOPs! Something went wrong.");
                    closeload();
                }
            },
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
