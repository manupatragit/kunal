var fcode = localStorage.getItem("FirmCode");
var urlParams = new URLSearchParams(window.location.search);
var parameterName = urlParams.get("key");
var IPname = urlParams.get("IP");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var Proname = "";
var PropAddress = "";
var searchName = "";
var searchAddress = "";


$(document).ready(function () {
    //console.log(IPname);
    if (IPname == '1') {
        $('#searchAgent').css("display", "block");
        $('#SearchTradename').text('Trademark');
        $('#dynamicnotiheader').text('Add Trademark');
        $('#SearchActionName').text('Proprietor');
        $('#spPhoneticSearch').show();
        EmptyAndFillDivForTM();
    }
    if (IPname == '2') {
        document.getElementById('filterPropName').placeholder = 'Enter Applicant Name';
        $('#SearchTradename').text('Copyright');
        $('#dynamicnotiheader').text('Add Copyright');
        $('#SearchActionName').text('Applicant');
        $('#spPhoneticSearch').css("display", "none");
        //$('#dynamicnotiheader').text('Applicant Search For Copyright');
        EmptyAndFillDivForCopyright();
    }

    if (IPname == '3') {
        document.getElementById('filterPropName').placeholder = 'Enter Applicant Name';
        $('#SearchTradename').text('Patent');
        $('#dynamicnotiheader').text('Add Patent');
        $('#SearchActionName').text('Applicant');
        $('#spPhoneticSearch').css("display", "none");
        //$('#dynamicnotiheader').text('Applicant Search For Patent');
        EmptyAndFillDivForPatent();
    }

    if (IPname == '4') {

        //$('#dynamicnotiheader').text('Applicant Search For GI');
        document.getElementById('filterPropName').placeholder = 'Enter Applicant Name';
        document.getElementById('filterAddress').placeholder = 'Enter Applicant Address';
        $('#spPhoneticSearch').css("display", "none");
        $('#SearchTradename').text('GI');
        $('#dynamicnotiheader').text('Add GI');
        $('#SearchActionName').text('Applicant');
        EmptyAndFillDivForGI();
    }

    if (IPname == '5') {
        //$('#dynamicnotiheader').text('Applicant Search For Design');
        $('#spPhoneticSearch').css("display", "none");
        document.getElementById('filterPropName').placeholder = 'Enter Applicant Name';
        $('#SearchTradename').text('Design');
        $('#dynamicnotiheader').text('Add Design');
        $('#SearchActionName').text('Applicant');
        EmptyAndFillDivForDesign();
    }

});
$(document).on("click", "#idcustomcommonFilter", function () {
    $("#iprform")[0].reset();
    $('#myModalCustomCommonFilter').modal({ show: true });
})
function fn_search() {
    if (event.which === 13) {
        var vProprietorSearch = $('#filterPropName').val();
        if (vProprietorSearch != '') {
            GetProData(pageindex);
        }
    }
}

// Added by prem kumar
//$('#btnsearch').on('click', function () {
$(document).on('click', '#btnsearch', function () {
    isRenderPage = false;
    pageindex = 1;
    GetProData(pageindex);
});

