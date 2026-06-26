var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, ppageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var start = "";
var end = "";
var fromdaterange = false;
var fromreminder = false;
var remindernoticeid = "";
var companycountdata = 0;
var countdata = 0;
var ocreate, oedit, odelete = "";
var SortedOrder = "";
var arrcolmenuseleciton = [];
var arrcolmenuselecitonfix = [];
var totalRecordCount = 0;
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var urltype = getUrlVars()["type"];
const statusClassMap = {
    "converted to matter": "Convertedmatter",
    "active": "active1",
    "settled": "Settled",
    "inactive": "InActive"
};
const priorityClassMap = {
    "low": "low",
    "medium": "medium",
    "high": "high",
};
$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $('#Delete_final').off('click').on('click', function () {

        var noticeid = $(this).data('noticeid');

        formdata = new FormData();
        formdata.append("NoticeId", EncodeText(noticeid))
        formdata.append("deleteflag", EncodeText("2"))
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/NoticeDelete",
            data: formdata,
            contentType: false,
            processData: false,
            success: function (result) {
                $('#myModalDeleteconfirmation').modal('hide');

                if (result) {
                    alert("Record deleted successfully.");
                    isRenderPage = false;
                    callapi();
                }
                else {
                    alert("Something went wrong.")
                }
            }
        })
    });

    $('#archivesingle_final').off('click').on('click', function () {
        var noticeid = $(this).data('noticeid');

        var formData = new FormData();
        formData.append("archivenoticeid", EncodeText(noticeid));
        formData.append("IsArchive", EncodeText(true));

        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/ArchiveNotice',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                $('#myModalmarkArchiveconfirmation').modal('hide');

                if (response) {
                    alert("Notice moved to archive successfully.");
                    isRenderPage = false;
                    callapi();
                } else {
                    alert("Something went wrong.");
                }
            },
            error: function () {
                $('#myModalmarkArchiveconfirmation').modal('hide');
                alert("Something went wrong.");
            }
        });
    });

    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });

    });
    if (urltype == "1") {
        $("#dynamicnotiheader").html("notices - converted to case");
    }
    else if (urltype == "2") {
        $("#dynamicnotiheader").html("settled notice");
    }
    else {
        $("#dynamicnotiheader").html("List of Notices - Received");
    }
    $("#alertbeforeincaseallddl").select2();
    GetNoticestatusForDropdown();
    bindcalender();
    $('#clearrange').click(function () {
        //do something, like clearing an input
        start = "";
        end = "";
        $('#reportrange span').html("");
        $("#clearrange").hide();
        callapi();
    });
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    jQuery('#Modesofdeleverypost').multiselect({
        /* columns: 1,*/
        search: true,
        selectAll: true
    });



    /*Pagination Start*/


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        PageNumber = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        PageNumber = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        PageNumber = setPageNo;
        callapi();

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        PageNumber = setPageNo;
        callapi();
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
});

/*Bind calender details*/
function bindcalender() {
    //start = moment();
    //end = moment();
    function cb(start, end) {
        try {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        catch (er) {
        }
    }
    /*Date range*/
    $('#reportrange').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
    cb(start, end);
}

/*Get received notice details by date range*/
function fnsearchbydate(e) {
    var fromdate = $("#rangefromdate").val();
    var rangetodate = $("#rangetodate").val();
    if (fromdate == "") {
        alert("Please seclect from date!");
        return false;
    }
    if (rangetodate == "") {
        alert("Please seclect to date!");
        return false;
    }
    if (rangetodate < fromdate) {
        alert("To date is greater than from date!");
        return false;
    }
    start = formatDateNew(fromdate);
    end = formatDateNew(rangetodate);
    fromdaterange = true;
    $("#btclear").show();
    isRenderPage = false
    callapi();
}
/*Clear input date range*/
function fnclearinput(e) {
    $("#rangefromdate").val('');
    $("#rangetodate").val('');
    $("#btclear").hide();
    fromdaterange = false;
    start = "";
    end = "";
    isRenderPage = false;
    callapi();
}
/*Format date rage*/
function formatDateNew(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}
function changePage(page) {
    PageNumber = page;
    isRenderPage = false;
    callapi();
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});

/*Get received notice details by page number*/
$(document).on('click', '#pgetdatabypagenum', function () {
    ppageindex = $("#ppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
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
$(document).on('click', '#ppaginate', function () {
    ppageindex = $(this).attr("index");
    PageNumber = ppageindex;
    isRenderPage = false;
    callapi();
});
var approvalnoticeid = "";
function SendApproval(noticeid) {
    approvalnoticeid = noticeid;
    $("#AssignModal").modal('show');
}

/*Create reply notice of received notice*/
function EditNoticeReply(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice"
    sessionStorage.setItem("ReplyNoticeId", noticeid)
}
$(document).ready(function () {
    $(".assignto").change(function () {
        Getmanagerlist();
    })
    /*Get manager list*/
    function Getmanagerlist() {
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/PartnerList",
            dataType: 'json',
            async: false,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#bindusr").html("");
                $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
                var checkboxval = $("input[name='assignee']:checked").val();
                if (response != null) {
                    $.each(response.Data, function (key, value) {
                        if (roleid != "1") {
                            if (checkboxval == "manager") {
                                if (value.RoleId == 2) {
                                    $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                                }
                            }
                            else if (checkboxval == "client") {
                                if (value.RoleId == 3) {
                                    $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                                }
                            }
                        }
                        else {
                            if (checkboxval == "manager") {
                                if (value.RoleId == 2) {
                                    $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                                }
                            }
                            else if (checkboxval == "client") {
                                if (value.RoleId == 3) {
                                    $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                                }
                            }
                        }
                    })
                }
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    }
    /*Assign received notice to user for share feedback*/
    $("#assignnoticebtn").click(function () {
        if (confirm("Are you sure you want to send this Notice?")) {
            var receiverid = $("#bindusr").val();
            if (receiverid == "0" || receiverid == "" || receiverid == "undefind" || receiverid == "Please Select" || receiverid == null) {
                alert("Alert ! Please Select User.")
                return false
            }
            var noticeid = approvalnoticeid;
            var approvarType = "";
            var checkboxval = $("input[name='assignee']:checked").val();
            if (checkboxval == "manager") {
                approvarType = 2;
            }
            else if (checkboxval == "client") {
                approvarType = 3;
            }
            var formData = new FormData();
            formData.append("receiverid", EncodeText(receiverid));
            formData.append("noticeid", EncodeText(noticeid));
            formData.append("approvarType", EncodeText(approvarType));
            formData.append("multipleNoticeArray", arrayforselectedrow);
            $.ajax({
                type: "POST",
                url: "/api/NoticeNew/NoticeAssign",
                data: formData,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result.Data == true) {
                        alert("Notice shared successfully.")
                    }
                    else {
                        alert("Notice is already shared.")
                    }
                    $("#AssignModal").modal("hide");
                    window.location.reload();
                    arrayforselectedrow = [];
                }
            })
        }
    })
    var $selectAll = $("input:radio[name=selectlinktype]");
    $selectAll.on("change", function () {
        if ($(this).val() == "newmatter") {
            $("#dvlinktocase").hide();
            $("#dvcreatecase").show();
        }
        else {
            $("#dvlinktocase").show();
            $("#dvcreatecase").hide();
        }
    });
    $("#CreateNoticetoMatter").click(function () {
        var noticeids = $(this).attr("data-case");
        var IsLinkToMatter = $(this).attr("IsLinkToMatter");
        if (IsLinkToMatter == "1") {
            alert("Already linked to matter");
            return false;
        }
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/CreateCase";
        url_redirect({
            url: urls,
            method: "post",
            data: { "NoticeId": noticeids }
        });
    });
    /*Save link to matter*/
    $("#savelinkmatter").click(function () {
        var matterids = $("#livecaseidhide").val();
        var noticeids = $(this).attr("data-case");
        if (matterids == "") {
            alert("please select matter");
            return false;
        }
        var formData = new FormData();
        formData.append("matterid", EncodeText(matterids));
        formData.append("noticeid", EncodeText(noticeids));
        formData.append("type", EncodeText("NewNotice"));
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/matterApi/SaveCaseForNoticeMAP", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (parseInt(response.Data) > 0) {
                        alert("matter added successfully.");
                        $("#livecaseidhide,#mattersforlink2").val("");
                        $("#closelinkmatter").click();
                        isRenderPage = false;
                        callapi();
                        closeload();
                    }
                    else if (String(response.Data) == "-1") {
                        alert("Already linked to matter");
                        closeload();
                    }
                    else {
                        alert(response.Data);
                        closeload();
                    }
                },
                failure: function (response) {
                    alert(data.responseText);
                    closeload();
                },
                error: function (response) {
                    alert(data.responseText);
                    closeload();
                }
            });
    });
    $(document).on("click", "#linkmatter", function () {
        $("#livecaseidhide,#mattersforlink2").val("");
        var ids = $(this).attr("data-val");
        var IsLinkToMatter = $(this).attr("IsLinkToMatter");
        $("#savelinkmatter,#CreateNoticetoMatter").attr("data-case", ids).attr("IsLinkToMatter", IsLinkToMatter);
        $('#myModallinkcase').modal({ show: true });
        // bindcase();
    });
    /*Save closure date details*/
    $("#saveclosuedate").click(function () {
        var closuredate = $("#dateofclosure").val();
        var ddlnoticestatus = $("#ddlnoticestatus").val();
        if (ddlnoticestatus == "" || ddlnoticestatus == "notice status") {
            alert("Please select notice status")
            return false;
        }
        var formData = new FormData();
        formData.append("closurenoticeid", EncodeText(closurenoticeid));
        formData.append("closuredate", EncodeText(closuredate));
        formData.append("ddlnoticestatus", EncodeText(ddlnoticestatus));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/NoticeClosure',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                if (response) {
                    alert("Status updated successfully.");
                    $('#ActualclosurModal').modal('hide');
                    isRenderPage=false;
                    callapi();
                }
                else {
                    alert("Something went wrong.")
                }
            },
            error: function (response) {
                alert("Something went wrong.")
            }
        })
    })
});
$('div .dropdown-menu').on('click', function (event) {
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});
/*Open loader*/
function openload() {
    $('#myOverlay').css("display", "block");
}
/*Close loader*/
function closeload() {
    $('#myOverlay').css("display", "none");
}
//for redirect to reciver filter
function fnfilterdata(param, paramid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeNew/Filter";
    sessionStorage.setItem("param", param);
    sessionStorage.setItem("paramid", decodeURIComponent(paramid));
}
var closurenoticeid = "";
function ClouserNotice(noticeid) {
    closurenoticeid = noticeid;
    $('#markstatusreset')[0].reset();
    $("#ActualclosurModal").modal('show');
    var formData = new FormData();
    formData.append("closurenoticeid", EncodeText(closurenoticeid));
}
$(document).on("change", "#ddlnoticetypess", function () {
    isRenderPage = false;
    callapi();
});
$(document).on("change", "#ddlnoticestatusss", function () {
    isRenderPage = false;
    callapi();
});
// for custmized field data binding start
  setTimeout(function () {
ploadtabledata();
             },4000);

