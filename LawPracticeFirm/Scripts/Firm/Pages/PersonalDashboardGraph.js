var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var firmname = localStorage.getItem("FirmCode");
var chartloadflag51 = 0;
var chartloadflag52 = 0;
var chartloadflag53 = 0;
var chartloadflag54 = 0;
var chartloadflag55 = 0;
var chartloadflag56 = 0;
var chartloadflag152 = 0;
var chartloadflag227 = 0;
var chartloadflag228 = 0;
var chartloadflag231 = 0;
var fcode = localStorage.getItem("FirmCode");
var filtervalue = 0;
$(document).ready(function () {
    if (dashcw == "display:unset") {
        $('#opentodaycauselist').show();
    }
    else {
        $('#opentodaycauselist').hide();
    }
    if (roleids == "1") {
        filtervalue = 0;
    }
    else {
        filtervalue = 1;
    }
    var icount = 0, chartshow = 0;
    openload();

    //if ($("#filterselect option").length > 1) {
    //    filtervalue= $("#filterselect").val();
    //}
    // console.log("ab" + new Date().toLocaleTimeString());
    $("#chart_51,#chart_53,#chart_54").show();
    bindChartDropdown("chartsetting", "Chart_Type");
    /*Load chart dropdown details*/
    function bindChartDropdown(controlname, dropdownname) {
        var html1 = '';
        var formData = new FormData();
        formData.append("dropdownname", EncodeText(dropdownname));
        //read assign using list
        openload();
        var start2 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/LoadChartSetting",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("abc" + (new Date).toLocaleTimeString());
                var obj = response.Data.length;
                html1 += "<div class='cfpanel'>";
                $.each(response.Data, function (index, item) {
                    //if (item.iid == 52) {
                    //    // Not chart and input box
                    //}
                    //else

                    if (item.IsChecked > 0) {
                        html1 += '<p id="chkid' + item.iid + '">' +
                            '<input type="checkbox" class="chkChartsetting" name="chkchartsetting" checked value="' + item.iid + '">' +
                            '<a href="#">' + item.Name + '</a>' +
                            '</p>';

                        // Show/hide charts based on `iid` and dashboard conditions
                        toggleChart(item.iid, dashmatter, dashtask, dashtimeentry, dashinvoice, dashcalendar, dashnotice, roleids, noticeUserPerms);
                        icount += 1;
                    } else {
                        html1 += '<p id="chkid' + item.iid + '">' +
                            '<input type="checkbox" class="chkChartsetting" name="chkchartsetting" value="' + item.iid + '">' +
                            '<a href="#">' + item.Name + '</a>' +
                            '</p>';
                        // Hide charts if unchecked
                        hideChart(item.iid);
                    }
                });
                html1 += "</div>";
                // Append the generated HTML
                $("#" + controlname).html(html1);
                // Add save button and label
                html1 += '<div class="bpanel" style="border-top: 1px dashed #D5D7DA;padding:12px 0 0 0;">' +
                    '<button type="submit" class="btn btn-primary pull-right" id="savematter" onclick="fn_SaveChartSetting()">Save</button>' +
                    '</div>';
                html1 += '<label id="lblcmsg"/>';
                $("#" + controlname).html(html1);

                // Handle default chart display when `icount` is 0
                if (icount === 0) {
                    displayDefaultCharts(dashmatter, dashnotice, dashtask, dashtimeentry, roleids, noticeUserPerms);
                }

                // Function to toggle chart visibility based on specific conditions
                function toggleChart(iid, dashmatter, dashtask, dashtimeentry, dashinvoice, dashcalendar, dashnotice, roleids, noticeUserPerms) {
                    if (iid === 51 && dashmatter === "display:unset") { $("#chart_51").show(); chartloadflag51 = 1; }
                    if (iid === 52 && dashmatter === "display:unset") { $("#chart_52").show(); chartloadflag52 = 1; }
                    if (iid === 53 && dashtask === "display:unset") { $("#chart_53").show(); chartloadflag53 = 1; }
                    if (iid === 54 && dashtimeentry === "display:unset") { $("#chart_54").show(); chartloadflag54 = 1; }
                    if (iid === 55 && dashmatter === "display:unset") { $("#chart_55").show(); chartloadflag55 = 1; }
                    if (iid === 56 && dashinvoice === "display:unset") { $("#chart_56").show(); chartloadflag56 = 1; }
                    if (iid === 152 && dashcalendar === "display:unset") { $("#chart_152").show(); chartloadflag152 = 1; }
                    if (iid === 155 && dashnotice === "display:unset") {
                        if (roleids === "1" || noticeUserPerms === "1") { $("#chart_155").show(); chartloadflag155 = 1; }
                        else { $("#chart_155").hide(); chartloadflag155 = 0; }
                    }
                    // if (iid === 231 && dashmatter === "display:unset") { $("#chart_231").show(); chartloadflag231 = 1; }
                    if (iid === 1241 && dashmatter === "display:unset") { $("#chart_231").show(); chartloadflag231 = 1; }
                    if (iid === 533 && dashmatter === "display:unset") { $("#chart_227").show(); chartloadflag227 = 1; }
                    if (iid === 971 && dashmatter === "display:unset") { $("#chart_228").show(); chartloadflag228 = 1; }
                }

                // Function to hide chart
                function hideChart(iid) {
                    if (iid === 51) { $("#chart_51").hide(); chartloadflag51 = 0; }
                    if (iid === 52) { $("#chart_52").hide(); chartloadflag52 = 0; }
                    if (iid === 53) { $("#chart_53").hide(); chartloadflag53 = 0; }
                    if (iid === 54) { $("#chart_54").hide(); chartloadflag54 = 0; }
                    if (iid === 55) { $("#chart_55").hide(); chartloadflag55 = 0; }
                    if (iid === 56) { $("#chart_56").hide(); chartloadflag56 = 0; }
                    if (iid === 152) { $("#chart_152").hide(); chartloadflag152 = 0; }
                    if (iid === 155) { $("#chart_155").hide(); chartloadflag155 = 0; }
                    // if (iid === 231) { $("#chart_231").hide(); chartloadflag231 = 0; }
                    if (iid === 1241) { $("#chart_231").hide(); chartloadflag231 = 0; }
                    if (iid === 533) { $("#chart_227").hide(); chartloadflag227 = 0; }
                    if (iid === 971) { $("#chart_228").hide(); chartloadflag228 = 0; }
                }

                // Function to show default charts if no items are checked
                function displayDefaultCharts(dashmatter, dashnotice, dashtask, dashtimeentry, roleids, noticeUserPerms) {
                    if (dashmatter === "display:unset") {
                        $("#chart_51").show(); chartloadflag51 = 1;
                        $("#chart_52").show(); chartloadflag52 = 1;
                        $("#chart_231").show(); chartloadflag231 = 1;
                    }
                    if (dashnotice === "display:unset") {
                        if (roleids === "1" || noticeUserPerms === "1") { $("#chart_155").show(); chartloadflag155 = 1; }
                        else { $("#chart_155").hide(); chartloadflag155 = 0; }
                    }
                    if (dashtask === "display:unset") { $("#chart_53").show(); chartloadflag53 = 1; }
                    if (dashtimeentry === "display:unset") { $("#chart_54").show(); chartloadflag54 = 1; }
                }



                /* old code 
                 
                 $.each(response.Data, function (a, t) {
                    t.IsChecked > 0 ? (html1 += '<li id="chkid' + t.iid + '" ><input type="checkbox" class="chkChartsetting" name="chkchartsetting" checked value="' + t.iid + '"><a href="#">' + t.Name + "</a></li>",
                        51 == t.iid && ("display:unset" == dashmatter ? ($("#chart_51").show(), chartloadflag51 = 1) : ($("#chart_51").hide(), chartloadflag51 = 0)),
                        52 == t.iid && ("display:unset" == dashmatter ? ($("#chart_52").show(), chartloadflag52 = 1) : ($("#chart_52").hide(), chartloadflag52 = 0)),
                        53 == t.iid && ("display:unset" == dashtask ? ($("#chart_53").show(), chartloadflag53 = 1) : ($("#chart_53").hide(), chartloadflag53 = 0)),
                        54 == t.iid && ("display:unset" == dashtimeentry ? ($("#chart_54").show(), chartloadflag54 = 1) : ($("#chart_54").hide(), chartloadflag54 = 0)),
                        55 == t.iid && ("display:unset" == dashmatter ? ($("#chart_55").show(), chartloadflag55 = 1) : ($("#chart_55").hide(), chartloadflag55 = 0)),
                        56 == t.iid && ("display:unset" == dashinvoice ? ($("#chart_56").show(), chartloadflag56 = 1) : ($("#chart_56").hide(), chartloadflag56 = 0)),
                        152 == t.iid && ("display:unset" == dashcalendar ? ($("#chart_152").show(), chartloadflag152 = 1) : ($("#chart_152").hide(), chartloadflag152 = 0)),
                       //227 == t.iid && ("display:unset" == dashmatter ? ($("#chart_227").show(), chartloadflag227 = 1) : ($("#chart_227").hide(), chartloadflag227 = 0)),
                        533 == t.iid && ("display:unset" == dashmatter ? ($("#chart_227").show(), chartloadflag227 = 1) : ($("#chart_227").hide(), chartloadflag227 = 0)),
                     //   228 == t.iid && ("display:unset" == dashmatter ? ($("#chart_228").show(), chartloadflag228 = 1) : ($("#chart_228").hide(), chartloadflag228 = 0)),
                        971 == t.iid && ("display:unset" == dashmatter ? ($("#chart_228").show(), chartloadflag228 = 1) : ($("#chart_228").hide(), chartloadflag228 = 0)),
                        231 == t.iid && ("display:unset" == dashmatter ? ($("#chart_231").show(), chartloadflag231 = 1) : ($("#chart_231").hide(), chartloadflag231 = 0)),
                        155 == t.iid && ("display:unset" == dashnotice ? "1" == roleids ? ($("#chart_155").show(), chartloadflag155 = 1) : "1" == noticeUserPerms ? ($("#chart_155").show(), chartloadflag155 = 1) : ($("#chart_155").hide(), chartloadflag155 = 0) : ($("#chart_155").hide(), chartloadflag155 = 0)), icount += 1)
                        : (html1 += '<li id="chkid' + t.iid + '"><input type="checkbox" class="chkChartsetting" name="chkchartsetting"  value="' + t.iid + '"><a href="#">' + t.Name + "</a></li>", 51 == t.iid && ($("#chart_51").hide(), chartloadflag51 = 0), 52 == t.iid && ($("#chart_52").hide(), chartloadflag52 = 0), 53 == t.iid && ($("#chart_53").hide(), chartloadflag53 = 0), 54 == t.iid && ($("#chart_54").hide(), chartloadflag54 = 0), 55 == t.iid && ($("#chart_55").hide(), chartloadflag55 = 0), 56 == t.iid && ($("#chart_56").hide(), chartloadflag56 = 0), 152 == t.iid && ($("#chart_152").hide(), chartloadflag152 = 0), 155 == t.iid && ($("#chart_155").hide(), chartloadflag155 = 0), 231 == t.iid && ($("#chart_231").hide(), chartloadflag231 = 0), chartshow += 1),
                        $("#" + controlname).html(html1)
                }), html1 += '<li><button type="submit" class="sbtbtn" id="savematter" onclick="fn_SaveChartSetting()">Save</button></li>', html1 += '<label id="lblcmsg"/>',

                    $("#" + controlname).html(html1), 0 == icount && ("display:unset" == dashmatter && ($("#chart_51").show(), chartloadflag51 = 1, $("#chart_52").show(), chartloadflag52 = 1, $("#chart_231").show(), chartloadflag231 = 1), "display:unset" == dashnotice && ("1" == roleids ? ($("#chart_155").show(), chartloadflag155 = 1) : "1" == noticeUserPerms ? ($("#chart_155").show(), chartloadflag155 = 1) : ($("#chart_155").hide(), chartloadflag155 = 0)), "display:unset" == dashtask && ($("#chart_53").show(), chartloadflag53 = 1), "display:unset" == dashtimeentry && ($("#chart_54").show(), chartloadflag54 = 1))
                 */
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
        $.when(start2).then(function (data, textStatus, jqXHR) {
            // Consolidated API call replaces 4 count + 10 chart API calls
            LoadDashboardSummary(filtervalue);

            if (chartloadflag227 == "1") { GetDataByNoticeStatus(); }
            if (chartloadflag228 == "1") { GetMatterByDepartmentFront(filtervalue); }
            if (DivChartFirmId == 'AssignDivisionChart') {
                $('#chart_230').css('display', 'block');
                FillDivisionChart(filtervalue);
            }
            //For BPCL Custmization
            if (BPCLDivChartFirmId == 'AssignCaseTypeChart') {
                $('#chart_2311').css('display', 'block');
                FillCustomCaseTypeChart(filtervalue);
            }
            //FillDivisionChart(filtervalue);
            if (dashmatter == "display:none") {
                $("#chkid51,#chkid52,#chkid55,#chart_227,#chart_228").hide();
            }
            //FillDivisionChart(filtervalue);
            if (SyngentaDivChartFirmId == 'AssignStateTypeChart') {
                $('#chart_232').css('display', 'block');
                FillCustomStateTypeChart(filtervalue);
            }
            if (dashtask == "display:none") {
                $("#chkid53").hide();
            }
            if (dashtimeentry == "display:none") {
                $("#chkid54").hide();
            }
            if (dashinvoice == "display:none") {
                $("#chkid56").hide();
            }
            if (dashcalendar == "display:none") {
                $("#chkid152").hide();
            }
            if (dashnotice == "display:none") {
                $("#chkid155").hide();
            }
            if (roleids == "2") {
                if (noticeUserPerms != "1") {
                    $("#chkid155").hide();
                }
            }
            setTimeout(() => {
                var Checkload = 0;
                if (Checkload == 0) {
                    ploadtabledata();
                    //loadcustomfieldcjhoice();
                    //loadactivity(pageindex);
                }
                downloadData();
                //if (chartloadflag152 == "1") {
                //    downloadData();
                //}
            }, "4000")
        });
    }

    /*Cancel div*/
    $("#Canceldiv").click(function () {
        $("#emaildiv").hide();
    });
    /*Pdf div*/
    $("#emailPDF").click(function () {
        $('#myOverlay').show();
        $("#emaildiv").show();
        $('#myOverlay').hide();
    });
    /*send Today Cause List PDF Mail*/
    $("#SendPDF").click(function () {
        $('#myOverlay').show();
        var formdata = new FormData();
        var email = $("#emailCauseList").val();
        if (email == "") {
            alert("Please enter email");
            $("#emailCauseList").focus();
            return false;
        }
        if (email != "") {
            var reg = /\S+@\S+\.\S+/;
            if (reg.test(email) == false) {
                alert('Invalid Email');
                $("#emailCauseList").focus();
                return false;
            }
        }
        formdata.append("email", EncodeText(email));
        $.ajax({
            async: true,
            url: "/CW/TodayCauseListSendPDFMail",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (String(response) == "True") {
                    $("#emailCauseList").val("");
                    alert("Mail sent successfully.");
                    $('#myOverlay').hide();
                }
                else {
                    alert(response);
                    $('#myOverlay').hide();
                }
            },
            failure: function (response) {
                $('#myOverlay').hide();
                //alert(data.responseText);
            },
            error: function (response) {
                $('#myOverlay').hide();
                //alert(data.responseText);
            }
        });
    });
    $("#DownloadPDF").click(function () {
        var downloadpath = "/CW/TodayCauseListDownLoadPDF";
        var link = document.createElement('a');
        link.href = downloadpath;
        link.target = "_blank";
        link.click();
    });
    $("#opentodaycauselist").click(function () {
        if (dashcw == "display:unset") {
            $('#myModalcauselist').modal({ show: true });
            CauselistCaseWatchModal();
        }
    });
    $("#closecauselist").click(function () {
        localStorage.setItem("causemodal", "dfd");
    });
    var arrcolmenuseleciton = [];
    /*Load custom field data*/
    function ploadtabledata() {
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
                'configurationtype': 8
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
                        columnvalue = columnvalue + 1;
                        sort = sort + 1;
                        option += '<li><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                    });
                    $("#od").append(option);
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
        });
    }
    /*Load custom field choice*/
    function loadcustomfieldcjhoice() {
        arrcolmenuseleciton = [];
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
                if (obj.length > 0) {
                    $('input:checkbox').removeAttr('checked');
                }
                $.each(obj, function (i, a) {
                    arrcolmenuseleciton.push(a.ColumnValue);
                });
                for (i = 0; i < arrcolmenuseleciton.length; i++) {
                    $("[name='" + arrcolmenuseleciton[i] + "']").prop('checked', true);
                }
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
    }
    $(document).on('click', '#oexcel', function () {
        var chkArray3 = [];
        var selected = $("#od input[type='checkbox']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        if (selected3 == "") {
            selected3 = "StartDate,MatterName,CompanyNameCourt,CreatedBy,TeamMembers,ClientContact,MatterType";
        }
        //return false;
        var type = "8";
        var esearchdata = "";
        var ecasefilterdate = "";
        var ecasefilterclient = "";
        var ecasefiltercourt = "";
        var ecasefilterstatus = "";
        var eusers = "";
        var createdby = "";
        if (filtervalue == "1") {
            createdby = userid;
        }
        else {
            createdby = "";
        }
        var esearchdatanotes = "";
        var ecasefiltercompanyname = "";
        var ecasefiltermattertype = "";
        var ecasefiltersubjecttype = "";
        var ecasefiltercourtname = "";
        var pagenum = 1;
        var pagesizedata = 10000;
        var ecasefilterdateto = "";
        var ecasefFilingdate = "";
        var ecasefFilingdateto = "";
        var fieldnamecust = "";
        var fieldvaluecust = "";
        var serhdisposeoptions = "";
        var casefilterCaseDetails1 = "";
        var casefiltermtrno1 = "";
        var casefilterInternalno1 = "";
        var casefiltercnrno1 = "";
        var caseredirectfilter = "";
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
                "casefiltercnrno": EncodeText(casefiltercnrno1), "caseRedirectfilter": EncodeText(caseredirectfilter)
            }
        });
    })
    /*Get causelist case watch model details*/
    function CauselistCaseWatchModal() {
        $('#myOverlay').show();
        var formData = new FormData();
        formData.append("pageno", EncodeText(1));
        formData.append("pagesize", EncodeText(10));
        //read assign using list
        qty1 = 0;
        var html = '';
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CauseListModal",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $('#myOverlay').hide();
                $("#loading").hide();
                var datas = JSON.parse(response);
                var table = JSON.stringify(datas.data.Table1);
                var table1 = JSON.stringify(datas.data.Table2);
                var table2 = JSON.stringify(datas.data.Table3);
                var table3 = JSON.stringify(datas.data.Table4);
                var tableRevRERH = JSON.stringify(datas.data.Table5);
                var response = datas.data.Table1;
                var response1 = datas.data.Table2;
                var response2 = datas.data.Table3;
                var response3 = datas.data.Table4;
                var resRevRERH = datas.data.Table5;
                var html = "";
                var html1 = "";
                var html2 = "";
                var html3 = "";
                var htmlRevRERH = "";
                if (table == "[]") {
                    $("#Tbodystatus").css("display", "");
                }
                else {
                    $("#Tbodystatus").css("display", "none");
                    var counts4 = 0;
                    var counts5 = 0;
                    var counts6 = 0;
                    var counts7 = 0;
                    $.each(response, function (i, a) {
                        counts4 = counts4 + 1;
                        html += '<tr>'
                        html += '<td>' + a.Courtname + '</td>'
                        html += '<td>' + a.vCaseType + '</td>'
                        html += '<td>' + a.vcaseno + '</td>'
                        html += '<td>' + a.vcaseyear + '</td>'
                        html += '<td>' + a.vCourtNo + '</td>'
                        //html += '<td>"' + a.Filetext + '"</td>'
                        if (a.Filetext == "" || a.Filetext == null || a.Filetext == "null") {
                            html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                        }
                        else {
                            if (a.Filetext.length > 60) {
                                html += '<td>'
                                html += '<span class="comment more" style="">' + a.Filetext.substring(0, 60) + '</span>'
                                html += '<span data-toggle="collapse" data-target="#dtn' + counts4 + '" style="color:blue;cursor:pointer"> more</span>'
                                html += ' <div id="dtn' + counts4 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                                html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts4 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html += '' + a.Filetext + ''
                                html += '</div>'
                                html += '</td>'
                            }
                            else {
                                html += '<td><span class="comment more" style="">' + a.Filetext + '</span></td>'
                            }
                        }

                        html += '<td>' + a.vDiaryNo + '</td>'
                        html += '<td>' + a.vDiaryYear + '</td>'
                        html += '</tr>'
                    });
                    $("#Tbody").empty().html(html);
                }
                if (table1 == "[]") {
                    $("#Tbody1status").css("display", "");
                }
                else {
                    $("#Tbody1status").css("display", "none");
                    $.each(response1, function (i, a) {
                        counts5 = counts5 + 1;
                        html1 += '<tr>'
                        html1 += '<td>' + a.vcasetypename + '</td>'
                        html1 += '<td>' + a.vstate + '</td>'
                        html1 += '<td>' + a.vDistrict + '</td>'
                        html1 += '<td>' + a.JudgName + '</td>'
                        html1 += '<td>' + a.vCourtDetails + '</td>'
                        html1 += '<td>' + a.Filetext + '</td>'
                        //if (a.Filetext == "" || a.Filetext == null || a.Filetext == "null") {
                        //    html += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                        //}
                        //else {
                        //    if (a.Filetext.length > 60) {
                        //        html1 += '<td>'
                        //        html1 += '<span class="comment more" style="">' + a.Filetext.substring(0, 60) + '</span>'
                        //        html1 += '<span data-toggle="collapse" data-target="#dtn' + counts5 + '" style="color:blue;cursor:pointer"> more</span>'
                        //        html1 += ' <div id="dtn' + counts5 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                        //        html1 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts5 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                        //        html1 += '' + a.Filetext + ''
                        //        html1 += '</div>'
                        //        html1 += '</td>'
                        //    }
                        //    else {
                        //        html1 += '<td><span class="comment more" style="">' + a.Filetext + '</span></td>'
                        //    }
                        //}
                        html1 += '</tr>'
                    });
                    $("#Tbody1").empty().html(html1);
                }
                if (table2 == "[]") {
                    $("#Tbody2status").css("display", "");
                }
                else {
                    $("#Tbody2status").css("display", "none");
                    $.each(response2, function (i, a) {
                        counts7 = counts7 + 1;
                        html2 += '<tr>'
                        html2 += '<td>' + a.Courtname + '</td>'
                        html2 += '<td>' + a.vCaseType + '</td>'
                        html2 += '<td>' + a.vcaseno + '</td>'
                        html2 += '<td>' + a.vcaseyear + '</td>'
                        html2 += '<td>' + a.Benchname + '</td>'
                        html2 += '<td>' + a.Filetext + '</td>'
                        //if (a.Filetext == "" || a.Filetext == null || a.Filetext == "null") {
                        //    html2 += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                        //}
                        //else {
                        //    if (a.Filetext.length > 60) {
                        //        html2 += '<td>'
                        //        html2 += '<span class="comment more" style="">' + a.Filetext.substring(0, 60) + '</span>'
                        //        html2 += '<span data-toggle="collapse" data-target="#dtn' + counts6 + '" style="color:blue;cursor:pointer"> more</span>'
                        //        html2 += ' <div id="dtn' + counts6 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                        //        html2 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts6 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                        //        html2 += '' + a.Filetext + ''
                        //        html2 += '</div>'
                        //        html2 += '</td>'
                        //    }
                        //    else {
                        //        html2 += '<td><span class="comment more" style="">' + a.Filetext + '</span></td>'
                        //    }
                        //}
                        html2 += '<td>' + a.vDiaryNo + '</td>'
                        html2 += '<td>' + a.vDiaryYear + '</td>'
                        html2 += '</tr>'
                    });
                    $("#Tbody2").empty().html(html2);
                }

                if (table3 == "[]") {
                    $("#Tbody3status").css("display", "");
                }
                else {
                    $("#Tbody3status").css("display", "none");
                    $.each(response3, function (i, a) {
                        counts6 = counts6 + 1;
                        html3 += '<tr>'
                        html3 += '<td>' + a.Courtname + '</td>'
                        html3 += '<td>' + a.vCaseType + '</td>'
                        html3 += '<td>' + a.vcaseno + '</td>'
                        html3 += '<td>' + a.vcaseyear + '</td>'
                        html3 += '<td>' + a.Benchname + '</td>'
                        html3 += '<td>' + a.Filetext + '</td>'
                        //if (a.Filetext == "" || a.Filetext == null || a.Filetext == "null") {
                        //    html2 += '<td><span class="comment more" style="">' + a.CauselistDetail + '</span></td>'
                        //}
                        //else {
                        //    if (a.Filetext.length > 60) {
                        //        html2 += '<td>'
                        //        html2 += '<span class="comment more" style="">' + a.Filetext.substring(0, 60) + '</span>'
                        //        html2 += '<span data-toggle="collapse" data-target="#dtn' + counts6 + '" style="color:blue;cursor:pointer"> more</span>'
                        //        html2 += ' <div id="dtn' + counts6 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
                        //        html2 += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + counts6 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                        //        html2 += '' + a.Filetext + ''
                        //        html2 += '</div>'
                        //        html2 += '</td>'
                        //    }
                        //    else {
                        //        html2 += '<td><span class="comment more" style="">' + a.Filetext + '</span></td>'
                        //    }
                        //}
                        html3 += '</tr>'
                    });
                    $("#Tbody3").empty().html(html3);
                }
                if (tableRevRERH == "[]") {
                    $("#TbodyRevRERHstatus").css("display", "");
                }
                else {
                    $("#TbodyRevRERHstatus").css("display", "none");
                    $.each(resRevRERH, function (i, a) {
                        counts6 = counts6 + 1;
                        htmlRevRERH += '<tr>'
                        htmlRevRERH += '<td>' + a.vCaseName + '</td>'
                        htmlRevRERH += '<td>' + a.vCourt + '</td>'
                        htmlRevRERH += '<td>' + a.vCauselistDate + '</td>'
                        htmlRevRERH += '<td>' + a.AppealNo + '</td>'
                        htmlRevRERH += '<td>' + a.Courtname + '</td>'
                        htmlRevRERH += '<td>' + a.vStatus + '</td>'
                        htmlRevRERH += '</tr>'
                    });
                    $("#RevRERHData").empty().html(htmlRevRERH);
                }

            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    if (dashmatter == "display:unset") {
        $("#matter_panel,#matter_panel1,#commu_panel,#commu_panel1").show();
    }
    else {
        $("#matter_panel,#matter_panel1,#commu_panel,#commu_panel1").hide();
    }
    if (dashtask == "display:unset") {
        $("#taskdue_panel").show();
    }
    else {
        $("#taskdue_panel").hide();
    }
    if (dashcontact == "display:unset") {
        $("#client_panel,#client_panel1").show();
    }
    else {
        $("#client_panel,#client_panel1").hide();
    }
    //$("#redirecttocommuniction").click(function () {
    //    var urls = "/" + fcode + "/Firm/CommunicationList";
    //    url_redirect({
    //        url: urls,
    //        method: "post",
    //        data: { "type": $("#filterselect").val() }
    //    });
    //});
    $('#demo3').datepicker();
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        $('input[type = "date"]').attr("onkeydown", "");
        $('input[type = "date"]').attr("onkeypress", "");
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
        }
    });
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    //$(document).on('click', '#getdatabypagenum', function () {
    //    pageindex = $("#pagnumvalue").val();
    //    if (pageindex != "undefined") {
    //        if (Math.sign(pageindex) == 1) {
    //            var pageindesx = $("#sotopage").text();
    //            if (pageindex <= parseInt(pageindesx)) {
    //                loadactivity(pageindex);
    //                closeload();
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //            }
    //        }
    //        else {
    //            alert("Please enter a valid page number.");
    //        }
    //    }
    //});
    //$(document).on('click', '#paginate', function () {
    //    /* your code here */
    //    pageindex = $(this).attr("index");
    //    loadactivity(pageindex);
    //    closeload();
    //});

    /*Get causelist case for dashboard*/
    function CauselistCaseWatchDashboard() {
        var formData = new FormData();
        formData.append("pageno", EncodeText(1));
        formData.append("pagesize", EncodeText(10));

        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CauseListModal",
            dataType: "json",
            data: formData,
            contentType: false,
            processData: false,
            success: function (resp) {
                $("#loading").hide();
                //debugger

                var datas = JSON.parse(resp);
                var t1 = Array.isArray(datas.data.Table1) ? datas.data.Table1 : [];
                var t2 = Array.isArray(datas.data.Table2) ? datas.data.Table2 : [];
                var t3 = Array.isArray(datas.data.Table3) ? datas.data.Table3 : [];
                var t4 = Array.isArray(datas.data.Table4) ? datas.data.Table4 : [];
                var t5 = Array.isArray(datas.data.Table5) ? datas.data.Table5 : [];
                // pick first non-empty table + remember which
                var picked = [];
                var pickedName = "";
                if (t1.length) { picked = t1; pickedName = "Table1"; }
                else if (t2.length) { picked = t2; pickedName = "Table2"; }
                else if (t3.length) { picked = t3; pickedName = "Table3"; }
                else if (t4.length) { picked = t4; pickedName = "Table4"; }
                else if (t5.length) { picked = t5; pickedName = "Table5"; }
                $("#partyname").text("");
                $("#courtname").text("");
                $("#dairyno").text("");

                if (!picked.length) {
                    var emptyHtml =
                        '<div class="notfound">' +
                        '<p class="notfoundhead">No Cases Scheduled for Today</p>' +
                        '<p class="notfoundpara">There are no hearings or listed matters for today.</p>' +
                        '</div>';
                    $("#divcauselistdata").empty().html(emptyHtml);
                    $("#opentodaycauselist").hide();
                    return;
                }

                $("#opentodaycauselist").show();

                var html = '<table cellspacing="0" cellpadding="0" width="100%">';
                $.each(picked, function (i, a) {
                    // LEFT: title/description
                    // For Table2 bind vcasetypename; otherwise Filetext
                    var leftTitle = pickedName === "Table2"
                        ? (a.vcasetypename || a.vCaseTypeName || a.Filetext || "")
                        : (a.Filetext || a.vCaseName || "");

                    // Court text: Courtname -> vCourtDetails -> vcourt -> ""
                    var courtText = (a.Courtname ?? a.vCourtDetails ?? a.vcourt ?? "");
                    if (courtText == null) courtText = "";
                    courtText = a.vCourt == 'Revenue' ? a.vCourt + '(' + courtText + ')' : courtText;
                    // RIGHT: case no/year with clean slash handling
                    var vcn = a.vcaseno || a.vCaseNo || "";
                    var vcy = a.vcaseyear || a.vCaseYear || "";
                    var rightCase = vcn && vcy ? (vcn + "/" + vcy) : (vcn || vcy || "");

                    html += '<tr>';
                    html += '  <td class="high-court-frame">' +
                        '    <div class="partyname">' + leftTitle + '</div>' +
                        '    <div class="courtname">' + courtText + '</div>' +
                        '  </td>';
                    html += '  <td width="100px" align="right" valign="top">' +
                        '    <div class="dairyno">' + rightCase + '</div>' +
                        '  </td>';
                    html += '</tr>';
                });
                html += '</table>';

                $("#divcauselistdata").empty().html(html);
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
    CauselistCaseWatchDashboard();

    /*Get Calendar grid data for dashboard*/
    function LoadCalendarGridNextHearingDashboard() {
        //alert("hi matter");
        var formData = new FormData();

        var html = '';
        var d0 = $.ajax({
            async: true,
            type: "GET",
            url: "/firm/LoadCalendarGridNextHearing",
            dataType: 'text',
            //data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loading").show();
                //$.each(response, function (index, row) {
                //    var matterStatus = row.MatterStatus;  // Assuming 'matterstatus' is a column in your DataTable
                //    var ccount = row.mcount;
                //    //alert(matterStatus + ',' + ccount);
                //    html += ' <div class="col-md-4">' + matterStatus + '</div><div class="col-md-1">' + ccount + '</div><br />';
                //});
                //$("#divcalendardata").empty().html(response);
                showAllCombineData(response);
                $("#loading").hide();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    LoadCalendarGridNextHearingDashboard();
});

function showAllCombineData(htmlData) {
    const tempDiv = $('<div>').html(htmlData);

    const groupedData = {};

    tempDiv.find('.selected-date').each(function () {
        const dateText = $(this).find('.text58').text().trim();
        const events = [];

        $(this).find('.event').each(function () {
            const eventType = $(this).clone().children().remove().end().text().trim(); // removes inner <div class=time>
            events.push(eventType);
        });

        if (!groupedData[dateText]) {
            groupedData[dateText] = [];
        }

        groupedData[dateText] = groupedData[dateText].concat(events);
    });

    let html = '';
    Object.keys(groupedData)
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach(date => {
            let arrEvent = groupedData[date];
            let uniqueArr = [];

            $.each(arrEvent, function (i, el) {
                let trimmed = el.trim();
                if ($.inArray(trimmed, uniqueArr) === -1) {
                    uniqueArr.push(trimmed);
                }
            });

            html += `<span>${date}</span><br/>`;
            for (let i = 0; i < uniqueArr.length; i++) {
                const item = uniqueArr[i];
                if (item === "Task") {
                    html += "<span class='clsTas'>Task</span>";
                } else if (item === "Order") {
                    html += "<span class='clsOrder'>Order</span>";
                } else if (item === "Court Hearing") {
                    html += "<span class='clshearing'>Hearing</span>";
                } else {
                    continue;
                }
            }
            html += "<br/>";
        });

    $('#divcalendardata').empty().html(html);
}

$("#ddlCauselist").change(function () {
    var cval = $('#ddlCauselist').val();
    window.location.href = "/" + fcode + "/CW/DailyCauseList?c=" + cval;
});

calendararray = [];
calendararrayTask = [];
calendararrayEvent = [];
calendararrayOrder = [];
var count = 0;

/*Download data*/
function downloadData() {
    closeload();
    $('#demo3loader').show();
    var urls31 = "/firm/LoadMergeNextHearing";
    $.ajax({
        timeout: 10000,
        async: true,
        type: "POST",
        url: urls31,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var datas = JSON.stringify(response);
            if (response == "") {
                // closeload3();
            }
            else {
                $.when(
                    $.each(response, function (i, val) {
                        if (val.EventType == "Task") {
                            calendararrayTask.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                        }
                        else if (val.EventType == "Event") {
                            calendararrayEvent.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                        }
                        else if (val.EventType == "Order") {
                            calendararrayOrder.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                        }
                        else {
                            calendararray.push(moment(val.Disposeddt).format('MM/DD/YYYY'));
                        }
                    })
                ).then(function () {
                    if (JSON.stringify(calendararray) != "[]" || JSON.stringify(calendararrayTask) != "[]" || JSON.stringify(calendararrayEvent) != "[]" || JSON.stringify(calendararrayOrder) != "[]") {
                        $("#demo3").datepicker("destroy");
                        dates = JSON.stringify(calendararray);
                        dates = String(dates).replace(/"/g, "");
                        dates = String(dates).replace(/]/g, "");
                        dates = String(dates).substr(1);
                        dates = dates.split(',');
                        datesTask = JSON.stringify(calendararrayTask);
                        datesTask = String(datesTask).replace(/"/g, "");
                        datesTask = String(datesTask).replace(/]/g, "");
                        datesTask = String(datesTask).substr(1);
                        datesTask = datesTask.split(',');
                        datesEvent = JSON.stringify(calendararrayEvent);
                        datesEvent = String(datesEvent).replace(/"/g, "");
                        datesEvent = String(datesEvent).replace(/]/g, "");
                        datesEvent = String(datesEvent).substr(1);
                        datesEvent = datesEvent.split(',');
                        datesOrder = JSON.stringify(calendararrayOrder);
                        datesOrder = String(datesOrder).replace(/"/g, "");
                        datesOrder = String(datesOrder).replace(/]/g, "");
                        datesOrder = String(datesOrder).substr(1);
                        datesOrder = datesOrder.split(',');
                        var dates22 = ['03/10/2021', '03/06/2021'];
                        $('#demo3').datepicker({
                            dateFormat: 'mm/dd/yy',
                            todayBtn: true,
                            beforeShowDay: highlightDays,
                            onSelect: function (date) {
                                dt = date;
                                //defined your own method here
                                if (dt != null) {
                                    var fcode33 = localStorage.getItem("FirmCode");
                                    window.location = encodeURI("/" + fcode33 + "/firm/MergeCalendar");
                                }
                            }
                        });
                        $('#demo3loader').hide();
                        $('#demo3').datepicker('setDate', new Date());
                        calendararray = [];
                        calendararrayTask = [];
                    }
                });
            }
        }
    });
}

/*High light days*/
function highlightDaysq(date) {
    for (var i = 0; i < dates.length; i++) {
        if (new Date(dates[i]).toString() == date.toString()) {

            // $('td >a.ui-state-default').append('<ul><li id="taskli"></li></ul>');
            return [true, 'highlight'];
        }
    }
    for (var i = 0; i < datesTask.length; i++) {
        if (new Date(datesTask[i]).toString() == date.toString()) {
            return [true, 'highlightTask'];

        }
    }
    for (var i = 0; i < datesEvent.length; i++) {
        if (new Date(datesEvent[i]).toString() == date.toString()) {
            return [true, 'highlightEvent'];
        }
    }
    for (var i = 0; i < datesOrder.length; i++) {
        if (new Date(datesOrder[i]).toString() == date.toString()) {
            return [true, 'highlightOrder'];
        }
    }
    return [true, ''];
}

function highlightDays(date) {
    for (var i = 0; i < dates.length; i++) {
        if (new Date(dates[i]).toString() == date.toString()) {
            return [true, 'highlight'];
        }
    }
    for (var i = 0; i < datesTask.length; i++) {
        if (new Date(datesTask[i]).toString() == date.toString()) {
            return [true, 'highlightTask'];
        }
    }
    for (var i = 0; i < datesEvent.length; i++) {
        if (new Date(datesEvent[i]).toString() == date.toString()) {
            return [true, 'highlightEvent'];
        }
    }
    for (var i = 0; i < datesOrder.length; i++) {
        if (new Date(datesOrder[i]).toString() == date.toString()) {
            return [true, 'highlightOrder'];
        }
    }
    return [true, ''];
}
//setTimeout(function () {
//    $('td.highlightTask').html('<ul><li id="taskli"></li></ul>');
//    $('td.highlight').html('<ul><li id="CaseNexthearing"></li></ul>');
//    $('td.highlightEvent').html('<ul><li id="Event"></li></ul>');
//    $('td.highlightOrder').html('<ul><li id="OrderClass"></li></ul>');
//}, 10000);


function filterselect(filtervalue) {
    if (filtervalue == 0) {
        filtervalue = 0;
        $("#btnCmp").css("background", "#f3f3f3");
        $("#btnInd").css("background", "");
    } else {
        $("#btnCmp").css("background", "");
        $("#btnInd").css("background", "#f3f3f3");
        filtervalue = 1;
    }
    LoadDashboardSummary(filtervalue);
    GetDataByNoticeStatus();
    GetMatterByDepartmentFront(filtervalue);
    if (DivChartFirmId == 'AssignDivisionChart') {
        $('#chart_230').css('display', 'block');
        FillDivisionChart(filtervalue);
    }
    else {
        $('#chart_230').css('display', 'none');
    }
    if (BPCLDivChartFirmId == 'AssignCaseTypeChart') {
        $('#chart_2311').css('display', 'block');
        FillCustomCaseTypeChart(filtervalue);
    }
    else {
        $('#chart_2311').css('display', 'none');
    }
    if (SyngentaDivChartFirmId == 'AssignStateTypeChart') {
        $('#chart_232').css('display', 'block');
        FillCustomStateTypeChart(filtervalue);
    }
    else {
        $('#chart_232').css('display', 'none');
    }
    closeload();
}
//Dashboard data filter
//$(document).on('click', '#filterselect', function () {
//    var filtervalue = $(this).val();
//    MyMatterCount(filtervalue);
//    MyClientsCount(filtervalue);
//    TaskDueTodayCount(filtervalue);
//    CommunicationReceivedCount(filtervalue);
//    FillMatterTypeChartFront(filtervalue);
//    FillCaseStatusChartFront(filtervalue);
//    FillCaseStatusChartBack(filtervalue);
//    FillPendingTaskChartFront(filtervalue);
//    FillPendingChartBack(filtervalue);
//    FillTimeSpendChartFront(filtervalue);
//    FillTimeSpendChartBack(filtervalue);
//    FillSubjectTypeChartFront(filtervalue);
//    FillInvoiceChartFront(filtervalue);
//    FillInvoiceChartBack(filtervalue);
//    FillNoticeMatterChartFrontBack(filtervalue);
//    GetDataByNoticeStatus();
//    GetMatterByDepartmentFront(filtervalue);
//    //FillDivisionChart(filtervalue);
//    if (DivChartFirmId == 'AssignDivisionChart') {
//        $('#chart_230').css('display', 'block');
//        FillDivisionChart(filtervalue);
//    }
//    else {
//        $('#chart_230').css('display', 'none');
//    }
//    //For BPCL Client Custmization
//    if (BPCLDivChartFirmId == 'AssignCaseTypeChart') {
//        $('#chart_231').css('display', 'block');
//        FillCustomCaseTypeChart(filtervalue);
//    }
//    else {
//        $('#chart_231').css('display', 'none');
//    }
//    //For Syngenta Client Custmization
//    if (SyngentaDivChartFirmId == 'AssignStateTypeChart') {
//        $('#chart_232').css('display', 'block');
//        FillCustomStateTypeChart(filtervalue);
//    }
//    else {
//        $('#chart_232').css('display', 'none');
//    }
//    closeload();
//});
/*Today task due count*/
function TaskDueTodayCount(filtervalue) {
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true, type: "POST",
        url: "/api/MatterApi/TaskDueTodayCount",
        dataType: 'json', data: formData,
        contentType: false, processData: false,
        success: function (response) {
            $("#lbltaskduecount").text(response.Data);
        },
        error: function (response) { }
    });
}

