$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var fcode = localStorage.getItem("FirmCode");
    /*Remove file request*/
    $("#removerequest").click(function () {
        window.location = encodeURI("/firm/RemoveFileRequest");
    })
    var navigateuser1 = localStorage.getItem("navigateuser");
    var pageURL4 = window.location.href;
    baseurl = pageURL4;
    var lastURLSegment4 = pageURL4.substr(pageURL4.lastIndexOf('/') + 1);
    if (String(lastURLSegment4) == "0") {
        localStorage.setItem("navigateuser", "");
    }
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var ffileval = new Array();
    var ffilenames = new Array();
    var ffullpath = new Array();
    $(".validpanel").css("display", "none");
    var timeLeft = 40;
    var timerId = "";
    var checktoken = "";
    var checkopen = false;
    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
        } else {
            $("#overlaytime").text(timeLeft + ' seconds remaining');
            timeLeft--;
        }
    }

    /*Download files*/
    $(document).on("click", "#downloadfile", function () {
        var durl = $(this).attr("href-val");
        some = new URLSearchParams(durl)
        var ftype = some.get('ftype');
        var ftokens = some.get('ftoken');
        if (checkopen == false) {
            window.location.href = durl;
        }
        else {
            if (ftokens == checktoken) {
                if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "DOCX" || ftype == "DOCX" || ftype == "PPT" || ftype == "PPTX") {
                    $("#overlaycontent").text("Please wait while we are preparing document from server ");
                    timeLeft = 60;
                    timerId = setInterval(countdown, 1000);
                    openload();
                    setTimeout(function () {
                        window.location.href = durl;
                        closeload();
                        checkopen = false;
                        $("#overlaycontent").text("");
                    }, 60000);
                }
            }
            else {
                window.location.href = durl;
                checkopen = false;
            }
        }
    });
    // Remove Files
    //$(document).on("click", "#removedirfile", function () {
    //    alert("hi");
    //    var value = $(this).attr("value");
    //    var dname = $(this).attr("directnamefull");
    //    var fid = $(this).attr("fid");
    //    var fpath = $(this).attr("fpath");
    //    // alert(ffid);
    //    //alert(ffdir);
    //    var result = confirm("Are you sure to Delete this file?");
    //    if (result) {
    //        openload();
    //        $.ajax({  async: true, 
    //            type: "POST",
    //            url: "/api/CallApi/RemoveDirectoryFile",
    //            headers: {
    //                'value': value,
    //                'dname': dname,
    //                'fid': fid,
    //                'fpath': fpath
    //            },
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (data) {
    //                var datas1 = JSON.stringify(data);
    //                //  alert(data.Data);
    //                if (data.Data == "1") {
    //                    $("#dirbound").html('');
    //                    LoadDirectoryFiles(pageindex);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: ' File has been removed Successfully.',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                    closeload();
    //                    return false;
    //                }
    //                else {
    //                    new PNotify({
    //                        title: 'info!',
    //                        text: ' Oops ! File can not be deleted.',
    //                        type: 'error',
    //                        delay: 4000
    //                    });
    //                    closeload();
    //                }
    //            },
    //            failure: function (data) {
    //                alert(data.responseText);
    //                closeload();
    //            },
    //            error: function (data) {
    //                alert(data.responseText);
    //                closeload();
    //            }
    //        });
    //    }
    //});
    //revert share file
    localStorage.setItem("ftvaluedata", "/LawPractice_ds/");
    //load contact
    loadcontact();
    // load contact
    function loadcontact() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    //alert(datas);
                }
                else {
                    // alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#dusers").append(option);
                });
                //console.log(response);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    openload();
                    LoadDirectoryFiles(pageindex);
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

    /*Load file directory*/
    $(document).on('click', '#searchdatas', function () {
        LoadDirectoryFiles(1);
    });
    /*Load search data on keyup*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            LoadDirectoryFiles(1);
        }
    });
    var diruser = "";
    /*Load directory files*/
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex);
    });
    $("#dusers").change(function () {
        $(".noactive").css("display", "none");
        var cvalue = $(this).val();
        localStorage.setItem("navigateuser", cvalue);
        diruser = cvalue;
        directoryid = 0;
        LoadDirectoryFiles(1);
    });
    var dirtoken = "";
    LoadDirectoryFiles(pageindex);
    // Load DirectoryFiles
    function LoadDirectoryFiles(pageindex) {
        diruser = $("#dusers").val();
        $("#dirbound").html("");
        openload();
        dirtoken = directoryid;
        var dirid = dirtoken;
        var html = '';
        var html1 = '';
        var marklabel = "";
        var markcolor = "";
        var urlstype = "";
        var togsum = 0;
        var formData = new FormData();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        if (String(roleid) == "1") {
            formData.append("user", diruser);
        }
        else {
            formData.append("user", "");
        }
        formData.append("search", $('#searchdata').val());
        $.ajax({
            async: true,
            url: '/api/callApi/UserRemoveFileListbyrowid',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response1) {
                $("#tfooter").html("");
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    var obj = JSON.parse(response1.Data);
                    var length = obj.length;
                }
                else {
                    closeload();
                }
                try {
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
                        var tmpdir = a.fname;
                        var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                        var dirname = tmpdir.replace(replacedata, '');
                        var dat = a.date_time;
                        var dates1 = formatDatetoIST(dat)
                        var dates2 = a.date_time;
                        var dates1 = formatDatetoIST(dates2)
                        var ficon = "fa fa-language";
                        var icolor = "black";
                        var str = a.filetype;
                        var moveshow = "";
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOCX" || ftype == "DOCX") {
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
                        }
                        if (ftype == "DOCX" || ftype == "DOCX") {
                            if (String(a.dirid) == "00000000-0000-0000-0000-000000000000") {
                                openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
                            }
                            else {
                                openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + a.dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
                            }
                            urlstype = "";
                        }
                        else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "PPT" || ftype == "PPTX") {
                            var pageURL1 = window.location.origin;
                            if (a.directorypath != null) {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + String(a.directorypath) + a.fname;
                                openurl = enctypesingle(downloadpath1);
                            }
                            else {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + a.fname;
                                openurl = enctypesingle(downloadpath1);
                            }
                            urlstype = "office";
                        }
                        else {
                            var pageURL1 = window.location.origin;
                            if (a.directorypath != null) {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + (a.directorypath) + a.fname;
                                openurl = enctypesingle(downloadpath1);
                            }
                            else {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + a.fname;
                                openurl = enctypesingle(downloadpath1);
                            }
                            urlstype = "docs";
                        }
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        var fids = "";
                        var id = 0;
                        if (a.ftype == 1) {
                            var tempdownloadpath = "/LawPractice_ds/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            var xhr = new XMLHttpRequest();
                            xhr.open('HEAD', tempdownloadpath, false);
                            xhr.send();
                            if (xhr.status == "404") {
                                var tempfpaths = a.directorypath;
                                if (String(tempfpaths) == "") {
                                    var downloadpath = "/DownloadFile.ashx??check=true&fld=w&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=&filename=" + a.fname;
                                }
                                else if (String(tempfpaths) == "null") {
                                    var downloadpath = "/DownloadFile.ashx??check=true&fld=w&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=&filename=" + a.fname;
                                }
                                else {
                                    if (a.directorypath != null) {
                                        var downloadpath = "/DownloadFile.ashx??check=true&fld=w&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=" + (a.directorypath).slice(0, -1) + "&filename=" + a.fname;
                                    }
                                    else {
                                        var downloadpath = "/DownloadFile.ashx??check=true&fld=w&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=" + a.directorypath + "&filename=" + a.fname;
                                    }
                                }
                                fids = "w";
                            } else {
                                if (String(tempfpaths) == "") {
                                    var downloadpath = "/DownloadFile.ashx?check=true&fld=m&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=&filename=" + a.fname; //lawp_ds
                                }
                                else if (String(tempfpaths) == "null") {
                                    var downloadpath = "/DownloadFile.ashx?check=true&fld=m&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=&filename=" + a.fname; //lawp_ds
                                }
                                else {
                                    if (a.directorypath != null) {
                                        var downloadpath = "/DownloadFile.ashx?check=true&fld=m&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=" + (a.directorypath).slice(0, -1) + "&filename=" + a.fname; //lawp_ds
                                    }
                                    else {
                                        var downloadpath = "/DownloadFile.ashx?check=true&fld=m&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=" + a.directorypath + "&filename=" + a.fname; //lawp_ds
                                    }
                                }
                                fids = "m";
                            }
                            if (a.movecount == 0) {
                                quesmark = "display:none";
                                moveshow = "cursor:pointer;display:unset;"
                            }
                            else {
                                quesmark = "cursor:pointer;display:unset";
                                moveshow = "display:none;"
                            }
                            if (String(a.IdDeleted) == "1") {
                                marklabel = "Delete File";
                                markcolor = "margin-top:0px; color:red;cursor:pointer";
                            }
                            else {
                                marklabel = "Delete File";
                                markcolor = "margin-top:0px; color:#5c5c5c;cursor:pointer";
                            }
                            html += '<tr><td class="7"><i  name="' + a.fname + '"class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span  downloadpath1="' + downloadpath + '" style="cursor:pointer" id="idss"  value="' + last + '"  href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a></td><td width="100px; ">' + dates1 + '</td><td><btn class="" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + a.directorypath + '"  value="' + a.id + '"></span> <span class="glyphicon glyphicon-trash" ></span></btn>&nbsp;&nbsp;&nbsp;&nbsp;<a class="glyphicon glyphicon-download-alt" style="color:#5c5c5c; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> </a> </span></td><td>' + last + '</td><td>' + a.CreatedBy + '</td></tr>';
                        }
                    });
                }
                catch (err) {
                    // alert(err.message);
                }
                $("#dirbound").append(html);
                closeload();
            },
        });
    }
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';
    jQuery('#modeldocs').click(function (e) {
        var pageURL = window.location.href;
        var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        var fdir = $('#filedirectory').val();
        if (fdir == "") {
            fdir = lastURLSegment
        }
        else {
            fdir = fdir;
        }
        var filename = $('#filename').val();
        if (filename == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: ' Please Enter File name..?',
                type: 'error',
                delay: 3000
            });
        }
        else {
            var urls = $('.document').attr('href');
            var newulrs = urls + "&fname=" + filename + "&dname=" + dirtoken;
            $('#docframe').attr('src', newulrs);
            $('#myModal8').modal({ show: true });
            $('#filename').val("");
            setTimeout(function () {
                $("#dirbound").html('');
                LoadDirectoryFiles(pageindex);
            }, 3000);
        }
    });
    jQuery('#modelspread').click(function (e) {
        var pageURL = window.location.href;
        var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        var fdir = $('#filedirectory').val();
        if (fdir == "") {
            fdir = lastURLSegment
        }
        else {
            fdir = fdir;
        }
        var filename = $('#filename').val();
        if (filename == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: ' Please Enter File name..?',
                type: 'error',
                delay: 3000
            });
        }
        else if (fdir == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: ' Please Select Directory?',
                type: 'error',
                delay: 3000
            });
        }
        else {
            var urls = $('.spreadsheet').attr('href');
            var newulrs = urls + "&fname=" + filename + "&dname=" + fdir;
            $('#docframe').attr('src', newulrs);
            $('#myModal8').modal({ show: true });
            $('#filename').val("");
            setTimeout(function () {
                $("#dirbound").html('');
                LoadDirectoryFiles(pageindex);
            }, 3000);
        }
    });
    jQuery('#modelpresent').click(function (e) {
        var pageURL = window.location.href;
        var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        var fdir = $('#filedirectory').val();
        if (fdir == "") {
            fdir = lastURLSegment
        }
        else {
            fdir = fdir;
        }
        var filename = $('#filename').val();
        if (filename == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: ' Please Enter File name..?',
                type: 'error',
                delay: 3000
            });
        }
        else if (fdir == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: ' Please Select Directory?',
                type: 'error',
                delay: 3000
            });
        }
        else {
            var urls = $('.presentation').attr('href');
            var newulrs = urls + "&fname=" + filename + "&dname=" + fdir;
            $('#docframe').attr('src', newulrs);
            $('#myModal8').modal({ show: true });
            $('#filename').val("");
            setTimeout(function () {
                $("#dirbound").html('');
                LoadDirectoryFiles(pageindex);
            }, 3000);
        }
    });
    $(document).on("click", "#idss", function () {
        var link = $(this).attr("href");
        var value = $(this).attr("value");
        var path1 = $(this).attr("downloadpath1");
        var urltypes = $(this).attr("urltype");
        checkopen = true;
        some1 = new URLSearchParams(path1)
        checktoken = some1.get('ftoken');
        if (value == "DOCX File" || value == "DOC File") {
            $('#spanhead').html("Edit File");
            $('#docframe').attr('src', link);
            $('#myModal8').modal({ show: true });
        }
        else {
            var formdata = new FormData();
            formdata.append("filepath", link);
            formdata.append("urltypes", urltypes);
            formdata.append("baseurl", window.location.origin);
            $.ajax({
                async: true,
                url: '/api/CallApi/Dirfilepath',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    $('#otherdocframe').attr('src', response.Data);
                    $('#myModal9').modal({ show: true });
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    })
});