/*Capitalize custom field first letter*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var countcustomfoeld = 0;
/*Load custom field details*/
function ploadtabledata() {
    var $table = '';
    var $header = '';
    var $head1 = '';
    var dt = '';
    var q1 = 2;
    var Iscustomflag = 0;
    var columnvalue = 0;
    var sort = 18;
    var type = 13;
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
                    Iscustomflag = Iscustomflag + 1;
                    columnvalue = columnvalue + 1;
                    sort = sort + 1;
                    $header += '<th  class="Class' + q1 + '"><div class="thbg"><div style="float:left;width:80%"><input class="" id=customfieldsfilter' + q1 + ' type="text" placeholder="' + val.FieldName + '"  name="Class' + q1 + '" disabled style="width:100%" ></div></div></th>';
                    //End
                    option += '<li data-subject="' + capitalizeFirstLetter(val.FieldName) + '"><input  class="chkdhide"  type="checkbox" value="' + val.FieldName + '"  name="Class' + q1 + '" ><a href="#" class="small" data-value="option' + val.FieldName + '" tabIndex="-1">' + val.FieldName + '</a></li>';
                });
                $header += '<th class="actioncase"><div class="thbg">Action</div></th>';
                $('#headrow1').append($header);
                $("#od1").append(option);
                SortData();
                var option1 = '<li><input id="select_allcfield"   type="checkbox"   > Select All</a></li>';
                $("#od1").append(option1);
            }
            else {
            }
        },
        error: function () {
            alert('Error!');
        }
    });
    $.when(rt1).then(function (data, textStatus, jqXHR) {
        if (urltype == "status" || urltype == "type" || urltype == "subject") {
            isRenderPage = false;
            callapi();
        }
        else {
            //  setTimeout(function () {
            isRenderPage = false;
            callapi();
            //  },2000);
        }
    });
}