/*Count my matter*/
function MyMatterCount(filtervalue) {
    var formdata = new FormData();
    formdata.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true, type: "POST",
        url: '/api/MatterApi/MatterCount',
        dataType: 'json', data: formdata,
        contentType: false, processData: false,
        success: function (response) {
            $("#lblmattercountcount").text(response.Data);
        },
        error: function (response) { }
    });
}

/*Count myclient*/
function MyClientsCount(filtervalue) {
    var formdata = new FormData();
    formdata.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true, type: 'POST',
        url: '/api/CallApi/DashboardClientCount',
        data: formdata,
        processData: false, contentType: false,
        success: function (response) {
            $("#lblclientcount").text(response.Data);
        },
        error: function (response) { }
    });
}

/*Communication receive count*/
function CommunicationReceivedCount(filtervalue) {
    var formData = new FormData();
    formData.append("pagenum", EncodeText(1));
    formData.append("pagesize", EncodeText(1));
    formData.append("filtertype", EncodeText(""));
    formData.append("filtercreatedby", EncodeText(""));
    formData.append("caseid", EncodeText(""));
    formData.append("berieffilter", EncodeText(""));
    formData.append("searchfrom", EncodeText(""));
    formData.append("searchto", EncodeText(""));
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true, type: "POST",
        url: "/api/MatterApi/CommunicationReceivedCount",
        dataType: 'json', data: formData,
        contentType: false, processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data);
            $.each(obj, function (i, a) {
                $("#lblcommreceivedcount").text(a.totRow);
            });
        },
        error: function (response) { }
    });
}
/*Save chart setting*/
function fn_SaveChartSetting() {
    var chartids = [];
    $('.chkChartsetting:checked').each(function () {
        chartids.push($(this).val());
    });
    if (chartids.length > 3) {
        alert("Maximum three charts can be selected at a time.");
        return false;
    }
    if (chartids.length < 1) {
        alert("Please select at least one chart.");
        return false;
    }
    var formData = new FormData();
    formData.append("chartids", EncodeText(chartids));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/SaveChartSetting",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.Data);
            $("#lblcmsg").text(data.Data);
            var fcode = localStorage.getItem("FirmCode");
            var urls = "/" + fcode + "/Firm/Personaldashboard";
            window.location.href = urls;
        }
    });
}
$(document).on("click", "#linktomatterCaseStatus", function () {
    var token = $(this).attr("value");
    var type = $(this).attr("type");
    var utoken = filtervalue; //$("#filterselect").val();
    var fcode = localStorage.getItem("FirmCode");
    //window.location.href = "/" + fcode + "/Firm/CaseList?token=" + btoa(token) + "&type=" + type + "&utoken=" + utoken;
    window.location.href = "/" + fcode + "/Firm/StandardCaseList?token=" + btoa(token) + "&type=" + type + "&utoken=" + utoken;
});
/*Fill front case chart status*/
function FillCaseStatusChartFront(filtervalue) {
    var NoticeStatusarray = [];
    var NoticeStatusvaluearray = [];
    $("#bindcasechartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    var Disposed = 0;
    var NotInitiated = 0;
    var NoticeStage = 0;
    var Pending = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/CaseStatusChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    NoticeStatusarray.push(a.CaseStatus);
                    NoticeStatusvaluearray.push(a.Total);
                });
                var chart1 = safeChart("chart-area-case-2", {
                    type: 'doughnut',
                    data: {
                        labels: NoticeStatusarray,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: NoticeStatusvaluearray
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'right',
                            labels: {
                                boxWidth: 10,
                                boxHeight: 2,
                                fontSize: 11,
                                fontColor: '#333333',
                                padding: 10
                            }
                        },
                    }
                });
            }
            $.each(response1.Data, function (i, a) {
                count += 1;
                html1 += "<tr>"
                html1 += "<td><span id='linktomatterCaseStatus' title='click here to view matters'  type='status' value='" + a.Id + "'>" + a.CaseStatus + "</span></td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindcasechartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}

/*Fill front Court chart status*/
function FillCourtStatusChartFront(filtervalue) {
    var NoticeStatusarray = [];
    var NoticeStatusvaluearray = [];
    $("#bindCourtchartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    var Disposed = 0;
    var NotInitiated = 0;
    var NoticeStage = 0;
    var Pending = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/CourtStatusChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    NoticeStatusarray.push(a.CaseStatus);
                    NoticeStatusvaluearray.push(a.Total);
                });
                var chart1 = safeChart("chart-area-CourtStatus", {
                    type: 'doughnut',
                    data: {
                        labels: NoticeStatusarray,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: NoticeStatusvaluearray
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
            $.each(response1.Data, function (i, a) {
                count += 1;
                html1 += "<tr>"
                html1 += "<td><span id='linktomatterCaseStatus' title='click here to view matters'  type='Courtstatus' value='" + a.Type + "'>" + a.CaseStatus + "</span></td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindCourtchartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}
/**
 Fill division chart
 * @param {any} filtervalue
 */
function FillDivisionChart(filtervalue) {
    var NoticeStatusarray = [];
    var NoticeStatusvaluearray = [];
    $("#binddivisionchartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    var Disposed = 0;
    var NotInitiated = 0;
    var NoticeStage = 0;
    var Pending = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/DivisionChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    NoticeStatusarray.push(a.DivisionName);
                    NoticeStatusvaluearray.push(a.Total);
                });
                var chart1 = safeChart("chart-area-case-division", {
                    type: 'doughnut',
                    data: {
                        labels: NoticeStatusarray,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: NoticeStatusvaluearray
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
            $.each(response1.Data, function (i, a) {
                count += 1;
                var Tvalue = 0;
                if (a.TotalValuation != null) {
                    Tvalue = a.TotalValuation
                }
                html1 += "<tr>"
                html1 += "<td><span title='click here to view matters'  type='status' value='" + a.Id + "'>" + a.DivisionName + "</span></td>"
                html1 += "<td width='50px'><p>" + a.Total + "</p></td>"
                html1 += "<td><p>" + Tvalue + "</p></td>"
                html1 += "</tr>"
            });
            $("#binddivisionchartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}
//For BPCL Custmization
function FillCustomCaseTypeChart(filtervalue) {
    var NoticeStatusarray = [];
    var NoticeStatusvaluearray = [];
    $("#bindcucasetypechartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/CustomCaseTypeChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    NoticeStatusarray.push(a.TypeofCase);
                    NoticeStatusvaluearray.push(a.Total);
                });
                var chart1 = safeChart("chart-area-casetype", {
                    type: 'doughnut',
                    data: {
                        labels: NoticeStatusarray,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: NoticeStatusvaluearray
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
            $.each(response1.Data, function (i, a) {
                html1 += "<tr>"
                html1 += "<td><span title='click here to view matters'  type='status' value='" + a.Id + "'>" + a.TypeofCase + "</span></td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindcucasetypechartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}

//For Syngenta Client Custmization
function FillCustomStateTypeChart(filtervalue) {
    var NoticeStatusarray = [];
    var NoticeStatusvaluearray = [];
    $("#bindstatetypechartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/CustomStateTypeChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    NoticeStatusarray.push(a.States);
                    NoticeStatusvaluearray.push(a.Total);
                });
                var chart1 = safeChart("chart-area-statetype", {
                    type: 'doughnut',
                    data: {
                        labels: NoticeStatusarray,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: NoticeStatusvaluearray
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
            $.each(response1.Data, function (i, a) {
                html1 += "<tr>"
                html1 += "<td><span title='click here to view matters'  type='status' value='" + a.Id + "'>" + a.States + "</span></td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindstatetypechartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}
function FillCaseStatusChartBack(filtervalue) {
    $("#bindcasechartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    var count = 0;
}

/*Fill pending chart task*/
function FillPendingTaskChartFront(filtervalue) {
    var formData = new FormData();
    var data1 = null;
    var InProcess = 0;
    var Overdue = 0;
    var Completed = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/PendingTaskChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    if (a.TaskName == "InProcess")
                        InProcess = parseInt(a.Total);
                    if (a.TaskName == "Overdue")
                        Overdue = parseInt(a.Total);
                    if (a.TaskName == "Completed")
                        Completed = parseInt(a.Total);
                    data1 = [
                        InProcess,
                        Overdue,
                        Completed
                    ];
                });
                var chart1 = safeChart("chart-area-case-3", {
                    type: 'doughnut',
                    data: {
                        labels: ["InProcess", "Overdue", "Completed"],
                        datasets: [
                            {
                                //    new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE"],
                                data: data1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
        },
        error: function (response1) {
        }
    });
}

/*Fill pending chart back*/
function FillPendingChartBack(filtervalue) {
    $("#bindpendingtaskchartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    formData.append("filtervalue", EncodeText(filtervalue));
    var count = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/PendingTaskChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $.each(response1.Data, function (i, a) {
                count += 1;
                html1 += "<tr>"
                html1 += "<td>" + a.TaskName + "</td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "<p></td>"
                html1 += "</tr>"
            });
            $("#bindpendingtaskchartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}
/*Fill time spend chart*/
function FillTimeSpendChartFront(filtervalue) {
    var formData = new FormData();
    var data1 = null;
    var LegalResearch = 0;
    var Drafting = 0;
    var DocumentReview = 0;
    var Meeting = 0;
    var ConferenceCall = 0;
    var Appearance = 0;
    var EDiscovery = 0;
    var Email = 0;
    var Event = 0;
    var Filing = 0;
    var Reporting = 0;
    var Arbitation = 0;
    var Mediation = 0;
    var Misc = 0;
    var Others = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TimeSpendChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    if (a.TaskType == "Legal Research")
                        LegalResearch = parseInt(a.Total);
                    if (a.TaskType == "Drafting")
                        Drafting = parseInt(a.Total);
                    if (a.TaskType == "Document Review")
                        DocumentReview = parseInt(a.Total);
                    if (a.TaskType == "Meeting")
                        Meeting = parseInt(a.Total);
                    if (a.TaskType == "Conference Call")
                        ConferenceCall = parseInt(a.Total);
                    if (a.TaskType == "Court Appearance")
                        Appearance = parseInt(a.Total);
                    if (a.TaskType == "E-Discovery")
                        EDiscovery = parseInt(a.Total);
                    if (a.TaskType == "Email")
                        Email = parseInt(a.Total);
                    if (a.TaskType == "Event")
                        Event = parseInt(a.Total);
                    if (a.TaskType == "Case Filing")
                        Filing = parseInt(a.Total);
                    if (a.TaskType == "Reporting")
                        Reporting = parseInt(a.Total);
                    if (a.TaskType == "Arbitration")
                        Arbitation = parseInt(a.Total);
                    if (a.TaskType == "Mediation")
                        Mediation = parseInt(a.Total);
                    if (a.TaskType == "Misc.–Pre Litigation")
                        Misc = parseInt(a.Total);
                    if (a.TaskType == "Other")
                        Others = parseInt(a.Total);
                    data1 = [
                        LegalResearch,
                        Drafting,
                        DocumentReview,
                        Meeting,
                        ConferenceCall,
                        Appearance,
                        EDiscovery,
                        Email,
                        Event,
                        Filing,
                        Reporting,
                        Arbitation,
                        Mediation,
                        Misc,
                        Others
                    ];
                });
                var chart1 = safeChart("chart-area-case-4", {
                    type: 'doughnut',
                    data: {
                        labels: ["Legal Research", "Drafting", "Document Review", "Meeting", "Conference Call", "Court Appearance", "E-Discovery", "Email", "Event", "Case Filing", "Reporting", "Arbitration", "Mediation", "Misc.–Pre Litigation", "Other"],
                        datasets: [
                            {
                                // 
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF"],
                                data: data1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
        },
        error: function (response1) {
        }
    });
}
function FillTimeSpendChartBack(filtervalue) {
    $("#bindtimespendchartstatus").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    formData.append("filtervalue", EncodeText(filtervalue));
    var count = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TimeSpendChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $.each(response1.Data, function (i, a) {
                count += 1;
                html1 += "<tr>"
                html1 += "<td>" + a.TaskType + "</td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindtimespendchartstatus").append(html1);
        },
        error: function (response1) {
        }
    });
}
/*Fill front matter chart type*/
function FillMatterTypeChartFront(filtervalue) {
    $("#bindmattertypechart").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    var Litigation = 0;
    var Advisory = 0;
    var DisputeResolution = 0;
    var Transaction = 0;
    var Others = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/MattertypeChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    if (a.MatterType == "Litigation")
                        Litigation = parseInt(a.Total);
                    if (a.MatterType == "Advisory")
                        Advisory = parseInt(a.Total);
                    if (a.MatterType == "Dispute Resolution")
                        DisputeResolution = parseInt(a.Total);
                    if (a.MatterType == "Transaction")
                        Transaction = parseInt(a.Total);
                    if (a.MatterType == "Others")
                        Others = parseInt(a.Total);
                    data1 = [
                        Litigation,
                        Advisory,
                        DisputeResolution,
                        Transaction,
                        Others
                    ];
                });
                var chart1 = safeChart("matter-type-chart-area", {
                    type: 'doughnut',
                    data: {
                        labels: ["Litigation", "Advisory", "Dispute Resolution", "Transaction", "Others"],
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"],
                                responsive: false,
                                maintainAspectRatio: true,
                                data: data1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'right',
                            labels: {
                                boxWidth: 10,
                                boxHeight: 2,
                                fontSize: 11,
                                fontColor: '#333333',
                                padding: 10,
                            }
                        },
                    }
                });
                $.each(response1.Data, function (i, a) {
                    count += 1;
                    html1 += "<tr>"
                    html1 += "<td><span id='linktomatterCaseStatus' title='click here to view matters'  type='type' value='" + a.MatterType + "'>" + a.MatterType + "</span></td>"
                    html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                    html1 += "</tr>"
                });
                $("#bindmattertypechart").append(html1);
            }
        },
        error: function (response1) {
        }
    });
}
function FillMatterTypeChartBack(filtervalue) {
    $("#bindmattertypechart").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    formData.append("filtervalue", EncodeText(filtervalue));
    var count = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/MattertypeChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $.each(response1.Data, function (i, a) {
                count += 1;
                html1 += "<tr>"
                html1 += "<td>" + a.MatterType + "</td>"
                html1 += "<td><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindmattertypechart").append(html1);
        },
        error: function (response1) {
        }
    });
}

/*Fill chart subject type*/
function FillSubjectTypeChartFront(filtervalue) {
    $("#bindSubjectypechart").html("");
    var html1 = "";
    var CaseSubjectarray = [];
    var CaseSubjectvaluearray = [];
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    var data1 = null;
    $("#List").empty();
    console.log("stssab" + new Date().toLocaleTimeString());
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/SubjecttypeChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            console.log("stssabend" + new Date().toLocaleTimeString());
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    CaseSubjectarray.push(a.SubjectType);
                    CaseSubjectvaluearray.push(a.Total);
                });
                var chart1 = safeChart("subject-type-chart-area", {
                    type: 'doughnut',
                    data: {
                        labels: CaseSubjectarray,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: CaseSubjectvaluearray
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
                $.each(response1.Data, function (i, a) {
                    count += 1;
                    html1 += "<tr>"
                    html1 += "<td><span id='linktomatterCaseStatus' title='click here to view matters'  type='subject' value='" + a.SubjectType + "'>" + a.SubjectType + "</span></td>"
                    html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                    html1 += "</tr>"
                });
                $("#bindSubjectypechart").html(html1);
            }
        },
        error: function (response1) {
        }
    });
}
/*Fill back subject chart type*/
function FillSubjectTypeChartBack(filtervalue) {
    $("#bindSubjectypechart").html("");
    var html1 = "";
    var formData = new FormData();
    var data1 = null;
    formData.append("filtervalue", EncodeText(filtervalue));
    var count = 0;
}

/*Fill front invoice chart*/
function FillInvoiceChartFront(filtervalue) {
    var TotalAmt = 0;
    var TotalPaid = 0;
    var Outstanding = 0;
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    var data1 = null;
    $("#List").empty();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/InvoiceChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    if (a.Invoicetype == "TotalAmount")
                        TotalAmt = parseInt(a.Total);
                    if (a.Invoicetype == "TotalPaid")
                        TotalPaid = parseInt(a.Total);
                    if (a.Invoicetype == "Outstanding") {
                        if (a.Total < 0) {
                            Outstanding = 0;
                        }
                        else {
                            Outstanding = a.Total;
                        }
                    }
                    data1 = [
                        TotalAmt,
                        TotalPaid,
                        Outstanding
                    ];
                });
                var chart1 = safeChart("invioce-chart-area", {
                    type: 'doughnut',
                    position: "top",
                    data: {
                        labels: ["Total", "Collections", "Outstanding"],
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE"],
                                //data: [2478, 5267, 734, 784, 433]
                                data: data1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
            }
        },
        error: function (response1) {
        }
    });
}

/*Fill back invoice chart*/
function FillInvoiceChartBack(filtervalue) {
    $("#bindInvoicechart").html("");
    var html1 = "";
    var formData = new FormData();
    var count = 0;
    formData.append("filtervalue", EncodeText(filtervalue));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/InvoiceChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var Outstanding = 0;
            $.each(response1.Data, function (i, a) {
                if (a.Invoicetype == "Outstanding") {
                    if (a.Total < 0) {
                        a.Total = 0;
                    }
                }
                count += 1;
                html1 += "<tr>"
                html1 += "<td>" + a.Invoicetype + "</td>"
                html1 += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                html1 += "</tr>"
            });
            $("#bindInvoicechart").html(html1);
        },
        error: function (response1) {
        }
    });
}

/*Fill notice matter chart type*/
function FillNoticeMatterChartFrontBack(filtervalue) {
    var TotalAmt = 0;
    var TotalPaid = 0;
    var Outstanding = 0;
    var html1 = "";
    var formData = new FormData();
    formData.append("filtervalue", EncodeText(filtervalue));
    var data1 = null;
    $("#List").empty();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/MatterNoticeChartCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    TotalMatter = parseInt(a.TotalMatter);
                    LinkedNotice = parseInt(a.LinkNoticeToMatter);
                    data1 = [
                        TotalMatter,
                        LinkedNotice,
                    ];
                    count += 1;
                    html1 += "<tr>"
                    html1 += "<td>Total matter</td>"
                    html1 += "<td><p>" + TotalMatter + "</p></td>"
                    html1 += "</tr>"
                    html1 += "<tr>"
                    html1 += "<td>Linked Notice to matter</td>"
                    html1 += "<td><p>" + LinkedNotice + "</p></td>"
                    html1 += "</tr>"
                });
                $("#bindpendingnoticechartstatus").html(html1);
                var chart1 = safeChart("chart-area-notice", {
                    type: 'doughnut',
                    position: "top",
                    data: {
                        labels: ["Total matter", "Linked Notice to matter"],
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#4D95DD", "#A0D930", "#DEDEDE"],
                                //data: [2478, 5267, 734, 784, 433]
                                data: data1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                        onClick: function (e) {
                            try {
                                var activePoints = chart1.getElementsAtEvent(e);
                                var selectedIndex = activePoints[0]._index;
                                if (selectedIndex == 0) {
                                    //redirect to matterlist
                                    var fcode33 = localStorage.getItem("FirmCode");
                                    window.location = encodeURI("/" + fcode33 + "/firm/StandardCaseList");
                                }
                                else {
                                    //redirect to noticelink matterlist
                                    var fcode33 = localStorage.getItem("FirmCode");
                                    window.location = encodeURI("/" + fcode33 + "/firm/NoticeLinkCaseList");
                                }
                            }
                            catch
                            {
                            }
                        },
                    }
                });
            }
        },
        error: function (response1) {
        }
    });
}

