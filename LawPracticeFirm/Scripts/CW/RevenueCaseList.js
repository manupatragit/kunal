BindRevenueCourt();
$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var fcode = localStorage.getItem("FirmCode");
    /*Pagination Start*/


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    PageNumber = setPageNo;
    //    loaddatalist(PageNumber);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = false;
        PageNumber = setPageNo;
        $("#txtgopage").val("");
        loaddatalist(PageNumber);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev").click(function () {
    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    PageNumber = setPageNo;
    //    loaddatalist(PageNumber);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        // loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        PageNumber = setPageNo;
        //renderPagination(setPageNo, totalPageRec)
        loaddatalist(PageNumber);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    PageNumber = setPageNo;
    //    loaddatalist(PageNumber);

    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        PageNumber = setPageNo;
        loaddatalist(PageNumber);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    isRenderPage = true;
    //    PageNumber = setPageNo;
    //    loaddatalist(PageNumber);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        PageNumber = setPageNo;
        isRenderPage = false;
        loaddatalist(PageNumber);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    loaddatalist(pageindex);
    /*Load my revenue detail list*/
    function loaddatalist(pageindex) {
        var formData = new FormData();
        var UserCaseIdValue = "";
        var revvCourtValue = $("#RevenueCourt").val();
        var StatusValue = $("#CaseStatus").val();
        var mandalvalue = $("#RevenueMandal").val();
        var janpadvalue = $("#RevenueJanpad").val();
        var tahsilvalue = $("#RevenueTahsil").val();
        var revenueCourtValues = $("#RevenueCourtName").val();
        var Searchtextvalue = $("#casename").val();
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var istypevalue = "";
        var SortValue = $("#sortdate").val();
        // Get values from RERH section (Rajasthan) if RELK values are empty
        if (revvCourtValue === 'RERH') {
            janpadvalue = $("#RevenueJanpad_RERH").val() || "";
            tahsilvalue = $("#RevenueTahsil_RERH").val() || "";
            revenueCourtValues = $("#RevenueCourtName_RERH").val() || "";
            mandalvalue = ""; // RERH doesn't use Mandal
        }
        formData.append("UserCaseIdValue", UserCaseIdValue);
        formData.append("revvCourtValue", revvCourtValue);
        formData.append("StatusValue", StatusValue);
        formData.append("mandalvalue", mandalvalue);
        formData.append("janpadvalue", janpadvalue);
        formData.append("tahsilvalue", tahsilvalue);
        formData.append("revenueCourtValues", revenueCourtValues);
        formData.append("Searchtextvalue", Searchtextvalue);
        formData.append("istypevalue", istypevalue);
        formData.append("SortValue", SortValue);
        formData.append("PageIndex", pageindex);
        if (fromdt != "" && todt != "") {
            pagesize = 10;
        }
        else {
            pagesize = 10;
        }
        formData.append("PageSize", pagesize);
        formData.append("Datefromvalue", fromdt);
        formData.append("Datetovalue", todt);
        openload();
        var html3 = '';
        $.ajax({
            async: true,
            type: "POST",
            url: "/Revenue/MyRevenueCases",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var length = response1.length;
                var qty = 0;
                if (length > 0) {

                    $("#pdatastatus").hide();
                    document.querySelector(".pagination").style.display = "flex";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });


                    $("#divalertlist tr").remove();
                    $.each(response1, function (i, val) {
                        qty = qty + 1;
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totdata = val.TotalRecord;
                        if (i === (length - 1)) {
                            $("#exportrecords").val(val.TotalRecord);
                            var totalRecord = val.TotalRecord;
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
                        }
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var Slash = "/";
                        html3 += '<tr>'
                        if (val.vCaseNo == "" && val.vCaseYear == "") {
                            var Slash = "";
                        }
                        if (val.cRefNo == "") {
                            html3 += val.Court == 'Rajasthan' ? '<td>' + val.vCaseNo + '</td>' : '<td>' + val.vCaseNo + '/' + val.vCaseYear + '</td>'
                        }
                        else {
                            html3 += '<td>' + val.vCaseNo + Slash + val.vCaseYear + ' (' + val.cRefNo + ')' + '</td>'
                        }
                        var CaseNameLabel = val.CaseName;
                        html3 += '<td>'
                        if (CaseNameLabel == "" || CaseNameLabel == null || CaseNameLabel == "null") {
                            html3 += '&nbsp;'
                        }
                        else {
                            if (CaseNameLabel.length > 40) {
                                html3 += '<li class="recent" > <span class="text">'
                                html3 += '<span class="comment more" style="">' + CaseNameLabel.substring(0, 40) + '</span>'
                                html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:#069;cursor:pointer"> more</span></br>'
                                html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                                html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html3 += '' + CaseNameLabel + ''
                                html3 += '</div>'
                                html3 += '</li>'
                            }
                            else {
                                html3 += '<li class="recent" > <span class="text">'
                                html3 += '<span class="comment more" style="">' + CaseNameLabel + '</span>'
                                html3 += '</span></li>'
                            }
                        }
                        html3 += '</td>'
                        html3 += '<td>' + (val.Court == null ? "" : val.Court) + '</td>'
                        html3 += '<td>' + (val.MandalName == null ? "" : val.MandalName) + '</td>'
                        html3 += '<td>' + (val.JanpadName == null ? "" : val.JanpadName) + '</td>'
                        html3 += '<td>' + (val.TahsilName == null ? "" : val.TahsilName) + '</td>'
                        html3 += '<td>' + (val.RevenueCourtName == null ? "" : val.RevenueCourtName) + '</td>'
                        html3 += '<td>' + (val.NextHearing == null ? "" : val.NextHearing) + '</td>'
                        html3 += '<td>' + (val.DisposedDate == null ? "" : val.DisposedDate) + '</td>'
                        html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>'
                        html3 += '<td>' + (val.ComputerCaseno == null ? "" : val.ComputerCaseno) + '</td>'
                        html3 += '<td>' + (val.Nature == null ? "" : val.Nature) + '</td>'
                        html3 += '<td>' + (val.AdmissionDate == null ? "" : val.AdmissionDate) + '</td>'
                        html3 += '<td>' + (val.Act == null ? "" : val.Act) + '</td>'
                        var htmlUser = "";
                        if (val.UserCaseId != "" && dashcw == "display:unset" && IsCWActive == "1") {
                            htmlUser = "| <span cwid='" + val.UserCaseId + "'  matterid='" + val.MatterID + "' mmnanevalus='" + CaseNameLabel + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert' style='cursor:pointer;'><img src='/newassets/img/add-user.png' /></span>&nbsp;";
                        }
                        if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                            html3 += '<td style="white-space:nowrap;">' + val.MatterName + ' ' + htmlUser + '</td>'
                        }
                        else {
                            if (val.MatterID == "" || val.MatterID == null || val.MatterID == "null" || val.MatterID == "00000000-0000-0000-0000-000000000000") {
                                html3 += '<td><a href="javascript:void()" id="linkmatter" data-val="' + val.UserCaseId + '">link to matter</a></td>'
                            }
                            else {

                                html3 += '<td><a href="javascript:void()" id="viewmatter" data-val="' + val.MatterID + '">view matter</a> ' + htmlUser + '</td>'
                            }
                        }

                        html3 += '</tr>'
                    });
                } else {

                    $("#pdatastatus").show();
                    document.querySelector(".pagination").style.display = "none";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    //html3 += '<tr>';
                    //html3 += '<td colspan="7" align="center">' +
                    //    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    //    '<h4>No Case list found</h4>' +
                    //    '<p>We found no Case list.</p>' +
                    //    '</td>';
                    //html3 += '</tr>';

                }
                $("#alldatabind").html("").html(html3);
                closeload();
            },
            failure: function (data) {
                alert(data.responseText);
                closeload();
            },
            error: function (data) {
                alert(data.responseText);
                closeload();
            }
        });
    }
    /*View matter details*/
    $(document).on("click", "#viewmatter", function () {
        var fcode = localStorage.getItem("FirmCode");
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Link matter*/
    $(document).on("click", "#linkmatter", function () {
        $("#livecaseidhide,#mattersforlink2").val("");
        var ids = $(this).attr("data-val");
        $("#savelinkmatter").attr("data-case", ids);
        $('#myModallinkcase').modal({ show: true });
    });
    /*Save link matter*/
    $("#savelinkmatter").click(function () {
        var matterids = $("#livecaseidhide").val();
        var caseidsids = $(this).attr("data-case");
        if (matterids == "") {
            alert("please select matter");
            return false;
        }
        var formData = new FormData();
        formData.append("matterid", matterids);
        formData.append("caseid", caseidsids);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/matterApi/SaveCaseForCWMAP", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (parseInt(response.Data) > 0) {
                        alert("case added successfully.");
                        $("#livecaseidhide,#mattersforlink2").val("");
                        $("#closelinkmatter").click();
                        isRenderPage = false;
                        loaddatalist(pageindex);
                        bindcase();
                        closeload();
                    }
                    else {
                        alert(response.Data);
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
    $("#RevenueCourt,#RevenueMandal,#RevenueJanpad,#RevenueTahsil,#RevenueCourtName, #RevenueJanpad_RERH, #RevenueTahsil_RERH, #RevenueCourtName_RERH").change(function () {
        isRenderPage = false;
        loaddatalist(pageindex);
    });

    /*Export to excel*/
    $("#exporttoexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
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
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffile" pageno="' + i + '" type="pdf">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
    $(document).on("click", "#exporttoexcelfile", function () {
        var UserCaseIdValue = "";
        var revvCourtValue = $("#RevenueCourt").val();
        var StatusValue = $("#CaseStatus").val();
        var mandalvalue = $("#RevenueMandal").val();
        var janpadvalue = $("#RevenueJanpad").val();
        var tahsilvalue = $("#RevenueTahsil").val();
        var revenueCourtValues = $("#RevenueCourtName").val();
        var Searchtextvalue = $("#casename").val();
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var istypevalue = "";
        var SortValue = $("#sortdate").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        window.location = encodeURI("/Revenue/ExportToExcelRevenueCaseListDetails?status=true&UserCaseIdValue=" + escape(UserCaseIdValue) + "&revvCourtValue=" + escape(revvCourtValue) + "&StatusValue=" + escape(StatusValue) + "&mandalvalue=" + escape(mandalvalue) + "&janpadvalue=" + escape(janpadvalue) + "&tahsilvalue=" + escape(tahsilvalue) + "&revenueCourtValues=" + escape(revenueCourtValues) + "&Searchtextvalue=" + escape(Searchtextvalue) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) + "&istypevalue=" + escape(istypevalue) + "&SortValue=" + escape(SortValue) + "&PageIndex=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    });
    $(document).on("click", "#exporttopdffile", function () {
        var UserCaseIdValue = "";
        var revvCourtValue = $("#RevenueCourt").val();
        var StatusValue = $("#CaseStatus").val();
        var mandalvalue = $("#RevenueMandal").val();
        var janpadvalue = $("#RevenueJanpad").val();
        var tahsilvalue = $("#RevenueTahsil").val();
        var revenueCourtValues = $("#RevenueCourtName").val();
        var Searchtextvalue = $("#casename").val();
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var istypevalue = "";
        var SortValue = $("#sortdate").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        window.location = encodeURI("/Revenue/ExportToPDFRevenueCaseListDetails?status=true&=" + escape(UserCaseIdValue) + "&revvCourtValue=" + escape(revvCourtValue) + "&StatusValue=" + escape(StatusValue) + "&mandalvalue=" + escape(mandalvalue) + "&janpadvalue=" + escape(janpadvalue) + "&tahsilvalue=" + escape(tahsilvalue) + "&revenueCourtValues=" + escape(revenueCourtValues) + "&Searchtextvalue=" + escape(Searchtextvalue) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) + "&istypevalue=" + escape(istypevalue) + "&SortValue=" + escape(SortValue) + "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    });

    $('#UsersCasewatchAlert').multiselect({
        columns: 1,
        placeholder: 'Select User',
        search: true,
        selectAll: true
    });
    /* Open Modal for Assign case to user */
    $(document).on('click', '#opencasewatchusermodal', function () {
        openload();

        casewatchcaseid = $(this).attr("cwid");
        mkMatterId = $(this).attr("matterid");
        matternamevalus = $(this).attr("mmnanevalus");
        loaduserbycaseid();
        LoadCasewatchAlertUsers();
        closeload();
    });

    /*Save casewatch user*/
    $("#savecasewatchuser").click(function () {
        var formData = new FormData();
        var casealerruser = $("#UsersCasewatchAlert").val();
        if (casealerruser == "") {
            alert("Please select user");
            $("#UsersCasewatchAlert").focus();
            return false;
        }
        formData.append("auser", EncodeText(casealerruser));
        formData.append("caseid", EncodeText(casewatchcaseid));
        formData.append("token", EncodeText(mkMatterId));
        formData.append("matternamesval", EncodeText(matternamevalus));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/SaveCasewatchAlertUsers",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("User Added successfully");
                $("#UsersCasewatchAlert").val("");
                LoadCasewatchAlertUsers();
                closeload();
                $("#UsersCasewatchAlert").multiselect('reload');
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    /*Delete casewatch alert*/
    $(document).on("click", "#deleteCasewatchuseralert", function () {
        var formData = new FormData();
        var auserslist = $(this).attr("data-user");
        var cwid = $(this).attr("data-id");
        formData.append("auser", EncodeText(auserslist));
        formData.append("caseid", EncodeText(cwid));
        formData.append("token", EncodeText(mkMatterId));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/RemoveCasewatchAlertUsers",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("User removed successfully");
                LoadCasewatchAlertUsers();
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });
});
var casewatchcaseid = "";
var mkMatterId = "";
var matternamevalus = "";
function loaduserbycaseid() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            var html3 = '';
            $("#UsersCasewatchAlert").html("");
            if (response != null) {
                $.each(obj, function (key, value) {
                    $("#UsersCasewatchAlert").append($("<option></option>").val(value.id).text(value.UserName));
                });
            }
            else {
            }
            $("#UsersCasewatchAlert").multiselect('reload');
        },
        failure: function (response) {
        }, //End of AJAX failure function
        error: function (response) {
            //alert(response.responseText);
        } //End of AJAX error function
    });
}

/*Load casewatch user alert*/
function LoadCasewatchAlertUsers() {
    openload();
    $("#bindcasewatchalertuser").empty()
    var formData = new FormData();
    formData.append("caseid", EncodeText(casewatchcaseid));
    var htmls = '';
    var q1 = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/CasewatchAlertUsersList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data);
            $.each(obj, function (i, a) {
                q1 = q1 + 1;
                htmls += ' <tr><td>' + q1 + '</td><td>' + a["vDispName"] + '</td><td>' + a["email_id"] + '</td><td>' + a["mobile_No"] + '</td><td><span id="deleteCasewatchuseralert" data-id="' + a.Usercseid + '" data-user="' + a.User_Id + '" style="cursor:pointer;" title="Remove user from case alert"><img src="/newassets/img/deletecasesingle-icon.png" /></span></td></tr>';
            }); //End of foreach Loop
            $("#bindcasewatchalertuser").empty().html(htmls);
            closeload();
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });

}
/*//Start Revenue Court*/
function ResetRevenue() {
    $("#RevenueCourt,#RevenueMandal,#RevenueJanpad,#RevenueTahsil,#RevenueCourtName,#RevenueYear").empty();
    $("#Revenuetxtno").val("");
}
/*Bind revenue years*/
function BindRevenueYear(crtid) {
    $("#RevenueYear").empty();
    $.ajax({
        type: "POST",
        url: "/firm/Addcaseyear?crtid=" + crtid,
        dataType: "json",
        success: function (data) {
            $("#RevenueYear").append("<option value='0'>Select Matter Year</option>");
            for (var i = 0; i < data.length; i++) {
                var caseyearlength = data[i].caseyear;
            }
            startYear = new Date().getFullYear()
            for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                $("#RevenueYear").append("<option value='" + i + "'>" + i + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Bind revenue courts*/
function BindRevenueCourt() {
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillRevenueVCourt",
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Court</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["vCourtVal"] + '" >  ' + a["vCourtName"] + '</option>';
            });
            $("#RevenueCourt").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind revenue mandal*/
function BindRevenueMandal(RevCourt) {
    $("#RevenueMandal option:not(:first)").remove();
    $("#RevenueJanpad option:not(:first)").remove();
    $("#RevenueTahsil option:not(:first)").remove();
    $("#RevenueCourtName option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillMandal?RevCourt=" + RevCourt,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Mandal</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["MandalValue"] + '" >  ' + a["MandalName"] + '</option>';
            });
            $("#RevenueMandal").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind revenue janpad*/
function BindRevenueJanpad(MandalValue) {
    $("#RevenueJanpad option:not(:first)").remove();
    $("#RevenueTahsil option:not(:first)").remove();
    $("#RevenueCourtName option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillJanpadByMandal?MandalValue=" + MandalValue,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Janpad</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["JanpadValue"] + '" >  ' + a["JanpadName"] + '</option>';
            });
            $("#RevenueJanpad").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind revenue tahsil*/
function BindRevenueTehsil(JanPadValue) {
    $("#RevenueTahsil option:not(:first)").remove();
    $("#RevenueCourtName option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillTahsilByJanpad?JanPadValue=" + JanPadValue,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Tahsil</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["TahsilValue"] + '" >  ' + a["TahsilName"] + '</option>';
            });
            $("#RevenueTahsil").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind Revenue Court name By Tahsil*/
function BindRevenueCourtnameByTahsil(TahsilValue) {
    $("#RevenueCourtName option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillRevenueCourtByTahsil?TahsilValue=" + TahsilValue,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Court Name</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["RevenueCourtValue"] + '" >  ' + a["RevenueCourtName"] + '</option>';
            });
            $("#RevenueCourtName").empty().html(option);
        },
        error: function (data) {
        }
    });
}

/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;

    let paginationHtml = '';
    let maxVisible = 4;
    let delta = 2;
    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    }
    else {
        paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

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
        if (start > 2) paginationHtml += `<span class="dots">...</span>`;
        for (let i = start; i <= end; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
        paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
    }
    $("#pageNumbers").html(paginationHtml);
    $("#prev").toggleClass("disabled", pageindex === 1);
    $("#next").toggleClass("disabled", pageindex === totPages);
    isRenderPage = true;
}

//function renderPagination(pageindex, totdata) {
//    let totPages = totdata;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis
//    if (totdata <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (pageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }
//    $("#pageNumbers").html(paginationHtml);
//    isRenderPage = true;
//}
//End revenue Court
//New change 
function toggleElements(ids, show) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = show ? "block" : "none";
        }
    });
}