function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
// Function to sort Data
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od1").
            appendChild(e));
}
function Custommore(valcol1, qty) {
    var htmlNew = "";
    if (valcol1.length > 60) {
        htmlNew += '<span class="comment more" style="">' + valcol1.substring(0, 60) + '</span>'
        htmlNew += '<span data-toggle="collapse" data-target="#dtn2' + qty + '" style="color:black;cursor:pointer"> more</span>'
        htmlNew += ' <div id="dtn2' + qty + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: inherit;border-radius: 10px;left:65%;">'
        htmlNew += '<button type ="button" class="close" data-toggle="collapse" data-target="#dtn2' + qty + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
        htmlNew += '' + valcol1 + ''
        htmlNew += '</div>'
    }
    else {
        htmlNew += valcol1;
    }
    return htmlNew;
}
//Get received notice details
function callapi() {
    openload();
    var html = '';
    if (PageNumber == "") {
        PageNumber = 1;
    }
    var notistatus = $('input[name=statustype]:checked').val();
    var NoticeSubjectsrh = $("#NoticeSubjectsrh").val();
    var Noticetitsrch = $("#Noticetitsrch").val();
    var ddlnoticetypess = $("#ddlnoticetypess").val();
    var ddlnoticestatusss = $("#ddlnoticestatusss").val();
    var SenderNameSrch = $("#NoticeeendersNametxt").val();
    var othdetailsofsender = $("#othdetailsofsender").val();
    if (ddlnoticetypess == null) {
        ddlnoticetypess = "";
    }
    if (ddlnoticestatusss == null) {
        ddlnoticestatusss = "";
    }
    if (SenderNameSrch == null) {
        SenderNameSrch = "";
    }
    if (Noticetitsrch == null) {
        Noticetitsrch = "";
    }
    if (NoticeSubjectsrh == null) {
        NoticeSubjectsrh = "";
    }
    if (othdetailsofsender == null) {
        othdetailsofsender = "";
    }
    var formData = new FormData();
    formData.append("ColumName", EncodeText(othdetailsofsender));
    formData.append("SortedOrder", EncodeText(SortedOrder));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("fromdaterange", EncodeText(fromdaterange));
    formData.append("startdate", EncodeText(start));
    formData.append("enddate", EncodeText(end));
    formData.append("fromreminder", EncodeText(fromreminder));
    formData.append("NoitceId", EncodeText(NoticeId));
    formData.append("SearchValue", EncodeText(Noticetitsrch));
    formData.append("NoticeSubjectsrh", EncodeText(NoticeSubjectsrh));
    formData.append("ddlnoticetypess", EncodeText(ddlnoticetypess));
    formData.append("ddlnoticestatusss", EncodeText(ddlnoticestatusss));
    formData.append("SenderNameSrch", EncodeText(SenderNameSrch));
    formData.append("CaseNoticeStatus", EncodeText(ddlnoticestatusss));
    $.ajax({
        type: "POST",
        url: '/api/NoticeReceived/ReceivedNoticeList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            closeload();
            $("#Rejoindertablevalue").html("");
            $("#listingTablefooter1").html("");
            $("#rejoindernonotice").html("");
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            if (response == "") {
                document.querySelector(".pagination").style.display = "none";
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

               var htmls = '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No Records found</h4>' +
                    '<p>No Records found.</p>' +
                    '</div>';

                $("#rejoindernonotice").append(htmls);
                return false;
            }
            else {
                document.querySelector(".pagination").style.display = "flex";

                if (1 == 1) {
                    var qty = 0;
                    $.each(response, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.RowId;
                        }
                        var totpage = 0;
                        if (i === (response.length - 1)) {
                            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });
                            var totdata = a.TotalRows;
                            $('#tonotice').text(totdata);
                            $('#setNotice').text(a.SetteldCount);
                            $('#contomatNotice').text(a.ConvertedtoMatter);
                            //For Total Grid Count
                            $("#AllNoticeRCount").text("(" + totdata + ")");
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (PageNumber == totpage) {
                                $('#next').hide();
                                //$('#next').css("display", "none");
                                $('#prev').css("display", "block"); s
                            }
                            else {
                                $('#next').css("display", "block");
                            }
                            if (PageNumber == 1) {
                                $('#prev').css("display", "none");
                            }
                            else {
                                $('#prev').css("display", "block");
                            }

                            if (isRenderPage == false) {
                                totalRecordCount = totpage;
                                renderPagination(PageNumber, totpage);
                            }




                        }
                        oedit = a.oedit;
                        odelete = a.odelete;
                        ocreate = a.ocreate;
                        var span = document.createElement('span');
                        span.innerHTML = a.CreateRejoinder;
                        var trcolordata = "";
                        var d1 = new Date();
                        var d2 = new Date(a.DueDateOfNotice);
                        var trval = "";
                        if ((dateFormat(new Date()) == dateFormat(new Date(a.DueDateOfNotice)))) {
                            trval = "<tr class='tbltrcls " + a.NoticeID + "' Id='reminderhighlighcls'>";
                        }
                        else {
                            trval = "<tr class='tbltrcls " + a.NoticeID + "'>";
                        }
                        html += trval;
                        html += "<td><input type='checkbox' name='checkAll' class='checkSingle' value='" + a.NoticeID + "'></td>";
                        html += "<td>" + a.RowId + "</td>";
                        if (a.IsReplyReceivedCount > 0) {
                            html += "<td  class='sendernames'>" + a.SendersName + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor:pointer; ' onclick=ViewMoreItem('" + a.NoticeID + "','" + (a.CaseStatus) + "')></span></td>";
                        } else {
                            html += "<td  class='sendernames'>" + a.SendersName + "</td>";
                        }
                        html += "<td class='rejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                        html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                        html += "<td class='dateofcreatingrejoinder'>" + (a.DateofNotice == null ? ' ' : dateFormat(new Date(a.DateofNotice))) + "</td>";
                        html += "<td class='dateofserviceofnotice'>" + (a.DateofServiceofNotice == null ? ' ' : dateFormat(new Date(a.DateofServiceofNotice))) + "</td>";
                        if (a.DueDateOfNotice == "1900-01-01T00:00:00") {
                            html += "<td class='DuedateOfNotice'></td>";
                        }
                        else {
                            html += "<td class='DuedateOfNotice'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                        }
                        if (a.CreateRejoinder.length > 0) {
                            html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReceivedNotice") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                        }
                        else {
                            html += "<td  class='remark'>" + span.innerText + "</td>";
                        }
                        const statusKey = (a.CaseStatus || "").toLowerCase();
                        if (statusClassMap[statusKey]) {
                            html += `<td class="pending"><div class="status_badge"><span class="${statusClassMap[statusKey]}"></span>${a.CaseStatus || ""}</div></td>`;
                        }
                        else {
                            html += "<td class='pending'>" + (a.CaseStatus == null ? "" : a.CaseStatus) + "</td>";
                        }
                        html += "<td class='statutory'>" + a.NoticeType + "</td>";
                        html += "<td class='noticesubject'>" + a.RejoinderSubject + "</td>";
                        /*Client user approval END*/
                        // html += "<td class='dateofcreatingrejoinder'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                        // html += "<td class='dateofrejoinder'>" + (a.DateofRejoinder == null ? ' ' : dateFormat(new Date(a.DateofRejoinder))) + "</td>";
                        html += "<td  class='CreatedByName'>" + a.CreatedByName + "</td>";
                        html += "<td class='modeofreceipt'>" + a.ModeofReceipt + "</td>";
                        html += "<td class='rejoinderthrough'>" + a.NoticeThrough + "</td>";
                        const priorityKey = (a.Criticality || "").toLowerCase();
                        if (priorityClassMap[priorityKey]) {
                            html += `<td class="criticality"><div class="status_badge"><span class="${priorityClassMap[priorityKey]}"></span>${a.Criticality || ""}</div></td>`;
                        }
                        else {
                            html += "<td  class='criticality'>" + (a.Criticality == 0 ? '' : a.Criticality) + "</td>";
                        }                        html += "<td class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                        html += "<td class='amountclaimed'>" + (a.AmountClaimed == '0' ? '' : a.AmountClaimed) + "</td>";
                        html += "<td  class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                        html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                        html += "<td  class='SendersAddress'>" + a.SendersAddress + "</td>";
                        html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                        html += "<td class='tags'>" + a.Tag + "</td>";
                        html += "<td  class='ReferenceNumber'>" + a.NoticeReference + "</td>";
                        html += "<td  class='InternalNumber'>" + a.IntNoticeReference + "</td>";
                        if (a.ActualDateOfClosure == null) {
                            html += "<td class='closdate'></td>";
                        }
                        else {
                            html += "<td class='closdate'>" + a.ActualDateOfClosure.split() + "</td>";
                        }
                        if (a.IsFileAvailable) {
                            html += '<td class="attachment"><i aria-hidden="true" id="noticerelevantdoc" id-type="ReceivedNotice" style="cursor:pointer;" id-val="' + a.NoticeID + '"><img src="/newassets/img/folder-icon.png" /></i></td>'
                        }
                        else {
                            html += '<td class="attachment"></td>';
                        }
                        //for custmized fields start
                        var countcf = countcustomfoeld;
                        for (var str = 1; str <= countcf; str++) {
                            if (str == 1) {
                                if (a.col1 == "") {
                                    html += "<td  class='class3'><span>&nbsp;</span></td>";
                                }
                                else if (a.col1 == null) {
                                    html += "<td  class='class3'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col1, qty + 'a' + str);
                                    html += "<td  class='class3'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 2) {
                                if (a.col2 == "") {
                                    html += "<td  class='class4'><span>&nbsp;</span></td>";
                                }
                                else if (a.col2 == null) {
                                    html += "<td  class='class4'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col2, qty + 'a' + str);
                                    html += "<td  class='class4'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 3) {
                                if (a.col3 == "") {
                                    html += "<td  class='class5'><span>&nbsp;</span></td>";
                                }
                                else if (a.col3 == null) {
                                    html += "<td  class='class5'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col3, qty + 'a' + str);
                                    html += "<td  class='class5'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                    // $row.append($('<td class="class5"  />').html("<span>" + checkdatetimecustom(htmlNew)));
                                }
                            }
                            if (str == 4) {
                                if (a.col4 == "") {
                                    html += "<td  class='class6'><span>&nbsp;</span></td>";
                                }
                                else if (a.col4 == null) {
                                    html += "<td  class='class6'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col4, qty + 'a' + str);
                                    html += "<td  class='class6'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 5) {
                                if (a.col5 == "") {
                                    html += "<td  class='class7'><span>&nbsp;</span></td>";
                                }
                                else if (a.col5 == null) {
                                    html += "<td  class='class7'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col5, qty + 'a' + str);
                                    html += "<td  class='class7'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 6) {
                                if (a.col6 == "") {
                                    html += "<td  class='class8'><span>&nbsp;</span></td>";
                                }
                                else if (a.col6 == null) {
                                    html += "<td  class='class8'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col6, qty + 'a' + str);
                                    html += "<td  class='class8'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 7) {
                                if (a.col7 == "") {
                                    html += "<td  class='class9'><span>&nbsp;</span></td>";
                                }
                                else if (a.col7 == null) {
                                    html += "<td  class='class9'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col7, qty + 'a' + str);
                                    html += "<td  class='class9'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 8) {
                                if (a.col8 == "") {
                                    html += "<td  class='class10'><span>&nbsp;</span></td>";
                                }
                                else if (a.col8 == null) {
                                    html += "<td  class='class10'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col8, qty + 'a' + str);
                                    html += "<td  class='class10'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 9) {
                                if (a.col9 == "") {
                                    html += "<td  class='class11'><span>&nbsp;</span></td>";
                                }
                                else if (a.col9 == null) {
                                    html += "<td  class='class11'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col9, qty + 'a' + str);
                                    html += "<td  class='class11'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 10) {
                                if (a.col10 == "") {
                                    html += "<td  class='class12'><span>&nbsp;</span></td>";
                                }
                                else if (a.col10 == null) {
                                    html += "<td  class='class12'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col10, qty + 'a' + str);
                                    html += "<td  class='class12'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 11) {
                                if (a.col11 == "") {
                                    html += "<td  class='class13'><span>&nbsp;</span></td>";
                                }
                                else if (a.col11 == null) {
                                    html += "<td  class='class13'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col11, qty + 'a' + str);
                                    html += "<td  class='class13'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 12) {
                                if (a.col12 == "") {
                                    html += "<td  class='class14'><span>&nbsp;</span></td>";
                                }
                                else if (a.col12 == null) {
                                    html += "<td  class='class14'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col12, qty + 'a' + str);
                                    html += "<td  class='class14'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 13) {
                                if (a.col13 == "") {
                                    html += "<td  class='class15'><span>&nbsp;</span></td>";
                                }
                                else if (a.col13 == null) {
                                    html += "<td  class='class15'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col13, qty + 'a' + str);
                                    html += "<td  class='class15'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 14) {
                                if (a.col14 == "") {
                                    html += "<td  class='class16'><span>&nbsp;</span></td>";
                                }
                                else if (a.col14 == null) {
                                    html += "<td  class='class16'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col14, qty + 'a' + str);
                                    html += "<td  class='class16'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                            if (str == 15) {
                                if (a.col15 == "") {
                                    html += "<td  class='class17'><span>&nbsp;</span></td>";
                                }
                                else if (a.col15 == null) {
                                    html += "<td  class='class17'><span>&nbsp;</span></td>";
                                }
                                else {
                                    var htmlNew = Custommore(a.col15, qty + 'a' + str);
                                    html += "<td  class='class17'><span>" + checkdatetimecustom(htmlNew) + "</td>";
                                }
                            }
                        }
                        // END
                        if (roleid == "3") {
                            html += '<td></td>';
                        }
                        else {
                            if (String(a.IsLinkToMatter) == "1") {
                                html += "<td><a style='cursor:pointer;' data-val='" + a.NoticeID + "'  title='View Matter Dashboard' id='transferpage' href='javascript:void()' sno='" + a.MatterId + "'><img src='/newassets/img/connect-icon.png' /></a>" + '' + '<a style="cursor:pointer;" onclick="MoveToArchive(\'' +
                                    a.NoticeID + '\',\'' + a.NoticeTitle + '\')" title="Archive">' +
        '<img src="/newassets/img/archive-icon.png"></a>' + "</td>";
                            }
                            else if (String(a.CaseStatus) == "Converted to Matter") {
                                if ($('#hdnLMPack').val() == 'display:unset') {
                                    html += "<td><a style='cursor:pointer;' data-val='" + a.NoticeID + "' IsLinkToMatter ='" + a.IsLinkToMatter + "' id='linkmatter' title='Connect to Matter'><img src='/newassets/img/connect-icon.png' /></a>" + '' + '<a style="cursor:pointer;" onclick="MoveToArchive( \'' +
                                        a.NoticeID + '\',\'' + a.NoticeTitle + '\')" title="Archive">' +
        '<img src="/newassets/img/archive-icon.png"></a>' + "</td>";
                                }
                                else {
                                    html += "<td><a style='cursor:pointer;' data-val='" + a.NoticeID + "' IsLinkToMatter ='" + a.IsLinkToMatter + "' id='linkmatter1' title='Converted to matter'><img src='/newassets/img/connect-icon.png' /></a>" + '' + '<a style="cursor:pointer;" onclick="MoveToArchive( \'' +
                                        a.NoticeID + '\',\'' + a.NoticeTitle + '\')" title="Archive">' +
        '<img src="/newassets/img/archive-icon.png"></a>' + "</td>";
                                }
                            }
                            else if (String(a.CaseStatus) == "Settled") {
                                html += "<td><div></div>" +
                                    '<a style="cursor:pointer;" onclick="MoveToArchive( \'' +
                                    a.NoticeID + '\',\'' + a.NoticeTitle + '\')" title="Archive">' +
                                    '<img src="/newassets/img/archive-icon.png"></a>' +
                                    "</td>";

                            }
                            else {
                                html += '<td><ul class="action-ul">';
                                if (oedit == "1") {
                                    html += '<li><a style="cursor:pointer;"  onclick=EditReceivedNotice("' + a.NoticeID + '") title="Edit Notice"><img src="/newassets/img/edit-icon.png" /></a></li>';
                                }
                                if (ocreate == "1") {
                                    html += '<li><a style="cursor:pointer;" onclick=AddCreateReply("' + a.NoticeID + '") title = "Add Details : Reply To Notice Received" ><img src="/newassets/img/viewmore-icon.png" /></a></li>';
                                }
                                if (odelete == "1") {
                                    html += '<li><a style="cursor:pointer;" onclick="ConfirmDelete(\'' +
                                        a.NoticeID + '\')" title="Delete">' +
                                        '<img src="/newassets/img/deletecasesingle-icon.png" /></a></li>';
                                }
                                html += '<li><div class="dropdown">' +
                                    '<button class="dropdown-toggle" id="menu1" type="button" data-toggle="dropdown" title="More Action" style="border: none;background: transparent;margin: 0;padding: 0;">' +
                                    '<img src="/newassets/img/more-action.png" height="32" width="32">' +
                                    '</button>' +
                                    '<ul class="dropdown-menu action-more" role="menu" aria-labelledby="menu1">' +
                                    '<li><a href="#" style="cursor:pointer;" onclick="SendApproval(\'' + a.NoticeID + '\')" title="Share Notice"><span style="padding:0 3px 0 0;"><img src="/newassets/img/share-07.png" /></span>Share Notice</a></li>' +
                                    '<li><a href="#" style="cursor:pointer;" onclick="ClouserNotice(\'' + a.NoticeID + '\')" title="Mark Status"><span style="padding:0 3px 0 0;"><img src="/newassets/img/mark-status.png" /></span>Mark Status</a></li>' +
                                    '<li><a href="#" style="cursor:pointer;" onclick="DocumnetSend(\'' + a.NoticeID + '\')" title="Upload Document"><span style="padding:0 3px 0 0;"><img src="/newassets/img/uploaddocument-icon.png" /></span>Upload Document</a></li>' +
                                    '<li><a href="#" onclick="fnsetnotificationalert(\'' + a.NoticeID + '\', \'Received\')" title="Set Alert"><span style="padding:0 3px 0 0;"><img src="/newassets/img/bell-01.png" /></span>Set Alert</a></li>' +
                                    '<li><a href="#" style="cursor:pointer;" onclick="MoveToArchive( \'' + a.NoticeID + '\',\'' + a.NoticeTitle + '\')" title="Archive"><span style="padding:0 3px 0 0;"><img src="/newassets/img/archive.png" /></span>Archive</a></li>' +
                                    '<li><a href="#" style="cursor:pointer;" onclick="fnviewlog(\'' + a.NoticeID + '\', \'3\')" title="View Feedback"><span style="padding:0 3px 0 0;"><img src="/newassets/img/vewdetails.png" /></span>View Feedback</a></li>' +
                                    '</ul>' +
                                    '</div></li>';

                                html += '</ul></td>';
                            }
                        }
                        html += "<tr>";
                    });
                    $("#Rejoindertablevalue").append(html);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                }
            }
        },
        error: function (xhr) {
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

            document.querySelector(".pagination").style.display = "none";
            alert('error');
        }
    })
};


//Pagination
var isRenderPage = false;
var totalPageRec = "";
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;

    let paginationHtml = '';
    let maxVisible = 4;
    let delta = 2;
    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    }
    else {
        paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

        let start = Math.max(2, pageindex - delta);
        let end = Math.min(totPages - 1, pageindex + delta);
        if (pageindex <= maxVisible) {
            start = 2;
            end = maxVisible;
        }

        if (pageindex >= totPages - maxVisible + 1) {
            start = totPages - maxVisible + 1;
            end = totPages - 1;
        }
        if (start > 2) paginationHtml += `<span class="dots">...</span>`;
        for (let i = start; i <= end; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
        paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
    }
    $("#pageNumbers").html(paginationHtml);
    $("#prev").toggleClass("disabled", pageindex === 1);
    $("#next").toggleClass("disabled", pageindex === totPages);
    isRenderPage = true;
}



function checkdatetimecustom(str2) {
    var patt2 = /[0-9]*-[0-9]*-[0-9]*T[0-9]*\:[0-9]*/m;
    var patt3 = /[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/m;
    var patt4 = /[0-9]*-[0-9]*-[0-9]* [0-9]*\:[0-9]*/m;
    if (str2 != null) {
        var result = str2.match(patt2);
        var result1 = str2.match(patt3);
        var result4 = str2.match(patt4);
        if (result != null && String(result).length == "16") {
            var result3 = checkdatetimecustomdt(result);
            return result3;
        }
        else if (result4 != null && String(result4).length == "16") {
            var result4 = checkdatetimecustomdt(result4);
            return result4;
        }
        else if (result1 != null && String(result1).length == "10") {
            var result31 = formatDatetoIST(result1);
            return result31;
        }
        else {
            return str2;
        }
    }
}

function checkdatetimecustomdt(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let current_datetime = new Date(date)
    let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear() + " / " + addZero(current_datetime.getHours()) + ":" + addZero(current_datetime.getMinutes()) + ":" + addZero(current_datetime.getSeconds())
    return formatted_date;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/*Get document details by Id*/
function DocumnetSend(noticeid) {
    var formData = new FormData();
    formData.append("docnoticeid", EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/GetDocumnetDetailsById',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            //transfer page to perticular
            var transferid = response.Data.dirtoken;
            if (transferid != "") {
                var fcode5 = localStorage.getItem("FirmCode");
                var urls = "/" + fcode5 + "/azure/DirectoryList/1";
                url_redirect({
                    url: urls,
                    method: "post",
                    data: { "token": transferid }
                });
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
/*Move to archive notice*/
function MoveToArchive(noticeid,ntitleDetail) {

    // Store the notice ID in a data attribute on the confirm button
    $('#archivesingle_final').data('noticeid', noticeid);

    // Optionally set the matter name in the modal
    $('#id_Archivematternames').text(ntitleDetail); // Replace or format as needed

    // Show the modal
    $('#myModalmarkArchiveconfirmation').modal('show');
}
//function MoveToArchive(noticeid) {
//    if (confirm("Are you sure you want to archive this notice?")) {
//        var formData = new FormData();
//        formData.append("archivenoticeid", EncodeText(noticeid));
//        formData.append("IsArchive", EncodeText(true));
//        $.ajax({
//            type: "POST",
//            url: '/api/NoticeNew/ArchiveNotice',
//            contentType: false,
//            processData: false,
//            data: formData,
//            success: function (response) {
//                if (response) {
//                    alert("Notice move to archive successfully.");
//                    isRenderPage = false;
//                    callapi();
//                }
//                else {
//                    alert("Something went wrong.")
//                }
//            },
//            error: function (response) {
//                alert("Something went wrong.")
//            }
//        })
//    }
//}
$(document).on('change', '#select_allcfield', function () {
    if ($(this).is(':checked')) {
        $('.chkdhide').each(function () {
            if ($(this).prop('checked')) {
                var column = "." + $(this).attr("name");
                $(column).toggle();
            }
        });
    }
    else {
    }
    $(".chkdhide").prop('checked', $(this).prop('checked'));
    $('.chkdhide').each(function () {
        var column = "." + $(this).attr("name");
        if (String(column) != "undefined") {
            if ($(this).prop('checked')) {
                arrcolmenuseleciton.push($(this).attr("name"));
            }
            else {
                arrcolmenuseleciton.splice($.inArray($(this).attr("name"), arrcolmenuseleciton), 1);
            }
            $(column).toggle();
        }
    });
    isRenderPage = false;
    callapi();
});

/*Add create reply*/
function AddCreateReply(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid;
    sessionStorage.removeItem("ReplyNoticeId");
}
/*View notice logs*/
function fnviewlog(noticeid, usertype) {
    $("#ViewLogModal").modal('show');
    $("#modlbody").html('');
    var html = '';
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('Usertype', EncodeText(usertype));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewNoticeLog",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {
            $.each(response.Data, function (key, data) {
                var remark = data.Remark == null ? "" : data.Remark;
                var approvalstatus = data.iApprovalStatus == "Approve" ? "Approved" : data.iApprovalStatus;
                if (data.iApproverType == 2) {
                    ApproveType = "User";
                } else if (data.iApproverType == 3) {
                    ApproveType = "Client";
                } else {
                    ApproveType = "NA";
                }
                html += `<tr>
                        <td>`+ data.sendername + `</td>
                        <td>`+ data.receivername + `</td>
                        <td>`+ dateFormat(new Date(data.dSendDate)) + `</td>
                        <td>`+ ApproveType + `</td>
                        <td>`+ remark + `</td >
                        <tr/>`
            })
            $("#modlbody").html(html);
        },
    })
}
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    //changePage(1);
    sessionStorage.removeItem("ReceivedNoticeId");
};
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Confirm delete notice*/

function ConfirmDelete( noticeid) {
    debugger
    // Store the notice ID in a data attribute on the confirm button
    $('#Delete_final').data('noticeid', noticeid);

    // Optionally set the matter name in the modal
    //$('#id_Deletematternames').text(title); // Replace or format as needed

    // Show the modal
    $('#myModalDeleteconfirmation').modal('show');
}


//var DelNoticeId = "";
//var ConfirmDelete = function (NoticeID) {
//    DelNoticeId = NoticeID;
//    var result = confirm("Are you sure you to delete this notice?");
//    if (result) {
//        formdata = new FormData();
//        formdata.append("NoticeId", EncodeText(DelNoticeId))
//        formdata.append("deleteflag", EncodeText("2"))
//        $.ajax({
//            type: "POST",
//            url: "/api/NoticeNew/NoticeDelete",
//            data: formdata,
//            contentType: false,
//            processData: false,
//            success: function (result) {
//                if (result) {
//                    alert("Record deleted successfully.")
//                    isRenderPage = false;
//                    callapi();
//                }
//                else {
//                    alert("Something went wrong.")
//                }
//                window.location.reload();
//            }
//        })
//    }
//}

/*View more notice text content*/
function viewcontent(noticeid, param) {
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('param', EncodeText(param));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewMore",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#viewmoreheader").html("");
            $("#viewmorecontent").html("");
            $("#viewmoreheader").html("Rejoinder Notice");
            $("#viewmorecontent").html(data.Data.message)
        },
    })
}
/*Start set alert code*/
var currentDate = new Date().toLocaleDateString('en-CA');
$('#txtdateofnotice').change(function () {
    $('#alertbeforeincaseallddl').val('');
    fndisplayreminder();
    $('#multiplereminderdiv').html("");
    $('.select2-selection__rendered').empty();
});
var reminderDateArr = [];
function fndisplayreminder() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    var duedate = $("#txtdateofnotice_" + afterSplit).val();
    var prevDate = $("#multiplereminderdiv_" + afterSplit).html().substr(52, 11);
    prevDate = prevDate.replace('<', '').trim();
    if (prevDate != null && prevDate != "") {
        reminderDateArr.map(function (obj, index) {
            if (obj == prevDate) {
                reminderDateArr.splice($.inArray(prevDate, reminderDateArr), 1);
            }
        });
    }
    $("#multiplereminderdiv_" + afterSplit).html("");
    if (duedate == "") {
        alert("Please select custom date");
        return false;
    }
    var txtalrtcondition = $("#txtalertcondition_" + afterSplit).val();
    var alertbeforeincaseallddl = $("#alertbeforeincaseallddl1_" + afterSplit).val();
    if (alertbeforeincaseallddl != null) {
        var day = alertbeforeincaseallddl;//$('alertbeforeincaseallddl').val();
        if (txtalrtcondition == "beforeduedate") {
            var date = new Date(duedate);
            if (day == "") {
                alert('Please select days');
                $("#multiplereminderdiv_" + afterSplit).html("");
                return false;
            }
            var reminderdate = date.setDate(date.getDate() - day);
            reminderdate = new Date(reminderdate);
            var fit_end_time = new Date();
            if (new Date(reminderdate) < new Date(fit_end_time)) {
                alert("Reminder date should not be less then current date")
                return false;
            }
            if ($.isEmptyObject(reminderDateArr)) {
                reminderDateArr.push(formatDatetoIST(reminderdate));
            }
            else {
                if ($.inArray(formatDatetoIST(reminderdate), reminderDateArr) != -1) {
                    alert("A reminder is already set for this date, please set another date for the reminder");
                    return false;
                }
                else {
                    reminderDateArr.push(formatDatetoIST(reminderdate));
                }
            }
            $("#multiplereminderdiv_" + afterSplit).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(reminderdate) + '<br/>')
        }
        else if (txtalrtcondition == "afterreceivedate") {
            var date = new Date(duedate);
            if (day == "") {
                alert('Please select days');
                $("#multiplereminderdiv_" + afterSplit).html("");
                return false;
            }
            var time = parseInt(day) * 24 * 60 * 60 * 1000
            var reminderdate = (date.getTime() + time);
            reminderdate = new Date(reminderdate);
            var fit_end_time = new Date();
            if (new Date(reminderdate) < new Date(fit_end_time)) {
                alert("Reminder date should not be less then current date")
                return false;
            }
            if ($.isEmptyObject(reminderDateArr)) {
                reminderDateArr.push(formatDatetoIST(reminderdate));
            }
            else {
                if ($.inArray(formatDatetoIST(reminderdate), reminderDateArr) != -1) {
                    alert("A reminder is already set for this date, please set another date for the reminder");
                    return false;
                }
                else {
                    reminderDateArr.push(formatDatetoIST(reminderdate));
                }
            }
            $("#multiplereminderdiv_" + afterSplit).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(reminderdate) + '<br/>')
        }
    }
}
/*Get notice list for dropdown*/
var alertType = "";
function GetNoticeListForDdl(Noticeidss, val) {
    alertType = val;
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeRcvListForddl",
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            $("#ddlnoticelist").html("");
            if (response != null) {
                $.each(response, function (key, value) {
                    if (value.NoticeId == Noticeidss) {
                        var textval = "<strong>Sender's Name:</strong> " + value.AddressedTo + ", <strong>Title:</strong> " + value.Title;
                        $("#userTitle").html(textval);
                        $("#ddlnoticelist").append($("<option data-id=" + value.DateofNotice + "></option>").val(value.NoticeId).text(textval));
                    }
                })
                Getdateforalertbynoticeid();
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}

/*Get date for alert by notice id*/
function Getdateforalertbynoticeid() {
    var noticeid = $("#ddlnoticelist").val();
    var duedate = $("#ddlnoticelist option:selected").attr("data-id");
    var formdata = new FormData();
    formdata.append("noticeid", EncodeText(noticeid))
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/Dateforalertbynoticeid",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response1) {
            var response = JSON.parse(response1.Data);
            if (response != null) {
                var receivedate = response.ReceivedDate.split("T");
                $("#txtreceiveddate").html(formatDatetoIST(response.ReceivedDate));
            }
            var duedate1 = duedate.split("T");
            $("#txtduedate").html(formatDatetoIST(duedate));
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
/*Format date to IST*/
function formatDatetoIST(date) {
    if (date == "1900-01-01T00:00:00" || date == "1900-01-01" || date == "") {
        return "";
    }
    else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
        return formatted_date;
    }
}
/*Set notification alert*/
function fnsetnotificationalert(idsss, typeofnotices) {
    $('#multiplereminderdiv').html("");
    $('#txtdateofnotice').val('');
    $('#txtRemark').val('');
    $('#dvadd_noticepostdetils').html("");
    $("#alertbeforeincaseallddl option:selected").removeAttr("selected");
    $('#alertbeforeincaseallddl1').val('');
    $('.select2-selection__rendered').empty();
    reminderDateArr = [];
    dynamicFieldCount = 0;
    $('#dvadd_noticeSetdetils').html("");
    $('#txtdateofnotice_0').val('');
    $("#multiplereminderdiv_0").html("");
    $("#txtRemark_0").val("");
    $("#myModalNotificationsetting ").modal('show');
    fnnotificationalerttype(idsss, typeofnotices);
}
/*Notification alert type*/
function fnnotificationalerttype(NoticeIdss, typeofnotices) {
    var selecteddlval = "individual";
    if (selecteddlval == "individual") {
        $("#divnoticelist").show();
        GetNoticeListForDdl(NoticeIdss, typeofnotices);
        fillAlertNotification(NoticeIdss, typeofnotices);
        $("#alertbeforeincaseindividual").css('display', 'block');
    }
    else {
        $("#divnoticelist").hide();
        $("#alertbeforeincaseindividual").css('display', 'none');
    }
}
var prevReminderDate = "";
var checkData = false;
/*Fill notification alert type data by notice id and type of notice*/
function fillAlertNotification(NoticeId, typeofnotices) {
    $('#dvadd_noticeSetdetils').html('');
    if (NoticeId != "") {
        var formData = new FormData();
        formData.append("NoticeId", EncodeText(NoticeId));
        formData.append("TypeofNotices", EncodeText(typeofnotices));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/GetSetAlertDetails',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                var count = 0;
                var data = "";
                var setCustomDate = "";
                var setAlertBA = "";
                var setDays = "";
                var setReminderSetDate = "";
                var setRemark = "";
                $("#txtdateofnotice_0").attr("min", currentDate);
                if (response.Data.length == 0) {
                    checkData = true;
                }
                else {
                    checkData = false;
                }
                if (response.Data.length > 0) {
                    if (count == 0) {
                        setCustomDate = response.Data[0].CustomDate.split("T");
                        setCustomDate = setCustomDate[0];
                        setAlertBA = response.Data[0].AlertCondition;
                        if (response.Data[0].SetDays == null) {
                            setDays = 1;
                        }
                        else {
                            setDays = response.Data[0].SetDays;
                        }
                        setReminderSetDate = response.Data[0].ReminderDate.split("T");;
                        setReminderSetDate = setReminderSetDate[0];
                        setRemark = response.Data[0].Remarks;
                        $('#txtdateofnotice_0').val(setCustomDate);
                        $('#txtalertcondition_0').val(setAlertBA);
                        $('#alertbeforeincaseallddl1_0').val(setDays);
                        $("#multiplereminderdiv_0").append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(setReminderSetDate));
                        $('#txtRemark_0').val(setRemark);
                        prevReminderDate = $("#multiplereminderdiv_0").html().substr(52, 11);
                        if ($.isEmptyObject(reminderDateArr)) {
                            reminderDateArr.push(formatDatetoIST(prevReminderDate));
                        }
                        else {
                            if ($.inArray(formatDatetoIST(prevReminderDate), reminderDateArr) != -1) {
                                /*alert("You have already choose Please change date or days to set reminder");*/
                                alert("A reminder is already set for this date, please set another date for the reminder");
                                return false;
                            }
                            else {
                                reminderDateArr.push(formatDatetoIST(prevReminderDate));
                            }
                        }
                    }
                    if (response.Data.length > 0) {
                        for (var i = 1; i < response.Data.length; i++) {
                            data = "";
                            setCustomDate = "";
                            setAlertBA = "";
                            setDays = "";
                            setReminderSetDate = "";
                            setRemark = "";
                            count = i;
                            setCustomDate = response.Data[i].CustomDate.split("T");
                            setCustomDate = setCustomDate[0];
                            setAlertBA = response.Data[i].AlertCondition;
                            if (response.Data[i].SetDays == null) {
                                setDays = 1;
                            }
                            else {
                                setDays = response.Data[i].SetDays;
                            }
                            setReminderSetDate = response.Data[i].ReminderDate.split("T");;
                            setReminderSetDate = setReminderSetDate[0];
                            setRemark = response.Data[i].Remarks;
                            data += "<fieldset class='ec_bgAlert'>";
                            data += "<div class='row'>";
                            data += "<div class='col-md-4'>";
                            data += "<label>Custom Date</label><span style='color: red'>*</span><br />";
                            data += "<input type='date' class='inputFormat setValue' min='" + currentDate + "' value='" + setCustomDate + "' id='txtdateofnotice_" + count + "' onchange='ResetField()' />";
                            data += "</div>"
                            data += "<div class='col-md-4'>";
                            data += "<label>Alert Condition</label><span style='color: red'>*</span>";
                            data += "<select class='dropdown - toggle inputFormat setValue' onChange='ResetByAlert()' value='" + setAlertBA + "' id='txtalertcondition_" + count + "' style='background:white'>";
                            data += "<option value='beforeduedate'>Before</option>";
                            data += "<option value='afterreceivedate'>After</option>";
                            data += "</select>";
                            data += "</div>";
                            data += "<div class='col-md-4'>";
                            data += "<label>Set Days</label><span style='color: red'>*</span>";
                            data += "<select class='dropdown-toggle inputFormat setValue' id='alertbeforeincaseallddl1_" + count + "' onchange='fndisplayreminder()' style='background:white' value='" + setDays + "'>"
                            data += "<option value=''>Please select days</option>"
                            data += "<option value='1'>1</option>"
                            data += "<option value='2'>2</option>"
                            data += "<option value='3'>3</option>"
                            data += "<option value='4'>4</option>"
                            data += "<option value='5'>5</option>"
                            data += "<option value='6'>6</option>"
                            data += "<option value='7'>7</option>"
                            data += "<option value='8'>8</option>"
                            data += "<option value='9'>9</option>"
                            data += "<option value='10'>10</option>"
                            data += "</select>";
                            data += "</div>"
                            data += "<div class='col-md-4'>"
                            data += "<label>Reminder Date</label><br />"
                            data += "<div id='multiplereminderdiv_" + count + "' class='inputFormat setValue' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
                            data += "</div>"
                            data += "<div class='col-md-4'>";
                            data += "<label>Remarks</label>";
                            data += "<textarea id='txtRemark_" + count + "'  class='inputFormat setValue' style='width: 100 %; height: 45px!important;'>" + setRemark + "</textarea>"
                            data += "</div>";
                            data += "<div class='col-md-4'>";
                            data += "</div>";
                            data += "</div>";
                            data += " </fieldset>";
                            $('#dvadd_noticeSetdetils').append(data);
                            $("#multiplereminderdiv_" + count).append('<span style="color:red">*</span> Reminder is set on ' + formatDatetoIST(setReminderSetDate))
                            $('#alertbeforeincaseallddl1_' + count).val(setDays);
                            $('#txtalertcondition_' + count).val(setAlertBA);
                            prevReminderDate = $("#multiplereminderdiv_" + count).html().substr(52, 11);
                            if ($.isEmptyObject(reminderDateArr)) {
                                reminderDateArr.push(formatDatetoIST(prevReminderDate));
                            }
                            else {
                                if ($.inArray(formatDatetoIST(prevReminderDate), reminderDateArr) != -1) {
                                    alert("A reminder is already set for this date, please set another date for the reminder");
                                    return false;
                                }
                                else {
                                    reminderDateArr.push(formatDatetoIST(prevReminderDate));
                                }
                            }
                            $("#rowcounterdata").val('');
                        }
                    }
                    dynamicFieldCount = count;
                }
                else {
                }
            }
        });
    }
}