//For Adding New garph on Court type
function GetDataByNoticeStatus() {
    var statusname = [];
    var statuscount = [];
    var html = '';
    var superemecourt = 0;
    var higcourt = 0;
    var distirictcourt = 0;
    var tribunal = 0;
    var addcout = 0;
    var formdata = new FormData();
    $.ajax({
        type: "POST",
        url: "/CW/MykaseCourtCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        async: false,
        success: function (response) {
            $(response).each(function (key, value) {
                if (value.Court == "" || value.Court == null || value.Court == "null") {
                }
                else {
                    statusname.push(value.Court);
                    statuscount.push(value.Totals);
                    html += '<tr><td>' + value.Court + '</td><td width="50px" align="right"><p>' + value.Totals + '</p></td></tr>'
                }
            });
            $("#tblbodyCourtType").html(html)
            // closeload();
        },
        failure: function (response) {
            alert("Something Went Wrong");
            // closeload();
        }
    });
    var chartDiv = $("#chart-area-courttype");
    var myChart = new Chart(chartDiv, {
        type: 'doughnut',
        data: {
            //labels: ["Pending", "InProgress", "OnHold", "Complete", "Cancelled"],
            labels: statusname,
            datasets: [
                {
                    data: statuscount,
                    // data: [21, 39, 10, 14, 16],
                    backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"]
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                responsive: true,
            },
            legend: {
                display: false,
                position: 'bottom',
                align: "right",
                labels: {
                    boxWidth: 10,
                    boxHeight: 3,
                    fontSize: 12,
                    fontColor: '#333333',
                    padding: 0
                }
            },
        }
    });
}
//For Adding New Graph for department wise matter
function GetMatterByDepartmentFront(filtervalue) {
    var statusname = [];
    var statuscount = [];
    var html = '';
    var formdata = new FormData();
    formdata.append("filtervalue", EncodeText(filtervalue));

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/DepartmentWiseMatterCount",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            // console.log("stssabend" + new Date().toLocaleTimeString());
            if (response1.Data == "") {
            }
            else {
                $.each(response1.Data, function (i, a) {
                    statusname.push(a.Department);
                    statuscount.push(a.Total);
                });
                var chart1 = safeChart("chart-area-departmentwise", {
                    type: 'doughnut',
                    data: {
                        labels: statusname,
                        datasets: [
                            {
                                // new
                                backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F", "#4D95DD", "#D3EDFB", "#8BD00B", "#707070", "#B5B1B1", "#D3EDFB", "#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
                                    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
                                    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
                                    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
                                    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
                                    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
                                    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
                                    "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
                                    "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
                                    "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"],
                                data: statuscount
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false,
                            responsive: true,
                            text: ''
                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            align: "right",
                            labels: {
                                boxWidth: 10,
                                boxHeight: 3,
                                fontSize: 12,
                                fontColor: '#333333',
                                padding: 0
                            }
                        },
                    }
                });
                $.each(response1.Data, function (i, a) {
                    count += 1;
                    html += "<tr>"
                    html += "<td>" + a.Department + "</td>"
                    html += "<td width='50px' align='right'><p>" + a.Total + "</p></td>"
                    html += "</tr>"
                });
                $("#tblbodydepartment").html(html);
            }
        },
        error: function (response1) {
        }
    });
}
/*Load activity details*/
//function loadactivity(pageindex) {
//    try {
//        $("#loadactivitydata").html("");
//        var datefrom = $("#daterecentfrom").val();
//        var dateto = $("#daterecentto").val();
//        var formdata = new FormData();
//        formdata.append("pagenum", EncodeText(pageindex));
//        formdata.append("pagesize", EncodeText(pagesize));
//        formdata.append("datefrom", EncodeText(datefrom));
//        formdata.append("dateto", EncodeText(dateto));
//        var qty1 = 0;
//        var html = '';
//        var ajaxTime1 = new Date().getTime();
//        $.ajax({
//            async: true,
//            url: "/api/CallApi/BindRecentActivity",
//            data: formdata,
//            processData: false,
//            contentType: false,
//            type: 'POST',
//            success: function (response) {
//                if (response.Data != "[]") {
//                }
//                else {
//                    $("#loadactivityfooter").html("No result found !");
//                    closeload();
//                }
//                var totalTime1 = new Date().getTime() - ajaxTime1;
//                if (response.Data == "[]") {
//                    $("#loadactivityfooter").html("No result found !");
//                    var tfot = '';
//                    tfot += '<div class="row settingpanel" style="margin: 14px 0 0 0;">'
//                    tfot += '<div class="col-md-8"><div style="float:left;">Page Number <b style="font-size:12px;">0</b> &nbsp;of <b style="font-size:12px;"><span id="sotopage">0</span> Pages</b>'
//                    tfot += '&nbsp;|&nbsp;<b style="font-size:12px;">Total 0 Entries</b>'
//                    tfot += '</div>'
//                    tfot += '<div style="float:left; padding: 4px 0 0 10px;">'
//                    tfot += '</div></div>'
//                    $("#footeractivitydata").html("");
//                    $("#footeractivitydata").html(tfot);
//                }
//                var obj = JSON.parse(response.Data);
//                var length = obj.length;
//                $("#footeractivitydata table").remove();
//                $("#loadactivitydata ul").remove();
//                $.each(obj, function (index, a) {
//                    if (index === 0) {
//                        firstvalue = a.rownum;
//                    }
//                    if (index === (length - 1)) {
//                        var pnext = pageindex;
//                        var pprev = pageindex;
//                        var pageno = pageindex;
//                        var totdata = a.totRow;
//                        var totpage = 0;
//                        if (a.totRow > 0) {
//                            pnext = parseInt(pnext) + 1;
//                            if (pnext == 0) pnext = 1;
//                            pprev = parseInt(pageno) - 1;
//                            if (pprev == 0) pprev = 1;
//                            totpage = parseInt(totdata) / parseInt(pagesize);
//                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
//                                totpage = parseInt(totpage) + 1;
//                            }
//                            $("#pagnumvalue").attr("max", totpage);
//                        }
//                        var tfot = '';
//                        tfot += '<div class="row settingpanel" style="margin: 14px 0 0 0;">'
//                        tfot += '<div class="col-md-8"><div style="float:left;">Page Number <b style="font-size:12px;">' + pageindex + '</b> &nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
//                        tfot += '&nbsp;|&nbsp;<b style="font-size:12px;">Total ' + a.totRow + ' Entries</b>'
//                        tfot += '&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  class="footerInput"><button type="button" id="getdatabypagenum" style="margin-left:10px;padding:3px 5px !important;" class="gobtn">Go</button>'
//                        tfot += '</div>'
//                        tfot += '<div style="float:left; padding: 4px 0 0 10px;">'
//                        if (a.totRow <= length) {
//                        }
//                        else if (pageno == 1) {
//                        }
//                        else if (pageno == totpage) {
//                            tfot += '<a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '" ><img src="/newassets/images/arrow_left.png" "></a>'
//                        }
//                        else {
//                            tfot += '<a id="paginate"   title="Previous Page" href="javascript:void()" index="' + pprev + '" ><img src="/newassets/images/arrow_left.png""></a>'
//                        }
//                        if (pageno < totpage) {
//                            tfot += '<a id="paginate"  title="Next Page"  href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="margin-left:5px;"></a>'
//                        }
//                        tfot += '</div></div>'
//                        $("#footeractivitydata").html("");
//                        $("#footeractivitydata").html(tfot);
//                        // closeload();
//                        $("#loadactivityfooter").html('');
//                    }
//                    qty1 = qty1 + 1;
//                    html += '<ul class="todo-list" style="list-style-type:none;">'
//                    var linkpage = "";
//                    var recentactivitycss = "";
//                    var recenttext = "";
//                    var recentlabel = "";
//                    var recentlabelmode = "";
//                    recentlabelmode = a.notification;
//                    if (recentlabelmode == "" || recentlabelmode == null || recentlabelmode == "null") {
//                        html += '&nbsp;'
//                    }
//                    else {
//                        if (recentlabelmode.length > 40) {
//                            html += '<li class="recent" > <span class="text">'
//                            html += '<span class="comment more" style="">' + recentlabelmode.substring(0, 40) + '</span>'
//                            html += '<span data-toggle="collapse" data-target="#dtn' + qty1 + '" style="color:#069;cursor:pointer"> more</span></br>'
//                            html += ' <div id="dtn' + qty1 + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
//                            html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn' + qty1 + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
//                            html += '' + recentlabelmode + ''
//                            html += '</div>'
//                            html += '</span> <span> ' + formatDatetoIST(a.date_time) + ' ' + a.date_time.substring(11, 19) + '</span></li>'
//                        }
//                        else {
//                            html += '<li class="recent" > <span class="text">'
//                            html += '<span class="comment more" style="">' + recentlabelmode + '</span> <span> ' + formatDatetoIST(a.date_time) + ' ' + a.date_time.substring(11, 19) + '</span>'
//                            html += '</span></li>'
//                        }
//                    }
//                    // html += '<li class="recent"><span class="text">' + recentlabelmode + '</span><span> ' + formatDatetoIST(a.date_time) +' '+ a.date_time.substring(11,19)+'</span></li>'
//                    html += '</ul>'
//                });
//                $("#loadactivitydata").hide().append(html).fadeIn('fast');
//                // closeload();
//                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
//                    $('input[type = "date"]').removeAttr("onkeydown");
//                    $('input[type = "date"]').removeAttr("onkeypress");
//                }
//                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
//                $('input[type = "date"]').blur(function () {
//                    var dateString = $(this).val();
//                    if (dateString != "") {
//                        var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
//                        var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
//                        var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
//                        //Check whether valid dd/MM/yyyy Date Format.
//                        if (regex.test(dateString)) {
//                            var parts = dateString.split("-");
//                            var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
//                            if (parseInt(parts[0]) < 1900) {
//                                $(this).focus();
//                                $(this).val("");
//                                alert("Please enter a valid date.");
//                                return false;
//                            }
//                            if (parseInt(parts[0]) > 3000) {
//                                $(this).focus();
//                                $(this).val("");
//                                alert("Please enter a valid date.");
//                                return false;
//                            }
//                            if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
//                                $(this).focus();
//                                $(this).val("");
//                                alert("Please enter a valid date.");
//                                return false;
//                            }
//                            if (parseInt(parts[2]) == 00) {
//                                $(this).focus();
//                                $(this).val("");
//                                alert("Please enter a valid date.");
//                                return false;
//                            }
//                            var dtCurrent = new Date();
//                            return true;
//                        } else {
//                            $(this).focus();
//                            $(this).val("");
//                            alert("Please enter a valid date.");
//                            return false;
//                        }
//                    }
//                });
//            },
//            error: function (response) {
//                alert(response.responseText);
//                closeload();
//            }
//        });
//    } catch {
//        closeload();
//    }
//}
//$(document).on('click', '#searchrecentdatas', function () {
//    loadactivity(1);
//    closeload();
//});

