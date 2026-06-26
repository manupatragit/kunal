var currentPage = 1;
var pageSize = 10;
var totalPages = 0;

var currentConsumerPage = 1;
var consumerPageSize = 10;
var totalConsumerPages = 0;

let currentPageContingent = 1;
let totalPagesContingent = 1;
let pageSizeContingent = 10;
if (localStorage.getItem("filedbyField") == "") {
    localStorage.setItem("filedbyField", "1");
}


$(document).ready(function () {
   
    var getFileValue = localStorage.getItem("filedbyField");
    $("#divfiledby").val(getFileValue);
    //if (getFileValue == "1") {
    //    $("#divfiledby").trigger("change");
    //    $("#bomFilterTitle").text("Against the Bank");
    //    $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Against the Bank</b> Details");
    //    $("#againstTheBankTable").show();
    //    $("#againstTheBankSection").show();
    //    $("#consumerCasesTable").hide();
    //    $("#consumerCasesSection").hide();
    //    $("#contingentLiabilityTable").hide();
    //    $("#contingentLiabilitySection").hide();
    //    $("#ColumnSelectionopenagainstTheBank").show();
    //    $("#ColumnSelectionopenconsumerCases").hide();
    //    $("#ColumnSelectionopencontingentLiability").hide();
    //    loadAgainstBankData("", "", "", "", "", "", "", "", "", 1);
    //}
    
   

    var formData = new FormData();
    var benchname = "";
    if ($("#drpcourtname").val() == "CF") {
        benchname = $("#drpCfBench").val();
    }
    var divdistrict = $("#divSCHCDistrict").val();
    if (divdistrict == null) {
        divdistrict = "";
    }
    var drpcourtname = $("#drpcourtname").val();
    if (drpcourtname == null) {
        drpcourtname = "";
    }
    var drpcourtnameDC = $("#drpcourtnameDC").val();
    if (drpcourtnameDC == null) {
        drpcourtnameDC = "";
    }
    var drpdistrictcourtname = $("#drpdistrictcourtname").val();
    if (drpdistrictcourtname == null) {
        drpdistrictcourtname = "";
    }
    
    var filedby = localStorage.getItem("filedbyField");
    var drpcourtcomplexestb = filedby;//$("#divfiledby").val();;

    var drpcompestbcourt = $("#drpcompestbcourt").val();
    if (drpcompestbcourt == null) {
        drpcompestbcourt = "";
    }
    var PetionerName = $("#Petitionerfilter").val();
    var RespondentName = $("#Respondentfilter").val();
    var Advocate = $("#advocatefilter").val();
    var courtcaseno = $("#lcasefiltercaseno").val();
    //$("#divfiledby").val();
    if (getFileValue == "1") {
        RespondentName = "Bank of Maharashtra";
        $("#bomFilterTitle").text("Against the Bank");
        $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Against the Bank</b> Details");
        $("#againstTheBankTable").show();
        $("#ColumnSelectionopenagainstTheBank").show();
        $("#ColumnSelectionopenconsumerCases").hide();
        $("#ColumnSelectionopencontingentLiability").hide();
        $("#againstTheBankSection").show();
        $("#consumerCasesTable").hide();
        $("#consumerCasesSection").hide();
        $("#contingentLiabilityTable").hide();
        $("#contingentLiabilitySection").hide();
        loadAgainstBankData(divdistrict, drpcourtname);
    }
    if (getFileValue == "2") {
        RespondentName = "Bank of Maharashtra";
        $("#bomFilterTitle").text("Consumer Cases");
        $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Consumer Cases</b> Details");
        $("#againstTheBankTable").hide();
        $("#consumerCasesSection").show();
        $("#againstTheBankSection").hide();
        $("#consumerCasesTable").show();
        $("#contingentLiabilitySection").hide();
        $("#contingentLiabilityTable").hide();
        $("#ColumnSelectionopenagainstTheBank").hide();
        $("#ColumnSelectionopenconsumerCases").show();
        $("#ColumnSelectionopencontingentLiability").hide();
        loadConsumerCases(divdistrict, drpcourtname);
    }
    if (getFileValue == "3") {
        RespondentName = "Bank of Maharashtra";
        $("#bomFilterTitle").text("Contingent Liability");
        $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Contingent Liability</b> Details");
        $("#againstTheBankTable").hide();
        $("#againstTheBankSection").hide();
        $("#consumerCasesTable").hide();
        $("#consumerCasesSection").hide();
        $("#contingentLiabilityTable").show();
        $("#contingentLiabilitySection").show();
        $("#ColumnSelectionopenagainstTheBank").hide();
        $("#ColumnSelectionopenconsumerCases").hide();
        $("#ColumnSelectionopencontingentLiability").show();
        loadContingentLiability(divdistrict, drpcourtname);
    }
   
});
var nhdSortVal = "";
var nhdSortVal = "";
FillCourtType();
function FillCourtType() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCourt",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var option = '<option value="">--Select Court Detail--</option>';
            $.each(response, function (i, a) {
                option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
            });
            $("#divSCHCDistrict").append(option);//End of foreach Loop
            //console.log(response);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
