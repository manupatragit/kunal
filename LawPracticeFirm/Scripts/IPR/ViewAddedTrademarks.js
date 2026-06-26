var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");

var pagindexModal = 1, pagesizeModal = 10;
var vApplNo = "";
var checkJournalAlertSub = 0;
$(document).ready(function () {
    $('#hideIPList').remove();
    $('#hideIPList').remove();
    if (IPname == "1") {
        checkJournalAlertSub = 0;
        $("#SharedTradetab").css("display", "block");
        document.getElementById('txtapplicationno').placeholder = 'Application No.';
        //$('#dynamiciprheader').text('Trademark Tracking');
        $('#dynamiciprheader').text('Trademark');
        $('#searchHeaderName').text('Trademark');
        $('#btnNameDetail').html('Add Trademark');
        //$('#spPhoneticSearch').show();
        CheckJournalAlertSub();
        IPRSearchlist(pageindex);
        GetStatusList();
    }

    if (IPname == "2") {
        document.getElementById('txtapplicationno').placeholder = 'Diary No';
        $('#dynamiciprheader').text('Copyright');
        $('#searchHeaderName').text('Copyright');
        $('#btnNameDetail').html('Add Copyright');
        $('#jAlertHistorytab').css("display", "none");
        emptyDivContentforCopyright()
        fillDivContentforCopyright();
        //bindcategoryandstatusforCopyright();
        //multiselectwithcheckbox();
        IPRSearchlistForCopyright(pageindex);
    }

    if (IPname == "3") {
        document.getElementById('txtapplicationno').placeholder = 'Application No.';
        $('#dynamiciprheader').text('Patent');
        $('#searchHeaderName').text('Patent');
        $('#btnNameDetail').html('Add Patent');
        $('#jAlertHistorytab').hide();
        emptyDivContentforPatent();
        fillDivContentforPatent();
        //bindstatusforPatent();
        IPRSearchlistForPatent(pageindex);
    }

    if (IPname == "4") {
        document.getElementById('txtapplicationno').placeholder = 'Application No.';
        $('#dynamiciprheader').text('GI');
        $('#searchHeaderName').text('GI');
        $('#btnNameDetail').html('Add GI');
        $('#jAlertHistorytab').hide();
        emptyDivContentforGI();
        fillDivContentforGI();
        IPRSearchlistForGI(pageindex);
        //GetStatusListForGI();
    }

    if (IPname == "5") {
        document.getElementById('filtertradmark').placeholder = 'Search by title';
        $('#dynamiciprheader').text('Design');
        $('#searchHeaderName').text('Design');
        $('#btnNameDetail').html('Add Design');
        $('#jAlertHistorytab').hide();
        $('#txtapplicationno').attr('placeholder', 'Design Number')
        emptyDivContentforDesign();
        fillDivContentforDesign();
        IPRSearchlistForDesign(pageindex);
        //GetStatusListForDesign();
        //GetClassListForDesign();

    }

    $('#statusforpatent').multiselect({

        columns: 1,
        texts: {
            placeholder: 'Select Languages',
            search: 'Search Languages'
        },


    });

    $('#searchstatusfordesign').multiselect({
        columns: 1,
        placeholder: 'Select Status'

    });

    document.addEventListener("dragstart", function (e) {
        if (e.target.tagName === "IMG") {
            e.preventDefault();
        }
    });

    $(document).on("change", "#searchuserdetetail", function () {
        var searchuserdetetail = $("#searchuserdetetail").val();
        if (searchuserdetetail == "3") {
            $("#usedsincefrom1").css("display", "block");
            $("#usedsinceto1").css("display", "block");
        }
        else {
            $("#usedsincefrom1").css("display", "none");
            $("#usedsinceto1").css("display", "none");
        }
    });

    /*Select User for assign trademark*/
    $('#tradeMarkAssignUserList').multiselect({
        columns: 1,
        placeholder: 'Select User For Assign',
        search: true,
        selectAll: true
    });
    /**Check journal alert subscription */
    function CheckJournalAlertSub() {
        $.ajax({
            async: false,
            url: "/api/IPRApi/CheckJournalAlertSub",
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data[0].Result == true) {
                    checkJournalAlertSub = true;
                }
                else {
                    checkJournalAlertSub = false;
                }
            },
            error: function (response) {
            }
            //End of AJAX er
        });
    }

    function GetActiveFirmUser() {
        var formdata = new FormData();
        $.ajax({
            async: true,
            url: "/api/IPRApi/GetAllActiveFirmUser",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'GET',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var html3 = '';
                $("#tradeMarkAssignUserList").html("");
                if (response != null) {
                    $.each(obj, function (key, value) {
                        $("#tradeMarkAssignUserList").append($("<option></option>").val(value.id).text(value.UserName));
                    });
                }
                else {
                }
                $("#tradeMarkAssignUserList").multiselect('reload');
            },

            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            }
            //End of AJAX er
        });
    }
    /*Start page redirection*/
    //$(document).on('click', "#searchPhonetictab", function () {
    //    window.location.href = `/${fcode}/IPR/PhoneticSearch?IP=${IPname}`;
    //})
    $(document).on('click', "#trackertab", function () {
        window.location.href = `/${fcode}/IPR/ViewAddedTrademarks?IP=${IPname}`;
    })
    $(document).on('click', "#mylisttab", function () {
        window.location.href = `/${fcode}/IPR/ViewIPRCase?IP=${IPname}`;
    })
    $(document).on('click', "#searchtab", function () {
        window.location.href = `/${fcode}/IPR/TrademarkArchive?IP=${IPname}`;
    })
    $(document).on('click', "#deletemattertab", function () {
        window.location.href = `/${fcode}/IPR/ViewDeletedTrademarks?IP=${IPname}`;
    })
    $(document).on('click', "#AddmanuallyTrade", function () {
        window.location.href = `/${fcode}/IPR/CreateIPRCase?IP=${IPname}`;
    })
    $(document).on('click', "#AddTradeAfterSearch", function () {
        window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
    })
    $(document).on('click', "#SharedTradetab", function () {
        window.location.href = `/${fcode}/IPR/ViewSharedTrademark?IP=${IPname}`;
    })
    $(document).on('click', "#jAlertHistorytab", function () {
        window.location.href = `/${fcode}/IPR/JournalAlertHistory?IP=${IPname}`;
    })
    /*End page redirection*/

    var ApplicationNo = "";
    var TradeMarkId = "";
    $(document).on('click', '#openAssignUserModel', function () {
        $("#assignUserModel").modal('show');
        ApplicationNo = $(this).attr("applicationno");
        TradeMarkId = $(this).attr("tradeid");
        GetActiveFirmUser();
    });

    $(document).on('click', "#savetrademarkuser", function () {
        var html = "";
        var assignedUser = $("#tradeMarkAssignUserList").val();
        if (assignedUser == null) {
            alert("Please select user");
            $("#tradeMarkAssignUserList").focus();
            return false;
        }
        var formdata = new FormData();
        formdata.append("tradeid", TradeMarkId);
        formdata.append("ApplicationNo", ApplicationNo);
        formdata.append("assignedUser", assignedUser);
        formdata.append("TradeIP", "1");

        $.ajax({
            async: true,
            url: "/api/IPRApi/AssignTrademarkToUser",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data == true) {
                    alert("User Added successfully");
                    $("#assignUserModel").modal('hide');
                    $("#tradeMarkAssignUserList").val("");
                    $("#tradeMarkAssignUserList").multiselect('reload');
                }
            }, //End of AJAX Success function

            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            }
            //End of AJAX er
        });
    });
});

$(document).ready(function () {

    jQuery('#searchstatus').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });

    jQuery('#searchclass').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });
    $('form[id="iprform"]').validate({
        submitHandler: function (form) {
            GetIPRSignUP("");
        }
    });
    //GetClassList();
    handleSearchClassChange('#searchclass');
    handleSearchClassChange('#searchclassforDesign');
});

$(document).on('click', '#removetrademark', function () {
    trademarkId = $(this).attr("tradeid");
    iid = $(this).attr("iid");
    //if (confirm("Are you sure you want to delete this trademark?")) {
    //    removetrademarkdatabyiid(trademarkId, IPname, iid);
    //}myModalmarkdeleteTradeconfirmation
    $("#ids_deleteTraderequesr").text("Delete trademark Request");
    $("#msgRUSure1").text("Are you sure you want to delete this trademark?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", trademarkId);
    $("#deleteTrademarkDetails").attr("tradeid-val", iid);

});

$(document).on('click', '#deleteTrademarkDetails', function () {
    var trademarkIdDet = "";
    var iidDet = "";
    trademarkIdDet = $(this).attr("id-val");
    iidDet = $(this).attr("tradeid-val");
    if (IPname == 1 || IPname == 2 || IPname == 3) {
        removetrademarkdatabyiid(trademarkIdDet, IPname, iidDet);
    } else if (IPname == 4) {
        RemoveGIMark(trademarkIdDet, iidDet, IPname)
    } else {
        RemoveDesignMark(trademarkIdDet, iidDet, IPname);
    }
});

function isnull(nullvalue) {
    if (nullvalue == null || nullvalue == undefined || nullvalue == "null") {
        nullvalue = '';
    }

    return nullvalue;
}

