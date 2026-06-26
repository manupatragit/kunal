
var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var userCaseID = urlParams.get("userCaseID");
var MatterID = urlParams.get("MatterID");
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0, totpage=0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var Proname = "";
var PropAddress = "";
var Pwduserid = 0;
var courtActionStatusId = "";
var PwStatusId = "";
var hasPermission = false;
//var fcode = localStorage.getItem("FirmCode");

//This function will call during loading the Js page
$(document).ready(function () {
    // Bind keyup event to the HRMS ID input field
    $("#filterHrmsIdInput").on("keyup", function () {
        var hrmsId = $(this).val();
        $("#PwDetailsFilter option").each(function () {
            if ($(this).text().includes('(' + hrmsId + ')')) {
                $(this).prop("selected", true);
                $('#PwDetailsFilter').trigger('change');
                return false;
            }
        });
    });

    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        GetProcessEntryTabularData();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        GetProcessEntryTabularData();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        GetProcessEntryTabularData();

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        isRenderPage = true;
        pageindex = setPageNo;
        GetProcessEntryTabularData();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    EditPermission();

    if (userCaseID != "External") {
        CaseDetailsByCaseId();
        ListOFPwdCaseMapUserForSelect();
    }

    if (userCaseID == "External") {
        $("#FilterRecord").toggle();
        $("#FilterRecord").is(":visible");
        $("#headerText").hide();
    }

    // GetProcessEntryTabularData();
    ListOFPwdUserForSelect();
    ListOFProcessDetailSelect();
    ListOFWitnessServiceStatusSelect();
    ListOFPWPresenceStatusSelect();
    GetUserList();

    $('#redirectOnPw').click(function () {
        $.ajax({
            type: "GET",
            url: '/'+fcode+"/STF/STFDashboard",
            success: function (response) {
                console.log("STFDashboard called successfully");
            },
            error: function (error) {
                console.error("Error calling STFDashboard:", error);
            }
        });
    });

    $("#toggleForm").click(function () {
        $("#stfform").toggle();
        if ($("#FilterRecord").is(":visible")) {
            $("#FilterRecord").hide();
        }
    });

    $("#toggleFormFilter").click(function () {
        $("#FilterRecord").toggle();
        if ($("#stfform").is(":visible")) {
            $("#stfform").hide();
        }
    });

});



function clickEvent() {
    $("#formSection").toggle();
}




//Get List of Pw Details list for select field End
function ListOFPwdUserForSelect() {
    
    $.ajax({
        type: "POST",
        url: "/STF/ListOFPwdUserForSelect",
        data: {}, 
        success: function (response) {
            var obj = response;
            var htmls = '';
            //$("#PwDetails").empty();
            $("#PwDetailsFilter").empty();
            //$("#PwDetails").append("<option value=''>Select</option>");        
            $("#PwDetailsFilter").append("<option value=''>Select</option>");
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                //    $("#PwDetails").append("<option value='" + value.PWId + "'>" + value.vRank + ' ' + value.vName + '(' + value.emloyeeCode +')'+  "</option>");
                    $("#PwDetailsFilter").append("<option value='" + value.PWId + "'>" + value.vRank + ' ' + value.vName + '(' + value.emloyeeCode + ')' + "</option>");
                });
            }
        },
        error: function (error) {
        }
    });

    return false;
}



function ListOFPwdCaseMapUserForSelect() {
    
    $.ajax({
        type: "POST",
        url: "/STF/ListOFPwdCaseMapUserForSelect",
        data: {
            'userCaseId': userCaseID
        },
        success: function (response) {
            var obj = response;
            var htmls = '';
            $("#PwDetails").empty();
            $("#PwDetails").append("<option value=''>Select</option>");
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#PwDetails").append("<option value='" + value.PWId + "'>" + value.vRank + ' ' + value.vName + '(' + value.emloyeeCode + ')' + "</option>");
                });
            }
        },
        error: function (error) {
        }
    });

    return false;
}



//Get List of Pw Details list for select field End 


//Get List of ProcessDetail list for select field Start
function ListOFProcessDetailSelect() {
    $.ajax({
        type: "POST",
        url: "/STF/ListOFCourtProcess",
        data: {},
        success: function (response) {
            var obj = response;
            var htmls = '';
            
            $("#TypeOfProcess").empty();
            $("#TypeOfProcessFilter").empty();
            $("#TypeOfProcess").append("<option value=''>Select</option>");
            $("#TypeOfProcessFilter").append("<option value=''>Select</option>");
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#TypeOfProcess").append("<option value='" + value.iid + "'>" + value.Process + "</option>");
                    $("#TypeOfProcessFilter").append("<option value='" + value.iid + "'>" + value.Process + "</option>");

                });
            }
        },
        error: function (error) {
        }
    });

    return false;
}

//Get List of ProcessDetail list for select field End



//Get List of ProcessDetail list for select field Start
function ListOFWitnessServiceStatusSelect() {
    $.ajax({
        type: "POST",
        url: "/STF/ListOFWitnessServiceStatus",
        data: {},
        success: function (response) {
            var obj = response;
            var htmls = '';
            $("#Servicestatus").empty();
            $("#Servicestatus").append("<option value=''>Select</option>");
            $("#ServicestatusFilter").empty();
            $("#ServicestatusFilter").append("<option value=''>Select</option>");
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#Servicestatus").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                    $("#ServicestatusFilter").append("<option value='" + value.iid + "'>" + value.Status + "</option>");

                });
            }
        },
        error: function (error) {
        }
    });

    return false;
}

//Get List of ProcessDetail list for select field End


//Get List of ListOFPWPresenceStatus list for select field Start
function ListOFPWPresenceStatusSelect() {
    $.ajax({
        type: "POST",
        url: "/STF/ListOFPWPresenceStatus",
        data: {},
        success: function (response) {
            var obj = response;
            var htmls = '';
            $("#PresenceStatus").empty();
            $("#PresenceStatus").append("<option value=''>Select</option>");

            $("#PresenceStatusFilter").empty();
            $("#PresenceStatusFilter").append("<option value=''>Select</option>");
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    $("#PresenceStatus").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                    $("#PresenceStatusFilter").append("<option value='" + value.iid + "'>" + value.Status + "</option>");

                });
            }
        },
        error: function (error) {
        }
    });

    return false;
}

