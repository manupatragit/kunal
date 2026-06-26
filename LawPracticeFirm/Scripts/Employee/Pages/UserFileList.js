$(document).ready(function () {
/*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
/*Close loader*/
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
    //open permision model
    var t = 0;
    $(document).on("click", "#permopen", function () {
        var t = $(this).attr("value");
        $("#directoryid").html(t);
        var tn = $(this).attr("valuename");
        $('#contact').prop('selectedIndex', 0);
        $("#linkdata input[name='options[]']:checked").prop("checked", false);
        $("#directoryname").html(tn);
        showusersharefiledata();
        $('#myModalperm').modal({ show: true });
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
    function showusersharefiledata() {
        $("#assignuserdata").html("");
        var html = '';
        var fileid = $("#directoryid").text();
        // alert(fileid);
        var formData = new FormData();
        formData.append("Id", fileid);
        //read assign using list
        qty1 = 0;
        $.ajax({  async: true, 
            type: "POST",
            url: "/api/CallApi/ShareFileUserList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $('input:checkbox').removeAttr('checked');
                var datas1 = JSON.stringify(response1);
                 //alert(datas1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    //  alert(a.ppermission);
                    var permissionlist = String(a.ppermission);
                    var res = permissionlist.replace("1", "Read");
                    var res1 = res.replace("2", "Write/Co-Author");
                    var res2 = res1.replace("3", "Remove");
                    html += '<tr><td>' + qty1 + '</td><td>' + a.fname + '</td><td>' + String(a.date_time).substring(0, 10) + '</td><td>' + a.username + '</td><td>' + res2 + '</td></tr>';
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
                   // alert(datas1);
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
                                        // $(this).attr("chcked", "cheked");
                                        $("#checkboxes" + tfid + " input[name='options[]']" + "#chkd" + chkbx).prop('checked', true);
                                        // alert(strarray[i]);
                                        // alert(chkbx);
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
        var ffid = $(this).attr("value");
        var ffdir = $(this).attr("directnamefull");
        //alert(ffid);
        //alert(ffdir);
        var result = confirm("Are you sure to   Remove this File?");
        if (result) {
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/CallApi/RemoveDirectoryFile",
                headers: {
                    'ffid': ffid,
                    'ffdir': ffdir
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
        var fid = $("#directoryid").text();
        var user = $("#contact").val();
        //var matter = $("#matter").val();
        var chkArray3 = [];
        var selected = $("#linkdata input[name='options[]']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
       //alert(selected3);
        if (selected3.length > 0) {
        }
       // alert(fid);
        var result = confirm("Are you sure to   share this File ?");
        if (result) {
            var formData = new FormData();
            formData.append("did", fid);
            formData.append("permissiontype", selected3);
            formData.append("user", user);
            //formData.append("matter", matter);
            $.ajax({  async: true, 
                type: "POST",
                url: "/api/CallApi/UserShareFile",
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
                            text: ' File Share  Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#contact').get(0).selectedIndex = 0;
                        showusersharefiledata();
                        $('#matter').get(0).selectedIndex = 0;
                    }
                    else if (data.Data == "nouser") {
                        new PNotify({
                            title: 'info!',
                            text: ' Please Select User to Share File !',
                            type: 'error',
                            delay: 4000
                        });
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
            //alert(fdir);
            //alert(fid);
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
/*Create files*/
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
    permission();
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
                    //alert(datas);
                }
                else {
                    //alert("not found");
                }
                qty = 0;
                $.each(response.Data, function (i, a) {
                    qty = qty + 1;
                    //alert(qty);
                    var option2 = '&nbsp;&nbsp;<input type="checkbox" id="per' + qty + '" name="options[]" value="' + a.Id + '" />  ' + a.Pname + '';
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
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    openload();
    LoadDirectoryFiles();
    // Load DirectoryFiles
    var fcode = localStorage.getItem("FirmCode");
    var bsurlfile = window.location.origin + "/" + fcode;
    function LoadDirectoryFiles() {
        var formData = new FormData();
        formData.append("id", id);
        var html = '';
        var html1 = '';
        var togsum = 0;
        var j1 = $.ajax({  async: true, 
            type: "POST",
            url: "/api/callApi/FirmFileList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    // alert(datas1);
                    var obj = JSON.parse(response1.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    try {
                        var dates2 = a.date_time;
                        var dates1 = dates2.substring(0, 10);
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
                        //var aligndir = $('#collapseExample' + a.pfile).attr('dirname');
                        //var align = $('#collapseExample' + a.pfile).attr('tot');
                        //var fullfilepath = aligndir + "/" + a.fname;
                        var downloadpath = "/"+a.filepath+"/"+ a.fname;
                        //alert(aligndir);
                        // var dirname = aligndir.replace("WorkSpace/1/", "");
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        //html += '<tr><td>'+a.ftype+'</td></tr>';
                        html += '<tr><td class="7"><i class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span downloadpath1="' + downloadpath +'" style="cursor:pointer" id="idss"  value="' + last + '"  href="' + bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + id + '"> ' + a.fname + '</span></a></td><td width="100px; ">' + dates1 + '</td><td>' + last + '</td><td><a class="glyphicon glyphicon-download-alt" style="color:green; cursor:pointer" download="' + a.fname + '" id="downloadfile" href="' + downloadpath + '" values="' + a.Id + '"> </a>&nbsp;&nbsp;&nbsp;<btn class="" style="margin-top:0px; color:red; cursor:pointer" data-toggle="modal" id="removedirfile" directnamefull="' + downloadpath + '" value="' + a.Id + '"></span> <span class="glyphicon glyphicon-trash" ></span></btn></td><td width="100px; "><btn class="btn btn-info btn-sm" style="margin-top:0px;" data-toggle="modal" id="permopen" value="' + a.Id + '" valuename="' + dirname + '"></span>Share</btn></td></tr>';
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
        var downloadpath = $(this).attr("downloadpath1");
        if (value == "DOCX File" || value == "DOC File" || value == "XLSX File" || value == "PPT File") {
            $('#spanhead').html("Edit File");
            $('#docframe').attr('src', link);
            $('#myModal8').modal({ show: true });
        }
        else {
            window.open(downloadpath, '_blank');
        }
    })
});