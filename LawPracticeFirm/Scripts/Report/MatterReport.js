var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
var loadflag = true;
var $row = "";
$(document).ready(function () {
    if (dashcw == "display:unset") {
        $(".casecasedetails1").show();
    }
    else {
        $(".casecasedetails1").hide();
    }

    /*Export excel*/
    $("#oexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="oexcelexport" pageno="' + i + '" type="excel">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    /*export matter report*/
    $(document).on("click", "#oexcelexport", function () {
        var search = $('#searchdata').val();
        var odate = $('#casefilterdate').val();
        var casename = $('#casefiltercasename').val();
        var clientname = $('#casefilterclient').val();
        var court = $('#rptmcasefiltercourt').val();
        var cstatus = $('#rptmfcasestatus').val();
        var users = $('#ddlExpUser').val();
        var mattertype = $('#rptmfmattertype').val();
        var subjecttype = $('#rptmfcasecasetype').val();
        var casetype = $('#ddlCasetype').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var IsAdded = $("#hdnisaddedval").val();
        var pagenum = $(this).attr("pageno");
        window.location = encodeURI("/Firm/ExportoExcelMatterReport?pagenum=" + pagenum + "&pagesize=500&search=" + search + "&odate=" + odate +
            "&casename=" + casename + "&clientname=" + clientname + "&court=" + court + "&cstatus=" + cstatus +
            "&users=" + users + "&mattertype=" + mattertype + "&subjecttype=" + subjecttype + "&casetype=" + casetype +
            "&datefrom=" + datefrom + "&dateto=" + dateto + "&IsAdded=" + IsAdded);
    });
/*Download in pdf*/
    $("#opdf").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="opdfexport" pageno="' + i + '" type="excel">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
/*Export in pdf*/
    $(document).on("click", "#opdfexport", function () {
        var search = $('#searchdata').val();
        var odate = $('#casefilterdate').val();
        var casename = $('#casefiltercasename').val();
        var clientname = $('#casefilterclient').val();
        var court = $('#rptmcasefiltercourt').val();
        var cstatus = $('#rptmfcasestatus').val();
        var users = $('#ddlExpUser').val();
        var mattertype = $('#rptmfmattertype').val();
        var subjecttype = $('#rptmfcasecasetype').val();
        var casetype = $('#ddlCasetype').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var IsAdded = $("#hdnisaddedval").val();
        var pagenum = $(this).attr("pageno");
        window.location = encodeURI("/Firm/ExportoPDFmatterReport?pagenum=" + pagenum + "&pagesize=500&search=" + search + "&odate=" + odate +
            "&casename=" + casename + "&clientname=" + clientname + "&court=" + court + "&cstatus=" + cstatus +
            "&users=" + users + "&mattertype=" + mattertype + "&subjecttype=" + subjecttype + "&casetype=" + casetype +
            "&datefrom=" + datefrom + "&dateto=" + dateto + "&IsAdded=" + IsAdded);
    });
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        // alert("Browser is Safari");
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
                //if (parseInt(parts[0]) == 0000 || parseInt(parts[0]) == 00 || parseInt(parts[0]) == 00) {
                if (parseInt(parts[0]) < 1900) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[0]) > 3000) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[2]) == 00) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                var dtCurrent = new Date();
                return true;
            } else {
                $(this).focus();
                $(this).val("");
                alert("Invalid Date");
                return false;
            }
        }
    });
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    loadteamleader();
    bindCommonDropdown("rptmfmattertype", "Matter_Type", "Select");
    bindCommonDropdown("rptmfcasecasetype", "Case_Type", 'Select');
    bindCommonDropdown("rptmfcasestatus", "Case_Status", 'Select');