/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}

//Graph Front and Back 
$(document).on('click', '#Chart_51front', function () {
    $("#id_mattertypeback").show();
    return false;
});
$(document).on('click', '#Chart_51back', function () {
    $("#id_mattertypeback").hide();
    return false;
});
$(document).on('click', '#chart_2311front', function () {
    $("#id_courtstatusback").show();
    return false;
});

$(document).on('click', '#chart_2311back', function () {
    $("#id_courtstatusback").hide();
    return false;
});

$(document).on('click', '#chart_52front', function () {
    $("#id_internalssback").show();
    return false;
});

$(document).on('click', '#Chart_52back', function () {
    $("#id_internalssback").hide();
    return false;
});
$(document).on('click', '#chart_53front', function () {
    $("#id_tasksback").show();
    return false;
});

$(document).on('click', '#chart_53back', function () {
    $("#id_tasksback").hide();
    return false;
});

$(document).on('click', '#chart_54front', function () {
    $("#id_timeanlasisback").show();
    return false;
});

$(document).on('click', '#chart_54back', function () {
    $("#id_timeanlasisback").hide();
    return false;
});

$(document).on('click', '#chart_55front', function () {
    $("#id_subjecttypeback").show();
    return false;
});

$(document).on('click', '#chart_55back', function () {
    $("#id_subjecttypeback").hide();
    return false;
});