//Get List of ListOFPWPresenceStatus  for select field End

//Validate service status
function validateServicestatus() {

    if ($('#Servicestatus').val() == "1") {
        $('#reason').attr('readonly', 'readonly');
        $('#reason').val("");
    }
    else if ($('#Servicestatus').val() == "" || $('#Servicestatus').val() == null) {
        $('#reason').attr('readonly', 'readonly');
        $('#reason').val("");
    }
    else {
        $('#reason').prop('readonly', false);
    }
}
//End validate service status

// Get  List of PWCourtActionStatus for select field start
function PresenceStatusList() {
    
    var id = $("#PresenceStatus").val();
    //if (id == 1) {
    //    $("#PresntId").hide();
    //}
    //else {
    //    $("#PresntId").show();

    //}
    if (id == 2) {
        $('#PwAbsentReason').attr('readonly', 'readonly');
        $('#absentHide').hide();
        $('#AbsentActionHide').hide();
        $("#PresntId").show();

        $('#PwAbsentReason').val("");
    }
    else if (id == "" || id == null) {
        $('#PwAbsentReason').attr('readonly', 'readonly');
        $('#PwAbsentReason').val("");
        $('#absentHide').show();
        $('#AbsentActionHide').show();
        $('#otherReasonPresent').val("");

        
    }
    else {
        $('#PwAbsentReason').prop('readonly', false);
        $('#absentHide').show();
        $('#AbsentActionHide').show();
        $("#PresntId").hide();
        $('#otherReasonPresent').val("");

    }
    if (id == "" || id == null) {
        $("#PresentProceeding").empty().append("<option value=''>Select</option>");
        $("#ActionByCourt").empty().append("<option value=''>Select</option>");
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/STF/ListOFPWCourtActionStatus",
        data: {
            id: id,
        },
        success: function (response) {
            var obj = response;
            if (id == 1) {
                $("#PresentProceeding").empty().append("<option value=''>Select</option>");
                $("#ActionByCourt").empty().append("<option value=''>Select</option>");
                $.each(obj, function (index, value) {
                    $("#ActionByCourt").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                });
            } else { // Assuming the 'else' part should populate 'PresentProceeding' dropdown
                $("#ActionByCourt").empty().append("<option value=''>Select</option>");
                $("#PresentProceeding").empty().append("<option value=''>Select</option>");
                $.each(obj, function (index, value) {
                    $("#PresentProceeding").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                });
            }
        },
        error: function (error) {
            // Handle error
        }
    });
    OtherReasonCheck();
}


// Get  List of PWCourtActionStatus for select field start For Filter
function PresenceStatusListFilter() {
    
    var id = $("#PresenceStatusFilter").val();
    if (id == "" || id == null) {
        $("#PresentProceedingFilter").empty().append("<option value=''>Select</option>");
        $("#ActionByCourtFilter").empty().append("<option value=''>Select</option>");
    }
    $.ajax({
        type: "POST",
        url: "/STF/ListOFPWCourtActionStatus",
        data: {
            id: id,
        },
        success: function (response) {
            var obj = response;
            if (id == 1) {
                $("#PresentProceedingFilter").empty().append("<option value=''>Select</option>");
                $("#ActionByCourtFilter").empty().append("<option value=''>Select</option>");
                $.each(obj, function (index, value) {
                    $("#ActionByCourtFilter").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                });
            } else { // Assuming the 'else' part should populate 'PresentProceeding' dropdown
                $("#ActionByCourtFilter").empty().append("<option value=''>Select</option>");
                $("#PresentProceedingFilter").empty().append("<option value=''>Select</option>");
                $.each(obj, function (index, value) {
                    $("#PresentProceedingFilter").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                });
            }
        },
        error: function (error) {
            // Handle error
        }
    });
}


// Get  List of PWCourtActionStatus for select field start


//ClearForm To reset the value start
function clearForm() {
    //$("#caseDetail").val("");
    $("#IssueDate").val("");
    $("#PwDetails").val("");
    $("#TypeOfProcess").val("");
    $("#EvidenceDate").val("");
    $("#Servicestatus").val("");
    $("#reason").val("");
    $("#PresenceStatus").val("");
    $("#PwAbsentReason").val("");
    $("#ActionByCourt").val("");
    $("#PresentProceeding").val("");
    $("#Note").val("");
    $("#otherReasonAbsent").val("");
    $("#otherReasonPresent").val("");


}
//ClearForm To reset the value End


