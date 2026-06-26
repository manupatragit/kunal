
var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var userCaseID = urlParams.get("userCaseID");
var MatterID = urlParams.get("MatterID");
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var Proname = "";
var PropAddress = "";
var Pwduserid = 0;
var courtActionStatusId = "";
var PwStatusId = "";
var hasPermission = false;
$(document).ready(function () {

    GetUserList();

});


function ProcessEntryDashBoardReport() {

    var searchuserId = "";
    var UserListTertiaryFilter = $("#UserListTertiaryFilter").val();
    var secondaryUser = $("#UserListFilter").val();
    if (UserListTertiaryFilter == null || UserListTertiaryFilter == "") {
        searchuserId = secondaryUser;
    }
    else {
        searchuserId = UserListTertiaryFilter;
    }
    $.ajax({
        type: "POST",
        // url: "/STF/checkEmployeeCodeExist",
        url: "/STF/ProcessReport",
        data: {
            'issueDateFrom': $("#IssueDateFrom").val(),
            'issueDateTo': $("#IssueDateToReport").val(),
            'searchuserId': searchuserId
        },
        success: function (response) {
            debugger
            var obj = response; // Parse JSON response
            var htmls = '';
            var CourtProcessReport = '';
            var CourtProcessServeReport = '';
            var CourtProcessNOTServeReport = '';
            var CourtPWPresenceReport = '';
            var CourtPWAbsenteReport = '';
            var CourtActionStatusReport = '';
            if (obj) {

                htmls += '<tr>';
                if (obj.CourtProcessReport.length > 0) {
                    $.each(obj.CourtProcessReport, function (index, item) {
                        CourtProcessReport += '<span>' + item.CourtProcess + ': ' + item.CourtProcesCount + '</span></br>'
                    });
                    htmls += '<td>' + CourtProcessReport + '</td>';
                } else {
                    htmls += '<td></td>'; // If no data, insert empty td
                }
                ////////////////////
                if (obj.CourtProcessServeReport.length > 0) {
                    $.each(obj.CourtProcessServeReport, function (index, item) {
                        CourtProcessServeReport += '<span>' + item.CourtProcessServe + ': ' + item.ServeCount + '</span></br>'
                    });
                    htmls += '<td>' + CourtProcessServeReport + '</td>';
                } else {
                    htmls += '<td></td>'; // If no data, insert empty td
                }
                //////////////////////////////
                if (obj.CourtProcessNOTServeReport.length > 0) {
                    $.each(obj.CourtProcessNOTServeReport, function (index, item) {
                        CourtProcessNOTServeReport += '<span>' + item.CourtProcess + ': ' + item.Count + '</span></br>'
                    });
                    htmls += '<td>' + CourtProcessNOTServeReport + '</td>';
                } else {
                    htmls += '<td></td>'; // If no data, insert empty td
                }
                //////////////////////////////////
                if (obj.CourtPWPresenceReport.length > 0) {
                    $.each(obj.CourtPWPresenceReport, function (index, item) {
                        CourtPWPresenceReport += '<span>' + item.CourtProcess + ': ' + item.Count + '</span></br>'
                    });
                    htmls += '<td>' + CourtPWPresenceReport + '</td>';
                } else {
                    htmls += '<td></td>'; // If no data, insert empty td
                }
                //////////////////////////////////////
                if (obj.CourtPWAbsenteReport.length > 0) {
                    $.each(obj.CourtPWAbsenteReport, function (index, item) {
                        CourtPWAbsenteReport += '<span>' + item.CourtProcess + ': ' + item.Count + '</span></br>'
                    });
                    htmls += '<td>' + CourtPWAbsenteReport + '</td>';
                } else {
                    htmls += '<td></td>'; // If no data, insert empty td
                }
                ///////////////////////////////////////////////////////
                if (obj.CourtActionStatusReport.length > 0) {
                    $.each(obj.CourtActionStatusReport, function (index, item) {
                        CourtActionStatusReport += '<span>' + item.ActionStatus + ': ' + item.Count + '</span></br>'
                    });
                    htmls += '<td>' + CourtActionStatusReport + '</td>';
                } else {
                    htmls += '<td></td>'; // If no data, insert empty td
                }
                htmls += '</tr>';

            }
            $("#ReportData").html(htmls); // Assuming you have a tbody with id 'yourTableBody'
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
}

function GetUserList() {
    var id = $("#PresenceStatusFilter").val();
    $.ajax({
        type: "POST",
        url: "/STF/SecondaryUserMapDataForSelect",
        data: {
        },
        success: function (response) {
            var obj = response;
            $("#UserListFilter").empty();
            $("#UserListFilter").append("<option value=''>Select</option>");

            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#UserListFilter").append("<option value='" + value.Id + "'>" + value.name + "</option>");

                });
            }
        },
        error: function (error) {
            $("#UserListFilter").empty();
            $("#UserListFilter").append("<option value=''>Select</option>");
            // Handle error
        }
    });
}



//Tertiary user list 
$(document).on("change", "#UserListFilter", function () {
    var selectedValue = $(this).val();
    $.ajax({
        type: "POST",
        url: "/STF/TertiaryUserMapDataForSelect",
        data: {
            userid: selectedValue
        },
        success: function (response) {
            var obj = response;
            $("#UserListTertiaryFilter").empty();
            $("#UserListTertiaryFilter").append("<option value=''>Select</option>");

            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#UserListTertiaryFilter").append("<option value='" + value.Id + "'>" + value.name + "</option>");
                });
            }

            // Manually trigger the change event for #UserListTertiaryFilter
            $("#UserListTertiaryFilter").change();
        },
        error: function (error) {
            $("#UserListTertiaryFilter").empty();
            $("#UserListTertiaryFilter").append("<option value=''>Select</option>");
            // Handle error
        }
    });
});