/*View received notice text more content*/
function viewcontent1(noticeid, param) {
    $("#ViewMoreModal").modal('show');
    var formdata = new FormData();
    formdata.append('Id', EncodeText(noticeid));
    formdata.append('param', EncodeText(param));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/ViewMoreSetAlert",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#viewmorecontent").html("");;
            $("#viewmorecontent").html(data.Data.message)
        },
    })
}
/*Set notice alert details*/
$(document).on("click", "#btn_SetAlertDetails", function () {
    if (dynamicFieldCount == 0) {
        dynamicFieldCount = 1;
    }
    else {
        dynamicFieldCount = dynamicFieldCount + 1;
    }
    if (dynamicFieldCount < 5) {
        var data = "";
        data += "<fieldset class='' style='border:none;'>";
        data += "<div class='row'>";
        data += "<div class='col-md-12 text-right'>";
        if (checkData == true) {
            data += "<div id='showhide_" + dynamicFieldCount + "' onclick='deleteAlert_div($(this))' class='delete_div' title='Delete'><img src='/newassets/img/deletematter.png' />"
        }
        data += "</div>";
        data += "</div>";
        data += "</div>";
        data += "<div class='row'>";
        data += "<div class='col-md-4'>";
        data += "<label>Custom Date</label><span style='color: red'>*</span><br />";
        data += "<input type='date' class='inputFormat setValue' min='" + currentDate + "' id='txtdateofnotice_" + dynamicFieldCount + "' onchange='ResetField()' />";
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Alert Condition</label><span style='color: red'>*</span>";
        data += "<select class='dropdown - toggle inputFormat setValue' onChange='ResetByAlert()' id='txtalertcondition_" + dynamicFieldCount + "' style='background:white'>";
        data += "<option value='beforeduedate'>Before</option>";
        data += "<option value='afterreceivedate'>After</option>";
        data += "</select>";
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<label>Set Days</label><span style='color: red'>*</span>";
        data += "<select class='dropdown-toggle inputFormat setValue' id='alertbeforeincaseallddl1_" + dynamicFieldCount + "' onchange='fndisplayreminder()' style='background:white'>"
        data += "<option value=''>Please select days</option>"
        data += "<option value='1'>1</option>"
        data += "<option value='2'>2</option>"
        data += "<option value='3'>3</option>"
        data += "<option value='4'>4</option>"
        data += "<option value='5'>5</option>"
        data += "<option value='6'>6</option>"
        data += "<option value='7'>7</option>"
        data += "<option value='8'>8</option>"
        data += "<option value='9'>9</option>"
        data += "<option value='10'>10</option>"
        data += "</select>";
        data += "</div>"
        data += "</div>"
        data += "<div class='row'>";
        data += "<div class='col-md-4'>"
        data += "<label>Reminder Date</label><br />"
        data += "<div id='multiplereminderdiv_" + dynamicFieldCount + "' class='inputFormat setValue' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
        data += "</div>"
        data += "<div class='col-md-8'>";
        data += "<label>Remarks</label>";
        data += "<textarea id='txtRemark_" + dynamicFieldCount + "' class='inputFormat setValue' style='width:100%; height:35px !important; border-radius:7px;'></textarea>"
        data += "</div>";
        data += " </fieldset>";
        $('#dvadd_noticeSetdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(dynamicFieldCount);
        showField();
    }
    else {
        dynamicFieldCount = dynamicFieldCount - 1;
        alert("You Can't add more than 5 alert");
    }
});
/*Show dynamic field*/
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
/*Hide dynamic generated field*/
function ResetField() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    $('#alertbeforeincaseallddl1_' + afterSplit).val('');
    $('#txtalertcondition_' + afterSplit).val('beforeduedate');
}
/*Reset dynamic field details*/
function ResetByAlert() {
    var eventName = event.target.id;
    var afterSplit = eventName.split('_')[1];
    $('#alertbeforeincaseallddl1_' + afterSplit).val('');
}
/*Add more dynamic control*/
function AddMoreControl(dynamicFieldCount) {
    for (var tcount = 1; tcount <= dynamicFieldCount; tcount++) {
        if (tcount == dynamicFieldCount) {
            dynamicFieldCount = tcount;
        }
        var data = "";
        data += "<fieldset class='ec_bgAlert'>";
        data += "<div class='row'>";
        data += "<div class='col-md-4'>";
        data += "<label>Custom Date</label><span style='color: red'>*</span><br />";
        data += "<input type='date' class='inputFormat' min='" + currentDate + "' id='txtdateofnotice_" + tcount + "' onchange='ResetField()' />";
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Alert Condition</label><span style='color: red'>*</span>";
        data += "<select class='dropdown - toggle inputFormat' id='txtalertcondition_" + tcount + "' style='background:white'>";
        data += "<option value='beforeduedate'>Before</option>";
        data += "<option value='afterreceivedate'>After</option>";
        data += "</select>";
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<label>Set Days</label><span style='color: red'>*</span>";
        data += "<select class='dropdown-toggle inputFormat' id='alertbeforeincaseallddl1_" + tcount + "' onchange='fndisplayreminder()' style='background:white'>"
        data += "<option value='1'>1</option>"
        data += "<option value='2'>2</option>"
        data += "<option value='3'>3</option>"
        data += "<option value='4'>4</option>"
        data += "<option value='5'>5</option>"
        data += "<option value='6'>6</option>"
        data += "<option value='7'>7</option>"
        data += "<option value='8'>8</option>"
        data += "<option value='9'>9</option>"
        data += "<option value='10'>10</option>"
        data += "</select>";
        data += "</div>"
        data += "<div class='col-md-4'>"
        data += "<label>Reminder Date</label><br />"
        data += "<div id='multiplereminderdiv_" + tcount + "' class='inputFormat' style='background:#fff; overflow: hidden; height: 35px!important;'></div>"
        data += "</div>"
        data += "<div class='col-md-4'>";
        data += "<label>Remarks</label>";
        data += "<textarea id='txtRemark_" + tcount + "' class='inputFormat' style='width: 100 %; height: 45px!important;'></textarea>"
        data += "</div>";
        data += "<div class='col-md-4'>";
        data += "<div onclick='deleteAlert_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span>"
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        $('#dvadd_noticeSetdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(tcount);
    }
}
/*Delete dynamic generated alert control*/
var countdata = 0;
function deleteAlert_div(data) {
    if (confirm("Are you sure you want to remove.")) {
        countdata = countdata - 1;
        dynamicFieldCount = dynamicFieldCount - 1;
        $("#rowcounterdata").val(dynamicFieldCount);
        data.parents('fieldset').remove();
        showField();
    }
}

/*End Set Alert code*/
function EditReceivedNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/NoticeReceived/AddReceivedNotice"
    sessionStorage.setItem("ReceivedNoticeId", noticeid)
}
/*Edit received notice*/
function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice"
    sessionStorage.setItem("ReplyNoticeId", noticeid)
}
/*Generate notice status for dropdown*/
function GetNoticestatusForDropdown() {
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/NoticeStatusList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#ddlnoticestatusss").html("");
            $("#ddlnoticestatus").html("");
            $("#ddlnoticestatusss").append($("<option></option>").val("").text('status'));
            $("#ddlnoticestatus").append($("<option></option>").val("").text(' status'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#ddlnoticestatusss").append($("<option data-id=" + value.Id + "></option>").val(value.Name).text(value.Name));
                    $("#ddlnoticestatus").append($("<option data-id=" + value.Id + "></option>").val(value.Id).text(value.Name));
                    if (urltype != "undefined") {
                        if (urltype == "1") {
                            $("#ddlnoticestatusss").val("Convert to case");
                        }
                        else if (urltype == "2") {
                            $("#ddlnoticestatusss").val("Settled");
                        }
                    }
                });
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
$(document).on("click", "#noticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var filetype = $(this).attr("id-type");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=" + filetype + "&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});

/*Save notification setting details*/
$(document).on('click', '#savenotificationsettings', function () {
    var finalData = [];
    var setId = 0;
    var reminderdate = "";
    if (dynamicFieldCount == 0) {
        var customDate = $("#txtdateofnotice_" + setId).val();
        var alertBA = $("#txtalertcondition_" + setId).val();
        var setDays = $("#alertbeforeincaseallddl1_" + setId).val();
        if (alertBA == "beforeduedate") {
            var date = new Date(customDate);
            reminderdate = date.setDate(date.getDate() - setDays);
            reminderdate = new Date(reminderdate);
        } else {
            var date = new Date(customDate);
            reminderdate = date.setDate(date.getDate() + setDays);
            reminderdate = new Date(reminderdate);
        }
        var remark = $("#txtRemark_" + setId).val();
        if (customDate == "") {
            alert("Please select the custom date");
            return false;
        }
        if (setDays == "" || setDays == "Please select days") {
            alert("Please select the days");
            return false;
        }
        if (reminderdate == "") {
            alert("Please set reminder date");
            return false;
        }
        finalData.push({
            customDate: customDate,
            alertBA: alertBA,
            setDays: setDays,
            reminderDate: formatDatetoIST(reminderdate),
            remark: remark
        });
    }
    else {
        for (var i = 0; i <= dynamicFieldCount; i++) {
            setId = i;
            var customDate = $("#txtdateofnotice_" + setId).val();
            var alertBA = $("#txtalertcondition_" + setId).val();
            var setDays = $("#alertbeforeincaseallddl1_" + setId).val();
            if (alertBA == "beforeduedate") {
                var dateD = new Date(customDate);
                reminderdate = dateD.setDate(dateD.getDate() - setDays);
                reminderdate = new Date(reminderdate);
            } else {
                var dateD = new Date(customDate);
                reminderdate = dateD.setDate(dateD.getDate() + parseInt(setDays));
                reminderdate = new Date(reminderdate);
            }
            var remark = $("#txtRemark_" + setId).val();
            if (customDate == "") {
                alert("Please select the custom date");
                return false;
            }
            if (setDays == "" || setDays == "Please select days") {
                alert("Please select the days");
                return false;
            }
            if (reminderdate == "") {
                alert("Please set reminder date");
                return false;
            }
            var reminderMsg = $('#multiplereminderdiv_' + setId).html();
            if (reminderMsg == '') {
                alert("Please set reminder date");
                return false;
            }
            $('#multiplereminderdiv_2').html();
            finalData.push({
                customDate: customDate,
                alertBA: alertBA,
                setDays: setDays,
                reminderDate: formatDatetoIST(reminderdate),
                remark: remark
            });
        }
    }
    var notificationfor = "individual";
    var txtnoticeids = $("#ddlnoticelist").val();
    var alertData = JSON.stringify(finalData);
    if (notificationfor == "individual") {
        if (txtnoticeids == "") {
            alert("Please select notice for set alert.");
            return false;
        }
    }
    openload();
    var formdata = new FormData();
    formdata.append("notificationfor", EncodeText(notificationfor));
    formdata.append("txtnoticeids", EncodeText(txtnoticeids));
    formdata.append("alertData", EncodeText(alertData));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/Savedatafornotification",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            if (response) {
                $("#ddlnoticelist").val("");
                $("#txtalertbefore").val("");
                $("#txtduedate").val("");
                $("#multiplereminderdiv").html("");
                $("#txtduedate").html("");
                $("#txtreceiveddate").html("");
                alert("Record saved successfully.")
                $("#myModalNotificationsetting").modal('hide');
                isRenderPage = false;
                callapi(1);
                closeload();
            }
        },
        failure: function (response) {
            closeload();
        },
        error: function (response) {
            closeload();
        }
    });
})

