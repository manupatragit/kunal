var pageindex = 1;
var pagesize = 10;
$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    bindBulkNoticesDetails(pageindex);

});
$(document).on("click", "#btnuploadDetail", function () {
    
    var totalFiles = document.getElementById("postedFile").files.length;
    if (totalFiles < 1) {
        new PNotify({
            title: 'Warning!',
            text: 'Upload file with column names matching the sample template.',//'Please choose the correct Excel format.',
            type: 'success',
            delay: 3000
        });
        return false;
    }
    var fileUpload = $("#postedFile").get(0);
    var files = fileUpload.files;
    var fileData = new FormData();
    for (var i = 0; i < files.length; i++) {
        if (!checkfile(files[i].name)) {
            new PNotify({
                title: 'Warning!',
                text: 'Upload file with column names matching the sample template.',
                type: 'success',
                delay: 3000
            });
            return false;
        }
        fileData.append(files[i].name, files[i]);
    }
    openload();
    $.ajax({
        type: "POST",
        url: "/NoticeNew/PostBulkNoticeDetail",
        data: fileData,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            if (data.status) {
                //bindBulkNoticesDetails(pageindex)
                isRenderPage = false;
                
                new PNotify({
                    title: 'Success!',
                    text: 'Record saved successfully.',
                    type: 'success',
                    delay: 3000
                });
                location.reload();
                //$("#postedFile").val("");
                $("#postedFile").val("");
                $("#fileName").text("");
                $("#deleteFile").hide();  
            }
            else {
                closeload();
                new PNotify({
                    title: 'Warning!',
                    text: 'Upload file with column names matching the sample template.',//'Please choose the correct Excel format.',
                    type: 'success',
                    delay: 3000
                });
            }
        },
        failure: function (data) {
            closeload();
            new PNotify({
                title: 'Warning!',
                text: 'Upload file with column names matching the sample template.',//'Please choose the correct Excel format.',
                type: 'success',
                delay: 3000
            });
        },
        error: function (data) {
            closeload();
            new PNotify({
                title: 'Warning!',
                text: 'Upload file with column names matching the sample template.',//'Please choose the correct Excel format.',
                type: 'success',
                delay: 3000
            });
        }
    });
});
function openload() {
    $('#myOverlay').css("display", "block");
}
function closeload() {
    $('#myOverlay').css("display", "none");
}

$(document).on("click", "#ColumnSelectionopen", function () {
    $('#myModalCustomizedcolumn').modal({ show: true });
});