/*Bind common Dropdown*/
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
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                });
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }

    //Get matter by page number
    $('#divcontent').off("click").on('click', '#matterpgetdatabypagenum', function () {
        pageindex = $("#matterppagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var ppageindesx = $("#matterpsotopage").text();
                if (pageindex <= parseInt(ppageindesx)) {
                    openload();
                    LoadMatterData(pageindex)
                    closeload();
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
    $(document).on('click', '#matterppaginate', function () {
        pageindex = $(this).attr("index");
        LoadMatterData(pageindex)
    });

/*New cashdashboard*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

/*Client case list*/
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });

/*Load matter*/
    $("#searchdatas").click(function () {
        if ($("#hdnisaddedval").val() == "0") {
            if ($('#ddlExpUser').val() == "") {
                alert("Select user");
                return false;
            }
        }
        LoadMatterData(1)
    })

/*Load caselist*/
    $(document).on("click", "#transferpagecase", function () {
        var transferid = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
/*Assign user team lead*/
    function loadteamleader() {
        $("#member").html("");
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
                var html3 = '';
                $("#ddlExpUser option").remove();
                $("#ddlExpUser").append("<option value='' selected>Select</option>");
                $.each(obj, function (i, a) {
                    if (a.roleid == 1) {
                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                        $("#ddlExpUser").append(option);
                        html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="#" class="dropdown-item">' + a["UserName"] + '(Admin)</a></li>'
                    }
                    else {
                        if (a.IsPartner == 1) {
                            if (a.roleid != 3) {
                                var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                                $("#ddlExpUser").append(option);
                                html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(' + a.RoleName + ')</a></li>'
                            }
                        }
                        else {
                            if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                                if (a.roleid != 3) {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                    $("#ddlExpUser").append(option);
                                    html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(User)</a></li>'
                                }
                            }
                            else {
                                if (a.roleid != 3) {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                    $("#ddlExpUser").append(option);
                                    html3 += '<li ddd><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' - (User ' + a.PartnerName + ')</a></li>'
                                }
                            }
                        }
                    }
                });
                $("#member").append(html3);
                $("#member").css("height", "100px !Important");
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
});

/*Load matter by page number*/
function LoadMatterData(pageindex) {
    $("#bindcasedata").html("");
    $("#bindcasedata").empty();
    $("#casetfooter").html("");
    var fcode = localStorage.getItem("FirmCode");
    var isadded = $("#hdnisaddedval").val();
    var formdata = new FormData();
    formdata.append("pagenum", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("search", EncodeText(""));
    formdata.append("odate", EncodeText(""));
    formdata.append("casename", EncodeText($('#casefiltercasename').val()));
    formdata.append("clientname", EncodeText(""));
    formdata.append("court", EncodeText($('#rptmcasefiltercourt').val()));
    formdata.append("cstatus", EncodeText($('#rptmfcasestatus').val()));
    formdata.append("users", EncodeText($('#ddlExpUser').val()));
    formdata.append("mattertype", EncodeText($('#rptmfmattertype').val()));
    formdata.append("subjecttype", EncodeText($('#rptmfcasecasetype').val()));
    formdata.append("casetype", EncodeText($('#ddlCasetype').val()));
    formdata.append("datefrom", EncodeText($('#datefrom').val()));
    formdata.append("dateto", EncodeText($('#dateto').val()));
    formdata.append("IsAdded", EncodeText(isadded));
    var ajaxTime = new Date().getTime();
    openload();
    var ld12 = $.ajax({
        async: true,
        url: '/api/ReportApi/LoadMatterReport',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $("#exportrecords").val(0);
            $("#casetfooter").html("");
            $("#tokens").html("");
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                var length = obj.length;
            }
            if (response.Data.length > 2) {
                $("#bindcasedata").html("");
                $("#mreportpagination").show();
            }
            else {
                $("#mreportpagination").hide();
                $("#bindcasedata").html("<tr><td align='center' colspan='7'>No result found</td></tr>");
                closeload();
                return;
            }
            var qty = 0;
            var it = 2;
            var firstvalue = 0;
            $("#bindcasedata tr").remove();
            $.each(obj, function (i, val) {
                var $row = "";
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                var totdata = val.totRow;
                var totpage = 0;
                if (i === (length - 1)) {
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
                        renderPagination(pageindex, totpage);
                    }
                    $("#exportrecords").val(val.totRow);
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
                    //$("#exportrecords").val(val.totRow);
                    //var tfot = '';
                    //tfot += '<ul>'
                    //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="matterpsotopage" style="display:none">' + totpage + '</span></li>'
                    //tfot += '<li><span>|</span></li>'
                    //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //tfot += '<li><span>|</span></li>'
                    //tfot += '<li ><input type="number" id="matterppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="matterpgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                    //if (val.totRow <= length) {
                    //}
                    //else if (pageno == 1) {
                    //}
                    //else if (pageno == totpage) {
                    //    tfot += '<li><span><a id="matterppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //}
                    //else {
                    //    tfot += '<li><span><a id="matterppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                    //}
                    //if (pageno < totpage) {
                    //    tfot += '<a  id="matterppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //}
                    //tfot += '</ul>'
                    //$("#casetfooter").html("");
                    //$("#casetfooter").html(tfot);
                }
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
                    bindcasedata
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
                $row = $('<tr class="' + deleterqst + '">');
                var closedate = val.cdate;
                if (closedate == "1900-01-01T00:00:00") {
                    closedate = null;
                }
                $row.append($('<td class="casestartdate"  />').html("<span name='" + val.odate + "'> " + (val.odate != null ? formatDatetoIST(val.odate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                $row.append($('<td class="casecasename" />').html("<a name=" + val.mname + "  id='transferpage' href='javascript:void()' sno=" + val.Id + "><span style='font-size:12px;'>" + (val.mname != null ? val.mname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                var ClientName = "";
                if (val.ClientName == "null" || val.ClientName == "'") {
                    ClientName = "";
                }
                else {
                    ClientName = val.ClientName;
                }
                $row.append($('<td class="caseclientname" />').html("<span name=" + ClientName + "  id='transferpagetocase' href='javascript:void()' data-id=" + val.matterclientid + " style='cursor:pointer;color:#069;'>" + (ClientName != null ? ClientName : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="companyname" />').html("<span id='transferpagetocase' href='javascript:void()' data-id=" + val.CompanyID + " style='cursor:pointer;color:#069;'>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="casecourtname" />').html("<span>" + (val.CourtName != null ? val.CourtName : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="casecasedetails"  />').html("<a style='color:black;'  class='" + btnclass + " ' id='transferpagecase' href='javascript:void()' sno=" + val.UserCaseid + "><span class='" + fileiconcase + "' align='center'> " + usercaseid + " </span></a>"));
                $row.append($('<td class="casestatus" />').html("<span>" + (val.cstatus != null ? val.cstatus : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="casecreatedby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="caseteammembers" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="caseclientcontact" />').html("<span>" + (val.PrimaryContactName != null ? val.PrimaryContactName : '<span style="">&nbsp;</span>')));
                //extra col
                $row.append($('<td class="MatterType" />').html("<span>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="CertifiedCopyAppliedon" />').html("<span>" + (val.CertifiedCopyAppliedon != null ? formatDatetoIST(val.CertifiedCopyAppliedon) : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="CertifiedCopyReceivedon" />').html("<span>" + (val.CertifiedCopyReceivedon != null ? formatDatetoIST(val.CertifiedCopyReceivedon) : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="ValuationofSuit" />').html("<span>" + (val.ValuationofSuit != null ? val.ValuationofSuit : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="Courtfee" />').html("<span>" + (val.Courtfee != null ? val.Courtfee : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="OppositePartyCounselname" />').html("<span>" + (val.OppositePartyCounselname != null ? val.OppositePartyCounselname : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="OppositePartyCounselemail" />').html("<span>" + (val.OppositePartyCounselemail != null ? val.OppositePartyCounselemail : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="OppositePartyCounselphone" />').html("<span>" + (val.OppositePartyCounselphone != null ? val.OppositePartyCounselphone : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="CasenumberInternal" />').html("<span>" + (val.CasenumberInternal != null ? val.CasenumberInternal : '<span style="">&nbsp;</span>')));
                $row.append($('<td class="caseclosedate"  />').html("<span name='" + closedate + "'> " + (closedate != null ? formatDatetoIST(closedate) : '<span style="visibility: hidden;">&nbsp;</span>')));
                if (String(val.CNRCase) != "") {
                    $row.append($('<td class="linkedcase"/>').html("<a style='cursor:pointer;color:black' id='cnrcaselink' case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href='javascript:void()'>&nbsp;" + val.CNRCase + "</a>"));
                }
                else {
                    $row.append($('<td class="linkedcase"/>').html("<span>&nbsp;</span>"));
                }
                $("#bindcasedata").append("");
                $("#bindcasedata").append($row);
                if (dashcw == "display:unset") {
                    $(".casecasedetails").show();
                }
                else {
                    $(".casecasedetails").hide();
                }
            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        $("#searchdatas").removeAttr("disabled");
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });
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
    LoadMatterData(setPageNo);
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
    LoadMatterData(setPageNo);
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
    LoadMatterData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

$("#divGo").click(function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    loadflag = true;
    isRenderPage = true;
    LoadMatterData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

    /*Pagination End*/

function fn_IsAddedMatter(val) {
    $("#hdnisaddedval").val(val);
}

/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}

$(document).on('change', '.chkdhide', function () {
    // your code
    var column = "." + $(this).attr("name");
    $(column).toggle();
});