var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    GetCaseNotes("");
});
/*Get case notes details*/
function GetCaseNotes(val, search) {
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
            alert(response1);
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
                        html3 += "<a href=/CaseDetail/ShowCaseDetailsById?caseid=" + a.Iid + "&crtid=>" + a.Csno + "</a>"
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