var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    GetTotalCaseNotesDetails("");
    GetTotalCaseOrdersDetails("");
});
/*Get total case notes details*/
function GetTotalCaseNotesDetails(search) {
    var html3 = '';
    html3 += '<table id="example" style="overflow-x:auto;" class="table table-bordered table-striped">'
    html3 += '<thead>'
    html3 += '<tr >'
    html3 += '<th width="80%">Case</th>'
    html3 += '<th width="10%" align="center">Notes</th>'
    html3 += '<th width="10%" align="center">Share</th>'
    html3 += '</tr>'
    html3 += '</thead>'
    html3 += '<tbody>'
    var formData = new FormData();
    formData.append("search", search);
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetTotalCaseNotesDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.length;
            if (length > 0) {
                $("#divcasenotesetails tr").remove();
                $.each(response1, function (i, a) {
                    var vdoc = "", dtype = "";
                    dtype = "note";
                    vdoc = "<a href='#' title='Notes' onClick='OpenNotes(" + a.Iid + ")'><i class='fa fa-file-text-o' aria-hidden='true'></i></a>";
                    if (vdoc != "") {
                        html3 += '<tr>'
                        html3 += '<td> '
                        html3 += "<a href=#>" + a.Csno + "</a>"
                        html3 += '</td>'
                        html3 += '<td>'
                        html3 += vdoc
                        html3 += '</td>'
                        html3 += '<td>'
                        html3 += "<a href='#' data-toggle='tooltip' title='Share Notes' onClick='EmailCase(" + a.Iid + ")'><i class='fa fa-share-alt' aria-hidden='true'></i></a>"
                        html3 += '</td>'
                        html3 += '</tr>'
                    }
                });
            } else {
                html3 += '<tr>'
                html3 += '<td colspan=3 align=center>Data Not Found</td></tr>'
            }
            html3 += '</tbody>'
            html3 += '</table>'
            $("#divcasenotesetails").html("");
            $("#divcasenotesetails").append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
/*Open notes*/
function OpenNotes(val) {
    var search = "";
    search = $("#Search").val();
    var url = "/CW/CaseNotes?id=" + val + "&search=";
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
}
/*Open order notes*/
function OpenOrderNotes(val) {
    var search = "";
    search = $("#Search").val();
    var url = "/CW/CaseOrderNotes?id=" + val + "&search=";
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
}
/*Email cases*/
function EmailCase(val) {
    var search = "";
    search = $("#Search").val();
    var url = "/CW/EmailOrderNotes?id=" + val + "&search=";
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
}
/*Close notes model*/
function ModalNotesClose1() {
    $("#myModal").hide();
    $('#myModal').modal({ show: false });
}
/*Get total case order details*/
function GetTotalCaseOrdersDetails(search) {
    var html3 = '';
    html3 += '<table id="exampleord" style="overflow-x:auto;" class="table table-bordered table-striped">'
    html3 += '<thead>'
    html3 += '<tr >'
    html3 += '<th width="80%">Case</th>'
    html3 += '<th width="10%" align="center">Order Date</th>'
    html3 += '<th width="10%" align="center">Order Notes</th>'
    html3 += '</tr>'
    html3 += '</thead>'
    html3 += '<tbody>'
    var formData = new FormData();
    formData.append("search", search);
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetTotalCaseOrdersDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.length;
            $("#ordernotes tr").remove();
            if (length > 0) {
                $.each(response1, function (i, a) {
                    var vdoc = "", dtype = "";
                    dtype = "note";
                    vdoc = "<a href='#' title='Notes' onClick='OpenOrderNotes(" + a.vNotesId + ")'><i class='fa fa-file-text-o' aria-hidden='true'></i></a>";
                    if (vdoc != "") {
                        html3 += '<tr>'
                        html3 += '<td> '
                        html3 += "<a href=#>" + a.Csno + "</a>"
                        html3 += '</td>'
                        html3 += '<td>'
                        html3 += a.Orderdt
                        html3 += '</td>'
                        html3 += '<td>'
                        html3 += vdoc
                        html3 += '</td>'
                        html3 += '</tr>'
                    }
                });
            } else {
                html3 += '<tr>'
                html3 += '<td colspan=3 align=center>Data Not Found</td></tr>'
            }
            html3 += '</tbody>'
            html3 += '</table>'
            $("#ordernotes").html("");
            $("#ordernotes").append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
/*Search case by text*/
function SaerchCaseByText() {
    var search = "";
    search = $("#Search").val();
    GetTotalCaseNotesDetails(search);
    GetTotalCaseOrdersDetails(search);
}