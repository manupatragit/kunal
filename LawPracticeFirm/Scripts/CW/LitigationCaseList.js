var nhdSortVal = "", Notepageindex = 1;
var arrcolmenuseleciton = [];
var firstload = true;
$(document).ready(function () {

    //$('#CustSelectionopen').on("click", function () {
    //    $('#myModalCustomizedcolumn').model({ show: true });

    //});

    $("#CustSelectionopen").click(function () {
        $('#myModalCustomizedcolumn').modal({ show: true });

    });

    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    jQuery('#UsersCasewatchAlert').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0, mnexthearingflag = 0;
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
        PageNumber = setPageNo;
        isRenderPage = false;
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
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        PageNumber = setPageNo;
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
        isRenderPage = false;
        PageNumber = setPageNo;
        loaddatalist(PageNumber);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    var chksflag = true;

    var fcode = localStorage.getItem("FirmCode");
    $(document).on('click', '#archivecasesingle', function () {
        var selectedIDd = $(this).attr("data-id");
        var mattername = $(this).attr("matterName");
        //var mname = mattername + ".";
        $("#archsingle_finaltime").attr("data-id", selectedIDd);
        $("#id_Archivematternames").text(mattername);
        $("#ArchiveLitigationcaselist").modal();
    });

    /*For single archive case*/
    $(document).on('click', '#archsingle_finaltime', function () {
        var selectedIDd = $(this).attr("data-id");
        //var result = confirm("Are you sure to archive case?");
        //if (result) {
        openload();
        var formData = new FormData();
        formData.append("Usercaseid", selectedIDd);
        $.ajax(
            {
                type: "POST",
                url: "/CW/LitigationcaseArchive", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    alert("Case archived Successfully");
                    isRenderPage = false;
                    loaddatalist(pageindex);
                    $("#ArchiveLitigationcaselist").modal("hide");
                    closeload();
                },
                error: function () {
                    alert('Error!');
                    closeload();
                }
            });
        // }
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    $(document).on('change', '#select_allcfield', function () {
        if ($(this).is(':checked')) {
            $('.chkdhide').each(function () {
                if ($(this).prop('checked')) {
                    var column = "." + $(this).attr("name");
                    $(column).toggle();
                }
            });
        }
        else {
        }
        $(".chkdhide").prop('checked', $(this).prop('checked'));
        $('.chkdhide').each(function () {
            var column = "." + $(this).attr("name");
            if (String(column) != "undefined") {
                if ($(this).prop('checked')) {
                    arrcolmenuseleciton.push($(this).attr("name"));
                }
                else {
                    arrcolmenuseleciton.splice($.inArray($(this).attr("name"), arrcolmenuseleciton), 1);
                }
                $(column).toggle();
            }
        });
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
                            isRenderPage = false;
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
    var defaultcaseids = "";
    $(document).on("click", "#OpenNotesModal", function () {
        var ids = $(this).attr("data-caseid");
        var caseids = $(this).attr("data-usercaseid");
        defaultcaseids = caseids;
        $("#UpdateOtherDetails").attr("data-case", caseids);
        $("#UpdateOtherDetails").attr("data", ids);
        $("#updatedusercasesid").val(ids);
        $("#OtherDetailstxt").val('');
        bindOtherDetails(ids);
        $('#myModalCaseNotes').modal({ show: true });
    });
    /*Bind other details by case id*/
    function bindOtherDetails(caseids) {
        var formData = new FormData();
        $("#otherdetailsContent").html('');
        formData.append("caseid", caseids);
        var html6 = "";
        $.ajax(
            {
                type: "POST",
                url: "/CW/MyKaseDocNotesDetailsLitigation", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
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
                        html6 += "<td>" + a.Createddate + "</td>";
                        html6 += "<td>" + a.Notes + "</td>";
                        html6 += "<td><i id='RemoveOtherDetails' data-id='" + a.Iid + "' title='Remove Details'><img src='/newassets/img/deletecasesingle-icon.png' /></i> <i id='EditOtherDetails' data-values='" + a.ActualNotes + "'  data-id='" + a.Iid + "' title='Edit Details'><img src='/newassets/img/edit-icon.png' /></i> </td>";
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
    /*For View Notes*/
    $(document).on("click", "#EditOtherDetails", function () {
        $("#OtherDetailstxt").val('');
        $("#updatednotesid").val('');
        var Notes = $(this).attr("data-values");
        var NotesId = $(this).attr("data-id");
        $("#updatednotesid").val(NotesId);
        $("#UpdateOtherDetails").hide();
        $("#updateDetails").show();
        $("#OtherDetailstxt").val(Notes);
    });
    /*update save notes*/
    $(document).on("click", "#updateDetails", function () {
        var noteid = $("#updatednotesid").val();
        var noticetext = $("#OtherDetailstxt").val();
        var caseidsids = $("#updatedusercasesid").val();
        if (noticetext == "") {
            alert("please enter other details");
            return false;
        }
        var formData = new FormData();
        formData.append("noteid", noteid);
        formData.append("noticetext", noticetext);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/CW/UpdateNotesByCaseIdLitigation", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var data = JSON.parse(response);
                    if (String(data.Status) == "true") {
                        alert("Note updated successfully");
                        closeload();
                        bindOtherDetails(caseidsids);
                        $("#OtherDetailstxt").val('');
                        $("#updatednotesid").val('');
                        $("#UpdateOtherDetails").show();
                        $("#updateDetails").hide();
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
    /*for remove Notes*/
    //$(document).on("click", "#RemoveOtherDetails", function () {
    //    var noteid = $(this).attr("data-id");
    //    var caseidsidss = $("#updatedusercasesid").val();
    //    var formData = new FormData();
    //    formData.append("noteid", noteid);
    //    openload();
    //    $.ajax(
    //        {
    //            type: "POST",
    //            url: "/CW/RemoveCaseNotes", // Controller/View
    //            data: formData,
    //            contentType: false,
    //            processData: false,
    //            success: function (response) {
    //                var data = JSON.parse(response);
    //                if (String(data.Status) == "true") {
    //                    alert("Note deleted successfully");
    //                    bindOtherDetails(caseidsidss);
    //                    closeload();
    //                }
    //                else {
    //                    alert("something went wrong!");
    //                    closeload();
    //                }
    //            },
    //            failure: function (response) {
    //                alert(data.responseText);
    //                closeload();
    //            },
    //            error: function (response) {
    //                alert(data.responseText);
    //                closeload();
    //            }
    //        });
    //});
    $(document).on("click", "#RemoveOtherDetails", function () {
        var noteid = $(this).attr("data-id");
        var caseidsidss = $("#updatedusercasesid").val();
        $("#removeNoteModalConf").modal();
        $("#removeNotePopup").attr("noteid", noteid);
        $("#removeNotePopup").attr("caseidsidss", caseidsidss);
    });
    $(document).on("click", "#removeNotePopup", function () {
        var noteid = $(this).attr("noteid");
        var caseidsidss = $(this).attr("caseidsidss");
        RemoveOtherCDetails(noteid, caseidsidss);
    });
    function RemoveOtherCDetails(noteid, caseidsidss) {
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
                        //alert("Note deleted successfully");
                        new PNotify({
                            title: 'Success!',
                            text: 'Note deleted successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#removeNoteModalConf").modal("hide");
                        bindOtherDetails(caseidsidss);
                        closeload();
                    }
                    else {
                        //alert("something went wrong!");
                        new PNotify({
                            title: 'Error!',
                            text: 'Something went wrong!',
                            type: 'error',
                            delay: 3000
                        });
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
    }
    /*Update Other Details*/
    $("#UpdateOtherDetails").click(function () {
        var details = $("#OtherDetailstxt").val();
        if (details == "") {
            alert("please enter other details");
            return false;
        }
        details = details
            .replace(/[’‘]/g, "'")
            .replace(/[“”]/g, '"');

        var caseidsids = $(this).attr("data");
        var formData = new FormData();
        formData.append("detaiils", details);
        formData.append("caseid", caseidsids);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/CW/UploadNotesByCaseIdLitigation", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var data = JSON.parse(response);
                    if (String(data.Status) == "true") {
                        alert("Notes added successfully.");
                        $('#OtherDetailstxt').val('');
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
    /*Select all letigation cases*/
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
    /*Matter link*/
    $(document).on("click", "#linkmatter", function () {
        $("#livecaseidhide,#mattersforlink2").val("");
        var ids = $(this).attr("data-val");
        $("#savelinkmatter").attr("data-case", ids);
        $('#myModallinkcase').modal({ show: true });
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

    $("#oexcel").click(async function () {
        $("#Exporttype").val('');
        $("#Exporttype").val("Excel");
        var yes = await validatePageLink(event, 'CreateCase', 'Export');
        if (yes) {
            $("#myModalexport").modal({ show: true });
            var totalRecord = $("#exportrecords").val();
            $("#id_exportreportdrop").html('');
            var pagesize = 0;
            pagesize = 200;
            //if (roleids == 1) {
            //    pagesize = 500;
            //} else {
            //    pagesize = 200;
            //}
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
            $("#id_exportreportdrop").html(html);
            //$("#printexport").html(html);
        }
    });
    $("#opdf").click(async function () {
        $("#Exporttype").val('');
        $("#Exporttype").val("PDF");
        var yes = await validatePageLink(event, 'CreateCase', 'Export');
        if (yes) {
            $("#myModalexport").modal({ show: true });
            $("#id_exportreportdrop").html('');
            var totalRecord = $("#exportrecords").val();
            var pagesize = 0;
            pagesize = 200;
            //if (roleids == 1) {
            //    pagesize = 500;
            //} else {
            //    pagesize = 200;
            //}
            var recordsection = totalRecord / pagesize;
            recordsection = recordsection + 1;
            var html = '';
            var html = '<option value="">Please Select</option>';
            for (var i = 1; i < recordsection; i++) {
                //html += '<tr>';
                //html += '<td>Page No:' + i + ' </td>';
                //html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
                //html += '</tr>';
                html += '<option value="' + i + '" > ' + i + ' </option>';

            }
            $("#id_exportreportdrop").html(html);
        }
    });

    $(document).on("click", "#CommonExportExcel", function () {
        var ExportType = $("#Exporttype").val();
        var chkArray3 = [];
        var selected = $("#od input[type='checkbox']:checked");

        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        var teammemberserach = $("#lcaseteammemberlist").val();
        var CaseStatus = $("#lstatus").val();
        var courtname = $("#courtcasenamefilter").val();
        var advocatefilter = $("#advocatefilter").val();
        var tagname = $("#ltagilter").val();
        var casenuber = $("#lcasefiltercaseno").val();
        var casename = $("#lcasenamefilter").val();
        // var casename = "";
        var fromdt = "", todt = "";
        var nfromdt = $("#nextheringfilterdate").val();
        var ntodt = $("#nexthearingfilterdateTo").val();
        var mfromdt = $("#mnextheringfilterdate").val();
        var mtodt = $("#mnexthearingfilterdateTo").val();
        var petionersrh = $("#Petitionerfilter").val();
        var respondentsrh = $("#Respondentfilter").val();
        var courtfilterss = $("#lcasefiltercourt").val();
        var courtfiltersa = $("#lcasefiltercourt").val();
        //Remarks filter
        var Remarks = $("#courtremarksfilter").val();

        if (mnexthearingflag == 1) {
            fromdt = mfromdt;
            todt = mtodt;
        } else {
            fromdt = nfromdt;
            todt = ntodt;
        }
        var searchany = "1";
        var pagenum = $('#id_exportreportdrop').val(); //$(this).attr("pageno");
        if (pagenum == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please select page number',
                type: 'warning',
                delay: 3000
            });
            return false;
        }
        if (ExportType == "Excel") {

            var pagesizedata = 200;
            window.location = encodeURI("/CW/ExportToExcelLitigationCaseDetails?status=true&courtname=" + escape(courtname) +
                "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) +
                "&casename=" + casename + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) +
                "&advocate=" + escape(advocatefilter) + "&casenuber=" + escape(casenuber) + "&mnexthearingflag=" + escape(mnexthearingflag) +
                "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&teammebersrch=" + escape(teammemberserach) +
                "&petionersrh=" + escape(petionersrh) + "&respondentsrh=" + escape(respondentsrh) + "&sortdate=" + escape(nhdSortVal) +
                "&exportcolumn=" + EncodeText(selected3) + "&courtfilter=" + EncodeText(courtfilterss) + "&Remarks=" + escape(Remarks));
        }
        else {
            //var teammemberserach = $("#lcaseteammemberlist").val();
            //var CaseStatus = $("#lstatus").val();
            //var courtname = $("#courtcasenamefilter").val();
            //var advocatefilter = $("#advocatefilter").val();
            //var tagname = $("#ltagilter").val();
            //var casenuber = $("#lcasefiltercaseno").val();
            //var casename = $("#lcasenamefilter").val();
            //// var casename = "";
            //var fromdt = "", todt = "";
            //var nfromdt = $("#nextheringfilterdate").val();
            //var ntodt = $("#nexthearingfilterdateTo").val();
            //var mfromdt = $("#mnextheringfilterdate").val();
            //var mtodt = $("#mnexthearingfilterdateTo").val();
            //var petionersrh = $("#Petitionerfilter").val();
            //var respondentsrh = $("#Respondentfilter").val();
            //var courtfiltersa = $("#lcasefiltercourt").val();
            ////Remarks filter
            //var Remarks = $("#courtremarksfilter").val();
            //if (mnexthearingflag == 1) {
            //    fromdt = mfromdt;
            //    todt = mtodt;
            //} else {
            //    fromdt = nfromdt;
            //    todt = ntodt;
            //}
            //var searchany = "1";
            //var pagenum = $('#id_exportreportdrop').val(); //$(this).attr("pageno");
            //if (pagenum == "") {
            //    new PNotify({
            //        title: 'Worning!',
            //        text: 'Please select page number',
            //        type: 'worning',
            //        delay: 3000
            //    });
            //    return false;
            //}

            var pagesizedata = 200;
            window.location = encodeURI("/CW/ExportToPDFLitigationCaseDetails?status=true&courtname=" + escape(courtname) +
                "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) +
                "&casename=" + casename + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) +
                "&advocate=" + escape(advocatefilter) + "&casenuber=" + escape(casenuber) + "&mnexthearingflag=" + escape(mnexthearingflag) +
                "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&teammebersrch=" + escape(teammemberserach) +
                "&petionersrh=" + escape(petionersrh) + "&respondentsrh=" + escape(respondentsrh) + "&sortdate=" +
                escape(nhdSortVal) + "&courtfilter=" + EncodeText(courtfiltersa) + "&Remarks=" + escape(Remarks));

        }
    })

    $("#exporttoexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 200;
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
        var pagesize = 200;
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
        var chkArray3 = [];
        var selected = $("#od input[type='checkbox']:checked");

        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        var teammemberserach = $("#lcaseteammemberlist").val();
        var CaseStatus = $("#lstatus").val();
        var courtname = $("#courtcasenamefilter").val();
        var advocatefilter = $("#advocatefilter").val();
        var tagname = $("#ltagilter").val();
        var casenuber = $("#lcasefiltercaseno").val();
        var casename = $("#lcasenamefilter").val();
        // var casename = "";
        var fromdt = "", todt = "";
        var nfromdt = $("#nextheringfilterdate").val();
        var ntodt = $("#nexthearingfilterdateTo").val();
        var mfromdt = $("#mnextheringfilterdate").val();
        var mtodt = $("#mnexthearingfilterdateTo").val();
        var petionersrh = $("#Petitionerfilter").val();
        var respondentsrh = $("#Respondentfilter").val();
        var courtfilterss = $("#lcasefiltercourt").val();
        //Remarks filter
        var Remarks = $("#courtremarksfilter").val();

        if (mnexthearingflag == 1) {
            fromdt = mfromdt;
            todt = mtodt;
        } else {
            fromdt = nfromdt;
            todt = ntodt;
        }
        var searchany = "1";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 200;
        window.location = encodeURI("/CW/ExportToExcelLitigationCaseDetails?status=true&courtname=" + escape(courtname) +
            "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) +
            "&casename=" + casename + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) +
            "&advocate=" + escape(advocatefilter) + "&casenuber=" + escape(casenuber) + "&mnexthearingflag=" + escape(mnexthearingflag) +
            "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&teammebersrch=" + escape(teammemberserach) +
            "&petionersrh=" + escape(petionersrh) + "&respondentsrh=" + escape(respondentsrh) + "&sortdate=" + escape(nhdSortVal) +
            "&exportcolumn=" + EncodeText(selected3) + "&courtfilter=" + EncodeText(courtfilterss) + "&Remarks=" + escape(Remarks));
    });
    $(document).on("click", "#exporttopdffile", function () {
        var teammemberserach = $("#lcaseteammemberlist").val();
        var CaseStatus = $("#lstatus").val();
        var courtname = $("#courtcasenamefilter").val();
        var advocatefilter = $("#advocatefilter").val();
        var tagname = $("#ltagilter").val();
        var casenuber = $("#lcasefiltercaseno").val();
        var casename = $("#lcasenamefilter").val();
        // var casename = "";
        var fromdt = "", todt = "";
        var nfromdt = $("#nextheringfilterdate").val();
        var ntodt = $("#nexthearingfilterdateTo").val();
        var mfromdt = $("#mnextheringfilterdate").val();
        var mtodt = $("#mnexthearingfilterdateTo").val();
        var petionersrh = $("#Petitionerfilter").val();
        var respondentsrh = $("#Respondentfilter").val();
        var courtfiltersa = $("#lcasefiltercourt").val();
        //Remarks filter
        var Remarks = $("#courtremarksfilter").val();
        if (mnexthearingflag == 1) {
            fromdt = mfromdt;
            todt = mtodt;
        } else {
            fromdt = nfromdt;
            todt = ntodt;
        }
        var searchany = "1";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 200;
        window.location = encodeURI("/CW/ExportToPDFLitigationCaseDetails?status=true&courtname=" + escape(courtname) +
            "&CaseStatus=" + escape(CaseStatus) + "&hearingfrom=" + escape(fromdt) + "&hearingto=" + escape(todt) +
            "&casename=" + casename + "&searchany=" + escape(searchany) + "&tagname=" + escape(tagname) +
            "&advocate=" + escape(advocatefilter) + "&casenuber=" + escape(casenuber) + "&mnexthearingflag=" + escape(mnexthearingflag) +
            "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata) + "&teammebersrch=" + escape(teammemberserach) +
            "&petionersrh=" + escape(petionersrh) + "&respondentsrh=" + escape(respondentsrh) + "&sortdate=" +
            escape(nhdSortVal) + "&courtfilter=" + EncodeText(courtfiltersa) + "&Remarks=" + escape(Remarks));
    });
    /*Search hearing details*/
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
        isRenderPage = false;
        loaddatalist(pageindex);
    });
    $("#clearhearing").click(function () {
        $("#clearhearing").hide();
        $("#hearingfrom").val("");
        $("#hearingto").val("");
        isRenderPage = false;
        loaddatalist(pageindex);
    });
    loaddatalist(pageindex);
    /*Load data list*/
    function loaddatalist(pageindex) {
        if (nhdSortVal != "") {
            $("#nexthearingrefresh").show();
        } else {
            $("#nexthearingrefresh").hide();
        }
        var formData = new FormData();
        var benchname = "";
        var assignuserfilter = $("#lcaseteammemberlist").val();
        var courtfilter = $("#lcasefiltercourt").val();
        var casestatuss = $("#lstatus").val();
        var courtnamesfilte = $("#courtcasenamefilter").val();
        var advocatefilter = $("#advocatefilter").val();
        var tagfilter = $("#ltagilter").val();
        var casename = $("#lcasenamefilter").val();
        var fromdt = "", todt = "";
        var nfromdt = $("#nextheringfilterdate").val();
        var ntodt = $("#nexthearingfilterdateTo").val();
        var casenuber = $("#lcasefiltercaseno").val();
        var mfromdt = $("#mnextheringfilterdate").val();
        var mtodt = $("#mnexthearingfilterdateTo").val();
        var petionersrh = $("#Petitionerfilter").val();
        var respondentsrh = $("#Respondentfilter").val();
        //Remarks filter
        var Remarks = $("#courtremarksfilter").val();
        if (mnexthearingflag == 1) {
            fromdt = mfromdt;
            todt = mtodt;
        } else {
            fromdt = nfromdt;
            todt = ntodt;
        }
        var searchany = "1";
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
        formData.append("tagname", tagfilter);
        formData.append("sortdate", nhdSortVal);
        formData.append("CaseStatus", casestatuss);
        formData.append("benchname", benchname);
        formData.append("courtname", courtnamesfilte);
        formData.append("mnexthearingflag", mnexthearingflag);
        formData.append("advocatefilter", advocatefilter);
        formData.append("casenumber", casenuber);
        formData.append("courtfilter", courtfilter);
        formData.append("assignuserfilter", assignuserfilter);
        formData.append("petionersrh", petionersrh);
        formData.append("respondentsrh", respondentsrh);
        formData.append("Remarks", Remarks);

        openload();
        var html3 = '';
        $("#alldatabindLitigation").html("");
        $("#ptfooterLitigation").html("");
        var Licaselit = $.ajax({
            async: true,
            type: "POST",
            url: "/CW/LitigationCWCaseList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var length = response1.length;
                var qty = 0;
                var qty1 = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#pdatastatus").hide();
                    $("#pagenatedArea").show();
                    $.each(response1, function (i, val) {
                        let nextHearing = val?.NextHearing?.trim();
                        let manualNextHearing = val?.ManualNextHearing?.trim();
                        if (val?.Status && val.Status.toLowerCase().includes('disposed')) {
                            nextHearing = '';
                            val.NextHearing = '';
                        }
                        if (!nextHearing && !manualNextHearing) {
                            $('#setalerts').hide();
                        } else {
                            $('#setalerts').show();
                        }
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totpage = 0;
                        if (i === (length - 1)) {
                            var totdata = val.TotalRecord;
                            $('#totRecordData').text(" (" + totdata + ")");

                            $("#exportrecords").val(val.TotalRecord);
                            totalRecord = val.TotalRecord;

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
                        qty = qty + 1;
                        qty1 = qty1 + 1;
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var casenotfoundcolorstyle = "";
                        if (String(val.CaseName) == "Case not found") {
                            casenotfoundcolorstyle = "background: #eb7373;color: white;font-size: 14px;background: #d55555;text-align: center;color: White;padding: 10px 0;";
                        }
                        html3 += '<tr>'
                        html3 += '<td class="lsrno">' + val.RowId + '</td>';
                        html3 += '<td class="ldate">' + val.CreatedOn + '</td>';
                        html3 += '<td class="lPetitionerName">' + val.PetitionerName + '</td>';
                        html3 += '<td class="lRespondentName">' + val.RespondentName + '</td>';
                        html3 += '<td class="caseno"><a id="opencasenodetails" UsercaseId="' + val.UserCaseId + '" courtype="' + val.CourtType + '" caseid="' + val.CaseId + '" href="javascript:void()">' + val.CaseDiary + '</a></td>';
                        if (val.CaseName == "" || val.CaseName == null || val.CaseName == "null") {
                            html3 += '<td class="casename">&nbsp;</td>';
                        } else {
                            if (val.CaseName.length > 35) {
                                html3 += '<td class="casename">';
                                //html3 += '<span class="freeze-text" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + val.CaseName + '</span>';
                                html3 += '<span class="freeze-text" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + val.CaseName.replace(/<br\s*\/?>/gi, " ") + '</span>';
                                html3 += '</td>';
                            } else {
                                //    html3 += '<td class="casename" style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : '<span class="freeze-text" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + val.CaseName + '</span>') + '</td>';
                                html3 += '<td class="casename" style="' + casenotfoundcolorstyle + '">' +
                                    (val.CaseName == null ? "" :
                                        '<span class="freeze-text" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' +
                                        val.CaseName.replace(/<br\s*\/?>/gi, " ") +
                                        '</span>'
                                    ) +
                                    '</td>';
                            }
                        }
                        if (val.CourtName != "0") {
                            html3 += '<td class="lcasecourtname"><span style="display: inline-flex; align-items: center; padding: 1px 5px; border: 1px solid #d1d5db; border-radius: 8px; background: #f9fafb; color: #374151; font-family: Arial, sans-serif; width: max-content;"><img src="/newassets/img/court.svg" alt="court" style="width: 10px; height: 10px; margin-right: 6px;">' + val.CourtName + '</span></td>';
                        } else {
                            html3 += '<td class="lcasecourtname"></td>';
                        }

                        html3 += '<td class="courtorditrict">';
                        //html3 += '<span style="display: inline-flex; align-items: center; padding: 1px 5px; border: 1px solid #d1d5db; border-radius: 8px; background: #f9fafb; font-size: 12px; color: #374151; font-family: Arial, sans-serif; width: max-content;">';
                        //html3 += '<img src="/newassets/img/court.svg" alt="court" style="width: 10px; height: 10px; margin-right: 6px;">';
                        html3 += val.Court;
                        html3 += '</span></td>';

                        var option1 = '<li><input id="select_allcfield"   type="checkbox"   >Select All</a></li>';
                        var testbenchname = val.BenchName;
                        html3 += '<td class="lcourtcomplexestblish">' + val.CourtComplexCourtEstablishment + ' ' + testbenchname + '</td>';
                        // html3 += '<td class="lcourtcomplexestblish">' + val.CourtComplexCourtEstablishment+'</td>';
                        html3 += '<td class="nexthearing">' + val.NextHearing + '</td>';
                        html3 += '<td class="Lstatus">' + (val.Status == null ? "" : val.Status) + '</td>';
                        //For IOB Related CustMization
                        if (IOBCustomization == "1") {
                            if (val.Advocate == "" || val.Advocate == null || val.Advocate == "null" || val.Advocate == "undefined" || val.Advocate == undefined) {
                                html3 += '<td class="ladvocate"></td>';
                            } else {
                                if (val.Advocate.length > 20) {
                                    html3 += '<td class="ladvocate">';
                                    html3 += '<span class="freeze-text comment more" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">';
                                    html3 += '<span class="glyphicon glyphicon-edit" style="color:black;cursor:pointer;" title="Edit Advocate" id="UpdateAdvocate" href="javascript:void()" advocate="' + val.Advocate + '" cwid="' + val.UserCaseId + '"></span>&nbsp;' + val.Advocate + '</span>';
                                    html3 += '</td>';
                                } else {
                                    html3 += '<td class="ladvocate"><span class="comment more"><span class="glyphicon glyphicon-edit" style="color:black;cursor:pointer;" title="Edit Advocate" id="UpdateAdvocate" href="javascript:void()" advocate="' + val.Advocate + '" cwid="' + val.UserCaseId + '"></span>&nbsp;' + val.Advocate + '</span></td>';
                                }
                            }
                        } else {
                            if (val.Advocate == "" || val.Advocate == null || val.Advocate == "null" || val.Advocate == "undefined" || val.Advocate == undefined) {
                                html3 += '<td class="ladvocate">&nbsp;</td>';
                            } else {
                                if (val.Advocate.length > 20) {
                                    html3 += '<td class="ladvocate">';
                                    html3 += '<span class="freeze-text comment more" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + val.Advocate + '</span>';
                                    html3 += '</td>';
                                } else {
                                    html3 += '<td class="ladvocate"><span class="comment more">' + val.Advocate + '</span></td>';
                                }
                            }
                        }
                        // html3 += '<td class="lcauselist"><a class="glyphicon glyphicon-screenshot" data-id="' + val.UserCaseId + '" data-courttypeId="' + val.CourtType + '" Id="fullcauselistId" style="cursor:pointer; color: black !important;" title= "Cause List" ></a></td>';
                        html3 += '<td class="disposeddate">' + val.DisposedDate + '</td>';
                        html3 += '<td class="mnexthearing"><div title="Next Hearing Date-Add Manually" id="SetManualAlert" mcaseid="' + val.CaseId + '" nhdate="' + val.NextHearing + '"   data-id="' + val.UserCaseId + '" class="" style="cursor:pointer;"><img src="/newassets/img/date-icon.png" /></div><div class="manualdate">' + val.ManualNextHearing + '</div></td>';
                        if (val.TaggedName > 0) {
                            html3 += '<td class="tags"><span title="tag" id="Opentag"  data-id="' + val.UserCaseId + '" istagid="' + val.TaggedName + '" class="" style="cursor:pointer;"><img src="/newassets/img/tag-icon.png" /></span></td>';
                        } else {
                            html3 += '<td class="tags"><span title="tag" id="Opentag"  data-id="' + val.UserCaseId + '" class="" style="cursor:pointer;"><img src="/newassets/img/tag-icon.png" /></span></td>';
                        }
                        if (val.MatterName == "" || val.MatterName == null || val.MatterName == "null") {
                            html3 += '<td class="lmattername"><span  style="cursor:pointer;" title="Edit Matter" id="UpdateMatterModel" href="javascript:void()" cwid="' + val.UserCaseId + '" scasenoss="' + val.CaseDiary + '" scourtname="' + val.CourtName + '" sothetcourtname="' + val.Court + '"><img src="/newassets/img/edit-icon.png" /></span></td>';
                        }
                        else {
                            if (val.MatterName.length > 20) {
                                html3 += '<td class="lmattername">'
                                html3 += '<span class="freeze-text" style="font-size:14px !important; font-weight:500; ; letter-spacing:0; line-height:20px; width:280px; height:40px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">'
                                html3 += '<span style="cursor:pointer; position:relative;" id="UpdateMatterModel" href="javascript:void()" cwid="' + val.UserCaseId + '" scasenoss="' + val.CaseDiary + '" scourtname="' + val.CourtName + '" sothetcourtname="' + val.Court + '"><img src="/newassets/img/edit-icon.png" /></span> &nbsp;' + val.MatterName +
                                    '</span>'
                                html3 += '</td>'
                            } else {
                                html3 += '<td class="lmattername"><span style="cursor:pointer;" id="UpdateMatterModel" href="javascript:void()" cwid="' + val.UserCaseId + '" scasenoss="' + val.CaseDiary + '" scourtname="' + val.CourtName + '" sothetcourtname="' + val.Court + '"><img src="/newassets/img/edit-icon.png" /></span> &nbsp;' + (val.MatterName == null ? "" : val.MatterName) + '</td>'
                            }
                        }
                        //  html3 += '<td class="lmattername"><a cwid="' + val.UserCaseId + '" scasenoss="' + val.CaseDiary + '" scourtname="' + val.CourtName + '" sothetcourtname="' + val.Court + '"  href="javascript:void()" title="View Matter" id="UpdateMatterModel">View</a></td>';
                        html3 += '<td class="lteammember"><a cwid="' + val.UserCaseId + '" mmnanevalus="' + val.MatterName + '"  matterid="' + val.MatterID + '"  href="javascript:void()" title="Add user for Live update" id="Caseuserdetailmodal" data-toggle="modal" data-target="#casewatchuseralert"><img style="display: flex; align-items: center; justify-content: center; margin: auto;" src="/newassets/img/view-icon.png" /></a></td>';
                        html3 += '<td class="lCNRNo">' + val.CNRNo + '</td>';
                        if (val.CourtType == "5") {
                            html3 += '<td class="lorder"><a class="" href="#" Id="openorders" lcasediry="' + val.CaseDiary + '" lcasenames="' + val.CaseName + '" lcourt="' + val.Court + '" lAdvocate="' + val.Advocate + '" ldsiposedate="' + val.DisposedDate + '" lstatuse="' + val.Status + '" data-id="' + val.UserCaseId + '" data-caseid="' + val.CaseId + '" title="View Orders" ><img  src="/newassets/img/order-icon.png" /></a>&nbsp;<span id-val="' + val.CaseId + '" id="openAppendCOurtManualOrder" title="Upload Order" style="cursor:pointer;"><img src="/newassets/img/upload-icon1.png" /></span></td>';
                            //  html += '<td width="30% "><button type="button" style="float:right;" id-val="' + a.CaseId + '" case-val="' + a.Id + '" id="openAppendCOurtManualOrder" class="btn sbtbtn">Add Order</button></td>';
                        } else {
                            html3 += '<td class="lorder"><a class="" href="#" Id="openorders" lcasediry="' + val.CaseDiary + '" lcasenames="' + val.CaseName + '" lcourt="' + val.Court + '" lAdvocate="' + val.Advocate + '" ldsiposedate="' + val.DisposedDate + '" lstatuse="' + val.Status + '" data-id="' + val.UserCaseId + '" data-caseid="' + val.CaseId + '" title="View Orders" ><img  src="/newassets/img/order-icon.png" /></a></td>';
                        }

                        if (val.CaseNote == "" || val.CaseNote == null || val.CaseNote == "null") {
                            html3 += '<td class="lRemarks">&nbsp;</td>';
                        }
                        else {
                            if (val.CaseNote.length > 20) {
                                html3 += '<td class="lRemarks">'
                                html3 += '<span class="comment more" style="">' + val.CaseNote.substring(0, 20) + '</span>'
                                html3 += '<span data-toggle="collapse" data-target="#dtncase' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                html3 += ' <div id="dtncase' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 240px;border-radius: 10px;left:75%;">'
                                html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtncase' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html3 += '' + val.CaseNote + ''
                                html3 += '</div>'
                                html3 += '</td>'
                            }
                            else {
                                html3 += '<td class="lRemarks" style="' + casenotfoundcolorstyle + '">' + (val.CaseNote == null ? "" : val.CaseNote) + '</td>'
                            }
                        }
                        //IOB Custmization
                        if (IOBCustomization == "1") {
                            html3 += '<td class="lregionname">' + val.RegionName + '</td>';
                            html3 += '<td class="lbranchname">' + val.BranchName + '</td>';
                            html3 += '<td class="lbranchcode">' + val.BranchCode + '</td>';
                        }

                        html3 += '<td class="actioncase">';
                        html3 += '<ul class="action-ul"><li><a class="" data-id="' + val.UserCaseId + '" Id="Reruncase" title="Re-run" href="#"><img  src="/newassets/img/restore-icon.png" /></a> <a data-id="' + val.UserCaseId + '" data-courttypeId="' + val.CourtType + '" Id="fullcauselistId" style="cursor:pointer; color: black !important;" title= "Cause List" ><img src="/newassets/img/causelist-icon.png" /></a>';
                        if (roleids == 1 && stfUser > 0) {
                            html3 += "<a href='/" + fcode + "/STF/STFDashboard?userCaseID=" + val.UserCaseId + "&MatterID=" + val.MatterID + "'><span style='cursor:pointer;' title='Pw details add' id='StfPwDetails'><img src='/newassets/img/adddetails-icon.png' /></span></a>";
                        }
                        else if (roleids == 2 && stfUser > 0) {
                            html3 += "<a href='/" + fcode + "/STF/STFDashboard?userCaseID=" + val.UserCaseId + "&MatterID=" + val.MatterID + "'><span style='cursor:pointer;' title='Pw details add' id='StfPwDetails'><img src='/newassets/img/adddetails-icon.png' /></span></a>";
                        }
                        if ((val.NextHearing != "" && val.NextHearing != null && val.NextHearing != "null") || (val.ManualNextHearing != "" && val.ManualNextHearing != null && val.ManualNextHearing != "null")) {
                            var mhdate = "";
                            var nhdate = "";
                            if (val.ManualNextHearing != "" && val.ManualNextHearing != null && val.ManualNextHearing != "null") {
                                mhdate = 'mhdatev = "' + val.ManualNextHearing + '"';
                            }
                            if (val.NextHearing != "" && val.NextHearing != null && val.NextHearing != "null") {
                                nhdate = 'nhdatev="' + val.NextHearing + '"';
                            }
                            html3 += '<a class="" href="#" casenotxt="' + val.CaseDiary + '" courttext="' + val.Court + '" casenametxt="' + val.MatterName + '" ' + nhdate + '  ' + mhdate + '  val-data="' + val.UserCaseId + '" id="setalerts"><span title="Alert settings"><img src="/newassets/img/bell-icon.png" /></span></a></li>';
                        }
                        //else if (val.ManualNextHearing != "" && val.ManualNextHearing != null && val.ManualNextHearing != "null") {
                        //    html3 += '<a class="" href="#" casenotxt="' + val.CaseDiary + '" courttext="' + val.Court + '" casenametxt="' + val.MatterName + '"  mhdatev="' + val.ManualNextHearing + '"  val-data="' + val.UserCaseId + '" id="setalerts"><span title="Alert settings" style="color: black;top: 3px;" class="glyphicon glyphicon-bell"></span></a></li>&nbsp;';
                        //}
                        //<li style="cursor:pointer;"><img src="/newassets/images/cnr_icon.png" /></li>
                        html3 += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu2" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" /></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu2">';
                        if (val.MasterCaseId != 0) {
                            html3 += '<li><a class="" href="#" title="Click here to insert/view notes." id="OpenNotesModal" data-caseid="' + val.CaseId + '" data-usercaseid="' + val.UserCaseId + '"><img src="/newassets/img/document-icon.png" /> View Notes</a></li>';
                        }
                        //alert(val.isDeleteLiveTrack + ',' + val.UserCaseId );
                        if (val.isDeleteLiveTrack == "0") {
                            html3 += '<li><a class="" href="#" title="Remove Live Tracking" id = "unlinkcase" matterName="' + val.MatterName + '" data-val="" data-id = "' + val.UserCaseId + '"><span><img src="/newassets/images/livetracking.png" style="margin-right: 6px;" />Remove Live Tracking</span></a></li>';
                        }
                        else {
                            html3 += '<li><a class="" href="#" title="Add for live update" id = "Relinkcase" matterName="' + val.MatterName + '" data-val="" data-id = "' + val.UserCaseId + '"><span><img src="/newassets/images/livetracking.png" /> Add Live Tracking</span></a></li>';
                        }
                        if (roleids == 1) {
                            html3 += '<li><a class="" href="#" ><span data-id="' + val.UserCaseId + '" matterName="' + val.MatterName + '" Id="archivecasesingle"  title="Archive Case"><img src="/newassets/images/archivematter.png"/> Archive Case</span></a></li>';
                            html3 += '<li><a class="" href="#"><span Id="Removecasewatch" data-id="' + val.UserCaseId + '" title="Delete" ><img src="/newassets/img/deletematter.png" /> Delete</span></a></li>';
                        } else {
                            if (IOBCustomization == "1") {
                                html3 += '<li><a class="" href="#" ><span data-id="' + val.UserCaseId + '" matterName="' + val.MatterName + '" Id="archivecasesingle"  title="Archive Case"><img src="/newassets/images/archivematter.png"/> Archive Case</span></a></li>';
                                html3 += '<li><a class="" href="#"><span Id="Removecasewatch" data-id="' + val.UserCaseId + '" title="Delete" ><img src="/newassets/img/deletematter.png" /> Delete</span></a></li>';
                            }
                        }
                        //IOB Custmization
                        if (IOBCustomization == "1") {
                            html3 += '<li><a class="" href="#"><span Id="ViewBranchCode" data-id="' + val.UserCaseId + '" regioncode="' + val.RegionCode + '" sno="' + val.BranchCode + '" title="View Branch Code"  class="glyphicon glyphicon-info-sign"> View Branch Code</span></a></li></ul></div></li>';
                        }

                        html3 += '</ul></div></li></ul></td>';
                        html3 += '</tr>'
                    });
                    $("#alldatabindLitigation").html("").html(html3);
                }
                else {
                    $("#pdatastatus").show();
                    $("#pagenatedArea").hide();
                    closeload();
                    //$("#ptfooterLitigation").html("");
                    //$("#alldatabindLitigation").html("");
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
        $.when(Licaselit).then(function (data, textStatus, jqXHR) {
            //$("input:checkbox:not(:checked)").each(function () {
            //    var column = "table ." + $(this).attr("name");
            //    $(column).hide();
            //});
            //closeload();
            var formData = new FormData();
            formData.append("moduleName", "LitigationCaseList");;
            $.ajax({
                url: '/api/CallApi/LoadLitigationColumnMasterChoiceByFirmId',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = response.Data;
                    }
                    else {
                        //alert("not found");
                    }
                    if (obj.length > 0) {
                        $("#allcaselisttable th,#allcaselisttable td").hide();
                        $("input.chkdhide[type='checkbox']").prop("checked", false);
                    }
                    if (firstload == true) {
                        $.each(obj, function (i, a) {
                            arrcolmenuseleciton.push(a.ColumnValue);
                            $("input.chkdhide[type='checkbox'][name='" + a.ColumnValue + "']").prop("checked", true)
                        });
                    }
                    firstload = false;
                    for (i = 0; i < arrcolmenuseleciton.length; i++) {
                        $("table ." + arrcolmenuseleciton[i]).show();

                        $("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);

                    }


                    closeload();
                    if (obj.length == 0) {
                        $("#allcaselisttable th,#allcaselisttable td").hide();
                        $("input.chkdhide[type='checkbox']:checked").each(function () {
                            var val = $(this).attr("name");
                            $("#allcaselisttable th." + val + ",#allcaselisttable td." + val + "").show();
                        })
                    }
                    $(".actioncase").show();
                    //End of foreach Loop
                    //console.log(response);
                }, //End of AJAX Success function

                failure: function (response) {
                    // alert(response.responseText);
                    closeload();
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                    closeload();
                } //End of AJAX error function
            });
            closeload();
            return false;
        });
    }
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
    /*start for tag date: 24 dec 2021*/
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
        $("#TagListSave").val('');
        $("#tagname").val('');
        $("#tagmoreoption").hide();
    });
    /*Add tag from individual case list*/
    $("#Litigationsavetag").click(function () {
        var usercaseId = $("#tagusercasid").val();
        var formData = new FormData();
        var tagname = "";
        var tagname1 = $("#TagListSave").val();
        if (tagname1 == "other") {
            tagname1 = "";
        }
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
        formData.append("usercaseid", usercaseId);
        formData.append("tagname", tagname);
        openload();
        var result = confirm("Are you sure want to tag cases?");
        if (result) {
            openload();
            var html3 = '';
            $.ajax({
                async: true,
                type: "POST",
                url: "/CW/CreateTagLM",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    alert("Tag created successfully");
                    $('#myModalopentag').modal('hide');
                    closeload();
                    BindTag();
                    loaddatalist(pageindex);
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
    /*Remove tags*/
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
                url: "/CW/RemoveTagLM",
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
    /*Change tag list details*/
    $("#TagListSave").change(function () {
        var taglistval = $(this).val();
        if (taglistval == "other") {
            $("#tagmoreoption").show();
        }
        else {
            $("#tagmoreoption").hide();
            $("#tagname").val("");
        }
    });
    $("#TagList").change(function () {
        loaddatalist(pageindex);
    });
    /*Bind tag details*/
    function BindTag() {
        $("#TagListSave,#TagList,#TagListRemove,#ltagilter").html("");
        var formData = new FormData();
        var html3 = "";
        var html4 = "";
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
                html3 += '<option value="">Select Tag</option>';
                html3 += '<option value="other">Add New</option>';
                html4 += '<option value="">Tag</option>';
                var obj = result.data;
                for (var i = 0; i < obj.length; i++) {
                    html3 += '<option value="' + obj[i].vTaggedName + '"> ' + obj[i].vTaggedName + '</option>'
                    html4 += '<option value="' + obj[i].vTaggedName + '"> ' + obj[i].vTaggedName + '</option>'
                }
                $("#TagListSave,#TagList,#TagListRemove").html("");
                $("#TagListSave,#TagList,#TagListRemove").append(html3);
                $("#ltagilter").html("");
                $("#ltagilter").append(html4);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*end for tag*/
    //$(document).on("click", "#unlinkcase", function () {
    //    var result = confirm("Are you sure to remove matter live update?");
    //    if (result) {
    //        openload();
    //        var formdata = new FormData();
    //        var token = $(this).attr("data-val");
    //        var usercase = $(this).attr("data-id");
    //        formdata.append("caseid", EncodeText(token));
    //        formdata.append("usercaseid", usercase);
    //        openload();
    //        $.ajax({
    //            async: true,
    //            url: '/api/matterApi/UnLinkCaseToCaseWatchFromLiveupdate',
    //            data: formdata,
    //            processData: false,
    //            contentType: false,
    //            type: 'POST',
    //            success: function (response) {
    //                if (response.Status == true) {
    //                    var datas = JSON.stringify(response);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: ' Matter live update removed successfully',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                    $('#select_all').prop('checked', false);
    //                    loadflag = true;
    //                    isRenderPage = false;

    //                    loaddatalist(1);
    //                    closeload();                       

    //                }
    //                else {
    //                    new PNotify({
    //                        title: 'Warning!',
    //                        text: ' You are not Authotized to delete this Matter !',
    //                        type: 'error',
    //                        delay: 2000
    //                    });
    //                    closeload();
    //                }
    //            },
    //            error: function () {
    //                alert('Error!');
    //                closeload();
    //            }
    //        });
    //    }
    //});

    $(document).on("click", "#unlinkcase", function () {
        //var result = confirm("Are you sure to remove matter live update?");
        var token = $(this).attr("data-val");
        var usercase = $(this).attr("data-id");
        var mattername = $(this).attr("mattername");
        var msg = "Are you sure to remove live tracking for " + mattername +".";
        $("#msgRemoveTracking").html(msg);
        $("#removelivetrackingModal").modal();
        $("#removeLiveTrackingPopup").attr("token", token);
        $("#removeLiveTrackingPopup").attr("usercase", usercase);
    });
    $(document).on("click", "#removeLiveTrackingPopup", function () {
        var token = $(this).attr("token");
        var usercase = $(this).attr("usercase");
        fnUnlinkLiveTracking(token, usercase);
    });
    function fnUnlinkLiveTracking(token, usercase) {
        openload();
        var formdata = new FormData();
        //var token = $(this).attr("data-val");
        //var usercase = $(this).attr("data-id");
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
                    isRenderPage = false;
                    $("#removelivetrackingModal").modal("hide");
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


    //$(document).on("click", "#Relinkcase", function () {
    //    var result = confirm("Are you sure to add matter live update?");
    //    if (result) {
    //        openload();
    //        var formdata = new FormData();
    //        var token = $(this).attr("data-val");
    //        var usercase = $(this).attr("data-id");
    //        formdata.append("caseid", EncodeText(token));
    //        formdata.append("usercaseid", usercase);
    //        openload();
    //        $.ajax({
    //            async: true,
    //            url: '/api/matterApi/ReLinkCaseToCaseWatchFromLiveupdate',
    //            data: formdata,
    //            processData: false,
    //            contentType: false,
    //            type: 'POST',
    //            success: function (response) {
    //                if (response.Status == true) {
    //                    var datas = JSON.stringify(response);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: ' Matter live update added successfully',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                    $('#select_all').prop('checked', false);
    //                    loadflag = true;
    //                    isRenderPage = false;

    //                    loaddatalist(1);
    //                    closeload();

    //                }
    //                else {
    //                    new PNotify({
    //                        title: 'Warning!',
    //                        text: ' You are not Authotized to add this Matter !',
    //                        type: 'error',
    //                        delay: 2000
    //                    });
    //                    closeload();
    //                }
    //            },
    //            error: function () {
    //                alert('Error!');
    //                closeload();
    //            }
    //        });
    //    }
    //});
    $(document).on("click", "#Relinkcase", function () {
        //var result = confirm("Are you sure to add matter live update?");
        var token = $(this).attr("data-val");
        var usercase = $(this).attr("data-id");
        var mattername = $(this).attr("mattername");
        var msg = "Are you sure to add live tracking for " + mattername +".";
        $("#msgAddTracking").html(msg);

        $("#AddlivetrackingModal").modal();
        $("#btnAddLiveTrackingDetail").attr("token", token);
        $("#btnAddLiveTrackingDetail").attr("usercase", usercase);
    });
    $(document).on("click", "#btnAddLiveTrackingDetail", function () {
        var token = $(this).attr("token");
        var usercase = $(this).attr("usercase");
        RelinkCaseDetail(token, usercase);
    });
    function RelinkCaseDetail(token, usercase) {
        openload();
        var formdata = new FormData();
        //var token = $(this).attr("data-val");
        //var usercase = $(this).attr("data-id");
        formdata.append("caseid", EncodeText(token));
        formdata.append("usercaseid", usercase);
        openload();
        $.ajax({
            async: true,
            url: '/api/matterApi/ReLinkCaseToCaseWatchFromLiveupdate',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    new PNotify({
                        title: 'Success!',
                        text: ' Matter live update added successfully',
                        type: 'success',
                        delay: 3000
                    });
                    $('#select_all').prop('checked', false);
                    loadflag = true;
                    isRenderPage = false;
                    $("#AddlivetrackingModal").modal("hide");
                    loaddatalist(1);
                    closeload();

                }
                else {
                    new PNotify({
                        title: 'Warning!',
                        text: ' You are not Authotized to add this Matter !',
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
    ///*for Alert settigs*/
    //$(document).on("click", "#setalerts", function () {
    //    //  var lids = $(this).attr("val-data");
    //    var lids = $(this).attr("val-data");
    //    var IsReracheck = $(this).attr("sno");
    //    var casenametxt = $(this).attr("casenotxt");
    //    var casenumbertxttrim = "";


    //    var lids = $("#UserCaseIdsId").val();
    //    var casenametxt = $("#casenametxtval").val();
    //    var courttext = $("#courttextval").val();
    //    var casenotxt = $("#casenotxtval").val();
    //    var nhdate = $("#nhdateval").val();
    //    var mnhdate = $("#mnhdateval").val();
    //    if (String(nhdate) == "undefined") {
    //        nhdate = "";
    //    }
    //    if (String(mnhdate) == "undefined") {
    //        mnhdate = "";
    //    }
    //    $("#textleadid").html(lids);
    //    $("#casenotext").html(casenotxt);
    //    $("#casenametext").html(casenametxt);
    //    $("#courttext").html(courttext);
    //    if (String(nhdate) != "") {
    //        $('#hearingradio').val(nhdate.trim());
    //        $('#hearingdttext').text(nhdate.trim());
    //    }
    //    else {
    //        $('#hearingradiodiv').hide();
    //    }
    //    if (String(mnhdate) != "") {
    //        $('#mhearingradio').val(mnhdate.trim());
    //        $('#mhearingdttext').text(mnhdate.trim());
    //    }
    //    else {
    //        $('#mhearingradiodiv').hide();
    //    }
    //    $("#alertmobpanel").css("display", "none");
    //    $("#alertemailpanel").css("display", "none");
    //    loadsavealerts();
    //    $('#myModalcasealerts').modal({ show: true });
    //    clearForm();
    //});

    //$(document).on("click", "#setalerts", function () {
    //    var lids = $(this).attr("val-data");
    //    var IsReracheck = $(this).attr("sno");
    //    var casenametxt = $(this).attr("casenotxt");
    //    var casenumbertxttrim = "";
    //    if (casenametxt != "") {
    //        casenumbertxttrim = casenametxt.replace(/(<([^>]+)>)/ig, "");
    //    }
    //    var courttext = $(this).attr("courttext");
    //    var casenotxt = $(this).attr("casenametxt");
    //    var casenametxttrim = "";
    //    if (casenotxt != "") {
    //        casenametxttrim = casenotxt.replace(/(<([^>]+)>)/ig, "");
    //    }
    //    var nhdate = $(this).attr("nhdatev");
    //    var mnhdate = $(this).attr("mhdatev");
    //    if (String(nhdate) == "undefined") {
    //        nhdate = "";
    //    }
    //    if (String(mnhdate) == "undefined") {
    //        mnhdate = "";
    //    }
    //    $("#textleadid").text(lids);
    //    $("#casenotext").text(casenametxttrim);
    //    $("#casenametext").text(casenumbertxttrim);
    //    $("#courttext").text(courttext);
    //    $("#Isreras").val(IsReracheck);
    //    if (String(nhdate) != "") {
    //        $('#hearingradio').val(nhdate.trim());
    //        $('#hearingdttext').text(nhdate.trim());
    //    }
    //    else {
    //        $('#hearingradiodiv').hide();
    //    }
    //    if (String(mnhdate) != "") {
    //        $('#mhearingradiodiv').show();
    //        $('#mhearingradio').val(mnhdate.trim());
    //        $('#mhearingdttext').text(mnhdate.trim());
    //    }
    //    else {
    //        $('#mhearingradiodiv').hide();
    //    }
    //    $("#alertmobpanel").css("display", "none");
    //    $("#alertemailpanel").css("display", "none");
    //    //$('#alertform')[0].reset();
    //    loadsavealerts();
    //    $('#myModalcasealerts').modal({ show: true });
    //    clearForm();

    //});
    //New Alert settigs popup start section
    $(document).on('change', '#Alerttypes', function () {
        var hearingtypes = $(this).val();
        if (hearingtypes == "datebasis") {
            $("#hearingdates").hide();
            $("#divfrequency").hide();
            $("#divalertdeatils").show();
        }
        else {
            $("#divfrequency").show();
            $("#hearingdates").show();
            $("#divalertdeatils").hide();
        }
    });

    $('#ddlalertfor').on('change', function () {
        if (this.value == "0") {
            $("#alertmobpanel1").css("display", "unset");
            $("#alertmobpanel1").css("display", "unset");
            $("#clientnamediv").css("display", "unset");

            $("#selectedClientValue").html(`
            <select id="clientname" class="selctInputFormat">
                <option value="">Select Client</option>
            </select>`);
            let dropdown = $("#clientname");
            $("#selectedClientValue").css("display", "unset");
            $("#clientname").css("display", "unset");
            let formData = new FormData();
            formData.append("search", "");
            $.ajax({
                type: "POST",
                url: "/CW/GetLitigationContact",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {

                    dropdown.empty();
                    dropdown.append(`<option value="">Select Client</option>`);

                    $.each(response, function (i, a) {

                        dropdown.append(`
                    <option value="${a.vMainiid || ''}"
                            data-email="${a.vEmail || ''}"
                            data-mobile="${a.vMobile || ''}">
                        ${a.vFullName}
                    </option>
                `);
                    });

                    dropdown.off("change").on("change", function () {
                        let selected = $(this).find(":selected");
                        $("#cientemail").val(selected.data("email") || "");
                        $("#clientmobile").val(selected.data("mobile") || "");
                    });
                },
                error: function (xhr, status, error) {
                    console.log("Client load failed:", error);
                }
            });
        }
        else {
            $("#alertmobpanel1").css("display", "none");
            $("#alertmobpanel1").css("display", "none");
            $("#clientnamediv").css("display", "none");


            $("#selectedClientValue").html(`
            <input class="selctInputFormat" id="clientname" type="text" ">`);

            $("#cientemail").val("");
            $("#clientmobile").val("");

            $("#alertmobpanel1").hide();
        }
    });

    $(document).on("click", "#setalerts", function () {
      
        //  var lids = $(this).attr("val-data");
        var lids = $(this).attr("val-data");
        var IsReracheck = $(this).attr("sno");
        var casenametxt = $(this).attr("casenotxt");
        if (casenametxt != "") {
            casenumbertxttrim = casenametxt.replace(/(<([^>]+)>)/ig, "");
        }

        var courttext = $(this).attr("courttext");
        var casenotxt = $(this).attr("casenametxt");
        var nhdate = $(this).attr("nhdatev");
        var mnhdate = $(this).attr("mhdatev");
        if (String(nhdate) == "undefined") {
            nhdate = "";
        }
        if (String(mnhdate) == "undefined") {
            mnhdate = "";
        }
        $("#textleadid").html(lids);
        $("#casenotext").html(casenotxt);
        $("#casenametext").html(casenametxt);
        $("#courttext").html(courttext);
        $("#Isreras").val(IsReracheck);
        if (String(nhdate) != "") {
            $('#hearingradio').val(nhdate.trim());
            $('#hearingdttext').text(nhdate.trim());
            $('#hearingradiodiv').show();
        }
        else {
            $('#hearingradiodiv').hide();
        }
        if (String(mnhdate) != "") {
            $('#mhearingradio').val(mnhdate.trim());
            $('#mhearingdttext').text(mnhdate.trim());
            $('#mhearingradiodiv').show();
        }
        else {
            $('#mhearingradiodiv').hide();
        }
        $("#alertmobpanel").css("display", "none");
        $("#alertemailpanel").css("display", "none");
        $("#alertmobpanel1").css("display", "none");
        $("#clientnamediv").css("display", "none");
        var selectedRdVal = $('input[name="Alerttypes"]:checked').val();
        if (selectedRdVal == 'hearigbasis') {
            $("#divfrequency").show();
            $("#hearingdates").show();
            $("#divalertdeatils").hide();
        }
        clearForm();
        loadsavealerts();

        $("#alersettigspopup").show();
        $("#Alertdetailslist").hide();
        $('#myModalcasealerts').modal({ show: true });

        clearForm();
    });
    $("#ddlHearing").click(function () {
        var ddlval = $("#ddlHearing").val();
        if (ddlval == 3) {
            document.getElementById("ddldays").disabled = true;
            document.getElementById("ddldays").value = 0;
        }
        else {
            document.getElementById("ddldays").disabled = false;
        }
    });
    /*Load save alert*/
    function loadsavealerts() {
        

        $("#assignusercasedata").html("");
        var html = '';
        var formData = new FormData();
        var caseid = $("#textleadid").text();
        var IsReras = $("#Isreras").val();
        formData.append("caseid", caseid);
        formData.append("Isrerachecks", IsReras);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/firm/loadcasealerts",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                if (response1 == "") {
                    $(".nofoundst").css("display", "block");
                }
                else {
                    $(".nofoundst").css("display", "none");
                }
                var datas1 = JSON.stringify(response1);
                var countdays1 = "";
                $.each(response1, function (i, a) {
                    if (a.alertDays != "0") {
                        countdays1 = a.alertDays;
                    }
                    else {
                        countdays1 = "";
                    }
                    var Manualnexthearing = "";
                    if (String(a.Manualnexthearing) == null || String(a.Manualnexthearing) == "null" || String(a.Manualnexthearing) == "undefined") {
                        Manualnexthearing = "";
                    }
                    else {
                        Manualnexthearing = formatDatetoIST(a.Manualnexthearing);
                    }
                    html += '<tr><td> ' + a.masterappealno + '</td><td>' + a.vCaseName + ' <td> ' + a.Courtname + '</td><td>' + a.vnexthearing + '</td><td> ' + Manualnexthearing + '</td>';
                    html += '<td>' + a.Mobile + '</td><td> ' + a.Email + '</td><td>' + a.createdOn + '<td>' + a.alertdate + '</td><td>' + a.isSent + '</td><td>' + a.AlertFor + '</td><td><a title="Remove this Alert" href="#"  id="removecasealert" data-val=' + a.ID + '><img src="/newassets/img/deletecasesingle-icon.png" /></a></td></tr>';
                });
                assignusercasedata
                $("#assignusercasedata").append(html);
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
    /*save alerts*/
    $('input[type=radio][name=hearingdateradio]').change(function () {
        $("#savealerts").attr("date-val", $(this).val().trim());
    });
    /*For validating the alert settigs*/
    $("#ddlHearing").click(function () {
        var ddlval = $("#ddlHearing").val();
        if (ddlval == 3) {
            document.getElementById("ddldays").disabled = true;
            document.getElementById("ddldays").value = 0;
        }
        else {
            document.getElementById("ddldays").disabled = false;
        }
    });
    $("#savealerts").click(function () {
        if ($('input[name="hearingdates"]').is(':checked')) {
            //let selectedValue = $('input[name="hearingdates"]:checked').val();
            //alert(selectedValue); // 👉 will show "nexthearingdate"
            //return false;
        }
        else {
            alert("Please select the alert type");
            return false;
        }
        var iid = "0";
        var caseid = $("#textleadid").text();
        var hearingAlert = $("#ddlHearing").val();
        var alertDays = $("#ddldays").val();
        var alerttypeids = $("input[name='Alerttypes']:checked").val();
        if (alerttypeids == "hearigbasis") {
            if ($('input[name="hearingdates"]').is(':checked')) {
            } else {
                //alert("Please select the alert type");
                alert("Please select Next Hearing date");
                return false;
            }

        }
        //if (alerttypeids == "datebasis") {
        //    hearingAlert = "0";
        //    alertDays = "";
        //}
        var hearingtype = $("input[name='hearingdates']:checked").val();
        //var hdate = $(this).attr("date-val");
        var nhdate = $("#hearingradio").val();
        var mhdate = $("#mhearingradio").val();
        if (hearingtype == "nexthearingdate") {
            if (nhdate == "") {
                alert("Please select Next Hearing date");
                return false;
            }
            else {
                hdate = nhdate;
            }
        } else if (hearingtype == "manualhdate") {
            if (mhdate == "") {
                alert("Please select Next Hearing date");
                return false;
            } else {
                hdate = mhdate;
            }
        }

        else {
            hdate = nhdate;
        }
        var alertfor = $("#ddlalertfor").val();
        var cmobile = $("#clientmobile").val();
        var cemail = $("#cientemail").val();
        var caldate = $("#callfromdate").val();
        var cname = $("#clientname").val();
        //if (caldate != "") {
        //    var currentDt = new Date(caldate);
        //    var mm = currentDt.getMonth() + 1;
        //    mm = (mm < 10) ? '0' + mm : mm;
        //    var dd = currentDt.getDate();
        //    dd = (dd < 10) ? '0' + dd : dd;
        //    var yyyy = currentDt.getFullYear();
        //    caldate = mm + '/' + dd + '/' + yyyy;
        //}
        //if (caldate != "" && (hearingAlert != "0" || alertDays != "")) {
        //    alert("Please select one Date");
        //    return false;
        //}
        //if (caldate == "") {
        //    if (hearingAlert != 3) {
        //        if (alertDays == 0) {
        //            alert("Please Set Alert Date");
        //            return false;
        //        }
        //    }
        //    if (hearingAlert == 0) {
        //        alert("Please Set Alert Date");
        //        return false;
        //    }
        //    if (hearingAlert == 3 && alertDays == "") {
        //        alertDays = "0";
        //    }
        //}
        //if (caldate != "") {
        //    alertDays = 0;
        //    hearingAlert == 0;
        //}
        if (alertfor == "") {
            alert("Select Set Alert For");
            return false;
        }
        if (alertfor == 0) {
            if (cname.trim() == "") {
                alert("Please select Client Name");
                return false;
            }
            if (cmobile.trim() == "") {
                alert("Please Enter Mobile Number");
                return false;
            }
            if (cmobile != "") {
                if (cmobile.length < 10) {
                    alert("Please Enter Valid Mobile Number")
                    return false;
                }
                var mob = /^[1-9]{1}[0-9]{9}$/;
                if (mob.test(cmobile) == false) {
                    alert("Please Enter valid Mobile Number");
                    document.getElementById("clientmobile").focus();
                    return false;
                }
            }
            if (cemail.trim() == "") {
                alert("Please Please enter the E-mail Id.");
                return false;
            }
            if (cemail != "") {
                var letters = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!cemail.match(letters)) {
                    alert("Please Enter Valid Email Id");
                    document.getElementById("cientemail").focus();
                    return false;
                }
            }
        }
        var formData = new FormData();
        formData.append("iid", iid);
        formData.append("caseid", caseid);
        formData.append("hearingAlert", hearingAlert);
        formData.append("alertDays", alertDays);
        formData.append("hdate", hdate);
        formData.append("alertfor", alertfor);
        formData.append("cmobile", cmobile);
        formData.append("cemail", cemail);
        formData.append("caldate", '');
        formData.append("IsReracheck", "");
        formData.append("cname", cname);

        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/firm/InsertAlertSetting",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data == "exceed") {
                    alert("Sorry! You have set maximum alerts.");
                    closeload();
                }
                else if (data == "previousdate") {
                    alert("You can set alert for future date.");
                    closeload();
                }
                else if (data == "exists") {
                    alert("Already you have set alert for this.");
                    closeload();
                }
                else {
                    //alert("Alert saved successfully")
                    $("#myModalSetAlertConfirmation").modal();
                    clearForm();
                    loadsavealerts();
                    closeload();
                }
            }
        });
    });

    //$(document).on("click", "#savealerts", function () {

    //    var iid = "0";
    //    var caseid = $("#textleadid").text();
    //    var hearingAlert = $("#ddlHearing").val();
    //    var alertDays = $("#ddldays").val();
    //    var hdate = $(this).attr("date-val");//  $("#txtdate").val();
    //    var IsRerachecks = $("#Isreras").val();
    //    var alertfor = $("#ddlalertfor").val();
    //    var cmobile = $("#clientmobile").val();
    //    var cemail = $("#cientemail").val();
    //    var caldate = $("#callfromdate").val();
    //    if (caldate != "") {
    //        var currentDt = new Date(caldate);
    //        var mm = currentDt.getMonth() + 1;
    //        mm = (mm < 10) ? '0' + mm : mm;
    //        var dd = currentDt.getDate();
    //        dd = (dd < 10) ? '0' + dd : dd;
    //        var yyyy = currentDt.getFullYear();
    //        caldate = mm + '/' + dd + '/' + yyyy;
    //    }
    //    if (caldate != "" && (hearingAlert != "0" || alertDays != "")) {
    //        alert("Please select one Date");
    //        return false;
    //    }
    //    if (caldate == "") {
    //        if (hearingAlert != 3) {
    //            if (alertDays == 0) {
    //                alert("Please Set Alert Date");
    //                return false;
    //            }
    //        }
    //        if (hearingAlert == 0) {
    //            alert("Please Set Alert Date");
    //            return false;
    //        }
    //        if (hearingAlert == 3 && alertDays == "") {
    //            alertDays = "0";
    //        }
    //    }
    //    if (caldate != "") {
    //        alertDays = 0;
    //        hearingAlert == 0;
    //    }
    //    if (alertfor == "") {
    //        alert("Select Set Alert For");
    //        return false;
    //    }
    //    if (alertfor == 0) {
    //        if (cmobile.trim() == "") {
    //            alert("Please Enter Mobile Number");
    //            return false;
    //        }
    //        if (cmobile != "") {
    //            if (cmobile.length < 10) {
    //                alert("Please Enter Valid Mobile Number")
    //                return false;
    //            }
    //            var mob = /^[1-9]{1}[0-9]{9}$/;
    //            if (mob.test(cmobile) == false) {
    //                alert("Please Enter valid Mobile Number");
    //                document.getElementById("clientmobile").focus();
    //                return false;
    //            }
    //        }
    //        if (cemail.trim() == "") {
    //            alert("Please Please enter the E-mail Id.");
    //            return false;
    //        }
    //        if (cemail != "") {
    //            var letters = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //            if (!cemail.match(letters)) {
    //                alert("Please Enter Valid Email Id");
    //                document.getElementById("cientemail").focus();
    //                return false;
    //            }
    //        }
    //    }
    //    var formData = new FormData();
    //    formData.append("iid", iid);
    //    formData.append("caseid", caseid);
    //    formData.append("hearingAlert", hearingAlert);
    //    formData.append("alertDays", alertDays);
    //    formData.append("hdate", hdate);
    //    formData.append("alertfor", alertfor);
    //    formData.append("cmobile", cmobile);
    //    formData.append("cemail", cemail);
    //    formData.append("caldate", caldate);
    //    formData.append("IsReracheck", IsRerachecks);
    //    openload();
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/firm/InsertAlertSetting",
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (data) {
    //            if (data == "exceed") {
    //                alert("Sorry! You have set maximum alerts.");
    //                closeload();
    //            }
    //            else if (data == "previousdate") {
    //                alert("You can set alert for future date.");
    //                closeload();
    //            }
    //            else if (data == "exists") {
    //                alert("Already you have set alert for this.");
    //                closeload();
    //            }
    //            else {
    //                alert("Alert saved successfully");
    //                clearForm();
    //                loadsavealerts();
    //                closeload();
    //            }
    //        }
    //    });
    //});
    /*Remove alerts*/
    $(document).on("click", "#removecasealert", function () {
        var formData = new FormData();
        var IsReras = $("#Isreras").val();
        formData.append("casealertid", $(this).attr("data-val"));
        formData.append("IsRerachecks", IsReras);
        var result = confirm("Are you sure to delete this case alert?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/firm/removecasealert",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    alert("Alert removed successfully");
                    loadsavealerts();
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
    });
    $('#ddlalertfor').on('change', function () {
       
        $("#casewatchtypeid").hide();
        $('#txtcontact').val("");
        if (this.value == "0") {
            $("#alertmobpanel").css("display", "unset");
            $("#alertemailpanel").css("display", "unset");
            $("#clientnamediv").css("display", "unset");
            if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                $("#casewatchtypeid").show();
            }
        }
        else {
            $("#alertmobpanel").css("display", "none");
            $("#alertemailpanel").css("display", "none");
            $("#clientnamediv").css("display", "none");
            $("#selectedClientValue").hide();
        }
    });



    /*for find taglist*/
    function BindTagList(idsss) {
        var formData = new FormData();
        formData.append("usercaseids", idsss);
        var html6 = "";
        $('#tagListContent').html('');
        $.ajax({
            type: "POST",
            url: "/CW/CaseTageByCaseId", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response);
                if (obj.data == "[]") {
                    $("#taglistContentNA").show();
                }
                else {
                    $("#taglistContentNA").hide();
                }
                $.each(obj.data, function (i, a) {
                    html6 += "<tr>";
                    html6 += "<td>" + formatDatetoIST(a.dEntryDate) + "</td>";
                    html6 += "<td>" + a.vTaggedName + "</td>";
                    html6 += "<td><i class='glyphicon glyphicon-trash' id='Removetaglist' data-userid='" + a.vMainiid + "' data-id='" + a.vTaggedName + "' title='Remove Details'></i></td>";
                    html6 += "</tr>";
                    $("#tagListContent").html(html6);
                });
                return false;
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*for Removing Tag by caseid*/
    $(document).on("click", "#Removetaglist", function () {
        //var caseids = $(this).attr("data-userid");
        var tagids = $(this).attr("data-id");
        var usercaseids = $("#Idslist").val();
        var formData = new FormData();
        formData.append("taggedname", tagids);
        formData.append("usercaseids", usercaseids);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/CW/RemoveCaseTag", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var data = JSON.parse(response);
                    if (String(data.Status) == "true") {
                        alert("Tag removed successfully.");
                        BindTagList(usercaseids);
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
    /*for tag Adding on case*/
    $(document).on("click", "#Opentag", function () {
        var caseids = $(this).attr("data-id");
        var istagid = $(this).attr("istagid");
        if (istagid > 0) {
            $("#taglisttable").show();
        } else {
            $("#taglisttable").hide();
        }
        $("#Idslist").val(caseids);
        $("#tagusercasid").val(caseids);
        BindTag();
        BindTagList(caseids);
        $('#myModalopentag').modal({ show: true });
    });
    /*for table serch filter*/
    $("#lcasesearchdatas").click(function () {
        var casefiltercasename = $("#lcasefiltercaseno").val();
        if (casefiltercasename == "") {
            alert("Please enter the case no.");
            $("#lcasefiltercaseno").focus();
            return false;
        }
        $("#lcaseclearnewsearchcase").css("display", "unset")
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#lcaseclearnewsearchcase").click(function () {
        $("#lcasefiltercaseno").val("");
        $("#lcaseclearnewsearchcase").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
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
        isRenderPage = false;

        loaddatalist(1);
        $("#nexthearingcleardate").css("display", "block");
        $("#nexthearingdesc").show();
        $("#nexthearingasc").hide();
    });

    $("#nexthearingcleardate").click(function () {
        $("#nextheringfilterdate").val("");
        $("#nexthearingfilterdateTo").val("");
        $("#nexthearingcleardate").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
    });

    $("#nexthearingasc").click(function () {
        nhdSortVal = "asc";
        isRenderPage = false;

        loaddatalist(pageindex);
        $("#nexthearingdesc").show();
        $("#nexthearingasc").hide();
    });
    $("#nexthearingdesc").click(function () {
        nhdSortVal = "desc";
        isRenderPage = false;

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
        isRenderPage = false;

        loaddatalist(pageindex);
    });
    /*mnext hearing filter */
    $("#mnexthearingdsearch").click(function () {
        var fromd = $("#mnextheringfilterdate").val();
        var tod = $("#mnexthearingfilterdateTo").val();
        mnexthearingflag = 1;
        if (fromd == "") {
            alert("Please select filter from date");
            $("#mnextheringfilterdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to date");
            $("#mnexthearingfilterdateTo").focus();
            return false;
        }
        isRenderPage = false;

        loaddatalist(1);
        $("#mnexthearingcleardate").css("display", "block");
    });
    $("#mnexthearingcleardate").click(function () {
        $("#mnextheringfilterdate").val("");
        $("#mnexthearingfilterdateTo").val("");
        $("#mnexthearingcleardate").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
    });
    /*status filter*/
    $("#lstatus").change(function () {

        isRenderPage = false;

        loaddatalist(pageindex);
    });
    /*Court filter*/
    $("#lcasefiltercourt").change(function () {
        isRenderPage = false;

        loaddatalist(pageindex);
    });

    /*Assign Team Member filter*/
    $("#lcaseteammemberlist").change(function () {
        isRenderPage = false;

        loaddatalist(pageindex);
    });

    /*case name filter*/
    $("#lcasenamesearchdatas").click(function () {
        var casefiltercasename = $("#lcasenamefilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the case name");
            $("#lcasenamefilter").focus();
            return false;
        }
        $("#lcasenameclearnewsearch").css("display", "unset")
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#lcasenameclearnewsearch").click(function () {
        $("#lcasenamefilter").val("");
        $("#lcasenameclearnewsearch").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
    });
    /*court/district filter*/
    $("#courtnsearchdatas").click(function () {
        var casefiltercasename = $("#courtcasenamefilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the court name");
            $("#courtcasenamefilter").focus();
            return false;
        }
        $("#courtnclearnewsearch").css("display", "unset")
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#courtnclearnewsearch").click(function () {
        $("#courtcasenamefilter").val("");
        $("#courtnclearnewsearch").css("display", "none");
        isRenderPage = false;

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
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#advocateclearnewsearch").click(function () {
        $("#advocatefilter").val("");
        $("#advocateclearnewsearch").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
    });
    /*Tag filter*/
    $("#ltagilter").change(function () {
        isRenderPage = false;

        loaddatalist(pageindex);
    });
    /* Remarks search filter */
    /*court/district filter*/
    $("#remarkssearchdatas").click(function () {
        var casefiltercasename = $("#courtremarksfilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the remarks");
            $("#courtremarksfilter").focus();
            return false;
        }
        $("#remarksclearnewsearch").css("display", "unset")
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#remarksclearnewsearch").click(function () {
        $("#courtremarksfilter").val("");
        $("#remarksclearnewsearch").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
    });

    /*Full cause list search*/
    $(document).on("click", "#fullcauselistId", function () {
        var ISReraCourt = "";
        var ids1 = $(this).attr("data-id");
        var courtType = $(this).attr("data-courttypeId");
        var url = "/firm/CaseCauseList?status=true&id=" + ids1 + "&isRera=" + ISReraCourt + "&courtTypeId=" + courtType;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
    });
    /* Set manual nexthearing data start */
    $(document).on("click", "#SetManualAlert", function () {
        $("#manualnhdate1").val('');
        $("#nhhide").val($(this).attr("nhdate"));
        $("#caseidhide").val($(this).attr("data-id"));
        $("#mastercaseid").val($(this).attr("mcaseid"))
        $('#myModalmanualhearing').modal({ show: true });
    });
    $("#setmanualnh").click(function () {
        var mnhdate = $("#manualnhdate1").val();
        if (mnhdate == "") {
            alert("Select manual hearing date");
            $("#manualnhdate1").focus();
            return false;
        }
        var formData = new FormData();
        formData.append("userCaseId", $("#caseidhide").val());
        formData.append("caseid", $("#mastercaseid").val());
        formData.append("oldnhdate", $("#nhhide").val());
        formData.append("nhdate", mnhdate);
        formData.append("IsReracourt", ISReraCourt);
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/firm/SaveManualNextHearing",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data == "Updated Successfully") {
                    alert("Manual Next Hearing saved successfully.");
                    isRenderPage = false;

                    loaddatalist(pageindex);
                    $('#myModalmanualhearing').modal('hide');
                    closeload();
                }
                else {
                    alert(data);
                    closeload();
                }
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
    });
    // End manual nexthearing date settings //
    //Add multiple action like caveat,notices and some other details
    $(document).on("click", "#opendetails", function () {
        var type = $(this).attr("type");
        var caseid = $("#lUsecaseid").val();
        // var caseid = $(this).attr("caseid");
        var formData = new FormData();
        formData.append("doctype", type);
        formData.append("caseid", caseid);
        $('#myModalSCourtDetails').modal({ show: true });
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/SupremeCourtNotesAndOthers",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                var obj = JSON.parse(data);
                if (type == "officereports") {
                    $('#ScourtDetailsLabel').html("OFFICE REPORTS");
                    $.each(obj.data, function (i, a) {
                        $('#SCourtDetailsbody').html(a["Office Reports"]);
                    });
                    closeload();
                }
                else if (type == "earliercourt") {
                    $('#ScourtDetailsLabel').html("EARLIER COURT DETAILS");
                    $.each(obj.data, function (i, a) {
                        $('#SCourtDetailsbody').html(a["Earlier Court Details"]);
                    });
                    closeload();
                }
                else if (type == "notices") {
                    $('#ScourtDetailsLabel').html("Notices");
                    $.each(obj.data, function (i, a) {
                        $('#SCourtDetailsbody').html(a["Notices"]);
                    });
                    closeload();
                }
                else if (type == "caveat") {
                    $('#ScourtDetailsLabel').html("Caveat");
                    $.each(obj.data, function (i, a) {
                        $('#SCourtDetailsbody').html(a["Caveat"]);
                    });
                    closeload();
                }
                else if (type == "OtherDetails") {
                    $('#ScourtDetailsLabel').html("Other Details");
                    $.each(obj.data, function (i, a) {
                        $('#SCourtDetailsbody').html(a["Details"]);
                    });
                    closeload();
                }
                else {
                    closeload();
                }
            }
        });
    });
    //for Re-run case
    $(document).on('click', '#Reruncase', function () {
        var selectedIDd = $(this).attr("data-id");
        openload();
        var formData = new FormData();
        formData.append("Usercaseid", selectedIDd);
        $.ajax({
            type: "POST",
            url: "/CW/LitigationCaseRerun", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "True") {
                    //alert("Case status set for rerun. Please wait for process to complete.");
                    $("#AddReRunModal").modal();
                    isRenderPage = false;

                    loaddatalist(1);
                    //closeload();
                }
                else {
                    closeload();
                }
            },
            error: function () {
                alert('Error!');
                closeload();
            }
        });
    });
    $(document).on('click', '#Removecasewatch', function () {
        var selectedIDd = $(this).attr("data-id");
        $("#deletesingle_finaltime").attr("data-id", selectedIDd);
        $("#deleteLitigationcaselist").modal();
    });
    /*//for remove case to Casewacth */
    $(document).on('click', '#deletesingle_finaltime', function () {
        var selectedIDd = $(this).attr("data-id");
        openload();
        var formData = new FormData();
        formData.append("Usercaseid", selectedIDd);
        //var result = confirm("Are you sure to delete case?");
        //if (result) {
        $.ajax({
            type: "POST",
            url: "/CW/LitigationCaseReomve", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "True") {
                    alert("Case deleted successfully.");
                    isRenderPage = false;

                    loaddatalist(pageindex);
                    $("#deleteLitigationcaselist").modal("hide");
                    closeload();
                }
                else {
                    alert("Sorry! Unable to Delete now.Please try again later.");
                    $("#deleteLitigationcaselist").modal("hide");
                    closeload();
                }
            },
            error: function () {
                alert('Error!');
                closeload();
            }
        });
        //}
        //else {
        //    closeload();
        //}
    });
    /*for casedetails coloumn informations*/
    $(document).on('click', '#opencasenodetails', function () {
        $('#casedetais')[0].reset();
        $("#Lfilingno").text('');
        $("#Lfilingdate").text('');
        $("#lRegistrionNo").text('');
        $("#lRegistrationdate").text('');
        $("#lcourrtno").text('');
        $("#lfirsthearingdate").text('');
        $('#myModalcasedetails').modal({ show: true });
        var UsercaseId = $(this).attr("UsercaseId");
        var caseids = $(this).attr("caseid");
        var courttype = $(this).attr("courtype");
        $("#lUsecaseid").val(UsercaseId);
        if (courttype == "1") {
            $("#erliercourttr").show();
            $("#othercourttr").show();
        } else {
            $("#erliercourttr").hide();
            $("#othercourttr").hide();
        }
        var formData = new FormData();
        formData.append("Usercaseid", caseids);
        formData.append("courttype", courttype);
        openload();
        $.ajax({
            type: "POST",
            url: "/CW/LitigationCaseDetailsByUsercaseId", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.length > 0) {
                    if (response[0].Filingno != null) {
                        $("#Lfilingno").text(response[0].Filingno);
                    }
                    if (response[0].FilingDate != null) {
                        $("#Lfilingdate").text(response[0].FilingDate);
                    }
                    if (response[0].RegistationNo != null) {
                        $("#lRegistrionNo").text(response[0].RegistationNo);
                    }
                    if (response[0].RegistationDate != null) {
                        $("#lRegistrationdate").text(response[0].RegistationDate);
                    }
                    if (response[0].CourtNumber != null) {
                        $("#lcourrtno").text(response[0].CourtNumber);
                    }
                    if (response[0].Firsthearingdate != null) {
                        $("#lfirsthearingdate").text(response[0].Firsthearingdate);
                    }
                    closeload();
                }
                closeload();
            },
            error: function () {
                alert('Error!');
                closeload();
            }
        });
    });
    /*for order details */
    $(document).on("click", "#openorders", function () {
        openload();
        var casedirynos = $(this).attr("lcasediry");
        var lcasenames = $(this).attr("lcasenames");
        var lcourt = $(this).attr("lcourt");
        var lAdvocate = $(this).attr("lAdvocate");
        var ldsiposedate = $(this).attr("ldsiposedate");
        var lstatuse = $(this).attr("lstatuse");
        localStorage.setItem('emailcasedno', casedirynos);
        localStorage.setItem('emailcourt', lcourt);
        localStorage.setItem('emailcasename', lcasenames);
        localStorage.setItem('emailadv', lAdvocate);
        localStorage.setItem('emaildspdate', ldsiposedate);
        localStorage.setItem('emailstatus', lstatuse);
        var usercaseids = $(this).attr("data-id");
        var caseids = $(this).attr("data-caseid");
        var IsRevenueCourt = "";
        var ISReraCourt = "";
        var url = "/firm/CaseOrders?status=true&id=" + caseids + "&caseid=" + usercaseids + "&IsRevenueCourt=" + IsRevenueCourt + "&IsReraCourt=" + ISReraCourt;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
            closeload();
        });
    });

    /*Update CW Matters */
    $(document).on('click', '#UpdateMatterModel', function () {
        var casewatchcaseid = $(this).attr("cwid");
        var casenos = $(this).attr("scasenoss");
        var courtname = $(this).attr("scourtname");
        var othcourtname = $(this).attr("sothetcourtname");
        $("#CWCaseNo").val(casenos);
        $("#CWCourtName").val(courtname);
        $("#CWOtherCourtName").val(othcourtname);

        LoadCWMatters(casewatchcaseid);
    });

    /*Load CW Matter*/
    function LoadCWMatters(casewatchcaseid) {
        var formData = new FormData();
        formData.append("caseid", EncodeText(casewatchcaseid));
        var htmls = '';
        var q1 = 0;
        $("#CWmatterId").val('')
        $("#CWMatterName").val('');
        $("#CWCaseId").val('')
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CWMatterDetailsByUserCaseId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                if (obj != null) {
                    $("#CWmatterId").val(obj.Id)
                    $("#CWMatterName").val(obj.mname);
                    $("#saveCWCaseList").hide();
                    $("#EditCWCaseList").show();
                }
                else {
                    $("#saveCWCaseList").show();
                    $("#EditCWCaseList").hide();
                }
                $("#CWCaseId").val(casewatchcaseid)
                $('#UpdateCWmatter').modal({ show: true });

                // $("#bindcasewatchalertuser").empty().html(htmls);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }

    /* Update CW Matters */
    $(document).on('click', '#EditCWCaseList', function () {

        var Matterids = $("#CWmatterId").val();
        var CWMatterName = $("#CWMatterName").val();
        var CWUserCaseIds = $("#CWCaseId").val();
        if (CWMatterName == "") {
            alert("Please enter the matter name");
            return false;
        }
        var reg = /[:*?"<>|$%#!~+*^]/;
        if (reg.test(CWMatterName) == true) {
            alert('[:*?"<>|$%#!~+*^] are not allowed in Matter name.');
            document.getElementById("fsideCasename").focus();
            return false;
        }
        CWMatterName = String(CWMatterName).replace(/[:*?"<>|$%#!~+*^]/g, '');
        CWMatterName = $.trim(CWMatterName);
        var formData = new FormData();
        formData.append("Matterids", Matterids);
        formData.append("CWMatterName", CWMatterName);
        formData.append("CWUserCaseIds", CWUserCaseIds);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/MatterApi/CWMatterUpdate",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    // var data = JSON.parse(response);
                    if (String(response.Data) == "exist") {
                        alert("Already exist matter name. please try another matter name.");
                        closeload();
                    } else if (String(response.Data) > "0") {
                        alert("Matter update successfully.");
                        closeload();
                        // $('#UpdateCWmatter').modal({ show: false });
                        $('#UpdateCWmatter').modal('hide');
                        isRenderPage = false;

                        loaddatalist(pageindex);
                    }

                    else {
                        alert("something went wrong!");
                        closeload();
                    }
                },
                failure: function (response) {
                    alert(response.responseText);
                    closeload();
                },
                error: function (response) {
                    alert(response.responseText);
                    closeload();
                }
            });

    });

    /* Save CW Matters */
    $(document).on('click', '#saveCWCaseList', function () {

        var CWMatterName = $("#CWMatterName").val();
        var CWUserCaseIds = $("#CWCaseId").val();
        var casenos = $("#CWCaseNo").val();
        var caseno = removespecialtag(casenos);
        var courtname = $("#CWCourtName").val();
        var othercourtname = $("#CWOtherCourtName").val();
        if (CWMatterName == "") {
            alert("Please enter the matter name");
            return false;
        }
        var reg = /[:*?"<>|$%#!~+*^]/;
        if (reg.test(CWMatterName) == true) {
            alert('[:*?"<>|$%#!~+*^] are not allowed in Matter name.');
            document.getElementById("fsideCasename").focus();
            return false;
        }
        CWMatterName = String(CWMatterName).replace(/[:*?"<>|$%#!~+*^]/g, '');
        CWMatterName = $.trim(CWMatterName);
        var formData = new FormData();
        formData.append("CWMatterName", CWMatterName);
        formData.append("CWUserCaseIds", CWUserCaseIds);
        formData.append("casenos", caseno);
        formData.append("courtname", courtname);
        formData.append("othercourtname", othercourtname);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/MatterApi/CWMatterSave",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    // var data = JSON.parse(response);
                    if (String(response.Data) == "sucess") {
                        alert("Matter save successfully.");
                        closeload();
                        $('#UpdateCWmatter').modal('hide');
                        isRenderPage = false;

                        loaddatalist(pageindex);
                    }
                    else if (String(response.Data) == "exist") {
                        alert("Already exist matter name. please try another matter name.");
                        closeload();
                    }
                    else if (String(response.Data) == "Error") {
                        alert("something went wrong!");
                        closeload();
                    }
                    else {
                        alert("something went wrong!");
                        closeload();
                    }
                },
                failure: function (response) {
                    alert(response.responseText);
                    closeload();
                },
                error: function (response) {
                    alert(response.responseText);
                    closeload();
                }
            });

    });

    /* Petioner search filter */
    $("#Petitionersearchdatas").click(function () {
        var casefiltercasename = $("#Petitionerfilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the petitioner name");
            $("#Petitionerfilter").focus();
            return false;
        }
        $("#Petitionersearchdatas").css("display", "none");
        $("#Petitionerclearnewsearch").css("display", "unset")
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#Petitionerclearnewsearch").click(function () {
        $("#Petitionerfilter").val("");
        $("#Petitionerclearnewsearch").css("display", "none");
        $("#Petitionersearchdatas").css("display", "unset");
        isRenderPage = false;

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
        $("#Respondentsearchdatas").css("display", "none");
        $("#Respondentclearnewsearch").css("display", "unset")
        isRenderPage = false;

        loaddatalist(1);
    });
    $("#Respondentclearnewsearch").click(function () {
        $("#Respondentfilter").val("");
        $("#Respondentsearchdatas").css("display", "unset");
        $("#Respondentclearnewsearch").css("display", "none");
        isRenderPage = false;

        loaddatalist(1);
    });

    /* Upload Custom Order */
    $(document).on("click", "#openAppendCOurtManualOrder", function () {
        //$("#id-val="' + a.CaseId + '" case-val="' + a.Id + '"")
        var ids = $(this).attr("id-val");
        document.getElementById("hdnCustomCaseid").value = ids;
        $('#myModalAppendCOurtManualOrder').modal({ show: true });
    });
    $("#btnAddCustomOrder").click(function () {
        var caseid = document.getElementById("hdnCustomCaseid").value;
        var corderdate = document.getElementById("customorderdate").value;
        var cstatus = document.getElementById("customstatus").value;
        if (corderdate == "") {
            alert("Please select order date.");
            return false;
        }
        if (document.getElementById("fileCustomOrder").value == "") {
            alert("Please select file.");
            document.getElementById("fileCustomOrder").focus();
            return false;
        }
        var filename = document.getElementById("fileCustomOrder").value;
        var fileUpload = $("#fileCustomOrder").get(0);
        var files = fileUpload.files;
        // Create FormData object  
        var fileData = new FormData();
        // Looping over all files and add it to FormData object  
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }
        fileData.append('caseid', caseid);
        fileData.append('orderid', "");
        fileData.append('corderdate', corderdate);
        fileData.append('status', cstatus);
        openload();
        $.ajax({
            url: '/CW/UploadCustomOrderDocument',
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            success: function (result) {
                if (String(result) == "FileSizeLimit") {
                    alert("Document should be less than 5MB.");
                    closeload();
                    return false;
                }
                var data = JSON.parse(result);
                //Message":"Successfully saved"
                if (String(data.Message) == "Successfully saved") {
                    alert("Document Uploaded Successfully.");
                    $("#fileCustomOrder,#customorderdate,#customstatus").val("");
                    $("#clickupload").click();
                    closeload();
                    return false;
                }
                else if (String(data.Message) == "Exist") {
                    alert("Document Already Exist.");
                    closeload();
                    return false;
                }
                else if (String(data.Message) == "Exceed") {
                    alert("Space limit exceed, please upgrade your plan.");
                    closeload();
                    return false;
                }
                else {
                    alert("Document not uploaded successfully.");
                    closeload();
                    return false;
                }
            }
        });
    });
    /* IOB Custmization */
    $(document).on("click", "#ViewBranchCode", function () {
        var UserCaseids = $(this).attr("data-id");
        var BranchCode = $(this).attr("sno");
        var RegionCode = $(this).attr("regioncode");
        $("#updatedusercasesid1").val(UserCaseids);
        $('#myModalIOBCustmization').modal({ show: true });
        $("#fbrancename").html('');
        $("#fregionname").html('');
        LoadRegionList(RegionCode, BranchCode);
    });

    //Get Branch List
    $(document).on("change", "#fregionname", function () {
        var regionid = $(this).val();
        LoadBrachList(regionid, "")
    });

    function LoadBrachList(regionid, branchId) {
        var formData = new FormData();
        var html1 = "";
        formData.append("regionid", EncodeText(regionid));
        openload();
        $.ajax({
            type: "POST",
            url: "/CW/GetBranchNameList",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response);
                $("#fbrancename").html('');
                html1 += '<option value="" selected>Please select</option>';
                $.each(obj.data, function (i, a) {
                    if (a.Branchcode == branchId) {
                        html1 += '<option value="' + a.Branchcode + '" selected>  ' + a.BranchName + '</option>';
                    }
                    else {
                        html1 += '<option value="' + a.Branchcode + '">  ' + a.BranchName + '</option>';
                    }
                    $("#fbrancename").html(html1);
                    closeload();
                });
                closeload();
            },
            failure: function (response) {
                alert(response.responseText);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    function LoadRegionList(RegionCode, BranchCode) {
        var formData = new FormData();
        var html1 = "";
        openload();
        $.ajax({
            type: "POST",
            url: "/CW/GetRegionNameList",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response);
                $("#fregionname").html('');
                html1 += '<option value="" selected>Please select</option>';
                $.each(obj.data, function (i, a) {
                    if (a.Regioncode == RegionCode) {
                        html1 += '<option value="' + a.Regioncode + '" selected>  ' + a.RegionName + '</option>';
                        LoadBrachList(RegionCode, BranchCode);
                    }
                    else {
                        html1 += '<option value="' + a.Regioncode + '">  ' + a.RegionName + '</option>';
                    }
                    $("#fregionname").html(html1);
                    closeload();
                });
                closeload();
            },
            failure: function (response) {
                alert(response.responseText);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    $(document).on("click", "#btnsavevalus", function () {

        var UserCasids = $("#updatedusercasesid1").val();
        var BranchName = $("#fbrancename").val();
        var RegionName = $("#fregionname").val();

        if (RegionName == "") {
            alert("Please select region.");
            return false;
        }
        if (BranchName == "") {
            alert("Please select branch.");
            return false;
        }
        var formData = new FormData();
        var html1 = "";
        formData.append("caseid", EncodeText(UserCasids));
        formData.append("BranchName", EncodeText(BranchName));
        formData.append("RegionName", EncodeText(RegionName));
        openload();
        $.ajax({
            type: "POST",
            url: "/CW/MapeCaseToBranchName",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response);
                alert(obj.Message);
                $('#IOBList')[0].reset();
                $('#myModalIOBCustmization').modal('hide');
                isRenderPage = false;

                loaddatalist(pageindex);
                closeload();
            },
            failure: function (response) {
                alert(response.responseText);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });

    });
    //IOB Advocate Custmization
    $(document).on('click', '#UpdateAdvocate', function () {
        var casewatchcaseid = $(this).attr("cwid");
        var AdvocateName = $(this).attr("advocate").replace(/(<([^>]+)>)/ig, " ");

        $("#CWUserCaseId").val('');
        $("#CWAdvocateName").val('');
        $("#CWUserCaseId").val(casewatchcaseid);
        $("#CWAdvocateName").val(AdvocateName);
        $('#UpdateAdvocateModel').modal({ show: true });
    });
    // Save Advocate details
    $(document).on('click', '#EditCWAdvocate', function () {

        var CWAdvocateName = $("#CWAdvocateName").val();
        var CWUserCaseIds = $("#CWUserCaseId").val();
        if (CWAdvocateName == "") {
            alert("Please enter the Advocate name");
            return false;
        }
        var reg = /[*?"<>|$%#!~+*^]/;
        if (reg.test(CWAdvocateName) == true) {
            alert('[:*?"<>|$%#!~+*^] are not allowed in Advocate name.');
            document.getElementById("CWAdvocateName").focus();
            return false;
        }
        CWAdvocateName = String(CWAdvocateName).replace(/[:*?"<>|$%#!~+*^]/g, '');
        CWAdvocateName = $.trim(CWAdvocateName);
        var formData = new FormData();
        formData.append("CWAdvocateName", CWAdvocateName);
        formData.append("CWUserCaseIds", CWUserCaseIds);
        openload();
        $.ajax({
            url: '/CW/UpdateAdvocateToCW',
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: formData,
            success: function (response) {
                var data = JSON.parse(response);
                if (String(data.data) >= "1") {
                    alert("Advocate updated successfully.");
                    closeload();
                    $('#UpdateAdvocateModel').modal('hide');
                    isRenderPage = false;

                    loaddatalist(pageindex);
                }
                else if (String(response.Data) == "Error") {
                    alert("something went wrong!");
                    closeload();
                }
                else {
                    alert("something went wrong!");
                    closeload();
                }
            },
            failure: function (response) {
                alert(response.responseText);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });

    });

    /*Closed Reamrk Pop-up*/
    $(document).on('click', '#closeremarkpopup', function () {
        isRenderPage = false;

        loaddatalist(Notepageindex);
    });
    $("#ColumnSelectionopen").click(function () {
        $('#myModalCustomizedcolumn').modal('hide');
        var fcode = localStorage.getItem("FirmCode");
        var url = "/" + fcode + "/CW/LitigationColumnSelection";
        $('.mymodelscolumnselection').load(url, function (result) {
            $('#myModalcolumn').modal({ show: true });
        });
    });
});
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
//bind case user list
var mkcaeids = "";
var cwcasidss = "";
var matternamevalus = "";
loaduserbycaseid("");
$(document).on('click', '#Caseuserdetailmodal', function () {
    var casewatchcaseid = $(this).attr("cwid");
    var mkMatterId = $(this).attr("matterid");
    matternamevalus = $(this).attr("mmnanevalus");
    mkcaeids = mkMatterId;
    cwcasidss = casewatchcaseid;
    // loaduserbycaseid(mkMatterId);
    LoadCasewatchAlertUsers(casewatchcaseid);
});
function loaduserbycaseid(mkMatterId) {
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
            }
            var html3 = '';
            $("#UsersCasewatchAlert").html("");
            $('#lcaseteammemberlist').empty().append('<option value="">Team Member</option>').find('option:first').attr("selected", "selected");
            if (response != null) {
                $.each(obj, function (key, value) {
                    $("#UsersCasewatchAlert,#lcaseteammemberlist").append($("<option></option>").val(value.id).text(value.UserName));
                });
            }
            else {
            }
            if ($.fn.multiselect) {
                $('#UsersCasewatchAlert').multiselect('reload');
            }

        },
        failure: function (response) {
        }, //End of AJAX failure function
        error: function (response) {
            //alert(response.responseText);
        } //End of AJAX error function
    });
}
/*Load Casewatch Alert Users*/
function LoadCasewatchAlertUsers(casewatchcaseid) {
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
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
$(document).on("click", "#savecasewatchuser", function () {
    var formData = new FormData();
    var casealerruser = $("#UsersCasewatchAlert").val();
    if (casealerruser == "") {
        alert("Please select user");
        $("#UsersCasewatchAlert").focus();
        return false;
    }
    formData.append("auser", EncodeText(casealerruser));
    formData.append("caseid", EncodeText(cwcasidss));
    formData.append("token", EncodeText(mkcaeids));
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
            LoadCasewatchAlertUsers(cwcasidss);
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
/*delete Casewatch user alert*/
//$(document).on("click", "#deleteCasewatchuseralert", function () {
//    var formData = new FormData();
//    var auserslist = $(this).attr("data-user");
//    var cwid = $(this).attr("data-id");
//    formData.append("auser", EncodeText(auserslist));
//    formData.append("caseid", EncodeText(cwid));
//    formData.append("token", EncodeText(mkcaeids));
//    openload();
//    $.ajax({
//        async: true,
//        type: "POST",
//        url: "/api/MatterApi/RemoveCasewatchAlertUsers",
//        dataType: 'json',
//        data: formData,
//        contentType: false,
//        processData: false,
//        success: function (response) {
//            alert("User removed successfully");
//            LoadCasewatchAlertUsers(cwcasidss);
//            closeload();
//        }, //End of AJAX Success function
//        failure: function (response) {
//            alert(data.responseText);
//            closeload();
//        }, //End of AJAX failure function
//        error: function (response) {
//            alert(data.responseText);
//            closeload();
//        } //End of AJAX error function
//    });


//});
$(document).on("click", "#deleteCasewatchuseralert", function () {
    var auserslist = $(this).attr("data-user");
    var cwid = $(this).attr("data-id");
    $("#removeUserModalConf").modal();
    $("#removeUserPopup").attr("auserslist", auserslist);
    $("#removeUserPopup").attr("cwid", cwid);
});

$(document).on('click', '#removeUserPopup', function () {
    var auserslist = $(this).attr("auserslist");
    var cwid = $(this).attr("cwid");
    DeleteCaseWatchUserAlertDetail(auserslist, cwid);
});

function DeleteCaseWatchUserAlertDetail(auserslist, cwid) {
    var formData = new FormData();
    formData.append("auser", EncodeText(auserslist));
    formData.append("caseid", EncodeText(cwid));
    formData.append("token", EncodeText(mkcaeids));
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
            new PNotify({
                title: 'Success!',
                text: 'User removed successfully',
                type: 'success',
                delay: 3000
            });
            $("#removeUserModalConf").modal("hide");
            //alert("User removed successfully");
            LoadCasewatchAlertUsers(cwcasidss);
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
}
function OpenOrderNotes(val) {
    var ids = val;
    $("#SaveOrderNotes").attr("data", ids);
    $("#hdnOrderid").val(ids);
    $("#Otherordertxt").val('');
    bindOrderDetails(ids);
    $('#myModalOrderNotes').modal({ show: true });
    $('#myModalOrderNotes').css("z-index", "1100");
}
function bindOrderDetails(val) {
    var formData = new FormData();
    $("#orderdetailsContent").html('');
    formData.append("id", val);
    formData.append("search", "");
    var html6 = "";
    $.ajax({
        type: "POST",
        url: "/CW/MyCaseOrderNotes", // Controller/View
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response);
            if (obj.data == "[]") {
                $("#orderdetailsContentNA").show();
            }
            else {
                $("#orderdetailsContentNA").hide();
            }
            $.each(obj.data, function (i, a) {
                html6 += "<tr>";
                html6 += "<td>" + a.CreatedDate + "</td>";
                html6 += "<td id='tdnotes'>" + a.Notes + "</td>";
                html6 += "</tr>";
                $("#orderdetailsContent").html(html6).attr("ids", a.Iid);
            });
            return false;
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function fillContact(obj) {
    if ($(obj).val().length >= 3) {
        var formData = new FormData();
        formData.append("Search", $(obj).val());
        $.ajax(
            {
                type: "POST",
                url: "/CW/GetLitigationContact", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var length = response.length;
                    $('#selectedClientValue').empty().hide();;
                    $.each(response, function (i, a) {
                        $('#selectedClientValue').show();
                        $('#selectedClientValue').append('<li class="ui-menu-item" role="menuitem"><a href="Javascript:void(0)" fullname="' + this.vFullName + '" onclick=setText("' + this.vEmail + '","' + this.vMobile + '",this)>' + this.vFullName + ' [' + this.vMobile + ']</a></li>')
                    });
                    if (length == 0) {
                        $('#selectedClientValue').show();
                        $('#selectedClientValue').append('<li class="ui-menu-item" role="menuitem">No record found</li>');
                    }
                    return false;
                },
                failure: function (response) {
                    alert(response.responseText);
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });

    }
}
function setText(email, mobile, obj) {
    $("#clientmobile").val(mobile);
    $("#cientemail").val(email);
    $('#txtcontact').val($(obj).attr("fullname"));
    $("#selectedClientValue").hide();
}

$(document).on("click", "#SaveOrderNotes", function () {
    var noteid = $("#SaveOrderNotes").attr("data");
    var formData = new FormData();
    formData.append("Orderid", noteid);
    formData.append("Notes", $('#Otherordertxt').val());
    openload();
    $.ajax(
        {
            type: "POST",
            url: "/CW/OrderAddNotes", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                if (String(data.Status) == "true") {
                    alert("Order notes details updated successfully.");
                    $("#Otherordertxt").val('');
                    OpenOrderNotes(noteid);
                    closeload();
                }
                else {
                    alert("something went wrong!");
                    closeload();
                }
            },
            failure: function (response) {
                alert(response.responseText);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
});


//for Removing the tag

function removespecialtag(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}

$(document).on('mouseenter', '.freeze-text', function (e) {
    let text = $(this).text().trim();

    if (text.includes('×')) {
        text = text.substring(text.lastIndexOf('×') + 1).trim();
    }
    text = text
        .replace(/\s*Petitioner/gi, '<br/>Petitioner')
        .replace(/\s*Respondent/gi, '<br/>Respondent')
        .trim();
    text = text.replace(/^<br\/>/, '');
    if (this.offsetWidth < this.scrollWidth) {
        $('body').append('<div id="custom-tooltip"></div>');
        $('#custom-tooltip')
            .html(text)
            .css({
                position: 'absolute',
                top: e.pageY + 10,
                left: e.pageX + 10,
                background: '#000',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                zIndex: 1000,
                whiteSpace: 'normal',
                maxWidth: '300px'
            });
    }
});

$(document).on('mouseleave', '.freeze-text', function () {
    $('#custom-tooltip').remove();
});

$(document).on('mousemove', '.freeze-text', function (e) {
    $('#custom-tooltip').css({
        top: e.pageY + 10,
        left: e.pageX + 10
    });
});


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

$(document).on('click', '#showtabledeatils', function () {

    $("#alersettigspopup").hide();
    $("#Alertdetailslist").show();

});
function clearForm() {
    $('#savecasealert')[0].reset();
}

$(document).on('click', '#gopreviuspage', function () {

    $("#alersettigspopup").show();
    $("#Alertdetailslist").hide();

});
//$("#CustSelectionopen").click(function () {
//    $("myModalCustomizedcolumn").model({show:true})
//});
