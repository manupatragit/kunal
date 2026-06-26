var cdcpageindex = 1, cdcpagesize = 10, cdcrecordcount = 0, cdctotrecord = 0;
$(document).ready(function () {
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    BindClientCommunique(cdcpageindex);
    LoadCreatedby();
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    var chksflag = true;
    /*Search communication details*/
    $("#searchcommu").click(function () {
        BindClientCommunique(1);
        chksflag = true;
    });
    $(document).on('keyup', '#commuberiefsearch', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                BindClientCommunique(cdecpageindex);
                chksflag = false;
            }
        }
    });
    /*Get client communication details by page number*/
    $(document).on('click', '#tgetdatabypagenum', function () {
        cdecpageindex = $("#tpagnumvalue").val();
        if (cdecpageindex != "undefined") {
            if (Math.sign(cdecpageindex) == 1) {
                var ipageindesx = $("#tsotopage").text();
                if (cdecpageindex <= parseInt(ipageindesx)) {
                    BindClientCommunique(cdecpageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#tpaginate', function () {
        cdecpageindex = $(this).attr("index");
        BindClientCommunique(cdecpageindex);
    });
    openload();
    $("#cdcfiltertype").change(function () {
        BindClientCommunique(1)
    })
    $("#cdcfiltercreateby").change(function () {
        BindClientCommunique(1)
    })
    var tatalRecordCount = 1;
    /*Bind client communication details*/
    function BindClientCommunique(cdcpageindex) {
        $("#commutfooter").html("");
        var formData = new FormData();
        formData.append("pagenum", EncodeText(cdcpageindex));
        formData.append("pagesize", EncodeText(cdcpagesize));
        formData.append("filtertype", EncodeText($("#cdcfiltertype").val()));
        formData.append("filtercreatedby", EncodeText($("#cdcfiltercreateby").val()));
        formData.append("berieffilter", EncodeText($('#commuberiefsearch').val()));
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/ClientCommunicationList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Data == "[]") {
                    //var nodata = '<tr><td colspan="6" align="center">No result found !</td></tr>'
                    //$("#bindclientcommunicationdata").html(nodata);
                    $("#pdatastatus").show();
                    $("#dvPaginationShowHide").hide();
                    closeload();
                    return;
                }
                else {
                    //$("#bindclientcommunicationdata").html("");
                    $("#pdatastatus").hide();
                    $("#dvPaginationShowHide").show();
                    closeload();
                }
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                var html3 = '';
                var qty1 = 0;
                $.each(obj, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(cdcpagesize);
                        if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (cdcpageindex == totpage) {
                            $('#nextCo1').hide();
                            $('#prevCo1').css("display", "block");
                        }
                        else {
                            $('#nextCo1').css("display", "block");
                        }
                        if (cdcpageindex == 1) {
                            $('#prevCo1').css("display", "none");
                        }
                        else {
                            $('#prevCo1').css("display", "block");
                        }

                        if (isRenderPage == false) {
                            tatalRecordCount = totpage;
                            renderPagination(pageindex, totpage);
                        }
                    //if (i === 0) {
                    //    firstvalue = a.rownum;
                    //}
                    //if (i === (length - 1)) {
                    //    var pnext = cdcpageindex;
                    //    var pprev = cdcpageindex;
                    //    var pageno = cdcpageindex;
                    //    var totdata = a.totRow;
                    //    var totpage = 0;
                    //    if (a.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(cdcpagesize);
                    //        if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#tpagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="tsotopage" style="display:none">' + totpage + '</span></li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + cdcpageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="tpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="tgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    //    if (a.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="tpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }

                    //    tfot += '</ul>'
                    //    $("#commutfooter").append(tfot);
                    }
                    qty1 = qty1 + 1;
                    var AssignBycolor = "";
                    var AssignTocolor = "";
                    var ClientName = a.ClientName;
                    var CaseName = a.CaseName;
                    var assignuser = "";
                    if (a.TotalcaseUser == a.TotalCommuUser) {
                        assignuser = "ALL TEAM";
                    }
                    else {
                        assignuser = a.assignuserto;
                    }
                    html3 += '<tr>'
                    html3 += '<td scope="row" class="commDate"><span class="text-success">' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    html3 += '<td class="commType" style="display:none;"><span>' + a.InformationType + '</span></td>'
                    html3 += '<td  class="commBrief">'
                    html3 += '<span id="clname" style="word-break: break-all;">' + a.Brief.trim() + '</span><br>'
                    html3 += '</td>'
                    html3 += '<td class="commmattername">'
                    html3 += '<span id="" style="word-break: break-all;">' + a.mattername + '</span><br>'
                    html3 += '</td>'
                    html3 += '<td class="commCreatedBy">'
                    html3 += '<span >' + a.Createdby + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="commAlertTo">'
                    html3 += '<span >' + assignuser + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="commsubject">'
                    if (a.Subject == "" || a.Subject == null || a.Subject == "null") {
                        html3 += '<span >&nbsp;</span>'
                    }
                    else {
                        html3 += '<span >' + a.Subject + '</span>'
                    }
                    html3 += '</td>'
                    html3 += '<td class="commAttachments">'
                    if (a.DocsCount > 0) {
                        html3 += '<button type="button" class="btn  btn-sm" id-val="' + a.Id + '" id="filelink"><i class="glyphicon glyphicon-folder-open"></i></button>'
                    }
                    else {
                        html3 += '';
                    }
                    html3 += '</td>'
                    html3 += '</tr>'
                });
                $("#bindclientcommunicationdata").html("");
                $("#bindclientcommunicationdata").append(html3);
                var showChar = 150;
                var ellipsestext = "...";
                var moretext = "more";
                var lesstext = "less";
                $('.more').each(function () {
                    var content = $(this).html();
                    if (content.length > showChar) {
                        var c = content.substr(0, showChar);
                        var h = content.substr(showChar - 1, content.length - showChar);
                        var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="javascript:void()" class="morelink">' + moretext + '</a></span>';
                        $(this).html(html);
                    }
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
            } //End of AJAX error function
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            return false;
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
                paginationHtml += `<button class="page-btnCo1 ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btnCo1 ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btnCo1 ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#pageNumbersCo1").html(paginationHtml);
        $("#prevCo1").toggleClass("disabled", pageindex === 1);
        $("#nextCo1").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }


    var setPageNo = 1;
    $(document).on("click", ".page-btnCo1", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        $("#txtgopageCo1").val("");
        BindClientCommunique(setPageNo);
        $(".page-btnCo1").removeClass("active");
        $(".page-btnCo1[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#prevCo1", function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopageCo1").val("");
        BindClientCommunique(setPageNo);
        $(".page-btnCo1").removeClass("active");
        $(".page-btnCo1[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#nextCo1", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopageCo1").val("");
        BindClientCommunique(setPageNo);
        $(".page-btnCo1").removeClass("active");
        $(".page-btnCo1[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#divGoCo1", function () {
        let goToPage = parseInt($("#txtgopageCo1").val());
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
        BindClientCommunique(setPageNo);
        $(".page-btnCo1").removeClass("active");
        $(".page-btnCo1[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
    $("input:checkbox").click(function () {
        var column = "table ." + $(this).attr("name");
        $(column).toggle();
    });
    /*Create file link for communication */
    $(document).on("click", "#filelink", function () {
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=communique&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    var moretext = "more";
    var lesstext = "less";
    $(document).on("click", ".morelink", function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
    $("#oexcel").click(function () {
        var cdcfiltertype = $('#cdcfiltertype').val();
        var cdcfiltercreateby = $('#cdcfiltercreateby').val();
        var commuberiefsearch = $('#commuberiefsearch').val();
        window.location = encodeURI("/firm/ExportoExcelClientCommunication?status=true&cdcfiltertype=" + cdcfiltertype + "&cdcfiltercreateby=" + cdcfiltercreateby + "&commuberiefsearch=" + commuberiefsearch);
    })
    $("#opdf").click(function () {
        var cdcfiltertype = $('#cdcfiltertype').val();
        var cdcfiltercreateby = $('#cdcfiltercreateby').val();
        var commuberiefsearch = $('#commuberiefsearch').val();
        window.location = encodeURI("/firm/ExportoPDFClientCommunication?status=true&cdcfiltertype=" + cdcfiltertype + "&cdcfiltercreateby=" + cdcfiltercreateby + "&commuberiefsearch=" + commuberiefsearch);
    })
    /*Client Communication Created By list*/
    function LoadCreatedby() {
        $("#cdcfiltercreateby").html("");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/ClientCommuniqueCreatedBylist",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                var option = '<option value="">Created By</option>';
                $("#cdcfiltercreateby").append(option);
                $.each(obj, function (i, a) {
                    option = '<option value="' + a["Userid"] + '"  tempUserName="' + a["Createdby"] + '"> ' + a["Createdby"] + '</option>';
                    $("#cdcfiltercreateby").append(option);
                });
                //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    //For Customization Popup Open
    $("#ColumnSelectionopen").click(function () {
        //LoadColumnMaster();
        $('#myModalCustomizedcolumn').modal({ show: true });
    });
});