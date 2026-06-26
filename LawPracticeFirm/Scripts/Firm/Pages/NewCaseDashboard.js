var pageindex = 1;
var globalclientId = ""; var globalmatterids = "";
var vNGTIAMA = "";
var fileTokenId = "";
var courtName = "TELANGANA HIGH COURT";
var janpadName = "";
var tahsilName = "";
var caseNo = "";
var vJudCourt = "";
$(document).ready(function () {
    IsRevenueCourt = "";
    IsReraCourt = "";
    CaseBasicDetails();
    if (dashtimeentry == "display:unset") {
        $("#cdtimeentrytab").show();
    }
    else {
        $("#cdtimeentrytab").hide();
    }
    if (dashcontact == "display:unset") {
        $("#cdcontactstab").show();
    }
    else {
        $("#cdcontactstab").hide();
    }
    if (dashinvoice == "display:unset") {
        $("#invoicetabtab").show();
    }
    else {
        $("#invoicetabtab").hide();
    }
    if (dashtask == "display:unset") {
        $("#cdtasktab").show();
    }
    else {
        $("#cdtasktab").hide();
    }
    if (dashchat == "display:unset") {
        $("#chatchannellisttab").show();
    }
    else {
        $("#chatchannellisttab").hide();
    }
    if (dashcw == "display:unset" && IsCWActive == "1") {
        $("#cdhearingtab").show();
    }
    else {
        $("#cdhearingtab").hide();
    }
    if (dashexpense == "display:unset") {
        $("#expensetabtab").show();
    }
    else {
        $("#expensetabtab").hide();
    }
    function validatercasefile(param) {
        var reg = /_matter_[0-9]{5}$/g
        if (reg.test(param) == false) {
            return false;
        }
        else {
            return true;
        }
    }
    var finaltoken = "";
    $(document).on("click", "div .dropdown-menu", function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        setTimeout(function () {
            $('#myOverlay').css("display", "none");
        }, 200);
    }
    $('#manualnhdate').attr('min', new Date().toISOString().substring(0, 10));
    $('#callfromdate').attr('min', new Date().toISOString().substring(0, 10));

    function CaseDataCaseWatch1(targetSelector = modelid, caseid = null, currentType) {
        if (!caseid) {
            caseid = $("#hdnusercaseid").val();
        }
        //var currentType = $("#ScourtDetailsLabel").text();
        var formData = new FormData();
        formData.append("token", caseid);
        formData.append("IsRevenueCourt", IsRevenueCourt);
        // formData.append("IsReraCourts", IsReraCourt);
        console.log("currentType", currentType);
        var html = '';

        $(targetSelector).html("");
        openload();

        $.ajax({
            type: "POST",
            url: "/firm/CaseDataCaseWatch",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                //if (!response.Result || String(response.Result) === "undefined") {
                //    $(targetSelector).html("Case details are not available.");
                //    closeload();
                //    return;
                //}

                /* if (response.type === "CASE") {*/
                $.each(response.Result, function (i, a) {
                    html += '<div class="col-md-12"><div>';
                    html += '<div class="casetesttab1"><strong style="color:#000;padding:0px;;font-size: 18px;">Other Details:</strong>';
                    courtName = a.Court;
                    if (a.Court == "SUPREME COURT") {
                        if (currentType === 'OtherDetails') {
                            html += '<span><a class="casetestitem1 active" id="opendetails" type="OtherDetails" caseid="' + caseid + '" href="javascript:void()" title="Other Details">Court Details</a></span>';
                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="opendetails" type="OtherDetails" caseid="' + caseid + '" href="javascript:void()" title="Other Details">Court Details</a></span>';
                        }
                    }
                    if (a.Earlier_Court_Details == "1") {
                        if (currentType === 'earliercourt') {
                            html += '<span><a class="casetestitem1 active"  id="opendetails" type="earliercourt" caseid="' + caseid + '" href="javascript:void()" title="Earlier Court Details">Earlier Court Details</a></span>';
                        }
                        else {
                            html += '<span><a class="casetestitem1" id="opendetails" type="earliercourt" caseid="' + caseid + '" href="javascript:void()" title="Earlier Court Details">Earlier Court Details</a></span>';
                        }
                    }
                    if (a.Notices == "1") {
                        if (currentType === 'notices') {
                            html += '<span><a class="casetestitem1 active"  id="opendetails" type="notices" caseid="' + caseid + '" href="javascript:void()" title="Notices" >Notices</a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="opendetails" type="notices" caseid="' + caseid + '" href="javascript:void()" title="Notices" >Notices</a></span>';

                        }
                    }
                    if (a.Office_Reports == "1") {
                        if (currentType === 'officereports') {
                            html += '<span><a class="casetestitem1 active"  id="opendetails" type="officereports" caseid="' + caseid + '" href="javascript:void()" title="Office Reports" >Office Reports</a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="opendetails" type="officereports" caseid="' + caseid + '" href="javascript:void()" title="Office Reports" >Office Reports</a></span>';

                        }
                    }
                    if (a.Caveat == "1") {
                        if (currentType === 'caveat') {
                            html += '<span><a class="casetestitem1 active"  id="opendetails" type="caveat" caseid="' + caseid + '" href="javascript:void()" title="Caveat" >Caveat</a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="opendetails" type="caveat" caseid="' + caseid + '" href="javascript:void()" title="Caveat" >Caveat</a></span>';

                        }
                    }
                    //For FIR Deatils Count
                    if (a.FIRDetailsCount >= "1") {
                        if (currentType === 'FIR Details') {
                            html += '<span><a class="casetestitem1 active" id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()">FIR Details</a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()">FIR Details</a></span>';

                        }
                    }
                    //For Linked Case Deatils
                    if (a.LinkedCasesCount >= "1") {
                        if (currentType === 'LinkedCases') {
                            html += '<span> <a class="casetestitem1 active" id="openlinkeddetails"  type="LinkedCases" title="Linked Cases" caseid="' + caseid + '" href="javascript:void()"  title="Linked Cases" >Linked Cases</a></span>';

                        }
                        else if (courtName != "TELANGANA HIGH COURT") {
                            html += '<span><a class="casetestitem1"  id="openlinkeddetails"type="LinkedCases" title="Linked Cases" caseid="' + caseid + '" href="javascript:void()"  title="Linked Cases" >Linked Cases</a></span>';

                        }
                    }
                    //For Sub Courts Deatils
                    if (a.SubMattersCount >= "1") {
                        if (currentType === 'Sub-Matters') {
                            html += '<span><a class="casetestitem1 active" id="opensubmatterdetails"  title="Sub-Matters" caseid="' + a.Id + '" href="javascript:void()"><span style="color:black;" class="glyphicon glyphicon-new-window"></span></a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="opensubmatterdetails"  title="Sub-Matters" caseid="' + a.Id + '" href="javascript:void()"><span style="color:black;" class="glyphicon glyphicon-new-window"></span></a></span>';

                        }
                    }
                    //For Tag Matter 
                    if (a.TagMatters == "1") {
                        if (currentType === 'tagmatter') {
                            html += '<span><a class="casetestitem1 active"  id="opendetails" type="tagmatter" caseid="' + caseid + '" href="javascript:void()" title="Tag Matters" >Tag Matters</a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1" id="opendetails" type="tagmatter" caseid="' + caseid + '" href="javascript:void()" title="Tag Matters" >Tag Matters</a></span>';

                        }
                    }
                    //For SEBI Custmization
                    if (Sebiids == "display:unset") {
                        html += '<span><span style="cursor:pointer;"   caseid="' + a.Id + '" id="openallpartyname">All Party Name</span></span>';
                    }
                    //FOR NGT Earlier Court Deatils
                    if (a.Court == "NATIONAL GREEN TRIBUNAL") {
                        if (currentType === 'earliercourt') {
                            html += '<span><a class="casetestitem1 active"  id="opendetails" type="IAMA" caseid="' + caseid + '" href="javascript:void()" title="IA/MA Details">IA/MA Details</a></span>';

                        }
                        else {
                            html += '<span><a class="casetestitem1"  id="opendetails" type="IAMA" caseid="' + caseid + '" href="javascript:void()" title="IA/MA Details">IA/MA Details</a></span>';

                        }
                    }
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    if (a.CourtType == 5) {

                        html += '<div class="row">';
                        html += '<div class="col-md-6">';
                        html += '<div></div>';
                        html += '</div>';

                        html += '<div class="col-md-6">';
                        html += '<div><button type="button"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id="openAppendCOurtManualOrder" class="button10">Add Order</button></div>';
                        html += '</div>';
                        html += '</div>';

                    }
                    else {
                        $(".Alerts,.mnh").hide();
                        $.each(response.Result, function (i, a) {

                            if (a.FIRDetailsCount >= "1") {
                                html += '<span><a  id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()">FIR Details</a></span>';
                            }
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                        }); //End of foreach Loop
                    }
                });
                /*}*/

                $(targetSelector).append(html);
                closeload();
            },
            error: function (xhr) {
                $(targetSelector).html("Error fetching case details: " + xhr.statusText);
                closeload();
            }
        });
    };


    $(document).on("click", "#opendetails", function () {
        var type = $(this).attr("type");
        var caseid = $(this).attr("caseid");
        var formData = new FormData();
        if (type == "IAMA") {
            vNGTIAMA = type;
            type = "earliercourt";
        }
        formData.append("doctype", type);
        formData.append("caseid", caseid);

        var modelid = "#SCourtLinks";
        CaseDataCaseWatch1(modelid, caseid, type);
        /*        CaseDataCaseWatch1("#SCourtLinks", caseid);*/
        $('#myModallinkedsmatters').modal('hide');
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
                $('#SCourtDetailsbody').html("");
                $('#OtherDetailsDataNotFound').hide();
                var obj = JSON.parse(data);
                if (type == "officereports") {
                    $('#ScourtDetailsLabel').html("OFFICE REPORTS");
                    $.each(obj.data, function (i, a) {
                        var firstofficereports = obj.data[0] || {};
                        var officereports = firstofficereports["Office Reports"] || "";

                        if (!officereports || officereports.length === 0) {
                            $('#OtherDetailsDataNotFound').show();
                            return false;
                        }
                        $('#SCourtDetailsbody').html(a["Office Reports"]);
                    });
                    closeload();
                }
                else if (type == "earliercourt") {
                    if (vNGTIAMA == "IAMA" && courtName == "TELANGANA HIGH COURT") {
                        $('#ScourtDetailsLabel').html("IA DETAILS");
                    }
                    else if (vNGTIAMA == "IAMA") {
                        $('#ScourtDetailsLabel').html("IA/MA DETAILS");
                    } else {
                        $('#ScourtDetailsLabel').html("EARLIER COURT DETAILS");
                    }
                    $.each(obj.data, function (i, a) {
                        var firstearliercourt = obj.data[0] || {};
                        var earliercourt = firstearliercourt["Earlier Court Details"] || "";

                        if (!earliercourt || earliercourt.length === 0) {
                            $('#OtherDetailsDataNotFound').show();
                            return false;
                        }
                        $('#SCourtDetailsbody').html(a["Earlier Court Details"]);
                    });
                    closeload();
                }
                else if (type == "notices") {
                    $('#ScourtDetailsLabel').html("Notices");
                    $.each(obj.data, function (i, a) {
                        var firstNotices = obj.data[0] || {};
                        var Notices = firstNotices["Notices"] || "";

                        if (!Notices || Notices.length === 0) {
                            $('#OtherDetailsDataNotFound').show();
                            return false;
                        }
                        $('#SCourtDetailsbody').html(a["Notices"]);
                    });
                    closeload();
                }
                else if (type == "caveat") {
                    $('#ScourtDetailsLabel').html("Caveat");
                    $.each(obj.data, function (i, a) {
                        var firstCaveat = obj.data[0] || {};
                        var Caveat = firstCaveat["Caveat"] || "";

                        if (!Caveat || Caveat.length === 0) {
                            $('#OtherDetailsDataNotFound').show();
                            return false;
                        }
                        $('#SCourtDetailsbody').html(a["Caveat"]);
                    });
                    closeload();
                }
                else if (type == "OtherDetails") {
                    $('#ScourtDetailsLabel').html("Other Details");
                    $.each(obj.data, function (i, a) {
                        var firstOtherDetails = obj.data[0] || {};
                        var OtherDetails = firstOtherDetails["Details"] || "";

                        if (!OtherDetails || OtherDetails.length === 0) {
                            $('#OtherDetailsDataNotFound').show();
                            return false;
                        }
                        $('#SCourtDetailsbody').html(a["Details"]);
                    });
                    closeload();
                }
                else if (type == "tagmatter") {
                    $('#ScourtDetailsLabel').html("Tag Matter");
                    $.each(obj.data, function (i, a) {
                        var firsttagmatter = obj.data[0] || {};
                        var tagmatter = firsttagmatter["vTagMatters"] || "";

                        if (!tagmatter || tagmatter.length === 0) {
                            $('#OtherDetailsDataNotFound').show();
                            return false;
                        }
                        $('#SCourtDetailsbody').html(a["vTagMatters"]);
                    });
                    closeload();
                }
                else {
                    closeload();
                }
            }
        });
    });
    var invpageindex = 1, invpagesize = 10, invrecordcount = 0, invtotrecord = 0;
    var teammempageindex = 1, teammempagesize = 10, recordcount = 0, totrecord = 0;
    var cdddpageindex = 1, cdddpagesize = 10, cdddrecordcount = 0, cdddtotrecord = 0;
    var UserCaseId = "";
    var loadcontactflag = false;
    var repcommupageindex = 1, repcommupagesize = 10, repcommurecordcount = 0, repcommutotrecord = 0;
    var loadcomuid = "";

    /*Reply communication*/
    $(document).on("click", "#ReplyCommunication", function () {
        $("#hidecomuid").val($(this).attr("data-val"));
        loadcomuid = $(this).attr("data-val");
        loadCommuReply(repcommupageindex, $(this).attr("data-val"));
        $("#myModalreplycommu").modal("show");
    });

    /*Get data by page number*/
    $(document).on('click', '#trepgetdatabypagenum', function () {
        ipageindex = $("#treppagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#trepsotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    //openload();
                    loadCommuReply(ipageindex, loadcomuid)
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
    $(document).on('click', '#treppaginate', function () {
        ipageindex = $(this).attr("index");
        loadCommuReply(ipageindex, loadcomuid);
    });

    /*Load communication reply*/
    function loadCommuReply(repcommupageindex, commuids) {
        var formData = new FormData();
        formData.append("comid", commuids);
        formData.append("pagenum", repcommupageindex);
        formData.append("pagesize", repcommupagesize);
        formData.append("berieffilter", "");
        formData.append("subjectfilter", "");
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CaseDashboardReplyCaseCommuniqueList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // alert(response.Data);
                if (response.Data == "[]") {
                    //$("#commureplytfooter,#maincontentcommu").hide();
                    $("#divPopPage").hide();
                    $("#noreplyfound").show();
                    closeload();
                    return false;
                }
                //$("#commureplytfooter,#maincontentcommu").show();
                $("#noreplyfound").hide();
                $("#divPopPage").show();
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                var html3 = '';
                var ccount = 0;
                //$("#commureplytfooter table").remove();
                $.each(obj, function (i, a) {
                    ccount = ccount + 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(repcommupagesize);
                        if (parseInt(totdata) % parseInt(repcommupagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }

                        //$("#invpagnumvalue").attr("max", totdata);
                        if (repcommupageindex == totpage) {
                            $('#PopNext').hide();
                            $('#PopPrev').css("display", "block");
                        }
                        else {
                            $('#PopPrev').css("display", "block");
                        }
                        if (repcommupageindex == 1) {
                            $('#PopPrev').css("display", "none");
                        }
                        else {
                            $('#PopPrev').css("display", "block");
                        }

                        if (isCommPopRnd == false) {
                            CommPopRenderPagination(repcommupageindex, totpage);
                        }
                    }
                    //if (i === (length - 1)) {
                    //    var pnext = repcommupageindex;
                    //    var pprev = repcommupageindex;
                    //    var pageno = repcommupageindex;
                    //    var totdata = a.totRow;
                    //    var totpage = 0;
                    //    if (a.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(repcommupagesize);
                    //        if (parseInt(totdata) % parseInt(repcommupagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#treppagnumvalue").attr("max", totpage);
                    //    }
                    //    var tcomfot1 = '';
                    //    tcomfot1 += '<table style="width:100%;font-size:12px;margin-bottom:-12px;"><tr><td>'
                    //    tcomfot1 += '<div>Page Number <b style="font-size:12px; ">' + repcommupageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="trepsotopage">' + parseInt(totpage) + '</span> Pages</b>'
                    //    tcomfot1 += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                    //    tcomfot1 += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No:<input type="number" id="treppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="trepgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button>'
                    //    if (a.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tcomfot1 += '<span>&nbsp;&nbsp;<a id="treppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>'
                    //    }
                    //    else {
                    //        tcomfot1 += '<span>&nbsp;&nbsp;<a id="treppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>'
                    //    }
                    //    if (pageno < totpage) {
                    //         tcomfot1 += '<a  id="treppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span >'
                    //    }
                    //    tcomfot1 += '</div></td><td>'
                    //    tcomfot1 += '<div style="float:right;margin-top:-20px;">'
                    //    tcomfot1 += '</td>'
                    //    tcomfot1 += '</tr></div>'
                    //    $("#commureplytfooter").empty().append(tcomfot1);
                    //}


                    //html3 += '<div class="ec_bg" style="margin-bottom:5px;">'
                    //html3 += '<p>' + a.ReplyBrief + '</p>'
                    //if (a.DocsCount != "0") {
                    //    html3 += '<p style="color:#069;cursor:blank;cursor:pointer;" title="Click here to view documents" id-val="' + a.Rid + '" id="filelinkcommureply">' + a.DocsCount + ' document attached.</p>'
                    //}
                    //html3 += '<span class="time-left" style=""margin-top:5px;">Sent by: ' + a.CreatedBy + ' ' + formatDatetoIST(a.date_time) + '</span>'
                    //html3 += '</div>'

                    html3 += '<tr>'
                    html3 += '<td>' + formatDatetoIST(a.date_time) + '</td>'
                    html3 += '<td>' + a.ReplyBrief + '</td>'
                    html3 += '<td>' + a.CreatedBy + '</td>'
                    html3 += '<td style="color:#069;cursor:blank;cursor:pointer;" title="Click here to view documents" id-val="' + a.Rid + '" id="filelinkcommureply">' + (a.DocsCount != 0 ? a.DocsCount + ' document attached.' : '') + '</td>'
                    html3 += '</tr>'

                });

                $("#bindComPopdata").html("");
                $("#bindComPopdata").append(html3);

                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    $('input[type = "date"]').removeAttr("onkeydown");
                    $('input[type = "date"]').removeAttr("onkeypress");
                }
                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
                $('input[type = "date"]').blur(function () {
                    var dateString = $(this).val();
                    if (regex.test(dateString)) {
                        var parts = dateString.split("-");
                        var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                        if (parseInt(parts[0]) < 1900) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        if (parseInt(parts[0]) > 3000) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        if (parseInt(parts[2]) == 00) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        var dtCurrent = new Date();
                        return true;
                    } else {
                        $(this).focus();
                        $(this).val("");
                        alert("Please enter a valid date.");
                        return false;
                    }
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }

    /*Save case reply communication*/
    /*Communication pop member Pagination Start*/
    var isCommPopRnd = false;
    //var setCommPopNo = 1;
    function CommPopRenderPagination(pageindex, totdata) {
        let totPages = totdata;
        repcommupageindex = pageindex;
        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis

        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btncommPop ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#popUpPageNumbers").html(paginationHtml);
        isCommPopRnd = true;
    }


    $(document).on("click", ".page-btncommPop", function () {
        let page = $(this).data("page");
        repcommupageindex = page;
        isCommPopRnd = true;
        $("#poptxtgopage").val("");
        loadCommuReply(repcommupageindex, loadcomuid);
        $(".page-btncommPop").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#PopPrev", function () {
        if (repcommupageindex > 1) {
            repcommupageindex = repcommupageindex - 1;
        }
        isCommPopRnd = true;
        $("#poptxtgopage").val("");
        loadCommuReply(repcommupageindex, loadcomuid);

        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + repcommupageindex + "']").addClass("active");
    });


    $(document).on("click", "#PopNext", function () {
        if (repcommupageindex => 1) {
            repcommupageindex = repcommupageindex + 1;
        }
        isCommPopRnd = true;
        $("#poptxtgopage").val("");
        loadCommuReply(repcommupageindex, loadcomuid);

        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + repcommupageindex + "']").addClass("active");
    });

    $(document).on("click", "#divpopGo", function () {
        let goToPage = parseInt($("#poptxtgopage").val());
        if (!isNaN(goToPage)) {
            repcommupageindex = goToPage;
        }
        isCommPopRnd = true;
        loadCommuReply(repcommupageindex, loadcomuid);

        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + repcommupageindex + "']").addClass("active");
    });

    /*Communication popup Pagination End*/

    /*Save case reply communication*/
    $("#sendButton").click(function () {
        var formData = new FormData();
        var details = $("#replymessage").val();
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("FileUploadcommureply").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("FileUploadcommureply").files[i];
            var filename = file.name;
            //validate filechracter
            var fileNameIndex = filename.lastIndexOf("/") + 1;
            var dotIndex = filename.lastIndexOf('.');
            var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
            var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
            if (reg.test(newfioename) == true) {
                alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                return false;
            }
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
                return false;
            }
            formData.append("FileUpload", file);
            try {
                if (typeof (file) != "undefined") {
                    size = parseFloat(file.size / 1024).toFixed(2);
                    tottempsize = parseFloat(tottempsize) + parseFloat(size);
                    tempsize = parseFloat(size);
                }
            }
            catch (err) {
                //alert(err.message);
            }
            tempsize = tempsize.toFixed(2);
            if (tempsize > filesize) {
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
        if (tottempsize > parseFloat(TOTALLIMIT)) {
            alert(TOTALLIMITMSG);
            return false;
        }
        formData.append("commuid", $("#hidecomuid").val());
        formData.append("details", details);
        var mykasefileidcommureply = $("#mykasefileidcommureply").val();
        if (String(mykasefileidcommureply) == "undefined") {
            mykasefileidcommureply = "";
        }
        if (totalFiles == 0 && details == "" && mykasefileidcommureply == "") {
            return false;
        }
        formData.append("savemykasefileid", mykasefileidcommureply);
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveReplyCaseCommunique",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data.Result) > 0) {
                    var InfectFilesResult = "";
                    if (response.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    new PNotify({
                        title: 'Success!',
                        text: 'Your message is sent to the desired recipient successfully.</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    $("#mykasefileidcommureply").val("");
                    $("#browsefilecommunique").attr("title", "No file chosen");
                    $("#browsefilelblcommunique").html("No file chosen");
                    $("#replymessage,#FileUploadcommureply").val("");
                    loadCommuReply(repcommupageindex, loadcomuid);
                    BindCaseCommunique(cdcpageindex);
                    closeload();
                }
                else if (String(response.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    closeload();
                    return false;
                }
                else if (String(response.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    closeload();
                    return false;
                }
                else {
                    alert(response.Data);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                //alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    /*Download files*/
    $(document).on("click", "#downloadfiles", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var durl = $(this).attr("href-val");
        some = new URLSearchParams(durl)
        var ftype = some.get('ftype');
        var ftokens = some.get('ftoken');
        window.location.href = durl;
    });
    var uploadprogressflag = false;
    var maliciousConfirm = "false";
    var Againupload = "false";
    var infectedfilename = "";
    var flagtoken = true;
    var tokendocrequest = "";
    $("#cancelvirusupload").click(function () {
        //save without malicious docs
        $("#exampleModal").modal('hide');
        Againupload = "true";
        maliciousConfirm = "true";
        infectedfilename = $("#maliciousfilename").val();
        $("#createfiles").click();
    });
    $("#confirmvirusupload").click(function () {
        $("#exampleModal").modal('hide');
        Againupload = "true";
        maliciousConfirm = "true";
        infectedfilename = "";
        $("#createfiles").click();
    });
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /*Create files*/
    $("#createfiles").click(function () {
        isDocRnd = false;
        uploadprogressflag = true;
        var chkArray3 = [];
        var selected = $("input[name='options[]']:checked")
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
            //alert(selected3);
        }
        var dname = $("#directory").val();
        if (dname == "" && directoryid == 0) {
            dname = dname;
        }
        else if (dname == "" && directoryid != 0) {
            dname = directoryid;
        }
        var filedetails = $("#filedetails").val();
        var cmatter = $("#cmatter").val();
        if (tempcasetoken != "") {
            if ($("#directory").val() != "") {
                tempcasetoken = "";
                finaltoken = $("#directory").val();
            }
        }
        else {
            if ($("#directory").val() != "") {
                finaltoken = $("#directory").val();
            }
        }
        var formData = new FormData();
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            var tottempsize = 0;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
                //validate filechracter
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                    return false;
                }
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                var Extresponse = checkfileextDOC(filename);
                if (String(Extresponse) == "false") {
                    return false;
                }
                formData.append("FileUpload", file);
                try {
                    //var fileUpload = document.getElementById("attachment");
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tottempsize = parseFloat(tottempsize) + parseFloat(size);
                        tempsize = parseFloat(size);
                    }
                }
                catch (err) {
                    //alert(err.message);
                }
                tempsize = tempsize.toFixed(2);
            }

            formData.append("selectedpermission", selected3);
            formData.append("dirname", finaltoken);
            formData.append("details", filedetails);
            formData.append("cmatter", tempcasetoken);
            formData.append("isindex", 0);
            formData.append("maliciousConfirm", maliciousConfirm);
            formData.append("Againupload", Againupload);
            formData.append("infectedfilename", infectedfilename);
            var randomeno = Math.floor(Math.random() * 30) + 1;
            $("#progressBarstatus").show();
            $(".progress").show();
            if (flagtoken == true) {
                tokendocrequest = makeid(10);
            }
            formData.append("tokendocrequest", tokendocrequest);
            openload();
            $.ajax({
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                            $('#progressBar').attr('aria-valuenow', percent - randomeno).css('width', percent - randomeno + '%').text(percent - randomeno + '%');
                        }
                    });
                    return xhr;
                },
                url: '/api/AzureApi/Createfile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $('#attachment').find("*").prop("disabled", true);
                    uploadprogressflag = false;
                    $(".progress").show();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create file for other users directory");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        if (String(response.Data) == "True" || String(response.Data) == "true") {
                            maliciousConfirm = "false";
                            var datas = JSON.stringify(response);
                            $('#progressBar').attr('aria-valuenow', 100).css('width', 100 + '%').text(100 + '%');
                            $("#dirbound").html('');
                            $("#progressBarstatus").hide();
                            $(".progress").hide();
                            LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);
                            new PNotify({
                                title: 'Success!',
                                text: ' File Uploaded Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            flagtoken = true;
                            closeload();
                            $("#list").text("");
                            $("#myModal1 .close").click();
                        }
                        else {
                            $("#virusconfirmbody").html("The uploaded file (<b>" + response.Data.filename + "</b>) seems to be infected or containing malicious content.Are you sure to continue?");
                            $("#maliciousfilename").val(response.Data.filename);
                            $("#exampleModal").modal('show');
                            flagtoken = false;
                            closeload();
                        }
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    closeload();
                    alert('Error!');
                }
            });
        }
    });
    /*Team member profile*/
    $(document).on("click", "#teammemberprofile", function () {
        var userid = $(this).data('val');
        if (roleid == 3) {
            return false;
        }
        else {
            var urls = "/" + fcode + "/Firm/CaseUserProfile";
            url_redirect({
                url: urls,
                method: "post",
                //data: { "loginid": $("#teammemberprofile").attr('data-val'), "type": "1" }
                data: { "loginid": $(this).data('val'), "type": "1" }
            });
        }
    });
    var dochispageindex = 1, dochispagesize = 10, dochisrecordcount = 0, dochistotrecord = 0;
    var tempdocidshistory = "";
    $(document).on('click', '#dochispaginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        loadactivity(pageindex, tempdocidshistory);
        closeload();
    });
    $(document).on('click', '#dochisgetdatabypagenum', function () {
        pageindex = $("#dochispagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#dochissotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    loadactivity(pageindex, tempdocidshistory);
                    closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    /*Load activity details*/
    function loadactivity(dochispageindex, documentid) {
        $("#loadactivitydata").html("");
        var formdata = new FormData();
        formdata.append("pagenum", dochispageindex);
        formdata.append("pagesize", dochispagesize);
        formdata.append("docid", documentid);
        tempdocidshistory = documentid;
        var qty1 = 0;
        var html = '';
        var ajaxTime1 = new Date().getTime();
        $.ajax({
            async: true,
            url: "/api/CallApi/BindDocumentRecentActivity",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data != "[]") {
                }
                else {
                    $("#loadactivityfooter").html("No result found !");
                    closeload();
                }
                var totalTime1 = new Date().getTime() - ajaxTime1;
                console.log("activity:" + totalTime1);
                if (response.Data == "[]") {
                    $("#loadactivityfooter").html("No result found !");
                    var tfot = '';
                    tfot += '<div class="row settingpanel" style="margin: 14px 0 0 0;">'
                    tfot += '<div class="col-md-8"><div style="float:left;">Page Number <b style="font-size:12px;">0</b> &nbsp;of <b style="font-size:12px;"><span id="dochissotopage">0</span> Pages</b>'
                    tfot += '&nbsp;|&nbsp;<b style="font-size:12px;">Total 0 Entries</b>'
                    tfot += '</div>'
                    tfot += '<div style="float:left; padding: 4px 0 0 10px;">'
                    tfot += '</div></div>'
                    $("#footeractivitydata").html("");
                    $("#footeractivitydata").html(tfot);
                }
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                $("#footeractivitydata table").remove();
                $("#loadactivitydata ul").remove();
                $.each(obj, function (index, a) {
                    if (index === 0) {
                        firstvalue = a.rownum;
                    }
                    if (index === (length - 1)) {
                        var pnext = dochispageindex;
                        var pprev = dochispageindex;
                        var pageno = dochispageindex;
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (a.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(dochispagesize);
                            if (parseInt(totdata) % parseInt(dochispagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#dochispagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<div class="row settingpanel" style="margin: 14px 0 0 0;">'
                        tfot += '<div class="col-md-8"><div style="float:left;">Page Number <b style="font-size:12px;">' + pageindex + '</b> &nbsp;of <b style="font-size:12px;"><span id="dochissotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        tfot += '&nbsp;|&nbsp;<b style="font-size:12px;">Total ' + a.totRow + ' Entries</b>'
                        tfot += '&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="dochispagnumvalue" min="1"  class="footerInput"><button class="gobtn" type="button" id="dochisgetdatabypagenum" style="margin-left:10px;padding:3px 5px !important;">Go</button>'
                        tfot += '</div>'
                        tfot += '<div style="float:left; padding: 4px 0 0 10px;">'
                        if (a.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<a id="dochispaginate" class="sbtbtn" style="padding: 5px 5px !important;" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i>Previous</a>'
                        }
                        else {
                            tfot += '<a id="dochispaginate" class="sbtbtn" style="padding: 5px 5px !important;" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i>Previous</a>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a id="dochispaginate" class="sbtbtn" title="Next Page" style="padding: 5px 5px !important; margin:0 0 0 10px;" href="javascript:void()" index="' + pnext + '"  >Next <i class="glyphicon glyphicon-chevron-right"></i></a>'
                        }
                        $("#footeractivitydata").html("");
                        $("#footeractivitydata").html(tfot);
                        // closeload();
                        $("#loadactivityfooter").html('');
                    }
                    qty1 = qty1 + 1;
                    html += '<ul class="todo-list" style="list-style-type:none;">'
                    var linkpage = "";
                    var recentactivitycss = "";
                    var recenttext = "";
                    var recentlabel = "";
                    var recentlabelmode = "";
                    recentlabelmode = a.notification;
                    recentlabelmode = recentlabelmode.replace("You", a.UserName);
                    html += '<li class="recent"><span class="text">' + recentlabelmode + '</span><span> ' + formatDatetoIST(a.date_time) + ' ' + a.date_time.substring(11, 19) + '</span></li>'
                    html += '</ul>'
                });
                $("#loadactivitydata").hide().append(html).fadeIn('fast');
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }

    /*Open history box*/
    $(document).on("click", "#OpenHistoryBox", function () {
        var filetoken = $(this).attr("data-val");
        loadactivity(dochispageindex, filetoken);
        $("#modal_historydoc").modal();
    });
    $(document).on("click", "#filelinktimer", function () {
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=TimeEntry&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
    });
    var fcode = localStorage.getItem("FirmCode");

    /*Basic case details*/
    function CaseBasicDetails() {
        var formData = new FormData();
        formData.append("caseid", token);
        $.ajax({
            async: false,
            type: "POST",
            url: "/api/MatterApi/CaseBasicDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    IsRevenueCourt = a.IsRevenueCourt;
                    IsReraCourt = a.IsReraCourt;
                    //start for notice
                    var NoticeType = a.NoticeType;
                    var BulkNoticeType = a.BulkNoticeType;
                    var NoticeId = a.NoticeId;
                    if (NoticeId == "" || NoticeId == null || NoticeId == "null") {
                        $("#cdnoticetab").hide();
                    }
                    else {
                        $("#cdnoticetab").show();
                        if (NoticeType == "Notice") {
                            $("#cdnoticetab").attr("Module", "Notice").attr("data-val", NoticeId);
                        }
                        else if (NoticeType == "ReceivedNotice") {
                            $("#cdnoticetab").attr("Module", "ReceivedNotice").attr("data-val", NoticeId);
                        }
                        else {
                            $("#cdnoticetab").attr("Module", "BulkNotice").attr("data-val", NoticeId);
                        }
                    }
                    //end  for notice
                    if (a.UserCaseId == "" || a.UserCaseId == "null" || a.UserCaseId == null) {
                        UserCaseId = "";
                    }
                    $("#matteridforsidebar").val(a.Id);
                    $("#clientidforsidebar").val(a.matterclientid);
                    $("#transferpagetocase").text(a.ClientName);
                    $("#ncdcasename").text("" + a.mname.replace("&amp;", "&"));
                    if (a.ClientName != "") {
                        $("#ncdclientcontact").text(a.ClientName);
                    }
                    else {
                        $("#ncdclientcontact").text(a.ClientcontacName);
                    }
                    $("#ncdteamlead").text(a.TeamleadName);
                    $("#transferpagetocase").attr("data-val", a.matterclientid);
                    $("#ncdteamlead").attr("data-val", a.Teamlead);
                    $("#hdnusercaseid").val(a.UserCaseId);
                    $("#ddlExpenceCase1").val(a.mname);
                    if (a.CompanyId == "00000000-0000-0000-0000-000000000000" || a.CompanyId == "" || a.CompanyId == null) {
                        $("#clientdiv").show();
                        $("#companydiv").hide();
                    }
                    else {
                        $("#companydiv").show();
                        $("#clientdiv").hide();
                        $("#ncdcompanynames").text(a.CompanyName);
                        $("#ncdcompanynames").attr("data-val", a.CompanyId);
                    }
                    var segments = window.location.href.split('/');
                    var action = segments[5];
                    if (String(action) == "NewCaseDashboard" || String(action) == "NewCaseDashboard#") {
                        var sidematterid = $("#matteridforsidebar").val();
                        var sideclientid = $("#clientidforsidebar").val();
                        globalmatterids = sidematterid;
                        if (a.CompanyId == "00000000-0000-0000-0000-000000000000" || a.CompanyId == "") {
                            $("#commucompanyidsnamethide").val(a.CompanyId);
                            if (a.ClientName != "") {
                                $("#taskcontact,#sidebindcommuclient,#timecontact,#commucliennamethide").val(a.ClientName + '-(Individual)');
                            }
                        }
                        else {
                            if (a.CompanyName != "") {
                                $("#taskcontact,#sidebindcommuclient,#timecontact").val(a.CompanyName + '-(Company)');
                            }
                        }
                        globalclientId = sideclientid;
                        $("#clientnameid,#commuclienthide,#timecontactvalue").val(sideclientid);
                        if (a.CompanyId == "") {
                            $("#commucompanyidsnamethide").val("00000000-0000-0000-0000-000000000000");
                            $("#sideclientid").val(sideclientid);
                            if (a.ClientName != "") {
                                $("#commucliennamethide").val(a.ClientName + '-(Individual)');
                            }
                        }
                        if (sideclientid == "") {
                            sideclientid = "00000000-0000-0000-0000-000000000000";
                        }
                        setTimeout(function () {
                            $('#matter').empty();
                            $('#timematter').empty();
                            $('#sidebindcommucase').stop(true, true).empty();
                            $('#sidebindcommucase').html('');
                        }, 500);
                        //$('#matter').empty();
                        //$('#timematter').empty();
                        //$('#sidebindcommucase').empty();
                        //$('#sidebindcommucase').html('');
                        if (a.Firmid.toUpperCase() == "233B7B67-B630-4E6E-B374-76764BB7FE10" || a.Firmid.toUpperCase() == "204A9016-5EAC-4FDB-B5B0-5076E9AEBAEF") {

                        } else {
                            loadmatter_new(sideclientid, "#matter,#timematter,#sidebindcommucase", a.CompanyId);
                            $('#alertmember').empty().append('<option value="ALL">Select All User</option>').find('option:first').attr("selected", "selected");
                            setTimeout(function () {
                                $('#ddlExpenceCase1 option[value="' + sidematterid.toLowerCase() + '"]').prop("selected", true);
                                $('#ddlExpenceCase1 option[value="' + sidematterid.toUpperCase() + '"]').prop("selected", true);
                                $('#matter option[value="' + sidematterid.toLowerCase() + '"]').prop("selected", true);
                                $('#matter option[value="' + sidematterid.toUpperCase() + '"]').prop("selected", true);
                                $('#sidebindcommucase option[value="' + sidematterid.toLowerCase() + '"]').prop("selected", true);
                                $('#sidebindcommucase option[value="' + sidematterid.toUpperCase() + '"]').prop("selected", true);
                                $('#timematter option[value="' + sidematterid.toLowerCase() + '"]').prop("selected", true);
                                $('#timematter option[value="' + sidematterid.toUpperCase() + '"]').prop("selected", true);
                                $("#matter").change();
                                $("#sidebindcommucase").change();
                                $("#timematter").change();
                            }, 7000);
                        }
                    }
                });
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
        // }
    }
    /*NCD team lead*/
    $("#ncdteamlead").click(function () {
        if (roleid == 3) {
            return false;
        }
        else {
            var urls = "/" + fcode + "/Firm/CaseUserProfile";
            url_redirect({
                url: urls,
                method: "post",
                data: { "loginid": $("#ncdteamlead").attr('data-val'), "type": "1" }
            });
        }
    });
    $("#cdnoticetab").click(function () {
        if (roleid == 3) {
            var Modules = $(this).attr("module");
            var ValID = $(this).attr("data-val");
            if (Modules == "ReceivedNotice") {
                var urls = "/" + fcode + "/NoticeReceived/ReceivedNoticeList";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "NoitceId": ValID }
                });
            }
            else if (Modules == "Notice") {
                var urls = "/" + fcode + "/NoticeNew/DraftNotice";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "NoitceId": ValID }
                });
            }
            else if (Modules == "BulkNotice") {
                var urls = "/" + fcode + "/NoticeTemplate/NoticeListSharedToMe";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "NoitceId": ValID }
                });
            }
        }
        else {
            var Modules = $(this).attr("module");
            var ValID = $(this).attr("data-val");
            if (Modules == "ReceivedNotice") {
                var urls = "/" + fcode + "/NoticeReceived/ReceivedNoticeList?type=1";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "NoitceId": ValID }
                });
            }
            else if (Modules == "Notice") {
                var urls = "/" + fcode + "/NoticeNew/NewNoticeList?type=1";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "NoitceId": ValID }
                });
            }
            else if (Modules == "BulkNotice") {
                var urls = "/" + fcode + "/NoticeTemplate/BulkNoticeList";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "NoitceId": ValID }
                });
            }
        }
    });
    $(document).on("click", "#ncdclientname", function () {
        var type = $(this).attr("data-type");
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/EditContacts";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token, "type": type, "view": 1 }
        });
    });
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-val");
        finaltoken = token;
        if (roleid == 3) {
            return false;
        }
        else {
            var urls = "/" + fcode + "/Firm/ClientCaseList";
            url_redirect({
                url: urls,
                method: "post",
                data: { "clienttoken": token }
            });
        }
    });
    $(document).on("click", "#ncdcompanynames", function () {
        var token = $(this).attr("data-val");
        finaltoken = token;
        if (roleid == 3) {
            return false;
        }
        else {
            var urls = "/" + fcode + "/Firm/ClientCaseList";
            url_redirect({
                url: urls,
                method: "post",
                data: { "clienttoken": token }
            });
        }
    });
    ///////////////START CASE COMUUNIQUE //////////////////
    var cdcpageindex = 1, cdcpagesize = 10, cdcrecordcount = 0, cdctotrecord = 0;
    var chksflag = true;
    $("#searchcommu").click(function () {
        $("#searchremovecommu").show();
        if ($("#commuberiefsearch").val() == "") {
            $("#commuberiefsearch").attr("placeholder", "");
            $("#commuberiefsearch").focus();
        } else {
            /* your code here */
            BindCaseCommunique(1);
        }
        chksflag = true;
    });
    $("#searchremovecommu").click(function () {
        $("#searchremovecommu").hide();
        $("#commuberiefsearch").val("");
        var txtlength = $("#commuberiefsearch").val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                BindCaseCommunique(cdecpageindex);
                chksflag = false;
            }
        }
    });
    $(document).on('keyup', '#commuberiefsearch', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                BindCaseCommunique(cdecpageindex);
                chksflag = false;
            }
        }
    });

    /*Get data by page number*/
    $(document).on('click', '#tgetdatabypagenum', function () {
        ipageindex = $("#tpagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#tsotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    BindCaseCommunique(ipageindex);
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
    $(document).on('click', '#tpaginate', function () {
        ipageindex = $(this).attr("index");
        BindCaseCommunique(ipageindex);
    });

    /*Search communication*/
    $(document).on('click', '#searchcommunication', function () {
        var comfromdate = $("#searchfrom").val();
        var comtodate = $("#searchto").val();
        if (comfromdate == "" || comtodate == "") {
            alert("Enter date range");
            return false;
        }
        else {
            BindCaseCommunique(1);
        }
    });
    openload();
    $("#cdcfiltertype").change(function () {
        BindCaseCommunique(1)
    })
    $("#cdcfiltercreateby").change(function () {
        BindCaseCommunique(1)
    })
    $("#cdcfilteralertto").change(function () {
        BindCaseCommunique(1)
    })
    $("#taskteamcleardate").click(function () {
        $("#taskteamfilterdate").val("");
        $("#taskteamcleardate").css("display", "none");
        loadflag = true;
        cdtLoadTaskData(1);
    })
    $("#taskteamfilterdate").change(function () {
        loadflag = true;
        cdtLoadTaskData(1);
        $("#taskteamcleardate").css("display", "block");
    });

    /*Bind communication details*/
    var totalCommCount = 1;
    function BindCaseCommunique(cdcpageindex) {
        var comfromdate = $("#searchfrom").val();
        var comtodate = $("#searchto").val();
        $("#commutfooter").html("");
        var formData = new FormData();
        formData.append("pagenum", cdcpageindex);
        formData.append("pagesize", cdcpagesize);
        formData.append("filtertype", $("#cdcfiltertype").val());
        formData.append("filtercreatedby", $("#cdcfiltercreateby").val());
        formData.append("caseid", token);
        formData.append("berieffilter", $('#commuberiefsearch').val());
        formData.append("filteralertto", $('#cdcfilteralertto').val());
        formData.append("searchfrom", comfromdate);
        formData.append("searchto", comtodate);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CaseDashboardCaseCommuniqueList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Data == "[]") {
                    var tcomfot = '';
                    //$("#cdcommstatus").html("No result found !");
                    $("#cdcommstatus").show();
                    $("#CommPage").hide();
                    closeload();
                    tcomfot = '';
                    tcomfot += '<table style="width:100%;"><tr><td style="background: white !important" colspan= "12">'
                    tcomfot += '<div><ul>'
                    tcomfot += '<li><input value="' + comfromdate + '" type="date" id="searchfrom" onkeypress="return false;" class="form-control inputFormat" ></li>'
                    tcomfot += '<li>&nbsp;&nbsp;</li>'
                    tcomfot += '<li><input value="' + comtodate + '" type="date" id="searchto" onkeypress="return false;" class="form-control inputFormat" ></li>'
                    tcomfot += '<li><button type="button" id="searchcommunication" style="margin-left:10px;">Search</button></li>'
                    tcomfot += '</ul></div>'
                    tcomfot += '</td></tr></table>'
                    $("#commutfooter").empty().append(tcomfot);
                }
                else {
                    //$("#cdcommstatus").html("");
                    $("#cdcommstatus").hide();
                    $("#CommPage").show();
                    closeload();
                }
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                var html3 = '';
                var ccount = 0;
                //$("#commutfooter table").remove();
                $.each(obj, function (i, a) {
                    ccount = ccount + 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    //if (i === (length - 1)) {
                    //    var pnext = cdcpageindex;
                    //    var pprev = cdcpageindex;
                    //    var pageno = cdcpageindex;
                    //    var totdata = a.totRow;
                    //    var totpage = 0;
                    //    if (a.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(cdcpagesize);
                    //        if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#tpagnumvalue").attr("max", totpage);
                    //    }
                    //    var tcomfot1 = '';
                    //    tcomfot1 += '<table style="width:100%;"><tr><td style="background: white !important;">'
                    //    tcomfot1 += '<div>Page Number <b style="font-size:12px;">' + cdcpageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="tsotopage">' + parseInt(totpage) + '</span> Pages</b>'
                    //    tcomfot1 += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                    //    tcomfot1 += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No:<input type="number" id="tpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="tgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button>'
                    //    if (a.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tcomfot1 += '<span>&nbsp;&nbsp;<a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>'
                    //    }
                    //    else {
                    //        tcomfot1 += '<span>&nbsp;&nbsp;<a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tcomfot1 += '<a  id="tpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span >'
                    //    }
                    //    tcomfot1 += '</div></td><td>'
                    //    tcomfot1 += '<div style="float:right;margin-top:-20px;">'
                    //    tcomfot1 += '<div><ul>'
                    //    tcomfot1 += '<li><input value="' + comfromdate + '" type="date" id="searchfrom" onkeypress="return false;" class="form-control inputFormat" ></li>'
                    //    tcomfot1 += '<li>&nbsp;&nbsp;</li>'
                    //    tcomfot1 += '<li><input value="' + comtodate + '" type="date" id="searchto" onkeypress="return false;" class="form-control inputFormat" ></li>'
                    //    tcomfot1 += '<li><button class="gobtn" type="button" id="searchcommunication" style="margin-left:10px;">Search</button></li>'
                    //    tcomfot1 += '</ul></div>'
                    //    tcomfot1 += '</div>'
                    //    tcomfot1 += '</td>'
                    //    tcomfot1 += '</tr></div>'
                    //    $("#commutfooter").empty().append(tcomfot1);
                    //}
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(cdcpagesize);
                        if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#invpagnumvalue").attr("max", totdata);
                        if (cdcpageindex == totpage) {
                            $('#CommNext').hide();
                            $('#CommPrev').css("display", "block");
                        }
                        else {
                            $('#CommNext').css("display", "block");
                        }
                        if (cdcpageindex == 1) {
                            $('#CommPrev').css("display", "none");
                        }
                        else {
                            $('#CommPrev').css("display", "block");
                        }

                        if (isCommRenderPage == false) {
                            totalCommCount = totpage;
                            CommRenderPagination(cdcpageindex, totpage);
                        }
                    }

                    var AssignBycolor = "";
                    var AssignTocolor = "";
                    var ClientName = a.ClientName;
                    var CaseName = a.CaseName;
                    var duerowcss = "";
                    var assignuser = "";
                    if (a.TotalcaseUser == a.TotalCommuUser) {
                        assignuser = "ALL TEAM";
                    }
                    else {
                        assignuser = a.assignuserto;
                    }
                    html3 += '<tr>'
                    html3 += '<td scope="row"><span class="text-success">' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    html3 += '<td style="display:none"><span>' + a.InformationType + '</span></td>'
                    html3 += '<td>'
                    html3 += '<span >' + a.Subject + '</span>'
                    html3 += '</td>'
                    if (a.Brief == "" || a.Brief == null || a.Brief == "null") {
                        html3 += '<td class="tbrief" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (a.Brief.length > 60) {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + a.Brief.substring(0, 60) + '</span>'
                            html3 += '<span data-toggle="collapse" data-target="#dto' + ccount + '" style="color:#069;cursor:pointer"> more</span>'
                            html3 += ' <div id="dto' + ccount + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            html3 += '' + a.Brief.trim().replace(/(<([^>]+)>)/ig, '') + ''
                            html3 += '</div>'
                            html3 += '<span style="float:right;cursor:pointer;" id="ReplyCommunication" title="Click here to reply communication." data-val="' + a.Id + '"><i class="fa fa-reply"></i></span>'
                            html3 += '</td>'
                        }
                        else {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + a.Brief.trim().replace(/(<([^>]+)>)/ig, '') + '</span>'
                            html3 += '<span style="float:right;cursor:pointer;" id="ReplyCommunication" title="Click here to reply communication." data-val="' + a.Id + '"><i class="fa fa-reply"></i></span>'
                            html3 += '</td > '
                        }
                    }
                    html3 += '<td>'
                    html3 += '<span >' + a.Createdby + '</span>'
                    html3 += '</td>'
                    if (assignuser == "" || assignuser == null || assignuser == "null") {
                        html3 += '<td class="tbrief" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (assignuser.length > 60) {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + assignuser.substring(0, 60) + '</span>'
                            html3 += '<span data-toggle="collapse" data-target="#userto' + ccount + '" style="color:#069;cursor:pointer"> more</span>'
                            html3 += ' <div id="userto' + ccount + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;right:200px;">'
                            html3 += '' + assignuser + ''
                            html3 += '</div>'
                            html3 += '</td>'
                        }
                        else {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + assignuser + '</span></td>'
                        }
                    }
                    html3 += '<td>'
                    if (a.DocsCount > 0) {
                        html3 += '<button type="button" class="taskoutboxbtnicon" id-val="' + a.Id + '" id="filelinkcommu"><i class="glyphicon glyphicon-folder-open"></i></button>'
                    }
                    else {
                        html3 += '';
                    }
                    html3 += '</td>'
                    html3 += '</tr>'
                });
                $("#cdbindcommunique").html("");
                $("#cdbindcommunique").append(html3);
                var showChar = 150;
                var ellipsestext = "...";
                var moretext = "more";
                var lesstext = "less";
                $('.more').each(function () {
                    var content = $(this).html();
                    if (content.length > showChar) {
                        var c = content.substr(0, showChar);
                        var h = content.substr(showChar - 1, content.length - showChar);
                        var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="javascript:void()" class="morelink">' + moretext + '</a></span>';
                        $(this).html(html);
                    }
                });
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    $('input[type = "date"]').removeAttr("onkeydown");
                    $('input[type = "date"]').removeAttr("onkeypress");
                }
                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
                $('input[type = "date"]').blur(function () {
                    var dateString = $(this).val();
                    if (dateString != "") {
                        var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
                        var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                        var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                        //Check whether valid dd/MM/yyyy Date Format.
                        if (regex.test(dateString)) {
                            var parts = dateString.split("-");
                            if (parseInt(parts[0]) < 1900) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[0]) > 3000) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[2]) == 00) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            var dtCurrent = new Date();
                            return true;
                        } else {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                    }
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }

    /*Communication member Pagination Start*/
    var isCommRenderPage = false;
    var setCommPageNo = 1;
    function CommRenderPagination(pageindex, totdata) {

        let totPages = totdata;
        cdcpageindex = pageindex;
        totalPageInv = totdata;

        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis


        if (totdata <= maxVisible + 2) {

            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btncomm ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btncomm ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btncomm ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#CommPageNumbers").html(paginationHtml);
        isCommRenderPage = true;
    }


    //var setInvPageNo = 1;
    $(document).on("click", ".page-btncomm", function () {
        let page = $(this).data("page");
        cdcpageindex = page;
        isCommRenderPage = true;
        $("#CommTxtgopage").val("");
        BindCaseCommunique(cdcpageindex);
        $(".page-btncomm").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#CommPrev", function () {
        if (cdcpageindex > 1) {
            cdcpageindex = cdcpageindex - 1;
        }
        isCommRenderPage = true;
        $("#CommTxtgopage").val("");
        BindCaseCommunique(cdcpageindex);
        $(".page-btncomm").removeClass("active");
        $(".page-btncomm[data-page='" + cdcpageindex + "']").addClass("active");
    });


    $(document).on("click", "#CommNext", function () {
        if (cdcpageindex => 1) {
            cdcpageindex = cdcpageindex + 1;
        }
        isCommRenderPage = true;
        firstload = true;
        $("#CommTxtgopage").val("");
        BindCaseCommunique(cdcpageindex);
        $(".page-btncomm").removeClass("active");
        $(".page-btncomm[data-page='" + cdcpageindex + "']").addClass("active");
    });

    $(document).on("click", "#CommDivGo", function () {
        let goToPage = parseInt($("#CommTxtgopage").val());
        if (!isNaN(goToPage)) {
            cdcpageindex = goToPage;
        }
        if (goToPage == 0) {
            alert("Please enter a valid page number.");
            cdcpageindex = 1;
            return false;
        }
        if (goToPage > totalCommCount) {
            alert("Please enter a valid page number.");
            cdcpageindex = 1;
            return false;
        }
        firstload = true;
        isCommRenderPage = true;
        BindCaseCommunique(cdcpageindex);
        $(".page-btncomm").removeClass("active");
        $(".page-btncomm[data-page='" + cdcpageindex + "']").addClass("active");
    });

    /*Communication Pagination End*/
    //var moretext = "more";
    //var lesstext = "less";
    //$(document).on("click", ".morelink", function () {
    //    if ($(this).hasClass("less")) {
    //        $(this).removeClass("less");
    //        $(this).html(moretext);
    //    } else {
    //        $(this).addClass("less");
    //        $(this).html(lesstext);
    //    }
    //    $(this).parent().prev().toggle();
    //    $(this).prev().toggle();
    //    return false;
    //});
    var moretext = "more";
    var lesstext = "less";
    $(document).on("click", ".morelink", function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
    ///////////////END CASE COMUUNIQUE //////////////////
    ///////////////START CASE TEAM TASK //////////////////
    var cdtpageindex = 1, cdtpagesize = 10, cdtrecordcount = 0, cdttotrecord = 0;
    openload();
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
    var number = getUrlVars()["type"];
    if (roleid == 3) {
        if (number == "Invoice") {
            $("#invoicelist").show();
            $("#invoicetabtab").addClass("active");
            $("#cdcommunique").hide();
            $("#cdcommutab").removeClass("active");
            $("#cstasklist").hide();
            $("#cdtasktab").removeClass("active");
            $("#cexpenselist").hide();
            $("#fincesdiv").hide();
            $("#cfinances").removeClass("active");
            setTimeout(myFunction2, 5000)
            function myFunction2() {
                document.getElementById("invoicetabtab").click();
            }
        }
        else {
            BindCaseCommunique(cdcpageindex);
        }
    }
    else if (number == "SentCommunication") {
        BindCaseCommunique(cdcpageindex);
        $("#cdcommunique").show();
        $("#cdcommutab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
    }
    else if (number == "AddTeamMember") {
        BindTeamMembers();
        $("#csteammemberlist").show();
        $("#cdteammembertab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
    }
    else if (number == "UploadDoc") {
        LoadDirectoryFiles(cdddpageindex, "", directorytokendefault);
        $("#cddoc").show();
        $("#cddoctab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
    }
    else if (number == "CreateTimeEntry") {
        BindTimeEntry();
        $("#cdtimeentry").show();
        $("#cdtimeentrytab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
    }
    else if (number == "CW") {
        $("#cshearinglist").show();
        $("#cdhearingtab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        setTimeout(myFunction, 5000)
        function myFunction() {
            document.getElementById("cdhearingtab").click();
        }
    }
    else if (number == "Expense") {
        $("#csteammemberlist").hide();
        $("#expensetabtab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").show();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
    }
    else {
        $("#cshearinglist").show();
        $("#cdhearingtab").addClass("active");
        $("#cstasklist").hide();
        $("#cdtasktab").removeClass("active");
        $("#cexpenselist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        setTimeout(myFunction, 5000)
        function myFunction() {
            document.getElementById("cdhearingtab").click();
        }

        //LoadDirectoryFiles(cdddpageindex, "", directorytokendefault);
        //$("#cddoc").show();
        //$("#cddoctab").addClass("active");
        //$("#cstasklist").hide();
        //$("#cdtasktab").removeClass("active");
    }
    //Finances Modules View
    $("#cfinances").click(function () {
        $("#cdcommunique").hide();
        $("#cstasklist").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cshearinglist").hide();
        $("#csteammemberlist").hide();
        $("#cdcommutab").removeClass("active");
        $("#fincesdiv").show();
        $("#InvCustModel").hide();
        $("#cfinances").addClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#cdteammembertab").removeClass("active");
        $("#ExpCustModel").hide();

    })
    $("#filtertask").change(function () {
        isTaskRenderPage = false;
        cdtLoadTaskData(1);
    })
    $("#filterclient").change(function () {
        isTaskRenderPage = false;
        cdtLoadTaskData(1);
    })
    $("#casefilterTTStatus").change(function () {
        isTaskRenderPage = false;
        cdtLoadTaskData(1);
    });
    $("#casefilterTTAssignTo").change(function () {
        isTaskRenderPage = false;
        cdtLoadTaskData(1);
    });
    $("#casefilterTTAssignBy").change(function () {
        isTaskRenderPage = false;
        cdtLoadTaskData(1);
    });

    /*Load task details*/
    var totalTaskCount = 1;
    function cdtLoadTaskData(cdtpageindex) {
        //$("#cdtfooter").html("");
        var ihtml3 = '';
        var formData = new FormData();
        formData.append("pagenum", cdtpageindex);
        formData.append("pagesize", cdtpagesize);
        formData.append("datefilter", "");
        formData.append("filtertask", $("#filtertask").val());
        formData.append("filterclient", $("#filterclient").val());
        formData.append("filteruser", "");
        formData.append("caseid", token);
        formData.append("assignby", $("#casefilterTTAssignBy").val());
        formData.append("assignto", $("#casefilterTTAssignTo").val());
        formData.append("status", $("#casefilterTTStatus").val());
        formData.append("filterduedate", $("#taskteamfilterdate").val());
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CaseDashboardCaseTaskList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data == "[]") {
                    $('#taskPage').hide();
                    //$("#cddataescstatus").html("No result found !");
                    $("#cddataescstatus").show();
                    closeload();
                }
                else {
                    //$("#cddataescstatus").html("");
                    $("#cddataescstatus").hide();
                    closeload();
                }
                var obj = JSON.parse(response1.Data);
                var ilength = obj.length;
                $.each(obj, function (i, a) {
                    irowcount = 1;
                    if (i === 0) {
                        ifirstvalue = a.rownum;
                    }
                    //if (i === (ilength - 1)) {
                    //var ipnext = cdtpageindex;
                    //var ipprev = cdtpageindex;
                    //var ipageno = cdtpageindex;
                    //var itotdata = a.totRow;
                    //var itotpage = 0;
                    //if (a.totRow > 0) {
                    //    ipnext = parseInt(ipnext) + 1;
                    //    if (ipnext == 0) ipnext = 1;
                    //    ipprev = parseInt(ipageno) - 1;
                    //    if (ipprev == 0) ipprev = 1;
                    //    itotpage = parseInt(itotdata) / parseInt(cdtpagesize);
                    //    if (parseInt(itotdata) % parseInt(cdtpagesize) != 0) {
                    //        itotpage = parseInt(itotpage) + 1;
                    //    }
                    //    $("#ipagnumvalue").attr("max", itotpage);
                    //}
                    //var itfot = '';
                    //itfot += '<table style="width:100%;"><tr><td style="background: white !important;" colspan = "12">'
                    //itfot += '<div style="float:left;padding-top: 7px;">Page Number <b style="font-size:12px;">' + cdtpageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="isotopage">' + parseInt(itotpage) + '</span> Pages</b>'
                    //itfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + ifirstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                    //itfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="ipagnumvalue" min="1" class="footerInput"><button class="gobtn" type="button" id="igetdatabypagenum" style="margin-left:10px;">Go</button>'
                    //itfot += '</div>'
                    //itfot += '<div style="float:right;">'
                    //if (a.totRow <= ilength) {
                    //}
                    //else if (ipageno == 1) {
                    //}
                    //else if (ipageno == itotpage) {
                    //    itfot += '<a id="ipaginate" class="btn  btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + ipprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                    //}
                    //else {
                    //    itfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + ipprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                    //}
                    //if (ipageno < itotpage) {
                    //    itfot += '<a id="ipaginate" class="btn btn-sm btn-default" title="Next Page" href="javascript:void()" index="' + ipnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                    //}
                    //itfot += '</td >'
                    //itfot += '</tr >'
                    //$("#cdtfooter").empty().append(itfot);

                    //}

                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (ilength - 1)) {
                        totpage = parseInt(totdata) / parseInt(cdtpagesize);
                        if (parseInt(totdata) % parseInt(cdtpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        //$("#ArchcaseCount").text("(" + val.totRow + ")");
                        $("#ipagnumvalue").attr("max", totdata);
                        if (cdtpageindex == totpage) {
                            $('#TaskNext').hide();
                            $('#taskPrev').css("display", "block");
                        }
                        else {
                            $('#TaskNext').css("display", "block");
                        }
                        if (cdtpageindex == 1) {
                            $('#taskPrev').css("display", "none");
                        }
                        else {
                            $('#taskPrev').css("display", "block");
                        }

                        if (isTaskRenderPage == false) {
                            totalTaskCount = totpage;
                            renderTaskPagination(cdtpageindex, totpage);
                            $('#taskPage').show();
                        }
                    }



                    var iAssignBycolor = "";
                    var iAssignTocolor = "";
                    var iClientName = a.ClientName;
                    if (iClientName == "") {
                        iClientName = "Test Client";
                    }
                    var iCaseName = a.CaseName;
                    var iAssignBy = a.AssignBy;
                    var iAssignTo = a.AssignTo;
                    var iAssignBy = a.AssignBy;
                    if (iAssignTo == "ME") {
                        var iAssignTocolor = "#069";
                    }
                    else {
                        var iAssignTocolor = "maroon";
                    }
                    var iAssignBy = a.AssignBy;
                    if (iAssignBy == "ME") {
                        iAssignBycolor = "#069";
                    }
                    else {
                        var iAssignBycolor = "maroon";
                    }
                    var istr = a.CreateDate;
                    var itemptype = istr.replace(/[^a-zA-Z0-9]/g, "");
                    ihtml3 += '<tr>'
                    ihtml3 += '<td scope="row">' + formatDatetoIST(a.CreateDate) + '</th>'
                    ihtml3 += '<td><span>' + a.TaskName + '</span></td>'
                    ihtml3 += '<td>'
                    ihtml3 += 'By: <span id="clname" style="font-size:14px;color:' + iAssignBycolor + ';"> ' + iAssignBy + '</span><br>'
                    ihtml3 += '</td>'
                    ihtml3 += '<td>'
                    ihtml3 += 'To:<span style="font-size:14px;color:' + iAssignTocolor + ';"> ' + iAssignTo + '</span>'
                    ihtml3 += '</td>'
                    ihtml3 += '<td>' + formatDatetoIST(a.TaskDueDate) + '</td>'
                    if (a.Status == "Completed") {
                        ihtml3 += '<td><span><img src="/newassets/img/completed.png"></span></td>'
                        //ihtml3 += '<td><span class="text-success" style="font-size:12px;">' + a.Status + '</span>'
                    }
                    else if (a.Status == "In Process") {
                        ihtml3 += '<td><span><img src="/newassets/img/inprogress.png"></span></td>'
                        //ihtml3 += '<td><span class="text-primary" style="font-size:12px;">' + a.Status + '</span>'
                    }
                    else if (a.Status == "Rejected") {
                        ihtml3 += '<td><span><img src="/newassets/img/rejected.png"></span></td>'
                        //ihtml3 += '<td><span style="color:red;"><span class="glyphicon glyphicon-info-sign" title="' + a.RejectDetails + '"></span> ' + a.Status + '</span></td>'
                    }
                    else if (a.Status == "Overdue Rejected") {
                        ihtml3 += '<td><span><img src="/newassets/img/overdue-rejected.png"></span></td>'
                        //ihtml3 += '<td><span style="color:red;"><span class="glyphicon glyphicon-info-sign" title="' + a.RejectDetails + '"></span>' + a.Status + '</span></td>'
                    }
                    else {
                        ihtml3 += '<td><span><img src="/newassets/img/overdue.png"></span></td>'
                        //ihtml3 += '<td><span class="text-danger" style="font-size:12px;">' + a.Status + '</span>'
                    }
                    //Final and assigned document

                    ihtml3 += '<td class="scattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="openDocPopup" ><img src="/newassets/img/folder.svg" /></span></td>'

                    //if (a.DocsCount > 0) {
                    //    ihtml3 += '<td class="scattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="filelink"><img src="/newassets/img/file.svg" /></span></td>'
                    //}
                    //else {
                    //    ihtml3 += '<td class="scattach"></td>';
                    //}
                    //if (a.CompleteDocsCount > 0) {
                    //    ihtml3 += '<td class="comattach"><span style="cursor:pointer; text-align:center;" id-val="' + a.Tid + '" id="completetaskfilelink"><i class="glyphicon glyphicon-folder-open"></i></span></td>'
                    //}
                    //else {
                    //    ihtml3 += '<td class="comattach"></td>';
                    //}
                    ihtml3 += '<td>' + a.TDetails + '</td>'
                    if (a.TaskSubject == "" || a.TaskSubject == null || a.TaskSubject == "null") {
                        ihtml3 += '<td class="otsubject" ></td>'
                    }
                    else {
                        ihtml3 += '<td class="osubject"><span>' + a.TaskSubject + '</span></td>'
                    }
                    ihtml3 += '</td>'
                    ihtml3 += '</tr>'
                });
                $("#cdbindcasetask").html("");
                $("#cdbindcasetask").append(ihtml3);
                $("#cdefinbox").removeClass("fa-spin");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }

    $(document).on("click", "#openDocPopup", function () {
        fileTokenId = $(this).attr("id-val");

        $("#modalShowDocumentFileDocument").modal('show');
    });

    /*Task Pagination Start*/
    var isTaskRenderPage = false;
    var totalPageRec = "";
    function renderTaskPagination(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis

        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btntask ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btntask ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btntask ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }

        $("#taskPageNumbers").html(paginationHtml);
        isTaskRenderPage = true;
    }


    var setTaskPageNo = 1;
    $(document).on("click", ".page-btntask", function () {
        let page = $(this).data("page");
        setTaskPageNo = page;
        isTaskRenderPage = true;
        firstload = true;
        $("#tasktxtgopage").val("");
        cdtLoadTaskData(setTaskPageNo);
        $(".page-btntask").removeClass("active");
        $(this).addClass("active");
    });

    $("#taskPrev").click(function () {
        if (setTaskPageNo > 1) {
            setTaskPageNo = setTaskPageNo - 1;
        }
        isTaskRenderPage = true;
        firstload = true;
        $("#tasktxtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        cdtLoadTaskData(setTaskPageNo);

        $(".page-btntask").removeClass("active");
        $(".page-btntask[data-page='" + setTaskPageNo + "']").addClass("active");
    });

    $("#TaskNext").click(function () {
        if (setTaskPageNo => 1) {
            setTaskPageNo = setTaskPageNo + 1;
        }
        isTaskRenderPage = true;
        firstload = true;
        $("#tasktxtgopage").val("");
        cdtLoadTaskData(setTaskPageNo);

        $(".page-btntask").removeClass("active");
        $(".page-btntask[data-page='" + setTaskPageNo + "']").addClass("active");
    });

    $("#TaskdivGo").click(function () {
        let goToPage = parseInt($("#tasktxtgopage").val());
        if (!isNaN(goToPage)) {
            setTaskPageNo = goToPage;
        }

        if (goToPage > totalTaskCount || goToPage == 0) {
            alert("Please enter a valid page number.");
            setTaskPageNo = 1;
            return false;
        }
        isTaskRenderPage = true;
        cdtLoadTaskData(setTaskPageNo);

        $(".page-btntask").removeClass("active");
        $(".page-btntask[data-page='" + setTaskPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    /*AMPM format*/
    function formatAMPM(time) {
        var res = time.split(":");
        var hours = res[0];
        var minutes = res[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        if (minutes.length > 1) {
            minutes = minutes < 10 ? minutes : minutes;
        }
        else {
            minutes = minutes < 10 ? '0' + minutes : minutes;
        }
        hours = hours < 10 ? '0' + hours : hours;
        var strTime = hours + ':' + minutes + ' <span>' + ampm + '</span>';
        return strTime;
    }
    ///////////////END CASE TEAM TASK //////////////////
    ///////////////START CASE External contacts//////////////////
    var cdecpageindex = 1, cdecpagesize = 10, cdecrecordcount = 0, cdectotrecord = 0;

    /*Get data by page number*/
    $(document).on('click', '#cgetdatabypagenum', function () {
        cdecpageindex = $("#cpagnumvalue").val();
        if (cdecpageindex != "undefined") {
            if (Math.sign(cdecpageindex) == 1) {
                var ipageindesx = $("#csotopage").text();
                if (cdecpageindex <= parseInt(ipageindesx)) {
                    cdecontactLoaddata(cdecpageindex);
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
    $(document).on('click', '#cpaginate', function () {
        cdecpageindex = $(this).attr("index");
        cdecontactLoaddata(cdecpageindex);
    });
    /*Get task load by page number*/
    $(document).on('click', '#igetdatabypagenum', function () {
        ipageindex = $("#ipagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#isotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    cdtLoadTaskData(ipageindex);
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
    $(document).on('click', '#ipaginate', function () {
        ipageindex = $(this).attr("index");
        cdtLoadTaskData(ipageindex);
    });
    openload();

    /*Load contact data*/
    var totalContactCount = 1;
    function cdecontactLoaddata(cdecpageindex) {
        $("#cdecfooter").html("");
        var ihtml3 = '';
        var formData = new FormData();
        formData.append("caseid", token);
        formData.append("pagenum", cdecpageindex);
        formData.append("pagesize", cdecpagesize);
        if (roleid == "3") {
            $.ajax({
                async: true,
                url: '/api/CallApi/LoadCreateUserByCaseId',
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    $("#tmtfooter").html("");
                    $("#tokens").html("");
                    var length = 0;
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                        length = obj.length;
                    }
                    else {
                        closeload();
                    }
                    if (response.Data.length > 2) {
                        $("#cdeucstatus").hide();
                        $("#pagecdeucstatus").show();
                        //$("#cdeucstatus").html("");
                        closeload();
                    }
                    else {
                        $("#cdeucstatus").show();
                        $("#pagecdeucstatus").hide();
                        //$("#cdeucstatus").html("No result found !");
                        closeload();
                    }
                    var it = 2;
                    var qty = 0;
                    var count = 1;
                    var html3 = "";
                    
                    $.each(obj, function (i, val) {

                        var totdata = length;
                        var totpage = 0;

                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(cdtpagesize);
                            if (parseInt(totdata) % parseInt(cdtpagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#cpagnumvalue").attr("max", val.totRow);
                            if (cdecpageindex == totpage) {
                                $('#next1a').hide();
                                $('#prev1a').css("display", "block");
                            }
                            else {
                                $('#next1a').css("display", "block");
                            }
                            if (cdecpageindex == 1) {
                                $('#prev1a').css("display", "none");
                            }
                            else {
                                $('#prev1a').css("display", "block");
                            }

                            if (isRenderPage == false) {
                                totalContactCount = totpage;
                                renderPagination(cdecpageindex, totpage);
                            }
                        }



                        html3 += '<tr>';
                        var updaterownum = count++;
                        html3 += '<td class="client">' + val.Name + '</td>';
                        html3 += '<td class="client">' + val.EmailId + '</td>';
                        html3 += '<td class="billedby">' + val.cmobile + '</td>';
                        html3 += '</tr>';
                    });
                    $("#cdecbind").empty().html(html3);
                    closeload();
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
        else {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/MatterApi/CaseExternalContact",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == "[]") {
                        //$("#cdeucstatus").html("No result found !");
                        $("#cdeucstatus").show();
                        $("#pagecdeucstatus").hide();
                        closeload();
                    }
                    else {
                        //$("#cdeucstatus").html("");
                        $("#cdeucstatus").hide();
                        $("#pagecdeucstatus").show();
                        closeload();
                    }
                    var obj = JSON.parse(response1.Data);
                    var ilength = obj.length;
                    $("#cdecbind tr").remove();
                    $("#cdecfooter ul").remove();
                    $("#cdecfooter").html("");
                    var ifirstvalue = 0;
                    $.each(obj, function (i, a) {
                        irowcount = 1;
                        if (i === 0) {
                            ifirstvalue = a.rownum;
                        }
                        //if (i === (ilength - 1)) {
                        //    var ipnext = cdecpageindex;
                        //    var ipprev = cdecpageindex;
                        //    var ipageno = cdecpageindex;
                        //    var itotdata = a.totRow;
                        //    var itotpage = 0;
                        //    if (a.totRow > 0) {
                        //        ipnext = parseInt(ipnext) + 1;
                        //        if (ipnext == 0) ipnext = 1;
                        //        ipprev = parseInt(ipageno) - 1;
                        //        if (ipprev == 0) ipprev = 1;
                        //        itotpage = parseInt(itotdata) / parseInt(cdtpagesize);
                        //        if (parseInt(itotdata) % parseInt(cdtpagesize) != 0) {
                        //            itotpage = parseInt(itotpage) + 1;
                        //        }
                        //        $("#cpagnumvalue").attr("max", itotpage);
                        //    }
                        //    var itfot = '';
                        //    itfot += '<table style="width:100%;"><tr><td style="background: white !important" colspan = "12">'
                        //    itfot += '<div><ul>'
                        //    itfot += '<li>results <span>' + a.totRow + '</span>  <span id="csotopage" style="display:none">' + itotpage + '</span></li>'
                        //    itfot += '<li><span>|</span></li>'
                        //    itfot += '<li>pages ' + cdecpageindex + '/ ' + parseInt(itotpage) + '</li>'
                        //    itfot += '<li><span>|</span></li>'
                        //    itfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput"  ><a class="gobtn" type="button" id="cgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        //    if (a.totRow <= ilength) {
                        //    }
                        //    else if (ipageno == 1) {
                        //    }
                        //    else if (ipageno == itotpage) {
                        //        itfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" ></a></span> <span>'
                        //    }
                        //    else {
                        //        itfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" > </a></span><span>'
                        //    }
                        //    if (ipageno < itotpage) {
                        //        itfot += '<a  id="cpaginate" title="Next Page" href="javascript:void()" index="' + ipnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    itfot += '</ul></div></td></tr></table>'
                        //    $("#cdecfooter").html(itfot);
                        //    closeload();
                        //}

                        var totdata = a.totRow;
                        var totpage = 0;
                        if (i === (ilength - 1)) {
                            totpage = parseInt(totdata) / parseInt(cdtpagesize);
                            if (parseInt(totdata) % parseInt(cdtpagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#cpagnumvalue").attr("max", a.totRow);
                            if (cdecpageindex == totpage) {
                                $('#next1a').hide();
                                $('#prev1a').css("display", "block");
                            }
                            else {
                                $('#next1a').css("display", "block");
                            }
                            if (cdecpageindex == 1) {
                                $('#prev1a').css("display", "none");
                            }
                            else {
                                $('#prev1a').css("display", "block");
                            }

                            if (isRenderPage == false) {
                                totalContactCount = totpage;
                                renderPagination(cdecpageindex, totpage);
                            }
                        }
                        ihtml3 += '<tr>'
                        ihtml3 += '<td ><span id="ncdclientname" data-val="' + a.cid + '" data-type="' + a.ProfileType + '" style="cursor:pointer;color:#069;">' + a.FirstName + '</span></td>'
                        ihtml3 += '<td ><span id="ncdclientname" data-val="' + a.cid + '" data-type="' + a.ProfileType + '" style="cursor:pointer;color:#069;">' + a.LastName + '</span></td>'
                        ihtml3 += '<td>'
                        ihtml3 += '<span>' + a.Designation + '</span>'
                        ihtml3 += '</td>'
                        ihtml3 += '<td><span>' + a.MobileNo + '</span></td>'
                        if (a.Landline == null) {
                            ihtml3 += '<td></td>'
                        }
                        else {
                            ihtml3 += '<td><span>' + a.Landline + '</span></td>'
                        }
                        ihtml3 += '<td><span>' + a.Email + '</span></td>'
                        ihtml3 += '</tr>'
                    });
                    $("#cdecbind").html("");
                    $("#cdecbind").append(ihtml3);
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
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
                paginationHtml += `<button class="page-btn1a ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btn1a ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btn1a ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }

        $("#pageNumbers1a").html(paginationHtml);
        $("#prev1a").toggleClass("disabled", pageindex === 1);
        $("#next1a").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }


    var setPageNo = 1;
    $(document).on("click", ".page-btn1a", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        firstload = true;
        $("#txtgopage1a").val("");
        cdecontactLoaddata(setPageNo);
        $(".page-btn1a").removeClass("active");
        $(this).addClass("active");
    });

    $("#prev1a").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        firstload = true;
        $("#txtgopage1a").val("");
        //renderPagination(setPageNo, totalPageRec)
        cdecontactLoaddata(setPageNo);

        $(".page-btn1a").removeClass("active");
        $(".page-btn1a[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next1a").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        firstload = true;
        $("#txtgopage1a").val("");
        cdecontactLoaddata(setPageNo);
        $(".page-btn1a").removeClass("active");
        $(".page-btn1a[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo1a").click(function () {
        let goToPage = parseInt($("#txtgopage1a").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > totalContactCount || goToPage == 0) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        firstload = true;
        isRenderPage = true;
        cdecontactLoaddata(setPageNo);

        $(".page-btn1a").removeClass("active");
        $(".page-btn1a[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    $(document).on('click', '#ocontactexcel', function () {
        window.location = encodeURI("/firm/ExportoExcelCaseContact?status=true&caseid=" + token);
    });
    $(document).on('click', '#ocontactpdf', function () {
        window.location = encodeURI("/firm/ExportoPDFCaseContacts?status=true&caseid=" + token);
    })
    ///////////////END CASE External contacts //////////////////
    ///////////////START docs  //////////////////
    $(document).on('click', '#ddgetdatabypagenum', function () {
        ipageindex = $("#ddpagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#ddsotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    Binddocs(ipageindex);
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
    $(document).on('click', '#ddpaginate', function () {
        ipageindex = $(this).attr("index");
    });

    /*Bind docs*/
    function Binddocs(cdddpageindex) {
        $("#docstfooter").html("");
        var formData = new FormData();
        formData.append("pagenum", cdddpageindex);
        formData.append("pagesize", cdddpagesize);
        formData.append("caseid", token);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CaseDashboardCasedocs",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Data == "[]") {
                    $("#cddocsstatus").html("No result found !");
                    closeload();
                }
                else {
                    $("#cddocsstatus").html("");
                    closeload();
                }
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                var html = '';
                $.each(obj, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = cdcpageindex;
                        var pprev = cdcpageindex;
                        var pageno = cdcpageindex;
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (a.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(cdcpagesize);
                            if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#ddpagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<table style="width:100%;"><tr><td colspan = "12">'
                        tfot += '<div >Page Number <b style="font-size:12px;">' + cdcpageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="ddsotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="ddpagnumvalue" min="1"  style="width: 30px;"><button type="button" id="ddgetdatabypagenum" style="margin-left:10px;">Go</button>'
                        tfot += '</div>'
                        tfot += '<div style="float:right;margin-top:-25px;">'
                        if (a.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<a id="tpaginate" class="btn btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            tfot += '<a id="tpaginate" class="btn btn-sm btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a id="tpaginate" class="btn btn-sm btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        tfot += '</td >'
                        tfot += '</tr >'
                        $("#docstfooter").empty().append(tfot);
                    }
                    var dates2 = a.date_time;
                    var dates1 = formatDatetoIST(dates2);
                    //var ficon = "fa fa-language";
                    var ficon = 'file.svg'
                    var icolor = "black";
                    var str = a.filetype;
                    var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                    var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                    var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                    if (ftype == "DOC" || ftype == "DOCX") {
                        ficon = "doc.png";
                        icolor = "#1860a3";
                    }
                    if (ftype == "PPT") {
                        ficon = "ppt.png";
                        icolor = "orange";
                    }
                    if (ftype == "PDF") {
                        ficon = "pdf.svg";
                        icolor = "red";
                    }
                    if (ftype == "ZIP") {
                        ficon = "zip.png";
                        icolor = "orange";
                    }
                    if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                        ficon = "png.png";
                        icolor = "#1860a3";
                    }
                    if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                        ficon = "png.png";
                        icolor = "green";
                    }
                    if (ftype == "TXT") {
                        ficon = "pdf.png";
                        icolor = "skyblue";
                    }
                    qty1 = qty1 + 1;
                    var AssignBycolor = "";
                    var AssignTocolor = "";
                    var ClientName = a.ClientName;
                    var CaseName = a.CaseName;
                    var assignuser = "";
                    if (a.TotalcaseUser == a.TotalCommuUser) {
                        assignuser = "ALL TEAM";
                    }
                    else {
                        assignuser = a.assignuserto;
                    }
                    var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFIleId + "&token=" + a.id + "";
                    var checkoutpath = "/Azure/CheckoutFile?filename=" + a.fname + "&code=" + a.AZureFIleId + "&token=" + a.id + "";
                    var chkincss = "";
                    var chkoutcss = "";
                    if (a.IsCheckinOut == "1") {
                        chkoutcss = "display:none";
                        chkincss = "display:block";
                    }
                    else {
                        chkoutcss = "display:block";
                        chkincss = "display:none";
                    }
                    html += '<tr>';
                    html += '<td class="7"><img src="/newassets/img/' + ficon + '" /><span>' + a.fname + '</span></a>';
                    //html += '<td class="7"><i class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span> ' + a.fname + '</span></a>';

                    //html += '<div class="pull-right">';
                    //html += '<div class="btn-group" >';
                    //html += '<button type="button"  title="Click here to view document version" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                    //html += '<span><img src="/newassets/img/version-icon.png" /></span>';
                    //html += '<span class="sr-only">Toggle Dropdown</span>';
                    //html += '</button>';
                    //html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">';
                    //html += '<table class="table-panel" width="100%"><thead><tr><th>Sl NO.</th><th>Date</th><th>User</th><th>File Name</th></tr></thead>'
                    //html += '<tbody id="bindfileversion' + a.id + '" >';
                    //html += '</tbody>';
                    //html += '</table>';
                    //html += '</div>';
                    //html += '</div>';
                    html += '</div>';
                    html += '</td>';
                    html += '<td width="100px; ">' + dates1 + '</td> <td>' + last + '</td>';
                    html += '<td>' + a.assignby + '</td>';
                    html += '<td><a class="glyphicon glyphicon-download-alt" style="color:green; cursor:pointer" download="' + a.fname + '" id="downloadfile" href="' + downloadpath + '" values="' + a.id + '"> </a></btn>';
                    html += '</td >';
                    html += '</tr>';
                });
                $("#cdbinddocs").html("");
                $("#cdbinddocs").append(html);
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }
    /////end docs///////////////
    $("#cdcommutab").click(function () {
        $("#cdcommutab").addClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdteammembertab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#cdecontact").hide();
        $("#invoicelist").hide();
        $("#invoicetabtab").removeClass("active");
        $("#cstasklist").hide();
        $("#cdcommunique").show();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#csteammemberlist").hide();
        $("#chatchannellist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        BindCaseCommunique(cdcpageindex);
    });
    $("#cdtasktab").click(function () {
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").addClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#cstasklist").show();
        $("#invoicelist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#invoicetabtab").removeClass("active");
        $("#chatchannellist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        isTaskRenderPage = false;
        cdtLoadTaskData(cdtpageindex);
    });
    $("#cdcontactstab").click(function () {
        $("#cdcontactstab").addClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#invoicelist").hide();
        $("#cstasklist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").show();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#invoicetabtab").removeClass("active");
        $("#chatchannellist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        cdecontactLoaddata(cdecpageindex);
    });
    $("#cddoctab").click(function () {
        $("#cddoctab").addClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#cstasklist").hide();
        $("#invoicelist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").show();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#invoicetabtab").removeClass("active");
        $("#chatchannellist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        tempcasetoken = token;
        LoadDirectoryFiles(cdddpageindex, 0, directorytokendefault);
    });
    $("#cdtimeentrytab").click(function () {
        $("#cddoctab").removeClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").addClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#cstasklist").hide();
        $("#invoicelist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").show();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#invoicetabtab").removeClass("active");
        $("#chatchannellist").hide();
        $("#InvCustModel").hide();
        $("#ExpCustModel").hide();
        BindTimeEntry();
    });
    $("#cdteammembertab").click(function () {
        $("#cddoctab").removeClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#cstasklist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#invoicelist").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").addClass("active");
        $("#csteammemberlist").show();
        $("#invoicetabtab").removeClass("active");
        $("#chatchannellist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        isTeamRenderPage = false;
        BindTeamMembers();
    });
    $("#cdhearingtab").click(function () {
        $("#cddoctab").removeClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").addClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").show();
        $("#cstasklist").hide();
        $("#invoicelist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#invoicetabtab").removeClass("active");
        $("#chatchannellist").hide();
        $("#fincesdiv").hide();
        $("#cfinances").removeClass("active");
        CaseDataCaseWatch();
    });
    //Add new tab for invoice
    $("#invoicetabtab").click(function () {
        $("#invoicetabtab").addClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#invoicelist").show();
        $("#cstasklist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#chatchannellist").hide();
        $("#InvCustModel").show();
        $("#ExpCustModel").hide();
        loadInvoicedata();
    });
    $("#chatchannellisttab").click(function () {
        $("#chatchannellisttab").addClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#cdteammembertab").removeClass("active");
        $("#invoicetabtab").removeClass("active");
        $("#expensetabtab").removeClass("active");
        $("#cexpenselist").hide();
        $("#cshearinglist").hide();
        $("#cstasklist").hide();
        $("#invoicelist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#csteammemberlist").hide();
        $("#chatchannellist").show();
        ChannelList(1);
    });
    // new tab for expense list
    $("#expensetabtab").click(function () {
        $("#expensetabtab").addClass("active");
        $("#invoicetabtab").removeClass("active");
        $("#cdcommutab").removeClass("active");
        $("#cdtasktab").removeClass("active");
        $("#cdcontactstab").removeClass("active");
        $("#cddoctab").removeClass("active");
        $("#cdtimetab").removeClass("active");
        $("#cdtimeentrytab").removeClass("active");
        $("#cdhearingtab").removeClass("active");
        $("#cexpenselist").show();
        $("#cshearinglist").hide();
        $("#invoicelist").hide();
        $("#cstasklist").hide();
        $("#cdcommunique").hide();
        $("#cdecontact").hide();
        $("#cddoc").hide();
        $("#cdtimeentry").hide();
        $("#cdteammembertab").removeClass("active");
        $("#csteammemberlist").hide();
        $("#chatchannellist").hide();
        $("#cshearinglist").hide();
        $("#InvCustModel").hide();
        $("#ExpCustModel").show();
        isExRenderPage = false;
        LoadExpenseData(1);
        GetExpenseCategory(1);
        GetExpenseType();
    });
    //share invoice deatils 
    $(document).on("click", "#shareinvoiceclient", function () {
        $('#myModaldocsclient').modal({ show: true });
        tokenemail = $(this).attr("data-val");
        invtypeemail = $(this).attr("data-type");
        invamendcnt = $(this).attr("data-amend");
        $("#saveshareinvoiceclient").attr("data-val", $(this).attr("data-val"));
        var cml = '';
        cml += '<input type="radio" value="o" title="Original Version"  name="editversionmailclient" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Original Version">O</span> &nbsp;&nbsp;';
        for (var i = 1; i <= invamendcnt; i++) {
            cml += '<input type="radio" value="' + i + '" title="Version ' + i + '"  name="editversionmailclient" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Version ' + i + '">' + i + '</span> &nbsp;&nbsp;';
        }
        $("#emailVersionclient").html(cml);
    })

    /*Save share clint invoice */
    $(document).on("click", "#saveshareinvoiceclient", function () {
        tokeninvoice = $(this).attr("data-val");
        var invversion = $("input[name='editversionmailclient']:checked").val();
        if (String(invversion) == "undefined" || String(invversion) == "") {
            alert("Select invoice version");
            return false;
        }
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("invversion", invversion);
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/ShareInvoicetoClient",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data == "") {
                    alert("OOps something went wrong.");
                    closeload();
                    return false;
                }
                else if (parseInt(response.Data) > 0) {
                    alert("Inovice shared successfully with client.");
                    $("#myModaldocsclient").modal("hide");
                    loadInvoicedata(invpageindex);
                    closeload();
                    return false;
                }
                else {
                    alert(response.Data);
                    closeload();
                    return false;
                }
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    var tokenemail = "";
    var invtypeemail = "";
    /*Open model payment*/
    $(document).on("click", "#OpenPayment", function () {
        $('#myModalpayment').modal({ show: true });
        tokeninvoice = $(this).attr("data-id");
        paymentype = $(this).attr("data-paymentype");
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("PaymentTypeFilter", "");
        var htmlpay = '';
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/InvoicePaymentbyInvoiceID",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#PaymentDetailsdiv").empty();
                var obj = JSON.parse(response.Data);
                try {
                    if (parseInt(obj.length) == 0) {
                        $("#paymentdetaisnoresultdiv").css("display", "block");
                    }
                    else {
                        $("#paymentdetaisnoresultdiv").css("display", "none");
                    }
                }
                catch
                {
                    $("#paymentdetaisnoresultdiv").css("display", "block");
                    closeload();
                    return false;
                }
                $.each(obj, function (i, a) {
                    htmlpay += '<tr>'
                    htmlpay += '<td>' + formatDatetoIST(a.PDate) + '</td>'
                    htmlpay += '<td>' + a.PaymentType + '</td>'
                    htmlpay += '<td>' + a.Amount + '</td>'
                    htmlpay += '<td>' + a.BankName + '</td>'
                    htmlpay += '<td>' + a.DdNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Ddidate) + '</td>'
                    htmlpay += '<td>' + a.ChequeNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Chqidate) + '</td>'
                    htmlpay += '<td>' + a.RefNo + '</td>'
                    htmlpay += '<td>' + a.OtherDetails + '</td>'
                    htmlpay += '<td>' + a.CheckStatus + '</td>'
                    htmlpay += '</tr>'
                }); //End of foreach Loop
                $("#PaymentDetailsdiv").empty().html(htmlpay);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    $("#InvoiceType,#InvoiceStatus").change(function () {
        isRenderPage = false;
        loadInvoicedata();
    });

    /*Open payment status*/
    $(document).on("click", "#OpenPaymentStatus", function () {
        $('#myModalpayment').modal({ show: true });
        tokeninvoice = $(this).attr("data-id");
        paymentype = $(this).attr("data-paymentype");
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("PaymentTypeFilter", "Cheque");
        var htmlpay = '';
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/InvoicePaymentbyInvoiceID",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#PaymentDetailsdiv").empty();
                var obj = JSON.parse(response.Data);
                try {
                    if (parseInt(obj.length) == 0) {
                        $("#paymentdetaisnoresultdiv").css("display", "block");
                    }
                    else {
                        $("#paymentdetaisnoresultdiv").css("display", "none");
                    }
                }
                catch
                {
                    $("#paymentdetaisnoresultdiv").css("display", "block");
                    closeload();
                    return false;
                }
                $.each(obj, function (i, a) {
                    htmlpay += '<tr>'
                    htmlpay += '<td>' + formatDatetoIST(a.PDate) + '</td>'
                    htmlpay += '<td>' + a.PaymentType + '</td>'
                    htmlpay += '<td>' + a.Amount + '</td>'
                    htmlpay += '<td>' + a.BankName + '</td>'
                    htmlpay += '<td>' + a.DdNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Ddidate) + '</td>'
                    htmlpay += '<td>' + a.ChequeNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Chqidate) + '</td>'
                    htmlpay += '<td>' + a.RefNo + '</td>'
                    htmlpay += '<td>' + a.OtherDetails + '</td>'
                    htmlpay += '<td>' + a.CheckStatus + '</td>'
                    htmlpay += '</tr>'
                }); //End of foreach Loop
                $("#PaymentDetailsdiv").empty().html(htmlpay);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    //share invoice deatils 
    $(document).on("click", "#shareinvoicedata", function () {
        $('#myModaldocs').modal({ show: true });
        var emailto = "rdubey@manupatra.com"
        tokenemail = $(this).attr("data-val");
        invtypeemail = $(this).attr("data-type");
        invamendcnt = $(this).attr("data-amend");
        var cml = '';
        cml += '<input type="radio" value="o" title="Original Version"  name="editversionmail" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Original Version">O</span> &nbsp;&nbsp;';
        for (var i = 1; i <= invamendcnt; i++) {
            cml += '<input type="radio" value="' + i + '" title="Version ' + i + '"  name="editversionmail" style="cursor: default !important;" ><span style="padding: 3px 0px 1px 4px;font-weight: bold;" title="Version ' + i + '">' + i + '</span> &nbsp;&nbsp;';
        }
        $("#emailVersion").html(cml);
    })

    /*Share invoice*/
    $("#shareinvoice").click(function () {
        var formdata = new FormData();
        var emailto = $("#semail").val();
        var token = tokenemail;
        var invtype = invtypeemail;
        var remarksemail = $("#remarksemail").val();
        var invversion = $("input[name='editversionmail']:checked").val();
        if (String(invversion) == "undefined" || String(invversion) == "") {
            alert("Select invoice version");
            return false;
        }
        else if (invtype == "") {
            alert("Please select the invoice type.");
            return false;
        }
        else if (emailto == "") {
            alert("Please enter the E-mail Id.");
            return false;
        }
        else {
            if (emailto != "") {
                var emailArray = emailto.split(",");
                for (i = 0; i <= (emailArray.length - 1); i++) {
                    if (checkEmail(emailArray[i])) {
                        //  alert("true");
                        vEmails = "true";
                    } else {
                        vEmails = "false";
                        new PNotify({
                            title: 'Warning!',
                            text: ' Invalid email format!',
                            type: 'error',
                            delay: 3000
                        });
                    }
                }
            }
        }
        if (vEmails == "" || vEmails == "true") {
            formdata.append("email", emailto);
            formdata.append("invtype", invtype);
            formdata.append("token", token);
            formdata.append("remarksemail", remarksemail);
            formdata.append("invversion", invversion);
            $('#shareinvoice').prop('disabled', true);
            openload();
            $.ajax({
                async: true,
                url: '/Bill/SendInvoice',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "true") {
                        closeload();
                        alert("Invoice has been sent successfully.");
                        $('#myModaldocs').modal('hide');
                        $("#semail,#remarksemail").val("");
                        $('#shareinvoice').prop('disabled', false);
                    }
                    else {
                        alert(response);
                    }
                    closeload();
                },
                error: function () {
                    closeload();
                }
            });
        }
    });

    /*View invoice version*/
    $(document).on("click", "#viewinvoiceversion", function () {
        var valuetoken = $(this).attr("token");
        var invno = $(this).attr("filename");
        var ct = 5;
        var formData = new FormData();
        formData.append("Invoiceid", valuetoken);
        var html6 = '';
        $.ajax({
            async: true,
            url: '/api/OcrInvoiceApi/InvoiceVersionList',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#invoicelist").animate({ scrollTop: $("#invoicelist").height() }, 1000);
                invno = String(invno).replaceAll('/', '_');
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        $("#bindinvoiceversion" + invno).empty().html("<tr><td colspan='6' align='center'>No invoice found</td</tr>");
                        return false;
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var cheintb = false;
                ct = 1;
                $.each(obj, function (i, a) {
                    var downloadpath = "";
                    html6 += '<tr>';
                    html6 += '<td>' + a.RowNum + '</td>';
                    html6 += '<td>' + formatDatetoIST(a.Inovicedate) + '</td>';
                    html6 += '<td>' + a.InvoiceNo + '</td>';
                    html6 += '<td>' + a.CreatedBy + '</td>';
                    html6 += '<td>' + a.TotAmt + '</td>';
                    if (a.IsAmend == "1") {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download Invoice" data-val="' + a.id + '" id="viewinvoicedata" data-type="' + ct + '" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + invno + ' (Version - ' + ct + ')</span></td>';
                        ct = ct + 1;
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download Invoice" data-val="' + a.id + '" id="viewinvoicedata" data-type="o" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">Original Invoice</span></td>';
                    }
                    html6 += '</tr>';
                });
                $("#bindinvoiceversion" + invno).empty().html(html6);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    });

    /*Cancel invoice details*/
    $(document).on("click", "#cancelinvoice", function () {
        var tokeninvoice = $(this).attr("dataval");
        var result = confirm("Are you sure to cancel this invoice?");
        if (result) {
            //Logic to delete the item
            var formdata = new FormData();
            formdata.append("Invoiceid", tokeninvoice);
            openload();
            $.ajax({
                async: true,
                url: "/api/OcrInvoiceApi/CancelInvoice",
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data == "") {
                        alert("OOps something went wrong.");
                        closeload();
                        return false;
                    }
                    else if (parseInt(response.Data) > 0) {
                        alert("Inovice cancelled successfully.");
                        loadInvoicedata(ipageindex);
                        closeload();
                        return false;
                    }
                    else if (String(response.Data) == "-1") {
                        alert("You are not Authorise to cancel this invoice.");
                        closeload();
                        return false;
                    }
                    else {
                        alert(response.Data);
                        closeload();
                        return false;
                    }
                },
                error: function (response) {
                    alert(response.responseText);
                    closeload();
                }
            });
        }
    });
    $(document).on("click", "#payinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/PaymentInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Amend invoice*/
    $(document).on("click", "#amendinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/AmendInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

    /*Recuring invoice*/
    $(document).on("click", "#recurinvoice", function () {
        var token = $(this).attr("dataval");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Bill/NewInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

    /*Send mail invoice*/
    $(document).on("click", "#sendemailinv", function () {
        var tokenids = $(this).attr("dataval");
        $("#textinvid").val(tokenids);
        $('#myModaldocs1').modal({ show: true });
    });
    $(document).on('click', '#invpaginate', function () {
        invpageindex = $(this).attr("index");
        loadInvoicedata(invpageindex);
    });

    /*Load invoice number by page number*/
    $(document).on('click', '#invgetdatabypagenum', function () {
        pageindex = $("#invpagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#nvisotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    loadInvoicedata(invpageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on("click", "#CrerateNewInvoice", function () {
        var mtrclientid = globalclientId;
        var matterids = globalmatterids;


        var urls = "/" + fcode + "/Bill/CreateInvoice";
        url_redirect({
            url: urls,
            method: "post",
            data: { "matterids": globalmatterids, "mtrclientid": globalclientId }
        });


    });
    /*Load invoice data by page number*/
    var totalInvoiceCount = 1;
    function loadInvoicedata() {
        var html = '';
        var payrecivedamount = 0;
        var caseids = $("#hdnusercaseid").val();
        var formData = new FormData();
        formData.append("cnamefilter", '');
        formData.append("fromfilter", '');
        formData.append("tofilter", '');
        formData.append("amountfilter", '');
        formData.append("searchflag", '');
        formData.append("Caseid", token);
        formData.append("pagesize", invpagesize);
        formData.append("pagenum", invpageindex);
        formData.append("filterinvoietype", $("#InvoiceType").val());
        formData.append("FilterInvoiceStatus", $("#InvoiceStatus").val());
        $("#assignuserdata").html("");
        //read assign using list
        openload();
        qty1 = 0;
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/OcrInvoiceApi/LoadInvoicedataByCase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = JSON.parse(response1.Data);
                var ilength = obj.length;
                if (ilength != 0) {
                    //$("#datastatus").html("");
                    $("#invoicestatus").hide();
                    $("#InPage").show();
                }
                else {
                    $("#invoicestatus").show();
                    $("#InPage").hide();
                    //$("#datastatus").html("No result found !");
                }
                if (obj.length != 0) {
                    //$("#invoicestatus").html('');
                    $.each(obj, function (i, a) {
                        qty1 = qty1 + 1;
                        if (i === 0) {
                            ifirstvalue = a.rownum;
                        }
                        //if (i === (ilength - 1)) {
                        //    var ipnext = invpageindex;
                        //    var ipprev = invpageindex;
                        //    var ipageno = invpageindex;
                        //    var itotdata = a.totRow;
                        //    var itotpage = 0;
                        //    if (a.totRow > 0) {
                        //        ipnext = parseInt(ipnext) + 1;
                        //        if (ipnext == 0) ipnext = 1;
                        //        ipprev = parseInt(ipageno) - 1;
                        //        if (ipprev == 0) ipprev = 1;
                        //        itotpage = parseInt(itotdata) / parseInt(invpagesize);
                        //        if (parseInt(itotdata) % parseInt(invpagesize) != 0) {
                        //            itotpage = parseInt(itotpage) + 1;
                        //        }
                        //        $("#invpagnumvalue").attr("max", itotpage);
                        //    }
                        //    var itfot = '';
                        //    itfot += '<ul>'
                        //    itfot += '<li>results <span>' + a.totRow + '</span>  <span id="invsotopage" style="display:none">' + itotpage + '</span></li>'
                        //    itfot += '<li><span>|</span></li>'
                        //    itfot += '<li>pages ' + invpageindex + '/ ' + parseInt(itotpage) + '</li>'
                        //    itfot += '<li><span>|</span></li>'
                        //    itfot += '<li ><input type="number" id="invpagnumvalue" min="1"  class="footerInput"  ><a class="gobtn"  type="button" id="invgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        //    if (a.totRow <= ilength) {
                        //    }
                        //    else if (ipageno == 1) {
                        //    }
                        //    else if (ipageno == itotpage) {
                        //        itfot += '<li><span><a id="invpaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ifirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        itfot += '<li><span><a id="invpaginate"  title="Previous Page" href="javascript:void()" index="' + ipprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + ifirstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (ipageno < itotpage) {
                        //        itfot += '<a  id="invpaginate" title="Next Page" href="javascript:void()" index="' + ipnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    $("#casetfooter1").html("");
                        //    $("#casetfooter1").html(itfot);
                        //}

                        var totdata = a.totRow;
                        var totpage = 0;
                        if (i === (ilength - 1)) {
                            totpage = parseInt(totdata) / parseInt(invpagesize);
                            if (parseInt(totdata) % parseInt(invpagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#invpagnumvalue").attr("max", totdata);
                            if (invpageindex == totpage) {
                                $('#InNext').hide();
                                $('#InPrev').css("display", "block");
                            }
                            else {
                                $('#InNext').css("display", "block");
                            }
                            if (invpageindex == 1) {
                                $('#InPrev').css("display", "none");
                            }
                            else {
                                $('#InPrev').css("display", "block");
                            }

                            if (isRenderPage == false) {
                                totalInvoiceCount = totpage;
                                InvRenderPagination(invpageindex, totpage);
                            }
                        }
                        var famt = parseFloat(a.TotAmt) - parseFloat(a.PaidAmt);
                        var trcolordata = "";
                        var d1 = new Date();
                        var d2 = new Date(a.duedate);
                        if (d1 >= d2 && famt != "0") {
                            trcolordata = "trcolor";
                        }
                        else {
                            trcolordata = "";
                        }
                        if (a.IsCanceled == 1) {
                            trcolordata = "trcolorcanceled";
                        }
                        else {
                        }
                        var paymentcursor = "";
                        if (a.PaymentType != "") {
                            paymentcursor = "cursor:pointer;color:#069;"
                        }
                        var statuscursor = "";
                        if (a.ChequeStatus != "") {
                            statuscursor = "cursor:pointer;color:#069;"
                        }
                        var shareinvoiceclientcss = "";
                        if (a.IsInvoiceClientShared == "1") {
                            shareinvoiceclientcss = "color:#37c137 !important";
                        }
                        if (roleids == "3") {
                            if (famt == "0") {
                                //html += '<tr class="' + trcolordata + '"><td class="InvoiceNo">' + a.InvoiceNo + '</td><td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate" >' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                html += '<tr class="' + trcolordata + '"><td class="InvoiceNo">' + a.InvoiceNo + '</td><td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate" >' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + (a.InvoiceStatus === 'Pending' ? '<img src="/newassets/img/pending-fi.png" />' : '<img src="/newassets/img/settled-fi.png" />') + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                html += '<td>';
                                if (a.IOriginalsInvoiceClientShared == "1") {
                                    html += '<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>|'
                                }
                                for (var i = 1; i <= a.AmendCount; i++) {
                                    html += '<a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>|';
                                }
                                html += '</td></tr>';
                            }
                            else {
                                //html += '<tr class="' + trcolordata + '" ><td class="InvoiceNo">' + a.InvoiceNo + '</td><td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</span></td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                html += '<tr class="' + trcolordata + '" ><td class="InvoiceNo">' + a.InvoiceNo + '</td><td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + (a.InvoiceStatus === 'Pending' ? '<img src="/newassets/img/pending-fi.png" />' : '<img src="/newassets/img/settled-fi.png" />') + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</span></td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                html += '<td>';
                                if (a.IOriginalsInvoiceClientShared == "1") {
                                    html += '<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>|'
                                }
                                for (var i = 1; i <= a.AmendCount; i++) {
                                    html += '<a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>|';
                                }
                                html += '</td></tr>';
                            }
                        }
                        else {
                            if (famt == "0") {
                                if (roleids == 1 || isRBI) {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + ''
                                    html += '<div class="pull-right">'
                                    html += '<div class="btn-group" >'
                                    html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                    html += '<span class="caret"></span>'
                                    html += '<span class="sr-only">Toggle Dropdown</span>'
                                    html += '</button>'
                                    html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    html += '<table class="table-panel" width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    html += '</tbody>'
                                    html += '</table>'
                                    html += '</div>'
                                    html += '</div>'
                                    html += '</td>'
                                    //html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>'
                                    html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + (a.InvoiceStatus === 'Pending' ? '<img src="/newassets/img/pending-fi.png" />' : '<img src="/newassets/img/settled-fi.png" />') + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>'
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:center;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>';
                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<a class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '">&nbsp; <span class="glyphicon glyphicon-plus-sign" style="cursor: pointer;font-size:15px;" title="Amend Invoice"></span> &nbsp; </a>';
                                            }
                                            html += '|&nbsp;&nbsp; <a style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span class="glyphicon glyphicon-remove-circle" style=" cursor: pointer;font-size:15px;" title="Cancel Invoice"></span> &nbsp; </a></a>';
                                            html += '|';
                                        }
                                        html += '<a class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '">&nbsp; <span class="glyphicon glyphicon-refresh" style=" cursor: pointer;font-size:15px;" title="Recurring Invoice"></span> &nbsp; </a>';
                                        html += '</td>';
                                    }
                                    html += '<td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                    for (var i = 1; i <= a.AmendCount; i++) {
                                        html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                    }
                                    html += '&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '" data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"><span><i class="glyphicon glyphicon-send"></i></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span><i class="glyphicon glyphicon-envelope"></i></span></a></td></tr>';
                                }
                                else {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + '';
                                    html += '<div class="pull-right">'
                                    html += '<div class="btn-group" >'
                                    html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                    html += '<span class="caret"></span>'
                                    html += '<span class="sr-only">Toggle Dropdown</span>'
                                    html += '</button>'
                                    html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    html += '<table class="table-panel" width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    html += '</tbody>'
                                    html += '</table>'
                                    html += '</div>'
                                    html += '</div>'
                                    html += '</td>';
                                    //html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + (a.InvoiceStatus === 'Pending' ? '<img src="/newassets/img/pending-fi.png" />' : '<img src="/newassets/img/settled-fi.png" />') + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:center;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>';
                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<a class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '">&nbsp; <span class="glyphicon glyphicon-plus-sign" style="cursor: pointer;font-size:15px;" title="Amend Invoice"></span> &nbsp; </a>';
                                            }
                                            html += '|&nbsp;&nbsp;<a style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span class="glyphicon glyphicon-remove-circle" style="cursor: pointer;font-size:15px;" title="Cancel Invoice"></span> &nbsp; </a></a>';
                                            html += '|';
                                        }
                                        html += '<a class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '">&nbsp; <span class="glyphicon glyphicon-refresh" style="cursor: pointer;font-size:15px;" title="Recurring Invoice"></span> &nbsp; </a>';
                                        html += '</td>';
                                    }
                                    html += '<td>';
                                    html += '<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                    for (var i = 1; i <= a.AmendCount; i++) {
                                        html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                    }
                                    html += '&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"><span><i class="glyphicon glyphicon-send"></i></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span><i class="glyphicon glyphicon-envelope"></i></span></a></td></tr>';
                                }
                            }
                            else {
                                if (roleids == 1 || isRBI) {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + '';
                                    html += '<div class="pull-right">'
                                    html += '<div class="btn-group" >'
                                    html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                    html += '<span class="caret"></span>'
                                    html += '<span class="sr-only">Toggle Dropdown</span>'
                                    html += '</button>'
                                    html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    html += '<table class="table-panel" width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    html += '</tbody>'
                                    html += '</table>'
                                    html += '</div>'
                                    html += '</div>'
                                    html += '</td>';
                                    //html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + (a.InvoiceStatus === 'Pending' ? '<img src="/newassets/img/pending-fi.png" />' : '<img src="/newassets/img/settled-fi.png" />') + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:center;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>'
                                        html += '<ul class="table_action"><li><button style="cursor:pointer" class="taskoutboxbtnicon" id="payinvoice" dataval="' + a.id + '"> <img src="/newassets/img/currency-rupee.svg" /> </button></li>';
                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '<li><button class="taskoutboxbtnicon" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '"> <img style="opacity:.6;" src="/newassets/img/amend_invoice.svg" /></button></li>';
                                            }
                                            html += '<li><button style="opacity:.6;" class="taskoutboxbtnicon" id="cancelinvoice" dataval="' + a.id + '"> <img src="/newassets/img/cancel_invoice.svg" /> </button></li>';
                                        }

                                        html += '<li><button class="taskoutboxbtnicon" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '"><img style="opacity:.6;" src="/newassets/img/recuring.svg" /></button></ul>';
                                        html += '</td>'
                                    }
                                    html += ' <td><ul class="table_action"><li><button class="taskoutboxbtnicon" name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()"><img src="/newassets/img/download.svg" /></button></li> ';
                                    for (var i = 1; i <= a.AmendCount; i++) {
                                        html += '<li><button class="taskoutboxbtnicon" name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()">' + i + ' </button> </li>';
                                    }
                                    html += '<li><button class="taskoutboxbtnicon" name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="d" style="' + shareinvoiceclientcss + '"  data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"> <img src="/newassets/img/share.svg" /> </button> </li> <li><button style="opacity:.6;" class="taskoutboxbtnicon" name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-amend="' + a.AmendCount + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"> <img src="/newassets/img/mail.svg" /> </button> </li></ul> </td></tr>';
                                }
                                else {
                                    html += '<tr class="' + trcolordata + '">';
                                    html += '<td class="InvoiceNo">' + a.InvoiceNo + '';
                                    html += '<div class="pull-right">'
                                    html += '<div class="btn-group" >'
                                    html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                    html += '<span class="caret"></span>'
                                    html += '<span class="sr-only">Toggle Dropdown</span>'
                                    html += '</button>'
                                    html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                    html += '<table class="table-panel" width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                    var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                    html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                    html += '</tbody>'
                                    html += '</table>'
                                    html += '</div>'
                                    html += '</div>'
                                    html += '</td>';
                                    html += '<td class="ClientName">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="TotAmt">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="CreatedBy">' + a.CreatedBy + '</td><td class="duedate">' + formatDatetoIST(a.duedate) + '</td>';
                                    if (a.IsCanceled == 1) {
                                        html += '<td style="text-align:center;">'
                                        html += '<span >Canceled</span>';
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td>';
                                        html += '<a style="cursor:pointer" class="" id="payinvoice" dataval="' + a.id + '">&nbsp; Pay &nbsp; </a>';
                                        if (a.PaidAmt == 0) {
                                            if (a.AmendCount < 5) {
                                                html += '|<a class="" style="cursor:pointer" id="amendinvoice" dataval="' + a.id + '">&nbsp; <span class="glyphicon glyphicon-plus-sign" style="color: #069; cursor: pointer;font-size:12px;" title="Amend Invoice"></span> &nbsp; </a>';
                                            }
                                            html += '|&nbsp;&nbsp; <a style="cursor:pointer" class="" id="cancelinvoice" dataval="' + a.id + '"><span class="glyphicon glyphicon-remove-circle" style="color:#e39d05; cursor: pointer;font-size:15px;" title="Cancel Invoice"></span> &nbsp; </a></a>';
                                        }
                                        html += '|';
                                        html += '<a class="" style="cursor:pointer" id="recurinvoice" dataval="' + a.id + '">&nbsp; <span class="glyphicon glyphicon-refresh" style="color: #069; cursor: pointer;font-size:15px;" title="Recurring Invoice"></span> &nbsp; </a>';
                                        html += '</td>';
                                    }
                                    html += '<td><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                    for (var i = 1; i <= a.AmendCount; i++) {
                                        html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                    }
                                    html += '&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d"  style="' + shareinvoiceclientcss + '" data-amend="' + a.AmendCount + '" id="shareinvoiceclient" title="share invoice to client" href="javascript:void()"><span><i class="glyphicon glyphicon-send"></i></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" data-amend="' + a.AmendCount + '" id="shareinvoicedata" href="javascript:void()"><span><i class="glyphicon glyphicon-envelope"></i></span></a></td></tr>';
                                }
                            }
                        }
                    });
                    $("#assignuserdata").append(html);
                    $("#searchinvoice").removeAttr("disabled");
                    $("#odinvoice li input:checkbox:not(:checked)").each(function () {
                        var column = "#invlist ." + $(this).attr("name");
                        $(column).hide();
                    });
                    closeload();
                }
                else {
                    $('#InPage').hide();
                    //$("#invoicestatus").html("No result found !");
                    $("#invoicestatus").show();
                    //$(".Inpagination").html('');
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
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            closeload();
            return false;
        });
    }
    $("#InvoiceColumnSelection").click(function () {
        $('#InvoiceCustomizedcolumn').modal({ show: true });
    });

    /*Invoice Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    var totalPageInv = "";
    function InvRenderPagination(pageindex, totdata) {
        let totPages = totdata;
        invpageindex = pageindex;
        totalPageInv = totdata;

        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis


        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btninv ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btninv ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btninv ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#InPageNumbers").html(paginationHtml);
        isRenderPage = true;
    }


    //var setInvPageNo = 1;
    $(document).on("click", ".page-btninv", function () {
        let page = $(this).data("page");
        invpageindex = page;
        isRenderPage = true;
        $("#txtingopage").val("");
        loadInvoicedata();
        $(".page-btninv").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#InPrev", function () {
        if (invpageindex > 1) {
            invpageindex = invpageindex - 1;
        }
        isRenderPage = true;
        $("#txtingopage").val("");
        loadInvoicedata();

        $(".page-btninv").removeClass("active");
        $(".page-btninv[data-page='" + invpageindex + "']").addClass("active");
    });


    $(document).on("click", "#InNext", function () {
        if (setInvPageNo => 1) {
            invpageindex = invpageindex + 1;
        }
        isRenderPage = true;
        firstload = true;
        $("#txtingopage").val("");
        loadInvoicedata();

        $(".page-btninv").removeClass("active");
        $(".page-btninv[data-page='" + invpageindex + "']").addClass("active");
    });

    $(document).on("click", "#divInGo", function () {
        let goToPage = parseInt($("#txtingopage").val());
        if (!isNaN(goToPage)) {
            invpageindex = goToPage;
        }
        if (goToPage > totalInvoiceCount || goToPage == 0) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        firstload = true;
        isRenderPage = true;
        loadInvoicedata();

        $(".page-btninv").removeClass("active");
        $(".page-btninv[data-page='" + invpageindex + "']").addClass("active");
    });

    /*Invoice Pagination End*/



    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });

    /*Share invoice data*/
    $(document).on("click", "#shareinvoicedata", function () {
        $('#myModaldocs').modal({ show: true });
        tokenemail = $(this).attr("data-val");
        invtypeemail = $(this).attr("data-type");
    });
    /*View invoice data*/
    $(document).on("click", "#viewinvoicedata", function () {
        var token = $(this).attr("data-val");
        var invtype = $(this).attr("data-type");
        var host = window.location.host
        var url = "/" + fcode + "/Bill/PrintInvoiceDetail?data=true&token=" + token + "&invtype=" + invtype;
        window.open("" + url + "", "_blank");
    });
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    $(document).on("click", "#caseorder", function () {
        openload();
        //var idss = $(this).attr("id-val");
        //var caseidss = $(this).attr("case-val");
        var ids = $("#UserCaseIdsId").val();
        var caseids = $("#MasterCaseIdsIds").val();
        if (IsRevenueCourt == "1") {
            $("#modalwidth").css("width", "80%");
        }
        else {
            $("#modalwidth").css("width", "50%");
        }
        if (courtName === 'Rajasthan') {
            IsReraCourt = "RERH";
        }
        else if (courtName === 'Lucknow') {
            IsReraCourt = "RELK";
        }
        var url = "/firm/CaseOrders?status=true&id=" + caseids + "&caseid=" + ids + "&IsRevenueCourt=" + IsRevenueCourt + "&IsReraCourt=" + IsReraCourt;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
            closeload();
        });
    });
    /*Get causelist details*/
    $(document).on("click", "#getcauselistdata", function () {
        openload();
        var ids1 = $("#UserCaseIdsId").val();
        //var ids1 = $(this).attr("val-data");
        var courtType = $("#CourtTypecauselist").val();
        var url = "";
        if (courtName === 'Rajasthan') {
            courtType = "RERH";
            url = "/firm/CaseCauseList?status=true"
                + "&id=" + encodeURIComponent(ids1)
                + "&isRera=" + encodeURIComponent(IsReraCourt)
                + "&courtTypeId=" + encodeURIComponent(courtType)
                + "&courtName=" + encodeURIComponent(courtName)
                + "&janpadName=" + encodeURIComponent(janpadName)
                + "&tahsilName=" + encodeURIComponent(tahsilName)
                + "&caseNo=" + encodeURIComponent(caseNo)
                + "&vJudCourt=" + encodeURIComponent(vJudCourt);
        }
        else {
            url = "/firm/CaseCauseList?status=true&id=" + ids1 + "&isRera=" + IsReraCourt + "&courtTypeId=" + courtType;
        }
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
        closeload();
    });
    $(document).on("click", "#openmanualnhcnr", function () {
        $("#nhhide").val($(this).attr("nhdatecnr"));
        $("#caseidhide").val($(this).attr("caseid"));
        $("#usercaseidhide").val($(this).attr("usercaseid"));
        $('#myModalmanualhearingcnr').modal({ show: true });
    });
    $("#setmanualnhcnr").click(function () {
        var mnhdate = $("#manualnhdatecnr").val();
        if (mnhdate == "") {
            alert("Select manual hearing date");
            $("#manualnhdatecnr").focus();
            return false;
        }
        var formData = new FormData();
        formData.append("userCaseId", $("#usercaseidhide").val());
        formData.append("caseid", $("#caseidhide").val());
        formData.append("oldnhdate", $("#nhhidecnr").val());
        formData.append("nhdate", mnhdate);
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
                    CaseDataCaseWatch();
                    $('#myModalmanualhearingcnr').modal('hide');
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

    /*Get casewatch case details*/
    function CaseDataCaseWatch() {
        var caseid = $("#hdnusercaseid").val();
        var formData = new FormData();
        formData.append("token", caseid);
        formData.append("IsRevenueCourt", IsRevenueCourt);
        formData.append("IsReraCourts", IsReraCourt);
        formData.append("CNRNumber", "");
        //read assign using list
        qty1 = 0;
        var html = '';
        $("#binddatacw").html("");
        openload();
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/firm/CaseDataCaseWatch",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#binddatacw").html("");
                if (response.Result == "" || String(response.Result) == "undefined") {
                    $("#cdhearingstatus").show();
                    $("#ordercauselist").hide();
                    closeload();
                    return false;
                }
                else {

                    $("#ordercauselist").show();
                    $("#cdhearingstatus").html("");
                    var obj = JSON.stringify(response);
                    var q = 0;
                    if (response.type == "CASE") {

                        let manual = response.Result[0].Manualnexthearing;
                        let next = response.Result[0].Next_Hearing;

                        if ((!manual || manual.trim() === "") && (!next || next.trim() === "")) {
                            $('#setalerts').hide();
                        } else {
                            $('#setalerts').show();
                        }
                        $.each(response.Result, function (i, a) {
                            if (a?.Status && a.Status.toLowerCase().includes('disposed')) {
                                a.Next_Hearing = '';
                            }
                            q = q + 1;
                            $("#casenametxtval").val(a.Case_Diary);
                            $("#courttextval").val(a.Court);
                            $("#casenotxtval").val(a.Case_Name);
                            $("#nhdateval").val(a.Next_Hearing);
                            $("#mnhdateval").val(a.Manualnexthearing);
                            //For CauseList/Order Popup
                            $("#UserCaseIdsId").val(a.Id);
                            $("#MasterCaseIdsIds").val(a.CaseId);
                            $("#CourtTypecauselist").val(a.CourtType);
                            var whtsdata = "";
                            localStorage.setItem('emailcasedno', a.Case_Diary);
                            localStorage.setItem('emailcourt', a.Court);
                            localStorage.setItem('emailcasename', a.Case_Name);
                            localStorage.setItem('emailadv', a.Advocate);
                            localStorage.setItem('emaildspdate', a.Disposed_Date);
                            localStorage.setItem('emailstatus', a.Status);
                            /**/
                            whtsdata = "Case / Diary No:" + a.Case_Diary + ", Court Name:" + a.Court + ", Case Name:" + a.Case_Name + ", Advocate Name:" + a.Advocate + ", Status:" + a.Status;
                            /**/
                            html += '<div class="row">';
                            html += '<div class="col-md-12">';
                            html += '<div><strong>matter name</strong></div><p>' + a.Case_Name + '</p>';
                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Case / Diary No</strong></div><p>' + a.Case_Diary + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            if (a.District != "") {
                                html += '<div><strong>State</strong></div><p>' + a.Court + '</p>';
                            } else {
                                html += '<div><strong>Court</strong></div><p>' + a.Court + '</p>';
                            }
                            html += '</div>';
                            html += '</div>';


                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Bench Name</strong></div><p>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Advocate</strong></div><p>' + a.Advocate + '</p>';
                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Next Hearing</strong></p><p>' + a.Next_Hearing + '</div>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            if (a.Manualnexthearing == "") {

                                html += '<div><strong>Manual Next Hearing</strong><p class="mdate hyperlink" nhdate="' + a.Next_Hearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p></div>';
                            } else {
                                html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.Manualnexthearing + '</p><p class="mdate hyperlink" nhdate="' + a.Next_Hearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p>';
                                // html += '<div class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></div>';
                            }

                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Dispose Date</strong></div><p>' + a.Disposed_Date + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Status</strong></div><p>' + a.Status + '</p>';
                            html += '</div>';
                            html += '</div>';
                            if (a.District != "") {

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>District</strong></div><p>' + a.District + '</p>';
                                html += '</div>';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Court Complex / Court Establishment</strong></div><p>' + a.Court_Complex_Court_Establishment + '</p>';
                                html += '</div>';
                                html += '</div>';

                            }
                            html += '<div class="row">';
                            html += '<div class="col-md-12">';
                            html += '<div><strong>Other Details:</strong>';
                            if (a.Court == "SUPREME COURT") {
                                html += '<span><a style="color:black" id="opendetails" type="OtherDetails" caseid="' + caseid + '" href="javascript:void()" title="Other Details">Court Details</a></span>';
                            }
                            if (a.Earlier_Court_Details == "1") {
                                html += '<span>&nbsp;|&nbsp;<a style="color:black" id="opendetails" type="earliercourt" caseid="' + caseid + '" href="javascript:void()" title="Earlier Court Details">Earlier Court Details</a></span>';
                            }
                            if (a.Notices == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="notices" caseid="' + caseid + '" href="javascript:void()" title="Notices" >Notices</a></span>';
                            }
                            if (a.Office_Reports == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="officereports" caseid="' + caseid + '" href="javascript:void()" title="Office Reports" >Office Reports</a></span>';
                            }
                            if (a.Caveat == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="caveat" caseid="' + caseid + '" href="javascript:void()" title="Caveat" >Caveat</a></span>';
                            }
                            //For FIR Deatils Count
                            if (a.FIRDetailsCount >= "1") {
                                html += '<span>&nbsp;|&nbsp;<a  id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()">FIR Details</a></span>';
                            }
                            //For Linked Case Deatils
                            if (a.LinkedCasesCount >= "1" && a.Court.toUpperCase() != "TELANGANA HIGH COURT") {
                                html += '<span>&nbsp;|&nbsp;<a  id="openlinkeddetails" style="color:black" type="LinkedCases" title="Linked Cases" caseid="' + caseid + '" href="javascript:void()"  title="Linked Cases" >Linked Cases</a></span>';
                            }
                            //For Sub Courts Deatils
                            if (a.SubMattersCount >= "1") {
                                html += '<span>&nbsp;|&nbsp;<a  id="opensubmatterdetails"  title="Sub-Matters" caseid="' + a.Id + '" href="javascript:void()"><span style="color:black;" class="glyphicon glyphicon-new-window"></span></a></span>';
                            }
                            //For Tag Matter 
                            if (a.TagMatters == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="tagmatter" caseid="' + caseid + '" href="javascript:void()" title="Tag Matters" >Tag Matters</a></span>';
                            }
                            //For SEBI Custmization
                            if (Sebiids == "display:unset") {
                                html += '<span>&nbsp;|&nbsp;<span style="cursor:pointer;"   caseid="' + a.Id + '" id="openallpartyname">All Party Name</span></span>';
                            }
                            //FOR NGT Earlier Court Deatils
                            if (a.Court == "NATIONAL GREEN TRIBUNAL") {
                                html += '<span>&nbsp;|&nbsp;<span><a style="color:black" id="opendetails" type="IAMA" caseid="' + caseid + '" href="javascript:void()" title="IA/MA Details">IA/MA Details</a></span></span>';
                            }
                            if (a.Court.toUpperCase() == "TELANGANA HIGH COURT") {
                                html += '<span><a style="color:black" id="opendetails" type="IAMA" caseid="' + caseid + '" href="javascript:void()" title="IA Details"> IA Details</a></span>';
                            }
                            html += `<span><a style="color:black" onclick="GetOtherPartyDetails('${caseid}')" href="javascript:void(0)" title="OtherPartyDetails"> | Other Party Details</a></span>`;
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';

                            if (a.CourtType == 5) {

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div></div>';
                                html += '</div>';

                                html += '<div class="col-md-6">';
                                html += '<div><button type="button"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id="openAppendCOurtManualOrder" class="button10">Add Order</button></div>';
                                html += '</div>';
                                html += '</div>';

                            }
                            //html += '<tr>';
                            //html += '<td width="22%"><div><b>matter / diary no:</b></div></td>';
                            //html += '<td  title="open orders"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id = "caseorder" style="cursor:pointer;color:cornflowerblue;" class= "case" >' + a.Case_Diary + ' <a id="socialnetwork" title="share to whatsapp" href="whatsapp://send?text=' + whtsdata + '" data-action="share/whatsapp/share"  class="fa fa-whatsapp socialnetwork socialwhats" ></a></td>';
                            //html += '<td width="10%"><div><b>Cause List:</b></div></td>';
                            //html += '<td width="5%" class="causelist" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="getcauselistdata"  ><span class="glyphicon glyphicon-list-alt"></span></center></td>';
                            //if (a.CourtType == 5) {
                            //    html += '<td width="30% "><button type="button" style="float:right;" id-val="' + a.CaseId + '" case-val="' + a.Id + '" id="openAppendCOurtManualOrder" class="btn sbtbtn">Add Order</button></td>';
                            //}
                            //else {
                            //    html += '<td width="30% "></td>';
                            //}
                            //html += '</tr>';
                            //html += '<tr>';
                            //if (a.District != "") {
                            //    html += '<td><div><b>State:</b></div></td>';
                            //}
                            //else {
                            //    html += '<td><div><b>Court:</b></div></td>';
                            //}
                            //html += '<td>' + a.Court + '</td>';
                            //html += '<td><div><b>Set Alerts:</b></div></td>';
                            //if (roleids == "1" || roleids == "2") {
                            //    if (a.Next_Hearing != "") {
                            //        html += '<td class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            //    }
                            //    else if (a.Manualnexthearing != "") {
                            //        html += '<td class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            //    }
                            //    else {
                            //        html += '<td></td>';
                            //    }
                            //}
                            //else {
                            //    html += '<td></td>';
                            //}
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>matter name:</b></div></td>';
                            //html += '<td colspan="4">' + a.Case_Name + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>bench name:</b></div></td>';
                            //html += '<td>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Advocate:</b></div></td>';
                            //html += '<td colspan="4">' + a.Advocate + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>next hearing:</b></div></td>';
                            //html += '<td>' + a.Next_Hearing + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>manual next hearing:</b></div></td>';
                            //if (a.Manualnexthearing == "") {
                            //    html += '<td><span class="hyperlink" nhdate="' + a.Next_Hearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">(Set Date)</span></td>';
                            //}
                            //else {
                            //    html += '<td mnhvalue="' + a.Manualnexthearing + '">' + a.Manualnexthearing + ' <span class="hyperlink" nhdate="' + a.Next_Hearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" style="cursor:pointer;color:#069;" id="openmanualnh">(Set Date)</span></td>';
                            //}
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>dispose date:</b></div></td>';
                            //html += '<td>' + a.Disposed_Date + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>status:</b></div></td>';
                            //html += '<td>' + a.Status + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //if (a.District != "") {
                            //    html += '<tr>';
                            //    html += '<td><div><b>District:</b></div></td>';
                            //    html += '<td colspan="2">' + a.District + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //    html += '<tr>';
                            //    html += '<td><div><b>Court Complex / Court Establishment Type:</b></div></td>';
                            //    html += '<td>' + a.Court_Complex_Court_Establishment_Type + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //    html += '<tr>';
                            //    html += '<td><div><b>Court Complex / Court Establishment:</b></div></td>';
                            //    html += '<td>' + a.Court_Complex_Court_Establishment + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //}
                            //if (a.Court == "SUPREME COURT") {
                            //    html += '<tr>';
                            //    html += '<td><div><b>Details:</b></div></td>';
                            //    html += '<td style="color:black">';
                            //    if (a.Earlier_Court_Details == "1") {
                            //        html += '<a style="color:black" id="opendetails" type="earliercourt" caseid="' + caseid + '" href="javascript:void()" title="Earlier Court Details"><i class="fa fa-university" aria-hidden="true"></i></a>';
                            //    }
                            //    if (a.Notices == "1") {
                            //        html += ' | <a  style="color:black" id="opendetails" type="notices" caseid="' + caseid + '" href="javascript:void()" title="Notices" ><span class="glyphicon glyphicon-list-alt"></span></a>';
                            //    }
                            //    if (a.Office_Reports == "1") {
                            //        html += ' | <a  style="color:black" id="opendetails" type="officereports" caseid="' + caseid + '" href="javascript:void()" title="Office Reports" ><i class="fa fa-list" aria-hidden="true"></i></a>';
                            //    }
                            //    if (a.Caveat == "1") {
                            //        html += ' | <a  style="color:black" id="opendetails" type="caveat" caseid="' + caseid + '" href="javascript:void()" title="Caveat" ><i class="fa fa-bell" aria-hidden="true"></i></a>';
                            //    }
                            //    html += '</td>';
                            //    html += '<td><div><b>Other Details:</b></div></td>';
                            //    html += '<td style="color:black">';
                            //    html += '<a style="color:black" id="opendetails" type="OtherDetails" caseid="' + caseid + '" href="javascript:void()" title="Other Details"><i class="fa fa-university" aria-hidden="true"></i></a>';
                            //    html += '</td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //}
                        }); //End of foreach Loop
                        $("#binddatacw").empty().append(html);
                        closeload();
                    }
                    else if (response.type == "REVENUE") {
                        let manual = response.Result[0].ManualNextHearing;
                        //let next = response.Result[0].NextHearing;
                        let next =
                            response.Result[0].NextHearing &&
                                new Date(response.Result[0].NextHearing).getFullYear() !== 1900
                                ? response.Result[0].NextHearing
                                : "";

                        if ((!manual || manual.trim() === "") && (!next || next.trim() === "")) {
                            $('#setalerts').hide();
                        } else {
                            $('#setalerts').show();
                        }
                        $.each(response.Result, function (i, a) {
                            if (a?.Status && a.Status.toLowerCase().includes('disposed')) {
                                a.Next_Hearing = '';
                            }
                            q = q + 1;
                            var whtsdata = "";
                            var slash = "/";
                            if (a.vCaseNo == "" && a.vCaseYear == "") {
                                slash = ""
                            }
                            let nextHearingNew = a.NextHearing;

                            if (nextHearingNew && new Date(nextHearingNew).getFullYear() === 1900) {
                                nextHearingNew = "";
                            }
                            $("#casenametxtval").val(a.vCaseNo);
                            $("#courttextval").val(a.Court);
                            $("#casenotxtval").val(a.CaseName);
                            $("#nhdateval").val(a.NextHearing);
                            $("#mnhdateval").val(a.ManualNextHearing);
                            //For CauseList/Order Popup
                            $("#UserCaseIdsId").val(a.CaseId);
                            $("#MasterCaseIdsIds").val(a.UserCaseId);
                            $("#CourtTypecauselist").val(a.CourtType);
                            if (a.Court === "Rajasthan") {
                                courtName = a.Court;
                                janpadName = a.JanpadName;
                                tahsilName = a.TahsilName;
                                caseNo = a.vCaseNo;
                                vJudCourt = a.vJudCourt;
                                html += '<div class="row">';
                                html += '<div class="col-md-12">';
                                html += '<div><strong>Party Name</strong></div><p>' + (a.CaseName == null ? "" : a.CaseName) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += buildRow("Case Number", formatCaseNo(a.vCaseNo, a.vCaseYear, a.cRefNo, slash, a.Court));
                                html += buildRow("Court", "Revenue(" + a.Court + ")");
                                html += '</div>';
                                html += '<div class="row">';
                                html += buildRow("District Name", a.JanpadName);
                                html += buildRow("Court Type", a.TahsilName);
                                html += '</div>';
                                html += '<div class="row">';
                                html += buildRow("Court Name", a.RevenueCourtName);
                                html += buildRow("Manual Case Number", a.ManualCaseNumber);
                                html += '</div>';
                                html += '<div class="row">';
                                html += buildRow("Next Hearing", nextHearingNew);
                                html += buildRow("Status", a.Status);
                                html += '</div>';
                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                if (a.ManualNextHearing == null) {

                                    html += '<div><strong>Manual Next Hearing</strong><p class="mdate hyperlink" nhdate="' + nextHearingNew + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p></div>';
                                } else {
                                    html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.ManualNextHearing + '</p><p class="mdate hyperlink" nhdate="' + nextHearingNew + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p>';
                                    // html += '<div class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></div>';
                                }

                                html += '</div>';
                                html += '</div>';
                            } else {
                                html += '<div class="row">';
                                html += '<div class="col-md-12">';
                                html += '<div><strong>Party Name</strong></div><p>' + + (a.CaseName == null ? "" : a.CaseName) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                if (a.cRefNo == null || a.cRefNo == "null" || a.cRefNo == "") {
                                    html += '<div><strong>case no</strong></div><p>' + a.vCaseNo + slash + a.vCaseYear + '</p>';
                                }
                                else {
                                    html += '<div><strong>case no</strong></div><p>' + a.vCaseNo + slash + a.vCaseYear + ' (' + a.cRefNo + ')</p>';
                                }
                                html += '</div>';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Court</strong></div><p>' + (a.Court == null ? "" : a.Court) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Mandal Name</strong></div><p>' + (a.MandalName == null ? "" : a.MandalName) + '</p>';
                                html += '</div>';

                                html += '<div class="col-md-6">';
                                html += '<div><strong>Janpad Name</strong></div><p>' + (a.JanpadName == null ? "" : a.JanpadName) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Tahsil Name</strong></div><p>' + (a.TahsilName == null ? "" : a.TahsilName) + '</p>';
                                html += '</div>';

                                html += '<div class="col-md-6">';
                                html += '<div><strong>Revenue Court</strong></div><p>' + (a.RevenueCourtName == null ? "" : a.RevenueCourtName) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Admission date</strong></div><p>' + (a.AdmissionDate == null ? "" : a.AdmissionDate) + '</p>';
                                html += '</div>';

                                html += '<div class="col-md-6">';
                                html += '<div><strong>Next Hearing</strong></div><p>' + (a.NextHearing == null ? "" : a.NextHearing) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Dispose date</strong></div><p>' + (a.DisposedDate == null ? "" : a.DisposedDate) + '</p>';
                                html += '</div>';

                                html += '<div class="col-md-6">';
                                html += '<div><strong>Status</strong></div><p>' + (a.Status == null ? "" : a.Status) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Nature</strong></div><p>' + (a.Nature == null ? "" : a.Nature) + '</p>';
                                html += '</div>';

                                html += '<div class="col-md-6">';
                                html += '<div><strong>Act</strong></div><p>' + (a.Act == null ? "" : a.Act) + '</p>';
                                html += '</div>';
                                html += '</div>';

                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Computer case no</strong></div><p>' + (a.ComputerCaseno == null ? "" : a.ComputerCaseno) + '</p>';
                                html += '</div>';
                                html += '</div>';
                            }
                            //html += '<tr>';
                            //html += '<td width="22%"><div><b>case no:</b></div></td>';

                            //if (a.cRefNo == null || a.cRefNo == "null" || a.cRefNo == "") {
                            //    html += '<td  title="open orders"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id = "caseorder" style="cursor:pointer;color:cornflowerblue;" class= "case" >' + a.vCaseNo + slash + a.vCaseYear + '</td>';
                            //}
                            //else {
                            //    html += '<td  title="open orders"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id = "caseorder" style="cursor:pointer;color:cornflowerblue;" class= "case" >' + a.vCaseNo + slash + a.vCaseYear + ' (' + a.cRefNo + ')</td>';
                            //}
                            //html += '<td width="10%"></td>';
                            //html += '<td width="5%" class="causelist" ></td>';
                            //html += '<td width="30% "></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Party Name:</b></div></td>';
                            //html += '<td colspan="4" class="cname">' + (a.CaseName == null ? "" : a.CaseName) + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Court:</b></div></td>';
                            //html += '<td colspan="4" class="cname">' + (a.Court == null ? "" : a.Court) + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Mandal Name:</b></div></td>';
                            //html += '<td>' + (a.MandalName == null ? "" : a.MandalName) + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Janpad Name:</b></div></td>';
                            //html += '<td colspan="4">' + (a.JanpadName == null ? "" : a.JanpadName) + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Tahsil Name:</b></div></td>';
                            //html += '<td>' + (a.TahsilName == null ? "" : a.TahsilName) + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Revenue Court:</b></div></td>';
                            //html += '<td>' + (a.RevenueCourtName == null ? "" : a.RevenueCourtName) + '</td>';
                            //html += '<td>&nbsp;</td>';
                            //html += '<td><div  style="width:150px"><b>admission date:</b></div></td>';
                            //html += '<td>' + (a.AdmissionDate == null ? "" : a.AdmissionDate) + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Next Hearing:</b></div></td>';
                            //html += '<td>' + (a.NextHearing == null ? "" : a.NextHearing) + '</td>';
                            //html += '<td>&nbsp;</td>';
                            //html += '<td><div  style="width:150px"><b>dispose date:</b></div></td>';
                            //html += '<td>' + (a.DisposedDate == null ? "" : a.DisposedDate) + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>status:</b></div></td>';
                            //html += '<td>' + (a.Status == null ? "" : a.Status) + '</td>';
                            //html += '<td>&nbsp;</td>';
                            //html += '<td><div><b>nature:</b></div></td>';
                            //html += '<td>' + (a.Nature == null ? "" : a.Nature) + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Act:</b></div></td>';
                            //html += '<td>' + (a.Act == null ? "" : a.Act) + '</td>';
                            //html += '<td>&nbsp;</td>';
                            //html += '<td><div><b>computer case no:</b></div></td>';
                            //html += '<td>' + (a.ComputerCaseno == null ? "" : a.ComputerCaseno) + '</td>';
                            //html += '</tr>';
                        }); //End of foreach Loop
                        $("#binddatacw").empty().append(html);
                        closeload();
                    }
                    else if (response.type == "RERA") {
                        let manual = response.Result[0].ManualNextHearing;
                        let next = response.Result[0].NextHearing;

                        if ((!manual || manual.trim() === "") && (!next || next.trim() === "")) {
                            $('#setalerts').hide();
                        } else {
                            $('#setalerts').show();
                        }
                        $(".Alerts,.mnh").hide();
                        $.each(response.Result, function (i, a) {
                            if (a?.Status && a.Status.toLowerCase().includes('disposed')) {
                                a.Next_Hearing = '';
                            }
                            q = q + 1;
                            $("#casenametxtval").val(a.vCaseNo);
                            $("#courttextval").val(a.Court);
                            $("#casenotxtval").val(a.CaseName);
                            $("#nhdateval").val(a.NextHearing);
                            $("#mnhdateval").val(a.ManualNextHearing);
                            //For CauseList/Order Popup
                            //$("#UserCaseIdsId").val(a.CaseId);
                            //$("#MasterCaseIdsIds").val(a.UserCaseId);
                            $("#UserCaseIdsId").val(a.CaseId);
                            $("#MasterCaseIdsIds").val(a.UserCaseId);
                            $("#CourtTypecauselist").val(a.CourtType);
                            var whtsdata = "";
                            localStorage.setItem('emailcasedno', a.vCaseNo);
                            localStorage.setItem('emailcourt', a.Court);
                            localStorage.setItem('emailcasename', a.CaseName);
                            localStorage.setItem('emailadv', a.Advocate);
                            localStorage.setItem('emaildspdate', a.DisposedDate);
                            localStorage.setItem('emailstatus', a.Status);
                            /**/
                            whtsdata = "Case / Diary No:" + a.vCaseNo + ", Court Name:" + a.Court + ", Case Name:" + a.CaseName + ", Advocate Name:" + a.Advocate + ", Status:" + a.Status;
                            /**/

                            html += '<div class="row">';
                            html += '<div class="col-md-12">';
                            html += '<div><strong>matter name</strong></div><p>' + a.CaseName + '</p>';
                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Case No</strong></div><p>' + a.vCaseNo + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Court</strong></div><p>' + a.Court + '</p>';
                            html += '</div>';
                            html += '</div>';


                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Bench Name</strong></div><p>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Advocate</strong></div><p>' + a.Advocate + '</p>';
                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Next Hearing</strong></p><p>' + a.NextHearing + '</div>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            if (a.ManualNextHearing == "" || a.ManualNextHearing == null) {

                                html += '<div><strong>Manual Next Hearing</strong><p class="mdate hyperlink" nhdate="' + a.NextHearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p></div>';
                            } else {
                                html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.ManualNextHearing + '</p><p class="mdate hyperlink" nhdate="' + a.NextHearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p>';

                                // html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.ManualNextHearing + '</p>';
                                // html += '<div class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></div>';
                            }

                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Dispose Date</strong></div><p>' + a.DisposedDate + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Status</strong></div><p>' + a.Status + '</p>';
                            html += '</div>';
                            html += '</div>';


                            //html += '<tr>';
                            //html += '<td width="22%"><div><b>matter / diary no:</b></div></td>';
                            //html += '<td  title="open orders"  id-val="' + a.CaseId + '" case-val="' + a.MasterCaseId + '" id = "caseorder" style="cursor:pointer;color:cornflowerblue;" class= "case" >' + a.vCaseNo + ' <a id="socialnetwork" title="share to whatsapp" href="whatsapp://send?text=' + whtsdata + '" data-action="share/whatsapp/share"  class="fa fa-whatsapp socialnetwork socialwhats" ></a></td>';
                            //html += '<td width="10%"><div><b>Cause List:</b></div></td>';
                            //html += '<td width="5%" class="causelist" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.CaseId + '" id="getcauselistdata"  ><span class="glyphicon glyphicon-list-alt" disabled></span></center></td>';
                            //html += '<td width="30% "></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td>' + a.Court + '</td>';
                            //html += '<td><div><b>Set Alerts:</b></div></td>';
                            //if (roleids == "1" || roleids == "2") {
                            //    if (a.Next_Hearing != "") {
                            //        html += '<td class="nh" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            //    }
                            //    else if (a.Manualnexthearing != "") {
                            //        html += '<td class="mnh" mnhvalue="' + a.ManualNextHearing + '" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            //    }
                            //    else {
                            //        html += '<td></td>';
                            //    }
                            //}
                            //else {
                            //    html += '<td></td>';
                            //}
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>matter name:</b></div></td>';
                            //html += '<td colspan="4">' + a.CaseName + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>bench name:</b></div></td>';
                            //html += '<td>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Advocate:</b></div></td>';
                            //html += '<td colspan="4">' + a.Advocate + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>next hearing:</b></div></td>';
                            //html += '<td>' + a.NextHearing + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>dispose date:</b></div></td>';
                            //html += '<td>' + a.DisposedDate + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>status:</b></div></td>';
                            //html += '<td>' + a.Status + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                        }); //End of foreach Loop
                        $("#binddatacw").empty().append(html);
                        closeload();
                    }
                    else {
                        let manual = response.Result[0].Manualnexthearing;
                        let next = response.Result[0].Next_Hearing;

                        if ((!manual || manual.trim() === "") && (!next || next.trim() === "")) {
                            $('#setalerts').hide();
                        } else {
                            $('#setalerts').show();
                        }
                        $(".Alerts,.mnh").hide();
                        $.each(response.Result, function (i, a) {
                            if (a?.Status && a.Status.toLowerCase().includes('disposed')) {
                                a.Next_Hearing = '';
                            }
                            q = q + 1;
                            $("#casenametxtval").val(a.Case_Diary);
                            $("#courttextval").val(a.Court);
                            $("#casenotxtval").val(a.Case_Name);
                            $("#nhdateval").val(a.Next_Hearing);
                            //For CauseList/Order Popup
                            $("#UserCaseIdsId").val(a.Id);
                            $("#MasterCaseIdsIds").val(a.CaseId);
                            $("#CourtTypecauselist").val(a.CourtType);
                            var whtsdata = "";
                            localStorage.setItem('emailcasedno', a.Case_Diary);
                            localStorage.setItem('emailcourt', a.Court);
                            localStorage.setItem('emailcasename', a.Case_Name);
                            localStorage.setItem('emailadv', a.Advocate);
                            localStorage.setItem('emaildspdate', a.Disposed_Date);
                            localStorage.setItem('emailstatus', a.Status);
                            /**/
                            whtsdata = "Case / Diary No:" + a.Case_Diary + ", Court Name:" + a.Court + ", Case Name:" + a.Case_Name + ", Advocate Name:" + a.Advocate + ", Status:" + a.Status;
                            /**/

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>matter name</strong></div><p>' + a.Case_Name + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>CNR Number: </strong></div><p>' + a.CNRNO + '</p>';
                            html += '</div>';
                            html += '</div>';
                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Case No/Diary no</strong></div><p>' + a.Case_Diary + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            if (a.District != "") {
                                html += '<div><strong>State</strong></div><p>' + a.Court + '</p>';
                            } else {
                                html += '<div><strong>Court</strong></div><p>' + a.Court + '</p>';
                            }
                            html += '</div>';
                            html += '</div>';


                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Bench Name</strong></div><p>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Advocate</strong></div><p>' + a.Advocate + '</p>';
                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Next Hearing</strong></p><p>' + a.Next_Hearing + '</div>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            if (a.Manualnexthearing == "") {

                                html += '<div><strong>Manual Next Hearing</strong><p class="mdate hyperlink" nhdate="' + a.Next_Hearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p></div>';
                            } else {

                                html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.Manualnexthearing + '</p><p class="mdate hyperlink" nhdate="' + a.Next_Hearing + '" val-data="' + a.Id + '" caseid="' + a.CaseId + '" id="openmanualnh">Add Manual Date</p>';
                              //  html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.Manualnexthearing + '</p>';
                                // html += '<div class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></div>';
                            }

                            html += '</div>';
                            html += '</div>';

                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Dispose Date</strong></div><p>' + a.Disposed_Date + '</p>';
                            html += '</div>';

                            html += '<div class="col-md-6">';
                            html += '<div><strong>Status</strong></div><p>' + a.Status + '</p>';
                            html += '</div>';
                            html += '</div>';
                            if (a.District != "") {
                                html += '<div class="row">';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>District</strong></div><p>' + a.District + '</p>';
                                html += '</div>';
                                html += '<div class="col-md-6">';
                                html += '<div><strong>Court Complex / Court Establishment</strong></div><p>' + a.Court_Complex_Court_Establishment + '</p>';
                                html += '</div>';
                                html += '</div>';
                            }
                            html += '<div class="row">';
                            html += '<div class="col-md-6">';
                            html += '<div><strong>Other Details:</strong>';
                            if (a.FIRDetailsCount >= "1") {
                                html += '<span><a  id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()">FIR Details</a></span>';
                            }
                            html += `<span><a style="color:black" onclick="GetOtherPartyDetails('${a.Id}')" href="javascript:void(0)" title="OtherPartyDetails"> | Other Party Details</a></span>`;
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';

                            //html += '<tr>';
                            //html += '<td width="22%"><div><b>matter / diary no:</b></div></td>';
                            //html += '<td  title="open orders"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id = "caseorder" style="cursor:pointer;color:cornflowerblue;" class= "case" >' + a.Case_Diary + ' <a id="socialnetwork" title="share to whatsapp" href="whatsapp://send?text=' + whtsdata + '" data-action="share/whatsapp/share"  class="fa fa-whatsapp socialnetwork socialwhats" ></a></td>';
                            //html += '<td width="10%"><div><b>Cause List:</b></div></td>';
                            //html += '<td width="5%" class="causelist" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="getcauselistdata"  ><span class="glyphicon glyphicon-list-alt"></span></center></td>';
                            //html += '<td width="30% "></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //if (a.District != "") {
                            //    html += '<td><div><b>State:</b></div></td>';
                            //}
                            //else {
                            //    html += '<td><div><b>Court:</b></div></td>';
                            //}
                            //html += '<td>' + a.Court + '</td>';
                            //html += '<td><div><b>Set Alerts:</b></div></td>';
                            //if (roleids == "1" || roleids == "2") {
                            //    if (a.Next_Hearing != "") {
                            //        html += '<td class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            //    }
                            //    else if (a.Manualnexthearing != "") {
                            //        html += '<td class="files" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            //    }
                            //    else {
                            //        html += '<td></td>';
                            //    }
                            //}
                            //else {
                            //    html += '<td></td>';
                            //}
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>matter name:</b></div></td>';
                            //html += '<td colspan="4">' + a.Case_Name + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>bench name:</b></div></td>';
                            //html += '<td>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>Advocate:</b></div></td>';
                            //html += '<td colspan="4">' + a.Advocate + '</td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>next hearing:</b></div></td>';
                            //html += '<td>' + a.Next_Hearing + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>manual next hearing:</b></div></td>';
                            //if (a.Manualnexthearing == "null" || a.Manualnexthearing == null || a.Manualnexthearing == "") {
                            //    html += '<td><span class="hyperlink" nhdate="' + a.Next_Hearing + '" caseid="' + a.CaseId + '" usercaseid="' + a.Id + '" id="openmanualnhcnr">(Set Date)</span></td>';
                            //}
                            //else {
                            //    html += '<td mnhvalue="' + a.Manualnexthearing + '">' + a.Manualnexthearing + ' <span class="hyperlink" nhdate="' + a.Next_Hearing + '"  usercaseid="' + a.Id + '" caseid="' + a.CaseId + '" style="cursor:pointer;color:#069;" id="openmanualnhcnr">(Set Date)</span></td>';
                            //}
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>dispose date:</b></div></td>';
                            //html += '<td>' + a.Disposed_Date + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //html += '<tr>';
                            //html += '<td><div><b>status:</b></div></td>';
                            //html += '<td>' + a.Status + '</td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '<td></td>';
                            //html += '</tr>';
                            //if (a.District != "") {
                            //    html += '<tr>';
                            //    html += '<td><div><b>District:</b></div></td>';
                            //    html += '<td colspan="2">' + a.District + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //    html += '<tr>';
                            //    html += '<td><div><b>Court Complex / Court Establishment Type:</b><div></td>';
                            //    html += '<td>' + a.Court_Complex_Court_Establishment_Type + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //    html += '<tr>';
                            //    html += '<td><div><b>Court Complex / Court Establishment:</b><div></td>';
                            //    html += '<td>' + a.Court_Complex_Court_Establishment + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '<td></td>';
                            //    html += '</tr>';
                            //}
                        }); //End of foreach Loop
                        $("#binddatacw").empty().append(html);
                        closeload();
                    }
                }
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
    //$('#ddlalertfor').on('change', function () {
    //    if (this.value == "0") {
    //        $("#alertmobpanel1").css("display", "unset");
    //        $("#alertmobpanel1").css("display", "unset");

    //        $.ajax({
    //            url: "/firm/Getclientnameemail",
    //            type: "POST",
    //            data: '',
    //            success: function (response) {
    //                console.log(response);
    //                let Username = response.data.Username;
    //                let cemail = response.data.cemail
    //                let cmobile = response.data.cmobile

    //                if (response && response.data && response.data.Username) {
    //                    $("#clientname").val(response.data.Username);
    //                } else {
    //                    $("#clientname").val(""); // clear if no username
    //                }

    //                if (response && response.data && response.data.cemail) {
    //                    $("#cientemail").val(response.data.cemail);
    //                } else {
    //                    $("#cientemail").val(""); // clear if no username
    //                }

    //                if (response && response.data && response.data.cmobile) {
    //                    $("#clientmobile").val(response.data.cmobile);
    //                } else {
    //                    $("#clientmobile").val(""); // clear if no username
    //                }
    //            },
    //            error: function (xhr, status, error) {
    //            }
    //        });
    //    }
    //    else {
    //        $("#alertmobpanel1").css("display", "none");
    //        $("#alertmobpanel1").css("display", "none");
    //    }
    //});
    $('#ddlalertfor').on('change', function () {

        if (this.value == "0") {

            $("#alertmobpanel1").show();
            $("#clientnamediv").show();

            $("#clientFieldContainer").html(`
            <select id="clientname" class="selctInputFormat">
                <option value="">Select Client</option>
            </select>
        `);

            let dropdown = $("#clientname");

            $.ajax({
                url: "/api/CallApi/Sp_NewContactsData",
                type: "POST",
                data: {
                    type: "CLIENT",
                    search: "",
                    pagenum: 1,
                    pagesize: 5000,
                    iscomorindv: ""
                },
                success: function (response) {

                    let clients = JSON.parse(response.Data);

                    dropdown.empty();
                    dropdown.append(`<option value="">Select Client</option>`);

                    clients
                        .filter(c => c.IsActive === 1)
                        .forEach(c => {
                            let fullName = `${c.fname || ""} ${c.lname || ""}`.trim();

                            dropdown.append(`
                                <option value="${c.Id}"
                                        data-email="${c.cemail || ""}"
                                        data-mobile="${c.mobno || ""}">
                                    ${fullName}
                                </option>
                            `);
                        });
                    dropdown.on("change", function () {
                        let selected = $(this).find(":selected");
                        $("#cientemail").val(selected.data("email") || "");
                        $("#clientmobile").val(selected.data("mobile") || "");
                    });
                },
                error: function (xhr, status, error) {
                    console.log("Client load failed:", error);
                }
            });

        } else {

            $("#clientFieldContainer").html(`
            <input class="selctInputFormat" id="clientname" type="text" ">`);

            $("#cientemail").val("");
            $("#clientmobile").val("");

            $("#alertmobpanel1").hide();
        }
    });


    $(document).on("click", "#openmanualnh", function () {
        $("#nhhide").val($(this).attr("nhdate"));
        $("#caseidhide").val($(this).attr("caseid"));
        $("#usercaseidhide").val($(this).attr("val-data"));
        $('#myModalmanualhearing').modal({ show: true });
    });
    $(document).on("click", "#openAppendCOurtManualOrder", function () {
        var ids = $(this).attr("id-val");
        document.getElementById("hdnCustomCaseid").value = ids;
        $('#myModalAppendCOurtManualOrder').modal({ show: true });
    });
    /*Add custom order*/
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
    $("#setmanualnh").click(function () {
        var mnhdate = $("#manualnhdate").val();
        if (mnhdate == "") {
            alert("Select manual hearing date");
            $("#manualnhdate").focus();
            return false;
        }
        var caseid = $("#hdnusercaseid").val();
        if (courtName =="Rajasthan") {
            IsReraCourt = "RERH";
        }
        var formData = new FormData();
        formData.append("userCaseId", caseid);
        formData.append("caseid", $("#UserCaseIdsId").val());
        formData.append("oldnhdate", $("#nhhide").val());
        formData.append("nhdate", mnhdate);
        formData.append("IsReracourt", IsReraCourt)
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
                    CaseDataCaseWatch();
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

    /*Set alert*/
    $(document).on("click", "#setalerts", function () {
        $("#alersettigspopup").show();
        $("#Alertdetailslist").hide();
        $("#alertmobpanel1").css("display", "none");
        $("#alertmobpanel1").css("display", "none");
        //  var lids = $(this).attr("val-data");
        var lids = $("#UserCaseIdsId").val();
        var casenametxt = $("#casenametxtval").val();
        var courttext = $("#courttextval").val();
        var casenotxt = $("#casenotxtval").val();
        let singleLineText = casenotxt.replace(/<br\s*\/?>/gi, ' ');
        var nhdate = $("#nhdateval").val();
        var mnhdate = $("#mnhdateval").val();
        if (String(nhdate) == "undefined") {
            nhdate = "";
        }
        if (String(mnhdate) == "undefined") {
            mnhdate = "";
        }
        $("#textleadid").html(lids);
        $("#casenotext").html(singleLineText);
        $("#casenametext").html(casenametxt);
        $("#courttext").html(courttext);
        if (String(nhdate) != "") {
            $('#hearingradio').val(nhdate.trim());
            $('#hearingdttext').text(nhdate.trim());
        }
        else {
            $('#hearingradiodiv').hide();
        }
        if (String(mnhdate) != "") {
            $('#mhearingradio').val(mnhdate.trim());
            $('#mhearingdttext').text(mnhdate.trim());
        }
        else {
            $('#mhearingradiodiv').hide();
        }

        $("#alertmobpanel").css("display", "none");
        $("#alertemailpanel").css("display", "none");

        var selectedRdVal = $('input[name="Alerttypes"]:checked').val();
        if (selectedRdVal == 'hearigbasis') {
            $("#divfrequency").show();
            $("#hearingdates").show();
            $("#divalertdeatils").hide();
        }

        loadsavealerts();
        $('#myModalcasealerts').modal({ show: true });
        clearForm();
    });
    $('input[type=radio][name=hearingdateradio]').change(function () {
        $("#savealerts").attr("date-val", $(this).val().trim());
    });
    /*Clear case alert details*/
    function clearForm() {
        $('#savecasealert')[0].reset();
    }

    /*Save case alert details*/
    $("#savealerts").click(function () {
        //if ($('input[name="Alerttypes"]').is(':checked')) {
        //    //alert("Checked");
        //}
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
        /*    var alerttypeids = $("input[name='Alerttypes']:checked").val(); manualhdate */
        var alerttypeids = $('input[name="hearingdates"]:checked').val();
        if (alerttypeids == "nexthearingdate") {
            if ($('input[name="hearingdates"]').is(':checked')) {
            }
            else {
                var hDateExist = document.getElementById("hearingdttext");
                var mDateExist = document.getElementById("mhearingdttext");
                if (hDateExist.textContent.trim() === "" && mDateExist.textContent.trim() === "") {
                    alert("Next Hearing and Manual Hearing does not exist for this case.");
                    return false;
                }
                else {
                    //alert("Please select the alert type");
                    //alert("Please select Next Hearing date");
                    showSelectNextHearingDateModal("Alert", "Please select Next Hearing date.");
                    return false;
                }
            }

        }
        var hearingtype = $("input[name='hearingdates']:checked").val();
        //var hdate = $(this).attr("date-val");
        var nhdate = $("#hearingradio").val();
        var mhdate = $("#mhearingradio").val();
        if (hearingtype == "nexthearingdate") {
            if (nhdate == "") {
                //alert("Please select Next Hearing date111");
                showSelectNextHearingDateModal("Alert", "Please select Next Hearing date.");
                return false;
            }
            else {
                hdate = nhdate;
            }
        } else if (hearingtype == "manualhdate") {
            if (mhdate == "") {
                //alert("Please select Next Hearing date1212");
                showSelectNextHearingDateModal("Alert", "Please select Next Hearing date.");
                return false;
            } else {
                hdate = mhdate;
            }
        }

        var alertfor = $("#ddlalertfor").val();
        var cmobile = $("#clientmobile").val();
        var cemail = $("#cientemail").val();
        var cname = $("#clientname").val();

        /*var caldate = $("#callfromdate").val();*/
        //if (caldate != "") {
        //    var currentDt = new Date(caldate);
        //    var mm = currentDt.getMonth() + 1;
        //    mm = (mm < 10) ? '0' + mm : mm;
        //    var dd = currentDt.getDate();
        //    dd = (dd < 10) ? '0' + dd : dd;
        //    var yyyy = currentDt.getFullYear();
        //    caldate = mm + '/' + dd + '/' + yyyy;
        //}

        //if (alerttypeids == "datebasis") {
        //    hearingAlert = "0";
        //    alertDays = "";
        //    hdate = caldate;
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
        if (courtName == "Rajasthan") {
            IsReraCourt = "RERH";
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
        formData.append("IsReracheck", IsReraCourt);
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

    /*Remove case alert*/
    $(document).on("click", "#removecasealert", function () {
        var formData = new FormData();
        var IsReras = IsReraCourt;
        var rera = "";
        if (IsReras == 1) {
            rera = "Rera";
        }
        if (courtName == "Rajasthan") {
            rera = "RERH";
        }
        formData.append("casealertid", $(this).attr("data-val"));
        formData.append("IsRerachecks", rera);
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

    /*Load save alert*/
    function loadsavealerts() {
        $("#assignusercasedata").html("");
        var html = '';
        var formData = new FormData();
        if (courtName == "Rajasthan") {
            IsReraCourt = "RERH";
        }

        var caseid = $("#textleadid").text();
        formData.append("caseid", caseid);
        formData.append("Isrerachecks", IsReraCourt);
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
                    if (String(a.Manualnexthearing) == null || String(a.Manualnexthearing) == "null") {
                        Manualnexthearing = "";
                    }
                    else {
                        Manualnexthearing = a.Manualnexthearing;
                    }
                    html += '<tr><td> ' + a.masterappealno + '</td><td>' + a.vCaseName + ' <td> ' + a.Courtname + '</td><td>' + a.vnexthearing + '</td><td> ' + formatDatetoIST(Manualnexthearing) + '</td>';
                    html += '<td>' + a.Mobile + '</td><td> ' + a.Email + '</td><td>' + a.createdOn + '<td>' + a.alertdate + '</td><td>' + a.isSent + '</td><td>' + a.AlertFor + '</td><td><a title="Remove this Alert" href="#"  id="removecasealert" data-val=' + a.ID + '><img src="/newassets/img/deletecasesingle-icon.png"></a></td></tr>';
                });
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
    var pageindex = cdddpageindex, pagesize = cdddpagesize, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        ipageindex = $("#pagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#sotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    loaddatalist(ipageindex);
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
    $(document).on('click', '#paginate', function () {
        /* your code here */
        ipageindex = $(this).attr("index");
        loaddatalist(ipageindex);
    });
    setInterval(function () {
        var tempdata = localStorage.getItem("savetimeentry");
        if (tempdata != "") {
            loaddatalist(pageindex);
            localStorage.setItem("savetimeentry", "");
        }
    }, 4000);

    /*Bind time entry*/
    function BindTimeEntry() {
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example"  class="" style="overflow-x:auto;" /><tr><th>').addClass('dataTable table ');
        $header = $('<thead  >').html('');
        $head1 = $('<th onclick="sortTable(1)" class="date"><div class="thbg">Date <span class="fa fa-sort fa-fw pull-right"></span></div></th><th   class="duration"><div class="thbg">Duration</div> </th><th  onclick="sortTable(3)" class="createdbyact"><div class="thbg">Created By <span class="fa fa-sort fa-fw pull-right" ></span></div></th><th  onclick="sortTable(4)" class="item"><div class="thbg">Task<span class="fa fa-sort fa-fw pull-right"></div></span></th><th  onclick="sortTable(5)" class="tdetails" style="width:20%"><div class="thbg">Note <span class="fa fa-sort fa-fw pull-right"></span></div></th><th  onclick="sortTable(6)" class="tdetails" style="width:20%"><div class="thbg">Time Entry Type <span class="fa fa-sort fa-fw pull-right"></span></div></th><th  class="attachment"><div class="thbg">Attachment </div></th><th  class="action"><div class="thbg">Action </div></th> ');
        $header.append($head1);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        $('#updatePanel').html($table);
        setTimeout(function () {
            loaddatalist(pageindex);
        }, 1000);
    }
    var runtimeentry = true;
    flaghide = true;
    /*Load case detail list*/
    var totalTimeCount = 1;
    function loaddatalist(pageindex) {
        $("#loadactivitydatas").html("");
        $("#tfootertimer").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", "");
        formdata.append("caseid", token);
        var ajaxTime = new Date().getTime();
        var time2 = [];
        var totaltime = 0;
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadTimerDataByrowidByCaseId',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                $("#tfootertimer").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }
                if (response.Data.length > 2) {
                    //$("#datastatus").html("");
                    $("#datastatus").hide();
                    closeload();
                }
                else {
                    $("#datastatus").show();
                    $('#timePage').hide();
                    //$("#datastatus").html("No result found !");
                    closeload();
                }
                var it = 2;
                var qty = 0;
                try {
                    $("#tfootertimer,#loadactivitydatas").empty();
                }
                catch
                {
                }
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    var totdata = val.totRow;
                    var totpage = 0;

                    if (i === (length - 1)) {
                        //var pnext = pageindex;
                        //var pprev = pageindex;
                        //var pageno = pageindex;
                        //var totdata = val.totRow;
                        //var totpage = 0;
                        //if (val.totRow > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;
                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(pagesize);
                        //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#pagnumvalue").attr("max", totpage);
                        //}
                        //var tfot = '';
                        //tfot += '<ul>'
                        //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"  ><a class="gobtn"  type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        //if (val.totRow <= length) {
                        //}
                        //else if (pageno == 1) {
                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //else {
                        //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        //}
                        //if (pageno < totpage) {
                        //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //}
                        //tfot += '</ul>'
                        //$("#tfootertimer").append(tfot);
                        //closeload();

                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#pagnumvalue").attr("max", totpage);
                        if (pageindex == totpage) {
                            $('#timeNext').hide();
                            $('#timePrev').css("display", "block");
                        }
                        else {
                            $('#timeNext').css("display", "block");
                        }
                        if (pageindex == 1) {
                            $('#timePrev').css("display", "none");
                        }
                        else {
                            $('#timePrev').css("display", "block");
                        }
                        if (isRenderPage == false) {
                            totalTimeCount = totpage;
                            renderTimePagination(pageindex, totpage);
                            $('#timePage').show();
                        }
                    }
                    qty = qty + 1;
                    var hrate = "";
                    if (val.hrrate == null) {
                        hrate = "";
                    }
                    else {
                        hrate = val.hrrate;
                    }
                    var total = "";
                    if (val.total == null) {
                        total = "";
                    }
                    else {
                        total = val.total;
                    }
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var Isconvertwips = "";
                    if (val.Ischangewip == "1") {
                        Isconvertwips = "trcolortime";
                    }
                    else {
                        Isconvertwips = "";
                    }
                    time2.push(val.callDura);
                    var $row = $('<tr class="' + Isconvertwips + '">');
                    $row.append($('<td class="date" />').html("<span name='" + val.tdate + "'>" + (val.tdate != null ? formatDatetoIST(val.tdate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="duration" />').html("<span name='" + val.callDura + "'>" + (val.callDura != null ? formatTimeEntry(val.callDura) : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="createdbyact" />').html("<span>" + (val.createdby != null ? val.createdby : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="item" />').html("<span>" + (val.titem != null ? val.titem : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var htmlTDetails = "";
                    if (val.tdetails == "" || val.tdetails == null || val.tdetails == "null") {
                        $row.append($('<td class="tdetails" />').html('&nbsp'));
                    }
                    else if (val.tdetails.length > 50) {
                        htmlTDetails = "";
                        htmlTDetails += '<span class="comment more" style="">' + val.tdetails.substring(0, 50) + '</span>'
                        htmlTDetails += '<span data-toggle="collapse" data-target="#dtna' + qty + '" style="color:blue;cursor:pointer"> more</span>'
                        htmlTDetails += ' <div id="dtna' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                        htmlTDetails += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtna' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                        htmlTDetails += '' + val.tdetails + ''
                        htmlTDetails += '</div>'
                        $row.append($('<td class="tdetails" />').html(htmlTDetails));
                    }
                    else {
                        htmlTDetails = "";
                        $row.append($('<td class="tdetails" />').html("<span class='omore'>" + (val.tdetails != null ? val.tdetails : '<span style="visibility: hidden;">&nbsp;</span>')));
                    }
                    $row.append($('<td class="timertype" />').html("<span class='comment more' style='word -break: break-all;'>" + val.TimeEntryType + "</span>"));
                    if (val.DocsCount > 0) {
                        $row.append($('<td class="attachment" />').html("<button type='button' class='btn btn-sm' id-val='" + val.Id + "' id='filelinktimer'><i class='glyphicon glyphicon-folder-open'></i></button>"));
                    }
                    else {
                        $row.append($('<td class="attachment" />').html("&nbsp;"));
                    }
                    var html4 = '';
                    if (roleid == 1) {
                        html4 += "<ul class='table_action'><li><button class='taskoutboxbtnicon' title='Edit Time Entry' data-id='" + val.Id + "' id='edittime'><img src='/newassets/img/edit.svg'></button></li> <li> <button class='taskoutboxbtnicon' title='Delete Time Entry' data-id='" + val.Id + "' id='deletetime'><img style='opacity: 0.7' src='/newassets/img/darkdelete.svg'></button></li></ul>";
                    }
                    else if (val.Teamlead == userid) {
                        html4 += "<ul class='table_action'><li><button class='taskoutboxbtnicon' title='Edit Time Entry' data-id='" + val.Id + "' id='edittime'><img src='/newassets/img/edit.svg'></button></li> <li> <button class='taskoutboxbtnicon' title='Delete Time Entry' data-id='" + val.Id + "' id='deletetime'><img style='opacity: 0.7' src='/newassets/img/darkdelete.svg'></button></li></ul>";
                    }
                    else if (val.userid == userid) {
                        html4 += "<ul class='table_action'><li><button class='taskoutboxbtnicon' title='Edit Time Entry' data-id='" + val.Id + "' id='edittime'><img src='/newassets/img/edit.svg'></button></li> <li> <button class='taskoutboxbtnicon' title='Delete Time Entry' data-id='" + val.Id + "' id='deletetime'><img style='opacity: 0.7' src='/newassets/img/darkdelete.svg'></button></li></ul>";
                    }
                    else {
                        html4 += "&nbsp";
                    }
                    if (val.TimeEntryType == "WIP") {
                        html4 += "<span class='glyphicon glyphicon-question-sign' style='cursor: pointer; margin-left: 5px; color: Green;' title='convert time entry type' data-id='" + val.Id + "' id='changetimeentrytype'></span>";
                    }
                    else {
                        html4 += "&nbsp";
                    }
                    $row.append($('<td class="action" />').html(html4));
                    $("#loadactivitydatas").append($row);
                });
                if (JSON.stringify(time2) != "[]") {
                    var timetotal = (time2.toString()).split(',');
                    for (var i = 0; i < timetotal.length; i++) {
                        totaltime = timestrToSec(timetotal[i]) + totaltime;
                    }
                    $("#totaltime").html(formatTime(totaltime));
                    $("#sumdiv").show();
                }
                else {
                    $("#totaltime").html("00:00:00");
                    $("#sumdiv").hide();
                }
                var oshowChar = 50;
                var oellipsestext = "...";
                var omoretext = "more";
                var olesstext = "less";
                $('.omore').each(function () {
                    var ocontent = $(this).html();
                    if (ocontent.length > oshowChar) {
                        var oc = ocontent.substr(0, oshowChar);
                        var oh = ocontent.substr(oshowChar - 1, ocontent.length - oshowChar);
                        var ohtml = oc + '<span class="omoreellipses">' + oellipsestext + '&nbsp;</span><span class="omorecontent"><span>' + oh + '</span>&nbsp;&nbsp;<a href="javascript:void()" class="omorelink">' + omoretext + '</a></span>';
                        $(this).html(ohtml);
                    }
                });
                $("#searchdatas").removeAttr("disabled");
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    /*Pagination Start*/
    var isTimeRenderPage = false;
    var totalTimePage = "";
    var setTimePage = 1;
    function renderTimePagination(pageindex, totdata) {
        let totPages = totdata;
        setTimePage = pageindex;
        totalTimePage = totdata;

        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis


        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btntime ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btntime ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btntime ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }

        $("#timePageNumbers").html(paginationHtml);
        isTimeRenderPage = true;
    }

    $(document).on("click", ".page-btntime", function () {
        let page = $(this).data("page");
        setTimePage = page;
        isTimeRenderPage = true;
        $("#timetxtgopage").val("");
        loaddatalist(setTimePage);
        $(".page-btntime").removeClass("active");
        $(this).addClass("active");
    });

    $("#timePrev").click(function () {
        if (setTimePage > 1) {
            setTimePage = setTimePage - 1;
        }
        isTimeRenderPage = true;
        $("#timetxtgopage").val("");
        loaddatalist(setTimePage);
        $(".page-btntime").removeClass("active");
        $(".page-btntime[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#timeNext").click(function () {
        if (setTimePage => 1) {
            setTimePage = setTimePage + 1;
        }
        isTimeRenderPage = true;
        $("#timetxtgopage").val("");
        loaddatalist(setTimePage);
        $(".page-btntime").removeClass("active");
        $(".page-btntime[data-page='" + setTimePage + "']").addClass("active");
    });

    $("#timedivGo").click(function () {
        let goToPage = parseInt($("#timetxtgopage").val());
        if (!isNaN(goToPage)) {
            setTimePage = goToPage;
        }
        if (goToPage > totalTimeCount || goToPage == 0) {
            alert("Please enter a valid page number.");
            setTimePage = 1;
            return false;
        }
        isTimeRenderPage = true;
        loaddatalist(setTimePage);
        $(".page-btntime").removeClass("active");
        $(".page-btntime[data-page='" + setTimePage + "']").addClass("active");
    });

    /*Pagination End*/




    var moretext = "more";
    var lesstext = "less";
    $(document).on("click", ".morelink,.imorelink,.dmorelink,.omorelink", function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
    var selectedID = new Array();
    /*Delete time details*/
    $(document).on("click", "#deletetime", function () {
        var ids = $(this).attr("data-id");
        selectedID = [];
        deletetimesingle();
        function deletetimesingle() {
            var result = confirm("Are you sure to delete Case time entry?");
            if (result) {
                selectedID.push(ids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveTimeEntry',
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
                                    text: 'Case Time Entry Remove Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                BindTimeEntry();
                                $('.pagination').hide();
                                $('#maxRows option').prop('selected', function () {
                                    return this.defaultSelected;
                                });
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
                        title: 'Warn!ng',
                        text: 'You have not selected any row to delete?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    /*Edit timer*/
    $(document).on("click", "#edittime", function () {
        $('#myModalalltimer12').modal('hide');
        try {
            var timeids = $(this).attr("data-id");
            var url1 = "/firm/editConfigtimer?data=true&token=" + timeids;
            $('.mymodels5').load(url1, function (result1) {
                $('#myModal5').modal({ show: true });
            });
        }
        catch (err) {
            alert(err.message);
        }
    });
    $(document).on('click', '#teammempaginate', function () {
        ipageindex = $(this).attr("index");
        loadteammemberlist(ipageindex);
    });
    /*Get data by page number*/
    $(document).on('click', '#teammemgetdatabypagenum', function () {
        ipageindex = $("#teammempagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#teammemsotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    loadteammemberlist(ipageindex);
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

    /*Bind team member*/
    function BindTeamMembers() {
        setTimeout(function () {
            loadteammemberlist(teammempageindex);
        }, 1000);
    }

    /*Load team member list*/
    var totalTeammemberCount = 1;
    function loadteammemberlist(teammempageindex) {
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", teammempageindex);
        formdata.append("pagesize", teammempagesize);
        formdata.append("caseid", token);
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/CallApi/LoadUsersByCaseId',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#tmtfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }
                if (response.Data.length > 2) {
                    $("#cdTeammembertatus").hide();
                    $("#TeamMPage").show();
                    //$("#cdTeammembertatus").html("");
                    closeload();
                }
                else {
                    $("#cdTeammembertatus").show();
                    $("#TeamMPage").hide();
                    //$("#cdTeammembertatus").html("No result found !");
                    closeload();
                }
                var it = 2;
                var qty = 0;
                var count = 1;
                var html3 = "";
                $("#cdbindTeammember tr").remove();
                $("#tmtfooter ul").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    //if (i === (length - 1)) {
                    //var pnext = teammempageindex;
                    //var pprev = teammempageindex;
                    //var pageno = teammempageindex;
                    //var totdata = val.totRow;
                    //var totpage = 0;
                    //if (val.totRow > 0) {
                    //    pnext = parseInt(pnext) + 1;
                    //    if (pnext == 0) pnext = 1;
                    //    pprev = parseInt(pageno) - 1;
                    //    if (pprev == 0) pprev = 1;
                    //    totpage = parseInt(totdata) / parseInt(teammempagesize);
                    //    if (parseInt(totdata) % parseInt(teammempagesize) != 0) {
                    //        totpage = parseInt(totpage) + 1;
                    //    }
                    //    $("#pagnumvalue").attr("max", totpage);
                    //}
                    //var tfot = '';
                    //tfot += '<ul>'
                    //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="teammemsotopage" style="display:none">' + totpage + '</span></li>'
                    //tfot += '<li><span>|</span></li>'
                    //tfot += '<li>pages ' + teammempageindex + '/ ' + parseInt(totpage) + '</li>'
                    //tfot += '<li><span>|</span></li>'
                    //tfot += '<li ><input type="number" id="teammempagnumvalue" class="footerInput" min="1" ><a class="gobtn"  type="button" id="teammemgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    //if (val.totRow <= length) {
                    //}
                    //else if (pageno == 1) {
                    //}
                    //else if (pageno == totpage) {
                    //    tfot += '<li><span><a id="teammempaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //}
                    //else {
                    //    tfot += '<li><span><a id="teammempaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //}
                    //if (pageno < totpage) {
                    //    tfot += '<a  id="teammempaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //}
                    //tfot += '</ul>'
                    //$("#tmtfooter").html(tfot);
                    //closeload();
                    //}
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(teammempagesize);
                        if (parseInt(totdata) % parseInt(teammempagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#invpagnumvalue").attr("max", totdata);
                        if (teammempageindex == totpage) {
                            $('#TeamNext').hide();
                            $('#TeamPrev').css("display", "block");
                        }
                        else {
                            $('#TeamNext').css("display", "block");
                        }
                        if (teammempageindex == 1) {
                            $('#TeamPrev').css("display", "none");
                        }
                        else {
                            $('#TeamPrev').css("display", "block");
                        }

                        if (isTeamRenderPage == false) {
                            totalTeammemberCount = totpage;
                            TeamRenderPagination(teammempageindex, totpage);
                        }
                    }


                    qty = qty + 1;
                    html3 += '<tr>';
                    var updaterownum = count++;
                    html3 += '<td class="s">' + updaterownum + "</td>";
                    if (roleid == "3") {
                        html3 += '<td class="client">' + val.cfname + '</td>';
                    }
                    else {
                        html3 += '<td class="client"><a href="#" id="teammemberprofile" title="View profile" data-val=' + val.auser + '>' + val.cfname + '</a></td>';
                    }
                    html3 += '<td class="client">' + val.EmailId + '</td>';
                    html3 += '<td class="billedby">' + val.Usermobile + '</td>';
                    html3 += '<td class="createdby6">' + val.Username + '</td>';
                    html3 += '</tr>';
                });
                $("#cdbindTeammember").empty().html(html3);
                closeload();
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    /*Team member Pagination Start*/
    var isTeamRenderPage = false;
    var totalPageRec = "";
    var totalPageInv = "";
    var setTeamPageNo = 1;
    function TeamRenderPagination(pageindex, totdata) {
        let totPages = totdata;
        teammempageindex = pageindex;
        totalPageInv = totdata;

        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis


        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btnteam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btnteam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btnteam ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#TeamPageNumbers").html(paginationHtml);
        isTeamRenderPage = true;
    }


    //var setInvPageNo = 1;
    $(document).on("click", ".page-btnteam", function () {
        let page = $(this).data("page");
        teammempageindex = page;
        isTeamRenderPage = true;
        $("#txtTeamgopage").val("");
        loadteammemberlist(teammempageindex);
        $(".page-btnteam").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#TeamPrev", function () {
        if (teammempageindex > 1) {
            teammempageindex = teammempageindex - 1;
        }
        isTeamRenderPage = true;
        $("#txtTeamgopage").val("");
        loadteammemberlist(teammempageindex);

        $(".page-btnteam").removeClass("active");
        $(".page-btnteam[data-page='" + teammempageindex + "']").addClass("active");
    });


    $(document).on("click", "#TeamNext", function () {
        if (setTeamPageNo => 1) {
            teammempageindex = teammempageindex + 1;
        }
        isTeamRenderPage = true;
        firstload = true;
        $("#txtTeamgopage").val("");
        loadteammemberlist(teammempageindex);

        $(".page-btnteam").removeClass("active");
        $(".page-btnteam[data-page='" + teammempageindex + "']").addClass("active");
    });

    $(document).on("click", "#divTeamGo", function () {
        let goToPage = parseInt($("#txtTeamgopage").val());
        if (!isNaN(goToPage)) {
            teammempageindex = goToPage;
        }
        if (goToPage > totalTeammemberCount || goToPage == 0) {
            alert("Please enter a valid page number.");
            teammempageindex = 1;
            return false;
        }
        firstload = true;
        isTeamRenderPage = true;
        loadteammemberlist(teammempageindex);

        $(".page-btnteam").removeClass("active");
        $(".page-btnteam[data-page='" + teammempageindex + "']").addClass("active");
    });

    /*Team member Pagination End*/
    /////////////////start document management for case//////////////////////
    // Load DirectoryFiles
    var bsurlfile = window.location.origin + "/" + fcode;
    $(document).on("click", "#viewfileversion", function () {
        var valuetoken = $(this).attr("token");
        var filename = $(this).attr("filename");
        var checkinouttab = $(this).attr("checkinouttab");
        var ct = 5;
        var formData = new FormData();
        formData.append("dirtoken", valuetoken);
        var html6 = '';
        $.ajax({
            async: true,
            url: '/api/AzureApi/FileVersionList',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                //$("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
                $("#bindfileversion").html("");
                $('#modal_docVersionHistory').modal({ show: true });
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        //$("#bindfileversion" + valuetoken).empty().html("<tr><td colspan='6' align='center'>No document found</td</tr>");
                        $("#verHDatastatus").show();
                        return false;
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $("#verHDatastatus").hide();
                var cheintb = false;
                ct = obj.length;
                $.each(obj, function (i, a) {
                    var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.Id + "";
                    html6 += '<tr>';
                    html6 += '<td>' + a.rownum + '</td>';
                    html6 += '<td>' + formatDatetoIST(a.date_time) + '</td>';
                    html6 += '<td>' + String(a.date_time).substring(11, 19) + '</td>';
                    html6 += '<td>' + a.ParentCreatedBy + '</td>';
                    html6 += '<td>' + a.CreatedBy + '</td>';
                    //if (checkinouttab == "1") {
                    //    if (cheintb == false) {
                    //        html6 += '<td><span  >' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                    //        cheintb = true;
                    //    }
                    //    else {
                    //        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                    //    }
                    //}
                    //else {
                    //    html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                    //}
                    if (checkinouttab == "1") {
                        if (cheintb == false) {
                            html6 += '<td><span  >' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                            cheintb = true;
                        }
                        else {
                            html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                        }
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                    }
                    if (checkinouttab == "1") {
                        if (cheintb == false) {
                            html6 += '<td></td>';
                            cheintb = true;
                        }
                        else {
                            html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '"><img src="/newassets/img/download-icon.png"></span></td>';
                        }
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '"><img src="/newassets/img/download-icon.png"></span></td>';
                    }
                    html6 += '<tr>';
                    ct = ct - 1;
                });
                //$("#bindfileversion" + valuetoken).empty().html(html6);
                $("#bindfileversion").empty().html(html6);
                //$("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    });
    $(document).on("click", "#checkout", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var durl = $(this).attr("href-val");
        var valuetoken = $(this).attr("value");
        window.location.href = durl;
        $(".checkout" + valuetoken).hide();
        $(".checkin" + valuetoken).show();
        setTimeout(function () {
            LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);
        }, 3000);
    });
    /*Check in file*/
    $(document).on("click", "#checkin", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var valuetoken = $(this).attr("value");
        var filename = $(this).attr("fname");
        $("#checkinfilename").text(filename);
        $("#checkinfileid").val(valuetoken);
        $('#myModalcheckin').modal({ show: true });
    });

    /*Create check in files*/
    $("#createcheckinfiles").click(function () {
        var formData = new FormData();
        var totalFiles = document.getElementById("attachmentcheckin").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var filet = document.getElementById("attachmentcheckin").files[0];
            var result = confirm("Are you sure to check-in this file? mykase keeps last 10 versions of this document including the current one. This works on First- In-First -Out Approach.");
            if (result) {
                var tempsize = 0;
                var tottempsize = 0;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("attachmentcheckin").files[i];
                    var filename = file.name;
                    //validate filechracter
                    var fileNameIndex = filename.lastIndexOf("/") + 1;
                    var dotIndex = filename.lastIndexOf('.');
                    var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                    var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                    if (reg.test(newfioename) == true) {
                        alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                        return false;
                    }
                    if (filename.length > 100) {
                        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                        return false;
                    }
                    var Extresponse = checkfileextDOC(filename);
                    if (String(Extresponse) == "false") {
                        return false;
                    }
                    formData.append("FileUpload", file);
                    try {
                        if (typeof (file) != "undefined") {
                            size = parseFloat(file.size / 1024).toFixed(2);
                            tottempsize = parseFloat(tottempsize) + parseFloat(size);
                            tempsize = parseFloat(size);
                        }
                    }
                    catch (err) {
                        //alert(err.message);
                    }
                    tempsize = tempsize.toFixed(2);
                }
                formData.append("fileid", $("#checkinfileid").val());
                openload();
                $.ajax({
                    async: true,
                    url: '/api/AzureApi/Createfilecheckin',
                    data: formData,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (response) {
                        if (String(response.Data) == "Object reference not set to an instance of an object.") {
                            alert("You can not create file for other users directory");
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "EXCEEDLIMIT") {
                            alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "NOLIMIT") {
                            alert("Please Upgrade Your Storage Limit");
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "differfilename") {
                            alert("File not uploaded for checkin. File name should start with the suffix:'" + $("#checkinfilename").text() + "'");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "differfileext") {
                            alert("File not uploaded for checkin. File extension should be same as basefile:'" + $("#checkinfilename").text() + "'");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "Unauthorizeduser") {
                            alert("You are not authorized to check-in  file:'" + $("#checkinfilename").text() + "'");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "false") {
                            alert("The file (s) you are trying upload seems corrupt or contain some malicious content. Please check the file and try to upload again.");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (response.Status == true) {
                            if (String(response.Data) == "True" || String(response.Data) == "true") {
                                var datas = JSON.stringify(response);
                                $("#fileuploadin")[0].reset();
                                $("#dirbound").html('');
                                LoadDirectoryFiles(pageindex, searchtype, directorytoken);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' File CheckedIn Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                closeload();
                                $("#list").text("");
                                $("#myModalcheckin .close").click();
                                //alert(datas);
                            }
                            else {
                                alert(response.Data);
                                closeload();
                                //alert("not found");
                            }
                        }
                        else {
                            closeload();
                            //alert("not found");
                        }
                    },
                    error: function () {
                        closeload();
                        alert('Error!');
                    }
                });
            }
        }
    });

    /*Download files*/
    var checkopen = false;
    $(document).on("click", "#downloadfile", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var durl = $(this).attr("href-val");
        some = new URLSearchParams(durl)
        var ftype = some.get('ftype');
        var ftokens = some.get('ftoken');
        if (checkopen == false) {
            window.location.href = durl;
        }
        else {
            if (ftokens == checktoken) {
                if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "DOCX" || ftype == "DOCX" || ftype == "PPT" || ftype == "PPTX") {
                    $("#overlaycontent").text("Please wait while we are preparing document from server ");
                    timeLeft = 60;
                    timerId = setInterval(countdown, 1000);
                    openload();
                    setTimeout(function () {
                        window.location.href = durl;
                        closeload();
                        checkopen = false;
                        $("#overlaycontent").text("");
                    }, 60000);
                }
                else {
                    window.location.href = durl;
                    checkopen = false;
                }
            }
            else {
                window.location.href = durl;
                checkopen = false;
            }
        }
    });

    //open permision model
    var t = 0;
    $(document).on("click", "#permopen", function () {
        var t = $(this).attr("value");
        var tttype = $(this).attr("type");
        if (tttype == "folder") {
            $("#fstitle").text("Folder Sharing");
            $("#fsfnamelabel").text("Folder Name");
            $("#fstblfnamelabel").text("Folder Name");
            $("#assign").attr("data-type", tttype);
        }
        else {
            $("#fstitle").text("File Sharing");
            $("#fsfnamelabel").text("File Name");
            $("#fstblfnamelabel").text("File Name");
            $("#assign").attr("data-type", "");
        }
        $("#directoryid").html(t);
        var tn = $(this).attr("valuename");
        $('#contact').prop('selectedIndex', 0);
        $("#linkdata input[name='options[]']:checked").prop("checked", false);
        $("#directoryname").html(tn);
        $("#directoryid").html(t);
        $("#usertype").change();
        $('#myModalperm').modal({ show: true });
        showuserassignefiledata();
    });
    $("#usertype").change(function (thisval) {
        $("#lblTeammemberSelectsharedocs").text("Select");
        var selectedRole = $(this).val();
        if (selectedRole == "Client") {
            $("#per2").hide();//
            $("#lblrights2").hide();
        }
        else {
            $("#per2").show();//
            $("#lblrights2").show();
        }
        loadcontact(editsharedocsis);
    });
    //change type
    $("#contype").change(function () {
        var contypes = $(this).val();
        $('#contact').get(0).selectedIndex = 0;
        $('input:checkbox').removeAttr('checked');
        if (contypes == "Contact") {
            $('#contact').css("display", "block");
            $('#contact').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
        else {
            $('#contact').css("display", "none");
            $('#contact').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
    });

    //get permission on contact
    $("#contact").change(function () {
        var selectedRole = $(this).find('option:selected').attr('id-val');
        if (selectedRole == "3") {
            $("#per2").hide();//
            $("#lblrights2").hide();
        }
        else {
            $("#per2").show();//
            $("#lblrights2").show();
        }
        var cvalue = $(this).val();
        var fileid = $("#directoryid").text();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", cvalue);
            formData.append("FileID", fileid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SinglFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.ppermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#linkdata input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#linkdata input[name='options[]']" + "#per" + chkbx).prop('checked', true);
                                    }
                                    else {
                                        //alert("no");
                                    }
                                });
                                //alert(tper);
                            }
                        }
                    });
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

    /*Load directory by change users*/
    //$("#dusers").change(function () {
    //    $(".noactive").css("display", "none");
    //    var cvalue = $(this).val();
    //    directorypath = "";
    //    localStorage.setItem("navigateuser", cvalue);
    //    localStorage.setItem("dirsuser", cvalue);
    //    diruser = cvalue;
    //    directoryid = directorytoken;
    //    LoadDirectoryFiles(1, searchtype, directorytoken);
    //});

    /*Create directory*/
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(dirname) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        dirname = String(dirname).replace(/[@\\/:*?"<>|.&$%#!~+`*^,]/g, '');
        dirname = $.trim(dirname);
        dirname = dirname.replace(/[/]+/g, '/')
        var fdirname = dirname.charAt(0);
        var ldirname = dirname.charAt(dirname.length - 1);
        if (fdirname == '/') {
            var dirname = dirname.substr(1);
        }
        if (ldirname == "/") {
            dirname = dirname.slice(0, -1);
        }
        var string = dirname;
        newString = string.replace(/([\\+])\s+/g, "");
        newString1 = newString.replace(/(\s+[\\+])/g, "");
        dirname = newString1;
        if (dirname == "") {
            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
            return false;
        }
        if (dirname.length > 70) {
            $(".validpanel").css("display", "block").html("Folder Name should be less than 70 character");
            return false;
        }
        formData.append("dname", dirname);
        formData.append("directoryid", directorytoken);
        formData.append("cmatter", token);
        if (dirname != "") {
            openload();
            $.ajax({
                async: true,
                url: '/api/AzureApi/CreatefileDirectory',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#foldercreate")[0].reset();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create folder for other users directory");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (datas.length == 58) {
                            $(".validpanel").css("display", "none");
                            LoadDirectory();
                            $("#dirbound").html('');
                            LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);
                            new PNotify({
                                title: 'Success!',
                                text: ' Folder Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#cdir").val("");
                            closeload();
                            $("#closecreatefolder").click();
                        }
                        else if (datas.length == 61) {
                            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
                            closeload();
                        }
                        else if (datas.length == 76) {
                            $(".validpanel").css("display", "block").html("Folder already exists");
                            closeload();
                        }
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });

    /*Load directory*/
    function LoadDirectory() {
        $("#directory").html('');
        $("#filedirectory").html('');
        $("#createfolderdirdiv,#filefolderdiv").css("display", "none");
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        dirtoken = directorytoken;
        var dirid = dirtoken;
        var formData = new FormData();
        formData.append("dirtoken", dirtoken);
        $.ajax({
            async: true,
            url: '/api/AzureApi/UserDirectoryListbycase',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Data != "") {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    var obj = "";
                }
                $.each(obj, function (i, a) {
                    if (a.ftype == "0") {
                        var dirname = a.fname;
                        var ViewFolderName = "";
                        if (a.Caseid == "") {
                            ViewFolderName = dirname;
                        }
                        else {
                            var resultvalid = validatercasefile(dirname);
                            if (resultvalid == true) {
                                ViewFolderName = dirname.substring(0, dirname.length - 13);
                                ViewFolderName = ViewFolderName + "(Case)";
                            }
                            else {
                                ViewFolderName = dirname;
                            }
                        }
                        var option = '<option value="' + a.id + '" > ' + ViewFolderName + '</option>';
                        $("#directory").append(option);
                        var option = '<option value="' + a.id + '" > ' + ViewFolderName + '</option>';
                        $("#filedirectory").append(option);
                        $("#createfolderdirdiv,#filefolderdiv").css("display", "block");
                    }
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }

    // Load Permissions
    function permissionlist() {
        $("#linkdata").html();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/permissionList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                var obj = JSON.parse(response.Data)
                qty = 0;
                $.each(obj, function (i, a) {
                    qty = qty + 1;
                    if (a.Pname == "Remove") {
                        var option2 = '&nbsp;&nbsp;<input title="Can remove from his list"  type="checkbox" id="per' + a.Id + '" name="options[]" value="' + a.Id + '" />  <label id="lblrights' + a.Id + '" style="font-weight:400;">' + a.Pname + '</label>';
                    }
                    else {
                        var option2 = '&nbsp;&nbsp;<input  type="checkbox" id="per' + a.Id + '" name="options[]" value="' + a.Id + '" />  <label id="lblrights' + a.Id + '" style="font-weight:400;">' + a.Pname + '</label>';
                    }
                    $("#linkdata").append(option2);
                });
                //console.log(response);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    // Remove Folders
    $(document).on("click", "#removedir", function () {
        var fid = $(this).attr("values");
        var fdir = $(this).attr("dirname");
        var fdirpath = $(this).attr("filepath");
        var code = $(this).attr("code");
        var result = confirm("Are you sure to remove this Folder?");
        if (result) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/RemoveDirectory",
                headers: {
                    'fid': fid,
                    'fdir': fdir,
                    'fdirpath': fdirpath,
                    'code': code
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    if (data.Data == "false") {
                        new PNotify({
                            title: 'info!',
                            text: 'Folder cannot be removed. It has some folders or files',
                            type: 'error',
                            delay: 4000
                        });
                    }
                    if (parseInt(data.Data) > 0) {
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex, searchtype, directorytoken);
                        new PNotify({
                            title: 'Success!',
                            text: 'Folder Removed Successfully',
                            type: 'success',
                            delay: 3000
                        });
                    }
                    else if (data.Data == false) {
                        new PNotify({
                            title: 'info!',
                            text: 'Folder cannot be removed. It has some folders or files',
                            type: 'error',
                            delay: 4000
                        });
                    }
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

    // Remove Files
    $(document).on("click", "#removedirfile", function () {
        //alert("hi");
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var isdelete = $(this).attr("isdelete");
        var isuse = $(this).attr("data-inuser");
        $("#removedirfilefinal").attr("value", value).attr("directnamefull", dname).attr("fid", fid).attr("fpath", fpath).attr("isdelete", isdelete).attr("data-inuser", isuse);
        if (isdelete == "1") {
            $("#removedirfilefinal").click();
        }
        else {
            $("#myModalmarkdelete").modal();
        }
    });

    // Remove Files
    $(document).on("click", "#removedirfilefinal", function () {
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var isdelete = $(this).attr("isdelete");
        var isuse = $(this).attr("data-inuser");
        var remarkmark = $("#markremark").val();
        if (isdelete != "1") {
            if (remarkmark == "") {
                alert("Please enter remark.");
                $("#markremark").focus();
                return false;
            }
        }
        if (isuse == "1") {
            alert("The file cannot be deleted as it is in use.");
            return false;
        }
        var result = "";
        if (isdelete == "1") {
            result = confirm("Are you sure you want to unmark the file for deletion?");
        }
        else {
            result = confirm("Are you sure you want to mark the file for deletion?");
        }
        if (result) {
            var formData = new FormData();
            formData.append("value", value);
            formData.append("remark", remarkmark);
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/MarkRemoveDirectoryFile",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (String(data.Data) == "alreadycheckout") {
                        if (isdelete == "1") {
                            new PNotify({
                                title: 'info!',
                                text: 'File can not be unmarked until document is check in.',
                                type: 'error',
                                delay: 4000
                            });
                        }
                        else {
                            new PNotify({
                                title: 'info!',
                                text: 'File can not be marked until document is check in.',
                                type: 'error',
                                delay: 4000
                            });
                        }
                    }
                    else {
                        if (parseInt(data.Data) > 0) {
                            $("#dirbound").html('');
                            LoadDirectoryFiles(pageindex, searchtype, directorytoken);
                            $("#markremark").val("");
                            if (isdelete == "1") {
                                new PNotify({
                                    title: 'Success!',
                                    text: 'File unmarked successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#myModalmarkdelete").modal("hide");
                            }
                            else {
                                new PNotify({
                                    title: 'Success!',
                                    text: 'File marked successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#myModalmarkdelete").modal("hide");
                            }
                        }
                        else {
                            new PNotify({
                                title: 'info!',
                                text: ' Oops ! File can not be deleted.',
                                type: 'error',
                                delay: 4000
                            });
                        }
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
    });

    /*Assign*/
    $(document).on("click", "#assign", function () {
        var fid = $("#directoryid").text();
        var user = $("#contact").val();
        var chkArray3 = [];
        var selected = $("#linkdata input[name='options[]']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var datatype = "File";
        datatype = $(this).attr("data-type");
        if (datatype == "folder") {
            datatype = "Folder"
        }
        else {
            datatype = "File"
        }
        var result = confirm("Are you sure to share this " + datatype + "?");
        if (result) {
            var val = [];
            var membersids = "";
            $('.taskmemberclssharedocs:checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                membersids += val[i] + ",";
            });
            $('#chkTaskgroupsharedocee:checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                membersids += val[i] + ",";
            });
            if (membersids == "") {
                alert("Please select the User.");
                return false;
            }
            if (selected3 == "") {
                alert("Please give at least one right.");
                return false;
            }
            var formData = new FormData();
            formData.append("did", fid);
            formData.append("permissiontype", selected3);
            formData.append("user", membersids);
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/AssignFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        $("#ptypes").html('');
                        LoadDirectoryFiles(pageindex, searchtype);
                        new PNotify({
                            title: 'Success!',
                            text: '' + datatype + ' Shared Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#contact').get(0).selectedIndex = 0;
                        showuserassignefiledata();
                        $('#matter').get(0).selectedIndex = 0;
                        $("#lblTeammemberSelectsharedocs").text("Select");
                        $("#usertype").change();
                        closeload();
                    }
                    else if (data.Data == "nouser") {
                        new PNotify({
                            title: 'info!',
                            text: ' Please Select User to Share ' + datatype + ' !',
                            type: 'error',
                            delay: 4000
                        });
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: ' Oops ! Please try After some time.',
                            type: 'error',
                            delay: 4000
                        });
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
        }
    });
    var editsharedocsis = "";
    $(document).on("click", "#editassign", function () {
        var cvalue = $(this).attr("val-id");
        var valrole = $(this).attr("val-role");
        if (valrole == "3") {
            $("#usertype").val("Client");
        }
        else {
            $("#usertype").val("User");
        }
        editsharedocsis = cvalue;
        var fileid = $("#directoryid").text();
        openload();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", cvalue);
            formData.append("FileID", fileid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SinglFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.ppermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#linkdata input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#linkdata input[name='options[]']" + "#per" + chkbx).prop('checked', true);
                                    }
                                    else {
                                        //alert("no");
                                    }
                                });
                            }
                        }
                    });
                    setTimeout(function () {
                        $("#usertype").change();
                        closeload();
                    }, 1000);
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

    //revert share file
    $(document).on("click", "#revertassign", function () {
        var sfid = $(this).attr("val-id");
        var datatype = "File";
        datatype = $("#assign").attr("data-type");
        if (datatype == "folder") {
            datatype = "Folder"
        }
        else {
            datatype = "File"
        }
        var result = confirm("Are you sure to un-share this " + datatype + "?");
        if (result) {
            var formData = new FormData();
            formData.append("did", sfid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/RevertAssignFile",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (String(data.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not revert share because this " + datatype + " shared by admin");
                        closeload();
                        return false;
                    }
                    var datas1 = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: '' + datatype + ' Share Reverted Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    showuserassignefiledata();
                    LoadDirectoryFiles(pageindex, searchtype, directorytoken);
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

    /*Show assign user file data*/
    localStorage.setItem("ftvaluedata", "/LawPractice_ds/");
    function showuserassignefiledata() {
        $("#assignuserdatadoc").html("");
        var html = '';
        var fileid = $("#directoryid").text();
        var formData = new FormData();
        formData.append("Id", fileid);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/AssignFilePerUserList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $('input:checkbox').removeAttr('checked');
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    var permissionlist = String(a.ppermission);
                    var res = permissionlist.replace("1", "View Only");
                    var res1 = res.replace("2", "Edit");
                    var res2 = res1.replace("3", "Remove");
                    var res3 = res2.replace("4", "Download");
                    html += '<tr><td>' + qty1 + '</td><td>' + a.fname + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.username + '(' + a.loginusername + ')</td><td>' + res3 + '</td><td><span style="cursor:pointer;" title="Edit permissions"  id="editassign" val-role="' + a.roleid + '" val-id="' + a.pcontact + '"><img src="/newassets/img/edit-icon.png" /></span> <span style="cursor:pointer;" title="Remove Permissions" id="revertassign" val-id="' + a.id + '"><img src="/newassets/img/deletecasesingle-icon.png" /></span>  </td></tr>';
                });
                $("#assignuserdatadoc").html(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    $(document).on("click", "#bruidcmb", function () {
        var tempbrd = $(this).attr("value");
        var regExpr = /[/]/g;
        var tempbrd1 = tempbrd.replace(regExpr, " > ")
        $("#outputbrdcmb").html(tempbrd1);
    });

    /*Mark as confidential*/
    $(document).on("click", "#MarkConfidential", function () {
        var filetoken = $(this).attr("data-val");
        var markconfidenttype = $(this).attr("marktype");
        //check inuse or not
        var findinuse = $("#InUse" + filetoken).attr("id");
        if (String(findinuse) != "undefined") {
            alert("The file is currently in use. Before marking it as confidential, please make sure it is not in use.");
            return false;
        }
        var formdata = new FormData();
        formdata.append("token", filetoken);
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/MarkConfidentDocument',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (parseInt(response.Data) == 1) {
                    alert("You are not authorized to mark the document as confidential.");
                    closeload();
                }
                else if (parseInt(response.Data) > 0) {
                    LoadDirectoryFiles(pageindex, searchtype, directorytoken);
                    alert("Document security has been saved successfully.");
                    closeload();
                }
                else {
                    if (markconfidenttype == "1") {
                        alert("You cannot mark the document as non-confidential");
                    }
                    else {
                        alert("You cannot mark the document as confidential");
                    }
                    closeload();
                }
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    /*Open edit box*/
    $(document).on("click", "#OpenEditBox", function () {
        var filetoken = $(this).attr("data-val");
        var formdata = new FormData();
        formdata.append("token", filetoken);
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/FileDetailsFordocEdit',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    $("#editfilename").text(a.fname);
                    $("#editfilenamehidden").val(filetoken);
                    $("#filedetailsedit").val(a.fdetails);
                });
                $("#myModal4").modal();
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    /*Model docs*/
    jQuery('#modeldocs').click(function (e) {
        var pageURL = window.location.href;
        var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        var fdir = $('#filedirectory').val();
        if (fdir == "") {
            fdir = directorytoken;
        }
        else {
        }
        var filename = $('#filename').val();
        if (filename == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: 'Please Enter File name.',
                type: 'error',
                delay: 3000
            });
        }
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(filename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed in File name.');
            return false;
        }
        else {
            var urls = $('.document').attr('href');
            var formData = new FormData();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/CheckDocumentQuota",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        return false;
                    }
                    else if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        return false;
                    }
                    else {
                        var newulrs = urls + "&fname=" + filename + "&dname=" + fdir;
                        $('#docframe').attr('src', newulrs);
                        $("#spanheadfile").html("Create document");
                        $("#createdocclose").click();
                        $('#myModal8').modal({ show: true });
                        $('#filename').val("");
                        setTimeout(function () {
                            $("#dirbound").html('');
                            alert("Document created successfully and changes will reflect within few minutes.");
                            LoadDirectoryFiles(pageindex, searchtype, directorytoken);
                        }, 3000);
                    }
                }, //End of AJAX Success function
                failure: function (response) {
                    //alert(response.responseText);
                    closeload();
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                    closeload();
                } //End of AJAX error function
            });
        }
    });

    /*Get parameter by page number*/
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    $(document).on("click", "#idss", function () {
        var link = $(this).attr("href");
        var value = $(this).attr("value");
        var path1 = $(this).attr("downloadpath1");
        var urltypes = $(this).attr("urltype");
        var codes = $(this).attr("code");
        checkopen = true;
        var permission = $(this).attr("id-val");
        var permissioncheckout = $(this).attr("id-checkout");
        checktoken = getParameterByName('token', path1);
        $("#spanheadfile").html("View File");
        if (value == "DOCX File" || value == "DOC File") {
            if (String(permissioncheckout) == "1") {
                $('#spanheadfile').html("View File");
            }
            else if (String(permission) == "1") {
                $('#spanheadfile').html("Edit File");
            }
            else {
                $('#spanheadfile').html("View File");
            }
            $('#docframe').attr('src', link);
            $('#myModal8').modal({ show: true });
        }
        else {
            var formdata = new FormData();
            formdata.append("filepath", link);
            formdata.append("code", codes);
            formdata.append("urltypes", urltypes);
            formdata.append("baseurl", window.location.origin);
            $.ajax({
                async: true,
                url: '/api/AzureApi/Dirfilepath',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    $('#otherdocframe').attr('src', response.Data);
                    $('#myModal9').modal({ show: true });
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    })

    /*Edit save fles*/
    $("#EditFileSaves").click(function () {
        var filetoken = $("#editfilenamehidden").val();
        var filedetails = $("#filedetailsedit").val();
        var formdata = new FormData();
        formdata.append("filedetails", filedetails);
        formdata.append("token", filetoken);
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/EditFileDeatils',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                LoadDirectoryFiles(pageindex, searchtype, directorytoken);
                alert("Data saved successfully");
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    /*Save File Sync Request*/
    $(document).on("click", "#filesyncpermission", function () {
        selectedID = [];
        selectedflag = [];
        filesyncPermission();
        var isfolderchcksync = false;
        var isfilesync = false;
        var isfilenotsync = false;
        function filesyncPermission() {
            isfolderchcksync = false;
            isfilesync = false;
            isfilenotsync = false;
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    var vdata = $(this).attr("data-val");
                    var flagvalue = $(this).attr("data-flag");
                    if (String(flagvalue) == "-1") {
                        isfolderchcksync = true;
                    }
                    if (String(flagvalue) == "1") {
                        isfilesync = true;
                        selectedID.push(vdata + "_0");
                    }
                    if (String(flagvalue) == "0") {
                        isfilenotsync = true;
                        selectedID.push(vdata + "_1");
                    }
                }
            });
            if (JSON.stringify(selectedID) != "[]") {
                if (isfolderchcksync == true) {
                    new PNotify({
                        title: "Warning",
                        text: " Folders can't be synced. Please select file for syncing.",
                        type: "error",
                        delay: 3000
                    });
                    return false;
                }
                if (isfilesync == true && isfilenotsync == true) {
                    new PNotify({
                        title: "Warning",
                        text: " Please select Synced or Unsynced file",
                        type: "error",
                        delay: 3000
                    });
                    return false;
                }
                var confirmMessage = "";
                var successMessage = "";
                if (isfilenotsync == true) {
                    confirmMessage = "Only files can be synced. Are you sure you want to save the file for Syncing?";
                    successMessage = "File sync request has been saved successfully";
                }
                else {
                    confirmMessage = "Are you sure you want to remove the file from Syncing?";
                    successMessage = "File removed from Syncing Successfully. ";
                }
                var result = confirm(confirmMessage);
                if (result) {
                    var formData = new FormData();
                    formData.append("typeIds", selectedID);
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/AzureApi/SaveFileSyncRequest',
                        data: formData,
                        type: 'POST',
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
                                    text: successMessage,
                                    type: 'success',
                                    delay: 3000
                                });
                                LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);
                                closeload();
                                $('#select_all').prop('checked', false);
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
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: ' You have not selected any file for syncing, please select first.',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });
    var resetusrflag = "false";
    /*Reset office users*/
    $("#resetofficeusers").click(function () {
        resetusrflag = localStorage.getItem("docsclosestatus");
        var docsmode = localStorage.getItem("docsmode");
        if (docsmode == "view") {
        }
        else {
            var modeltimer = localStorage.getItem("docsmodetimer");
            if (modeltimer == "") {
                setTimeout(function () {
                    alert("Changes have been saved successfully and the same will reflect in your account soon..");
                }, 1000);
            }
        }
        if (resetusrflag == "true") {
            var formData = new FormData();
            formData.append("dirid", $("#hiddirectid").val());
            $.ajax({
                async: true,
                url: '/api/AzureApi/RemoAllOfficeUser',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    resetusrflag = false;
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });

    /*Save dropbox details*/
    $(document).on("click", "#savedropbox", function () {
        var link = $(this).attr("href");
        var linkcode = $(this).attr("code");
        var formdata = new FormData();
        formdata.append("filepath", link);
        formdata.append("code", linkcode);
        formdata.append("urltypes", "dropbox");
        formdata.append("baseurl", window.location.origin);
        $.ajax({
            async: true,
            url: '/api/AzureApi/Dirfilepath',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var urldropbox = "/firm/dropbox?status=true&token=" + response.Data;
                $('#dropboxframe').attr('src', urldropbox);
                $('#myModaldropbox').modal({ show: true });
            },
            error: function () {
                alert('Error!');
            }
        });
    });
    $("#removerequest").click(function () {
        window.location = encodeURI("/" + fcode + "/Azure/RemoveFileRequest");
    })
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });

    /*Load directory file details*/
    $(document).on('click', '#docgetdatabypagenum', function () {
        cdddpageindex = $("#docpagnumvalue").val();
        if (cdddpageindex != "undefined") {
            if (Math.sign(cdddpageindex) == 1) {
                var pageindesx = $("#docsotopage").text();
                if (cdddpageindex <= parseInt(pageindesx)) {
                    openload();
                    LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);
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
    searchtype = 0;

    /*Search data*/
    $(document).on('click', '#searchdatas', function () {
        $("#searchremove").show();
        $("#searchdatas").attr("disabled", true);
        searchtype = $('#searchtype').val();
        if (searchtype == 1) {
            LoadDirectoryFiles(1, searchtype, directorytoken);
        }
        else {
            LoadDirectoryFiles(1, searchtype, directorytoken);
        }
        chksflag = true;
    });
    $(document).on('click', '#searchremove', function () {
        $("#searchremove").hide();
        $("#searchdata").val("");
        var txtlength = $("#searchdata").val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                searchtype = 0;
                LoadDirectoryFiles(1, searchtype, directorytoken);
                chksflag = false;
            }
        }
    });
    /*Search data on key up*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                searchtype = 0;
                LoadDirectoryFiles(1, searchtype, directorytoken);
                chksflag = false;
            }
        }
    });
    var diruser = "";
    $(document).on('click', '#docpaginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex, searchtype, directorytoken);
    });
    $(document).on("click", "#transferpage12", function () {
        $(".noactive").css("display", "none");
        $("#searchdata").val("");
        var cvalue = $(this).attr("data-val");
        localStorage.setItem("navigateuser", cvalue);
        directorypath = "";
        diruser = cvalue;
        directoryid = 0;
        $("#filecasedivlevel").css("display", "none");
        $("#fileclientdiv,#filecasediv").css("display", "block");
        localStorage.setItem("contacttoken", transferid);
        LoadDirectoryFiles(1, searchtype, directorytoken);
        LoadDirectory();
    });
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        $("#transferpage12").attr("data-val", transferid);
        var tempusers = $("#dusers").val();
        // localStorage.setItem("dirsuser", tempusers);
        localStorage.setItem("dirsuser", "");
        localStorage.setItem("contacttoken", transferid);
        var tflags = 0;
        var slnorr = $(this).attr("slno");
        if (slnorr == "1") {
            tempcasetoken = token;
            finaltoken = "";
        }
        else {
            tempcasetoken = "";
            finaltoken = transferid;
        }
        directorytoken = transferid;
        $("#searchdata").val("");
        LoadDirectoryFiles(1, searchtype, directorytoken);
        LoadDirectory();
    });

    /*Load contact details*/
    function loadcontact(ids = null) {
        $("#contact").empty();
        if (ids != "") {
        }
        var usertype = $("#usertype").val();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/AllAssignuser",
            contentType: "application/json; charset=utf-8",
            headers: {
                "usertype": usertype,
                "userid": ids
            },
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    //alert(datas);
                }
                else {
                    // alert("not found");
                }
                $("#contact option").remove();
                var option = '<option id-val="0" value="" selected>Select</option>';
                $("#contact").append(option);
                var html3 = '';
                $("#documentsharecontact").html("");
                if (ids == "null" || ids == null || ids == "") {
                    var optiont1 = '<li><input id="chkTaskgroupsharedoc" type="checkbox" class="taskmemberclssharedocs"  value="" ><a href="#" class="dropdown-item">All Members</a></li>';
                    $("#documentsharecontact").append(optiont1);
                }
                var temuswrnames = "";
                $.each(obj, function (i, a) {
                    var roleidtd = a["RoleId"];
                    if (ids == "null" || ids == null || ids == "") {
                        html3 += '<li><input id="chkTaskgroupsharedoc" type="checkbox" class="shcheckbox1 taskmemberclssharedocs" value="' + a["Id"] + '" tempUserName="' + a["UserNames"] + '"><a href="#" class="dropdown-item">' + a["UserNames"] + '</a></li>'
                    }
                    else {
                        html3 += '<li><input id="chkTaskgroupsharedocee"   type="checkbox" class="" value="' + a["Id"] + '" tempUserName="' + a["UserNames"] + '" checked="checked"><a href="#" class="dropdown-item">' + a["UserNames"] + '</a></li>'
                        temuswrnames = a["UserNames"];
                    }
                });
                $("#documentsharecontact").append(html3);
                if (ids == "null" || ids == null || ids == "") {
                    $("#lblTeammemberSelectsharedocs").text("Select");
                }
                else {
                    setTimeout(function () {
                        $('#chkTaskgroupsharedocee').prop("checked", true);
                        $("#lblTeammemberSelectsharedocs").text(temuswrnames);
                    }, 1000);
                }
                editsharedocsis = "";
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    /*load doc bru id cumb*/
    function loaddocbruidcumb() {
        $("#bruidcumb").html("");
        var formdata = new FormData();
        formdata.append("dirid", directorytoken);
        $.ajax({
            async: true,
            url: "/api/AzureApi/Bruidcumb",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data != "") {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    var obj = "";
                }
                var qtyr = 0;
                $.each(obj, function (i, a) {
                    qtyr = qtyr + 1;
                    var ViewFolderName = "";
                    var dirname = a.Name;
                    if (a.Caseid == "") {
                        ViewFolderName = dirname;
                    }
                    else {
                        var resultvalid = validatercasefile(dirname);
                        if (resultvalid == true) {
                            ViewFolderName = dirname.substring(0, dirname.length - 13);
                            ViewFolderName = ViewFolderName;
                        }
                        else {
                            ViewFolderName = dirname;
                        }
                    }
                    var option = '<li class="active noactive" style="cusror:pointer;"><a id="transferpage" slno="' + qtyr + '" href="javascript:void()" data-val="' + a.ID + '">' + ViewFolderName + '</a></li>';
                    $("#bruidcumb").append(option);
                });
                closeload();
            },
            error: function () {
                closeload();
                alert('Error!');
            }
        });
    }

    /**
     * Load directory file
     * @param {any} pageindex
     * @param {any} searchtype
     * @param {any} directorytoken
     */
    var dirFileCount = 1;
    function LoadDirectoryFiles(pageindex, searchtype, directorytoken) {
        //var temuser = $("#dusers").val();
        var temuser = "";
        if (String(temuser) != "") {
            diruser = localStorage.getItem("dirsuser");
        }
        else {
            diruser = "";
        }
        $("#dirbound").html("");
        openload();
        dirtoken = '0';
        var dirid = dirtoken;
        var html = '';
        var html1 = '';
        var marklabel = "";
        var markcolor = "";
        var urlstype = "";
        var togsum = 0;
        var syncflg = 0;
        var syncicon = "";
        var synctitle = "";
        var formData = new FormData();
        formData.append("dirtoken", directorytoken);
        formData.append("pagenum", pageindex);
        formData.append("pagesize", cdddpagesize);
        formData.append("user", "");
        formData.append("search", $('#searchdata').val());
        formData.append("searchtype", searchtype);
        formData.append("Caseid", token);
        var ajaxTime = new Date().getTime();
        var rt1 = $.ajax({
            async: true,
            url: '/api/AzureApi/UserDirectoryListbycase',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response1) {
                var totalTime = new Date().getTime() - ajaxTime;
                $("#tfooter").html("");
                var confidentialText = "";
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    if (response1.Data == "") {
                        closeload();
                        return false;
                    }
                    var obj = JSON.parse(response1.Data);
                    var length = obj.length;
                    if (length == "0") {
                        /*$("#docPaginationD").attr("style", "display: none;");*/
                        $("#docPaginationD").hide();
                        $("#docstatus").show();
                        //$("#docstatus").html("No documents found.");
                    }
                    else {
                        //$("#docstatus").html("");
                        $("#docstatus").hide();
                    }
                }
                else {
                    closeload();
                }
                try {

                    $.each(obj, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = a.totRow;
                        //    var totpage = 0;
                        //    if (a.totRow > 0) {
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
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="docsotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="docpagnumvalue" min="1"  class="footerInput"  ><a class="gobtn"  type="button" id="docgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        //    if (a.totRow <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="docpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="docpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="docpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#tfooter").append(tfot);
                        //    closeload();
                        //}
                        /*$("#docPaginationD").attr("style", "display: block !important;");*/
                        $("#docPaginationD").show();
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totdata);
                            if (pageindex == totpage) {
                                $('#docNext').hide();
                                $('#docPrev').css("display", "block");
                            }
                            else {
                                $('#docNext').css("display", "block");
                            }
                            if (pageindex == 1) {
                                $('#docPrev').css("display", "none");
                            }
                            else {
                                $('#docPrev').css("display", "block");
                            }

                            if (isDocRnd == false) {
                                dirFileCount = totpage;
                                DocumentRenderPagination(pageindex, totpage);
                            }
                        }


                        var tmpdir = a.fname;
                        var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                        var dirname = tmpdir.replace(replacedata, '');
                        var dat = a.date_time;
                        var dates1 = formatDatetoIST(dat)
                        var dates2 = a.date_time;
                        var dates1 = formatDatetoIST(dates2)
                        var ficon = "blue_file.svg";
                        var icolor = "black";
                        var str = a.filetype;
                        var dropboxftoken = "";
                        var moveshow = "";
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOC" || ftype == "DOCX") {
                                ficon = "doc-icon.png";
                                icolor = "#1860a3";
                            }
                            if (ftype == "PPT" || ftype == "PPTX") {
                                ficon = "ppt.png";
                                icolor = "orange";
                            }
                            if (ftype == "PDF") {
                                ficon = "pdf-icon.png";
                                icolor = "red";
                            }
                            if (ftype == "ZIP") {
                                ficon = "zip.png";
                                icolor = "orange";
                            }
                            if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                                ficon = "png.png";
                                icolor = "#1860a3";
                            }
                            if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                                ficon = "xlsx.png";
                                icolor = "green";
                            }
                            if (ftype == "TXT") {
                                ficon = "txt_icon.svg";
                                icolor = "skyblue";
                            }
                        }
                        var editiconfilecheckcss = "display:none";
                        if (ftype == "DOC" || ftype == "DOCX") {
                            editiconfilecheckcss = "";
                        }
                        if (ftype == "DOC" || ftype == "DOCX") {
                            if (String(a.dirid) == "00000000-0000-0000-0000-000000000000") {
                                openurl = bsurlfile + '/Docs/ViewSampleCloud?fileName=' + a.fname + '&dname=&ftoken=' + a.firmId + '&utoken=' + a.Firmuser + '&token=' + a.id;
                            }
                            else {
                                openurl = bsurlfile + '/Docs/ViewSampleCloud?fileName=' + a.fname + '&dname=' + a.id + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser + '&token=' + a.id;
                            }
                            urlstype = "";
                        }
                        else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "PPT" || ftype == "PPTX") {
                            var pageURL1 = window.location.origin;
                            var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            openurl = enctypesingle(downloadpath1);
                            urlstype = "office";
                        }
                        else {
                            var pageURL1 = window.location.origin;
                            var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            openurl = enctypesingle(downloadpath1);
                            urlstype = "docs";
                        }
                        var dropboxftoken1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                        dropboxftoken = enctypesingle(dropboxftoken1);
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        var fids = "";
                        var id = 0;
                        if (a.ftype == 1) {
                            var tempdownloadpath = "/LawPractice_ds/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            if (a.movecount == 0) {
                                quesmark = "display:none";
                                moveshow = "cursor:pointer;"
                            }
                            else {
                                quesmark = "cursor:pointer;";
                            }
                            if (String(a.IdDeleted) == "1") {
                                marklabel = "Unmark file for deletion";
                                markcolor = "margin-top:0px; color:red;cursor:pointer";
                                rowreflect = "background:#f5c9c9";
                            }
                            else {
                                marklabel = "Mark file for deletion";
                                markcolor = "margin-top:0px; color:#5c5c5c;cursor:pointer";
                                rowreflect = "";
                            }
                            if (String(a.fpermission) == "" || String(a.fpermission) == null || String(a.fpermission) == "0" || String(a.fpermission) == "NULL" || String(a.fpermission) == "null") {
                                syncflg = 0;
                                syncicon = "";
                                synctitle = "";
                            }
                            else {
                                syncflg = 1;
                                syncicon = "glyphicon glyphicon-refresh";
                                synctitle = "File marked for Syncing";
                            }
                            if (String(a.IsSync) == "1") {
                                dsyncicon = "glyphicon glyphicon-retweet";
                                dsynctitle = "Marked for data synchronization";
                            }
                            else {
                                dsyncicon = "";
                                dsynctitle = "";
                            }
                            // alert(a.fname);
                            var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                            var checkoutpath = "/Azure/CheckoutFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                            var chkincss = "";
                            var chkoutcss = "";
                            if (a.IsCheckinOut == "1") {
                                chkoutcss = "display:none";
                                chkincss = "display:inline-block";
                            }
                            else {
                                chkoutcss = "display:inline-block";
                                chkincss = "display:none";
                            }
                            var isdeletes = "display:block;color:red;";
                            var validateforinuse = "0";
                            if (a.IsCheckinOut == "1") {
                                if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                    if (a.oedit == "1") {
                                        validateforinuse = "0";
                                    }
                                }
                                else {
                                    if (a.oedit == "1") {
                                        validateforinuse = "1";
                                    }
                                }
                            }
                            //var confidcss = "";
                            //var confidcsstitle = "";
                            //if (a.Isconfidential == "1") {
                            //    confidcss = "fa fa-lock";
                            //    confidcsstitle = "Click here to mark document as non-confidential";
                            //}
                            //else {
                            //    confidcss = "fa fa-unlock";
                            //    confidcsstitle = "Click here to mark document as confidential";
                            //}

                            var confidcss = "";
                            var confidcsstitle = "";
                            if (a.Isconfidential == "1") {
                                confidcss = "lock-icon.png";
                                confidcsstitle = "Click here to mark document as non-confidential";
                                confidentialText = "Mark Non-Confidential";
                            }
                            else {
                                confidcss = "unlock-icon.png";
                                confidcsstitle = "Click here to mark document as confidential";
                                confidentialText = "Mark Confidential";
                            }
                            //For New verions code
                            html += '<tr>';
                            html += '<td align="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                            html += '<td class="7" style="display: grid; grid-template-columns: 50px 300px 20px 30px; align-items:center;' + rowreflect + '">';
                            html += '<img width="32px" height="32px" src="/newassets/img/' + ficon + '" /><span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a >'
                            //if (a.oedit == "1" && a.IsCheckinOut != "1") {
                            //    html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/editmatter.png" title="Click on file name to Edit ONLINE on the cloud"  style="cursor:pointer;' + editiconfilecheckcss + '"  />'
                            //}

                            //html += '<div class="pull-right">'
                            //html += '<div class="btn-group" >'
                            ////html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                            ////html += '<span class="caret"></span>'
                            ////html += '<span class="sr-only">Toggle Dropdown</span>'
                            ////html += '</button>'
                            //html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                            //html += '<span><img src="/newassets/img/version-icon.png" /></span>'
                            //html += '<span class="sr-only">Toggle Dropdown</span>'
                            //html += '</button>'

                            //html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                            //html += '<table class="table-panel" width="100%"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                            //html += '<tbody id="bindfileversion' + a.id + '" >'
                            //html += '</tbody>'
                            //html += '</table>'
                            //html += '</div>'
                            //html += '</div>'
                            html += '</div>'
                            html += '</td>';
                            html += '<td style="' + rowreflect + '">' + dates1 + '</td>';
                            html += '<td style="' + rowreflect + '">' + a.CreatedBy + '</td>';
                            html += '<td style="' + rowreflect + '">' + last + "( " + a.FileSize + " )" + '</td>';
                            html += '<td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td>';
                            if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                if (a.oedit == "1") {
                                    if (a.IsCheckinOut == "1") {
                                        html += '<td><span style="' + chkincss + '" class="checkin1 checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                    }
                                    else {
                                        html += '<td><span style="' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                    }
                                }
                                else {
                                    html += '<td width="100px;"></td>';
                                }
                            }
                            else {
                                if (a.oedit == "1") {
                                    if (a.IsCheckinOut == "1") {
                                        html += '<td><span style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                                    }
                                    else {
                                        html += '<td><span style="' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                    }
                                }
                                else {
                                    html += '<td width="100px;"></td>';
                                }
                            }
                            html += '<td width="100px;">';
                            html += '<ul class="action-ul">';

                            if (roleid == 1) {
                                html += '<li><div style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share-icon.png" /></li>';
                            } else if (a.share == 1) {
                                html += '<li><div style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share-icon.png" /></div></li>';
                            }
                            if (a.odelete == 1) {
                                html += '<li><div class="" isdelete="' + a.IdDeleted + '" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" data-inuser="' + validateforinuse + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '" value="' + a.id + '"></span> <span class="" style="' + isdeletes + '"></span><img src="/newassets/img/deletecasesingle-icon.png" /></a></div></li>';
                            }

                            html += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="32" width="32"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                            if (a.oedit == "1" && a.IsCheckinOut != "1") {
                                html += '<li><div id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" style="cursor:pointer;' + editiconfilecheckcss + '"><span><img  src="/newassets/images/editmatter.png" title="Click on file name to Edit ONLINE on the cloud"    /></span>Edit Document</div></li>'
                            }
                            html += '<li><div style="cursor:pointer" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"><span><img src="/newassets/img/editfiledes.png" /></span>Edit File Description</div></li>';
                            //html += '<li><div class="MarkConfidential' + confidcss + '" style="cursor:pointer" marktype="' + a.Isconfidential + '"  id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"><span><img src="/newassets/img/confidential.png" /></span> IsConfidencial</div></li>';
                            html += '<li><div class="action_one" id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"><span><img src="/newassets/img/' + confidcss + '"></span>' + confidentialText + '</div></li>';

                            html += '<li><div class="action_one" title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;"><span><img src="/newassets/img/versionHi.png"/></span>Version History</div></li>'

                            html += '<li><div id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="" style="cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"><span><img src="/newassets/img/upload-cloud-01.png" /></span>Upload Document To Cloud</div></li>';
                            html += '<li><div class="" style="cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"><span><img src="/newassets/img/history.png" /></span>Document History</div></li>';

                            html += '<li><div class="" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"><span><img src="/newassets/img/download-01.png" /></span>Download Original Version</div>'

                            //if (roleid == 1) {
                            //    html += '<li><div style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><span><img src="/newassets/img/share-07.png" /></span> Share <span style="' + quesmark + '"> | </span><span class="" style="' + quesmark + '" title="File Already Shared.">Already Shared</span></span></li>';
                            //} else if (a.share == 1) {
                            //    html += '<li><div style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><span><img src="/newassets/img/share-07.png" /></span>  Share</div> <span style="' + quesmark + '"> | </span><span class="" style="' + quesmark + '" title="File Already Shared.">Already Shared</span></span></li>';
                            //}

                            //below remove line
                            //html += '<li><div class="action_one" marktype="' + a.Isconfidential + '" id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"> <img src="/newassets/img/' + confidcss + '"> Mark Confidential</div></li>';

                            html += "</ul></div></li>";
                            if (a.share == 1 || roleid == 1) {
                                html += '<li><span style="' + quesmark + '" title="File Already Shared."><img src="/newassets/img/info-square.png" /></span></li>'
                            }
                            html += "</ul>";
                            html += '</td>'
                            //if (a.odelete == 1 && roleid == 1) {
                            //    html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                            //    html += '<td class="7" style="' + rowreflect + '">';
                            //    html += '<i name = "' + a.fname + '" class="' + ficon + '" style = "font-size:14px;color:' + icolor + '" ></i > <span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a >'
                            //    if (a.oedit == "1" && a.IsCheckinOut != "1") {
                            //        html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                            //    }
                            //    html += '<i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                            //    html += '<div class="pull-right">'
                            //    html += '<div class="btn-group" >'
                            //    html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                            //    html += '<span class="caret"></span>'
                            //    html += '<span class="sr-only">Toggle Dropdown</span>'
                            //    html += '</button>'
                            //    html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                            //    html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                            //    html += '<tbody id="bindfileversion' + a.id + '" >'
                            //    html += '</tbody>'
                            //    html += '</table>'
                            //    html += '</div>'
                            //    html += '</div>'
                            //    html += '</div>'
                            //    html += '</td>';
                            //    html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';
                            //    html += '<td style="' + rowreflect + ';padding: 0px !important;">';
                            //    html += '<table><tr><td><btn class="" isdelete="' + a.IdDeleted + '" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile"  data-inuser="' + validateforinuse + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '" value="' + a.id + '"></span> <span class="glyphicon glyphicon-trash" style="' + isdeletes + '"></span></btn></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><a class="glyphicon glyphicon-download-alt" style="cursor: pointer; border:1px solid black; border-radius: 50%; padding: 3px; font-size: 10px;" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> </a> </span ></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><span id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="glyphicon glyphicon-cloud-upload" style="color: #1da1ce;font-size:15px;cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"></span></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><i class="glyphicon glyphicon-edit" style="color:#069;cursor:pointer" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"></i></td>';
                            //    var confidcss = "";
                            //    var confidcsstitle = "";
                            //    if (a.Isconfidential == "1") {
                            //        confidcss = "fa fa-lock";
                            //        confidcsstitle = "Click here to mark document as non-confidential";
                            //    }
                            //    else {
                            //        confidcss = "fa fa-unlock";
                            //        confidcsstitle = "Click here to mark document as confidential";
                            //    }
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><i class="' + confidcss + '" style="color:#069;cursor:pointer" marktype="' + a.Isconfidential + '"  id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"></i></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                            //        if (a.oedit == "1") {
                            //            if (a.IsCheckinOut == "1") {
                            //                html += '<td><span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin</span></td>';
                            //            }
                            //            else {
                            //                html += '<td><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                            //            }
                            //        }
                            //    }
                            //    else {
                            //        if (a.oedit == "1") {
                            //            if (a.IsCheckinOut == "1") {
                            //                html += '<td><span style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                            //            }
                            //            else {
                            //                html += '<td><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                            //            }
                            //        }
                            //    }
                            //    html += '<td>| <i class="fa fa-history" style="color:black;cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"></i></td>';
                            //    html += '<tr></table>';
                            //    html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span><span class="glyphicon glyphicon-share"></span></a> <span style="' + quesmark + '"> | </span><span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="File Already Shared."></span></td > <td style="' + rowreflect + '">' + a.FileSize + '</td><td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                            //}
                            //else if (a.odelete == 1 || roleid == 1) {
                            //    html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                            //    html += '<td class="7" style="' + rowreflect + '">';
                            //    html += '<i name = "' + a.fname + '" class="' + ficon + '" style = "font-size:14px;color:' + icolor + '" ></i > <span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a >'
                            //    if (a.oedit == "1" && a.IsCheckinOut != "1") {
                            //        html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                            //    }
                            //    html += '<i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                            //    html += '<div class="pull-right">'
                            //    html += '<div class="btn-group" >'
                            //    html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                            //    html += '<span class="caret"></span>'
                            //    html += '<span class="sr-only">Toggle Dropdown</span>'
                            //    html += '</button>'
                            //    html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                            //    html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                            //    html += '<tbody id="bindfileversion' + a.id + '" >'
                            //    html += '</tbody>'
                            //    html += '</table>'
                            //    html += '</div>'
                            //    html += '</div>'
                            //    html += '</div>'
                            //    html += '</td>';
                            //    html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';
                            //    html += '<td style="' + rowreflect + ';padding: 0px !important;">';
                            //    html += '<table><tr><td><btn class="" isdelete="' + a.IdDeleted + '" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" data-inuser="' + validateforinuse + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '" value="' + a.id + '"></span> <span class="glyphicon glyphicon-trash" style="' + isdeletes + '"></span></btn></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><a class="glyphicon glyphicon-download-alt" style="cursor: pointer; border:1px solid black; border-radius: 50%; padding: 3px; font-size: 10px;" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> </a> </span ></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><span id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="glyphicon glyphicon-cloud-upload" style="color: #1da1ce;font-size:15px;cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"></span></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><i class="glyphicon glyphicon-edit" style="color:#069;cursor:pointer" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"></i></td>';
                            //    var confidcss = "";
                            //    var confidcsstitle = "";
                            //    if (a.Isconfidential == "1") {
                            //        confidcss = "fa fa-lock";
                            //        confidcsstitle = "Click here to mark document as non-confidential";
                            //    }
                            //    else {
                            //        confidcss = "fa fa-unlock";
                            //        confidcsstitle = "Click here to mark document as confidential";
                            //    }
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    if (a.confidential == 1) {
                            //        html += '<td><i class="' + confidcss + '" style="color:#069;cursor:pointer" marktype="' + a.Isconfidential + '" id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"></i></td>';
                            //    }
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                            //        if (a.oedit == "1") {
                            //            if (a.IsCheckinOut == "1") {
                            //                html += '<td><span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin</span></td>';
                            //            }
                            //            else {
                            //                html += '<td><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                            //            }
                            //        }
                            //    }
                            //    else {
                            //        if (a.oedit == "1") {
                            //            if (a.IsCheckinOut == "1") {
                            //                html += '<td><span style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                            //            }
                            //            else {
                            //                html += '<td><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                            //            }
                            //        }
                            //    }
                            //    html += '<td>| <i class="fa fa-history" style="color:black;cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"></i></td>';
                            //    html += '<tr></table>';
                            //    if (a.share == 1) {
                            //        html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span><span class="glyphicon glyphicon-share"></span></a> <span style="' + quesmark + '"> | </span> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="File Already Shared."></span></td > <td style="' + rowreflect + '">' + a.FileSize + '</td><td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                            //    }
                            //    else {
                            //        html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"></td > <td style="' + rowreflect + '">' + a.FileSize + '</td><td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> <td style="' + rowreflect + '">' + a.CaseNames + '</td></tr > ';
                            //    }
                            //}
                            //else {
                            //    html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                            //    html += '<td class="7" style="' + rowreflect + '">';
                            //    html += '<i name = "' + a.fname + '" class="' + ficon + '" style = "font-size:14px;color:' + icolor + '" ></i > <span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a >'
                            //    if (a.oedit == "1" && a.IsCheckinOut != "1") {
                            //        html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                            //    }
                            //    html += '<i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                            //    html += '<div class="pull-right">'
                            //    html += '<div class="btn-group" >'
                            //    html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                            //    html += '<span class="caret"></span>'
                            //    html += '<span class="sr-only">Toggle Dropdown</span>'
                            //    html += '</button>'
                            //    html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                            //    html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                            //    html += '<tbody id="bindfileversion' + a.id + '" >'
                            //    html += '</tbody>'
                            //    html += '</table>'
                            //    html += '</div>'
                            //    html += '</div>'
                            //    html += '</div>'
                            //    html += '</td>';
                            //    html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';
                            //    html += '<td style="' + rowreflect + ';padding: 0px !important;">';
                            //    html += '<table><tr><td></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><a class="glyphicon glyphicon-download-alt" style="cursor: pointer; border:1px solid black; border-radius: 50%; padding: 3px; font-size: 10px;" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> </a> </span ></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><span id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="glyphicon glyphicon-cloud-upload" style="color: #1da1ce;font-size:15px;cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"></span></td>';
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    html += '<td><i class="glyphicon glyphicon-edit" style="color:#069;cursor:pointer" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"></i></td>';
                            //    var confidcss = "";
                            //    var confidcsstitle = "";
                            //    if (a.Isconfidential == "1") {
                            //        confidcss = "fa fa-lock";
                            //        confidcsstitle = "Click here to mark document as non-confidential";
                            //    }
                            //    else {
                            //        confidcss = "fa fa-unlock";
                            //        confidcsstitle = "Click here to mark document as confidential";
                            //    }
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    if (a.confidential == 1) {
                            //        html += '<td><i class="' + confidcss + '" style="color:#069;cursor:pointer" marktype="' + a.Isconfidential + '" id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"></i></td>';
                            //    }
                            //    html += '<td  style="padding: 5px 0 0 0 !important;margin: 0;">|</td>';
                            //    if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                            //        if (a.oedit == "1") {
                            //            if (a.IsCheckinOut == "1") {
                            //                html += '<td><span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin</span></td>';
                            //            }
                            //            else {
                            //                html += '<td><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                            //            }
                            //        }
                            //    }
                            //    else {
                            //        if (a.oedit == "1") {
                            //            if (a.IsCheckinOut == "1") {
                            //                html += '<td><span style="' + chkincss + '"  id="InUse' + a.id + '"  isinuse="1" title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                            //            }
                            //            else {
                            //                html += '<td><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                            //            }
                            //        }
                            //    }
                            //    html += '<td>| <i class="fa fa-history" style="color:black;cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"></i></td>';
                            //    html += '<tr></table>';
                            //    if (a.share == 1) {
                            //        html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Click here to share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span><span class="glyphicon glyphicon-share"></span></a>  <span style="' + quesmark + '"> | </span><span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="File Already Shared."></span></td ><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                            //    }
                            //    else {
                            //        html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"></td ><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                            //    }
                            //}
                        }
                        else {
                            if (a.movecount == 0) {
                                quesmark = "display:none";
                                moveshow = "cursor:pointer;display:unset;"
                            }
                            else {
                                quesmark = "cursor:pointer;display:unset";
                            }
                            if (String(a.IsSync) == "1") {
                                dsyncicon = "glyphicon glyphicon-retweet";
                                dsynctitle = "Marked for data synchronization";
                            }
                            else {
                                dsyncicon = "";
                                dsynctitle = "";
                            }
                            if (String(a.IdDeleted) == "1") {
                                marklabel = "Unmark file for deletion";
                                markcolor = "margin-top:0px; color:red;cursor:pointer";
                                rowreflect = "background:#f5c9c9";
                            }
                            else {
                                marklabel = "Mark file for deletion";
                                markcolor = "margin-top:0px; color:#5c5c5c;cursor:pointer";
                                rowreflect = "";
                            }
                            var ViewFolderName = "";
                            if (a.Caseid == "") {
                                ViewFolderName = dirname;
                            }
                            else {
                                var resultvalid = validatercasefile(dirname);
                                if (resultvalid == true) {
                                    ViewFolderName = dirname.substring(0, dirname.length - 13);
                                    ViewFolderName = ViewFolderName;
                                }
                                else {
                                    ViewFolderName = dirname;
                                }
                            }
                            html += '<tr>';
                            html += '<td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td>';
                            html += '<td class="7" style="display: grid; grid-template-columns: 50px 300px 20px 30px; align-items:center;"> <img src="/newassets/img/file_blue.svg" /> <a id="transferpage" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td>';
                            html += '<td>' + dates1 + '</td>';
                            html += '<td style="' + rowreflect + '">' + a.CreatedBy + '</td>';
                            html += '<td></td>';
                            html += '<td>' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td>';
                            html += '<td></td>';
                            html += '<td>'
                            if (a.odelete == 1) {
                                html += '<span style="padding:8px 8px 3px 0 !important"><span style="cursor:pointer;" id="removedir" code="' + a.AZureFileId + '" values="' + a.id + '" dirname="' + a.fname + '" filepath="' + directorypath + '" ><img src="/newassets/img/deletecasesingle-icon.png"></span>';
                            }

                            html += '<span><a href="javascript:void()" style="cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></a> <span class="" style="' + quesmark + '" title="Folders have Shared document."></span>';
                            html += '</td>'
                            //if (a.odelete == 1 && roleid == 1) {
                            //    html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><span name="' + a.fname + '" class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<a id="transferpage" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</td>';
                            //    html += '<td><table><tr><td style="padding:8px 8px 3px 0 !important"><span class="glyphicon glyphicon-trash" style="color:#5c5c5c; cursor:pointer;color:red;" id="removedir" code="' + a.AZureFileId + '" values="' + a.id + '" dirname="' + a.fname + '" filepath="' + directorypath + '" > </span></td></tr></table></td>';
                            //    html += '<td></td> <td><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><span class="glyphicon glyphicon-share"></span></a> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="Folders have Shared document."></span></td> <td>&nbsp;</td> <td>' + a.CreatedBy + '</td> <td></td></tr > ';
                            //}
                            //else if (a.odelete == 1 || roleid == 1) {
                            //    html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><span name="' + a.fname + '" class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<a id="transferpage" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</td>';
                            //    html += '<td><table><tr><td style="padding:8px 8px 3px 0 !important"><span class="glyphicon glyphicon-trash" style="color:#5c5c5c; cursor:pointer;color:red;" id="removedir" code="' + a.AZureFileId + '" values="' + a.id + '" dirname="' + a.fname + '" filepath="' + directorypath + '" > </span></td></tr></table></td>';
                            //    html += '<td></td> <td><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><span class="glyphicon glyphicon-share"></span></a> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="Folders have Shared document."></span></td> <td>&nbsp;</td> <td>' + a.CreatedBy + '</td> <td></td></tr > ';
                            //}
                            //else {
                            //    html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><span name="' + a.fname + '" class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<a id="transferpage" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</td>';
                            //    html += '<td></td>';
                            //    html += '<td></td> <td><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><span class="glyphicon glyphicon-share"></span></a> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="Folders have Shared document."></span></td><td>&nbsp;</td>  <td>' + a.CreatedBy + '</td> <td></td></tr > ';
                            //}
                        }
                    });
                }
                catch (err) {
                    console.log(err.message);
                }
                $("#cdbinddocs").empty().append(html);
                closeload();
            },
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            closeload();
            loaddocbruidcumb();
            if (loadcontactflag == false) {
                permissionlist();
                loadcontact();
                LoadDirectory(0);
                loadcontactflag = true;
            }
        });
    }
    /*Document Pagination Start*/
    var isDocRnd = false;
    //var setCommPopNo = 1;
    function DocumentRenderPagination(pageindex, totdata) {
        let totPages = totdata;
        cdddpageindex = pageindex;
        let paginationHtml = '';
        let maxVisible = 4;

        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btndoc ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btndoc ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btndoc ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#docPageNumbers").html(paginationHtml);
        isDocRnd = true;
    }

    $(document).on("click", ".page-btndoc", function () {
        let page = $(this).data("page");
        cdddpageindex = page;
        isDocRnd = true;
        $("#doctxtgopage").val("");
        LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);
        $(".page-btndoc").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#docPrev", function () {
        if (cdddpageindex > 1) {
            cdddpageindex = cdddpageindex - 1;
        }
        isDocRnd = true;
        $("#doctxtgopage").val("");
        LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);

        $(".page-btndoc").removeClass("active");
        $(".page-btndoc[data-page='" + cdddpageindex + "']").addClass("active");
    });


    $(document).on("click", "#docNext", function () {
        if (cdddpageindex => 1) {
            cdddpageindex = cdddpageindex + 1;
        }
        isDocRnd = true;
        $("#doctxtgopage").val("");
        LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);

        $(".page-btndoc").removeClass("active");
        $(".page-btndoc[data-page='" + cdddpageindex + "']").addClass("active");
    });

    $(document).on("click", "#docdivGo", function () {
        let goToPage = parseInt($("#doctxtgopage").val());
        if (!isNaN(goToPage)) {
            cdddpageindex = goToPage;
        }
        if (goToPage > dirFileCount || goToPage == 0) {
            alert("Please enter a valid page number.");
            cdddpageindex = 1;
            return false;
        }
        isDocRnd = true;
        LoadDirectoryFiles(cdddpageindex, searchtype, directorytoken);

        $(".page-btndoc").removeClass("active");
        $(".page-btndoc[data-page='" + cdddpageindex + "']").addClass("active");
    });

    /*Document Pagination End*/

    /*CD pdf*/
    $("#cdpdf").click(function () {
        var caseid = token;
        window.location = encodeURI("/firm/ExportoPdfofMattersform?caseid=" + caseid);
    });

    //change time entry status
    $(document).on("click", "#changetimeentrytype", function () {
        bindCommonDropdown("timeentrytypeformodel", "TimeEntry_Type", 'Please select');
        var timerids = $(this).attr("data-id");
        $('#selecttimerids').val(timerids);
        $("#myModalwipchange").modal();
    });

    //update time entry  status
    $(document).on("click", "#btnsavestatus", function () {
        var timeridss = $('#selecttimerids').val();
        var timeentryststus = $('#timeentrytypeformodel').val();
        if (timeentryststus == "") {
            alert("Please select time entry type");
            return false;
        }
        var formData = new FormData();
        formData.append("timeridss", EncodeText(timeridss));
        formData.append("timeentryststus", EncodeText(timeentryststus));
        openload();
        $.ajax({
            async: true,
            url: '/api/CallApi/UpdateTimeEntryStatus',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    new PNotify({
                        title: 'Success!',
                        text: ' Status update Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    loaddatalist(pageindex);
                    $("#timeentrytypefrm")[0].reset();
                    $("#myModalwipchange").modal('hide');
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
    });
    //For Linked Matters
    $(document).on("click", "#openMainmatterdetails", function () {
        var caseid = $(this).attr("caseid");
        var formData = new FormData();
        formData.append("caseid", caseid);
        $('#myModalmainMatterName').modal({ show: true });
        openload();
        qty1 = 0;
        var html = '';
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/LoadMainMattersDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {

                var datas1 = JSON.stringify(response1);
                var countdays1 = "";
                $("#linkmainmatters").val(response1.data[0].CaseNoMainMatters);
                $("#linkmainmatters1").val(response1.data[0].CaseNoMainMatters);
                //$.each(response1, function (i, a) {
                //    html += '<tr>';
                //    html += '<td> ' + response1.data[0].CaseNoMainMatters + '</td>';
                //    html += '</tr>';
                //    $("#mainmatterlist1").append(html);
                //    closeload();
                //});
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
    });

    //For Linked/Main Matters
    $(document).on("click", "#openlinkeddetails", function () {
        var caseid = $(this).attr("caseid");
        var formData = new FormData();
        formData.append("caseid", caseid);
        $('#myModalSCourtDetails').modal('hide');
        $('#myModallinkedsmatters').modal({ show: true });
        var modelid = "#SCourtLinks1";
        var typeLinkedCases = "LinkedCases";
        CaseDataCaseWatch1(modelid, caseid, typeLinkedCases);
        openload();
        var html = '';
        $("#LinkedMattersDetails").html('');
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/LoadLinkedMattersDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.data.Table[0] != null) {
                    $("#linkmainmatters1").val(response1.data.Table[0].CaseNoMainMatters);

                    if (response1.data.Table[0].LinkedCaseNoUserCaseId != null) {
                        $("#viewidss").show();
                        $("#linkedcaseusercaseids").val(response1.data.Table[0].LinkedCaseNoUserCaseId);
                        $("#linkmastercaseids").val(response1.data.Table[0].MasterId);
                    }
                    else {
                        $("#addidss").show();
                        $("#maincasenumber").val(response1.data.Table[0].CaseNoMainMatters);
                        $("#linkmastercaseids").val(response1.data.Table[0].MasterId);

                    }
                }
                if (response1.data.Table1 != null) {
                    if (response1.data.Table1.length != 0) {
                        $.each(response1.data.Table1, function (i, a) {
                            html += '<tr>';
                            html += '<td style="font-size:12px !important;"> ' + a.FilingNumber + '</td>';
                            html += '<td style="font-size:12px !important;"> ' + a.CaseNoLinkedCase + '</td>';
                            if (a.isMainCase != 1) {
                                if (a.LinkedCaseNoUserCaseId != null) {
                                    html += '<td align="center" style="text-align:center; font-size:12px !important;"><a title="View Linked Case Details" href="#"  id="ViewLinkedCaseAdd" ctype="linked" Idss=' + a.LinkedCaseNoUserCaseId + ' data-val=' + a.MasterId + ' style="padding: 6px 12px; background:#3276b1; border-radius: 8px; font-size: 12px; color: #fff;" >View</a></td>';
                                }
                                else {
                                    html += '<td align="center" style="font-size:12px !important; text-align:center"><a title="Add Case To Live Track" href="#"  id="AddLinkedCaseToTrack" ctype="linked" Idss=' + a.CaseNoLinkedCase + ' data-val=' + a.MasterId + ' style="padding: 6px 12px; background:#3276b1; border-radius: 8px; font-size: 12px; color: #fff;" >Add</a></td>';
                                }
                            }
                            else {
                                html += '<td></td>';
                            }

                            html += '</tr>';
                        });
                        $("#LinkedMattersDetails").append(html);
                    }
                    else {
                        $('#LinkedMattersDetailsDataNotFound').show();
                    }
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
    });


    //Transfer Linked Case Deatils 
    $(document).on("click", "#ViewLinkedCaseAdd", function () {

        //var transferid = $("#maincasenumber").val();
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
    $(document).on("click", "#AddLinkedCaseToTrack", function () {
        var MasterCaseId = $(this).attr("data-val");
        var LinkedCaseNo = $(this).attr("Idss");
        var casetype = $(this).attr("ctype");
        GetContemptCaseDetailsForModal(MasterCaseId, LinkedCaseNo, casetype);
        addteammember();
    });
    function GetContemptCaseDetailsForModal(MasterCaseId, LinkedCaseNo, casetype) {
        var formData = new FormData();
        formData.append("mastercaseid", MasterCaseId);
        formData.append("Linkedcaseno", LinkedCaseNo);
        formData.append("ccasetype", casetype);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            type: "POST",
            url: "/CW/LoadContemptCaseDetails", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#tblsserch").text('');
                if (response.data.length > 0) {
                    $('#Contemptsearchdetails').modal({ show: true });
                    $('#mongoreset')[0].reset();
                    $.each(response.data, function (i, val) {
                        //set value on hidden fields  start
                        $("#LinkedCasIds").val(val.linkedcaseno);
                        $("#MasterCaseIdss").val(val.mastercaseId);
                        $("#LinkedCaseUserName").val(val.vusername);
                        $("#courtnamess").val(val.CourtName);
                        $("#Parentusercaseids").val(val.Id);
                        $("#Vcourttype").val(val.vCourtType);
                        $("#vcasetypeids").val(val.CaseType);
                        $("#vcasenumverids").val(val.Caseno);
                        $("#vcaseyearids").val(val.CaseYear);
                        $("#Scasetype").val(val.sCaseType);
                        $("#linkedcasetypes").val(val.linkedcasetype);

                        if (val.Court == "SC") {
                            $("#courtnamess").val("Supreme Court")
                        } else if (val.Court == "SC") {
                            $("#courtnamess").val("High Court")
                        }
                        else if (val.Court == "DC") {
                            $("#courtnamess").val("District Court")
                        }
                        else if (val.Court == "TC") {
                            $("#courtnamess").val("Tribunals")
                        }
                        $("#Courttype").val(val.courttype);
                        $("#casename").val(val.vCaseName);
                        $('#casename').attr('title', val.vCaseName);
                        $("#mhearingdate").val(formatDatetoIST(val.nexthearingdate));
                        $("#madvocatename").val(val.vAdvocateName);
                        $('#madvocatename').attr('title', val.vAdvocateName);
                        $("#MatterNamess").val(val.vCaseName);
                        $('#MatterNamess').attr('title', val.vCaseName);
                        $("#Caseno").val(val.Caseno);
                        $("#Caseyear").val(val.CaseYear);
                        $("#DiaryNo").val(val.CaseTypeName);
                        $('#DiaryNo').attr('title', val.CaseTypeName);
                        $("#BenchName").val(val.Bench);
                        $("#Cnrno").val(val.CNRNo);


                    });
                    closeload();
                }
                else {
                    alert("The case cannot be verified at the moment. Please add it directly. Click 'Save' to proceed.");
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
        })
    }
    //For Binding Team Member details
    function addteammember() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/TeamMemberbyFirmId",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }

                //else {
                if (response != null) {
                    $(".ms-selectall").show();
                    $("#teammemberss").empty();
                    $.each(obj, function (key, value) {
                        if (value.roleid != 1) {
                            $("#teammemberss").append($("<option></option>").val(value.id).text(value.UserName));
                        }
                    });
                }
                else {
                }
                $("#teammemberss").multiselect('reload');
            },
            failure: function (response) {
                //alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                //alert(response.responseText);
            } //End of AJAX error function
        });
    }
    $(document).on("click", "#AddLinkedcase", function () {
        var Cnrnos = $("#Cnrno").val();
        var Casetypes = $("#vcasetypeids").val();
        var Casenos = $("#vcasenumverids").val();
        var Caseyears = $("#vcaseyearids").val();
        //var AppealNo = $("#DiaryNo").val();
        var Courts = $("#courtnamess").val();
        var LinkedCaseNo = $("#LinkedCasIds").val();
        var MasterCaseIds = $("#MasterCaseIdss").val();
        var LinkedCaseUserName = $("#LinkedCaseUserName").val();
        var casenames = $("#casename").val();
        var mkcasenames = $("#MatterNamess").val();
        if (mkcasenames == "") {
            alert("Please enter the matter name.");
            return false;
        }
        if (mkcasenames != "") {
            var litigationcasenameer = mkcasenames.substr(0, 100);
            var casensss = litigationcasenameer.replace(/[^\w\s]/gi, '');
        }
        var ParentUserCaseIds = $("#Parentusercaseids").val();
        var vCourttypeid = $("#Vcourttype").val();
        var Scaetype = $("#Scasetype").val();
        var teammemberlist = $("#teammemberss").val();
        var slinkedcasetype = $("#linkedcasetypes").val();
        var formData = new FormData();
        formData.append("LinkedCaseUserName", EncodeText(LinkedCaseUserName));
        formData.append("MasterCaseIds", EncodeText(MasterCaseIds));
        formData.append("LinkedCaseNo", EncodeText(LinkedCaseNo));
        formData.append("Cnrnos", EncodeText(Cnrnos));
        formData.append("Casetypes", EncodeText(Casetypes));
        formData.append("Casenos", EncodeText(Casenos));
        formData.append("AppealNo", EncodeText(LinkedCaseNo));
        formData.append("Caseyears", EncodeText(Caseyears));
        formData.append("Courts", EncodeText(Courts));
        formData.append("Courttypes", EncodeText(vCourttypeid));
        formData.append("casenames", EncodeText(casenames));
        formData.append("mkcasenames", EncodeText(casensss));
        formData.append("teammemberlist", EncodeText(teammemberlist));
        formData.append("ParentUserCaseIds", EncodeText(ParentUserCaseIds));
        formData.append("Scasetype", EncodeText(Scaetype));
        formData.append("slinkedcasetype", EncodeText(slinkedcasetype));

        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/MatterApi/LinkedCaseAddLiveUpdate", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data == "Sorry! Unable to Add now.") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Sorry! Unable to Add Case.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Already Exists User Please Try Another User Name!") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'User ID is already exists. Please Try Another User ID !',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecaselimitexceed") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'You have exceeded limit to add Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecaselimitnotfound") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please subscribe for Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecasenotactive") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please subscribe for Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecaseaccessdenied") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'You are not authorized to access add case for live update from e-Courts',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Exist") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Matter Detail Already Exists!!',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Case entry Limit Exceeded, Please upgrade your plan.") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Case entry Limit Exceeded, Please upgrade your plan.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Already exist matter name. please try another matter name") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Matter name already exists. Please try new name.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else {
                        if (data.Data == "false") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'This matter is already exists.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "success") {
                            new PNotify({
                                title: 'Success!',
                                text: ' case saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#Litigationsearchdetails").modal("hide")
                            //  resetselectcase1();
                            closeload();
                            var fcode5 = localStorage.getItem("FirmCode");
                            //window.location = encodeURI("/" + fcode5 + "/Firm/caselist");
                            window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                        }
                        else {
                            alert(data.Data);
                            closeloadCW();
                        }
                    }
                },
                failure: function (data) {
                    alert(data.responseText);
                    closeloadCW();
                },
                error: function (data) {
                    alert(data.responseText);
                    closeloadCW();
                }
            });
    });

    //For Sub Matter Details 
    $(document).on("click", "#opensubmatterdetails", function () {
        var caseid = $(this).attr("caseid");
        var formData = new FormData();
        formData.append("Usercaseid", caseid);
        $('#myModalSubmatters').modal({ show: true });
        openload();
        var html = '';
        $("#SubMatterDetails").html('');
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/LoadSubMattersDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.data != null) {
                    $.each(response1.data, function (i, a) {
                        html += '<tr>';
                        html += '<td> ' + a.SubMatters + '</td>';
                        html += '<td> ' + a.CaseNumber + '</td>';
                        html += '</tr>';
                    });
                    $("#SubMatterDetails").append(html);
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
    });
    //For FIR Details
    $(document).on("click", "#openfirdetails", function () {
        var caseid = $(this).attr("caseid");
        var formData = new FormData();
        formData.append("Usercaseid", caseid);
        $('#myModalFIRDetails').modal({ show: true });
        $('#FIRModalreset')[0].reset();
        openload();
        var html = '';
        $("#FIRDetails").html('');
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/LoadFIRDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                if (response1.data != null) {
                    $.each(response1.data, function (i, a) {
                        $("#FIRNumber").val(a.vFIRNo);
                        $("#PoliceStation").val(a.vPolStation);
                        $("#FIRYear").val(a.vYear);
                        $("#vState").val(a.StateName);
                        $("#vDistrict").val(a.DistrictName);
                        $("#vSection").val(a.vSection);
                        if (a.dDateofIncident != null) {
                            $("#vIncidentDate").val(formatDatetoIST(a.dDateofIncident));
                        }
                        if (a.dDateofComplaint != null) {
                            $("#vComplaintDate").val(formatDatetoIST(a.dDateofComplaint));
                        }
                    });
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
    });
});

$(document).on("click", "#AddLinkedCaseToTrack", function () {
    var MasterCaseId = $(this).attr("data-val");
    var LinkedCaseNo = $(this).attr("Idss");
    var casetype = $(this).attr("ctype");
    GetContemptCaseDetailsForModal(MasterCaseId, LinkedCaseNo, casetype);
    addteammember();
});
function GetContemptCaseDetailsForModal(MasterCaseId, LinkedCaseNo, casetype) {
    var formData = new FormData();
    formData.append("mastercaseid", MasterCaseId);
    formData.append("Linkedcaseno", LinkedCaseNo);
    formData.append("ccasetype", casetype);
    //read assign using list
    qty1 = 0;
    openload();
    $.ajax({
        type: "POST",
        url: "/CW/LoadContemptCaseDetails", // Controller/View
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#tblsserch").text('');
            if (response.data.length > 0) {
                $('#Contemptsearchdetails').modal({ show: true });
                $('#mongoreset')[0].reset();
                $.each(response.data, function (i, val) {
                    //set value on hidden fields  start
                    $("#LinkedCasIds").val(val.linkedcaseno);
                    $("#MasterCaseIdss").val(val.mastercaseId);
                    $("#LinkedCaseUserName").val(val.vusername);
                    $("#courtnamess").val(val.CourtName);
                    $("#Parentusercaseids").val(val.Id);
                    $("#Vcourttype").val(val.vCourtType);
                    $("#vcasetypeids").val(val.CaseType);
                    $("#vcasenumverids").val(val.Caseno);
                    $("#vcaseyearids").val(val.CaseYear);
                    $("#Scasetype").val(val.sCaseType);
                    $("#linkedcasetypes").val(val.linkedcasetype);

                    if (val.Court == "SC") {
                        $("#courtnamess").val("Supreme Court")
                    } else if (val.Court == "SC") {
                        $("#courtnamess").val("High Court")
                    }
                    else if (val.Court == "DC") {
                        $("#courtnamess").val("District Court")
                    }
                    else if (val.Court == "TC") {
                        $("#courtnamess").val("Tribunals")
                    }
                    $("#Courttype").val(val.courttype);
                    $("#casename").val(val.vCaseName);
                    $('#casename').attr('title', val.vCaseName);
                    $("#mhearingdate").val(formatDatetoIST(val.nexthearingdate));
                    $("#madvocatename").val(val.vAdvocateName);
                    $('#madvocatename').attr('title', val.vAdvocateName);
                    $("#MatterNamess").val(val.vCaseName);
                    $('#MatterNamess').attr('title', val.vCaseName);
                    $("#Caseno").val(val.Caseno);
                    $("#Caseyear").val(val.CaseYear);
                    $("#DiaryNo").val(val.CaseTypeName);
                    $('#DiaryNo').attr('title', val.CaseTypeName);
                    $("#BenchName").val(val.Bench);
                    $("#Cnrno").val(val.CNRNo);


                });
                closeload();
            }
            else {
                alert("The case cannot be verified at the moment. Please add it directly. Click 'Save' to proceed.");
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
    })
}
//For Binding Team Member details
function addteammember() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                //alert(datas);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }

            //else {
            if (response != null) {
                $(".ms-selectall").show();
                $("#teammemberss").empty();
                $.each(obj, function (key, value) {
                    if (value.roleid != 1) {
                        $("#teammemberss").append($("<option></option>").val(value.id).text(value.UserName));
                    }
                });
            }
            else {
            }
            $("#teammemberss").multiselect('reload');
        },
        failure: function (response) {
            //alert(response.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            //alert(response.responseText);
        } //End of AJAX error function
    });
}
$(document).on("click", "#AddLinkedcase", function () {
    var Cnrnos = $("#Cnrno").val();
    var Casetypes = $("#vcasetypeids").val();
    var Casenos = $("#vcasenumverids").val();
    var Caseyears = $("#vcaseyearids").val();
    //var AppealNo = $("#DiaryNo").val();
    var Courts = $("#courtnamess").val();
    var LinkedCaseNo = $("#LinkedCasIds").val();
    var MasterCaseIds = $("#MasterCaseIdss").val();
    var LinkedCaseUserName = $("#LinkedCaseUserName").val();
    var casenames = $("#casename").val();
    var mkcasenames = $("#MatterNamess").val();
    if (mkcasenames == "") {
        alert("Please enter the matter name.");
        return false;
    }
    if (mkcasenames != "") {
        var litigationcasenameer = mkcasenames.substr(0, 100);
        var casensss = litigationcasenameer.replace(/[^\w\s]/gi, '');
    }
    var ParentUserCaseIds = $("#Parentusercaseids").val();
    var vCourttypeid = $("#Vcourttype").val();
    var Scaetype = $("#Scasetype").val();
    var teammemberlist = $("#teammemberss").val();
    var slinkedcasetype = $("#linkedcasetypes").val();
    var formData = new FormData();
    formData.append("LinkedCaseUserName", EncodeText(LinkedCaseUserName));
    formData.append("MasterCaseIds", EncodeText(MasterCaseIds));
    formData.append("LinkedCaseNo", EncodeText(LinkedCaseNo));
    formData.append("Cnrnos", EncodeText(Cnrnos));
    formData.append("Casetypes", EncodeText(Casetypes));
    formData.append("Casenos", EncodeText(Casenos));
    formData.append("AppealNo", EncodeText(LinkedCaseNo));
    formData.append("Caseyears", EncodeText(Caseyears));
    formData.append("Courts", EncodeText(Courts));
    formData.append("Courttypes", EncodeText(vCourttypeid));
    formData.append("casenames", EncodeText(casenames));
    formData.append("mkcasenames", EncodeText(casensss));
    formData.append("teammemberlist", EncodeText(teammemberlist));
    formData.append("ParentUserCaseIds", EncodeText(ParentUserCaseIds));
    formData.append("Scasetype", EncodeText(Scaetype));
    formData.append("slinkedcasetype", EncodeText(slinkedcasetype));

    openload();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/LinkedCaseAddLiveUpdate", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "Sorry! Unable to Add now.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Sorry! Unable to Add Case.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "Already Exists User Please Try Another User Name!") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'User ID is already exists. Please Try Another User ID !',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "livecaselimitexceed") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'You have exceeded limit to add Case live update from e-Courts.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "livecaselimitnotfound") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Please subscribe for Case live update from e-Courts.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "livecasenotactive") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Please subscribe for Case live update from e-Courts.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "livecaseaccessdenied") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'You are not authorized to access add case for live update from e-Courts',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "Exist") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter Detail Already Exists!!',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "Case entry Limit Exceeded, Please upgrade your plan.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Case entry Limit Exceeded, Please upgrade your plan.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else if (data.Data == "Already exist matter name. please try another matter name") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter name already exists. Please try new name.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else {
                    if (data.Data == "false") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'This matter is already exists.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "success") {
                        new PNotify({
                            title: 'Success!',
                            text: ' case saved successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#Litigationsearchdetails").modal("hide")
                        //  resetselectcase1();
                        closeload();
                        var fcode5 = localStorage.getItem("FirmCode");
                        //window.location = encodeURI("/" + fcode5 + "/Firm/caselist");
                        window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                    }
                    else {
                        alert(data.Data);
                        closeloadCW();
                    }
                }
            },
            failure: function (data) {
                alert(data.responseText);
                closeloadCW();
            },
            error: function (data) {
                alert(data.responseText);
                closeloadCW();
            }
        });
});

/*Search move files*/
$(document).on('click', '#searchremove', function () {
    $("#searchdata").val("");
});

//Added for Attachment and final Attachment
$(document).on("click", "#filelink", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=task&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
});
$(document).on("click", "#completetaskfilelink", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=completetask&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
});
$(document).on("click", "#filelinkcommu", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=communique&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
});
$(document).on("click", "#filelinkcommureply", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=replycommunique&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myModal').modal({ show: true });
    });
});
$(document).on('click', '#btnsearch', function () {
    $("#searchremovechat").show();
    ChannelList(1);
});
$(document).on('click', '#searchremovechat', function () {
    $("#searchremovechat").hide();
    $("#Channelname").val("");
    ChannelList(1);
});

//chat start
var customecpageindex = 1, customecpagesize = 10;
function ChannelList(customecpageindex) {
    var ecpagesize = 10;
    $("#custombinddata").html("");
    var formData = new FormData();
    formData.append("channelname", $("#Channelname").val());
    formData.append("pagenum", customecpageindex);
    formData.append("pagesize", customecpagesize);
    formData.append("mattername", $("#ncdcasename").text().replace("|", "").trim());
    openload();
    var strrecordexist = 0;
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChatChannelListForMatterDashboard',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            $("#ecfootercustom").empty();
            var length = response.Data.length;
            var tfot = "";
            var html3 = '';
            $.each(response.Data, function (i, val) {
                strrecordexist = 1;
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var pnext = customecpageindex;
                    var pprev = customecpageindex;
                    var pageno = customecpageindex;
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (val.totRow > 0) {
                        pnext = parseInt(pnext) + 1;
                        if (pnext == 0) pnext = 1;
                        pprev = parseInt(pageno) - 1;
                        if (pprev == 0) pprev = 1;
                        totpage = parseInt(totdata) / parseInt(ecpagesize);
                        if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        $("#customcpagnumvalue").attr("max", totpage);
                    }
                    tfot += '<li>results <span>' + totdata + '</span>  <span id="customsotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + customecpageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="customcpagnumvalue" min="1"  class="footerInput"  ><a class="gobtn"  type="button" id="customcgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    tfot += '<li>'
                    if (val.totRow <= length) { }
                    else if (pageno == 1) { }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="custompaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="custompaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a id="custompaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                    }
                    $("#ecfootercustom").append(tfot);
                }
                if (val.CreatedBy.toLowerCase().trim() == userid.toLowerCase().trim()) {
                    if (val.InvitedByUser == 1) {
                        html3 += '<tr><td>' + val.CreatedOn + ' </td><td>' + val.ChannelName + ' </td><td>' + val.UserName + ' </td><td align="center"><a href="#" id="ChannelidGroup1" data-val=' + val.ChannelGuid + ' data-tname=' + val.ChannelName.toString().replace(/ /g, "_") + '><img src="/newassets/images/join.png" title="Rejoin" /></a></td><td align="center"><a id="ViewEdit" href="#" datachannel=' + val.ChannelGuid + ' datateamid=' + val.teamid + ' datateamname="' + val.CaseName + '" datachname="' + val.ChannelName + '" dataaction="viewedit"><span class="glyphicon glyphicon-edit"></span></a> | <span class="glyphicon glyphicon-trash" style="color: red; cursor: pointer;text-align:center" datadel=' + val.ChannelGuid + ' id="channeldelete"></span></td></tr>';
                    }
                    else {
                        html3 += '<tr><td>' + val.CreatedOn + ' </td><td>' + val.ChannelName + '</td><td>' + val.UserName + ' </td><td align="center" ><a target="_self" href="#" onclick=GetAndInsertCustomChannelUserList("' + val.ChannelGuid + '","' + val.ChannelName.toString().replace(/ /g, "_") + '")><img src="/newassets/images/chat_icon.png" title="Chat" /></a></td><td align="center"><a id="ViewEdit" href="#" datachannel=' + val.ChannelGuid + ' datateamid=' + val.teamid + ' datateamname="' + val.CaseName + '" datachname="' + val.ChannelName + '" dataaction="viewedit"><span class="glyphicon glyphicon-edit"></span></a> | <span class="glyphicon glyphicon-trash" style="color: red; cursor: pointer;text-align:center" datadel=' + val.ChannelGuid + ' id="channeldelete"></span></td></tr>';
                    }
                }
                else {
                    $("#actionchatheader").show();
                    if (val.InvitedByUser == 1) {
                        html3 += '<tr><td>' + val.CreatedOn + ' </td><td>' + val.ChannelName + ' </td><td>' + val.UserName + ' </td><td align="center"><a href="#" id="ChannelidGroup1" data-val=' + val.ChannelGuid + ' data-tname=' + val.ChannelName.toString().replace(/ /g, "_") + '><img src="/newassets/images/join.png" title="Rejoin" /></a></td></tr>';
                    }
                    else {
                        html3 += '<tr><td>' + val.CreatedOn + ' </td><td>' + val.ChannelName + '</td><td>' + val.UserName + ' </td><td align="center" > Chat Not Initiated</td></tr>';
                    }
                }
            });
            if (strrecordexist > 0) {
                $("#custombinddata").append(html3);
            }
            else {
                $("#custombinddata").append("<tr><td colspan=7 align=center>No Record Found</td></tr>");
            }
            closeload();
        },
        error: function (response) {
            alert(response.responseText);
            closeload();
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        $("#EColli li input:checkbox:not(:checked)").each(function () {
            var column = "#cexample1 ." + $(this).attr("name");
            $(column).hide();
        });
    });
}
$(document).ready(function () {
    $(document).on('click', '#custompaginate', function () {
        customppageindex = $(this).attr("index");
        ChannelList(customppageindex);
    });
    $(document).on('click', '#customcgetpagnumvalue', function () {
        ppageindex = $("#customcpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#customsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    loadflag = true;
                    ChannelList(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
});
$(document).ready(function () {
    $(document).on('click', '#mclose', function () {
        $("#modalview").hide();
    });

    /*Channel id group*/
    $(document).on('click', '#ChannelidGroup1', function () {
        var strteamname = $(this).attr("data-tname");
        var strfchannelid = $(this).attr("data-val");
        var strffirmid = $("#firmid");
        var strfuserid = $("#userid");
        var strfusername = $("#username");
        var url = "/" + $("#hidfirmcode").val() + "/chat/UserLogin?tid=" + strfchannelid + "&uid=" + strfuserid + "&unm=" + strfusername + "&fid=" + strffirmid + "&tnm=" + strteamname;            //window.location.href = url;
        $("#frm").attr("src", url);
        $("#modalview").show();
    });

    /*View edit*/
    $(document).on('click', '#ViewEdit', function () {
        var strchannelid = $(this).attr("datachannel");
        var strteamid = $(this).attr("datateamid");
        var strchannelname = $(this).attr("datachname");
        var stractiontype = $(this).attr("dataaction");
        var strteamname = $(this).attr("datateamname");
        if (stractiontype == "view") {
            var url = "/" + $("#hidfirmcode").val() + "/chat/ChannelMember?cid=" + strchannelid + '&tid=' + strteamid + '&at=1&chn=' + strchannelname + '&tnm=' + strteamname;            //window.location.href = url;
        }
        else {
            var url = "/" + $("#hidfirmcode").val() + "/chat/ChannelMember?cid=" + strchannelid + '&tid=' + strteamid + '&at=2&chn=' + strchannelname + '&tnm=' + strteamname;          //window.location.href = url;
        }
        $("#frm").attr("src", url);
        $("#modalview").show();
    });
    $(document).on('click', '#channeldelete', function () {
        if (confirm("Are you sure to delete this channel ?")) {
            var formData = new FormData();
            var strchannelid = $(this).attr("datadel");
            formData.append("Channelguid", strchannelid);
            $.ajax(
                {
                    type: "POST",
                    url: "/api/ChatApi/ChannelDel", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        alert("Deleted successfully.");
                    },
                    failure: function (data) {
                        alert(data.responseText);
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            ChannelList(1);
        }
    });
});

/*Get And Insert Custom Channel User List*/
function GetAndInsertCustomChannelUserList(strchannelguid, strteamname) {
    var formData = new FormData();
    formData.append("channelguid", strchannelguid);
    var guids = "";
    var ld123 = $.ajax({
        async: true,
        url: '/api/ChatApi/CreatedChatChannelUserList',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $.each(response.Data, function (i, val) {
                // Do Something in loop here
                guids += val.UserID + "^";
            })
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld123).then(function (data, textStatus, jqXHR) {
        InsertAllTeamUserForChat(strchannelguid, guids, "", strteamname);
    });
}

/*Insert all team user for chat*/
function InsertAllTeamUserForChat(ChannelGuid, userid, username, strteamname = null) {
    var formData = new FormData();
    formData.append("ChannelGuid", ChannelGuid);
    formData.append("UserId", userid);
    formData.append("activedate", $("#currdate").val());
    formData.append("chattype", "1");
    var sdr = $.ajax(
        {
            type: "POST",
            url: "/api/ChatApi/InsertInviteChatTeamUser", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    $.when(sdr).then(function (data, textStatus, jqXHR) {
        var url = "/" + $("#hidfirmcode").val() + "/chat/TeamChat?tid=" + ChannelGuid + "&tnm=" + strteamname;
        $("#frm").attr("src", url);
        $("#modalview").show();
        ChannelList(1);
    });
}

/*Sort table details*/
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("exampleteam");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
function pad(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return "" + num;
    }
}
function formatTime(seconds) {
    return [pad(Math.floor(seconds / 3600)),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
    ].join(":");
}
function timestrToSec(timestr) {
    var parts = timestr.split(":");
    return (parts[0] * 3600) +
        (parts[1] * 60) +
        (+parts[2]);
}
//chat end
//for expense binding data 
var cexpensepageindex = 1, cexpensepagesize = 10;
function calculateColumn(index) {
    var total = 0;
    $('#cexample tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total += value;
        }
    });
    $('#totalamount').text(total);
}

/*Calculate paid column*/
function calculatePaidColumn(index) {
    var total1 = 0;
    $('#cexample tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total1 += value;
        }
    });
    $('#totalpaidamount').text(total1);
}

/*Calculate balence column*/
function calculatebalenceColumn(index) {
    var total2 = 0;
    $('#cexample tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total2 += value;
        }
    });
    $('#totalalanceamount').text(total2);
}
var uploadprogressflag = false;
/*Load expense data*/
var totalExpenseData = 1;
function LoadExpenseData(cexpensepageindex) {
    $("#padditem").html("add item");
    $("#AddExpense").html("<i class='glyphicon glyphicon-plus'></i> add item");
    $("#ddlExpenceCase").empty();
    $("#tfooter").html("");
    var html3 = ''; var tfot = ''; var tfot1 = '';
    var formdata = new FormData();
    var ddlExpenceClient = "";
    var ddlExpenceCase = token;
    var ddlExpenceClient = "";
    var datefrom = "";
    var dateto = "";
    var loginid = "";
    var client = $("#filterclientexpense").val();
    var categoryfilter = $("#ddlCategoryFilter").val();
    var currencyfilter = $("#ddlCurrencyFilter").val();
    var etypefilter = $("#ddlExpenseTypeFilter").val();
    var ExpenseStatus = $("#ddlExpenseStatusFilter").val();
    //Added as per new requirement
    var txtRetainername = $("#filterretainerName").val();
    var txtdescriptionfilter = $("#expensefilterdescription").val();
    if (client == "null" || client == null || client == "") {
        client = "";
    }
    if (etypefilter == "null" || etypefilter == null || etypefilter == "") {
        etypefilter = "";
    }
    if (categoryfilter == "null" || categoryfilter == null || categoryfilter == "") {
        categoryfilter = "";
    }
    var casename = $("#expensefiltercasename").val();
    formdata.append("pagenum", EncodeText(cexpensepageindex));
    formdata.append("pagesize", EncodeText(cexpensepagesize));
    formdata.append("ddlExpenceClient", EncodeText(ddlExpenceClient));
    formdata.append("ddlExpenceCase", EncodeText(ddlExpenceCase));
    formdata.append("datefrom", EncodeText(datefrom));
    formdata.append("dateto", EncodeText(dateto));
    formdata.append("loginid", EncodeText(loginid));
    formdata.append("client", EncodeText(client));
    formdata.append("casename", EncodeText(casename));
    formdata.append("categoryfilter", EncodeText(categoryfilter));
    formdata.append("currencyfilter", EncodeText(currencyfilter));
    formdata.append("etypefilter", EncodeText(etypefilter));
    formdata.append("ExpenseStatus", EncodeText(ExpenseStatus));
    formdata.append("txtRetainername", EncodeText(txtRetainername));
    formdata.append("txtdescriptionfilter", EncodeText(txtdescriptionfilter));
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/ViewExpenseReportForMatterdashboard",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#bindexpenseDatastatus").hide();
                $("#bindexpense").html("");
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    if (i === (length - 1)) {
                        //var pnext = cexpensepageindex;
                        //var pprev = cexpensepageindex;
                        //var pageno = cexpensepageindex;
                        //var totdata = a.totRow;
                        //var totpage = 0;
                        //if (a.totRow > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;
                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(cexpensepagesize);
                        //    if (parseInt(totdata) % parseInt(cexpensepagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#pagnumvalue").attr("max", totpage);
                        //}
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>results ' + totdata + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>pages ' + cexpensepageindex + '/' + totpage + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += '<li>'
                        //if (a.totRow <= length) { }
                        //else if (pageno == 1) { }
                        //else if (pageno == totpage) {
                        //    tfot += '<span> <a class="glyphicon glyphicon-arrow-left" id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"> ' + firstvalue + '-' + a.rownum + '</a></span>'
                        //}
                        //else {
                        //    tfot += '<span> <a class="glyphicon glyphicon-arrow-left" id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"> ' + firstvalue + '-' + a.rownum + '</a></span>'
                        //}
                        //if (pageno < totpage) {
                        //    tfot += '<a class="glyphicon glyphicon-arrow-right" id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"></a></span>'
                        //}
                        //tfot += '</li>'
                        //$("#ulfooter").html(tfot);

                        var totdata = a.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(cexpensepagesize);
                            if (parseInt(totdata) % parseInt(cexpensepagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                            if (cexpensepageindex == totpage) {
                                $('#exNext').hide();
                                $('#exPrev').css("display", "block");
                            }
                            else {
                                $('#exNext').css("display", "block");
                            }
                            if (cexpensepageindex == 1) {
                                $('#exPrev').css("display", "none");
                            }
                            else {
                                $('#exPrev').css("display", "block");
                            }

                            if (isExRenderPage == false) {
                                totalExpenseData = totpage;
                                ExpRenderPagination(cexpensepageindex, totpage);
                            }
                        }

                    }
                    var Date = a.dExpensedate;
                    var CASEName = a.Casename;
                    var CLIENTName = a.cfname;
                    var Expensetype = a.ExpenseType;
                    var Category = a.ExpenseCategory;
                    var CurrencyName = a.CurrencyName;
                    if (Category == "null" || Category == null || Category == "") {
                        CurrencyName = "";
                    }
                    if (CurrencyName == "null" || CurrencyName == null || CurrencyName == "") {
                        CurrencyName = "";
                    }
                    if (Expensetype == 0 || Expensetype == "null" || Expensetype == null) {
                        Expensetype = "";
                    }
                    var Description = a.Descriptions;
                    var Price = a.Price_Rate;
                    var Unit = a.Units;
                    var Total = a.Total;
                    var Receipt = a.UploadReceipt;
                    var expenseid = a.ExpenseId;
                    var ReceivedTotal = a.PaidAmt;
                    var FinalTotal = parseFloat(a.Total) - parseFloat(a.PaidAmt);
                    var duedate = a.duedate;
                    if (String(duedate) == "null" || String(duedate) == null || duedate == "") {
                        duedate = "";
                    }
                    else {
                        duedate = formatDatetoIST(a.duedate);
                    }
                    if (String(a.isSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    html3 += '<tr>'
                    html3 += '<td>'
                    html3 += '<input id=chkEId_' + expenseid + ' class="checkbox" type="checkbox" value="' + expenseid + '">'
                    html3 += '</td>'
                    html3 += '<td class="eDate">'
                    html3 += '<span name="Date" id="clname" >' + formatDatetoIST(Date) + '</span><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                    html3 += '</td>'
                    html3 += '<td class="eCaseName">'
                    html3 += '<span id="clname" >' + CASEName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eCategory">'
                    html3 += '<span id="clname" >' + Category + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="Retainername">'
                    html3 += '<span id="Retainername" >' + a.Retainername + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eTotalPayment">'
                    html3 += '' + a.Total + ''
                    html3 += '</td>'
                    html3 += '<td class="ePayReceived">'
                    html3 += '<span>' + a.PaidAmt + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eTotal">'
                    html3 += '' + FinalTotal + ''
                    html3 += '</td>'
                    html3 += '<td class="eDescription">'
                    html3 += '<span id="clname" >' + Description + '</span>'
                    html3 += '</td>'
                    if (a.IsExpensePaid == 1) {
                        html3 += '<td class="eexpstatus" style="text-align:center">'
                        html3 += '<span style="display:inline-block;" class="badge badge-success">' + a.ExpenseStatus + '</span>'
                        html3 += '</td>'
                    }
                    else {
                        html3 += '<td class="eexpstatus" style="text-align:center">'
                        html3 += '<span style="display:inline-block;" class="badge badge-danger">' + a.ExpenseStatus + '</span>'
                        html3 += '</td>'
                    }
                    html3 += '<td class="eClientName">'
                    html3 += '<span id="clname" >' + CLIENTName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eExpenseType">'
                    html3 += '<span id="clname" >' + Expensetype + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eCurrency">'
                    html3 += '<span id="clname" >' + CurrencyName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eDueDate">'
                    html3 += '<span>' + duedate + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="createdby">'
                    html3 += '<span id="createdby" >' + a.CreatedBy + '</span>'
                    html3 += '</td>'
                    if (a.DocsCount > 0) {
                        html3 += '<td class="eReceipt">'
                        html3 += '<button type="button" class="btn btn-sm" id-val="' + expenseid + '" id="filelinkexpense"><img src="/newassets/img/file.svg" /></button>'
                        html3 += '</td>'
                    }
                    else {
                        html3 += '<td class="eReceipt">'
                        html3 += '</td>'
                    }
                    html3 += '<td class="createdfor">'
                    html3 += '<span id="createdfor" >' + a.MemberName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="eCreatedOn">'
                    html3 += '<span name="eCreatedOn" id="CreatedOn" >' + formatDatetoIST(a.CreatedOn) + '</span><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                    html3 += '</td>'
                    html3 += '<td class="eEditedOn">'
                    html3 += '<span name="eEditedOn" id="eEditedOn" >' + formatDatetoIST(a.LastupdatedOn) + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="ReceiptDate">'
                    html3 += '<span name="ReceiptDate">' + formatDatetoIST(a.ReceiptDate) + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    if (a.oedit == 1 || roleids == 1 || isRBI) {
                        html3 += '<ul class="table_action"> <li><button class="taskoutboxbtnicon" id="EditExpenseData" token="' + expenseid + '" title="Edit Expense"> <img src="/newassets/img/edit.svg" /> </button> </li>'
                    }
                    else {
                        html3 += '&nbsp;'
                    }
                    if (a.odelete == 1 || roleids == 1 || isRBI) {
                        html3 += '<li><button class="taskoutboxbtnicon" id="RemoveData" style="color:red;cursor:pointer;" token="' + expenseid + '" title="Delete Expense"> <img style="opacity:0.7" src="/newassets/img/darkdelete.svg" /></button></li>'
                    }
                    else {
                        html3 += '&nbsp;'
                    }
                    if (a.oedit == 1 || a.create == 1 || roleids == 1 || isRBI) {
                        html3 += '<li> <button class="taskoutboxbtnicon" id="PayExpense" style="cursor:pointer;" token="' + expenseid + '" title="Pay Expense"> <img src="/newassets/img/currency-rupee.svg"></button> </li>'
                    }
                    else {
                        html3 += '&nbsp;'
                    }
                    html3 += '</ul></td>'
                    //html3 += '<td>'
                    //html3 += '<input id=chkEId_' + expenseid + ' class="checkbox" type="checkbox" value="' + expenseid + '">'
                    //html3 += '</td>'
                    html3 += '</tr>'
                });
                $("#bindexpense").html("");
                $("#bindexpense").append(html3);
                $("#expensechecked li input:checkbox:not(:checked)").each(function () {
                    var column = "#cexample ." + $(this).attr("name");
                    $(column).hide();
                });
                var clientfilterval = "";
                if ($("#filterclientexpense").val() == "null" || $("#filterclientexpense").val() == null || $("#filterclientexpense").val() == "") {
                    clientfilterval = "";
                }
                else {
                    clientfilterval = $("#filterclientexpense").val();
                }
                //calculateColumn(4);
                //calculatePaidColumn(5);
                //calculatebalenceColumn(6);
                calculateColumn(5);
                calculatePaidColumn(6);
                calculatebalenceColumn(7);
                closeload();
            }
            else {
                $('#ExpPage').hide();
                $("#bindexpenseDatastatus").show();
                //html3 = '<tr><td colspan=14 style = "text-align: center;" >No result found !</td></tr>'
                $("#totalamount").text(0);
                $("#totalpaidamount").text(0);
                $("#totalalanceamount").text(0);
                $("#bindexpense").html(html3);
                //$("#ulfooter").html("");
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
}

$(document).on("click", "#ExpColumnSelection", function () {
    $('#ExpenseCustomizedcolumn').modal('show');
});

/*Expense Pagination Start*/
var isExRenderPage = false;
var totalPageRec = "";
var totalPageExp = "";
function ExpRenderPagination(pageindex, totdata) {
    $('#ExpPage').show();
    let totPages = totdata;
    setExpPageNo = pageindex;
    totalPageExp = totdata;

    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis


    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btnexp ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btnexp ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btnexp ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }

    $("#exPageNumbers").html(paginationHtml);
    isExRenderPage = true;
}


var setExpPageNo = 1;
$(document).on("click", ".page-btnexp", function () {
    let page = $(this).data("page");
    setExpPageNo = page;
    //if (page) changePage(page);

    isExRenderPage = true;
    firstload = true;
    $("#exptxtgopage").val("");
    LoadExpenseData(setExpPageNo);
    $(".page-btnexp").removeClass("active");
    $(this).addClass("active");
});

//$("#exPrev").click(function () {
$(document).on("click", "#exPrev", function () {
    if (setExpPageNo > 1) {
        setExpPageNo = setExpPageNo - 1;
    }
    isExRenderPage = true;
    firstload = true;
    $("#exptxtgopage").val("");
    //renderPagination(setPageNo, totalPageRec)
    LoadExpenseData(setExpPageNo);

    $(".page-btnexp").removeClass("active");
    $(".page-btnexp[data-page='" + setExpPageNo + "']").addClass("active");
});

//$("#exNext").click(function () {
$(document).on("click", "#exNext", function () {
    if (setExpPageNo => 1) {
        setExpPageNo = setExpPageNo + 1;
    }
    isExRenderPage = true;
    firstload = true;
    $("#exptxtgopage").val("");
    LoadExpenseData(setExpPageNo);

    $(".page-btnexp").removeClass("active");
    $(".page-btnexp[data-page='" + setExpPageNo + "']").addClass("active");
});

//$("#expdivGo").click(function () {
$(document).on("click", "#expdivGo", function () {
    let goToPage = parseInt($("#exptxtgopage").val());
    if (!isNaN(goToPage)) {
        setExpPageNo = goToPage;
    }
    if (goToPage > totalExpenseData || goToPage == 0) {
        alert("Please enter a valid page number.");
        setExpPageNo = 1;
        return false;
    }
    firstload = true;
    isExRenderPage = true;
    LoadExpenseData(setExpPageNo);

    $(".page-btnexp").removeClass("active");
    $(".page-btnexp[data-page='" + setExpPageNo + "']").addClass("active");
});

/*Expense Pagination End*/

/*Check select all*/
$(document).on('click', '#chkSelectAll', function () {
    $("#padditem").html("add item");
    $("#AddExpense").html("<i class='glyphicon glyphicon-plus'></i> add item");
    $("#ddlExpenceCase").empty();
    $("#tfooter").html("");
    var html3 = ''; var tfot = ''; var tfot1 = '';
    var formdata = new FormData();
    var ddlExpenceClient = "";
    var ddlExpenceCase = token;
    var ddlExpenceClient = "";
    var datefrom = "";
    var dateto = "";
    var loginid = "";
    var client = $("#filterclientexpense").val();
    var categoryfilter = $("#ddlCategoryFilter").val();
    var currencyfilter = $("#ddlCurrencyFilter").val();
    var etypefilter = $("#ddlExpenseTypeFilter").val();
    var ExpenseStatus = $("#ddlExpenseStatusFilter").val();
    //Added as per new requirement
    var txtRetainername = $("#filterretainerName").val();
    var txtdescriptionfilter = $("#expensefilterdescription").val();
    if (client == "null" || client == null || client == "") {
        client = "";
    }
    if (etypefilter == "null" || etypefilter == null || etypefilter == "") {
        etypefilter = "";
    }
    if (categoryfilter == "null" || categoryfilter == null || categoryfilter == "") {
        categoryfilter = "";
    }
    var casename = $("#expensefiltercasename").val();
    formdata.append("pagenum", EncodeText(cexpensepageindex));
    formdata.append("pagesize", EncodeText(cexpensepagesize));
    formdata.append("ddlExpenceClient", EncodeText(ddlExpenceClient));
    formdata.append("ddlExpenceCase", EncodeText(ddlExpenceCase));
    formdata.append("datefrom", EncodeText(datefrom));
    formdata.append("dateto", EncodeText(dateto));
    formdata.append("loginid", EncodeText(loginid));
    formdata.append("client", EncodeText(client));
    formdata.append("casename", EncodeText(casename));
    formdata.append("categoryfilter", EncodeText(categoryfilter));
    formdata.append("currencyfilter", EncodeText(currencyfilter));
    formdata.append("etypefilter", EncodeText(etypefilter));
    formdata.append("ExpenseStatus", EncodeText(ExpenseStatus));
    formdata.append("txtRetainername", EncodeText(txtRetainername));
    formdata.append("txtdescriptionfilter", EncodeText(txtdescriptionfilter));
    // openload();
    if (this.checked == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/ViewExpenseReportForMatterdashboard",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkEId = 'chkEId_';
                $.each(response1.Data, function (i, a) {
                    var id = a.ExpenseId;
                    document.getElementById(chkEId + id).checked = true;
                });
            }
        });
    }
    if (this.checked == false) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/ViewExpenseReportForMatterdashboard",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                var chkEId = 'chkEId_';
                $.each(response1.Data, function (i, a) {
                    var id = a.ExpenseId;
                    document.getElementById(chkEId + id).checked = false;
                });
            }
        });
    }
});
$(document).on("click", "#AddExpense1", function () {
    var clientexp = $("#taskcontact").val();
    $("#ddlExpenceClient").val(clientexp);
    $("#ddlExpenceClient").prop('disabled', true);
    $("#ddlExpenceCase1").prop('disabled', true);
    GetExpenseCategory(1);
    $("#AddNewExpense").modal('show');
});
//================Start Save=================
$(document).on('keypress', '#txtTotal', function (event) {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(function () {
    $("#AddExpenseSave1").click(function () {
        uploadprogressflag = true;
        var datefrom = "";
        var dateto = "";
        var ddlClient = $("#ddlExpenceClient option").val(); //$("#ddlExpenceClient").val();
        var ddlCase = token; //$("#ddlExpenceCase1").val();
        var ddlTeamMember = $("#ddlExpenceTeamMember").val();
        var ddlExpenseType = $("#ddlExpenseType").val();
        if (ddlExpenseType == null) {
            ddlExpenseType = "";
        }
        if (ddlClient == undefined) {
            ddlClient = "";
        }
        var ddlCategory = $("#ddlCategory").val();
        var txtprice = $("#txtprice").val();
        var txtUnits = $("#txtUnits").val();
        var txtTotal = $("#txtTotal").val();
        var txtFile = "";
        var txtdate = $("#txtdate").val();
        var txtDescription = $("#txtDescription").val();
        var txtduedate = $("#txtduedate").val();
        var ddlCurrency = $("#ddlCurrency").val();
        //Added as per new requirement
        var txtReceiptDate = $("#txtReceiptDate").val();
        var txtRetainername = $("#txtretainername").val();
        if (txtdate == "") {
            alert("select date");
            $("#txtdate").focus();
            return false;
        }
        if (ddlCurrency == "") {
            alert("select Currency");
            $("#ddlCurrency").focus();
            return false;
        }
        if (ddlCategory == "") {
            alert("Please select the category of expense incurred from the given list or add your own category.");
            $("#ddlExpenseType").focus();
            return false;
        }
        if (ddlCategory == "Others") {
            alert("Please select the category of expense incurred from the given list or add your own category.");
            $("#ddlExpenseType").focus();
            return false;
        }
        if (txtTotal == "") {
            alert("Please enter the total amount of expense incurred for the mentioned category.");
            $("#txtTotal").focus();
            return false;
        }
        var randomeno = Math.floor(Math.random() * 30) + 1;
        var formData = new FormData();
        var filelenght = 0;
        var tempsize = 0;
        var totalFiles = document.getElementById("postedFile").files.length;
        filelenght = totalFiles
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("postedFile").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
                return false;
            }
            formData.append("FileUpload", file);
            try {
                if (typeof (file) != "undefined") {
                    size = parseFloat(file.size / 1024).toFixed(2);
                    tempsize = parseFloat(size);
                }
            }
            catch (err) {
                //alert(err.message);
            }
            tempsize = tempsize.toFixed(2);
            if (tempsize > filesize) {
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
        formData.append("datefrom", EncodeText(datefrom));
        formData.append("dateto", EncodeText(dateto));
        formData.append("ddlClient", EncodeText(ddlClient));
        formData.append("ddlCase", EncodeText(ddlCase));
        formData.append("ddlTeamMember", EncodeText(ddlTeamMember));
        formData.append("ddlExpenseType", EncodeText(ddlExpenseType));
        formData.append("ddlCategory", EncodeText(ddlCategory));
        formData.append("ddlCurrency", EncodeText(ddlCurrency));
        formData.append("txtprice", EncodeText(0));
        formData.append("txtUnits", EncodeText(0));
        formData.append("txtTotal", EncodeText(txtTotal));
        formData.append("txtdate", EncodeText(txtdate));
        formData.append("txtDescription", EncodeText(txtDescription));
        formData.append("expenseid", EncodeText($("#hdnExpenseid").val()));
        formData.append("txtduedate", EncodeText($("#txtduedate").val()));
        formData.append("txtReceiptDate", EncodeText(txtReceiptDate));
        formData.append("txtretainername", EncodeText(txtRetainername));
        // save lavels ajax
        formData.append("savemykasefileid", EncodeText($("#mykasefileidexpense").val()));
        openload();
        $("#AddExpenseSave1").attr("disabled", true);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (e) {
                    if (filelenght == 0) {
                        $(".progress").hide();
                        $("#progressBarstatus").hide();
                    }
                    else {
                        $(".progress").show();
                        $("#progressBarstatus").show();
                        if (e.lengthComputable) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                            $('#progressBar').attr('aria-valuenow', percent - randomeno).css('width', percent - randomeno + '%').text(percent - randomeno + '%');
                        }
                    }
                });
                return xhr;
            },
            type: "POST",
            url: "/api/ExpenseApi/AddExpenseData",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                loadteamleaderexpense();
                $("#AddExpenseSave1").removeAttr("disabled");
                $('#attachment').find("*").prop("disabled", true);
                uploadprogressflag = false;
                $(".progress").show();
                if (response1.Data.Result == "Success") {
                    var InfectFilesResult = "";
                    if (response1.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response1.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    ClearForm();
                    $("#hdnExpenseid").val("");
                    $('#progressBar').attr('aria-valuenow', 100).css('width', 100 + '%').text(100 + '%');
                    $("#dirbound").html('');
                    $("#progressBarstatus").hide();
                    $(".progress").hide();
                    new PNotify({
                        title: 'Success!',
                        text: 'Successfully saved</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    $("#postedFile").val("");
                    $("#mykasefileidexpense").val("");
                    $("#browsefileexpense").attr("title", "No file chosen");
                    $("#browsefilelblexpense").html("No file chosen");
                    $('#AddNewExpense').modal('hide');
                    LoadExpenseData(pageindex)
                }
                else if (String(response1.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    closeload();
                    return false;
                }
                else if (String(response1.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    closeload();
                    return false;
                }
                else if (response1.Data.Result == "exists") {
                    alert("Already added.");
                }
                else if (response1.Data.Result == "error") {
                    alert("Oops! Something went wrong..");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        closeload();
    });
});
//========================End===========================
function ClearForm() {
    $("#datefrom").val("");
    $("#dateto").val("");
    $("#ddlExpenceClient").val("");
    $("#ddlExpenceCase1").val("");
    $("#ddlExpenceTeamMember").find('option:first').attr("selected", "selected")
    $("#ddlExpenseType").val("");
    $("#ddlCategory").val("");
    $("#ddlCurrency").val("");
    $("#txtprice").val("");
    $("#txtUnits").val("");
    $("#txtTotal").val("");
    $("#txtdate,#txtduedate").val("");
    $("#txtDescription").val("");
    $("#txtReceiptDate").val("");
    $("#txtretainername").val("");
}

/*Edit expense*/
$(document).on("click", "#EditExpenseData", function () {
    var cvalue = $(this).attr("token");
    $("#hdnExpenseid").val(cvalue);
    $("#padditem").html("edit item");
    $("#AddExpenseSave1").html("update item");
    $("#AddExpenseSave1").attr("title", "update")
    var caseid = "";
    var formData = new FormData();
    formData.append("expenseid", cvalue);
    openload();
    loadteamleaderexpense();
    $("#AddNewExpense").modal('show');
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/ExpenseDatabyId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $.each(response1.Data, function (i, a) {
                    var dDate = a.dExpensedate;
                    var CASEName = a.mname;
                    var CLIENTName = a.cfname;
                    var Expensetype = a.ExpenseTypeId;
                    var Category = a.ExpenseCategoryId;
                    var Description = a.Descriptions;
                    var Price = a.Price_Rate;
                    var Unit = a.Units;
                    var Total = a.Total;
                    var Receipt = a.UploadReceipt;
                    var expenseid = a.ExpenseId;
                    var clientid = a.Clientid;
                    var teammember = a.Userid;
                    var currency = a.Currency;
                    caseid = a.Caseid;
                    $("#exclienthide").val(a.Clientid);
                    $('#ddlExpenceCase1').empty().append('<option value="' + a.Caseid + '">' + a.mname + '</option>').find('option:first').attr("selected", "selected");
                    var clientexp = $("#taskcontact").val();
                    $("#ddlExpenceClient").val(clientexp);
                    if (caseid == "00000000-0000-0000-0000-000000000000") {
                    }
                    else {
                        $("#ddlExpenceCase1").change();
                    }
                    $("#ddlExpenseType").val(Expensetype);
                    $("#ddlCategory").val(Category);
                    $("#ddlCurrency").val(currency);
                    $("#txtprice").val(Price);
                    $("#txtUnits").val(Unit);
                    $("#txtTotal").val(Total);
                    $("#ddlExpenceCase1").val(a.mname);
                    $("#txtDescription").val(Description);
                    setTimeout(function () {
                        closeload();
                        $("#ddlExpenceTeamMember").val(a.TeamMember);
                    }, 2000);
                    var txtFile = "";
                    try {
                        var edate = dDate.split('T')[0];
                        $("#txtdate").val(edate);
                    }
                    catch (er) {
                    }
                    try {
                        if (a.duedate != null && a.duedate != "1900-01-01T00:00:00") {
                            var etxtduedate = a.duedate.split('T')[0];
                            $("#txtduedate").val(etxtduedate);
                        }
                    }
                    catch (er) {
                    }
                });
                $("#AddExpenseSave1").attr("title", "save")
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
$(document).on("click", "#RemoveData", function () {
    if (confirm("Are you sure you want to delete the expense record?")) {
        var cvalue = $(this).attr("token");
        RemoveSelectedData(cvalue);
    }
});

/*Remove selected data*/
function RemoveSelectedData(val) {
    var formData = new FormData();
    formData.append("expenseid", val);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/RemovExpenseData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "Success") {
                alert("Successfully deleted");
                LoadExpenseData(pageindex);
            }
            else if (response1.Data == "error") {
                alert("Oops! Something went wrong..");
            }
        }
    });
}

/*Load team lead expense*/
function loadteamleaderexpense() {
    $("#ddlExpenceTeamMember").html("");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/Assignuserteamlead",
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
            $("#ddlExpenceTeamMember").append('<option value="" >Select</option >');
            $.each(obj, function (i, a) {
                if (a.roleid == 1) {
                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                    $("#ddlExpenceTeamMember").append(option);
                }
                else {
                    if (a.IsPartner == 1) {
                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                        $("#ddlExpenceTeamMember").append(option);
                    }
                    else {
                        if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                            $("#ddlExpenceTeamMember").append(option);
                        }
                        else {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                            $("#ddlExpenceTeamMember").append(option);
                        }
                    }
                }
            });
            $("#member").html("");
            $("#member").append(html3);
            $("#member").css("height", "100px !Important");
            return false;
            //End of foreach Loop
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

/*Change expense status*/
$(document).on('click', '#ChangeExepnseStatus', function () {
    selectedIDSync = [];
    var result = confirm("Are you sure to change expense status?");
    if (result) {
        $('#bindexpense input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                selectedIDSync.push($(this).val());
            }
        });
        if (JSON.stringify(selectedIDSync) != "[]") {
            var formdata = new FormData();
            formdata.append("token", selectedIDSync);
            openloader();
            $.ajax({
                async: true,
                url: '/api/ExpenseApi/SaveExpenseStatus',
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
                            text: ' expense status changed saved successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#select_all').prop('checked', false);
                        LoadExpenseData(cexpensepageindex);
                        closeloader();
                    }
                    else {
                        closeloader();
                    }
                },
                error: function () {
                    closeloader();
                }
            });
        }
        else {
            new PNotify({
                title: 'Warning',
                text: 'You have not selected any row.',
                type: 'error',
                delay: 3000
            });
            closeloader();
        }
    }
});
$(document).on('click', '#PayExpense', function () {
    var fcode = localStorage.getItem("FirmCode");
    openloader();
    var token = $(this).attr("token");
    var url = "/" + fcode + "/Expense/PaymentExpense?token=" + token;
    $('.mymodelspay').load(url, function (result) {
        closeloader();
        $("#myModalpaymentExpense").modal({ show: true });
    });
});

/*Get expense category*/
function GetExpenseCategory() {
    var groupval = "";
    var html3 = '';
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/BindExpenseCategory",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#ddlCategoryFilter").html("");
                $("#ddlCategory").html("No Category !");
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var IId = a.iid;
                var ExpenseCategory = a.ExpenseCategory;
                html3 += '<option value="' + IId + '">' + ExpenseCategory + '</option>';
            });
            var html32 = '<option value="" selected>Category</option>';
            $("#ddlCategoryFilter").html("");
            $("#ddlCategory").html("");
            $("#ddlCategoryFilter").append(html32).append(html3);
            $("#ddlCategory").append(html32).append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Load ddl category filter*/
$(document).on('change', '#ddlCategoryFilter', function () {
    isExRenderPage = false;
    LoadExpenseData(1);
});
$(document).on('change', '#ddlExpenseTypeFilter', function () {
    LoadExpenseData(1);
});
$(document).on('change', '#ddlCurrencyFilter', function () {
    LoadExpenseData(1);
});
$(document).on("click", "#searretainerName", function () {
    var casefiltercasename = $("#filterretainerName").val();
    if (casefiltercasename == "") {
        alert("Please enter the retainer name.");
        $("#filterretainerName").focus();
        return false;
    }
    $("#clearretainerName").css("display", "unset");
    isExRenderPage = false;
    LoadExpenseData(1);
});
$(document).on("click", "#clearretainerName", function () {
    $("#filterretainerName").val("");
    $("#clearretainerName").css("display", "none");
    isRenderPage = false;
    LoadExpenseData(1);
});
$(document).on("click", "#searchdescription", function () {
    var casefiltercasename = $("#expensefilterdescription").val();
    if (casefiltercasename == "") {
        alert("Please enter the description.");
        $("#expensefilterdescription").focus();
        return false;
    }
    $("#clearnewsearchdescription").css("display", "unset");
    isExRenderPage = false;
    LoadExpenseData(1);
});
$(document).on("click", "#clearnewsearchdescription", function () {
    $("#expensefilterdescription").val("");
    $("#clearnewsearchdescription").css("display", "none");
    isExRenderPage = false;
    LoadExpenseData(1);
});

/*DDL expense status filter*/
$(document).on('change', '#ddlExpenseStatusFilter', function () {
    isRenderPage = false;
    LoadExpenseData(1);
});
$(document).on("click", "#filelinkexpense", function () {
    openload();
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=Expense&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
    });
});

