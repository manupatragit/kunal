$(document).ready(function () {
    console.log(farmocode);
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0, loadisActivate = 0;
    var fieldnamecust = "";
    var fieldvaluecust = "";
    var arrcolmenuseleciton = [];
    var arrcolmenuselecitonfix = [];
    var firstload = true;
    ploadtabledata();
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    $('#UsersCasewatchAlert').multiselect({
        columns: 1,
        placeholder: 'Select User',
        search: true,
        selectAll: true
    });
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
    /*Next hearing by user id*/
    //For Diary Icon green/Red colors
    //var chkNexthearingary = localStorage.getItem("Nexthearingary");
    //var chkNexthearingaryRevenue = localStorage.getItem("NexthearingaryRevenue");
    //if (chkNexthearingary == null) {

    //    NextHearingIfidByUserId();
    //}
    //function NextHearingIfidByUserId() {
    //    var formData = new FormData();

    //    $.ajax({
    //        timeout: 20000,
    //        async: true,
    //        type: "POST",
    //        url: "/api/MatterApi/NextHearingIfidByUserId",
    //        dataType: 'json',
    //        data: formData,
    //        contentType: false,
    //        processData: false,

    //        success: function (response) {

    //            //alert(JSON.stringify(response));
    //            localStorage.removeItem("Nexthearingary");
    //            localStorage.removeItem("NexthearingaryRevenue");

    //            var data = JSON.parse(response.Data.data);
    //            localStorage.setItem("Nexthearingary", JSON.stringify(data));


    //            var dataRevenue = JSON.parse(response.Data.dataRevenue);
    //            localStorage.setItem("NexthearingaryRevenue", JSON.stringify(dataRevenue));
    //            // alert(JSON.stringify(localStorage.getItem("Nexthearingary")));
    //            setTimeout(() => {
    //                loadflag = true;
    //                loadisActivate = 1;
    //                loadcontactlist(pageindex, "", "");
    //            }, "10000")

    //            //  //console.log(response);
    //        }, //End of AJAX Success function

    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        } //End of AJAX error function

    //    });
    //}
    //$("#ColumnSelectionopen").click(function () {
    //    var url = "/firm/ColumnSelection";
    //    $('.mymodelscolumnselection').load(url, function (result) {
    //        $('#myModalcolumn').modal({ show: true });
    //    });
    //});
    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
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
    var exportfilter = false;
    /*Excel model popup*/
    $("#oexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        /*var pagesize = 50;*/
        var pagesize = 0;
        if (roleids == 1) {
            pagesize = 500;
        } else {
            pagesize = 200;
        }
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
    $("#opdf").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        /*var pagesize = 50;*/
        var pagesize = 0;
        if (roleids == 1) {
            pagesize = 500;
        } else {
            pagesize = 200;
        }
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
    /*Data export to excel*/
    $(document).on("click", "#exporttoexcelfile", function () {
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
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 50;
        //Next Hearing range filter
        var NextHearingfromd = $("#Nexthearingfrmdate").val();
        var NextHearingtod = $("#NexthearingdateTo").val();
        var casedetailsfilter = $("#casedetailsfilter").val();
        var Court_Status = $("#courtstatusfilter").val();

        var urls = "/" + fcode + "/Firm/ExportoExcelSEBINewCases";
        url_redirect({
            url: urls,
            method: "post",
            data: {
                "pagenum": EncodeText(pagenum), "pagesize": EncodeText(pagesizedata),
                "esearchdata": EncodeText(esearchdata), "ecasefilterdate": EncodeText(ecasefilterdate),
                "ecasefiltercourt": EncodeText(ecasefiltercourt), "ecasefilterclient": EncodeText(ecasefilterclient),
                "ecasefilterstatus": EncodeText(ecasefilterstatus), "eusers": EncodeText(eusers),
                "createdby": EncodeText(createdby), "exportcolumn": EncodeText(selected3), "esearchdatanotes": EncodeText(esearchdatanotes),
                "CFieldtype": EncodeText(type), "ecasefiltercompanyname": EncodeText(ecasefiltercompanyname),
                "ecasefiltermattertype": EncodeText(ecasefiltermattertype), "ecasefiltersubjecttype": EncodeText(ecasefiltersubjecttype),
                "ecasefiltercourtname": EncodeText(ecasefiltercourtname), "ecasefilterdateto": EncodeText(ecasefilterdateto),
                "ecasefFilingdate": EncodeText(ecasefFilingdate), "ecasefFilingdateto": EncodeText(ecasefFilingdateto),
                "searchcustomcolname": EncodeText(fieldnamecust), "searchcustomcolvalue": EncodeText(fieldvaluecust),
                "searchdisposeoption": EncodeText(serhdisposeoptions), "casefilterCaseDetails": EncodeText(casefilterCaseDetails1),
                "casefiltermtrno": EncodeText(casefiltermtrno1), "casefilterInternalno": EncodeText(casefilterInternalno1),
                "casefiltercnrno": EncodeText(casefiltercnrno1), "NextHearingfromd": EncodeText(NextHearingfromd),
                "NextHearingtod": EncodeText(NextHearingtod), "casedetailsfilter": EncodeText(casedetailsfilter),
                "Court_Status": EncodeText(Court_Status)
            }
        });
    })
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
        window.location = encodeURI("/firm/ExportoExcelCustomFieldMatter?status=true&vdate=" + vdate + "&type=" + type + "&exportcolumn=" + selected3);
    })
    $(document).on("click", "#exporttopdffile", function () {

        var esearchdata = $('#casefiltercasename').val();
        var ecasefilterdate = $('#casefilterdate').val();
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
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 0;
        if (roleids == 1) {
            pagesizedata = 500;
        } else {
            pagesizedata = 200;
        }
        //Next Hearing range filter
        var NextHearingfromd = $("#Nexthearingfrmdate").val();
        var NextHearingtod = $("#NexthearingdateTo").val();
        var casedetailsfilter = $("#casedetailsfilter").val();
        var Court_Status = $("#courtstatusfilter").val();

        var urls = "/" + fcode + "/Firm/ExportoPDFSebiNewCases";
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
                "searchdisposeoption": EncodeText(serhdisposeoptions), "casefilterCaseDetails": EncodeText(casefilterCaseDetails1),
                "casefiltermtrno": EncodeText(casefiltermtrno1), "casefilterInternalno": EncodeText(casefilterInternalno1),
                "casefiltercnrno": EncodeText(casefiltercnrno1), "NextHearingfromd": EncodeText(NextHearingfromd),
                "NextHearingtod": EncodeText(NextHearingtod), "casedetailsfilter": EncodeText(casedetailsfilter),
                "Court_Status": EncodeText(Court_Status)
            }
        });

        //window.location = encodeURI("/firm/ExportoPDFNewCases?pagenum=" + pagenum + "&pagesize=" + pagesizedata + "&esearchdata=" + esearchdata +
        //    "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient +
        //    "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby + "&esearchdatanotes=" + esearchdatanotes +
        //    "&ecasefiltercompanyname=" + ecasefiltercompanyname + "&ecasefiltermattertype=" + ecasefiltermattertype +
        //    "&ecasefiltersubjecttype=" + ecasefiltersubjecttype + "&ecasefiltercourtname=" + ecasefiltercourtname +
        //    "&ecasefilterdateto=" + ecasefilterdateto + "&ecasefFilingdate=" + ecasefFilingdate +
        //    "&ecasefFilingdateto=" + ecasefFilingdateto + "&searchcustomcolname=" + fieldnamecust + "&searchcustomcolvalue=" + fieldvaluecust +
        //    "&searchdisposeoption=" + serhdisposeoptions, "&casefilterCaseDetails=" + casefilterCaseDetails1 + "&casefiltermtrno=" + casefiltermtrno1,
        //    "&casefilterInternalno=" + casefilterInternalno1 + "&casefiltercnrno=" + casefiltercnrno1 + "&NextHearingfromd=" + NextHearingfromd +
        //    "&NextHearingtod=" + NextHearingtod + "&casedetailsfilter=" + casedetailsfilter + "&Court_Status=" + Court_Status
        //);
    })
    $(document).on("click", "#transferpagecase", function () {
        var transferid = $(this).attr("sno");
        var IsRevenueCourt = $(this).attr("IsRevenueCourt");
        var IsReraCourt = $(this).attr("IsReraCourt");
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "IsRevenueCourt": IsRevenueCourt, "IsRera": IsReraCourt }
        });
    });
    var loadflag = true;
    $(document).on("click", "#unlinkcase", function () {
        var result = confirm("Are you sure to remove matter live update?");
        if (result) {
            openload();
            var formdata = new FormData();
            var token = $(this).attr("data-id");
            formdata.append("caseid", EncodeText(token));
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
        selectedID = [];
        var caseids = $(this).attr("id-val");
        deletemattersingle();
        function deletemattersingle() {
            var result = confirm("Are you sure you want archive the matter?");
            if (result) {
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
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: 'Matter archived successfully',
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
                                    text: ' You are not Authotized to archive this Matter !',
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
    //start Cfield history
    var cfloadflag = true;
    var cfpageindex = 1, cfpagesize = 10, cfrecordcount = 0, cftotrecord = 0;
    function bindCFHistoryversion() {
        $("#cfversion").empty();
        var html1 = '<option value="">Select</option>';
        var formData = new FormData();
        formData.append("ModuleType", EncodeText(type));
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

    /*Get custom field list by page number*/
    $(document).on('click', '#cfpgetdatabypagenum', function () {
        ppageindex = $("#cfppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#cfpsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadflag = true;
                    loadCfieldList(ppageindex);
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
    /*Custom field history*/
    var countcustomfieldCF = 0;
    var defaultcolumncount = 5;
    function cfhistorydata() {
        $('#cfheadrow').empty();
        $("#cfod").empty();
        var q1 = 2;
        var columnvalue = 0;
        var sort = 0;
        var vdate = $("#cfversion").val();
        var formData = new FormData();
        formData.append("VersionDate", EncodeText(vdate));
        formData.append("ModuleType", EncodeText(type));
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

    /*Load custom field history*/
    function loadCfieldList(cfpageindex) {
        $("#cfbindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        var vdate = $("#cfversion").val();
        formdata.append("pagenum", EncodeText(cfpageindex));
        formdata.append("pagesize", EncodeText(cfpagesize));
        formdata.append("VersionDate", EncodeText(vdate));
        formdata.append("ModuleType", EncodeText(type));
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
    //end CField history
    $(document).on("click", "#deletecasesingle", function () {
        var caseids = $(this).attr("id-val");
        var isdelete = $(this).attr("is-delete");
        $("#deletecasesinglefinal").attr("id-val", caseids).attr("is-delete", isdelete);
        if (isdelete == "1") {
            $("#deletecasesinglefinal").click();
        }
        else {
            $("#myModalmarkdelete").modal();
        }
    });
    $(document).on("click", "#deletecasesinglefinal", function () {
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
                var result = confirm("Are you sure you want to unmark the matter from deletion list?");
                if (result) {
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
                                    $("#myModalmarkdelete").modal("hide");
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
        }
        else {
            deletemattersingle();
            function deletemattersingle() {
                var result = confirm("Are you sure you want to mark the matter for deletion?");
                if (result) {
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
                                    $("#myModalmarkdelete").modal("hide");
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
                }
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
                formdata.append("tablekey", EncodeText("case"));
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
        isRenderPage = false;
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
    //Next Hearing Range Filter
    $("#searchdatasNexthearingdate").click(function () {
        var fromd = $("#Nexthearingfrmdate").val();
        var tod = $("#NexthearingdateTo").val();

        if (fromd == "") {
            alert("Please select filter from Next Hearing date");
            $("#Nexthearingfrmdate").focus();
            return false;
        }
        if (tod == "") {
            alert("Please select filter to Next Hearing date");
            $("#NexthearingdateTo").focus();
            return false;
        }
        isRenderPage = false;
        loadflag = true;
        loadcontactlist(1, "", "");
        $("#Nexthearingcleardate").css("display", "block");

    });

    //Clear Next Hearing date filter
    $("#Nexthearingcleardate").click(function () {
        $("#Nexthearingfrmdate").val("");
        $("#NexthearingdateTo").val("");
        $("#Nexthearingcleardate").css("display", "none");
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");
    })
    //Court status Filter
    $("#courtstatusfilter").change(function () {
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1, "", "");

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
        isRenderPage = false;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchcase").click(function () {
        $("#casefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        loadflag = true;
        isRenderPage = false;
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
    /*case filter notes*/
    $(document).on('keyup', '#casefilternotes', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                loadcontactlist(1);
                chksflag = false;
            }
        }
    });
    $("#searchdatascourtname").click(function () {
        var casefiltercourtname = $("#casefiltercourtname").val();
        if (casefiltercourtname == "") {
            alert("Please enter the Court name.");
            $("#casefiltercourtname").focus();
            return false;
        }
        $("#clearnewsearchcourtname").css("display", "unset")
        isRenderPage = false;
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    /*Get case filter court name*/
    $(document).on('keyup', '#casefiltercourtname', function () {
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
    $("#searchdatas").click(function () {
        var casefiltercasename = $("#casefiltercasename").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#casefiltercasename").focus();
            return false;
        }
        $("#clearnewsearchcase").css("display", "unset")
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
        isRenderPage = false;
    });
    $(document).on('keyup', '#casefiltercasename', function () {
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
    $("#clearnewsearchcompany").click(function () {
        $("#companynamefilter").val("");
        $("#clearnewsearchcompany").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchmattertype").click(function () {
        $("#MatterTypefilter").val("");
        $("#clearnewsearchmattertype").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    $("#clearnewsearchsubjecttype").click(function () {
        $("#SubjectTypefilter").val("");
        $("#clearnewsearchsubjecttype").css("display", "none");
        loadflag = true;
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
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    //Add Matter Typefilter
    $("#MatterTypefilter").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });

    //Add Subject Type filter
    $("#SubjectTypefilter").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    /*Load contact list*/
    $("#casefilterdisposeoption").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    //Add case details filter
    $("#casedetailsfilter").change(function () {
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
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchCaseDetails").click(function () {
        $("#casefilterCaseDetails").val("");
        $("#clearnewsearchCaseDetails").css("display", "none");
        loadflag = true;
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
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchInternalno").click(function () {
        $("#casefilterInternalno").val("");
        $("#clearnewsearchInternalno").css("display", "none");
        loadflag = true;
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
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchcnrno").click(function () {
        $("#casefiltercnrno").val("");
        $("#clearnewsearchcnrno").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    })
    //End Section 
    /*Company name filter on key up*/
    $(document).on('keyup', '#companynamefilter', function () {
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
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }

    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
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
    $(document).on('click', '#ppaginate', function () {
        /* your code here */
        ppageindex = $(this).attr("index");
        loadflag = true;
        loadcontactlist(ppageindex, "", "");
    });
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /*Load custom field details*/
    var countcustomfoeld = 0;
    function ploadtabledata() {
        var $table = '';
        var $header = '';
        var $head1 = '';
        var dt = '';
        var q1 = 2;
        var columnvalue = 0;
        var Iscustomflag = 0;
        var sort = 18;
        openload();
        var rt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployees1',
            headers: {
                'configurationtype': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    var $header = "";
                    var option = "";
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        Iscustomflag = Iscustomflag + 1;
                        columnvalue = columnvalue + 1;
                        sort = sort + 1;
                        //start coding for custom header search
                        $header += '<th  class="Class' + q1 + '"><div class="thbg"><div style="float:left;width:80%"><input class="" id=customfieldsfilter' + q1 + ' type="text" placeholder="' + val.FieldName + '"  name="Class' + q1 + '" ></div><div style="float:left;width:20%"><span class="glyphicon glyphicon-search" idname="col' + Iscustomflag + '"  seq=' + q1 + ' idvals="' + val.FieldName + '" id="searchcustomfilters" style="margin:5px 0 0 -14px;float:right"></span><span idsss1=' + q1 + ' id="clearcustomfilters" class="clscustomfilters' + q1 + '" style="display:none;font-size:15px;color:black:font-weight:350;cursor:pointer;">x</span></div></div></th>';
                        //End
                        option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                    });
                    $header += '<th class="actioncase"><div class="thbg"><p style="width:130px;">Action</p></div></th>';
                    $('#headrow').append($header);
                    $("#od").append(option);
                    SortData();
                    var option2 = '<li><a style="cursor:pointer;color:#069;" id="btn_more" href="/' + fcode + '/Firm/caselist" class="dropdown-item btn_more">more </p></li>';
                    $("#od").append(option2);
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
            console.log(new Date().toLocaleTimeString())
            loadcontactlist(pageindex, "", "");
        });
    }
    function Custommore(valcol1, qty) {
        var htmlNew = "";
        if (valcol1.length > 60) {
            htmlNew += '<span class="comment more" style="">' + valcol1.substring(0, 60) + '</span>'
            htmlNew += '<span data-toggle="collapse" data-target="#dtn2' + qty + '" style="color:black;cursor:pointer"> more</span>'
            htmlNew += ' <div id="dtn2' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
            htmlNew += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn2' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
            htmlNew += '' + valcol1 + ''
            htmlNew += '</div>'
        }
        else {
            htmlNew += valcol1;
        }
        return htmlNew;
    }

    /*Load contact details*/
    var tatalRecordCount = 1;
    function loadcontactlist(pageindex, searchcolnaame, searchcolvalue) {
        $("#bindcasedata").empty();

        var fcode = localStorage.getItem("FirmCode");
        var SubjectTypefilter = $('#SubjectTypefilter').val();
        if (SubjectTypefilter == null) {
            SubjectTypefilter = "";
        }
        //Add Case Details New Filter 
        var casedetailsfilter = $("#casedetailsfilter").val();
        //Add Next Hearing New Filter 
        var NextHearingfromd = $("#Nexthearingfrmdate").val();
        var NextHearingtod = $("#NexthearingdateTo").val();
        var CourtStatusfiletr = $("#courtstatusfilter").val();
        var formdata = new FormData();

        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($('#searchdata').val()));
        formdata.append("odate", EncodeText($('#casefilterdate').val()));
        formdata.append("casename", EncodeText($('#casefiltercasename').val()));
        formdata.append("clientname", EncodeText($('#casefilterclient').val()));
        formdata.append("court", EncodeText($('#casefiltercourt').val()));
        formdata.append("cstatus", EncodeText($('#casefilterstatus').val()));
        formdata.append("users", EncodeText($('#filtercaseusermatter').val()));
        formdata.append("createdby", EncodeText($('#casefilterCreatedBy').val()));
        formdata.append("companyfilter", EncodeText($('#companynamefilter').val()));
        formdata.append("mattertypefilter", EncodeText($('#MatterTypefilter').val()));
        formdata.append("subjecttypefilter", EncodeText(SubjectTypefilter));
        formdata.append("casefilternotes", EncodeText($('#casefilternotes').val()));
        formdata.append("casefiltercourtname", EncodeText($('#casefiltercourtname').val()));
        formdata.append("odateto", EncodeText($('#casefilterdateTo').val()));

        formdata.append("fillingdate", EncodeText($('#caseFilingdate').val()));
        formdata.append("fillingdateto", EncodeText($('#caseFilingdateTo').val()));

        //Add for custom filter search
        formdata.append("searchcustomcolname", EncodeText(searchcolnaame));
        formdata.append("searchcustomcolvalue", EncodeText(searchcolvalue));
        formdata.append("casedisposefilter", EncodeText($('#casefilterdisposeoption').val()));
        formdata.append("casefilterCaseDetails", EncodeText($('#casefilterCaseDetails').val()));
        formdata.append("casefiltermtrno", EncodeText($('#casefiltermtrno').val()));
        formdata.append("casefilterInternalno", EncodeText($('#casefilterInternalno').val()));
        formdata.append("casefiltercnrno", EncodeText($('#casefiltercnrno').val()));

        //Add Next Hearing Range Filter
        formdata.append("NextHearingfromd", EncodeText(NextHearingfromd));
        formdata.append("NextHearingtod", EncodeText(NextHearingtod));
        formdata.append("CourtStatusfiletr", EncodeText(CourtStatusfiletr));
        formdata.append("casedetailsfilter", EncodeText(casedetailsfilter));
        var ajaxTime = new Date().getTime();
        if (loadisActivate == 0) {
            openload();
        }
        else {
            //openload();
        }

        var ld12 = $.ajax({
            async: true,
            url: '/api/MatterApi/LoadSebiNewCaseList',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var qty = 0;
                $("#exportrecords").val(0);
                console.log("sdf" + new Date().toLocaleTimeString())
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#casetfooter").html("");
                $("#tokens").html("");

                if (response.Data != "") {

                    var datas = JSON.stringify(response);
                    //alert(datas);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }
                if (response.Data.length > 2) {
                    //$("#pdatastatus").html("");
                    $("#pdatastatus").hide();
                    $('#mtrPagination').show();
                }

                else {
                    if (response.Data == "[]" || response.Data == "" || response.Data == "null" || response.Data == null) {
                        //$("#pdatastatus").append("No Records found.");
                        $("#pdatastatus").show();
                        $('#mtrPagination').hide();
                        closeload();
                        return false;
                    }


                }
                var qty = 0;
                var qty123 = 0;

                var it = 2;

                var firstvalue = 0;

                if (loadflag == true) {
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
                                //pnext = parseInt(pnext) + 1;
                                //if (pnext == 0) pnext = 1;

                                //pprev = parseInt(pageno) - 1;
                                //if (pprev == 0) pprev = 1;
                                //totpage = parseInt(totdata) / parseInt(pagesize);

                                //if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                //    totpage = parseInt(totpage) + 1;
                                //}

                                //$("#pagnumvalue").attr("max", totpage);

                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#next').hide();
                                    //$('#next').css("display", "none");
                                    $('#prev').css("display", "block"); s
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
                                    tatalRecordCount = totpage;
                                    renderPagination(pageindex, totpage);
                                }
                            }

                            var tfot = '';
                            $("#CcaseCount").text("(" + val.totRow + ")");
                            $("#exportrecords").val(val.totRow);
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'

                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                            //if (val.totRow <= length) {

                            //}
                            //else if (pageno == 1) {

                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#casetfooter").append(tfot);
                        }

                        $("#pgetdatabypagenum").attr("pageindex", pageindex);
                        qty = qty + 1;
                        qty123 = qty123 + 1;
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
                        $row.append($('<td class="casecasename" />').html("<a name=" + val.mname + "  title='View Matter Dashboard' id='transferpage' href='javascript:void()' sno=" + val.Id + "><span style='font-size:12px;'>" + (val.mname != null ? val.mname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
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
                        $row.append($('<td class="MatterType" />').html("<span>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casecreatedby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseteammembers">').html('<span onclick=viewcontent("' + val.Id + '","' + qty123 + '") data-toggle="collapse" Id_val="' + val.Id + '" data-target="#dtn' + qty123 + '" style="color:blue;cursor:pointer"> more</span><div id="dtn' + qty123 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 281px;position: inherit;border-radius: 10px;left:65%;height:71px;"><button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty123 + '" style="padding-top:-34px;margin-top:-5px;">×</button><span Id="binddataalert_' + qty123 + '"></span></div></td>'));
                        var FinalUserCaseid = "";
                        if (val.UserCaseid == "null" || val.UserCaseid == null || val.UserCaseid == "0") {
                            FinalUserCaseid = "";
                        }
                        else {
                            FinalUserCaseid = val.UserCaseid;
                        }
                        var htmllnk = "";
                        if (FinalUserCaseid != "" && String(val.CNRCase) == "" && dashcw == "display:unset" && IsCWActive == "1") {
                            if (val.IsRevenueCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span id='chcr" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            else if (val.IsReraCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsReraCourt=" + val.IsReraCourt + " sno = " + val.UserCaseid + " > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                }
                                else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsReraCourt=" + val.IsReraCourt + " sno = " + val.UserCaseid + " > <span id='chcrera" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            else {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span id='chc" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            if (val.iCaseNotFound >= 1) {
                                htmllnk += "<a class='" + btnclass + "' style='color: black;' title='Case not found. Please re-add the case with correct details.' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            }
                            else {
                                htmllnk += "&nbsp;|<a class='" + btnclass + "' style='color: black;' title='Remove case for live update' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            }

                            $row.append($('<td class="casecasedetails" />').html(htmllnk));
                        }
                        else if (FinalUserCaseid != "" && String(val.CNRCase) != "" && dashcw == "display:unset" && IsCWActive == "1") {

                            if (val.IsRevenueCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span  class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span id='chcr" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            else {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                }
                                else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span id='chc" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            if (val.iCaseNotFound >= 1) {
                                htmllnk += "<a style='color:black' class='" + btnclass + "' style='color: black;' title='Case not found. Please re-add the case with correct details.' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            }
                            else {
                                htmllnk += "&nbsp;|<a style='color:black' class='" + btnclass + "' style='color: black;' title='Remove CNR case for live update' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            }
                            $row.append($('<td class="casecasedetails" />').html(htmllnk));
                        }
                        else {
                            $row.append($('<td class="casecasedetails" />').html("&nbsp;"));
                        }
                        if (val.CaseNextHearing != null && dashcw == "display:unset" && IsCWActive == "1" && val.CaseNextHearing != "") {
                            if (val.IsRevenueCourt == "1") {
                                $row.append($('<td class="nexthearing" />').html("<span id='nhr" + val.CaseNextHearing + "'>" + val.CaseNextHearing + "</span>"));
                            }
                            else if (val.IsReraCourt == "1") {
                                $row.append($('<td class="nexthearing" />').html("<span id='nhrera" + val.CaseNextHearing + "'>" + val.CaseNextHearing + "</span>"));
                            }
                            else {
                                $row.append($('<td class="nexthearing" />').html("<span id='nh" + val.CaseNextHearing + "'>" + val.CaseNextHearing + "</span>"));
                            }
                        }
                        else {
                            $row.append($('<td class="nexthearing" />').html(""));
                        }


                        $row.append($('<td class="caseeditdate"  />').html("<span name='" + val.LastModifyDate + "'> " + (val.LastModifyDate != null ? formatDatetoIST(val.LastModifyDate) : '<span style="visibility: hidden;">&nbsp;</span>')));


                        if (val.IsCompanyAdmin == "1") {
                            $row.append($('<td class="caseclientname" />').html("<span id='transferpagetocase' href='javascript:void()' data-id=" + val.CompanyID + " style='cursor:pointer;color:black;'>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                        }
                        else {
                            $row.append($('<td class="caseclientname" />').html("<span name=" + ClientName + "  id='transferpagetocase' href='javascript:void()' data-id=" + val.matterclientid + " style='cursor:pointer;color:black;'>" + (ClientName != null ? ClientName : '<span style="">&nbsp;</span>')));
                        }

                        $row.append($('<td class="casecourtname" />').html("<span>" + (val.CourtName != null ? val.CourtName : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseothercourtname" />').html("<span>" + (val.OtherCourtName != null ? val.OtherCourtName : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casestatus" />').html("<span>" + (val.cstatus != null ? val.cstatus : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="courtstatus" />').html("<span>" + (val.Court_Status != null ? val.Court_Status : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="disposeddate" />').html("<span>" + (val.Disposeddate != null ? val.Disposeddate : '<span style="">&nbsp;</span>')));
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
                                html3 += '<span data-toggle="collapse" data-target="#dtn' + qty + '" style="color:black;cursor:pointer"> more</span>'
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
                        $row.append($('<td class="CaseType"  />').html("<span name='" + val.CaseType + "'> " + (val.CaseType != null ? val.CaseType : '<span style="visibility: hidden;">&nbsp;</span>')));
                        var html31 = '';
                        if (val.CaseDetails == "" || val.CaseDetails == null || val.CaseDetails == "null") {
                            html31 += '&nbsp;'
                        }
                        else {
                            if (val.CaseDetails.length > 60) {
                                html31 += '<span class="comment more" style="">' + val.CaseDetails.substring(0, 60) + '</span>'
                                html31 += '<span data-toggle="collapse" data-target="#dt' + qty + '" style="color:black;cursor:pointer"> more</span>'
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
                                    var htmlNew = Custommore(val.col10, qty + 'a' + str);
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

                        var html4 = '';




                        //if (val.odelete == 1 && val.oedit == 1 && roleids == 1) {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp;";


                        //    }
                        //    else {

                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp;";


                        //    }

                        //}

                        //else if (val.oedit == 1 && val.odelete == 1) {

                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp; ";

                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp;";

                        //    }

                        //}
                        //else if (val.oedit == 1) {
                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp;";

                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp;";

                        //    }
                        //}
                        //else if (val.odelete == 1) {

                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;|&nbsp;";

                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;";

                        //    }

                        //}
                        //else {

                        //    if (val.LimitationCount == 0) {
                        //        html4 += "<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp; ";

                        //    }
                        //    else {
                        //        html4 += "<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;";

                        //    }

                        //}

                        //if (FinalUserCaseid != "" && dashcw == "display:unset" && IsCWActive == "1") {
                        //    html4 += "<span class='fa fa-user-plus' cwid='" + FinalUserCaseid + "'  matterid='" + val.Id + "' mmnanevalus='" + val.mname + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert'></span>&nbsp;|&nbsp;";
                        //}

                        //if (sebiPermissionView > 0) {
                        //    html4 += "<span class='glyphicon glyphicon-pencil' style='color:black; cursor:pointer;' title='Edit Sebi matter Details' cwid='" + FinalUserCaseid + "' matterid='" + val.Id + "' mmnamevalus='" + val.mname + "' id='SebiUpdate' data-toggle='modal' data-target='#SebiUpdateMatterModal'></span>&nbsp;";
                        //}
                        //if (val.MatterType == "Litigation" && (val.UserCaseid == null || val.UserCaseid == "" || val.UserCaseid == "0")) {
                        //    html4 += "<span class='glyphicon glyphicon-share' title='Track case in court' style='cursor:pointer;margin-left:5px; color:black'; sno='" + val.mname + "'  id-val='" + val.Id + "' id='addliveupdatemanually'></span>";
                        //}
                        //else {

                        //}

                        ////For Add Email Notes
                        //if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                        //    html4 += "<span class=''  title='Click here to insert/view notes.' id='OpenEmailNotesModal' data-caseid='" + val.MasterCaseId + "'  data-usercaseid='" + val.UserCaseid + "'><img style='padding: 0 0 0 3px;cursor: pointer;' src='/newassets/images/notes-icon.png' /></span>";
                        //}
                        ////For TASL 
                        //if (TASLFirmId.toLowerCase() == FirmIdss.toLowerCase()) {
                        //    if (val.IsCalculator != "" && val.IsCalculator != "0" && val.IsCalculator != null) {

                        //        html4 += "<span class='glyphicon glyphicon-plus'  title='Update the Valuation' id='UpdateCalculator' data-caseid='" + val.Id + "' data-id='" + val.IsCalculator + "' style='cursor:pointer;margin-left:5px; color:green';></span>";
                        //    } else {
                        //        //    html4 += "<span class='glyphicon glyphicon-plus'  title='Calculate the Valuation' id='AddCalculator' data-caseid='" + val.Id + "' style='cursor:pointer;margin-left:5px; color:black';></span>";
                        //    }
                        //}
                        //Above code commented
                        var html4 = '';
                     
                            //For Edit Matter Action
                            if (val.oedit == 1) {
                                html4 += '<ul class="action-ul"><li><span title="Edit Matter" name="' + val.mname + '"  id="transferEditpage" href="javascript: void ()" sno="' + val.Id + '"><img src="/newassets/img/edit-icon.png" height="28" width="28"></span>';
                            }
                            //For Add User Live Update
                            if (FinalUserCaseid != "" && dashcw == "display:unset" && IsCWActive == "1") {
                                html4 += "<li><span cwid='" + FinalUserCaseid + "'  matterid='" + val.Id + "' mmnanevalus='" + val.mname + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert'><img src='/newassets/img/add-user.png' height='28' width='28'></span></li>";
                            }
                            html4 += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="28" width="28"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                            //For Delete Matter Action
                            if (val.odelete == 1) {
                                html4 += "<li><div id='deletecasesingle' title='Mark Matter For Deletion' Idmnae='" + val.mname + "' Idss='" + val.mtrno + "' is-delete=" + val.IsDelete + " id-val=" + val.Id + "><span><img src='/newassets/img/deletematter.png'></span>Delete Matter</div></li>";
                            }
                            //For Archive Matter Action
                            html4 += "<li><div id='ArchiveMatterSingle' title='Archive Matter' Idmnae='" + val.mname + "' id-val=" + val.Id + "><span><img src='/newassets/img/archivematter.png'></span>Archive Matter</div></li>"
                            //View Limitations Action
                            //if (val.LimitationCount == 0) {
                            //    html4 += "<li><div style='cursor:pointer;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'><span><img src='/newassets/img/statueoflimitation.png'></span>Statue of Limitation</div></li>";
                            //}
                            //else {
                            //    html4 += "<li><div style='cursor:pointer; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'><span><img src='/newassets/img/statueoflimitation.png'></span>Statue of Limitation</div></li>";
                            //}
                            //For Matter Live Update
                        if (val.MatterType == "Litigation" && (val.UserCaseid == null || val.UserCaseid == "" || val.UserCaseid == "0")) {
                                html4 += "<li><div  title='Track case in court' style='cursor:pointer;' sno='" + val.mname + "'  id-val='" + val.Id + "' id='addliveupdatemanually'><span><img src='/newassets/img/livetracking.png'></span>Add Live Tracking</div></li>";
                            }
                            else {
                                if (val.MatterType == "Litigation") {
                                    if (val.iCaseNotFound >= 1) {
                                        html4 += "<li><div title='Case not found. Please re-add the case with correct details.' id = 'unlinkcase' href = 'javascript:void()' matterName='" + val.mname + "' data-id = " + val.Id + " > <span style='display:none'  align='center'> " + usercaseid + " </span><span><img src='/newassets/img/livetracking.png'></span>Remove Live Tracking</div></li>";
                                    }
                                    else {
                                        html4 += "<li><div title='Remove case for live update' id = 'unlinkcase' href = 'javascript:void()' matterName='" + val.mname + "' data-id = " + val.Id + " > <span style='display:none' align='center'> " + usercaseid + " </span><span><img src='/newassets/img/livetracking.png'></span>Remove Live Tracking</div></li>";
                                    }
                                }
                            }
                            //For Add Email Notes
                            if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                html4 += "<li><div  title='Click here to insert/view notes.' id='OpenEmailNotesModal' data-caseid='" + val.MasterCaseId + "'  data-usercaseid='" + val.UserCaseid + "'><span><img src='/newassets/img/addnotes.png'></span>Add Notes</div></li>";
                            }
                            //For View Latest Order
                            //if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                            //    html4 += "<li><div  id='openorders' style='cursor:pointer;' title='View latest order'  id-val=" + val.MasterCaseId + "><span><img src='/newassets/img/orders-icon.png'></span>Latest Order</div></li>";
                            //}
                            //For Linked Case View Options
                            if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                if (val.FIRNo >= "1") {
                                    html4 += "<li><div style='cursor:pointer;'  title='View Parent case detail' id='OpenLinkedCaseModal' data-caseid='" + val.MasterCaseId + "'  data-usercaseid='" + val.UserCaseid + "'><span><img src='/newassets/img/connect-icon.png'></span>Parent case detail</div></li>";
                                }
                            }
                            if (sebiPermissionView > 0) {
                                html4 += '<li><span title="Edit Sebi matter Details" cwid="' + FinalUserCaseid + '" matterid="' + val.Id + '" mmnamevalus="' + val.mname + '" id="SebiUpdate" data-toggle="modal" data-target="#SebiUpdateMatterModal"><img src="/newassets/img/editmatter.png">&nbsp;&nbsp;&nbsp;Edit Sebi Matter</span>';
                            }
                            html4 += "</ul></div></li></ul>";
                        

                        $row.append($('<td class="actioncase"/>').html(html4));

                        $("#bindcasedata").append($row);
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
            //alert(ChoiceField);
            if (ChoiceField == 0) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                    if ($(this).attr("name") == "casestatus" || $(this).attr("name") == "linkedcase" || $(this).attr("name") == "notes" || $(this).attr("name") == "caseeditdate"
                        || $(this).attr("name") == "casestartdate" || $(this).attr("name") == "casecasename" || $(this).attr("name") == "companyname" || $(this).attr("name") == "casecreatedby"
                        || $(this).attr("name") == "caseteammembers" || $(this).attr("name") == "caseclientcontact" || $(this).attr("name") == "companyname" || $(this).attr("name") == "casecreatedby" || $(this).attr("name") == "NextHearing") {

                    }

                    else {


                        $(this).closest('li').hide();


                    }
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
                        if (a.CourtType == "RERA") {

                            $("#nhrera" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                            if (parseInt(a.CaseId) > 0) {
                                $("#chcrera" + a.iid).css("background", "#52e652");
                            }
                            else {
                                $("#chcrera" + a.iid).css("background", "#d97a7a");
                            }
                        }
                        else {
                            $("#nh" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                            if (parseInt(a.CaseId) > 0) {
                                $("#chc" + a.iid).css("background", "#52e652");
                            }
                            else {
                                $("#chc" + a.iid).css("background", "#d97a7a");
                            }
                        }

                    });
                }
                catch (er) {

                }

                try {
                    var obj = JSON.parse(NexthearingaryRevenue);
                    $.each(obj.data, function (i, a) {


                        var SetDate = a.NexthearingDate;

                        $("#nhr" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                        if (parseInt(a.CaseId) > 0) {
                            $("#chcr" + a.iid).css("background", "#52e652");
                        }
                        else {
                            $("#chcr" + a.iid).css("background", "#d97a7a");
                        }

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
                    // $(".casecasedetails1,.casecasedetails2,.casecasedetails3").show();
                }
                else {
                    //$(".casecasedetails1,.casecasedetails2,.casecasedetails3").hide();
                    $('#NextHearing').attr('checked', false);
                    $('.NextHearing').hide();

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
                                        arrcolmenuselecitonfix.push(a.ColumnValue);
                                    }
                                    else {

                                    }
                                }
                                else {
                                    arrcolmenuseleciton.push(a.ColumnValue);
                                    arrcolmenuselecitonfix.push(a.ColumnValue);
                                }


                            });
                            firstload = false;
                        }

                        for (i = 0; i < arrcolmenuseleciton.length; i++) {
                            $("table ." + arrcolmenuseleciton[i]).show();


                            $("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);



                        }

                        $("input:checkbox:not(:checked)").each(function () {
                            if (arrcolmenuselecitonfix.indexOf($(this).attr("name")) !== -1) {
                            }
                            else {
                                $(this).closest('li').hide();
                            }

                        });
                        $(".actioncase").show();

                        closeload();

                        //End of foreach Loop
                        //console.log(response);
                    }, //End of AJAX Success function

                    failure: function (response) {
                        closeload();
                    }, //End of AJAX failure function
                    error: function (response) {
                        closeload();
                    } //End of AJAX error function

                });
                try {
                    var obj = JSON.parse(Nexthearingary);
                    $.each(obj.data, function (i, a) {

                        var SetDate = a.NexthearingDate;

                        if (a.CourtType == "RERA") {

                            $("#nhrera" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                            if (parseInt(a.CaseId) > 0) {
                                $("#chcrera" + a.iid).css("background", "#52e652");
                            }
                            else {
                                $("#chcrera" + a.iid).css("background", "#d97a7a");
                            }
                        }
                        else {
                            $("#nh" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                            if (parseInt(a.CaseId) > 0) {
                                $("#chc" + a.iid).css("background", "#52e652");
                            }
                            else {
                                $("#chc" + a.iid).css("background", "#d97a7a");
                            }
                        }

                    });
                }
                catch (er) {

                }

                try {
                    var obj = JSON.parse(NexthearingaryRevenue);
                    $.each(obj.data, function (i, a) {

                        var SetDate = a.NexthearingDate;

                        $("#nhr" + a.iid).text((SetDate == null ? "" : formatDatetoIST(SetDate)));
                        if (parseInt(a.CaseId) > 0) {
                            $("#chcr" + a.iid).css("background", "#52e652");
                        }
                        else {
                            $("#chcr" + a.iid).css("background", "#d97a7a");
                        }

                    });
                }
                catch (er) {

                }



            }
            closeload();
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

        if (goToPage > tatalRecordCount) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        isRenderPage = true;
        loadcontactlist(setPageNo, "", "");
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    bindCommonDropdown("SubjectTypefilter", "Case_Type", "Subject Type");
    bindCommonDropdown("casefilterstatus", "Case_Status", 'Internal Status');
    bindCommonDropdown("casefilterdisposeoption", "Disposed_Option", "Outcome");

    /*Load common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
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
                        html1 += '<option value="' + a.Name + '" >  ' + a.Name + '</option>';
                        $("#" + controlname).html(html1);
                    }); //End of foreach Loop
                }
                else {
                    $.each(response.Data, function (i, a) {
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
    $(document).on('click', '#opencasewatchusermodal', function () {
        casewatchcaseid = $(this).attr("cwid");
        mkMatterId = $(this).attr("matterid");
        matternamevalus = $(this).attr("mmnanevalus");
        loaduserbycaseid();
        LoadCasewatchAlertUsers();
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
    /*Load casewatch user alert*/
    function LoadCasewatchAlertUsers() {
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
                    htmls += ' <tr><td>' + q1 + '</td><td>' + a["vDispName"] + '</td><td>' + a["email_id"] + '</td><td>' + a["mobile_No"] + '</td><td><span class="glyphicon glyphicon-trash" id="deleteCasewatchuseralert" data-id="' + a.Usercseid + '" data-user="' + a.User_Id + '" style="color:red;cursor:pointer;" title="Remove user from case alert"></span></td></tr>';
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


    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });
    $("#DefaultColumnSelectionOpen").click(function () {
        $('#myModalCustomizedcolumn').modal('hide');
        var url = "/firm/ColumnSelection";
        $('.mymodelscolumnselection').load(url, function (result) {
            $('#myModalcolumn').modal({ show: true });
        });
    })

    //$("#ColumnSelectionopen").click(function () {
    //    var fcode = localStorage.getItem("FirmCode");
    //    var url = "/" + fcode + "/firm/ColumnSelection";
    //    $('.mymodelscolumnselection').load(url, function (result) {
    //        $('#myModalcolumn').modal({ show: true });
    //    });
    //});
    //custom fields search
    $(document).on('click', '#searchcustomfilters', function () {
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
    //Add live update manually
    //$(document).on('click', '#addliveupdatemanually', function () {
    //    var matternamr = $(this).attr("sno");
    //    var matterId = $(this).attr("id-val");
    //    $("#mattersforlink21").val('');
    //    $("#livecaseidhide1").val('');
    //    openload();
    //    var url = "/" + fcode + "/CW/AddLiveUpdateManuallyCase";
    //    $('.LiveUpdateManuallybodyFormatter').load(url, function (result) {
    //        closeload();
    //        $("#mattersforlink21").val(matternamr);
    //        $("#livecaseidhide1").val(matterId);
    //        $("#addtaskmemberhide").hide();
    //        $("#myModalLiveUpdateManuallyFormatter").modal({ show: true });
    //    });
    //});
    $(document).on('click', '#addliveupdatemanually', function () {
        var matternamr = $(this).attr("sno");
        var matterId = $(this).attr("id-val");

        // Create a hidden form dynamically to send data
        var form = $('<form method="POST" action="/' + fcode + '/CW/LitigationAddLiveUpdate"></form>');
        form.append('<input type="hidden" name="matterId" value="' + encodeURIComponent(matterId) + '">');
        form.append('<input type="hidden" name="matterName" value="' + encodeURIComponent(matternamr) + '">');

        // Append the form to the body and submit
        $('body').append(form);
        form.submit();
    });
    //Reset custmized fields
    $("#resetcf").click(function () {
        var result = confirm("Do you want to remove the added custom fields?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/matterApi/ResetCF",
                headers: {
                    'configurationtype': type
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $("#content").html("");
                    var datas = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: 'Custom fields removed successfully. A history of custom fields can be viewed in Custom Field History section.',
                        type: 'success',
                        delay: 3000
                    });
                    closeload();
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
    //
    /*Open Email notes model*/
    var defaultcaseids = "";
    $(document).on("click", "#OpenEmailNotesModal", function () {
        var ids = $(this).attr("data-caseid");
        var caseids = $(this).attr("data-usercaseid");
        defaultcaseids = caseids;
        $("#UpdateOtherDetails").attr("data-case", caseids);
        $("#UpdateOtherDetails").attr("data", ids);
        $("#updatedusercasesid").val(ids);
        $("#OtherDetailstxt").val('');
        bindOtherDetails(ids);
        $('#myModalEmailCaseNotes').modal({ show: true });
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
                        html6 += "<td><i class='glyphicon glyphicon-trash' id='RemoveOtherDetails' data-id='" + a.Iid + "' title='Remove Details'></i>&nbsp;&nbsp;<i class='glyphicon glyphicon-pencil' id='EditOtherDetails' data-values='" + a.ActualNotes + "'  data-id='" + a.Iid + "' title='Edit Details'></i> </td>";
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
    $(document).on("click", "#RemoveOtherDetails", function () {
        var noteid = $(this).attr("data-id");
        var caseidsidss = $("#updatedusercasesid").val();
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
                        alert("Note deleted successfully");
                        bindOtherDetails(caseidsidss);
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
    /*Update Other Details*/
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
});
function viewcontent(id, flags) {
    var formdata = new FormData();
    formdata.append('Id', EncodeText(id));
    $.ajax({
        type: "POST",
        url: "/api/matterApi/GetAssignee",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#binddataalert_" + flags + "").empty();
            $("#binddataalert_" + flags + "").html(data.Data);
        },
    })
}

//For TASL CutmizeRequirements
$(document).on('click', '#AddCalculator', function () {

    var CaseId = $(this).attr("data-caseid");
    $("#inputmatterids").val(CaseId);
    $("#fnatureclaim").val('');
    $("#TASALList")[0].reset();
    $("#btnsaveMatterCalCulator").show();
    $("#btnUpdateMatterCalCulator").hide();
    $("#matterlistTASLCalculator").modal();
    //BindCLDInternalUser();
    //BindCLDExternalUser();
    //setTimeout(function () { loadMCLDAnalysis(requestforid, CaseId, CldRequestId); }, 1000);
});

//For Showing the data of Nature of
$(document).on('change', '#fnatureclaim', function () {

    var natureofclaims = $(this).val();
    if (natureofclaims == "labourmat") {
        //Nature of Labour Matter
        $("#Divlabourmatter").show();
        $("#Divcommercialmatter").hide();
        $("#TASALList")[0].reset();
        //$("#divCLaimDate").hide();
        //$("#divAgeOfClaim").hide();
        //$("#divPrinciapalclaimAmt").hide();
        //$("#divInterClaimedAMt").hide();
        //$("#divtotInterPay").hide();
        //$("#divLWDOFworkman").show();
        //$("#divNOOfMonth").show();
        //$("#divLSTCTCPERMNH").show();
        //$("#divBackwagesPaybale").show();
        //$("#divtotValua").show();
    }
    else {
        //Commercial claim
        $("#Divlabourmatter").hide();
        $("#Divcommercialmatter").show();
        $("#TASALList")[0].reset();
        //$("#divCLaimDate").show();
        //$("#divAgeOfClaim").show();
        //$("#divPrinciapalclaimAmt").show();
        //$("#divInterClaimedAMt").show();
        //$("#divtotInterPay").show();
        //$("#divLWDOFworkman").hide();
        //$("#divNOOfMonth").hide();
        //$("#divLSTCTCPERMNH").hide();
        //$("#divBackwagesPaybale").hide();
        //$("#divtotValua").hide();        
    }

    //alert(values);

});

//For Calculating the Number of month
$(document).on('change', '#datevaluation', function () {
    var fnatureclaim = $("#fnatureclaim").val();
    if (fnatureclaim == "") {
        alert("Please select nature of the claim");
        return false;
    }
    $("#NoOfMonth").val('');
    $("#lastctcmonth").val('');
    $("#backwagespaybale").val('');
    $("#Additionalvaluation").val('');
    $("#totvaluations").val('');
    var monthWithDays = "0";
    var dateofvaluation = $(this).val();
    var LWDOfWorkMan = $("#lwddate").val();
    var date1 = new Date(LWDOfWorkMan);
    var date2 = new Date(dateofvaluation);
    if (date1 != "" && date2 != "") {
        var startDateStr = date1;
        var endDateStr = date2;
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Calculate the difference in milliseconds
        const timeDifference = endDate - startDate;

        // Convert milliseconds to days and months
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

        // Calculate months and days difference
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();

        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();
        const endDay = endDate.getDate();

        let monthsDifference = (endYear - startYear) * 12 + (endMonth - startMonth);
        let remainingDays = endDay - startDay;

        // Adjust months and days difference
        if (remainingDays < 0) {
            monthsDifference--;
            remainingDays += new Date(endYear, endMonth, 0).getDate();
        }

        let remaingsdays1 = remainingDays / 30
        monthWithDays = monthsDifference + remaingsdays1;
        // monthWithDays = monthsDifference + "." + remainingDays;
        let finalmonthvalue = parseFloat(monthWithDays).toFixed(2);
        //alert(finalmonthvalue);
        //alert(monthWithDays);
        monthWithDays = finalmonthvalue;
    }
    $("#NoOfMonth").val(monthWithDays);


});

//For Calculating BackWagegs Payable
$(document).on('change', '#lastctcmonth', function () {
    $("#Additionalvaluation").val('');
    $("#totvaluations").val('');
    var Lastctcvalues = $(this).val();
    var numberofmonths = $("#NoOfMonth").val();
    var TotalBackwages = Lastctcvalues * numberofmonths;
    let totBackwages = parseFloat(TotalBackwages).toFixed(3);
    $("#backwagespaybale").val(totBackwages);

});


$(document).on('change', '#Additionalvaluation', function () {
    var addvaluation = $(this).val();
    var backwagespaybale = $("#backwagespaybale").val();
    var totalvaluatiom = parseFloat(backwagespaybale) + parseFloat(addvaluation);
    $("#totvaluations").val(totalvaluatiom);

});

//For vlauation creation of commercial matter
$(document).on('change', '#datevaluationcomee', function () {
    var valuationdate = $(this).val();
    var claimdate = $("#claimdate").val();
    var Claimdate1 = new Date(claimdate);
    var valuationdatedate2 = new Date(valuationdate);
    var monthWithDays = "0";


    if (claimdate != "" && valuationdatedate2 != "") {
        var startDateStr = claimdate;
        var endDateStr = valuationdatedate2;
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Calculate the difference in milliseconds
        const timeDifference = endDate - startDate;

        // Convert milliseconds to days and months
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

        // Calculate months and days difference
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();

        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();
        const endDay = endDate.getDate();

        let monthsDifference = (endYear - startYear) * 12 + (endMonth - startMonth);
        let remainingDays = endDay - startDay;

        // Adjust months and days difference
        if (remainingDays < 0) {
            monthsDifference--;
            remainingDays += new Date(endYear, endMonth, 0).getDate();
        }
        monthWithDays = monthsDifference + "." + remainingDays;

    }

    var Toatlyears = monthWithDays / 12;
    var ayesr = parseFloat(Toatlyears);
    var totalyeares22 = ayesr.toFixed(2);
    $("#AgeOfClaim").val(totalyeares22);

});

//For Calculating the Interset rate
$(document).on('change', '#AdditionalvaluationComm', function () {
    $("#totInterstpayable").val('');
    $("#totvaluationscomm").val('');
    var dateofvaluation = $(this).val();
    var ageofclaim = $("#AgeOfClaim").val();
    var PrinciapalAMt = $("#PrincipalCLMAmt").val();
    var Interestrate = $("#InterstCLMAmt").val();
    var totalinterset = Interestrate * PrinciapalAMt * ageofclaim;
    var totalintersetpayable = totalinterset / 100;
    var totalvaluation1 = parseFloat(PrinciapalAMt) + parseFloat(totalintersetpayable);
    var totalvaluation = parseFloat(totalvaluation1) + parseFloat(dateofvaluation);

    let totintersetpayable = parseFloat(totalintersetpayable).toFixed(3);
    let totvaluations = parseFloat(totalvaluation).toFixed(3);

    $("#totInterstpayable").val(totintersetpayable);
    $("#totvaluationscomm").val(totvaluations);

});

//Save Calculator Informations 
$(document).on('click', '#btnsaveMatterCalCulator', function () {

    var natureofclaim = $("#fnatureclaim").val();
    if (natureofclaim == "") {
        alert("Please select nature of the claim");
        return false;
    }
    var lwdofworkman = $("#lwddate").val();
    var dateofvaluationlabour = $("#datevaluation").val();
    var numberofmonth = $("#NoOfMonth").val();
    var lastctcpermonth = $("#lastctcmonth").val();

    var backwagespayable = $("#backwagespaybale").val();
    var anyaddvaluationslabour = $("#Additionalvaluation").val();
    var totalvaluationaslabour = $("#totvaluations").val();
    var claimdate = $("#claimdate").val();
    var dateofvaluationcomm = $("#datevaluationcomee").val();
    var ageofclaim = $("#AgeOfClaim").val();
    var principalclmamt = $("#PrincipalCLMAmt").val();
    var intersetclmperannum = $("#InterstCLMAmt").val();
    var anyaddvaluationscomm = $("#AdditionalvaluationComm").val();
    var totintrestpayable = $("#totInterstpayable").val();
    var totalvaluationscomm = $("#totvaluationscomm").val();
    var matterid = $("#inputmatterids").val();
    var formData = new FormData();
    if (natureofclaim == "labourmat") {
        if (lastctcpermonth == "") {
            alert("Please select last CTC per month");
            return false;
        }
        formData.append("dateofvaluation", dateofvaluationlabour);
        formData.append("anyaddvaluations", anyaddvaluationslabour);
        formData.append("totalvaluationas", totalvaluationaslabour);

    } else {
        formData.append("dateofvaluation", dateofvaluationcomm);
        formData.append("anyaddvaluations", anyaddvaluationscomm);
        formData.append("totalvaluationas", totalvaluationscomm);
    }

    formData.append("lastCTCpermonth", lastctcpermonth);
    formData.append("numberofmonth", numberofmonth);
    formData.append("natureofclaim", natureofclaim);
    formData.append("lwdofworkman", lwdofworkman);
    formData.append("backwagespayable", backwagespayable);
    formData.append("claimdate", claimdate);
    formData.append("ageofclaim", ageofclaim);
    formData.append("principalclmamt", principalclmamt);
    formData.append("intersetclmperannum", intersetclmperannum);
    formData.append("totintrestpayable", totintrestpayable);
    formData.append("matterid", matterid);
    openload();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/SaveCalCulator",
            //url: "/CW/UpdateNotesByCaseIdLitigation", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (String(response.Data) == "1") {
                    alert("Save successfully");
                    closeload();
                    loadcontactlist(pageindex, "", "");
                    $('#matterlistTASLCalculator').modal('hide');
                    //$("#matterlistTASLCalculator").
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


//Update calcultor data

$(document).on('click', '#UpdateCalculator', function () {

    var CaseId = $(this).attr("data-caseid");
    var calcluatorId = $(this).attr("data-caseid");
    $("#inputcalculatorid").val(calcluatorId);
    GetCalculatorvalue(CaseId, calcluatorId);
});

//View calculator data
function GetCalculatorvalue(CaseId, calcluatorId) {

    var formData = new FormData();
    formData.append("matterid", CaseId);
    formData.append("calcluatorId", calcluatorId);
    openload();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/CalCulatorByCaseId",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var date1 = String(response.Data);
                var data = JSON.parse(date1);
                if (data != "") {
                    $("#fnatureclaim").val(data.Natureofclm).change();
                    $("#inputmatterids").val(data.CaseId);
                    var valuationsdt = data.Valuationdate.split('T')[0];
                    if (data.Natureofclm == "labourmat") {
                        var LasrWorkingOfWorkman = data.LWDOfWorkman.split('T')[0];
                        $("#datevaluation").val(valuationsdt);
                        $("#Additionalvaluation").val(data.AdditionalValuation);
                        $("#NoOfMonth").val(data.Numberofmonth);
                        $("#lastctcmonth").val(data.LastCTCPermonth);
                        $("#lwddate").val(LasrWorkingOfWorkman);
                        $("#totvaluations").val(data.TotalValuation);
                        $("#backwagespaybale").val(data.Backwagespayable);

                    } else {
                        var Claimdatedtes = data.Claimdate.split('T')[0];
                        $("#claimdate").val(Claimdatedtes);
                        $("#datevaluationcomee").val(valuationsdt);
                        $("#AdditionalvaluationComm").val(data.AdditionalValuation);
                        $("#totvaluationscomm").val(data.TotalValuation);
                        $("#AgeOfClaim").val(data.AgeofClm);
                        $("#PrincipalCLMAmt").val(data.PrincipalCLMAmt);
                        $("#InterstCLMAmt").val(data.IntrCLMPerAnnum);
                        $("#totInterstpayable").val(data.TotalInterPayble);
                    }
                    closeload();
                    $("#btnsaveMatterCalCulator").hide();
                    $("#btnUpdateMatterCalCulator").show();
                    $('#matterlistTASLCalculator').modal('show');
                    //$("#matterlistTASLCalculator").
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

}

//Update Calculator data
$(document).on('click', '#btnUpdateMatterCalCulator', function () {

    var natureofclaim = $("#fnatureclaim").val();
    if (natureofclaim == "") {
        alert("Please select nature of the claim");
        return false;
    }
    var lwdofworkman = $("#lwddate").val();
    var dateofvaluationlabour = $("#datevaluation").val();
    var numberofmonth = $("#NoOfMonth").val();
    var lastctcpermonth = $("#lastctcmonth").val();

    var backwagespayable = $("#backwagespaybale").val();
    var anyaddvaluationslabour = $("#Additionalvaluation").val();
    var totalvaluationaslabour = $("#totvaluations").val();
    var claimdate = $("#claimdate").val();
    var dateofvaluationcomm = $("#datevaluationcomee").val();
    var ageofclaim = $("#AgeOfClaim").val();
    var principalclmamt = $("#PrincipalCLMAmt").val();
    var intersetclmperannum = $("#InterstCLMAmt").val();
    var anyaddvaluationscomm = $("#AdditionalvaluationComm").val();
    var totintrestpayable = $("#totInterstpayable").val();
    var totalvaluationscomm = $("#totvaluationscomm").val();
    var matterid = $("#inputmatterids").val();
    var calculatorid = $("#inputcalculatorid").val();
    var formData = new FormData();
    if (natureofclaim == "labourmat") {
        if (lastctcpermonth == "") {
            alert("Please select last CTC per month");
            return false;
        }
        formData.append("dateofvaluation", dateofvaluationlabour);
        formData.append("anyaddvaluations", anyaddvaluationslabour);
        formData.append("totalvaluationas", totalvaluationaslabour);

    } else {
        formData.append("dateofvaluation", dateofvaluationcomm);
        formData.append("anyaddvaluations", anyaddvaluationscomm);
        formData.append("totalvaluationas", totalvaluationscomm);
    }

    formData.append("lastCTCpermonth", lastctcpermonth);
    formData.append("numberofmonth", numberofmonth);
    formData.append("natureofclaim", natureofclaim);
    formData.append("lwdofworkman", lwdofworkman);
    formData.append("backwagespayable", backwagespayable);
    formData.append("claimdate", claimdate);
    formData.append("ageofclaim", ageofclaim);
    formData.append("principalclmamt", principalclmamt);
    formData.append("intersetclmperannum", intersetclmperannum);
    formData.append("totintrestpayable", totintrestpayable);
    formData.append("matterid", matterid);
    formData.append("calculatorId", calculatorid);
    openload();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/UpdateCalCulator",
            //url: "/CW/UpdateNotesByCaseIdLitigation", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (String(response.Data) == "1") {
                    alert("Save successfully");
                    closeload();
                    loadcontactlist(pageindex, "", "");
                    $('#matterlistTASLCalculator').modal('hide');
                    //$("#matterlistTASLCalculator").
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

//Reset CalCulator form
$(document).on('click', '#ResetCal', function () {
    $("#fnatureclaim").val('');
    $("#TASALList")[0].reset();

});

//Added By Aman 
var matterId = "";
$(document).on('click', '#SebiUpdate', function () {
    matterId = $(this).attr("matterid");
    $('#sebiformids')[0].reset();
    $('#SebiUpdateMatterModal').modal('show');
    GetMetterOtherDetails();
});

// Hide details 
function CaseOtherModalHide() {
    matterId = "";
    $('#SebiUpdateMatterModal').modal('hide');
    caseOtherDetailsFormClear();
}

// Clear form details
function caseOtherDetailsFormClear() {
    $("#ULN").val("");
    $("#NatureOfCase").val("");
    $("#MatterType").val("");
    $("#MatterOf").val("");
    $("#BriefOfMatter").val("");
    $("#Relevance").val("");
    $("#IssuesInvolved").val("");
    $("#NatureOfViolation").val("");
    $("#Casecategory").val("");
    $("#DateOfImpugned").val("");
    $("#IssuingAuthority").val("");
    $("#DirectionUnderTheOrder").val("");
    $("#ReplyField").val("");
    $("#MatterStage").val("");
    $("#StayOrder").val("");
    $("#DateOfStayOrder").val("");
    $("#NameOfParty").val("");
    $("#DateTill").val("");
    $("#ExtendedTill").val("");
    $("#StayVacatedOn").val("");
    $("#DirectionOfCourt").val("");
    $("#ExpactedDateOfCompliance").val("");
    $("#OprationDepartmentInchargeOFCompliance").val("");
    $("#DateOfCompliance").val("");
    $("#DisposalInFavour").val("");
    $("#NatureOfDisposal").val("");
    $("#OperationDepartmentForThePurposeOfSeeking").val("");
    $("#NameOfTheDealingOfficer").val("");
    $("#NameOfOfficer").val("");
    $("#ProformaParty").val("");
    $("#MarketActivity").val("");
    $("#GovernmentAuthorityParty").val("");
    $("#Remarks").val("");
}

//Add and update matter other details SEBI
function saveAndUpdateMatterOtherDetails() {
    var ULN = $("#ULN").val();
    var NatureOfCase = $("#NatureOfCase").val();
    var MatterType = $("#MatterType").val();
    var MatterOf = $("#MatterOf").val();
    var BriefOfMatter = $("#BriefOfMatter").val();
    var Relevance = $("#Relevance").val();
    var IssuesInvolved = $("#IssuesInvolved").val();
    var NatureOfViolation = $("#NatureOfViolation").val();
    var Casecategory = $("#Casecategory").val();
    var DateOfImpugned = $("#DateOfImpugned").val();
    var IssuingAuthority = $("#IssuingAuthority").val();
    var DirectionUnderTheOrder = $("#DirectionUnderTheOrder").val();
    var ReplyField = $("#ReplyField").val();
    var MatterStage = $("#MatterStage").val();
    var StayOrder = $("#StayOrder").val();
    var DateOfStayOrder = $("#DateOfStayOrder").val();
    var NameOfParty = $("#NameOfParty").val();
    var DateTill = $("#DateTill").val();
    var ExtendedTill = $("#ExtendedTill").val();
    var StayVacatedOn = $("#StayVacatedOn").val();
    var DirectionOfCourt = $("#DirectionOfCourt").val();
    var ExpactedDateOfCompliance = $("#ExpactedDateOfCompliance").val();
    var OprationDepartmentInchargeOFCompliance = $("#OprationDepartmentInchargeOFCompliance").val();
    var DateOfCompliance = $("#DateOfCompliance").val();
    var DisposalInFavour = $("#DisposalInFavour").val();
    var NatureOfDisposal = $("#NatureOfDisposal").val();
    var OperationDepartmentForThePurposeOfSeeking = $("#OperationDepartmentForThePurposeOfSeeking").val();
    var NameOfTheDealingOfficer = $("#NameOfTheDealingOfficer").val();
    var NameOfOfficer = $("#NameOfOfficer").val();
    var ProformaParty = $("#ProformaParty").val();
    var MarketActivity = $("#MarketActivity").val();
    var GovernmentAuthorityParty = $("#GovernmentAuthorityParty").val();
    var Remarks = $("#Remarks").val();
    var solicitor = $("#Solicitors").val();
    var courtorder = $("#CourtOrders").val();
    var connectedmatters = $("#Connectedmtr").val();

    var formData = new FormData();
    formData.append("ULN", ULN);
    formData.append("NatureOfCase", NatureOfCase);
    formData.append("MatterType", MatterType);
    formData.append("MatterOf", MatterOf);
    formData.append("BriefOfMatter", BriefOfMatter);
    formData.append("Relevance", Relevance);
    formData.append("IssuesInvolved", IssuesInvolved);
    formData.append("NatureOfViolation", NatureOfViolation);
    formData.append("Casecategory", Casecategory);
    formData.append("DateOfImpugned", DateOfImpugned);
    formData.append("IssuingAuthority", IssuingAuthority);
    formData.append("DirectionUnderTheOrder", DirectionUnderTheOrder);
    formData.append("ReplyField", ReplyField);
    formData.append("MatterStage", MatterStage);
    formData.append("StayOrder", StayOrder);
    formData.append("DateOfStayOrder", DateOfStayOrder);
    formData.append("NameOfParty", NameOfParty);
    formData.append("DateTill", DateTill);
    formData.append("ExtendedTill", ExtendedTill);
    formData.append("StayVacatedOn", StayVacatedOn);
    formData.append("DirectionOfCourt", DirectionOfCourt);
    formData.append("ExpactedDateOfCompliance", ExpactedDateOfCompliance);
    formData.append("OprationDepartmentInchargeOFCompliance", OprationDepartmentInchargeOFCompliance);
    formData.append("DateOfCompliance", DateOfCompliance);
    formData.append("DisposalInFavour", DisposalInFavour);
    formData.append("NatureOfDisposal", NatureOfDisposal);
    formData.append("OperationDepartmentForThePurposeOfSeeking", OperationDepartmentForThePurposeOfSeeking);
    formData.append("NameOfTheDealingOfficer", NameOfTheDealingOfficer);
    formData.append("NameOfOfficer", NameOfOfficer);
    formData.append("ProformaParty", ProformaParty);
    formData.append("MarketActivity", MarketActivity);
    formData.append("GovernmentAuthorityParty", GovernmentAuthorityParty);
    formData.append("Remarks", Remarks);
    formData.append("MatterId", matterId);
    formData.append("solicitor", solicitor);
    formData.append("courtorder", courtorder);
    formData.append("connectedmatters", connectedmatters);

    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/SaveAndUpdateMatterOtherDetails",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                if (response.Data == "1") {
                    alert("Data save successfully");
                    CaseOtherModalHide();
                    caseOtherDetailsFormClear();
                    var fcode5 = localStorage.getItem("FirmCode");
                    window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                }
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });






}


//Get Other meterDetails For Update  SEBI
function GetMetterOtherDetails() {
    var formData = new FormData();
    formData.append("MatterId", matterId);
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/OtherMatterDetailsById",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                if (obj[0] != null) {
                    $("#ULN").val(obj[0].ULN);
                    $("#NatureOfCase").val(obj[0].NatureOfCase);
                    $("#MatterType").val(obj[0].MatterType);
                    $("#MatterOf").val(obj[0].MatterOf);
                    $("#BriefOfMatter").val(obj[0].BriefOfMatter);
                    $("#Relevance").val(obj[0].Relevance);
                    $("#IssuesInvolved").val(obj[0].IssuesInvolved);
                    $("#NatureOfViolation").val(obj[0].NatureOfViolation);
                    $("#Casecategory").val(obj[0].Casecategory);
                    $("#DateOfImpugned").val(obj[0].DateOfImpugned);
                    $("#IssuingAuthority").val(obj[0].IssuingAuthority);
                    $("#DirectionUnderTheOrder").val(obj[0].DirectionUnderTheOrder);
                    $("#ReplyField").val(obj[0].ReplyField);
                    $("#MatterStage").val(obj[0].MatterStage);
                    $("#StayOrder").val(obj[0].StayOrder);
                    $("#DateOfStayOrder").val(obj[0].DateOfStayOrder);
                    $("#NameOfParty").val(obj[0].NameOfParty);
                    $("#DateTill").val(obj[0].DateTill);
                    $("#ExtendedTill").val(obj[0].ExtendedTill);
                    $("#StayVacatedOn").val(obj[0].StayVacatedOn);
                    $("#DirectionOfCourt").val(obj[0].DirectionOfCourt);
                    $("#ExpactedDateOfCompliance").val(obj[0].ExpactedDateOfCompliance);
                    $("#OprationDepartmentInchargeOFCompliance").val(obj[0].OprationDepartmentInchargeOFCompliance);
                    $("#DateOfCompliance").val(obj[0].DateOfCompliance);
                    $("#DisposalInFavour").val(obj[0].DisposalInFavour);
                    $("#NatureOfDisposal").val(obj[0].NatureOfDisposal);
                    $("#OperationDepartmentForThePurposeOfSeeking").val(obj[0].OperationDepartmentForThePurposeOfSeeking);
                    $("#NameOfTheDealingOfficer").val(obj[0].NameOfTheDealingOfficer);
                    $("#NameOfOfficer").val(obj[0].NameOfOfficer);
                    $("#ProformaParty").val(obj[0].ProformaParty);
                    $("#MarketActivity").val(obj[0].MarketActivity);
                    $("#GovernmentAuthorityParty").val(obj[0].GovernmentAuthorityParty);
                    $("#Remarks").val(obj[0].Remarks);
                    $("#Solicitors").val(obj[0].solicitor);
                    $("#CourtOrders").val(obj[0].courtorder);
                    $("#Connectedmtr").val(obj[0].connectedmtr);
                    $("#savematter").css("display", "none");

                    $("#updatematter").css("display", "block");


                }
                else {
                    $("#updatematter").css("display", "none");

                    $("#savematter").css("display", "block");

                }

            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });

}