var current_page = 1;
var records_per_page = 10;
var PageNumber = "";
var TotalRows = 0;
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
window.onload = function () {
    SearchValue = "";
    ColumName = "";
    SortedOrder = "";
    PageNumber = 1;
    changePage(1);
    // callapi();
};
function changePage(page) {
    PageNumber = page;
    callapi();
}
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});

/*Get shared bulk notice by page number*/
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
    pageindex = $(this).attr("index");
    changePage(pageindex);
});

/*Get bulk shared notice details*/
var callapi = function () {
    try {
        openload();
    }
    catch
    {
    }
    var html = '';
    var noticetitlesrch = $("#noticeTitless").val();
    var formData = new FormData();
    formData.append("SearchValue", EncodeText(noticetitlesrch));
    formData.append("PageNumber", EncodeText(PageNumber));
    formData.append("PageSize", EncodeText(10));
    formData.append("NoticeId", EncodeText(NoticeId));
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/BulkTempListSharedToMe",
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            try {
                closeload();
            }
            catch
            {
            }
            $("#templatetablevalue").html("");
            $("#templatenoticetbldashboardfooter").html("");
            $("#templatenonotice").html("");
            if (response == "") {
                $("#templatenonotice").append("No Records found.");
                return false;
            }
            else {
                $.each(response, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.RowId;
                    }
                    if (i === (response.length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = a.TotalRows;
                        var totpage = 0;
                        if (a.TotalRows > 0) {
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
                        tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (a.TotalRows <= response.length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="margin-left:5px;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#templatenoticetbldashboardfooter").append(tfot);
                    }
                    html += "<tr>"
                    html += "<td style='cursor:pointer;color:#0059c1' title='Click for view notice' onclick=fnGetNoticeBulkList(`" + a.MainTemplateId + "`)><b>" + a.TemplateName + "</b></td>";
                    html += "<td>" + a.NoticeTitle + "</td>";
                    html += "<td>" + a.TemplateCreatedBy + "</td>";
                    html += "<td>" + a.CreatedDate + "</td>";
                    html += "</tr>"
                });
                $("#templatetablevalue").append(html);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
        },
        error: function (xhr) {
            alert('error');
            try {
                closeload();
            }
            catch
            {
            }
        }
    });
};
function fnGetNoticeBulkList(maintemplateid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode+"/NoticeTemplate/NoticeListSharedToMe";
    sessionStorage.setItem("maintemplateidsharedtome", maintemplateid);
}
$("#clearnewsearchforsendertitl").click(function () {
    $("#noticeTitless").val("");
    $("#clearnewsearchforsendertitl").css("display", "none");
    callapi();
})
$("#searchdatatitl").click(function () {
    var casefiltercasename = $("#noticeTitless").val();
    if (casefiltercasename == "") {
        alert("enter notice title");
        $("#noticeTitless").focus();
        return false;
    }
    $("#clearnewsearchforsendertitl").css("display", "unset")
    callapi();
});