var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pindex = 1, psize = 1;
var downloadTradeId = "";
var pagindexModal = 1, pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var vapplno = "";
var globalApplNo = "";
var globalTradeId = "";
var setValueAsGlobal = "";
var corDocAvail = "0";
var prDetailAvail = "0";
var examDocAvail = "0";
var opposeStatus = "0";

$(document).ready(function () {
    $("#hideIPList").remove();

    switch (IPname) {
        case '1':
            ClassCounter();
            $('#mdChange').html('Send Trademark Details To :');
            $('#dynamiciprheader').text("Add Trademark");
            $('#dynamicnotiheader').text('Trademark');
            $('#headerSearchIdD').text('Trademark');
            $('#spPropActionName').text('Proprietor');
            $('#filtertradmark').attr('placeholder', 'Trademark');
            $('#th11header').css("display", "flex")
            $("#tSPagination").hide();
            //$('#spPhoneticSearch').show();
            break;
        case '2':
            emptyUnusedFiltersForCopyright();
            fillDivForCopyright();
            bindcategoryandstatusforCopyright();
            //bindcategoryandstatusforCopyright();
            multiselectwithcheckbox();
            $('#spPhoneticSearch').css("display", "none");
            $('#mdChange').html('Send Copyright Details To :');
            $('#dynamiciprheader').text("Add Copyright");
            $('#dynamicnotiheader').text('Copyright');
            $('#searchIP').text("Copyright")
            $('#spPropActionName').text('Applicant');
            $('#headerSearchIdD').text('Copyright Name');
            $('#filtertradmark').attr('placeholder', 'Copyright');
            $("#tSPagination").hide();
            break;
        case '3':
            emptyUnusedFiltersForPatent();
            bindstatusforPatent();
            fillDivForPatents();
            //bindstatusforPatent();
            $('#spPhoneticSearch').css("display", "none");
            $('#mdChange').html('Send Patent Details To :');
            $('#dynamicnotiheader').text('Patent');
            $('#dynamiciprheader').text("Add Patent");
            $('#searchIP').text("Patent")
            $('#spPropActionName').text('Applicant');
            $('#headerSearchIdD').text('Patent Name');
            $('#filtertradmark').attr('placeholder', 'Patent');
            $("#tSPagination").hide();
            break;
        case '4':
            emptyUnusedFiltersForGI();
            fillDivForGI();
            GetStatusListForGI();
            //GetStatusListForGI();
            $('#spPhoneticSearch').css("display", "none");
            $('#mdChange').html('Send GI Details To :');
            $('#dynamiciprheader').text("Add GI");
            $('#spPropActionName').text('Applicant');
            $('#dynamicnotiheader').text('Geographical Indication');
            $('#searchIP').text("GI")
            $('#headerSearchIdD').text('GI Name');
            $('#filtertradmark').attr('placeholder', 'GI Name ');
            $("#tSPagination").hide();
            break;
        case '5':
            $('#hideIPList').attr('hidden', true);
            $('#spPhoneticSearch').css("display", "none");
            emptyUnusedFiltersForDesign();
            fillDivForDesign();
            hideAllFiltersForDesign();
            GetClassListForDesign();
            //GetStatusListForDesign();
            //GetClassListForDesign();
            $('#mdChange').html('Send Design Details To :');
            $('#dynamicnotiheader').text('Design');
            $('#dynamiciprheader').text("Add Design");
            $('#searchIP').text("Design")
            $('#spPropActionName').text('Applicant');
            $('#headerSearchIdD').text('Design Name');
            $('#filtertradmark').attr('placeholder', 'Design');
            $("#tSPagination").hide();
            break;
    }
    excelModal();
    setMaxDateForInputs(IPname);

    HideAllFilters();
    getuserDetails();
    function getuserDetails() {

        var IPList = '1'
        //alert(token);
        if ($('#IPList').val() == "") {
            $('#totcounter').hide();
            $('#usedcounter').hide();
        }
        else {
            $('#totcounter').show();
            $('#usedcounter').show();
        }
        var formData = new FormData();
        formData.append("ip", EncodeText(IPList));

        $.ajax({
            async: true,
            type: "POST",
            dataType: "json",
            url: "/api/IPRApi/UsedSinceList",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data.data);
                $("#searchuserdetetail").empty();
                $("#searchuserdetetail").append("<option value=''>Select</option>");
                $.each(obj.data, function (i, b) {
                    $("#searchuserdetetail").append("<option value='" + b.id + "'>" + b.Name + "</option>");
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

    if (parameterName != null) {
        switch (IPname) {
            case '1':
                QueryStringRedirect();
                IPRSearchlist(pageindex);
                GetStatusList();
                break;
            case '2':
                QueryStringRedirect();
                IPRSearchlistCopyright(pageindex);
                break;
            case '3':
                QueryStringRedirect();
                IPRSearchlistPatent(pageindex);
                break;
            case '4':
                QueryStringRedirect();
                IPRSearchlistGI(pageindex);
                break;
            case '5':
                QueryStringRedirect();
                IPRSearchlistDesign(pageindex);
                break;
        }

    }
    GetAllAddedMarksId();
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
});

var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;

$(document).ready(function () {

    jQuery('#searchstatus').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false

    });

    jQuery('#searchstatusforPatent').multiselect({
        columns: 1,
        selectAll: true,
    });

    jQuery('#searchclass').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });

    jQuery('#drpstatusforgi').multiselect({

        search: true,
        columns: 1,
        selectAll: false
    });
    jQuery('#searchstatusforDesign').multiselect({

        search: true,
        columns: 1,
        selectAll: false
    });

    $(document).on('change', '#JurisdictionList', function () {

        if ($('#JurisdictionList').val() == '2') {

            $('#txtapplicationno').attr('disabled', 'true');
            $('#searchtype').attr('disabled', 'true');
            $('#txtdateapplicationfrom').attr('disabled', 'true');
            $('#txtdateapplicationto').attr('disabled', 'true');
            $('#txtProprietor').attr('disabled', 'true');
            $('#searchuserdetetail').attr('disabled', 'true');
            $('#searchclass').val('');
            $('#searchclass').multiselect('reload');
            $('#searchstatus').val('');
            $('#searchstatus').multiselect('reload');

            //var html = $('#iprform').html();
            var btnattr = document.querySelectorAll("form#iprform");
            $.each(btnattr, function (i, val) {

                $.each(val, function (i, val1) {
                    if (val1.nodeName == 'BUTTON') {

                        val1.disabled = false;
                    }

                });

            });

            //$('#btncollapse > button').removeAttr('disabled');
            //$('#advsearch').removeAttr('disabled');

            $('#btnsearch').removeAttr('disabled');
            $('#btnclear').removeAttr('disabled');
        }

        else {
            $('#txtapplicationno').removeAttr('disabled');
            $('#searchtype').removeAttr('disabled');
            $('#txtdateapplicationfrom').removeAttr('disabled');
            $('#txtdateapplicationto').removeAttr('disabled');
            $('#txtProprietor').removeAttr('disabled');
            $('#searchuserdetetail').removeAttr('disabled');

            var btnattr = document.querySelectorAll("form#iprform");
            $.each(btnattr, function (i, val) {

                $.each(val, function (i, val1) {
                    if (val1.nodeName == 'BUTTON') {

                        val1.disabled = false;
                    }

                });

            });
        }


    });

    $('form[id="iprform"]').validate({

        submitHandler: function (form) {

            GetIPRSignUP("");
        }
    });

    $(document).on('click', '#btnEmail', function () {
        var getEmailVal = document.querySelector('input[name="sendemail"]').value;
        //if (getEmailVal == '') {

        //    alert('Please enter an email id');
        //    return false;
        //}
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

    $("#btnsearch").click(function () {
        isSearchRnd = false;
        switch (IPname) {
            case '1':
                $('#statusDropdown').val('');
                $('#ApplicationdateTo').val('');
                $('#applfrmdate').val('');
                $("#Applicationcleardate").css("display", "none");
                tblSearchstatus = "";
                appFromDate = "";
                appToDate = "";
                IPRSearchlist(pageindex);
                break;

            case '2':
                IPRSearchlistCopyright(pageindex);
                break;

            case '3':
                IPRSearchlistPatent(pageindex);
                break;
        }
    });

    $(document).on('click', '#addtrademark', function () {
        trademarkId = $(this).attr("tradeid");
        //alert(trademarkId);
        addtrademarkdatabyiid(trademarkId);
        //IPRSearchlist(pageindex);

    });

    function addtrademarkdatabyiid(trademarkId) {
        var html = "";
        var formdata = new FormData();
        trademarkId = (trademarkId);

        var IpListValue = '1';

        formdata.append("ip", IpListValue);
        formdata.append("tradeid", trademarkId);

        $.ajax({
            async: true,
            url: "/api/IPRApi/AddTrademarkData",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data.flag == '1') {
                    var obj1 = JSON.parse(response.Data.data);
                    $("#ids_deleteTraderequesr").text("Trademark added");
                    $("#msgRUSureCon").text("Mark have been added to the tracker successfully.");
                    $("#myModalAlertconfirmation").modal();
                }
                else {
                    $("#msgRUSureCon").text("This trademark has already been added.");
                    $("#myModalAlertconfirmation").modal();
                }
            },

            failure: function (response) {
                //alert('Something went wrong on our end');
                new PNotify({
                    title: 'Error!',
                    text: 'Something went wrong. Please try again!',
                    type: 'error',
                    delay: 3000
                });
            }, //End of AJAX failure function
            error: function (response) {
                //alert('Something went wrong on our end');
                new PNotify({
                    title: 'Error!',
                    text: 'Something went wrong. Please try again!',
                    type: 'error',
                    delay: 3000
                });
            }
            //End of AJAX er
        });
    }
    /*Start page redirection*/
    $(document).on('click', "#searchPhonetictab", function () {
        window.location.href = `/${fcode}/IPR/PhoneticSearch?IP=${IPname}`;
    })
    $(document).on('click', "#backtoHome", function () {
        window.location.href = `/${fcode}/IPR/ViewAddedTrademarks?IP=${IPname}`;
    })
    $(document).on('click', "#searchIP", function () {
        window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
    })
    $(document).on('click', "#propSearch", function () {
        window.location.href = `/${fcode}/IPR/ProprietorSearch?IP=${IPname}`;
    })
    $(document).on('click', "#searchAgent", function () {
        window.location.href = `/${fcode}/IPR/AgentSearch?IP=${IPname}`;
    })
    /*End page redirection*/


    $(document).on('click', '#opentrademarkdetails', function () {

        downloadTradeId = "";
        trademarkId = $(this).attr("tradeid");
        trademarkId = (trademarkId);
        var openApplNo = $(this).attr("openDocApplNo");
        localStorage.setItem("tradeiid", trademarkId);
        $('#tmdetailsmodal').attr('tradeiid', trademarkId);
        ShowJudgementDocDetail(openApplNo);
        loadtrademarkdatabyiid(trademarkId);
        downloadTradeId = trademarkId;
    });



    window.ViewTrademarkDetailsInfo = function (vApplNo, Apptradeiid) {
        $(".nav-item, .nav-link").removeClass("active");
        $("#idOpenTradeInfo, .nav-link").addClass("active");

        $("#divTradeInfoDetails-body").css("display", "block");
        $("#divIPRTrademarkDoc-body").css("display", "none");
        $("#divOppDocDetail-body").css("display", "none");
        $("#divOppositionDetails-body").css("display", "none");

        $("#btnTradeinfoDiv").css("display", "block");
        // start document 
        $("#btnTradeDocDiv").css("display", "none");
        //start Opposition doc
        $("#btnTradeOppDocDiv").css("display", "none");
        //start Opposition detail
        $("#btnTradeOppDetailDiv").css("display", "none");


        downloadTradeId = "";
        trademarkId = Apptradeiid;//$(this).attr("tradeid");
        globalTradeId = Apptradeiid;
        trademarkId = (trademarkId);
        var openApplNo = vApplNo;//$(this).attr("openDocApplNo");
        globalApplNo = openApplNo;

        CheckDetailAvailability(openApplNo);

        if (opposeStatus != "0") {
            $("#idOpenOppDoc").css("display", "block");
            $("#idOppositionDetails").css("display", "block");
        } else {
            $("#idOpenOppDoc").css("display", "none");
            $("#idOppositionDetails").css("display", "none");
        }

        localStorage.setItem("tradeiid", trademarkId);
        $('#tmdetailsmodal').attr('tradeiid', trademarkId);
        ShowJudgementDocDetail(openApplNo);
        loadtrademarkdatabyiid(trademarkId);
        downloadTradeId = trademarkId;
    }

    $(document).on("click", "#idOpenTradeInfo", function () {
        $("#bindTrademarkDetails").empty();
        ViewTrademarkDetailsInfo(globalApplNo, globalTradeId);
    });

    function loadtrademarkdatabyiid(trademarkId) {

        var iPListValue = '1';
        var html = "";
        var imagePath = 'https://iprdocs.mykase.in/IPR_Documents_New/IPRImages/Trademark'
        var docPath = 'https://iprdocs.mykase.in/IPR_Documents/IPRDocs/Trademark/Upload_Document/'
        var formdata = new FormData();
        formdata.append("tradeid", trademarkId);
        formdata.append("ip", iPListValue);
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
                    var tfot = '';
                    html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                        + '<li><h5>TM Application No.</h5><span>' + val.vApplNo + '</span></li>'
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
                        html += '<li><h5>Judgement</h5><span><ul>' + htmlContent + '</ul></span></li>';
                    }

                    html += '<li><h5>Status</h5><span>' + val.vStatus + '</span></li>';

                    if (val.vImgPath != null && val.vImgPath != "") {
                        html += '<li><h5>Image</h5><span><img style="width:60%;height:30%" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available"></span></li>';
                    }
                    html += '</ul></div>';
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
                        htmlContent += '<li>' + '<a href="' + val.vLocalFile + '"  target="_blank" style="cursor: pointer;">' + "Judgement" + (i + 1) + '</a>' + '</li></br>'
                    });
                }

                //alert(htmlContent);
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

    $("#btnclear").click(function () {
        $("#tSPagination").hide();
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
        $("#JurisdictionList").val("1");
        //$("#excelmod").empty();
        //$("#dynamiciprheader").text("");
        $('#bindIPRSearchData').empty();
        $("#dynamiciprheaderCount").text("");
        $("#pdatastatus").show();
        $("#tradePagination").hide();
        $("#dtNotFound").html("Data not found");
        var ptfooter = document.querySelector('div[id="ptfooter"] > ul');
        if (ptfooter != null) {
            ptfooter.remove();
        }

        $('div.chk button').html('Select options');
        $('div.chk1 button').html('Select options');

        var checkboxes = $('input[type="checkbox"]');
        checkboxes.prop('checked', false);
    });

    function GetIPRSignUP(search) {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/IPRApi/GetIPRSignUP1",
            dataType: 'json',
            success: function (response1) {

                //alert(response1);

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

    //GetClassList();
    //GetStatusList();
    //GetJurisdictionList();

    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;

    $(document).on('click', '#getdatabypagenum', function () {

        /*openload();*/
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
                            IPRSearchlistCopyright(ppageindex);

                            break;
                        case '3':
                            IPRSearchlistPatent(ppageindex);

                            break;
                        case '4':
                            IPRSearchlistGI(ppageindex);

                            break;
                        case '5':
                            IPRSearchlistDesign(ppageindex);

                            break;
                    }
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

    // Start - Search IPR List on Button click depending up on which dropdown is called.

    $(document).on('click', '#paginate', function () {

        ppageindex = $(this).attr("index");
        switch (IPname) {
            case '1':
                IPRSearchlist(ppageindex);
                break;
            case '2':
                IPRSearchlistCopyright(ppageindex);
                break;
            case '3':
                IPRSearchlistPatent(ppageindex);
                break;
            case '4':
                IPRSearchlistGI(ppageindex);
                break;
            case '5':
                IPRSearchlistDesign(ppageindex);
                break;
        }
    });
});

function GetAllAddedMarksId() {

    $.ajax({
        async: true,
        url: '/api/IPRApi/TradeidFromAddedIPR',
        type: "POST",
        dataType: 'json',

        success: function (response) {
            var response = JSON.parse(response.Data.data);

        },

        failure: function () {

        },

        error: function () {

        }
    });
}

function excelModal() {
    var ip = '';
    switch (IPname) {
        case '1':
            ip = 'Trade Mark';
            break;
        case '2':
            ip = 'Copyright';
            break;
        case '3':
            ip = 'Patent';
            break;
        case '4':
            ip = 'GI';
            break;
        case '5':
            ip = 'Design';
            break;
    }

    $('#modalheader').html("export" + " " + ip + " " + "List");
}

function SearchInSearches() {

    var formData = new FormData();

    $.ajax({
        async: false,
        data: formData,
        type: 'POST',
        dataType: 'JSON',
        url: '/api/IPRApi/DataForSearchInSearch',
        contentType: false,
        processData: false,
        success: function (response) {

            /*var obj = JSON.parse(response);*/
            localStorage.setItem('listdata', JSON.stringify(response.Data.data));
            //MyObj1 = obj;
            //var quotaLeft = obj1[0].totalquota - obj1[0].usedquota;
            //$('#totcounter').html('Total Quota :' + ' ' + obj1[0].totalquota);
            //$('#usedcounter').html('Quota Left:' + ' ' + quotaLeft);
            //$('#tdr')

        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });

}

function IPRSearchInternationalWIPO() {

    var searchtext = $('#filtertradmark').val();
    if (searchtext == "") {

        alert('Please Enter Search Name!');
        return false;
    }

    var searchtext = $('#filtertradmark').val();
    var formData = new FormData();
    window.open('https://branddb.wipo.int/en/quicksearch/results?sort=score%20desc&start=0&rows=30&asStructure=%7B"_id":"19bb","boolean":"AND","bricks":%5B%7B"_id":"19bc","key":"brandName","value":"' + searchtext + '","strategy":"Simple"%7D%5D%7D&_=1697536459307&searchBy=brandName&fg=_void_', '_blank');
}
var tblSearchstatus = "";
var setTotalRecord = 1;
function IPRSearchlist(pageindex, colname) {
    var imagePath = 'https://iprdocs.mykase.in/IPR_Documents_New/IPRImages/Trademark';
    var search = $('#filtertradmark').val();
    var applno = $('#txtapplicationno').val();

    if ($.trim($('#JurisdictionList').val()) == '2') {

        IPRSearchInternationalWIPO();
    }
    else {

        localStorage.setItem('getkeyword', search);

        if (search == '' && applno == '') {
            alert('Please fill either of the following input texts - Search OR Application No.');
            return false;
        }
        var iid = '';
        var Myobj;
        var spanChange;
        var htmls;
        var IPList = '1';
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
        if (IPList == "") {
            alert("Please select IP List");
            $("#IPList").focus();
            return false;
        }
        if (searchclass == null) {
            searchclass = "";
        }
        if (searchstatus == null) {
            searchstatus = "";
        }
        if (tblSearchstatus != "") {
            searchstatus = tblSearchstatus;
        }
        //else {
        //    searchstatus = "";
        //}
        openload();
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

        $.ajax(
            {
                async: true,
                type: "POST",
                url: "/api/IPRApi/SearchIPR",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,

                success: function (response1) {
                    if (response1.Data.data.length > 0) {
                        try {
                            $("#exportrecords").val(0);
                            ShowAllSorting();
                            var obj = JSON.parse(response1.Data.data);
                            localStorage.setItem('apidata', response1.Data.data);
                            var length = obj.data.length;
                            var obj1 = obj.data;
                            var MyObj1 = 0;
                            var qty = 0;
                            //SearchInSearches();
                            if (length > 0) {
                                $("#divalertlist tr").remove();
                                $("#pdatastatus").hide();
                                $.each(obj1, function (i, val) {
                                    var flag = 0;

                                    //for (let k = 0; MyObj1.length > k; k++) {
                                    //    if (MyObj1[k].Tradeiid == val.iid) {
                                    //        flag = 1;
                                    //        break;
                                    //    }
                                    //    else {
                                    //        continue;
                                    //    }
                                    //}


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
                                    //    var totalRecord = '';

                                    //    if (parseInt(val.TotalRecord) > 2500) {
                                    //        totalRecord = '2500';
                                    //    }

                                    //    else {
                                    //        totalRecord = val.TotalRecord;
                                    //    }

                                    //    var tfot = '';
                                    //    var trademarkSearchResult = "Trademark Search(" + totalRecord + ")";
                                    //    $("#dynamiciprheader").text(trademarkSearchResult);
                                    //    $("#exportrecords").val(totalRecord);
                                    //    tfot += '<ul>'
                                    //    tfot += '<li>results <span>' + totalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                                    //    tfot += '<li><span>|</span></li>'
                                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                    //    tfot += '<li><span>|</span></li>'
                                    //    tfot += `<li><input type="number" id="pagnumvalue" min="1" max="` + parseInt(totpage) + `" class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                                    //    tfot += `<li style="margin-left:5px;"><input type="text" class="form-control selctInputFormat" style="background:#ebebeb !important;" placeholder="Search" id="searchdata" style="height:24px !important;border-bottom: 1px solid #ddd !important;" /><button type="button" style="margin: 0;position: relative;top: -36px;float: right;background: none;border: none;" class="sbtbtn" id="searchdatas"><i class="glyphicon glyphicon-search"></i></button></li>`

                                    //    if (val.TotalRecord <= length) {
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
                                    //    tfot += '</ul>'
                                    //    $("#ptfooter").html("");
                                    //    $("#ptfooter").html(tfot);
                                    //}

                                    $('#tSPagination').show();
                                    var totdata = val.TotalRecord;
                                    var totpage = 0;
                                    if (i === (length - 1)) {
                                        $("#exportrecords").val(totdata);
                                        var trademarkSearchResult = "Trademark Search(" + totdata + ")";
                                        $("#dynamiciprheaderCount").text(trademarkSearchResult);
                                        totpage = parseInt(totdata) / parseInt(pagesize);
                                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                            totpage = parseInt(totpage) + 1;
                                        }
                                        if (pageindex == totpage) {
                                            $('#tsNext').hide();
                                            $('#tsPrev').css("display", "block");
                                        }
                                        else {
                                            $('#tsNext').css("display", "block");
                                        }
                                        if (pageindex == 1) {
                                            $('#tsPrev').css("display", "none");
                                        }
                                        else {
                                            $('#tsPrev').css("display", "block");
                                        }

                                        if (isSearchRnd == false) {
                                            setTotalRecord = totpage;
                                            SearchRenderPagination(pageindex, totpage);
                                        }
                                    }

                                    qty = qty + 1;

                                    var RowId = val.RowId;
                                    var TotalRecord = val.TotalRecord;
                                    var UsedSince = val.vUsedSince.replace('Used Since :', '');
                                    iid = val.iid;
                                    var imageP = "";
                                    if (val.vImgPath != "" && val.vImgPath != null) {
                                        imageP = '<img class="table_img" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available">';
                                    }
                                    else {
                                        imageP = '<img class="table_img" src="/newassets/img/NA.svg" alt="Image Description">'
                                    }

                                    //htmls += '<tr><td style="text-align: center;">' + val.RowId + '</td><td style="text-align: center;">' + val.vApplNo + '</td><td>' + imageP + '</td><td>' + val.vWordMark + '</td><td>' + val.vProprietor + '</td><td>' + val.vStatus + '</td><td>' + val.vClass + '</td><td>' + convertdate(val.dApplDate) + '</td><td>' + newconvertdate(UsedSince) + '</td>'
                                    //    + '<td><span class="glyphicon glyphicon-eye-open" id="opentrademarkdetails" style="cursor:pointer;" title="Information retrieved from IP registry" openDocApplNo="' + (val.vApplNo) + '" tradeid="' + (val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata"></span>'
                                    //    + ' | <span class="glyphicon glyphicon-file" id="opendocumentdetails" style="cursor:pointer;" title="Document details" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#trademarkDoctDetails"></span>'
                                    //    + (val.vStatus === 'Opposed' ? ' | <span class="glyphicon glyphicon-list-alt" id="openopposedetails" style="cursor:pointer;" title="Oppose details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#trademarkDoctDetails"></span>' : '')
                                    //    + ' | <span class="glyphicon glyphicon-plus-sign" id="addtrademark" style="cursor:pointer;" title="Add To Tracker" tradeid=' + iid + '></span>'
                                    //    + (val.vStatus === 'Opposed' ? ' | <span data-toggle="modal" data-target="#oppositionDetails" appid=' + val.vApplNo + ' id="addopponentdetails" title="Opposition Details" style="cursor:pointer;"> <i class="bi bi-person-badge"></i></span>' : '')
                                    //    + '</td></tr>';

                                    htmls += '<tr>'
                                    htmls += '<td style="text-align: center; display:none;">' + val.RowId + '</td>'
                                    htmls += '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vProprietor + '</span></td>'
                                    htmls += '<td>' + val.vApplNo + '</td>'
                                    htmls += '<td style="width:20px;">' + imageP + '</td>'
                                    htmls += '<td>' + val.vWordMark + '</td>'
                                    htmls += '<td>' + val.vStatus + '</td>'
                                    htmls += '<td>' + val.vClass + '</td>'
                                    htmls += '<td>' + convertdate(val.dApplDate) + '</td>'
                                    htmls += '<td>' + newconvertdate(UsedSince) + '</td>'
                                    htmls += '<td>'
                                    htmls += '<ul class="table_action">'
                                    htmls += '<li><span class="taskoutboxbtnicon" id="addtrademark" style="cursor:pointer;" title="Add To Tracker" tradeid=' + iid + '> <img style="padding:5px;" src="/newassets/img/add_plus.svg" /> </span></li>'
                                    htmls += '<li><span class="taskoutboxbtnicon" id="opentrademarkdetails1" style="cursor:pointer;" title="Information retrieved from IP registry" onClick="ViewTrademarkDetailsInfo(' + val.vApplNo + ',' + val.iid + ')" openDocApplNo="' + (val.vApplNo) + '" tradeid="' + (val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata"> <img src="/newassets/img/tm_icon.svg" /> </span></li>'
                                    htmls += '<li><div class="input-group-btn">';
                                    htmls += '<button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="more action">';
                                    htmls += '<img src="/newassets/img/dots-vertical.svg" alt="action button"></button>';
                                    htmls += '<ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">';
                                    htmls += '<li><div class="action_one" id="opendocumentdetails1" style="cursor:pointer; padding-left:0px; padding-right:0px;" title="Document details" onClick="OpenDocumentDetailsInfo(' + val.vApplNo + ',' + val.iid + ')" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewtrademarkdata">';
                                    htmls += '<img src="/newassets/img/vewdetails.png"> Document details</div></li>';

                                    if (val.vStatus === 'Opposed') {
                                        //htmls += '<li><div class="action_one" id="openopposedetails" style="cursor:pointer; padding-left:0px; padding-right:0px;" title="Oppose document" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#trademarkOppDoctDetails">';
                                        //htmls += '<img src="/newassets/img/document-icon.png">Opposition Document</div></li>';

                                        //htmls += '<li><div class="action_one" id="addopponentdetails" title="Opposition Details" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#oppositionDetails" style="cursor:pointer; padding-left:0px; padding-right:0px;">';
                                        //htmls += '<img src="/newassets/img/opposition.png"> Opposition Details</div></li>';
                                        htmls += '<li><div class="action_one" id="openopposedetails1" style="cursor:pointer; padding-left:0px; padding-right:0px;"  onClick="ViewOppDocDetailsInfo(' + val.vApplNo + ',' + val.iid + ')" title="Oppose document" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewtrademarkdata">';
                                        htmls += '<img src="/newassets/img/document-icon.png">Opposition Document</div></li>';

                                        htmls += '<li><div class="action_one" id="addopponentdetails1" onClick="ViewOppositionDetailsInfo(' + val.vApplNo + ',' + val.iid + ')" title="Opposition Details" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewtrademarkdata" style="cursor:pointer; padding-left:0px; padding-right:0px;">';
                                        htmls += '<img src="/newassets/img/opposition.png"> Opposition Details</div></li>';
                                    }

                                    htmls += '</ul>';
                                    htmls += '</div></li>';
                                    htmls += '</ul>'
                                    htmls += '</td>'
                                    htmls += '</tr>'
                                });
                            }

                            else {
                                var trackerApplNo = $("#txtapplicationno").val();
                                if (trackerApplNo != "") {
                                    $("#ids_AddToTracker").text("Track Trademark");
                                    $("#msgRUSureTracker").text("Trademark details are currently unavailable. Please add it for tracking, and we’ll update it shortly.");
                                    $("#msgRUSureTracker1").text("Do you want to track this trademark?");
                                    $("#AddTrackerTrademarkDetails").attr("id-val", trackerApplNo);
                                    $("#myModalAddTrackerconfirmation").modal();
                                }

                                $('#tSPagination').hide();
                                $("#dynamiciprheaderCount").text("");
                                $("#pdatastatus").show();
                            }
                        }
                        catch (err) { }
                    }
                    else {
                        var trackerApplNo = $("#txtapplicationno").val();
                        if (trackerApplNo != "") {
                            $("#ids_AddToTracker").text("Track Trademark");
                            $("#msgRUSureTracker").text("Trademark details are currently unavailable. Please add it for tracking, and we’ll update it shortly.");
                            $("#msgRUSureTracker1").text("Do you want to track this trademark?");
                            $("#AddTrackerTrademarkDetails").attr("id-val", trackerApplNo);
                            $("#myModalAddTrackerconfirmation").modal();
                        }
                        $('#tSPagination').hide();
                        $("#dynamiciprheaderCount").text("");
                        $("#pdatastatus").show();
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
}
$(document).on("click", "#AddTrackerTrademarkDetails", function () {
    var html = "";
    var vApplicationNo = $(this).attr("id-val");//$(this).attr("AddTrackerTrademarkDetails");
    var formdata = new FormData();
    var IpListValue = '1';
    formdata.append("ip", IpListValue);
    formdata.append("ApplNo", vApplicationNo);

    $.ajax({
        async: true,
        url: "/api/IPRApi/AddTrademarkForTracking",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Data.data[0].Result == '1') {
                $("#myModalAddTrackerconfirmation").modal("hide");
                //var obj1 = JSON.parse(response.Data.data);
                $("#ids_deleteTraderequesr").text("Trademark added");
                $("#msgRUSureCon").text("The mark has been successfully added to the tracker. The complete details will be available shortly.");
                $("#myModalAlertconfirmation").modal();
            }
            else {
                $("#myModalAddTrackerconfirmation").modal("hide");
                $("#msgRUSureCon").text("This trademark has already been added.");
                $("#myModalAlertconfirmation").modal();
            }
        },

        failure: function (response) {
            //alert('Something went wrong on our end');
            new PNotify({
                title: 'Error!',
                text: 'Something went wrong. Please try again!',
                type: 'error',
                delay: 3000
            });
        }, //End of AJAX failure function
        error: function (response) {
            //alert('Something went wrong on our end');
            new PNotify({
                title: 'Error!',
                text: 'Something went wrong. Please try again!',
                type: 'error',
                delay: 3000
            });
        }
        //End of AJAX er
    });
})

document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});

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

/*Start Search Details*/
var isSearchRnd = false;
function SearchRenderPagination(pageindex, totpage) {
    let totPages = totpage;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btnSearch ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btnSearch ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btnSearch ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#tsPageNumbers").html(paginationHtml);
    isSearchRnd = true;
}

var setPageNo = 1;
$(document).on("click", ".page-btnSearch", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isSearchRnd = true;
    $("#tstxtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistCopyright(setPageNo);
    } else if (IPname == 3) {
        IPRSearchlistPatent(setPageNo);
    }
    else if (IPname == 4) {
        IPRSearchlistGI(setPageNo);
    }
    else {
        IPRSearchlistDesign(setPageNo);
    }
    $(".page-btnSearch").removeClass("active");
    $(".page-btnSearch[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#tsPrev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isSearchRnd = true;
    $("#tstxtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistCopyright(setPageNo);
    } else if (IPname == 3) {
        IPRSearchlistPatent(setPageNo);
    }
    else if (IPname == 4) {
        IPRSearchlistGI(setPageNo);
    }
    else {
        IPRSearchlistDesign(setPageNo);
    }
    $(".page-btnSearch").removeClass("active");
    $(".page-btnSearch[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#tsNext", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isSearchRnd = true;
    $("#tstxtgopage").val("");
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistCopyright(setPageNo);
    } else if (IPname == 3) {
        IPRSearchlistPatent(setPageNo);
    }
    else if (IPname == 4) {
        IPRSearchlistGI(setPageNo);
    }
    else {
        IPRSearchlistDesign(setPageNo);
    }
    $(".page-btnSearch").removeClass("active");
    $(".page-btnSearch[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#tsDivGo", function () {
    let goToPage = parseInt($("#tstxtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isSearchRnd = true;
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } else if (IPname == 2) {
        IPRSearchlistCopyright(setPageNo);
    } else if (IPname == 3) {
        IPRSearchlistPatent(setPageNo);
    }
    else if (IPname == 4) {
        IPRSearchlistGI(setPageNo);
    }
    else {
        IPRSearchlistDesign(setPageNo);
    }
    $(".page-btnSearch").removeClass("active");
    $(".page-btnSearch[data-page='" + setPageNo + "']").addClass("active");
});


/*End Search Detail*/



//$("#statusDropdown").change(function () {
//    searchtype = $('#statusDropdown').val();
//    IPRSearchlist(pageindex, colname)
//});

$(document).on('change', '#statusDropdown', function () {
    isSearchRnd = false;
    tblSearchstatus = $(this).val(); // Get the selected value
    IPRSearchlist(pageindex, "")

});

var appFromDate = "", appToDate = "";
$(document).on('click', '#searchByApplDate', function () {
    isSearchRnd = false;
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
    IPRSearchlist(pageindex, "");
    $("#Applicationcleardate").css("display", "block");

});
$(document).on('click', '#Applicationcleardate', function () {
    isSearchRnd = false;
    appFromDate = "";
    appToDate = "";
    $('#applfrmdate').val("");
    $('#ApplicationdateTo').val("");
    $("#Applicationcleardate").css("display", "none");
    IPRSearchlist(pageindex, "");
})




//$(document).on('click', '#opendocumentdetails', function (event, arg) {
//    var html = '';
//    var vApplNo = this.getAttribute('appid');
//    var formData = new FormData();
//    if (arg != undefined) {
//        pageindex = arg;
//        formData.append("pagenum", pageindex);
//    }
//    else {
//        formData.append("pagenum", pageindex);
//    }
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
//                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
//                            tfot += '<li><span>|</span></li>'
//                            tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`
//                            if (val.TotalCount <= length) {
//                            }
//                            else if (pageno == 1) {
//                            }
//                            else if (pageno == totpage) {
//                                tfot += '<li><span><a id="paginateprevdocs"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
//                            }
//                            else {
//                                tfot += '<li><span><a id="paginateprevdocs"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
//                            }
//                            if (pageno < totpage) {
//                                tfot += '<a  id="paginatenextdocs" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
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

//$(document).on('click', '#paginateprevdocs', function () {
//    var previouspage = $(this).attr('index');
//    $('#opendocumentdetails').trigger('click', [previouspage]);
//});

//$(document).on('click', '#paginatenextdocs', function () {
//    var nextpage = $(this).attr('index');
//    $('#opendocumentdetails').trigger('click', [nextpage]);
//});


/*Start Open document details*/
var docPageN = 1;
var docAppN = "";
$(document).on('click', '#opendocumentdetails', function () {
    docPageN = 1;
    isDocSRnd = false;
    var vApplNo = this.getAttribute('appid');
    BindDocumentDetailForTrade(vApplNo, docPageN);
});


window.OpenDocumentDetailsInfo = function (docvApplNo, docTradeid) {

    $(".nav-item, .nav-link").removeClass("active");
    $("#idOpenDocDetail, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "block");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "none");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "block");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");

    docPageN = 1;
    isDocSRnd = false;
    var vApplNo = docvApplNo;//this.getAttribute('appid');
    globalApplNo = docvApplNo;
    globalTradeId = docTradeid;
    CheckDetailAvailability(vApplNo);

    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }
    BindDocumentDetailForTrade(vApplNo, docPageN);
}
$(document).on("click", "#idOpenDocDetail", function () {
    $("#bindIPRTrademarkDocData").empty();
    OpenDocumentDetailsInfo(globalApplNo, globalTradeId);
});

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



$(document).on('click', '#docPaginate', function () {
    docPageN = $(this).attr("index");
    BindDocumentDetailForTrade(docAppN, docPageN);
});
var docTotalRecord = 1;
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
                if (length > 0) {
                    $("#docpdatastatus").hide();
                    $('#docSPagination').show();
                    $("#divalertlist tr").remove();

                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totdata = val.TotalCount;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageIndexN == totpage) {
                                $('#docSNext').hide();
                                $('#docSPrev').css("display", "block");
                            }
                            else {
                                $('#docSNext').css("display", "block");
                            }
                            if (pageIndexN == 1) {
                                $('#docSPrev').css("display", "none");
                            }
                            else {
                                $('#docSPrev').css("display", "block");
                            }

                            if (isDocSRnd == false) {
                                docTotalRecord = totpage;
                                SDocRenderPagination(pageIndexN, totpage);
                            }
                        }

                        var path = val.vLocalFile;
                        html += '<tr><td>' + val.RowId + '</td>';
                        html += '<td>' + val.vDescription + '</td>'
                        html += '<td>' +
                            '<ul class="table_action">' +
                            '<li>' +
                            '<a href="' + path + '" download="' + val.vDescription + '" target="_blank" class="taskoutboxbtnicon" style="cursor: pointer;" title="Download">' +
                            '<img src="/newassets/img/download.svg" alt="download">' +
                            '</a>' +
                            '</li>' +
                            '</ul>' +
                            '</td>';

                    });
                }
                else {
                    //$("#ptfooter1").html("");
                    //html += '<tr>'
                    //html += '<td colspan=3 align=center>Data Not Found</td>'
                    //html += '<tr>'
                    $("#docSPagination").hide();
                    $("#docpdatastatus").show();
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
/**Search document pagination start */
var isDocSRnd = false;
function SDocRenderPagination(pageIndexN, totpage) {
    let totPages = totpage;
    let paginationHtml = '';
    let maxVisible = 4;
    $("#docSPageNumbers").html("");
    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="btnDocSearch page-btn ${i === pageIndexN ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageIndexN <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="btnDocSearch page-btn ${i === pageIndexN ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="btnDocSearch page-btn ${j === pageIndexN ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#docSPageNumbers").html(paginationHtml);
    isDocSRnd = true;
}

$(document).on("click", ".btnDocSearch", function () {
    let page = $(this).data("page");
    docPageN = page;
    isDocSRnd = true;
    $("#docStxtgopage").val("");
    BindDocumentDetailForTrade(docAppN, docPageN);
    $(".page-btn").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#docSPrev", function () {
    if (docPageN > 1) {
        docPageN = docPageN - 1;
    }
    isDocSRnd = true;
    $("#docStxtgopage").val("");
    BindDocumentDetailForTrade(docAppN, docPageN);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + docPageN + "']").addClass("active");
});


$(document).on("click", "#docSNext", function () {
    if (docPageN => 1) {
        docPageN = docPageN + 1;
    }
    isDocSRnd = true;
    $("#docStxtgopage").val("");
    BindDocumentDetailForTrade(docAppN, docPageN);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + docPageN + "']").addClass("active");
});

