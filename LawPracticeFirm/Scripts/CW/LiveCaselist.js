FillCourtType();
function FillCourtType() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCourt",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var option = '<option value="">--Select Court--</option>';
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
function AddCourtName(strcourttype) {
    $.ajax({
        type: "POST",
        url: "/AddCase/AddCourtNameByCourtType?courttype=" + strcourttype,
        dataType: "json",
        success: function (data) {
            $("#drpcourtname").append("<option value='0'>-Select Court Name-</option>");
            $("#drpcourtnameDC").append("<option value='0'>Select Your State / UT</option>");
            for (var i = 0; i < data.length; i++) {
                if (strcourttype != "3") {
                    $("#drpcourtname").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
                else {
                    $("#drpcourtnameDC").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            }
        },
        error: function (data) {
        }
    });
}
/*Dropdown court name*/
function divdrpcourtnameDC() {
    $("#drpdistrictcourtname").empty();
    var selectedText = "";
    document.getElementById('drpcourtcomplexestb').style.display = 'none';
    document.getElementById('drpdistrictcourtname').style.display = 'none';
    document.getElementById('drpcompestbcourt').style.display = 'none';
    document.getElementById('drpcourtcomplexestb').value = "";
    document.getElementById('drpdistrictcourtname').value = "";
    document.getElementById('drpcompestbcourt').value = "";
    if (document.getElementById('drpcourtnameDC').value != "0") {
        document.getElementById('drpdistrictcourtname').style.display = 'block';
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
    document.getElementById('drpcourtcomplexestb').style.display = 'none';
    document.getElementById('drpcompestbcourt').style.display = 'none';
    document.getElementById('drpcourtcomplexestb').value = "";
    document.getElementById('drpcompestbcourt').value = "";
    if (document.getElementById('drpdistrictcourtname').value != "0") {
        document.getElementById('drpcourtcomplexestb').style.display = 'block';
        document.getElementById('drpcourtcomplexestb').value = '';
        $.ajax({
            type: "POST",
            url: "/Firm/FillCourtComplexSTB",
            dataType: "json",
            success: function (data) {
                $("#drpcourtcomplexestb").empty();
                $("#drpcourtcomplexestb").append("<option value=''>Please Select</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpcourtcomplexestb").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                }
            },
            error: function (data) {
            }
        });
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
    var compesttype = "";
    $('#drpcompestbcourt').empty();
    document.getElementById('drpcompestbcourt').style.display = 'none';
    document.getElementById('drpcompestbcourt').value = "";
    if (document.getElementById('drpcourtcomplexestb').value != "") {
        courtype = document.getElementById('drpcourtnameDC').value;
        districttype = document.getElementById('drpdistrictcourtname').value;
        compesttype = document.getElementById('drpcourtcomplexestb').value;
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
        document.getElementById('drpcompestbcourt').style.display = 'unset';
    }
}
$(document).ready(function () {
    function DashboardCountByStatus() {
        var formData = new FormData();
        formData.append("status", "Pending");
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/MyDisposedPendingCases",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Diplay SCHC district div*/
    function divSCHCDistrictdisplay() {
        try {
            document.getElementById('drpCfBench').style.value = '';
            document.getElementById('HighCourt').style.display = 'none';
            document.getElementById('drpcourtcomplexestb').style.display = 'none';
            document.getElementById('drpdistrictcourtname').style.display = 'none';
            document.getElementById('drpcompestbcourt').style.display = 'none';
            document.getElementById('drpcourtnameDC').style.display = "none";
            document.getElementById('divCFBench').style.display = 'none';
            $("#drpdistrictcourtname").val("");
            $('#drpcourtname').empty();
            $('#drpcourtnameDC').empty();
            document.getElementById('drpcourtnameDC').style.border = "unset";
            document.getElementById('drpcourtcomplexestb').style.border = "unset";
            document.getElementById('drpcompestbcourt').style.border = "unset";
            if (document.getElementById('divSCHCDistrict').value == "2" || document.getElementById('divSCHCDistrict').value == "4" || document.getElementById('divSCHCDistrict').value == "5") {
                document.getElementById('HighCourt').style.display = 'block';
                AddCourtName(document.getElementById('divSCHCDistrict').value);
            }
            else if (document.getElementById('divSCHCDistrict').value == "3") {
                document.getElementById('DistrictCourt').style.display = 'block';
                document.getElementById('drpcourtnameDC').style.display = "block";
                AddCourtName('3');
            }
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
    $("#drpcompestbcourt,#drpcourtnameDC,#drpdistrictcourtname,#drpcourtcomplexestb,#CaseStatus,#sortdate").change(function () {
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
        if ($(this).val() == "3") {
            $("#allcasediv").hide();
            $("#casediv").show();
        }
        else {
            $("#casediv").hide();
            $("#allcasediv").show();
        }
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
    $(document).on("click", "#linkmatter", function () {
        $("#livecaseidhide,#mattersforlink2").val("");
        var ids = $(this).attr("data-val");
        $("#savelinkmatter").attr("data-case", ids);
        $('#myModallinkcase').modal({ show: true });
        // bindcase();
    });
    /*Bind cases*/
    function bindcase() {
        var formData = new FormData();
        $('#mattersforlink').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        $.ajax(
            {
                type: "POST",
                url: "/api/matterApi/BindCaseForCWMAP", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $.each(JSON.parse(response.Data), function (i, a) {
                        var mattername = a.mname;
                        var mid = a.Id;
                        if (mattername == null) {
                            mattername = "";
                            mid = "";
                        }
                        else {
                            var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                            $("#mattersforlink").append(option);
                        }
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
        var courttype = $("#divSCHCDistrict").val();
        var courtname = $("#drpcourtname").val();
        var stateid = $("#drpcourtnameDC").val();
        var districtid = $("#drpdistrictcourtname").val();
        var courtcompestname = $("#drpcourtcomplexestb").val();
        var ditrictcourt = $("#drpcompestbcourt").val();
        var sortdate = $("#sortdate").val();
        var CaseStatus = $("#CaseStatus").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var casename = $("#casename").val();
        var searchany = $("#searchany").val();
        var tagname = $("#TagList").val();
        var benchname = "";
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        window.location = encodeURI("/CW/ExportToExcelLiveCaseListDetails?status=true&courttype=" + escape(courttype) + "&courtname=" + escape(courtname) + "&stateid=" + escape(stateid) + "&districtid=" + escape(districtid) + "&courtcompestname=" + escape(courtcompestname) + "&ditrictcourt=" + escape(ditrictcourt) + "&sortdate=" + escape(sortdate) + "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) + "&casename=" + casename + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) + "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&benchname=" + escape(benchname));
    });
    $(document).on("click", "#exporttopdffile", function () {
        var courttype = $("#divSCHCDistrict").val();
        var courtname = $("#drpcourtname").val();
        var stateid = $("#drpcourtnameDC").val();
        var districtid = $("#drpdistrictcourtname").val();
        var courtcompestname = $("#drpcourtcomplexestb").val();
        var ditrictcourt = $("#drpcompestbcourt").val();
        var sortdate = $("#sortdate").val();
        var CaseStatus = $("#CaseStatus").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var casename = $("#casename").val();
        var searchany = $("#searchany").val();
        var tagname = $("#TagList").val();
        var benchname = "";
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        window.location = encodeURI("/CW/ExportToPdfLiveCaseListDetails?status=true&courttype=" + escape(courttype) + "&courtname=" + escape(courtname) + "&stateid=" + escape(stateid) + "&districtid=" + escape(districtid) + "&courtcompestname=" + escape(courtcompestname) + "&ditrictcourt=" + escape(ditrictcourt) + "&sortdate=" + escape(sortdate) + "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) + "&casename=" + escape(casename) + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) + "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&benchname=" + escape(benchname));
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
    $("#clearhearing").click(function () {
        $("#clearhearing").hide();
        $("#hearingfrom").val("");
        $("#hearingto").val("");
        loaddatalist(pageindex);
    });
    loaddatalist(pageindex);
    /*Load data list*/
    function loaddatalist(pageindex) {
        var formData = new FormData();
        var benchname = "";
        if ($("#drpcourtname").val() == "CF") {
            benchname = $("#drpCfBench").val();
        }
        formData.append("courttype", $("#divSCHCDistrict").val());
        formData.append("courtname", $("#drpcourtname").val());
        formData.append("stateid", $("#drpcourtnameDC").val());
        formData.append("districtid", $("#drpdistrictcourtname").val());
        formData.append("courtcompestname", $("#drpcourtcomplexestb").val());
        formData.append("ditrictcourt", $("#drpcompestbcourt").val());
        formData.append("sortdate", $("#sortdate").val());
        formData.append("CaseStatus", $("#CaseStatus").val());
        formData.append("benchname", benchname);
        var fromdt = $("#hearingfrom").val();
        var todt = $("#hearingto").val();
        var casename = $("#casename").val();
        var searchany = $("#searchany").val();
        var tagname = $("#TagList").val();
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
        formData.append("searchany", searchany);
        formData.append("tagname", tagname);
        openload();
        var html3 = '';
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CWCaseList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var length = response1.length;
                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $.each(response1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        if (i === (length - 1)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (val.TotalRecord > 0) {
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
                            $("#exportrecords").val(val.TotalRecord);
                            tfot += '<ul>'
                            tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                            if (val.TotalRecord <= length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            }
                            else {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#ptfooter").html("");
                            $("#ptfooter").html(tfot);
                        }
                        qty = qty + 1;
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var casenotfoundcolorstyle = "";
                        if (String(val.CaseName) == "Case not available") {
                            casenotfoundcolorstyle = "background: #eb7373;color: white;font-size: 14px;background: #d55555;text-align: center;color: White;padding: 10px 0;";
                        }
                        if ($("#divSCHCDistrict").val() == "3") {
                            html3 += '<tr>'
                            html3 += '<td><input type="checkbox" class="checkboall"  id="casecheckbox" value="' + val.UserCaseId + '"></td>'
                            html3 += '<td>' + val.CaseDiary + '</td>'
                            html3 += '<td>' + val.Court + '</td>'
                            html3 += '<td>' + (val.District == null ? "" : val.District) + '</td>'
                            html3 += '<td>' + val.CourtComplexCourtEstablishmentType + '</td>'
                            html3 += '<td>' + val.CourtComplexCourtEstablishment + '</td>'
                            html3 += '<td style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
                            html3 += '<td>' + (val.Advocate == null ? "" : val.Advocate) + '</td>'
                            html3 += '<td>' + val.NextHearing + '</td>'
                            html3 += '<td>' + val.DisposedDate + '</td>'
                            html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>'
                            if (val.MatterID == "" || val.MatterID == null || val.MatterID == "null" || val.MatterID == "00000000-0000-0000-0000-000000000000") {
                                html3 += '<td><a href="javascript:void()" id="linkmatter" data-val="' + val.UserCaseId + '">link to matter</a> |';
                                if (val.CaseId != 0) {
                                    html3 += '<i class="fa fa-file-o" style = "cursor:pointer;color: #0059c1;" title = "Click here to insert/view notes." id = "OpenNotesModal" data - caseid="' + val.CaseId + '" data - usercaseid="' + val.UserCaseId + '" ></i >';
                                }
                                html3 += '<a style="color:#0059c1;" title="Remove case for live update" id="unlinkcase" href="javascript: void()" data-val="' + val.MatterID + '" data-id="' + val.UserCaseId + '" > <span class="glyphicon glyphicon-ban-circle" align="center"></span></a > | <a href="javascript:void()" title="View timeline" id="openordertimeline" data-caseno="' + val.CaseDiary + '" data-casename="' + val.Court + '" data-party="' + val.Advocate + '" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"><span class="glyphicon glyphicon-dashboard"></span></a></td >';
                            }
                            else {
                                html3 += '<td><a href="javascript:void()" title="' + val.MatterName + '" id="viewmatter" data-val="' + val.MatterID + '">' + val.MatterName.substring(0, 10) + '</a> |';
                                if (val.CaseId != 0) {
                                    html3 += '<i class="fa fa-file-o" style = "cursor:pointer;color: #0059c1;" title = "Click here to view notes." id = "OpenNotesModal" data - caseid="' + val.CaseId + '" data - usercaseid="' + val.UserCaseId + '" ></i >';
                                }
                                html3 += '<a style="color:#0059c1;" title="Remove case for live update" id="unlinkcase" href="javascript: void()" data-val="' + val.MatterID + '" data-id="' + val.UserCaseId + '" > <span class="glyphicon glyphicon-ban-circle" align="center"></span></a > | <a href="javascript:void()" title="View timeline" id="openordertimeline" data-caseno="' + val.CaseDiary + '" data-casename="' + val.Court + '" data-party="' + val.Advocate + '" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"><span class="glyphicon glyphicon-dashboard"></span></a></td >';
                            }
                            html3 += '</tr>'
                        }
                        else {
                            html3 += '<tr>'
                            html3 += '<td><input type="checkbox" class="checkboall" id="casecheckbox" value="' + val.UserCaseId + '"></td>'
                            html3 += '<td>' + val.CaseDiary + '</td>'
                            html3 += '<td>' + val.Court + '</td>'
                            if (val.CaseName == "" || val.CaseName == null || val.CaseName == "null") {
                                html3 += '<td>&nbsp;</td>'
                            }
                            else {
                                if (val.CaseName.length > 20) {
                                    html3 += '<td>'
                                    html3 += '<span class="comment more" style="">' + val.CaseName.substring(0, 20) + '</span>'
                                    html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                    html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html3 += '' + val.CaseName + ''
                                    html3 += '</div>'
                                    html3 += '</td>'
                                }
                                else {
                                    html3 += '<td style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
                                }
                            }
                            html3 += '<td>' + (val.BenchName == null ? "" : val.BenchName) + '</td>'
                            if (val.Advocate == "" || val.Advocate == null || val.Advocate == "null") {
                                html3 += '<td>&nbsp;</td>'
                            }
                            else {
                                if (val.Advocate.length > 20) {
                                    html3 += '<td>'
                                    html3 += '<span class="comment more" style="">' + val.Advocate.substring(0, 20) + '</span>'
                                    html3 += '<span data-toggle="collapse" data-target="#dtna' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                    html3 += ' <div id="dtna' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                    html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtna' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                    html3 += '' + val.Advocate + ''
                                    html3 += '</div>'
                                    html3 += '</td>'
                                }
                                else {
                                    html3 += '<td><span class="comment more" style="">' + val.Advocate + '</span></td>'
                                }
                            }
                            html3 += '<td>' + val.NextHearing + '</td>'
                            html3 += '<td>' + val.DisposedDate + '</td>'
                            html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>'
                            if (val.MatterID == "" || val.MatterID == null || val.MatterID == "null" || val.MatterID == "00000000-0000-0000-0000-000000000000") {
                                html3 += '<td><a href="javascript:void()" id="linkmatter" data-val="' + val.UserCaseId + '">link to matter</a>|';
                                if (val.CaseId != 0) {
                                    html3 += '<i class="fa fa-file-o" style="cursor:pointer;color:#0059c1;" title="Click here to insert/view notes." id="OpenNotesModal" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"></i>';
                                }
                                html3 += '<a  style = "color:#0059c1;" title = "Remove case for live update" id = "unlinkcase" href = "javascript: void()" data-val="' + val.MatterID + '" data-id = "' + val.UserCaseId + '" > <span class="glyphicon glyphicon-ban-circle" align="center"></span></a >';
                                html3 += '| <a href="javascript:void()" title="View timeline" id="openordertimeline" data-caseno="' + val.CaseDiary + '" data-casename="' + val.CaseName + '" data-party="' + val.Advocate + '" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"><span class="glyphicon glyphicon-dashboard"></span></a></td > ';
                            }
                            else {
                                html3 += '<td><a href="javascript:void()" title="' + val.MatterName + '" id="viewmatter" data-val="' + val.MatterID + '">' + val.MatterName.substring(0, 10) + '</a> |';
                                if (val.CaseId != 0) {
                                    html3 += '<i class="fa fa-file-o" style="cursor:pointer;color: #0059c1;" title="Click here to insert/view notes." id="OpenNotesModal" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"></i>';
                                }
                                html3 += '<a  style = "color:#0059c1;" title = "Remove case for live update" id = "unlinkcase" href = "javascript: void()" data - val="' + val.MatterID + '" data - id = "' + val.UserCaseId + '" > <span class="glyphicon glyphicon-ban-circle" align="center"></span></a > | <a href="javascript:void()" title="View timeline" id="openordertimeline" data-caseno="' + val.CaseDiary + '" data-casename="' + val.CaseName + '" data-party="' + val.Advocate + '" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"><span class="glyphicon glyphicon-dashboard"></span></a></td >';
                            }
                            html3 += '</tr>'
                        }
                    });
                } else {
                    html3 += '<tr>'
                    if ($("#divSCHCDistrict").val() == "3") {
                        $("#ptfooter").html("");
                        html3 += '<td colspan=10 align=center>Data Not Found</td>'
                    }
                    else {
                        $("#ptfooter").html("");
                        html3 += '<td colspan=11 align=center>Data Not Found</td>'
                    }
                    html3 += '<tr>'
                }
                $("#districtdatabind,#alldatabind").html("");
                if ($("#divSCHCDistrict").val() == "3") {
                    $("#districtdatabind").html("").html(html3);
                }
                else {
                    $("#alldatabind").html("").html(html3);
                }
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
    $("#showremovetag").click(function () {
        $("#removetagdiv").show();
        $("#createtagdiv").hide();
    });
    $("#hideremovetag").click(function () {
        $("#removetagdiv").hide();
    });
    //start for tag date: 24 dec 2021
    $("#showtag").click(function () {
        selectedID = [];
        $('input:checkbox.checkboall').each(function () {
            if ($(this).prop('checked')) {
                selectedID.push($(this).val());
            }
        });
        if (JSON.stringify(selectedID) != "[]") {
            $("#createtagdiv").show();
            $("#removetagdiv").hide();
        }
        else {
            alert("please select at-least 1 check-box for tagged case.");
        }
    });
    BindTag();
    $("#hidetag").click(function () {
        $("#createtagdiv").hide();
    });
    $("#savetag").click(function () {
        selectedID = [];
        $('input:checkbox.checkboall').each(function () {
            if ($(this).prop('checked')) {
                selectedID.push($(this).val());
            }
        });
        if (JSON.stringify(selectedID) != "[]") {
            //  alert("hi");
            var formData = new FormData();
            var tagname = "";
            var tagname1 = $("#TagListSave").val();
            var tagname2 = $("#tagname").val();
            if (tagname1 == "" && tagname2 == "") {
                alert("Please enter tag name or select existing tag.");
                return false;
            }
            if (tagname1 != "") {
                tagname = tagname1;
            }
            if (tagname2 != "") {
                tagname = tagname2;
            }
            formData.append("usercaseid", selectedID);
            formData.append("tagname", tagname);
            openload();
            var result = confirm("Are you sure want to tag cases?");
            if (result) {
                openload();
                var html3 = '';
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/CW/CreateTag",
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response1) {
                        selectedID = [];
                        alert("Tag created successfully");
                        $('#select_all').prop('checked', false);
                        closeload();
                        BindTag();
                        setTimeout(loaddatalist(pageindex), 5000);
                    },
                    error: function () {
                        alert('Error!');
                        closeload();
                    }
                });
            }
            else {
                closeload();
            }
        }
        else {
            alert("please select at-least 1 check-box for tagged case.");
            closeload();
        }
    });
    $("#removetag").click(function () {
        selectedID = [];
        $('input:checkbox.checkboall').each(function () {
            if ($(this).prop('checked')) {
                selectedID.push($(this).val());
            }
        });
        var formData = new FormData();
        var tagname = "";
        var tagname = $("#TagListRemove").val();
        if (tagname == "") {
            alert("please select tag.");
            $("#TagListRemove").focus();
            return false;
        }
        formData.append("usercaseid", selectedID);
        formData.append("tagname", tagname);
        var result = confirm("Are you sure want to remove tag?");
        if (result) {
            openload();
            var html3 = '';
            $.ajax({
                async: true,
                type: "POST",
                url: "/CW/removetag",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    selectedID = [];
                    alert("Tag removed successfully");
                    $('#select_all').prop('checked', false);
                    closeload();
                    BindTag();
                    setTimeout(loaddatalist(pageindex), 5000);
                },
                error: function () {
                    alert('Error!');
                    closeload();
                }
            });
        }
        else {
            closeload();
        }
    });
    $("#TagListSave").change(function () {
        $("#tagname").val("");
    });
    $("#TagList").change(function () {
        loaddatalist(pageindex);
    });
    $("#tagname").keyup(function () {
        $("#TagListSave").val("");
    });
    /*Bind tags*/
    function BindTag() {
        $("#TagListSave,#TagList,#TagListRemove").html("");
        var formData = new FormData();
        var html3 = "";
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/TagList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var result = JSON.parse(response);
                html3 += '<option value="">Select Tagged Case</option>';
                var obj = result.data;
                for (var i = 0; i < obj.length; i++) {
                    html3 += '<option value="' + obj[i].vTaggedName + '"> ' + obj[i].vTaggedName + '</option>'
                }
                $("#TagListSave,#TagList,#TagListRemove").html("");
                $("#TagListSave,#TagList,#TagListRemove").append(html3);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*end for tag */
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
});