$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var ffileval = new Array();
    var ffilenames = new Array();
    var ffullpath = new Array();
    /*Move file*/
    $(document).on("click", "#move", function () {
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                var fileval = $(this).attr("data-val");
                var filenames = $(this).attr("fname-val");
                var filepath = $(this).attr("fpath-val");
                ffileval.push(fileval);
                ffilenames.push(filenames);
                ffullpath.push(filepath);
                //return false;
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
    //move file
    $(document).on("click", "#savemovefile", function () {
        var result = confirm("Are you sure to  move this File?");
        if (result) {
            var dirval = $(this).attr("dir-val");
            var dirpath = $(this).attr("dir-path");
            var fileval = $("#fileids").text();
            var filenames = $("#filenames").text();
            var filepath = $("#filepath").text();
            var array1 = fileval.split(",");
            var array2 = filenames.split(",");
            var array3 = filepath.split(",");
            for (var i = 0; i < array1.length; i++) {
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/CallApi/SaveMoveDirectory",
                    headers: {
                        'fid': array1[i],
                        'dirid': dirval,
                        'dirpath': dirpath,
                        'filename': array2[i],
                        'filepath': array3[i]
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var datas1 = JSON.stringify(data);
                        document.getElementById("close").click();
                        if (data.Data == "1") {
                            $("#dirbound").html('');
                            LoadDirectoryFiles(pageindex);
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
            new PNotify({
                title: 'Success!',
                text: ' File Moved Successfully',
                type: 'success',
                delay: 3000
            });
        }
    });
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
        $("#directoryid").html(t);
        $('#myModalperm').modal({ show: true });
        showuserassignefiledata();
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
        var fileid = $("#directoryid").text();
        if (cvalue != "") {
            //alert(cvalue);
            var formData = new FormData();
            formData.append("cid", cvalue);
            formData.append("FileID", fileid);
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
                    // alert(datas1);
                    $.each(response.Data, function (i, a) {
                        var tfid = a.DirId;
                        var tper = a.ppermission;
                        // alert(tper);
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if ($("#target" + tfid).attr('perm' + tfid) == tfid) {
                                $("#linkdata input[name='options[]']").each(function () {
                                    var chkbx = $(this).val();
                                    if (strarray[i] == chkbx) {
                                        $("#linkdata input[name='options[]']" + "#per" + chkbx).prop('checked', true);
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
    permissionlist();
    // Load Permissions
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
                    // alert(option);
                    // alert(a.Pname);
                    //   $("#pbox").append('<input type="checkbox" name="options[]" value="' + a.Id + '" /> "' + a.Pname + '"');
                    $("#linkdata").append(option2);
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

    // Remove Folders
    $(document).on("click", "#removedir", function () {
        var fid = $(this).attr("values");
        var fdir = $(this).attr("dirname");
        var fdirpath = $(this).attr("filepath");
        var result = confirm("Are you sure to  remove this Folder?");
        if (result) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveDirectory",
                headers: {
                    'fid': fid,
                    'fdir': fdir,
                    'fdirpath': fdirpath
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    //alert(data.Data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex);
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
        //alert("hi");
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var result = confirm("Are you sure to  Remove this File?");
        if (result) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RemoveDirectoryFile",
                headers: {
                    'value': value,
                    'dname': dname,
                    'fid': fid,
                    'fpath': fpath
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    //  alert(data.Data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File Removed Successfully',
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
    //revert share file
    $(document).on("click", "#revertshare", function () {
        var sfid = $(this).attr("val-id");
        var result = confirm("Are you sure to un-share this File?");
        if (result) {
            var formData = new FormData();
            formData.append("did", sfid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RevertShareFile",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: ' File Share Reverted Successfully',
                        type: 'success',
                        delay: 3000
                    });
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
    function showuserassignefiledata() {
        $("#assignuserdata").html("");
        var html = '';
        var fileid = $("#directoryid").text();
        // alert(fileid);
        var formData = new FormData();
        formData.append("Id", fileid);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/ShareUserFileList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $('input:checkbox').removeAttr('checked');
                var datas1 = JSON.stringify(response1);
                // alert(datas1);
                var obj = JSON.parse(response1.Data);
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    //  alert(a.ppermission);
                    var permissionlist = String(a.ppermission);
                    var res = permissionlist.replace("1", "Read");
                    var res1 = res.replace("2", "Write/Co-Author");
                    var res2 = res1.replace("3", "Remove");
                    html += '<tr><td>' + qty1 + '</td><td>' + a.fname + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.username + '</td><td>' + res2 + '</td><td><button type="button" class="btn btn-danger btn-sm" id="revertshare" val-id="' + a.id + '">Revert Permission</button></td></tr>';
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
        var result = confirm("Are you sure to  share this file?");
        if (result) {
            var formData = new FormData();
            formData.append("did", fid);
            formData.append("permissiontype", selected3);
            formData.append("user", user);
            //formData.append("matter", matter);
            $.ajax({
                async: true,
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
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File Shared  Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#contact').get(0).selectedIndex = 0;
                        showuserassignefiledata();
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
                    else if (selected3.length == "0") {
                        new PNotify({
                            title: 'info!',
                            text: ' Please Select atleast 1 Permission.',
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
    // alert(directoryid);
    //create dir
    $("#CreateDir").click(function () {
        var formData = new FormData();
        var dirname = $("#cdir").val();
        dirname = String(dirname).replace(/[@\\/:*?"<>|.]/g, '');
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
        }
        formData.append("dname", dirname);
        formData.append("directoryid", directoryid);
        if (dirname != "") {
            openload();
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
                            LoadDirectoryFiles(pageindex);
                            new PNotify({
                                title: 'Success!',
                                text: ' Folder Created Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (datas.length == 61) {
                            $(".validpanel").css("display", "block").html(" Please Enter Folder Name !");
                            closeload();
                        }
                        else if (datas.length == 76) {
                            $(".validpanel").css("display", "block").html("Folder Already Exist");
                            closeload();
                        }
                    }
                    else {
                        //alert("not found");
                        closeload();
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
        if (dname == "" && directoryid == 0) {
            dname = dname;
        }
        else if (dname == "" && directoryid != 0) {
            dname = directoryid;
        }
        var filedetails = $("#filedetails").val();
        var formData = new FormData();
        var totalFiles = document.getElementById("attachment").files.length;
        if (totalFiles == 0) {
            alert("Please select the file to be uploaded.");
        }
        else {
            var tempsize = 0;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("attachment").files[i];
                var filename = file.name;
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                formData.append("FileUpload", file);
                try {
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tempsize = parseFloat(tempsize) + parseFloat(size);
                    }
                }
                catch (err) {
                    //alert(err.message);
                }
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
            formData.append("selectedpermission", selected3);
            formData.append("dirname", dname);
            formData.append("details", filedetails);
            openload();
            $.ajax({
                async: true,
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
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File Uploaded Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        closeload();
                        $("#list").text("");
                        //alert(datas);
                    }
                    else {
                        closeload();
                        //alert("not found");
                    }
                },
                error: function () {
                    closeload();
                    alert('Error!');
                }
            });
        }
    });
    LoadDirectory();
    // Load Directory
    function LoadDirectory() {
        $("#directory").html('');
        $("#filedirectory").html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        var pageURL = window.location.href;
        var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        if (lastURLSegment == "0") {
            dirtoken = 0;
        }
        else {
            dirtoken = lastURLSegment;
        }
        var dirid = dirtoken;
        var formData = new FormData();
        formData.append("dirtoken", dirtoken);
        $.ajax({
            async: true,
            url: '/api/callApi/DirectoryList1',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    // alert(datas);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                $.each(obj, function (i, a) {
                    if (a.ftype == "0") {
                        var option = '<option value="' + a.id + '" > ' + a.fname + '</option>';
                        $("#directory").append(option);
                        var option = '<option value="' + a.id + '" > ' + a.fname + '</option>';
                        $("#filedirectory").append(option);
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
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex);
    });
    var dirtoken = "";
    LoadDirectoryFiles(pageindex);
    // Load DirectoryFiles
    function LoadDirectoryFiles(pageindex) {
        $("#dirbound").html("");
        // alert("files");
        openload();
        dirtoken = directoryid;
        var dirid = dirtoken;
        var html = '';
        var html1 = '';
        var togsum = 0;
        var formData = new FormData();
        formData.append("dirtoken", dirtoken);
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        $.ajax({
            async: true,
            url: '/api/callApi/UserDirectoryList1byrowid',
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
                    //alert("not found");
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
                        //alert(replacedata);
                        //   var replacedata1 = "WorkSpace/1/15/";
                        var dirname = tmpdir.replace(replacedata, '');
                        var dat = a.date_time;
                        var dates1 = formatDatetoIST(dat)
                        // togsum = togsum + 1;
                        var dates2 = formatDatetoIST(a.date_time)
                        // var dates1 = dates2;
                        var dates1 = dates2.substring(0, 10);
                        var ficon = "fa fa-language";
                        var icolor = "black";
                        var fids = "";
                        var str = a.filetype;
                        if (str != null) {
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOCX" || ftype == "DOCX") {
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
                        if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "DOCX" || ftype == "DOCX" || ftype == "PPT" || ftype == "PPTX") {
                            openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
                        }
                        else {
                            var pageURL1 = window.location.origin;
                            var downloadpath1 = pageURL1 + "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            openurl = "https://docs.google.com/gview?url=" + downloadpath1 + "+&embedded=true";
                        }
                        var dirname = a.fname;
                        togsum = togsum + 1;
                        var id = 0;
                        if (a.ftype == 1) {
                            // alert(a.fname);
                            //  alert(directorypath)
                            var tempdownloadpath = "/LawPractice_ds/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            var xhr = new XMLHttpRequest();
                            xhr.open('HEAD', tempdownloadpath, false);
                            xhr.send();
                            if (xhr.status == "404") {
                                // console.log("File doesn't exist");
                                // alert("File doesn't exist");
                                var downloadpath = "/DownloadFile.ashx?fld=w&ftoken=" + a.id + "&filepath=" + directorypath + "&filename=" + a.fname;
                                fids = "w";
                                // var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            } else {
                                //  //console.log("File exists");
                                // alert("File exists");
                                var downloadpath = "/DownloadFile.ashx?fld=m&ftoken=" + a.id + "&filepath=" + directorypath + "&filename=" + a.fname; //lawp_ds
                                fids = "m";
                                //var downloadpath = "/LawPractice_ds/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            }
                            if (a.movecount == 0) {
                                quesmark = "display:none";
                                moveshow = "cursor:pointer;display:unset;"
                            }
                            else {
                                quesmark = "cursor:pointer;display:unset";
                                moveshow = "display:none;"
                            }
                            html += '<tr><td slign="center"><span><span class="glyphicon glyphicon-question-sign" style="' + quesmark + '" title="File Already Assigned. Can not be Moved."></span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span></td><td class="7"><i class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span  downloadpath1="' + downloadpath + '" style="cursor:pointer" id="idss"  value="' + last + '"  href="' + openurl + '"> ' + a.fname + '</span></a></td><td width="100px; ">' + dates1 + '</td><td><btn class="" style="margin-top:0px; color:#5c5c5c;cursor:pointer" data-toggle="modal" id="removedirfile" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '"  value="' + a.id + '"></span> <span class="glyphicon glyphicon-trash" ></span></btn>&nbsp;&nbsp;&nbsp;&nbsp;<a class="glyphicon glyphicon-download-alt" style="color:#5c5c5c; cursor:pointer" download="' + a.fname + '" id="downloadfile" href="' + downloadpath + '" values="' + a.id + '"> </a> </span></td><td>' + last + '</td><td width="100px; "><btn class="btn btn-warning btn-sm" style="margin-top:0px;" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span> Share</btn></td></tr>';
                        }
                        else {
                            //   var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Firmuser + "/" + directorypath + "/" + a.fname;
                            html += '<tr><td></td><td class="7"><span class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<a id="transferpage" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + dirname + '<span></a></td><td width="100px; ">' + dates1 + '</td><td><span class="glyphicon glyphicon-trash" style="color:#5c5c5c; cursor:pointer" id="removedir" values="' + a.id + '" dirname="' + a.fname + '"  filepath="' + directorypath + '"> </span></td><td></td><td></td></tr>';
                        }//html += '<div class="col-md-5 "><span style="cursor:pointer" data-toggle="collapse" data-target="#collapseExample' + a.Id + '" aria-expanded="false" aria-controls="collapseExample" id="bruidcmb" value="' + a.fname + '"><span class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"></span>&nbsp;&nbsp; ' + dirname + '</span></div>';
                    });
                }
                catch (err) {
                    alert(err.message);
                }
                $("#dirbound").append(html);
                // permission();
                closeload();
                //console.log(response1);
            },
        });
    }
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        var urls = "/" + fcode + "/Employee/UserDirectoryList/1";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid }
        });
    });
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
            //alert(newulrs);
            //return false;
            $('#docframe').attr('src', newulrs);
            $('#myModal8').modal({ show: true });
            $('#filename').val("");
            setTimeout(function () {
                $("#dirbound").html('');
                LoadDirectoryFiles(pageindex);
                //  alert("hi")
            }, 3000);
        }
    });
    $(document).on("click", "#idss", function () {
        var link = $(this).attr("href");
        var value = $(this).attr("value");
        try {
            if (value == "DOCX File" || value == "DOC File" || value == "XLSX File" || value == "PPTX File" || value == "PPT File") {
                $('#spanhead').html("Edit File");
                $('#docframe').attr('src', link);
                $('#myModal8').modal({ show: true });
            }
            else {
                //$('#spanhead').html("Edit File");
                $('#otherdocframe').attr('src', link);
                $('#myModal9').modal({ show: true });
            }
        }
        catch (err) {
            alert(err.message);
        }
    })
});