let selectedpostedFile = [];

$(document).ready(function () {
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
    function validatercasefile(param) {
        var reg = /_matter_[0-9]{5}$/g
        if (reg.test(param) == false) {
            return false;
        }
        else {
            return true;
        }
    }
    var tempcasetoken = "";
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecassignuserdataord = 0;
    LoadDirectoryFiles(pageindex);
    $(document).on("click", "div .dropdown-menu", function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $("#directory").change(function () {
    });
    if (rcasename != "") {
        $("#fileclientdiv").css("display", "none");
        $("#filecasedivlevel").css("display", "block");
        $("#filecasediv").css("display", "none");
        $("#filecasedivleveltxt").text(rcasename);
    }
    else {
        if (directoryid != "0") {
            $("#fileclientdiv").css("display", "none");
            $("#filecasedivlevel").css("display", "none");
            $("#filecasediv").css("display", "none");
            $("#filecasedivleveltxt").css("display", "none");
        }
    }
    var resetusrflag = "false";
    /*Reset Office users*/
    $("#resetofficeusers").click(function () {
        resetusrflag = localStorage.getItem("docsclosestatus");
        var docsmode = localStorage.getItem("docsmode");
        if (docsmode == "view") {
        }
        else {
            var modeltimer = localStorage.getItem("docsmodetimer");
            if (modeltimer == "") {
                setTimeout(function () {
                    alert("Changes have been saved successfully and the same will reflect in your account soon..");
                }, 1000);
            }
        }
        if (resetusrflag == "true") {
            var formData = new FormData();
            formData.append("dirid", EncodeText($("#hiddirectid").val()));
            $.ajax({
                async: true,
                url: '/api/AzureApi/RemoAllOfficeUser',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    resetusrflag = false;
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
    /*Load details on client change*/
    //$("#client").change(function () {
    //    $('#directory').prop('selectedIndex', 0);
    //    $('#cmatter').prop('selectedIndex', 0);
    //    LoadDirectory();
    //    $('#cmatter').empty();
    //    var clientds = $(this).val();
    //    if (clientds != "") {
    //        loadmatters(clientds);
    //    }
    //    else {

    //        //var clientds = "00000000-0000-0000-0000-000000000000";
    //        $('#cmatter').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
    //      //  loadmatter4(1, clientds, "");

    //        return false;
    //    }
    //});
    /*Load matter detail */
    function loadmatter4(pagenumber2, clientds1 = "", companyId1 = "") {
        $('#cmatter').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        var formData = new FormData();
        formData.append("Pageno", pagenumber2);
        formData.append("clientid", clientds1);
        formData.append("companyids", companyId1);
        openload();
        $.ajax({
            async: true,
            url: "/api/callApi/LoadAllMatterByFirmId",
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (response.Data.length == a.totRow) {
                        $("#casemoreoptiondiv4").hide();
                    } else {
                        if (a.totRow > 500) {
                            //show more option
                            $("#casemoreoptiondiv4").show();
                        }
                        else {
                            //hide more option
                            $("#casemoreoptiondiv4").show();
                        }
                    }
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $('#cmatter').append(option);
                    }
                });
                closeload();
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
    }
    /*upload files*/
    $(document).on("click", "#uploadfile", function () {
        $('#client').prop('selectedIndex', 0);
        var clientds = "00000000-0000-0000-0000-000000000000";
        $('#cmatter').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        loadmatter4(1, clientds, "");
    });
    /*Load matter details*/
    //function loadmatters(clientid) {
    //    $("#cmatter").empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: "/api/callApi/LoadMatterforclient",
    //        headers: {
    //            "clientid": clientid
    //        },
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //            }
    //            else {
    //            }
    //            $.each(JSON.parse(response.Data), function (i, a) {
    //                var mattername = a.mname;
    //                var mid = a.Id;
    //                if (mattername == null) {
    //                    mattername = "";
    //                    mid = "";
    //                }
    //                else {
    //                    var option = '<option value="' + mid + '" > ' + mattername + '</option>';
    //                    $("#cmatter").append(option);
    //                }
    //            });
    //            return false;
    //        },
    //        failure: function (response) {
    //            alert(data.responseText);
    //        },
    //        error: function (response) {
    //            alert(data.responseText);
    //        }
    //    });
    //    return false;
    //}
    /*Load contact details*/
    function loadcontact1() {
        $("#client").empty();
        var option7 = '<option value="" >Select Client</option>';
        $("#client").append(option7);
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpClientData',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    try {
                        var obj = JSON.parse(response.Data);
                    }
                    catch (e) {
                    }
                }
                else {
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a.LoginId + '" >' + a.Username + ' (' + a.cfname + ') </option> ';
                    $("#client").append(option);
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
    var fcode = localStorage.getItem("FirmCode");
    var loadcontactflag = false;
    /*Attach document*/
    $("#attachment").change( async function () {
        var tempsize1 = 0;
        var tottempsize1 = 0;
        var totalFiles1 =selectedpostedFile.length;
        for (var i = 0; i < totalFiles1; i++) {
            var file1 =selectedpostedFile[i];
            var filename1 = file1.name;
            displaypostedFile();
            if (filename1.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                $("#attachment").val("");
                return false;
            }
            var checkFileText = await checkPdfForScripts(file1);
            if (checkFileText == "Suspicious file") {
                alert("Your file is suspicious. Please upload another file.");
                return false;
            }
            var Extresponse = checkfileextDOC(filename1);
            if (String(Extresponse) == "false") {
                return false;
            }
            try {
                if (typeof (file1) != "undefined") {
                    size1 = parseFloat(file1.size / 1024).toFixed(2);
                    tottempsize1 = parseFloat(tottempsize1) + parseFloat(size1);
                    tempsize1 = parseFloat(size1);
                }
            }
            catch (err) {
            }
            tempsize1 = tempsize1.toFixed(2);
        }
    });
    /*Mark as confidential file*/
    $(document).on("click", "#MarkConfidential", function () {
        var filetoken = $(this).attr("data-val");
        var markconfidenttype = $(this).attr("marktype");
        var findinuse = $("#InUse" + filetoken).attr("id");
        if (String(findinuse) != "undefined") {
            alert("The file is currently in use. Before marking it as confidential, please make sure it is not in use.");
            return false;
        }
        var formdata = new FormData();
        formdata.append("token", EncodeText(filetoken));
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/MarkConfidentDocument',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (parseInt(response.Data) == 1) {
                    //alert("You are not authorized to mark the document as confidential.");
                    if (markconfidenttype == 1) {
                        $("#ids_Confd").html("Non Confidential");
                        document.getElementById('confNonConf').src = '/newassets/img/delete-notice.png';
                    }
                    else {
                        $("#ids_Confd").html("Marked Confidential");
                        document.getElementById('confNonConf').src = '/newassets/img/delete-notice.png';
                    }
                    
                    $("#msgConfFile").html("You are not authorized to mark the document as confidential.")
                    closeload();
                }
                else if (parseInt(response.Data) > 0) {
                    LoadDirectoryFiles(pageindex);
                    //alert("Document security has been saved successfully.");
                    if (markconfidenttype == 1) {
                        $("#ids_Confd").html("Non Confidential");
                        document.getElementById('confNonConf').src = '/newassets/img/marked-non-con.png';
                    }
                    else {
                        $("#ids_Confd").html("Marked Confidential");
                        document.getElementById('confNonConf').src = '/newassets/img/marked-con.png';
                    }
                    $("#msgConfFile").html("Document security has been saved successfully.")
                    closeload();
                }
                else {
                    if (markconfidenttype == "1") {
                        //alert("You cannot mark the document as non-confidential");
                        if (markconfidenttype == 1) {
                            $("#ids_Confd").html("Non Confidential");
                            document.getElementById('confNonConf').src = '/newassets/img/marked-non-con.png';
                        }
                        else {
                            $("#ids_Confd").html("Marked Confidential");
                            document.getElementById('confNonConf').src = '/newassets/img/marked-con.png';
                        }
                        $("#msgConfFile").html("You cannot mark the document as non-confidential")
                    }
                    else {
                        //alert("You cannot mark the document as confidential");
                        if (markconfidenttype == 1) {
                            $("#ids_Confd").html("Non Confidential");
                            document.getElementById('confNonConf').src = '/newassets/img/marked-non-con.png';
                        }
                        else {
                            $("#ids_Confd").html("Marked Confidential");
                            document.getElementById('confNonConf').src = '/newassets/img/marked-con.png';
                        }
                        $("#msgConfFile").html("You cannot mark the document as confidential")
                       
                    }
                    closeload();
                }
                $("#myModalFileConfidential").modal();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    /*Open edit box*/
    $(document).on("click", "#OpenEditBox", function () {
        var filetoken = $(this).attr("data-val");
        var formdata = new FormData();
        formdata.append("token", EncodeText(filetoken));
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/FileDetailsFordocEdit',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var obj = JSON.parse(response.Data);
                $.each(obj, function (i, a) {
                    $("#editfilename").text(a.fname);
                    $("#editfilenamehidden").val(filetoken);
                    if (a.fdetails == null || a.fdetails == "NULL") {
                        $("#filedetailsedit").val("");
                    }
                    else {
                        $("#filedetailsedit").val(a.fdetails);
                    }
                });
                $("#myModal4").modal();
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    var dochispageindex = 1, dochispagesize = 10, dochisrecordcount = 0, dochistotrecord = 0;
    var tempdocidshistory = "";
    $(document).on('click', '#dochispaginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        loadactivity(pageindex, tempdocidshistory);
        closeload();
    });
    /*Get document history by page number*/
    $(document).on('click', '#dochisgetdatabypagenum', function () {
        pageindex = $("#dochispagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#dochissotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    loadactivity(pageindex, tempdocidshistory);
                    closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    /*Load activity details*/
    function loadactivity(dochispageindex, documentid) {
        $("#loadactivitydata").html("");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(dochispageindex));
        formdata.append("pagesize", EncodeText(dochispagesize));
        formdata.append("docid", EncodeText(documentid));
        tempdocidshistory = documentid;
        var qty1 = 0;
        var html = '';
        var ajaxTime1 = new Date().getTime();
        $.ajax({
            async: true,
            url: "/api/CallApi/BindDocumentRecentActivity",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Data != "[]") {
                    $("#pdatastatus").hide();
                    $("#docPagination").show();

                }
                else {
                    $("#pdatastatus").show();
                    $("#docPagination").hide();
                    $("#loadactivityfooter").html("No result found !");
                    closeload();
                }
                var totalTime1 = new Date().getTime() - ajaxTime1;
                console.log("activity:" + totalTime1);
                //if (response.Data == "[]") {
                //    $("#loadactivityfooter").html("No result found !");
                //    var tfot = '';
                //    tfot += '<div class="row settingpanel" style="margin: 14px 0 0 0;">'
                //    tfot += '<div class="col-md-8"><div style="float:left;">Page Number <b style="font-size:12px;">0</b> &nbsp;of <b style="font-size:12px;"><span id="dochissotopage">0</span> Pages</b>'
                //    tfot += '&nbsp;|&nbsp;<b style="font-size:12px;">Total 0 Entries</b>'
                //    tfot += '</div>'
                //    tfot += '<div style="float:left; padding: 4px 0 0 10px;">'
                //    tfot += '</div></div>'
                //    $("#footeractivitydata").html("");
                //    $("#footeractivitydata").html(tfot);
                //}

                var obj = JSON.parse(response.Data);
                var length = obj.length;
                $("#footeractivitydata table").remove();
                //$("#loadactivitydata ul").remove();
                $.each(obj, function (index, a) {
                    if (index === 0) {
                        firstvalue = a.rownum;
                    }
                    $('#docPagination').show();
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (index === (length - 1)) {
                        //var pnext = dochispageindex;
                        //var pprev = dochispageindex;
                        //var pageno = dochispageindex;
                        //var totdata = a.totRow;
                        //var totpage = 0;
                        //if (a.totRow > 0) {
                        //    pnext = parseInt(pnext) + 1;
                        //    if (pnext == 0) pnext = 1;
                        //    pprev = parseInt(pageno) - 1;
                        //    if (pprev == 0) pprev = 1;
                        //    totpage = parseInt(totdata) / parseInt(dochispagesize);
                        //    if (parseInt(totdata) % parseInt(dochispagesize) != 0) {
                        //        totpage = parseInt(totpage) + 1;
                        //    }
                        //    $("#dochispagnumvalue").attr("max", totpage);
                        //}
                        //var tfot = '';
                        //tfot += '<div class="row settingpanel" style="margin: 14px 0 0 0;">'
                        //tfot += '<div class="col-md-8"><div style="float:left;">Page Number <b style="font-size:12px;">' + pageindex + '</b> &nbsp;of <b style="font-size:12px;"><span id="dochissotopage">' + parseInt(totpage) + '</span> Pages</b>'
                        //tfot += '&nbsp;|&nbsp;<b style="font-size:12px;">Total ' + a.totRow + ' Entries</b>'
                        //tfot += '&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="dochispagnumvalue" min="1"  style="width: 30px;"><button type="button" id="dochisgetdatabypagenum" style="margin-left:10px;padding:3px 5px !important;" class="sbtbtn">Go</button>'
                        //tfot += '</div>'
                        //tfot += '<div style="float:left; padding: 4px 0 0 10px;">'
                        //if (a.totRow <= length) {
                        //}
                        //else if (pageno == 1) {
                        //}
                        //else if (pageno == totpage) {
                        //    tfot += '<a id="dochispaginate" class="btn btn-primary" style="padding: 5px 5px !important;" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i>Previous</a>'
                        //}
                        //else {
                        //    tfot += '<a id="dochispaginate" class="btn btn-primary" style="padding: 5px 5px !important;" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i>Previous</a>'
                        //}
                        //if (pageno < totpage) {
                        //    tfot += '<a id="dochispaginate" class="btn btn-primary" title="Next Page" style="padding: 5px 5px !important; margin:0 0 0 10px;" href="javascript:void()" index="' + pnext + '"  >Next <i class="glyphicon glyphicon-chevron-right"></i></a>'
                        //}
                        //$("#footeractivitydata").html("");
                        //$("#footeractivitydata").html(tfot);
                        //$("#loadactivityfooter").html('');


                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (dochispageindex == totpage) {
                            $('#docNext').hide();
                            $('#docPrev').css("display", "block");
                        }
                        else {
                            $('#docNext').css("display", "block");
                        }
                        if (dochispageindex == 1) {
                            $('#docPrev').css("display", "none");
                        }
                        else {
                            $('#docPrev').css("display", "block");
                        }

                        if (isDocRnd == false) {
                            docTotRecord = totpage;
                            DocPaginationDetail(dochispageindex, totpage);
                        }
                    }
                    qty1 = qty1 + 1;
                    //html += '<ul class="todo-list" style="list-style-type:none;">'
                    var linkpage = "";
                    var recentactivitycss = "";
                    var recenttext = "";
                    var recentlabel = "";
                    var recentlabelmode = "";
                    recentlabelmode = a.notification;
                    recentlabelmode = recentlabelmode.replace("You", a.UserName);
                    //html += '<li class="recent"><span class="text">' + recentlabelmode + '</span><span> ' + formatDatetoIST(a.date_time) + ' ' + a.date_time.substring(11, 19) + '</span></li>'
                    //html += '</ul>'
                    //html += '<table class="todo-list" style="list-style-type:none;">'
                    html += '<tr><td class="recent">' + recentlabelmode + '</td>'
                    html += '<td class="recent">' + formatDatetoIST(a.date_time) + '</td>'
                    html += '<td class="recent">' + a.date_time.substring(11, 19) + '</td>'
                    html += '</tr>'
                });
                $("#loadactivitydata").hide().append(html).fadeIn('fast');
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    /*Start Document detail pagination*/
    var setPageNo = 1;
    var isDocRnd = false;
    var docTotRecord = 1;
    function DocPaginationDetail(pageindex, totdata) {
        let totPages = totdata;
        setPageNo = pageindex;
        let paginationHtml = '';
        let maxVisible = 4;

        if (totdata <= maxVisible + 2) {
            for (let i = 1; i <= totPages; i++) {
                paginationHtml += `<button class="page-btndocD ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            if (pageindex <= maxVisible) {
                for (let i = 1; i <= maxVisible; i++) {
                    paginationHtml += `<button class="page-btndocD ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                paginationHtml += `<span>.......</span>`;
                for (let j = totPages - 3; j <= totPages; j++) {
                    paginationHtml += `<button class="page-btndocD ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                }
            }
        }
        $("#docPageNumbers").html(paginationHtml);
        isDocRnd = true;
    }

    $(document).on("click", ".page-btndocD", function () {
        let page = $(this).data("page");
        setPageNo = page;
        isDocRnd = true;
        $("#doctxtgopage").val("");
        loadactivity(setPageNo, tempdocidshistory);
        $(".page-btndocD").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on("click", "#docPrev", function () {
        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isDocRnd = true;
        $("#doctxtgopage").val("");
        loadactivity(setPageNo, tempdocidshistory);

        $(".page-btndocD").removeClass("active");
        $(".page-btndocD[data-page='" + setPageNo + "']").addClass("active");
    });


    $(document).on("click", "#docNext", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isDocRnd = true;
        $("#doctxtgopage").val("");
        loadactivity(setPageNo, tempdocidshistory);
        $(".page-btndocD").removeClass("active");
        $(".page-btndocD[data-page='" + setPageNo + "']").addClass("active");
    });

    $(document).on("click", "#docDivGo", function () {
        let goToPage = parseInt($("#doctxtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        if (goToPage > docTotRecord || goToPage == 0 || isNaN(goToPage)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isDocRnd = true;
        loadactivity(setPageNo, tempdocidshistory);
        $(".page-btndocD").removeClass("active");
        $(".page-btndocD[data-page='" + setPageNo + "']").addClass("active");
    });
    /*End Document detail pagination*/
    /*Open document history box*/
    $(document).on("click", "#OpenHistoryBox", function () {
        var filetoken = $(this).attr("data-val");
        loadactivity(dochispageindex, filetoken);
        $("#modal_historydoc").modal();
    });
    /*Open document signed box*/
    $(document).on("click", "#OpenSignBox", function () {
        var filetoken = $(this).attr("data-val");
        var formdata = new FormData();
        formdata.append("token", EncodeText(filetoken));
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/ESignFileDeatils',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var data = response.Data;
                var obj = JSON.parse(data.a);
                var obj1 = JSON.parse(data.b);
                $.each(obj, function (i, a) {
                    $("#editfilename").text(a.fname);
                    $("#editfilenamehidden").val(filetoken);
                    if (a.fdetails != null || a.fdetails != "NULL") {
                        $("#filedetailsedit").val(a.fdetails);
                    }
                });
                var html_con = "";
                var signcordinate = "";
                $.each(obj1, function (i, a) {
                    if (filetoken == a.Docnumber) {
                        signcordinate = a.Signcordinate1 != null || a.Signcordinate1 != '' ? a.Signcordinate1 + ',' + (a.Signcordinate2 != null || a.Signcordinate2 != '' ? a.Signcordinate2 + ',' + (a.Signcordinate3 != null || a.Signcordinate3 != '' ? a.Signcordinate3 : '') : '') : '';
                        html_con += "<div class='row' style='display: flex;'>";
                        html_con += `<div><input type="radio" data-id=` + a.Id + ` name="rd_selected_file" onclick = "CheckCordinate('` + signcordinate + `' );" value="" /></div>`;
                        html_con += "<div class='glyphicon glyphicon-download-alt'";//fa fa-file-pdf-o
                        html_con += `onclick = "download_pdf('` + a.Id + `', '` + a.UserId + `', '` + a.FirmId + `', '` + a.Docnumber + `' );"`;
                        html_con += "style = 'color: #069;padding-left: 22px;' >";
                        html_con += "</div> ";
                        html_con += '<div style="padding-left:30px;" class="col-lg-auto">' + a.CreatedDate + '</div>';
                        html_con += '<div style="padding-left:30px;" class="col-lg-auto">' + a.FileName + '</div>';
                        html_con += '<div style="padding-left:50px;" class="col-lg-auto">' + a.Signedby + '</div>';
                        html_con += "</div>";
                    }
                });
                $("#dv_download_pdf").html(html_con);
                $("#modal_e_sign_type").modal();
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    /*Edit save files*/
    $("#EditFileSaves").click(function () {
        var filetoken = $("#editfilenamehidden").val();
        var filedetails = $("#filedetailsedit").val();
        var formdata = new FormData();
        formdata.append("filedetails", EncodeText(filedetails));
        formdata.append("token", EncodeText(filetoken));
        openload();
        $.ajax({
            async: true,
            url: '/api/AzureApi/EditFileDeatils',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                LoadDirectoryFiles(pageindex);
                alert("Data saved successfully");
                $('#myModal4').modal('hide');
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });
    $("input[name=S_position][value=Unsigned]").click(function () {
        $("input[name=rd_selected_file]").removeAttr("checked");//
        $("input[name=S_S_position]").removeAttr("checked");
        $("input[name=S_S_position]").prop("disabled", false);
    });

    /*Get Sign copy Cloud*/
    $("#DigiFileSaves").click(function () {
        //$('#signmodalId').modal('hide');
        var docname = $('#OpenSignBox').attr('name');
        var selectpageval = $("input[name='page']:checked").val();
        if (selectpageval == "" || selectpageval == undefined) {
            alert("Please select page.")
            return false;
        }
        var selecttype = $("input[name='ch_radio']:checked").val();
        if (selecttype == "" || selecttype == undefined) {
            alert("Please select type.")
            return false;
        }
        var Cordinatetype = $("input[name='S_S_position']:checked").val();
        if (Cordinatetype == "" || Cordinatetype == undefined) {
            alert("Please Signature position.")
            return false;
        }
        sessionStorage.setItem("digifilename", docname);
        sessionStorage.setItem("signtype", selecttype);
        sessionStorage.setItem("docid", $("#editfilenamehidden").val());
        sessionStorage.setItem("docname", "PO");
        sessionStorage.setItem("username", userid);
        sessionStorage.setItem("selectpageval", selectpageval);
        sessionStorage.setItem("userid", userid);
        sessionStorage.setItem("Filetype", $("input[name='S_position']:checked").val());
        if ($("input[name='S_position']:checked").val() == "Signed") {
            if ($("input[name='rd_selected_file']:checked").attr('data-id') == "" || $("input[name='rd_selected_file']:checked").attr('data-id') == undefined) {
                alert("Please Select Signatured File.")
                return false;
            }
            sessionStorage.setItem("UID", $("input[name='rd_selected_file']:checked").attr('data-id'));
        }
        else {
            sessionStorage.setItem("UID", "");
        }
        sessionStorage.setItem("Cordinatetype", Cordinatetype);
        window.location.href = "/Azure/GetSigncopyCloud";
    });

    /*Get sync file permission*/
    $(document).on("click", "#filesyncpermission", function () {
        selectedID = [];
        selectedflag = [];
        filesyncPermission();
        var isfolderchcksync = false;
        var isfilesync = false;
        var isfilenotsync = false;
        function filesyncPermission() {
            isfolderchcksync = false;
            isfilesync = false;
            isfilenotsync = false;
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    var vdata = $(this).attr("data-val");
                    var flagvalue = $(this).attr("data-flag");
                    if (String(flagvalue) == "-1") {
                        isfolderchcksync = true;
                    }
                    if (String(flagvalue) == "1") {
                        isfilesync = true;
                        selectedID.push(vdata + "_0");
                    }
                    if (String(flagvalue) == "0") {
                        isfilenotsync = true;
                        selectedID.push(vdata + "_1");
                    }
                }
            });
            if (JSON.stringify(selectedID) != "[]") {
                if (isfolderchcksync == true) {
                    new PNotify({
                        title: "Warning",
                        text: " Folders can't be synced. Please select file for syncing.",
                        type: "error",
                        delay: 3000
                    });
                    return false;
                }
                if (isfilesync == true && isfilenotsync == true) {
                    new PNotify({
                        title: "Warning",
                        text: " Please select Synced or Unsynced file",
                        type: "error",
                        delay: 3000
                    });
                    return false;
                }
                var confirmMessage = "";
                var successMessage = "";
                if (isfilenotsync == true) {
                    confirmMessage = "Only files can be synced. Are you sure you want to save the file for Syncing?";
                    successMessage = "File sync request has been saved successfully";
                }
                else {
                    confirmMessage = "Are you sure you want to remove the file from Syncing?";
                    successMessage = "File removed from Syncing Successfully. ";
                }
                var result = confirm(confirmMessage);
                if (result) {
                    var formData = new FormData();
                    formData.append("typeIds", EncodeText(selectedID));
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/AzureApi/SaveFileSyncRequest',
                        data: formData,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: successMessage,
                                    type: 'success',
                                    delay: 3000
                                });
                                LoadDirectoryFiles(pageindex);
                                closeload();
                                $('#select_all').prop('checked', false);
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
                        }
                    });
                }
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: ' You have not selected any file for syncing, please select first.',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });

    /*Save dropbox details*/
    $(document).on("click", "#savedropbox", function () {
        var link = $(this).attr("href");
        var linkcode = $(this).attr("code");
        var formdata = new FormData();
        formdata.append("filepath", EncodeText(link));
        formdata.append("code", EncodeText(linkcode));
        formdata.append("urltypes", EncodeText("dropbox"));
        formdata.append("baseurl", window.location.origin);
        $.ajax({
            async: true,
            url: '/api/AzureApi/Dirfilepath',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var urldropbox = "/firm/dropbox?status=true&token=" + response.Data;
                $('#dropboxframe').attr('src', urldropbox);
                $('#dropboxframeobject').attr('data', urldropbox);
                $('#myModaldropbox').modal({ show: true });
            },
            error: function () {
                alert('Error!');
            }
        });
    });

    /*Remove file request*/
    $("#removerequest").click(function () {
        window.location = encodeURI("/" + fcode + "/Azure/RemoveFileRequest");
    })
    var navigateuser1 = localStorage.getItem("navigateuser");
    var pageURL4 = window.location.href;
    baseurl = pageURL4;
    var lastURLSegment4 = pageURL4.substr(pageURL4.lastIndexOf('/') + 1);
    if (String(lastURLSegment4) == "0") {
        localStorage.setItem("navigateuser", "");
    }

    /*Select all check box*/
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var ffileval = new Array();
    var ffilenames = new Array();
    var ffullpath = new Array();
    $(document).on("click", "#move", function () {
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                var fileval = $(this).attr("data-val");
                var filenames = $(this).attr("fname-val");
                var filepath = $(this).attr("fpath-val");
                var dataflag = $(this).attr("data-flag");
                if (String(dataflag) != "-1") {
                    ffileval.push(fileval);
                    ffilenames.push(filenames);
                    ffullpath.push(filepath);
                }
                var dirval = $(this).attr("dir-val");
                var dirpath = $(this).attr("dir-path");
                var fileval = $("#fileids").text();
                var filenames = $("#filenames").text();
                var filepath = $("#filepath").text();
            }
        });
        if (JSON.stringify(ffileval) != "[]") {
            $("#fileids").text(ffileval);
            $("#filenames").text(ffilenames);
            $("#filepath").text(ffullpath);
            var url = "/firm/MoveDirList/" + 0;
            $('.loadmovedirlist').load(url, function (result) {
                closeload1();
                $('#myModalmove').modal({ show: true });
            });
            ffileval = [];
            ffilenames = [];
            ffullpath = [];
        }
        else {
            new PNotify({
                title: 'Warning!',
                text: ' You have not selected any file!',
                type: 'error',
                delay: 2000
            });
        }
    });
    $(".validpanel").css("display", "none");
    $(document).on("click", "#bruidcmb", function () {
        var tempbrd = $(this).attr("value");
        var regExpr = /[/]/g;
        var tempbrd1 = tempbrd.replace(regExpr, " > ")
        $("#outputbrdcmb").html(tempbrd1);
    });
    var timeLeft = 40;
    var timerId = "";
    var checktoken = "";
    var checkopen = false;

    /*Timer count down*/
    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
        } else {
            $("#overlaytime").text(timeLeft + ' seconds remaining');
            timeLeft--;
        }
    }

    /*View file version details*/
    //$(document).on("click", "#viewfileversion", function () {
    //    var valuetoken = $(this).attr("token");
    //    var filename = $(this).attr("filename");
    //    var checkinouttab = $(this).attr("checkinouttab");
    //    var ct = 5;
    //    var formData = new FormData();
    //    formData.append("dirtoken", EncodeText(valuetoken));
    //    var html6 = '';
    //    $.ajax({
    //        async: true,
    //        url: '/api/AzureApi/FileVersionList',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        type: 'POST',
    //        success: function (response) {
    //            $("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
    //            //$('#modal_docVersionHistory').modal({ show: true });
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                if (response.Data == "[]") {
    //                    $("#bindfileversion" + valuetoken).empty().html("<tr><td colspan='6' align='center'>No document found</td</tr>");
    //                    return false;
    //                }
    //                var obj = JSON.parse(response.Data);
    //            }
    //            else {
    //            }
    //            var cheintb = false;
    //            ct = obj.length;
    //            $.each(obj, function (i, a) {
    //                var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.Id + "";
    //                html6 += '<tr>';
    //                html6 += '<td>' + a.rownum + '</td>';
    //                html6 += '<td>' + formatDatetoIST(a.date_time) + '</td>';
    //                html6 += '<td>' + String(a.date_time).substring(11, 19) + '</td>';
    //                html6 += '<td>' + a.ParentCreatedBy + '</td>';
    //                html6 += '<td>' + a.CreatedBy + '</td>';
    //                if (checkinouttab == "1") {
    //                    if (cheintb == false) {
    //                        html6 += '<td><span  >' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
    //                        cheintb = true;
    //                    }
    //                    else {
    //                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
    //                    }
    //                }
    //                else {
    //                    html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
    //                }
    //                html6 += '</tr>';
    //                ct = ct - 1;
    //            });
    //            $("#bindfileversion" + valuetoken).empty().html(html6);
    //            $("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
    //        },
    //        failure: function (response) {
    //            alert(data.responseText);
    //        },
    //        error: function (response) {
    //            alert(data.responseText);
    //        }
    //    });
    //});

    $(document).on("click", "#viewfileversion", function () {
        var valuetoken = $(this).attr("token");
        var filename = $(this).attr("filename");
        var checkinouttab = $(this).attr("checkinouttab");
        var ct = 5;
        var formData = new FormData();
        formData.append("dirtoken", EncodeText(valuetoken));
        var html6 = '';
        $.ajax({
            async: true,
            url: '/api/AzureApi/FileVersionList',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                //$("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
                $("#bindfileversion").html("");
                $('#modal_docVersionHistory').modal({ show: true });
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        //$("#bindfileversion").empty().html("<tr><td colspan='6' align='center'>No document found</td</tr>");
                        $("#verHDatastatus").show();
                        return false;
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                $("#verHDatastatus").hide();
                var cheintb = false;
                ct = obj.length;
                $.each(obj, function (i, a) {
                    var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.Id + "";
                    html6 += '<tr>';
                    html6 += '<td>' + a.rownum + '</td>';
                    html6 += '<td>' + formatDatetoIST(a.date_time) + '</td>';
                    html6 += '<td>' + String(a.date_time).substring(11, 19) + '</td>';
                    html6 += '<td>' + a.ParentCreatedBy + '</td>';
                    html6 += '<td>' + a.CreatedBy + '</td>';
                    if (checkinouttab == "1") {
                        if (cheintb == false) {
                            html6 += '<td><span  >' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                            cheintb = true;
                        }
                        else {
                            html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                        }
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + a.OriginalDocName + ' (Version - ' + ct + ')</span></td>';
                    }

                    if (checkinouttab == "1") {
                        if (cheintb == false) {
                            html6 += '<td></td>';
                            cheintb = true;
                        }
                        else {
                            html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '"><img src="/newassets/img/download-icon.png"></span></td>';
                        }
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '"><img src="/newassets/img/download-icon.png"></span></td>';
                    }

                    html6 += '</tr>';
                    ct = ct - 1;
                });
                $("#bindfileversion").empty().html(html6);
                //$("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    });

    /*Checkout file*/
    $(document).on("click", "#checkout", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var durl = $(this).attr("href-val");
        var valuetoken = $(this).attr("value");
        window.location.href = durl;
        $(".checkout" + valuetoken).hide();
        $(".checkin" + valuetoken).show();
        setTimeout(function () {
            LoadDirectoryFiles(pageindex);
        }, 3000);
    });
    $(document).on("click", "#checkin", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var valuetoken = $(this).attr("value");
        var filename = $(this).attr("fname");
        $("#checkinfilename").text(filename);
        $("#checkinfileid").val(valuetoken);
        $('#myModalcheckin').modal({ show: true });
    });

    /*Download file water mark*/
    $(document).on("click", "#downloadfilewatermark", function () {
        window.onbeforeunload = null;
        var durl = $(this).attr("href-val");
        window.location.href = durl;
    });
    $(document).on("click", "#downloadfile", function () {
        validnavigation = true;
        window.onbeforeunload = null;
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
                else {
                    window.location.href = durl;
                    checkopen = false;
                }
            }
            else {
                window.location.href = durl;
                checkopen = false;
            }
        }
    });
    /*open permision model*/
    var t = 0;
    $(document).on("click", "#permopen", function () {
        var t = $(this).attr("value");
        var tttype = $(this).attr("type");
        if (tttype == "folder") {
            $("#fstitle").text("Folder Sharing");
            $("#fsfnamelabel").text("Folder Name");
            $("#fstblfnamelabel").text("Folder Name");
            $("#assign").attr("data-type", tttype);
        }
        else {
            $("#fstitle").text("File Sharing");
            $("#fsfnamelabel").text("File Name");
            $("#fstblfnamelabel").text("File Name");
            $("#assign").attr("data-type", "");
        }
        $("#directoryid").html(t);
        var tn = $(this).attr("valuename");
        $('#contact').prop('selectedIndex', 0);
        $("#linkdata input[name='options[]']:checked").prop("checked", false);
        $("#directoryname").html(tn);
        $("#directoryid").html(t);
        $("#usertype").change();
        $('#myModalperm').modal({ show: true });
        showuserassignefiledata();
    });
    /*change type*/
    $("#contype").change(function () {
        var contypes = $(this).val();
        $('#contact').get(0).selectedIndex = 0;
        $('input:checkbox').removeAttr('checked');
        if (contypes == "Contact") {
            $('#contact').css("display", "block");
            $('#contact').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
        else {
            $('#contact').css("display", "none");
            $('#contact').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
    });
    /*Get permission on contact*/
    $("#contact").change(function () {
        var selectedRole = $(this).find('option:selected').attr('id-val');
        if (selectedRole == "3") {
            $("#per2").hide();//
            $("#lblrights2").hide();
        }
        else {
            $("#per2").show();//
            $("#lblrights2").show();
        }
        var cvalue = $(this).val();
        var fileid = $("#directoryid").text();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", EncodeText(cvalue));
            formData.append("FileID", EncodeText(fileid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SinglFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.ppermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#linkdata input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#linkdata input[name='options[]']" + "#per" + chkbx).prop('checked', true);
                                    }
                                    else {
                                    }
                                });
                            }
                        }
                    });
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
    /*Load Permissions*/
    function permissionlist() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/permissionList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                }
                var obj = JSON.parse(response.Data)
                qty = 0;
                $.each(obj, function (i, a) {
                    qty = qty + 1;
                    if (a.Pname == "Remove") {
                        var option2 = '&nbsp;&nbsp;<input title="Can remove from his list"  type="checkbox" id="per' + a.Id + '" name="options[]" value="' + a.Id + '" />  <label id="lblrights' + a.Id + '">' + a.Pname + '</label>';
                    }
                    else {
                        var option2 = '&nbsp;&nbsp;<input  type="checkbox" id="per' + a.Id + '" name="options[]" value="' + a.Id + '" />  <label id="lblrights' + a.Id + '">' + a.Pname + '</label>';
                    }
                    $("#linkdata").append(option2);
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
    /*Remove Folders*/
    //$(document).on("click", "#removedir", function () {
    //    var fid = $(this).attr("values");
    //    var fdir = $(this).attr("dirname");
    //    var fdirpath = $(this).attr("filepath");
    //    var code = $(this).attr("code");
    //    var result = confirm("Are you sure to remove this Folder?");
    //    if (result) {
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/AzureApi/RemoveDirectory",
    //            headers: {
    //                'fid': fid,
    //                'fdir': fdir,
    //                'fdirpath': fdirpath,
    //                'code': code
    //            },
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (data) {
    //                var datas1 = JSON.stringify(data);
    //                if (data.Data == "false") {
    //                    new PNotify({
    //                        title: 'info!',
    //                        text: 'Folder cannot be removed. It has some folders or files',
    //                        type: 'error',
    //                        delay: 4000
    //                    });
    //                }
    //                if (data.Data == "1") {
    //                    $("#dirbound").html('');
    //                    LoadDirectoryFiles(pageindex);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: 'Folder Removed Successfully',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                }
    //                else if (data.Data == false) {
    //                    new PNotify({
    //                        title: 'info!',
    //                        text: 'Folder cannot be removed. It has some folders or files',
    //                        type: 'error',
    //                        delay: 4000
    //                    });
    //                }
    //            },
    //            failure: function (data) {
    //                alert(data.responseText);
    //            },
    //            error: function (data) {
    //                alert(data.responseText);
    //            }
    //        });
    //    }
    //});
    $(document).on("click", "#removedir", function () {
        debugger
        $("#myModalDocumentconfirmation").modal();
        var fid = $(this).attr("values");
        var fdir = $(this).attr("dirname");
        var fdirpath = $(this).attr("filepath");
        var code = $(this).attr("code");

        $("#ids_deleteTraderequesr").text("Delete Document Request");
        $("#msgRUSure").text("Are you sure you want to delete this directory?");

        $("#deleteDocDetails").attr("fid", fid);
        $("#deleteDocDetails").attr("fdir", fdir);
        $("#deleteDocDetails").attr("fdirpath", fdirpath);
        $("#deleteDocDetails").attr("code", code);
    });
    $(document).on('click', '#deleteDocDetails', function () {
        debugger
        var fid = $(this).attr("fid");
        var fdir = $(this).attr("fdir");
        var fdirpath = $(this).attr("fdirpath");
        var code = $(this).attr("code");
        RemoveDocFromDirectory(fid, fdir, fdirpath, code);
    });

    function RemoveDocFromDirectory(fid, fdir, fdirpath, code) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/RemoveDirectory",
            headers: {
                'fid': fid,
                'fdir': fdir,
                'fdirpath': fdirpath,
                'code': code
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var datas1 = JSON.stringify(data);
                if (data.Data == "false") {
                    new PNotify({
                        title: 'info!',
                        text: 'Folder cannot be removed. It has some folders or files',
                        type: 'error',
                        delay: 4000
                    });
                }
                if (data.Data == "1") {
                    $("#dirbound").html('');
                    const activeBtn = document.querySelector('.page-btn.active');
                    const currentPageValue = activeBtn ? activeBtn.textContent.trim() : pageindex;
                    LoadDirectoryFiles(currentPageValue);
                    new PNotify({
                        title: 'Success!',
                        text: 'Folder Removed Successfully',
                        type: 'success',
                        delay: 3000
                    });
                }
                else if (data.Data == false) {
                    new PNotify({
                        title: 'info!',
                        text: 'Folder cannot be removed. It has some folders or files',
                        type: 'error',
                        delay: 4000
                    });
                }
                $("#myModalDocumentconfirmation").modal("hide");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*Remove directory file*/
    $(document).on("click", "#removedirfile", function () {
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var isdelete = $(this).attr("isdelete");
        var isuse = $(this).attr("data-inuser");
        $("#removedirfilefinal").attr("value", value).attr("directnamefull", dname).attr("fid", fid).attr("fpath", fpath).attr("isdelete", isdelete).attr("data-inuser", isuse);
        if (isdelete == "1") {
            $("#removedirfilefinal").click();
        }
        else {
            $("#myModalmarkdelete").modal();
        }
    });
    /*Remove final directory file*/
    //$(document).on("click", "#removedirfilefinal", function () {
    //    var value = $(this).attr("value");
    //    var dname = $(this).attr("directnamefull");
    //    var fid = $(this).attr("fid");
    //    var fpath = $(this).attr("fpath");
    //    var isdelete = $(this).attr("isdelete");
    //    var isuse = $(this).attr("data-inuser");
    //    var remarkmark = $("#markremark").val();
    //    if (isdelete != "1") {
    //        if (remarkmark == "") {
    //            //alert("Please enter remark.");
    //            new PNotify({
    //                title: 'Info!',
    //                text: 'Please enter remark.',
    //                type: 'error',
    //                delay: 3000
    //            });
    //            $("#markremark").focus();
    //            return false;
    //        }
    //    }
    //    if (isuse == "1") {
    //        //alert("The file cannot be deleted as it is in use.");
    //        new PNotify({
    //            title: 'Info!',
    //            text: 'The file cannot be deleted as it is in use.',
    //            type: 'error',
    //            delay: 3000
    //        });
    //        return false;
    //    }
    //    var result = "";
    //    if (isdelete == "1") {
    //        result = confirm("Are you sure you want to unmark the file for deletion?");
    //    }
    //    else {
    //        result = confirm("Are you sure you want to mark the file for deletion?");
    //    }
    //    if (result) {
    //        var formData = new FormData();
    //        formData.append("value", EncodeText(value));
    //        formData.append("remark", EncodeText(remarkmark));
    //        openload();
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/AzureApi/MarkRemoveDirectoryFile",
    //            dataType: 'json',
    //            data: formData,
    //            contentType: false,
    //            processData: false,
    //            success: function (data) {
    //                if (String(data.Data) == "alreadycheckout") {
    //                    if (isdelete == "1") {
    //                        new PNotify({
    //                            title: 'info!',
    //                            text: 'File can not be unmarked until document is check in.',
    //                            type: 'error',
    //                            delay: 4000
    //                        });
    //                    }
    //                    else {
    //                        new PNotify({
    //                            title: 'info!',
    //                            text: 'File can not be marked until document is check in.',
    //                            type: 'error',
    //                            delay: 4000
    //                        });
    //                    }
    //                }
    //                else {
    //                    if (parseInt(data.Data) > 0) {
    //                        $("#dirbound").html('');
    //                        LoadDirectoryFiles(pageindex);
    //                        $("#markremark").val("");
    //                        if (isdelete == "1") {
    //                            new PNotify({
    //                                title: 'Success!',
    //                                text: 'File unmarked successfully',
    //                                type: 'success',
    //                                delay: 3000
    //                            });
    //                            $("#myModalmarkdelete").modal("hide");
    //                        }
    //                        else {
    //                            new PNotify({
    //                                title: 'Success!',
    //                                text: 'File marked successfully',
    //                                type: 'success',
    //                                delay: 3000
    //                            });
    //                            $("#myModalmarkdelete").modal("hide");
    //                        }
    //                    }
    //                    else {
    //                        new PNotify({
    //                            title: 'info!',
    //                            text: ' Oops ! File can not be deleted.',
    //                            type: 'error',
    //                            delay: 4000
    //                        });
    //                    }
    //                }
    //                closeload();
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


    $(document).on("click", "#removedirfilefinal", function () {
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var isdelete = $(this).attr("isdelete");
        var isuse = $(this).attr("data-inuser");
        var remarkmark = $("#markremark").val();
        if (isdelete != "1") {
            if (remarkmark == "") {
                //alert("Please enter remark.");
                new PNotify({
                    title: 'Info!',
                    text: 'Please enter remark.',
                    type: 'error',
                    delay: 3000
                });
                $("#markremark").focus();
                return false;
            }
        }
        if (isuse == "1") {
            //alert("The file cannot be deleted as it is in use.");
            new PNotify({
                title: 'Info!',
                text: 'The file cannot be deleted as it is in use.',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var result = "";
        $("#myModalFileConfirmation").modal();
        $("#ids_deleteFile").text("Delete File Request");
        if (isdelete == "1") {
            //result = confirm("Are you sure you want to unmark the file for deletion?");
            $("#msgRUSureFile").text("Are you sure you want to unmark the file for deletion ?");
        }
        else {
            //result = confirm("Are you sure you want to mark the file for deletion?");
            $("#msgRUSureFile").text("Are you sure you want to mark the file for deletion?");
        }
        $("#deleteFileDetails").attr("value", value);
        $("#deleteFileDetails").attr("dname", dname);
        $("#deleteFileDetails").attr("fid", fid);
        $("#deleteFileDetails").attr("fpath", fpath);
        $("#deleteFileDetails").attr("isdelete", isdelete);
        $("#deleteFileDetails").attr("isuse", isuse);
        $("#deleteFileDetails").attr("remarkmark", remarkmark);

    });
    $(document).on('click', '#deleteFileDetails', function () {
        var value = $(this).attr("value");
        var dname = $(this).attr("dname");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var isdelete = $(this).attr("isdelete");
        var isuse = $(this).attr("isuse");
        var remarkmark = $(this).attr("remarkmark");
       
        fnRemoveDirFileFinal(value, dname, fid, fpath, isdelete, isuse, remarkmark);
    });
    function fnRemoveDirFileFinal(value, dname, fid, fpath, isdelete, isuse, remarkmark) {
        var formData = new FormData();
        formData.append("value", EncodeText(value));
        formData.append("remark", EncodeText(remarkmark));
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/MarkRemoveDirectoryFile",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (String(data.Data) == "alreadycheckout") {
                    if (isdelete == "1") {
                        new PNotify({
                            title: 'info!',
                            text: 'File can not be unmarked until document is check in.',
                            type: 'error',
                            delay: 4000
                        });
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: 'File can not be marked until document is check in.',
                            type: 'error',
                            delay: 4000
                        });
                    }
                }
                else {
                    if (parseInt(data.Data) > 0) {
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex);
                        $("#markremark").val("");
                        if (isdelete == "1") {
                            new PNotify({
                                title: 'Success!',
                                text: 'File unmarked successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#myModalmarkdelete").modal("hide");
                        }
                        else {
                            new PNotify({
                                title: 'Success!',
                                text: 'File marked successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#myModalFileConfirmation").modal("hide");
                        }
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: ' Oops ! File can not be deleted.',
                            type: 'error',
                            delay: 4000
                        });
                    }
                }
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
    /*Edit assign*/
    var editsharedocsis = "";
    $(document).on("click", "#editassign", function () {
        var cvalue = $(this).attr("val-id");
        var valrole = $(this).attr("val-role");
        if (valrole == "3") {
            $("#usertype").val("Client");
        }
        else {
            $("#usertype").val("User");
        }
        editsharedocsis = cvalue;
        var fileid = $("#directoryid").text();
        openload();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", EncodeText(cvalue));
            formData.append("FileID", EncodeText(fileid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SinglFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    $.each(obj, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.ppermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#linkdata input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#linkdata input[name='options[]']" + "#per" + chkbx).prop('checked', true);
                                    }
                                    else {
                                    }
                                });
                            }
                        }
                    });
                    setTimeout(function () {
                        $("#usertype").change();
                        closeload();
                    }, 1000);
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
    /*Revert share file*/
    $(document).on("click", "#revertassign", function () {
        var sfid = $(this).attr("val-id");
        var datatype = "File";
        datatype = $("#assign").attr("data-type");
        if (datatype == "folder") {
            datatype = "Folder"
        }
        else {
            datatype = "File"
        }
        var result = confirm("Are you sure to un-share this " + datatype + "?");
        if (result) {
            var formData = new FormData();
            formData.append("did", EncodeText(sfid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/RevertAssignFile",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (String(data.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not revert share because this " + datatype + " shared by admin");
                        closeload();
                        return false;
                    }
                    var datas1 = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: '' + datatype + ' Share Reverted Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    LoadDirectoryFiles(pageindex);
                    showuserassignefiledata();
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
    localStorage.setItem("ftvaluedata", "/LawPractice_ds/");
    /*show user assigne file data*/
    function showuserassignefiledata() {
        $("#assignuserdata").html("");
        var html = '';
        var fileid = $("#directoryid").text();
        var formData = new FormData();
        formData.append("Id", EncodeText(fileid));
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/AssignFilePerUserList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $('input:checkbox').removeAttr('checked');
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    var permissionlist = String(a.ppermission);
                    var res = permissionlist.replace("1", "View Only");
                    var res1 = res.replace("2", "Edit");
                    var res2 = res1.replace("3", "Remove");
                    var res3 = res2.replace("4", "Download");
                    html += '<tr style="border-bottom: none !important;"><td>' + qty1 + '</td><td>' + a.fname + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.username + '(' + a.loginusername + ')</td><td>' + res3 + '</td><td>&nbsp;<span class="glyphicon glyphicon-edit" style="color:#069;cursor:pointer;" title="Edit permissions"  id="editassign" val-role="' + a.roleid + '" val-id="' + a.pcontact + '"></span>&nbsp; | &nbsp;<span class="glyphicon glyphicon-trash"  style="color:red;cursor:pointer;" title="Remove Permissions" id="revertassign" val-id="' + a.id + '"></span>  </td></tr>';
                });
                $("#assignuserdata").append(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*Move file open modal*/
    $(document).on("click", "#moveDir", function () {
        var tvalues = $(this).attr("values");
        $("#fileids").text(tvalues);
        $("#spanheadmove").text("Move Folder");
        var defaultdid = 0;
        var url = "/firm/MoveDirList/" + defaultdid + "?sttus=true&type=folder";
        $('.loadmovedirlist').load(url, function (result) {
            closeload1();
            $('#myModalmove').modal({ show: true });
        });
    });
    /*save move folder File*/
    $(document).on("click", "#savemovefolderFile", function () {
        var movemodetype = $(this).attr("isfilfolder");
        if (movemodetype == "folder") {
            $(this).parent(".list-group-item").css("background", "antiquewhite");
            var result = confirm("Are you sure to move this folder?");
            var tempfilenames = "";
            if (result) {
                var rdVaule = $("input[name='dirradio']:checked").attr("dir-val");
                if (String(rdVaule) == "undefined") {
                    alert("Please select the folder.");
                    return false;
                }
                var dirval = rdVaule;
                var fileval = $("#fileids").text();
                openload();
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/AzureApi/SaveMoveFolder",
                    headers: {
                        'fid': fileval,
                        'dirid': dirval,
                        'dirpath': '',
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (String(data.Data) == "assign") {
                            alert("You cannot move the folder which is already shared with others.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "UnauthorizedNotice") {
                            alert("You can not move file in this directory");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "sdequal") {
                            alert("You cannot move a folder in the same directory.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "Sync") {
                            alert("You can not move Folder which marked for sync");
                            closeload();
                            return false;
                        }
                        if (String(data.Data.status) == "documentalreadyexist") {
                            alert(data.Data.filename + " Same folder cannot be moved again.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "Cannot create a file when that file already exists.\r\n") {
                            alert("Destination already has the same folder.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "not valid user") {
                            alert("You cannot move the folder(s) of other users.");
                            closeload();
                            return false;
                        }
                        var datas1 = JSON.stringify(data);
                        if (data.Data == "1") {
                            $("#dirbound").html('');
                            new PNotify({
                                title: 'Success!',
                                text: 'Folder Moved Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            LoadDirectoryFiles(pageindex);
                            LoadDirectory();
                            document.getElementById("close").click();
                        }
                        else if (data.Data == false) {
                            new PNotify({
                                title: 'info!',
                                text: 'Folder cannot move. It is already shared to other user',
                                type: 'error',
                                delay: 4000
                            });
                        }
                    },
                    failure: function (data) {
                        alert(data.responseText);
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            }
        }
        if (movemodetype == "file") {
            var rdVaule = $("input[name='dirradio']:checked").attr("dir-val");
            if (String(rdVaule) == "undefined") {
                alert("Please select the folder.");
                return false;
            }
            $(this).parent(".list-group-item").css("background", "antiquewhite");
            var result = confirm("Are you sure to move this File?");
            var tempfilenames = "";
            if (result) {
                var dirval = rdVaule;
                var fileval = $("#fileids").text();
                var array1 = fileval.split(",");
                var cnts = array1.length - 1;
                var qy = 0;
                for (var i = 0; i < array1.length - 1; i++) {
                    openload();
                    $.ajax({
                        async: true,
                        type: "POST",
                        url: "/api/AzureApi/SaveMoveFile",
                        headers: {
                            'fid': array1[i],
                            'dirid': dirval,
                            'dirpath': '',
                        },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            if (String(data.Data) == "assign") {
                                alert("You can not move file which is already shared.");
                                closeload();
                                return false;
                            }
                            if (String(data.Data) == "UnauthorizedNotice") {
                                alert("You can not move file in this directory");
                                closeload();
                                return false;
                            }
                            if (String(data.Data) == "Sync") {
                                alert("You can not move file which marked for sync");
                                closeload();
                                return false;
                            }
                            if (String(data.Data.status) == "documentalreadyexist") {
                                alert(data.Data.filename + " File Already Exist in directory.");
                                closeload();
                                return false;
                            }
                            if (String(data.Data) == "Cannot create a file when that file already exists.\r\n") {
                                alert("The destination already has same file. ");
                                closeload();
                                return false;
                            }
                            if (String(data.Data) == "not valid user") {
                                alert("You can not move files of other users");
                                closeload();
                                return false;
                            }
                            qy = qy + 1;
                            var datas1 = JSON.stringify(data);
                            if (data.Data == "1") {
                                $("#dirbound").html('');
                                new PNotify({
                                    title: 'Success!',
                                    text: 'File Moved Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                            }
                            if (qy == cnts) {
                                LoadDirectoryFiles(pageindex);
                                LoadDirectory();
                                document.getElementById("close").click();
                            }
                            else if (data.Data == false) {
                                new PNotify({
                                    title: 'info!',
                                    text: 'File cannot move. It is already shared to other user',
                                    type: 'error',
                                    delay: 4000
                                });
                            }
                        },
                        failure: function (data) {
                            alert(data.responseText);
                        },
                        error: function (data) {
                            alert(data.responseText);
                        }
                    });
                }
            }
        }
    });
    /*move file*/
    $(document).on("click", "#savemovefolder", function () {
        $(this).parent(".list-group-item").css("background", "antiquewhite");
        var result = confirm("Are you sure to move this folder?");
        var tempfilenames = "";
        if (result) {
            var dirval = $(this).attr("dir-val");
            var fileval = $("#fileids").text();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/SaveMoveFolder",
                headers: {
                    'fid': fileval,
                    'dirid': dirval,
                    'dirpath': '',
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (String(data.Data) == "assign") {
                        alert("You cannot move the folder which is already shared with others.");
                        closeload();
                        return false;
                    }
                    if (String(data.Data) == "Sync") {
                        alert("You can not move Folder which marked for sync");
                        closeload();
                        return false;
                    }
                    if (String(data.Data.status) == "documentalreadyexist") {
                        alert(data.Data.filename + " Same folder cannot be moved again.");
                        closeload();
                        return false;
                    }
                    if (String(data.Data) == "Cannot create a file when that file already exists.\r\n") {
                        alert("Destination already has the same folder.");
                        closeload();
                        return false;
                    }
                    if (String(data.Data) == "not valid user") {
                        alert("You cannot move the folder(s) of other users.");
                        closeload();
                        return false;
                    }
                    var datas1 = JSON.stringify(data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        new PNotify({
                            title: 'Success!',
                            text: 'Folder Moved Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        LoadDirectoryFiles(pageindex);
                        document.getElementById("close").click();
                    }
                    else if (data.Data == false) {
                        new PNotify({
                            title: 'info!',
                            text: 'Folder cannot move. It is already shared to other user',
                            type: 'error',
                            delay: 4000
                        });
                    }
                },
                failure: function (data) {
                    alert(data.responseText);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    });
    /*move file*/
    $(document).on("click", "#movefile", function () {
        $("#spanheadmove").text("Move Files");
        var selectedID = "";
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                var vdata = $(this).attr("data-val");
                var flagvalue = $(this).attr("data-flag");
                if (String(flagvalue) == "0") {
                    selectedID += vdata + ",";
                }
            }
        });
        if (selectedID != "") {
            $("#fileids").text(selectedID);
            var defaultdid = 0;
            var url = "/firm/MoveDirList/" + defaultdid;
            $('.loadmovedirlist').load(url, function (result) {
                closeload1();
                $('#myModalmove').modal({ show: true });
            });
        }
        else {
            new PNotify({
                title: 'Warning',
                text: ' You have not selected any document, please select first',
                type: 'error',
                delay: 3000
            });
            closeload();
        }
    });
    /*save move file*/
    $(document).on("click", "#savemovefile", function () {
        $(this).parent(".list-group-item").css("background", "antiquewhite");
        var result = confirm("Are you sure to move this File?");
        var tempfilenames = "";
        if (result) {
            var dirval = $(this).attr("dir-val");
            var fileval = $("#fileids").text();
            var array1 = fileval.split(",");
            var cnts = array1.length - 1;
            var qy = 0;
            for (var i = 0; i < array1.length - 1; i++) {
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/AzureApi/SaveMoveFile",
                    headers: {
                        'fid': array1[i],
                        'dirid': dirval,
                        'dirpath': '',
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (String(data.Data) == "assign") {
                            alert("You can not move file which is already shared.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "Sync") {
                            alert("You can not move file which marked for sync");
                            closeload();
                            return false;
                        }
                        if (String(data.Data.status) == "documentalreadyexist") {
                            alert(data.Data.filename + " File Already Exist in directory.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "Cannot create a file when that file already exists.\r\n") {
                            alert("The destination already has same file. ");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "not valid user") {
                            alert("You can not move files of other users");
                            closeload();
                            return false;
                        }
                        qy = qy + 1;
                        var datas1 = JSON.stringify(data);
                        if (data.Data == "1") {
                            $("#dirbound").html('');
                            new PNotify({
                                title: 'Success!',
                                text: 'File Moved Successfully',
                                type: 'success',
                                delay: 3000
                            });
                        }
                        if (qy == cnts) {
                            LoadDirectoryFiles(pageindex);
                            document.getElementById("close").click();
                        }
                        else if (data.Data == false) {
                            new PNotify({
                                title: 'info!',
                                text: 'File cannot move. It is already shared to other user',
                                type: 'error',
                                delay: 4000
                            });
                        }
                    },
                    failure: function (data) {
                        alert(data.responseText);
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            }
        }
    });
    /*Assign directory with permission*/
    $(document).on("click", "#assign", function () {
        var fid = $("#directoryid").text();
        var user = $("#contact").val();
        var chkArray3 = [];
        var selected = $("#linkdata input[name='options[]']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var datatype = "File";
        datatype = $(this).attr("data-type");
        if (datatype == "folder") {
            datatype = "Folder"
        }
        else {
            datatype = "File"
        }
        var result = confirm("Are you sure to share this " + datatype + "?");
        if (result) {
            var val = [];
            var membersids = "";
            $('.taskmemberclssharedocs:checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                membersids += val[i] + ",";
            });
            $('#chkTaskgroupsharedocee:checkbox:checked').each(function (i) {
                val[i] = $(this).val();
                membersids += val[i] + ",";
            });
            if (membersids == "") {
                alert("Please select the User.");
                return false;
            }
            if (selected3 == "") {
                alert("Please give at least one right.");
                return false;
            }
            var formData = new FormData();
            formData.append("did", EncodeText(fid));
            formData.append("permissiontype", EncodeText(selected3));
            formData.append("user", EncodeText(membersids));
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/AssignFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        $("#ptypes").html('');
                        const activeBtn = document.querySelector('.page-btn.active');
                        const currentPageValue = activeBtn ? activeBtn.textContent.trim() : pageindex;
                        LoadDirectoryFiles(currentPageValue, searchtype);
                        new PNotify({
                            title: 'Success!',
                            text: '' + datatype + ' Shared Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#contact').get(0).selectedIndex = 0;
                        showuserassignefiledata();
                        $('#matter').get(0).selectedIndex = 0;
                        $("#lblTeammemberSelectsharedocs").text("Select");
                        $("#usertype").change();
                        closeload();
                    }
                    else if (data.Data == "nouser") {
                        new PNotify({
                            title: 'info!',
                            text: ' Please Select User to Share ' + datatype + ' !',
                            type: 'error',
                            delay: 4000
                        });
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: ' Oops ! Please try After some time.',
                            type: 'error',
                            delay: 4000
                        });
                        closeload();
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
    /*Load matter*/
    function loadmatter() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/LoadMatterBound",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#matter").append(option);
                    }
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
    /*Load all contact based on user type*/
    $("#usertype").change(function (thisval) {
        $("#lblTeammemberSelectsharedocs").text("Select");
        var selectedRole = $(this).val();
        if (selectedRole == "Client") {
            $("#per2").hide();//
            $("#lblrights2").hide();
        }
        else {
            $("#per2").show();//
            $("#lblrights2").show();
        }
        loadcontact(editsharedocsis);
    });
    /*load contact*/
    function loadcontact(ids = null) {
        $("#contact").empty();
        if (ids != "") {
        }
        var usertype = $("#usertype").val();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/AllAssignuser",
            contentType: "application/json; charset=utf-8",
            headers: {
                "usertype": usertype,
                "userid": ids
            },
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                $("#contact option").remove();
                var option = '<option id-val="0" value="" selected>Select</option>';
                $("#contact").append(option);
                var html3 = '';
                $("#documentsharecontact").html("");
                if (ids == "null" || ids == null || ids == "") {
                    var optiont1 = '<li><input id="chkTaskgroupsharedoc" type="checkbox" class="taskmemberclssharedocs"  value="" ><a href="#" class="dropdown-item">All Members</a></li>';
                    $("#documentsharecontact").append(optiont1);
                }
                var temuswrnames = "";
                $.each(obj, function (i, a) {
                    var roleidtd = a["RoleId"];
                    if (ids == "null" || ids == null || ids == "") {
                        html3 += '<li><input id="chkTaskgroupsharedoc" type="checkbox" class="shcheckbox1 taskmemberclssharedocs" value="' + a["Id"] + '" tempUserName="' + a["UserNames"] + '"><a href="#" class="dropdown-item">' + a["UserNames"] + '</a></li>'
                    }
                    else {
                        html3 += '<li><input id="chkTaskgroupsharedocee"   type="checkbox" class="" value="' + a["Id"] + '" tempUserName="' + a["UserNames"] + '" checked="checked"><a href="#" class="dropdown-item">' + a["UserNames"] + '</a></li>'
                        temuswrnames = a["UserNames"];
                    }
                });
                $("#documentsharecontact").append(html3);
                if (ids == "null" || ids == null || ids == "") {
                    $("#lblTeammemberSelectsharedocs").text("Select");
                }
                else {
                    setTimeout(function () {
                        $('#chkTaskgroupsharedocee').prop("checked", true);
                        $("#lblTeammemberSelectsharedocs").text(temuswrnames);
                    }, 1000);
                }
                editsharedocsis = "";
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    /*Create file Directory*/
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(dirname) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        dirname = String(dirname).replace(/[@\\/:*?"<>|.&$%#!~+`*^,]/g, '');
        dirname = $.trim(dirname);
        dirname = dirname.replace(/[/]+/g, '/')
        var fdirname = dirname.charAt(0);
        var ldirname = dirname.charAt(dirname.length - 1);
        if (fdirname == '/') {
            var dirname = dirname.substr(1);
        }
        if (ldirname == "/") {
            dirname = dirname.slice(0, -1);
        }
        var string = dirname;
        newString = string.replace(/([\\+])\s+/g, "");
        newString1 = newString.replace(/(\s+[\\+])/g, "");
        dirname = newString1;
        if (dirname == "") {
            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
            return false;
        }
        if (dirname.length > 70) {
            $(".validpanel").css("display", "block").html("Folder Name should be less than 70 character");
            return false;
        }
        var cmatter = $("#cmatter").val();
        formData.append("dname", EncodeText(dirname));
        formData.append("directoryid", EncodeText(directoryid));
        formData.append("cmatter", EncodeText(cmatter));
        if (dirname != "") {
            openload();
            $.ajax({
                async: true,
                url: '/api/AzureApi/CreatefileDirectory',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#foldercreate")[0].reset();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create folder for other users directory");
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "otheruser") {
                        alert("You can not create folder for other users directory");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (datas.length == 58) {
                            $(".validpanel").css("display", "none");
                            LoadDirectory();
                            $("#dirbound").html('');
                            LoadDirectoryFiles(pageindex);
                            new PNotify({
                                title: 'Success!',
                                text: ' Folder Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $("#cdir").val("");
                            closeload();
                            $("#closecreatefolder").click();
                        }
                        else if (datas.length == 61) {
                            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
                            closeload();
                        }
                        else if (datas.length == 76) {
                            $(".validpanel").css("display", "block").html("Folder already exists");
                            closeload();
                        }
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
    /*Rename file directory*/
    $(document).on("click", "#renameDir", function () {
        var tvalues = $(this).attr("values");
        $("#refolderhide").val(tvalues);
        $("#myModalRenameFolder").modal('show');
    });
    /*Rename directory data*/
    $("#RenameDirData").click(function () {
        var formData = new FormData();
        var dirname = $("#cdirre").val();
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(dirname) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
            return false;
        }
        dirname = String(dirname).replace(/[@\\/:*?"<>|.&$%#!~+`*^,]/g, '');
        dirname = $.trim(dirname);
        dirname = dirname.replace(/[/]+/g, '/')
        var fdirname = dirname.charAt(0);
        var ldirname = dirname.charAt(dirname.length - 1);
        if (fdirname == '/') {
            var dirname = dirname.substr(1);
        }
        if (ldirname == "/") {
            dirname = dirname.slice(0, -1);
        }
        var string = dirname;
        newString = string.replace(/([\\+])\s+/g, "");
        newString1 = newString.replace(/(\s+[\\+])/g, "");
        dirname = newString1;
        if (dirname == "") {
            $(".validpanelre").css("display", "block").html("Please Enter Folder Name !");
            return false;
        }
        if (dirname.length > 70) {
            $(".validpanelre").css("display", "block").html("Folder Name should be less than 70 character");
            return false;
        }
        var renewdirids = $("#refolderhide").val();
        formData.append("dname", EncodeText(dirname));
        formData.append("directoryid", EncodeText(renewdirids));
        if (dirname != "") {
            openload();
            $.ajax({
                async: true,
                url: '/api/AzureApi/RenameFolder',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#foldercreate")[0].reset();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create folder for other users directory");
                        closeload();
                        return false;
                    }
                    else if (String(response.Data) == "AlreadyExistDirectory") {
                        alert("Directory already exists.");
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        $(".validpanel").css("display", "none");
                        LoadDirectory();
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' Folder rename Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#cdir").val("");
                        closeload();
                        $("#closecreatefolderre").click();
                    }
                    else {
                        alert(JSON.stringify(response));
                        closeload();
                    }
                },
                error: function (response) {
                    alert('Error!');
                }
            });
        }
    });
    /*Create check in files*/
    $("#createcheckinfiles").click(function () {
        var formData = new FormData();
        var totalFiles = document.getElementById("attachmentcheckin").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var filet = document.getElementById("attachmentcheckin").files[0];
            var result = confirm("Are you sure to check-in this file? mykase keeps last 10 versions  of this document including the current one. This works on First- In-First -Out Approach.");
            if (result) {
                var tempsize = 0;
                var tottempsize = 0;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("attachmentcheckin").files[i];
                    var filename = file.name;
                    //validate filechracter
                    var fileNameIndex = filename.lastIndexOf("/") + 1;
                    var dotIndex = filename.lastIndexOf('.');
                    var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                    var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                    if (reg.test(newfioename) == true) {
                        alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                        return false;
                    }
                    if (filename.length > 100) {
                        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                        return false;
                    }
                    var Extresponse = checkfileextDOC(filename);
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
                    }
                    tempsize = tempsize.toFixed(2);
                }
                formData.append("fileid", EncodeText($("#checkinfileid").val()));
                openload();
                $.ajax({
                    async: true,
                    url: '/api/AzureApi/Createfilecheckin',
                    data: formData,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (response) {
                        if (String(response.Data) == "Object reference not set to an instance of an object.") {
                            alert("You can not create file for other users directory");
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "EXCEEDLIMIT") {
                            alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "NOLIMIT") {
                            alert("Please Upgrade Your Storage Limit");
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "differfilename") {
                            alert("File not uploaded for checkin. File name should start with the suffix:'" + $("#checkinfilename").text() + "'");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "differfileext") {
                            alert("File not uploaded for checkin. File extension should be same as basefile:'" + $("#checkinfilename").text() + "'");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "Unauthorizeduser") {
                            alert("You are not authorized to check-in  file:'" + $("#checkinfilename").text() + "'");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (String(response.Data) == "false") {
                            alert("The uploaded files seems to be infected or containing malicious content, therefore it will not be Uploaded. Please check it locally and then only upload.");
                            $("#fileuploadin")[0].reset();
                            closeload();
                            return false;
                        }
                        if (response.Status == true) {
                            if (String(response.Data) == "True" || String(response.Data) == "true") {
                                var datas = JSON.stringify(response);
                                $("#fileuploadin")[0].reset();
                                $("#dirbound").html('');
                                LoadDirectoryFiles(pageindex);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' File CheckedIn Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                closeload();
                                $("#list").text("");
                                $("#myModalcheckin .close").click();
                            }
                            else {
                                alert(response.Data);
                                closeload();
                            }
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                        alert('Error!');
                    }
                });
            }
        }
    });
    /*Load progress bar*/
    function LoadProgressBar(result) {
        var progressbar = $("#progressbar-5");
        var progressLabel = $(".progress-label");
        progressbar.show();
        $("#progressbar-5").progressbar({
            value: 37,
            change: function () {
                progressLabel.text(
                    progressbar.progressbar("value") + "%");  // Showing the progress increment value in progress bar  
            },
            complete: function () {
                progressLabel.text("Loading Completed!");
                progressbar.progressbar("value", 0);  //Reinitialize the progress bar value 0  
                progressLabel.text("");
                progressbar.hide(); //Hiding the progress bar  
                var markup = "<tr style='border-bottom: none !important;'><td>" + result + "</td><td><a href='#' onclick='DeleteFile(\"" + result + "\")'><span class='glyphicon glyphicon-remove red'></span></a></td></tr>"; // Binding the file name  
                $("#ListofFiles tbody").append(markup);
                $('#Files').val('');
                $('#FileBrowse').find("*").prop("disabled", false);
            }
        });
        function progress() {
            var val = progressbar.progressbar("value") || 0;
            progressbar.progressbar("value", val + 1);
            if (val < 99) {
                setTimeout(progress, 25);
            }
        }
        setTimeout(progress, 100);
    }
    var uploadprogressflag = false;
    var maliciousConfirm = "false";
    var Againupload = "false";
    var infectedfilename = "";
    var flagtoken = true;
    var tokendocrequest = "";
    $("#cancelvirusupload").click(function () {
        //save without malicious docs
        $("#exampleModal").modal('hide');
        Againupload = "true";
        maliciousConfirm = "true";
        infectedfilename = $("#maliciousfilename").val();
        $("#createfiles").click();
    });
    $("#confirmvirusupload").click(function () {
        $("#exampleModal").modal('hide');
        Againupload = "true";
        maliciousConfirm = "true";
        infectedfilename = "";
        $("#createfiles").click();
    });
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    $("#createfiles").click(function () {
        var tempfcaseid = caseid;
        uploadprogressflag = true;
        var chkArray3 = [];
        var selected = $("input[name='options[]']:checked")
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
            //alert(selected3);
        }
        var dname = $("#directory").val();
        var cmatter = $("#cmatter").val();
        if (dname == "" && directoryid == 0) {
            dname = dname;
        }
        else if (dname == "" && directoryid != 0) {
            dname = directoryid;
        }
        if (cmatter != "") {
            caseid = cmatter;
        }
        if (tempfcaseid != "") {
            if ($("#directory").val() != "") {
                caseid = "";
            }
        }
        var filedetails = $("#filedetails").val();
        var formData = new FormData();
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            var tottempsize = 0;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
                //validate filechracter
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                    return false;
                }
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                var Extresponse = checkfileextDOC(filename);
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
                }
                tempsize = tempsize.toFixed(2);
            }
            formData.append("selectedpermission", EncodeText(selected3));
            formData.append("dirname", EncodeText(dname));
            formData.append("details", EncodeText(filedetails));
            formData.append("cmatter", EncodeText(caseid));
            formData.append("isindex", EncodeText(0));
            formData.append("maliciousConfirm", EncodeText(maliciousConfirm));
            formData.append("Againupload", EncodeText(Againupload));
            formData.append("infectedfilename", EncodeText(infectedfilename));
            var randomeno = Math.floor(Math.random() * 30) + 1;
            // openload();
            $("#progressBarstatus").show();
            $(".progress").show();
            if (flagtoken == true) {
                tokendocrequest = makeid(10);
            }
            formData.append("tokendocrequest", EncodeText(tokendocrequest));
            openload();
            $.ajax({
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                            $('#progressBar').attr('aria-valuenow', percent - randomeno).css('width', percent - randomeno + '%').text(percent - randomeno + '%');
                        }
                    });
                    return xhr;
                },
                url: '/api/AzureApi/Createfile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $('#attachment').find("*").prop("disabled", true);
                    uploadprogressflag = false;
                    //LoadProgressBar(response); //calling LoadProgressBar function to load the progress bar.  
                    $(".progress").show();
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create file for other users directory");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (String(response.Data) == "UnauthorizedNotice") {
                        alert("You can not upload document in this directory");
                        $("#progressBarstatus").hide();
                        $(".progress").hide();
                        closeload();
                        return false;
                    }
                    if (response.Status == true) {
                        $("#maliciousfilename").val("");
                        if (String(response.Data) == "True" || String(response.Data) == "true") {
                            maliciousConfirm = "false";
                            var datas = JSON.stringify(response);
                            $('#progressBar').attr('aria-valuenow', 100).css('width', 100 + '%').text(100 + '%');
                            $("#dirbound").html('');
                            $("#progressBarstatus").hide();
                            $(".progress").hide();
                            LoadDirectoryFiles(pageindex);
                            new PNotify({
                                title: 'Success!',
                                text: ' File Uploaded Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            flagtoken = true;
                            closeload();
                            $("#cmatter").val("");
                            LoadDirectory();
                            $("#list").text("");
                            $("#myModal1 .close").click();
                        }
                        else {
                            $("#virusconfirmbody").html("The uploaded file (<b>" + response.Data.filename + "</b>) seems to be infected or containing malicious content.Are you sure to continue?");
                            $("#maliciousfilename").val(response.Data.filename);
                            $("#exampleModal").modal('show');
                            flagtoken = false;
                            closeload();
                        }
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    closeload();
                    alert('Error!');
                }
            });
        }
    });
    var selectedIDSync = new Array();
    $(document).on("click", "#syncrqst", function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    var vdata = $(this).attr("data-val");
                    var flagvalue = $(this).attr("data-flag");
                    selectedIDSync.push(vdata);
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", EncodeText(selectedIDSync));
                formdata.append("tablekey", EncodeText("files"));
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveSyncRowData',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: ' Data sync request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            LoadDirectoryFiles(pageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: 'You do not have selected any row to sync?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });

    /*file remove request*/
    var selectedIDSync = new Array();
    $(document).on("click", "#fileremoverequest", function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save file remove request? Only File Delete Request will save.");
        if (result) {
            $('input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    var vdata = $(this).attr("data-val");
                    var flagvalue = $(this).attr("data-flag");
                    selectedIDSync.push(vdata);
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("typeIds", EncodeText(selectedIDSync));
                openload();
                $.ajax({
                    async: true,
                    url: '/api/AzureApi/SaveFileRemoveRequest',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        selectedID = [];
                        if (response.Status == true) {
                            var datas = JSON.stringify(response);
                            new PNotify({
                                title: 'Success!',
                                text: 'File remove request saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            $('#select_all').prop('checked', false);
                            LoadDirectoryFiles(pageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: ' You do not have selected any row for delete request?',
                    type: 'error',
                    delay: 3000
                });
                closeload();
            }
        }
    });
    $("#cmatter").change(function () {
        var mattervalue = $(this).val();
        LoadDirectory();
    });
    var matteridsfolder = "";
    /*Load Directory*/
    function LoadDirectory() {
        $("#directory").empty().html('');
        $("#filedirectory").empty().html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        matteridsfolder = $("#cmatter").val();
        dirtoken = directoryid;
        var dirid = dirtoken;
        var formData = new FormData();
        formData.append("dirtoken", EncodeText(dirtoken));
        formData.append("caseid", EncodeText(matteridsfolder));
        $.ajax({
            async: true,
            url: '/api/AzureApi/DirectoryList1',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                if (obj.length > 0) {
                    $("#directory,#filedirectory").empty();
                    var option7 = '<option value="" > Select</option>';
                    $("#directory").append(option7);
                    $("#filedirectory").append(option7);
                }
                $.each(obj, function (i, a) {
                    if (a.ftype == "0") {
                        var dirname = a.fname;
                        var ViewFolderName = "";
                        if (a.Caseid == "") {
                            ViewFolderName = dirname;
                        }
                        else {
                            var resultvalid = validatercasefile(dirname);
                            if (resultvalid == true) {
                                ViewFolderName = dirname.substring(0, dirname.length - 13);
                                ViewFolderName = ViewFolderName + "(Case)";
                            }
                            else {
                                ViewFolderName = dirname;
                            }
                        }
                        var option = '<option value="' + a.id + '" > ' + ViewFolderName + '</option>';
                        $("#directory").append(option);
                        //}
                        var option = '<option value="' + a.id + '" > ' + ViewFolderName + '</option>';
                        $("#filedirectory").append(option);
                    }
                });
                $("#createfolderdirdiv,#filefolderdiv").css("display", "block");
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
    var chksflag = true;
    searchtype = 0;
    $("#clearnewseach").click(function () {
        isRenderPage = false;
        $("#searchdata").val("");
        $("#clearnewseach").css("display", "none");
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                searchtype = 0;
                LoadDirectoryFiles(1, searchtype);
                chksflag = false;
            }
        }
    })
    $(document).on('click', '#searchdatas', function () {
        /* your code here */
        isRenderPage = false;
        searchdatac = $('#searchdata').val();
        if (searchdatac.length > 2) {
            $("#clearnewseach").css("display", "unset");
            $("#searchdatas").attr("disabled", true);
            searchtype = $('#searchtype').val();
            if (searchtype == 1) {
                LoadDirectoryFiles(1, searchtype);
            }
            else {
                LoadDirectoryFiles(1, searchtype);
            }
        }
        else {
            alert("Please enter minimum of three characters to start your search.");
            $('#searchdata').focus();
        }
        chksflag = true;
    });

    /*search data*/
    $(document).on('keyup', '#searchdata', function () {
        /* your code here */
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                searchtype = 0;
                LoadDirectoryFiles(1, searchtype);
                chksflag = false;
            }
        }
    });
    var diruser = "";
    $(document).on('click', '#paginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex, searchtype);
    });

    /*filter user document*/
    $("#filteruserdocument").change(function () {
        var cvalue = $(this).val();
        directorypath = "";
        localStorage.setItem("navigateuser", cvalue);
        localStorage.setItem("dirsuser", cvalue);
        diruser = cvalue;
        LoadDirectoryFiles(1);
    });
    var dirtoken = "";
    /*Load DirectoryFiles*/
    function LoadDirectoryFiles(pageindex, searchtype) {
        var temuser = $("#filteruserdocument").val();
        if (String(temuser) != "") {
            diruser = localStorage.getItem("dirsuser");
        }
        else {
            diruser = "";
        }
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
        var syncflg = 0;
        var syncicon = "";
        var synctitle = "";
        // alert("hi");
        var formData = new FormData();
        formData.append("dirtoken", EncodeText(directoryid));
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        if (String(roleid) == "1") {
            formData.append("user", EncodeText(diruser));
        }
        else {
            formData.append("user", EncodeText(""));
        }
        formData.append("search", EncodeText($('#searchdata').val()));
        formData.append("searchtype", EncodeText(searchtype));
        var ajaxTime = new Date().getTime();
        var rt1 = $.ajax({
            async: true,
            url: '/api/AzureApi/UserDirectoryList1byrowid',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response1) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("dirdetails:" + totalTime);
                //$("#tfooter").html("");
                var confidentialText = "";
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    if (response1.Data == "") {
                        closeload();
                        return false;
                    }
                    var obj = JSON.parse(response1.Data);
                    var length = obj.length;
                    if (length == "0") {
                        //$("#docstatus").html("No documents found.");
                        $("#pdatastatus").show();
                        $("#tradePagination").hide();
                    }
                    else {
                        //$("#docstatus").html("");
                        $("#pdatastatus").hide();
                        $("#tradePagination").show();
                    }
                }
                else {
                    closeload();
                }
                try {
                    $.each(obj, function (i, a) {
                        //html = "";
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
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
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                            //if (a.totRow <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //}
                            //tfot += '</ul>'
                            //$("#tfooter").append(tfot);
                            $("#docTotalCount").text("(" + a.totRow + ")");
                            var totdata = a.totRow;
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
                            closeload();
                        }
                        var tmpdir = a.fname;
                        var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                        var dirname = tmpdir.replace(replacedata, '');
                        var dat = a.date_time;
                        var dates1 = formatDatetoIST(dat)
                        var dates2 = a.date_time;
                        var dates1 = formatDatetoIST(dates2)
                        var ficon = "file.svg";
                        var icolor = "black";
                        var str = a.filetype;
                        var dropboxftoken = "";
                        var moveshow = "";
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOC" || ftype == "DOCX") {
                                ficon = "doc-icon.png";
                                icolor = "#1860a3";
                            }
                            if (ftype == "PPT" || ftype == "PPTX") {
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
                                ficon = "txt_icon";
                                icolor = "skyblue";
                            }
                        }
                        var editiconfilecheckcss = "display:none";
                        if (ftype == "DOC" || ftype == "DOCX") {
                            editiconfilecheckcss = "";
                        }
                        if (ftype == "DOC" || ftype == "DOCX") {
                            if (String(a.dirid) == "00000000-0000-0000-0000-000000000000") {
                                openurl = bsurlfile + '/Docs/ViewSampleCloud?fileName=' + a.fname + '&dname=&ftoken=' + a.firmId + '&utoken=' + a.Firmuser + '&token=' + a.id;
                            }
                            else {
                                openurl = bsurlfile + '/Docs/ViewSampleCloud?fileName=' + a.fname + '&dname=' + a.id + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser + '&token=' + a.id;
                            }
                            urlstype = "";
                        }
                        else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "PPT" || ftype == "PPTX") {
                            var pageURL1 = window.location.origin;
                            var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            try {
                                openurl = enctypesingle(downloadpath1);
                            }
                            catch (e) {
                                openurl = downloadpath1;
                            }
                            urlstype = "office";
                        }
                        else {
                            var pageURL1 = window.location.origin;
                            var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            try {
                                openurl = enctypesingle(downloadpath1);
                            }
                            catch (e) {
                                openurl = downloadpath1;
                            }
                            urlstype = "docs";
                        }
                        var dropboxftoken1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                        try {
                            dropboxftoken = enctypesingle(dropboxftoken1);
                        }
                        catch (e) {
                            dropboxftoken = dropboxftoken1;
                        }
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        var fids = "";
                        var id = 0;
                        if (a.ftype == 1) {
                            var tempdownloadpath = "/LawPractice_ds/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            if (a.movecount == 0) {
                                quesmark = "display:none";
                                moveshow = "cursor:pointer;display:unset;"
                            }
                            else {
                                quesmark = "cursor:pointer;display:unset";
                            }
                            if (String(a.IdDeleted) == "1") {
                                marklabel = "Unmark file for deletion";
                                markcolor = "margin-top:0px; color:red;cursor:pointer";
                                rowreflect = "background:#f5c9c9";
                            }
                            else {
                                marklabel = "Mark file for deletion";
                                markcolor = "margin-top:0px; color:#5c5c5c;cursor:pointer";
                                rowreflect = "";
                            }
                            if (String(a.fpermission) == "" || String(a.fpermission) == null || String(a.fpermission) == "0" || String(a.fpermission) == "NULL" || String(a.fpermission) == "null") {
                                syncflg = 0;
                                syncicon = "";
                                synctitle = "";
                            }
                            else {
                                syncflg = 1;
                                syncicon = "glyphicon glyphicon-refresh";
                                synctitle = "File marked for Syncing";
                            }
                            if (String(a.IsSync) == "1") {
                                dsyncicon = "glyphicon glyphicon-retweet";
                                dsynctitle = "Marked for data synchronization";
                            }
                            else {
                                dsyncicon = "";
                                dsynctitle = "";
                            }
                            // alert(a.fname);
                            var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                            var checkoutpath = "/Azure/CheckoutFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                            var watermarkpath = "/Azure/WaterMarkFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                            var chkincss = "";
                            var chkoutcss = "";
                            if (a.IsCheckinOut == "1") {
                                chkoutcss = "display:none";
                                chkincss = "display:block";
                            }
                            else {
                                chkoutcss = "display:block";
                                chkincss = "display:none";
                            }
                            var isdeletes = "display:block;color:red;";
                            var validateforinuse = "0";
                            if (a.IsCheckinOut == "1") {
                                if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                    if (a.oedit == "1") {
                                        validateforinuse = "0";
                                    }
                                }
                                else {
                                    if (a.oedit == "1") {
                                        validateforinuse = "1";
                                    }
                                }
                            }
                            if (a.odelete == 1 || roleid == 1) {
                            
                                //first
                                html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                                html += '<td class="7" style="' + rowreflect + '">';
                                //html += '<div class="file_wrapper"><img width="32px" height="32px" name = "' + a.fname + '" src=" /newassets/img/' + ficon + '" /> <span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span>'
                                html += '<div class="file_wrapper"><img width="32px" height="32px" name = "' + a.fname + '" src=" /newassets/img/' + ficon + '" /><span>' + a.fname + '</span>'
                                //if (a.oedit == "1" && a.IsCheckinOut != "1") {
                                //    html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                                //}
                                html += '<i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                                //html += '<div class="pull-right">'
                                //html += '<div class="btn-group" >'
                                //html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                //html += '<span><img src="/newassets/img/version-icon.png" /></span>';
                                //html += '<span class="sr-only">Toggle Dropdown</span>'
                                //html += '</button>'
                                //html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                //html += '<table width="100%" class="docactiontable"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                                //html += '<tbody id="bindfileversion' + a.id + '" >'
                                //html += '</tbody>'
                                //html += '</table>'
                                //html += '</div>'
                                //html += '</div>'
                                html += '</div>'
                                html += '</td>';
                                html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';
                                //html += '<td width="100px" style="' + rowreflect + '">'
                                //if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                //    if (a.oedit == "1") {
                                //        if (a.IsCheckinOut == "1") {
                                //            html += '<span class="checkin checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin <img src="/newassets/img/right_arrow.svg"></span>';
                                //        }
                                //        else {
                                //            html += '<span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg"></span>';
                                //        }
                                //    }
                                //}
                                //else {
                                //    if (a.oedit == "1") {
                                //        if (a.IsCheckinOut == "1") {
                                //            html += '<span class="inuse" style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1" title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use <img src="/newassets/img/right_arrow.svg"></span>';
                                //        }
                                //        else {
                                //            html += '<span href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg"></span>';
                                //        }
                                //    }
                                //}
                                //html+='</td>'
                                if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                    if (a.oedit == "1") {
                                        if (a.IsCheckinOut == "1") {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin1 checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin <img src="/newassets/img/right_arrow.svg"></span></td>';
                                        }
                                        else {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg"></span></td>';
                                        }
                                    }
                                }
                                else {
                                    if (a.oedit == "1") {
                                        if (a.IsCheckinOut == "1") {
                                            html += '<td width="100px" style="' + rowreflect + '"><span class="inuse" style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1" title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                                        }
                                        else {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg"></span></td>';
                                        }
                                    }
                                }
                                html += '<td style="' + rowreflect + ';padding:0px !important">';
                                html += '<div class="thbg">';
                                html += '<ul class="table_action" style="justify-content: flex-start;">';
                                if (a.share == 1 || roleid == 1) {
                                    html += '<li><span class="taskoutboxbtnicon" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></span></li>';
                                }
                                else {
                                    //html += '<li><div class="action_one" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" />Share</div></li>';
                                }
                                html += '<li><span class="taskoutboxbtnicon" isdelete="' + a.IdDeleted + '" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" data-inuser="' + validateforinuse + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '" value="' + a.id + '"><img src="/newassets/img/delete.svg" /> </span></li>';
                                html += '<li><div class="input-group-btn"><button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">';

                                //here
                                html += '<li><span class="action_one" id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"><img src="/newassets/img/document-icon.png" />View Document</span></li>'
                                if (a.oedit == "1" && a.IsCheckinOut != "1") {
                                    html += '<li><span class="action_one" id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" title="Click on file name to Edit ONLINE on the cloud"  style="cursor:pointer;' + editiconfilecheckcss + '"><img src="/newassets/img/editmatter.png" />Edit Document</span></li>'
                                }
                                html += '<li><div class="action_one" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"><img src="/newassets/img/editdescription.svg" /> Edit File Description</div></li>';
                                var confidcss = "";
                                var confidcsstitle = "";
                                if (a.Isconfidential == "1") {
                                    confidcss = "lock.svg";
                                    confidcsstitle = "Click here to mark document as non-confidential";
                                    confidentialText = "Mark Non-Confidential";
                                }
                                else {
                                    confidcss = "unlock.svg";
                                    confidcsstitle = "Click here to mark document as confidential";
                                    confidentialText = "Mark Confidential";
                                }
                                html += '<li><div class="action_one" marktype="' + a.Isconfidential + '" id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"> <img src="/newassets/img/' + confidcss + '"> ' + confidentialText + '</div></li>';
                                //Version History
                                html += '<li><span class="action_one" title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;"><img src="/newassets/img/versionHi.png"/>Version History</span></li>'
                                //End Version History
                                html += '<li><div class="action_one" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"><img src="/newassets/img/documenth-icon.svg" /> Document History</div></li>';
                                html += '<li><div id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="action_one" title="Upload document to Cloud Server(Dropbox/Google Drive)"><img width="15px" src="/newassets/img/upload-cloud.svg" /> Upload Document To Cloud</div></li>';
                                html += '<li><div class="action_one" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> <img src="/newassets/img/dowload.svg" /></span> Download Original Version</li>';

                                //if (a.share == 1 || roleid == 1) {
                                //    html += '<li><div class="action_one" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" />Share</div></li>';
                                //}
                                //else {
                                //    html += '<li><div class="action_one" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" />Share</div></li>';
                                //}

                                html += '</li></ul>';
                                if (a.share == 1 || roleid == 1) {
                                    html += '<li><span style="' + quesmark + '"><span class="taskoutboxbtnicon" title="File Already Shared."><img src="/newassets/img/info-square.svg" /></span></span></li>';
                                }
                                html += '</ul>';
                                html += '</div>';
                                html += '</td>';

                                //html += '<table width="100%" class="docactiontable"  style="border-collapse: separate"><tr ><td width="20px" style="' + rowreflect + '"><ul class="action-ul"><li><span class="action_one" isdelete="' + a.IdDeleted + '" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" data-inuser="' + validateforinuse + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '" value="' + a.id + '"><img src="/newassets/img/delete.svg" /> </span></li></ul></td>';

                                //html += '<td width="20px" style="' + rowreflect + '"><ul class="action-ul"><li> <span class="action_one" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> <img src="/newassets/img/dowload.svg" /> </span></li></ul></td>';

                                //var confidcss = "";
                                //var confidcsstitle = "";
                                //if (a.Isconfidential == "1") {
                                //    confidcss = "lock.svg";
                                //    confidcsstitle = "Click here to mark document as non-confidential";
                                //}
                                //else {
                                //    confidcss = "unlock.svg";
                                //    confidcsstitle = "Click here to mark document as confidential";
                                //}

                                //html += '<td width="20px" style="' + rowreflect + '"><ul class="action-ul"> <li> <span class="action_one" marktype="' + a.Isconfidential + '" id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"> <img src="/newassets/img/' + confidcss + '"></span><li></ul</td>';

                                //if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                //    if (a.oedit == "1") {
                                //        if (a.IsCheckinOut == "1") {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span class="checkin checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin <img src="/newassets/img/right_arrow.svg"></span></td>';
                                //        }
                                //        else {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg"></span></td>';
                                //        }
                                //    }
                                //}
                                //else {
                                //    if (a.oedit == "1") {
                                //        if (a.IsCheckinOut == "1") {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span class="inuse" style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1" title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use <img src="/newassets/img/right_arrow.svg"></span></td>';
                                //        }
                                //        else {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out <img src="/newassets/img/right_arrow.svg"></span></td>';
                                //        }
                                //    }
                                //}
                                //html += '<td style="' + rowreflect + '"><ul class="action-ul"><span class="action_one" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"><img src="/newassets/img/history.svg" /> </span></ul></td>';
                                //html += '<tr></table>';




                                //if (a.share == 1 || roleid == 1) {
                                //    html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"><ul class="action-ul"><li><span class="action_one" href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></span> </li> <li><span class="action_one" style="' + quesmark + '" title="File Already Shared."><img src="/newassets/img/info-square.svg" /></span></li></td><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</ul></td></tr > ';
                                //}
                                //else {
                                //    html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"></td ><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '" name="' + a.CreatedBy + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                                //}
                                html += '<td style="' + rowreflect + '">' + last + '</td><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '" name="' + a.CreatedBy + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                            }
                            else if (a.odelete == 1 && roleid == 1) {

                                //Second
                                html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                                html += '<td class="7" style="' + rowreflect + '">';
                                html += '<div name = "' + a.fname + '" class="file_wrapper" style = "font-size:14px;color:' + icolor + '" ><img src="/newassets/img/' + ficon + '" /> <span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></div></a >'
                                if (a.oedit == "1" || a.IsCheckinOut != "1") {
                                    html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                                }
                                html += '<i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                                //html += '<div class="pull-right">'
                                //html += '<div class="btn-group">'
                                //html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                //html += '<span><img src="/newassets/img/version-icon.png" /></span>';
                                //html += '<span class="sr-only">Toggle Dropdown</span>'
                                //html += '</button>'
                                //html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                //html += '<table width="100%" ><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                                //html += '<tbody id="bindfileversion' + a.id + '" >'
                                //html += '</tbody>'
                                //html += '</table>'
                                //html += '</div>'
                                //html += '</div>'
                                html += '</div>'
                                html += '</td>';
                                html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';

                                var confidcss = "";
                                var confidcsstitle = "";
                                if (a.Isconfidential == "1") {
                                    confidcss = "lock";
                                    confidcsstitle = "Click here to mark document as non-confidential";
                                    confidentialText = "Mark Non-Confidential";
                                }
                                else {
                                    confidcss = "unlock";
                                    confidcsstitle = "Click here to mark document as confidential";
                                    confidentialText = "Mark Confidential"
                                }
                                if (a.confidential == 1) {
                                    html += '<td width="20px" style="' + rowreflect + '"><i class="' + confidcss + '" style="color:#069;cursor:pointer" marktype="' + a.Isconfidential + '"  id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"></i></td>';
                                }
                                html += '<td style="' + rowreflect + ';padding:0px !important">';
                                if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                    if (a.oedit == "1") {
                                        if (a.IsCheckinOut == "1") {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin1 checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin<img src="/newassets/img/right_arrow.svg"></span></td>';
                                        }
                                        else {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out<img src="/newassets/img/right_arrow.svg"></span></td>';
                                        }
                                    }
                                }
                                else {
                                    if (a.oedit == "1") {
                                        if (a.IsCheckinOut == "1") {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                                        }
                                        else {
                                            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out<img src="/newassets/img/right_arrow.svg"></span></td>';
                                        }
                                    }
                                }


                                html += '<td style="' + rowreflect + ';padding:0px !important">';
                                html += '<div class="thbg">';
                                html += '<ul class="table_action docactiontable" style="justify-content: flex-start;"><li style="' + rowreflect + '"><button class="" isdelete="' + a.IdDeleted + '" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" data-inuser="' + validateforinuse + '" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '" value="' + a.id + '"></span> <li><span class="taskoutboxbtnicon" style="' + isdeletes + '"><img src="/newassets/img/delete.svg"/></span></button></li>';
                                html += '<li style="' + rowreflect + '"><a class="taskoutboxbtnicon" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"><img src="/newassets/img/download.svg"> </a></li>';
                                html += '<li style="' + rowreflect + '"><span id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="taskoutboxbtnicon" style="color: #1da1ce;font-size:15px;cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"><img src="/newassets/img/upload-cloud-01.png"></span></li>';
                                html += '<li style="' + rowreflect + '"><span class="taskoutboxbtnicon" style="color:#069;cursor:pointer" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"><img src="/newassets/img/edit.svg"> </span></li>';

                                //html += '<td style="' + rowreflect + ';padding:0px !important">';
                                //if (a.confidential == 1) {
                                //    html += '<td width="20px" style="' + rowreflect + '"><i class="' + confidcss + '" style="color:#069;cursor:pointer" marktype="' + a.Isconfidential + '"  id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"></i></td>';
                                //}
                                //html += '<td style="' + rowreflect + ';padding:0px !important">';
                                //if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                //    if (a.oedit == "1") {
                                //        if (a.IsCheckinOut == "1") {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin</span></td>';
                                //        }
                                //        else {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                                //        }
                                //    }
                                //}
                                //else {
                                //    if (a.oedit == "1") {
                                //        if (a.IsCheckinOut == "1") {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                                //        }
                                //        else {
                                //            html += '<td width="100px" style="' + rowreflect + '"><span style="cursor:pointer;color:maroon;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out</span></td>';
                                //        }
                                //    }
                                //}

                                //Version History
                                html += '<li><span class="action_one" title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;"><img src="/newassets/img/versionHi.png"/>Version History</span></li>'
                                //End Version History
                                html += '<li><span class="taskoutboxbtnicon" style="color:black;cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"><img src="/newassets/img/documenth-icon.svg" /></span></li>';
                                html += '</ul>';
                                html += '</div>';
                                html += '</td>';
                                if (a.share == 1 || roleid == 1) {
                                    html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span><span class="glyphicon glyphicon-share"></span></a> <span style="' + quesmark + '"> | </span> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="File Already Shared."></span></td ><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                                }
                                else {
                                    html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"></td > <td style="' + rowreflect + '">' + a.FileSize + '</td><td style="' + rowreflect + '">' + a.FileSize + '</td><td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> <td style="' + rowreflect + '">' + a.CaseNames + '</td></tr > ';
                                }
                            }
                            else {
                                debugger;
                                //third 
                                html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td>';
                                html += '<td class="7" style="' + rowreflect + '">';
                                html += '<div name = "' + a.fname + '" class="file_wrapper"><img src="/newassets/img/' + ficon + '" style="width: 36px;" /> <span>' + a.fname + '</span></a >'
                                //html += '<div name = "' + a.fname + '" class="file_wrapper"><img src="/newassets/img/' + ficon + '" style="width: 36px;" /> <span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a >'
                                //if (a.oedit == "1" && a.IsCheckinOut != "1") {
                                //    html += '<img id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                                //}
                                html += '<i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                                //html += '<div class="pull-right">'
                                //html += '<div class="btn-group" >'
                                //html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                //html += '<span><img src="/newassets/img/version-icon.png" /></span>';
                                //html += '<span class="sr-only">Toggle Dropdown</span>'
                                //html += '</button>'
                                //html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                //html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                                //html += '<tbody id="bindfileversion' + a.id + '" >'
                                //html += '</tbody>'
                                //html += '</table>'
                                //html += '</div>'
                                //html += '</div >'
                                //html += '</div>'
                                html += '</div>'
                                html += '</td>';
                                html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';
                                html += '<td width="100px" style="' + rowreflect + '">'
                                if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                    if (a.oedit == "1") {
                                        if (a.IsCheckinOut == "1") {
                                            html += '<span style="cursor:pointer;color:#069;' + chkincss + '" class="checkin1 checkin' + a.id + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.id + '">Checkin<img src="/newassets/img/right_arrow.svg"></span>';
                                        }
                                        else {
                                            html += '<span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out<img src="/newassets/img/right_arrow.svg"></span>';
                                        }
                                    }
                                }
                                else {
                                    if (a.oedit == "1") {
                                        if (a.IsCheckinOut == "1") {
                                            html += '<span style="' + chkincss + '" id="InUse' + a.id + '"  isinuse="1"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span>';
                                        }
                                        else {
                                            html += '<span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.id + '" id="checkout" value="' + a.id + '">Check Out<img src="/newassets/img/right_arrow.svg"></span>';
                                        }
                                    }
                                }
                                html += '</td>'
                                html += '<td style="' + rowreflect + ';padding:0px !important">';
                                html += '<div class="thbg">';
                                html += '<ul class="table_action docactiontable" style="justify-content: flex-start;">';
                                //Here
                                html += '<li><span class="taskoutboxbtnicon" title="View Document" id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> <img src="/newassets/img/viewdocumenthistory.svg" /></span></li>'
                                html += '<li><a class="taskoutboxbtnicon" title="Download Original Version" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"><img src="/newassets/img/download.svg" /> </a></li>';

                                html += ' <li> <div class="input-group-btn"><button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">'

                                if (a.oedit == "1" && a.IsCheckinOut != "1") {
                                    html += '<li><div class="action_one"><span id-val="' + a.oedit + '" id-checkout="' + a.IsCheckinOut + '" downloadpath1="' + downloadpath + '"  code="' + a.AZureFileId + '" id="idss" value ="' + last + '" href ="' + openurl + '" urltype= "' + urlstype + '" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px"><img src="/newassets/img/editmatter.png" />Edit Document</span></div></li>'
                                }
                                html += '<li><span class="action_one" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"><img src="/newassets/img/editdescription.svg"> Edit File Description</span></li>';
                                var confidcss = "";
                                var confidcsstitle = "";
                                if (a.Isconfidential == "1") {
                                    confidcss = "lock";
                                    confidcsstitle = "Click here to mark document as non-confidential";
                                    confidentialText = "Mark non-confidential"
                                }
                                else {
                                    confidcss = "unlock";
                                    confidcsstitle = "Click here to mark document as confidential";
                                    confidentialText = "Mark Confidential"
                                }
                                if (a.confidential == 1) {
                                    html += '<li style="' + rowreflect + '"><span class="action_one" marktype="' + a.Isconfidential + '"  id="MarkConfidential" data-val="' + a.id + '" title="' + confidcsstitle + '"><img src="/newassets/img/' + confidcss + '.svg">' + confidentialText + '</span></li>';
                                }
                                //Version History
                                html += '<li><span class="action_one" title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;"><img src="/newassets/img/versionHi.png"/>Version History</span></li>'
                                //End Version History
                                html += '<li><span id="savedropbox" code="' + a.AZureFileId + '" href="' + dropboxftoken + '" class="action_one" title="Upload document to Cloud Server(Dropbox/Google Drive)"><img src="/newassets/img/upload-cloud-01.png"> Upload Document To Cloud</span></li>';


                                html += '<li><span class="action_one" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view document history"><img src="/newassets/img/documenth-icon.svg">Document History</span></li>';
                                html += '</ul></div></li>'
                                html += '</ul>';
                                html += '</div>';
                                html += '</td>';
                                if (a.share == 1) {
                                    //html += '<td style="' + rowreflect + '">' + last + '</td> <td width="100px; " style="' + rowreflect + '"><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span><span class="glyphicon glyphicon-share"></span></a>  <span style="' + quesmark + '"> | </span><span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="File Already Shared."></span></td ><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td></tr > ';
                                }
                                else {
                                    html += '<td style="' + rowreflect + '">' + last + '</td><td style="' + rowreflect + '">' + a.FileSize + '</td> <td style="' + rowreflect + '" name="' + a.CreatedBy + '">' + a.CreatedBy + '</td> <td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td> </tr > ';
                                }
                            }
                        }
                        else {
                            if (a.movecount == 0) {
                                quesmark = "display:none";
                                moveshow = "cursor:pointer;"
                            }
                            else {
                                quesmark = "cursor:pointer;";
                                //moveshow = "display:none;"
                            }
                            if (String(a.IsSync) == "1") {
                                dsyncicon = "glyphicon glyphicon-retweet";
                                dsynctitle = "Marked for data synchronization";
                            }
                            else {
                                dsyncicon = "";
                                dsynctitle = "";
                            }
                            var caseidsnew = "";
                            if (a.dirid == "00000000-0000-0000-0000-000000000000" && a.Caseid != "") {
                                caseidsnew = a.Caseid;
                            }
                            else {
                                caseidsnew = "";
                            }
                            var d1 = new Date(a.date_time).toISOString().substring(0, 10);
                            var d2 = new Date('2019-01-15').toISOString().substring(0, 10);
                            var ViewFolderName = "";
                            if (a.Caseid == "") {
                                ViewFolderName = dirname;
                            }
                            else {
                                var resultvalid = validatercasefile(dirname);
                                if (resultvalid == true) {
                                    ViewFolderName = dirname.substring(0, dirname.length - 13);
                                    ViewFolderName = ViewFolderName + "(Case)";
                                }
                                else {
                                    ViewFolderName = dirname;
                                }
                            }
                            if (a.odelete == 1 && roleid == 1) {

                                //else first
                                //html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><div class="file_wrapper" name="' + a.fname + '" aria-hidden="true" > <img height="32px" width="32px" src="/newassets/img/file_blue.svg"> <a id="transferpage" caseid="' + caseidsnew + '" href="javascript:void()" data-val="' + a.id + '"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</span ></div></td><td></td>';
                                //if (a.fname == "Notice Management" && a.dirid == "00000000-0000-0000-0000-000000000000") {
                                //    html += '<td style="padding:0px !important">';
                                //}
                                //else {
                                //    html += '<td style="padding:0px !important"><ul class="table_action"><li><span id="removedir" class="taskoutboxbtnicon" code="' + a.AZureFileId + '" values="' + a.id + '" dirname="' + a.fname + '" filepath="' + directorypath + '" > <img src="/newassets/img/delete.svg" /> </span> </li> <li> <span id="OpenHistoryBox" class="taskoutboxbtnicon" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"><img src="/newassets/img/history.svg"></span></li>';
                                //    html += '<li><div class="input-group-btn"><button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">';
                                //    html += '<li><div class="action_one" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" />Share</div> </li>';

                                //    html += '<li><div class="action_one" id="renameDir" title="Rename Folder" values="' + a.id + '" dirname="' + a.fname + '"> <img src="/newassets/img/edit.svg"> Rename Folder </div></li>';
                                //    html += '<li><div class="action_one" id="moveDir" title="Move Folder" values="' + a.id + '" dirname="' + a.fname + '"><img src="/newassets/img/moveFolder.svg"> Move Folder  </div></li>'

                                //    html += '</ul>'
                                //}
                                //if (a.ChildFolderCount == 0 && (a.Caseid == "" || a.Caseid == "null" || a.Caseid == null)) {
                                //    if (String(NoticeParent) == directoryid) {
                                //    }
                                //    else {
                                //        // html += '<ul class="action-ul"><li><span class="action_one" id="renameDir" title="Rename Folder" values="' + a.id + '" dirname="' + a.fname + '"> <img src="/newassets/img/share.svg"> </span>'
                                //        //html += ' <span class="glyphicon glyphicon-log-out" id="moveDir" title="Move Folder" values="' + a.id + '" dirname="' + a.fname + '"> </span></li>'
                                //        //html += '<li><div class="input-group-btn"><button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">';
                                //        //html += '<li><div class="action_one" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" />Share</div> </li>';
                                //        //html += '<li><div class="action_one" href="javascript:void()" style="' + quesmark + '" title="Folders have Shared document."><img src="/newassets/img/edit.svg" /> Rename Folder </div></li>';
                                //        //html += '<li><div class="action_one" id="OpenEditBox" data-val="' + a.id + '" title="Click here to edit file description"><img src="/newassets/img/editdescription.svg" /> Edit File Description</div></li>';
                                //        //html += '</ul>'
                                //    }
                                //}
                                //html += '</li>'
                                //html += '<ul class="table_action">'
                                //html += '<li><span class="taskoutboxbtnicon" title="Folders have Shared document."><img src="/newassets/img/info-square.svg" /></span></li>'
                                //html += '</ul> ';
                                //html += '</td> <td> </td><td>&nbsp;</td> <td>' + a.CreatedBy + '</td> <td></td></tr > ';

                                html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><div class="file_wrapper" name="' + a.fname + '" aria-hidden="true" > <img height="32px" width="32px" src="/newassets/img/file_blue.svg"> <a id="transferpage" caseid="' + caseidsnew + '" href="javascript:void()" data-val="' + a.id + '"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</span ></div></td><td></td>';
                                if (a.fname == "Notice Management" && a.dirid == "00000000-0000-0000-0000-000000000000") {
                                    html += '<td style="padding:0px !important">';
                                }
                                else {
                                    html += '<td style="padding:0px !important"><div class="thbg"><ul class="table_action" style="justify-content: flex-start;"><li><div class="taskoutboxbtnicon" href="javascript:void()" title="Share document" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></div> </li><li><span id="removedir" class="taskoutboxbtnicon" code="' + a.AZureFileId + '" values="' + a.id + '" dirname="' + a.fname + '" filepath="' + directorypath + '" > <img src="/newassets/img/delete.svg" /> </span> </li>';
                                    html += '<li><div class="input-group-btn"><button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">';
                                    //html += '<li> <div id="OpenHistoryBox" class="action_one" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"><img src="/newassets/img/history.svg">Folder History</span></li>';

                                }
                                if (a.ChildFolderCount == 0 && (a.Caseid == "" || a.Caseid == "null" || a.Caseid == null)) {
                                    if (String(NoticeParent) == directoryid) {
                                    }
                                    else {

                                        html += '<li><div class="action_one" id="renameDir" title="Rename Folder" values="' + a.id + '" dirname="' + a.fname + '"> <img src="/newassets/img/edit.svg"> Rename Folder </div></li>';
                                        html += '<li><div class="action_one" id="moveDir" title="Move Folder" values="' + a.id + '" dirname="' + a.fname + '"><img src="/newassets/img/moveFolder.svg"> Move Folder  </div></li>'

                                    }
                                }
                                if (a.fname == "Notice Management" && a.dirid == "00000000-0000-0000-0000-000000000000") {
                                }
                                else {
                                    html += '<li> <div id="OpenHistoryBox" class="action_one" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"><img src="/newassets/img/documenth-icon.svg">Folder History</span></li>';
                                }

                                html += '</ul>'
                                html += '</li>'
                                html += '<ul class="table_action">'
                                html += '<li><span class="taskoutboxbtnicon" style="' + quesmark + '" title="Folders have Shared document."><img src="/newassets/img/info-square.svg" /></span></li></ul>'
                                html += '</ul> ';
                                html += '</div> ';
                                html += '</td> <td> </td><td>&nbsp;</td> <td>' + a.CreatedBy + '</td> <td></td></tr > ';
                            }
                            else if (a.odelete == 1 || roleid == 1) {
                                debugger;
                                //else second
                                html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><div name="' + a.fname + '" class="file_wrapper" aria-hidden="true"><img height="32px" width="32px" src="/newassets/img/file_blue.svg"><a id="transferpage" caseid="' + caseidsnew + '" href="javascript:void()" data-val="' + a.id + '"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i> </div></td><td width="100px; ">' + dates1 + '</td><td></td>';
                                html += '<td style="padding:0px !important"><div class="thbg">';
                                html += '<ul class="table_action" style="justify-content: flex-start;">'

                                html += '<li> <a class="taskoutboxbtnicon" href="javascript:void()" title="Share Folder"  data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></a> </li> <li> <span class="taskoutboxbtnicon" style="' + quesmark + '" title="Folders have Shared document."> <img src="/newassets/img/share.svg" /> </span></li>';
                                if (a.Caseid == "" || a.Caseid == "null" || a.Caseid == null) {
                                    if (a.fname == "Notice Management" && a.dirid == "00000000-0000-0000-0000-000000000000") {
                                    }
                                    else {
                                        html += '<li><span id="removedir" class="taskoutboxbtnicon" code="' + a.AZureFileId + '" values="' + a.id + '" dirname="' + a.fname + '" filepath="' + directorypath + '" > <img src="/newassets/img/delete.svg" /> </span> </li>';
                                    }
                                }
                                else if (a.Caseid != "null" && a.Caseid != null && a.Caseid != "") {
                                    html += '<li><span class="taskoutboxbtnicon" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"> <img src="/newassets/img/documenth-icon.svg" /> </span></li>'
                                }
                                if (a.ChildFolderCount == 0 && (a.Caseid == "" || a.Caseid == "null" || a.Caseid == null)) {
                                    html += '<li><span class="taskoutboxbtnicon" id="renameDir" title="Rename Folder" values="' + a.id + '" dirname="' + a.fname + '"> <img src="/newassets/img/edit.svg" /> </span></li>'
                                    html += '<li><span class="taskoutboxbtnicon" id="moveDir" title="Move Folder" values="' + a.id + '" dirname="' + a.fname + '"><img src="/newassets/img/moveFolder.svg" /> </span></li>'
                                }

                                html += '</ul></td ></div> ';
                                //html += '<td></td> <td> <ul class="table_action"> <li> <a class="taskoutboxbtnicon" href="javascript:void()" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></a> </li> <li> <span class="taskoutboxbtnicon" style="' + quesmark + '" title="Folders have Shared document."> <img src="/newassets/img/share.svg" /> </span></li> </ul> </td><td>&nbsp;</td> <td>' + a.CreatedBy + '</td> <td></td></tr > ';
                                html += ' <td></td><td>&nbsp;</td> <td>' + a.CreatedBy + '</td> <td></td></tr > ';
                            }
                            else {
                                debugger;
                                //else third
                                //    html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><span name="' + a.fname + '" class="glyphicon glyphicon-folder-close" aria-hidden="true" style="color:#0a61b8"> </span>&nbsp;&nbsp;<a id="transferpage"  caseid="' + caseidsnew + '" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</td>';
                                //    if (a.ChildFolderCount == 0 && (a.Caseid == "" || a.Caseid == "null" || a.Caseid == null)) {
                                //        html += '<td>&nbsp;<span class="glyphicon glyphicon-edit" style="color:#069; cursor:pointer;" id="renameDir" title="Rename Folder" values="' + a.id + '" dirname="' + a.fname + '"> </span>'
                                //        html += '&nbsp; <span class="glyphicon glyphicon-log-out" style="color:maroon; cursor:pointer;" id="moveDir" title="Move Folder" values="' + a.id + '" dirname="' + a.fname + '"> </span></td>'
                                //    }
                                //    else if (a.Caseid != "null" && a.Caseid != null && a.Caseid != "") {
                                //        html += '<td><span class="fa fa-history" style="color:black;cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"></span></td>'
                                //    }
                                //    else {
                                //        html += '<td></td>'
                                //    }
                                //    html += '<td></td> <td><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></a> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="Folders have Shared document."></span></td> <td>&nbsp;</td><td>' + a.CreatedBy + '</td> <td></td></tr > ';
                                //}
                                html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><div name="' + a.fname + '" class="file_wrapper" aria-hidden="true" > <img height="32px" width="32px" src="/newassets/img/file_blue.svg"> <a id="transferpage"  caseid="' + caseidsnew + '" href="javascript:void()" data-val="' + a.id + '" ><span>' + ViewFolderName + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></div></td><td width="100px; ">' + dates1 + '</td><td></td>';
                                html += '<td style="padding:0px !important"><div class="thbg"><ul class="table_action" style="justify-content: flex-start;">'
                                html += '<li><a class="taskoutboxbtnicon" href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></a></li><li> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="Folders have Shared document."></span></li>';
                                if (a.ChildFolderCount == 0 && (a.Caseid == "" || a.Caseid == "null" || a.Caseid == null)) {
                                    html += '<li><span class="taskoutboxbtnicon" id="renameDir" title="Rename Folder" values="' + a.id + '" dirname="' + a.fname + '"> <img src="/newassets/img/edit.svg"> </span></li>'
                                    html += '<li><span class="taskoutboxbtnicon" id="moveDir" title="Move Folder" values="' + a.id + '" dirname="' + a.fname + '"> <img src="/newassets/img/moveFolder.svg"> </span></li>'
                                }
                                else if (a.Caseid != "null" && a.Caseid != null && a.Caseid != "") {
                                    //html += '<td><span class="fa fa-history" style="color:black;cursor:pointer" id="OpenHistoryBox" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"></span></td>'
                                    html += '<li><span id="OpenHistoryBox" class="taskoutboxbtnicon" data-val="' + a.id + '" name="' + (a.fname).replace('.pdf', '') + '" title="Click here to view folder history"><img src="/newassets/img/documenth-icon.svg"></span></li>'
                                }
                                else {
                                    html += '';
                                }

                                html += '</ul></div></td>'
                                //html += '<td></td> <td><a href="javascript:void()" style="margin-top:0px;cursor:pointer" title="Share Folder" data-toggle="modal" type="folder" id="permopen" value="' + a.id + '" valuename="' + dirname + '"><img src="/newassets/img/share.svg" /></a> <span class="glyphicon glyphicon-info-sign" style="' + quesmark + '" title="Folders have Shared document."></span></td> <td>&nbsp;</td><td>' + a.CreatedBy + '</td> <td></td></tr > ';
                                html += '<td></td><td>&nbsp;</td><td>' + a.CreatedBy + '</td> <td></td></tr >';
                                //html += '<td><ul class="table_action"> <li><span class="taskoutboxbtnicon" style="' + quesmark + '" title="Folders have Shared document."><img src="/newassets/img/share.svg"></span> </li></ul></td> <td>&nbsp;</td><td>' + a.CreatedBy + '</td> <td></td></tr > ';
                            }
                        }

                        //$("#dirbound").append(html);
                    });
                }
                catch (err) {
                    console.log(err.message);
                }
                $("#dirbound").append(html);
                closeload();
                loadcontact1();
            },
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (loadcontactflag == false) {
                permissionlist();
                loadcontact();
                loadcontactflag = true;
                LoadDirectory();
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
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    LoadDirectoryFiles(setPageNo, searchtype);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        isRenderPage = false;
        $("#txtgopage").val("");
        LoadDirectoryFiles(setPageNo, searchtype);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$(document).on("click", "#prev", function () {
    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    LoadDirectoryFiles(setPageNo, searchtype);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $(document).on("click", "#prev", function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
       
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        LoadDirectoryFiles(setPageNo, searchtype);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = false;
        $("#txtgopage").val("");
        LoadDirectoryFiles(setPageNo, searchtype);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#divGo", function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        LoadDirectoryFiles(setPageNo, searchtype);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");

    });
    /*Pagination End*/

    $(document).on("click", "#transferpage12", function () {
        isRenderPage = false;
        window.location = encodeURI("/" + fcode + "/azure/directorylist/0");
    });
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        $("#transferpage12").attr("data-val", transferid);
        var tempusers = $("#filteruserdocument").val();
        localStorage.setItem("dirsuser", tempusers);
        localStorage.setItem("contacttoken", transferid);
        var tflags = 0;
        var urls = "/" + fcode + "/azure/DirectoryList/1";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "tflag": tflags }
        });
    });
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';

    /*open file in office*/
    jQuery('#modeldocs').click(function (e) {
        var pageURL = window.location.href;
        var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        var fdir = $('#filedirectory').val();
        if (fdir == "") {
            fdir = lastURLSegment
        }
        else {
            dirtoken = fdir;
        }
        dirtoken = fdir;
        var dname = $("#filedirectory").val();
        if (dname == "" && directoryid == 0) {
            dname = 0;
        }
        else if (dname == "" && directoryid != 0) {
            dname = directoryid;
        }
        dirtoken = dname;
        var filename = $('#filename').val();
        if (filename == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: 'Please Enter File name.',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
        if (reg.test(filename) == true) {
            alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed in File name.');
            return false;
        }
        else {
            var urls = $('.document').attr('href');
            var formData = new FormData();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/AzureApi/CheckDocumentQuota",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (String(response.Data) == "EXCEEDLIMIT") {
                        alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                        return false;
                    }
                    else if (String(response.Data) == "NOLIMIT") {
                        alert("Please Upgrade Your Storage Limit");
                        return false;
                    }
                    else {
                        var newulrs = urls + "&fname=" + filename + "&dname=" + dirtoken;
                        $("#hiddirectid").val(dirtoken);
                        $('#docframe').attr('src', newulrs);
                        $('#docframeobject').attr('data', newulrs);
                        $("#spanheadfile").html("Create document");
                        $("#createdocclose").click();
                        $('#myModal8').modal({ show: true });
                        $('#filename').val("");
                        setTimeout(function () {
                            $("#dirbound").html('');
                            LoadDirectoryFiles(pageindex);
                            alert("Document created successfully and changes will reflect within few minutes.");
                            //  alert("hi")
                        }, 3000);
                    }

                }, //End of AJAX Success function
                failure: function (response) {
                    //alert(response.responseText);
                    closeload();
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                    closeload();
                } //End of AJAX error function
            });
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
                text: 'Please Enter File name.',
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
            $('#docframeobjct').attr('data', newulrs);
            $('#myModal8').modal({ show: true });
            $('#filename').val("");
            setTimeout(function () {
                $("#dirbound").html('');
                LoadDirectoryFiles(pageindex);
                //  alert("hi")
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
                text: 'Please Enter File name.',
                type: 'error',
                delay: 3000
            });
        }
        else if (fdir == "") {
            $('#docframe').attr('src', "#");
            new PNotify({
                title: 'Warning!',
                text: 'Please select directory.',
                type: 'error',
                delay: 3000
            });
        }
        else {
            var urls = $('.presentation').attr('href');
            var newulrs = urls + "&fname=" + filename + "&dname=" + fdir;
            $('#docframe').attr('src', newulrs);
            $('#docframeobject').attr('data', newulrs);
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
        var codes = $(this).attr("code");
        checkopen = true;
        var permission = $(this).attr("id-val");
        var permissioncheckout = $(this).attr("id-checkout");
        var foo = getParameterByName('token', path1); // "lorem"
        //new URLSearchParams(path1)
        checktoken = getParameterByName('token', path1);
        $("#spanheadfile").html("View File");
        if (value == "DOCX File" || value == "DOC File") {
            //if (value == "DOCX File" || value == "DOC File" || value == "XLSX File") {
            if (String(permissioncheckout) == "1") {
                $('#spanheadfile').html("View File");
            }
            else if (String(permission) == "1") {
                $('#spanheadfile').html("Edit File");
            }
            else {
                $('#spanheadfile').html("View File");
            }
            $('#docframe').attr('src', link);
            $('#myModal8').modal({ show: true });
        }
        else {
            $("#otherdocframe").attr("src", "/Firm/loader");
            var formdata = new FormData();
            formdata.append("filepath", EncodeText(link));
            formdata.append("code", EncodeText(codes));
            formdata.append("urltypes", EncodeText(urltypes));
            formdata.append("baseurl", EncodeText(window.location.origin));
            openload();
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
function download_pdf(id, userid, firmid, docid) {
    if (confirm('are you sure you want to download this file?')) {
        window.location = encodeURI("/DownloadFile.ashx?module=EsignDocument&id=" + id.trim() + "&userid=" + userid.trim() + "&firmid=" + firmid.trim() + "&docid=" + docid.trim());
    }
}
function CheckCordinate(signcordinate) {
    $("input[name=S_position][value=Signed]").prop("checked", true);
    var cordinate = signcordinate.split(',');
    $("input[name=S_S_position]").prop("disabled", false);
    for (var i = 0; i < cordinate.length; i++) {
        if (cordinate[i] != null || cordinate[i] != '') {
            $("input[name=S_S_position][value=" + cordinate[i] + "]").prop("disabled", true);
        }
    }
}
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 20;
    //alert(maxRows);
    // alert(maxRows);// get Max Rows from select option
    var totalRows = $(table + ' tbody tr ').length;
    // alert(totalRows);// numbers of rows
    $('#example tbody tr').each(function () {			// each TR in  table and not the header
        trnum++;
        //alert(trnum);// Start Counter
        if (trnum > maxRows) {						// if tr number gt maxRows
            $(this).hide();							// fade it out
        } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    });
    //  was fade out to fade it in
    if (totalRows > maxRows) {						// if tr total rows gt max rows option
        var pagenum = Math.ceil(totalRows / maxRows);
        // alert(pagenum);// ceil total(rows/maxrows) to get ..
        //	numbers of pages
        for (var i = 1; i <= pagenum;) {			// for each page append pagination li
            $('.pagination').append('<li data-page="' + i + '">\
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </li>').show();
        }											// end for i
    } 												// end if row count > max rows
    $('.pagination li:first-child').addClass('active'); // add active class to the first li
    $('.pagination li').on('click', function () {		// on click each page
        var pageNum = $(this).attr('data-page');
        // alert(pageNum);// get it's number
        var trIndex = 0;							// reset tr counter
        $('.pagination li').removeClass('active');	// remove active class from all li
        $(this).addClass('active');					// add active class to the clicked
        $('#example tbody tr').each(function () {		// each tr in table not the header
            trIndex++;
            // alert(trIndex);
            // tr index counter
            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
            if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                $(this).hide();
            } else { $(this).show(); } 				//else fade in
        }); 										// end of for each tr in table
    });										// end of on click pagination list
    // end of on select change
    // END OF PAGINATION
}

async function checkPdfForScripts(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;

            const suspiciousPatterns = [
                /\/JavaScript/i,
                /\/JS/i,
                /\/OpenAction/i,
                /<script/i,
                /javascript:/i,
                /eval\(/i
            ];

            const found = suspiciousPatterns.some((p) => p.test(content));
            resolve(found ? "Suspicious file" : "Clean file");
        };
        reader.readAsText(file);
    });
}