/*Start page redirection*/
$(document).on('click', "#searchPhonetictab", function () {
    window.location.href = `/${fcode}/IPR/PhoneticSearch?IP=${IPname}`;
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
$(document).on('click', "#btnBack", function () {
    window.location.href = `/${fcode}/IPR/IPRSearch?IP=${IPname}`;
})
/*End page redirection*/
var vProprietorSearch = "";
var vProprietorAddressSearch = "";
function GetProData(pageindex) {
    vProprietorSearch = $('#filterPropName').val();
    vProprietorAddressSearch = $('#filterAddress').val();
    if (IPname != 5) {
        if (vProprietorSearch == '' || vProprietorSearch == undefined) {
            $("#PropCount").text('');
            $('#pdatastatus').show();
            $('#tradePagination').hide();
            $('#bindIPRSearchData').html("");
            if (IPname == 1) {
                alert('Please enter the Proprietor Name');
            }
            else {
                alert('Please enter the Applicant Name');
            }

            return false;
        }
    }
    else {
        if (vProprietorAddressSearch == '' || vProprietorAddressSearch == undefined) {
            $("#PropCount").text('');
            $('#pdatastatus').show();
            $('#tradePagination').hide();
            $('#bindIPRSearchData').html("");
            alert('Please enter the Applicant Address');
            return false;
        }
    }

    openload();

    var formData = new FormData();
    formData.append("iprid", IPname);
    formData.append("pageNumber", pageindex);
    formData.append("pageSize", pagesize);
    formData.append("vProprietorSearch", vProprietorSearch);
    formData.append("vProprietorAddressSearch", vProprietorAddressSearch);

    $.ajax({
        type: "POST",
        url: "/api/IPRApi/PropriterTabularDetails",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = response.Data.data;
            var htmls = '';
            var length = obj.length;
            $('#bindIPRSearchData').html("");
            if (obj != 'undefined' && obj != null) {
                if (obj.length > 0) {
                    $('#pdatastatus').hide();
                    $('#tradePagination').show();
                    i = 0;
                    $.each(obj, function (index, value) {

                        i++;
                        if (index === 0) {
                            firstvalue = value.RowId;
                        }

                        //if (index === (length - 1)) {
                        //    var pnext = pageindex;
                        //    var pprev = pageindex;
                        //    var pageno = pageindex;
                        //    var totdata = value.TotalRecord;
                        //    var totpage = 0;
                        //    if (value.TotalRecord > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(pagesize);
                        //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#pagnumvalue").val(totpage);
                        //    }
                        //    var tfot = '';
                        //    $("#exportrecords").val(value.TotalRecord);
                        //    tfot += '<ul>'
                        //    tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += `<li><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a></li>`
                        //    if (value.TotalRecord <= length) {
                        //    }
                        //    else if (pageno == 1) {
                        //    }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev"></a></span>   <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev" ></a></span><span>'
                        //    }

                        //    if (pageno < totpage) {
                        //        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext"></a ></span ></li >'
                        //    }
                        //    tfot += '</ul>'
                        //    $("#ptfooter").html("");
                        //    $("#ptfooter").html(tfot);
                        //};

                        if (index === (length - 1)) {
                            $("#exportrecords").val(value.TotalRecord);

                            var totdata = value.TotalRecord;
                            $("#PropCount").text("(" + value.TotalRecord + ")");
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

                        if (IPname == '1') {
                            htmls += '<tr>' +
                                /*'<td>' + i + '</td>' +*/
                                '<td>' + value.RowId + '</td>' +
                                '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 340px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + value.vProprietor + '</span></td>' +
                                '<td>' + isNullCheck(value.vProprietorAddress) + '</td>' +
                                '<td>' +
                                '<ul class="table_action"><li><span id="PropDetailsByName" class="taskoutboxbtnicon openModal" ' +
                                'style="cursor:pointer;" title="View details of Proprietor" ' +
                                'data-name="' + value.vProprietor + '" data-address="' + isNullCheck(value.vProprietorAddress) + '" ' +
                                'data-toggle="modal" data-target="#viewPropritordata">' +
                                '<img src="/newassets/img/eye.svg"></span> </li> ' +
                                '<li><span id="DownloadPropDeatilsExcel" class="taskoutboxbtnicon" ' +
                                'style="cursor:pointer;" data-name="' + value.vProprietor + '" ' +
                                'data-address="' + value.vProprietorAddress + '" ' +
                                'title="Download Excel data" onclick="downloadPropDetailsExcel()">' +
                                '<img src="/newassets/img/download.svg"></span>' +
                                '</td>'
                            '</tr>';
                        }

                        else if (IPname == '2') {
                            htmls += '<tr>' +
                                '<td>' + value.RowId + '</td>' +
                                '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 340px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + value.vApplicantName + '</span></td>' +
                                '<td>' +
                                '<ul class="table_action">' +
                                '<li><span id="PropDetailsByName" class="taskoutboxbtnicon openModal" ' +
                                'style="cursor:pointer;" title="View details of Proprietor" ' +
                                'data-name="' + value.vApplicantName + '" ' +
                                'data-toggle="modal" data-target="#viewPropritordata">' +
                                '<img src="/newassets/img/eye.svg"></span></li>' +
                                '<li><span id="DownloadPropDeatilsExcel" class="taskoutboxbtnicon" ' +
                                'style="cursor:pointer;" data-name="' + value.vApplicantName + '" ' +
                                'title="Download Excel data" onclick="downloadPropDetailsExcel()">' +
                                '<img src="/newassets/img/download.svg"></span></li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                        }

                        else if (IPname == '3') {
                            htmls += '<tr>' +
                                '<td>' + value.RowId + '</td>' +
                                '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 270px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + value.vApplicantName + '</span></td>' +
                                '<td>' +
                                '<ul class="table_action">' +
                                '<li><span id="PropDetailsByName" class="taskoutboxbtnicon openModal" ' +
                                'style="cursor:pointer;" title="View details of Proprietor" ' +
                                'data-name="' + value.vApplicantName + '" ' +
                                'data-toggle="modal" data-target="#viewPropritordata">' +
                                '<img src="/newassets/img/eye.svg"></span></li>' +
                                '<li><span id="DownloadPropDeatilsExcel" class="taskoutboxbtnicon preserve-whitespace" ' +
                                'style="cursor:pointer;" data-name="' + value.vApplicantName + '" ' +
                                'title="Download Excel data" onclick="downloadPropDetailsExcel()">' +
                                '<img src="/newassets/img/download.svg"></span></li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                        }

                        else if (IPname == '4') {
                            htmls += '<tr>' +
                                '<td>' + value.RowId + '</td>' +
                                '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 340px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + value.vApplicantName + '</span></td>' +
                                '<td>' + value.vApplicantAddress + '</td>' +
                                '<td>' +
                                '<ul class="table_action">' +
                                '<li><span id="PropDetailsByName" class="taskoutboxbtnicon openModal" ' +
                                'style="cursor:pointer;" title="View details of Proprietor" ' +
                                'data-name="' + value.vApplicantName + '" data-address="' + value.vApplicantAddress + '" ' +
                                'data-toggle="modal" data-target="#viewPropritordata">' +
                                '<img src="/newassets/img/eye.svg"></span></li>' +
                                '<li><span id="DownloadPropDeatilsExcel" class="taskoutboxbtnicon" ' +
                                'style="cursor:pointer;" data-name="' + value.vApplicantName + '" data-address="' + value.vApplicantAddress + '" ' +
                                'title="Download Excel data" onclick="downloadPropDetailsExcel()">' +
                                '<img src="/newassets/img/download.svg"></span></li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                        }

                        else if (IPname == '5') {
                            htmls += '<tr>' +
                                '<td>' + value.RowId + '</td>' +
                                '<td><span class="freeze-text" style="font-size:14px !important; font-weight:500; color: #181D27 !important; letter-spacing: 0; line-height: 20px; width: 340px; height: 40px; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + value.vAddress + '</span></td>' +
                                '<td>' +
                                '<ul class="table_action">' +
                                '<li><span id="PropDetailsByName" class="taskoutboxbtnicon openModal" ' +
                                'style="cursor:pointer;" title="View details of Proprietor" ' +
                                'data-address="' + value.vAddress + '" ' +
                                'data-toggle="modal" data-target="#viewPropritordata">' +
                                '<img src="/newassets/img/eye.svg"></span></li>' +
                                '<li><span id="DownloadPropDeatilsExcel" class="taskoutboxbtnicon" ' +
                                'style="cursor:pointer;" data-address="' + value.vAddress + '" ' +
                                'title="Download Excel data" onclick="downloadPropDetailsExcel()">' +
                                '<img src="/newassets/img/download.svg"></span></li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                        }

                    });
                    $('#bindIPRSearchData').html(htmls);
                }
                // add here 
                else {
                    //htmls += '<tr>' +
                    //    '<td colspan="4" style="text-align: center;">Data Not Found</td>' +
                    //    '</tr>';
                    //$('#bindIPRSearchData').html(htmls);
                    $('#pdatastatus').show();
                    $('#tradePagination').hide();
                    $("#PropCount").text('');
                }
            }
            else {
                //htmls += '<tr>' +
                //    '<td colspan="4" style="text-align: center;">Data Not Found</td>' +
                //    '</tr>';
                //$('#bindIPRSearchData').html(htmls);
                $('#pdatastatus').show();
                $('#tradePagination').hide();
            }
            closeload();
        },
        error: function (xhr, status, error) {
            console.error(error);
            closeload();
        }
    });
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
    $("#txtgopage").val("");
    GetProData(setPageNo);
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
    GetProData(setPageNo);

    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
$(document).on("click", "#next", function () {
    if (setPageNo => 1) {
        setPageNo = setPageNo + 1;
    }
    isRenderPage = true;
    $("#txtgopage").val("");
    GetProData(setPageNo);
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
    GetProData(setPageNo);
    $(".page-btn").removeClass("active");
    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
});
/*Pagination End*/

var downlodProname = "";
var downlodPropAddress = "";

$(document).on('click', '#PropDetailsByName11', function () {
    downlodProname = "";
    downlodPropAddress = "";
    var name = $(this).data('name');
    var address = $(this).data('address');
    Proname = name;
    PropAddress = address;
    downlodProname = name;
    downlodPropAddress = address;
    $('#btnEmail').attr({ 'data-name': Proname, 'data-address': PropAddress });

    openload();
    var formData = new FormData();
    formData.append("pageNumber", pagindexModal);
    formData.append("pageSize", pagesizeModal);
    formData.append("vProprietorSearch", name);
    formData.append("vProprietorAddressSearch", address);
    formData.append("iprid", IPname);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/PropriterDetailsByNameAndAddress",

        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = response.Data.data;
            var htmls = '';

            if (obj.length > 0) {
                $.each(obj, function (index, value) {

                    if (index === (obj.length - 1)) {
                        var pnext = pagindexModal;
                        var pprev = pagindexModal;
                        var pageno = pagindexModal;

                        var totdata = value.TotalRecord;
                        var totpage = 0;
                        if (value.TotalRecord > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }

                            $("#pagnumvalue1").val(totpage);

                        }
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage1" style="display:none">' + totpage + '</span></li>'

                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pagindexModal + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += `<li><input type="number" id="pagnumvalue1" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum1" style="margin-left:10px;">Go</button></a></li>`

                        if (value.TotalRecord <= length) {

                        }
                        else if (pageno == 1) {

                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1"></a></span>   <span>'

                        }

                        else {
                            tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1" ></a></span><span>'
                        }

                        if (pageno < totpage) {
                            tfot += '<a  id="paginate1" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext1"></a ></span ></li >'

                        }
                        tfot += '</ul>'
                        var emailButtonHtml = '<button style="margin-right:-450px" id="emexcel" class="sbtbtn pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
                        tfot += emailButtonHtml;
                        var downloadExc = '<button style="margin-right:-330px;display:none" id="downloadExcel" class="sbtbtn pull-right" >Download</button>';
                        tfot += downloadExc;
                        $("#ptfooter1").html("");
                        $("#ptfooter1").html(tfot);
                    }

                    if (IPname == '1') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vApplNo + '</td>' +
                            '<td>' + value.vWordMark + '</td>' +
                            '<td>' + value.vApplDate + '</td>' +
                            '<td>' + value.vClass + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '2') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vDiaryNo + '</td>' +
                            '<td>' + value.vROCNumber + '</td>' +
                            '<td>' + value.vTitleofWork + '</td>' +
                            '<td>' + isNullCheck(value.vStatus) + '</td>' +
                            '<td>' + value.vCategory + '</td>' +
                            '<td>' + convertdateCopyApplicant(value.dApplDate) + '</td>' +
                            '<td>' + value.vApplicantName + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '3') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vApplNo + '</td>' +
                            '<td>' + value.vInventionTitle + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '<td>' + value.dDateOffiling + '</td>' +
                            '<td>' + value.vApplicantName + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '4') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vGeoIndication + '</td>' +
                            '<td>' + value.vApplicantName + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '<td>' + value.vClass + '</td>' +
                            '<td>' + value.dDateofFiling + '</td>' +
                            '<td>' + value.vRegistrationValidUpto + '</td>' +
                            '<td>' + (value.vJournalNo == undefined ? "" : value.vJournalNo) + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '5') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + (value.vDesignNo == undefined ? "" : value.vDesignNo) + '</td>' +
                            '<td>' + (value.vClass == undefined ? "" : value.vClass) + '</td>' +
                            '<td>' + (value.vAddress == undefined ? "" : value.vAddress) + '</td>' +
                            '<td>' + (value.vDateOfRegistration == undefined ? '' : newconvertdate(value.vDateOfRegistration)) + '</td>' +
                            '<td>' + value.vTitle + '</td>' +
                            '</tr>';
                    }

                    $('#bindviewPropritordata').html(htmls);
                    closeload();
                    //var appenddata = $('#emexcel').attr({
                    //    'data-name': name,
                    //    'data-address': address
                    //});
                });
            }
            else {
                htmls += '<tr>' +
                    '<td colspan="6" style="text-align: center;">Data Not Found</td>' +
                    '</tr>';

                $('#bindviewPropritordata').html(htmls);
                closeload();

            }
            closeload();

        },
        error: function (xhr, status, error) {
            console.error(error);
            closeload();
        }
    });

    console.log(name, address);

});



