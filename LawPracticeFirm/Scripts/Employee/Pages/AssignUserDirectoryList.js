$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    $(".validpanel").css("display", "none");
    $(document).on("click", "#bruidcmb", function () {
        var tempbrd = $(this).attr("value");
        var regExpr = /[/]/g;
        var tempbrd1 = tempbrd.replace(regExpr, " > ")
        $("#outputbrdcmb").html(tempbrd1);
    });
    /*open permision model*/
    var t = 0;
    $(document).on("click", "#permopen", function () {
        var t = $(this).attr("value");
        $("#directoryid").html(t);
        var tn = $(this).attr("valuename");
        $('#contact').prop('selectedIndex', 0);
        $("#linkdata input[name='options[]']:checked").prop("checked", false);
        $("#directoryname").html(tn);
        $('#myModalperm').modal({ show: true });
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
    /*get permission on contact*/
    $("#contact").change(function () {
        var cvalue = $(this).val();
        var did = $("#directoryid").text();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", cvalue);
            formData.append("did", did);
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/FirmSingleDirPermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $('input:checkbox').removeAttr('checked');
                    var datas1 = JSON.stringify(response);
                    $.each(response.Data, function (i, a) {
                        qt = qty + 1;
                        var tfid = a.DirId;
                        var tper = a.apermission;
                        var strarray = tper.split(',');
                        for (var i = 0; i < strarray.length; i++) {
                            if (strarray[i] == "1") {
                                $("#per1").prop('checked', true);
                            }
                            if (strarray[i] == "2") {
                                $("#per2").prop('checked', true);
                            }
                            if (strarray[i] == "3") {
                                $("#per3").prop('checked', true);
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
    /*Remove Files*/
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
    /*Assign directory with permission*/
    $(document).on("click", "#assign", function () {
        var did = $("#directoryid").text();
        var fid = $(this).val();
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
        var result = confirm("Are you sure to   Assign permission for this Directory?");
        if (result) {
            var formData = new FormData();
            formData.append("did", did);
            formData.append("permissiontype", selected3);
            formData.append("user", user);
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
                            text: ' Please Select User  to assign  Permission !',
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
    /*Remove Folders*/
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
    /*Load matter*/
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
    /*Load contact*/
    loadcontact();
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
    /*Create dir*/
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
            try {
                var fileUpload = document.getElementById("attachment");
                if (typeof (fileUpload.files) != "undefined") {
                    var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
                    if (size > filesize) {
                        new PNotify({
                            title: 'Warning!',
                            text: 'File Size is Too large!',
                            type: 'error',
                            delay: 3000
                        });
                        return false
                    }
                }
            }
            catch (err) {
            }
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
                    }
                },
                error: function () {
                    alert('Error!');
                }
            });
        }
    });
    permission();
    /*Load Permissions*/
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
                }
                qty = 0;
                $.each(response.Data, function (i, a) {
                    qty = qty + 1;
                    var option = '&nbsp;&nbsp;<input type="checkbox" id="per' + qty + '" name="options[]" value="' + a.Id + '" />  ' + a.Pname + '';
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
    /*Load Directory*/
    function LoadDirectory() {
        $("#directory").html('');
        $("#filedirectory").html('');
        var option7 = '<option value="" > Select</option>';
        $("#directory").append(option7);
        $("#filedirectory").append(option7);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/AssignUserDirectoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
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
    openload();
    LoadDirectoryFiles();
    /*Load Directory Files*/
    function LoadDirectoryFiles() {
        var html = '';
        var html1 = '';
        var togsum = 0;
        var j1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/AssignUserDirectoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response1) {
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    var obj = JSON.parse(response1.Data);
                }
                else {
                }
                $.each(obj, function (i, a) {
                    var tmpdir = a.fname;
                    var replacedata = String("WorkSpace/" + firmid + "/" + a.Userid + "/");
                    var dirname = tmpdir.replace(replacedata, '');
                    var dat = a.date_time;
                    var dates1 = dat.substring(0, 10);
                    togsum = togsum + 1;
                    html += '<tr><td class="7"><span class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:orange"> </span>&nbsp;&nbsp;<a href="/' + fcode + '/Employee/AssignUserFileList/' + a.DirId + ' " style="color: black"><span>' + dirname + '<span></a></td><td width="100px; ">' + dates1 + '</td></td><td>' + a.shareby + '</td></tr>';
                });
                $("#dirbound").append(html);
                closeload();
            },
        });
    }
    var fcode = localStorage.getItem("FirmCode");
    var bsurlfile = window.location.origin + "/" + fcode;
    var html1 = '';
    /*Docs model*/
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
    /*Spread model*/
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
    /*Model present*/
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