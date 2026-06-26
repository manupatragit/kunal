$(document).ready(function () {

    var pageindex = 1, pagesize = 10;
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loaddatalist(ppageindex);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    /*Paginate*/
    $(document).on('click', '#paginate', function () {
        ppageindex = $(this).attr("index");
        loaddatalist(ppageindex);
    });
    /*Load data list*/
    loaddatalist(pageindex);
    function loaddatalist(pageindex) {
        var formData = new FormData();
        var loginuserid = $("#luserId").val();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("SearchUserName", loginuserid);
        openload();
        var html3 = '';
        $("#bindMatterData").html("");
        $("#ptfooter").html("");
        var Licaselit = $.ajax({
            async: true,
            type: "POST",
            url: "/CW/AssignCaseCountByUserId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = JSON.parse(response1);
                var length = obj.length;
                var qty = 0;
                if (length > 0) {
                    $("#pdatastatus").hide();
                    $('#mtrPagination').show();
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        if (i === (length - 1)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;
                            var totdata = val.totRow;
                            var totpage = 0;
                            if (val.totRow > 0) {
                                //pnext = parseInt(pnext) + 1;
                                //if (pnext == 0) pnext = 1;
                                //pprev = parseInt(pageno) - 1;
                                //if (pprev == 0) pprev = 1;
                                //totpage = parseInt(totdata) / parseInt(pagesize);
                                //if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                //    totpage = parseInt(totpage) + 1;
                                //}
                                //$("#pagnumvalue").attr("max", totpage);
                                totpage = parseInt(totdata) / parseInt(pagesize);
                                if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                if (pageindex == totpage) {
                                    $('#next').hide();
                                    //$('#next').css("display", "none");
                                    $('#prev').css("display", "block"); s
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
                                    tatalRecordCount = totpage;
                                    renderPagination(pageindex, totpage);
                                }
                            }
                            var tfot = '';
                            $("#exportrecords").val(val.totRow);
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button></a> </li>'
                            //if (val.TotalRecord <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>   <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>    <span>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#ptfooter").html("");
                            //$("#ptfooter").html(tfot);
                        }
                        qty = qty + 1;
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var casenotfoundcolorstyle = "";

                        html3 += '<tr>'
                        html3 += '<td class="srno">' + val.rownum + '</td>';
                        html3 += '<td class="username">' + val.UserName + '</td>';
                        html3 += '<td class="UserId">' + val.LoginId + '</td>';
                        html3 += '<td class="mattercount"><a style="color:#0059c1;" id="transferpage" href="javascript:void()" sno=' + val.Id + '>' + val.totalcount + '</a></td>';
                        html3 += '</tr>'
                    });
                } else {
                    closeload();
                    //$("#ptfooter").html("");
                    //html3 += '<td colspan=11 align=center>Data Not Found</td>'
                    //html3 += '<tr>'
                    $("#pdatastatus").show();
                    $('#mtrPagination').hide();
                }
                $("#bindMatterData").html("");
                $("#bindMatterData").html("").html(html3);
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
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > tatalRecordCount) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        loadflag = true;
        isRenderPage = true;
        loaddatalist(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    /*Export to excel*/
    $("#exporttoexcellogin").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 50;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttoexcelfilelogin" pageno="' + i + '" type="excel">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });

    $(document).on("click", "#exporttoexcelfilelogin", function () {    

        var loginusername = $("#luserId").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 50;
        window.location = encodeURI("/CW/ExportToExcelUserCaseListReport?status=true&loginusername=" + escape(loginusername) +"&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    });

    /*Export to pdf*/
    $("#exporttopdflogin").click(function () {
        $("#myModalexport").modal({ show: true });
        var totalRecord = $("#exportrecords").val();
        var pagesize = 50;
        var recordsection = totalRecord / pagesize;
        recordsection = recordsection + 1;
        var html = '';
        for (var i = 1; i < recordsection; i++) {
            html += '<tr>';
            html += '<td>Page No:' + i + ' </td>';
            html += '<td><span style="cursor:pointer;color:#069;" id="exporttopdffilelogin" pageno="' + i + '" type="pdf">Download File</span></td>';
            html += '</tr>';
        }
        $("#printexport").html(html);
    });
    $(document).on("click", "#exporttopdffilelogin", function () {

        var loginusername = $("#luserId").val();
        var pagenum = $(this).attr("pageno");
        var pagesizedata = 50;
        window.location = encodeURI("/CW/ExportToPdfUserCaseReport?status=true&loginusername=" + escape(loginusername) + "&pagenum=" + escape(pagenum) + "&pagesize=" + escape(pagesizedata));
    });

    $("#lloginuserid").click(function () {
        var UserId = $("#luserId").val();
        if (UserId == "") {
            alert("Please enter login userid");
            $("#luserId").focus();
            return false;
        }
        $("#loginuseridclearnewsearch").show();
        isRenderPage = true;
        loaddatalist(pageindex);
    });
    $("#loginuseridclearnewsearch").click(function () {
        $("#loginuseridclearnewsearch").hide();
        $("#luserId").val("");
        isRenderPage = true;
        loaddatalist(pageindex);
    });

    var fcode = localStorage.getItem("FirmCode");
    //Redirect to Matter List
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        //var urls = "/" + fcode + "/Firm/CaseList";
        var urls = "/" + fcode + "/Firm/StandardCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "auserids": token }
        });
    });

});