var propPageIndex = 1;
var propName = "";
var propAddress = "";
var setviewTotalRecord = 1;

$(document).on('click', '#PropDetailsByName', function () {
    propName = "";
    propAddress = "";
    searchAddress = "";
    searchName = "";
    isViewRenderPage = false;
    propName = $(this).data('name');
    propAddress = $(this).data('address');
    searchAddress = propAddress;
    searchName = propName;
    GetPropriterDetails(propPageIndex);
});
function GetPropriterDetails(propPageIndex) {
    downlodProname = "";
    downlodPropAddress = "";
    pagindexModal = propPageIndex;
    Proname = propName;
    PropAddress = propAddress;
    downlodProname = propName;
    downlodPropAddress = propAddress;
    $('#btnEmail').attr({ 'data-name': Proname, 'data-address': PropAddress });

    openload();
    var formData = new FormData();
    formData.append("pageNumber", pagindexModal);
    formData.append("pageSize", pagesizeModal);
    formData.append("vProprietorSearch", Proname);
    formData.append("vProprietorAddressSearch", PropAddress);
    formData.append("iprid", IPname);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/PropriterDetailsByNameAndAddress",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = response.Data.data;
            var htmls = '';
            if (obj.length > 0) {
                $.each(obj, function (index, value) {
                    var tfot = '';
                    //if (index === (obj.length - 1)) {
                    //    var pnext = pagindexModal;
                    //    var pprev = pagindexModal;
                    //    var pageno = pagindexModal;
                    //    var totdata = value.TotalRecord;
                    //    var totpage = 0;
                    //    if (value.TotalRecord > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);

                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#pagnumvalue1").val(totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="propPage" style="display:none">' + totpage + '</span></li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pagindexModal + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += `<li><input type="number" id="txtInput" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabyprop" style="margin-left:10px;">Go</button></a></li>`
                    //    if (value.TotalRecord <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="propPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>   <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="propPaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span><span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="propPaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    var emailButtonHtml = '<button  id="emexcel" class="sbtbtn pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
                    //    tfot += emailButtonHtml;
                    //    if (IPname == "1") {
                    //        var trckButtonHtml = '<button id="Tracprop" class="sbtbtn" >Add To Tracker</button>';
                    //        tfot += trckButtonHtml;
                    //        var downloadExc = '<button  id="downloadExcel" class="sbtbtn pull-right" >Download</button>';
                    //        tfot += downloadExc;
                    //    }

                    //    $("#ptfooter1").html("");
                    //    $("#ptfooter1").html(tfot);
                    //}
                    if (index === (obj.length - 1)) {

                        var totdata = value.TotalRecord;
                        var totpage = 0;
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pagindexModal == totpage) {
                            $('#viewNext').hide();
                            $('#viewPrev').css("display", "block");
                        }
                        else {
                            $('#viewNext').css("display", "block");
                        }
                        if (pagindexModal == 1) {
                            $('#viewPrev').css("display", "none");
                        }
                        else {
                            $('#viewPrev').css("display", "block");
                        }

                        if (isViewRenderPage == false) {
                            setviewTotalRecord = totpage;
                            PropRenderPagination(pagindexModal, totpage);
                        }

                        if (IPname == "1") {
                            var trckButtonHtml = '<button id="Tracprop" class="btn btn-primary" style="margin-right:10px;">Add To Tracker</button>';
                            tfot += trckButtonHtml;
                            var downloadExc = '<button  id="downloadExcel" class="btn btn-primary" style="margin-right:10px;">Download</button>';
                            tfot += downloadExc;
                        }
                        var emailButtonHtml = '<button  id="emexcel" class="btn btn-primary" data-toggle="modal" data-target="#emailmodal" style="margin-right:10px;">Email As Excel</button>';
                        tfot += emailButtonHtml;
                        var cancelBtn = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
                        tfot += cancelBtn;
                        //$("#ptfooter1").html("");
                        //$("#ptfooter1").html(tfot);
                        $("#btnShowHeader").html("");
                        $("#btnShowHeader").html(tfot);
                    }
                    if (IPname == '1') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vApplNo + '</td>' +
                            '<td>' + value.vWordMark + '</td>' +
                            '<td>' + value.vApplDate + '</td>' +
                            '<td>' + value.vClass + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '2') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vDiaryNo + '</td>' +
                            '<td>' + value.vROCNumber + '</td>' +
                            '<td>' + value.vTitleofWork + '</td>' +
                            '<td>' + isNullCheck(value.vStatus) + '</td>' +
                            '<td>' + value.vCategory + '</td>' +
                            '<td>' + convertdateCopyApplicant(value.dApplDate) + '</td>' +
                            '<td>' + value.vApplicantName + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '3') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vApplNo + '</td>' +
                            '<td>' + value.vInventionTitle + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '<td>' + convertdateCopyApplicant(value.dDateOffiling) + '</td>' +
                            '<td>' + value.vApplicantName + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '4') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vGeoIndication + '</td>' +
                            '<td>' + value.vApplicantName + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '<td>' + value.vClass + '</td>' +
                            '<td>' + value.dDateofFiling + '</td>' +
                            '<td>' + value.vRegistrationValidUpto + '</td>' +
                            '<td>' + (value.vJournalNo == undefined ? "" : value.vJournalNo) + '</td>' +
                            '</tr>';
                    }

                    if (IPname == '5') {
                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + (value.vDesignNo == undefined ? "" : value.vDesignNo) + '</td>' +
                            '<td>' + (value.vClass == undefined ? "" : value.vClass) + '</td>' +
                            '<td>' + (value.vAddress == undefined ? "" : value.vAddress) + '</td>' +
                            '<td>' + (value.vDateOfRegistration == undefined ? '' : newconvertdate(value.vDateOfRegistration)) + '</td>' +
                            '<td>' + value.vTitle + '</td>' +
                            '</tr>';
                    }
                    $('#bindviewPropritordata').html(htmls);
                    closeload();
                });

                var propV = $('#emexcel').attr({
                    "data-name": Proname,
                    "data-address": PropAddress
                })

            }
            else {
                htmls += '<tr>' +
                    '<td colspan="6" style="text-align: center;">Data Not Found</td>' +
                    '</tr>';
                $('#bindviewPropritordata').html(htmls);
                closeload();
            }
            closeload();
        },
        error: function (xhr, status, error) {
            console.error(error);
            closeload();
        }
    });
}

