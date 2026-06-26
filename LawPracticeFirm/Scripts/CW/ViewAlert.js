$(document).ready(function () {
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    /*Pagination Start*/

    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);

        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        isRenderPage = true;
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Paginate*/
    var chksflag = true;

    var fcode = localStorage.getItem("FirmCode");
    loaddatalist(pageindex);
    /*Get SMS Alert List by */
    function loaddatalist(pageindex) {
        
        var html3 = '';
        var search = $("#Alerttext").val();
        var formData = new FormData();
        formData.append("search", search);
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/GetSMSAlertList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    document.querySelector(".pagination").style.display = "flex";

                    $("#divalertlist tr").remove();
                    $("#bindCaseAlertList").html('');
                    $.each(response1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totdata = val.TotalRecord;
                        if (i === (length - 1)) {
                            totalRecord = val.TotalRecord;

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
                                totalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var SMSText = val.SMSText;
                        var SentOn = val.SentOn;
                        if (SMSText != "") {
                            html3 += '<tr>'
                            html3 += '<td> '
                            html3 += SMSText
                            html3 += '</td>'
                            html3 += '<td>'
                            html3 += SentOn
                            html3 += '</td>'
                            html3 += '</tr>'
                        }
                    });
                } else {
                    document.querySelector(".pagination").style.display = "none";
                    html3 = "";
                    html3 += '<tr>';
                    html3 += '<td colspan="4" align="center"><div style="width:300px; margin:auto; text-align:center;">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No Alert List Found</h4>' +
                        '</div></td>';
     
                }
                //html3 += '</tbody>'
                //html3 += '</table></div>'
                //$("#divalertlist").html("");
                $("#bindCaseAlertList").empty().append(html3);
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
    /*for table serch filter*/
    $(document).on('click', '#searchalerttext', function () {
        var casefiltercasename = $("#Alerttext").val();
        if (casefiltercasename == "") {
            alert("Please enter the case no.");
            $("#Alerttext").focus();
            return false;
        }
        $("#clearsearchtet").css("display", "unset")
        isRenderPage = false;
        loaddatalist(1);
    });
    $(document).on('click', '#clearsearchtet', function () {
        $("#Alerttext").val("");
        $("#clearsearchtet").css("display", "none");
        isRenderPage = false;
        loaddatalist(1);
    });
});


/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
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