$(document).on('change', '#attachment', function (e) {
    selectedpostedFile = [];

    var fileCount = this.files.length;
    if (fileCount > 0) {
        $("#dropContainer").attr("title", "Document Attached");
    } else {
        $("#dropContainer").attr("title", "upload Attachment");
    }

    const files = Array.from(e.target.files);
    selectedpostedFile = [...selectedpostedFile, ...files];

    displaypostedFile();

    // Optional: if you want to allow re-selecting the same file again
    // this.value = '';
});

$(document).on('click', '.remove-file-postedFile', function (e) {
    // IMPORTANT: prevent label/container click from firing
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const index = $(this).data('index');
    selectedpostedFile.splice(index, 1);
    displaypostedFile();
});

function displaypostedFile() {
    const fileList = $('#fileListDocs');
    fileList.empty();

    const fCount = selectedpostedFile.length;

    selectedpostedFile.slice(0, 5).forEach((file, index) => {
        const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file-postedFile"
                      data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
        fileList.append(fileItem);
    });

    if (fCount > 5) {
        const remaining = fCount - 5;
        fileList.append(`
            <div class="file-summary" style="margin-top:5px;color:#555;">
                +${remaining} more (Total ${fCount} files selected)
            </div>
        `);
    }

    updatepostedFileInput();

    // Update title when empty after removals
    $("#dropContainer").attr("title", fCount > 0 ? "Document Attached" : "upload Attachment");
}

function updatepostedFileInput() {
    const dt = new DataTransfer();
    selectedpostedFile.forEach(file => dt.items.add(file));
    document.getElementById('attachment').files = dt.files;
}

function clearpostedFileUpload() {
    selectedpostedFile = [];
    const fileInput = document.getElementById("attachment");
    if (fileInput) fileInput.value = "";
    $('#fileListDocs').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
}