var isViewRenderPage = false;
function PropRenderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="viewpage-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="viewpage-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="viewpage-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#viewPageNumbers").html(paginationHtml);
    isViewRenderPage = true;
}
var setViewPageNo = 1;
$(document).on("click", ".viewpage-btn", function () {
    let page = $(this).data("page");
    propPageIndex = page;
    isViewRenderPage = true;
    $("#viewtxtgopage").val("");
    GetPropriterDetails(propPageIndex);
    $(".viewpage-btn").removeClass("active");
    $(".viewpage-btn[data-page='" + setViewPageNo + "']").addClass("active");
});

$(document).on("click", "#viewPrev", function () {
    if (propPageIndex > 1) {
        propPageIndex = propPageIndex - 1;
    }
    isViewRenderPage = true;
    $("#viewtxtgopage").val("");
    GetPropriterDetails(propPageIndex);

    $(".viewpage-btn").removeClass("active");
    $(".viewpage-btn[data-page='" + propPageIndex + "']").addClass("active");
});
$(document).on("click", "#viewNext", function () {
    if (propPageIndex => 1) {
        propPageIndex = propPageIndex + 1;
    }
    isViewRenderPage = true;
    $("#viewtxtgopage").val("");
    GetPropriterDetails(propPageIndex);
    $(".viewpage-btn").removeClass("active");
    $(".viewpage-btn[data-page='" + propPageIndex + "']").addClass("active");
});
$(document).on("click", "#viewDivGo", function () {
    let goToPage = parseInt($("#viewtxtgopage").val());
    if (!isNaN(goToPage)) {
        propPageIndex = goToPage;
    }
    if (goToPage > setviewTotalRecord || goToPage == 0 || isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        propPageIndex = 1;
        return false;
    }
    isViewRenderPage = true;
    GetPropriterDetails(propPageIndex);
    $(".viewpage-btn").removeClass("active");
    $(".viewpage-btn[data-page='" + propPageIndex + "']").addClass("active");
});

