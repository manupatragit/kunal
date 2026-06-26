
function showUploadChip(text) {
    var p = document.getElementById("file-name");
    if (!p) return;

    if (!text) {
        p.innerHTML = "";
        return;
    }

    p.innerHTML =
        '<span style="display:inline-flex;align-items:center;gap:10px;background:#f4f4f4;padding:6px 10px;border-radius:5px;">' +
        '<span style="font-size:14px;color:#333;">' + text + '</span>' +
        '<span id="uploadBoxDeleteX" style="color:red;cursor:pointer;font-weight:bold;">✖</span>' +
        '</span>';
}

function clearUploadChip() {
    showUploadChip("");
}


function fileValidation(evt) {
    var input = (evt && evt.target) ? evt.target : document.getElementById("attachment");

    // If user picked Local, clear MyKase token to avoid "select one document only"
    var mk = document.getElementById("mykasefileiddsign");
    if (mk) mk.value = "";

    if (input && input.files && input.files.length > 0) {
        showUploadChip(input.files[0].name);
    } else {
        clearUploadChip();
    }
    return true;
}


document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "uploadBoxDeleteX") {
        var input = document.getElementById("attachment");
        if (input) input.value = "";

        var mk = document.getElementById("mykasefileiddsign");
        if (mk) mk.value = "";

        clearUploadChip();
    }
});

function parseMyKaseNamesFromTitle(title) {
    if (!title) return null;
    var key = "FileName:";
    var idx = title.indexOf(key);
    if (idx === -1) return null;

    var jsonPart = title.substring(idx + key.length).trim();
    try {
        var arr = JSON.parse(jsonPart);
        return Array.isArray(arr) ? arr : null;
    } catch (e) {
        return null;
    }
}

function buildMyKaseChipText() {
    var mk = document.getElementById("mykasefileiddsign");
    var token = mk ? (mk.value || "").trim() : "";
    if (!token) return "";

    var browse = document.getElementById("browsefiledsign");
    var title = browse ? (browse.getAttribute("title") || "") : "";

    var names = parseMyKaseNamesFromTitle(title);
    if (names && names.length) {
        return (names.length > 1) ? (names.length + " files selected") : names[0];
    }

    // fallback: use token count
    var cnt = token.split(",").filter(Boolean).length;
    if (cnt > 1) return cnt + " files selected";
    return "1 file selected";
}

function syncChipFromMyKaseDsign() {
    var text = buildMyKaseChipText();

    if (text) {
        // If MyKase selected, clear Local input so Process doesn't think 2 docs
        var input = document.getElementById("attachment");
        if (input) input.value = "";

        showUploadChip(text);
    } else {
        // Only clear chip if Local also empty
        var input2 = document.getElementById("attachment");
        var hasLocal = input2 && input2.files && input2.files.length > 0;
        if (!hasLocal) clearUploadChip();
    }
}

if (window.jQuery) {
    // (1) when MyKase modal closes
    $(document).on("hidden.bs.modal", "#myModalbrowsedocs", function () {
        setTimeout(syncChipFromMyKaseDsign, 50);
    });

    // (2) cancel clears chip
    $(document).on("click", ".cancelbrowse", function () {
        setTimeout(syncChipFromMyKaseDsign, 50);
    });

    // (3) if confirm button exists in some pages
    $(document).on("click", "#Openbrowsefolder", function () {
        setTimeout(syncChipFromMyKaseDsign, 50);
    });
}


$(document).ready(function () {
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    /*Save new case file details*/
    $("#savecasefilenew").click(function () {
        var comparesize = 0;
        var filename = "";
        try {
            var fileUpload = document.getElementById("attachment");
            if (typeof (fileUpload.files) != "undefined") {
                var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
                comparesize = size;
                if (size > newfilesize) {
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
            var fileNameIndex = filename.lastIndexOf("/") + 1;
            var dotIndex = filename.lastIndexOf('.');
            var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
            var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
            if (reg.test(newfioename) == true) {
                alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
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
        if (tempsize > newfilesize) {
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
                alert("Please select document.");
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
                        var obj = JSON.parse(response.Data);
                        $.each(obj, function (i, a) {
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
                            $("#filefullpath").val(response.Data);
                            $("#editfilenamehidden").val("");
                            $("#filedetailsedit").val("");
                            $("#modal_e_sign_type").modal();
                        }
                        // alert(urldropbox);
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
    /*Save digital files*/
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
        var urls = "/" + fcode + "/Azure/GetSigncopy";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": $("#editfilenamehidden").val(), "filepath": $("#filefullpath").val() }
        });
    });
    LoadContent();
    /*Load content details*/
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
                var datas1 = JSON.stringify(response);
                var obj1 = JSON.parse(response.Data);
                var html_con = "<tr><th vertical-align='middle'><div class='thbg'>Document Name</div></th><th><div class='thbg'>Created date</div> </th><th><div class='thbg'>Signed by</div></th><th><div style='text-align: center;' class='thbg'>Download</div></th></tr> ";
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
                    html_con += "<td><div class='file_wrapper'><img src='/newassets/img/pdf-icon.png'> " + dfilename + "</div></td>";
                    html_con += "<td>" + formatDatetoIST(a.CreatedDate) + "</td>";
                    html_con += '<td>' + a.CreatedBy + '</td>';
                    html_con += '<td><ul class="table_action" style="justify-content:flex-start;"><li><div class="taskoutboxbtnicon" title="Download Document"';
                    html_con += `onclick = "download_pdf('` + a.Id + `', '` + a.UserId + `', '` + a.FirmId + `', '` + a.Docnumber + `' );"`;
                    html_con += 'style="color: red;cursor:pointer;"><img src="/newassets/img/download.svg" /></div></td>';
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
/*Download esign document*/
function download_pdf(id, userid, firmid, docid) {
    window.location = encodeURI("/DownloadFile.ashx?module=EsignDocument&id=" + id.trim() + "&userid=" + userid.trim() + "&firmid=" + firmid.trim() + "&docid=" + docid.trim());
}
