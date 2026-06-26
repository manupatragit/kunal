$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    var fcode = localStorage.getItem("FirmCode");
    if (dashcw == "display:unset") {
        $(".casecasedetails1").show();
    }
    else {
        $(".casecasedetails1").hide();
    }

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
    /*Get extra party infomation*/
    $(document).on("click", "#extrapartytransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/ExtraPartyInformation";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

    /*Get case transfer information*/
    $(document).on("click", "#caseinformationtransfer", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/caseinformationReport";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });

    /*New casedashboard*/
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

    /*Open excel*/
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
        var ecasefilterclient = $('#casefilterclient').val();
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseusermatter').val();
        var createdby = $('#casefilterCreatedBy').val();
        var esearchdatanotes = $('#casefilternotes').val();
        window.location = encodeURI("/firm/ExportoExcelNoticeLinkNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby + "&exportcolumn=" + selected3 + "&esearchdatanotes=" + esearchdatanotes + "&CFieldtype=" + type);
    })

    /*Export Custom field histtory in excel*/
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
    /*Open pdf file*/
    $("#opdf").click(function () {
        var esearchdata = $('#casefiltercasename').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterdate = $('#casefilterdate').val();
        var ecasefilterclient = $('#casefilterclient').val();
        var ecasefiltercourt = $('#casefiltercourt').val();
        var ecasefilterstatus = $('#casefilterstatus').val();
        var eusers = $('#filtercaseusermatter').val();
        var createdby = $('#casefilterCreatedBy').val();
        var esearchdatanotes = $('#casefilternotes').val();
        window.location = encodeURI("/firm/ExportoPDFNoticeLinkNewCases?status=true&esearchdata=" + esearchdata + "&ecasefilterdate=" + ecasefilterdate + "&ecasefiltercourt=" + ecasefiltercourt + "&ecasefilterclient=" + ecasefilterclient + "&ecasefilterstatus=" + ecasefilterstatus + "&eusers=" + eusers + "&createdby=" + createdby + "&esearchdatanotes=" + esearchdatanotes);
    })
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
    /*Get unlink case to casewatch*/
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
    });

    /*Archive single matter*/
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
                                loadcontactlist(pageindex);
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

    /*Get custom field data by page number*/
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
    var countcustomfieldCF = 0;
    var defaultcolumncount = 5;

    /*Custom field history data*/
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
                    $header += '<th class="cfmattername"> Matter Name </th>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="MatterName"  name="cfmattername" ><a href="#" class="small" data-value="option " tabIndex="-1">Matter Name</a></li>';
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        columnvalue = columnvalue + 1;
                        sort = sort + 1;
                        if (columnvalue > defaultcolumncount) {
                            checkvalue = "";
                            headerhsvalue = "display:none";
                        }
                        $header += '<th  style="' + headerhsvalue + '" class="cfClass' + q1 + '">' + val.column_name + '</th>';
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

    /*Delete single case details*/
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

    /*Delete final single case*/
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
                        formData.append("remark", remarkmark);
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
                                    loadcontactlist(pageindex);
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
                        //  alert("hi");
                        openload();
                        var formData = new FormData();
                        formData.append("typeIds", selectedID);
                        formData.append("remark", remarkmark);
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
                                    loadcontactlist(pageindex);
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
    $("#filtercaseusermatter").change(function () {
        loadflag = true;
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
    $("#casefilterstatus").change(function () {
        loadflag = true;
        loadcontactlist(1);
    });
    $("#casefilterCreatedBy").change(function () {
        loadflag = true;
        loadcontactlist(1);
    });
    var chksflag = true;
    $("#clearnewsearchcase").click(function () {
        $("#casefiltercasename").val("");
        $("#clearnewsearchcase").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    })
    $("#clearnewsearchnotes").click(function () {
        $("#casefilternotes").val("");
        $("#clearnewsearchnotes").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
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
        loadcontactlist(1);
        chksflag = true;
    });

    /*Get case filter notes on keyup*/
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
    $("#searchdatas").click(function () {
        var casefiltercasename = $("#casefiltercasename").val();
        if (casefiltercasename == "") {
            alert("Please enter the matter name.");
            $("#casefiltercasename").focus();
            return false;
        }
        $("#clearnewsearchcase").css("display", "unset")
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    });
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
    /*Clear new search company*/
    $("#clearnewsearchcompany").click(function () {
        $("#companynamefilter").val("");
        $("#clearnewsearchcompany").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    })

    /*Clear new search matter type*/
    $("#clearnewsearchmattertype").click(function () {
        $("#MatterTypefilter").val("");
        $("#clearnewsearchmattertype").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    })
    $("#clearnewsearchsubjecttype").click(function () {
        $("#SubjectTypefilter").val("");
        $("#clearnewsearchsubjecttype").css("display", "none");
        loadflag = true;
        loadcontactlist(1);
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
        loadcontactlist(1);
        chksflag = true;
    });
    //Add Matter Type filter
    $("#MatterTypefilter").change(function () {
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    });

    //Add SubjectTypefilter
    $("#SubjectTypefilter").change(function () {
        loadflag = true;
        loadcontactlist(1);
        chksflag = true;
    });
    $(document).on('keyup', '#companynamefilter', function () {
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
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }

    /*Load contact list by page number*/
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
    ploadtabledata();
    var countcustomfoeld = 0;
    /*Load custom field data*/
    function ploadtabledata() {
        var $table = '';
        var $header = '';
        var $head1 = '';
        var dt = '';
        var q1 = 2;
        var columnvalue = 0;
        var sort = 18;
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
                        columnvalue = columnvalue + 1;
                        sort = sort + 1;
                        $header += '<th  class="Class' + q1 + '">   <div class="thbg">' + val.FieldName + '</div></th>';
                        option += '<li><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                    });
                    $('#headrow').append($header);
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
            loadcontactlist(pageindex);
        });
    }

    /*Load contact list by page index*/
    function loadcontactlist(pageindex) {
        $("#bindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        formdata.append("search", $('#searchdata').val());
        formdata.append("odate", $('#casefilterdate').val());
        formdata.append("casename", $('#casefiltercasename').val());
        formdata.append("clientname", $('#casefilterclient').val());
        formdata.append("court", $('#casefiltercourt').val());
        formdata.append("cstatus", $('#casefilterstatus').val());
        formdata.append("users", $('#filtercaseusermatter').val());
        formdata.append("createdby", $('#casefilterCreatedBy').val());
        formdata.append("companyfilter", $('#companynamefilter').val());
        formdata.append("mattertypefilter", $('#MatterTypefilter').val());
        formdata.append("subjecttypefilter", $('#SubjectTypefilter').val());
        formdata.append("casefilternotes", $('#casefilternotes').val());
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/MatterApi/LoadNoticeLinkNewCaseList',
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
                        $row.append($('<td class="caseclientcontact" />').html("<span>" + (val.PrimaryContactName != null ? val.PrimaryContactName : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="MatterType" />').html("<span>" + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="casecreatedby" />').html("<span>" + (val.assignuserby != null ? val.assignuserby : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="caseteammembers" />').html("<span>" + (val.assignuserto != null ? val.assignuserto : '<span style="">&nbsp;</span>')));
                        var FinalUserCaseid = "";
                        if (val.UserCaseid == "null" || val.UserCaseid == null) {
                            FinalUserCaseid = "";
                        }
                        else {
                            FinalUserCaseid = val.UserCaseid;
                        }
                        if (FinalUserCaseid != "" && dashcw == "display:unset") {
                            var htmllnk = "";
                            htmllnk += "<a title='Court Hearing Details' class='" + btnclass + " ' id = 'transferpagecase' href = 'javascript:void()' sno = " + val.UserCaseid + " > <span class='" + fileiconcase + "' align='center'> " + usercaseid + " </span></a >";
                            htmllnk += "&nbsp;|<a class='" + btnclass + "' style='color: black;' title='Remove case for live update' id = 'unlinkcase' href = 'javascript:void()' data-id = " + val.Id + " > <span class='glyphicon glyphicon-ban-circle' align='center'> " + usercaseid + " </span></a >";
                            $row.append($('<td class="casecasedetails" />').html(htmllnk));
                        }
                        else {
                            $row.append($('<td class="casecasedetails" />').html("&nbsp;"));
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
                        //extra col
                        $row.append($('<td class="CertifiedCopyAppliedon" />').html("<span>" + (val.CertifiedCopyAppliedon != null ? formatDatetoIST(val.CertifiedCopyAppliedon) : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="CertifiedCopyReceivedon" />').html("<span>" + (val.CertifiedCopyReceivedon != null ? formatDatetoIST(val.CertifiedCopyReceivedon) : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="ValuationofSuit" />').html("<span>" + (val.ValuationofSuit != null ? val.ValuationofSuit : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="Courtfee" />').html("<span>" + (val.Courtfee != null ? val.Courtfee : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="OppositePartyCounselname" />').html("<span>" + (val.OppositePartyCounselname != null ? val.OppositePartyCounselname : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="OppositePartyCounselemail" />').html("<span>" + (val.OppositePartyCounselemail != null ? val.OppositePartyCounselemail : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="OppositePartyCounselphone" />').html("<span>" + (val.OppositePartyCounselphone != null ? val.OppositePartyCounselphone : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="CasenumberInternal" />').html("<span>" + (val.CasenumberInternal != null ? val.CasenumberInternal : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="PoliceStation" />').html("<span>" + (val.PoliceStation != null ? val.PoliceStation : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="FIRNo" />').html("<span>" + (val.FIRNo != null ? val.FIRNo : '<span style="">&nbsp;</span>')));
                        //
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
                                html3 += ' <div id="dtn' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;left:65%;">'
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
                        if (val.odelete == 1 && val.oedit == 1 && roleids == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span>&nbsp;|<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                        }
                        else if (val.oedit == 1 && val.odelete == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                        }
                        else if (val.oedit == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-edit'  style='color:black;cursor:pointer;' title='Edit Matter' name=" + val.mname + "  id='transferEditpage' href='javascript:void()' sno=" + val.Id + "></span><span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                        }
                        else if (val.odelete == 1) {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-trash' id='deletecasesingle' style='color:red;cursor:pointer;' title='Mark Matter For Deletion' is-delete=" + val.IsDelete + " id-val=" + val.Id + "></span>&nbsp;&nbsp;<span  class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                        }
                        else {
                            if (val.LimitationCount == 0) {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px;" + limitationcss + "' title='statute of limitation' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                            else {
                                $row.append($('<td />').html("<span class='glyphicon glyphicon-warning-sign' style='cursor:pointer;margin-left:5px; color:green;" + limitationcss + "' title='Period of limitation added' id-val='" + val.Id + "' id='viewlimitation'></span>&nbsp;|&nbsp;<span class='glyphicon glyphicon-floppy-save' id='ArchiveMatterSingle' style='cursor:pointer;' title='Archive Matter'  id-val=" + val.Id + "></span>&nbsp;"));
                            }
                        }
                        if (String(val.CNRCase) != "") {
                            $row.append($('<td class="linkedcase"/>').html("<a style='cursor:pointer' id='cnrcaselink' case-val='" + val.Id + "'  data-val='" + val.CNRCase + "' title='Click here to view details.' href='javascript:void()'>&nbsp;" + val.CNRCase + "</a>"));
                        }
                        else {
                            $row.append($('<td class="linkedcase"/>').html("<span>&nbsp;</span>"));
                        }
                        $row.append($('<td class="CaseType"  />').html("<span name='" + val.CaseType + "'> " + (val.CaseType != null ? val.CaseType : '<span style="visibility: hidden;">&nbsp;</span>')));
                        var html31 = '';
                        if (val.CaseDetails == "" || val.CaseDetails == null || val.CaseDetails == "null") {
                            html31 += '&nbsp;'
                        }
                        else {
                            if (val.CaseDetails.length > 60) {
                                html31 += '<span class="comment more" style="">' + val.CaseDetails.substring(0, 60) + '</span>'
                                html31 += '<span data-toggle="collapse" data-target="#dt' + qty + '" style="color:black;cursor:pointer"> more</span>'
                                html31 += ' <div id="dt' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;left:65%;">'
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
                                    $row.append($('<td class="class3"  />').html("<span>" + checkdatetimecustom(val.col1)));
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
                                    $row.append($('<td class="class4"  />').html("<span>" + checkdatetimecustom(val.col2)));
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
                                    $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(val.col3)));
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
                                    $row.append($('<td class="class6"  />').html("<span>" + checkdatetimecustom(val.col4)));
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
                                    $row.append($('<td class="class7"  />').html("<span>" + checkdatetimecustom(val.col5)));
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
                                    $row.append($('<td class="class8"  />').html("<span>" + checkdatetimecustom(val.col6)));
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
                                    $row.append($('<td class="class9"  />').html("<span>" + checkdatetimecustom(val.col7)));
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
                                    $row.append($('<td class="class10"  />').html("<span>" + checkdatetimecustom(val.col8)));
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
                                    $row.append($('<td class="class11"  />').html("<span>" + checkdatetimecustom(val.col9)));
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
                                    $row.append($('<td class="class12"  />').html("<span>" + checkdatetimecustom(val.col10)));
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
                                    $row.append($('<td class="class13"  />').html("<span>" + checkdatetimecustom(val.col11)));
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
                                    $row.append($('<td class="class14"  />').html("<span>" + checkdatetimecustom(val.col12)));
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
                                    $row.append($('<td class="class15"  />').html("<span>" + checkdatetimecustom(val.col13)));
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
                                    $row.append($('<td class="class16"  />').html("<span>" + checkdatetimecustom(val.col14)));
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
                                    $row.append($('<td class="class17"  />').html("<span>" + checkdatetimecustom(val.col15)));
                                }
                            }
                        }
                        $("#bindcasedata").append($row);
                    });
                    loadflag = false;
                    if (dashcw == "display:unset") {
                        $(".casecasedetails").show();
                    }
                    else {
                        $(".casecasedetails").hide();
                    }
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
});