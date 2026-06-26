$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    loadtotalcount();
    //For Customized Field Seclection Start 
    var fieldnamecust = "";
    var fieldvaluecust = "";
    var arrcolmenuseleciton = [];
    //var arrcolmenuselecitonfix = [];
    var firstload = true;
    //END
    $(document).on('mouseenter', '.freeze-text', function (e) {
        const text = $(this).text().trim();
        // Show tooltip only if text exceeds 35 characters
        if (text.length > 35) {
            $('body').append('<div id="custom-tooltip"></div>');
            $('#custom-tooltip')
                .text(text)
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

    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
    var urltype = getUrlVars()["type"];
    var urltypevalue = getUrlVars()["token"];
    var IsPersonaltoken = getUrlVars()["utoken"];
    if (dashcw == "display:unset" && IsCWActive == "1") {
        $(".casecasedetails1,.casecasedetails2,.nexthearing3").show();
    }
    else {
        $(".casecasedetails1,.casecasedetails2,.nexthearing3").show();
    }
    var checkpageindex = localStorage.getItem("MatterPageno");
    try {
        if (parseInt(checkpageindex)) {
            pageindex = checkpageindex;
            localStorage.removeItem("MatterPageno");
        }
    }
    catch
    {
    }
    /*comparator*/
    function comparator(a, b) {
        if (a.dataset.subject < b.dataset.subject)
            return -1;
        if (a.dataset.subject > b.dataset.subject)
            return 1;
        return 0;
    }
    // Function to sort Data
    function SortData() {
        var subjects =
            document.querySelectorAll("[data-subject]");
        var subjectsArray = Array.from(subjects);
        let sorted = subjectsArray.sort(comparator);
        sorted.forEach(e =>
            document.querySelector("#od").
                appendChild(e));
    }
    $("#ColumnSelectionopen").click(function () {
        //openload();
        var url = "/firm/ColumnSelection";
        $('.mymodelscolumnselection').load(url, function (result) {
            // closeload();
            $('#myModalcolumn').modal({ show: true });
        });
    });
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        //alert(token);
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });
    $(document).on("click", "#cnrcaselink", function () {
        var idstemp = $(this).attr("data-val");
        var caseidtemps = $(this).attr("case-val");
        var urls = "/" + fcode + "/Firm/cnrCasedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": caseidtemps, "cnr": idstemp }
        });
    });
    $(document).on("click", "#extrapartytransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/ExtraPartyInformation";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#caseinformationtransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/caseinformationReport";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#viewlimitation", function () {
        var token = $(this).attr("id-val");
        var urls = "/" + fcode + "/Firm/SaveLimitationCase";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#transferEditpage", function () {
        var token = $(this).attr("sno");
        var curpi = $("#pgetdatabypagenum").attr("pageindex");
        localStorage.setItem("MatterPageno", curpi);
        var urls = "/" + fcode + "/Firm/EditCase";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
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
    /*Export in excel*/
    var exportfilter = false;
    $("#oexcel").click(function () {
        $("#Exporttype").val('');
        $("#Exporttype").val("Excel");
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        var html = '<option value="">Please List</option>';
        for (var i = 1; i < recordsection; i++) {
            //html += '<tr>';
            //html += '<td>Page No:' + i + ' </td>';
            //html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
            //html += '</tr>';
            html += '<option value="' + i + '" > ' + i + ' </option>';
        }
        $("#id_exportreportdrop").html(html);
         //$("#printexport").html(html);
    });
    /*Export in pdf*/
    $("#opdf").click(function () {
        $("#Exporttype").val('');
        $("#Exporttype").val("PDF");
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        var html = '<option value="">Please List</option>';
        for (var i = 1; i < recordsection; i++) {
            //html += '<tr>';
            //html += '<td>Page No:' + i + ' </td>';
            //html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffile" pageno="' + i + '" type="pdf">Download File</span></td>';
            //html += '</tr>';
            html += '<option value="' + i + '" > ' + i + ' </option>';
        }
        $("#id_exportreportdrop").html(html);
         //$("#printexport").html(html);
    });
    //For Common Export to Excel/PDF 
    $(document).on("click", "#CommonExportExcel", function () {
        var ExportType = $("#Exporttype").val();
        var PageIndex = $("#id_exportreportdrop").val();
        if (PageIndex == "") {
            alert("Please select the page no.");
            return false;
        }
        var pagenum = PageIndex;
        var chkArray3 = [];
        var selected = $("#od input[type='checkbox']:checked");

        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var esearchdata = $('#casefiltercasename').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterclient = $('#casefilterclient').val();
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseusermatter').val();
        var createdby = $('#casefilterCreatedBy').val();
        var esearchdatanotes = $('#casefilternotes').val();
        var ecasefiltercompanyname = $('#companynamefilter').val();
        var ecasefiltermattertype = $('#MatterTypefilter').val();
        var ecasefiltersubjecttype = $("#SubjectTypefilter").val();
        var ecasefiltercourtname = $("#casefiltercourtname").val();
        var ecasefilterdateto = $('#casefilterdateTo').val();
        var ecasefFilingdate = $('#caseFilingdate').val();
        var ecasefFilingdateto = $('#caseFilingdateTo').val();
        var serhdisposeoptions = $('#casefilterdisposeoption').val();
        var casefilterCaseDetails1 = $('#casefilterCaseDetails').val();
        var casefiltermtrno1 = $('#casefiltermtrno').val();
        var casefilterInternalno1 = $('#casefilterInternalno').val();
        var casefiltercnrno1 = $('#casefiltercnrno').val();
        var IsCaseArchived = "1";
        //Next Hearing range filter
        var NextHearingfromd = $("#Nexthearingfrmdate").val();
        var NextHearingtod = $("#NexthearingdateTo").val();
        var casedetailsfilter = "";
        var Court_Status = $("#courtstatusfilter").val();
        //Added New Filte 
        //var hearingsortfilter = nhdSortVal;
        var petionerfilter = "";
        var respondentrfilter = "";
        var pagesizedata = 0;
        if (roleids == 1) {
            pagesizedata = 500;
        } else {
            pagesizedata = 200;
        }
        if (ExportType == "Excel") {
            //Start Excel ExportCode
            

            var urls = "/" + fcode + "/Firm/ExportoExcelNewCases";
            url_redirect({
                url: urls,
                method: "post",
                data: {
                    "pagenum": pagenum, "pagesize": pagesizedata,
                    "esearchdata": esearchdata, "ecasefilterdate": ecasefilterdate,
                    "ecasefiltercourt": ecasefiltercourt, "ecasefilterclient": ecasefilterclient,
                    "ecasefilterstatus": ecasefilterstatus, "eusers": eusers,
                    "createdby": createdby, "exportcolumn": selected3, "esearchdatanotes": esearchdatanotes,
                    "CFieldtype": type, "ecasefiltercompanyname": ecasefiltercompanyname,
                    "ecasefiltermattertype": ecasefiltermattertype, "ecasefiltersubjecttype": ecasefiltersubjecttype,
                    "ecasefiltercourtname": ecasefiltercourtname, "ecasefilterdateto": ecasefilterdateto,
                    "ecasefFilingdate": ecasefFilingdate, "ecasefFilingdateto": ecasefFilingdateto, "IsCaseArchived": IsCaseArchived,
                    "searchcustomcolname": fieldnamecust, "searchcustomcolvalue": fieldvaluecust,
                    "searchdisposeoption": serhdisposeoptions, "casefilterCaseDetails": casefilterCaseDetails1,
                    "casefiltermtrno": casefiltermtrno1, "casefilterInternalno": casefilterInternalno1,
                    "casefiltercnrno": casefiltercnrno1
                }
            });
        } else if (ExportType == "PDF") {

           
            var urls = "/" + fcode + "/Firm/ExportoPDFNewCases";
            url_redirect({
                url: urls,
                method: "post",
                data: {
                    "pagenum": EncodeText(pagenum), "pagesize": EncodeText(pagesizedata),
                    "esearchdata": EncodeText(esearchdata), "ecasefilterdate": EncodeText(ecasefilterdate),
                    "ecasefiltercourt": EncodeText(ecasefiltercourt), "ecasefilterclient": EncodeText(ecasefilterclient),
                    "ecasefilterstatus": EncodeText(ecasefilterstatus), "eusers": EncodeText(eusers),
                    "createdby": EncodeText(createdby), "esearchdatanotes": EncodeText(esearchdatanotes),
                    "ecasefiltercompanyname": EncodeText(ecasefiltercompanyname),
                    "searchcustomcolname": EncodeText(fieldnamecust), "searchcustomcolvalue": EncodeText(fieldvaluecust),
                    "ecasefiltermattertype": EncodeText(ecasefiltermattertype), "ecasefiltersubjecttype": EncodeText(ecasefiltersubjecttype),
                    "ecasefiltercourtname": EncodeText(ecasefiltercourtname), "ecasefilterdateto": EncodeText(ecasefilterdateto),
                    "ecasefFilingdate": EncodeText(ecasefFilingdate), "ecasefFilingdateto": EncodeText(ecasefFilingdateto),
                    "IsCaseArchived": IsCaseArchived,
                    "searchdisposeoption": EncodeText(serhdisposeoptions), "casefilterCaseDetails": EncodeText(casefilterCaseDetails1),
                    "casefiltermtrno": EncodeText(casefiltermtrno1), "casefilterInternalno": EncodeText(casefilterInternalno1),
                    "casefiltercnrno": EncodeText(casefiltercnrno1), "NextHearingfromd": EncodeText(NextHearingfromd),
                    "NextHearingtod": EncodeText(NextHearingtod), "casedetailsfilter": EncodeText(casedetailsfilter),
                    "Court_Status": EncodeText(Court_Status),
                    "petionerfilter": EncodeText(petionerfilter), "respondentrfilter": EncodeText(respondentrfilter)
                }
            });
        }


    });
    /*Export file in excel*/
    //$(document).on("click", "#exporttoexcelfile", function () {
    //    var chkArray3 = [];
    //    var selected = $("#od input[type='checkbox']:checked");
    //    selected.each(function () {
    //        chkArray3.push($(this).val());
    //    });
    //    var selected3;
    //    selected3 = chkArray3.join(',');
    //    if (selected3.length > 0) {
    //    }
    //    var esearchdata = $('#casefiltercasename').val();
    //    var ecasefilterdate = $('#casefilterdate').val();
    //    var ecasefilterclient = $('#casefilterclient').val();
    //    var ecasefiltercourt = $('#casefiltercourt').val();
    //    var ecasefilterstatus = $('#casefilterstatus').val();
    //    var eusers = $('#filtercaseusermatter').val();
    //    var createdby = $('#casefilterCreatedBy').val();
    //    var esearchdatanotes = $('#casefilternotes').val();
    //    var ecasefiltercompanyname = $('#companynamefilter').val();
    //    var ecasefiltermattertype = $('#MatterTypefilter').val();
    //    var ecasefiltersubjecttype = $("#SubjectTypefilter").val();
    //    var ecasefiltercourtname = $("#casefiltercourtname").val();
    //    var ecasefilterdateto = $('#casefilterdateTo').val();
    //    var ecasefFilingdate = $('#caseFilingdate').val();
    //    var ecasefFilingdateto = $('#caseFilingdateTo').val();
    //    var serhdisposeoptions = $('#casefilterdisposeoption').val();
    //    var casefilterCaseDetails1 = $('#casefilterCaseDetails').val();
    //    var casefiltermtrno1 = $('#casefiltermtrno').val();
    //    var casefilterInternalno1 = $('#casefilterInternalno').val();
    //    var casefiltercnrno1 = $('#casefiltercnrno').val();
    //    var IsCaseArchived = "1";
    //    var pagenum = $(this).attr("pageno");
    //    var pagesizedata = 500;
    //    var urls = "/" + fcode + "/Firm/ExportoExcelNewCases";
    //    url_redirect({
    //        url: urls,
    //        method: "post",
    //        data: {
    //            "pagenum": pagenum, "pagesize": pagesizedata,
    //            "esearchdata": esearchdata, "ecasefilterdate": ecasefilterdate,
    //            "ecasefiltercourt": ecasefiltercourt, "ecasefilterclient": ecasefilterclient,
    //            "ecasefilterstatus": ecasefilterstatus, "eusers": eusers,
    //            "createdby": createdby, "exportcolumn": selected3, "esearchdatanotes": esearchdatanotes,
    //            "CFieldtype": type, "ecasefiltercompanyname": ecasefiltercompanyname,
    //            "ecasefiltermattertype": ecasefiltermattertype, "ecasefiltersubjecttype": ecasefiltersubjecttype,
    //            "ecasefiltercourtname": ecasefiltercourtname, "ecasefilterdateto": ecasefilterdateto,
    //            "ecasefFilingdate": ecasefFilingdate, "ecasefFilingdateto": ecasefFilingdateto, "IsCaseArchived": IsCaseArchived,
    //            "searchcustomcolname": fieldnamecust, "searchcustomcolvalue": fieldvaluecust,
    //            "searchdisposeoption": serhdisposeoptions, "casefilterCaseDetails": casefilterCaseDetails1,
    //            "casefiltermtrno": casefiltermtrno1, "casefilterInternalno": casefilterInternalno1,
    //            "casefiltercnrno": casefiltercnrno1
    //        }
    //    });

    //})
    /*Export custom field history in excel*/
    $("#ExporttoExcelCFHistory").click(function () {
        var chkArray3 = [];
        var selected = $("#cfod input[type='checkbox']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var vdate = $('#cfversion').val();
        if (vdate == "") {
            alert("Please select custom field version.");
            return false;
        }
        window.location = "/firm/ExportoExcelCustomFieldMatter?status=true&vdate=" + vdate + "&type=" + type + "&exportcolumn=" + selected3;
    })
    /*Export custom field history in pdf*/
    //$(document).on("click", "#exporttopdffile", function () {
    //    var esearchdata = $('#casefiltercasename').val();
    //    var ecasefilterdate = $('#casefilterdate').val();
    //    var ecasefilterdate = $('#casefilterdate').val();
    //    var ecasefilterclient = $('#casefilterclient').val();
    //    var ecasefiltercourt = $('#casefiltercourt').val();
    //    var ecasefilterstatus = $('#casefilterstatus').val();
    //    var eusers = $('#filtercaseusermatter').val();
    //    var createdby = $('#casefilterCreatedBy').val();
    //    var esearchdatanotes = $('#casefilternotes').val();
    //    var ecasefiltercompanyname = $('#companynamefilter').val();
    //    var ecasefiltermattertype = $('#MatterTypefilter').val();
    //    var ecasefiltersubjecttype = $("#SubjectTypefilter").val();
    //    var ecasefiltercourtname = $("#casefiltercourtname").val();
    //    var ecasefilterdateto = $('#casefilterdateTo').val();
    //    var ecasefFilingdate = $('#caseFilingdate').val();
    //    var ecasefFilingdateto = $('#caseFilingdateTo').val();
    //    var serhdisposeoptions = $('#casefilterdisposeoption').val();
    //    var casefilterCaseDetails1 = $('#casefilterCaseDetails').val();
    //    var casefiltermtrno1 = $('#casefiltermtrno').val();
    //    var casefilterInternalno1 = $('#casefilterInternalno').val();
    //    var casefiltercnrno1 = $('#casefiltercnrno').val();
    //    var IsCaseArchived = "1";
    //    var pagenum = $(this).attr("pageno");
    //    var pagesizedata = 500;
    //    window.location = encodeURI("/firm/ExportoPDFNewCases?pagenum=" + pagenum + "&pagesize=" + pagesizedata + "&esearchdata=" + esearchdata +
    //        "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient +
    //        "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby + "&esearchdatanotes=" + esearchdatanotes +
    //        "&ecasefiltercompanyname=" + ecasefiltercompanyname + "&ecasefiltermattertype=" + ecasefiltermattertype +
    //        "&ecasefiltersubjecttype=" + ecasefiltersubjecttype + "&ecasefiltercourtname=" + ecasefiltercourtname + "&ecasefilterdateto=" + ecasefilterdateto +
    //        "&ecasefFilingdate=" + ecasefFilingdate +
    //        "&ecasefFilingdateto=" + ecasefFilingdateto + "&IsCaseArchived=" + IsCaseArchived + "&searchcustomcolname=" + fieldnamecust +
    //        "&searchcustomcolvalue=" + fieldvaluecust + "&searchdisposeoption=" + serhdisposeoptions,
    //        "&casefilterCaseDetails=" + casefilterCaseDetails1 + "&casefiltermtrno=" + casefiltermtrno1,
    //        "&casefilterInternalno=" + casefilterInternalno1 + "&casefiltercnrno=" + casefiltercnrno1
    //    );
    //})
    $(document).on("click", "#transferpagecase", function () {
        var transferid = $(this).attr("sno");
        var IsRevenueCourt = $(this).attr("IsRevenueCourt");
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "IsRevenueCourt": IsRevenueCourt }
        });
    });
    var loadflag = true;
    $(document).on("click", "#unlinkcase", function () {
        var result = confirm("Are you sure to remove matter live update?");
        if (result) {
            openload();
            var formdata = new FormData();
            var token = $(this).attr("data-id");
            formdata.append("caseid", token);
            openload();
            $.ajax({
                async: true,
                url: '/api/matterApi/UnLinkCaseToCaseWatch',
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
                        loadcontactlist(pageindex, "", "");
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
    /*Get single archive matter list*/
    $(document).on("click", "#ArchiveMatterSingle", function () {
        var caseids = $(this).attr("id-val");
        var MatterNames = $(this).attr("Idmnae");
        $("#id_Archivematternames").text(MatterNames);
        $("#myModalmarkArchiveconfirmation").modal();
        $("#archivesingle_final").attr("id-val", caseids);

    });
    /*Get single archive matter list*/
    $(document).on("click", "#archivesingle_final", function () {
        selectedID = [];
        var caseids = $(this).attr("id-val");
        deletemattersingle();
        function deletemattersingle() {
            //var result = confirm("Are you sure you want unarchive the matter?");
            //if (result) {
                selectedID.push(caseids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/matterApi/ArchiveCase',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                $("#myModalmarkArchiveconfirmation").modal("hide");
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Matter unarchived successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                loadflag = true;
                                loadcontactlist(pageindex, "", "");
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized to unarchive this Matter !',
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
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to archive.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
           // }
        }
    });
    //start Cfield history
    var cfloadflag = true;
    var cfpageindex = 1, cfpagesize = 10, cfrecordcount = 0, cftotrecord = 0;
    function bindCFHistoryversion() {
        $("#cfversion").empty();
        var html1 = '<option value="">Select</option>';
        var formData = new FormData();
        formData.append("ModuleType", type);
        var it = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomFieledVersion",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                if (obj != "") {
                    var array = String(obj).split(",");
                    $.each(array, function (i) {
                        it = it + 1;
                        html1 += '<option value="' + array[i] + '" >Version-' + it + '(' + formatDatetoIST(array[i]) + ')</option>';
                    });
                }
                $("#cfversion").html(html1);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#cfHistory").click(function () {
        $('#myModalcfHistory').modal({ show: true });
        bindCFHistoryversion();
    });
    $("#CFHistoryData").click(function () {
        $("#CFHistoryData").attr("disabled", true);
        var vdate = $("#cfversion").val();
        if (vdate == "") {
            alert("Please select Version of Custom Fields");
            $("#cfversion").focus();
            return false;
        }
        cfhistorydata();
    });
    $(document).on('click', '#cfpgetdatabypagenum', function () {
        ppageindex = $("#cfppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#cfpsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadflag = true;
                    loadCfieldList(ppageindex);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#cfppaginate', function () {
        ppageindex = $(this).attr("index");
        loadflag = true;
        loadCfieldList(ppageindex);
    });
    var countcustomfieldCF = 0;
    var defaultcolumncount = 5;
    /*Get custom field history data*/
    function cfhistorydata() {
        $('#cfheadrow').empty();
        $("#cfod").empty();
        var q1 = 2;
        var columnvalue = 0;
        var sort = 0;
        var vdate = $("#cfversion").val();
        var formData = new FormData();
        formData.append("VersionDate", vdate);
        formData.append("ModuleType", type);
        var rt1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomFieledHeader",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfieldCF = obj.length;
                    var $header = "";
                    var option = "";
                    var checkvalue = "checked";
                    var headerhsvalue = "display:table-cell";
                    $header += '<th class="cfmattername"><div class="thbg"> Matter Name</div> </th>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="MatterName"  name="cfmattername" ><a href="#" class="small" data-value="option " tabIndex="-1">Matter Name</a></li>';
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        columnvalue = columnvalue + 1;
                        sort = sort + 1;
                        if (columnvalue > defaultcolumncount) {
                            checkvalue = "";
                            headerhsvalue = "display:none";
                        }
                        $header += '<th  style="' + headerhsvalue + '" class="cfClass' + q1 + '"><div class="thbg">' + val.column_name + '</div></th>';
                        option += '<li><input  ' + checkvalue + ' class="chkdhide"  type="checkbox" value="' + val.column_name + '"  name="cfClass' + q1 + '" ><a href="#" class="small" data-value="option' + val.column_name + '" tabIndex="-1">' + val.column_name + '</a></li>';
                    });
                    $('#cfheadrow').append($header);
                    $("#cfod").append(option);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            loadCfieldList(cfpageindex);
        });
    }
    /*Load Custom Fieled Histroy*/
    function loadCfieldList(cfpageindex) {
        $("#cfbindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        var vdate = $("#cfversion").val();
        formdata.append("pagenum", cfpageindex);
        formdata.append("pagesize", cfpagesize);
        formdata.append("VersionDate", vdate);
        formdata.append("ModuleType", type);
        var ajaxTime = new Date().getTime();
        openload();
        var ld122 = $.ajax({
            async: true,
            url: '/api/CallApi/LoadCustomFieledHistroy',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                $("#cfcasetfooter").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        alert("No Result found");
                        $("#footerhead,#ExporttoExcelCFHistory").hide();
                        return false;
                    }
                    else {
                        $("#footerhead,#ExporttoExcelCFHistory").show();
                    }
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                }
                if (response.Data.length > 2) {
                    //$("#cfpdatastatus").html("");
                }
                else {
                    //$("#cfpdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                var headerhsvaluechild = "display:table-cell";
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (val.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#cfpagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + val.totRow + '</span>  <span id="cfpsotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="cfppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="cfpgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="cfppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="cfppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="cfppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#cfcasetfooter").append(tfot);
                    }
                    qty = qty + 1;
                    it = it + 1;
                    var $row = $('<tr>');
                    $row.append($('<td class="cfmattername" />').html("<span>" + val.MatterName));
                    var countcf = countcustomfieldCF;
                    for (var str = 1; str <= countcf; str++) {
                        if (str > defaultcolumncount) {
                            headerhsvaluechild = "display:none";
                        }
                        else {
                            headerhsvaluechild = "display:table-cell";
                        }
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="cfclass3" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="cfclass3"  style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass3"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"   />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="cfclass5" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="cfclass5" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass5"  style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="cfclass6" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="cfclass6" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass6"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="cfclass7" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="cfclass7" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass7"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="cfclass9" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="cfclass9" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass9"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="cfclass10" style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="cfclass10" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass10"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="cfclass11" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="cfclass11" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass11"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="cfclass12" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="cfclass12"  style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass12" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="cfclass13" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="cfclass13" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass13"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="cfclass14" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="cfclass14" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass14"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="cfclass16"  style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="cfclass16" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass16" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    $("#cfbindcasedata").append($row);
                });
                $("#cfhistorydata").removeAttr("disabled");
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld122).then(function (data, textStatus, jqXHR) {
            $("#CFHistoryData").removeAttr("disabled");
            closeload();
            return false;
        });
    }
    function removeHtmlTags(input) {
        return input.replace(/<[^>]*>/g, '').trim();
    }
    //end CField history
    $(document).on("click", "#deletecasesingle", function () {
        var caseids = $(this).attr("id-val");
        var isdelete = $(this).attr("is-delete");
        var deletmtrno = $(this).attr("Idss");
        var deletmtrno = $(this).attr("Idss");
        //deletmtrno = removeHtmlTags(deletmtrno);

        var MatterNames = $(this).attr("Idmnae");
        var mtnrName = removeHtmlTags(MatterNames);
        $("#id_deleteno").text('');
        $("#id_deleteno").text(mtnrName + '?');

        $("#deletecasesinglefinal").attr("id-val", caseids).attr("is-delete", isdelete).attr("Idmnae", MatterNames);
        if (isdelete == "1") {
            $("#deletecasesinglefinal").click();
        }
        else {
            $("#myModalmarkdelete").modal();
        }
    });
    //For delete preview confrimation 
    $(document).on("click", "#deletecasesinglefinal", function () {
        var caseids = $(this).attr("id-val");
        var isdelete = $(this).attr("is-delete");
        var MatterNames = $(this).attr("Idmnae");
        // var remarkmark = $("#markremark").val();
        $("#ids_deletematterrequesr").text('');
        $("#id_matternames").text('');
        $("#id_matternames").text(MatterNames);
        $("#ids_deletematterrequesr").html("<strong>Delete Matter Request</strong>");
        $("#deletecasesingle_final").attr("id-val", caseids).attr("is-delete", isdelete);
        $("#myModalmarkdelete").modal("hide");
        $("#myModalmarkdeleteconfirmation").modal();
    })


    $(document).on("click", "#deletecasesingle_final", function () {
        selectedID = [];
        var caseids = $(this).attr("id-val");
        var isdelete = $(this).attr("is-delete");
        var remarkmark = $("#markremark").val();
        if (isdelete != "1") {
            if (remarkmark == "") {
                alert("Please enter remark.");
                $("#markremark").focus();
                return false;
            }
        }
        if (isdelete == 1) {
            deletemattersingle();
            function deletemattersingle() {
                //var result = confirm("Are you sure you want to unmark the matter from deletion list?");
                //if (result) {
                selectedID.push(caseids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    var formData = new FormData();
                    formData.append("typeIds", selectedID);
                    formData.append("remark", EncodeText(remarkmark));
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: '/api/matterApi/RemoveCase',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Matter unmarked from deletion list successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#markremark").val("");
                                $('#select_all').prop('checked', false);
                                loadflag = true;
                                loadcontactlist(pageindex, "", "");
                                //  $("#myModalmarkdelete").modal("hide");
                                $("#myModalmarkdeleteconfirmation").modal("hide");
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
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                // }
            }
        }
        else {
            deletemattersingle();
            function deletemattersingle() {
                //var result = confirm("Are you sure you want to mark the matter for deletion?");
                //if (result) {
                selectedID.push(caseids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    var formData = new FormData();
                    formData.append("typeIds", selectedID);
                    formData.append("remark", EncodeText(remarkmark));
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: '/api/matterApi/RemoveCase',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Matter marked for deletion successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                // $("#myModalmarkdelete").modal("hide");
                                $("#myModalmarkdeleteconfirmation").modal("hide");
                                $('#select_all').prop('checked', false);
                                loadflag = true;
                                loadcontactlist(pageindex, "", "");
                                $("#markremark").val("");
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
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                // }
            }
        }
    });
    /*Delete cases*/
    $("#deletecase").click(function () {
        selectedID = [];
        deletematter();
        function deletematter() {
            var result = confirm("Are you sure to delete Matter?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/matterApi/RemoveCase',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Matter Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                loadflag = true;
                                loadcontactlist(pageindex, "", "");
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
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' Please select a row to delete.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    /*Save Sync Row Data*/
    $("#syncrqstothers").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#bindcasedata input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", "case");
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            loadflag = true;
                            loadcontactlist(pageindex, "", "");
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You have not selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });
    //openload();
    //For Common Custom Filter
    $(document).on("click", "#idcustomcommonFilter", function () {

        $("#commonforreset")[0].reset();
        $('#myModalCustomCommonFilter').modal({ show: true });

    });
    //For Common Serach Filter
    $(document).on("click", "#SearchCommondetails", function () {
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    //For Search Clear
    $(document).on("click", "#CancelCommonDashb", function () {
        $("#commonforreset")[0].reset();
        $('#myModalCustomCommonFilter').modal('hide');
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    setInterval(function () {
        var tempcases = localStorage.getItem("shortcase");
        if (tempcases != "") {
            loadflag = true;
            loadcontactlist(1, "", "");
            localStorage.setItem("shortcase", "");
        }
    }, 3000);
    $("#filtercaseusermatter").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    $("#casecleardate").click(function () {
        $("#casefilterdate").val("");
        $("#casefilterdateTo").val("");
        $("#casecleardate").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
    })
    $("#searchdatasdate").click(function () {
        var fromd = $("#casefilterdate").val();
        var tod = $("#casefilterdateTo").val();
        if (fromd == "") {
            alert("Please select filter from date");
            $("#casefilterdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to date");
            $("#casefilterdateTo").focus();
            return false;
        }
        loadflag = true;
        loadcontactlist(1, "", "");
        $("#casecleardate").css("display", "block");
    });
    $("#caseFilingcleardate").click(function () {
        $("#caseFilingdate").val("");
        $("#caseFilingdateTo").val("");
        $("#caseFilingcleardate").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
    })
    $("#searchdatasFilingdate").click(function () {
        var fromd = $("#caseFilingdate").val();
        var tod = $("#caseFilingdateTo").val();
        if (fromd == "") {
            alert("Please select filter from Filing date");
            $("#caseFilingdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to Filing date");
            $("#caseFilingdateTo").focus();
            return false;
        }
        loadflag = true;
        loadcontactlist(1, "", "");
        $("#caseFilingcleardate").css("display", "block");
    });
    $("#casefilterclient").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    $("#casefiltercourt").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    $("#casefilterstatus").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    $("#casefilterCreatedBy").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    var chksflag = true;
    $("#clearnewsearchcourtname").click(function () {
        $("#casefiltercourtname").val("");
        $("#clearnewsearchcourtname").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchcase").click(function () {
        $("#casefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchnotes").click(function () {
        $("#casefilternotes").val("");
        $("#clearnewsearchnotes").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#searchdatasnotes").click(function () {
        var casefilternotes = $("#casefilternotes").val();
        if (casefilternotes == "") {
            alert("Please enter the notes.");
            $("#casefilternotes").focus();
            return false;
        }
        $("#clearnewsearchnotes").css("display", "unset")
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $(document).on('keyup', '#casefilternotes', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                loadcontactlist(1, "", "");
                chksflag = false;
            }
        }
    });
    $("#searchdatascourtname").click(function () {
        isRenderPage = false;
        var casefiltercourtname = $("#casefiltercourtname").val();
        if (casefiltercourtname == "") {
            alert("Please enter the Court name.");
            $("#casefiltercourtname").focus();
            return false;
        }
        $("#clearnewsearchcourtname").css("display", "unset")
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $(document).on('keyup', '#casefiltercourtname', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                isRenderPage = false;
                loadcontactlist(1, "", "");
                chksflag = false;
            }
        }
    });
    $("#searchdatas").click(function () {
        var casefiltercasename = $("#casefiltercasename").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#casefiltercasename").focus();
            return false;
        }
        $("#clearnewsearchcase").css("display", "unset")
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    /*Get case filter case name on key up*/
    $(document).on('keyup', '#casefiltercasename', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                isRenderPage = false;
                loadcontactlist(1, "", "");
                chksflag = false;
            }
        }
    });
    $("#clearnewsearchcompany").click(function () {
        $("#companynamefilter").val("");
        $("#clearnewsearchcompany").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchmattertype").click(function () {
        $("#MatterTypefilter").val("");
        $("#clearnewsearchmattertype").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchsubjecttype").click(function () {
        $("#SubjectTypefilter").val("");
        $("#clearnewsearchsubjecttype").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    //Add company filterPlease enter matter type
    $("#searchcompany").click(function () {
        var casefiltercasename = $("#companynamefilter").val();
        if (casefiltercasename == "") {
            alert("Please enter the company name.");
            $("#companynamefilter").focus();
            return false;
        }
        $("#clearnewsearchcompany").css("display", "unset");
        /* your code here */
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    //Add MatterTypefilter
    $("#MatterTypefilter").change(function () {
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    //Add SubjectTypefilter
    $("#SubjectTypefilter").change(function () {
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#casefilterdisposeoption").change(function () {
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    //Add New Filter for matter List start
    $("#searchdatasCaseDetails").click(function () {
        var casefilterCaseDetails = $("#casefilterCaseDetails").val();
        if (casefilterCaseDetails == "") {
            alert("Please enter the Case Details.");
            $("#casefilterCaseDetails").focus();
            return false;
        }
        $("#clearnewsearchCaseDetails").css("display", "unset")
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchCaseDetails").click(function () {
        $("#casefilterCaseDetails").val("");
        $("#clearnewsearchCaseDetails").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#searchdatasmtrno").click(function () {
        var casefiltermtrno = $("#casefiltermtrno").val();
        if (casefiltermtrno == "") {
            alert("Please enter the Matter Number-External Reference.");
            $("#casefiltermtrno").focus();
            return false;
        }
        $("#clearnewsearchmtrno").css("display", "unset")
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchmtrno").click(function () {
        $("#casefiltermtrno").val("");
        $("#clearnewsearchmtrno").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#searchdatasInternalno").click(function () {
        var casefilterInternalno = $("#casefilterInternalno").val();
        if (casefilterInternalno == "") {
            alert("Please enter the Matter Number Internal.");
            $("#casefilterInternalno").focus();
            return false;
        }
        $("#clearnewsearchInternalno").css("display", "unset")
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchInternalno").click(function () {
        $("#casefilterInternalno").val("");
        $("#clearnewsearchInternalno").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#searchdatascnrno").click(function () {
        var casefilterInternalno = $("#casefiltercnrno").val();
        if (casefilterInternalno == "") {
            alert("Please enter the Matter Number Internal.");
            $("#casefiltercnrno").focus();
            return false;
        }
        $("#clearnewsearchcnrno").css("display", "unset")
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchcnrno").click(function () {
        $("#casefiltercnrno").val("");
        $("#clearnewsearchcnrno").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    //End Section
    $(document).on('keyup', '#companynamefilter', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
            // loadcontactlist(1);
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                isRenderPage = false;
                loadcontactlist(1, "", "");
                chksflag = false;
            }
        }
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var Nexthearingary = localStorage.getItem("Nexthearingary");
    var NexthearingaryRevenue = localStorage.getItem("NexthearingaryRevenue");
    $(document).on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadflag = true;
                    loadcontactlist(ppageindex, "", "");
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    var chksflag = true;
    $(document).on('click', '#ppaginate', function () {
        ppageindex = $(this).attr("index");
        loadflag = true;
        loadcontactlist(ppageindex, "", "");
    });
    //LoadColumnMaster();
    ploadtabledata();
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var countcustomfoeld = 0;
    /*Load custom field data for archive*/
    function ploadtabledata() {
        var Iscustomflag = 0;
        var $table = '';
        var $header = '';
        var $head1 = '';
        var dt = '';
        var q1 = 2;
        var columnvalue = 0;
        var sort = 18;
        openload();
        var rt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployees1',
            headers: {
                // 'fid': type
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    var $header = "";
                    var option = "";
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        columnvalue = columnvalue + 1;
                        Iscustomflag = Iscustomflag + 1;
                        sort = sort + 1;
                        $header += '<th  class="Class' + q1 + '"><div class="thbg"><div style="float:left;width:80%"><input class="" id=customfieldsfilter' + q1 + ' type="text" placeholder="' + val.FieldName + '"  name="Class' + q1 + '" ></div><div style="float:left;width:20%"><span class="glyphicon glyphicon-search" idname="col' + Iscustomflag + '"  seq=' + q1 + ' idvals="' + val.FieldName + '" id="searchcustomfilters" style="margin:5px 0 0 -14px;float:right"></span><span idsss1=' + q1 + ' id="clearcustomfilters" class="clscustomfilters' + q1 + '" style="display:none;font-size:15px;color:black:font-weight:350;cursor:pointer;">x</span></div></div></th>';
                        option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                    });
                    $header += '<th class="actioncase"><div class="thbg"><p style="width:130px;">Actions</p></div></th>';
                    $('#headrow').append($header);
                    $("#od").append(option);
                    SortData();
                    //var option1 = '<li><input id="select_allcfield"   type="checkbox"   >Select All</a></li>';
                    //$("#od").append(option1);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            if (urltype == "status" || urltype == "type" || urltype == "subject") {
                // setTimeout(function () {
                loadcontactlist(pageindex, "", "");
                // },5000);
            }
            else {
                loadcontactlist(pageindex, "", "");
            }
        });
    }

    function Custommore(valcol1, qty) {
        var htmlNew = "";
        if (valcol1 != null) {
            if (valcol1.length > 60) {
                htmlNew += '<span class="comment more" style="">' + valcol1.substring(0, 60) + '</span>'
                htmlNew += '<span data-toggle="collapse" data-target="#dtn2' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                htmlNew += ' <div id="dtn2' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                htmlNew += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn2' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                htmlNew += '' + valcol1 + ''
                htmlNew += '</div>'
            }
            else {
                htmlNew += valcol1;
            }
        }
        return htmlNew;
    }
    /*Load contact list*/
    var totalRecordCount = 1;
    function loadcontactlist(pageindex, searchcolnaame, searchcolvalue) {
        $("#bindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        var casefilterstatus = $('#casefilterstatus').val();
        var MatterTypefilter = $('#MatterTypefilter').val();
        var SubjectTypefilter = $('#SubjectTypefilter').val();
        var casefilterCreatedBy = $('#casefilterCreatedBy').val();
        var casefilterdisposeoption1 = $('#casefilterdisposeoption').val();
        if (urltype == "status") {
            casefilterstatus = atob(urltypevalue);
        }
        else if (urltype == "type") {
            MatterTypefilter = atob(urltypevalue);
        }
        else if (urltype == "subject") {
            SubjectTypefilter = atob(urltypevalue);
        }
        if (IsPersonaltoken == "1") {
            casefilterCreatedBy = userid;
        }
        if (casefilterstatus == null) {
            casefilterstatus = "";
        }
        if (MatterTypefilter == null) {
            MatterTypefilter = "";
        }
        if (SubjectTypefilter == null) {
            SubjectTypefilter = "";
        }
        if (casefilterCreatedBy == null) {
            casefilterCreatedBy = "";
        }
        if (casefilterdisposeoption1 == null) {
            casefilterdisposeoption1 = "";
        }
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        formdata.append("odate", $('#casefilterdate').val());
        formdata.append("casename", $('#casefiltercasename').val());
        formdata.append("clientname", $('#casefilterclient').val());
        formdata.append("court", $('#casefiltercourt').val());
        formdata.append("cstatus", casefilterstatus);
        formdata.append("users", $('#filtercaseusermatter').val());
        formdata.append("createdby", casefilterCreatedBy);
        formdata.append("companyfilter", $('#companynamefilter').val());
        formdata.append("mattertypefilter", MatterTypefilter);
        formdata.append("subjecttypefilter", SubjectTypefilter);
        formdata.append("casefilternotes", $('#casefilternotes').val());
        formdata.append("casefiltercourtname", $('#casefiltercourtname').val());
        formdata.append("odateto", $('#casefilterdateTo').val());
        formdata.append("fillingdate", $('#caseFilingdate').val());
        formdata.append("fillingdateto", $('#caseFilingdateTo').val());
        formdata.append("IsCaseArchived", "1");
        //Add for custom filter search
        formdata.append("searchcustomcolname", searchcolnaame);
        formdata.append("searchcustomcolvalue", searchcolvalue);
        formdata.append("casedisposefilter", casefilterdisposeoption1);
        formdata.append("casefilterCaseDetails", $('#casefilterCaseDetails').val());
        formdata.append("casefiltermtrno", $('#casefiltermtrno').val());
        formdata.append("casefilterInternalno", $('#casefilterInternalno').val());
        formdata.append("casefiltercnrno", $('#casefiltercnrno').val());
        var ajaxTime = new Date().getTime();
        openload();
        var caseListApiUrl = '/api/MatterApi/LoadNewCaseList';
        if (typeof isRBICustomization !== 'undefined' && isRBICustomization === "RBICustomtype"
            && (currentUserRoleId === "2" || currentUserRoleId === "3")) {
            caseListApiUrl = '/api/MatterApi/LoadNewCaseList_RBIAll';
        }
        var ld12 = $.ajax({
            async: true,
            url: caseListApiUrl,
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#exportrecords").val(0);
                var totalTime = new Date().getTime() - ajaxTime;
              //  console.log("loadcontact:" + totalTime)
                $("#casetfooter").html("");
                $("#tokens").html("");
                $("#ArchcaseCount").text('');
               /* $("#DeltcaseCount").text('');*/
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#pdatastatus").hide();
                    $('#mtrPagination').show();
                }
                else {
                    /*$("#pdatastatus").html("No result found");*/
                    $("#pdatastatus").show();
                    $('#mtrPagination').hide();
                    closeload();
                }
                if (length <= 0) {
                    /*$("#bindcasedata").html('<tr class="no-records"><td colspan="33" style="text-align:center;background:white;font-weight: 600 !important">No record found.</td></tr>')*/
                    $("#pdatastatus").show();
                    $('#mtrPagination').hide();
                    return false;
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                if (loadflag == true) {
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = val.totRow;
                        //    var totpage = 0;
                        //    if (val.totRow > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").attr("max", totpage);
                        //    }
                        //    var tfot = '';
                        //    $("#exportrecords").val(val.totRow);
                         //   $("#ArchcaseCount").text("(" + val.totRow + ")");
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    if (val.totRow <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#casetfooter").append(tfot);
                        //}
                        $("#exportrecords").val(val.totRow);
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#ArchcaseCount").text("(" + val.totRow + ")");
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
                        }

                        $("#pgetdatabypagenum").attr("pageindex", pageindex);
                        qty = qty + 1;
                        $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                        it = it + 1;
                        if (val.UserCaseid != null) {
                            btnclass = " details";
                            usercaseid = "";
                            fileiconcase = "glyphicon glyphicon-book";
                        }
                        else {
                            btnclass = "";
                            usercaseid = "";
                            fileiconcase = "";
                        }
                        if (val.IsDelete == "1") {
                            deleterqst = "trcolor";
                        }
                        else {
                            deleterqst = "";
                        }
                        if (String(val.IsSync) == "1") {
                            dsyncicon = "glyphicon glyphicon-retweet";
                            dsynctitle = "Marked for data synchronization";
                        }
                        else {
                            dsyncicon = "";
                            dsynctitle = "";
                        }
                        var $row = $('<tr class="' + deleterqst + '">');
                        var closedate = val.cdate;
                        if (closedate == "1900-01-01T00:00:00") {
                            closedate = null;
                        }
                        $row.append($('<td class="casestartdate"  />').html("<span name='" + val.odate + "'> " + (val.odate != null ? formatDatetoIST(val.odate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                        //$row.append($('<td class="casecasename" />').html("<a name=" + val.mname + "  title='View Matter Dashboard' id='transferpage' href='javascript:void()' sno=" + val.Id + "><span style='font-size:12px;'>" + (val.mname != null ? val.mname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        $row.append(
                            $('<td class="casecasename" style="height: 72px;" />').html(
                                "<a name='" + val.mname + "' title='View Matter Dashboard' id='transferpage' href='javascript:void(0)' sno='" + val.Id + "'>" +
                                "<span class='freeze-text' style='font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'>" +
                                (val.mname != null ? val.mname : '<span style=\"visibility: hidden;\">&nbsp;</span>') +
                                "<i class='" + dsyncicon + " pull-right' title='" + dsynctitle + "'></i>" +
                                "</span>" +
                                "</a>"
                            )
                        );
                        var ClientName = "";
                        if (val.ClientName == "null") {
                            ClientName = "";
                        }
                        else {
                            ClientName = val.ClientName;
                        }
                        var limitationcss = "";
                        if (dashlimit == "display:none") {
                            limitationcss = "display:none";
                        }
                        if (val.IsCompanyAdmin == "1") {
                            $row.append($('<td class="companyname" />').html("<span id='transferpagetocase' href='javascript:void()' data-id=" + val.CompanyID + " style='cursor:pointer;color:black;'>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                        }
                        else {
                            $row.append($('<td class="companyname" />').html("<span id='transferpagetocase' href='javascript:void()' data-id=" + val.CompanyID + " style='cursor:pointer;color:black;'>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                        }
                        $row.append($('<td class="CaseFilingDate"  />').html("<span name='" + val.CaseFilingDate + "'> " + (val.CaseFilingDate != null ? formatDatetoIST(val.CaseFilingDate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                        $row.append($('<td class="caseclientcontact" />').html("<span>" + (val.PrimaryContactName != null ? val.PrimaryContactName : '<span style="">&nbsp;</span>')));
                        if (val.MatterType == "Litigation") {
                            //For Litigation
                            $row.append($('<td class="MatterType" />').html("<span class='mt-litigation'>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        } else if (val.MatterType == "Advisory") {
                            //For Advisory
                            $row.append($('<td class="MatterType" />').html("<span class='mt-advisory'>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        } else if (val.MatterType == "Dispute Resolution") {
                            //For Dispute Resolution
                            $row.append($('<td class="MatterType" />').html("<span class='mt-resolution'>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        } else if (val.MatterType == "Others") {
                            //For Others
                            $row.append($('<td class="MatterType" />').html("<span class='mt-others'>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        } else if (val.MatterType == "Transaction") {
                            //For Transaction
                            $row.append($('<td class="MatterType" />').html("<span class='mt-transaction'>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        }
                        //$row.append($('<td class="MatterType" />').html("<span>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casecreatedby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseteammembers" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '<span style="">&nbsp;</span>')));
                        var FinalUserCaseid = "";
                        if (val.UserCaseid == "null" || val.UserCaseid == null) {
                            FinalUserCaseid = "";
                        }
                        else {
                            FinalUserCaseid = val.UserCaseid;
                        }
                        var htmllnk = "";
                        if (FinalUserCaseid != "" && String(val.CNRCase) == "" && dashcw == "display:unset" && IsCWActive == "1") {
                            if (val.IsRevenueCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span  align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-green.png'></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span id='chcr" + val.CaseNextHearing + "'  align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-org.png'></a>";
                                    }
                                }
                            }
                            else if (val.IsReraCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsReraCourt=" + val.IsReraCourt + " sno = " + val.UserCaseid + " > <span  align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-green.png'></a >";
                                }
                                else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsReraCourt=" + val.IsReraCourt + " sno = " + val.UserCaseid + " > <span id='chcrera" + val.CaseNextHearing + "' class='' align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-org.png'></a >";
                                    }
                                }
                            }
                            else {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span  align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-green.png'></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span id='chc" + val.CaseNextHearing + "' align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-org.png'></a >";
                                    }
                                }
                            }
                            //if (val.iCaseNotFound >= 1) {
                            //    htmllnk += "<a class='" + btnclass + "' style='color: black;' title='Case not found. Please re-add the case with correct details.' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span  align='center'> " + usercaseid + " </span><img src='/newassets/img/deletematter.png'></a >";
                            //}
                            //else {
                            //    htmllnk += "&nbsp;<a class='" + btnclass + "' style='color: black;' title='Remove case for live update' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span  align='center'> " + usercaseid + " </span><img src='/newassets/img/deletematter.png'></a >";
                            //}

                            $row.append($('<td class="casecasedetails" />').html(htmllnk));
                        }
                        else if (FinalUserCaseid != "" && String(val.CNRCase) != "" && dashcw == "display:unset" && IsCWActive == "1") {

                            if (val.IsRevenueCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span   align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-green.png'></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span id='chcr" + val.CaseNextHearing + "' align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-org.png'></a >";
                                    }
                                }
                            }
                            else {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span  align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-green.png'></a >";
                                }
                                else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span id='chc" + val.CaseNextHearing + "'  align='center;'> " + usercaseid + " </span><img src='/newassets/img/casedetail-org.png'></a >";
                                    }
                                }
                            }
                            if (val.iCaseNotFound >= 1) {
                                htmllnk += "<a style='color:black' class='" + btnclass + "' style='color: black;' title='Case not found. Please re-add the case with correct details.' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span  align='center'> " + usercaseid + " </span><img src='/newassets/img/deletematter.png'></a >";
                            }
                            else {
                                htmllnk += "&nbsp;<a style='color:black' class='" + btnclass + "' style='color: black;' title='Remove CNR case for live update' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span  align='center'> " + usercaseid + " </span><img src='/newassets/img/deletematter.png'></a >";
                            }
                            $row.append($('<td class="casecasedetails" />').html(htmllnk));
                        }
                        else {
                            $row.append($('<td class="casecasedetails" />').html("&nbsp;"));
                        }
                        if (val.CaseNextHearing != null && dashcw == "display:unset" && IsCWActive == "1") {
                            if (val.IsRevenueCourt == "1") {
                                $row.append($('<td class="nexthearing"  />').html("<span name='" + val.CaseNextHearing + "'> " + (val.CaseNextHearing != null ? formatDatetoIST(val.CaseNextHearing) : '<span style="visibility: hidden;">&nbsp;</span>')));

                            }
                            else {
                                $row.append($('<td class="nexthearing"  />').html("<span name='" + val.CaseNextHearing + "'> " + (val.CaseNextHearing != null ? formatDatetoIST(val.CaseNextHearing) : '<span style="visibility: hidden;">&nbsp;</span>')));
                            }
                        }
                        else {
                            $row.append($('<td class="NextHearing" />').html(""));
                        }
                        $row.append($('<td class="caseeditdate"  />').html("<span name='" + val.LastModifyDate + "'> " + (val.LastModifyDate != null ? formatDatetoIST(val.LastModifyDate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                        if (val.IsCompanyAdmin == "1") {
                            $row.append($('<td class="caseclientname" />').html("<span id='transferpagetocase' href='javascript:void()' data-id=" + val.CompanyID + " style='cursor:pointer;color:black;'>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                        }
                        else {
                            $row.append($('<td class="caseclientname" />').html("<span name=" + ClientName + "  id='transferpagetocase' href='javascript:void()' data-id=" + val.matterclientid + " style='cursor:pointer;color:black;'>" + (ClientName != null ? ClientName : '<span style="">&nbsp;</span>')));
                        }
                        //$row.append($('<td class="casecourtname" />').html("<div class='iconbox'><img src='/newassets/img/court.svg' /> " + (val.CourtName != null ? val.CourtName : '<div style="">&nbsp;</div>') + "</div>"));
                        let $iconbox = $("<div class='iconbox'></div>").append(
                            $("<img>", { src: "/newassets/img/court.svg" }),
                            val.CourtName ? " " + val.CourtName : $("<span>").html("&nbsp;")
                        );
                        if (!val.CourtName) {
                            $iconbox.css("display", "none"); // Hide only the .iconbox
                        }
                        let $td = $('<td class="casecourtname" />').append($iconbox);
                        $row.append($td);

                        $row.append($('<td class="caseothercourtname" />').html("<div>" + (val.OtherCourtName != null ? val.OtherCourtName : '<div style="">&nbsp;</div>') + "</div>"));
                        $row.append($('<td class="casestatus" />').html("<div>" + (val.cstatus != null ? val.cstatus : '<div style="">&nbsp;</div>') + "</div>"));

                        $row.append($('<td class="courtstatus" />').html("<span>" + (val.Court_Status != null ? val.Court_Status : '<span style="">&nbsp;</span>')));
                        //extra col
                        $row.append($('<td class="CertifiedCopyAppliedon" />').html("<span>" + (val.CertifiedCopyAppliedon != null ? formatDatetoIST(val.CertifiedCopyAppliedon) : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="CertifiedCopyReceivedon" />').html("<span>" + (val.CertifiedCopyReceivedon != null ? formatDatetoIST(val.CertifiedCopyReceivedon) : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="ValuationofSuit" />').html("<span>" + (val.ValuationofSuit != null ? val.ValuationofSuit : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="Courtfee" />').html("<span>" + (val.Courtfee != null ? val.Courtfee : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="OppositePartyCounselname" />').html("<span>" + (val.OppositePartyCounselname != null ? val.OppositePartyCounselname : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="OppositePartyCounselemail" />').html("<span>" + (val.OppositePartyCounselemail != null ? val.OppositePartyCounselemail : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="OppositePartyCounselphone" />').html("<span>" + (val.OppositePartyCounselphone != null ? val.OppositePartyCounselphone : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="CasenumberInternal" />').html("<span>" + (val.CasenumberInternal != null ? val.CasenumberInternal : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseclosedate"  />').html("<span name='" + closedate + "'> " + (closedate != null ? formatDatetoIST(closedate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                        $row.append($('<td class="subjecttype"  />').html("<span name='" + val.SubjectTypeName + "'> " + (val.SubjectTypeName != null ? val.SubjectTypeName : '<span style="visibility: hidden;">&nbsp;</span>')));
                        var html3 = '';
                        if (val.Notes == "" || val.Notes == null || val.Notes == "null") {
                            html3 += '&nbsp;'
                        }
                        else {
                            if (val.Notes.length > 60) {
                                html3 += '<span class="comment more" style="">' + val.Notes.substring(0, 60) + '</span>'
                                html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html3 += '' + val.Notes + ''
                                html3 += '</div>'
                            }
                            else {
                                html3 += '<span class="comment more" style="">' + val.Notes + '</span>'
                            }
                        }
                        $row.append($('<td class="notes"  />').html(html3));
                        $row.append($('<td class="teamleadname" />').html("<span>" + (val.TeamLeadName != null ? val.TeamLeadName : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="s" style="display:none;" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.Id + "'/>"));
                       //if (String(val.CNRCase) != "" && dashcw == "display:unset" && IsCWActive == "1") {
                       //     $row.append($('<td class="linkedcase"/>').html("<a style='cursor:pointer' id='cnrcaselink' case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href='javascript:void()'>&nbsp;" + val.CNRCase + "</a>"));
                       // }
                       // else {
                       //     $row.append($('<td class="linkedcase"/>').html("<span>&nbsp;</span>"));
                       // }
                        $row.append($('<td class="CaseType"  />').html("<span name='" + val.CaseType + "'> " + (val.CaseType != null ? val.CaseType : '<span style="visibility: hidden;">&nbsp;</span>')));
                        var html31 = '';
                        if (val.CaseDetails == "" || val.CaseDetails == null || val.CaseDetails == "null") {
                            html31 += '&nbsp;'
                        }
                        else {
                            if (val.CaseDetails.length > 60) {
                                html31 += '<span class="comment more" style="">' + val.CaseDetails.substring(0, 60) + '</span>'
                                html31 += '<span data-toggle="collapse" data-target="#dt' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                html31 += ' <div id="dt' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                html31 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dt' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html31 += '' + val.CaseDetails + ''
                                html31 += '</div>'
                            }
                            else {
                                html31 += '<span class="comment more" style="">' + val.CaseDetails + '</span>'
                            }
                        }
                        $row.append($('<td class="CaseDetails"  />').html(html31));
                        $row.append($('<td class="mtrno"  />').html("<span name='" + val.mtrno + "'> " + (val.mtrno != null ? val.mtrno : '<span style="visibility: hidden;">&nbsp;</span>')));
                        $row.append($('<td class="cnrno"  />').html("<span name='" + val.cnrno + "'> " + (val.cnrno != null ? val.cnrno : '<span style="visibility: hidden;">&nbsp;</span>')));
                        $row.append($('<td class="DisposeOption"  />').html("<span name='" + val.Outcome + "'> " + (val.Outcome != null ? val.Outcome : '<span style="visibility: hidden;">&nbsp;</span>')));

                        var html311 = '';
                        if (val.vAdvocatename == "" || val.vAdvocatename == null || val.vAdvocatename == "null") {
                            html311 += '&nbsp;'
                        }
                        else {
                            if (val.vAdvocatename.length > 60) {
                                html311 += '<span class="comment more" style="">' + val.vAdvocatename.substring(0, 60) + '</span>'
                                html311 += '<span data-toggle="collapse" data-target="#dtadv' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                                html311 += ' <div id="dtadv' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;right:80px;height:auto;">'
                                html311 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtadv' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html311 += '' + val.vAdvocatename + ''
                                html311 += '</div>'
                            }
                            else {
                                html311 += '<span class="comment more" style="">' + val.vAdvocatename + '</span>'
                            }
                        }
                        $row.append($('<td class="vAdvocatename"  />').html(html311));
                        $row.append($('<td class="vPetionerName"  />').html("<span name='" + val.PetitionerName + "'> " + (val.PetitionerName != null ? val.PetitionerName : '<span style="visibility: hidden;">&nbsp;</span>')));
                        $row.append($('<td class="vRespondentName"  />').html("<span name='" + val.RespondentName + "'> " + (val.RespondentName != null ? val.RespondentName : '<span style="visibility: hidden;">&nbsp;</span>')));
                        $row.append($('<td class="vCourtComplex"  />').html("<span name='" + val.CourtComplex + "'> " + (val.CourtComplex != null ? val.CourtComplex : '<span style="visibility: hidden;">&nbsp;</span>')));
                        if (val.TotalCaseTime >= "1") {
                            $row.append($('<td class="vOtherpartydetails" style="text-align: center;" />').html("<span  title='View Other Party Details' data-id=" + val.Id + " style='color:blue;'>" + (val.TotalCaseTime != null ? val.TotalCaseTime : '<span style="">&nbsp;</span>')));
                        }
                        else {
                            $row.append($('<td class="vOtherpartydetails" /></td>'));
                        }


                        var countcf = countcustomfoeld;
                        for (var str = 1; str <= countcf; str++) {
                            if (str == 1) {
                                if (val.col1 == "") {
                                    $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col1 == null) {
                                    $row.append($('<td class="class3" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col1, qty + 'a' + str);
                                    $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 2) {
                                if (val.col2 == "") {
                                    $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col2 == null) {
                                    $row.append($('<td class="class4" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col2, qty + 'a' + str);
                                    $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 3) {
                                if (val.col3 == "") {
                                    $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col3 == null) {
                                    $row.append($('<td class="class5" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col3, qty + 'a' + str);
                                    $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 4) {
                                if (val.col4 == "") {
                                    $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col4 == null) {
                                    $row.append($('<td class="class6" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col4, qty + 'a' + str);
                                    $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 5) {
                                if (val.col5 == "") {
                                    $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col5 == null) {
                                    $row.append($('<td class="class7" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col5, qty + 'a' + str);
                                    $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 6) {
                                if (val.col6 == "") {
                                    $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col6 == null) {
                                    $row.append($('<td class="class8" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col6, qty + 'a' + str);
                                    $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 7) {
                                if (val.col7 == "") {
                                    $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col7 == null) {
                                    $row.append($('<td class="class9" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col7, qty + 'a' + str);
                                    $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 8) {
                                if (val.col8 == "") {
                                    $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col8 == null) {
                                    $row.append($('<td class="class10" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col8, qty + 'a' + str);
                                    $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 9) {
                                if (val.col9 == "") {
                                    $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col9 == null) {
                                    $row.append($('<td class="class11" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col9, qty + 'a' + str);
                                    $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 10) {
                                if (val.col10 == "") {
                                    $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col10 == null) {
                                    $row.append($('<td class="class12" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.co10, qty + 'a' + str);
                                    $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 11) {
                                if (val.col11 == "") {
                                    $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col11 == null) {
                                    $row.append($('<td class="class13" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col11, qty + 'a' + str);
                                    $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 12) {
                                if (val.col12 == "") {
                                    $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col12 == null) {
                                    $row.append($('<td class="class14" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col12, qty + 'a' + str);
                                    $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 13) {
                                if (val.col13 == "") {
                                    $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col13 == null) {
                                    $row.append($('<td class="class15" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col13, qty + 'a' + str);
                                    $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 14) {
                                if (val.col14 == "") {
                                    $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col14 == null) {
                                    $row.append($('<td class="class16" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col14, qty + 'a' + str);
                                    $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 15) {
                                if (val.col15 == "") {
                                    $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                                }
                                else if (val.col15 == null) {
                                    $row.append($('<td class="class17" />').html("<span>&nbsp;</span>"));
                                }
                                else {
                                    var htmlNew = Custommore(val.col15, qty + 'a' + str);
                                    $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                        }

                        //For Action Binding
                        var html4 = '';
                        html4 += '<ul class="action-ul"><li><span id="ArchiveMatterSingle" style="cursor:pointer;" title="Unarchive Matter" Idmnae="' + val.mname + '"  id-val="' + val.Id + '"><span><img src="/newassets/img/archive-icon.png"></span></span>';
                        if (val.oedit == 1)
                        {
                            html4 += "<li><span  style='cursor: pointer; 'title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript: void ()' sno=" + val.Id + "><img src='/newassets/img/edit-icon.png' height='28' width='28'></span></li>";
                        }
                        html4 += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="28" width="28"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                        //For Delete Action
                        if (val.odelete == 1)
                        {
                            html4 += "<li><div id='deletecasesingle' title='Mark Matter For Deletion' Idmnae='" + val.mname + "' Idss='" + val.mtrno + "' is-delete=" + val.IsDelete + " id-val=" + val.Id + "><span><img src='/newassets/img/deletematter.png'></span>Delete Matter</div></li>";
                        }
                        //For Add User Live Update
                        if (FinalUserCaseid != "" && dashcw == "display:unset" && IsCWActive == "1")
                        {
                            html4 += "<li><div  cwid='" + FinalUserCaseid + "'  matterid='" + val.Id + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert'><span><img src='/newassets/img/add-user-lu.png' ></span>Add User Live Update</span>";
                        }
                        // For Limitations 
                        //if (val.LimitationCount == 0) {
                        //    html4 += "<li><div style='cursor:pointer;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'><span><img src='/newassets/img/statueoflimitation.png'></span>Statue of Limitation</div></li>";
                        //}
                        //else {
                        //    html4 += "<li><div style='cursor:pointer; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'><span><img src='/newassets/img/statueoflimitation.png'></span>Statue of Limitation</div></li>";
                        //}

                        //if (val.odelete == 1 && val.oedit == 1 && roleids == 1) {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                        //    }
                        //}
                        //else if (val.oedit == 1 && val.odelete == 1) {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp; ";
                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                        //    }
                        //}
                        //else if (val.oedit == 1) {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                        //    }
                        //}
                        //else if (val.odelete == 1) {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;";
                        //    }
                        //}
                        //else {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Unarchive Matter'  id-val=" + val.Id + "></span>&nbsp; ";
                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;";
                        //    }
                        //}
                        //if (FinalUserCaseid != "" && dashcw == "display:unset" && IsCWActive == "1") {
                        //    html4 += "<span class='fa fa-user-plus' cwid='" + FinalUserCaseid + "'  matterid='" + val.Id + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert'></span>";
                        //}
                        $row.append($('<td class="actioncase"/>').html(html4));

                        $("#bindcasedata").append($row);
                        if (i === (length - 1)) {

                            if (isRenderPage == false) {
                                totalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }
                    });
                    loadflag = false;
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (ChoiceField == 0) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                if (dashcw == "display:unset" && IsCWActive == "1") {
                    $(".casecasedetails1,.casecasedetails2,.casecasedetails3").show();
                }
                else {
                    $(".casecasedetails1,.casecasedetails2,.casecasedetails3").hide();
                    $('#NextHearing').attr('checked', false);
                    $('.NextHearing').hide()
                }
                try {
                    var obj = JSON.parse(Nexthearingary);
                    $.each(obj.data, function (i, a) {
                        var SetDate = a.NexthearingDate;
                        $("#nh" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                    });
                }
                catch (er) {
                }
                try {
                    var obj = JSON.parse(NexthearingaryRevenue);
                    $.each(obj.data, function (i, a) {
                        var SetDate = a.NexthearingDate;
                        $("#nhr" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                    });
                }
                catch (er) {
                }
            }
            else {
                $(".actioncase").hide();
                $("input:checkbox").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                    $(this).prop('checked', false);
                });
                if (dashcw == "display:unset" && IsCWActive == "1") {
                    $(".casecasedetails1,.casecasedetails2,.casecasedetails3").show();
                }
                else {
                    $(".casecasedetails1,.casecasedetails2,.casecasedetails3").hide();
                    $('#NextHearing').attr('checked', false);
                    $('.NextHearing').hide()
                }
                var formData = new FormData();
                formData.append("moduleName", "MatterList");
                $.ajax({
                    url: '/api/CallApi/LoadColumnMasterChoiceByFirmId',
                    data: formData,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (response) {
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            // alert(datas);
                            var obj = JSON.parse(response.Data);
                        }
                        else {
                            //alert("not found");
                        }
                        if (firstload == true) {
                            $.each(obj, function (i, a) {
                                if (String(a.ColumnValue) == "NextHearing") {
                                    if (dashcw == "display:unset" && IsCWActive == "1") {
                                        arrcolmenuseleciton.push(a.ColumnValue);
                                    }
                                    else {
                                    }
                                }
                                else {
                                    arrcolmenuseleciton.push(a.ColumnValue);
                                }
                            });
                        }
                        firstload = false;
                        for (i = 0; i < arrcolmenuseleciton.length; i++) {
                            $("table ." + arrcolmenuseleciton[i]).show();
                            $("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);
                        }
                        $(".actioncase").show();
                        closeload();
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
                try {
                    var obj = JSON.parse(Nexthearingary);
                    $.each(obj.data, function (i, a) {
                        var SetDate = a.NexthearingDate;
                        $("#nh" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                    });
                }
                catch (er) {
                }
                try {
                    var obj = JSON.parse(NexthearingaryRevenue);
                    $.each(obj.data, function (i, a) {
                        var SetDate = a.NexthearingDate;
                        $("#nhr" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                    });
                }
                catch (er) {
                }
            }
            
            setTimeout(function () {
                if (urltype == "status") {
                    casefilterstatus = atob(urltypevalue);
                    $("#casefilterstatus").val(casefilterstatus);
                }
                else if (urltype == "type") {
                    mattertypefilter = atob(urltypevalue);
                    $("#Mattertypefilter").val(mattertypefilter);
                }
                else if (urltype == "subject") {
                    subjecttypefilter = atob(urltypevalue);
                    $("#SubjectTypefilter").val(subjecttypefilter);
                }
                if (IsPersonaltoken == "1" && urltype != "") {
                    $("#casefilterCreatedBy").val(userid.toLocaleLowerCase());
                }
                urltype = "";
            },
                3000);
            return false;
        });
        
    }
    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    function renderPagination(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
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
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        firstload = true;
        $("#txtgopage").val("");
        loadcontactlist(setPageNo, "", "");

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        firstload = true;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loadcontactlist(setPageNo, "", "");
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        firstload = true;
        $("#txtgopage").val("");
        loadcontactlist(setPageNo, "", "");
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > totalRecordCount) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        firstload = true;
        isRenderPage = true;
        loadcontactlist(setPageNo, "", "");
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    bindCommonDropdown("SubjectTypefilter", "Case_Type", "Subject Type");
    bindCommonDropdown("casefilterstatus", "Case_Status", 'Status');
    bindCommonDropdown("casefilterdisposeoption", "Disposed_Option", "Outcome");
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.length;
                if (dropdownname == "Case_Type") {
                    $.each(response.Data, function (i, a) {
                        //alert(a.Value);
                        html1 += '<option value="' + a.Name + '" >  ' + a.Name + '</option>';
                        $("#" + controlname).html(html1);
                    }); //End of foreach Loop
                }
                else {
                    $.each(response.Data, function (i, a) {
                        //alert(a.Value);
                        html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                        $("#" + controlname).html(html1);
                    }); //End of foreach Loop
                }
                //  //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        if ($(this).prop('checked')) {
            arrcolmenuseleciton.push($(this).attr("name"));
        }
        else {
            arrcolmenuseleciton.splice($.inArray($(this).attr("name"), arrcolmenuseleciton), 1);
        }
        $(column).toggle();
    });
    var casewatchcaseid = "";
    var mkMatterId = "";
    /*Load user by case id*/
    function loaduserbycaseid() {
        var formdata = new FormData();
        formdata.append("pagenum", 1);
        formdata.append("pagesize", 2000);
        formdata.append("caseid", mkMatterId);
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadUsersByCaseIdForAlerts',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var obj = JSON.parse(response.Data);
                var option = '<option value="">Select Users</option>';
                $.each(obj, function (i, a) {
                    option += '<option value="' + a["auser"] + '" >  ' + a["cfname"] + '(' + a["Username"] + ')</option>';
                });
                $("#UsersCasewatchAlert").empty().append(option);//End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX er
        });
    }
    $(document).on('click', '#opencasewatchusermodal', function () {
        casewatchcaseid = $(this).attr("cwid");
        mkMatterId = $(this).attr("matterid");
        loaduserbycaseid();
        LoadCasewatchAlertUsers();
    });
    /*save case watch user*/
    $("#savecasewatchuser").click(function () {
        var formData = new FormData();
        var casealerruser = $("#UsersCasewatchAlert").val();
        if (casealerruser == "") {
            alert("Please select user");
            $("#UsersCasewatchAlert").focus();
            return false;
        }
        formData.append("auser", casealerruser);
        formData.append("caseid", casewatchcaseid);
        formData.append("token", mkMatterId);
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
    $(document).on("click", "#deleteCasewatchuseralert", function () {
        var formData = new FormData();
        var auserslist = $(this).attr("data-user");
        var cwid = $(this).attr("data-id");
        formData.append("auser", auserslist);
        formData.append("caseid", cwid);
        formData.append("token", mkMatterId);
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
    /*Load Casewatch Alert Users*/
    function LoadCasewatchAlertUsers() {
        var formData = new FormData();
        formData.append("caseid", casewatchcaseid);
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
                    htmls += ' <tr><td>' + q1 + '</td><td>' + a["vDispName"] + '</td><td>' + a["email_id"] + '</td><td>' + a["mobile_No"] + '</td><td style="text-align:center;"><img src="/newassets/img/delet_icon.svg" id="deleteCasewatchuseralert" data-id="' + a.Usercseid + '" data-user="' + a.User_Id + '" style="color:red;cursor:pointer;" title="Remove user from case alert" /></td></tr>';
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
    /*****************************************************/
    //var saveArrcolmenuseleciton = [];
    //slider.addEventListener("change", function () {
    //    saveArrcolmenuseleciton = [];
    //    $('input:checkbox').each(function () {
    //        if ($(this).prop('checked')) {
    //            var fileval = $(this).attr("value");
    //            if (fileval != undefined && fileval != '') {
    //                saveArrcolmenuseleciton.push(fileval);
    //            }
    //        }
    //    });
    //    if (saveArrcolmenuseleciton.length > 8) {
    //        alert("You can select maxmium 8 columns for default view.");
    //        slider.checked = false;
    //        return false;
    //    }
    //    var formdata = new FormData();
    //    formdata.append("tokens", saveArrcolmenuseleciton);
    //    formdata.append("moduleName", "MatterList");
    //    openload();
    //    var ld12 = $.ajax({
    //        async: true,
    //        url: "/api/CallApi/SaveColumnMasterChoice",
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (data) {
    //            if (parseInt(data.Data) >= 0) {
    //                alert("Successfully saved");
    //                location.reload();
    //                closeload();
    //            }
    //            else {
    //                alert("OOPs! Something went wrong.");
    //                closeload();
    //            }
    //        },
    //        failure: function (data) {
    //            alert(data.responseText);
    //            closeload();
    //        }, //End of AJAX failure function
    //        error: function (data) {
    //            alert(data.responseText);
    //            closeload();
    //        } //End of AJAX error function
    //    });
    //});

    var arrcolmenuremove = [];
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        if ($(this).prop('checked')) {
            arrcolmenuseleciton.push($(this).attr("name"));
            arrcolmenuremove.push(column);
        }
        else {
            arrcolmenuseleciton.splice($.inArray($(this).attr("name"), arrcolmenuseleciton), 1);
            arrcolmenuremove.splice($.inArray(column, arrcolmenuremove), 1);
        }
        //$(column).toggle();
    });

    
    //$(document).on('click', '#ClearCustomSelection', function () {
    //    for (i = 0; i < arrcolmenuseleciton.length; i++) {
    //        $("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', false);
    //    }
    //    let normalizedArray2 = arrcolmenuremove.map(item => item.replace(/^\./, ''));
    //    arrcolmenuseleciton = arrcolmenuseleciton.filter(item => !normalizedArray2.includes(item));
    //    for (i = 0; i < arrcolmenuseleciton.length; i++) {
    //        let column = arrcolmenuseleciton[i].replace(/Class(\d+)/, "col$1");
    //        $("[name='" + column + "']").prop('checked', true);
    //        //$("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);
    //    }
    //    $("input:checkbox").each(function () {
    //        var column = "table ." + $(this).attr("name");
    //        $(column).hide();
    //        $(this).prop('checked', false);
    //    });
    //    for (i = 0; i < arrcolmenuseleciton.length; i++) {
    //        $("table ." + arrcolmenuseleciton[i]).show();
    //        let column = arrcolmenuseleciton[i].replace(/Class(\d+)/, "col$1");
    //        $("[name='" + column + "']").prop('checked', true);
    //        //$("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);
    //    }
    //    $('#myModalCustomizedcolumn').modal('hide');
    //});

    //var Ids = new Array();
    //$(document).on('click', '#SaveCustomSelection', function () {

    //    $("input:checkbox").each(function () {
    //        var column = "table ." + $(this).attr("name");
    //        $(column).hide();
    //        $(this).prop('checked', false);
    //    });
    //    for (i = 0; i < arrcolmenuseleciton.length; i++) {
    //        //$("table ." + arrcolmenuseleciton[i]).show();
    //        let columntb = arrcolmenuseleciton[i].replace(/col(\d+)/, "Class$1");
    //        $("table ." + columntb).show();
    //        let column = arrcolmenuseleciton[i].replace(/Class(\d+)/, "col$1");
    //        $("[name='" + column + "']").prop('checked', true);
    //        //$("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);
    //    }
    //    $('#myModalCustomizedcolumn').modal('hide');
    //});

    //$("#ColumnSelectionopen").click(function () {
    //    $('#myModalCustomizedcolumn').modal({ show: true });
    //});
    //$("#DefaultColumnSelectionOpen").click(function () {
    //    $('#myModalCustomizedcolumn').modal('hide');
    //    var url = "/firm/ColumnSelection";
    //    $('.mymodelscolumnselection').load(url, function (result) {
    //        $('#myModalcolumn').modal({ show: true });
    //    });
    //})

    /*Load master column*/
    //function LoadColumnMaster() {
    //    arrcolmenuseleciton = [];
    //    var formData = new FormData();
    //    formData.append("moduleName", "MatterList");
    //    $("#bindcolumnmaster").html("");
    //    openload();
    //    var dt = $.ajax({
    //        url: '/api/CallApi/LoadColumnMasterChoice',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        type: 'POST',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                // alert(datas);
    //                var obj = JSON.parse(response.Data);
    //            }
    //            var html3 = '';
    //            var html4 = '';
    //            $.each(obj, function (i, a) {
    //                if (a.Sequence == 101) {
    //                    //$("#customfielddiv").show();
    //                    html4 += '<li data-subject="' + a.ColumnValue + '"><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="' + a.ColumnValue + ' chkdhide" name="' + a.ColumnValue + '"> <span>' + a.ColumnName + '</span></li>';
    //                }
    //                else if (a.Sequence > 101) {
    //                    //$("#customfielddiv").show();
    //                    html4 += '<li data-subject="' + a.ColumnValue + '"><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="' + a.ColumnValue + ' chkdhide" name="' + a.ColumnValue + '"> <span>' + a.ColumnName + '</span></li>';
    //                }
    //                else {
    //                    html3 += '<li data-subject="' + a.ColumnValue + '"><input type="checkbox" id="sel' + a.Id + '" value="' + a.Id + '" class="' + a.ColumnValue + ' chkdhide" name="' + a.ColumnValue + '"> <span>' + a.ColumnName + '</span></li>';
    //                }
    //            });

    //            $("#bindcolumnmaster").empty().html(html3 + html4);
    //        }, //End of AJAX Success function
    //        failure: function (response) {
    //            // alert(response.responseText);
    //            closeload();
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            // alert(response.responseText);
    //            closeload();
    //        } //End of AJAX error function
    //    });

    //}

    /*****************************************************/

    $("#CustomColumnSelectionopen").click(function () {
        $('#myModalCustomizedcolumn').modal({ show: true });
    });
    $("#DefaultColumnSelectionOpen").click(function () {
        $('#myModalCustomizedcolumn').modal('hide');
        var url = "/firm/ColumnSelection";
        $('.mymodelscolumnselection').load(url, function (result) {
            $('#myModalcolumn').modal({ show: true });
        });
    });
    //custom fields search
    $(document).on('click', '#searchcustomfilters', function () {
        // $(this).prev('input').val('')
        fieldnamecust = "";
        fieldvaluecust = "";
        var SeqValue = $(this).attr('Seq');
        var fieldsvalue = $(this).attr('idvals');
        var nameoffield = $(this).attr('idname');
        var inputcasename = $('#customfieldsfilter' + SeqValue + '').val();
        if (inputcasename == "") {
            alert("Please enter the search input.");
            return false;
        }
        $('.clscustomfilters' + SeqValue + '').css("display", "unset");
        loadflag = true;
        fieldnamecust = nameoffield;
        fieldvaluecust = inputcasename;
        loadcontactlist(1, nameoffield, inputcasename);
        chksflag = true;
    });
    $(document).on('click', '#clearcustomfilters', function () {
        var SeqValue1 = $(this).attr('idsss1');
        $('#customfieldsfilter' + SeqValue1 + '').val("");
        $('.clscustomfilters' + SeqValue1 + '').css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
});

async function loadtotalcount() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/Gettotalcount",
        dataType: 'json',
        data: ' ',
        contentType: false,
        processData: false,
        success: function (response) {
            var mydata = response.data[0];

            var TotalActiveCases1 = mydata.TotalActiveCases;
            var TotalArchivedCases = mydata.TotalArchivedCases;
            var TotalDeletedCases = mydata.TotalDeletedCases;           
            var TotalActiveCases2 = (Number(TotalActiveCases1) || 0) - (Number(TotalArchivedCases) || 0);
            console.log(TotalActiveCases2);
            console.log(TotalActiveCases1);
            $("#CcaseCount").text("(" + TotalActiveCases2 + ")");
           // $("#ArchcaseCount").text("(" + TotalArchivedCases + ")");
            $("#DeltcaseCount").text("(" + TotalDeletedCases + ")");

        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}