function convertdate(datevalue) {
    var day;
    var month;
    var year;
    var newdate = '';
    let pattern = /Used Since\s*\:\s*/i;
    var regex = new RegExp(pattern);

    var match = regex.test(datevalue);

    if (match === true) {
        datevalue = datevalue.replace(regex, '');
    }

    if (datevalue != null && datevalue != '') {
        var date = datevalue.split('/');

        if (date.length == 3) {
            day = parseInt(date[0], 10);
            month = parseInt(date[1], 10);
            year = parseInt(date[2], 10);

            newdate = new Date(year, month - 1, day);

            newdate = newdate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        if (IPname == '2') {
            newdate = new Date(datevalue);
            newdate = newdate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }

    if (newdate == undefined) {
        newdate = '';
    }
    return newdate;
}

//For Common Custom Filter
$(document).on("click", "#idcustomcommonFilter", function () {

    //$("#iprform")[0].reset();
    $('#myModalCustomCommonFilter').modal({ show: true });

    if (IPname == "1") {
        ShowAllFilters();
        GetClassList();
    }
    if (IPname == "2") {
        bindcategoryandstatusforCopyright();
        multiselectwithcheckbox();
        $('#divHide1').css('display', 'block');
        $('#divHide2').css('display', 'block');
        $('#advsearchforcopy').css('display', 'none');
        $('#btncollapseforcopy').css('display', 'block');
    }

    if (IPname == "3") {
        bindstatusforPatent();
        $('#divHide1').css('display', 'block');
        $('#divHide2').css('display', 'block');
        $('#btncollapseforpatent').css('display', 'block');
        $('#advsearchforpatent').css('display', 'none');
    }

    if (IPname == "4") {
        GetStatusListForGI();
        GetClassList();
        $('#divHide1').css('display', 'block');
        $('#divHide2').css('display', 'block');
        $('#advsearchforGI').css('display', 'none');
        $('#btncollapseforGI').css('display', 'block');
    }

    if (IPname == "5") {
        GetStatusListForDesign();
        GetClassListForDesign();
        $('#divHide1').css('display', 'block');
        $('#divHide2').css('display', 'block');
        $('#advsearchforDesign').css('display', 'none');
        $('#btncollapseforDesign').css('display', 'block');
    }
});

$(document).on('click', '#btnclear', function () {

    $('#filtertradmark').val('');
    $('#txtapplicationno').val('');
    $('#searchtype').val('');
    $('#searchclass').val('');
    $('#searchclass').multiselect('reload');
    $('#searchstatus').val('');
    $('#searchstatus').multiselect('reload');
    $('#txtdateapplicationfrom').val('');
    $('#txtdateapplicationto').val('');
    $('#txtProprietor').val('');
    $('#JurisdictionList').val('');
    //$('#bindIPRSearchData').empty();
    tblSearchstatus = "";
    isRenderPage = false;
    $('#statusDropdown').val('');
    IPRSearchlist(pageindex)
});

function removetrademarkdatabyiid(trademarkiid, ip, iid) {
    var html = "";
    isRenderPage = false;
    var ipList = ip;
    var formdata = new FormData();
    formdata.append("tradeid", trademarkiid);
    formdata.append("ip", ipList);
    formdata.append("iid", iid);
    $.ajax({
        async: true,
        url: "/api/IPRApi/RemoveMarks",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $("#myModalmarkdeleteTradeconfirmation").modal("hide");
            switch (IPname) {
                case '1':
                    //alert('Your Trade Mark has been successfully removed.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Trade Mark has been successfully removed.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlist(pageindex);
                    break;
                case '2':
                    //alert('Your Copyright has been successfully removed.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Your Copyright has been successfully removed.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlistForCopyright(pageindex);
                    break;
                case '3':
                    //alert('Your Patent has been successfully removed.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Your Patent has been successfully removed.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlistForPatent(pageindex);
                    break;
                case '4':
                    //alert('Your GI has been successfully removed.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Your GI has been successfully removed.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlistForGI(pageindex);
                    break;
                case '5':
                    //alert('Your Design has been successfully removed.');
                    new PNotify({
                        title: 'Success!',
                        text: 'Your Design has been successfully removed.',
                        type: 'success',
                        delay: 3000
                    });
                    IPRSearchlistForDesign(pageindex);
                    break;
            }
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        }
        //End of AJAX er
    });
}


$(document).on('click', '#btnsearch', function () {
    var IPList = '1';
    isRenderPage = false;
    var filtertradmark = $("#filtertradmark").val();

    if (IPList == "") {
        alert("Please select IP List");
        $("#IPList").focus();
        return false;
    }

    if (IPname == '1') {

        $('#statusDropdown').val('');
        $('#ApplicationdateTo').val('');
        $('#applfrmdate').val('');
        $("#Applicationcleardate").css("display", "none");
        tblSearchstatus = "";
        appFromDate = "";
        appToDate = "";
        tblSearchApplNo = "";
        tblSearchMark = "";
        tblSearchProp = "";
        IPRSearchlist(pageindex);
    }

    if (IPname == '2') {
        IPRSearchlistForCopyright(pageindex);
    }
});

$("#btnclear").click(function () {
    isRenderPage = false;
    $("#filtertradmark").val("");
    $("#IPList").val("");
    $("#txtapplicationno").val("");
    $("#searchclass").val("");
    $("#searchtype").val("");
    $("#searchstatus").val("");
    $("#txtdateapplicationfrom").val("");
    $("#txtdateapplicationto").val("");
    $("#searchuserdetetail").val("");
    $("#txtProprietor").val("");
    $("#JurisdictionList").val("");

});

function GetIPRSignUP(search) {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/api/IPRApi/GetIPRSignUP1",
        dataType: 'json',
        success: function (response1) {

            var length = response1.length;

            if (length > 0) {

                $.each(response1, function (i, a) {

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

//if (IPname == 1) {
//    GetClassList();
//    GetStatusList();
//    GetTypeList();
//    GetJurisdictionList();
//}

var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;

$(document).on('click', '#getdatabypagenum', function () {

    ppageindex = $("#pagnumvalue").val();

    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#sotopage").text();

            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                switch (IPname) {
                    case '1':
                        IPRSearchlist(ppageindex);
                        break;
                    case '2':
                        IPRSearchlistForCopyright(ppageindex);
                        break;

                    case '3':
                        IPRSearchlistForPatent(ppageindex);
                        break;

                    case '4':
                        IPRSearchlistForGI(ppageindex);
                        break;

                    case '5':
                        IPRSearchlistForDesign(ppageindex);
                        break;
                }

                //closeload();
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

$(document).on('click', '#paginate', function () {
    /* your code here */
    ppageindex = $(this).attr("index");
    switch (IPname) {
        case '1':
            IPRSearchlist(ppageindex);
            break;

        case '2':
            IPRSearchlistForCopyright(ppageindex);
            break;

        case '3':
            IPRSearchlistForPatent(ppageindex);
            break;

        case '4':
            IPRSearchlistForGI(ppageindex);
            break;

        case '5':
            IPRSearchlistForDesign(ppageindex);
            break;
    }
});



function convertorightFormat(input) {

    var date = new Date(input);

    var formattedate = date.toLocaleDateString('en-GB', {

        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (formattedate != '') {
        return formattedate;
    }

    else {
        return input;
    }

}

var tblSearchstatus = "";
var setTotalRecord = 1;
function IPRSearchlist(pageindex, colname, sort) {

    var imagePath = 'https://iprdocs.mykase.in/IPR_Documents_New/IPRImages/Trademark';
    openload();
    var htmls = '';
    var IPList = '1'
    var calAppNo = $("#hdnAppNo").val();
    var txtapplicationno = "";
    if (calAppNo != "") {
        txtapplicationno = calAppNo;
    }
    else {
        txtapplicationno = $("#txtapplicationno").val();
    }
    if (tblSearchApplNo != "") {
        txtapplicationno = tblSearchApplNo;
    }

    var filtertradmark = ""; //$("#filtertradmark").val();
    if (tblSearchMark != "") {
        filtertradmark = tblSearchMark
    }
    else {
        filtertradmark = $("#filtertradmark").val();
    }
    /*var txtapplicationno = $("#txtapplicationno").val();*/
    var searchclass = $("#searchclass").val();
    var searchtype = $("#searchtype").val();
    var searchstatus = $("#searchstatus").val();
    var txtdateapplicationfrom = $("#txtdateapplicationfrom").val();
    var txtdateapplicationto = $("#txtdateapplicationto").val();
    var searchuserdetetail = $("#searchuserdetetail").val();

    var txtProprietor = "";//$("#txtProprietor").val();
    if (tblSearchProp != "") {
        txtProprietor = tblSearchProp;
    }
    else {
        txtProprietor = $("#txtProprietor").val();
    }
    var JurisdictionList = $("#JurisdictionList").val();
    var usedsincefrom = $("#usedsincefrom").val();
    var usedsinceto = $("#usedsinceto").val();

    var iprcounter = $("#hdncounter").val();

    if (iprcounter == 0) {
        iprcounter = $("hdncounter").val(1);
    }

    if (searchclass == null || searchclass == 'Select Type') {
        searchclass = "";
    }
    if (searchstatus == null || searchstatus == 'Select Options') {
        searchstatus = "";
    }
    if (tblSearchstatus != "") {
        searchstatus = tblSearchstatus;
    }
    if (searchtype == undefined) {
        searchtype = "";
    }
    var formData = new FormData();

    if (txtdateapplicationfrom != '' && txtdateapplicationfrom != null) {

        txtdateapplicationfrom = convertorightFormat(txtdateapplicationfrom);
    }

    if (txtdateapplicationto != '' && txtdateapplicationto != null) {

        txtdateapplicationto = convertorightFormat(txtdateapplicationto);
    }
    if (appFromDate != "") {
        txtdateapplicationfrom = convertorightFormat(appFromDate);
    }
    if (appToDate != "") {
        txtdateapplicationto = convertorightFormat(appToDate);
    }
    if (hearingFrmDate != "" || hearingFrmDate != 'Invalid Date') {
        hearingFrmDate = convertorightFormat(hearingFrmDate);
    }
    if (hearingToDate != "" || hearingToDate != 'Invalid Date') {
        hearingToDate = convertorightFormat(hearingToDate);
    }

    formData.append("IPList", EncodeText(IPList));
    formData.append("filtertradmark", EncodeText(filtertradmark));
    formData.append("applicationno", EncodeText(txtapplicationno));
    formData.append("searchclass", EncodeText(searchclass));
    formData.append("searchtype", EncodeText(searchtype));
    formData.append("searchstatus", EncodeText(searchstatus));
    formData.append("txtdateapplicationfrom", EncodeText(txtdateapplicationfrom));
    formData.append("txtdateapplicationto", EncodeText(txtdateapplicationto));
    formData.append("searchuserdetetail", EncodeText(searchuserdetetail));
    formData.append("Proprietor", EncodeText(txtProprietor));
    formData.append("JurisdictionList", EncodeText(JurisdictionList));

    formData.append("usedsincefrom", EncodeText(usedsincefrom));
    formData.append("usedsinceto", EncodeText(usedsinceto));

    formData.append("pagenum", pageindex);

    pagesize = 10;
    formData.append("pagesize", pagesize);

    formData.append("vsort", $("#hdnsort").val());
    formData.append("colname", colname);
    formData.append("hearingFrmDate", hearingFrmDate);
    formData.append("hearingToDate", hearingToDate);
    /*formData.append("AppNo", $("#hdnAppNo").val());*/

    $.ajax(
        {
            //async: true,
            type: "POST",
            url: "/api/IPRApi/ViewAddedTradeMarkDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {
                //ShowAllSorting();
                $("#exportrecords").val(0);
                var obj = JSON.parse(response1.Data.data);
                var length = obj.length;
                var obj1 = obj;
                var qty = 0;
                var jSubscriptionDetail = $("#hdnjournalSubscriptionDetail").val();
                var roleIdD = $("#hdnRoleID").val();
                //alert(roleIdD);
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#pdatastatus").hide();
                    $("#dtNotFound").text("");
                    $.each(obj1, function (i, val) {
                        $('#tradePagination').show();
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        $("#trademarkcount").text("(" + val.TotalRecord + ")");

                        if (i === (length - 1)) {
                            $("#exportrecords").val(val.TotalRecord);

                            var totdata = val.TotalRecord;
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

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;

                        /*Start Check for detail available or not*/

                        CheckDetailAvailability(val.vApplNo);
                        var hearingDateD = "";
                        hearingDateD = convertorightFormat(val.vHearingDate);
                        if (hearingDateD != "01/01/1900") {
                            hearingDateD = convertdate(hearingDateD);
                        }
                        else {
                            hearingDateD = "";
                        }

                        //BindExamReportDocs(val.vApplNo);
                        //BindCorrespondenceDetails(val.vApplNo, "1");
                        //BindPRDetails(val.vApplNo, "1")
                        /*End Check for detail available or not*/
                        var imageP = "";
                        //imageP = '<img style="width:60%;height:30%" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available">';
                        if (val.vImgPath != "" && val.vImgPath != null) {
                            imageP = '<img class="table_img" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available">';
                        }
                        else {
                            imageP = '<img class="table_img" src="/newassets/img/NA.svg" alt="Image Description">';
                        }

                        //htmls += ' <tr><td style="text-align: center;" id="rowid">' + val.RowId + '</td><td style="text-align: center;" id="applno">' + val.vApplNo + '</td><td style="width:20px;">' + imageP + '</td><td id="wordmark">' + val.vWordMark + '</td><td id="prop">' + val.vProprietor + '</td><td>' + val.vStatus + '</td><td>' + val.vClass + '</td><td>' + convertdate(val.dApplDate) + '</td><td>' + hearingDateD + '</td><td>' + val.vUsedSince + '</td>'
                        //    + '<td><span class="glyphicon glyphicon-eye-open" id="openviewaddedtrademarks" style="cursor:pointer;" title="Information retrieved from IP registry" openDocApplNo="' + (val.vApplNo) + '" tradeid=' + val.tradeiid + ' data-toggle="modal" data-target="#viewaddedtrademarkdata"></span>'
                        //    + ' | <span class="glyphicon glyphicon-file" id="opendocumentdetails" style="cursor:pointer;" title="Document details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#trademarkDoctDetails"></span>'
                        //    + (val.vStatus === 'Opposed' ? ' | <span class="glyphicon glyphicon-list-alt" id="openopposedetails" style="cursor:pointer;" title="Oppose details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#trademarkDoctDetails"></span>' : '')
                        //    + ' | <span class="glyphicon glyphicon-trash" id="removetrademark" style=" cursor:pointer;" title="Remove Trademark Information"  tradeid=' + val.tradeiid + ' iid=' + val.iid + ' ></span>'
                        //    + ' | <span class="glyphicon glyphicon-envelope" id="addemailtrademark" style="cursor:pointer;" title="Email Tracker" tradeid=' + val.tradeiid + '></span>'
                        //    + (val.vStatus === 'Opposed' ? ' | <span data-toggle="modal" data-target="#oppositionDetails" appid=' + val.vApplNo + ' id="addopponentdetails" title="Opposition Details" style="cursor:pointer;"> <i class="bi bi-person-badge"></i></span>' : '')

                        //    + ' | <span class="glyphicon glyphicon-user"  title="Assign trademark to user" applicationno=' + val.vApplNo + ' tradeid=' + val.tradeiid + ' id="openAssignUserModel" data-toggle="modal" ></span>'

                        //    + (examDocAvail != "0" ? ' | <span class="glyphicon glyphicon-list-alt" id="openExamDetail" style="cursor:pointer;" title="Examination details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#examinationDoctDetails"></span>' : '')
                        //    + (corDocAvail != "0" ? ' | <span class="glyphicon glyphicon-folder-open" id="openCorrespDetail" style="cursor:pointer;" title="Correspondence & Notices" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#correspondenceDetails"></span>' : '')
                        //    + (prDetailAvail != "0" ? ' | <span class="" id="openPRDetail" style="cursor:pointer;" title="pr details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#PRDetails"><img src="/newassets/images/PRIcon.png" /></span>' : '')
                        //    + '</td ></tr > ';



                        htmls += '<tr>'
                        htmls += '<td style="text-align: center; display:none" id="rowid">' + val.RowId + '</td>'
                        //htmls += '<td id="prop" class="head_fix">' + val.vProprietor +'</td>'
                        htmls += "<td id='prop' ><span class='freeze-text' style='font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'>" +
                            (val.vProprietor != null ? val.vProprietor : '<span style=\"visibility: hidden;\">&nbsp;</span>') + '</td>'
                        htmls += '<td id="applno">' + val.vApplNo + '</td>'
                        htmls += '<td style="width:20px;">' + imageP + '</td>'
                        htmls += '<td id="wordmark">' + val.vWordMark + '</td>'
                        if (val.vWordMark == "" || val.vStatus == "") {
                            htmls += '<td>In Process</td>'
                        }
                        else {
                            htmls += '<td>' + val.vStatus + '</td>'
                        }
                        
                        htmls += '<td>' + val.vClass + '</td>'
                        htmls += '<td>' + convertdate(val.dApplDate) + '</td>'
                        htmls += '<td>' + hearingDateD + '</td>'
                        htmls += '<td>' + val.vUsedSince + '</td>'
                        htmls += '<td>'
                        //htmls += '<ul class="table_action"><li><div class="taskoutboxbtnicon" title="Assign trademark to user" applicationno=' + val.vApplNo + ' tradeid=' + val.tradeiid + ' id="openAssignUserModel" data-toggle="modal" ><img src="/newassets/img/user-plus-icon.png" /></div></li>'
                        htmls += '<ul class="table_action">'
                        //Journal alert
                        //if (checkJournalAlertSub == 1) {
                        if (jSubscriptionDetail == "display:unset" && roleIdD == "1") {
                            if (val.ActiveJournalAlert == "true") {
                                htmls += '<div class="setalerticon-border" title="Set journal alert" applicationno=' + val.vApplNo + ' tradeid=' + val.tradeiid + ' id="openJournalAlertModel" data-toggle="modal" style="background-color: 16A34A;" ><img style="background-color: 16A34A;" src="/newassets/img/quickbar/proactive.svg" alt="journalAlert" /></div></li>'
                            }
                            else {
                                htmls += '<div class="setalerticon-border" title="Set journal alert" applicationno=' + val.vApplNo + ' tradeid=' + val.tradeiid + ' id="openJournalAlertModel" data-toggle="modal" ><img src="/newassets/img/quickbar/proactive.svg" alt="journalAlert" /></div></li>'
                            }

                        }
                        htmls += '<li><div class="taskoutboxbtnicon" title="Assign trademark to user" applicationno=' + val.vApplNo + ' tradeid=' + val.tradeiid + ' id="openAssignUserModel" data-toggle="modal" ><img src="/newassets/img/user-plus-icon.png" /></div></li>'
                        htmls += '<li><span class="taskoutboxbtnicon" id="removetrademark" style=" cursor:pointer;" title="Remove Trademark Information"  tradeid=' + val.tradeiid + ' iid=' + val.iid + ' ><img src="/newassets/img/delete.svg" /></span></li>'

                        htmls += '<li><div class="input-group-btn">';
                        htmls += '<button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                        htmls += '<img src="/newassets/img/dots-vertical.svg" alt="action button"></button>';
                        htmls += '<ul class="dropdown-menu action-more">';
                        // IP Registry
                        //htmls += '<li><div class="action_one" id="openviewaddedtrademarks"  title="Information retrieved from IP registry" style="cursor:pointer;" openDocApplNo="' + val.vApplNo + '" tradeid="' + val.tradeiid + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                        //htmls += '<img src="/newassets/img/todo.svg">IP Registry</div></li>';
                        htmls += '<li><div class="action_one" id="openviewaddedtrademarks1" onClick="ViewTrademarkDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Information retrieved from IP registry" style="cursor:pointer;" openDocApplNo="' + val.vApplNo + '" tradeid="' + val.tradeiid + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                        htmls += '<img src="/newassets/img/todo.svg">IP Registry</div></li>';

                        // Examination Details
                        if (examDocAvail != "0") {
                            htmls += '<li><div class="action_one" id="openExamDetail" onClick="ViewExamDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Examination details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                            htmls += '<img src="/newassets/img/examination_detail.svg"> Examination Details</div></li>';
                        }

                        // PR Details
                        if (prDetailAvail != "0") {
                            htmls += '<li><div class="action_one" id="openPRDetail1" onClick="ViewPRDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="PR details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                            htmls += '<img src="/newassets/img/PRIcon.png"> PR Details</div></li>';
                        }

                        // Opposition Details
                        if (val.vStatus === 'Opposed') {
                            htmls += '<li><div class="action_one" id="openopposedetails1" onClick="ViewOppDocDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Oppose details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                            htmls += '<img src="/newassets/img/document-icon.png"> Opposition Document</div></li>';

                            htmls += '<li><div class="action_one" id="addopponentdetails1" onClick="ViewOppositionDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Opposition Details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                            htmls += '<img src="/newassets/img/opposition.png"> Opposition Details</div></li>';
                        }

                        // Correspondence Details
                        if (corDocAvail != "0") {
                            htmls += '<li><div class="action_one" id="openCorrespDetail1" onClick="ViewCorrespDetails(' + val.vApplNo + ',' + val.tradeiid + ')"  title="Correspondence & Notices" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                            htmls += '<img src="/newassets/img/Corresponding.svg"> Correspondence & Notices</div></li>';
                        }

                        // Document Details
                        htmls += '<li><div class="action_one" id="opendocumentdetails1" onClick="OpenDocumentDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Document details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                        htmls += '<img src="/newassets/img/document_details.svg"> Document Details</div></li>';

                        // Share via Email
                        htmls += '<li><div class="action_one" id="addemailtrademark" title="Share Updates Via Email" style="cursor:pointer;" tradeid="' + val.tradeiid + '">';
                        htmls += '<img src="/newassets/img/mail.svg"> Share via Email</div></li>';

                        htmls += '</ul></div></li></ul>';

                        htmls += '</td>'
                        htmls += '</tr>'

                    });
                } else {
                    $('#tradePagination').hide();
                    $("#trademarkcount").text("");
                    $("#pdatastatus").show();
                    $("#dtNotFound").html('<center>No Trademarks found</center>');
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                }

                $("#bindIPRSearchData").html("").html(htmls);
                closeload();
                //GetStatusList();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);

            }
        });
}
var checkAlertSetOrNot = "";
$(document).on("click", "#openJournalAlertModel", function () {
    $("#setJournalAlertModal").modal("show");
    var vsetAppNo = $(this).attr("applicationno");
    $("#btnSetJournalAlert").attr("id-val", vsetAppNo);

    var formData = new FormData();
    formData.append("vsetAppNo", vsetAppNo);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/IPRApi/BindSetAlertDetail",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            checkAlertSetOrNot = "";
            if (response.Data && response.Data.length > 0) {
                if (response.Data[0].ActiveJournalAlert === true) {
                    checkAlertSetOrNot = "Active";
                    $("input[name='fav_alert'][value='Yes']").prop("checked", true);
                } else {
                    checkAlertSetOrNot = "";
                    $('input[name="fav_alert"]').prop('checked', false);
                }
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });

});

$(document).on("click", "#btnSetJournalAlert", function () {
    var alertAppNo = $(this).attr("id-val");
    var rdAlertValue = $('[name="fav_alert"]:checked').val();
    if (rdAlertValue == undefined) {
        new PNotify({
            title: 'Info',
            text: 'Please select atleast one radio button',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    if (rdAlertValue == "Yes") {
        $("#ids_deleteSetJAlert").text("Set Journal Alert")
        $("#msgRUSureJAlert").text("Are you sure you want to set alert?")
    }
    else {
        $("#ids_deleteSetJAlert").text("Remove Journal Alert")
        $("#msgRUSureJAlert").text("Are you sure you want to remove alert?")
    }
    $("#btnSetAlertConfirmation").attr("alertApplNo", alertAppNo);
    $("#btnSetAlertConfirmation").attr("rdAlertValue", rdAlertValue);
    $("#myModalSetAlertConfirmation").modal("show");

});
$(document).on("click", "#btnSetAlertConfirmation", function () {
    var appNo = $(this).attr("alertApplNo");
    var rdValue = $(this).attr("rdAlertValue");
    SetAlertForJournal(appNo, rdValue);
    //isRenderPage = false;
    IPRSearchlist(setPageNo);
});

function SetAlertForJournal(alertAppNo, rdAlertValue) {

    var formData = new FormData();
    formData.append("vsetAppNo", alertAppNo);
    formData.append("rdAlertValue", rdAlertValue);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/IPRApi/UpdateSetAlertDetail",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#setJournalAlertModal").modal("hide");
            $("#myModalSetAlertConfirmation").modal("hide");
            if (rdAlertValue == 'Yes') {
                new PNotify({
                    title: 'Info',
                    text: 'Alert set successfully',
                    type: 'success',
                    delay: 3000
                });
            } else {
                new PNotify({
                    title: 'Info',
                    text: 'Alert remove successfully',
                    type: 'success',
                    delay: 3000
                });
            }


        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


var tblSearchApplNo = "";
$(document).on('click', '#searchbyApplNo', function () {
    isRenderPage = false;
    tblSearchApplNo = $("#txttblapplno").val();
    IPRSearchlist(pageindex);
    $("#searchbyApplNo").css("display", "none");
    $("#clearSearchByAppNo").css("display", "block");
});
$(document).on('click', '#clearSearchByAppNo', function () {
    isRenderPage = false;
    tblSearchApplNo = "";
    $("#txttblapplno").val("");
    IPRSearchlist(pageindex);
    $("#searchbyApplNo").css("display", "block");
    $("#clearSearchByAppNo").css("display", "none");
});

var tblSearchMark = "";
$(document).on('click', '#searchbyMark', function () {
    isRenderPage = false;
    tblSearchMark = $("#txttblMark").val();
    IPRSearchlist(pageindex);
    $("#searchbyMark").css("display", "none");
    $("#clearSearchByMark").css("display", "block");
});
$(document).on('click', '#clearSearchByMark', function () {
    isRenderPage = false;
    tblSearchMark = "";
    $("#txttblMark").val("");
    IPRSearchlist(pageindex);
    $("#searchbyMark").css("display", "block");
    $("#clearSearchByMark").css("display", "none");
});

var tblSearchProp = "";
$(document).on('click', '#searchbyProp', function () {
    isRenderPage = false;
    tblSearchProp = $("#txttblProp").val();
    IPRSearchlist(pageindex);
    $("#searchbyProp").css("display", "none");
    $("#clearSearchByProp").css("display", "block");
});
$(document).on('click', '#clearSearchByProp', function () {
    isRenderPage = false;
    tblSearchProp = "";
    $("#txttblProp").val("");
    IPRSearchlist(pageindex);
    $("#searchbyProp").css("display", "block");
    $("#clearSearchByProp").css("display", "none");
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
    isRenderPage = true;
    $("#txtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistForCopyright(setPageNo)
    } else if (IPname == 3) {
        IPRSearchlistForPatent(setPageNo)
    }
    else if (IPname == 4) {
        IPRSearchlistForGI(setPageNo);
    }
    else {
        IPRSearchlistForDesign(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPage = true;
    $("#txtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistForCopyright(setPageNo)
    } else if (IPname == 3) {
        IPRSearchlistForPatent(setPageNo)
    }
    else if (IPname == 4) {
        IPRSearchlistForGI(setPageNo);
    }
    else {
        IPRSearchlistForDesign(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistForCopyright(setPageNo)
    } else if (IPname == 3) {
        IPRSearchlistForPatent(setPageNo)
    }
    else if (IPname == 4) {
        IPRSearchlistForGI(setPageNo);
    }
    else {
        IPRSearchlistForDesign(setPageNo);
    }
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
    isRenderPage = true;
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistForCopyright(setPageNo)
    } else if (IPname == 3) {
        IPRSearchlistForPatent(setPageNo)
    }
    else if (IPname == 4) {
        IPRSearchlistForGI(setPageNo);
    }
    else {
        IPRSearchlistForDesign(setPageNo);
    }
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

$(document).on('change', '#statusDropdown', function () {
    isRenderPage = false;
    tblSearchstatus = $(this).val(); // Get the selected value
    IPRSearchlist(pageindex);
    $("#Applicationcleardate").css("display", "block");
});

var appFromDate = "", appToDate = "";
$(document).on('click', '#searchByApplDate', function () {
    isRenderPage = false;
    $('#txtdateapplicationfrom').val("");
    $('#txtdateapplicationto').val("");
    var fromDate = $('#applfrmdate').val();
    var toDate = $('#ApplicationdateTo').val();
    if (fromDate == "") {
        alert("Please select filter from application date");
        $("#applfrmdate").focus();
        return false;
    }
    if (toDate == "") {
        alert("Please select filter to application date");
        $("#ApplicationdateTo").focus();
        return false;
    }
    appFromDate = fromDate;
    appToDate = toDate;
    IPRSearchlist(pageindex);
    $("#Applicationcleardate").css("display", "block");

});
$(document).on('click', '#Applicationcleardate', function () {
    isRenderPage = false;
    appFromDate = "";
    appToDate = "";
    $('#applfrmdate').val("");
    $('#ApplicationdateTo').val("");
    $("#Applicationcleardate").css("display", "none");
    IPRSearchlist(pageindex);
})

/*Start Search by Hearing date*/
var hearingFrmDate = "", hearingToDate = "";
$(document).on('click', '#searchByHearDate', function () {
    const fromDate = $('#hearingfrmdate').val().trim();
    const toDate = $('#hearingdateTo').val().trim();
    if (fromDate == "") {
        alert("Please select a 'From' application date.");
        $('#applfrmdate').focus();
        return false;
    }

    if (toDate == "") {
        alert("Please select a 'To' application date.");
        $('#ApplicationdateTo').focus();
        return false;
    }

    hearingFrmDate = fromDate;
    hearingToDate = toDate;

    IPRSearchlist(pageindex);
    $('#ApplicationclearHear').show();
});

$(document).on('click', '#ApplicationclearHear', function () {
    appFromDate = "";
    appToDate = "";
    $('#hearingfrmdate').val("");
    $('#hearingdateTo').val("");
    IPRSearchlist(pageindex);
    $("#Applicationcleardate").hide();
    $("#ApplicationclearHear").hide();
    $("#dropdown-hear-menu").hide();

})
/*End Hearing date filter*/
var examTotRecord = 1;
function BindExamReportDocs(applNo, EPageIndex) {
    var html = '';
    $("#ExamFooter").html("");
    $("#bindIPRExamDocData").html("");
    var formData = new FormData();
    formData.append("applNo", EncodeText(applNo));
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/BindExaminationReport",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $("#ExamPagination").show();
                        //$("#bindIPRExamDocData tr").remove();
                        //examDocAvailable = "1";

                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;

                            //    var totdata = val.TotalCount;
                            //    var totpage = 0;
                            //    if (val.TotalCount > 0) {
                            //        pnext = parseInt(pnext) + 1;
                            //        if (pnext == 0) pnext = 1;

                            //        pprev = parseInt(pageno) - 1;
                            //        if (pprev == 0) pprev = 1;
                            //        totpage = parseInt(totdata) / parseInt(pagesize);

                            //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //            totpage = parseInt(totpage) + 1;
                            //        }

                            //        /*$("#pagnumvalue").attr("max", totpage);*/

                            //    }
                            //    var totalRecord = '';
                            //    var tfot = '';
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + val.TotalCount + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    /*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'*/
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    /*tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getExamDataByPageNo" style="margin-left:10px;">Go</button></a></li>`*/

                            //    if (val.TotalCount <= length) {

                            //    }
                            //    else if (pageno == 1) {

                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="examPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'

                            //    }

                            //    else {
                            //        tfot += '<li><span><a id="examPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //    }

                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="examPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }

                            //    tfot += '</ul>'
                            //    $("#ExamFooter").html("");
                            //    $("#ExamFooter").html(tfot);
                            //}
                            var totdata = val.TotalCount;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (EPageIndex == totpage) {
                                    $('#ExamNext').hide();
                                    $('#ExamPrev').css("display", "block");
                                }
                                else {
                                    $('#ExamNext').css("display", "block");
                                }
                                if (EPageIndex == 1) {
                                    $('#ExamPrev').css("display", "none");
                                }
                                else {
                                    $('#ExamPrev').css("display", "block");
                                }

                                if (isExamRnd == false) {
                                    examTotRecord = totpage;
                                    ExamRenderPagination(EPageIndex, totpage);
                                }
                            }
                            var path = val.vLocalFile;
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td class="abc">' + val.vDescription + '</td>';
                            html += '<td style="text-align:center;"><a href="' + path + '" download="' + val.vDescription + '" target="_blank" style="cursor: pointer;"><img src="/newassets/img/view-icon.png"></a></td></tr>';

                        });
                    }
                    else {
                        $("#ExamPagination").hide();
                        html += '<tr><td colspan="3" align="center">' + "Data not found" + '</td></tr>';
                    }

                }
                else {
                    $("#ExamPagination").hide();
                    html += '<tr><td colspan="3" align="center">' + "Data not found" + '</td></tr>';
                    /* $("#bindIPRExamDocData").html("").html(html);*/
                }
                $("#bindIPRExamDocData").html("").html(html);
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
//var examDocAvailable = "0";
var EPageIndex = 1;
var ExamApplNo = "";
//$(document).on('click', '#openExamDetail', function () {

//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idExaminationDetails, .nav-link").addClass("active");

//    $("#divTradeInfoDetails-body").css("display", "none");
//    $("#divIPRTrademarkDoc-body").css("display", "none");
//    $("#divOppDocDetail-body").css("display", "none");
//    $("#divOppositionDetails-body").css("display", "none")
//    $("#divExaminationDetail-body").css("display", "block");
//    $("#divCorrAndNoticesDetail-body").css("display", "none");
//    $("#divPRDetails-body").css("display", "none");

//    $("#btnTradeinfoDiv").css("display", "none");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "none");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "none");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "none");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "none");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "block");

//    ExamApplNo = "";
//    ExamApplNo = $(this).attr("appid");

//    CheckDetailAvailability(ExamApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }

//    EPageIndex = 1;
//    BindExamReportDocs(ExamApplNo, EPageIndex);
//});

function ViewExamDetails(examApplN, examTradeiid) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idExaminationDetails, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "none")
    $("#divExaminationDetail-body").css("display", "block");
    $("#divCorrAndNoticesDetail-body").css("display", "none");
    $("#divPRDetails-body").css("display", "none");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "none");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "block");

    ExamApplNo = "";
    ExamApplNo = examApplN;//$(this).attr("appid");
    globalApplNo = examApplN;
    globalTradeId = examTradeiid;

    CheckDetailAvailability(ExamApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    } else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    EPageIndex = 1;
    BindExamReportDocs(ExamApplNo, EPageIndex);
}
/*Examination Pagination Start*/
var isExamRnd = false;
function ExamRenderPagination(EPageIndex, totdata) {
    let totPages = totdata;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btnExam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btnExam ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btnExam ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#ExamPageNumbers").html(paginationHtml);
    isExamRnd = true;
}

$(document).on("click", ".page-btnExam", function () {
    let page = $(this).data("page");
    EPageIndex = page;
    isExamRnd = true;
    $("#opptxtgopage").val("");
    BindExamReportDocs(ExamApplNo, EPageIndex);
    $(".page-btnExam").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#ExamPrev", function () {
    if (EPageIndex > 1) {
        EPageIndex = EPageIndex - 1;
    }
    isExamRnd = true;
    $("#opptxtgopage").val("");
    BindExamReportDocs(ExamApplNo, EPageIndex);

    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
});


$(document).on("click", "#ExamNext", function () {
    if (EPageIndex => 1) {
        EPageIndex = EPageIndex + 1;
    }
    isExamRnd = true;
    $("#opptxtgopage").val("");
    BindExamReportDocs(ExamApplNo, EPageIndex);
    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
});

$(document).on("click", "#ExamDivGo", function () {
    let goToPage = parseInt($("#Examtxtgopage").val());
    if (!isNaN(goToPage)) {
        EPageIndex = goToPage;
    }

    if (goToPage > examTotRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        EPageIndex = 1;
        return false;
    }
    isExamRnd = true;
    BindExamReportDocs(ExamApplNo, EPageIndex);
    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
});

/*Examination Pagination End*/

/*Start correspondence details*/
//var carDetailAvailable = "0";
function BindCorrespondenceDetails(vApplNo, cPageIndex) {
    var html = '';
    pagesize = 10;
    pageindex = cPageIndex;
    $("#corrFooter").html("");
    $("#bindIPRCorrespondence").html("");
    var formData = new FormData();
    formData.append("applNo", EncodeText(vApplNo));
    formData.append("PageNum", pageindex);
    formData.append("PageSize", pagesize);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/BindCorrespondenceReport",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        //carDetailAvailable = "1";
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;
                            //    var totdata = val.TotalCount;
                            //    var totpage = 0;
                            //    if (val.TotalCount > 0) {
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
                            //    var totalRecord = '';
                            //    var tfot = '';
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + val.TotalCount + '</span>  <span id="Cortopage" style="display:none">' + totpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    /*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(val.TotalCount) + '</li>'*/
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += `<li><input type="number" id="CorNumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getCorrespByPageNo" style="margin-left:10px;">Go</button></a></li>`

                            //    if (val.TotalCount <= length) {

                            //    }
                            //    else if (pageno == 1) {

                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="corPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'

                            //    }

                            //    else {
                            //        tfot += '<li><span><a id="corPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //    }

                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="corPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }

                            //    tfot += '</ul>'
                            //    $("#corrFooter").html("");
                            //    $("#corrFooter").html(tfot);
                            //}

                            var totdata = val.TotalCount;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#corrNext').hide();
                                    $('#corrPrev').css("display", "block");
                                }
                                else {
                                    $('#corrNext').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#corrPrev').css("display", "none");
                                }
                                else {
                                    $('#corrPrev').css("display", "block");
                                }

                                if (isCorrRnd == false) {
                                    CorrRenderPagination(pageindex, totpage);
                                }
                            }
                            $('#tdShareCarresp').attr('vapplNo', vApplNo);

                            var path = val.FilePath;

                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.CorresNo + '</td>';
                            html += '<td>' + val.CorresDate + '</td>';
                            html += '<td>' + val.CorresSubject + '</td>';
                            html += '<td>' + val.DispatchNo + '</td>';
                            html += '<td>' + val.DispatchDate + '</td>';
                            //html += '<td>' + ((val.vHearing == null || val.vHearing == '01/01/1900') ? '' : val.vHearing) + '</td>';
                            html += '<td>' + ((val.HearingDate == null || val.HearingDate == '01/01/1900') ? '' : val.HearingDate) + '</td>';
                            html += '<td style="text-align:center;"><a href="' + path + '" download="' + val.CorresSubject + '" target="_blank" style="cursor: pointer;">' + '<img <img src="/newassets/img/view-icon.png" />' + '</a></td></tr>';

                        });
                    }
                    else {
                        //carDetailAvailable = "0";
                        html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                    }
                }
                else {
                    //carDetailAvailable = "0";
                    html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                }
                $("#bindIPRCorrespondence").html("").html(html);
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
/*Correspondence Pagination Start*/
var isCorrRnd = false;
function CorrRenderPagination(CPageIndex, totdata) {
    let totPages = totdata;
    correspApplNo = CPageIndex;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btnCorr ${i === CPageIndex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (CPageIndex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btnCorr ${i === CPageIndex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btnCorr ${j === CPageIndex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#corrPageNumbers").html(paginationHtml);
    isCorrRnd = true;
}

$(document).on("click", ".page-btnCorr", function () {
    let page = $(this).data("page");
    CPageIndex = page;
    isCorrRnd = true;
    $("#corrtxtgopage").val("");
    BindCorrespondenceDetails(correspApplNo, CPageIndex);
    $(".page-btnCorr").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#ExamPrev", function () {
    if (CPageIndex > 1) {
        CPageIndex = CPageIndex - 1;
    }
    isCorrRnd = true;
    $("#corrtxtgopage").val("");
    BindCorrespondenceDetails(correspApplNo, CPageIndex);
    $(".page-btnCorr").removeClass("active");
    $(".page-btnCorr[data-page='" + CPageIndex + "']").addClass("active");
});


$(document).on("click", "#ExamNext", function () {
    if (CPageIndex => 1) {
        CPageIndex = CPageIndex + 1;
    }
    isCorrRnd = true;
    $("#corrtxtgopage").val("");
    BindCorrespondenceDetails(correspApplNo, CPageIndex);
    $(".page-btnCorr").removeClass("active");
    $(".page-btnCorr[data-page='" + CPageIndex + "']").addClass("active");
});

$(document).on("click", "#corrDivGo", function () {
    let goToPage = parseInt($("#corrtxtgopage").val());
    if (!isNaN(goToPage)) {
        CPageIndex = goToPage;
    }
    isCorrRnd = true;
    BindCorrespondenceDetails(correspApplNo, CPageIndex);
    $(".page-btnCorr").removeClass("active");
    $(".page-btnCorr[data-page='" + CPageIndex + "']").addClass("active");
});

/*Correspondence Pagination End*/
function changePage(page) {
    cPageNo = page;
    BindCorrespondenceDetails(correspApplNo, cPageNo);
}

$(document).on('click', '#getCorrespByPageNo', function () {
    ppageindex = $("#CorNumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#Cortopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changePage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});
var correspApplNo = "";
var cPageNo = "";
//$(document).on('click', '#openCorrespDetail', function () {

//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idCorrAndNotices, .nav-link").addClass("active");

//    $("#divTradeInfoDetails-body").css("display", "none");
//    $("#divIPRTrademarkDoc-body").css("display", "none");
//    $("#divOppDocDetail-body").css("display", "none");
//    $("#divOppositionDetails-body").css("display", "none")
//    $("#divExaminationDetail-body").css("display", "none");
//    $("#divCorrAndNoticesDetail-body").css("display", "block");
//    $("#divPRDetails-body").css("display", "none");

//    $("#btnTradeinfoDiv").css("display", "none");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "none");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "none");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "none");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "block");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "none");

//    correspApplNo = $(this).attr("appid");

//    CheckDetailAvailability(correspApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }

//    cPageNo = 1;
//    BindCorrespondenceDetails(correspApplNo, cPageNo);
//});
function ViewCorrespDetails(corrpApplN, corresTradeId) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idCorrAndNotices, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "none")
    $("#divExaminationDetail-body").css("display", "none");
    $("#divCorrAndNoticesDetail-body").css("display", "block");
    $("#divPRDetails-body").css("display", "none");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "block");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "none");

    correspApplNo = corrpApplN;//$(this).attr("appid");
    globalApplNo = corrpApplN;
    globalTradeId = corresTradeId;

    CheckDetailAvailability(correspApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    } else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    cPageNo = 1;
    BindCorrespondenceDetails(correspApplNo, cPageNo);
}
/*End correspondence details*/

/*Start PR details*/
//var prDetailAvailable = "0";
var prTotRecord = 1;
function BindPRDetails(vApplNo, cPageIndex) {
    var html = '';
    pagesize = 10;
    pageindex = cPageIndex;
    $("#prFooter").html("");
    $("#bindIPRPropertyRights").html("");
    var formData = new FormData();
    formData.append("applNo", EncodeText(vApplNo));
    formData.append("PageNum", pageindex);
    formData.append("PageSize", pagesize);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/BindPropertyRightDetail",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                if (obj != null) {
                    var length = obj.length;
                    $("#prDatastatus").hide();
                    if (length > 0) {
                        //prDetailAvailable = "1";
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;
                            //    var totdata = val.TotalCount;
                            //    var totpage = 0;
                            //    if (val.TotalCount > 0) {
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
                            //    var totalRecord = '';
                            //    var tfot = '';
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + val.TotalCount + '</span>  <span id="PRtopage" style="display:none">' + totpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += `<li><input type="number" id="ProNValue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getPropertyByPageNo" style="margin-left:10px;">Go</button></a></li>`
                            //    if (val.TotalCount <= length) {
                            //    }
                            //    else if (pageno == 1) {
                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="PropPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //    }
                            //    else {
                            //        tfot += '<li><span><a id="PropPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //    }
                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="PropPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }
                            //    tfot += '</ul>'
                            //    $("#prFooter").html("");
                            //    $("#prFooter").html(tfot);
                            //}

                            if (i === (length - 1)) {
                                var totdata = val.TotalCount;
                                var totpage = 0;
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#prNext').hide();
                                    $('#prPrev').css("display", "block");
                                }
                                else {
                                    $('#prNext').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#prPrev').css("display", "none");
                                }
                                else {
                                    $('#prPrev').css("display", "block");
                                }
                                if (isPrRenderPage == false) {
                                    prTotRecord = totpage;
                                    prRenderPagination(pageindex, totpage);
                                }
                            }
                            var prDetailss = "";
                            if (val.PRDetail != '') {
                                prDetailss = val.PRDetail.replace('</br>', '').replace('/br', '');
                            }
                            else {
                                prDetailss = "";
                            }
                            html += '<tr><td>' + val.RowId + '</td>';
                            /*html += '<td>' + val.PRDetail + '</td>';*/
                            html += '<td>' + prDetailss + '</td>';
                            /*html += '<td><a href="' + path + '" download="' + val.CorresSubject + '" target="_blank" style="cursor: pointer;">' + "View" + '</a></td></tr>';*/
                        });
                        $("#bindIPRPropertyRights").html("").html(html);
                    }
                }
                else {
                    //html += '<tr><td colspan="2" align="center">' + "Data Not Found" + '</td></tr>';
                    $("#prDatastatus").hide();
                    //$("#bindIPRPropertyRights").html("").html(html);
                }
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

//function changePrPage(page) {
//    cPageNo = page;
//    BindPRDetails(prApplNo, cPageNo);
//}

//$(document).on('click', '#getPropertyByPageNo', function () {
//    ppageindex = $("#ProNValue").val();
//    if (ppageindex != "undefined") {
//        if (Math.sign(ppageindex) == 1) {
//            var ppageindesx = $("#PRtopage").text();
//            if (ppageindex <= parseInt(ppageindesx)) {
//                loadflag = true;
//                changePrPage(ppageindex);
//            }
//            else {
//                alert("Invalid page no.");
//            }
//        }
//        else {
//            alert("Invalid page no.");
//        }
//    }
//});

var prApplNo = "";
var cPageNo = "";
//$(document).on('click', '#openPRDetail', function () {

//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idPRDetails, .nav-link").addClass("active");

//    $("#divTradeInfoDetails-body").css("display", "none");
//    $("#divIPRTrademarkDoc-body").css("display", "none");
//    $("#divOppDocDetail-body").css("display", "none");
//    $("#divOppositionDetails-body").css("display", "none")
//    $("#divExaminationDetail-body").css("display", "none");
//    $("#divCorrAndNoticesDetail-body").css("display", "none");
//    $("#divPRDetails-body").css("display", "block");

//    $("#btnTradeinfoDiv").css("display", "none");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "none");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "none");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "none");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "block");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "none");

//    prApplNo = $(this).attr("appid");

//    CheckDetailAvailability(prApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }

//    cPageNo = 1;
//    BindPRDetails(prApplNo, cPageNo);
//});
function ViewPRDetails(prAppN, prTradeId) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idPRDetails, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "none")
    $("#divExaminationDetail-body").css("display", "none");
    $("#divCorrAndNoticesDetail-body").css("display", "none");
    $("#divPRDetails-body").css("display", "block");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "block");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "none");

    prApplNo = prAppN;//$(this).attr("appid");
    globalApplNo = prAppN;
    globalTradeId = prTradeId;

    CheckDetailAvailability(prApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    } else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    cPageNo = 1;
    BindPRDetails(prApplNo, cPageNo);
}


/*PR Pagination Start*/
var isPrRenderPage = false;
var totalPageRec = "";
function prRenderPagination(pageindex, totdata) {
    let totPages = totdata;
    cPageNo = pageindex;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="prpage-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="prpage-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="prpage-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#prPageNumbers").html(paginationHtml);
    isPrRenderPage = true;
}
var cPageNo = 1;
$(document).on("click", ".prpage-btn", function () {
    let page = $(this).data("page");
    cPageNo = page;
    isPrRenderPage = true;
    $("#prtxtgopage").val("");
    if (IPname == 1) {
        BindPRDetails(prApplNo, cPageNo);
    }
    $(".prpage-btn").removeClass("active");
    $(".prpage-btn[data-page='" + cPageNo + "']").addClass("active");
});
$(document).on("click", "#prPrev", function () {
    if (cPageNo > 1) {
        cPageNo = cPageNo - 1;
    }
    isPrRenderPage = true;
    $("#prtxtgopage").val("");
    if (IPname == 1) {
        BindPRDetails(prApplNo, cPageNo);
    }
    $(".prpage-btn").removeClass("active");
    $(".prpage-btn[data-page='" + cPageNo + "']").addClass("active");
});
$(document).on("click", "#prNext", function () {
    if (cPageNo => 1) {
        cPageNo = cPageNo + 1;
    }
    isPrRenderPage = true;
    $("#prtxtgopage").val("");
    if (IPname == 1) {
        BindPRDetails(prApplNo, cPageNo);
    }
    $(".prpage-btn").removeClass("active");
    $(".prpage-btn[data-page='" + cPageNo + "']").addClass("active");
});
$(document).on("click", "#prdivGo", function () {
    let goToPage = parseInt($("#prtxtgopage").val());
    if (!isNaN(goToPage)) {
        cPageNo = goToPage;
    }
    if (goToPage > prTotRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        cPageNo = 1;
        return false;
    }
    isPrRenderPage = true;
    if (IPname == 1) {
        BindPRDetails(prApplNo, cPageNo);
    }
    $(".prpage-btn").removeClass("active");
    $(".prpage-btn[data-page='" + cPageNo + "']").addClass("active");
});
/*PR Pagination End*/

/*End PR details*/
/*Start Check Detail available*/
var corDocAvail = "0";
var prDetailAvail = "0";
var examDocAvail = "0";
var opposeStatus = "0";
function CheckDetailAvailability(ApplicationNo) {
    var formData = new FormData();
    formData.append("applNo", ApplicationNo);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/CheckDetailAvailablity",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                if (obj != null) {
                    var length = obj.length;
                    examDocAvail = obj[0].detailAvailable;
                    corDocAvail = obj[1].detailAvailable;
                    prDetailAvail = obj[2].detailAvailable;
                    opposeStatus = obj[3].detailAvailable
                }
                else {
                    corDocAvail = "0";
                    prDetailAvail = "0";
                    examDocAvail = "0";
                    opposeStatus = "0";
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
/*End Check Detail available*/

/*Start opposition detail*/
var OppPageIndex = 1;
var OppApplNo = "";
//$(document).on('click', '#addopponentdetails', function () {

//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idOppositionDetails, .nav-link").addClass("active");

//    $("#divTradeInfoDetails-body").css("display", "none");
//    $("#divIPRTrademarkDoc-body").css("display", "none");
//    $("#divOppDocDetail-body").css("display", "none");
//    $("#divOppositionDetails-body").css("display","block")
//    $("#divExaminationDetail-body").css("display", "none");
//    $("#divCorrAndNoticesDetail-body").css("display", "none");
//    $("#divPRDetails-body").css("display", "none");

//    $("#btnTradeinfoDiv").css("display", "none");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "none");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "none");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "block");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "none");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "none");

//    OppApplNo = $(this).attr("appid");

//    CheckDetailAvailability(OppApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }

//    OppPageIndex = 1;
//    OppositionDetails(OppApplNo, OppPageIndex);
//});

function ViewOppositionDetails(ApplicationNo, OppTradeiid) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idOppositionDetails, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "block")
    $("#divExaminationDetail-body").css("display", "none");
    $("#divCorrAndNoticesDetail-body").css("display", "none");
    $("#divPRDetails-body").css("display", "none");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "block");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "none");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "none");

    OppApplNo = ApplicationNo; //$(this).attr("appid");
    globalApplNo = ApplicationNo;
    globalTradeId = OppTradeiid;

    CheckDetailAvailability(OppApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    } else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    OppPageIndex = 1;
    OppositionDetails(OppApplNo, OppPageIndex);
}