/*Add court name details*/
//function AddCourtName(strcourttype) {
//    $.ajax({
//        type: "POST",
//        url: "/AddCase/AddCourtNameByCourtType?courttype=" + strcourttype,
//        dataType: "json",
//        success: function (data) {
//            $("#drpcourtname").append("<option value='0'>-Select Place Of Court-</option>");
//            $("#drpcourtnameDC").append("<option value='0'>Select Your State / UT</option>");
//            for (var i = 0; i < data.length; i++) {
//                if (strcourttype != "3") {
//                    $("#drpcourtname").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
//                }
//                else {
//                    $("#drpcourtnameDC").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
//                }
//            }
//        },
//        error: function (data) {
//        }
//    });
//}
/*Dropdown court name*/
function divdrpcourtnameDC() {
    $("#drpdistrictcourtname").empty();
    var selectedText = "";
    // document.getElementById('drpcourtcomplexestb').style.display = 'none';
    document.getElementById('divDistrict').style.display = 'none';
    document.getElementById('divcompestbcourt').style.display = 'none';
    //  document.getElementById('drpcourtcomplexestb').value = "";
    document.getElementById('divDistrict').value = "";
    document.getElementById('drpcompestbcourt').value = "";
    if (document.getElementById('drpcourtnameDC').value != "0") {
        document.getElementById('divDistrict').style.display = 'block';
        var skillsSelect = document.getElementById("drpcourtnameDC");
        var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
        $.ajax({
            type: "POST",
            url: "/AddCase/AddDistrictByCourt?courttype=" + document.getElementById('drpcourtnameDC').value,
            dataType: "json",
            success: function (data) {
                $("#drpdistrictcourtname").append("<option value='0'>Please Select District</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpdistrictcourtname").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
/*Change district */
function divdistrictchange() {
    //  document.getElementById('drpcourtcomplexestb').style.display = 'none';
    document.getElementById('divcompestbcourt').style.display = 'none';
    //   document.getElementById('drpcourtcomplexestb').value = "";
    document.getElementById('drpcompestbcourt').value = "";
    if (document.getElementById('drpdistrictcourtname').value != "0") {
        //document.getElementById('drpcourtcomplexestb').style.display = 'block';
        //document.getElementById('drpcourtcomplexestb').value = '';
        //$.ajax({
        //    type: "POST",
        //    url: "/Firm/FillCourtComplexSTB",
        //    dataType: "json",
        //    success: function (data) {
        //        $("#drpcourtcomplexestb").empty();
        //        $("#drpcourtcomplexestb").append("<option value=''>Please Select</option>");
        //        for (var i = 0; i < data.length; i++) {
        //            $("#drpcourtcomplexestb").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
        //        }
        //    },
        //    error: function (data) {
        //    }
        //});
        drpcourtcompestbchange();
    }

}
/*Add bench details*/
function benchadd(crtid) {
    $("#drpCfBench").empty();
    $.ajax({
        type: "POST",
        url: "/AddCase/AddBenchtype?bench=" + crtid,
        dataType: "json",
        success: function (data) {
            $("#drpCfBench").append("<option value=''>-ALL-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpCfBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Get bench details*/
function getbench(crtid) {
    var str = "";
    benchadd(crtid);
}
/*Change court drp*/
function drpcourtcompestbchange() {
    var courtype = "";
    var districttype = "";
    var compesttype = "1";
    $('#drpcompestbcourt').empty();
    document.getElementById('divcompestbcourt').style.display = 'none';
    document.getElementById('drpcompestbcourt').value = "";
    //if (document.getElementById('drpcourtcomplexestb').value != "") {
    courtype = document.getElementById('drpcourtnameDC').value;
    districttype = document.getElementById('drpdistrictcourtname').value;
    //   compesttype = document.getElementById('drpcourtcomplexestb').value;
    $.ajax({
        type: "POST",
        url: "/AddCase/AddCourtComplexEstType?crttype=" + courtype + "&dsttype=" + districttype + "&compesttype=" + compesttype,
        dataType: "json",
        success: function (data) {
            $("#drpcompestbcourt").append("<option value=''>Please Select District Court</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpcompestbcourt").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
            }
        },
        error: function (data) {
        }
    });
    document.getElementById('divcompestbcourt').style.display = 'unset';
    //  }
}
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    /*Diplay SCHC district div*/

    //$(document).on("click", "#bomFilterButton", function () {

    //    var fcode = localStorage.getItem("FirmCode");
    //    var filedby = $("#divfiledby").val();

    //    if (filedby == "1") {
    //        window.location.href = "/" + fcode + "/CW/AddAgainstTheBank";
    //    }
    //    else if (filedby == "2") {
    //        window.location.href = "/" + fcode + "/CW/AddConsumerCases";
    //    }
    //    else if (filedby == "3") {
    //        window.location.href = "/" + fcode + "/CW/AddContingentLiability";
    //    }
    //});



    function divSCHCDistrictdisplay() {
        try {
            document.getElementById('drpCfBench').style.value = '';
            document.getElementById('HighCourt').style.display = 'none';
            //document.getElementById('drpcourtcomplexestb').style.display = 'none';
            document.getElementById('divDistrict').style.display = 'none';
            document.getElementById('DistrictCourt').style.display = 'none';
            document.getElementById('divcompestbcourt').style.display = 'none';
            document.getElementById('drpcourtnameDC').style.display = "none";
            document.getElementById('divCFBench').style.display = 'none';
            $("#drpdistrictcourtname").val("");
            $('#drpcourtname').empty();
            $('#drpcourtnameDC').empty();
            document.getElementById('drpcourtnameDC').style.border = "unset";
            // document.getElementById('drpcourtcomplexestb').style.border = "unset";
            document.getElementById('divcompestbcourt').style.border = "unset";
            //if (document.getElementById('divSCHCDistrict').value == "2" || document.getElementById('divSCHCDistrict').value == "4" || document.getElementById('divSCHCDistrict').value == "5") {
            //    document.getElementById('HighCourt').style.display = 'block';
            //    AddCourtName(document.getElementById('divSCHCDistrict').value);
            //}
            //else if (document.getElementById('divSCHCDistrict').value == "3") {
            //    document.getElementById('DistrictCourt').style.display = 'block';
            //    document.getElementById('drpcourtnameDC').style.display = "block";
            //    AddCourtName('3');
            //}
        }
        catch (ex) {
            alert(ex.message);
        }
    }
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loaddatalist(ppageindex);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    var chksflag = true;
    /*Paginate*/
    $(document).on('click', '#paginate', function () {
        ppageindex = $(this).attr("index");
        loaddatalist(ppageindex);
    });
    var fcode = localStorage.getItem("FirmCode");
    $("#drpcompestbcourt,#drpcourtnameDC,#drpdistrictcourtname,#CaseStatus,#sortdate").change(function () {
        loaddatalist(pageindex);
    });
    $("#divCFBench").change(function () {
        loaddatalist(pageindex);
    });
    $("#drpcourtname").change(function () {
        var valuest = $(this).val();
        if (valuest == "CF") {
            $("#divCFBench").show();
            benchadd(valuest);
        }
        else {
            $("#divCFBench").hide();
        }
        loaddatalist(pageindex);
    });
    /*SCHC district div*/
    $("#divSCHCDistrict").change(function () {

        divSCHCDistrictdisplay();
        loaddatalist(pageindex);
    });
    /*Archive cases*/
    $("#archivecase").click(function () {
        selectedID = [];
        archivecase();
        function archivecase() {
            var result = confirm("Are you sure to archive case?");
            if (result) {
                $('input:checkbox.checkboall').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/CW/AddCasetoArchive',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            alert("Case archived Successfully");
                            $('#select_all').prop('checked', false);
                            loaddatalist(pageindex);
                            closeload();
                        },
                        error: function () {
                            alert('Error!');
                            closeload();
                        }
                    });
                }
                else {
                    alert("Please select a row to archive case.");
                    closeload();
                }
            }
        }
    });
    /*Open notes model*/
    $(document).on("click", "#OpenNotesModal", function () {
        $("#OtherDetailstxt").val("");
        var ids = $(this).attr("data-caseid");
        var caseids = $(this).attr("data-usercaseid");
        $("#UpdateOtherDetails").attr("data-case", caseids);
        $("#UpdateOtherDetails").attr("data", ids);
        bindOtherDetails(ids);
        $('#myModalCaseNotes').modal({ show: true });
    });
    /*Bind case detail by case id*/
    function bindOtherDetails(caseids) {
        var formData = new FormData();
        formData.append("caseid", caseids);
        var html6 = "";
        $.ajax(
            {
                type: "POST",
                url: "/CW/MyKaseDocNotesDetails", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $("#otherdetailsContent").html('');
                    var obj = JSON.parse(response);
                    if (obj.data == "[]") {
                        $("#otherdetailsContentNA").show();
                    }
                    else {
                        $("#otherdetailsContentNA").hide();
                    }
                    $.each(obj.data, function (i, a) {
                        $("#inputFormatTextArea").val(a.Notes);
                        html6 += "<tr>";
                        html6 += "<td>" + a.Notes + "</td>";
                        html6 += "<td><i class='glyphicon glyphicon-trash' id='RemoveOtherDetails' data-id='" + a.Iid + "' title='Remove Details'></i> </td>";
                        html6 += "</tr>";
                        $("#otherdetailsContent").html(html6).attr("ids", a.Iid);
                    });
                    return false;
                },
                failure: function (response) {
                    alert(data.responseText);
                },
                error: function (response) {
                    alert(data.responseText);
                }
            });
    }
    /*Remove other details*/
    $(document).on("click", "#RemoveOtherDetails", function () {
        var noteid = $(this).attr("data-id");
        var formData = new FormData();
        formData.append("noteid", noteid);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/CW/RemoveCaseNotes", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var data = JSON.parse(response);
                    if (String(data.Status) == "true") {
                        alert("Other details removed successfully.");
                        var ids = $("#OpenNotesModal").attr("data-caseid");
                        bindOtherDetails(ids);
                        closeload();
                    }
                    else {
                        alert("something went wrong!");
                        closeload();
                    }
                },
                failure: function (response) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (response) {
                    alert(data.responseText);
                    closeload();
                }
            });
    });
    /*Update other details*/
    $("#UpdateOtherDetails").click(function () {
        var details = $("#OtherDetailstxt").val();
        if (details == "") {
            alert("please enter other details");
            return false;
        }
        var caseidsids = $(this).attr("data");
        var formData = new FormData();
        formData.append("detaiils", details);
        formData.append("caseid", caseidsids);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/CW/UploadNotesByCaseId", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var data = JSON.parse(response);
                    if (String(data.Status) == "true") {
                        $("#OtherDetailstxt").val("");
                        alert("Other details added successfully.");
                        bindOtherDetails(caseidsids);
                        closeload();
                    }
                    else {
                        alert("something went wrong!");
                        closeload();
                    }
                },
                failure: function (response) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (response) {
                    alert(data.responseText);
                    closeload();
                }
            });
    });
    /*Select all live cases*/
    $(document).on("click", "#select_all", function () {
        $(".checkboall").prop('checked', $(this).prop('checked'));
    });
    /*Open order time line*/
    $(document).on("click", "#openordertimeline", function () {
        openload();
        var ids = $(this).attr("data-caseid");
        var caseids = $(this).attr("data-usercaseid");
        var hidcaseno = $(this).attr("data-caseno");
        var hidcasename = $(this).attr("data-casename");
        var hidparty = $(this).attr("data-party");
        var url = "/CW/OrderTimeline?status=true&UserCaseid=" + ids + "&caseid=" + caseids;
        $('.mymodelstime').load(url, function (result) {
            $('#myModaltimeline').modal({ show: true });
            $(".hidcaseno").html(hidcaseno);
            $(".hidcasename").html(hidcasename);
            $(".hidparty").html(hidparty);
            closeload();
        });
    });
    /*Export to excel*/
    $("#exporttoexcel").click(async function () {
        //$("#myModalexport").modal({ show: true });
        //var totalRecord = $("#exportrecords").val();
        //var pagesize = 500;
        //var recordsection = totalRecord / pagesize;
        //recordsection = recordsection + 1;
        //var html = '';
        //for (var i = 1; i < recordsection; i++) {
        //    html += '<tr>';
        //    html += '<td>Page No:' + i + ' </td>';
        //    html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
        //    html += '</tr>';
        //}
        //$("#printexport").html(html);
        $("#Exporttype").val('');
        $("#Exporttype").val("Excel");
        var yes = await validatePageLink(event, 'CreateCase', 'Export');
        if (yes) {
            $("#myModalexport").modal({ show: true });
            var totalRecord = $("#exportrecords").val();
            $("#printexport").html('');
            var pagesize = 0;
            if (roleids == 1) {
                pagesize = 500;
            } else {
                pagesize = 200;
            }
            var recordsection = totalRecord / pagesize;
            recordsection = recordsection + 1;
            var html = '<option value="" selected>Please Select</option>';
            for (var i = 1; i < recordsection; i++) {
                //html += '<tr>';
                //html += '<td>Page No:' + i + ' </td>';
                //html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
                //html += '</tr>';
                html += '<option value="' + i + '" > ' + i + ' </option>';

            }
            $("#printexport").html(html);
            //$("#printexport").html(html);
        }
    });
    /*Export to excel*/
    async function validatePageLink(event, PageName, Action) {
        event.preventDefault(); // Prevents the default action (navigation)
        const result = await validatePage(PageName, Action);
        if (result) {
            if (event.target.href.indexOf("/") > 0) {
                window.location.href = event.target.href;
            } else {
                return true;
            }
        } else {
            $("#unauthorisedmodal").modal("show");
            return false; // Always return false to stop default link behavior
        }

    }

    function validatePage(PageName, Action) {
        var formData = new FormData();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/firm/validatepage?PageValue=" + PageName + "&ActionName=" + Action,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response == "True") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                error: function () {
                    resolve(false);  // Resolve false in case of an error
                }
            });
        });
    }
    $(document).on("click", "#exporttoexcelfile", function () {

        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        var divdistrict = $("#divSCHCDistrict").val();
        if (divdistrict == null) {
            divdistrict = "";
        }
        var drpcourtname = $("#drpcourtname").val();
        if (drpcourtname == null) {
            drpcourtname = "";
        }
        var drpcourtnameDC = $("#drpcourtnameDC").val();
        if (drpcourtnameDC == null) {
            drpcourtnameDC = "";
        }
        var drpdistrictcourtname = $("#drpdistrictcourtname").val();
        if (drpdistrictcourtname == null) {
            drpdistrictcourtname = "";
        }
        //var drpcourtcomplexestb = $("#drpcourtcomplexestb").val();
        //if (drpcourtcomplexestb == null) {
        //    drpcourtcomplexestb = "";
        //}
        var drpcompestbcourt = $("#drpcompestbcourt").val();
        if (drpcompestbcourt == null) {
            drpcompestbcourt = "";
        }
        var PetionerName = $("#Petitionerfilter").val();
        var RespondentName = $("#Respondentfilter").val();
        var Advocate = $("#advocatefilter").val();
        var courtcaseno = $("#lcasefiltercaseno").val();
        var CourtStatus = $("#lstatus").val();
        var fromdt = $("#nextheringfilterdate").val();
        var todt = $("#nexthearingfilterdateTo").val();
        var casename = $("#lcasenamefilter").val();
        if (fromdt != "" && todt != "") {
            pagesize = 10;
        }
        else {
            pagesize = 10;
        }
        var filedby = $("#divfiledby").val();
        if (filedby == "1") {
            RespondentName = "Bank of Maharashtra";
        }
        var searchany = "1";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        window.location = encodeURI("/CW/ExportToExcelBOMCustomDashboard?status=true&courttype=" + escape(divdistrict) +
            "&courtname=" + escape(drpcourtname) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) +
            "&casename=" + casename + "&searchany=" + escape(searchany) + "&CaseStatus=" + escape(CourtStatus) + "&ditrictcourt=" + escape(drpcompestbcourt) +
            "&advocate=" + escape(Advocate) + "&CourtCaseNo=" + escape(courtcaseno) + "&stateid=" + escape(drpcourtnameDC) +
            "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&courtcompestname=" + escape(drpdistrictcourtname) +
            "&PetionerName=" + escape(PetionerName) + "&RespondentName=" + escape(RespondentName) + "&sortdate=" + escape(nhdSortVal));
    });

    /*Export to pdf*/
    $("#exporttopdf").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffile" pageno="' + i + '" type="pdf">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
    $(document).on("click", "#exporttopdffile", function () {
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        var divdistrict = $("#divSCHCDistrict").val();
        if (divdistrict == null) {
            divdistrict = "";
        }
        var drpcourtname = $("#drpcourtname").val();
        if (drpcourtname == null) {
            drpcourtname = "";
        }
        var drpcourtnameDC = $("#drpcourtnameDC").val();
        if (drpcourtnameDC == null) {
            drpcourtnameDC = "";
        }
        var drpdistrictcourtname = $("#drpdistrictcourtname").val();
        if (drpdistrictcourtname == null) {
            drpdistrictcourtname = "";
        }
        //var drpcourtcomplexestb = $("#drpcourtcomplexestb").val();
        //if (drpcourtcomplexestb == null) {
        //    drpcourtcomplexestb = "";
        //}
        var drpcompestbcourt = $("#drpcompestbcourt").val();
        if (drpcompestbcourt == null) {
            drpcompestbcourt = "";
        }
        var PetionerName = $("#Petitionerfilter").val();
        var RespondentName = $("#Respondentfilter").val();
        var Advocate = $("#advocatefilter").val();
        var courtcaseno = $("#lcasefiltercaseno").val();
        var CourtStatus = $("#lstatus").val();
        var fromdt = $("#nextheringfilterdate").val();
        var todt = $("#nexthearingfilterdateTo").val();
        var casename = $("#lcasenamefilter").val();
        if (fromdt != "" && todt != "") {
            pagesize = 10;
        }
        else {
            pagesize = 10;
        }
        var filedby = $("#divfiledby").val();
        if (filedby == "1") {
            RespondentName = "Bank of Maharashtra";
        }
        var searchany = "1";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;

        window.location = encodeURI("/CW/ExportToPDFBOMCustomDashboard?status=true&courttype=" + escape(divdistrict) +
            "&courtname=" + escape(drpcourtname) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) +
            "&casename=" + casename + "&searchany=" + escape(searchany) + "&CaseStatus=" + escape(CourtStatus) + "&ditrictcourt=" + escape(drpcompestbcourt) +
            "&advocate=" + escape(Advocate) + "&CourtCaseNo=" + escape(courtcaseno) + "&stateid=" + escape(drpcourtnameDC) +
            "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&courtcompestname=" + escape(drpdistrictcourtname) +
            "&PetionerName=" + escape(PetionerName) + "&RespondentName=" + escape(RespondentName) + "&sortdate=" + escape(nhdSortVal));
    });
    $("#searchcase").click(function () {
        var casename = $("#casename").val();
        var searchany = $("#searchany").val();
        if (casename == "") {
            alert("Please enter case name");
            $("#casename").focus();
            return false;
        }
        $("#clearsearch").show();
        loaddatalist(pageindex);
    });
    $("#clearsearch").click(function () {
        $("#clearsearch").hide();
        $("#casename").val("");
        loaddatalist(pageindex);
    });
    $("#searchhearing").click(function () {
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        if (fromdt == "") {
            alert("Please select next hearing from date");
            $("#hearingfrom").focus();
            return false;
        }
        if (todt == "") {
            alert("Please select next hearing to date");
            $("#hearingto").focus();
            return false;
        }
        $("#clearhearing").show();
        loaddatalist(pageindex);
    });
    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });
    $("#clearhearing").click(function () {
        $("#clearhearing").hide();
        $("#hearingfrom").val("");
        $("#hearingto").val("");
        loaddatalist(pageindex);
    });
    /*next hearing date filter*/
    $("#nexthearingdsearch").click(function () {
        var fromd = $("#nextheringfilterdate").val();
        var tod = $("#nexthearingfilterdateTo").val();
        mnexthearingflag = 0;
        if (fromd == "") {
            alert("Please select filter from date");
            $("#nextheringfilterdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to date");
            $("#nexthearingfilterdateTo").focus();
            return false;
        }
        loaddatalist(1);
        $("#nexthearingcleardate").css("display", "block");
        $("#nexthearingdesc").show();
        $("#nexthearingasc").hide();
    });

    $("#nexthearingcleardate").click(function () {
        $("#nextheringfilterdate").val("");
        $("#nexthearingfilterdateTo").val("");
        $("#nexthearingcleardate").css("display", "none");
        loaddatalist(1);
    });

    $("#nexthearingasc").click(function () {
        nhdSortVal = "asc";
        loaddatalist(pageindex);
        $("#nexthearingdesc").show();
        $("#nexthearingasc").hide();
    });
    $("#nexthearingdesc").click(function () {
        nhdSortVal = "desc";
        loaddatalist(pageindex);
        $("#nexthearingdesc").hide();
        $("#nexthearingasc").show();
    });

    $("#nexthearingrefresh").click(function () {
        nhdSortVal = "";
        $("#nextheringfilterdate").val(String.empty);
        $("#nexthearingfilterdateTo").val(String.empty);
        $("#nexthearingasc").show();
        $("#nexthearingdesc").hide();
        loaddatalist(pageindex);
    });
    /*status filter*/
    $("#lstatus").change(function () {
        loaddatalist(pageindex);
    });
    /*for table serch filter court case no*/
    $("#lcasesearchdatas").click(function () {
        var casefiltercasename = $("#lcasefiltercaseno").val();
        if (casefiltercasename == "") {
            alert("Please enter the case no.");
            $("#lcasefiltercaseno").focus();
            return false;
        }
        $("#lcaseclearnewsearchcase").css("display", "unset")
        loaddatalist(1);
    });
    $("#lcaseclearnewsearchcase").click(function () {
        $("#lcasefiltercaseno").val("");
        $("#lcaseclearnewsearchcase").css("display", "none");
        loaddatalist(1);
    });
    /*for table serch filter court case no*/
    $("#lcasenamesearchdatas").click(function () {
        var casefiltercasename = $("#lcasenamefilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the case name");
            $("#lcasenamefilter").focus();
            return false;
        }
        $("#lcasenameclearnewsearch").css("display", "unset")
        loaddatalist(1);
    });
    $("#lcasenameclearnewsearch").click(function () {
        $("#lcasenamefilter").val("");
        $("#lcasenameclearnewsearch").css("display", "none");
        loaddatalist(1);
    });
    /* Petioner search filter */
    $("#Petitionersearchdatas").click(function () {
        var casefiltercasename = $("#Petitionerfilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the petitioner name");
            $("#Petitionerfilter").focus();
            return false;
        }
        $("#Petitionerclearnewsearch").css("display", "unset")
        loaddatalist(1);
    });
    $("#Petitionerclearnewsearch").click(function () {
        $("#Petitionerfilter").val("");
        $("#Petitionerclearnewsearch").css("display", "none");
        loaddatalist(1);
    });

    /* Respondent search filter */
    $("#Respondentsearchdatas").click(function () {
        var casefiltercasename = $("#Respondentfilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the respondent name");
            $("#Respondentfilter").focus();
            return false;
        }
        $("#Respondentclearnewsearch").css("display", "unset")
        loaddatalist(1);
    });
    $("#Respondentclearnewsearch").click(function () {
        $("#Respondentfilter").val("");
        $("#Respondentclearnewsearch").css("display", "none");
        loaddatalist(1);
    });
    /*advocate filter*/
    $("#advocatesearchdatas").click(function () {
        var casefiltercasename = $("#advocatefilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the Advocate name");
            $("#advocatefilter").focus();
            return false;
        }
        $("#advocateclearnewsearch").css("display", "unset")
        loaddatalist(1);
    });
    $("#advocateclearnewsearch").click(function () {
        $("#advocatefilter").val("");
        $("#advocateclearnewsearch").css("display", "none");
        loaddatalist(1);
    });
    /*SCHC district div*/
    $("#divfiledby").change(function () {
        var selectedValue = $("#divfiledby").val();
        //alert(selectedValue);
        localStorage.setItem("filedbyField", selectedValue);
        loaddatalist(pageindex);
    });
    //loaddatalist(pageindex);
    /*Load data list*/
    function loaddatalist(pageindex) {
        
        var formData = new FormData();
        var benchname = "";
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        var divdistrict = $("#divSCHCDistrict").val();
        if (divdistrict == null) {
            divdistrict = "";
        }
        var drpcourtname = $("#drpcourtname").val();
        if (drpcourtname == null) {
            drpcourtname = "";
        }
        var drpcourtnameDC = $("#drpcourtnameDC").val();
        if (drpcourtnameDC == null) {
            drpcourtnameDC = "";
        }
        var drpdistrictcourtname = $("#drpdistrictcourtname").val();
        if (drpdistrictcourtname == null) {
            drpdistrictcourtname = "";
        }
        //var drpcourtcomplexestb = "1";
        //if (drpcourtcomplexestb == null) {
        //    drpcourtcomplexestb = "";
        //}
        var filedby = localStorage.getItem("filedbyField");
        var drpcourtcomplexestb = filedby;//$("#divfiledby").val();;

        var drpcompestbcourt = $("#drpcompestbcourt").val();
        if (drpcompestbcourt == null) {
            drpcompestbcourt = "";
        }
        var PetionerName = $("#Petitionerfilter").val();
        var RespondentName = $("#Respondentfilter").val();
        var Advocate = $("#advocatefilter").val();
        var courtcaseno = $("#lcasefiltercaseno").val();
         //$("#divfiledby").val();
        if (filedby == "1") {
            RespondentName = "Bank of Maharashtra";
            $("#bomFilterTitle").text("Against the Bank");
            $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Against the Bank</b> Details");
            $("#againstTheBankTable").show();
            $("#ColumnSelectionopenagainstTheBank").show();
            $("#ColumnSelectionopenconsumerCases").hide();
            $("#ColumnSelectionopencontingentLiability").hide();
            $("#againstTheBankSection").show();
            $("#consumerCasesTable").hide();
            $("#consumerCasesSection").hide();
            $("#contingentLiabilityTable").hide();
            $("#contingentLiabilitySection").hide();
            loadAgainstBankData(divdistrict, drpcourtname);
        }
        if (filedby == "2") {
            RespondentName = "Bank of Maharashtra";
            $("#bomFilterTitle").text("Consumer Cases");
            $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Consumer Cases</b> Details");
            $("#againstTheBankTable").hide();
            $("#consumerCasesSection").show();
            $("#againstTheBankSection").hide();
            $("#consumerCasesTable").show();
            $("#contingentLiabilitySection").hide();
            $("#contingentLiabilityTable").hide();
            $("#ColumnSelectionopenagainstTheBank").hide();
            $("#ColumnSelectionopenconsumerCases").show();
            $("#ColumnSelectionopencontingentLiability").hide();
            loadConsumerCases(divdistrict, drpcourtname);
        }
        if (filedby == "3") {
            RespondentName = "Bank of Maharashtra";
            $("#bomFilterTitle").text("Contingent Liability");
            $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Contingent Liability</b> Details");
            $("#againstTheBankTable").hide();
            $("#againstTheBankSection").hide();
            $("#consumerCasesTable").hide();
            $("#consumerCasesSection").hide();
            $("#contingentLiabilityTable").show();
            $("#contingentLiabilitySection").show();
            $("#ColumnSelectionopenagainstTheBank").hide();
            $("#ColumnSelectionopenconsumerCases").hide();
            $("#ColumnSelectionopencontingentLiability").show();
            loadContingentLiability(divdistrict, drpcourtname);
        }
        formData.append("courttype", divdistrict);
        formData.append("courtname", drpcourtname);
        formData.append("stateid", drpcourtnameDC);
        formData.append("districtid", drpdistrictcourtname);
        formData.append("courtcompestname", drpcourtcomplexestb);
        formData.append("ditrictcourt", drpcompestbcourt);
        formData.append("sortdate", nhdSortVal);
        formData.append("CaseStatus", $("#lstatus").val());
        var fromdt = $("#nextheringfilterdate").val();
        var todt = $("#nexthearingfilterdateTo").val();
        var casename = $("#lcasenamefilter").val();
        formData.append("pagenum", pageindex);
        if (fromdt != "" && todt != "") {
            pagesize = 10;
        }
        else {
            pagesize = 10;
        }
        formData.append("pagesize", pagesize);
        formData.append("hearingfrom", fromdt);
        formData.append("hearingto", todt);
        formData.append("casename", casename);
        formData.append("searchany", "0");
        formData.append("PetionerName", PetionerName);
        formData.append("RespondentName", RespondentName);
        formData.append("Advocate", Advocate);
        formData.append("CourtCaseNo", courtcaseno);
        //openload();
        var html3 = '';
        $("#AllCustomDashboardbind").html("");
        $("#ptfooterLitigation").html("");
        //var Licaselit = $.ajax({
        //    async: true,
        //    type: "POST",
        //    url: "/CW/CustomCaseList",
        //    dataType: 'json',
        //    data: formData,
        //    contentType: false,
        //    processData: false,
        //    success: function (response1) {
        //        $("#exportrecords").val(0);
        //        var length = response1.length;
        //        var qty = 0;
        //        if (length > 0) {
        //            $("#divalertlist tr").remove();
        //            $.each(response1, function (i, val) {
        //                if (i === 0) {
        //                    firstvalue = val.RowId;
        //                }
        //                if (i === (length - 1)) {
        //                    var pnext = pageindex;
        //                    var pprev = pageindex;
        //                    var pageno = pageindex;
        //                    var totdata = val.TotalRecord;
        //                    var totpage = 0;
        //                    if (val.TotalRecord > 0) {
        //                        pnext = parseInt(pnext) + 1;
        //                        if (pnext == 0) pnext = 1;
        //                        pprev = parseInt(pageno) - 1;
        //                        if (pprev == 0) pprev = 1;
        //                        totpage = parseInt(totdata) / parseInt(pagesize);
        //                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
        //                            totpage = parseInt(totpage) + 1;
        //                        }
        //                        $("#pagnumvalue").attr("max", totpage);
        //                    }
        //                    var tfot = '';
        //                    $("#exportrecords").val(val.TotalRecord);
        //                    tfot += '<ul>'
        //                    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
        //                    tfot += '<li><span>|</span></li>'
        //                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
        //                    tfot += '<li><span>|</span></li>'
        //                    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
        //                    if (val.TotalRecord <= length) {
        //                    }
        //                    else if (pageno == 1) {
        //                    }
        //                    else if (pageno == totpage) {
        //                        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
        //                    }
        //                    else {
        //                        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
        //                    }
        //                    if (pageno < totpage) {
        //                        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
        //                    }
        //                    tfot += '</ul>'
        //                    $("#ptfooterLitigation").html("");
        //                    $("#ptfooterLitigation").html(tfot);
        //                }
        //                qty = qty + 1;
        //                var RowId = val.RowId;
        //                var TotalRecord = val.TotalRecord;
        //                var casenotfoundcolorstyle = "";
        //                if (String(val.CaseName) == "Case not found") {
        //                    val.CaseName = "";
        //                    casenotfoundcolorstyle = "background: #eb7373;color: white;font-size: 14px;background: #d55555;text-align: center;color: White;padding: 10px 0;";
        //                }
        //                html3 += '<tr>'
        //                html3 += '<td class="lsrno">' + val.RowId + '</td>';
        //                html3 += '<td class="lPetitionerName">' + val.PetitionerName + '</td>';
        //                html3 += '<td class="lRespondentName">' + val.RespondentName + '</td>';
        //                html3 += '<td class="caseno">' + val.CaseDiary + '</td>';
        //                if (val.CaseName == "" || val.CaseName == null || val.CaseName == "null") {
        //                    html3 += '<td class="casename">&nbsp;</td>';
        //                }
        //                else {
        //                    if (val.CaseName.length > 20) {
        //                        html3 += '<td class="casename">'
        //                        html3 += '<span class="comment more" style="">' + val.CaseName.substring(0, 20) + '</span>'
        //                        html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:blue;cursor:pointer"> more</span>'
        //                        html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 240px;border-radius: 10px;left:38%;">'
        //                        html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
        //                        html3 += '' + val.CaseName + ''
        //                        html3 += '</div>'
        //                        html3 += '</td>'
        //                    }
        //                    else {
        //                        html3 += '<td class="casename" style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
        //                    }
        //                }
        //                if (val.CourtName != "0") {
        //                    html3 += '<td class="lcasecourtname">' + val.CourtName + '</td>';
        //                } else {
        //                    html3 += '<td class="lcasecourtname"></td>';
        //                }
        //                html3 += '<td class="courtorditrict">' + val.Court + '</td>';
        //                var testbenchname = val.BenchName;
        //                html3 += '<td class="lcourtcomplexestblish">' + val.CourtComplexCourtEstablishment + '</td>';
        //                html3 += '<td class="nexthearing">' + val.NextHearing + '</td>';
        //                html3 += '<td class="Lstatus">' + (val.Status == null ? "" : val.Status) + '</td>';
        //                if (val.Advocate == "" || val.Advocate == null || val.Advocate == "null") {
        //                    html3 += '<td class="ladvocate">&nbsp;</td>'
        //                }
        //                else {
        //                    if (val.Advocate.length > 20) {
        //                        html3 += '<td class="ladvocate">'
        //                        html3 += '<span class="comment more" style="">' + val.Advocate.substring(0, 20) + '</span>'
        //                        html3 += '<span data-toggle="collapse" data-target="#dtna' + qty + '" style="color:blue;cursor:pointer;position:relative;"> more</span>'
        //                        html3 += ' <div id="dtna' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 240px;border-radius: 10px;left:-80px;position:relative;">'
        //                        html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtna' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
        //                        html3 += '' + val.Advocate + ''
        //                        html3 += '</div>'
        //                        html3 += '</td>'
        //                    }
        //                    else {
        //                        html3 += '<td class="ladvocate"><span class="comment more" style="">' + val.Advocate + '</span></td>';
        //                    }
        //                }
        //                var mfilingdate = "";
        //                if (val.dUpdateDate == "01/01/1900 00:00:00") {
        //                    mfilingdate = "";
        //                } else {
        //                    mfilingdate = val.dUpdateDate;
        //                }
        //                html3 += '<td class="disposeddate">' + val.DisposedDate + '</td>';
        //                html3 += '<td class="zonename">' + val.BranchName + '</td>';
        //                // html3 += '<td class="casefilingdate">' + val.dUpdateDate + '</td>';
        //                html3 += '<td class="casefilingdate">' + formatDatetoIST(mfilingdate) + '</td>';
        //                html3 += '<td class="counselname">' + val.MatterName + '</td>';
        //                html3 += '</tr>'
        //            });
        //        } else {
        //            closeload();
        //            $("#ptfooterLitigation").html("");
        //            html3 += '<td colspan=11 align=center>Data Not Found</td>'
        //            html3 += '<tr>'
        //        }
        //        $("#AllCustomDashboardbind").html("");
        //        $("#AllCustomDashboardbind").html("").html(html3);
        //        closeload();
        //    },
        //    failure: function (data) {
        //        alert(data.responseText);
        //        closeload();
        //    },
        //    error: function (data) {
        //        alert(data.responseText);
        //        closeload();
        //    }
        //});
        //$.when(Licaselit).then(function (data, textStatus, jqXHR) {
        //    $("input:checkbox:not(:checked)").each(function () {
        //        var column = "table ." + $(this).attr("name");
        //        $(column).hide();
        //    });
        //    closeload();
        //    return false;
        //});
    }
    /*View case details*/
    $(document).on("click", "#viewmatter", function () {
        var fcode = localStorage.getItem("FirmCode");
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/CaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#unlinkcase", function () {
        var result = confirm("Are you sure to remove matter live update?");
        if (result) {
            openload();
            var formdata = new FormData();
            var token = $(this).attr("data-val");
            var usercase = $(this).attr("data-id");
            formdata.append("caseid", EncodeText(token));
            formdata.append("usercaseid", usercase);
            openload();
            $.ajax({
                async: true,
                url: '/api/matterApi/UnLinkCaseToCaseWatchFromLiveupdate',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: ' Matter live update removed successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#select_all').prop('checked', false);
                        loadflag = true;
                        loaddatalist(1);
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning!',
                            text: ' You are not Authotized to delete this Matter !',
                            type: 'error',
                            delay: 2000
                        });
                        closeload();
                    }
                },
                error: function () {
                    alert('Error!');
                    closeload();
                }
            });
        }
    });
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });

});


