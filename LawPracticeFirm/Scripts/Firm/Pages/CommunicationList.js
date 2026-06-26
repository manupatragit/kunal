$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    var fcode = localStorage.getItem("FirmCode");
    var cdcpageindex = 1, cdcpagesize = 10, cdcrecordcount = 0, cdctotrecord = 0;
    var repcommupageindex = 1, repcommupagesize = 10, repcommurecordcount = 0, repcommutotrecord = 0; totalRecordCount = 0;
    var loadcomuid = "";
    $(document).on("click", "#ReplyCommunication", function () {
        $("#hidecomuid").val($(this).attr("data-val"));
        loadcomuid = $(this).attr("data-val");
        isCommPopRnd = false;
        repcommupageindex = 1;
        $("#bindComPopdata").html("");
        loadCommuReply(repcommupageindex, $(this).attr("data-val"));
        $("#myModalreplycommu").modal("show");
    });
    $(document).on("click", "#filelinkcommureply", function () {
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=replycommunique&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
    });

    //Start pagination sub function
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    cdcpageindex = page;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindCaseCommunique(cdcpageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + cdcpageindex + "']").addClass("active");
    //});
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        BindCaseCommunique(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev").click(function () {

    //    if (cdcpageindex > 1) {
    //        cdcpageindex = cdcpageindex - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindCaseCommunique(cdcpageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + cdcpageindex + "']").addClass("active");
    //});

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        BindCaseCommunique(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#next").click(function () {
    //    if (cdcpageindex => 1) {
    //        cdcpageindex = cdcpageindex + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindCaseCommunique(cdcpageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + cdcpageindex + "']").addClass("active");
    //});
    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        BindCaseCommunique(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    setPageNo = goToPage;
    //    //if (!isNaN(goToPage)) {
    //    //    setPageNo = goToPage;
    //    //}

    //    if (goToPage > totalRecordCount || goToPage == 0 || isNaN(goToPage)) {
    //        alert("Please enter a valid page number.");
    //        setPageNo = 1;
    //        return false;
    //    }

    //    //if (goToPage > totalRecordCount) {
    //    //    setPageNo = 1;
    //    //    alert("Please enter a valid page number.");
    //    //    return false;
    //    //}
    //    //else if (goToPage == 0) {
    //    //    setPageNo = 1;
    //    //    alert("Please enter a valid page number.");
    //    //    return false;
    //    //}
    //    isRenderPage = true;
    //    BindCaseCommunique(setPageNo);
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
        BindCaseCommunique(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    /*Pagination End*/

    /*Get communication data by page number*/
    $(document).on('click', '#trepgetdatabypagenum', function () {
        ipageindex = $("#treppagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#trepsotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    loadCommuReply(ipageindex, loadcomuid)
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
    $(document).on('click', '#treppaginate', function () {
        ipageindex = $(this).attr("index");
        loadCommuReply(ipageindex, loadcomuid);
    });
    $(document).on("click", ".page-btncommPop", function () {
        let page = $(this).data("page");
        repcommupageindex = page;
        isCommPopRnd = true;
        $("#poptxtgopage").val("");
        loadCommuReply(repcommupageindex, loadcomuid);
        $(".page-btncommPop").removeClass("active");
        $(this).addClass("active");
    });
    $(document).on("click", "#PopPrev", function () {
        if (repcommupageindex > 1) {
            repcommupageindex = repcommupageindex - 1;
        }
        isCommPopRnd = true;
        $("#poptxtgopage").val("");
        loadCommuReply(repcommupageindex, loadcomuid);

        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + repcommupageindex + "']").addClass("active");
    });


    $(document).on("click", "#PopNext", function () {
        if (repcommupageindex => 1) {
            repcommupageindex = repcommupageindex + 1;
        }
        isCommPopRnd = true;
        $("#poptxtgopage").val("");
        loadCommuReply(repcommupageindex, loadcomuid);

        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + repcommupageindex + "']").addClass("active");
    });

    $(document).on("click", "#divpopGo", function () {
        let goToPage = parseInt($("#poptxtgopage").val());
        if (!isNaN(goToPage)) {
            repcommupageindex = goToPage;
        }
        isCommPopRnd = true;
        loadCommuReply(repcommupageindex, loadcomuid);

        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + repcommupageindex + "']").addClass("active");
    });
    /*Load communication reply*/
    function loadCommuReply(repcommupageindex, commuids) {
        var formData = new FormData();
        formData.append("comid", commuids);
        formData.append("pagenum", repcommupageindex);
        formData.append("pagesize", repcommupagesize);
        formData.append("berieffilter", "");
        formData.append("subjectfilter", "");
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CaseDashboardReplyCaseCommuniqueList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // alert(response.Data);
                if (response.Data == "[]") {
                    //$("#commureplytfooter,#maincontentcommu").hide();
                    $("#divPopPage").hide();
                    $("#noreplyfound").show();
                    closeload();
                    return false;
                }
                //$("#commureplytfooter,#maincontentcommu").show();
                $("#noreplyfound").hide();
                $("#divPopPage").show();
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                var html3 = '';
                var ccount = 0;
                //$("#commureplytfooter table").remove();
                $.each(obj, function (i, a) {
                    ccount = ccount + 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(repcommupagesize);
                        if (parseInt(totdata) % parseInt(repcommupagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        //$("#invpagnumvalue").attr("max", totdata);
                        if (totpage > 1) {
                            $('#PopNext').css("display", "block");

                        }
                        if (repcommupageindex == totpage) {
                            $('#PopNext').hide();
                            $('#PopPrev').css("display", "block");
                        }
                        else {
                            $('#PopPrev').css("display", "block");
                        }
                        if (repcommupageindex == 1) {
                            $('#PopPrev').css("display", "none");
                        }
                        else {
                            $('#PopPrev').css("display", "block");
                        }

                        if (isCommPopRnd == false) {
                            CommPopRenderPagination(repcommupageindex, totpage);
                        }
                    }
                    html3 += '<tr>'
                    html3 += '<td>' + formatDatetoIST(a.date_time) + '</td>'
                    html3 += '<td>' + a.ReplyBrief + '</td>'
                    html3 += '<td>' + a.CreatedBy + '</td>'
                    html3 += '<td style="color:#069;cursor:blank;cursor:pointer;" title="Click here to view documents" id-val="' + a.Rid + '" id="filelinkcommureply">' + (a.DocsCount != 0 ? a.DocsCount + ' document attached.' : '') + '</td>'
                    html3 += '</tr>'

                });

                $("#bindComPopdata").html("");
                $("#bindComPopdata").append(html3);

                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    $('input[type = "date"]').removeAttr("onkeydown");
                    $('input[type = "date"]').removeAttr("onkeypress");
                }
                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
                $('input[type = "date"]').blur(function () {
                    var dateString = $(this).val();
                    if (regex.test(dateString)) {
                        var parts = dateString.split("-");
                        var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                        if (parseInt(parts[0]) < 1900) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        if (parseInt(parts[0]) > 3000) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        if (parseInt(parts[2]) == 00) {
                            $(this).focus();
                            $(this).val("");
                            alert("Please enter a valid date.");
                            return false;
                        }
                        var dtCurrent = new Date();
                        return true;
                    } else {
                        $(this).focus();
                        $(this).val("");
                        alert("Please enter a valid date.");
                        return false;
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
    }



    var isCommPopRnd = false;
    //var setCommPopNo = 1;
    function CommPopRenderPagination(pageindex, totdata) {
        let totPages = totdata;
        repcommupageindex = pageindex;
        let paginationHtml = '';
        let maxVisible = 4; // Visible page numbers before ellipsis

        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btncommPop ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#popUpPageNumbers").html(paginationHtml);
        isCommPopRnd = true;
    }
    /*Save communication reply*/
    $("#sendButton").click(function () {
        var formData = new FormData();
        var details = $("#replymessage").val();
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("FileUploadcommureply").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("FileUploadcommureply").files[i];
            var filename = file.name;
            //validate filechracter
            var fileNameIndex = filename.lastIndexOf("/") + 1;
            var dotIndex = filename.lastIndexOf('.');
            var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
            var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
            if (reg.test(newfioename) == true) {
                alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                return false;
            }
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var Extresponse = checkfileext(filename);
            if (String(Extresponse) == "false") {
                return false;
            }
            formData.append("FileUpload", file);
            try {
                if (typeof (file) != "undefined") {
                    size = parseFloat(file.size / 1024).toFixed(2);
                    tottempsize = parseFloat(tottempsize) + parseFloat(size);
                    tempsize = parseFloat(size);
                }
            }
            catch (err) {
                //alert(err.message);
            }
            tempsize = tempsize.toFixed(2);
            if (tempsize > filesize) {
                new PNotify({
                    title: 'Warning!',
                    text: Filesizelabel,
                    type: 'error',
                    delay: 3000
                });
                return false
            }
        }
        if (tottempsize > parseFloat(TOTALLIMIT)) {
            alert(TOTALLIMITMSG);
            return false;
        }
        formData.append("commuid", $("#hidecomuid").val());
        formData.append("details", details);
        var mykasefileidcommureply = $("#mykasefileidcommureply").val();
        if (String(mykasefileidcommureply) == "undefined") {
            mykasefileidcommureply = "";
        }
        if (totalFiles == 0 && details == "" && mykasefileidcommureply == "") {
            return false;
        }
        formData.append("savemykasefileid", mykasefileidcommureply);
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveReplyCaseCommunique",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data.Result) > 0) {
                    var InfectFilesResult = "";
                    if (response.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    new PNotify({
                        title: 'Success!',
                        text: 'Your message is sent to the desired recipient successfully.</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    $("#mykasefileidcommureply").val("");
                    $("#browsefilecommunique").attr("title", "No file chosen");
                    $("#browsefilelblcommunique").html("No file chosen");
                    $("#replymessage,#FileUploadcommureply").val("");
                    isCommPopRnd = false;
                    loadCommuReply(repcommupageindex, loadcomuid);
                    BindCaseCommunique(cdcpageindex);
                    closeload();
                }
                else if (String(response.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    closeload();
                    return false;
                }
                else if (String(response.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    closeload();
                    return false;
                }
                else {
                    alert(response.Data);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                closeload();
            } //End of AJAX error function
        });
    });

    /*Clear search to search from */
    $("#clearnewseach").click(function () {
        $("#searchto,#searchfrom").val("");
        BindCaseCommunique(1);
        $("#clearnewseach").hide();
    })
    var chksflag = true;
    $("#searchcommu").click(function () {
        if ($("#commuberiefsearch").val() == "") {
            $("#commuberiefsearch").attr("placeholder", "");
            $("#commuberiefsearch").focus();
        } else {
            isRenderPage = false;
            BindCaseCommunique(1);
            $("#clearnewsearchnotes").css("display", "block");
        }
        chksflag = true;
    });
    setInterval(function () {
        var tempdata = localStorage.getItem("savecommunication");
        if (tempdata != "") {
            BindCaseCommunique(1);
            localStorage.setItem("savecommunication", "");
        }
    }, 4000);
    $(document).on('keyup', '#commuberiefsearch', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                BindCaseCommunique(cdcpageindex);
                $("#clearnewsearchnotes").css("display", "block");
                chksflag = false;
            }
        }
    });
    /*Clear note search*/
    $("#clearnewsearchnotes").click(function () {
        $("#commuberiefsearch").val("");
        $("#clearnewsearchnotes").css("display", "none");
        isRenderPage = false;

        BindCaseCommunique(1);
    });

    /*Clear new search*/
    $("#clearnewsearchcase").click(function () {
        $("#casenamesearch").val("");
        $("#clearnewsearchcase").css("display", "none");
        isRenderPage = false;
        BindCaseCommunique(1);
    });

    /*Clear communication search*/
    $("#searchcasecommu").click(function () {
        if ($("#casenamesearch").val() == "") {
            $("#casenamesearch").attr("placeholder", "");
            $("#casenamesearch").focus();
        } else {
            isRenderPage = false
            BindCaseCommunique(1);
            $("#clearnewsearchcase").css("display", "block");
        }
        chksflag = true;
    });

    /*New case dashboard*/
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("tokenid");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });

    $(document).on("click", "#filelinkcommu", function () {
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=communique&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            $('#myModal').modal({ show: true });
        });
    });

    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }

    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    BindCaseCommunique(cdcpageindex);

    /*Bind communication*/
    function BindCaseCommunique(cdcpageindex) {
        var comfromdate = $("#searchfrom").val();
        var comtodate = $("#searchto").val();
        $("#commutfooter").html("");
        var formData = new FormData();
        formData.append("pagenum", cdcpageindex);
        formData.append("pagesize", cdcpagesize);
        formData.append("filtertype", $("#cdcfiltertype").val());
        formData.append("filtercreatedby", $("#cdcfiltercreateby").val());
        formData.append("casename", $("#casenamesearch").val());
        formData.append("berieffilter", $('#commuberiefsearch').val());
        formData.append("filteralertto", $('#cdcfilteralertto').val());
        formData.append("searchfrom", comfromdate);
        formData.append("searchto", comtodate);
        formData.append("adminpersonal", personaltype);
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/CommuniqueList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Data == "[]") {
                    var tcomfot = '';
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

                    $("#cdcommstatus").html('<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No Communication list found</h4>' +
                        '<p>We found no Communication list.</p>' +
                        '</div>');
                    closeload();
                    //tcomfot = '';
                    //tcomfot += '<table style="width:100%;"><tr><td colspan= "12">'
                    //tcomfot += '<div><ul>'
                    //tcomfot += '<li><input value="' + comfromdate + '" type="date" id="searchfrom" onkeypress="return false;" class="form-control" style="border-bottom:1px solid #4b4b4b!important;"></li>'
                    //tcomfot += '<li>&nbsp;&nbsp;</li>'
                    //tcomfot += '<li><input value="' + comtodate + '" type="date" id="searchto" onkeypress="return false;" class="form-control" style="border-bottom:1px solid #4b4b4b!important;"></li>'
                    //tcomfot += '<li><button type="button" id="searchcommunication" style="margin-left:10px;">Search</button></li>'
                    //tcomfot += '</ul></div>'
                    //tcomfot += '</td></tr></table>'
                    //$("#commutfooter").empty().append(tcomfot);
                }
                else {
                    $("#cdcommstatus").html("");
                    closeload();
                }
                var obj = JSON.parse(response.Data);
                var length = obj.length;
                var html3 = '';
                var ccount = 0;
        
                $("#commutfooter table").remove();
                $.each(obj, function (i, a) {
                    ccount = ccount + 1;
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totpage = 0;
                    if (i === (length - 1)) {
                        var totdata = a.totRow
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });

                        totpage = parseInt(totdata) / parseInt(cdcpagesize);
                        if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (cdcpageindex == totpage) {
                            $('#next').hide();
                            $('#prev').css("display", "block"); s
                        }
                        else {
                            $('#next').css("display", "block");
                        }
                        if (cdcpageindex == 1) {
                            $('#prev').css("display", "none");
                        }
                        else {
                            $('#prev').css("display", "block");
                        }
                        if (isRenderPage == false) {
                            totalRecordCount = totpage;
                            renderPagination(cdcpageindex, totpage);
                        }



                        //var pnext = cdcpageindex;
                        //var pprev = cdcpageindex;
                        //var pageno = cdcpageindex;
                        //var totdata = a.totRow;
                        //var totpage = 0;
                        //if (a.totRow > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;
                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(cdcpagesize);
                        //    if (parseInt(totdata) % parseInt(cdcpagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#tpagnumvalue").attr("max", totpage);
                        //}
                        //var tcomfot1 = '';
                        //tcomfot1 += '<table style="width:100%;"><tr><td>'
                        //tcomfot1 += '<div>Page Number <b style="font-size:12px;">' + cdcpageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="tsotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        //tcomfot1 += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                        //tcomfot1 += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No:<input type="number" id="tpagnumvalue" min="1" class="footerInput"><a class="gobtn" type="button" id="tgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button>'
                        //if (a.totRow <= length) {
                        //}
                        //else if (pageno == 1) {
                        //}
                        //else if (pageno == totpage) {
                        //    tcomfot1 += '<span>&nbsp;&nbsp;<a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>'
                        //}
                        //else {
                        //    tcomfot1 += '<span>&nbsp;&nbsp;<a id="tpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>'
                        //}
                        //if (pageno < totpage) {
                        //    tcomfot1 += '<a  id="tpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span >'
                        //}
                        //tcomfot1 += '</div></td><td>'
                        //tcomfot1 += '</td>'
                        //tcomfot1 += '</tr></div>'
                        //$("#commutfooter").empty().append(tcomfot1);
                    }
                    var AssignBycolor = "";
                    var AssignTocolor = "";
                    var ClientName = a.ClientName;
                    var CaseName = a.CaseName;
                    var duerowcss = "";
                    var assignuser = "";
                    if (a.TotalcaseUser == a.TotalCommuUser) {
                        assignuser = "ALL TEAM";
                    }
                    else {
                        assignuser = a.assignuserto;
                    }
                    html3 += '<tr>'
                    html3 += '<td scope="row"><span class="text-success">' + formatDatetoIST(a.CreateDate) + '</span></td>'
                    html3 += '<td style="display:none"><span>' + a.InformationType + '</span></td>'
                    html3 += '<td>'
                    html3 += '<span >' + (a.Subject == null ? "" : a.Subject) + '</span>'
                    html3 += '</td>'
                    if (a.Brief == "" || a.Brief == null || a.Brief == "null") {
                        html3 += '<td class="tbrief" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (a.Brief.length > 60) {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + a.Brief.substring(0, 60) + '</span>'
                            html3 += '<span data-toggle="collapse" data-target="#dto' + ccount + '" style="color:#069;cursor:pointer"> more</span>'
                            html3 += ' <div id="dto' + ccount + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            html3 += '' + a.Brief.trim().replace(/(<([^>]+)>)/ig, '') + ''
                            html3 += '</div>'
                            html3 += '<span style="float:right;cursor:pointer;" id="ReplyCommunication" title="Click here to reply communication." data-val="' + a.Id + '"><i class="fa fa-reply"></i></span>'
                            html3 += '</td>'
                        }
                        else {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + a.Brief.trim().replace(/(<([^>]+)>)/ig, '') + '</span><span style="float:right;cursor:pointer;" id="ReplyCommunication" title="Click here to reply communication." data-val="' + a.Id + '"><i class="fa fa-reply"></i></span></td>'
                        }
                    }
                    if (a.casename == "" || a.casename == null || a.casename == "null") {
                        html3 += '<td class="matternamecommu" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        html3 += '<td class="matternamecommu"><span id="transferpage" tokenid="' + a.CaseId + '" style="color:#069;cursor:pointer;">' + a.casename + '</span></td>'
                    }
                    html3 += '<td>'
                    html3 += '<span id="transferpagetocase" data-id="' + a.ClientID + '"  style="color:#069;cursor:pointer;">' + a.ClientName + '</span>'
                    html3 += '</td>'
                    html3 += '<td>'
                    html3 += '<span >' + a.Createdby + '</span>'
                    html3 += '</td>'
                    if (assignuser == "" || assignuser == null || assignuser == "null") {
                        html3 += '<td class="tbrief" style="' + duerowcss + '" scope="row">&nbsp;</td>'
                    }
                    else {
                        if (assignuser.length > 60) {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + assignuser.substring(0, 60) + '</span>'
                            html3 += '<span data-toggle="collapse" data-target="#userto' + ccount + '" style="color:#069;cursor:pointer"> more</span>'
                            html3 += ' <div id="userto' + ccount + '" class="collapse caseinfo" style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 360px;position: absolute;border-radius: 10px;">'
                            html3 += '' + assignuser + ''
                            html3 += '</div>'
                            html3 += '</td>'
                        }
                        else {
                            html3 += '<td class="tbrief"><span class="comment more" style="">' + assignuser + '</span></td>'
                        }
                    }
                    html3 += '<td>'
                    if (a.DocsCount > 0) {
                        html3 += '<button type="button" class="taskoutboxbtnicon" id-val="' + a.Id + '" id="filelinkcommu"><i class="glyphicon glyphicon-folder-open"></i></button>'
                    }
                    else {
                        html3 += '';
                    }
                    html3 += '</td>'
                    html3 += '</tr>'
                });
                $("#cdbindcommunique").html("");
                $("#cdbindcommunique").append(html3);
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
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    $('input[type = "date"]').removeAttr("onkeydown");
                    $('input[type = "date"]').removeAttr("onkeypress");
                }
                $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
                $('input[type = "date"]').blur(function () {
                    var dateString = $(this).val();
                    if (regex.test(dateString)) {
                        var parts = dateString.split("-");
                        var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                        if (parseInt(parts[0]) < 1900) {
                            $(this).focus();
                            $(this).val("");
                            alert("Invalid Date");
                            return false;
                        }
                        if (parseInt(parts[0]) > 3000) {
                            $(this).focus();
                            $(this).val("");
                            alert("Invalid Date");
                            return false;
                        }
                        if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                            $(this).focus();
                            $(this).val("");
                            alert("Invalid Date");
                            return false;
                        }
                        if (parseInt(parts[2]) == 00) {
                            $(this).focus();
                            $(this).val("");
                            alert("Invalid Date");
                            return false;
                        }
                        var dtCurrent = new Date();
                        return true;
                    } else {
                        $(this).focus();
                        $(this).val("");
                        alert("Invalid Date");
                        return false;
                    }
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }

    /*Bind communication data by page number*/
    $(document).on('click', '#tgetdatabypagenum', function () {
        ipageindex = $("#tpagnumvalue").val();
        if (ipageindex != "undefined") {
            if (Math.sign(ipageindex) == 1) {
                var ipageindesx = $("#tsotopage").text();
                if (ipageindex <= parseInt(ipageindesx)) {
                    BindCaseCommunique(ipageindex);
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
        ipageindex = $(this).attr("index");
        BindCaseCommunique(ipageindex);
    });

    /*Search communication from date range*/
    $(document).on('click', '#searchcommunication', function () {
        isRenderPage = false;
        var comfromdate = $("#searchfrom").val();
        var comtodate = $("#searchto").val();
        if (comfromdate == "" || comtodate == "") {
            alert("Enter date range");
            return false;
        }
        else {
            $("#clearnewseach").show();
            BindCaseCommunique(1);
        }
    });

    /*Clear search from and to*/
    $("#clearnewseach").click(function () {
        $("#searchfrom").val("");
        $("#searchto").val("");
        isRenderPage = false;
        BindCaseCommunique(1)
    })
    $("#cdcfiltertype").change(function () {
        isRenderPage = false;
        BindCaseCommunique(1)
    })
    $("#cdcfiltercreateby").change(function () {
        isRenderPage = false;
        BindCaseCommunique(1)
    })
    $("#cdcfilteralertto").change(function () {
        isRenderPage = false;
        BindCaseCommunique(1)
    })
});
/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
//function renderPagination(cdcpageindex, totdata) {
//    let totPages = totdata;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis
//    if (totdata <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === cdcpageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (cdcpageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === cdcpageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === cdcpageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }
//    $("#pageNumbers").html(paginationHtml);
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
