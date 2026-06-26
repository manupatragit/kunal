function fileValidation() {
}
$(document).ready(function () {
    var orderItemsBrowse = [];
    var firstopenbrowse = true;
    //browse file open modal
    $(document).on("click", ".browsetaskfiledynamic", function () {
        $(".browsetaskfiledynamic").attr("title", "No file chosen");
        var tvalues = $(this).attr("values");
        var tmodule = $(this).attr("module");
        $("#mykasefilemodulename").val(tmodule);
        orderItemsBrowse = [];
        orderItemsBrowse.length = 0;
        GeneratedBrowseList();
        $("input:checkbox.loadbrowsedirlist").prop('checked', false);
        // $(".validpanel").css("display", "none");
        if (firstopenbrowse == true) {
            var defaultdid = 0;
            //openload1();
            var url = "/Azure/BrowseDirList/" + defaultdid + "?sttus=true&type=folder&module=" + tmodule;
            $('.loadbrowsedirlist').load(url, function (result) {
                closeload();
                $('#myModalbrowsedocs').modal({ show: true });
                firstopenbrowse = false;
            });
        }
        else {
            $('#myModalbrowsedocs').modal({ show: true });
        }
    });
    $(".browsetaskfile").click(function () {
        $(".browsetaskfile").attr("title", "No file chosen");
        var tvalues = $(this).attr("values");
        var tmodule = $(this).attr("module");
        $("#mykasefilemodulename").val(tmodule);
        orderItemsBrowse = [];
        orderItemsBrowse.length = 0;
        GeneratedBrowseList();
        $("input:checkbox.loadbrowsedirlist").prop('checked', false);
        if (firstopenbrowse == true) {
            var defaultdid = 0;
            var url = "/Azure/BrowseDirList/" + defaultdid + "?sttus=true&type=folder&module=" + tmodule;
            $('.loadbrowsedirlist').load(url, function (result) {
                closeload();
                $('#myModalbrowsedocs').modal({ show: true });
                firstopenbrowse = false;
            });
        }
        else {
            $('#myModalbrowsedocs').modal({ show: true });
        }
    });

    /*Bind pdf drive*/
    function BundlePDFDrive(bundlepdf) {
        openload();
        var formData = new FormData();
        formData.append("savemykasefileid", EncodeText($("#mykasefileidbundlepdf").val()));
        $.ajax({
            async: true,
            type: "POST",
            url: "/PDFMerge/UploadDrive",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != null) {
                    var path = data;
                    if (data == "FileAttachExceed") {
                        alert("Sorry! You have added more than 25 file. Pls remove some file(s)");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    else if (data == "NoFileAttach") {
                        alert("Please select the file to be uploaded.");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    else if (data == "ExtentionNotAllowed") {
                        alert("Please upload file having extensions .pdf only.");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    else if (data == "FileSizeExceed") {
                        alert("Document size greater than 20 MB cannot be accepted");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    var str = data;
                    var myarray = String(str).split(',');
                    for (var i = 0; i < myarray.length; i++) {
                        var filename = myarray[i];
                        $('#uploadedFiles').append(filename + '<br />')
                        strfilename = strfilename + filename + ',';
                        $('#hidfilename').val(strfilename);
                        $('#btnMerge').show();
                        $('#btnSaveChanges').hide();
                        $('#txt').hide();
                        $("#selected").show();
                        $("#priority").show();
                        $('#selected-items-select').append(new Option(filename, filename));
                    }
                    closeload();
                }
                else {
                    closeload();
                }
            },
            error: function (data) {
                closeload();
            }
        });
    }

    /*Compare two attchment*/
    function compareattachonetwo(curentmodulefilename, urlscompare, type) {
        openload();
        var formData = new FormData();
        formData.append("savemykasefileid", $("#mykasefileid" + curentmodulefilename).val());
        $.ajax({
            async: true,
            type: "POST",
            url: urlscompare,
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Result != null) {
                    var path = data.Result;
                    if (data.Result == "FileAttachExceed") {
                        alert("Sorry! You have added more than 1 file. Pls remove some file(s)");
                        closeload();
                        return false;
                    }
                    else if (data.Result == "NoFileAttach") {
                        alert("Please select the file to be uploaded.");
                        closeload();
                        return false;
                    }
                    else if (data.Data == "ExtentionNotAllowed") {
                        alert("Please upload file having extensions .doc/.docx/.pdf only.");
                        closeload();
                        return false;
                    }
                    else if (data.Data == "FileSizeExceed") {
                        alert("Document size greater than 20 MB cannot be accepted");
                        closeload();
                        return false;
                    }
                    var returnpath = "https://view.officeapps.live.com/op/view.aspx?src=" + path;
                    var filext1 = path.substr((path.lastIndexOf('.') + 1));
                    if (filext1.toLowerCase() == "doc" || filext1.toLowerCase() == "docx") {
                        $('#frmFile' + type).attr('src', returnpath);
                    }
                    else {
                        $('#frmFile' + type).attr('src', path);
                    }
                    file1 = path;
                    closeload();
                }
                else {
                    closeload();
                }
            },
            error: function (data) {
                closeload();
            }
        });
    }

    /*Open browse folder*/
    var filenamesstring = [];
    $("#Openbrowsefolder").click(function () {
        $("#myModalbrowsedocs").modal("hide");
        filenamesstring = [];
        fileidstring = [];
        var tempfilenames = "";
        var curentmodulefilename = $("#mykasefilemodulename").val();
        if (orderItemsBrowse.length > 0) {
            $.each(orderItemsBrowse, function (i, val) {
                filenamesstring.push(val.Name);
                fileidstring.push(val.Id);
                tempfilenames = val.Name;
            });
            $("#browsefile" + curentmodulefilename).attr("title", orderItemsBrowse.length + " files selected. | FileName: " + JSON.stringify(filenamesstring));
            if (orderItemsBrowse.length > 1) {
                $("#browsefilelbl" + curentmodulefilename).html(orderItemsBrowse.length + " files");
            }
            else {
                var length = 18;
                var string = tempfilenames;
                var trimmedString = string.length > length ? string.substring(0, 7) + "..." + string.substring(string.length - 9, string.length) : string;
                $("#browsefilelbl" + curentmodulefilename).html(trimmedString);
            }
            $("#mykasefileid" + curentmodulefilename).remove();
            $('#hiddenlist').append('<input type="text" name="mykasefileid' + curentmodulefilename + '" id="mykasefileid' + curentmodulefilename + '" value="' + fileidstring + '" />');
            if (String(curentmodulefilename) == "compareattachone") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");
            }
            else if (String(curentmodulefilename) == "compareattachtwo") {
                var urlcmopare12 = "/Compare/UploadFileFromDrive2"
                compareattachonetwo(curentmodulefilename, urlcmopare12, "two");
            }
            else if (String(curentmodulefilename) == "bundlepdf") {
                BundlePDFDrive(curentmodulefilename);
            }
        }
        else {
            $("#browsefile" + curentmodulefilename).attr("title", "No file chosen");
            $("#browsefilelbl" + curentmodulefilename).html("No file chosen");
            $("#mykasefileid" + curentmodulefilename).val("");
        }
    });
    $(document).on("click", ".cancelbrowse", function () {
        orderItemsBrowse = [];
        orderItemsBrowse.length = 0;
        $("input:checkbox.loadbrowsedirlist").prop('checked', false);
        var curentmodulefilename = $("#mykasefilemodulename").val();
        $("#browsefile" + curentmodulefilename).attr("title", "No file chosen");
        $("#browsefilelbl" + curentmodulefilename).html("No file chosen");
        $("#mykasefileid" + curentmodulefilename).val("");
        GeneratedBrowseList();
    });
    $(document).on("click", "#loadbrowsedirlist", function () {
        if ($(this).prop('checked')) {
            var vdata = $(this).attr("dir-val");
            var vname = $(this).attr("dir-name");
            insertUniqueObject(orderItemsBrowse, vdata, vname)
            GeneratedBrowseList();
        }
        else {
            var vdata = $(this).attr("dir-val");
            var vname = $(this).attr("dir-name");
            RemoveUniqueObject(orderItemsBrowse, vdata, vname)
            GeneratedBrowseList();
        }
        // });
    });
    var insertUniqueObject = function (arr, vdata, vname) {
        let isExist = arr.some(o => o.Name === vname && o.Id === vdata);
        if (!isExist)
            arr.push({
                Name: vname,
                Id: vdata,
                Module: "",
            });
        return arr;
    }
    var RemoveUniqueObject = function (arr, vdata, vname) {
        let isExist = arr.some(o => o.Name === vname && o.Id === vdata);
        if (isExist)
            var index = arr.findIndex(o => o.Name === vname && o.Id === vdata);
        arr.splice(index, 1);
        return arr;
    }

    /*Generate browser list*/
    function GeneratedBrowseList() {
        if (orderItemsBrowse.length > 0) {
            var $table4 = $('<table id="tablebrowseselect" class="table-panel"/>');
            $table4.append('<thead><tr><th>Name</th><th style="text-align:center;">Action</th></thead>');
            var $tbody4 = $('<tbody/>');
            $.each(orderItemsBrowse, function (i, val) {
                var $row4 = $('<tr/>');
                $row4.append($('<td/>').html(val.Name));
                var $remove4 = $('<a href="#" style="display:block; text-align:center;"><img src="/newassets/img/darkdelete.svg" id="loadbrowsedirlist" title="Delete"  title="Delete" dir-val="' + val.Id + '" dir-name="' + val.Name + '" /></a>');
                $row4.append($('<td/>').html($remove4));
                $tbody4.append($row4);
                $table4.append($tbody4);
                $('#BrowseSelectedlist').html($table4);
            });
        }
        else {
            $('#BrowseSelectedlist').html('');
        }
    }
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Save new case file*/
    $("#savecasefilenew").click(function () {
        var comparesize = 0;
        var filename = "";
        try {
            var fileUpload = document.getElementById("attachment");
            if (typeof (fileUpload.files) != "undefined") {
                var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
                comparesize = size;
                if (size > 10485760) {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Document size greater than 10 MB cannot be accepted',
                        type: 'error',
                        delay: 3000
                    });
                    return false
                }
            }
        }
        catch (err) {
            //alert(err.message);
        }
        var formData = new FormData();
        var tempsize = 0;
        var totalFiles = document.getElementById("attachment").files.length;
        if (parseInt(totalFiles) > 1) {
            alert("Please select one document only.");
            return false;
        }
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachment").files[i];
            filename = file.name;
            if (filename.length > 100) {
                alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                return false;
            }
            var fext = filename.substr(filename.length - 4, 4).toLowerCase();
            if (fext != ".pdf") {
                alert("Only PDF Allowed.");
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
        if (tempsize > 10485760) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 10MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
        try {
            var mykasefileiddsign = $("#mykasefileiddsign").val();
            if (String(mykasefileiddsign) == "undefined") {
                mykasefileiddsign = "";
            }
            if (String(file) == "undefined") {
                file = "";
            }
            formData.append("savemykasefileid", EncodeText(mykasefileiddsign));
            if (mykasefileiddsign == "" && file == "") {
                alert("Please select docuemnt.");
                return false;
            }
            if (mykasefileiddsign != "" && file != "") {
                alert("Please select one document only.");
                return false;
            }
            var count = mykasefileiddsign;
            var count = count.split(',').length;
            if (parseInt(count) > 1) {
                alert("Please select one document only.");
                return false;
            }
            //open modal
            var DriveType = "";
            if (file != "") {
                DriveType = "";
                formData.append("DriveType", EncodeText(""));
            }
            if (mykasefileiddsign != "") {
                DriveType = "MykaseDrive";
                formData.append("DriveType", EncodeText(DriveType));
            }
            if (DriveType == "MykaseDrive") {
                formData.append("token", EncodeText(mykasefileiddsign));
                openload();
                $.ajax({
                    async: true,
                    url: '/api/AzureApi/FileDeatils',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        $.each(response, function (i, a) {
                            if (a.filetype != ".pdf") {
                                alert("Only PDF Allowed.");
                                return false;
                            }
                            else {
                                $("#editfilename").text(a.fname);
                                $("#editfilenamehidden").val(mykasefileiddsign);
                                $("#filedetailsedit").val(a.fdetails);
                                $("#modal_e_sign_type").modal();
                            }
                        });
                        closeload();
                    },
                    error: function (response) {
                        alert(response.responseText);
                        closeload();
                    }
                });
            }
            else {
                formData.append("token", EncodeText(""));
                openload();
                $.ajax({
                    async: true,
                    url: '/api/AzureApi/FileDeatils',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        if (response.Data == "FileSizeExceed") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Maximum File size 10MB Allowed for each File',
                                type: 'error',
                                delay: 3000
                            });
                            return false
                        }
                        else {
                            $("#filefullpath").val(response);
                            $("#editfilenamehidden").val("");
                            $("#filedetailsedit").val("");
                            $("#modal_e_sign_type").modal();
                        }
                        closeload();
                    },
                    error: function (response) {
                        alert(response.responseText);
                        closeload();
                    }
                });
            }
        }
        catch (msg) {
        }
    });

    /*Digital save file*/
    $("#DigiFileSaves").click(function () {
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
        if ($("#editfilenamehidden").val() == "") {
            sessionStorage.setItem("docname", "");
        }
        else {
            sessionStorage.setItem("docname", "MykaseDrive");
        }
        sessionStorage.setItem("digifilename", "");
        sessionStorage.setItem("signtype", selecttype);
        sessionStorage.setItem("docid", $("#editfilenamehidden").val());
        sessionStorage.setItem("username", "");
        sessionStorage.setItem("selectpageval", selectpageval);
        sessionStorage.setItem("userid", "");
        var fcode = localStorage.getItem("FirmCode");
        var urls = "/Azure/GetSigncopy";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": $("#editfilenamehidden").val(), "filepath": $("#filefullpath").val() }
        });
    });
    LoadContent();
    function LoadContent() {
        var formData = new FormData();
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/AzureApi/DigitalSignDocList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response)
                var obj1 = response;
                var html_con = "<tr><th>Document Name</th><th>Created date </th><th>Signed by</th><th>download</th></tr> ";
                $.each(obj1, function (i, a) {
                    html_con += "<tr>";
                    var filename = a.FileName;
                    filename = filename.replace(/^\s*/, "").replace(/\s*$/, "");
                    dfilename = String(filename).substring(filename.lastIndexOf("/") + 1);
                    var idx = String(dfilename).lastIndexOf(".");
                    if (idx != -1)
                        string1 = dfilename.substring(0, idx);
                    string2 = dfilename.substring(idx + 1);
                    string1 = string1.substring(0, string1.length - 10);
                    dfilename = string1 + "." + string2;
                    html_con += '<td>' + dfilename + '</td>';
                    html_con += "<td>" + formatDatetoIST(a.CreatedDate) + " </td>";
                    html_con += '<td>' + a.CreatedBy + '</td>';
                    html_con += '<td><div class="fa fa-file-pdf-o"  title="Download Document"';
                    html_con += `onclick = "download_pdf('` + a.Id + `', '` + a.UserId + `', '` + a.FirmId + `', '` + a.Docnumber + `' );"`;
                    html_con += 'style="color: red;cursor:pointer;"></div></td>';
                    html_con += "</tr> ";
                });
                $("#dv_download_pdf").html(html_con);
                closeload();
            },
            failure: function (response) {
                alert(response.responseText);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
});
function download_pdf(id, userid, firmid, docid) {
    window.location = encodeURI("/DownloadFile.ashx?module=EsignDocument&id=" + id.trim() + "&userid=" + userid.trim() + "&firmid=" + firmid.trim() + "&docid=" + docid.trim());
}
function formatDatetoIST(date) {
    if (date == "1900-01-01T00:00:00" || date == "1900-01-01" || date == "") {
        return "";
    }
    else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
        return formatted_date;
    }
}
function url_redirect(options) {
    validnavigation = true;
    window.onbeforeunload = null;
    var $form = $("<form />");
    $form.attr("action", options.url);
    $form.attr("method", options.method);
    for (var data in options.data)
        $form.append('<input type="hidden" name="' + data + '" value="' + options.data[data] + '" />');
    $("body").append($form);
    $form.submit();
}