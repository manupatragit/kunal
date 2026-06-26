$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var pageindex = 1, pagesize = 20, recordcount = 0, totrecord = 0;
    var isRenderPage = false;
    var totalPageRec = "";
    var urlParams = new URLSearchParams(window.location.search);
    var parameterName = urlParams.get("key");
    var IPname = urlParams.get("IP");

    BindJournalAlertLogHistory(pageindex);

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
    $(document).on('click', "#jAlertHistorytab", function () {
        window.location.href = `/${fcode}/IPR/JournalAlertHistory?IP=${IPname}`;
    })
    /*End page redirection*/

    function BindJournalAlertLogHistory(pageindex) {
        var htmls = '';
        openload();
        var applNo = $("#idApplNoD").val();
        pagesize = 10;
        var trademarkName = $("#idWordmarkd").val();
        var formData = new FormData();
        formData.append("vApplNo", applNo);
        formData.append("trademarkName", trademarkName);
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);

        $.ajax({
            type: "POST",
            url: "/api/IPRApi/ViewJournalAlertHistory",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#exportrecords").val(0);
                var obj = response1.Data.data;
                var length = obj.length;
                var obj1 = obj;
                var qty = 0;
                if (length > 0) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                    $("#journaldatastatus").hide();
                    $("#dtNotFound").text("");
                    $.each(obj1, function (i, val) {
                        $('#tradePagination').show();
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }

                        $("#JournalAlertCount").text("(" + val.TotalRecord + ")");

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

                        //qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var shortText = "";
                        if (val.SimilarTrademark != "") {
                            shortText = val.SimilarTrademark.substring(0, 35) + "...";
                        } else {
                            shortText = "";
                        }
                        htmls += '<tr>'
                        htmls += '<td style="text-align: center; display:none" id="rowid">' + val.RowId + '</td>'
                        htmls += '<td>' + val.vApplNo + '</td>'
                        htmls += '<td>' + val.Trademark + '</td>'
                        // htmls += `<td><span class="short-text">${shortText}</span>
                        //<a class="moreBtn" style="color: blue;" data-full='${JSON.stringify(val.SimilarTrademark)}'>More</a></td>`
                        htmls += `<td><span class="short-text">${shortText}</span>
                       <a class="moreBtn" id="btnShowmoretext" style="color: blue;" data-val='${val.Id}' vappnNo='${val.vApplNo}' >More</a></td>`
                        htmls += '<td>' + val.ReceiverMailId + '</td>'
                        htmls += '<td>' + convertdate(val.ReceivedDate) + '</td>'
                        htmls += '<td>' + val.MailStatus + '</td>'
                        htmls += '<td><a class="download-actionBtn" id="downloadSimTrademark" targetApplNo="' + val.vApplNo + '" target="_blank" style="cursor: pointer;"><img style="width:20px;height:20px;" src="/newassets/img/download.svg"></a></td>'
                        htmls += '</tr>'

                    });
                } else {
                    $('#tradePagination').hide();
                    $("#JournalAlertCount").text("");
                    $("#journaldatastatus").show();
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $("#dtNotFound").html('<center>No alert found</center>');
                }

                $("#bindIPRSearchData").html("").html(htmls);
                closeload();
                //GetStatusList();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);

            }
        });
    }
    $(document).on("click", "#downloadSimTrademark", function () {
        var phVapplNo = $(this).attr("targetapplno");
        var pageno = "1";
        openload();
        var pagesize = "20";
        $('#CommonExportExcel').attr('phVapplNo', phVapplNo);
        var formData = new FormData();
        formData.append("phVapplNo", phVapplNo);
        formData.append("pagenum", pageno);
        formData.append("pagesize1", pagesize);
        $.ajax({
            type: "POST",
            url: "/api/IPRApi/BindCountPhoneticAppl",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var obj = response1.Data.data;
                if (obj[0].TotalRecord > 0) {
                    var tRecord = obj[0].TotalRecord;
                    var recordsection = tRecord / pagesize;
                    recordsection = recordsection + 1;
                    var html = '<option value="" selected>Please Select</option>';
                    for (var i = 1; i < recordsection; i++) {
                        html += '<option value="' + i + '" > ' + i + ' </option>';
                    }
                    $("#id_exportreportdrop").html(html);
                    closeload();
                    $("#myModalexport").modal({ show: true });
                }
            }
        })

        //window.location = encodeURI("/IPR/DownloadPhoneticAlertDetail?phVapplNo=" + phVapplNo + "&pagenum=" + pageno + "&pagesize1=10");
    })

    $(document).on("click", "#CommonExportExcel", function () {
        var phVapplNo = $(this).attr("phVapplNo");
        var PageIndex = $("#id_exportreportdrop").val();
        if (PageIndex == "") {
            alert("Please select the page no.");
            return false;
        }
        window.location = encodeURI("/IPR/DownloadPhoneticAlertDetail?phVapplNo=" + phVapplNo + "&pagenum=" + PageIndex + "&pagesize1=20");
    })

    $(document).on("click", ".moreBtn1", function () {
        var fullText = $(this).data("full");
        $("#fullText").text(fullText);
        $("#popup").fadeIn();
    });

    var morePageNo = 1;
    var jId = "";
    var jvApplN = "";
    $(document).on("click", "#btnShowmoretext", function () {
        jId = $(this).attr("data-val");
        jvApplN = $(this).attr("vappnNo");
        issameRenderPage = false;
        BindSimilarTrademark(morePageNo,jId, jvApplN);
    });
    var samesetTotalRecord = 1;
    function BindSimilarTrademark(morePageNo, jId, jvApplN) {
        openload();
        var pagesize = "10";
        var htmls = '';
        var formData = new FormData();
        formData.append("journalHId", jId);
        formData.append("jApplNo", jvApplN);
        formData.append("pagenum", morePageNo);
        formData.append("pagesize", pagesize);
        $.ajax({
            type: "POST",
            url: "/api/IPRApi/ViewSimilarTrademark",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $('#viewaddedtrademarkdata').modal("show");
                var obj = response1.Data.data;
                var length = obj.length;
                if (length > 0) {
                    $('#sametradePagination').show();
                    $("#samepdatastatus").hide();
                    $.each(obj, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        if (i === (length - 1)) {
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (morePageNo == totpage) {
                                $('#samenext').hide();
                                $('#sameprev').css("display", "block");
                            }
                            else {
                                $('#samenext').css("display", "block");
                            }
                            if (morePageNo == 1) {
                                $('#sameprev').css("display", "none");
                            }
                            else {
                                $('#sameprev').css("display", "block");
                            }
                            if (issameRenderPage == false) {
                                samesetTotalRecord = totpage;
                                samerenderPagination(morePageNo, totpage);
                            }
                        }
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;

                        htmls += '<tr>'
                        htmls += '<td style="text-align: center; display:none" id="rowid">' + val.RowId + '</td>'
                        htmls += '<td>' + val.Trademark + '</td>'
                        htmls += '<td>' + val.SimilarTrademark + '</td>'
                        htmls += '<td>' + val.SameAppNo + '</td>'
                        htmls += '<td>' + val.vclass + '</td>'
                        htmls += '</tr>'

                    });
                } else {
                    $('#sametradePagination').hide();
                    $("#samepdatastatus").show();
                    $("#dtNotFound").html('<center>Data not found</center>');
                }

                $("#bindPhoneticallyIPRSearchData").html("").html(htmls);
                closeload();
            }

        })
    }
    /*Pagination Start*/
    var issameRenderPage = false;
    var sametotalPageRec = "";
    var samesetPageNo = 1;
    function samerenderPagination(pageindex, totdata) {
        let totPages = totdata;
        samesetPageNo = pageindex;
        totalPageRec = totdata;
        let samepaginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis
        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                samepaginationHtml += `<button class="samepage-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    samepaginationHtml += `<button class="samepage-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                samepaginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    samepaginationHtml += `<button class="samepage-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#samepageNumbers").html(samepaginationHtml);
        issameRenderPage = true;
    }
    var samesetPageNo = 1;
    $(document).on("click", ".samepage-btn", function () {
        let page = $(this).data("page");
        samesetPageNo = page;
        isRenderPage = true;
        $("#sametxtgopage").val("");
        BindSimilarTrademark(samesetPageNo, jId, jvApplN);

        $(".samepage-btn").removeClass("active");
        $(".samepage-btn[data-page='" + samesetPageNo + "']").addClass("active");
    });
    $(document).on("click", "#sameprev", function () {
        if (samesetPageNo > 1) {
            samesetPageNo = samesetPageNo - 1;
        }
        issameRenderPage = true;
        $("#sametxtgopage").val("");
        BindSimilarTrademark(samesetPageNo, jId, jvApplN);
        $(".samepage-btn").removeClass("active");
        $(".samepage-btn[data-page='" + samesetPageNo + "']").addClass("active");
    });
    $(document).on("click", "#samenext", function () {
        if (samesetPageNo => 1) {
            samesetPageNo = samesetPageNo + 1;
        }
        issameRenderPage = true;
        $("#sametxtgopage").val("");
        BindSimilarTrademark(samesetPageNo, jId, jvApplN);
        $(".samepage-btn").removeClass("active");
        $(".samepage-btn[data-page='" + samesetPageNo + "']").addClass("active");
    });
    $(document).on("click", "#samedivGo", function () {
        let samegoToPage = parseInt($("#sametxtgopage").val());
        if (!isNaN(samegoToPage)) {
            samesetPageNo = samegoToPage;
        }
        if (samegoToPage > samesetTotalRecord || samegoToPage == 0 || isNaN(samegoToPage)) {
            alert("Please enter a valid page number.");
            samesetPageNo = 1;
            return false;
        }
        issameRenderPage = true;
        BindSimilarTrademark(samesetPageNo, jId, jvApplN);
        $(".samepage-btn").removeClass("active");
        $(".samepage-btn[data-page='" + samesetPageNo + "']").addClass("active");
    });
    /*Pagination End*/


    // close popup
    $("#closePopup, #popup").on("click", function (e) {
        if (e.target.id === "popup" || e.target.id === "closePopup") {
            $("#popup").fadeOut();
        }
    });

    function convertdate(dateString) {
        const date = new Date(dateString);

        // Array of month short names
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
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
        BindJournalAlertLogHistory(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#prev", function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        BindJournalAlertLogHistory(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        BindJournalAlertLogHistory(setPageNo);
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
        isRenderPage = false;
        BindJournalAlertLogHistory(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    /*Pagination End*/


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

    $(document).on("click", "#btnsearch", function () {
        isRenderPage = false;
        BindJournalAlertLogHistory(pageindex);
    });
    $(document).on("click", "#btnclear", function () {
        $("#idApplNoD").val("");
        $("#idWordmarkd").val("");
        isRenderPage = false;
        BindJournalAlertLogHistory(pageindex);
    });




})