$(document).on("click", "#docSDivGo", function () {
    let goToPage = parseInt($("#docStxtgopage").val());
    if (!isNaN(goToPage)) {
        docPageN = goToPage;
    }
    if (goToPage > docTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        docPageN = 1;
        return false;
    }
    isDocSRnd = true;
    BindDocumentDetailForTrade(docAppN, docPageN);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + docPageN + "']").addClass("active");
});

/**Search document pagination end */

var ppageindex = 1;
$(document).on('click', '#getdatabyDocPage', function () {
    ppageindex = $("#pagDocNum").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#doctopage").text();
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

function changePage(page) {
    docPageN = page;
    BindDocumentDetailForTrade(docAppN, docPageN)
}

/*End Open document details*/


/*Start Open Opposition details*/
var oppDocPageN = 1;
var oppDocAppId = "";
$(document).on('click', '#openopposedetails', function () {
    isOppDRnd = false;
    var vApplNo = this.getAttribute('appid');
    oppDocAppId = vApplNo;
    oppDocPageN = 1;
    BindOppositionDetail(vApplNo, oppDocPageN)
});

window.ViewOppDocDetailsInfo = function (oppDocApplNo, OppDocTradeId) {

    $(".nav-item, .nav-link").removeClass("active");
    $("#idOpenOppDoc, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "block");
    $("#divOppositionDetails-body").css("display", "none");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "block");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "none");

    isOppDRnd = false;
    var vApplNo = oppDocApplNo;//this.getAttribute('appid');
    oppDocAppId = vApplNo;
    globalApplNo = oppDocApplNo;
    globalTradeId = OppDocTradeId;
    oppDocPageN = 1;

    CheckDetailAvailability(vApplNo);

    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }
    BindOppositionDetail(vApplNo, oppDocPageN)
}

$(document).on("click", "#idOpenOppDoc", function () {
    $("#bindTrademarkDetails").empty();
    ViewOppDocDetailsInfo(globalApplNo, globalTradeId);
});


var oppTRecord = 1;
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
                if (obj != null) {
                    var length = obj.length;
                    if (length > 0) {
                        $("#divalertlist tr").remove();
                        $("#opppdatastatus").hide();
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            //if (i === (length - 1)) {
                            //var pnext = oppPageIn;
                            //var pprev = oppPageIn;
                            //var pageno = oppPageIn;

                            //var totdata = val.TotalCount;
                            //var oppTotpage = 0;
                            //if (val.TotalCount > 0) {
                            //    pnext = parseInt(pnext) + 1;
                            //    if (pnext == 0) pnext = 1;

                            //    pprev = parseInt(pageno) - 1;
                            //    if (pprev == 0) pprev = 1;
                            //    oppTotpage = parseInt(totdata) / parseInt(pagesize);

                            //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //        oppTotpage = parseInt(oppTotpage) + 1;
                            //    }

                            //    $("#oppNumValue").attr("max", oppTotpage);

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
                            //tfot += '<li>results <span>' + totalRecord + '</span>  <span id="oppSotopage" style="display:none">' + oppTotpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            ///*tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'*/
                            //tfot += '<li>pages ' + oppPageIn + '/ ' + parseInt(oppTotpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += `<li><input type="number" id="oppNumValue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getOppbypagenum" style="margin-left:10px;">Go</button></a></li>`
                            //if (val.TotalCount <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == oppTotpage) {
                            //    tfot += '<li><span><a id="OppPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="OppPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                            //}
                            //if (pageno < oppTotpage) {
                            //    tfot += '<a  id="OppPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#ptfooter1").html("");
                            //$("#ptfooter1").html(tfot);
                            //}
                            if (i === (length - 1)) {
                                $('#docOppPagination').show()
                                var totdata = val.TotalCount;
                                var totpage = 0;
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (oppPageIn == totpage) {
                                    $('#docOppNext').hide();
                                    $('#docOppPrev').css("display", "block");
                                }
                                else {
                                    $('#docOppNext').css("display", "block");
                                }
                                if (oppPageIn == 1) {
                                    $('#docOppPrev').css("display", "none");
                                }
                                else {
                                    $('#docOppPrev').css("display", "block");
                                }
                                if (isOppDRnd == false) {
                                    oppTRecord = totpage;
                                    OppRenderPagination(oppPageIn, totpage);
                                }
                            }


                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.vDescription + '</td>'
                            //html += '<td><a href="' + val.vLocalFile + '" download="' + val.vDescription + '" target="_blank" style="cursor: pointer;">' + val.vDescription + '</a></td>';
                            html += '<td>' +
                                '<ul class="table_action">' +
                                '<li>' +
                                '<a href="' + val.vLocalFile + '" download="' + val.vDescription + '" target="_blank" class="taskoutboxbtnicon" style="cursor: pointer;" title="Download">' +
                                '<img src="/newassets/img/download.svg" alt="download">' +
                                '</a>' +
                                '</li>' +
                                '</ul>' +
                                '</td>';

                        });
                    }

                    else {
                        $('#docOppPagination').hide();
                        $("#opppdatastatus").show();
                        //$("#ptfooter1").html("");
                        //html += '<tr>'
                        //html += '<td colspan=3 align=center>Data Not Found</td>'
                        //html += '<tr>'
                    }
                }
                else {
                    $('#docOppPagination').hide();
                    $("#opppdatastatus").show();
                    //$("#ptfooter1").html("");
                    //html += '<tr>'
                    //html += '<td colspan=3 align=center>Data Not Found</td>'
                    //html += '<tr>'
                }
                $("#bindIPRTrademarkOppDocData").html("").html(html);
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