/*Remove file data*/
function removefiledata(fid) {
    if (confirm("Are you sure you want to remove this file?")) {
        var formData = new FormData();
        formData.append("fid", EncodeText(fid));
        $.ajax({
            type: "POST",
            url: '/api/NoticeNew/RemoveFileById',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                if (response) {
                    alert("File deleted successfully.");
                    $('#myDocumentModal').modal('hide');
                }
                else {
                    alert("Something went wrong.")
                }
            },
            error: function (response) {
                alert("Something went wrong.")
            }
        })
    }
}
//Add search on colomn
$(document).on("click", "#clearnewsearchNoticeSub", function () {
    $("#NoticeSubjectsrh").val("");
    $("#clearnewsearchNoticeSub").css("display", "none");
    isRenderPage = false;
    callapi();
});
$(document).on("click", "#searchNoticeSub", function () {
    var casefiltercasename = $("#NoticeSubjectsrh").val();
    if (casefiltercasename == "") {
        alert("enter notice subject");
        $("#NoticeSubjectsrh").focus();
        return false;
    }
    $("#clearnewsearchNoticeSub").css("display", "unset")
    isRenderPage = false;
    callapi();
});
//Add serch on colomn
$(document).on("click", "#clearnewsearchNoticetit", function () {
    $("#Noticetitsrch").val("");
    $("#clearnewsearchNoticetit").css("display", "none");
    isRenderPage = false;
    callapi();
});
$(document).on("click", "#searchNoticetit", function () {
    var casefiltercasename = $("#Noticetitsrch").val();
    if (casefiltercasename == "") {
        alert("enter notice subject");
        $("#Noticetitsrch").focus();
        return false;
    }
    $("#clearnewsearchNoticetit").css("display", "unset")
    isRenderPage = false;
    callapi();
});
//Add search on colomn
$(document).on("click", "#clearnewsearchSendname", function () {
    $("#NoticeeendersNametxt").val("");
    $("#clearnewsearchSendname").css("display", "none");
    isRenderPage = false;
    callapi();
});
$(document).on("click", "#searchNoticeSendname", function () {
    var casefiltercasename = $("#NoticeeendersNametxt").val();
    if (casefiltercasename == "") {
        alert("enter sender name");
        $("#NoticeeendersNametxt").focus();
        return false;
    }
    $("#clearnewsearchSendname").css("display", "unset")
    isRenderPage = false;
    callapi();
});
$(document).on("click", "#clearnewsearthdetl", function () {
    $("#othdetailsofsender").val("");
    $("#clearnewsearthdetl").css("display", "none");
    isRenderPage = false;
    callapi();
})
$(document).on("click", "#searchothdetl", function () {
    var casefiltercasename = $("#othdetailsofsender").val();
    if (casefiltercasename == "") {
        alert("enter other details of sender");
        $("#othdetailsofsender").focus();
        return false;
    }
    $("#clearnewsearthdetl").css("display", "unset")
    isre
    callapi();
});

