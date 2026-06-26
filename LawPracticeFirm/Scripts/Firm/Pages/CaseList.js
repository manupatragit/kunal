var nhdSortVal = "";
$(document).ready(function () {
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0, loadisActivate = 0;
    var fieldnamecust = "";
    var fieldvaluecust = "";
    var arrcolmenuseleciton = [];
    var firstload = true;
    //Adding for BridgeStone
    $('#Plaintiff_Defendant').change(function () {
        var selectedValue = $(this).val();

        if (selectedValue === 'Plaintiff') {
            $('#PlaintiffOn').show();
            $('#DefendantOn').hide();
        }
        else if (selectedValue === 'Defendant') {
            $('#DefendantOn').show();
            $('#PlaintiffOn').hide();
        }
        else {

            $('#PlaintiffOn').hide();
            $('#DefendantOn').hide();
        }
    });
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

    if (urltype == "Courtstatus") {
        var value = atob(urltypevalue);       
        $("#courtstatusfilter").val(value);      
    }
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
    $("#ColumnSelectionopen").click(function () {
        var url = "/firm/ColumnSelection";
        $('.mymodelscolumnselection').load(url, function (result) {
            $('#myModalcolumn').modal({ show: true });
        });
    });
    /*Get Client Case List*/
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });
    /*CNR case link*/
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
    /*Extra Party Information*/
    $(document).on("click", "#extrapartytransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/ExtraPartyInformation";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Get case information Report*/
    $(document).on("click", "#caseinformationtransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/caseinformationReport";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*New Case Dashboard*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Save Limitation Case*/
    $(document).on("click", "#viewlimitation", function () {
        var token = $(this).attr("id-val");
        var urls = "/" + fcode + "/Firm/SaveLimitationCase";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Edit cases*/
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
    $("#oexcel").click(async function () {
        var yes = await validatePageLink(event, 'CreateCase', 'Export');
        if (yes) {
            $("#myModalexport").modal({ show: true });
            var totalRecord = $("#exportrecords").val();
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
        }
    });
    $("#opdf").click(async function () {
        var yes = await validatePageLink(event, 'CreateCase', 'Export');
        if (yes) {
            $("#myModalexport").modal({ show: true });
            var totalRecord = $("#exportrecords").val();
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
        }
    });
    $(document).on("click", "#exporttoexcelfile", function () {
        var chkArray3 = [];
        var selected = $("#od input[type='checkbox']:checked");
        selected.each(function () {
            if ($(this).val() != null) {

                chkArray3.push($(this).val());
            }
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        console.log(selected3);
        //return false;
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
        var caseredirectfilter = caserediectId;
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
        var Court_Status = $("#courtstatusfilter").val();
        var casedetailsfilter = $("#casedetailsfilter").val();
        //Added New Filte 
        var hearingsortfilter = nhdSortVal;
        var petionerfilter = $("#casefilterpetitioner").val();
        var respondentrfilter = $("#casefilterrespondent").val();

        var urls = "/" + fcode + "/Firm/ExportoExcelNewCases";
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
                "casefiltercnrno": EncodeText(casefiltercnrno1), "caseRedirectfilter": EncodeText(caseredirectfilter),
                "NextHearingfromd": EncodeText(NextHearingfromd), "NextHearingtod": EncodeText(NextHearingtod),
                "Court_Status": EncodeText(Court_Status), "casedetailsfilter": EncodeText(casedetailsfilter),
                "hearingsortfilter": EncodeText(hearingsortfilter), "petionerfilter": EncodeText(petionerfilter),
                "respondentrfilter": EncodeText(respondentrfilter)

            }
        });
    })

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
        window.location = encodeURI("/firm/ExportoExcelCustomFieldMatter?status=true&vdate=" + vdate + "&type=" + type + "&exportcolumn=" + selected3);
    })

    /*Export custom field history in pdf*/
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
        var caseisddfilter = "";
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 0;
        if (roleids == 1) {
            pagesizedata = 500;
        } else {
            pagesizedata = 500;
        }
        //Next Hearing range filter
        var NextHearingfromd = $("#Nexthearingfrmdate").val();
        var NextHearingtod = $("#NexthearingdateTo").val();
        var Court_Status = $("#courtstatusfilter").val();
        var casedetailsfilter = $("#casedetailsfilter").val();
        //Added New Filte 
        var hearingsortfilter = nhdSortVal;
        var petionerfilter = $("#casefilterpetitioner").val();
        var respondentrfilter = $("#casefilterrespondent").val();

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
                "searchdisposeoption": EncodeText(serhdisposeoptions), "casefilterCaseDetails": EncodeText(casefilterCaseDetails1),
                "casefiltermtrno": EncodeText(casefiltermtrno1), "casefilterInternalno": EncodeText(casefilterInternalno1),
                "casefiltercnrno": EncodeText(casefiltercnrno1), "NextHearingfromd": EncodeText(NextHearingfromd),
                "NextHearingtod": EncodeText(NextHearingtod), "casedetailsfilter": EncodeText(casedetailsfilter),
                "Court_Status": EncodeText(Court_Status),"hearingsortfilter": EncodeText(hearingsortfilter),
                "petionerfilter": EncodeText(petionerfilter), "respondentrfilter": EncodeText(respondentrfilter)
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

    /*Get case details*/
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
    /*Un Link Case To CaseWatch*/
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

    /*Get archive cases*/
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

    /*Bind custom field history ersion*/
    $("#cfHistory").click(function () {
        $('#myModalcfHistory').modal({ show: true });
        bindCFHistoryversion();
    });

    /*Bind custom field history daata*/
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
    /**Load Custom Field Header */
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

    /*Load custom field list*/
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
    //end CField history
    /*delete case single*/
    $(document).on("click", "#deletecasesingle", function () {
        //alert("hi");
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
    /*Delete final single cases*/
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
                        formData.append("typeIds", EncodeText(selectedID));
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
                        formData.append("typeIds", EncodeText(selectedID));
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
    /*Delete matter cases*/
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
        loadflag = true;
        loadcontactlist(1, "", "");
        $("#Nexthearingcleardate").css("display", "block");
        $("#nexthearingdesc").show();
        $("#nexthearingasc").hide();

    });
    //Clear Next Hearing date filter
    $("#Nexthearingcleardate").click(function () {
        $("#Nexthearingfrmdate").val("");
        $("#NexthearingdateTo").val("");
        $("#Nexthearingcleardate").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    //For Next Hearing Sorting Filter
    $("#nexthearingasc").click(function () {
        nhdSortVal = "asc";
        loadflag = true;
        loadcontactlist(1, "", "");
        $("#nexthearingdesc").show();
        $("#nexthearingasc").hide();
    });
    $("#nexthearingdesc").click(function () {
        nhdSortVal = "desc";
        loadflag = true;
        loadcontactlist(1, "", "");
        $("#nexthearingdesc").hide();
        $("#nexthearingasc").show();
    });
    $("#nexthearingrefresh").click(function () {
        nhdSortVal = "";
        $("#nextheringfilterdate").val(String.empty);
        $("#nexthearingfilterdateTo").val(String.empty);
        $("#nexthearingasc").show();
        $("#nexthearingdesc").hide();
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    //For Petioner Serch Filter
    $("#searchpetitioner").click(function () {
        var casefiltercasename = $("#casefilterpetitioner").val();
        if (casefiltercasename == "") {
            alert("Please enter the petitioner name.");
            $("#casefilterpetitioner").focus();
            return false;
        }
        $("#clearnewsearchpetitioner").css("display", "unset")
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    $("#clearnewsearchpetitioner").click(function () {
        $("#casefilterpetitioner").val("");
        $("#clearnewsearchpetitioner").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    //For Respondent Filter
    $("#searchrespondent").click(function () {
        var casefiltercasename = $("#casefilterrespondent").val();
        if (casefiltercasename == "") {
            alert("Please enter the respondent name.");
            $("#casefilterrespondent").focus();
            return false;
        }
        $("#clearnewsearchrespondent").css("display", "unset")
        loadflag = true;
        loadcontactlist(1, "", "");
    });
    $("#clearnewsearchrespondent").click(function () {
        $("#casefilterrespondent").val("");
        $("#clearnewsearchrespondent").css("display", "none");
        loadflag = true;
        loadcontactlist(1, "", "");
    });
     //Court status Filter
    $("#courtstatusfilter").change(function () {
        loadflag = true;
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
    /*Case filter */
    $(document).on('keyup', '#casefilternotes', function () {
        /* your code here */
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
    /*Search court name data*/
    $("#searchdatascourtname").click(function () {
        var casefiltercourtname = $("#casefiltercourtname").val();
        if (casefiltercourtname == "") {
            alert("Please enter the Court name.");
            $("#casefiltercourtname").focus();
            return false;
        }
        $("#clearnewsearchcourtname").css("display", "unset")
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    /*Get case filter couty name*/
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
    /*Case filter case name*/
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
    /*Clear new search company*/
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
    //Add Matter Type filter
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
    $("#casefilterdisposeoption").change(function () {
        loadflag = true;
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    //Add case details filter
    $("#casedetailsfilter").change(function () {
        loadflag = true;
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
    /*clear new search Case Details*/
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
        loadcontactlist(1, "", "");
        chksflag = true;
    });
    $("#clearnewsearchmtrno").click(function () {
        $("#casefiltermtrno").val("");
        $("#clearnewsearchmtrno").css("display", "none");
        loadflag = true;
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
    $(document).on('keyup', '#companynamefilter', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
            // loadcontactlist(1);
        }
        else {
            if (chksflag == true) {
                loadflag = true;
                loadcontactlist(1);
                chksflag = false;
            }
        }
    });
    /*Open loader*/
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
    ploadtabledata();
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var countcustomfoeld = 0;
    /*Load custom field details*/
    function ploadtabledata() {
        var $table = '';
        var $header = '';
        var $head1 = '';
        var dt = '';
        var q1 = 2;
        var Iscustomflag = 0;
        var columnvalue = 0;
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
                        // $header += '<th  class="Class' + q1 + '">   <div class="thbg">' + val.FieldName + '</div></th>';
                        option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                    });
                    $header += '<th class="actioncase"><div class="thbg"><p style="width:130px;">Action</p></div></th>';
                    $('#headrow').append($header);
                    $("#od").append(option);
                    SortData();
                    var option1 = '<li><input id="select_allcfield"   type="checkbox"   >Select All</a></li>';
                    $("#od").append(option1);
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
            if (urltype == "status" || urltype == "type" || urltype == "subject"||urltype == "Courtstatus") {
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
        return htmlNew;
    }
    /*Load contact list*/
    function loadcontactlist(pageindex, searchcolnaame, searchcolvalue) {
        $("#bindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        var casefilterstatus = $('#casefilterstatus').val();
        var MatterTypefilter = $('#MatterTypefilter').val();
        var SubjectTypefilter = $('#SubjectTypefilter').val();
        var casefilterCreatedBy = $('#casefilterCreatedBy').val();
        var casefilterdisposeoption1 = $('#casefilterdisposeoption').val();
        var CourtStatusfiletr = $("#courtstatusfilter").val();
        if (urltype == "status") {
            casefilterstatus = atob(urltypevalue);
        }
        
        if (urltype == "type") {
            MatterTypefilter = atob(urltypevalue);
        }
        else if (urltype == "subject") {
            SubjectTypefilter = atob(urltypevalue);
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
        //Add Case Details New Filter 
        var casedetailsfilter = $("#casedetailsfilter").val();
        //Add Next Hearing New Filter 
        var NextHearingfromd = $("#Nexthearingfrmdate").val();
        var NextHearingtod = $("#NexthearingdateTo").val();

        //Added New Filte 
        var hearingsortfilter = nhdSortVal;
        var petionerfilter = $("#casefilterpetitioner").val();
        var respondentrfilter = $("#casefilterrespondent").val();
        var UserFilter = $('#filtercaseusermatter').val();
        //Added Case User Re-Direct Filter
        if (auserredirect != null && auserredirect != "") {
            UserFilter = auserredirect;
            $('#filtercaseusermatter').val(auserredirect);
        }
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($('#searchdata').val()));
        formdata.append("odate", EncodeText($('#casefilterdate').val()));
        formdata.append("casename", EncodeText($('#casefiltercasename').val()));
        formdata.append("clientname", EncodeText($('#casefilterclient').val()));
        formdata.append("court", EncodeText($('#casefiltercourt').val()));
        formdata.append("cstatus", EncodeText(casefilterstatus));
        formdata.append("users", EncodeText(UserFilter));
        formdata.append("createdby", EncodeText(casefilterCreatedBy));
        formdata.append("companyfilter", EncodeText($('#companynamefilter').val()));
        formdata.append("mattertypefilter", EncodeText(MatterTypefilter));
        formdata.append("subjecttypefilter", EncodeText(SubjectTypefilter));
        formdata.append("casefilternotes", EncodeText($('#casefilternotes').val()));
        formdata.append("casefiltercourtname", EncodeText($('#casefiltercourtname').val()));
        formdata.append("odateto", EncodeText($('#casefilterdateTo').val()));
        formdata.append("fillingdate", EncodeText($('#caseFilingdate').val()));
        formdata.append("fillingdateto", EncodeText($('#caseFilingdateTo').val()));
        //Add for custom filter search
        formdata.append("searchcustomcolname", EncodeText(searchcolnaame));
        formdata.append("searchcustomcolvalue", EncodeText(searchcolvalue));
        formdata.append("casedisposefilter", EncodeText(casefilterdisposeoption1));
        formdata.append("casefilterCaseDetails", EncodeText($('#casefilterCaseDetails').val()));
        formdata.append("casefiltermtrno", EncodeText($('#casefiltermtrno').val()));
        formdata.append("casefilterInternalno", EncodeText($('#casefilterInternalno').val()));
        formdata.append("casefiltercnrno", EncodeText($('#casefiltercnrno').val()));
        formdata.append("caseredirectfilter", EncodeText(caserediectId));
        //Add Next Hearing Range Filter
        formdata.append("NextHearingfromd", EncodeText(NextHearingfromd));
        formdata.append("NextHearingtod", EncodeText(NextHearingtod));
        formdata.append("CourtStatusfiletr", EncodeText(CourtStatusfiletr));
        formdata.append("casedetailsfilter", EncodeText(casedetailsfilter));
        //Added New Filter
        formdata.append("hearingsortfilter", EncodeText(hearingsortfilter));
        formdata.append("petionerfilter", EncodeText(petionerfilter));
        formdata.append("respondentrfilter", EncodeText(respondentrfilter));
        var ajaxTime = new Date().getTime();
        if (loadisActivate == 0) {
            openload();
        }
        else {
        }
        var ld12 = $.ajax({
            async: true,
            url: (typeof rbiCaseListApiUrl !== 'undefined' ? rbiCaseListApiUrl : '/api/MatterApi/LoadNewCaseList'),
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#exportrecords").val(0);
                //var totalTime = new Date().getTime() - ajaxTime;
                //console.log("loadcontact:" + totalTime)
                $("#casetfooter").html("");
                $("#tokens").html("");
                $("#pdatastatus").html("");
                if (response.Data != "") {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }

                if (response.Data.length > 2) {
                    $("#pdatastatus").html("");
                }
                if (response.Data == "[]" || response.Data == "" || response.Data == "null" || response.Data == null) {
                    $("#pdatastatus").append("No Records found.");
                    closeload();
                    return false;
                }
                closeload();
                var qty = 0;
                var qty123 = 0;
                var qty124 = 0;
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
                            $("#exportrecords").val(val.totRow);
                            tfot += '<ul>'
                            tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'

                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                            if (val.totRow <= length) {

                            }
                            else if (pageno == 1) {

                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            }

                            else {
                                tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            }

                            if (pageno < totpage) {
                                tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#casetfooter").append(tfot);
                        }

                        $("#pgetdatabypagenum").attr("pageindex", pageindex);
                        qty = qty + 1;
                        qty123 = qty123 + 1;
                        qty124 = qty124 + 1;
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
                        $row.append($('<td class="caseteammembers">').html('<span onclick=viewcontent("' + val.Id + '","' + qty123 + '") data-toggle="collapse" Id_val="' + val.Id + '" data-target="#dtn' + qty123 + '" style="color:blue;cursor:pointer"> more</span><div id="dtn' + qty123 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 281px;position: inherit;border-radius: 10px;left:65%;height:71px;"><button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty123 + '" style="padding-top:-34px;margin-top:-5px;">×</button><span id="binddataalert_' + qty123 + '"></span></div></td>'));

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
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span id='chcr" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }

                                }
                            }
                            else if (val.IsReraCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsReraCourt=" + val.IsReraCourt + " sno = " + val.UserCaseid + " > <span   class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                }
                                else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsReraCourt=" + val.IsReraCourt + " sno = " + val.UserCaseid + " > <span id='chcrera" + val.CaseNextHearing + "'  class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            else {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' IsRevenueCourt=" + val.IsRevenueCourt + " sno = " + val.UserCaseid + " > <span id='chc" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
                                    }
                                }
                            }
                            if (val.iCaseNotFound >= 1) {
                                htmllnk += "<a class='" + btnclass + "' style='color: black;' title='Case not found. Please re-add the case with correct details.' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            } else {
                                htmllnk += "&nbsp;|<a class='" + btnclass + "' style='color: black;' title='Remove case for live update' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            }

                            $row.append($('<td class="casecasedetails" />').html(htmllnk));
                        }
                        else if (FinalUserCaseid != "" && String(val.CNRCase) != "" && dashcw == "display:unset" && IsCWActive == "1") {

                            if (val.IsRevenueCourt == "1") {
                                if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                                    htmllnk += "<a title='Order, date of hearing and relevant details for your Case' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span class='" + fileiconcase + "' align='center;' style='background:#52e652;padding:3px;'> " + usercaseid + " </span></a >";
                                } else {
                                    if (val.iCaseNotFound >= 1) { }
                                    else {
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span id='chcr" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
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
                                        htmllnk += "<a title='Case is yet to be indexed' class='" + btnclass + " '  id='cnrcaselink'  case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href = 'javascript:void()' > <span id='chc" + val.CaseNextHearing + "' class='" + fileiconcase + "' align='center;' style='background:#d97a7a;padding:3px;'> " + usercaseid + " </span></a >";
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
                        if (val.CaseNextHearing != null && dashcw == "display:unset" && IsCWActive == "1") {
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
                            $row.append($('<td class="NextHearing" />').html(""));
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
                        //For TASL 
                        if (TASLFirmId.toLowerCase() == FirmIdss.toLowerCase()) {
                            $row.append($('<td class="ValuationofSuit" />').html("<span>" + (val.TotalValuation != null ? val.TotalValuation : '<span style="">&nbsp;</span>')));
                        }
                        else {
                            $row.append($('<td class="ValuationofSuit" />').html("<span>" + (val.ValuationofSuit != null ? val.ValuationofSuit : '<span style="">&nbsp;</span>')));
                        }
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
                                html3 += '<span data-toggle="collapse" data-target="#dtnn' + qty124 + '" style="color:blue;cursor:pointer"> more</span>'
                                html3 += ' <div id="dtnn' + qty124 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                html3 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtnn' + qty124 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'

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
                        $row.append($('<td class="CaseType"  />').html("<span name='" + val.CaseType + "'> " + (val.CaseType != null && val.CaseType != 'undefined' ? val.CaseType : '<span style="visibility: hidden;">&nbsp;</span>')));
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
                        $row.append($('<td class="disposeoptionsstatus"  />').html("<span name='" + val.Outcome + "'> " + (val.Outcome != null ? val.Outcome : '<span style="visibility: hidden;">&nbsp;</span>')));
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
                            $row.append($('<td class="vOtherpartydetails" style="text-align: center;" />').html("<span id='transferotherpartydetails' title='View Other Party Details' href='javascript:void()' data-id=" + val.Id + " style='cursor:pointer;color:blue;'>" + (val.TotalCaseTime != null ? val.TotalCaseTime : '<span style="">&nbsp;</span>')));
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

                        if (val.odelete == 1 && val.oedit == 1 && roleids == 1) {
                            if (val.LimitationCount == 0) {
                                html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                            }
                            else {

                                html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                            }
                        }

                        else if (val.oedit == 1 && val.odelete == 1) {

                            if (val.LimitationCount == 0) {
                                //For Shree CLient View Only
                                if (userid.toUpperCase() == ShreeClient || userid.toUpperCase() == ShreeClient2nd || userid.toUpperCase() == ShreeClient3nd || userid.toUpperCase() == ShreeClient4nd) {

                                } else {
                                    html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp; ";
                                }
                            }
                            else {
                                html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                            }
                        }
                        else if (val.oedit == 1) {
                            if (val.LimitationCount == 0) {
                                html4 += "<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                            }
                            else {
                                html4 += "<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                            }
                        }
                        else if (val.odelete == 1) {

                            if (val.LimitationCount == 0) {
                                html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;";
                            }
                            else {
                                html4 += "<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;";
                            }
                        }
                        else {

                            if (val.LimitationCount == 0) {
                                html4 += "<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp; ";

                            }
                            else {
                                html4 += "<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;";
                            }

                        }

                        if (FinalUserCaseid != "" && dashcw == "display:unset" && IsCWActive == "1") {
                            html4 += "<span class='fa fa-user-plus' cwid='" + FinalUserCaseid + "'  matterid='" + val.Id + "' mmnanevalus='" + val.mname + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert'></span>";
                        }
                        if (val.MatterType == "Litigation" && (val.UserCaseid == null || val.UserCaseid == "")) {
                            html4 += "<span class='glyphicon glyphicon-share' title='Track case in court' style='cursor:pointer;margin-left:5px; color:black'; sno='" + val.mname + "'  id-val='" + val.Id + "' id='addliveupdatemanually'></span>";
                        }
                        else {

                        }

                        //For Add Email Notes
                        if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                            html4 += "<span class=''  title='Click here to insert/view notes.' id='OpenEmailNotesModal' data-caseid='" + val.MasterCaseId + "'  data-usercaseid='" + val.UserCaseid + "'><img style='padding: 0 0 0 3px;cursor: pointer;' src='/newassets/images/notes-icon.png' /></span>";
                        }
                        //For View Latest Order
                        if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                            html4 += "&nbsp;|<a class='' href='#' id='openorders' style='color:red;cursor:pointer;' title='View latest order'  id-val=" + val.MasterCaseId + "><img src='/newassets/images/order-icon.png' style='height: 17px;'></a>";
                        }
                        //For Linked Case View Options
                        if (val.MasterCaseId != "" && val.MasterCaseId != "0" && val.MasterCaseId != null) {
                            if (val.FIRNo >= "1") {
                                html4 += "&nbsp;|&nbsp;<span class='glyphicon glyphicon-retweet' style='color:black; cursor:pointer;'  title='View Parent case detail' id='OpenLinkedCaseModal' data-caseid='" + val.MasterCaseId + "'  data-usercaseid='" + val.UserCaseid + "'></span>";
                            }
                        }
                        //BridgeStone
                        if (bridgePermissionView > 0) {
                            html4 += "&nbsp;|&nbsp;<span class='glyphicon glyphicon-pencil' style='color:black; cursor:pointer;' title='Edit Bridgestone matter Details' cwid='" + FinalUserCaseid + "' matterid='" + val.Id + "' mmnamevalus='" + val.mname + "' id='BridgeStoneUpdate' data-toggle='modal' data-target='#BridgeStoneUpdateMatterModal'></span>&nbsp;";
                        }
                        //For TASL 
                        if (TASLFirmId.toLowerCase() == FirmIdss.toLowerCase()) {
                            if (val.IsCalculator != "" && val.IsCalculator != "0" && val.IsCalculator != null) {

                                html4 += "|<span class='glyphicon glyphicon-plus'  title='Update the Valuation' id='UpdateCalculator' data-caseid='" + val.Id + "' data-id='" + val.IsCalculator + "' style='cursor:pointer;margin-left:5px; color:green';></span>";
                            } else {
                                html4 += "|<span class='glyphicon glyphicon-plus'  title='Calculate the Valuation' id='AddCalculator' data-caseid='" + val.Id + "' style='cursor:pointer;margin-left:5px; color:black';></span>";
                            }
                        }

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
                    $(".casecasedetails1,.casecasedetails2,.casecasedetails3").show();
                }
                else {
                    $(".casecasedetails1,.casecasedetails2,.casecasedetails3").hide();
                    $('#NextHearing').attr('checked', false);
                    $('.NextHearing').hide()

                }

                var formData = new FormData();
                formData.append("moduleName", EncodeText("MatterList"));
                $.ajax({
                    url: '/api/CallApi/LoadColumnMasterChoiceByFirmId',
                    data: formData,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (response) {
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
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
    bindCommonDropdown("SubjectTypefilter", "Case_Type", "Subject Type");
    bindCommonDropdown("casefilterstatus", "Case_Status", 'Internal Status');
    bindCommonDropdown("casefilterdisposeoption", "Disposed_Option", "Outcome");
    /*Bind common dropdown*/
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
    var matternamevalus = "";

    /*Load user by case id*/
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
            } //End of AJAX error function
        });
    }
    /*Open casewatch user model*/
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
    /*Delete casewatch user alert*/
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
    /*Load casewatch alert users*/
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
    /*Open selected column*/
    $("#ColumnSelectionopen").click(function () {
        var fcode = localStorage.getItem("FirmCode");
        var url = "/" + fcode + "/firm/ColumnSelection";
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
    //Add live update manually
    $(document).on('click', '#addliveupdatemanually', function () {
        var matternamr = $(this).attr("sno");
        var matterId = $(this).attr("id-val");
        $("#mattersforlink21").val('');
        $("#livecaseidhide1").val('');
        openload();
        // mattersforlink21
        var url = "/" + fcode + "/CW/AddLiveUpdateManuallyCase";
        $('.LiveUpdateManuallybodyFormatter').load(url, function (result) {
            closeload();
            $("#mattersforlink21").val(matternamr);
            $("#livecaseidhide1").val(matterId);
            $("#addtaskmemberhide").hide();
            $("#myModalLiveUpdateManuallyFormatter").modal({ show: true });
        });
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
    //For Shree CLient View Only
    if (userid.toUpperCase() == ShreeClient || userid.toUpperCase() == ShreeClient2nd || userid.toUpperCase() == ShreeClient3nd || userid.toUpperCase() == ShreeClient4nd) {
        $("#hidestshree").hide();
        $("#hidedivesree").hide();

    } else {
        $("#hidestshree").show();
        $("#hidedivesree").show();
    }
    // For Linked Matter Shows into action
    $(document).on("click", "#OpenLinkedCaseModal", function () {
        var caseids = $(this).attr("data-caseid");
        var UserCaseids = $(this).attr("data-usercaseid");
        bindLinkedCaseDetails(caseids, UserCaseids);
        $('#myModalLinKedMatterList').modal({ show: true });
    });
    /*Bind other details by case id*/
    function bindLinkedCaseDetails(caseids, UserCaseIds) {
        var formData = new FormData();
        $("#LinkedCaseData").html('');
        formData.append("caseid", caseids);
        var html6 = "";
        var linkedcasetype = "";
        $.ajax(
            {
                type: "POST",
                url: "/CW/ViewLinkedCaseDetails", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var obj = JSON.parse(response);
                    if (obj.data.length == 0) {
                        $(".Allnofoundst1").html("No data found.");
                    }
                    else {
                        $(".Allnofoundst1").html('');
                    }
                    $.each(obj.data, function (i, a) {

                        if (a.LinkedCaseType == "linked") {
                            linkedcasetype = "Linked Case"
                        } else {
                            linkedcasetype = "Parent Case"
                        }
                        if (a.isParentCase == "1") {
                            html6 += "<tr>";
                            html6 += "<td><a title='View Case Details' href='#'  id='ViewLinkedCaseAdd'Idss='" + a.UserCaseId + "'>" + a.LinkedCaseNumber + "</a></td>";
                            html6 += "<td>" + linkedcasetype + "</td>";
                            html6 += "</tr>";
                        }
                        
                        $("#LinkedCaseData").html(html6);
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
    //Transfer Linked Case Deatils 
    $(document).on("click", "#ViewLinkedCaseAdd", function () {
        var transferid = $(this).attr("idss");
        var IsRevenueCourt = "0";
        var IsReraCourt = "0";
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "IsRevenueCourt": IsRevenueCourt, "IsRera": IsReraCourt }
        });
    });

    //For Latest Order
    $(document).on('click', '#openorders', function () {
        var CaseId = $(this).attr("id-val");
        var formData = new FormData();
        formData.append("caseid", EncodeText(CaseId));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/LatestOrderDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var mydata = JSON.parse(response.Data);
                if (mydata.data && mydata.data[0].Filepath) {
                    var openUrl = mydata.data[0].Filepath;
                    window.open(openUrl, '_blank');
                } else {
                    alert("No URL found in the response.");
                }
            },
            failure: function (data) {
            },
            error: function (data) {
            }
        });
    });
});
/*Get assignee details*/
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
    $("#customtotvaluation").val('');
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
    var customvaluation = $("#customtotvaluation").val();
    if (natureofclaim == "") {
        if (customvaluation == "") {
            alert("Please select nature of the claim");
            return false;
        }
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
        //formData.append("totalvaluationas", totalvaluationscomm);
        //Add total custmom valuation
        if (customvaluation != "") {
            formData.append("totalvaluationas", customvaluation);
        } else {
            formData.append("totalvaluationas", totalvaluationscomm);
        }
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
                    var fcode5 = localStorage.getItem("FirmCode");
                    window.location = encodeURI("/" + fcode5 + "/Firm/caselist");
                    //loadcontactlist(pageindex, "", "");
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
                    $("#customtotvaluation").val(data.TotalValuation);
                    if (data.Valuationdate != null) {
                        var valuationsdt = data.Valuationdate.split('T')[0];
                    }
                    if (data.Natureofclm == "labourmat") {
                        if (data.LWDOfWorkman != null) {
                            var LasrWorkingOfWorkman = data.LWDOfWorkman.split('T')[0];
                        }
                        $("#datevaluation").val(valuationsdt);
                        $("#Additionalvaluation").val(data.AdditionalValuation);
                        $("#NoOfMonth").val(data.Numberofmonth);
                        $("#lastctcmonth").val(data.LastCTCPermonth);
                        $("#lwddate").val(LasrWorkingOfWorkman);
                        $("#totvaluations").val(data.TotalValuation);
                        $("#backwagespaybale").val(data.Backwagespayable);

                    } else {
                        if (data.Claimdate != null) {
                            var Claimdatedtes = data.Claimdate.split('T')[0];
                        }
                        $("#claimdate").val(Claimdatedtes);
                        $("#datevaluationcomee").val(valuationsdt);
                        if (data.AdditionalValuation == 0) {
                            $("#AdditionalvaluationComm").val('');
                        }
                        else {
                            $("#AdditionalvaluationComm").val(data.AdditionalValuation);
                        }

                        $("#totvaluationscomm").val(data.TotalValuation);
                        if (data.AgeofClm == 0) {
                            $("#AgeOfClaim").val('');
                        }
                        else {
                            $("#AgeOfClaim").val(data.AgeofClm);
                        }
                        if (data.PrincipalCLMAmt == 0) {
                            $("#PrincipalCLMAmt").val('');
                        }
                        else {
                            $("#PrincipalCLMAmt").val(data.PrincipalCLMAmt);
                        }
                        if (data.IntrCLMPerAnnum == 0) {
                            $("#InterstCLMAmt").val('');
                        }
                        else {
                            $("#InterstCLMAmt").val(data.IntrCLMPerAnnum);
                        }
                        if (data.TotalInterPayble == 0) {
                            $("#totInterstpayable").val('');
                        }
                        else {
                            $("#totInterstpayable").val(data.TotalInterPayble);
                        }

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
    var customvaluation = $("#customtotvaluation").val();
    if (natureofclaim == "") {
        if (customvaluation == "") {
            alert("Please select nature of the claim");
            return false;
        }
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
        //formData.append("totalvaluationas", totalvaluationscomm);
        //Add total custmom valuation
        if (customvaluation != "") {
            formData.append("totalvaluationas", customvaluation);
        } else {
            formData.append("totalvaluationas", totalvaluationscomm);
        }
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
                    var fcode5 = localStorage.getItem("FirmCode");
                    window.location = encodeURI("/" + fcode5 + "/Firm/caselist");
                    //loadcontactlist(pageindex, "", "");
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


//Bridgstone modal view 
var matterId = "";
$(document).on('click', '#BridgeStoneUpdate', function () {
    matterId = $(this).attr("matterid");
    $('#BridgeStoneUpdateMatterModal').modal('show');
    GetBridgeStoneMetterOtherDetails();
});

// Hide details 
function CaseOtherModalHide() {
    matterId = "";
    $('#BridgeStoneUpdateMatterModal').modal('hide');
    caseOtherDetailsFormClear();
    document.getElementById("summary").style.setProperty("color", "", "important");
}

// Clear form details
function caseOtherDetailsFormClear() {
    $("#Plaintiff_Defendant").val("");
    $("#summary").val("");
    $("#Amountclaimed").val("");
    $("#cannotDetarmineAmount1").val("");
    $("#Stateclaimamount").val("");
    $("#cannotDetarmineAmount2").val("");
    $("#probability").val("");
    $("#final_realised_costs").val("");
    $("#final_actual_recoveries").val("");
    $("#Number").val("");
}


//Save and update Bridge Stone Matter other details
function SaveBridgeStoneMatterOtherDetails() {
    var Plaintiff_Defendant = $("#Plaintiff_Defendant").val();
    var summary = $("#summary").val();
    var Amountclaimed = $("#Amountclaimed").val();
    var cannotDetarmineAmount1 = $("#cannotDetarmineAmount1").val();
    var Stateclaimamount = $("#Stateclaimamount").val();
    var cannotDetarmineAmount2 = $("#cannotDetarmineAmount2").val();
    var probability = $("#probability").val();
    var final_realised_costs = $("#final_realised_costs").val();
    var final_actual_recoveries = $("#final_actual_recoveries").val();
    if (Plaintiff_Defendant == "") {
        alert("Please select the PlaintiffDefendant");
        return false;
    }
    if (Plaintiff_Defendant === "Plaintiff" && (Stateclaimamount === "" && cannotDetarmineAmount2 === "")) {
        alert("Please fill in either Bridgestone's Claim Amount (USD) or specify if the Financial or Claim Amount cannot be determined at the time of reporting.");
        return false;
    }

    else if (Plaintiff_Defendant === "Defendant" && (Amountclaimed === "" && cannotDetarmineAmount1 === "")) {
        alert("please fill the Bridgestone’s Potential Exposure Or if Financial or Claim Amount cannot be determined at time of reporting");
        return false;
    }

    var formData = new FormData();
    formData.append("matterId", matterId);
    formData.append("PlaintiffDefendant", Plaintiff_Defendant);
    formData.append("Summary", summary);
    if (Plaintiff_Defendant == "Plaintiff") {
        formData.append("isUnknown", cannotDetarmineAmount2);
    }
    else if (Plaintiff_Defendant == "Defendant") {
        formData.append("isUnknown", cannotDetarmineAmount1);
    }
    formData.append("Defendant", Amountclaimed);
    formData.append("Plaintiff", Stateclaimamount);
    formData.append("Probability_of_Exposure", probability);
    formData.append("Realised_Financial_Costs", final_realised_costs);
    formData.append("Realised_Claims", final_actual_recoveries);
    openload();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/BridgeStoneMatterOtherDetailsUpdate",
            //url: "/CW/UpdateNotesByCaseIdLitigation", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (String(response.Data) == "1") {
                    alert("Save successfully");
                    matterId = "";
                    closeload();
                    $('#BridgeStoneUpdateMatterModal').modal('hide');
                    caseOtherDetailsFormClear();
                    document.getElementById("summary").style.setProperty("color", "", "important");
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

//Get Bridge Stone Matter Other details by Matter id
function GetBridgeStoneMetterOtherDetails() {
    var formData = new FormData();
    formData.append("MatterId", matterId);
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/BridgeStoneMetterOtherDetailsByMatterId",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                debugger
                var obj = JSON.parse(response.Data);
                if (obj[0] != null) {
                    $("#Plaintiff_Defendant").val(obj[0].PlaintiffDefendant);
                    $("#summary").val(obj[0].Summary);
                    if (obj[0].isUpdateSummary === 1) {
                        $("#summary").css("color", "blue");
                        document.getElementById("summary").style.setProperty("color", "blue", "important");
                    }
                    else {
                        document.getElementById("summary").style.setProperty("color", "", "important");
                    }

                    $("#Amountclaimed").val(obj[0].Defendant);
                    $("#Stateclaimamount").val(obj[0].Plaintiff);
                    $("#probability").val(obj[0].Probability_of_Exposure);
                    $("#final_realised_costs").val(obj[0].Realised_Financial_Costs);
                    $("#final_actual_recoveries").val(obj[0].Realised_Claims);
                    $("#Number").val(obj[0].Number);
                    if (obj[0].PlaintiffDefendant === "Defendant") {
                        $("#cannotDetarmineAmount1").val(obj[0].isUnknown);
                        $('#DefendantOn').show();
                        $('#PlaintiffOn').hide();
                    }
                    else if (obj[0].PlaintiffDefendant === "Plaintiff") {
                        $("#cannotDetarmineAmount2").val(obj[0].isUnknown);
                        $('#PlaintiffOn').show();
                        $('#DefendantOn').hide();
                    }
                    else {
                        $('#PlaintiffOn').hide();
                        $('#DefendantOn').hide();
                    }

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

//For Other Party Details view
$(document).on("click", "#transferotherpartydetails", function () {
    var tokenvalue = $(this).attr('data-id');
    bind_MatterTypeDetails(tokenvalue);
});

function bind_MatterTypeDetails(tokenvalue) {
    var formData = new FormData();
    formData.append("caseid", EncodeText(tokenvalue));
    $("#tbody_letigationDetails").html('');
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExtraParty/caseMatterDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var mydata = response.Data;
            var html = "";
            $('#modelotherpartyDetails').modal({ show: true });
            $.each(mydata, function (i, item) {
                var name = item.Name;
                var email = item.Email;
                var phone = item.Phone;
                var type = item.Type;
                html += "<tr>";
                html += "<td>" + name + "</td>";
                html += "<td>" + email + "</td>";
                html += "<td>" + phone + "</td>";
                html += "<td>" + type + "</td>";
                html += "<tr>";
            });
            $("#tbody_letigationDetails").append(html);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
