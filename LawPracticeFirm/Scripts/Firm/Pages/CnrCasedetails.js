$(document).ready(function () {

    jQuery('#teammemberss').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(document).on("click", "#openmanualnhcnr", function () {
        $("#nhhide").val($(this).attr("nhdatecnr"));
        $("#caseidhide").val($(this).attr("caseid"));
        $("#usercaseidhide").val($(this).attr("usercaseid"));
        $('#myModalmanualhearingcnr').modal({ show: true });
    });
    /*Set manual CNR number*/
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
    CaseDataCaseWatch();
    /*Get CNR casewatch data*/
    function CaseDataCaseWatch() {
        var formData = new FormData();
        formData.append("token", id);
        formData.append("cnr", cnr);
        //read assign using list
        qty1 = 0;
        var html = '';
        openload();
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/firm/CNRCaseDataCaseWatch",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "") {
                    $("#datastatus").html("Case details will be available after some time.");
                    closeload();
                    return false;
                }
                else {
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        $("#casenametxtval").val(a.Case_Diary);
                        $("#courttextval").val(a.Court);
                        $("#casenotxtval").val(a.Case_Name);
                        $("#nhdateval").val(a.Next_Hearing);
                        $("#mnhdateval").val(a.Manualnexthearing);
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
                        q = q + 1;
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
                        html += '<tr>';
                        html += '<td width="22%"><div><b>matter / diary no:</b></div></td>';
                        html += '<td  title="open orders"  id-val="' + a.CaseId + '" case-val="' + a.Id + '" id = "caseorder" style="cursor:pointer;color:cornflowerblue;" class= "case" >' + a.Case_Diary + ' <a id="socialnetwork" title="share to whatsapp" href="whatsapp://send?text=' + whtsdata + '" data-action="share/whatsapp/share"  class="fa fa-whatsapp socialnetwork socialwhats" ></a></td>';
                        html += '<td width="10%"><div><b>Cause List:</b></div></td>';
                        html += '<td width="5%" class="causelist" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" data-courttypeId="' + a.CourtType + '"  id="getcauselistdata"  ><span class="glyphicon glyphicon-list-alt"></span></center></td>';
                        html += '<td width="30% "></td>';
                        html += '</tr>';
                        html += '<tr>';
                        if (a.District != "") {
                            html += '<td><div><b>State:</b></div></td>';
                        }
                        else {
                            html += '<td><div><b>Court:</b></div></td>';
                        }
                        html += '<td>' + a.Court + '</td>';
                        html += '<td><div><b>Set Alerts:</b></div></td>';
                        if (roleids == "1" || roleids == "2") {
                            if (a.Next_Hearing != "") {
                                html += '<td class="nh" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            }
                            else if (a.Manualnexthearing != "") {
                                html += '<td class="mnh" mnhvalue="' + a.Manualnexthearing + '" ><center><span style="color:black;cursor:pointer;"  val-data="' + a.Id + '" id="setalerts" ><span class="glyphicon glyphicon-bell"></span></center></td>';
                            }
                            else {
                                html += '<td></td>';
                            }
                        }
                        else {
                            html += '<td></td>';
                        }
                        html += '<td></td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>matter name:</b></div></td>';
                        html += '<td>' + a.Case_Name + '</td>';
                        if (a.LinkedCasesCount >= "1") {
                            html += '<td><div><b>Linked Cases:</b></div></td>';
                            html += '<td class="nh"><center><a  id="openlinkeddetails" type="LinkedCases" title="Linked Cases" caseid="' + a.CaseId + '" href="javascript:void()"  title="Linked Cases" ><span style="color:black;" class="glyphicon glyphicon-link"></span></a></center></td>';
                            html += '<td></td>';
                        }
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>bench name:</b></div></td>';
                        html += '<td>' + (a.Bench_Name == null ? '' : a.Bench_Name) + '</td>';
                        if (a.SubMattersCount >= "1") {
                            html += '<td><div><b>Sub-Matters:</b></div></td>';
                            html += '<td class="nh"><center><a  id="opensubmatterdetails"  title="Sub-Matters" caseid="' + a.Id + '" href="javascript:void()"><span style="color:black;" class="glyphicon glyphicon-new-window"></span></a></center></td>';
                            html += '<td></td>';
                        }
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>Advocate:</b></div></td>';
                        html += '<td colspan="4">' + a.Advocate + '</td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>next hearing:</b></div></td>';
                        html += '<td>' + a.Next_Hearing + '</td>';
                        if (a.FIRDetailsCount >= "1") {
                            html += '<td><div><b>FIR Details:</b></div></td>';
                            html += '<td class="nh"><center><a  id="openfirdetails"  title="FIR Details" caseid="' + a.Id + '" href="javascript:void()"><span style="color:black;" class="glyphicon glyphicon-warning-sign"></span></a></center></td>';
                            html += '<td></td>';
                        }
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>manual next hearing:</b></div></td>';
                        if (a.Manualnexthearing == "null" || a.Manualnexthearing == null || a.Manualnexthearing == "") {
                            html += '<td><span class="hyperlink" nhdate="' + a.Next_Hearing + '" caseid="' + a.CaseId + '" usercaseid="' + a.Id + '" id="openmanualnhcnr">(Set Date)</span></td>';
                        }
                        else {
                            html += '<td mnhvalue="' + a.Manualnexthearing + '">' + a.Manualnexthearing + ' <span class="hyperlink" nhdate="' + a.Next_Hearing + '"  usercaseid="' + a.Id + '" caseid="' + a.CaseId + '" style="cursor:pointer;color:#069;" id="openmanualnhcnr">(Set Date)</span></td>';
                        }
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>dispose date:</b></div></td>';
                        html += '<td>' + a.Disposed_Date + '</td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '<td><div><b>status:</b></div></td>';
                        html += '<td>' + a.Status + '</td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '</tr>';
                        if (a.District != "") {
                            html += '<td><div><b>District:</b></div></td>';
                            html += '<td colspan="2">' + a.District + '</td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '</tr>';
                            html += '<tr>';
                            html += '<td><div><b>Court Complex / Court Establishment Type:</b></div></td>';
                            html += '<td>' + a.Court_Complex_Court_Establishment_Type + '</td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '</tr>';
                            html += '<tr>';
                            html += '<td><div><b>Court Complex / Court Establishment:</b></div></td>';
                            html += '<td>' + a.Court_Complex_Court_Establishment + '</td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '</tr>';
                            html += '<tr>';
                            html += '<td><div><b>CNR Number:</b></div></td>';
                            html += '<td>' + a.CNRNO + '</td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '<td></td>';
                            html += '</tr>';
                        }
                    }); //End of foreach Loop
                    $("#binddatacw").empty().append(html);
                    closeload();
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
    /*Set CNR alert*/
    $(document).on("click", "#setalerts", function () {
        var lids = $(this).attr("val-data");
        var casenametxt = $("#casenametxtval").val();
        var courttext = $("#courttextval").val();
        var casenotxt = $("#casenotxtval").val();
        var nhdate = $("#nhdateval").val();
        var mnhdate = $("#mnhdateval").val();
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
        loadsavealerts();
        $('#myModalcasealerts').modal({ show: true });
        clearForm();
    });
    $('#ddlalertfor').on('change', function () {
        if (this.value == "0") {
            $("#alertmobpanel").css("display", "unset");
            $("#alertemailpanel").css("display", "unset");
        }
        else {
            $("#alertmobpanel").css("display", "none");
            $("#alertemailpanel").css("display", "none");
        }
    });
    /*Remove CNR case alert*/
    $(document).on("click", "#removecasealert", function () {
        var formData = new FormData();
        formData.append("casealertid", $(this).attr("data-val"));
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
    $('input[type=radio][name=hearingdateradio]').change(function () {
        $("#savealerts").attr("date-val", $(this).val().trim());
    });
    /*Save CNR alert details*/
    $("#savealerts").click(function () {
        var iid = "0";
        var caseid = $("#textleadid").text();
        var hearingAlert = $("#ddlHearing").val();
        var alertDays = $("#ddldays").val();
        var hdate = $(this).attr("date-val");
        if (hdate == "") {
            alert("Please select Next Hearing date");
            return false;
        }
        var alertfor = $("#ddlalertfor").val();
        var cmobile = $("#clientmobile").val();
        var cemail = $("#cientemail").val();
        var caldate = $("#callfromdate").val();
        if (caldate != "") {
            var currentDt = new Date(caldate);
            var mm = currentDt.getMonth() + 1;
            mm = (mm < 10) ? '0' + mm : mm;
            var dd = currentDt.getDate();
            dd = (dd < 10) ? '0' + dd : dd;
            var yyyy = currentDt.getFullYear();
            caldate = mm + '/' + dd + '/' + yyyy;
        }
        if (caldate != "" && (hearingAlert != "0" || alertDays != "")) {
            alert("Please select one Date");
            return false;
        }
        if (caldate == "") {
            if (hearingAlert != 3) {
                if (alertDays == 0) {
                    alert("Please Set Alert Date");
                    return false;
                }
            }
            if (hearingAlert == 0) {
                alert("Please Set Alert Date");
                return false;
            }
            if (hearingAlert == 3 && alertDays == "") {
                alertDays = "0";
            }
        }
        if (caldate != "") {
            alertDays = 0;
            hearingAlert == 0;
        }
        if (alertfor == "") {
            alert("Select Set Alert For");
            return false;
        }
        if (alertfor == 0) {
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
        formData.append("caldate", caldate);
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
    /*Get set alert details*/
    function loadsavealerts() {
        $("#assignusercasedata").html("");
        var html = '';
        var formData = new FormData();
        var caseid = $("#textleadid").text();
        formData.append("caseid", caseid);
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
    clearForm();
    function clearForm() {
        $('#savecasealert')[0].reset();
    }
    /*Get CNR case order details*/
    $(document).on("click", "#caseorder", function () {
        openload();
        var ids = $(this).attr("id-val");
        var caseids = $(this).attr("case-val");
        var url = encodeURI("/firm/CNRCaseOrders?status=true&id=" + cnr + "&caseid=" + ids + "&pcaseid=" + id);
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
            closeload();
        });
    });
    /*Get cause list*/
    $(document).on("click", "#getcauselistdata", function () {
        openload();
        var ISReraCourt = "";
        var ids1 = $(this).attr("val-data");
        var courtType = $(this).attr("data-courttypeId");
     //  var url = encodeURI("/firm/CaseCauseList?status=true&id=" + ids1);
        var url = "/firm/CaseCauseList?status=true&id=" + ids1 + "&isRera=" + ISReraCourt + "&courtTypeId=" + courtType;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
        closeload();
    });
    //For Main Matters
    $(document).on("click", "#openlinkeddetails", function () {
        var caseid = $(this).attr("caseid");
        var formData = new FormData();
        formData.append("caseid", caseid);
        $('#myModallinkedsmatters').modal({ show: true });
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
                    $.each(response1.data.Table1, function (i, a) {
                        html += '<tr>';
                        html += '<td> ' + a.FilingNumber + '</td>';
                        html += '<td> ' + a.CaseNoLinkedCase + '</td>';
                        if (a.isMainCase != 1) {
                            if (a.LinkedCaseNoUserCaseId != null) {
                                html += '<td align="center"><a title="View Linked Case Details" href="#"  id="ViewLinkedCaseAdd" ctype="linked" Idss=' + a.LinkedCaseNoUserCaseId + ' data-val=' + a.MasterId + '>View</a></td>';
                            }
                            else {
                                html += '<td align="center"><a title="Add Case To Live Track" href="#"  id="AddLinkedCaseToTrack" ctype="linked" Idss=' + a.CaseNoLinkedCase + ' data-val=' + a.MasterId + '>Add</a></td>';
                            }
                        }
                        else {
                            html += '<td></td>';
                        }

                        html += '</tr>';
                    });
                    $("#LinkedMattersDetails").append(html);
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
                            window.location = encodeURI("/" + fcode5 + "/Firm/caselist");
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
        var transferid = $("#maincasenumber").val();
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
    /*correct file name case file*/
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
});