$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    bindCommonDropdown("casefilterstatus", "Case_Status", 'Status');
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
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Case user profile details*/
    $("#ncdclientname").click(function () {
        var flag = $(this).attr('flag');
        if (flag == 0 || flag == undefined || flag == "") {
            var urls = "/" + fcode + "/Firm/CaseUserProfile";
            url_redirect({
                url: urls,
                method: "post",
                data: { "loginid": $("#ncdclientname").attr('data-val'), "type": "2" }
            });
        }
    });
    CaseBasicDetails();
    /*Bind basic case details*/
    function CaseBasicDetails() {
        var formData = new FormData();
        formData.append("loginid", token);
        $.ajax({
            async: true,
            url: '/api/EmployeeApi/CompnayCaseNameDetails',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    if (a.Company == 0) {
                        if (a.IsCompany == 1) {
                            if (a.CompanyName != null || a.CompanyName != "") {
                                $("#ncdclientname").text(a.CompanyName);
                            }
                            else {
                                $("#ncdclientname").text(a.Name);
                            }
                        }
                        else {
                            $("#ncdclientname").text(a.Name);
                        }
                        $("#ncdclientname").attr("data-val", token);
                        $("#ncdclientname").attr("flag", a.IsCompany);
                        $("#clientdiv").show();
                        $("#companydiv").hide();
                    }
                    else {
                        $("#ncdclientname").attr("flag", a.IsCompany);
                        $("#companydiv").show();
                        $("#clientdiv").hide();
                        $("#ncdcompanynames").text(a.Name);
                        $("#ncdcompanynames").attr("data-val", token);
                    }
                });
                //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
    }
    setInterval(function () {
        var tempcases = localStorage.getItem("shortcase");
        if (tempcases != "") {
            loadcontactlist(pageindex);
            localStorage.setItem("shortcase", "");
        }
    }, 2000);
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*View limitation*/
    $(document).on("click", "#viewlimitation", function () {
        var token = $(this).attr("id-val");
        var urls = "/" + fcode + "/Firm/SaveLimitationCase";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Transfer edit page*/
    $(document).on("click", "#transferEditpage", function () {
        var token = $(this).attr("sno");
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
    var exportfilter = false;
    $("#oexcel").click(function () {
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
        var ecasefilterclient = token;
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseuser').val();
        var esearchdatanotes = "";
        var createdby = "";
        window.location = encodeURI("/firm/ExportoExcelClientNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby + "&exportcolumn=" + selected3 + "&esearchdatanotes=" + esearchdatanotes + "&CFieldtype=" + type);
    })
    /*Export Client New Cases in pdf*/
    $("#opdf").click(function () {
        var esearchdata = $('#casefiltercasename').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterclient = token;
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseuser').val();
        window.location = encodeURI("/firm/ExportoPDFClientNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers);
    })
    /*Get transfer case details*/
    $(document).on("click", "#transferpagecase", function () {
        var transferid = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    $(document).on("click", "#deletecasesingle", function () {
        selectedID = [];
        var caseids = $(this).attr("id-val");
        deletemattersingle();
        /*Remove single case details*/
        function deletemattersingle() {
            var result = confirm("Are you sure to delete Case?");
            if (result) {
                selectedID.push(caseids);
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
                                    text: ' Case Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized to delete this Case !',
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

    /*Delete cases*/
    $("#deletecase").click(function () {
        selectedID = [];
        deletematter();
        function deletematter() {
            var result = confirm("Are you sure to delete Case?");
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
                                    text: ' Case Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized to delete this Case !',
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
                            loadcontactlist(pageindex);
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
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var loadflag = true;
    /*Filter case user*/
    $("#filtercaseuser").change(function () {
        loadflag = true;
        loadcontactlist(1);
    });

    /*Clear date*/
    $("#casecleardate").click(function () {
        $("#casefilterdate").val("");
        $("#casecleardate").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
    })
    $("#casefilterdate").change(function () {
        isRenderPage = false;
        loadflag = true;
        loadcontactlist(1);
        $("#casecleardate").css("display", "block");
    });
    $("#casefilterclient").change(function () {
        loadflag = true;
        loadcontactlist(1);
    });
    $("#casefiltercourt").change(function () {
        loadflag = true;
        loadcontactlist(1);
    });
    $("#casefilterstatus").change(function () {
        isRenderPage = false;
        loadflag = true;
        loadcontactlist(1);
    });
    var chksflag = true;
    var chksflag = true;
    $("#searchdatas").click(function () {
        $("#clearnewseach").show();
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    });
    $("#clearnewseach").click(function () {
        $("#clearnewseach").hide();
        $("#casefiltercasename").val("");
        var txtlength = $("#casefiltercasename").val().length;
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

    /*Get filter case name on keyup*/
    $(document).on('keyup', '#casefiltercasename', function () {
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
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Get client case by page number*/
    $(document).on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadflag = true;
                    loadcontactlist(ppageindex);
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
        loadcontactlist(ppageindex);
    });
    flaghide = true;
    loadcontactlist(pageindex);
    /*Get contact list*/
    function loadcontactlist(pageindex) {
        $("#bindcasedata").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        formdata.append("odate", $('#casefilterdate').val());
        formdata.append("casename", $('#casefiltercasename').val());
        formdata.append("clientname", "");
        formdata.append("court", $('#casefiltercourt').val());
        formdata.append("cstatus", $('#casefilterstatus').val());
        formdata.append("users", $('#filtercaseuser').val());
        formdata.append("token", token);
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/MatterApi/LoadClientNewCaseList',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#casetfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#pdatastatus").html("");
                }
                else {
                    $("#pdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                if (loadflag == true) {
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
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
                            //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                            //if (val.totRow <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#casetfooter").append(tfot);

                            var totdata = val.totRow;
                            var totpage = 0;
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
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }

                        }
                        qty = qty + 1;
                        $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                        it = it + 1;
                        if (val.UserCaseid != null) {
                            btnclass = " details";
                            usercaseid = "";
                            fileiconcase = '/newassets/img/casedetail-green.png';//"glyphicon glyphicon-book";
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
                        $row.append($('<td class="casecasename" />').html("<a name=" + val.mname + "  id='transferpage' href='javascript:void()' sno=" + val.Id + "><span style='font-size:12px;'>" + (val.mname != null ? val.mname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        $row.append($('<td class="caselead" />').html("<span>" + (val.TeamLead != null ? val.TeamLead : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseclientcontact" />').html("<span>" + (val.PrimaryContactName != null ? val.PrimaryContactName : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casesubject" />').html("<span>" + (val.SubjectType != null ? val.SubjectType : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casestatus" />').html("<span>" + (val.cstatus != null ? val.cstatus : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casecasedetails"  />').html("<a  class='" + btnclass + " ' id='transferpagecase' href='javascript:void()' sno=" + val.UserCaseid + "><span><img src='" + fileiconcase+"' /> " + usercaseid + " </span></a>"));
                        $row.append($('<td class="casecourtname" />').html("<span>" + (val.CourtName != null ? val.CourtName : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casecreatedby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseteammembers" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseclosedate"  />').html("<span name='" + closedate + "'> " + (closedate != null ? formatDatetoIST(closedate) : '<span style="visibility: hidden;">&nbsp;</span>')));
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
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    $(" input:checkbox:not(:checked)").each(function () {
        var column = "table ." + $(this).attr("name");
        $(column).hide();
    });
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });

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
        isRenderPage = true;
    }
    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#prev", function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        loadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#divGo", function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        isRenderPage = true;
        loadcontactlist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
/*Pagination End*/

});