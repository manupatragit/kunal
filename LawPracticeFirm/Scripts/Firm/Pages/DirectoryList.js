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
    var loadcontactflag = false;

    /*Attchment*/
    $("#attachment").change(function () {
        var tempsize1 = 0;
        var totalFiles1 = document.getElementById("attachment").files.length;
        for (var i = 0; i < totalFiles1; i++) {
            var file1 = document.getElementById("attachment").files[i];
            var filename1 = file1.name;
            if (filename1.length > 35) {
                alert("File name should not be more than 35 character. Please check file name: " + filename1);
                $("#attachment").val("");
                return false;
            }
            checkfileext(filename1);
            try {
                if (typeof (file1) != "undefined") {
                    size1 = parseFloat(file1.size / 1024).toFixed(2);
                    tempsize1 = parseFloat(tempsize1) + parseFloat(size1);
                }
            }
            catch (err) {
                //alert(err.message);
            }
        }
        tempsize1 = tempsize1.toFixed(2);
        if (tempsize1 > filesize) {
            $("#attachment").val("");
            new PNotify({
                title: 'Warning!',
                text: Filesizelabel,
                type: 'error',
                delay: 3000
            });
            return false
        }
    });

    $(document).on("click", "#filesyncpermission", function () {
        selectedID = [];
        selectedflag = [];
        filesyncPermission();

        /*Save File Sync Request*/
        function filesyncPermission() {
            var result = confirm("Only files can be sync. Are you sure to save document for Sync?");
            if (result) {
                $('input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        var vdata = $(this).attr("data-val");
                        var flagvalue = $(this).attr("data-flag");
                        if (String(flagvalue) == "1") {
                            selectedID.push(vdata + "_0");
                        }
                        if (String(flagvalue) == "0") {
                            selectedID.push(vdata + "_1");
                        }
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    var formData = new FormData();
                    formData.append("typeIds", selectedID);
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/SaveFileSyncRequest',
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
                                    text: 'File sync request has been saved successfully',
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
                else {
                    new PNotify({
                        title: 'Warning',
                        text: ' You do not have selected any row?',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });

    /*Save dropbox details*/
    $(document).on("click", "#savedropbox", function () {
        var link = $(this).attr("href");
        var formdata = new FormData();
        formdata.append("filepath", link);
        formdata.append("urltypes", "dropbox");
        formdata.append("baseurl", window.location.origin);
        $.ajax({
            async: true,
            url: '/api/CallApi/Dirfilepath',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var urldropbox = "/firm/dropbox?status=true&token=" + response.Data;
                $('#dropboxframe').attr('src', urldropbox);
                $('#myModaldropbox').modal({ show: true });
            },
            error: function () {
                alert('Error!');
            }
        });
    });
    $("#removerequest").click(function () {
        window.location = encodeURI("/" + fcode + "/firm/RemoveFileRequest");
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

    /*Move directory file*/
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
    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
        } else {
            $("#overlaytime").text(timeLeft + ' seconds remaining');
            timeLeft--;
        }
    }

    /*Download directory file*/
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

    //get permission on contact
    $("#contact").change(function () {
        var cvalue = $(this).val();
        var fileid = $("#directoryid").text();
        if (cvalue != "") {
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
                    $.each(response.Data, function (i, a) {
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
                }
                qty = 0;
                $.each(response.Data, function (i, a) {
                    qty = qty + 1;
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

    // Remove Folders
    $(document).on("click", "#removedir", function () {
        var fid = $(this).attr("values");
        var fdir = $(this).attr("dirname");
        var fdirpath = $(this).attr("filepath");
        var result = confirm("Are you sure to remove this Folder?");
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
        var value = $(this).attr("value");
        var dname = $(this).attr("directnamefull");
        var fid = $(this).attr("fid");
        var fpath = $(this).attr("fpath");
        var result = confirm("Are you sure for file remove request?");
        if (result) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/MarkRemoveDirectoryFile",
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
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File remove request has been saved Successfully.',
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
    $(document).on("click", "#revertassign", function () {
        var sfid = $(this).attr("val-id");
        var result = confirm("Are you sure to un-share this File?");
        if (result) {
            var formData = new FormData();
            formData.append("did", sfid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/RevertAssignFile",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (String(data.Data) == "Object reference not set to an instance of an object.") {
                        alert("You cannot un-share the file shared by Admin.");
                        closeload();
                        return false;
                    }
                    var datas1 = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: ' File Shared Reverted Successfully',
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
    function showuserassignefiledata() {
        $("#assignuserdata").html("");
        var html = '';
        var fileid = $("#directoryid").text();
        var formData = new FormData();
        formData.append("Id", fileid);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/AssignFilePerUserList",
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
                    var res = permissionlist.replace("1", "Read");
                    var res1 = res.replace("2", "Write/Co-Author");
                    var res2 = res1.replace("3", "Remove");
                    html += '<tr><td>' + qty1 + '</td><td>' + a.fname + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.username + '</td><td>' + res2 + '</td><td ><button type="button" class="btn btn-danger btn-sm" id="revertassign" val-id="' + a.id + '">Revert Permission</button></td></tr>';
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

    //move file open modal
    $(document).on("click", "#movefile", function () {
        var movefileid = $(this).attr("data-val");
        var filename = $(this).attr("fname-val");
        var filepaths = $(this).attr("fpath-val");
        $("#fileids").text(movefileid);
        $("#filenames").text(filename);
        $("#filepath").text(filepaths);
        var defaultdid = 0;
        var url = "/firm/MoveDirList/" + defaultdid;
        $('.loadmovedirlist').load(url, function (result) {
            closeload1();
            $('#myModalmove').modal({ show: true });
        });
    });

    //move file
    $(document).on("click", "#savemovefile", function () {
        var result = confirm("Are you sure to move this File?");
        var tempfilenames = "";
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
                tempfilenames = array2[i];
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
                        if (String(data.Data) == "assign") {
                            alert("You can not move file which is already assigned.");
                            closeload();
                            return false;
                        }
                        if (String(data.Data) == "Sync") {
                            alert("You can not move file which marked for sync");
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
                        var datas1 = JSON.stringify(data);
                        document.getElementById("close").click();
                        if (data.Data == "1") {
                            $("#dirbound").html('');
                            new PNotify({
                                title: 'Success!',
                                text: ' File Moved Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            LoadDirectoryFiles(pageindex);
                        }
                        else if (data.Data == false) {
                            new PNotify({
                                title: 'info!',
                                text: 'File cannot move. It is already assigned to other user',
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

    // assign directory with permission
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
        var result = confirm("Are you sure to share this File?");
        if (result) {
            if ($("#contact").val() == "") {
                alert("select user.");
                return false;
            }
            if (selected3 == "") {
                alert("select atleast one permission.");
                return false;
            }
            var formData = new FormData();
            formData.append("did", fid);
            formData.append("permissiontype", selected3);
            formData.append("user", user);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/AssignFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var datas1 = JSON.stringify(data);
                    if (data.Data == "1") {
                        $("#dirbound").html('');
                        $("#ptypes").html('');
                        LoadDirectoryFiles(pageindex);
                        new PNotify({
                            title: 'Success!',
                            text: ' File Shared Successfully',
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
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    }
    // load contact
    function loadcontact() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/AllAssignuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    // alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserNames"] + '</option>';
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

    // load contact
    loadcontact2();
    function loadcontact2() {
        var rt = $.ajax({
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
                    // alert("not found");
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["UserName"] + '</option>';
                    if (String(roleid) == "1") {
                        $("#dusers").append(option);
                        var navigateuser = localStorage.getItem("navigateuser");
                        if (String(navigateuser) != "undefined") {
                            $('#dusers option[value="' + navigateuser + '"]').attr("selected", true);
                        }
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
        $.when(rt).then(function (data, textStatus, jqXHR) {
            LoadDirectoryFiles(pageindex);
        });
    }

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
            return false;
        }
        if (dirname.length > 25) {
            $(".validpanel").css("display", "block").html("Folder Name should be less than 26 character");
            return false;
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
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
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
                checkfileext(filename);
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
                    if (String(response.Data) == "Object reference not set to an instance of an object.") {
                        alert("You can not create file for other users directory");
                        closeload();
                        return false;
                    }
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
                        $("#myModal1 .close").click();
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
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", "files");
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
                formdata.append("typeIds", selectedIDSync);
                openload();
                $.ajax({
                    async: true,
                    url: '/api/CallApi/SaveFileRemoveRequest',
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
    LoadDirectory();

    // Load Directory
    function LoadDirectory() {
        $("#directory").html('');
        $("#filedirectory").html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        dirtoken = directoryid;
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
                    var obj = JSON.parse(response.Data);
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
    var chksflag = true;
    /*Search data*/
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
    var diruser = "";
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex);
    });
    $("#dusers").change(function () {
        $(".noactive").css("display", "none");
        var cvalue = $(this).val();
        directorypath = "";
        localStorage.setItem("navigateuser", cvalue);
        localStorage.setItem("dirsuser", cvalue);
        diruser = cvalue;
        directoryid = 0;
        LoadDirectoryFiles(1);
    });
    var dirtoken = "";

    // Load DirectoryFiles
    function LoadDirectoryFiles(pageindex) {
        var temuser = $("#dusers").val();
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
        var formData = new FormData();
        formData.append("dirtoken", directoryid);
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        if (String(roleid) == "1") {
            formData.append("user", diruser);
        }
        else {
            formData.append("user", "");
        }
        formData.append("search", $('#searchdata').val());
        var ajaxTime = new Date().getTime();
        var rt1 = $.ajax({
            async: true,
            url: '/api/callApi/UserDirectoryList1byrowid',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response1) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("dirdetails:" + totalTime);
                $("#tfooter").html("");
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    if (response1.Data == "") {
                        closeload();
                        var urls = "/" + fcode + "/Firm/DirectoryList/0";
                        location.href = urls;
                        return false;
                    }
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
                                openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
                            }
                            else {
                                openurl = bsurlfile + '/Docs/ViewSample?fileName=' + a.fname + '&dname=' + a.dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Firmuser;
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
                                var downloadpath = "/DownloadFile.ashx??check=true&fld=w&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=" + directorypath + "&filename=" + a.fname;
                                fids = "w";
                            } else {
                                var downloadpath = "/DownloadFile.ashx?check=true&fld=m&ftype=" + ftype + "&ftoken=" + a.id + "&filepath=" + directorypath + "&filename=" + a.fname; //lawp_ds
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
                                rowreflect = "background:#e4b4b4";
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
                            if (String(a.IsSync) == "1") {
                                dsyncicon = "glyphicon glyphicon-retweet";
                                dsynctitle = "Marked for data synchronization";
                            }
                            else {
                                dsyncicon = "";
                                dsynctitle = "";
                            }
                            html += '<tr><td slign="center" style="' + rowreflect + '"><span><input type="checkbox" fpath-val="' + directorypath + '" data-val="' + a.id + '" data-flag="' + syncflg + '"  fname-val="' + a.fname + '" class="checkbox"  style=" ' + moveshow + '"/></span><span class="glyphicon glyphicon-question-sign" style="' + quesmark + '" title="File Already Shared. Can not be Moved."></span></td><td class="7" style="' + rowreflect + '"><i  name="' + a.fname + '"class="' + ficon + '" style="font-size:14px;color:' + icolor + '"></i><span  downloadpath1="' + downloadpath + '" style="cursor:pointer" id="idss"  value="' + last + '"  href="' + openurl + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a><i class="' + syncicon + ' pull-right" title="' + synctitle + '"  style="margin-left:10px;"></i><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; " style="' + rowreflect + '">' + dates1 + '</td><td style="' + rowreflect + '"><btn class="" title="' + marklabel + '" style="' + markcolor + '" data-toggle="modal" id="removedirfile" directnamefull="' + a.fname + '" fid="' + fids + '" fpath="' + directorypath + '"  value="' + a.id + '"></span> <span class="glyphicon glyphicon-trash" ></span></btn>&nbsp;&nbsp;&nbsp;&nbsp;<a class="glyphicon glyphicon-download-alt" style="color:#5c5c5c; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfile" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.id + '"> </a> </span>&nbsp;&nbsp;<span id="savedropbox" href="' + dropboxftoken + '" class="glyphicon glyphicon-cloud-upload" style="color: #1da1ce;font-size:15px;cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"></span></td><td style="' + rowreflect + '">' + last + '</td><td width="100px; " style="' + rowreflect + '"><btn class="btn btn-warning btn-sm" style="margin-top:0px;" data-toggle="modal" id="permopen" value="' + a.id + '" valuename="' + dirname + '"></span> Share</btn></td><td style="' + rowreflect + '">' + a.CreatedBy + '</td><td style="' + rowreflect + '">' + ((a.fdetails == null || a.fdetails == "NULL") ? "" : a.fdetails) + '</td></tr>';
                        }
                        else {
                            if (String(a.IsSync) == "1") {
                                dsyncicon = "glyphicon glyphicon-retweet";
                                dsynctitle = "Marked for data synchronization";
                            }
                            else {
                                dsyncicon = "";
                                dsynctitle = "";
                            }
                            html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.id + '" data-flag="-1"  fname-val="' + a.fname + '" class="checkbox"/></td><td class="7"><span name="' + a.fname + '" class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<a id="transferpage" href="javascript:void()" data-val="' + a.id + '" style="color: black"><span>' + dirname + '<span></a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td width="100px; ">' + dates1 + '</td><td><span class="glyphicon glyphicon-trash" style="color:#5c5c5c; cursor:pointer" id="removedir" values="' + a.id + '" dirname="' + a.fname + '"  filepath="' + directorypath + '" > </span></td><td></td><td></td><td>' + a.CreatedBy + '</td><td></td></tr>';
                        }
                    });
                }
                catch (err) {
                    console.log(err.message);
                }
                $("#dirbound").append(html);
                closeload();
            },
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (loadcontactflag == false) {
                permissionlist();
                loadcontact();
                loadcontactflag = true;
            }
        });
    }
    $(document).on("click", "#transferpage12", function () {
        $(".noactive").css("display", "none");
        var cvalue = $(this).attr("data-val");
        localStorage.setItem("navigateuser", cvalue);
        directorypath = "";
        diruser = cvalue;
        directoryid = 0;
        LoadDirectoryFiles(1);
        LoadDirectory();
    });
    $(document).on("click", "#transferpage", function () {
        var transferid = $(this).attr("data-val");
        $("#transferpage12").attr("data-val", transferid);
        var tempusers = $("#dusers").val();
        localStorage.setItem("dirsuser", tempusers);
        localStorage.setItem("contacttoken", transferid);
        var tflags = 0;
        var urls = "/" + fcode + "/Firm/DirectoryList/1";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": transferid, "tflag": tflags }
        });
    });
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';

    //open file in office
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
            $("#otherdocframe").attr("src", "/Firm/loader");
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

/*Paginate*/
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 20;
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




let selectedpostedFile = [];

// If you open the file dialog by clicking the container:
$(document).on('click', '#dropContainer', function (e) {
    // Don't open file picker if click came from the remove button (✖)
    if ($(e.target).closest('.remove-file-postedFile').length) return;

    $('#coattechment').trigger('click');
});

$(document).on('change', '#coattechment', function (e) {
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
    const fileList = $('#lblcoattechment-error1');
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
    document.getElementById('coattechment').files = dt.files;
}

function clearpostedFileUpload() {
    selectedpostedFile = [];
    const fileInput = document.getElementById("coattechment");
    if (fileInput) fileInput.value = "";
    $('#lblcoattechment-error1').empty();
    $("#dropContainer").attr("title", "Upload Attachment");
}