/**Opposition pagination START */
var isOppDRnd = false;
function OppRenderPagination(pageNo, totpage) {
    let totPages = totpage;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="btnOpp ${i === pageNo ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageNo <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="btnOpp ${i === pageNo ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="btnOpp ${j === pageNo ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#docOppPageNumbers").html(paginationHtml);
    isOppDRnd = true;
}
$(document).on("click", ".btnOpp", function () {
    let page = $(this).data("page");
    oppDocPageN = page;
    isOppDRnd = true;
    $("#docOpptxtgopage").val("");
    BindOppositionDetail(oppDocAppId, oppDocPageN);
    $(".btnOpp").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#docOppPrev", function () {
    if (oppDocPageN > 1) {
        oppDocPageN = oppDocPageN - 1;
    }
    isOppDRnd = true;
    $("#docOpptxtgopage").val("");
    BindOppositionDetail(oppDocAppId, oppDocPageN);
    $(".btnOpp").removeClass("active");
    $(".btnOpp[data-page='" + oppDocPageN + "']").addClass("active");
});


$(document).on("click", "#docOppNext", function () {
    if (oppDocPageN => 1) {
        oppDocPageN = oppDocPageN + 1;
    }
    isOppDRnd = true;
    $("#docOpptxtgopage").val("");
    BindOppositionDetail(oppDocAppId, oppDocPageN);
    $(".btnOpp").removeClass("active");
    $(".btnOpp[data-page='" + oppDocPageN + "']").addClass("active");
});

$(document).on("click", "#docOppDivGo", function () {
    let goToPage = parseInt($("#docOpptxtgopage").val());
    if (!isNaN(goToPage)) {
        oppDocPageN = goToPage;
    }
    if (goToPage > oppTRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        oppDocPageN = 1;
        return false;
    }
    isOppDRnd = true;
    BindOppositionDetail(oppDocAppId, oppDocPageN);
    $(".btnOpp").removeClass("active");
    $(".btnOpp[data-page='" + oppDocPageN + "']").addClass("active");
});

/**Opposition pagination END */

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

//$(document).on('click', '#openopposedetails', function (event, arg) {
//    var html = '';
//    var vApplNo = this.getAttribute('appid');
//    var formData = new FormData();
//    if (arg != undefined) {
//        pageindex = arg;
//        formData.append("pagenum", pageindex);
//    }
//    else {
//        formData.append("pagenum", pageindex);
//    }
//    formData.append("pagesize", pagesize);
//    formData.append("vapplno", vApplNo);
//    $.ajax(
//        {
//            async: false,
//            type: "POST",
//            url: "/api/IPRApi/IPROppositionUploadedDocs",
//            dataType: 'json',
//            data: formData,
//            contentType: false,
//            processData: false,
//            success: function (response1) {
//                var obj = response1.Data.data;
//                if (obj != null) {
//                    var length = obj.length;
//                    if (length > 0) {
//                        $("#divalertlist tr").remove();
//                        $.each(obj, function (i, val) {
//                            if (i === 0) {
//                                firstvalue = val.RowId;
//                            }
//                            if (i === (length - 1)) {
//                                var pnext = pageindex;
//                                var pprev = pageindex;
//                                var pageno = pageindex;

//                                var totdata = val.TotalCount;
//                                var totpage = 0;
//                                if (val.TotalCount > 0) {
//                                    pnext = parseInt(pnext) + 1;
//                                    if (pnext == 0) pnext = 1;

//                                    pprev = parseInt(pageno) - 1;
//                                    if (pprev == 0) pprev = 1;
//                                    totpage = parseInt(totdata) / parseInt(pagesize);

//                                    if (parseInt(totdata) % parseInt(pagesize) != 0) {
//                                        totpage = parseInt(totpage) + 1;
//                                    }

//                                    $("#pagnumvalue").attr("max", totpage);

//                                }
//                                var totalRecord = '';

//                                if (parseInt(val.TotalCount) > 2500) {
//                                    totalRecord = '2500';
//                                }

//                                else {
//                                    totalRecord = val.TotalCount;
//                                }

//                                var tfot = '';
//                                tfot += '<ul>'
//                                tfot += '<li>results <span>' + totalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

//                                tfot += '<li><span>|</span></li>'
//                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
//                                tfot += '<li><span>|</span></li>'
//                                tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getOppdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

//                                if (val.TotalCount <= length) {

//                                }
//                                else if (pageno == 1) {

//                                }
//                                else if (pageno == totpage) {
//                                    tfot += '<li><span><a id="paginateprevoppdocs"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span><span>'

//                                }

//                                else {
//                                    tfot += '<li><span><a id="paginateprevoppdocs" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span><span>'
//                                }

//                                if (pageno < totpage) {
//                                    tfot += '<a  id="paginatenextoppdocs" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
//                                }

//                                tfot += '</ul>'
//                                $("#ptfooter1").html("");
//                                $("#ptfooter1").html(tfot);
//                            }
//                            var path = ConvertRegexforoppose(val.vLocalFile);
//                            html += '<tr><td>' + val.RowId + '</td>';
//                            /*html += '<td><a href="/newassets/pdf/TMDocPdf/Trademark/Opposition_Documents' + path + '" download="' + val.vDescription + '" style="cursor: pointer;" target="_blank">' + val.vDescription + '</a></td>';*/
//                            html += '<td><a href="' + path + '" download="' + val.vDescription + '" style="cursor: pointer;" target="_blank">' + val.vDescription + '</a></td>';
//                        });
//                    }

//                    else {
//                        $("#ptfooter1").html("");
//                        html += '<tr>'
//                        html += '<td colspan=3 align=center>Data Not Found</td>'
//                        html += '<tr>'
//                    }
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


function fn_clrtxt() {

    $('#emailtxt').val('');
}

function fn_search() {
    if (event.which === 13) {
        switch (IPname) {
            case '1':
                IPRSearchlist(pageindex);
                break;
            case '2':
                IPRSearchlistCopyright(pageindex);
                break;
            case '3':
                IPRSearchlistPatent(pageindex);
                break;
            case '4':
                IPRSearchlistGI(pageindex);
                break;
            case '5':
                IPRSearchlistDesign(pageindex);
                break;
        }
    }
}

function isNullCheck(param) {

    if (param == null || param == 'undefined') {

        return '';
    }

    else {

        return param;
    }
}

function fnSort(sort, colname) {
    if ($('#hdnsort').val() == 0) {
        $('#hdnsort').val(1);
    }
    else {
        $('#hdnsort').val(0);
    }
    IPRSearchlist(pageindex, colname, $('#hdnsort').val());
}

//End - New Function for sorting Data.

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
                // Add a condition to exclude the 'ALL' case
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
            //  var obj = JSON.parse(data);
            // var obj = JSON.parse(response.Data.data);
            $("#searchstatus").html("");
            $("#statusDropdown").html("");
            $("#statusDropdown").append("<option value=''>Status</option>");
            $(".ms-selectall").show();
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
            /*$("#JurisdictionList").append("<option value=''>Select</option>");*/
            $.each(obj.data, function (i, b) {

                $("#JurisdictionList").append("<option value='" + b.iid + "'>" + b.Jurisdiction + "</option>");
            });

            /*$("#JurisdictionList").append("<option value='USPTO'>USPTO</option>")*/
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

//$(document).on('click', '#advsearch', function () {

//    ShowAllFilters();
//    GetClassList();
//    GetJurisdictionList();
//    if (IPname == 1) {
//        GetStatusList();
//    }
//    else {
//        GetStatusListForGI();
//    }

//    $('#advsearch').css("display", "none");
//    //$('#btncollapse').css("display", "block");
//})

//$(document).on('click', '#btncollapse', function () {

//    HideAllFilters();
//    $('#btncollapse').css("display", "none");
//    $('#advsearch').css("display", "block");
//})

// Start - To hide all extra filters (filter that appear on clicking the 'expand advanced search' button)

