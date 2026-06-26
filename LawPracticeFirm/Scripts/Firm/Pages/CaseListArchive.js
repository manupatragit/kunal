$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    loadtotalcount();
    var fcode = localStorage.getItem("FirmCode");
    /*Client Case List*/
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });
    /* Ellipsis after 35 characters */
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
    /*CNR case list*/
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
    /*Transfer case information*/
    $(document).on("click", "#caseinformationtransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/caseinformationReport";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*New case dashboard*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Save case limitation*/
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
    /*Export new case in excel*/
    $("#oexcel").click(function () {
        var esearchdata = $('#casefiltercasename').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterclient = $('#casefilterclient').val();
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseuserarchive').val();
        var createdby = "";
        window.location = encodeURI("/firm/ExportoExcelNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby);
    })
    /*Export new cases in pdf*/
    $("#opdf").click(function () {
        var esearchdata = $('#casefiltercasename').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterclient = $('#casefilterclient').val();
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseuserarchive').val();
        var createdby = "";
        window.location = encodeURI("/firm/ExportoPDFNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby);
    })
    /*Get case details*/
    $(document).on("click", "#transferpagecase", function () {
        var transferid = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/Casedetails";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var loadflag = true;
   
    /*Delete single case*/
    $(document).on("click", "#deletecasesingle", function () {

        var caseids = $(this).attr("id-val");
        var MatterNames = $(this).attr("Idmnae");
        var mtnrName = removeHtmlTags(MatterNames);
        $("#id_Deletematternames").text(mtnrName + '?');
        $("#myModalmarkDeleteconfirmation").modal();
        $("#deletesingle_final").attr("id-val", caseids);

    });
    function removeHtmlTags(input) {
        return input.replace(/<[^>]*>/g, '').trim();
    }
    /*Delete single case*/
    $(document).on("click", "#deletesingle_final", function () {
        selectedID = [];
        var caseids = $(this).attr("id-val");
        deletemattersingle();
        function deletemattersingle() {
           // var result = confirm("Are you sure to delete Matter?");
           // if (result) {
                selectedID.push(caseids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/matterApi/RemoveCaseArchive',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                $("#myModalmarkDeleteconfirmation").modal("hide");
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Matter Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                loadflag = true;
                                loadcontactlist(pageindex);
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
    });
    /*Get single archive matter list*/
    $(document).on("click", "#Restorematter", function () {

        var caseids = $(this).attr("id-val");
        $("#myModalmarkArchiveconfirmation").modal();
        $("#archivesingle_final").attr("id-val", caseids);

    });
    /*Restore deleted matter*/
    $(document).on("click", "#archivesingle_final", function () {
        selectedID = [];
        var caseids = $(this).attr("id-val");
        deletemattersingle();
        function deletemattersingle() {
            //var result = confirm("Are you sure to Restore Matter?");
            //if (result) {
                selectedID.push(caseids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    var formData = new FormData();
                    formData.append("typeIds", selectedID);
                    formData.append("remark", "");
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
                                $("#myModalmarkArchiveconfirmation").modal("hide");
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Matter Restored Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                loadflag = true;
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                new PNotify({
                                    title: 'Warning!',
                                    text: ' You are not Authotized to Restore this Matter !',
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
                        text: ' You do not have selected any row to Restore ?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
           // }
        }
    });
    /*Remove archive cases*/
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
                                loadcontactlist(pageindex);
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
    setInterval(function () {
        var tempcases = localStorage.getItem("shortcase");
        if (tempcases != "") {
            loadflag = true;
            loadcontactlist(1);
            localStorage.setItem("shortcase", "");
        }
    }, 3000);
    $("#filtercaseuserarchive").change(function () {
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1);
    });
    $("#casecleardate").click(function () {
        $("#casefilterdate").val("");
        $("#casecleardate").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
    })
    $("#casefilterdate").change(function () {
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
    /*Case filter status*/
    $("#casefilterstatus").change(function () {
        loadflag = true;
        loadcontactlist(1);
    });
    //For Common Custom Filter
    $(document).on("click", "#idcustomcommonFilter", function () {

        $("#commonforreset")[0].reset();
        $('#myModalCustomCommonFilter').modal({ show: true });

    });
    //For Search Clear
    $(document).on("click", "#CancelCommonDashb", function () {
        $("#commonforreset")[0].reset();
        $('#myModalCustomCommonFilter').modal('hide');
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1);
    });
    var chksflag = true;
    /*Search data by case name*/
    $("#searchdatas").click(function () {
        var casefiltercasename = $("#casefiltercasename").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#casefiltercasename").focus();
            return false;
        }
        loadflag = true;
        isRenderPage = false;
        loadcontactlist(1);
        chksflag = true;
    });
    /*Search casename on key up*/
    $(document).on('keyup', '#casefiltercasename', function () {
        /* your code here */
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
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Get data by page number*/
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
    loadcontactlist(pageindex);
    /*Load contact list*/
    var totalRecordCount = 1;
    function loadcontactlist(pageindex) {
        $("#bindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        formdata.append("odate", $('#casefilterdate').val());
        formdata.append("casename", $('#casefiltercasename').val());
        formdata.append("clientname", '');
        formdata.append("court", '');
        formdata.append("cstatus", '');
        formdata.append("users", $('#filtercaseuserarchive').val());
        formdata.append("createdby", '');
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/MatterApi/LoadNewCaseListArchive',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                //console.log("loadcontact:" + totalTime)
                $("#casetfooter").html("");
                $("#tokens").html("");
                $("#DeltcaseCount").text('');
               /* $("#ArchcaseCount").text('');*/
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    //$("#pdatastatus").html("");
                    $("#pdatastatus").hide();
                    $("#delIdDetail").show();
                }
                else {
                    $("#pdatastatus").show();
                    $("#delIdDetail").hide();
                    //$("#pdatastatus").html("No result found!");
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
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            //$("#ArchcaseCount").text("(" + val.totRow + ")");
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
                        $("#DeltcaseCount").text("(" + val.totRow + ")");
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
                            deleterqst = "";
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
                        var limitationcss = "";
                        var closedate = val.cdate;
                        if (closedate == "1900-01-01T00:00:00") {
                            closedate = null;
                        }
                        $row.append($('<td class="checkbox_Id" />').html("<span><input class='checkbox' type='checkbox' id-val=" + val.Id + " /></span>"));
                        $row.append($('<td class="deletiondate" />').html("<span>" + (val.DeletionDate != null ? formatDatetoIST(val.DeletionDate) : '<span style="">&nbsp;</span>')));
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
                        $row.append($('<td class="casestartdate"  />').html("<span name='" + val.odate + "'> " + (val.odate != null ? formatDatetoIST(val.odate) : '<span style="visibility: hidden;">&nbsp;</span>')));
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
                        } else {
                            $row.append($('<td class="MatterType" />').html("<span>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        }
                        //$row.append($('<td class="MatterType" />').html("<span>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casecreatedby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="deletrequestby" />').html("<span>" + (val.DeleteRequestBy != null ? val.DeleteRequestBy : '<span style="">&nbsp;</span>')));
                        var html = "";
                        if (val.MarkRemark == "" || val.MarkRemark == null || val.MarkRemark == "null") {
                            html += '<div class="overdnote"  scope="row">&nbsp;</div>'
                        }
                        else {
                            if (val.MarkRemark.length > 60) {
                                html += '<div class="overdnote"><span class="comment more" style="">' + val.MarkRemark.substring(0, 60) + '</span>'
                                html += '<span data-toggle="collapse" data-target="#dt' + qty + '" style="color:#069;cursor:pointer"> more</span>'
                                html += ' <div id="dt' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                                html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dt' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                html += '' + val.MarkRemark + ''
                                html += '</div>'
                                html += '</div>'
                            }
                            else {
                                html += '<div class="overdnote"><span class="comment more" style="">' + val.MarkRemark + '</span></div>'
                            }
                        }
                        $row.append($('<td class="remarks" />').html(html));
                        if (val.odelete == 1 && val.oedit == 1 && roleids == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span  id='deletecasesingle' style='color:red;cursor:pointer;' Idmnae='" + val.mname+"' id-val=" + val.Id + "><img src='/newassets/img/deletecasesingle-icon.png' title='Remove Matter'></span>&nbsp;<span id='Restorematter' style='color:red;cursor:pointer;' id-val=" + val.Id + "><img src='/newassets/img/restore-icon.png' title='Restore matter'></span>"));
                            }
                            else {
                                $row.append($('<td />').html("<span  id='deletecasesingle' style='color:red;cursor:pointer;' Idmnae='" + val.mname +"' id-val=" + val.Id + "><img src='/newassets/img/deletecasesingle-icon.png' title='Remove Matter'></span>&nbsp;<span id='Restorematter' style='color:red;cursor:pointer;' id-val=" + val.Id + "><img src='/newassets/img/restore-icon.png' title='Restore matter'></span>"));
                            }
                        }
                        else if (val.oedit == 1 && val.odelete == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td/>').html("<span  id='deletecasesingle' style='color:red;cursor:pointer;' Idmnae='" + val.mname +"' title='Remove Matter' id-val=" + val.Id + "><img src='/newassets/img/deletematter.png'></span>"));
                            }
                            else {
                                $row.append($('<td />').html("<span  id='deletecasesingle' style='color:red;cursor:pointer;' Idmnae='" + val.mname +"' title='Remove Matter' id-val=" + val.Id + "><img src='/newassets/img/deletematter.png'></span>"));
                            }
                        }
                        else if (val.oedit == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-edit'  style='color:#069;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-edit'  style='color:#069;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>"));
                            }
                        }
                        else if (val.odelete == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span  id='deletecasesingle' style='color:red;cursor:pointer;' Idmnae='" + val.mname +"' title='Remove Matter' id-val=" + val.Id + "><img src='/newassets/img/deletematter.png'></span>"));
                            }
                            else {
                                $row.append($('<td />').html("<span  id='deletecasesingle' style='color:red;cursor:pointer;' Idmnae='" + val.mname +"' title='Remove Matter' id-val=" + val.Id + "><img src='/newassets/img/deletematter.png'></span>"));
                            }
                        }
                        else {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>"));
                            }
                        }
                        var ClientName = "";
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
    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    /*Remove multiple matter*/
    $("#ColumnSelectionopen").click(function () {
        multiplematter = [];
        multiplematter.length = 0;
        var caseids = $(this).attr("id-val");
        deletemattersingle2();
        function deletemattersingle2() {
            //var result = confirm("Are you sure to delete Matter?");
            //if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        var caseids = $(this).attr("id-val");
                        multiplematter.push(caseids);
                    }
                });
                if (JSON.stringify(multiplematter) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/matterApi/RemoveCaseArchive',
                        data: JSON.stringify(multiplematter),
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
                                loadcontactlist(pageindex);
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
          //  }
        }
    });
    //Re-Store All Matters
    $("#restoreMultipleMatter").click(function () {
        multiplematter = [];
        multiplematter.length = 0;
        var caseids = $(this).attr("id-val");
        deletemattersingle2();
        function deletemattersingle2() {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    var caseids = $(this).attr("id-val");
                    multiplematter.push(caseids);
                }
            });
         //   selectedID.push(caseids);
            if (JSON.stringify(multiplematter) != "[]") {
                openload();
                //var formData = new FormData();
                //formData.append("typeIds", multiplematter);
                $.ajax({
                    async: true,
                    type: "POST",
                    url: '/api/matterApi/BulkRestoreCase',
                    dataType: 'json',
                    data: JSON.stringify(multiplematter),
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            $("#myModalmarkArchiveconfirmation").modal("hide");
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Matter Restored Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            loadflag = true;
                            loadcontactlist(pageindex);
                            closeload();
                        }
                        else {
                            new PNotify({
                                title: 'Warning!',
                                text: ' You are not Authotized to Restore this Matter !',
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
                    text: ' You do not have selected any row to Restore ?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
            //$('input:checkbox.checkbox').each(function () {
            //    if ($(this).prop('checked')) {
            //        var caseids = $(this).attr("id-val");
            //        multiplematter.push(caseids);
            //    }
            //});
            //if (JSON.stringify(multiplematter) != "[]") {
            //    openload();
            //    $.ajax({
            //        async: true,
            //        url: '/api/matterApi/RemoveCaseArchive',
            //        data: JSON.stringify(multiplematter),
            //        type: 'POST',
            //        contentType: "application/json; charset=utf-8",
            //        dataType: 'json',
            //        success: function (response) {
            //            selectedID = [];
            //            if (response.Status == true) {
            //                var datas = JSON.stringify(response);
            //                new PNotify({
            //                    title: 'Success!',
            //                    text: ' Matter Removed Successfully',
            //                    type: 'success',
            //                    delay: 3000
            //                });
            //                $('#select_all').prop('checked', false);
            //                loadflag = true;
            //                loadcontactlist(pageindex);
            //                closeload();
            //            }
            //            else {
            //                new PNotify({
            //                    title: 'Warning!',
            //                    text: ' You are not Authotized to delete this Matter !',
            //                    type: 'error',
            //                    delay: 2000
            //                });
            //                closeload();
            //            }
            //        },
            //        error: function () {
            //            alert('Error!');
            //            closeload();
            //        }
            //    });
            //}
            //else {
            //    new PNotify({
            //        title: 'Warning',
            //        text: ' Please select a row to restore.',
            //        type: 'error',
            //        delay: 3000
            //    });
            //    closeload();
            //}
        }
    });
    $("#select_all").click(function () {
        $(".checkbox_Id").prop('checked', $(this).prop('checked'));
    });
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
             $("#ArchcaseCount").text("(" + TotalArchivedCases + ")");
           // $("#DeltcaseCount").text("(" + TotalDeletedCases + ")");

        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}