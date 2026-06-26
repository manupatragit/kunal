jQuery(document).ready(function () {
    openloader();
    /*client dashboard Matter List Detail*/
    $.ajax({
        async: true,
        url: "/api/WorkFlowNewApi/MatterListDetail",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        headers: {
            'status': ''
        },
        dataType: 'json',
        success: function (response) {
            if (response.Status == true) {
                var obj = JSON.parse(response.Data);
            }
            else {
                alert("not found");
            }
            $.each(obj, function (i, val) {
                $("#totcases").html(val.Totcase.toString());
                $("#totopen").html(val.opencase.toString());
                $("#totpending").html(val.Pendingcase.toString());
                $("#totclose").html(val.closecase.toString());
                closeloader();
            });
        },
        error: function () {
        }
    });
});