var oppDTotalRecord = 1;
function OppositionDetails(OppApplNo, OppPageIndex) {
    var html = '';
    var formData = new FormData();
    formData.append("pagenum", OppPageIndex);
    formData.append("pagesize", pagesize);
    formData.append("vapplno", OppApplNo);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/IPROppositionDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                $('#btnOppDetailEmail').attr('vapplNo', OppApplNo);
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $("#divalertlist tr").remove();
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;
                            //    var totdata = val.TotalRecord;
                            //    var totpage = 0;
                            //    if (totdata > 0) {
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
                            //    var totalRecord = '';
                            //    if (parseInt(totdata) > 2500) {
                            //        totalRecord = '2500';
                            //    }
                            //    else {
                            //        totalRecord = totdata;
                            //    }
                            //    var tfot = '';
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + totalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`
                            //    if (totdata <= length) {
                            //    }
                            //    else if (pageno == 1) {
                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            //    }
                            //    else {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //    }
                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }
                            //    tfot += '<button style="padding-right: 10px;position: relative;left: 100%;" class="sbtbtn pull-right" data-toggle="modal" data-target="#oppositionEmailModal">Email As Excel</button>';
                            //    tfot += '<button style="padding-right: 10px;position: relative;left: 100%;" class="sbtbtn pull-right">Download</button>';
                            //    tfot += '</ul>'
                            //    $("#ptfooter1").html("");
                            //    $("#ptfooter1").html(tfot);
                            //}
                            $('#oppDPagination').show();
                            $('#oppIpdatastatus').hide();
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (OppPageIndex == totpage) {
                                    $('#oppDNext').hide();
                                    $('#oppDPrev').css("display", "block");
                                }
                                else {
                                    $('#oppDNext').css("display", "block");
                                }
                                if (OppPageIndex == 1) {
                                    $('#oppDPrev').css("display", "none");
                                }
                                else {
                                    $('#oppDPrev').css("display", "block");
                                }

                                if (isOppRnd == false) {
                                    oppDTotalRecord = totpage;
                                    OppPaginationDetail(OppPageIndex, totpage);
                                }
                            }
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.vApplNo + '</td>';
                            html += '<td>' + val.vOpponentName + '</td>';
                            html += '<td>' + val.vOpponentAddress + '</td>';
                            html += '<td>' + val.vOppositionNo + '</td>';
                            html += '<td>' + val.vOpponentCode + '</td>';
                            html += '<td>' + val.vOppositionDate + '</td>';
                            html += '<td>' + val.vAttorneyName + '</td>';
                            html += '<td>' + val.vAttorneyAddress + '</td>';
                            html += '<td>' + val.vStatus + '</td>';
                            html += '<td>' + val.vDecision + '</td>';
                            //html += '<td>NA</td></tr>';
                        });
                    }
                    else {
                        $('#oppDPagination').hide();
                        $('#oppIpdatastatus').show();
                        //html += '<tr>'
                        //html += '<td colspan=12 align=center>Data Not Found</td>'
                        //html += '<tr>'
                    }
                }
                else {
                    $('#oppDPagination').hide();
                    $('#oppIpdatastatus').show();
                    //html += '<tr>'
                    //html += '<td colspan=12 align=center>Data Not Found</td>'
                    //html += '<tr>'
                }
                $("#bindIPROppositionDetailsData").html("").html(html);
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
/*Start Opposition detail pagination*/
var isOppRnd = false;
function OppPaginationDetail(OppPageIndex, totpage) {
    let totPages = totpage;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totpage <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btndOpp ${i === OppPageIndex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (OppPageIndex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btndOpp ${i === OppPageIndex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btndOpp ${j === OppPageIndex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#oppPageNumbers").html(paginationHtml);
    isOppRnd = true;
}

$(document).on("click", ".page-btndOpp", function () {
    let page = $(this).data("page");
    OppPageIndex = page;
    isOppRnd = true;
    $("#opptxtgopage").val("");
    OppositionDetails(OppApplNo, OppPageIndex);
    $(".page-btndOpp").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#oppDPrev", function () {
    if (OppPageIndex > 1) {
        OppPageIndex = OppPageIndex - 1;
    }
    isOppRnd = true;
    $("#opptxtgopage").val("");
    OppositionDetails(OppApplNo, OppPageIndex);

    $(".page-btndOpp").removeClass("active");
    $(".page-btndOpp[data-page='" + OppPageIndex + "']").addClass("active");
});


$(document).on("click", "#oppDNext", function () {
    if (OppPageIndex => 1) {
        OppPageIndex = OppPageIndex + 1;
    }
    isOppRnd = true;
    $("#opptxtgopage").val("");
    OppositionDetails(OppApplNo, OppPageIndex);
    $(".page-btndOpp").removeClass("active");
    $(".page-btndOpp[data-page='" + OppPageIndex + "']").addClass("active");
});

$(document).on("click", "#oppDDivGo", function () {
    let goToPage = parseInt($("#opptxtgopage").val());
    if (!isNaN(goToPage)) {
        OppPageIndex = goToPage;
    }
    if (goToPage > oppDTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        OppPageIndex = 1;
        return false;
    }
    isOppRnd = true;
    OppositionDetails(OppApplNo, OppPageIndex);
    $(".page-btndOpp").removeClass("active");
    $(".page-btndOpp[data-page='" + OppPageIndex + "']").addClass("active");
});
/*End Opposition detail pagination*/


/*End opposition detail*/

//New Function for sorting Data.

function fnSort(sort, colname) {
    if ($('#hdnsort').val() == 0) {
        $('#hdnsort').val(1);
    }
    else {
        $('#hdnsort').val(0);
    }
    IPRSearchlist(pageindex, colname, sort);
}

function fn_clrtxt() {

    $('#emailtxt').val('');
}

$(document).on('click', '#tmdetailsmodal', function () {
    //alert($(this).attr('tradeiid'));
    $('#btnEmail').attr('tradeiid', $(this).attr('tradeiid'));
});

$(document).on('click', '#btnEmail', function () {
    var getEmailVal = $("#emailtxt").val();//document.querySelector('input[name="sendemail"]').value;
    const emailArray = getEmailVal.split(',');
    if (getEmailVal === '') {
        //alert('Please enter an email address');
        new PNotify({
            title: 'Success!',
            text: 'Please enter an email address',
            type: 'success',
            delay: 3000
        });
        return false;
    } else if (!emailArray.every(email => emailPattern.test(email.trim()))) {
        //alert('Invalid email address')
        new PNotify({
            title: 'Success!',
            text: 'Invalid email address',
            type: 'error',
            delay: 3000
        });
        return false;
    } else {

    }

    var emailTo = getEmailVal;
    var tradeiids = $(this).attr('tradeiid');
    var formData = new FormData();
    formData.append('IPList', btoa(IPname));
    formData.append('To', btoa(emailTo));
    formData.append('tradeval', btoa(tradeiids));

    $.ajax({
        async: true,
        url: "/IPR/SendEmailForIPR",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',

        success: function (response) {

            alert('Email Sent Successfully!');
        },

        failure: function (response) {
            alert('Email Sent Successfully!');
        },

        error: function (response) {
            alert('Email Sent Successfully!');
        }
    });
});

function GetClassList() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/IPR/GetIPRClassList1",
        dataType: 'json',
        success: function (response) {
            $("#searchclass").html("");
            $(".ms-selectall").show();
            $.each(response, function (i, b) {
                if (b.name.toUpperCase() !== "ALL") {
                    $("#searchclass").append("<option value='" + b.name + "'>" + b.name + " " + "-" + " " + b.className + "</option>");
                }
            });
            $("#searchclass").multiselect('reload');
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

function GetStatusList() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/IPR/GetIPRStatusList",
        dataType: 'json',
        success: function (response) {
            $("#searchstatus").html("");
            $(".ms-selectall").show();
            $("#statusDropdown").html("");
            $("#statusDropdown").append("<option value=''>Status</option>");
            $.each(response, function (i, b) {
                $("#searchstatus").append($("<option></option>").val(b.name).text(b.name));
                $("#statusDropdown").append($("<option></option>").val(b.name).text(b.name));
            });
            $("#searchstatus").multiselect('reload');
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

function GetTypeList() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/api/IPRApi/GetTypeList",
        dataType: 'json',
        success: function (response) {
            //  var obj = JSON.parse(data);
            var obj = JSON.parse(response.Data.data);
            $("#searchtype").empty();
            $("#searchtype").append("<option value=''>Select</option>");
            $.each(obj.data, function (i, b) {

                $("#searchtype").append("<option value='" + b.iid + "'>" + b.Typename + "</option>");
            });
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

function GetJurisdictionList() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/IPRApi/JurisdictionList",
        dataType: 'json',
        success: function (response) {
            //  var obj = JSON.parse(data);
            var obj = JSON.parse(response.Data.data);
            $("#JurisdictionList").empty();
            $("#JurisdictionList").append("<option value=''>Select</option>");
            $.each(obj.data, function (i, b) {

                $("#JurisdictionList").append("<option value='" + b.iid + "'>" + b.Jurisdiction + "</option>");
            });
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

$(document).on('click', '#advsearch', function () {
    ShowAllFilters();
    if (IPname == 1) {
        GetClassList();
    }
    $('#advsearch').css("display", "none");
    $('#btncollapse').css("display", "block");
})

$(document).on('click', '#btncollapse', function () {

    HideAllFilters();
    $('#btncollapse').css("display", "none");
    $('#advsearch').css("display", "block");


})

function HideAllFilters() {
    $('#divHide1').css("display", "none");
    $('#divHide2').css("display", "none");
    $('#proprietor').css("display", "none");
    $('#jurisdiction').css("display", "none");

    //$("#filtertradmark").val("");
    //$("#IPList").val("");
    $("#txtapplicationno").val("");
    $("#searchclass").val("");
    $("#searchtype").val("");
    $("#searchstatus").val("");
    $("#txtdateapplicationfrom").val("");
    $("#txtdateapplicationto").val("");
    $("#searchuserdetetail").val("");
    $("#txtProprietor").val("");
    $("#JurisdictionList").val("");
}

function ShowAllFilters() {
    $('#divHide1').css("display", "block");
    $('#divHide2').css("display", "block");
    $('#proprietor').css("display", "block");
    $('#jurisdiction').css("display", "block");
}

$(document).on('change', '#SerialNo', function () {
    var abc = $('#SerialNo').val();
    var ascending = $("#ascending").html();
    var rowidvalue = $("#rowid").html();
});
var downloadTradeId = "";

var globalApplNo = "";
var globalTradeId = "";
var setValueAsGlobal = "";
//$(document).on('click', '#openviewaddedtrademarks', function () {
//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idOpenTradeInfo, .nav-link").addClass("active");
//    $("#tmdetailsdownload").css("display", "Block");
//    $("#divTradeInfoDetails-body").css("display", "block");
//    $("#divIPRTrademarkDoc-body").css("display", "none");
//    $("#divOppDocDetail-body").css("display", "none");
//    $("#divOppositionDetails-body").css("display", "none")
//    $("#divExaminationDetail-body").css("display", "none");
//    $("#divCorrAndNoticesDetail-body").css("display", "none");
//    $("#divPRDetails-body").css("display", "none");


//    $("#btnTradeinfoDiv").css("display", "Block");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "none");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "none");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "none");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "none");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "none");

//    downloadTradeId = "";
//    trademarkId = $(this).attr("tradeid");
//    var openApplNo = $(this).attr("openDocApplNo");

//    CheckDetailAvailability(openApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    else {
//        $("#idExaminationDetails").css("display", "none");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    } else {
//        $("#idPRDetails").css("display", "none");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    } else {
//        $("#idCorrAndNotices").css("display", "none");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }
//    else {
//        $("#idOpenOppDoc").css("display", "none");
//        $("#idOppositionDetails").css("display", "none");
//    }

//    ShowJudgementDocDetail(openApplNo);

//    loadtrademarkdatabyiid(trademarkId);
//    $('#tmdetailsmodal').attr('tradeiid', trademarkId);
//    downloadTradeId = trademarkId;
//});

var globalApplNo = "";
var globalTradeId = "";
var setValueAsGlobal = "";

function ViewTrademarkDetails(vApplNo, Apptradeiid) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idOpenTradeInfo, .nav-link").addClass("active");
    $("#tmdetailsdownload").css("display", "Block");
    $("#divTradeInfoDetails-body").css("display", "block");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "none")
    $("#divExaminationDetail-body").css("display", "none");
    $("#divCorrAndNoticesDetail-body").css("display", "none");
    $("#divPRDetails-body").css("display", "none");
    $('#spMarkNameDetails').text("Trademark Information");

    $("#btnTradeinfoDiv").css("display", "Block");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "none");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "none");

    downloadTradeId = "";
    trademarkId = Apptradeiid;//$(this).attr("tradeid");
    var openApplNo = vApplNo;//$(this).attr("openDocApplNo");
    globalApplNo = vApplNo;
    globalTradeId = Apptradeiid;
    CheckDetailAvailability(openApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    }
    else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    }
    else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    ShowJudgementDocDetail(openApplNo);

    loadtrademarkdatabyiid(trademarkId);
    $('#tmdetailsmodal').attr('tradeiid', trademarkId);
    downloadTradeId = trademarkId;
}

$(document).on("click", "#idOpenDocDetail", function () {
    //$("#opendocumentdetails").trigger("click");
    OpenDocumentDetails(globalApplNo, globalTradeId);
});
$(document).on("click", "#idOpenTradeInfo", function () {
    //$("#openviewaddedtrademarks").trigger("click");
    $("#bindTrademarkDetails").empty();
    ViewTrademarkDetails(globalApplNo, globalTradeId);
});

$(document).on("click", "#idOpenOppDoc", function () {
    //$("#openopposedetails").trigger("click");
    ViewOppDocDetails(globalApplNo, globalTradeId);
});

$(document).on("click", "#idOppositionDetails", function () {
    //$("#addopponentdetails").trigger("click");
    ViewOppositionDetails(globalApplNo, globalTradeId);
});

$(document).on("click", "#idExaminationDetails", function () {
    //$("#openExamDetail").trigger("click");
    ViewExamDetails(globalApplNo, globalTradeId);
});

$(document).on("click", "#idCorrAndNotices", function () {
    //$("#openCorrespDetail").trigger("click");
    ViewCorrespDetails(globalApplNo, globalTradeId);
});

$(document).on("click", "#idPRDetails", function () {
    //$("#openPRDetail").trigger("click");
    ViewPRDetails(globalApplNo, globalTradeId);
});

function loadtrademarkdatabyiid(trademarkId) {
    var html = "";
    var imagePath = 'https://iprdocs.mykase.in/IPR_Documents_New/IPRImages/Trademark'
    var docPath = 'https://iprdocs.mykase.in/IPR_Documents/IPRDocs/Trademark/Upload_Document/'
    var formdata = new FormData();
    formdata.append("tradeid", trademarkId);
    formdata.append("ip", IPname);
    $.ajax({
        async: true,
        url: "/api/IPRApi/loadtrademarkdatabyiid",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;

            $("#bindTrademarkDetails").empty();
            $.each(obj, function (i, val) {

                var UsedSince = val.vUsedSince.replace('Used Since :', '');
                //var imgUrl = "";
                //if (val.vImgPath != "") {
                //    imgUrl = '<img src="' + imagePath + '/' + val.vClass + '/' + val.vApplNo + '.png" style="width:180px;height:120px" alt="Image Not Available" />';
                //}
                //else {
                //    imgUrl = "";//'<img src="" alt="Image Not Available" />'
                //}

                var AppNoWithPath = "";
                /*if (val.vStatus == 'Registered' && val.vJournalPath != "") {*/
                if (val.vJournalPath != "" && val.vJournalPath != null) {
                    AppNoWithPath = '(' + '<a href="' + val.vJournalPath + '" download="Journal Copy" target="_blank" style="cursor: pointer;color:blue;">' + "Journal Copy" + '</a>' + ')'
                }


                /* html = '<tr><td>TM Application No.</td><td>:</td><td>' + val.vApplNo + '</td></tr >'*/

                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>TM Application No.</h5><span>' + val.vApplNo + ' ' + AppNoWithPath + '</span></li>'
                    + '<li><h5>Class</h5><span>' + val.vClass + '</span></li>'
                    + '<li><h5>Date of Application</h5><span>' + convertdate(val.dApplDate) + '</span></li>'
                    + '<li><h5>Mark</h5><span>' + val.vWordMark + '</span></li>'
                    + '<li><h5>User Detail/Used Since</h5><span>' + newconvertdate(UsedSince) + '</span></li>'
                    + '<li><h5>Certificate Details</h5><span>' + isNullCheck(val.CertificationDetails) + '</span></li>'
                    + '<li><h5>Valid Upto/Renewed Upto</h5><span>' + (val.dValidUpto == '1900-01-01T00:00:00' ? '' : convertdateValidUpto(val.dValidUpto)) + '</span></li>'
                    + '<li><h5>Proprietor\'s Name</h5><span>' + val.vProprietor + '</span></li>'
                    + '<li><h5>Proprietor Address</h5><span>' + isNullCheck(val.vProprietorAddress) + '</span></li>'
                    + '<li><h5>Agent Name</h5><span>' + val.Agent + '</span></li>'
                    + '<li><h5>Agent Address</h5><span>' + val.AgentAddress + '</span></li>'
                    + '<li><h5>Goods & Service Details</h5><span>' + val.dGSDescription + '</span></li>'
                    + '<li><h5>Publication Details</h5><span>' + isNullCheck(val.PublicationDetails) + '</span></li>';

                if (htmlContent != "") {
                    html += '<li><h5>Judgement</h5><span><ul class="detail_info">' + htmlContent + '</ul></span></li>';
                }

                html += '<li><h5>Status</h5><span>' + val.vStatus + '</span></li>';

                if (val.vImgPath != null && val.vImgPath != "") {
                    html += '<li><h5>Image</h5><span><img style="width:100%" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available"></span></li>';
                }

                html += '</ul></div>';


                //html = '<tr><td>TM Application No.</td><td>:</td><td>' + val.vApplNo + ' ' + AppNoWithPath + '</td></tr >'
                //    + '<tr><td>Class</td><td>:</td><td>' + val.vClass + '</td></tr>'
                //    + '<tr><td>Date of Application</td><td>:</td><td>' + convertdate(val.dApplDate) + '</td></tr>'
                //    + '<tr><td>Mark</td><td>:</td><td>' + val.vWordMark + '</td></tr>'
                //    + '<tr><td>User Detail/Used Since</td><td>:</td><td>' + newconvertdate(UsedSince) + '</td></tr>'
                //    + '<tr><td>Certificate Details</td><td>:</td><td>' + isNullCheck(val.CertificationDetails) + '</td></tr>'
                //    + '<tr><td>Valid Upto/Renewed Upto</td><td>:</td><td>' + (val.dValidUpto == '1900-01-01T00:00:00' ? '' : convertdateValidUpto(val.dValidUpto)) + '</td></tr>'
                //    + '<tr><td>Proprietor\'s Name</td><td>:</td><td>' + val.vProprietor + '</td></tr>'
                //    /* + '<tr><td>proprietor address</td><td>:</td><td>' + val.vProprietorAddress + '</td></tr>'*/
                //    + '<tr><td>proprietor address</td><td>:</td><td>' + isNullCheck(val.vProprietorAddress) + '</td></tr>'
                //    + '<tr><td>Agent Name</td><td>:</td><td>' + val.Agent + '</td></tr>'
                //    + '<tr><td>Agent Address</td><td>:</td><td>' + val.AgentAddress + '</td></tr>'
                //    + '<tr><td>Goods & Service Details</td><td>:</td><td>' + val.dGSDescription + '</td></tr>'
                //    + '<tr><td>Publication Details</td><td>:</td><td>' + isNullCheck(val.PublicationDetails) + '</td></tr>'
                //if (htmlContent != "") {
                //    html += '<tr><td>Judgement</td><td>' + ":" + '</td><td><ul>' + htmlContent + '</ul></td></tr>'
                //}
                //html += '<tr><td>Status</td><td>:</td><td>' + val.vStatus + '</td></tr>'
                //if (val.vImgPath != null && val.vImgPath != "") {
                //    html += '<tr><td>Image</td><td>:</td><td><img style="width:60%;height:30%" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available"></td></tr>'
                //}
                /* + '<tr><td>Image</td><td>:</td><td>' + imgUrl +'</td></tr>'*/
                $("#bindTrademarkDetails").html(html);
            });
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        } //End of AJAX er
    });
}

/*Start Get Judgement document detail*/
var htmlContent = "";
function ShowJudgementDocDetail(vApplNo) {
    var formdata = new FormData();
    formdata.append("vApplNo", vApplNo);
    $.ajax({
        async: true,
        url: "/api/IPRApi/BindJudgementDocDetail",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj = response.Data.data;
            htmlContent = "";
            if (obj != null) {
                $.each(obj, function (i, val) {
                    htmlContent += '<li>' + '<a href="' + val.vLocalFile + '"  target="_blank" style="cursor: pointer;color:blue">' + "Judgement" + (i + 1) + '</a>' + '</li></br>'
                });
            }
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.responseText);
        } //End of AJAX er
    });
}
/*End Get Judgement document detail*/

function newconvertdate(input) {

    if (input != 'Proposed To Be Used') {

        var date = input.split('/');

        if (date.length == 3) {

            day = parseInt(date[0], 10);
            month = parseInt(date[1], 10);
            year = parseInt(date[2], 10);

            formatteddate = new Date(year, month - 1, day);

            var newdate = formatteddate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

            return newdate;
        }

        else {

            return input;
        }
    }
    else {
        return input;
    }
}

function convertdate(datevalue) {
    var day;
    var month;
    var year;
    var newdate = '';
    let pattern = /Used Since\s*\:\s*/i;
    var regex = new RegExp(pattern);
    var match = regex.test(datevalue);
    if (match === true) {
        datevalue = datevalue.replace(regex, '');
    }

    if (datevalue != null) {
        var date = datevalue.split('/');

        if (date.length == 3) {
            day = parseInt(date[0], 10);
            month = parseInt(date[1], 10);
            year = parseInt(date[2], 10);

            newdate = new Date(year, month - 1, day);

            newdate = newdate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        if (IPname == '2') {
            newdate = new Date(datevalue);
            newdate = newdate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }

    if (newdate == undefined) {
        newdate = '';
    }
    return newdate;
}
function convertdateValidUpto(inputDate) {
    const date = new Date(inputDate);
    day = date.getDate();
    month = date.getUTCMonth();
    year = date.getFullYear();
    var formattedDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    return formattedDate;
}

function ShowAllSorting() {
    $('#sortapplno').show();
    $('#sortmark').show();
    $('#sortpropname').show();
    $('#sortstatus').show();
    $('#sortclassdetails').show();
    $('#sortdateofappl').show();
    $('#sortuserdetails').show();
}

$(document).on('click', '#oexcelF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoexcelfile" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span></li></ul></td>';
        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#oexcel', function () {
    $("#myModalexportExcel").modal({ show: true });
    //$("#id_exportreportdrop").html('');
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdrop"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcel">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    $("#id_exportreportdrop").html('');

    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    //$("#printexport").html(html);
    $("#id_exportreportdrop").html(html);
});



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
    var pageno = $(this).attr('pageno');
    var IPList = $("#IPList").val();
    var filtertradmark = $("#filtertradmark").val();
    var txtapplicationno = $("#txtapplicationno").val();
    var searchclass = $("#searchclass").val();
    var searchtype = $("#searchtype").val();
    var searchstatus = $("#searchstatus").val();
    var txtdateapplicationfrom = $("#txtdateapplicationfrom").val();
    var txtdateapplicationto = $("#txtdateapplicationto").val();
    var searchuserdetetail = $("#searchuserdetetail").val();
    var txtProprietor = $("#txtProprietor").val();
    var JurisdictionList = $("#JurisdictionList").val();
    var usedsincefrom = $("#usedsincefrom").val();
    var usedsinceto = $("#usedsinceto").val();

    if (tblSearchstatus != "") {
        searchstatus = tblSearchstatus;
    }
    if (txtdateapplicationfrom != '' && txtdateapplicationfrom != null) {
        txtdateapplicationfrom = convertorightFormat(txtdateapplicationfrom);
    }

    if (txtdateapplicationto != '' && txtdateapplicationto != null) {
        txtdateapplicationto = convertorightFormat(txtdateapplicationto);
    }
    if (appFromDate != '' && appFromDate != null) {
        txtdateapplicationfrom = convertorightFormat(appFromDate);
    }
    if (appToDate != '' && appToDate != null) {
        txtdateapplicationto = convertorightFormat(appToDate);
    }

    //if (hearingFrmDate != "" || hearingFrmDate != 'Invalid Date') {
    //    hearingFrmDate = convertorightFormat(hearingFrmDate);
    //}
    //if (hearingToDate != "" || hearingToDate != 'Invalid Date') {
    //    hearingToDate = convertorightFormat(hearingToDate);
    //}

    window.location = encodeURI("/IPR/ViewAddedTrademarkExportoExcelNewCases?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&applicationno=" + txtapplicationno
        + "&searchclass=" + searchclass + "&searchtype=" + searchtype + "&searchstatus=" + searchstatus + "&txtdateapplicationfrom=" + txtdateapplicationfrom
        + "&searchuserdetetail=" + searchuserdetetail + "&txtProprietor=" + txtProprietor + "&JurisdictionList=" + JurisdictionList
        + "&txtdateapplicationto=" + txtdateapplicationto + "&usedsincefrom=" + usedsincefrom + "&usedsinceto=" + usedsinceto + "&hearingFrmDate=" + hearingFrmDate + "&hearingToDate=" + hearingToDate + "&pagenum=" + pageno + "&pagesize1=10");

});

$(document).on('click', '#CommonExportExcel', function () {
    var chkArray3 = [];
    var selected = $("#od input[type='checkbox']:checked");

    selected.each(function () {
        chkArray3.push($(this).val());
    });
    var selected3;
    selected3 = chkArray3.join(',');
    if (selected3.length > 0) {
    }
    var pageno = $("#id_exportreportdrop").val();
    if (pageno == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }

    var IPList = $("#IPList").val();
    var filtertradmark = $("#filtertradmark").val();
    var txtapplicationno = $("#txtapplicationno").val();
    var searchclass = $("#searchclass").val();
    var searchtype = $("#searchtype").val();
    var searchstatus = $("#searchstatus").val();
    var txtdateapplicationfrom = $("#txtdateapplicationfrom").val();
    var txtdateapplicationto = $("#txtdateapplicationto").val();
    var searchuserdetetail = $("#searchuserdetetail").val();
    var txtProprietor = $("#txtProprietor").val();
    var JurisdictionList = $("#JurisdictionList").val();
    var usedsincefrom = $("#usedsincefrom").val();
    var usedsinceto = $("#usedsinceto").val();

    if (tblSearchstatus != "") {
        searchstatus = tblSearchstatus;
    }
    if (txtdateapplicationfrom != '' && txtdateapplicationfrom != null) {
        txtdateapplicationfrom = convertorightFormat(txtdateapplicationfrom);
    }

    if (txtdateapplicationto != '' && txtdateapplicationto != null) {
        txtdateapplicationto = convertorightFormat(txtdateapplicationto);
    }
    if (appFromDate != '' && appFromDate != null) {
        txtdateapplicationfrom = convertorightFormat(appFromDate);
    }
    if (appToDate != '' && appToDate != null) {
        txtdateapplicationto = convertorightFormat(appToDate);
    }

    window.location = encodeURI("/IPR/ViewAddedTrademarkExportoExcelNewCases?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&applicationno=" + txtapplicationno
        + "&searchclass=" + searchclass + "&searchtype=" + searchtype + "&searchstatus=" + searchstatus + "&txtdateapplicationfrom=" + txtdateapplicationfrom
        + "&searchuserdetetail=" + searchuserdetetail + "&txtProprietor=" + txtProprietor + "&JurisdictionList=" + JurisdictionList
        + "&txtdateapplicationto=" + txtdateapplicationto + "&usedsincefrom=" + usedsincefrom + "&usedsinceto=" + usedsinceto + "&hearingFrmDate=" + hearingFrmDate + "&hearingToDate=" + hearingToDate + "&pagenum=" + pageno + "&pagesize1=10");
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Copyright Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

$(document).on('click', '#advsearchforcopy', function () {
    bindcategoryandstatusforCopyright();
    multiselectwithcheckbox();
    $('#divHide1').css('display', 'block');
    $('#divHide2').css('display', 'block');
    $('#advsearchforcopy').css('display', 'none');
    $('#btncollapseforcopy').css('display', 'block');

})

$(document).on('click', '#btncollapseforcopy', function () {

    $('#divHide1').css('display', 'none');
    $('#divHide2').css('display', 'none');
    $('#btncollapseforcopy').css('display', 'none');
    $('#advsearchforcopy').css('display', 'block');
})

$(document).on('click', '#btnsearchforcopy', function () {
    isRenderPage = false;
    IPRSearchlistForCopyright(pageindex);
});

$(document).on('click', '#openviewaddedcopyright', function () {
    $('#tmdetailsdownload').css("display", "none");
    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spMarkNameDetails').text("Copyrights Information")
    $('#spShowMarkName').text("Copyright Information");
    var html = "";
    var trademarkId = $(this).attr("tradeid");
    var formdata = new FormData();
    formdata.append("tradeid", trademarkId);
    formdata.append("ip", IPname);
    $.ajax({
        async: true,
        url: "/api/IPRApi/loadtrademarkdatabyiid",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;
            $("#bindTrademarkDetails").empty();
            $.each(obj, function (i, val) {
                //alert(val.vJournalNo);
                $('#tmdetailsmodal').attr('tradeiid', val.iid);
                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>Diary Number</h5><span>' + val.vDiaryNo + '</span></li>'
                    + '<li><h5>Date</h5><span>' + convertdate(val.dApplDate) + '</span></li>'
                    + '<li><h5>Title Of Work</h5><span>' + val.vTitleofWork + '</span></li>'
                    + '<li><h5>Category</h5><span>' + (val.vCategory == null ? '' : val.vCategory) + '</span></li>'
                    + '<li><h5>Applicant</h5><span>' + val.vApplicantName + '</span></li>'
                    + '<li><h5>No. Of Pages</h5><span>' + (val.NoofPages == null ? '' : val.NoofPages) + '</span></li>'
                    + '<li><h5>ROC Number</h5><span>' + (val.vROCNumber == null ? '' : val.vROCNumber) + '</span></li>'
                    + '</ul></div>';

                $("#bindTrademarkDetails").html(html);


                //html = '<tr><td width=200px >Diary Number</td><td>:</td><td>' + val.vDiaryNo + '</td></tr>'
                //    + '<tr><td>Date</td><td>:</td><td>' + convertdate(val.dApplDate) + '</td></tr>'
                //    + '<tr><td>Title Of Work</td><td>:</td><td>' + val.vTitleofWork + '</td></tr>'
                //    + '<tr><td>Category</td><td>:</td><td>' + (val.vCategory == null ? '' : val.vCategory) + '</td></tr>'
                //    + '<tr><td>Applicant</td><td>:</td><td>' + val.vApplicantName + '</td></tr>'
                //    + '<tr><td>No. Of Pages</td><td>:</td><td>' + (val.NoofPages == null ? '' : val.NoofPages) + '</td></tr>'
                //    + '<tr><td>ROC Number</td><td>:</td><td>' + (val.vROCNumber == null ? '' : val.vROCNumber) + '</td></tr>'
                //$("#bindTrademarkDetails").html(html);
            });
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX er

    });

});

$(document).on('click', '#btnclearforcopy', function () {

    $('#filtertradmark').val('');
    $('#txtdiaryno').val('');
    $('#ctgry').val('');
    $('#ctgry1').val('');
    $('#ctgry1').multiselect('reload');
    $('#statusforcopyright').val('');
    $('#statusforcopyright').multiselect('reload');
    $('#txtdatefrom').val('');
    $('#txtdateto').val('');
    $('#txtapplicant').val('');
    $('#txtroc').val('');
    IPRSearchlistForCopyright(pageindex);
});

function IPRSearchlistForCopyright(pageindex) {
    var htmls = '';
    var IPList = '2'
    var filtertradmark = $("#filtertradmark").val();

    var txtdiaryno = "";
    if (tblDairyNo != "") {
        txtdiaryno = tblDairyNo;
    }
    else {
        txtdiaryno = $("#txtdiaryno").val();
    }
    var category = $("#ctgry1").val();
    if (category == undefined || category == 'undefined') {
        category = "";
    }
    var datefrom = $("#txtdatefrom").val();
    var dateto = $("#txtdateto").val();
    var applicant = "";
    if (tblCopyApplnName != "") {
        applicant = tblCopyApplnName
    }
    else {
        applicant = $("#txtapplicant").val();
    }
    if (applicant == undefined) {
        applicant = "";
    }
    var rocno = $("#txtroc").val();
    if (rocno == undefined) {
        rocno = "";
    }
    var statusforcopyright = $("#statusforcopyright").val();
    if (statusforcopyright == undefined) {
        statusforcopyright = "";
    }
    var iprcounter = $("#hdncounter").val();
    if (iprcounter == undefined || iprcounter == null) {
        iprcounter = "";
    }

    if (datefrom == "" && dateto != "") {
        alert("Enter From Date.");
    }
    else if (datefrom != "" && dateto == "") {
        alert("Enter To Date.");
    }

    if (datefrom == undefined) {
        datefrom = "";
    }
    if (dateto == undefined) {
        dateto = "";
    }
    if (iprcounter == 0) {
        iprcounter = $("hdncounter").val(1);
    }

    var formData = new FormData();
    formData.append("IPList", IPList);
    formData.append("filtertradmark", filtertradmark);
    formData.append("txtdiaryno", txtdiaryno);
    formData.append("ctgry", category);
    formData.append("txtdatefrom", datefrom);
    formData.append("txtdateto", dateto);
    formData.append("txtApplicant", applicant);
    formData.append("txtroc", rocno);
    formData.append("hdncounter", iprcounter);
    formData.append("statusforcopyright", statusforcopyright);
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);
    formData.append("vsort", $("#hdnsort").val());
    openload();
    $.ajax(
        {
            //async: true,
            type: "POST",
            url: "/api/IPRApi/ViewAddedCopyrightDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                var obj1 = obj;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    $("#dtNotFound").html("");
                    $.each(obj1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = val.TotalRecord;
                        //    var totpage = 0;
                        //    if (val.TotalRecord > 0) {
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
                        //    $("#exportrecords").val(val.TotalRecord);
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'

                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#trademarkcount").text("(" + val.TotalRecord + ")");
                            $("#exportrecords").val(val.TotalRecord);
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
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
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        htmls += `<tr>
    <td id="rowid" style="display:none;">${val.RowId}</td>
    <td id="wordmark" class=""> <span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${val.vTitleofWork}</td>
    <td id="applno" ><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${val.vApplicantName}</td></td>
    <td id="prop">${val.vDiaryNo}</td>
    <td>${val.StatusName}</td>
    <td>${convertdateCopyright(val.dApplDate)}</td>
    <td>${val.vCategoryName}</td>
    <td>
        <ul class="table_action">
            <li>
                <a href="javascript:void(0);" class="taskoutboxbtnicon" title="Information retrieved from IP registry"
                   id="openviewaddedcopyright" data-toggle="modal" data-target="#viewaddedtrademarkdata"
                   tradeid="${val.Tradeiid}">
                    <img src="/newassets/img/eye.svg" alt="View" />
                </a>
            </li>
            <li>
                <a href="javascript:void(0);" class="taskoutboxbtnicon" title="Remove Copyright Information"
                   id="removecopyright" tradeid="${val.Tradeiid}" iid="${val.iid}">
                    <img src="/newassets/img/delete.svg" alt="Delete" />
                </a>
            </li>
        </ul>
    </td>
</tr>`;

                    });
                } else {
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    $("#dtNotFound").html('<center>No Copyright found</center>');
                }
                $("#bindIPRSearchData").html("").html(htmls);
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

var tblCopyApplnName = "";
$(document).on('click', '#searchbyApplName', function () {
    isRenderPage = false;
    tblCopyApplnName = $("#txttblapplName").val();
    IPRSearchlistForCopyright(pageindex)
    $("#searchbyApplName").css("display", "none");
    $("#clearSearchByAppName").css("display", "block");
});
$(document).on('click', '#clearSearchByAppName', function () {
    isRenderPage = false;
    tblCopyApplnName = "";
    $("#txttblapplName").val("");
    IPRSearchlistForCopyright(pageindex)
    $("#searchbyApplName").css("display", "block");
    $("#clearSearchByAppName").css("display", "none");
});
var tblDairyNo = "";
$(document).on('click', '#searchbyDairyNo', function () {
    isRenderPage = false;
    tblDairyNo = $("#txttbldairyNo").val();
    IPRSearchlistForCopyright(pageindex)
    $("#searchbyDairyNo").css("display", "none");
    $("#clearSearchByDairyNo").css("display", "block");
});
$(document).on('click', '#clearSearchByDairyNo', function () {
    isRenderPage = false;
    tblDairyNo = "";
    $("#txttbldairyNo").val("");
    IPRSearchlistForCopyright(pageindex)
    $("#searchbyDairyNo").css("display", "block");
    $("#clearSearchByDairyNo").css("display", "none");
});

function emptyDivContentforCopyright() {

    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#btns').empty();
    $('#thval').empty();
    $('#dynaction').empty();
}

function fillDivContentforCopyright() {
    //var content2 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Category</span></label><select class="form-control InputFormat" name="languageSelect[]" id="ctgry1"></select></div></div>`;
    //var content3 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date - From</span></label><input class="inputFormat" type="date" id="txtdatefrom" onkeypress="return!1"></div></div>`;
    //var content4 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date - To</span></label><input class="inputFormat" type="date" id="txtdateto" onkeypress="return!1"></div></div>`;

    var content2 = `

    <div class="col-md-12 form-group">
      <label>
        Category
      </label>
      <select class="form-control inputFormat" name="languageSelect[]" id="ctgry1"></select>
    </div>
  `;

    var content3 = `
 
    <div class="col-md-6 form-group">
      <label>
       Date - From
      </label>
      <input class="inputFormat" type="date" id="txtdatefrom" onkeypress="return false;">
    </div>
  `;

    var content4 = `
    <div class="col-md-6 form-group">
      <label>
       Date - To
      </label>
      <input class="inputFormat" type="date" id="txtdateto" onkeypress="return false;">
    </div>
 `;


    $('#divHide1').append(content2, content3, content4);

    //var content5 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Applicant Name</span></label><input type="text" class="inputFormat" placeholder="Enter Applicant Name" id="txtapplicant"></div></div>`;
    //var content6 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">ROC No.</span></label><input type="text" class="inputFormat" placeholder="Enter ROC No." id="txtroc"></div></div>`;
    //var content7 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="form-control InputFormat" name="languageSelect[]" id="statusforcopyright" multiple="multiple"></select></div></div>`;
    var content5 = `
    <div class="col-md-12 form-group">
      <label>Applicant Name
      </label>
      <input type="text" class="inputFormat" placeholder="Enter Applicant Name" id="txtapplicant">
    </div>
  `;

    var content6 = `

    <div class="col-md-12 form-group">
      <label>ROC No.
      </label>
      <input type="text" class="inputFormat" placeholder="Enter ROC No." id="txtroc">
    </div>
  `;

    var content7 = `

    <div class="col-md-12 form-group">
      <label>Status
      </label>
      <select class="form-control inputFormat" name="languageSelect[]" id="statusforcopyright" multiple="multiple"></select>
    </div>
  `;

    $('#divHide2').append(content5, content6, content7);
    var content8 = `
  
    <button type="submit" id="btnclearforcopy" class="btn btn-secondary" value="CLEAR">
      Clear
    </button>
    <button type="submit" id="btnsearchforcopy" class="btn btn-primary " value="SEARCH">
      Confirm
    </button>
 `;

    //var content8 = `<div class="col-md-6"><button type="submit" id="btnclearforcopy" class="btn btn-primary pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-6"><button type="submit" id="btnsearchforcopy" class="btn btn-primary pull-right" value="SEARCH" style="width:100%">Confirm</button></div>`;
    $('#btns').append(content8);

    var content9 = `<th style="display:none;"><div class="thbg">S.No</div></th>`;
    var content10 = `<th class="head_fix"><div class="thbg">Applicant Name<button type="button" id="sortdesignno" class="btn-style" style="position:relative;left:15px" value="ApplicantName" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    //var content10 = `<th><div style="float:left;width:264px;">
    //                 <input type="text" id="txttblapplName" placeholder="Application Name" class="form-control pull-left" syle="position: relative;">
    //                 <div><span class="glyphicon glyphicon-search" id="searchbyApplName" style="margin:8px 0 0 -25px !important;float:right; padding-right:20px; display:block"></span>
    //                 <span id="clearSearchByAppName" style="display:block;font-size:15px;color:black; font-weight:200;cursor:pointer; margin: 7px 7 0 257px !important;">x</span>
    //               </div>
    //             </div></th>`;
    var content11 = `<th><div class="thbg">Title Of Work<button type="button" id="sorttitle" class="btn-style" style="position:relative;left:15px" value="TitleOfWork" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    var content12 = `<th><div class="thbg">Diary No.<button type="button" id="sortdiaryno" class="btn-style" style="position:relative;left:15px" value="DiaryNo" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    //var content12 = `<th><div style="float:left;width:264px;">
    //                 <input type="text" id="txttbldairyNo" placeholder="Diary No." class="form-control pull-left" syle="position: relative;">
    //                 <div><span class="glyphicon glyphicon-search" id="searchbyDairyNo" style="margin:8px 0 0 -25px !important;float:right; padding-right:20px; display:block"></span>
    //                 <span id="clearSearchByDairyNo" style="display:block;font-size:15px;color:black; font-weight:200;cursor:pointer; margin: 7px 7 0 257px !important;">x</span>
    //               </div>
    //             </div></th>`;
    var content13 = `<th><div class="thbg">Status<button type="button" id="sortstatus" class="btn-style" style="position:relative;left:15px" value="Status" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    var content14 = `<th><div class="thbg">Date Of Application<button type="button" id="sortapplication" class="btn-style" style="position:relative;left:15px" value="DateOfApplication" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    var content15 = `<th><div class="thbg">Category<button type="button" id="sortcategory" class="btn-style" style="position:relative;left:15px" value="Category" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    var content16 = `<th><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>`
    $('#thval').append(content9, content11, content10, content12, content13, content14, content15, content16);

    var content17 = '<li><a id="oexcelforcopyright" title="Export to Excel"><span style="padding: 0 10px 0 0;"><img src="/newassets/img/exportexl-icon.png"></span>Export to Excel</a></li><li><a id="opdfforcopyright" title="Export to PDF"><span style="padding: 0 10px 0 0;"><img src="/newassets/img/exportpdf-icon.png"></span>Export to PDF</a></li>'
    $('#dynaction').append(content17);

    //if ($('#hdnRoleID').val() == "1") {
    //    var content18 = '<li><a href="javascript:void()" id="deleteTrademakeks" title="Delete">Delete Copyright Request</a></li>'
    //    $('#dynaction').append(content18);
    //}

    $('#modalText').text('Copyright Information');
    $('#txtapplicationno').attr('id', 'txtdiaryno');
}

function bindcategoryandstatusforCopyright() {
    var Ip = '2';
    var formData = new FormData();
    formData.append('ip', Ip);

    $.ajax({

        async: true,
        type: "POST",
        url: "/api/IPRApi/FetchDropdownValues",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response) {
            var obj = JSON.parse(response.Data.data);
            var obj1 = obj.data;
            $('#ctgry1').html('');
            $('#statusforcopyright').html('');
            $('#ctgry1').append('<option value="">Select</option>');
            $.each(obj1, function (i, val) {

                var data = val.vCategoryName;
                if (data != null) {
                    $('#ctgry1').append('<option value=' + data + '>' + data + '</option>');
                }
                var data1 = val.vStatusName;
                if (data1 != null) {
                    $('#statusforcopyright').append('<option value="' + data1 + '">' + data1 + '</option>')
                }
            });
            //  $("#ctgry1").multiselect('reload');
            $('#statusforcopyright').multiselect('reload');
        },

        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
    });
}

function multiselectwithcheckbox() {
    $('#statusforcopyright').multiselect({
        columns: 1,
        placeholder: 'Select Status'
    });
}

$(document).on('click', '#oexcelforcopyrightF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td><ul class="table_action"><li><span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoexcelcopyright" pageno="' + i + '" type="excel"><img src="/newassets/img/download.svg" /></span> </li></ul></td>';
        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#oexcelforcopyright', function () {

    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropCopyExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelCopy">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropCopyExcel").html(html);
});

$(document).on("click", "#CommonExportExcelCopy", function () {
    var pagenum = $("#id_exportreportdropCopyExcel").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }

    var filtertradmark = $('#filtertradmark').val();
    var txtdiaryno = $('#txtdiaryno').val();
    var ctgry1 = $('#ctgry1').val();
    var txtdatefrom = $('#txtdatefrom').val();
    var txtdateto = $('#txtdateto').val();
    var txtapplicant = $('#txtapplicant').val();
    var txtroc = $('#txtroc').val();
    var statusforcopyright = $('#statusforcopyright').val();
    window.location = encodeURI('/IPR/ViewAddedCopyrightExportoExcelNewCases?filtertradmark=' + filtertradmark + '&txtdiaryno=' + txtdiaryno + '&ctgry1=' + ctgry1 + '&txtdatefrom=' + txtdatefrom + '&txtdateto=' + txtdateto + '&txtApplicant=' + txtapplicant + '&statusforcopyright=' + statusforcopyright + '&txtroc=' + txtroc + '&pagenum=' + pagenum + '&pagesize=10');
});
$(document).on('click', '#exporttoexcelcopyright', function () {
    var pagenum = $(this).attr('pageno');
    var filtertradmark = $('#filtertradmark').val();
    var txtdiaryno = $('#txtdiaryno').val();
    var ctgry1 = $('#ctgry1').val();
    var txtdatefrom = $('#txtdatefrom').val();
    var txtdateto = $('#txtdateto').val();
    var txtapplicant = $('#txtapplicant').val();
    var txtroc = $('#txtroc').val();
    var statusforcopyright = $('#statusforcopyright').val();
    window.location = encodeURI('/IPR/ViewAddedCopyrightExportoExcelNewCases?filtertradmark=' + filtertradmark + '&txtdiaryno=' + txtdiaryno + '&ctgry1=' + ctgry1 + '&txtdatefrom=' + txtdatefrom + '&txtdateto=' + txtdateto + '&txtApplicant=' + txtapplicant + '&statusforcopyright=' + statusforcopyright + '&txtroc=' + txtroc + '&pagenum=' + pagenum + '&pagesize=10');
});

$(document).on('click', '#removecopyright', function () {

    var trademarkId = $(this).attr("tradeid");
    var iid = $(this).attr("iid");
    $("#ids_deleteTraderequesr").text("Delete Copyright Request");
    $("#msgRUSure1").text("Are you sure you want to delete this copyright?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", trademarkId);
    $("#deleteTrademarkDetails").attr("tradeid-val", iid);

});


$(document).on('click', '#opdfforcopyrightF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td><ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer; color:#069;" id="exporttopdfcopyright" pageno="' + i + '" type="pdf">' +
            '<img src="/newassets/img/download.svg" />' +
            '</span>' +
            '</li>' +
            '</ul></td>';

        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#opdfforcopyright', function () {
    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropCopyRights"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportPdfCopy">Confirm</button>';
    displayImage = '<img src="/newassets/img/pdf-export.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropCopyRights").html(html);
});

/**End Copy right section */

/*Download Patent in excel format */
$(document).on('click', '#oexcelforPatentF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td><ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer; color:#069;" id="exporttoexcelPatent" pageno="' + i + '" type="excel">' +
            '<img src="/newassets/img/download.svg" />' +
            '</span>' +
            '</li>' +
            '</ul></td>';

        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#oexcelforPatent', function () {
    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropPatentExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelPatent">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';
    $("#spDisplayImage").html(displayImage);
    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);

    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropPatentExcel").html(html);
});
$(document).on('click', "#CommonExportExcelPatent", function () {
    var pagenum = $("#id_exportreportdropPatentExcel").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var searchtext = $("#filtertradmark").val();
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#patentno').val();
    var status = $("#searchstatusforpatent").val();
    var applicant = $("#txtapplicant").val();
    var datefrom = $("#datefrom").val();
    var dateto = $("#dateto").val();
    var pdatefrom = $("#pdatefrom").val();
    var pdateto = $("#pdateto").val();
    var pubDateFrom = $("#pubdatefrom").val();
    var pubDateTo = $("#pubdateto").val();
    window.location = encodeURI('/IPR/ExportAddedPatentToExcel?filtertradmark=' + searchtext + '&applicationno=' + applicationno + '&applicant=' + applicant + '&patentno=' + patentno + '&status=' + status + '&datefrom=' + datefrom + '&dateto=' + dateto + '&pdatefrom=' + pdatefrom + '&pdateto=' + pdateto + '&pubDateFrom=' + pubDateFrom + '&pubDateTo=' + pubDateTo + '&pagenum=' + pagenum + '&pagesize=10');
})

$(document).on('click', '#exporttoexcelPatent', function () {
    var pagenum = $(this).attr('pageno');
    var searchtext = $("#filtertradmark").val();
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#patentno').val();
    var status = $("#searchstatusforpatent").val();
    var applicant = $("#txtapplicant").val();
    var datefrom = $("#datefrom").val();
    var dateto = $("#dateto").val();
    var pdatefrom = $("#pdatefrom").val();
    var pdateto = $("#pdateto").val();
    var pubDateFrom = $("#pubdatefrom").val();
    var pubDateTo = $("#pubdateto").val();

    window.location = encodeURI('/IPR/ExportAddedPatentToExcel?filtertradmark=' + searchtext + '&applicationno=' + applicationno + '&applicant=' + applicant + '&patentno=' + patentno + '&status=' + status + '&datefrom=' + datefrom + '&dateto=' + dateto + '&pdatefrom=' + pdatefrom + '&pdateto=' + pdateto + '&pubDateFrom=' + pubDateFrom + '&pubDateTo=' + pubDateTo + '&pagenum=' + pagenum + '&pagesize=10');
});


$(document).on('click', '#pdfforPatentF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td><ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer; color:#069;" id="exporttopdfforPatent" pageno="' + i + '" type="pdf">' +
            '<img src="/newassets/img/download.svg" />' +
            '</span>' +
            '</li>' +
            '</ul></td>';

        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#pdfforPatent', function () {
    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropPatentPdf"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportPdfPatent">Confirm</button>';
    displayImage = '<img src="/newassets/img/pdf-export.png" style="margin:-15px 0px 0 -15px">';
    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropPatentPdf").html(html);
});
$(document).on('click', "#CommonExportPdfPatent", function () {
    var pagenum = $("#id_exportreportdropPatentPdf").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var searchtext = $("#filtertradmark").val();
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#patentno').val();
    var status = $("#searchstatusforpatent").val();
    var applicant = $("#txtapplicant").val();
    var datefrom = $("#datefrom").val();
    var dateto = $("#dateto").val();
    var pdatefrom = $("#pdatefrom").val();
    var pdateto = $("#pdateto").val();
    var pubDateFrom = $("#pubdatefrom").val();
    var pubDateTo = $("#pubdateto").val();

    var statusforcopyright = $('#statusforcopyright').val();
    window.location = encodeURI('/IPR/ViewAddedPatentExportoPdf?filtertradmark=' + searchtext + '&applicationno=' + applicationno + '&applicant=' + applicant + '&patentno=' + patentno + '&status=' + status + '&datefrom=' + datefrom + '&dateto=' + dateto + '&pdatefrom=' + pdatefrom + '&pdateto=' + pdateto + '&pubDateFrom=' + pubDateFrom + '&pubDateTo=' + pubDateTo + '&pagenum=' + pagenum + '&pagesize=10');
});

$(document).on('click', '#exporttopdfforPatent', function () {
    var pagenum = $(this).attr('pageno');
    var searchtext = $("#filtertradmark").val();
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#patentno').val();
    var status = $("#searchstatusforpatent").val();
    var applicant = $("#txtapplicant").val();
    var datefrom = $("#datefrom").val();
    var dateto = $("#dateto").val();
    var pdatefrom = $("#pdatefrom").val();
    var pdateto = $("#pdateto").val();
    var pubDateFrom = $("#pubdatefrom").val();
    var pubDateTo = $("#pubdateto").val();

    var statusforcopyright = $('#statusforcopyright').val();
    window.location = encodeURI('/IPR/ViewAddedPatentExportoPdf?filtertradmark=' + searchtext + '&applicationno=' + applicationno + '&applicant=' + applicant + '&patentno=' + patentno + '&status=' + status + '&datefrom=' + datefrom + '&dateto=' + dateto + '&pdatefrom=' + pdatefrom + '&pdateto=' + pdateto + '&pubDateFrom=' + pubDateFrom + '&pubDateTo=' + pubDateTo + '&pagenum=' + pagenum + '&pagesize=10');
});

/*End patent download*/

/*Download copyright detail in pdf*/
$(document).on('click', '#exporttopdfcopyright', function () {
    var pagenum = $(this).attr('pageno');
    var filtertradmark = $('#filtertradmark').val();
    var txtdiaryno = $('#txtdiaryno').val();
    var ctgry1 = $('#ctgry1').val();
    var txtdatefrom = $('#txtdatefrom').val();
    var txtdateto = $('#txtdateto').val();
    var txtapplicant = $('#txtapplicant').val();
    var txtroc = $('#txtroc').val();
    var statusforcopyright = $('#statusforcopyright').val();
    window.location = encodeURI('/IPR/ViewAddedCopyrightExportoPdfNewCases?filtertradmark=' + filtertradmark + '&txtdiaryno=' + txtdiaryno + '&ctgry1=' + ctgry1 + '&txtdatefrom=' + txtdatefrom + '&txtdateto=' + txtdateto + '&txtApplicant=' + txtapplicant + '&statusforcopyright=' + statusforcopyright + '&txtroc=' + txtroc + '&pagenum=' + pagenum + '&pagesize=10');
});
$(document).on('click', "#CommonExportPdfCopy", function () {
    var pagenum = $("#id_exportreportdropCopyRights").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var filtertradmark = $('#filtertradmark').val();
    var txtdiaryno = $('#txtdiaryno').val();
    var ctgry1 = $('#ctgry1').val();
    var txtdatefrom = $('#txtdatefrom').val();
    var txtdateto = $('#txtdateto').val();
    var txtapplicant = $('#txtapplicant').val();
    var txtroc = $('#txtroc').val();
    var statusforcopyright = $('#statusforcopyright').val();
    window.location = encodeURI('/IPR/ViewAddedCopyrightExportoPdfNewCases?filtertradmark=' + filtertradmark + '&txtdiaryno=' + txtdiaryno + '&ctgry1=' + ctgry1 + '&txtdatefrom=' + txtdatefrom + '&txtdateto=' + txtdateto + '&txtApplicant=' + txtapplicant + '&statusforcopyright=' + statusforcopyright + '&txtroc=' + txtroc + '&pagenum=' + pagenum + '&pagesize=10');
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Patent xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function emptyDivContentforPatent() {
    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#btns').empty();
    $('#thval').empty();
    $('#dynaction').empty();
}

function fillDivContentforPatent() {
    //var content2 = '<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Patent No</span></label><input type="text" class="inputFormat" placeholder="Enter Patent No." id="patentno"></div>';
    //var content5 = '<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchstatusforpatent"></select></div>';
    //var content6 = '<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Name Of Applicant</span></label><input type="text" placeholder="Enter Applicant Name" class="inputFormat" id="txtapplicant"></div>';

    var content2 = `
  <div class="col-md-12 form-group">
    <label>Patent No
    </label>
    <input type="text" class="inputFormat" placeholder="Enter Patent No." id="patentno">
  </div>`;

    var content5 = `
  <div class="col-md-12 form-group">
    <label>Status
    </label>
    <select class="form-control inputFormat" name="languageSelect[]" id="searchstatusforpatent"></select>
  </div>`;

    var content6 = `
  <div class="col-md-12 form-group">
    <label>Name Of Applicant
    </label>
    <input type="text" class="inputFormat" placeholder="Enter Applicant Name" id="txtapplicant">
  </div>`;



    $('#divHide1').append(content2, content5, content6);

    //var contentRadio = '<div class="col-md-4"><div class="form-group col-md-12"><p style="margin-bottom: 3px;">Select Date</p><input type="radio" id="selectDateId" name="fav_language" class="selectDateClass" value="FilingD" checked><label class="control-label" for="FilingD">&nbsp;Date Of Filing &nbsp;</label> <input type="radio" class="selectDateClass" id="IdPriority" name="fav_language" value="Priority"><label class="control-label" for="PriorityD">&nbsp;Priority Date&nbsp;</label><input type="radio" class="selectDateClass" id="javascript" name="fav_language" value="PublicationD"><label class="control-label" for="PublicationD">&nbsp;Publication Date&nbsp;</label></div></div>';
    //var contentRadio = '<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date Type</span></label><br><div class=""><input type="radio" id="selectDateId" name="fav_language" class="selectDateClass" value="FilingD" checked><label class="control-label" for="FilingD">&nbsp;Date Of Filing &nbsp;</label> <input type="radio" class="selectDateClass" id="IdPriority" name="fav_language" value="Priority"><label class="control-label" for="PriorityD">&nbsp;Priority Date&nbsp;</label></div>';
    //var content3 = '<div id="divDateFillingFrom"><div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">From</span></label><input class="inputFormat" type="date" id="datefrom" onkeypress="return!1"></div></div></div>';
    //var content4 = '<div id="divDateFillingTo"><div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">To</span></label><input class="inputFormat" type="date" id="dateto" onkeypress="return!1"></div></div></div>';
    //var content7 = '<div style="display:none" id="divDatePriorityFrom"><div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">From</span></label><input class="inputFormat" type="date" id="pdatefrom" onkeypress="return!1"></div></div></div>';
    //var content8 = '<div style="display:none" id="divDatePriorityTo"><div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">To</span></label><input class="inputFormat" type="date" id="pdateto" onkeypress="return!1"></div></div></div>';
    //var content7P = '<div style="display:none" id="divDatePubFrom"><div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">From</span></label><input class="inputFormat" type="date" id="pubdatefrom" onkeypress="return!1"></div></div></div>';
    //var content8P = '<div style="display:none" id="divDatePubTo"><div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">To</span></label><input class="inputFormat" type="date" id="pubdateto" onkeypress="return!1"></div></div></div>';

    var contentRadio = `
<div class="wrapper_form_feild" style="margin:9px 0 5px 0;">
<div class="col-md-12 form-group">
  <label >Date Type
  </label>
<div class="form-check_wrapper"> 
  <div class="form-check">
    <input class="form-check-input selectDateClass" type="radio" name="fav_language" id="selectDateId" value="FilingD" checked>
    <label class="form-check-label" for="selectDateId">
      Date Of Filing
    </label>
  </div>

  <div class="form-check">
    <input class="form-check-input selectDateClass" type="radio" name="fav_language" id="IdPriority" value="Priority">
    <label class="form-check-label" for="IdPriority">
      Priority Date
    </label>
  </div>
</div>
</div>
</div>
`;

    var content3 = `
  <div class="col-md-6 wrapper_form_feild" id="divDateFillingFrom">
   
      <div class="form-group">
        <label >From
        </label>
        <input class="inputFormat" type="date" id="datefrom" onkeypress="return false;">
      </div>
   
  </div>`;

    var content4 = `
  <div class="col-md-6 wrapper_form_feild" id="divDateFillingTo">
   
      <div class="form-group">
        <label>To
        </label>
        <input class="inputFormat" type="date" id="dateto" onkeypress="return false;">
      </div>
    
  </div>`;

    var content7 = `
  <div class="col-md-6 wrapper_form_feild" id="divDatePriorityFrom" style="display:none;">
   
      <div class="form-group">
        <label>From
        </label>
        <input class="inputFormat" type="date" id="pdatefrom" onkeypress="return false;">
      </div>
    
  </div>`;

    var content8 = `
  <div class="col-md-6 wrapper_form_feild" id="divDatePriorityTo" style="display:none;">
   
      <div class="form-group">
        <label>To
        </label>
        <input class="inputFormat" type="date" id="pdateto" onkeypress="return false;">
      </div>
    
  </div>`;

    var content7P = `
  <div class="col-md-6 wrapper_form_feild" id="divDatePubFrom" style="display:none;">
  
      <div class="form-group">
        <label>From
        </label>
        <input class="inputFormat" type="date" id="pubdatefrom" onkeypress="return false;">
      </div>
    </div>
  </div>`;

    var content8P = `
  <div class="col-md-6 wrapper_form_feild" id="divDatePubTo" style="display:none;">
    
      <div class="form-group">
        <label >To
        </label>
        <input class="inputFormat" type="date" id="pubdateto" onkeypress="return false;">
      </div>
    
  </div>`;


    $('#divHide2').append(contentRadio, content3, content4, content7, content8, content7P, content8P);

    //var content9 = '<div class="col-md-2"><button type="submit" id="btnsearchforpatent" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnclearforpatent" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-3" style="display:none" id="btncollapseforpatent"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-3"><button type="submit" id="advsearchforpatent" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div>';
    var content9 = '<button type="submit" id="btnclearforpatent" class="btn btn-secondary" value="CLEAR">Clear</button><button type="submit" id="btnsearchforpatent" class="btn btn-primary" value="SEARCH" style="margin-right: 12px;">Confirm</button>';

    $('#btns').append(content9);

    var content10 = `<th style="display:none;" ><div class="thbg">S.No</div></th>`;

    var content11 = `<th id="th1"><div class="thbg">Application No.<button type="button" id="sortapplno" class="btn-style" style="position:relative;left:15px" value="ApplicationNo" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var content12 = `<th><div class="thbg" class="head_fix">Title<button type="button" id="sorttitle" class="btn-style" style="position:relative;left:15px" value="Title" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var content13 = `<th><div class="thbg">Status<button type="button" id="sortstatus" class="btn-style" style="position:relative;left:15px" value="Status" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    /*var content14 = `<th><div class="thbg">Patent Number<button type="button" id="sortpatentno" class="btn-style" style="position:relative;left:15px" value="PatentNo" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;*/

    var content15 = `<th><div class="thbg">Date Of Filing<button type="button" id="sortdof" class="btn-style" style="position:relative;left:15px" value="DOF" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    /*var content16 = `<th><div class="thbg">Documents<button type="button" id="sortdocuments" class="btn-style" style="position:relative;left:15px" value="Documents" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;*/

    var content17 = `<th><div class="thbg">Name Of Applicant<button type="button" id="sortapplicant" class="btn-style" style="position:relative;left:15px" value="ApplicantName" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    /*var content18 = `<th><div class="thbg">Filing Office<button type="button" id="sortfilingoffice" class="btn-style" style="position:relative;left:15px" value="FilingOffice" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;*/

    var content18 = `<th><div class="thbg">Patent No<button type="button" id="patentno" class="btn-style" style="position:relative;left:15px"><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var content19 = `<th><div class="thbg">Status<button type="button" id="sortapplno" class="btn-style" style="position:relative;left:15px" value="vApplNo" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var content20 = `<th><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>`;

    $('#thval').append(content10, content12, content11, content13 /*content14*/, content15, /*content16*/ content17, content18, /*content19,*/ content20);

    var content21 = '<li><a id="oexcelforPatent" title="Export to Excel"><span style="padding: 0 10px 0 0;"><img src="/newassets/img/exportexl-icon.png"></span>Export to Excel</a></li><li><a id="pdfforPatent" title="Export to PDF"><span style="padding: 0 10px 0 0;"><img src="/newassets/img/exportpdf-icon.png"></span>Export to PDF</a></li>'
    $('#dynaction').append(content21);

    //if ($('#hdnRoleID').val() == "1") {
    //    var content22 = '<li><a href="javascript:void()" id="deleteTrademakeks" title="Delete">Delete Patent Request</a></li>'
    //    $('#dynaction').append(content22);
    //}
    $('#modalText').text('Patent Information');
}



