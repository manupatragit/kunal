var courtName = "TELANGANA HIGH COURT";
var janpadName = "";
var tahsilName = "";
var caseNo = "";
var vJudCourt = "";
$(document).ready(function () {
    IsReraCourt = "";
    jQuery('#teammemberss').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        setTimeout(function () {
            $('#myOverlay').css("display", "none");
        }, 200);
    }
    clearForm();
    /*Reset form*/
    function clearForm() {
        $('#savecasealert')[0].reset();
    }
    
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
                    courtName = a.Court.toUpperCase();
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


    /*Open Supreme Court Notes And Others*/
    $(document).on("click", "#opendetails", function () {
        var type = $(this).attr("type");
        var vNGTIAMA = "";
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
                    /*$('#ScourtDetailsLabel').html("Other Details");*/
                    $('#ScourtDetailsLabel').html("Court Details");
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

    CaseDataCaseWatch();
    /*Get case watch details*/
    function CaseDataCaseWatch() {
        var Isrearacourt = ISReraCourt;
        var formData = new FormData();
        formData.append("token", id);
        formData.append("IsRevenueCourt", EncodeText(IsRevenueCourt));
        formData.append("IsReraCourts", EncodeText(Isrearacourt));
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

                if (response.Result == "" || String(response.Result) == "undefined") {
                    //$("#datastatus").html("Case details will be available after some time.");
                    $("#cdhearingstatus").show();
                    $("#ordercauselist").hide();
                    closeload();
                    return false;
                }
                else {

                    var obj = JSON.stringify(response.Result);
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
                                html += '<span><a style="color:black" id="opendetails" type="OtherDetails" caseid="' + id + '" href="javascript:void()" title="Other Details">Court Details</a></span>';
                            }
                            if (a.Earlier_Court_Details == "1") {
                                html += '<span>&nbsp;|&nbsp;<a style="color:black" id="opendetails" type="earliercourt" caseid="' + id + '" href="javascript:void()" title="Earlier Court Details">Earlier Court Details</a></span>';
                            }
                            if (a.Notices == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="notices" caseid="' + id + '" href="javascript:void()" title="Notices" >Notices</a></span>';
                            }
                            if (a.Office_Reports == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="officereports" caseid="' + id + '" href="javascript:void()" title="Office Reports" >Office Reports</a></span>';
                            }
                            if (a.Caveat == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="caveat" caseid="' + id + '" href="javascript:void()" title="Caveat" >Caveat</a></span>';
                            }
                            //For FIR Deatils Count
                            if (a.FIRDetailsCount >= "1") {
                                html += '<span>&nbsp;|&nbsp;<a  id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()">FIR Details</a></span>&nbsp;|&nbsp;';
                            }
                            //For Linked Case Deatils
                            if (a.LinkedCasesCount >= "1" && a.Court.toUpperCase() != "TELANGANA HIGH COURT") {
                                html += '<span>&nbsp;|&nbsp;<a  id="openlinkeddetails" type="LinkedCases" title="Linked Cases" caseid="' + a.Id + '" href="javascript:void()"  title="Linked Cases" >Linked Cases</a></span>&nbsp;|&nbsp;';
                            }
                            //For Sub Courts Deatils
                            if (a.SubMattersCount >= "1") {
                                html += '<span>&nbsp;|&nbsp;<a  id="opensubmatterdetails"  title="Sub-Matters" caseid="' + a.Id + '" href="javascript:void()">Sub-Matters</a></span>&nbsp;|&nbsp;';
                            }
                            //For Tag Matter 
                            if (a.TagMatters == "1") {
                                html += '<span>&nbsp;|&nbsp;<a  style="color:black" id="opendetails" type="tagmatter" caseid="' + id + '" href="javascript:void()" title="Tag Matters" >Tag Matters</a></span>&nbsp;|&nbsp;';
                            }
                            //For SEBI Custmization
                            if (Sebiids == "display:unset") {
                                html += '<span>&nbsp;|&nbsp;<span style="cursor:pointer;"   caseid="' + a.Id + '" id="openallpartyname">All Party Name</span></span>';
                            }
                            //FOR NGT Earlier Court Deatils
                            if (a.Court == "NATIONAL GREEN TRIBUNAL") {
                                html += '<span><a style="color:black" id="opendetails" type="IAMA" caseid="' + id + '" href="javascript:void()" title="IA/MA Details">IA/MA Details</a></span>';
                            }
                            //FOR TL High Court Deatils
                            if (a.Court.toUpperCase() == "TELANGANA HIGH COURT") {
                                html += '<span><a style="color:black" id="opendetails" type="IAMA" caseid="' + id + '" href="javascript:void()" title="IA Details"> IA Details</a></span>';
                            }
                            html += `<span><a style="color:black" onclick="GetOtherPartyDetails('${a.Id}')" href="javascript:void(0)" title="OtherPartyDetails"> Other Party Details</a></span>`;
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
                        }); //End of foreach Loop
                        $("#binddatacw").empty().append(html);
                        closeload();
                    }
                    else if (response.type == "REVENUE") {
                        let manual = response.Result[0].Manualnexthearing;
                        //let next = response.Result[0].Next_Hearing;
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
                            html += buildRowLst("Case Number", formatCaseNoLst(a.vCaseNo, a.vCaseYear, a.cRefNo, slash, a.Court));
                            html += buildRowLst("Court", "Revenue(" + a.Court + ")");
                            html += '</div>';
                            html += '<div class="row">';
                            html += buildRowLst("District Name", a.JanpadName);
                            html += buildRowLst("Court Type", a.TahsilName);
                            html += '</div>';
                            html += '<div class="row">';
                            html += buildRowLst("Court Name", a.RevenueCourtName);
                            html += buildRowLst("Manual Case Number", a.ManualCaseNumber);
                            html += '</div>';
                            html += '<div class="row">';
                            html += buildRowLst("Next Hearing", nextHearingNew);
                            html += buildRowLst("Status", a.Status);
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
                            //html += '<div class="row">';
                            //html += '<div class="col-md-12">';
                            //html += '<div><strong>Party Name</strong></div><p>'  + (a.CaseName == null ? "" : a.CaseName) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //if (a.cRefNo == null || a.cRefNo == "null" || a.cRefNo == "") {
                            //    html += '<div><strong>case no</strong></div><p>' + a.vCaseNo + slash + a.vCaseYear + '</p>';
                            //}
                            //else {
                            //    html += '<div><strong>case no</strong></div><p>' + a.vCaseNo + slash + a.vCaseYear + ' (' + a.cRefNo + ')</p>';
                            //}
                            //html += '</div>';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Court</strong></div><p>' + (a.Court == null ? "" : a.Court) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Mandal Name</strong></div><p>' + (a.MandalName == null ? "" : a.MandalName) + '</p>';
                            //html += '</div>';

                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Janpad Name</strong></div><p>' + (a.JanpadName == null ? "" : a.JanpadName) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Tahsil Name</strong></div><p>' + (a.TahsilName == null ? "" : a.TahsilName) + '</p>';
                            //html += '</div>';

                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Revenue Court</strong></div><p>' + (a.RevenueCourtName == null ? "" : a.RevenueCourtName) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Admission date</strong></div><p>' + (a.AdmissionDate == null ? "" : a.AdmissionDate) + '</p>';
                            //html += '</div>';

                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Next Hearing</strong></div><p>' + (a.NextHearing == null ? "" : a.NextHearing) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Dispose date</strong></div><p>' + (a.DisposedDate == null ? "" : a.DisposedDate) + '</p>';
                            //html += '</div>';

                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Status</strong></div><p>' + (a.Status == null ? "" : a.Status) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Nature</strong></div><p>' + (a.Nature == null ? "" : a.Nature) + '</p>';
                            //html += '</div>';

                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Act</strong></div><p>' + (a.Act == null ? "" : a.Act) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                            //html += '<div class="row">';
                            //html += '<div class="col-md-6">';
                            //html += '<div><strong>Computer case no</strong></div><p>' + (a.ComputerCaseno == null ? "" : a.ComputerCaseno) + '</p>';
                            //html += '</div>';
                            //html += '</div>';

                        }); //End of foreach Loop
                        $("#binddatacw").empty().append(html);
                        closeload();
                    }
                    else if (response.type == "RERA") {
                        $(".Alerts,.mnh").hide();
                        $.each(response.Result, function (i, a) {
                            if (a?.Status && a.Status.toLowerCase().includes('disposed')) {
                                a.Next_Hearing = '';
                            }
                                let manual = a.ManualNextHearing ;
                                let next = a.NextHearing;
                            if ((!manual || manual.trim() === "") && (!next || next.trim() === "")) {
                                $('#setalerts').hide();
                            } else {
                                $('#setalerts').show();
                            }
                            q = q + 1;
                            $("#casenametxtval").val(a.vCaseNo);
                            $("#courttextval").val(a.Court);
                            $("#casenotxtval").val(a.CaseName);
                            $("#nhdateval").val(a.NextHearing);
                            $("#mnhdateval").val(a.ManualNextHearing);
                   
                            //For CauseList/Order Popup
                            //$("#UserCaseIdsId").val(a.Id);
                            //$("#MasterCaseIdsIds").val(a.CaseId);
                            //$("#UserCaseIdsId").val(a.CaseId);
                            //$("#MasterCaseIdsIds").val(a.UserCaseId);

                            $("#UserCaseIdsId").val(a.CaseId);
                            $("#MasterCaseIdsIds").val(a.UserCaseId);

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
                            $("#CourtTypecauselist").val(a.CourtType);
                            //For CauseList/Order Popup
                            $("#UserCaseIdsId").val(a.Id);
                            $("#MasterCaseIdsIds").val(a.CaseId);
                            var whtsdata = "";
                            localStorage.setItem('emailcasedno', a.Case_Diary);
                            localStorage.setItem('emailcourt', a.Court);
                            localStorage.setItem('emailcasename', a.Case_Name);
                            localStorage.setItem('emailadv', a.Advocate);
                            localStorage.setItem('emaildspdate', a.Disposed_Date);
                            localStorage.setItem('emailstatus', a.Status);
                            if (a.CNRNO == null) {
                                a.CNRNO = "";
                            }
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
                                //html += '<div><strong>Manual Next Hearing</strong></div><p>' + a.Manualnexthearing + '</p>';
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
                            //FOR NGT Earlier Court Deatils
                            //if (a.Court == "NATIONAL GREEN TRIBUNAL") {
                            //    html += '<span><a style="color:black" id="opendetails" type="IAMA" caseid="' + id + '" href="javascript:void()" title="IA/MA Details"><i class="fa fa-university" aria-hidden="true"></i></a></span>';
                            //}
                            html += `<span><a style="color:black" onclick="GetOtherPartyDetails('${a.Id}')" href="javascript:void(0)" title="OtherPartyDetails"> | Other Party Details</a></span>`;
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                        }); //End of foreach Loop
                        $("#binddatacw").append(html);
                        closeload();
                    }
                }
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
    $("#savealerts").click(function () {
        if ($('input[name="hearingdates"]').is(':checked')) {
            //alert("Checked");
        } else {
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
                    alert("Please select Next Hearing date");
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
                //alert("Please select Next Hearing date");
                showSelectNextHearingDateModal("Alert", "Please select Next Hearing date.");
                return false;
            }
            else {
                hdate = nhdate;
            }
        } else if (hearingtype == "manualhdate") {
            if (mhdate == "") {
                //alert("Please select Next Hearing date");
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
        //var caldate = $("#callfromdate").val();
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
        if (courtName == 'Rajasthan') {
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
                    alert("Alert saved successfully")
                    clearForm();
                    loadsavealerts();
                    closeload();
                }
            }
        });
    });
    $(document).on("click", "#caseorder", function () {
        openload();
        // var ids = $(this).attr("id-val");
        // var caseids = $(this).attr("case-val");
        var ids = $("#UserCaseIdsId").val();
        var caseids = $("#MasterCaseIdsIds").val();
        if (IsRevenueCourt == "1") {
            $("#modalwidth").css("width", "80%");
        }
        else {
            $("#modalwidth").css("width", "65%");
        }
        var url = "/firm/CaseOrders?status=true&id=" + caseids + "&caseid=" + ids + "&IsRevenueCourt=" + IsRevenueCourt + "&IsReraCourt=" + ISReraCourt;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
            closeload();
        });
    });
    $(document).on("click", "#openmanualnh", function () {
        $("#nhhide").val($(this).attr("nhdate"));
        $("#caseidhide").val($(this).attr("caseid"));
        $('#myModalmanualhearing').modal({ show: true });
    });
    $("#setmanualnh").click(function () {
        var mnhdate = $("#manualnhdate").val();
        if (mnhdate == "") {
            alert("Select manual hearing date");
            $("#manualnhdate").focus();
            return false;
        }
        if(courtName == 'Rajasthan') {
            ISReraCourt = "RERH";
        }
       // var date = $("#manualnhdate").datepicker({ dateFormat: 'mm-dd-yyyy' });
        var formData = new FormData();
        formData.append("userCaseId", id);
        formData.append("caseid", $("#caseidhide").val());
        formData.append("oldnhdate", $("#nhhide").val());
        formData.append("nhdate", mnhdate);
        formData.append("IsReracourt", ISReraCourt);
        var formDataPayload = {
            userCaseId: id,
            caseid: $("#caseidhide").val(),
            oldnhdate: $("#nhhide").val(),
            nhdate: $("#manualnhdate").val(),
            IsReracourt: ISReraCourt
        };
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
                    saveManualNextHearingDate(formDataPayload);
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
    $(document).on("click", "#getcauselistdata", function () {
        openload();
        var ids1 = $("#UserCaseIdsId").val();
        //var courtType = $(this).attr("data-courttypeId");
        var courtType = $("#CourtTypecauselist").val();
        //var ids1 = $(this).attr("val-data");
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
            url = "/firm/CaseCauseList?status=true&id=" + ids1 + "&isRera=" + ISReraCourt + "&courtTypeId=" + courtType;
        }
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
        closeload();
    });
    /*Remove case alert details*/
    $(document).on("click", "#removecasealert", function () {
        var formData = new FormData();
        var IsReras = ISReraCourt;
        var rera = "";
        if (IsReras == 1) {
            rera="Rera";
        }
        if (courtName == 'Rajasthan') {
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
    /*Load save alert details*/
    function loadsavealerts() {
        $("#assignusercasedata").html("");
        var html = '';
        var formData = new FormData();
        var caseid = $("#textleadid").text();
        var IsReras = $("#Isreras").val();
        if (courtName == 'Rajasthan') {
            IsReraCourt = "RERH";
        }
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
                    if (String(a.Manualnexthearing) == null || String(a.Manualnexthearing) == "null" || String(a.Manualnexthearing) == "") {
                        Manualnexthearing = "";
                    }
                    else {
                        Manualnexthearing = a.Manualnexthearing;
                    }
                    html += '<tr><td> ' + a.masterappealno + '</td><td>' + a.vCaseName + ' <td> ' + a.Courtname + '</td><td>' + a.vnexthearing + '</td><td> ' + formatDatetoIST(Manualnexthearing) + '</td>';
                    html += '<td>' + a.Mobile + '</td><td> ' + a.Email + '</td><td>' + a.createdOn + '<td>' + a.alertdate + '</td><td>' + a.isSent + '</td><td>' + a.AlertFor + '</td><td><a title="Remove this Alert" href="#"  id="removecasealert" data-val=' + a.ID + '><i class="fa fa-trash-o" aria-hidden="true" style="color:red;"></i></a></td></tr>';
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
    //        $("#clientname").val("");
    //        $("#clientmobile").val("");
    //        $("#cientemail").val("");
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
            $("#clientFieldContainer").hide();
            $("#clientnamediv").hide();
            $("#cientemail").val("");
            $("#clientmobile").val("");
            $("#clientname").val("");
            $("#alertmobpanel1").hide();
        }
    });

    $('input[type=radio][name=hearingdateradio]').change(function () {
        $("#savealerts").attr("date-val", $(this).val().trim());
    });
    $(document).on("click", "#setalerts", function () {
        $("#alersettigspopup").show();
        $("#Alertdetailslist").hide();
        $("#alertmobpanel1").css("display", "none");
        $("#alertmobpanel1").css("display", "none");
        //  var lids = $(this).attr("val-data");
        var lids = $("#UserCaseIdsId").val();
        var IsReracheck = $(this).attr("sno");
        var casenametxt = $("#casenametxtval").val();
        var courttext = $("#courttextval").val();
        var casenotxt = $("#casenotxtval").val();
        let singleLineText = casenotxt.replace(/<br\s*\/?>/gi, ' ');
        var nhdate = $("#nhdateval").val();
        var mnhdate = $("#mnhdateval").val();
        if (String(nhdate) == "undefined" || nhdate == null || nhdate == "") {
            nhdate = "";           

        }

        if (String(mnhdate) == "undefined" || mnhdate == null || mnhdate == "") {
            mnhdate = "";
        }

        $("#textleadid").html(lids);
        $("#casenotext").html(singleLineText);
        $("#casenametext").html(casenametxt);
        $("#courttext").html(courttext);
        $("#Isreras").val(IsReracheck);
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

        var selectedRdVal = $('input[name="Alerttypes"]:checked').val();
        if (selectedRdVal == 'hearigbasis') {
            $("#divfrequency").show();
            $("#hearingdates").show();
            $("#divalertdeatils").hide();
        }

        $("#alertmobpanel").css("display", "none");
        $("#alertemailpanel").css("display", "none");
        loadsavealerts();
        $('#myModalcasealerts').modal({ show: true });
        clearForm();
    });
    $(document).on("click", "#savecasefile", function () {
        var lidsid = $("#textleadid").text();
        var formData = new FormData();
        formData.append("lidsid", lidsid);
        var tempsize = 0;
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles < 1) {
            alert("Please select file");
            return false;
        }
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachment").files[i];
            var filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            formData.append("FileUpload", file);
            try {
                if (typeof (file) != "undefined") {
                    size = parseFloat(file.size / 1024).toFixed(2);
                    tempsize = parseFloat(tempsize) + parseFloat(size);
                }
            }
            catch (err) {
                //alert(err.message);
            }
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
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/PostSaveCaseFiles", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                var datas = JSON.stringify(data);
                loadcasefiles();
                $("#saveleadcallform")[0].reset();
                new PNotify({
                    title: 'Success!',
                    text: 'File Saved Successfully',
                    type: 'success',
                    delay: 3000
                });
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
    $(document).on("click", "#addcasefile", function () {
        openload();
        var lids = $(this).attr("val-data");
        $("#textleadid").text(lids);
        loadcasefiles();
        $('#myModalcasefile').modal({ show: true });
        closeload();
    });
    function loadcasefiles() {
        $("#assignuserdata").html("");
        var html = '';
        var leadid = $("#textleadid").text();
        var formData = new FormData();
        formData.append("caseid", leadid);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/Loadcasefiles",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    //  alert(a.Filename);
                    var ftoken = "/DownloadFile.ashx?module=module&ftoken=" + enctypesingle(a.Filename);
                    html += '<tr><td>' + qty1 + '</td><td><a name="' + ftoken + '" href="' + ftoken + '" download="' + correctfilenamecasefile(a.Filename) + '" title="Download File">' + correctfilenamecasefile(a.Filename) + '</a></td><td>' + formatDatetoIST(a.date_time) + " " + String(a.date_time).substring(11, 19) + '</td><td>' + a.UserName + '</td></tr>';
                });
                $("#assignuserdata").append(html);
                if (qty1 == 0) {
                    $(".stsdata").css("display", "block");
                }
                else {
                    $(".stsdata").css("display", "none");
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
    function correctfilenamecasefile(strdatas) {
        var strdata = "";
        if (strdatas != null) {
            strdata = String(strdatas).substring(String(strdatas).lastIndexOf("/") + 1);
            return strdata;
        }
        else {
            return strdatas;
        }
    }

    //For Sebi Full CauseList
    $(document).on("click", "#openallpartyname", function () {
        var Caseids = $(this).attr("caseid");
        loadAllPartyname(Caseids);
        $('#myModalAllPartyName').modal({ show: true });
        clearForm();
    });

    //Load All Party Name
    function loadAllPartyname(Caseids) {
        $("#Allpartynamecasedata").html("");
        var html = '';
        var formData = new FormData();
        formData.append("caseid", Caseids);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/LoadAllPartyName",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1 == "") {
                    $(".Allnofoundst").css("display", "block");
                }
                else {
                    $(".Allnofoundst").css("display", "none");
                }
                html += '<tr>';
                html += '<td> ' + response1.data[0].vCaseName + '</td>';
                html += '<td> ' + response1.data[0].applicant + '</td>';
                html += '<td> ' + response1.data[0].respondent + '</td>';
                html += '</tr>';
                $("#Allpartynamecasedata").append(html);
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
    //For Add Main Case to Live Update
    $(document).on("click", "#addidss", function () {
        var MasterCaseId = $("#linkmastercaseids").val();
        var LinkedCaseNo = $("#maincasenumber").val();
        var casetype = "mainmatter"
        GetContemptCaseDetailsForModal(MasterCaseId, LinkedCaseNo, casetype);
        addteammember();
    });

    //For Linked Matter Add Case To Live Track.
    $(document).on("click", "#AddLinkedCaseToTrack", function () {
        var MasterCaseId = $(this).attr("data-val");
        var LinkedCaseNo = $(this).attr("Idss");
        var casetype = $(this).attr("ctype");
        GetContemptCaseDetailsForModal(MasterCaseId, LinkedCaseNo, casetype);
        addteammember();
    });
    //For Get Contempt Case Details 
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

    //Transfer Main  Case Deatils 
    $(document).on("click", "#viewidss", function () {
        var mainusercaseids = $("#linkedcaseusercaseids").val();
        //var transferid = $(this).attr("Idss");
        var IsRevenueCourt = "0";
        var IsReraCourt = "0";
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": mainusercaseids, "IsRevenueCourt": IsRevenueCourt, "IsRera": IsReraCourt }
        });
    });
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
});

//Function to save manual hearing date 
function saveManualNextHearingDate(payload) {
    var formData = new FormData();
    formData.append("userCaseId", payload.userCaseId);
    formData.append("nhdate", payload.nhdate);

    $.ajax({
        async: true,
        type: "POST",
        url: "/firm/SaveManualNextHearingDateNew",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log("SaveManualNextHearingDateNew success:", data);
        },
        failure: function (data) {
            console.error("Failure:", data.responseText);
        },
        error: function (data) {
            console.error("Error:", data.responseText);
        }
    });
}


function showSelectNextHearingDateModal(title, message) {
    $("#alertTitle").text(title || "Alert");
    $("#alertMessage").text(message || "");

    $("#SelectNextHearingDateModal").modal("show");
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
// Helper functions
function buildRowLst(label, value) {
    return `
            <div class="col-md-6">
                <div><strong>${label}</strong></div>
                <p>${value == null ? "" : value}</p>
            </div>
        `;
}

function formatCaseNoLst(vCaseNo, vCaseYear, cRefNo, slash, Court) {
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
function GetOtherPartyDetails(id) {


    if (!id) {
        console.warn("CaseId not found");
        return;
    }

    let formData = new FormData();
    formData.append("caseid", id);

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