function HideAllFilters() {
    //$('#divHide1').css("display", "none");
    //$('#divHide2').css("display", "none");
    //$('#proprietor').css("display", "none");
    //$('#jurisdiction').css("display", "none");

    //$("#filtertradmark").val("");
    //$("#IPList").val("");

    ShowAllFilters();
    GetClassList();
    GetJurisdictionList();
    if (IPname == 1) {
        $('#searchAgent').css("display", "block");
        GetStatusList();
    }
    else {
        GetStatusListForGI();
    }

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

// End - To hide all extra filters(filters that appear on clicking the 'expand advanced search' button)

// Start - To show all extra filters(filters that appear on clicking the 'expand advanced search' button)

function ShowAllFilters() {
    $('#divHide1').css("display", "block");
    $('#divHide2').css("display", "block");
    $('#proprietor').css("display", "block");
    $('#jurisdiction').css("display", "block");
}

// End - To show all extra filters(filters that appear on clicking the 'expand advanced search' button)

function ShowAllSorting() {
    $('#sortapplno').show();
    $('#sortmark').show();
    $('#sortpropname').show();
    $('#sortstatus').show();
    $('#sortclassdetails').show();
    /*$('#sortdateofappl').show();*/
    $('#sortuserdetails').show();
}

function QueryStringRedirect() {
    var urlParams = new URLSearchParams(window.location.search);
    var parameterName = urlParams.get("key");

    if (parameterName != "" || parameterName != null || parameterName != undefined) {
        $('#filtertradmark').val(parameterName);
        if (IPname == '1') {
            $('#IPList').val('1');
        }
        if (IPname == '2') {
            $('#IPList').val('2');
        }
        if (IPname == '3') {
            $('#IPList').val('3');
        }
        if (IPname == '4') {
            $('#IPList').val('4');
        }
        if (IPname == '5') {
            $('#IPList').val('5');
        }
    }
}

$(document).on('change', '#searchclass', function () {

    //ClassCounter();
    if ($("#searchclass option:selected").length == 1) {
        oldarr = [];
        oldarr.push($("#searchclass option:selected").val());
    }
    else {
        newarray1 = [];
        //newarray1 = newarr;
        newarr = [];
        $("#searchclass option:selected").each(function (i) {
            newarr.push($(this).val());
            newarray1 = newarr;

        });

        newarray2 = [];
        $("#searchclass option:not(:selected)").each(function (i) {

            newarray2.push($(this).val());
        });

        //newitem = $(newarr).not(oldarr).get();
        if (newarr.length > 10) {

            newitem = $(newarr).not(newarray2).get();
            alert('Please select only 10 classes per search');
            newarray1 = newarr[newarr.length - 1];
            $("#searchclass option[value='" + newarray1 + "']").prop("selected", false);
            $("input[type='checkbox'][value='" + newarray1 + "']").prop('checked', false);
            /*newarr.pop();*/
            //var abc = $('#searchclass').val();
            //alert(newitem[0]);
            //oldarr.push(newitem[0]);
        }
        else {

            //newValue = [];
            //newvalue = oldarr;
            //newvalue.pop();
        }
    }
    var myArray = ["Value 1", "Value 2", "Value 3"];

    console.log(myArray); // Output: ["Value 1", "Value 3"]

});

function ClassCounter() {
    var abc = $('#searchclass').html();
    return;
}

$(document).on('click', '#searchdatas', function () {

    var keywordSearch = $('#searchdata').val();
    localStorage.setItem('keyword', keywordSearch);
    searchdata(pindex);
});

function searchdata(pindex) {

    openload();
    var qty = 0;
    var htmls = '';
    openload();
    var getdata = localStorage.getItem('listdata');
    var keywordSearch = localStorage.getItem('keyword');

    var formData = new FormData();
    formData.append('jsondata', getdata);
    formData.append('keyword', keywordSearch);
    formData.append('pageindex', pindex)

    $.ajax({
        async: false,
        type: "POST",
        dataType: "json",
        data: formData,
        url: '/api/IPRApi/SearchInSearch',
        contentType: false,
        processData: false,
        success: function (response) {

            if (response.Data.data.length > 2) {
                var jsonValue = JSON.parse(response.Data.data);
                var obj = jsonValue.length;
                var obj1 = jsonValue;
                $("#divalertlist tr").remove();
                $('#ptfooter').empty();
                $.each(obj1, function (i, val) {
                    qty = qty + 1;
                    var RowId = val.RowId;
                    var TotalRecord = val.TotalRows;

                    if (i === 0) {

                        firstvalue = val.RowId;

                    }
                    if (i === (length - 1)) {
                        var pnext = pindex;
                        var pprev = pindex;
                        var pageno = pindex;

                        var totdata = TotalRecord;
                        var totpage = 0;
                        if (TotalRecord > 0) {
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
                        $("#exportrecords").val(TotalRecord);
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pindex + '/ ' + parseInt(totpage) + '</li>'
                        /*tfot += '<li id=pageid value=' + pageindex + '>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'*/
                        tfot += '<li><span>|</span></li>'
                        tfot += `<li><input type="number" id="pagnumvalue" min="1" class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getsearchdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

                        tfot += `<li style="margin-left:5px;"><input type="text" class="form-control selctInputFormat" style="background:#ebebeb !important;" placeholder="Search" id="searchdata" style="height:24px !important;border-bottom: 1px solid #ddd !important;" /><button type="button" style="margin: 0;position: relative;top: -36px;float: right;background: none;border: none;" class="sbtbtn" id="searchdatas"><i class="glyphicon glyphicon-search"></i></button></li>`

                        //tfot += `<li><button class="gobtn" type="button" id="clear">x</button></li>`

                        if (TotalRecord <= length) {

                        }
                        else if (pageno == 1) {

                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'

                        }

                        else {
                            tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                        }

                        if (pageno < totpage) {
                            tfot += '<a  id="paginate1" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'

                            //tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        $("#ptfooter").html("");
                        $("#ptfooter").html(tfot);

                    }
                    var flag = 0;
                    var UsedSince = val.vUsedSince.replace('Used Since :', '');

                    htmls += `<tr>
    <td style="text-align: center;>${qty}</td>
    <td style="text-align: center;">${val.vApplNo}</td>
    <td>${val.vWordMark}</td>
    <td>${val.vProprietor}</td>
    <td>${val.vStatus}</td>
    <td>${val.vClass}</td>
    <td>${convertdate(val.dApplDate)}</td>
    <td>${newconvertdate(UsedSince)}</td>
    <td>
        <ul class="table_action">
            <li>
                <a href="javascript:void(0);" class="taskoutboxbtnicon" title="Information retrieved from IP registry"
                   id="opentrademarkdetails" data-toggle="modal" data-target="#viewtrademarkdata"
                   openDocApplNo="${val.vApplNo}" tradeid="${val.iid}">
                    <img src="/newassets/img/eye.svg" alt="View" />
                </a>
            </li>
            <li>
                <a href="javascript:void(0);" class="taskoutboxbtnicon" title="Add Trademark Information"
                   id="addtrademark" tradeid="${val.iid}">
                    <img src="/newassets/img/plus-circle.png" alt="Add" />
                </a>
            </li>
        </ul>
    </td>
</tr>`;

                });
            }

            else {
                htmls += '<tr>'

                htmls += '<td colspan=11 align=center>Data Not Found</td>'

                htmls += '<tr>'
            }

            $("#bindIPRSearchData").html("").html(htmls);
            closeload();

        },
        failure: function (response) {

        },
        error: function (response) {

        }
    });
}

$(document).on('click', '#paginate1', function () {

    ppageindex = $(this).attr('index');
    searchdata(ppageindex);
});

$(document).on('click', '#getsearchdatabypagenum', function () {

    ppageindex = $("#pagnumvalue").val();

    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#sotopage").text();

            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                searchdata(ppageindex);
                closeload();

            }
            else {
                openload();
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
            closeload();
        }
        //else {
        //    alert("Please enter a valid page number.");
        //    return false;
        //}
    }
});



$(document).on('click', '#paginatenextoppdocs', function () {

    var nextpage = $(this).attr('index');

    $('#openopposedetails').trigger('click', [nextpage]);

});

//$(document).on('click', '#paginateprevoppdocs', function () {
//    var previouspage = $(this).attr('index');
//    $('#openopposedetails').trigger('click', [previouspage]);

//});

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

$(document).on('click', '#addemailtrademark', function () {
    trademarkId = $(this).attr("tradeid");
    $('#emailtxt1').val('');
    $('#emailValidationMessage').text('');
    $('#emailValidationMessage').css('color', '');
    $('#emailmodalTracker').modal('show');

    $('#btnEmail1').attr('tradeiid', trademarkId);
});

$(document).on('input', '#emailtxt1', function () {
    const getEmailVal1 = $(this).val();
    validateEmail(getEmailVal1);
});

// Sunny's Code 
//$(document).on('click', '#btnEmail1', function () {
//    var trademarkId = $('#addemailtrademark').attr("tradeid");
//    var getEmailVal1 = $('#emailtxt1').val();

//    if (!validateEmail(getEmailVal1)) {
//        alert('Please enter a valid email address');
//        return;
//    }
//    addtrademarkdatabyiid(trademarkId);
//    $('#emailmodalTracker').modal('hide');
//    IPRSearchlist(pageindex);
//});

$(document).on('click', '#btnEmail1', function () {
    var trademarkId = $(this).attr("tradeiid");
    var getEmailVal1 = $('#emailtxt1').val();

    if (!validateEmail(getEmailVal1)) {
        alert('Please enter a valid email address');
        return;
    }

    var formData = new FormData();
    formData.append('tradeiid', trademarkId);
    formData.append('getEmailVal1', getEmailVal1);


    $('#emailmodalTracker').modal('hide');

    $.ajax({

        async: false,
        type: "POST",
        url: "/IPR/SendMultipleEmailsForTMDetails",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response) {
            alert('Mail Sent Successfully!');
        },

        error: function (response) {
            alert('Mail Sent Successfully!');
        },

        failure: function (response) {
            alert('Mail Sent Successfully!');
        }
    });
});

$(document).on('click', '#btnpatentclear', function () {

    ClearAllFieldsForPatent();
})

function ClearAllFieldsForPatent() {
    $('#filtertradmark').val('');
    $('#IPList').val('');
    $('#txtapplicationno').val('');
    $('#PatentNo').val('');
    $('#datefilingfrom').val('');
    $('#datefilingto').val('');
    $('#searchstatusforPatent').val('');
    $('#searchstatusforPatent').multiselect('reload');
    $('#txtapplicantname').val('');
    $('#prioritydatefrom').val('');
    $('#prioritydateto').val('');
    $('#bindIPRSearchData').empty();
    //$('#ptfooter').empty();
    $("#tSPagination").hide();
    //$("#dynamiciprheader").text("");
    $("#dynamiciprheaderCount").text("");
    //$('#printexport').remove();
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  FUNCTIONS FOR PATENT xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

var urlParams = new URLSearchParams(window.location.search);

var parameterName = urlParams.get("key");

function IPRSearchlistPatent(pageindex) {

    var htmls = '';
    var formData = new FormData();
    var filtertrademark = $('#filtertradmark').val();
    var IPListValue = '3'
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#PatentNo').val();
    var datefilingfrom = $('#datefilingfrom').val();
    var datefilingto = $('#datefilingto').val();
    var statusforpatent = $('#searchstatusforPatent').val();
    var applicantname = $('#txtapplicantname').val();
    var prioritydategfrom = $('#prioritydatefrom').val();
    var prioritydateto = $('#prioritydateto').val();
    var pubDategfrom = $('#pubdatefrom').val();
    var pubDategTo = $('#pubdateto').val();

    if (filtertrademark == '' && applicationno == "") {
        alert(`Please fill either "SEARCH" or "APPLICATION NO." textbox!`);
        return false;
    }

    openload();

    var formData = new FormData();

    if (statusforpatent == null) {
        statusforpatent = '';
    }

    if (datefilingfrom != '' && datefilingfrom != null) {

        datefilingfrom = convertorightFormat(datefilingfrom);
    }

    if (datefilingto != '' && datefilingto != null) {

        datefilingto = convertorightFormat(datefilingto);
    }

    if (prioritydateto != '' && prioritydateto != null) {

        prioritydateto = convertorightFormat(prioritydateto);
    }

    if (prioritydategfrom != '' && prioritydategfrom != null) {

        prioritydategfrom = convertorightFormat(prioritydategfrom);
    }

    if (pubDategfrom != '' && pubDategfrom != null) {

        pubDategfrom = convertorightFormat(pubDategfrom);
    }

    if (pubDategTo != '' && pubDategTo != null) {

        pubDategTo = convertorightFormat(pubDategTo);
    }



    formData.append("filtertradmark", filtertrademark);
    formData.append("IPList", IPListValue);
    formData.append("applicationno", applicationno);
    formData.append("patentno", patentno);
    formData.append("datefilingfrom", datefilingfrom);
    formData.append("datefilingto", datefilingto);
    formData.append("searchstatusforpatent", statusforpatent);
    formData.append("applicantname", applicantname)
    formData.append("prioritydategfrom", prioritydategfrom)
    formData.append("prioritydateto", prioritydateto);

    formData.append("pubDategfrom", pubDategfrom);
    formData.append("pubDategTo", pubDategTo);

    formData.append("pagesize", pagesize);
    formData.append("pagenum", pageindex);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/SearchIPRForPatent",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response1) {
            if (response1.Data.data.length > 0) {
                $("#exportrecords").val(0);
                //ShowAllSorting();
                /*IPCounterforPatent();*/
                var obj = JSON.parse(response1.Data.data);
                localStorage.setItem('apidata', JSON.stringify(response1.Data.data));
                var length = obj.data.length;
                var obj1 = obj.data;
                var MyObj1 = 0;

                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#pdatastatus").hide();
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
                        //    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>'
                        //    tfot += `<li style="margin-left:5px; display:none;"><input type="text" class="form-control selctInputFormat" style="background:#ebebeb !important;" placeholder="Search" id="searchdata" style="height:24px !important;border-bottom: 1px solid #ddd !important;" /><button type="button" style="margin: 0;position: relative;top: -36px;float: right;background: none;border: none;" class="sbtbtn" id="searchdatasforpatent"><i class="glyphicon glyphicon-search"></i></button></li>`

                        //    tfot += `<li style="display:none;"><button class="gobtn" type="button" id="clear">x</button></li>`

                        //    if (val.TotalRecord <= length) {

                        //    }
                        //    else if (pageno == 1) {

                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //        //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        //    }

                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'

                        //        //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }

                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}

                        $('#tSPagination').show();
                        var totdata = val.TotalRecord;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            $("#exportrecords").val(totdata);
                            var trademarkSearchResult = "Patent Search(" + totdata + ")";
                            $("#dynamiciprheaderCount").text(trademarkSearchResult);
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#tsNext').hide();
                                $('#tsPrev').css("display", "block");
                            }
                            else {
                                $('#tsNext').css("display", "block");
                            }
                            if (pageindex == 1) {
                                $('#tsPrev').css("display", "none");
                            }
                            else {
                                $('#tsPrev').css("display", "block");
                            }

                            if (isSearchRnd == false) {
                                setTotalRecord = totpage;
                                SearchRenderPagination(pageindex, totpage);
                            }
                        }

                        qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;

                        //   var tempApplDate= dateFormat(new Date(val.dApplDate ));

                        //htmls += ' <tr><td style="text-align: left; display:none;">' + RowId + '</td>' +
                        htmls += ' <tr>' +
                            '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + (val.vInventionTitle == null ? '' : val.vInventionTitle) + '</span></td>' +
                            '<td style="text-align: left;">' + val.vApplNo + '</td>' +

                            '<td>' + val.vNewStatus + '</td>' +
                            //'<td>' + convertdate(val.dDateOffiling) + '</td>' +
                            '<td>' + (val.dDateOffiling == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dDateOffiling)) + '</td>' +
                            '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vApplicantName + '</span></td>' +
                            '<td>' + (val.vPatentNum == null ? '' : val.vPatentNum) + '</td>' +
                            '<td>' +
                            '<ul class="table_action">' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="openpatentdetails" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + EncodeText(val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata"><img src="/newassets/img/eye.svg" alt="edit"></span>' +
                            '</li>' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="addpatentdetails" style="cursor:pointer;" title="Add Patent Information" tradeid="' + EncodeText(val.iid) + '"><img src="/newassets/img/plus-circle.png" alt="plus-circle"></span>' +
                            '</li>' +
                            '</ul>';

                        //if (val.isDocument > 0) {
                        //    htmls += ' | ' +
                        //        '<span class="glyphicon glyphicon-folder-open" data-toggle="modal" data-target="#FileModal" id="PatentFile" style="cursor:pointer" title="File" tradeid="' + val.vApplNo + '"></span>';
                        //}
                        //if (val.DecisionDocCount != null && val.DecisionDocCount > 0) {
                        //    htmls += ' | ' + '<span class="glyphicon glyphicon-book" data-toggle="modal" data-target="#FileModal" id="DecisionDocPatentFile" style="cursor:pointer" title="Decisions and orders" tradeid="' + val.vApplNo + '"></span>';
                        //}
                        htmls += '</td></tr>';
                    });
                }
                else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                    $('#tSPagination').hide();
                    $("#dynamiciprheaderCount").text("");
                    $("#pdatastatus").show();
                }
            }
            else {
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                //htmls += '<tr>'
                $('#tSPagination').hide();
                $("#dynamiciprheaderCount").text("");
                $("#pdatastatus").show();
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

function emptyUnusedFiltersForPatent() {
    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#divHide3').empty();
    $('#headeronly').empty();
    $('#dynaction').empty();
    $('#apphide').empty();
    $('#jurisdiction').empty();
    $('#idClass').empty();
}

//function fillDivForPatents() {
//    var content1 = '<div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label" style="visibility: hidden;">Application Number</span></label><input type="text" id="txtapplicationno" name="ApplicationNo" class="form-control inputFormat" autocomplete="new-text" placeholder="Application Number"  onkeydown="fn_search(event)"/></div>';

//    $('#apphide').append(content1);

//    var content2 = '<div class="col-md-3" id="applicant"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Patent Number</span></label><input type="text" id="PatentNo" name="txtpatentno" class="form-control inputFormat" autocomplete="new-text"/></div></div>';

//    var content3 = '<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Date Of Filing - From</span></label><input class="inputFormat" type="date" id="datefilingfrom" onkeypress="return false;"/></div></div>';

//    var content4 = '<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Date Of Filing - To</span></label><input class="inputFormat" type="date" id="datefilingto" onkeypress="return false;"/></div></div>';

//    var content5 = '<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="form-control selctInputFormat" name="languageSelect[]" id="searchstatusforPatent" multiple="multiple"></select></div></div>'

//    $('#divHide1').append(content2, content3, content4, content5);

//    var content6 = '<div class="col-md-3" id="applicant"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Name Of Applicant</span></label><input type="text" id="txtapplicantname" name="ApplicantName" class="form-control inputFormat" autocomplete="new-text"/></div></div>';

//    var content7 = '<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Priority Date - From</span></label><input class="inputFormat" type="date" id="prioritydatefrom" onkeypress="return false;"/></div></div>';

//    var content8 = '<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Priority Date - To</span></label><input class="inputFormat" type="date" id="prioritydateto" onkeypress="return false;"/></div></div>';

//    $('#divHide2').append(content6, content7, content8); //content5

//    var content9 = `<div class="col-md-8"><div class="form-group col-md-12" style = "margin-top: 34px;"><div class="col-md-2"><button type="submit" id="btnsearch" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnpatentclear" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-5" style="display:none" id="btnpatentcollapse"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-5"><button type="submit" id="advpatentsearch" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div></div></div>`;

//    $('#divHide3').prepend(content9); //content7, content8, content9, content10, content11

//    var content10 = `<li><a href="javascript:void()" id="expPatentexcel" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="expPatentpdf" title="Export to PDF">Export to PDF</a></li>`;

//    $('#dynaction').append(content10);

//    $('#th1').text('Application No');
//    $('#th2').text('Title');
//    $('#th3').text('Status');
//    $('#th4').text('Date Of Filing');
//    $('#th5').text('Name Of Applicant');
//    $('#hideHeader1').text('Patent No');
//    $('#hideHeader2').remove();

//    // Adjust width of patent table
//    $('#th2header').css('width', '150px');
//    $('#th3header').css('width', '140px');
//    $('#th4').css('width', '82px');
//    $('#th5header').css('width', '150px');

//}


function fillDivForPatents() {
    var content1 = '<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Application Number</span></label><input type="text" id="txtapplicationno" name="ApplicationNo" class="form-control inputFormat" autocomplete="new-text" placeholder="Application Number"  onkeydown="fn_search(event)"/></div>';

    $('#apphide').append(content1);

    var content2 = '<div id="applicant"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Patent Number</span></label><input type="text" id="PatentNo" placeholder="Enter Patent No." name="txtpatentno" class="form-control inputFormat" autocomplete="new-text"/></div></div>';
    $('#jurisdiction').append(content2);
    var content5 = '<div><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="form-control selctInputFormat" name="languageSelect[]" id="searchstatusforPatent" multiple="multiple"></select></div></div>'
    $('#idClass').append(content5);

    var content6 = '<div class="col-md-3" id="applicant"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Name Of Applicant</span></label><input type="text" id="txtapplicantname" placeholder="Enter Applicant Name" name="ApplicantName" class="form-control inputFormat" autocomplete="new-text"/></div></div>';
    //var contentRadio = '<div class="col-md-3"><div class="form-group"><p style="margin-bottom: 3px;">Select Date</p><input type="radio" id="selectDateId" name="fav_language" class="selectDateClass" value="FilingD" checked><label class="control-label" for="FilingD">&nbsp;Date Of Filing &nbsp;</label> <input type="radio" class="selectDateClass" id="IdPriority" name="fav_language" value="Priority"><label class="control-label" for="PriorityD">&nbsp;Priority Date&nbsp;</label></div></div>';
    var contentRadio = `
  <div class="col-md-3">
    <div class="form-group">
    <label class="formLabel colorDark">Select Date</label>
    <div class="row">
       <div class="col-md-6">
        <div class="form-check selectLink">
            <input class="form-check-input selectDateClass" type="radio" name="fav_language" id="FilingD" value="FilingD" checked>
            <label class="form-check-label" for="FilingD">Date Of Filing</label>
        </div>
       </div>  
        <div class="col-md-6">
            <div class="form-check selectLink">
              <input class="form-check-input selectDateClass" type="radio" name="fav_language" id="PriorityD" value="Priority">
              <label class="form-check-label" for="PriorityD">Priority Date</label>
            </div>
        </div>
    </div>
    </div> 
  </div>`;


    //var contentRadio = '<div class="col-md-6"><div class="form-group col-md-12"><p style="margin-bottom: 3px;">Select Date</p><input type="radio" id="selectDateId" name="fav_language" class="selectDateClass" value="FilingD" checked><label class="control-label" for="FilingD">&nbsp;Date Of Filing &nbsp;</label> <input type="radio" class="selectDateClass" id="IdPriority" name="fav_language" value="Priority"><label class="control-label" for="PriorityD">&nbsp;Priority Date&nbsp;</label><input type="radio" class="selectDateClass" id="javascript" name="fav_language" value="PublicationD"><label class="control-label" for="PublicationD">&nbsp;Publication Date&nbsp;</label></div></div>';


    var content3 = `
  <div id="divDateFillingFrom">
    <div class="col-md-3">
      <div class="form-group">
        <label class="formLabel colorDark" for="datefilingfrom">From</label>
        <input class="form-control inputFormat" type="date" id="datefilingfrom" onkeypress="return false;" />
      </div>
    </div>
  </div>`;

    var content4 = `
  <div id="divDateFillingTo">
    <div class="col-md-3">
      <div class="form-group">
        <label class="formLabel colorDark" for="datefilingto">To</label>
        <input class="form-control inputFormat" type="date" id="datefilingto" onkeypress="return false;" />
      </div>
    </div>
  </div>`;

    var content7 = `
  <div id="divDatePriorityFrom" style="display:none;">
    <div class="col-md-3">
      <div class="form-group">
        <label class="formLabel colorDark" for="prioritydatefrom">From</label>
        <input class="form-control inputFormat" type="date" id="prioritydatefrom" onkeypress="return false;" />
      </div>
    </div>
  </div>`;

    var content8 = `
  <div id="divDatePriorityTo" style="display:none;">
    <div class="col-md-3">
      <div class="form-group">
        <label class="formLabel colorDark" for="prioritydateto">To</label>
        <input class="form-control inputFormat" type="date" id="prioritydateto" onkeypress="return false;" />
      </div>
    </div>
  </div>`;

    var content7P = `
  <div id="divDatePubFrom" style="display:none;">
    <div class="col-md-3">
      <div class="form-group">
        <label class="formLabel colorDark" for="pubdatefrom">From</label>
        <input class="form-control inputFormat" type="date" id="pubdatefrom" onkeypress="return false;" />
      </div>
    </div>
  </div>`;

    var content8P = `
  <div id="divDatePubTo" style="display:none;">
    <div class="col-md-3">
      <div class="form-group">
        <label class="formLabel colorDark" for="pubdateto">To</label>
        <input class="form-control inputFormat" type="date" id="pubdateto" onkeypress="return false;" />
      </div>
    </div>
  </div>`;

    var content9 = `
  <div class="col-md-12">
    <div class="form-group flex-end mt-3">
      <button type="submit" id="btnsearch" class="btn btn-primary" value="SEARCH">Search</button>
      <button type="submit" id="btnpatentclear" class="btn btn-secondary" value="CLEAR">Reset</button>
    </div>
  </div>`;

    // Append all content
    $('#divHide1').append(content6, contentRadio, content3, content4, content7, content8, content7P, content8P, content9);


    //$('#divHide2').append(content3, content4, content7, content8, content7P, content8P, content9);

    //var content9 = '<div class="col-md-8"><div class="form-group col-md-12" style = "margin-top: 34px;"><div class="col-md-2"><button type="submit" id="btnsearch" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnpatentclear" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-5" style="display:none" id="btnpatentcollapse"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-5"><button type="submit" id="advpatentsearch" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div></div></div>';
    //var content9 = '<div class="col-md-8"><div class="form-group" style = "margin-top: 34px;"><div class="col-md-2"><button type="submit" id="btnsearch" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnpatentclear" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div></div></div>';

    //$('#divHide3').prepend(content9);

    var content10 = '<li><a href="javascript:void()" id="expPatentexcel" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="expPatentpdf" title="Export to PDF">Export to PDF</a></li>';

    $('#dynaction').append(content10);

    //$('#th1').text('Application No');
    //$('#th2').text('Title');
    //$('#th3').text('Status');
    //$('#th4').text('Date Of Filing');
    //$('#th5').text('Name Of Applicant');
    //$('#hideHeader1').text('Patent No');
    //$('#hideHeader2').remove();

    $('#th1').text('Application No');

    $('#th2').text('Status');

    $('#th3').text('Title');

    $('#th4').text('Date Of Filing');

    $('#th5').text('Name Of Applicant');

    $('#hideHeader1').text('Patent No');

    $('#hideHeader2').remove();



    // Adjust width of patent table
    $('#th2header').css('width', '150px');
    $('#th3header').css('width', '140px');
    $('#th4').css('width', '82px');
    $('#th5header').css('width', '150px');

}

$(document).on('click', 'input[type=radio]', function () {

    var checkedValue = $(this).val();
    $("#datefilingfrom").val('');
    $("#datefilingto").val('');
    $("#prioritydatefrom").val('');
    $("#prioritydateto").val('');
    $("#pubdatefrom").val('');
    $("#pubdateto").val('');

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


$(document).on('click', '#expPatentexcelF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttoexcelfilePatent" pageno="' + i + '" type="excel" title="Download File">' +
            '<img src="/newassets/img/download.svg" alt="download">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';
        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#expPatentexcel', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropPatentExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelPatent">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    $("#id_exportreportdropPatentExcel").html('');
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropPatentExcel").html(html);
});

$(document).on("click", "#CommonExportExcelPatent", function () {
    var ppageindex = $("#id_exportreportdropPatentExcel").val(); //$(this).attr('pageno');
    if (ppageindex == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var filtertradmark = $('#filtertradmark').val();
    var IPList = '3'
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#PatentNo').val();
    var datefilingfrom = $('#datefilingfrom').val();
    var datefilingto = $('#datefilingto').val();
    var statusforpatent = $('#searchstatusforPatent').val();
    var applicantname = $('#txtapplicantname').val();
    var prioritydategfrom = $('#prioritydatefrom').val();
    var prioritydateto = $('#prioritydateto').val();
    var pubDategfrom = $('#pubdatefrom').val();
    var pubDategTo = $('#pubdateto').val();
    if (datefilingfrom != '' && datefilingfrom != null) {
        datefilingfrom = convertorightFormat(datefilingfrom);
    }
    if (datefilingto != '' && datefilingto != null) {
        datefilingto = convertorightFormat(datefilingto);
    }
    if (prioritydateto != '' && prioritydateto != null) {
        prioritydateto = convertorightFormat(prioritydateto);
    }
    if (prioritydategfrom != '' && prioritydategfrom != null) {
        prioritydategfrom = convertorightFormat(prioritydategfrom);
    }
    window.location = encodeURI("/IPR/ExportoExcelNewPatentSearch?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&applicationno=" + applicationno
        + "&patentno=" + patentno + "&txtdateapplicationfrom=" + datefilingfrom + "&txtdateapplicationto=" + datefilingto + "&prioritydateto=" + prioritydateto +
        "&prioritydategfrom=" + prioritydategfrom + "&searchstatus=" + statusforpatent +
        "&applicantName=" + applicantname + "&pagesize1=10" + "&pageindex=" + ppageindex);
});


$(document).on("click", "#exporttoexcelfilePatent", function () {

    var ppageindex = $(this).attr('pageno');

    var filtertradmark = $('#filtertradmark').val();
    var IPList = '3'
    var applicationno = $('#txtapplicationno').val();
    var patentno = $('#PatentNo').val();
    var datefilingfrom = $('#datefilingfrom').val();
    var datefilingto = $('#datefilingto').val();
    var statusforpatent = $('#searchstatusforPatent').val();
    var applicantname = $('#txtapplicantname').val();
    var prioritydategfrom = $('#prioritydatefrom').val();
    var prioritydateto = $('#prioritydateto').val();
    var pubDategfrom = $('#pubdatefrom').val();
    var pubDategTo = $('#pubdateto').val();

    if (datefilingfrom != '' && datefilingfrom != null) {

        datefilingfrom = convertorightFormat(datefilingfrom);
    }

    if (datefilingto != '' && datefilingto != null) {

        datefilingto = convertorightFormat(datefilingto);
    }

    if (prioritydateto != '' && prioritydateto != null) {

        prioritydateto = convertorightFormat(prioritydateto);
    }

    if (prioritydategfrom != '' && prioritydategfrom != null) {

        prioritydategfrom = convertorightFormat(prioritydategfrom);
    }

    //window.location = encodeURI("/IPR/ExportoExcelNewPatentSearch?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&applicationno=" + applicationno
    //    + "&patentno=" + patentno
    //    + "&patentno=" + patentno

    //    + "&datefilingfrom=" + datefilingfrom
    //    + "&datefilingto=" + datefilingto + "&searchstatus=" + searchstatus + "&applicantName=" + applicantName + "&pagesize1=10" + "&pageindex=" + ppageindex);

    window.location = encodeURI("/IPR/ExportoExcelNewPatentSearch?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&applicationno=" + applicationno
        + "&patentno=" + patentno + "&txtdateapplicationfrom=" + datefilingfrom + "&txtdateapplicationto=" + datefilingto + "&prioritydateto=" + prioritydateto +
        "&prioritydategfrom=" + prioritydategfrom + "&searchstatus=" + statusforpatent +
        "&applicantName=" + applicantname + "&pagesize1=10" + "&pageindex=" + ppageindex);
});

$(document).on('click', '#expPatentpdfF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttoPDFfilePatent" pageno="' + i + '" type="pdf" title="Download PDF">' +
            '<img src="/newassets/img/download.svg" alt="download PDF">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';
        html += '</tr>';
    }
    $("#printexport").html(html);
});

$(document).on('click', '#expPatentpdf', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropPatentPdf"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportPdfPatent">Confirm</button>';
    displayImage = '<img src="/newassets/img/pdf-export.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropPatentPdf").html(html);
});
$(document).on('click', '#CommonExportPdfPatent', function () {
    var IPList = '3';
    var filtertradmark = $("#filtertradmark").val();
    var datefilingfrom = $("#datefilingfrom").val();
    var datefilingto = $("#datefilingto").val();
    var status = $("#searchstatusforPatent").val();
    var applicant = $("#txtApplicant").val();
    var pagenum = $('#id_exportreportdropPatentPdf').val(); //$(this).attr('pageno');
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var prioritydatefrom = $('#prioritydatefrom').val();
    var prioritydateto = $('#prioritydateto').val();
    if (datefilingfrom != '' && datefilingfrom != null) {
        datefilingfrom = convertorightFormat(datefilingfrom);
    }
    if (datefilingto != '' && datefilingto != null) {
        datefilingto = convertorightFormat(datefilingto);
    }
    if (prioritydatefrom != '' && prioritydatefrom != null) {
        prioritydatefrom = convertorightFormat(prioritydatefrom);
    }
    if (prioritydateto != '' && prioritydateto != null) {
        prioritydateto = convertorightFormat(prioritydateto);
    }

    window.location = encodeURI("/IPR/ExportoPDFNewPatentSearch?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&txtdateapplicationfrom=" + datefilingfrom
        + "&txtdateapplicationto=" + datefilingto + "&status=" + status + "&applicant=" + applicant + "&prioritydateto=" + prioritydatefrom +
        "&prioritydategfrom=" + prioritydateto + "&pagesize1=10" + "&pagenum=" + pagenum);
});

$(document).on('click', '#exporttoPDFfilePatent', function () {

    var IPList = '3';
    var filtertradmark = $("#filtertradmark").val();
    var datefilingfrom = $("#datefilingfrom").val();
    var datefilingto = $("#datefilingto").val();
    var status = $("#searchstatusforPatent").val();
    var applicant = $("#txtApplicant").val();
    var pagenum = $(this).attr('pageno');
    var prioritydatefrom = $('#prioritydatefrom').val();
    var prioritydateto = $('#prioritydateto').val();

    if (datefilingfrom != '' && datefilingfrom != null) {

        datefilingfrom = convertorightFormat(datefilingfrom);
    }
    if (datefilingto != '' && datefilingto != null) {

        datefilingto = convertorightFormat(datefilingto);
    }

    if (prioritydatefrom != '' && prioritydatefrom != null) {

        prioritydatefrom = convertorightFormat(prioritydatefrom);
    }

    if (prioritydateto != '' && prioritydateto != null) {

        prioritydateto = convertorightFormat(prioritydateto);
    }

    window.location = encodeURI("/IPR/ExportoPDFNewPatentSearch?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&txtdateapplicationfrom=" + datefilingfrom
        + "&txtdateapplicationto=" + datefilingto + "&status=" + status + "&applicant=" + applicant + "&prioritydateto=" + prioritydatefrom +
        "&prioritydategfrom=" + prioritydateto + "&pagesize1=10" + "&pagenum=" + pagenum);
});

$(document).on('click', '#openpatentdetails', function () {
    $('#tmdetailsdownload').css("display", "none");
    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spMarkNameDetails').text("Patent Information")
    $('#spShowMarkName').text("Patent Information");

    trademarkId = $(this).attr("tradeid");
    $('#tmdetailsdownload').css("display", "none");
    loadpatentdatabyiid(trademarkId);
});

function loadpatentdatabyiid(trademarkiid) {
    var iplistValue = '3'
    var html = "";
    var imagePath = $('#imgpath').val();
    var formdata = new FormData();
    formdata.append("ip", iplistValue)
    formdata.append("tradeid", trademarkiid);
    $.ajax({
        async: true,
        url: "/api/IPRApi/loadtrademarkdatabyiid",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $('#tmdetailsmodal').attr('tradeiid', trademarkiid);
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;
            $("#bindTrademarkDetails").empty();
            $.each(obj, function (i, val) {
                var tfot = "";
                $('#modal-header').text('View Patent');
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
                    + '<li><h5>Inventory Country</h5><span>' + isNullCheck(val.vInventoryCountry) + '</span></li>'
                    + '<li><h5>Inventory Address</h5><span>' + isNullCheck(val.vInventoryAddress) + '</span></li>'
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
                //    + '<tr><td>Publication Date</td><td>:</td><td>' + ConvertPatentDate(val.dPublicationDate) + '</td></tr>'
                //    + '<tr><td>Date Of Filing Of Application</td><td>:</td><td>' + ConvertPatentDate(val.dDateOffiling) + '</td></tr>'
                //    + '<tr><td>Title Of The Invention</td><td>:</td><td>' + val.vInventionTitle + '</td></tr>'
                //    + '<tr><td>Internal Classification</td><td>:</td><td>' + val.vClassification + '</td></tr>'
                //    + '<tr><td>Priority Document No.</td><td>:</td><td>' + val.vPriorityDocumentNo + '</td></tr>'
                //    + '<tr><td>Priority Date</td><td>:</td><td>' + ConvertPatentDate(val.dPriorityDate) + '</td></tr>'
                //    + '<tr><td>Name Of Proirity Country</td><td>:</td><td>' + val.vPriorityCountryName + '</td></tr>'
                //    + '<tr><td>Patent Of Addition To Application Number Filing Date</td><td>:</td><td>' + (val.dAdditionAppNoFillingDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dAdditionAppNoFillingDate)) + '</td></tr>'
                //    + '<tr><td>Divisional To Application Number Filing Date</td><td>:</td><td>' + (val.dDivisionalAppNoFillingDate == '1900-01-01T00:00:00' ? '' : ConvertPatentDate(val.dDivisionalAppNoFillingDate)) + '</td></tr>'
                //    + '<tr><td>Name Of Applicant</td><td>:</td><td>' + val.vApplicantName + '</td></tr>'
                //    + '<tr><td>Address Of Applicant</td><td>:</td><td>' + val.vApplicantAddress + '</td></tr>'
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
                /* + '<tr><td>Image</td><td>:</td><td><img src="' + imagePath + '/Patent/' + val.vApplNo + `.jpeg` + '" width="400" height="300px" alt="Image"></td></tr>'*/

                var emailButtonHtml = '<button class="sbtbtn pull-right" id="tmdetailsmodal" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
                // Append the "Email As Excel" button HTML to the pagination footer
                tfot += emailButtonHtml;

                $("#ptfooter11").html("");
                $("#ptfooter11").html(tfot);

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

$(document).on('click', '#addpatentdetails', function () {
    trademarkId = $(this).attr("tradeid");
    //alert(trademarkId);
    addpatentdatabyiid(trademarkId);
    IPRSearchlistPatent(ppageindex);
});

function addpatentdatabyiid(trademarkId) {
    openload();
    var html = "";
    var formdata = new FormData();
    var IpListValue = '3'
    formdata.append("ip", IpListValue);
    formdata.append("tradeid", trademarkId);
    $.ajax({
        async: true,
        url: "/api/IPRApi/AddPatentData",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Data.flag == '1') {
                //alert('Your patent has been added successfully.')
                $("#ids_deleteTraderequesr").text("Patent added");
                $("#msgRUSureCon").text("Mark have been added to the tracker successfully.");
                $("#myModalAlertconfirmation").modal();
            }
            else {
                //alert('This Patent has already been added')
                $("#myModalAlertconfirmation").modal();
                $("#msgRUSureCon").text("This Patent has already been added.");
            }
            closeload();
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

//$(document).on('click', '#advpatentsearch', function () {

//    ShowAllPatentFilters();
//    bindstatusforPatent();
//    $('#advpatentsearch').css("display", "none");
//    $('#btnpatentcollapse').css("display", "block");
//})

//$(document).on('click', '#btnpatentcollapse', function () {

//    HideAllPatentFilters();
//    $('#btnpatentcollapse').css("display", "none");
//    $('#advpatentsearch').css("display", "block");
//})

function ShowAllPatentFilters() {
    $('#divHide1').show();
    $('#divHide2').show();
    $('#divHide3').show();
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
            $('#searchstatusforPatent').html('');
            /*$('#searchstatusforPatent').append('<option value="">Select Status</option>');*/
            $.each(obj1, function (i, val) {
                var data1 = val.StatusName;
                if (data1 != null) {
                    $('#searchstatusforPatent').append('<option value="' + data1 + '">' + data1 + '</option>')
                }
            });
            $('#searchstatusforPatent').multiselect('reload');
        },

        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
    });
}

function HideAllPatentFilters() {
    $('#divHide1').hide();
    $('#divHide2').hide();
    //$('#divHide3').hide();
}

$(document).on('click', '#btnpatentclear', function () {
    $('#filtertradmark').val('');
    $('#IPList').val('');
    $('#txtdatefilingfrom').val('');
    $('#txtdatefilingto').val('');
    $('#txtApplicant').val('');
    $('#searchstatusforPatent').val('');

    $('#bindIPRSearchData').empty();
    $('#ptfooter').empty();
    //$('#printexport').remove();
});

$(document).on('click', '#tmdetailsmodal', function () {
    $('#emailtxt').val("");
    $('#btnEmail').attr('tradeiid', $(this).attr('tradeiid'));
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  FUNCTIONS FOR COPYRIGHT xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//$(document).on('click', '#advcopyrightsearch', function () {
//    bindcategoryandstatusforCopyright();
//    $('#divHide1').show();
//    $('#divHide2').show();
//    $('#advcopyrightsearch').css("display", "none");
//    $('#btncopyrightcollapse').css("display", "block");
//});

//$(document).on('click', '#btncopyrightcollapse', function () {
//    $('#divHide1').hide();
//    $('#divHide2').hide();
//    $('#advcopyrightsearch').css("display", "block");
//    $('#btncopyrightcollapse').css("display", "none");

//});

$(document).on('click', '#addcopyrightdetails', function () {

    openload();
    var IPList = '2';
    var patentsearch = $('#filtertradmark').val();
    var trademarkId = $(this).attr("tradeid");

    var formData = new FormData();

    formData.append('ip', IPList);
    formData.append('tradeid', trademarkId);
    formData.append('patentsrch', patentsearch);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/AddCopyrightData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data.data);
            if (obj == '1') {
                //alert('Your Copyright has been added successfully');
                $("#ids_deleteTraderequesr").text("Copyright added");
                $("#msgRUSureCon").text("Mark have been added to the tracker successfully.");
                $("#myModalAlertconfirmation").modal();
                closeload();
            }

            else {
                //alert('This Copyright has already been added');
                $("#msgRUSureCon").text("This Copyright has already been added.");
                $("#myModalAlertconfirmation").modal();
                closeload();
            }
        },
        error: function (response) {
            alert(response.Data.data);
        },
        failure: function (response) {
            alert(response.Data.data);
        }
    });
});

$(document).on('click', '#opencopyrightdetails', function () {

    $('#tmdetailsdownload').css("display", "none");
    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spMarkNameDetails').text("Copyrights Information")
    $('#spShowMarkName').text("Copyright Information");

    trademarkId = $(this).attr("tradeid");
    $('#tmdetailsdownload').css("display", "none");
    loadcopyrightdatabyiid(trademarkId);
    $('#tmdetailsmodal').attr('tradeiid', trademarkId);
});

$(document).on('click', '#expCopyrightexcelF', function () {

    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();

    var pagesize = 10;
    var recordsection = totalRecord / pagesize;

    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';


        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttoexcelfileCopyright" pageno="' + i + '" type="excel" title="Download Excel">' +
            '<img src="/newassets/img/download.svg" alt="download Excel">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';

        html += '</tr>';

    }
    $("#printexport").html(html);
});
$(document).on('click', '#expCopyrightexcel', function () {

    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropCopyExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelCopy">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    $("#id_exportreportdropCopyExcel").html('');
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropCopyExcel").html(html);
});
$(document).on('click', '#CommonExportExcelCopy', function () {
    var pageno = $("#id_exportreportdropCopyExcel").val();//$(this).attr('pageno');
    if (pageno == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var IPList = '2'
    var filtertradmark = $('#filtertradmark').val();
    var designno = $('#desno').val();
    var applicant = $('#txtApplicant').val();
    var status = $('select#statusforcopyright option:selected').text();
    if (status == 'Select Status') {
        status = "";
    }
    var datefrom = $('#txtdatefrom').val();
    var dateto = $('#txtdateto').val();
    var vclass = $('#searchclassforDesign').val();
    var category = $('#ctgry').val();
    var roc = $('#txtroc').val();
    var diaryno = $('#txtdiaryno').val();
    //var pageno = $(this).attr('pageno');
    window.location = encodeURI('/IPR/ExportoExcelNewCopyrightSearch?IPList=' + IPList + '&filtertradmark=' + filtertradmark + '&txtApplicant=' + applicant + '&dtFrom=' + datefrom + '&dtTo=' + dateto + '&diaryno=' + diaryno + '&category=' + category + '&roc=' + roc + '&pagenum=' + pageno + '&status=' + status);

});

$(document).on("click", "#exporttoexcelfileCopyright", function () {

    var IPList = '2'
    //var filtertradmark = $("#filtertradmark").val();
    //var diaryno = $("#txtdiaryno").val();
    //var category = $("#ctgry").val();
    //var datefrom = $("#txtdatefrom").val();
    //var dateto = $("#txtdateto").val();
    //var applicant = $("#txtApplicant").val();
    //var roc = $("#txtroc").val();
    //var pageno = $(this).attr('pageno');

    var filtertradmark = $('#filtertradmark').val();
    var designno = $('#desno').val();
    var applicant = $('#txtApplicant').val();
    var status = $('select#statusforcopyright option:selected').text();
    if (status == 'Select Status') {
        status = "";
    }
    var datefrom = $('#txtdatefrom').val();
    var dateto = $('#txtdateto').val();
    var vclass = $('#searchclassforDesign').val();
    var category = $('#ctgry').val();
    var roc = $('#txtroc').val();
    var diaryno = $('#txtdiaryno').val();
    var pageno = $(this).attr('pageno');
    window.location = encodeURI('/IPR/ExportoExcelNewCopyrightSearch?IPList=' + IPList + '&filtertradmark=' + filtertradmark + '&txtApplicant=' + applicant + '&dtFrom=' + datefrom + '&dtTo=' + dateto + '&diaryno=' + diaryno + '&category=' + category + '&roc=' + roc + '&pagenum=' + pageno + '&status=' + status);

});

$(document).on('click', '#expDesignpdfF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttopdffordesign" pageno="' + i + '" type="pdf" title="Download PDF">' +
            '<img src="/newassets/img/download.svg" alt="download PDF">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';

        html += '</tr>';

    }
    $("#printexport").html(html);
})
$(document).on('click', '#expDesignpdf', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
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
    html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropDesignPdf").html(html);
})
$(document).on('click', '#CommonExportPdfDesign', function () {
    var pageNo = $("#id_exportreportdropDesignPdf").val(); //$(this).attr('pageno');
    if (pageNo == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }

    var searchtext = $('#filtertradmark').val();
    var IPList = '5';
    var designno = $('#desno').val();
    var vclass = $('#searchclassforDesign').val();
    if (vclass == null || vclass == undefined) {
        vclass = "";
    }
    var applicantDetails = $('#applidet').val();
    var status = $('#searchstatusforDesign').val();
    if (status == null || status == undefined) {
        status = "";
    }
    var dateregisterfrom = $('#txtdateregisterfrom').val();
    var dateregisterto = $('#txtdateregisterto').val();

    if (dateregisterfrom != '' && dateregisterfrom != null) {
        dateregisterfrom = convertorightFormat(dateregisterfrom);
    }
    if (dateregisterto != '' && dateregisterto != null) {
        dateregisterto = convertorightFormat(dateregisterto);
    }
    var priorityCountry = $('#pcountry').val();
    window.location = encodeURI("/IPR/ExportoPDFNewDesignSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
        + "&designnum=" + designno + "&class=" + vclass + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom
        + "&dateregisterto=" + dateregisterto
        + "&txtpriorityCountry=" + priorityCountry + "&pagenum=" + pageNo + "&pagesize=10")
});

$(document).on('click', '#exporttopdffordesign', function () {
    var pageNo = $(this).attr('pageno');
    var searchtext = $('#filtertradmark').val();
    var IPList = '5';
    var designno = $('#desno').val();
    var vclass = $('#searchclassforDesign').val();
    if (vclass == null || vclass == undefined) {
        vclass = "";
    }
    var applicantDetails = $('#applidet').val();
    var status = $('#searchstatusforDesign').val();
    if (status == null || status == undefined) {
        status = "";
    }
    var dateregisterfrom = $('#txtdateregisterfrom').val();
    var dateregisterto = $('#txtdateregisterto').val();

    if (dateregisterfrom != '' && dateregisterfrom != null) {
        dateregisterfrom = convertorightFormat(dateregisterfrom);
    }
    if (dateregisterto != '' && dateregisterto != null) {
        dateregisterto = convertorightFormat(dateregisterto);
    }

    //var title = $('#title').val();
    //var area = $('#area').val();
    var priorityCountry = $('#pcountry').val();

    window.location = encodeURI("/IPR/ExportoPDFNewDesignSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
        + "&designnum=" + designno + "&class=" + vclass + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom
        + "&dateregisterto=" + dateregisterto
        + "&txtpriorityCountry=" + priorityCountry + "&pagenum=" + pageNo + "&pagesize=10")


})

$(document).on('click', '#expCopyrightpdfF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttopdfforcopy" pageno="' + i + '" type="pdf" title="Download PDF">' +
            '<img src="/newassets/img/download.svg" alt="download PDF">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';
        html += '</tr>';
    }
    $("#printexport").html(html);
})

$(document).on('click', '#expCopyrightpdf', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropCopyPdf"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportPdfCopy">Confirm</button>';
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
    $("#id_exportreportdropCopyPdf").html(html);
});
$(document).on("click", "#CommonExportPdfCopy", function () {
    var pagenum = $("#id_exportreportdropCopyPdf").val(); //$(this).attr('pageno');
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    var IPList = '2';
    var searchtext = $('#filtertradmark').val();
    var designno = $('#desno').val();
    var applicantDetails = $('#txtApplicant').val();
    var status = $('select#statusforcopyright option:selected').text(); //$('#statusforcopyright').val();
    if (status == 'Select Status') {
        status = "";
    }
    var dateregisterfrom = $('#txtdatefrom').val();
    var dateregisterto = $('#txtdateto').val();
    var vclass = $('#searchclassforDesign').val();
    var CategoryName = $('#ctgry').val();
    var RoCNo = $('#txtroc').val();
    var dairyNo = $('#txtdiaryno').val();
    window.location = encodeURI("/IPR/ExportoPDFCopyrightSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
        + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom + "&txtdateregisterto=" + dateregisterto + "&class=" + vclass +
        "&CategoryName=" + CategoryName + "&RoCNo=" + RoCNo + "&dairyNo=" + dairyNo + "&pagesize=10&pagenum=" + pagenum);

});

$(document).on('click', '#exporttopdfforcopy', function () {
    var IPList = '2';
    var searchtext = $('#filtertradmark').val();
    var designno = $('#desno').val();
    var applicantDetails = $('#txtApplicant').val();
    //var status = $('#statusforcopyright').val();
    var status = $('select#statusforcopyright option:selected').text(); //$('#statusforcopyright').val();
    if (status == 'Select Status') {
        status = "";
    }

    var dateregisterfrom = $('#txtdatefrom').val();
    var dateregisterto = $('#txtdateto').val();
    var vclass = $('#searchclassforDesign').val();

    var CategoryName = $('#ctgry').val();
    var RoCNo = $('#txtroc').val();
    var dairyNo = $('#txtdiaryno').val();
    var pagenum = $(this).attr('pageno');

    window.location = encodeURI("/IPR/ExportoPDFCopyrightSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
        + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom + "&txtdateregisterto=" + dateregisterto + "&class=" + vclass +
        "&CategoryName=" + CategoryName + "&RoCNo=" + RoCNo + "&dairyNo=" + dairyNo + "&pagesize=10&pagenum=" + pagenum);

    //var searchtext = $('#filtertradmark').val();
    //var IPList = '2';
    //var designno = $('#desno').val();
    //var vclass = $('#searchclassforDesign').val();
    //var applicantDetails = $('#applidet').val();
    //var status = $('#searchstatusforDesign').val();
    //var dateregisterfrom = $('#txtdateregisterfrom').val();
    //var dateregisterto = $('#txtdateregisterto').val();
    //var pagenum = $(this).attr('pageno');

    //window.location = encodeURI("/IPR/ExportoPDFCopyrightSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
    //    + "&designnum=" + designno + "&class=" + vclass + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom + "&txtdateregisterto=" + dateregisterto + "&txttitle=" + title + "&txtarea=" + area
    //    + "&txtpriorityCountry=" + priorityCountry + "&pagesize=10&pagenum=" + pagenum);
})

function loadcopyrightdatabyiid(trademarkiid) {
    var iplistValue = '2'
    var html = "";
    var formdata = new FormData();
    formdata.append("ip", iplistValue)
    formdata.append("tradeid", trademarkiid);
    localStorage.setItem('tradeiid', trademarkiid)
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

                $('#modal-header').text('View Copyright Details');

                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>Diary Number</h5><span>' + val.vDiaryNo + '</span></li>'
                    + '<li><h5>Date</h5><span>' + convertdateCopyright(val.dApplDate) + '</span></li>'
                    + '<li><h5>Title Of Work</h5><span>' + val.vTitleofWork + '</span></li>'
                    + '<li><h5>Category</h5><span>' + (val.vCategory == null ? '' : val.vCategory) + '</span></li>'
                    + '<li><h5>Applicant</h5><span>' + val.vApplicantName + '</span></li>'
                    + '</ul></div>';

                /*+ '<tr><td>No. of Pages</td><td>:</td><td>' + isNullCheck(val.NoofPages) + '</td></tr>'*/
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

$(document).on('click', '#btncopyrightclear', function () {

    $('#filtertradmark').val('');
    $('#txtdiaryno').val('');
    $('#txtdatefrom').val('');
    $('#txtdateto').val('');
    $('#txtApplicant').val('');
    $('#txtroc').val('');
    $('#bindIPRSearchData').empty();
    $('#ctgry').val('');
    $("#statusforcopyright").val('');
    //$("#statusforcopyright").val($("#selectBox option:first").val());

    //var resetClassVal = document.getElementsByClassName('selected');

    //var ptfooter = document.querySelector('div[id="ptfooter"] > ul');
    //if (ptfooter != null) {
    //    ptfooter.remove();
    //}

    isSearchRnd = false;
    $('#tSPagination').hide();
    //$("#dynamiciprheader").text("");
    $("#dynamiciprheaderCount").text("");
    $("#pdatastatus").show();
    $('div.chk button').html('Select options');
    $('div.chk1 button').html('Select options');

    var checkboxes = $('input[type="checkbox"]');
    checkboxes.prop('checked', false);
});

function IPRSearchlistCopyright(pageindex) {

    var htmls;
    var category = $('#ctgry').val();
    var formData = new FormData();
    var filtertrademark = $('#filtertradmark').val().trim();
    var IPListValue = '2'
    var vStatus = $('select#statusforcopyright option:selected').text(); //$('#statusforcopyright').val();
    if (vStatus == 'Select Status') {
        vStatus = "";
    }
    var txtdatefrom = $('#txtdatefrom').val();
    var txtdateto = $('#txtdateto').val();
    var txtdiaryno = $('#txtdiaryno').val().trim();
    var applicantname = $('#txtApplicant').val().trim();
    var RocNo = $('#txtroc').val().trim();

    if (category == null || category == "null") {
        category = "";
    }

    if (filtertrademark == '' && txtdiaryno == "") {
        alert(`Please fill either "SEARCH" or "DIARY NO." textbox!`);
        closeload();
        return false;
    }

    if (IPListValue == null || IPListValue == "") {
        alert("You are using an inappropriate way to access IPR! Contact TeamMyKase for further assistance.");
        return false;
    }
    openload();
    var formData = new FormData();

    formData.append("filtertradmark", filtertrademark);
    formData.append("IPList", IPListValue);
    formData.append("dtFrom", txtdatefrom);
    formData.append("dtTo", txtdateto);
    formData.append("statusforcopyright", vStatus);
    formData.append("diaryno", txtdiaryno);
    formData.append("pagesize", pagesize);
    formData.append("pagenum", pageindex);
    formData.append("ctgry", category);
    formData.append("applicant", applicantname);
    formData.append("roc", RocNo);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/CopyrightSearchList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response1) {
            if (response1.Data.data.length > 0) {
                $("#exportrecords").val(0);
                //ShowAllSorting();
                /*   IPCounterforPatent();*/
                var obj = JSON.parse(response1.Data.data);
                localStorage.setItem('apidata', JSON.stringify(response1.Data.data));
                var length = obj.data.length;
                var obj1 = obj.data;
                var MyObj1 = 0;

                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#pdatastatus").hide();
                    $("#dtNotFound").text("");
                    $.each(obj1, function (i, val) {
                        //var formData = new FormData();
                        //formData.append('trademarkId', val.iid);

                        //$.ajax({
                        //    async: false,
                        //    data: formData,
                        //    type: 'POST',
                        //    dataType: 'JSON',
                        //    url: '/api/IPRApi/TradeidFromAddedIPR',
                        //    contentType: false,
                        //    processData: false,
                        //    success: function (response) {

                        //        var obj = JSON.parse(response.Data.data);
                        //        MyObj1 = obj;
                        //    },
                        //    failure: function (response) {
                        //        alert(response.responseText);
                        //    },
                        //    error: function (response) {
                        //        alert(response.responseText);
                        //    }
                        //});
                        //var flag = 0;
                        //for (let k = 0; MyObj1.length > k; k++) {
                        //    if (MyObj1[k].Tradeiid == val.iid) {
                        //        flag = 1;
                        //        break;
                        //    }
                        //    else {
                        //        continue;
                        //    }
                        //}
                        //if (i === 0) {
                        //    firstvalue = val.RowId;
                        //}
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
                        //    tfot += `<li style="margin-left:5px; display:none;"><input type="text" class="form-control selctInputFormat" style="background:#ebebeb !important;" placeholder="Search" id="searchdata" style="height:24px !important;border-bottom: 1px solid #ddd !important;" /><button type="button" style="margin: 0;position: relative;top: -36px;float: right;background: none;border: none;" class="sbtbtn" id="searchdatasforcopyright"><i class="glyphicon glyphicon-search"></i></button></li>`
                        //    if (val.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span> <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span> <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        $('#tSPagination').show();
                        var totdata = val.TotalRecord;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            $("#exportrecords").val(totdata);
                            var trademarkSearchResult = "Copyright Search(" + totdata + ")";
                            $("#dynamiciprheaderCount").text(trademarkSearchResult);
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#tsNext').hide();
                                $('#tsPrev').css("display", "block");
                            }
                            else {
                                $('#tsNext').css("display", "block");
                            }
                            if (pageindex == 1) {
                                $('#tsPrev').css("display", "none");
                            }
                            else {
                                $('#tsPrev').css("display", "block");
                            }

                            if (isSearchRnd == false) {
                                setTotalRecord = totpage;
                                SearchRenderPagination(pageindex, totpage);
                            }
                        }

                        qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;

                        var ROCNumber = (val.vROCNumber == null ? '' : val.vROCNumber);
                        var CategoryName = (val.vCategory == null ? '' : val.vCategory);

                        flag = 0;
                        if (flag == 1) {
                            htmls += '<tr>' +
                                '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vTitleofWork + '</span></td>' +
                                //'<td style="text-align: center; display:none;" >' + val.RowId + '</td>' +
                                '<td style="text-align: center;">' + val.vDiaryNo + '</td>' +
                                '<td>' + ROCNumber + '</td>' +

                                '<td>' + isNullCheck(val.StatusName) + '</td>' +
                                '<td>' + CategoryName + '</td>' +
                                '<td>' + convertdate(val.dDateOffiling) + '</td>' +
                                '<td>' + val.vApplicantName + '</td>' +
                                '<td>' +
                                '<ul class="table_action">' +
                                '<li>' +
                                '<span class="taskoutboxbtnicon" id="opencopyrightdetails" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + EncodeText(val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata">' +
                                '<img src="/newassets/img/eye.svg" alt="edit">' +
                                '</span>' +
                                '</li>' +
                                '<li>' +
                                '<span class="taskoutboxbtnicon" id="viewaddedcopyright" style="cursor:pointer;" title="Your trademark has already been added!" tradeid="' + EncodeText(val.iid) + '">' +
                                '<img src="/newassets/img/plus-circle.png" alt="check-circle">' +
                                '</span>' +
                                '</li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                        }

                        else {
                            htmls += '<tr>' +
                                '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vTitleofWork + '</span></td>' +
                                //'<td style="text-align: left; display:none;">' + val.RowId + '</td>' +
                                '<td style="text-align: left;">' + val.vDiaryNo + '</td>' +
                                '<td>' + ROCNumber + '</td>' +

                                '<td>' + isNullCheck(val.StatusName) + '</td>' +
                                '<td>' + CategoryName + '</td>' +
                                '<td>' + convertdate(val.dDateOffiling) + '</td>' +
                                '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vApplicantName + '</span></td>' +
                                '<td>' +
                                '<ul class="table_action">' +
                                '<li>' +
                                '<span class="taskoutboxbtnicon" id="opencopyrightdetails" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + EncodeText(val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata">' +
                                '<img src="/newassets/img/eye.svg" alt="edit">' +
                                '</span>' +
                                '</li>' +
                                '<li>' +
                                '<span class="taskoutboxbtnicon" id="addcopyrightdetails" style="cursor:pointer;" title="Add Copyright Information" tradeid="' + EncodeText(val.iid) + '">' +
                                '<img src="/newassets/img/plus-circle.png" alt="plus-circle">' +
                                '</span>' +
                                '</li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                        }

                    });
                } else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                    $('#tSPagination').hide();
                    $("#dynamiciprheaderCount").text("");
                    $("#pdatastatus").show();
                }
            }
            else {
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                //htmls += '<tr>'
                $('#tSPagination').hide();
                $("#dynamiciprheaderCount").text("");
                $("#pdatastatus").show();
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

function emptyUnusedFiltersForCopyright() {
    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#divHide3').empty();
    $('#dynaction').empty();
    $('#apphide').empty();
    $('#jurisdiction').empty();
    $('#idClass').empty();
}

function fillDivForCopyright() {

    var content1 = `
  
        <div class="form-group">
            <label class="formLabel colorDark">
                <span class="control-label">Diary No.</span>
            </label>
            <input type="text" id="txtdiaryno" name="txtdiaryno" class="form-control inputFormat" autocomplete="new-text" placeholder="Diary No" onkeydown="fn_search(event)"/>
        </div>`;
    $('#apphide').append(content1);

    var content2 = `
    
        <div class="form-group" id="multicate">
            <label class="formLabel colorDark">
                <span class="control-label">Category</span>
            </label>
            <select class="form-control selctInputFormat valid" name="languageSelect[]" id="ctgry">
                <option value="">Select</option>
                <option value="Cinematograph">Cinematograph</option>
                <option value="Artistic">Artistic</option>
                <option value="Computer">Computer</option>
                <option value="Dramatic">Dramatic</option>
                <option value="Literary">Literary</option>
                <option value="Musical">Musical</option>
                <option value="Software">Software</option>
                <option value="Sound">Sound</option>
            </select>
        </div>`;
    $('#jurisdiction').append(content2);

    var content6 = `
   
        <div class="form-group">
            <label class="formLabel colorDark">
                <span class="control-label">ROC No.</span>
            </label>
            <input type="text" placeholder="Enter ROC No." id="txtroc" name="txtroc" class="form-control inputFormat" autocomplete="new-text"/>
        </div>`;
    $('#idClass').append(content6);

    var content3 = `
    <div class="col-md-3 mt-10">
        <div class="form-group">
            <label class="formLabel colorDark">
                <span class="control-label">Date - From</span>
            </label>
            <input class="form-control inputFormat" type="date" id="txtdatefrom" onkeypress="return false;"/>
        </div>
    </div>`;

    var content4 = `
    <div class="col-md-3 mt-10">
        <div class="form-group">
            <label class="formLabel colorDark">
                <span class="control-label">Date - To</span>
            </label>
            <input class="form-control inputFormat" type="date" id="txtdateto" onkeypress="return false;"/>
        </div>
    </div>`;

    var content5 = `
    <div class="col-md-3 mt-10">
        <div class="form-group" id="multistat">
            <div class="chk1">
                <label class="formLabel colorDark">
                    <span class="control-label">Status</span>
                </label>
                <select class="form-control selctInputFormat valid" name="languageSelect[]" id="statusforcopyright"></select>
            </div>
        </div>
    </div>`;

    var content7 = `
    <div class="col-md-3 mt-10">
        <div class="form-group">
            <label class="formLabel colorDark">
                <span class="control-label">Applicant</span>
            </label>
            <input type="text" placeholder="Applicant Details" id="txtApplicant" name="txtApplicant" class="form-control inputFormat" autocomplete="new-text"/>
        </div>
    </div>`;

    var content8 = `
    <div class="col-md-3 mt-10">
        <div class="form-group replect_wrapper" style="justify-content:end;">
            <button type="submit" id="btnsearch" class="btn btn-primary pull-left" value="SEARCH">Search</button>
            <button type="submit" id="btncopyrightclear" class="btn btn-secondary pull-left" value="CLEAR">Reset</button>
        </div>
    </div>`;

    $('#divHide1').append(content5, content3, content4, content7, content8);


    //$('#divHide2').append(content8);

    //var content8 = `<div class="col-md-8"><div class="form-group col-md-12" style = "margin-top: 34px;"><div class="col-md-2"><button type="submit" id="btnsearch" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btncopyrightclear" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-5" style="display:none" id="btncopyrightcollapse"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-5"><button type="submit" id="advcopyrightsearch" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div></div></div>`;


    //$('#divHide3').append(content8); //content7, content8, content9, content10, content11

    var content9 = `<li><a href="javascript:void()" id="expCopyrightexcel" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="expCopyrightpdf" title="Export to PDF">Export to PDF</a></li>`;

    $('#dynaction').append(content9);

    $('#th1').text('Diary No');
    $('#th2').text('Roc No');
    $('#th3').text('Title Of The Work');
    $('#th4').text('Status');
    $('#th5').text('Category');
    $('#th6').text('Date');
    $('#th7').text('Applicant Name');
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
            //$('#ctgry').html('');
            $('#statusforcopyright').html('');
            $('#statusforcopyright').append('<option value="">Select Status</option>')
            $.each(obj1, function (i, val) {

                //var data = val.vCategoryName;
                //$('#ctgry').append('<option value=' + data + '>' + data + '</option>');
                var data1 = val.vStatusName;
                if (data1 != null) {
                    $('#statusforcopyright').append('<option value=' + data1 + '>' + data1 + '</option>')
                }
            });
            //$("#ctgry").multiselect('reload');
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
    //$("#ctgry").multiselect({

    //    columns: 1,
    //    placeholder: 'Select Category',
    //    selectAll: false

    //});

    //$('#statusforcopyright').multiselect({

    //    columns: 1,
    //    placeholder: 'Select Status',
    //    selectAll: false

    //});
}

$(document).on('click', '#btnclearforGI', function () {

    ClearAllFieldsForGI();
})

function ClearAllFieldsForGI() {
    $('#filtertradmark').val('');
    $('#txtapplino').val('');
    $('#drpstatusforgi').val('');
    $("#drpstatusforgi").multiselect('reload');
    $('#searchclass').val('');
    $("#searchclass").multiselect('reload');
    $('#txtjournalno').val('');
    $('#filingdatefrom').val('');
    $('#filingdateto').val('');
    $('#registdate').val('');
    $('#bindIPRSearchData').empty();
    $("#tSPagination").hide();
    //$("#dynamiciprheader").text("");
    $("#dynamiciprheaderCount").text("");
    //$('#printexport').remove();
    $("#pdatastatus").show();
    $("#tradePagination").hide();
    $("#dtNotFound").html("Data not found");
}


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for GI xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function emptyUnusedFiltersForGI() {
    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#divHide3').empty();
    $('#headeronly').empty();
    $('#dynaction').empty();
    $('#th1').empty();
    $('#th2').empty();
    $('#th3').empty();
    $('#th4').empty();
    $('#th5').empty();
    $('#th6').empty();
    $('#th7').empty();
    $('#th8').empty();
    $('#apphide').empty();
    $('#hideHeader1').remove();
    $('#jurisdiction').empty();
    $('#idClass').empty();
}

function fillDivForGI() {
    var content1 = `<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Application Number</span></label><input type="text" id="txtapplino" placeholder="Application Number" name="txtapplino" class="form-control inputFormat" onkeydown="fn_search(event)" autocomplete="new-text"  oninput="validateNumericInput(event)"/></div>`;

    $('#apphide').append(content1);
    var content4 = `<div id="applicant"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Journal No.</span></label><input type="text" id="txtjournalno" name="txtjournalno" placeholder="Enter Journal No." class="form-control inputFormat" autocomplete="new-text"/></div></div>`;
    $('#jurisdiction').append(content4);
    var content3 = `<div><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Class</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchclass" multiple="multiple"></select></div></div>`;
    $('#idClass').append(content3);
    var content2 = `<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Status</span></label><select class="form-control InputFormat" name="languageSelect[]" id="drpstatusforgi" multiple="multiple"></select></div></div>`;

    var content5 = `<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date - From</span></label><input class="inputFormat" type="date" id="filingdatefrom" onkeypress="return false;"/></div></div>`;

    var content6 = `<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date - To</span></label><input class="inputFormat" type="date" id="filingdateto" onkeypress="return false;"/></div></div>`;
    var content7 = `<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Registration Valid Upto</span></label><input class="inputFormat" type="date" id="registdate" onkeypress="return false;"/></div></div>`
    var content18 = `<div class="col-md-12" style="margin-top:15px;"><button type="submit" id="btnclearforGI" class="btn btn-secondary pull-right" style="margin-left:8px;" value="CLEAR">Reset</button><button type="submit" id="btnsearchforGI" style=" padding: 7px 40px;" class="btn btn-primary pull-right" value="SEARCH">Search</button></div>`;

    $('#divHide1').append(content2, /*content3, content4,*/ content5, content6, content7, content18);


    //$('#divHide2').append(content7, content8);

    var content8 = `<li><a href="javascript:void()" id="expGItexcel" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="expGIpdf" title="Export to PDF">Export to PDF</a></li>`;

    $('#dynaction').append(content8);

    //var content8 = `<div class="col-md-8"><div class="form-group col-md-12" style="margin-top:34px"><div class="col-md-2"><button type="submit" id="btnsearchforGI" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnclearforGI" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-5" style="display:none" id="btncollapse"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-5"><button type="submit" id="advsearch" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div></div></div>`;
    //$('#divHide3').append(content8);

    var content9 = `Name Of GI<button type="button" id="giname" class="btn-style" value="giname" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;
    var content10 = `Applicant<button type="button" id="appname" class="btn-style" value="appname" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;
    var content11 = `Status<button type="button" id="status" class="btn-style" value="status" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;
    var content12 = `Class<button type="button" id="vclass"  class="btn-style" value="vclass"  onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;
    var content13 = `Date Of Filing<button type="button" id="filingdate" class="btn-style" value="filingdate" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;
    var content14 = `Valid Upto<button type="button" id="validupto" class="btn-style" value="validupto" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;
    var content15 = `Application No<button type="button" id="vApplNo" class="btn-style" value="vApplNo" onclick='fnSort("0",$(this).val())' hidden><span class="glyphicon glyphicon-sort-by-attributes" title=""></span>`;

    //$('#th1').append(content9);
    //$('#th2').append(content10);
    //$('#th3').append(content11);
    //$('#th4').append(content12);
    //$('#th5').append(content13);
    //$('#th6').append(content14);
    //$('#th7').append(content15);
    //$('#th8').append('<div class="thbg" style="display:flex; justify-content:center;">Action</div>');

    $('#th1').append(content10);
    $('#th2').append(content11);
    $('#th3').append(content9);
    $('#th4').append(content12);
    $('#th5').append(content13);
    $('#th6').append(content14);
    $('#th7').append(content15);
    $('#th8').append('<div class="thbg" style="display:flex; justify-content:center;">Action</div>');

    // Adjust width of patent table
    //$('#th1header').css('width', '140px');
    //$('#th2header').css('width', '150px');
    //$('#th3header').css('width', '20px');
    //$('#th4').css('width', '20px');

    $('#th1header').css('width', '200px');
    $('#th2header').css('width', '100px');
    $('#th3header').css('width', '120px');
    $('#th4').css('width', '60px');
    $('#th5header').css('width', '110px');
    $('#hideHeader1').css('width', '110px');
    $('#hideHeader2').css('width', '70px');

}

$(document).on('click', '#btnsearchforGI', function () {
    isSearchRnd = false;
    IPRSearchlistGI(pageindex);
});

function IPRSearchlistGI(pageindex) {
    var htmls;
    var formData = new FormData();
    var IPListValue = '4';
    var filtertrademark = $('#filtertradmark').val();
    var applicationno = $('#txtapplino').val();
    var status = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalNo = $('#txtjournalno').val();
    var filingdatefrom = $('#filingdatefrom').val();
    var filingdateto = $('#filingdateto').val();
    var registdate = $('#registdate').val();

    if (filtertrademark == '' && applicationno == "") {
        alert('Please fill either "SEARCH" or "APPLICATION NO." textbox!');
        closeload();
        return false;
    }

    if (IPListValue == null || IPListValue == "") {
        alert("Please select the value from the dropdown!");
        return false;
    }

    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }

    if (registdate != '' && registdate != null) {
        registdate = convertorightFormat(registdate);
    }

    openload();
    var formData = new FormData();

    formData.append("filtertradmark", filtertrademark);
    formData.append("applicationno", applicationno);
    formData.append("status", status);
    formData.append("vclass", vclass);
    formData.append("journalno", journalNo);
    formData.append("doffrom", filingdatefrom);
    formData.append("dofto", filingdateto);
    formData.append("registdate", registdate);
    formData.append("IPList", IPListValue);
    formData.append("colname", '');
    formData.append("sort", 0);
    formData.append("pagesize", '10');
    formData.append("pagenum", pageindex);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/GISearchList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response1) {
            if (response1.Data.data.length > 0) {
                $("#exportrecords").val(0);
                //ShowAllSorting();
                /*IPCounterforPatent();*/
                var obj = JSON.parse(response1.Data.data);
                localStorage.setItem('apidata', JSON.stringify(response1.Data.data));
                var length = obj.data.length;
                var obj1 = obj.data;
                var MyObj1 = 0;

                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#pdatastatus").hide();
                    $.each(obj1, function (i, val) {

                        //if (i === 0) {
                        //    firstvalue = val.RowId;
                        //}
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

                        //    tfot += `<li style="margin-left:5px;display:none;"><input type="text" class="form-control selctInputFormat" style="background:#ebebeb !important;" placeholder="Search" id="searchdata" style="height:24px !important;border-bottom: 1px solid #ddd !important;" /><button type="button" style="margin: 0;position: relative;top: -36px;float: right;background: none;border: none;" class="sbtbtn" id="searchdatasforGI"><i class="glyphicon glyphicon-search"></i></button></li>`

                        //    tfot += `<li style="display:none;"><button class="gobtn" type="button" id="clear">x</button></li>`

                        //    if (val.TotalRecord <= length) {

                        //    }
                        //    else if (pageno == 1) {

                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                        //    }

                        //    else {
                        //        tfot += '<li><span><a id="paginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //}
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        if (i === (length - 1)) {
                            $('#tSPagination').show();
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                $("#exportrecords").val(totdata);
                                var trademarkSearchResult = "GI Search(" + totdata + ")";
                                $("#dynamiciprheaderCount").text(trademarkSearchResult);
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#tsNext').hide();
                                    $('#tsPrev').css("display", "block");
                                }
                                else {
                                    $('#tsNext').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#tsPrev').css("display", "none");
                                }
                                else {
                                    $('#tsPrev').css("display", "block");
                                }

                                if (isSearchRnd == false) {
                                    setTotalRecord = totpage;
                                    SearchRenderPagination(pageindex, totpage);
                                }
                            }
                        }

                        qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;

                        htmls += '<tr>' +
                            // '<td style="text-align: left; display:none;">' + val.RowId + '</td>' +
                            '<td style="text-align: left;"><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vGeoIndication + '</span></td>' +
                            '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vApplicantName + '</span></td>' +
                            '<td>' + isNullCheck(val.vStatus) + '</td>' +
                            '<td>' + val.vClass + '</td>' +
                            '<td>' + convertdate(val.dDateoffiling) + '</td>' +
                            '<td>' + val.vApplicationNo + '</td>' +
                            '<td>' +
                            '<ul class="table_action">' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="openGIdetails" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + EncodeText(val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata">' +
                            '<img src="/newassets/img/eye.svg" alt="edit">' +
                            '</span>' +
                            '</li>' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="addGIdetails" style="cursor:pointer;" title="Add GI Information" tradeid="' + EncodeText(val.iid) + '">' +
                            '<img src="/newassets/img/plus-circle.png" alt="plus-circle">' +
                            '</span>' +
                            '</li>' +
                            '</ul>' +
                            '</td>' +
                            '</tr>';


                    });

                } else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                    $('#tSPagination').hide();
                    $("#dynamiciprheaderCount").text("");
                    $("#pdatastatus").show();
                }
            }
            else {
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                //htmls += '<tr>'
                $('#tSPagination').hide();
                $("#dynamiciprheaderCount").text("");
                $("#pdatastatus").show();
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

$(document).on('click', '#expGItexcelF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttoexcelforGI" pageno="' + i + '" type="excel" title="Download Excel">' +
            '<img src="/newassets/img/download.svg" alt="download Excel">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';
        html += '</tr>';
    }
    $("#printexport").html(html);
})

$(document).on('click', '#expGItexcel', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropGIExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelGI">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    $("#id_exportreportdropGIExcel").html('');
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropGIExcel").html(html);
});
$(document).on('click', '#CommonExportExcelGI', function () {
    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applino = $('#txtapplino').val();
    var status = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalno = $('#txtjournalno').val();
    var filingdatefrom = $('#filingdatefrom').val();
    var filingdateto = $('#filingdateto').val();
    var registeredDate = $('#registdate').val();
    var pageno = $("#id_exportreportdropGIExcel").val(); //$(this).attr('pageno');
    if (pageno == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'warning',
            delay: 3000
        });
        return false;
    }
    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }
    if (registeredDate != '' && registeredDate != null) {
        registeredDate = convertorightFormat(registeredDate);
    }
    window.location = encodeURI("/IPR/ExportoExcelNewGISearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&applino=" + applino
        + "&journal=" + journalno + "&class=" + vclass + "&status=" + status + "&filingdatefrom=" + filingdatefrom
        + "&filingdateto=" + filingdateto + "&registeredDate=" + registeredDate + "&pagesize=10" + "&pagenum=" + pageno)
});


