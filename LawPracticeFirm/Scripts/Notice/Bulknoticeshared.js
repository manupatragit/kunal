var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
};
function changePage(page) {
    PageNumber = page;
    callapi();
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
/*Get bulk shared notice by page number*/
$(document).on('click', '#pgetdatabypagenum', function () {
    ppageindex = $("#ppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changePage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});
$(document).on('click', '#ppaginate', function () {
    pageindex = $(this).attr("index");
    changePage(pageindex);
});
function convertjsondate(dateval) {
    var date = dateval;
    var nowDate = new Date(parseInt(date.substr(6)));
    var result = "";
    result += nowDate.format("dd/mm/yyyy");
}
var maintemplateidd = sessionStorage.getItem("maintemplateidsharedtome")
/*Get bulk notice details*/
var callapi = function () {
    $("#bulknoticelistdiv").html("");
    openload();
    var html = '';
    SearchValue = document.getElementById("myInput").value;
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(SearchValue));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("maintemplateid", EncodeText(maintemplateidd));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/BulkNoticeListByTemplateId",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            if (response == "") {
                $("#bulknoticelistdiv").append("No Records found.");
                return false;
            }
            else {
                var dynamictablhtml = "";
                dynamictablhtml += '<table id="bulkNoticeexample" class="table table-striped table-bordered">';
                dynamictablhtml += '<thead>';
                dynamictablhtml += '<tr>';
                dynamictablhtml += '<th><input type="checkbox" name="checkedAll" id="parentcheckboxid"></th>';
                for (var i = 0; i < response[0].length; i++) {
                    dynamictablhtml += '<th>' + response[0][i] + '</th>';
                }
                dynamictablhtml += '<th>Notice</th>';
                dynamictablhtml += '<th style="width:0%">Status for Manager/Client</th>';
                dynamictablhtml += '<th>Action</th>';
                dynamictablhtml += '</tr>';
                dynamictablhtml += '</thead>';
                dynamictablhtml += '<tbody id="bulkNoticetablevalue"></tbody>';
                dynamictablhtml += '</table>';
                dynamictablhtml += '<center><div id="bulkNoticenonotice"></div></center>';
                dynamictablhtml += `<div class="table-panel">
                            <div class="row settingpanel">
                                <div class="col-md-6" id="footer-data">
                                    <div style="float: left;padding: 0 10px 0 0;">
                                        <ul></ul>
                                    </div>
                                    <div id="bulkNoticefooter" style="margin-left:24px;">
                                    </div>
                                </div>
                            </div>
                        </div>`;
                $("#bulknoticelistdiv").append(dynamictablhtml);
                $.each(response[1], function (i, a) {
                    var jsoncontentparse = JSON.parse(response[1][i].TemplateContentJson);
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    if (i === (response.length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = a.TotalRows;
                        var totpage = 0;
                        if (a.TotalRows > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (a.TotalRows <= response.length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="margin-left:5px;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#bulkNoticefooter").append(tfot);
                    }
                    for (var i = 0; i < jsoncontentparse.length; i++) {
                        html += "<tr class='tbltrcls'>"
                        html += "<td><input type='checkbox' name='checkAll' class='checkSingle' value='" + a.Id + "'></td>"
                        for (var k = 0; k < response[0].length; k++) {
                            html += "<td>" + jsoncontentparse[0]["" + response[0][k] + ""] + "</td>"
                        }
                    }
                    html += "<td style='cursor:pointer;color:#0059c1' onclick=fnmakenoticedraft('" + a.Id + "','" + a.SelfTemplateId + "','" + encodeURIComponent(a.TemplateContentJson) + "','" + a.MainTemplateId + "')>View Notice</td>"
                    if (a.iApprovalStatus != null) {
                        var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                        html += "<td><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.Id + "','Manager') title='View more'></span></td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    html += `<td><table cellpadding="0" cellspacing="0">
                                 <tbody>
                                 <tr>
                                 <td><a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("` + a.Id + `") title="Delete Notice"></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("` + a.Id + `") title="Send For Approval"></a></td>
                                 </tr>
                                </tbody></table></td>`
                    html += "</tr>"
                });
                $("#bulkNoticetablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
        },
        error: function (xhr) {
            alert('error');
            closeload();
        }
    });
};
/*Confirm delete*/
function ConfirmDelete(noticeid) {
    if (confirm("Are you sure you want to remove this entry.")) {
        var formdata = new FormData();
        formdata.append('noticeid', EncodeText(noticeid));
        $.ajax({
            type: "POST",
            url: "/NoticeTemplate/RemoveRecordFromExcelNotice",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                alert(response);
                changePage(pageindex);
            },
        })
    }
}
var approvalnoticeid = "";

/*Send notice for approval*/
function SendApproval(noticeid) {
    arrayforselectedrow.push(noticeid);
    $("#AssignModal").modal('show');
}
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
var arrayforselectedrow = [];
$(document).on('click', '#parentcheckboxid', function (e) {
    if (this.checked) {
        $(".checkSingle").each(function () {
            this.checked = true;
        })
    } else {
        $(".checkSingle").each(function () {
            this.checked = false;
        })
    }
    arrayforselectedrow = [];
    $("tr.tbltrcls").each(function () {
        if ($(this).find('.checkSingle').is(':checked')) {
            var quantity1 = $(this).find('.checkSingle').val()
            arrayforselectedrow.push(quantity1);
        }
    });
});
$(document).on('click', '.checkSingle', function (e) {
    if ($(this).is(":checked")) {
        var isAllChecked = 0;
        $(".checkSingle").each(function () {
            if (!this.checked)
                isAllChecked = 1;
        })
        if (isAllChecked == 0) { $("#parentcheckboxid").prop("checked", true); }
    } else {
        $("#parentcheckboxid").prop("checked", false);
    }
    arrayforselectedrow = [];
    $("tr.tbltrcls").each(function () {
        if ($(this).find('.checkSingle').is(':checked')) {
            var quantity1 = $(this).find('.checkSingle').val()
            arrayforselectedrow.push(quantity1);
        }
    });
});
var selectedrowlength = "";
/*Assign model*/
function assignmodal() {
    selectedrowlength = arrayforselectedrow.length;
    if (selectedrowlength < 1) {
        alert("Please select at least one row.");
        return false;
    }
    $("#AssignModal").modal('show');
}
$(".assignto").change(function () {
    Getmanagerlist();
})
/*Manager list details*/
function Getmanagerlist() {
    $.ajax({
        type: "POST",
        url: "/api/Home/PartnerList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#bindusr").html("");
            $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
            var checkboxval = $("input[name='assignee']:checked").val();
            if (response != null) {
                $.each(response, function (key, value) {
                    if (checkboxval == "manager") {
                        if (value.RoleId == 2) {
                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                        }
                    }
                    else if (checkboxval == "client") {
                        if (value.RoleId == 3) {
                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                        }
                    }
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Assign notice details*/
$("#assignnoticebtn").click(function () {
    if (confirm("Are you sure you want to send this Notice?")) {
        var senderid = userDetails.Id;
        var receiverid = $("#bindusr").val();
        if (receiverid == "0" || receiverid == "" || receiverid == "undefind" || receiverid == "Please Select") {
            alert("Alert ! Please Select User.")
            return false
        }
        var firmid = userDetails.FirmId;
        var noticeid = approvalnoticeid;
        var approvarType = "";
        var checkboxval = $("input[name='assignee']:checked").val();
        if (checkboxval == "manager") {
            approvarType = 2;
        }
        else if (checkboxval == "client") {
            approvarType = 3;
        }
        var formData = new FormData();
        formData.append("senderid", EncodeText(senderid));
        formData.append("receiverid", EncodeText(receiverid));
        formData.append("firmid", EncodeText(firmid));
        formData.append("noticeid", EncodeText(noticeid));
        formData.append("approvarType", EncodeText(approvarType));
        formData.append("multipleNoticeArray", arrayforselectedrow);
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeAssign",
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result) {
                    alert("Notice assigned successfully.")
                }
                else {
                    alert("Something went wrong.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
                arrayforselectedrow = [];
            }
        })
    }
})

/*View log*/
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
    var html = '';
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('Usertype', EncodeText(usertype));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewNoticeLog",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#modlbody").html('');
            $.each(response, function (key, data) {
                var remark = data.Remark == null ? "" : data.Remark;
                var approvalstatus = data.iApprovalStatus == "Approve" ? "Approved" : data.iApprovalStatus;
                html += `<tr>
                        <td>`+ data.sendername + `</td>
                        <td>`+ data.receivername + `</td>
                        <td>`+ dateFormat(new Date(data.dSendDate)) + `</td>
                        <td>`+ approvalstatus + `</td>
                        <td>`+ remark + `</td >
                        <tr/>`
            })
            $("#modlbody").html(html);
        },
    })
}
function fnmakenoticedraft(noticeid, selftemplateid, templatecontent, MainTemplateId) {
    var formData = new FormData();
    formData.append("noticeid", EncodeText(noticeid));
    formData.append("selftemplateid", EncodeText(selftemplateid));
    formData.append("templatecontent", JSON.stringify(JSON.parse(decodeURIComponent(templatecontent))[0]));
    formData.append("MainTemplateId", EncodeText(MainTemplateId));
    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/PrintNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data == "") {
                return false;
            }
            var path = window.location.origin + data;
            var anchor = document.createElement('a');
            $('body').append(anchor);
            anchor.href = path;
            anchor.download = "Notice_Copy";
            anchor.click();
            closeload();
        },
        failure: function (data) {
            closeload();
            alert(data);
        },
        error: function (data) {
            closeload();
            alert(data);
        }
    });
}