$(document).on('click', 'input[type=radio]', function () {

    var checkedValue = $(this).val();
    $("#pubdatefrom").val('');
    $("#pubdateto").val('');
    $("#datefrom").val('');
    $("#dateto").val('');
    $("#pdatefrom").val('');
    $("#pdateto").val('');

    if (checkedValue == "Priority") {
        $('#divDateFillingFrom').css("display", "none");
        $('#divDateFillingTo').css("display", "none");
        $('#divDatePriorityFrom').css("display", "block");
        $('#divDatePriorityTo').css("display", "block");
        $('#divDatePubFrom').css("display", "none");
        $('#divDatePubTo').css("display", "none");
    }
    else if (checkedValue == "PublicationD") {
        $('#divDateFillingFrom').css("display", "none");
        $('#divDateFillingTo').css("display", "none");
        $('#divDatePriorityFrom').css("display", "none");
        $('#divDatePriorityTo').css("display", "none");
        $('#divDatePubFrom').css("display", "block");
        $('#divDatePubTo').css("display", "block");
    }
    else if (checkedValue == "FilingD") {
        $('#divDateFillingFrom').css("display", "block");
        $('#divDateFillingTo').css("display", "block");
        $('#divDatePriorityFrom').css("display", "none");
        $('#divDatePriorityTo').css("display", "none");
        $('#divDatePubFrom').css("display", "none");
        $('#divDatePubTo').css("display", "none");
    }
    else {
        $('#divDateFillingFrom').css("display", "none");
        $('#divDateFillingTo').css("display", "none");
        $('#divDatePriorityFrom').css("display", "none");
        $('#divDatePriorityTo').css("display", "none");
        $('#divDatePubFrom').css("display", "none");
        $('#divDatePubTo').css("display", "none");
    }
});