$(document).on('click', '#exporttoexcelforGI', function () {

    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applino = $('#txtapplino').val();
    var status = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalno = $('#txtjournalno').val();
    var filingdatefrom = $('#filingdatefrom').val();
    var filingdateto = $('#filingdateto').val();
    var registeredDate = $('#registdate').val();
    var pageno = $(this).attr('pageno');

    if (filingdatefrom != '' && filingdatefrom != null) {

        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {

        filingdateto = convertorightFormat(filingdateto);
    }

    if (registeredDate != '' && registeredDate != null) {

        registeredDate = convertorightFormat(registeredDate);
    }

    window.location = encodeURI("/IPR/ExportoExcelNewGISearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&applino=" + applino
        + "&journal=" + journalno + "&class=" + vclass + "&status=" + status + "&filingdatefrom=" + filingdatefrom
        + "&filingdateto=" + filingdateto + "&registeredDate=" + registeredDate + "&pagesize=10" + "&pagenum=" + pageno)
})

$(document).on('click', '#expGIpdfold', function () {

    $("#myModalexport").modal({ show: true });

    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';


        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;color:#069;" id="exporttopdfforGI" pageno="' + i + '" type="pdf" title="Download PDF">' +
            '<img src="/newassets/img/download.svg" alt="download PDF">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';

        html += '</tr>';

    }
    $("#printexport").html(html);
})
$(document).on('click', '#expGIpdf', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    var totalRecord = $("#exportrecords").val();
    var pagesize = 200;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropGIPdf"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportGITrade">Confirm</button>';
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
    $("#id_exportreportdropGIPdf").html(html);

})
$(document).on('click', '#CommonExportGITrade', function () {
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
    var applino = $('#txtapplino').val();
    var status = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalno = $('#txtjournalno').val();
    var filingdatefrom = $('#filingdatefrom').val();
    var filingdateto = $('#filingdateto').val();
    var registeredDate = $('#registdate').val();
    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }
    if (registeredDate != '' && registeredDate != null) {
        registeredDate = convertorightFormat(registeredDate);
    }

    window.location = encodeURI("/IPR/ExporttoPdfNewGISearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&applino=" + applino
        + "&journal=" + journalno + "&vclass=" + vclass + "&status=" + status + "&filingdatefrom=" + filingdatefrom
        + "&filingdateto=" + filingdateto + "&registeredDate=" + registeredDate + "&pagesize=10" + "&pagenum=" + pagenum)
});

