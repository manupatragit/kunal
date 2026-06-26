var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0, ppageindex = 1; pageNumber = 1;
$(document).ready(function () {
    //Start pagination sub function
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        pageindex = page;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadactivity(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (pageindex > 1) {
            pageindex = pageindex - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        loadactivity(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    });

    $("#next").click(function () {
        if (pageindex => 1) {
            pageindex = pageindex + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        loadactivity(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > totalRecordCount) {
            setPageNo = 1;
            alert("Please enter a valid page number.");
            return false;
        }
        isRenderPage = false;
        loadactivity(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
    BindAllDashboardCounts();
    BindLitigationContactCount();
    toDoListData(pageNumber);
    loadactivity(1);



});
function BindAllDashboardCounts() {
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/LitigationDasboardCount",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var obj = JSON.parse(response1);
            if (obj.data != null) {
                $("#lbltottalcase").text(obj.data[0].TotalCases);
                $("#lblpendingcase").text(obj.data[0].Pendingcases);
                $("#lbldisposedcase").text(obj.data[0].Disposedcases);
                $("#lblstnotavl").text(obj.data[0].StatusnotFound);
                $("#lblNotesavl").text(obj.data[0].Notes);
            }
            $(".loader1, .loader2, .loader3, .loader4, .loader5").hide();
            closeload();
        },
        error: function () {
            $(".loader1, .loader2, .loader3, .loader4, .loader5").hide();
            closeload();
        }
    });
}
/*Load activity by page index*/
function loadactivity(pageindex) {
    try {
        $("#loadactivitydata").html("");
        var datefrom = $("#daterecentfrom").val();
        var dateto = $("#daterecentto").val();
        //  openload();
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("datefrom", EncodeText(datefrom));
        formdata.append("dateto", EncodeText(dateto));
        var qty1 = 0;
        var html = '';
        var ajaxTime1 = new Date().getTime();
        $.ajax({
            async: true,
            url: "/api/CallApi/BindRecentActivity",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data != "[]") {
                }
                else {
                    document.querySelector(".pagination").style.display = "none";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $('#loadractivity').empty();
                    $('#notFound').empty()
                   
                    $("#notFound").html(`
                        <div class="notfound" id="pdatastatus" style="text-align: center;">
                            <img src="/newassets/img/not-found.png" alt="Not Found">
                            <h4>No Activity list found</h4>
                            <p>We found no Activity list.</p>
                        </div>
                      `);
                    $("#notFound").css("display", "block");
                    closeload();
                    return;

                }
                var totalTime1 = new Date().getTime() - ajaxTime1;
                if (response.Data == "[]") {
                    document.querySelector(".pagination").style.display = "none";
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $('#loadractivity').empty();
                    $('#notFound').empty()
                    $("#notFound").html(`
                        <div class="notfound" id="pdatastatus" style="text-align: center;">
                            <img src="/newassets/img/not-found.png" alt="Not Found">
                            <h4>No Activity list found</h4>
                            <p>We found no Activity list.</p>
                        </div>
                        `);
                    $("#notFound").css("display", "block");
                    closeload();
                    return;
                }
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                document.querySelector(".pagination").style.display = "flex";
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                $("#notFound").css("display", "none");

                $.each(obj, function (index, a) {
                    if (index === 0) {
                        firstvalue = a.rownum;
                    }
                    var totpage = 0;
                    if (index === (length - 1)) {

                        var totdata = a.totRow

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
                    qty1 = qty1 + 1;
                     html += `
            <tr>
                <td>${String(a.rownum)}</td>
                <td>${a.notification}</td>
                <td>${formatDatetoIST(a.date_time) }</td>
                <td>${a.date_time.substring(11, 19)}</td>
            </tr>
        `;

                 
                });
                $('#loadractivity').empty();

                $('#loadractivity').append(html);
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    $('input[type = "date"]').removeAttr("onkeydown");
                    $('input[type = "date"]').removeAttr("onkeypress");
                }
                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
                $('input[type = "date"]').blur(function () {
                    var dateString = $(this).val();
                    if (dateString != "") {
                        var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
                        var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                        var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
                        if (regex.test(dateString)) {
                            var parts = dateString.split("-");
                            var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                            if (parseInt(parts[0]) < 1900) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[0]) > 3000) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            if (parseInt(parts[2]) == 00) {
                                $(this).focus();
                                $(this).val("");
                                alert("Please enter a valid date.");
                                return false;
                            }
                            var dtCurrent = new Date();
                            return true;
                        } else {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                    }
                });
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    } catch {
        closeload();
    }
}
/*search recent datas*/
$(document).on('click', '#searchrecentdatas', function () {
    isRenderPage = false;
    loadactivity(1);
    closeload();
});
/*get data by page num*/
$(document).on('click', '#getdatabypagenum', function () {
    pageindex = $("#pagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var pageindesx = $("#sotopage").text();
            if (pageindex <= parseInt(pageindesx)) {
                loadactivity(pageindex);
                closeload();
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
        else {
            alert("Please enter a valid page number.");
        }
    }
});
/*Paginate*/
$(document).on('click', '#paginate', function () {
    pageindex = $(this).attr("index");
    loadactivity(pageindex);
    closeload();
});
/*Open loader*/
function openload() {
    $("#myOverlay").css("display", "block");
}
/*Close loader*/
function closeload() {
    $("#myOverlay").css("display", "none");
}
function openloadtotalcount() {
    $(".loader1").css("display", "block");
}
/*Close loader*/
function closeloadtotalcount() {
    $(".loader1").css("display", "none");
}
function openloadpendingcount() {
    $(".loader2").css("display", "block");
}
/*Close loader*/
function closeloadpendingcount() {
    $(".loader2").css("display", "none");
}

function openloaddisposedcount() {
    $(".loader3").css("display", "block");
}
/*Close loader*/
function closeloaddisposedcount() {
    $(".loader3").css("display", "none");
}
function openloadnotfoundcount() {
    $(".loader4").css("display", "block");
}
/*Close loader*/
function closeloadnotfoundcount() {
    $(".loader4").css("display", "none");
}
function openloadnotescount() {
    $(".loader5").css("display", "block");
}
/*Close loader*/
function closeloadnotescount() {
    $(".loader5").css("display", "none");
}
function openloadtodocount() {
    $(".loader6").css("display", "block");
}
/*Close loader*/
function closeloadtodocount() {
    $(".loader6").css("display", "none");
}
/*To do count*/
function toDoListData(pageNumber) {
    var formData = new FormData();
    formData.append("pageNumber", EncodeText(pageNumber));
    formData.append("pagesize", EncodeText(pagesize));
    openloadtodocount();
    $.ajax({
        type: "POST",
        url: "/api/CallApi/ToDoList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            // var obj = response.Data;
            var obj = JSON.parse(response.Data);
            if (obj.length > 0) {
                //  var datacount = response.Data.length;
                var datacount = obj[0].TotalRows;
                $("#lbltodolist").text(datacount);
                closeloadtodocount();
            } else {
                $("#lbltodolist").text(0);
                closeloadtodocount();
            }

        },
        error: function (data) {
            alert("Error fetching to-do list.");
            closeload();
        }
    });
}

function BindLitigationContactCount() {
  
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    formData.append("Search1", "");
    formData.append("Search2", "");
    formData.append("Search3", "");
    //openload();
    openloadtodocount();
    var Licaselit = $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetLitigationContact",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var length = response1.length;
            
            $('#lblContact').text(length)
            if (length > 0) {
                $('#lblContact').text(response1[0]["TotalRecord"]);
                closeloadtodocount();
            }
            closeloadtodocount();
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
    $.when(Licaselit).then(function (data, textStatus, jqXHR) {
        closeload();
        return false;
    });
}


/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
//function renderPagination(pageindex, totdata) {
//    let totPages = totdata;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis
//    if (totdata <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (pageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }
//    $("#pageNumbers").html(paginationHtml);
//    isRenderPage = true;
//}
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