// Save Form Data Start
function SaveProcessEntryFormData() {
    
    //PresenceStatus
    var caseDetail = DOMPurify.sanitize($("#caseDetail").val());
    var IssueDate = $("#IssueDate").val();
    var PwDetails = $("#PwDetails").val();
    var TypeOfProcess = $("#TypeOfProcess").val();
    var EvidenceDate = $("#EvidenceDate").val();
    var Servicestatus = $("#Servicestatus").val();
    var reason = $("#reason").val();
    var PresenceStatus = $("#PresenceStatus").val();
    var PwAbsentReason = $("#PwAbsentReason").val();
    var ActionByCourt = $("#ActionByCourt").val();
    var PresentProceeding = $("#PresentProceeding").val();
    var otherReasonAbsent = $("#otherReasonAbsent").val();
    var otherReasonPresent = $("#otherReasonPresent").val();
    var Note = $("#Note").val();
    var updatedBy = "0"; // Assuming this is a default value, change as needed

    var courtActionStatusId = null;
    if (PresenceStatus == "1") {
        courtActionStatusId = ActionByCourt;
    } else if (PresenceStatus == "2") {
        courtActionStatusId = PresentProceeding;
    }

    if (caseDetail == "" || caseDetail == null) {
        alert("Please enter the case detail.");
        $('#caseDetail').focus();
        return false;
    }
    if (IssueDate == "" || IssueDate == null) {
        alert("Please select the IssueDate.");
        $('#IssueDate').focus();
        return false;
    }
    if (PwDetails == "" || PwDetails == null) {
        alert("Please select the PwDetails.");
        $('#PwDetails').focus();
        return false;
    }
    if (Servicestatus == "2") {
        
        if (reason == "" || reason == null) {
            alert("Please enter the not serve reason.");
            $('#reason').focus();
            return false;

        }



    }
    if (PresenceStatus == "1") {
        if (PwAbsentReason == "" || PwAbsentReason == null) {
            alert("Please enter the PW  absent reason.");
            $('#PwAbsentReason').focus();
            return false;

        }

        else if (ActionByCourt == "" || ActionByCourt == null) {
            alert("Please select  the action by court case of absence.");
            $('#ActionByCourt').focus();
            return false;
        }
        if (courtActionStatusId == "4") {
            if (otherReasonAbsent == "" || otherReasonAbsent == null) {
                alert("Please enter the absent other reason.");
                $('#otherReasonAbsent').focus();
                return false;
            }
        }
    }
    if (PresenceStatus == "2") {

        if (PresentProceeding == "" || PresentProceeding == null) {
            alert("Please select the pw present then proceeding.");
            $('#PresentProceeding').focus();
            return false;
        }
        if (courtActionStatusId == "9") {
            if (otherReasonPresent == "" || otherReasonPresent == null) {
                alert("Please enter the Present other reason.");
                $('#otherReasonPresent').focus();
                return false;
            }

        }

    }
        openload();

        $.ajax({
            type: "POST",
            url: "/STF/SaveProcessEntry",
            data: {
                iid: 0,
                matterId: MatterID,
                masterCaseId: userCaseID,
                caseDetails: caseDetail,
                issueDate: IssueDate,
                courtProcessId: TypeOfProcess,
                evidenceDate: EvidenceDate,
                seriviceStatusId: Servicestatus,
                notServedReason: reason,
                pWPresenceStatusId: PresenceStatus,
                absentReason: PwAbsentReason,
                courtActionStatusId: courtActionStatusId,
                note: Note,
                updatedBy: updatedBy,
                PwDetails: PwDetails,
                otherReasonAbsent: otherReasonAbsent,
                otherReasonPresent: otherReasonPresent
            },
            success: function (response) {
                if (response == "This master ID has already been added.") {
                    alert("This master ID has already been added.");
                }
                else {
                    clearForm();
                    alert("Process Entry Detail Added successfully.");
                    var obj = response;
                    if (obj.length > 0) {
                    }
                    isRenderPage = false;
                    GetProcessEntryTabularData();
                }


                closeload();
                // Handle the success response if needed
            },
            error: function (error) {
                closeload();

                // Handle error
            }
        });
    }



    //Get Process entry tabular data 