function openCustomPage() {
    var fcode = localStorage.getItem("FirmCode");
    var filedby = $("#divfiledby").val();
    localStorage.setItem("filedbyField", filedby);
    if (filedby == "1") {
        window.location.href = "/" + fcode + "/CW/AddAgainstTheBank";
    }
    else if (filedby == "2") {
        window.location.href = "/" + fcode + "/CW/AddConsumerCases";
    }
    else if (filedby == "3") {
        window.location.href = "/" + fcode + "/CW/AddContingentLiability";
    }
    else {
        window.location.href = "/" + fcode + "/CW/AddAgainstTheBank";
    }
}



function loadAgainstBankData(
    courtDetail = "",
    placeOfCourt = "",
    caseNo = "",
    caseId = "",
    presentStatus = "",
    nextHearingFromDate = "",
    nextHearingToDate = "",
    disposalFromDate = "",
    disposalToDate = "",
    pageNumber = 1
) {

    currentPage = pageNumber;

    openload();

    if (courtDetail == "1") courtDetail = "Supreme Court";
    if (courtDetail == "2") courtDetail = "High Court";
    if (courtDetail == "3") courtDetail = "District Court";
    if (courtDetail == "4") courtDetail = "Tribunals";
    if (courtDetail == "5") courtDetail = "Add a Court";

    $.ajax({
        url: '/CW/GetAgainstBank',
        type: 'GET',
        data: {
            courtDetail: courtDetail,
            placeOfCourt: placeOfCourt,
            caseNo: caseNo,
            caseId: caseId,
            presentStatus: presentStatus,
            nextHearingDateFrom: nextHearingFromDate,
            nextHearingDateTo: nextHearingToDate,
            disposalDateFrom: disposalFromDate,
            disposalDateTo: disposalToDate,
            pageNumber: pageNumber,
            pageSize: pageSize
        },
        success: function (response) {
            var againstBank = '1';
            $("#againstBankTbody").html("");
            $("#pdatastatusBank").hide();

            let tbodyHtml = "";

            if (!response || !response.Data || response.Data.length === 0) {
                closeload();
                $("#mtrPaginationAgainst").hide();
                $("#pdatastatusBank").show();
                $("#pageNumbers").html("");
                return;
            }
            $("#mtrPaginationAgainst").show();
            var data = response.Data;

            totalPages = response.TotalPages;

            $.each(data, function (i, item) {

                var rowNo = ((currentPage - 1) * pageSize) + i + 1;
                //<td class="casecasedetails" style="display: table-cell;">
                //    <a title="Case is yet to be indexed" class="details" href="javascript:void()">
                //        <span align="center;"></span>
                //        <img src="/newassets/img/casedetail-org.png">
                //        </a>
                //    </td>
                let FinalUserCaseid = "";
                let htmllnk = "";

                if (item.UserCaseid && item.UserCaseid !== "null") {
                    FinalUserCaseid = item.UserCaseid;
                }

               
                if (item.UserCaseid != null) {
                    btnclass = " details";
                    usercaseid = "";
                    fileiconcase = "glyphicon glyphicon-book";
                }
                else {
                    btnclass = "";
                    usercaseid = "";
                    fileiconcase = "";
                }

               if (item.MasterCaseId && item.MasterCaseId !== "0") {

                        htmllnk = `
                <a title="Order, date of hearing and relevant details for your Case"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}">
                    <span align="center">${usercaseid}</span>
                    <img src="/newassets/img/casedetail-green.png">
                </a>`;
                    }
                    else if (item.iCaseNotFound >= 1) {

                        htmllnk = `
                <a title="Case not found"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}"
                   data-val="${item.CNRCase || ''}">
                    <span id="chc${item.CaseNextHearing}" align="center">${usercaseid}</span>
                    <img src="/newassets/img/case-not-index.png">
                </a>`;
                    }
                    else {

                        htmllnk = `
                <a title="Case is yet to be indexed"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}">
                    <span id="chc${item.CaseNextHearing}" align="center">${usercaseid}</span>
                    <img src="/newassets/img/casedetail-org.png">
                </a>`;
                    }
              


                tbodyHtml += `
                <tr>
                    <td class="sno">${rowNo}</td>
                   
                    
                       <td class="casecasedetails" style="display: table-cell;">
                        ${htmllnk}
                        </td>
                   


                    <td class="CaseNo">${item.CaseNo ?? ''}</td>
                    <td class="CaseID">${item.CaseId ?? ''}</td>
                    <td class="Zone">${item.Zone ?? ''}</td>
                    <td class="Branch">${item.Branch ?? ''}</td>
                    <td class="AccountHolderName">${item.AccountHolderName ?? ''}</td>
                    <td class="ClaimantAddress">${item.ClaimantAddress ?? ''}</td>
                    <td class="CIFNo">${item.CIFNo ?? ''}</td>
                    <td class="AccountNo">${item.AccountNo ?? ''}</td>
                    <td class="FirstSummonDate">${formatDateGet(item.FirstSummonDate)}</td>
                    <td class="FirstSummonReceivedDate">${formatDateGet(item.FirstSummonReceivedDate)}</td>
                    <td class="RespondentDetails">${item.RespondentDetails ?? ''}</td>
                    <td class="ProformaParties">${item.ProformaParties ?? ''}</td>
                    <td class="CaseProposing">${item.CaseProposing ?? ''}</td>
                    <td class="CaseType">${item.CaseType ?? ''}</td>
                    <td class="Department">${item.Department ?? ''}</td>
                    <td class="CourtDetail">${item.CourtDetail ?? ''}</td>
                    <td class="PlaceOfCourt">${item.PlaceOfCourt ?? ''}</td>
                    <td class="AreaOfComplaint">${item.AreaOfComplaint ?? ''}</td>
                    <td class="WrittenStatementDate">${formatDateGet(item.WrittenStatementDate)}</td>
                    <td class="FactsOfCase">${item.FactsOfCase ?? ''}</td>
                    <td class="ClaimAmount">${item.ClaimAmount ?? ''}</td>
                    <td class="AdvocateName">${item.AdvocateName ?? ''}</td>
                    <td class="AdvocateContact">${item.AdvocateContact ?? ''}</td>
                    <td class="PresentStatus">${item.PresentStatus ?? ''}</td>
                    <td class="NextHearingDate">${formatDateGet(item.NextHearingDate)}</td>
                    <td class="NextHearingPurpose">${item.NextHearingPurpose ?? ''}</td>
                    <td class="InterimOrderDate">${formatDateGet(item.InterimOrderDate)}</td>
                    <td class="InterimOrderReceivedDate">${formatDateGet(item.InterimOrderReceivedDate)}</td>
                    <td class="InterimDirection">${item.InterimDirection ?? ''}</td>
                    <td class="InterimComplianceStatus">${item.InterimComplianceStatus ?? ''}</td>
                    <td class="InterimRemarks">${item.InterimRemarks ?? ''}</td>
                    <td class="DisposalDate">${formatDateGet(item.DisposalDate)}</td>
                    <td class="FinalOrderReceivedDate">${formatDateGet(item.FinalOrderReceivedDate)}</td>
                    <td class="AwardAmount">${item.AwardAmount ?? ''}</td>
                    <td class="FinalDirection">${item.FinalDirection ?? ''}</td>
                    <td class="FinalComplianceStatus">${item.FinalComplianceStatus ?? ''}</td>
                    <td class="FinalRemarks">${item.FinalRemarks ?? ''}</td>
                    <td class="action_buttond">
                   <span style='display:inline-flex'>
                     <span onclick='editAgainstBankForm(${item.Id})' style='cursor:pointer;'>
                            <img src="/newassets/img/edit-icon.png">
                        </span>
                        
                    <span class='delete-btn' data-caseno="${item.Id}"  data-casetype="${againstBank}" title="Delete" style="cursor:pointer;">
                      <img src="/newassets/img/deletematter.png">
                    </span>
                      </span>
                   </td>
                </tr>`;
            });

            $("#againstBankTbody").html(tbodyHtml);

            renderPaginationAgainst();

            applyAgainstColumnVisibility();

            closeload();
        },
        error: function (xhr) {
            closeload();
            console.log(xhr.responseText);
        }
    });
}
function editAgainstBankForm(caseId) {
    var fcode = localStorage.getItem("FirmCode");

    window.location.href = '/' + fcode + '/CW/AddAgainstTheBank?caseIdDetail=' + encodeURIComponent(caseId);
}

$(document).on("click", ".delete-btn", function () {
    var caseNo = $(this).data("caseno");
    var caseType = $(this).data("casetype");

    DeleteAgainstBankForm(caseNo, caseType);
});

