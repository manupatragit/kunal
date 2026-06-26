$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(".validpanel").css("display", "none");
    //show bruidcrmbloadcontactpermission
    $(document).on("click", "#bruidcmb", function () {
        var tempbrd = $(this).attr("value");
        var regExpr = /[/]/g;
        var tempbrd1 = tempbrd.replace(regExpr, " > ")
        $("#outputbrdcmb").html(tempbrd1);
    });
    //change type
    $("#contype").change(function () {
        var contypes = $(this).val();
        $('#contact').get(0).selectedIndex = 0;
        // $('#matter').get(0).selectedIndex = 0;
        $('input:checkbox').removeAttr('checked');
        if (contypes == "Contact") {
            $('#contact').css("display", "block");
            //  $('#matter').css("display", "none");
            $('#contact').get(0).selectedIndex = 0;
            // $('#matter').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
        else {
            $('#contact').css("display", "none");
            //  $('#matter').css("display", "none");
            $('#contact').get(0).selectedIndex = 0;
            // $('#matter').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
    });
    //get permission on contact
    $("#contact").change(function () {
        var cvalue = $(this).val();
        if (cvalue != "") {
            //alert(cvalue);
            var formData = new FormData();
            formData.append("cid", cvalue);
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/CallApi/SingleUserPermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    //  alert(datas1);
                    $.each(response.Data, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.apermission;
                        // alert(tper);
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#checkboxes" + tfid + " input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    // alert(chkbx);
                                    if (strarray[i] == chkbx) {
                                        $("#checkboxes" + tfid + " input[name='options[]']" + "#chkd" + chkbx).prop('checked', true);
                                    }
                                    else {
                                        //alert("no");
                                    }
                                });
                                //alert(tper);
                            }
                        }
                    });
                },
                failure: function (data) {
                   // alert(data.responseText);
                },
                error: function (data) {
                    //alert(data.responseText);
                }
            });
        }
    });
    
    // Remove Files
    $(document).on("click", "#removedirfile", function () {
        var ffid = $(this).attr("value");
        var ffdir = $(this).attr("directnamefull");
        var result = confirm("Are you sure to remove this File?");
        if (result) {
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/CallApi/RemoveASDirectoryFile",
                headers: {
                    'ffid': ffid,
                    'ffdir': ffdir
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        LoadDirectoryFiles();
                        new PNotify({
                            title: 'Success!',
                            text: ' File Remove Successfully',
                            type: 'success',
                            delay: 3000
                        });
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: ' Oops ! File can not be deleted.',
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
    // assign directory with permission
    $(document).on("click", "#assign", function () {
        var fid = $(this).attr("value");
        var user = $("#contact").val();
        var matter = $("#matter").val();
        var chkArray3 = [];
        var selected = $("#checkboxes" + fid + " input[name='options[]']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var result = confirm("Are you sure to   Assign permission for this Directory?");
        if (result) {
            var formData = new FormData();
            formData.append("did", fid);
            formData.append("permissiontype", selected3);
            formData.append("user", user);
            formData.append("matter", matter);
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/CallApi/AssignPermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    // alert(data.Data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        $("#ptypes").html('');
                        LoadDirectoryFiles();
                        new PNotify({
                            title: 'Success!',
                            text: ' Directory  Permission Assign  Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#contact').get(0).selectedIndex = 0;
                        $('#matter').get(0).selectedIndex = 0;
                    }
                    else if (data.Data == "nouser") {
                        new PNotify({
                            title: 'info!',
                            text: ' Please Select User Or Matter to assign Directory Permission !',
                            type: 'error',
                            delay: 4000
                        });
                    }
                    else if (data.Data == "nopermission") {
                        new PNotify({
                            title: 'info!',
                            text: ' Please Select Atleast 1 Permission !',
                            type: 'error',
                            delay: 4000
                        });
                        $('#target' + fid).css("background", "#efbfbf");
                        $('#target' + fid).css("border-radius", "5px");
                        // $('#target' + fid).css("border-width", "1px");
                        setTimeout(function () {
                            $('#target' + fid).css("background", "none");
                            $('#target' + fid).css("border-radius", "none");
                        }, 3000);
                    }
                    else {
                        new PNotify({
                            title: 'info!',
                            text: ' Oops ! Please try After some time.',
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
    // Remove Folders
    $(document).on("click", "#removedir", function () {
        var fid = $(this).attr("values");
        var fdir = $(this).attr("dirname");
        var result = confirm("Are you sure to   Remove this Directory?");
        if (result) {
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/CallApi/RemoveDirectory",
                headers: {
                    'configurationtype': type,
                    'fid': fid,
                    'fdir': fdir
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    //alert(data.Data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        LoadDirectoryFiles();
                        new PNotify({
                            title: 'Success!',
                            text: ' Directory Remove Successfully',
                            type: 'success',
                            delay: 3000
                        });
                    }
                    else if (data.Data == false) {
                        new PNotify({
                            title: 'info!',
                            text: ' Directory Can Not be Remove. it have some inside Directory or Files',
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
    //load matter
    loadmatter();
    function loadmatter() {
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/LoadMatterBound",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                }
                else {
                    //alert("not found");
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
    //load contact
    loadcontact();
    // load contact
    function loadcontact() {
        $.ajax({  async: true, 
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
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#contact").append(option);
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
    //create dir
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        dirname = $.trim(dirname);
        dirname = dirname.replace(/[/]+/g, '/')
        var fdirname = dirname.charAt(0);
        var ldirname = dirname.charAt(dirname.length - 1);
        if (fdirname == '/') {
            //alert("hi");
            var dirname = dirname.substr(1);
        }
        if (ldirname == "/") {
            dirname = dirname.slice(0, -1);
        }
        dirname = dirname.replace(/\s/g, '');
        if (dirname == "") {
            $(".validpanel").css("display", "block").html(" Please Enter Directory Name !");
        }
        // var firm = localStorage.getItem("FirmCode");
        formData.append("dname", dirname);
        // formData.append("firm", firm);
        if (dirname != "") {
            $.ajax({  async: true, 
                url: '/api/CallApi/CreatefileDirectory',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#foldercreate")[0].reset();
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        if (datas.length == 58) {
                            $(".validpanel").css("display", "none");
                            LoadDirectory();
                            $("#dirbound").html('');
                            LoadDirectoryFiles();
                            new PNotify({
                                title: 'Success!',
                                text: ' Directory Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                        }
                        else if (datas.length == 61) {
                            $(".validpanel").css("display", "block").html(" Please Enter Directory Name !");
                        }
                        else if (datas.length == 76) {
                            $(".validpanel").css("display", "block").html("Directory Already Exist");
                        }
                    }
                    else {
                        //alert("not found");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
    $("#createfiles").click(function () {
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
        var filedetails = $("#filedetails").val();
        var formData = new FormData();
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                formData.append("FileUpload", file);
            }
            formData.append("selectedpermission", selected3);
            formData.append("dirname", dname);
            formData.append("details", filedetails);
            $.ajax({  async: true, 
                url: '/api/CallApi/Createfile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#fileupload")[0].reset();
                    // alert("hi");
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        $("#dirbound").html('');
                        LoadDirectoryFiles();
                        new PNotify({
                            title: 'Success!',
                            text: ' File Uploaded Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        //alert(datas);
                    }
                    else {
                        //alert("not found");
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
    // Load Permissions
    function permission() {
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/permissionList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var option = '&nbsp;&nbsp;<input type="checkbox" name="options[]" value="' + a.Id + '" />  ' + a.Pname + '';
                    $("#linkdata").append(option);
                });
                $.each(response.Data, function (i, a) {
                    var option = '&nbsp;&nbsp;<b>' + a.Pname + '</b>&nbsp;&nbsp;';
                    $("#ptypes").append(option);
                });
                $.each(response.Data, function (i, a) {
                    var option = '&nbsp;&nbsp;<input type="checkbox" name="options[]" id="chkd' + a.Id + '" value="' + a.Id + '" />  <span style="visibility:hidden">' + a.Pname + '</span>';
                    $(".linkdata1").append(option);
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
    LoadDirectory();
    // Load Directory
    function LoadDirectory() {
        $("#directory").html('');
        $("#filedirectory").html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/DirectoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    //alert(datas);
                }
                else {
                    //alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    // alert(a.Id);
                    var tmpdir = a.fname;
                    var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                    //alert(replacedata);
                    //   var replacedata1 = "WorkSpace/1/15/";
                    var dirname = tmpdir.replace(replacedata, '');
                    // alert(dirname);
                    var option = '<option value="' + a.Id + '" > ' + dirname + '</option>';
                    $("#directory").append(option);
                    var option = '<option value="' + a.Id + '" > ' + dirname + '</option>';
                    $("#filedirectory").append(option);
                });
                //console.log(response);
            },
            failure: function (response) {
                //alert(data.responseText);
            },
            error: function (response) {
                //alert(data.responseText);
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
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex);
    });
   openload();
    LoadDirectoryFiles(pageindex);
    // Load DirectoryFiles
    var fcode = localStorage.getItem("FirmCode");
    //alert("hio");
    //alert(fcode);
    var bsurlfile = window.location.origin + "/" + fcode;
    function LoadDirectoryFiles(pageindex) {
        $("#dirbound").html("");
        var formData = new FormData();
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        //load directory
        var html = '';
        var html1 = '';
        var downloadpath = "";
        var togsum = 0;
        var j1 = $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/ShareFileUserListbyrowid",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
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
                        var permission = String(a.ppermission);
                        var n = permission.indexOf("3");
                        //      alert(permission);
                        if (n != "") {
                            var ncss = "display:unset";
                        }
                        if (n.toString() == "-1") {
                            var ncss = "display:none";
                        }
                        var dates2 = a.date_time;
                        var dates1 = formatDatetoIST(dates2);
                        var ficon = "fa fa-language";
                        var icolor = "black";
                        var str = a.filetype;
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
                        var fids = "";
                        var tempnull = "";
                        if (a.FullDirPath == null) {
                            var tempdownloadpath = "/LawPractice_ds/" + a.firmId + '/' + a.Userid + '/' + a.fname;
                            var xhr = new XMLHttpRequest();
                            xhr.open('HEAD', tempdownloadpath, false);
                            xhr.send();
                            if (xhr.status == "404") {
                                var downloadpath = "/DownloadFile.ashx?fld=w&ftoken=" + a.FileId + "&filepath=" + tempnull + "&filename=" + a.fname;
                                fids = "w";
                            } else {
                                var downloadpath = "/DownloadFile.ashx?fld=m&ftoken=" + a.FileId + "&filepath=" + tempnull + "&filename=" + a.fname; //lawp_ds
                                fids = "m";
                            }
                        }
                        else {
                            var tempdownloadpath = "/LawPractice_ds/" + a.firmId + '/' + a.Userid + '/' + a.FullDirPath + "/" + a.fname;
                            var xhr = new XMLHttpRequest();
                            xhr.open('HEAD', tempdownloadpath, false);
                            xhr.send();
                            if (xhr.status == "404") {
                                var downloadpath = "/DownloadFile.ashx?fld=w&ftoken=" + a.FileId + "&filepath=" + a.FullDirPath + "&filename=" + a.fname;
                                fids = "w";
                            } else {
                                var downloadpath = "/DownloadFile.ashx?fld=m&ftoken=" + a.FileId + "&filepath=" + a.FullDirPath + "&filename=" + a.fname; //lawp_ds
                                fids = "m";
                            }
                        }
                       // var downloadpath = "/" + a.filepath + "/" + a.fname;
                        //alert(aligndir);
                        // var dirname = aligndir.replace("WorkSpace/1/", "");
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        var n1 = permission.indexOf("2");
                        //alert(permission);
                        //alert(n1);
                        if (n1 != "" || n1 == "0") {
                            if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "DOCX" || ftype == "DOCX" || ftype == "PPT" || ftype == "PPTX") {
                                var openpath = bsurlfile + '/Docs/ViewSample?mode=Edit&fileName=' + a.fname + '&dname=' + a.dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Userid;
                                var idtemp = "idss";
                                var pointer = "cursor:pointer";
                                // openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
                            }
                            else {
                                var pageURL1 = window.location.origin;
                                 downloadpath = pageURL1 + "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + a.FullDirPath + "/" + a.fname;
                                //openurl = "https://docs.google.com/gview?url=" + downloadpath3 + "+&embedded=true";
                                var openpath = "https://docs.google.com/gview?url=" + downloadpath + "+&embedded=true";
                                var idtemp = "idss";
                                var pointer = "cursor:pointer";
                            }
                        }
                        if (n1.toString() == "-1") {
                            if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "DOCX" || ftype == "DOCX" || ftype == "PPT" || ftype == "PPTX") {
                                var openpath = bsurlfile + '/Docs/ViewSample?mode=view&fileName=' + a.fname + '&dname=' + a.dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Userid;
                                var idtemp = "idss";
                                var pointer = "cursor:pointer";
                                // openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
                            }
                            else {
                                var pageURL1 = window.location.origin;
                                 downloadpath = pageURL1 + "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + a.FullDirPath + "/" + a.fname;
                                //openurl = "https://docs.google.com/gview?url=" + downloadpath3 + "+&embedded=true";
                                var openpath = "https://docs.google.com/gview?url=" + downloadpath + "+&embedded=true";
                                var idtemp = "idss";
                                var pointer = "cursor:pointer";
                            }
                        }
                        //html += '<tr><td>'+a.ftype+'</td></tr>';
                        if (String(downloadpath).indexOf('null/') > -1) {
                            downloadpath = downloadpath.replace("null/", "");
                        }
                        if (String(openpath).indexOf('null/') > -1) {
                            openpath = openpath.replace("null/", "");
                        }
                        html += '<tr><td class="7"><i class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span style="' + pointer + '" id="' + idtemp + '"  value="' + last + '"  href="' + openpath + '"> ' + a.fname + '</span></a></td><td width="100px; ">' + dates1 + '</td><td>' + last + '</td><td><a class="glyphicon glyphicon-download-alt" style="color:green; cursor:pointer" download="' + a.fname + '" id="downloadfile" href="' + downloadpath + '" values="' + a.Id + + '"> </a>&nbsp;&nbsp;&nbsp;<btn class="" style="margin-top:0px; color:red;cursor:pointer" data-toggle="modal" id="removedirfile" directnamefull="' + downloadpath + '" value="' + a.Id + '"></a>&nbsp;&nbsp;&nbsp;<btn class="" style="margin-top:0px; color:red;' + ncss + '" data-toggle="modal" id="removedirfile" directnamefull="' + downloadpath + '" value="' + a.id + '" pathid="path' + a.id + '"></span> <span class="glyphicon glyphicon-trash" ></span></btn></td><td>' + a.assignby + '</td></tr>';
                    }
                    catch (err) {
                        alert(err.message);
                    }
                });
                $("#dirbound").append(html);
                // permission();
                closeload();
                //console.log(response1);
            },
        });
    }
    var fcode = localStorage.getItem("FirmCode");
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';
    jQuery('#modeldocs').click(function (e) {
        var fdir = $('#filedirectory').val();
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
            var newulrs = urls + "&fname=" + filename + "&dname=" + fdir;
            $('#docframe').attr('src', newulrs);
            $('#myModal8').modal({ show: true });
            $('#filename').val("");
            $("#dirbound").html('');
            LoadDirectoryFiles();
        }
    });
    jQuery('#modelspread').click(function (e) {
        var fdir = $('#filedirectory').val();
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
            $("#dirbound").html('');
            LoadDirectoryFiles();
        }
    });
    jQuery('#modelpresent').click(function (e) {
        var fdir = $('#filedirectory').val();
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
            $("#dirbound").html('');
            LoadDirectoryFiles();
        }
    });
    $(document).on("click", "#idss", function () {
        var link = $(this).attr("href");
        var value = $(this).attr("value");
        try {
            if (value == "DOCX File" || value == "DOC File" || value == "XLSX File" || value == "PPT File") {
                $('#spanhead').html("Edit File");
                $('#docframe').attr('src', link);
                $('#myModal8').modal({ show: true });
            }
            else {
                $('#otherdocframe').attr('src', link);
                $('#myModal9').modal({ show: true });
            }
        } catch (err) {
            alert(err.message);
        }
    })
});