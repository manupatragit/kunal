$(document).ready(function () {
    var pageindex = 1, pagesize = 20, recordcount = 0, totrecord = 0;
    var isRenderPage = false;
    var totalPageRec = "";
    BindWhatsAppAlertLogHistory(pageindex);
});
var setTotalRecord = "";
function BindWhatsAppAlertLogHistory(pageindex) {
    var htmls = '';
    openload();
    var mobNo = $("#idMobNo").val();
    pagesize = 10;
    var formData = new FormData();
    formData.append("MobileNo", mobNo);
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    $.ajax({
        type: "POST",
        url: "/NoticeTemplate/ViewWhatsAppSendAlertHistory",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var obj = response1.Data;
            var length = obj.length;
            var obj1 = obj;
            var qty = 0;
            if (length > 0) {
                $("#journaldatastatus").hide();
                $.each(obj1, function (i, val) {
                    $('#tradePagination').show();
                    if (i === 0) {
                        firstvalue = val.RowId;
                    }

                    $("#whatstotaRecordData").text("(" + val.TotalRecord + ")");

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

                    var RowId = val.RowId;
                    var TotalRecord = val.TotalRecord;

                    htmls += '<tr>'
                    htmls += '<td id="rowid">' + val.RowId + '</td>'
                    htmls += '<td>' + val.mobileno + '</td>'
                    htmls += '<td>' + val.NoticeTitle + '</td>'
                    htmls += '<td>' + val.AlertStatus + '</td>'
                    htmls += '<td>' + formatDate(val.SendOn) + '</td>'
                    htmls += '</tr>'

                });
            } else {
                $('#tradePagination').hide();
                $("#whatstotaRecordData").text("");
                $("#journaldatastatus").show();
            }

            $("#bindAlertLogData").html("").html(htmls);
            closeload();
        },
        
    });
}
$(document).on("click", "#btnsearch", function () {
    isRenderPage = false;
    BindWhatsAppAlertLogHistory(pageindex);
});
$(document).on("click", "#btnclear", function () {
    $("#idMobNo").val("");
    isRenderPage = false;
    BindWhatsAppAlertLogHistory(pageindex);
});
function formatDate(dateStr) {
    var date = new Date(dateStr); // parse string to Date

    var day = ("0" + date.getDate()).slice(-2);        // 01-31
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 01-12
    var year = date.getFullYear();

    return day + "/" + month + "/" + year;
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
    isRenderPage = true;
}
var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = true;
    BindWhatsAppAlertLogHistory(setPageNo);
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
    BindWhatsAppAlertLogHistory(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    BindWhatsAppAlertLogHistory(setPageNo);
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
    BindWhatsAppAlertLogHistory(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
    /*Pagination End*/