function bindBulkNoticesDetails(pageindex) {
    pagesize = 10;
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    $.ajax({
        async: true,
        //url: "/NoticeTemplate/BindBulkNoticeDetail",
        url: "/NoticeNew/BindBulkNoticeDetail",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var obj1 = response.Data;
            var obj = obj1;
            var htmls = "";
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

            $("#exportrecords").val(0);
            if (obj.length > 0) {
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                $.each(obj, function (i, val) {

                    if (i === (length - 1)) {
                        var totdata = val.TotalRecord;
                        $("#exportrecords").val(val.TotalRecord);
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
                            totalRecord = totpage;
                            renderPagination(pageindex, totpage);
                        }
                    }

                    htmls += '<tr>'
                    htmls += '<td style="text-align: center;">' + val.RowId + '</td>'
                    htmls += '<td class="loantype">' + val.LoanType + '</td>'
                    htmls += '<td style="width:20px;" class="loanId">' + val.LoanID + '</td>'
                    htmls += '<td class="clientId">' + val.ClientID + '</td>'
                    htmls += '<td class="schoolStudentName">' + val.SchoolStudentName + '</td>'
                    htmls += '<td class="branch">' + val.Branch + '</td>'
                    htmls += '<td class="state">' + val.State + '</td>'
                    htmls += '<td class="branchaddress">' + val.BranchAddress + '</td>'
                    htmls += '<td class="productname">' + val.ProductName + '</td>'
                    htmls += '<td class="loanamount">' + val.LoanAmount + '</td>'
                    htmls += '<td class="disbursementdate">' + (val.DisbursementDate != null && val.DisbursementDate != "" ? convertToDateOnly(val.DisbursementDate) : "") + '</td>'
                    htmls += '<td class="emiAmount">' + val.EMIAmount + '</td>'
                    htmls += '<td class="emiduedate">' + (val.EMIDueDate != null && val.EMIDueDate != "" ? convertToDateOnly(val.EMIDueDate) : "") + '</td>'
                    htmls += '<td class="currentDPD">' + val.CurrentDPD + '</td>'
                    htmls += '<td class="borrowerschoolname">' + val.BorrowerDetailsSchoolName1 + '</td>'
                    htmls += '<td class="borrowerschooladdress">' + val.BorrowerDetailsSchooladdress11 + '</td>'
                    htmls += '<td class="borrowerschoolphone">' + val.BorrowerDetailsSchoolphonenumber1 + '</td>'
                    htmls += '<td class="borrowerschoolemail">' + val.BorrowerDetailsSchoolemailid1 + '</td>'
                    htmls += '<td class="trustname">' + val.TrustDetailsTrustname1 + '</td>'
                    htmls += '<td class="trustnameaddress">' + val.TrustDetailsTrustaddress1 + '</td>'
                    htmls += '<td class="trustnamephoneno">' + val.TrustDetailsTrustphonenumber1 + '</td>'
                    htmls += '<td class="trustemail">' + val.TrustDetailsTrustemailid1 + '</td>'
                    htmls += '<td class="coapplicantname">' + val.CoApplicantName1 + '</td>'
                    htmls += '<td class="coapplicantaddress">' + val.CoApplicant1Address + '</td>'
                    htmls += '<td class="coapplicantphone">' + val.CoApplicant1PhoneNumber + '</td>'
                    htmls += '<td class="coapplicantemail">' + val.CoApplicant1EmailID + '</td>'
                    htmls += '<td class="coapplicantname2">' + val.CoApplicantName2 + '</td>'
                    htmls += '<td class="coapplicantaddress2">' + val.CoApplicant2Address + '</td>'
                    htmls += '<td class="coapplicantphone2">' + val.CoApplicant2PhoneNumber + '</td>'
                    htmls += '<td class="coapplicantemailid2">' + val.CoApplicant2EmailID + '</td>'
                    htmls += '<td class="coapplicantdunningref">' + val.DunningReferencenumber + '</td>'
                    htmls += '<td class="coapplicantdunningnoticedate">' + val.DunningletterNoticeDate + '</td>'
                    htmls += '<td class="branchcollectionmanagername">' + val.BranchCollectionManagerName + '</td>'
                    htmls += '<td class="branchcollectionmanagerno">' + val.BranchCollectionManagerNo + '</td>'
                    htmls += '<td class="noticetype">' + val.TypeofNotice + '</td>'
                    htmls += '<td class="uploadedby">' + val.UploadedBy + '</td>'
                    htmls += '<td class="dateodupload">' + formatToDDMMYYYY(val.CreatedDate) + '</td>'
                    htmls += '<td>'
                    htmls += '<ul class="table_action">'
                    htmls += '<li><span class="taskoutboxbtnicon" id="editNoticeDetails" style="cursor:pointer;" title="Edit notice"  noticeid=' + val.Id + ' onclick="EditNotice(' + val.Id + ')"> <img style="padding:5px;" src="/newassets/img/edit.svg" /> </span></li>'
                    htmls += '<li><span class="taskoutboxbtnicon" id="deleteNoticeDetails" style="cursor:pointer;" title="Delete Notice" noticeid=' + val.Id + ' data-toggle="modal"> <img src="/newassets/img/delete.svg"> </span></li>'
                    htmls += '</ul>'
                    htmls += '</td>'
                    htmls += '</tr>'
                });
                $("#tablevalue").html("").html(htmls);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("#pdatastatus").hide();
                $("#tradePagination").show();
                $("#dtNotFound").html("");
            }
            else {
                $("#pdatastatus").show();
                $("#tradePagination").hide();
                document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                $("#dtNotFound").html("Data not found");
            }
           
        }, 
        failure: function (response) {
            alert(data.responseText);
        },
        error: function (response) {
            alert(response.responseText);
        } 
    });
}

function formatToDDMMYYYY(dateStr) {
    var date = new Date(dateStr);

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    var yyyy = date.getFullYear();

    return dd + "/" + mm + "/" + yyyy;
}
$(document).on("click", "#btnUploadHelp", function () {
    $("#myModalBulkNoticeHelp").modal("show");
});

$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
});
var arrcolmenuseleciton = [];
var arrcolmenuselecitonfix = [];
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

    bindBulkNoticesDetails(pageindex);
});

function convertToDateOnly(dateStr) {
    // Extract just the date part before space
    const [datePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);

    // Return formatted date (yyyy-mm-dd)
    return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}-${year}`;
}

/*Pagination Start*/
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

var setPageNo = 1;
$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    setPageNo = page;
    isRenderPage = false;
    $("#txtgopage").val("");
    bindBulkNoticesDetails(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#prev", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    bindBulkNoticesDetails(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = false;
    $("#txtgopage").val("");
    bindBulkNoticesDetails(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#divGo", function () {
    let goToPage = parseInt($("#txtgopage").val());
    if (!isNaN(goToPage)) {
        setPageNo = goToPage;
    }
    if (goToPage > totalRecord || goToPage == 0 || isNaN(goToPage)) {
        //alert("Please enter a valid page number.");
        new PNotify({
            title: 'Warning!',
            text: 'Please enter a valid page number.',
            type: 'success',
            delay: 3000
        });
        setPageNo = 1;
        return false;
    }
    isRenderPage = false;
    bindBulkNoticesDetails(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});

/* Pagination Start */

var setPageNo = 1;
var totalPageRec = 1;
var isRenderPage = false;

//function renderPagination(currentPage, totalPages) {
//    setPageNo = currentPage;
//    totalPageRec = totalPages;
//    let paginationHtml = '';
//    const windowSize = 2; 
//    paginationHtml += `<button id="prev" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;