function GetProcessEntryTabularData() {

        openload();
        var searchuserId = ""
        var secondaryUser = $("#UserListFilter").val();
        var UserListTertiaryFilter = $("#UserListTertiaryFilter").val();
        if (UserListTertiaryFilter == null || UserListTertiaryFilter == "") {
            searchuserId = secondaryUser;
        }
        else {
            searchuserId = UserListTertiaryFilter;
        }

        var casesearch = $("#caseDetailFilter").val();
        var mastercaseid = "";
        var issudatefrm = $("#IssueDateFrm").val();
        var issudateto = $("#IssueDateTo").val();
        var pwdetailid = $("#PwDetailsFilter").val();
        var courtprocessid = $("#TypeOfProcessFilter").val();
        var evidencedatefrm = $("#evidanceDateFrm").val();
        var evidencedateto = $("#evidanceDateto").val();
        var servicestatusid = $("#ServicestatusFilter").val();
        var presenceStatusid = $("#PresenceStatusFilter").val();
        var ActionByCourt = $("#ActionByCourtFilter").val();
        var PresentProceeding = $("#PresentProceedingFilter").val();

        var courtactionid = null;
        if (presenceStatusid == 1) {
            courtactionid = ActionByCourt;
        } else if (presenceStatusid == 2) {
            courtactionid = PresentProceeding;
        }
        if (mastercaseid == null || mastercaseid == "") {
            mastercaseid = 0;
        }
        if (pwdetailid == null || pwdetailid == "") {
            pwdetailid = 0;
        }
        if (courtprocessid == null || courtprocessid == "") {
            courtprocessid = 0;
        }
        if (servicestatusid == null || servicestatusid == "") {
            servicestatusid = 0;
        }
        if (presenceStatusid == null || presenceStatusid == "") {
            presenceStatusid = 0;
        }
        if (courtactionid == null || courtactionid == "") {
            courtactionid = 0;
        }



        $.ajax({
            type: "POST",
            url: "/STF/ProcessEntryTabularData",
            data: {
                searchuserId: searchuserId,
                casesearch: casesearch,
                mastercaseid: mastercaseid,
                issudatefrm: issudatefrm,
                issudateto: issudateto,
                pwdetailid: pwdetailid,
                courtprocessid: courtprocessid,
                evidencedatefrm: evidencedatefrm,
                evidencedateto: evidencedateto,
                servicestatusid: servicestatusid,
                presenceStatusid: presenceStatusid,
                courtactionid: courtactionid,
                pageNumber: pageindex,
                pageSize: pagesize,
            },
            success: function (response) {
                var obj = response;
                var htmls = '';
                document.querySelector(".pagination").style.display = "none";

                if (obj.length > 0) {
                    document.querySelector(".pagination").style.display = "flex";

                    $.each(obj, function (index, value) {

                        if (index === 0) {

                            firstvalue = value.RowId;

                        }
                        var totdata = value.TotalRecord;
                        
                        if (index === (length - 3)) {
                            var totalRecord = value.TotalRecord;
                            $('#totRecordData').text(" (" + totalRecord + ")");

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
                                $('#prev').css("display", "block");
                            }
                            else {
                                $('#next').css("display", "block");
                            }
                            if (pageindex == 1) {
                                $('#prev').css("display", "none");
                            }
                            else {
                                $('#prev').css("display", "block");
                            }

                            if (isRenderPage == false) {
                                totalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }



                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;

                            //    var totdata = value.TotalRecord;
                            //    var totpage = 0;
                            //    if (value.TotalRecord > 0) {
                            //        pnext = parseInt(pnext) + 1;
                            //        if (pnext == 0) pnext = 1;

                            //        pprev = parseInt(pageno) - 1;
                            //        if (pprev == 0) pprev = 1;
                            //        totpage = parseInt(totdata) / parseInt(pagesize);

                            //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //            totpage = parseInt(totpage) + 1;
                            //        }

                            //        $("#pagnumvalue").val(totpage);

                            //    }

                            //    var tfot = '';
                            //    // $("#exportrecords").val(value.TotalRecord);
                            //    tfot += '<div class="row"><div class="col-md-6"><ul>'
                            //    tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                            //    if (value.TotalRecord <= length) {

                            //    }
                            //    else if (pageno == 1) {

                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'

                            //    }

                            //    else {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                            //    }

                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'

                            //    }


                            //    tfot += '</ul></div>'
                            //    tfot += '<div class="col-md-6"><ul class="pull-right"><div class="btn-group dropup "><a href="javascript:void()" class=" dropdown-toggle form-control selctInputFormat " style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action Selected</a><ul class="dropdown-menu settingaction " style="margin-left: -50px;"><li><a href="javascript:void()" id="oexlcel" title="Export to Excel">Export to Excel</a></li></ul></div> </ul ></div >'
                            //    $("#ptfooter").html("");
                            //    $("#ptfooter").html(tfot);
                            //}
                        }


                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.UserDetails + '</td>' +
                            '<td>' + value.Casedetails + '</td>' +
                            '<td>' + value.issueDate + '</td>' +
                            '<td>' + value.PWdetails + '</td>' +
                            '<td>' + value.CourtProcess + '</td>' +
                            '<td>' + value.Evidencedate + '</td>' +
                            '<td>' + value.Servicestatus + '</td>' +
                            '<td>' + value.NotServedReason + '</td>' +
                            '<td>' + value.PWPresenceStatus + '</td>' +
                            '<td>' + value.Absentreason + '</td>' +
                            '<td>' + value.CourtAction + '</td>' +
                            '<td>' + value.otherReason + '</td>' +
                            '<td>' + value.PresentotherReason + '</td>' +

                            '<td>' + value.Note + '</td>' +
                            '<td>' +
                            '<span id="ProcessDetailById"  style="cursor:pointer;" data-id="' + value.iid + '"   data-toggle="modal" data-target="#UpdatePWProcessdata" title="Update Process Detail" ><img src="/newassets/img/edit-icon.png" /></span>' + '';



                        if (hasPermission) {
                            htmls += '<span id="deleteProcessByid" style=" color:black; cursor:pointer;" data-id="' + value.iid + '"  title="Delete process detail list data" ><img src="/newassets/img/deletecasesingle-icon.png" /></span>';
                        }


                        htmls += '</td>' +
                            '</tr>';


                    });

                    $('#bindSTFpwdData').html(htmls);
                } else {
                    $("#ptfooter").html("");
                    htmls += '<tr>' +
                        '<td colspan="15" style="text-align: center;">Data Not Found</td>' +
                        '</tr>';

                    $('#bindSTFpwdData').html(htmls);
                }
                closeload();
            },
            error: function (error) {
                // Handle error response
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
    //$("#UserListFilter").on("change", function () {
    //    


    //    console.log("Selected value: " + selectedValue);
    //});


    //Pagination Section Start for table 
    //$(document).on('click', '#getdatabypagenum', function () {


    //    ppageindex = $("#pagnumvalue").val();

    //    if (ppageindex != "undefined") {
    //        pageindex = ppageindex;
    //        if (Math.sign(ppageindex) == 1) {
    //            var ppageindesx = $("#sotopage").text();

    //            if (ppageindex <= parseInt(ppageindesx)) {
    //                openload();
    //                GetProcessEntryTabularData();
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //                closeload();
    //                return false;
    //            }
    //        }
    //    }
    //});

    //$(document).on('click', '#getdatabypagenumNext', function () {



    //    if (pageindex != "undefined") {
    //        pageindex = pageindex + 1;

    //        GetProcessEntryTabularData();
    //    }
    //    else {
    //        alert("Please enter a valid page number.");
    //        closeload();
    //        return false;
    //    }


    //});

    //$(document).on('click', '#getdatabypagenumPrev', function () {



    //    if (pageindex != "undefined") {
    //        pageindex = pageindex - 1;

    //        GetProcessEntryTabularData();
    //    }
    //    else {
    //        alert("Please enter a valid page number.");
    //        closeload();
    //        return false;
    //    }


    //});

    //Pagination End


    //Clear Form Filter

    function ClearFilter() {
        $("#UserListFilter").val("");
        $("#caseDetailFilter").val("");
        $("#mastercaseid").val("");
        $("#IssueDateFrm").val("");
        $("#IssueDateTo").val("");
        $("#PwDetailsFilter").val("");
        $("#TypeOfProcessFilter").val("");
        $("#evidanceDateFrm").val("");
        $("#evidanceDateto").val("");
        $("#ServicestatusFilter").val("");
        $("#PresenceStatusFilter").val("");
        $("#ActionByCourtFilter").val("");
        $("#PresentProceedingFilter").val("");
        $("#filterHrmsIdInput").val("");
        $("UserListTertiaryFilter").val("");
        $("#UserListTertiaryFilter").empty();
        $("#UserListTertiaryFilter").append("<option value=''>Select</option>");
        isRenderPage = false;
        GetProcessEntryTabularData();
    }
    //End Clear Form Filter


    //Delate the user record from table through item= @iid
    $(document).on('click', '#deleteProcessByid', function () {
        if (window.confirm("Are you sure you want to Delete?")) {
            openload();
            var id = $(this).data('id');
            $.ajax({
                type: "POST",
                url: "/STF/ProcessEntryListRemoveById",
                data: {
                    iid: id,
                },
                success: function (response) {
                    alert("Data deleted successfully.");
                    isRenderPage =false;
                    GetProcessEntryTabularData();
                    closeload();
                },
                error: function (error) {
                    closeload();

                }
            });
        } else {

        }


    })

    //End Delete section
    function CallAllFunction() {
        ListOFPwdUserForSelectModal();
        ListOFProcessDetailSelectModal();
        ListOFWitnessServiceStatusSelectModal();
        ListOFPWPresenceStatusSelectModal();

    }


    var PwDetailsModal = "";
    var TypeOfProcessModal = "";
    var ServicestatusModal = "";
    var PresenceStatusModal = "";
    var otherReason = "";
    var otherReasonPresent = "";

    var iid;

$(document).on('click', '#ProcessDetailById', function () {
    
        openload();

        $("#PresntIdModal").show();
        $("#otherNotesModal").hide();
        $("#PresentProceedingModal").empty();
        $("#PresentProceedingModal").append("<option value=''>Select</option>");
        $("#ActionByCourtModal").empty();
        $("#ActionByCourtModal").append("<option value=''>Select</option>");
        var id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: "/STF/ProcessEntryDetailsId",
            data: {
                iid: id,
            },
            success: function (response) {
                var IssueformattedDate = null;
                var EvidenceDateformattedDate = null;


                var obj = response;
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {
                        iid = value.iid;
                        $("#caseDetailModal").val(value.CaseDetails);


                        if (value.IssueDate == "" || value.IssueDate == null) {

                        } else {

                            var dateParts = value.IssueDate.split('/');
                            var IssueDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                            IssueformattedDate = formatDate(IssueDate);

                        }

                        otherReason = value.otherReason;
                        otherReasonPresent = value.otherReasonPresent

                        $("#IssueDateModal").val(IssueformattedDate);
                        PwDetailsModal = value.PWId;
                        TypeOfProcessModal = value.CourtProcessId;



                        if (value.EvidenceDate == "" || value.EvidenceDate == null) {

                        } else {

                            var dateParts = value.EvidenceDate.split('/');
                            var EvidenceDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                            EvidenceDateformattedDate = formatDate(EvidenceDate);

                        }

                        $("#EvidenceDateModal").val(EvidenceDateformattedDate);
                        ServicestatusModal = value.SeriviceStatusId;

                        $("#reasonModal").val(value.NotServedReason);
                        PresenceStatusModal = value.PWPresenceStatusId;
                        $("#PwAbsentReasonModal").val(value.AbsentReason);
                        $("#NoteModal").val(value.Note);


                        if (value.PWPresenceStatusId == 1) {
                            PwStatusId = value.PWPresenceStatusId;
                            courtActionStatusId = value.CourtActionStatusId;

                        }
                        else if (value.PWPresenceStatusId == 2) {
                            courtActionStatusId = value.CourtActionStatusId;
                            PwStatusId = value.PWPresenceStatusId;
                        }
                        else {

                        }
                    });

                    CallAllFunction();

                }



                closeload();
            },
            error: function (error) {
                closeload();

            }
        });

    })


    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adjust for zero-indexed months
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    //Modal Binding For Update 

    //Get List of Pw Details list for select field End
    function ListOFPwdUserForSelectModal() {

        $.ajax({
            type: "POST",
            url: "/STF/ListOFPwdUserForSelect",
            data: {},
            success: function (response) {
                var obj = response;
                var htmls = '';
                $("#PwDetailsModal").empty();

                $("#PwDetailsModal").append("<option value=''>Select</option>");
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {
                        $("#PwDetailsModal").append("<option value='" + value.PWId + "'>" + value.vName + '(' + value.vRank + ')' + "</option>");
                        $("#PwDetailsFilter").append("<option value='" + value.PWId + "'>" + value.vName + '(' + value.vRank + ')' + "</option>");
                    });
                    $("#PwDetailsModal").val(PwDetailsModal);
                }
            },
            error: function (error) {
            }
        });

        return false;
    }

    function ListOFProcessDetailSelectModal() {
        $.ajax({
            type: "POST",
            url: "/STF/ListOFCourtProcess",
            data: {

            },
            success: function (response) {
                var obj = response;
                var htmls = '';

                $("#TypeOfProcessModal").empty();
                $("#TypeOfProcessModal").append("<option value=''>Select</option>");
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {
                        $("#TypeOfProcessModal").append("<option value='" + value.iid + "'>" + value.Process + "</option>");

                    });
                    $("#TypeOfProcessModal").val(TypeOfProcessModal);
                }
            },
            error: function (error) {
            }
        });

        return false;
    }



    //Get List of ProcessDetail list for select field Start
    function ListOFWitnessServiceStatusSelectModal() {
        $.ajax({
            type: "POST",
            url: "/STF/ListOFWitnessServiceStatus",
            data: {},
            success: function (response) {
                var obj = response;
                $("#ServicestatusModal").empty();
                $("#ServicestatusModal").append("<option value=''>Select</option>");
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {
                        $("#ServicestatusModal").append("<option value='" + value.iid + "'>" + value.Status + "</option>");

                    });
                    $("#ServicestatusModal").val(ServicestatusModal);
                }
            },
            error: function (error) {
            }
        });

        return false;
    }

    //Get List of ListOFPWPresenceStatus list for select field Start
    function ListOFPWPresenceStatusSelectModal() {
        $.ajax({
            type: "POST",
            url: "/STF/ListOFPWPresenceStatus",
            data: {},
            success: function (response) {
                var obj = response;
                var htmls = '';
                $("#PresenceStatusModal").empty();
                $("#PresenceStatusModal").append("<option value=''>Select</option>");
                if (obj.length > 0) {
                    $.each(obj, function (index, value) {
                        $("#PresenceStatusModal").append("<option value='" + value.iid + "'>" + value.Status + "</option>");

                    });
                    $("#PresenceStatusModal").val(PresenceStatusModal);
                }
                PresenceStatusListModal();
            },
            error: function (error) {
            }
        });

        return false;
    }


    function PresenceStatusListModal() {

        var id = $("#PresenceStatusModal").val();
        $.ajax({
            type: "POST",
            url: "/STF/ListOFPWCourtActionStatus",
            data: {
                id: id,
            },
            success: function (response) {
                
                var obj = response;
                if (id == 1) {
                    $("#PresntIdModal").hide();
                    $("#HideModalAbsenceReason").show();
                    $("#HideModalAbsence").show();


                    $("#PresentProceedingModal").empty();
                    $("#PresentProceedingModal").append("<option value=''>Select</option>");
                    $("#ActionByCourtModal").empty();
                    $("#ActionByCourtModal").append("<option value=''>Select</option>");
                    $.each(obj, function (index, value) {
                        $("#ActionByCourtModal").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                    });
                    $("#ActionByCourtModal").val(courtActionStatusId)
                    if (courtActionStatusId == "4") {
                        $("#otherReasonAbsentModal").val(otherReason);
                    }
                    ModalOtherReasonCheck();
                }
                else {
                    $("#PresntIdModal").show();
                    $("#HideModalAbsenceReason").hide();
                    $("#HideModalAbsence").hide();
                    $("#ActionByCourtModal").empty();
                    $("#ActionByCourtModal").append("<option value=''>Select</option>");
                    $("#PresentProceedingModal").empty();
                    $("#PresentProceedingModal").append("<option value=''>Select</option>")
                    $.each(obj, function (index, value) {
                        $("#PresentProceedingModal").append("<option value='" + value.iid + "'>" + value.Status + "</option>");
                    });
                    $("#PresentProceedingModal").val(courtActionStatusId)
                    if (courtActionStatusId == "9") {
                        $("#otherReasonPresentModal").val(otherReasonPresent);
                    }
                    ModalOtherReasonCheck();

                }
            },
            error: function (error) {
                // Handle error
            }
        });
    }

    function hideProcessUpdateModal() {
        // Remove the modal backdrop
        //$("#UpdatePWProcessdata").hide(400, function () {
        //    // Code to execute after hiding the modal
        //    iid = 0;
        // clearFormModal();
        //});
    }

    function clearFormModal() {
        // $("#caseDetailModal").val("");
        $("#IssueDateModal").val("");
        $("#PwDetailsModal").val("");
        $("#TypeOfProcessModal").val("");
        $("#EvidenceDateModal").val("");
        $("#ServicestatusModal").val("");
        $("#reasonModal").val("");
        $("#PresenceStatusModal").val("");
        $("#PwAbsentReasonModal").val("");
        $("#NoteModal").val("");
        $("#PresentProceedingModal").val("");
        $("#ActionByCourtModal").val("");
        $("#otherReasonAbsentModal").val("");

    }