//Add more postal details
$(document).on("click", "#btn_addpostaldetails", function () {
    if (companycountdata < 5) {
        companycountdata += 1;
        var data = "";
        data += "<fieldset class='ec_bg'>";
        data += "<div class='row'>";
        data += "<div class='form-group col-md-4'>";
        data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of dispatch <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
        data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control dateofdispatch inputFormat' type='date' value=''  name='noticeSendDate' id='noticeSendDate' autocomplete='new-text' />";
        data += "</div> ";
        data += "</div>";
        data += "<div class='form-group col-md-4'>";
        data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Consignment No.</span></label>";
        data += "<div class='col-md-12'>";
        data += " <input autofocus='' class='form-control consignmentno inputFormat' type='text' value='' name='consignmentnum' id='consignmentnum'  autocomplete='new-text'/>";
        data += "</div>";
        data += "</div>";
        data += "<div class='form-group col-md-4'>";
        data += " <label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of delivery <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
        data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control dateofdelivery inputFormat' type='date' value=''  name='dateofdelivered' id='dateofdelivered' autocomplete='new-text' style='width:90%;float:left;' /><div onclick='delete_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span></div>";
        data += " </div> ";
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        $('#dvadd_noticepostdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(companycountdata);
    }
    else {
        alert("You Can't add more than 5 Consignment");
    }
});

//delete custom fields
function delete_div(data) {
    countdata = countdata - 1;
    companycountdata = companycountdata - 1;
    $("#rowcounterdata").val('');
    $("#rowcounterdata").val(companycountdata);
    data.parents('fieldset').remove();
}

//multiple send for approval
var arrayforselectedrow = [];
$(document).on('click', '#parentcheckboxid', function (e) {
    if (this.checked) {
        $(".checkSingle").each(function () {
            this.checked = true;
        })
    } else {
        $(".checkSingle").each(function () {
            this.checked = false;
        })
    }
    arrayforselectedrow = [];
    $("tr.tbltrcls").each(function () {
        if ($(this).find('.checkSingle').is(':checked')) {
            var quantity1 = $(this).find('.checkSingle').val()
            arrayforselectedrow.push(quantity1);
        }
    });
});
$(document).on('click', '.checkSingle', function (e) {
    if ($(this).is(":checked")) {
        var isAllChecked = 0;
        $(".checkSingle").each(function () {
            if (!this.checked)
                isAllChecked = 1;
        })
        if (isAllChecked == 0) { $("#parentcheckboxid").prop("checked", true); }
    } else {
        $("#parentcheckboxid").prop("checked", false);
    }
    arrayforselectedrow = [];
    $("tr.tbltrcls").each(function () {
        if ($(this).find('.checkSingle').is(':checked')) {
            var quantity1 = $(this).find('.checkSingle').val()
            arrayforselectedrow.push(quantity1);
        }
    });
});
var selectedrowlength = "";
function assignmodal() {
    selectedrowlength = arrayforselectedrow.length;
    if (selectedrowlength < 1) {
        alert("Please select at least one row.");
        return false;
    }
    $("#AssignModal").modal('show');
}

/*Export received notice in excel*/
function ExportToExcelNoticeReceived(noticecomefrom) {
    var notistatus = "";
    var ddlnoticestatusss = $("#ddlnoticestatusss").val();
    var notistatus1;
    if (notistatus == "Home") {
        notistatus1 = "";
    }
    else if (notistatus == "Draft") {
        notistatus1 = "0"
    }
    else if (notistatus == "Sent") {
        notistatus1 = "Pending"
    }
    else if (notistatus == "FinalApproved") {
        notistatus1 = "Approve"
    }
    else if (notistatus == "Rejected") {
        notistatus1 = "Reject"
    }
    var sendernamesearch = $("#noticebyIds").val();
    var Noticesubjectsrc = $("#noticeSubjects").val();
    var Noticetitlesrc = $("#noticeTitless").val();
    var Noticetypesrc = $("#ddlnoticetypess").val();
    var txtStatusOfNotice = ddlnoticestatusss;
    var CFieldtype = "13";
    window.location = encodeURI("/NoticeNew/ExportToExcel?SearchValue=" + SearchValue + "&ColumName=" + ColumName + "&SortedOrder=" + SortedOrder + "&notistatus=" + notistatus1 + "&fromdaterange=" + fromdaterange + "&startdate=" + start + "&enddate=" + end + "&fromreminder=" + fromreminder + "&noticeid=" + remindernoticeid + "&noticecomefrom=" + noticecomefrom + "&notitypes=" + ddlnoticestatusss + "&sendernamesearch=" + sendernamesearch + "&Noticesubjectsrc=" + Noticesubjectsrc + "&Noticetitlesrc=" + Noticetitlesrc + "&Noticetypesrc=" + Noticetypesrc + "&txtStatusOfNotice=" + txtStatusOfNotice + "&CFieldtype=" + CFieldtype);
}


//function fnclearinput(e) {
//    //$("#rangefromdate").val('');
//    //$("#rangetodate").val('');
//    //$("#btclear").hide();
//    //fromdaterange = false;
//    //isRenderPage = false;

//    //callapi();
//}

function AddNotice() {
    var firmcode = localStorage.getItem("FirmCode");
    //sessionStorage.removeItem("NoticeId")
    window.location.href = "/" + firmcode + "/NoticeReceived/AddReceivedNotice"

}