function renderdropdown(type) {
    // Use the actual div IDs from the HTML
    const relkEl = document.getElementById('RELK');
    const rerhEl = document.getElementById('RERH');

    if (type === 'RERH') {
        // Show RERH section (Haryana), hide RELK section (Madhya Pradesh)
        if (rerhEl) rerhEl.style.display = 'block';
        if (relkEl) relkEl.style.display = 'none';
    } else if (type === 'RELK') {
        // Show RELK section (Madhya Pradesh), hide RERH section (Haryana)
        if (relkEl) relkEl.style.display = 'block';
        if (rerhEl) rerhEl.style.display = 'none';
    } else {
        // Hide both sections (initial state or other courts)
        if (relkEl) relkEl.style.display = 'none';
        if (rerhEl) rerhEl.style.display = 'none';
    }
}

function BindRevenue(RevCourt) {
    if (RevCourt === 'RERH') {
        renderdropdown('RERH');
        GetRevenueTahsilbyCourt();
        GetRevenueJanpadbyCourt();
    } else if (RevCourt === 'RELK') {
        renderdropdown('RELK');
        BindRevenueMandal(RevCourt);
    } else {
        renderdropdown(''); // Hide both
    }
}
function GetRevenueJanpadbyCourt() {
    var vCourtval = document.getElementById("RevenueCourt").value;
    $("#RevenueJanpad_RERH option:not(:first)").remove();
    $("#RevenueTahsil_RERH option:not(:first)").remove();
    $("#RevenueCourtName_RERH option:not(:first)").remove();

    $.ajax({
        type: "POST",
        url: "/Revenue/FillJanpadByRevenueCourt?vCourtval=" + vCourtval,
        dataType: "json",
        success: function (data) {
            if (data == 'Error') {
                alert(data);
                return;
            }
            var response = JSON.parse(data);
            // jQuery already parsed JSON, so no need for JSON.parse
            var obj = response.data;
            var option = "<option value=''>Select Janpad</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["JanpadValue"] + '">' + a["JanpadName"] + '</option>';
            });

            $("#RevenueJanpad_RERH").html(option);
        },
        error: function (err) {
            console.error("Error fetching Janpad data:", err);
        }
    });
}
function GetRevenueTahsilbyCourt() {
    var vCourtval = document.getElementById("RevenueCourt").value;
    $("#RevenueTahsil_RERH option:not(:first)").remove();
    $("#RevenueCourtName_RERH option:not(:first)").remove();

    $.ajax({
        type: "POST",
        url: "/Revenue/FillTahsilByRevenueCourt?vCourtval=" + vCourtval,
        dataType: "json",
        success: function (data) {
            if (data == 'Error') {
                alert(data);
                return;
            }
            var response = JSON.parse(data);
            // jQuery already parsed JSON, so no need for JSON.parse
            var obj = response.data;
            var option = "<option value=''>Select Tahsil</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["TahsilValue"] + '">' + a["TahsilName"] + '</option>';
            });

            $("#RevenueTahsil_RERH").html(option);
        },
        error: function (err) {
            console.error("Error fetching Tahsil data:", err);
        }
    });
}
function GetRevenueCourtNameByTahsilAndJanpad() {
    $("#RevenueCourtName_RERH option:not(:first)").remove();
    var vCourtval = document.getElementById("RevenueCourt").value;
    var janpadVal = document.getElementById("RevenueJanpad_RERH").value;
    var tahsilVal = document.getElementById("RevenueTahsil_RERH").value;
    var option = "";
    if (vCourtval == "" || janpadVal == "" || tahsilVal == "") {
        return;
    }
    $.ajax({
        type: "POST",
        url: "/Revenue/FillRevenueCourtByTahsilAndJanpad?vCourtval=" + vCourtval + "&janpadVal=" + janpadVal + "&tahsilVal=" + tahsilVal,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Court Name</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["RevenueCourtValue"] + '" >  ' + a["RevenueCourtName"] + '</option>';
            });
            $("#RevenueCourtName_RERH").empty().html(option);
        },
        error: function (data) {
        }
    });
}