$(document).on('click', '#chart_55front', function () {
    $("#id_subjecttypeback").show();
    return false;
});

$(document).on('click', '#chart_55back', function () {
    $("#id_subjecttypeback").hide();
    return false;
});

$(document).on('click', '#chart_56front', function () {
    $("#id_invoiceback").show();
    return false;
});

$(document).on('click', '#chart_56back', function () {
    $("#id_invoiceback").hide();
    return false;
});

$(document).on('click', '#chart_155front', function () {
    $("#id_noticematterback").show();
    return false;
});

$(document).on('click', '#chart_155back', function () {
    $("#id_noticematterback").hide();
    return false;
});

$(document).on('click', '#chart_227front', function () {
    $("#id_courtwisecaseback").show();
    return false;
});

$(document).on('click', '#chart_227back', function () {
    $("#id_courtwisecaseback").hide();
    return false;
});

$(document).on('click', '#chart_228front', function () {
    $("#id_departmentwiseback").show();
    return false;
});

$(document).on('click', '#chart_228back', function () {
    $("#id_departmentwiseback").hide();
    return false;
});

//$(document).on('click', '#chart_228front', function () {
//    $("#id_departmentwiseback").show();
//    return false;
//});

//$(document).on('click', '#chart_228back', function () {
//    $("#id_departmentwiseback").hide();
//    return false;
//});

