$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    openload();
    LoadDirectory();
    LoadDirectoryFiles();
    $(".validpanel").css("display", "none");

    /*show bru id crmb load contact permission*/
    $(document).on("click", "#bruidcmb", function () {
        var tempbrd = $(this).attr("value");
        var regExpr = /[/]/g;
        var tempbrd1 = tempbrd.replace(regExpr, " > ")
        $("#outputbrdcmb").html(tempbrd1);
    });

    /*change type*/
    $("#contype").change(function () {
        var contypes = $(this).val();
        $('#contact').get(0).selectedIndex = 0;
        $('#matter').get(0).selectedIndex = 0;
        $('input:checkbox').removeAttr('checked');
        if (contypes == "Contact") {
            $('#contact').css("display", "block");
            $('#matter').css("display", "none");
            $('#contact').get(0).selectedIndex = 0;
            $('#matter').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
        else if (contypes == "Matter") {
            $('#contact').css("display", "none");
            $('#matter').css("display", "block");
            $('#contact').get(0).selectedIndex = 0;
            $('#matter').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
        else {
            $('#contact').css("display", "none");
            $('#matter').css("display", "none");
            $('#contact').get(0).selectedIndex = 0;
            $('#matter').get(0).selectedIndex = 0;
            $('input:checkbox').removeAttr('checked');
        }
    });

    //get permission on contact
    $("#contact").change(function () {
        var cvalue = $(this).val();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", cvalue);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SingleUserPermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    $.each(response.Data, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.apermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#checkboxes" + tfid + " input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#checkboxes" + tfid + " input[name='options[]']" + "#chkd" + chkbx).prop('checked', true);
                                    }
                                    else {
                                        //alert("no");
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

    //get permission on matter
    $("#matter").change(function () {
        var cvalue = $(this).val();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", cvalue);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/SingleMatterPermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    $.each(response.Data, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.apermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#checkboxes" + tfid + " input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#checkboxes" + tfid + " input[name='options[]']" + "#chkd" + chkbx).prop('checked', true);
                                    }
                                    else {
                                        //alert("no");
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

    // Remove Files
    $(document).on("click", "#removedirfile", function () {
        var ffid = $(this).attr("values");
        var ffdir = $(this).attr("directnamefull");
        var result = confirm("Are you sure to   Remove this File?");
        if (result) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveDirectoryFile",
                headers: {
                    'configurationtype': type,
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
                            text: ' Directory Remove Successfully',
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
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/AssignPermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
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
            $.ajax({
                async: true,
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
                    ////alert("not found");
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
                }
                else {
                    ////alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    $("#contact").append(option);
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

    //create dir
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
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
        dirname = dirname.replace(/\s/g, '');
        if (dirname == "") {
            $(".validpanel").css("display", "block").html(" Please Enter Directory Name !");
        }
        formData.append("dname", dirname);
        if (dirname != "") {
            $.ajax({
                async: true,
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
                        ////alert("not found");
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
            $.ajax({
                async: true,
                url: '/api/CallApi/Createfile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    $("#fileupload")[0].reset();
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
                    }
                    else {
                        ////alert("not found");
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
                    ////alert("not found");
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

    // Load Directory
    function LoadDirectory() {
        $("#directory").html('');
        $("#filedirectory").html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/DirectoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    ////alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var tmpdir = a.fname;
                    var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                    var dirname = tmpdir.replace(replacedata, '');
                    var option = '<option value="' + a.Id + '" > ' + dirname + '</option>';
                    $("#directory").append(option);
                    var option = '<option value="' + a.Id + '" > ' + dirname + '</option>';
                    $("#filedirectory").append(option);
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

    // Load DirectoryFiles
    function LoadDirectoryFiles() {
        var html = '';
        var html1 = '';
        var togsum = 0;
        var j1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/DirectoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response1) {
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                }
                else {
                    ////alert("not found");
                }
                $.each(response1.Data, function (i, a) {
                    var tmpdir = a.fname;
                    var replacedata = String("WorkSpace/" + firmid + "/" + userid + "/");
                    var dirname = tmpdir.replace(replacedata, '');
                    var dat = a.date_time;
                    var dates1 = dat.substring(0, 10);
                    togsum = togsum + 1;
                    html += '<div class="col-md-12 head" style="margin-bottom:10px;" perm' + a.Id + '="' + a.Id + '" id="target' + a.Id + '">';
                    html += '<div class="col-md-5 "><span style="cursor:pointer" data-toggle="collapse" data-target="#collapseExample' + a.Id + '" aria-expanded="false" aria-controls="collapseExample" id="bruidcmb" value="' + a.fname + '"><span class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"></span>&nbsp;&nbsp; ' + dirname + '</span></div>';
                    html += '<div class="col-md-2">' + dates1 + '</div>';
                    html += ' <div class="col-md-1"> <span class="glyphicon glyphicon-trash" style="color:red; cursor:pointer" id="removedir" values="' + a.Id + '" dirname="' + a.fname + '"> </span> </div>';
                    html += '<div class="col-md-4"><span class="linkdata1" id="checkboxes' + a.Id + '"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-info btn-sm" style="margin-left:5px;" value="' + a.Id + '" id="assign" >Assign</button>&nbsp;&nbsp;</div>';
                    html += ' </div > <br>';
                    html += ' <div class="col-md-12 collapse"   id="collapseExample' + a.Id + '"   tot="' + a.Id + '" dirname="' + a.fname + '"> </div>';
                });
                $("#dirbound").append(html);
                permission();
            },
        });
        $.when(j1).then(function (a1) {
            ajax1();
        }, function (jqXHR, textStatus, errorThrown) {
            //  alert('Either j1 or j2 failed!');
        });
    }
    var fcode = localStorage.getItem("FirmCode");
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';
    function ajax1() {
        var j2 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/DirectoryFileList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    ////alert("not found");
                }
                $.each(response.Data, function (i, a) {
                    var dat1 = a.date_time;
                    var dates2 = dat1.substring(0, 10);
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
                    var aligndir = $('#collapseExample' + a.pfile).attr('dirname');
                    var align = $('#collapseExample' + a.pfile).attr('tot');
                    var fullfilepath = aligndir + "/" + a.fname;
                    var downloadpath = "/" + aligndir + "/" + a.fname;
                    var dirname = aligndir.replace("WorkSpace/1/", "");
                    if (align == a.pfile) {
                        $('#collapseExample' + a.pfile).append('<div style="padding:0 0 3px 0; overflow:hidden;font-size:14px;"><div class="col-md-6" style="padding: 0 0 0 35px;"><i class="fa fa-mail-forward" style="color:grey"></i> &nbsp;<i class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span style="cursor:pointer" id="idss"  value="' + last + '"  href="' + bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + dirname + '"> ' + a.fname + '</span></div><div class="col-md-2">' + last + '</div><div class="col-md-2">' + dates2 + '</div><div class="col-md-1"> <span class="glyphicon glyphicon-trash" style="color:maroon; cursor:pointer" id="removedirfile" directnamefull="' + fullfilepath + '" values="' + a.Id + '"> </span>&nbsp;&nbsp;&nbsp;<div class="col-md-1"> <a class="glyphicon glyphicon-download-alt" style="color:green; cursor:pointer" download="' + a.fname + '" id="downloadfile" href="' + downloadpath + '" values="' + a.Id + '"> </a> </button></div></div></div> ');
                    }
                    else {
                        alert("notdone");
                    }
                });
                closeload();
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
        //open file in office
    }
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
        if (value == "DOCX File" || value == "DOC File" || value == "XLSX File" || value == "PPT File") {
            $('#spanhead').html("Edit File");
            $('#docframe').attr('src', link);
            $('#myModal8').modal({ show: true });
        }
        else {
        }
    })
});