function DeleteAgainstBankForm(caseNo, caseType) {
    //var fcode = localStorage.getItem("FirmCode");
    //window.location.href = '/' + fcode + '/CW/RecordDeleteAgainstTheBank?caseNo=' + encodeURIComponent(caseNo);
    //var caseNo = caseNo;
    //var caseNo = $(this).data("data-caseno");
    //var caseType = $(this).data("data-casetype");

    formdata = new FormData();
    formdata.append("mcaseNo", EncodeText(caseNo))
    formdata.append("caseType", caseType)
    //formdata.append("deleteflag", EncodeText("1"))
    $.ajax({
        type: "POST",
        url: "/CW/RecordDeleteAgainstTheBank",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result) {
                alert("Record deleted successfully.");
                /*loadAgainstBankData();*/
                
                var divdistrict = $("#divSCHCDistrict").val();
                if (divdistrict == null) {
                    divdistrict = "";
                }

                var drpcourtname = $("#drpcourtname").val();
                if (drpcourtname == null) {
                    drpcourtname = "";
                }

                var filedby = $("#divfiledby").val();
                if (filedby == "1") {
                    RespondentName = "Bank of Maharashtra";
                    $("#bomFilterTitle").text("Against the Bank");
                    $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Against the Bank</b> Details");
                    $("#againstTheBankTable").show();
                    $("#ColumnSelectionopenagainstTheBank").show();
                    $("#ColumnSelectionopenconsumerCases").hide();
                    $("#ColumnSelectionopencontingentLiability").hide();
                    $("#againstTheBankSection").show();
                    $("#consumerCasesTable").hide();
                    $("#consumerCasesSection").hide();
                    $("#contingentLiabilityTable").hide();
                    $("#contingentLiabilitySection").hide();
                    loadAgainstBankData(divdistrict, drpcourtname);
                }
                if (filedby == "2") {
                    RespondentName = "Bank of Maharashtra";
                    $("#bomFilterTitle").text("Consumer Cases");
                    $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Consumer Cases</b> Details");
                    $("#againstTheBankTable").hide();
                    $("#consumerCasesSection").show();
                    $("#againstTheBankSection").hide();
                    $("#consumerCasesTable").show();
                    $("#contingentLiabilitySection").hide();
                    $("#contingentLiabilityTable").hide();
                    $("#ColumnSelectionopenagainstTheBank").hide();
                    $("#ColumnSelectionopenconsumerCases").show();
                    $("#ColumnSelectionopencontingentLiability").hide();
                    loadConsumerCases(divdistrict, drpcourtname);
                }
                if (filedby == "3") {
                    RespondentName = "Bank of Maharashtra";
                    $("#bomFilterTitle").text("Contingent Liability");
                    $("#bomFilterButton").html("<span><img src='/newassets/img/plus-icon.png'></span>Add <b>Contingent Liability</b> Details");
                    $("#againstTheBankTable").hide();
                    $("#againstTheBankSection").hide();
                    $("#consumerCasesTable").hide();
                    $("#consumerCasesSection").hide();
                    $("#contingentLiabilityTable").show();
                    $("#contingentLiabilitySection").show();
                    $("#ColumnSelectionopenagainstTheBank").hide();
                    $("#ColumnSelectionopenconsumerCases").hide();
                    $("#ColumnSelectionopencontingentLiability").show();
                    loadContingentLiability(divdistrict, drpcourtname);
                }
            }
            else {
                alert("Something went wrong.")
            }
        }
    })
}



function fillAgainstTheBankCaseNo(caseId) {

    $.ajax({
        url: '/CW/GetAgainstBank',
        type: 'GET',
        data: {
            caseIdDetail: caseId
        },
        success: function (response) {

            let item = response?.Data?.[0];

            if (item) {

                fillAgainstBankForm(item);

                $("#AgainstTheBank").show();
            }
        }
    });
}
function fillAgainstBankForm(item) {

    // ================= HANDLE OBJECT / STRING =================

    if (typeof item === "string") {
        item = JSON.parse(decodeURIComponent(item));
    }

    // ================= OPEN MODAL =================

    $("#AgainstBankModal").modal("show");

    setTimeout(function () {

        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");

    }, 200);

    // ================= BUTTON TEXT =================

    $("#btnSaveAgainstBank").text("Update Details");

    // ================= BASIC DETAILS =================

    $("#caseId2").val(item.CaseId || '');
    $("#txtcaseno").val(item.CaseNo || '').prop("readonly", true);;

    $("#zone2").val(item.Zone || '');
    $("#branch2").val(item.Branch || '');

    $("#accountHolderName").val(item.AccountHolderName || '');

    $("#claimantDetails").val(item.ClaimantAddress || '');

    $("#cifNo2").val(item.CIFNo || '');
    $("#accountNo2").val(item.AccountNo || '');

    // ================= DATES =================

    $("#firstSummonDate2").val(formatDateGet(item.FirstSummonDate));

    $("#firstSummonReceivedDate2")
        .val(formatDateGet(item.FirstSummonReceivedDate));

    $("#writtenStatementDate2")
        .val(formatDateGet(item.WrittenStatementDate));

    $("#nextHearingDate2")
        .val(formatDateGet(item.NextHearingDate));

    $("#interimOrderDate2")
        .val(formatDateGet(item.InterimOrderDate));

    $("#interimOrderReceivedDate2")
        .val(formatDateGet(item.InterimOrderReceivedDate));

    $("#disposalDate2")
        .val(formatDateGet(item.DisposalDate));

    $("#finalOrderReceivedDate2")
        .val(formatDateGet(item.FinalOrderReceivedDate));

    // ================= CASE DETAILS =================

    $("#respondentDetails2").val(item.RespondentDetails || '');

    $("#proformaParties").val(item.ProformaParties || '');

    $("#caseProposing").val(item.CaseProposing || '');

    $("#caseType2").val(item.CaseType || '');

    $("#department").val(item.Department || '');

    $("#courtDetail2").val(item.CourtDetail || '');

    $("#placeOfCourt2").val(item.PlaceOfCourt || '');

    $("#complaintArea").val(item.AreaOfComplaint || '');

    $("#factsReason").val(item.FactsOfCase || '');

    // ================= CLAIM / ADVOCATE =================

    $("#claimAmount2").val(item.ClaimAmount || '');

    $("#advocateName").val(item.AdvocateName || '');

    $("#advocateContact").val(item.AdvocateContact || '');

    // ================= STATUS =================

    $("#presentStatus2").val(item.PresentStatus || '');

    $("#nextHearingPurpose2")
        .val(item.NextHearingPurpose || '');

    // ================= INTERIM =================

    $("#interimDirection2")
        .val(item.InterimDirection || '');

    $("#interimCompliance2")
        .val(item.InterimComplianceStatus || '');

    $("#interimRemarks2")
        .val(item.InterimRemarks || '');

    // ================= FINAL =================

    $("#awardAmount2").val(item.AwardAmount || '');

    $("#finalDirection2")
        .val(item.FinalDirection || '');

    $("#finalCompliance2")
        .val(item.FinalComplianceStatus || '');

    $("#finalRemarks2").val(item.FinalRemarks || '');
    $("#txtmatternamede1").val(item.mname || '');

    $("#hdnMatterId").val(item.MatterId);
    //$("#txtcaseno").val(item.caseNo);

}
// ================= FORMAT DATE =================

function formatDate(dateString) {

    if (!dateString)
        return '';

    let match = /Date\((\d+)\)/.exec(dateString);

    if (!match)
        return '';

    let date = new Date(parseInt(match[1]));

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    return day + "-" + month + "-" + year;
}

// ================= LOAD CONSUMER CASES =================

function loadConsumerCases(
    caseNo = "",

    caseId = "",
    courtDetail = "",
    placeOfCourt = "",
    nextHearingFromDate = "",
    nextHearingToDate = "",
    disposalFromDate = "",
    disposalToDate = "",
    presentStatus = "",
    pageNumber = currentConsumerPage,
    pageSize = consumerPageSize
) {

    openload();

    if (courtDetail == "1") courtDetail = "Supreme Court";
    if (courtDetail == "2") courtDetail = "High Court";
    if (courtDetail == "3") courtDetail = "District Court";
    if (courtDetail == "4") courtDetail = "Tribunals";
    if (courtDetail == "5") courtDetail = "Add a Court";

    $.ajax({
        url: '/CW/GetConsumerCases',
        type: 'GET',
        data: {
            caseNo: caseNo,

            caseId: caseId,
            courtDetail: courtDetail,
            placeOfCourt: placeOfCourt,
            nextHearingDateFrom: nextHearingFromDate,
            nextHearingDateTo: nextHearingToDate,
            disposalDateFrom: disposalFromDate,
            disposalDateTo: disposalToDate,
            presentStatus: presentStatus,
            pageNumber: pageNumber,
            pageSize: pageSize
        },
        success: function (response) {

            closeload();
            var consumerCase = 2;
            $("#consumerCasesTableBody").html("");
            $("#pdatastatusConsumer").hide();

            let tbody = $("#consumerCasesTableBody");

            if (!response || !response.Data || response.Data.length === 0) {

                $("#pdatastatusConsumer").show();
                $("#mtrPaginationAgainst").hide();
                renderPaginationConsumer(1, 0);
                return;
            }
            $("#mtrPaginationAgainst").show();
            //<td class="casecasedetails">
            //    <a title="Case is yet to be indexed" class="details" href="javascript:void()">
            //        <img src="/newassets/img/casedetail-org.png">
            //            </a>
            //        </td>
            $.each(response.Data, function (i, item) {
                let FinalUserCaseid = "";
                let htmllnk = "";

                if (item.UserCaseid && item.UserCaseid !== "null") {
                    FinalUserCaseid = item.UserCaseid;
                }


                if (item.UserCaseid != null) {
                    btnclass = " details";
                    usercaseid = "";
                    fileiconcase = "glyphicon glyphicon-book";
                }
                else {
                    btnclass = "";
                    usercaseid = "";
                    fileiconcase = "";
                }

                if (item.MasterCaseId && item.MasterCaseId !== "0") {

                    htmllnk = `
                <a title="Order, date of hearing and relevant details for your Case"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}">
                    <span align="center">${usercaseid}</span>
                    <img src="/newassets/img/casedetail-green.png">
                </a>`;
                }
                else if (item.iCaseNotFound >= 1) {

                    htmllnk = `
                <a title="Case not found"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}"
                   data-val="${item.CNRCase || ''}">
                    <span id="chc${item.CaseNextHearing}" align="center">${usercaseid}</span>
                    <img src="/newassets/img/case-not-index.png">
                </a>`;
                }
                else {

                    htmllnk = `
                <a title="Case is yet to be indexed"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}">
                    <span id="chc${item.CaseNextHearing}" align="center">${usercaseid}</span>
                    <img src="/newassets/img/casedetail-org.png">
                </a>`;
                }
                let row = `
                <tr>
                    <td class="SNo">${((response.CurrentPage - 1) * response.PageSize) + i + 1}</td>
                   <td class="casecasedetails">
                        ${htmllnk}
                        </td>
                    <td class="CaseNo">${item.CaseNo || ''}</td>
                    <td class="CaseID">${item.CaseId || ''}</td>
                    <td class="Zone">${item.Zone || ''}</td>
                    <td class="Branch">${item.Branch || ''}</td>
                    <td class="PetitionerName">${item.PetitionerName || ''}</td>
                    <td class="CIFNo">${item.CIFNo || ''}</td>
                    <td class="AccountNo">${item.AccountNo || ''}</td>
                    <td class="FirstSummonDate">${formatDate(item.FirstSummonDate)}</td>
                    <td class="SummonReceivedDate">${formatDate(item.FirstSummonReceivedDate)}</td>
                    <td class="RespondentDetails">${item.RespondentDetails || ''}</td>
                    <td class="FilingDate">${formatDate(item.FilingDate)}</td>
                    <td class="PresentStatus">${item.PresentStatus || ''}</td>
                    <td class="CourtDetail">${item.CourtDetail || ''}</td>
                    <td class="PlaceOfCourt">${item.PlaceOfCourt || ''}</td>
                    <td class="ClaimAmount">${item.ClaimAmount || ''}</td>
                    <td class="CaseType">${item.CaseType || ''}</td>
                    <td class="AreaOfComplaint">${item.AreaOfComplaint || ''}</td>
                    <td class="FactsOfCase">${item.FactsOfCase || ''}</td>
                    <td class="WrittenStatementDate">${formatDate(item.WrittenStatementDate)}</td>
                    <td class="NextHearingDate">${formatDate(item.NextHearingDate)}</td>
                    <td class="NextHearingPurpose">${item.NextHearingPurpose || ''}</td>
                    <td class="InterimOrderDate">${formatDate(item.InterimOrderDate)}</td>
                    <td class="InterimOrderReceived">${formatDate(item.InterimOrderReceivedDate)}</td>
                    <td class="InterimDirection">${item.InterimDirection || ''}</td>
                    <td class="InterimCompliance">${item.InterimComplianceStatus || ''}</td>
                    <td class="InterimRemarks">${item.InterimRemarks || ''}</td>
                    <td class="DisposalDate">${formatDate(item.DisposalDate)}</td>
                    <td class="finalorderreceived">${formatDate(item.FinalOrderReceivedDate)}</td>
                    <td class="AwardAmount">${item.AwardAmount || ''}</td>
                    <td class="FinalDirection">${item.FinalDirection || ''}</td>
                    <td class="FinalCompliance">${item.FinalComplianceStatus || ''}</td>
                    <td class="FinalRemarks">${item.FinalRemarks || ''}</td>
                    <td class="action_buttond">
                     <span style='display:inline-flex'>
                        <span onclick='editConsumerCasesForm("${item.Id}")' style='cursor:pointer;'>
                            <img src="/newassets/img/edit-icon.png">
                        </span>
                         <span class='delete-btn' data-caseno="${item.Id}"  data-casetype="${consumerCase}" title="Delete" style="cursor:pointer;">
                        <img src="/newassets/img/deletematter.png">
                        </span>
</span>
                    </td>

                </tr>`;

                tbody.append(row);
            });

            currentConsumerPage = response.CurrentPage;
            totalConsumerPages = response.TotalPages;

            renderPaginationConsumer(
                response.CurrentPage,
                response.TotalPages
            );

            applyConsumerColumnVisibility();
        },

        error: function (xhr, status, error) {

            closeload();
            console.log(error);

        }
    });
}

//function editConsumerCasesForm(caseNo) {
//    var fcode = localStorage.getItem("FirmCode");

//    window.location.href = '/' + fcode + '/CW/AddConsumerCases?caseNo=' + encodeURIComponent(caseNo);
//}
function editConsumerCasesForm(caseId) {
    var fcode = localStorage.getItem("FirmCode");

    window.location.href = '/' + fcode + '/CW/AddConsumerCases?caseIdDetail=' + encodeURIComponent(caseId);
}
function fillConsumerCasesByCaseNo(caseId) {

    $.ajax({
        url: '/CW/GetConsumerCases',
        type: 'GET',
        data: {
            caseIdDetail: caseId,
            pageNumber: 1,
            pageSize: 1
        },

        success: function (response) {

            if (response &&
                response.Data &&
                response.Data.length > 0) {

                fillConsumerCasesForm(response.Data[0]);

                $("#ConsumerCases").show();
            }
            else {

                alert("No record found.");
            }
        },

        error: function (xhr, status, error) {

            console.log(error);
        }
    });
}
function fillConsumerCasesForm(item) {
    debugger;
    $("#ConsumerCases").modal("show");

    setTimeout(function () {

        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");

    }, 200);

    $("#btnSaveConsumerCase").text("Update Details");

    $("#caseId").val(item.CaseId || '');
    $("#caseNo").val(item.CaseNo || '').prop("readonly", true);;

    $("#zone").val(item.Zone || '');
    $("#branch").val(item.Branch || '');

    $("#petitionerName").val(item.PetitionerName || '');

    $("#cifNo").val(item.CIFNo || '');
    $("#accountNo").val(item.AccountNo || '');

    $("#respondentDetails").val(item.RespondentDetails || '');

    $("#presentStatus").val(item.PresentStatus || '');

    $("#courtDetail").val(item.CourtDetail || '');
    $("#placeOfCourt").val(item.PlaceOfCourt || '');

    $("#claimAmount").val(item.ClaimAmount || '');

    $("#caseType").val(item.CaseType || '');

    $("#areaOfComplaint").val(item.AreaOfComplaint || '');

    $("#factsOfCase").val(item.FactsOfCase || '');

    $("#nextHearingPurpose").val(item.NextHearingPurpose || '');

    $("#interimDirection").val(item.InterimDirection || '');

    $("#interimCompliance").val(item.InterimComplianceStatus || '');

    $("#interimRemarks").val(item.InterimRemarks || '');

    $("#finalDirection").val(item.FinalDirection || '');

    $("#finalCompliance").val(item.FinalComplianceStatus || '');

    $("#finalRemarks").val(item.FinalRemarks || '');

    $("#awardAmount").val(item.AwardAmount || '');

    $("#advocateName").val(item.AdvocateName || '');

    $("#advocateContact").val(item.AdvocateContact || '');

    // Dates

    $("#firstSummonDate").val(formatDateGet(item.FirstSummonDate));

    $("#firstSummonReceivedDate").val(formatDateGet(item.FirstSummonReceivedDate));

    $("#filingDate").val(formatDateGet(item.FilingDate));

    $("#writtenStatementDate").val(formatDateGet(item.WrittenStatementDate));

    $("#nextHearingDate").val(formatDateGet(item.NextHearingDate));

    $("#interimOrderDate").val(formatDateGet(item.InterimOrderDate));

    $("#interimOrderReceivedDate").val(formatDateGet(item.InterimOrderReceivedDate));

    $("#disposalDate").val(formatDateGet(item.DisposalDate));

    $("#finalOrderReceivedDate").val(formatDateGet(item.FinalOrderReceivedDate));
    $("#txtmatternamede1").val(item.mname || '');

    $("#hdnMatterId").val(item.MatterId);
}
// ================= LOAD CONTINGENT LIABILITY =================