$(document).on('click', '#chart_230front', function () {
    $("#id_divisionback").show();
    return false;
});

$(document).on('click', '#chart_230back', function () {
    $("#id_divisionback").hide();
    return false;
});

$(document).on('click', '#chart_231front', function () {
    $("#id_casetypesback").show();
    return false;
});

$(document).on('click', '#chart_231back', function () {
    $("#id_casetypesback").hide();
    return false;
});

$(document).on('click', '#chart_232front', function () {
    $("#id_Statesback").show();
    return false;
});

$(document).on('click', '#chart_232back', function () {
    $("#id_Statesback").hide();
    return false;
});

$("#dashboardcostomize").click(function () {
    $('#myModalDashboardCustomized').modal({ show: true });
    //bindCFHistoryversion();
});

function safeChart(canvasId, config) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    if (canvas.chart) canvas.chart.destroy();
    return new Chart(canvas, config);
}

/* ============================================================
   Consolidated Dashboard — 1 API replaces 4 counts + charts
   ApiActionFilter wraps response in { Data: {...} }
   ============================================================ */
function LoadDashboardSummary(filtervalue) {
    openload();
    var fd = new FormData();
    fd.append("filtervalue", "0");
    $.ajax({
        type: "POST", url: "/api/MatterApi/PersonalDashboardSummary",
        data: fd, contentType: false, processData: false,
        success: function (r) {
            if (!r || !r.Data) { closeload(); return; }
            var d = r.Data;

            // Count cards
            $("#lblmattercountcount").text(d.MatterCount || 0);
            $("#lblarchivecount").text(d.ArchivedMatterCount || 0);
            $("#lblclientcount").text(d.ClientCount || 0);
            $("#lbltaskduecount").text(d.TaskDueTodayCount || 0);

            // Charts — render from consolidated data
            C51(d.MatterTypeChart);
            C52(d.CaseStatusChart);
            C231(d.CourtStatusChart);
            C53(d.PendingTaskChart);
            C54(d.TimeSpendChart);
            C55(d.SubjectTypeChart);
            C56(d.InvoiceChart);
            C155(d.NoticeMatterChart);

            closeload();
        },
        error: function () { closeload(); }
    });
}

