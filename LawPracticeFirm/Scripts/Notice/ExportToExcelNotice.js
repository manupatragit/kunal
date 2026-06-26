$(document).ready(function () {
})
/*Export notice in excel*/
function ExportToExcelNotice(noticecomefrom) {
    //var notistatus = $('input[name=statustype]:checked').val();
    var notistatus = "";
    var ddlnoticestatusss = $("#ddlnoticestatusss").val();
    var notistatus1;
    if (notistatus == "Home") {
        notistatus1 = "";
    }
    else if (notistatus == "Draft") {
        notistatus1 = "0"
    }
    else if (notistatus == "Sent") {
        notistatus1 = "Pending"
    }
    else if (notistatus == "FinalApproved") {
        notistatus1 = "Approve"
    }
    else if (notistatus == "Rejected") {
        notistatus1 = "Reject"
    }
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetitlesrc = $("#noticeTitless").val();
    var Noticetypesrc = $("#ddlnoticetypess").val();
    var txtStatusOfNotice = ddlnoticestatusss;
    window.location = encodeURI("/NoticeNew/ExportToExcel?SearchValue=" + SearchValue + "&ColumName=" + ColumName + "&SortedOrder=" + SortedOrder + "&notistatus=" + notistatus1 + "&fromdaterange=" + fromdaterange + "&startdate=" + start + "&enddate=" + end + "&fromreminder=" + fromreminder + "&noticeid=" + remindernoticeid + "&noticecomefrom=" + noticecomefrom + "&notitypes=" + ddlnoticestatusss + "&sendernamesearch=" + sendernamesearch + "&Noticesubjectsrc=" + Noticesubjectsrc + "&Noticetitlesrc=" + Noticetitlesrc + "&Noticetypesrc=" + Noticetypesrc + "&txtStatusOfNotice=" + txtStatusOfNotice);
}