$(document).on('click', '#exporttopdfforGI', function () {

    var searchtext = $('#filtertradmark').val();
    var IPList = '4';
    var applino = $('#txtapplino').val();
    var status = $('#drpstatusforgi').val();
    var vclass = $('#searchclass').val();
    var journalno = $('#txtjournalno').val();
    var filingdatefrom = $('#filingdatefrom').val();
    var filingdateto = $('#filingdateto').val();
    var registeredDate = $('#registdate').val();

    if (filingdatefrom != '' && filingdatefrom != null) {
        filingdatefrom = convertorightFormat(filingdatefrom);
    }
    if (filingdateto != '' && filingdateto != null) {
        filingdateto = convertorightFormat(filingdateto);
    }

    if (registeredDate != '' && registeredDate != null) {
        registeredDate = convertorightFormat(registeredDate);
    }

    var pagenum = $(this).attr('pageno');

    window.location = encodeURI("/IPR/ExporttoPdfNewGISearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&applino=" + applino
        + "&journal=" + journalno + "&vclass=" + vclass + "&status=" + status + "&filingdatefrom=" + filingdatefrom
        + "&filingdateto=" + filingdateto + "&registeredDate=" + registeredDate + "&pagesize=10" + "&pagenum=" + pagenum)
})

$(document).on('click', '#addGIdetails', function () {
    var tradeiid = $(this).attr('tradeid');
    var formData = new FormData();
    formData.append('tradeid', tradeiid);
    formData.append('ip', '4');

    $.ajax({
        async: true,
        url: "/api/IPRApi/AddGIData",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {

            var data = JSON.parse(response.Data.data)
            if (data == "1") {
                // alert('Your GI has been added successfully.');
                $("#ids_deleteTraderequesr").text("GI added");
                $("#msgRUSureCon").text("Mark have been added to the tracker successfully.");
                $("#myModalAlertconfirmation").modal();
            }
            else {
                //alert('This GI has already been added');
                $("#myModalAlertconfirmation").modal();
                $("#msgRUSureCon").text("This GI has already been added.");
            }
        },

        failure: function (response) {
            alert(data.responseText);
        },
        error: function (response) {
            alert(data.responseText);
        }

    });

});

