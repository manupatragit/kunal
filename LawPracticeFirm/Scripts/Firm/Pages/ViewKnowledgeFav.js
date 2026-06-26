$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    loadtabledata(pageindex);
    function searchTable() {
        var input, filter, found, table, tr, td, i, j;
        input = document.getElementById("searchdata");
        filter = input.value.toLowerCase();
        table = document.getElementById("example");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            for (j = 0; j < td.length; j++) {
                if (td[j].innerHTML.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                }
            }
            if (found) {
                tr[i].style.display = "";
                found = false;
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    function searchinfile() {
        var strval = $("#searchdatainfile").val();
        if (strval.length > 2) {
            var $table = '';
            var $header = '';
            var dt = '';
            var q1 = 2;
            $table = $('<table id="example" /><tr><th>').addClass('table-panel ');
            $header = $('<thead>').html('');
            $head1 = $('<th onclick="sortTable(0)" class="fa fa-sort fa-fw pull-right " class="mycursor1"><div class="thbg">Sl. No.</div></th><th onclick="sortTable(1)" class="mycursor1"><div class="thbg">Title</div></th><th onclick="sortTable(2)" class="mycursor1"><div class="thbg">Description</div></th> <th onclick="sortTable(3)"><div class="thbg">Date</div></th> ');
            $header.append($head1);
            $tbc = $('</tr>');
            $header.append($tbc);
            $table.append($header);
            var fcode = localStorage.getItem("FirmCode");
            $.ajax({
                async: true,
                url: '/api/WorkFlowNewApi/ElasticSearchinDoc',
                type: 'POST',
                headers: { 'strtxt': strval },
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    else {
                        alert("not found");
                    }
                    if (response.Data.length > 2) {
                        $("#datastatus").html("");
                    }
                    else {
                        $("#datastatus").html("No result found !");
                    }
                    var it = 2;
                    var qty = 0;
                    $.each(obj, function (i, val) {
                        qty++;
                        var $row = $('<tr />');
                        $row.append($('<td width="50px;" class="s" />').html("<span>" + qty + ""));
                        $row.append($('<td class="item" />').html("<span>" + (val.DocName != "" ? val.DocName : '<span style="visibility: hidden;">.</span>')));
                        $row.append($('<td />').html("<span>" + (val.Content != "" ? val.Content : '<span style="visibility: hidden;">.</span>')));
                        $row.append($('<td />').html("<span name=" + val.Date + ">" + (val.Date != "" ? formatDatetoIST(val.Date) : '<span style="visibility: hidden;">.</span>')));
                        $table.append($row);
                    });
                    $('#updatePanel').html($table);
                    closeloadfav();
                    hideEmptyCols($("#example"));
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    }
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openloadfav();
                    loadtabledata(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeloadfav();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#searchdatas', function () {
        loadtabledata(1);
    });
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            loadtabledata(1);
        }
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        loadtabledata(pageindex);
    });

    function loadtabledata(pageindex) {
        openloadfav();
        var $table = '';
        var $header = '';
        var dt = '';
        var q1 = 2;
        $table = $('<table id="example"  /><tr><th>').addClass('table-panel ');
        $header = $('<thead  >').html('');
        $head1 = $('<th onclick="sortTable(0)" width="10%" class="mycursor1"><div class="thbg">Sl. No. <span class="fa fa-sort fa-fw pull-right"></span> </div></th><th onclick="sortTable(1)" width="14%" class="mycursor1"><div class="thbg">Title <span class="fa fa-sort fa-fw pull-right"></span></div></th><th onclick="sortTable(2)" width="10%" class="mycursor1"><div class="thbg">Date <span class="fa fa-sort fa-fw pull-right"></span></div></th><th onclick="sortTable(3)" class="mycursor1" width="55%"><div class="thbg">Description <span class="fa fa-sort fa-fw pull-right"></span></div></th> <th><div class="thbg">Download</div> </th>  ');
        $header.append($head1);
        $tbc = $('</tr>');
        $header.append($tbc);
        $table.append($header);
        $table.append('<tbody style="clear:both" id="loadactivitydatas">');
        var searchtxt = "";
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", pageindex);
        formdata.append("pagesize", pagesize);
        var fcode = localStorage.getItem("FirmCode");
        var ajaxTime = new Date().getTime();
        $.ajax({
            async: true,
            url: '/api/WorkFlowNewApi/LoadKnowldgeFavDetailsbyrowid',
            data: formdata,
            headers: {
                'title': searchtxt
            },
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                debugger
                var totalTime = new Date().getTime() - ajaxTime;
                //console.log("details:" + totalTime);
                $("#tfooter").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else if (obj.length == 0) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
                }
                else {
                  
                }
                  if(obj.length == 0) {
            document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
        }
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    closeloadfav();
                }
                else {
                    $("#datastatus").html("No result found !");
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    closeloadfav();
                }
                var it = 2;
                var qty = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    var totdata = val.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

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
                            renderPagination(pageindex, totpage);
                        }
                        $("#exportrecords").val(val.totRow);
                    //if (i === 0) {
                    //    firstvalue = val.rownum;
                    //}
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;
                    //    var totdata = val.totRow;
                    //    var totpage = 0;
                    //    if (val.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);
                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#pagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<table style="width:100%;background:white"><tr><td colspan = "12">'
                    //    tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                    //    tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + val.rownum + '</b> of <b style="font-size:12px;">' + val.totRow + ' Entries</b>'
                    //    tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  class="footerInput"><button class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                    //    tfot += '</div>'
                    //    tfot += '<div style="float:right;">'
                    //    if (val.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                    //    }
                    //    else {
                    //        tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                    //    }
                    //    tfot += '</td >'
                    //    tfot += '</tr >'
                    //    $("#tfooter").append(tfot);
                    //    closeloadfav();
                        $("#PinnedCount").text("(" + val.totRow + ")");
                    }
                    qty++;
                    var ftoken = "/DownloadFile.ashx?module=modulek&title=" + val.tfile + "&ftoken=" + val.tid;
                    var $row = $('<tr />');
                    $row.append($('<td width="50px;" class="s" />').html("<span>" + qty + ""));
                    $row.append($('<td class="item" />').html("<span>" + (val.tname != "" ? val.tname : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td class="date" />').html("<span name=" + val.date_time + ">" + (val.date_time != "" ? formatDatetoIST(val.date_time) : '<span style="visibility: hidden;">.</span>')));
                    $row.append($('<td />').html("<span>" + (val.Content != "" ? val.Content : '<span style="visibility: hidden;">.</span>')));
                    if (role == "1" || role == "2") {
                        $row.append($('<td class="contact" />').html("<a download='" + val.tname + "' class=='btn btn - success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>"));
                    }
                    else if (val.DownRight == "1") {
                        $row.append($('<td class="contact" />').html("<a download='" + val.tname + "' class=='btn btn - success' href='" + ftoken + "'><img src='/newassets/img/download-icon.png' /></a>"));
                    }
                    else {
                        $row.append($('<td class="contact" />').html("&nbsp;"));
                    }
                    $table.append($row);
                });
                $('#updatePanel').html($table);
                closeloadfav();
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    //function renderPagination(pageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = pageindex;
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
    //    $("#prev").toggleClass("disabled", pageindex === 1);
    //    $("#next").toggleClass("disabled", pageindex === totdata);
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


    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadtabledata(setPageNo);
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
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#prev", function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadtabledata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#next", function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadtabledata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    loadtabledata(setPageNo);
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
        loadtabledata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/
    //search data
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        loadtabledata();
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    /*Load knowledge details*/
    function Getdata() {
        var searchtype = $('#searchtype').val();
        alert(searchtype);
        if (searchtype == 1) {
            loadtabledata();
        }
        else {
            searchinfile();
        }
    }
});
