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
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;
    var dirtoken = "";
    LoadDirectoryFiles(pageindex);
    $("#removerequest").click(function () {
        window.location = encodeURI("/Azure/RemoveFileRequest");
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
    /*Download file on click*/
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
    /*Remove Files on click*/
    //$(document).on("click", "#removedirfile", function () {
    //    var value = $(this).attr("value");
    //    var dname = $(this).attr("directnamefull");
    //    var fid = $(this).attr("fid");
    //    var fpath = $(this).attr("fpath");
    //    var code = $(this).attr("code");
    //    openload();
    //    var result = confirm("Are you sure to Delete this file?");
    //    if (result) {
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/AzureApi/RemoveDirectoryFile",
    //            headers: {
    //                'value': value,
    //                'dname': dname,
    //                'fid': fid,
    //                'fpath': fpath,
    //                'code': code
    //            },
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (data) {
    //                var datas1 = JSON.stringify(data);
    //                if (String(data.Data) == "alreadycheckout") {
    //                    new PNotify({
    //                        title: 'info!',
    //                        text: 'File can not be removed until document is check in.',
    //                        type: 'error',
    //                        delay: 4000
    //                    });
    //                    closeload();
    //                    return false;
    //                }
    //                else {
    //                    if (parseInt(data.Data) > 0) {
    //                        $("#dirbound").html('');
    //                        LoadDirectoryFiles(pageindex);
    //                        new PNotify({
    //                            title: 'Success!',
    //                            text: ' File has been removed Successfully.',
    //                            type: 'success',
    //                            delay: 3000
    //                        });
    //                        closeload();
    //                        return false;
    //                    }
    //                    else {
    //                        new PNotify({
    //                            title: 'info!',
    //                            text: ' Oops ! File can not be deleted.',
    //                            type: 'error',
    //                            delay: 4000
    //                        });
    //                        closeload();
    //                    }
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
    //    else {
    //        closeload();
    //    }
    //});

    $(document).on("click", "#removedirfile", function () {
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var code = $(this).attr("code");
        
        //var result = confirm("Are you sure to Delete this file?");
        //if (result) {
            
        //}
        //else {
        //    closeload();
        //}
        $("#myModalFileConfirmation").modal();
        $("#deleteFileDetails").attr("valId", value);
        $("#deleteFileDetails").attr("dname", dname);
        $("#deleteFileDetails").attr("fid", fid);
        $("#deleteFileDetails").attr("fpath", fpath);
        $("#deleteFileDetails").attr("code", code);

    });
    $(document).on("click", "#deleteFileDetails", function () {
        var value = $(this).attr("valId");
        var dname = $(this).attr("dname");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var code = $(this).attr("code");
        RemoveDirectoryFileRec(value, dname, fid, fpath, code);
    });
    function RemoveDirectoryFileRec(value, dname, fid, fpath, code) {
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/RemoveDirectoryFile",
            headers: {
                'value': value,
                'dname': dname,
                'fid': fid,
                'fpath': fpath,
                'code': code
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var datas1 = JSON.stringify(data);
                if (String(data.Data) == "alreadycheckout") {
                    new PNotify({
                        title: 'info!',
                        text: 'File can not be removed until document is check in.',
                        type: 'error',
                        delay: 4000
                    });
                    closeload();
                    return false;
                }
                else {
                    if (parseInt(data.Data) > 0) {
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File has been removed Successfully.',
                            type: 'success',
                            delay: 3000
                        });
                        $("#myModalFileConfirmation").modal("hide");
                        closeload();
                        return false;
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: ' Oops ! File can not be deleted.',
                            type: 'error',
                            delay: 4000
                        });
                        closeload();
                    }
                }
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
    /*Remove multiple files*/
    multiplefiledata = [];
    multiplefiledata.length = 0;
    $(document).on("click", "#removeMultiplefile", function () {
        multiplefiledata.length = 0;
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                var code = $(this).attr("code");
                var directnamefull = $(this).attr("directnamefull");
                var fid = $(this).attr("fid");
                var fpath = $(this).attr("fpath");
                var value = $(this).attr("value");
                multiplefiledata.push({
                    code: code,
                    directoryname: directnamefull,
                    fid: fid,
                    fpath: fpath,
                    value: value
                });
            }
        });
        var formData = new FormData();
        formData.append("multiplefilesdata", JSON.stringify(multiplefiledata));
        if (multiplefiledata.length == 0) {
            alert("please select file");
            return false;
        }
        var result = confirm("Are you sure to Delete The selected files?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/RemoveMultipleFiles",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    if (String(data.Data) == "alreadycheckout") {
                        new PNotify({
                            title: 'info!',
                            text: 'File can not be removed until document is check in.',
                            type: 'error',
                            delay: 4000
                        });
                        closeload();
                        return false;
                    }
                    else {
                        if (parseInt(data.Data) > 0) {
                            $("#dirbound").html('');
                            LoadDirectoryFiles(pageindex);
                            new PNotify({
                                title: 'Success!',
                                text: ' File has been removed Successfully.',
                                type: 'success',
                                delay: 3000
                            });
                            closeload();
                            return false;
                        }
                        else {
                            new PNotify({
                                title: 'info!',
                                text: 'File can not be removed until document is check in.',
                                type: 'error',
                                delay: 4000
                            });
                            closeload();
                        }
                    }
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
    });
    /*Revert share file*/
    localStorage.setItem("ftvaluedata", "/LawPractice_ds/");

    /*Load contact*/
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
                }
                else {
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#filteruserdocument").append(option);
                });
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
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
    /*Search data*/
    $(document).on('click', '#searchdatas', function () {
        /* your code here */
        isCommPopRnd = false;
        $("#clearnewseach").show();
        LoadDirectoryFiles(1);
    });
    /*Clear Search data*/
    $(document).on('click', '#clearnewseach', function () {
        /* your code here */
        isCommPopRnd = false;
        $("#clearnewseach").hide();
        $("#searchdata,#filteruserdocument").val("");
        LoadDirectoryFiles(1);
    });
    $(document).on('keyup', '#searchdata', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            LoadDirectoryFiles(1);
        }
    });
    /*Load directory file*/
    var diruser = "";
    $(document).on('click', '#paginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex);
    });
    $("#filteruserdocument").change(function () {
        $(".noactive").css("display", "none");
        var cvalue = $(this).val();
        localStorage.setItem("navigateuser", cvalue);
        diruser = cvalue;
        directoryid = 0;
        LoadDirectoryFiles(1);
    });
    /*Load Directory Files*/
    function LoadDirectoryFiles(pageindex) {
        diruser = $("#filteruserdocument").val();
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
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        if (String(roleid) == "1") {
            formData.append("user", EncodeText(diruser));
        }
        else {
            formData.append("user", EncodeText(""));
        }
        formData.append("search", EncodeText($('#searchdata').val()));
        var dts = $.ajax({
            async: true,
            url: '/api/AzureApi/UserRemoveFileListbyrowid',
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
                if (length == 0) {
                    $("#pdatastatus").show();
                    $("#divshared").hide();
                    $("#docDeleteCount").text("");
                }
                else {
                    $("#pdatastatus").hide();
                    $("#divshared").show();
                }
                try {
                    $.each(obj, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        var totdata = a.totRow;
                        $("#docDeleteCount").text("(" + a.totRow + ")");
                        if (i === (length - 1)) {
                            //var pnext = pageindex;
                            //var pprev = pageindex;
                            //var pageno = pageindex;
                            //var totdata = a.totRow;
                            //var totpage = 0;
                            //if (a.totRow > 0) {
                            //    pnext = parseInt(pnext) + 1;
                            //    if (pnext == 0) pnext = 1;
                            //    pprev = parseInt(pageno) - 1;
                            //    if (pprev == 0) pprev = 1;
                            //    totpage = parseInt(totdata) / parseInt(pagesize);
                            //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //        totpage = parseInt(totpage) + 1;
                            //    }
                            //    $("#pagnumvalue").attr("max", totpage);
                            //}
                            //var tfot = '';
                            //tfot += '<table style="width:100%;background:white"><tr><td colspan = "12">'
                            //tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                            //tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                            //tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  class="footerInput"><button class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                            //tfot += '</div>'
                            //tfot += '<div style="float:right;">'
                            //if (a.totRow <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                            //}
                            //else {
                            //    tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a id="paginate" class="btn btn-default" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                            //}
                            //tfot += '</td >'
                            //tfot += '</tr >'
                            //$("#tfooter").append(tfot);
                            //closeload();
                            

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#PopNext').hide();
                                $('#PopPrev').css("display", "block");
                            }
                            else {
                                $('#PopNext').css("display", "block");
                            }
                            if (pageindex == 1) {
                                $('#PopPrev').css("display", "none");
                                //$('#PopNext').show();
                            }
                            else {
                                $('#PopPrev').css("display", "block");
                            }

                            if (isCommPopRnd == false) {
                                setTotalRecord = totpage;
                                RenderPagination(pageindex, totpage);
                            }

                        }
                        var tmpdir = a.fname;
                        var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                        var dirname = tmpdir.replace(replacedata, '');
                        var dat = a.date_time;
                        var dates1 = formatDatetoIST(dat)
                        var dates2 = a.date_time;
                        var dates1 = formatDatetoIST(dates2)
                        var ficon = "doc-icon.png";
                        var icolor = "black";
                        var str = a.filetype;
                        var moveshow = "";
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOCX" || ftype == "DOCX") {
                                ficon = "doc-icon.png";
                                icolor = "#1860a3";
                            }
                            if (ftype == "PPT") {
                                ficon = "ppt.png";
                                icolor = "orange";
                            }
                            if (ftype == "PDF") {
                                ficon = "pdf-icon.png";
                                icolor = "red";
                            }
                            if (ftype == "ZIP") {
                                ficon = "zip.png";
                                icolor = "orange";
                            }
                            if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                                ficon = "png.png";
                                icolor = "#1860a3";
                            }
                            if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                                ficon = "xlsx.png";
                                icolor = "green";
                            }
                            if (ftype == "TXT") {
                                ficon = "txt_icon.png";
                                icolor = "skyblue";
                            }
                        }
                        if (ftype == "DOC" || ftype == "DOCX") {
                            if (String(a.dirid) == "00000000-0000-0000-0000-000000000000") {
                                openurl = bsurlfile + '/Docs/ViewSampleCloud?fileName=' + a.fname + '&dname=&ftoken=' + a.firmId + '&utoken=' + a.Firmuser + '&token=' + a.id;
                            }
                            else {
                                openurl = bsurlfile + '/Docs/ViewSampleCloud?fileName=' + a.fname + '&dname=' + a.dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser + '&token=' + a.id;
                            }
                            urlstype = "";
                        }
                        else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "PPT" || ftype == "PPTX") {
                            var pageURL1 = window.location.origin;
                            if (a.directorypath != null) {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + String(a.directorypath) + a.fname;
                                openurl = downloadpath1;
                            }
                            else {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + a.fname;
                                openurl = downloadpath1;
                            }
                            urlstype = "office";
                        }
                        else {
                            var pageURL1 = window.location.origin;
                            if (a.directorypath != null) {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + (a.directorypath) + a.fname;
                                openurl = downloadpath1;
                            }
                            else {
                                var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + a.fname;
                                openurl = downloadpath1;
                            }
                            urlstype = "docs";
                        }
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        var fids = "";
                        var id = 0;
                        if (a.ftype == 1) {
                            fids = "m";
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
                            var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                            if (a.Isconfidential == 1) {
                                html += '<tr><td slign="center"><span><input type="checkbox" code="' + a.AZureFileId + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + a.directorypath + '"  value="' + a.id + '" class="checkbox" /></span></td>';
                                html += '<td class="7"><div class="file_wrapper"><img src="/newassets/img/' + ficon + '" name="' + a.fname + '" /> <span> ' + a.fname + '</span></div></td><td width="100px; ">' + dates1 + '</td><td><ul class="action-ul"><li class="action_one" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" code="' + a.AZureFileId + '" id="removedirfile" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + a.directorypath + '"  value="' + a.id + '"> <span class="<span class="action_one> <img src="/newassets/img/delete.svg" /> </span> </li></ul></td><td>' + last + '</td><td>' + a.FileSize + '</td><td>' + a.CreatedBy + '</td><td>' + a.DeleteRequestByUserName + '</td>';
                                if (a.MarkRemark == "" || a.MarkRemark == null || a.MarkRemark == "null") {
                                    html += '<td class="overdnote"  scope="row">&nbsp;</td>'
                                }
                                else {
                                    if (a.MarkRemark.length > 60) {
                                        html += '<td class="overdnote"><span class="comment more" style="">' + a.MarkRemark.substring(0, 60) + '</span>'
                                        html += '<span data-toggle="collapse" data-target="#dt' + dctq + '" style="color:#069;cursor:pointer"> more</span>'
                                        html += ' <div id="dt' + dctq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                                        html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dt' + dctq + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                        html += '' + a.MarkRemark + ''
                                        html += '</div>'
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td class="overdnote"><span class="comment more" style="">' + a.MarkRemark + '</span></td>'
                                    }
                                }
                                html += '</tr>'
                            }
                            else {
                                html += '<tr><td slign="center"><span><input type="checkbox" code="' + a.AZureFileId + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + a.directorypath + '"  value="' + a.id + '" class="checkbox" /></span></td>';
                                html += '<td class="7"><div class="file_wrapper"><img width="32px" height:32px src="/newassets/img/' + ficon + '" name="' + a.fname + '" /><span class="" downloadpath1="' + downloadpath + '" style="cursor:pointer" id="idss"  value="' + last + '"  href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></div></td><td width="100px; ">' + dates1 + '</td><td><ul class="action-ul" style="gap: 7px;"><li><span class="action_one" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" code="' + a.AZureFileId + '" id="removedirfile" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + a.directorypath + '"  value="' + a.id + '"> <img src="/newassets/img/delete.svg" /> </span></li><li><span class="action_one" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> <img src="/newassets/img/dowload.svg" /> </span> </li></ul> </td><td>' + last + '</td><td>' + a.FileSize + '</td><td>' + a.CreatedBy + '</td><td>' + a.DeleteRequestByUserName + '</td>';
                                if (a.MarkRemark == "" || a.MarkRemark == null || a.MarkRemark == "null") {
                                    html += '<td class="overdnote"  scope="row">&nbsp;</td>'
                                }
                                else {
                                    if (a.MarkRemark.length > 60) {
                                        html += '<td class="overdnote"><span class="comment more" style="">' + a.MarkRemark.substring(0, 60) + '</span>'
                                        html += '<span data-toggle="collapse" data-target="#dt' + dctq + '" style="color:#069;cursor:pointer"> more</span>'
                                        html += ' <div id="dt' + dctq + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                                        html += '<button type ="button" class="close" data-toggle="collapse" data-target="#dt' + dctq + '" style="padding-top:-34px;margin-top:-5px;">×</button>'
                                        html += '' + a.MarkRemark + ''
                                        html += '</div>'
                                        html += '</td>'
                                    }
                                    else {
                                        html += '<td class="overdnote"><span class="comment more" style="">' + a.MarkRemark + '</span></td>'
                                    }
                                }
                                html += '</tr>'
                            }
                        }
                    });
                }
                catch (err) {
                }
                $("#dirbound").append(html);
                closeload();
            },
        });
    }
    //Start pagination
    var isCommPopRnd = false;
    var setPageNo = 1;
    var setTotalRecord = 1;
    var totalPageRec = "";
    function RenderPagination(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        totalPageRec = totdata;

        let paginationHtml = '';
        let maxVisible = 4;
        let delta = 2;
        if (totPages <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        else {
            paginationHtml += `<button class="page-btncommPop ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

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
                paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
            paginationHtml += `<button class="page-btncommPop ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
        }
        $("#popUpPageNumbers").html(paginationHtml);
        $("#PopPrev").toggleClass("disabled", pageindex === 1);
        $("#PopNext").toggleClass("disabled", pageindex === totPages);
        isCommPopRnd = true;
    }

    //$(document).on("click", ".page-btncommPop", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    isCommPopRnd = true;
    //    $("#poptxtgopage").val("");
    //    LoadDirectoryFiles(setPageNo);
    //    $(".page-btncommPop").removeClass("active");
    //    $(this).addClass("active");
    //});
    $(document).on("click", ".page-btncommPop", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isCommPopRnd = false;
        $("#poptxtgopage").val("");
        LoadDirectoryFiles(setPageNo);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });
    //$(document).on("click", "#PopPrev", function () {
    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isCommPopRnd = true;
    //    $("#poptxtgopage").val("");
    //    LoadDirectoryFiles(setPageNo);
    //    $(".page-btncommPop").removeClass("active");
    //    $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", "#PopPrev", function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isCommPopRnd = false;
        $("#poptxtgopage").val("");

        //renderPagination(setPageNo, totalPageRec)
        LoadDirectoryFiles(setPageNo);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#PopNext", function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    isCommPopRnd = true;
    //    $("#poptxtgopage").val("");
    //    LoadDirectoryFiles(setPageNo);
    //    $(".page-btncommPop").removeClass("active");
    //    $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", "#PopNext", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isCommPopRnd = false;

        $("#poptxtgopage").val("");
        LoadDirectoryFiles(setPageNo);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });
    //$(document).on("click", "#divpopGo", function () {
    //    let goToPage = parseInt($("#poptxtgopage").val());
    //    if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
    //        alert("Please enter a valid page number.");
    //        setPageNo = 1;
    //        return false;
    //    }

    //    isCommPopRnd = true;
    //    LoadDirectoryFiles(setPageNo);
    //    $(".page-btncommPop").removeClass("active");
    //    $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", "#divpopGo", function () {
        let goToPage = parseInt($("#poptxtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        // pageindex = setPageNo;
        isCommPopRnd = false;
        LoadDirectoryFiles(setPageNo);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });

    //End pagination

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
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    $(document).on("click", "#idss", function () {
        var link = $(this).attr("href");
        var value = $(this).attr("value");
        var path1 = $(this).attr("downloadpath1");
        var urltypes = $(this).attr("urltype");
        checkopen = true;
        checktoken = getParameterByName('token', path1);
        codes = getParameterByName('code', path1);
        if (value == "DOCX File" || value == "DOC File") {
            $('#spanhead').html("Edit File");
            $('#docframe').attr('src', link);
            $('#myModal8').modal({ show: true });
        }
        else {
            var formdata = new FormData();
            formdata.append("filepath", EncodeText(link));
            formdata.append("code", EncodeText(codes));
            formdata.append("urltypes", EncodeText(urltypes));
            formdata.append("baseurl", EncodeText(window.location.origin));
            $.ajax({
                async: true,
                url: '/api/AzureApi/Dirfilepath',
                data: formdata,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    $('#otherdocframe').attr('src', response.Data);
                    $('#myModal9').modal({ show: true });
                    closeload();
                },
                error: function () {
                    alert('Error!');
                    closeload();
                }
            });
        }
    })
});