function UpdateProcessEntryDetails() {
    
        var caseDetail = $("#caseDetailModal").val();
        var IssueDate = $("#IssueDateModal").val();
        var PwDetails = $("#PwDetailsModal").val();
        var TypeOfProcess = $("#TypeOfProcessModal").val();
        var EvidenceDate = $("#EvidenceDateModal").val();
        var Servicestatus = $("#ServicestatusModal").val();
        var reason = $("#reasonModal").val();
        var PresenceStatus = $("#PresenceStatusModal").val();
        var PwAbsentReason = $("#PwAbsentReasonModal").val();
        var ActionByCourt = $("#ActionByCourtModal").val();
        var PresentProceeding = $("#PresentProceedingModal").val();
        var otherReasonAbsent = $("#otherReasonAbsentModal").val();
        var otherReasonPresent = $("#otherReasonPresentModal").val();

        
        var Note = $("#NoteModal").val();


        var courtActionStatusId = null;
        if (PresenceStatus == "1") {
            courtActionStatusId = ActionByCourt;
        } else if (PresenceStatus == "2") {
            courtActionStatusId = PresentProceeding;
        }

        if (caseDetail == "" || caseDetail == null) {
            alert("Please enter the case detail.");
            $('#caseDetailModal').focus();
            return false;
        }
        if (IssueDate == "" || IssueDate == null) {
            alert("Please select the IssueDate.");
            $('#IssueDateModal').focus();
            return false;
        }
        if (PwDetails == "" || PwDetails == null) {
            alert("Please select the PwDetails.");
            $('#PwDetailsModal').focus();
            return false;
        }
        if (Servicestatus == "2") {
            if (reason == "" || reason == null) {
                alert("Please enter the not serve reason.");
                $('#ServicestatusModal').focus();
                return false;


            }


        }
        if (PresenceStatus == "1") {
            otherReasonPresent = "";

            if (PwAbsentReason == "" || PwAbsentReason == null) {
                alert("Please enter the PW  absent reason.");
                $('#PwAbsentReasonModal').focus();
                return false;

            }
            else if (ActionByCourt == "" || ActionByCourt == null) {
                alert("Please select  the action by court case of absence.");
                $('#ActionByCourtModal').focus();
                return false;

            }
            if (courtActionStatusId == "4") {
                
                if (otherReasonAbsent == "" || otherReasonAbsent == null) {
                    alert("Please enter the absent other reason.");
                    $('#otherReasonAbsentModal').focus();
                    return false;
                }
            }
            else {
                otherReasonAbsent = "";
            }
        }
        if (PresenceStatus == "2") {
            otherReasonAbsent = "";
            PwAbsentReason = "";
            if (PresentProceeding == "" || PresentProceeding == null) {
                alert("Please select  the pw present then proceeding.");
                $('#PresentProceedingModal').focus();
                return false;

            }
            if (courtActionStatusId == "9") {
                
                if (otherReasonPresent == "" || otherReasonPresent == null) {
                    alert("Please enter the present other reason.");
                    $('#otherReasonPresentModal').focus();
                    return false;
                }
            }
            else {
                otherReasonPresent = "";
            }
        }


        openload();


        $.ajax({
            type: "POST",
            url: "/STF/UpdateProcessEntry",
            data: {
                iid: iid,
                matterId: MatterID,
                masterCaseId: userCaseID,
                caseDetails: caseDetail,
                issueDate: IssueDate,
                courtProcessId: TypeOfProcess,
                evidenceDate: EvidenceDate,
                seriviceStatusId: Servicestatus,
                notServedReason: reason,
                pWPresenceStatusId: PresenceStatus,
                absentReason: PwAbsentReason,
                courtActionStatusId: courtActionStatusId,
                note: Note,
                updatedBy: "1",
                PwDetails: PwDetails,
                otherReasonAbsent: otherReasonAbsent,
                PresentOtherReason: otherReasonPresent
            },
            success: function (response) {

                //clearForm();
                alert("Process Entry Detail Updated successfully.");
                var obj = response;
                isRenderPage = false;
                GetProcessEntryTabularData();
                hideProcessUpdateModal();
                closeload();




                // Handle the success response if needed
            },
            error: function (error) {
                closeload();

                // Handle error
            }
        });
    }


    //Download Tabular data Start