//function ConvertPatentDate(dateValue) {
//    let dateParts = dateValue.split('T');
//    let datePart = dateParts[0];
//    const date = new Date(datePart);
//    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//    // Extract day, month, and year
//    const day = date.getDate();
//    const month = months[date.getMonth()];
//    const year = date.getFullYear();

//    var formattedDate = date.toLocaleString('en-GB', {
//        year: 'numeric',
//        month: 'short',
//        day: '2-digit'
//    });

//    return formattedDate;
//}

$(document).on('click', '#propPaginate', function () {
    propPageIndex = $(this).attr("index");
    GetPropriterDetails(propPageIndex);
});

$(document).on('click', '#getdatabyprop', function () {
    propPageIndex = $("#txtInput").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#propPage").text();
            if (propPageIndex <= parseInt(ppageindesx)) {
                loadflag = true;
                GetPropriterDetails(propPageIndex);
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



function GetPropDetailByNamePagination(pagindexModal) {
    var name = Proname;
    var address = PropAddress;
    openload();
    var formData = new FormData();
    formData.append('iprid', IPname);
    formData.append("pageNumber", pagindexModal);
    formData.append("pageSize", pagesizeModal);
    formData.append("vProprietorSearch", name);
    formData.append("vProprietorAddressSearch", address);

    $.ajax({
        type: "POST",
        url: "/api/IPRApi/PropriterDetailsByNameAndAddress",

        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Data.data.length > 0) {
                var obj = response.Data.data;
                var htmls = '';

                if (obj && obj.length > 0) {
                    $.each(obj, function (index, value) {
                        if (index === (length - 1)) {
                            var pnext = pagindexModal;
                            var pprev = pagindexModal;
                            var pageno = pagindexModal;

                            var totdata = value.TotalRecord;
                            var totpage = 0;
                            if (value.TotalRecord > 0) {
                                pnext = parseInt(pnext) + 1;
                                if (pnext == 0) pnext = 1;

                                pprev = parseInt(pageno) - 1;
                                if (pprev == 0) pprev = 1;
                                totpage = parseInt(totdata) / parseInt(pagesize);

                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }

                                $("#pagnumvalue1").val(totpage);

                            }

                            var tfot = '';
                            tfot += '<ul>'
                            tfot += '<li>results <span>' + value.TotalRecord + '</span>  <span id="sotopage1" style="display:none">' + totpage + '</span></li>'

                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pagindexModal + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += `<li><input type="number" id="pagnumvalue1" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum1" style="margin-left:10px;">Go</button></a></li>`

                            if (value.TotalRecord <= length) {

                            }
                            else if (pageno == 1) {

                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1"></a></span>   <span>'

                            }

                            else {
                                tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" id="getdatabypagenumPrev1" ></a></span><span>'
                            }

                            if (pageno < totpage) {
                                tfot += '<a  id="paginate1" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;" id="getdatabypagenumNext1"></a ></span ></li >'

                            }

                            //tfot += '</ul>'
                            //$("#ptfooter1").html("");
                            //$("#ptfooter1").html(tfot);
                            tfot += '</ul>'
                            // Create the Email As Excel button HTML
                            var emailButtonHtml = '<button style="margin-right:-450px" id="emexcel" class="sbtbtn pull-right" data-toggle="modal" data-target="#emailmodal">Email As Excel</button>';
                            // Append the "Email As Excel" button HTML to the pagination footer
                            tfot += emailButtonHtml;
                            $("#ptfooter1").html("");
                            $("#ptfooter1").html(tfot);
                        }

                        htmls += '<tr>' +
                            '<td>' + value.RowId + '</td>' +
                            '<td>' + value.vApplNo + '</td>' +
                            '<td>' + value.vWordMark + '</td>' +
                            '<td>' + value.vApplDate + '</td>' +
                            '<td>' + value.vClass + '</td>' +
                            '<td>' + value.vStatus + '</td>' +
                            '</tr>';
                    });
                }

                else {
                    htmls += '<tr>' +
                        '<td colspan="3" style="text-align: center;">Data Not Found</td>' +
                        '</tr>';
                }
            }
            else {
                htmls += '<tr>' +
                    '<td colspan="3" style="text-align: center;">Data Not Found</td>' +
                    '</tr>';
            }


            $('#bindviewPropritordata').html(htmls);
            closeload();

            //var appendData = $('#emexcel').attr({
            //    'data-name': name,
            //    'data-address': address
            //});
            var appendData = $('#emexcel').attr({
                'data-name': Proname,
                'data-address': PropAddress
            });

            closeload();

        },
        error: function (xhr, status, error) {
            console.error(error);
            closeload();
        }
    });

    console.log(name, address);
}