function loadContingentLiability(
    caseNo = "",

    caseId = "",
    courtDetail = "",
    placeOfCourt = "",
    nextHearingDateFrom = "",
    nextHearingDateTo = "",
    dateOfClaimFrom = "",
    dateOfClaimTo = "",
    pageNumber = currentPageContingent
) {

    currentPageContingent = pageNumber;

    openload();

    if (courtDetail == "1") courtDetail = "Supreme Court";
    if (courtDetail == "2") courtDetail = "High Court";
    if (courtDetail == "3") courtDetail = "District Court";
    if (courtDetail == "4") courtDetail = "Tribunals";
    if (courtDetail == "5") courtDetail = "Add a Court";

    $.ajax({
        url: '/CW/GetContingentLiability',
        type: 'GET',
        data: {
            caseNo: caseNo,
            caseId: caseId,
            courtDetail: courtDetail,
            placeOfCourt: placeOfCourt,
            nextHearingDateFrom: nextHearingDateFrom,
            nextHearingDateTo: nextHearingDateTo,
            dateOfClaimFrom: dateOfClaimFrom,
            dateOfClaimTo: dateOfClaimTo,

            pageNumber: pageNumber,
            pageSize: pageSizeContingent
        },

        success: function (response) {
            var contingentCase = '3';
            closeload();

            $("#contingentLiabilityTableBody").html("");
            $("#pdatastatusLiability").hide();
            let data = response.Data || [];
            totalPagesContingent = response.TotalPages || 1;
            if (data.length === 0) {
                $("#pdatastatusLiability").show();
                $("#pageNumberscontingent").html("");
                $("#prevcontingent").hide();
                $("#nextcontingent").hide();
                $("#mtrPaginationAgainst").hide();
                return;
            }
            $("#mtrPaginationAgainst").show();
            let tbody = "";
            $.each(data, function (i, item) {
                let FinalUserCaseid = "";
                let htmllnk = "";
                if (item.UserCaseid && item.UserCaseid !== "null") {
                    FinalUserCaseid = item.UserCaseid;
                }
                if (item.UserCaseid != null) {
                    btnclass = " details";
                    usercaseid = "";
                    fileiconcase = "glyphicon glyphicon-book";
                }
                else {
                    btnclass = "";
                    usercaseid = "";
                    fileiconcase = "";
                }
                if (item.MasterCaseId && item.MasterCaseId !== "0") {
                    htmllnk = `
                <a title="Order, date of hearing and relevant details for your Case"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}">
                    <span align="center">${usercaseid}</span>
                    <img src="/newassets/img/casedetail-green.png">
                </a>`;
                }
                else if (item.iCaseNotFound >= 1) {

                    htmllnk = `
                <a title="Case not found"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}"
                   data-val="${item.CNRCase || ''}">
                    <span id="chc${item.CaseNextHearing}" align="center">${usercaseid}</span>
                    <img src="/newassets/img/case-not-index.png">
                </a>`;
                }
                else {

                    htmllnk = `
                <a title="Case is yet to be indexed"
                   class="${btnclass}"
                   id="transferpagecase"
                   href="javascript:void(0)"
                   sno="${item.UserCaseid}">
                    <span id="chc${item.CaseNextHearing}" align="center">${usercaseid}</span>
                    <img src="/newassets/img/casedetail-org.png">
                </a>`;
                }
                tbody += `
                <tr>
                    <td class="sno">${((pageNumber - 1) * pageSizeContingent) + i + 1}</td>

                   <td class="casecasedetails">
                        ${htmllnk}
                        </td>
                    <td class="CaseNo">${item.CaseNo || ''}</td>
                    <td class="CaseID">${item.CaseId || ''}</td>
                    <td class="Zone">${item.Zone || ''}</td>
                    <td class="Branch">${item.Branch || ''}</td>
                    <td class="AccountHolder">${item.AccountHolderName || ''}</td>
                    <td class="ClaimantName">${item.ClaimantName || ''}</td>
                    <td class="ClaimantAddress">${item.ClaimantAddress || ''}</td>
                    <td class="DateOfClaim">${formatDate(item.DateOfClaim)}</td>
                    <td class="BankGuarantee">${item.BankGuarantee || ''}</td>
                    <td class="LetterOfCredit">${item.LetterOfCredit || ''}</td>
                    <td class="WrongPayment">${item.WrongPayment || ''}</td>
                    <td class="Fraud">${item.Fraud || ''}</td>
                    <td class="CounterClaim">${item.CounterClaim || ''}</td>
                    <td class="OthersClaim">${item.OthersClaim || ''}</td>
                    <td class="NatureOfSecurity">${item.NatureOfSecurity || ''}</td>
                    <td class="RealisableValue">${item.RealisableValue || ''}</td>
                    <td class="FactsOfCase">${item.FactsOfCase || ''}</td>
                    <td class="NextHearingPurpose">${item.NextHearingPurpose || ''}</td>
                    <td class="NextHearingDate">${formatDate(item.NextHearingDate)}</td>
                    <td class="ProvisionDetail">${item.ProvisionDetail || ''}</td>
                    <td class="YearOfProvision">${item.YearOfProvision || ''}</td>
                    <td class="AmountProvision">${item.AmountProvision || ''}</td>
                    <td class="AmountDepositedInCourt">${item.AmountDepositedInCourt || ''}</td>
                    <td class="action_buttond">
                    <span style='display:inline-flex'>
                        <span onclick="editContingentLiability('${item.Id}')" >
                            <img src="/newassets/img/edit-icon.png">
                        </span>
                    <span class='delete-btn' data-caseno="${item.Id}"  data-casetype="${contingentCase}" title="Delete" >
                      <img src="/newassets/img/deletematter.png">
                    </span>
                    </span>
                    </td>

                </tr>`;
            });

            $("#contingentLiabilityTableBody").html(tbody);

            renderPaginationContingent(
                response.CurrentPage,
                response.TotalPages
            );

            setTimeout(function () {
                applyContingentColumnVisibility();
            }, 100);
        },

        error: function (xhr, status, error) {

            closeload();
            console.log(error);

        }
    });
}

function editContingentLiability(caseNo) {
    var fcode = localStorage.getItem("FirmCode");

    window.location.href = '/' + fcode + '/CW/AddContingentLiability?caseIdDetail=' + encodeURIComponent(caseNo);
}

function loadContingentLiabilityByCaseNo(caseId) {

    $.ajax({
        url: '/CW/GetContingentLiability',
        type: 'GET',
        data: { caseIdDetail: caseId },
        //data: {
        //    caseNo: caseNo,
        //    pageNumber: 1,
        //    pageSize: 1
        //},

        success: function (response) {

            if (response &&
                response.Data &&
                response.Data.length > 0) {

                fillContingentLiabilityForm(response.Data[0]);

                $("#conLiabilityDetail").show();
            }
            else {

                alert("No record found.");
            }
        },

        error: function (xhr, status, error) {

            console.log(error);
        }
    });
}
function fillContingentLiabilityForm(item) {
    //$("#conLiabilityDetail").modal("show");

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").css("padding-right", "");
    $("#clrLiabilitybtn").css("display", "none");
    $("#btnSaveContingentLiability").text("Update Details");
    $("#caseId").val(item.CaseId || '');
    $("#caseNo").val(item.CaseNo || '').prop("readonly", true);;

    $("#zone").val(item.Zone || '');
    $("#branch").val(item.Branch || '');

    $("#accountHolderName").val(item.AccountHolderName || '');
    $("#claimantName").val(item.ClaimantName || '');
    $("#claimantAddress").val(item.ClaimantAddress || '');

    $("#dateOfClaim").val(formatDateGet(item.DateOfClaim));

    $("#bankGuarantee").val(item.BankGuarantee || '');
    $("#letterOfCredit").val(item.LetterOfCredit || '');
    $("#wrongPayment").val(item.WrongPayment || '');
    $("#fraud").val(item.Fraud || '');
    $("#counterClaim").val(item.CounterClaimAgainstBank || '');
    $("#othersClaim").val(item.Others || '');

    $("#natureOfSecurity").val(item.NatureOfSecurity || '');
    $("#realisableValue").val(item.RealisableValue || '');

    $("#factsOfCase").val(item.FactsOfCase || '');

    $("#nextHearingPurpose").val(item.NextHearingPurpose || '');
    $("#nextHearingDate").val(formatDateGet(item.NextHearingDate));

    $("#provisionDetail").val(item.ProvisionDetail || '');
    $("#yearOfProvision").val(item.YearOfProvision || '');
    $("#amountProvision").val(item.AmountProvision || '');
    $("#amountDepositedInCourt").val(item.AmountDepositedInCourt || '');

    $("#counterClaim").val(item.CounterClaim || '');
    $("#othersClaim").val(item.OthersClaim || '');
    $("#realisableValue").val(item.RealisableValue || '');

    $("#txtmatternamede1").val(item.mname || '');
    $("#hdnMatterId").val(item.MatterId);
}

function formatDateGet(dateString) {

    if (!dateString) return '';

    // Extract timestamp from /Date(123456789)/
    const match = /\/Date\((\d+)\)\//.exec(dateString);

    if (!match) return '';

    const date = new Date(parseInt(match[1]));

    return date.toISOString().split('T')[0];
}

document.addEventListener("DOMContentLoaded", function () {

    var exportBtn = document.getElementById("exporttoexcelagainstTheBank");

    if (exportBtn) {

        exportBtn.addEventListener("click", function () {

            $("#myModalexport").modal("show");

            var totalRecord = $("#againstBankTbody tr").length;

            var pagesize = 500;

            var recordsection = Math.ceil(totalRecord / pagesize);

            var html = '<option value="" selected>Please Select</option>';

            for (var i = 1; i <= recordsection; i++) {

                /*html += '<option value="' + i + '">Page No: ' + i + '</option>';*/
                html += '<option value="' + i + '">' + i + '</option>';
            }

            document.getElementById("printexport").innerHTML = html;

            // ================= DYNAMIC FOOTER =================

            var footerHtml = `
                <div class="modal-footer">

                    <button type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                        Cancel
                    </button>

                    <button type="button"
                            class="btn btn-primary"
                            id="exporttoexcelfileagainstTheBank">
                        Confirm
                    </button>

                </div>
            `;

            $(".modal-footer").remove();

            $("#myModalexport .modal-content").append(footerHtml);
        });

    }

});

$(document).off("click", "#exporttoexcelfileagainstTheBank")
    .on("click", "#exporttoexcelfileagainstTheBank", function () {

        var pageno = $("#printexport").val();

        if (!pageno) {

            alert("Please select page number");

            return;
        }

        var CaseNo = $("#caseNo2").val() || "";
        var CaseId = $("#caseId2").val() || "";

        var Zone = $("#zone2").val() || "";
        var Branch = $("#branch2").val() || "";

        var AccountHolderName = $("#accountHolderName").val() || "";
        var ClaimantAddress = $("#claimantDetails").val() || "";

        var CIFNo = $("#cifNo2").val() || "";
        var AccountNo = $("#accountNo2").val() || "";

        var FirstSummonDate = $("#firstSummonDate2").val() || "";
        var FirstSummonReceivedDate = $("#firstSummonReceivedDate2").val() || "";

        var RespondentDetails = $("#respondentDetails2").val() || "";
        var ProformaParties = $("#proformaParties").val() || "";

        var CaseProposing = $("#caseProposing").val() || "";
        var CaseType = $("#caseType2").val() || "";
        var Department = $("#department").val() || "";

        var CourtDetail = $("#courtDetail2").val() || "";
        var PlaceOfCourt = $("#placeOfCourt2").val() || "";

        var AreaOfComplaint = $("#complaintArea").val() || "";

        var WrittenStatementDate = $("#writtenStatementDate2").val() || "";
        var FactsOfCase = $("#factsReason").val() || "";

        var ClaimAmount = $("#claimAmount2").val() || "";

        var AdvocateName = $("#advocateName").val() || "";
        var AdvocateContact = $("#advocateContact").val() || "";

        var PresentStatus = $("#presentStatus2").val() || "";

        var NextHearingDate = $("#nextHearingDate2").val() || "";
        var NextHearingPurpose = $("#nextHearingPurpose2").val() || "";

        var InterimOrderDate = $("#interimOrderDate2").val() || "";
        var InterimOrderReceivedDate = $("#interimOrderReceivedDate2").val() || "";

        var InterimDirection = $("#interimDirection2").val() || "";
        var InterimComplianceStatus = $("#interimCompliance2").val() || "";
        var InterimRemarks = $("#interimRemarks2").val() || "";

        var DisposalDate = $("#disposalDate2").val() || "";
        var FinalOrderReceivedDate = $("#finalOrderReceivedDate2").val() || "";

        var AwardAmount = $("#awardAmount2").val() || "";

        var FinalDirection = $("#finalDirection2").val() || "";
        var FinalComplianceStatus = $("#finalCompliance2").val() || "";
        var FinalRemarks = $("#finalRemarks2").val() || "";

        window.location = encodeURI(

            "/CW/ExportToExcelAgainstBankBOM?" +

            "pagenum=" + escape(pageno) +
            "&pagesize=500" +

            "&CaseNo=" + escape(CaseNo) +
            "&CaseId=" + escape(CaseId) +

            "&Zone=" + escape(Zone) +
            "&Branch=" + escape(Branch) +

            "&AccountHolderName=" + escape(AccountHolderName) +
            "&ClaimantAddress=" + escape(ClaimantAddress) +

            "&CIFNo=" + escape(CIFNo) +
            "&AccountNo=" + escape(AccountNo) +

            "&FirstSummonDate=" + escape(FirstSummonDate) +
            "&FirstSummonReceivedDate=" + escape(FirstSummonReceivedDate) +

            "&RespondentDetails=" + escape(RespondentDetails) +
            "&ProformaParties=" + escape(ProformaParties) +

            "&CaseProposing=" + escape(CaseProposing) +
            "&CaseType=" + escape(CaseType) +
            "&Department=" + escape(Department) +

            "&CourtDetail=" + escape(CourtDetail) +
            "&PlaceOfCourt=" + escape(PlaceOfCourt) +

            "&AreaOfComplaint=" + escape(AreaOfComplaint) +

            "&WrittenStatementDate=" + escape(WrittenStatementDate) +
            "&FactsOfCase=" + escape(FactsOfCase) +

            "&ClaimAmount=" + escape(ClaimAmount) +

            "&AdvocateName=" + escape(AdvocateName) +
            "&AdvocateContact=" + escape(AdvocateContact) +

            "&PresentStatus=" + escape(PresentStatus) +

            "&NextHearingDate=" + escape(NextHearingDate) +
            "&NextHearingPurpose=" + escape(NextHearingPurpose) +

            "&InterimOrderDate=" + escape(InterimOrderDate) +
            "&InterimOrderReceivedDate=" + escape(InterimOrderReceivedDate) +

            "&InterimDirection=" + escape(InterimDirection) +
            "&InterimComplianceStatus=" + escape(InterimComplianceStatus) +
            "&InterimRemarks=" + escape(InterimRemarks) +

            "&DisposalDate=" + escape(DisposalDate) +
            "&FinalOrderReceivedDate=" + escape(FinalOrderReceivedDate) +

            "&AwardAmount=" + escape(AwardAmount) +

            "&FinalDirection=" + escape(FinalDirection) +
            "&FinalComplianceStatus=" + escape(FinalComplianceStatus) +
            "&FinalRemarks=" + escape(FinalRemarks)
        );

    });
//document.addEventListener("DOMContentLoaded", function () {

//    var exportBtn = document.getElementById("exporttoexcelagainstTheBank");

//    if (exportBtn) {

//        exportBtn.addEventListener("click", function () {

//            $("#myModalexport").modal("show");

//            var totalRecord = $("#againstBankTbody tr").length;
//            var pagesize = 500;

//            var recordsection = Math.ceil(totalRecord / pagesize);
//            $("#exportrecords").val(recordsection);
//            var html = '';

//            var html = '<option value="" selected>Please Select</option>';

//            for (var i = 1; i <= recordsection; i++) {

//                html += '<tr>';

