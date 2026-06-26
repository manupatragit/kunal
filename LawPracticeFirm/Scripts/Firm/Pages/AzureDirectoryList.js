$(document).ready(function () {
    $("#hiddenpath").val("");
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var fcode = localStorage.getItem("FirmCode");
    var codes = "";
    /*Save drftbox details*/
    $(document).on("click", "#savedropbox", function () {
        var link = $(this).attr("href");
        var dpcode = $(this).attr("code");
        var formdata = new FormData();
        formdata.append("filename", link);
        formdata.append("code", dpcode);
        formdata.append("baseurl", window.location.origin);
        $.ajax({
            async: true,
            url: '/Azure/Dirfilepath',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var urldropbox = "/firm/dropbox?status=true&token=" + window.location.origin + response;
                $('#dropboxframe').attr('src', urldropbox);
                $('#myModaldropbox').modal({ show: true });
            },
            error: function () {
                alert('Error!');
            }
        });
    });
    /*Open azure directory folder*/
    $(document).on("click", "#openfolder", function () {
        var codes = $(this).attr("code");
        $("#bruidcumblist").html("");
        var brdcmb = ''
        var brdcmbtemp = ''
        var brdcmbfnl = ''
        $("#hiddenpath").val(codes);
        var strArray = codes.split("/");
        for (var i = 0; i < strArray.length; i++) {
            if (i < 3) {
                brdcmbtemp += '' + strArray[i] + '/'
            }
            if (i > 2) {
                if (brdcmbfnl == "") {
                    brdcmbfnl = brdcmbfnl + strArray[i];
                }
                else {
                    brdcmbfnl = brdcmbfnl + '/' + strArray[i];
                }
                brdcmb += '<span href="javascript:void()" title="click here to open ' + strArray[i] + '" class="btn" id="openfolder" style="cursor:pointer" code="' + brdcmbtemp + brdcmbfnl + '">' + strArray[i] + '</span> > '
            }
        }
        $("#bruidcumblist").html(brdcmb);
        filelist(codes);
        return false;
    });
    filelist(codes);
    /*Get azure file list*/
    function filelist(codes) {
        if ($.fn.DataTable.isDataTable("#example")) {
            $('#example').DataTable().clear().destroy();
        }
        $("#assignuserdata").html("");
        var html = '';
        var formData = new FormData();
        formData.append("code", codes);
        //read assign using list
        qty1 = 0;
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/Azure/AzureList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                $("#dirbound").html("");
                if (data == "") {
                    $('#example').DataTable({
                        "pagingType": "full_numbers"
                    });
                    closeload();
                    return false;
                }
                $("#notfound").html("");
                $.each(data, function (i, a) {
                    qty1 = qty1 + 1;
                    if (a.FileFolder == false) {
                        html += '<tr><td>' + qty1 + '</td><td title="click here to open folder"><a href="javascript:void()"id="openfolder" code="' + a.srcPath + '"><span class="glyphicon glyphicon-folder-open" style="color:orange"></span> &nbsp; &nbsp;' + a.blobName + '</td>'
                        html += '</td> <td><a href="javascript:void()" title="Remove Folder" style="color:red" code="' + a.srcPath + '" id="DeleteFolder" dpath="' + a.destinationPath + '"><span class="glyphicon glyphicon-trash"></span></btn></td > <td></td></tr > ';
                    }
                    else {
                        var filename = a.blobName;
                        var ficon = "";
                        var icolor = "";
                        var ftype = filename.substring(filename.lastIndexOf('.') + 1);
                        ftype = ftype.toUpperCase();
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
                            ficon = "fa fa-file";
                            icolor = "black";
                        }
                        html += '<tr><td>' + qty1 + '</td><td><span class="' + ficon + '" style="color:' + icolor + '"></span>&nbsp;&nbsp; &nbsp; &nbsp;' + a.blobName + '</td>'
                        html += '</td> <td><a href="javascript:void()" title="Remove document" style="color:red" code="' + a.srcPath + '" id="DeleteFile" dpath="' + a.destinationPath + '"><span class="glyphicon glyphicon-trash"></span></a> &nbsp;&nbsp;<a href="/' + fcode + '/azure/DownloadFile/?status=true&filename=' + a.blobName + '&code=' + a.srcPath + '" target="_blank" title="Download document" style="color:green"  id="DownloadFile" ><span class="glyphicon glyphicon-download"></span></a>&nbsp;&nbsp;&nbsp;<span id="savedropbox" href="' + a.blobName + '" code="' + a.srcPath + '" class="glyphicon glyphicon-cloud-upload" style="color: #1da1ce;font-size:15px;cursor:pointer" title="Upload document to Cloud Server(Dropbox/Google Drive)"></span>&nbsp;&nbsp;&nbsp;<btn class="btn btn-warning btn-sm" style="margin-top:0px;" title="Assign document to users." data-toggle="modal" id="permopen" value="' + a.srcPath + '" valuename="' + a.blobName + '"></span> Assign</btn></td > <td>' + ftype + ' File</td></tr >';
                    }
                });
                $("#dirbound").append(html);
                $('#example').DataTable({
                    "pagingType": "full_numbers"
                });
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
    loadcontact();
    /*Load contact details*/
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
                    //alert(datas);
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
    /*Assign azure file permission*/
    $(document).on("click", "#assign", function () {
        var fid = $("#directoryid").text();
        var filename = $("#directoryname").text();
        var user = $("#contact").val();
        var result = confirm("Are you sure to assign this File?");
        if (result) {
            if ($("#contact").val() == "") {
                alert("select user.");
                return false;
            }
            var formData = new FormData();
            formData.append("did", fid);
            formData.append("user", user);
            formData.append("filename", filename);
            $.ajax({
                async: true,
                type: "POST",
                url: "/Azure/AssignFilePermission",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == "1") {
                        new PNotify({
                            title: 'Success!',
                            text: ' File Assigned Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $('#contact').get(0).selectedIndex = 0;
                        showuserassignefiledata();
                    }
                    else if (data == "nouser") {
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
    /*Show user asssign file data*/
    function showuserassignefiledata() {
        $("#assignuserdata").html("");
        var html = '';
        var fileid = $("#directoryid").text();
        var filename = $("#directoryname").text();
        var formData = new FormData();
        formData.append("Id", fileid);
        formData.append("filename", filename);
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/Azure/AssignFilePerUserList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $.each(response1, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td>' + qty1 + '</td><td>' + a.FileName + '</td><td>' + formatDatetoIST(a.date_time) + '</td><td>' + a.username + '</td><td ><button type="button" class="btn btn-danger btn-sm" id="revertassign" val-id="' + a.Id + '">Revert Permission</button></td></tr>';
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
    /*Revert file permission*/
    $(document).on("click", "#revertassign", function () {
        var sfid = $(this).attr("val-id");
        var result = confirm("Are you sure to un-assign this File?");
        if (result) {
            var formData = new FormData();
            formData.append("did", sfid);
            $.ajax({
                async: true,
                type: "POST",
                url: "/Azure/RevertAssignFile",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (String(data) == "Object reference not set to an instance of an object.") {
                        alert("You can not revert assign because this file assigned by admin");
                        closeload();
                        return false;
                    }
                    var datas1 = JSON.stringify(data);
                    new PNotify({
                        title: 'Success!',
                        text: ' File Assign Reverted Successfully',
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
    /*Show assign file data*/
    $(document).on("click", "#permopen", function () {
        var t = $(this).attr("value");
        var tn = $(this).attr("valuename");
        $('#contact').prop('selectedIndex', 0);
        $("#directoryname").html(tn);
        $("#directoryid").html(t);
        $('#myModalperm').modal({ show: true });
        showuserassignefiledata();
    });
    /*Create file directory*/
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
        formData.append("foldername", dirname);
        formData.append("hiddenpath", $("#hiddenpath").val());
        if (dirname != "") {
            openload();
            $.ajax({
                async: true,
                url: '/api/AzureApi/Azurecreatefolder',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "success") {
                        alert("Folder created successfully.");
                        filelist($("#hiddenpath").val());
                        $("#cdir").val("");
                        closeload();
                        return false;
                    }
                    else if (String(response) == "exist") {
                        alert("Folder already exists.");
                        closeload();
                        return false;
                    }
                    else {
                        alert(response);
                        closeload();
                        return false;
                    }
                },
                error: function () {
                    alert('Error!');
                    closeload();
                }
            });
        }
    });
    /*Create azure file*/
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
                formData.append("FileUpload", file);
                try {
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tempsize = parseFloat(tempsize) + parseFloat(size);
                    }
                }
                catch (err) {
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
            formData.append("hiddenpath", $("#hiddenpath").val());
            openload();
            $.ajax({
                async: true,
                url: '/Azure/Upload',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (String(response) == "success") {
                        alert("File uploaded successfully.");
                        $("#fileupload")[0].reset();
                        filelist($("#hiddenpath").val());
                        closeload();
                        return false;
                    }
                    if (String(response) == "exist") {
                        alert("this file has already exist");
                        closeload();
                        return false;
                    }
                    else {
                        alert(response);
                        closeload();
                        return false;
                    }
                },
                error: function () {
                    closeload();
                    alert('Error!');
                }
            });
        }
    });
    /*Delete azure file folder*/
    $(document).on("click", "#DeleteFolder", function () {
        var formData = new FormData();
        formData.append("code", $(this).attr("code"));
        formData.append("Name", $(this).attr("dpath"));
        openload();
        $.ajax({
            async: true,
            url: '/Azure/DeleteFolder',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (String(response) == "success") {
                    alert("Folder removed successfully.");
                    filelist($("#hiddenpath").val());
                    closeload();
                    return false;
                }
                else {
                    alert(response);
                    closeload();
                    return false;
                }
            },
            error: function () {
                alert('Error!');
                closeload();
            }
        });
    });
    /*Delete file*/
    $(document).on("click", "#DeleteFile", function () {
        var formData = new FormData();
        formData.append("code", $(this).attr("code"));
        formData.append("Name", $(this).attr("dpath"));
        openload();
        $.ajax({
            async: true,
            url: '/Azure/DeleteFile',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (String(response) == "success") {
                    alert("File removed successfully.");
                    filelist($("#hiddenpath").val());
                    closeload();
                    return false;
                }
                else {
                    alert(response);
                    closeload();
                    return false;
                }
            },
            error: function () {
                alert('Error!');
                closeload();
            }
        });
    });
});