//function downloadPropDetailsExcel() {
//    $(document).on('click', '#DownloadPropDeatilsExcel', function () {
//        var name = $(this).data('name');
//        var address = $(this).data('address');

//        window.location = encodeURI("/IPR/PropriterDetailsByNameAndAddressExcel?vProprietorSearch=" + name
//            + "&vProprietorAddressSearch=" + address + "&IpType=" + IPname);
//    });
//}

function downloadPropDetailsExcel() {
    $(document).on('click', '#DownloadPropDeatilsExcel', function () {
        var urls = "/IPR/PropriterDetailsByNameAndAddressExcel";
        var name = $(this).data('name');
        var address = $(this).data('address');
        url_redirect({
            url: urls,
            method: "post",
            data: {
                "vProprietorSearch": name, "vProprietorAddressSearch": address,
                "IpType": IPname
            }
        });
    });
}


function fn_Proprietorkeywordinsert() {

    if ($('#filtertradmark').val() == '') {
        alert('Please enter text to search');
        $("#filtertradmark").focus();
        return false;
    }

    openload();
    var searchtext = $('#filtertradmark').val();
    var category = $('#searchclass').val();
    var formData = new FormData();

    formData.append('filtertradmark', searchtext);
    formData.append('category', category);

    $.ajax({

        async: true,
        type: "POST",
        url: "/api/IPRApi/ProprietorInsert",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,

        success: function (response) {
            var obj = response.Data.data;
            if (obj == "-1") {
                alert('This keyword has already been searched for, please type in a new keyword.');
                closeload();
            }

            else if (obj == "1") {
                alert('Thank you for sending your query, Team MyKase will share the results soon!')
                closeload();
            }
        }
    });
}