// Chart renderers (short names to avoid conflict with original functions)
function C51(a) { if (!a || !a.length) return; var l=[],v=[]; $.each(a,function(i,x){l.push(x.Label);v.push(x.Total)}); safeChart("matter-type-chart-area",{type:"doughnut",data:{labels:l,datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE","#9FD8FF","#DDF49F"],data:v}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"right",labels:{boxWidth:10,boxHeight:2,fontSize:11,fontColor:"#333333",padding:10}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td><span id='linktomatterCaseStatus' title='click here to view matters' type='type' value='"+x.Label+"'>"+x.Label+"</span></td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindmattertypechart").html(h); }
function C52(a) { if (!a || !a.length) return; var l=[],v=[]; $.each(a,function(i,x){l.push(x.CaseStatus);v.push(x.Total)}); safeChart("chart-area-case-2",{type:"doughnut",data:{labels:l,datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE","#9FD8FF","#DDF49F","#4D95DD","#D3EDFB","#8BD00B","#707070","#B5B1B1"],data:v}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"right",labels:{boxWidth:10,boxHeight:2,fontSize:11,fontColor:"#333333",padding:10}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td><span id='linktomatterCaseStatus' title='click here to view matters' type='status' value='"+x.Id+"'>"+x.CaseStatus+"</span></td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindcasechartstatus").html(h); }
function C231(a) { if (!a || !a.length) return; var l=[],v=[]; $.each(a,function(i,x){l.push(x.CaseStatus);v.push(x.Total)}); safeChart("chart-area-CourtStatus",{type:"doughnut",data:{labels:l,datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE","#9FD8FF","#DDF49F","#4D95DD","#D3EDFB","#8BD00B","#707070","#B5B1B1"],data:v}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"bottom",align:"right",labels:{boxWidth:10,boxHeight:3,fontSize:12,fontColor:"#333333",padding:0}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td><span id='linktomatterCaseStatus' title='click here to view matters' type='Courtstatus' value='"+x.Type+"'>"+x.CaseStatus+"</span></td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindCourtchartstatus").html(h); }
function C53(a) { if (!a || !a.length) return; var ip=0,od=0,cp=0; $.each(a,function(i,x){if(x.Label==="InProcess")ip=x.Total;if(x.Label==="Overdue")od=x.Total;if(x.Label==="Completed")cp=x.Total}); safeChart("chart-area-case-3",{type:"doughnut",data:{labels:["InProcess","Overdue","Completed"],datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE"],data:[ip,od,cp]}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"bottom",align:"right",labels:{boxWidth:10,boxHeight:3,fontSize:12,fontColor:"#333333",padding:0}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td>"+x.Label+"</td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindpendingtaskchartstatus").html(h); }
function C54(a) { if (!a || !a.length) return; var l=[],v=[]; $.each(a,function(i,x){l.push(x.Label);v.push(x.Total)}); safeChart("chart-area-case-4",{type:"doughnut",data:{labels:l,datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE","#9FD8FF","#DDF49F","#4D95DD","#D3EDFB","#8BD00B","#707070","#B5B1B1","#D3EDFB","#A0D930","#4D95DD","#DEDEDE","#9FD8FF"],data:v}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"bottom",align:"right",labels:{boxWidth:10,boxHeight:3,fontSize:12,fontColor:"#333333",padding:0}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td>"+x.Label+"</td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindtimespendchartstatus").html(h); }
function C55(a) { if (!a || !a.length) return; var l=[],v=[]; $.each(a,function(i,x){l.push(x.Label);v.push(x.Total)}); safeChart("subject-type-chart-area",{type:"doughnut",data:{labels:l,datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE","#9FD8FF","#DDF49F","#4D95DD","#D3EDFB","#8BD00B","#707070","#B5B1B1"],data:v}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"bottom",align:"right",labels:{boxWidth:10,boxHeight:3,fontSize:12,fontColor:"#333333",padding:0}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td><span id='linktomatterCaseStatus' title='click here to view matters' type='subject' value='"+x.Label+"'>"+x.Label+"</span></td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindSubjectypechart").html(h); }
function C56(a) { if (!a || !a.length) return; var ta=0,tp=0,os=0; $.each(a,function(i,x){if(x.Invoicetype==="TotalAmount")ta=x.Total;if(x.Invoicetype==="TotalPaid")tp=x.Total;if(x.Invoicetype==="Outstanding")os=x.Total<0?0:x.Total}); safeChart("invioce-chart-area",{type:"doughnut",position:"top",data:{labels:["Total","Collections","Outstanding"],datasets:[{backgroundColor:["#A0D930","#4D95DD","#DEDEDE"],data:[ta,tp,os]}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"bottom",align:"right",labels:{boxWidth:10,boxHeight:3,fontSize:12,fontColor:"#333333",padding:0}}}}); var h=""; $.each(a,function(i,x){h+="<tr><td>"+x.Invoicetype+"</td><td width='50px' align='right'><p>"+x.Total+"</p></td></tr>"}); $("#bindInvoicechart").html(h); }
function C155(a) { if (!a) return; var tm=a.TotalMatter||0,ln=a.LinkNoticeToMatter||0; safeChart("chart-area-notice",{type:"doughnut",position:"top",data:{labels:["Total matter","Linked Notice to matter"],datasets:[{backgroundColor:["#4D95DD","#A0D930","#DEDEDE"],data:[tm,ln]}]},options:{responsive:true,maintainAspectRatio:false,legend:{display:false,position:"bottom",align:"right",labels:{boxWidth:10,boxHeight:3,fontSize:12,fontColor:"#333333",padding:0}},onClick:function(e){try{var ap=this.getElementsAtEvent(e);var idx=ap[0]._index;var fc=localStorage.getItem("FirmCode");window.location=encodeURI(idx===0?"/"+fc+"/firm/StandardCaseList":"/"+fc+"/firm/NoticeLinkCaseList")}catch(ex){}}}}); $("#bindpendingnoticechartstatus").html("<tr><td>Total matter</td><td><p>"+tm+"</p></td></tr><tr><td>Linked Notice to matter</td><td><p>"+ln+"</p></td></tr>"); }
