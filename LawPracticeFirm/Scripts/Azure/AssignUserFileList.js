$(document).ready(function () {
    function validatercasefile(param) {
        var reg = /_matter_[0-9]{5}$/g
        if (reg.test(param) == false) {
            return false;
        }
        else {
            return true;
        }
    }
    $(document).on("click", "div .dropdown-menu", function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    /*Open Loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var pageURL4 = window.location.href;
    baseurl = pageURL4;
    $(".validpanel").css("display", "none");
    $(document).on("click", "#bruidcmb", function () {
        var tempbrd = $(this).attr("value");
        var regExpr = /[/]/g;
        var tempbrd1 = tempbrd.replace(regExpr, " > ")
        $("#outputbrdcmb").html(tempbrd1);
    });
    /*Reset office users*/
    var resetusrflag = "false";
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

    $("#removerequest").click(function () {
        window.location = encodeURI("/" + fcode + "/Azure/RemoveFileRequest");
    })

    /*Change type*/
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
    /*Change contact details*/
    $("#contact").change(function () {
        var cvalue = $(this).val();
        if (cvalue != "") {
            var formData = new FormData();
            formData.append("cid", EncodeText(cvalue));
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
    /*Download files*/
    $(document).on("click", "#downloadfiles", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var durl = $(this).attr("href-val");
        some = new URLSearchParams(durl)
        var ftype = some.get('ftype');
        var ftokens = some.get('ftoken');
        window.location.href = durl;
    });

    /*Remove Files*/
    //$(document).on("click", "#removedirfile", function () {
    //    var ffid = $(this).attr("value");
    //    var ffdir = $(this).attr("directnamefull");
    //    var isuse = $(this).attr("data-inuser");
    //    if (isuse == "1") {
    //        alert("The file cannot be deleted as it is in use.");
    //        return false;
    //    }
    //    var result = confirm("Are you sure to remove this File?");
    //    if (result) {
    //        $.ajax({
    //            async: true,
    //            type: "POST",
    //            url: "/api/AzureApi/RemoveUserDirectoryFile",
    //            headers: {
    //                'ffid': ffid,
    //                'ffdir': ffdir
    //            },
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (data) {
    //                var datas1 = JSON.stringify(data);
    //                if (data.Data == "1") {
    //                    $("#dirbound").html('');
    //                    LoadDirectoryFiles(pageindex);
    //                    new PNotify({
    //                        title: 'Success!',
    //                        text: ' File Remove Successfully',
    //                        type: 'success',
    //                        delay: 3000
    //                    });
    //                }
    //                else {
    //                    new PNotify({
    //                        title: 'info!',
    //                        text: ' Oops ! File can not be deleted.',
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

    $(document).on("click", "#removedirfile", function () {
        var ffid = $(this).attr("value");
        var ffdir = $(this).attr("directnamefull");
        var isuse = $(this).attr("data-inuser");
        if (isuse == "1") {
            //alert("The file cannot be deleted as it is in use.");
            new PNotify({
                title: 'Success!',
                text: 'The file cannot be deleted as it is in use.',
                type: 'success',
                delay: 3000
            });
            return false;
        }
        //var result = confirm("Are you sure to remove this File?");
        //if (result) {
            
        //}
        $("#myModalFileConfirmation").modal();
        $("#deleteFileDetails").attr("ffid", ffid);
        $("#deleteFileDetails").attr("ffdir", ffdir);

    });
    $(document).on("click", "#deleteFileDetails", function () {
        var ffid = $(this).attr("ffid");
        var ffdir = $(this).attr("ffdir");
        RemoveDirectoryFileDetail(ffid, ffdir);
    });

    function RemoveDirectoryFileDetail(ffid, ffdir) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/RemoveUserDirectoryFile",
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
                    LoadDirectoryFiles(pageindex);
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
                $("#myModalFileConfirmation").modal("hide");
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*assign directory with permission*/
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
        var result = confirm("Are you sure to Assign permission for this Directory?");
        if (result) {
            var formData = new FormData();
            formData.append("did", EncodeText(fid));
            formData.append("permissiontype", EncodeText(selected3));
            formData.append("user", EncodeText(user));
            formData.append("matter", EncodeText(matter));
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
    /*Remove directory Folders*/
    $(document).on("click", "#removedir", function () {
        var fid = $(this).attr("values");
        var fdir = $(this).attr("dirname");
        var result = confirm("Are you sure to Remove this Directory?");
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
    /*Load matter details*/
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
    /*Load contact detail*/
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
    /*create dir*/
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
        formData.append("dname", EncodeText(dirname));
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
    /*View file version details*/
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
                $("#bindfileversion").html("");
                $('#modal_docVersionHistory').modal({ show: true });
                //$("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                       // $("#bindfileversion" + valuetoken).empty().html("<tr><td colspan='6' align='center'>No document found</td</tr>");
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
                    //if (checkinouttab == "1") {
                    //    if (cheintb == false) {
                    //        html6 += '<td><span >' + filename + ' (Version - ' + ct + ')</span></td>';
                    //        cheintb = true;
                    //    }
                    //    else {
                    //        html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfiles" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + filename + ' (Version - ' + ct + ')</span></td>';
                    //    }
                    //}
                    //else {
                    //    html6 += '<td><span style="color:#069; cursor:pointer" title="Download File" download="' + a.fname + '" id="downloadfiles" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + filename + ' (Version - ' + ct + ')</span></td>';
                    //}
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
                    html6 += '<tr>';
                    ct = ct - 1;
                });
                $("#bindfileversion").empty().html(html6);
                //$("#bindfileversion" + valuetoken).empty().html(html6);
                //$("#dirtabparentdiv").animate({ scrollTop: $("#dirtabparentdiv").height() }, 1000);
                //console.log(response);
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
    /*Check in file*/
    $(document).on("click", "#checkin", function () {
        validnavigation = true;
        window.onbeforeunload = null;
        var valuetoken = $(this).attr("value");
        var filename = $(this).attr("fname");
        $("#checkinfilename").text(filename);
        $("#checkinfileid").val(valuetoken);
        $('#myModalcheckin').modal({ show: true });
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
            var result = confirm("Are you sure to check-in this file? mykase keeps last 10 versions of this document including the current one. This works on First- In-First -Out Approach.");
            if (result) {
                var tempsize = 0;
                var tottempsize = 0;
                for (var i = 0; i < totalFiles; i++) {
                    var file = document.getElementById("attachmentcheckin").files[i];
                    var filename = file.name;
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
                            alert("File not uploaded for checkin. File name should be:'" + $("#checkinfilename").text() + "'");
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
                            alert("The file (s) you are trying upload seems corrupt or contain some malicious content. Please check the file and try to upload again.");
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
    /*Create new files*/
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
            formData.append("selectedpermission", EncodeText(selected3));
            formData.append("dirname", EncodeText(dname));
            formData.append("details", EncodeText(filedetails));
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
    /*Load file permission details*/
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
    /*Load Directory list details*/
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
            },
            error: function (response) {
            }
        });
    }
    var pageindex = 1, pagesize = totpagesize, recordcount = 0, totrecord = 0;

    /*Get data by page number*/
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
    searchtype = 1;
    /*Search data*/
    $(document).on('click', '#searchdatas', function () {
        /* your code here */
        isCommPopRnd = false;
        $("#clearnewseach").show();
        searchdatac = $('#searchdata').val();
        if (searchdatac.length > 2) {
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
    $(document).on('click', '#clearnewseach', function () {
        isCommPopRnd = false;
        $("#clearnewseach").hide();
        $("#searchdata").val("");
        var txtlength = $("#searchdata").val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                searchtype = 1;
                LoadDirectoryFiles(1, searchtype);
                chksflag = false;
            }
        }
    });
    /*Search data on Keyup*/
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                searchtype = 1;
                LoadDirectoryFiles(1, searchtype);
                chksflag = false;
            }
        }
    });
    /*Get data on page number*/
    $(document).on('click', '#paginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        LoadDirectoryFiles(pageindex, searchtype);
    });
    /*Get document by bruid cumb*/
    function loaddocbruidcumb() {
        $("#bruidcumb").html("");
        var option2 = '<li class="active" style="cusror:pointer;float"><a id="transferpage12" href="javascript:void()" data-val=""><span class="glyphicon glyphicon-folder-close" style="color:#0a61b8"></span> </a> </li>';
        $("#bruidcumb").append(option2);
        var formdata = new FormData();
        var directorytoken = $("#pfile").val();
        formdata.append("dirid", directorytoken);
        $.ajax({
            async: true,
            url: "/api/AzureApi/Bruidcumb",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                }
                var lock = 0;
                var lockvalue = $("#lockunsharefolder").val();
                $.each(obj, function (i, a) {
                    if (lock == 0) {
                        if (String(lockvalue) == String(a.ID)) {
                            lock = 1;
                        }
                    }
                    if (lock == 1) {
                        var ViewFolderName = "";
                        var dirname = a.Name;
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
                        var option = '<li class="active noactive" style="cusror:pointer;"><a id="transferpage" href="javascript:void()" data-val="' + a.ID + '">' + ViewFolderName + '</a></li>';
                        $("#bruidcumb").append(option);
                    }
                });
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    var flaglockdocs = 0;
    /*Transfer on page*/
    $(document).on("click", "#transferpage12", function () {
        flaglockdocs = 0;
        var dataval = $(this).attr("data-val");
        $("#searchdata").val("");
        $("#searchtype").val("1");
        searchtype = 1;
        $("#pfilemain").val("");
        $("#pfile").val("");
        if (dataval == "") {
            LoadDirectoryFiles(1, searchtype);
        }
        else {
            LoadDirectoryFiles(pageindex, searchtype);
        }
    });
    /*Transfer page*/
    $(document).on("click", "#transferpage", function () {
        var dataval = $(this).attr("data-val");
        if (flaglockdocs == 0) {
            $("#lockunsharefolder").val(dataval);
            $("#lockunsharefoldervalue").val(dataval);
            flaglockdocs = 1;
        }
        var datavalmain = $(this).attr("data-valmain");
        var chktempmainid = $("#pfilemain").val();
        if (chktempmainid == "") {
            $("#pfilemain").val(datavalmain);
        }
        $("#pfile").val(dataval);
        $("#searchdata").val("");
        LoadDirectoryFiles(pageindex, searchtype);
    });
    openload();
    LoadDirectoryFiles(pageindex, searchtype);
    // Load DirectoryFiles
    var fcode = localStorage.getItem("FirmCode");
    var urlstype = "";
    var bsurlfile = window.location.origin + "/" + fcode;
    function LoadDirectoryFiles(pageindex) {
        $("#dirbound").html("");
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        formData.append("search", EncodeText($('#searchdata').val()));
        formData.append("searchtype", EncodeText(searchtype));
        formData.append("pfile", EncodeText($("#pfile").val()));
        formData.append("pfilemain", EncodeText($("#pfilemain").val()));
        var html = '';
        var html1 = '';
        var togsum = 0;
        var ajaxTime = new Date().getTime();
        var j1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/AssignUserFileListbyrowid",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("details:" + totalTime);
                //$("#tfooter").html("");
                if (response1.Status == true) {
                    var datas1 = JSON.stringify(response1);
                    var obj = JSON.parse(response1.Data);
                    var length = obj.length;
                    if (length > 0) {
                        $('.pagination').css('display', 'flex');  // To show using flex
                    }
                    else {
                        $('.pagination').css('display', 'none');  // To hide
                    }
                }
                else {
                    $('.pagination').css('display', 'none');  // To hide

                }
                $.each(obj, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;
                    //    var totdata = a.totRow;
                    //    var totpage = 0;
                    //    if (a.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);
                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#pagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<table style="width:100%;background:white"><tr><th colspan = "12">'
                    //    tfot += '<div style="float:left;padding-top: 7px;font-size:13px;">Page Number <b style="font-size:12px;">' + pageindex + '</b>&nbsp;of <b style="font-size:12px;"><span id="sotopage">' + parseInt(totpage) + '</span> Pages</b>'
                    //    tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.rownum + '</b> of <b style="font-size:12px;">' + a.totRow + ' Entries</b>'
                    //    tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;Enter Page No: <input type="number" id="pagnumvalue" min="1"  style="width: 30px; margin: 0 8px 0 0 !Important; background-color: #ebebeb !important; border-radius: 8px !important; height: 22px !important;"><button class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button>'
                    //    tfot += '</div>'
                    //    tfot += '<div style="float:right;">'
                    //    if (a.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<a id="paginate" style="margin-left:10px;" class="btn btn-default btn-sm" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                    //    }
                    //    else {
                    //        tfot += '<a id="paginate" style="margin-left:10px;" class="btn btn-default btn-sm" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a id="paginate" class="btn btn-default btn-sm" title="Next Page" href="javascript:void()" index="' + pnext + '" style="margin-left:10px;" >Next <i class="glyphicon glyphicon-chevron-right"></i></a></div >'
                    //    }
                    //    tfot += '</th>'
                    //    tfot += '</tr>'
                    //    $("#tfooter").append(tfot);
                    //    closeload();
                    //}
                    var totdata = a.totRow;
                    $("#docTotalSharedCount").text("(" + a.totRow + ")");
                    var totpage = 0;
                    if (i === (length - 1)) {
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        //$("#invpagnumvalue").attr("max", totdata);
                        if (pageindex == totpage) {
                            $('#PopNext').hide();
                            $('#PopPrev').css("display", "block");
                        }
                        else {
                            $('#PopNext').css("display", "block");
                        }
                        if (pageindex == 1) {
                            $('#PopPrev').css("display", "none");
                        }
                        else {
                            $('#PopPrev').css("display", "block");
                        }

                        if (isCommPopRnd == false) {
                            RenderPagination(pageindex, totpage);
                        }
                    }
                    if (String(a.ftype) == "1") {
                        try {
                            var permission = String(a.ppermission);
                            var n = permission.indexOf("3");
                            if (n != "") {
                                var ncss = "display:unset";
                            }
                            if (n.toString() == "-1") {
                                var ncss = "display:none";
                            }
                            var dates2 = a.date_time;
                            var dates1 = formatDatetoIST(dates2);
                            var ficon = "file.svg";
                            var icolor = "black";
                            var str = a.filetype;
                            var rest = str.substring(0, str.lastIndexOf(".") + 1).toUpperCase();
                            var last = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase() + " File";
                            var ftype = str.substring(str.lastIndexOf(".") + 1, str.length).toUpperCase();
                            if (ftype == "DOC" || ftype == "DOCX") {
                                ficon = "doc-icon.svg";
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
                                ficon = "txt_icon.svg";
                                icolor = "skyblue";
                            }
                            var editiconfilecheckcss = "display:none";
                            if (ftype == "DOC" || ftype == "DOCX") {
                                editiconfilecheckcss = "";
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
                            var dirname = a.fname;
                            togsum = togsum + 1;
                            var n1 = permission.indexOf("2");
                            if (n1 != "" || n1 == "0") {
                                if (ftype == "DOC" || ftype == "DOCX") {
                                    var openpath = bsurlfile + '/Docs/ViewSamplecloud?mode=Edit&fileName=' + a.fname + '&dname=' + a.FileId + '&ftoken=' + a.firmId + '&utoken=' + a.Userid + '&token=' + a.FileId + '&verifyurl=' + window.location.pathname.split("/").pop() + '&sharedfolder=' + $("#pfilemain").val();
                                    var idtemp = "idss";
                                    var pointer = "cursor:pointer";
                                    urlstype = "";
                                }
                                else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "PPT" || ftype == "PPTX") {
                                    var pageURL1 = window.location.origin;
                                    if (a.FullDirPath != null) {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + String(a.FullDirPath).slice(0, -1) + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                    }
                                    else {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                    }
                                    var idtemp = "idss";
                                    var pointer = "cursor:pointer";
                                    urlstype = "office";
                                }
                                else {
                                    var pageURL1 = window.location.origin;
                                    if (a.FullDirPath != null) {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + String(a.FullDirPath).slice(0, -1) + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                        urlstype = "";
                                    }
                                    else {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                    }
                                    var idtemp = "idss";
                                    var pointer = "cursor:pointer";
                                    urlstype = "docs";
                                }
                            }
                            if (n1.toString() == "-1") {
                                if (ftype == "DOC" || ftype == "DOCX") {
                                    var openpath = bsurlfile + '/Docs/ViewSamplecloud?mode=view&fileName=' + a.fname + '&dname=' + a.dirid + '&ftoken=' + a.firmId + '&utoken=' + a.Userid + '&token=' + a.FileId + '&verifyurl=true&sharedfolder=' + $("#pfilemain").val();
                                    var idtemp = "idss";
                                    var pointer = "cursor:pointer";
                                    urlstype = "";
                                }
                                else if (ftype == "CSV" || ftype == "XLSX" || ftype == "XLS" || ftype == "PPT" || ftype == "PPTX") {
                                    var pageURL1 = window.location.origin;
                                    if (a.FullDirPath != null) {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + String(a.FullDirPath).slice(0, -1) + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                    }
                                    else {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                    }
                                    var idtemp = "idss";
                                    var pointer = "cursor:pointer";
                                    urlstype = "office";
                                }
                                else {
                                    var pageURL1 = window.location.origin;
                                    if (a.FullDirPath != null) {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + String(a.FullDirPath).slice(0, -1) + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                        urlstype = "";
                                    }
                                    else {
                                        var downloadpath = "/WorkSpace/" + a.firmId + "/" + a.Userid + "/" + a.fname;
                                        openpath = enctypesingle(downloadpath);
                                    }
                                    var idtemp = "idss";
                                    var pointer = "cursor:pointer";
                                    urlstype = "docs";
                                }
                            }
                            if (String(downloadpath).indexOf('null/') > -1) {
                                downloadpath = downloadpath.replace("null/", "");
                            }
                            if (String(openpath).indexOf('null/') > -1) {
                                openpath = openpath.replace("null/", "");
                            }
                            var downloadpath = "/Azure/GetDownloadFile?filename=" + a.fname + "&code=" + a.AZureFIleId + "&token=" + a.FileId + "";
                            var checkoutpath = "/Azure/CheckoutFile?filename=" + a.fname + "&code=" + a.AZureFIleId + "&token=" + a.FileId + "";
                            var chkincss = "";
                            var chkoutcss = "";
                            if (a.IsCheckinOut == "1") {
                                chkoutcss = "display:none";
                                chkincss = "display:inline-block";
                            }
                            else {
                                chkoutcss = "display:inline-block";
                                chkincss = "display:none";
                            }
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
                            html += '<tr>';
                            html += '<td class="7"><div style="display: flex; align-items:center; gap: 8px;"><img width="32px" height="32px" src="/newassets/img/' + ficon  +'"/><span id-val="' + a.ppermission + '" style="' + pointer + '" id="' + idtemp + '" value="' + last + '" href="' + openpath + '" code="' + a.AZureFIleId + '" urltype="' + urlstype + '"> ' + a.fname + '</span></a></div>';
                            //if (roleid != "3") {
                            //    if (permission.indexOf("2") != -1 && a.IsCheckinOut != "1") {
                            //        html += '<img id-val="' + a.ppermission + '"  id="' + idtemp + '" value="' + last + '" href="' + openpath + '" code="' + a.AZureFIleId + '" urltype="' + urlstype + '" src="/newassets/images/fileedit_icon.png" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" />'
                            //    }
                            //    html += '<div class="pull-right">';
                            //    html += '<div class="btn-group" >';
                            //    html += '<button type="button"  title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.FileId + '" filename="' + a.fname + '" class="btn-viewdv  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                            //    html += '<span><img src="/newassets/img/version-icon.png" /></span>';
                            //    html += '<span class="sr-only">Toggle Dropdown</span>';
                            //    html += '</button>';
                            //    html += '<div class="dropdown-menu"  style="width:600px;margin:0;padding:0px 8px;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">';
                            //    html += '<table class="table-panel" width="100%"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Created By</th><th>Last Modified By</th><th>File Version</th></tr></thead>'
                            //    html += '<tbody id="bindfileversion' + a.FileId + '" >';
                            //    html += '</tbody>';
                            //    html += '</table>';
                            //    html += '</div>';
                            //    html += '</div>';
                            //    html += '</div>';
                            //}
                            html += '</td>';
                            if (a.mattername == "null" || a.mattername == null || a.mattername == '') {
                                html += '<td width="100px; ">&nbsp;</td>';
                            }
                            else {
                                html += '<td width="100px; ">' + a.mattername + '</td>';
                            }
                            html += '<td width="100px; ">' + dates1 + '</td>';
                            html += '<td>' + last + '</td>';
                            html += '<td>' + a.FileSize + '</td>';
                            html += '<td>';
                            if (roleid == "3") {
                            }
                            else {
                                if (String(a.CheckoutUser).toLowerCase() == String(userid).toLowerCase()) {
                                    if (a.mattername == "") {
                                        if (permission.indexOf("2") != -1) {
                                            if (a.IsCheckinOut == "1") {
                                                html += '<span style="' + chkincss + '" class="checkin1 checkin' + a.FileId + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.FileId + '">Checkin <img src="/newassets/img/right_arrow.svg"></span></span></td>';
                                            }
                                            else {
                                                html += '<span style="' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout  checkout' + a.FileId + '" id="checkout" value="' + a.FileId + '">Check Out <img src="/newassets/img/right_arrow.svg"></span></td>';
                                            }
                                        }
                                    }
                                    else {
                                        if (a.oedit == "1") {
                                            if (permission.indexOf("2") != -1) {
                                                if (a.IsCheckinOut == "1") {
                                                    html += '<span style="' + chkincss + '" class="checkin1 checkin' + a.FileId + '" title="Upload the new version of file post edit" fname="' + a.fname + '" id="checkin" value="' + a.FileId + '">Checkin <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                                }
                                                else {
                                                    html += '<span  style="' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout  checkout' + a.FileId + '" id="checkout" value="' + a.FileId + '">Check Out <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (a.mattername == "") {
                                        if (permission.indexOf("2") != -1) {
                                            if (a.IsCheckinOut == "1") {
                                                html += '<span class="inuse" style="' + chkincss + '"  title=" File In Use for editing by ' + a.CheckoutUserName + '" >In Use</span></td>';
                                            }
                                            else {
                                                html += '<span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.FileId + '" id="checkout" value="' + a.FileId + '">Check Out <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                            }
                                        }
                                    }
                                    else {
                                        if (a.oedit == "1") {
                                            if (permission.indexOf("2") != -1) {
                                                if (a.IsCheckinOut == "1") {
                                                    html += '<span style="' + chkincss + '"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use<img src="/newassets/img/right_arrow.svg" /></span></td>';
                                                }
                                                else {
                                                    html += '<span' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout checkout' + a.FileId + '" id="checkout" value="' + a.FileId + '">Check Out <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                                }
                                            }
                                        }
                                        else {
                                        }
                                    }
                                    if (a.oedit == "1") {
                                        if (permission.indexOf("2") != -1) {
                                            if (a.IsCheckinOut == "1") {
                                                html += '<span style="inuse ' + chkincss + '"  title=" File In Use for editing  by ' + a.CheckoutUserName + '" >In Use</span></td>';
                                            }
                                            else {
                                                html += '<span style="cursor:pointer;' + chkoutcss + '" href-val="' + checkoutpath + '" title="Download the file for OFFLINE Editing" class="checkout' + a.FileId + '" id="checkout" value="' + a.FileId + '">Check Out <img src="/newassets/img/right_arrow.svg" /></span></td>';
                                            }
                                        }
                                    }
                                }
                            }
                            html += '</td>';
                            
                            html += '<td><ul class="table_action" style="justify-content: flex-start;">';
                            if (permission.indexOf("4") != -1) {
                                html += '<li><span class="taskoutboxbtnicon"><a title="Download" download="' + a.fname + '" id="downloadfile" href="' + downloadpath + '" values="' + a.id + '"> <img src="/newassets/img/download.svg" width="21px" /></a></span> </li>';
                            }
                            if (permission.indexOf("3") != -1) {
                                html += '<li><span class="taskoutboxbtnicon" data-toggle="modal" id="removedirfile" data-inuser="' + validateforinuse + '" directnamefull="' + downloadpath + '" value="' + a.id + '" pathid="path' + a.id + '"><img src="/newassets/img/darkdelete.svg" /> </span></li>';
                            }
                            if (permission.indexOf("1") != -1) {
                                html += '<li title="View File"><span class="taskoutboxbtnicon" id-val="' + a.ppermission + '" style="' + pointer + '" id="' + idtemp + '" value="' + last + '" href="' + openpath + '" code="' + a.AZureFIleId + '" urltype="' + urlstype + '"><img src="/newassets/img/eye.svg" /></span></li>';
                            }
                            //try to write below
                            if (permission.indexOf("4") != -1 || permission.indexOf("3") != -1 || permission.indexOf("1") != -1) {
                                if (roleid != "3") {
                                    html += ' <li><div class="input-group-btn"><button style="border-radius: 4px;" class="taskoutboxbtnicon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/newassets/img/dots-vertical.svg" alt="action button"></button><ul class="dropdown-menu">'
                                    if (permission.indexOf("2") != -1 && a.IsCheckinOut != "1") {
                                        html += '<li><span id-val="' + a.ppermission + '"  id="' + idtemp + '" value="' + last + '" href="' + openpath + '" code="' + a.AZureFIleId + '" urltype="' + urlstype + '" title="Click on file name to Edit ONLINE on the cloud"  style="margin-left:5px; margin-top:-5px;cursor:pointer;' + editiconfilecheckcss + '" height="15px" width="13px" ><img src="/newassets/img/editmatter.png" />Edit Document</span></li>'
                                    }
                                    html += '<li><span class="action_one" title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;"><img src="/newassets/img/versionHi.png"/>Version History</span></li>'
                                    html += '</div>'
                                }
                            }
                            else {
                                html += '<li><span class="taskoutboxbtnicon" title="Click here to view document version" checkinouttab="' + a.IsCheckinOut + '" id="viewfileversion" token="' + a.id + '" filename="' + a.fname + '" class="btn-viewdv dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;"><img src="/newassets/img/versionHi.png"/></span></li>'
                            }
                            
                           
                            html +='</ul></td>'
                            html += '<td>' + a.assignby + '</td></tr>';
                        }
                        catch (err) {
                            alert(err.message);
                        }
                    }
                    else {
                        try {
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
                            var folderperm = "";
                            html += '<tr>';
                            html += '<td><div style="display: flex; align-items:center; gap: 8px;"><img height="32px" width="32px" src="/newassets/img/file_blue.svg" /><a id="transferpage" href="javascript:void()" data-val="' + a.FileId + '" data-valmain="' + a.FileId + '" style="color: black"><span>' + ViewFolderName + '<span></a></div></td>';
                            html += '<td>' + a.mattername + '</td>';
                            html += '<td>' + formatDatetoIST(a.date_time) + '</td>';
                            html += '<td></td><td></td><td></td>';
                            if (a.ppermission.indexOf("1") != -1) {
                                folderperm += '<span class="view_badge">View</span>';
                            }
                            if (a.ppermission.indexOf("2") != -1) {
                                folderperm += '<span class="view_badge">Edit</span>';
                            }
                            if (a.ppermission.indexOf("4") != -1) {
                                folderperm += '<span class="view_badge">Download</span>';
                            }
                            if (a.ppermission.indexOf("3") != -1) {
                                folderperm += '<span class="view_badge">Remove</span>';
                            }

                            html += '<td>' + folderperm + '</td>';
                            html += '<td>' + a.assignby + '</td>';
                            html += '</tr>';
                        }
                        catch (err) {
                            alert(err.message);
                        }
                    }
                });
                $("#dirbound").append(html);
                $("#searchdatas").removeAttr("disabled");
                loaddocbruidcumb();
                closeload();
            },
        });
    }
    /*Shared document Pagination Start*/
    var isCommPopRnd = false;
    //function RenderPagination(pageindex, totdata) {
    //    let totPages = totdata;
    //    let paginationHtml = '';
    //    let maxVisible = 4;

    //    if (totdata <= maxVisible + 2) {
    //        for (let i = 1; i <= totPages; i++) {
    //            paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //        }
    //    } else {
    //        if (pageindex <= maxVisible) {
    //            for (let i = 1; i <= maxVisible; i++) {
    //                paginationHtml += `<button class="page-btncommPop ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //            }
    //            paginationHtml += `<span>.......</span>`;
    //            for (let j = totPages - 3; j <= totPages; j++) {
    //                paginationHtml += `<button class="page-btncommPop ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
    //            }
    //        }
    //    }
    //    $("#popUpPageNumbers").html(paginationHtml);
    //    isCommPopRnd = true;
    //}
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
    //    pageindex = page;
    //    isCommPopRnd = true;
    //    $("#poptxtgopage").val("");
    //    LoadDirectoryFiles(pageindex);
    //    $(".page-btncommPop").removeClass("active");
    //    $(this).addClass("active");
    //});
    var setPageNo = 1;
    $(document).on("click", ".page-btncommPop", function () {
        let page = $(this).data("page");
        setPageNo = page;
        pageindex = page;
        //if (page) changePage(page);
        isCommPopRnd = false;
        $("#poptxtgopage").val("");
        LoadDirectoryFiles(pageindex);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#PopPrev", function () {
    //    if (pageindex > 1) {
    //        pageindex = pageindex - 1;
    //    }
    //    isCommPopRnd = true;
    //    $("#poptxtgopage").val("");
    //    LoadDirectoryFiles(pageindex);

    //    $(".page-btncommPop").removeClass("active");
    //    $(".page-btncommPop[data-page='" + pageindex + "']").addClass("active");
    //});

    $(document).on("click", "#PopPrev", function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isCommPopRnd = false;
        $("#poptxtgopage").val("");
        pageindex = setPageNo;

        //renderPagination(setPageNo, totalPageRec)
        LoadDirectoryFiles(pageindex);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#PopNext", function () {
    //    if (pageindex => 1) {
    //        pageindex = pageindex + 1;
    //    }
    //    isCommPopRnd = true;
    //    $("#poptxtgopage").val("");
    //    LoadDirectoryFiles(pageindex);

    //    $(".page-btncommPop").removeClass("active");
    //    $(".page-btncommPop[data-page='" + pageindex + "']").addClass("active");
    //});


    $(document).on("click", "#PopNext", function ()  {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isCommPopRnd = false;
        pageindex = setPageNo;

        $("#poptxtgopage").val("");
        LoadDirectoryFiles(pageindex);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });

    //$(document).on("click", "#divpopGo", function () {
    //    let goToPage = parseInt($("#poptxtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        pageindex = goToPage;
    //    }
    //    isCommPopRnd = true;
    //    LoadDirectoryFiles(pageindex);

    //    $(".page-btncommPop").removeClass("active");
    //    $(".page-btncommPop[data-page='" + pageindex + "']").addClass("active");
    //});
    $(document).on("click", "#divpopGo", function (){
        let goToPage = parseInt($("#poptxtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        pageindex = setPageNo;
        isCommPopRnd = false;
        LoadDirectoryFiles(pageindex);
        $(".page-btncommPop").removeClass("active");
        $(".page-btncommPop[data-page='" + setPageNo + "']").addClass("active");
    });



    /*Shared document Pagination End*/


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
        var urltypes = $(this).attr("urltype");
        var codes = $(this).attr("code");
        var permission = $(this).attr("id-val");
        var ppermission = String(permission);
        var n = ppermission.indexOf("2");
        //alert(n);
        if (value == "DOCX File" || value == "DOC File") {
            if (n == -1) {
                $('#spanhead').html("View File");
            }
            else {
                $('#spanhead').html("Edit File");
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
                    //$('#otherdocframeobject').attr('data', response.Data);
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