function fn_btnclear() {
    $('#filterPropName').val('');
    $('#filterAddress').val('');
    $('#pdatastatus').show();
    $('#tradePagination').hide();
    $("#PropCount").text("");
    //added by varun
    $('#bindIPRSearchData').empty();
    //$('#ptfooter').empty();
}

$(document).on('click', '#getdatabypagenum', function () {


    ppageindex = $("#pagnumvalue").val();

    if (ppageindex != "undefined") {
        pageindex = ppageindex;
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#sotopage").text();

            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                GetProData();
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
        }
    }
});

$(document).on('click', '#getdatabypagenum1', function () {

    ppageindex = $("#pagnumvalue1").val();

    if (ppageindex != "undefined") {
        pagindexModal = ppageindex;
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#sotopage1").text();

            if (ppageindex <= parseInt(ppageindesx)) {
                openload();
                GetPropDetailByNamePagination(pagindexModal);
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
        }
    }
});




$(document).on('click', '#getdatabypagenumNext', function () {



    if (pageindex != "undefined") {
        pageindex = parseInt(pageindex) + 1;
        //    pageindex + 1;
        GetProData();
    }
    else {
        alert("Please enter a valid page number.");
        closeload();
        return false;
    }


});
$(document).on('click', '#getdatabypagenumNext1', function () {
    if (pagindexModal != "undefined") {
        pagindexModal = parseInt(pagindexModal) + 1;
        //pagindexModal + 1;

        GetPropDetailByNamePagination(pagindexModal);
    }
    else {
        alert("Please enter a valid page number.");
        closeload();
        return false;
    }


});

$(document).on('click', '#getdatabypagenumPrev', function () {

    //pageindex = $(this).attr("index");

    if (pageindex != "undefined") {
        pageindex = parseInt(pageindex) - 1;
        //pageindex-1
        GetProData();
    }
    else {
        alert("Please enter a valid page number.");
        closeload();
        return false;
    }


});

$(document).on('click', '#getdatabypagenumPrev1', function () {

    if (pagindexModal != "undefined") {
        pagindexModal = pagindexModal - 1;

        GetPropDetailByNamePagination(pagindexModal);

    }
    else {
        alert("Please enter a valid page number.");
        closeload();
        return false;
    }


});

$(document).on('click', '#openproprietordetails', function () {

    var sid = $(this).attr("tradeid");
    jQuery.ajax({
        url: "/IPR/ProprietorGraph?id=" + sid,
        dataType: "html",
        success: function (result) {
            jQuery("#divproprietorgraph").html(result);
        }
    });
});

$(document).on('click', '#propexcel', function () {

    $("#myModalexport1").modal({ show: true });
    var totalRecord = $("#exportrecords").val();

    var pagesize = 10;
    var recordsection = totalRecord / pagesize;

    recordsection = recordsection + 1;
    var html = '';
    for (var i = 1; i < recordsection; i++) {
        html += '<tr>';


        html += '<td>Page No:' + i + ' </td>';
        html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfileProprietor" pageno="' + i + '" type="excel">Download File</span></td>';
        html += '</tr>';

    }
    $("#printexport").html(html);
});