$(document).on('click', '#advsearchforpatent', function () {
    bindstatusforPatent();
    $('#divHide1').css('display', 'block');
    $('#divHide2').css('display', 'block');
    $('#btncollapseforpatent').css('display', 'block');
    $('#advsearchforpatent').css('display', 'none');
});

$(document).on('click', '#btncollapseforpatent', function () {
    $('#divHide1').css('display', 'none');
    $('#divHide2').css('display', 'none');
    $('#btncollapseforpatent').css('display', 'none');
    $('#advsearchforpatent').css('display', 'block');
});

function IPRSearchlistForPatent(pageindex) {
    var htmls = '';
    var searchtext = $("#filtertradmark").val();
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#patentno').val();
    var status = $("#searchstatusforpatent").val(); /*$("#searchstatusforpatent").val();*/
    var applicant = $("#txtapplicant").val();
    var datefrom = $("#datefrom").val();
    var dateto = $("#dateto").val();
    var pdatefrom = $("#pdatefrom").val();
    var pdateto = $("#pdateto").val();
    var pubDateFrom = $("#pubdatefrom").val();
    var pubDateTo = $("#pubdateto").val();

    //if (datefrom != '' && datefrom != null) {
    //    datefrom = convertorightFormat(datefrom);
    //}
    //if (dateto != '' && dateto != null) {
    //    dateto = convertorightFormat(dateto);
    //}
    //if (pdatefrom != '' && pdatefrom != null) {
    //    pdatefrom = convertorightFormat(pdatefrom);
    //}
    //if (pdateto != '' && pdateto != null) {
    //    pdateto = convertorightFormat(pdateto);
    //}
    //if (pubDateFrom != '' && pubDateFrom != null) {

    //    pubDateFrom = convertorightFormat(pubDateFrom);
    //}
    //if (pubDateTo != '' && pubDateTo != null) {

    //    pubDateTo = convertorightFormat(pubDateTo);
    //}

    if (datefrom == '' ^ dateto == '') {
        alert('Enter Both Form and To Date');
        return false;
    }
    if (pdatefrom == '' ^ pdateto == '') {
        alert('Enter Both Form and To Date');
        return false;
    }
    if (pubDateFrom == '' ^ pubDateTo == '') {
        alert('Enter Both Form and To Date');
        return false;
    }
    if (datefrom == undefined || datefrom == null) {
        datefrom = "";
    }
    if (dateto == undefined || dateto == null) {
        dateto = "";
    }
    if (pdatefrom == undefined || pdatefrom == null) {
        pdatefrom = "";
    }
    if (pdateto == undefined || pdateto == null) {
        pdateto = "";
    }
    if (pdateto == undefined || pdateto == null) {
        pdateto = "";
    }
    if (status == undefined || status == null) {
        status = "";
    }
    if (applicant == undefined || applicant == null) {
        applicant = "";
    }
    if (pubDateFrom == undefined || pubDateFrom == null) {
        pubDateFrom = "";
    }
    if (pubDateTo == undefined || pubDateTo == null) {
        pubDateTo = "";
    }

    openload();
    pagesize = 10;
    var formData = new FormData();
    formData.append("IPList", IPname);
    formData.append("filtertradmark", searchtext);
    formData.append('applicationno', applicationno);
    formData.append("vstatus", status);
    formData.append("applicant", applicant);
    formData.append('patentno', patentno);
    formData.append("datefrom", datefrom);
    formData.append("dateto", dateto);
    formData.append("pdatefrom", pdatefrom);
    formData.append("pdateto", pdateto);
    formData.append("pubDateFrom", pubDateFrom);
    formData.append("pubDateTo", pubDateTo);
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);

    $.ajax(
        {
            //async: true,
            type: "POST",
            url: "/api/IPRApi/ViewAddedPatentDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#trademarkcount").text("");
                $("#exportrecords").val(0);
                $("#dtNotFound").text("");
                if (response1.Data != null && response1.Data.data != '[]') {
                    var obj = response1.Data.data;
                    var length = obj.length;
                    if (length > 0) {
                        $("#pdatastatus").hide();
                        $("#tradePagination").show();
                        $("#dtNotFound").text("");
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //    var pnext = pageindex;
                            //    var pprev = pageindex;
                            //    var pageno = pageindex;
                            //    var totdata = val.TotalRecord;
                            //    var totpage = 0;
                            //    if (val.TotalRecord > 0) {
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
                            //    $("#exportrecords").val(val.TotalRecord);
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += '<li><input type="number" id="pagnumvalue" min="1" class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'

                            //    if (val.TotalRecord <= length) {
                            //    }
                            //    else if (pageno == 1) {
                            //    }
                            //    else if (pageno == totpage) {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            //    }
                            //    else {
                            //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                            //    }
                            //    if (pageno < totpage) {
                            //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }
                            //    tfot += '</ul>'
                            //    $("#ptfooter").html("");
                            //    $("#ptfooter").html(tfot);
                            //}
                            if (i === (length - 1)) {
                                $("#exportrecords").val(val.TotalRecord);
                                $("#trademarkcount").text("(" + val.TotalRecord + ")");
                                var totdata = val.TotalRecord;
                                var totpage = 0;
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#next').hide();
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
                                    setTotalRecord = totpage;
                                    renderPagination(pageindex, totpage);
                                }
                            }
                            htmls += '<tr>';

                            htmls += '<td style="text-align: center; display:none;" id="rowid">' + val.RowId + '</td>';
                            htmls += '<td id="wordmark"> <span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vInventionTitle + '</td>';
                            htmls += '<td id="applno">' + val.vApplNo + '</td><td id="prop">' + val.StatusName + '</td>';
                            htmls += '<td>' + (val.dDateOffiling == "1900-01-01T00:00:00" ? '' : ConvertPatentDate(val.dDateOffiling)) + '</td>';
                            htmls += '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vApplicantName + '</td>';
                            htmls += '<td>' + (val.vPatentNum === "NA" ? '' : val.vPatentNum) + '</td>';
                            htmls += '<td><ul class="table_action">';
                            htmls += '<li>';
                            htmls += '<a href="javascript:void(0);" class="taskoutboxbtnicon" title="Information retrieved from IP registry" id="openviewaddedpatent" data-toggle="modal" data-target="#viewaddedtrademarkdata" tradeid = "' + val.Tradeiid + '" ><img src="/newassets/img/eye.svg" alt="View" /></a>'
                            htmls += '</li>';
                            htmls += '<li>';
                            htmls += '<a href="javascript:void(0);" class="taskoutboxbtnicon" title="Remove Patent Information" id="removePatent" tradeid="' + val.Tradeiid + '" iid="' + val.iid + '"> <img src="/newassets/img/delete.svg" alt="Delete"/></a>'
                            htmls += '</li>'
                            if (val.DocCount != null && val.DocCount > 0) {
                                htmls += '<li>';
                                htmls += '<a href="javascript:void(0);" class="taskoutboxbtnicon" title="File" id="PatentFile" style="display:none" data-toggle="modal" data-target="#FileModal" tradeid="' + val.vApplNo + '"> <img src="/newassets/img/folder-icon.png" alt="File" style="width: 20px; height: 20px;" /></a>';
                                htmls += '</li>';
                            }
                            if (val.DecisionDocCount != null && val.DecisionDocCount > 0) {
                                htmls += '<li>';
                                htmls += '<a href="javascript:void(0);" class="taskoutboxbtnicon" title="Decisions and orders" style="display:none" id="DecisionDocPatentFile" data-toggle="modal" data-target="#FileModal" tradeid="' + val.vApplNo + '"><img src="/newassets/img/book-icon.png" alt="Decisions and orders"/></a>'
                                htmls += '</li>';
                            }
                            htmls += '</ul>';
                            htmls += '</td>';
                            htmls += '</tr>';
                        });
                    } else {
                        $("#trademarkcount").text("");
                        $("#pdatastatus").show();
                        $("#tradePagination").hide();
                        $("#dtNotFound").html('<center>No Patents found</center> ');
                        //htmls += '<tr>'
                        //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                        //htmls += '<tr>'
                    }
                }
                else {
                    $("#trademarkcount").text("");
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                }
                $("#bindIPRSearchData").html("").html(htmls);
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


function bindstatusforPatent() {
    var Ip = '3';
    var formData = new FormData();
    formData.append('ip', Ip);

    $.ajax({

        async: true,
        type: "POST",
        url: "/api/IPRApi/FetchDropdownValues",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response) {
            var obj = JSON.parse(response.Data.data);
            var obj1 = obj.data;
            $('#searchstatusforpatent').html('');
            $('#searchstatusforpatent').append('<option value="">Select Status</option>');
            $.each(obj1, function (i, val) {
                var data1 = val.StatusName;
                if (data1 != null) {
                    $('#searchstatusforpatent').append('<option value="' + data1 + '">' + data1 + '</option>')
                }
            });
            //  $('#searchstatusforPatent').multiselect('reload');
        },

        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
    });
}

$(document).on('click', '#openviewaddedpatent', function () {
    $('#tmdetailsdownload').css("display", "none");
    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");

    $('#spShowMarkName').text("Patent Information");
    $('#spMarkNameDetails').text("Patent Information")
    var html = "";
    var trademarkId = $(this).attr("tradeid");
    $('#tmdetailsmodal').attr('tradeiid', trademarkId);

    var formdata = new FormData();
    formdata.append("tradeid", trademarkId);
    formdata.append("ip", IPname);
    $.ajax({
        async: true,
        url: "/api/IPRApi/loadtrademarkdatabyiid",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;
            $("#bindTrademarkDetails").empty();
            $.each(obj, function (i, val) {
                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>Application Number</h5><span>' + val.vApplNo + '</span></li>'
                    + '<li><h5>Publication Number</h5><span>' + isNullCheck(val.vPublicationNo) + '</span></li>'
                    + '<li><h5>Publication Date</h5><span>' + (val.dPublicationDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dPublicationDate)) + '</span></li>'
                    + '<li><h5>Date Of Filing Of Application</h5><span>' + (val.dDateOffiling == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dDateOffiling)) + '</span></li>'
                    + '<li><h5>Title Of The Invention</h5><span>' + isNullCheck(val.vInventionTitle) + '</span></li>'
                    + '<li><h5>Internal Classification</h5><span>' + isNullCheck(val.vClassification) + '</span></li>'
                    + '<li><h5>Priority Document No.</h5><span>' + isNullCheck(val.vPriorityDocumentNo) + '</span></li>'
                    + '<li><h5>Priority Date</h5><span>' + (val.dPriorityDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dPriorityDate)) + '</span></li>'
                    + '<li><h5>Name Of Priority Country</h5><span>' + isNullCheck(val.vPriorityCountryName) + '</span></li>'
                    + '<li><h5>Patent Of Addition To Application Number Filing Date</h5><span>' + (val.dAdditionAppNoFillingDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dAdditionAppNoFillingDate)) + '</span></li>'
                    + '<li><h5>Divisional To Application Number Filing Date</h5><span>' + (val.dDivisionalAppNoFillingDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dDivisionalAppNoFillingDate)) + '</span></li>'
                    + '<li><h5>Name Of Applicant</h5><span>' + isNullCheck(val.vApplicantName) + '</span></li>'
                    + '<li><h5>Address Of Applicant</h5><span>' + isNullCheck(val.vApplicantAddress) + '</span></li>'
                    + '<li><h5>Name Of Inventor</h5><span>' + isNullCheck(val.vInventorName) + '</span></li>'
                    + '<li><h5>Inventor Country</h5><span>' + isNullCheck(val.vInventoryCountry) + '</span></li>'
                    + '<li><h5>Inventor Address</h5><span>' + isNullCheck(val.vInventoryAddress) + '</span></li>'
                    + '<li><h5>Abstract</h5><span>' + isNullCheck(val.vAbstract) + '</span></li>'
                    + '<li><h5>No. Of Pages</h5><span>' + isNullCheck(val.vNoofPages) + '</span></li>'
                    + '<li><h5>No. Of Claims</h5><span>' + isNullCheck(val.vNoofClaims) + '</span></li>'
                    + '<li><h5>The Patent Office Journal No. And Date</h5><span>' + isNullCheck(val.PatentOffJournal) + '</span></li>'
                    + '<li><h5>Applicant Country</h5><span>' + isNullCheck(val.vApplicantCountryName) + '</span></li>'
                    + '<li><h5>Complete Specification</h5><span>' + isNullCheck(val.vCompSpecification) + '</span></li>'
                    + '<li><h5>Status</h5><span>' + isNullCheck(val.vStatus) + '</span></li>'
                    + '</ul></div>';


                //html = '<tr><td width=200px >Application Number.</td><td>:</td><td>' + val.vApplNo + '</td></tr>'
                //    + '<tr><td>Publication Number</td><td>:</td><td>' + val.vPublicationNo + '</td></tr>'
                //    + '<tr><td>Publication Date</td><td>:</td><td>' + (val.dPublicationDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dPublicationDate)) + '</td></tr>'
                //    + '<tr><td>Date Of Filing Of Application</td><td>:</td><td>' + (val.dDateOffiling == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dDateOffiling)) + '</td></tr>'
                //    + '<tr><td>Title Of The Invention</td><td>:</td><td>' + val.vInventionTitle + '</td></tr>'
                //    + '<tr><td>Internal Classification</td><td>:</td><td>' + val.vClassification + '</td></tr>'
                //    + '<tr><td>Priority Document No.</td><td>:</td><td>' + val.vPriorityDocumentNo + '</td></tr>'
                //    + '<tr><td>Priority Date</td><td>:</td><td>' + (val.dPriorityDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dPriorityDate)) + '</td></tr>'
                //    + '<tr><td>Name Of Proirity Country</td><td>:</td><td>' + val.vPriorityCountryName + '</td></tr>'
                //    + '<tr><td>Patent Of Addition To Application Number Filing Date</td><td>:</td><td>' + (val.dAdditionAppNoFillingDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dAdditionAppNoFillingDate)) + '</td></tr>'
                //    + '<tr><td>Divisional To Application Number Filing Date</td><td>:</td><td>' + (val.dDivisionalAppNoFillingDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dDivisionalAppNoFillingDate)) + '</td></tr>'
                //    + '<tr><td>Name Of Applicant</td><td>:</td><td>' + val.vApplicantName + '</td></tr>'
                //    + '<tr><td>Address Of Applicant</td><td>:</td><td>' + isNullCheck(val.vApplicantAddress) + '</td></tr>'
                //    + '<tr><td>Name Of Inventor</td><td>:</td><td>' + val.vInventorName + '</td></tr>'
                //    + '<tr><td>Inventory Country</td><td>:</td><td>' + isNullCheck(val.vInventoryCountry) + '</td></tr>'
                //    + '<tr><td> Inventory Address </td><td>:</td><td>' + isNullCheck(val.vInventoryAddress) + '</td></tr>'
                //    + '<tr><td> Abstract </td><td>:</td><td>' + val.vAbstract + '</td></tr>'
                //    + '<tr><td> No. Of Pages </td><td>:</td><td>' + val.vNoofPages + '</td></tr>'
                //    + '<tr><td> No. Of Claims </td><td>:</td><td>' + val.vNoofClaims + '</td></tr>'
                //    + '<tr><td> The Patent Office Journal No. And Date </td><td>:</td><td>' + val.PatentOffJournal + '</td></tr>'
                //    + '<tr><td> Applicant Country </td><td>:</td><td>' + isNullCheck(val.vApplicantCountryName) + '</td></tr>'
                //    + '<tr><td> Complete Specification </td><td>:</td><td>' + isNullCheck(val.vCompSpecification) + '</td></tr>'
                //    + '<tr><td> Status </td><td>:</td><td>' + isNullCheck(val.vStatus) + '</td></tr>'
                $("#bindTrademarkDetails").html(html);
            });
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX er

    });

});
function ConvertPatentDate(dateValue) {
    let dateParts = dateValue.split('T');
    let datePart = dateParts[0];
    const date = new Date(datePart);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Extract day, month, and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    var formattedDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    return formattedDate;
}
$(document).on('click', '#removePatent', function () {
    var trademarkId = $(this).attr("tradeid");
    var iid = $(this).attr("iid");
    $("#ids_deleteTraderequesr").text("Delete Patent Request");
    $("#msgRUSure1").text("Are you sure you want to delete this patent?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", trademarkId);
    $("#deleteTrademarkDetails").attr("tradeid-val", iid);
});

$(document).on('click', '#btnclearforGI', function () {

    $('#filtertradmark').val('');
    $('#txtapplicationno').val('');
    $('#txtapplino').val('');
    $('#drpstatusforgi').val('');
    $('#drpstatusforgi').multiselect('reload');
    $('#searchclass').val('');
    $('#searchclass').multiselect('reload');
    $('#txtdatefilingfrom').val('');
    $('#txtdatefilingto').val('');
    $('#txtapplicant').val('');
    $('#txtjournalno').val('');
    $('#validupto').val('');
    isRenderPage = false;
    IPRSearchlistForGI(pageindex);
});

$(document).on('click', '#btnclearforpatent', function () {
    $('#filtertradmark').val('');
    $('#txtapplicationno').val('');
    $('#applicationno').val('');
    $('#patentno').val('');
    $('#searchstatusforpatent').val('');
    $('#searchstatusforpatent').multiselect('reload');
    $('#datefrom').val('');
    $('#dateto').val('');
    $('#txtapplicant').val('');
    $('#pdatefrom').val('');
    $('#pdateto').val('');
    isRenderPage = false;
    IPRSearchlistForPatent(pageindex);
});

$(document).on('click', '#btnsearchforpatent', function () {
    isRenderPage = false;
    IPRSearchlistForPatent(pageindex);
});

$(document).on('click', '#btnsearchforgi', function () {
    isRenderPage = false;
    IPRSearchlistForGI(pageindex);
});
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx functions for GI xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function emptyDivContentforGI() {
    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#divHide3').empty();
    $('#btns').remove();
    $('#thval').empty();
    $('#dynaction').empty();
}

function fillDivContentforGI() {
    // var content1 = `<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Application Number</span></label><input type="text" id="txtapplino" name="txtapplino" class="form-control inputFormat" autocomplete="new-text"/></div></div>`;

    //var content2 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select type="text" id="drpstatusforgi" class="form-control selctInputFormat"></select></div></div>`;

    //var content3 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Applicant Name</span></label><input type="text" id="txtapplicant" name="txtapplicant" class="form-control inputFormat" autocomplete="new-text"/></div></div>`;

    //var content4 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Class</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchclass" multiple="multiple"></select></div></div>`;

    //var content7 = `<div class="col-md-6" id="applicant"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Journal No.</span></label><input type="text" id="txtjournalno" name="txtjournalno" class="form-control inputFormat" autocomplete="new-text"/></div></div>`;

    var content2 = `
    <div class="col-md-12 form-group">
      <label>Status
      </label>
      <select id="drpstatusforgi" class="form-control selctInputFormat"></select>
    </div>
  `;

    var content3 = `
    <div class="col-md-12 form-group">
      <label>Applicant Name
      </label>
      <input type="text" id="txtapplicant" name="txtapplicant" class="form-control inputFormat" placeholder="e.g. Directorate of Handlo..." autocomplete="new-text" />
    </div>
  `;

    var content4 = `
    <div class="col-md-12 form-group">
      <label>Class
      </label>
      <select class="form-control inputFormat" name="languageSelect[]" id="searchclass" multiple="multiple"></select>
    </div>
  `;

    var content7 = `
    <div class="col-md-12 form-group" id="applicant">
      <label>Journal No.
      </label>
      <input type="text" id="txtjournalno" name="txtjournalno" class="form-control inputFormat" placeholder="Type here" autocomplete="new-text" />
    </div>
  `;


    $('#divHide1').append(content3, content7, content2, content4);

    //var content15 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date Of Filing</span></label></div></div>`;
    //var content5 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">From</span></label><input class="inputFormat" type="date" id="txtdatefilingfrom" onkeypress="return!1"></div></div>`;

    //var content6 = `<div class="col-md-6"><div class="form-group "><label class="formLabel colorDark"><span class="control-label">To</span></label><input class="inputFormat" type="date" id="txtdatefilingto" onkeypress="return!1"></div></div>`;

    //var content8 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Registration Valid Upto</span></label><input class="inputFormat" type="date" id="validupto" onkeypress="return!1"></div></div>`;

    var content15 = `
    <div class="col-md-12 form-group">
      <label>Date Of Filing
      </label>
    </div>
  `;

    var content5 = `
    <div class="col-md-6">
      <input class="inputFormat" type="date" id="txtdatefilingfrom" onkeypress="return false;">
    </div>
  `;

    var content6 = `
    <div class="col-md-6">
      <input class="inputFormat" type="date" id="txtdatefilingto" onkeypress="return false;">
    </div>
  `;

    var content8 = `
    <div class="col-md-12 form-group">
      <label>Registration Valid Upto
      </label>
      <input class="inputFormat" type="date" id="validupto" onkeypress="return false;">
    </div>
  `;


    $('#divHide2').append(content15, content5, content6, content8);
    var content9 = `
  <div class="btn_flex_between">
        <button type="submit" id="btnclearforGI" class="btn btn-secondary" value="CLEAR">
          Clear
        </button>
        <button type="submit" id="btnsearchforgi" class="btn btn-primary" value="SEARCH">
          Confirm
        </button>
</div>
`;

    //var content9 = `<div class="col-md-12><div style="margin-top:20px !important"><div class="col-md-6"><button type="submit" id="btnclearforGI" class="btn btn-primary pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-6"><button type="submit" id="btnsearchforgi" class="btn btn-primary pull-right" value="SEARCH" style="width:100%">Confirm</button></div></div></div>`;
    $('#divHide3').append(content9)

    var th1Value = `<th style="display:none;"><div class="thbg">S.No</div></th>`;

    var th2Value = `<th><div class="thbg" class="head_fix">Name Of GI</div></th>`;

    var th3Value = `<th><div class="thbg">Applicant</div></th>`;

    var th4Value = `<th><div class="thbg">Status</div></th>`;

    var th5Value = `<th><div class="thbg">Date Of Filing</div></th>`;

    //var th6Value = `<th><div class="thbg">Registered Proprietor</div></th>`;

    var th7Value = `<th><div class="thbg">Class</div></th>`;

    var th8Value = `<th><div class="thbg">Goods</div></th>`;

    //var th9Value = `<th><div class="thbg">Valid Upto</div></th>`;

    var th10Value = `<th><div class="thbg">Journal No.</div></th>`;

    var th11Value = `<th><div class="thbg">Application No.</div></th>`;

    var th12Value = `<th id="th8"><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>`;

    $('#thval').append(th1Value, th2Value, th3Value, th4Value, th5Value, th7Value, th8Value, th10Value, th11Value, th12Value);
    //$('#thval').append(th1Value, th2Value, th3Value, th4Value, th5Value, th6Value, th7Value, th8Value, th9Value, th10Value, th11Value, th12Value);

    var content17 = '<li><a href="javascript:void()" id="oexcelforGI" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="opdfforGI" title="Export to PDF">Export to PDF</a></li>'
    $('#dynaction').append(content17);

    //if ($('#hdnRoleID').val() == "1") {
    //    var content18 = '<li><a href="javascript:void()" id="deleteTrademakeks" title="Delete">Delete GI Request</a></li>'
    //    $('#dynaction').append(content18);
    //}
    $('#modalText').text('GI Information');
}

$(document).on('click', '#advsearchforGI', function () {
    GetStatusListForGI();
    GetClassList();
    $('#divHide1').css('display', 'block');
    $('#divHide2').css('display', 'block');
    /*$('#divHide3').css('display', 'block');*/
    $('#advsearchforGI').css('display', 'none');
    $('#btncollapseforGI').css('display', 'block');
});

$(document).on('click', '#btncollapseforGI', function () {
    $('#divHide1').css('display', 'none');
    $('#divHide2').css('display', 'none');
    /*$('#divHide3').css('display', 'none');*/
    $('#advsearchforGI').css('display', 'block');
    $('#btncollapseforGI').css('display', 'none');
});