//                html += '<td>Page No: ' + i + '</td>';
//                html += '<option value="' + i + '" > ' + i + ' </option>';
//                //html += '<td>' +
//                //    '<span style="cursor:pointer;color:#069;" ' +
//                //    'class="exporttoexcelfileagainstTheBank" ' +
//                //    'pageno="' + i + '">' +
//                //    'Download File' +
//                //    '</span>' +
//                //    '</td>';

//                html += '</tr>';
//            }

//            document.getElementById("printexport").innerHTML = html;
//            var footerHtml = `
//                <div class="modal-footer">

//                    <button type="button"
//                            class="btn btn-secondary"
//                            data-dismiss="modal">
//                        Cancel
//                    </button>

//                    <button type="button"
//                            class="btn btn-primary"
//                            id="exporttoexcelfileagainstTheBank">
//                        Confirm
//                    </button>

//                </div>
//            `;

//            $(".modal-footer").remove();

//            $("#myModalexport .modal-content").append(footerHtml);
//        });

//    }

//});


//document.addEventListener("click", function (e) {

//    if (e.target.classList.contains("exporttoexcelfileagainstTheBank")) {

//        var pageno = e.target.getAttribute("pageno");

//        window.location =
//            "/CW/ExportToExcelAgainstBankBOM?pagenum=" + pageno + "&pagesize=500";
//    }

//});
//$(document).on("click", "#exporttoexcelfileagainstTheBank", function () {

//    var CaseNo = $("#caseNo2").val() || "";
//    var CaseId = $("#caseId2").val() || "";

//    var Zone = $("#zone2").val() || "";
//    var Branch = $("#branch2").val() || "";

//    var AccountHolderName = $("#accountHolderName").val() || "";
//    var ClaimantAddress = $("#claimantDetails").val() || "";

//    var CIFNo = $("#cifNo2").val() || "";
//    var AccountNo = $("#accountNo2").val() || "";

//    var FirstSummonDate = $("#firstSummonDate2").val() || "";
//    var FirstSummonReceivedDate = $("#firstSummonReceivedDate2").val() || "";

//    var RespondentDetails = $("#respondentDetails2").val() || "";
//    var ProformaParties = $("#proformaParties").val() || "";

//    var CaseProposing = $("#caseProposing").val() || "";
//    var CaseType = $("#caseType2").val() || "";
//    var Department = $("#department").val() || "";

//    var CourtDetail = $("#courtDetail2").val() || "";
//    var PlaceOfCourt = $("#placeOfCourt2").val() || "";

//    var AreaOfComplaint = $("#complaintArea").val() || "";

//    var WrittenStatementDate = $("#writtenStatementDate2").val() || "";
//    var FactsOfCase = $("#factsReason").val() || "";

//    var ClaimAmount = $("#claimAmount2").val() || "";

//    var AdvocateName = $("#advocateName").val() || "";
//    var AdvocateContact = $("#advocateContact").val() || "";

//    var PresentStatus = $("#presentStatus2").val() || "";

//    var NextHearingDate = $("#nextHearingDate2").val() || "";
//    var NextHearingPurpose = $("#nextHearingPurpose2").val() || "";

//    var InterimOrderDate = $("#interimOrderDate2").val() || "";
//    var InterimOrderReceivedDate = $("#interimOrderReceivedDate2").val() || "";

//    var InterimDirection = $("#interimDirection2").val() || "";
//    var InterimComplianceStatus = $("#interimCompliance2").val() || "";
//    var InterimRemarks = $("#interimRemarks2").val() || "";

//    var DisposalDate = $("#disposalDate2").val() || "";
//    var FinalOrderReceivedDate = $("#finalOrderReceivedDate2").val() || "";

//    var AwardAmount = $("#awardAmount2").val() || "";

//    var FinalDirection = $("#finalDirection2").val() || "";
//    var FinalComplianceStatus = $("#finalCompliance2").val() || "";
//    var FinalRemarks = $("#finalRemarks2").val() || "";

//    window.location = encodeURI(
//        "/CW/ExportToExcelAgainstBank?" +

//        "CaseNo=" + escape(CaseNo) +
//        "&CaseId=" + escape(CaseId) +

//        "&Zone=" + escape(Zone) +
//        "&Branch=" + escape(Branch) +

//        "&AccountHolderName=" + escape(AccountHolderName) +
//        "&ClaimantAddress=" + escape(ClaimantAddress) +

//        "&CIFNo=" + escape(CIFNo) +
//        "&AccountNo=" + escape(AccountNo) +

//        "&FirstSummonDate=" + escape(FirstSummonDate) +
//        "&FirstSummonReceivedDate=" + escape(FirstSummonReceivedDate) +

//        "&RespondentDetails=" + escape(RespondentDetails) +
//        "&ProformaParties=" + escape(ProformaParties) +

//        "&CaseProposing=" + escape(CaseProposing) +
//        "&CaseType=" + escape(CaseType) +
//        "&Department=" + escape(Department) +

//        "&CourtDetail=" + escape(CourtDetail) +
//        "&PlaceOfCourt=" + escape(PlaceOfCourt) +

//        "&AreaOfComplaint=" + escape(AreaOfComplaint) +

//        "&WrittenStatementDate=" + escape(WrittenStatementDate) +
//        "&FactsOfCase=" + escape(FactsOfCase) +

//        "&ClaimAmount=" + escape(ClaimAmount) +

//        "&AdvocateName=" + escape(AdvocateName) +
//        "&AdvocateContact=" + escape(AdvocateContact) +

//        "&PresentStatus=" + escape(PresentStatus) +

//        "&NextHearingDate=" + escape(NextHearingDate) +
//        "&NextHearingPurpose=" + escape(NextHearingPurpose) +

//        "&InterimOrderDate=" + escape(InterimOrderDate) +
//        "&InterimOrderReceivedDate=" + escape(InterimOrderReceivedDate) +

//        "&InterimDirection=" + escape(InterimDirection) +
//        "&InterimComplianceStatus=" + escape(InterimComplianceStatus) +
//        "&InterimRemarks=" + escape(InterimRemarks) +

//        "&DisposalDate=" + escape(DisposalDate) +
//        "&FinalOrderReceivedDate=" + escape(FinalOrderReceivedDate) +

//        "&AwardAmount=" + escape(AwardAmount) +

//        "&FinalDirection=" + escape(FinalDirection) +
//        "&FinalComplianceStatus=" + escape(FinalComplianceStatus) +
//        "&FinalRemarks=" + escape(FinalRemarks)
//    );

//});

document.addEventListener("DOMContentLoaded", function () {

    var exportBtn = document.getElementById("exporttoexcelconsumerCases");

    if (exportBtn) {

        exportBtn.addEventListener("click", function () {

            $("#myModalexport").modal("show");

            var totalRecord = $("#consumerCasesTableBody tr").length;

            var pagesize = 500;

            var recordsection = Math.ceil(totalRecord / pagesize);

            var html = '<option value="" selected>Please Select</option>';

            for (var i = 1; i <= recordsection; i++) {

                html += '<option value="' + i + '">' + i + '</option>';
            }

            document.getElementById("printexport").innerHTML = html;

            // ================= DYNAMIC FOOTER =================

            var footerHtml = `
                <div class="modal-footer">

                    <button type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                        Cancel
                    </button>

                    <button type="button"
                            class="btn btn-primary"
                            id="exporttoexcelfileconsumerCases">
                        Confirm
                    </button>

                </div>
            `;

            $(".modal-footer").remove();

            $("#myModalexport .modal-content").append(footerHtml);
        });

    }

});


// ================= EXPORT CLICK =================

$(document).off("click", "#exporttoexcelfileconsumerCases")
    .on("click", "#exporttoexcelfileconsumerCases", function () {

        var pageno = $("#printexport").val();

        if (!pageno) {

            alert("Please select page number");

            return;
        }

        var CaseNo = $("#caseNo").val() || "";
        var CaseId = $("#caseId").val() || "";

        var Zone = $("#zone").val() || "";
        var Branch = $("#branch").val() || "";

        var PetitionerName = $("#petitionerName").val() || "";

        var CIFNo = $("#cifNo").val() || "";
        var AccountNo = $("#accountNo").val() || "";

        var FirstSummonDate = $("#firstSummonDate").val() || "";
        var FirstSummonReceivedDate = $("#firstSummonReceivedDate").val() || "";

        var RespondentDetails = $("#respondentDetails").val() || "";

        var FilingDate = $("#filingDate").val() || "";
        var PresentStatus = $("#presentStatus").val() || "";

        var CourtDetail = $("#courtDetail").val() || "";
        var PlaceOfCourt = $("#placeOfCourt").val() || "";

        var ClaimAmount = $("#claimAmount").val() || "";
        var CaseType = $("#caseType").val() || "";

        var AreaOfComplaint = $("#areaOfComplaint").val() || "";
        var FactsOfCase = $("#factsOfCase").val() || "";

        var WrittenStatementDate = $("#writtenStatementDate").val() || "";

        var NextHearingDate = $("#nextHearingDate").val() || "";
        var NextHearingPurpose = $("#nextHearingPurpose").val() || "";

        var InterimOrderDate = $("#interimOrderDate").val() || "";
        var InterimOrderReceivedDate = $("#interimOrderReceivedDate").val() || "";

        var InterimDirection = $("#interimDirection").val() || "";
        var InterimComplianceStatus = $("#interimCompliance").val() || "";
        var InterimRemarks = $("#interimRemarks").val() || "";

        var DisposalDate = $("#disposalDate").val() || "";
        var FinalOrderReceivedDate = $("#finalOrderReceivedDate").val() || "";

        var AwardAmount = $("#awardAmount").val() || "";

        var FinalDirection = $("#finalDirection").val() || "";
        var FinalComplianceStatus = $("#finalCompliance").val() || "";
        var FinalRemarks = $("#finalRemarks").val() || "";

        var AdvocateName = $("#advocateName").val() || "";
        var AdvocateContact = $("#advocateContact").val() || "";

        window.location = encodeURI(

            "/CW/ExportToExcelConsumerCasesBOM?" +

            "pagenum=" + escape(pageno) +
            "&pagesize=500" +

            "&CaseNo=" + escape(CaseNo) +
            "&CaseId=" + escape(CaseId) +

            "&Zone=" + escape(Zone) +
            "&Branch=" + escape(Branch) +

            "&PetitionerName=" + escape(PetitionerName) +

            "&CIFNo=" + escape(CIFNo) +
            "&AccountNo=" + escape(AccountNo) +

            "&FirstSummonDate=" + escape(FirstSummonDate) +
            "&FirstSummonReceivedDate=" + escape(FirstSummonReceivedDate) +

            "&RespondentDetails=" + escape(RespondentDetails) +

            "&FilingDate=" + escape(FilingDate) +
            "&PresentStatus=" + escape(PresentStatus) +

            "&CourtDetail=" + escape(CourtDetail) +
            "&PlaceOfCourt=" + escape(PlaceOfCourt) +

            "&ClaimAmount=" + escape(ClaimAmount) +
            "&CaseType=" + escape(CaseType) +

            "&AreaOfComplaint=" + escape(AreaOfComplaint) +
            "&FactsOfCase=" + escape(FactsOfCase) +

            "&WrittenStatementDate=" + escape(WrittenStatementDate) +

            "&NextHearingDate=" + escape(NextHearingDate) +
            "&NextHearingPurpose=" + escape(NextHearingPurpose) +

            "&InterimOrderDate=" + escape(InterimOrderDate) +
            "&InterimOrderReceivedDate=" + escape(InterimOrderReceivedDate) +

            "&InterimDirection=" + escape(InterimDirection) +
            "&InterimComplianceStatus=" + escape(InterimComplianceStatus) +
            "&InterimRemarks=" + escape(InterimRemarks) +

            "&DisposalDate=" + escape(DisposalDate) +
            "&FinalOrderReceivedDate=" + escape(FinalOrderReceivedDate) +

            "&AwardAmount=" + escape(AwardAmount) +

            "&FinalDirection=" + escape(FinalDirection) +
            "&FinalComplianceStatus=" + escape(FinalComplianceStatus) +
            "&FinalRemarks=" + escape(FinalRemarks) +

            "&AdvocateName=" + escape(AdvocateName) +
            "&AdvocateContact=" + escape(AdvocateContact)

        );

    });
//document.addEventListener("DOMContentLoaded", function () {

//    var exportBtn = document.getElementById("exporttoexcelconsumerCases");

//    if (exportBtn) {

//        exportBtn.addEventListener("click", function () {

//            $("#myModalexport").modal("show");

//            var totalRecord = $("#consumerCasesTableBody tr").length;
//            var pagesize = 500;

//            var recordsection = Math.ceil(totalRecord / pagesize);

//            var html = '';

//            for (var i = 1; i <= recordsection; i++) {

//                html += '<tr>';

//                html += '<td>Page No: ' + i + '</td>';

//                html += '<td>' +
//                    '<span style="cursor:pointer;color:#069;" ' +
//                    'class="exporttoexcelfileconsumerCases" ' +
//                    'pageno="' + i + '">' +
//                    'Download File' +
//                    '</span>' +
//                    '</td>';

//                html += '</tr>';
//            }

//            document.getElementById("printexport").innerHTML = html;
//        });

//    }

//});


//document.addEventListener("click", function (e) {

//    if (e.target.classList.contains("exporttoexcelfileconsumerCases")) {

//        var pageno = e.target.getAttribute("pageno");

//        window.location =
//            "/CW/ExportToExcelConsumerCasesBOM?pagenum=" + pageno + "&pagesize=500";
//    }

//});

//$(document).on("click", "#exporttoexcelfileconsumerCases", function () {

//    var CaseNo = $("#caseNo").val() || "";
//    var CaseId = $("#caseId").val() || "";

//    var Zone = $("#zone").val() || "";
//    var Branch = $("#branch").val() || "";

//    var PetitionerName = $("#petitionerName").val() || "";

//    var CIFNo = $("#cifNo").val() || "";
//    var AccountNo = $("#accountNo").val() || "";

//    var FirstSummonDate = $("#firstSummonDate").val() || "";
//    var FirstSummonReceivedDate = $("#firstSummonReceivedDate").val() || "";

//    var RespondentDetails = $("#respondentDetails").val() || "";

//    var FilingDate = $("#filingDate").val() || "";
//    var PresentStatus = $("#presentStatus").val() || "";

//    var CourtDetail = $("#courtDetail").val() || "";
//    var PlaceOfCourt = $("#placeOfCourt").val() || "";

//    var ClaimAmount = $("#claimAmount").val() || "";
//    var CaseType = $("#caseType").val() || "";

//    var AreaOfComplaint = $("#areaOfComplaint").val() || "";
//    var FactsOfCase = $("#factsOfCase").val() || "";

//    var WrittenStatementDate = $("#writtenStatementDate").val() || "";

//    var NextHearingDate = $("#nextHearingDate").val() || "";
//    var NextHearingPurpose = $("#nextHearingPurpose").val() || "";

//    var InterimOrderDate = $("#interimOrderDate").val() || "";
//    var InterimOrderReceivedDate = $("#interimOrderReceivedDate").val() || "";

//    var InterimDirection = $("#interimDirection").val() || "";
//    var InterimComplianceStatus = $("#interimCompliance").val() || "";
//    var InterimRemarks = $("#interimRemarks").val() || "";

//    var DisposalDate = $("#disposalDate").val() || "";
//    var FinalOrderReceivedDate = $("#finalOrderReceivedDate").val() || "";

//    var AwardAmount = $("#awardAmount").val() || "";

//    var FinalDirection = $("#finalDirection").val() || "";
//    var FinalComplianceStatus = $("#finalCompliance").val() || "";
//    var FinalRemarks = $("#finalRemarks").val() || "";

//    var AdvocateName = $("#advocateName").val() || "";
//    var AdvocateContact = $("#advocateContact").val() || "";

//    window.location = encodeURI(

//        "/CW/ExportToExcelConsumerCasesBOM?" +

//        "CaseNo=" + escape(CaseNo) +
//        "&CaseId=" + escape(CaseId) +

//        "&Zone=" + escape(Zone) +
//        "&Branch=" + escape(Branch) +

//        "&PetitionerName=" + escape(PetitionerName) +

//        "&CIFNo=" + escape(CIFNo) +
//        "&AccountNo=" + escape(AccountNo) +

//        "&FirstSummonDate=" + escape(FirstSummonDate) +
//        "&FirstSummonReceivedDate=" + escape(FirstSummonReceivedDate) +

//        "&RespondentDetails=" + escape(RespondentDetails) +

//        "&FilingDate=" + escape(FilingDate) +
//        "&PresentStatus=" + escape(PresentStatus) +

//        "&CourtDetail=" + escape(CourtDetail) +
//        "&PlaceOfCourt=" + escape(PlaceOfCourt) +

//        "&ClaimAmount=" + escape(ClaimAmount) +
//        "&CaseType=" + escape(CaseType) +

//        "&AreaOfComplaint=" + escape(AreaOfComplaint) +
//        "&FactsOfCase=" + escape(FactsOfCase) +