$(document).on("click", "#exporttoexcelfileProprietor", function () {

    var ppageindex = $("#pagnumvalue").val();

    window.location = encodeURI("/IPR/ExportoExcelProprietorSearch?&pagesize1=10" + "&pageindex=" + ppageindex);
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Extra Functions xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function EmptyAndFillDivForTM() {
    $('#rm1').remove();
    $('#rm2').remove();
}

function EmptyAndFillDivForCopyright() {
    /*$('#changelbl').text('Applicant Name')*/
    $('#hidename').empty();
    $('#hide').remove();
    $('#th2').text('Diary no');
    $('#th3').text('ROC no');
    $('#th4').text('Title of the work');
    $('#th5').text('Status');
    $('#th6').text('Category');
    $('#th7').text('Date');
    $('#th8').text('Applicant name');
    $('#headerhide').remove();

    $('#hidename').append('<div class="form-group"><label class="formLabel colorDark"><span class="control-label">Name<span class="required" aria-required="true"><b> *</b></span></span></label><input type="text" id="filterPropName" placeholder="Enter Applicant Name" class="inputFormat" autofocus></div>');
}

function EmptyAndFillDivForPatent() {

    $('#changelbl').text('Applicant Name');
    $('#hide').remove();
    $('#headerhide').remove();
    $('#th2').text('Application no');
    $('#th3').text('Title');
    $('#th4').text('Status');
    $('#th5').text('Date of filing');
    $('#th6').text('Name of applicant');
    $('#rm1').remove();
    $('#rm2').remove();
}

function EmptyAndFillDivForGI() {

    $('#changelbl').text('Applicant Name')
    $('#changelbls').text('Applicant Address')

    $('#th2').text('Name of gi');
    $('#th3').text('Applicant');
    $('#th4').text('Status');
    $('#th5').text('Class');
    $('#th6').text('Date of Filing');
    $('#rm1').text('Valid upto');
    $('#rm2').text('Journal no');
}

function EmptyAndFillDivForDesign() {
    $('#headerhide1').remove();
    $('#hidename').remove();
    $('#changelbls').text('Applicant Address')
    $('#hide').empty();
    $('#hide').append('<div class="form-group"><label class="formLabel colorDark" id="changelbls"><span class="control-label">Address</span><span class="required" aria-required="true"><b> *</b> </span></label><input type="text" id="filterAddress" placeholder="Enter Applicant Address" class="inputFormat" autofocus></div>');
    $('#modal-header').html('Applicant Information');

    $('#th2').text('Design Number');
    $('#th3').text('Class');
    $('#th4').text('Address');
    $('#th5').text('Date Of Application');
    $('#th6').text('Title');
    $('#rm1').remove();
    $('#rm2').remove();
}

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

$(document).on('click', '#emexcel', function () {
    $("#emailtxt").val("");
    $('#btnEmail').attr({

        'data-name': $(this).data('name'),
        'data-address': $(this).data('address')
    });
});

$(document).on("click", "#downloadExcel", function () {
    var IPname = urlParams.get("IP");
    var PropName = downlodProname;
    var PropAddress = downlodPropAddress;
    //window.location = encodeURI("/IPR/DownloadIPRProprietorAndApplicant?iprid=" + IPname + "&propname=" + PropName + "&propadd=" + PropAddress);
    var url = "/IPR/DownloadIPRProprietorAndApplicant" +
        "?iprid=" + encodeURIComponent(IPname) +
        "&propname=" + encodeURIComponent(PropName) +
        "&propadd=" + encodeURIComponent(PropAddress);

    window.location = url;
});

$(document).on('click', '#btnEmail', function () {
    //var PropName = $(this).data('name');
    //var PropAddress = $(this).data('address');
    openload();
    var PropName = $(this).attr('data-name');
    var PropAddress = $(this).attr('data-address'); //$(this).data('data-address');
    var emailTo = $('#emailtxt').val();
    if (emailTo == '') {
        alert('Please enter an email id');
        return false;
    }

    var formData = new FormData();
    formData.append('propname', PropName);
    formData.append('propadd', PropAddress);
    formData.append('To', emailTo);
    formData.append('iprid', IPname);


    $.ajax({
        type: "POST",
        url: "/IPR/SendEmailForIPRProprietorAndApplicant",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            //alert('Email has been sent!');
            closeload();
            new PNotify({
                title: 'Success!',
                text: 'Email has been sent!',
                type: 'success',
                delay: 3000
            });
        },

        error: function () {

        },

        failure: function (response) {

        }
        //window.location = encodeURI("/IPR/SendEmailForIPRProprietorAndApplicant?iprid=" + IPname + "&To=" + emailTo + "&propname=" + PropName + "&propadd=" + PropAddress);
        //alert('A mail has been sent to the receiver');
    });
});

function convertdateCopyApplicant(datevalue) {
    if (!datevalue) return '';
    datevalue = datevalue.replace(/\.$/, '');
    let newdate = '';
    let parsedDate = new Date(datevalue);
    if (!isNaN(parsedDate.getTime())) {
        newdate = parsedDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return newdate;
}

//Assign bulk track to propritor
$(document).on('click', '#Tracprop', function () {
    openload();
    var formData = new FormData();
    formData.append('vProprietorSearch', searchName);
    formData.append('vProprietorAddressSearch', searchAddress);
    formData.append('SearchType', "PropritorSearch");


    $.ajax({
        async: true,
        type: "POST",
        url: "/api/IPRApi/AddToTrackProprietorDetails",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            closeload();
            //alert('Tracker Added successfully.');
            $("#msgRUSureCon").text("Marks have been added to the tracker successfully.");
            $("#myModalAlertconfirmation").modal();
           
        },

        error: function () {
            closeload();
        },

        failure: function (response) {
            closeload();
        }

    });
    // closeload();
});


$(document).on('mouseenter', '.freeze-text', function (e) {
    const text = $(this).text().trim();
    // Show tooltip only if text exceeds 35 characters
    if (text.length > 50) {
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