function IPRSearchlistForGI(pageindex) {

    openload();
    var htmls = "";
    // var formData = new FormData();
    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applicationno = $('#txtapplicationno').val();
    var applicationname = $('#txtapplicant').val();
    var vstatus = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalNo = $('#txtjournalno').val();
    var filingdatefrom = $('#txtdatefilingfrom').val();
    var filingdateto = $('#txtdatefilingto').val();
    var validupto = $('#validupto').val();
    var vsort = $('#vsort').val();
    if (vsort == undefined) {
        vsort = 0;
    }
    if (filingdatefrom != '' && filingdatefrom != null) {

        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {

        filingdateto = convertorightFormat(filingdateto);
    }

    if (validupto != '' && validupto != null) {

        validupto = convertorightFormat(validupto);
    }

    var vcolname = $('#vcolname').val();
    if (vcolname == undefined || vcolname == "" || vcolname == null) {
        vcolname = "";
    }
    if (IPList == null || IPList == "") {
        alert("Please select the value from the dropdown!");
        return false;
    }
    if (vstatus == undefined || vstatus == null) {
        vstatus = "";
    }
    if (applicationname == undefined || applicationname == null) {
        applicationname = "";
    }
    if (vclass == undefined || vclass == null || vclass == 'Select Type') {
        vclass = "";
    }
    if (journalNo == undefined || journalNo == null) {
        journalNo = "";
    }
    if (filingdatefrom == undefined || filingdatefrom == null) {
        filingdatefrom = "";
    }
    if (filingdateto == undefined || filingdateto == null) {
        filingdateto = "";
    }
    if (validupto == undefined || validupto == null) {
        validupto = "";
    }
    if (vcolname == undefined || vcolname == null) {
        vcolname = "";
    }

    var formData = new FormData();
    formData.append("filtertradmark", searchtext);
    formData.append("IPList", IPList);
    formData.append("txtapplicationno", applicationno);
    formData.append("applicationname", applicationname);
    formData.append("drpstatusforgi", vstatus);
    formData.append("searchclass", vclass);
    formData.append("journalno", journalNo);
    formData.append("txtdatefilingfrom", filingdatefrom);
    formData.append("txtdatefilingto", filingdateto);
    formData.append("validupto", validupto);
    formData.append("sort", vsort);
    formData.append("colname", vcolname);
    formData.append("pagesize", pagesize);
    formData.append("pagenum", pageindex);

    $.ajax({
        //async: true,
        type: "POST",
        url: "/api/IPRApi/ViewAddedGIDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $("#exportrecords").val(0);
            $("#trademarkcount").text("");
            var obj = response1.Data.data;
            var length = obj.length;
            var obj1 = obj;
            var MyObj1 = 0;

            var qty = 0;
            if (length > 0) {
                $("#pdatastatus").hide();
                $("#tradePagination").show();
                $("#dtNotFound").text("");
                $.each(obj1, function (i, val) {
                    var flag = 0;

                    if (i === 0) {
                        firstvalue = val.RowId;
                    }
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;

                    //    var totdata = val.TotalRecord;
                    //    var totpage = 0;
                    //    if (val.TotalRecord > 0) {
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
                    //    $("#exportrecords").val(val.TotalRecord);
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                    //    if (val.TotalRecord <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    $("#ptfooter").html("");
                    //    $("#ptfooter").html(tfot);
                    //}
                    if (i === (length - 1)) {
                        $("#trademarkcount").text("(" + val.TotalRecord + ")");
                        $("#exportrecords").val(val.TotalRecord);
                        var totdata = val.TotalRecord;
                        var totpage = 0;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
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
                            setTotalRecord = totpage;
                            renderPagination(pageindex, totpage);
                        }
                    }
                    qty = qty + 1;
                    var RowId = val.RowId;
                    var TotalRecord = val.TotalRecord;

                    htmls += '<tr><td style="text-align: center; display:none;">' + val.RowId + '</td><td >' + val.vGeoIndication + '</td><td>'
                        + val.vApplicantName + '</td><td>' + val.vStatus + '</td><td>' + convertdate(val.dDateoffiling) + '</td><td>'
                        //+ isnull(val.vRegisteredProp) + '</td><td>'
                        + val.vClass + '</td><td>' + val.vGoods
                        //+ '</td><td>' + isnull(val.vRegistrationValidUpto)
                        + '</td><td>' + val.vJournalNo + '</td><td>' + val.vApplicationNo + '</td>'
                    htmls += '<td><ul class="table_action">' +
                        '<li>' +
                        '<span class="taskoutboxbtnicon" id="openviewaddedGI" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + val.Tradeiid + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">' +
                        '<img src="/newassets/img/eye.svg" alt="View Information" />' +
                        '</span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="taskoutboxbtnicon" id="removeGI" style="cursor:pointer;" title="Remove GI Information" iid="' + val.iid + '" tradeid="' + val.Tradeiid + '">' +
                        '<img src="/newassets/img/delete.svg" alt="Remove Information" />' +
                        '</span>' +
                        '</li>' +
                        '</ul></td>';


                    //if (flag == 0) {
                    //    htmls += '<tr><td style="text-align: center;">' + val.RowId + '</td><td style="text-align: center;">' + val.vGeoIndication + '</td><td>' + val.vApplicantName + '</td><td>' + val.vStatus + '</td><td>' + convertdate(val.dDateoffiling) + '</td><td>' + isnull(val.vRegisteredProp) + '</td><td>' + val.vClass + '</td><td>' + val.vGoods + '</td><td>' + isnull(val.vRegistrationValidUpto) + '</td><td>' + val.vJournalNo + '</td><td>' + val.vApplicationNo + '</td>'
                    //        + '<td><span class="glyphicon glyphicon-eye-open" id="openviewaddedGI" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid=' + val.Tradeiid + ' data-toggle="modal" data-target="#viewaddedtrademarkdata"></span>'
                    //        + ' | <span class="glyphicon glyphicon-trash" id="removeGI" style=" cursor:pointer;" title="Remove GI Information" tradeid=' + val.Tradeiid + '></span></td></tr>';
                    //}
                    //else {
                    //    htmls += ' <tr><td style="text-align: left;">' + val.RowId + '</td><td style="text-align: left;">' + val.vGeoIndication + '</td><td>' + val.vApplicantName + '</td><td>' + val.vStatus + '</td><td>' + convertdate(val.dDateoffiling) + '</td><td>' + isnull(val.vRegisteredProp) + '</td><td>' + val.vClass + '</td><td>' + val.vGoods + '</td><td>' + isnull(val.vRegistrationValidUpto) + '</td><td>' + val.vJournalNo + '</td><td>' + val.vApplicationNo + '</td>'
                    //        + '<td><span class="glyphicon glyphicon-eye-open" id="openviewaddedGI" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid=' + val.Tradeiid + ' data-toggle="modal" data-target="#viewaddedtrademarkdata"></span>'
                    //        + ' | <span class="glyphicon glyphicon-trash" id="removeGI" style=" cursor:pointer;" title="Remove GI Information" tradeid=' + val.Tradeiid + '></span></td></tr>';
                    //}

                });
            } else {
                $("#trademarkcount").text("");
                $("#pdatastatus").show();
                $("#tradePagination").hide();
                $("#dtNotFound").html('<center>No GI Found<center>');
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                //htmls += '<tr>'
            }
            $("#bindIPRSearchData").html("").html(htmls);
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

$(document).on('click', '#openviewaddedGI', function () {
    $('#tmdetailsdownload').css("display", "none");

    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spMarkNameDetails').text("Geographical Indication Information")
    $('#spShowMarkName').text("Geographical Indication Information");
    var iplistValue = '4'
    var html = "";
    var trademarkiid = $(this).attr('tradeid');
    $('#tmdetailsmodal').attr('tradeiid', trademarkiid);

    var formdata = new FormData();
    formdata.append("ip", iplistValue)
    formdata.append("tradeid", trademarkiid);
    localStorage.setItem('tradeiid', trademarkiid);
    $.ajax({
        async: true,
        url: "/api/IPRApi/loadtrademarkdatabyiid",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;
            $("#bindTrademarkDetails").empty();
            $.each(obj, function (i, val) {
                $('#tmdetailsmodal').attr('tradeiid', val.iid);
                $('#modal-header').text('View Geographical Indication');
                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>Application Number</h5><span>' + val.vApplicationNo + '</span></li>'
                    + '<li><h5>Geographical Indication</h5><span>' + val.vGeoIndication + '</span></li>'
                    + '<li><h5>Status</h5><span>' + isNullCheck(val.vStatus) + '</span></li>'
                    + '<li><h5>Applicant Name</h5><span>' + val.vApplicantName + '</span></li>'
                    + '<li><h5>Applicant Address</h5><span>' + val.vApplicantAddress + '</span></li>'
                    + '<li><h5>Date Of Filing</h5><span>' + convertdate(val.dDateofFiling) + '</span></li>'
                    + '<li><h5>Class</h5><span>' + val.vClass + '</span></li>'
                    + '<li><h5>Goods</h5><span>' + val.vGoods + '</span></li>'
                    + '<li><h5>Geographical Area</h5><span>' + val.vGeoArea + '</span></li>'
                    + '<li><h5>Priority Country</h5><span>' + val.vPriorityCountry + '</span></li>'
                    + '<li><h5>Journal No</h5><span>' + val.vJournalNo + '</span></li>'
                    + '<li><h5>Availability Date</h5><span>' + convertdate(val.dAvailDate) + '</span></li>'
                    + '<li><h5>Certificate No</h5><span>' + val.vCertificateNo + '</span></li>'
                    + '<li><h5>Certificate Date</h5><span>' + convertdate(val.dCertificateDate) + '</span></li>'
                    + '<li><h5>Registration Valid Upto</h5><span>' + convertdate(val.dRegisterDate) + '</span></li>'
                    + '</ul></div>';

                $("#bindTrademarkDetails").html(html);

                //html = '<tr><td width=200px >Application Number</td><td>:</td><td>' + val.vApplicationNo + '</td></tr>'
                //    + '<tr><td>Geographical Indication</td><td>:</td><td>' + val.vGeoIndication + '</td></tr>'
                //    + '<tr><td>Status</td><td>:</td><td>' + isNullCheck(val.vStatus) + '</td></tr>'
                //    + '<tr><td>Applicant Name</td><td>:</td><td>' + val.vApplicantName + '</td></tr>'
                //    + '<tr><td>Applicant Address</td><td>:</td><td>' + val.vApplicantAddress + '</td></tr>'
                //    + '<tr><td>Date Of Filing</td><td>:</td><td>' + convertdate(val.dDateofFiling) + '</td></tr>'
                //    + '<tr><td>Class</td><td>:</td><td>' + val.vClass + '</td></tr>'
                //    + '<tr><td>Goods</td><td>:</td><td>' + val.vGoods + '</td></tr>'
                //    + '<tr><td>Geographical Area</td><td>:</td><td>' + val.vGeoArea + '</td></tr>'
                //    + '<tr><td>Priority Country</td><td>:</td><td>' + val.vPriorityCountry + '</td></tr>'
                //    + '<tr><td>Journal No</td><td>:</td><td>' + val.vJournalNo + '</td></tr>'
                //    + '<tr><td>Availability Date</td><td>:</td><td>' + convertdate(val.dAvailDate) + '</td></tr>'
                //    + '<tr><td>Certificate No</td><td>:</td><td>' + val.vCertificateNo + '</td></tr>'
                //    + '<tr><td>Certificate Date</td><td>:</td><td>' + convertdate(val.dCertificateDate) + '</td></tr>'
                //    + '<tr><td>Registration Valid Upto</td><td>:</td><td>' + convertdate(val.dRegisterDate) + '</td></tr>'
                //$("#bindTrademarkDetails").html(html);
            });
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX er

    });
});

$(document).on('click', '#removeGI', function () {

    var tradeiid = $(this).attr('tradeid');
    var iid = $(this).attr('iid');
    $("#ids_deleteTraderequesr").text("Delete GI Request");
    $("#msgRUSure1").text("Are you sure you want to delete this GI?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", tradeiid);
    $("#deleteTrademarkDetails").attr("tradeid-val", iid);
    //if (confirm("Are you sure you want to remove this record?")) {
    //    var formdata = new FormData();
    //    formdata.append("tradeid", tradeiid);
    //    formdata.append("ip", ipList);
    //    formdata.append("iid", iid);
    //    $.ajax({
    //        async: true,
    //        url: "/api/IPRApi/RemoveMarks",
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (response) {
    //            if (IPname == '4') {
    //                alert('Your GI record has been successfully removed');
    //                IPRSearchlistForGI(pageindex);
    //            }
    //        }, //End of AJAX Success function

    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        }
    //    });
    //}
});

function RemoveGIMark(tradeiid, iid, ipList) {
    var formdata = new FormData();
    formdata.append("tradeid", tradeiid);
    formdata.append("ip", ipList);
    formdata.append("iid", iid);
    $.ajax({
        async: true,
        url: "/api/IPRApi/RemoveMarks",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $("#myModalmarkdeleteTradeconfirmation").modal("hide");
            if (IPname == '4') {
                //alert('Your GI record has been successfully removed');
                new PNotify({
                    title: 'Success!',
                    text: 'Your GI record has been successfully removed',
                    type: 'success',
                    delay: 3000
                });
                IPRSearchlistForGI(pageindex);
            }
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        }
        //End of AJAX er

    });
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions For Design xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function emptyDivContentforDesign() {

    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#divHide3').empty();
    $('#btns').empty();
    $('#thval').empty();
    $('#dynaction').empty();
}

function fillDivContentforDesign() {
    //var content1 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Class</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchclassforDesign"></select></div></div>`;
    //var content2 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Applicant Details</span></label><input type="text" id="txtapplidtls" name="txtapplidtls" class="form-control inputFormat" autocomplete="new-text"/></div></div>`;
    //var content3 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchstatusfordesign" multiple="multiple"></select></div></div>`;

    var content1 = `
    <div class="col-md-12 form-group">
      <label>Class
      </label>
      <select class="form-control inputFormat" name="languageSelect[]" id="searchclassforDesign"></select>
    </div>
  `;

    var content2 = `
    <div class="col-md-12 form-group">
      <label>Applicant Details
      </label>
      <input type="text" id="txtapplidtls" name="txtapplidtls" class="form-control inputFormat" placeholder="Type here" autocomplete="new-text" />
    </div>
  `;

    var content3 = `

    <div class="col-md-12 form-group">
      <label>Status
      </label>
      <select class="form-control inputFormat" name="languageSelect[]" id="searchstatusfordesign" multiple="multiple"></select>
    </div>
`;


    $('#divHide1').append(content1, content3, content2);
    //var content9 = `<div class="col-md-12"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date Of Registration </span></label></div></div>`;
    //var content4 = `<div class="col-md-6"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">From</span></label><input class="inputFormat" type="date" id="txtregisterfrom" onkeypress="return!1"></div></div>`;
    //var content5 = `<div class="col-md-6"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">To</span></label><input class="inputFormat" type="date" id="txtregisterto" onkeypress="return!1"></div></div>`;
    //var content6 = `<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Title</span></label><input type="text" class="inputFormat" id="txttitle"></div></div>`;
    //var content7 = `<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Priority Country</span></label><input type="text" class="inputFormat" id="txtprioritycountry"></div></div>`;

    var content9 = `
 
    <div class="col-md-12 form-group">
      <label>Date Of Registration
      </label>
    </div>
`;

    var content4 = `
    <div class="col-md-6 form-group">
      <input class="inputFormat" type="date" id="txtregisterfrom" onkeypress="return false;">
    </div>
`;

    var content5 = `
    <div class="col-md-6 form-group">
      <input class="inputFormat" type="date" id="txtregisterto" onkeypress="return false;">
    </div>
`;

    var content6 = `
    <div class="col-md-12 form-group">
      <label>Title
      </label>
      <input type="text" class="inputFormat" id="txttitle">
    </div>
  </div>`;

    var content7 = `
    <div class="col-md-12 form-group">
      <label>Priority Country
      </label>
      <input type="text" class="inputFormat" id="txtprioritycountry">
    </div>
`;


    //$('#divHide2').append(content5, content6, content7);
    //$('#divHide2').append(content5, content6);
    $('#divHide2').append(content9, content4, content5);

    //var content9 = `<div class="col-md-12"><div class="form-group" style="margin-top:34px" id="btns"><div class="col-md-2"><button type="submit" id="btnsearchfordesign" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnclearfordesign" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-4" style="display:none" id="btncollapseforDesign"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-4"><button type="submit" id="advsearchforDesign" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div></div></div>`;
    //var content9 = `<div class="col-md-12"><div class="form-group" style="margin-top:34px" id="btns"><div class="col-md-6"><button type="submit" id="btnclearfordesign" class="btn btn-primary pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-6"><button type="submit" id="btnsearchfordesign" class="btn btn-primary pull-right" value="SEARCH" style="width:100%">Confirm</button></div></div></div>`;
    var content9 = `

    <div class="btn_flex_between" id="btns">
          <button type="submit" id="btnclearfordesign" class="btn btn-secondary" value="CLEAR">
            Clear
          </button>
          <button type="submit" id="btnsearchfordesign" class="btn btn-primary " value="SEARCH">
            Confirm
           </button>
    </div>
`;


    $('#divHide3').append(content9);

    var th1Value = `<th style="display:none;"><div class="thbg">S.No</div></th>`;

    var th2Value = `<th><div class="thbg">Design Number<button type="button" id="sortdesignno" class="btn-style" style="position:relative;left:15px" value="vdesignno" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var th3Value = `<th><div class="thbg">Class<button type="button" id="sortclass" class="btn-style" style="position:relative;left:15px" value="vClass" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var th4Value = `<th><div class="thbg">Address<button type="button" id="sortaddress" class="btn-style" style="position:relative;left:15px" value="vAddress" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var th5Value = `<th><div class="thbg">Date Of Registration<button type="button" id="sortdog" class="btn-style" style="position:relative;left:15px" value="vdog" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var th6Value = `<th class="head_div"><div class="thbg">Title<button type="button" id="sorttitle" class="btn-style" style="position:relative;left:15px" value="vTitle" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var th7Value = `<th><div class="thbg">Patent Office Journal No.<button type="button" id="sortpojn" class="btn-style" style="position:relative;left:15px" value="vpojn" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;
    var th17Value = `<th><div class="thbg">Status<button type="button" id="sortpojn" class="btn-style" style="position:relative;left:15px" value="vpojn" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes"></span></div></th>`;

    var th8Value = `<th id="th8"><div class="thbg" style="display:flex; justify-content:center;">Action</div></th>`;

    $('#thval').append(th6Value, th1Value, th2Value, th3Value, th4Value, th5Value, th7Value, th17Value, th8Value);

    var content11Value = '<li><a href="javascript:void()" id="oexcelforDesign" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="opdfforDesign" title="Export to PDF">Export to PDF</a></li>'
    $('#dynaction').append(content11Value);
    //if ($('#hdnRoleID').val() == "1") {
    //    var content18 = '<li><a href="javascript:void()" id="deleteTrademakeks" title="Delete">Delete Design Request</a></li>'
    //    $('#dynaction').append(content18);
    //}
    $('#modalText').text('Design Information');
}
function IPRSearchlistForDesign(pageindex) {
    openload();
    var htmls = ''
    var searchtext = $('#filtertradmark').val();
    var designno = $('#txtapplicationno').val();
    var vclass = $('#searchclassforDesign').val();
    var appdetails = $('#txtapplidtls').val();
    var regfrom = $('#txtregisterfrom').val();

    if (regfrom != '' && regfrom != null && regfrom != undefined) {
        regfrom = convertorightFormat(regfrom);
    }
    else {
        regfrom = "";
    }

    var regto = $('#txtregisterto').val();
    if (regto != '' && regto != null && regto != undefined) {
        regto = convertorightFormat(regto);
    }
    else {
        regto = "";
    }
    var title = $('#txttitle').val();
    var area = $('#area').val();
    var searchstatusfordesign = $('#searchstatusfordesign').val();
    var prioritycountry = $('#txtprioritycountry').val();
    var IPList = "5";

    if (appdetails == undefined || appdetails == null) {
        appdetails = "";
    }
    var formData = new FormData();
    formData.append('filtertradmark', searchtext);
    formData.append('designnum', designno);
    formData.append('searchclassforDesign', vclass);
    formData.append('applicantdetails', appdetails);
    formData.append('searchstatusfordesign', searchstatusfordesign);
    formData.append('registerfromdate', regfrom);
    formData.append('registertodate', regto);
    formData.append('title', title);
    formData.append('area', area);
    formData.append('country', prioritycountry);
    formData.append('ip', IPList);
    formData.append('pagenum', pageindex);
    formData.append('ip', pagesize);

    $.ajax({
        //async: true,
        type: "POST",
        url: "/api/IPRApi/ViewAddedDesignDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response1) {
            $("#exportrecords").val(0);
            $("#trademarkcount").text("");
            $("#dtNotFound").text("");
            ShowAllSorting();
            var obj = JSON.parse(response1.Data.data);
            var length = obj.length;

            var qty = 0;
            if (length > 0) {
                $("#pdatastatus").hide();
                $("#tradePagination").show();
                $("#divalertlist tr").remove();
                $.each(obj, function (i, val) {
                    var formData = new FormData();
                    formData.append('trademarkId', val.iid);

                    if (i === 0) {
                        firstvalue = val.RowId;
                    }
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;

                    //    var totdata = val.TotalRecord;
                    //    var totpage = 0;
                    //    if (val.TotalRecord > 0) {
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
                    //    $("#exportrecords").val(val.TotalRecord);
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'


                    //    if (val.TotalRecord <= length) {

                    //    }
                    //    else if (pageno == 1) {

                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                    //    }

                    //    else {
                    //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                    //    }

                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }


                    //    tfot += '</ul>'
                    //    $("#ptfooter").html("");
                    //    $("#ptfooter").html(tfot);
                    //}
                    if (i === (length - 1)) {
                        $("#trademarkcount").text("(" + val.TotalRecord + ")");
                        $("#exportrecords").val(val.TotalRecord);
                        var totdata = val.TotalRecord;
                        var totpage = 0;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
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
                            setTotalRecord = totpage;
                            renderPagination(pageindex, totpage);
                        }
                    }
                    qty = qty + 1;

                    var RowId = val.RowId;
                    var TotalRecord = val.TotalRecord;
                    htmls += ' <tr><td style="text-align: left; display:none;">' + val.RowId + '</td><td class=""><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vTitle + '</td><td style="text-align: left;">' + val.vDesignNo + '</td><td>' + val.vClass + '</td><td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vAddress + '</td><td>' + convertdate(val.dDateOfRegistration) + '</td><td>' + (val.vPatentOffJournalNo == null ? '' : val.vPatentOffJournalNo) + '</td><td>' + (val.vStatus == null ? '' : val.vStatus) + '</td>'
                    htmls += '<td><ul class="table_action">' +
                        '<li>' +
                        '<span class="taskoutboxbtnicon" id="openDesigndetails" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + EncodeText(val.Tradeiid) + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">' +
                        '<img src="/newassets/img/eye.svg" alt="View Information" />' +
                        '</span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="taskoutboxbtnicon" id="removedesign" style="cursor:pointer;" title="Remove Design Information" tradeid="' + val.Tradeiid + '" iid="' + val.iid + '">' +
                        '<img src="/newassets/img/delete.svg" alt="Remove Information" />' +
                        '</span>' +
                        '</li>' +
                        '</ul></td>';
                });

            }
            else {
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                //htmls += '<tr>'
                $("#dtNotFound").html('<center>No Design Found</center>');
                $("#pdatastatus").show();
                $("#tradePagination").hide();
            }
            //  $("#districtdatabind,#alldatabind").html("");                    
            $("#bindIPRSearchData").html("").html(htmls);
            closeload();

        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    })

}

$(document).on('click', '#advsearchforDesign', function () {
    GetStatusListForDesign();
    GetClassListForDesign();
    $('#divHide1').css('display', 'block');
    $('#divHide2').css('display', 'block');
    $('#advsearchforDesign').css('display', 'none');
    $('#btncollapseforDesign').css('display', 'block');
})

$(document).on('click', '#btncollapseforDesign', function () {
    $('#divHide1').css('display', 'none');
    $('#divHide2').css('display', 'none');
    $('#advsearchforDesign').css('display', 'block');
    $('#btncollapseforDesign').css('display', 'none');
})

$(document).on('click', '#openDesigndetails', function () {

    trademarkId = $(this).attr("tradeid");
    localStorage.setItem('tradeiid', trademarkId);
    openDesigndetails(trademarkId);

})

function openDesigndetails(trademarkId) {
    $('#tmdetailsdownload').css("display", "none");

    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spMarkNameDetails').text("Design Information")
    $('#spShowMarkName').text("Design Information");
    var iplistValue = "5"
    var html = "";
    var imagePath = 'https://iprdocs.mykase.in/IPR_Documents_New/IPRImages/Design';
    var formdata = new FormData();
    formdata.append("ip", iplistValue)
    formdata.append("tradeid", trademarkId);
    localStorage.setItem('tradeiid', trademarkId);
    $.ajax({
        async: true,
        url: "/api/IPRApi/loadtrademarkdatabyiid",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;
            $("#bindTrademarkDetails").empty();
            $.each(obj, function (i, val) {
                $('#tmdetailsmodal').attr('tradeiid', val.iid);

                $('#modal-header').text('View Design');
                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>Design Number</h5><span>' + val.vDesignNo + '</span></li>'
                    + '<li><h5>Class</h5><span>' + val.vClass + '</span></li>'
                    + '<li><h5>Applicant Details</h5><span>' + isNullCheck(val.vApplDetails) + '</span></li>'
                    + '<li><h5>Address</h5><span>' + val.vAddress + '</span></li>'
                    + '<li><h5>Registration Date</h5><span>' + convertdate(val.dDateOfRegistration) + '</span></li>'
                    + '<li><h5>Title</h5><span>' + val.vTitle + '</span></li>'
                    + '<li><h5>Priority No.</h5><span>' + val.vPriorityNo + '</span></li>'
                    + '<li><h5>Priority Status</h5><span>' + isNullCheck(val.vPriorityStatus) + '</span></li>'
                    + '<li><h5>Priority Date</h5><span>' + convertdate(val.dPriorityDate) + '</span></li>'
                    + '<li><h5>Priority Country</h5><span>' + isNullCheck(val.vPriorityCountry) + '</span></li>';

                if (val.vImgPath != null && val.vImgPath !== '') {
                    html += '<li><h5>Design Image</h5><span><img src="' + imagePath + '/' + val.vImgPath + '" alt="Image Not Available" style="max-width: 100%; height: auto;"></span></li>';
                }

                html += '</ul></div>';

                //html = '<tr><td width=200px >Design Number</td><td>:</td><td>' + val.vDesignNo + '</td></tr>'
                //    + '<tr><td>Class</td><td>:</td><td>' + val.vClass + '</td></tr>'
                //    + '<tr><td>Applicant Details</td><td>:</td><td>' + isNullCheck(val.vApplDetails) + '</td></tr>'
                //    + '<tr><td>Address</td><td>:</td><td>' + val.vAddress + '</td></tr>'
                //    + '<tr><td>Registration Date</td><td>:</td><td>' + convertdate(val.dDateOfRegistration) + '</td></tr>'
                //    + '<tr><td>Title</td><td>:</td><td>' + val.vTitle + '</td></tr>'
                //    + '<tr><td>Priority No.</td><td>:</td><td>' + val.vPriorityNo + '</td></tr>'
                //    + '<tr><td>Priority Status</td><td>:</td><td>' + isNullCheck(val.vPriorityStatus) + '</td></tr>'
                //    + '<tr><td>Priority Date</td><td>:</td><td>' + convertdate(val.dPriorityDate) + '</td></tr>'
                //    + '<tr><td>Priority Country</td><td>:</td><td>' + isNullCheck(val.vPriorityCountry) + '</td></tr>'
                //    + '<tr><td>Design Image</td><td>:</td><td><img src="' + imagePath + '/' + val.vImgPath + '" alt="Image Not Available"></td></tr>'
                //html = '<div class="trademark_details_info_table"> <ul class="detail_info"> <li> <h5> </h5> <span> </span> </li> </div> </div>'
                $("#bindTrademarkDetails").html(html);
            });
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX er

    });
}

function GetClassListForDesign() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/IPR/GetIPRClassListForDesign",
        dataType: 'json',
        success: function (response) {
            // var obj = JSON.parse(response);
            //  var obj = JSON.parse(response.Data.data);
            $("#searchclassforDesign").html("");
            $("#searchclassforDesign").append("<option value=''>Select</option>");
            $(".ms-selectall").show();
            $.each(response, function (i, b) {

                $("#searchclassforDesign").append("<option value='" + b.name + "'>" + b.name + " " + "-" + " " + b.className + "</option>");
            });
            $("#searchclassforDesign").multiselect('reload');
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function GetStatusListForDesign() {
    var Ip = '5';
    var formData = new FormData();
    formData.append('ip', Ip);

    $.ajax({

        async: true,
        type: "POST",
        url: "/api/IPRApi/FetchDesignStatus",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data.data);
            var obj1 = obj.data;
            $('#searchstatusfordesign').html('');
            $.each(obj1, function (i, val) {
                var data1 = val.StatusName;
                if (data1 != null) {
                    $('#searchstatusfordesign').append('<option value=' + data1 + '>' + data1 + '</option>')
                }
            });
            $('#searchstatusfordesign').multiselect('reload');
        },

        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
    });
}

$(document).on('click', '#removedesign', function () {

    var tradeiid = $(this).attr('tradeid');
    var viid = $(this).attr('iid');

    $("#ids_deleteTraderequesr").text("Delete Design Request");
    $("#msgRUSure1").text("Are you sure you want to delete this design?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", tradeiid);
    $("#deleteTrademarkDetails").attr("tradeid-val", viid);

    //var ipList = IPname;
    //if (confirm("Are you sure you want to delete this design?")) {
    //    var formdata = new FormData();
    //    formdata.append("tradeid", tradeiid);
    //    formdata.append("ip", ipList);
    //    formdata.append("iid", viid);
    //    $.ajax({
    //        async: true,
    //        url: "/api/IPRApi/RemoveMarks",
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (response) {
    //            //var obj1 = JSON.parse(response.Data.data);
    //            //var obj = obj1.data;
    //            if (IPname == '5' && response.Status == true) {
    //                alert('Your Design record has been successfully removed');
    //                IPRSearchlistForDesign(pageindex);
    //            }
    //        }, //End of AJAX Success function

    //        failure: function (response) {
    //            alert(data.responseText);
    //        }, //End of AJAX failure function
    //        error: function (response) {
    //            alert(data.responseText);
    //        }
    //        //End of AJAX er
    //    });
    //}
});

function RemoveDesignMark(tradeiid, viid, IPname) {
    var tradeiid = tradeiid;//$(this).attr('tradeid');
    var viid = viid//$(this).attr('iid');
    var ipList = IPname;
    //if (confirm("Are you sure you want to delete this design?")) {
    var formdata = new FormData();
    formdata.append("tradeid", tradeiid);
    formdata.append("ip", ipList);
    formdata.append("iid", viid);
    $.ajax({
        async: true,
        url: "/api/IPRApi/RemoveMarks",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $("#myModalmarkdeleteTradeconfirmation").modal("hide");
            if (IPname == '5' && response.Status == true) {
                //alert('Your Design record has been successfully removed');
                new PNotify({
                    title: 'Success!',
                    text: 'Your Design record has been successfully removed',
                    type: 'success',
                    delay: 3000
                });
                IPRSearchlistForDesign(pageindex);
            }
        }, //End of AJAX Success function

        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        }
        //End of AJAX er
    });
    //}
}