//        "&WrittenStatementDate=" + escape(WrittenStatementDate) +

//        "&NextHearingDate=" + escape(NextHearingDate) +
//        "&NextHearingPurpose=" + escape(NextHearingPurpose) +

//        "&InterimOrderDate=" + escape(InterimOrderDate) +
//        "&InterimOrderReceivedDate=" + escape(InterimOrderReceivedDate) +

//        "&InterimDirection=" + escape(InterimDirection) +
//        "&InterimComplianceStatus=" + escape(InterimComplianceStatus) +
//        "&InterimRemarks=" + escape(InterimRemarks) +

//        "&DisposalDate=" + escape(DisposalDate) +
//        "&FinalOrderReceivedDate=" + escape(FinalOrderReceivedDate) +

//        "&AwardAmount=" + escape(AwardAmount) +

//        "&FinalDirection=" + escape(FinalDirection) +
//        "&FinalComplianceStatus=" + escape(FinalComplianceStatus) +
//        "&FinalRemarks=" + escape(FinalRemarks) +

//        "&AdvocateName=" + escape(AdvocateName) +
//        "&AdvocateContact=" + escape(AdvocateContact)

//    );

//});

//document.addEventListener("DOMContentLoaded", function () {

//    var exportBtn = document.getElementById("exporttoexcelcontingentLiability");

//    if (exportBtn) {

//        exportBtn.addEventListener("click", function () {

//            $("#myModalexport").modal("show");

//            var totalRecord = $("#contingentLiabilityTableBody tr").length;
//            var pagesize = 500;

//            var recordsection = Math.ceil(totalRecord / pagesize);

//            var html = '';

//            for (var i = 1; i <= recordsection; i++) {

//                html += '<tr>';

//                html += '<td>Page No: ' + i + '</td>';

//                html += '<td>' +
//                    '<span style="cursor:pointer;color:#069;" ' +
//                    'class="exporttoexcelfilecontingentLiability" ' +
//                    'pageno="' + i + '">' +
//                    'Download File' +
//                    '</span>' +
//                    '</td>';

//                html += '</tr>';
//            }

//            document.getElementById("printexport").innerHTML = html;
//        });

//    }

//});


//document.addEventListener("click", function (e) {

//    if (e.target.classList.contains("exporttoexcelfilecontingentLiability")) {

//        var pageno = e.target.getAttribute("pageno");

//        window.location =
//            "/CW/ExportToExcelContingentLiability?pagenum=" + pageno + "&pagesize=500";
//    }

//});

//// ================= EXPORT TO EXCEL - CONTINGENT LIABILITY =================

//$(document).on("click", "#exporttoexcelfilecontingentLiability", function () {

//    var CaseId = $("#caseId").val() || "";
//    var CaseNo = $("#caseNo").val() || "";

//    var Zone = $("#zone").val() || "";
//    var Branch = $("#branch").val() || "";

//    // ================= ACCOUNT / CLAIMANT =================

//    var AccountHolderName = $("#accountHolderName").val() || "";
//    var ClaimantName = $("#claimantName").val() || "";
//    var ClaimantAddress = $("#claimantAddress").val() || "";

//    // ================= CLAIM DETAILS =================

//    var DateOfClaim = $("#dateOfClaim").val() || "";

//    // ================= CLAIM BREAKUP =================

//    var BankGuarantee = $("#bankGuarantee").val() || "";
//    var LetterOfCredit = $("#letterOfCredit").val() || "";
//    var WrongPayment = $("#wrongPayment").val() || "";
//    var Fraud = $("#fraud").val() || "";
//    var CounterClaim = $("#counterClaim").val() || "";
//    var OthersClaim = $("#othersClaim").val() || "";

//    // ================= SECURITY =================

//    var NatureOfSecurity = $("#natureOfSecurity").val() || "";
//    var RealisableValue = $("#realisableValue").val() || "";

//    // ================= FACTS =================

//    var FactsOfCase = $("#factsOfCase").val() || "";

//    // ================= HEARING =================

//    var NextHearingPurpose = $("#nextHearingPurpose").val() || "";
//    var NextHearingDate = $("#nextHearingDate").val() || "";

//    // ================= PROVISION =================

//    var ProvisionDetail = $("#provisionDetail").val() || "";
//    var YearOfProvision = $("#yearOfProvision").val() || "";

//    var AmountProvision = $("#amountProvision").val() || "";
//    var AmountDepositedInCourt = $("#amountDepositedInCourt").val() || "";

//    window.location = encodeURI(

//        "/CW/ExportToExcelContingentLiability?" +

//        "CaseId=" + escape(CaseId) +
//        "&CaseNo=" + escape(CaseNo) +

//        "&Zone=" + escape(Zone) +
//        "&Branch=" + escape(Branch) +

//        "&AccountHolderName=" + escape(AccountHolderName) +
//        "&ClaimantName=" + escape(ClaimantName) +
//        "&ClaimantAddress=" + escape(ClaimantAddress) +

//        "&DateOfClaim=" + escape(DateOfClaim) +

//        "&BankGuarantee=" + escape(BankGuarantee) +
//        "&LetterOfCredit=" + escape(LetterOfCredit) +
//        "&WrongPayment=" + escape(WrongPayment) +
//        "&Fraud=" + escape(Fraud) +
//        "&CounterClaim=" + escape(CounterClaim) +
//        "&OthersClaim=" + escape(OthersClaim) +

//        "&NatureOfSecurity=" + escape(NatureOfSecurity) +
//        "&RealisableValue=" + escape(RealisableValue) +

//        "&FactsOfCase=" + escape(FactsOfCase) +

//        "&NextHearingPurpose=" + escape(NextHearingPurpose) +
//        "&NextHearingDate=" + escape(NextHearingDate) +

//        "&ProvisionDetail=" + escape(ProvisionDetail) +
//        "&YearOfProvision=" + escape(YearOfProvision) +

//        "&AmountProvision=" + escape(AmountProvision) +
//        "&AmountDepositedInCourt=" + escape(AmountDepositedInCourt)

//    );

//});
document.addEventListener("DOMContentLoaded", function () {

    var exportBtn = document.getElementById("exporttoexcelcontingentLiability");

    if (exportBtn) {

        exportBtn.addEventListener("click", function () {

            $("#myModalexport").modal("show");

            var totalRecord = $("#contingentLiabilityTableBody tr").length;
            var pagesize = 500;

            var recordsection = Math.ceil(totalRecord / pagesize);

            var html = '<option value="" selected>Please Select</option>';

            for (var i = 1; i <= recordsection; i++) {

                html += '<option value="' + i + '">' + i +
                    '</option>';
            }

            document.getElementById("printexport").innerHTML = html;

            // ================= DYNAMIC FOOTER =================

            var footerHtml = `
                <div class="modal-footer">

                    <button type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                        Cancel
                    </button>

                    <button type="button"
                            class="btn btn-primary"
                            id="exporttoexcelfilecontingentLiability">
                        Confirm
                    </button>

                </div>
            `;

            $("#myModalexport .modal-footer").remove();

            $("#myModalexport .modal-content").append(footerHtml);
        });

    }

});

// ================= EXPORT CLICK =================

$(document).on("click", "#exporttoexcelfilecontingentLiability", function () {

    var pageno = $("#printexport").val() || 1;

    var CaseId = $("#caseId").val() || "";
    var CaseNo = $("#caseNo").val() || "";

    var Zone = $("#zone").val() || "";
    var Branch = $("#branch").val() || "";

    // ================= ACCOUNT / CLAIMANT =================

    var AccountHolderName = $("#accountHolderName").val() || "";
    var ClaimantName = $("#claimantName").val() || "";
    var ClaimantAddress = $("#claimantAddress").val() || "";

    // ================= CLAIM DETAILS =================

    var DateOfClaim = $("#dateOfClaim").val() || "";

    // ================= CLAIM BREAKUP =================

    var BankGuarantee = $("#bankGuarantee").val() || "";
    var LetterOfCredit = $("#letterOfCredit").val() || "";
    var WrongPayment = $("#wrongPayment").val() || "";
    var Fraud = $("#fraud").val() || "";
    var CounterClaim = $("#counterClaim").val() || "";
    var OthersClaim = $("#othersClaim").val() || "";

    // ================= SECURITY =================

    var NatureOfSecurity = $("#natureOfSecurity").val() || "";
    var RealisableValue = $("#realisableValue").val() || "";

    // ================= FACTS =================

    var FactsOfCase = $("#factsOfCase").val() || "";

    // ================= HEARING =================

    var NextHearingPurpose = $("#nextHearingPurpose").val() || "";
    var NextHearingDate = $("#nextHearingDate").val() || "";

    // ================= PROVISION =================

    var ProvisionDetail = $("#provisionDetail").val() || "";
    var YearOfProvision = $("#yearOfProvision").val() || "";

    var AmountProvision = $("#amountProvision").val() || "";
    var AmountDepositedInCourt = $("#amountDepositedInCourt").val() || "";

    window.location = encodeURI(

        "/CW/ExportToExcelContingentLiability?" +

        "pagenum=" + escape(pageno) +
        "&pagesize=500" +

        "&CaseId=" + escape(CaseId) +
        "&CaseNo=" + escape(CaseNo) +

        "&Zone=" + escape(Zone) +
        "&Branch=" + escape(Branch) +

        "&AccountHolderName=" + escape(AccountHolderName) +
        "&ClaimantName=" + escape(ClaimantName) +
        "&ClaimantAddress=" + escape(ClaimantAddress) +

        "&DateOfClaim=" + escape(DateOfClaim) +

        "&BankGuarantee=" + escape(BankGuarantee) +
        "&LetterOfCredit=" + escape(LetterOfCredit) +
        "&WrongPayment=" + escape(WrongPayment) +
        "&Fraud=" + escape(Fraud) +
        "&CounterClaim=" + escape(CounterClaim) +
        "&OthersClaim=" + escape(OthersClaim) +

        "&NatureOfSecurity=" + escape(NatureOfSecurity) +
        "&RealisableValue=" + escape(RealisableValue) +

        "&FactsOfCase=" + escape(FactsOfCase) +

        "&NextHearingPurpose=" + escape(NextHearingPurpose) +
        "&NextHearingDate=" + escape(NextHearingDate) +

        "&ProvisionDetail=" + escape(ProvisionDetail) +
        "&YearOfProvision=" + escape(YearOfProvision) +

        "&AmountProvision=" + escape(AmountProvision) +
        "&AmountDepositedInCourt=" + escape(AmountDepositedInCourt)

    );

});

$(document).on("click", "#ColumnSelectionopenconsumerCases", function () {
    $('#myModalCustomizedcolumnconsumerCases').modal('show');
});
$(document).on("click", "#ColumnSelectionopencontingentLiability", function () {
    //LoadColumnMaster();
    $('#myModalCustomizedcolumncontingentLiability').modal({ show: true });
});
$(document).on("click", "#ColumnSelectionopenagainstTheBank", function () {
    //LoadColumnMaster();
    $('#myModalCustomizedcolumnagainstTheBank').modal({ show: true });
});
function applyContingentColumnVisibility() {

    $(".contingentcheckbox").each(function () {

        var columnClass = $(this).attr("name");

        var isChecked = $(this).prop("checked");

        if (isChecked) {

            $("." + columnClass).css("display", "");

        } else {

            $("." + columnClass).css("display", "none");
        }
    });
}
$(document).off("change", ".contingentcheckbox")
    .on("change", ".contingentcheckbox", function () {

        var columnClass = $(this).attr("name");

        var isChecked = $(this).prop("checked");

        if (isChecked) {

            $("." + columnClass).css("display", "none");

        } else {

            $("." + columnClass).css("display", "");
        }
    });
$(document).off("change", "#selectAllcontingentColumns")
    .on("change", "#selectAllcontingentColumns", function () {

        var isChecked = $(this).prop("checked");

        $(".contingentcheckbox").prop("checked", isChecked);

        applyContingentColumnVisibility();
    });
function applyConsumerColumnVisibility() {

    $(".Consumercheckbox").each(function () {

        var columnClass = $(this).attr("name");

        var isChecked = $(this).prop("checked");

        if (isChecked) {

            $("." + columnClass).css("display", "");

        } else {

            $("." + columnClass).css("display", "none");
        }
    });
}
$(document).off("change", ".Consumercheckbox")
    .on("change", ".Consumercheckbox", function () {

        var columnClass = $(this).attr("name");

        var isChecked = $(this).prop("checked");

        if (isChecked) {

            $("." + columnClass).css("display", "none");

        } else {

            $("." + columnClass).css("display", "");
        }
    });
$(document).off("change", "#selectAllConsumerColumns")
    .on("change", "#selectAllConsumerColumns", function () {

        var isChecked = $(this).prop("checked");

        $(".Consumercheckbox").prop("checked", isChecked);

        applyConsumerColumnVisibility();
    });
function applyAgainstColumnVisibility() {

    $(".Againstcheckbox").each(function () {

        var columnClass = $(this).attr("name");

        var isChecked = $(this).prop("checked");

        if (isChecked) {

            $("." + columnClass).css("display", "");

        } else {

            $("." + columnClass).css("display", "none");
        }
    });
}
$(document).off("change", ".Againstcheckbox")
    .on("change", ".Againstcheckbox", function () {

        var columnClass = $(this).attr("name");

        var isChecked = $(this).prop("checked");

        if (isChecked) {

            $("." + columnClass).css("display", "none");

        } else {

            $("." + columnClass).css("display", "");
        }
    });
$(document).off("change", "#selectAllAgainstColumns")
    .on("change", "#selectAllAgainstColumns", function () {

        var isChecked = $(this).prop("checked");

        $(".Againstcheckbox").prop("checked", isChecked);

        applyAgainstColumnVisibility();
    });
setTimeout(function () {

    $(".status-star")
        .removeClass("text-danger")
        .addClass("text-success");

}, 1800000);


$(document).on("click", "#idcustomcommonFilterConsumer", function () {
    $('#myModalCustomCommonFilterConsumer').modal({ show: true });

});
$(document).on("click", "#idcustomcommonFilterContingent", function () {
    $('#myModalCustomCommonFilterContingent').modal({ show: true });

});
$(document).on("click", "#idcustomcommonFilterAgainst", function () {
    $('#myModalCustomCommonFilterAgainst').modal({ show: true });

});
//For Search Clear
$(document).on("click", "#CancelCommonDashbConsumer", function () {

    $("#commonforresetConsumer")[0].reset();

    $('#myModalCustomCommonFilterConsumer').modal('hide');

    loadflag = true;
    isRenderPage = false;

    // Reload data without filters
    loadConsumerCases('', '', '', '', '', '', '', '', '', '', '');
});

$(document).on("click", "#SearchCommondetailsConsumer", function () {

    loadflag = true;
    isRenderPage = false;

    let nextHearingFromDate = $("#NexthearingfrmdateConsumer").val();
    let nextHearingToDate = $("#NexthearingdateToConsumer").val();

    let disposalFromDate = $("#disposaldateConsumer").val();
    let disposalToDate = $("#disposalToConsumer").val();

    let presentStatus = $("#courtstatusfilterConsumer").val();

    loadConsumerCases(
        "",
        "",
        "",
        "",
        "",
        "",
        nextHearingFromDate,
        nextHearingToDate,
        disposalFromDate,
        disposalToDate,
        presentStatus
    );

    $('#myModalCustomCommonFilterConsumer').modal('hide');
});
//For Search Clear
$(document).on("click", "#CancelCommonDashbAgainst", function () {

    // reset form
    $("#commonforresetAgainst")[0].reset();

    // clear all filter fields manually if needed
    $("#NexthearingfrmdateAgainst").val('');
    $("#NexthearingdateToAgainst").val('');

    $("#disposaldateAgainst").val('');
    $("#disposaldateToAgainst").val('');

    $("#courtstatusfilterAgainst").val('');

    // optional other filters
    $("#courtfilterAgainst").val('');
    $("#placefilterAgainst").val('');
    $("#casenofilterAgainst").val('');

    // close modal
    $('#myModalCustomCommonFilterAgainst').modal('hide');

    loadflag = true;
    isRenderPage = false;

    // reload data without filters
    loadAgainstBankData("", "", "", "", "", "", "", "", "", 1);
});
$(document).on("click", "#SearchCommondetailsAgainst", function () {

    loadflag = true;
    isRenderPage = false;

    let nextHearingFromDate = $("#NexthearingfrmdateAgainst").val();
    let nextHearingToDate = $("#NexthearingdateToAgainst").val();

    let disposalFromDate = $("#disposaldateAgainst").val();
    let disposalToDate = $("#disposaldateToAgainst").val();

    let presentStatus = $("#courtstatusfilterAgainst").val();

    // existing filters if available
    let courtDetail = $("#courtfilterAgainst").val() || "";
    let placeOfCourt = $("#placefilterAgainst").val() || "";
    let caseNo = $("#casenofilterAgainst").val() || "";

    $("#myModalCustomCommonFilterAgainst").modal("hide");

    loadAgainstBankData(
        courtDetail,
        placeOfCourt,
        caseNo,
        "",
        presentStatus,
        nextHearingFromDate,
        nextHearingToDate,
        disposalFromDate,
        disposalToDate
    );
});
//For Search Clear
$(document).on("click", "#CancelCommonDashbContingent", function () {

    // reset form
    $("#commonforresetContingent")[0].reset();

    // clear filters
    $("#NexthearingfrmdateContingent").val('');
    $("#NexthearingdateToContingent").val('');

    $("#dateOfClaimContingent").val('');
    $("#dateOfClaimToContingent").val('');

    $("#courtstatusfilterContingent").val('');

    // close modal
    $('#myModalCustomCommonFilterContingent').modal('hide');

    loadflag = true;
    isRenderPage = false;

    // reload without filters
    loadContingentLiability('', '', '', '', '', '', '', '', '');
});
$(document).on("click", "#SearchCommondetailsContingent", function () {

    loadflag = true;
    isRenderPage = false;

    let nextHearingDateFrom = $("#NexthearingfrmdateContingent").val();
    let nextHearingDateTo = $("#NexthearingdateToContingent").val();

    let dateOfClaimFrom = $("#dateOfClaimContingent").val();
    let dateOfClaimTo = $("#dateOfClaimToContingent").val();

    let presentStatus = $("#courtstatusfilterContingent").val();

    // optional existing filters
    let caseNo = $("#casenofilterContingent").val() || "";
    let courtDetail = $("#courtfilterContingent").val() || "";
    let placeOfCourt = $("#placefilterContingent").val() || "";

    $('#myModalCustomCommonFilterContingent').modal('hide');

    loadContingentLiability(
        caseNo,
        "",
        courtDetail,
        placeOfCourt,
        nextHearingDateFrom,
        nextHearingDateTo,
        dateOfClaimFrom,
        dateOfClaimTo,
        presentStatus
    );
});