/*Get expense type*/
function GetExpenseType() {
    var groupval = "";
    var html3 = '';
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ExpenseApi/BindExpenseType",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#ddlExpenseType").html("");
            }
            else {
                $("#ddlExpenseType").html("No Expense Type !");
            }
            //var obj = JSON.parse(response1.Data);
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                var IId = a.IId;
                var ExpenseType = a.ExpenseType;
                html3 += '<option value="' + IId + '">' + ExpenseType + '</option>';
            });
            html31 = '<option value="">Select</option>';
            html32 = '<option value="">Expense Type</option>';
            $("#ddlExpenseType,#ddlExpenseTypeFilter").html("");
            $("#ddlExpenseType").append(html31).append(html3);
            $("#ddlExpenseTypeFilter").append(html32).append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

//bind new matter for communication/time entry
function loadmatter_new(clientid, mtypes, companyids = null) {
    if (mtypes != "") {
        $(mtypes).append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        getcasebyajaxnew(clientid, mtypes, companyids);
    }
}

/*Load matter for client*/
function getcasebyajaxnew(clientid, matteridslbl, companyids = null) {
    try {
        openload();
    }
    catch
    {
    }
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/callApi/LoadMatterforclient",
        headers: {
            "clientid": clientid,
            "companyids": companyids
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
            }
            else {
                //alert("not found");
            }
            var obj = JSON.parse(response.Data);
            $.each(obj, function (i, a) {
                var mattername = a.mname;
                var mid = a.Id;
                if (mattername == null) {
                    mattername = "";
                    mid = "";
                }
                else {
                    var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                    $(matteridslbl).append(option);
                }
            });
            try {
                closeload();
            }
            catch
            {
            }
        },
        failure: function (response) {
            alert(data.responseText);
            try {
                closeload();
            }
            catch
            {
            }
        },
        error: function (response) {
            try {
                closeload();
            }
            catch
            {
            }
        }
    });
}

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
$(document).on('click', '#showtabledeatils', function () {
    $("#alersettigspopup").hide();
    $("#Alertdetailslist").show();

});
$(document).on('click', '#gopreviuspage', function () {

    $("#alersettigspopup").show();
    $("#Alertdetailslist").hide();

});


