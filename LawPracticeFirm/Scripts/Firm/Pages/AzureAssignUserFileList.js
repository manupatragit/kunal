$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    /*Get data by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    LoadDirectoryFiles(pageindex);
                    //closeload();
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
    /*Delete file from azure*/
    $(document).on("click", "#DeleteFile", function () {
        var formData = new FormData();
        formData.append("code", $(this).attr("code"));
        openload();
        $.ajax({
            async: true,
            url: "/api/callApi/AzureSaveArchiveFile",
            data: formData,
            contentType: false,
            processData: false,
            type: "POST",
            success: function (response) {
                if (String(response.Data) == "1") {
                    alert("File removed successfully.");
                    LoadDirectoryFiles(pageindex);
                    closeload();
                    return false;
                }
                else {
                    closeload();
                    return false;
                }
            },
            error: function () {
                alert('Error!');
                closeload();
            }
        });
    });
    var chksflag = true;
    /*Search data om click*/
    $(document).on('click', '#searchdatas', function () {
        $("#searchdatas").attr("disabled", true);
        LoadDirectoryFiles(1);
        chksflag = true;
    });
    /*Search data on key up*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                LoadDirectoryFiles(1);
                chksflag = false;
            }
        }
    });
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex);
    });
    openload();
    LoadDirectoryFiles(pageindex);
    // Load DirectoryFiles
    var fcode = localStorage.getItem("FirmCode");
    var urlstype = "";
    var bsurlfile = window.location.origin + "/" + fcode;
    function LoadDirectoryFiles(pageindex) {
        $("#dirbound").html("");
        var formData = new FormData();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        formData.append("search", $("#searchdata").val());
        var html = '';
        var html1 = '';
        var togsum = 0;
        var ajaxTime = new Date().getTime();
        var qty = 0;
        var j1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/AzureAssignUserFileListbyrowid",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                $("#tfooter").html("");
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    var obj = JSON.parse(response1.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (a.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<table style="width:100%;background:white"><tr><td colspan = "12">'
                        tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                        tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  style="width: 30px;"><button type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                        tfot += '</div>'
                        tfot += '<div style="float:right;">'
                        if (a.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                        }
                        tfot += '</td >'
                        tfot += '</tr >'
                        $("#tfooter").append(tfot);
                        closeload();
                    }
                    try {
                        var dates2 = a.date_time;
                        var dates1 = formatDatetoIST(dates2);
                        var ficon = "fa fa-language";
                        var icolor = "black";
                        var str = a.FileName;
                        var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                        var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                        var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                        if (ftype == "DOC" || ftype == "DOCX") {
                            ficon = "fa fa-file-word-o";
                            icolor = "#1860a3";
                        }
                        if (ftype == "PPT") {
                            ficon = "fa fa-file-powerpoint-o";
                            icolor = "orange";
                        }
                        if (ftype == "PDF") {
                            ficon = "fa fa-file-pdf-o";
                            icolor = "red";
                        }
                        if (ftype == "ZIP") {
                            ficon = "fa fa-file-archive-o";
                            icolor = "orange";
                        }
                        if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                            ficon = "fa fa-file-photo-o";
                            icolor = "#1860a3";
                        }
                        if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                            ficon = "fa fa-file-excel-o";
                            icolor = "green";
                        }
                        if (ftype == "TXT") {
                            ficon = "fa fa-file-code-o";
                            icolor = "skyblue";
                        }
                        qty = qty + 1;
                        html += '<tr><td><span class="' + ficon + '" style="color:' + icolor + '"></span>&nbsp;&nbsp; &nbsp; &nbsp;' + a.FileName + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + ftype + '</td><td ><a href="javascript:void()" title="Remove document" style="color:red" code="' + a.Id + '" id="DeleteFile" ><span class="glyphicon glyphicon-trash"></span></a> &nbsp;&nbsp;<a href="/' + fcode + '/azure/DownloadFile/?status=true&filename=' + a.FileName + '&code=' + a.FileId + '" target="_blank" title="Download document" style="color:green"  id="DownloadFile" ><span class="glyphicon glyphicon-download"></span></a></td><td>' + a.username + '</td></tr>';
                    }
                    catch (err) {
                        alert(err.message);
                    }
                });
                $("#dirbound").append(html);
                $("#searchdatas").removeAttr("disabled");
                closeload();
            },
        });
    }
    var fcode = localStorage.getItem("FirmCode");
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';
});