//Sorting

let contingentSortOrder = {};

let againstBankSortOrder = {};


$(document).ready(function () {

    $(document).on("click", "th.sortable", function () {
        debugger;

        let table = $(this).closest("table");

        let tbody = table.find("tbody");

        let rows = tbody.find("tr").toArray();

        let columnClass = $(this).data("column");

        let currentOrder = $(this).attr("data-order");

        let newOrder = currentOrder === "asc" ? "desc" : "asc";

        $("th.sortable").attr("data-order", "");

        $(this).attr("data-order", newOrder);

        rows.sort(function (a, b) {

            let aVal = $(a).find("." + columnClass).text().trim().toLowerCase();

            let bVal = $(b).find("." + columnClass).text().trim().toLowerCase();

            let aDate = Date.parse(aVal);

            let bDate = Date.parse(bVal);

            if (!isNaN(aDate) && !isNaN(bDate)) {

                return newOrder === "asc"
                    ? aDate - bDate
                    : bDate - aDate;
            }

            let aNum = parseFloat(aVal.replace(/,/g, ""));

            let bNum = parseFloat(bVal.replace(/,/g, ""));

            if (!isNaN(aNum) && !isNaN(bNum)) {

                return newOrder === "asc"
                    ? aNum - bNum
                    : bNum - aNum;
            }

            return newOrder === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);

        });

        $.each(rows, function (index, row) {

            tbody.append(row);

        });

    });

});


$(document).on("change", "#casefiltercourt", function () {

    var courtDetail = $(this).val();

    loadAgainstBankData(
        courtDetail,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    );
});

$(document).on("change", "#casefiltercourtConsumer", function () {

    var courtDetail = $(this).val();

    loadConsumerCases(
        "",
        "",
        courtDetail,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    )
});

function renderPaginationAgainst() {

    let paginationHtml = '';
    let maxVisible = 4;
    let delta = 2;

    if (totalPages <= maxVisible + 2) {

        for (let i = 1; i <= totalPages; i++) {

            paginationHtml += `
                <button class="page-btn-against ${i === currentPage ? 'active' : ''}"
                        data-page="${i}">
                    ${i}
                </button>`;
        }
    }
    else {

        paginationHtml += `
            <button class="page-btn-against ${currentPage === 1 ? 'active' : ''}"
                    data-page="1">
                1
            </button>`;

        let start = Math.max(2, currentPage - delta);
        let end = Math.min(totalPages - 1, currentPage + delta);

        if (currentPage <= maxVisible) {
            start = 2;
            end = maxVisible;
        }

        if (currentPage >= totalPages - maxVisible + 1) {
            start = totalPages - maxVisible + 1;
            end = totalPages - 1;
        }

        if (start > 2) {
            paginationHtml += `<span class="dots">...</span>`;
        }

        for (let i = start; i <= end; i++) {

            paginationHtml += `
                <button class="page-btn-against ${i === currentPage ? 'active' : ''}"
                        data-page="${i}">
                    ${i}
                </button>`;
        }

        if (end < totalPages - 1) {
            paginationHtml += `<span class="dots">...</span>`;
        }

        paginationHtml += `
            <button class="page-btn-against ${currentPage === totalPages ? 'active' : ''}"
                    data-page="${totalPages}">
                ${totalPages}
            </button>`;
    }

    $("#pageNumbersAgainst").html(paginationHtml);

    if (currentPage <= 1) {
        $("#prevAgainst").hide();
    }
    else {
        $("#prevAgainst").show();
    }

    if (currentPage >= totalPages) {
        $("#nextAgainst").hide();
    }
    else {
        $("#nextAgainst").show();
    }
}
$(document).off("click", ".page-btn-against");

$(document).on("click", ".page-btn-against", function () {

    let page = parseInt($(this).data("page"));

    loadAgainstBankData(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        page
    );
});
$(document).off("click", "#prevAgainst");

$(document).on("click", "#prevAgainst", function () {

    if (currentPage <= 1)
        return;

    loadAgainstBankData(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        currentPage - 1
    );
});

$(document).off("click", "#nextAgainst");

$(document).on("click", "#nextAgainst", function () {

    if (currentPage >= totalPages)
        return;

    loadAgainstBankData(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        currentPage + 1
    );
});

$(document).off("click", "#divGoAgainst");

$(document).on("click", "#divGoAgainst", function () {

    var page = parseInt($("#txtgopageAgainst").val());

    if (isNaN(page)) {
        return;
    }

    if (page < 1) {
        page = 1;
    }

    if (page > totalPages) {
        page = totalPages;
    }

    loadAgainstBankData(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        page
    );
});

function renderPaginationConsumer(pageindex, totPages) {

    currentConsumerPage = pageindex;
    totalConsumerPages = totPages;

    let paginationHtml = '';

    let maxVisible = 4;
    let delta = 2;

    if (totPages <= maxVisible + 2) {

        for (let i = 1; i <= totPages; i++) {

            paginationHtml += `
                <button class="page-btn ${i === pageindex ? 'active' : ''}"
                        data-page="${i}">
                    ${i}
                </button>`;
        }
    }
    else {

        paginationHtml += `
            <button class="page-btn ${pageindex === 1 ? 'active' : ''}"
                    data-page="1">
                1
            </button>`;

        let start = Math.max(2, pageindex - delta);
        let end = Math.min(totPages - 1, pageindex + delta);

        if (pageindex <= maxVisible) {
            start = 2;
            end = maxVisible;
        }

        if (pageindex >= totPages - maxVisible + 1) {
            start = totPages - maxVisible + 1;
            end = totPages - 1;
        }

        if (start > 2)
            paginationHtml += `<span class="dots">...</span>`;

        for (let i = start; i <= end; i++) {

            paginationHtml += `
                <button class="page-btn ${i === pageindex ? 'active' : ''}"
                        data-page="${i}">
                    ${i}
                </button>`;
        }

        if (end < totPages - 1)
            paginationHtml += `<span class="dots">...</span>`;

        paginationHtml += `
            <button class="page-btn ${pageindex === totPages ? 'active' : ''}"
                    data-page="${totPages}">
                ${totPages}
            </button>`;
    }

    $("#pageNumbersconsumer").html(paginationHtml);

    if (pageindex <= 1)
        $("#prevconsumer").hide();
    else
        $("#prevconsumer").show();

    if (pageindex >= totPages)
        $("#nextconsumer").hide();
    else
        $("#nextconsumer").show();
}

$(document).on("click", "#pageNumbersconsumer .page-btn", function () {

    let page = parseInt($(this).attr("data-page"));

    loadConsumerCases(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        page,
        ""
    );
});

$(document).on("click", "#prevconsumer", function () {

    if (currentConsumerPage > 1) {

        loadConsumerCases(
            $("#casefiltercourt").val(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            currentConsumerPage - 1,
            consumerPageSize
        );
    }
});

$(document).on("click", "#nextconsumer", function () {

    if (currentConsumerPage < totalConsumerPages) {

        loadConsumerCases(
            $("#casefiltercourt").val(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            currentConsumerPage + 1,
            consumerPageSize
        );
    }
});

$(document).on("click", "#divGoconsumer", function () {

    let page = parseInt($("#txtgopageconsumer").val());

    if (!isNaN(page) &&
        page >= 1 &&
        page <= totalConsumerPages) {

        loadConsumerCases(
            $("#casefiltercourt").val(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            page,
            consumerPageSize
        );
    }
});
function renderPaginationContingent(pageindex, totPages) {

    currentPageContingent = pageindex;
    totalPagesContingent = totPages;

    let paginationHtml = '';

    let maxVisible = 4;
    let delta = 2;

    if (totPages <= maxVisible + 2) {

        for (let i = 1; i <= totPages; i++) {

            paginationHtml += `
                <button class="page-btn ${i === pageindex ? 'active' : ''}"
                    data-page="${i}">
                    ${i}
                </button>`;
        }
    }
    else {

        paginationHtml += `
            <button class="page-btn ${pageindex === 1 ? 'active' : ''}"
                data-page="1">
                1
            </button>`;

        let start = Math.max(2, pageindex - delta);
        let end = Math.min(totPages - 1, pageindex + delta);

        if (pageindex <= maxVisible) {
            start = 2;
            end = maxVisible;
        }

        if (pageindex >= totPages - maxVisible + 1) {
            start = totPages - maxVisible + 1;
            end = totPages - 1;
        }

        if (start > 2)
            paginationHtml += `<span class="dots">...</span>`;

        for (let i = start; i <= end; i++) {

            paginationHtml += `
                <button class="page-btn ${i === pageindex ? 'active' : ''}"
                    data-page="${i}">
                    ${i}
                </button>`;
        }

        if (end < totPages - 1)
            paginationHtml += `<span class="dots">...</span>`;

        paginationHtml += `
            <button class="page-btn ${pageindex === totPages ? 'active' : ''}"
                data-page="${totPages}">
                ${totPages}
            </button>`;
    }

    $("#pageNumberscontingent").html(paginationHtml);

    if (pageindex <= 1)
        $("#prevcontingent").hide();
    else
        $("#prevcontingent").show();

    if (pageindex >= totPages)
        $("#nextcontingent").hide();
    else
        $("#nextcontingent").show();
}
$(document).on("click", "#pageNumberscontingent .page-btn", function () {

    let page = parseInt($(this).attr("data-page"));

    loadContingentLiability(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        page
    );
});
$(document).off("click", "#prevcontingent");

$(document).on("click", "#prevcontingent", function () {

    console.log("Prev clicked", currentPageContingent);

    if (currentPageContingent > 1) {

        loadContingentLiability(
            $("#casefiltercourt").val(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            currentPageContingent - 1
        );
    }
});
$(document).off("click", "#nextcontingent");

$(document).on("click", "#nextcontingent", function () {

    console.log("Next clicked", currentPageContingent, totalPagesContingent);

    if (currentPageContingent < totalPagesContingent) {

        loadContingentLiability(
            $("#casefiltercourt").val(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            currentPageContingent + 1
        );
    }
});
$(document).off("click", "#divGocontingent");

$(document).on("click", "#divGocontingent", function () {

    let page = parseInt($("#txtgopagecontingent").val());

    console.log("Go clicked", page);

    if (!page || page < 1 || page > totalPagesContingent) {
        alert("Invalid page number");
        return;
    }

    loadContingentLiability(
        $("#casefiltercourt").val(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        page
    );
});

$(document).on("click", "#searchcaseno", function () {
    var casefiltercasename = $("#caseNofilter").val();
    if (casefiltercasename == "") {
        alert("Please enter the case no.");
        $("#caseNofilter").focus();
        return false;
    }
    $("#searchcaseno").css("display", "none");
    $("#clearnewsearchcaseno").css("display", "unset");
    loadAgainstBankData(
        "",
        "",
        casefiltercasename,
        "",
        "",
        "",
        "",
        "",
        "",
        1
    );
});

$(document).on("click", "#clearnewsearchcaseno", function () {
    $("#caseNofilter").val("");
    $("#searchcaseno").css("display", "unset");
    $("#clearnewsearchcaseno").css("display", "none");
    loadAgainstBankData(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1,
        ""
    );
})

$(document).on("click", "#searchcaseID", function () {
    var casefiltercaseId = $("#caseIdfilter").val();
    if (casefiltercaseId == "") {
        alert("Please enter the case no.");
        $("#caseIdfilter").focus();
        return false;
    }
    $("#searchcaseID").css("display", "none");
    $("#clearnewsearchcaseID").css("display", "unset");
    loadAgainstBankData(
        "",
        "",
        "",
        casefiltercaseId,
        "",
        "",
        "",
        "",
        "",
        1
    );
});

$(document).on("click", "#clearnewsearchcaseID", function () {
    $("#caseIdfilter").val("");
    $("#clearnewsearchcaseID").css("display", "none");
    $("#searchcaseID").css("display", "unset");
    loadAgainstBankData(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1
    );
})

$(document).on("click", "#searchcaseIDConsumer", function () {
    var casefiltercaseId = $("#caseIdfilterConsumer").val();
    if (casefiltercaseId == "") {
        alert("Please enter the case no.");
        $("#caseIdfilterConsumer").focus();
        return false;
    }
    $("#searchcaseIDConsumer").css("display", "none");
    $("#clearnewsearchcaseIDConsumer").css("display", "unset");
    
    loadConsumerCases(
        "",
        casefiltercaseId,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1,
        ""
        
    );
});

$(document).on("click", "#clearnewsearchcaseIDConsumer", function () {
    $("#caseIdfilterConsumer").val("");
    $("#searchcaseIDConsumer").css("display", "unset")
    $("#clearnewsearchcaseIDConsumer").css("display", "none");
    loadConsumerCases(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1,
        ""
    );
})
$(document).on("click", "#searchcasenoConsumer", function () {
    var casefiltercasename = $("#caseNofilterConsumer").val();
    if (casefiltercasename == "") {
        alert("Please enter the case no.");
        $("#caseNofilterConsumer").focus();
        return false;
    }
    
    $("#searchcasenoConsumer").css("display", "none");
    $("#clearnewsearchcasenoConsumer").css("display", "unset");
    loadConsumerCases(
        casefiltercasename,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1,
        ""
    );
});

$(document).on("click", "#clearnewsearchcasenoConsumer", function () {
    $("#caseNofilterConsumer").val("");
    $("#clearnewsearchcasenoConsumer").css("display", "none");
    $("#searchcasenoConsumer").css("display", "unset");
    loadConsumerCases(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1,
        ""
    );
})
$(document).on("click", "#searchcaseIDContingent", function () {
    var casefiltercaseId = $("#caseIdfilterContingent").val();
    if (casefiltercaseId == "") {
        alert("Please enter the case no.");
        $("#caseIdfilterContingent").focus();
        return false;
    }
    $("#searchcaseIDContingent").css("display", "none");
    $("#clearnewsearchcaseIDContingent").css("display", "unset");
    loadContingentLiability(
        "",
        casefiltercaseId,
        "",
        "",
        "",
        "",
        "",
        "",
        1
    );
});

$(document).on("click", "#clearnewsearchcaseIDContingent", function () {
    $("#caseIdfilterContingent").val("");
    $("#searchcaseIDContingent").css("display", "unset");
    $("#clearnewsearchcaseIDContingent").css("display", "none");
    loadContingentLiability(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1
    );
})
$(document).on("click", "#searchcasenoContingent", function () {
    var casefiltercasename = $("#caseNofilterContingent").val();
    if (casefiltercasename == "") {
        alert("Please enter the case no.");
        $("#caseNofilter").focus();
        return false;
    }
    $("#searchcasenoContingent").css("display", "none");
    $("#clearnewsearchcasenoContingent").css("display", "unset");
    loadContingentLiability(
        casefiltercasename,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1
    );
});

$(document).on("click", "#clearnewsearchcasenoContingent", function () {
    $("#caseNofilterContingent").val("");
    $("#clearnewsearchcasenoContingent").css("display", "none");
    $("#searchcasenoContingent").css("display", "unset");
    loadContingentLiability(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        1
    );
})