function OpenAttachFile() {
    $("#modalShowDocumentFileDocument").modal('hide');
    openload();
    var fileid = fileTokenId;
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=task&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
    });
}

function FinalAttachFile() {
    openload();
    $("#modalShowDocumentFileDocument").modal('hide');

    var fileid = fileTokenId;
    var mode = "view";
    var url = "/firm/multiplefilelist/?ftype=completetask&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        closeload();
        $('#myModal').modal({ show: true });
    });
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
//End Section
// Helper functions
function buildRow(label, value) {
    return `
            <div class="col-md-6">
                <div><strong>${label}</strong></div>
                <p>${value == null ? "" : value}</p>
            </div>
        `;
}

function formatCaseNo(vCaseNo, vCaseYear, cRefNo, slash, Court) {
    // If Rajasthan, do not add slash
    if (Court === "Rajasthan") {
        if (!cRefNo || cRefNo === "null") {
            return `${vCaseNo}`;
        }
        return `${vCaseNo}${vCaseYear} (${cRefNo})`;
    }

    // For other courts, keep slash logic
    if (!cRefNo || cRefNo === "null") {
        return `${vCaseNo}${slash}${vCaseYear}`;
    }
    return `${vCaseNo}${slash}${vCaseYear} (${cRefNo})`;
}


function GetOtherPartyDetails() {

    var caseid = $("#hdnusercaseid").val();

    if (!caseid) {
        console.warn("CaseId not found");
        return;
    }

    let formData = new FormData();
    formData.append("caseid", caseid);

    openload();

    $.ajax({
        async: true,
        type: "POST",
        url: "/firm/OtherPartyDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            closeload();

            if (response && response.success && response.data) {

                const data = response.data;
                $("#applicantContainer").html(data.applicant || "N/A");
                if (data.respondent) {

                    let items = data.respondent.split(/\d+\.\s+/).filter(x => x.trim() !== "");

                    let html = "<ol style='padding-left:20px;'>";

                    items.forEach(item => {
                        html += `<li style="margin-bottom:5px;">${item.trim()}</li>`;
                    });

                    html += "</ol>";

                    $("#respondentContainer").html(html);

                } else {
                    $("#respondentContainer").html("N/A");
                }
                $("#myModalOtherPartyDetails").modal("show");

            } else {
                $("#OtherDetailsDataNotFound").show();
            }
        }

    });
}
