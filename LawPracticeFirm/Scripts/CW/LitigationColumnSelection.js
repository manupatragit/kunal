var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var tfot = '';
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        event.stopPropagation();
    });

    /*Open loader*/
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
        formData.append("moduleName", "LitigationCaseList");
        $("#bindcolumnmaster").html("");
        openload();
        var dt = $.ajax({
            url: '/api/CallApi/LoadLitigationColumnMasterChoice',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = response.Data;
                }
                if (response.Data != "[]") {
                    $("#savecolumnselection").show();
                }
                else {
                    $("#savecolumnselection").hide();
                }
                var htmlstring = '';
                $.each(obj, function (i, a) {
                    htmlstring += '<div class="col-md-4"><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="checkboxassign"> <span>' + a.ColumnName + '</span></div>';
                });
                $("#bindcolumnmaster").empty().html(htmlstring);
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
            formData.append("moduleName", "LitigationCaseList");;
            $.ajax({
                url: '/api/CallApi/LoadLitigationColumnMasterChoiceByFirmId',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = response.Data;
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
        formdata.append("moduleName", "LitigationCaseList");
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