$(document).on('click', '#btnclearfordesign', function () {

    $('#filtertradmark').val('');
    $('#txtapplicationno').val('');
    $('#txtapplidtls').val('');
    $('#searchclassforDesign').val('');
    $('#searchclassforDesign').multiselect('reload');
    $('#searchstatusfordesign').val('');
    $('#searchstatusfordesign').multiselect('reload');
    $('#txtregisterfrom').val('');
    $('#txtregisterto').val('');
    $('#txttitle').val('');
    $('#txtprioritycountry').val('');
    //$('#ptfooter').empty();
    //$('#bindIPRSearchData').empty();
    isRenderPage = false;
    IPRSearchlistForDesign(pageindex);
});


//$(document).on('click', '#oexcelforDesign', function () {
//    $("#myModalexport").modal({ show: true });
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action">' +
//            '<li>' +
//            '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoexcelDesign" pageno="' + i + '" type="excel">' +
//            '<img src="/newassets/img/download.svg" alt="Download File" />' +
//            '</span>' +
//            '</li>' +
//            '</ul></td>';

//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});

$(document).on('click', '#oexcelforDesign', function () {

    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropDesignExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelDesign">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';
    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropDesignExcel").html(html);
});

$(document).on("click", "#CommonExportExcelDesign", function () {
    var pagenum = $("#id_exportreportdropDesignExcel").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var searchtext = $('#filtertradmark').val();
    var designno = $('#txtapplicationno').val();
    var vclass = $('#searchclassforDesign').val();
    var appdetails = $('#txtapplidtls').val();
    var regfrom = $('#txtregisterfrom').val();

    if (regfrom != '' && regfrom != null) {
        regfrom = convertorightFormat(regfrom);
    }

    var regto = $('#txtregisterto').val();
    if (regto != '' && regto != null) {
        regto = convertorightFormat(regto);
    }
    var title = $('#txttitle').val();
    var area = $('#area').val();
    var searchstatusfordesign = $('#searchstatusfordesign').val();
    var prioritycountry = $('#txtprioritycountry').val();
    var IPList = "5";

    window.location = encodeURI('/IPR/BindAddedDesignDetail?filtertradmark=' + searchtext + '&designno=' + designno + '&vclass=' + vclass + '&appdetails=' + appdetails +
        '&regfrom=' + regfrom + '&regto=' + regto + '&title=' + title + '&searchstatusfordesign=' + searchstatusfordesign + '&prioritycountry=' + prioritycountry +
        '&pagenum=' + pagenum + '&pagesize=10');
});

$(document).on('click', '#exporttoexcelDesign', function () {

    var pagenum = $(this).attr('pageno');
    var searchtext = $('#filtertradmark').val();
    var designno = $('#txtapplicationno').val();
    var vclass = $('#searchclassforDesign').val();
    var appdetails = $('#txtapplidtls').val();
    var regfrom = $('#txtregisterfrom').val();

    if (regfrom != '' && regfrom != null) {
        regfrom = convertorightFormat(regfrom);
    }

    var regto = $('#txtregisterto').val();
    if (regto != '' && regto != null) {
        regto = convertorightFormat(regto);
    }
    var title = $('#txttitle').val();
    var area = $('#area').val();
    var searchstatusfordesign = $('#searchstatusfordesign').val();
    var prioritycountry = $('#txtprioritycountry').val();
    var IPList = "5";

    window.location = encodeURI('/IPR/BindAddedDesignDetail?filtertradmark=' + searchtext + '&designno=' + designno + '&vclass=' + vclass + '&appdetails=' + appdetails +
        '&regfrom=' + regfrom + '&regto=' + regto + '&title=' + title + '&searchstatusfordesign=' + searchstatusfordesign + '&prioritycountry=' + prioritycountry +
        '&pagenum=' + pagenum + '&pagesize=10');
});

//Start Download design in pdf
//$(document).on('click', '#opdfforDesign', function () {
//    $("#myModalexport").modal({ show: true });
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action">' +
//            '<li>' +
//            '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttopdfDesign" pageno="' + i + '" type="pdf">' +
//            '<img src="/newassets/img/download.svg" alt="Download File" />' +
//            '</span>' +
//            '</li>' +
//            '</ul></td>';

//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});
$(document).on('click', '#opdfforDesign', function () {
    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropDesignPdf"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportPdfDesign">Confirm</button>';
    displayImage = '<img src="/newassets/img/pdf-export.png" style="margin:-15px 0px 0 -15px">';
    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);

    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropDesignPdf").html(html);
});

$(document).on("click", "#CommonExportPdfDesign", function () {
    var pagenum = $("#id_exportreportdropDesignPdf").val();
    var searchtext = $('#filtertradmark').val();
    var designno = $('#txtapplicationno').val();
    var vclass = $('#searchclassforDesign').val();
    var appdetails = $('#txtapplidtls').val();
    var regfrom = $('#txtregisterfrom').val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    if (regfrom != '' && regfrom != null) {
        regfrom = convertorightFormat(regfrom);
    }

    var regto = $('#txtregisterto').val();
    if (regto != '' && regto != null) {
        regto = convertorightFormat(regto);
    }
    var title = $('#txttitle').val();
    var area = $('#area').val();
    var searchstatusfordesign = $('#searchstatusfordesign').val();
    var prioritycountry = $('#txtprioritycountry').val();
    var IPList = "5";

    window.location = encodeURI('/IPR/ExportDesignInPdf?filtertradmark=' + searchtext + '&designno=' + designno + '&vclass=' + vclass + '&appdetails=' + appdetails +
        '&regfrom=' + regfrom + '&regto=' + regto + '&title=' + title + '&searchstatusfordesign=' + searchstatusfordesign + '&prioritycountry=' + prioritycountry +
        '&pagenum=' + pagenum + '&pagesize=10');
});

/*Download copyright detail in pdf*/
$(document).on('click', '#exporttopdfDesign', function () {
    var pagenum = $(this).attr('pageno');
    var searchtext = $('#filtertradmark').val();
    var designno = $('#txtapplicationno').val();
    var vclass = $('#searchclassforDesign').val();
    var appdetails = $('#txtapplidtls').val();
    var regfrom = $('#txtregisterfrom').val();

    if (regfrom != '' && regfrom != null) {
        regfrom = convertorightFormat(regfrom);
    }

    var regto = $('#txtregisterto').val();
    if (regto != '' && regto != null) {
        regto = convertorightFormat(regto);
    }
    var title = $('#txttitle').val();
    var area = $('#area').val();
    var searchstatusfordesign = $('#searchstatusfordesign').val();
    var prioritycountry = $('#txtprioritycountry').val();
    var IPList = "5";

    window.location = encodeURI('/IPR/ExportDesignInPdf?filtertradmark=' + searchtext + '&designno=' + designno + '&vclass=' + vclass + '&appdetails=' + appdetails +
        '&regfrom=' + regfrom + '&regto=' + regto + '&title=' + title + '&searchstatusfordesign=' + searchstatusfordesign + '&prioritycountry=' + prioritycountry +
        '&pagenum=' + pagenum + '&pagesize=10');
});
//Start Download design in pdf

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Extra Functions xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function isNullCheck(param) {

    if (param == null || param == 'undefined') {

        return '';
    }

    else {

        return param;
    }
}

function SimpleDateConvert(InputDate) {
    const inputDateString = '2021-11-05 00:00:00';
    const [year, month, day] = inputDateString.split(' ')[0].split('-');
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const formattedDate = `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
    return formattedDate;
}

function showinfoModal() {

    $('#demo3').css('display', 'block');
}

// Regular expression for email validation
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

// Function to validate and show email validation message
function validateEmail(emailInput) {
    const validationMessage = document.getElementById('emailValidationMessage');
    const emailArray = emailInput.split(',');

    if (emailArray.length > 5) {
        validationMessage.textContent = 'Maximum 5 emails can be added.';
        validationMessage.style.color = 'red';
        return false;
    }

    if (emailInput === '') {
        validationMessage.textContent = 'Please enter an email address';
        validationMessage.style.color = 'red';
        return false;
    } else if (!emailArray.every(email => emailPattern.test(email.trim()))) {
        validationMessage.textContent = 'Invalid email address';
        validationMessage.style.color = 'red';
        return false;
    } else {
        validationMessage.textContent = '';
        return true;
    }
}
//Add Dynamic email textbox
$(document).on('click', '#addemailtrademark', function () {
    dynamicFieldCount = 0;
    trademarkId = $(this).attr("tradeid");
    $('#addNewDiv').html("");
    $('#emailTrackerId_').val('');
    $('#emailValidationMessage').text('');
    $('#emailValidationMessage').css('color', '');
    $('#emailmodalTracker').modal('show');
    $('#btnEmailForTracker').attr('tradeiid', trademarkId);
    BindDynamicSetEmail(trademarkId);
});

//Create Dynamic email textbox
function BindDynamicSetEmail(trademarkId) {

    var formData = new FormData();
    formData.append('tradeid', trademarkId);
    $.ajax({
        async: false,
        type: "POST",
        url: "/api/IPRApi/BindSaveEmail",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var result = JSON.parse(response.Data.data);
            for (var i = 0; i < result.length; i++) {
                if (i == 0) {
                    $('#emailTrackerId_').val(result[i].EmailId);
                }
                else {
                    //dynamicFieldCount = i;
                    //var data = "";
                    //var emailIdValue = result[i].EmailId;

                    //data += "<div class='share_via_email' id='addedDiv_" + dynamicFieldCount + "' style='display:flex; align-items:center;'>";
                    //data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' value='" + emailIdValue + "' style='border:none; outline:none; padding:0; width:fit-content;' placeholder='example@123.com' title='Please enter the receiver's mail address.' />";
                    //data += "<div style='' id='showhide_" + dynamicFieldCount + "' style='display:none'  onclick='deleteAlert_div($(this))' class='delete_div pull-right'><img src='/newassets/img/delete.svg'/>"
                    //data += "</div>"
                    //data += "</div>"

                    //$('#addNewDiv').append(data);
                    //showField();
                    dynamicFieldCount = i;
                    var data = "";
                    var emailIdValue = result[i].EmailId;
                    data += "<div class='ec_bgAlert'>";
                    data += "<div id='addedDiv_" + dynamicFieldCount + "' style='display: flex; flex-direction: row;'>";

                    // Email input with value
                    data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' value='" + emailIdValue + "' style='width:93%;margin-bottom:3px' class='inputFormat' placeholder='example@123.com' title=\"Please enter the receiver's mail address.\" />";

                    // Action buttons list
                    data += "<ul class='table_action' style='align-items: center; margin-left: 10px; display: flex;'>";

                    // Edit button
                    data += "<li>";
                    data += "<div onclick='EditAlert_div(" + dynamicFieldCount + ")' class='Edit_div_wrapper'>";
                    data += "<div class='taskoutboxbtnicon' title='Edit'><img src='/newassets/img/editmatter.png'/></div>";
                    data += "</div>";
                    data += "</li>";

                    // Delete button (converted span to div)
                    data += "<li>";
                    data += "<div id='showhide_" + dynamicFieldCount + "' style='display:none;' onclick='deleteAlert_div($(this))' class='delete_div'>";
                    data += "<div class='taskoutboxbtnicon' title='Delete'><img src='/newassets/img/delete.svg'></div>";
                    data += "</div>";
                    data += "</li>";

                    data += "</ul>"; // Close ul

                    data += "</div>"; // Close addedDiv
                    data += "</div>"; // Close ec_bgAlert

                    //data += "<div class='ec_bgAlert'>";
                    //data += "<div id='addedDiv_" + dynamicFieldCount + "' style='display: flex; flex - direction: row;padding-top: 7px;'>";
                    //data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' value='" + emailIdValue + "' style='width:93%' class='inputFormat' placeholder='example@123.com' title='Please enter the receiver's mail address.' />";
                    //data += "<div style='' onclick='EditAlert_div(" + dynamicFieldCount +")' class='Edit_div_wrapper'><div class='taskoutboxbtnicon' title='Edit'><img src='/newassets/img/pen.svg'></div>"
                    //data += "<div style='' id='showhide_" + dynamicFieldCount + "' style='display:none'  onclick='deleteAlert_div($(this))' class='delete_div'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;margin-left: 10px' title='Delete'></span>"
                    //data += "</div>"
                    //data += "</div>"
                    //data += "</div>"
                    $('#addNewDiv').append(data);
                    showField();
                }
            }
        },
        error: function (response) {
            alert('Something went wrong from our end!');
        },
        failure: function (response) {
            alert('Something went wrong from our end!')
        }
    });
}
function EditAlert_div(data) {
    $("#emailTrackerId_" + data).focus();
}
//$(document).on('input', '#emailTrackerId_', function () {
//    const getEmailVal = $(this).val();
//    validateEmail(getEmailVal);
//});

//Dynamic email validation
var checkValidMail = false;
function IsEmailValidation(email) {
    const regex =
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        checkValidMail = true;
        return false;
    }
    else {
        checkValidMail = false;
        return true;
    }
}

$(document).on('click', '#btnEmailForTracker', function () {
    var finalData = [];
    var txtEmailId = $("#emailTrackerId_").val();
    IsEmailValidation(txtEmailId);
    if (checkValidMail == true) {
        alert("Please fill valid email:-" + txtEmailId);
        return false;
    }
    if (txtEmailId == "") {
        //alert("Please fill valid email");
        new PNotify({
            title: 'Info!',
            text: 'Please fill valid email!',
            type: 'warning',
            delay: 3000
        });
    }
    finalData.push({
        emailVal: txtEmailId
    });
    if (dynamicFieldCount > 0) {
        for (var i = 1; i <= dynamicFieldCount; i++) {
            var emailId = "";
            emailId = $("#emailTrackerId_" + i).val();
            IsEmailValidation(emailId);
            if (checkValidMail == true) {
                alert("Please fill valid email:-" + emailId);
                return false;
            }
            finalData.push({
                emailVal: emailId
            });
        }
    }
    var trademarkId = $(this).attr("tradeiid");
    var getEmailVal = JSON.stringify(finalData);
    $('#emailmodalTracker').modal('hide');
    var formData = new FormData();
    formData.append('emails', getEmailVal);
    formData.append('tradeid', trademarkId);
    $.ajax({
        async: false,
        type: "POST",
        url: "/IPR/SaveEmailIdsForTracker",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            //alert('Your emails have been successfully stored!');
            new PNotify({
                title: 'Success!',
                text: 'Your emails have been successfully stored!',
                type: 'success',
                delay: 3000
            });
        },
        error: function (response) {
            // alert('Something went wrong from our end!');
            new PNotify({
                title: 'Error!',
                text: 'Something went wrong from our end!',
                type: 'error',
                delay: 3000
            });
        },
        failure: function (response) {
            //alert('Something went wrong from our end!')
            new PNotify({
                title: 'Error!',
                text: 'Something went wrong from our end!',
                type: 'error',
                delay: 3000
            });
        }
    });
});

function hideinfoModal() {

    $('#demo3').css('display', 'none');
}

/*Start Open document details*/
var docPageN = 1;
var docAppN = "";
//$(document).on('click', '#opendocumentdetails', function () {

//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idOpenDocDetail, .nav-link").addClass("active");

//    $("#divTradeInfoDetails-body").css("display", "none");
//    $("#divIPRTrademarkDoc-body").css("display", "block");
//    $("#divOppDocDetail-body").css("display", "none");
//    $("#divOppositionDetails-body").css("display", "none")
//    $("#divExaminationDetail-body").css("display", "none");
//    $("#divCorrAndNoticesDetail-body").css("display", "none");
//    $("#divPRDetails-body").css("display", "none");


//    $("#btnTradeinfoDiv").css("display", "none");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "block");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "none");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "none");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "none");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "none");


//    docPageN = 1;
//    isDocRnd = false;
//    var vApplNo = this.getAttribute('appid');
//    CheckDetailAvailability(vApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }

//    BindDocumentDetailForTrade(vApplNo, docPageN);
//});

function OpenDocumentDetails(DocApplicationNo, DocTradeId) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idOpenDocDetail, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "block");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "none")
    $("#divExaminationDetail-body").css("display", "none");
    $("#divCorrAndNoticesDetail-body").css("display", "none");
    $("#divPRDetails-body").css("display", "none");


    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "block");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "none");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "none");


    docPageN = 1;
    isDocRnd = false;
    var vApplNo = DocApplicationNo;//this.getAttribute('appid');
    globalApplNo = DocApplicationNo;
    globalTradeId = DocTradeId;

    CheckDetailAvailability(vApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    } else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    BindDocumentDetailForTrade(vApplNo, docPageN);
}

$(document).on('click', '#docPaginate', function () {
    docPageN = $(this).attr("index");
    BindDocumentDetailForTrade(docAppN, docPageN);
});
var docTotRecord = 1;
function BindDocumentDetailForTrade(vApplNo, docPageN) {
    var html = '';
    docAppN = vApplNo;
    var formData = new FormData();
    var pageIndexN = docPageN;
    /*formData.append("pagenum", pageindex);*/
    formData.append("pagenum", pageIndexN);
    formData.append("pagesize", pagesize);
    formData.append("vapplno", docAppN);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/IPRUploadedDocs",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                var length = obj.length;

                $('#tdShareDocD').attr('vapplNo', docAppN);
                if (length > 0) {
                    $('#docpdatastatus').hide();
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        //if (i === (length - 1)) {
                        //var pnext = pageIndexN;
                        //var pprev = pageIndexN;
                        //var pageno = pageIndexN;

                        //var totdata = val.TotalCount;
                        //var totpage = 0;
                        //if (val.TotalCount > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;

                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(pagesize);

                        //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#pagDocNum").attr("max", totpage);
                        //}
                        //var totalRecord = '';
                        //if (parseInt(val.TotalCount) > 2500) {
                        //    totalRecord = '2500';
                        //}
                        //else {
                        //    totalRecord = val.TotalCount;
                        //}
                        //var tfot = '';
                        //tfot += '<ul>'
                        //tfot += '<li>results <span>' + totalRecord + '</span>  <span id="doctopage" style="display:none">' + totpage + '</span></li>'
                        //tfot += '<li><span>|</span></li>'
                        ///*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'*/
                        //tfot += '<li>pages ' + pageIndexN + '/ ' + parseInt(totpage) + '</li>'
                        //tfot += '<li><span>|</span></li>'
                        //tfot += `<li><input type="number" id="pagDocNum" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabyDocPage" style="margin-left:10px;">Go</button></a></li>`
                        //if (val.TotalCount <= length) {
                        //}
                        //else if (pageno == 1) {
                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<li><span><a id="docPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //}
                        //else {
                        //    tfot += '<li><span><a id="docPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                        //}
                        //if (pageno < totpage) {
                        //    tfot += '<a  id="docPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //}
                        //tfot += '</ul>'
                        //$("#ptfooter1").html("");
                        //$("#ptfooter1").html(tfot);
                        //}
                        $('#docPagination').show();
                        var totdata = val.TotalCount;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageIndexN == totpage) {
                                $('#docNext').hide();
                                $('#docPrev').css("display", "block");
                            }
                            else {
                                $('#docNext').css("display", "block");
                            }
                            if (pageIndexN == 1) {
                                $('#docPrev').css("display", "none");
                            }
                            else {
                                $('#docPrev').css("display", "block");
                            }

                            if (isDocRnd == false) {
                                docTotRecord = totpage;
                                DocPaginationDetail(pageIndexN, totpage);
                            }
                        }
                        var path = val.vLocalFile;
                        html += '<tr><td>' + val.RowId + '</td>';
                        html += '<td>' + val.vDescription + '</td>';
                        html += '<td><ul class="table_action"><li><a class="taskoutboxbtnicon" href="' + path + '" download="' + val.vDescription + '" target="_blank" style="cursor: pointer;"><img src="/newassets/img/download.svg"></a></li></ul>';
                        html += '</td>';
                    });
                }
                else {
                    //$("#ptfooter1").html("");
                    $('#docPagination').hide();
                    $('#docpdatastatus').show();
                    //html += '<tr>'
                    //html += '<td colspan=3 align=center>Data Not Found</td>'
                    //html += '<tr>'
                }
                $("#bindIPRTrademarkDocData").html("").html(html);
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
/*Start Document detail pagination*/
var isDocRnd = false;
function DocPaginationDetail(pageindex, totdata) {
    let totPages = totdata;
    pageIndexN = pageindex;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btndocD ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btndocD ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btndocD ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#docPageNumbers").html(paginationHtml);
    isDocRnd = true;
}

$(document).on("click", ".page-btndocD", function () {
    let page = $(this).data("page");
    pageIndexN = page;
    isDocRnd = true;
    $("#doctxtgopage").val("");
    BindDocumentDetailForTrade(docAppN, pageIndexN);
    $(".page-btndocD").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#docPrev", function () {
    if (pageIndexN > 1) {
        pageIndexN = pageIndexN - 1;
    }
    isDocRnd = true;
    $("#doctxtgopage").val("");
    BindDocumentDetailForTrade(docAppN, pageIndexN);

    $(".page-btndocD").removeClass("active");
    $(".page-btndocD[data-page='" + pageIndexN + "']").addClass("active");
});


$(document).on("click", "#docNext", function () {
    if (pageIndexN => 1) {
        pageIndexN = pageIndexN + 1;
    }
    isDocRnd = true;
    $("#doctxtgopage").val("");
    BindDocumentDetailForTrade(docAppN, pageIndexN);
    $(".page-btndocD").removeClass("active");
    $(".page-btndocD[data-page='" + pageIndexN + "']").addClass("active");
});

$(document).on("click", "#docDivGo", function () {
    let goToPage = parseInt($("#doctxtgopage").val());
    if (!isNaN(goToPage)) {
        pageIndexN = goToPage;
    }
    if (goToPage > docTotRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        pageIndexN = 1;
        return false;
    }
    isDocRnd = true;
    BindDocumentDetailForTrade(docAppN, pageIndexN);
    $(".page-btndocD").removeClass("active");
    $(".page-btndocD[data-page='" + pageIndexN + "']").addClass("active");
});
/*End Document detail pagination*/

$(document).on('click', '#getdatabyDocPage', function () {
    ppageindex = $("#pagDocNum").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#doctopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                docChangePage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});

function docChangePage(page) {
    docPageN = page;
    BindDocumentDetailForTrade(docAppN, docPageN)
}

/*End Open document details*/

/*Start Open Opposition details*/
var oppDocPageN = 1;
var oppDocAppId = "";
//$(document).on('click', '#openopposedetails', function () {

//    $(".nav-item, .nav-link").removeClass("active");
//    $("#idOpenOppDoc, .nav-link").addClass("active");

//    $("#divTradeInfoDetails-body").css("display", "none");
//    $("#divIPRTrademarkDoc-body").css("display", "none");
//    $("#divOppDocDetail-body").css("display", "block");
//    $("#divOppositionDetails-body").css("display", "none")
//    $("#divExaminationDetail-body").css("display", "none");
//    $("#divCorrAndNoticesDetail-body").css("display", "none");
//    $("#divPRDetails-body").css("display", "none");

//    $("#btnTradeinfoDiv").css("display", "none");
//    // start document 
//    $("#btnTradeDocDiv").css("display", "none");
//    //start Opposition doc
//    $("#btnTradeOppDocDiv").css("display", "block");
//    //start Opposition detail
//    $("#btnTradeOppDetailDiv").css("display", "none");
//    //start corr detail
//    $("#btnTradePRDiv").css("display", "none");
//    //start PR detail
//    $("#btnTradeCorrDiv").css("display", "none");
//    //start Examination detail
//    $("#btnTradeExamDiv").css("display", "none");

//    var vApplNo = this.getAttribute('appid');

//    CheckDetailAvailability(vApplNo);
//    if (examDocAvail != "0") {
//        $("#idExaminationDetails").css("display", "block");
//    }
//    if (prDetailAvail != "0") {
//        $("#idPRDetails").css("display", "block");
//    }
//    if (corDocAvail != "0") {
//        $("#idCorrAndNotices").css("display", "block");
//    }
//    if (opposeStatus != "0") {
//        $("#idOpenOppDoc").css("display", "block");
//        $("#idOppositionDetails").css("display", "block");
//    }

//    isDocRnd = false;
//    oppDocAppId = vApplNo;
//    oppDocPageN = 1;
//    BindOppositionDetail(vApplNo, oppDocPageN)
//});

function ViewOppDocDetails(ApplicationN, tradeid) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idOpenOppDoc, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "block");
    $("#divOppositionDetails-body").css("display", "none")
    $("#divExaminationDetail-body").css("display", "none");
    $("#divCorrAndNoticesDetail-body").css("display", "none");
    $("#divPRDetails-body").css("display", "none");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "block");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");
    //start corr detail
    $("#btnTradePRDiv").css("display", "none");
    //start PR detail
    $("#btnTradeCorrDiv").css("display", "none");
    //start Examination detail
    $("#btnTradeExamDiv").css("display", "none");

    var vApplNo = ApplicationN;//this.getAttribute('appid');
    globalApplNo = ApplicationN;
    globalTradeId = tradeid;

    CheckDetailAvailability(vApplNo);
    if (examDocAvail != "0") {
        $("#idExaminationDetails").css("display", "block");
    } else {
        $("#idExaminationDetails").css("display", "none");
    }
    if (prDetailAvail != "0") {
        $("#idPRDetails").css("display", "block");
    } else {
        $("#idPRDetails").css("display", "none");
    }
    if (corDocAvail != "0") {
        $("#idCorrAndNotices").css("display", "block");
    } else {
        $("#idCorrAndNotices").css("display", "none");
    }
    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }

    isDocRnd = false;
    oppDocAppId = vApplNo;
    oppDocPageN = 1;
    BindOppositionDetail(vApplNo, oppDocPageN)
}
var oppTotDetail = 1;
function BindOppositionDetail(ApplNo, oppDocPageN) {
    var html = '';
    var oppPageIn = oppDocPageN;
    var vApplNo = ApplNo;
    var formData = new FormData();
    formData.append("pagenum", oppPageIn);
    formData.append("pagesize", pagesize);
    formData.append("vapplno", vApplNo);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/IPROppositionUploadedDocs",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {
                var obj = response1.Data.data;

                $('#btnOppDocEmail').attr('vapplNo', vApplNo);

                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $('#OppdocPagination').show();
                        $('#docOpppdatastatus').hide();
                        $("#divalertlist tr").remove();
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //    var pnext = oppPageIn;
                            //    var pprev = oppPageIn;
                            //    var pageno = oppPageIn;

                            //    var totdata = val.TotalCount;
                            //    var oppTotpage = 0;
                            //    if (val.TotalCount > 0) {
                            //        pnext = parseInt(pnext) + 1;
                            //        if (pnext == 0) pnext = 1;

                            //        pprev = parseInt(pageno) - 1;
                            //        if (pprev == 0) pprev = 1;
                            //        oppTotpage = parseInt(totdata) / parseInt(pagesize);

                            //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //            oppTotpage = parseInt(oppTotpage) + 1;
                            //        }

                            //        $("#oppNumValue").attr("max", oppTotpage);

                            //    }
                            //    var totalRecord = '';

                            //    if (parseInt(val.TotalCount) > 2500) {
                            //        totalRecord = '2500';
                            //    }
                            //    else {
                            //        totalRecord = val.TotalCount;
                            //    }
                            //    var tfot = '';
                            //    tfot += '<ul>'
                            //    tfot += '<li>results <span>' + totalRecord + '</span>  <span id="oppSotopage" style="display:none">' + oppTotpage + '</span></li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    /*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'*/
                            //    tfot += '<li>pages ' + oppPageIn + '/ ' + parseInt(oppTotpage) + '</li>'
                            //    tfot += '<li><span>|</span></li>'
                            //    tfot += `<li><input type="number" id="oppNumValue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getOppbypagenum" style="margin-left:10px;">Go</button></a></li>`
                            //    if (val.TotalCount <= length) {
                            //    }
                            //    else if (pageno == 1) {
                            //    }
                            //    else if (pageno == oppTotpage) {
                            //        tfot += '<li><span><a id="OppPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            //    }
                            //    else {
                            //        tfot += '<li><span><a id="OppPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //    }
                            //    if (pageno < oppTotpage) {
                            //        tfot += '<a  id="OppPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //    }
                            //    tfot += '</ul>'
                            //    $("#ptfooter1").html("");
                            //    $("#ptfooter1").html(tfot);
                            //}

                            $('#OppdocPagination').show();
                            var totdata = val.TotalCount;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                $('#OppdocPagination').show();
                                $('#Oppdocpdatastatus').hide();

                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (oppPageIn == totpage) {
                                    $('#OppdocNext').hide();
                                    $('#OppdocPrev').css("display", "block");
                                }
                                else {
                                    $('#OppdocNext').css("display", "block");
                                }
                                if (oppPageIn == 1) {
                                    $('#OppdocPrev').css("display", "none");
                                }
                                else {
                                    $('#OppdocPrev').css("display", "block");
                                }

                                if (isDocRnd == false) {
                                    oppTotDetail = totpage;
                                    OppDocPaginationDetail(oppPageIn, totpage);
                                }
                            }
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.vDescription + '</td>'
                            html += '<td><ul class="table_action"><li><a class="taskoutboxbtnicon" href="' + val.vLocalFile + '" download="' + val.vDescription + '" target="_blank" style="cursor: pointer;"><img src="/newassets/img/download.svg"></a></li></ul></td>';
                        });
                    }

                    else {
                        //$("#ptfooter1").html("");
                        $('#OppdocPagination').hide();
                        $('#docOpppdatastatus').show();
                        //html += '<tr>'$('#docpdatastatus').hide();
                        //html += '<td colspan=3 align=center>Data Not Found</td>'
                        //html += '<tr>'
                    }
                }
                else {
                    //$("#ptfooter1").html("");
                    $('#OppdocPagination').hide();
                    $('#docOpppdatastatus').show();
                    //html += '<tr>'
                    //html += '<td colspan=3 align=center>Data Not Found</td>'
                    //html += '<tr>'
                }
                $("#IPRTradeOppDocData").html("").html(html);
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

/*Start Opp Document detail pagination*/
var isOppDocRnd = false;
function OppDocPaginationDetail(pageindex, totdata) {
    let totPages = totdata;
    pageIndexN = pageindex;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btndocDOpp ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btndocDOpp ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btndocDOpp ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#OppdocPageNumbers").html(paginationHtml);
    isOppDocRnd = true;
}