$(document).on('click', '#openGIdetails', function () {
    $('#tmdetailsdownload').css("display", "none");
    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spShowMarkName').text("GI Information")
    $('#spMarkNameDetails').text("Geographical Indication Information");

    $('#tmdetailsdownload').css("display", "none");
    trademarkId = $(this).attr("tradeid");
    $('#tmdetailsmodal').attr('tradeiid', trademarkId);
    loadGIdatabyiid(trademarkId);
});

function loadGIdatabyiid(trademarkiid) {
    var iplistValue = '4'
    var html = "";
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
                //alert(val.vJournalNo);

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
            $.each(obj1, function (i, val) {
                var data1 = val.vStatus;
                if (data1 != null && data1 != "") {
                    $('#drpstatusforgi').append('<option value="' + data1 + '">' + data1 + '</option>')
                }
            });
            $('#drpstatusforgi').multiselect('reload');
        },

        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
    });
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Functions for Design Search Page xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function hideAllFiltersForDesign() {
    $('#divHide1').css('display', 'none');
    $('#divHide2').css('display', 'none');
    $('#desno').val("");
    $('#searchclassforDesign').val('');
    $('#applidet').val('');
    $('#searchstatusforDesign').val('');
    $('#txtdateregisterfrom').val('');
    $('#title').val('');
    /*$('#area').val('');*/
    $('#pcountry').val('');
    $('#hish').css('display', 'none');

}

//$(document).on('click', '#advsearchforDesign', function () {
//    GetClassListForDesign();
//    ShowAllFiltersforDesign();
//    $('#advsearchforDesign').css("display", "none");
//    $('#btncollapseforDesign').css("display", "block");

//});

//$(document).on('click', '#btncollapseforDesign', function () {

//    hideAllFiltersForDesign();
//    $('#btncollapseforDesign').css("display", "none");
//    $('#advsearchforDesign').css("display", "block");

//})

//function ShowAllFiltersforDesign() {
//    $('#divHide1').css("display", "block");
//    $('#divHide2').css("display", "block");
//    $('#hish').css("display", "block");
//}

function emptyUnusedFiltersForDesign() {
    $('#divHide1').empty();
    $('#divHide2').empty();
    $('#divHide3').empty();
    $('#headeronly').empty();
    $('#dynaction').empty();
    $('#th1').empty();
    $('#th2').empty();
    $('#th3').empty();
    $('#th4').empty();
    $('#th5').empty();
    $('#th6').empty();
    $('#th7').empty();
    $('#apphide').empty();
    $('#jurisdiction').empty();
    $('#idClass').empty();
}

function fillDivForDesign() {
    var content1 = `<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Design Number</span></label><input type="text" id="desno" placeholder="Design Number" class="inputFormat" onkeydown="fn_search(event)"></div>`;
    $('#apphide').append(content1)
    //var content2 = '<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Class</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchclassforDesign" multiple></select></div></div>';
    var content2 = '<div><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Class</span></label><select class="form-control InputFormat" name="languageSelect[]" id="searchclassforDesign" ></select></div></div>';
    $('#jurisdiction').append(content2);
    var content3 = '<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Applicant Details</span></label><input type="text" id="applidet" placeholder="Enter Applicant Details" class="inputFormat"></div></div>';
    var content5 = '<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date Of Registration - From</span></label><input class=" form-control inputFormat" type="date" id="txtdateregisterfrom" onkeypress="return!1"></div>';
    var content6 = '<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Date Of Registration - To</span></label><input class=" form-control inputFormat" type="date" id="txtdateregisterto" onkeypress="return!1"></div>';
    var content10 = '<div class="col-md-12"><div class="form-group" style="margin-top:20px"><div><button type="submit" id="btnsearchforDesign" class="btn btn-primary pull-left" value="SEARCH">Search</button></div><div><button style="margin-left:8px;" type="submit" id="btnclearforDesign" class="btn btn-primary pull-left" value="CLEAR">Reset</button></div></div></div>';
    $('#divHide1').append(/*content2,*/ content3, content5, content6, content10);

    var content7 = '<div class="col-md-3"><div class="form-group"><label class="formLabel colorDark"><span class="control-label">Title</span></label><input type="text" id="title" placeholder="Enter Title" class=" form-control inputFormat"></div></div>';

    /*var content8 = `<div class="col-md-3"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Area</span></label><input type="text" id="area" placeholder="Enter Area" class="inputFormat"></div></div>`;*/
    var content8 = '<div class="col-md-3" id="hish"><div class="form-group col-md-12"><label class="formLabel colorDark"><span class="control-label">Priority Country</span></label><input type="text" id="pcountry" placeholder="Enter Priority Country" class=" form-control inputFormat"></div></div>';
    //$('#divHide2').append(content6, content7, content8);
    //$('#divHide2').append(content8);

    //var content10 = '<div class="col-md-8"><div class="form-group col-md-12" style="margin-top:34px"><div class="col-md-2"><button type="submit" id="btnsearchforDesign" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnclearforDesign" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-5" style="display:none" id="btncollapseforDesign"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div><div class="col-md-5"><button type="submit" id="advsearchforDesign" class="sbtbtn pull-right" value="ADVANCED SEARCH" style="width:100%">ADVANCED SEARCH</button></div></div></div>';
    //var content10 = '<div class="col-md-8"><div class="form-group" style="margin-top:34px"><div class="col-md-2"><button type="submit" id="btnsearchforDesign" class="sbtbtn pull-right" value="SEARCH" style="width:100%">SEARCH</button></div><div class="col-md-2"><button type="submit" id="btnclearforDesign" class="sbtbtn pull-right" value="CLEAR" style="width:100%">CLEAR</button></div><div class="col-md-5" style="display:none" id="btncollapseforDesign"><button type="submit" class="sbtbtn pull-right" value="COLLAPSE" style="width:100%">ADVANCED SEARCH</button></div></div></div>';
    //$('#divHide3').append(content10);

    var content11 = '<li><a href="javascript:void()" id="expDesignexcel" title="Export to Excel">Export to Excel</a></li><li><a href="javascript:void()" id="expDesignpdf" title="Export to PDF">Export to PDF</a></li>';
    $('#dynaction').append(content11);

    //$('#th1').text('Design Number');
    //$('#th2').text('Class');
    //$('#th3').text('Address');
    //$('#th4').text('Date Of Registration');
    //$('#th5').text('Title');
    //$('#th6').text('Priority');
    //$('#th7').text('Patent Office Journal No');

    $('#th1').text('Design Number');
    $('#th2').text('Class');
    $('#th3').text('Title');
    $('#th4').text('Date Of Registration');
    $('#th5').text('Address');
    $('#th6').text('Priority');
    $('#th7').text('Patent Office Journal No');

    // Adjust width of patent table
    $('#th2header').css('width', '20px');
    $('#th3header').css('width', '200px');
    $('#th5header').css('width', '100px');
}

$(document).on('click', '#btnsearchforDesign', function () {
    isSearchRnd = false;
    IPRSearchlistDesign(pageindex);
})

function IPRSearchlistDesign(pageindex) {
    var htmls = ''
    var searchtext = $('#filtertradmark').val();
    var designno = $('#desno').val();
    var vclass = $('#searchclassforDesign').val();
    var appdetails = $('#applidet').val();
    var statDesign = $('#searchstatusforDesign').val();
    var regfrom = $('#txtdateregisterfrom').val();
    var regto = $('#txtdateregisterto').val();
    var title = $('#title').val();
    var area = $('#area').val();
    var prioritycountry = $('#pcountry').val();
    var IPList = "5";

    if (searchtext == "" && designno == "") {
        alert('Please fill either "SEARCH" or "DESIGN NO." textbox!');
        $("#filtertradmark").focus();
        return false;
    }
    if (regfrom != '' && regfrom != null) {
        regfrom = convertorightFormat(regfrom);
    }
    if (regto != '' && regto != null) {
        regto = convertorightFormat(regto);
    }

    openload();
    var formData = new FormData();
    formData.append('filtertradmark', searchtext)
    formData.append('designnum', designno)
    formData.append('vclass', vclass)
    formData.append('applicantdetails', appdetails)
    formData.append('status', statDesign)
    formData.append('registerfromdate', regfrom)
    formData.append('registertodate', regto)
    formData.append('title', title)
    formData.append('area', area)
    formData.append('country', prioritycountry)
    formData.append('ip', IPList)
    formData.append("pagesize", pagesize);
    formData.append("pagenum", pageindex);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/DesignSearchList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response1) {
            if (response1.Data.data.length > 0) {
                $("#exportrecords").val(0);
                //ShowAllSorting();
                /*IPCounterforPatent();*/
                var obj = JSON.parse(response1.Data.data);
                localStorage.setItem('apidata', JSON.stringify(response1.Data.data));
                var length = obj.data.length;
                var obj1 = obj.data;
                var MyObj1 = 0;

                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $('#tSPagination').show();
                    $("#pdatastatus").hide();
                    //$.each(obj1, function (i, val) {
                    //    if (i === 0) {
                    //        firstvalue = val.RowId;
                    //    }
                    //    if (i === (length - 1)) {
                    //        var pnext = pageindex;
                    //        var pprev = pageindex;
                    //        var pageno = pageindex;

                    //        var totdata = val.TotalRecord;
                    //        var totpage = 0;
                    //        if (val.TotalRecord > 0) {
                    //            pnext = parseInt(pnext) + 1;
                    //            if (pnext == 0) pnext = 1;

                    //            pprev = parseInt(pageno) - 1;
                    //            if (pprev == 0) pprev = 1;
                    //            totpage = parseInt(totdata) / parseInt(pagesize);

                    //            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //                totpage = parseInt(totpage) + 1;
                    //            }

                    //            $("#pagnumvalue").attr("max", totpage);

                    //        }

                    //        var tfot = '';
                    //        $("#exportrecords").val(val.TotalRecord);
                    //        tfot += '<ul>'
                    //        tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

                    //        tfot += '<li><span>|</span></li>'
                    //        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //        tfot += '<li><span>|</span></li>'
                    //        tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'

                    //        tfot += `<li style="margin-left:5px;display:none;"><input type="text" class="form-control selctInputFormat" style="background:#ebebeb !important;" placeholder="Search" id="searchdata" style="height:24px !important;border-bottom: 1px solid #ddd !important;" /><button type="button" style="margin: 0;position: relative;top: -36px;float: right;background: none;border: none;" class="sbtbtn" id="searchdatasforDesign"><i class="glyphicon glyphicon-search"></i></button></li>`

                    //        tfot += `<li style="display:none;"><button class="gobtn" type="button" id="clear">x</button></li>`

                    //        if (val.TotalRecord <= length) {

                    //        }
                    //        else if (pageno == 1) {

                    //        }
                    //        else if (pageno == totpage) {
                    //            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                    //        }

                    //        else {
                    //            tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                    //        }

                    //        if (pageno < totpage) {
                    //            tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //        }
                    //        tfot += '</ul>'
                    //        $("#ptfooter").html("");
                    //        $("#ptfooter").html(tfot);
                    //    }

                    $.each(obj1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        if (i === (length - 1)) {
                            $("#exportrecords").val(val.TotalRecord);

                            $('#tSPagination').show();
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                var trademarkSearchResult = "Design Search(" + totdata + ")";
                                $("#dynamiciprheaderCount").text(trademarkSearchResult);
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#tsNext').hide();
                                    $('#tsPrev').css("display", "block");
                                }
                                else {
                                    $('#tsNext').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#tsPrev').css("display", "none");
                                }
                                else {
                                    $('#tsPrev').css("display", "block");
                                }

                                if (isSearchRnd == false) {
                                    setTotalRecord = totpage;
                                    SearchRenderPagination(pageindex, totpage);
                                }
                            }

                        }
                        qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;


                        htmls += '<tr>' +
                            //'<td style="text-align: left;" style="display:none;">' + val.RowId + '</td>' +
                            '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vTitle + '</span></td>' +
                            '<td style="text-align: left;">' + val.vDesignNo + '</td>' +
                            '<td>' + val.vClass + '</td>' +
                            '<td>' + (val.dDateOfRegistration == '01/01/1900' ? '' : convertdate(val.dDateOfRegistration)) + '</td>' +
                            '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vAddress + '</span></td>' +
                            '<td>' + val.vPriorityNo + '</td>' +
                            '<td><span class="freeze-text" style="font-size: 14px!important; font-weight: 500; color: #181D27!important; letter-spacing: 0; line-height: 20px; width: 250px !important; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vPatentOffJournalNo + '</span></td>' +
                            '<td>' +
                            '<ul class="table_action">' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="openDesigndetails" style="cursor:pointer;" title="Information retrieved from IP registry" tradeid="' + EncodeText(val.iid) + '" data-toggle="modal" data-target="#viewtrademarkdata">' +
                            '<img src="/newassets/img/eye.svg" alt="edit">' +
                            '</span>' +
                            '</li>' +
                            '<li>' +
                            '<span class="taskoutboxbtnicon" id="addDesignDetails" style="cursor:pointer;" title="Add Design Information" tradeid="' + EncodeText(val.iid) + '">' +
                            '<img src="/newassets/img/plus-circle.png" alt="plus-circle">' +
                            '</span>' +
                            '</li>' +
                            '</ul>' +
                            '</td>' +
                            '</tr>';



                    });

                } else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                    $('#tSPagination').hide();
                    $("#dynamiciprheaderCount").text("");
                    $("#pdatastatus").show();
                }
            }
            else {
                //htmls += '<tr>'
                //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                //htmls += '<tr>'
                $('#tSPagination').hide();
                $("#dynamiciprheaderCount").text("");
                $("#pdatastatus").show();
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
    });

}

$(document).on('click', '#openDesigndetails', function () {

    $('#tmdetailsdownload').css("display", "none");
    $('#spDocumentDetail').css("display", "none");
    $('#btnTradeinfoDiv').css("display", "block");
    $('#tmdetailsdownload').css("display", "none");
    $('#spMarkNameDetails').text("Design Information")
    $('#spShowMarkName').text("Design Information");

    trademarkId = $(this).attr("tradeid");
    $('#tmdetailsdownload').css("display", "none");
    $('#tmdetailsmodal').attr('tradeiid', trademarkId);
    openDesigndetails(trademarkId);

})

function openDesigndetails(trademarkId) {
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
                //alert(val.vJournalNo);

                $('#modal-header').text('View Design');
                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>Design Number</h5><span>' + val.vDesignNo + '</span></li>'
                    + '<li><h5>Class</h5><span>' + val.vClass + '</span></li>'
                    + '<li><h5>Address</h5><span>' + val.vAddress + '</span></li>'
                    + '<li><h5>Applicant Details</h5><span>' + (val.vApplDetails == null ? '' : val.vApplDetails) + '</span></li>'
                    + '<li><h5>Registration Date</h5><span>' + (val.dDateOfRegistration == '01/01/1900' ? '' : convertdate(val.dDateOfRegistration)) + '</span></li>'
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
                //    + '<tr><td>Address</td><td>:</td><td>' + val.vAddress + '</td></tr>'
                //    + '<tr><td>Applicant Details</td><td>:</td><td>' + (val.vApplDetails == null ? '' : val.vApplDetails) + '</td></tr>'
                //    + '<tr><td>Registration Date</td><td>:</td><td>' + (val.dDateOfRegistration == '01/01/1900' ? '' : convertdate(val.dDateOfRegistration)) + '</td></tr>'
                //    + '<tr><td>Title</td><td>:</td><td>' + val.vTitle + '</td></tr>'
                //    + '<tr><td>Priority No.</td><td>:</td><td>' + val.vPriorityNo + '</td></tr>'
                //    + '<tr><td>Priority Status</td><td>:</td><td>' + isNullCheck(val.vPriorityStatus) + '</td></tr>'
                //    + '<tr><td>Priority Date</td><td>:</td><td>' + convertdate(val.dPriorityDate) + '</td></tr>'
                //    + '<tr><td>Priority Country</td><td>:</td><td>' + isNullCheck(val.vPriorityCountry) + '</td></tr>'
                //    + '<tr><td>Design Image</td><td>:</td><td><img src="' + imagePath + '/' + val.vImgPath + '" alt="Image Not Available"></td></tr>'
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
            $('#searchstatusforDesign').html('');
            $.each(obj1, function (i, val) {
                var data1 = val.StatusName;
                if (data1 != null) {
                    $('#searchstatusforDesign').append('<option value=' + data1 + '>' + data1 + '</option>')
                }
            });
            $('#searchstatusforDesign').multiselect('reload');
        },

        error: function (response) {
            alert('There seems to be an error');
        },

        failure: function () {
            alert('Something went wrong');
        }
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

$(document).on('click', '#btnclearforDesign', function () {
    isSearchRnd = false;
    ClearAllFieldsForDesign();
})

function ClearAllFieldsForDesign() {
    $('#filtertradmark').val('');
    $('#desno').val('');
    $('#searchclassforDesign').val('');
    $('#searchclassforDesign').multiselect('reload');
    $('#applidet').val('');
    $('#searchstatusforDesign').val('');
    $('#searchstatusforDesign').multiselect('reload');
    $('#txtdateregisterfrom').val('');
    $('#txtdateregisterto').val('');
    $('#title').val('');
    $('#area').val('');
    $('#pcountry').val('');

    $('#bindIPRSearchData').empty();
    $("#tSPagination").hide();
    //$("#dynamiciprheader").text("");
    $("#dynamiciprheaderCount").text("");
    $("#pdatastatus").show();
    $("#tradePagination").hide();
    $("#dtNotFound").html("Data not found");
}

