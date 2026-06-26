$(document).ready(function () {
})
function ExportToExcel(noticecomefrom) {
    var notistatus1 = "";
    var SearchValue = "";
    var ColumName = "";
    window.location = encodeURI("/ExportToExcel/ExportToExcel?SearchValue=" + SearchValue + "&ColumName=" + ColumName + "&notistatus=" + notistatus1 + "&noticecomefrom=" + noticecomefrom);
}