$(document).on('click', '#oexlcel', function () {

        openload();
        var searchuserId = "";
        var UserListTertiaryFilter = $("#UserListTertiaryFilter").val();
        var secondaryUser = $("#UserListFilter").val();
        if (UserListTertiaryFilter == null || UserListTertiaryFilter == "") {
            searchuserId = secondaryUser;
        }
        else {
            searchuserId = UserListTertiaryFilter;
        }
        var casesearch = $("#caseDetailFilter").val();
        var mastercaseid = "";
        var issudatefrm = $("#IssueDateFrm").val();
        var issudateto = $("#IssueDateTo").val();
        var pwdetailid = $("#PwDetailsFilter").val();
        var courtprocessid = $("#TypeOfProcessFilter").val();
        var evidencedatefrm = $("#evidanceDateFrm").val();
        var evidencedateto = $("#evidanceDateto").val();
        var servicestatusid = $("#ServicestatusFilter").val();
        var presenceStatusid = $("#PresenceStatusFilter").val();
        var ActionByCourt = $("#ActionByCourtFilter").val();
        var PresentProceeding = $("#PresentProceedingFilter").val();

        var courtactionid = null;
        if (presenceStatusid == 1) {
            courtactionid = ActionByCourt;
   
        } else if (presenceStatusid == 2) {
            courtactionid = PresentProceeding;
        }
        if (mastercaseid == null || mastercaseid == "") {
            mastercaseid = 0;
        }
        if (pwdetailid == null || pwdetailid == "") {
            pwdetailid = 0;
        }
        if (courtprocessid == null || courtprocessid == "") {
            courtprocessid = 0;
        }
        if (servicestatusid == null || servicestatusid == "") {
            servicestatusid = 0;
        }
        if (presenceStatusid == null || presenceStatusid == "") {
            presenceStatusid = 0;
        }
        if (courtactionid == null || courtactionid == "") {
            courtactionid = 0;
        }
        window.location = encodeURI("/STF/STFProcessEntryFormDataSearchExportExcel?searchuserId=" + escape(searchuserId) + "&casesearch=" + escape(casesearch) + "&mastercaseid=" + escape(mastercaseid)
            + "&issudatefrm=" + escape(issudatefrm) + "&issudateto=" + escape(issudateto) + "&pwdetailid=" + escape(pwdetailid) + "&courtprocessid=" + escape(courtprocessid) + "&evidencedatefrm=" + escape(evidencedatefrm) + "&evidencedateto=" + escape(evidencedateto) + "&servicestatusid=" + escape(servicestatusid) + "&presenceStatusid=" + escape(presenceStatusid) + "&courtactionid=" + escape(courtactionid));
        alert("Download Successful: Excelsheet");
        closeload();

    })
    //Download Tabular data End






    //Check Other Reason 
    function OtherReasonCheck() {
        
        if ($("#PresenceStatus").val() == "1" && $("#ActionByCourt").val() == "4") {
            //$("#PresntId").hide();
            $("#otherNotes").show();
            $("#PresentAnyOther").hide();

        }
        else if ($("#PresenceStatus").val() == "2" && $("#PresentProceeding").val() == "9") {
            $("#PresentAnyOther").show();
            // $("#PresntId").show();
            $("#otherNotes").hide();
            $("#otherReasonAbsent").val("");

        }

        else {
            $("#PresentAnyOther").hide();
            // $("#PresntId").show();
            $("#otherNotes").hide();
            $("#otherReasonAbsent").val("");

        }



    }


    function ModalOtherReasonCheck() {
        if ($("#PresenceStatusModal").val() == "1" && $("#ActionByCourtModal").val() == "4") {
            $("#PresntIdModal").hide();
            $("#otherNotesModal").show();
            $("#PresentAnyOtherModal").hide();
            $("#HideModalAbsence").show();
            $("#HideModalAbsenceReason").show();



        }
        else if ($("#PresenceStatusModal").val() == "2") {
            if ($("#PresenceStatusModal").val() == "2" && $("#PresentProceedingModal").val() == "9") {
                $("#PresntIdModal").show();
                $("#PresentAnyOtherModal").show();
                $("#otherNotesModal").hide();
                $("#HideModalAbsence").hide();
                $("#HideModalAbsenceReason").hide();
            }
            else {
                $("#PresntIdModal").show();
                $("#PresentAnyOtherModal").hide();
                $("#otherNotesModal").hide();
                $("#HideModalAbsence").hide();
                $("#HideModalAbsenceReason").hide();
            }
        }
        else {
            $("#PresntIdModal").hide();
            $("#otherNotesModal").hide();
            $("#PresentAnyOtherModal").hide();
            $("#HideModalAbsence").show();
            $("#HideModalAbsenceReason").show();
        }




        //$("#otherReasonAbsentModal").val("");

    }


    function ProcessEntryDashBoardReport() {
        $.ajax({
            type: "POST",
            // url: "/STF/checkEmployeeCodeExist",
            url: "/STF/ProcessReport",
            data: {
                'issueDateFrom': $("#IssueDateFrom").val(),
                'issueDateTo': $("#IssueDateToReport").val(),
            },
            success: function (response) {
                
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



function EditPermission() {

    $.ajax({
        type: "POST",
        url: "/STF/StfPermissionuserValidateEditPermission",
        data: {
            'roleiid': "ProcessEntry"
        },
        success: function (response) {
            var obj = response;
            if (obj <= 0) {
                $('#btnclear').hide();
                $('#btnsubmit').hide();
                $('#btnsubmitModal').hide();
                $('#btnclearModal').hide();
                hasPermission = false;


            }
            else {
                $('#btnclear').show();
                $('#btnsubmit').show();
                $('#btnsubmitModal').show();
                $('#btnclearModal').show();
                hasPermission = true;




            }
            isRenderPage = false;
            GetProcessEntryTabularData();
        },
        error: function (error) {


        }
    });




}

function CaseDetailsByCaseId() {
    $.ajax({
        type: "POST",
        url: "/STF/CaseDetailsByCaseId",
        data: {
            caseid: userCaseID,

        },
        success: function (response) {
            $("#caseDetail").val("");
            if (response.length > 0) {
                $("#caseDetail").val(response[0].Case_Diary);

            }
            else {
                $("#caseDetail").val("");

            }

        },
        error: function (error) {
            $("#caseDetail").val("");

            // Handle error
        }
    });
}
//Filter Data Of process entry details
function GetProcessFilterEntryTabularData() {
    openload();
    var searchuserId = ""
    var secondaryUser = $("#UserListFilter").val();
    var UserListTertiaryFilter = $("#UserListTertiaryFilter").val();
    if (UserListTertiaryFilter == null || UserListTertiaryFilter == "") {
        searchuserId = secondaryUser;
    }
    else {
        searchuserId = UserListTertiaryFilter;
    }

    var casesearch = $("#caseDetailFilter").val();
    var mastercaseid = "";
    var issudatefrm = $("#IssueDateFrm").val();
    var issudateto = $("#IssueDateTo").val();
    var pwdetailid = $("#PwDetailsFilter").val();
    var courtprocessid = $("#TypeOfProcessFilter").val();
    var evidencedatefrm = $("#evidanceDateFrm").val();
    var evidencedateto = $("#evidanceDateto").val();
    var servicestatusid = $("#ServicestatusFilter").val();
    var presenceStatusid = $("#PresenceStatusFilter").val();
    var ActionByCourt = $("#ActionByCourtFilter").val();
    var PresentProceeding = $("#PresentProceedingFilter").val();

    var courtactionid = null;
    if (presenceStatusid == 1) {
        courtactionid = ActionByCourt;
    } else if (presenceStatusid == 2) {
        courtactionid = PresentProceeding;
    }
    if (mastercaseid == null || mastercaseid == "") {
        mastercaseid = 0;
    }
    if (pwdetailid == null || pwdetailid == "") {
        pwdetailid = 0;
    }
    if (courtprocessid == null || courtprocessid == "") {
        courtprocessid = 0;
    }
    if (servicestatusid == null || servicestatusid == "") {
        servicestatusid = 0;
    }
    if (presenceStatusid == null || presenceStatusid == "") {
        presenceStatusid = 0;
    }
    if (courtactionid == null || courtactionid == "") {
        courtactionid = 0;
    }



    $.ajax({
        type: "POST",
        url: "/STF/ProcessEntryTabularData",
        data: {
            searchuserId: searchuserId,
            casesearch: casesearch,
            mastercaseid: mastercaseid,
            issudatefrm: issudatefrm,
            issudateto: issudateto,
            pwdetailid: pwdetailid,
            courtprocessid: courtprocessid,
            evidencedatefrm: evidencedatefrm,
            evidencedateto: evidencedateto,
            servicestatusid: servicestatusid,
            presenceStatusid: presenceStatusid,
            courtactionid: courtactionid,
            pageNumber: 1,
            pageSize: 10,
        },
        success: function (response) {
            var obj = response;
            var htmls = '';
            document.querySelector(".pagination").style.display = "none";

            if (obj.length > 0) {
                document.querySelector(".pagination").style.display = "flex";

                $.each(obj, function (index, value) {

                    if (index === 0) {

                        firstvalue = value.RowId;

                    }
                    var totdata = value.TotalRecord;

                    if (index === (length - 3)) {


                        var totalRecord = value.TotalRecord;
                        $('#totRecordData').text(" (" + totalRecord + ")");

                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
                            $('#prev').css("display", "block");
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (pageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            totalRecordCount = totpage;
                            renderPagination(pageindex, totpage);
                        }


                        //var pnext = pageindex;
                        //var pprev = pageindex;
                        //var pageno = pageindex;

                        //var totdata = value.TotalRecord;
                        //var totpage = 0;
                        //if (value.TotalRecord > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;

                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(pagesize);

                        //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }

                        //    $("#pagnumvalue").val(totpage);

                        //}

                        //var tfot = '';
                        //// $("#exportrecords").val(value.TotalRecord);
                        //tfot += '<div class="row"><div class="col-md-6"><ul>'
                        //tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                        //if (value.TotalRecord <= length) {

                        //}
                        //else if (pageno == 1) {

                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'

                        //}

                        //else {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                        //}

                        //if (pageno < totpage) {
                        //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'

                        //}


                        //tfot += '</ul></div>'
                        //tfot += '<div class="col-md-6"><ul class="pull-right"><div class="btn-group dropup "><a href="javascript:void()" class=" dropdown-toggle form-control selctInputFormat " style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action Selected</a><ul class="dropdown-menu settingaction " style="margin-left: -50px;"><li><a href="javascript:void()" id="oexlcel" title="Export to Excel">Export to Excel</a></li></ul></div> </ul ></div >'
                        //$("#ptfooter").html("");
                        //$("#ptfooter").html(tfot);
                    }


                    htmls += '<tr>' +
                        '<td>' + value.RowId + '</td>' +
                        '<td>' + value.UserDetails + '</td>' +
                        '<td>' + value.Casedetails + '</td>' +
                        '<td>' + value.issueDate + '</td>' +
                        '<td>' + value.PWdetails + '</td>' +
                        '<td>' + value.CourtProcess + '</td>' +
                        '<td>' + value.Evidencedate + '</td>' +
                        '<td>' + value.Servicestatus + '</td>' +
                        '<td>' + value.NotServedReason + '</td>' +
                        '<td>' + value.PWPresenceStatus + '</td>' +
                        '<td>' + value.Absentreason + '</td>' +
                        '<td>' + value.CourtAction + '</td>' +
                        '<td>' + value.otherReason + '</td>' +
                        '<td>' + value.PresentotherReason + '</td>' +

                        '<td>' + value.Note + '</td>' +
                        '<td>' +
                        '<span id="ProcessDetailById" style="color:black; cursor:pointer;" data-id="' + value.iid + '"   data-toggle="modal" data-target="#UpdatePWProcessdata" title="Update Process Detail" ><img src="/newassets/img/edit-icon.png" /></span>' + '';



                    if (hasPermission) {
                        htmls += '<span id="deleteProcessByid" style=" color:black; cursor:pointer;" data-id="' + value.iid + '"  title="Delete process detail list data" ><img src="/newassets/img/deletecasesingle-icon.png" /></span>';
                    }


                    htmls += '</td>' +
                        '</tr>';


                });

                $('#bindSTFpwdData').html(htmls);
            } else {
                $("#ptfooter").html("");
                htmls += '<tr>' +
                    '<td colspan="15" style="text-align: center;">Data Not Found</td>' +
                    '</tr>';

                $('#bindSTFpwdData').html(htmls);
            }
            closeload();
        },
        error: function (error) {
            // Handle error response
        }
    });
}

function redirectToDashboard() {
    var newUrl = "/" + fcode + "/STF/StfReports";
    window.location.href = newUrl;
}

/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbers").html(paginationHtml);
    isRenderPage = true;
}