$(document).on("click", ".page-btndocDOpp", function () {
    let page = $(this).data("page");
    pageIndexN = page;
    isOppDocRnd = true;
    $("#Oppdoctxtgopage").val("");
    BindOppositionDetail(oppDocAppId, pageIndexN);
    $(".page-btndocDOpp").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#OppdocPrev", function () {
    if (pageIndexN > 1) {
        pageIndexN = pageIndexN - 1;
    }
    isOppDocRnd = true;
    $("#Oppdoctxtgopage").val("");
    BindOppositionDetail(oppDocAppId, pageIndexN);

    $(".page-btndocDOpp").removeClass("active");
    $(".page-btndocDOpp[data-page='" + pageIndexN + "']").addClass("active");
});


$(document).on("click", "#OppdocNext", function () {
    if (pageIndexN => 1) {
        pageIndexN = pageIndexN + 1;
    }
    isOppDocRnd = true;
    $("#Oppdoctxtgopage").val("");
    BindOppositionDetail(oppDocAppId, pageIndexN);
    $(".page-btndocDOpp").removeClass("active");
    $(".page-btndocDOpp[data-page='" + pageIndexN + "']").addClass("active");
});

$(document).on("click", "#OppdocDivGo", function () {
    let goToPage = parseInt($("#Oppdoctxtgopage").val());
    if (!isNaN(goToPage)) {
        pageIndexN = goToPage;
    }
    if (goToPage > oppTotDetail || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        pageIndexN = 1;
        return false;
    }
    isOppDocRnd = true;
    BindOppositionDetail(oppDocAppId, pageIndexN);
    $(".page-btndocDOpp").removeClass("active");
    $(".page-btndocDOpp[data-page='" + pageIndexN + "']").addClass("active");
});
/*End Document detail pagination*/


//$(document).on('click', '#OppPaginate', function () {
//    oppPageIn = $(this).attr("index");
//    BindOppositionDetail(oppDocAppId, oppPageIn);
//});

//$(document).on('click', '#getOppbypagenum', function () {
//    oppPageIn = $("#oppNumValue").val();
//    if (oppPageIn != "undefined") {
//        if (Math.sign(oppPageIn) == 1) {
//            var ppageindesx = $("#oppSotopage").text();
//            if (oppPageIn <= parseInt(ppageindesx)) {
//                loadflag = true;
//                oppChangePage(oppPageIn);
//            }
//            else {
//                alert("Invalid page no.");
//            }
//        }
//        else {
//            alert("Invalid page no.");
//        }
//    }
//});

//function oppChangePage(page) {
//    oppPageIn = page;
//    BindOppositionDetail(oppDocAppId, oppPageIn)
//}

/*End Open Opposition details*/

$(document).on('click', '#btnsearchfordesign', function () {
    isRenderPage = false;
    IPRSearchlistForDesign(pageindex);
});

function GetStatusListForGI() {
    var Ip = '4';
    var formData = new FormData();
    formData.append('ip', Ip);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/FetchDropdownValues",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data.data);
            var obj1 = obj.data;
            $('#drpstatusforgi').html('');
            $('#drpstatusforgi').append('<option value="">Select Status</option>');

            $.each(obj1, function (i, val) {
                var data1 = val.vStatus;
                if (data1 != null && data1 != "") {
                    $('#drpstatusforgi').append('<option value="' + data1 + '">' + data1 + '</option>')
                }
            });
        },
        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
    });
}

function handleSearchClassChange(selector) {
    $(document).on('change', selector, function () {
        var $selectedOptions = $(this).find('option:selected');
        var selectedValues = $selectedOptions.map(function () {
            return $(this).val();
        }).get();

        if (selectedValues.length > 5) {
            alert('Please select only 5 classes per search');
            var lastSelectedValue = selectedValues[selectedValues.length - 1];
            $(this).find('option[value="' + lastSelectedValue + '"]').prop('selected', false);
            $('input[type="checkbox"][value="' + lastSelectedValue + '"]').prop('checked', false);
        }

        var myArray = ["Value 1", "Value 2", "Value 3"];
        console.log(myArray); // Output: ["Value 1", "Value 3"]
    });
}

function convertdateCopyright(datevalue) {
    if (!datevalue) return '';
    datevalue = datevalue.replace(/\.$/, '');
    let newdate = '';
    let parsedDate = new Date(datevalue);
    if (!isNaN(parsedDate.getTime())) {
        newdate = parsedDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return newdate;
}

$(document).on('click', '#deleteTrademakeks', function () {
    if (IPname == 1) {
        window.location = encodeURI("/" + fcode + "/IPR/ViewDeletedTrademarks?IP=" + IPname);
    }
    else if (IPname == 2) {
        window.location = encodeURI("/" + fcode + "/IPR/ViewDeletedTrademarks?IP=" + IPname);
    }
    else if (IPname == 3) {
        window.location = encodeURI("/" + fcode + "/IPR/ViewDeletedTrademarks?IP=" + IPname);
    }
    else if (IPname == 4) {
        window.location = encodeURI("/" + fcode + "/IPR/ViewDeletedTrademarks?IP=" + IPname);
    }
    else if (IPname == 5) {
        window.location = encodeURI("/" + fcode + "/IPR/ViewDeletedTrademarks?IP=" + IPname);
    }
})

var dynamicFieldCount = 0;
var checkData = false;
$(document).on("click", "#btn_SaveMail", function () {
    if (dynamicFieldCount == 0) {
        dynamicFieldCount = 1;
    }
    else {
        dynamicFieldCount = dynamicFieldCount + 1;
    }
    //if (dynamicFieldCount < 5) {
    //    var data = "";

    //    data += "<div class='share_via_email' id='addedDiv_" + dynamicFieldCount + "' style='display: flex; align-items:center;'>";
    //    data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "'style='border:none; outline:none; padding:0; width:fit-content;' class='inputFormat' placeholder='example@123.com' title='Please enter the receiver's mail address.' />";
    //    data += "<div style='' id='showhide_" + dynamicFieldCount + "' style='display:none'  onclick='deleteAlert_div($(this))' class='delete_div pull-right'><img src='/newassets/img/delete.svg'/>"
    //    data += "</div>"
    //    data += "</div>"

    //    $('#addNewDiv').append(data);
    //    showField();
    //}
    //else {
    //    dynamicFieldCount = dynamicFieldCount - 1;
    //    alert("You Can't add more than 5 email");
    //}

    if (dynamicFieldCount < 5) {
        var data = "";
        //data += "<fieldset class='ec_bgAlert'>";
        //data += "<div class='ec_bgAlert'>";
        //data += "<div id='addedDiv_" + dynamicFieldCount + "' style='display: flex; flex - direction: row;padding-top: 7px;'>";
        //data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' style='width:93%' class='inputFormat' placeholder='example@123.com' title='Please enter the receiver's mail address.' />";
        //data += "<div style='' onclick='EditAlert_div(" + dynamicFieldCount + ")' class='Edit_div_wrapper'><div class='taskoutboxbtnicon' title='Edit'><img src='/newassets/img/eye.svg'/></div>"
        //data += "<div style='' id='showhide_" + dynamicFieldCount + "' style='display:none'  onclick='deleteAlert_div($(this))' class='delete_div'><div class='taskoutboxbtnicon' title='Delete'></span>"
        //data += "</div>"
        //data += "</div>"
        //data += "</div>"
        data += "<div class='ec_bgAlert'>";
        data += "<div id='addedDiv_" + dynamicFieldCount + "' style='display: flex; flex-direction: row;'>";

        // Input email
        data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' style='width:93%;margin-bottom:3px' class='inputFormat' placeholder='example@123.com' title=\"Please enter the receiver's mail address.\" />";

        // Edit button
        data += "<ul class='table_action' style='align-items: center; margin-left: 10px;'>"
        data += "<li><div onclick='EditAlert_div(" + dynamicFieldCount + ")' class='Edit_div_wrapper'>";
        data += "<div class='taskoutboxbtnicon' title='Edit'><img src='/newassets/img/editmatter.png'/></div>";
        data += "</div></li>";
        // Delete button
        data += "<li><div id='showhide_" + dynamicFieldCount + "' style='display:none' onclick='deleteAlert_div($(this))' class='delete_div'>";
        data += "<div class='taskoutboxbtnicon' title='Delete'><img src='/newassets/img/delete.svg'/></div></li>";
        data += "<ul/>"
        data += "</div>"; // Close delete_div
        data += "</div>"; // Close addedDiv
        data += "</div>"; // Close ec_bgAlert

        $('#addNewDiv').append(data);
        showField();
    }
    else {
        dynamicFieldCount = dynamicFieldCount - 1;
        alert("You Can't add more than 5 email");
    }
})

var countdata = 0;
function deleteAlert_div(data) {
    if (confirm("Are you sure you want to remove.")) {
        countdata = countdata - 1;
        var divId = 'addedDiv_' + dynamicFieldCount;
        dynamicFieldCount = dynamicFieldCount - 1;
        $("#rowcounterdata").val(dynamicFieldCount);
        //data.parents('ec_bgAlert').remove();
        $('.ec_bgAlert #' + divId).remove();
        showField();
    }
}

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


function showField() {
    for (var j = 1; j <= dynamicFieldCount; j++) {
        if (j == dynamicFieldCount) {
            $('#showhide_' + j).show();
        }
        else {
            $('#showhide_' + j).hide();
        }
    }
}


//$(document).on('click', '#oexcelforGI', function () {
//    $("#myModalexport").modal({ show: true });
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action">' +
//            '<li>' +
//            '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="downloadGIExcelTrack" pageno="' + i + '" type="excel">' +
//            '<img src="/newassets/img/download.svg" alt="Download File" />' +
//            '</span>' +
//            '</li>' +
//            '</ul></td>';

//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});

$(document).on('click', '#oexcelforGI', function () {
    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropGIExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelGI">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';
    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);

    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropGIExcel").html(html);
});

$(document).on("click", "#CommonExportExcelGI", function () {
    var pagenum = $("#id_exportreportdropGIExcel").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applicationno = $('#txtapplicationno').val();
    var applicationname = $('#txtapplicant').val();
    var vstatus = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalNo = $('#txtjournalno').val();
    var filingdatefrom = $('#txtdatefilingfrom').val();
    var filingdateto = $('#txtdatefilingto').val();
    var validupto = $('#validupto').val();
    var vsort = $('#vsort').val();
    if (vsort == undefined) {
        vsort = 0;
    }
    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }
    if (validupto != '' && validupto != null) {
        validupto = convertorightFormat(validupto);
    }
    var vcolname = $('#vcolname').val();

    window.location = encodeURI('/IPR/GITrackerExportoExcelList?filtertradmark=' + searchtext + '&txtapplicationno=' + applicationno + '&applicationname=' + applicationname +
        '&vstatus=' + vstatus + '&vclass=' + vclass + '&journalNo=' + journalNo + '&txtdatefilingfrom=' + filingdatefrom + '&txtdatefilingto=' + filingdateto + '&validupto=' + validupto + '&pagenum=' + pagenum + '&pagesize=10');
});

$(document).on('click', '#downloadGIExcelTrack', function () {
    var pagenum = $(this).attr('pageno');
    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applicationno = $('#txtapplicationno').val();
    var applicationname = $('#txtapplicant').val();
    var vstatus = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalNo = $('#txtjournalno').val();
    var filingdatefrom = $('#txtdatefilingfrom').val();
    var filingdateto = $('#txtdatefilingto').val();
    var validupto = $('#validupto').val();
    var vsort = $('#vsort').val();
    if (vsort == undefined) {
        vsort = 0;
    }
    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }
    if (validupto != '' && validupto != null) {
        validupto = convertorightFormat(validupto);
    }
    var vcolname = $('#vcolname').val();

    window.location = encodeURI('/IPR/GITrackerExportoExcelList?filtertradmark=' + searchtext + '&txtapplicationno=' + applicationno + '&applicationname=' + applicationname +
        '&vstatus=' + vstatus + '&vclass=' + vclass + '&journalNo=' + journalNo + '&txtdatefilingfrom=' + filingdatefrom + '&txtdatefilingto=' + filingdateto + '&validupto=' + validupto + '&pagenum=' + pagenum + '&pagesize=10');
});

//$(document).on('click', '#opdfforGI', function () {
//    $("#myModalexport").modal({ show: true });
//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';
//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><ul class="table_action">' +
//            '<li>' +
//            '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttopdfGI" pageno="' + i + '" type="pdf">' +
//            '<img src="/newassets/img/download.svg" alt="Download File" />' +
//            '</span>' +
//            '</li>' +
//            '</ul></td>';

//        html += '</tr>';
//    }
//    $("#printexport").html(html);
//});

$(document).on('click', '#opdfforGI', function () {
    $("#myModalexportExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropGIPdf"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportPdfGI">Confirm</button>';
    displayImage = '<img src="/newassets/img/pdf-export.png" style="margin:-15px 0px 0 -15px">';
    $("#spDisplayImage").html(displayImage);
    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropGIPdf").html(html);
});
$(document).on("click", "#CommonExportPdfGI", function () {
    var pagenum = $("#id_exportreportdropGIPdf").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applicationno = $('#txtapplicationno').val();
    var applicationname = $('#txtapplicant').val();
    var vstatus = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalNo = $('#txtjournalno').val();
    var filingdatefrom = $('#txtdatefilingfrom').val();
    var filingdateto = $('#txtdatefilingto').val();
    var validupto = $('#validupto').val();
    var vsort = $('#vsort').val();
    if (vsort == undefined) {
        vsort = 0;
    }
    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }
    if (validupto != '' && validupto != null) {
        validupto = convertorightFormat(validupto);
    }
    var vcolname = $('#vcolname').val();

    window.location = encodeURI('/IPR/ExportAddedGIInPdf?filtertradmark=' + searchtext + '&txtapplicationno=' + applicationno + '&applicationname=' + applicationname +
        '&vstatus=' + vstatus + '&vclass=' + vclass + '&journalNo=' + journalNo + '&txtdatefilingfrom=' + filingdatefrom + '&txtdatefilingto=' + filingdateto +
        '&validupto=' + validupto + '&pagenum=' + pagenum + '&pagesize=10');
});
/*Download GI detail in pdf*/
$(document).on('click', '#exporttopdfGI', function () {
    var pagenum = $(this).attr('pageno');
    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applicationno = $('#txtapplicationno').val();
    var applicationname = $('#txtapplicant').val();
    var vstatus = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalNo = $('#txtjournalno').val();
    var filingdatefrom = $('#txtdatefilingfrom').val();
    var filingdateto = $('#txtdatefilingto').val();
    var validupto = $('#validupto').val();
    var vsort = $('#vsort').val();
    if (vsort == undefined) {
        vsort = 0;
    }
    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }
    if (validupto != '' && validupto != null) {
        validupto = convertorightFormat(validupto);
    }
    var vcolname = $('#vcolname').val();

    window.location = encodeURI('/IPR/ExportAddedGIInPdf?filtertradmark=' + searchtext + '&txtapplicationno=' + applicationno + '&applicationname=' + applicationname +
        '&vstatus=' + vstatus + '&vclass=' + vclass + '&journalNo=' + journalNo + '&txtdatefilingfrom=' + filingdatefrom + '&txtdatefilingto=' + filingdateto +
        '&validupto=' + validupto + '&pagenum=' + pagenum + '&pagesize=10');
});

/*Start Patent Documant model popup*/
$(document).on('click', '#PatentFile', function () {
    vapplno = "";
    vapplno = $(this).attr("tradeid");
    pagindexModal = 1
    loadPatentDocByAppNo();
});

function loadPatentDocByAppNo() {
    var formData = new FormData();
    formData.append("PageNum", pagindexModal);
    formData.append("PageSize", pagesizeModal);
    formData.append("applNo", vapplno);
    $("document_popup_header").html("File List");
    var headerhtml = '';
    headerhtml += '<tr>'
    headerhtml += '<th><div class="thbg" > S.No. </div></th> '
    headerhtml += '<th><div class="thbg" id = "th3">File Name </div></th> '
    headerhtml += '<th><div class="thbg" id = "th4">View </div></th> '
    headerhtml += '</tr>'
    $("#document_popup_headerList").html("").html(headerhtml);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/PatentFileListThoughAppealNo",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.data;
                var htmls = "";
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $.each(obj, function (index, value) {
                            if (index === (length - 1)) {
                                var pnext = pagindexModal;
                                var pprev = pagindexModal;
                                var pageno = pagindexModal;
                                var totdata = value.TotalRecords;
                                var totpage = 0;
                                if (value.TotalRecords > 0) {
                                    pnext = parseInt(pnext) + 1;
                                    if (pnext == 0) pnext = 1;

                                    pprev = parseInt(pageno) - 1;
                                    if (pprev == 0) pprev = 1;
                                    totpage = parseInt(totdata) / parseInt(pagesizeModal);

                                    if (parseInt(totdata) % parseInt(pagesizeModal) != 0) {
                                        totpage = parseInt(totpage) + 1;
                                    }
                                }

                                var tfot = '';
                                tfot += '<ul>'
                                tfot += '<li>results <span>' + value.TotalRecords + '</span></li>'

                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pagindexModal + '/ <span id="Patentdocsotopage">' + parseInt(totpage) + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += `<li><input type="number" id="PatentDocPagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="PatentGetDocPageNo" style="margin-left:10px;">Go</button></a></li>`

                                if (value.TotalRecords <= length) {

                                }
                                else if (pageno == 1) {

                                }
                                else if (pageno == totpage) {
                                    tfot += '<li><span><a id="PatentpaginateData"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'
                                }
                                else {
                                    tfot += '<li><span><a id="PatentpaginateData"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                                }

                                if (pageno < totpage) {
                                    tfot += '<a  id="PatentpaginateData" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'
                                }

                                tfot += '</ul>'
                                $("#modalFotter").html("");
                                $("#modalFotter").html(tfot);
                            }
                            htmls += '<tr>' +
                                '<td>' + value.RowNum + '</td>' +
                                '<td>' + value.vFileName + '</td>' +
                                '<td><a href="' + value.vLocalFile + '" target="_blank">view</a></td>' +
                                '</tr>';

                        });
                        $('#bindfileList').html(htmls);
                    }
                    else {
                        htmls += '<tr>' +
                            '<td colspan="6" style="text-align: center;">Data Not Found</td>' +
                            '</tr>';
                        $('#bindfileList').html(htmls);
                    }
                }
            }
        });
}


$(document).on('click', '#PatentpaginateData', function () {
    pagindexModal = $(this).attr("index");
    loadPatentDocByAppNo();
});

$(document).on('click', '#PatentGetDocPageNo', function () {
    var pageindex = $("#PatentDocPagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var totalPage = $("#Patentdocsotopage").text();
            if (pageindex <= parseInt(totalPage)) {
                pagindexModal = pageindex;
                loadPatentDocByAppNo();
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    }
});

/*END Patent Documant model popup*/


$(document).on('click', '#DecisionDocPatentFile', function () {
    vapplno = "";
    vapplno = $(this).attr("tradeid");
    pagindexModal = 1
    loadPatentDecisionDocByAppNo();
});


function loadPatentDecisionDocByAppNo() {
    var formData = new FormData();
    formData.append("PageNum", pagindexModal);
    formData.append("PageSize", pagesizeModal);
    formData.append("applNo", vapplno);
    $("#document_popup_header").html("Order(s)/Decision(s) Doc Details");
    var headerhtml = '';
    headerhtml += '<tr>'
    headerhtml += '<th><div class="thbg" > APPLICATION NUMBER </div></th> '
    headerhtml += '<th><div class="thbg" id = "th2">APPLICANT </div></th> '
    headerhtml += '<th><div class="thbg" id = "th3">SECTION </div></th> '
    headerhtml += '<th><div class="thbg" id = "th4">CONTROLLER </div></th> '
    headerhtml += '<th><div class="thbg" id = "th4">DECISION DATE </div></th> '
    headerhtml += '</tr>'
    $("#document_popup_headerList").html("").html(headerhtml);
    $.ajax(
        {
            async: false,
            type: "POST",
            url: "/api/IPRApi/PatentDecisionDocFileListThoughAppealNo",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.data;
                var htmls = "";
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $.each(obj, function (index, value) {
                            if (index === (length - 1)) {
                                var pnext = pagindexModal;
                                var pprev = pagindexModal;
                                var pageno = pagindexModal;
                                var totdata = value.TotalCount;
                                var totpage = 0;
                                if (value.TotalCount > 0) {
                                    pnext = parseInt(pnext) + 1;
                                    if (pnext == 0) pnext = 1;

                                    pprev = parseInt(pageno) - 1;
                                    if (pprev == 0) pprev = 1;
                                    totpage = parseInt(totdata) / parseInt(pagesizeModal);

                                    if (parseInt(totdata) % parseInt(pagesizeModal) != 0) {
                                        totpage = parseInt(totpage) + 1;
                                    }
                                }

                                var tfot = '';
                                tfot += '<ul>'
                                tfot += '<li>results <span>' + value.TotalCount + '</span></li>'

                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pagindexModal + '/ <span id="PatentDecisiondocsotopage">' + parseInt(totpage) + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += `<li><input type="number" id="PatentDecisionDocPagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="PatentGetDecisionDocPageNo" style="margin-left:10px;">Go</button></a></li>`

                                if (value.TotalCount <= length) {

                                }
                                else if (pageno == 1) {

                                }
                                else if (pageno == totpage) {
                                    tfot += '<li><span><a id="PatentDecicionDocpaginateData"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'
                                }
                                else {
                                    tfot += '<li><span><a id="PatentDecicionDocpaginateData"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                                }

                                if (pageno < totpage) {
                                    tfot += '<a  id="PatentDecicionDocpaginateData" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'
                                }

                                tfot += '</ul>'
                                $("#modalFotter").html("");
                                $("#modalFotter").html(tfot);
                            }
                            htmls += '<tr>' +
                                '<td style="cursor: pointer;"><a href="' + value.FilePath + '" target="_blank">' + value.ApplNo + '</a></td>' +
                                '<td>' + (value.AppName == null ? '' : value.AppName) + '</td>' +
                                '<td>' + (value.Section == null ? '' : value.Section) + '</td>' +
                                '<td>' + (value.Controller == null ? '' : value.Controller) + '</td>' +
                                '<td>' + (value.DecisionDate == '01/01/1900' ? '' : value.DecisionDate) + '</td>' +
                                '</tr>';

                        });

                    }
                    else {
                        htmls += '<tr>' +
                            '<td colspan="6" style="text-align: center;">Data Not Found</td>' +
                            '</tr>';
                    }
                    $('#bindfileList').html(htmls);
                }
            }
        });
}



$(document).on('click', '#PatentDecicionDocpaginateData', function () {
    pagindexModal = $("#PatentDecicionDocpaginateData").attr("index");
    loadPatentDecisionDocByAppNo();
});

$(document).on('click', '#PatentGetDecisionDocPageNo', function () {
    var pageindex = $("#PatentDecisionDocPagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var totalPage = $("#PatentDecisiondocsotopage").text();
            if (pageindex <= parseInt(totalPage)) {
                pagindexModal = pageindex;
                loadPatentDecisionDocByAppNo();
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    }
});

//Send mail
$(document).on('click', '#tdShareCarresp', function () {
    //alert($(this).attr('tradeiid'));
    $('#btnCorrespEmail').attr('vapplNo', $(this).attr('vapplno'));
});

$(document).on('click', '#btnCorrespEmail', function () {
    var getEmailVal = $("#emailCorresPtxt").val(); //document.querySelector('input[name="sendemail"]').value;
    const emailArray = getEmailVal.split(',');
    if (getEmailVal === '') {
        alert('Please enter an email address');
        return false;
    } else if (!emailArray.every(email => emailPattern.test(email.trim()))) {
        alert('Invalid email address')
        return false;
    } else {

    }

    var emailTo = getEmailVal;
    var applNo = $(this).attr('vapplno');
    var formData = new FormData();
    formData.append('IPList', (IPname));
    formData.append('To', btoa(emailTo));
    formData.append('applNo', applNo);

    $.ajax({
        async: true,
        url: "/IPR/SendCorrNoticeMail",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',

        success: function (response) {

            alert('Email Sent Successfully!');
        },

        failure: function (response) {
            alert('Email Sent Successfully!');
        },

        error: function (response) {
            alert('Email Sent Successfully!');
        }
    });
});
//Send Exam
$(document).on('click', '#tdShareDocD', function () {
    //alert($(this).attr('tradeiid'));
    $('#btnDocEmail').attr('vapplNo', $(this).attr('vapplno'));
});

$(document).on('click', '#btnDocEmail', function () {
    var getEmailVal = $("#emailDoctxt").val(); //document.querySelector('input[name="sendemail"]').value;
    const emailArray = getEmailVal.split(',');
    if (getEmailVal === '') {
        alert('Please enter an email address');
        return false;
    } else if (!emailArray.every(email => emailPattern.test(email.trim()))) {
        alert('Invalid email address')
        return false;
    } else {

    }

    var emailTo = getEmailVal;
    var applNo = $(this).attr('vapplno');
    var formData = new FormData();
    formData.append('IPList', (IPname));
    formData.append('To', btoa(emailTo));
    formData.append('applNo', applNo);

    $.ajax({
        async: true,
        url: "/IPR/SendDocumentListMail",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',

        success: function (response) {

            alert('Email Sent Successfully!');
        },

        failure: function (response) {
            alert('Email Sent Successfully!');
        },

        error: function (response) {
            alert('Email Sent Successfully!');
        }
    });
});

$(document).on('click', '#btnOppDocEmail', function () {
    //alert($(this).attr('tradeiid'));
    $('#btnOppDocEmail').attr('vapplNo', $(this).attr('vapplno'));
});

$(document).on('click', '#btnOppDocEmail', function () {
    var getEmailVal = $("#emailOppDoctxt").val();
    const emailArray = getEmailVal.split(',');
    if (getEmailVal === '') {
        alert('Please enter an email address');
        return false;
    } else if (!emailArray.every(email => emailPattern.test(email.trim()))) {
        alert('Invalid email address')
        return false;
    } else {

    }

    var emailTo = getEmailVal;
    var applNo = $(this).attr('vapplno');
    var formData = new FormData();
    formData.append('IPList', (IPname));
    formData.append('To', btoa(emailTo));
    formData.append('applNo', applNo);

    $.ajax({
        async: true,
        url: "/IPR/SendOppDocumentListMail",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',

        success: function (response) {

            alert('Email Sent Successfully!');
        },

        failure: function (response) {
            alert('Email Sent Successfully!');
        },

        error: function (response) {
            alert('Email Sent Successfully!');
        }
    });
});

$(document).on('click', '#tdShareOppDetail', function () {
    $('#btnOppDetailEmail').attr('vapplNo', $(this).attr('vapplno'));
});

$(document).on('click', '#btnOppDetailEmail', function () {
    var getEmailVal = $("#emailOppDtailtxt").val();
    const emailArray = getEmailVal.split(',');
    if (getEmailVal === '') {
        alert('Please enter an email address');
        return false;
    } else if (!emailArray.every(email => emailPattern.test(email.trim()))) {
        alert('Invalid email address')
        return false;
    } else {

    }
    var applNo = $(this).attr('vapplno');
    if (applNo == "" || applNo == undefined) {
        alert('Data is not found');
        return false;
    }

    var emailTo = getEmailVal;

    var formData = new FormData();
    formData.append('IPList', (IPname));
    formData.append('To', btoa(emailTo));
    formData.append('applNo', applNo);

    $.ajax({
        async: true,
        url: "/IPR/SendOppDetailListMail",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',

        success: function (response) {

            alert('Email Sent Successfully!');
        },

        failure: function (response) {
            alert('Email Sent Successfully!');
        },

        error: function (response) {
            alert('Email Sent Successfully!');
        }
    });
});



//$(document).on('click', '#opendocumentdetails', function () {
//    var html = '';
//    var vApplNo = this.getAttribute('appid');
//    var formData = new FormData();
//    formData.append("pagenum", pageindex);
//    formData.append("pagesize", pagesize);
//    formData.append("vapplno", vApplNo);
//    $.ajax(
//        {
//            async: false,
//            type: "POST",
//            url: "/api/IPRApi/IPRUploadedDocs",
//            dataType: 'json',
//            data: formData,
//            contentType: false,
//            processData: false,

//            success: function (response1) {
//                var obj = response1.Data.data;
//                var length = obj.length;
//                if (length > 0) {
//                    $("#divalertlist tr").remove();
//                    $.each(obj, function (i, val) {
//                        if (i === 0) {
//                            firstvalue = val.RowId;
//                        }
//                        if (i === (length - 1)) {
//                            var pnext = pageindex;
//                            var pprev = pageindex;
//                            var pageno = pageindex;

//                            var totdata = val.TotalCount;
//                            var totpage = 0;
//                            if (val.TotalCount > 0) {
//                                pnext = parseInt(pnext) + 1;
//                                if (pnext == 0) pnext = 1;

//                                pprev = parseInt(pageno) - 1;
//                                if (pprev == 0) pprev = 1;
//                                totpage = parseInt(totdata) / parseInt(pagesize);

//                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
//                                    totpage = parseInt(totpage) + 1;
//                                }

//                                $("#pagnumvalue").attr("max", totpage);

//                            }
//                            var totalRecord = '';

//                            if (parseInt(val.TotalCount) > 2500) {
//                                totalRecord = '2500';
//                            }

//                            else {
//                                totalRecord = val.TotalCount;
//                            }

//                            var tfot = '';
//                            tfot += '<ul>'
//                            tfot += '<li>results <span>' + totalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

//                            tfot += '<li><span>|</span></li>'
//                            /*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'*/
//                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
//                            tfot += '<li><span>|</span></li>'
//                            tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

//                            if (val.TotalCount <= length) {

//                            }
//                            else if (pageno == 1) {

//                            }
//                            else if (pageno == totpage) {
//                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'

//                            }

//                            else {
//                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
//                            }

//                            if (pageno < totpage) {
//                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
//                            }

//                            tfot += '</ul>'
//                            $("#ptfooter1").html("");
//                            $("#ptfooter1").html(tfot);
//                        }

//                        var path = val.vLocalFile;

//                        html += '<tr><td>' + val.RowId + '</td>';
//                        html += '<td><a href="' + path + '" download="' + val.vDescription + '" target="_blank" style="cursor: pointer;">' + val.vDescription + '</a></td>';
//                    });
//                }

//                else {
//                    $("#ptfooter1").html("");
//                    html += '<tr>'

//                    html += '<td colspan=3 align=center>Data Not Found</td>'

//                    html += '<tr>'
//                }

//                $("#bindIPRTrademarkDocData").html("").html(html);
//                closeload();
//            },
//            failure: function (data) {
//                alert(data.responseText);
//            },
//            error: function (data) {
//                alert(data.responseText);

//            }
//        });
//});