$(document).on('click', '#addDesignDetails', function () {

    var trademarkId = $(this).attr('tradeid');
    var IpList = "5";
    var formData = new FormData();
    formData.append('tradeid', trademarkId);
    formData.append('ip', IpList)

    $.ajax({

        async: true,
        url: "/api/IPRApi/AddDesignData",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            if (response.Data.data == '1') {
                var obj1 = JSON.parse(response.Data.data);
                $("#ids_deleteTraderequesr").text("Design added");
                $("#msgRUSureCon").text("Mark have been added to the tracker successfully.");
                $("#myModalAlertconfirmation").modal();
                //alert('Your Design has been added successfully.')
            }
            else {
                $("#myModalAlertconfirmation").modal();
                $("#msgRUSureCon").text("This Design has already been added.");
                //alert('This Design has already been added')
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
})

$(document).on('click', '#expDesignexcelF', function () {
    $("#myModalexport").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i <= recordsection; i++) {
        html += '<tr>';
        html += '<td>Page No:' + i + ' </td>';
        html += '<td>' +
            '<ul class="table_action">' +
            '<li>' +
            '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoexcelfordesign" pageno="' + i + '" type="excel" title="Download Excel">' +
            '<img src="/newassets/img/download.svg" alt="download Excel">' +
            '</span>' +
            '</li>' +
            '</ul>' +
            '</td>';

        html += '</tr>';

    }
    $("#printexport").html(html);
})
$(document).on('click', '#expDesignexcel', function () {
    $("#myModalexportSExcel").modal({ show: true });
    var totalRecord = $("#exportrecords").val();
    var pagesize = 10;
    var recordsection = totalRecord / pagesize;
    recordsection = recordsection + 1;
    var html = '';
    var bndDropdown = "";
    var btnFooter = "";
    var displayImage = "";
    bndDropdown = '<select class="selctInputFormat" id="id_exportreportdropDesignExcel"></select>';
    btnFooter = '<button class="btn btn-secondary" id="" data-dismiss="modal">Cancel</button>';
    btnFooter += '<button type="button" class="btn btn-primary" id="CommonExportExcelDesign">Confirm</button>';
    displayImage = '<img src="/newassets/images/Excel_download.png" style="margin:-15px 0px 0 -15px">';

    $("#btnFooterId").html("");
    $("#btnFooterId").html(btnFooter);
    $("#bndExcelDrp").html("");
    $("#bndExcelDrp").html(bndDropdown);
    $("#spDisplayImage").html(displayImage);
    $("#id_exportreportdropDesignExcel").html('');
    var html = '';
    var html = '<option value="" selected>Please Select</option>';
    for (var i = 1; i < recordsection; i++) {
        html += '<option value="' + i + '" > ' + i + ' </option>';
    }
    $("#id_exportreportdropDesignExcel").html(html);
})
$(document).on('click', '#CommonExportExcelDesign', function () {
    var searchtext = $('#filtertradmark').val();
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

    var IPList = '5';
    var designno = $('#desno').val();
    var vclass = $('#searchclassforDesign').val();
    var applicantDetails = $('#applidet').val();
    var status = $('#searchstatusforDesign').val();
    var dateregisterfrom = $('#txtdateregisterfrom').val();
    var dateregisterto = $('#txtdateregisterto').val();
    if (dateregisterfrom != '' && dateregisterfrom != null) {
        dateregisterfrom = convertorightFormat(dateregisterfrom);
    }
    if (dateregisterto != '' && dateregisterto != null) {
        dateregisterto = convertorightFormat(dateregisterto);
    }
    var title = $('#title').val();
    var area = $('#area').val();
    var priorityCountry = $('#pcountry').val();
    window.location = encodeURI("/IPR/ExportoExcelNewDesignSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
        + "&designnum=" + designno + "&vclass=" + vclass + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom + "&txtdateregisterto=" + dateregisterto + "&txttitle=" + title + "&txtarea=" + area + "&txtpriorityCountry=" + priorityCountry + "&pagesize=10&pagenum=" + pagenum);
});

$(document).on('click', '#exporttoexcelfordesign', function () {

    var searchtext = $('#filtertradmark').val();
    var IPList = '5';
    var designno = $('#desno').val();
    var vclass = $('#searchclassforDesign').val();
    var applicantDetails = $('#applidet').val();
    var status = $('#searchstatusforDesign').val();
    var dateregisterfrom = $('#txtdateregisterfrom').val();
    var dateregisterto = $('#txtdateregisterto').val();
    if (dateregisterfrom != '' && dateregisterfrom != null) {
        dateregisterfrom = convertorightFormat(dateregisterfrom);
    }
    if (dateregisterto != '' && dateregisterto != null) {
        dateregisterto = convertorightFormat(dateregisterto);
    }

    var title = $('#title').val();
    var area = $('#area').val();
    var priorityCountry = $('#pcountry').val();
    var pagenum = $(this).attr('pageno');

    window.location = encodeURI("/IPR/ExportoExcelNewDesignSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
        + "&designnum=" + designno + "&vclass=" + vclass + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom + "&txtdateregisterto=" + dateregisterto + "&txttitle=" + title + "&txtarea=" + area + "&txtpriorityCountry=" + priorityCountry + "&pagesize=10&pagenum=" + pagenum);
})

//$(document).on('click', '#expDesignpdf', function () {

//    $("#myModalexport").modal({ show: true });

//    var totalRecord = $("#exportrecords").val();
//    var pagesize = 10;
//    var recordsection = totalRecord / pagesize;
//    recordsection = recordsection + 1;
//    var html = '';
//    for (var i = 1; i < recordsection; i++) {
//        html += '<tr>';


//        html += '<td>Page No:' + i + ' </td>';
//        html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffordesign" pageno="' + i + '" type="pdf">Download File</span></td>';
//        html += '</tr>';

//    }
//    $("#printexport").html(html);
//})

//$(document).on('click', '#exporttopdffordesign', function () {

//    var searchtext = $('#filtertradmark').val();
//    var IPList = '5';
//    var designno = $('#desno').val();
//    var vclass = $('#searchclassforDesign').val();
//    var applicantDetails = $('#applidet').val();
//    var status = $('#searchstatusforDesign').val();
//    var dateregisterfrom = $('#txtdateregisterfrom').val();
//    var dateregisterto = $('#txtdateregisterto').val();

//    if (dateregisterfrom != '' && dateregisterfrom != null) {
//        dateregisterfrom = convertorightFormat(dateregisterfrom);
//    }
//    if (dateregisterto != '' && dateregisterto != null) {
//        dateregisterto = convertorightFormat(dateregisterto);
//    }
//    var title = $('#title').val();
//    var area = $('#area').val();
//    var priorityCountry = $('#pcountry').val();
//    var pagenum = $(this).attr('pageno');

//    window.location = encodeURI("/IPR/ExportoPDFNewDesignSearch?IPList=" + IPList + "&filtertradmark=" + searchtext + "&txtappdetails=" + applicantDetails
//        + "&designnum=" + designno + "&class=" + vclass + "&status=" + status + "&txtdateregisterfrom=" + dateregisterfrom
//        + "&txtdateregisterto=" + dateregisterto + "&txttitle=" + title + "&txtarea=" + area + "&txtpriorityCountry=" + priorityCountry + "&pagesize="+10);

//});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Some Extra Functions xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function showinfoModal() {

    $('#demo3').css('display', 'block');
}

function hideinfoModal() {

    $('#demo3').css('display', 'none');
}

//$(document).on('mousedown', '#viewtrademarkdata', function () {

//    
//    $('#viewtrademarkdata').hide();
//    $('.modal-backdrop fade in').remove();
//});

function convertdateValidUpto(inputDate) {

    const date = new Date(inputDate);

    day = date.getDate();
    month = date.getUTCMonth();
    year = date.getFullYear();

    /*var formattedDate = day + ' ' + month + ' ' + year;*/

    var formattedDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    return formattedDate;
}

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
        //var formatteddate = new Date(input);
        //var newDate = formatteddate.toLocaleDateString('en-GB', {

        //    year: 'numeric',
        //    month: 'short',
        //    day: '2-digit'
        //});

        //return newDate;
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

function ConvertRegex(convertstring) {

    let pattern = /ASPLivesite\/IPRAPI\/IPRDocs\/Trademark\/Upload_Document/i

    var replacementstring = '';

    var finalResult = convertstring.replace(pattern, replacementstring);

    return finalResult;
}

function ConvertRegexforoppose(convertstring) {
    let pattern = /ASPLivesite\/IPRAPI\/IPRDocs\/Trademark\/Opposition_Documents/i
    var replacementstring = '';
    var finalResult = convertstring.replace(pattern, replacementstring);
    return finalResult;
}
var OppPageNo = 1;
var oppApplNo = "";
var isOppInfoRnd = false;
$(document).on('click', '#addopponentdetails', function () {
    isOppInfoRnd = false;
    oppApplNo = $(this).attr("appid");
    OppositionInfoDetail(oppApplNo, OppPageNo);
});

window.ViewOppositionDetailsInfo = function (oppDApplNo, OppDTradeId) {
    $(".nav-item, .nav-link").removeClass("active");
    $("#idOppositionDetails, .nav-link").addClass("active");

    $("#divTradeInfoDetails-body").css("display", "none");
    $("#divIPRTrademarkDoc-body").css("display", "none");
    $("#divOppDocDetail-body").css("display", "none");
    $("#divOppositionDetails-body").css("display", "block");

    $("#btnTradeinfoDiv").css("display", "none");
    // start document 
    $("#btnTradeDocDiv").css("display", "none");
    //start Opposition doc
    $("#btnTradeOppDocDiv").css("display", "none");
    //start Opposition detail
    $("#btnTradeOppDetailDiv").css("display", "block");

    globalApplNo = oppDApplNo;
    globalTradeId = OppDTradeId;

    CheckDetailAvailability(oppDApplNo);

    if (opposeStatus != "0") {
        $("#idOpenOppDoc").css("display", "block");
        $("#idOppositionDetails").css("display", "block");
    } else {
        $("#idOpenOppDoc").css("display", "none");
        $("#idOppositionDetails").css("display", "none");
    }
    isOppInfoRnd = false;
    oppApplNo = oppDApplNo;//$(this).attr("appid");
    OppositionInfoDetail(oppApplNo, OppPageNo);
}

$(document).on("click", "#idOppositionDetails", function () {
    $("#bindIPROppositionDetailsData").empty();
    ViewOppositionDetailsInfo(globalApplNo, globalTradeId);
});

var OppInfoTotRecord = 1;
function OppositionInfoDetail(oppApplNo, OppPageNo) {
    var html = '';
    var vApplNo = oppApplNo; //$(this).attr("appid");
    var formData = new FormData();
    formData.append("pagenum", OppPageNo);
    formData.append("pagesize", pagesize);
    formData.append("vapplno", vApplNo);

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

                            $('#OppInfoPagination').show();
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                $("#OppInfopdatastatus").hide();
                                $("#OppInfoPagination").show();
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (OppPageNo == totpage) {
                                    $('#OppInfonext').hide();
                                    $('#OppInfoprev').css("display", "block");
                                }
                                else {
                                    $('#OppInfonext').css("display", "block");
                                }
                                if (OppPageNo == 1) {
                                    $('#OppInfoprev').css("display", "none");
                                }
                                else {
                                    $('#OppInfoprev').css("display", "block");
                                }

                                if (isOppInfoRnd == false) {
                                    OppInfoTotRecord = totpage;
                                    OppInfoRenderPagination(OppPageNo, totpage);
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
                        $("#OppInfoPagination").hide();
                        $("#OppInfopdatastatus").show();
                        //html += '<tr>'
                        //html += '<td colspan=12 align=center>Data Not Found</td>'
                        //html += '<tr>'
                    }
                }
                else {
                    $("#OppInfoPagination").hide();
                    $("#OppInfopdatastatus").show();
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
var isOppDRnd = false;
function OppInfoRenderPagination(OppPageNo, totpage) {
    let totPages = totpage;
    let paginationHtml = '';
    let maxVisible = 4;

    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="btnOpp page-btn ${i === OppPageNo ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (OppPageNo <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="btnOpp page-btn ${i === OppPageNo ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="btnOpp page-btn ${j === OppPageNo ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#OppInfopageNumbers").html(paginationHtml);
    isOppInfoRnd = true;
}


$(document).on("click", ".btnOpp", function () {
    let page = $(this).data("page");
    OppPageNo = page;
    isOppDRnd = true;
    $("#oppInfotxtgopage").val("");
    OppositionInfoDetail(oppApplNo, OppPageNo);
    $(".page-btn").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#OppInfoprev", function () {
    if (OppPageNo > 1) {
        OppPageNo = OppPageNo - 1;
    }
    isOppDRnd = true;
    $("#oppInfotxtgopage").val("");
    OppositionInfoDetail(oppApplNo, OppPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + OppPageNo + "']").addClass("active");
});


$(document).on("click", "#OppInfonext", function () {
    if (OppPageNo => 1) {
        OppPageNo = OppPageNo + 1;
    }

    isOppDRnd = true;
    $("#oppInfotxtgopage").val("");
    OppositionInfoDetail(oppApplNo, OppPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + OppPageNo + "']").addClass("active");
});

$(document).on("click", "#OppInfodivGo", function () {
    let goToPage = parseInt($("#oppInfotxtgopage").val());
    if (!isNaN(goToPage)) {
        OppPageNo = goToPage;
    }
    if (goToPage > OppInfoTotRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        OppPageNo = 1;
        return false;
    }
    isOppDRnd = true;
    OppositionInfoDetail(oppApplNo, OppPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + OppPageNo + "']").addClass("active");
});

//$(document).on('click', '#addopponentdetails', function () {
//    var html = '';
//    var vApplNo = $(this).attr("appid");
//    var formData = new FormData();
//    formData.append("pagenum", pageindex);
//    formData.append("pagesize", pagesize);
//    formData.append("vapplno", vApplNo);

//    $.ajax(
//        {
//            async: false,
//            type: "POST",
//            url: "/api/IPRApi/IPROppositionDetails",
//            dataType: 'json',
//            data: formData,
//            contentType: false,
//            processData: false,
//            success: function (response1) {
//                var obj = response1.Data.data;
//                if (obj != null) {
//                    var length = obj.length;
//                    if (length > 0) {
//                        $("#divalertlist tr").remove();
//                        $.each(obj, function (i, val) {
//                            if (i === 0) {
//                                firstvalue = val.RowId;
//                            }
//                            if (i === (length - 1)) {
//                                var pnext = pageindex;
//                                var pprev = pageindex;
//                                var pageno = pageindex;

//                                var totdata = val.TotalRecord;
//                                var totpage = 0;
//                                if (totdata > 0) {
//                                    pnext = parseInt(pnext) + 1;
//                                    if (pnext == 0) pnext = 1;

//                                    pprev = parseInt(pageno) - 1;
//                                    if (pprev == 0) pprev = 1;
//                                    totpage = parseInt(totdata) / parseInt(pagesize);

//                                    if (parseInt(totdata) % parseInt(pagesize) != 0) {
//                                        totpage = parseInt(totpage) + 1;
//                                    }

//                                    $("#pagnumvalue").attr("max", totpage);

//                                }
//                                var totalRecord = '';

//                                if (parseInt(totdata) > 2500) {
//                                    totalRecord = '2500';
//                                }

//                                else {
//                                    totalRecord = totdata;
//                                }

//                                var tfot = '';
//                                tfot += '<ul>'
//                                tfot += '<li>results <span>' + totalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'

//                                tfot += '<li><span>|</span></li>'
//                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totalRecord) + '</li>'
//                                tfot += '<li><span>|</span></li>'
//                                tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`

//                                if (totdata <= length) {

//                                }
//                                else if (pageno == 1) {

//                                }
//                                else if (pageno == totpage) {
//                                    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'

//                                }

//                                else {
//                                    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
//                                }

//                                if (pageno < totpage) {
//                                    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
//                                }

//                                tfot += '<button style="padding-right: 10px;position: relative;left: 100%;" class="sbtbtn pull-right" data-toggle="modal" data-target="#oppositionEmailModal">Email As Excel</button>';
//                                tfot += '<button style="padding-right: 10px;position: relative;left: 100%;" class="sbtbtn pull-right">Download</button>';
//                                tfot += '</ul>'

//                                $("#ptfooter1").html("");
//                                $("#ptfooter1").html(tfot);
//                            }

//                            html += '<tr><td>' + val.RowId + '</td>';
//                            html += '<td>' + val.vApplNo + '</td>';
//                            html += '<td>' + val.vOpponentName + '</td>';
//                            html += '<td>' + val.vOpponentAddress + '</td>';
//                            html += '<td>' + val.vOppositionNo + '</td>';
//                            html += '<td>' + val.vOpponentCode + '</td>';
//                            html += '<td>' + val.vOppositionDate + '</td>';
//                            html += '<td>' + val.vAttorneyName + '</td>';
//                            html += '<td>' + val.vAttorneyAddress + '</td>';
//                            html += '<td>' + val.vStatus + '</td>';
//                            html += '<td>' + val.vDecision + '</td>';
//                            //html += '<td>NA</td></tr>';
//                        });
//                    }
//                    else {
//                        html += '<tr>'
//                        html += '<td colspan=12 align=center>Data Not Found</td>'
//                        html += '<tr>'
//                    }
//                }
//                else {
//                    html += '<tr>'
//                    html += '<td colspan=12 align=center>Data Not Found</td>'
//                    html += '<tr>'
//                }

//                $("#bindIPROppositionDetailsData").html("").html(html);
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

$(document).on('click', '#oppbtnEmail', function () {
    //var PropName = $(this).data('name');
    //var PropAddress = $(this).data('address');
    var emailTo = $('#emailexceltxt').val();
    if (emailTo == '') {
        alert('Please enter an email id');
        return false;
    }

    // window.location = encodeURI("/IPR/SendEmailForIPRProprietorAndApplicant?iprid=" + IPname + "&To=" + emailTo + "&propname=" + PropName + "&propadd=" + PropAddress);
    window.location = encodeURI("/IPR/SendEmailForIPRProprietorAndApplicant?iprid=" + IPname + "&To=" + emailTo);
    alert('A mail has been sent to the receiver');
});

function validateNumericInput(event) {
    const inputElement = event.target;
    const inputValue = inputElement.value;
    // Remove non-numeric characters
    const numericValue = inputValue.replace(/\D/g, '');
    if (inputValue !== numericValue) {
        alert('Please enter only numeric characters.');
    }
    inputElement.value = numericValue;
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

function setMaxDateForInputs(IPname) {
    // Get current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    switch (IPname) {
        case '1':
            var txtdateapplicationfrom = document.getElementById('txtdateapplicationfrom');
            var txtdateapplicationto = document.getElementById('txtdateapplicationto');
            txtdateapplicationfrom.max = today;
            txtdateapplicationto.max = today;

            txtdateapplicationfrom.addEventListener('change', function () {
                if (txtdateapplicationfrom.value && !txtdateapplicationto.value) {
                    alert("Please select 'To' date.");
                    txtdateapplicationto.value = today;
                }
            });

            break;
        case '2':
            var txtdatefrom = document.getElementById('txtdatefrom');
            var txtdateto = document.getElementById('txtdateto');
            txtdatefrom.max = today;
            txtdateto.max = today;

            txtdatefrom.addEventListener('change', function () {
                if (txtdatefrom.value && !txtdateto.value) {
                    alert("Please select 'To' date.");
                    txtdateto.value = today;
                }
            });

            break;
        case '3':
            var datefilingfrom = document.getElementById('datefilingfrom');
            var datefilingto = document.getElementById('datefilingto');
            var prioritydatefrom = document.getElementById('prioritydatefrom');
            var prioritydateto = document.getElementById('prioritydateto');

            var pubdatefrom = document.getElementById('pubdatefrom');
            var pubdateto = document.getElementById('pubdateto');

            datefilingfrom.max = today;
            datefilingto.max = today;
            prioritydatefrom.max = today;
            prioritydateto.max = today;
            pubdatefrom.max = today;
            pubdateto.max = today;

            datefilingfrom.addEventListener('change', function () {
                if (datefilingfrom.value && !datefilingto.value) {
                    alert("Please select 'To' date.");
                    datefilingto.value = today;
                }
            });

            prioritydatefrom.addEventListener('change', function () {
                if (prioritydatefrom.value && !prioritydateto.value) {
                    alert("Please select 'To' date.");
                    prioritydateto.value = today;
                }
            });

            pubdatefrom.addEventListener('change', function () {
                if (pubdatefrom.value && !pubdateto.value) {
                    alert("Please select 'To' date.");
                    pubdateto.value = today;
                }
            });

            //pubdateto.addEventListener('change', function () {
            //    if (pubdateto.value && !pubdateto.value) {
            //        alert("Please select 'From' date.");
            //        pubdateto.value = today;
            //    }
            //});

            break;
        case '4':
            var filingdatefrom = document.getElementById('filingdatefrom');
            var filingdateto = document.getElementById('filingdateto');
            filingdatefrom.max = today;
            filingdateto.max = today;

            filingdatefrom.addEventListener('change', function () {
                if (filingdatefrom.value && !filingdateto.value) {
                    alert("Please select 'To' date.");
                    filingdateto.value = today;
                }
            });

            break;
        case '5':
            var txtdateregisterfrom = document.getElementById('txtdateregisterfrom');
            var txtdateregisterto = document.getElementById('txtdateregisterto');
            txtdateregisterfrom.max = today;
            txtdateregisterto.max = today;

            txtdateregisterfrom.addEventListener('change', function () {
                if (txtdateregisterfrom.value && !txtdateregisterto.value) {
                    alert("Please select 'To' date.");
                    txtdateregisterto.value = today;
                }
            });

            break;
        default:
            console.error("One or more elements not found in the DOM.");
            break;
    }
}



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
    $("#document_popup_header").html("File List");
    var headerhtml = '';
    headerhtml += '<tr>'
    headerhtml += '<th><div class="thbg" > S.No. </div></th> '
    //headerhtml += '<th><div class="thbg" id = "th2">Application No. </div></th> '
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
                                tfot += '<li>pages ' + pagindexModal + '/ <span id="Doctotalpage">' + parseInt(totpage) + '</span>'
                                tfot += '<li><span>|</span></li>'
                                tfot += `<li><input type="number" id="Docpagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="Docgetdatabypagenum" style="margin-left:10px;">Go</button></a></li>`
                                tfot += '<li>'
                                if (value.TotalRecords <= length) {

                                }
                                else if (pageno == 1) {

                                }
                                else if (pageno == totpage) {
                                    tfot += '<span><a id="DocpaginateData"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1"></a></span> '
                                }
                                else {
                                    tfot += '<span><a id="DocpaginateData"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1" ></a></span>'
                                }

                                if (pageno < totpage) {
                                    tfot += '<span><a  id="DocpaginateData" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext1"></a ></span >'
                                }

                                tfot += '</li ></ul>'
                                $("#modalFotter").html("");
                                $("#modalFotter").html(tfot);
                            }
                            htmls += '<tr>' +
                                '<td>' + value.RowNum + '</td>' +
                                //'<td>' + value.vApplNo + '</td>' +
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



$(document).on('click', '#DocpaginateData', function () {
    pagindexModal = $(this).attr("index");
    loadPatentDocByAppNo();
});

$(document).on('click', '#Docgetdatabypagenum', function () {
    var pageindex = $("#Docpagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            pagindexModal = pageindex;
            var totalpageindex = $("#Doctotalpage").text();
            if (pagindexModal <= parseInt(totalpageindex)) {
                loadPatentDocByAppNo();
            }
            else {
                alert("Please enter a valid page number.");
                return false;
            }
        }
    }
});




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

                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
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

var EPageIndex = 1;
var ExamApplNo = "";

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