//    if (currentPage !== 1) {
//        paginationHtml += `<button class="page-btn" data-page="1">1</button>`;
//    }

//    if (currentPage > windowSize + 2) {
//        paginationHtml += `<span>...</span>`;
//    }

//    let start = Math.max(2, currentPage - windowSize);
//    let end = Math.min(totalPages - 1, currentPage + windowSize);

//    for (let i = start; i <= end; i++) {
//        paginationHtml += `
//            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
//                    data-page="${i}">
//                ${i}
//            </button>`;
//    }

//    if (currentPage < totalPages - (windowSize + 1)) {
//        paginationHtml += `<span>...</span>`;
//    }

//    if (totalPages > 1 && currentPage !== totalPages) {
//        paginationHtml += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
//    }

//    paginationHtml += `<button id="next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;

//    $("#pageNumbers").html(paginationHtml);
//    isRenderPage = true;
//}

//$(document).on("click", ".page-btn", function () {
//    let page = $(this).data("page");
//    setPageNo = page;
//    $("#txtgopage").val("");

//    bindBulkNoticesDetails(setPageNo);
//    renderPagination(setPageNo, totalPageRec);
//});


//$(document).on("click", "#prev", function () {
//    if (setPageNo > 1) {
//        setPageNo--;
//        $("#txtgopage").val("");
//        bindBulkNoticesDetails(setPageNo);
//        renderPagination(setPageNo, totalPageRec);
//    }
//});

//$(document).on("click", "#next", function () {
//    if (setPageNo < totalPageRec) {
//        setPageNo++;
//        $("#txtgopage").val("");
//        bindBulkNoticesDetails(setPageNo);
//        renderPagination(setPageNo, totalPageRec);
//    }
//});

//$(document).on("click", "#divGo", function () {
//    let goToPage = parseInt($("#txtgopage").val());

//    if (isNaN(goToPage) || goToPage < 1 || goToPage > totalPageRec) {
//        new PNotify({
//            title: 'Warning!',
//            text: 'Please enter a valid page number.',
//            type: 'warning',
//            delay: 3000
//        });
//        return false;
//    }

//    setPageNo = goToPage;
//    bindBulkNoticesDetails(setPageNo);
//    renderPagination(setPageNo, totalPageRec);
//});

/*Pagination End*/

function EditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    sessionStorage.setItem("UpdateBulkNoticeId", noticeid)
    window.location.href = "/" + firmcode + "/NoticeNew/UpdateBulkNotice"
}

$(document).on("click", "#deleteNoticeDetails", function () {
    var deletedId = $(this).attr("noticeid");
    if (deletedId == "" || deletedId == null || deletedId == "null") {
        new PNotify({
            title: 'Warning!',
            text: 'Oops, Something went wrong',
            type: 'success',
            delay: 3000
        });
    }
    $("#myModalDeleteBulkConfirmation").modal();
    $("#deleteNoticeDetailsAfterCnf").attr("id-val", deletedId);
   
});
$(document).on('click', '#deleteNoticeDetailsAfterCnf', function () {
    var dNoticeId = "";
    dNoticeId = $(this).attr("id-val");
   
    var formData = new FormData();
    formData.append("dNoticeId", dNoticeId);
    $.ajax({
        async: true,
        url: "/api/NoticeNew/DeleteNoticeByNoticeId",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            new PNotify({
                title: 'Success!',
                text: 'Record deleted successfully',
                type: 'success',
                delay: 3000
            });
            $("#myModalDeleteBulkConfirmation").modal("hide");
            //location.reload();
            setTimeout(function () {
                location.reload();
            }, 300);
            //var firmcode = localStorage.getItem("FirmCode");
            //window.location.href = "/" + firmcode + "/NoticeNew/UploadBulkData"
        }
    });
});

$(document).on('click', '#divExportToExcel', function () {
    $("#myModalexportExcel").modal({ show: true });
    //$("#id_exportreportdrop").html('');
    var totalRecord = $("#exportrecords").val();
    var pagesize = 200;
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
    $("#id_exportreportdrop").html(html);
});

$(document).on('click', '#CommonExportExcel', function () {
    var pagenum = $("#id_exportreportdrop").val();
    if (pagenum == "") {
        new PNotify({
            title: 'Warning!',
            text: 'Please select page number',
            type: 'success',
            delay: 3000
        });
        return false;
    }
    window.location = encodeURI("/NoticeNew/DownloadExcelFileDetails?pagenum=" + pagenum + "&pagesize=200");
});

$(document).on('change', '#postedFile', function () {
    var fileName = this.files.length ? this.files[0].name : "";
    $("#fileName").text(fileName);

    if (fileName !== "") {
        $("#deleteFile").show();
    }
});

// Delete file
$(document).on('click', '#deleteFile', function () {
    $("#postedFile").val(""); 
    $("#fileName").text("");  
    $("#deleteFile").hide();  
});