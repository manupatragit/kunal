var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");

$(document).ready(function () {
    $('#hideIPList').remove();
    //IPRSearchlist(pageindex);

    if (IPname == "1") {
        $("#SharedTradetab").css("display", "block");
        document.getElementById('txtapplicationno').placeholder = 'Application Number';
        $('#dynamiciprheader').text('Trademark');

        IPRSearchlist(pageindex);
    }
    $('#statusforpatent').multiselect({
        columns: 1,
        texts: {
            placeholder: 'Select Languages',
            search: 'Search Languages'
        },
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


    /*Start page redirection*/
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

    /*End page redirection*/

    $(document).on("click", "#idcustomcommonFilter", function () {
        $("#iprform")[0].reset();
        GetClassList();
        GetStatusList();
        $('#myModalCustomCommonFilter').modal({ show: true });
    });

    /*Select User for assign trademark*/
    $('#tradeMarkAssignUserList').multiselect({
        columns: 1,
        placeholder: 'Select User For Assign',
        search: true,
        selectAll: true
    });
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
        search: true,
        selectAll: false
    });

    jQuery('#searchclass').multiselect({
        columns: 1,
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

$(document).on('click', '#removesharetrademark', function () {
    trademarkId = $(this).attr("tradeid");
    //if (confirm("Are you sure you want to delete this trademark?")) {
    //    removesharetrade(trademarkId, IPname);
    //}
    $("#ids_deleteTraderequesr").text("Delete trademark Request");
    $("#msgRUSure").text("Are you sure you want to delete this trademark?");
    $("#myModalmarkdeleteTradeconfirmation").modal();
    $("#deleteTrademarkDetails").attr("id-val", trademarkId);
});

$(document).on('click', '#deleteTrademarkDetails', function () {
    var trademarkIdDet = "";
    trademarkIdDet = $(this).attr("id-val");
    removesharetrade(trademarkIdDet, IPname);
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
    IPRSearchlist(pageindex)
});

function removesharetrade(trademarkiid, ip) {
    var html = "";
    var ipList = ip;
    var formdata = new FormData();
    formdata.append("tradeid", trademarkiid);
    formdata.append("ip", ipList);
    $.ajax({
        async: true,
        url: "/api/IPRApi/RemoveShareTrademark",
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = JSON.parse(response.Data.data);
            var obj = obj1.data;

            new PNotify({
                title: 'Success!',
                text: 'Your Trade Mark has been successfully removed.',
                type: 'success',
                delay: 3000
            });
            IPRSearchlist(pageindex);
            $("#myModalmarkdeleteTradeconfirmation").modal("hide");
            
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
    var filtertradmark = $("#filtertradmark").val();

    if (IPList == "") {
        alert("Please select IP List");
        $("#IPList").focus();
        return false;
    }

    if (IPname == '1') {
        IPRSearchlist(pageindex);
    }
});

$("#btnclear").click(function () {

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
$(document).on('click', '#paginate', function () {
    /* your code here */
    ppageindex = $(this).attr("index");
    switch (IPname) {
        case '1':
            IPRSearchlist(ppageindex);
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
var totSharedCount = 1;
function IPRSearchlist(pageindex, colname, sort) {
    var imagePath = 'https://iprdocs.mykase.in/IPR_Documents_New/IPRImages/Trademark';
    openload();
    var htmls = '';
    var IPList = '1'
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
    var iprcounter = $("#hdncounter").val();
    if (iprcounter == 0) {
        iprcounter = $("hdncounter").val(1);
    }

    if (searchclass == null) {
        searchclass = "";
    }
    if (searchstatus == null) {
        searchstatus = "";
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

    if (hearingFrmDate != "" && hearingFrmDate != 'Invalid Date') {
        hearingFrmDate = convertorightFormat(hearingFrmDate);
    }
    if (hearingToDate != "" && hearingToDate != 'Invalid Date') {
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

    $.ajax(
        {
            async: true,
            type: "POST",
            url: "/api/IPRApi/ViewSharedTradeMarkDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {
                ShowAllSorting();
                $("#exportrecords").val(0);
                var obj = JSON.parse(response1.Data.data);
                var length = obj.length;
                var obj1 = obj;
                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $("#shareddatastatus").hide();
                    $("#dtNotFound").text("");
                    $.each(obj1, function (i, val) {
                        if (i === 0) {

                            firstvalue = val.RowId;

                        }
                        if (i === (length - 1)) {
                            $("#SharedTradeCount").text(" (" + val.TotalRecord + ")");
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
                                totSharedCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                        qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;

                        var hearingDateD = "";
                        hearingDateD = convertorightFormat(val.vHearingDate);
                        if (hearingDateD != "01/01/1900") {
                            hearingDateD = convertdate(hearingDateD);
                        }
                        else {
                            hearingDateD = "";
                        }

                        var imageP = "";
                        //imageP = '<img style="width:60%;height:30%" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available">';
                        if (val.vImgPath != "" && val.vImgPath != null) {
                            imageP = '<img class="table_img" src="' + imagePath + '/' + val.vClass + '/' + val.vImgPath + '" alt="Image Not Available">';
                        }
                        else {
                            imageP = '<img class="table_img" src="/newassets/img/na.svg" alt="Image Description">';
                        }

                        /*Start Check detail available or not*/
                        CheckDetailAvailability(val.vApplNo);
                        /*End Check detail available or not*/

                        htmls += '<tr>'
                        htmls += '<td style="text-align: center;display:none" id="rowid">' + val.RowId + '</td>'
                        htmls += '<td id="prop" class=""><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + val.vProprietor + '</span></td>'
                        htmls += '<td style="text-align: center;" id="applno">' + val.vApplNo + '</td>'
                        htmls += '<td style="width:20px;">' + imageP + '</td>'
                        htmls += '<td id="wordmark">' + val.vWordMark + '</td>'
                       
                        //htmls += '<td>' + val.vStatus + '</td>'
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
                        //htmls += '<ul class="action-ul"><li><span class="glyphicon glyphicon-eye-open" id="openviewaddedtrademarks" style="cursor:pointer;" title="Information retrieved from IP registry" openDocApplNo="' + (val.vApplNo) + '"  tradeid=' + val.tradeiid + ' data-toggle="modal" data-target="#viewaddedtrademarkdata"></span></li>'
                        //htmls += '<li><span class="glyphicon glyphicon-trash" id="removesharetrademark" style=" cursor:pointer;" title="Remove Trademark Information" iid=' + val.iid + ' tradeid=' + val.tradeiid + '></span></li>'
                        //htmls += '<li><div class="dropdown"><button class="dropdown-toggle" id ="menu1" type ="button" data-toggle="dropdown" title="more action"><img src="/newassets/img/more-action.png" height="32" width="32"></button><ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">'
                        //htmls += '<li><span class="glyphicon glyphicon-file" id="opendocumentdetails" style="cursor:pointer;" title="Document details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#trademarkDoctDetails">Document Details</span></li>'
                        //htmls += '<li><span class="glyphicon glyphicon-envelope" id="addemailtrademark" style="cursor:pointer;" title="Email Tracker" tradeid=' + val.tradeiid + '>Share via Email</span></li>'
                        //if (examDocAvail != "0") {
                        //    htmls += '<li><span class="glyphicon glyphicon-list-alt" id="openExamDetail" style="cursor:pointer;" title="Examination details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#examinationDoctDetails">Examination Details</span></li>'
                        //}
                        //if (prDetailAvail != "0") {
                        //    htmls += '<li><span class="" id="openPRDetail" style="cursor:pointer;" title="pr details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#PRDetails"><img src="/newassets/images/PRIcon.png" />PR Details</span></li>'
                        //}
                        //if (val.vStatus === 'Opposed') {
                        //    htmls += '<li><span class="glyphicon glyphicon-list-alt" id="openopposedetails" style="cursor: pointer; " title="Oppose details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#OppDoctDetails">Oppose Document</span></li>';
                        //    htmls += '<li><span data-toggle="modal" data-target="#oppositionDetails" appid=' + val.vApplNo + ' id="addopponentdetails" title="Opposition Details" style="cursor:pointer;"> <i class="bi bi-person-badge"></i>Opposition Details</span></li>'
                        //}
                        //if (corDocAvail != "0") {
                        //    htmls += '<span class="glyphicon glyphicon-folder-open" id="openCorrespDetail" style="cursor:pointer;" title="Correspondence & Notices" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#correspondenceDetails">Correspondence & Notices</span></li>'
                        //}
                        
                        //htmls += '</ul></li></ul>'



                        htmls += '<ul class="table_action">';

                        // View Trademark Info
                        htmls += '<li><div class="taskoutboxbtnicon" id="openviewaddedtrademarks1" onClick="ViewTrademarkDetails(' + val.vApplNo + ',' + val.tradeiid + ')" style="cursor:pointer;" title="Information retrieved from IP registry" openDocApplNo="' + val.vApplNo + '" tradeid="' + val.tradeiid + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                        htmls += '<img src="/newassets/img/tm_icon.svg" /></div></li>'; // You can update the image to something more appropriate if needed

                        // Remove Trademark Info
                        htmls += '<li><div class="taskoutboxbtnicon" id="removesharetrademark" style="cursor:pointer;" title="Remove Trademark Information" iid="' + val.iid + '" tradeid="' + val.tradeiid + '">';
                        htmls += '<img src="/newassets/img/delete.svg" /></div></li>';

                        // Dropdown More Actions
                        htmls += '<li><div class="input-group-btn">';
                        htmls += '<button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                        htmls += '<img src="/newassets/img/dots-vertical.svg" alt="action button"></button>';
                        htmls += '<ul class="dropdown-menu action-more">';

                        // Document Details
                        htmls += '<li><div class="action_one" id="opendocumentdetails1" onClick="OpenDocumentDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Document details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                        htmls += '<img src="/newassets/img/document_details.svg"> Document Details</div></li>';

                        // Share via Email
                        //htmls += '<li><div class="action_one" id="addemailtrademark" title="Email Tracker" style="cursor:pointer;" tradeid="' + val.tradeiid + '">';
                        //htmls += '<img src="/newassets/img/mail.svg"> Share via Email</div></li>';

                        // Examination Details
                        if (examDocAvail != "0") {
                            htmls += '<li><div class="action_one" id="openExamDetail1" onClick="ViewExamDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Examination details" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
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
                            //htmls += '<img src="/newassets/images/PRIcon.png"> Opposition Details</div></li>';
                            htmls += '<img src="/newassets/img/opposition.png"> Opposition Details</div></li>';
                        }

                        // Correspondence Details
                        if (corDocAvail != "0") {
                            htmls += '<li><div class="action_one" id="openCorrespDetail1" onClick="ViewCorrespDetails(' + val.vApplNo + ',' + val.tradeiid + ')" title="Correspondence & Notices" style="cursor:pointer;" appid="' + val.vApplNo + '" data-toggle="modal" data-target="#viewaddedtrademarkdata">';
                            htmls += '<img src="/newassets/img/Corresponding.svg"> Correspondence & Notices</div></li>';
                        }

                        htmls += '</ul></div></li></ul>';

                        htmls += '</td>'
                        htmls += '</tr>'

                        //htmls += ' <tr><td style="text-align: center;" id ="rowid">' + val.RowId + '</td><td style="text-align: center;" id="applno">' + val.vApplNo + '</td><td style="width:20px;">' + imageP + '</td><td id="wordmark">' + val.vWordMark + '</td><td id="prop">' + val.vProprietor + '</td><td>' + val.vStatus + '</td><td>' + val.vClass + '</td><td>' + convertdate(val.dApplDate) + '</td><td>' + hearingDateD + '</td><td>' + val.vUsedSince + '</td>'
                        //    + '<td><span class="glyphicon glyphicon-eye-open" id="openviewaddedtrademarks" style="cursor:pointer;" title="Information retrieved from IP registry" openDocApplNo="' + (val.vApplNo) + '"  tradeid=' + val.tradeiid + ' data-toggle="modal" data-target="#viewaddedtrademarkdata"></span>'
                        //    + ' | <span class="glyphicon glyphicon-file" id="opendocumentdetails" style="cursor:pointer;" title="Document details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#trademarkDoctDetails"></span>'
                        //    + (val.vStatus === 'Opposed' ? ' | <span class="glyphicon glyphicon-list-alt" id="openopposedetails" style="cursor:pointer;" title="Oppose details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#trademarkDoctDetails"></span>' : '')
                        //    + ' | <span class="glyphicon glyphicon-trash" id="removesharetrademark" style=" cursor:pointer;" title="Remove Trademark Information" iid=' + val.iid + ' tradeid=' + val.tradeiid + '></span>'

                        //    + ' | <span class="glyphicon glyphicon-envelope" id="addemailtrademark" style="cursor:pointer;" title="Email Tracker" tradeid=' + val.tradeiid + '></span>'
                        //    + (val.vStatus === 'Opposed' ? ' | <span data-toggle="modal" data-target="#oppositionDetails" appid=' + val.vApplNo + ' id="addopponentdetails" title="Opposition Details" style="cursor:pointer;"> <i class="bi bi-person-badge"></i></span>' : '')

                        //    + (examDocAvail != "0" ? ' | <span class="glyphicon glyphicon-list-alt" id="openExamDetail" style="cursor:pointer;" title="Examination details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#examinationDoctDetails"></span>' : '')
                        //    + (corDocAvail != "0" ? ' | <span class="glyphicon glyphicon-folder-open" id="openCorrespDetail" style="cursor:pointer;" title="Correspondence & Notices" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#correspondenceDetails"></span>' : '')
                        //    + (prDetailAvail != "0" ? ' | <span class="" id="openPRDetail" style="cursor:pointer;" title="pr details" appid="' + (val.vApplNo) + '" data-toggle="modal" data-target="#PRDetails"><img src="/newassets/images/PRIcon.png" /></span>' : '')

                        //    + '</td ></tr > ';
                    });
                } else {
                    //htmls += '<tr>'
                    //htmls += '<td colspan=11 align=center>Data Not Found</td>'
                    //htmls += '<tr>'
                    $('#tradePagination').hide();
                    $("#SharedTradeCount").text("");
                    $("#shareddatastatus").show();
                    $("#dtNotFound").text("No Shared Trademarks found");
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
    } 
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > totSharedCount || goToPage == 0) {
        alert("Please enter a valid page number.");
        setPageNo = 1;
        return false;
    }
    isRenderPage = true;
    if (IPname == 1) {
        IPRSearchlist(setPageNo);
    } 
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

var appFromDate = "", appToDate = "";
$(document).on('click', '#searchByApplDate', function () {
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
    hearingFrmDate = "";
    hearingToDate = "";
    $('#hearingfrmdate').val("");
    $('#hearingdateTo').val("");
    IPRSearchlist(pageindex);
    $("#Applicationcleardate").hide();
    $("#ApplicationclearHear").hide();
    $("#dropdown-hear-menu").hide();

})
/*End Hearing date filter*/

/*Start opposition detail*/
var OppPageIndex = 1;
var OppApplNo = "";
var oppTotCount = 1;
//$(document).on('click', '#addopponentdetails', function () {
//    OppApplNo = $(this).attr("appid");
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

$(document).on("click", "#idOppositionDetails", function () {
    ViewOppositionDetails(globalApplNo, globalTradeId);
});

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
                                    oppTotCount = totpage;
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


$(document).on('click', '#addopponentdetails1', function () {
    var html = '';
    var vApplNo = $(this).attr("appid");
    //$(this).data('appid');
    var formData = new FormData();
    formData.append("pagenum", pageindex);
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
                            $('#oppDPagination').show();
                            $('#oppIpdatastatus').hide();
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (i === (length - 1)) {
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#oppDNext').hide();
                                    $('#oppDPrev').css("display", "block");
                                }
                                else {
                                    $('#oppDNext').css("display", "block");
                                }
                                if (pageindex == 1) {
                                    $('#oppDPrev').css("display", "none");
                                }
                                else {
                                    $('#oppDPrev').css("display", "block");
                                }

                                if (isOppRnd == false) {
                                    oppTotCount = totpage;
                                    OppPaginationDetail(pageindex, totpage);
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
                        });
                    }
                    else {
                        //html += '<tr>'
                        //html += '<td colspan=12 align=center>Data Not Found</td>'
                        //html += '<tr>'
                        $('#oppDPagination').hide();
                        $('#oppIpdatastatus').show();
                    }
                }
                else {
                    //html += '<tr>'
                    //html += '<td colspan=12 align=center>Data Not Found</td>'
                    //html += '<tr>'
                    $('#oppDPagination').hide();
                    $('#oppIpdatastatus').show();
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
});
/*End opposition detail*/

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
    if (goToPage > oppTotCount || goToPage == 0) {
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

/*Start Check Detail available*/
var corDocAvail = "0";
var prDetailAvail = "0";
var examDocAvail = "0";
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
                    if (length > 0) {
                        examDocAvail = obj[0].detailAvailable;
                        corDocAvail = obj[1].detailAvailable;
                        prDetailAvail = obj[2].detailAvailable;
                    }
                    else {
                        corDocAvail = "0";
                        prDetailAvail = "0";
                        examDocAvail = "0";
                    }
                }
                else {
                    corDocAvail = "0";
                    prDetailAvail = "0";
                    examDocAvail = "0";
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
/*Start PR details*/
var prDetailAvailable = "0";
var totPRCount = 1;
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
                    if (length > 0) {
                        prDetailAvailable = "1";
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
                            
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
                                    totPRCount = totpage;
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
                        });
                        $("#bindIPRPropertyRights").html("").html(html);
                    }
                }
                else {
                    prDetailAvailable = "0";
                    html += '<tr><td colspan="2" align="center">' + "Data Not Found" + '</td></tr>';
                    $("#bindIPRPropertyRights").html("").html(html);
                }
                //$("#bindIPRPropertyRights").html("").html(html);
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

var prApplNo = "";
var cPageNo = "";

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

$(document).on("click", "#idPRDetails", function () {
    ViewPRDetails(globalApplNo, globalTradeId);
});


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
    if (goToPage > totPRCount || goToPage == 0) {
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

//New Function for sorting Data.

function GetClassList() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/IPR/GetIPRClassList1",
        dataType: 'json',
        success: function (response) {
            // var obj = JSON.parse(response);
            //  var obj = JSON.parse(response.Data.data);
            $("#searchclass").html("");
            // $("#searchclass").append("<option value=''>Select</option>");
            $(".ms-selectall").show();
            $.each(response, function (i, b) {

                /*$("#searchclass").append("<option value='" + b.name + "'>" + b.name + "</option>");*/
                /* $("#searchclass").append("<option value='" + b.name + "'>" + b.name + " " + "-" + " " + b.className + "</option>");*/
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
            $("#searchstatus").html("");
            //  $("#searchstatus").append("<option value=''>Select</option>");
            $(".ms-selectall").show();
            $.each(response, function (i, b) {


                $("#searchstatus").append($("<option></option>").val(b.name).text(b.name));

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
$(document).on('click', '#openviewaddedtrademarks', function () {
    trademarkId = $(this).attr("tradeid");
    downloadTradeId = "";
    var openApplNo = $(this).attr("openDocApplNo");
    ShowJudgementDocDetail(openApplNo);
    loadtrademarkdatabyiid(trademarkId);
    $('#tmdetailsmodal').attr('tradeiid', trademarkId);
    downloadTradeId = trademarkId;
});

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

$(document).on("click", "#idOpenTradeInfo", function () {
    $("#bindTrademarkDetails").empty();
    ViewTrademarkDetails(globalApplNo, globalTradeId);
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
                var AppNoWithPath = "";
                if (val.vJournalPath != "" && val.vJournalPath != null) {
                    AppNoWithPath = '(' + '<a href="' + val.vJournalPath + '" download="Journal Copy" target="_blank" style="cursor: pointer;">' + "Journal Copy" + '</a>' + ')'
                }
                var UsedSince = val.vUsedSince.replace('Used Since :', '');

                html = '<div class="trademark_details_info_table"><ul class="detail_info">'
                    + '<li><h5>TM Application No.</h5><span>' + val.vApplNo + ' ' + AppNoWithPath + '</span></li>'
                    + '<li><h5>Class</h5><span>' + val.vClass + '</span></li>'
                    + '<li><h5>Date of Application</h5><span>' + convertdate(val.dApplDate) + '</span></li>'
                    + '<li><h5>Mark</h5><span>' + val.vWordMark + '</span></li>'
                    + '<li><h5>User Detail/Used Since</h5><span>' + newconvertdate(UsedSince) + '</span></li>'
                    + '<li><h5>Certificate Details</h5><span>' + isNullCheck(val.CertificationDetails) + '</span></li>'
                    + '<li><h5>Valid Upto/Renewed Upto</h5><span>' + (val.dValidUpto === '1900-01-01T00:00:00' ? '' : convertdateValidUpto(val.dValidUpto)) + '</span></li>'
                    + '<li><h5>Proprietor\'s Name</h5><span>' + val.vProprietor + '</span></li>'
                    + '<li><h5>Proprietor Address</h5><span>' + isNullCheck(val.vProprietorAddress) + '</span></li>'
                    + '<li><h5>Agent Name</h5><span>' + val.Agent + '</span></li>'
                    + '<li><h5>Agent Address</h5><span>' + val.AgentAddress + '</span></li>'
                    + '<li><h5>Goods & Service Details</h5><span>' + val.dGSDescription + '</span></li>'
                    + '<li><h5>Publication Details</h5><span>' + isNullCheck(val.PublicationDetails) + '</span></li>';

                if (htmlContent !== "") {
                    html += '<li><h5>Judgement</h5><span><ul>' + htmlContent + '</ul></span></li>';
                }

                html += '<li><h5>Status</h5><span>' + val.vStatus + '</span></li>'
                    + '<li><h5>Image</h5><span><img src="' + imagePath + '/' + val.vClass + '/' + val.vApplNo + '.png" alt="Image Not Available" style="max-width:100%;height:auto;"></span></li>'
                    + '</ul></div>';

                /*+ '<tr><td>Image</td><td>:</td><td>' + imgUrl+'</td></tr>'*/
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
            $.each(obj, function (i, val) {
                htmlContent += '<li>' + '<a href="' + val.vLocalFile + '"  target="_blank" style="cursor: pointer;">' + "Judgement" + (i + 1) + '</a>' + '</li></br>'
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

$(document).on('click', '#oexcel', function () {


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
            '<span class="taskoutboxbtnicon" style="cursor:pointer;" id="exporttoexcelfile" pageno="' + i + '" type="excel">' +
            '<img src="/newassets/img/download.svg" alt="Download File" />' +
            '</span>' +
            '</li>' +
            '</ul></td>';

        html += '</tr>';

    }
    $("#printexport").html(html);
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
    window.location = encodeURI("/IPR/ViewSharedTrademarkExportoExcel?IPList=" + IPList + "&filtertradmark=" + filtertradmark + "&txtapplicationno=" + txtapplicationno
        + "&searchclass=" + searchclass + "&searchtype=" + searchtype + "&searchstatus=" + searchstatus + "&txtdateapplicationfrom=" + txtdateapplicationfrom
        + "&searchuserdetetail=" + searchuserdetetail + "&txtProprietor=" + txtProprietor + "&JurisdictionList=" + JurisdictionList
        + "&txtdateapplicationto=" + txtdateapplicationto + "&usedsincefrom=" + usedsincefrom + "&usedsinceto=" + usedsinceto + "&hearingFrmDate=" + hearingFrmDate + "&hearingToDate=" + hearingToDate + "&pagenum=" + pageno + "&pagesize1=10");

});



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


//Add dynamic email field
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

//Create dynamic email field
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
                    dynamicFieldCount = i;
                    var data = "";
                    var emailIdValue = result[i].EmailId;
                    data += "<div class='ec_bgAlert'>";
                    data += "<div id='addedDiv_" + dynamicFieldCount + "' style='display: flex; flex-direction: row; padding-top: 7px;'>";

                    // Email input
                    data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' value='" + emailIdValue + "' style='width:93%' class='inputFormat' placeholder='example@123.com' title=\"Please enter the receiver's mail address.\" />";

                    // Action buttons inside ul
                    data += "<ul class='table_action' style='align-items: center; margin-left: 10px; display: flex; padding-left: 0;'>";

                    // Edit button
                    data += "<li>";
                    data += "<div onclick='EditAlert_div(" + dynamicFieldCount + ")' class='Edit_div_wrapper'>";
                    data += "<div class='taskoutboxbtnicon' title='Edit'>";
                    data += "<img src='/newassets/img/editmatter.png'/>";
                    data += "</div>";
                    data += "</div>";
                    data += "</li>";

                    // Delete button
                    data += "<li>";
                    data += "<div id='showhide_" + dynamicFieldCount + "' style='display:none;' onclick='deleteAlert_div($(this))' class='delete_div pull-right'>";
                    data += "<div class='taskoutboxbtnicon' title='Delete'>";
                    data += "<img src='/newassets/img/delete.svg' alt='Delete' style='cursor:pointer; margin-left: 10px;' />";
                    data += "</div>";
                    data += "</div>";
                    data += "</li>";

                    data += "</ul>"; // End ul

                    data += "</div>"; // End addedDiv
                    data += "</div>"; // End ec_bgAlert
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

//Check dynamic email validation
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


$(document).on('input', '#emailtxtfortracker', function () {
    const getEmailVal = $(this).val();
    validateEmail(getEmailVal);
});

//Save dynamic email
var dynamicFieldCount = 0;
var checkData = false;
$(document).on("click", "#btn_SaveMail", function () {
    if (dynamicFieldCount == 0) {
        dynamicFieldCount = 1;
    }
    else {
        dynamicFieldCount = dynamicFieldCount + 1;
    }
    if (dynamicFieldCount < 5) {
        var data = "";
        data += "<div class='ec_bgAlert'>";
        data += "<div id='addedDiv_" + dynamicFieldCount + "' style='display: flex; flex-direction: row;'>";

        // Email input
        data += "<input type='email' id='emailTrackerId_" + dynamicFieldCount + "' style='width:93%' class='inputFormat' placeholder='example@123.com' title=\"Please enter the receiver's mail address.\" />";

        // Action buttons as ul > li
        data += "<ul class='table_action' style='align-items: center; margin-left: 10px; display: flex; padding-left: 0;'>";

        // Delete button
        data += "<li>";
        data += "<div id='showhide_" + dynamicFieldCount + "' style='display: none;' onclick='deleteAlert_div($(this))' class='delete_div'>";
        data += "<div class='taskoutboxbtnicon' title='Delete'>";
        data += "<img src='/newassets/img/delete.svg' alt='Delete' />";
        data += "</div>";
        data += "</div>";
        data += "</li>";

        data += "</ul>"; // End of actions
        data += "</div>"; // End of addedDiv
        data += "</div>"; // End of ec_bgAlert

        $('#addNewDiv').append(data);
        showField();
    }
    else {
        dynamicFieldCount = dynamicFieldCount - 1;
        alert("You Can't add more than 5 email");
    }
})
//Delete div section
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
//Show hide delete icon
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


$(document).on('click', '#btnEmailForTracker', function () {
    var finalData = [];
    var txtEmailId = $("#emailTrackerId_").val();
    IsEmailValidation(txtEmailId);
    if (checkValidMail == true) {
        alert("Please fill valid email:-" + txtEmailId);
        return false;
    }
    if (txtEmailId == "") {
        alert("Please fill valid email");
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
            alert('Your emails have been successfully stored!');
        },
        error: function (response) {
            alert('Something went wrong from our end!');
        },
        failure: function (response) {
            alert('Something went wrong from our end!')
        }
    });
});
function hideinfoModal() {

    $('#demo3').css('display', 'none');
}

/*Start Open document details*/
var docPageN = 1;
var docAppN = "";
$(document).on('click', '#opendocumentdetails', function () {
    docPageN = 1;
    var vApplNo = this.getAttribute('appid');
    docAppN = vApplNo;
    BindDocumentDetailForTrade(vApplNo, docPageN);
});


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

$(document).on("click", "#idOpenDocDetail", function () {
    OpenDocumentDetails(globalApplNo, globalTradeId);
});

$(document).on('click', '#docPaginate', function () {
    docPageN = $(this).attr("index");
    BindDocumentDetailForTrade(docAppN, docPageN);
});
var totDocCountDetail = 1;
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
                    $('#docPagination').show();
                    $('#docpdatastatus').hide();
                    $("#divalertlist tr").remove();
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
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
                                totDocCountDetail = totpage;
                                DocPaginationDetail(pageIndexN, totpage);
                            }
                        }

                        var path = val.vLocalFile;
                        html += '<tr><td>' + val.RowId + '</td>';
                        html += '<td>' + val.vDescription + '</td>';
                        html += `
                            <td>
                                <ul class="table_action">
                                    <li>
                                        <a href="${path}" download="${val.vDescription}" target="_blank" class="taskoutboxbtnicon" title="Download File">
                                            <img src="/newassets/img/download.svg" alt="Download File">
                                        </a>
                                    </li>
                                </ul>
                            </td>
                        `;

                    });
                }
                else {
                    $('#docPagination').hide();
                    $('#docpdatastatus').show();
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
    if (goToPage > totDocCountDetail || goToPage == 0) {
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
                changedocPage(ppageindex);
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

function changedocPage(page) {
    docPageN = page;
    BindDocumentDetailForTrade(docAppN, docPageN)
}
/*End Open document details*/

/*Start opposition document details*/
var oppDocPageN = 1;
var oppDocAppId = "";

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

$(document).on("click", "#idOpenOppDoc", function () {
    ViewOppDocDetails(globalApplNo, globalTradeId);
});


var totOppDetailCount = 1;
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
                        $('#OppdocPagination').show();
                        //$('#docOpppdatastatus').hide();
                        $('#docOpppdatastatus').css("display", "none");
                        $("#divalertlist tr").remove();
                        $.each(obj, function (i, val) {
                            if (i === 0) {
                                firstvalue = val.RowId;
                            }
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
                                    totOppDetailCount = totpage;
                                    OppDocPaginationDetail(oppPageIn, totpage);
                                }
                            }
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.vDescription + '</td>'
                            html += '<td><ul class="table_action">' +
                                '<li>' +
                                '<a class="taskoutboxbtnicon" href="' + val.vLocalFile + '" download="' + val.vDescription + '" target="_blank" style="cursor:pointer;">' +
                                '<img src="/newassets/img/download.svg" alt="Download File">' +
                                '</a>' +
                                '</li>' +
                                '</ul></td>';

                        });
                    }
                    else {
                        $('#OppdocPagination').hide();
                        //$('#docOpppdatastatus').show();
                        $('#docOpppdatastatus').css("display", "block");
                        //$('#docPagination').hide();
                    }
                }
                else {
                    $('#OppdocPagination').hide();
                    $('#docOpppdatastatus').css("display","block");
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
    if (goToPage > totOppDetailCount || goToPage == 0) {
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



/*End opposition document details*/

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


//*************Email*******************************

$(document).on('click', '#tmdetailsmodal', function () {
    $('#btnEmail').attr('tradeiid', $(this).attr('tradeiid'));
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
            //alert('Email Sent Successfully!');
            new PNotify({
                title: 'Success!',
                text: 'Email Sent Successfully!',
                type: 'success',
                delay: 3000
            });
        },

        failure: function (response) {
            alert('Email Sent Successfully!');
            new PNotify({
                title: 'Success!',
                text: 'Something went wrong Please try again!',
                type: 'error',
                delay: 3000
            });
        },

        error: function (response) {
            //alert('Email Sent Successfully!');
            new PNotify({
                title: 'Success!',
                text: 'Something went wrong Please try again!',
                type: 'error',
                delay: 3000
            });
        }
    });
});

examDocAvailable = "0";
var EPageIndex = 1;
var ExamApplNo = "";
var totalExamCount = 1;
function BindExamReportDocs(applNo, EPageIndex) {
    EPageIndex = 1;
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
                                    totalExamCount = totpage;
                                    ExamRenderPagination(EPageIndex, totpage);
                                }
                            }
                            var path = val.vLocalFile;
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.vDescription + '</td>';
                            html += `
                                    <td>
                                        <ul class="table_action">
                                            <li>
                                                <a href="${path}" download="${val.vDescription}" target="_blank" class="taskoutboxbtnicon" title="Download File">
                                                    <img src="/newassets/img/eye.svg" alt="Download File" />
                                                </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>`;



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
$(document).on("click", "#idExaminationDetails", function () {
    ViewExamDetails(globalApplNo, globalTradeId);
});

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
    $("#Examtxtgopage").val("");
    BindExamReportDocs(ExamApplNo, EPageIndex);
    $(".page-btnExam").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", "#ExamPrev", function () {
    if (EPageIndex > 1) {
        EPageIndex = EPageIndex - 1;
    }
    isExamRnd = true;
    $("#Examtxtgopage").val("");
    BindExamReportDocs(ExamApplNo, EPageIndex);

    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
});


$(document).on("click", "#ExamNext", function () {
    if (EPageIndex => 1) {
        EPageIndex = EPageIndex + 1;
    }
    isExamRnd = true;
    $("#Examtxtgopage").val("");
    BindExamReportDocs(ExamApplNo, EPageIndex);
    $(".page-btnExam").removeClass("active");
    $(".page-btnExam[data-page='" + EPageIndex + "']").addClass("active");
});

$(document).on("click", "#ExamDivGo", function () {
    let goToPage = parseInt($("#Examtxtgopage").val());
    if (!isNaN(goToPage)) {
        EPageIndex = goToPage;
    }
    if (goToPage > totalExamCount || goToPage == 0) {
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
var carDetailAvailable = "0";
var totCorrCountD = 1;
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
                        carDetailAvailable = "1";
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
                                    totCorrCountD = totpage;
                                    CorrRenderPagination(pageindex, totpage);
                                }
                            }

                            var path = val.FilePath;
                            html += '<tr><td>' + val.RowId + '</td>';
                            html += '<td>' + val.CorresNo + '</td>';
                            html += '<td>' + val.CorresDate + '</td>';
                            html += '<td>' + val.CorresSubject + '</td>';
                            html += '<td>' + val.DispatchNo + '</td>';
                            html += '<td>' + val.DispatchDate + '</td>';
                            html += '<td>' + ((val.HearingDate == null || val.HearingDate == '01/01/1900') ? '' : val.HearingDate) + '</td>';
                            html += '<td style="text-align:center;"><a href="' + path + '" download="' + val.CorresSubject + '" target="_blank" style="cursor: pointer;">' + '<img <img src="/newassets/img/view-icon.png" />' + '</a></td></tr>';
                            //html += `
                            //    <td>
                            //        <ul class="table_action">
                            //            <li>
                            //                <a href="${path}" download="${val.CorresSubject}" target="_blank" class="taskoutboxbtnicon" title="View File">
                            //                    <img src="/newassets/img/eye.svg" alt="View">
                                               
                            //                </a>
                            //            </li>
                            //        </ul>
                            //    </td></tr>
                            //`;


                        });
                        /*$("#bindIPRCorrespondence").html("").html(html);*/
                    }
                    else {
                        carDetailAvailable = "0";
                        html += '<tr><td colspan="7" align="center">' + "Data not found" + '</td></tr>';
                    }
                }
                else {
                    carDetailAvailable = "0";
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

var correspApplNo = "";
var cPageNo = "";
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

$(document).on("click", "#idCorrAndNotices", function () {
    ViewCorrespDetails(globalApplNo, globalTradeId);
});

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
    if (goToPage > totCorrCountD || goToPage == 0) {
        alert("Please enter a valid page number.");
        CPageIndex = 1;
        return false;
    }
    isCorrRnd = true;
    BindCorrespondenceDetails(correspApplNo, CPageIndex);
    $(".page-btnCorr").removeClass("active");
    $(".page-btnCorr[data-page='" + CPageIndex + "']").addClass("active");
});

    /*Correspondence Pagination End*/

/*End correspondence details*/
