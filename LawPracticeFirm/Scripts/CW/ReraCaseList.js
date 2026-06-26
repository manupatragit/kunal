$(document).ready(function () {
    fillReraCourt();
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var fcode = localStorage.getItem("FirmCode");
    //$(document).on('click', '#paginate', function () {
    //    ppageindex = $(this).attr("index");
    //    loaddatalist(ppageindex);
    //});
    ///*Get data by page number*/
    //$(document).on('click', '#getdatabypagenum', function () {
    //    ppageindex = $("#pagnumvalue").val();
    //    if (ppageindex != "undefined") {
    //        if (Math.sign(ppageindex) == 1) {
    //            var ppageindesx = $("#sotopage").text();
    //            if (ppageindex <= parseInt(ppageindesx)) {
    //                openload();
    //                loaddatalist(ppageindex);
    //            }
    //            else {
    //                alert("Please enter a valid page number.");
    //                closeload();
    //                return false;
    //            }
    //        }
    //    }
    //});
    /*Pagination Start*/

    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    pageindex = setPageNo;
    //    loaddatalist(pageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev").click(function () {
    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    pageindex = setPageNo;
    //    loaddatalist(pageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        pageindex = setPageNo;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    pageindex = setPageNo;
    //    loaddatalist(pageindex);

    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        pageindex = setPageNo;
        loaddatalist(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    isRenderPage = true;
    //    pageindex = setPageNo;
    //    loaddatalist(pageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
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
        PageNumber = setPageNo;
        isRenderPage = false;
        loaddatalist(PageNumber);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    loaddatalist(pageindex);
    /*Load data list details*/
    function loaddatalist(pageindex) {
        var formData = new FormData();
        var fromdt = "";
        var todt = "";
        var UserCaseIdValue = "";
        var reraCourt = $("#ReraCourt").val();
        if (reraCourt == null) {
            reraCourt = "";
        }
        var Search = $("#rerasearchname").val();
        var SortValue = "";
        var SortValue = $("#tagwords").val();
        formData.append("reraCourt", reraCourt);
        formData.append("Search", Search);
        formData.append("SortValue", SortValue);
        formData.append("PageIndex", pageindex);
        if (fromdt != "" && todt != "") {
            pagesize = 10;
        }

        else {
            pagesize = 10;
        }
        formData.append("PageSize", pagesize);
        formData.append("Datefromvalue", fromdt);
        formData.append("Datetovalue", todt);
        openload();
        var html3 = '';
        $.ajax({
            async: true,
            type: "POST",
            url: "/Rera/MyReraCases",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var length = response1.length;
                var qty = 0;
                if (length > 0) {
                    document.querySelector(".pagination").style.display = "flex";

                    $("#divalertlist tr").remove();
                    $.each(response1, function (i, val) {
                        qty = qty + 1;
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totdata = val.TotalRecord;
                        if (i === (length - 1)) {
                            $("#exportrecords").val(val.TotalRecord);

                            var totalRecord = val.TotalRecord;
                            $('#totRecordData').text(" (" + totalRecord + ")");

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
                        var Slash = "/";
                        html3 += '<tr>'
                        html3 += '<td>' + (val.vCaseNo == null ? "" : val.vCaseNo) + '</td>'
                        html3 += '<td>' + (val.Court == null ? "" : val.Court) + '</td>'
                        html3 += '<td>' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
                        html3 += '<td>' + (val.Advocate == null ? "" : val.Advocate) + '</td>'
                        html3 += '<td>' + (val.NextHearing == null ? "" : val.NextHearing) + '</td>'
                        html3 += '<td>' + (val.Manualnexthearing == null ? "" : val.Manualnexthearing) + '</td>'
                        html3 += '<td>' + (val.DisposedDate == null ? "" : val.DisposedDate) + '</td>'
                        html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>';
                        var htmlUser = "";
                        if (val.UserCaseId != "" && dashcw == "display:unset" && IsCWActive == "1") {
                            htmlUser = "&nbsp;|&nbsp;<span cwid='" + val.UserCaseId + "'  matterid='" + val.MatterID + "' mmnanevalus='" + val.MatterName + "' title='Add user for Live update' id='opencasewatchusermodal' data-toggle='modal' data-target='#casewatchmodelalert' style='cursor:pointer;'><img src='/newassets/img/add-user.png' /></span>";
                        }
                        if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                            //html3 += '<td style="white-space:nowrap;">' + val.MatterName + ' ' + htmlUser + '</td>'
                            html3 += '<td style="white-space:nowrap;">'+'<span class="freeze-text" style="font-size:14px !important; font-weight:500; letter-spacing:0; line-height:20px; width:280px; height:20px; display:inline-block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + val.MatterName + '</span>'+' ' + htmlUser + '</td>'
                            
                        }
                        else {
                           
                            if (val.MatterID == "" || val.MatterID == null || val.MatterID == "null" || val.MatterID == "00000000-0000-0000-0000-000000000000") {
                                html3 += '<td><a href="javascript:void()" id="linkmatter" data-val="' + val.UserCaseId + '">link to matter</a></td>'
                            }
                            else {
                                html3 += '<td style="white-space:nowrap;"><a href="javascript:void()" id="viewmatter" data-val="' + val.MatterID + '">' + val.MatterName + '</a> ' + htmlUser+'</td>'
                            }
                        }
                        html3 += '</tr>'
                    });
                } else {
                    document.querySelector(".pagination").style.display = "none";
                    $("#pagenatedArea").hide();
                    html3 += '<tr>';
                    html3 += '<td colspan="7" align="center">';
                    html3 += '<div style="margin-left: 25% !important;text-align: center;">';
                    html3 += '<img src="/newassets/img/not-found.png" alt="Not Found">';
                    html3 += '<h4>No Case list found</h4>';
                    html3 += '<p>We found no Case list.</p>';
                    html3 += '</div>';
                    html3 += '</td>';
                    html3 += '</tr>';

                }
                $("#allreradatabind").html("").html(html3);
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
    $(document).on('mouseenter', '.freeze-text', function (e) {
        let text = $(this).text().trim();

        if (text.includes('×')) {
            text = text.substring(text.lastIndexOf('×') + 1).trim();
        }
        text = text
            .replace(/\s*Petitioner/gi, '<br/>Petitioner')
            .replace(/\s*Respondent/gi, '<br/>Respondent')
            .trim();
        text = text.replace(/^<br\/>/, '');
        if (this.offsetWidth < this.scrollWidth) {
            $('body').append('<div id="custom-tooltip"></div>');
            $('#custom-tooltip')
                .html(text)
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
    $("#ReraCourt").change(function () {
        isRenderPage = false;
        loaddatalist(pageindex);
    });
    $("#commonsrch").click(function () {
        isRenderPage = false;

        loaddatalist(pageindex);
    });
    /*Link matter*/
    $(document).on("click", "#linkmatter", function () {
        $("#livecaseidhide,#mattersforlink2").val("");
        var ids = $(this).attr("data-val");
        $("#savelinkmatter").attr("data-case", ids);
        $('#myModallinkcase').modal({ show: true });
    });
    /*Save matter list*/
    $("#savelinkmatter").click(function () {
        var matterids = $("#livecaseidhide").val();
        var caseidsids = $(this).attr("data-case");
        if (matterids == "") {
            alert("please select matter");
            return false;
        }
        var formData = new FormData();
        formData.append("matterid", matterids);
        formData.append("caseid", caseidsids);
        openload();
        $.ajax(
            {
                type: "POST",
                url: "/api/matterApi/SaveCaseForCWMAP", // Controller/View
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (parseInt(response.Data) > 0) {
                        alert("case added successfully.");
                        $("#livecaseidhide,#mattersforlink2").val("");
                        $("#closelinkmatter").click();
                        isRenderPage = false;

                        loaddatalist(pageindex);
                        bindcase();
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
    /*View matter*/
    $(document).on("click", "#viewmatter", function () {
        var fcode = localStorage.getItem("FirmCode");
        var token = $(this).attr("data-val");
        var urls = "/" + fcode + "/Firm/CaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $("#exporttoexcel").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 500;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfile" pageno="' + i + '" type="excel">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
    $(document).on("click", "#exporttoexcelfile", function () {
        var fromdt = "";
        var todt = "";
        var UserCaseIdValue = "";
        var reraCourt = $("#ReraCourt").val();
        if (reraCourt == null) {
            reraCourt = "";
        }
        var Search = $("#rerasearchname").val();
        var SortValue = "";
        var SortValue = $("#tagwords").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 500;
        window.location = encodeURI("/Rera/ExportToExcelReraCaseListDetails?reraCourt=" + escape(reraCourt) + "&Search=" + escape(Search) +
            "&SortValue=" + escape(SortValue) + "&Datefromvalue=" + escape(fromdt) + "&Datetovalue=" + escape(todt) +
            "&PageIndex=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    });

    $('#UsersCasewatchAlert').multiselect({
        columns: 1,
        placeholder: 'Select User',
        search: true,
        selectAll: true
    });
    /* Open Modal for Assign case to user */
    $(document).on('click', '#opencasewatchusermodal', function () {
        openload();

        casewatchcaseid = $(this).attr("cwid");
        mkMatterId = $(this).attr("matterid");
        matternamevalus = $(this).attr("mmnanevalus");
        loaduserbycaseid();
        LoadCasewatchAlertUsers();
        closeload();
    });

    /*Save casewatch user*/
    $("#savecasewatchuser").click(function () {
        var formData = new FormData();
        var casealerruser = $("#UsersCasewatchAlert").val();
        if (casealerruser == "") {
            alert("Please select user");
            $("#UsersCasewatchAlert").focus();
            return false;
        }
        formData.append("auser", EncodeText(casealerruser));
        formData.append("caseid", EncodeText(casewatchcaseid));
        formData.append("token", EncodeText(mkMatterId));
        formData.append("matternamesval", EncodeText(matternamevalus));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/SaveCasewatchAlertUsers",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("User Added successfully");
                $("#UsersCasewatchAlert").val("");
                LoadCasewatchAlertUsers();
                closeload();
                $("#UsersCasewatchAlert").multiselect('reload');
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    /*Delete casewatch alert*/
    $(document).on("click", "#deleteCasewatchuseralert", function () {
        var formData = new FormData();
        var auserslist = $(this).attr("data-user");
        var cwid = $(this).attr("data-id");
        formData.append("auser", EncodeText(auserslist));
        formData.append("caseid", EncodeText(cwid));
        formData.append("token", EncodeText(mkMatterId));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/RemoveCasewatchAlertUsers",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("User removed successfully");
                LoadCasewatchAlertUsers();
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
                closeload();
            } //End of AJAX error function
        });
    });
});
var casewatchcaseid = "";
var mkMatterId = "";
var matternamevalus = "";
function loaduserbycaseid() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            var html3 = '';
            $("#UsersCasewatchAlert").html("");
            if (response != null) {
                $.each(obj, function (key, value) {
                    $("#UsersCasewatchAlert").append($("<option></option>").val(value.id).text(value.UserName));
                });
            }
            else {
            }
            $("#UsersCasewatchAlert").multiselect('reload');
        },
        failure: function (response) {
        }, //End of AJAX failure function
        error: function (response) {
            //alert(response.responseText);
        } //End of AJAX error function
    });
}

/*Load casewatch user alert*/
function LoadCasewatchAlertUsers() {
    openload();
    $("#bindcasewatchalertuser").empty()
    var formData = new FormData();
    formData.append("caseid", EncodeText(casewatchcaseid));
    var htmls = '';
    var q1 = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/CasewatchAlertUsersList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response.Data);
            $.each(obj, function (i, a) {
                q1 = q1 + 1;
                htmls += ' <tr><td>' + q1 + '</td><td>' + a["vDispName"] + '</td><td>' + a["email_id"] + '</td><td>' + a["mobile_No"] + '</td><td><span id="deleteCasewatchuseralert" data-id="' + a.Usercseid + '" data-user="' + a.User_Id + '" style="cursor:pointer;" title="Remove user from case alert"><img src="/newassets/img/deletecasesingle-icon.png" /></span></td></tr>';
            }); //End of foreach Loop
            $("#bindcasewatchalertuser").empty().html(htmls);
            closeload();
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });

}
/*Fill rera court*/
function fillReraCourt() {
    var reracourt = "";
    $("#ReraCourt option").remove();
    $.ajax({
        type: "POST",
        url: "/AddCase/BindReraCourtType?reracourt=" + reracourt,
        dataType: "json",
        success: function (data) {
            $("#ReraCourt").append("<option value='0'>Rera Court</option>");
            for (var i = 0; i < data.length; i++) {
                $("#ReraCourt").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}


/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
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
