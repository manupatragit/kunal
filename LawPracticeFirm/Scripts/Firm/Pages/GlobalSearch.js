var dpageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var kpageindex = 1; mpageindex = 1, spageindex = 1, ipageindex = 1, ipagesize = 10, chpageindex = 1; chpagesize = 10, totalcomcount = 0;
var taskpageindex = 1;
var fcode = localStorage.getItem("FirmCode");
var chksflag = true;
var tatalRecordCount = 1;
$(document).ready(function () {
    var pageindex = 1, pagesize = 10;
    var setPageNo = 1; var tatalRecordCount = 1;

    //For Global Search with New UI
    if (GlobalSaechTxt != "") {
        $("#txtSearch").val(GlobalSaechTxt);
        $("#idglobalsearch").val(GlobalSaechTxt);
        openload();
        loadMessaging(spageindex);
        iLoadTaskData(ipageindex);
        loadMatterlist(mpageindex);
        LoadDirectoryFiles(dpageindex, 2);
        loadknowledge(kpageindex);
        //loadChatMessaging(chpageindex);
        setTimeout(function () { closeload(); }, 7000);
        chksflag = true;
        totalcomcount = 0;
    }
    bindCommonDropdown("casefilterstatus", "Case_Status", 'Status');
    function openload() {
        $('#myOverlayNew').css("display", "block");
    }
    function closeload() {
        $('#myOverlayNew').css("display", "none");
    }

    /*Bond common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", EncodeText(dropdownname));
        //read assign using list
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = response.Data.length;
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                }); //End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $(document).on("click", "#idss", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var durl = $(this).attr("downloadpath1");
        window.location.href = durl;
    });
    /*Clear new search*/
    $("#clearnewseach").click(function () {
        $("#txtSearch").val("");
        $("#updatePanel,#chatdoclist,#ibindcasetask,#bindcasedata,#dirbound,#loadactivitydatas,#chatdoclist").html("");
        $("#itfooter,#itfooter,#casetfooter,#casetfooter,#ktfooter,#tfooter,#chatstfooter,#stfooter").html("");
        $("#clearnewseach").css("display", "none");
        $("#comcircle").text('');
        $("#taskcircle").text('');
        $("#mattercircle").text('');
        $("#doccircle").text('');
        $("#knowcircle").text('');
    });
    /*Search data*/
    $("#searchdatas").click(function () {
        $("#dirbound").html("");
        $('#updatePanelKnowledge').html("");
        $("#bindcasedata").html("");
        $("#updatePanel").html("");
        $("#itfooter").html("");
        $("#ibindcasetask").html("");
        var casefiltercasename = $("#txtSearch").val();
        if (casefiltercasename == "") {
            alert("Enter search text");
            $("#casefiltercasename").focus();
            return false;
        }
        else {
            $("#clearnewseach").css("display", "unset");
            openload();
            loadMessaging(spageindex);
            iLoadTaskData(ipageindex);
            loadMatterlist(mpageindex);
            LoadDirectoryFiles(dpageindex, 2);
            loadknowledge(kpageindex);
           // loadChatMessaging(chpageindex);
            setTimeout(function () { closeload(); }, 3000);
            chksflag = true;
            totalcomcount = 0;
        }
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
    $(document).on("click", "#transferpage", function () {
        var token = $(this).attr("sno");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    /*Knowledge file path*/
    $(document).on("click", "#openknowfile", function () {
        var data = $(this).attr("data-val");
        var formdata = new FormData();
        formdata.append("filepath", EncodeText(data));
        $.ajax({
            async: true,
            url: '/api/CallApi/Knowledgefilepath',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var parts = String(response.Data).split('/');;
                $("#loadfile").load(response.Data);
                var lastSegment = parts.pop() || parts.pop();
                var chckfileext = lastSegment.substring(lastSegment.lastIndexOf(".") + 1, lastSegment.length);
                var urlopen = '';
                if (String(chckfileext).toLowerCase() == "doc" || String(chckfileext).toLowerCase() == "docx") {
                    urlopen = "https://view.officeapps.live.com/op/view.aspx?src=" + location.protocol + "//" + location.hostname + "/" + response.Data;
                }
                else if (String(chckfileext).toLowerCase() == "ppt" || String(chckfileext).toLowerCase() == "pptx") {
                    urlopen = "https://view.officeapps.live.com/op/view.aspx?src=" + location.protocol + "//" + location.hostname + "/" + response.Data;
                }
                else if (String(chckfileext).toLowerCase() == "csv" || String(chckfileext).toLowerCase() == "xlsx" || String(chckfileext).toLowerCase() == "xls") {
                    urlopen = "https://view.officeapps.live.com/op/view.aspx?src=" + location.protocol + "//" + location.hostname + "/" + response.Data;
                }
                else if (chckfileext.toLowerCase() == "pdf") {
                    urlopen = window.origin + "/" + response.Data;
                }
                else {
                    urlopen = window.origin + "/" + response.Data;
                    // alert("File format is not supported.");
                    //return false;
                }
                if (chckfileext.toLowerCase() == "pdf") {
                    $('#docframe').attr('src', urlopen);
                    $('#myModal8').modal({ show: true });
                    setTimeout(function () {
                        var iframe = document.getElementById('docframe');
                        iframe.src = iframe.src;
                    }, 1000);
                }
                else {
                    $('#docframe').attr('src', urlopen);
                    $('#myModal8').modal({ show: true });
                }
            },
            error: function () {
                //  alert('Error!');
            }
        });
        function openWindow(urls, id, value) {
            var form = document.createElement('FORM');
            form.method = 'POST';
            form.action = urls;
            form.target = 'newWindow'; // Specify the name of the window(second parameter to window.open method.)
            var input = document.createElement("INPUT");
            input.id = id;
            input.name = id;
            input.type = "hidden";
            input.value = value;
            form.appendChild(input);
            document.body.appendChild(form);
            window.open("", "newWindow", "location=yes,width=600,height=600");
            //window.open("", "newWindow");
            form.submit();
        }
    });
    /*Get data by page number*/
    $(document).on('click', '#kgetdatabypagenum', function () {
        kpageindex = $("#kpagnumvalue").val();
        if (kpageindex != "undefined") {
            if (Math.sign(kpageindex) == 1) {
                var pageindesx = $("#ksotopage").text();
                if (kpageindex <= parseInt(pageindesx)) {
                    openload();
                    loadknowledge(kpageindex);
                    closeload();
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
    $(document).on('click', '#kpaginate', function () {
        kpageindex = $(this).attr("index");
        loadknowledge(kpageindex);
    });
    $(document).on("click", ".LoginId", function () {
        var token = $(this).attr("data-id");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });
    $(document).on("click", "#caseid", function () {
        var token = $(this).attr("sno");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/NewCaseDashboard";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $(document).on("click", "#Taskid", function () {
        var token = $(this).attr("sno");
        var duedate = $(this).attr("data-id");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/" + fcode + "/Firm/UserTask";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token, "Tidss": duedate }
        });
    });

    //For comunication Redirect
    $(document).on("click", "#transferpagecom", function () {
        var token = $(this).attr("sno");
        var comflag = $(this).attr("flag");
        if (comflag == "1") {
            var urls = "/" + fcode + "/Firm/NewCaseDashboard?type=SentCommunication";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": token }
            });
        } else if (comflag == "2") {
            var urls = "/" + fcode + "/Firm/ReceiveMessageList";
            url_redirect({
                url: urls,
                method: "post",
                data: { "token": token }
            });
        }
    });
});
//document bind
var bsurlfile = window.location.origin + "/" + fcode;
function LoadDirectoryFiles(dpageindex, searchtype) {
    $("#dirbound").html("");
    var html = '';
    var html1 = '';
    var marklabel = "";
    var markcolor = "";
    var urlstype = "";
    var togsum = 0;
    var syncflg = 0;
    var syncicon = "";
    var synctitle = "";
    var formData = new FormData();
    formData.append("dirtoken", EncodeText("0"));
    formData.append("pagenum", EncodeText(dpageindex));
    formData.append("pagesize", EncodeText(pagesize));
    formData.append("user", "");
    formData.append("search", EncodeText($('#txtSearch').val()));
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
            $("#doccircle").text('');
            var totalTime = new Date().getTime() - ajaxTime;
            $("#tfooter").html("");
            if (response1.Status == true) {
                var datas1 = JSON.stringify(response1);
                if (response1.Data.length > 0) {
                    var obj = JSON.parse(response1.Data);
                    var length = obj.length;
                    $("#docstatus").html("");
                }
                else {
                    $("#docstatus").html("No documents found.");
                }
            }
            else {
                //closeload();
            }
            if (response1.Data == "[]" || !response1.Data || response1.Data.length === 0) {
                $("#docstatus").html("No documents found.");
                $(".trigger.headtxt[ttllbl='Document Management']").html('<span class="pmicon"><a>+</a></span> Document Management - (0)');
            }
            //try {
            $.each(obj, function (i, a) {
                if (i === 0) {
                    firstvalue = a.rownum;
                }
                if (i === (length - 1)) {
                    var totdata = a.totRow;
                    var totpage = Math.ceil(parseInt(totdata) / parseInt(pagesize));

                    // Show/hide next-prev buttons
                    if (dpageindex == totpage) {
                        $('#nextDocs').hide();
                    } else {
                        $('#nextDocs').css("display", "block");
                    }
                    if (dpageindex == 1) {
                        $('#prevDocs').css("display", "none");
                    } else {
                        $('#prevDocs').css("display", "block");
                    }

                    var pnext = Math.min(dpageindex + 1, totpage);
                    var pprev = Math.max(dpageindex - 1, 1);

                    $("#pagnumvalue").attr("max", totpage);
                    tatalRecordCount = totpage;
                    var tfot = '';
                    $("#exportrecords").val(a.totRow);
                    $(".trigger.headtxt[ttllbl='Document Management']").html('<span class="pmicon"><a>+</a></span> Document Management - (' + a.totRow + ')');
                    tfot += '<ul>';
                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li>pages ' + dpageindex + '/ ' + totpage + '</li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1" class="footerInput" style="background:#fff !important;"><a class="gobtn" type="button" id="pgetdatabypagenumdocs" style="margin-left:10px;cursor:pointer">Go</a></li>';

                    if (dpageindex > 1) {
                        tfot += '<li><span><a id="ppaginatedocs"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span> ' + firstvalue + '-' + a.rownum + ' <span>';
                    }
                    if (dpageindex < totpage) {
                        tfot += '<a  id="ppaginatedocs" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span></li>';
                    }
                    tfot += '</ul>';
                    $("#cdocsfooter").append(tfot);
                    renderPaginationDocs(dpageindex, totpage);
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
                var dropboxftoken = "";
                var moveshow = "";
                if (str != null) {
                    var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                    var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                    var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                    if (ftype == "DOC" || ftype == "DOCX") {
                        ficon = "fa fa-file-word-o";
                        icolor = "#1860a3";
                    }
                    if (ftype == "PPT" || ftype == "PPTX") {
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
                    openurl = enctypesingle(downloadpath1);
                    urlstype = "office";
                }
                else {
                    var pageURL1 = window.location.origin;
                    var downloadpath1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                    openurl = enctypesingle(downloadpath1);
                    urlstype = "docs";
                }
                var dropboxftoken1 = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                dropboxftoken = enctypesingle(dropboxftoken1);
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
                        var downloadpath = "/Azure/GetDownloadFile?filename=" + a.filename + "&code=" + a.AZureFileId + ""
                        fids = "w";
                    } else {
                        var downloadpath = "/Azure/GetDownloadFile?filename=" + a.filename + "&code=" + a.AZureFileId + ""
                        fids = "m";
                    }
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
                        synctitle = "File has marked for synchronization";
                    }
                    dsyncicon = "";
                    dsynctitle = "";
                    // alert(a.fname);
                    var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
                    var checkoutpath = "/Azure/CheckoutFile?filename=" + a.fname + "&code=" + a.AZureFileId + "&token=" + a.id + "";
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
                    var isdeletes = "display:block";
                    html += '<tr><td width="300px;" style="' + rowreflect + '">';
                    html += '<a download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '">';
                    html += '<i name = "' + a.fname + '" class="' + ficon + '" style = "font-size:14px;color:' + icolor + '" ></i > <span downloadpath1="' + downloadpath + '" style="cursor:pointer" code="' + a.AZureFileId + '" id="idss" value="' + last + '" href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a > <i class="' + syncicon + ' pull-right" title="' + synctitle + '" style="margin-left:10px;"></i> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>';
                    html += '</a>';
                    html += '</td>';
                    html += '<td width="100px;" style="' + rowreflect + '">' + dates1 + '</td>';
                    html += '<td width="100px;" style="' + rowreflect + '">' + a.CreatedBy + '</td>';
                    html += '<td width="100px;" style="' + rowreflect + '">' + a.filetype + '</td>';
                    if (a.fdetails == "null" || a.fdetails == null || a.fdetails == "") {
                        html += '<td width="100px;" style="' + rowreflect + '">&nbsp;</td>';
                    }
                    else {
                        html += '<td width="100px;" style="' + rowreflect + '">' + a.fdetails + '</td>';
                    }
                    html += '</tr>';
                }
            });
            $("#dirbound").html(html);
        },
    });
    $.when(rt1).then(function (data, textStatus, jqXHR) {
    });
}
$(document).on('click', '#dgetdatabypagenum', function () {
    dpageindex = $("#dpagnumvalue").val();
    if (dpageindex != "undefined") {
        if (Math.sign(dpageindex) == 1) {
            var ppageindesx = $("#dsotopage").text();
            if (dpageindex <= parseInt(ppageindesx)) {
                openload();
                LoadDirectoryFiles(dpageindex, 2);
                closeload();
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

/*Directory file paginate*/
$(document).on('click', '#dpaginate', function () {
    openload();
    dpageindex = $(this).attr("index");
    LoadDirectoryFiles(dpageindex, 2);
    setTimeout(function () {
        closeload();
    }, 2000);
});
function loadknowledge(kpageindex) {
    $('#updatePanelKnowledge').html("");
    var $table = '';
    var $header = '';
    var dt = '';
    var q1 = 2;
    $table = $('<table id="example" border="1px solid"  /><tr><th>').addClass('dataTable table table-bordered table-striped');
    $header = $('<thead>').html('');
    $head1 = $('<th class="titles">Title</th><th>Action </th> <th class="createdby">Created by</th>');
    $header.append($head1);
    $header.append('</thead>');
    $table.append($header);
    $table.append('<tbody id="loadactivitydatas">');
    var searchtxt = $('#txtSearch').val();
    var fcode = localStorage.getItem("FirmCode");
    var strval = $("#txtSearch").val();
    var strtype = 2;
    var formdata = new FormData();
    formdata.append("pagenum", EncodeText(kpageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("dirtoken", EncodeText("0"));
    formdata.append("type", EncodeText(strtype));
    formdata.append("strtxt", EncodeText(strval));
    var ajaxTime = new Date().getTime();
    $.ajax({
        async: true,
        url: '/api/WorkFlowNewApi/LoadKnowldgeDetailsbyrowid',
        data: formdata,
        headers: {
            'title': searchtxt
        },
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var totalTime = new Date().getTime() - ajaxTime;
            console.log("details:" + totalTime);
            $("#ktfooter").html("");
            $("#knowcircle").text('');
            if (response.Status == true) {
                if (response.Data.length > 2) {
                    $("#datastatus").html("");
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    $("#datastatus").html("No result found !");
                }
            }
            else {
                //alert("not found");
            }
            if (response.Data == "[]" || !response.Data || response.Data.length === 0) {
                $(".trigger.headtxt[ttllbl='Knowledge Management']").html('<span class="pmicon"><a>+</a></span> Knowledge Management - (0)');
            }
            var it = 2;
            var qty = 0;
            $.each(obj, function (i, val) {
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var totdata = val.totRow;
                    var totpage = Math.ceil(parseInt(totdata) / parseInt(pagesize));

                    // Show/hide next-prev buttons
                    if (kpageindex == totpage) {
                        $('#nextKnowledge').hide();
                    } else {
                        $('#nextKnowledge').css("display", "block");
                    }
                    if (kpageindex == 1) {
                        $('#prevKnowledge').css("display", "none");
                    } else {
                        $('#prevKnowledge').css("display", "block");
                    }

                    var pnext = Math.min(kpageindex + 1, totpage);
                    var pprev = Math.max(kpageindex - 1, 1);

                    $("#pagnumvalue").attr("max", totpage);
                    tatalRecordCount = totpage;
                    var tfot = '';
                    $("#exportrecords").val(val.totRow);
                    $(".trigger.headtxt[ttllbl='Knowledge Management']").html('<span class="pmicon"><a>+</a></span> Knowledge Management - (' + val.totRow + ')');
                    tfot += '<ul>';
                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li>pages ' + kpageindex + '/ ' + totpage + '</li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1" class="footerInput" style="background:#fff !important;"><a class="gobtn" type="button" id="pgetdatabypagenumknowledge" style="margin-left:10px;cursor:pointer">Go</a></li>';

                    if (kpageindex > 1) {
                        tfot += '<li><span><a id="paginateknowledge"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span> ' + firstvalue + '-' + val.rownum + ' <span>';
                    }
                    if (kpageindex < totpage) {
                        tfot += '<a  id="paginateknowledge" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span></li>';
                    }
                    tfot += '</ul>';
                    $("#cknowledgefooter").append(tfot);
                    renderPaginationKnowledge(kpageindex, totpage);
                    closeload();
                }
                qty++;
                dsyncicon = "";
                dsynctitle = "";
                var str = val.tfile;
                var ficon = "";
                var icolor = "";
                if (str != null) {
                    var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                    var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                    var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                    if (ftype == "DOC" || ftype == "DOCX") {
                        ficon = "fa fa-file-word-o";
                        icolor = "#1860a3";
                    }
                    else if (ftype == "PPT" || ftype == "PPTX") {
                        ficon = "fa fa-file-powerpoint-o";
                        icolor = "orange";
                    }
                    else if (ftype == "PDF") {
                        ficon = "fa fa-file-pdf-o";
                        icolor = "red";
                    }
                    else if (ftype == "ZIP") {
                        ficon = "fa fa-file-archive-o";
                        icolor = "orange";
                    }
                    else if (ftype == "PNG" || ftype == "JPG" || ftype == "JPEG") {
                        ficon = "fa fa-file-photo-o";
                        icolor = "#1860a3";
                    }
                    else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS") {
                        ficon = "fa fa-file-excel-o";
                        icolor = "green";
                    }
                    else if (ftype == "TXT") {
                        ficon = "fa fa-file-code-o";
                        icolor = "skyblue";
                    }
                    else {
                        ficon = "glyphicon glyphicon-list-alt";
                        icolor = "black";
                    }
                }
                var ftoken = "/DownloadFile.ashx?module=modulek&title=" + val.tfile + "&ftoken=" + val.tid;
                var $row = $('<tr />');
                if (val.ftype == 0) {
                    $row.append($('<td class="titles"  />').html("<span>" + (val.tname != "" ? '<span name="' + val.tname + '" class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<span style="cursor:pointer" id="transferpage" data-val="' + val.Id + '">' + val.tname + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></span>' : '<span style="visibility: hidden;">.</span>')));
                }
                else {
                    $row.append($('<td class="titles" />').html("<span>" + (val.tname != "" ? '<span name="' + val.tname + '" class="' + ficon + '" aria-hidden="true" style="color:' + icolor + '"> </span>&nbsp;&nbsp;' + val.tname + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>' : '<span style="visibility: hidden;">.</span>')));
                }
                if (val.ftype == "1") {
                    var chtml = "";
                    chtml += "<a download='" + val.tname + "' class=='btn btn-success' href='javascript:void()' title='View Document' data-val='" + val.tid + "'  id='openknowfile' > <span><i class='glyphicon glyphicon-eye-open'></i></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    if (val.export == 1) {
                        if (roleids == "1") {
                            chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'> <span><i class='glyphicon glyphicon-download-alt'></i></a> &nbsp;&nbsp;";
                        }
                        else {
                            if ((val.firmuser).toLowerCase() == userid.toLowerCase()) {
                                chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'> <span><i class='glyphicon glyphicon-download-alt'></i></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            }
                            else {
                                if (val.DownRight == 1) {
                                    chtml += "<a download='" + val.tname + "' title='Download Document' class=='btn btn-success' href='" + ftoken + "'> <span><i class='glyphicon glyphicon-download-alt'></i></a> &nbsp;&nbsp;";
                                }
                            }
                        }
                    }
                    $row.append($('<td class="contact" />').html(chtml));
                }
                else {
                    $row.append($('<td class="contact" />').html("<span class='glyphicon glyphicon-trash' style='cursor:pointer' title='Delete Folder'  onclick=MarkDelete('" + val.tid + "',this.value)  id=" + val.tid + " name=" + val.tid + " ><span>  "));
                }
                $row.append($('<td class="createby" />').html("<span name=" + val.Createby + ">" + (val.Createby == null ? "" : val.Createby)));
                $table.append($row);
            });
            $('#updatePanelKnowledge').html($table);
           // closeload();
        },
        error: function () {
            alert('Error!');
        }
    });
}
$(document).on('click', '#kpaginate', function () {
    kpageindex = $(this).attr("index");
    loadknowledge(kpageindex);
});

/*Load matter list*/
function loadMatterlist(mpageindex) {
    var ihtml3 = '';
    $("#bindcasedata").html("");
    var fcode = localStorage.getItem("FirmCode");
    var formdata = new FormData();
    formdata.append("pagenum", EncodeText(mpageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("search", EncodeText($('#txtSearch').val()));
    formdata.append("odate", EncodeText($('#casefilterdate').val()));
    formdata.append("casename", EncodeText($('#txtSearch').val()));
    formdata.append("clientname", EncodeText($('#casefilterclient').val()));
    formdata.append("court", EncodeText($('#casefiltercourt').val()));
    formdata.append("cstatus", EncodeText($('#casefilterstatus').val()));
    formdata.append("createdby", EncodeText(""));
    formdata.append("users", EncodeText(""));
    formdata.append("companyfilter", EncodeText(""));
    formdata.append("mattertypefilter", EncodeText(""));
    formdata.append("subjecttypefilter", EncodeText(""));
    var ajaxTime = new Date().getTime();
    var caseListApiUrl = '/api/MatterApi/LoadNewCaseList';
    if (typeof isRBICustomization !== 'undefined' && isRBICustomization === "RBICustomtype"
        && (currentUserRoleId === "2" || currentUserRoleId === "3")) {
        caseListApiUrl = '/api/MatterApi/LoadNewCaseList_RBIAll';
    }
    var ld12 = $.ajax({
        async: true,
        url: caseListApiUrl,
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var totalTime = new Date().getTime() - ajaxTime;
            console.log("loadcontact:" + totalTime)
            $("#casetfooter").html("");
            $("#tokens").html("");
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                var obj = JSON.parse(response.Data);
                var length = obj.length;
            }
            else {
                //alert("not found");
            }
            $("#mattercircle").text('');
            if (response.Data.length > 2 || response.Data != "[]") {
                $("#noresultdiv").html("");
            }
            else {
                $("#noresultdiv").html("No result found !");
            }
            if (response.Data == "[]" || !response.Data || response.Data.length === 0) {
                $(".trigger.headtxt[ttllbl='Matters']").html('<span class="pmicon"><a>+</a></span> Matters - (0)');
            }
            var qty = 0;
            var it = 2;
            var firstvalue = 0;
            $.each(obj, function (i, val) {
                if (i === 0) {
                    firstvalue = val.rownum;
                }
                if (i === (length - 1)) {
                    var totdata = val.totRow;
                    var totpage = Math.ceil(parseInt(totdata) / parseInt(pagesize));

                    // Show/hide next-prev buttons
                    if (mpageindex == totpage) {
                        $('#nextMatter').hide();
                    } else {
                        $('#nextMatter').css("display", "block");
                    }
                    if (mpageindex == 1) {
                        $('#prevMatter').css("display", "none");
                    } else {
                        $('#prevMatter').css("display", "block");
                    }

                    var pnext = Math.min(mpageindex + 1, totpage);
                    var pprev = Math.max(mpageindex - 1, 1);

                    $("#pagnumvalue").attr("max", totpage);
                    tatalRecordCount = totpage;
                    var tfot = '';
                    $("#exportrecords").val(val.totRow);
                    $(".trigger.headtxt[ttllbl='Matters']").html('<span class="pmicon"><a>+</a></span> Matters - (' + val.totRow + ')');
                    tfot += '<ul>';
                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li>pages ' + mpageindex + '/ ' + totpage + '</li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1" class="footerInput" style="background:#fff !important;"><a class="gobtn" type="button" id="pgetdatabypagenummatter" style="margin-left:10px;cursor:pointer">Go</a></li>';

                    if (mpageindex > 1) {
                        tfot += '<li><span><a id="paginatematter"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span> ' + firstvalue + '-' + val.rownum + ' <span>';
                    }
                    if (mpageindex < totpage) {
                        tfot += '<a  id="paginatematter" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span></li>';
                    }
                    tfot += '</ul>';
                    $("#cmatterfooter").append(tfot);
                    renderPaginationMatter(setPageNo, totpage);
                    closeload();
                }
                qty = qty + 1;
                $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                it = it + 1;
                if (val.UserCaseid != null) {
                    btnclass = " details";
                    usercaseid = "";
                    fileiconcase = "glyphicon glyphicon-book";
                }
                else {
                    btnclass = "";
                    usercaseid = "";
                    fileiconcase = "";
                }
                if (val.IsDelete == "1") {
                    deleterqst = "trcolor";
                }
                else {
                    deleterqst = "";
                }
                dsyncicon = "";
                dsynctitle = "";
                ihtml3 += '<tr class="' + deleterqst + '">';
                var closedate = val.cdate;
                if (closedate == "1900-01-01T00:00:00") {
                    closedate = null;
                }
                ihtml3 += '<td class="casestartdate"><span name="' + val.odate + '">' + (val.odate != null ? formatDatetoIST(val.odate) : "<span style='visibility: hidden;'>&nbsp;</span>") + '</td>';
                ihtml3 += '<td class="casestartdate"><a name="' + val.mname + '" id="transferpage" href="javascript:void()" sno="' + val.Id + '"><span style="font-size:12px;">' + (val.mname != null ? val.mname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td>';
                var ClientName = "";
                if (val.ClientName == "null") {
                    ClientName = "";
                }
                else {
                    ClientName = val.ClientName;
                }
                if (val.IsCompanyAdmin == "1") {
                    ihtml3 += '<td class="casestartdate"><span name="' + val.CompanyName + '" id="transferpagetocase" href="javascript:void()" data-id="' + val.CompanyID + '" style=cursor:pointer;color:#069;>' + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>') + '</td>';
                }
                else {
                    ihtml3 += '<td class="casestartdate"><span name="' + ClientName + '" id="transferpagetocase" href="javascript:void()" data-id="' + val.matterclientid + '" style=cursor:pointer;color:#069;>' + (ClientName != null ? ClientName : '<span style="">&nbsp;</span>') + '</td>';
                }
                ihtml3 += '<td style=""><span>' + (val.MatterType != null ? val.MatterType : '<span style="">&nbsp;</span>') + '</span></td>'
                if (val.CompanyName == "null" || val.CompanyName == null || val.CompanyName == "") {
                    ihtml3 += '<td style=""><span>&nbsp;</span></td>'
                }
                else {
                    ihtml3 += '<td style=""><span>' + val.CompanyName + '</span></td>'
                }
                ihtml3 += '<td style=""><span>' + val.assignuserby + '</span></td>'
                ihtml3 += '<td style=""><span>' + val.assignuserto + '</span></td>'
                ihtml3 += '<td style=""><span>' + val.PrimaryContactName + '</span></td>'
            });
            $("#bindcasedata").html("");
            $("#bindcasedata").html(ihtml3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
/*Get matter name by page number*/
$(document).on('click', '#matterpgetdatabypagenum', function () {
    mpageindex = $("#matterpagnumvalue").val();
    if (mpageindex != "undefined") {
        if (Math.sign(mpageindex) == 1) {
            var ppageindesx = $("#matterpsotopage").text();
            if (mpageindex <= parseInt(ppageindesx)) {
                loadMatterlist(mpageindex);
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
$(document).on('click', '#matterppaginate', function () {
    mpageindex = $(this).attr("index");
    loadMatterlist(mpageindex);
});
$(document).on('click', '#comgetdatabypagenum', function () {
    spageindex = $("#compagnumvalue").val();
    if (spageindex != "undefined" || spageindex != "") {
        if (Math.sign(spageindex) == 1) {
            var ppageindesx = $("#comsotopage").text();
            if (spageindex <= parseInt(ppageindesx)) {
                loadMessaging(spageindex);
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
//$(document).on('click', '#chatparecgetpagnumvalue', function () {
//    chpageindex = $("#chatpagnumvalue").val();
//    if (chpageindex != "undefined" || chpageindex != "") {
//        if (Math.sign(chpageindex) == 1) {
//            var ppageindesx = $("#chatparesotopage").text();
//            if (chpageindex <= parseInt(ppageindesx)) {
//                loadChatMessaging(chpageindex);
//            }
//            else {
//                alert("Please enter a valid page number.");
//                closeload();
//            }
//        }
//        else {
//            alert("Please enter a valid page number.");
//        }
//    }
//});
$(document).on('click', '#compaginate', function () {
    spageindex = $(this).attr("index");
    loadMessaging(spageindex);
});

/*Load messaging*/
function loadMessaging(spageindex) {
    $("#updatePanel").html("");
    $("#accordion").html("");
    //openload();
    var fcode = localStorage.getItem("FirmCode");
    var formdata = new FormData();
    formdata.append("pagenum", EncodeText(spageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("search", EncodeText($('#txtSearch').val().replace(/"/g, "").replace(/'/g, "")));
    openload();
    $.ajax({
        async: true,
        url: '/api/GlobalSearchApi/LoadReceiveMessagebyrowid',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            $("#stfooter").html("");
            if (response.Status == true && response.Data != "") {
                var obj = JSON.parse(response.Data);
                var length = obj.length;
            }
            else {
                // alert("not found");
            }
            $("#comcircle").text('');
            var dsyncicon = "";
            var dsynctitle = "";
            var it = 2;
            var filename = "";
            var $row1 = "";
            var $row = "";
            var totalchatcount = 0;
            var allcount = 0;
            if (response.Data != "[]") {
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = spageindex;
                        var pprev = spageindex;
                        var pageno = spageindex;
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (val.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                            totalcomcount = val.totRow;
                        }
                        var comfot = '';
                        comfot += '<ul>'
                        comfot += '<li>results <span>' + val.totRow + '</span>  <span id="comsotopage" style="display:none">' + totpage + '</span></li>'
                        comfot += '<li><span>|</span></li>'
                        comfot += '<li>pages ' + spageindex + '/ ' + parseInt(totpage) + '</li>'
                        comfot += '<li><span>|</span></li>'
                        comfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="comgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            comfot += '<li><span><a id="compaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + ifirstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            comfot += '<li><span><a id="compaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + ifirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            comfot += '<a  id="compaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        $("#stfooter").html("");
                        $("#stfooter").html(comfot);
                    }
                    mids = val.mid;
                    it = it + 1;
                    if (val.mfile != null) {
                        btnclass = "btn btn-success details";
                        usercaseid = "View";
                    }
                    else {
                        btnclass = "";
                        usercaseid = "";
                    }
                    if (val.mmatter != null) {
                        mattername = val.mattername;
                    }
                    else {
                        mattername = "";
                    }
                    if (val.mfile == null || val.mfile == "") {
                        mfile = "#"
                        paperclip = "";
                        fileview = "display:none";
                    }
                    else {
                        mfile = val.mfile;
                        paperclip = "<i class='fa fa-paperclip'></i>";
                        fileview = "display:unset";
                    }
                    if (String(val.mbody).search("mailbox-attachment-name") == "-1" && (val.mfile == null || val.mfile == "")) {
                        paperclip = "";
                    }
                    else {
                        paperclip = "<i class='fa fa-paperclip'></i>";
                    }
                    if (val.mbody == null) {
                        Mbody = "";
                    }
                    else {
                        Mbody = val.mbody;
                    }
                    var deletebtn = "";
                    if (String(roleids) == "1") {
                        deletebtn = '<button type ="button" style="margin-left:5px;" class="sbtbtn"  title = "Delete" idval = "' + val.mid + '" id = "removemessage" > <i class="glyphicon glyphicon-trash"></i>&nbsp;</button >';
                    }
                    else {
                        if (String(isDelete) == "1") {
                            deletebtn = '<button type ="button"  style="margin-left:5px;" class="sbtbtn"  title = "Delete" idval = "' + val.mid + '" id = "removemessage" > <i class="glyphicon glyphicon-trash"></i>&nbsp;</button >';
                        }
                    }
                    if (val.mbody.length > 200) {
                        Mbody = val.mbody;
                    }
                    $row += '<tr>';
                    if (val.icomtype == 1) {
                        if (val.CaseId != "") {
                            $row += '<td class=""><a name="' + Mbody + '" id="transferpagecom" href="javascript:void()" sno="' + val.CaseId + '" flag="' + val.icomtype + '"><span style="font-size:12px;">' + (Mbody != null ? Mbody : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td>';
                        }
                        else {
                            $row += '<td>' + Mbody + '</td>';
                        }
                    }
                    else if (val.icomtype == 2) {
                        $row += '<td class=""><a name="' + Mbody + '" id="transferpagecom" href="javascript:void()" sno="' + val.CaseId + '" flag="' + val.icomtype + '"><span style="font-size:12px;">' + (Mbody != null ? Mbody : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td>';
                    }
                    $row += '<td>' + val.assignuserto + '</td>';
                    $row += '<td>' + formatDatetoIST(val.CreateDate) + '</td></tr>';
                });
                $("#updatePanel").html($row);
              //  closeload();
            }
            else {
                $row = '<tr><td align="center" colspan=11>No result found !</td></tr>'
                $("#updatePanel").html($row);
               // closeload();
            }
        },
        error: function () {
            alert('Error!');
            closeload();
        }
    });
}
//$(document).on('click', '#chatparepaginate', function () {
//    chpageindex = $(this).attr("index");
//    loadChatMessaging(chpageindex);
//});

/*Load chat messaging*/
//function loadChatMessaging(chpageindex) {
//    var fcode = localStorage.getItem("FirmCode");
//    var formdata = new FormData();
//    formdata.append("pagenum", EncodeText(chpageindex));
//    formdata.append("pagesize", EncodeText(chpagesize));
//    formdata.append("search", EncodeText($('#txtSearch').val().replace(/"/g, "").replace(/'/g, "")));
//    openload();
//    $.ajax({
//        async: true,
//        url: '/api/GlobalSearchApi/LoadChatMessagebyrowid',
//        data: formdata,
//        processData: false,
//        contentType: false,
//        type: 'POST',
//        success: function (response) {
//            $("#chatstfooter").html("");
//            $("#chatdoclist").html('');
//            $("#comcircle").text('');
//            var totalchatcount = 0;
//            var allcount = 0;
//            //bind chat list
//            if (response.Data != "") {
//                var html3 = ''; var tfot = ''; var tfot1 = '';
//                var length = response.Data.length;
//                $.each(response.Data, function (i, a) {
//                    if (i === 0) {
//                        firstvalue = a.rownum;
//                    }
//                    if (i === (length - 1)) {
//                        var pnext = chpageindex;
//                        var pprev = chpageindex;
//                        var pageno = chpageindex;
//                        var totdata = a.totRow;
//                        var totpage = 0;
//                        if (a.totRow > 0) {
//                            pnext = parseInt(pnext) + 1;
//                            if (pnext == 0) pnext = 1;
//                            pprev = parseInt(pageno) - 1;
//                            if (pprev == 0) pprev = 1;
//                            totpage = parseInt(totdata) / parseInt(chpagesize);
//                            if (parseInt(totdata) % parseInt(chpagesize) != 0) {
//                                totpage = parseInt(totpage) + 1;
//                            }
//                            $("#chatpagnumvalue").attr("max", totpage);
//                            totalchatcount = a.totRow;
//                        }
//                        tfot1 += '<ul>'
//                        tfot1 += '<li>results <span>' + totdata + '</span>  <span id="chatparesotopage" style="display:none">' + totpage + '</span></li>'
//                        tfot1 += '<li><span>|</span></li>'
//                        tfot1 += '<li>pages ' + chpageindex + '/ ' + parseInt(totpage) + '</li>'
//                        tfot1 += '<li><span>|</span></li>'
//                        tfot1 += '<li ><input type="number" id="chatpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="chatparecgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
//                        tfot1 += '<li>'
//                        if (a.totRow <= length) { }
//                        else if (pageno == 1) { }
//                        else if (pageno == totpage) {
//                            tfot1 += '<li><span><a id="chatparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
//                        }
//                        else {
//                            tfot1 += '<li><span><a id="chatparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
//                        }
//                        if (pageno < totpage) {
//                            tfot1 += '<a id="chatparepaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
//                        }
//                        $("#chatstfooter").html('');
//                        $("#chatstfooter").append(tfot1);
//                    }
//                    var Date = a.crdate;
//                    var vChatName = a.vChatName;
//                    var vChatText = a.vChatText;
//                    var UserName = a.UserName;
//                    html3 += '<tr>'
//                    html3 += '<td class="eDate">'
//                    html3 += '<span name="Date" id="clname" >' + Date + '</span></i>'
//                    html3 += '</td>'
//                    html3 += '<td class="vChatName">'
//                    html3 += '<span id="vChatName" >' + vChatName + '</span>'
//                    html3 += '</td>'
//                    html3 += '<td class="vChatText">'
//                    html3 += '<span id="vChatText"><a href="#" id="view" data-val="' + a.iid + '">View</a></span>'
//                    html3 += '</td>'
//                    html3 += '</tr>'
//                });
//                $("#chatdoclist").html(html3);
//                closeload();
//            }
//            else {
//                html3 = '<tr><td align="center" colspan=11>No result found !</td></tr>'
//                $("#chatdoclist").html(html3);
//                closeload();
//            }
//            //showing total count value
//            allcount = totalchatcount + totalcomcount;
//            if (allcount > 0) {
//                $("#comcircle").text('');
//                $("#comcircle").text('(' + allcount + ')');
//            } else {
//            }
//        },
//        error: function () {
//            alert('Error!');
//            closeload();
//        }
//    });
//}

/*Chat list*/
function chatlist() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/chatapi/ChatSaveList",
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1 != "") {
                $("#ecfootercompare").empty();
                var length = response1.length;
                $.each(response1.Data, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = ecpageindex;
                        var pprev = ecpageindex;
                        var pageno = ecpageindex;
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (a.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(ecpagesize);
                            if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#comparecpagnumvalue").attr("max", totpage);
                        }
                        tfot += '<li>results <span>' + totdata + '</span>  <span id="comparesotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="comparecpagnumvalue" min="1" class="footerInput"><a class="gobtn" type="button" id="comparecgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        tfot += '<li>'
                        if (a.totRow <= length) { }
                        else if (pageno == 1) { }
                        else if (pageno == totpage) {
                            //tfot += '<span> <a id="ecpaginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>'
                            tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        else {
                            //tfot += '<span> <a id="ecpaginate" title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>'
                            tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        }
                        // tfot += ' ' + ecpageindex + ' '
                        if (pageno < totpage) {
                            tfot += '<a id="comparepaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                        }
                        // tfot += '</li>'
                        $("#ecfootercompare").append(tfot);
                    }
                    var Date = a.crdate;
                    var vChatName = a.vChatName;
                    var vChatText = a.vChatText;
                    var UserName = a.UserName;
                    html3 += '<tr>'
                    html3 += '<td class="eDate">'
                    html3 += '<span name="Date" id="clname" >' + Date + '</span></i>'
                    html3 += '</td>'
                    html3 += '<td class="vChatName">'
                    html3 += '<span id="vChatName" >' + vChatName + '</span>'
                    html3 += '</td>'
                    html3 += '<td class="vChatText">'
                    html3 += '<span id="vChatText"><a href="#" id="view" data-val="' + a.iid + '">View</a></span>'
                    html3 += '</td>'
                    html3 += '</tr>'
                });
                $("#doclist").html(html3);
                closeload();
            }
            else {
                html3 = '<tr><td colspan=11>No result found !</td></tr>'
                $("#doclist").html(html3);
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
$(document).on('click', '#view', function () {
    var token = $(this).attr("data-val");
    var formData = new FormData();
    formData.append("id", token);
    $("#frmcompare").html('');
    var ld12 = $.ajax({
        async: true,
        url: '/api/ChatApi/ChatView',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {
            var html3 = '';
            $.each(response.Data, function (i, val) {
                html3 += val.vChatText;
            });
            $("#frmcompare").append(html3);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    $.when(ld12).then(function (data, textStatus, jqXHR) {
        //closeload();
    });
    $("#comparemodal").show();
});
$(document).on('click', '#mclose', function () {
    $("#comparemodal").hide();
});
$(document).on('click', '#taskgetdatabypagenum', function () {
    taskpageindex = $("#taskpagnumvalue").val();
    if (taskpageindex != "undefined" || taskpageindex != "") {
        if (Math.sign(taskpageindex) == 1) {
            var ppageindesx = $("#tasksotopage").text();
            if (taskpageindex <= parseInt(ppageindesx)) {
                iLoadTaskData(taskpageindex);
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
$(document).on('click', '#taskpaginate', function () {
    /* your code here */
    taskpageindex = $(this).attr("index");
    iLoadTaskData(taskpageindex);
});

/*Load task data*/
function iLoadTaskData(pageindex) {
    $("#itfooter").html("");
    $("#ibindcasetask").html("");
    var ihtml3 = '';
    var formData = new FormData();
    formData.append("pagenum", EncodeText(pageindex));
    formData.append("pagesize", EncodeText(ipagesize));
    formData.append("datefilter", EncodeText(""));
    formData.append("search", EncodeText($("#txtSearch").val()));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/CallApi/PersonalDashboardTaskInboxList_GlobalSearch",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#idataescstatus").html("");
            }
            else {
                $("#idataescstatus").html("No result found !");
                //closeload();
            }
            if (response1.Data == "[]" || !response1.Data || response1.Data.length === 0) {
                $(".trigger.headtxt[ttllbl='Tasks']").html('<span class="pmicon"><a>+</a></span> Tasks - (0)');
            }
            var ilength = response1.Data.length;
            $("#taskcircle").text('');
            $("#ibindcasetask tr").remove();
            $.each(response1.Data, function (i, a) {
                if (i === 0) {
                    ifirstvalue = a.rownum;
                }
                if (i === (length - 1)) {
                    var totdata = a.totRow;
                    var totpage = Math.ceil(parseInt(totdata) / parseInt(pagesize));

                    // Show/hide next-prev buttons
                    if (pageindex == totpage) {
                        $('#nextTask').hide();
                    } else {
                        $('#nextTask').css("display", "block");
                    }
                    if (pageindex == 1) {
                        $('#prevTask').css("display", "none");
                    } else {
                        $('#prevTask').css("display", "block");
                    }

                    var pnext = Math.min(pageindex + 1, totpage);
                    var pprev = Math.max(pageindex - 1, 1);

                    $("#pagnumvalue").attr("max", totpage);
                    tatalRecordCount = totpage;
                    var tfot = '';
                    $("#exportrecords").val(a.totRow);
                    $(".trigger.headtxt[ttllbl='Tasks']").html('<span class="pmicon"><a>+</a></span> Tasks - (' + a.totRow + ')');
                    tfot += '<ul>';
                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li>pages ' + pageindex + '/ ' + totpage + '</li>';
                    tfot += '<li><span>|</span></li>';
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1" class="footerInput" style="background:#fff !important;"><a class="gobtn" type="button" id="pgetdatabypagenumntask" style="margin-left:10px;cursor:pointer">Go</a></li>';

                    if (pageindex > 1) {
                        tfot += '<li><span><a id="ppaginatetask"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span> ' + firstvalue + '-' + a.rownum + ' <span>';
                    }
                    if (pageindex < totpage) {
                        tfot += '<a  id="ppaginatetask" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span></li>';
                    }
                    tfot += '</ul>';
                    $("#ctaskfooter").append(tfot);
                    renderPaginationTask(pageindex, totpage);
                    closeload();
                }
                var iAssignBycolor = "";
                var iAssignTocolor = "";
                var iClientName = a.ClientName;
                if (iClientName == "") {
                    iClientName = "";
                }
                var iCaseName = a.CaseName;
                var iAssignBy = a.AssignBy;
                var iAssignTo = a.AssignTo;
                var iAssignBy = a.AssignBy;
                if (iAssignTo == "ME") {
                    var iAssignTocolor = "#069";
                }
                else {
                    var iAssignTocolor = "maroon";
                }
                var iAssignBy = a.AssignBy;
                var sTatus = a.Status;
                if (iAssignBy == "ME") {
                    iAssignBycolor = "#069";
                }
                else {
                    var iAssignBycolor = "maroon";
                }
                var istr = a.CreateDate;
                var itemptype = istr.replace(/[^a-zA-Z0-9]/g, "");
                var duerowcss = "";
                if ((a.TaskDueDate.substring(0, 10)) < (new Date().toISOString().substring(0, 10))) {
                    duerowcss = "";
                }
                ihtml3 += '<tr >'
                ihtml3 += '<td style="' + duerowcss + '"><span>' + formatDatetoIST(a.CreateDate) + '</span></td>'
                ihtml3 += '<td><span id="Taskid" style="' + duerowcss + ';cursor: pointer; color: #069" sno="' + a.Tid + '" data-id="' + a.TaskDueDate.substring(0, 10) + '">' + a.TaskName + '</span></td>'
                ihtml3 += '<td style="' + duerowcss + '">'
                ihtml3 += '<div style="float:left">'
                if (a.ClientId == "null" || a.ClientId == null || a.ClientId == "") {
                    ihtml3 += '<span id="clname">' + iClientName + '</span><br>'
                }
                else {
                    ihtml3 += '<span id="clname" class="LoginId" style="cursor: pointer; color: #069" data-id="' + a.ClientId + '">' + iClientName + '</span><br>'
                }
                ihtml3 += '</div>'
                ihtml3 += '</td>'
                ihtml3 += '<td><span id="caseid" style="' + duerowcss + ';cursor: pointer; color: #069" sno="' + a.CaseId + '">' + iCaseName + '</span></td>'
                ihtml3 += '<td style="' + duerowcss + '"><span>' + iAssignBy + '</span></td>'
                ihtml3 += '<td style="' + duerowcss + '"><span>' + iAssignTo + '</span></td>'
                ihtml3 += '<td style="' + duerowcss + '"><span>' + formatDatetoIST(a.TaskDueDate) + '</span></td>'
                ihtml3 += '<td style="' + duerowcss + '"><span>' + sTatus + '</span></td>'
                ihtml3 += '</td>'
                ihtml3 += '</tr>'
            });
            $("#ibindcasetask").html("");
            $("#ibindcasetask").append(ihtml3);
            $("#refinbox").removeClass("fa-spin");
            $('#taskPagination').show();
            var ishowChar = 150;
            var iellipsestext = "...";
            var imoretext = "more";
            var ilesstext = "less";
            $('.imore').each(function () {
                var icontent = $(this).html();
                if (icontent.length > ishowChar) {
                    var ic = icontent.substr(0, ishowChar);
                    var ih = icontent.substr(ishowChar - 1, icontent.length - ishowChar);
                    var ihtml = ic + '<span class="imoreellipses">' + iellipsestext + '&nbsp;</span><span class="imorecontent"><span>' + ih + '</span>&nbsp;&nbsp;<a href="javascript:void()" class="imorelink">' + imoretext + '</a></span>';
                    $(this).html(ihtml);
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

/*Pagination Start*/
var isRenderPageKnowledge = false;
var totalPageRecKnowledge = "";
function renderPaginationKnowledge(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRecKnowledge = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn-Knowledge ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn-Knowledge ${i === parseInt(pageindex) ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn-Knowledge ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbersKnowledge").html(paginationHtml);
    $("#prevKnowledge").toggleClass("disabled", pageindex === 1);
    $("#nextKnowledge").toggleClass("disabled", pageindex === totdata);
    isRenderPageKnowledge = true;
}


$(document).on("click", ".page-btn-Knowledge", function (event) {
    event.preventDefault();
    let page = $(this).data("page");
    setPageNo = page;
    //if (page) changePage(page);
    loadflag = true;
    isRenderPageKnowledge = true;
    $("#txtgopageKnowledge").val("");
    loadknowledge(setPageNo, "", "");
    $(".page-btn-Knowledge ").removeClass("active");
    $(".page-btn-Knowledge[data-page='" + setPageNo + "']").addClass("active");
});
// Previous Knowledge page
$(document).on("click", "#prevKnowledge", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPageKnowledge = true;
    $("#txtgopageKnowledge").val("");
    loadknowledge(setPageNo, "", "");
    $(".page-btn-Knowledge").removeClass("active");
    $(".page-btn-Knowledge[data-page='" + setPageNo + "']").addClass("active");
});

// Next Knowledge page
$(document).on("click", "#nextKnowledge", function () {
    if (setPageNo >= 1) {  
        setPageNo = setPageNo + 1;
    }
    loadflag = true;
    isRenderPageKnowledge = true;
    $("#txtgopageKnowledge").val("");
    loadknowledge(setPageNo, "", "");
    $(".page-btn-Knowledge").removeClass("active");
    $(".page-btn-Knowledge[data-page='" + setPageNo + "']").addClass("active");
});

// Go to specific Knowledge page
$(document).on("click", "#divGoKnowledge", function () {
    let goToPage = parseInt($("#txtgopageKnowledge").val());

    if (isNaN(goToPage) || goToPage < 1 || goToPage > tatalRecordCount) {
        alert("Please enter a valid page number.");
        return false;
    }

    setPageNo = goToPage;
    loadflag = true;
    isRenderPageKnowledge = true;
    loadknowledge(setPageNo, "", "");
    $(".page-btn-Knowledge").removeClass("active");
    $(".page-btn-Knowledge[data-page='" + setPageNo + "']").addClass("active");
});


/*Pagination End*/

/*Pagination Start*/
var isRenderPageDocs = false;
var totalPageRecDocs = "";
function renderPaginationDocs(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRecDocs = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn-Docs ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn-Docs ${i === parseInt(pageindex) ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn-Docs ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbersDocs").html(paginationHtml);
    $("#prevDocs").toggleClass("disabled", pageindex === 1);
    $("#nextDocs").toggleClass("disabled", pageindex === totdata);
    isRenderPageDocs = true;
}


$(document).on("click", ".page-btn-Docs", function (event) {
    event.preventDefault();
    let page = $(this).data("page");
    setPageNo = page;
    //if (page) changePage(page);
    loadflag = true;
    isRenderPageDocs = true;
    $("#txtgopageDocs").val("");
    LoadDirectoryFiles(setPageNo, "", "");
    $(".page-btn-Docs ").removeClass("active");
    $(".page-btn-Docs[data-page='" + setPageNo + "']").addClass("active");
});

// Previous Docs page
$(document).on("click", "#prevDocs", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPageDocs = true;
    $("#txtgopageDocs").val("");
    LoadDirectoryFiles(setPageNo, "", "");
    $(".page-btn-Docs").removeClass("active");
    $(".page-btn-Docs[data-page='" + setPageNo + "']").addClass("active");
});

// Next Docs page
$(document).on("click", "#nextDocs", function () {
    if (setPageNo >= 1) { 
        setPageNo = setPageNo + 1;
    }
    loadflag = true;
    isRenderPageDocs = true;
    $("#txtgopageDocs").val("");
    LoadDirectoryFiles(setPageNo, "", "");
    $(".page-btn-Docs").removeClass("active");
    $(".page-btn-Docs[data-page='" + setPageNo + "']").addClass("active");
});

// Go to specific Docs page
$(document).on("click", "#divGoDocs", function () {
    let goToPage = parseInt($("#txtgopageDocs").val());

    if (isNaN(goToPage) || goToPage < 1 || goToPage > tatalRecordCount) {
        alert("Please enter a valid page number.");
        return false;
    }

    setPageNo = goToPage;
    loadflag = true;
    isRenderPageDocs = true;
    LoadDirectoryFiles(setPageNo, "", "");
    $(".page-btn-Docs").removeClass("active");
    $(".page-btn-Docs[data-page='" + setPageNo + "']").addClass("active");
});


/*Pagination End*/

/*Pagination Start*/
var isRenderPageMatter = false;
var totalPageRecMatter = "";
function renderPaginationMatter(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRecMatter = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn-Matter ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn-Matter ${i === parseInt(pageindex) ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn-Matter ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbersMatter").html(paginationHtml);
    $("#prevMatter").toggleClass("disabled", pageindex === 1);
    $("#nextMatter").toggleClass("disabled", pageindex === totdata);
    isRenderPageMatter = true;
}

$(document).on("click", ".page-btn-Matter", function (event) {
    event.preventDefault();
    let page = $(this).data("page");
    setPageNo = page;
    //if (page) changePage(page);
    loadflag = true;
    isRenderPageMatter = true;
    $("#txtgopageMatter").val("");
    loadMatterlist(setPageNo, "", "");
    $(".page-btn-Matter ").removeClass("active");
    $(".page-btn-Matter[data-page='" + setPageNo + "']").addClass("active");
});

// Previous button for Matter
$(document).on("click", "#prevMatter", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPageMatter = true;
    $("#txtgopageMatter").val("");
    loadMatterlist(setPageNo, "", "");
    $(".page-btn-Matter").removeClass("active");
    $(".page-btn-Matter[data-page='" + setPageNo + "']").addClass("active");
});

// Next button for Matter
$(document).on("click", "#nextMatter", function () {
    if (setPageNo >= 1) {  
        setPageNo = setPageNo + 1;
    }
    loadflag = true;
    isRenderPageMatter = true;
    $("#txtgopageMatter").val("");
    loadMatterlist(setPageNo, "", "");
    $(".page-btn-Matter").removeClass("active");
    $(".page-btn-Matter[data-page='" + setPageNo + "']").addClass("active");
});

// Go button for Matter
$(document).on("click", "#divGoMatter", function () {
    let goToPage = parseInt($("#txtgopageMatter").val());

    if (isNaN(goToPage) || goToPage < 1 || goToPage > tatalRecordCount) {
        alert("Please enter a valid page number.");
        return false;
    }

    setPageNo = goToPage;
    loadflag = true;
    isRenderPageMatter = true;
    loadMatterlist(setPageNo, "", "");
    $(".page-btn-Matter").removeClass("active");
    $(".page-btn-Matter[data-page='" + setPageNo + "']").addClass("active");
});

/*Pagination End*/

/*Pagination Start*/
var isRenderPageTask = false;
var totalPageRecTask = "";
function renderPaginationTask(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRecTask = totdata;
    let paginationHtml = '';
    let maxVisible = 4; // Visible page numbers before ellipsis
    if (totdata <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn-Task ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        if (pageindex <= maxVisible) {
            for (let i = 1; i <= maxVisible; i++) {
                paginationHtml += `<button class="page-btn-Task ${i === parseInt(pageindex) ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<span>.......</span>`;
            for (let j = totPages - 3; j <= totPages; j++) {
                paginationHtml += `<button class="page-btn-Task ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
            }
        }
    }
    $("#pageNumbersTask").html(paginationHtml);
    $("#prevTask").toggleClass("disabled", pageindex === 1);
    $("#nextTask").toggleClass("disabled", pageindex === totdata);
    isRenderPageTask = true;
}


$(document).on("click", ".page-btn-Task", function (event) {
    event.preventDefault();
    let page = $(this).data("page");
    setPageNo = page;
    //if (page) changePage(page);
    loadflag = true;
    isRenderPageTask = true;
    $("#txtgopageTask").val("");
    iLoadTaskData(setPageNo, "", "");
    $(".page-btn-Task ").removeClass("active");
    $(".page-btn-Task[data-page='" + setPageNo + "']").addClass("active");
});


$(document).on("click", "#prevTask", function () {
    if (setPageNo > 1) {
        setPageNo = setPageNo - 1;
    }
    loadflag = true;
    isRenderPageTask = true;
    $("#txtgopageTask").val("");
    //renderPagination(setPageNo, totalPageRec)
    iLoadTaskData(setPageNo, "", "");
    $(".page-btn-Task ").removeClass("active");
    $(".page-btn-Task[data-page='" + setPageNo + "']").addClass("active");
});

$(document).on("click", "#nextTask", function () {
    if (setPageNo >= 1) {
        setPageNo = setPageNo + 1;
    }
    loadflag = true;
    isRenderPageTask = true;
    $("#txtgopageTask").val("");
    iLoadTaskData(setPageNo, "", "");
    $(".page-btn-Task").removeClass("active");
    $(".page-btn-Task[data-page='" + setPageNo + "']").addClass("active");
});


$(document).on("click", "#divGoTask", function () {
    let goToPage = parseInt($("#txtgopageTask").val());

    if (isNaN(goToPage)) {
        alert("Please enter a valid page number.");
        return false;
    }

    if (goToPage > tatalRecordCount || goToPage < 1) {
        alert("Please enter a valid page number.");
        return false;
    }

    setPageNo = goToPage;
    loadflag = true;
    isRenderPageTask = true;

    iLoadTaskData(setPageNo, "", "");
    $(".page-btn-Task").removeClass("active");
    $(".page-btn-Task[data-page='" + setPageNo + "']").addClass("active");
});

/*Pagination End*/